// ==UserScript==
// @name         twitter-image-fullsize-redirect
// @namespace    twitterImageFullsizeRedirect
// @version      2.1.3
// @author       roflsunriz
// @description  Twitterの画像リンクを自動的にフルサイズ画像にリダイレクト
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-full-size-image.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-full-size-image.meta.js
// @match        https://pbs.twimg.com/media/*
// @match        https://ton.twimg.com/media/*
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";var e=/^https:\/\/(pbs|ton)\.twimg\.com\/media\/([^?&]+)/,t=[`orig`],n=`twitter_image_redirect_count`,r=`https://www.nicovideo.jp`;`${r}`,`${r}`;var i=`https://twitter.com`,a=`https://t.co`,o=`.twimg.com`;`${i}`;var s=e=>`https://${e}${o}`;`${a}`;function c(t){let n=t.match(e);return n?{domain:n[1],mediaId:n[2]}:null}function l(e){let n=new URLSearchParams(new URL(e).search).get(`name`);return n?t.includes(n):!1}function u(e,t){let n=t.get(`format`);if(n)return n;if(e.includes(`.`)){let t=e.split(`.`);return t[t.length-1].split(`:`)[0]}return`jpg`}function d(e,t){let n=new URLSearchParams(new URL(e).search),r=u(t.mediaId,n),i=t.mediaId.split(`.`)[0];return`${s(t.domain)}/media/${i}?format=${r}&name=orig`}function f(e){let t=c(e);if(!t){sessionStorage.removeItem(n);return}let r=parseInt(sessionStorage.getItem(`twitter_image_redirect_count`)||`0`);if(r>=3){sessionStorage.removeItem(n);return}if(l(e)){sessionStorage.removeItem(n);return}sessionStorage.setItem(n,(r+1).toString());let i=d(e,t);window.location.replace(i)}f(window.location.href)})();
