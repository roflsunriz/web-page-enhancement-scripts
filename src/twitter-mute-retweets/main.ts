import { createLogger } from '@/shared/logger';
import { settings } from './settings';
import { showSettingsModal } from './ui';
import { startObserver, stopObserver, debouncedRemoveRetweets } from './observer';

const logger = createLogger('twitter-mute-retweets');

/**
 * 設定の変更に応じてオブザーバーの状態を更新します。
 */
export function updateObserverState(): void {
  if (settings.enabled) {
    logger.info('リツイート非表示機能が有効です。監視を開始します。');
    startObserver();
  } else {
    logger.info('リツイート非表示機能が無効です。監視を停止します。');
    stopObserver();
  }
}

/**
 * スクリプトを初期化します。
 */
function init(): void {
  logger.info('スクリプトを初期化中...');
  GM_registerMenuCommand('リツイート非表示の設定', showSettingsModal);
  updateObserverState();
  setTimeout(debouncedRemoveRetweets, 1000); // 初期読み込み
}

init();