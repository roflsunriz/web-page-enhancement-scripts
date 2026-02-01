/**
 * d-anime-cf-ranking
 *
 * dアニメストアのCFページ（クール別ページ）上の作品カードに、
 * ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示する
 *
 * v1.1.0 - フルバージョン（最適化済み）
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard, CacheEntry } from "@/shared/types/d-anime-cf-ranking";
import {
  RECALCULATE_THROTTLE_MS,
  VIEWPORT_DEBOUNCE_MS,
  MAX_VIEWPORT_ITEMS,
} from "@/shared/types/d-anime-cf-ranking";

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

/** フェッチコントローラー */
let fetchController: FetchController | null = null;

/** MutationObserver */
let cardObserver: MutationObserver | null = null;

/** IntersectionObserver */
let viewportObserver: IntersectionObserver | null = null;

/** 順位再計算のスロットルタイマー */
let recalculateTimer: ReturnType<typeof setTimeout> | null = null;

/** 順位再計算がペンディング中かどうか */
let recalculatePending = false;

/** ビューポート変更のデバウンスタイマー */
let viewportDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/** 現在ビューポート内にあるカード要素 */
const visibleCardElements = new Set<HTMLElement>();

/** 初期化完了フラグ */
let isInitialized = false;

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

  // フェッチコントローラー初期化
  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);

  // カードが表示されるまで待機（動的ページ対応）
  allCards = await waitForCards();
  logger.info("Cards detected", { count: allCards.length });

  if (allCards.length === 0) {
    logger.warn("No cards found after waiting");
    return;
  }

  // バッジ挿入
  insertLoadingBadges(allCards);

  // IntersectionObserver初期化（軽量版）
  initViewportObserver();

  // 全カードをビューポート監視に追加
  for (const card of allCards) {
    viewportObserver?.observe(card.element);
  }

  // 動的カード監視開始
  cardObserver = createCardObserver(handleNewCards);
  startCardObserver(cardObserver);

  // 初期化完了
  isInitialized = true;

  // 初期フェッチ（少し遅延させて安定化）
  setTimeout(() => {
    triggerViewportFetch();
  }, 500);

  logger.info("d-anime-cf-ranking initialized");
}

/**
 * カードがDOMに表示されるまで待機する
 */
async function waitForCards(): Promise<AnimeCard[]> {
  const MAX_ATTEMPTS = 30;
  const POLL_INTERVAL_MS = 500;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const cards = detectAllCards();
    if (cards.length > 0) {
      logger.debug("Cards found", { attempt: attempt + 1 });
      return cards;
    }

    logger.debug("Waiting for cards...", { attempt: attempt + 1 });
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return [];
}

// =============================================================================
// IntersectionObserver（軽量版）
// =============================================================================

/**
 * IntersectionObserverを初期化する
 */
function initViewportObserver(): void {
  viewportObserver = new IntersectionObserver(
    (entries) => {
      let hasChange = false;

      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const wasVisible = visibleCardElements.has(element);
        const isVisible = entry.isIntersecting;

        if (wasVisible !== isVisible) {
          hasChange = true;
          if (isVisible) {
            visibleCardElements.add(element);
          } else {
            visibleCardElements.delete(element);
          }
        }
      }

      if (hasChange && isInitialized) {
        scheduleViewportFetch();
      }
    },
    {
      root: null,
      rootMargin: "50px",
      threshold: 0,
    }
  );
}

/**
 * ビューポートフェッチをデバウンスしてスケジュールする
 */
function scheduleViewportFetch(): void {
  if (viewportDebounceTimer !== null) {
    clearTimeout(viewportDebounceTimer);
  }

  viewportDebounceTimer = setTimeout(() => {
    viewportDebounceTimer = null;
    triggerViewportFetch();
  }, VIEWPORT_DEBOUNCE_MS);
}

/**
 * ビューポート内のカードをフェッチする
 */
function triggerViewportFetch(): void {
  if (!fetchController) return;

  // ビューポート内のカードを取得（上から順に並べ替え）
  const visibleCards = allCards.filter((card) =>
    visibleCardElements.has(card.element)
  );

  // DOM順にソート
  visibleCards.sort((a, b) => {
    const rectA = a.element.getBoundingClientRect();
    const rectB = b.element.getBoundingClientRect();
    return rectA.top - rectB.top;
  });

  // 最大件数で制限
  const cardsToProcess = visibleCards.slice(0, MAX_VIEWPORT_ITEMS);

  // 未取得のカードのみをフェッチ
  const cardsToFetch = cardsToProcess.filter((card) => {
    const cached = cacheEntryMap.get(card.title);
    return !cached;
  });

  if (cardsToFetch.length === 0) {
    logger.debug("No cards to fetch in viewport");
    return;
  }

  logger.debug("Fetching viewport cards", { count: cardsToFetch.length });

  // フェッチを実行（並列だがFetchControllerが制限する）
  for (const card of cardsToFetch) {
    fetchController
      .fetch(card.title)
      .then((entry) => {
        handleFetchComplete(card.title, entry);
      })
      .catch((error) => {
        logger.error("Fetch failed", error as Error, { title: card.title });
      });
  }
}

// =============================================================================
// イベントハンドラー
// =============================================================================

/**
 * フェッチ完了時のハンドラー
 */
function handleFetchComplete(title: string, entry: CacheEntry): void {
  // 既に処理済みの場合はスキップ（重複防止）
  if (cacheEntryMap.has(title)) {
    return;
  }

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
    return;
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
  for (const card of newCards) {
    viewportObserver?.observe(card.element);
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

  // キャッシュマップから削除して再取得可能にする
  cacheEntryMap.delete(title);

  // 強制再取得
  fetchController.fetch(title, true).then((entry) => {
    handleFetchComplete(title, entry);
  }).catch((error) => {
    logger.error("Retry fetch failed", error as Error, { title });
  });
}

// =============================================================================
// スクリプト実行
// =============================================================================

main().catch((error: unknown) => {
  logger.error("d-anime-cf-ranking failed to initialize", error as Error);
});
