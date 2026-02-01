/**
 * d-anime-cf-ranking
 *
 * dアニメストアのCFページ（クール別ページ）上の作品カードに、
 * ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示する
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard, CacheEntry } from "@/shared/types/d-anime-cf-ranking";
import { RECALCULATE_THROTTLE_MS } from "@/shared/types/d-anime-cf-ranking";

// 設定
import { getSettings, registerMenuCommands } from "./config/settings";

// キャッシュ
import { initDatabase } from "./services/cache-manager";

// DOM操作
import {
  detectAllCards,
  createCardObserver,
  startCardObserver,
  filterUnprocessedCards,
  markBadgeInserted,
} from "./dom/card-detector";

// ビューポート監視
import { createViewportObserver, ViewportObserver } from "./dom/viewport-observer";

// フェッチ制御
import { createFetchController, FetchController } from "./services/fetch-controller";

// スコア計算
import { calculateRanks, type ScoreInput } from "./services/score-calculator";

// UI
import { createLoadingBadge, updateBadge } from "./ui/rank-badge";

const logger = createLogger("dAnimeCfRanking");

// =============================================================================
// グローバル状態
// =============================================================================

/** 検出された全カード */
let allCards: AnimeCard[] = [];

/** カードタイトル → キャッシュエントリのマップ */
const cacheEntryMap = new Map<string, CacheEntry>();

/** カードタイトル → バッジ要素のマップ */
const badgeMap = new Map<string, HTMLElement>();

/** ビューポートオブザーバー */
let viewportObserver: ViewportObserver | null = null;

/** フェッチコントローラー */
let fetchController: FetchController | null = null;

/** MutationObserver */
let cardObserver: MutationObserver | null = null;

/** 順位再計算のスロットルタイマー */
let recalculateTimer: ReturnType<typeof setTimeout> | null = null;

/** 順位再計算がペンディング中かどうか */
let recalculatePending = false;

// =============================================================================
// メイン処理
// =============================================================================

/**
 * アプリケーションのメインエントリポイント
 */
async function main(): Promise<void> {
  logger.info("d-anime-cf-ranking starting...");

  // 設定チェック
  const settings = getSettings();
  if (!settings.enabled) {
    logger.info("Ranking display is disabled");
    return;
  }

  // Tampermonkeyメニュー登録
  registerMenuCommands();

  // IndexedDB初期化
  await initDatabase();

  // コントローラー初期化
  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);

  viewportObserver = createViewportObserver();
  viewportObserver.start(handleViewportChange);

  // 初回カード検出
  allCards = detectAllCards();
  logger.info("Initial cards detected", { count: allCards.length });

  // 全カードにローディングバッジを挿入
  insertLoadingBadges(allCards);

  // ビューポート監視開始
  viewportObserver.observeAll(allCards);

  // 動的カード監視開始
  cardObserver = createCardObserver(handleNewCards);
  startCardObserver(cardObserver);

  logger.info("d-anime-cf-ranking initialized");
}

// =============================================================================
// イベントハンドラー
// =============================================================================

/**
 * ビューポート内カードが変わったときのハンドラー
 */
function handleViewportChange(visibleCards: AnimeCard[]): void {
  logger.debug("Viewport changed", { visibleCount: visibleCards.length });

  // 未取得のカードのみをフェッチ
  const cardsToFetch = visibleCards.filter((card) => {
    const cached = cacheEntryMap.get(card.title);
    return !cached || cached.status === "pending";
  });

  if (cardsToFetch.length > 0 && fetchController) {
    fetchController.fetchBatch(cardsToFetch).catch((error) => {
      logger.error("Batch fetch failed", error as Error);
    });
  }
}

/**
 * フェッチ完了時のハンドラー
 */
function handleFetchComplete(title: string, entry: CacheEntry): void {
  // キャッシュマップを更新
  cacheEntryMap.set(title, entry);

  // 順位を再計算（スロットル化）
  scheduleRecalculateRanks();
}

/**
 * 順位再計算をスロットル化してスケジュールする
 */
function scheduleRecalculateRanks(): void {
  recalculatePending = true;

  if (recalculateTimer !== null) {
    return; // 既にスケジュール済み
  }

  recalculateTimer = setTimeout(() => {
    recalculateTimer = null;
    if (recalculatePending) {
      recalculatePending = false;
      recalculateRanks();
    }
  }, RECALCULATE_THROTTLE_MS);
}

/**
 * 新しいカードが追加されたときのハンドラー
 */
function handleNewCards(newCards: AnimeCard[]): void {
  logger.debug("New cards added", { count: newCards.length });

  // グローバルリストに追加
  allCards = [...allCards, ...newCards];

  // ローディングバッジを挿入
  insertLoadingBadges(newCards);

  // ビューポート監視に追加
  if (viewportObserver) {
    viewportObserver.observeAll(newCards);
  }
}

// =============================================================================
// UI操作
// =============================================================================

/**
 * カードにローディングバッジを挿入する
 */
function insertLoadingBadges(cards: AnimeCard[]): void {
  const unprocessed = filterUnprocessedCards(cards);

  for (const card of unprocessed) {
    if (!card.insertionPoint) {
      logger.warn("No insertion point for card", { title: card.title });
      continue;
    }

    const badge = createLoadingBadge(card.title);
    card.insertionPoint.parentElement?.insertBefore(badge, card.insertionPoint);

    badgeMap.set(card.title, badge);
    markBadgeInserted(card.element);
  }

  logger.debug("Loading badges inserted", { count: unprocessed.length });
}

/**
 * 順位を再計算してバッジを更新する
 */
function recalculateRanks(): void {
  // スコア計算用の入力を準備
  const scoreInputs: ScoreInput[] = allCards.map((card) => {
    const entry = cacheEntryMap.get(card.title);
    return {
      title: card.title,
      metrics: entry?.status === "ok" ? entry.metrics : null,
    };
  });

  // 順位計算
  const rankOutputs = calculateRanks(scoreInputs);

  // バッジを更新
  for (const output of rankOutputs) {
    const badge = badgeMap.get(output.title);
    const entry = cacheEntryMap.get(output.title);

    if (!badge || !entry) continue;

    // pending状態の場合はスキップ（ローディング表示のまま）
    if (entry.status === "pending") continue;

    updateBadge(badge, output.rankData, entry, handleRetry);
  }

  logger.debug("Ranks recalculated", {
    total: allCards.length,
    ranked: rankOutputs.filter((o) => o.rankData !== null).length,
  });
}

/**
 * リトライボタンが押されたときのハンドラー
 */
function handleRetry(title: string): void {
  logger.info("Retry requested", { title });

  if (!fetchController) return;

  // 強制再取得
  fetchController.fetch(title, true).catch((error) => {
    logger.error("Retry fetch failed", error as Error, { title });
  });
}

// =============================================================================
// スクリプト実行
// =============================================================================

main().catch((error: unknown) => {
  logger.error("d-anime-cf-ranking failed to initialize", error as Error);
});
