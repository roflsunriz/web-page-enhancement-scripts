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
      logger.debug('Already has is-expanded attribute');
      return true;
    }

    // まず最も確実な方法: #description-inline-expander #expand を直接クリック
    const expandButton = document.querySelector<HTMLElement>('tp-yt-paper-button#expand');
    if (expandButton && expandButton.textContent?.includes('もっと見る')) {
      try {
        logger.debug('Clicking tp-yt-paper-button#expand directly');
        expandButton.click();
        logger.info('概要欄の「もっと見る」ボタンをクリックしました。');
        return true;
      } catch (err) {
        logger.warn('Direct click failed:', err);
      }
    }

    // フォールバック: 既存の方法
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
            logger.debug(`Clicking element: ${el.tagName}#${el.id} "${txt}"`);
            el.click();
            logger.info('概要欄の「もっと見る」ボタンをクリックしました（フォールバック）。');
            return true;
          }
        }
      } catch {
        // ignore and continue
      }
    }

    logger.warn('No expand button found');
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
    const startTime = Date.now();
    let checkCount = 0;
    let observer: MutationObserver | null = null;
    let pollTimer: number | null = null;
    
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };
    
    const checkExpansion = (source: string) => {
      checkCount++;
      const expandedDiv = descriptionEl.querySelector<HTMLElement>('#expanded');
      const expandedLength = expandedDiv ? (expandedDiv.textContent || '').trim().length : 0;
      const expandedNow = isExpanded();
      const elapsed = Date.now() - startTime;
      
      logger.debug(`Check ${checkCount} (${source}): expanded=${expandedNow}, #expanded length=${expandedLength}, elapsed=${elapsed}ms`);
      
      if (expandedNow) {
        cleanup();
        logger.info(`Description expanded successfully (#expanded: ${expandedLength} chars) after ${elapsed}ms`);
        // DOMの完全な更新を待つ
        setTimeout(() => resolve(), 200);
        return true;
      }
      
      if (elapsed > timeoutMs) {
        cleanup();
        logger.warn(`Description expansion timed out after ${elapsed}ms (${checkCount} checks)`);
        resolve();
        return true;
      }
      
      return false;
    };
    
    // MutationObserverで #expanded の変化を監視
    const expandedDiv = descriptionEl.querySelector<HTMLElement>('#expanded');
    if (expandedDiv) {
      observer = new MutationObserver(() => {
        checkExpansion('mutation');
      });
      observer.observe(expandedDiv, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
      logger.debug('MutationObserver started on #expanded');
    }
    
    // ポーリングも併用（MutationObserverが発火しない場合のバックアップ）
    pollTimer = window.setInterval(() => {
      checkExpansion('poll');
    }, 200);
    
    // 最初のチェック
    checkExpansion('initial');
  });
}
