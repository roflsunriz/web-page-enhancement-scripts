import { createLogger } from '@/shared/logger';
import { applyStyles } from './styler';
import { setupObserver } from './observer';
import { showSettingsModal } from './ui';

const logger = createLogger('twitter-wide-layout-fix');

/**
 * スクリプトを初期化します。
 */
function initialize(): void {
  logger.info('Initializing...');
  applyStyles();
  setupObserver();
  GM_registerMenuCommand('Twitter Wide Layout Fix 設定', showSettingsModal);
}

// DOMが読み込まれたら初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}