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
  color: #e2e8f0;
}
.nvvs-overlay {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.nvvs-panel {
  background: #0f172a;
  border-radius: 18px;
  padding: 1.5rem;
  width: min(360px, 100%);
  box-shadow: 0 20px 45px rgba(2, 6, 23, 0.85);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.nvvs-heading {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
}
.nvvs-description {
  margin: 0;
  color: #cbd5f5;
  font-size: 0.95rem;
}
.nvvs-current-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #e0e7ff;
}
.nvvs-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nvvs-range {
  flex: 1;
  --nvvs-range-progress: 0%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #3b82f6 var(--nvvs-range-progress),
    #1f2937 var(--nvvs-range-progress)
  );
  cursor: pointer;
  outline: none;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.nvvs-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: transparent;
  border-radius: 50%;
  margin-top: -10px;
  border: none;
  cursor: inherit;
}
.nvvs-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: inherit;
}
.nvvs-range::-ms-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: inherit;
}
.nvvs-range::-moz-range-track,
.nvvs-range::-ms-track {
  background: transparent;
  border-color: transparent;
}
.nvvs-range,
.nvvs-number {
  -webkit-appearance: none;
  appearance: none;
}
.nvvs-number {
  width: 90px;
  padding: 0.35rem 0.55rem;
  font-size: 0.95rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #111b30;
  color: #f1f5f9;
  text-align: center;
}
.nvvs-number:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.nvvs-button-row {
  display: flex;
  justify-content: flex-end;
}
.nvvs-button {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.nvvs-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.nvvs-button:focus-visible {
  outline: 2px solid #93c5fd;
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

  const setSliderPercent = (percent: number): void => {
    slider.style.setProperty("--nvvs-range-progress", `${percent}%`);
  };

  const percentValue = Math.round(clampVolume(initialVolume) * 100);
  slider.value = percentValue.toString();
  numberInput.value = slider.value;
  setSliderPercent(percentValue);

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
    setSliderPercent(percent);
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
