/**
 * twitter-clean-timeline - フィルタ基底クラス
 */

import type { TweetResult, FilterResult } from '../types';

export abstract class BaseFilter {
  abstract get name(): string;
  abstract get enabled(): boolean;

  /**
   * JSON段階での判定
   */
  abstract shouldHideFromJSON(tweet: TweetResult | undefined): FilterResult;

  /**
   * DOM段階での判定（フォールバック用）
   */
  abstract shouldHideFromDOM(element: HTMLElement): FilterResult;

  /**
   * フィルタが有効かつ非表示にすべきか判定
   */
  shouldHide(tweet: TweetResult | undefined, element?: HTMLElement): FilterResult {
    if (!this.enabled) {
      return { shouldHide: false };
    }

    if (tweet) {
      const jsonResult = this.shouldHideFromJSON(tweet);
      if (jsonResult.shouldHide) {
        return jsonResult;
      }
    }

    if (element) {
      return this.shouldHideFromDOM(element);
    }

    return { shouldHide: false };
  }
}

