/**
 * 順位バッジUI
 *
 * - 「第{rank}位」表示
 * - ランク色分け（S/A/B/C/D）
 * - ローディング状態（…）
 * - 失敗状態（警告アイコン + リトライボタン）
 * - ホバーツールチップ（bodyに追加してオーバーフロー対策）
 *
 * Note: Reactを使わず、vanilla TSで軽量に実装
 */

import { createLogger } from "@/shared/logger";
import { renderMdiSvg } from "@/shared/icons/mdi";
import {
  mdiAlertCircle,
  mdiCheckCircle,
  mdiTimerSandEmpty,
} from "@mdi/js";
import type {
  RankData,
  RankTier,
  CacheEntry,
  TooltipData,
} from "@/shared/types/d-anime-cf-ranking";
import { RETRY_COOLDOWN_MS } from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:RankBadge");

// =============================================================================
// スタイル定義
// =============================================================================

/** ランク帯別の色定義 */
const TIER_COLORS: Record<RankTier, { bg: string; text: string; border: string }> = {
  S: { bg: "#ffd700", text: "#000", border: "#b8860b" }, // Gold
  A: { bg: "#c0c0c0", text: "#000", border: "#808080" }, // Silver
  B: { bg: "#cd7f32", text: "#fff", border: "#8b4513" }, // Bronze
  C: { bg: "#4a90d9", text: "#fff", border: "#2e5a88" }, // Blue
  D: { bg: "#808080", text: "#fff", border: "#505050" }, // Gray
};

/** バッジの基本スタイル */
const BADGE_BASE_STYLE = `
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
`;

/** ローディング状態のスタイル */
const LOADING_STYLE = `
  ${BADGE_BASE_STYLE}
  background: #e0e0e0;
  color: #666;
  border: 1px solid #ccc;
`;

/** エラー状態のスタイル */
const ERROR_STYLE = `
  ${BADGE_BASE_STYLE}
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
`;

/** アイコンのスタイル */
const ICON_STYLE = `
  display: inline-flex;
  vertical-align: middle;
`;

/** チェックマークのスタイル（小さめ） */
const CHECK_ICON_STYLE = `
  display: inline-flex;
  vertical-align: middle;
  margin-left: 2px;
  opacity: 0.9;
`;

// =============================================================================
// グローバルツールチップ（bodyに1つだけ作成）
// =============================================================================

let globalTooltip: HTMLElement | null = null;

function getGlobalTooltip(): HTMLElement {
  if (!globalTooltip) {
    globalTooltip = document.createElement("div");
    globalTooltip.className = "cf-ranking-global-tooltip";
    globalTooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.95);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: normal;
      white-space: pre-line;
      z-index: 2147483647;
      pointer-events: none;
      max-width: 320px;
      min-width: 220px;
      line-height: 1.6;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    document.body.appendChild(globalTooltip);
  }
  return globalTooltip;
}

function showTooltip(content: string, badge: HTMLElement): void {
  const tooltip = getGlobalTooltip();
  tooltip.textContent = content;
  tooltip.style.display = "block";

  // バッジの位置を取得
  const rect = badge.getBoundingClientRect();

  // ツールチップのサイズを取得
  const tooltipRect = tooltip.getBoundingClientRect();

  // バッジの上に表示（中央揃え）
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.top - tooltipRect.height - 8;

  // 画面外にはみ出す場合の調整
  if (left < 8) left = 8;
  if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8;
  }
  if (top < 8) {
    // 上に表示できない場合は下に表示
    top = rect.bottom + 8;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip(): void {
  const tooltip = getGlobalTooltip();
  tooltip.style.display = "none";
}

// =============================================================================
// バッジ作成
// =============================================================================

/** リトライコールバック型 */
type RetryCallback = (title: string) => void;

/** バッジ要素のカスタムプロパティ */
interface BadgeElement extends HTMLElement {
  __cfRanking?: {
    title: string;
    retryCallback?: RetryCallback;
    lastRetryTime?: number;
    tooltipContent?: string;
  };
}

/**
 * ランク帯に応じたスタイルを生成する
 */
function getTierStyle(tier: RankTier): string {
  const colors = TIER_COLORS[tier];
  return `
    ${BADGE_BASE_STYLE}
    background: ${colors.bg};
    color: ${colors.text};
    border: 2px solid ${colors.border};
  `;
}

/**
 * ローディング状態のバッジを作成する
 */
export function createLoadingBadge(title: string): HTMLElement {
  const badge = document.createElement("div") as BadgeElement;
  badge.className = "cf-ranking-badge cf-ranking-loading";
  badge.setAttribute("style", LOADING_STYLE);
  badge.innerHTML = createIconHtml(mdiTimerSandEmpty);
  badge.__cfRanking = { title };

  return badge;
}

/**
 * アイコンのHTMLを生成する（14px）
 */
function createIconHtml(pathD: string): string {
  return `<span style="${ICON_STYLE}">${renderMdiSvg(pathD, 14)}</span>`;
}

/**
 * チェックマークのHTMLを生成する（12px）
 */
function createCheckIconHtml(pathD: string): string {
  return `<span style="${CHECK_ICON_STYLE}">${renderMdiSvg(pathD, 12)}</span>`;
}

/**
 * エラー状態のバッジを作成する
 */
export function createErrorBadge(
  title: string,
  errorMessage: string,
  retryCallback?: RetryCallback
): HTMLElement {
  const badge = document.createElement("div") as BadgeElement;
  badge.className = "cf-ranking-badge cf-ranking-error";
  badge.setAttribute("style", ERROR_STYLE);
  badge.innerHTML = createIconHtml(mdiAlertCircle);

  const tooltipContent = `取得失敗: ${errorMessage}\nクリックでリトライ`;
  badge.__cfRanking = { title, retryCallback, tooltipContent };

  setupTooltipEvents(badge);

  if (retryCallback) {
    badge.addEventListener("click", () => {
      handleRetryClick(badge, title, retryCallback);
    });
    badge.style.cursor = "pointer";
  }

  return badge;
}

/**
 * 順位バッジを作成する
 * @param isRankingFinalized 全カードのフェッチが完了しているか
 */
export function createRankBadge(
  title: string,
  rankData: RankData,
  cacheEntry: CacheEntry,
  isRankingFinalized = false
): HTMLElement {
  const badge = document.createElement("div") as BadgeElement;
  badge.className = "cf-ranking-badge cf-ranking-rank";
  badge.setAttribute("style", getTierStyle(rankData.tier));
  
  // 全カード取得完了時のみチェックマークを表示
  const checkMark = isRankingFinalized ? createCheckIconHtml(mdiCheckCircle) : "";
  badge.innerHTML = `第${rankData.rank}位${checkMark}`;

  const tooltipData = buildTooltipData(rankData, cacheEntry, isRankingFinalized);
  const tooltipContent = formatTooltipContent(tooltipData);
  badge.__cfRanking = { title, tooltipContent };

  setupTooltipEvents(badge);

  // ホバー時に少し大きく
  badge.addEventListener("mouseenter", () => {
    badge.style.transform = "scale(1.1)";
  });
  badge.addEventListener("mouseleave", () => {
    badge.style.transform = "scale(1)";
  });

  return badge;
}

/**
 * バッジを更新する（ローディング→順位 or エラー）
 * @param isRankingFinalized 全カードのフェッチが完了しているか
 */
export function updateBadge(
  badge: HTMLElement,
  rankData: RankData | null,
  cacheEntry: CacheEntry,
  retryCallback?: RetryCallback,
  isRankingFinalized = false
): void {
  const badgeEl = badge as BadgeElement;
  const title = badgeEl.__cfRanking?.title ?? cacheEntry.title;

  // 既存のイベントリスナーをクリア
  badge.onmouseenter = null;
  badge.onmouseleave = null;
  badge.onclick = null;

  if (cacheEntry.status === "failed" || !rankData) {
    // エラー状態
    badge.className = "cf-ranking-badge cf-ranking-error";
    badge.setAttribute("style", ERROR_STYLE);
    badge.innerHTML = createIconHtml(mdiAlertCircle);

    const tooltipContent = `取得失敗: ${cacheEntry.failureReason ?? "不明なエラー"}\nクリックでリトライ`;
    badgeEl.__cfRanking = { title, retryCallback, tooltipContent };

    setupTooltipEvents(badge);

    if (retryCallback) {
      badge.onclick = () => handleRetryClick(badgeEl, title, retryCallback);
      badge.style.cursor = "pointer";
    }
  } else {
    // 順位表示
    badge.className = "cf-ranking-badge cf-ranking-rank";
    badge.setAttribute("style", getTierStyle(rankData.tier));
    
    // 全カード取得完了時のみチェックマークを表示
    const checkMark = isRankingFinalized ? createCheckIconHtml(mdiCheckCircle) : "";
    badge.innerHTML = `第${rankData.rank}位${checkMark}`;
    badge.style.cursor = "default";

    const tooltipData = buildTooltipData(rankData, cacheEntry, isRankingFinalized);
    const tooltipContent = formatTooltipContent(tooltipData);
    badgeEl.__cfRanking = { title, tooltipContent };

    setupTooltipEvents(badge);

    // ホバーエフェクト（ツールチップイベントと一緒に設定）
  }
}

// =============================================================================
// ツールチップイベント
// =============================================================================

function setupTooltipEvents(badge: HTMLElement): void {
  const badgeEl = badge as BadgeElement;

  badge.onmouseenter = () => {
    const content = badgeEl.__cfRanking?.tooltipContent;
    if (content) {
      showTooltip(content, badge);
    }
    // ホバーエフェクト
    if (badge.classList.contains("cf-ranking-rank")) {
      badge.style.transform = "scale(1.1)";
    }
  };

  badge.onmouseleave = () => {
    hideTooltip();
    // ホバーエフェクト解除
    badge.style.transform = "scale(1)";
  };
}

// =============================================================================
// ツールチップデータ
// =============================================================================

function buildTooltipData(
  rankData: RankData,
  cacheEntry: CacheEntry,
  isRankingFinalized: boolean
): TooltipData {
  return {
    rank: rankData.rank,
    totalCount: rankData.totalCount,
    tier: rankData.tier,
    totalScore: rankData.score.totalScore,
    rawMetrics: cacheEntry.metrics ?? {
      viewCount: 0,
      mylistCount: 0,
      commentCount: 0,
      likeCount: 0,
    },
    normalizedMetrics: rankData.score.normalizedMetrics,
    representativeVideo: cacheEntry.representativeVideo,
    fetchedAt: cacheEntry.fetchedAt,
    isRankingFinalized,
  };
}

function formatTooltipContent(data: TooltipData): string {
  const lines: string[] = [];

  // 順位（確定状態を表示）
  const status = data.isRankingFinalized ? "✓確定" : "⏳暫定";
  lines.push(`【${data.tier}ランク】第${data.rank}位 / ${data.totalCount}作品中 ${status}`);
  lines.push(`総合スコア: ${(data.totalScore * 100).toFixed(1)}点`);
  lines.push("");

  // 指標
  lines.push("▼ 指標 (生値 / 正規化)");
  lines.push(
    `再生: ${formatNumber(data.rawMetrics.viewCount)} / ${(data.normalizedMetrics.viewCount * 100).toFixed(0)}%`
  );
  lines.push(
    `マイリスト: ${formatNumber(data.rawMetrics.mylistCount)} / ${(data.normalizedMetrics.mylistCount * 100).toFixed(0)}%`
  );
  lines.push(
    `コメント: ${formatNumber(data.rawMetrics.commentCount)} / ${(data.normalizedMetrics.commentCount * 100).toFixed(0)}%`
  );
  lines.push(
    `いいね: ${formatNumber(data.rawMetrics.likeCount)} / ${(data.normalizedMetrics.likeCount * 100).toFixed(0)}%`
  );
  lines.push("");

  // 代表動画
  if (data.representativeVideo) {
    lines.push("▼ 代表動画");
    lines.push(`${data.representativeVideo.title}`);
    lines.push(
      `投稿: ${formatDate(data.representativeVideo.postedAt)} (${getUploaderTypeLabel(data.representativeVideo.uploaderType)})`
    );
  }

  // 取得日時
  lines.push("");
  lines.push(`取得: ${formatDate(data.fetchedAt)}`);

  return lines.join("\n");
}

function formatNumber(num: number): string {
  return num.toLocaleString("ja-JP");
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getUploaderTypeLabel(type: string): string {
  switch (type) {
    case "danime":
      return "dアニメストア ニコニコ支店";
    case "official":
      return "公式";
    default:
      return "不明";
  }
}

// =============================================================================
// リトライ処理
// =============================================================================

function handleRetryClick(
  badge: BadgeElement,
  title: string,
  callback: RetryCallback
): void {
  const now = Date.now();
  const lastRetry = badge.__cfRanking?.lastRetryTime ?? 0;

  if (now - lastRetry < RETRY_COOLDOWN_MS) {
    logger.debug("Retry cooldown active", { title });
    return;
  }

  if (badge.__cfRanking) {
    badge.__cfRanking.lastRetryTime = now;
  }

  // ローディング状態に変更
  badge.className = "cf-ranking-badge cf-ranking-loading";
  badge.setAttribute("style", LOADING_STYLE);
  badge.innerHTML = createIconHtml(mdiTimerSandEmpty);

  callback(title);
}
