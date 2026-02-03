/**
 * コントロールパネルUI
 *
 * - ShadowDOMで実装（スタイル分離）
 * - TTLスライダー＋プリセット選択
 * - マニュアル再調査ボタン
 * - 表示ON/OFFトグルスイッチ
 */

import { createLogger } from "@/shared/logger";
import { renderMdiSvg } from "@/shared/icons/mdi";
import { mdiRefresh, mdiCog } from "@mdi/js";
import type { Settings } from "@/shared/types/d-anime-cf-ranking";
import {
  TTL_PRESETS,
  TTL_MIN_HOURS,
  TTL_MAX_HOURS,
} from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:ControlPanel");

// =============================================================================
// 型定義
// =============================================================================

/** コントロールパネルのコールバック */
export interface ControlPanelCallbacks {
  /** 設定変更時 */
  onSettingsChange: (settings: Settings) => void;
  /** 再調査トリガー */
  onRefreshTrigger: () => void;
}

/** コントロールパネルのハンドル */
export interface ControlPanelHandle {
  /** パネル要素 */
  element: HTMLElement;
  /** 設定を更新する */
  updateSettings: (settings: Settings) => void;
  /** 進捗状態を更新する */
  updateProgress: (current: number, total: number) => void;
  /** リフレッシュ中状態を設定する */
  setRefreshing: (isRefreshing: boolean) => void;
}

// =============================================================================
// スタイル定義
// =============================================================================

const PANEL_STYLES = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .cf-ranking-panel {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 1px solid #0f3460;
    border-radius: 12px;
    padding: 16px;
    margin: 16px auto;
    max-width: 800px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    color: #e0e0e0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .panel-title svg {
    fill: #e94560;
  }

  .toggle-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-label {
    font-size: 12px;
    color: #aaa;
  }

  .toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: #333;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .toggle-switch.active {
    background: #e94560;
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .toggle-switch.active::after {
    transform: translateX(20px);
  }

  .panel-body {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }

  .panel-body.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .control-section {
    flex: 1;
    min-width: 200px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  /* TTLコントロール */
  .ttl-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 12px;
  }

  .ttl-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ttl-slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #333;
    border-radius: 3px;
    outline: none;
  }

  .ttl-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #e94560;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .ttl-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .ttl-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #e94560;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .ttl-value {
    min-width: 60px;
    text-align: right;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .ttl-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ttl-preset-btn {
    padding: 4px 10px;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: #ccc;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ttl-preset-btn:hover {
    background: rgba(233, 69, 96, 0.3);
    border-color: #e94560;
  }

  .ttl-preset-btn.active {
    background: #e94560;
    border-color: #e94560;
    color: #fff;
  }

  /* リフレッシュボタン */
  .refresh-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #e94560 0%, #c73659 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .refresh-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
  }

  .refresh-btn:disabled {
    background: #444;
    cursor: not-allowed;
  }

  .refresh-btn svg {
    fill: currentColor;
  }

  .refresh-btn.refreshing svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .progress-text {
    font-size: 11px;
    color: #888;
    text-align: center;
  }

  /* レスポンシブ */
  @media (max-width: 600px) {
    .cf-ranking-panel {
      margin: 8px;
      padding: 12px;
    }

    .panel-body {
      flex-direction: column;
    }

    .control-section {
      width: 100%;
    }
  }
`;

// =============================================================================
// コントロールパネル作成
// =============================================================================

/**
 * コントロールパネルを作成する
 */
export function createControlPanel(
  initialSettings: Settings,
  callbacks: ControlPanelCallbacks
): ControlPanelHandle {
  // ホスト要素作成
  const host = document.createElement("div");
  host.className = "cf-ranking-control-panel-host";

  // Shadow DOM作成
  const shadow = host.attachShadow({ mode: "open" });

  // スタイル注入
  const style = document.createElement("style");
  style.textContent = PANEL_STYLES;
  shadow.appendChild(style);

  // パネルコンテナ作成
  const panel = document.createElement("div");
  panel.className = "cf-ranking-panel";
  panel.innerHTML = buildPanelHTML(initialSettings);
  shadow.appendChild(panel);

  // 要素参照取得
  const toggleSwitch = panel.querySelector<HTMLElement>(".toggle-switch");
  const panelBody = panel.querySelector<HTMLElement>(".panel-body");
  const ttlSlider = panel.querySelector<HTMLInputElement>(".ttl-slider");
  const ttlValue = panel.querySelector<HTMLElement>(".ttl-value");
  const presetBtns = panel.querySelectorAll<HTMLButtonElement>(".ttl-preset-btn");
  const refreshBtn = panel.querySelector<HTMLButtonElement>(".refresh-btn");
  const progressText = panel.querySelector<HTMLElement>(".progress-text");

  // 現在の設定を保持
  let currentSettings = { ...initialSettings };

  // ==========================================================================
  // イベントハンドラー
  // ==========================================================================

  // トグルスイッチ
  toggleSwitch?.addEventListener("click", () => {
    currentSettings.enabled = !currentSettings.enabled;
    updateToggleState();
    updateBodyState();
    callbacks.onSettingsChange(currentSettings);
  });

  // TTLスライダー
  ttlSlider?.addEventListener("input", () => {
    const hours = parseInt(ttlSlider.value, 10);
    currentSettings.cacheTtlHours = hours;
    updateTtlDisplay();
    updatePresetButtons();
  });

  ttlSlider?.addEventListener("change", () => {
    callbacks.onSettingsChange(currentSettings);
  });

  // プリセットボタン
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const hours = parseInt(btn.dataset["hours"] ?? "24", 10);
      currentSettings.cacheTtlHours = hours;
      if (ttlSlider) {
        ttlSlider.value = String(hours);
      }
      updateTtlDisplay();
      updatePresetButtons();
      callbacks.onSettingsChange(currentSettings);
    });
  });

  // リフレッシュボタン
  refreshBtn?.addEventListener("click", () => {
    callbacks.onRefreshTrigger();
  });

  // ==========================================================================
  // UI更新関数
  // ==========================================================================

  function updateToggleState(): void {
    if (currentSettings.enabled) {
      toggleSwitch?.classList.add("active");
    } else {
      toggleSwitch?.classList.remove("active");
    }
  }

  function updateBodyState(): void {
    if (currentSettings.enabled) {
      panelBody?.classList.remove("disabled");
    } else {
      panelBody?.classList.add("disabled");
    }
  }

  function updateTtlDisplay(): void {
    if (ttlValue) {
      ttlValue.textContent = formatTtlValue(currentSettings.cacheTtlHours);
    }
  }

  function updatePresetButtons(): void {
    presetBtns.forEach((btn) => {
      const hours = parseInt(btn.dataset["hours"] ?? "0", 10);
      if (hours === currentSettings.cacheTtlHours) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // 初期状態を反映
  updateToggleState();
  updateBodyState();
  updateTtlDisplay();
  updatePresetButtons();

  logger.info("Control panel created", { settings: currentSettings });

  // ==========================================================================
  // ハンドル返却
  // ==========================================================================

  return {
    element: host,

    updateSettings(settings: Settings): void {
      currentSettings = { ...settings };
      if (ttlSlider) {
        ttlSlider.value = String(settings.cacheTtlHours);
      }
      updateToggleState();
      updateBodyState();
      updateTtlDisplay();
      updatePresetButtons();
    },

    updateProgress(current: number, total: number): void {
      if (progressText) {
        if (total > 0) {
          const percent = Math.round((current / total) * 100);
          progressText.textContent = `${current} / ${total} 作品取得済み (${percent}%)`;
        } else {
          progressText.textContent = "";
        }
      }
    },

    setRefreshing(isRefreshing: boolean): void {
      if (refreshBtn) {
        refreshBtn.disabled = isRefreshing;
        if (isRefreshing) {
          refreshBtn.classList.add("refreshing");
          refreshBtn.innerHTML = `${renderMdiSvg(mdiRefresh, 16)} 取得中...`;
        } else {
          refreshBtn.classList.remove("refreshing");
          refreshBtn.innerHTML = `${renderMdiSvg(mdiRefresh, 16)} 全作品を再取得`;
        }
      }
    },
  };
}

// =============================================================================
// ヘルパー関数
// =============================================================================

function buildPanelHTML(settings: Settings): string {
  const toggleActiveClass = settings.enabled ? "active" : "";
  const bodyDisabledClass = settings.enabled ? "" : "disabled";

  const presetButtonsHTML = TTL_PRESETS.map((preset) => {
    const activeClass = preset.hours === settings.cacheTtlHours ? "active" : "";
    return `<button class="ttl-preset-btn ${activeClass}" data-hours="${preset.hours}">${preset.label}</button>`;
  }).join("");

  return `
    <div class="panel-header">
      <div class="panel-title">
        ${renderMdiSvg(mdiCog, 18)}
        <span>ニコニコランキング設定</span>
      </div>
      <div class="toggle-container">
        <span class="toggle-label">表示</span>
        <div class="toggle-switch ${toggleActiveClass}" role="switch" aria-checked="${settings.enabled}">
        </div>
      </div>
    </div>
    <div class="panel-body ${bodyDisabledClass}">
      <div class="control-section">
        <div class="section-title">キャッシュ有効期限 (TTL)</div>
        <div class="ttl-container">
          <div class="ttl-slider-row">
            <input type="range" class="ttl-slider" 
                   min="${TTL_MIN_HOURS}" max="${TTL_MAX_HOURS}" 
                   value="${settings.cacheTtlHours}" step="1">
            <div class="ttl-value">${formatTtlValue(settings.cacheTtlHours)}</div>
          </div>
          <div class="ttl-presets">
            ${presetButtonsHTML}
          </div>
        </div>
      </div>
      <div class="control-section">
        <div class="section-title">データ更新</div>
        <div class="refresh-container">
          <button class="refresh-btn">
            ${renderMdiSvg(mdiRefresh, 16)}
            全作品を再取得
          </button>
          <div class="progress-text"></div>
        </div>
      </div>
    </div>
  `;
}

function formatTtlValue(hours: number): string {
  if (hours < 24) {
    return `${hours}時間`;
  } else if (hours < 168) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days}日`;
    }
    return `${days}日${remainingHours}時間`;
  } else {
    const weeks = Math.floor(hours / 168);
    return `${weeks}週間`;
  }
}

// =============================================================================
// 挿入位置検出
// =============================================================================

/**
 * CFページ用の挿入位置を検出する
 * - 通常CFページ: #kokuchi_txt の後
 * - shinbanページ: バナー画像の後
 */
export function findInsertionPoint(): { target: Element; position: InsertPosition } | null {
  // shinbanページ（アンケート結果発表バナーの後）
  const isShinbanPage = window.location.pathname.includes("shinban-");
  
  if (isShinbanPage) {
    // shinbanページ: 最初のバナー画像を探す
    const bannerContainer = document.querySelector('.contentsWrapper > div[style*="max-width"]');
    if (bannerContainer) {
      logger.info("Found insertion point (shinban page): banner container");
      return { target: bannerContainer, position: "afterend" };
    }
  }

  // 通常CFページ: #kokuchi_txt の後
  const kokuchiTxt = document.getElementById("kokuchi_txt");
  if (kokuchiTxt) {
    logger.info("Found insertion point (CF page): #kokuchi_txt");
    return { target: kokuchiTxt, position: "afterend" };
  }

  // フォールバック: .contentsWrapper の先頭
  const contentsWrapper = document.querySelector(".contentsWrapper");
  if (contentsWrapper) {
    logger.info("Found insertion point (fallback): .contentsWrapper");
    return { target: contentsWrapper, position: "afterbegin" };
  }

  logger.warn("No insertion point found");
  return null;
}

/**
 * コントロールパネルをページに挿入する
 */
export function insertControlPanel(handle: ControlPanelHandle): boolean {
  const insertionPoint = findInsertionPoint();
  
  if (!insertionPoint) {
    logger.error("Failed to find insertion point for control panel");
    return false;
  }

  insertionPoint.target.insertAdjacentElement(insertionPoint.position, handle.element);
  logger.info("Control panel inserted into page");
  return true;
}
