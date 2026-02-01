/**
 * d-anime-cf-ranking
 *
 * dアニメストアのCFページ（クール別ページ）上の作品カードに、
 * ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示する
 *
 * v1.0.3 - デバッグ版（問題切り分け用）
 */

import type { AnimeCard, CacheEntry } from "@/shared/types/d-anime-cf-ranking";
import { RECALCULATE_THROTTLE_MS } from "@/shared/types/d-anime-cf-ranking";

// 設定
import { getSettings, registerMenuCommands } from "./config/settings";

// キャッシュ
import { initDatabase } from "./services/cache-manager";

// DOM操作
import {
  detectAllCards,
  filterUnprocessedCards,
  markBadgeInserted,
} from "./dom/card-detector";

// フェッチ制御
import { createFetchController, FetchController } from "./services/fetch-controller";

// スコア計算
import { calculateRanks, type ScoreInput } from "./services/score-calculator";

// UI
import { createLoadingBadge, updateBadge } from "./ui/rank-badge";

// =============================================================================
// デバッグ用ログ（軽量）
// =============================================================================

const DEBUG = true;
const log = (msg: string, data?: unknown) => {
  if (DEBUG) console.log(`[cf-ranking] ${msg}`, data ?? "");
};

// =============================================================================
// グローバル状態
// =============================================================================

/** 検出された全カード */
let allCards: AnimeCard[] = [];

/** カードタイトル → キャッシュエントリのマップ */
const cacheEntryMap = new Map<string, CacheEntry>();

/** カードタイトル → バッジ要素のマップ */
const badgeMap = new Map<string, HTMLElement>();

/** フェッチコントローラー */
let fetchController: FetchController | null = null;

/** 順位再計算のスロットルタイマー */
let recalculateTimer: ReturnType<typeof setTimeout> | null = null;

/** 順位再計算がペンディング中かどうか */
let recalculatePending = false;

/** フェッチ中のカードタイトルSet */
const fetchingTitles = new Set<string>();

// =============================================================================
// メイン処理
// =============================================================================

/**
 * アプリケーションのメインエントリポイント
 */
async function main(): Promise<void> {
  log("Starting...");

  // 設定チェック
  const settings = getSettings();
  if (!settings.enabled) {
    log("Disabled by settings");
    return;
  }

  // Tampermonkeyメニュー登録
  registerMenuCommands();

  // IndexedDB初期化
  try {
    await initDatabase();
    log("IndexedDB initialized");
  } catch (e) {
    log("IndexedDB init failed", e);
  }

  // フェッチコントローラー初期化
  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);

  // カード検出
  allCards = detectAllCards();
  log(`Detected ${allCards.length} cards`);

  if (allCards.length === 0) {
    log("No cards found, exiting");
    return;
  }

  // バッジ挿入（同期的だが軽量）
  insertLoadingBadges(allCards);
  log("Badges inserted");

  // 初期フェッチ（最初の10件のみ、1秒後に開始）
  setTimeout(() => {
    log("Starting initial fetch...");
    fetchVisibleCards();
  }, 1000);

  log("Initialization complete");
}

// =============================================================================
// フェッチ処理
// =============================================================================

/**
 * ビューポート内（上位10件）のカードをフェッチする
 */
function fetchVisibleCards(): void {
  // 画面上部から順に10件のみフェッチ
  const cardsToFetch = allCards
    .filter((card) => {
      // 既にフェッチ済みまたはフェッチ中はスキップ
      if (cacheEntryMap.has(card.title)) return false;
      if (fetchingTitles.has(card.title)) return false;
      return true;
    })
    .slice(0, 10);

  if (cardsToFetch.length === 0) {
    log("No cards to fetch");
    return;
  }

  log(`Fetching ${cardsToFetch.length} cards`);

  // 1件ずつ順番にフェッチ（並列を避ける）
  fetchSequentially(cardsToFetch, 0);
}

/**
 * カードを1件ずつ順番にフェッチする
 */
function fetchSequentially(cards: AnimeCard[], index: number): void {
  if (index >= cards.length || !fetchController) {
    log("Sequential fetch complete");
    return;
  }

  const card = cards[index];
  if (!card) return;

  fetchingTitles.add(card.title);

  fetchController
    .fetch(card.title)
    .then(() => {
      // 500ms待ってから次をフェッチ
      setTimeout(() => {
        fetchSequentially(cards, index + 1);
      }, 500);
    })
    .catch((error) => {
      log(`Fetch failed: ${card.title}`, error);
      setTimeout(() => {
        fetchSequentially(cards, index + 1);
      }, 500);
    })
    .finally(() => {
      fetchingTitles.delete(card.title);
    });
}

// =============================================================================
// イベントハンドラー
// =============================================================================

/**
 * フェッチ完了時のハンドラー
 */
function handleFetchComplete(title: string, entry: CacheEntry): void {
  log(`Fetch complete: ${title}`, { status: entry.status });

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
      continue;
    }

    const badge = createLoadingBadge(card.title);
    card.insertionPoint.parentElement?.insertBefore(badge, card.insertionPoint);

    badgeMap.set(card.title, badge);
    markBadgeInserted(card.element);
  }
}

/**
 * 順位を再計算してバッジを更新する
 */
function recalculateRanks(): void {
  log("Recalculating ranks...");

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

  const rankedCount = rankOutputs.filter((o) => o.rankData !== null).length;
  log(`Ranks updated: ${rankedCount}/${allCards.length}`);
}

/**
 * リトライボタンが押されたときのハンドラー
 */
function handleRetry(title: string): void {
  log(`Retry: ${title}`);

  if (!fetchController) return;

  fetchController.fetch(title, true).catch((error) => {
    log(`Retry failed: ${title}`, error);
  });
}

// =============================================================================
// スクリプト実行
// =============================================================================

main().catch((error: unknown) => {
  console.error("[cf-ranking] Fatal error:", error);
});
