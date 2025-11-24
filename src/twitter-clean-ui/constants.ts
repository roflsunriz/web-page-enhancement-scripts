/**
 * Twitter Clean UI - 定数定義
 */

import type { UIElementDefinition, Settings } from './types';

/**
 * ストレージキー
 */
export const STORAGE_KEY = 'twitter_clean_ui_settings';
export const STORAGE_VERSION = '1.0.0';

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: Settings = {
  visibility: {
    // 左サイドバー - デフォルトはすべて表示
    leftSidebar: true,
    leftSidebar_Logo: true,
    leftSidebar_HomeLink: true,
    leftSidebar_ExploreLink: true,
    leftSidebar_NotificationsLink: true,
    leftSidebar_MessagesLink: true,
    leftSidebar_BookmarksLink: true,
    leftSidebar_ListsLink: true,
    leftSidebar_ProfileLink: true,
    leftSidebar_PremiumLink: true,
    leftSidebar_MoreMenu: true,
    leftSidebar_TweetButton: true,
    leftSidebar_ProfileMenu: true,

    // 右サイドバー - 広告系はデフォルトで非表示
    rightSidebar: true,
    rightSidebar_SearchBox: true,
    rightSidebar_PremiumSubscribe: false, // Premiumは非表示
    rightSidebar_TrendsList: true,
    rightSidebar_WhoToFollow: true,
    rightSidebar_Footer: true,

    // メインコンテンツ
    mainContent_TweetComposer: true,
    promotedTweets: false, // 広告は非表示
  },
  layout: {
    leftSidebarWidth: 275, // デフォルトのX/Twitterの幅
    mainContentWidth: 600, // 読みやすい幅
    rightSidebarWidth: 350,
    mainContentPadding: 0,
    gap: 30,
  },
  enableRealTimePreview: true,
  language: 'ja',
};

/**
 * UI要素の定義
 */
export const UI_ELEMENTS: UIElementDefinition[] = [
  // ========================================
  // 左サイドバー
  // ========================================
  {
    id: 'leftSidebar',
    category: 'leftSidebar',
    description: '左サイドバー全体',
    strategies: [
      {
        type: 'querySelector',
        selector: 'header[role="banner"]',
        method: 'header banner role',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_Logo',
    category: 'leftSidebar',
    description: 'Xロゴ',
    strategies: [
      {
        type: 'querySelector',
        selector: 'h1[role="heading"] a[aria-label*="X"]',
        method: 'X logo link',
        confidence: 0.9,
      },
    ],
  },
  {
    id: 'leftSidebar_HomeLink',
    category: 'leftSidebar',
    description: 'ホームリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="AppTabBar_Home_Link"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_ExploreLink',
    category: 'leftSidebar',
    description: '話題を検索リンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="AppTabBar_Explore_Link"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_NotificationsLink',
    category: 'leftSidebar',
    description: '通知リンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="AppTabBar_Notifications_Link"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_MessagesLink',
    category: 'leftSidebar',
    description: 'メッセージリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="AppTabBar_DirectMessage_Link"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_BookmarksLink',
    category: 'leftSidebar',
    description: 'ブックマークリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[href="/i/bookmarks"]',
        method: 'href selector',
        confidence: 0.9,
      },
    ],
  },
  {
    id: 'leftSidebar_ListsLink',
    category: 'leftSidebar',
    description: 'リストリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[href*="/lists"]',
        method: 'href contains',
        confidence: 0.85,
      },
    ],
  },
  {
    id: 'leftSidebar_ProfileLink',
    category: 'leftSidebar',
    description: 'プロフィールリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="AppTabBar_Profile_Link"]',
        method: 'data-testid',
        confidence: 0.9,
      },
    ],
  },
  {
    id: 'leftSidebar_PremiumLink',
    category: 'leftSidebar',
    description: 'Premiumリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[href="/i/premium_sign_up"]',
        method: 'href selector',
        confidence: 0.9,
      },
      {
        type: 'querySelector',
        selector: 'a[data-testid="premium-signup-tab"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_MoreMenu',
    category: 'leftSidebar',
    description: 'もっと見るメニュー',
    strategies: [
      {
        type: 'querySelector',
        selector: 'button[data-testid="AppTabBar_More_Menu"]',
        method: 'data-testid',
        confidence: 0.9,
      },
    ],
  },
  {
    id: 'leftSidebar_TweetButton',
    category: 'leftSidebar',
    description: 'ツイート作成ボタン',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[data-testid="SideNav_NewTweet_Button"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'leftSidebar_ProfileMenu',
    category: 'leftSidebar',
    description: 'プロフィールメニュー',
    strategies: [
      {
        type: 'querySelector',
        selector: 'button[data-testid="SideNav_AccountSwitcher_Button"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },

  // ========================================
  // 右サイドバー
  // ========================================
  {
    id: 'rightSidebar',
    category: 'rightSidebar',
    description: '右サイドバー全体',
    strategies: [
      {
        type: 'querySelector',
        selector: '[data-testid="sidebarColumn"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'rightSidebar_SearchBox',
    category: 'rightSidebar',
    description: '検索ボックス',
    strategies: [
      {
        type: 'custom',
        method: 'Search box container',
        confidence: 0.85,
        finder: () => {
          const searchInput = document.querySelector(
            '[data-testid="SearchBox_Search_Input"]'
          );
          if (!searchInput) return null;

          // 検索ボックス全体のコンテナを取得
          let container: HTMLElement | null = searchInput as HTMLElement;
          for (let i = 0; i < 10; i++) {
            if (!container.parentElement) break;
            container = container.parentElement;
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (sidebar?.contains(container) && container.parentElement === sidebar.firstElementChild) {
              return container;
            }
          }
          return null;
        },
      },
    ],
  },
  {
    id: 'rightSidebar_PremiumSubscribe',
    category: 'rightSidebar',
    description: 'Premiumサブスクライブセクション',
    strategies: [
      {
        type: 'custom',
        method: 'Premium subscribe section',
        confidence: 0.8,
        finder: () => {
          const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
          if (!sidebar) return null;

          const sections = Array.from(sidebar.querySelectorAll('aside, section, div[role="complementary"]'));
          for (const section of sections) {
            const text = section.textContent || '';
            if (
              text.includes('プレミアムにサブスクライブ') ||
              text.includes('Subscribe to Premium') ||
              (text.includes('認証マーク') && text.includes('プレミアム'))
            ) {
              return section.parentElement?.parentElement as HTMLElement;
            }
          }
          return null;
        },
      },
    ],
  },
  {
    id: 'rightSidebar_TrendsList',
    category: 'rightSidebar',
    description: 'トレンド一覧',
    strategies: [
      {
        type: 'custom',
        method: 'Trends list container',
        confidence: 0.85,
        finder: () => {
          const trends = document.querySelectorAll('[data-testid="trend"]');
          if (trends.length === 0) return null;

          const firstTrend = trends[0];
          let container: HTMLElement | null = firstTrend.parentElement as HTMLElement;

          for (let i = 0; i < 5; i++) {
            if (!container) break;
            const foundTrends = container.querySelectorAll('[data-testid="trend"]');
            if (foundTrends.length > 1) {
              return container.parentElement?.parentElement as HTMLElement;
            }
            container = container.parentElement as HTMLElement;
          }
          return null;
        },
      },
    ],
  },
  {
    id: 'rightSidebar_WhoToFollow',
    category: 'rightSidebar',
    description: 'おすすめユーザーセクション',
    strategies: [
      {
        type: 'querySelector',
        selector: 'aside[aria-label*="おすすめユーザー"]',
        method: 'aria-label Japanese',
        confidence: 0.9,
      },
      {
        type: 'querySelector',
        selector: 'aside[aria-label*="Who to follow"]',
        method: 'aria-label English',
        confidence: 0.9,
      },
    ],
  },
  {
    id: 'rightSidebar_Footer',
    category: 'rightSidebar',
    description: 'フッターリンク',
    strategies: [
      {
        type: 'custom',
        method: 'Footer navigation',
        confidence: 0.8,
        finder: () => {
          const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
          if (!sidebar) return null;

          const navs = Array.from(sidebar.querySelectorAll('nav'));
          for (const nav of navs) {
            const ariaLabel = nav.getAttribute('aria-label');
            if (ariaLabel?.includes('フッター') || ariaLabel?.includes('Footer')) {
              return nav.parentElement as HTMLElement;
            }
          }
          return null;
        },
      },
    ],
  },

  // ========================================
  // メインコンテンツ
  // ========================================
  {
    id: 'mainContent',
    category: 'mainContent',
    description: 'メインコンテンツエリア',
    strategies: [
      {
        type: 'querySelector',
        selector: '[data-testid="primaryColumn"]',
        method: 'data-testid',
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'mainContent_TweetComposer',
    category: 'mainContent',
    description: 'ツイート作成ボックス',
    strategies: [
      {
        type: 'custom',
        method: 'Tweet composer container',
        confidence: 0.85,
        finder: () => {
          const textarea = document.querySelector('[data-testid="tweetTextarea_0"]');
          if (!textarea) return null;

          let container: HTMLElement | null = textarea as HTMLElement;
          for (let i = 0; i < 15; i++) {
            if (!container.parentElement) break;
            container = container.parentElement;
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (primaryColumn?.contains(container) && container.parentElement === primaryColumn) {
              return container;
            }
          }
          return null;
        },
      },
    ],
  },
  {
    id: 'promotedTweets',
    category: 'mainContent',
    description: '広告ツイート',
    strategies: [
      {
        type: 'querySelectorAll',
        selector: '[data-testid="placementTracking"]',
        method: 'data-testid',
        confidence: 0.9,
      },
    ],
  },
];

