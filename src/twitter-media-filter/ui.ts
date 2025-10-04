import { settings, updateSettings } from './settings';
import { processTimeline } from './filter';

let shadowHost: HTMLDivElement | null = null;

const getModalStyles = (): string => `
  :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 2147483647;
  }
  
  .tmf-modal {
      width: 400px;
      background-color: white;
      border-radius: 16px;
      padding: 20px;
      color: #000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  
  .tmf-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
  }
  
  .tmf-modal-title {
      font-size: 20px;
      font-weight: bold;
  }
  
  .tmf-modal-close {
      cursor: pointer;
      font-size: 20px;
  }
  
  .tmf-setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
  }
  
  .tmf-setting-item:last-child {
      border-bottom: none;
  }
  
  .tmf-switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 24px;
  }
  
  .tmf-switch input {
      opacity: 0;
      width: 0;
      height: 0;
  }
  
  .tmf-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
  }
  
  .tmf-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
  }
  
  input:checked + .tmf-slider {
      background-color: #1d9bf0;
  }
  
  input:focus + .tmf-slider {
      box-shadow: 0 0 1px #1d9bf0;
  }
  
  input:checked + .tmf-slider:before {
      transform: translateX(22px);
  }
  
  .tmf-setting-label {
      font-size: 15px;
  }
  
  .tmf-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
  }
  
  .tmf-footer button {
      background-color: #1d9bf0;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
  }
  
  .dark-mode .tmf-modal {
      background-color: #15202b;
      color: white;
  }
  
  .dark-mode .tmf-setting-item {
      border-bottom: 1px solid #38444d;
  }
`;

function createSettingsUI(): void {
  if (shadowHost) {
    shadowHost.remove();
  }

  shadowHost = document.createElement('div');
  shadowHost.id = 'tmf-shadow-host';
  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = getModalStyles();
  shadowRoot.appendChild(style);

  const modalContainer = document.createElement('div');
  const isDarkMode = document.documentElement.style.colorScheme === 'dark' || document.body.classList.contains('dark-theme') || window.matchMedia('(prefers-color-scheme: dark)').matches;

  modalContainer.innerHTML = `
      <div class="tmf-modal ${isDarkMode ? 'dark-mode' : ''}">
          <div class="tmf-modal-header"><div class="tmf-modal-title">Twitter Media Filter 設定</div><div class="tmf-modal-close">✕</div></div>
          <div class="tmf-settings-container">
              ${Object.keys(settings).map(key => `
                  <div class="tmf-setting-item">
                      <span class="tmf-setting-label">${key.replace('enableOn', '')}</span>
                      <label class="tmf-switch"><input type="checkbox" id="tmf-${key}" ${settings[key as keyof typeof settings] ? 'checked' : ''}><span class="tmf-slider"></span></label>
                  </div>
              `).join('')}
          </div>
          <div class="tmf-footer"><button id="tmf-save-button">保存</button></div>
      </div>
  `;

  shadowRoot.appendChild(modalContainer);
  document.body.appendChild(shadowHost);

  shadowRoot.querySelector('.tmf-modal-close')?.addEventListener('click', () => shadowHost!.style.display = 'none');
  modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) shadowHost!.style.display = 'none'; });

  shadowRoot.querySelector('#tmf-save-button')?.addEventListener('click', () => {
    const newSettings = Object.keys(settings).reduce((acc, key) => {
      const input = shadowRoot.querySelector<HTMLInputElement>(`#tmf-${key}`);
      if (input) acc[key as keyof typeof settings] = input.checked;
      return acc;
    }, {} as typeof settings);

    updateSettings(newSettings);
    shadowHost!.style.display = 'none';
    processTimeline();
  });
}

export function showSettingsModal(): void {
  createSettingsUI();
  if (shadowHost) {
    shadowHost.style.display = 'flex';
  }
}