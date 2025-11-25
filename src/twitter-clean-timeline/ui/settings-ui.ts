/**
 * twitter-clean-timeline - 設定UI
 */

import { settings, saveSettings, resetSettings } from '../settings';
import { updateMuteFilterRegexes } from '../dom/tweet-processor';
import { updateXHRMuteFilterRegexes } from '../network/xhr-interceptor';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:ui');

/**
 * 設定モーダルを表示
 */
export function showSettingsModal(): void {
  // 既存のモーダルを削除
  const existingModal = document.querySelector('#ctl-settings-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = createModal();
  document.body.appendChild(modal);
}

/**
 * モーダルを作成
 */
function createModal(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'ctl-settings-modal';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
  });

  const modalContent = document.createElement('div');
  Object.assign(modalContent.style, {
    backgroundColor: '#15202b',
    color: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '600px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  });

  modalContent.innerHTML = `
    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ffffff;">Twitter Clean Timeline 設定</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">グローバル設定</h3>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-show-placeholder" ${settings.showPlaceholder ? 'checked' : ''}>
        プレースホルダー表示（フィルタされたツイートを小さく表示）
      </label>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-debug-mode" ${settings.debugMode ? 'checked' : ''}>
        デバッグモード（コンソールに詳細ログを出力）
      </label>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-media-enabled" ${settings.mediaFilter.enabled ? 'checked' : ''}>
          メディアフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-timeline" ${settings.mediaFilter.enableOnTimeline ? 'checked' : ''}>
          ホームタイムライン
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-lists" ${settings.mediaFilter.enableOnLists ? 'checked' : ''}>
          リスト
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-profile" ${settings.mediaFilter.enableOnProfile ? 'checked' : ''}>
          プロフィール
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-search" ${settings.mediaFilter.enableOnSearch ? 'checked' : ''}>
          検索
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-detail" ${settings.mediaFilter.enableOnTweetDetail ? 'checked' : ''}>
          ツイート詳細
        </label>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-mute-enabled" ${settings.muteFilter.enabled ? 'checked' : ''}>
          ミュートフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff;">${settings.muteFilter.stringKeywords.join('\n')}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff;">${settings.muteFilter.regexKeywords.join('\n')}</textarea>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-retweet-enabled" ${settings.retweetFilter.enabled ? 'checked' : ''}>
          リツイートフィルタ（プロフィールページで動作）
        </label>
      </h3>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #38444d;">
      <button id="ctl-save-btn" style="flex: 1; padding: 10px; background-color: #1d9bf0; color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold;">
        保存
      </button>
      <button id="ctl-reset-btn" style="padding: 10px 16px; background-color: #ef4444; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        リセット
      </button>
      <button id="ctl-cancel-btn" style="padding: 10px 16px; background-color: #6b7280; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        キャンセル
      </button>
    </div>
  `;

  // イベントリスナー
  const saveBtn = modalContent.querySelector('#ctl-save-btn');
  const resetBtn = modalContent.querySelector('#ctl-reset-btn');
  const cancelBtn = modalContent.querySelector('#ctl-cancel-btn');

  saveBtn?.addEventListener('click', () => {
    saveSettingsFromModal(modalContent);
    overlay.remove();
  });

  resetBtn?.addEventListener('click', () => {
    if (confirm('すべての設定をリセットしますか？')) {
      resetSettings();
      overlay.remove();
      logger.info('設定をリセットしました');
      alert('設定をリセットしました。ページをリロードしてください。');
    }
  });

  cancelBtn?.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  overlay.appendChild(modalContent);
  return overlay;
}

/**
 * モーダルから設定を保存
 */
function saveSettingsFromModal(modal: HTMLElement): void {
  const getValue = (id: string): boolean => {
    return (modal.querySelector(`#${id}`) as HTMLInputElement)?.checked ?? false;
  };

  const getTextValue = (id: string): string => {
    return (modal.querySelector(`#${id}`) as HTMLTextAreaElement)?.value ?? '';
  };

  settings.showPlaceholder = getValue('ctl-show-placeholder');
  settings.debugMode = getValue('ctl-debug-mode');

  settings.mediaFilter.enabled = getValue('ctl-media-enabled');
  settings.mediaFilter.enableOnTimeline = getValue('ctl-media-timeline');
  settings.mediaFilter.enableOnLists = getValue('ctl-media-lists');
  settings.mediaFilter.enableOnProfile = getValue('ctl-media-profile');
  settings.mediaFilter.enableOnSearch = getValue('ctl-media-search');
  settings.mediaFilter.enableOnTweetDetail = getValue('ctl-media-detail');

  settings.muteFilter.enabled = getValue('ctl-mute-enabled');
  settings.muteFilter.stringKeywords = getTextValue('ctl-mute-strings')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  settings.muteFilter.regexKeywords = getTextValue('ctl-mute-regexes')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  settings.retweetFilter.enabled = getValue('ctl-retweet-enabled');

  saveSettings();
  
  // ミュートフィルタの正規表現を更新
  updateMuteFilterRegexes();
  updateXHRMuteFilterRegexes();

  logger.info('設定を保存しました');
  alert('設定を保存しました。ページをリロードすると反映されます。');
}

