/**
 * X/Twitter 右サイドバーチラつき診断ツール
 * 
 * 目的: 
 * twitter-clean-uiの右サイドバー要素が無駄にチラつく原因を調査するための診断ツール
 * 
 * 使用方法:
 * 1. X/Twitter (https://x.com または https://twitter.com) のホームタイムラインを開く
 * 2. twitter-clean-uiユーザースクリプトが動作していることを確認
 * 3. 開発者コンソール（F12）を開く
 * 4. このスクリプト全体をコピーしてコンソールに貼り付けて実行
 * 5. 30秒間監視後、診断結果が自動的にJSONファイルとしてダウンロードされます
 * 
 * バージョン: 1.0.0
 */

(function() {
    'use strict';

    /**
     * 診断データ収集クラス
     */
    class SidebarFlickerDiagnostic {
        constructor() {
            this.diagnosticData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                monitoringDuration: 30000, // 30秒
                events: [],
                sidebarStateChanges: [],
                mutationObserverEvents: [],
                applySettingsCalls: [],
                detectAllCalls: [],
                maskUnmaskEvents: [],
                rafEvents: [],
                debounceEvents: [],
                sidebarElement: null,
                sidebarInitialState: null,
                summary: {
                    totalEvents: 0,
                    mutationObserverCount: 0,
                    applySettingsCount: 0,
                    detectAllCount: 0,
                    maskCount: 0,
                    unmaskCount: 0,
                    rafCount: 0,
                    debounceCount: 0,
                    sidebarOpacityChanges: 0,
                    sidebarDisplayChanges: 0,
                    sidebarVisibilityChanges: 0
                }
            };

            this.startTime = Date.now();
            this.sidebarElement = null;
            this.lastSidebarState = null;
            this.originalMutationObserver = null;
            this.originalApplySettings = null;
            this.originalDetectAll = null;
            this.originalMaskSidebarColumn = null;
            this.originalUnmaskSidebarColumn = null;
            this.originalRequestAnimationFrame = null;
            this.originalSetTimeout = null;
            this.eventCounter = 0;
        }

        /**
         * スタックトレースを取得
         */
        getStackTrace() {
            const stack = new Error().stack;
            if (!stack) return null;
            
            // スタックトレースを解析（最初の3行はこの関数自身なので除外）
            const lines = stack.split('\n').slice(3, 8); // 最大5行まで
            return lines.map(line => line.trim()).filter(line => line.length > 0);
        }

        /**
         * イベントを記録
         */
        logEvent(type, details) {
            const now = Date.now();
            const elapsed = now - this.startTime;
            
            const event = {
                id: ++this.eventCounter,
                timestamp: now,
                elapsed: elapsed,
                type: type,
                details: details,
                stackTrace: this.getStackTrace()
            };

            this.diagnosticData.events.push(event);
            this.diagnosticData.summary.totalEvents++;

            // コンソールに出力（重要イベントのみ）
            if (type === 'mask' || type === 'unmask' || type === 'opacity-change') {
                console.log(`[${elapsed}ms] ${type}:`, details);
            }
        }

        /**
         * 右サイドバー要素を取得
         */
        getSidebarElement() {
            if (!this.sidebarElement || !document.contains(this.sidebarElement)) {
                this.sidebarElement = document.querySelector('[data-testid="sidebarColumn"]');
            }
            return this.sidebarElement;
        }

        /**
         * 右サイドバーの状態を取得
         */
        getSidebarState() {
            const sidebar = this.getSidebarElement();
            if (!sidebar) return null;

            const computedStyle = window.getComputedStyle(sidebar);
            const rect = sidebar.getBoundingClientRect();

            return {
                exists: true,
                opacity: computedStyle.opacity,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                inlineOpacity: sidebar.style.opacity || null,
                inlineDisplay: sidebar.style.display || null,
                rect: {
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                isVisible: rect.width > 0 && rect.height > 0 && computedStyle.opacity !== '0',
                childCount: sidebar.children.length
            };
        }

        /**
         * 右サイドバーの状態変化を監視
         */
        monitorSidebarState() {
            const currentState = this.getSidebarState();
            
            if (!currentState) {
                this.logEvent('sidebar-not-found', {});
                return;
            }

            if (this.lastSidebarState) {
                const changes = {};
                let hasChanges = false;

                if (currentState.opacity !== this.lastSidebarState.opacity) {
                    changes.opacity = {
                        from: this.lastSidebarState.opacity,
                        to: currentState.opacity
                    };
                    hasChanges = true;
                    this.diagnosticData.summary.sidebarOpacityChanges++;
                }

                if (currentState.display !== this.lastSidebarState.display) {
                    changes.display = {
                        from: this.lastSidebarState.display,
                        to: currentState.display
                    };
                    hasChanges = true;
                    this.diagnosticData.summary.sidebarDisplayChanges++;
                }

                if (currentState.visibility !== this.lastSidebarState.visibility) {
                    changes.visibility = {
                        from: this.lastSidebarState.visibility,
                        to: currentState.visibility
                    };
                    hasChanges = true;
                    this.diagnosticData.summary.sidebarVisibilityChanges++;
                }

                if (currentState.inlineOpacity !== this.lastSidebarState.inlineOpacity) {
                    changes.inlineOpacity = {
                        from: this.lastSidebarState.inlineOpacity,
                        to: currentState.inlineOpacity
                    };
                    hasChanges = true;
                }

                if (hasChanges) {
                    this.diagnosticData.sidebarStateChanges.push({
                        timestamp: Date.now(),
                        elapsed: Date.now() - this.startTime,
                        changes: changes,
                        state: currentState
                    });

                    this.logEvent('sidebar-state-change', {
                        changes: changes,
                        state: currentState
                    });
                }
            }

            this.lastSidebarState = currentState;
        }

        /**
         * twitter-clean-uiの関数をインターセプト
         */
        interceptTwitterCleanUI() {
            // グローバルオブジェクトからtwitter-clean-uiを取得
            const twitterCleanUI = window.twitterCleanUI;
            
            if (!twitterCleanUI) {
                console.warn('⚠️ twitter-clean-uiが見つかりません。ユーザースクリプトが読み込まれているか確認してください。');
                return false;
            }

            console.log('✅ twitter-clean-uiを検出しました。関数をインターセプトします...');

            // MutationObserverのコールバックをインターセプト
            // main.tsのstartMutationObserver内のコールバックを監視
            this.interceptMutationObserver();

            // applySettingsをインターセプト
            if (twitterCleanUI.controller && twitterCleanUI.controller.applySettings) {
                this.originalApplySettings = twitterCleanUI.controller.applySettings.bind(twitterCleanUI.controller);
                twitterCleanUI.controller.applySettings = (...args) => {
                    const now = Date.now();
                    const elapsed = now - this.startTime;
                    
                    this.diagnosticData.applySettingsCalls.push({
                        timestamp: now,
                        elapsed: elapsed,
                        args: args,
                        stackTrace: this.getStackTrace()
                    });
                    this.diagnosticData.summary.applySettingsCount++;

                    this.logEvent('apply-settings', {
                        elapsed: elapsed,
                        stackTrace: this.getStackTrace()
                    });

                    // サイドバーの状態を記録
                    setTimeout(() => {
                        this.monitorSidebarState();
                    }, 0);

                    return this.originalApplySettings(...args);
                };
            }

            // detectAllをインターセプト
            if (twitterCleanUI.detector && twitterCleanUI.detector.detectAll) {
                this.originalDetectAll = twitterCleanUI.detector.detectAll.bind(twitterCleanUI.detector);
                twitterCleanUI.detector.detectAll = (...args) => {
                    const now = Date.now();
                    const elapsed = now - this.startTime;
                    
                    this.diagnosticData.detectAllCalls.push({
                        timestamp: now,
                        elapsed: elapsed
                    });
                    this.diagnosticData.summary.detectAllCount++;

                    this.logEvent('detect-all', {
                        elapsed: elapsed
                    });

                    return this.originalDetectAll(...args);
                };
            }

            // maskSidebarColumnとunmaskSidebarColumnをインターセプト
            // これらはprivateメソッドなので、MutationObserverのコールバック内から呼ばれる
            // 代わりに、サイドバーのstyle属性の変更を直接監視する
            this.monitorSidebarStyleChanges();

            return true;
        }

        /**
         * サイドバーのstyle属性変更を監視
         */
        monitorSidebarStyleChanges() {
            const sidebar = this.getSidebarElement();
            if (!sidebar) {
                console.warn('⚠️ サイドバー要素が見つかりません。style変更の監視をスキップします。');
                return;
            }

            // MutationObserverでstyle属性の変更を監視
            const styleObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const now = Date.now();
                        const elapsed = now - this.startTime;
                        const currentState = this.getSidebarState();

                        // opacity変更を検出
                        if (this.lastSidebarState && 
                            currentState.inlineOpacity !== this.lastSidebarState.inlineOpacity) {
                            
                            const isMasking = currentState.inlineOpacity === '0';
                            const eventType = isMasking ? 'mask' : 'unmask';
                            
                            this.diagnosticData.maskUnmaskEvents.push({
                                timestamp: now,
                                elapsed: elapsed,
                                type: eventType,
                                opacity: currentState.inlineOpacity,
                                previousOpacity: this.lastSidebarState.inlineOpacity,
                                state: currentState,
                                stackTrace: this.getStackTrace()
                            });

                            if (isMasking) {
                                this.diagnosticData.summary.maskCount++;
                            } else {
                                this.diagnosticData.summary.unmaskCount++;
                            }

                            this.logEvent(eventType, {
                                elapsed: elapsed,
                                opacity: currentState.inlineOpacity,
                                previousOpacity: this.lastSidebarState.inlineOpacity
                            });
                        }

                        // その他のstyle変更も記録
                        this.logEvent('sidebar-style-change', {
                            elapsed: elapsed,
                            style: sidebar.style.cssText.substring(0, 200)
                        });
                    }
                });
            });

            styleObserver.observe(sidebar, {
                attributes: true,
                attributeFilter: ['style']
            });

            // 監視終了時にdisconnect
            setTimeout(() => {
                styleObserver.disconnect();
            }, this.diagnosticData.monitoringDuration);

            console.log('✅ サイドバーのstyle属性変更を監視開始');
        }

        /**
         * MutationObserverをインターセプト
         */
        interceptMutationObserver() {
            const originalMutationObserver = window.MutationObserver;
            const self = this;

            window.MutationObserver = function(callback) {
                const wrappedCallback = function(mutations, observer) {
                    const now = Date.now();
                    const elapsed = now - self.startTime;

                    // 右サイドバーに関連する変更をフィルタ
                    const sidebarMutations = mutations.filter(mutation => {
                        const target = mutation.target;
                        const sidebar = self.getSidebarElement();
                        if (!sidebar) return false;
                        return sidebar.contains(target) || target === sidebar || sidebar.contains(target.parentElement);
                    });

                    if (sidebarMutations.length > 0 || mutations.length > 0) {
                        self.diagnosticData.mutationObserverEvents.push({
                            timestamp: now,
                            elapsed: elapsed,
                            totalMutations: mutations.length,
                            sidebarMutations: sidebarMutations.length,
                            mutationTypes: mutations.map(m => m.type),
                            targetElements: mutations.map(m => ({
                                tagName: m.target.tagName,
                                dataTestId: m.target.getAttribute('data-testid'),
                                className: m.target.className?.substring(0, 50)
                            }))
                        });
                        self.diagnosticData.summary.mutationObserverCount++;

                        self.logEvent('mutation-observer', {
                            elapsed: elapsed,
                            totalMutations: mutations.length,
                            sidebarMutations: sidebarMutations.length
                        });

                        // サイドバーの状態を記録
                        setTimeout(() => {
                            self.monitorSidebarState();
                        }, 0);
                    }

                    return callback.call(this, mutations, observer);
                };

                return new originalMutationObserver(wrappedCallback);
            };

            // 元のプロトタイプを継承
            window.MutationObserver.prototype = originalMutationObserver.prototype;
        }

        /**
         * requestAnimationFrameをインターセプト
         */
        interceptRequestAnimationFrame() {
            const originalRAF = window.requestAnimationFrame;
            const self = this;

            window.requestAnimationFrame = function(callback) {
                const wrappedCallback = function(timestamp) {
                    const now = Date.now();
                    const elapsed = now - self.startTime;

                    // サイドバー関連のRAFかどうかを判定（完全には判定できないが、記録はする）
                    self.diagnosticData.rafEvents.push({
                        timestamp: now,
                        elapsed: elapsed
                    });
                    self.diagnosticData.summary.rafCount++;

                    return callback.call(this, timestamp);
                };

                return originalRAF.call(this, wrappedCallback);
            };
        }

        /**
         * setTimeoutをインターセプト（debounce用）
         */
        interceptSetTimeout() {
            const originalSetTimeout = window.setTimeout;
            const self = this;

            window.setTimeout = function(callback, delay, ...args) {
                // 500msのdebounceを検出
                if (delay === 500) {
                    const now = Date.now();
                    const elapsed = now - self.startTime;

                    self.diagnosticData.debounceEvents.push({
                        timestamp: now,
                        elapsed: elapsed,
                        delay: delay
                    });
                    self.diagnosticData.summary.debounceCount++;

                    self.logEvent('debounce-timeout', {
                        elapsed: elapsed,
                        delay: delay
                    });
                }

                return originalSetTimeout.call(this, callback, delay, ...args);
            };
        }

        /**
         * 初期状態を記録
         */
        recordInitialState() {
            const sidebar = this.getSidebarElement();
            if (sidebar) {
                this.diagnosticData.sidebarElement = {
                    tagName: sidebar.tagName,
                    className: sidebar.className,
                    dataTestId: sidebar.getAttribute('data-testid'),
                    id: sidebar.id,
                    childCount: sidebar.children.length
                };

                this.diagnosticData.sidebarInitialState = this.getSidebarState();
                this.lastSidebarState = this.diagnosticData.sidebarInitialState;
            }
        }

        /**
         * 監視を開始
         */
        startMonitoring() {
            console.log('🔍 右サイドバーのチラつき診断を開始します...');
            console.log(`監視時間: ${this.diagnosticData.monitoringDuration / 1000}秒`);

            // 初期状態を記録
            this.recordInitialState();

            // twitter-clean-uiをインターセプト
            if (!this.interceptTwitterCleanUI()) {
                console.warn('⚠️ twitter-clean-uiのインターセプトに失敗しました。基本的な監視のみ実行します。');
            }

            // requestAnimationFrameとsetTimeoutをインターセプト
            this.interceptRequestAnimationFrame();
            this.interceptSetTimeout();

            // サイドバーの状態を定期的に監視（100msごと）
            const stateMonitorInterval = setInterval(() => {
                this.monitorSidebarState();
            }, 100);

            // 監視時間が経過したら停止
            setTimeout(() => {
                clearInterval(stateMonitorInterval);
                this.stopMonitoring();
            }, this.diagnosticData.monitoringDuration);
        }

        /**
         * 監視を停止
         */
        stopMonitoring() {
            console.log('✅ 監視を停止しました。結果を分析中...');

            // 最終状態を記録
            const finalState = this.getSidebarState();
            this.diagnosticData.finalState = finalState;

            // サマリーを計算
            this.calculateSummary();

            // 結果をダウンロード
            this.downloadResults();

            // 結果をコンソールに表示
            this.displayResults();
        }

        /**
         * サマリーを計算
         */
        calculateSummary() {
            const summary = this.diagnosticData.summary;

            // イベントの頻度を計算
            summary.eventsPerSecond = (summary.totalEvents / (this.diagnosticData.monitoringDuration / 1000)).toFixed(2);
            summary.mutationObserverPerSecond = (summary.mutationObserverCount / (this.diagnosticData.monitoringDuration / 1000)).toFixed(2);
            summary.applySettingsPerSecond = (summary.applySettingsCount / (this.diagnosticData.monitoringDuration / 1000)).toFixed(2);

            // サイドバーの状態変化の頻度
            const sidebarStateChangesCount = this.diagnosticData.sidebarStateChanges ? this.diagnosticData.sidebarStateChanges.length : 0;
            summary.sidebarStateChangesPerSecond = (sidebarStateChangesCount / (this.diagnosticData.monitoringDuration / 1000)).toFixed(2);

            // 問題の可能性を判定
            summary.potentialIssues = [];

            if (summary.mutationObserverCount > 100) {
                summary.potentialIssues.push({
                    severity: 'high',
                    issue: 'MutationObserverの呼び出しが多すぎます',
                    count: summary.mutationObserverCount,
                    recommendation: 'DOM変更の監視範囲を狭めるか、デバウンス時間を延長することを検討してください'
                });
            }

            if (summary.applySettingsCount > 50) {
                summary.potentialIssues.push({
                    severity: 'high',
                    issue: 'applySettingsの呼び出しが多すぎます',
                    count: summary.applySettingsCount,
                    recommendation: 'デバウンス時間を延長するか、applySettingsの呼び出し条件を見直してください'
                });
            }

            if (summary.sidebarOpacityChanges > 20) {
                summary.potentialIssues.push({
                    severity: 'high',
                    issue: 'サイドバーのopacity変更が多すぎます（チラつきの原因）',
                    count: summary.sidebarOpacityChanges,
                    recommendation: 'maskSidebarColumn/unmaskSidebarColumnの呼び出し頻度を減らすか、別の方法でマスクすることを検討してください'
                });
            }

            if (sidebarStateChangesCount > 30) {
                summary.potentialIssues.push({
                    severity: 'medium',
                    issue: 'サイドバーの状態変化が多すぎます',
                    count: sidebarStateChangesCount,
                    recommendation: '状態変化の原因を特定してください'
                });
            }

            if (summary.rafCount > 200) {
                summary.potentialIssues.push({
                    severity: 'medium',
                    issue: 'requestAnimationFrameの呼び出しが多すぎます',
                    count: summary.rafCount,
                    recommendation: 'RAFの使用を最適化してください'
                });
            }
        }

        /**
         * 結果をコンソールに表示
         */
        displayResults() {
            const summary = this.diagnosticData.summary;

            console.log('');
            console.log('%c=== 📊 診断結果サマリー ===', 'font-size: 16px; font-weight: bold; color: #1d9bf0;');
            console.log(`監視時間: ${this.diagnosticData.monitoringDuration / 1000}秒`);
            console.log(`総イベント数: ${summary.totalEvents}`);
            console.log(`イベント頻度: ${summary.eventsPerSecond}回/秒`);
            console.log('');
            console.log('%c=== 🔄 イベント詳細 ===', 'font-size: 14px; font-weight: bold;');
            console.log(`MutationObserver: ${summary.mutationObserverCount}回 (${summary.mutationObserverPerSecond}回/秒)`);
            console.log(`applySettings: ${summary.applySettingsCount}回 (${summary.applySettingsPerSecond}回/秒)`);
            console.log(`detectAll: ${summary.detectAllCount}回`);
            console.log(`requestAnimationFrame: ${summary.rafCount}回`);
            console.log(`debounce (500ms): ${summary.debounceCount}回`);
            console.log('');
            console.log('%c=== 📐 サイドバー状態変化 ===', 'font-size: 14px; font-weight: bold;');
            const sidebarStateChangesCount = this.diagnosticData.sidebarStateChanges ? this.diagnosticData.sidebarStateChanges.length : 0;
            console.log(`状態変化回数: ${sidebarStateChangesCount}回 (${summary.sidebarStateChangesPerSecond}回/秒)`);
            console.log(`opacity変更: ${summary.sidebarOpacityChanges}回`);
            console.log(`display変更: ${summary.sidebarDisplayChanges}回`);
            console.log(`visibility変更: ${summary.sidebarVisibilityChanges}回`);

            if (summary.potentialIssues.length > 0) {
                console.log('');
                console.log('%c=== ⚠️ 潜在的な問題 ===', 'font-size: 14px; font-weight: bold; color: #f4212e;');
                summary.potentialIssues.forEach((issue, index) => {
                    const color = issue.severity === 'high' ? '#f4212e' : '#f4a200';
                    console.log(`%c${index + 1}. ${issue.issue}`, `color: ${color}; font-weight: bold;`);
                    console.log(`   回数: ${issue.count}`);
                    console.log(`   推奨: ${issue.recommendation}`);
                });
            } else {
                console.log('');
                console.log('%c✅ 特に問題は検出されませんでした', 'color: #00ba7c; font-weight: bold;');
            }
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
            link.download = `x-sidebar-flicker-diagnostic-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('%c✅ 診断結果をJSONファイルとしてダウンロードしました', 'color: #00ba7c; font-weight: bold;');
        }
    }

    // ========================================
    // 自動実行
    // ========================================
    
    console.log('%c🔍 X/Twitter 右サイドバーチラつき診断ツール', 'font-size: 20px; font-weight: bold; color: #1d9bf0;');
    console.log('%c右サイドバーのチラつきの原因を調査します（30秒間監視）', 'font-size: 14px; color: #657786;');
    console.log('');
    
    const diagnostic = new SidebarFlickerDiagnostic();
    diagnostic.startMonitoring();
    
    console.log('');
    console.log('%c💡 ヒント:', 'color: #657786; font-style: italic;');
    console.log('  - ページをスクロールしたり、操作するとイベントが記録されます');
    console.log('  - 30秒後に自動的に結果がダウンロードされます');
    console.log('  - 結果のJSONファイルを開発者に共有してください');
    
    // グローバルに公開（手動停止用）
    window.stopSidebarFlickerDiagnostic = function() {
        diagnostic.stopMonitoring();
    };
    
    console.log('  - 手動で停止: stopSidebarFlickerDiagnostic()');
})();

