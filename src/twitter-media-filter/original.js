// ==UserScript==
// @name         Twitter/X Media Filter
// @namespace    TwitterMediaFilter
// @version      1.1
// @description  タイムライン/リスト/詳細ページで画像/動画を含まないツイートを非表示にする
// @author       roflsunriz
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @updateURL    https://gist.githubusercontent.com/roflsunriz/b681199a5da925299a474366e73c793e/raw/twitter_media_filter.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/b681199a5da925299a474366e73c793e/raw/twitter_media_filter.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定のデフォルト値
    const defaultSettings = {
        enableOnTimeline: false,     // ホームタイムラインで有効にする
        enableOnLists: false,        // リストで有効にする
        enableOnProfile: false,      // プロフィールページで有効にする
        enableOnSearch: false,       // 検索結果で有効にする
        enableOnTweetDetail: false,  // ツイート詳細ページで有効にする
        debugMode: false            // デバッグモード
    };

    // 設定の読み込み
    let settings = Object.assign({}, defaultSettings, GM_getValue('settings', {}));

    // デバッグログ関数
    const debug = (message) => {
        if (settings.debugMode) {
            console.log(`[Twitter Media Filter] ${message}`);
        }
    };

    // シャドウDOM用のスタイル定義
    const getModalStyles = () => `
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .tmf-modal {
            width: 400px;
            background-color: white;
            border-radius: 16px;
            padding: 20px;
            color: #000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .tmf-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .tmf-modal-title {
            font-size: 20px;
            font-weight: bold;
        }
        
        .tmf-modal-close {
            cursor: pointer;
            font-size: 20px;
        }
        
        .tmf-setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .tmf-setting-item:last-child {
            border-bottom: none;
        }
        
        .tmf-switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
        }
        
        .tmf-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .tmf-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 24px;
        }
        
        .tmf-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .tmf-slider {
            background-color: #1d9bf0;
        }
        
        input:focus + .tmf-slider {
            box-shadow: 0 0 1px #1d9bf0;
        }
        
        input:checked + .tmf-slider:before {
            -webkit-transform: translateX(22px);
            -ms-transform: translateX(22px);
            transform: translateX(22px);
        }
        
        .tmf-setting-label {
            font-size: 15px;
        }
        
        .tmf-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        
        .tmf-footer button {
            background-color: #1d9bf0;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .dark-mode .tmf-modal {
            background-color: #15202b;
            color: white;
        }
        
        .dark-mode .tmf-setting-item {
            border-bottom: 1px solid #38444d;
        }
    `;

    // シャドウDOM内でモーダルを作成
    const createSettingsUI = () => {
        // シャドウDOMホスト要素を作成
        const shadowHost = document.createElement('div');
        shadowHost.id = 'tmf-shadow-host';
        
        // シャドウDOMを作成
        const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
        
        // スタイルを追加
        const style = document.createElement('style');
        style.textContent = getModalStyles();
        shadowRoot.appendChild(style);
        
        // モーダル本体を作成
        const modalContainer = document.createElement('div');
        
        // ダークモード検出
        const isDarkMode = document.documentElement.style.colorScheme === 'dark' || 
                          document.body.classList.contains('dark-theme') ||
                          window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        modalContainer.innerHTML = `
            <div class="tmf-modal ${isDarkMode ? 'dark-mode' : ''}">
                <div class="tmf-modal-header">
                    <div class="tmf-modal-title">Twitter Media Filter 設定</div>
                    <div class="tmf-modal-close">✕</div>
                </div>
                <div class="tmf-settings-container">
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">ホームタイムライン</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-timeline" ${settings.enableOnTimeline ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">リスト</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-lists" ${settings.enableOnLists ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">プロフィールページ</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-profile" ${settings.enableOnProfile ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">検索結果</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-search" ${settings.enableOnSearch ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">ツイート詳細</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-tweet-detail" ${settings.enableOnTweetDetail ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                    <div class="tmf-setting-item">
                        <span class="tmf-setting-label">デバッグモード</span>
                        <label class="tmf-switch">
                            <input type="checkbox" id="tmf-debug" ${settings.debugMode ? 'checked' : ''}>
                            <span class="tmf-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="tmf-footer">
                    <button id="tmf-save-button">保存</button>
                </div>
            </div>
        `;
        
        shadowRoot.appendChild(modalContainer);
        document.body.appendChild(shadowHost);
        
        // イベントリスナーの設定（シャドウDOM内の要素に対して）
        const closeButton = shadowRoot.querySelector('.tmf-modal-close');
        const saveButton = shadowRoot.querySelector('#tmf-save-button');
        
        closeButton.addEventListener('click', () => {
            shadowHost.style.display = 'none';
        });
        
        // オーバーレイクリックで閉じる
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                shadowHost.style.display = 'none';
            }
        });
        
        saveButton.addEventListener('click', () => {
            // 設定の更新（シャドウDOM内の要素から値を取得）
            settings.enableOnTimeline = shadowRoot.querySelector('#tmf-timeline').checked;
            settings.enableOnLists = shadowRoot.querySelector('#tmf-lists').checked;
            settings.enableOnProfile = shadowRoot.querySelector('#tmf-profile').checked;
            settings.enableOnSearch = shadowRoot.querySelector('#tmf-search').checked;
            settings.enableOnTweetDetail = shadowRoot.querySelector('#tmf-tweet-detail').checked;
            settings.debugMode = shadowRoot.querySelector('#tmf-debug').checked;
            
            // 設定を保存
            saveSettings();
            
            // モーダルを閉じる
            shadowHost.style.display = 'none';
            
            // タイムラインを再処理
            processTimeline();
        });
        
        return { shadowHost, shadowRoot };
    };
    
    // モーダルを表示する関数
    const showSettingsModal = () => {
        let shadowHost = document.getElementById('tmf-shadow-host');
        let shadowRoot;
        
        // シャドウDOMがまだ作成されていない場合は作成
        if (!shadowHost) {
            const result = createSettingsUI();
            shadowHost = result.shadowHost;
            shadowRoot = result.shadowRoot;
        } else {
            // すでに存在する場合は、現在の設定値を反映
            // 注意: closedモードのシャドウDOMなので、新しい参照を取得する必要がある
            shadowHost.remove();
            const result = createSettingsUI();
            shadowHost = result.shadowHost;
            shadowRoot = result.shadowRoot;
        }
        
        // モーダルを表示
        shadowHost.style.display = 'flex';
    };

    // 設定の保存
    const saveSettings = () => {
        GM_setValue('settings', settings);
        debug('設定を保存しました: ' + JSON.stringify(settings));
    };

    // 現在のページタイプを取得
    const getPageType = () => {
        const path = window.location.pathname;
        
        if (path === '/home') return 'timeline';
        if (path.includes('/lists/')) return 'list';
        if (path.match(/^\/[^/]+$/) && !path.match(/^\/search$|^\/explore$|^\/home$/)) return 'profile';
        if (path.match(/^\/search/)) return 'search';
        if (path.match(/\/status\//)) return 'tweetDetail';
        
        return 'other';
    };

    // 現在のページタイプで機能を有効にするかどうか判断
    const isEnabledForCurrentPage = () => {
        const pageType = getPageType();
        
        switch(pageType) {
            case 'timeline': return settings.enableOnTimeline;
            case 'list': return settings.enableOnLists;
            case 'profile': return settings.enableOnProfile;
            case 'search': return settings.enableOnSearch;
            case 'tweetDetail': return settings.enableOnTweetDetail;
            default: return false;
        }
    };

    // ツイートに画像や動画が含まれているかチェック
    const hasTweetMedia = (tweetElement) => {
        // 画像や動画要素を検索
        const mediaSelectors = [
            'div[data-testid="tweetPhoto"]',
            'div[data-testid="videoPlayer"]',
            'div[data-testid="card.layoutSmall.media"]',
            'div[data-testid="card.layoutLarge.media"]'
        ];
        
        for (const selector of mediaSelectors) {
            if (tweetElement.querySelector(selector)) {
                return true;
            }
        }
        
        return false;
    };

    // ツイートを処理
    const processTweet = (tweetElement) => {
        // "Show more replies"や"Show replies"などの特殊要素はスキップ
        if (!tweetElement.querySelector('div[data-testid="tweetText"], time')) {
            return;
        }
        
        // 既に処理済みのツイートはスキップ
        if (tweetElement.hasAttribute('data-media-filter-processed')) {
            return;
        }
        
        // ツイートに画像や動画が含まれていない場合は非表示にする
        if (!hasTweetMedia(tweetElement)) {
            tweetElement.style.display = 'none';
            debug('ツイートを非表示にしました');
        }
        
        // 処理済みとしてマーク
        tweetElement.setAttribute('data-media-filter-processed', 'true');
    };

    // タイムラインのツイートを処理
    const processTimeline = () => {
        if (!isEnabledForCurrentPage()) {
            return;
        }
        
        debug('タイムライン処理開始');
        
        // ツイート要素のセレクタ
        const tweetSelector = 'article[data-testid="tweet"]';
        const tweets = document.querySelectorAll(tweetSelector);
        
        tweets.forEach(processTweet);
    };

    // MutationObserverのコールバック
    const observerCallback = (mutations, observer) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const pageType = getPageType();
                debug(`DOM変更を検知: ${pageType} ページ`);
                
                setTimeout(processTimeline, 100); // 少し遅延させてDOMが完全に読み込まれるのを待つ
            }
        }
    };

    // MutationObserverの設定
    const setupObserver = () => {
        const observer = new MutationObserver(observerCallback);
        
        // mainタグ（Twitter SPAのメインコンテンツエリア）を監視
        const mainElement = document.querySelector('main');
        if (mainElement) {
            observer.observe(mainElement, {
                childList: true,
                subtree: true
            });
            debug('メイン要素の監視を開始しました');
        } else {
            // mainタグが見つからない場合は、bodyを監視して後でmainを見つける
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            debug('body要素の監視を開始しました（main要素を探しています）');
            
            // 定期的にmain要素を探し、見つかったらそちらを監視
            const findMainInterval = setInterval(() => {
                const mainElement = document.querySelector('main');
                if (mainElement) {
                    clearInterval(findMainInterval);
                    observer.disconnect();
                    observer.observe(mainElement, {
                        childList: true,
                        subtree: true
                    });
                    debug('main要素を見つけて監視を開始しました');
                    processTimeline(); // 初期処理
                }
            }, 1000);
        }
    };

    // ページ遷移を検知
    const handlePageChange = () => {
        let lastUrl = location.href;
        
        // URL変更を監視
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debug(`ページ遷移を検知: ${location.href}`);
                setTimeout(processTimeline, 500); // ページ遷移後に少し待ってから処理
            }
        });
        
        // titleを監視してURLの変更を検知（React Router対策）
        urlObserver.observe(document.querySelector('title'), {
            subtree: true,
            childList: true
        });
    };

    // スクリプトの初期化
    const init = () => {
        debug('Twitter Media Filterを初期化中...');
        GM_registerMenuCommand('設定', showSettingsModal);
        setupObserver();
        handlePageChange();
        
        // 初期表示時にも実行
        setTimeout(processTimeline, 1000);
    };

    // DOMが読み込まれたら初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 