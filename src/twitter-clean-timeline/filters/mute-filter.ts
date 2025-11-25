/**
 * twitter-clean-timeline - ミュートフィルタ
 */

import { BaseFilter } from './base-filter';
import type { FilterResult } from '@/shared/types';
import { settings } from '../settings';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline:mute-filter');

export class MuteFilter extends BaseFilter {
  private muteRegexes: RegExp[] = [];

  constructor() {
    super();
    this.updateMuteRegexes();
  }

  get name(): string {
    return 'mute';
  }

  get enabled(): boolean {
    return settings.muteFilter.enabled;
  }

  /**
   * 正規表現パターンを更新
   */
  updateMuteRegexes(): void {
    this.muteRegexes = settings.muteFilter.regexKeywords
      .filter((pattern) => pattern.trim() !== '')
      .map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (e) {
          logger.error(`無効な正規表現パターン: ${pattern}`, e);
          return null;
        }
      })
      .filter((regex): regex is RegExp => regex !== null);
  }

  /**
   * テキストがミュート対象かチェック
   */
  private isTextMuted(text: string): { muted: boolean; keyword?: string } {
    // 文字列キーワードチェック
    for (const keyword of settings.muteFilter.stringKeywords) {
      if (keyword && text.includes(keyword)) {
        return { muted: true, keyword };
      }
    }

    // 正規表現キーワードチェック
    for (const regex of this.muteRegexes) {
      if (regex.test(text)) {
        return { muted: true, keyword: regex.source };
      }
    }

    return { muted: false };
  }

  shouldHideFromDOM(element: HTMLElement): FilterResult {
    if (!this.enabled || !element.innerText) {
      return { shouldHide: false };
    }

    const text = element.innerText;
    const result = this.isTextMuted(text);

    if (result.muted) {
      return {
        shouldHide: true,
        reason: `ミュート: ${result.keyword}`,
        filterName: this.name,
      };
    }

    return { shouldHide: false };
  }
}

