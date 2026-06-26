/**
 * 作品ランキング詳細一覧モーダル
 */

import { renderMdiSvg } from "@/shared/icons/mdi";
import { mdiClose, mdiOpenInNew } from "@mdi/js";
import type {
  CacheEntry,
  NicoMetrics,
  RankData,
} from "@/shared/types/d-anime-cf-ranking";

export interface RankingListItem {
  title: string;
  rankData: RankData | null;
  cacheEntry: CacheEntry | null;
}

const MODAL_HOST_CLASS = "cf-ranking-list-modal-host";

const MODAL_STYLES = `
  :host {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(3, 8, 18, 0.72);
  }

  .dialog {
    width: min(1180px, 100%);
    max-height: min(820px, calc(100vh - 48px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #101827;
    color: #eef4ff;
    border: 1px solid rgba(154, 180, 210, 0.28);
    border-radius: 8px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.44);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(154, 180, 210, 0.18);
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .summary {
    margin-top: 4px;
    color: #a9b7ca;
    font-size: 12px;
  }

  .close-btn {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    background: rgba(255, 255, 255, 0.08);
    color: #eef4ff;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 6px;
    cursor: pointer;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  .body {
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(154, 180, 210, 0.14);
    vertical-align: top;
    text-align: left;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #152033;
    color: #b9c7d9;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0;
  }

  td {
    font-size: 12px;
    line-height: 1.45;
  }

  .rank-cell {
    width: 82px;
  }

  .title-cell {
    width: 25%;
  }

  .score-cell {
    width: 92px;
  }

  .metrics-cell {
    width: 260px;
  }

  .video-cell {
    width: 30%;
  }

  .fetched-cell {
    width: 132px;
  }

  .rank {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: #fff;
  }

  .tier {
    min-width: 34px;
    padding: 2px 6px;
    text-align: center;
    color: #101827;
    background: #f3c84d;
    border-radius: 4px;
    font-size: 11px;
  }

  .muted {
    color: #8ea0b8;
  }

  .title-text {
    overflow-wrap: anywhere;
    font-weight: 650;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 10px;
  }

  .metric-label {
    color: #8ea0b8;
  }

  .video-title {
    overflow-wrap: anywhere;
  }

  .video-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    color: #79b8ff;
    text-decoration: none;
  }

  .video-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 760px) {
    .backdrop {
      align-items: stretch;
      padding: 10px;
    }

    .dialog {
      max-height: calc(100vh - 20px);
    }

    table,
    thead,
    tbody,
    tr,
    th,
    td {
      display: block;
    }

    thead {
      display: none;
    }

    tr {
      padding: 12px;
      border-bottom: 1px solid rgba(154, 180, 210, 0.18);
    }

    td {
      width: auto !important;
      padding: 4px 0;
      border-bottom: 0;
    }
  }
`;

export function openRankingListModal(
  items: RankingListItem[],
  isRankingFinalized: boolean
): void {
  document.querySelector(`.${MODAL_HOST_CLASS}`)?.remove();

  const host = document.createElement("div");
  host.className = MODAL_HOST_CLASS;
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = MODAL_STYLES;
  shadow.appendChild(style);

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  backdrop.innerHTML = buildModalHtml(items, isRankingFinalized);
  shadow.appendChild(backdrop);

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      close();
    }
  };

  const close = (): void => {
    document.removeEventListener("keydown", handleKeydown);
    host.remove();
  };

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      close();
    }
  });

  shadow.querySelector<HTMLButtonElement>(".close-btn")?.addEventListener("click", close);

  document.addEventListener("keydown", handleKeydown);

  document.body.appendChild(host);
}

function buildModalHtml(items: RankingListItem[], isRankingFinalized: boolean): string {
  const sortedItems = [...items].sort(compareRankingItems);
  const rankedCount = sortedItems.filter((item) => item.rankData !== null).length;
  const failedCount = sortedItems.filter((item) => item.cacheEntry?.status === "failed").length;
  const pendingCount = sortedItems.length - rankedCount - failedCount;
  const statusText = isRankingFinalized ? "確定" : "暫定";

  return `
    <section class="dialog" role="dialog" aria-modal="true" aria-label="作品詳細ランキング">
      <header class="header">
        <div>
          <h2 class="title">作品詳細ランキング</h2>
          <div class="summary">
            ${statusText} / 対象 ${sortedItems.length}件 / ランク表示 ${rankedCount}件 / 取得失敗 ${failedCount}件 / 未取得 ${pendingCount}件
          </div>
        </div>
        <button class="close-btn" type="button" aria-label="閉じる">
          ${renderMdiSvg(mdiClose, 20)}
        </button>
      </header>
      <div class="body">
        <table>
          <thead>
            <tr>
              <th class="rank-cell">順位</th>
              <th class="title-cell">作品</th>
              <th class="score-cell">スコア</th>
              <th class="metrics-cell">指標</th>
              <th class="video-cell">代表動画</th>
              <th class="fetched-cell">取得日時</th>
            </tr>
          </thead>
          <tbody>
            ${sortedItems.map(renderRow).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function compareRankingItems(a: RankingListItem, b: RankingListItem): number {
  const rankA = a.rankData?.rank ?? Number.MAX_SAFE_INTEGER;
  const rankB = b.rankData?.rank ?? Number.MAX_SAFE_INTEGER;
  if (rankA !== rankB) {
    return rankA - rankB;
  }
  return a.title.localeCompare(b.title, "ja-JP");
}

function renderRow(item: RankingListItem): string {
  const rankData = item.rankData;
  const cacheEntry = item.cacheEntry;
  const metrics = cacheEntry?.metrics;

  return `
    <tr>
      <td class="rank-cell">${renderRank(rankData, cacheEntry)}</td>
      <td class="title-cell"><div class="title-text">${escapeHtml(item.title)}</div></td>
      <td class="score-cell">${rankData ? `${(rankData.score.totalScore * 100).toFixed(1)}点` : '<span class="muted">-</span>'}</td>
      <td class="metrics-cell">${metrics ? renderMetrics(metrics) : '<span class="muted">-</span>'}</td>
      <td class="video-cell">${renderRepresentativeVideo(cacheEntry)}</td>
      <td class="fetched-cell">${cacheEntry ? formatDate(cacheEntry.fetchedAt) : '<span class="muted">未取得</span>'}</td>
    </tr>
  `;
}

function renderRank(rankData: RankData | null, cacheEntry: CacheEntry | null): string {
  if (rankData) {
    return `
      <span class="rank">
        <span class="tier">${escapeHtml(rankData.tier)}</span>
        第${rankData.rank}位
      </span>
    `;
  }

  if (cacheEntry?.status === "failed") {
    return '<span class="muted">取得失敗</span>';
  }

  return '<span class="muted">未取得</span>';
}

function renderMetrics(metrics: NicoMetrics): string {
  return `
    <div class="metrics-grid">
      <span><span class="metric-label">再生</span> ${formatNumber(metrics.viewCount)}</span>
      <span><span class="metric-label">コメ</span> ${formatNumber(metrics.commentCount)}</span>
      <span><span class="metric-label">マイリス</span> ${formatNumber(metrics.mylistCount)}</span>
      <span><span class="metric-label">いいね</span> ${formatNumber(metrics.likeCount)}</span>
    </div>
  `;
}

function renderRepresentativeVideo(cacheEntry: CacheEntry | null): string {
  const video = cacheEntry?.representativeVideo;
  if (!video) {
    return cacheEntry?.failureReason
      ? `<span class="muted">${escapeHtml(cacheEntry.failureReason)}</span>`
      : '<span class="muted">-</span>';
  }

  const videoUrl = `https://www.nicovideo.jp/watch/${encodeURIComponent(video.videoId)}`;

  return `
    <div class="video-title">${escapeHtml(video.title)}</div>
    <div class="muted">${escapeHtml(video.uploaderName)} / ${formatDate(video.postedAt)}</div>
    <a class="video-link" href="${videoUrl}" target="_blank" rel="noopener noreferrer">
      ${renderMdiSvg(mdiOpenInNew, 14)}
      ${escapeHtml(video.videoId)}
    </a>
  `;
}

function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP");
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("ja-JP", {
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
