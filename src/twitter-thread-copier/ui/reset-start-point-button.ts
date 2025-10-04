import type { Logger } from "@/shared/logger";
import { State } from "../state";
import { ShadowDomHost } from "./shadow-dom-host";

export class ResetStartPointButton {
  private button: HTMLButtonElement | null = null;

  constructor(
    private readonly host: ShadowDomHost,
    private readonly state: State,
    private readonly logger: Logger,
    private readonly onReset: () => void,
  ) {}

  update(): void {
    if (!this.state.startFromTweetId) {
      this.button?.classList.remove("visible");
      return;
    }

    const button = this.ensureButton();
    button.classList.add("visible");
  }

  private ensureButton(): HTMLButtonElement {
    if (this.button) {
      return this.button;
    }

    const root = this.host.init();
    const button = document.createElement("button");
    button.className = "reset-start-point";
    button.textContent = "起点をリセット";
    button.addEventListener("click", () => {
      try {
        this.onReset();
      } catch (error) {
        this.logger.error("failed to reset start point", error);
      }
    });

    root.appendChild(button);
    this.button = button;
    return button;
  }
}
