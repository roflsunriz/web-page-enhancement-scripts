import type { Logger } from "@/shared/logger";
import { ShadowDomHost } from "./shadow-dom-host";

export class ToastManager {
  private toastElement: HTMLDivElement | null = null;
  private hideTimer: number | null = null;

  constructor(
    private readonly host: ShadowDomHost,
    private readonly logger: Logger,
  ) {}

  show(title: string, content: string): void {
    try {
      const root = this.host.init();
      if (!this.toastElement) {
        this.toastElement = document.createElement("div");
        this.toastElement.className = "copy-toast";

        const titleElement = document.createElement("div");
        titleElement.className = "toast-title";
        this.toastElement.appendChild(titleElement);

        const contentElement = document.createElement("div");
        contentElement.className = "toast-content";
        this.toastElement.appendChild(contentElement);

        root.appendChild(this.toastElement);
      }

      const titleElement = this.toastElement.querySelector<HTMLDivElement>(
        ".toast-title",
      );
      const contentElement = this.toastElement.querySelector<HTMLDivElement>(
        ".toast-content",
      );

      if (!titleElement || !contentElement) {
        this.logger.error("toast element is missing core nodes");
        return;
      }

      titleElement.textContent = title;
      contentElement.textContent = content;

      this.toastElement.classList.add("visible");

      if (this.hideTimer) {
        window.clearTimeout(this.hideTimer);
      }

      this.hideTimer = window.setTimeout(() => {
        this.toastElement?.classList.remove("visible");
      }, 3600);
    } catch (error) {
      this.logger.error("toast rendering failed", error);
    }
  }
}
