// ==UserScript==
// @name         Twitter Image Fullsize Redirect
// @namespace    FullsizeRedirect
// @version      1.3
// @description  Twitterの画像リンクを自動的にフルサイズ画像にリダイレクト
// @author       roflsuniz
// @match        https://pbs.twimg.com/media/*
// @match        https://ton.twimg.com/media/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @updateURL    https://gist.githubusercontent.com/roflsunriz/4289eb84f91e32297b073ac1a8e88b5c/raw/twitter_image_fullsize_redirect.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/4289eb84f91e32297b073ac1a8e88b5c/raw/twitter_image_fullsize_redirect.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // リダイレクト回数制限のためのセッションストレージチェック
    const redirectKey = 'twitter_image_redirect_count';
    const maxRedirects = 3;
    let redirectCount = parseInt(sessionStorage.getItem(redirectKey) || '0');
    
    // 最大リダイレクト回数に達した場合は処理を停止
    if (redirectCount >= maxRedirects) {
        console.log('Maximum redirect count reached, stopping redirect');
        sessionStorage.removeItem(redirectKey);
        return;
    }
    
    // 現在のURLを取得
    const currentUrl = window.location.href;
    
    // Twitter画像URLのパターンをチェック
    const twitterImagePattern = /^https:\/\/(pbs|ton)\.twimg\.com\/media\/([^?&]+)/;
    const match = currentUrl.match(twitterImagePattern);
    
    if (match) {
        const domain = match[1]; // pbs or ton
        const mediaId = match[2]; // 画像ID部分
        
        // フルサイズ画像URL判定（パラメータ形式をチェック）
        const isAlreadyFullsize = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get('name');
            
            // フルサイズを示すnameパラメータをチェック
            const fullsizeNames = ['orig', '4096x4096', 'large'];
            
            return name && fullsizeNames.includes(name);
        };
        
        if (isAlreadyFullsize()) {
            console.log('Already fullsize image URL:', currentUrl);
            sessionStorage.removeItem(redirectKey);
            return;
        }
        
        // リダイレクト回数をインクリメント
        sessionStorage.setItem(redirectKey, (redirectCount + 1).toString());
        
        // URLパラメータを解析
        const urlParams = new URLSearchParams(window.location.search);
        const currentFormat = urlParams.get('format');
        
        // 拡張子を推測
        let format = 'jpg'; // デフォルト
        
        if (currentFormat) {
            // 既存のformatパラメータを使用
            format = currentFormat;
        } else if (mediaId.includes('.')) {
            // URLから拡張子を抽出
            const parts = mediaId.split('.');
            let extension = parts[parts.length - 1];
            
            // :orig, :large などのサイズ指定を削除
            if (extension.includes(':')) {
                extension = extension.split(':')[0];
            }
            
            format = extension;
        }
        
        // 基本のメディアIDを取得（拡張子やサイズ指定を除去）
        let baseMediaId = mediaId;
        if (baseMediaId.includes('.')) {
            baseMediaId = baseMediaId.split('.')[0];
        }
        
        // フルサイズ画像URLを構築（パラメータ形式）
        const fullsizeUrl = `https://${domain}.twimg.com/media/${baseMediaId}?format=${format}&name=orig`;
        
        // 現在のURLと同じ場合はリダイレクトしない
        if (fullsizeUrl === currentUrl) {
            console.log('Target URL is same as current URL, no redirect needed');
            sessionStorage.removeItem(redirectKey);
            return;
        }
        
        console.log('Redirecting from:', currentUrl);
        console.log('Redirecting to:', fullsizeUrl);
        
        // リダイレクト実行
        window.location.replace(fullsizeUrl);
    } else {
        // Twitter画像URLでない場合はカウンターをリセット
        sessionStorage.removeItem(redirectKey);
    }
})(); 