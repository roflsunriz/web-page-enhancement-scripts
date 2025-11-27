/**
 * twitter-clean-timeline - 型定義
 */

// ============================================================================
// 設定の型定義
// ============================================================================

export interface KeywordReplacement {
  from: string;
  to: string;
  isRegex: boolean;
}

export interface CleanTimelineSettings {
  // グローバル設定
  showPlaceholder: boolean;
  debugMode: boolean;

  // メディアフィルタ
  mediaFilter: {
    enabled: boolean;
    enableOnTimeline: boolean;
    enableOnLists: boolean;
    enableOnProfile: boolean;
    enableOnSearch: boolean;
    enableOnTweetDetail: boolean;
  };

  // ミュートフィルタ
  muteFilter: {
    enabled: boolean;
    stringKeywords: string[];
    regexKeywords: string[];
  };

  // リツイートフィルタ
  retweetFilter: {
    enabled: boolean;
  };

  // 置き換えフィルタ
  replaceFilter: {
    enabled: boolean;
    replacements: KeywordReplacement[];
  };
}

// ============================================================================
// フィルタ結果の型定義
// ============================================================================

export interface FilterResult {
  shouldHide: boolean;
  reason?: string;
  filterName?: string;
}

export type PageType = 'timeline' | 'list' | 'profile' | 'search' | 'tweetDetail' | 'other';

