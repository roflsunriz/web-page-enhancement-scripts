// ==UserScript==
// @name         auto-page-reload
// @namespace    autoPageReload
// @version      1.1.0
// @author       roflsunriz
// @description  Reload selected delivery tracking and console pages at a configurable interval.
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/auto-page-reload.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/auto-page-reload.meta.js
// @match        https://www.amazon.co.jp/*
// @match        https://abliteration.ai/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function(){"use strict";var e={ja:{menu:`自動リロードの間隔を設定`,prompt:`リロード間隔を秒で入力してください（1〜86400秒）。`,invalid:`1〜86400の整数を入力してください。`},en:{menu:`Set automatic reload interval`,prompt:`Enter the reload interval in seconds (1–86400).`,invalid:`Enter a whole number from 1 to 86400.`}},t=navigator.language.toLowerCase().startsWith(`ja`)?e.ja:e.en,n=`intervalSeconds`,r=e=>typeof e==`number`&&Number.isInteger(e)&&e>=1&&e<=86400,i=GM_getValue(n,60),a=r(i)?i:60;r(i)||GM_setValue(n,a);var o=()=>{let{hostname:e,pathname:t,protocol:n}=window.location;return n===`https:`&&(e===`www.amazon.co.jp`&&t===`/progress-tracker/package`||e===`abliteration.ai`&&(t===`/console/billing`||t===`/console/activity`))?`${e}${t}`:null},s=o(),c=Date.now()+a*1e3;GM_registerMenuCommand(t.menu,()=>{let e=window.prompt(t.prompt,String(a));if(e===null)return;let i=/^\d+$/.test(e.trim())?Number(e.trim()):NaN;r(i)?(GM_setValue(n,i),a=i,c=Date.now()+a*1e3):window.alert(t.invalid)}),window.setInterval(()=>{let e=o();e!==s&&(s=e,c=Date.now()+a*1e3),s&&Date.now()>=c&&window.location.reload()},1e3)})();
