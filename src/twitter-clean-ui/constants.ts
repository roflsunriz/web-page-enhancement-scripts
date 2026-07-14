/**
 * Twitter Clean UI - 定数定義
 */

import type { UIElementDefinition, UIElementCategory, Settings } from "./types";
import {
  CONTENT_ELEMENT_IDS,
  CONTENT_SELECTORS,
  DEFAULT_CONTENT_VISIBILITY,
  DEFAULT_LEFT_SIDEBAR_VISIBILITY,
  LEFT_SIDEBAR_ELEMENT_IDS,
  LEFT_SIDEBAR_SELECTORS,
  type ContentElementId,
  type LeftSidebarElementId,
} from "./ui-visibility-selectors";
import {
  DEFAULT_RIGHT_SIDEBAR_VISIBILITY,
  RIGHT_SIDEBAR_ELEMENT_IDS,
  RIGHT_SIDEBAR_SELECTORS,
  type RightSidebarElementId,
} from "./right-sidebar-visibility";

export { CSS_CACHE_KEY, STORAGE_KEY } from "./storage-keys";

export const STORAGE_VERSION = "1.0.0";

export const DEFAULT_SETTINGS: Settings = {
  visibility: {
    ...DEFAULT_LEFT_SIDEBAR_VISIBILITY,
    ...DEFAULT_RIGHT_SIDEBAR_VISIBILITY,
    ...DEFAULT_CONTENT_VISIBILITY,
  },
  layout: {
    mainContentWidth: 600,
    timelineRightPadding: 16,
  },
  enableRealTimePreview: true,
  language: "ja",
};

const LEFT_SIDEBAR_DESCRIPTIONS: Record<LeftSidebarElementId, string> = {
  leftSidebar: "左サイドバー全体",
  leftSidebar_Logo: "Xロゴ",
  leftSidebar_HomeLink: "ホームリンク",
  leftSidebar_ExploreLink: "話題を検索リンク",
  leftSidebar_NotificationsLink: "通知リンク",
  leftSidebar_MessagesLink: "メッセージリンク",
  leftSidebar_GrokLink: "Grokリンク",
  leftSidebar_ConnectLink: "フォローリンク",
  leftSidebar_BookmarksLink: "ブックマークリンク",
  leftSidebar_ListsLink: "リストリンク",
  leftSidebar_CommunitiesLink: "コミュニティリンク",
  leftSidebar_ProfileLink: "プロフィールリンク",
  leftSidebar_PremiumLink: "Premiumリンク",
  leftSidebar_BusinessLink: "ビジネスリンク",
  leftSidebar_CreatorStudioLink: "クリエイタースタジオリンク",
  leftSidebar_AdsLink: "広告リンク",
  leftSidebar_CreateSpaceLink: "スペース作成リンク",
  leftSidebar_SettingsLink: "設定とプライバシーリンク",
  leftSidebar_MoreMenu: "もっと見るメニュー",
  leftSidebar_TweetButton: "ポスト作成ボタン",
  leftSidebar_ProfileMenu: "プロフィールメニュー",
};

const RIGHT_SIDEBAR_DESCRIPTIONS: Record<RightSidebarElementId, string> = {
  rightSidebar: "右サイドバー全体",
  rightSidebar_SearchBox: "検索ボックス",
  rightSidebar_PremiumSubscribe: "Premiumサブスクライブセクション",
  rightSidebar_TrendsList: "トレンド一覧",
  rightSidebar_WhoToFollow: "おすすめユーザーセクション",
  rightSidebar_TodayNews: "本日のニュースセクション",
  rightSidebar_RelatedAccounts: "関連性の高いアカウント",
  rightSidebar_Footer: "フッターリンク",
};

const CONTENT_DESCRIPTIONS: Record<ContentElementId, string> = {
  content_TimelineTabs: "タイムラインタブ",
  content_PostComposer: "ホームの投稿入力欄",
  content_GrokDrawer: "Grokドロワー",
  content_ChatDrawer: "チャットドロワー",
  content_PostReplyAction: "ポストの返信操作",
  content_PostRepostAction: "ポストのリポスト操作",
  content_PostLikeAction: "ポストのいいね操作",
  content_PostAnalyticsAction: "ポストの表示数・アナリティクス",
  content_PostBookmarkAction: "ポストのブックマーク操作",
};

function createDefinition(
  id: UIElementDefinition["id"],
  category: UIElementCategory,
  description: string,
  selector: string,
): UIElementDefinition {
  return {
    id,
    category,
    description,
    strategies: [
      {
        type: "querySelector",
        selector,
        method: "verified CSS selector",
        confidence: 0.95,
      },
    ],
  };
}

export const UI_ELEMENTS: UIElementDefinition[] = [
  ...LEFT_SIDEBAR_ELEMENT_IDS.map((id) =>
    createDefinition(
      id,
      "leftSidebar",
      LEFT_SIDEBAR_DESCRIPTIONS[id],
      LEFT_SIDEBAR_SELECTORS[id],
    ),
  ),
  ...RIGHT_SIDEBAR_ELEMENT_IDS.map((id) =>
    createDefinition(
      id,
      "rightSidebar",
      RIGHT_SIDEBAR_DESCRIPTIONS[id],
      RIGHT_SIDEBAR_SELECTORS[id],
    ),
  ),
  ...CONTENT_ELEMENT_IDS.map((id) =>
    createDefinition(
      id,
      "content",
      CONTENT_DESCRIPTIONS[id],
      CONTENT_SELECTORS[id],
    ),
  ),
];
