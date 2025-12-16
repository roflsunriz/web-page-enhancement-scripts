/**
 * X/Twitter 左サイドバー診断ツール - 新規項目検出版
 * 
 * 目的: 
 * 左サイドバーに追加された「つながる」「ビジネス」などの新項目を検出し、
 * twitter-clean-uiに追加するためのセレクター情報を収集する
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) を開く
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 1.0.0 (Left Sidebar New Items Detection)
 */

(function() {
    'use strict';

    /**
     * 左サイドバー診断クラス
     */
    class LeftSidebarDiagnostic {
        constructor() {
            this.diagnosticData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                leftSidebar: {
                    found: false,
                    structure: null
                },
                navItems: [],
                knownItems: [],
                newItems: [],
                rawHtml: null,
                detectionSummary: {
                    totalNavItems: 0,
                    knownItemCount: 0,
                    newItemCount: 0
                }
            };

            // 既知のナビゲーション項目（twitter-clean-uiで定義済み）
            this.knownSelectors = {
                'AppTabBar_Home_Link': 'leftSidebar_HomeLink',
                'AppTabBar_Explore_Link': 'leftSidebar_ExploreLink',
                'AppTabBar_Notifications_Link': 'leftSidebar_NotificationsLink',
                'AppTabBar_DirectMessage_Link': 'leftSidebar_MessagesLink',
                'AppTabBar_Profile_Link': 'leftSidebar_ProfileLink',
                'SideNav_NewTweet_Button': 'leftSidebar_TweetButton',
                'SideNav_AccountSwitcher_Button': 'leftSidebar_ProfileMenu',
                'AppTabBar_More_Menu': 'leftSidebar_MoreMenu',
                'premium-signup-tab': 'leftSidebar_PremiumLink'
            };

            this.knownHrefs = {
                '/i/grok': 'leftSidebar_GrokLink',
                '/i/bookmarks': 'leftSidebar_BookmarksLink',
                '/lists': 'leftSidebar_ListsLink',
                '/communities': 'leftSidebar_CommunitiesLink',
                '/i/premium_sign_up': 'leftSidebar_PremiumLink'
            };

            // 検索対象の日本語テキスト（新項目候補）
            this.targetTexts = [
                'つながる',
                'ビジネス',
                'Connect',
                'Business',
                '求人',
                'Jobs',
                'スペース',
                'Spaces',
                '認証済み組織',
                'Verified Orgs'
            ];
        }

        /**
         * 要素の属性を取得
         */
        getElementAttributes(element) {
            const attributes = {};
            for (const attr of element.attributes) {
                attributes[attr.name] = attr.value;
            }
            return attributes;
        }

        /**
         * 要素の詳細情報を収集
         */
        collectElementDetails(element) {
            if (!element) return null;

            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            
            return {
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                attributes: this.getElementAttributes(element),
                textContent: element.textContent?.trim().substring(0, 200),
                innerText: element.innerText?.trim().substring(0, 200),
                rect: {
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyle: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility
                },
                // セレクター情報
                dataTestId: element.getAttribute('data-testid'),
                href: element.getAttribute('href'),
                ariaLabel: element.getAttribute('aria-label'),
                role: element.getAttribute('role')
            };
        }

        /**
         * 要素の階層パスを取得
         */
        getElementPath(element, maxDepth = 5) {
            const path = [];
            let current = element;
            
            for (let i = 0; i < maxDepth && current && current !== document.body; i++) {
                path.push({
                    tagName: current.tagName,
                    className: current.className?.substring?.(0, 50) || '',
                    dataTestId: current.getAttribute?.('data-testid') || null
                });
                current = current.parentElement;
            }
            
            return path;
        }

        /**
         * 左サイドバーを検索
         */
        findLeftSidebar() {
            console.log('=== 左サイドバーの検索 ===');
            
            const sidebar = document.querySelector('header[role="banner"]');
            if (!sidebar) {
                console.warn('❌ 左サイドバー header[role="banner"] が見つかりません');
                return null;
            }

            console.log('✅ 左サイドバーを検出');
            this.diagnosticData.leftSidebar.found = true;
            
            // サイドバーの基本情報
            this.diagnosticData.leftSidebar.structure = {
                tagName: sidebar.tagName,
                className: sidebar.className,
                childCount: sidebar.children.length,
                rect: {
                    width: Math.round(sidebar.getBoundingClientRect().width),
                    height: Math.round(sidebar.getBoundingClientRect().height)
                }
            };

            return sidebar;
        }

        /**
         * ナビゲーション項目を分析
         */
        analyzeNavItems(sidebar) {
            console.log('=== ナビゲーション項目の分析 ===');
            
            if (!sidebar) return;

            // nav要素内のリンクを検索
            const navElements = sidebar.querySelectorAll('nav');
            console.log(`nav要素数: ${navElements.length}`);

            // すべてのリンクとボタンを収集
            const items = [];
            
            // aタグ（リンク）
            const links = sidebar.querySelectorAll('a[href]');
            for (const link of links) {
                const details = this.collectElementDetails(link);
                details.elementType = 'link';
                details.path = this.getElementPath(link);
                items.push(details);
            }

            // buttonタグ
            const buttons = sidebar.querySelectorAll('button');
            for (const button of buttons) {
                const details = this.collectElementDetails(button);
                details.elementType = 'button';
                details.path = this.getElementPath(button);
                items.push(details);
            }

            this.diagnosticData.navItems = items;
            this.diagnosticData.detectionSummary.totalNavItems = items.length;
            
            console.log(`合計ナビゲーション項目: ${items.length}`);
            
            return items;
        }

        /**
         * 既知の項目と新項目を分類
         */
        classifyItems(items) {
            console.log('=== 項目の分類 ===');
            
            const known = [];
            const newItems = [];

            for (const item of items) {
                let isKnown = false;
                let knownId = null;

                // data-testidでチェック
                if (item.dataTestId && this.knownSelectors[item.dataTestId]) {
                    isKnown = true;
                    knownId = this.knownSelectors[item.dataTestId];
                }

                // hrefでチェック
                if (!isKnown && item.href) {
                    for (const [hrefPattern, id] of Object.entries(this.knownHrefs)) {
                        if (item.href.includes(hrefPattern)) {
                            isKnown = true;
                            knownId = id;
                            break;
                        }
                    }
                }

                // X/Twitterロゴ（特殊ケース）
                if (!isKnown && item.ariaLabel?.includes('X')) {
                    const parent = item.path?.find(p => p.tagName === 'H1');
                    if (parent) {
                        isKnown = true;
                        knownId = 'leftSidebar_Logo';
                    }
                }

                if (isKnown) {
                    known.push({ ...item, knownId });
                } else {
                    // 新項目として追加
                    newItems.push(item);
                }
            }

            this.diagnosticData.knownItems = known;
            this.diagnosticData.newItems = newItems;
            this.diagnosticData.detectionSummary.knownItemCount = known.length;
            this.diagnosticData.detectionSummary.newItemCount = newItems.length;

            console.log(`既知の項目: ${known.length}`);
            console.log(`新規項目: ${newItems.length}`);

            return { known, newItems };
        }

        /**
         * ターゲットテキストを含む要素を検索
         */
        findTargetTextElements(sidebar) {
            console.log('=== ターゲットテキストの検索 ===');
            
            const results = [];
            
            for (const targetText of this.targetTexts) {
                // XPathでテキストを含む要素を検索
                const xpath = `//*[contains(text(), '${targetText}')]`;
                const xpathResult = document.evaluate(
                    xpath,
                    sidebar,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );

                for (let i = 0; i < xpathResult.snapshotLength; i++) {
                    const elem = xpathResult.snapshotItem(i);
                    if (!elem) continue;

                    // クリック可能な親要素（a, button）を探す
                    let clickable = elem;
                    let depth = 0;
                    while (clickable && depth < 10) {
                        if (clickable.tagName === 'A' || clickable.tagName === 'BUTTON') {
                            break;
                        }
                        clickable = clickable.parentElement;
                        depth++;
                    }

                    const result = {
                        targetText,
                        foundIn: this.collectElementDetails(elem),
                        clickableParent: clickable ? this.collectElementDetails(clickable) : null,
                        parentPath: this.getElementPath(elem, 10)
                    };
                    results.push(result);

                    console.log(`✅ "${targetText}" を検出:`, {
                        element: elem.tagName,
                        clickable: clickable?.tagName,
                        href: clickable?.getAttribute?.('href'),
                        dataTestId: clickable?.getAttribute?.('data-testid')
                    });
                }
            }

            this.diagnosticData.targetTextResults = results;
            return results;
        }

        /**
         * 推奨セレクターを生成
         */
        generateRecommendedSelectors(newItems, targetResults) {
            console.log('=== 推奨セレクターの生成 ===');
            
            const recommendations = [];

            // ターゲットテキスト結果から推奨を生成
            for (const result of targetResults) {
                const clickable = result.clickableParent;
                if (!clickable) continue;

                const rec = {
                    targetText: result.targetText,
                    recommendedSelectors: []
                };

                // data-testidがあれば最優先
                if (clickable.dataTestId) {
                    rec.recommendedSelectors.push({
                        type: 'data-testid',
                        selector: `[data-testid="${clickable.dataTestId}"]`,
                        confidence: 0.95
                    });
                }

                // hrefがあれば追加
                if (clickable.href) {
                    rec.recommendedSelectors.push({
                        type: 'href',
                        selector: `a[href="${clickable.href}"]`,
                        confidence: 0.9
                    });
                    // 部分マッチも
                    const hrefPath = new URL(clickable.href, window.location.origin).pathname;
                    rec.recommendedSelectors.push({
                        type: 'href-contains',
                        selector: `a[href*="${hrefPath}"]`,
                        confidence: 0.85
                    });
                }

                // aria-labelがあれば追加
                if (clickable.ariaLabel) {
                    rec.recommendedSelectors.push({
                        type: 'aria-label',
                        selector: `a[aria-label="${clickable.ariaLabel}"], button[aria-label="${clickable.ariaLabel}"]`,
                        confidence: 0.9
                    });
                }

                recommendations.push(rec);
            }

            this.diagnosticData.recommendations = recommendations;
            return recommendations;
        }

        /**
         * 診断を実行
         */
        runDiagnostics() {
            console.log('%c🔍 X/Twitter 左サイドバー診断ツール', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
            console.log('%c「つながる」「ビジネス」など新項目の検出', 'font-size: 14px; color: #657786;');
            console.log('');

            // 左サイドバーを検索
            const sidebar = this.findLeftSidebar();
            console.log('');

            if (sidebar) {
                // ナビゲーション項目を分析
                const items = this.analyzeNavItems(sidebar);
                console.log('');

                // 項目を分類
                this.classifyItems(items);
                console.log('');

                // ターゲットテキストを検索
                const targetResults = this.findTargetTextElements(sidebar);
                console.log('');

                // 推奨セレクターを生成
                this.generateRecommendedSelectors(this.diagnosticData.newItems, targetResults);
                console.log('');

                // サイドバーのHTML構造（デバッグ用、短縮版）
                this.diagnosticData.rawHtml = sidebar.innerHTML.substring(0, 5000);
            }

            return this.diagnosticData;
        }

        /**
         * 診断結果をダウンロード
         */
        downloadResults() {
            const dataStr = JSON.stringify(this.diagnosticData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `x-left-sidebar-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('診断結果をダウンロードしました');
        }

        /**
         * 新項目をハイライト表示
         */
        highlightNewItems() {
            const targetResults = this.diagnosticData.targetTextResults || [];
            
            for (const result of targetResults) {
                if (result.clickableParent) {
                    // ターゲットテキストに対応する色
                    let color = '#ff6b6b'; // デフォルト赤
                    if (result.targetText.includes('つながる') || result.targetText.includes('Connect')) {
                        color = '#4ecdc4'; // シアン
                    } else if (result.targetText.includes('ビジネス') || result.targetText.includes('Business')) {
                        color = '#ffe66d'; // 黄色
                    }

                    // クリック可能要素をハイライト
                    const clickable = result.clickableParent;
                    // 要素を再取得
                    let elem = null;
                    if (clickable.dataTestId) {
                        elem = document.querySelector(`[data-testid="${clickable.dataTestId}"]`);
                    } else if (clickable.href) {
                        elem = document.querySelector(`a[href="${clickable.href}"]`);
                    }
                    
                    if (elem) {
                        elem.style.outline = `3px solid ${color}`;
                        elem.style.outlineOffset = '2px';
                        console.log(`%c🎯 "${result.targetText}" をハイライト`, `color: ${color}; font-weight: bold;`);
                    }
                }
            }
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    const diagnostic = new LeftSidebarDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 📊 診断結果サマリー ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    console.log(`左サイドバー: ${results.leftSidebar.found ? '%c✅ 検出' : '%c❌ 未検出'}`, 
                results.leftSidebar.found ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    console.log(`ナビゲーション項目: ${results.detectionSummary.totalNavItems}個`);
    console.log(`既知の項目: ${results.detectionSummary.knownItemCount}個`);
    console.log(`%c新規項目: ${results.detectionSummary.newItemCount}個`, 
                results.detectionSummary.newItemCount > 0 ? 'color: #ff6b6b; font-weight: bold;' : '');
    
    console.log('');
    console.log('%c=== 🆕 検出された新項目 ===', 'font-size: 16px; font-weight: bold; color: #ff6b6b;');
    
    if (results.targetTextResults && results.targetTextResults.length > 0) {
        for (const result of results.targetTextResults) {
            console.log(`📍 "${result.targetText}":`);
            if (result.clickableParent) {
                console.log(`   タグ: ${result.clickableParent.tagName}`);
                console.log(`   href: ${result.clickableParent.href || '(なし)'}`);
                console.log(`   data-testid: ${result.clickableParent.dataTestId || '(なし)'}`);
                console.log(`   aria-label: ${result.clickableParent.ariaLabel || '(なし)'}`);
            }
        }
    } else {
        console.log('ターゲットテキスト（つながる、ビジネス等）は見つかりませんでした');
    }

    console.log('');
    console.log('%c=== 🎯 推奨セレクター ===', 'font-size: 16px; font-weight: bold; color: #00ba7c;');
    
    if (results.recommendations && results.recommendations.length > 0) {
        for (const rec of results.recommendations) {
            console.log(`📌 "${rec.targetText}":`);
            for (const sel of rec.recommendedSelectors) {
                console.log(`   [${sel.type}] ${sel.selector} (信頼度: ${sel.confidence})`);
            }
        }
    } else {
        console.log('推奨セレクターはありません');
    }

    console.log('');
    console.log('%c=== 🎨 視覚的ハイライト ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.highlightNewItems();
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
    
    console.log('');
    console.log('%c📝 次のステップ:', 'font-size: 14px; font-weight: bold;');
    console.log('1. ページ上でハイライトされた新項目を確認してください');
    console.log('2. コンソールに表示された推奨セレクターを確認してください');
    console.log('3. ダウンロードされたJSONファイルを開発者に共有してください');
    
    console.log('');
    console.log('%c=== 🔧 完全な診断データ ===', 'font-size: 14px; font-weight: bold; color: #657786;');
    console.log(results);
    
    // グローバルに公開（再実行用）
    window.runLeftSidebarDiagnostic = function() {
        const diag = new LeftSidebarDiagnostic();
        const res = diag.runDiagnostics();
        console.log(res);
        diag.downloadResults();
        diag.highlightNewItems();
        return res;
    };
    
    // ハイライト解除関数
    window.clearLeftSidebarHighlight = function() {
        const sidebar = document.querySelector('header[role="banner"]');
        if (sidebar) {
            const elements = sidebar.querySelectorAll('a, button');
            for (const elem of elements) {
                elem.style.outline = '';
                elem.style.outlineOffset = '';
            }
        }
        console.log('ハイライトを解除しました');
    };
    
    console.log('');
    console.log('%c💡 ヒント:', 'color: #657786; font-style: italic;');
    console.log('  - 診断を再実行: runLeftSidebarDiagnostic()');
    console.log('  - ハイライト解除: clearLeftSidebarHighlight()');
})();
