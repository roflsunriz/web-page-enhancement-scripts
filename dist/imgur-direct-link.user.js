// ==UserScript==
// @name         Imgur Image Link Copier
// @namespace    imgurImageLinkCopier
// @version      3.0.0
// @author       roflsunriz
// @description  Copy image link from Imgur with TypeScript.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/1fa7e451c8d505b68454f8e0fa52520a/raw/imgur_direct_link_copier.user.js
// @updateURL    https://gist.githubusercontent.com/roflsunriz/1fa7e451c8d505b68454f8e0fa52520a/raw/imgur_direct_link_copier.user.js
// @match        https://imgur.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  const p={debug:"debug",info:"info",warn:"warn",error:"error"},a=e=>{const o=`[${e}]`,t={};return Object.keys(p).forEach(r=>{const n=p[r];t[r]=(...s)=>{(console[n]??console.log)(o,...s);};}),t};function g(){return document.querySelector(".UploadPost")!==null}function h(){const e=document.querySelectorAll(".PostContent-imageWrapper"),o=[];return e.forEach(t=>{const r=t.querySelector("img"),n=t.querySelector("video source"),s=(r&&r instanceof HTMLImageElement?r.src:void 0)??(n&&n instanceof HTMLSourceElement?n.src:void 0);s&&o.push({url:s,wrapper:t});}),o}function c(){document.querySelectorAll('[id^="imgurCopyButton-container"]').forEach(e=>e.remove());}function d(e,o=true){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
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
  `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),500);},3e3);}function b(e,o,t){const r=document.createElement("div");r.id=`imgurCopyButton-container-${e}`;const n=r.attachShadow({mode:"closed"}),s=document.createElement("style");s.textContent=`
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
  `;const i=document.createElement("button");i.className="copy-button",i.textContent=`メディア${e+1}をコピー`,i.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),navigator.clipboard.writeText(o).then(()=>{d(`メディア${e+1}のリンクがコピーされました:
${o}`);}).catch(u=>{a("ImgurDirectLinkCopier").error("クリップボードへのコピーに失敗しました: ",u),d("クリップボードへのコピーに失敗しました",false);});}),n.append(s,i),t.style.position="relative",t.appendChild(r);}class m{lastUrl=location.href;observer;logger;constructor(){this.logger=a("ImgurDirectLinkCopier"),this.observer=new MutationObserver(()=>this.handleUrlChange());}start(){this.observer.observe(document.body,{childList:true,subtree:true}),this.update(),this.logger.info("Application started and observer is running.");}stop(){this.observer.disconnect(),c(),this.logger.info("Application stopped and observer is disconnected.");}handleUrlChange(){location.href!==this.lastUrl&&(this.lastUrl=location.href,this.logger.info(`URL changed to: ${this.lastUrl}`),setTimeout(()=>this.update(),500));}update(){if(!g()){c();return}const o=h();o.length!==0&&(c(),o.forEach((t,r)=>{b(r,t.url,t.wrapper);}));}}function f(){const e=a("ImgurDirectLinkCopier");e.info("Userscript bootstrapping..."),new m().start(),e.info("Bootstrap complete.");}f();

})();