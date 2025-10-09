import { settings, updateSettings } from './settings';
import { updateObserverState } from './main';
import { updateDebounceWait } from './observer';
import { createShadowHost, type ShadowHostHandle } from '@/shared/dom';

let shadowHandle: ShadowHostHandle | null = null;

const getModalStyles = (): string => `
  .modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5); z-index: 2147483646;
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background-color: #fff; border: 1px solid #ccc; border-radius: 8px;
    padding: 20px; width: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px; line-height: 1.4;
  }
  .modal.dark {
    background-color: #15202b; color: #fff; border: 1px solid #38444d;
  }
  .modal h2 {
    margin: 0 0 15px 0; font-size: 18px; font-weight: bold;
  }
  .setting-item { margin-bottom: 15px; }
  .setting-item label { display: flex; align-items: center; cursor: pointer; }
  .setting-item input[type="checkbox"] { margin-right: 8px; }
  .interval-setting { margin-top: 15px; margin-bottom: 15px; }
  .interval-setting label { display: block; margin-bottom: 5px; }
  .interval-setting input[type="number"] {
    width: 80px; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;
  }
  .modal.dark .interval-setting input[type="number"] {
    background-color: #192734; border-color: #38444d; color: #fff;
  }
  .button-group { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
  .button {
    padding: 8px 16px; border: none; border-radius: 999px; cursor: pointer;
    font-size: 14px; font-weight: 500; transition: background-color 0.2s;
  }
  .button-primary { background-color: #1d9bf0; color: white; }
  .button-primary:hover { background-color: #1a8cd8; }
  .button-secondary { background-color: #e0e0e0; color: #000; }
  .button-secondary:hover { background-color: #d0d0d0; }
  .modal.dark .button-secondary { background-color: #38444d; color: #fff; }
  .modal.dark .button-secondary:hover { background-color: #5c6e7e; }
`;

/**
 * 設定モーダルを作成して表示します。
 */
export function showSettingsModal(): void {
  shadowHandle?.dispose();
  shadowHandle = null;

  const handle = createShadowHost({ id: 'retweet-settings-modal-host', mode: 'closed' });
  shadowHandle = handle;
  const { root: shadowRoot } = handle;

  const style = document.createElement('style');
  style.textContent = getModalStyles();
  shadowRoot.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const isDarkMode =
    document.body.style.backgroundColor === 'rgb(21, 32, 43)' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (isDarkMode) {
    modal.classList.add('dark');
  }

  modal.innerHTML = `
    <h2>リツイート非表示の設定</h2>
    <div class="setting-item">
      <label>
        <input type="checkbox" id="retweet-hide-enabled" ${settings.enabled ? 'checked' : ''}>
        リツイート非表示を有効にする
      </label>
    </div>
    <div class="interval-setting">
      <label for="retweet-check-interval">更新間隔 (ミリ秒):</label>
      <input type="number" id="retweet-check-interval" min="100" max="1000" step="100" value="${settings.checkInterval}">
    </div>
    <div class="button-group">
      <button class="button button-secondary" id="cancel-button">キャンセル</button>
      <button class="button button-primary" id="save-button">保存</button>
    </div>
  `;

  backdrop.appendChild(modal);
  shadowRoot.appendChild(backdrop);

  const enabledCheckbox = shadowRoot.getElementById('retweet-hide-enabled') as HTMLInputElement;
  const intervalInput = shadowRoot.getElementById('retweet-check-interval') as HTMLInputElement;
  const saveButton = shadowRoot.getElementById('save-button')!;
  const cancelButton = shadowRoot.getElementById('cancel-button')!;

  const closeModal = () => {
    if (shadowHandle) {
      shadowHandle.dispose();
      shadowHandle = null;
    }
  };

  saveButton.addEventListener('click', () => {
    const newSettings: Partial<typeof settings> = {
      enabled: enabledCheckbox.checked,
      checkInterval: parseInt(intervalInput.value, 10) || settings.checkInterval,
    };

    const oldEnabled = settings.enabled;
    updateSettings(newSettings);

    if (oldEnabled !== newSettings.enabled) {
      updateObserverState();
    }

    updateDebounceWait();
    closeModal();
  });

  cancelButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });
}
