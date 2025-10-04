// ==UserScript==
// @name         Twitter Thread Copier
// @namespace    twitterThreadCopier
// @version      4.1
// @description  Copy tweets and replies from a Twitter/X thread with formatting, supports auto-expanding "Show more" texts, fixing shortened URLs and including quoted tweets
// @author       roflsunriz
// @match        https://twitter.com/*
// @match        https://x.com/*
// @connect      translate.googleapis.com
// @connect      *.googleapis.com
// @connect      t.co
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @updateURL    https://gist.githubusercontent.com/roflsunriz/633e2abae02f42eab8dde1401829c8c7/raw/twitter_thread_copier.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/633e2abae02f42eab8dde1401829c8c7/raw/twitter_thread_copier.user.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    
    // コンソールロギング用のラッパー
    const debug = {
        log: (message) => {
            console.log('[TwitterThreadCopier]', message);
        },
        error: (message) => {
            console.error('[TwitterThreadCopier]', message);
        }
    };
    
    // スクリプトの状態管理
    const state = {
        collectedThreadData: null,
        isCollecting: false,
        isSecondStage: false,
        translateEnabled: false, // 翻訳機能の有効/無効状態
        translationInProgress: false, // 翻訳処理中かどうか
        copyMode: 'all', // コピーモード: 'all', 'first', 'shitaraba', '5ch'
        startFromTweetId: null, // コピー開始点のツイートID
        startFromTweetAuthor: '', // コピー開始点のツイート作者
        startFromTweetText: '' // コピー開始点のツイートテキスト（表示用）
    };
    
    // Google翻訳 非公式APIエンドポイント
    const GOOGLE_TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
    
    // シャドウDOMコンテナの管理
    const shadowDOMManager = {
        shadowRoot: null,
        container: null,
        
        // シャドウDOMを初期化
        init() {
            if (this.shadowRoot) return this.shadowRoot;
            
            // シャドウDOMホスト要素を作成
            this.container = document.createElement('div');
            this.container.id = 'twitter-thread-copier-shadow-host';
            this.container.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;';
            
            // シャドウDOMを作成（closed modeで完全に分離）
            this.shadowRoot = this.container.attachShadow({ mode: 'closed' });
            
            // スタイルを追加
            this.addStyles();
            
            // ホスト要素をページに追加
            document.body.appendChild(this.container);
            
            debug.log('Shadow DOM initialized');
            return this.shadowRoot;
        },
        
        // シャドウDOM内にスタイルを追加
        addStyles() {
            if (!this.shadowRoot) return;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .copy-thread-button {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #e01e1e;
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    pointer-events: auto;
                }
                
                .copy-thread-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }
                
                .copy-thread-button.success {
                    background-color: #4CAF50;
                }
                
                .copy-thread-button.ready {
                    background-color: #1DA1F2;
                }
                
                .copy-thread-button.loading svg {
                    animation: spinning 1.5s linear infinite;
                }
                
                .control-panel-container {
                    position: fixed;
                    bottom: 160px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    font-size: 14px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    pointer-events: auto;
                }
                
                .control-panel-container select,
                .control-panel-container input {
                    margin-left: 8px;
                    transform: scale(0.96);
                }
                
                .control-panel-container label {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                }
                
                .control-panel-container select {
                    background-color: #333;
                    color: white;
                    border: 1px solid #666;
                    border-radius: 4px;
                    padding: 2px 4px;
                }
                
                .copy-thread-button .text {
                    position: absolute;
                    font-size: 12px;
                    white-space: nowrap;
                    top: -25px;
                    background-color: #333;
                    padding: 3px 8px;
                    border-radius: 4px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                }
                
                .copy-thread-button:hover .text {
                    opacity: 1;
                    visibility: visible;
                }
                
                @keyframes spinning {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .copy-toast {
                    position: fixed;
                    bottom: 180px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    max-width: 300px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    pointer-events: auto;
                }
                
                .copy-toast.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .toast-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .toast-content {
                    font-size: 13px;
                    opacity: 0.9;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
                
                .start-point-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: rgba(29, 161, 242, 0.1);
                    border: 2px solid #1DA1F2;
                    color: #1DA1F2;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: auto;
                    font-size: 14px;
                    font-weight: bold;
                }
                
                .tweet-container:hover .start-point-button {
                    opacity: 1;
                }
                
                .start-point-button:hover {
                    background-color: rgba(29, 161, 242, 0.2);
                    transform: scale(1.1);
                }
                
                .start-point-button.active {
                    background-color: #1DA1F2;
                    color: white;
                    opacity: 1;
                }
                
                .start-point-button.active:hover {
                    background-color: #1991DB;
                }
                
                .tweet-container {
                    position: relative;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                
                .tweet-container.start-point-set {
                    background-color: rgba(29, 161, 242, 0.1);
                    border: 2px solid #1DA1F2;
                }
                
                .reset-start-point {
                    position: fixed;
                    bottom: 220px;
                    right: 20px;
                    padding: 8px 12px;
                    background-color: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: auto;
                }
                
                .reset-start-point.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .reset-start-point:hover {
                    background-color: #ff5252;
                    transform: scale(1.05);
                }
            `;
            this.shadowRoot.appendChild(styleElement);
        },
        
        // シャドウDOM内の要素を取得
        querySelector(selector) {
            return this.shadowRoot ? this.shadowRoot.querySelector(selector) : null;
        },
        
        // シャドウDOM内に要素を追加
        appendChild(element) {
            if (this.shadowRoot) {
                this.shadowRoot.appendChild(element);
            }
        },
        
        // シャドウDOMを破棄
        destroy() {
            try {
                if (this.container && this.container.parentNode) {
                    this.container.parentNode.removeChild(this.container);
                }
            } catch (error) {
                debug.error(`Shadow DOM container removal error: ${error.message}`);
                // フォールバック: 直接削除を試みる
                try {
                    if (this.container && document.body.contains(this.container)) {
                        document.body.removeChild(this.container);
                    }
                } catch (fallbackError) {
                    debug.error(`Shadow DOM fallback removal error: ${fallbackError.message}`);
                }
            } finally {
                this.shadowRoot = null;
                this.container = null;
                debug.log('Shadow DOM destroyed');
            }
        }
     };
    
    // コントロールパネルを追加
    function addControlPanel() {
        // シャドウDOMを初期化
        const shadowRoot = shadowDOMManager.init();
        
        // すでにある場合は何もしない
        if (shadowDOMManager.querySelector('.control-panel-container')) return;
        
        const container = document.createElement('div');
        container.className = 'control-panel-container';
        
        // モード選択用のセレクトボックス
        const modeSelect = document.createElement('select');
        modeSelect.id = 'copy-mode-select';
        modeSelect.innerHTML = `
            <option value="all">全ツイート</option>
            <option value="first">最初のツイートのみ</option>
            <option value="shitaraba">したらば (4096文字)</option>
            <option value="5ch">5ch (2048文字)</option>
        `;
        modeSelect.value = state.copyMode;
        modeSelect.addEventListener('change', (e) => {
            state.copyMode = e.target.value;
            debug.log(`Copy mode changed to: ${state.copyMode}`);
        });
        container.appendChild(modeSelect);
        
        // 翻訳チェックボックス
        const translateLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'translate-checkbox';
        checkbox.checked = state.translateEnabled;
        checkbox.addEventListener('change', (e) => {
            state.translateEnabled = e.target.checked;
            debug.log(`Translation ${state.translateEnabled ? 'enabled' : 'disabled'}`);
        });
        translateLabel.appendChild(checkbox);
        translateLabel.appendChild(document.createTextNode('日本語に翻訳'));
        
        container.appendChild(translateLabel);
        shadowDOMManager.appendChild(container);
        
        debug.log('Control panel added to shadow DOM');
    }
    
    // 起点リセットボタンを追加/更新
    function updateResetButton() {
        const shadowRoot = shadowDOMManager.init();
        let resetButton = shadowDOMManager.querySelector('.reset-start-point');
        
        if (state.startFromTweetId) {
            // 起点が設定されている場合はボタンを表示
            if (!resetButton) {
                resetButton = document.createElement('button');
                resetButton.className = 'reset-start-point';
                resetButton.textContent = '起点をリセット';
                resetButton.addEventListener('click', resetStartPoint);
                shadowDOMManager.appendChild(resetButton);
            }
            resetButton.classList.add('visible');
        } else {
            // 起点が設定されていない場合はボタンを非表示
            if (resetButton) {
                resetButton.classList.remove('visible');
            }
        }
    }
    
    // 起点をリセットする関数
    function resetStartPoint() {
        state.startFromTweetId = null;
        state.startFromTweetAuthor = '';
        state.startFromTweetText = '';
        
        // 起点設定されたツイートのハイライトを解除
        const highlightedTweets = document.querySelectorAll('.tweet-container.start-point-set');
        highlightedTweets.forEach(tweet => {
            tweet.classList.remove('start-point-set');
            const button = tweet.querySelector('.start-point-button');
            if (button) {
                button.classList.remove('active');
                button.textContent = '★';
            }
        });
        
        // リセットボタンを非表示
        updateResetButton();
        
        // メインコピーボタンのテキストを更新
        updateMainCopyButtonText();
        
        showToast('起点リセット', 'コピー起点をリセットしました');
        debug.log('Start point reset');
    }
    
    // メインコピーボタンのテキストを更新
    function updateMainCopyButtonText() {
        const button = shadowDOMManager.querySelector('#twitter-thread-copier-button');
        if (!button) return;
        
        if (state.startFromTweetId) {
            // 起点が設定されている場合
            const startText = state.startFromTweetText.length > 20 
                ? state.startFromTweetText.substring(0, 20) + '...' 
                : state.startFromTweetText;
            button.innerHTML = `<span class="text">${startText}からコピー</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        } else {
            // 起点が設定されていない場合（デフォルト）
            button.innerHTML = '<span class="text">スレッドをコピー</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        }
    }
    
    // コピーボタンを作成して追加
    function addCopyButton() {
        // シャドウDOMを初期化
        const shadowRoot = shadowDOMManager.init();
        
        // すでにボタンがある場合は何もしない
        const existingButton = shadowDOMManager.querySelector('.copy-thread-button');
        if (existingButton) return;
        
        // ステータスページでなければボタンを表示しない
        if (!isTwitterStatusPage()) {
            removeButton();
            return;
        }
        
        // コントロールパネルを追加
        addControlPanel();
        
        const button = document.createElement('button');
        button.className = 'copy-thread-button';
        button.id = 'twitter-thread-copier-button';
        button.innerHTML = '<span class="text">スレッドをコピー</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        button.title = 'スレッドをコピー';
        
        // 起点設定ボタンを各ツイートに追加
        addStartPointButtons();
        
        // リセットボタンの状態を更新
        updateResetButton();
        
        // メインコピーボタンのテキストを更新
        updateMainCopyButtonText();
        
        button.addEventListener('click', async () => {
            try {
                // 二段階目（コピー実行ステージ）の場合
                if (state.isSecondStage && state.collectedThreadData) {
                    // ClipboardItem APIによるコピーを試みる
                    await executeClipboardCopy(state.collectedThreadData);
                    
                    // ステートをリセット
                    state.isSecondStage = false;
                    state.collectedThreadData = null;
                    
                    // ボタンの見た目を元に戻す
                    button.classList.remove('ready');
                    button.innerHTML = '<span class="text">スレッドをコピー</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                    
                    return;
                }
                
                // すでにデータ収集中なら処理しない
                if (state.isCollecting) return;
                state.isCollecting = true;
                
                button.disabled = true;
                button.style.cursor = 'wait';
                button.classList.add('loading');
                
                // ツイートデータを収集
                const result = await copyThreadContent();
                
                // 翻訳が有効な場合は翻訳を実行
                if (state.translateEnabled && result.formattedText.trim().length > 0) {
                    state.translationInProgress = true;
                    button.innerHTML = '<span class="text">翻訳中...</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                    
                    try {
                        // テキストを翻訳
                        showToast('翻訳中', '翻訳処理を実行しています...');
                        const translatedText = await translateText(result.formattedText);
                        
                        // 翻訳結果が有効かチェック
                        if (translatedText && translatedText.trim().length > 0) {
                            result.formattedText = translatedText;
                            result.summary += ' (翻訳済み)';
                            debug.log('Translation completed successfully');
                        } else {
                            debug.error('Translation returned empty result, using original text');
                            showToast('翻訳警告', '翻訳結果が空のため、原文を使用します');
                        }
                    } catch (translationError) {
                        debug.error('Translation error: ' + translationError);
                        showToast('翻訳エラー', '翻訳中にエラーが発生しましたが、原文をコピーできます');
                        // 翻訳に失敗しても原文は保持されているので処理を続行
                    } finally {
                        state.translationInProgress = false;
                    }
                }
                
                // 状態を更新
                state.collectedThreadData = result;
                state.isCollecting = false;
                state.isSecondStage = true;
                
                button.disabled = false;
                button.style.cursor = 'pointer';
                button.classList.remove('loading');
                button.classList.add('ready');
                
                // ボタンの見た目を変更して二段階目であることを示す
                button.innerHTML = '<span class="text">クリックしてコピー</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
                
                // ユーザーに通知
                showToast('準備完了', `${result.summary} クリックしてコピーしてください`);
                
            } catch (error) {
                debug.error('Error in copy process: ' + error);
                showToast('エラー', 'スレッドのコピーに失敗しました');
                
                button.disabled = false;
                button.style.cursor = 'pointer';
                button.classList.remove('loading');
                button.classList.remove('ready');
                
                // 状態をリセット
                state.isCollecting = false;
                state.isSecondStage = false;
                state.translationInProgress = false;
            }
        });
        
        shadowDOMManager.appendChild(button);
        debug.log('Copy button added to shadow DOM');
    }
    
    // テキストを翻訳する関数
    async function translateText(text) {
        try {
            // URLやメディアリンク、ユーザー名、日時を一時的に置き換えるための準備
            const placeholders = {};
            const placeholderMap = new Map(); // 大文字小文字変換対応用
            let placeholderIndex = 0;
            
            // URLとメディアリンクのパターン
            const URL_PATTERN = /(https?:\/\/[^\s]+)|(\[動画\]\s+https?:\/\/[^\s]+)|(https:\/\/video\.twimg\.com\/[^\s]+)|(https:\/\/pbs\.twimg\.com\/[^\s]+)/g;
            
            // ユーザー名（@username）のパターン
            const USERNAME_PATTERN = /([A-Za-z0-9_]+\s+)?(@[a-zA-Z0-9_]+)/g;
            
            // 日付と時間のパターン（YYYY年MM月DD日 HH:MM 形式）
            const DATETIME_PATTERN = /(\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2})/g;
            
            // 絵文字のパターン（Unicode絵文字の範囲）
            const EMOJI_PATTERN = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F0}\u{23F3}\u{25B6}\u{23F8}-\u{23FA}]/gu;
            
            // プレースホルダー生成関数（数字ベースで翻訳に影響されにくい形式）
            function createPlaceholder(type) {
                const id = placeholderIndex++;
                // 数字と記号のみを使用し、翻訳APIが変更しにくい形式
                return `###${type}${id}###`;
            }
            
            // 1. URLやメディアリンクを一時的なプレースホルダーに置き換え
            const textWithoutUrls = text.replace(URL_PATTERN, (match) => {
                const placeholder = createPlaceholder('URL');
                placeholders[placeholder] = match;
                placeholderMap.set(placeholder.toLowerCase(), placeholder);
                return placeholder;
            });
            
            const urlCount = placeholderIndex;
            
            // 2. ユーザー名(@username)を一時的なプレースホルダーに置き換え
            const usernameStartIndex = placeholderIndex;
            const textWithoutUsernames = textWithoutUrls.replace(USERNAME_PATTERN, (match) => {
                const placeholder = createPlaceholder('USER');
                placeholders[placeholder] = match;
                placeholderMap.set(placeholder.toLowerCase(), placeholder);
                return placeholder;
            });
            
            const usernameCount = placeholderIndex - usernameStartIndex;
            
            // 3. 日付と時間を一時的なプレースホルダーに置き換え
            const datetimeStartIndex = placeholderIndex;
            const textWithoutDatetimes = textWithoutUsernames.replace(DATETIME_PATTERN, (match) => {
                const placeholder = createPlaceholder('TIME');
                placeholders[placeholder] = match;
                placeholderMap.set(placeholder.toLowerCase(), placeholder);
                return placeholder;
            });
            
            const datetimeCount = placeholderIndex - datetimeStartIndex;
            
            // 4. 絵文字を一時的なプレースホルダーに置き換え
            const emojiStartIndex = placeholderIndex;
            const textWithoutEmojis = textWithoutDatetimes.replace(EMOJI_PATTERN, (match) => {
                const placeholder = createPlaceholder('EMOJI');
                placeholders[placeholder] = match;
                placeholderMap.set(placeholder.toLowerCase(), placeholder);
                return placeholder;
            });
            
            const emojiCount = placeholderIndex - emojiStartIndex;
            
            debug.log(`プレースホルダー作成完了: URL=${urlCount}, ユーザー名=${usernameCount}, 日時=${datetimeCount}, 絵文字=${emojiCount}`);
            
            // テキストが長い場合、分割して翻訳するための準備
            const MAX_CHUNK_SIZE = 800; // 最大文字数を800に制限（Google翻訳の非公式APIの利用制限を考慮）
            const chunks = [];
            
            // テキストを段落に分割
            const paragraphs = textWithoutEmojis.split('\n');
            let currentChunk = '';
            
            // 段落を追加しながらチャンクを作成
            for (const paragraph of paragraphs) {
                // もし現在のチャンクにこの段落を追加すると長すぎる場合は、新しいチャンクを開始
                if (currentChunk.length + paragraph.length + 1 > MAX_CHUNK_SIZE && currentChunk.length > 0) {
                    chunks.push(currentChunk);
                    currentChunk = paragraph;
                } else {
                    // そうでなければ、現在のチャンクに追加
                    if (currentChunk.length > 0) {
                        currentChunk += '\n' + paragraph;
                    } else {
                        currentChunk = paragraph;
                    }
                }
            }
            
            // 最後のチャンクを追加
            if (currentChunk.length > 0) {
                chunks.push(currentChunk);
            }
            
                            // 各チャンクを翻訳して結果を連結
                const translatedChunks = [];
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    
                    // 空のチャンクはスキップ
                    if (!chunk || chunk.trim().length === 0) {
                        translatedChunks.push('');
                        continue;
                    }
                    
                    // Google翻訳API（非公式）を使用
                    const sourceLang = "auto"; // 自動検出
                    const targetLang = "ja";   // 日本語に翻訳
                    
                    let translatedText = '';
                    let retryCount = 0;
                    const MAX_RETRIES = 3;
                    
                    while (retryCount < MAX_RETRIES) {
                        try {
                            const url = `${GOOGLE_TRANSLATE_ENDPOINT}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(chunk)}`;
                            
                            // GM_xmlhttpRequestを使用してCSP制限を回避
                            const response = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: url,
                                    timeout: 15000, // タイムアウトを15秒に延長
                                    onload: function(response) {
                                        if (response.status >= 200 && response.status < 300) {
                                            resolve(response);
                                        } else {
                                            reject(new Error(`Translation API error: ${response.status} ${response.statusText}`));
                                        }
                                    },
                                    onerror: function(error) {
                                        reject(new Error('Translation request failed: ' + (error ? error.toString() : 'Unknown error')));
                                    },
                                    ontimeout: function() {
                                        reject(new Error('Translation request timed out'));
                                    }
                                });
                            });
                            
                            // レスポンスデータをパース
                            let data;
                            try {
                                if (!response.responseText || response.responseText.trim().length === 0) {
                                    throw new Error('Empty response from translation API');
                                }
                                data = JSON.parse(response.responseText);
                            } catch (parseError) {
                                throw new Error(`Failed to parse translation response: ${parseError.message}. Response: ${response.responseText ? response.responseText.substring(0, 200) : 'null'}`);
                            }
                            
                            // Google翻訳APIのレスポンス形式に合わせて処理
                            if (!data || !data.sentences || !Array.isArray(data.sentences)) {
                                throw new Error(`Invalid translation response format. Expected sentences array, got: ${JSON.stringify(data).substring(0, 200)}`);
                            }
                            
                            translatedText = data.sentences.map(s => (s && s.trans) ? s.trans : '').join('');
                            if (!translatedText.trim()) {
                                throw new Error('Translation result is empty');
                            }
                            
                            translatedChunks.push(translatedText);
                            
                            // 成功したら次のチャンクへ
                            break;
                        } catch (error) {
                            retryCount++;
                            debug.error(`翻訳試行 ${retryCount}/${MAX_RETRIES} 失敗 (チャンク ${i+1}/${chunks.length}): ${error.message}`);
                            
                            if (retryCount >= MAX_RETRIES) {
                                // 最大試行回数に達した場合、元のテキストを使用
                                debug.error(`翻訳失敗: ${MAX_RETRIES}回試行後も失敗 (チャンク ${i+1}): ${error.message} - 元のテキストを使用`);
                                translatedChunks.push(chunk); // 元のテキストを使用
                                break;
                            }
                            
                            // 再試行前に待機（指数バックオフ）
                            const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                        }
                    }
                    
                    // APIレート制限に配慮して少し待機
                    if (i < chunks.length - 1) {
                        const waitTime = 1500 + Math.random() * 1000;
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }
                
                // 翻訳結果を連結
                let translatedResult = translatedChunks.join('\n');
                
                // プレースホルダーを元の内容に戻す（大文字小文字を無視した置換）
                const restoredResult = restorePlaceholders(translatedResult, placeholders, placeholderMap);
                
                return restoredResult;
        } catch (error) {
            debug.error('Translation error: ' + error);
            throw error;
        }
    }
    
    // 正規表現用文字列エスケープ関数 (全スコープで利用)
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // プレースホルダーを元の内容に戻す関数（大文字小文字を無視した置換）
    function restorePlaceholders(translatedText, placeholders, placeholderMap) {
        try {
            let result = translatedText;
            let restoredCount = 0;
            let failedCount = 0;
            
            // 元のプレースホルダーで直接置換を試行
            Object.keys(placeholders).forEach(originalPlaceholder => {
                const originalContent = placeholders[originalPlaceholder];
                const regex = new RegExp(escapeRegExp(originalPlaceholder), 'g');
                const beforeLength = result.length;
                result = result.replace(regex, originalContent);
                const afterLength = result.length;
                
                if (beforeLength !== afterLength) {
                    restoredCount++;
                }
            });
            
            // 大文字小文字が変更されたプレースホルダーを検出して置換
            const remainingPlaceholders = findRemainingPlaceholders(result);
            
            for (const foundPlaceholder of remainingPlaceholders) {
                // 翻訳時にプレースホルダー内部へ空白が挿入されるケースを考慮し、
                // 空白を除去したキーでマッピングを試みる
                const condensedFound = foundPlaceholder.replace(/\s+/g, '');
                const lowerCondensed = condensedFound.toLowerCase();

                let originalPlaceholder = null;

                if (placeholderMap.has(lowerCondensed)) {
                    originalPlaceholder = placeholderMap.get(lowerCondensed);
                } else {
                    // 数字(ID)ベースでのフォールバック検索
                    const idMatch = condensedFound.match(/(\d+)/);
                    if (idMatch) {
                        const idStr = idMatch[1];
                        for (const [key, value] of placeholderMap.entries()) {
                            if (key.includes(idStr)) {
                                originalPlaceholder = value;
                                break;
                            }
                        }
                    }
                }

                if (originalPlaceholder && placeholders[originalPlaceholder]) {
                    const originalContent = placeholders[originalPlaceholder];
                    const regex = new RegExp(escapeRegExp(foundPlaceholder), 'g');
                    const beforeLength = result.length;
                    result = result.replace(regex, originalContent);
                    const afterLength = result.length;

                    if (beforeLength !== afterLength) {
                        restoredCount++;
                        debug.log(`プレースホルダーを復元: ${foundPlaceholder} -> ${originalPlaceholder}`);
                    }
                } else {
                    failedCount++;
                    debug.error(`プレースホルダー復元失敗: ${foundPlaceholder} (対応する元のプレースホルダーが見つかりません)`);
                }
            }
            
            debug.log(`プレースホルダー復元完了: 成功=${restoredCount}, 失敗=${failedCount}`);
            
            if (failedCount > 0) {
                debug.error(`警告: ${failedCount}個のプレースホルダーの復元に失敗しました`);
            }
            
            return result;
        } catch (error) {
            debug.error(`プレースホルダー復元中にエラー: ${error.message}`);
            // エラーが発生した場合は元のテキストを返す
            return translatedText;
        }
    }
    
    // テキスト内に残っているプレースホルダーを検出する関数
    function findRemainingPlaceholders(text) {
        try {
            // ###で囲まれたパターンを検索（大文字小文字混在も含む）
            // 翻訳により ### の内側に空白が挿入されるケースを考慮して空白を許容
            const placeholderPattern = /###\s*[A-Za-z]*\s*\d+\s*###/g;
            const matches = text.match(placeholderPattern) || [];
            return [...new Set(matches)]; // 重複を除去
        } catch (error) {
            debug.error(`プレースホルダー検出中にエラー: ${error.message}`);
            return [];
        }
    }
    
    // クリップボードコピー実行関数（複数の方法を試す）
    async function executeClipboardCopy(threadData) {
        let copySuccess = false;
        let lastError = null;
        
        // より詳細なデバッグ情報を提供
        debug.log(`executeClipboardCopy called with threadData: ${threadData ? 'exists' : 'null'}`);
        if (threadData) {
            debug.log(`threadData.formattedText: ${threadData.formattedText ? `exists (${threadData.formattedText.length} chars)` : 'null/empty'}`);
            debug.log(`threadData.summary: ${threadData.summary || 'not set'}`);
        }
        
        if (!threadData) {
            const error = new Error('threadDataがnullまたはundefinedです');
            debug.error(`クリップボードコピー失敗: ${error.message}`);
            showToast('エラー', 'コピーするデータがありません（threadData不正）');
            return false;
        }
        
        if (!threadData.formattedText) {
            const error = new Error('formattedTextがnullまたはundefinedです');
            debug.error(`クリップボードコピー失敗: ${error.message}`);
            showToast('エラー', 'コピーするテキストがありません（formattedText不正）');
            return false;
        }
        
        if (threadData.formattedText.trim().length === 0) {
            const error = new Error('formattedTextが空文字列です');
            debug.error(`クリップボードコピー失敗: ${error.message}`);
            showToast('エラー', 'コピーするテキストが空です');
            return false;
        }
        

        
        // まずClipboardItem APIを試す
        if (navigator.clipboard && window.ClipboardItem) {
            try {
                // ClipboardItemを使用したコピー
                const type = 'text/plain';
                const blob = new Blob([threadData.formattedText], { type });
                const data = [new ClipboardItem({ [type]: blob })];
                
                await navigator.clipboard.write(data);
                copySuccess = true;
            } catch (clipboardError) {
                lastError = clipboardError;
                debug.error(`ClipboardItem API失敗: ${clipboardError.message}`);
                // エラーが発生した場合は他の方法を試す
            }
        }
        
        // ClipboardItem APIが失敗または非対応の場合、Navigator clipboardを試す
        if (!copySuccess && navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(threadData.formattedText);
                copySuccess = true;
            } catch (navigatorError) {
                lastError = navigatorError;
                debug.error(`Navigator clipboard API失敗: ${navigatorError.message}`);
                // エラーが発生した場合は他の方法を試す
            }
        }
        
        // それでも失敗した場合、従来のdocument.execCommandを使用
        if (!copySuccess) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = threadData.formattedText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                textarea.style.left = '-9999px';
                textarea.style.top = '-9999px';
                
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                
                copySuccess = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (!copySuccess) {
                    throw new Error('execCommand("copy") returned false');
                }
            } catch (execError) {
                lastError = execError;
                debug.error(`execCommand fallback失敗: ${execError.message}`);
            }
        }
        
        if (copySuccess) {
            showToast('コピーしました', threadData.summary);
            const button = shadowDOMManager.querySelector('#twitter-thread-copier-button');
            if (button) {
                button.classList.add('success');
                setTimeout(() => {
                    button.classList.remove('success');
                }, 3000);
            }
        } else {
            const errorMsg = lastError ? `クリップボードコピー失敗: ${lastError.message}` : 'クリップボードへのコピーに失敗しました';
            debug.error(errorMsg);
            showToast('エラー', 'クリップボードへのコピーに失敗しました');
        }
        
        return copySuccess;
    }
    
    // ボタンを削除する関数
    function removeButton() {
        // シャドウDOM全体を破棄
        shadowDOMManager.destroy();
        debug.log('Shadow DOM and all UI elements removed');
    }
    
    // トースト通知を表示
    function showToast(title, content) {
        // シャドウDOMを初期化
        const shadowRoot = shadowDOMManager.init();
        
        let toast = shadowDOMManager.querySelector('.copy-toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            shadowDOMManager.appendChild(toast);
        }
        
        // 長い内容を省略
        let displayContent = content;
        if (content.length > 50) {
            // 内容が長い場合は省略する
            displayContent = content.substring(0, 47) + '...';
        }
        
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-content">${displayContent}</div>
        `;
        
        // すでに表示されているトーストを消す
        toast.classList.remove('visible');
        
        // リフロー発生のため少し待つ
        setTimeout(() => {
            toast.classList.add('visible');
            
            setTimeout(() => {
                toast.classList.remove('visible');
                
                // トーストのフェードアウトアニメーション完了後に要素を削除
                setTimeout(() => {
                    if (toast && toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                        debug.log('Toast element removed from DOM');
                    }
                }, 500); // アニメーション完了を待つ
            }, 3000);
        }, 10);
    }
    
    // ユーザー名(@username)を取得する関数
    function getUsernameHandle(tweetElement) {
        try {
            // 複数の方法でハンドル名を取得しようとする
            
            // 方法1: 直接@を含むテキストを探す
            const allSpans = Array.from(tweetElement.querySelectorAll('span'));
            const handleSpan = allSpans.find(span => {
                try {
                    const text = span.textContent ? span.textContent.trim() : '';
                    return text.startsWith('@') && !text.includes(' ') && text.length > 1;
                } catch (error) {
                    return false;
                }
            });
            
            if (handleSpan) {
                return handleSpan.textContent.trim();
            }
            
            // 方法2: URLからハンドル名を取得
            const userLinks = Array.from(tweetElement.querySelectorAll('a[role="link"][href^="/"]'));
            for (const link of userLinks) {
                try {
                    const href = link.getAttribute('href');
                    if (href && !href.includes('/status/') && href.length > 1 && !href.includes('/i/')) {
                        return '@' + href.replace(/^\//, '');
                    }
                } catch (error) {
                    continue;
                }
            }
            
            // 方法3: User-Nameエリア内の全てのテキストを確認
            const userNameArea = tweetElement.querySelector('div[data-testid="User-Name"]');
            if (userNameArea) {
                const allUserNameSpans = userNameArea.querySelectorAll('span');
                for (const span of allUserNameSpans) {
                    try {
                        const text = span.textContent ? span.textContent.trim() : '';
                        if (text.startsWith('@') && !text.includes(' ')) {
                            return text;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            return ''; // ハンドル名が見つからない場合
        } catch (error) {
            debug.error(`ユーザーハンドル取得エラー: ${error.message}`);
            return '';
        }
    }
    
    // ユーザー名を取得する関数
    function getDisplayName(tweetElement) {
        try {
            const userNameElement = tweetElement.querySelector('div[data-testid="User-Name"] a[role="link"] span');
            return userNameElement && userNameElement.textContent ? userNameElement.textContent.trim() : '';
        } catch (error) {
            debug.error(`ユーザー名取得エラー: ${error.message}`);
            return '';
        }
    }
    
    // ツイートとリプライを収集
    async function copyThreadContent() {
        try {
            const tweets = [];
            const processedIds = new Set();
            let mainAuthorUsername = '';
            let mainAuthorHandle = '';
            
            // スクロール前の位置を記憶
            const originalScrollPos = window.scrollY;
        
        // スレッド内のツイートを取得
        function collectVisibleTweets() {
            const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
            
                            // 最初のツイートの著者のユーザー名を取得
                if (tweetElements.length > 0 && !mainAuthorUsername) {
                    mainAuthorUsername = getDisplayName(tweetElements[0]);
                    mainAuthorHandle = getUsernameHandle(tweetElements[0]);
                }
            
            tweetElements.forEach(tweetElement => {
                // ツイートのIDを取得
                const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
                if (!tweetLink) return;
                
                const hrefParts = tweetLink.href.split('/');
                const statusIndex = hrefParts.indexOf('status');
                if (statusIndex === -1 || statusIndex + 1 >= hrefParts.length) return;
                
                const tweetId = hrefParts[statusIndex + 1];
                if (processedIds.has(tweetId)) return;
                
                // 著者名とハンドルを取得
                const author = getDisplayName(tweetElement);
                
                // メインの著者でない場合はスキップ
                if (mainAuthorUsername && author !== mainAuthorUsername) return;
                
                // ハンドルを取得
                let handle = getUsernameHandle(tweetElement);
                
                // メインユーザーの場合で、ハンドルが取得できない場合は保存したハンドルを使用
                if (author === mainAuthorUsername && !handle && mainAuthorHandle) {
                    handle = mainAuthorHandle;
                }
                
                // ツイート本文
                const tweetTextElement = tweetElement.querySelector('div[data-testid="tweetText"]');
                let tweetText = '';
                
                if (tweetTextElement) {
                    // ツイート本文全体を取得
                    tweetText = getTweetFullText(tweetTextElement);
                }
                
                // 日時
                const timeElement = tweetElement.querySelector('time');
                const timestamp = timeElement ? timeElement.getAttribute('datetime') : '';
                const formattedTime = timestamp ? formatDateTime(new Date(timestamp)) : '';
                
                // ツイート内のメディア（画像）を取得
                const mediaUrls = getMediaUrls(tweetElement);
                
                // 引用ツイートを取得
                const quotedTweet = getQuotedTweet(tweetElement);
                
                // ツイート情報を保存
                tweets.push({
                    id: tweetId,
                    author,
                    handle,
                    text: tweetText,
                    time: formattedTime,
                    mediaUrls,
                    quotedTweet
                });
                
                processedIds.add(tweetId);
            });
        }
        
        // 引用ツイートを取得する関数
        function getQuotedTweet(tweetElement) {
            // 1. まず標準的な方法で検索
            const quotedTweetElement = tweetElement.querySelector('[data-testid="tweetQuotedLink"]');
            
            let foundQuotedTweet = null;
            
            if (quotedTweetElement) {
                try {
                    // 引用元のツイートを取得
                    const quotedTweetContainer = quotedTweetElement.closest('div[role="link"]');
                    if (quotedTweetContainer) {
                        foundQuotedTweet = extractQuotedTweetInfo(quotedTweetContainer);
                    }
                } catch (error) {
                    debug.error(`引用ツイート取得エラー: ${error.message}`);
                }
            } else {
                // 2. 標準的な方法で見つからない場合、代替方法を試みる
                try {
                    // ツイート本文に「引用」というテキストが含まれているか確認
                    const tweetText = tweetElement.innerText || '';
                    const hasQuoteKeyword = tweetText.includes('引用') || tweetText.includes('Quote') || tweetText.includes('quote');
                    
                    // ツイート内の div[role="link"] 要素を取得
                    const linkElements = tweetElement.querySelectorAll('div[role="link"]');
                    
                    if (linkElements.length > 0 && hasQuoteKeyword) {
                        // テキスト内容から最も引用ツイートらしい要素を探す
                        for (let i = 0; i < linkElements.length; i++) {
                            const element = linkElements[i];
                            const elementText = element.innerText || '';
                            
                            // 引用ツイートの特徴的な構造: ユーザー名 + @ハンドル名 + 日付/時間 + 本文
                            // @記号が含まれており、日付/時間表記がある場合は引用ツイートの可能性が高い
                            if (elementText.includes('@') && 
                                (elementText.includes('年') || elementText.includes('時間') || 
                                 elementText.includes('分') || elementText.includes('日'))) {
                                
                                try {
                                    const extractedData = extractQuotedTweetInfo(element);
                                    if (extractedData && extractedData.author && extractedData.text) {
                                        foundQuotedTweet = extractedData;
                                        break;
                                    }
                                } catch (error) {
                                    debug.error(`代替引用ツイート抽出エラー: ${error.message}`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    debug.error(`代替引用ツイート検索エラー: ${error.message}`);
                }
            }
            
            return foundQuotedTweet;
        }
        
        // 引用ツイート情報を抽出する補助関数
        function extractQuotedTweetInfo(quotedTweetContainer) {
            // 著者情報取得
            const quotedAuthorElement = quotedTweetContainer.querySelector('div[dir="ltr"] > span');
            const quotedAuthor = quotedAuthorElement ? quotedAuthorElement.textContent.trim() : '';
            
            // ハンドル取得 (@username)
            const quotedHandleElement = quotedTweetContainer.querySelector('div[dir="ltr"] span:nth-child(2)');
            const quotedHandle = quotedHandleElement ? quotedHandleElement.textContent.trim() : '';
            
            // 本文取得
            let quotedText = '';
            const quotedTextElement = quotedTweetContainer.querySelector('div[data-testid="tweetText"]');
            
            if (quotedTextElement) {
                // data-testid="tweetText" がある場合はそれを使用
                quotedText = getTweetFullText(quotedTextElement);
            } else {
                // なければ代替方法で本文を抽出
                // ユーザー名とハンドル名の行の後のテキストを抽出する
                const textContent = quotedTweetContainer.innerText || '';
                const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);
                
                // ハンドル名を含む行のインデックスを探す
                let handleIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes(quotedHandle)) {
                        handleIndex = i;
                        break;
                    }
                }
                
                // 日付/時間行を探す（通常はハンドル名の行の次）
                let dateLineIndex = handleIndex + 1;
                // 日付行をスキップして本文を取得
                if (handleIndex >= 0 && dateLineIndex < lines.length) {
                    // 日付行の後から最後までを本文とする
                    const contentLines = lines.slice(dateLineIndex + 1);
                    quotedText = contentLines.join('\n');
                }
            }
            
            // 画像取得
            const quotedMediaUrls = [];
            
            // 1. まず標準的な方法で画像を探す
            const quotedPhotoElements = quotedTweetContainer.querySelectorAll('[data-testid="tweetPhoto"]');
            
            quotedPhotoElements.forEach(photoElement => {
                const imgElement = photoElement.querySelector('img[src*="pbs.twimg.com/media"]');
                if (imgElement) {
                    const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                    if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
                        quotedMediaUrls.push(mediaUrl);
                    }
                }
            });
            
            // 2. 見つからなければ代替方法で探す
            if (quotedMediaUrls.length === 0) {
                // role="group"内の画像を探す（複数画像がある場合）
                const groupElements = quotedTweetContainer.querySelectorAll('[role="group"]');
                
                groupElements.forEach(groupElement => {
                    const imgElements = groupElement.querySelectorAll('img[src*="pbs.twimg.com/media"]');
                    
                    imgElements.forEach(imgElement => {
                        const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                        if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
                            quotedMediaUrls.push(mediaUrl);
                        }
                    });
                });
                
                // 直接画像要素を探す
                const imgElements = quotedTweetContainer.querySelectorAll('img[src*="pbs.twimg.com/media"]');
                
                imgElements.forEach(imgElement => {
                    const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                    if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
                        quotedMediaUrls.push(mediaUrl);
                    }
                });
            }
            
            // ツイートIDとリンク取得
            let quotedTweetId = '';
            let quotedTweetUrl = '';
            
            const quotedLinks = quotedTweetContainer.querySelectorAll('a[href*="/status/"]');
            
            for (const link of quotedLinks) {
                const href = link.href;
                if (href && href.includes('/status/')) {
                    const hrefParts = href.split('/');
                    const statusIndex = hrefParts.indexOf('status');
                    if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
                        quotedTweetId = hrefParts[statusIndex + 1];
                        quotedTweetUrl = href;
                        break;
                    }
                }
            }
            
            if (quotedAuthor && quotedText) {
                return {
                    author: quotedAuthor,
                    handle: quotedHandle,
                    text: quotedText,
                    id: quotedTweetId,
                    url: quotedTweetUrl,
                    mediaUrls: quotedMediaUrls
                };
            } else {
                return null;
            }
        }
        
        // ツイート内のメディアリンクを取得する関数
        function getMediaUrls(tweetElement) {
            const mediaUrls = [];
            
            // 方法1: tweetPhoto要素を探す（画像）
            const photoElements = tweetElement.querySelectorAll('[data-testid="tweetPhoto"]');
            photoElements.forEach(photoElement => {
                const imgElement = photoElement.querySelector('img[src*="pbs.twimg.com/media"]');
                if (imgElement) {
                    const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                    if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
                        mediaUrls.push(mediaUrl);
                    }
                }
            });
            
            // 方法2: 動画要素を探す
            const videoElements = tweetElement.querySelectorAll('video');
            videoElements.forEach(videoElement => {
                // blobで始まるsrcを処理
                if (videoElement.src && videoElement.src.startsWith('blob:')) {
                    try {
                        // 本来blobからデータを直接抽出するのは難しいため、代替URLを探す
                        // サムネイル画像（ポスター）からビデオIDを抽出
                        if (videoElement.poster && videoElement.poster.includes('pbs.twimg.com/tweet_video_thumb')) {
                            const mediaUrl = getVideoUrl(videoElement.poster);
                            if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
                                mediaUrls.push(mediaUrl);
                                return; // これ以上の処理は不要
                            }
                        }
                        
                        // ツイートIDからビデオIDを推測する
                        const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
                        if (tweetLink) {
                            const hrefParts = tweetLink.href.split('/');
                            const statusIndex = hrefParts.indexOf('status');
                            if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
                                const tweetId = hrefParts[statusIndex + 1];
                                // ツイートIDを含むメタデータURLを記録（後で手動で確認できるように）
                                const tweetInfoUrl = `https://twitter.com/i/status/${tweetId}`;
                                if (!mediaUrls.includes(tweetInfoUrl)) {
                                    mediaUrls.push(`[動画] ${tweetInfoUrl}`);
                                }
                            }
                        }
                    } catch (error) {
                        debug.error('Error processing blob URL: ' + error);
                    }
                } else {
                    // 通常のビデオURL処理（blob:でないケース）
                    // ポスター画像からメディアIDを抽出
                    if (videoElement.poster && videoElement.poster.includes('pbs.twimg.com/tweet_video_thumb')) {
                        const mediaUrl = getVideoUrl(videoElement.poster);
                        if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
                            mediaUrls.push(mediaUrl);
                        }
                    }
                    
                    // video要素のsrcを確認
                    if (videoElement.src && videoElement.src.includes('video.twimg.com')) {
                        if (!mediaUrls.includes(videoElement.src)) {
                            mediaUrls.push(videoElement.src);
                        }
                    }
                }
                
                // sourceタグがある場合
                const sourceElements = videoElement.querySelectorAll('source');
                sourceElements.forEach(sourceElement => {
                    if (sourceElement.src && sourceElement.src.includes('video.twimg.com')) {
                        if (!mediaUrls.includes(sourceElement.src)) {
                            mediaUrls.push(sourceElement.src);
                        }
                    } else if (sourceElement.src && sourceElement.src.startsWith('blob:')) {
                        // ここでもツイートIDを利用して情報を記録
                        const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
                        if (tweetLink) {
                            const hrefParts = tweetLink.href.split('/');
                            const statusIndex = hrefParts.indexOf('status');
                            if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
                                const tweetId = hrefParts[statusIndex + 1];
                                const tweetInfoUrl = `https://twitter.com/i/status/${tweetId}`;
                                if (!mediaUrls.includes(tweetInfoUrl)) {
                                    mediaUrls.push(`[動画] ${tweetInfoUrl}`);
                                }
                            }
                        }
                    }
                });
            });
            
            // 方法3: role="group"内の画像を探す（複数画像がある場合）
            if (mediaUrls.length === 0) {
                const groupElements = tweetElement.querySelectorAll('[role="group"]');
                groupElements.forEach(groupElement => {
                    const imgElements = groupElement.querySelectorAll('img[src*="pbs.twimg.com/media"]');
                    imgElements.forEach(imgElement => {
                        const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                        if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
                            mediaUrls.push(mediaUrl);
                        }
                    });
                });
            }
            
            // 方法4: 直接画像要素を探す
            if (mediaUrls.length === 0) {
                const imgElements = tweetElement.querySelectorAll('img[src*="pbs.twimg.com/media"]');
                imgElements.forEach(imgElement => {
                    const mediaUrl = getHighQualityMediaUrl(imgElement.src);
                    if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
                        mediaUrls.push(mediaUrl);
                    }
                });
            }
            
            return mediaUrls;
        }
        
        // 高画質メディアURLを取得する関数
        function getHighQualityMediaUrl(url) {
            if (!url || typeof url !== 'string' || !url.includes('pbs.twimg.com/media')) return null;
            
            try {
                // フォーマット（拡張子）を取得
                const formatMatch = url.match(/format=([^&]+)/);
                const format = formatMatch ? formatMatch[1] : 'jpg';
                
                // ベースURLを取得（?より前の部分）
                const baseUrl = url.split('?')[0];
                
                // URLの妥当性をチェック
                if (!baseUrl || baseUrl.length === 0) {
                    debug.error(`無効なベースURL: ${url}`);
                    return null;
                }
                
                // 拡張子で終わるURLに整形
                const cleanUrl = baseUrl + '.' + format;
                
                // URLの形式をチェック
                try {
                    new URL(cleanUrl);
                    return cleanUrl;
                } catch (urlError) {
                    debug.error(`無効なURL形式: ${cleanUrl}`);
                    return null;
                }
            } catch (error) {
                debug.error(`メディアURL処理エラー: ${error.message}`);
                return null;
            }
        }
        
        // ポスター画像からビデオURLを取得する関数
        function getVideoUrl(posterUrl) {
            if (!posterUrl || !posterUrl.includes('tweet_video_thumb')) return null;
            
            try {
                // ポスター画像のURLからビデオIDを抽出
                // 例：https://pbs.twimg.com/tweet_video_thumb/ABC123.jpg → ABC123
                const match = posterUrl.match(/tweet_video_thumb\/([^.]+)/);
                if (!match || !match[1]) return null;
                
                const videoId = match[1];
                
                // ビデオURLを構築
                // 高品質mp4を優先
                const videoUrl = `https://video.twimg.com/tweet_video/${videoId}.mp4`;
                
                return videoUrl;
            } catch (error) {
                debug.error(`動画URL生成エラー: ${error.message}`);
                return null;
            }
        }
        
        // ツイートテキストの完全なテキストを取得する関数（省略されている可能性も考慮）
        function getTweetFullText(tweetTextElement) {
            try {
                // まず直接テキストコンテンツを取得
                let fullText = tweetTextElement.textContent.trim();
                
                // リンク要素を収集し、省略されたURLを取得
                const linkMap = {};
                const tcoLinks = []; // t.coリンクを特別に収集
                const anchorElements = tweetTextElement.querySelectorAll('a[href]');
                anchorElements.forEach(anchor => {
                    if (anchor.href && anchor.textContent.trim()) {
                        const displayText = anchor.textContent.trim();
                        const href = anchor.href;
                        
                        // t.coの短縮URLを特別に処理
                        if (href.includes('t.co/')) {
                            tcoLinks.push({
                                displayText: displayText,
                                shortUrl: href
                            });
                        }
                        // 表示テキストがURLっぽい（短縮されている可能性あり）場合に処理
                        else if (displayText.match(/https?:\/\//i) || displayText.includes('…') || displayText.includes('...')) {
                            // 完全なURLをマッピング
                            linkMap[displayText] = href;
                        }
                    }
                });
                
                // 画像絵文字の抽出と変換
                const emojiImages = extractEmojiImages(tweetTextElement);
                
                // 「さらに表示」ボタンがあるか確認
                const showMoreButton = tweetTextElement.querySelector('[role="button"]');
                if (showMoreButton) {
                    const buttonText = showMoreButton.textContent.trim();
                    if (buttonText === 'さらに表示' || buttonText === 'Show more' || 
                        buttonText.match(/もっと見る/i) || buttonText.match(/show more/i)) {
                        
                        // 隠れている要素も含めて全テキストノードを列挙
                        const textNodes = [];
                        const walker = document.createTreeWalker(
                            tweetTextElement,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );
                        
                        let node;
                        while (node = walker.nextNode()) {
                            if (node.textContent.trim() && 
                                node.parentElement && 
                                !node.parentElement.closest('[role="button"]')) {
                                textNodes.push(node.textContent);
                            }
                        }
                        
                        // 全テキストノードを連結（空白で連結する代わりに、改行を検出・維持する処理を追加）
                        fullText = preserveLineBreaks(textNodes, tweetTextElement);
                        
                        // 「さらに表示」というテキストが混入している場合は除去
                        fullText = fullText.replace(/(さらに表示|Show more|もっと見る)/g, '').trim();
                    }
                }
                
                // 改行を維持するための処理を行う
                if (!showMoreButton || !showMoreButton.textContent.trim().match(/(さらに表示|Show more|もっと見る)/i)) {
                    // 「さらに表示」ボタンがない場合は、元のDOM構造から改行を検出
                    fullText = preserveLineBreaks([fullText], tweetTextElement);
                }
                
                // [object Object] または [Object] などの文字列を検出して削除または置換
                fullText = cleanupObjectText(fullText);
                
                // 抽出した絵文字画像の情報をテキストに挿入
                fullText = insertEmojiToText(fullText, emojiImages);
                
                // 省略されたURLを完全なURLに置き換え
                Object.keys(linkMap).forEach(shortUrl => {
                    const fullUrl = linkMap[shortUrl];
                    // ドメインが省略されていない場合は置き換え
                    if (shortUrl !== fullUrl) {
                        const escapedShortUrl = shortUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(escapedShortUrl, 'g');
                        fullText = fullText.replace(regex, fullUrl);
                    }
                });
                
                // t.coリンクを解決
                if (tcoLinks.length > 0) {
                    resolveTwitterShortUrls(tcoLinks, fullText).then(resolvedText => {
                        // この結果は非同期で得られるため、実際のコピー時に使われるデータオブジェクトを更新する必要がある
                        if (state.collectedThreadData && state.collectedThreadData.formattedText) {
                            state.collectedThreadData.formattedText = state.collectedThreadData.formattedText.replace(fullText, resolvedText);
                        }
                    }).catch(error => {
                        debug.error(`t.co URL解決エラー: ${error.message}`);
                    });
                }
                
                return fullText;
            } catch (error) {
                debug.error(`ツイートテキスト取得エラー: ${error.message}`);
                return tweetTextElement.textContent.trim();
            }
        }
        
        // 絵文字画像からUnicode絵文字情報を抽出する関数
        function extractEmojiImages(container) {
            const emojiData = [];
            
            try {
                // 絵文字画像要素の検出
                const imgElements = container.querySelectorAll('img');
                
                imgElements.forEach((img, index) => {
                    // Twitter/Xの絵文字画像は特定のクラスやURLパターンを持っていることが多い
                    if (
                        // 画像のサイズが小さい（絵文字はテキスト内に小さく表示される）
                        (img.width < 24 && img.height < 24) ||
                        // alt属性に絵文字のテキスト表現が含まれている場合
                        (img.alt && img.alt.length < 10 && /\p{Emoji}/u.test(img.alt)) ||
                        // src属性が特定のパターンに一致する場合
                        (img.src && (
                            img.src.includes('emoji') || 
                            img.src.includes('twemoji') ||
                            img.src.includes('twitter.com/hashflag')
                        )) ||
                        // 特定のクラス名を持つ場合
                        (img.className && (
                            img.className.includes('emoji') || 
                            img.className.includes('Emoji')
                        ))
                    ) {
                        // 絵文字データを収集
                        let emojiChar = '';
                        
                        // alt属性から絵文字を取得（優先度高）
                        if (img.alt && /\p{Emoji}/u.test(img.alt)) {
                            emojiChar = img.alt;
                        }
                        // 絵文字マッピングから取得を試みる
                        else if (img.src) {
                            const emojiFromMap = getEmojiFromImageSrc(img.src);
                            if (emojiFromMap) {
                                emojiChar = emojiFromMap;
                            }
                        }
                        
                        if (emojiChar) {
                            // テキスト内での位置を推定
                            let position = -1;
                            const parentText = img.parentNode ? img.parentNode.textContent : '';
                            
                            // [Object] や [object Object] などの文字列を探す
                            const objMatch = parentText.match(/\[(?:Object|object Object)\]/);
                            if (objMatch) {
                                position = objMatch.index;
                            }
                            
                            emojiData.push({
                                originalImg: img,
                                emojiChar: emojiChar,
                                position: position,
                                index: index // 元の順序を保持
                            });
                        }
                    }
                });
                
                return emojiData;
            } catch (error) {
                debug.error(`絵文字画像抽出エラー: ${error.message}`);
                return [];
            }
        }
        
        // 画像のURLからUnicode絵文字を推測する関数
        function getEmojiFromImageSrc(src) {
            try {
                // Twitterの絵文字画像URL内のパターンから絵文字を推測
                
                // Twemojiの特定パターンからコードポイントを抽出
                // 例: https://abs.twimg.com/emoji/v2/72x72/1f600.png
                const twemojiMatch = src.match(/\/emoji\/v\d+\/\d+x\d+\/([0-9a-f-]+)\.png/i);
                if (twemojiMatch && twemojiMatch[1]) {
                    return convertEmojiCodepointsToChar(twemojiMatch[1]);
                }
                
                // Twitterのハッシュフラグからの抽出を試みる
                const hashflagMatch = src.match(/\/hashflag\/emoji\/(\w+)/i);
                if (hashflagMatch && hashflagMatch[1]) {
                    // ハッシュフラグの場合はマッピングが必要だが、
                    // 正確なマッピングは難しいため、一般的な絵文字で代替
                    return "🏷️"; // タグ絵文字
                }
                
                return null;
            } catch (error) {
                debug.error(`絵文字画像URL解析エラー: ${error.message}`);
                return null;
            }
        }
        
        // 絵文字コードポイントを文字に変換する関数
        function convertEmojiCodepointsToChar(codepoints) {
            try {
                // ハイフンで区切られた16進数のコードポイントを処理
                const points = codepoints.split('-').map(cp => parseInt(cp, 16));
                
                // コードポイントからUnicode文字に変換
                return String.fromCodePoint(...points);
            } catch (error) {
                debug.error(`絵文字コードポイント変換エラー: ${error.message}`);
                return null;
            }
        }
        
        // [object Object] などのテキストをクリーンアップする関数
        function cleanupObjectText(text) {
            // [object Object] や [Object] というテキストを削除
            return text.replace(/\[(?:object Object|Object)\]/g, '');
        }
        
        // 絵文字情報をテキストに挿入する関数
        function insertEmojiToText(text, emojiData) {
            if (!emojiData || emojiData.length === 0) return text;
            
            let result = text;
            
            // 位置情報がある絵文字のみを処理
            const positionedEmojis = emojiData.filter(emoji => emoji.position >= 0);
            
            // 位置情報に基づいて降順でソート（後ろから処理して位置ズレを防ぐ）
            positionedEmojis.sort((a, b) => b.position - a.position);
            
            // 位置情報のある絵文字を挿入
            for (const emoji of positionedEmojis) {
                                        if (emoji.position >= 0 && emoji.position < result.length) {
                            result = result.substring(0, emoji.position) + emoji.emojiChar + result.substring(emoji.position);
                        }
            }
            
            return result;
        }
        
        // テキストの改行を保持する補助関数
        function preserveLineBreaks(textNodes, container) {
            try {
                // DOMの構造を解析して改行位置を特定
                const brElements = container.querySelectorAll('br');
                const linebreakPositions = [];
                
                // <br>要素の位置を特定
                if (brElements.length > 0) {
                    // 全テキストを文字列として結合
                    const combinedText = textNodes.join(' ');
                    
                    // 改行を挿入した結果のテキスト
                    let textWithLinebreaks = combinedText;
                    
                    // br要素の前後のテキストから改行位置を推定
                    for (const br of brElements) {
                        const prevSibling = br.previousSibling;
                        const nextSibling = br.nextSibling;
                        
                        if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
                            const prevText = prevSibling.textContent;
                            if (prevText && textWithLinebreaks.includes(prevText)) {
                                // 既に処理済みの改行数を考慮して位置を計算
                                const position = textWithLinebreaks.indexOf(prevText) + prevText.length;
                                linebreakPositions.push(position);
                            }
                        }
                    }
                    
                    // 改行位置情報をもとにテキストに改行を挿入
                    if (linebreakPositions.length > 0) {
                        linebreakPositions.sort((a, b) => b - a); // 後ろから処理するために降順ソート
                        
                        for (const position of linebreakPositions) {
                            if (position > 0 && position < textWithLinebreaks.length) {
                                textWithLinebreaks = textWithLinebreaks.slice(0, position) + '\n' + textWithLinebreaks.slice(position);
                            }
                        }
                        
                        return textWithLinebreaks;
                    }
                }
                
                // <br>要素がない場合や処理に失敗した場合は、段落要素(<p>, <div>など)の境界で改行を推定
                const paragraphElements = Array.from(container.querySelectorAll('p, div[dir="auto"]'));
                
                if (paragraphElements.length > 1) {
                    // 各段落要素のテキストを抽出して改行で結合
                    const paragraphs = paragraphElements
                        .map(el => el.textContent.trim())
                        .filter(text => text && !text.match(/(さらに表示|Show more|もっと見る)/i));
                    
                    if (paragraphs.length > 0) {
                        return paragraphs.join('\n');
                    }
                }
                
                // どの方法でも改行を検出できなかった場合は、単純に連結したテキストを返す
                return textNodes.join(' ').trim();
            } catch (error) {
                debug.error(`改行保持処理エラー: ${error.message}`);
                // エラーが発生した場合は元のテキストを空白で連結して返す
                return textNodes.join(' ').trim();
            }
        }
        
        // t.coの短縮URLを解決する関数
        async function resolveTwitterShortUrls(tcoLinks, text) {
            let resolvedText = text;
            
            for (const linkInfo of tcoLinks) {
                try {
                    const originalUrl = await followRedirect(linkInfo.shortUrl);
                    if (originalUrl && originalUrl !== linkInfo.shortUrl) {
                        // t.coのURLをオリジナルのURLに置き換え
                        const displayPattern = new RegExp(escapeRegExp(linkInfo.displayText), 'g');
                        resolvedText = resolvedText.replace(displayPattern, originalUrl);
                    }
                } catch (error) {
                    debug.error(`t.co URL解決失敗 ${linkInfo.shortUrl}: ${error.message}`);
                }
            }
            
            return resolvedText;
        }
        
        // リダイレクト先を取得する関数
        function followRedirect(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    timeout: 5000,
                    onload: function(response) {
                        // リダイレクト先のURLを取得
                        const finalUrl = response.finalUrl || url;
                        resolve(finalUrl);
                    },
                    onerror: function(error) {
                        reject(new Error('Failed to follow redirect: ' + error));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timed out while following redirect'));
                    }
                });
            });
        }
        
        // スクロールしながらツイートを収集
        async function scrollAndCollect() {
            const maxScrollAttempts = 30;
            const scrollDelay = 700; // より確実にロードされるように待機時間を増やす
            
            // 「さらに表示」ボタンを探してクリックする関数
            async function expandTruncatedTweets() {
                try {
                    const expandButtons = document.querySelectorAll('[data-testid="tweet"] [role="button"]');
                    let expandedCount = 0;

                    for (const button of expandButtons) {
                        try {
                            // テキスト内容をチェックして「さらに表示」ボタンを特定
                            const buttonText = button.textContent ? button.textContent.trim() : '';
                            if (buttonText === 'さらに表示' || buttonText === 'Show more' || 
                                buttonText.match(/もっと見る/i) || buttonText.match(/show more/i)) {
                                
                                // リンクボタンでなく、単純な展開ボタンかを確認
                                const isExpandButton = !button.hasAttribute('href') && 
                                                      !button.querySelector('a') && 
                                                      button.closest('[data-testid="tweet"]');
                                
                                if (isExpandButton && button.click) {
                                    button.click();
                                    expandedCount++;
                                    // 少し待機して展開が完了するようにする
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }
                        } catch (error) {
                            debug.error(`個別ツイート展開エラー: ${error.message}`);
                            continue;
                        }
                    }
                    
                    return expandedCount;
                } catch (error) {
                    debug.error(`ツイート展開処理エラー: ${error.message}`);
                    return 0;
                }
            }
            
            try {
                // 最初のスクロール前に一度展開処理
                await expandTruncatedTweets();
                collectVisibleTweets();
                let lastTweetCount = tweets.length;
                let noNewTweetsCount = 0;
                
                for (let i = 0; i < maxScrollAttempts; i++) {
                    try {
                        window.scrollBy(0, window.innerHeight * 0.7);
                        
                        await new Promise(resolve => setTimeout(resolve, scrollDelay));
                        
                        // スクロール後、表示された「さらに表示」ボタンを展開
                        await expandTruncatedTweets();
                        collectVisibleTweets();
                        
                        if (tweets.length === lastTweetCount) {
                            noNewTweetsCount++;
                            if (noNewTweetsCount >= 3) {
                                break; // 3回連続で新しいツイートが見つからなければ終了
                            }
                        } else {
                            lastTweetCount = tweets.length;
                            noNewTweetsCount = 0;
                        }
                    } catch (scrollError) {
                        debug.error(`スクロール処理エラー (試行 ${i+1}): ${scrollError.message}`);
                        // スクロールエラーが発生しても処理を続行
                        continue;
                    }
                }
                
                // 元のスクロール位置に戻る
                try {
                    window.scrollTo(0, originalScrollPos);
                } catch (scrollBackError) {
                    debug.error(`スクロール位置復元エラー: ${scrollBackError.message}`);
                }
            } catch (error) {
                debug.error(`スクロール収集処理エラー: ${error.message}`);
                throw error;
            }
        }
        
        await scrollAndCollect();
        
        // 収集したツイートを時系列順に並べ替え (古い順)
        tweets.sort((a, b) => {
            const dateA = new Date(a.time.replace(/年|月|日/g, '-').replace(/:/g, '-').split(' ')[0]);
            const dateB = new Date(b.time.replace(/年|月|日/g, '-').replace(/:/g, '-').split(' ')[0]);
            return dateA - dateB;
        });
        
        // 起点が設定されている場合は、起点以降のツイートのみを対象とする
        let tweetsToProcess = tweets;
        if (state.startFromTweetId) {
            const startIndex = tweets.findIndex(tweet => tweet.id === state.startFromTweetId);
            if (startIndex !== -1) {
                tweetsToProcess = tweets.slice(startIndex);
                debug.log(`起点フィルタ適用: ${tweets.length}件 -> ${tweetsToProcess.length}件`);
            } else {
                debug.log(`起点ツイート（ID: ${state.startFromTweetId}）が見つかりません。全てのツイートを処理します。`);
            }
        }
        
        // 収集したツイートをフォーマット
        let formattedTweets = '';
        
        if (tweetsToProcess.length > 0) {
            // コピーモードに応じて処理を分岐
            switch (state.copyMode) {
                case 'first':
                    // 最初のツイートのみを処理
                    formattedTweets = formatSingleTweet(tweetsToProcess[0]);
                    break;
                    
                case 'shitaraba':
                    // したらば掲示板用（4096文字以内）に処理
                    formattedTweets = formatTweetsWithLimit(tweetsToProcess, 4096);
                    break;
                    
                case '5ch':
                    // 5ch用（2048文字以内）に処理
                    formattedTweets = formatTweetsWithLimit(tweetsToProcess, 2048);
                    break;
                    
                case 'all':
                default:
                    // 全てのツイートを処理（既存の処理）
                    formattedTweets = formatAllTweets(tweetsToProcess);
                    break;
            }
        }
        
            // クリップボードAPIを直接使わず、戻り値として必要な情報を返す
            return {
                formattedText: formattedTweets,
                summary: tweetsToProcess.length > 0 ? 
                    generateSummary(tweetsToProcess, formattedTweets, state.copyMode, state.startFromTweetId ? state.startFromTweetAuthor : null) : 
                    'コピーするツイートが見つかりませんでした'
            };
        } catch (error) {
            debug.error(`ツイート収集中にエラーが発生: ${error.message}`);
            debug.error(`エラースタック: ${error.stack}`);
            
            // エラーが発生した場合でも、部分的に収集できたデータがあれば返す
            const tweets = [];
            return {
                formattedText: '',
                summary: `エラーが発生しました: ${error.message}`
            };
        }
    }
    
    // 単一ツイートのフォーマット
    function formatSingleTweet(tweet) {
        let formatted = `${tweet.author} ${tweet.handle}\n${tweet.text}\n${tweet.time}\n`;
        
        // メディアリンクを追加
        if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
            formatted += tweet.mediaUrls.map(url => `${url}`).join('\n') + '\n';
        }
        
        // 引用ツイートがある場合に追加
        if (tweet.quotedTweet) {
            const quoted = tweet.quotedTweet;
            formatted += '\n【引用ツイート】\n';
            formatted += `${quoted.author} ${quoted.handle}\n${quoted.text}\n`;
            
            // 引用ツイートのメディアを追加
            if (quoted.mediaUrls && quoted.mediaUrls.length > 0) {
                formatted += quoted.mediaUrls.map(url => `${url}`).join('\n') + '\n';
            }
            
            // 引用ツイートのURLを追加
            if (quoted.url) {
                formatted += `${quoted.url}\n`;
            }
        }
        
        formatted += '\n';
        formatted += `${location.href}\n`;
        
        return formatted;
    }
    
    // 文字数制限付きのツイートフォーマット
    function formatTweetsWithLimit(tweets, limit) {
        if (!tweets || tweets.length === 0) {
            return '';
        }
        
        let formatted = '';
        let currentLength = 0;
        
        for (let i = 0; i < tweets.length; i++) {
            const tweet = tweets[i];
            
            // 次のツイートのフォーマット内容を一時的に生成
            let nextTweetText = '';
            
            if (i === 0) {
                // 最初のツイートは必ず含める（ただし制限を超える場合は切り詰める）
                nextTweetText = formatSingleTweet(tweet);
                
                // 最初のツイートが制限を超える場合は切り詰める
                if (nextTweetText.length > limit) {
                    // ツイート本文のみを切り詰めて基本情報は保持
                    const basicInfo = `${tweet.author} ${tweet.handle}\n`;
                    const timeInfo = `\n${tweet.time}\n`;
                    const urlInfo = `\n${location.href}\n`;
                    
                    const availableLength = limit - basicInfo.length - timeInfo.length - urlInfo.length - 20; // 余裕を持たせる
                    
                    if (availableLength > 50) {
                        const truncatedText = tweet.text.substring(0, availableLength) + '...';
                        nextTweetText = basicInfo + truncatedText + timeInfo + urlInfo;
                    } else {
                        // 最低限の情報のみ
                        nextTweetText = basicInfo + '(本文が長すぎるため省略)' + timeInfo + urlInfo;
                    }
                }
            } else {
                nextTweetText = `\n${tweet.author} ${tweet.handle}\n${tweet.text}\n${tweet.time}\n`;
                
                // メディアリンクを追加
                if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
                    nextTweetText += tweet.mediaUrls.map(url => `${url}`).join('\n') + '\n';
                }
                
                // 引用ツイートがある場合に追加
                if (tweet.quotedTweet) {
                    const quoted = tweet.quotedTweet;
                    nextTweetText += '\n【引用ツイート】\n';
                    nextTweetText += `${quoted.author} ${quoted.handle}\n${quoted.text}\n`;
                    
                    // 引用ツイートのメディアを追加
                    if (quoted.mediaUrls && quoted.mediaUrls.length > 0) {
                        nextTweetText += quoted.mediaUrls.map(url => `${url}`).join('\n') + '\n';
                    }
                    
                    // 引用ツイートのURLを追加
                    if (quoted.url) {
                        nextTweetText += `${quoted.url}\n`;
                    }
                }
            }
            
            // 文字数制限をチェック
            if (currentLength + nextTweetText.length <= limit) {
                formatted += nextTweetText;
                currentLength += nextTweetText.length;
            } else {
                // 制限に達した場合は処理を終了
                if (i > 0) {
                    formatted += '\n(文字数制限により以降のツイートは省略されました)';
                }
                break;
            }
        }
        
        // 空の場合は最低限の情報を返す
        if (!formatted.trim()) {
            formatted = `データ収集エラー\n${location.href}\n`;
        }
        
        return formatted;
    }
    
    // 全ツイートのフォーマット（既存の処理を関数化）
    function formatAllTweets(tweets) {
        let formatted = formatSingleTweet(tweets[0]);
        
        // 残りのツイートを追加（2番目以降）
        if (tweets.length > 1) {
            formatted += tweets.slice(1).map(tweet => {
                let tweetText = `${tweet.author} ${tweet.handle}\n${tweet.text}\n${tweet.time}\n`;
                
                // メディアリンクを追加
                if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
                    tweetText += tweet.mediaUrls.map(url => `${url}`).join('\n') + '\n';
                }
                
                // 引用ツイートがある場合に追加
                if (tweet.quotedTweet) {
                    const quoted = tweet.quotedTweet;
                    tweetText += '\n【引用ツイート】\n';
                    tweetText += `${quoted.author} ${quoted.handle}\n${quoted.text}\n`;
                    
                    // 引用ツイートのメディアを追加
                    if (quoted.mediaUrls && quoted.mediaUrls.length > 0) {
                        tweetText += quoted.mediaUrls.map(url => `${url}`).join('\n') + '\n';
                    }
                    
                    // 引用ツイートのURLを追加
                    if (quoted.url) {
                        tweetText += `${quoted.url}\n`;
                    }
                }
                
                return tweetText;
            }).join('\n');
        }
        
        return formatted;
    }
    
    // サマリーメッセージの生成
    function generateSummary(tweets, formattedText, mode, startFromAuthor = null) {
        let summary = '';
        
        // 起点が設定されている場合のプレフィックス
        const startPrefix = startFromAuthor ? `${startFromAuthor}から` : '';
        
        switch (mode) {
            case 'first':
                summary = startFromAuthor ? `${startFromAuthor}のツイートをコピーしました` : '最初のツイートをコピーしました';
                break;
            case 'shitaraba':
                // 実際に含まれたツイート数を計算（より正確に）
                const tweetSeparators = formattedText.split('\n\n').filter(section => section.trim().length > 0);
                const includedTweetsShitaraba = Math.max(1, tweetSeparators.length - 1); // URLセクションを除く
                summary = `${startPrefix}${includedTweetsShitaraba}件のツイートをしたらば掲示板用（4096文字以内）でコピーしました`;
                break;
            case '5ch':
                // 実際に含まれたツイート数を計算（より正確に）
                const tweetSeparators5ch = formattedText.split('\n\n').filter(section => section.trim().length > 0);
                const includedTweets5ch = Math.max(1, tweetSeparators5ch.length - 1); // URLセクションを除く
                summary = `${startPrefix}${includedTweets5ch}件のツイートを5ch用（2048文字以内）でコピーしました`;
                break;
            case 'all':
            default:
                summary = `${startPrefix}${tweets.length}件のツイートをコピーしました`;
                break;
        }
        
        summary += ` (計${formatByteSize(formattedText.length)}文字)`;
        
        // 文字数制限モードで制限に達した場合の注記
        if ((mode === 'shitaraba' && formattedText.length >= 3900) || 
            (mode === '5ch' && formattedText.length >= 1900)) {
            summary += ' ※文字数制限により一部省略';
        }
        
        return summary;
    }
    
    // 文字数をわかりやすく表示する関数
    function formatByteSize(size) {
        if (size < 1000) {
            return size;
        } else if (size < 10000) {
            return (size / 1000).toFixed(1) + 'k';
        } else {
            return Math.floor(size / 1000) + 'k';
        }
    }
    
    // 日時のフォーマット
    function formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    }
    
    // Twitterのステータスページかどうか確認
    function isTwitterStatusPage() {
        return location.href.match(/https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/[0-9]+/);
    }
    
    // 現在のURLに基づいてボタンを表示/非表示
    function updateButtonVisibility() {
        if (isTwitterStatusPage()) {
            addCopyButton();
        } else {
            removeButton();
            // ページが変更された場合は起点をリセット
            if (state.startFromTweetId) {
                resetStartPoint();
            }
        }
    }
    
    // URLの変更を監視
    function observeUrlChanges() {
        try {
            // URLの変更を監視するためのハック
            const pushState = history.pushState;
            const replaceState = history.replaceState;
            
            // pushStateをオーバーライド
            history.pushState = function() {
                try {
                    pushState.apply(history, arguments);
                    updateButtonVisibility();
                } catch (error) {
                    debug.error(`pushState override error: ${error.message}`);
                }
            };
            
            // replaceStateをオーバーライド
            history.replaceState = function() {
                try {
                    replaceState.apply(history, arguments);
                    updateButtonVisibility();
                } catch (error) {
                    debug.error(`replaceState override error: ${error.message}`);
                }
            };
            
            // popstateイベントも監視
            window.addEventListener('popstate', () => {
                try {
                    updateButtonVisibility();
                } catch (error) {
                    debug.error(`popstate event error: ${error.message}`);
                }
            });
            
            // hashchangeイベントも監視
            window.addEventListener('hashchange', () => {
                try {
                    updateButtonVisibility();
                } catch (error) {
                    debug.error(`hashchange event error: ${error.message}`);
                }
            });
            
            // DOMの変更も監視（ページ内容が変わった場合）
            const observer = new MutationObserver((mutations) => {
                try {
                    let shouldCheck = false;
                    
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1 && (
                                    node.tagName === 'MAIN' || 
                                    (node.querySelector && node.querySelector('article[data-testid="tweet"]'))
                                )) {
                                    shouldCheck = true;
                                    break;
                                }
                            }
                            
                            if (shouldCheck) break;
                        }
                    }
                    
                    if (shouldCheck) {
                        setTimeout(() => {
                            try {
                                updateButtonVisibility();
                                // 新しいツイートが読み込まれた場合、起点設定ボタンを追加
                                if (isTwitterStatusPage()) {
                                    addStartPointButtons();
                                }
                            } catch (error) {
                                debug.error(`Delayed updateButtonVisibility error: ${error.message}`);
                            }
                        }, 500);
                    }
                } catch (error) {
                    debug.error(`MutationObserver callback error: ${error.message}`);
                }
            });
            
            if (document.body) {
                observer.observe(document.body, { 
                    childList: true, 
                    subtree: true,
                    attributes: false,
                    characterData: false
                });
            } else {
                debug.error('document.body is not available for MutationObserver');
            }
        } catch (error) {
            debug.error(`observeUrlChanges initialization error: ${error.message}`);
        }
    }
    
    // 初期化
    function init() {
        try {
            updateButtonVisibility();
            observeUrlChanges();
        } catch (error) {
            debug.error(`初期化中にエラーが発生: ${error.message}`);
        }
    }
    
    // ページロード時に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 各ツイートに起点設定ボタンを追加
    function addStartPointButtons() {
        const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
        
        tweetElements.forEach(tweetElement => {
            // 既にボタンが追加されているかチェック
            if (tweetElement.querySelector('.start-point-button')) return;
            
            // ツイートコンテナにクラスを追加（スタイリング用）
            if (!tweetElement.classList.contains('tweet-container')) {
                tweetElement.classList.add('tweet-container');
            }
            
            // ツイートIDを取得
            const tweetLink = tweetElement.querySelector('a[href*="/status/"]');
            if (!tweetLink) return;
            
            const hrefParts = tweetLink.href.split('/');
            const statusIndex = hrefParts.indexOf('status');
            if (statusIndex === -1 || statusIndex + 1 >= hrefParts.length) return;
            
            const tweetId = hrefParts[statusIndex + 1];
            
            // 起点設定ボタンを作成
            const startButton = document.createElement('button');
            startButton.className = 'start-point-button';
            startButton.textContent = '★';
            startButton.title = 'この位置からコピー開始';
            startButton.dataset.tweetId = tweetId;
            
            // 既に起点に設定されているツイートかチェック
            if (state.startFromTweetId === tweetId) {
                startButton.classList.add('active');
                startButton.textContent = '✓';
                tweetElement.classList.add('start-point-set');
            }
            
            // クリックイベントを追加
            startButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setStartPoint(tweetElement, tweetId);
            });
            
            // ボタンをツイート要素に追加
            tweetElement.appendChild(startButton);
        });
    }
    
    // 起点を設定する関数
    function setStartPoint(tweetElement, tweetId) {
        try {
            // 以前の起点設定を解除
            if (state.startFromTweetId) {
                const prevHighlighted = document.querySelectorAll('.tweet-container.start-point-set');
                prevHighlighted.forEach(tweet => {
                    tweet.classList.remove('start-point-set');
                    const prevButton = tweet.querySelector('.start-point-button');
                    if (prevButton) {
                        prevButton.classList.remove('active');
                        prevButton.textContent = '★';
                    }
                });
            }
            
            // 新しい起点を設定
            const author = getDisplayName(tweetElement);
            const handle = getUsernameHandle(tweetElement);
            const tweetTextElement = tweetElement.querySelector('div[data-testid="tweetText"]');
            const tweetText = tweetTextElement ? tweetTextElement.textContent.trim() : '';
            
            // 状態を更新
            state.startFromTweetId = tweetId;
            state.startFromTweetAuthor = author;
            state.startFromTweetText = tweetText.length > 50 ? tweetText.substring(0, 50) + '...' : tweetText;
            
            // 視覚的フィードバック
            tweetElement.classList.add('start-point-set');
            const startButton = tweetElement.querySelector('.start-point-button');
            if (startButton) {
                startButton.classList.add('active');
                startButton.textContent = '✓';
            }
            
            // UI要素を更新
            updateResetButton();
            updateMainCopyButtonText();
            
            // トースト通知
            showToast('起点設定完了', `${author}のツイートを起点に設定しました`);
            debug.log(`Start point set: ${tweetId} by ${author}`);
            
        } catch (error) {
            debug.error(`起点設定エラー: ${error.message}`);
            showToast('エラー', '起点の設定に失敗しました');
        }
    }
})(); 