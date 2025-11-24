/**
 * X/Twitter UI 診断ツール - 検索バー & プレミアムサブスクライブ検出版
 * 
 * 目的: 
 * 「プレミアムにサブスクライブ」を非表示にすると検索バーも巻き込まれて
 * 非表示になる問題を調査するための診断ツール
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) のホームタイムラインを開く
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 3.0.0 (SearchBox & PremiumSubscribe detection)
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
                targetElements: {
                    searchBox: null,
                    premiumSubscribe: null
                },
                rightSidebarStructure: null,
                relationshipAnalysis: null,
                detectionSummary: {
                    searchBoxFound: false,
                    premiumSubscribeFound: false,
                    sharesCommonAncestor: false,
                    commonAncestorLevel: null
                }
            };
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
        collectElementDetails(element, label) {
            if (!element) return null;

            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            
            return {
                label,
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                attributes: this.getElementAttributes(element),
                textContent: element.textContent?.trim().substring(0, 300),
                rect: {
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyle: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    border: computedStyle.border,
                    borderRadius: computedStyle.borderRadius,
                    backgroundColor: computedStyle.backgroundColor
                },
                hierarchy: this.getElementHierarchy(element, 15)
            };
        }

        /**
         * 要素の階層構造を取得（より詳細に）
         */
        getElementHierarchy(element, depth) {
            const hierarchy = [];
            let current = element;

            for (let i = 0; i < depth && current; i++) {
                const computedStyle = window.getComputedStyle(current);
                const rect = current.getBoundingClientRect();
                
                hierarchy.push({
                    level: i,
                    tagName: current.tagName,
                    className: current.className,
                    id: current.id,
                    dataTestId: current.getAttribute('data-testid'),
                    attributes: this.getElementAttributes(current),
                    rect: {
                        top: Math.round(rect.top),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    computedStyle: {
                        display: computedStyle.display,
                        position: computedStyle.position,
                        border: computedStyle.border,
                        borderRadius: computedStyle.borderRadius,
                        backgroundColor: computedStyle.backgroundColor
                    },
                    childCount: current.children.length,
                    textPreview: current.textContent?.trim().substring(0, 100)
                });
                current = current.parentElement;
            }

            return hierarchy;
        }

        /**
         * 右サイドバーの構造を分析
         */
        analyzeRightSidebar() {
            console.log('=== 右サイドバーの構造分析 ===');
            
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) {
                console.warn('❌ 右サイドバー [data-testid="sidebarColumn"] が見つかりません');
                return null;
            }

            // 直接の子要素を分析
            const directChildren = Array.from(sidebar.children);
            const structure = {
                sidebarFound: true,
                dataTestId: sidebar.getAttribute('data-testid'),
                className: sidebar.className,
                directChildrenCount: directChildren.length,
                directChildren: directChildren.map((child, index) => {
                    const rect = child.getBoundingClientRect();
                    const style = window.getComputedStyle(child);
                    return {
                        index,
                        tagName: child.tagName,
                        className: child.className,
                        dataTestId: child.getAttribute('data-testid'),
                        textPreview: child.textContent?.trim().substring(0, 200),
                        rect: {
                            top: Math.round(rect.top),
                            height: Math.round(rect.height)
                        },
                        style: {
                            display: style.display,
                            border: style.border,
                            borderRadius: style.borderRadius
                        }
                    };
                }),
                // ボーダー付きセクションを特定
                borderedSections: this.findBorderedSections(sidebar)
            };

            this.diagnosticData.rightSidebarStructure = structure;
            console.log(`✅ 右サイドバー分析完了: 直接の子要素数 ${structure.directChildrenCount}`);
            return structure;
        }

        /**
         * ボーダー付きセクションを検索
         */
        findBorderedSections(sidebar) {
            const sections = [];
            const allDivs = Array.from(sidebar.querySelectorAll('div, section, aside'));
            
            for (const elem of allDivs) {
                const style = window.getComputedStyle(elem);
                const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                const hasBorder = borderMatch && parseFloat(borderMatch[1]) > 0;
                const hasRadius = style.borderRadius !== '0px';
                
                if (hasBorder && hasRadius) {
                    const rect = elem.getBoundingClientRect();
                    sections.push({
                        tagName: elem.tagName,
                        className: elem.className,
                        dataTestId: elem.getAttribute('data-testid'),
                        textPreview: elem.textContent?.trim().substring(0, 150),
                        border: style.border,
                        borderRadius: style.borderRadius,
                        rect: {
                            top: Math.round(rect.top),
                            height: Math.round(rect.height)
                        },
                        // 検索バーを含むか？
                        containsSearchInput: !!elem.querySelector('[data-testid="SearchBox_Search_Input"]'),
                        // プレミアムテキストを含むか？
                        containsPremiumText: (elem.textContent || '').includes('プレミアムにサブスクライブ') || 
                                            (elem.textContent || '').includes('Subscribe to Premium')
                    });
                }
            }

            return sections;
        }

        /**
         * 検索バー要素を検出（twitter-clean-uiと同じロジック）
         */
        detectSearchBox() {
            console.log('=== 検索バー要素の検出 ===');
            
            const searchInput = document.querySelector('[data-testid="SearchBox_Search_Input"]');
            if (!searchInput) {
                console.warn('❌ 検索入力 [data-testid="SearchBox_Search_Input"] が見つかりません');
                this.diagnosticData.detectionSummary.searchBoxFound = false;
                return null;
            }

            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) {
                console.warn('❌ 右サイドバーが見つかりません');
                return null;
            }

            // twitter-clean-uiと同じ検出ロジックを再現
            let container = searchInput;
            let detectedContainer = null;
            let detectionMethod = 'fallback';

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
                if ((hasBackground || hasBorder) && hasRoundedCorners) {
                    // さらに1階層上のコンテナがあればそれを返す（余白を含むため）
                    if (container.parentElement && 
                        sidebar.contains(container.parentElement) && 
                        container.parentElement !== sidebar) {
                        detectedContainer = container.parentElement;
                        detectionMethod = 'background/border + parent';
                    } else {
                        detectedContainer = container;
                        detectionMethod = 'background/border';
                    }
                    break;
                }
            }
            
            // 見つからない場合は5階層上を返す（フォールバック）
            if (!detectedContainer) {
                let fallback = searchInput;
                for (let i = 0; i < 5; i++) {
                    if (!fallback.parentElement) break;
                    if (fallback.parentElement === sidebar) break;
                    fallback = fallback.parentElement;
                }
                detectedContainer = fallback;
                detectionMethod = 'fallback (5 levels up)';
            }

            const details = this.collectElementDetails(detectedContainer, 'SearchBox Container');
            details.detectionMethod = detectionMethod;
            details.searchInputElement = {
                tagName: searchInput.tagName,
                dataTestId: searchInput.getAttribute('data-testid'),
                className: searchInput.className
            };
            
            this.diagnosticData.targetElements.searchBox = details;
            this.diagnosticData.detectionSummary.searchBoxFound = true;
            
            console.log(`✅ 検索バーコンテナを検出: ${detectionMethod}`);
            console.log(`   レベル: ${details.hierarchy[0]?.level}`);
            console.log(`   タグ: ${detectedContainer.tagName}`);
            console.log(`   クラス: ${detectedContainer.className?.substring(0, 50)}`);
            
            return detectedContainer;
        }

        /**
         * プレミアムサブスクライブ要素を検出（twitter-clean-uiと同じロジック）
         */
        detectPremiumSubscribe() {
            console.log('=== プレミアムサブスクライブ要素の検出 ===');
            
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            if (!sidebar) {
                console.warn('❌ 右サイドバーが見つかりません');
                return null;
            }

            // twitter-clean-uiと同じ検出ロジックを再現
            const allDivs = Array.from(sidebar.querySelectorAll('div, section, aside'));
            let detectedElement = null;
            let detectionMethod = 'not found';
            let matchedText = '';

            for (const elem of allDivs) {
                const text = elem.textContent || '';
                // テキスト長が短い要素のみを対象（親要素を誤検出しないため）
                if (text.length > 1000) continue;
                
                if (
                    text.includes('プレミアムにサブスクライブ') ||
                    text.includes('Subscribe to Premium')
                ) {
                    matchedText = text.includes('プレミアムにサブスクライブ') ? 'プレミアムにサブスクライブ' : 'Subscribe to Premium';
                    
                    // ボーダーを持つ親要素を探す（最大3階層、sidebarColumnを超えない）
                    let current = elem;
                    let foundBorderedParent = false;
                    
                    for (let i = 0; i < 3; i++) {
                        if (!current.parentElement) break;
                        // sidebarColumnを超えて遡らない
                        if (current.parentElement === sidebar || !sidebar.contains(current.parentElement)) {
                            break;
                        }
                        
                        const style = window.getComputedStyle(current.parentElement);
                        // 1px以上のボーダーとborderRadiusを持つ要素を探す
                        const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                        if (borderMatch && parseFloat(borderMatch[1]) > 0 && style.borderRadius !== '0px') {
                            detectedElement = current.parentElement;
                            detectionMethod = `bordered parent (level ${i + 1})`;
                            foundBorderedParent = true;
                            break;
                        }
                        current = current.parentElement;
                    }
                    
                    // ボーダー付きコンテナが見つからない場合は1階層上のみ
                    if (!foundBorderedParent) {
                        if (elem.parentElement && sidebar.contains(elem.parentElement)) {
                            detectedElement = elem.parentElement;
                            detectionMethod = 'direct parent (no border)';
                        } else {
                            detectedElement = elem;
                            detectionMethod = 'element itself';
                        }
                    }
                    break;
                }
            }

            if (!detectedElement) {
                console.warn('❌ プレミアムサブスクライブ要素が見つかりません');
                this.diagnosticData.detectionSummary.premiumSubscribeFound = false;
                return null;
            }

            const details = this.collectElementDetails(detectedElement, 'PremiumSubscribe Container');
            details.detectionMethod = detectionMethod;
            details.matchedText = matchedText;
            
            this.diagnosticData.targetElements.premiumSubscribe = details;
            this.diagnosticData.detectionSummary.premiumSubscribeFound = true;
            
            console.log(`✅ プレミアムサブスクライブを検出: ${detectionMethod}`);
            console.log(`   マッチテキスト: ${matchedText}`);
            console.log(`   タグ: ${detectedElement.tagName}`);
            console.log(`   クラス: ${detectedElement.className?.substring(0, 50)}`);
            
            return detectedElement;
        }

        /**
         * 2つの要素の関係性を分析
         */
        analyzeRelationship(searchBoxContainer, premiumContainer) {
            console.log('=== 要素間の関係性分析 ===');
            
            if (!searchBoxContainer || !premiumContainer) {
                console.warn('❌ 両方の要素が必要です');
                return null;
            }

            // 共通の祖先を探す
            const searchBoxAncestors = [];
            let current = searchBoxContainer;
            while (current) {
                searchBoxAncestors.push(current);
                current = current.parentElement;
            }

            let commonAncestor = null;
            let commonAncestorLevelFromPremium = -1;
            current = premiumContainer;
            let level = 0;
            while (current) {
                const index = searchBoxAncestors.indexOf(current);
                if (index !== -1) {
                    commonAncestor = current;
                    commonAncestorLevelFromPremium = level;
                    break;
                }
                current = current.parentElement;
                level++;
            }

            // 検索ボックスからの共通祖先までのレベル
            const commonAncestorLevelFromSearchBox = searchBoxAncestors.indexOf(commonAncestor);

            // 親子関係をチェック
            const searchBoxContainsPremium = searchBoxContainer.contains(premiumContainer);
            const premiumContainsSearchBox = premiumContainer.contains(searchBoxContainer);
            const isSameElement = searchBoxContainer === premiumContainer;

            const analysis = {
                isSameElement,
                searchBoxContainsPremium,
                premiumContainsSearchBox,
                commonAncestor: commonAncestor ? {
                    tagName: commonAncestor.tagName,
                    className: commonAncestor.className,
                    dataTestId: commonAncestor.getAttribute('data-testid'),
                    levelFromSearchBox: commonAncestorLevelFromSearchBox,
                    levelFromPremium: commonAncestorLevelFromPremium
                } : null,
                // 問題の診断
                potentialIssue: null
            };

            // 問題を診断
            if (isSameElement) {
                analysis.potentialIssue = '❌ 致命的: 検索バーとプレミアムが同じ要素として検出されています！';
            } else if (searchBoxContainsPremium) {
                analysis.potentialIssue = '❌ 問題: 検索バーコンテナがプレミアムを含んでいます。検索バーの検出範囲が広すぎます。';
            } else if (premiumContainsSearchBox) {
                analysis.potentialIssue = '❌ 問題: プレミアムコンテナが検索バーを含んでいます。プレミアムの検出範囲が広すぎます。';
            } else if (commonAncestorLevelFromSearchBox <= 2 || commonAncestorLevelFromPremium <= 2) {
                analysis.potentialIssue = '⚠️ 警告: 共通祖先が近いです。非表示にすると影響が出る可能性があります。';
            } else {
                analysis.potentialIssue = '✅ OK: 要素は独立しているようです。';
            }

            this.diagnosticData.relationshipAnalysis = analysis;
            this.diagnosticData.detectionSummary.sharesCommonAncestor = commonAncestor !== null;
            this.diagnosticData.detectionSummary.commonAncestorLevel = {
                fromSearchBox: commonAncestorLevelFromSearchBox,
                fromPremium: commonAncestorLevelFromPremium
            };

            console.log(`同一要素: ${isSameElement}`);
            console.log(`検索バーがプレミアムを含む: ${searchBoxContainsPremium}`);
            console.log(`プレミアムが検索バーを含む: ${premiumContainsSearchBox}`);
            if (commonAncestor) {
                console.log(`共通祖先: ${commonAncestor.tagName} (検索バーから${commonAncestorLevelFromSearchBox}階層, プレミアムから${commonAncestorLevelFromPremium}階層)`);
            }
            console.log(`診断: ${analysis.potentialIssue}`);

            return analysis;
        }

        /**
         * すべての診断を実行
         */
        runDiagnostics() {
            console.log('X/Twitter UI 診断ツール（SearchBox & PremiumSubscribe検出版）を開始します...');
            console.log('');
            
            // 右サイドバーの構造分析
            this.analyzeRightSidebar();
            console.log('');
            
            // 検索バー要素の検出
            const searchBoxContainer = this.detectSearchBox();
            console.log('');
            
            // プレミアムサブスクライブ要素の検出
            const premiumContainer = this.detectPremiumSubscribe();
            console.log('');

            // 関係性分析
            this.analyzeRelationship(searchBoxContainer, premiumContainer);
            console.log('');

            console.log('=== 診断完了！ ===');
            console.log(`検索バー検出: ${this.diagnosticData.detectionSummary.searchBoxFound ? '✅ 成功' : '❌ 失敗'}`);
            console.log(`プレミアム検出: ${this.diagnosticData.detectionSummary.premiumSubscribeFound ? '✅ 成功' : '❌ 失敗'}`);
            
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
            link.download = `x-ui-diagnostic-searchbox-premium-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('診断結果をダウンロードしました');
        }

        /**
         * 視覚的にハイライト表示
         */
        highlightElements(searchBoxContainer, premiumContainer) {
            if (searchBoxContainer) {
                searchBoxContainer.style.outline = '3px solid blue';
                searchBoxContainer.style.outlineOffset = '2px';
                console.log('%c🔵 検索バーコンテナを青でハイライト', 'color: blue; font-weight: bold;');
            }
            if (premiumContainer) {
                premiumContainer.style.outline = '3px solid red';
                premiumContainer.style.outlineOffset = '2px';
                console.log('%c🔴 プレミアムコンテナを赤でハイライト', 'color: red; font-weight: bold;');
            }
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    console.log('%c🔍 X/Twitter UI 診断ツール - SearchBox & PremiumSubscribe 検出版', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
    console.log('%c右サイドバーの「検索バー」と「プレミアムにサブスクライブ」要素の関係を調査します', 'font-size: 14px; color: #657786;');
    console.log('');
    
    const diagnostic = new XUIDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 📊 検出結果サマリー ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    console.log(`検索バー検出: ${results.detectionSummary.searchBoxFound ? '%c✅ 成功' : '%c❌ 失敗'}`, 
                results.detectionSummary.searchBoxFound ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    console.log(`プレミアム検出: ${results.detectionSummary.premiumSubscribeFound ? '%c✅ 成功' : '%c❌ 失敗'}`,
                results.detectionSummary.premiumSubscribeFound ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    
    console.log('');
    console.log('%c=== 🔍 関係性分析 ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    if (results.relationshipAnalysis) {
        console.log(`同一要素: ${results.relationshipAnalysis.isSameElement}`);
        console.log(`検索バーがプレミアムを含む: ${results.relationshipAnalysis.searchBoxContainsPremium}`);
        console.log(`プレミアムが検索バーを含む: ${results.relationshipAnalysis.premiumContainsSearchBox}`);
        if (results.relationshipAnalysis.commonAncestor) {
            console.log(`共通祖先: ${results.relationshipAnalysis.commonAncestor.tagName}`);
            console.log(`  - 検索バーから: ${results.relationshipAnalysis.commonAncestor.levelFromSearchBox}階層`);
            console.log(`  - プレミアムから: ${results.relationshipAnalysis.commonAncestor.levelFromPremium}階層`);
        }
        console.log(`%c診断: ${results.relationshipAnalysis.potentialIssue}`, 
                    results.relationshipAnalysis.potentialIssue.startsWith('✅') ? 'color: #00ba7c; font-weight: bold;' : 
                    results.relationshipAnalysis.potentialIssue.startsWith('⚠️') ? 'color: #f4a200; font-weight: bold;' : 
                    'color: #f4212e; font-weight: bold;');
    }
    
    console.log('');
    console.log('%c=== 🎨 視覚的ハイライト ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    
    // 再検出して視覚化
    const searchBoxForHighlight = document.querySelector('[data-testid="SearchBox_Search_Input"]');
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    
    let searchBoxContainer = null;
    if (searchBoxForHighlight && sidebar) {
        let container = searchBoxForHighlight;
        for (let i = 0; i < 8; i++) {
            if (!container.parentElement) break;
            container = container.parentElement;
            if (container === sidebar) break;
            if (!sidebar.contains(container)) break;
            const style = window.getComputedStyle(container);
            const hasBackground = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
            const hasBorder = style.border !== '' && style.border !== '0px none rgb(0, 0, 0)';
            const hasRoundedCorners = style.borderRadius !== '0px';
            if ((hasBackground || hasBorder) && hasRoundedCorners) {
                if (container.parentElement && sidebar.contains(container.parentElement) && container.parentElement !== sidebar) {
                    searchBoxContainer = container.parentElement;
                } else {
                    searchBoxContainer = container;
                }
                break;
            }
        }
        if (!searchBoxContainer) {
            let fallback = searchBoxForHighlight;
            for (let i = 0; i < 5; i++) {
                if (!fallback.parentElement) break;
                if (fallback.parentElement === sidebar) break;
                fallback = fallback.parentElement;
            }
            searchBoxContainer = fallback;
        }
    }

    let premiumContainer = null;
    if (sidebar) {
        const allDivs = Array.from(sidebar.querySelectorAll('div, section, aside'));
        for (const elem of allDivs) {
            const text = elem.textContent || '';
            if (text.length > 1000) continue;
            if (text.includes('プレミアムにサブスクライブ') || text.includes('Subscribe to Premium')) {
                let current = elem;
                for (let i = 0; i < 3; i++) {
                    if (!current.parentElement) break;
                    if (current.parentElement === sidebar || !sidebar.contains(current.parentElement)) break;
                    const style = window.getComputedStyle(current.parentElement);
                    const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                    if (borderMatch && parseFloat(borderMatch[1]) > 0 && style.borderRadius !== '0px') {
                        premiumContainer = current.parentElement;
                        break;
                    }
                    current = current.parentElement;
                }
                if (!premiumContainer) {
                    if (elem.parentElement && sidebar.contains(elem.parentElement)) {
                        premiumContainer = elem.parentElement;
                    } else {
                        premiumContainer = elem;
                    }
                }
                break;
            }
        }
    }

    diagnostic.highlightElements(searchBoxContainer, premiumContainer);
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
    
    console.log('');
    console.log('%c📝 次のステップ:', 'font-size: 14px; font-weight: bold;');
    console.log('1. ページ上の青枠（検索バー）と赤枠（プレミアム）を確認してください');
    console.log('2. 枠が重なっていたり、一方が他方を含んでいる場合は問題があります');
    console.log('3. ダウンロードされたJSONファイルを開発者に共有してください');
    
    console.log('');
    console.log('%c=== 🔧 完全な診断データ ===', 'font-size: 14px; font-weight: bold; color: #657786;');
    console.log(results);
    
    // グローバルに公開（再実行用）
    window.runXUIDiagnostic = function() {
        const diag = new XUIDiagnostic();
        const res = diag.runDiagnostics();
        console.log(res);
        diag.downloadResults();
        return res;
    };
    
    // ハイライト解除関数
    window.clearXUIHighlight = function() {
        if (searchBoxContainer) searchBoxContainer.style.outline = '';
        if (premiumContainer) premiumContainer.style.outline = '';
        console.log('ハイライトを解除しました');
    };
    
    console.log('');
    console.log('%c💡 ヒント:', 'color: #657786; font-style: italic;');
    console.log('  - 診断を再実行: runXUIDiagnostic()');
    console.log('  - ハイライト解除: clearXUIHighlight()');
})();
