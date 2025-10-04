// ==UserScript==
// @name         Imgur Image Link Copier
// @namespace    imgurImageLinkCopier
// @version      2.0
// @description  Copy image link from Imgur
// @author       roflsunriz
// @match        https://imgur.com/*
// @match        https://imgur.com/a/*
// @grant        none
// @updateURL    https://gist.githubusercontent.com/roflsunriz/1fa7e451c8d505b68454f8e0fa52520a/raw/imgur_direct_link_copier.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/1fa7e451c8d505b68454f8e0fa52520a/raw/imgur_direct_link_copier.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// ==/UserScript==

(function() {
    'use strict';

    // URLが対象パターンにマッチするか確認する関数
    function isTargetPage() {
        const upload = document.getElementsByClassName("UploadPost")[0];
        return upload !== undefined;
    }

    // ボタンを削除する関数
    function removeButton() {
        const containers = document.querySelectorAll('[id^="imgurCopyButton-container"]');
        containers.forEach(container => container.remove());
    }

    // URLの変更を監視
    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (isTargetPage()) {
                    getMediaUrl();
                } else {
                    removeButton();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 16px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // シャドウDOM化されたボタンを作成する関数
    function createShadowButton(index, mediaUrl, wrapper) {
        // シャドウDOMコンテナの作成
        const container = document.createElement("div");
        container.id = `imgurCopyButton-container-${index}`;
        
        // シャドウルートの作成
        const shadowRoot = container.attachShadow({ mode: 'closed' });

        // スタイルの定義
        const style = document.createElement("style");
        style.textContent = `
            .copy-button {
                position: absolute;
                top: 60px;
                right: 10px;
                z-index: 1000;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.9);
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .copy-button:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: translateY(-2px);
            }
        `;

        // ボタンの作成
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = `メディア${index + 1}をコピー`;

        // ボタンがクリックされたときにクリップボードにコピー
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(mediaUrl).then(() => {
                showToast(`メディア${index + 1}のリンクがコピーされました:\n${mediaUrl}`);
            }).catch(err => {
                showToast('クリップボードへのコピーに失敗しました: ' + err, false);
            });
        });

        // シャドウDOMに要素を追加
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(copyButton);

        return container;
    }

    // メディアのURLを取得する関数
    function getMediaUrl() {
        // 対象ページでない場合は処理を中止
        if (!isTargetPage()) {
            removeButton();
            return;
        }

        // 既存のボタンを全て削除
        removeButton();

        // 全てのメディア要素を取得
        const mediaWrappers = document.querySelectorAll('.PostContent-imageWrapper');
        
        mediaWrappers.forEach((wrapper, index) => {
            const imgElement = wrapper.querySelector('img');
            const videoElement = wrapper.querySelector('video source');
            
            let mediaUrl = '';
            if (imgElement) {
                mediaUrl = imgElement.src;
            } else if (videoElement) {
                mediaUrl = videoElement.src;
            }

            if (mediaUrl) {
                // シャドウDOM化されたボタンを作成
                const buttonContainer = createShadowButton(index, mediaUrl, wrapper);

                // ボタンを画像/動画の親要素に追加
                wrapper.style.position = 'relative';
                wrapper.appendChild(buttonContainer);
            }
        });
    }

    // MutationObserverの更新
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const mediaElement = node.querySelector('.PostContent-imageWrapper img, .PostContent-imageWrapper video source');
                    if (mediaElement) {
                        getMediaUrl();
                    }
                }
            });
        });
    });

    // 監視対象のノードを設定
    observer.observe(document.body, { childList: true, subtree: true });

    // 監視の開始
    observeUrlChanges();

    // 初回実行
    if (isTargetPage()) {
        getMediaUrl();
    }
})();