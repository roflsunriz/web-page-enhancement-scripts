/**
 * Twitter Clean UI - 多言語対応
 */

import { createI18n } from "@/shared/i18n";
import type { Language, TranslationKeys } from "./types";

/**
 * 日本語翻訳
 */
const ja: TranslationKeys = {
  // 一般
  appName: "twitter-clean-ui",
  settings: "設定",
  save: "保存",
  cancel: "キャンセル",
  reset: "リセット",
  apply: "適用",
  close: "閉じる",

  // セクション
  leftSidebarSettings: "左サイドバー設定",
  rightSidebarSettings: "右サイドバー設定",
  layoutSettings: "レイアウト設定",
  profileSettings: "プロファイル設定",

  // 左サイドバー
  leftSidebar: "左サイドバー全体",
  leftSidebar_Logo: "Xロゴ",
  leftSidebar_HomeLink: "ホーム",
  leftSidebar_ExploreLink: "話題を検索",
  leftSidebar_NotificationsLink: "通知",
  leftSidebar_MessagesLink: "メッセージ",
  leftSidebar_GrokLink: "Grok",
  leftSidebar_ConnectLink: "フォロー",
  leftSidebar_BookmarksLink: "ブックマーク",
  leftSidebar_ListsLink: "リスト",
  leftSidebar_CommunitiesLink: "コミュニティ",
  leftSidebar_ProfileLink: "プロフィール",
  leftSidebar_PremiumLink: "Premium",
  leftSidebar_BusinessLink: "ビジネス",
  leftSidebar_CreatorStudioLink: "クリエイタースタジオ",
  leftSidebar_MoreMenu: "もっと見る",
  leftSidebar_TweetButton: "ポストボタン",
  leftSidebar_ProfileMenu: "プロフィールメニュー",

  // 右サイドバー
  rightSidebar: "右サイドバー全体",
  rightSidebar_SearchBox: "検索ボックス",
  rightSidebar_PremiumSubscribe: "Premiumサブスクライブ",
  rightSidebar_TrendsList: "トレンド",
  rightSidebar_WhoToFollow: "おすすめユーザー",
  rightSidebar_TodayNews: "本日のニュース",
  rightSidebar_RelatedAccounts: "関連性の高いアカウント",
  rightSidebar_Footer: "フッター",

  // レイアウト
  mainContentWidth: "メインコンテンツの幅",
  timelineRightPadding: "タイムラインと右サイドバー間の余白",

  // その他
  enableRealTimePreview: "リアルタイムプレビュー",
  createNewProfile: "新しいプロファイルを作成",
  deleteProfile: "プロファイルを削除",
  exportSettings: "設定をエクスポート",
  importSettings: "設定をインポート",
  openSettings: "設定を開く",
  switchProfile: "切り替え",
  deleteProfileConfirm: "プロファイル「{name}」を削除しますか？",
  enterProfileName: "プロファイル名を入力してください:",
  importSucceeded: "設定をインポートしました",
  importFailed: "設定のインポートに失敗しました",
  resetSettingsConfirm: "設定をリセットしますか？",
};

/**
 * 英語翻訳
 */
const en: TranslationKeys = {
  // General
  appName: "twitter-clean-ui",
  settings: "Settings",
  save: "Save",
  cancel: "Cancel",
  reset: "Reset",
  apply: "Apply",
  close: "Close",

  // Sections
  leftSidebarSettings: "Left Sidebar Settings",
  rightSidebarSettings: "Right Sidebar Settings",
  layoutSettings: "Layout Settings",
  profileSettings: "Profile Settings",

  // Left Sidebar
  leftSidebar: "Left Sidebar (Entire)",
  leftSidebar_Logo: "X Logo",
  leftSidebar_HomeLink: "Home",
  leftSidebar_ExploreLink: "Explore",
  leftSidebar_NotificationsLink: "Notifications",
  leftSidebar_MessagesLink: "Messages",
  leftSidebar_GrokLink: "Grok",
  leftSidebar_ConnectLink: "Follow",
  leftSidebar_BookmarksLink: "Bookmarks",
  leftSidebar_ListsLink: "Lists",
  leftSidebar_CommunitiesLink: "Communities",
  leftSidebar_ProfileLink: "Profile",
  leftSidebar_PremiumLink: "Premium",
  leftSidebar_BusinessLink: "Business",
  leftSidebar_CreatorStudioLink: "Creator Studio",
  leftSidebar_MoreMenu: "More",
  leftSidebar_TweetButton: "Post Button",
  leftSidebar_ProfileMenu: "Profile Menu",

  // Right Sidebar
  rightSidebar: "Right Sidebar (Entire)",
  rightSidebar_SearchBox: "Search Box",
  rightSidebar_PremiumSubscribe: "Premium Subscribe",
  rightSidebar_TrendsList: "Trends",
  rightSidebar_WhoToFollow: "Who to Follow",
  rightSidebar_TodayNews: "Today's News",
  rightSidebar_RelatedAccounts: "Relevant Accounts",
  rightSidebar_Footer: "Footer",

  // Layout
  mainContentWidth: "Main Content Width",
  timelineRightPadding: "Timeline Right Padding",

  // Other
  enableRealTimePreview: "Real-time Preview",
  createNewProfile: "Create New Profile",
  deleteProfile: "Delete Profile",
  exportSettings: "Export Settings",
  importSettings: "Import Settings",
  openSettings: "Open Settings",
  switchProfile: "Switch",
  deleteProfileConfirm: 'Delete profile "{name}"?',
  enterProfileName: "Enter profile name:",
  importSucceeded: "Settings imported.",
  importFailed: "Failed to import settings.",
  resetSettingsConfirm: "Reset settings?",
};

const translations = {
  ja,
  en,
} satisfies Record<Language, TranslationKeys>;

const i18n = createI18n<keyof TranslationKeys, Language>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

/**
 * 言語を設定
 */
export function setLanguage(language: Language): void {
  i18n.setLocale(language);
}

/**
 * 現在の言語を取得
 */
export function getLanguage(): Language {
  return i18n.getLocale();
}

/**
 * ブラウザの言語を検出
 */
export function detectBrowserLanguage(): Language {
  return i18n.detectBrowserLocale();
}

/**
 * 翻訳を取得
 */
export function t(key: keyof TranslationKeys): string {
  return i18n.t(key);
}

/**
 * すべての翻訳を取得
 */
export function getTranslations(language?: Language): TranslationKeys {
  return i18n.getTranslations(language) as TranslationKeys;
}

export function getTextDirection(language?: Language): "ltr" | "rtl" {
  return i18n.getDirection(language);
}

export function getMissingTranslationKeys(
  language: Language,
): (keyof TranslationKeys)[] {
  return i18n.getMissingTranslationKeys(language);
}
