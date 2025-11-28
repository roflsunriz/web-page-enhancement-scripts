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
    leftSidebar_GrokLink: true,
    leftSidebar_BookmarksLink: true,
    leftSidebar_ListsLink: true,
    leftSidebar_CommunitiesLink: true,
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
    rightSidebar_RelatedAccounts: true,
    rightSidebar_Footer: true,

    // メインコンテンツ
    mainContent_TweetComposer: true,
    promotedTweets: false, // 広告は非表示
  },
  layout: {
    leftSidebarWidth: 275, // デフォルトのX/Twitterの幅
    mainContentWidth: 600, // 読みやすい幅
    mainContentPadding: 0,
    timelineRightPadding: 0,
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
    id: 'leftSidebar_GrokLink',
    category: 'leftSidebar',
    description: 'Grokリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[href="/i/grok"]',
        method: 'href selector',
        confidence: 0.95,
      },
      {
        type: 'querySelector',
        selector: 'a[aria-label="Grok"]',
        method: 'aria-label',
        confidence: 0.9,
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
    id: 'leftSidebar_CommunitiesLink',
    category: 'leftSidebar',
    description: 'コミュニティリンク',
    strategies: [
      {
        type: 'querySelector',
        selector: 'a[href*="/communities"]',
        method: 'href contains',
        confidence: 0.9,
      },
      {
        type: 'querySelector',
        selector: 'a[aria-label="コミュニティ"], a[aria-label="Communities"]',
        method: 'aria-label',
        confidence: 0.95,
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

          const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
          if (!sidebar) return null;

          // 検索ボックス全体のコンテナを取得（より柔軟な探索）
          let container: HTMLElement | null = searchInput as HTMLElement;
          for (let i = 0; i < 8; i++) {
            if (!container.parentElement) break;
            container = container.parentElement;
            
            // sidebarColumnを超えたら終了
            if (container === sidebar) break;
            if (!sidebar.contains(container)) break;

            const style = window.getComputedStyle(container);
            const hasBackground = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                 style.backgroundColor !== 'transparent';
            const hasBorder = style.border !== '' && style.border !== '0px none rgb(0, 0, 0)';
            const hasRoundedCorners = style.borderRadius !== '0px';
            
            // 背景色やボーダーを持つコンテナを検出
            // かつ、sidebarColumnの直接の子要素の子要素程度まで
            if ((hasBackground || hasBorder) && hasRoundedCorners) {
              // さらに1階層上のコンテナがあればそれを返す（余白を含むため）
              if (container.parentElement && 
                  sidebar.contains(container.parentElement) && 
                  container.parentElement !== sidebar) {
                return container.parentElement;
              }
              return container;
            }
          }
          
          // 見つからない場合は5階層上を返す（フォールバック）
          let fallback: HTMLElement | null = searchInput as HTMLElement;
          for (let i = 0; i < 5; i++) {
            if (!fallback.parentElement) break;
            if (fallback.parentElement === sidebar) break;
            fallback = fallback.parentElement;
          }
          return fallback;
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
        method: 'Premium subscribe section - find bordered container first',
        confidence: 0.9,
        finder: () => {
          const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
          if (!sidebar) return null;

          // 方式変更: ボーダー付きセクションを先に見つけて、その中にプレミアムテキストがあるかチェック
          // これにより、検索バーなど他の要素を巻き込まない
          const allDivs = Array.from(sidebar.querySelectorAll('div'));
          
          for (const elem of allDivs) {
            const style = window.getComputedStyle(elem);
            
            // 1px以上のボーダーとborderRadiusを持つ要素を探す
            const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
            const hasBorder = borderMatch && parseFloat(borderMatch[1]) > 0;
            const hasRadius = style.borderRadius !== '0px' && style.borderRadius !== '9999px'; // 検索バーの丸い枠を除外
            
            if (hasBorder && hasRadius) {
              const text = elem.textContent || '';
              // プレミアムテキストを含み、かつテキスト長が適切な範囲（検索バーを含まない）
              if (
                text.length < 500 &&
                (text.includes('プレミアムにサブスクライブ') || text.includes('Subscribe to Premium'))
              ) {
                return elem as HTMLElement;
              }
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
        method: 'Trends list with border container',
        confidence: 0.9,
        finder: () => {
          const trends = document.querySelectorAll('[data-testid="trend"]');
          if (trends.length === 0) return null;

          const firstTrend = trends[0];
          let container: HTMLElement | null = firstTrend.parentElement as HTMLElement;

          // 複数のtrendを含むコンテナを探す
          for (let i = 0; i < 8; i++) {
            if (!container) break;
            const foundTrends = container.querySelectorAll('[data-testid="trend"]');
            if (foundTrends.length > 1) {
              // さらに親要素でボーダー付きコンテナを探す
              let parent = container.parentElement;
              for (let j = 0; j < 5; j++) {
                if (!parent) break;
                const style = window.getComputedStyle(parent);
                // 1px以上のボーダーとborderRadiusを持つ要素を探す
                const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                if (borderMatch && parseFloat(borderMatch[1]) > 0 && style.borderRadius !== '0px') {
                  return parent;
                }
                parent = parent.parentElement;
              }
              // ボーダー付きコンテナが見つからない場合は2階層上
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
        type: 'custom',
        method: 'Who to follow with border container',
        confidence: 0.9,
        finder: () => {
          const aside = document.querySelector(
            'aside[aria-label*="おすすめユーザー"], aside[aria-label*="Who to follow"]'
          ) as HTMLElement;
          if (!aside) return null;

          // asideを含むボーダー付きコンテナを探す（最大5階層）
          let current: HTMLElement | null = aside;
          for (let i = 0; i < 5; i++) {
            if (!current.parentElement) break;
            const style = window.getComputedStyle(current.parentElement);
            // 1px以上のボーダーとborderRadiusを持つ要素を探す
            const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
            if (borderMatch && parseFloat(borderMatch[1]) > 0 && style.borderRadius !== '0px') {
              return current.parentElement;
            }
            current = current.parentElement;
          }
          // ボーダー付きコンテナが見つからない場合は2階層上
          return aside.parentElement?.parentElement as HTMLElement;
        },
      },
    ],
  },
  {
    id: 'rightSidebar_RelatedAccounts',
    category: 'rightSidebar',
    description: '関連性の高いアカウント（ツイート詳細ページ）',
    strategies: [
      {
        type: 'custom',
        method: 'Related accounts section - find by heading text',
        confidence: 0.9,
        finder: () => {
          const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
          if (!sidebar) return null;

          // ツイート詳細ページでのみ表示される「関連性の高いアカウント」を検索
          const searchTexts = [
            '関連性の高いアカウント',
            'Relevant accounts',
            'Relevant people',
          ];

          const allDivs = Array.from(sidebar.querySelectorAll('div, section, aside'));
          
          for (const elem of allDivs) {
            const textContent = elem.textContent || '';
            
            // テキストが長すぎる場合はスキップ（親要素の可能性が高い）
            if (textContent.length > 3000) continue;
            
            // 検索テキストとのマッチング
            let matchedText: string | null = null;
            for (const searchText of searchTexts) {
              if (textContent.includes(searchText)) {
                matchedText = searchText;
                break;
              }
            }

            if (matchedText) {
              // ボーダー付きの親コンテナを探す（最大5階層まで遡る）
              let current: HTMLElement | null = elem as HTMLElement;
              
              for (let i = 0; i < 5; i++) {
                if (!current.parentElement) break;
                
                // sidebarColumnを超えて遡らない
                if (current.parentElement === sidebar || !sidebar.contains(current.parentElement)) {
                  break;
                }
                
                const style = window.getComputedStyle(current.parentElement);
                // 1px以上のボーダーとborderRadiusを持つ要素を探す
                const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                const hasBorder = borderMatch && parseFloat(borderMatch[1]) > 0;
                const hasRadius = style.borderRadius !== '0px';
                
                if (hasBorder && hasRadius) {
                  return current.parentElement;
                }
                
                current = current.parentElement;
              }
              
              // ボーダー付きコンテナが見つからない場合は1階層上
              if (elem.parentElement && sidebar.contains(elem.parentElement)) {
                return elem.parentElement as HTMLElement;
              }
              return elem as HTMLElement;
            }
          }
          
          return null;
        },
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

