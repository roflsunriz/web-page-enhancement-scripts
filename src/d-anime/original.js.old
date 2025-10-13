// ==UserScript==
// @name         dAnimeNicoCommentRenderer2
// @namespace    dAnimeNicoCommentRenderer2
// @version      4.3
// @description  dアニメストアの動画にニコニコ動画のコメントを流すUserscript
// @author      roflsunriz
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc*
// @match        https://animestore.docomo.ne.jp/animestore/mp_viw_pc*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-end
// @connect      nicovideo.jp
// @connect      *.nicovideo.jp
// @connect      public.nvcomment.nicovideo.jp
// @updateURL    https://gist.githubusercontent.com/roflsunriz/521b6e81ab7ee0dc772f1996de6016c3/raw/dAnimeNicoCommentRenderer2.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/521b6e81ab7ee0dc772f1996de6016c3/raw/dAnimeNicoCommentRenderer2.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp
// ==/UserScript==

// グローバルオブジェクトを最初に定義
unsafeWindow.dAniRenderer = {
    classes: {},
    instances: {},
    utils: {},
    debug: {
        showState() {
            console.log('Current instances:', window.dAniRenderer.instances);
        },
        showSettings() {
            if (window.dAniRenderer.instances.settingsManager) {
                console.log('Current settings:', window.dAniRenderer.instances.settingsManager.loadSettings());
            } else {
                console.log('SettingsManager not initialized');
            }
        },
        showComments() {
            if (window.dAniRenderer.instances.renderer) {
                console.log('Current comments:', window.dAniRenderer.instances.renderer.comments);
            } else {
                console.log('CommentRenderer not initialized');
            }
        }
    }
};

// 即時実行関数の開始
(function() {
    'use strict';

    // 基本的な設定値
    const DEFAULT_SETTINGS = {
        commentColor: '#FFFFFF',
        commentOpacity: 0.75,
        isCommentVisible: true,
        ngWords: [],
        ngRegexps: []
    };

    // エラーログ用のユーティリティ関数
    const ErrorLogger = {
        log(error, context = '', additionalInfo = {}) {
            const errorInfo = {
                message: error?.message || 'Unknown error',
                stack: error?.stack || 'No stack trace',
                name: error?.name || 'UnknownError',
                context,
                timestamp: new Date().toISOString(),
                ...additionalInfo
            };
            console.error(`[dAnimeNicoCommentRenderer2] ${context}:`, errorInfo);
            return errorInfo;
        },
        
        logAndNotify(error, context = '', notificationType = 'error') {
            const errorInfo = this.log(error, context);
            try {
                if (typeof NotificationManager !== 'undefined' && NotificationManager.show) {
                    NotificationManager.show(`${context}: ${error?.message || 'Unknown error'}`, notificationType);
                }
            } catch (notifyError) {
                console.error('[dAnimeNicoCommentRenderer2] Failed to show notification:', notifyError);
            }
            return errorInfo;
        }
    };

    // シャドウDOM対応のベースクラス
    class ShadowDOMComponent {
        constructor() {
            this.shadowRoot = null;
            this.container = null;
        }

        // シャドウDOMを作成
        createShadowDOM(hostElement, mode = 'closed') {
            try {
                if (!hostElement) {
                    throw new Error('Host element is required for shadow DOM creation');
                }
                this.shadowRoot = hostElement.attachShadow({ mode });
                this.container = document.createElement('div');
                this.shadowRoot.appendChild(this.container);
                return this.shadowRoot;
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.createShadowDOM', { hostElement: !!hostElement });
                throw error;
            }
        }

        // スタイルを追加
        addStyles(cssText) {
            try {
                if (!this.shadowRoot) {
                    throw new Error('Shadow root not initialized');
                }
                
                const style = document.createElement('style');
                style.textContent = cssText;
                this.shadowRoot.appendChild(style);
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.addStyles');
                // スタイル追加の失敗は致命的ではないので続行
            }
        }

        // 要素を検索（シャドウDOM内）
        querySelector(selector) {
            try {
                return this.shadowRoot ? this.shadowRoot.querySelector(selector) : null;
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.querySelector', { selector });
                return null;
            }
        }

        querySelectorAll(selector) {
            try {
                return this.shadowRoot ? this.shadowRoot.querySelectorAll(selector) : [];
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.querySelectorAll', { selector });
                return [];
            }
        }

        // コンテナにHTMLを設定
        setHTML(html) {
            try {
                if (!this.container) {
                    throw new Error('Container not initialized');
                }
                this.container.innerHTML = html;
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.setHTML');
                throw error;
            }
        }

        // 破棄
        destroy() {
            try {
                if (this.shadowRoot && this.shadowRoot.host) {
                    this.shadowRoot.host.remove();
                }
            } catch (error) {
                ErrorLogger.log(error, 'ShadowDOMComponent.destroy');
                // 破棄処理のエラーは無視
            }
        }
    }

    // シャドウDOM対応スタイル管理クラス
    class ShadowStyleManager {
        static getCommonStyles() {
            return `
                /* 基本カラーパレット - ダークモード */
                :host {
                    --primary: #7F5AF0;       /* プライマリカラー：鮮やかな紫 */
                    --secondary: #2CB67D;     /* セカンダリカラー：ミントグリーン */
                    --accent: #FF8906;        /* アクセントカラー：オレンジ */
                    --bg-primary: #16161A;    /* 背景：暗めのグレー */
                    --bg-secondary: #242629;  /* セカンダリ背景：少し明るいグレー */
                    --text-primary: #FFFFFE;  /* メインテキスト：白 */
                    --text-secondary: #94A1B2; /* セカンダリテキスト：薄いグレー */
                    --danger: #E53170;        /* 警告・エラー：ピンク */
                    --success: #2CB67D;       /* 成功：グリーン */
                    --highlight: rgba(127, 90, 240, 0.2); /* 強調表示：紫の半透明 */
                }

                * {
                    box-sizing: border-box;
                }

                /* 全体のスタイル */
                .nico-comment-settings {
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
                    margin: 25px 0;
                    max-width: 800px;
                    font-size: 15px;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .nico-comment-settings:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                /* ヘッダースタイル */
                .nico-comment-settings h2 {
                    margin: 0 0 28px;
                    font-size: 24px;
                    color: var(--text-primary);
                    font-weight: 700;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding-bottom: 12px;
                    border-bottom: 2px solid var(--primary);
                    display: inline-block;
                    letter-spacing: 0.5px;
                }

                .nico-comment-settings .setting-group {
                    margin-bottom: 28px;
                    background: var(--bg-secondary);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .nico-comment-settings .setting-group:hover {
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    transform: translateY(-2px);
                    border-color: rgba(127, 90, 240, 0.3);
                }

                .nico-comment-settings .setting-group::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--primary);
                    opacity: 0.7;
                }

                .nico-comment-settings .setting-group h3 {
                    margin: 0 0 16px;
                    font-size: 18px;
                    color: var(--primary);
                    position: relative;
                    display: inline-block;
                    font-weight: 600;
                }

                .nico-comment-settings .setting-group h3::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary), transparent);
                }

                /* 検索関連のスタイル */
                .search-container {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .open-search-page-direct-btn {
                    background: var(--bg-primary) !important;
                    color: var(--text-secondary) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }

                .open-search-page-direct-btn:hover {
                    background: rgba(127, 90, 240, 0.1) !important;
                    color: var(--primary) !important;
                }

                .search-container input[type="text"] {
                    flex: 1;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    padding: 10px 12px;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .search-container input[type="text"]:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.3);
                    outline: none;
                }

                .search-results {
                    max-height: 350px;
                    overflow-y: auto;
                    margin-top: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    scrollbar-width: thin;
                    scrollbar-color: var(--primary) var(--bg-primary);
                }

                .search-results::-webkit-scrollbar {
                    width: 8px;
                }

                .search-results::-webkit-scrollbar-track {
                    background: var(--bg-primary);
                    border-radius: 8px;
                }

                .search-results::-webkit-scrollbar-thumb {
                    background-color: var(--primary);
                    border-radius: 8px;
                    border: 2px solid var(--bg-primary);
                }

                .search-result-item {
                    display: flex;
                    padding: 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .search-result-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease, width 0.3s ease;
                    z-index: 0;
                }

                .search-result-item:hover {
                    background: rgba(127, 90, 240, 0.1);
                    transform: translateX(4px);
                }

                .search-result-item:hover::before {
                    opacity: 0.1;
                    width: 100%;
                }

                .search-result-item img {
                    width: 100px;
                    height: 75px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    z-index: 1;
                }

                .search-result-item:hover img {
                    border-color: var(--primary);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .search-result-info {
                    margin-left: 16px;
                    flex: 1;
                    z-index: 1;
                }

                .search-result-info .title {
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: var(--text-primary);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: color 0.3s ease;
                }

                .search-result-item:hover .title {
                    color: var(--primary);
                }

                .search-result-info .stats {
                    font-size: 13px;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                    display: flex;
                    gap: 12px;
                }

                .search-result-info .date {
                    font-size: 13px;
                    color: var(--text-secondary);
                    opacity: 0.8;
                }

                /* 入力要素のスタイル */
                .nico-comment-settings input[type="text"],
                .nico-comment-settings input[type="number"] {
                    width: 100%;
                    padding: 10px 12px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    margin-bottom: 14px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .nico-comment-settings input[type="text"]:focus,
                .nico-comment-settings input[type="number"]:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
                    outline: none;
                }

                /* 透明度入力欄のスタイル */
                .opacity-setting input[type="number"] {
                    width: 80px;
                    text-align: right;
                    padding-right: 12px;
                }

                .nico-comment-settings input[type="color"] {
                    width: 50px;
                    height: 50px;
                    padding: 0;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .nico-comment-settings input[type="color"]:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
                }

                /* 現在の設定エリアのスタイル */
                .current-video-info {
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    padding: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                    position: relative;
                }

                /* サムネイルラッパー */
                .thumbnail-wrapper {
                    flex-shrink: 0;
                    width: 160px;
                    height: 120px;
                    position: relative;
                }

                .thumbnail-container {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    overflow: hidden;
                    background: var(--bg-primary);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .thumbnail-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0);
                    transition: all 0.3s ease;
                    z-index: 5;
                }

                .thumbnail-wrapper:hover .thumbnail-overlay {
                    background: rgba(0, 0, 0, 0.4);
                }

                /* 再生ボタンのスタイル */
                .play-button {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(127, 90, 240, 0.9);
                    color: white;
                    border: none;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }

                .play-icon {
                    font-size: 24px;
                    margin-left: 4px;
                }

                .thumbnail-wrapper:hover .play-button {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1);
                }

                .play-button:hover {
                    background: var(--accent);
                    transform: translate(-50%, -50%) scale(1.2);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
                }

                .thumbnail-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }

                .thumbnail-wrapper:hover .thumbnail-container {
                    transform: scale(1.05);
                    border-color: var(--primary);
                }

                .thumbnail-wrapper:hover .thumbnail-container img {
                    transform: scale(1.1);
                }

                .info-container {
                    flex: 1;
                }

                .info-container p {
                    margin: 8px 0;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .info-container p::before {
                    content: '•';
                    color: var(--primary);
                    font-size: 20px;
                }

                .info-container span {
                    color: var(--text-primary);
                    font-weight: 500;
                }

                /* 透明度設定のスタイル */
                .opacity-setting select {
                    padding: 8px 12px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    font-size: 14px;
                    width: 100px;
                    cursor: pointer;
                    appearance: none;
                    -webkit-appearance: none;
                    background-image: url('data:image/svg+xml;charset=US-ASCII,<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 9L13 1" stroke="%237F5AF0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    padding-right: 30px;
                    transition: all 0.3s ease;
                }

                .opacity-setting select:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
                    outline: none;
                }

                /* NGワード関連のスタイル */
                .ng-words-container,
                .ng-regexp-container {
                    margin-bottom: 18px;
                }

                .ng-words {
                    width: 100%;
                    height: 120px;
                    padding: 12px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    resize: vertical;
                    font-family: 'Fira Code', monospace;
                    font-size: 14px;
                    margin-top: 12px;
                    line-height: 1.5;
                    transition: all 0.3s ease;
                }

                .ng-words:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
                    outline: none;
                }

                .mask-button {
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 12px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }

                .mask-button::before {
                    content: '🔒';
                    margin-right: 8px;
                    font-size: 16px;
                }

                .mask-button::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary), transparent);
                    opacity: 0.1;
                    transition: width 0.3s ease;
                    z-index: 0;
                }

                .mask-button:hover {
                    background: rgba(127, 90, 240, 0.1);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }

                .mask-button:hover::after {
                    width: 100%;
                }

                /* ボタンスタイル */
                .nico-comment-settings button {
                    background: var(--primary);
                    color: var(--text-primary);
                    border: none;
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
                }

                .nico-comment-settings button::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .nico-comment-settings button:hover {
                    background: var(--primary);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(127, 90, 240, 0.4);
                }

                .nico-comment-settings button:hover::after {
                    opacity: 1;
                }

                .nico-comment-settings button:active {
                    transform: translateY(1px);
                    box-shadow: 0 2px 8px rgba(127, 90, 240, 0.2);
                }

                #searchButton, #saveSettings {
                    background: linear-gradient(135deg, var(--primary) 0%, #6E44FF 100%);
                }

                .toggle-button {
                    position: relative;
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    padding-left: 40px;
                    margin-top: 8px;
                }

                .toggle-button::before {
                    content: '';
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 18px;
                    height: 18px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                }

                .toggle-button.off {
                    background: var(--bg-primary);
                    color: var(--text-secondary);
                    padding-left: 18px;
                    padding-right: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .toggle-button.off::before {
                    left: auto;
                    right: 12px;
                    background-color: var(--text-secondary);
                    box-shadow: none;
                }

                /* その他のユーティリティクラス */
                .hidden {
                    display: none !important;
                }

                .current-settings {
                    background: var(--bg-secondary);
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .current-settings p {
                    margin: 8px 0;
                    color: var(--text-secondary);
                }

                .current-settings span {
                    color: var(--text-primary);
                    margin-left: 8px;
                    font-weight: 500;
                }

                /* 設定グループのレイアウト */
                .color-setting,
                .opacity-setting {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .color-setting label,
                .opacity-setting label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-primary);
                    font-weight: 500;
                }

                /* カラープリセットのスタイル */
                .color-presets {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin: 14px 0;
                    max-width: 500px;
                }

                .color-preset-btn {
                    width: 36px;
                    height: 36px;
                    border: 2px solid transparent;
                    border-radius: 50%;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    margin: 0;
                }

                .color-preset-btn:hover {
                    transform: scale(1.2) rotate(5deg);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    z-index: 10;
                }

                .color-preset-btn.selected {
                    border-color: var(--text-primary);
                    box-shadow: 0 0 0 4px rgba(127, 90, 240, 0.3);
                }

                /* カラーピッカーのスタイル */
                .color-picker-container {
                    margin: 14px 0;
                }

                .color-picker-button {
                    background: var(--bg-primary) !important;
                    color: var(--text-primary) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    padding: 8px 16px;
                    display: inline-flex;
                    align-items: center;
                }

                .color-picker-button::before {
                    content: '🎨';
                    margin-right: 8px;
                }

                .color-picker-button:hover {
                    background: rgba(127, 90, 240, 0.1) !important;
                    color: var(--primary) !important;
                    border-color: var(--primary) !important;
                }

                .color-picker {
                    margin-top: 14px;
                    padding: 16px;
                    background: var(--bg-primary);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .color-picker input[type="color"] {
                    width: 100%;
                    height: 50px;
                    padding: 0;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .current-color-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 12px;
                    font-size: 14px;
                    padding: 8px 12px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .color-preview {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .color-value {
                    color: var(--text-primary);
                    font-family: 'Fira Code', monospace;
                    letter-spacing: 0.5px;
                }

                /* 通知のアニメーション */
                @keyframes notification-slide-in {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                @keyframes notification-slide-out {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-20px); opacity: 0; }
                }
                
                /* 設定グループのアニメーション */
                .setting-group {
                    animation: settingGroupAppear 0.5s cubic-bezier(0.26, 0.86, 0.44, 0.985) backwards;
                }
                
                .setting-group:nth-child(1) { animation-delay: 0.1s; }
                .setting-group:nth-child(2) { animation-delay: 0.2s; }
                .setting-group:nth-child(3) { animation-delay: 0.3s; }
                .setting-group:nth-child(4) { animation-delay: 0.4s; }
                .setting-group:nth-child(5) { animation-delay: 0.5s; }
                
                @keyframes settingGroupAppear {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* ボタンプレス効果 */
                .nico-comment-settings button:active {
                    transform: scale(0.95);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                    transition: transform 0.1s, box-shadow 0.1s;
                }
                
                /* カラープリセットのホバー効果を強化 */
                .color-preset-btn {
                    position: relative;
                    overflow: hidden;
                }
                
                .color-preset-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .color-preset-btn:hover::after {
                    opacity: 0.5;
                }
                
                /* 検索結果アイテムの選択アニメーション */
                .search-result-item.selected {
                    background: rgba(127, 90, 240, 0.2);
                    border-left: 4px solid var(--primary);
                    padding-left: 10px;
                    transform: scale(1.02);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                /* 保存ボタンのパルスアニメーション */
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(127, 90, 240, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(127, 90, 240, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(127, 90, 240, 0);
                    }
                }
                
                #saveSettings {
                    position: relative;
                    overflow: hidden;
                }
                
                #saveSettings:hover {
                    animation: pulse 1.5s infinite;
                }
                
                #saveSettings::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    transition: left 0.7s;
                }
                
                #saveSettings:hover::before {
                    left: 100%;
                }
                
                /* 設定UIタイトルのアニメーション */
                .nico-comment-settings h2 {
                    position: relative;
                    overflow: hidden;
                }
                
                .nico-comment-settings h2::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    transform: translateX(-100%);
                    animation: slideIn 1.5s forwards;
                }
                
                @keyframes slideIn {
                    to { transform: translateX(0); }
                }
                
                /* 設定グループヘッダーのアニメーション */
                .nico-comment-settings .setting-group h3 {
                    position: relative;
                    z-index: 1;
                }

                .nico-comment-settings .setting-group h3::before {
                    content: '';
                    position: absolute;
                    z-index: -1;
                    left: -5px;
                    top: -2px;
                    width: 30px;
                    height: 30px;
                    background: var(--primary);
                    opacity: 0.1;
                    border-radius: 50%;
                    transform: scale(0);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .nico-comment-settings .setting-group:hover h3::before {
                    transform: scale(1);
                }
                
                /* トグルボタンのアニメーション */
                .toggle-button::before {
                    transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                                right 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                                background-color 0.3s ease;
                }
                
                /* サーチボタンのローディングアニメーション */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading-spin {
                    position: relative;
                    color: transparent !important;
                }
                
                .loading-spin::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -8px;
                    margin-left: -8px;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.7s linear infinite;
                }

                /* 自動コメントボタンのスタイル */
                .auto-comment-button {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 4px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
                    display: inline-flex;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .auto-comment-button::before {
                    content: '💬';
                    margin-right: 4px;
                    font-size: 14px;
                }

                .auto-comment-button:hover {
                    background: var(--accent);
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);
                }

                /* 通知コンテナのスタイル */
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 400px;
                    pointer-events: none;
                }

                .notification-item {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    word-break: break-word;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(100px);
                    opacity: 0;
                    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    box-sizing: border-box;
                    pointer-events: auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .notification-item.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .notification-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 16px;
                }

                .notification-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .notification-type {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                }

                .notification-message {
                    line-height: 1.4;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    margin: 0;
                    line-height: 1;
                    opacity: 0.7;
                    transition: all 0.2s ease;
                }

                .notification-close:hover {
                    opacity: 1;
                    color: var(--text-primary);
                }

                /* 通知タイプ別のスタイル */
                .notification-item.success .notification-icon {
                    background: var(--success);
                    box-shadow: 0 2px 8px rgba(44, 182, 125, 0.5);
                }

                .notification-item.success .notification-type {
                    color: var(--success);
                }

                .notification-item.warning .notification-icon {
                    background: var(--accent);
                    box-shadow: 0 2px 8px rgba(255, 137, 6, 0.5);
                }

                .notification-item.warning .notification-type {
                    color: var(--accent);
                }

                .notification-item.error .notification-icon {
                    background: var(--danger);
                    box-shadow: 0 2px 8px rgba(229, 49, 112, 0.5);
                }

                .notification-item.error .notification-type {
                    color: var(--danger);
                }

                .notification-item.info .notification-icon {
                    background: var(--primary);
                    box-shadow: 0 2px 8px rgba(127, 90, 240, 0.5);
                }

                .notification-item.info .notification-type {
                    color: var(--primary);
                }

                .notification-item.success {
                    border-left: 4px solid var(--success);
                }

                .notification-item.warning {
                    border-left: 4px solid var(--accent);
                }

                .notification-item.error {
                    border-left: 4px solid var(--danger);
                }

                .notification-item.info {
                    border-left: 4px solid var(--primary);
                }
            `;
        }

        static getNotificationStyles() {
            return `
                ${this.getCommonStyles()}
                
                /* 通知専用の追加スタイル */
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-width: 400px;
                    pointer-events: none;
                }
            `;
        }

        static getAutoButtonStyles() {
            return `
                ${this.getCommonStyles()}
                
                /* 自動ボタン専用の追加スタイル */
                .auto-comment-button {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 4px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
                    display: inline-flex;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .auto-comment-button::before {
                    content: '💬';
                    margin-right: 4px;
                    font-size: 14px;
                }

                .auto-comment-button:hover {
                    background: var(--accent);
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 4px 15px rgba(255, 137, 6, 0.4);
                }
            `;
        }
    }

    // スタイル管理クラス（既存のものを更新）
    class StyleManager {
        static initialize() {
            // 既存のGM_addStyleは残しておく（シャドウDOM外の要素用）
            GM_addStyle(`
                /* シャドウDOM外の要素用の最小限のスタイル */
                .nico-comment-shadow-host {
                    display: block;
                    position: relative;
                }
            `);
        }
    }

    // コメントを表現するクラス
    class Comment {
        constructor(text, vpos, commands = [], settings = {}) {
            try {
                if (typeof text !== 'string') {
                    throw new Error('Comment text must be a string');
                }
                if (typeof vpos !== 'number' || vpos < 0) {
                    throw new Error('Comment vpos must be a non-negative number');
                }

                this.text = text;
                this.vpos = vpos;
                this.commands = Array.isArray(commands) ? commands : [];

                // 描画関連のプロパティ
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
                this.baseSpeed = 0;
                this.speed = 0;
                this.lane = -1;
                this.color = settings.color || '#FFFFFF';
                this.fontSize = 0;
                this.fontFamily = 'Arial';
                this.opacity = settings.opacity || 0.75;
                this.isActive = false;
                this.hasShown = false;
                this.isPaused = false;
                this.lastUpdateTime = 0;
                this.reservationWidth = 0;
            } catch (error) {
                ErrorLogger.log(error, 'Comment.constructor', { text, vpos, commands, settings });
                throw error;
            }
        }

        // コメントの表示準備
        prepare(ctx, canvasWidth, canvasHeight) {
            try {
                if (!ctx) {
                    throw new Error('Canvas context is required');
                }
                if (typeof canvasWidth !== 'number' || typeof canvasHeight !== 'number') {
                    throw new Error('Canvas dimensions must be numbers');
                }

                // フォントサイズを動的に計算
                this.fontSize = Math.max(24, Math.floor(canvasHeight * 0.05));
                
                // フォント設定
                ctx.font = `${this.fontSize}px ${this.fontFamily}`;
                
                // サイズ計算
                this.width = ctx.measureText(this.text).width;
                this.height = this.fontSize;
                
                // 予約領域の計算
                const maxReservationWidth = ctx.measureText('あ'.repeat(150)).width;
                this.reservationWidth = Math.min(maxReservationWidth, this.width * 5.0);
                
                // 初期位置設定
                this.x = canvasWidth;
                
                // 基本速度計算
                this.baseSpeed = (canvasWidth + this.reservationWidth) / (12 * 60);
                this.speed = this.baseSpeed;
                
                this.lastUpdateTime = performance.now();
            } catch (error) {
                ErrorLogger.log(error, 'Comment.prepare', { 
                    text: this.text, 
                    canvasWidth, 
                    canvasHeight,
                    hasContext: !!ctx 
                });
                throw error;
            }
        }

        // コメントの更新
        update(playbackRate = 1.0, isPaused = false) {
            try {
                if (!this.isActive || this.isPaused) return;

                const currentTime = performance.now();
                const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);

                this.speed = this.baseSpeed * playbackRate;
                this.x -= this.speed * deltaTime;

                if (this.x < -this.width) {
                    this.isActive = false;
                }

                this.lastUpdateTime = currentTime;
            } catch (error) {
                ErrorLogger.log(error, 'Comment.update', { 
                    text: this.text,
                    playbackRate,
                    isPaused,
                    isActive: this.isActive 
                });
                // 更新エラーは致命的ではないので続行
            }
        }

        // コメントの描画
        draw(ctx, interpolatedX = null) {
            try {
                if (!this.isActive || !ctx) return;

                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.fontSize}px ${this.fontFamily}`;

                const drawX = interpolatedX || this.x;
                const drawY = this.y + this.fontSize;

                // 縁取りの描画
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(3, this.fontSize / 8);
                ctx.lineJoin = 'round';
                ctx.strokeText(this.text, drawX, drawY);

                // 本文の描画
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, drawX, drawY);

                ctx.restore();
            } catch (error) {
                ErrorLogger.log(error, 'Comment.draw', { 
                    text: this.text,
                    isActive: this.isActive,
                    hasContext: !!ctx,
                    interpolatedX 
                });
                // 描画エラーは致命的ではないので続行
            }
        }
    }

    // メインクラス
    class CommentRenderer {
        constructor(settings = null) {
            try {
                this.settings = { ...DEFAULT_SETTINGS, ...(settings || {}) };
                this.comments = [];
                this.canvas = null;
                this.ctx = null;
                this.videoElement = null;
                this.duration = 0;
                this.currentTime = 0;
                this.playbackRate = 1.0;
                this.isPlaying = true;
                this.frameId = null;
                this.isPaused = false;
                this.laneCount = 12;
                this.laneHeight = 0;
                this.virtualCanvasExtension = 1000;
                this.reservedLanes = new Map();
                this.lastDrawTime = 0;
                this.isSmoothTransition = true;
                this.finalPhaseActive = false;
                this.minLaneSpacing = 1;
                this.keyboardHandler = null;
            } catch (error) {
                ErrorLogger.log(error, 'CommentRenderer.constructor', { settings });
                throw error;
            }
        }

        // NGワードチェック
        isNGComment(text) {
            try {
                if (typeof text !== 'string') return true;

                // NGワードチェック
                if (Array.isArray(this.settings.ngWords)) {
                    for (const word of this.settings.ngWords) {
                        if (typeof word === 'string' && text.includes(word)) {
                            return true;
                        }
                    }
                }
                
                // NG正規表現チェック
                if (Array.isArray(this.settings.ngRegexps)) {
                    for (const pattern of this.settings.ngRegexps) {
                        try {
                            if (typeof pattern === 'string' && new RegExp(pattern).test(text)) {
                                return true;
                            }
                        } catch (regexError) {
                            ErrorLogger.log(regexError, 'CommentRenderer.isNGComment.regex', { pattern, text });
                            // 正規表現エラーは個別に処理して続行
                        }
                    }
                }
                
                return false;
            } catch (error) {
                ErrorLogger.log(error, 'CommentRenderer.isNGComment', { text });
                return true; // エラー時は安全側に倒してNGとする
            }
        }

        // 初期化
        initialize(videoElement) {
            try {
                if (!videoElement) {
                    throw new Error('Video element is required for initialization');
                }

                this.videoElement = videoElement;
                this.duration = videoElement.duration * 1000;
                
                // Canvas作成と設定
                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');
                
                if (!this.ctx) {
                    throw new Error('Failed to get canvas 2D context');
                }

                // サイズ設定
                const rect = videoElement.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) {
                    throw new Error('Invalid video element dimensions');
                }

                this.canvas.width = rect.width;
                this.canvas.height = rect.height;
                
                // レーンの高さを計算
                this.calculateLaneHeight();
                
                // videoElementの上にCanvasを重ねる
                this.canvas.style.position = 'absolute';
                this.canvas.style.pointerEvents = 'none';
                this.canvas.style.zIndex = '1000';
                this.canvas.style.left = `${rect.left}px`;
                this.canvas.style.top = `${rect.top}px`;
                
                // video要素の親要素にCanvasを追加
                const videoWrapper = videoElement.parentElement;
                if (!videoWrapper) {
                    throw new Error('Video element parent not found');
                }
                videoWrapper.style.position = 'relative';
                videoWrapper.appendChild(this.canvas);
                
                // 動画イベントの監視
                this.setupVideoEventListeners(videoElement);
                
                // キーボードショートカットの設定
                this.setupKeyboardShortcuts();
                
                // アニメーションループ開始
                this.startAnimation();
                
                // リサイズイベントの監視
                this.setupResizeListener(videoElement);
            } catch (error) {
                ErrorLogger.logAndNotify(error, 'CommentRenderer.initialize');
                throw error;
            }
        }

        setupVideoEventListeners(videoElement) {
            try {
                videoElement.addEventListener('play', () => {
                    this.isPlaying = true;
                    const now = performance.now();
                    this.comments.forEach(c => {
                        c.lastUpdateTime = now;
                        c.isPaused = false;
                    });
                });

                videoElement.addEventListener('pause', () => {
                    this.isPlaying = false;
                });

                videoElement.addEventListener('seeking', () => this.onSeek());

                videoElement.addEventListener('ratechange', () => {
                    this.playbackRate = videoElement.playbackRate;
                });
            } catch (error) {
                ErrorLogger.log(error, 'CommentRenderer.setupVideoEventListeners');
                throw error;
            }
        }

        setupKeyboardShortcuts() {
            try {
                this.keyboardHandler = new KeyboardShortcutHandler();
                this.keyboardHandler.addShortcut('C', 'Shift', () => {
                    try {
                        this.settings.isCommentVisible = !this.settings.isCommentVisible;
                        if (!this.settings.isCommentVisible) {
                            for (const comment of this.comments) {
                                comment.isActive = false;
                            }
                        }
                        if (window.dAniRenderer.settingsManager) {
                            window.dAniRenderer.settingsManager.updateSettings(this.settings);
                        }
                    } catch (shortcutError) {
                        ErrorLogger.log(shortcutError, 'CommentRenderer.keyboardShortcut');
                    }
                });
                this.keyboardHandler.startListening();
            } catch (error) {
                ErrorLogger.log(error, 'CommentRenderer.setupKeyboardShortcuts');
                // キーボードショートカットの失敗は致命的ではない
            }
        }

        setupResizeListener(videoElement) {
            try {
                window.addEventListener('resize', () => {
                    try {
                        this.resize(videoElement);
                    } catch (resizeError) {
                        ErrorLogger.log(resizeError, 'CommentRenderer.resize');
                    }
                });
            } catch (error) {
                ErrorLogger.log(error, 'CommentRenderer.setupResizeListener');
                // リサイズリスナーの失敗は致命的ではない
            }
        }

        // レーン管理メソッド
        findAvailableLane(comment) {
            const currentTime = this.currentTime;
            // 仮想キャンバスを考慮した通過時間計算
            const commentEnd = ((comment.reservationWidth + this.virtualCanvasExtension) / comment.speed) * 2;
            
            // レーン間のスペース（フォントサイズの1.0倍）
            const minSpacing = this.minLaneSpacing * 1.0;
            
            // 各レーンを上から順にチェック
            const lanes = Array.from({ length: this.laneCount }, (_, i) => i);
            
            for (const lane of lanes) {
                let isAvailable = true;
                const reservations = this.reservedLanes.get(lane) || [];
                
                // レーンの予約状況をチェック
                for (const reservation of reservations) {
                    // より厳密な衝突チェック
                    const timeOverlap = currentTime < reservation.endTime;
                    const spaceOverlap = Math.abs(lane * this.laneHeight - reservation.comment.y) < 
                                       comment.height * minSpacing;
                    const xOverlap = Math.abs(comment.x - reservation.comment.x) < 
                                   Math.max(comment.width, reservation.comment.width);
                    
                    if (timeOverlap && (spaceOverlap || xOverlap)) {
                        isAvailable = false;
                        break;
                    }
                }
                
                if (isAvailable) {
                    // レーンを予約
                    if (!this.reservedLanes.has(lane)) {
                        this.reservedLanes.set(lane, []);
                    }
                    this.reservedLanes.get(lane).push({
                        comment: comment,
                        endTime: currentTime + commentEnd,
                        reservationWidth: comment.reservationWidth
                    });
                    return lane;
                }
            }
            
            // 空きレーンがない場合は、ランダムなレーンを返す（完全な重なりを避けるため）
            return Math.floor(Math.random() * this.laneCount);
        }

        // レーンの高さを計算
        calculateLaneHeight() {
            // フォントサイズの5%を基準に計算
            const baseHeight = Math.max(24, Math.floor(this.canvas.height * 0.05));
            // レーンの高さも少し広げる
            this.laneHeight = baseHeight * this.minLaneSpacing * 1.2;
            // レーン数を更新（少し少なめに設定して余裕を持たせる）
            this.laneCount = Math.floor((this.canvas.height / this.laneHeight) * 0.9);
        }

        // コメント表示管理
        updateComments() {
            const currentTime = this.currentTime;
            
            // 動画終了10秒前かどうかを判定
            const isNearEnd = this.duration > 0 && 
                             this.duration - currentTime <= 10000;
            
            // ファイナルフェイズ開始時の処理
            if (isNearEnd && !this.finalPhaseActive) {
                // ファイナルフェイズフラグを設定
                this.finalPhaseActive = true;
                
                // キャンバスをクリア
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 既存のアクティブなコメントを全て非アクティブにする
                this.comments.forEach(comment => {
                    comment.isActive = false;
                });
                
                // レーン予約も全てクリア
                this.reservedLanes.clear();
                
                console.log('ファイナルフェイズ開始: 全コメントをリセットしました');
            }
            
            // ファイナルフェイズの終了判定
            if (!isNearEnd && this.finalPhaseActive) {
                this.finalPhaseActive = false;
                console.log('ファイナルフェイズ終了');
            }

            // アクティブなコメントの設定を更新
            for (const comment of this.comments) {
                // 既にアクティブなコメントの設定を更新
                if (comment.isActive) {
                    // 色と透明度を強制的に更新
                    comment.color = this.settings.commentColor;
                    comment.opacity = this.settings.commentOpacity;
                    comment.isPaused = !this.isPlaying;  // 一時停止状態を更新
                }
                
                // NGコメントはスキップ
                if (this.isNGComment(comment.text)) continue;
                
                // 非アクティブなコメントの表示判定
                if (!comment.isActive) {
                    // 仮想キャンバスを考慮して表示判定
                    const shouldShow = isNearEnd ? 
                        (comment.vpos > currentTime - 10000 && !comment.hasShown) :
                        (comment.vpos >= currentTime - 2000 && comment.vpos <= currentTime + 2000);
                    
                    if (shouldShow) {
                        // コメントの準備（仮想キャンバスを考慮）
                        comment.prepare(this.ctx, this.canvas.width + this.virtualCanvasExtension, this.canvas.height);
                        
                        // レーン割り当て
                        comment.lane = this.findAvailableLane(comment);
                        comment.y = comment.lane * this.laneHeight;
                        
                        // 初期位置を仮想キャンバスの右端に設定
                        comment.x = this.canvas.width + this.virtualCanvasExtension;
                        
                        // 設定の適用
                        comment.color = this.settings.commentColor;
                        comment.opacity = this.settings.commentOpacity;
                        
                        // アクティブ化
                        comment.isActive = true;
                        comment.hasShown = true;
                    }
                }
                
                // アクティブなコメントの更新
                if (comment.isActive) {
                    // 仮想キャンバス内でのみコリジョン判定を行う
                    if (comment.x < this.canvas.width + this.virtualCanvasExtension * 0.8 && 
                        comment.x > this.canvas.width + this.virtualCanvasExtension * 0.2) {
                        this.checkCollisions(comment);
                    }
                    comment.update(this.playbackRate, !this.isPlaying);
                }
            }
            
            // 古い予約を削除
            for (const [lane, reservations] of this.reservedLanes) {
                this.reservedLanes.set(lane, 
                    reservations.filter(r => r.endTime > currentTime)
                );
            }
        }

        // レーンの占有率を計算
        getLaneOccupancy(lane) {
            const reservations = this.reservedLanes.get(lane) || [];
            const totalTime = this.duration;
            let occupiedTime = 0;

            for (const reservation of reservations) {
                const start = Math.max(0, reservation.endTime - (reservation.reservationWidth / reservation.comment.speed));
                const end = reservation.endTime;
                occupiedTime += end - start;
            }

            return occupiedTime / totalTime;
        }

        // コメントの衝突検出
        checkCollisions(currentComment) {
            const activeComments = this.comments.filter(c => c.isActive && c !== currentComment);
            
            for (const otherComment of activeComments) {
                // 同じレーンかどうかチェック
                if (otherComment.lane === currentComment.lane) {
                    // コメント間の距離を計算（速度に応じて範囲を調整）
                    const distance = Math.abs(currentComment.x - otherComment.x);
                    const minDistance = Math.max(currentComment.width, otherComment.width) * (1 + currentComment.speed / 10);
                    
                    // 距離が近すぎる場合
                    if (distance < minDistance) {
                        // 新しいレーンを探す
                        const newLane = this.findAvailableLane(currentComment);
                        if (newLane !== -1) {
                            currentComment.lane = newLane;
                            currentComment.y = newLane * this.laneHeight;
                            this.reserveLane(currentComment);
                        }
                    }
                }
            }
        }

        // レーン予約を更新
        reserveLane(comment) {
            const currentTime = this.currentTime;
            const commentEnd = (comment.reservationWidth / comment.speed) * 2;
            
            // 既存の予約を削除
            for (const [lane, reservations] of this.reservedLanes) {
                this.reservedLanes.set(lane, 
                    reservations.filter(r => r.comment !== comment)
                );
            }
            
            // 新しい予約を追加
            if (!this.reservedLanes.has(comment.lane)) {
                this.reservedLanes.set(comment.lane, []);
            }
            this.reservedLanes.get(comment.lane).push({
                comment: comment,
                endTime: currentTime + commentEnd,
                reservationWidth: comment.reservationWidth
            });
        }

        // 描画処理
        draw() {
            const currentTime = performance.now();
            const deltaTime = (currentTime - this.lastDrawTime) / (1000 / 60);

            // コメント非表示設定の場合はキャンバスをクリアして終了
            if (!this.settings.isCommentVisible) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                return;
            }

            // キャンバスをクリア
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // アクティブなコメントを描画（画面内のみ）
            const activeComments = this.comments.filter(comment => 
                comment.isActive && comment.x < this.canvas.width
            );

            // スムーズな遷移を有効にする場合
            if (this.isSmoothTransition) {
                // 描画間隔に応じて位置を補間
                activeComments.forEach(comment => {
                    const interpolatedX = comment.x - (comment.speed * deltaTime);
                    comment.draw(this.ctx, interpolatedX);
                });
            } else {
                activeComments.forEach(comment => comment.draw(this.ctx));
            }

            this.lastDrawTime = currentTime;
        }

        // 更新処理（オーバーライド）
        update() {
            if (!this.videoElement) return;  // videoElementのチェックのみ行う
            
            // コメント非表示設定の場合は早期リターンして処理をスキップ
            if (!this.settings.isCommentVisible) return;
            
            // 現在時間の更新
            this.currentTime = this.videoElement.currentTime * 1000;
            this.playbackRate = this.videoElement.playbackRate;
            this.isPlaying = !this.videoElement.paused;  // 再生状態を更新
            
            // コメント更新
            this.updateComments();
        }

        // アニメーションループ
        startAnimation() {
            const animate = () => {
                this.update();
                this.draw();
                this.frameId = requestAnimationFrame(animate);
            };
            animate();  // 即座にアニメーションを開始
        }

        // シーク時の処理
        onSeek() {
            // ファイナルフェイズ状態をリセット
            this.finalPhaseActive = false;
            
            // 現在時間を更新
            if (this.videoElement) {
                this.currentTime = this.videoElement.currentTime * 1000;
            }

            // コメントの状態をリセット
            this.comments.forEach(comment => {
                // シーク時刻の前後4秒以内のコメントを表示対象とする
                if (comment.vpos >= this.currentTime - 4000 && comment.vpos <= this.currentTime + 4000) {
                    // シーク後の位置に合わせてコメントを再配置
                    comment.prepare(this.ctx, this.canvas.width, this.canvas.height);
                    comment.lane = this.findAvailableLane(comment);
                    comment.y = comment.lane * this.laneHeight;
                    
                    // シーク時刻からの経過時間に基づいて x 座標を計算
                    const timeDiff = (this.currentTime - comment.vpos) / 1000; // 秒単位に変換
                    const distance = comment.speed * timeDiff * 60; // 60FPSを想定
                    comment.x = this.canvas.width - distance;
                    
                    // 画面内に収まるコメントのみアクティブにする
                    comment.isActive = comment.x > -comment.width;
                    
                    // コメントが画面外に出ている場合は非表示に
                    if (comment.x < -comment.width) {
                        comment.isActive = false;
                        comment.hasShown = true;
                    }
                } else {
                    comment.isActive = false;
                }
            });

            // レーン予約をクリア
            this.reservedLanes.clear();
        }

        // リサイズ処理
        resize(videoElement) {
            const rect = videoElement.getBoundingClientRect();
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;

            // キャンバスサイズを更新
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;

            // コメントの位置をスケーリング
            const scaleX = this.canvas.width / oldWidth;
            const scaleY = this.canvas.height / oldHeight;

            this.comments.forEach(comment => {
                if (comment.isActive) {
                    // 位置をスケーリング
                    comment.x *= scaleX;
                    comment.y *= scaleY;

                    // 速度を調整
                    comment.baseSpeed *= scaleX;
                    comment.speed *= scaleX;

                    // フォントサイズを調整
                    comment.fontSize = Math.max(24, Math.floor(this.canvas.height * 0.05));
                }
            });

            // レーンの高さを再計算
            this.calculateLaneHeight();
        }

        // コメント追加
        addComment(text, vpos, commands = []) {
            // NGコメントチェック
            if (this.isNGComment(text)) {
                return null;
            }            
            // 重複コメントチェック
            const isDuplicate = this.comments.some(comment => 
                comment.text === text && comment.vpos === vpos
            );

            if (!isDuplicate) {
                const comment = new Comment(text, vpos, commands, this.settings);
                this.comments.push(comment);
                this.comments.sort((a, b) => a.vpos - b.vpos);
            }
        }

        // コメントを完全にクリア
        clearComments() {
            this.comments = [];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            console.log('コメントを完全にクリアしました');
        }
    }

    // API取得クラス
    class NicoApiFetcher {
        constructor() {
            this.apiData = null;
            this.comments = null;
        }

        // APIデータを取得
        async fetchApiData(videoId) {
            try {
                if (!videoId) {
                    throw new Error('Video ID is required');
                }
                
                // videoIdを安全に処理
                let safeVideoId;
                try {
                    safeVideoId = encodeURIComponent(videoId);
                    safeVideoId = safeVideoId.replace(/%([0-9A-F]{2})/g, (match, p1) => {
                        const code = parseInt(p1, 16);
                        if ((code >= 65 && code <= 90) ||
                            (code >= 97 && code <= 122) ||
                            (code >= 48 && code <= 57) ||
                            code === 45 || code === 95 || code === 46 || code === 126) {
                            return String.fromCharCode(code);
                        }
                        return match;
                    });
                } catch (encodeError) {
                    ErrorLogger.log(encodeError, 'NicoApiFetcher.fetchApiData.encode', { videoId });
                    safeVideoId = videoId;
                }
                
                // 動画ページのHTMLを取得
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.nicovideo.jp/watch/${safeVideoId}`,
                        headers: {
                            'Accept': 'text/html'
                        },
                        onload: (response) => {
                            if (response.status !== 200) {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            } else {
                                resolve(response);
                            }
                        },
                        onerror: (error) => {
                            reject(new Error(`Request failed: ${error.message || 'Unknown error'}`));
                        },
                        ontimeout: () => {
                            reject(new Error('Request timeout'));
                        },
                        timeout: 30000
                    });
                });

                // HTMLをパース
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                
                // APIデータを取得
                const apiDataElement = doc.querySelector('meta[name="server-response"]');
                if (!apiDataElement) {
                    throw new Error('API data element not found in response');
                }

                // APIデータをデコード
                const encodedData = apiDataElement.getAttribute('content');
                if (!encodedData) {
                    throw new Error('API data content is empty');
                }
                
                let decodedData;
                try {
                    decodedData = decodeURIComponent(encodedData);
                } catch (decodeError) {
                    try {
                        decodedData = encodedData.replace(/%(?![0-9A-F]{2})/gi, '%25');
                        decodedData = decodeURIComponent(decodedData);
                    } catch (fallbackError) {
                        throw new Error(`API data decode failed: ${decodeError.message}`);
                    }
                }
                
                let data;
                try {
                    data = JSON.parse(decodedData).data;
                } catch (parseError) {
                    throw new Error(`API data parse failed: ${parseError.message}`);
                }
                
                if (!data || !data.response) {
                    throw new Error('Invalid API data structure');
                }
                
                this.apiData = data.response;
                return this.apiData;
            } catch (error) {
                ErrorLogger.logAndNotify(error, 'NicoApiFetcher.fetchApiData', 'error');
                throw error;
            }
        }

        // コメントデータを取得
        async fetchComments() {
            try {
                if (!this.apiData) {
                    throw new Error('API data must be fetched first');
                }

                const nvComment = this.apiData.comment?.nvComment;
                if (!nvComment) {
                    throw new Error('nvComment data not found in API response');
                }

                const server = nvComment.server;
                const params = nvComment.params;
                const threadKey = nvComment.threadKey;

                if (!server || !params || !threadKey) {
                    throw new Error('Required comment server data is missing');
                }

                // コメントサーバーにリクエスト
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${server}/v1/threads`,
                        headers: {
                            'Content-Type': 'application/json',
                            'x-client-os-type': 'others',
                            'X-Frontend-Id': '6',
                            'X-Frontend-Version': '0'
                        },
                        data: JSON.stringify({
                            params: params,
                            threadKey: threadKey,
                            additionals: {},
                        }),
                        onload: (response) => {
                            if (response.status !== 200) {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            } else {
                                resolve(response);
                            }
                        },
                        onerror: (error) => {
                            reject(new Error(`Comment request failed: ${error.message || 'Unknown error'}`));
                        },
                        ontimeout: () => {
                            reject(new Error('Comment request timeout'));
                        },
                        timeout: 30000
                    });
                });

                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (parseError) {
                    throw new Error(`Comment response parse failed: ${parseError.message}`);
                }
                
                if (!data || !data.data || !Array.isArray(data.data.threads)) {
                    throw new Error('Invalid comment response structure');
                }
                
                // メインスレッドを選択
                const threads = data.data.threads;
                const mainThread = threads
                    .filter(thread => thread.fork === 'main')
                    .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))[0];

                if (!mainThread) {
                    throw new Error('Main thread not found in comment response');
                }

                // コメントデータを整形
                this.comments = (mainThread.comments || []).map(comment => ({
                    text: comment.body || '',
                    vpos: comment.vposMs || 0,
                    commands: comment.commands || []
                }));

                return this.comments;
            } catch (error) {
                ErrorLogger.logAndNotify(error, 'NicoApiFetcher.fetchComments', 'error');
                throw error;
            }
        }

        // 動画IDからコメントを取得する一連の処理
        async fetchAllData(videoId) {
            try {
                await this.fetchApiData(videoId);
                const comments = await this.fetchComments();
                return comments;
            } catch (error) {
                ErrorLogger.logAndNotify(error, 'NicoApiFetcher.fetchAllData', 'error');
                throw error;
            }
        }
    }

    // 通知管理クラス
    class NotificationManager extends ShadowDOMComponent {
        static instance = null;
        static notifications = [];  // 現在表示中の通知を管理する配列
        
        constructor() {
            super();
            this.hostElement = null;
            this.isInitialized = false;
        }

        // シングルトンインスタンスを取得
        static getInstance() {
            if (!this.instance) {
                this.instance = new NotificationManager();
            }
            return this.instance;
        }

        // 初期化
        initialize() {
            if (this.isInitialized) return;

            try {
                // ホスト要素を作成
                this.hostElement = document.createElement('div');
                this.hostElement.className = 'nico-comment-shadow-host notification-host';
                this.hostElement.style.cssText = `
                    position: fixed;
                    top: 0;
                    right: 0;
                    z-index: 10000;
                    pointer-events: none;
                `;
                document.body.appendChild(this.hostElement);

                // シャドウDOMを作成
                this.createShadowDOM(this.hostElement);
                this.addStyles(ShadowStyleManager.getNotificationStyles());

                // 通知コンテナを作成
                this.container.innerHTML = `
                    <div class="notification-container"></div>
                `;

                this.isInitialized = true;
            } catch (error) {
                console.error('NotificationManager initialization failed:', error);
                this.isInitialized = false;
            }
        }

        // 通知を表示
        static show(message, type = 'info', duration = 3000) {
            try {
                const manager = this.getInstance();
                if (!manager) {
                    console.error('Failed to get NotificationManager instance');
                    return null;
                }
                
                manager.initialize();
                if (!manager.isInitialized) {
                    console.error('NotificationManager initialization failed');
                    return null;
                }

                const notification = manager.createNotification(message, type, duration);
                return notification;
            } catch (error) {
                console.error('Failed to show notification:', error);
                return null;
            }
        }

        // 通知要素を作成
        createNotification(message, type, duration) {
            try {
                const typeStyles = {
                    success: { icon: '✅', color: 'var(--success, #2CB67D)' },
                    warning: { icon: '⚠️', color: 'var(--accent, #FF8906)' },
                    error: { icon: '❌', color: 'var(--danger, #E53170)' },
                    info: { icon: 'ℹ️', color: 'var(--primary, #7F5AF0)' }
                };
                const style = typeStyles[type] || typeStyles.info;

                const notificationContainer = this.querySelector('.notification-container');
                if (!notificationContainer) {
                    console.error('Notification container not found');
                    return null;
                }
                
                // 通知要素を作成
                const notification = document.createElement('div');
                notification.className = `notification-item ${type}`;
                
                // アイコンを作成
                const icon = document.createElement('div');
                icon.className = 'notification-icon';
                icon.innerHTML = `<span>${style.icon}</span>`;
                notification.appendChild(icon);

                // コンテンツを作成
                const content = document.createElement('div');
                content.className = 'notification-content';
                
                const typeTitle = document.createElement('div');
                typeTitle.className = 'notification-type';
                typeTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                content.appendChild(typeTitle);

                const messageElement = document.createElement('div');
                messageElement.className = 'notification-message';
                messageElement.textContent = message || 'No message';
                content.appendChild(messageElement);
                notification.appendChild(content);

                // 閉じるボタンを作成
                const closeButton = document.createElement('button');
                closeButton.className = 'notification-close';
                closeButton.innerHTML = '&times;';
                closeButton.addEventListener('click', () => {
                    this.removeNotification(notification);
                });
                notification.appendChild(closeButton);

                // 通知をコンテナに追加
                notificationContainer.appendChild(notification);

                // アニメーション開始のためにDOMの再描画を待つ
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);

                // 通知を配列に追加
                const notificationObj = {
                    element: notification,
                    timerId: setTimeout(() => {
                        this.removeNotification(notification);
                    }, duration)
                };
                NotificationManager.notifications.push(notificationObj);

                return notificationObj;
            } catch (error) {
                console.error('Failed to create notification:', error);
                return null;
            }
        }

        // 通知を削除する
        removeNotification(notification) {
            try {
                if (!notification) return;
                
                // 該当する通知オブジェクトを見つける
                const notifObj = NotificationManager.notifications.find(n => n.element === notification);
                if (notifObj) {
                    // タイマーをクリア
                    if (notifObj.timerId) {
                        clearTimeout(notifObj.timerId);
                    }
                    
                    // アニメーションで非表示にする
                    notification.classList.remove('show');
                    
                    // アニメーション完了後に要素を削除
                    setTimeout(() => {
                        try {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                            // 通知配列から削除
                            NotificationManager.notifications = NotificationManager.notifications.filter(n => n.element !== notification);
                        } catch (removeError) {
                            console.error('Error removing notification element:', removeError);
                        }
                    }, 500);
                }
            } catch (error) {
                console.error('Failed to remove notification:', error);
            }
        }

        // 通知を削除する（静的メソッド）
        static removeNotification(notification) {
            try {
                const manager = this.getInstance();
                if (manager) {
                    manager.removeNotification(notification);
                }
            } catch (error) {
                console.error('Failed to remove notification (static):', error);
            }
        }

        // 破棄
        destroy() {
            try {
                // 全ての通知のタイマーをクリア
                NotificationManager.notifications.forEach(notif => {
                    if (notif.timerId) {
                        clearTimeout(notif.timerId);
                    }
                });
                
                if (this.hostElement && this.hostElement.parentNode) {
                    this.hostElement.parentNode.removeChild(this.hostElement);
                    this.hostElement = null;
                }
                this.isInitialized = false;
                NotificationManager.notifications = [];
                NotificationManager.instance = null;
            } catch (error) {
                console.error('Failed to destroy NotificationManager:', error);
            }
        }
    }

    // 設定UI管理クラス
    class SettingsUI extends ShadowDOMComponent {
        constructor(settingsManager) {
            super();
            this.settingsManager = settingsManager;
            // 設定の初期化を確実に行う
            this.settings = this.settingsManager.loadSettings() || { ...DEFAULT_SETTINGS };
            this.currentVideoInfo = this.settingsManager.loadVideoData();
            // 検索機能を復活（新ニコニコ検索に対応）
            this.fetcher = new NicoApiFetcher(); // APIフェッチャーを初期化
            this.searcher = new NicoVideoSearcher(); // 検索機能を初期化
            this.lastAutoButtonElement = null; // 最後に「自動」ボタンで設定した動画要素を保持
            this.hostElement = null;
            console.log('SettingsUI initialized with settings:', this.settings);  // デバッグログ追加
        }

        // 設定UIの作成
        createSettingsUI() {
            // ホスト要素を作成
            this.hostElement = document.createElement('div');
            this.hostElement.className = 'nico-comment-shadow-host settings-host';
            
            // シャドウDOMを作成
            this.createShadowDOM(this.hostElement);
            this.addStyles(ShadowStyleManager.getCommonStyles());
            
            // 数値のフォーマット関数
            const formatNumber = (num) => {
                if (typeof num === 'number') {
                    return num.toLocaleString();
                }
                return num || '-';
            };
            
            // 日付のフォーマット関数
            const formatDate = (dateStr) => {
                if (!dateStr) return '-';
                try {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                } catch (error) {
                    return dateStr;
                }
            };
            
            const settingsHTML = `
                <div class="nico-comment-settings">
                    <h2>ニコニココメント設定</h2>
                    
                    <div class="setting-group search-section">
                        <h3>ニコニコ動画を検索</h3>
                        <div class="search-container">
                            <input type="text" id="searchInput" placeholder="作品名や話数などで検索">
                            <button id="searchButton">検索</button>
                            <button id="openSearchPageDirect" class="open-search-page-direct-btn">ニコニコ検索ページへ</button>
                        </div>
                        <div id="searchResults" class="search-results"></div>
                    </div>

                    <div class="setting-group current-settings">
                        <h3>現在の設定</h3>
                        <div id="currentVideoInfo" class="current-video-info">
                            <div class="thumbnail-wrapper">
                                <div class="thumbnail-container">
                                    <img id="currentThumbnail" src="${this.currentVideoInfo?.thumbnail || ''}" alt="サムネイル">
                                    <div class="thumbnail-overlay"></div>
                                </div>
                                <button id="playCurrentVideo" class="play-button" title="この動画を再生">
                                    <span class="play-icon">▶</span>
                                </button>
                            </div>
                            <div class="info-container">
                                <p>動画ID: <span id="currentVideoId">${this.currentVideoInfo?.videoId || '未設定'}</span></p>
                                <p>タイトル: <span id="currentTitle">${this.currentVideoInfo?.title || '未設定'}</span></p>
                                <p>投稿者: <span id="currentOwner">${this.currentVideoInfo?.owner?.nickname || this.currentVideoInfo?.channel?.name || '-'}</span></p>
                                <p>再生数: <span id="currentViewCount">${formatNumber(this.currentVideoInfo?.viewCount)}</span></p>
                                <p>コメント数: <span id="currentCommentCount">${formatNumber(this.currentVideoInfo?.commentCount)}</span></p>
                                <p>マイリスト数: <span id="currentMylistCount">${formatNumber(this.currentVideoInfo?.mylistCount)}</span></p>
                                <p>投稿日: <span id="currentPostedAt">${formatDate(this.currentVideoInfo?.postedAt)}</span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h3>表示設定</h3>
                        <div class="color-setting">
                            <label>コメント色:</label>
                            <div class="color-presets">
                                <button class="color-preset-btn" data-color="#FFFFFF" style="background-color: #FFFFFF"></button>
                                <button class="color-preset-btn" data-color="#FF0000" style="background-color: #FF0000"></button>
                                <button class="color-preset-btn" data-color="#00FF00" style="background-color: #00FF00"></button>
                                <button class="color-preset-btn" data-color="#0000FF" style="background-color: #0000FF"></button>
                                <button class="color-preset-btn" data-color="#FFFF00" style="background-color: #FFFF00"></button>
                                <button class="color-preset-btn" data-color="#FF00FF" style="background-color: #FF00FF"></button>
                                <button class="color-preset-btn" data-color="#00FFFF" style="background-color: #00FFFF"></button>
                                <button class="color-preset-btn" data-color="#FFA500" style="background-color: #FFA500"></button>
                                <button class="color-preset-btn" data-color="#800080" style="background-color: #800080"></button>
                                <button class="color-preset-btn" data-color="#008000" style="background-color: #008000"></button>
                                <button class="color-preset-btn" data-color="#FF69B4" style="background-color: #FF69B4"></button>
                                <button class="color-preset-btn" data-color="#4B0082" style="background-color: #4B0082"></button>
                                <button class="color-preset-btn" data-color="#FF4500" style="background-color: #FF4500"></button>
                                <button class="color-preset-btn" data-color="#00CED1" style="background-color: #00CED1"></button>
                                <button class="color-preset-btn" data-color="#32CD32" style="background-color: #32CD32"></button>
                                <button class="color-preset-btn" data-color="#FFB6C1" style="background-color: #FFB6C1"></button>
                                <button class="color-preset-btn" data-color="#DDA0DD" style="background-color: #DDA0DD"></button>
                                <button class="color-preset-btn" data-color="#F0E68C" style="background-color: #F0E68C"></button>
                                <button class="color-preset-btn" data-color="#87CEEB" style="background-color: #87CEEB"></button>
                                <button class="color-preset-btn" data-color="#98FB98" style="background-color: #98FB98"></button>
                            </div>
                            <div class="color-picker-container">
                                <button id="openColorPicker" class="color-picker-button">
                                    カラーピッカー
                                </button>
                                <div id="colorPicker" class="color-picker hidden">
                                    <input type="color" id="colorPickerInput" value="${this.settings.commentColor}">
                                </div>
                            </div>
                            <span id="currentColorDisplay" class="current-color-display">
                                現在の色: <span class="color-preview" style="background-color: ${this.settings.commentColor}"></span>
                                <span class="color-value">${this.settings.commentColor}</span>
                            </span>
                        </div>
                        <div class="opacity-setting">
                            <label>
                                透明度:
                                <select id="commentOpacity">
                                    <option value="0.1">0.1</option>
                                    <option value="0.2">0.2</option>
                                    <option value="0.3">0.3</option>
                                    <option value="0.4">0.4</option>
                                    <option value="0.5">0.5</option>
                                    <option value="0.6">0.6</option>
                                    <option value="0.7">0.7</option>
                                    <option value="0.75" selected>0.75</option>
                                    <option value="0.8">0.8</option>
                                    <option value="0.9">0.9</option>
                                    <option value="1.0">1.0</option>
                                </select>
                            </label>
                        </div>
                        <div class="visibility-toggle">
                            <button id="commentVisibilityToggle" class="toggle-button">
                                ${this.settings.isCommentVisible ? '表示中' : '非表示中'}
                            </button>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h3>NGワード設定</h3>
                        <div class="ng-words-container">
                            <button id="showNgWords" class="mask-button">NGワードを編集</button>
                            <textarea class="ng-words hidden" id="ngWords"
                                      placeholder="NGワードを1行ずつ入力">${this.settings.ngWords.join('\n')}</textarea>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <h3>NG正規表現設定</h3>
                        <div class="ng-regexp-container">
                            <button id="showNgRegexp" class="mask-button">NG正規表現を編集</button>
                            <textarea class="ng-words hidden" id="ngRegexps"
                                      placeholder="NG正規表現を1行ずつ入力">${this.settings.ngRegexps.join('\n')}</textarea>
                        </div>
                    </div>
                    
                    <button id="saveSettings">設定を保存</button>
                </div>
            `;

            this.setHTML(settingsHTML);

            // イベントリスナーの設定
            this.setupEventListeners();

            return this.hostElement;
        }

        // 自動ボタン: 題名+話数+エピソード名で最適候補を自動設定
        addAutoCommentButtons() {
            try {
                const items = document.querySelectorAll('.itemModule.list');
                items.forEach(item => {
                    const titleElement = item.querySelector('.line1');
                    if (!titleElement || titleElement.querySelector('.auto-comment-button-host')) return;

                    const title = titleElement.querySelector('span')?.textContent?.trim() || '';
                    const episodeNumber = item.querySelector('.number.line1 span')?.textContent?.trim() || '';
                    const episodeTitle = item.querySelector('.episode.line1 span')?.textContent?.trim() || '';

                    const buttonHost = document.createElement('div');
                    buttonHost.className = 'nico-comment-shadow-host auto-comment-button-host';
                    buttonHost.style.cssText = `
                    position: absolute;
                    left: 107px;
                    top: 6px;
                    margin-left: 8px;
                `;

                    const shadowRoot = buttonHost.attachShadow({ mode: 'closed' });
                    const style = document.createElement('style');
                    style.textContent = ShadowStyleManager.getAutoButtonStyles();
                    shadowRoot.appendChild(style);

                    const button = document.createElement('button');
                    button.className = 'auto-comment-button';
                    button.textContent = '自動';
                    button.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        try {
                            this.lastAutoButtonElement = item;

                            const parts = [];
                            if (title) parts.push(title);
                            if (episodeNumber) parts.push(episodeNumber);
                            if (episodeTitle) parts.push(episodeTitle);
                            if (parts.length === 0) {
                                throw new Error('検索に必要な情報が見つかりません');
                            }
                            const query = parts.join(' ');
                            NotificationManager.show(`「${query}」でコメントを検索中...`);

                            // 設定UI側の検索欄にも反映
                            const searchInput = this.querySelector('#searchInput');
                            const searchButton = this.querySelector('#searchButton');
                            const searchResults = this.querySelector('#searchResults');
                            if (searchInput && searchButton && searchResults) {
                                searchInput.value = query;
                                searchButton.click();
                                searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }

                            const results = await this.searcher.search(query);
                            if (results.length > 0) {
                                const best = results[0]; // 再生数順でソート済み
                                // 類似度
                                const sim = this.searcher.calculateSimilarity(query, best.title);
                                const simP = Math.round(sim * 100);

                                // APIから詳細取得（所有者など）
                                try {
                                    await this.fetcher.fetchApiData(best.videoId);
                                } catch (apiErr) {
                                    console.debug('自動: API取得失敗', apiErr);
                                }

                                this.setCurrentVideo(best);
                                NotificationManager.show(`「${title}${episodeNumber ? ' ' + episodeNumber : ''}」のコメントを設定しました（類似度: ${simP}%）`, simP < 50 ? 'warning' : 'success');
                            } else {
                                throw new Error('動画が見つかりません');
                            }
                        } catch (err) {
                            console.error('自動設定エラー:', err);
                            NotificationManager.show(`エラーが発生しました: ${err.message}`);
                        }
                    };

                    shadowRoot.appendChild(button);
                    titleElement.appendChild(buttonHost);
                });
            } catch (error) {
                console.error('Failed to add auto comment buttons:', error);
                NotificationManager.show('自動検索ボタンの追加に失敗しました', 'error');
            }
        }

        // イベントリスナーの設定
        setupEventListeners() {
            try {
                const openSearchPageDirectBtn = this.querySelector('#openSearchPageDirect');
                const searchInput = this.querySelector('#searchInput');
                const searchButton = this.querySelector('#searchButton');
                const searchResultsContainer = this.querySelector('#searchResults');

                if (openSearchPageDirectBtn) {
                    openSearchPageDirectBtn.addEventListener('click', () => {
                        const keyword = (searchInput ? searchInput.value.trim() : '');
                        if (keyword) {
                            window.open(`https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}`, '_blank');
                        } else {
                            window.open('https://www.nicovideo.jp/search', '_blank');
                        }
                    });
                }

                // 検索ボタン/Enterで検索実行
                const executeSearch = async () => {
                    try {
                        const keyword = searchInput ? searchInput.value.trim() : '';
                        if (!keyword) {
                            NotificationManager.show('キーワードを入力してください', 'warning');
                            return;
                        }
                        const notice = NotificationManager.show(`「${keyword}」を検索中...`, 'info');
                        const results = await this.searcher.search(keyword);
                        NotificationManager.removeNotification(notice.element);
                        if (searchResultsContainer) {
                            this.displaySearchResults(results, searchResultsContainer);
                        }
                        if (!results || results.length === 0) {
                            NotificationManager.show('検索結果が見つかりませんでした', 'warning');
                        }
                    } catch (err) {
                        ErrorLogger.logAndNotify(err, 'SettingsUI.executeSearch', 'error');
                    }
                };
                if (searchButton) {
                    searchButton.addEventListener('click', executeSearch);
                }
                if (searchInput) {
                    searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') executeSearch();
                    });
                }

                // 動画ID直接設定UIは廃止

                // カラープリセットボタンのイベントリスナー
                const colorPresetButtons = this.querySelectorAll('.color-preset-btn');
                const currentColorDisplay = this.querySelector('#currentColorDisplay');
                const colorPickerButton = this.querySelector('#openColorPicker');
                const colorPicker = this.querySelector('#colorPicker');
                const colorPickerInput = this.querySelector('#colorPickerInput');
                
                if (!currentColorDisplay || !colorPickerButton || !colorPicker || !colorPickerInput) {
                    console.error('Required color picker elements not found');
                    return;
                }
                
                // カラーピッカーの表示/非表示を切り替え
                colorPickerButton.addEventListener('click', () => {
                    colorPicker.classList.toggle('hidden');
                    colorPickerButton.textContent = colorPicker.classList.contains('hidden') ? 
                        'カラーパレットを開く' : 'カラーパレットを閉じる';
                });

                // カラーピッカーの値が変更されたときの処理
                colorPickerInput.addEventListener('input', (e) => {
                    const color = e.target.value;
                    
                    // 選択状態をリセット
                    colorPresetButtons.forEach(btn => btn.classList.remove('selected'));
                    
                    // 現在の色の表示を更新
                    const colorPreview = currentColorDisplay.querySelector('.color-preview');
                    const colorValue = currentColorDisplay.querySelector('.color-value');
                    if (colorPreview) colorPreview.style.backgroundColor = color;
                    if (colorValue) colorValue.textContent = color;
                    
                    // 設定を更新して保存
                    this.settings.commentColor = color;
                    this.settingsManager.updateSettings(this.settings);
                });
                
                colorPresetButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const color = button.dataset.color;
                        
                        // 選択状態の更新
                        colorPresetButtons.forEach(btn => btn.classList.remove('selected'));
                        button.classList.add('selected');
                        
                        // カラーピッカーの値も更新
                        colorPickerInput.value = color;
                        
                        // 現在の色の表示を更新
                        const colorPreview = currentColorDisplay.querySelector('.color-preview');
                        const colorValue = currentColorDisplay.querySelector('.color-value');
                        if (colorPreview) colorPreview.style.backgroundColor = color;
                        if (colorValue) colorValue.textContent = color;
                        
                        // 設定を更新して保存
                        this.settings.commentColor = color;
                        this.settingsManager.updateSettings(this.settings);
                    });
                });

                // 初期選択状態の設定
                const initialColorButton = Array.from(colorPresetButtons)
                    .find(button => button.dataset.color === this.settings.commentColor);
                if (initialColorButton) {
                    initialColorButton.classList.add('selected');
                }
                colorPickerInput.value = this.settings.commentColor;

                // コメント表示切り替え
                const visibilityToggle = this.querySelector('#commentVisibilityToggle');
                if (visibilityToggle) {
                    visibilityToggle.addEventListener('click', () => {
                        this.settings.isCommentVisible = !this.settings.isCommentVisible;
                        visibilityToggle.textContent = this.settings.isCommentVisible ? '表示中' : '非表示中';
                        visibilityToggle.classList.toggle('off', !this.settings.isCommentVisible);
                        this.settingsManager.updateSettings(this.settings);
                    });
                }

                // 透明度の入力制限
                const opacityInput = this.querySelector('#commentOpacity');
                if (opacityInput) {
                    opacityInput.value = this.settings.commentOpacity.toString();  // 現在の設定値を反映
                    opacityInput.addEventListener('change', (e) => {
                        let value = parseFloat(e.target.value);
                        if (value < 0) value = 0;
                        if (value > 1) value = 1;
                        this.settings.commentOpacity = value;
                        this.settingsManager.updateSettings(this.settings);
                    });
                }

                // NGワード・正規表現のマスク処理
                const ngButtons = {
                    'showNgWords': {
                        textarea: 'ngWords',
                        showText: 'NGワードを編集',
                        hideText: 'マスクする'
                    },
                    'showNgRegexp': {
                        textarea: 'ngRegexps',
                        showText: 'NG正規表現を編集',
                        hideText: 'マスクする'
                    }
                };

                Object.entries(ngButtons).forEach(([buttonId, config]) => {
                    const button = this.querySelector(`#${buttonId}`);
                    const textarea = this.querySelector(`#${config.textarea}`);
                    
                    if (button && textarea) {
                        button.addEventListener('click', () => {
                            const isHidden = textarea.classList.contains('hidden');
                            textarea.classList.toggle('hidden');
                            button.textContent = isHidden ? config.hideText : config.showText;
                        });
                    }
                });

                // 設定保存
                const saveButton = this.querySelector('#saveSettings');
                if (saveButton) {
                    saveButton.addEventListener('click', () => {
                        try {
                            const ngWordsTextarea = this.querySelector('#ngWords');
                            const ngRegexpsTextarea = this.querySelector('#ngRegexps');
                            const opacitySelect = this.querySelector('#commentOpacity');
                            
                            const newSettings = {
                                commentColor: this.settings.commentColor,
                                commentOpacity: parseFloat(opacitySelect?.value || this.settings.commentOpacity),
                                isCommentVisible: this.settings.isCommentVisible,
                                ngWords: (ngWordsTextarea?.value || '')
                                    .split('\n')
                                    .map(word => word.trim())
                                    .filter(word => word),
                                ngRegexps: (ngRegexpsTextarea?.value || '')
                                    .split('\n')
                                    .map(pattern => pattern.trim())
                                    .filter(pattern => pattern)
                            };
                            
                            // 設定を更新して保存
                            this.settingsManager.updateSettings(newSettings);
                            this.settings = newSettings;  // 直接this.settingsも更新
                            NotificationManager.show('設定を保存しました');
                            
                            // デバッグログ追加
                            console.log('Settings saved:', this.settings);
                        } catch (error) {
                            console.error('Failed to save settings:', error);
                            NotificationManager.show(`設定の保存に失敗しました: ${error.message}`, 'error');
                        }
                    });
                }

                // 再生ボタンのイベントリスナー
                const playButton = this.querySelector('#playCurrentVideo');
                if (playButton) {
                    playButton.addEventListener('click', () => {
                        try {
                            if (this.lastAutoButtonElement) {
                                // 該当する動画の再生ボタンを見つけてクリック
                                const playLink = this.lastAutoButtonElement.querySelector('.thumbnailContainer > a');
                                if (playLink) {
                                    // 通知を表示
                                    NotificationManager.show(`「${this.currentVideoInfo?.title || '動画'}」を再生します...`, 'success');
                                    // 少し遅延させてからクリック
                                    setTimeout(() => {
                                        playLink.click();
                                    }, 300);
                                } else {
                                    NotificationManager.show('再生リンクが見つかりません', 'warning');
                                }
                            } else {
                                NotificationManager.show('再生できる動画がありません。先に自動ボタンでコメントを設定してください', 'warning');
                            }
                        } catch (error) {
                            console.error('Failed to play video:', error);
                            NotificationManager.show(`再生エラー: ${error.message}`, 'error');
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to setup event listeners:', error);
                NotificationManager.show('イベントリスナーの設定に失敗しました', 'error');
            }
        }

        // 検索結果の表示
        displaySearchResults(results, container) {
            container.innerHTML = '';
            
            if (results.length === 0) {
                const noResultsElement = document.createElement('div');
                noResultsElement.style.cssText = `
                    padding: 20px;
                    text-align: center;
                    color: var(--text-secondary);
                    font-style: italic;
                `;
                noResultsElement.textContent = '検索結果が見つかりませんでした';
                container.appendChild(noResultsElement);
                return;
            }
            
            // 検索キーワードを取得（類似度計算用）
            const searchInput = this.querySelector('#searchInput');
            const keyword = searchInput ? searchInput.value : '';
            
            // アニメーション用のキーフレームをシャドウDOM内に追加
            const animationStyle = document.createElement('style');
            animationStyle.textContent = `
                @keyframes fadeInResult {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .nico-link:hover {
                    color: var(--accent, #FF8906) !important;
                    text-decoration: underline !important;
                }
            `;
            this.shadowRoot.appendChild(animationStyle);
            
            // 結果を少し遅延させながら表示するアニメーション
            results.forEach((result, index) => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                
                // 少し遅延させて表示するアニメーション
                item.style.cssText = `
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                `;
                
                const formattedDate = new Date(result.postedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                // 類似度を計算
                let similarityHtml = '';
                let similarityBadge = '';
                if (keyword) {
                    const similarity = this.searcher.calculateSimilarity(keyword, result.title);
                    const similarityPercent = Math.round(similarity * 100);
                    
                    // 類似度に応じた色を設定
                    let similarityColor;
                    let badgeBackground;
                    
                    if (similarityPercent >= 70) {
                        similarityColor = 'var(--success, #2CB67D)';
                        badgeBackground = 'rgba(44, 182, 125, 0.15)';
                    } else if (similarityPercent >= 50) {
                        similarityColor = 'var(--accent, #FF8906)';
                        badgeBackground = 'rgba(255, 137, 6, 0.15)';
                    } else {
                        similarityColor = 'var(--danger, #E53170)';
                        badgeBackground = 'rgba(229, 49, 112, 0.15)';
                    }
                    
                    // スタイリッシュなバッジとして類似度を表示
                    similarityBadge = `
                        <div class="similarity-badge" style="
                            display: inline-block;
                            padding: 3px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 500;
                            color: ${similarityColor};
                            background: ${badgeBackground};
                            margin-left: 8px;
                            vertical-align: middle;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        ">
                            ${similarityPercent}%
                        </div>
                    `;
                }
                
                // HTMLを構築
                item.innerHTML = `
                    <img src="${result.thumbnail}" alt="${result.title}" loading="lazy">
                    <div class="search-result-info">
                        <div class="title">
                            ${result.title}
                            ${similarityBadge}
                        </div>
                        <div class="stats">
                            <span>👁 ${result.viewCount.toLocaleString()}</span>
                            <span>💬 ${result.commentCount.toLocaleString()}</span>
                            <span>❤ ${result.mylistCount.toLocaleString()}</span>
                        </div>
                        <div class="actions">
                            <div class="date">📅 ${formattedDate}</div>
                            <a 
                                href="https://www.nicovideo.jp/watch/${result.videoId}" 
                                target="_blank" 
                                class="nico-link"
                                onclick="event.stopPropagation();"
                                style="
                                    font-size: 12px;
                                    color: var(--primary, #7F5AF0);
                                    text-decoration: none;
                                    display: inline-flex;
                                    align-items: center;
                                    margin-left: 10px;
                                    transition: all 0.2s ease;
                                "
                            >
                                <span style="margin-right: 4px;">🔗</span>ニコニコで見る
                            </a>
                        </div>
                    </div>
                `;
                
                // 動画選択時のイベント
                item.addEventListener('click', async (e) => {
                    // リンククリック時は処理をスキップ
                    if (e.target.closest('.nico-link')) {
                        return;
                    }
                    
                    // クリック時のエフェクト
                    const allItems = container.querySelectorAll('.search-result-item');
                    allItems.forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');
                    
                    try {
                        // 選択時の通知
                        const notification = NotificationManager.show(`「${result.title}」の情報を取得中...`, 'info');
                        
                        // 動画APIからデータ取得
                        await this.fetcher.fetchApiData(result.videoId);
                        
                        // 通知を更新
                        NotificationManager.removeNotification(notification.element);
                        NotificationManager.show(`「${result.title}」を設定しました`, 'success');
                        
                        // 検索結果と同じタイトルの動画を一覧から探して lastAutoButtonElement に設定
                        const allListItems = document.querySelectorAll('.itemModule.list');
                        allListItems.forEach(listItem => {
                            const titleElement = listItem.querySelector('.line1 span');
                            if (titleElement && titleElement.textContent.trim().includes(result.title)) {
                                this.lastAutoButtonElement = listItem;
                            }
                        });
                        
                        // 動画情報を設定
                        this.setCurrentVideo(result);
                    } catch (error) {
                        NotificationManager.show(`エラー: ${error.message}`, 'error');
                    }
                });
                
                container.appendChild(item);
                
                // アニメーションが確実に動作するように、JavaScriptで直接設定
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 + (index * 50)); // 各アイテムを少しずつ遅延
            });
        }

        // 現在の動画を設定
        setCurrentVideo(videoInfo) {
            this.currentVideoInfo = videoInfo;
            
            // APIデータがあれば、そこから投稿者情報を補完
            if (this.fetcher && this.fetcher.apiData) {
                try {
                    const apiData = this.fetcher.apiData;
                    
                    // 動画情報から投稿者情報を取得
                    if (apiData.owner) {
                        videoInfo.owner = apiData.owner;
                    }
                    if (apiData.channel) {
                        videoInfo.channel = apiData.channel;
                    }
                } catch (error) {
                    console.error('投稿者情報の取得に失敗:', error);
                }
            }
            
            // 数値のフォーマット関数
            const formatNumber = (num) => {
                if (typeof num === 'number') {
                    return num.toLocaleString();
                }
                return num || '-';
            };
            
            // 日付のフォーマット関数
            const formatDate = (dateStr) => {
                if (!dateStr) return '-';
                try {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                } catch (error) {
                    return dateStr;
                }
            };
            
        // 現在の設定を更新（シャドウDOM内の要素を正しく取得）
        const elements = {
            currentVideoId: videoInfo.videoId || '未設定',
            currentTitle: videoInfo.title || '未設定',
            currentOwner: videoInfo.owner?.nickname || videoInfo.channel?.name || '-',
            currentViewCount: formatNumber(videoInfo.viewCount),
            currentCommentCount: formatNumber(videoInfo.commentCount),
            currentMylistCount: formatNumber(videoInfo.mylistCount),
            currentPostedAt: formatDate(videoInfo.postedAt)
        };

            Object.entries(elements).forEach(([id, value]) => {
                const element = this.querySelector(`#${id}`);
                if (element) {
                    element.textContent = value;
                } else {
                    console.warn(`Element with id ${id} not found in shadow DOM`);
                }
            });

            // サムネイル画像を更新
            const thumbnailImg = this.querySelector('#currentThumbnail');
            if (thumbnailImg && videoInfo.thumbnail) {
                thumbnailImg.src = videoInfo.thumbnail;
                thumbnailImg.alt = videoInfo.title || 'サムネイル';
            }

            // 動画データを保存
            try {
                if (this.settingsManager && typeof this.settingsManager.saveVideoData === 'function') {
                    this.settingsManager.saveVideoData(videoInfo.title || '', videoInfo);
                    NotificationManager.show(`「${videoInfo.title || videoInfo.videoId}」を設定しました`, 'success');
                }
            } catch (e) {
                console.error('動画データの保存に失敗:', e);
                NotificationManager.show('動画データの保存に失敗しました', 'error');
            }
            
            // 再生ボタンを有効化（存在する場合）
            const playButton = this.querySelector('#playCurrentVideo');
            if (playButton) {
                playButton.disabled = false;
                playButton.title = `「${videoInfo.title}」を再生`;
            }
        }

        // マイページへの設定UI挿入
        insertIntoMypage() {
            const target = document.querySelector('.p-mypageHeader__title');
            if (!target) return;

            this.container = this.createSettingsUI();
            target.parentElement.insertBefore(this.container, target.nextSibling);
        }
    }

    // ニコニコ動画 検索クラス（新検索ページ対応）
    class NicoVideoSearcher {
        constructor() {
            this.cache = new Map();
        }

        // HTMLエンティティをデコード
        decodeHtmlEntities(str) {
            if (!str) return '';
            let s = str
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            s = s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
            s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
            return s;
        }

        // 検索実行（キャッシュ対応）
        async search(keyword) {
            try {
                if (this.cache.has(keyword)) {
                    return this.cache.get(keyword);
                }
                const url = `https://www.nicovideo.jp/search/${encodeURIComponent(keyword)}`;
                const html = await this.fetchText(url);
                const items = this.parseServerContext(html);
                // 重複排除
                const uniq = [];
                const seen = new Set();
                for (const it of items) {
                    if (!it || !it.videoId) continue;
                    if (!seen.has(it.videoId)) {
                        seen.add(it.videoId);
                        uniq.push(it);
                    }
                }
                // 代表的に再生数で降順ソート
                uniq.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                this.cache.set(keyword, uniq);
                return uniq;
            } catch (e) {
                console.error('NicoVideoSearcher.search error:', e);
                throw e;
            }
        }

        // GM_xmlhttpRequestで取得
        fetchText(url) {
            return new Promise((resolve, reject) => {
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        onload: (res) => {
                            if (res.status >= 200 && res.status < 300) {
                                resolve(res.responseText);
                            } else {
                                reject(new Error(`HTTP ${res.status}`));
                            }
                        },
                        onerror: (e) => reject(new Error(`Network error: ${e?.error || 'unknown'}`))
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }

        // 検索ページの<meta name="server-response">からデータ抽出
        parseServerContext(html) {
            try {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const meta = doc.querySelector('meta[name="server-response"]');
                if (!meta) return [];
                const content = meta.getAttribute('content') || '';
                const decoded = this.decodeHtmlEntities(content);
                let data;
                try {
                    data = JSON.parse(decoded);
                } catch {
                    return [];
                }
                return this.extractVideoItems(data);
            } catch (err) {
                console.error('parseServerContext error:', err);
                return [];
            }
        }

        // 深い構造から動画項目を抽出
        extractVideoItems(root) {
            const results = [];
            const pushItem = (o) => {
                const videoId = (o?.id || o?.contentId || o?.watchId || '').toString();
                if (!videoId) return;
                const title = (o?.title || o?.shortTitle || '').toString();
                const count = o?.count || {};
                const viewCount = Number(count.view ?? o?.viewCounter ?? 0) || 0;
                const commentCount = Number(count.comment ?? o?.commentCounter ?? 0) || 0;
                const mylistCount = Number(count.mylist ?? o?.mylistCounter ?? 0) || 0;
                const thumbObj = o?.thumbnail || {};
                const thumbnail = (
                    thumbObj.nHdUrl || thumbObj.listingUrl || thumbObj.largeUrl || thumbObj.middleUrl || thumbObj.url || o?.thumbnailUrl || ''
                ).toString();
                const postedAt = (o?.registeredAt || o?.startTime || o?.postedDateTime || '') || '';
                const owner = o?.owner && typeof o.owner === 'object' ? { nickname: o.owner.name || o.owner.nickname || '' } : null;
                const channel = (o?.isChannelVideo || o?.owner?.ownerType === 'channel') && o?.owner ? { name: o.owner.name || '' } : null;
                if (!title) return;
                results.push({
                    videoId,
                    title,
                    viewCount,
                    commentCount,
                    mylistCount,
                    postedAt,
                    thumbnail,
                    owner,
                    channel
                });
            };

            const visit = (node) => {
                if (!node) return;
                if (Array.isArray(node)) {
                    node.forEach(visit);
                    return;
                }
                if (typeof node === 'object') {
                    // 候補っぽい形か判定
                    const looksLikeVideo = (
                        (node.id || node.contentId || node.watchId) &&
                        (node.title || node.shortTitle) &&
                        (node.thumbnail || node.thumbnailUrl || node.thumbnailSrc || node.thumbnailPath)
                    );
                    if (looksLikeVideo) pushItem(node);
                    for (const v of Object.values(node)) visit(v);
                }
            };
            visit(root);
            return results;
        }

        // レーベンシュタイン距離に基づく類似度（0..1）
        calculateSimilarity(str1, str2) {
            if (!str1 && !str2) return 1;
            if (!str1 || !str2) return 0;
            const a = String(str1).toLowerCase();
            const b = String(str2).toLowerCase();
            const m = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
            for (let i = 0; i <= a.length; i++) m[i][0] = i;
            for (let j = 0; j <= b.length; j++) m[0][j] = j;
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    m[i][j] = Math.min(
                        m[i - 1][j] + 1,
                        m[i][j - 1] + 1,
                        m[i - 1][j - 1] + cost
                    );
                }
            }
            const maxLen = Math.max(a.length, b.length);
            return maxLen === 0 ? 1 : 1 - (m[a.length][b.length] / maxLen);
        }

        // キャッシュをクリア
        clearCache() {
            this.cache.clear();
        }
    }

    // 動画切り替わり対応クラス
    class VideoSwitchHandler {
        constructor(renderer, fetcher) {
            this.renderer = renderer;
            this.fetcher = fetcher;
            this.nextVideoId = null;
            this.preloadedComments = null;
            this.lastPreloadedComments = null; // 最後に使用したプリロードコメントを保持
            this.lastVideoId = null; // 最後に使用したvideoIdを保持
            this.isSwitching = false; // ガード変数
            this.debounce = new DebounceExecutor(100);
            this.settingsManager = new SettingsManager;
        }

        // 監視開始
        startMonitoring() {
            this.checkInterval = setInterval(() => this.checkVideoEnd(), 1000);
        }

        // 監視停止
        stopMonitoring() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }

        // 動画終了チェック
        async checkVideoEnd() {
            const video = this.renderer.videoElement;
            if (!video || !Number.isFinite(video.duration)) return;

            // 動画が終了近くの場合
            if (video.duration - video.currentTime <= 30) {
                // 次の動画IDを取得
                if (!this.nextVideoId) {
                    const findNext = async () => {
                        console.log("findNextVideoIdが実行されます。");
                        await this.findNextVideoId();
                    };
                    this.debounce.execOnce(findNext);
                }
                // コメントをプリロード
                if (this.nextVideoId && !this.preloadedComments) {
                    const preload = async () => {
                        console.log("preloadCommentsが実行されます。");
                        await this.preloadComments();
                    };
                    this.debounce.execOnce(preload);
                }
            }
        }

        // 次の動画IDを探す
        async findNextVideoId() {
            try {
                // シリーズ情報から次の動画を取得
                if (this.fetcher.apiData?.series?.video?.next?.id) {
                    this.nextVideoId = this.fetcher.apiData.series.video.next.id;
                    console.log('シリーズ情報から抽出した次の動画ID:', this.nextVideoId);
                    return;
                }

                // 説明文から次の動画を推測
                const description = this.fetcher.apiData?.video?.description || '';
                
                try {
                    // 両方のパターン（数字のみ、および[a-z]{2}形式）を抽出
                    const videoIdMatches = description.match(/watch\/(?:([a-z]{2})?(\d+))/g) || [];
                    
                    if (videoIdMatches.length > 0) {
                        // IDを抽出して数値部分を取得
                        const videoNumbers = [];
                        for (const match of videoIdMatches) {
                            try {
                                const regexResult = /watch\/(?:([a-z]{2}))?(\d+)/.exec(match);
                                if (regexResult) {
                                    const [, prefix, num] = regexResult;
                                    if (num) { // numが存在する場合のみ追加
                                        videoNumbers.push({
                                            fullId: prefix ? `${prefix}${num}` : num,
                                            number: parseInt(num, 10) || 0 // パース失敗時は0を使用
                                        });
                                    }
                                }
                            } catch (matchError) {
                                console.error('動画ID抽出エラー:', matchError, 'マッチ:', match);
                                // 個別のマッチ処理でエラーが発生しても継続
                            }
                        }
                        
                        // 有効な結果があれば処理
                        if (videoNumbers.length > 0) {
                            // 数字が大きい方を次のエピソードとして選択
                            const nextVideo = videoNumbers.reduce((max, current) => 
                                (current.number > max.number) ? current : max
                            , videoNumbers[0]);
                            
                            this.nextVideoId = nextVideo.fullId;
                            console.log('説明文から抽出した次の動画ID:', this.nextVideoId);
                        } else {
                            console.log('有効な動画IDが抽出できませんでした');
                        }
                    } else {
                        console.log('説明文に動画IDのパターンが見つかりませんでした');
                    }
                } catch (regexError) {
                    console.error('正規表現処理エラー:', regexError);
                    // 正規表現処理でエラーが発生しても続行可能
                }
            } catch (error) {
                console.error('次の動画ID取得エラー:', error);
                // エラーが発生してもnextVideoIdはnullのまま
            }
        }

        // コメントのプリロード
        async preloadComments() {
            try {
                console.log('コメントをプリロード中...');
                if (!this.nextVideoId) return;

                const comments = await this.fetcher.fetchAllData(this.nextVideoId);
                
                // コメントが取得できなかった場合や空の場合はnullを設定
                if (!comments || !Array.isArray(comments) || comments.length === 0) {
                    console.log('プリロードコメントの取得に失敗、または空でした。');
                    this.preloadedComments = null;
                    return;
                }
                
                this.preloadedComments = comments.filter(comment => 
                    !this.renderer.isNGComment(comment.text)
                );
                
                // フィルタリング後も空の場合はnullに設定
                if (!this.preloadedComments || this.preloadedComments.length === 0) {
                    console.log('フィルタリング後のプリロードコメントが空でした。');
                    this.preloadedComments = null;
                    return;
                }
                
                console.log('プリロードしたコメント:', this.preloadedComments);
            } catch (error) {
                console.error('コメントプリロードエラー:', error);
                // エラーが発生した場合もnullを設定
                this.preloadedComments = null;
            }
        }

        // 動画切り替わり時に呼ばれるメソッド
        async onVideoSwitch(newVideo) {
            console.log("onVideoSwitchが実行されています。");
            console.log("現在のpreloadedComments:", this.preloadedComments);
            
            // ガード条件を強化
            if (this.isSwitching) {
                console.log('すでに動画切り替え処理中のため、重複実行を防止します。');
                return;
            }
            
            this.isSwitching = true;

            try {
                // newVideoオブジェクトの詳細を確認
                console.log('newVideoオブジェクトの詳細:', {
                    exists: !!newVideo,
                    type: typeof newVideo,
                    keys: Object.keys(newVideo || {}),
                    content: newVideo
                });
                
                // preloadedCommentsのバックアップを作成 (nullの場合は前回の値を使用)
                const backupPreloadedComments = this.preloadedComments || this.lastPreloadedComments;
                
                // videoIdを取得 (nullの場合は前回の値を使用)
                const videoId = this.nextVideoId || 
                               (newVideo?.dataset?.videoId) || 
                               (newVideo?.getAttribute && newVideo.getAttribute('data-video-id')) || 
                               this.lastVideoId;
                console.log('取得したvideoId:', videoId);
                
                // ガード条件の詳細ログ
                console.log('ガード条件の詳細:', {
                    isSwitching: this.isSwitching,
                    newVideoExists: !!newVideo,
                    videoIdExists: !!videoId,
                    hasBackupComments: !!backupPreloadedComments
                });
                
                if (!newVideo || (!videoId && !backupPreloadedComments)) {
                    console.log('ガード条件に引っかかりました。動画情報が不完全です。');
                    // 重要: videoIdが取得できなくても、プリロードしたコメントはクリアしない
                    // コメントをクリアして次の動画のコメントが無いことを通知
                    if (!backupPreloadedComments) {
                        if (this.renderer && typeof this.renderer.clearComments === 'function') {
                            this.renderer.clearComments();
                        }
                        NotificationManager.show('次の動画のコメントを取得できませんでした。コメント表示をクリアします。', 'warning');
                    }
                    return;
                }

                // 動画切り替わり通知
                NotificationManager.show('動画の切り替わりを検知しました...', 'info');
                
                // 動画データを取得して保存
                let videoInfo = null;
                if (videoId) {
                    try {
                        const apiData = await this.fetcher.fetchApiData(videoId);
                        if (apiData && apiData.video) {
                            videoInfo = {
                                videoId: apiData.video.id,
                                title: apiData.video.title,
                                viewCount: apiData.video.count?.view || 0,
                                mylistCount: apiData.video.count?.mylist || 0,
                                commentCount: apiData.video.count?.comment || 0,
                                postedAt: apiData.video.registeredAt ? new Date(apiData.video.registeredAt).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }).replace(/\//g, '/').replace(/\s+/g, ' ') : '',
                                thumbnail: apiData.video.thumbnail?.url || '',
                                owner: apiData.owner || null,
                                channel: apiData.channel || null
                            };
                            
                            if (this.settingsManager && typeof this.settingsManager.saveVideoData === 'function') {
                                this.settingsManager.saveVideoData(videoInfo.title, videoInfo);
                            }
                            
                            // videoIdを保存
                            this.lastVideoId = videoId;
                        }
                    } catch (error) {
                        console.error('API取得エラー:', error);
                        // APIエラーでもプリロードしたコメントがあれば続行
                        if (!backupPreloadedComments) {
                            throw error; // コメントもないなら例外をスロー
                        }
                    }
                }

                let commentsLoaded = false;
                
                // コメントを取得する前にクリア
                if (this.renderer && typeof this.renderer.clearComments === 'function') {
                    this.renderer.clearComments();
                }
                
                // プリロードしたコメントがある場合はそれを使用
                if (Array.isArray(backupPreloadedComments) && backupPreloadedComments.length > 0) {
                    console.log('プリロードしたコメントを使用します');
                    try {
                        for (const comment of backupPreloadedComments) {
                            if (this.renderer && typeof this.renderer.addComment === 'function') {
                                this.renderer.addComment(comment.text, comment.vpos, comment.commands);
                            }
                        }
                        commentsLoaded = true;
                        
                        // 現在のプリロードコメントを保存
                        this.lastPreloadedComments = [...backupPreloadedComments];
                        
                        // コメントソース切り替わり通知
                        const title = videoInfo ? videoInfo.title : '不明なタイトル';
                        NotificationManager.show(`コメントソースを更新しました: ${title} (${backupPreloadedComments.length}件)`, 'success');
                    } catch (error) {
                        console.error('プリロードコメントの追加に失敗:', error);
                    }
                } else if (videoId) {
                    // プリロードしたコメントがない場合はAPIから取得
                    console.log('APIからコメントを取得します');
                    try {
                        const comments = await this.fetcher.fetchAllData(videoId);
                        if (Array.isArray(comments) && comments.length > 0) {
                            for (const comment of comments) {
                                if (this.renderer && typeof this.renderer.addComment === 'function') {
                                    this.renderer.addComment(comment.text, comment.vpos, comment.commands);
                                }
                            }
                            commentsLoaded = true;
                            
                            // 新しく取得したコメントを保存
                            this.lastPreloadedComments = [...comments];
                            
                            // コメントソース切り替わり通知
                            const title = videoInfo ? videoInfo.title : '不明なタイトル';
                            NotificationManager.show(`コメントソースを更新しました: ${title} (${comments.length}件)`, 'success');
                        } else {
                            // コメントが取得できなかった場合
                            const title = videoInfo ? videoInfo.title : '不明なタイトル';
                            NotificationManager.show(`コメントを取得できませんでした: ${title}`, 'warning');
                        }
                    } catch (error) {
                        console.error('APIからのコメント取得に失敗:', error);
                        const title = videoInfo ? videoInfo.title : '不明なタイトル';
                        NotificationManager.show(`コメント取得エラー: ${title} - ${error.message}`, 'error');
                    }
                }
                
                // コメントが取得できなかった場合は通知
                if (!commentsLoaded) {
                    console.log('コメントが取得できなかったか、空でした');
                    // 既に警告が表示されているので重複しない
                }

                // 次の動画IDとプリロードコメントをリセット
                // 処理が完了した後でリセット (lastプロパティには値を残す)
                this.nextVideoId = null;
                this.preloadedComments = null;

                // 動画情報を更新
                this.currentVideo = newVideo;
            } catch (error) {
                console.error('動画切り替え中にエラーが発生しました:', error);
                NotificationManager.show(`動画切り替えエラー: ${error.message}`, 'error');
                
                // エラーが発生した場合もコメントをクリアする
                if (this.renderer && typeof this.renderer.clearComments === 'function') {
                    this.renderer.clearComments();
                }
            } finally {
                this.isSwitching = false;
            }
        }
    }

    // 設定管理クラス
    class SettingsManager {
        constructor() {
            this.settings = DEFAULT_SETTINGS;
            this.observers = new Set();
            this.loadSettings();
            this.currentVideo = this.loadVideoData();
            console.log('SettingsManager initialized with video data:', this.currentVideo);  // デバッグログ追加
        }

        // 動画データの読み込み
        loadVideoData() {
            try {
                const videoData = GM_getValue('currentVideo');
                console.log('Loading video data:', videoData);  // デバッグログ追加
                return videoData || null;
            } catch (e) {
                console.error('動画データの読み込みに失敗:', e);
                NotificationManager.show('動画データの読み込みに失敗しました', 'error');
                return null;
            }
        }

        // 動画データの保存（メタデータ含む）
        saveVideoData(title, videoInfo) {
            try {
                const videoData = {
                    videoId: videoInfo.videoId,
                    title: videoInfo.title,
                    viewCount: videoInfo.viewCount,
                    commentCount: videoInfo.commentCount,
                    mylistCount: videoInfo.mylistCount,
                    postedAt: videoInfo.postedAt,
                    thumbnail: videoInfo.thumbnail,
                    owner: videoInfo.owner || null,
                    channel: videoInfo.channel || null
                };
                console.log('Saving video data:', videoData);
                GM_setValue('currentVideo', videoData);
                this.currentVideo = videoData;
                return true;
            } catch (e) {
                console.error('動画データの保存に失敗:', e);
                NotificationManager.show('動画データの保存に失敗しました', 'error');
                return false;
            }
        }

        // 設定の読み込み
        loadSettings() {
            try {
                const saved = GM_getValue('settings');
                if (saved) {
                    this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
                    this.notifyObservers();
                    return this.settings;  // 設定を返すように修正
                }
                return this.settings;  // 設定が無い場合は現在の設定を返す
            } catch (e) {
                console.error('設定の読み込みに失敗:', e);
                NotificationManager.show('設定の読み込みに失敗しました', 'error');
                return this.settings;  // エラー時は現在の設定を返す
            }
        }

        // 設定の保存
        saveSettings() {
            try {
                console.log('Saving settings:', this.settings);  // デバッグログ追加
                GM_setValue('settings', JSON.stringify(this.settings));
                this.notifyObservers();
                NotificationManager.show('設定を保存しました', 'success');
                return true;  // 保存成功を返す
            } catch (e) {
                console.error('設定の保存に失敗:', e);
                NotificationManager.show('設定の保存に失敗しました', 'error');
                return false;  // 保存失敗を返す
            }
        }

        // 設定の更新
        updateSettings(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
            this.saveSettings();
        }

        // オブザーバーの追加
        addObserver(observer) {
            this.observers.add(observer);
        }

        // オブザーバーの削除
        removeObserver(observer) {
            this.observers.delete(observer);
        }

        // オブザーバーに通知
        notifyObservers() {
            for (const observer of this.observers) {
                observer(this.settings);
            }
        }
    }

    // キーボードショートカット管理クラス
    class KeyboardShortcutHandler {
        constructor() {
            this.shortcuts = new Map();
            this.isEnabled = true;
        }

        // ショートカットの追加
        addShortcut(key, modifier, callback) {
            const shortcutKey = this.createShortcutKey(key, modifier);
            this.shortcuts.set(shortcutKey, callback);
        }

        // ショートカットの削除
        removeShortcut(key, modifier) {
            const shortcutKey = this.createShortcutKey(key, modifier);
            this.shortcuts.delete(shortcutKey);
        }

        // ショートカットキーの生成
        createShortcutKey(key, modifier) {
            return `${modifier ? modifier + '+' : ''}${key}`;
        }

        // キーボードイベントのハンドリング
        handleKeyDown(event) {
            if (!this.isEnabled) return;

            // 入力欄でのショートカットを無効化
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = event.key;
            const modifier = 
                (event.ctrlKey ? 'Ctrl+' : '') +
                (event.altKey ? 'Alt+' : '') +
                (event.shiftKey ? 'Shift+' : '') +
                (event.metaKey ? 'Meta+' : '');

            const shortcutKey = this.createShortcutKey(key, modifier.slice(0, -1));
            const callback = this.shortcuts.get(shortcutKey);

            if (callback) {
                event.preventDefault();
                callback();
            }
        }

        // 監視の開始
        startListening() {
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        }

        // 監視の停止
        stopListening() {
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        }

        // 有効/無効の切り替え
        setEnabled(enabled) {
            this.isEnabled = enabled;
        }
    }

 // Debounce オンリー・ワン・エクスキューションクラス
    class DebounceExecutor {
        constructor(delay) {
            this.delay = delay;
            this.timers = new Map();  // 関数ごとにタイマーを管理するMap
            this.funcIds = new Map(); // 関数に一意のIDを割り当てるMap
            this.nextId = 1;          // 次に割り当てるID
        }

        // 関数に一意のIDを割り当てる
        getFuncId(func) {
            if (!this.funcIds.has(func)) {
                this.funcIds.set(func, this.nextId++);
            }
            return this.funcIds.get(func);
        }

        exec(func) {
            const funcId = this.getFuncId(func);
            const now = Date.now();
            const lastExec = this.timers.get(funcId)?.lastExec || 0;
            const elapsed = now - lastExec;

            if (elapsed > this.delay) {
                func();
                this.timers.set(funcId, { lastExec: now });
            } else {
                clearTimeout(this.timers.get(funcId)?.timerId);
                const timerId = setTimeout(() => {
                    func();
                    this.timers.set(funcId, { lastExec: Date.now() });
                }, this.delay - elapsed);
                this.timers.set(funcId, { timerId, lastExec });
            }
        }

        execOnce(func) {
            const funcId = this.getFuncId(func);
            
            // すでに実行中または実行完了している場合は何もしない
            const currentTimer = this.timers.get(funcId);
            if (currentTimer?.executedOnce) {
                console.log(`関数 ID:${funcId} はすでに実行済みまたは実行中のため、キャンセルします`);
                if (currentTimer.timerId) {
                    clearTimeout(currentTimer.timerId);
                }
                return;
            }

            console.log(`関数 ID:${funcId} を ${this.delay}ms 後に実行するようスケジュールします`);
            
            // 既存のタイマーがあればクリア
            if (currentTimer?.timerId) {
                clearTimeout(currentTimer.timerId);
            }
            
            // 処理をスケジュールし、状態を「実行中」に設定
            const timerId = setTimeout(() => {
                try {
                    console.log(`関数 ID:${funcId} を実行します`);
                    func();
                } catch (error) {
                    console.error(`関数 ID:${funcId} の実行中にエラーが発生しました:`, error);
                } finally {
                    // 実行完了を記録
                    this.timers.set(funcId, { 
                        executedOnce: true, 
                        lastExec: Date.now(),
                        timerId: null
                    });
                }
            }, this.delay);
            
            // タイマーIDと実行状態を保存
            this.timers.set(funcId, { 
                timerId, 
                executedOnce: false,
                scheduled: true
            });
        }

        cancel(func) {
            const funcId = this.getFuncId(func);
            if (funcId && this.timers.has(funcId)) {
                clearTimeout(this.timers.get(funcId)?.timerId);
                this.timers.delete(funcId);
            }
        }

        resetExecution(func) {
            const funcId = this.getFuncId(func);
            if (funcId && this.timers.has(funcId)) {
                const timer = this.timers.get(funcId);
                clearTimeout(timer?.timerId);
                this.timers.set(funcId, {
                    executedOnce: false,
                    scheduled: false
                });
            }
        }

        clearAll() {
            for (const [funcId, timer] of this.timers) {
                clearTimeout(timer.timerId);
            }
            this.timers.clear();
        }
    }

    // 初期化処理
    async function initialize() {
        try {
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve);
                });
            }

            const pathname = location.pathname.toLowerCase();
            if (pathname.includes('/animestore/sc_d_pc')) {
                if (!unsafeWindow.__dAnimeNicoCommentRenderer2Instance) {
                    unsafeWindow.__dAnimeNicoCommentRenderer2Instance = 0;
                }
                unsafeWindow.__dAnimeNicoCommentRenderer2Instance++;

                if (unsafeWindow.__dAnimeNicoCommentRenderer2Instance > 1) {
                    return;
                }

                const debounce = new DebounceExecutor(1000);
                const waitForVideo = async () => {
                    try {
                        const videoElement = document.querySelector('video#video');
                        if (!videoElement) {
                            setTimeout(waitForVideo, 100);
                            return;
                        }

                        if (videoElement.readyState === 0) {
                            const handleLoadedMetadata = () => {
                                debounce.execOnce(() => initializeWithVideo(videoElement));
                                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                            };
                            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
                        } else {
                            debounce.execOnce(() => initializeWithVideo(videoElement));
                        }
                    } catch (error) {
                        ErrorLogger.log(error, 'initialize.waitForVideo');
                        setTimeout(waitForVideo, 1000); // エラー時は少し長めに待つ
                    }
                };

                waitForVideo();
            }
            else if (pathname.includes('/animestore/mp_viw_pc')) {
                try {
                    const settingsManager = new SettingsManager();
                    const settingsUI = new SettingsUI(settingsManager);
                    
                    const waitForHeaderTitle = () => {
                        try {
                            const headerTitle = document.querySelector('.p-mypageHeader__title');
                            if (headerTitle) {
                                settingsUI.insertIntoMypage();
                                
                                const listContainer = document.querySelector('.p-mypageMain');
                                if (listContainer) {
                                    const listObserver = new MutationObserver(() => {
                                        try {
                                            settingsUI.addAutoCommentButtons();
                                        } catch (observerError) {
                                            ErrorLogger.log(observerError, 'initialize.listObserver');
                                        }
                                    });
                                    
                                    listObserver.observe(listContainer, {
                                        childList: true,
                                        subtree: true
                                    });
                                }
                                
                                settingsUI.addAutoCommentButtons();
                            } else {
                                setTimeout(waitForHeaderTitle, 100);
                            }
                        } catch (error) {
                            ErrorLogger.log(error, 'initialize.waitForHeaderTitle');
                            setTimeout(waitForHeaderTitle, 1000);
                        }
                    };

                    waitForHeaderTitle();
                } catch (error) {
                    ErrorLogger.logAndNotify(error, 'initialize.mypage', 'error');
                }
            }
        } catch (error) {
            ErrorLogger.logAndNotify(error, 'initialize', 'error');
            throw error;
        }
    }

    // video要素を使った初期化
    async function initializeWithVideo(videoElement) {
        try {
            if (!videoElement) {
                throw new Error('Video element is null or undefined');
            }
            
            NotificationManager.show('コメントローダーを初期化中...');

            const settingsManager = new SettingsManager();
            if (!settingsManager) {
                throw new Error('Failed to initialize SettingsManager');
            }
            
            const videoData = settingsManager.loadVideoData();

            if (!videoData || !videoData.videoId) {
                throw new Error('動画データが見つかりません。マイページで設定してください。');
            }

            const fetcher = new NicoApiFetcher();
            if (!fetcher) {
                throw new Error('Failed to initialize NicoApiFetcher');
            }
            
            try {
                await fetcher.fetchApiData(videoData.videoId);
                if (!fetcher.apiData) {
                    throw new Error('API data is null after fetch');
                }
            } catch (error) {
                throw new Error(`APIデータの取得に失敗しました: ${error.message}`);
            }

            let comments;
            try {
                comments = await fetcher.fetchComments();
                if (!Array.isArray(comments)) {
                    comments = [];
                }
            } catch (error) {
                throw new Error(`コメントの取得に失敗しました: ${error.message}`);
            }

            const settings = settingsManager.loadSettings();
            if (!settings) {
                settings = { ...DEFAULT_SETTINGS };
            }
            
            const renderer = new CommentRenderer(settings);
            if (!renderer) {
                throw new Error('Failed to initialize CommentRenderer');
            }
            
            try {
                renderer.initialize(videoElement);
            } catch (error) {
                throw new Error(`レンダラーの初期化に失敗しました: ${error.message}`);
            }

            try {
                settingsManager.addObserver((newSettings) => {
                    if (renderer && newSettings) {
                        renderer.settings = { ...DEFAULT_SETTINGS, ...newSettings };
                    }
                });
            } catch (error) {
                ErrorLogger.log(error, 'initializeWithVideo.addObserver');
            }

            if (comments && comments.length > 0) {
                try {
                    for (const comment of comments) {
                        if (comment && comment.text && typeof comment.vpos !== 'undefined') {
                            renderer.addComment(comment.text, comment.vpos, comment.commands || []);
                        }
                    }
                } catch (error) {
                    ErrorLogger.log(error, 'initializeWithVideo.addComments');
                }
            }

            const switchHandler = new VideoSwitchHandler(renderer, fetcher);
            if (!switchHandler) {
                throw new Error('Failed to initialize VideoSwitchHandler');
            }
            
            try {
                switchHandler.startMonitoring();
            } catch (error) {
                ErrorLogger.log(error, 'initializeWithVideo.startMonitoring');
            }

            const switchDebounce = new DebounceExecutor(1000);
            const lastSwitchTime = { value: 0 };

            const onSwitch = () => {
                const now = Date.now();
                if (now - lastSwitchTime.value < 3000) {
                    return;
                }
                
                lastSwitchTime.value = now;
                
                try {
                    return switchHandler.onVideoSwitch(videoElement);
                } catch (error) {
                    ErrorLogger.logAndNotify(error, 'initializeWithVideo.onSwitch', 'error');
                }
            };

            try {
                const videoObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                            setTimeout(() => {
                                try {
                                    switchDebounce.resetExecution(onSwitch);
                                    switchDebounce.execOnce(onSwitch);
                                } catch (error) {
                                    ErrorLogger.log(error, 'initializeWithVideo.videoObserver');
                                }
                            }, 1000);
                        }
                    }
                });

                videoObserver.observe(videoElement, {
                    attributes: true,
                    attributeFilter: ['src']
                });
            } catch (error) {
                console.error('Failed to setup video observer:', error);
                // オブザーバーの設定失敗は致命的ではないので続行
            }

            // ended イベントの設定
            try {
                const handleEnded = () => {
                    console.log('Video ended, triggering onVideoSwitch...');
                    // 動画終了時も遅延を設定して動画情報が完全に読み込まれるのを待つ
                    setTimeout(() => {
                        try {
                            // 実行前に必ず前回の実行状態をリセット
                            switchDebounce.resetExecution(onSwitch);
                            switchDebounce.execOnce(onSwitch);
                        } catch (error) {
                            console.error('Error in video ended handler:', error);
                        }
                    }, 1000); // 1000msの遅延を増加
                };
                videoElement.addEventListener('ended', handleEnded);
            } catch (error) {
                console.error('Failed to setup ended event listener:', error);
                // イベントリスナーの設定失敗は致命的ではないので続行
            }

            NotificationManager.show(`コメントの読み込みが完了しました（${comments.length}件）`, 'success');

            // グローバルオブジェクトのインスタンスを更新
            console.log('Updating global instances...');
            try {
                if (unsafeWindow && unsafeWindow.dAniRenderer) {
                    unsafeWindow.dAniRenderer.instances = {
                        renderer,
                        fetcher,
                        switchHandler,
                        settingsManager
                    };
                }
            } catch (error) {
                console.error('Failed to update global instances:', error);
                // グローバルオブジェクトの更新失敗は致命的ではないので続行
            }

            console.log('Initialization completed successfully');
            return { renderer, switchHandler };
        } catch (error) {
            console.error('Initialization failed:', error);
            NotificationManager.show(`初期化エラー: ${error.message}`, 'error');
            throw error;
        }
    }

    // スタイルの初期化
    StyleManager.initialize();

    // クラスをグローバルオブジェクトに追加
    unsafeWindow.dAniRenderer.classes = {
        Comment,
        CommentRenderer,
        NicoApiFetcher,
        NotificationManager,
        StyleManager,
        SettingsUI,
        NicoVideoSearcher,
        VideoSwitchHandler,
        SettingsManager,
        KeyboardShortcutHandler,
        DebounceExecutor
    };

    // ユーティリティ関数をグローバルオブジェクトに追加
    unsafeWindow.dAniRenderer.utils = {
        initialize,
        initializeWithVideo
    };

    // 初期化処理
    window.addEventListener('load', () => {
        (async () => {
            try {
                await initialize();
            } catch (error) {
                ErrorLogger.logAndNotify(error, 'window.load.initialize', 'error');
            }
        })();
    });
})(); 
