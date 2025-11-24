/**
 * Twitter Clean UI - 型定義
 */

/**
 * UI要素の識別子
 */
export type UIElementId =
  // 左サイドバー
  | 'leftSidebar'
  | 'leftSidebar_Logo'
  | 'leftSidebar_HomeLink'
  | 'leftSidebar_ExploreLink'
  | 'leftSidebar_NotificationsLink'
  | 'leftSidebar_MessagesLink'
  | 'leftSidebar_BookmarksLink'
  | 'leftSidebar_ListsLink'
  | 'leftSidebar_ProfileLink'
  | 'leftSidebar_PremiumLink'
  | 'leftSidebar_MoreMenu'
  | 'leftSidebar_TweetButton'
  | 'leftSidebar_ProfileMenu'
  // 右サイドバー
  | 'rightSidebar'
  | 'rightSidebar_SearchBox'
  | 'rightSidebar_PremiumSubscribe'
  | 'rightSidebar_TrendsList'
  | 'rightSidebar_WhoToFollow'
  | 'rightSidebar_Footer'
  // メインコンテンツ
  | 'mainContent'
  | 'mainContent_TweetComposer'
  | 'promotedTweets';

/**
 * UI要素のカテゴリ
 */
export type UIElementCategory =
  | 'leftSidebar'
  | 'rightSidebar'
  | 'mainContent'
  | 'layout';

/**
 * UI要素の検出方法
 */
export interface DetectionStrategy {
  type: 'querySelector' | 'querySelectorAll' | 'xpath' | 'custom';
  selector?: string;
  xpath?: string;
  finder?: () => HTMLElement | null;
  method: string;
  confidence: number;
}

/**
 * UI要素の定義
 */
export interface UIElementDefinition {
  id: UIElementId;
  category: UIElementCategory;
  description: string;
  strategies: DetectionStrategy[];
}

/**
 * 検出されたUI要素
 */
export interface DetectedElement {
  id: UIElementId;
  element: HTMLElement;
  method: string;
  confidence: number;
}

/**
 * 表示設定
 */
export interface VisibilitySettings {
  // 左サイドバー
  leftSidebar: boolean;
  leftSidebar_Logo: boolean;
  leftSidebar_HomeLink: boolean;
  leftSidebar_ExploreLink: boolean;
  leftSidebar_NotificationsLink: boolean;
  leftSidebar_MessagesLink: boolean;
  leftSidebar_BookmarksLink: boolean;
  leftSidebar_ListsLink: boolean;
  leftSidebar_ProfileLink: boolean;
  leftSidebar_PremiumLink: boolean;
  leftSidebar_MoreMenu: boolean;
  leftSidebar_TweetButton: boolean;
  leftSidebar_ProfileMenu: boolean;

  // 右サイドバー
  rightSidebar: boolean;
  rightSidebar_SearchBox: boolean;
  rightSidebar_PremiumSubscribe: boolean;
  rightSidebar_TrendsList: boolean;
  rightSidebar_WhoToFollow: boolean;
  rightSidebar_Footer: boolean;

  // メインコンテンツ
  mainContent_TweetComposer: boolean;
  promotedTweets: boolean;
}

/**
 * レイアウト設定
 */
export interface LayoutSettings {
  leftSidebarWidth: number; // px
  mainContentWidth: number; // px
  rightSidebarWidth: number; // px
  mainContentPadding: number; // px
  timelineRightPadding: number; // px（タイムラインと右サイドバー間）
  gap: number; // px（カラム間の間隔）
}

/**
 * 全設定
 */
export interface Settings {
  visibility: VisibilitySettings;
  layout: LayoutSettings;
  enableRealTimePreview: boolean;
  language: 'ja' | 'en';
}

/**
 * プロファイル
 */
export interface Profile {
  id: string;
  name: string;
  settings: Settings;
  createdAt: number;
  updatedAt: number;
}

/**
 * ストレージデータ
 */
export interface StorageData {
  currentProfileId: string;
  profiles: Record<string, Profile>;
  settings: Settings; // 現在のアクティブ設定
}

/**
 * 言語
 */
export type Language = 'ja' | 'en';

/**
 * 翻訳キー
 */
export interface TranslationKeys {
  // 一般
  appName: string;
  settings: string;
  save: string;
  cancel: string;
  reset: string;
  apply: string;
  close: string;

  // セクション
  leftSidebarSettings: string;
  rightSidebarSettings: string;
  mainContentSettings: string;
  layoutSettings: string;
  profileSettings: string;

  // 左サイドバー
  leftSidebar: string;
  leftSidebar_Logo: string;
  leftSidebar_HomeLink: string;
  leftSidebar_ExploreLink: string;
  leftSidebar_NotificationsLink: string;
  leftSidebar_MessagesLink: string;
  leftSidebar_BookmarksLink: string;
  leftSidebar_ListsLink: string;
  leftSidebar_ProfileLink: string;
  leftSidebar_PremiumLink: string;
  leftSidebar_MoreMenu: string;
  leftSidebar_TweetButton: string;
  leftSidebar_ProfileMenu: string;

  // 右サイドバー
  rightSidebar: string;
  rightSidebar_SearchBox: string;
  rightSidebar_PremiumSubscribe: string;
  rightSidebar_TrendsList: string;
  rightSidebar_WhoToFollow: string;
  rightSidebar_Footer: string;

  // メインコンテンツ
  mainContent_TweetComposer: string;
  promotedTweets: string;

  // レイアウト
  leftSidebarWidth: string;
  mainContentWidth: string;
  rightSidebarWidth: string;
  mainContentPadding: string;
  timelineRightPadding: string;
  gap: string;

  // その他
  enableRealTimePreview: string;
  createNewProfile: string;
  deleteProfile: string;
  exportSettings: string;
  importSettings: string;
}

