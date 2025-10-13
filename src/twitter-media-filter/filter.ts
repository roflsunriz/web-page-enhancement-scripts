import { createLogger } from '@/shared/logger';
import { settings } from './settings';
import { getPageType } from './observer';
import { TWITTER_MEDIA_CARD_SELECTORS, TWITTER_SELECTORS } from '@/shared/constants/twitter';

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
  return TWITTER_MEDIA_CARD_SELECTORS.some((selector) => tweetElement.querySelector(selector));
}

/**
 * タイムライン上のすべてのツイートを処理します。
 */
export function processTimeline(): void {
  if (!isEnabledForCurrentPage()) {
    return;
  }

  logger.info('タイムライン処理開始');

  const tweets = document.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article);

  tweets.forEach((tweet) => {
    if (tweet.hasAttribute('data-media-filter-processed')) return;

    if (!hasTweetMedia(tweet)) {
      tweet.style.display = 'none';
    }
    tweet.setAttribute('data-media-filter-processed', 'true');
  });
}
