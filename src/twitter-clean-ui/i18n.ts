/**
 * Twitter Clean UI - 多言語対応
 */

import type { Language, TranslationKeys } from './types';

/**
 * 日本語翻訳
 */
const ja: TranslationKeys = {
  // 一般
  appName: 'twitter-clean-ui',
  settings: '設定',
  save: '保存',
  cancel: 'キャンセル',
  reset: 'リセット',
  apply: '適用',
  close: '閉じる',

  // セクション
  leftSidebarSettings: '左サイドバー設定',
  rightSidebarSettings: '右サイドバー設定',
  layoutSettings: 'レイアウト設定',
  profileSettings: 'プロファイル設定',

  // 左サイドバー
  leftSidebar: '左サイドバー全体',
  leftSidebar_Logo: 'Xロゴ',
  leftSidebar_HomeLink: 'ホーム',
  leftSidebar_ExploreLink: '話題を検索',
  leftSidebar_NotificationsLink: '通知',
  leftSidebar_MessagesLink: 'メッセージ',
  leftSidebar_GrokLink: 'Grok',
  leftSidebar_ConnectLink: 'フォロー',
  leftSidebar_BookmarksLink: 'ブックマーク',
  leftSidebar_ListsLink: 'リスト',
  leftSidebar_CommunitiesLink: 'コミュニティ',
  leftSidebar_ProfileLink: 'プロフィール',
  leftSidebar_PremiumLink: 'Premium',
  leftSidebar_BusinessLink: 'ビジネス',
  leftSidebar_MoreMenu: 'もっと見る',
  leftSidebar_TweetButton: 'ポストボタン',
  leftSidebar_ProfileMenu: 'プロフィールメニュー',

  // 右サイドバー
  rightSidebar: '右サイドバー全体',
  rightSidebar_SearchBox: '検索ボックス',
  rightSidebar_PremiumSubscribe: 'Premiumサブスクライブ',
  rightSidebar_TrendsList: 'トレンド',
  rightSidebar_WhoToFollow: 'おすすめユーザー',
  rightSidebar_RelatedAccounts: '関連性の高いアカウント',
  rightSidebar_Footer: 'フッター',

  // レイアウト
  mainContentWidth: 'メインコンテンツの幅',
  timelineRightPadding: 'タイムラインと右サイドバー間の余白',

  // その他
  enableRealTimePreview: 'リアルタイムプレビュー',
  createNewProfile: '新しいプロファイルを作成',
  deleteProfile: 'プロファイルを削除',
  exportSettings: '設定をエクスポート',
  importSettings: '設定をインポート',
};

/**
 * 英語翻訳
 */
const en: TranslationKeys = {
  // General
  appName: 'twitter-clean-ui',
  settings: 'Settings',
  save: 'Save',
  cancel: 'Cancel',
  reset: 'Reset',
  apply: 'Apply',
  close: 'Close',

  // Sections
  leftSidebarSettings: 'Left Sidebar Settings',
  rightSidebarSettings: 'Right Sidebar Settings',
  layoutSettings: 'Layout Settings',
  profileSettings: 'Profile Settings',

  // Left Sidebar
  leftSidebar: 'Left Sidebar (Entire)',
  leftSidebar_Logo: 'X Logo',
  leftSidebar_HomeLink: 'Home',
  leftSidebar_ExploreLink: 'Explore',
  leftSidebar_NotificationsLink: 'Notifications',
  leftSidebar_MessagesLink: 'Messages',
  leftSidebar_GrokLink: 'Grok',
  leftSidebar_ConnectLink: 'Follow',
  leftSidebar_BookmarksLink: 'Bookmarks',
  leftSidebar_ListsLink: 'Lists',
  leftSidebar_CommunitiesLink: 'Communities',
  leftSidebar_ProfileLink: 'Profile',
  leftSidebar_PremiumLink: 'Premium',
  leftSidebar_BusinessLink: 'Business',
  leftSidebar_MoreMenu: 'More',
  leftSidebar_TweetButton: 'Post Button',
  leftSidebar_ProfileMenu: 'Profile Menu',

  // Right Sidebar
  rightSidebar: 'Right Sidebar (Entire)',
  rightSidebar_SearchBox: 'Search Box',
  rightSidebar_PremiumSubscribe: 'Premium Subscribe',
  rightSidebar_TrendsList: 'Trends',
  rightSidebar_WhoToFollow: 'Who to Follow',
  rightSidebar_RelatedAccounts: 'Relevant Accounts',
  rightSidebar_Footer: 'Footer',

  // Layout
  mainContentWidth: 'Main Content Width',
  timelineRightPadding: 'Timeline Right Padding',

  // Other
  enableRealTimePreview: 'Real-time Preview',
  createNewProfile: 'Create New Profile',
  deleteProfile: 'Delete Profile',
  exportSettings: 'Export Settings',
  importSettings: 'Import Settings',
};

/**
 * 翻訳データ
 */
const translations: Record<Language, TranslationKeys> = {
  ja,
  en,
};

/**
 * 現在の言語
 */
let currentLanguage: Language = 'ja';

/**
 * 言語を設定
 */
export function setLanguage(language: Language): void {
  currentLanguage = language;
}

/**
 * 現在の言語を取得
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * ブラウザの言語を検出
 */
export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }
  return 'en';
}

/**
 * 翻訳を取得
 */
export function t(key: keyof TranslationKeys): string {
  return translations[currentLanguage][key];
}

/**
 * すべての翻訳を取得
 */
export function getTranslations(language?: Language): TranslationKeys {
  return translations[language || currentLanguage];
}

