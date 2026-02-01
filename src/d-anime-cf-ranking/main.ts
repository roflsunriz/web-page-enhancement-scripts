/**
 * d-anime-cf-ranking
 *
 * v0.0.1 - デバッグ版（全箇所にログ追加）
 */

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

// =============================================================================
// デバッグログ
// =============================================================================

const log = (msg: string, data?: unknown) => {
  console.log(`[CF-DEBUG] ${msg}`, data ?? "");
};

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

// デバッグ用カウンター
let intersectionCallCount = 0;
let mutationCallCount = 0;

// =============================================================================
// メイン処理
// =============================================================================

async function main(): Promise<void> {
  log("1. main() started");

  const settings = getSettings();
  log("2. settings loaded", settings);

  if (!settings.enabled) {
    log("2a. disabled, exiting");
    return;
  }

  registerMenuCommands();
  log("3. menu registered");

  await initDatabase();
  log("4. IndexedDB initialized");

  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);
  log("5. fetchController created");

  log("6. waiting for cards...");
  allCards = await waitForCards();
  log("7. cards detected", { count: allCards.length });

  if (allCards.length === 0) {
    log("7a. no cards, exiting");
    return;
  }

  log("8. inserting badges...");
  insertLoadingBadges(allCards);
  log("9. badges inserted");

  log("10. initializing IntersectionObserver...");
  initViewportObserver();
  log("11. IntersectionObserver created");

  log("12. observing all cards...");
  for (let i = 0; i < allCards.length; i++) {
    viewportObserver?.observe(allCards[i]!.element);
  }
  log("13. all cards observed");

  log("14. starting MutationObserver...");
  cardObserver = createCardObserver(handleNewCards);
  startCardObserver(cardObserver);
  log("15. MutationObserver started");

  isInitialized = true;
  log("16. initialization complete, scheduling initial fetch...");

  setTimeout(() => {
    log("17. initial fetch triggered");
    triggerViewportFetch();
  }, 500);

  log("18. main() finished");
}

async function waitForCards(): Promise<AnimeCard[]> {
  const MAX_ATTEMPTS = 30;
  const POLL_INTERVAL_MS = 500;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const cards = detectAllCards();
    if (cards.length > 0) {
      log(`waitForCards: found ${cards.length} cards on attempt ${attempt + 1}`);
      return cards;
    }
    log(`waitForCards: attempt ${attempt + 1}/${MAX_ATTEMPTS}, no cards yet`);
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return [];
}

// =============================================================================
// IntersectionObserver
// =============================================================================

function initViewportObserver(): void {
  log("initViewportObserver: creating observer");

  viewportObserver = new IntersectionObserver(
    (entries) => {
      intersectionCallCount++;
      log(`IntersectionObserver callback #${intersectionCallCount}`, {
        entriesCount: entries.length,
        isInitialized,
      });

      // 初期化前は何もしない
      if (!isInitialized) {
        log("IntersectionObserver: not initialized, skipping");
        return;
      }

      let hasChange = false;
      let addedCount = 0;
      let removedCount = 0;

      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const wasVisible = visibleCardElements.has(element);
        const isVisible = entry.isIntersecting;

        if (wasVisible !== isVisible) {
          hasChange = true;
          if (isVisible) {
            visibleCardElements.add(element);
            addedCount++;
          } else {
            visibleCardElements.delete(element);
            removedCount++;
          }
        }
      }

      log(`IntersectionObserver: hasChange=${hasChange}, added=${addedCount}, removed=${removedCount}, totalVisible=${visibleCardElements.size}`);

      if (hasChange) {
        log("IntersectionObserver: scheduling viewport fetch");
        scheduleViewportFetch();
      }
    },
    {
      root: null,
      rootMargin: "50px",
      threshold: 0,
    }
  );

  log("initViewportObserver: observer created");
}

function scheduleViewportFetch(): void {
  log("scheduleViewportFetch called");

  if (viewportDebounceTimer !== null) {
    log("scheduleViewportFetch: clearing existing timer");
    clearTimeout(viewportDebounceTimer);
  }

  viewportDebounceTimer = setTimeout(() => {
    log("scheduleViewportFetch: debounce timer fired");
    viewportDebounceTimer = null;
    triggerViewportFetch();
  }, VIEWPORT_DEBOUNCE_MS);

  log(`scheduleViewportFetch: timer set (${VIEWPORT_DEBOUNCE_MS}ms)`);
}

function triggerViewportFetch(): void {
  log("triggerViewportFetch called", { visibleCount: visibleCardElements.size });

  if (!fetchController) {
    log("triggerViewportFetch: no fetchController");
    return;
  }

  log("triggerViewportFetch: filtering visible cards...");
  const visibleCards = allCards.filter((card) =>
    visibleCardElements.has(card.element)
  );
  log(`triggerViewportFetch: ${visibleCards.length} visible cards`);

  // ソートをスキップ（パフォーマンス問題の可能性）
  // log("triggerViewportFetch: sorting by position...");
  // visibleCards.sort((a, b) => {
  //   const rectA = a.element.getBoundingClientRect();
  //   const rectB = b.element.getBoundingClientRect();
  //   return rectA.top - rectB.top;
  // });

  const cardsToProcess = visibleCards.slice(0, MAX_VIEWPORT_ITEMS);
  log(`triggerViewportFetch: processing ${cardsToProcess.length} cards (max ${MAX_VIEWPORT_ITEMS})`);

  const cardsToFetch = cardsToProcess.filter((card) => {
    const cached = cacheEntryMap.get(card.title);
    return !cached;
  });
  log(`triggerViewportFetch: ${cardsToFetch.length} cards need fetching`);

  if (cardsToFetch.length === 0) {
    log("triggerViewportFetch: nothing to fetch");
    return;
  }

  log("triggerViewportFetch: starting fetch...");
  for (const card of cardsToFetch) {
    log(`triggerViewportFetch: fetching "${card.title}"`);
    fetchController
      .fetch(card.title)
      .then((entry) => {
        log(`triggerViewportFetch: fetch complete "${card.title}"`, { status: entry.status });
        handleFetchComplete(card.title, entry);
      })
      .catch((error) => {
        log(`triggerViewportFetch: fetch error "${card.title}"`, error);
      });
  }

  log("triggerViewportFetch: all fetches queued");
}

// =============================================================================
// イベントハンドラー
// =============================================================================

function handleFetchComplete(title: string, entry: CacheEntry): void {
  log(`handleFetchComplete: "${title}"`, { status: entry.status });

  if (cacheEntryMap.has(title)) {
    log(`handleFetchComplete: already processed "${title}", skipping`);
    return;
  }

  cacheEntryMap.set(title, entry);
  log(`handleFetchComplete: cached, total=${cacheEntryMap.size}`);

  scheduleRecalculateRanks();
}

function scheduleRecalculateRanks(): void {
  log("scheduleRecalculateRanks called");

  recalculatePending = true;

  if (recalculateTimer !== null) {
    log("scheduleRecalculateRanks: already scheduled");
    return;
  }

  recalculateTimer = setTimeout(() => {
    log("scheduleRecalculateRanks: timer fired");
    recalculateTimer = null;
    if (recalculatePending) {
      recalculatePending = false;
      recalculateRanks();
    }
  }, RECALCULATE_THROTTLE_MS);

  log(`scheduleRecalculateRanks: timer set (${RECALCULATE_THROTTLE_MS}ms)`);
}

function handleNewCards(newCards: AnimeCard[]): void {
  mutationCallCount++;
  log(`handleNewCards #${mutationCallCount}`, { count: newCards.length });

  allCards = [...allCards, ...newCards];
  log(`handleNewCards: total cards now ${allCards.length}`);

  insertLoadingBadges(newCards);

  for (const card of newCards) {
    viewportObserver?.observe(card.element);
  }

  log("handleNewCards: done");
}

// =============================================================================
// UI操作
// =============================================================================

function insertLoadingBadges(cards: AnimeCard[]): void {
  log(`insertLoadingBadges: ${cards.length} cards`);

  const unprocessed = filterUnprocessedCards(cards);
  log(`insertLoadingBadges: ${unprocessed.length} unprocessed`);

  for (const card of unprocessed) {
    if (!card.insertionPoint) {
      continue;
    }

    const badge = createLoadingBadge(card.title);
    card.insertionPoint.parentElement?.insertBefore(badge, card.insertionPoint);

    badgeMap.set(card.title, badge);
    markBadgeInserted(card.element);
  }

  log(`insertLoadingBadges: done`);
}

function recalculateRanks(): void {
  log("recalculateRanks: starting...");

  const scoreInputs: ScoreInput[] = allCards.map((card) => {
    const entry = cacheEntryMap.get(card.title);
    return {
      title: card.title,
      metrics: entry?.status === "ok" ? entry.metrics : null,
    };
  });
  log(`recalculateRanks: ${scoreInputs.length} inputs`);

  log("recalculateRanks: calculating...");
  const rankOutputs = calculateRanks(scoreInputs);
  log(`recalculateRanks: ${rankOutputs.length} outputs`);

  log("recalculateRanks: updating badges...");
  let updatedCount = 0;
  for (const output of rankOutputs) {
    const badge = badgeMap.get(output.title);
    const entry = cacheEntryMap.get(output.title);

    if (!badge || !entry) continue;
    if (entry.status === "pending") continue;

    updateBadge(badge, output.rankData, entry, handleRetry);
    updatedCount++;
  }

  log(`recalculateRanks: updated ${updatedCount} badges`);
}

function handleRetry(title: string): void {
  log(`handleRetry: "${title}"`);

  if (!fetchController) return;

  cacheEntryMap.delete(title);

  fetchController.fetch(title, true).then((entry) => {
    handleFetchComplete(title, entry);
  }).catch((error) => {
    log(`handleRetry: error "${title}"`, error);
  });
}

// =============================================================================
// スクリプト実行
// =============================================================================

log("0. Script loaded, calling main()");
main().catch((error: unknown) => {
  log("FATAL ERROR in main()", error);
});
