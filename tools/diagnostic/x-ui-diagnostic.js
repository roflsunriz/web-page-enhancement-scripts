/**
 * X/Twitter UI診断スニペット
 * 
 * このスクリプトをX/Twitterの開発者コンソールで実行すると、
 * 各UI要素を検出してJSON形式でダウンロードできます。
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) にアクセス
 * 2. 開発者コンソール (F12) を開く
 * 3. このスクリプト全体をコピー&ペースト
 * 4. Enterで実行
 * 5. 自動的にJSONファイルがダウンロードされます
 */

(function() {
  'use strict';

  console.log('[X UI Diagnostic] 診断を開始します...');

  // 診断結果を格納するオブジェクト
  const diagnosticResult = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    elements: []
  };

  /**
   * 親要素の情報を収集（最大5階層）
   */
  function getParentChain(element, maxDepth = 5) {
    const chain = [];
    let current = element.parentElement;
    let depth = 0;

    while (current && depth < maxDepth) {
      const computedStyle = window.getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      
      const parentInfo = {
        depth: depth + 1,
        tagName: current.tagName.toLowerCase(),
        id: current.id || null,
        classes: Array.from(current.classList),
        dataTestId: current.getAttribute('data-testid'),
        role: current.getAttribute('role'),
        dimensions: {
          width: rect.width,
          height: rect.height
        },
        styles: {
          display: computedStyle.display,
          position: computedStyle.position,
          border: computedStyle.border,
          borderRadius: computedStyle.borderRadius,
          outline: computedStyle.outline,
          boxShadow: computedStyle.boxShadow,
          backgroundColor: computedStyle.backgroundColor,
          margin: {
            top: computedStyle.marginTop,
            right: computedStyle.marginRight,
            bottom: computedStyle.marginBottom,
            left: computedStyle.marginLeft
          },
          padding: {
            top: computedStyle.paddingTop,
            right: computedStyle.paddingRight,
            bottom: computedStyle.paddingBottom,
            left: computedStyle.paddingLeft
          }
        },
        hasVisualBorder: computedStyle.border !== '0px none rgb(0, 0, 0)' && 
                         computedStyle.border !== 'none' &&
                         computedStyle.border !== '0px',
        hasOutline: computedStyle.outline !== 'none' &&
                   computedStyle.outline !== 'rgb(0, 0, 0) none 0px',
        hasBoxShadow: computedStyle.boxShadow !== 'none',
        hasBackground: computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                      computedStyle.backgroundColor !== 'transparent'
      };

      chain.push(parentInfo);
      current = current.parentElement;
      depth++;
    }

    return chain;
  }

  /**
   * 要素情報を抽出する（アップグレード版）
   */
  function extractElementInfo(element, elementName) {
    if (!element) {
      return {
        name: elementName,
        found: false,
        reason: '要素が見つかりませんでした'
      };
    }

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // data属性を収集
    const dataAttributes = {};
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        dataAttributes[attr.name] = attr.value;
      }
    });

    // aria属性を収集
    const ariaAttributes = {};
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        ariaAttributes[attr.name] = attr.value;
      }
    });

    return {
      name: elementName,
      found: true,
      tagName: element.tagName.toLowerCase(),
      id: element.id || null,
      classes: Array.from(element.classList),
      dataAttributes: dataAttributes,
      ariaAttributes: ariaAttributes,
      role: element.getAttribute('role'),
      dimensions: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom
      },
      visibility: {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        isVisible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none'
      },
      styles: {
        border: computedStyle.border,
        borderTop: computedStyle.borderTop,
        borderRight: computedStyle.borderRight,
        borderBottom: computedStyle.borderBottom,
        borderLeft: computedStyle.borderLeft,
        borderRadius: computedStyle.borderRadius,
        outline: computedStyle.outline,
        boxShadow: computedStyle.boxShadow,
        backgroundColor: computedStyle.backgroundColor,
        margin: {
          top: computedStyle.marginTop,
          right: computedStyle.marginRight,
          bottom: computedStyle.marginBottom,
          left: computedStyle.marginLeft
        },
        padding: {
          top: computedStyle.paddingTop,
          right: computedStyle.paddingRight,
          bottom: computedStyle.paddingBottom,
          left: computedStyle.paddingLeft
        }
      },
      visualFeatures: {
        hasVisualBorder: (function() {
          const border = computedStyle.border;
          const borderWidth = computedStyle.borderWidth;
          // 0px の border は視覚的なボーダーではない
          if (border === 'none' || border.startsWith('0px ') || borderWidth === '0px') return false;
          // 実際に幅のあるボーダーのみを検出
          const match = border.match(/^(\d+(?:\.\d+)?)px/);
          return match && parseFloat(match[1]) > 0;
        })(),
        hasOutline: (function() {
          const outline = computedStyle.outline;
          if (outline === 'none' || outline.endsWith(' 0px')) return false;
          const match = outline.match(/(\d+(?:\.\d+)?)px/);
          return match && parseFloat(match[1]) > 0;
        })(),
        hasBoxShadow: computedStyle.boxShadow !== 'none',
        hasBackground: computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                      computedStyle.backgroundColor !== 'transparent',
        hasBorderRadius: computedStyle.borderRadius !== '0px'
      },
      structure: {
        childrenCount: element.children.length,
        hasText: (element.textContent || '').trim().length > 0,
        nestLevel: getElementDepth(element)
      },
      parentChain: getParentChain(element, 5),
      recommendation: {
        note: 'この要素を非表示にする場合、親要素のアウトライン/ボーダーが残る可能性があります',
        suggestedHideTarget: null // 後で分析に基づいて設定
      }
    };
  }

  /**
   * 要素の深さを取得
   */
  function getElementDepth(element) {
    let depth = 0;
    let current = element;
    while (current.parentElement) {
      depth++;
      current = current.parentElement;
    }
    return depth;
  }

  /**
   * XPathを生成
   */
  function getXPath(element) {
    if (!element) return null;
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const paths = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = current.previousSibling;
      
      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      
      const tagName = current.nodeName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : '';
      paths.unshift(`${tagName}${pathIndex}`);
      
      current = current.parentNode;
    }
    
    return paths.length ? `/${paths.join('/')}` : null;
  }

  /**
   * CSS セレクタを生成
   */
  function getCSSSelector(element) {
    if (!element) return null;
    
    if (element.id) {
      return `#${element.id}`;
    }
    
    const path = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      let selector = current.nodeName.toLowerCase();
      
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/);
        if (classes.length > 0 && classes[0]) {
          selector += `.${classes.slice(0, 3).join('.')}`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
      
      // 最大5階層まで
      if (path.length >= 5) break;
    }
    
    return path.join(' > ');
  }

  /**
   * 複数の検出方法を試行
   */
  function detectElement(detectionStrategies) {
    for (const strategy of detectionStrategies) {
      try {
        let element = null;
        
        if (strategy.type === 'querySelector') {
          element = document.querySelector(strategy.selector);
        } else if (strategy.type === 'querySelectorAll') {
          const elements = document.querySelectorAll(strategy.selector);
          element = elements.length > 0 ? elements[0] : null;
        } else if (strategy.type === 'xpath') {
          const result = document.evaluate(
            strategy.xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          element = result.singleNodeValue;
        } else if (strategy.type === 'custom') {
          element = strategy.finder();
        }
        
        if (element) {
          return {
            element,
            method: strategy.method,
            selector: strategy.selector || strategy.xpath || 'custom',
            confidence: strategy.confidence || 0.5
          };
        }
      } catch (error) {
        console.warn(`[Detection Error] ${strategy.method}:`, error);
      }
    }
    
    return null;
  }

  // ========================================
  // UI要素の検出定義
  // ========================================

  const uiElements = [
    {
      name: 'reactRoot',
      description: 'Reactアプリケーションのルート要素',
      strategies: [
        {
          type: 'querySelector',
          selector: '#react-root',
          method: 'ID selector',
          confidence: 0.95
        },
        {
          type: 'querySelector',
          selector: 'div[id^="react-root"]',
          method: 'ID prefix selector',
          confidence: 0.85
        }
      ]
    },
    // ========================================
    // 左サイドバーの詳細要素
    // ========================================
    {
      name: 'leftSidebar_HomeLink',
      description: '左サイドバー - ホームリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[data-testid="AppTabBar_Home_Link"]',
          method: 'data-testid: Home Link',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'a[href="/home"]',
          method: 'href: /home',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_ExploreLink',
      description: '左サイドバー - 話題を検索リンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[data-testid="AppTabBar_Explore_Link"]',
          method: 'data-testid: Explore Link',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'a[href="/explore"]',
          method: 'href: /explore',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_NotificationsLink',
      description: '左サイドバー - 通知リンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[data-testid="AppTabBar_Notifications_Link"]',
          method: 'data-testid: Notifications Link',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'a[href="/notifications"]',
          method: 'href: /notifications',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_MessagesLink',
      description: '左サイドバー - メッセージリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[data-testid="AppTabBar_DirectMessage_Link"]',
          method: 'data-testid: DirectMessage Link',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'a[href="/messages"]',
          method: 'href: /messages',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_BookmarksLink',
      description: '左サイドバー - ブックマークリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[href="/i/bookmarks"]',
          method: 'href: /i/bookmarks',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_ListsLink',
      description: '左サイドバー - リストリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[href*="/lists"]',
          method: 'href: contains lists',
          confidence: 0.8
        }
      ]
    },
    {
      name: 'leftSidebar_ProfileLink',
      description: '左サイドバー - プロフィールリンク',
      strategies: [
        {
          type: 'custom',
          method: 'Profile link with username',
          confidence: 0.75,
          finder: () => {
            const nav = document.querySelector('nav[role="navigation"][aria-label*="メイン"], nav[role="navigation"][aria-label*="Main"]');
            if (!nav) return null;
            const links = nav.querySelectorAll('a[href^="/"]');
            for (const link of links) {
              const href = link.getAttribute('href');
              if (href && href !== '/home' && href !== '/explore' && href !== '/notifications' && 
                  href !== '/messages' && !href.includes('/i/') && href.split('/').length === 2) {
                return link;
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_MoreMenu',
      description: '左サイドバー - もっと見るメニュー',
      strategies: [
        {
          type: 'custom',
          method: 'More menu button',
          confidence: 0.75,
          finder: () => {
            const buttons = document.querySelectorAll('button, a[role="button"]');
            for (const btn of buttons) {
              const text = btn.textContent.trim();
              if (text === 'もっと見る' || text === 'More') {
                const nav = btn.closest('nav[role="navigation"]');
                if (nav) return btn;
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_PremiumLink',
      description: '左サイドバー - Premiumリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[href="/i/premium_sign_up"]',
          method: 'href: premium_sign_up',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Premium text search in nav',
          confidence: 0.7,
          finder: () => {
            const nav = document.querySelector('nav[role="navigation"]');
            if (!nav) return null;
            const links = nav.querySelectorAll('a');
            for (const link of links) {
              if (link.textContent.includes('Premium') || link.textContent.includes('プレミアム')) {
                return link;
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_CommunitiesLink',
      description: '左サイドバー - コミュニティリンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[href="/i/communities"]',
          method: 'href: /i/communities',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar_VerifiedOrgsLink',
      description: '左サイドバー - 認証済み組織リンク',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[href="/i/verified-orgs-signup"]',
          method: 'href: verified-orgs',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'leftSidebar',
      description: '左サイドバー（ナビゲーションメニュー）全体',
      strategies: [
        {
          type: 'querySelector',
          selector: 'header[role="banner"]',
          method: 'header banner element',
          confidence: 0.95
        },
        {
          type: 'custom',
          method: 'Navigation container with logo',
          confidence: 0.85,
          finder: () => {
            const header = document.querySelector('header[role="banner"]');
            return header;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_Container',
      description: '左サイドバー - コンテナ（パディング調整用）',
      strategies: [
        {
          type: 'custom',
          method: 'Left sidebar inner container',
          confidence: 0.85,
          finder: () => {
            const header = document.querySelector('header[role="banner"]');
            if (!header) return null;
            // headerの最初の子要素を取得
            return header.firstElementChild;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_Logo',
      description: '左サイドバー - Xロゴ',
      strategies: [
        {
          type: 'querySelector',
          selector: 'h1[role="heading"] a[aria-label*="X"]',
          method: 'X logo link in heading',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Logo SVG in header',
          confidence: 0.8,
          finder: () => {
            const header = document.querySelector('header[role="banner"]');
            if (!header) return null;
            const h1 = header.querySelector('h1[role="heading"]');
            if (h1) return h1.parentElement;
            
            // SVGを探す
            const svgs = header.querySelectorAll('svg');
            for (const svg of svgs) {
              if (svg.closest('a[href="/home"]')) {
                return svg.closest('a');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'leftSidebar_Navigation',
      description: '左サイドバー - ナビゲーションメニュー全体',
      strategies: [
        {
          type: 'querySelector',
          selector: 'nav[role="navigation"][aria-label*="メイン"]',
          method: 'Main navigation Japanese',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'nav[role="navigation"][aria-label*="Main"]',
          method: 'Main navigation English',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'header[role="banner"] nav[role="navigation"]',
          method: 'Nav inside header banner',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'rightSidebar',
      description: '右サイドバー（トレンド、おすすめユーザーなど）',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="sidebarColumn"]',
          method: 'data-testid: sidebarColumn',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'aside[role="complementary"]',
          method: 'aside complementary role',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Trends container',
          confidence: 0.75,
          finder: () => {
            const sections = document.querySelectorAll('section');
            for (const section of sections) {
              const heading = section.querySelector('[role="heading"]');
              if (heading && heading.textContent.includes('トレンド')) {
                return section.closest('div[style*="width"]') || section.parentElement;
              }
            }
            return null;
          }
        }
      ]
    },
    // ========================================
    // 右サイドバーの詳細要素
    // ========================================
    {
      name: 'rightSidebar_SearchBox',
      description: '右サイドバー - 検索ボックス全体',
      strategies: [
        {
          type: 'custom',
          method: 'Search box container in sidebar',
          confidence: 0.85,
          finder: () => {
            const searchInput = document.querySelector('[data-testid="SearchBox_Search_Input"]');
            if (!searchInput) return null;
            // 検索ボックス全体のコンテナを取得（複数階層上）
            let container = searchInput;
            for (let i = 0; i < 10; i++) {
              container = container.parentElement;
              if (container && container.matches('[data-testid="sidebarColumn"] > *')) {
                return container;
              }
            }
            return searchInput.closest('div[role="search"]') || searchInput.parentElement?.parentElement;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_PremiumSubscribe',
      description: '右サイドバー - Premiumサブスクライブセクション',
      strategies: [
        {
          type: 'custom',
          method: 'Premium subscribe section',
          confidence: 0.75,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            const sections = sidebar.querySelectorAll('aside, section, div[role="complementary"]');
            for (const section of sections) {
              const text = section.textContent;
              if (text.includes('プレミアムにサブスクライブ') || 
                  text.includes('Subscribe to Premium') ||
                  text.includes('認証マーク') ||
                  text.includes('verified')) {
                // 親要素を見つける
                let parent = section;
                for (let i = 0; i < 3; i++) {
                  if (parent.parentElement) parent = parent.parentElement;
                }
                return parent;
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_WhatsHappening',
      description: '右サイドバー - いまどうしてる？/What\'s happening',
      strategies: [
        {
          type: 'custom',
          method: 'Whats happening section',
          confidence: 0.8,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            const headings = sidebar.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text.includes('いまどうしてる') || 
                  text.includes("What's happening") ||
                  text.includes('トレンド') ||
                  text.includes('Trends')) {
                // sectionまたは親コンテナを返す
                return heading.closest('section') || heading.closest('div[style*="margin"]');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_TrendsList',
      description: '右サイドバー - トレンド一覧',
      strategies: [
        {
          type: 'custom',
          method: 'Trends list container',
          confidence: 0.8,
          finder: () => {
            const trends = document.querySelectorAll('[data-testid="trend"]');
            if (trends.length === 0) return null;
            // 最初のトレンドの共通親コンテナを探す
            const firstTrend = trends[0];
            let container = firstTrend.parentElement;
            for (let i = 0; i < 5; i++) {
              if (container && container.querySelectorAll('[data-testid="trend"]').length > 1) {
                return container;
              }
              if (container) container = container.parentElement;
            }
            return firstTrend.parentElement;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_WhoToFollow',
      description: '右サイドバー - おすすめユーザーセクション全体',
      strategies: [
        {
          type: 'custom',
          method: 'Who to follow section',
          confidence: 0.8,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            const headings = sidebar.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text.includes('おすすめユーザー') || 
                  text.includes('Who to follow') ||
                  text.includes('フォローするアカウント')) {
                // asideまたは親コンテナを返す
                return heading.closest('aside') || heading.closest('section') || heading.closest('div[style*="margin"]');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_WhoToFollowList',
      description: '右サイドバー - おすすめユーザー一覧',
      strategies: [
        {
          type: 'custom',
          method: 'Who to follow user list',
          confidence: 0.75,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            // フォローボタンを複数持つコンテナを探す
            const followButtons = sidebar.querySelectorAll('[data-testid*="follow"]');
            if (followButtons.length === 0) return null;
            
            // フォローボタンの共通親を探す
            let container = followButtons[0];
            for (let i = 0; i < 8; i++) {
              if (container && container.querySelectorAll('[data-testid*="follow"]').length > 1) {
                return container;
              }
              if (container) container = container.parentElement;
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_Footer',
      description: '右サイドバー - フッターリンク',
      strategies: [
        {
          type: 'custom',
          method: 'Footer links in sidebar',
          confidence: 0.7,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            const navs = sidebar.querySelectorAll('nav');
            for (const nav of navs) {
              const links = nav.querySelectorAll('a');
              // 複数の小さいリンクがある場合、それがフッター
              if (links.length > 3) {
                for (const link of links) {
                  const text = link.textContent.trim();
                  if (text.includes('利用規約') || text.includes('Terms') || 
                      text.includes('プライバシー') || text.includes('Privacy')) {
                    return nav;
                  }
                }
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_RelevantPeople',
      description: '右サイドバー - 関連するユーザー',
      strategies: [
        {
          type: 'custom',
          method: 'Relevant people section',
          confidence: 0.7,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            const headings = sidebar.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text.includes('関連するユーザー') || 
                  text.includes('Relevant people')) {
                return heading.closest('aside') || heading.closest('section');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'mainContent',
      description: 'メインコンテンツエリア（タイムライン）',
      strategies: [
        {
          type: 'querySelector',
          selector: 'main[role="main"]',
          method: 'main role',
          confidence: 0.95
        },
        {
          type: 'querySelector',
          selector: '[data-testid="primaryColumn"]',
          method: 'data-testid: primaryColumn',
          confidence: 0.9
        }
      ]
    },
    {
      name: 'mainContent_PrimaryColumn',
      description: 'メインコンテンツ - プライマリカラム（タイムライン本体）',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="primaryColumn"]',
          method: 'data-testid: primaryColumn',
          confidence: 0.95
        }
      ]
    },
    {
      name: 'mainContent_TimelineHeader',
      description: 'メインコンテンツ - タイムラインヘッダー',
      strategies: [
        {
          type: 'custom',
          method: 'Timeline header with title',
          confidence: 0.8,
          finder: () => {
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (!primaryColumn) return null;
            // "ホーム"や"Home"というテキストを含むヘッダーを探す
            const headings = primaryColumn.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text === 'ホーム' || text === 'Home') {
                // ヘッダーバー全体を返す
                let container = heading;
                for (let i = 0; i < 5; i++) {
                  container = container.parentElement;
                  if (container && container.matches('[data-testid="primaryColumn"] > *')) {
                    return container;
                  }
                }
                return heading.parentElement;
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'mainContent_TabBar',
      description: 'メインコンテンツ - タブバー（おすすめ/フォロー中）',
      strategies: [
        {
          type: 'custom',
          method: 'Tab bar in timeline',
          confidence: 0.8,
          finder: () => {
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (!primaryColumn) return null;
            const divs = primaryColumn.querySelectorAll('div[role="tablist"]');
            if (divs.length > 0) return divs[0].parentElement;
            
            // 代替: "おすすめ"と"フォロー中"のテキストを探す
            const spans = primaryColumn.querySelectorAll('span');
            for (const span of spans) {
              const text = span.textContent.trim();
              if (text === 'おすすめ' || text === 'For you' || text === 'Following') {
                let container = span;
                for (let i = 0; i < 8; i++) {
                  container = container.parentElement;
                  if (container && container.querySelector('span')?.textContent.includes('フォロー中')) {
                    return container;
                  }
                }
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'mainContent_Container',
      description: 'メインコンテンツ - コンテナ（パディング調整用）',
      strategies: [
        {
          type: 'custom',
          method: 'Main content outer container',
          confidence: 0.85,
          finder: () => {
            const mainElement = document.querySelector('main[role="main"]');
            if (!mainElement) return null;
            // mainの直接の子要素を取得
            return mainElement.firstElementChild;
          }
        }
      ]
    },
    {
      name: 'header',
      description: 'ヘッダー',
      strategies: [
        {
          type: 'querySelector',
          selector: 'header[role="banner"]',
          method: 'header banner role',
          confidence: 0.95
        }
      ]
    },
    {
      name: 'searchBar',
      description: '検索バー',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="SearchBox_Search_Input"]',
          method: 'data-testid: SearchBox',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'input[placeholder*="検索"]',
          method: 'input placeholder (Japanese)',
          confidence: 0.7
        },
        {
          type: 'querySelector',
          selector: 'input[placeholder*="Search"]',
          method: 'input placeholder (English)',
          confidence: 0.7
        },
        {
          type: 'querySelector',
          selector: '[role="search"] input',
          method: 'search role input',
          confidence: 0.8
        }
      ]
    },
    {
      name: 'tweetButton',
      description: 'ツイート作成ボタン',
      strategies: [
        {
          type: 'querySelector',
          selector: 'a[data-testid="SideNav_NewTweet_Button"]',
          method: 'data-testid: NewTweet',
          confidence: 0.9
        },
        {
          type: 'querySelector',
          selector: 'a[href="/compose/tweet"]',
          method: 'href: compose/tweet',
          confidence: 0.85
        }
      ]
    },
    {
      name: 'promotedTweets',
      description: '広告ツイート',
      strategies: [
        {
          type: 'querySelectorAll',
          selector: '[data-testid="placementTracking"]',
          method: 'data-testid: placementTracking',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Promoted label search',
          confidence: 0.75,
          finder: () => {
            const spans = document.querySelectorAll('span');
            for (const span of spans) {
              const text = span.textContent.trim();
              if (text === 'Promoted' || text === 'プロモーション' || text === '広告') {
                return span.closest('article') || span.closest('[data-testid="tweet"]');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'trendingSection',
      description: 'トレンドセクション',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="trend"]',
          method: 'data-testid: trend',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Trends heading search',
          confidence: 0.75,
          finder: () => {
            const headings = document.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text.includes('トレンド') || text.includes('Trends') || text.includes('What\'s happening')) {
                return heading.closest('section');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'whoToFollow',
      description: 'おすすめユーザーセクション',
      strategies: [
        {
          type: 'custom',
          method: 'Who to follow heading search',
          confidence: 0.75,
          finder: () => {
            const headings = document.querySelectorAll('[role="heading"]');
            for (const heading of headings) {
              const text = heading.textContent.trim();
              if (text.includes('おすすめユーザー') || text.includes('Who to follow') || text.includes('Suggestions')) {
                return heading.closest('section') || heading.closest('aside');
              }
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'timeline',
      description: 'タイムライン（ツイート一覧）',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="primaryColumn"] section[role="region"]',
          method: 'primaryColumn region',
          confidence: 0.85
        },
        {
          type: 'querySelector',
          selector: 'div[aria-label*="タイムライン"]',
          method: 'aria-label timeline (Japanese)',
          confidence: 0.8
        },
        {
          type: 'querySelector',
          selector: 'div[aria-label*="Timeline"]',
          method: 'aria-label timeline (English)',
          confidence: 0.8
        }
      ]
    },
    {
      name: 'navigationBar',
      description: 'ナビゲーションバー',
      strategies: [
        {
          type: 'querySelector',
          selector: 'nav[role="navigation"]',
          method: 'nav navigation role',
          confidence: 0.9
        }
      ]
    },
    {
      name: 'profileMenu',
      description: 'プロフィールメニュー',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="SideNav_AccountSwitcher_Button"]',
          method: 'data-testid: AccountSwitcher',
          confidence: 0.9
        }
      ]
    },
    {
      name: 'bottomNavBar',
      description: '下部ナビゲーションバー（モバイル）',
      strategies: [
        {
          type: 'querySelector',
          selector: 'nav[role="navigation"]:last-of-type',
          method: 'last navigation element',
          confidence: 0.6
        }
      ]
    },
    // ========================================
    // レイアウトとスペーシング
    // ========================================
    {
      name: 'layout_MainContainer',
      description: 'レイアウト - メインコンテナ（3カラムの親）',
      strategies: [
        {
          type: 'custom',
          method: 'Main layout container',
          confidence: 0.9,
          finder: () => {
            const reactRoot = document.querySelector('#react-root');
            if (!reactRoot) return null;
            // react-rootの下の最初のdivを探す
            return reactRoot.querySelector('div > div');
          }
        }
      ]
    },
    {
      name: 'layout_CenterColumn',
      description: 'レイアウト - 中央カラム（header + main）',
      strategies: [
        {
          type: 'custom',
          method: 'Center column with header and main',
          confidence: 0.85,
          finder: () => {
            const header = document.querySelector('header[role="banner"]');
            const main = document.querySelector('main[role="main"]');
            if (!header || !main) return null;
            // headerとmainの共通親を探す
            let parent = header.parentElement;
            while (parent) {
              if (parent.contains(main)) {
                return parent;
              }
              parent = parent.parentElement;
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'spacing_RightSidebarGap',
      description: 'スペーシング - 右サイドバーとメインコンテンツの間',
      strategies: [
        {
          type: 'custom',
          method: 'Gap between main and sidebar',
          confidence: 0.7,
          finder: () => {
            const main = document.querySelector('main[role="main"]');
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!main || !sidebar) return null;
            // mainの親要素を取得（gapを持っている可能性がある）
            return main.parentElement;
          }
        }
      ]
    },
    {
      name: 'spacing_LeftSidebarGap',
      description: 'スペーシング - 左サイドバーとメインコンテンツの間',
      strategies: [
        {
          type: 'custom',
          method: 'Gap between header and main',
          confidence: 0.7,
          finder: () => {
            const header = document.querySelector('header[role="banner"]');
            const main = document.querySelector('main[role="main"]');
            if (!header || !main) return null;
            // headerとmainの親要素を取得
            if (header.parentElement === main.parentElement) {
              return header.parentElement;
            }
            return null;
          }
        }
      ]
    },
    {
      name: 'rightSidebar_StickyContainer',
      description: '右サイドバー - Stickyコンテナ（スクロール固定用）',
      strategies: [
        {
          type: 'custom',
          method: 'Sticky container in sidebar',
          confidence: 0.75,
          finder: () => {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) return null;
            // position: stickyまたはposition: fixedを持つ要素を探す
            const children = sidebar.children;
            for (const child of children) {
              const style = window.getComputedStyle(child);
              if (style.position === 'sticky' || style.position === 'fixed') {
                return child;
              }
            }
            // 最初の子要素を返す（多くの場合これがstickyコンテナ）
            return sidebar.firstElementChild;
          }
        }
      ]
    },
    {
      name: 'mainContent_TweetComposer',
      description: 'メインコンテンツ - ツイート作成ボックス',
      strategies: [
        {
          type: 'querySelector',
          selector: '[data-testid="tweetTextarea_0"]',
          method: 'data-testid: tweetTextarea',
          confidence: 0.85
        },
        {
          type: 'custom',
          method: 'Tweet composer in timeline',
          confidence: 0.75,
          finder: () => {
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (!primaryColumn) return null;
            const textareas = primaryColumn.querySelectorAll('[role="textbox"]');
            for (const textarea of textareas) {
              const placeholder = textarea.getAttribute('data-text') || textarea.getAttribute('placeholder');
              if (placeholder && (placeholder.includes('いまどうしてる') || placeholder.includes("What's happening") || placeholder.includes('happening'))) {
                // コンポーザー全体のコンテナを返す
                let container = textarea;
                for (let i = 0; i < 10; i++) {
                  container = container.parentElement;
                  if (container && container.matches('[data-testid="primaryColumn"] > *')) {
                    return container;
                  }
                }
                return textarea.closest('div[role="group"]')?.parentElement;
              }
            }
            return null;
          }
        }
      ]
    }
  ];

  // ========================================
  // 診断実行
  // ========================================

  console.log('[X UI Diagnostic] UI要素を検出中...');

  uiElements.forEach(uiElement => {
    const detection = detectElement(uiElement.strategies);
    
    if (detection && detection.element) {
      const elementInfo = extractElementInfo(detection.element, uiElement.name);
      elementInfo.description = uiElement.description;
      elementInfo.detection = {
        method: detection.method,
        selector: detection.selector,
        confidence: detection.confidence,
        xpath: getXPath(detection.element),
        cssSelector: getCSSSelector(detection.element)
      };
      
      diagnosticResult.elements.push(elementInfo);
      console.log(`✓ ${uiElement.name} - 検出成功 (${detection.method})`);
    } else {
      diagnosticResult.elements.push({
        name: uiElement.name,
        description: uiElement.description,
        found: false,
        triedStrategies: uiElement.strategies.map(s => s.method)
      });
      console.log(`✗ ${uiElement.name} - 検出失敗`);
    }
  });

  // ========================================
  // 追加情報の収集
  // ========================================

  // カテゴリ別の統計を計算
  const categorizeElement = (name) => {
    if (name.startsWith('leftSidebar')) return '左サイドバー';
    if (name.startsWith('rightSidebar')) return '右サイドバー';
    if (name.startsWith('mainContent')) return 'メインコンテンツ';
    if (name.startsWith('layout_') || name.startsWith('spacing_')) return 'レイアウト';
    return '基本要素';
  };

  const categoryStats = {};
  diagnosticResult.elements.forEach(element => {
    const category = categorizeElement(element.name);
    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, found: 0, notFound: 0 };
    }
    categoryStats[category].total++;
    if (element.found) {
      categoryStats[category].found++;
    } else {
      categoryStats[category].notFound++;
    }
  });

  diagnosticResult.statistics = {
    totalElements: uiElements.length,
    foundElements: diagnosticResult.elements.filter(e => e.found).length,
    notFoundElements: diagnosticResult.elements.filter(e => !e.found).length,
    averageConfidence: diagnosticResult.elements
      .filter(e => e.found && e.detection)
      .reduce((sum, e) => sum + e.detection.confidence, 0) /
      diagnosticResult.elements.filter(e => e.found).length || 0,
    byCategory: categoryStats
  };

  // ========================================
  // JSON出力とダウンロード
  // ========================================

  console.log('[X UI Diagnostic] 診断完了！');
  console.log('統計情報:', diagnosticResult.statistics);
  
  // カテゴリ別の統計を表示
  console.log('\n=== カテゴリ別検出結果 ===');
  Object.entries(diagnosticResult.statistics.byCategory).forEach(([category, stats]) => {
    console.log(`${category}: ${stats.found}/${stats.total}件検出 (${stats.notFound}件未検出)`);
  });

  // 推奨される非表示ターゲットを分析
  console.log('\n=== 非表示ターゲット推奨分析 ===');
  diagnosticResult.elements.forEach(elem => {
    if (!elem.found) return;
    
    // 親要素で視覚的な装飾を持つものを探す
    const parentWithVisuals = elem.parentChain?.find(parent => 
      parent.hasVisualBorder || parent.hasBoxShadow || parent.hasBackground
    );
    
    if (parentWithVisuals) {
      elem.recommendation.suggestedHideTarget = `親要素 (深さ ${parentWithVisuals.depth}): ${parentWithVisuals.tagName}`;
      elem.recommendation.reason = '親要素がボーダー/シャドウ/背景を持っているため、そちらを非表示にすることを推奨';
      console.log(`${elem.name}: 親要素 (深さ ${parentWithVisuals.depth}) の ${parentWithVisuals.tagName} を非表示にすることを推奨`);
      
      // 詳細情報
      const details = [];
      if (parentWithVisuals.hasVisualBorder) details.push('border');
      if (parentWithVisuals.hasBoxShadow) details.push('box-shadow');
      if (parentWithVisuals.hasBackground) details.push('background');
      console.log(`  理由: ${details.join(', ')} を持つ`);
    } else {
      elem.recommendation.suggestedHideTarget = '現在の要素';
      elem.recommendation.reason = '親要素に視覚的な装飾がないため、現在の要素を非表示にすればOK';
    }
  });
  console.log('===================================\n');

  const jsonString = JSON.stringify(diagnosticResult, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = `x-ui-diagnostic-${timestamp}.json`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  console.log(`[X UI Diagnostic] JSONファイルをダウンロードしました: ${filename}`);
  console.log('このファイルをアシスタントに共有してください。');
  console.log('\nJSONファイルの parentChain と recommendation フィールドをチェックして、');
  console.log('非表示すべき正確な要素を特定してください。');
  
  // コンソールにも出力
  console.log('\n=== 診断結果（詳細） ===');
  
  // カテゴリ別にグループ化して表示
  const grouped = {};
  diagnosticResult.elements.forEach(e => {
    const category = categorizeElement(e.name);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(e);
  });
  
  Object.entries(grouped).forEach(([category, elements]) => {
    console.log(`\n--- ${category} ---`);
    console.table(elements.map(e => ({
      名前: e.name,
      検出: e.found ? '✓' : '✗',
      説明: e.description,
      信頼度: e.detection ? e.detection.confidence : 'N/A',
      セレクタ: e.detection ? e.detection.selector.substring(0, 50) : 'N/A'
    })));
  });

  return diagnosticResult;
})();

