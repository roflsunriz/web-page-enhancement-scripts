// ==UserScript==
// @name         auto-page-reload
// @namespace    autoPageReload
// @version      1.2.0
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

(function(){"use strict";var e={ja:{menu:`自動リロードの間隔を設定`,prompt:`リロード間隔を秒で入力してください（1〜86400秒）。`,invalid:`1〜86400の整数を入力してください。`,countdown:e=>`次のリロードまで ${e}秒`},en:{menu:`Set automatic reload interval`,prompt:`Enter the reload interval in seconds (1–86400).`,invalid:`Enter a whole number from 1 to 86400.`,countdown:e=>`Next reload in ${e} s`}},t=navigator.language.toLowerCase().startsWith(`ja`)?e.ja:e.en,n=`intervalSeconds`,r=e=>typeof e==`number`&&Number.isInteger(e)&&e>=1&&e<=86400,i=GM_getValue(n,60),a=r(i)?i:60;r(i)||GM_setValue(n,a);var o=()=>{let{hostname:e,pathname:t,protocol:n}=window.location;return n===`https:`&&(e===`www.amazon.co.jp`&&t===`/progress-tracker/package`||e===`abliteration.ai`&&(t===`/console/billing`||t===`/console/activity`))?`${e}${t}`:null},s=o(),c=Date.now()+a*1e3,l=null,u=null,d=()=>{if(!s)l?.remove();else if(document.documentElement){if(!l||!u){l=document.createElement(`div`),l.setAttribute(`data-auto-page-reload-countdown`,``),l.style.cssText=`all:initial;position:fixed;right:12px;bottom:12px;z-index:2147483647;pointer-events:none;max-width:calc(100vw - 24px)`;let e=l.attachShadow({mode:`open`}),t=document.createElement(`style`);t.textContent=`:host{direction:ltr} span{display:block;box-sizing:border-box;max-width:100%;padding:6px 10px;border-radius:6px;background:#1f2937;color:#fff;font:13px/1.4 system-ui,sans-serif;overflow-wrap:anywhere;box-shadow:0 1px 5px #0006}`,u=document.createElement(`span`),u.setAttribute(`role`,`timer`),e.append(t,u)}l.isConnected||document.documentElement.append(l),u.textContent=t.countdown(Math.max(0,Math.ceil((c-Date.now())/1e3)))}};GM_registerMenuCommand(t.menu,()=>{let e=window.prompt(t.prompt,String(a));if(e===null)return;let i=/^\d+$/.test(e.trim())?Number(e.trim()):NaN;r(i)?(GM_setValue(n,i),a=i,c=Date.now()+a*1e3,d()):window.alert(t.invalid)});var f=()=>{let e=o();e!==s&&(s=e,c=Date.now()+a*1e3),d(),s&&Date.now()>=c&&window.location.reload()};f(),window.setInterval(f,1e3)})();
