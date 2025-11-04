// ==UserScript==
// @name         imgur-image-link-copier
// @namespace    imgurImageLinkCopier
// @version      3.2.0
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

  const f={debug:"debug",info:"info",warn:"warn",error:"error"},m=s=>{const o=`[${s}]`,t={};return Object.keys(f).forEach(e=>{const n=f[e];t[e]=(...r)=>{(console[n]??console.log)(o,...r);};}),t},b={mediaWrapper:".PostContent-imageWrapper"},g=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|gifv|mp4|webm|webp|avif)$/i;function v(){const s=document.querySelectorAll(b.mediaWrapper),o=[];return s.forEach(t=>{const e=t.querySelector("img"),n=t.querySelector("video source");let r=(e&&e instanceof HTMLImageElement?e.src:void 0)??(n&&n instanceof HTMLSourceElement?n.src:void 0);r&&g.test(r)&&(r.endsWith(".gifv")&&(r=r.replace(/\.gifv$/,".mp4")),o.push({url:r,wrapper:t}));}),o}function h(){document.querySelectorAll('[id^="imgurCopyButton-container"]').forEach(s=>s.remove());}const x=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|mp4|webm|webp|avif)$/i;function d(s,o=true){const t=document.createElement("div");t.textContent=s,t.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${o?"#4CAF50":"#f44336"};
    color: white;
    padding: 16px;
    white-space: pre-wrap;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
    opacity: 1;
  `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),500);},3e3);}function y(s,o,t){if(!x.test(o))return;(!t.style.position||t.style.position==="")&&(t.style.position="relative");const e=document.createElement("div");e.id=`imgurCopyButton-container-${s}`,e.dataset.imgurDirectLinkButtonContainer="true";const n=e.attachShadow({mode:"open"}),r=document.createElement("style");r.textContent=`
    :host {
      position: absolute;
      top: 60px;
      right: 15px;
      z-index: 2147483647;
      /* ホバーでのガクガクを防ぐ: 常時配置して opacity だけ切替 */
      opacity: 0.1;
      transition: opacity 120ms ease;
      pointer-events: none; /* コンテナはイベントを拾わない */
    }
    .btn {
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 6px;
      background: rgba(0,0,0,0.65);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      cursor: pointer;
      pointer-events: auto; /* ボタンのみクリック可能 */
      user-select: none;
      transition: transform 60ms ease-out, filter 60ms ease-out, box-shadow 60ms ease-out;
      position: relative;
      overflow: hidden;
    }
    .btn .particle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ffd700;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    .btn.explode .particle {
      animation: explode-particles 400ms ease-out;
    }
    @keyframes explode-particles {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      20% { transform: translate(-50%, -50%) scale(1); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    .btn.explode .particle:nth-child(1) { animation: explode-particles 400ms ease-out, p1 400ms ease-out; } @keyframes p1 { to { transform: translate(30px, -30px); } }
    .btn.explode .particle:nth-child(2) { animation: explode-particles 400ms ease-out, p2 400ms ease-out; } @keyframes p2 { to { transform: translate(-25px, 28px); } }
    .btn.explode .particle:nth-child(3) { animation: explode-particles 400ms ease-out, p3 400ms ease-out; } @keyframes p3 { to { transform: translate(28px, 25px); } }
    .btn.explode .particle:nth-child(4) { animation: explode-particles 400ms ease-out, p4 400ms ease-out; } @keyframes p4 { to { transform: translate(-22px, -22px); } }
    .btn.explode .particle:nth-child(5) { animation: explode-particles 400ms ease-out, p5 400ms ease-out; } @keyframes p5 { to { transform: translate(25px, 0px); } }
    .btn.explode .particle:nth-child(6) { animation: explode-particles 400ms ease-out, p6 400ms ease-out; } @keyframes p6 { to { transform: translate(-25px, 0px); } }
    .btn.explode .particle:nth-child(7) { animation: explode-particles 400ms ease-out, p7 400ms ease-out; } @keyframes p7 { to { transform: translate(0, 25px); } }
    .btn.explode .particle:nth-child(8) { animation: explode-particles 400ms ease-out, p8 400ms ease-out; } @keyframes p8 { to { transform: translate(0, -25px); } }
    .btn.explode .particle:nth-child(9) { animation: explode-particles 400ms ease-out, p9 400ms ease-out; } @keyframes p9 { to { transform: translate(20px, 15px); } }
    .btn.explode .particle:nth-child(10) { animation: explode-particles 400ms ease-out, p10 400ms ease-out; } @keyframes p10 { to { transform: translate(-15px, -20px); } }
    .btn:hover { filter: brightness(1.12); }
    .btn:active {
      transform: translateY(1px);
      filter: brightness(0.9);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
    }
    .btn[disabled] {
      opacity: .5;
      cursor: not-allowed;
    }
  `;const a=document.createElement("button");a.className="btn",a.textContent="コピー",a.title="ダイレクトリンクをコピー";for(let i=0;i<10;i++){const c=document.createElement("span");c.className="particle",a.appendChild(c);}const u=i=>{if(i.preventDefault(),i.stopPropagation(),!x.test(o)){d("直接リンクではありません（i.imgur.comのみ許可）",false),a.setAttribute("disabled","true");return}a.classList.add("explode"),a.addEventListener("animationend",()=>{a.classList.remove("explode");},{once:true}),navigator.clipboard.writeText(o).then(()=>d(`メディア${s+1}のリンクをコピー:
${o}`)).catch(c=>{m("ImgurDirectLinkCopier").error("クリップボードへのコピーに失敗: ",c),d("クリップボードへのコピーに失敗しました",false);});};a.addEventListener("pointerdown",u,{passive:false}),a.addEventListener("click",u),n.append(r,a),t.appendChild(e);let p=null;const l=i=>{i?(p&&(clearTimeout(p),p=null),e.style.opacity="1"):p=window.setTimeout(()=>{e.style.opacity="0.1";},120);};t.addEventListener("mouseenter",()=>l(true),{passive:true}),t.addEventListener("mouseleave",()=>l(false),{passive:true}),e.addEventListener("mouseenter",()=>l(true),{passive:true}),e.addEventListener("mouseleave",()=>l(false),{passive:true});}class E{lastUrl=location.href;observer=null;logger;debounceTimer=null;constructor(){this.logger=m("ImgurDirectLinkCopier");}start(){this.observer=new MutationObserver(()=>this.debouncedUpdate()),this.observer.observe(document.body,{childList:true,subtree:true}),this.update(),this.logger.info("Application started and observer is running.");}stop(){this.observer?.disconnect(),h(),this.logger.info("Application stopped and observer is disconnected.");}debouncedUpdate(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.update(),300);}update(){const o=v();if(o.length===0){h();return}const t=new Set(o.map((e,n)=>`imgurCopyButton-container-${n}`));document.querySelectorAll("[data-imgur-direct-link-button-container]").forEach(e=>{t.has(e.id)||e.remove();}),o.forEach((e,n)=>{e.wrapper.querySelector(`#imgurCopyButton-container-${n}`)||y(n,e.url,e.wrapper);});}}function w(){const s=m("ImgurDirectLinkCopier");s.info("Userscript bootstrapping..."),new E().start(),s.info("Bootstrap complete.");}w();

})();