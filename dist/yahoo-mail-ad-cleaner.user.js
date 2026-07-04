// ==UserScript==
// @name         yahoo-mail-ad-cleaner
// @namespace    yahooMailAdCleaner
// @version      1.0.1
// @author       roflsunriz
// @description  Yahoo!メール PC版に残る広告枠と空きカラムを非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.meta.js
// @match        https://mail.yahoo.co.jp/*
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";var e=`yahoo-mail-ad-cleaner`,t=`${e}-styles`,n=[`#tagYadsListTop`,`#tagYadsSideColumn`,`#tagYadsDetail`],r=`data-${e}-collapsed`,i=[`#tagYadsListTop`,`#tagYadsSideColumn`,`#tagYadsDetail`];function a(){if(document.getElementById(t))return;let r=document.createElement(`style`);r.id=t,r.textContent=`
    ${n.join(`,
    `)} {
      display: none !important;
    }

    [data-${e}-collapsed="true"] {
      display: none !important;
    }
  `,document.documentElement.append(r)}function o(e){return e instanceof HTMLElement}function s(e){return Array.from(e.children).some(e=>{if(!o(e)||n.some(t=>e.matches(t)))return!1;let t=window.getComputedStyle(e),r=e.getBoundingClientRect();return t.display!==`none`&&r.width>0&&r.height>0})}function c(e){let t=e.parentElement;t&&(t.removeAttribute(r),!s(t)&&t.setAttribute(r,`true`))}function l(){for(let e of i){let t=document.querySelector(e);t&&c(t)}}function u(){document.body&&new MutationObserver(()=>{l()}).observe(document.body,{childList:!0,subtree:!0})}function d(){a(),l(),u()}a(),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,d,{once:!0}):d()})();
