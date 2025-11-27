/**
 * twitter-clean-timeline - 設定UI
 */

import { settings, saveSettings, resetSettings } from '../settings';
import { updateMuteFilterRegexes, updateReplaceFilterRules, processTweetElement } from '../dom/tweet-processor';
import { createLogger } from '@/shared/logger';
import { TWITTER_SELECTORS } from '@/shared/constants/twitter';

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
 * 置き換えルールのテーブルHTMLを生成
 */
function createReplacementTableHTML(): string {
  if (settings.replaceFilter.replacements.length === 0) {
    return '<div style="color: #8b98a5; text-align: center; padding: 16px;">ルールがありません</div>';
  }

  return `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid #38444d;">
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">検索</th>
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">置き換え</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">正規表現</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">削除</th>
        </tr>
      </thead>
      <tbody>
        ${settings.replaceFilter.replacements
          .map(
            (rule, index) => `
          <tr style="border-bottom: 1px solid #2f3336;">
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${index}" data-replace-field="from" value="${escapeHtml(rule.from)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${index}" data-replace-field="to" value="${escapeHtml(rule.to)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px; text-align: center;">
              <input type="checkbox" data-replace-index="${index}" data-replace-field="isRegex" ${rule.isRegex ? 'checked' : ''}>
            </td>
            <td style="padding: 8px; text-align: center;">
              <button data-replace-delete="${index}" style="padding: 4px 8px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                削除
              </button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
      <div style="margin-left: 24px; margin-right: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${settings.muteFilter.stringKeywords.join('\n')}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${settings.muteFilter.regexKeywords.join('\n')}</textarea>
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

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-replace-enabled" ${settings.replaceFilter.enabled ? 'checked' : ''}>
          置き換えフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label style="display: block; font-weight: bold; color: #e7e9ea;">置き換えルール</label>
          <button id="ctl-replace-add-btn" style="padding: 4px 12px; background-color: #1d9bf0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ルール追加
          </button>
        </div>
        <div id="ctl-replace-table-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #38444d; border-radius: 4px; background-color: #192734; padding: 8px;">
          ${createReplacementTableHTML()}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #38444d;">
      <button id="ctl-save-btn" style="padding: 10px 24px; background-color: #1d9bf0; color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold;">
        保存
      </button>
      <button id="ctl-reset-btn" style="padding: 10px 20px; background-color: #ef4444; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        リセット
      </button>
      <button id="ctl-cancel-btn" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        キャンセル
      </button>
    </div>
  `;

  // イベントリスナー
  const saveBtn = modalContent.querySelector('#ctl-save-btn');
  const resetBtn = modalContent.querySelector('#ctl-reset-btn');
  const cancelBtn = modalContent.querySelector('#ctl-cancel-btn');
  const replaceAddBtn = modalContent.querySelector('#ctl-replace-add-btn');

  saveBtn?.addEventListener('click', () => {
    saveSettingsFromModal(modalContent);
    overlay.remove();
  });

  resetBtn?.addEventListener('click', () => {
    if (confirm('すべての設定をリセットしますか？')) {
      resetSettings();
      
      // ミュートフィルタと置き換えフィルタを更新
      updateMuteFilterRegexes();
      updateReplaceFilterRules();
      
      // 即時適用: ページ上の全ツイートを再処理
      reprocessAllTweets();
      
      overlay.remove();
      logger.info('設定をリセットしました');
      alert('設定をリセットして適用しました。');
    }
  });

  cancelBtn?.addEventListener('click', () => {
    overlay.remove();
  });

  replaceAddBtn?.addEventListener('click', () => {
    settings.replaceFilter.replacements.push({ from: '', to: '', isRegex: false });
    updateReplacementTable(modalContent);
  });

  // 置き換えテーブルの削除ボタン用イベント委譲
  const replaceTableContainer = modalContent.querySelector('#ctl-replace-table-container');
  replaceTableContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-replace-delete')) {
      const index = Number(target.getAttribute('data-replace-delete'));
      settings.replaceFilter.replacements.splice(index, 1);
      updateReplacementTable(modalContent);
    }
  });

  // 置き換えテーブルの入力フィールド用イベント委譲
  replaceTableContainer?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const index = target.getAttribute('data-replace-index');
    const field = target.getAttribute('data-replace-field');
    
    if (index !== null && field !== null) {
      const idx = Number(index);
      const replacement = settings.replaceFilter.replacements[idx];
      
      if (replacement) {
        if (field === 'from') {
          replacement.from = target.value;
        } else if (field === 'to') {
          replacement.to = target.value;
        } else if (field === 'isRegex') {
          replacement.isRegex = target.checked;
        }
      }
    }
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
 * 置き換えテーブルを更新
 */
function updateReplacementTable(modal: HTMLElement): void {
  const container = modal.querySelector('#ctl-replace-table-container');
  if (container) {
    container.innerHTML = createReplacementTableHTML();
  }
}

/**
 * ページ上の全ツイートを再処理
 */
function reprocessAllTweets(): void {
  const tweets = document.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article);
  
  // 処理済みフラグをクリアして再処理
  tweets.forEach((tweet) => {
    delete tweet.dataset.ctlProcessed;
    delete tweet.dataset.ctlReplaced;
    processTweetElement(tweet);
  });
  
  logger.info(`${tweets.length}件のツイートを再処理しました`);
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

  settings.replaceFilter.enabled = getValue('ctl-replace-enabled');
  // replacements は既にリアルタイムで更新されている

  saveSettings();
  
  // ミュートフィルタと置き換えフィルタを更新
  updateMuteFilterRegexes();
  updateReplaceFilterRules();

  // 即時適用: ページ上の全ツイートを再処理
  reprocessAllTweets();

  logger.info('設定を保存しました');
  alert('設定を保存して適用しました。');
}

