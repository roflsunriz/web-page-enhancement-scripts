/**
 * twitter-clean-timeline - リツイートフィルタ
 */

import { BaseFilter } from './base-filter';
import type { FilterResult } from '@/shared/types';
import { settings } from '../settings';
import { TWITTER_SELECTORS } from '@/shared/constants/twitter';

export class RetweetFilter extends BaseFilter {
  get name(): string {
    return 'retweet';
  }

  get enabled(): boolean {
    return settings.retweetFilter.enabled;
  }

  /**
   * プロフィールページかどうか判定
   */
  private isProfilePage(): boolean {
    const path = window.location.pathname;
    // プロフィールページ: /username 形式（ただし /home, /search などは除外）
    return (
      path.match(/^\/[^/]+$/) !== null &&
      !path.match(/^\/search$|^\/explore$|^\/home$/)
    );
  }

  shouldHideFromDOM(element: HTMLElement): FilterResult {
    if (!this.enabled || !this.isProfilePage()) {
      return { shouldHide: false };
    }

    // リツイートインジケータの存在チェック
    const hasRetweetIndicator = element.querySelector(TWITTER_SELECTORS.retweetIndicator);

    if (hasRetweetIndicator) {
      return {
        shouldHide: true,
        reason: 'リツイート',
        filterName: this.name,
      };
    }

    return { shouldHide: false };
  }
}

