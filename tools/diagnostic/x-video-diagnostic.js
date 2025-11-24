/**
 * X/Twitter UI 診断ツール - 動画要素非表示問題調査版
 * 
 * 目的: 
 * twitter-clean-ui 使用中に動画要素が非表示になる問題を調査するための診断ツール
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) で動画ツイートを表示
 * 2. twitter-clean-uiを有効にした状態で開発者コンソール（F12）を開く
 * 3. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 4. 診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 1.0.0 (Video visibility diagnosis)
 */

(function() {
    'use strict';

    /**
     * 診断データ収集クラス
     */
    class XVideoDiagnostic {
        constructor() {
            this.diagnosticData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                twitterCleanUIStatus: {
                    styleElementFound: false,
                    hiddenElementsDetected: []
                },
                videoElements: [],
                hiddenAncestors: [],
                affectedVideos: [],
                summary: {
                    totalVideos: 0,
                    visibleVideos: 0,
                    hiddenVideos: 0,
                    hiddenByCleanUI: 0,
                    hiddenByOther: 0
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
         * 要素の可視性をチェック
         */
        getVisibilityInfo(element) {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            return {
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                isHidden: style.display === 'none' || 
                          style.visibility === 'hidden' || 
                          style.opacity === '0' ||
                          (rect.width === 0 && rect.height === 0),
                hiddenBy: style.display === 'none' ? 'display:none' :
                          style.visibility === 'hidden' ? 'visibility:hidden' :
                          style.opacity === '0' ? 'opacity:0' :
                          (rect.width === 0 && rect.height === 0) ? 'zero-dimensions' : null
            };
        }

        /**
         * 要素の階層構造を取得（非表示の祖先を検出）
         */
        getElementHierarchyWithVisibility(element, depth = 20) {
            const hierarchy = [];
            let current = element;
            let hiddenAncestor = null;
            let hiddenAtLevel = -1;

            for (let i = 0; i < depth && current; i++) {
                const visibility = this.getVisibilityInfo(current);
                const rect = current.getBoundingClientRect();
                
                const info = {
                    level: i,
                    tagName: current.tagName,
                    className: current.className?.substring?.(0, 100) || '',
                    id: current.id,
                    dataTestId: current.getAttribute('data-testid'),
                    role: current.getAttribute('role'),
                    ariaLabel: current.getAttribute('aria-label'),
                    visibility: visibility,
                    rect: {
                        top: Math.round(rect.top),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    // インラインスタイルを確認（twitter-clean-uiが設定するdisplay: none）
                    inlineStyle: current.style.cssText,
                    hasInlineDisplayNone: current.style.display === 'none'
                };
                
                hierarchy.push(info);

                // 最初の非表示の祖先を記録
                if (visibility.isHidden && hiddenAncestor === null) {
                    hiddenAncestor = info;
                    hiddenAtLevel = i;
                }

                current = current.parentElement;
            }

            return {
                hierarchy,
                hiddenAncestor,
                hiddenAtLevel
            };
        }

        /**
         * twitter-clean-uiのスタイル要素を検出
         */
        detectTwitterCleanUI() {
            console.log('=== twitter-clean-ui の状態確認 ===');
            
            const styleElement = document.getElementById('twitter-clean-ui-styles');
            this.diagnosticData.twitterCleanUIStatus.styleElementFound = !!styleElement;
            
            if (styleElement) {
                console.log('✅ twitter-clean-ui スタイル要素を検出');
                this.diagnosticData.twitterCleanUIStatus.styleContent = styleElement.textContent?.substring(0, 500);
            } else {
                console.log('❌ twitter-clean-ui スタイル要素が見つかりません');
            }

            // display: none !important が設定されている要素を検索
            const allElements = document.querySelectorAll('*');
            const hiddenElements = [];
            
            for (const elem of allElements) {
                if (elem.style.display === 'none') {
                    const info = {
                        tagName: elem.tagName,
                        className: elem.className?.substring?.(0, 80) || '',
                        id: elem.id,
                        dataTestId: elem.getAttribute('data-testid'),
                        textPreview: elem.textContent?.trim().substring(0, 100),
                        inlineStyle: elem.style.cssText
                    };
                    hiddenElements.push(info);
                }
            }
            
            this.diagnosticData.twitterCleanUIStatus.hiddenElementsDetected = hiddenElements;
            console.log(`📊 インラインで display:none が設定された要素: ${hiddenElements.length}個`);
            
            return hiddenElements;
        }

        /**
         * すべての動画要素を検出・分析
         */
        detectVideoElements() {
            console.log('=== 動画要素の検出 ===');
            
            const videos = document.querySelectorAll('video');
            console.log(`🎬 video 要素: ${videos.length}個`);
            
            this.diagnosticData.summary.totalVideos = videos.length;
            
            videos.forEach((video, index) => {
                const visibility = this.getVisibilityInfo(video);
                const hierarchyData = this.getElementHierarchyWithVisibility(video);
                const rect = video.getBoundingClientRect();
                
                const videoInfo = {
                    index,
                    src: video.src || video.currentSrc || '(no src)',
                    poster: video.poster || '(no poster)',
                    visibility: visibility,
                    rect: {
                        top: Math.round(rect.top),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    attributes: this.getElementAttributes(video),
                    hierarchy: hierarchyData.hierarchy,
                    hiddenAncestor: hierarchyData.hiddenAncestor,
                    hiddenAtLevel: hierarchyData.hiddenAtLevel
                };
                
                this.diagnosticData.videoElements.push(videoInfo);
                
                // 動画の可視性をカウント
                if (visibility.isHidden) {
                    this.diagnosticData.summary.hiddenVideos++;
                    console.log(`❌ Video ${index}: 非表示 (${visibility.hiddenBy})`);
                } else if (hierarchyData.hiddenAncestor) {
                    this.diagnosticData.summary.hiddenVideos++;
                    this.diagnosticData.affectedVideos.push({
                        videoIndex: index,
                        hiddenAncestor: hierarchyData.hiddenAncestor,
                        hiddenAtLevel: hierarchyData.hiddenAtLevel
                    });
                    
                    // twitter-clean-uiによる非表示かチェック
                    if (hierarchyData.hiddenAncestor.hasInlineDisplayNone) {
                        this.diagnosticData.summary.hiddenByCleanUI++;
                        console.log(`❌ Video ${index}: 祖先要素（レベル${hierarchyData.hiddenAtLevel}）がtwitter-clean-uiにより非表示`);
                    } else {
                        this.diagnosticData.summary.hiddenByOther++;
                        console.log(`⚠️ Video ${index}: 祖先要素（レベル${hierarchyData.hiddenAtLevel}）が非表示`);
                    }
                } else {
                    this.diagnosticData.summary.visibleVideos++;
                    console.log(`✅ Video ${index}: 表示中`);
                }
            });
            
            return videos;
        }

        /**
         * 主要なUI要素と動画の関係を分析
         */
        analyzeUIElementsAndVideos() {
            console.log('=== UI要素と動画の関係分析 ===');
            
            const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
            const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
            const timeline = document.querySelector('[aria-label="タイムライン: ホームタイムライン"], [aria-label="Timeline: Home timeline"]');
            
            const analysis = {
                sidebarFound: !!sidebar,
                primaryColumnFound: !!primaryColumn,
                timelineFound: !!timeline,
                videosInTimeline: [],
                videosInSidebar: [],
                videosElsewhere: []
            };
            
            const videos = document.querySelectorAll('video');
            videos.forEach((video, index) => {
                if (timeline?.contains(video)) {
                    analysis.videosInTimeline.push(index);
                } else if (sidebar?.contains(video)) {
                    analysis.videosInSidebar.push(index);
                } else if (primaryColumn?.contains(video)) {
                    analysis.videosInTimeline.push(index); // primaryColumn内の動画
                } else {
                    analysis.videosElsewhere.push(index);
                }
            });
            
            this.diagnosticData.uiAnalysis = analysis;
            
            console.log(`📍 タイムライン内の動画: ${analysis.videosInTimeline.length}個`);
            console.log(`📍 サイドバー内の動画: ${analysis.videosInSidebar.length}個`);
            console.log(`📍 その他の場所の動画: ${analysis.videosElsewhere.length}個`);
            
            return analysis;
        }

        /**
         * 特定の動画要素を詳細分析（デバッグ用）
         */
        analyzeSpecificVideo(videoIndex) {
            const videos = document.querySelectorAll('video');
            if (videoIndex >= videos.length) {
                console.error(`Video index ${videoIndex} is out of range (total: ${videos.length})`);
                return null;
            }
            
            const video = videos[videoIndex];
            const hierarchyData = this.getElementHierarchyWithVisibility(video, 30);
            
            console.log(`\n=== Video ${videoIndex} の詳細階層 ===`);
            hierarchyData.hierarchy.forEach((h, i) => {
                const hidden = h.visibility.isHidden ? '🔴' : '🟢';
                const inlineNone = h.hasInlineDisplayNone ? ' [INLINE display:none]' : '';
                console.log(`${hidden} ${i}: <${h.tagName}> ${h.dataTestId || h.className?.substring(0, 30) || ''}${inlineNone}`);
            });
            
            return hierarchyData;
        }

        /**
         * すべての診断を実行
         */
        runDiagnostics() {
            console.log('%c🎬 X/Twitter 動画要素診断ツール', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
            console.log('%ctwitter-clean-ui使用時の動画非表示問題を調査します', 'font-size: 14px; color: #657786;');
            console.log('');
            
            // twitter-clean-uiの状態確認
            this.detectTwitterCleanUI();
            console.log('');
            
            // 動画要素の検出
            this.detectVideoElements();
            console.log('');
            
            // UI要素と動画の関係分析
            this.analyzeUIElementsAndVideos();
            console.log('');
            
            console.log('=== 📊 診断結果サマリー ===');
            console.log(`総動画数: ${this.diagnosticData.summary.totalVideos}`);
            console.log(`表示中: ${this.diagnosticData.summary.visibleVideos}`);
            console.log(`非表示: ${this.diagnosticData.summary.hiddenVideos}`);
            console.log(`  - twitter-clean-uiによる非表示: ${this.diagnosticData.summary.hiddenByCleanUI}`);
            console.log(`  - その他の原因: ${this.diagnosticData.summary.hiddenByOther}`);
            
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
            link.download = `x-video-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('📥 診断結果をダウンロードしました');
        }

        /**
         * 影響を受けた動画の祖先をハイライト
         */
        highlightAffectedElements() {
            // 影響を受けた動画をハイライト
            const videos = document.querySelectorAll('video');
            this.diagnosticData.affectedVideos.forEach(affected => {
                const video = videos[affected.videoIndex];
                if (video) {
                    video.style.outline = '3px solid red';
                    video.style.outlineOffset = '2px';
                    
                    // 非表示の原因となっている祖先を特定
                    let current = video;
                    for (let i = 0; i < affected.hiddenAtLevel; i++) {
                        current = current.parentElement;
                    }
                    if (current) {
                        current.style.outline = '3px dashed orange';
                        current.style.outlineOffset = '4px';
                    }
                }
            });
            
            console.log('%c🔴 非表示の動画を赤でハイライト', 'color: red; font-weight: bold;');
            console.log('%c🟠 非表示の原因となる祖先要素をオレンジでハイライト', 'color: orange; font-weight: bold;');
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    const diagnostic = new XVideoDiagnostic();
    const results = diagnostic.runDiagnostics();
    
    console.log('');
    console.log('%c=== 🔍 問題特定のヒント ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    
    if (results.summary.hiddenByCleanUI > 0) {
        console.log('%c⚠️ twitter-clean-uiが動画を含む要素を非表示にしています！', 'color: #f4a200; font-weight: bold;');
        console.log('');
        console.log('影響を受けた動画:');
        results.affectedVideos.forEach(v => {
            if (v.hiddenAncestor?.hasInlineDisplayNone) {
                console.log(`  Video ${v.videoIndex}: レベル${v.hiddenAtLevel}の祖先が非表示`);
                console.log(`    祖先: <${v.hiddenAncestor.tagName}> data-testid="${v.hiddenAncestor.dataTestId || 'なし'}"`);
            }
        });
    } else if (results.summary.hiddenVideos > 0) {
        console.log('%c⚠️ 動画が非表示ですが、twitter-clean-ui以外が原因の可能性があります', 'color: #f4a200; font-weight: bold;');
    } else if (results.summary.totalVideos === 0) {
        console.log('%c📝 ページに動画要素が見つかりません。動画ツイートが表示されているページで実行してください。', 'color: #657786;');
    } else {
        console.log('%c✅ すべての動画が正常に表示されています', 'color: #00ba7c; font-weight: bold;');
    }
    
    console.log('');
    console.log('%c=== 💾 ファイルダウンロード ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
    diagnostic.downloadResults();
    
    console.log('');
    console.log('%c💡 追加のデバッグコマンド:', 'color: #657786; font-style: italic;');
    console.log('  - 診断を再実行: runVideoDiagnostic()');
    console.log('  - 特定の動画を詳細分析: analyzeVideo(インデックス番号)');
    console.log('  - 影響を受けた要素をハイライト: highlightAffected()');
    console.log('  - 完全な診断データを表示: showDiagnosticData()');
    
    // グローバルに公開
    window.runVideoDiagnostic = function() {
        const diag = new XVideoDiagnostic();
        const res = diag.runDiagnostics();
        diag.downloadResults();
        return res;
    };
    
    window.analyzeVideo = function(index) {
        const diag = new XVideoDiagnostic();
        return diag.analyzeSpecificVideo(index);
    };
    
    window.highlightAffected = function() {
        diagnostic.highlightAffectedElements();
    };
    
    window.showDiagnosticData = function() {
        console.log(results);
        return results;
    };
    
    // 診断データもグローバルに公開
    window._videoDiagnosticData = results;
})();

