import { createLogger } from '@/shared/logger';
import { YOUTUBE_SELECTORS } from '@/shared/constants/youtube';

const logger = createLogger('youtube-info-copier:dom-utils');

/**
 * 概要欄が折りたたまれている場合に安全に展開します。
 * @param timeoutMs - タイムアウト時間（ミリ秒）。
 */
export async function expandDescriptionIfNeeded(timeoutMs = 4000): Promise<void> {
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
    
    // #expanded 要素に実際にコンテンツがあるかを最優先でチェック
    const expandedDiv = (inlineExpander || descriptionEl).querySelector<HTMLElement>('#expanded');
    if (expandedDiv) {
      const expandedText = (expandedDiv.textContent || expandedDiv.innerText || '').trim();
      // 展開前は空（0文字）、展開後は数百文字以上になる
      if (expandedText && expandedText.length > 200) {
        logger.debug(`Description is expanded (found ${expandedText.length} chars in #expanded)`);
        return true;
      }
    }
    
    // is-expanded 属性だけでは不十分（属性は付くがコンテンツのロードが遅れる）
    if (inlineExpander?.hasAttribute('is-expanded')) {
      // 属性があっても、#expanded にコンテンツがあることを確認
      if (expandedDiv) {
        const expandedText = (expandedDiv.textContent || expandedDiv.innerText || '').trim();
        if (expandedText && expandedText.length > 200) {
          return true;
        }
        // 属性はあるがコンテンツがまだない場合は待つ
        logger.debug('is-expanded attr found but content not yet loaded');
        return false;
      }
    }
    
    return false;
  };

  if (isExpanded()) return;

  const clicked = clickExpandButton();
  if (!clicked) return;

  return new Promise((resolve) => {
    let checkCount = 0;
    const maxChecks = Math.ceil(timeoutMs / 150);
    
    const interval = setInterval(() => {
      checkCount++;
      const expandedDiv = descriptionEl.querySelector<HTMLElement>('#expanded');
      const expandedLength = expandedDiv ? (expandedDiv.textContent || '').trim().length : 0;
      const expandedNow = isExpanded();
      const timedOut = checkCount >= maxChecks;
      
      logger.debug(`Check ${checkCount}: expanded=${expandedNow}, #expanded length=${expandedLength}`);
      
      if (expandedNow || timedOut) {
        clearInterval(interval);
        if (expandedNow) {
          logger.info(`Description expanded successfully (#expanded: ${expandedLength} chars)`);
          // DOMの完全な更新を待つ
          setTimeout(() => resolve(), 200);
        } else {
          logger.warn(`Description expansion timed out after ${checkCount} checks`);
          resolve();
        }
      }
    }, 150);
  });
}
