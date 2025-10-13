// ==UserScript==
// @name         fanbox-floating-menu
// @namespace    fanboxFloatingMenu
// @version      2.1.0
// @author       roflsunriz
// @description  Fanboxのページ移動用フローティングメニューを追加
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-floating-menu.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-floating-menu.meta.js
// @match        https://*.fanbox.cc/*
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const s={footerLinksWrapper:'[class*="FooterLinks__Wrapper-sc-"]',footerPrevLink:'div[class*="FooterLinks__PrevPostWrapper-sc-"]',footerNextLink:'div[class*="FooterLinks__NextPostWrapper-sc-"]',paginationWrapper:'[class*="Pagination__DesktopWrapper-sc-"]',creatorPostListWrapper:'[class*="CreatorPostList__Wrapper-sc-"]'},l="fanbox-floating-menu-container";class d{container=null;remove(){this.container?.remove(),this.container=null;}create(e){this.remove();const t=document.createElement("div");t.id=l,this.container=t;const o=t.attachShadow({mode:"closed"}),a=document.createElement("style");a.textContent=this.getStyle();const r=e.cloneNode(true);r.classList.add("floating-menu"),o.appendChild(a),o.appendChild(r),document.body.appendChild(t);}getStyle(){const{footerPrevLink:e,footerNextLink:t}=s;return `
      .floating-menu {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 0 5px 5px 0;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
      }
      .floating-menu a,
      .floating-menu ${e},
      .floating-menu ${t} {
          padding: 5px 10px;
          border-radius: 3px;
          text-decoration: none;
          color: #333;
          transition: background-color 0.2s;
      }
      .floating-menu a:hover,
      .floating-menu ${e}:hover,
      .floating-menu ${t}:hover {
          background-color: rgba(0,0,0,0.1);
      }
    `}}class u{lastUrl=location.href;callback;debounceTimer=null;constructor(e){this.callback=e;}start(){const e=history.pushState;history.pushState=(...o)=>{e.apply(history,o),this.handleUrlChange();};const t=history.replaceState;history.replaceState=(...o)=>{t.apply(history,o),this.handleUrlChange();},window.addEventListener("popstate",()=>this.handleUrlChange());}handleUrlChange(){this.lastUrl!==location.href&&(this.lastUrl=location.href,this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.callback(),500));}}function p(n,e=5e3){return new Promise((t,o)=>{const a=document.querySelector(n);if(a){t(a);return}const r=new MutationObserver(()=>{const i=document.querySelector(n);i&&(r.disconnect(),clearTimeout(c),t(i));}),c=setTimeout(()=>{r.disconnect(),o(new Error(`Element not found: ${n}`));},e);r.observe(document.body,{childList:true,subtree:true});})}async function h(){const n=new d,e=async()=>{try{const o=await p(s.footerLinksWrapper);n.create(o);}catch(o){n.remove(),console.error("[Fanbox Floating Menu] Could not display floating menu:",o.message);}};new u(e).start(),e();}h();

})();