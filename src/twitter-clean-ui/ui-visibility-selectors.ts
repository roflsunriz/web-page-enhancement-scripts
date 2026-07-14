/**
 * Twitter Clean UI - 左メニュー・コンテンツ表示制御セレクタ
 */

import type { UIElementId, VisibilitySettings } from "./types";

export const LEFT_SIDEBAR_ELEMENT_IDS = [
  "leftSidebar",
  "leftSidebar_Logo",
  "leftSidebar_HomeLink",
  "leftSidebar_ExploreLink",
  "leftSidebar_NotificationsLink",
  "leftSidebar_MessagesLink",
  "leftSidebar_GrokLink",
  "leftSidebar_ConnectLink",
  "leftSidebar_BookmarksLink",
  "leftSidebar_ListsLink",
  "leftSidebar_CommunitiesLink",
  "leftSidebar_ProfileLink",
  "leftSidebar_PremiumLink",
  "leftSidebar_BusinessLink",
  "leftSidebar_CreatorStudioLink",
  "leftSidebar_AdsLink",
  "leftSidebar_CreateSpaceLink",
  "leftSidebar_SettingsLink",
  "leftSidebar_MoreMenu",
  "leftSidebar_TweetButton",
  "leftSidebar_ProfileMenu",
] as const satisfies readonly UIElementId[];

export type LeftSidebarElementId = (typeof LEFT_SIDEBAR_ELEMENT_IDS)[number];

export const CONTENT_ELEMENT_IDS = [
  "content_TimelineTabs",
  "content_PostComposer",
  "content_GrokDrawer",
  "content_ChatDrawer",
  "content_PostReplyAction",
  "content_PostRepostAction",
  "content_PostLikeAction",
  "content_PostAnalyticsAction",
  "content_PostBookmarkAction",
] as const satisfies readonly UIElementId[];

export type ContentElementId = (typeof CONTENT_ELEMENT_IDS)[number];

export const DEFAULT_LEFT_SIDEBAR_VISIBILITY: Pick<
  VisibilitySettings,
  LeftSidebarElementId
> = Object.fromEntries(
  LEFT_SIDEBAR_ELEMENT_IDS.map((elementId) => [elementId, true]),
) as Pick<VisibilitySettings, LeftSidebarElementId>;

export const DEFAULT_CONTENT_VISIBILITY: Pick<
  VisibilitySettings,
  ContentElementId
> = Object.fromEntries(
  CONTENT_ELEMENT_IDS.map((elementId) => [elementId, true]),
) as Pick<VisibilitySettings, ContentElementId>;

export const LEFT_SIDEBAR_SELECTORS: Record<LeftSidebarElementId, string> = {
  leftSidebar: 'header[role="banner"]',
  leftSidebar_Logo: 'header[role="banner"] h1[role="heading"] a[href="/home"]',
  leftSidebar_HomeLink:
    'header[role="banner"] a[data-testid="AppTabBar_Home_Link"]',
  leftSidebar_ExploreLink:
    'header[role="banner"] a[data-testid="AppTabBar_Explore_Link"]',
  leftSidebar_NotificationsLink:
    'header[role="banner"] a[data-testid="AppTabBar_Notifications_Link"]',
  leftSidebar_MessagesLink:
    'header[role="banner"] a[data-testid="AppTabBar_DirectMessage_Link"]',
  leftSidebar_GrokLink: 'header[role="banner"] a[href="/i/grok"]',
  leftSidebar_ConnectLink:
    'header[role="banner"] a[data-testid="AppTabBar_Follow_Link"]',
  leftSidebar_BookmarksLink: 'header[role="banner"] a[href="/i/bookmarks"]',
  leftSidebar_ListsLink: '#layers [role="menu"] a[href$="/lists"]',
  leftSidebar_CommunitiesLink: '#layers [role="menu"] a[href$="/communities"]',
  leftSidebar_ProfileLink:
    'header[role="banner"] a[data-testid="AppTabBar_Profile_Link"]',
  leftSidebar_PremiumLink:
    'header[role="banner"] a[data-testid="premium-signup-tab"]',
  leftSidebar_BusinessLink:
    '#layers [role="menu"] a[href="/i/verified-orgs-signup"]',
  leftSidebar_CreatorStudioLink:
    '#layers [role="menu"] a[href="/i/jf/creators/studio"]',
  leftSidebar_AdsLink: '#layers [role="menu"] a[href^="https://ads.x.com/"]',
  leftSidebar_CreateSpaceLink:
    '#layers [role="menu"] a[href="/i/spaces/start"]',
  leftSidebar_SettingsLink:
    '#layers [role="menu"] a[data-testid="settings"][href="/settings"]',
  leftSidebar_MoreMenu:
    'header[role="banner"] button[data-testid="AppTabBar_More_Menu"]',
  leftSidebar_TweetButton:
    'header[role="banner"] a[data-testid="SideNav_NewTweet_Button"]',
  leftSidebar_ProfileMenu:
    'header[role="banner"] button[data-testid="SideNav_AccountSwitcher_Button"]',
};

export const CONTENT_SELECTORS: Record<ContentElementId, string> = {
  content_TimelineTabs:
    '[data-testid="primaryColumn"] > div > div:has([data-testid="ScrollSnap-List"][role="tablist"]):not(:has([data-testid="tweetTextarea_0"][role="textbox"]))',
  content_PostComposer:
    '[data-testid="primaryColumn"] > div > div:has([data-testid="tweetTextarea_0"][role="textbox"])',
  content_GrokDrawer: '[data-testid="GrokDrawer"]',
  content_ChatDrawer: '[data-testid="chat-drawer-root"]',
  content_PostReplyAction:
    'article[data-testid="tweet"] [role="group"] > div:has(button[data-testid="reply"])',
  content_PostRepostAction:
    'article[data-testid="tweet"] [role="group"] > div:has(button:is([data-testid="retweet"], [data-testid="unretweet"]))',
  content_PostLikeAction:
    'article[data-testid="tweet"] [role="group"] > div:has(button:is([data-testid="like"], [data-testid="unlike"]))',
  content_PostAnalyticsAction:
    'article[data-testid="tweet"] [role="group"] > div:has(a[href$="/analytics"]), article[data-testid="tweet"] a[href$="/analytics"]',
  content_PostBookmarkAction:
    'article[data-testid="tweet"] [role="group"] > div:has(button:is([data-testid="bookmark"], [data-testid="removeBookmark"]))',
};
