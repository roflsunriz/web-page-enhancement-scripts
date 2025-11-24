/**
 * X/Twitter Clean UI - レイアウト診断ツール
 * 
 * 目的: 
 * twitter-clean-uiのレイアウト設定で、「メインコンテンツの幅」と
 * 「タイムラインと右サイドバー間の余白」以外が意図通り適用されない
 * 問題を調査するための診断ツール
 * 
 * 問題対象の設定:
 * - leftSidebarWidth (左サイドバーの幅) - header[role="banner"]
 * - rightSidebarWidth (右サイドバーの幅) - [data-testid="sidebarColumn"]
 * - mainContentPadding (メインコンテンツのパディング) - main[role="main"] > div
 * - gap (カラム間の間隔) - main[role="main"] > div
 * 
 * 動作確認済みの設定:
 * - mainContentWidth (メインコンテンツの幅)
 * - timelineRightPadding (タイムラインと右サイドバー間の余白)
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) のホームタイムラインを開く
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 以下のコマンドが利用可能になります：
 *    - collectLayoutDiagnostic(): 診断データを収集してコンソールに表示
 *    - downloadLayoutDiagnostic(): 診断データをJSONファイルとしてダウンロード
 *    - startLayoutWatch(): スタイル変更の監視を開始（リアルタイム追跡）
 *    - stopLayoutWatch(): 監視を停止
 *    - getChangeHistory(): 変更履歴を取得
 *    - downloadChangeHistory(): 変更履歴をJSONでダウンロード
 *    - clearChangeHistory(): 変更履歴をクリア
 *    - highlightLayoutElements(): レイアウト要素をハイライト表示
 *    - clearLayoutHighlights(): ハイライトを解除
 * 
 * バージョン: 1.1.0 (リアルタイム変更追跡対応)
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'twitter_clean_ui_settings';
    const VERSION = '1.1.0';

    /**
     * レイアウト診断データ収集クラス
     */
    class LayoutDiagnostic {
        constructor() {
            this.diagnosticData = null;
            this.monitorInterval = null;
            this.highlightedElements = [];
            this.history = [];
            
            // リアルタイム変更追跡用
            this.changeHistory = [];
            this.styleObserver = null;
            this.domObserver = null;
            this.isWatching = false;
            this.lastSnapshot = null;
        }

        /**
         * 保存された設定を取得
         */
        getSavedSettings() {
            try {
                // GM_getValue を試す
                if (typeof GM_getValue !== 'undefined') {
                    const data = GM_getValue(STORAGE_KEY, null);
                    return data ? JSON.parse(data) : null;
                }
                // localStorage にフォールバック
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('設定の読み込みに失敗:', error);
                return null;
            }
        }

        /**
         * 注入されたスタイル要素を取得
         */
        getInjectedStyles() {
            const styleElement = document.getElementById('twitter-clean-ui-styles');
            return {
                exists: !!styleElement,
                content: styleElement ? styleElement.textContent : null,
                cssRules: this.parseInjectedCSS(styleElement?.textContent)
            };
        }

        /**
         * 注入されたCSSをパース
         */
        parseInjectedCSS(cssText) {
            if (!cssText) return null;

            const rules = {};
            // 簡易的なCSSパース
            const ruleMatches = cssText.match(/[^{}]+\{[^{}]*\}/g);
            if (ruleMatches) {
                for (const rule of ruleMatches) {
                    const [selector, declarations] = rule.split('{');
                    if (selector && declarations) {
                        rules[selector.trim()] = declarations.replace('}', '').trim();
                    }
                }
            }
            return rules;
        }

        /**
         * レイアウトセレクタの定義
         */
        getLayoutSelectors() {
            return {
                leftSidebar: {
                    selector: 'header[role="banner"]',
                    description: '左サイドバー',
                    settingKey: 'leftSidebarWidth',
                    cssProperty: 'width',
                    additionalProperties: ['min-width', 'max-width']
                },
                mainContent: {
                    selector: '[data-testid="primaryColumn"]',
                    description: 'メインコンテンツ',
                    settingKey: 'mainContentWidth',
                    cssProperty: 'width',
                    additionalProperties: ['min-width', 'max-width', 'margin-right', 'padding-right']
                },
                mainContentWideLayout: {
                    selector: '.r-1ye8kvj',
                    description: 'メインコンテンツ（ワイドレイアウトクラス）',
                    settingKey: 'mainContentWidth',
                    cssProperty: 'max-width',
                    additionalProperties: ['width', 'min-width']
                },
                rightSidebar: {
                    selector: '[data-testid="sidebarColumn"]',
                    description: '右サイドバー',
                    settingKey: 'rightSidebarWidth',
                    cssProperty: 'width',
                    additionalProperties: ['min-width', 'max-width']
                },
                mainContainer: {
                    selector: 'main[role="main"] > div',
                    description: 'メインコンテナ（パディング・ギャップ）',
                    settingKey: null, // 複数設定に関連
                    cssProperty: 'padding',
                    additionalProperties: ['gap', 'display', 'flex-direction', 'justify-content']
                }
            };
        }

        /**
         * 要素の計算済みスタイルを取得
         */
        getComputedStyles(element, properties) {
            if (!element) return null;

            const computed = window.getComputedStyle(element);
            const styles = {};

            for (const prop of properties) {
                styles[prop] = computed.getPropertyValue(prop);
            }

            return styles;
        }

        /**
         * 要素のインラインスタイルを取得
         */
        getInlineStyles(element, properties) {
            if (!element) return null;

            const styles = {};
            for (const prop of properties) {
                const value = element.style.getPropertyValue(prop);
                const priority = element.style.getPropertyPriority(prop);
                if (value) {
                    styles[prop] = priority ? `${value} !important` : value;
                }
            }

            return Object.keys(styles).length > 0 ? styles : null;
        }

        /**
         * 要素の詳細情報を収集
         */
        collectElementInfo(config) {
            const elements = document.querySelectorAll(config.selector);
            const elementList = Array.from(elements);

            if (elementList.length === 0) {
                return {
                    found: false,
                    selector: config.selector,
                    description: config.description,
                    count: 0,
                    elements: []
                };
            }

            const allProperties = [config.cssProperty, ...(config.additionalProperties || [])];

            return {
                found: true,
                selector: config.selector,
                description: config.description,
                count: elementList.length,
                elements: elementList.map((el, index) => {
                    const rect = el.getBoundingClientRect();
                    return {
                        index,
                        tagName: el.tagName,
                        className: el.className,
                        dataTestId: el.getAttribute('data-testid'),
                        rect: {
                            top: Math.round(rect.top),
                            left: Math.round(rect.left),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        },
                        computedStyles: this.getComputedStyles(el, allProperties),
                        inlineStyles: this.getInlineStyles(el, allProperties),
                        // 親要素の情報
                        parentInfo: {
                            tagName: el.parentElement?.tagName,
                            className: el.parentElement?.className?.substring(0, 100),
                            dataTestId: el.parentElement?.getAttribute('data-testid')
                        }
                    };
                })
            };
        }

        /**
         * XPath で要素を検索
         */
        findElementByXPath(xpath) {
            try {
                const result = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );
                return result.singleNodeValue;
            } catch (e) {
                return null;
            }
        }

        /**
         * XPath ターゲットの情報を収集
         */
        collectXPathTargetInfo() {
            const xpath = '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]';
            const element = this.findElementByXPath(xpath);

            if (!element) {
                return {
                    found: false,
                    xpath,
                    description: 'XPath ターゲット（ワイドレイアウト）'
                };
            }

            const rect = element.getBoundingClientRect();
            const computed = window.getComputedStyle(element);

            return {
                found: true,
                xpath,
                description: 'XPath ターゲット（ワイドレイアウト）',
                tagName: element.tagName,
                className: element.className,
                rect: {
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyles: {
                    'max-width': computed.getPropertyValue('max-width'),
                    width: computed.getPropertyValue('width'),
                    'min-width': computed.getPropertyValue('min-width')
                },
                inlineStyles: this.getInlineStyles(element, ['max-width', 'width', 'min-width'])
            };
        }

        /**
         * 設定値と実測値の比較分析
         */
        analyzeSettingsVsActual(savedSettings, elementsInfo) {
            const layout = savedSettings?.settings?.layout;
            if (!layout) return null;

            const analysis = {
                leftSidebarWidth: {
                    settingValue: layout.leftSidebarWidth,
                    actualValue: null,
                    match: false,
                    details: ''
                },
                mainContentWidth: {
                    settingValue: layout.mainContentWidth,
                    actualValue: null,
                    match: false,
                    details: ''
                },
                rightSidebarWidth: {
                    settingValue: layout.rightSidebarWidth,
                    actualValue: null,
                    match: false,
                    details: ''
                },
                mainContentPadding: {
                    settingValue: layout.mainContentPadding,
                    actualValue: null,
                    match: false,
                    details: ''
                },
                timelineRightPadding: {
                    settingValue: layout.timelineRightPadding,
                    actualValue: null,
                    match: false,
                    details: ''
                },
                gap: {
                    settingValue: layout.gap,
                    actualValue: null,
                    match: false,
                    details: ''
                }
            };

            // 左サイドバー
            const leftSidebar = elementsInfo.leftSidebar?.elements?.[0];
            if (leftSidebar) {
                const actualWidth = parseInt(leftSidebar.computedStyles?.width);
                analysis.leftSidebarWidth.actualValue = actualWidth;
                analysis.leftSidebarWidth.match = actualWidth === layout.leftSidebarWidth;
                analysis.leftSidebarWidth.details = leftSidebar.inlineStyles?.width ?
                    `インラインスタイル: ${leftSidebar.inlineStyles.width}` :
                    'インラインスタイルなし';
            }

            // メインコンテンツ
            const mainContent = elementsInfo.mainContent?.elements?.[0];
            if (mainContent) {
                const actualWidth = parseInt(mainContent.computedStyles?.width);
                analysis.mainContentWidth.actualValue = actualWidth;
                analysis.mainContentWidth.match = actualWidth === layout.mainContentWidth;
                analysis.mainContentWidth.details = mainContent.inlineStyles?.width ?
                    `インラインスタイル: ${mainContent.inlineStyles.width}` :
                    'インラインスタイルなし';

                // タイムライン右パディング（margin-right として実装）
                const actualMarginRight = parseInt(mainContent.computedStyles?.['margin-right']);
                analysis.timelineRightPadding.actualValue = actualMarginRight;
                analysis.timelineRightPadding.match = actualMarginRight === layout.timelineRightPadding;
                analysis.timelineRightPadding.details = mainContent.inlineStyles?.['margin-right'] ?
                    `インラインスタイル: ${mainContent.inlineStyles['margin-right']}` :
                    'インラインスタイルなし';
            }

            // 右サイドバー
            const rightSidebar = elementsInfo.rightSidebar?.elements?.[0];
            if (rightSidebar) {
                const actualWidth = parseInt(rightSidebar.computedStyles?.width);
                analysis.rightSidebarWidth.actualValue = actualWidth;
                analysis.rightSidebarWidth.match = actualWidth === layout.rightSidebarWidth;
                analysis.rightSidebarWidth.details = rightSidebar.inlineStyles?.width ?
                    `インラインスタイル: ${rightSidebar.inlineStyles.width}` :
                    'インラインスタイルなし';
            }

            // メインコンテナ（パディング・ギャップ）
            const mainContainer = elementsInfo.mainContainer?.elements?.[0];
            if (mainContainer) {
                const actualPadding = parseInt(mainContainer.computedStyles?.padding);
                analysis.mainContentPadding.actualValue = actualPadding;
                analysis.mainContentPadding.match = actualPadding === layout.mainContentPadding;
                analysis.mainContentPadding.details = mainContainer.inlineStyles?.padding ?
                    `インラインスタイル: ${mainContainer.inlineStyles.padding}` :
                    'インラインスタイルなし';

                const actualGap = parseInt(mainContainer.computedStyles?.gap);
                analysis.gap.actualValue = actualGap;
                analysis.gap.match = actualGap === layout.gap;
                analysis.gap.details = mainContainer.inlineStyles?.gap ?
                    `インラインスタイル: ${mainContainer.inlineStyles.gap}` :
                    'インラインスタイルなし';
            }

            return analysis;
        }

        /**
         * CSS優先度の問題を検出
         */
        detectCSSPriorityIssues(injectedStyles, elementsInfo) {
            const issues = [];

            // 注入されたスタイルが存在しない
            if (!injectedStyles.exists) {
                issues.push({
                    severity: 'critical',
                    message: 'スタイル要素 #twitter-clean-ui-styles が見つかりません',
                    suggestion: 'ユーザースクリプトが正しく実行されているか確認してください'
                });
                return issues;
            }

            // 各要素のスタイル適用状況を確認
            const selectors = this.getLayoutSelectors();

            for (const [key, config] of Object.entries(selectors)) {
                const info = elementsInfo[key];
                if (!info?.found) {
                    issues.push({
                        severity: 'warning',
                        target: config.description,
                        selector: config.selector,
                        message: `要素が見つかりません: ${config.selector}`,
                        suggestion: 'X/Twitterのレイアウトが変更されている可能性があります'
                    });
                    continue;
                }

                const firstElement = info.elements[0];
                if (!firstElement.inlineStyles || Object.keys(firstElement.inlineStyles).length === 0) {
                    // インラインスタイルがない = CSSルールのみで適用を試みている
                    issues.push({
                        severity: 'info',
                        target: config.description,
                        selector: config.selector,
                        message: 'インラインスタイルが適用されていません（CSSルール経由のみ）',
                        suggestion: '他のスタイルシートに上書きされている可能性があります'
                    });
                }
            }

            return issues;
        }

        /**
         * 診断データを収集
         */
        collect() {
            const timestamp = new Date().toISOString();
            const savedSettings = this.getSavedSettings();
            const injectedStyles = this.getInjectedStyles();
            const selectors = this.getLayoutSelectors();

            // 各要素の情報を収集
            const elementsInfo = {};
            for (const [key, config] of Object.entries(selectors)) {
                elementsInfo[key] = this.collectElementInfo(config);
            }

            // XPath ターゲットの情報
            const xpathTarget = this.collectXPathTargetInfo();

            // 設定値 vs 実測値の分析
            const settingsVsActual = this.analyzeSettingsVsActual(savedSettings, elementsInfo);

            // CSS優先度の問題検出
            const cssIssues = this.detectCSSPriorityIssues(injectedStyles, elementsInfo);

            // サマリー生成
            const summary = this.generateSummary(settingsVsActual, cssIssues);

            this.diagnosticData = {
                version: VERSION,
                timestamp,
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                summary,
                savedSettings: savedSettings?.settings?.layout || null,
                injectedStyles,
                elementsInfo,
                xpathTarget,
                settingsVsActual,
                cssIssues
            };

            // 履歴に追加
            this.history.push({
                timestamp,
                summary: { ...summary }
            });

            // 履歴は最大20件
            if (this.history.length > 20) {
                this.history.shift();
            }

            return this.diagnosticData;
        }

        /**
         * サマリーを生成
         */
        generateSummary(settingsVsActual, cssIssues) {
            if (!settingsVsActual) {
                return {
                    status: 'error',
                    message: '設定が見つかりません',
                    matchingSettings: [],
                    mismatchedSettings: [],
                    issueCount: cssIssues.length
                };
            }

            const matchingSettings = [];
            const mismatchedSettings = [];

            for (const [key, analysis] of Object.entries(settingsVsActual)) {
                if (analysis.match) {
                    matchingSettings.push(key);
                } else if (analysis.actualValue !== null) {
                    mismatchedSettings.push({
                        key,
                        expected: analysis.settingValue,
                        actual: analysis.actualValue
                    });
                }
            }

            const status = mismatchedSettings.length === 0 ? 'ok' :
                mismatchedSettings.length <= 2 ? 'warning' : 'error';

            return {
                status,
                message: status === 'ok' ? '全ての設定が正しく適用されています' :
                    `${mismatchedSettings.length}個の設定が期待通りに適用されていません`,
                matchingSettings,
                mismatchedSettings,
                issueCount: cssIssues.length
            };
        }

        /**
         * 診断結果をコンソールに表示
         */
        printToConsole() {
            const data = this.collect();

            console.log('%c📐 X/Twitter Clean UI レイアウト診断', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
            console.log(`バージョン: ${data.version}`);
            console.log(`タイムスタンプ: ${data.timestamp}`);
            console.log('');

            // サマリー
            const statusColors = {
                ok: 'color: #00ba7c; font-weight: bold;',
                warning: 'color: #f4a200; font-weight: bold;',
                error: 'color: #f4212e; font-weight: bold;'
            };
            console.log('%c=== 📊 サマリー ===', 'font-size: 16px; font-weight: bold;');
            console.log(`%c${data.summary.status.toUpperCase()}: ${data.summary.message}`, statusColors[data.summary.status]);

            if (data.summary.matchingSettings.length > 0) {
                console.log(`✅ 適用済み: ${data.summary.matchingSettings.join(', ')}`);
            }

            if (data.summary.mismatchedSettings.length > 0) {
                console.log('%c❌ 不一致:', 'color: #f4212e;');
                for (const item of data.summary.mismatchedSettings) {
                    console.log(`  - ${item.key}: 期待値 ${item.expected}px, 実測値 ${item.actual}px`);
                }
            }
            console.log('');

            // 設定値
            console.log('%c=== ⚙️ 保存された設定値 ===', 'font-size: 16px; font-weight: bold;');
            if (data.savedSettings) {
                console.table(data.savedSettings);
            } else {
                console.log('設定が見つかりません');
            }
            console.log('');

            // 注入されたスタイル
            console.log('%c=== 🎨 注入されたスタイル ===', 'font-size: 16px; font-weight: bold;');
            console.log(`スタイル要素存在: ${data.injectedStyles.exists ? '✅' : '❌'}`);
            if (data.injectedStyles.cssRules) {
                console.log('CSSルール:');
                console.log(data.injectedStyles.cssRules);
            }
            console.log('');

            // 各要素の状態
            console.log('%c=== 🔍 要素の検出状態 ===', 'font-size: 16px; font-weight: bold;');
            for (const [key, info] of Object.entries(data.elementsInfo)) {
                const status = info.found ? '✅' : '❌';
                console.log(`${status} ${info.description} (${info.selector}): ${info.count}件`);
                if (info.found && info.elements[0]) {
                    const el = info.elements[0];
                    console.log(`   計算済みスタイル:`, el.computedStyles);
                    if (el.inlineStyles) {
                        console.log(`   インラインスタイル:`, el.inlineStyles);
                    }
                }
            }
            console.log('');

            // CSS優先度の問題
            if (data.cssIssues.length > 0) {
                console.log('%c=== ⚠️ 検出された問題 ===', 'font-size: 16px; font-weight: bold; color: #f4a200;');
                for (const issue of data.cssIssues) {
                    const icon = issue.severity === 'critical' ? '🔴' :
                        issue.severity === 'warning' ? '🟡' : '🔵';
                    console.log(`${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
                    if (issue.suggestion) {
                        console.log(`   💡 ${issue.suggestion}`);
                    }
                }
            }
            console.log('');

            console.log('%c完全な診断データ:', 'color: #657786;');
            console.log(data);

            return data;
        }

        /**
         * 診断結果をダウンロード
         */
        download() {
            const data = this.diagnosticData || this.collect();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `x-layout-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('%c✅ 診断結果をダウンロードしました', 'color: #00ba7c; font-weight: bold;');
        }

        /**
         * 監視を開始
         */
        startMonitor(interval = 5000) {
            if (this.monitorInterval) {
                console.log('既に監視中です。stopLayoutMonitor() で停止してください。');
                return;
            }

            console.log(`%c🔄 レイアウト監視を開始 (間隔: ${interval}ms)`, 'color: #1d9bf0; font-weight: bold;');

            this.monitorInterval = setInterval(() => {
                const data = this.collect();
                const prev = this.history[this.history.length - 2];

                if (prev) {
                    const changes = [];
                    for (const [key, analysis] of Object.entries(data.settingsVsActual || {})) {
                        const prevAnalysis = this.history[this.history.length - 2]?.summary?.mismatchedSettings?.find(m => m.key === key);
                        if (analysis.actualValue !== prevAnalysis?.actual) {
                            changes.push(`${key}: ${prevAnalysis?.actual ?? 'N/A'} → ${analysis.actualValue}`);
                        }
                    }

                    if (changes.length > 0) {
                        console.log(`%c[${new Date().toLocaleTimeString()}] レイアウト変化検出:`, 'color: #f4a200;');
                        changes.forEach(c => console.log(`  - ${c}`));
                    }
                }
            }, interval);
        }

        /**
         * 監視を停止
         */
        stopMonitor() {
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = null;
                console.log('%c⏹️ レイアウト監視を停止しました', 'color: #657786;');
            }
        }

        /**
         * 要素をハイライト表示
         */
        highlightElements() {
            this.clearHighlights();

            const colors = {
                leftSidebar: '#FF6B6B',
                mainContent: '#4ECDC4',
                mainContentWideLayout: '#45B7D1',
                rightSidebar: '#96CEB4',
                mainContainer: '#FFEAA7'
            };

            const selectors = this.getLayoutSelectors();

            for (const [key, config] of Object.entries(selectors)) {
                const elements = document.querySelectorAll(config.selector);
                elements.forEach(el => {
                    el.style.outline = `3px solid ${colors[key] || '#999'}`;
                    el.style.outlineOffset = '2px';
                    this.highlightedElements.push(el);
                });
            }

            console.log('%c🎨 レイアウト要素をハイライト表示しました', 'font-weight: bold;');
            console.log('  🔴 左サイドバー');
            console.log('  🟢 メインコンテンツ');
            console.log('  🔵 メインコンテンツ（ワイドレイアウト）');
            console.log('  🟢 右サイドバー');
            console.log('  🟡 メインコンテナ');
        }

        /**
         * ハイライトを解除
         */
        clearHighlights() {
            for (const el of this.highlightedElements) {
                el.style.outline = '';
                el.style.outlineOffset = '';
            }
            this.highlightedElements = [];
            console.log('%cハイライトを解除しました', 'color: #657786;');
        }

        // ========================================
        // リアルタイム変更追跡機能
        // ========================================

        /**
         * 現在のレイアウト状態のスナップショットを取得
         */
        takeSnapshot() {
            const selectors = this.getLayoutSelectors();
            const snapshot = {
                timestamp: new Date().toISOString(),
                injectedCSS: document.getElementById('twitter-clean-ui-styles')?.textContent || null,
                savedSettings: this.getSavedSettings()?.settings?.layout || null,
                elements: {}
            };

            for (const [key, config] of Object.entries(selectors)) {
                const element = document.querySelector(config.selector);
                if (element) {
                    const allProperties = [config.cssProperty, ...(config.additionalProperties || [])];
                    const computed = window.getComputedStyle(element);
                    
                    snapshot.elements[key] = {
                        selector: config.selector,
                        computedStyles: {},
                        inlineStyles: {},
                        rect: {
                            width: Math.round(element.getBoundingClientRect().width),
                            height: Math.round(element.getBoundingClientRect().height)
                        }
                    };

                    for (const prop of allProperties) {
                        snapshot.elements[key].computedStyles[prop] = computed.getPropertyValue(prop);
                        const inlineValue = element.style.getPropertyValue(prop);
                        if (inlineValue) {
                            const priority = element.style.getPropertyPriority(prop);
                            snapshot.elements[key].inlineStyles[prop] = priority ? `${inlineValue} !important` : inlineValue;
                        }
                    }
                } else {
                    snapshot.elements[key] = { found: false, selector: config.selector };
                }
            }

            return snapshot;
        }

        /**
         * 2つのスナップショットの差分を計算
         */
        diffSnapshots(before, after) {
            const diff = {
                timestamp: after.timestamp,
                timeSincePrevious: new Date(after.timestamp) - new Date(before.timestamp),
                cssChanged: before.injectedCSS !== after.injectedCSS,
                settingsChanged: JSON.stringify(before.savedSettings) !== JSON.stringify(after.savedSettings),
                elementChanges: {}
            };

            // CSS差分を詳細に取得
            if (diff.cssChanged) {
                diff.cssDiff = {
                    before: before.injectedCSS?.substring(0, 500) + (before.injectedCSS?.length > 500 ? '...' : ''),
                    after: after.injectedCSS?.substring(0, 500) + (after.injectedCSS?.length > 500 ? '...' : '')
                };
            }

            // 設定差分
            if (diff.settingsChanged) {
                diff.settingsDiff = {
                    before: before.savedSettings,
                    after: after.savedSettings
                };
            }

            // 要素ごとの差分
            for (const key of Object.keys(after.elements)) {
                const beforeEl = before.elements[key];
                const afterEl = after.elements[key];

                if (!beforeEl || !afterEl) continue;
                if (beforeEl.found === false || afterEl.found === false) continue;

                const changes = {};
                let hasChanges = false;

                // 計算済みスタイルの比較
                for (const prop of Object.keys(afterEl.computedStyles)) {
                    const beforeVal = beforeEl.computedStyles?.[prop];
                    const afterVal = afterEl.computedStyles[prop];
                    if (beforeVal !== afterVal) {
                        changes[prop] = { before: beforeVal, after: afterVal };
                        hasChanges = true;
                    }
                }

                // インラインスタイルの比較
                const allInlineProps = new Set([
                    ...Object.keys(beforeEl.inlineStyles || {}),
                    ...Object.keys(afterEl.inlineStyles || {})
                ]);
                for (const prop of allInlineProps) {
                    const beforeVal = beforeEl.inlineStyles?.[prop] || null;
                    const afterVal = afterEl.inlineStyles?.[prop] || null;
                    if (beforeVal !== afterVal) {
                        if (!changes[prop]) changes[prop] = {};
                        changes[prop].inlineBefore = beforeVal;
                        changes[prop].inlineAfter = afterVal;
                        hasChanges = true;
                    }
                }

                // サイズの比較
                if (beforeEl.rect?.width !== afterEl.rect?.width || beforeEl.rect?.height !== afterEl.rect?.height) {
                    changes._rect = {
                        before: beforeEl.rect,
                        after: afterEl.rect
                    };
                    hasChanges = true;
                }

                if (hasChanges) {
                    diff.elementChanges[key] = changes;
                }
            }

            diff.hasChanges = diff.cssChanged || diff.settingsChanged || Object.keys(diff.elementChanges).length > 0;

            return diff;
        }

        /**
         * スタイル変更の監視を開始
         */
        startWatch() {
            if (this.isWatching) {
                console.log('%c既に監視中です。stopLayoutWatch() で停止してください。', 'color: #f4a200;');
                return;
            }

            console.log('%c🔍 レイアウト変更の監視を開始します...', 'font-size: 14px; font-weight: bold; color: #1d9bf0;');

            // 初期スナップショット
            this.lastSnapshot = this.takeSnapshot();
            this.changeHistory = [];
            this.isWatching = true;

            console.log('%c初期スナップショットを取得しました', 'color: #00ba7c;');
            console.log('保存された設定:', this.lastSnapshot.savedSettings);

            // スタイル要素の監視（MutationObserver）
            const styleElement = document.getElementById('twitter-clean-ui-styles');
            if (styleElement) {
                this.styleObserver = new MutationObserver((mutations) => {
                    this.onStyleChange('style-mutation', mutations);
                });

                this.styleObserver.observe(styleElement, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                console.log('%c✅ スタイル要素 (#twitter-clean-ui-styles) の監視を開始', 'color: #00ba7c;');
            } else {
                console.log('%c⚠️ スタイル要素が見つかりません。DOM全体を監視します。', 'color: #f4a200;');
            }

            // DOM全体の監視（スタイル要素の追加/削除を検出）
            this.domObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    // スタイル要素が追加された場合
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.id === 'twitter-clean-ui-styles') {
                                console.log('%c🆕 スタイル要素が追加されました', 'color: #1d9bf0;');
                                this.onStyleChange('style-added', [mutation]);
                                
                                // 新しいスタイル要素の監視を開始
                                if (this.styleObserver) {
                                    this.styleObserver.disconnect();
                                }
                                this.styleObserver = new MutationObserver((m) => {
                                    this.onStyleChange('style-mutation', m);
                                });
                                this.styleObserver.observe(node, {
                                    childList: true,
                                    characterData: true,
                                    subtree: true
                                });
                            }
                        }
                        // スタイル要素が削除された場合
                        for (const node of mutation.removedNodes) {
                            if (node.id === 'twitter-clean-ui-styles') {
                                console.log('%c🗑️ スタイル要素が削除されました', 'color: #f4212e;');
                                this.onStyleChange('style-removed', [mutation]);
                            }
                        }
                    }

                    // 要素のstyle属性の変更
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target;
                        const selectors = this.getLayoutSelectors();
                        for (const [key, config] of Object.entries(selectors)) {
                            if (target.matches?.(config.selector)) {
                                this.onStyleChange('inline-style-change', [mutation], key);
                                break;
                            }
                        }
                    }
                }
            });

            // レイアウト要素のstyle属性変更も監視
            const selectors = this.getLayoutSelectors();
            for (const [key, config] of Object.entries(selectors)) {
                const element = document.querySelector(config.selector);
                if (element) {
                    this.domObserver.observe(element, {
                        attributes: true,
                        attributeFilter: ['style']
                    });
                }
            }

            // document.headも監視（スタイル要素の追加/削除）
            this.domObserver.observe(document.head, {
                childList: true
            });

            console.log('%c✅ DOM変更の監視を開始', 'color: #00ba7c;');
            console.log('');
            console.log('%c📝 twitter-clean-uiの設定を変更すると、変更内容がここに表示されます', 'color: #657786; font-style: italic;');
            console.log('%c   stopLayoutWatch() で監視を停止し、downloadChangeHistory() で履歴をダウンロードできます', 'color: #657786; font-style: italic;');
        }

        /**
         * スタイル変更時のコールバック
         */
        onStyleChange(trigger, mutations, elementKey = null) {
            const newSnapshot = this.takeSnapshot();
            const diff = this.diffSnapshots(this.lastSnapshot, newSnapshot);

            if (diff.hasChanges) {
                const changeEntry = {
                    id: this.changeHistory.length + 1,
                    trigger,
                    elementKey,
                    ...diff,
                    snapshotBefore: this.lastSnapshot,
                    snapshotAfter: newSnapshot
                };

                this.changeHistory.push(changeEntry);
                this.lastSnapshot = newSnapshot;

                // コンソールに変更を表示
                this.printChange(changeEntry);
            }
        }

        /**
         * 変更をコンソールに表示
         */
        printChange(change) {
            console.log('');
            console.log(`%c━━━ 変更 #${change.id} ━━━`, 'font-size: 14px; font-weight: bold; color: #1d9bf0;');
            console.log(`%c⏱️ ${change.timestamp}`, 'color: #657786;');
            console.log(`%cトリガー: ${change.trigger}${change.elementKey ? ` (${change.elementKey})` : ''}`, 'color: #657786;');

            if (change.cssChanged) {
                console.log('%c📝 CSS変更あり', 'color: #f4a200; font-weight: bold;');
            }

            if (change.settingsChanged) {
                console.log('%c⚙️ 設定変更あり', 'color: #f4a200; font-weight: bold;');
                console.log('  変更前:', change.settingsDiff.before);
                console.log('  変更後:', change.settingsDiff.after);
            }

            if (Object.keys(change.elementChanges).length > 0) {
                console.log('%c🎨 要素スタイル変更:', 'font-weight: bold;');
                for (const [key, changes] of Object.entries(change.elementChanges)) {
                    console.log(`  %c${key}:`, 'color: #1d9bf0;');
                    for (const [prop, vals] of Object.entries(changes)) {
                        if (prop === '_rect') {
                            console.log(`    サイズ: ${vals.before?.width}x${vals.before?.height} → ${vals.after?.width}x${vals.after?.height}`);
                        } else {
                            if (vals.before !== undefined && vals.after !== undefined) {
                                const changed = vals.before !== vals.after;
                                const style = changed ? 'color: #f4212e;' : 'color: #657786;';
                                console.log(`%c    ${prop}: ${vals.before || '(なし)'} → ${vals.after || '(なし)'}`, style);
                            }
                            if (vals.inlineBefore !== undefined || vals.inlineAfter !== undefined) {
                                console.log(`%c    ${prop} (inline): ${vals.inlineBefore || '(なし)'} → ${vals.inlineAfter || '(なし)'}`, 'color: #45B7D1;');
                            }
                        }
                    }
                }
            }
        }

        /**
         * 監視を停止
         */
        stopWatch() {
            if (!this.isWatching) {
                console.log('%c監視は開始されていません', 'color: #657786;');
                return;
            }

            if (this.styleObserver) {
                this.styleObserver.disconnect();
                this.styleObserver = null;
            }

            if (this.domObserver) {
                this.domObserver.disconnect();
                this.domObserver = null;
            }

            this.isWatching = false;

            console.log('');
            console.log('%c⏹️ レイアウト変更の監視を停止しました', 'font-size: 14px; font-weight: bold; color: #657786;');
            console.log(`%c記録された変更: ${this.changeHistory.length}件`, 'color: #657786;');
            console.log('%cdownloadChangeHistory() で履歴をダウンロードできます', 'color: #657786; font-style: italic;');
        }

        /**
         * 変更履歴を取得
         */
        getChangeHistory() {
            return {
                version: VERSION,
                recordedAt: new Date().toISOString(),
                totalChanges: this.changeHistory.length,
                isWatching: this.isWatching,
                changes: this.changeHistory
            };
        }

        /**
         * 変更履歴をダウンロード
         */
        downloadChangeHistory() {
            const history = this.getChangeHistory();
            
            if (history.totalChanges === 0) {
                console.log('%c⚠️ 変更履歴がありません', 'color: #f4a200;');
                return;
            }

            const dataStr = JSON.stringify(history, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `x-layout-change-history-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log(`%c✅ 変更履歴をダウンロードしました (${history.totalChanges}件の変更)`, 'color: #00ba7c; font-weight: bold;');
        }

        /**
         * 変更履歴をクリア
         */
        clearChangeHistory() {
            const count = this.changeHistory.length;
            this.changeHistory = [];
            this.lastSnapshot = this.isWatching ? this.takeSnapshot() : null;
            console.log(`%c🗑️ 変更履歴をクリアしました (${count}件削除)`, 'color: #657786;');
        }
    }

    // ========================================
    // グローバル関数として登録
    // ========================================

    const diagnostic = new LayoutDiagnostic();

    // 診断データを収集してコンソールに表示
    window.collectLayoutDiagnostic = function() {
        return diagnostic.printToConsole();
    };

    // 診断データをJSONファイルとしてダウンロード
    window.downloadLayoutDiagnostic = function() {
        diagnostic.collect();
        diagnostic.download();
    };

    // ========================================
    // リアルタイム変更追跡（推奨）
    // ========================================

    // スタイル変更の監視を開始（MutationObserver使用）
    window.startLayoutWatch = function() {
        diagnostic.startWatch();
    };

    // 監視を停止
    window.stopLayoutWatch = function() {
        diagnostic.stopWatch();
    };

    // 変更履歴を取得
    window.getChangeHistory = function() {
        const history = diagnostic.getChangeHistory();
        console.log('%c📜 変更履歴:', 'font-weight: bold;');
        console.log(history);
        return history;
    };

    // 変更履歴をダウンロード
    window.downloadChangeHistory = function() {
        diagnostic.downloadChangeHistory();
    };

    // 変更履歴をクリア
    window.clearChangeHistory = function() {
        diagnostic.clearChangeHistory();
    };

    // ========================================
    // レガシー：ポーリングベースの監視
    // ========================================

    // レイアウト変化の監視を開始（ポーリング）
    window.startLayoutMonitor = function(interval = 5000) {
        diagnostic.startMonitor(interval);
    };

    // 監視を停止（ポーリング）
    window.stopLayoutMonitor = function() {
        diagnostic.stopMonitor();
    };

    // ========================================
    // ハイライト表示
    // ========================================

    // 要素をハイライト表示
    window.highlightLayoutElements = function() {
        diagnostic.highlightElements();
    };

    // ハイライトを解除
    window.clearLayoutHighlights = function() {
        diagnostic.clearHighlights();
    };

    // ========================================
    // 初期表示
    // ========================================

    console.log('%c📐 X/Twitter Clean UI レイアウト診断ツール v' + VERSION, 'font-size: 18px; font-weight: bold; color: #1d9bf0;');
    console.log('%c常駐モードで起動しました。ページを離れるまで有効です。', 'color: #657786;');
    console.log('');
    
    console.log('%c🔍 基本診断:', 'font-weight: bold; color: #00ba7c;');
    console.log('  collectLayoutDiagnostic()   - 現在のレイアウト状態を診断');
    console.log('  downloadLayoutDiagnostic()  - 診断結果をJSONでダウンロード');
    console.log('');
    
    console.log('%c🎯 リアルタイム変更追跡（推奨）:', 'font-weight: bold; color: #f4a200;');
    console.log('  startLayoutWatch()          - 設定変更の監視を開始');
    console.log('  stopLayoutWatch()           - 監視を停止');
    console.log('  getChangeHistory()          - 変更履歴を表示');
    console.log('  downloadChangeHistory()     - 変更履歴をJSONでダウンロード');
    console.log('  clearChangeHistory()        - 変更履歴をクリア');
    console.log('');
    
    console.log('%c🎨 視覚化:', 'font-weight: bold; color: #45B7D1;');
    console.log('  highlightLayoutElements()   - レイアウト要素をハイライト');
    console.log('  clearLayoutHighlights()     - ハイライトを解除');
    console.log('');
    
    console.log('%c📋 使い方:', 'font-weight: bold;');
    console.log('%c  1. startLayoutWatch() を実行して監視開始', 'color: #657786;');
    console.log('%c  2. twitter-clean-uiの設定UIでレイアウト値を変更', 'color: #657786;');
    console.log('%c  3. コンソールに変更内容がリアルタイムで表示される', 'color: #657786;');
    console.log('%c  4. stopLayoutWatch() で監視停止', 'color: #657786;');
    console.log('%c  5. downloadChangeHistory() で全変更履歴をダウンロード', 'color: #657786;');
    console.log('');
    console.log('%c💡 今すぐ startLayoutWatch() を実行して監視を開始してください！', 'color: #1d9bf0; font-style: italic; font-weight: bold;');

})();

