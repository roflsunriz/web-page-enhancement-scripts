// ==UserScript==
// @name         Fanbox Floating Menu
// @namespace    fanboxFloatingMenu
// @version      1.6
// @description  Fanboxのページ移動用フローティングメニューを追加
// @author       roflsunriz
// @match        https://*.fanbox.cc/*
// @grant        none
// @updateURL    https://gist.githubusercontent.com/roflsunriz/31e3b65acd467e4d852423dc178d3c9b/raw/fanbox_floating_menu.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/31e3b65acd467e4d852423dc178d3c9b/raw/fanbox_floating_menu.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc
// ==/UserScript==

(function() {
    'use strict';

    // 現在のURLを保存
    let currentUrl = location.href;

    // フローティングメニューを作成する関数（シャドウDOM版）
    function createFloatingMenu(originalMenu) {
        // シャドウDOMコンテナの作成
        const container = document.createElement("div");
        container.id = "fanbox-floating-menu-container";
        
        // シャドウルートの作成
        const shadowRoot = container.attachShadow({ mode: 'closed' });

        // スタイルの定義
        const style = document.createElement("style");
        style.textContent = `
            .floating-menu {
                position: fixed;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                background-color: rgba(255, 255, 255, 0.9);
                padding: 10px;
                border-radius: 0 5px 5px 0;
                box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .floating-menu a,
            .floating-menu div[class*="FooterLinks__PrevPostWrapper-sc-"],
            .floating-menu div[class*="FooterLinks__NextPostWrapper-sc-"] {
                padding: 5px 10px;
                border-radius: 3px;
                text-decoration: none;
                color: #333;
                transition: background-color 0.2s;
            }
            
            .floating-menu a:hover,
            .floating-menu div[class*="FooterLinks__PrevPostWrapper-sc-"]:hover,
            .floating-menu div[class*="FooterLinks__NextPostWrapper-sc-"]:hover {
                background-color: rgba(0,0,0,0.1);
            }
        `;

        // メニューのクローンを作成
        const menu = originalMenu.cloneNode(true);
        menu.classList.add('floating-menu');

        // シャドウDOMに要素を追加
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(menu);

        return container;
    }

    function waitForMenu(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = 100;

            const checkMenu = () => {
                const menu = document.querySelector(selector);
                if (menu) {
                    resolve(menu);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error('メニューが見つかりません'));
                } else {
                    setTimeout(checkMenu, checkInterval);
                }
            };

            checkMenu();
        });
    }

    // メニューを初期化または更新する関数
    async function initOrUpdateMenu() {
        try {
            // メニューが表示されるまで最大5秒待つ
            const originalMenu = await waitForMenu('[class*="FooterLinks__Wrapper-sc-"]');

            // 既存のメニューを削除
            const oldMenu = document.querySelector('#fanbox-floating-menu-container');
            if (oldMenu) oldMenu.remove();

            // 新しいメニューを作成
            const menu = createFloatingMenu(originalMenu);
            document.body.appendChild(menu);
        } catch (error) {
            console.error('フローティングメニューを表示できませんでした:', error);
        }
    }

    // History APIをオーバーライドして、URL変更を検知する
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };

    // URL変更時の処理
    function handleUrlChange() {
        if (currentUrl !== location.href) {
            currentUrl = location.href;
            // URLが変わったらメニューを更新
            setTimeout(initOrUpdateMenu, 500); // 少し遅延させてDOMの更新を待つ
        }
    }

    // popstateイベント（ブラウザの戻る・進むボタン）のリスナー
    window.addEventListener('popstate', function() {
        handleUrlChange();
    });

    // 最初のロード時
    window.addEventListener('load', initOrUpdateMenu);
})(); 