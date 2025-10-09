import type { Logger } from "@/shared/logger";
import { createShadowHost } from "@/shared/dom";

export class ProgressBar {
  private progressContainer: HTMLDivElement | null = null;
  private progressBar: HTMLDivElement | null = null;
  private progressText: HTMLDivElement | null = null;
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;

  constructor(private readonly logger: Logger) {
    this.init();
  }

  show(): void {
    this.getContainer().style.display = "block";
  }

  hide(): void {
    this.getContainer().style.display = "none";
  }

  update(progress: number): void {
    const clamped = Math.max(0, Math.min(100, progress));
    this.getProgressBar().style.width = `${clamped}%`;
    this.getProgressText().textContent = `進捗: ${clamped.toFixed(0)}%`;
  }

  private init(): void {
    const { host, root } = createShadowHost({
      id: "progress-shadow-host",
      mode: "closed",
    });
    this.shadowHost = host;
    this.shadowRoot = root;

    const style = document.createElement("style");
    style.textContent = `
      .ic.progress-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 5px;
        z-index: 10001;
        display: none;
      }

      .ic.progress-bar {
        height: 10px;
        background-color: #4caf50;
        border-radius: 5px;
        width: 0%;
        transition: width 0.3s ease;
      }

      .ic.progress-text {
        text-align: center;
        color: white;
        margin-top: 5px;
        font-size: 0.9rem;
      }
    `;
    this.shadowRoot.appendChild(style);

    this.progressContainer = document.createElement("div");
    this.progressContainer.classList.add("ic", "progress-container");

    this.progressBar = document.createElement("div");
    this.progressBar.classList.add("ic", "progress-bar");
    this.progressContainer.appendChild(this.progressBar);

    this.progressText = document.createElement("div");
    this.progressText.classList.add("ic", "progress-text");
    this.progressText.textContent = "進捗: 0%";
    this.progressContainer.appendChild(this.progressText);

    this.shadowRoot.appendChild(this.progressContainer);

    this.logger.debug("プログレスバーUIを初期化しました");
  }

  private getContainer(): HTMLDivElement {
    if (!this.progressContainer) {
      throw new Error("Progress container is not initialized.");
    }
    return this.progressContainer;
  }

  private getProgressBar(): HTMLDivElement {
    if (!this.progressBar) {
      throw new Error("Progress bar is not initialized.");
    }
    return this.progressBar;
  }

  private getProgressText(): HTMLDivElement {
    if (!this.progressText) {
      throw new Error("Progress text is not initialized.");
    }
    return this.progressText;
  }
}
