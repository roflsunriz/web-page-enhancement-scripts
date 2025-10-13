// ==UserScript==
// @name         twitter-image-fullsize-redirect
// @namespace    twitterImageFullsizeRedirect
// @version      2.1.1
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

	const i=/^https:\/\/(pbs|ton)\.twimg\.com\/media\/([^?&]+)/,a=["orig","4096x4096","large"],s="twitter_image_redirect_count";const c=".twimg.com",m=e=>`https://${e}${c}`;function l(e){const t=e.match(i);return t?{domain:t[1],mediaId:t[2]}:null}function d(e){const o=new URLSearchParams(new URL(e).search).get("name");return o?a.includes(o):false}function g(e,t){const o=t.get("format");if(o)return o;if(e.includes(".")){const n=e.split(".");return n[n.length-1].split(":")[0]}return "jpg"}function u(e,t){const o=new URLSearchParams(new URL(e).search),n=g(t.mediaId,o),r=t.mediaId.split(".")[0];return `${m(t.domain)}/media/${r}?format=${n}&name=orig`}function I(e){const t=l(e);if(!t){sessionStorage.removeItem(s);return}const o=parseInt(sessionStorage.getItem(s)||"0");if(o>=3){console.log("Maximum redirect count reached, stopping redirect."),sessionStorage.removeItem(s);return}if(d(e)){console.log("Already fullsize image URL:",e),sessionStorage.removeItem(s);return}sessionStorage.setItem(s,(o+1).toString());const n=u(e,t);console.log("Redirecting from:",e),console.log("Redirecting to:",n),window.location.replace(n);}I(window.location.href);

})();