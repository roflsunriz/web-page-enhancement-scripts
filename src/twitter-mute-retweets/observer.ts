import { settings } from './settings';
import { removeRetweets } from './filter';
import { createLogger } from '@/shared/logger';
import { TWITTER_SELECTORS } from '@/shared/constants/twitter';

const logger = createLogger('twitter-mute-retweets');

let observer: MutationObserver | null = null;
let currentURL = location.href;

/**
 * 指定された時間待機してから関数を実行するデバウンス関数。
 * @param func - 実行する関数。
 * @param wait - 待機時間（ミリ秒）。
 * @returns デバウンスされた関数。
 */
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: number;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

export let debouncedRemoveRetweets = debounce(removeRetweets, settings.checkInterval);

/**
 * MutationObserverのコールバック関数。
 * @param mutations - 変更のリスト。
 */
function mutationCallback(mutations: MutationRecord[]): void {
  if (!settings.enabled) return;

  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      debouncedRemoveRetweets();
      return; // 関連する変更があれば一度だけ実行
    }
  }
}

/**
 * DOMの変更を監視するオブザーバーを開始します。
 */
export function startObserver(): void {
  if (observer) return;

  const timelineContainer = document.querySelector(TWITTER_SELECTORS.timelineMain);
  if (!timelineContainer) {
    setTimeout(startObserver, 1000);
    return;
  }

  observer = new MutationObserver(mutationCallback);
  observer.observe(timelineContainer, { childList: true, subtree: true });
  logger.info('タイムラインの監視を開始しました。');
  debouncedRemoveRetweets(); // 初回実行
}

/**
 * DOMの変更を監視するオブザーバーを停止します。
 */
export function stopObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
    logger.info('タイムラインの監視を停止しました。');
  }
}

/**
 * デバウンス関数を新しい設定で更新します。
 */
export function updateDebounceWait(): void {
  debouncedRemoveRetweets = debounce(removeRetweets, settings.checkInterval);
}

// URL変更を監視
setInterval(() => {
  if (currentURL !== location.href) {
    currentURL = location.href;
    logger.info('URLの変更を検知:', currentURL);
    if (settings.enabled) {
      setTimeout(debouncedRemoveRetweets, 500);
    }
  }
}, 1000);
