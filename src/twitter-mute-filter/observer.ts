import { processTweet } from './filter';
import { settings } from './settings';
import { createLogger } from '@/shared/logger';
import { showSettingsModal } from './ui';
import { TWITTER_SELECTORS } from '@/shared/constants/twitter';

const logger = createLogger('twitter-mute-filter');

/**
 * ページ上のすべてのツイートを処理します。
 */
function processAllTweets(): void {
  if (!settings.enabled) return;

  const tweets = document.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.tweetObserverTargets);
  tweets.forEach(processTweet);
  logger.info(`${tweets.length}件のツイートをチェックしました`);
}

/**
 * DOMの変更とURLの変更を監視するオブザーバーを設定します。
 */
export function setupObservers(): void {
  // 1. DOM変更の監視
  const domObserver = new MutationObserver((mutations) => {
    if (!settings.enabled) return;

    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tweets = element.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.tweetCandidates);
            tweets.forEach(processTweet);

            if (element.matches(TWITTER_SELECTORS.tweetCandidates)) {
              processTweet(element);
            }
          }
        }
      }
    }
  });

  domObserver.observe(document.body, { childList: true, subtree: true });

  // 2. URL変更の監視
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      logger.info('URL変更を検知:', lastUrl);
      if (lastUrl.includes('/settings/muted_keywords')) {
        setTimeout(showSettingsModal, 1000);
      } else {
        setTimeout(processAllTweets, 500);
      }
    }
  });

  urlObserver.observe(document.body, { childList: true, subtree: true });
}
