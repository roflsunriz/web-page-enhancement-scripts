// ==UserScript==
// @name         imgur-image-link-copier
// @namespace    imgurImageLinkCopier
// @version      3.0.1
// @author       roflsunriz
// @description  Copy image link from Imgur with TypeScript.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.meta.js
// @match        https://imgur.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  const p={debug:"debug",info:"info",warn:"warn",error:"error"},a=t=>{const o=`[${t}]`,e={};return Object.keys(p).forEach(r=>{const n=p[r];e[r]=(...i)=>{(console[n]??console.log)(o,...i);};}),e};function b(){const t=document.querySelectorAll(".PostContent-imageWrapper"),o=[];return t.forEach(e=>{const r=e.querySelector("img"),n=e.querySelector("video source"),i=(r&&r instanceof HTMLImageElement?r.src:void 0)??(n&&n instanceof HTMLSourceElement?n.src:void 0);i&&o.push({url:i,wrapper:e});}),o}function c(){document.querySelectorAll('[id^="imgurCopyButton-container"]').forEach(t=>t.remove());}function u(t,o=true){const e=document.createElement("div");e.textContent=t,e.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${o?"#4CAF50":"#f44336"};
    color: white;
    padding: 16px;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
    opacity: 1;
  `,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",setTimeout(()=>e.remove(),500);},3e3);}function g(t,o,e){const r=document.createElement("div");r.id=`imgurCopyButton-container-${t}`;const n=r.attachShadow({mode:"closed"}),i=document.createElement("style");i.textContent=`
    .copy-button {
        position: absolute;
        top: 60px;
        right: 10px;
        z-index: 1000;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .copy-button:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-2px);
    }
  `;const s=document.createElement("button");s.className="copy-button",s.textContent=`メディア${t+1}をコピー`,s.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{u(`メディア${t+1}のリンクがコピーされました:
${o}`);}).catch(l=>{a("ImgurDirectLinkCopier").error("クリップボードへのコピーに失敗しました: ",l),u("クリップボードへのコピーに失敗しました",false);});}),n.append(i,s),e.style.position="relative",e.appendChild(r);}class m{lastUrl=location.href;observer=null;logger;debounceTimer=null;constructor(){this.logger=a("ImgurDirectLinkCopier");}start(){this.observer=new MutationObserver(()=>this.debouncedUpdate()),this.observer.observe(document.body,{childList:true,subtree:true}),this.update(),this.logger.info("Application started and observer is running.");}stop(){this.observer?.disconnect(),c(),this.logger.info("Application stopped and observer is disconnected.");}debouncedUpdate(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.update(),300);}update(){const o=b();if(o.length===0){c();return}c(),o.forEach((e,r)=>{g(r,e.url,e.wrapper);});}}function h(){const t=a("ImgurDirectLinkCopier");t.info("Userscript bootstrapping..."),new m().start(),t.info("Bootstrap complete.");}h();

})();