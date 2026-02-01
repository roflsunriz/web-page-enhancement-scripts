/**
 * フェッチコントローラー
 *
 * - 並列5件制限
 * - キュー管理
 * - 逐次描画トリガー
 */

import { createLogger } from "@/shared/logger";
import type {
  CacheEntry,
  AnimeCard,
  NicoMetrics,
} from "@/shared/types/d-anime-cf-ranking";
import { MAX_CONCURRENT_FETCHES } from "@/shared/types/d-anime-cf-ranking";
import { normalizeTitle } from "./title-normalizer";
import { NicoApiClient } from "./nico-api-client";
import { selectRepresentativeVideo } from "./representative-selector";
import {
  getCacheEntry,
  setCacheEntry,
  isCacheValid,
  createPendingEntry,
  markEntrySuccess,
  markEntryFailed,
} from "./cache-manager";

const logger = createLogger("dAnimeCfRanking:FetchController");

// =============================================================================
// 型定義
// =============================================================================

/** フェッチリクエスト */
interface FetchRequest {
  title: string;
  canonicalQuery: string;
  resolve: (entry: CacheEntry) => void;
  reject: (error: Error) => void;
}

/** フェッチ完了コールバック */
type FetchCompleteCallback = (title: string, entry: CacheEntry) => void;

// =============================================================================
// フェッチコントローラークラス
// =============================================================================

export class FetchController {
  private queue: FetchRequest[] = [];
  private activeCount = 0;
  private maxConcurrent = MAX_CONCURRENT_FETCHES;
  private apiClient: NicoApiClient;
  private onComplete: FetchCompleteCallback | null = null;
  private processing = new Set<string>();

  constructor() {
    this.apiClient = new NicoApiClient();
  }

  /**
   * フェッチ完了時のコールバックを設定する
   */
  setOnComplete(callback: FetchCompleteCallback): void {
    this.onComplete = callback;
  }

  /**
   * 作品の指標をフェッチする（キャッシュ優先）
   * @param title 作品タイトル
   * @param forceRefresh キャッシュを無視して再取得するか
   * @returns CacheEntry
   */
  async fetch(title: string, forceRefresh = false): Promise<CacheEntry> {
    const canonicalQuery = normalizeTitle(title);

    // キャッシュチェック
    if (!forceRefresh) {
      const cached = await getCacheEntry(title);
      if (cached && isCacheValid(cached)) {
        logger.debug("Cache hit", { title });
        return cached;
      }
    }

    // 既に処理中の場合は待機
    if (this.processing.has(title)) {
      return new Promise((resolve, reject) => {
        this.queue.push({ title, canonicalQuery, resolve, reject });
      });
    }

    // キューに追加
    return new Promise((resolve, reject) => {
      this.queue.push({ title, canonicalQuery, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * 複数作品をバッチでフェッチする
   * @param cards 作品カード配列
   * @returns CacheEntry配列
   */
  async fetchBatch(cards: AnimeCard[]): Promise<CacheEntry[]> {
    const promises = cards.map((card) => this.fetch(card.title));
    return Promise.all(promises);
  }

  /**
   * キューを処理する
   */
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const request = this.queue.shift();
      if (!request) break;

      // 既に処理中の場合はスキップ（後で再度キューに入る）
      if (this.processing.has(request.title)) {
        this.queue.push(request);
        continue;
      }

      this.processing.add(request.title);
      this.activeCount++;

      this.executeRequest(request)
        .then((entry) => {
          request.resolve(entry);
          if (this.onComplete) {
            this.onComplete(request.title, entry);
          }
        })
        .catch((error) => {
          request.reject(error as Error);
        })
        .finally(() => {
          this.activeCount--;
          this.processing.delete(request.title);
          this.processQueue();
        });
    }
  }

  /**
   * 単一のフェッチリクエストを実行する
   */
  private async executeRequest(request: FetchRequest): Promise<CacheEntry> {
    const { title, canonicalQuery } = request;

    // pending状態でキャッシュに保存
    const pendingEntry = createPendingEntry(title, canonicalQuery);
    await setCacheEntry(pendingEntry);

    try {
      // 1. タイトルで検索
      const searchResults = await this.apiClient.search(canonicalQuery);

      if (searchResults.length === 0) {
        // 正規化前のタイトルでも検索
        const originalResults = await this.apiClient.search(title);
        if (originalResults.length === 0) {
          const failedEntry = markEntryFailed(
            pendingEntry,
            "検索結果が0件です"
          );
          await setCacheEntry(failedEntry);
          return failedEntry;
        }
        // 正規化前の結果を使用
        return this.processSearchResults(pendingEntry, originalResults, title);
      }

      return this.processSearchResults(pendingEntry, searchResults, title);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Fetch request failed", error as Error, { title });

      const failedEntry = markEntryFailed(pendingEntry, errorMessage);
      await setCacheEntry(failedEntry);
      return failedEntry;
    }
  }

  /**
   * 検索結果を処理して代表動画を選択し、指標を取得する
   */
  private async processSearchResults(
    pendingEntry: CacheEntry,
    searchResults: import("./nico-api-client").NicoSearchResultItem[],
    animeTitle: string
  ): Promise<CacheEntry> {
    // 2. 代表動画を選択
    const selection = selectRepresentativeVideo(
      searchResults,
      animeTitle,
      NicoApiClient
    );

    if (!selection.success || !selection.video) {
      const failedEntry = markEntryFailed(
        pendingEntry,
        selection.failureReason ?? "代表動画の選択に失敗しました"
      );
      await setCacheEntry(failedEntry);
      return failedEntry;
    }

    const representativeVideo = NicoApiClient.toRepresentativeVideo(
      selection.video,
      animeTitle
    );

    // 3. 指標を取得（検索結果に含まれる場合はそれを使用）
    let metrics: NicoMetrics = {
      viewCount: selection.video.viewCount,
      mylistCount: selection.video.mylistCount,
      commentCount: selection.video.commentCount,
      likeCount: selection.video.likeCount,
    };

    // いいね数が0の場合は視聴ページから取得を試みる
    if (metrics.likeCount === 0) {
      const fetchedMetrics = await this.apiClient.fetchMetrics(
        selection.video.videoId
      );
      if (fetchedMetrics) {
        metrics = fetchedMetrics;
      }
    }

    // 4. 成功としてキャッシュに保存
    const successEntry = markEntrySuccess(pendingEntry, {
      representativeVideoId: selection.video.videoId,
      representativeVideo,
      metrics,
    });
    await setCacheEntry(successEntry);

    logger.info("Fetch completed", {
      title: pendingEntry.title,
      videoId: selection.video.videoId,
      metrics,
    });

    return successEntry;
  }

  /**
   * キューをクリアする
   */
  clearQueue(): void {
    const pendingRequests = [...this.queue];
    this.queue = [];

    for (const request of pendingRequests) {
      request.reject(new Error("Queue cleared"));
    }

    logger.info("Queue cleared", { count: pendingRequests.length });
  }

  /**
   * 現在のキュー状態を取得する
   */
  getStatus(): { queueLength: number; activeCount: number } {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeCount,
    };
  }
}

/**
 * FetchControllerのシングルトンインスタンスを作成する
 */
export function createFetchController(): FetchController {
  return new FetchController();
}
