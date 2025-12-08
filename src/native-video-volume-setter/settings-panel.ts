import { createShadowHost } from "@/shared/dom";
import { clampVolume, formatVolumeLabel } from "./volume-settings";

type VolumeSettingsPanelOptions = {
  initialVolume: number;
  applyVolume: (volume: number) => void;
};

const PANEL_STYLES = `
:host {
  all: initial;
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  font-family: "Inter", "Noto Sans JP", "Segoe UI", system-ui, sans-serif;
}
.nvvs-overlay {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.nvvs-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  width: min(320px, 100%);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.nvvs-heading {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111;
}
.nvvs-description {
  margin: 0;
  color: #4a4a4a;
  font-size: 0.95rem;
}
.nvvs-current-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1c1c1c;
}
.nvvs-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nvvs-range {
  flex: 1;
}
.nvvs-range,
.nvvs-number {
  -webkit-appearance: none;
  appearance: none;
}
.nvvs-number {
  width: 90px;
  padding: 0.25rem 0.5rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
.nvvs-number:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.nvvs-button-row {
  display: flex;
  justify-content: flex-end;
}
.nvvs-button {
  border: none;
  background: #111;
  color: #fff;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.nvvs-button:hover {
  background: #282828;
}
.nvvs-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
`;

let currentPanelTeardown: (() => void) | null = null;

export const showVolumeSettingsPanel = ({
  initialVolume,
  applyVolume,
}: VolumeSettingsPanelOptions): void => {
  if (!document.body) {
    return;
  }

  currentPanelTeardown?.();
  currentPanelTeardown = null;

  const { root, dispose } = createShadowHost({
    id: "native-video-volume-setter-settings",
    cssText: PANEL_STYLES,
  });

  const overlay = document.createElement("div");
  overlay.className = "nvvs-overlay";

  const panel = document.createElement("section");
  panel.className = "nvvs-panel";

  const title = document.createElement("h2");
  title.className = "nvvs-heading";
  title.textContent = "既定音量の調整";

  const description = document.createElement("p");
  description.className = "nvvs-description";
  description.textContent =
    "スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。";

  const currentValueLabel = document.createElement("p");
  currentValueLabel.className = "nvvs-current-value";
  currentValueLabel.textContent = `現在の音量: ${formatVolumeLabel(initialVolume)}`;

  const slider = document.createElement("input");
  slider.className = "nvvs-range";
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.step = "1";

  const numberInput = document.createElement("input");
  numberInput.className = "nvvs-number";
  numberInput.type = "number";
  numberInput.min = "0";
  numberInput.max = "100";
  numberInput.step = "1";

  const percentValue = Math.round(clampVolume(initialVolume) * 100);
  slider.value = percentValue.toString();
  numberInput.value = slider.value;

  const inputRow = document.createElement("div");
  inputRow.className = "nvvs-input-row";
  inputRow.append(slider, numberInput);

  const buttonRow = document.createElement("div");
  buttonRow.className = "nvvs-button-row";

  const closeButton = document.createElement("button");
  closeButton.className = "nvvs-button";
  closeButton.type = "button";
  closeButton.textContent = "閉じる";

  buttonRow.append(closeButton);

  panel.append(title, description, currentValueLabel, inputRow, buttonRow);
  overlay.append(panel);
  root.append(overlay);

  let lastVolume = clampVolume(initialVolume);

  const syncControls = (volume: number): void => {
    const percent = Math.round(clampVolume(volume) * 100);
    slider.value = percent.toString();
    numberInput.value = slider.value;
    currentValueLabel.textContent = `現在の音量: ${formatVolumeLabel(volume)}`;
  };

  const applyPercent = (percent: number): void => {
    if (!Number.isFinite(percent)) {
      return;
    }

    const normalizedPercent = Math.max(0, Math.min(100, percent));
    const nextVolume = clampVolume(normalizedPercent / 100);

    if (Math.abs(nextVolume - lastVolume) < 1e-6) {
      syncControls(lastVolume);
      return;
    }

    lastVolume = nextVolume;
    applyVolume(nextVolume);
    syncControls(nextVolume);
  };

  const handleNumberInput = (): void => {
    applyPercent(Number(numberInput.value));
  };

  slider.addEventListener("input", () => applyPercent(Number(slider.value)));
  numberInput.addEventListener("input", handleNumberInput);

  const handleOverlayClick = (event: MouseEvent): void => {
    if (event.target === overlay) {
      closePanel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    }
  };

  overlay.addEventListener("click", handleOverlayClick);
  closeButton.addEventListener("click", closePanel);
  document.addEventListener("keydown", handleKeyDown);

  let disposed = false;

  function closePanel(): void {
    if (disposed) {
      return;
    }

    disposed = true;
    overlay.removeEventListener("click", handleOverlayClick);
    closeButton.removeEventListener("click", closePanel);
    document.removeEventListener("keydown", handleKeyDown);
    dispose();
    currentPanelTeardown = null;
  }

  currentPanelTeardown = closePanel;
};
