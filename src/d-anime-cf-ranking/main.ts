/**
 * d-anime-cf-ranking
 *
 * dアニメストアのCFページ（クール別ページ）上の作品カードに、
 * ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示する
 *
 * v1.0.0 - 初回リリース
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard, CacheEntry, Settings } from "@/shared/types/d-anime-cf-ranking";
import {
  RECALCULATE_THROTTLE_MS,
  VIEWPORT_DEBOUNCE_MS,
  MAX_VIEWPORT_ITEMS,
} from "@/shared/types/d-anime-cf-ranking";

// 設定
import {
  getSettings,
  saveSettings,
  registerMenuCommands,
  onSettingsChange,
} from "./config/settings";

// キャッシュ
import {
  initDatabase,
  getAllCacheEntries,
  isCacheValid,
  clearCache,
} from "./services/cache-manager";

// コントロールパネル
import {
  createControlPanel,
  insertControlPanel,
  type ControlPanelHandle,
} from "./ui/control-panel";

// DOM操作
import {
  detectAllCards,
  detectAllCardElements,
  createCardObserver,
  startCardObserver,
  createVisibilityObserver,
  startVisibilityObserver,
  filterUnprocessedCards,
  markBadgeInserted,
  isElementVisible,
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
let visibilityObserver: MutationObserver | null = null;
let recalculateTimer: ReturnType<typeof setTimeout> | null = null;
let recalculatePending = false;
let viewportDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const visibleCardElements = new Set<HTMLElement>();
let isInitialized = false;

/** コントロールパネルハンドル */
let controlPanelHandle: ControlPanelHandle | null = null;

/** リフレッシュ中フラグ */
let isRefreshing = false;

/** 非表示カード要素のセット（ビジビリティ監視対象） */
const hiddenCardElements = new Set<HTMLElement>();

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
  console.log("[CF-RANKING DEBUG] === 初期化開始 ===");

  const settings = getSettings();

  registerMenuCommands();
  await initDatabase();

  // コントロールパネルを作成・挿入（表示状態に関係なく常に表示）
  controlPanelHandle = createControlPanel(settings, {
    onSettingsChange: handleSettingsChange,
    onRefreshTrigger: handleRefreshTrigger,
  });
  insertControlPanel(controlPanelHandle);

  // 設定変更時のコールバックを登録
  onSettingsChange((newSettings) => {
    controlPanelHandle?.updateSettings(newSettings);
    // 表示ON/OFFが変更された場合、バッジの表示を切り替える
    updateBadgeVisibility(newSettings.enabled);
  });

  if (!settings.enabled) {
    logger.info("Ranking display is disabled");
    return;
  }

  // 既存キャッシュを読み込む
  await loadCachedEntries();
  console.log("[CF-RANKING DEBUG] キャッシュ読み込み後:", {
    cacheEntryMapSize: cacheEntryMap.size,
    cacheEntryTitles: Array.from(cacheEntryMap.keys()).slice(0, 10),
  });

  fetchController = createFetchController();
  fetchController.setOnComplete(handleFetchComplete);

  // DOM上の全カード要素を取得（表示/非表示問わず）
  const allCardElements = detectAllCardElements();
  
  allCards = await waitForCards();
  logger.info("Cards detected", { count: allCards.length });

  // 非表示カードを追跡対象に追加
  for (const element of allCardElements) {
    if (!isElementVisible(element)) {
      hiddenCardElements.add(element);
    }
  }

  console.log("[CF-RANKING DEBUG] カード検出:", {
    domTotal: allCardElements.length,
    visibleCards: allCards.length,
    hiddenCards: hiddenCardElements.size,
    cardTitles: allCards.map((c) => c.title).slice(0, 10),
  });

  if (allCards.length === 0 && hiddenCardElements.size === 0) {
    logger.warn("No cards found");
    return;
  }

  insertLoadingBadges(allCards);
  console.log("[CF-RANKING DEBUG] バッジ挿入後:", {
    badgeMapSize: badgeMap.size,
  });

  initViewportObserver();
  for (const card of allCards) {
    viewportObserver?.observe(card.element);
  }

  cardObserver = createCardObserver(handleNewCards);
  startCardObserver(cardObserver);

  // ビジビリティ変更の監視を開始（非表示カードが表示されたら検知）
  if (hiddenCardElements.size > 0) {
    visibilityObserver = createVisibilityObserver(hiddenCardElements, handleNewlyVisibleCards);
    startVisibilityObserver(visibilityObserver);
    logger.info("Visibility observer started for hidden cards", { count: hiddenCardElements.size });
  }

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
  console.log("[CF-RANKING DEBUG] === 初期化完了 ===");
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
    let invalidCount = 0;

    for (const entry of allEntries) {
      if (isCacheValid(entry)) {
        cacheEntryMap.set(entry.title, entry);
        validCount++;
      } else {
        invalidCount++;
      }
    }

    logger.info("Loaded cached entries", { total: allEntries.length, valid: validCount });
    console.log("[CF-RANKING DEBUG] キャッシュ読み込み詳細:", {
      totalInIndexedDB: allEntries.length,
      validEntries: validCount,
      invalidEntries: invalidCount,
      titles: allEntries.map((e) => e.title).slice(0, 20),
    });
  } catch (error) {
    logger.error("Failed to load cached entries", error as Error);
  }
}

// =============================================================================
// バックグラウンドフェッチ（全カード順次取得）
// =============================================================================

function startBackgroundFetch(): void {
  if (!fetchController) return;

  console.log("[CF-RANKING DEBUG] === バックグラウンドフェッチ開始 ===");
  console.log("[CF-RANKING DEBUG] allCards:", allCards.length);
  console.log("[CF-RANKING DEBUG] cacheEntryMap:", cacheEntryMap.size);

  // 全カードがキャッシュ済みかチェック
  const cachedTitles = allCards.filter((card) => cacheEntryMap.has(card.title));
  const uncachedTitles = allCards.filter((card) => !cacheEntryMap.has(card.title));
  console.log("[CF-RANKING DEBUG] キャッシュ状況:", {
    cached: cachedTitles.length,
    uncached: uncachedTitles.length,
    uncachedTitles: uncachedTitles.map((c) => c.title).slice(0, 10),
  });

  const allCached = uncachedTitles.length === 0;
  if (allCached && allCards.length > 0) {
    isRankingFinalized = true;
    logger.info("All cards cached, ranking finalized immediately");
    console.log("[CF-RANKING DEBUG] 全カードキャッシュ済み - 即時確定");
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
      console.log("[CF-RANKING DEBUG] === フェッチ完了・順位確定 ===");
      console.log("[CF-RANKING DEBUG] 最終状態:", {
        allCards: allCards.length,
        cacheEntryMap: cacheEntryMap.size,
        badgeMap: badgeMap.size,
      });
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
  console.log("[CF-RANKING DEBUG] === 新しいカード検出 ===");
  console.log("[CF-RANKING DEBUG] 検出されたカード:", newCards.length);

  // 既存のカードと重複しないものだけ追加
  const existingTitles = new Set(allCards.map((c) => c.title));
  const uniqueNewCards = newCards.filter((c) => !existingTitles.has(c.title));
  const duplicateCards = newCards.filter((c) => existingTitles.has(c.title));

  console.log("[CF-RANKING DEBUG] 重複チェック:", {
    total: newCards.length,
    unique: uniqueNewCards.length,
    duplicates: duplicateCards.length,
    duplicateTitles: duplicateCards.map((c) => c.title),
  });
  
  if (uniqueNewCards.length === 0) return;
  
  allCards = [...allCards, ...uniqueNewCards];
  console.log("[CF-RANKING DEBUG] allCards更新後:", allCards.length);

  insertLoadingBadges(uniqueNewCards);

  for (const card of uniqueNewCards) {
    viewportObserver?.observe(card.element);
  }

  // 新しいカードが追加されたら順位を再計算（確定状態をリセット）
  if (isRankingFinalized) {
    isRankingFinalized = false;
    // バックグラウンドフェッチを再開
    startBackgroundFetch();
  }
}

/**
 * ビジビリティ変更により新しく表示されたカードを処理する
 */
function handleNewlyVisibleCards(newlyVisibleCards: AnimeCard[]): void {
  console.log("[CF-RANKING DEBUG] === カードが表示状態に変更 ===");
  console.log("[CF-RANKING DEBUG] 新しく表示されたカード:", newlyVisibleCards.length);
  console.log("[CF-RANKING DEBUG] タイトル:", newlyVisibleCards.map((c) => c.title));

  // handleNewCardsと同じ処理を行う
  handleNewCards(newlyVisibleCards);
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
  console.log("[CF-RANKING DEBUG] === 順位再計算 ===");

  const scoreInputs: ScoreInput[] = allCards.map((card) => {
    const entry = cacheEntryMap.get(card.title);
    return {
      title: card.title,
      metrics: entry?.status === "ok" ? entry.metrics : null,
    };
  });

  // スコアが有効な件数をカウント
  const validInputs = scoreInputs.filter((i) => i.metrics !== null);
  console.log("[CF-RANKING DEBUG] 順位計算入力:", {
    totalInputs: scoreInputs.length,
    validInputs: validInputs.length,
    invalidInputs: scoreInputs.length - validInputs.length,
    isRankingFinalized,
  });

  const rankOutputs = calculateRanks(scoreInputs);

  // 順位の範囲を確認
  const validRanks = rankOutputs.filter((o) => o.rankData !== null);
  const ranks = validRanks.map((o) => o.rankData?.rank ?? 0);
  console.log("[CF-RANKING DEBUG] 順位計算結果:", {
    totalOutputs: rankOutputs.length,
    validRanks: validRanks.length,
    minRank: Math.min(...ranks),
    maxRank: Math.max(...ranks),
    totalCount: validRanks[0]?.rankData?.totalCount,
  });

  let updatedCount = 0;
  let skippedNoBadge = 0;
  let skippedNoEntry = 0;
  let skippedPending = 0;

  for (const output of rankOutputs) {
    const badge = badgeMap.get(output.title);
    const entry = cacheEntryMap.get(output.title);

    if (!badge) {
      skippedNoBadge++;
      continue;
    }
    if (!entry) {
      skippedNoEntry++;
      continue;
    }
    if (entry.status === "pending") {
      skippedPending++;
      continue;
    }

    updateBadge(badge, output.rankData, entry, handleRetry, isRankingFinalized);
    updatedCount++;
  }

  console.log("[CF-RANKING DEBUG] バッジ更新結果:", {
    updated: updatedCount,
    skippedNoBadge,
    skippedNoEntry,
    skippedPending,
  });
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
// 設定変更・再調査ハンドラー
// =============================================================================

/**
 * 設定変更時のハンドラー
 */
function handleSettingsChange(newSettings: Settings): void {
  logger.info("Settings changed", { settings: newSettings });
  saveSettings(newSettings);
}

/**
 * 再調査トリガーのハンドラー
 */
async function handleRefreshTrigger(): Promise<void> {
  if (isRefreshing || !fetchController) {
    logger.warn("Refresh already in progress or fetch controller not ready");
    return;
  }

  logger.info("Manual refresh triggered");
  console.log("[CF-RANKING DEBUG] === マニュアル再調査開始 ===");

  isRefreshing = true;
  controlPanelHandle?.setRefreshing(true);

  try {
    // キャッシュをクリア
    await clearCache();
    cacheEntryMap.clear();

    // バッジをローディング状態にリセット
    resetBadgesToLoading();

    // 順位確定状態をリセット
    isRankingFinalized = false;

    // 進捗表示用のカウンター
    let fetchedCount = 0;
    const totalCount = allCards.length;

    controlPanelHandle?.updateProgress(fetchedCount, totalCount);

    // 全カードを順次再フェッチ
    for (const card of allCards) {
      if (!isRefreshing) {
        // キャンセルされた場合
        break;
      }

      try {
        const entry = await fetchController.fetch(card.title, true);
        handleFetchComplete(card.title, entry);
        fetchedCount++;
        controlPanelHandle?.updateProgress(fetchedCount, totalCount);
      } catch (error) {
        logger.error("Refresh fetch failed", error as Error, { title: card.title });
        fetchedCount++;
        controlPanelHandle?.updateProgress(fetchedCount, totalCount);
      }

      // レート制限のため少し待機
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // 完了
    isRankingFinalized = true;
    recalculateRanks();

    logger.info("Manual refresh completed", { total: fetchedCount });
    console.log("[CF-RANKING DEBUG] === マニュアル再調査完了 ===");
  } catch (error) {
    logger.error("Manual refresh failed", error as Error);
  } finally {
    isRefreshing = false;
    controlPanelHandle?.setRefreshing(false);
    controlPanelHandle?.updateProgress(0, 0);
  }
}

/**
 * 全バッジをローディング状態にリセット
 */
function resetBadgesToLoading(): void {
  for (const badge of badgeMap.values()) {
    badge.className = "cf-ranking-badge cf-ranking-loading";
    badge.setAttribute(
      "style",
      `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
      margin: 0 4px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      white-space: nowrap;
      transition: transform 0.1s ease;
      background: #e0e0e0;
      color: #666;
      border: 1px solid #ccc;
    `
    );
    badge.innerHTML = `<span style="display: inline-flex; vertical-align: middle;"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/></svg></span>`;
  }
}

/**
 * バッジの表示/非表示を切り替える
 */
function updateBadgeVisibility(enabled: boolean): void {
  for (const badge of badgeMap.values()) {
    badge.style.display = enabled ? "inline-flex" : "none";
  }
}

// =============================================================================
// スクリプト実行
// =============================================================================

main().catch((error: unknown) => {
  logger.error("d-anime-cf-ranking failed to initialize", error as Error);
});
