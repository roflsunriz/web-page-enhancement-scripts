import { YouTubeInfoCopier } from './youtube-info-copier';
import { getLaunchStyle, registerLaunchStyleMenu } from '@/shared/launch-style';
import { registerMenuCommand } from '@/shared/userscript';
import type { LaunchStyle } from '@/shared/types/launch-style';

let currentUrl = window.location.href;
let copierInstance: YouTubeInfoCopier | null = null;

const launchStyle: LaunchStyle = getLaunchStyle('youtube-info-copier');

// 起動スタイル切り替えメニュー（常に登録）
registerLaunchStyleMenu('youtube-info-copier');

// メインアクション用メニューコマンド（常に登録）
registerMenuCommand('動画情報をコピー', () => {
  void copierInstance?.performCopy('copy');
});
registerMenuCommand('タイトル+URLのみ', () => {
  void copierInstance?.performCopy('quick-copy');
});

/**
 * スクリプトを初期化または再初期化します。
 */
function initializeScript(): void {
  // 既存のインスタンスをクリーンアップ
  if (copierInstance) {
    copierInstance.destroy();
    copierInstance = null;
  }

  // watchページでのみコントロールパネルを作成
  if (window.location.pathname === '/watch') {
    setTimeout(() => {
      copierInstance = new YouTubeInfoCopier(launchStyle);
    }, 1000); // YouTubeの動的読み込みを待つ
  }
}

// 初期化（ページ読み込み時）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScript);
} else {
  initializeScript();
}

/**
 * URLの変更を監視するMutationObserverを開始します。
 * document.bodyが利用可能になってから呼び出す必要があります。
 */
function startUrlObserver(): void {
  const target = document.body;
  if (!target) {
    const onReady = () => {
      document.removeEventListener('DOMContentLoaded', onReady);
      startUrlObserver();
    };
    document.addEventListener('DOMContentLoaded', onReady);
    return;
  }

  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      initializeScript();
    }
  });
  observer.observe(target, { childList: true, subtree: true });
}

startUrlObserver();
