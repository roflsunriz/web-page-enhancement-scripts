import type { Logger } from "@/shared/logger";
import type { ToastType } from "@/shared/types";

export class Toast {
  private toastContainer: HTMLDivElement | null = null;
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;

  constructor(private readonly logger: Logger) {
    this.init();
  }

  show(message: string, type: ToastType = "info", duration = 3000): void {
    const container = this.getToastContainer();
    const toast = document.createElement("div");
    toast.classList.add("ic", "toast", `ic.toast-${type}`);
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, duration);
  }

  private init(): void {
    this.shadowHost = document.createElement("div");
    this.shadowHost.id = "toast-shadow-host";
    this.shadowRoot = this.shadowHost.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      .ic.toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ic.toast {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .ic.toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .ic.toast-info {
        background-color: rgba(0, 123, 255, 0.9);
      }

      .ic.toast-success {
        background-color: rgba(40, 167, 69, 0.9);
      }

      .ic.toast-warning {
        background-color: rgba(255, 193, 7, 0.9);
      }

      .ic.toast-error {
        background-color: rgba(220, 53, 69, 0.9);
      }
    `;
    this.shadowRoot.appendChild(style);

    this.toastContainer = document.createElement("div");
    this.toastContainer.classList.add("ic", "toast-container");
    this.shadowRoot.appendChild(this.toastContainer);
    document.body.appendChild(this.shadowHost);

    this.logger.debug("トーストUIを初期化しました");
  }

  private getToastContainer(): HTMLDivElement {
    if (!this.toastContainer) {
      throw new Error("Toast container is not initialized.");
    }
    return this.toastContainer;
  }
}
