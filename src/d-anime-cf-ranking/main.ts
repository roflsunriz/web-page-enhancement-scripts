/**
 * d-anime-cf-ranking
 *
 * dアニメストアのCFページ（クール別ページ）上の作品カードに、
 * ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示する
 *
 * v1.0.0 - 初回リリース
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
import { initDatabase, getAllCacheEntries, isCacheValid } from "./services/cache-manager";

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

let allCards: AnimeCard[] = [];
const cacheEntryMap = new Map<string, CacheEntry>();
const badgeMap = new Map<string, HTMLElement>();
let fetchController: FetchController | null = null;
let cardObserver: MutationObserver | null = null;
let viewportObserver: IntersectionObserver | null = null;
let recalculateTimer: ReturnType<typeof setTimeout> | null = null;
let recalculatePending = false;
let viewportDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const visibleCardElements = new Set<HTMLElement>();
let isInitialized = false;

/** バックグラウンドフェッチのインデックス */
let backgroundFetchIndex = 0;

/** バックグラウンドフェッチタイマー */
let backgroundFetchTimer: ReturnType<typeof setTimeout> | null = null;

/** 全カードのフェッチが完了したか（順位確定状態） */
let isRankingFinalized = false;

// =============================================================================
// メイン処理
// =============================================================================

async function main(): Promise<void> {
  logger.info("d-anime-cf-ranking starting...");

  const settings = getSettings();
  if (!settings.enabled) {
    logger.info("Ranking display is disabled");
    return;
  }

  registerMenuCommands();
  await initDatabase();

  // 既存キャッシュを読み込む
  await loadCachedEntries();

  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);

  allCards = await waitForCards();
  logger.info("Cards detected", { count: allCards.length });

  if (allCards.length === 0) {
    logger.warn("No cards found");
    return;
  }

  insertLoadingBadges(allCards);

  initViewportObserver();
  for (const card of allCards) {
    viewportObserver?.observe(card.element);
  }

  cardObserver = createCardObserver(handleNewCards);
  startCardObserver(cardObserver);

  isInitialized = true;

  // 初期フェッチ（ビューポート内）
  setTimeout(() => {
    triggerViewportFetch();
  }, 500);

  // バックグラウンドで全カードをフェッチ開始（2秒後）
  setTimeout(() => {
    startBackgroundFetch();
  }, 2000);

  logger.info("d-anime-cf-ranking initialized");
}

async function waitForCards(): Promise<AnimeCard[]> {
  const MAX_ATTEMPTS = 30;
  const POLL_INTERVAL_MS = 500;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const cards = detectAllCards();
    if (cards.length > 0) {
      return cards;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return [];
}

/**
 * IndexedDBから既存キャッシュを読み込み、有効なエントリをcacheEntryMapにセットする
 */
async function loadCachedEntries(): Promise<void> {
  try {
    const allEntries = await getAllCacheEntries();
    let validCount = 0;

    for (const entry of allEntries) {
      if (isCacheValid(entry)) {
        cacheEntryMap.set(entry.title, entry);
        validCount++;
      }
    }

    logger.info("Loaded cached entries", { total: allEntries.length, valid: validCount });
  } catch (error) {
    logger.error("Failed to load cached entries", error as Error);
  }
}

// =============================================================================
// バックグラウンドフェッチ（全カード順次取得）
// =============================================================================

function startBackgroundFetch(): void {
  if (!fetchController) return;

  // 全カードがキャッシュ済みかチェック
  const allCached = allCards.every((card) => cacheEntryMap.has(card.title));
  if (allCached && allCards.length > 0) {
    isRankingFinalized = true;
    logger.info("All cards cached, ranking finalized immediately");
    recalculateRanks();
    return;
  }

  backgroundFetchIndex = 0;
  scheduleNextBackgroundFetch();
}

function scheduleNextBackgroundFetch(): void {
  if (backgroundFetchTimer !== null) {
    clearTimeout(backgroundFetchTimer);
  }

  backgroundFetchTimer = setTimeout(() => {
    backgroundFetchTimer = null;
    processNextBackgroundFetch();
  }, 300); // 300ms間隔
}

function processNextBackgroundFetch(): void {
  if (!fetchController || backgroundFetchIndex >= allCards.length) {
    // 全カードのフェッチが完了
    if (!isRankingFinalized) {
      isRankingFinalized = true;
      logger.info("Ranking finalized", { total: cacheEntryMap.size });
      // 確定状態でバッジを再描画
      recalculateRanks();
    }
    return;
  }

  const card = allCards[backgroundFetchIndex];
  backgroundFetchIndex++;

  if (!card || cacheEntryMap.has(card.title)) {
    // 既にフェッチ済み、次へ
    scheduleNextBackgroundFetch();
    return;
  }

  fetchController
    .fetch(card.title)
    .then((entry) => {
      handleFetchComplete(card.title, entry);
    })
    .catch(() => {
      // エラーは無視して続行
    })
    .finally(() => {
      scheduleNextBackgroundFetch();
    });
}

// =============================================================================
// IntersectionObserver
// =============================================================================

function initViewportObserver(): void {
  viewportObserver = new IntersectionObserver(
    (entries) => {
      if (!isInitialized) return;

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

      if (hasChange) {
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

function scheduleViewportFetch(): void {
  if (viewportDebounceTimer !== null) {
    clearTimeout(viewportDebounceTimer);
  }

  viewportDebounceTimer = setTimeout(() => {
    viewportDebounceTimer = null;
    triggerViewportFetch();
  }, VIEWPORT_DEBOUNCE_MS);
}

function triggerViewportFetch(): void {
  if (!fetchController) return;

  const visibleCards = allCards.filter((card) =>
    visibleCardElements.has(card.element)
  );

  const cardsToProcess = visibleCards.slice(0, MAX_VIEWPORT_ITEMS);

  const cardsToFetch = cardsToProcess.filter((card) => {
    return !cacheEntryMap.has(card.title);
  });

  if (cardsToFetch.length === 0) return;

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

function handleFetchComplete(title: string, entry: CacheEntry): void {
  if (cacheEntryMap.has(title)) return;

  cacheEntryMap.set(title, entry);
  scheduleRecalculateRanks();
}

function scheduleRecalculateRanks(): void {
  recalculatePending = true;

  if (recalculateTimer !== null) return;

  recalculateTimer = setTimeout(() => {
    recalculateTimer = null;
    if (recalculatePending) {
      recalculatePending = false;
      recalculateRanks();
    }
  }, RECALCULATE_THROTTLE_MS);
}

function handleNewCards(newCards: AnimeCard[]): void {
  allCards = [...allCards, ...newCards];
  insertLoadingBadges(newCards);

  for (const card of newCards) {
    viewportObserver?.observe(card.element);
  }
}

// =============================================================================
// UI操作
// =============================================================================

function insertLoadingBadges(cards: AnimeCard[]): void {
  const unprocessed = filterUnprocessedCards(cards);

  for (const card of unprocessed) {
    if (!card.insertionPoint) continue;

    const badge = createLoadingBadge(card.title);
    card.insertionPoint.parentElement?.insertBefore(badge, card.insertionPoint);

    badgeMap.set(card.title, badge);
    markBadgeInserted(card.element);
  }
}

function recalculateRanks(): void {
  const scoreInputs: ScoreInput[] = allCards.map((card) => {
    const entry = cacheEntryMap.get(card.title);
    return {
      title: card.title,
      metrics: entry?.status === "ok" ? entry.metrics : null,
    };
  });

  const rankOutputs = calculateRanks(scoreInputs);

  for (const output of rankOutputs) {
    const badge = badgeMap.get(output.title);
    const entry = cacheEntryMap.get(output.title);

    if (!badge || !entry) continue;
    if (entry.status === "pending") continue;

    updateBadge(badge, output.rankData, entry, handleRetry, isRankingFinalized);
  }
}

function handleRetry(title: string): void {
  if (!fetchController) return;

  cacheEntryMap.delete(title);

  fetchController.fetch(title, true).then((entry) => {
    handleFetchComplete(title, entry);
  }).catch((error) => {
    logger.error("Retry failed", error as Error, { title });
  });
}

// =============================================================================
// スクリプト実行
// =============================================================================

main().catch((error: unknown) => {
  logger.error("d-anime-cf-ranking failed to initialize", error as Error);
});
