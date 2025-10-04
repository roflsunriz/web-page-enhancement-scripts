import { createLogger } from '@/shared/logger';
import { showSettingsModal } from './ui';
import { setupObservers } from './observer';
import { processTimeline } from './filter';

const logger = createLogger('twitter-media-filter');

/**
 * スクリプトを初期化します。
 */
function init(): void {
  logger.info('Twitter Media Filterを初期化中...');
  GM_registerMenuCommand('メディアフィルター設定', showSettingsModal);
  setupObservers();

  // 初期表示時にも実行
  setTimeout(processTimeline, 1000);
}

// DOMが読み込まれたら初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}