/**
 * 順位バッジUI
 *
 * - 「第{rank}位」表示
 * - ランク色分け（S/A/B/C/D）
 * - ローディング状態（…）
 * - 失敗状態（警告アイコン + リトライボタン）
 * - ホバーツールチップ
 *
 * Note: Reactを使わず、vanilla TSで軽量に実装
 */

import { createLogger } from "@/shared/logger";
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

/** ツールチップのスタイル */
const TOOLTIP_STYLE = `
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: normal;
  white-space: pre-line;
  z-index: 10000;
  pointer-events: none;
  max-width: 300px;
  min-width: 200px;
  line-height: 1.5;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

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
  badge.textContent = "…";
  badge.__cfRanking = { title };

  return badge;
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
  badge.innerHTML = "⚠️";
  badge.__cfRanking = { title, retryCallback };

  // ツールチップ
  const tooltip = createTooltipElement(`取得失敗: ${errorMessage}\nクリックでリトライ`);
  badge.appendChild(tooltip);
  setupTooltipEvents(badge, tooltip);

  // リトライクリックイベント
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
 */
export function createRankBadge(
  title: string,
  rankData: RankData,
  cacheEntry: CacheEntry
): HTMLElement {
  const badge = document.createElement("div") as BadgeElement;
  badge.className = "cf-ranking-badge cf-ranking-rank";
  badge.setAttribute("style", getTierStyle(rankData.tier));
  badge.textContent = `第${rankData.rank}位`;
  badge.__cfRanking = { title };

  // ホバー時に少し大きく
  badge.addEventListener("mouseenter", () => {
    badge.style.transform = "scale(1.1)";
  });
  badge.addEventListener("mouseleave", () => {
    badge.style.transform = "scale(1)";
  });

  // ツールチップ
  const tooltipData = buildTooltipData(rankData, cacheEntry);
  const tooltip = createTooltipElement(formatTooltipContent(tooltipData));
  badge.appendChild(tooltip);
  setupTooltipEvents(badge, tooltip);

  return badge;
}

/**
 * バッジを更新する（ローディング→順位 or エラー）
 */
export function updateBadge(
  badge: HTMLElement,
  rankData: RankData | null,
  cacheEntry: CacheEntry,
  retryCallback?: RetryCallback
): void {
  const badgeEl = badge as BadgeElement;
  const title = badgeEl.__cfRanking?.title ?? cacheEntry.title;

  // 既存の子要素をクリア
  badge.innerHTML = "";

  if (cacheEntry.status === "failed" || !rankData) {
    // エラー状態
    badge.className = "cf-ranking-badge cf-ranking-error";
    badge.setAttribute("style", ERROR_STYLE);
    badge.innerHTML = "⚠️";

    const tooltip = createTooltipElement(
      `取得失敗: ${cacheEntry.failureReason ?? "不明なエラー"}\nクリックでリトライ`
    );
    badge.appendChild(tooltip);
    setupTooltipEvents(badge, tooltip);

    if (retryCallback) {
      badgeEl.__cfRanking = { title, retryCallback };
      badge.onclick = () => handleRetryClick(badgeEl, title, retryCallback);
      badge.style.cursor = "pointer";
    }
  } else {
    // 順位表示
    badge.className = "cf-ranking-badge cf-ranking-rank";
    badge.setAttribute("style", getTierStyle(rankData.tier));
    badge.textContent = `第${rankData.rank}位`;
    badge.onclick = null;
    badge.style.cursor = "pointer";

    const tooltipData = buildTooltipData(rankData, cacheEntry);
    const tooltip = createTooltipElement(formatTooltipContent(tooltipData));
    badge.appendChild(tooltip);
    setupTooltipEvents(badge, tooltip);

    // ホバーエフェクト
    badge.onmouseenter = () => {
      badge.style.transform = "scale(1.1)";
    };
    badge.onmouseleave = () => {
      badge.style.transform = "scale(1)";
    };
  }
}

// =============================================================================
// ツールチップ
// =============================================================================

/**
 * ツールチップ要素を作成する
 */
function createTooltipElement(content: string): HTMLElement {
  const tooltip = document.createElement("div");
  tooltip.className = "cf-ranking-tooltip";
  tooltip.setAttribute("style", TOOLTIP_STYLE + " display: none;");
  tooltip.textContent = content;
  return tooltip;
}

/**
 * ツールチップの表示/非表示イベントを設定する
 */
function setupTooltipEvents(badge: HTMLElement, tooltip: HTMLElement): void {
  badge.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
  });
  badge.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
}

/**
 * TooltipDataを構築する
 */
function buildTooltipData(rankData: RankData, cacheEntry: CacheEntry): TooltipData {
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
  };
}

/**
 * ツールチップの内容をフォーマットする
 */
function formatTooltipContent(data: TooltipData): string {
  const lines: string[] = [];

  // 順位
  lines.push(`【${data.tier}ランク】第${data.rank}位 / ${data.totalCount}作品中`);
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

/**
 * 数値をフォーマットする（千単位でカンマ区切り）
 */
function formatNumber(num: number): string {
  return num.toLocaleString("ja-JP");
}

/**
 * 日付をフォーマットする
 */
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

/**
 * 投稿者種別のラベルを取得する
 */
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

/**
 * リトライクリックを処理する（クールダウン付き）
 */
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
  badge.innerHTML = "…";

  callback(title);
}
