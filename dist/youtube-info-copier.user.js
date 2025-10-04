// ==UserScript==
// @name         YouTube Info Copier
// @namespace    youtubeInfoCopier
// @version      2.0.0
// @author       roflsunriz
// @description  YouTube動画の情報をワンクリックでクリップボードにコピー（ハンドル式）
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.meta.js
// @match        https://www.youtube.com/*
// @match        https://youtu.be/*
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const f={debug:"debug",info:"info",warn:"warn",error:"error"},y=o=>{const e=`[${o}]`,t={};return Object.keys(f).forEach(n=>{const r=f[n];t[n]=(...i)=>{(console[r]??console.log)(e,...i);};}),t},x=new WeakMap;function E(o){const{trustedTypes:e}=o;return !e||typeof e.createPolicy!="function"?null:e}function v(o,e){let t=x.get(o);t||(t=new Map,x.set(o,t));const n=t.get(e);if(n)return n;const r=o.createPolicy(e,{createHTML:i=>i});return r?(t.set(e,r),r):null}function k(o,e,t=window){const n=E(t);if(!n)return o;const r=v(n,e);return r?r.createHTML(o):o}function S(o,e,t){const r=(o.ownerDocument??document).defaultView??window,i=k(e,t,r);if(typeof i=="string"){o.innerHTML=i;return}o.innerHTML=i;}const T=y("youtube-info-copier:dom-utils");async function L(o=4e3){const e=Date.now(),n=["#description","ytd-expander#description","#meta-contents #description","#meta-contents"].map(a=>document.querySelector(a)).find(Boolean);if(!n)return;const r=()=>{const a=n.querySelector("ytd-text-inline-expander")||document.querySelector("ytd-text-inline-expander#description-inline-expander");if(a?.hasAttribute("is-expanded"))return  true;const s=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,c=[];a&&c.push(...Array.from(a.querySelectorAll("tp-yt-paper-button, button, a"))),c.push(...Array.from(document.querySelectorAll("tp-yt-paper-button, button, a")));for(const l of c)try{const h=(l.textContent||"").trim();if((l.getAttribute("aria-expanded")==="false"||s.test(h)||l.id&&/expand|more|collapse/i.test(l.id))&&typeof l.click=="function")return l.click(),T.info("概要欄の「もっと見る」ボタンをクリックしました。"),!0}catch{}return  false},i=()=>(n.querySelector("ytd-text-inline-expander")||document.querySelector("ytd-text-inline-expander#description-inline-expander"))?.hasAttribute("is-expanded")?true:(n.textContent||"").trim().length>200||n.querySelectorAll("span").length>3;if(i())return;const u=(n.textContent||"").length;if(r())return new Promise(a=>{const s=setInterval(()=>{const c=(n.textContent||"").length;(i()||c>u+20||Date.now()-e>o)&&(clearInterval(s),a());},80);})}const C="youtube-info-copier-template";function M(){return `
    <style>
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        
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

        .panel-header .material-icons {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.9);
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

        .panel-button .material-icons {
            font-size: 16px;
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
            font-size: 18px;
            cursor: pointer;
            color: #666;
            font-family: 'Material Icons';
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
                <span class="material-icons">smart_display</span>
                <span class="panel-title">YouTube Info</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="material-icons">content_copy</span>
                    動画情報をコピー
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="material-icons">flash_on</span>
                    タイトル+URLのみ
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close">close</button>
            <div class="popup-title">コピーした概要</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}class q{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=false;expandTimer=null;logger=y("youtube-info-copier");constructor(){this.init();}init(){this.createShadowDOM(),this.loadMaterialIcons(),this.setupFullscreenListener(),this.logger.info("YouTubeInfoCopier initialized.");}createShadowDOM(){this.container=document.createElement("div"),this.container.id="youtube-info-copier-container",this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:"closed"}),S(this.shadowRoot,M(),C),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(".control-handle"),this.panelElement=this.shadowRoot.querySelector(".control-panel"),this.popup=this.shadowRoot.querySelector(".popup"),this.setupEventListeners();}loadMaterialIcons(){if(!document.querySelector('link[href*="material-icons"]')){const e=document.createElement("link");e.href="https://fonts.googleapis.com/icon?family=Material+Icons",e.rel="stylesheet",document.head.appendChild(e);}}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;const e=this.shadowRoot.querySelector(".popup-close");this.handleElement.addEventListener("mouseenter",()=>this.expandPanel()),this.panelElement.addEventListener("mouseenter",()=>this.expandPanel()),this.container.addEventListener("mouseleave",n=>{this.container?.contains(n.relatedTarget)||this.collapsePanel();}),this.shadowRoot.querySelectorAll(".panel-button").forEach(n=>{n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.handleButtonClick(n.dataset.action||"");});}),this.handleElement.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this.handleButtonClick("copy"));}),e?.addEventListener("click",()=>this.hidePopup()),document.addEventListener("click",n=>{this.container?.contains(n.target)||this.hidePopup();});}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=true,this.panelElement.classList.add("expanded"),this.container.style.pointerEvents="auto");}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=false,this.panelElement?.classList.remove("expanded"),this.container.style.pointerEvents="none";},1e3));}async handleButtonClick(e){try{switch(e){case "copy":await this.copyVideoInfo();break;case "quick-copy":await this.copyQuickInfo();break}}catch(t){this.logger.error("Error handling button click:",t);}}async copyQuickInfo(){try{const e=await this.getVideoInfo(),t=`${e.title}
${e.url}`;await navigator.clipboard.writeText(t),this.showSuccessFeedback();}catch(e){this.logger.error("クイックコピーエラー:",e),this.showErrorFeedback();}}async getVideoInfo(){const t=(document.querySelector("h1.ytd-watch-metadata yt-formatted-string")||document.querySelector("#title h1 yt-formatted-string")||document.querySelector("h1.title"))?.textContent?.trim()||"タイトル不明",r=(document.querySelector("#owner #channel-name a")||document.querySelector("ytd-channel-name a")||document.querySelector(".ytd-video-owner-renderer a")||document.querySelector("#upload-info #channel-name a")||document.querySelector("#owner-text a"))?.textContent?.trim()||"投稿者不明",i=new URLSearchParams(window.location.search).get("v")||window.location.pathname.split("/").pop(),u=i?`https://youtu.be/${i}`:window.location.href;await L(2e3).catch(s=>this.logger.debug("expandDescriptionIfNeeded failed:",s));const d=document.querySelector("#description");let a="概要取得に失敗しました";if(d){const s=d.querySelectorAll("span");if(s.length>0){const c=new Set,l=[];s.forEach(h=>{const p=(h.textContent||h.innerText||"").trim();p&&!c.has(p)&&(c.add(p),l.push(p));}),a=l.join("").trim();}else a=(d.textContent||d.innerText||"").trim();}return {title:t,author:r,url:u,description:a}}async copyVideoInfo(){try{const e=await this.getVideoInfo(),t=`タイトル：${e.title}
投稿者名：${e.author}
URL：${e.url}
概要：${e.description}`;await navigator.clipboard.writeText(t),this.showPopup(e.description),this.showSuccessFeedback();}catch(e){this.logger.error("コピーエラー:",e),this.showErrorFeedback();}}showSuccessFeedback(){this.handleElement&&(this.handleElement.style.background="rgba(76, 175, 80, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(76, 175, 80, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showErrorFeedback(){this.handleElement&&(this.handleElement.style.background="rgba(244, 67, 54, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(244, 67, 54, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showPopup(e){if(!this.shadowRoot||!this.popup)return;const t=this.shadowRoot.querySelector(".popup-content");t&&(t.textContent=e),this.popup.classList.add("show"),setTimeout(()=>this.hidePopup(),3e3);}hidePopup(){this.popup?.classList.remove("show");}handleFullscreenChange=()=>{const e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,this.handleFullscreenChange,false);}),this.handleFullscreenChange();}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>document.removeEventListener(t,this.handleFullscreenChange,!1)),this.container?.remove(),this.logger.info("YouTubeInfoCopier instance destroyed.");}catch(e){this.logger.error("Error during cleanup:",e);}}}let g=window.location.href,b=null;function m(){b&&(b.destroy(),b=null),window.location.pathname==="/watch"&&setTimeout(()=>{b=new q;},1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();function w(){const o=document.body;if(!o){const t=()=>{document.removeEventListener("DOMContentLoaded",t),w();};document.addEventListener("DOMContentLoaded",t);return}new MutationObserver(()=>{window.location.href!==g&&(g=window.location.href,m());}).observe(o,{childList:true,subtree:true});}w();

})();