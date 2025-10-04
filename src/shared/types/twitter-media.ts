export type PageType = 'timeline' | 'list' | 'profile' | 'search' | 'tweetDetail' | 'other';

export interface TwitterMediaSettings {
  enableOnTimeline: boolean;
  enableOnLists: boolean;
  enableOnProfile: boolean;
  enableOnSearch: boolean;
  enableOnTweetDetail: boolean;
  debugMode: boolean;
}