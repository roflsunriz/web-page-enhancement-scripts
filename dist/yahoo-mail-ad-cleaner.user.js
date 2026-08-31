// ==UserScript==
// @name         yahoo-mail-ad-cleaner
// @namespace    yahooMailAdCleaner
// @version      1.2.0
// @author       roflsunriz
// @description  Yahoo!メール PC版に残る広告枠、全画面プロモーション、連携案内、機能案内を非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.meta.js
// @match        https://mail.yahoo.co.jp/*
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";var e=[`#tagYadsListTop`,`#tagYadsSideColumn`,`#tagYadsDetail`,`#tagYadsInterstitial`],t=[`#ly-linkage-promotion-modal`],n=`div:has(
  > div:only-child
    > div:first-child:not(:last-child)
    + button:last-child[buttontype="bgless"][buttonsize="medium"][buttonopacity="[object Object]"][marginleft="auto"][marginright="0"]
)`,r=[...e,...t,n],i=`yahoo-mail-ad-cleaner`,a=`${i}-styles`,o=`data-${i}-collapsed`,s=[`#tagYadsListTop`,`#tagYadsSideColumn`,`#tagYadsDetail`];function c(){if(document.getElementById(a))return;let e=document.createElement(`style`);e.id=a,e.textContent=`
    ${r.join(`,
    `)} {
      display: none !important;
    }

    [data-${i}-collapsed="true"] {
      display: none !important;
    }
  `,document.documentElement.append(e)}function l(e){return e instanceof HTMLElement}function u(t){return Array.from(t.children).some(t=>{if(!l(t)||e.some(e=>t.matches(e)))return!1;let n=window.getComputedStyle(t),r=t.getBoundingClientRect();return n.display!==`none`&&r.width>0&&r.height>0})}function d(e){let t=e.parentElement;t&&(t.removeAttribute(o),!u(t)&&t.setAttribute(o,`true`))}function f(){for(let e of s){let t=document.querySelector(e);t&&d(t)}}function p(){document.body&&new MutationObserver(()=>{f()}).observe(document.body,{childList:!0,subtree:!0})}function m(){c(),f(),p()}c(),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,m,{once:!0}):m()})();
