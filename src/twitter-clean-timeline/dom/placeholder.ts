/**
 * twitter-clean-timeline - プレースホルダー表示
 */

import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:placeholder');

/**
 * フィルタされたツイートをプレースホルダーに置き換える
 */
export function createPlaceholder(reason: string): HTMLElement {
  const placeholder = document.createElement('div');
  placeholder.dataset.twitterCleanTimelinePlaceholder = '1';
  placeholder.textContent = `フィルタ済み: ${reason}`;
  
  // スタイル適用
  Object.assign(placeholder.style, {
    fontSize: '12px',
    color: 'rgb(113, 118, 123)',
    opacity: '0.6',
    padding: '8px 16px',
    borderBottom: '1px solid rgb(239, 243, 244)',
    backgroundColor: 'rgb(247, 249, 249)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
  });

  return placeholder;
}

/**
 * ツイート要素をプレースホルダーに置き換える
 * @param target - 置き換え対象の要素
 * @param reason - フィルタ理由
 * @param originalHeight - 元の要素の高さ
 * @param isAboveViewport - ビューポートより上にあるか
 * @returns スクロール補正値（負の値 = 縮んだ分）
 */
export function replaceWithPlaceholder(
  target: HTMLElement,
  reason: string,
  originalHeight: number,
  isAboveViewport: boolean
): number {
  const placeholder = createPlaceholder(reason);
  
  try {
    target.replaceWith(placeholder);
    
    if (isAboveViewport && originalHeight > 0) {
      // プレースホルダーの高さを取得
      const placeholderHeight = placeholder.getBoundingClientRect().height || 0;
      // 縮んだ分を返す（正の値）
      return originalHeight - placeholderHeight;
    }
  } catch (e) {
    logger.error('プレースホルダー置換エラー', e);
    // エラー時はフォールバックで非表示
    target.style.display = 'none';
  }

  return 0;
}

