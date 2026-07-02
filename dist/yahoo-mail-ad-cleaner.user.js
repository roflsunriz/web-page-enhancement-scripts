// ==UserScript==
// @name         yahoo-mail-ad-cleaner
// @namespace    yahooMailAdCleaner
// @version      1.0.0
// @author       roflsunriz
// @description  Yahoo!メール PC版に残る広告枠と空きカラムを非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.meta.js
// @match        https://mail.yahoo.co.jp/*
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const n="yahoo-mail-ad-cleaner",r=`${n}-styles`,i=["#tagYadsListTop","#tagYadsSideColumn","#tagYadsDetail"],s=`data-${n}-collapsed`,m=["#tagYadsListTop","#tagYadsSideColumn","#tagYadsDetail"];function d(){if(document.getElementById(r))return;const t=document.createElement("style");t.id=r,t.textContent=`
    ${i.join(`,
    `)} {
      display: none !important;
    }

    [data-${n}-collapsed="true"] {
      display: none !important;
    }
  `,document.documentElement.append(t);}function f(t){return t instanceof HTMLElement}function y(t){return Array.from(t.children).some(e=>{if(!f(e)||i.some(l=>e.matches(l)))return  false;const u=window.getComputedStyle(e),o=e.getBoundingClientRect();return u.display!=="none"&&o.width>0&&o.height>0})}function E(t){const e=t.parentElement;e&&(e.removeAttribute(s),!y(e)&&e.setAttribute(s,"true"));}function c(){for(const t of m){const e=document.querySelector(t);e&&E(e);}}function S(){if(!document.body)return;new MutationObserver(()=>{c();}).observe(document.body,{childList:true,subtree:true});}function a(){d(),c(),S();}d();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:true}):a();

})();