import { logger } from "./logger.js";
import { state } from "./state.js";
import { renderMdiSvg } from "../shared/icons/mdi.js";
import { mdiContentCopy, mdiClipboardTextOutline, mdiProgressClock } from "@mdi/js";
import { TWITTER_SELECTORS } from "@/shared/constants/twitter";

type ButtonAction = "copy" | "clipboard";

/**
 * SVG icons used in the UI (from @mdi/js, Apache-2.0).
 */
const ICONS = {
	LOADING: renderMdiSvg(mdiProgressClock),
	CLIPBOARD: renderMdiSvg(mdiClipboardTextOutline),
	COPY: renderMdiSvg(mdiContentCopy),
};

/**
 * UIの状態とDOM要素を管理するクラス
 */
class UIManager {
  private shadowRoot: ShadowRoot | null = null;
  private container: HTMLDivElement | null = null;
  private floatingContainer: HTMLDivElement | null = null;
  private dragState:
    | {
        pointerId: number;
        startX: number;
        startY: number;
        initialTop: number;
        initialLeft: number;
        moved: boolean;
      }
    | null = null;
	private customPosition: { top: number; left: number } | null = null;
  private ignoreNextClick = false;
  private mainButton: HTMLButtonElement | null = null;
  private controlPanel: HTMLDivElement | null = null;
  private hoverInteractionConfigured = false;
  private hoverPointerCount = 0;
  private hoverHideTimeout: number | null = null;
	private readonly storageKey = "twitter-thread-copier-ui-position";
  private readonly handleResize = (): void => {
    if (!this.floatingContainer || !this.customPosition) {
      return;
    }
    const { top, left } = this.clampPosition(
      this.customPosition.top,
      this.customPosition.left,
      this.floatingContainer,
    );
    this.applyPosition(top, left, this.floatingContainer);
  };

  public init(): void {
    if (this.shadowRoot) {
      return;
    }

    this.container = document.createElement("div");
    this.container.id = "twitter-thread-copier-shadow-host";
    this.container.style.cssText =
      "position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;";

    this.shadowRoot = this.container.attachShadow({ mode: "closed" });
    this.addStyles();
    this.ensureFloatingContainer();

    document.body.appendChild(this.container);
    window.addEventListener("resize", this.handleResize);
    logger.log("Shadow DOM initialized");
  }

  private addStyles(): void {
    if (!this.shadowRoot) {
      return;
    }
    const styleElement = document.createElement("style");
    const tweetArticleSelector = TWITTER_SELECTORS.article;
    styleElement.textContent = `
      .floating-ui-container {
          position: fixed;
          bottom: 100px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          z-index: 9999;
          pointer-events: none;
          user-select: none;
      }
      .floating-ui-container.has-custom-position {
          bottom: auto;
          right: auto;
      }
      .floating-ui-container.dragging {
          cursor: grabbing;
      }
      .floating-ui-container > * {
          pointer-events: auto;
      }
      .copy-thread-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #1DA1F2; /* Twitter Blue */
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 3;
          position: relative;
          touch-action: none;
      }
      .copy-thread-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .copy-thread-button.dragging {
          cursor: grabbing;
      }
      .copy-thread-button:not(.dragging) {
          cursor: grab;
      }
      .copy-thread-button.success { background-color: #4CAF50; }
      .copy-thread-button.ready {
          background-color: #FFC400;
          box-shadow: 0 4px 18px rgba(255, 196, 0, 0.55);
          animation: copy-ready-pulse 1.8s ease-in-out infinite;
      }
      .copy-thread-button.ready::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(255, 232, 124, 0.0);
          box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          opacity: 0.7;
          pointer-events: none;
          animation: copy-ready-wave 1.8s ease-out infinite;
      }
      .copy-thread-button.loading svg { animation: spinning 1.5s linear infinite; }
      .copy-thread-button svg { display: block; }
      .control-panel-container {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
          order: 1;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      }
      .control-panel-container.hover-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(8px);
      }
      .floating-ui-container.show-hover-controls .control-panel-container.hover-hidden {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
      }
      .control-panel-container select, .control-panel-container input { margin-left: 8px; transform: scale(0.96); }
      .control-panel-container label { display: flex; align-items: center; white-space: nowrap; }
      .control-panel-container select { background-color: #333; color: white; border: 1px solid #666; border-radius: 4px; padding: 2px 4px; }
      .copy-thread-button .text {
          position: absolute;
          font-size: 12px;
          white-space: nowrap;
          top: -25px;
          background-color: #333;
          padding: 3px 8px;
          border-radius: 4px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
      }
      .copy-thread-button:hover .text { opacity: 1; visibility: visible; }
      @keyframes spinning { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes copy-ready-pulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(255, 196, 0, 0.45); }
          50% { box-shadow: 0 6px 24px rgba(255, 196, 0, 0.65); }
      }
      @keyframes copy-ready-wave {
          0% {
              transform: scale(1);
              opacity: 0.7;
              box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          }
          70% {
              transform: scale(1.55);
              opacity: 0;
              box-shadow: 0 0 0 18px rgba(255, 232, 124, 0);
          }
          100% {
              transform: scale(1.6);
              opacity: 0;
              box-shadow: 0 0 0 20px rgba(255, 232, 124, 0);
          }
      }
      .copy-toast {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.3s ease;
          pointer-events: none;
          order: 0;
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          will-change: transform, opacity;
      }
      .copy-toast.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
      }
      .toast-title { font-weight: bold; margin-bottom: 5px; }
      .toast-content { font-size: 13px; opacity: 0.9; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
      .start-point-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.1);
          border: 2px solid #1DA1F2;
          color: #1DA1F2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: auto;
          font-size: 14px;
          font-weight: bold;
      }
      ${tweetArticleSelector}:hover .start-point-button { opacity: 1; }
      .start-point-button:hover { background-color: rgba(29, 161, 242, 0.2); transform: scale(1.1); }
      .start-point-button.active { background-color: #1DA1F2; color: white; opacity: 1; }
      .start-point-button.active:hover { background-color: #1991DB; }
      ${tweetArticleSelector}.start-point-set { background-color: rgba(29, 161, 242, 0.05); border: 1px solid rgba(29, 161, 242, 0.2); border-radius: 8px; }
      .select-tweet-button {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.08);
          border: 2px solid rgba(29, 161, 242, 0.4);
          color: #1DA1F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          pointer-events: auto;
          opacity: 0;
          transition: all 0.3s ease;
      }
      ${tweetArticleSelector}:hover .select-tweet-button { opacity: 1; }
      .select-tweet-button:hover { transform: scale(1.1); }
      .select-tweet-button.active {
          background-color: #1DA1F2;
          color: white;
          border-color: #1DA1F2;
          opacity: 1;
      }
      ${tweetArticleSelector}.tweet-selected {
          background-color: rgba(29, 161, 242, 0.04);
          border: 1px solid rgba(29, 161, 242, 0.3);
          border-radius: 8px;
      }
      ${tweetArticleSelector}.tweet-selected.start-point-set {
          box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.12);
      }
      .reset-selection {
          padding: 8px 12px;
          background-color: #5e72e4;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 1;
      }
      .reset-selection.visible { opacity: 1; visibility: visible; }
      .reset-selection:hover { background-color: #4b5cd5; transform: scale(1.05); }
      .reset-start-point {
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 2;
      }
      .reset-start-point.visible { opacity: 1; visibility: visible; }
      .reset-start-point:hover { background-color: #ff5252; transform: scale(1.05); }
    `;
    this.shadowRoot.appendChild(styleElement);
  }

  private querySelector<E extends Element = Element>(selector: string): E | null {
    return this.shadowRoot ? this.shadowRoot.querySelector<E>(selector) : null;
  }

  private appendChild(element: HTMLElement): void {
    const floating = this.ensureFloatingContainer();
    floating.appendChild(element);
  }

  private extractTweetId(tweetElement: HTMLElement): string | null {
    const tweetLink = tweetElement.querySelector<HTMLAnchorElement>(
      'a[href*="/status/"]',
    );
    if (!tweetLink) {
      return null;
    }
    const tweetId = tweetLink.href.split("/").pop()?.split("?")[0] ?? "";
    return tweetId || null;
  }

  public destroy(): void {
    if (this.container) {
      this.container.remove();
    }
    this.shadowRoot = null;
    this.container = null;
    this.floatingContainer = null;
    this.dragState = null;
    this.customPosition = null;
    this.ignoreNextClick = false;
    this.mainButton = null;
    this.controlPanel = null;
    this.hoverInteractionConfigured = false;
    this.hoverPointerCount = 0;
    this.clearHoverHideTimeout();
    window.removeEventListener("resize", this.handleResize);
    state.selectedTweetIds = [];
    logger.log("Shadow DOM destroyed");
  }

  private addSelectionButtons(): void {
    document
      .querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article)
      .forEach((tweetElement) => {
        const tweetId = this.extractTweetId(tweetElement);
        if (!tweetId) {
          return;
        }

        let selectButton = Array.from(tweetElement.children).find((child) =>
          child.classList.contains("select-tweet-button"),
        ) as HTMLButtonElement | undefined;

        if (!selectButton) {
          selectButton = document.createElement("button");
          selectButton.type = "button";
          selectButton.className = "select-tweet-button";
          selectButton.textContent = "+";
          selectButton.title = "このツイートを選択";
          selectButton.dataset.tweetId = tweetId;
          selectButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.toggleTweetSelection(tweetElement, tweetId);
          });
          tweetElement.appendChild(selectButton);
        } else if (!selectButton.dataset.tweetId) {
          selectButton.dataset.tweetId = tweetId;
        }
      });

    this.refreshSelectionIndicators();
  }

  private refreshSelectionIndicators(): void {
    const orderMap = new Map<string, number>();
    state.selectedTweetIds.forEach((id, index) => {
      orderMap.set(id, index + 1);
    });

    document
      .querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article)
      .forEach((tweetElement) => {
        const tweetId = this.extractTweetId(tweetElement);
        if (!tweetId) {
          return;
        }
        const selectButton =
          tweetElement.querySelector<HTMLButtonElement>(".select-tweet-button");
        if (!selectButton) {
          return;
        }

        if (orderMap.has(tweetId)) {
          const order = orderMap.get(tweetId) ?? 0;
          tweetElement.classList.add("tweet-selected");
          selectButton.classList.add("active");
          selectButton.textContent = order > 0 ? order.toString() : "✓";
          selectButton.title = `選択中 (${order})`;
        } else {
          tweetElement.classList.remove("tweet-selected");
          selectButton.classList.remove("active");
          selectButton.textContent = "+";
          selectButton.title = "このツイートを選択";
        }
      });

    this.updateSelectionResetButton();
  }

  private toggleTweetSelection(tweetElement: HTMLElement, tweetId: string): void {
    const alreadySelected = state.selectedTweetIds.includes(tweetId);
    if (alreadySelected) {
      state.selectedTweetIds = state.selectedTweetIds.filter((id) => id !== tweetId);
    } else {
      state.selectedTweetIds = [...state.selectedTweetIds, tweetId];
    }

    if (state.isSecondStage) {
      state.isSecondStage = false;
    }
    state.collectedThreadData = null;

    const selectedCount = state.selectedTweetIds.length;
    const toastMessage =
      selectedCount > 0 ? `${selectedCount}件選択中` : "選択をすべて解除しました";

    this.refreshSelectionIndicators();
    this.updateMainButtonText();

    if (alreadySelected) {
      this.showToast("選択解除", toastMessage);
    } else {
      this.showToast("選択追加", toastMessage);
    }
    logger.log(`Selected tweet ids: ${state.selectedTweetIds.join(",")}`);
  }

  private updateSelectionResetButton(): void {
    let resetButton = this.querySelector<HTMLButtonElement>(".reset-selection");
    if (state.selectedTweetIds.length > 0) {
      if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.className = "reset-selection";
        resetButton.textContent = "選択をリセット";
        resetButton.addEventListener("click", () => this.resetSelection());
        this.appendChild(resetButton as HTMLElement);
      }
      resetButton.classList.add("visible");
    } else {
      resetButton?.classList.remove("visible");
    }
  }

  private resetSelection(): void {
    if (state.selectedTweetIds.length === 0) {
      return;
    }
    state.selectedTweetIds = [];
    if (state.isSecondStage) {
      state.isSecondStage = false;
    }
    state.collectedThreadData = null;
    this.refreshSelectionIndicators();
    this.updateMainButtonText();
    this.showToast("選択リセット", "選択したツイートをすべて解除しました");
    logger.log("Selections reset");
  }

  public addControlPanel(): void {
    if (this.querySelector(".control-panel-container")) {
      return;
    }

    const container = document.createElement("div");
    container.className = "control-panel-container";

    const modeSelect = document.createElement("select");
    modeSelect.id = "copy-mode-select";
    modeSelect.innerHTML = `
      <option value="all">全て</option>
      <option value="first">最初</option>
      <option value="shitaraba">4K</option>
      <option value="5ch">2K</option>
    `;
    modeSelect.value = state.copyMode;
    modeSelect.addEventListener("change", (e: Event) => {
      state.copyMode = (e.target as HTMLSelectElement)
        .value as typeof state.copyMode;
      logger.log(`Copy mode changed to: ${state.copyMode}`);
    });
    container.appendChild(modeSelect);

    const translateLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "translate-checkbox";
    checkbox.checked = state.translateEnabled;
    checkbox.addEventListener("change", (e: Event) => {
      state.translateEnabled = (e.target as HTMLInputElement).checked;
      logger.log(
        `Translation ${state.translateEnabled ? "enabled" : "disabled"}`,
      );
    });
    translateLabel.appendChild(checkbox);
    translateLabel.appendChild(document.createTextNode("翻訳"));
    container.appendChild(translateLabel);

    this.appendChild(container);
    this.controlPanel = container;
    this.configureHoverVisibility();
    logger.log("Control panel added to shadow DOM");
  }

  public addMainButton(onClick: (action: ButtonAction) => Promise<void>): void {
    if (this.querySelector(".copy-thread-button")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "copy-thread-button";
    button.id = "twitter-thread-copier-button";
    button.title = "スレッドをコピー";

    button.addEventListener("click", async () => {
      if (this.ignoreNextClick) {
        this.ignoreNextClick = false;
        return;
      }
      if (state.isSecondStage) {
        await onClick("clipboard");
      } else {
        await onClick("copy");
      }
    });

    this.appendChild(button);
    this.mainButton = button;
    this.configureHoverVisibility();
    this.updateMainButtonText();
    this.initializeDrag(button);
    logger.log("Copy button added to shadow DOM");
  }

  public updateMainButtonText(): void {
    const button = this.querySelector("#twitter-thread-copier-button");
    if (!button) return;

    if (state.isCollecting) {
      button.classList.add("loading");
      button.classList.remove("ready");
      button.innerHTML = `<span class="text">収集中...</span>${ICONS.LOADING}`;
      return;
    }

    if (state.translationInProgress) {
      button.classList.add("loading");
      button.classList.remove("ready");
      button.innerHTML = `<span class="text">翻訳中...</span>${ICONS.LOADING}`;
      return;
    }

    button.classList.remove("loading");
    button.classList.remove("ready");

    if (state.isSecondStage) {
      button.classList.add("ready");
      button.innerHTML = `<span class="text">クリックしてコピー</span>${ICONS.CLIPBOARD}`;
      return;
    }

    const selectedCount = state.selectedTweetIds.length;
    if (selectedCount > 0) {
      button.innerHTML = `<span class="text">選択ツイート(${selectedCount})をコピー</span>${ICONS.COPY}`;
      return;
    }

    if (state.startFromTweetId) {
      const startText =
        state.startFromTweetText.length > 20
          ? state.startFromTweetText.substring(0, 20) + "..."
          : state.startFromTweetText;
      button.innerHTML = `<span class="text">${startText}からコピー</span>${ICONS.COPY}`;
      return;
    }

    button.innerHTML = `<span class="text">スレッドをコピー</span>${ICONS.COPY}`;
  }

  public showToast(title: string, content: string): void {
    let toast = this.querySelector(".copy-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "copy-toast";
      this.appendChild(toast as HTMLElement);
    }
    toast.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-content">${content.substring(0, 100)}</div>
    `;
    toast.classList.remove("visible");
    setTimeout(() => {
      toast?.classList.add("visible");
      setTimeout(() => {
        toast?.classList.remove("visible");
        setTimeout(() => toast?.remove(), 500);
      }, 3000);
    }, 10);
  }

  /**
   * アイコンは @mdi/js のパスデータを使用します（Apache-2.0）。
   */

  public updateAllUI(): void {
    this.addControlPanel();
    this.addSelectionButtons();
    this.addStartPointButtons();
    this.updateResetButton();
  }

  private addStartPointButtons(): void {
    document
      .querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article)
      .forEach((tweetElement) => {
        // 既にボタンが直接の子要素として存在するかチェック
        const existingButton = Array.from(tweetElement.children).find((child) =>
          child.classList.contains("start-point-button"),
        );
        if (existingButton) return;

        const tweetId = this.extractTweetId(tweetElement);
        if (!tweetId) return;

        const startButton = document.createElement("button");
        startButton.className = "start-point-button";
        startButton.textContent = "★";
        startButton.title = "この位置からコピー開始";
        startButton.dataset.tweetId = tweetId;

        if (state.startFromTweetId === tweetId) {
          startButton.classList.add("active");
          startButton.textContent = "✓";
          tweetElement.classList.add("start-point-set");
        }

        startButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setStartPoint(tweetElement, tweetId);
        });
        tweetElement.appendChild(startButton);
      });
  }

  private setStartPoint(tweetElement: HTMLElement, tweetId: string): void {
    if (state.startFromTweetId) {
      document
        .querySelectorAll(".start-point-set")
        .forEach((tweet) => {
          tweet.classList.remove("start-point-set");
          const prevButton = tweet.querySelector(".start-point-button");
          if (prevButton) {
            prevButton.classList.remove("active");
            prevButton.textContent = "★";
          }
        });
    }

    const author = tweetElement.querySelector<HTMLElement>(TWITTER_SELECTORS.userName)?.innerText ?? "";
    const tweetText = tweetElement.querySelector<HTMLElement>(TWITTER_SELECTORS.tweetText)?.innerText ?? "";

    state.startFromTweetId = tweetId;
    state.startFromTweetAuthor = author;
    state.startFromTweetText = tweetText;

    tweetElement.classList.add("start-point-set");
    const startButton = tweetElement.querySelector(".start-point-button");
    if (startButton) {
      startButton.classList.add("active");
      startButton.textContent = "✓";
    }

    this.updateResetButton();
    this.updateMainButtonText();
    this.showToast("起点設定完了", `${author}のツイートを起点に設定しました`);
    logger.log(`Start point set: ${tweetId} by ${author}`);
  }

  private updateResetButton(): void {
    let resetButton = this.querySelector<HTMLButtonElement>(".reset-start-point");
    if (state.startFromTweetId) {
      if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.className = "reset-start-point";
        resetButton.textContent = "起点をリセット";
        resetButton.addEventListener("click", () => this.resetStartPoint());
        this.appendChild(resetButton as HTMLElement);
      }
      resetButton.classList.add("visible");
    } else {
      resetButton?.classList.remove("visible");
    }
  }

  private resetStartPoint(): void {
    state.startFromTweetId = null;
    state.startFromTweetAuthor = "";
    state.startFromTweetText = "";

    document.querySelectorAll(".start-point-set").forEach((tweet) => {
      tweet.classList.remove("start-point-set");
      const button = tweet.querySelector(".start-point-button");
      if (button) {
        button.classList.remove("active");
        button.textContent = "★";
      }
    });

    this.updateResetButton();
    this.updateMainButtonText();
    this.showToast("起点リセット", "コピー起点をリセットしました");
    logger.log("Start point reset");
  }

  private configureHoverVisibility(): void {
    if (
      this.hoverInteractionConfigured ||
      !this.mainButton ||
      !this.controlPanel
    ) {
      return;
    }
    if (!this.supportsHover()) {
      return;
    }

    this.hoverInteractionConfigured = true;
    const floating = this.ensureFloatingContainer();
    const controlPanel = this.controlPanel;
    controlPanel.classList.add("hover-hidden");

    const showControls = () => {
      this.clearHoverHideTimeout();
      floating.classList.add("show-hover-controls");
    };

    const scheduleHide = () => {
      this.clearHoverHideTimeout();
      this.hoverHideTimeout = window.setTimeout(() => {
        if (this.hoverPointerCount === 0 && !this.hasFocusWithin(floating)) {
          floating.classList.remove("show-hover-controls");
        }
      }, 150);
    };

    const handlePointerEnter = () => {
      this.hoverPointerCount += 1;
      showControls();
    };

    const handlePointerLeave = (event: PointerEvent) => {
      this.hoverPointerCount = Math.max(0, this.hoverPointerCount - 1);
      const next = event.relatedTarget as Node | null;
      if (next && floating.contains(next)) {
        return;
      }
      scheduleHide();
    };

    this.mainButton.addEventListener("pointerenter", handlePointerEnter);
    this.mainButton.addEventListener("pointerleave", handlePointerLeave);
    controlPanel.addEventListener("pointerenter", handlePointerEnter);
    controlPanel.addEventListener("pointerleave", handlePointerLeave);

    floating.addEventListener("focusin", showControls);
    floating.addEventListener("focusout", (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && floating.contains(next)) {
        return;
      }
      scheduleHide();
    });
  }

  private clearHoverHideTimeout(): void {
    if (this.hoverHideTimeout !== null) {
      window.clearTimeout(this.hoverHideTimeout);
      this.hoverHideTimeout = null;
    }
  }

  private hasFocusWithin(element: HTMLElement): boolean {
    const active = document.activeElement;
    return !!active && element.contains(active);
  }

  private supportsHover(): boolean {
    try {
      return window.matchMedia("(hover: hover)").matches;
    } catch (error) {
      logger.warn("hover media query check failed", error);
      return false;
    }
  }

  private ensureFloatingContainer(): HTMLDivElement {
    if (!this.shadowRoot) {
      throw new Error("Shadow root is not initialized");
    }
    if (!this.floatingContainer) {
      const floating = document.createElement("div");
      floating.className = "floating-ui-container";
      this.shadowRoot.appendChild(floating);
			const stored = this.loadPosition();
			if (stored) {
				this.customPosition = stored;
				this.applyPosition(stored.top, stored.left, floating);
			}
      this.floatingContainer = floating;
    }
    return this.floatingContainer;
  }

  private initializeDrag(button: HTMLButtonElement): void {
    if (button.dataset.dragInitialized === "true") {
      return;
    }
    button.dataset.dragInitialized = "true";

    button.addEventListener("pointerdown", (event: PointerEvent) => {
      if (!event.isPrimary) {
        return;
      }
      const floating = this.ensureFloatingContainer();
      const rect = floating.getBoundingClientRect();
      this.dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        initialTop: this.customPosition?.top ?? rect.top,
        initialLeft: this.customPosition?.left ?? rect.left,
        moved: false,
      };
      floating.classList.add("dragging");
      button.classList.add("dragging");
      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        logger.warn("pointer capture failed", error);
      }
    });

    button.addEventListener("pointermove", (event: PointerEvent) => {
      if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
        return;
      }
      const floating = this.floatingContainer;
      if (!floating) {
        return;
      }
      const deltaX = event.clientX - this.dragState.startX;
      const deltaY = event.clientY - this.dragState.startY;
      if (!this.dragState.moved) {
        const threshold = 4;
        if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
          return;
        }
        this.dragState.moved = true;
        floating.classList.add("has-custom-position");
        floating.style.bottom = "auto";
        floating.style.right = "auto";
      }
      const proposedTop = this.dragState.initialTop + deltaY;
      const proposedLeft = this.dragState.initialLeft + deltaX;
      const { top, left } = this.clampPosition(proposedTop, proposedLeft, floating);
      this.applyPosition(top, left, floating);
    });

    const finalizeDrag = (event: PointerEvent) => {
      if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
        return;
      }
      if (button.hasPointerCapture(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }
      button.classList.remove("dragging");
      this.floatingContainer?.classList.remove("dragging");
      if (this.dragState.moved) {
        this.ignoreNextClick = true;
        this.handleResize();
			this.savePosition();
      }
      this.dragState = null;
    };

    button.addEventListener("pointerup", finalizeDrag);
    button.addEventListener("pointercancel", finalizeDrag);
  }

  private clampPosition(
    top: number,
    left: number,
    container: HTMLDivElement,
  ): { top: number; left: number } {
    const margin = 16;
    const containerHeight = container.offsetHeight || 0;
    const containerWidth = container.offsetWidth || 0;
    const maxTop = Math.max(margin, window.innerHeight - containerHeight - margin);
    const maxLeft = Math.max(margin, window.innerWidth - containerWidth - margin);
    return {
      top: Math.min(Math.max(margin, top), maxTop),
      left: Math.min(Math.max(margin, left), maxLeft),
    };
  }

  private applyPosition(top: number, left: number, container?: HTMLDivElement): void {
    const target = container ?? this.ensureFloatingContainer();
    target.style.top = `${top}px`;
    target.style.left = `${left}px`;
    target.style.bottom = "auto";
    target.style.right = "auto";
    target.classList.add("has-custom-position");
    this.customPosition = { top, left };
		this.savePosition();
	}

	private loadPosition(): { top: number; left: number } | null {
		try {
			const raw = window.localStorage.getItem(this.storageKey);
			if (!raw) {
				return null;
			}
			const parsed = JSON.parse(raw) as {
				top: unknown;
				left: unknown;
			};
			if (
				typeof parsed.top === "number" &&
				typeof parsed.left === "number" &&
				Number.isFinite(parsed.top) &&
				Number.isFinite(parsed.left)
			) {
				return { top: parsed.top, left: parsed.left };
			}
			logger.warn("stored position is invalid", parsed);
			return null;
		} catch (error) {
			logger.warn("failed to load UI position", error);
			return null;
		}
	}

	private savePosition(): void {
		if (!this.customPosition) {
			return;
		}
		try {
			const payload = JSON.stringify(this.customPosition);
			window.localStorage.setItem(this.storageKey, payload);
		} catch (error) {
			logger.warn("failed to save UI position", error);
		}
  }
}

export const uiManager = new UIManager();
