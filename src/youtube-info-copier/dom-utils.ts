import { createLogger } from '@/shared/logger';
import { YOUTUBE_SELECTORS } from '@/shared/constants/youtube';

const logger = createLogger('youtube-info-copier:dom-utils');

/**
 * 概要欄が折りたたまれている場合に安全に展開します。
 * @param timeoutMs - タイムアウト時間（ミリ秒）。
 */
export async function expandDescriptionIfNeeded(timeoutMs = 4000): Promise<void> {
  const start = Date.now();

  const descriptionEl = YOUTUBE_SELECTORS.descriptionCandidates
    .map((selector) => document.querySelector<HTMLElement>(selector))
    .find(Boolean);
  if (!descriptionEl) return;

  const clickExpandButton = (): boolean => {
    const inlineExpander =
      descriptionEl.querySelector<HTMLElement>(YOUTUBE_SELECTORS.inlineExpander) ||
      document.querySelector<HTMLElement>(YOUTUBE_SELECTORS.inlineExpanderById);

    if (inlineExpander?.hasAttribute('is-expanded')) {
      return true;
    }

    const matchRegex = /(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i;
    const candidates: HTMLElement[] = [];

    if (inlineExpander) {
      candidates.push(...Array.from(inlineExpander.querySelectorAll<HTMLElement>(YOUTUBE_SELECTORS.interactiveElements)));
    }
    candidates.push(...Array.from(document.querySelectorAll<HTMLElement>(YOUTUBE_SELECTORS.interactiveElements)));

    for (const el of candidates) {
      try {
        const txt = (el.textContent || '').trim();
        const aria = el.getAttribute('aria-expanded');
        if (aria === 'false' || matchRegex.test(txt) || (el.id && /expand|more|collapse/i.test(el.id))) {
          if (typeof el.click === 'function') {
            el.click();
            logger.info('概要欄の「もっと見る」ボタンをクリックしました。');
            return true;
          }
        }
      } catch {
        // ignore and continue
      }
    }

    return false;
  };

  const isExpanded = (): boolean => {
    const inlineExpander =
      descriptionEl.querySelector<HTMLElement>(YOUTUBE_SELECTORS.inlineExpander) ||
      document.querySelector<HTMLElement>(YOUTUBE_SELECTORS.inlineExpanderById);
    if (inlineExpander?.hasAttribute('is-expanded')) {
      return true;
    }
    const descText = (descriptionEl.textContent || '').trim();
    return descText.length > 200 || descriptionEl.querySelectorAll('span').length > 3;
  };

  if (isExpanded()) return;

  const initialLength = (descriptionEl.textContent || '').length;
  const clicked = clickExpandButton();
  if (!clicked) return;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const nowLen = (descriptionEl.textContent || '').length;
      if (isExpanded() || nowLen > initialLength + 20 || Date.now() - start > timeoutMs) {
        clearInterval(interval);
        resolve();
      }
    }, 80);
  });
}
