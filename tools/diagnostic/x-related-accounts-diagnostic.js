/**
 * X/Twitter 関連性の高いアカウント 診断ツール
 * 
 * 目的: 
 * ツイート詳細ページに表示される「関連性の高いアカウント」セクションを
 * 検出して構造を調査するための診断ツール
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) のツイート詳細ページを開く
 *    例: https://x.com/username/status/1234567890
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 1.0.0 (RelatedAccounts detection)
 */

(function() {
    'use strict';

    /**
     * 診断データ収集クラス
     */
    class XRelatedAccountsDiagnostic {
        constructor() {
            this.diagnosticData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                pageType: this.detectPageType(),
                targetElements: {
                    relatedAccounts: null,
                    candidates: []
                },
                sidebarStructure: null,
                mainContentStructure: null,
                detectionSummary: {
                    relatedAccountsFound: false,
                    detectionMethod: null,
                    candidatesCount: 0,
                    location: null // 'sidebar' or 'mainContent' or 'unknown'
                }
            };
        }

        /**
         * ページタイプを検出
         */
        detectPageType() {
            const url = window.location.href;
            const pathname = window.location.pathname;
            
            // ツイート詳細ページのパターン: /username/status/1234567890
            const isTweetDetailPage = /^\/[^/]+\/status\/\d+/.test(pathname);
            
            return {
                url,
                pathname,
                isTweetDetailPage,
                isValidForDiagnostic: isTweetDetailPage
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
                    height: Math.round(rect.height),
                    isVisible: rect.width > 0 && rect.height > 0
                },
                computedStyle: {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    border: computedStyle.border,
                    borderRadius: computedStyle.borderRadius,
                    backgroundColor: computedStyle.backgroundColor
                },
                hierarchy: this.getElementHierarchy(element, 15),
                innerStructure: this.analyzeInnerStructure(element)
            };
        }

        /**
         * 要素の階層構造を取得
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
                    ariaLabel: current.getAttribute('aria-label'),
                    role: current.getAttribute('role'),
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
         * 要素の内部構造を分析
         */
        analyzeInnerStructure(element) {
            if (!element) return null;

            const structure = {
                directChildrenCount: element.children.length,
                hasLinks: element.querySelectorAll('a').length,
                hasImages: element.querySelectorAll('img').length,
                hasButtons: element.querySelectorAll('button').length,
                headingText: null,
                accountElements: []
            };

            // 見出しテキストを探す
            const headings = Array.from(element.querySelectorAll('h2, h3, span[role="heading"]'));
            if (headings.length > 0) {
                structure.headingText = headings[0].textContent?.trim();
            }

            // アカウント要素（@username）を探す
            const allText = element.textContent || '';
            const accountMatches = allText.match(/@[\w]+/g);
            if (accountMatches) {
                structure.accountElements = accountMatches;
            }

            // リンク要素の詳細
            const links = Array.from(element.querySelectorAll('a'));
            structure.linkDetails = links.slice(0, 5).map(link => ({
                href: link.getAttribute('href'),
                textContent: link.textContent?.trim().substring(0, 50),
                ariaLabel: link.getAttribute('aria-label')
            }));

            return structure;
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
                })
            };

            this.diagnosticData.sidebarStructure = structure;
            console.log(`✅ 右サイドバー分析完了: 直接の子要素数 ${structure.directChildrenCount}`);
            return structure;
        }

        /**
         * メインコンテンツエリアの構造を分析
         */
        analyzeMainContent() {
            console.log('=== メインコンテンツエリアの構造分析 ===');
            
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            if (!primaryColumn) {
                console.warn('❌ メインコンテンツ [data-testid="primaryColumn"] が見つかりません');
                return null;
            }

            const directChildren = Array.from(primaryColumn.children);
            const structure = {
                primaryColumnFound: true,
                dataTestId: primaryColumn.getAttribute('data-testid'),
                className: primaryColumn.className,
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
                            height: Math.round(rect.height),
                            isVisible: rect.width > 0 && rect.height > 0
                        },
                        style: {
                            display: style.display,
                            border: style.border,
                            borderRadius: style.borderRadius
                        }
                    };
                })
            };

            this.diagnosticData.mainContentStructure = structure;
            console.log(`✅ メインコンテンツ分析完了: 直接の子要素数 ${structure.directChildrenCount}`);
            return structure;
        }

        /**
         * 「関連性の高いアカウント」を検出
         */
        detectRelatedAccounts() {
            console.log('=== 関連性の高いアカウント要素の検出 ===');
            
            const candidates = [];
            const searchTexts = [
                '関連性の高いアカウント',
                'Relevant accounts',
                'Relevant people',
                '関連アカウント',
                'Who to follow',
                'おすすめユーザー'
            ];

            // すべてのdiv, section, asideを対象に検索
            const allContainers = Array.from(document.querySelectorAll('div, section, aside, article'));
            
            console.log(`検索対象: ${allContainers.length} 個のコンテナ`);

            for (const container of allContainers) {
                const textContent = container.textContent || '';
                
                // テキストが長すぎる場合はスキップ（親要素の可能性が高い）
                if (textContent.length > 3000) continue;
                
                // 検索テキストとのマッチング
                let matchedText = null;
                for (const searchText of searchTexts) {
                    if (textContent.includes(searchText)) {
                        matchedText = searchText;
                        break;
                    }
                }

                if (matchedText) {
                    // マッチした要素の詳細を収集
                    const rect = container.getBoundingClientRect();
                    
                    // ボーダー付きの親コンテナを探す
                    let borderedContainer = null;
                    let current = container;
                    
                    for (let i = 0; i < 5; i++) {
                        if (!current.parentElement) break;
                        
                        const style = window.getComputedStyle(current.parentElement);
                        const borderMatch = style.border.match(/^(\d+(?:\.\d+)?)px/);
                        const hasBorder = borderMatch && parseFloat(borderMatch[1]) > 0;
                        const hasRadius = style.borderRadius !== '0px';
                        
                        if (hasBorder && hasRadius) {
                            borderedContainer = current.parentElement;
                            break;
                        }
                        
                        current = current.parentElement;
                    }

                    const targetElement = borderedContainer || container;
                    const targetRect = targetElement.getBoundingClientRect();
                    
                    // 候補として記録
                    const candidate = {
                        matchedText,
                        element: targetElement,
                        usedBorderedParent: !!borderedContainer,
                        levelsUp: borderedContainer ? this.getParentLevels(container, borderedContainer) : 0,
                        rect: {
                            top: Math.round(targetRect.top),
                            left: Math.round(targetRect.left),
                            width: Math.round(targetRect.width),
                            height: Math.round(targetRect.height),
                            isVisible: targetRect.width > 0 && targetRect.height > 0
                        },
                        location: this.detectElementLocation(targetElement),
                        details: this.collectElementDetails(targetElement, `Candidate: ${matchedText}`)
                    };
                    
                    candidates.push(candidate);
                    console.log(`✅ 候補を発見: "${matchedText}" (位置: ${candidate.location})`);
                }
            }

            this.diagnosticData.targetElements.candidates = candidates.map(c => ({
                ...c,
                element: undefined // HTMLElement は JSON に含めない
            }));
            this.diagnosticData.detectionSummary.candidatesCount = candidates.length;

            if (candidates.length === 0) {
                console.warn('❌ 関連性の高いアカウント要素が見つかりません');
                this.diagnosticData.detectionSummary.relatedAccountsFound = false;
                return null;
            }

            // 最も確度の高い候補を選択（表示されている＋ボーダー付き）
            const bestCandidate = candidates.find(c => 
                c.rect.isVisible && c.usedBorderedParent
            ) || candidates.find(c => 
                c.rect.isVisible
            ) || candidates[0];

            this.diagnosticData.targetElements.relatedAccounts = {
                ...bestCandidate,
                element: undefined // HTMLElement は JSON に含めない
            };
            this.diagnosticData.detectionSummary.relatedAccountsFound = true;
            this.diagnosticData.detectionSummary.detectionMethod = bestCandidate.usedBorderedParent 
                ? 'bordered parent container' 
                : 'text matched container';
            this.diagnosticData.detectionSummary.location = bestCandidate.location;

            console.log(`✅ 最適な要素を選択: "${bestCandidate.matchedText}"`);
            console.log(`   位置: ${bestCandidate.location}`);
            console.log(`   表示: ${bestCandidate.rect.isVisible ? '✅' : '❌'}`);
            console.log(`   ボーダー付きコンテナ: ${bestCandidate.usedBorderedParent ? '✅' : '❌'}`);

            return bestCandidate;
        }

        /**
         * 要素の位置を検出（サイドバーorメインコンテンツ）
         */
        detectElementLocation(element) {
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');

            if (sidebar && sidebar.contains(element)) {
                return 'sidebar';
            } else if (primaryColumn && primaryColumn.contains(element)) {
                return 'mainContent';
            }
            return 'unknown';
        }

        /**
         * 親要素までのレベル数を取得
         */
        getParentLevels(child, parent) {
            let levels = 0;
            let current = child;
            while (current && current !== parent) {
                current = current.parentElement;
                levels++;
                if (levels > 20) break; // 無限ループ防止
            }
            return current === parent ? levels : -1;
        }

        /**
         * すべての診断を実行
         */
        runDiagnostics() {
            console.log('X/Twitter 関連性の高いアカウント 診断ツールを開始します...');
            console.log('');

            // ページタイプをチェック
            if (!this.diagnosticData.pageType.isTweetDetailPage) {
                console.warn('⚠️ ツイート詳細ページではありません');
                console.warn('   この診断はツイート詳細ページで実行してください');
                console.warn(`   現在のURL: ${window.location.href}`);
            }
            
            // 右サイドバーの構造分析
            this.analyzeRightSidebar();
            console.log('');

            // メインコンテンツの構造分析
            this.analyzeMainContent();
            console.log('');
            
            // 関連性の高いアカウント要素の検出
            const relatedAccountsElement = this.detectRelatedAccounts();
            console.log('');

            console.log('=== 診断完了！ ===');
            console.log(`ページタイプ: ${this.diagnosticData.pageType.isTweetDetailPage ? '✅ ツイート詳細ページ' : '❌ その他のページ'}`);
            console.log(`関連アカウント検出: ${this.diagnosticData.detectionSummary.relatedAccountsFound ? '✅ 成功' : '❌ 失敗'}`);
            console.log(`候補数: ${this.diagnosticData.detectionSummary.candidatesCount}`);
            
            return {
                diagnosticData: this.diagnosticData,
                highlightElement: relatedAccountsElement?.element || null
            };
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
            link.download = `x-related-accounts-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('診断結果をダウンロードしました');
        }

        /**
         * 視覚的にハイライト表示
         */
        highlightElement(element) {
            if (element) {
                element.style.outline = '3px solid #ff6b35';
                element.style.outlineOffset = '2px';
                element.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.5)';
                console.log('%c🟠 関連性の高いアカウント要素をオレンジでハイライト', 'color: #ff6b35; font-weight: bold;');
            }
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    console.log('%c🔍 X/Twitter 関連性の高いアカウント 診断ツール', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
    console.log('%cツイート詳細ページの「関連性の高いアカウント」セクションを調査します', 'font-size: 14px; color: #657786;');
    console.log('');
    
    const diagnostic = new XRelatedAccountsDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 📊 検出結果サマリー ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    console.log(`ページタイプ: ${results.diagnosticData.pageType.isTweetDetailPage ? '%c✅ ツイート詳細ページ' : '%c❌ その他のページ'}`, 
                results.diagnosticData.pageType.isTweetDetailPage ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    console.log(`関連アカウント検出: ${results.diagnosticData.detectionSummary.relatedAccountsFound ? '%c✅ 成功' : '%c❌ 失敗'}`,
                results.diagnosticData.detectionSummary.relatedAccountsFound ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    console.log(`候補数: ${results.diagnosticData.detectionSummary.candidatesCount}`);
    if (results.diagnosticData.detectionSummary.location) {
        const locationText = results.diagnosticData.detectionSummary.location === 'sidebar' ? 'サイドバー' : 
                            results.diagnosticData.detectionSummary.location === 'mainContent' ? 'メインコンテンツ' : '不明';
        console.log(`位置: ${locationText}`);
    }
    
    console.log('');
    console.log('%c=== 🎨 視覚的ハイライト ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    
    if (results.highlightElement) {
        diagnostic.highlightElement(results.highlightElement);
    } else {
        console.log('%c⚠️ ハイライト表示する要素が見つかりませんでした', 'color: #f4a200; font-weight: bold;');
    }
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
    
    console.log('');
    console.log('%c📝 次のステップ:', 'font-size: 14px; font-weight: bold;');
    console.log('1. ページ上のオレンジ枠で囲まれた要素を確認してください');
    console.log('2. 正しく「関連性の高いアカウント」セクションが検出されているか確認してください');
    console.log('3. ダウンロードされたJSONファイルを開発者に共有してください');
    
    console.log('');
    console.log('%c=== 🔧 完全な診断データ ===', 'font-size: 14px; font-weight: bold; color: #657786;');
    console.log(results.diagnosticData);
    
    // グローバルに公開（再実行用）
    window.runXRelatedAccountsDiagnostic = function() {
        const diag = new XRelatedAccountsDiagnostic();
        const res = diag.runDiagnostics();
        console.log(res.diagnosticData);
        diag.downloadResults();
        if (res.highlightElement) {
            diag.highlightElement(res.highlightElement);
        }
        return res;
    };
    
    // ハイライト解除関数
    window.clearXRelatedAccountsHighlight = function() {
        if (results.highlightElement) {
            results.highlightElement.style.outline = '';
            results.highlightElement.style.boxShadow = '';
            console.log('ハイライトを解除しました');
        }
    };
    
    console.log('');
    console.log('%c💡 ヒント:', 'color: #657786; font-style: italic;');
    console.log('  - 診断を再実行: runXRelatedAccountsDiagnostic()');
    console.log('  - ハイライト解除: clearXRelatedAccountsHighlight()');
})();

