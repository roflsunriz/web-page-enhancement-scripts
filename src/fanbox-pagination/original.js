// ==UserScript==
// @name         Fanbox Pagination Helper
// @namespace    fanboxPaginationHelper
// @version      1.5
// @description  Fanboxのページネーションを上部に追加
// @author       roflsunriz
// @match        https://*.fanbox.cc/*
// @grant        GM_addStyle
// @updateURL    https://gist.githubusercontent.com/roflsunriz/f89fad6e9923bd678ac92025486d2f2a/raw/fanbox-pagination-helper.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/f89fad6e9923bd678ac92025486d2f2a/raw/fanbox-pagination-helper.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 最後に処理したURL
    let lastUrl = window.location.href;

    // ページネーション要素を探す関数
    function findPagination() {
        return document.querySelector('[class*="Pagination__DesktopWrapper-sc-"]');
    }

    // ページネーションを上部に追加する関数
    function addTopPagination() {
        // 既存の上部ページネーションを削除
        const existingTopPagination = document.querySelector('.top-pagination');
        if (existingTopPagination) {
            existingTopPagination.remove();
        }

        const pagination = findPagination();
        if (!pagination) return;

        // ページネーションを複製
        const clone = pagination.cloneNode(true);
        clone.classList.add('top-pagination');
        clone.classList.add('custom-pagination');  // スタイル用のクラスを追加

        // ページ上部に挿入
        const container = document.querySelector('[class*="CreatorPostList__Wrapper-sc-"]');
        if (container) {
            container.insertBefore(clone, container.firstChild);
        }
    }

    // URLの変更を監視して処理する関数
    function checkUrlChange() {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            console.log('[Fanbox Pagination Helper] URL変更を検知しました:', lastUrl);
            
            // URLが変わったあとにDOMが更新される少し遅延を入れて実行
            setTimeout(() => {
                addTopPagination();
            }, 500);
        }
    }

    // URLの変更を監視（SPAナビゲーション対応）
    function setupUrlChangeListener() {
        // pushStateとreplaceStateをオーバーライド
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkUrlChange();
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkUrlChange();
        };
        
        // ブラウザの戻る・進むボタン対応
        window.addEventListener('popstate', checkUrlChange);
        
        // 定期的なチェック（念のため）
        setInterval(checkUrlChange, 1000);
    }

    // DOMの変更を監視
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // ページネーション要素が追加されたかチェック
                if (findPagination() && !document.querySelector('.top-pagination')) {
                    addTopPagination();
                    break;
                }
            }
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    // URL変更の監視を設定
    setupUrlChangeListener();

    // 初期実行
    addTopPagination();
})();

GM_addStyle(`
    .custom-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 20px 0;
        padding: 10px 0;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .custom-pagination > div {
        display: flex;
        gap: 8px;
    }
`);