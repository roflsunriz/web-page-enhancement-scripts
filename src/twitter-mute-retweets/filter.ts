import { settings } from './settings';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-mute-retweets');

/**
 * 指定された要素の祖先から<article>要素を見つけます。
 * @param el - 開始要素。
 * @returns 見つかった<article>要素、またはnull。
 */
function findArticleAncestor(el: HTMLElement | null): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current.tagName !== 'ARTICLE') {
    current = current.parentElement;
  }
  return current;
}

/**
 * タイムライン上のリツイートを非表示にします。
 */
export function removeRetweets(): void {
  if (!settings.enabled) return;

  // リツイートを示す要素を持つツイートを探して非表示にする
  const retweetIndicators = document.querySelectorAll<HTMLElement>('.r-15zivkp');
  logger.debug(`${retweetIndicators.length}個のリツイートインジケータが見つかりました。`);

  retweetIndicators.forEach((indicator) => {
    const article = findArticleAncestor(indicator);
    if (article && !article.dataset.hidden) {
      article.style.display = 'none';
      article.dataset.hidden = 'true';
    }
  });
}