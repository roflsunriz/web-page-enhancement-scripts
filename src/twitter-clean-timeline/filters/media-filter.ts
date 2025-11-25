/**
 * twitter-clean-timeline - メディアフィルタ
 */

import { BaseFilter } from './base-filter';
import type { TweetResult, FilterResult, PageType } from '@/shared/types';
import { settings } from '../settings';
import { hasMediaInTweet } from '../network/timeline-parser';
import { TWITTER_MEDIA_CARD_SELECTORS } from '@/shared/constants/twitter';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:media-filter');

export class MediaFilter extends BaseFilter {
  get name(): string {
    return 'media';
  }

  get enabled(): boolean {
    return settings.mediaFilter.enabled;
  }

  /**
   * 現在のページタイプを取得
   */
  private getPageType(): PageType {
    const path = window.location.pathname;

    if (path === '/home') return 'timeline';
    if (path.includes('/lists/')) return 'list';
    if (path.match(/^\/[^/]+$/) && !path.match(/^\/search$|^\/explore$|^\/home$/)) return 'profile';
    if (path.match(/^\/search/)) return 'search';
    if (path.match(/\/status\//)) return 'tweetDetail';

    return 'other';
  }

  /**
   * 現在のページでフィルタが有効か判定
   */
  private isEnabledForCurrentPage(): boolean {
    const pageType = this.getPageType();

    switch (pageType) {
      case 'timeline':
        return settings.mediaFilter.enableOnTimeline;
      case 'list':
        return settings.mediaFilter.enableOnLists;
      case 'profile':
        return settings.mediaFilter.enableOnProfile;
      case 'search':
        return settings.mediaFilter.enableOnSearch;
      case 'tweetDetail':
        return settings.mediaFilter.enableOnTweetDetail;
      default:
        return false;
    }
  }

  shouldHideFromJSON(tweet: TweetResult | undefined): FilterResult {
    if (!this.enabled || !this.isEnabledForCurrentPage()) {
      return { shouldHide: false };
    }

    const hasMedia = hasMediaInTweet(tweet);
    
    if (settings.debugMode) {
      logger.debug('JSON メディアチェック:', {
        hasMedia,
        hasTweet: !!tweet,
        hasLegacy: !!tweet?.legacy,
        hasExtendedEntities: !!tweet?.legacy?.extended_entities,
        hasBasicEntities: !!tweet?.legacy?.entities,
      });
    }
    
    if (!hasMedia) {
      return {
        shouldHide: true,
        reason: 'メディアなし',
        filterName: this.name,
      };
    }

    return { shouldHide: false };
  }

  shouldHideFromDOM(element: HTMLElement): FilterResult {
    if (!this.enabled || !this.isEnabledForCurrentPage()) {
      return { shouldHide: false };
    }

    const hasMedia = TWITTER_MEDIA_CARD_SELECTORS.some((selector) =>
      element.querySelector(selector)
    );

    if (settings.debugMode) {
      logger.debug('DOM メディアチェック:', {
        hasMedia,
        elementTagName: element.tagName,
        checkedSelectors: TWITTER_MEDIA_CARD_SELECTORS.length,
      });
    }

    if (!hasMedia) {
      if (settings.debugMode) {
        logger.warn('DOMフォールバックでフィルタリング - JSONフィルタが動作していない可能性があります');
      }
      return {
        shouldHide: true,
        reason: 'メディアなし (DOM)',
        filterName: this.name,
      };
    }

    return { shouldHide: false };
  }
}

