/**
 * ニコニコ動画API連携
 *
 * - タイトル検索（検索ページのserver-responseから取得）
 * - 視聴ページから4指標取得（view/mylist/comment/like）
 * - 投稿者名ガード（dアニメ支店 vs 作品タイトル投稿者）
 */

import { createLogger } from "@/shared/logger";
import { buildNicovideoSearchUrl, buildNicovideoWatchUrl } from "@/shared/constants/urls";
import { gmRequest } from "@/shared/network/gmHttp";
import type {
  NicoMetrics,
  RepresentativeVideo,
  UploaderType,
} from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:NicoApiClient");

// =============================================================================
// 型定義
// =============================================================================

/** 検索結果アイテム */
export interface NicoSearchResultItem {
  /** 動画ID（so~, sm~） */
  videoId: string;
  /** 動画タイトル */
  title: string;
  /** 再生数 */
  viewCount: number;
  /** コメント数 */
  commentCount: number;
  /** マイリスト数 */
  mylistCount: number;
  /** いいね数 */
  likeCount: number;
  /** サムネイルURL */
  thumbnail: string;
  /** 投稿日時（ISO8601） */
  postedAt: string;
  /** 投稿者名 */
  ownerName: string;
  /** 投稿者種別 */
  ownerType: "channel" | "user";
}

/** 検索APIレスポンスのアイテム（内部用） */
interface NicoSearchApiItem {
  id?: string;
  contentId?: string;
  watchId?: string;
  title?: string;
  shortTitle?: string;
  count?: {
    view?: number;
    comment?: number;
    mylist?: number;
    like?: number;
  };
  viewCounter?: number;
  commentCounter?: number;
  mylistCounter?: number;
  likeCounter?: number;
  thumbnail?: {
    nHdUrl?: string;
    listingUrl?: string;
    largeUrl?: string;
    middleUrl?: string;
    url?: string;
  };
  thumbnailUrl?: string;
  registeredAt?: string;
  startTime?: string;
  postedDateTime?: string;
  owner?: {
    nickname?: string;
    name?: string;
    ownerType?: string;
  } | null;
  channel?: {
    name?: string;
  } | null;
  isChannelVideo?: boolean;
}

/** server-responseラッパー */
interface ServerResponseWrapper {
  data?: unknown;
}

// =============================================================================
// 定数
// =============================================================================

/** dアニメストア公式チャンネル名 */
const DANIME_OFFICIAL_CHANNEL = "dアニメストア ニコニコ支店";

// =============================================================================
// ニコニコAPI クライアント
// =============================================================================

export class NicoApiClient {
  private readonly searchCache = new Map<string, NicoSearchResultItem[]>();

  /**
   * タイトルで動画を検索する
   * @param keyword 検索キーワード
   * @returns 検索結果
   */
  async search(keyword: string): Promise<NicoSearchResultItem[]> {
    if (!keyword.trim()) {
      return [];
    }

    // キャッシュチェック
    if (this.searchCache.has(keyword)) {
      return this.searchCache.get(keyword) ?? [];
    }

    try {
      const url = buildNicovideoSearchUrl(keyword);
      const html = await this.fetchText(url);
      const items = this.parseServerResponse(html);

      // 重複除去
      const unique = this.deduplicateItems(items);

      // キャッシュに保存
      this.searchCache.set(keyword, unique);

      logger.debug("Search completed", { keyword, resultCount: unique.length });
      return unique;
    } catch (error) {
      logger.error("Search failed", error as Error, { keyword });
      return [];
    }
  }

  /**
   * 動画IDから詳細情報（4指標）を取得する
   * @param videoId 動画ID
   * @returns 指標データ
   */
  async fetchMetrics(videoId: string): Promise<NicoMetrics | null> {
    try {
      const url = buildNicovideoWatchUrl(videoId);
      const html = await this.fetchText(url);
      const metrics = this.parseWatchPageMetrics(html);

      if (!metrics) {
        logger.warn("Failed to parse metrics from watch page", { videoId });
        return null;
      }

      logger.debug("Metrics fetched", { videoId, metrics });
      return metrics;
    } catch (error) {
      logger.error("Failed to fetch metrics", error as Error, { videoId });
      return null;
    }
  }

  /**
   * 投稿者種別を判定する
   * @param ownerName 投稿者名
   * @param animeTitle アニメタイトル
   * @returns 投稿者種別
   */
  static determineUploaderType(
    ownerName: string,
    animeTitle: string
  ): UploaderType {
    // 「dアニメストア ニコニコ支店」
    if (ownerName === DANIME_OFFICIAL_CHANNEL) {
      return "danime";
    }

    // アニメタイトル完全一致
    if (ownerName === animeTitle) {
      return "official";
    }

    // アニメタイトル + 接尾語
    if (ownerName.startsWith(animeTitle + " ")) {
      return "official";
    }

    return "unknown";
  }

  /**
   * 検索結果を公式動画のみにフィルタリングする
   * @param results 検索結果
   * @param animeTitle アニメタイトル
   * @returns 公式動画のみの配列
   */
  static filterOfficialVideos(
    results: NicoSearchResultItem[],
    animeTitle: string
  ): NicoSearchResultItem[] {
    return results.filter((item) => {
      const uploaderType = NicoApiClient.determineUploaderType(
        item.ownerName,
        animeTitle
      );
      return uploaderType === "danime" || uploaderType === "official";
    });
  }

  /**
   * 検索結果からRepresentativeVideoを作成する
   */
  static toRepresentativeVideo(
    item: NicoSearchResultItem,
    animeTitle: string
  ): RepresentativeVideo {
    return {
      videoId: item.videoId,
      title: item.title,
      postedAt: item.postedAt,
      uploaderType: NicoApiClient.determineUploaderType(
        item.ownerName,
        animeTitle
      ),
      uploaderName: item.ownerName,
    };
  }

  // =============================================================================
  // プライベートメソッド
  // =============================================================================

  private async fetchText(url: string): Promise<string> {
    const response = await gmRequest({
      method: "GET",
      url,
      headers: { Accept: "text/html" },
    });
    return response.response as string;
  }

  private parseServerResponse(html: string): NicoSearchResultItem[] {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = doc.querySelector('meta[name="server-response"]');
      if (!meta) {
        logger.warn("server-response meta not found");
        return [];
      }

      const content = meta.getAttribute("content") ?? "";
      const decoded = this.decodeHtmlEntities(content);

      let data: ServerResponseWrapper;
      try {
        data = JSON.parse(decoded) as ServerResponseWrapper;
      } catch {
        logger.error("Failed to parse server-response JSON");
        return [];
      }

      return this.extractVideoItems(data);
    } catch (error) {
      logger.error("parseServerResponse failed", error as Error);
      return [];
    }
  }

  private parseWatchPageMetrics(html: string): NicoMetrics | null {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = doc.querySelector('meta[name="server-response"]');
      if (!meta) {
        return null;
      }

      const content = meta.getAttribute("content") ?? "";
      const decoded = this.decodeHtmlEntities(content);

      interface WatchApiData {
        data?: {
          response?: {
            video?: {
              count?: {
                view?: number;
                mylist?: number;
                comment?: number;
                like?: number;
              };
            };
          };
        };
      }

      const data = JSON.parse(decoded) as WatchApiData;
      const video = data?.data?.response?.video;
      const count = video?.count;

      if (!count) {
        return null;
      }

      return {
        viewCount: count.view ?? 0,
        mylistCount: count.mylist ?? 0,
        commentCount: count.comment ?? 0,
        likeCount: count.like ?? 0,
      };
    } catch (error) {
      logger.error("parseWatchPageMetrics failed", error as Error);
      return null;
    }
  }

  private decodeHtmlEntities(str: string): string {
    if (!str) return "";
    let s = str
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    s = s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
    s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
    return s;
  }

  private extractVideoItems(root: unknown): NicoSearchResultItem[] {
    const results: NicoSearchResultItem[] = [];

    const pushItem = (o: NicoSearchApiItem): void => {
      const videoId = (o?.id ?? o?.contentId ?? o?.watchId ?? "").toString();
      if (!videoId) return;

      const title = (o?.title ?? o?.shortTitle ?? "").toString();
      if (!title) return;

      const count = o?.count ?? {};
      const viewCount = Number(count.view ?? o?.viewCounter ?? 0) || 0;
      const commentCount = Number(count.comment ?? o?.commentCounter ?? 0) || 0;
      const mylistCount = Number(count.mylist ?? o?.mylistCounter ?? 0) || 0;
      const likeCount = Number(count.like ?? o?.likeCounter ?? 0) || 0;

      const thumbObj = o?.thumbnail ?? {};
      const thumbnail = (
        thumbObj.nHdUrl ||
        thumbObj.listingUrl ||
        thumbObj.largeUrl ||
        thumbObj.middleUrl ||
        thumbObj.url ||
        o?.thumbnailUrl ||
        ""
      ).toString();

      const postedAt =
        (o?.registeredAt || o?.startTime || o?.postedDateTime || "")?.toString?.() ?? "";

      // 投稿者名の取得
      let ownerName = "";
      let ownerType: "channel" | "user" = "user";

      if (o?.channel?.name) {
        ownerName = o.channel.name;
        ownerType = "channel";
      } else if (o?.owner) {
        ownerName = o.owner.name ?? o.owner.nickname ?? "";
        ownerType = o.owner.ownerType === "channel" ? "channel" : "user";
      }

      if (o?.isChannelVideo) {
        ownerType = "channel";
      }

      results.push({
        videoId,
        title,
        viewCount,
        commentCount,
        mylistCount,
        likeCount,
        thumbnail,
        postedAt,
        ownerName,
        ownerType,
      });
    };

    const traverse = (obj: unknown): void => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        obj.forEach(traverse);
        return;
      }
      if (typeof obj !== "object" || obj === null) return;

      const item = obj as NicoSearchApiItem;
      if (item.id || item.contentId || item.watchId) {
        pushItem(item);
      }
      Object.values(obj).forEach(traverse);
    };

    traverse(root);
    return results;
  }

  private deduplicateItems(items: NicoSearchResultItem[]): NicoSearchResultItem[] {
    const seen = new Set<string>();
    const unique: NicoSearchResultItem[] = [];

    for (const item of items) {
      if (!item.videoId) continue;
      if (!seen.has(item.videoId)) {
        seen.add(item.videoId);
        unique.push(item);
      }
    }

    return unique;
  }
}
