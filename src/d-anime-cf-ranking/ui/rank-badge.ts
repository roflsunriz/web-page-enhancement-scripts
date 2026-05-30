/**
 * 順位バッジUI
 *
 * - 「第{rank}位」表示
 * - ランク色分け（金属光沢グラデーション）
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

interface TierColor {
  background: string;
  text: string;
  border: string;
  shadow: string;
  textShadow: string;
}

/** ランク帯別の金属光沢色定義 */
const TIER_COLORS: Record<RankTier, TierColor> = {
  "S+++": {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 24%, rgba(255,255,255,0.55) 38%, rgba(255,255,255,0) 52%), linear-gradient(135deg, #6f4300 0%, #c98900 16%, #fff3a6 34%, #d99a00 50%, #fff8cf 64%, #b47500 78%, #f7c94a 100%)",
    text: "#241700",
    border: "#9f6a00",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(84,51,0,0.42), 0 1px 4px rgba(160,105,0,0.34)",
    textShadow: "0 1px 0 rgba(255,255,255,0.45)",
  },
  "S++": {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.3) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.48) 39%, rgba(255,255,255,0) 53%), linear-gradient(135deg, #7c5200 0%, #d39a10 18%, #ffe887 34%, #c88700 50%, #fff4b8 65%, #a96b00 80%, #eeb735 100%)",
    text: "#241700",
    border: "#a16f08",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.68), inset 0 -1px 0 rgba(86,56,0,0.4), 0 1px 4px rgba(150,100,0,0.3)",
    textShadow: "0 1px 0 rgba(255,255,255,0.42)",
  },
  "S+": {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.44) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #8a6500 0%, #d6a619 18%, #ffe27a 34%, #be8500 50%, #fff1a8 66%, #9f7000 80%, #e4ad26 100%)",
    text: "#241700",
    border: "#a5790a",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.64), inset 0 -1px 0 rgba(88,63,0,0.38), 0 1px 4px rgba(135,96,0,0.26)",
    textShadow: "0 1px 0 rgba(255,255,255,0.4)",
  },
  "S": {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.26) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #957100 0%, #d1a124 18%, #ffdc6b 34%, #b98300 50%, #f7e49a 66%, #946800 80%, #d9a42a 100%)",
    text: "#261a00",
    border: "#9d750c",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(84,62,0,0.36), 0 1px 4px rgba(120,90,0,0.24)",
    textShadow: "0 1px 0 rgba(255,255,255,0.38)",
  },
  A: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.34) 13%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.58) 39%, rgba(255,255,255,0) 54%), linear-gradient(135deg, #777b80 0%, #c8ccd0 18%, #f7f8f8 34%, #a4a9ad 50%, #ffffff 64%, #8c9196 78%, #d8dbde 100%)",
    text: "#1e2328",
    border: "#8d9398",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(66,72,78,0.36), 0 1px 4px rgba(90,96,102,0.26)",
    textShadow: "0 1px 0 rgba(255,255,255,0.55)",
  },
  B: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.22) 14%, rgba(255,255,255,0) 26%, rgba(255,255,255,0.36) 41%, rgba(255,255,255,0) 55%), linear-gradient(135deg, #5b2e10 0%, #a85d25 18%, #e0a05b 34%, #8a4519 50%, #f0be7b 66%, #6d3512 82%, #bd7430 100%)",
    text: "#fffaf3",
    border: "#7a3c15",
    shadow: "inset 0 1px 0 rgba(255,235,202,0.52), inset 0 -1px 0 rgba(45,22,7,0.52), 0 1px 4px rgba(95,48,17,0.32)",
    textShadow: "0 1px 1px rgba(45,22,7,0.72)",
  },
  C: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.18) 14%, rgba(255,255,255,0) 27%, rgba(255,255,255,0.3) 42%, rgba(255,255,255,0) 56%), linear-gradient(135deg, #70411f 0%, #b06f3e 20%, #dda06b 36%, #97582e 52%, #e5b88a 68%, #7e4926 84%, #c78b57 100%)",
    text: "#fff8ef",
    border: "#8a4f29",
    shadow: "inset 0 1px 0 rgba(255,231,206,0.48), inset 0 -1px 0 rgba(62,35,18,0.42), 0 1px 4px rgba(105,60,32,0.24)",
    textShadow: "0 1px 1px rgba(62,35,18,0.62)",
  },
  D: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.2) 14%, rgba(255,255,255,0) 27%, rgba(255,255,255,0.34) 42%, rgba(255,255,255,0) 56%), linear-gradient(135deg, #90603c 0%, #c18b60 20%, #e5b58a 36%, #ad744a 52%, #efd0ae 68%, #9c6944 84%, #d3a070 100%)",
    text: "#2c1708",
    border: "#a56e45",
    shadow: "inset 0 1px 0 rgba(255,238,221,0.56), inset 0 -1px 0 rgba(92,57,33,0.34), 0 1px 4px rgba(125,82,52,0.2)",
    textShadow: "0 1px 0 rgba(255,242,226,0.48)",
  },
  E: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.24) 14%, rgba(255,255,255,0) 27%, rgba(255,255,255,0.38) 42%, rgba(255,255,255,0) 56%), linear-gradient(135deg, #b18a6a 0%, #d1ad8c 20%, #ecd2b7 36%, #c09978 52%, #f4e1cf 68%, #b99172 84%, #dfbea0 100%)",
    text: "#332014",
    border: "#bc9677",
    shadow: "inset 0 1px 0 rgba(255,246,238,0.62), inset 0 -1px 0 rgba(116,84,61,0.28), 0 1px 4px rgba(140,104,78,0.16)",
    textShadow: "0 1px 0 rgba(255,247,240,0.55)",
  },
  F: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.3) 14%, rgba(255,255,255,0) 27%, rgba(255,255,255,0.44) 42%, rgba(255,255,255,0) 56%), linear-gradient(135deg, #d0b9a5 0%, #e1cbb7 20%, #f4e5d7 36%, #d4bba6 52%, #fbefe6 68%, #cbb29e 84%, #ead7c5 100%)",
    text: "#3a2a20",
    border: "#cdb5a1",
    shadow: "inset 0 1px 0 rgba(255,250,246,0.7), inset 0 -1px 0 rgba(140,115,96,0.22), 0 1px 4px rgba(150,126,108,0.12)",
    textShadow: "0 1px 0 rgba(255,250,247,0.68)",
  },
  G: {
    background:
      "linear-gradient(115deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.38) 14%, rgba(255,255,255,0) 27%, rgba(255,255,255,0.5) 42%, rgba(255,255,255,0) 56%), linear-gradient(135deg, #eadfd5 0%, #f3e8df 20%, #fffaf6 36%, #e7d9ce 52%, #ffffff 68%, #e2d5cb 84%, #f8efe7 100%)",
    text: "#463b34",
    border: "#ddd0c7",
    shadow: "inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(160,145,134,0.18), 0 1px 3px rgba(150,136,126,0.1)",
    textShadow: "0 1px 0 rgba(255,255,255,0.78)",
  },
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
    background: ${colors.background};
    color: ${colors.text};
    border: 2px solid ${colors.border};
    box-shadow: ${colors.shadow};
    text-shadow: ${colors.textShadow};
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
 * バッジに表示するテキストを生成する
 * 形式: "S+++ランク - 第1位(85.5点)"
 */
function formatBadgeText(rankData: RankData, isRankingFinalized: boolean): string {
  const scorePoints = (rankData.score.totalScore * 100).toFixed(1);
  const checkMark = isRankingFinalized ? createCheckIconHtml(mdiCheckCircle) : "";
  return `${rankData.tier} - 第${rankData.rank}位(${scorePoints}点)${checkMark}`;
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
  badge.innerHTML = formatBadgeText(rankData, isRankingFinalized);

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
    badge.innerHTML = formatBadgeText(rankData, isRankingFinalized);
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
