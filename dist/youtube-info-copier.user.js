// ==UserScript==
// @name         youtube-info-copier
// @namespace    youtubeInfoCopier
// @version      2.4.0
// @author       roflsunriz
// @description  YouTube動画の情報をワンクリックでクリップボードにコピー（従来/FAB/メニュー切替対応）
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.meta.js
// @match        https://www.youtube.com/*
// @match        https://youtu.be/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const C={debug:"debug",info:"info",warn:"warn",error:"error"},F=n=>{const e=`[${n}]`,t={};return Object.keys(C).forEach(i=>{const a=C[i];t[i]=(...o)=>{(console[a]??console.log)(e,...o);};}),t},T=new WeakMap;function B(n){const{trustedTypes:e}=n;return !e||typeof e.createPolicy!="function"?null:e}function V(n,e){let t=T.get(n);t||(t=new Map,T.set(n,t));const i=t.get(e);if(i)return i;const a=n.createPolicy(e,{createHTML:o=>o});return a?(t.set(e,a),a):null}function z(n,e,t=window){const i=B(t);if(!i)return n;const a=V(i,e);return a?a.createHTML(n):n}function A(n,e,t){const a=(n.ownerDocument??document).defaultView??window,o=z(e,t,a);if(typeof o=="string"){n.innerHTML=o;return}n.innerHTML=o;}const u={descriptionCandidates:["#description","ytd-expander#description","#meta-contents #description","#meta-contents"],inlineExpander:"ytd-text-inline-expander",inlineExpanderById:"ytd-text-inline-expander#description-inline-expander",interactiveElements:"tp-yt-paper-button, button, a",titleCandidates:["h1.ytd-watch-metadata yt-formatted-string","#title h1 yt-formatted-string","h1.title"],channelCandidates:["#owner #channel-name a","ytd-channel-name a",".ytd-video-owner-renderer a","#upload-info #channel-name a","#owner-text a"],descriptionRoot:"#description-inline-expander",descriptionExpandedContent:["#description-inline-expander #expanded yt-attributed-string","#description-inline-expander #expanded yt-formatted-string","#description-inline-expander #snippet yt-attributed-string"]},h=F("youtube-info-copier:dom-utils");async function M(n=4e3){const e=u.descriptionCandidates.map(o=>document.querySelector(o)).find(Boolean);if(!e)return;const t=()=>{const o=e.querySelector(u.inlineExpander)||document.querySelector(u.inlineExpanderById);if(o?.hasAttribute("is-expanded"))return h.debug("Already has is-expanded attribute"),true;const s=document.querySelector("tp-yt-paper-button#expand");if(s&&s.textContent?.includes("もっと見る"))try{return h.debug("Clicking tp-yt-paper-button#expand directly"),s.click(),h.info("概要欄の「もっと見る」ボタンをクリックしました。"),!0}catch(r){h.warn("Direct click failed:",r);}const c=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,l=[];o&&l.push(...Array.from(o.querySelectorAll(u.interactiveElements))),l.push(...Array.from(document.querySelectorAll(u.interactiveElements)));for(const r of l)try{const d=(r.textContent||"").trim();if((r.getAttribute("aria-expanded")==="false"||c.test(d)||r.id&&/expand|more|collapse/i.test(r.id))&&typeof r.click=="function")return h.debug(`Clicking element: ${r.tagName}#${r.id} "${d}"`),r.click(),h.info("概要欄の「もっと見る」ボタンをクリックしました（フォールバック）。"),!0}catch{}return h.warn("No expand button found"),false},i=()=>{const o=e.querySelector(u.inlineExpander)||document.querySelector(u.inlineExpanderById),s=(o||e).querySelector("#expanded");if(s){const c=(s.textContent||s.innerText||"").trim();if(c&&c.length>200)return h.debug(`Description is expanded (found ${c.length} chars in #expanded)`),true}if(o?.hasAttribute("is-expanded")&&s){const c=(s.textContent||s.innerText||"").trim();return c&&c.length>200?true:(h.debug("is-expanded attr found but content not yet loaded"),false)}return  false};if(!(i()||!t()))return new Promise(o=>{const s=Date.now();let c=0,l=null,r=null;const d=()=>{l&&(l.disconnect(),l=null),r&&(clearInterval(r),r=null);},p=D=>{c++;const S=e.querySelector("#expanded"),k=S?(S.textContent||"").trim().length:0,L=i(),m=Date.now()-s;return h.debug(`Check ${c} (${D}): expanded=${L}, #expanded length=${k}, elapsed=${m}ms`),L?(d(),h.info(`Description expanded successfully (#expanded: ${k} chars) after ${m}ms`),setTimeout(()=>o(),200),true):m>n?(d(),h.warn(`Description expansion timed out after ${m}ms (${c} checks)`),o(),true):false},f=e.querySelector("#expanded");f&&(l=new MutationObserver(()=>{p("mutation");}),l.observe(f,{childList:true,subtree:true,characterData:true}),h.debug("MutationObserver started on #expanded")),r=window.setInterval(()=>{p("poll");},200),p("initial");})}var I="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",_="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",Y="M7,2V13H10V22L17,10H13L17,2H7Z",O="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z";function x(n,e=24){const t=String(e),i=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${i}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${n}"></path></svg>`}const U=x(O),y=x(_),H=x(Y),G=x(I),N="youtube-info-copier-template";function j(){return `
    <style>
        .glass-control-container {
            position: relative;
            pointer-events: none;
        }

        .control-handle {
            width: 6px;
            height: 60px;
            background: rgba(255, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            position: relative;
            z-index: 10;
            box-shadow: 2px 0 8px rgba(255, 0, 0, 0.4);
        }

        .control-handle:hover {
            width: 12px;
            background: rgba(255, 0, 0, 1.0);
            box-shadow: 2px 0 12px rgba(255, 0, 0, 0.6);
        }

        .control-handle:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
        }

        /* 準備中状態 */
        .control-handle.preparing {
            background: rgba(255, 152, 0, 0.8);
            box-shadow: 2px 0 8px rgba(255, 152, 0, 0.4);
            animation: pulse 1s ease-in-out infinite;
        }

        /* 準備完了状態 - ハートバウンシング */
        .control-handle.ready {
            background: rgba(76, 175, 80, 0.9);
            box-shadow: 2px 0 12px rgba(76, 175, 80, 0.6);
            animation: heartBounce 0.8s ease-in-out infinite;
        }

        .control-handle.error {
            background: rgba(244, 67, 54, 0.8);
            box-shadow: 2px 0 8px rgba(244, 67, 54, 0.4);
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        @keyframes heartBounce {
            0%, 100% {
                transform: scale(1);
            }
            10% {
                transform: scale(1.1);
            }
            20% {
                transform: scale(1);
            }
            30% {
                transform: scale(1.15);
            }
            40% {
                transform: scale(1);
            }
        }

        .control-panel {
            position: absolute;
            bottom: 0;
            left: 0;
            min-width: 280px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 0;
            overflow: hidden;
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 9;
            margin-left: 12px;
        }

        .control-panel.expanded {
            opacity: 1;
            transform: translateX(0) scale(1);
            pointer-events: auto;
        }

        .panel-header {
            background: rgba(255, 0, 0, 0.1);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-icon {
            display: inline-flex;
            width: 20px;
            height: 20px;
            color: rgba(255, 255, 255, 0.9);
        }

        .panel-icon svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        .panel-title {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
        }

        .panel-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .panel-button {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: left;
        }

        .panel-button:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .panel-button:active {
            transform: translateY(0);
        }

        .panel-button.primary {
            background: rgba(255, 0, 0, 0.2);
            border-color: rgba(255, 0, 0, 0.3);
            color: rgba(255, 255, 255, 0.95);
        }

        .panel-button.primary:hover {
            background: rgba(255, 0, 0, 0.3);
            border-color: rgba(255, 0, 0, 0.4);
        }

        .panel-button .panel-icon {
            width: 16px;
            height: 16px;
            color: currentColor;
        }

        .popup {
            position: absolute;
            bottom: 100%;
            left: 0;
            min-width: 200px;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            padding: 16px;
            margin-bottom: 8px;
            max-height: 300px;
            overflow-y: auto;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 15;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            pointer-events: none;
            margin-left: 12px;
        }
        
        .popup.show {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        
        .popup-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff0000;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            padding-bottom: 8px;
        }
        
        .popup-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            background: rgba(245, 245, 245, 0.8);
            padding: 8px;
            border-radius: 8px;
            border-left: 3px solid #ff0000;
        }
        
        .popup-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .popup-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .popup-close svg {
            width: 18px;
            height: 18px;
            display: block;
        }

        @media (max-width: 768px) {
            .control-handle { height: 50px; }
            .control-panel { min-width: 240px; }
            .panel-header { padding: 12px 16px; }
            .panel-content { padding: 8px; }
            .panel-button { padding: 10px 12px; font-size: 12px; }
            .popup { max-width: 280px; }
        }

        @media (prefers-contrast: high) {
            .control-handle { background: rgba(255, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
            .control-panel { background: rgba(0, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
        }
    </style>
    
    <div class="glass-control-container">
        <div class="control-handle" aria-label="YouTube動画情報コピー" title="YouTube動画情報" tabindex="0"></div>
        <div class="control-panel">
            <div class="panel-header">
                <span class="panel-icon">${U}</span>
                <span class="panel-title">YouTube Info</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${y}</span>
                    動画情報をコピー
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${H}</span>
                    タイトル+URLのみ
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="閉じる">${G}</button>
            <div class="popup-title">コピーした概要</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}const X="https://youtu.be",Z=n=>`${X}/${n}`;class Q{container=null;shadowRoot=null;isExpanded=false;expandTimer=null;config;fabSize;constructor(e){this.config=e,this.fabSize=e.size??56;}init(){this.container=document.createElement("div"),this.container.id="fab-container",this.container.style.cssText=this.buildPositionStyle(),this.shadowRoot=this.container.attachShadow({mode:"closed"});const e=document.createElement("style");e.textContent=this.getStyles(),this.shadowRoot.appendChild(e);const t=document.createElement("div");t.className="fab-wrapper",t.innerHTML=this.buildHTML(),this.shadowRoot.appendChild(t),this.setupEventListeners(t),this.setupFullscreenListener(),document.body.appendChild(this.container);}destroy(){this.expandTimer&&clearTimeout(this.expandTimer),document.removeEventListener("fullscreenchange",this.handleFullscreenChange),document.removeEventListener("webkitfullscreenchange",this.handleFullscreenChange),this.container?.remove(),this.container=null,this.shadowRoot=null;}setVisible(e){this.container&&(this.container.style.display=e?"block":"none");}setColor(e){const t=this.shadowRoot?.querySelector(".fab-main");t&&(t.style.background=e);}resetColor(){const e=this.shadowRoot?.querySelector(".fab-main");e&&(e.style.background="");}addMainClass(e){this.shadowRoot?.querySelector(".fab-main")?.classList.add(e);}removeMainClass(e){this.shadowRoot?.querySelector(".fab-main")?.classList.remove(e);}buildPositionStyle(){const{position:e}=this.config,t=["position: fixed !important","z-index: 9999 !important","pointer-events: none !important"];return e.top&&t.push(`top: ${e.top} !important`),e.bottom&&t.push(`bottom: ${e.bottom} !important`),e.left&&t.push(`left: ${e.left} !important`),e.right&&t.push(`right: ${e.right} !important`),t.join("; ")+";"}buildHTML(){const e=this.config.actions&&this.config.actions.length>0;let t="";return e&&this.config.actions&&(t=`<div class="fab-speed-dial">${this.config.actions.map((a,o)=>`
        <div class="fab-speed-dial-item" data-action-index="${String(o)}">
          <span class="fab-speed-dial-label">${this.escapeHTML(a.label)}</span>
          <button class="fab-mini" aria-label="${this.escapeHTML(a.label)}" data-action-index="${String(o)}">
            <span class="fab-icon">${a.icon}</span>
          </button>
        </div>`).join("")}</div>`),`
      ${t}
      <button class="fab-main" aria-label="${this.escapeHTML(this.config.label)}" title="${this.escapeHTML(this.config.label)}">
        <span class="fab-icon">${this.config.icon}</span>
      </button>
    `}setupEventListeners(e){if(!this.shadowRoot)return;const t=this.shadowRoot.querySelector(".fab-main"),i=this.config.actions&&this.config.actions.length>0;if(t){if(this.config.onHover){const a=this.config.onHover;t.addEventListener("mouseenter",()=>a());}if(i)t.addEventListener("mouseenter",()=>this.expand()),t.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.isExpanded?this.collapse():this.expand();});else if(this.config.onClick){const a=this.config.onClick;t.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),a();});}}i&&this.config.actions&&this.shadowRoot.querySelectorAll(".fab-mini").forEach(o=>{const s=o.dataset.actionIndex;if(s===void 0)return;const c=parseInt(s,10),l=this.config.actions?.[c];l&&o.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),l.onClick(),this.collapse();});}),e.addEventListener("mouseleave",()=>{this.isExpanded&&(this.expandTimer=window.setTimeout(()=>this.collapse(),800));}),e.addEventListener("mouseenter",()=>{this.expandTimer&&(clearTimeout(this.expandTimer),this.expandTimer=null);});}expand(){if(this.isExpanded)return;this.isExpanded=true,this.shadowRoot?.querySelector(".fab-speed-dial")?.classList.add("expanded");const t=this.shadowRoot?.querySelector(".fab-wrapper");t instanceof HTMLElement&&(t.style.pointerEvents="auto");}collapse(){if(!this.isExpanded)return;this.isExpanded=false,this.shadowRoot?.querySelector(".fab-speed-dial")?.classList.remove("expanded");const t=this.shadowRoot?.querySelector(".fab-wrapper");t instanceof HTMLElement&&(t.style.pointerEvents="");}handleFullscreenChange=()=>{const e=!!document.fullscreenElement;this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){document.addEventListener("fullscreenchange",this.handleFullscreenChange),document.addEventListener("webkitfullscreenchange",this.handleFullscreenChange);}escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}getStyles(){const{color:e}=this.config,t=this.fabSize,i=Math.round(t*.72);return `
      .fab-wrapper {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }

      .fab-main {
        width: ${String(t)}px;
        height: ${String(t)}px;
        border-radius: 50%;
        background: ${e};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        position: relative;
        z-index: 10;
      }

      .fab-main:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .fab-main:active {
        transform: scale(0.95);
      }

      .fab-icon {
        display: inline-flex;
        width: 24px;
        height: 24px;
        color: #fff;
      }

      .fab-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Speed dial */
      .fab-speed-dial {
        position: absolute;
        bottom: ${String(t+12)}px;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 10px;
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .fab-speed-dial.expanded {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .fab-speed-dial-item {
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }

      .fab-speed-dial-label {
        background: rgba(33, 33, 33, 0.85);
        backdrop-filter: blur(8px);
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(8px);
        transition: all 0.2s ease;
      }

      .fab-speed-dial.expanded .fab-speed-dial-label {
        opacity: 1;
        transform: translateX(0);
      }

      .fab-mini {
        width: ${String(i)}px;
        height: ${String(i)}px;
        border-radius: 50%;
        background: ${e};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fab-mini:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      }

      .fab-mini .fab-icon {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 768px) {
        .fab-main {
          width: ${String(Math.round(t*.85))}px;
          height: ${String(Math.round(t*.85))}px;
        }
        .fab-mini {
          width: ${String(Math.round(i*.85))}px;
          height: ${String(Math.round(i*.85))}px;
        }
        .fab-speed-dial-label {
          font-size: 11px;
          padding: 4px 10px;
        }
      }

      @media (prefers-contrast: high) {
        .fab-main,
        .fab-mini {
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
      }
    `}}class W{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=false;expandTimer=null;logger=F("youtube-info-copier");descriptionExpanded=false;preExpandPromise=null;fab=null;launchStyle;constructor(e="classic"){this.launchStyle=e,this.init();}init(){switch(this.launchStyle){case "classic":this.createShadowDOM(),this.setupFullscreenListener();break;case "fab":this.createFab();break;case "menu-only":break;default:this.launchStyle;}this.logger.info(`YouTubeInfoCopier initialized (style: ${this.launchStyle})`);}createFab(){this.fab=new Q({icon:y,color:"rgba(255, 0, 0, 0.9)",position:{bottom:"20px",left:"20px"},label:"YouTube動画情報コピー",onHover:()=>this.preExpandDescription(),actions:[{icon:y,label:"動画情報をコピー",onClick:()=>{this.performCopy("copy");}},{icon:H,label:"タイトル+URLのみ",onClick:()=>{this.performCopy("quick-copy");}}]}),this.fab.init();}async performCopy(e){try{switch(e==="copy"&&await this.ensureDescriptionExpanded(),e){case "copy":await this.copyVideoInfo();break;case "quick-copy":await this.copyQuickInfo();break}}catch(t){this.logger.error("performCopy failed:",t);}}async ensureDescriptionExpanded(){this.descriptionExpanded||(this.preExpandPromise||(this.setFabPreparingState(),this.preExpandPromise=M(5e3).then(()=>{this.descriptionExpanded=true,this.setFabReadyState();}).catch(e=>{this.logger.warn("Description expansion failed:",e),this.setFabErrorState();})),await this.preExpandPromise);}createShadowDOM(){this.container=document.createElement("div"),this.container.id="youtube-info-copier-container",this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:"closed"}),A(this.shadowRoot,j(),N),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(".control-handle"),this.panelElement=this.shadowRoot.querySelector(".control-panel"),this.popup=this.shadowRoot.querySelector(".popup"),this.setupEventListeners();}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;const e=this.shadowRoot.querySelector(".popup-close");this.handleElement.addEventListener("mouseenter",()=>{this.expandPanel(),this.preExpandDescription();}),this.panelElement.addEventListener("mouseenter",()=>this.expandPanel()),this.container.addEventListener("mouseleave",i=>{this.container?.contains(i.relatedTarget)||this.collapsePanel();}),this.shadowRoot.querySelectorAll(".panel-button").forEach(i=>{i.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.handleButtonClick(i.dataset.action||"");});}),this.handleElement.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),this.handleButtonClick("copy"));}),e?.addEventListener("click",()=>this.hidePopup()),document.addEventListener("click",i=>{this.container?.contains(i.target)||this.hidePopup();});}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=true,this.panelElement.classList.add("expanded"),this.container.style.pointerEvents="auto");}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=false,this.panelElement?.classList.remove("expanded"),this.container.style.pointerEvents="none";},1e3));}async handleButtonClick(e){try{if(e==="copy"&&!this.descriptionExpanded){this.logger.info("Description not ready yet, please wait for animation..."),this.showNotReadyFeedback();return}(e==="copy"||e==="quick-copy")&&await this.performCopy(e);}catch(t){this.logger.error("Error handling button click:",t);}}preExpandDescription(){this.descriptionExpanded||this.preExpandPromise||(this.logger.info("Pre-expanding description..."),this.setPreparingState(),this.setFabPreparingState(),this.preExpandPromise=M(5e3).then(()=>{this.descriptionExpanded=true,this.setReadyState(),this.setFabReadyState(),this.logger.info("Pre-expansion completed - ready to copy!");}).catch(e=>{this.logger.warn("Pre-expansion failed:",e),this.setErrorState(),this.setFabErrorState();}));}setPreparingState(){this.handleElement&&(this.handleElement.classList.add("preparing"),this.handleElement.classList.remove("ready","error"));}setReadyState(){this.handleElement&&(this.handleElement.classList.remove("preparing","error"),this.handleElement.classList.add("ready"),this.handleElement.setAttribute("data-status","ready"));}setErrorState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready"),this.handleElement.classList.add("error"));}clearState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready","error"),this.handleElement.removeAttribute("data-status"));}setFabPreparingState(){this.fab?.setColor("rgba(255, 152, 0, 0.9)");}setFabReadyState(){this.fab?.setColor("rgba(76, 175, 80, 0.9)");}setFabErrorState(){this.fab?.setColor("rgba(244, 67, 54, 0.9)");}async copyQuickInfo(){try{const e=await this.getVideoInfo(),t=`${e.title}
${e.url}`;await navigator.clipboard.writeText(t),this.showSuccessFeedback();}catch(e){this.logger.error("クイックコピーエラー:",e),this.showErrorFeedback();}}async getVideoInfo(){const e=r=>r.map(d=>document.querySelector(d)).find(d=>d!==null)??null,i=e(u.titleCandidates)?.textContent?.trim()||"タイトル不明",o=e(u.channelCandidates)?.textContent?.trim()||"投稿者不明",s=new URLSearchParams(window.location.search).get("v")||window.location.pathname.split("/").pop(),c=s?Z(s):window.location.href;this.descriptionExpanded?this.logger.debug("Description already expanded, fetching immediately"):this.logger.warn("getVideoInfo called before description expanded");let l="概要取得に失敗しました";for(const r of u.descriptionExpandedContent){const d=document.querySelector(r);if(d){const p=(d.textContent||d.innerText||"").trim();if(p&&p.length>50){l=p,this.logger.debug(`Description found using selector: ${r}`);break}}}if(l==="概要取得に失敗しました"){const r=document.querySelector(u.descriptionRoot);if(r){const d=r.querySelector("#expanded");if(d){const p=(d.textContent||d.innerText||"").trim();p&&p.length>50&&(l=p,this.logger.debug("Description found in #expanded div"));}if(l==="概要取得に失敗しました"){const f=(r.innerText||"").trim().replace(/\.\.\.もっと見る\n?/g,"").replace(/一部を表示\n?/g,"").trim();f&&f.length>10&&(l=f,this.logger.debug("Description found using innerText"));}}}return {title:i,author:o,url:c,description:l}}async copyVideoInfo(){try{const e=await this.getVideoInfo(),t=`タイトル：${e.title}
投稿者名：${e.author}
URL：${e.url}
概要：${e.description}`;await navigator.clipboard.writeText(t),this.showPopup(e.description),this.showSuccessFeedback(),this.logger.info("Video info copied successfully");}catch(e){this.logger.error("コピーエラー:",e),this.showErrorFeedback();}}showSuccessFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background="rgba(76, 175, 80, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(76, 175, 80, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500)):this.fab&&(this.fab.setColor("rgba(76, 175, 80, 0.9)"),setTimeout(()=>this.fab?.resetColor(),1500));}showErrorFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background="rgba(244, 67, 54, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(244, 67, 54, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500)):this.fab&&(this.fab.setColor("rgba(244, 67, 54, 0.9)"),setTimeout(()=>this.fab?.resetColor(),1500));}showNotReadyFeedback(){this.handleElement?(this.handleElement.style.background="rgba(255, 152, 0, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(255, 152, 0, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},800)):this.fab&&(this.fab.setColor("rgba(255, 152, 0, 0.9)"),setTimeout(()=>this.fab?.resetColor(),800));}showPopup(e){if(!this.shadowRoot||!this.popup)return;const t=this.shadowRoot.querySelector(".popup-content");t&&(t.textContent=e),this.popup.classList.add("show"),setTimeout(()=>this.hidePopup(),3e3);}hidePopup(){this.popup?.classList.remove("show");}handleFullscreenChange=()=>{const e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,this.handleFullscreenChange,false);}),this.handleFullscreenChange();}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>document.removeEventListener(t,this.handleFullscreenChange,!1)),this.container?.remove(),this.fab?.destroy(),this.fab=null,this.descriptionExpanded=!1,this.preExpandPromise=null,this.logger.info("YouTubeInfoCopier instance destroyed.");}catch(e){this.logger.error("Error during cleanup:",e);}}}var K=typeof GM_getValue<"u"?GM_getValue:void 0,J=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,ee=typeof GM_setValue<"u"?GM_setValue:void 0;function v(n,e){J(n,e);}function te(n,e){ee(n,e);}function ne(n,e){return K(n,e)}const g=["classic","fab","menu-only"],$={classic:"従来スタイル",fab:"FABボタン","menu-only":"メニューのみ"},P="launch-style-";function w(n,e="classic"){const t=`${P}${n}`,i=ne(t);return typeof i=="string"&&g.includes(i)?i:e}function ie(n,e){const t=`${P}${n}`;te(t,e);}function oe(n){const t=(g.indexOf(n)+1)%g.length;return g[t]}function ae(n,e){const t=w(n),i=`起動スタイル変更 [現在: ${$[t]}]`;v(i,()=>{const a=w(n),o=oe(a);ie(n,o),alert(`起動スタイルを「${$[o]}」に変更しました。
ページを再読み込みすると反映されます。`);});}let R=window.location.href,b=null;const re=w("youtube-info-copier");ae("youtube-info-copier");v("動画情報をコピー",()=>{b?.performCopy("copy");});v("タイトル+URLのみ",()=>{b?.performCopy("quick-copy");});function E(){b&&(b.destroy(),b=null),window.location.pathname==="/watch"&&setTimeout(()=>{b=new W(re);},1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();function q(){const n=document.body;if(!n){const t=()=>{document.removeEventListener("DOMContentLoaded",t),q();};document.addEventListener("DOMContentLoaded",t);return}new MutationObserver(()=>{window.location.href!==R&&(R=window.location.href,E());}).observe(n,{childList:true,subtree:true});}q();

})();