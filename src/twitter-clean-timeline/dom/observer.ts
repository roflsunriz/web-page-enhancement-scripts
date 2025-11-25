/**
 * twitter-clean-timeline - バッチ処理MutationObserver
 */

import { createLogger } from '@/shared/logger';
import { TWITTER_SELECTORS } from '@/shared/constants/twitter';
import { processTweetElement } from './tweet-processor';

const logger = createLogger('twitter-clean-timeline:observer');

const pendingTweetChecks = new Set<HTMLElement>();
let checkScheduled = false;
let observer: MutationObserver | null = null;

/**
 * バッチ処理をスケジュール
 */
function scheduleCheck(): void {
  if (checkScheduled) return;
  
  checkScheduled = true;
  requestAnimationFrame(() => {
    checkScheduled = false;

    const tweets = Array.from(pendingTweetChecks);
    pendingTweetChecks.clear();

    for (const el of tweets) {
      // DOMから削除されている場合はスキップ
      if (!document.body.contains(el)) continue;
      
      // すでに処理済みの場合はスキップ
      if (el.dataset.ctlProcessed) continue;

      processTweetElement(el);
      el.dataset.ctlProcessed = 'true';
    }
  });
}

/**
 * MutationObserverのコールバック
 */
function handleMutations(mutations: MutationRecord[]): void {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') continue;

    for (const node of Array.from(mutation.addedNodes)) {
      if (!(node instanceof HTMLElement)) continue;

      // article要素を探す
      const article = node.matches(TWITTER_SELECTORS.article)
        ? node
        : node.querySelector<HTMLElement>(TWITTER_SELECTORS.article);

      if (article) {
        pendingTweetChecks.add(article);
      }
    }
  }

  if (pendingTweetChecks.size > 0) {
    scheduleCheck();
  }
}

/**
 * オブザーバーを開始
 */
export function startObserver(): void {
  if (observer) {
    logger.warn('オブザーバーは既に起動しています');
    return;
  }

  observer = new MutationObserver(handleMutations);

  // mainタグを監視対象にする
  const mainElement = document.querySelector('main');
  if (mainElement) {
    observer.observe(mainElement, {
      childList: true,
      subtree: true,
    });
    logger.info('メイン要素の監視を開始しました');
  } else {
    // フォールバック: bodyを監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    logger.info('body要素の監視を開始しました（main要素が見つかりません）');
  }

  // 初期表示のツイートを処理
  const existingTweets = document.querySelectorAll<HTMLElement>(TWITTER_SELECTORS.article);
  existingTweets.forEach((tweet) => {
    if (!tweet.dataset.ctlProcessed) {
      pendingTweetChecks.add(tweet);
    }
  });

  if (pendingTweetChecks.size > 0) {
    scheduleCheck();
  }
}

/**
 * オブザーバーを停止
 */
export function stopObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
    logger.info('オブザーバーを停止しました');
  }
}

