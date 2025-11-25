/**
 * twitter-clean-timeline - 型定義
 */

// ============================================================================
// GraphQL JSON構造の型定義
// ============================================================================

export interface TweetLegacy {
  full_text?: string;
  retweeted_status_id_str?: string;
  quoted_status_id_str?: string;
  entities?: {
    media?: Array<{
      type: string;
      media_url_https: string;
    }>;
  };
  extended_entities?: {
    media?: Array<{
      type: string;
      media_url_https: string;
      video_info?: {
        variants: Array<{
          url: string;
          bitrate?: number;
        }>;
      };
    }>;
  };
}

export interface UserLegacy {
  screen_name?: string;
  name?: string;
}

export interface UserResult {
  legacy?: UserLegacy;
}

export interface CoreUserResults {
  result?: UserResult;
}

export interface TweetResult {
  __typename?: string;
  legacy?: TweetLegacy;
  core?: {
    user_results?: CoreUserResults;
  };
  tweet?: TweetResult; // ネストされたツイート（引用RTなど）
}

export interface TweetResultWrapper {
  result?: TweetResult;
}

export interface TimelineItemContent {
  itemType?: string;
  tweet_results?: TweetResultWrapper;
}

export interface TimelineEntry {
  entryId?: string;
  sortIndex?: string;
  content?: {
    entryType?: string;
    itemContent?: TimelineItemContent;
    value?: string;
    cursorType?: string;
  };
}

export interface TimelineInstruction {
  type?: string;
  entries?: TimelineEntry[];
}

export interface TimelineData {
  instructions?: TimelineInstruction[];
}

export interface HomeTimelineResponse {
  data?: {
    home?: {
      home_timeline_urt?: TimelineData;
    };
  };
}

// ============================================================================
// 設定の型定義
// ============================================================================

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

