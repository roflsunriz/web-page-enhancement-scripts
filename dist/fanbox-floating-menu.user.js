// ==UserScript==
// @name         Fanbox Floating Menu
// @namespace    fanboxFloatingMenu
// @version      2.0.0
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

    const l="fanbox-floating-menu-container";class c{container=null;remove(){this.container?.remove(),this.container=null;}create(t){this.remove();const n=document.createElement("div");n.id=l,this.container=n;const e=n.attachShadow({mode:"closed"}),a=document.createElement("style");a.textContent=this.getStyle();const r=t.cloneNode(true);r.classList.add("floating-menu"),e.appendChild(a),e.appendChild(r),document.body.appendChild(n);}getStyle(){return `
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
      .floating-menu div[class*="FooterLinks__PrevPostWrapper-sc-"],
      .floating-menu div[class*="FooterLinks__NextPostWrapper-sc-"] {
          padding: 5px 10px;
          border-radius: 3px;
          text-decoration: none;
          color: #333;
          transition: background-color 0.2s;
      }
      .floating-menu a:hover,
      .floating-menu div[class*="FooterLinks__PrevPostWrapper-sc-"]:hover,
      .floating-menu div[class*="FooterLinks__NextPostWrapper-sc-"]:hover {
          background-color: rgba(0,0,0,0.1);
      }
    `}}class d{lastUrl=location.href;callback;debounceTimer=null;constructor(t){this.callback=t;}start(){const t=history.pushState;history.pushState=(...e)=>{t.apply(history,e),this.handleUrlChange();};const n=history.replaceState;history.replaceState=(...e)=>{n.apply(history,e),this.handleUrlChange();},window.addEventListener("popstate",()=>this.handleUrlChange());}handleUrlChange(){this.lastUrl!==location.href&&(this.lastUrl=location.href,this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.callback(),500));}}function u(o,t=5e3){return new Promise((n,e)=>{const a=document.querySelector(o);if(a){n(a);return}const r=new MutationObserver(()=>{const s=document.querySelector(o);s&&(r.disconnect(),clearTimeout(i),n(s));}),i=setTimeout(()=>{r.disconnect(),e(new Error(`Element not found: ${o}`));},t);r.observe(document.body,{childList:true,subtree:true});})}const h='[class*="FooterLinks__Wrapper-sc-"]';async function p(){const o=new c,t=async()=>{try{const e=await u(h);o.create(e);}catch(e){o.remove(),console.error("[Fanbox Floating Menu] Could not display floating menu:",e.message);}};new d(t).start(),t();}p();

})();