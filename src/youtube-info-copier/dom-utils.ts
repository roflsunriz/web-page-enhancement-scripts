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
    
    // is-expanded 属性をチェック
    if (inlineExpander?.hasAttribute('is-expanded')) {
      return true;
    }
    
    // #expanded 要素に内容があるかチェック
    const expandedDiv = (inlineExpander || descriptionEl).querySelector<HTMLElement>('#expanded');
    if (expandedDiv) {
      const expandedText = (expandedDiv.textContent || expandedDiv.innerText || '').trim();
      if (expandedText && expandedText.length > 100) {
        logger.debug('Description is expanded (found content in #expanded)');
        return true;
      }
    }
    
    // フォールバック: テキスト長で判定
    const descText = (descriptionEl.textContent || '').trim();
    const hasEnoughText = descText.length > 300 || descriptionEl.querySelectorAll('span').length > 5;
    if (hasEnoughText) {
      logger.debug('Description appears expanded based on length');
    }
    return hasEnoughText;
  };

  if (isExpanded()) return;

  const initialLength = (descriptionEl.textContent || '').length;
  const clicked = clickExpandButton();
  if (!clicked) return;

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const nowLen = (descriptionEl.textContent || '').length;
      const expandedNow = isExpanded();
      const lengthIncreased = nowLen > initialLength + 50;
      const timedOut = Date.now() - start > timeoutMs;
      
      if (expandedNow || lengthIncreased || timedOut) {
        clearInterval(interval);
        if (expandedNow || lengthIncreased) {
          logger.info(`Description expanded successfully (length: ${initialLength} -> ${nowLen})`);
        } else {
          logger.warn('Description expansion timed out');
        }
        // DOMの更新を待つために少し遅延
        setTimeout(() => resolve(), 100);
      }
    }, 100);
  });
}
