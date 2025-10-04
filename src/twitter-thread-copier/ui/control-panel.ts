import type { Logger } from "@/shared/logger";
import type { CopyMode } from "@/shared/types";
import { State } from "../state";
import { ShadowDomHost } from "./shadow-dom-host";

export interface ControlPanelCallbacks {
  onModeChange: (mode: CopyMode) => void;
  onTranslateToggle: (enabled: boolean) => void;
}

const COPY_MODE_OPTIONS: Array<{ value: CopyMode; label: string }> = [
  { value: "all", label: "全ツイート" },
  { value: "first", label: "最初のツイートのみ" },
  { value: "shitaraba", label: "したらば (4096文字)" },
  { value: "5ch", label: "5ch (2048文字)" },
];

export class ControlPanel {
  private container: HTMLDivElement | null = null;
  private modeSelect: HTMLSelectElement | null = null;
  private translateCheckbox: HTMLInputElement | null = null;

  constructor(
    private readonly host: ShadowDomHost,
    private readonly state: State,
    private readonly logger: Logger,
    private readonly callbacks: ControlPanelCallbacks,
  ) {}

  render(): void {
    const root = this.host.init();
    if (this.container) {
      return;
    }

    try {
      const container = document.createElement("div");
      container.className = "control-panel-container";

      const select = document.createElement("select");
      select.id = "copy-mode-select";
      COPY_MODE_OPTIONS.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
      });
      select.value = this.state.copyMode;
      select.addEventListener("change", (event) => {
        const value = (event.target as HTMLSelectElement).value as CopyMode;
        this.state.setCopyMode(value);
        this.callbacks.onModeChange(value);
        this.logger.info("copy mode changed", value);
      });

      const translateLabel = document.createElement("label");

      const translateCheckbox = document.createElement("input");
      translateCheckbox.type = "checkbox";
      translateCheckbox.id = "translate-checkbox";
      translateCheckbox.checked = this.state.translateEnabled;
      translateCheckbox.addEventListener("change", (event) => {
        const enabled = (event.target as HTMLInputElement).checked;
        this.state.enableTranslation(enabled);
        this.callbacks.onTranslateToggle(enabled);
        this.logger.info("translation toggled", enabled);
      });

      translateLabel.appendChild(translateCheckbox);
      translateLabel.appendChild(document.createTextNode("日本語に翻訳"));

      container.appendChild(select);
      container.appendChild(translateLabel);

      root.appendChild(container);

      this.container = container;
      this.modeSelect = select;
      this.translateCheckbox = translateCheckbox;
    } catch (error) {
      this.logger.error("control panel render failed", error);
    }
  }

  updateFromState(): void {
    if (!this.container) {
      return;
    }

    if (this.modeSelect) {
      this.modeSelect.value = this.state.copyMode;
    }

    if (this.translateCheckbox) {
      this.translateCheckbox.checked = this.state.translateEnabled;
    }
  }
}
