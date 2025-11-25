/**
 * twitter-clean-timeline - DOM削除 + スクロール補正
 */

import { settings } from '../settings';
import { replaceWithPlaceholder } from './placeholder';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:remover');

let pendingScrollAdjust = 0;
let scrollAdjustScheduled = false;

/**
 * スクロール補正をスケジュール
 */
function scheduleScrollAdjust(delta: number): void {
  if (!delta) return;
  
  pendingScrollAdjust += delta;
  
  if (scrollAdjustScheduled) return;

  scrollAdjustScheduled = true;
  requestAnimationFrame(() => {
    if (pendingScrollAdjust !== 0) {
      // 上にあったツイートを消した分だけ下にスクロールして位置を維持
      window.scrollBy(0, pendingScrollAdjust);
      
      if (settings.debugMode) {
        logger.debug(`スクロール補正: ${pendingScrollAdjust}px`);
      }
      
      pendingScrollAdjust = 0;
    }
    scrollAdjustScheduled = false;
  });
}

/**
 * ツイート要素を削除（またはプレースホルダーに置換）
 * @param el - 削除する要素
 * @param reason - フィルタ理由
 */
export function removeTweetElement(el: HTMLElement, reason: string): void {
  const rect = el.getBoundingClientRect();
  const height = rect.height || 0;
  const isAboveViewport = rect.bottom <= 0;

  // article要素を対象にする
  const target = el.closest('article') ?? el;

  if (settings.showPlaceholder) {
    // プレースホルダーモード
    const scrollDelta = replaceWithPlaceholder(target, reason, height, isAboveViewport);
    if (scrollDelta > 0) {
      scheduleScrollAdjust(scrollDelta);
    }
  } else {
    // 完全削除モード
    try {
      target.remove();
      
      if (isAboveViewport && height > 0) {
        scheduleScrollAdjust(height);
      }
    } catch (e) {
      logger.error('ツイート削除エラー', e);
      // フォールバック: 非表示にする
      target.style.display = 'none';
    }
  }

  if (settings.debugMode) {
    logger.debug(`ツイート削除: ${reason} (高さ: ${height}px, 上側: ${isAboveViewport})`);
  }
}

