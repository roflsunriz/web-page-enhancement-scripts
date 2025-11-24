import { settings, updateSettings, DEFAULT_SETTINGS } from './settings';
import { applyStyles, resolveWidth } from './styler';

const OVERLAY_ID = 'twitter-wide-layout-fix-settings';

// 元の設定を保持する変数（キャンセル時に復元するため）
let originalSettings: { css: string; xpath: string; width: string } | null = null;

function createField(labelText: string, inputElement: HTMLElement): HTMLElement {
  const wrapper = document.createElement('label');
  wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 8px; font-size: 14px;';
  const caption = document.createElement('span');
  caption.textContent = labelText;
  caption.style.fontWeight = '600';
  wrapper.appendChild(caption);
  wrapper.appendChild(inputElement);
  return wrapper;
}

function createHelperText(text: string): HTMLElement {
  const helper = document.createElement('span');
  helper.textContent = text;
  helper.style.cssText = 'font-size: 12px; color: #536471; line-height: 1.4;';
  return helper;
}

function closeSettingsModal(shouldRestore: boolean): void {
  if (shouldRestore && originalSettings) {
    // キャンセル時は元の設定に戻してスタイルを再適用
    updateSettings(originalSettings);
    applyStyles();
  }
  const overlay = document.getElementById(OVERLAY_ID);
  overlay?.remove();
  originalSettings = null;
}

export function showSettingsModal(): void {
  if (document.getElementById(OVERLAY_ID)) return;

  // 元の設定を保存
  originalSettings = {
    css: settings.css,
    xpath: settings.xpath,
    width: settings.width,
  };

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.55);
    z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: 16px;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #ffffff; color: #0f1419; width: min(600px, 100%);
    max-height: 90vh; overflow: auto; padding: 24px; border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;
  overlay.appendChild(modal);

  const title = document.createElement('h2');
  title.textContent = 'Twitter Wide Layout Fix 設定';
  title.style.marginTop = '0';
  modal.appendChild(title);

  const form = document.createElement('form');
  form.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
  modal.appendChild(form);

  // CSS Textarea
  const cssTextarea = document.createElement('textarea');
  cssTextarea.value = settings.css;
  cssTextarea.style.cssText = `
    width: 100%; min-height: 120px; font-family: monospace; font-size: 13px;
    padding: 8px; border: 1px solid #d0d7de; border-radius: 6px;
  `;
  const cssField = createField('CSS', cssTextarea);
  const cssHelper = createHelperText('');
  cssField.appendChild(cssHelper);
  form.appendChild(cssField);

  // XPath Input
  const xpathInput = document.createElement('input');
  xpathInput.type = 'text';
  xpathInput.value = settings.xpath;
  xpathInput.style.cssText = `
    width: 100%; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px;
  `;
  form.appendChild(createField('XPath', xpathInput));

  // Width Slider and Input
  const widthContainer = document.createElement('div');
  widthContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

  const widthLabel = document.createElement('span');
  widthLabel.textContent = '幅 (width)';
  widthLabel.style.fontWeight = '600';
  widthLabel.style.fontSize = '14px';
  widthContainer.appendChild(widthLabel);

  // スライダーとテキスト入力を横並びにするコンテナ
  const widthInputContainer = document.createElement('div');
  widthInputContainer.style.cssText = 'display: flex; gap: 12px; align-items: center;';

  const widthSlider = document.createElement('input');
  widthSlider.type = 'range';
  widthSlider.min = '600';
  widthSlider.max = '2000';
  widthSlider.step = '10';
  const currentWidth = parseInt(settings.width, 10);
  widthSlider.value = isNaN(currentWidth) ? '900' : String(currentWidth);
  widthSlider.style.cssText = 'flex: 1; cursor: pointer;';

  const widthInput = document.createElement('input');
  widthInput.type = 'text';
  widthInput.value = settings.width;
  widthInput.placeholder = `例: ${DEFAULT_SETTINGS.width} または 80%`;
  widthInput.style.cssText = `
    width: 120px; font-size: 13px; padding: 8px;
    border: 1px solid #d0d7de; border-radius: 6px; text-align: center;
  `;

  widthInputContainer.appendChild(widthSlider);
  widthInputContainer.appendChild(widthInput);
  widthContainer.appendChild(widthInputContainer);

  const widthHelper = createHelperText('数値のみの場合はpxを自動付与し、単位付きの値はそのまま利用します。スライダーで直感的に調整できます。');
  const widthPreview = createHelperText('');
  widthContainer.appendChild(widthHelper);
  widthContainer.appendChild(widthPreview);
  form.appendChild(widthContainer);

  // リアルタイムプレビュー用の関数
  const applyRealtimePreview = () => {
    updateSettings({
      css: cssTextarea.value,
      xpath: xpathInput.value.trim() || DEFAULT_SETTINGS.xpath,
      width: widthInput.value.trim() || DEFAULT_SETTINGS.width,
    });
    applyStyles();
  };

  const updateWidthPreview = () => {
    const resolved = resolveWidth(widthInput.value.trim() || DEFAULT_SETTINGS.width);
    const usesPlaceholder = cssTextarea.value.includes('{{WIDTH}}');
    widthPreview.textContent = usesPlaceholder
      ? `適用幅: ${resolved}（CSSとXPathに共通適用）`
      : `適用幅: ${resolved}（CSSに{{WIDTH}}が含まれていません）`;
  };

  const updateCssHelper = () => {
    const usesPlaceholder = cssTextarea.value.includes('{{WIDTH}}');
    cssHelper.textContent = usesPlaceholder
      ? 'CSS内の{{WIDTH}}は幅設定で置換されます。'
      : 'CSSに{{WIDTH}}を含めると幅設定を共有できます。';
    updateWidthPreview();
  };

  // スライダーの値が変更されたらテキストボックスにも反映し、リアルタイムプレビュー
  widthSlider.addEventListener('input', () => {
    widthInput.value = widthSlider.value;
    updateWidthPreview();
    applyRealtimePreview();
  });

  // テキストボックスの値が変更されたらスライダーにも反映（数値の場合のみ）し、リアルタイムプレビュー
  widthInput.addEventListener('input', () => {
    const numValue = parseInt(widthInput.value, 10);
    if (!isNaN(numValue)) {
      widthSlider.value = String(numValue);
    }
    updateWidthPreview();
    applyRealtimePreview();
  });

  cssTextarea.addEventListener('input', () => {
    updateCssHelper();
    applyRealtimePreview();
  });

  xpathInput.addEventListener('input', () => {
    applyRealtimePreview();
  });

  updateCssHelper();

  // Buttons
  const buttonRow = document.createElement('div');
  buttonRow.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px;';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'キャンセル';
  cancelButton.style.cssText = `
    padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 999px;
    background: #f7f9f9; cursor: pointer;
  `;
  cancelButton.addEventListener('click', () => closeSettingsModal(true));

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.textContent = '保存';
  saveButton.style.cssText = `
    padding: 8px 14px; border: none; border-radius: 999px;
    background: #1d9bf0; color: #ffffff; cursor: pointer;
  `;

  buttonRow.appendChild(cancelButton);
  buttonRow.appendChild(saveButton);
  form.appendChild(buttonRow);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // 保存時は現在の設定をそのまま確定（すでにリアルタイムで反映されている）
    closeSettingsModal(false);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeSettingsModal(true);
    }
  });

  document.body.appendChild(overlay);
  cssTextarea.focus();
}