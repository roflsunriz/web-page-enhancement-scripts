/**
 * X/Twitter UI 診断ツール - 左サイドバー「Grok」と「コミュニティ」要素検出版
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) を開く
 * 2. 開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 2.0.0 (Grok & Communities detection)
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
                    grok: null,
                    communities: null
                },
                leftSidebarStructure: null,
                detectionSummary: {
                    grokFound: false,
                    communitiesFound: false
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
        collectElementDetails(element, textKeyword) {
            if (!element) return null;

            const rect = element.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(element);
            
            return {
                textKeyword,
                textContent: element.textContent?.trim().substring(0, 200),
                tagName: element.tagName,
                className: element.className,
                id: element.id,
                attributes: this.getElementAttributes(element),
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
                hierarchy: this.getElementHierarchy(element, 8)
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
                hierarchy.push({
                    level: i,
                    tagName: current.tagName,
                    className: current.className,
                    id: current.id,
                    attributes: this.getElementAttributes(current),
                    computedStyle: {
                        display: computedStyle.display,
                        position: computedStyle.position
                    }
                });
                current = current.parentElement;
            }

            return hierarchy;
        }

        /**
         * 左サイドバーの構造を分析
         */
        analyzeLeftSidebar() {
            console.log('=== 左サイドバーの構造分析 ===');
            
            const leftSidebar = document.querySelector('header[role="banner"]');
            if (!leftSidebar) {
                console.warn('❌ 左サイドバーが見つかりません');
                return null;
            }

            const allLinks = Array.from(leftSidebar.querySelectorAll('a, button'));
            const structure = {
                totalElements: allLinks.length,
                elements: allLinks.map((elem, index) => {
                    const text = elem.textContent?.trim() || '';
                    const href = elem.getAttribute('href');
                    const ariaLabel = elem.getAttribute('aria-label');
                    const dataTestId = elem.getAttribute('data-testid');
                    
                    return {
                        index,
                        tagName: elem.tagName,
                        text: text.substring(0, 100),
                        href,
                        ariaLabel,
                        dataTestId,
                        className: elem.className
                    };
                })
            };

            this.diagnosticData.leftSidebarStructure = structure;
            console.log(`✅ 左サイドバー要素数: ${structure.totalElements}`);
            return structure;
        }

        /**
         * Grok要素を検出
         */
        detectGrok() {
            console.log('=== Grok要素の検出 ===');
            
            const leftSidebar = document.querySelector('header[role="banner"]');
            if (!leftSidebar) {
                console.warn('❌ 左サイドバーが見つかりません');
                return;
            }

            // テキストベースで探索
            const allElements = Array.from(leftSidebar.querySelectorAll('a, button, span, div'));
            const candidates = [];

            for (const elem of allElements) {
                const text = elem.textContent?.trim() || '';
                
                // 「Grok」を含む要素を検索（完全一致優先）
                if (text === 'Grok' || text.includes('Grok')) {
                    candidates.push({
                        element: elem,
                        textMatch: text,
                        matchType: text === 'Grok' ? 'exact' : 'partial'
                    });
                }
            }

            if (candidates.length === 0) {
                console.warn('❌ Grok要素が見つかりません');
                this.diagnosticData.detectionSummary.grokFound = false;
                return;
            }

            // 最も適切な候補を選択（完全一致を優先）
            const bestCandidate = candidates.find(c => c.matchType === 'exact') || candidates[0];
            const grokElement = bestCandidate.element;
            
            // リンク要素を探す（ボタンの親など）
            let linkElement = grokElement;
            if (grokElement.tagName !== 'A') {
                for (let i = 0; i < 5; i++) {
                    if (!linkElement.parentElement) break;
                    linkElement = linkElement.parentElement;
                    if (linkElement.tagName === 'A') break;
                }
            }

            this.diagnosticData.targetElements.grok = this.collectElementDetails(linkElement, 'Grok');
            this.diagnosticData.detectionSummary.grokFound = true;
            
            console.log(`✅ Grok要素を検出: ${bestCandidate.matchType}一致`);
            console.log(`   タグ: ${linkElement.tagName}`);
            console.log(`   href: ${linkElement.getAttribute('href')}`);
            console.log(`   data-testid: ${linkElement.getAttribute('data-testid')}`);
        }

        /**
         * コミュニティ要素を検出
         */
        detectCommunities() {
            console.log('=== コミュニティ要素の検出 ===');
            
            const leftSidebar = document.querySelector('header[role="banner"]');
            if (!leftSidebar) {
                console.warn('❌ 左サイドバーが見つかりません');
                return;
            }

            // テキストベースで探索（日本語と英語の両方）
            const allElements = Array.from(leftSidebar.querySelectorAll('a, button, span, div'));
            const candidates = [];

            for (const elem of allElements) {
                const text = elem.textContent?.trim() || '';
                
                // 「コミュニティ」または「Communities」を含む要素を検索
                if (text === 'コミュニティ' || text === 'Communities' || 
                    text.includes('コミュニティ') || text.includes('Communities')) {
                    candidates.push({
                        element: elem,
                        textMatch: text,
                        matchType: (text === 'コミュニティ' || text === 'Communities') ? 'exact' : 'partial'
                    });
                }
            }

            if (candidates.length === 0) {
                console.warn('❌ コミュニティ要素が見つかりません');
                this.diagnosticData.detectionSummary.communitiesFound = false;
                return;
            }

            // 最も適切な候補を選択（完全一致を優先）
            const bestCandidate = candidates.find(c => c.matchType === 'exact') || candidates[0];
            const communitiesElement = bestCandidate.element;
            
            // リンク要素を探す（ボタンの親など）
            let linkElement = communitiesElement;
            if (communitiesElement.tagName !== 'A') {
                for (let i = 0; i < 5; i++) {
                    if (!linkElement.parentElement) break;
                    linkElement = linkElement.parentElement;
                    if (linkElement.tagName === 'A') break;
                }
            }

            this.diagnosticData.targetElements.communities = this.collectElementDetails(linkElement, 'コミュニティ/Communities');
            this.diagnosticData.detectionSummary.communitiesFound = true;
            
            console.log(`✅ コミュニティ要素を検出: ${bestCandidate.matchType}一致`);
            console.log(`   タグ: ${linkElement.tagName}`);
            console.log(`   href: ${linkElement.getAttribute('href')}`);
            console.log(`   data-testid: ${linkElement.getAttribute('data-testid')}`);
        }

        /**
         * すべての診断を実行
         */
        runDiagnostics() {
            console.log('X/Twitter UI 診断ツール（Grok & Communities検出版）を開始します...');
            console.log('');
            
            // 左サイドバーの構造分析
            this.analyzeLeftSidebar();
            console.log('');
            
            // Grok要素の検出
            this.detectGrok();
            console.log('');
            
            // コミュニティ要素の検出
            this.detectCommunities();
            console.log('');

            console.log('=== 診断完了！ ===');
            console.log(`Grok検出: ${this.diagnosticData.detectionSummary.grokFound ? '✅ 成功' : '❌ 失敗'}`);
            console.log(`コミュニティ検出: ${this.diagnosticData.detectionSummary.communitiesFound ? '✅ 成功' : '❌ 失敗'}`);
            
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
    
    console.log('%c🔍 X/Twitter UI 診断ツール - Grok & Communities 検出版', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
    console.log('%c左サイドバーの「Grok」と「コミュニティ」要素を検出します', 'font-size: 14px; color: #657786;');
    console.log('');
    
    const diagnostic = new XUIDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 📊 検出結果サマリー ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    console.log(`Grok検出: ${results.detectionSummary.grokFound ? '%c✅ 成功' : '%c❌ 失敗'}`, 
                results.detectionSummary.grokFound ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    console.log(`コミュニティ検出: ${results.detectionSummary.communitiesFound ? '%c✅ 成功' : '%c❌ 失敗'}`,
                results.detectionSummary.communitiesFound ? 'color: #00ba7c; font-weight: bold;' : 'color: #f4212e; font-weight: bold;');
    
    console.log('');
    console.log('%c=== 🔍 詳細結果 ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    
    if (results.targetElements.grok) {
        console.log('%c[Grok]', 'font-weight: bold; color: #1d9bf0;');
        console.log('  href:', results.targetElements.grok.attributes.href);
        console.log('  data-testid:', results.targetElements.grok.attributes['data-testid']);
        console.log('  className:', results.targetElements.grok.className);
    }
    
    if (results.targetElements.communities) {
        console.log('%c[コミュニティ]', 'font-weight: bold; color: #1d9bf0;');
        console.log('  href:', results.targetElements.communities.attributes.href);
        console.log('  data-testid:', results.targetElements.communities.attributes['data-testid']);
        console.log('  className:', results.targetElements.communities.className);
    }
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
    
    console.log('');
    console.log('%c📝 次のステップ:', 'font-size: 14px; font-weight: bold;');
    console.log('1. ダウンロードされたJSONファイルを確認してください');
    console.log('2. JSONファイルを開発者に共有してください');
    console.log('3. 特に targetElements.grok と targetElements.communities の情報が重要です');
    
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
    
    console.log('');
    console.log('%c💡 ヒント: 診断を再実行するには、コンソールで runXUIDiagnostic() を実行してください', 'color: #657786; font-style: italic;');
})();

