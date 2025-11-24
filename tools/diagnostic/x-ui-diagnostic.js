/**
 * X/Twitter UI 診断ツール
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) を開く
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 1.0.0
 */

(function() {
    'use strict';

    /**
     * 診断データ収集クラス
     */
    class XUIDiagnostic {
        constructor() {
            this.diagnosticData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                elements: {},
                issues: []
            };
        }

        /**
         * 要素の詳細情報を収集
         */
        collectElementInfo(selector, description) {
            const elements = document.querySelectorAll(selector);
            const info = {
                description,
                selector,
                found: elements.length,
                elements: []
            };

            elements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);
                
                // 階層情報の取得
                const hierarchy = this.getElementHierarchy(element, 5);
                
                // 適用されているスタイル
                const relevantStyles = {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    width: computedStyle.width,
                    height: computedStyle.height,
                    maxWidth: computedStyle.maxWidth,
                    minWidth: computedStyle.minWidth,
                    padding: computedStyle.padding,
                    paddingLeft: computedStyle.paddingLeft,
                    paddingRight: computedStyle.paddingRight,
                    margin: computedStyle.margin,
                    border: computedStyle.border,
                    borderRadius: computedStyle.borderRadius,
                    position: computedStyle.position,
                    top: computedStyle.top,
                    left: computedStyle.left,
                    right: computedStyle.right,
                    bottom: computedStyle.bottom,
                    transform: computedStyle.transform,
                    overflow: computedStyle.overflow,
                    zIndex: computedStyle.zIndex
                };

                // インラインスタイルの取得
                const inlineStyle = element.getAttribute('style');

                info.elements.push({
                    index,
                    rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        right: rect.right,
                        bottom: rect.bottom
                    },
                    computedStyle: relevantStyles,
                    inlineStyle,
                    hierarchy,
                    className: element.className,
                    id: element.id,
                    tagName: element.tagName,
                    attributes: this.getElementAttributes(element),
                    textContent: element.textContent?.substring(0, 100) // 最初の100文字のみ
                });
            });

            return info;
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
         * 要素の階層構造を取得
         */
        getElementHierarchy(element, depth) {
            const hierarchy = [];
            let current = element;

            for (let i = 0; i < depth && current; i++) {
                const computedStyle = window.getComputedStyle(current);
                hierarchy.push({
                    tagName: current.tagName,
                    className: current.className,
                    id: current.id,
                    attributes: this.getElementAttributes(current),
                    computedStyle: {
                        display: computedStyle.display,
                        position: computedStyle.position,
                        width: computedStyle.width,
                        maxWidth: computedStyle.maxWidth,
                        padding: computedStyle.padding,
                        border: computedStyle.border,
                        borderRadius: computedStyle.borderRadius
                    }
                });
                current = current.parentElement;
            }

            return hierarchy;
        }

        /**
         * タイムライン幅の調査
         */
        investigateTimelineWidth() {
            console.log('=== タイムライン幅の調査 ===');
            
            const primaryColumn = this.collectElementInfo(
                '[data-testid="primaryColumn"]',
                'タイムラインのメインカラム'
            );
            
            const mainRole = this.collectElementInfo(
                'main[role="main"]',
                'メインコンテンツエリア'
            );
            
            const mainChildren = this.collectElementInfo(
                'main[role="main"] > div',
                'メインコンテンツの直下のdiv'
            );

            this.diagnosticData.elements.timelineWidth = {
                primaryColumn,
                mainRole,
                mainChildren
            };

            // 問題の検出
            if (primaryColumn.found > 0) {
                const element = primaryColumn.elements[0];
                const paddingRight = parseFloat(element.computedStyle.paddingRight);
                const maxWidth = element.computedStyle.maxWidth;
                
                if (paddingRight > 50) {
                    this.diagnosticData.issues.push({
                        type: 'timelineWidth',
                        severity: 'high',
                        message: `primaryColumnのpaddingRightが${paddingRight}pxと大きすぎます`,
                        element: 'primaryColumn',
                        details: {
                            paddingRight: element.computedStyle.paddingRight,
                            maxWidth: maxWidth,
                            actualWidth: element.rect.width
                        }
                    });
                }

                // max-widthが正しく適用されているか
                if (maxWidth !== 'none' && element.rect.width > parseFloat(maxWidth) + paddingRight) {
                    this.diagnosticData.issues.push({
                        type: 'timelineWidth',
                        severity: 'medium',
                        message: 'max-widthが正しく適用されていない可能性があります',
                        element: 'primaryColumn',
                        details: {
                            maxWidth: maxWidth,
                            actualWidth: element.rect.width,
                            paddingRight: element.computedStyle.paddingRight
                        }
                    });
                }
            }
        }

        /**
         * プレミアムサブスクライブセクションの調査
         */
        investigatePremiumSubscribe() {
            console.log('=== プレミアムサブスクライブセクションの調査 ===');
            
            // テキストを含む要素を探す
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            const premiumElements = [];

            if (sidebar) {
                const allDivs = Array.from(sidebar.querySelectorAll('div, section, aside'));
                
                for (const elem of allDivs) {
                    const text = elem.textContent || '';
                    if (
                        text.includes('プレミアムにサブスクライブ') ||
                        text.includes('Subscribe to Premium') ||
                        (text.includes('認証マーク') && text.includes('プレミアム'))
                    ) {
                        const rect = elem.getBoundingClientRect();
                        const computedStyle = window.getComputedStyle(elem);
                        const hierarchy = this.getElementHierarchy(elem, 8);

                        premiumElements.push({
                            tagName: elem.tagName,
                            textContentLength: text.length,
                            textPreview: text.substring(0, 100),
                            rect: {
                                width: rect.width,
                                height: rect.height,
                                top: rect.top,
                                left: rect.left
                            },
                            computedStyle: {
                                display: computedStyle.display,
                                visibility: computedStyle.visibility,
                                border: computedStyle.border,
                                borderRadius: computedStyle.borderRadius,
                                padding: computedStyle.padding
                            },
                            hierarchy,
                            className: elem.className,
                            attributes: this.getElementAttributes(elem)
                        });

                        // ボーダー付きコンテナを探す
                        let current = elem;
                        for (let i = 0; i < 5; i++) {
                            if (!current.parentElement) break;
                            const style = window.getComputedStyle(current.parentElement);
                            const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                            
                            if (borderMatch && parseFloat(borderMatch[1]) > 0 && style.borderRadius !== '0px') {
                                const containerRect = current.parentElement.getBoundingClientRect();
                                premiumElements[premiumElements.length - 1].borderContainer = {
                                    level: i,
                                    rect: {
                                        width: containerRect.width,
                                        height: containerRect.height,
                                        top: containerRect.top,
                                        left: containerRect.left
                                    },
                                    computedStyle: {
                                        border: style.border,
                                        borderRadius: style.borderRadius,
                                        padding: style.padding,
                                        display: style.display
                                    },
                                    tagName: current.parentElement.tagName,
                                    className: current.parentElement.className
                                };
                                break;
                            }
                            current = current.parentElement;
                        }
                    }
                }
            }

            this.diagnosticData.elements.premiumSubscribe = {
                description: 'プレミアムサブスクライブセクション',
                found: premiumElements.length,
                elements: premiumElements
            };

            // タイムラインと重複していないかチェック
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (primaryColumn && premiumElements.length > 0) {
                const timelineRect = primaryColumn.getBoundingClientRect();
                
                premiumElements.forEach((elem, index) => {
                    if (elem.rect.left < timelineRect.right && elem.rect.right > timelineRect.left) {
                        this.diagnosticData.issues.push({
                            type: 'premiumSubscribe',
                            severity: 'critical',
                            message: 'プレミアムサブスクライブの検出領域がタイムラインと重複しています',
                            elementIndex: index,
                            details: {
                                premiumRect: elem.rect,
                                timelineRect: {
                                    left: timelineRect.left,
                                    right: timelineRect.right,
                                    top: timelineRect.top,
                                    bottom: timelineRect.bottom
                                }
                            }
                        });
                    }
                });
            }
        }

        /**
         * 検索ボックスの調査
         */
        investigateSearchBox() {
            console.log('=== 検索ボックスの調査 ===');
            
            const searchInput = this.collectElementInfo(
                '[data-testid="SearchBox_Search_Input"]',
                '検索ボックスの入力フィールド'
            );

            const searchElements = [];
            const input = document.querySelector('[data-testid="SearchBox_Search_Input"]');
            
            if (input) {
                const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
                let container = input;
                
                // 最大10階層上まで探索
                for (let i = 0; i < 10; i++) {
                    if (!container.parentElement) break;
                    
                    container = container.parentElement;
                    const rect = container.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(container);
                    const hierarchy = this.getElementHierarchy(container, 3);

                    searchElements.push({
                        level: i,
                        tagName: container.tagName,
                        className: container.className,
                        rect: {
                            width: rect.width,
                            height: rect.height,
                            top: rect.top,
                            left: rect.left
                        },
                        computedStyle: {
                            display: computedStyle.display,
                            position: computedStyle.position,
                            padding: computedStyle.padding,
                            margin: computedStyle.margin,
                            border: computedStyle.border,
                            borderRadius: computedStyle.borderRadius,
                            backgroundColor: computedStyle.backgroundColor
                        },
                        hierarchy,
                        isDirectChildOfSidebar: sidebar?.contains(container) && container.parentElement === sidebar.firstElementChild,
                        attributes: this.getElementAttributes(container)
                    });

                    if (sidebar?.contains(container) && container.parentElement === sidebar.firstElementChild) {
                        searchElements[searchElements.length - 1].isTargetContainer = true;
                        break;
                    }
                }
            }

            this.diagnosticData.elements.searchBox = {
                searchInput,
                containerHierarchy: searchElements,
                description: '検索ボックスとそのコンテナ階層'
            };

            // 検索ボックスが正しく検出されているかチェック
            if (searchInput.found === 0) {
                this.diagnosticData.issues.push({
                    type: 'searchBox',
                    severity: 'high',
                    message: '検索ボックスの入力フィールドが見つかりません'
                });
            } else if (searchElements.length === 0) {
                this.diagnosticData.issues.push({
                    type: 'searchBox',
                    severity: 'high',
                    message: '検索ボックスのコンテナが検出できません'
                });
            } else {
                const targetContainer = searchElements.find(e => e.isTargetContainer);
                if (!targetContainer) {
                    this.diagnosticData.issues.push({
                        type: 'searchBox',
                        severity: 'medium',
                        message: '検索ボックスの適切なコンテナが特定できません',
                        details: {
                            totalLevels: searchElements.length,
                            suggestion: '検出ロジックの見直しが必要'
                        }
                    });
                }
            }
        }

        /**
         * すべての診断を実行
         */
        runDiagnostics() {
            console.log('X/Twitter UI 診断ツールを開始します...');
            
            this.investigateTimelineWidth();
            this.investigatePremiumSubscribe();
            this.investigateSearchBox();

            // 基本的なページ構造の情報を収集
            this.diagnosticData.elements.pageStructure = {
                leftSidebar: this.collectElementInfo('header[role="banner"]', '左サイドバー'),
                rightSidebar: this.collectElementInfo('[data-testid="sidebarColumn"]', '右サイドバー'),
                mainContent: this.collectElementInfo('[data-testid="primaryColumn"]', 'メインコンテンツ')
            };

            console.log('診断完了！');
            console.log(`検出された問題: ${this.diagnosticData.issues.length}件`);
            
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
            link.download = `x-ui-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('診断結果をダウンロードしました');
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    console.log('%c🔍 X/Twitter UI 診断ツール', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
    console.log('%c診断を開始します...', 'font-size: 14px; color: #657786;');
    console.log('');
    
    const diagnostic = new XUIDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 📊 診断結果 ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    console.log(results);
    
    console.log('');
    console.log('%c=== 🔍 検出された問題 ===', 'font-size: 16px; font-weight: bold; color: #f4212e;');
    if (results.issues.length > 0) {
        results.issues.forEach((issue, index) => {
            const severityColors = {
                critical: '#f4212e',
                high: '#ff6b35',
                medium: '#ffb700',
                low: '#657786'
            };
            const color = severityColors[issue.severity] || '#657786';
            
            console.log(`%c${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`, `color: ${color}; font-weight: bold;`);
            if (issue.details) {
                console.log('   詳細:', issue.details);
            }
        });
    } else {
        console.log('%c✅ 問題は検出されませんでした', 'color: #00ba7c; font-weight: bold;');
    }
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
    
    console.log('');
    console.log('%c📝 使い方:', 'font-size: 14px; font-weight: bold;');
    console.log('1. ダウンロードされたJSONファイルを確認してください');
    console.log('2. JSONファイルを開発者に共有してください');
    console.log('3. 結果を再度確認したい場合は、上記のログを参照してください');
    
    // グローバルに公開（再実行用）
    window.runXUIDiagnostic = function() {
        const diag = new XUIDiagnostic();
        const res = diag.runDiagnostics();
        console.log(res);
        diag.downloadResults();
        return res;
    };
    
    console.log('');
    console.log('%c💡 ヒント: 診断を再実行するには、コンソールで runXUIDiagnostic() を実行してください', 'color: #657786; font-style: italic;');
})();

