import { Settings } from "@/shared/types";
import { loadSettings, saveSettings } from "./settings";

const CONTAINER_ID = "chatgpt-notification-settings-container";

/**
 * 設定UIを生成または表示します。
 */
export function createSettingsUI(): void {
  const existingContainer = document.getElementById(CONTAINER_ID);
  if (existingContainer) {
    existingContainer.style.display = "block";
    return;
  }

  const settings = loadSettings();

  const container = document.createElement("div");
  container.id = CONTAINER_ID;

  const shadowRoot = container.attachShadow({ mode: "closed" });

  shadowRoot.innerHTML = `
    <style>
      .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      .modal-content { background-color: white; border-radius: 8px; padding: 20px; width: 400px; max-width: 90%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); color: #333; position: relative; }
      .title { margin-top: 0; margin-bottom: 16px; font-size: 1.5em; font-weight: 600; }
      .setting-item { margin-bottom: 16px; }
      .setting-label { margin-bottom: 4px; }
      .checkbox-label { margin-left: 8px; }
      .text-input { width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
      .slider { width: 100%; }
      .button-container { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
      .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
      .cancel-button { background-color: #f1f1f1; }
      .save-button { background-color: #10a37f; color: white; }
      .close-button { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
      .success-text { color: #10a37f; margin-right: auto; }
    </style>
    <div class="modal">
      <div class="modal-content">
        <button class="close-button">&times;</button>
        <h2 class="title">ChatGPT 完了通知 - 設定</h2>
        
        <div class="setting-item">
          <input type="checkbox" id="notification-enabled">
          <label for="notification-enabled" class="checkbox-label">通知を有効にする</label>
        </div>
        
        <div class="setting-item">
          <input type="checkbox" id="sound-enabled">
          <label for="sound-enabled" class="checkbox-label">完了時に音を鳴らす</label>
        </div>
        
        <div class="setting-item">
          <div class="setting-label" id="volume-label">音量: </div>
          <input type="range" class="slider" id="sound-volume" min="0" max="1" step="0.1">
        </div>
        
        <div class="setting-item">
          <div class="setting-label">カスタム通知音URL（空白の場合はデフォルト）</div>
          <input type="text" class="text-input" id="custom-sound" placeholder="https://example.com/sound.mp3">
        </div>
        
        <div class="button-container">
          <span class="success-text"></span>
          <button class="button cancel-button">キャンセル</button>
          <button class="button save-button">保存</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // --- Element references ---
  const modal = shadowRoot.querySelector(".modal")!;
  const closeButton = shadowRoot.querySelector(".close-button")!;
  const cancelButton = shadowRoot.querySelector(".cancel-button")!;
  const saveButton = shadowRoot.querySelector(".save-button")!;
  const successText = shadowRoot.querySelector(".success-text")!;

  const notificationCheckbox = shadowRoot.getElementById("notification-enabled") as HTMLInputElement;
  const soundCheckbox = shadowRoot.getElementById("sound-enabled") as HTMLInputElement;
  const volumeSlider = shadowRoot.getElementById("sound-volume") as HTMLInputElement;
  const volumeLabel = shadowRoot.getElementById("volume-label")!;
  const customSoundInput = shadowRoot.getElementById("custom-sound") as HTMLInputElement;

  // --- Functions ---
  const closeUI = () => {
    container.style.display = "none";
    successText.textContent = "";
  };

  const updateVolumeLabel = () => {
    volumeLabel.textContent = `音量: ${volumeSlider.value}`;
  };

  const populateUI = (s: Settings) => {
    notificationCheckbox.checked = s.showNotification;
    soundCheckbox.checked = s.playSound;
    volumeSlider.value = String(s.soundVolume);
    customSoundInput.value = s.customSoundUrl;
    updateVolumeLabel();
  };

  const handleSave = () => {
    const newSettings: Settings = {
      showNotification: notificationCheckbox.checked,
      playSound: soundCheckbox.checked,
      soundVolume: parseFloat(volumeSlider.value),
      customSoundUrl: customSoundInput.value.trim(),
    };
    saveSettings(newSettings);

    successText.textContent = "保存しました！";
    setTimeout(closeUI, 1000);
  };

  // --- Event Listeners ---
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeUI();
    }
  });
  closeButton.addEventListener("click", closeUI);
  cancelButton.addEventListener("click", closeUI);
  saveButton.addEventListener("click", handleSave);
  volumeSlider.addEventListener("input", updateVolumeLabel);

  // --- Initialization ---
  populateUI(settings);
}