import { createLogger } from '@/shared/logger';
import { setupObservers } from './observer';
import { showSettingsModal } from './ui';
import { migrateSettings, settings } from './settings';
import { updateMuteRegexes } from './filter';

const logger = createLogger('twitter-mute-filter');

/**
 * スクリプトを初期化します。
 */
function init(): void {
  logger.info('Twitter Mute Filterを初期化中...');

  migrateSettings();
  updateMuteRegexes();

  GM_registerMenuCommand('ミュート設定', showSettingsModal);
  setupObservers();

  if (settings.enabled) {
    logger.info('ミュート機能は有効です。');
  }
}

// DOMが完全に読み込まれた後に初期化
window.addEventListener('load', init, false);