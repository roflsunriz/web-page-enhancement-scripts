import type { PlaybackSettings, RendererSettings } from "@/shared/types";
import type { SettingsManager } from "@/d-anime/services/settings-manager";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";
import { svgPalette, svgComment, svgLock } from "@/shared/icons/mdi";
import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnime:PlayerControlButton");

const BTN_HOST_ID = "danime-pcb-host";
const MOUNT_RETRY_MS = 100;

export class PlayerControlButton {
  private btnWrapper: HTMLDivElement | null = null;
  private panelShadowRoot: ShadowRoot | null = null;
  private isOpen = false;
  private mountRetryTimer: number | null = null;
  private settingsObserver: ((s: RendererSettings) => void) | null = null;
  private playbackObserver: ((s: PlaybackSettings) => void) | null = null;
  private outsideClickHandler: ((e: PointerEvent) => void) | null = null;

  constructor(private readonly settingsManager: SettingsManager) {}

  mount(): void {
    if (document.getElementById(BTN_HOST_ID)) {
      return;
    }
    const settingBtn = document.querySelector(DANIME_SELECTORS.watchSettingButton);
    if (!settingBtn) {
      this.mountRetryTimer = window.setTimeout(() => { this.mount(); }, MOUNT_RETRY_MS);
      return;
    }
    this.injectButton(settingBtn);
    logger.info("playerControlButton:mounted");
  }

  destroy(): void {
    if (this.mountRetryTimer !== null) {
      window.clearTimeout(this.mountRetryTimer);
      this.mountRetryTimer = null;
    }
    if (this.settingsObserver) {
      this.settingsManager.removeObserver(this.settingsObserver);
      this.settingsObserver = null;
    }
    if (this.playbackObserver) {
      this.settingsManager.removePlaybackObserver(this.playbackObserver);
      this.playbackObserver = null;
    }
    this.closePanel();
    this.btnWrapper?.remove();
    this.btnWrapper = null;
    this.panelShadowRoot = null;
    logger.info("playerControlButton:destroyed");
  }

  private injectButton(settingBtn: Element): void {
    const wrapper = document.createElement("div");
    wrapper.id = BTN_HOST_ID;
    wrapper.className = "mainButton";
    wrapper.style.cssText = "position:relative;z-index:500;cursor:pointer";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "コメント設定";
    btn.setAttribute("aria-label", "コメント設定パネルを開く");
    btn.setAttribute("aria-expanded", "false");
    btn.style.cssText = [
      "width:100%", "height:100%", "background:transparent", "border:none",
      "cursor:pointer", "padding:0", "display:flex", "align-items:center",
      "justify-content:center", "color:inherit",
    ].join(";");
    btn.innerHTML = svgPalette;

    const panelHost = document.createElement("div");
    const shadow = panelHost.attachShadow({ mode: "open" });
    this.panelShadowRoot = shadow;

    wrapper.appendChild(btn);
    wrapper.appendChild(panelHost);
    settingBtn.insertAdjacentElement("beforebegin", wrapper);
    this.btnWrapper = wrapper;

    this.buildPanel(shadow);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.togglePanel();
    });
    this.registerObservers();
  }

  private buildPanel(shadow: ShadowRoot): void {
    const settings = this.settingsManager.getSettings();
    const playback = this.settingsManager.getPlaybackSettings();

    const style = document.createElement("style");
    style.textContent = this.getPanelCSS();
    shadow.appendChild(style);

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("hidden", "");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "コメント設定");
    panel.innerHTML = this.buildPanelHTML(settings, playback);
    shadow.appendChild(panel);

    this.bindPanelEvents(shadow);
  }

  private getPanelCSS(): string {
    return `
      :host {
        display: block;
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 260px;
        z-index: 300;
        pointer-events: none;
      }
      .panel {
        pointer-events: auto;
        background: rgba(18, 20, 46, 0.97);
        color: #e8eaff;
        font: 12px/1.6 sans-serif;
        padding: 12px 14px;
        border-radius: 10px 10px 0 10px;
        border: 1px solid rgba(80, 110, 220, 0.7);
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.8);
        box-sizing: border-box;
        width: 260px;
      }
      .panel[hidden] { display: none; }
      .panel__title {
        font-size: 11px;
        font-weight: 700;
        color: rgba(200, 210, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(80, 110, 220, 0.3);
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
      }
      .row + .row { border-top: 1px solid rgba(255, 255, 255, 0.06); }
      .row__label {
        font-size: 12px;
        color: #c8d0ff;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .row__label svg { opacity: 0.7; flex-shrink: 0; }
      .toggle {
        position: relative;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
      }
      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }
      .toggle__track {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        transition: background 0.2s;
        cursor: pointer;
      }
      .toggle__thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
        pointer-events: none;
      }
      .toggle input:checked ~ .toggle__track { background: #7F5AF0; }
      .toggle input:checked ~ .toggle__thumb { transform: translateX(16px); }
      .toggle input:focus-visible ~ .toggle__track {
        outline: 2px solid #7F5AF0;
        outline-offset: 2px;
      }
      .color-picker {
        width: 28px;
        height: 22px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        cursor: pointer;
        background: none;
      }
      .slider-wrap {
        flex: 1;
        margin-left: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .slider {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.2);
        outline: none;
        cursor: pointer;
      }
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #7F5AF0;
        cursor: pointer;
      }
      .slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        background: #7F5AF0;
        cursor: pointer;
      }
      .slider:disabled { opacity: 0.35; cursor: not-allowed; }
      .slider:disabled::-webkit-slider-thumb { cursor: not-allowed; }
      .slider:disabled::-moz-range-thumb { cursor: not-allowed; }
      .slider__value {
        font-size: 11px;
        color: rgba(200, 210, 255, 0.8);
        min-width: 34px;
        text-align: right;
        white-space: nowrap;
      }
      .section-title {
        font-size: 10px;
        color: rgba(200, 210, 255, 0.5);
        margin: 8px 0 2px;
        padding-top: 8px;
        border-top: 1px solid rgba(80, 110, 220, 0.2);
      }
      .speed-range-row {
        padding: 4px 0 2px;
        display: flex;
        align-items: center;
      }
      .speed-range-row .slider-wrap { margin-left: 0; }
    `;
  }

  private buildPanelHTML(settings: RendererSettings, playback: PlaybackSettings): string {
    const visIcon = settings.isCommentVisible ? svgComment : svgLock;
    const opacityPct = Math.round((settings.commentOpacity ?? 1) * 100);
    const speedVal = playback.fixedRate.toFixed(2);
    const speedDisabled = playback.fixedModeEnabled ? "" : "disabled";

    return `
      <p class="panel__title">コメント設定</p>

      <div class="row">
        <span class="row__label">
          <span id="pcb-vis-icon">${visIcon}</span>コメント表示
        </span>
        <label class="toggle" aria-label="コメント表示切替">
          <input type="checkbox" id="pcb-visibility" ${settings.isCommentVisible ? "checked" : ""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="row">
        <span class="row__label">カラー</span>
        <input type="color" id="pcb-color" class="color-picker"
               value="${settings.commentColor}" title="コメントカラー">
      </div>

      <div class="row">
        <span class="row__label">不透明度</span>
        <div class="slider-wrap">
          <input type="range" id="pcb-opacity" class="slider"
                 min="0.1" max="1" step="0.05" value="${settings.commentOpacity ?? 1}">
          <span class="slider__value" id="pcb-opacity-val">${opacityPct}%</span>
        </div>
      </div>

      <p class="section-title">再生速度</p>

      <div class="row">
        <span class="row__label">速度固定</span>
        <label class="toggle" aria-label="再生速度固定ON/OFF">
          <input type="checkbox" id="pcb-speed-mode" ${playback.fixedModeEnabled ? "checked" : ""}>
          <span class="toggle__track"></span>
          <span class="toggle__thumb"></span>
        </label>
      </div>

      <div class="speed-range-row">
        <div class="slider-wrap">
          <input type="range" id="pcb-speed-range" class="slider"
                 min="1.0" max="1.5" step="0.01" value="${speedVal}" ${speedDisabled}>
          <span class="slider__value" id="pcb-speed-val">${speedVal}×</span>
        </div>
      </div>
    `;
  }

  private bindPanelEvents(shadow: ShadowRoot): void {
    const visibilityInput = shadow.getElementById("pcb-visibility") as HTMLInputElement | null;
    visibilityInput?.addEventListener("change", () => {
      const visIcon = shadow.getElementById("pcb-vis-icon");
      if (visIcon) {
        visIcon.innerHTML = visibilityInput.checked ? svgComment : svgLock;
      }
      this.settingsManager.updateSettings({ isCommentVisible: visibilityInput.checked });
    });

    const colorInput = shadow.getElementById("pcb-color") as HTMLInputElement | null;
    colorInput?.addEventListener("input", () => {
      this.settingsManager.updateSettings({ commentColor: colorInput.value });
    });

    const opacityInput = shadow.getElementById("pcb-opacity") as HTMLInputElement | null;
    const opacityValEl = shadow.getElementById("pcb-opacity-val");
    opacityInput?.addEventListener("input", () => {
      const value = parseFloat(opacityInput.value);
      if (opacityValEl) opacityValEl.textContent = `${Math.round(value * 100)}%`;
      this.settingsManager.updateSettings({ commentOpacity: value });
    });

    const speedModeInput = shadow.getElementById("pcb-speed-mode") as HTMLInputElement | null;
    const speedRange = shadow.getElementById("pcb-speed-range") as HTMLInputElement | null;
    const speedValEl = shadow.getElementById("pcb-speed-val");

    speedModeInput?.addEventListener("change", () => {
      if (speedRange) speedRange.disabled = !speedModeInput.checked;
      this.settingsManager.updatePlaybackSettings({ fixedModeEnabled: speedModeInput.checked });
    });

    speedRange?.addEventListener("input", () => {
      const value = parseFloat(speedRange.value);
      if (speedValEl) speedValEl.textContent = `${value.toFixed(2)}×`;
      this.settingsManager.updatePlaybackSettings({ fixedRate: value });
    });
  }

  private togglePanel(): void {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  private openPanel(): void {
    const panel = this.panelShadowRoot?.querySelector(".panel");
    const btn = this.btnWrapper?.querySelector("button");
    if (!panel) return;
    panel.removeAttribute("hidden");
    btn?.setAttribute("aria-expanded", "true");
    this.isOpen = true;

    this.outsideClickHandler = (e: PointerEvent) => {
      if (!this.btnWrapper?.contains(e.target as Node)) {
        this.closePanel();
      }
    };
    window.setTimeout(() => {
      if (this.outsideClickHandler) {
        document.addEventListener("pointerdown", this.outsideClickHandler);
      }
    }, 0);
  }

  private closePanel(): void {
    const panel = this.panelShadowRoot?.querySelector(".panel");
    const btn = this.btnWrapper?.querySelector("button");
    panel?.setAttribute("hidden", "");
    btn?.setAttribute("aria-expanded", "false");
    this.isOpen = false;

    if (this.outsideClickHandler) {
      document.removeEventListener("pointerdown", this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
  }

  private registerObservers(): void {
    this.settingsObserver = (settings: RendererSettings) => {
      this.syncSettingsToPanel(settings);
    };
    this.settingsManager.addObserver(this.settingsObserver);

    this.playbackObserver = (playback: PlaybackSettings) => {
      this.syncPlaybackToPanel(playback);
    };
    this.settingsManager.addPlaybackObserver(this.playbackObserver);
  }

  private syncSettingsToPanel(settings: RendererSettings): void {
    const shadow = this.panelShadowRoot;
    if (!shadow) return;

    const visibilityInput = shadow.getElementById("pcb-visibility") as HTMLInputElement | null;
    if (visibilityInput) visibilityInput.checked = settings.isCommentVisible;

    const visIcon = shadow.getElementById("pcb-vis-icon");
    if (visIcon) visIcon.innerHTML = settings.isCommentVisible ? svgComment : svgLock;

    const colorInput = shadow.getElementById("pcb-color") as HTMLInputElement | null;
    if (colorInput) colorInput.value = settings.commentColor;

    const opacityInput = shadow.getElementById("pcb-opacity") as HTMLInputElement | null;
    const opacityValEl = shadow.getElementById("pcb-opacity-val");
    if (opacityInput) opacityInput.value = String(settings.commentOpacity ?? 1);
    if (opacityValEl) {
      opacityValEl.textContent = `${Math.round((settings.commentOpacity ?? 1) * 100)}%`;
    }
  }

  private syncPlaybackToPanel(playback: PlaybackSettings): void {
    const shadow = this.panelShadowRoot;
    if (!shadow) return;

    const speedModeInput = shadow.getElementById("pcb-speed-mode") as HTMLInputElement | null;
    if (speedModeInput) speedModeInput.checked = playback.fixedModeEnabled;

    const speedRange = shadow.getElementById("pcb-speed-range") as HTMLInputElement | null;
    if (speedRange) {
      speedRange.disabled = !playback.fixedModeEnabled;
      speedRange.value = playback.fixedRate.toFixed(2);
    }

    const speedValEl = shadow.getElementById("pcb-speed-val");
    if (speedValEl) speedValEl.textContent = `${playback.fixedRate.toFixed(2)}×`;
  }
}
