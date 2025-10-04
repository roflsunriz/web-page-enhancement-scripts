// ==UserScript==
// @name         fanbox-pagination-helper
// @namespace    fanboxPaginationHelper
// @version      2.0.1
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

(function () {
  'use strict';

  const i=`
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
`;var s=typeof GM_addStyle<"u"?GM_addStyle:void 0;function o(a){s(a);}const l='[class*="Pagination__DesktopWrapper-sc-"]',c='[class*="CreatorPostList__Wrapper-sc-"]',r="fanbox-pagination-helper-top-pagination";class d{constructor(){o(i);}create(){this.remove();const t=document.querySelector(l);if(!t)return;const n=document.querySelector(c);if(!n)return;const e=t.cloneNode(true);e.id=r,e.classList.add("custom-pagination"),n.insertBefore(e,n.firstChild);}remove(){document.getElementById(r)?.remove();}}class h{lastUrl;callback;originalPushState;originalReplaceState;constructor(t){this.lastUrl=location.href,this.callback=t,this.originalPushState=history.pushState,this.originalReplaceState=history.replaceState;}handleUrlChange=()=>{requestAnimationFrame(()=>{this.lastUrl!==location.href&&(this.lastUrl=location.href,this.callback());});};start(){history.pushState=(...t)=>{this.originalPushState.apply(history,t),this.handleUrlChange();},history.replaceState=(...t)=>{this.originalReplaceState.apply(history,t),this.handleUrlChange();},window.addEventListener("popstate",this.handleUrlChange);}}const p='[class*="Pagination__DesktopWrapper-sc-"]';function u(){const a=new d,t=()=>{setTimeout(()=>{a.create();},500);};new h(t).start();const e=document.querySelector(p);e&&new MutationObserver(t).observe(e,{childList:true,subtree:true}),t();}u();

})();