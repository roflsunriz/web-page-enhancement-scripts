/**
 * twitter-clean-timeline - メインエントリポイント
 * 
 * 3つのフィルタ（メディア、ミュート、リツイート）を統合した
 * クリーンなタイムラインフィルタリング体験を提供します。
 */

import { createLogger } from '@/shared/logger';
import { installNetworkHooks } from './network/xhr-interceptor';
import { startObserver } from './dom/observer';
import { showSettingsModal } from './ui/settings-ui';
import { settings } from './settings';

const logger = createLogger('twitter-clean-timeline');

/**
 * スクリプトを初期化
 */
function init(): void {
  logger.info('Twitter Clean Timeline を初期化中...');

  // document-start で実行されるため、ネットワークフックを先にインストール
  installNetworkHooks();

  // DOMが読み込まれたらオブザーバーを開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      startObserver();
    });
  } else {
    startObserver();
  }

  // 設定メニューを登録
  GM_registerMenuCommand('タイムラインフィルタ設定', showSettingsModal);

  logger.info('初期化完了', {
    mediaFilter: settings.mediaFilter.enabled,
    muteFilter: settings.muteFilter.enabled,
    retweetFilter: settings.retweetFilter.enabled,
    showPlaceholder: settings.showPlaceholder,
  });
}

// スクリプト開始
init();

