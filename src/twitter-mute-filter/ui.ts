import { settings, updateSettings } from './settings';
import { fetchTwitterMuteKeywords } from './importer';
import { createShadowHost, type ShadowHostHandle } from '@/shared/dom';

let shadowHost: HTMLDivElement | null = null;
let shadowHandle: ShadowHostHandle | null = null;

const getModalStyles = (): string => `
  .tf-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex; justify-content: center; align-items: center;
      z-index: 2147483647; pointer-events: all;
  }
  .tf-modal {
      background: white; color: black; border-radius: 16px;
      padding: 20px; width: 80%; max-width: 600px; max-height: 80vh;
      overflow-y: auto; display: flex; flex-direction: column;
      gap: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .tf-modal-title { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; color: #1d9bf0; }
  .tf-modal-section { display: flex; flex-direction: column; gap: 10px; }
  .tf-toggle-section {
      display: flex; align-items: center; justify-content: space-between;
      padding: 15px; background: #f7f9fa; border-radius: 12px; margin-bottom: 15px;
  }
  .tf-toggle-label { font-weight: bold; font-size: 1.1em; color: #14171a; }
  .tf-toggle-switch {
      position: relative; width: 60px; height: 30px; background: #ccd6dd;
      border-radius: 15px; cursor: pointer; transition: background 0.3s;
  }
  .tf-toggle-switch.active { background: #1d9bf0; }
  .tf-toggle-slider {
      position: absolute; top: 3px; left: 3px; width: 24px; height: 24px;
      background: white; border-radius: 50%; transition: transform 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .tf-toggle-switch.active .tf-toggle-slider { transform: translateX(30px); }
  .tf-textarea {
      width: 90%; height: 150px; padding: 12px; border: 2px solid #e1e8ed;
      border-radius: 8px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px; color: #14171a; background: #ffffff; resize: vertical;
      transition: border-color 0.3s;
  }
  .tf-textarea:focus { outline: none; border-color: #1d9bf0; }
  .tf-button-row { display: flex; justify-content: space-between; margin-top: 15px; gap: 10px; }
  .tf-button {
      padding: 12px 20px; border: none; border-radius: 20px; cursor: pointer;
      font-weight: bold; font-size: 14px; transition: all 0.3s; flex: 1;
  }
  .tf-save-button { background: #1d9bf0; color: white; }
  .tf-save-button:hover { background: #1a8cd8; }
  .tf-cancel-button { background: #e0e0e0; color: #14171a; }
  .tf-cancel-button:hover { background: #d0d0d0; }
  .tf-import-button { background: #17bf63; color: white; }
  .tf-import-button:hover { background: #14a85f; }
  .tf-info {
      font-size: 0.9em; color: #657786; background: #f7f9fa;
      padding: 8px 12px; border-radius: 8px; border-left: 4px solid #1d9bf0;
  }
  .tf-keyword-type { font-weight: bold; margin-bottom: 5px; color: #14171a; }
  .tf-status-indicator {
      font-size: 0.9em; padding: 8px 12px; border-radius: 8px;
      text-align: center; font-weight: bold;
  }
  .tf-status-enabled { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .tf-status-disabled { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .tf-modal.dark-mode { background: #15202b; color: #f7f9f9; }
  .tf-toggle-section.dark-mode { background: #192734; }
  .tf-toggle-label.dark-mode { color: #f7f9f9; }
  .tf-textarea.dark-mode { background: #192734; color: #f7f9f9; border-color: #38444d; }
  .tf-textarea.dark-mode:focus { border-color: #1d9bf0; }
  .tf-info.dark-mode { background: #192734; color: #8899a6; }
  .tf-keyword-type.dark-mode { color: #f7f9f9; }
  .tf-cancel-button.dark-mode { background: #38444d; color: #f7f9f9; }
  .tf-cancel-button.dark-mode:hover { background: #5c6e7e; }
`;

function createSettingsUI(): void {
  shadowHandle?.dispose();
  shadowHandle = null;
  shadowHost = null;

  const handle = createShadowHost({ mode: 'closed' });
  shadowHandle = handle;
  shadowHost = handle.host;
  shadowHost.style.cssText = '';
  const { root: shadowRoot } = handle;

  const style = document.createElement('style');
  style.textContent = getModalStyles();
  shadowRoot.appendChild(style);

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'tf-modal-overlay';

  const isDarkMode = document.documentElement.style.colorScheme === 'dark';
  const statusClass = settings.enabled ? 'tf-status-enabled' : 'tf-status-disabled';
  const statusText = settings.enabled ? '機能は有効です' : '機能は無効です';

  modalOverlay.innerHTML = `
    <div class="tf-modal ${isDarkMode ? 'dark-mode' : ''}">
      <div class="tf-modal-title">Twitter文章完全ミュート 設定 v${settings.version}</div>
      <div class="tf-status-indicator ${statusClass}">${statusText}</div>
      <div class="tf-toggle-section ${isDarkMode ? 'dark-mode' : ''}">
        <div class="tf-toggle-label ${isDarkMode ? 'dark-mode' : ''}">ミュート機能を有効にする</div>
        <div class="tf-toggle-switch ${settings.enabled ? 'active' : ''}" id="tf-toggle">
          <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${isDarkMode ? 'dark-mode' : ''}">通常ミュートキーワード</div>
        <textarea class="tf-textarea ${isDarkMode ? 'dark-mode' : ''}" id="tf-string-keywords" placeholder="1行に1つのキーワードを入力">${settings.stringKeywords.join(
          '\n',
        )}</textarea>
        <div class="tf-info ${isDarkMode ? 'dark-mode' : ''}">部分一致するツイートをミュートします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${isDarkMode ? 'dark-mode' : ''}">正規表現ミュートキーワード</div>
        <textarea class="tf-textarea" id="tf-regex-keywords" placeholder="1行に1つの正規表現パターンを入力">${settings.regexKeywords.join(
          '\n',
        )}</textarea>
        <div class="tf-info ${isDarkMode ? 'dark-mode' : ''}">例: 「テス(ト)?」は「テス」「テスト」にマッチします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${isDarkMode ? 'dark-mode' : ''}">デバッグモード</div>
        <div class="tf-toggle-switch ${settings.debugMode ? 'active' : ''}" id="tf-debug-toggle">
            <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-button-row">
        <button class="tf-button tf-cancel-button ${isDarkMode ? 'dark-mode' : ''}" id="tf-cancel">キャンセル</button>
        <button class="tf-button tf-import-button" id="tf-import">公式ミュートを取り込む</button>
        <button class="tf-button tf-save-button" id="tf-save">保存</button>
      </div>
    </div>
  `;

  shadowRoot.appendChild(modalOverlay);

  // Event Listeners
  const toggleSwitch = shadowRoot.getElementById('tf-toggle')!;
  const debugToggleSwitch = shadowRoot.getElementById('tf-debug-toggle')!;
  const statusIndicator = shadowRoot.querySelector<HTMLDivElement>('.tf-status-indicator')!;

  const setupToggle = (toggle: HTMLElement, indicator?: HTMLElement, indicatorText?: { on: string; off: string }) => {
    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      if (indicator && indicatorText) {
        indicator.className = `tf-status-indicator ${isActive ? 'tf-status-enabled' : 'tf-status-disabled'}`;
        indicator.textContent = isActive ? indicatorText.on : indicatorText.off;
      }
    });
  };

  setupToggle(toggleSwitch, statusIndicator, { on: '機能は有効です', off: '機能は無効です' });
  setupToggle(debugToggleSwitch);

  const closeModal = () => {
    if (shadowHandle) {
      shadowHandle.dispose();
      shadowHandle = null;
      shadowHost = null;
    }
  };

  shadowRoot.getElementById('tf-cancel')!.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  shadowRoot.getElementById('tf-import')!.addEventListener('click', async () => {
    const twitterKeywords = await fetchTwitterMuteKeywords();
    if (twitterKeywords) {
      const stringKeywordsArea = shadowRoot.getElementById('tf-string-keywords') as HTMLTextAreaElement;
      const existingKeywords = new Set(stringKeywordsArea.value.split('\n').filter((k) => k.trim() !== ''));
      twitterKeywords.forEach((kw) => existingKeywords.add(kw));
      stringKeywordsArea.value = Array.from(existingKeywords).join('\n');
    }
  });

  shadowRoot.getElementById('tf-save')!.addEventListener('click', () => {
    const stringKeywords = (
      shadowRoot.getElementById('tf-string-keywords') as HTMLTextAreaElement
    ).value
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k !== '');

    const regexKeywords = (
      shadowRoot.getElementById('tf-regex-keywords') as HTMLTextAreaElement
    ).value
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k !== '');

    const isEnabled = toggleSwitch.classList.contains('active');
    const isDebugEnabled = debugToggleSwitch.classList.contains('active');

    updateSettings({
      stringKeywords,
      regexKeywords,
      enabled: isEnabled,
      debugMode: isDebugEnabled,
      lastImport: settings.lastImport, // 維持
    });

    closeModal();

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #1d9bf0; color: white; padding: 12px 20px;
        border-radius: 8px; z-index: 2147483647; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = `設定を保存しました。機能は${isEnabled ? '有効' : '無効'}です。`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  });
}

export function showSettingsModal(): void {
  createSettingsUI();
}
