import { createLogger } from '@/shared/logger';
import { settings } from './settings';
import { getPageType } from './observer';

const logger = createLogger('twitter-media-filter');

/**
 * 現在のページでフィルタリングが有効かどうかを判断します。
 * @returns {boolean} フィルタリングが有効な場合はtrue。
 */
function isEnabledForCurrentPage(): boolean {
  const pageType = getPageType();

  switch (pageType) {
    case 'timeline':
      return settings.enableOnTimeline;
    case 'list':
      return settings.enableOnLists;
    case 'profile':
      return settings.enableOnProfile;
    case 'search':
      return settings.enableOnSearch;
    case 'tweetDetail':
      return settings.enableOnTweetDetail;
    default:
      return false;
  }
}

/**
 * ツイートに画像や動画が含まれているかチェックします。
 * @param {HTMLElement} tweetElement - チェックするツイート要素。
 * @returns {boolean} メディアが含まれている場合はtrue。
 */
function hasTweetMedia(tweetElement: HTMLElement): boolean {
  const mediaSelectors = [
    'div[data-testid="tweetPhoto"]',
    'div[data-testid="videoPlayer"]',
    'div[data-testid="card.layoutSmall.media"]',
    'div[data-testid="card.layoutLarge.media"]',
  ];

  return mediaSelectors.some((selector) => tweetElement.querySelector(selector));
}

/**
 * タイムライン上のすべてのツイートを処理します。
 */
export function processTimeline(): void {
  if (!isEnabledForCurrentPage()) {
    return;
  }

  logger.info('タイムライン処理開始');

  const tweets = document.querySelectorAll<HTMLElement>('article[data-testid="tweet"]');

  tweets.forEach((tweet) => {
    if (tweet.hasAttribute('data-media-filter-processed')) return;

    if (!hasTweetMedia(tweet)) {
      tweet.style.display = 'none';
    }
    tweet.setAttribute('data-media-filter-processed', 'true');
  });
}