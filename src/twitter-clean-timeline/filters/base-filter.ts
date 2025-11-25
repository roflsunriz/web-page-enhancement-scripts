/**
 * twitter-clean-timeline - フィルタ基底クラス
 */

import type { FilterResult } from '@/shared/types';

export abstract class BaseFilter {
  abstract get name(): string;
  abstract get enabled(): boolean;

  /**
   * DOM要素に対するフィルタリング判定
   */
  abstract shouldHideFromDOM(element: HTMLElement): FilterResult;
}

