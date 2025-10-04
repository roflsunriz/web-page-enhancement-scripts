// ==UserScript==
// @name         Hide retweets
// @name:ja      リツイート非表示
// @namespace    twitter_mute_retweets
// @version      1.0
// @description  Hide tweets not belonging to currently shown user
// @description:ja 閲覧中のユーザがつぶやいていないツイートを非表示にする
// @author       roflsunriz
// @license      MIT
// @match        https://x.com/*
// @exclude      https://x.com/*/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://gist.githubusercontent.com/roflsunriz/037ef3d4f08cfddb4a132d72e0d77480/raw/twitter_mute_retweets.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/037ef3d4f08cfddb4a132d72e0d77480/raw/twitter_mute_retweets.user.js
// ==/UserScript==
'use strict';

// デフォルト設定
const defaultSettings = {
    enabled: true, // デフォルトでリツイート非表示は有効
    checkInterval: 300 // 非表示処理の実行間隔（ミリ秒）
};

// 設定を取得
function getSettings() {
    const settings = GM_getValue('settings');
    return settings ? JSON.parse(settings) : defaultSettings;
}

// 設定を保存
function saveSettings(settings) {
    GM_setValue('settings', JSON.stringify(settings));
}

// 現在の設定
let currentSettings = getSettings();

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function findArticleAncestor(el) {
    el = el.parentNode;
    while (el && el.tagName !== "ARTICLE") {
        el = el.parentNode;
    }
    return el;
}

// リツイートを検出して非表示にする処理
function removeRetweets() {
    // 機能が無効なら何もしない
    if (!currentSettings.enabled) return;
    
    // リツイートを示す要素を持つツイートを探して非表示にする
    // r-15zivkpはリツイート表示の特定クラス
    [...document.getElementsByClassName("r-15zivkp")]
        .map(findArticleAncestor)
        .filter(el => el) // nullや未定義を除外
        .forEach(el => {
            if (el.parentElement && !el.dataset.hidden) {
                el.style.display = 'none';
                el.dataset.hidden = 'true'; // 処理済みマーク
            }
        });
}

// デバウンス処理されたリツイート非表示関数
let debouncedRemoveRetweets = debounce(removeRetweets, currentSettings.checkInterval);

// MutationObserverのコールバック
function mutationCallback(mutations) {
    if (!currentSettings.enabled) return;
    
    let hasRelevantChanges = false;
    
    // 変更の中で関連するものがあるか確認
    for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // 追加されたノードがあれば処理を実行
            hasRelevantChanges = true;
            break;
        }
    }
    
    // 関連する変更があれば非表示処理を実行
    if (hasRelevantChanges) {
        debouncedRemoveRetweets();
    }
}

// MutationObserverの設定
let observer = null;

// 監視を開始する関数
function startObserver() {
    if (observer) return; // すでに監視中なら何もしない
    
    // タイムラインのコンテナを取得 (必要に応じてセレクタを調整)
    const timelineContainer = document.querySelector('main[role="main"]');
    if (!timelineContainer) {
        // コンテナが見つからない場合は少し待ってから再試行
        setTimeout(startObserver, 1000);
        return;
    }
    
    // MutationObserverを設定
    observer = new MutationObserver(mutationCallback);
    
    // 監視オプション
    const config = {
        childList: true, // 子ノードの追加または削除を監視
        subtree: true    // ターゲットとその子孫の変更を監視
    };
    
    // 監視を開始
    observer.observe(timelineContainer, config);
    
    // 初回実行
    debouncedRemoveRetweets();
}

// 監視を停止する関数
function stopObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

// 設定変更に応じてObserverを制御
function updateObserverState() {
    if (currentSettings.enabled) {
        startObserver();
    } else {
        stopObserver();
    }
}

// 設定モーダルを作成
function createSettingsModal() {
    // すでにモーダルが存在すれば削除
    const existingModal = document.getElementById('retweet-settings-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
        return;
    }
    
    // シャドウDOMコンテナを作成
    const shadowHost = document.createElement('div');
    shadowHost.id = 'retweet-settings-modal';
    shadowHost.style.position = 'fixed';
    shadowHost.style.top = '0';
    shadowHost.style.left = '0';
    shadowHost.style.width = '100%';
    shadowHost.style.height = '100%';
    shadowHost.style.zIndex = '10000';
    shadowHost.style.pointerEvents = 'none'; // 背景クリック用
    
    // シャドウDOMを作成
    const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
    
    // スタイルを定義
    const style = document.createElement('style');
    style.textContent = `
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            pointer-events: none;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            pointer-events: all;
        }
        
        .modal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            width: 300px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            pointer-events: all;
        }
        
        .modal.dark {
            background-color: #15202b;
            color: #fff;
            border: 1px solid #38444d;
        }
        
        .modal h2 {
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: bold;
        }
        
        .setting-item {
            margin-bottom: 15px;
        }
        
        .setting-item label {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        
        .setting-item input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .interval-setting {
            margin-top: 15px;
            margin-bottom: 15px;
        }
        
        .interval-setting label {
            display: block;
            margin-bottom: 5px;
        }
        
        .interval-setting input[type="number"] {
            width: 80px;
            padding: 4px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .modal.dark .interval-setting input[type="number"] {
            background-color: #192734;
            border-color: #38444d;
            color: #fff;
        }
        
        .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        
        .button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .button-primary {
            background-color: #1d9bf0;
            color: white;
        }
        
        .button-primary:hover {
            background-color: #1a8cd8;
        }
        
        .button-secondary {
            background-color: transparent;
            border: 1px solid #ccc;
            color: #000;
        }
        
        .button-secondary:hover {
            background-color: #f7f7f7;
        }
        
        .modal.dark .button-secondary {
            border-color: #38444d;
            color: #fff;
        }
        
        .modal.dark .button-secondary:hover {
            background-color: #192734;
        }
    `;
    
    // 背景（クリックで閉じる用）
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    // モーダル要素を作成
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // ダークモード判定
    const isDarkMode = document.body.classList.contains('r-1q5jj3r') || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        modal.classList.add('dark');
    }
    
    // タイトル
    const title = document.createElement('h2');
    title.textContent = 'リツイート非表示の設定';
    
    // 設定オプション
    const settingDiv = document.createElement('div');
    settingDiv.className = 'setting-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'retweet-hide-enabled';
    checkbox.checked = currentSettings.enabled;
    
    const label = document.createElement('label');
    label.htmlFor = 'retweet-hide-enabled';
    label.textContent = 'リツイート非表示を有効にする';
    
    label.insertBefore(checkbox, label.firstChild);
    settingDiv.appendChild(label);
    
    // 更新間隔の設定
    const intervalDiv = document.createElement('div');
    intervalDiv.className = 'interval-setting';
    
    const intervalLabel = document.createElement('label');
    intervalLabel.htmlFor = 'retweet-check-interval';
    intervalLabel.textContent = '更新間隔 (ミリ秒):';
    
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.id = 'retweet-check-interval';
    intervalInput.min = '100';
    intervalInput.max = '1000';
    intervalInput.step = '100';
    intervalInput.value = currentSettings.checkInterval;
    
    intervalDiv.appendChild(intervalLabel);
    intervalDiv.appendChild(intervalInput);
    
    // ボタン領域
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-group';
    
    // キャンセルボタン
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'キャンセル';
    cancelButton.className = 'button button-secondary';
    
    // 保存ボタン
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.className = 'button button-primary';
    
    buttonDiv.appendChild(cancelButton);
    buttonDiv.appendChild(saveButton);
    
    // モーダルに要素を追加
    modal.appendChild(title);
    modal.appendChild(settingDiv);
    modal.appendChild(intervalDiv);
    modal.appendChild(buttonDiv);
    
    // シャドウDOMに要素を追加
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(backdrop);
    shadowRoot.appendChild(modal);
    
    // 保存ボタンのイベントリスナー
    saveButton.addEventListener('click', () => {
        const oldEnabled = currentSettings.enabled;
        currentSettings.enabled = checkbox.checked;
        currentSettings.checkInterval = parseInt(intervalInput.value, 10) || defaultSettings.checkInterval;
        
        // 設定を保存
        saveSettings(currentSettings);
        
        // 設定が変更されたらObserverの状態を更新
        if (oldEnabled !== currentSettings.enabled) {
            updateObserverState();
        }
        
        // デバウンス関数を更新した間隔で再作成
        debouncedRemoveRetweets = debounce(removeRetweets, currentSettings.checkInterval);
        
        document.body.removeChild(shadowHost);
    });
    
    // キャンセルボタンのイベントリスナー
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(shadowHost);
    });
    
    // 背景クリックで閉じる
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            document.body.removeChild(shadowHost);
        }
    });
    
    // モーダルを表示
    document.body.appendChild(shadowHost);
}

// スクロールイベントハンドラ
const handleScroll = debounce(() => {
    if (currentSettings.enabled) {
        removeRetweets();
    }
}, 200);

// Tampermonkeyメニューに設定オプションを追加
GM_registerMenuCommand('リツイート非表示の設定', createSettingsModal);

// URLが変わったときに再実行するための監視
let currentURL = location.href;
function checkURLChange() {
    if (currentURL !== location.href) {
        currentURL = location.href;
        
        // URLが変わったら一度処理を実行
        if (currentSettings.enabled) {
            // 少し待ってから実行（ページ読み込み待ち）
            setTimeout(debouncedRemoveRetweets, 500);
        }
    }
}

(function() {
    // 設定に基づいてObserverの状態を初期化
    updateObserverState();
    
    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // URL変更の監視を定期的に実行
    setInterval(checkURLChange, 1000);
    
    // 起動時に一度実行
    if (currentSettings.enabled) {
        // 少し待ってからリツイートを非表示（ページ読み込み待ち）
        setTimeout(debouncedRemoveRetweets, 1000);
    }
})();