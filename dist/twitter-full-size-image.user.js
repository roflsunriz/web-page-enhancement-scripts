// ==UserScript==
// @name         twitter-image-fullsize-redirect
// @namespace    twitterImageFullsizeRedirect
// @version      2.1.2
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

(function () {
	'use strict';

	const a=/^https:\/\/(pbs|ton)\.twimg\.com\/media\/([^?&]+)/,i=["orig","4096x4096","large"],r="twitter_image_redirect_count";const c=".twimg.com",m=e=>`https://${e}${c}`;function l(e){const t=e.match(a);return t?{domain:t[1],mediaId:t[2]}:null}function u(e){const n=new URLSearchParams(new URL(e).search).get("name");return n?i.includes(n):false}function d(e,t){const n=t.get("format");if(n)return n;if(e.includes(".")){const s=e.split(".");return s[s.length-1].split(":")[0]}return "jpg"}function g(e,t){const n=new URLSearchParams(new URL(e).search),s=d(t.mediaId,n),o=t.mediaId.split(".")[0];return `${m(t.domain)}/media/${o}?format=${s}&name=orig`}function I(e){const t=l(e);if(!t){sessionStorage.removeItem(r);return}const n=parseInt(sessionStorage.getItem(r)||"0");if(n>=3){sessionStorage.removeItem(r);return}if(u(e)){sessionStorage.removeItem(r);return}sessionStorage.setItem(r,(n+1).toString());const s=g(e,t);window.location.replace(s);}I(window.location.href);

})();