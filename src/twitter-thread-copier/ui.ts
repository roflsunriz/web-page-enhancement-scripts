import { logger } from "./logger.js";
import { state } from "./state.js";
import { renderMdiSvg } from "../shared/icons/mdi.js";
import { mdiContentCopy, mdiClipboardTextOutline, mdiProgressClock } from "@mdi/js";

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

  public init(): void {
    if (this.shadowRoot) return;

    this.container = document.createElement("div");
    this.container.id = "twitter-thread-copier-shadow-host";
    this.container.style.cssText =
      "position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;";

    this.shadowRoot = this.container.attachShadow({ mode: "closed" });
    this.addStyles();

    document.body.appendChild(this.container);
    logger.log("Shadow DOM initialized");
  }

  private addStyles(): void {
    if (!this.shadowRoot) return;
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .copy-thread-button {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #1DA1F2; /* Twitter Blue */
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: auto;
      }
      .copy-thread-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .copy-thread-button.success { background-color: #4CAF50; }
      .copy-thread-button.ready { background-color: #1DA1F2; }
      .copy-thread-button.loading svg { animation: spinning 1.5s linear infinite; }
      .copy-thread-button svg { display: block; }
      .control-panel-container {
          position: fixed;
          bottom: 160px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
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
      .copy-toast {
          position: fixed;
          bottom: 180px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: auto;
      }
      .copy-toast.visible { opacity: 1; transform: translateY(0); }
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
      article[data-testid="tweet"]:hover .start-point-button { opacity: 1; }
      .start-point-button:hover { background-color: rgba(29, 161, 242, 0.2); transform: scale(1.1); }
      .start-point-button.active { background-color: #1DA1F2; color: white; opacity: 1; }
      .start-point-button.active:hover { background-color: #1991DB; }
      article[data-testid="tweet"].start-point-set { background-color: rgba(29, 161, 242, 0.05); border: 1px solid rgba(29, 161, 242, 0.2); border-radius: 8px; }
      .reset-start-point {
          position: fixed;
          bottom: 220px;
          right: 20px;
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
      }
      .reset-start-point.visible { opacity: 1; visibility: visible; }
      .reset-start-point:hover { background-color: #ff5252; transform: scale(1.05); }
    `;
    this.shadowRoot.appendChild(styleElement);
  }

  private querySelector<E extends Element = Element>(
    selector: string,
  ): E | null {
    return this.shadowRoot ? this.shadowRoot.querySelector<E>(selector) : null;
  }

  private appendChild(element: HTMLElement): void {
    this.shadowRoot?.appendChild(element);
  }

  public destroy(): void {
    if (this.container) {
      this.container.remove();
    }
    this.shadowRoot = null;
    this.container = null;
    logger.log("Shadow DOM destroyed");
  }

  public addControlPanel(): void {
    if (this.querySelector(".control-panel-container")) return;

    const container = document.createElement("div");
    container.className = "control-panel-container";

    const modeSelect = document.createElement("select");
    modeSelect.id = "copy-mode-select";
    modeSelect.innerHTML = `
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
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
    translateLabel.appendChild(document.createTextNode("日本語に翻訳"));
    container.appendChild(translateLabel);

    this.appendChild(container);
    logger.log("Control panel added to shadow DOM");
  }

  public addMainButton(
    onClick: (action: ButtonAction) => Promise<void>,
  ): void {
    if (this.querySelector(".copy-thread-button")) return;

    const button = document.createElement("button");
    button.className = "copy-thread-button";
    button.id = "twitter-thread-copier-button";
    button.title = "スレッドをコピー";
    this.updateMainButtonText();

    button.addEventListener("click", async () => {
      if (state.isSecondStage) {
        await onClick("clipboard");
      } else {
        await onClick("copy");
      }
    });

    this.appendChild(button);
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

    if (state.isSecondStage) {
      button.classList.add("ready");
      button.innerHTML = `<span class="text">クリックしてコピー</span>${ICONS.CLIPBOARD}`;
    } else if (state.startFromTweetId) {
      const startText =
        state.startFromTweetText.length > 20
          ? state.startFromTweetText.substring(0, 20) + "..."
          : state.startFromTweetText;
      button.innerHTML = `<span class="text">${startText}からコピー</span>${ICONS.COPY}`;
    } else {
      button.classList.remove("ready");
      button.innerHTML = `<span class="text">スレッドをコピー</span>${ICONS.COPY}`;
    }
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
    this.addStartPointButtons();
    this.updateResetButton();
  }

  private addStartPointButtons(): void {
    document
      .querySelectorAll<HTMLElement>('article[data-testid="tweet"]')
      .forEach((tweetElement) => {
        // 既にボタンが直接の子要素として存在するかチェック
        const existingButton = Array.from(tweetElement.children).find((child) =>
          child.classList.contains("start-point-button"),
        );
        if (existingButton) return;

        const tweetLink = tweetElement.querySelector<HTMLAnchorElement>(
          'a[href*="/status/"]',
        );
        if (!tweetLink) return;

        const tweetId = tweetLink.href.split("/").pop()?.split("?")[0] ?? "";
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

    const author = tweetElement.querySelector<HTMLElement>('div[data-testid="User-Name"]')?.innerText ?? "";
    const tweetText = tweetElement.querySelector<HTMLElement>('div[data-testid="tweetText"]')?.innerText ?? "";

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
}

export const uiManager = new UIManager();