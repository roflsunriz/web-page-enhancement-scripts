import { processTimeline } from './filter';
import { createLogger } from '@/shared/logger';
import { PageType } from '@/shared/types';

const logger = createLogger('twitter-media-filter');

/**
 * 現在のページタイプを取得します。
 * @returns {PageType} 現在のページタイプ。
 */
export function getPageType(): PageType {
  const path = window.location.pathname;

  if (path === '/home') return 'timeline';
  if (path.includes('/lists/')) return 'list';
  if (path.match(/^\/[^/]+$/) && !path.match(/^\/search$|^\/explore$|^\/home$/)) return 'profile';
  if (path.match(/^\/search/)) return 'search';
  if (path.match(/\/status\//)) return 'tweetDetail';

  return 'other';
}

/**
 * DOMの変更とURLの変更を監視するオブザーバーを設定します。
 */
export function setupObservers(): void {
  // 1. DOM変更の監視
  const domObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 少し遅延させてDOMが完全に読み込まれるのを待つ
        setTimeout(processTimeline, 100);
        return; // 複数のmutationがあっても一度だけ実行
      }
    }
  });

  const mainElement = document.querySelector('main');
  if (mainElement) {
    domObserver.observe(mainElement, { childList: true, subtree: true });
    logger.info('メイン要素の監視を開始しました');
  } else {
    // フォールバックとしてbodyを監視
    domObserver.observe(document.body, { childList: true, subtree: true });
    logger.info('body要素の監視を開始しました（main要素を探しています）');
  }

  // 2. URL変更の監視
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      logger.info(`ページ遷移を検知: ${location.href}`);
      // ページ遷移後、少し待ってから処理を実行
      setTimeout(processTimeline, 500);
    }
  });

  const titleElement = document.querySelector('title');
  if (titleElement) {
    // SPAでのページ遷移はtitleの変更を伴うことが多い
    urlObserver.observe(titleElement, { subtree: true, childList: true });
  }
}