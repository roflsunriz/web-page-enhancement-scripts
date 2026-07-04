// ==UserScript==
// @name         fanbox-pagination-helper
// @namespace    fanboxPaginationHelper
// @version      2.1.1
// @author       roflsunriz
// @description  Fanboxのページネーションを上部に追加
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-pagination-helper.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-pagination-helper.meta.js
// @match        https://*.fanbox.cc/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function(){"use strict";var e=typeof GM_addStyle<`u`?GM_addStyle:void 0;function t(t){e(t)}var n={footerLinksWrapper:`[class*="FooterLinks__Wrapper-sc-"]`,footerPrevLink:`div[class*="FooterLinks__PrevPostWrapper-sc-"]`,footerNextLink:`div[class*="FooterLinks__NextPostWrapper-sc-"]`,paginationWrapper:`[class*="Pagination__DesktopWrapper-sc-"]`,creatorPostListWrapper:`[class*="CreatorPostList__Wrapper-sc-"]`},r=`fanbox-pagination-helper-top-pagination`,i=class{constructor(){t(`
  .custom-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 20px 0;
      padding: 10px 0;
      background-color: #f5f5f5;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .custom-pagination > div {
      display: flex;
      gap: 8px;
  }
`)}create(){this.remove();let e=document.querySelector(n.paginationWrapper);if(!e)return;let t=document.querySelector(n.creatorPostListWrapper);if(!t)return;let i=e.cloneNode(!0);i.id=r,i.classList.add(`custom-pagination`),t.insertBefore(i,t.firstChild)}remove(){document.getElementById(r)?.remove()}},a=class{lastUrl;callback;originalPushState;originalReplaceState;constructor(e){this.lastUrl=location.href,this.callback=e,this.originalPushState=history.pushState,this.originalReplaceState=history.replaceState}handleUrlChange=()=>{requestAnimationFrame(()=>{this.lastUrl!==location.href&&(this.lastUrl=location.href,this.callback())})};start(){history.pushState=(...e)=>{this.originalPushState.apply(history,e),this.handleUrlChange()},history.replaceState=(...e)=>{this.originalReplaceState.apply(history,e),this.handleUrlChange()},window.addEventListener(`popstate`,this.handleUrlChange)}};function o(){let e=new i,t=()=>{setTimeout(()=>{e.create()},500)};new a(t).start();let r=document.querySelector(n.paginationWrapper);r&&new MutationObserver(t).observe(r,{childList:!0,subtree:!0}),t()}o()})();
