// ==UserScript==
// @name         youtube-info-copier
// @namespace    youtubeInfoCopier
// @version      2.3.0
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

  const m={debug:"debug",info:"info",warn:"warn",error:"error"},E=o=>{const e=`[${o}]`,t={};return Object.keys(m).forEach(n=>{const a=m[n];t[n]=(...c)=>{(console[a]??console.log)(e,...c);};}),t},w=new WeakMap;function k(o){const{trustedTypes:e}=o;return !e||typeof e.createPolicy!="function"?null:e}function L(o,e){let t=w.get(o);t||(t=new Map,w.set(o,t));const n=t.get(e);if(n)return n;const a=o.createPolicy(e,{createHTML:c=>c});return a?(t.set(e,a),a):null}function T(o,e,t=window){const n=k(t);if(!n)return o;const a=L(n,e);return a?a.createHTML(o):o}function S(o,e,t){const a=(o.ownerDocument??document).defaultView??window,c=T(e,t,a);if(typeof c=="string"){o.innerHTML=c;return}o.innerHTML=c;}const p={descriptionCandidates:["#description","ytd-expander#description","#meta-contents #description","#meta-contents"],inlineExpander:"ytd-text-inline-expander",inlineExpanderById:"ytd-text-inline-expander#description-inline-expander",interactiveElements:"tp-yt-paper-button, button, a",titleCandidates:["h1.ytd-watch-metadata yt-formatted-string","#title h1 yt-formatted-string","h1.title"],channelCandidates:["#owner #channel-name a","ytd-channel-name a",".ytd-video-owner-renderer a","#upload-info #channel-name a","#owner-text a"],descriptionRoot:"#description-inline-expander",descriptionExpandedContent:["#description-inline-expander #expanded yt-attributed-string","#description-inline-expander #expanded yt-formatted-string","#description-inline-expander #snippet yt-attributed-string"]},h=E("youtube-info-copier:dom-utils");async function C(o=4e3){const e=Date.now(),t=p.descriptionCandidates.map(d=>document.querySelector(d)).find(Boolean);if(!t)return;const n=()=>{const d=t.querySelector(p.inlineExpander)||document.querySelector(p.inlineExpanderById);if(d?.hasAttribute("is-expanded"))return  true;const l=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,r=[];d&&r.push(...Array.from(d.querySelectorAll(p.interactiveElements))),r.push(...Array.from(document.querySelectorAll(p.interactiveElements)));for(const i of r)try{const s=(i.textContent||"").trim();if((i.getAttribute("aria-expanded")==="false"||l.test(s)||i.id&&/expand|more|collapse/i.test(i.id))&&typeof i.click=="function")return i.click(),h.info("概要欄の「もっと見る」ボタンをクリックしました。"),!0}catch{}return  false},a=()=>{const d=t.querySelector(p.inlineExpander)||document.querySelector(p.inlineExpanderById);if(d?.hasAttribute("is-expanded"))return  true;const l=(d||t).querySelector("#expanded");if(l){const s=(l.textContent||l.innerText||"").trim();if(s&&s.length>100)return h.debug("Description is expanded (found content in #expanded)"),true}const i=(t.textContent||"").trim().length>300||t.querySelectorAll("span").length>5;return i&&h.debug("Description appears expanded based on length"),i};if(a())return;const c=(t.textContent||"").length;if(n())return new Promise(d=>{const l=setInterval(()=>{const r=(t.textContent||"").length,i=a(),s=r>c+50,u=Date.now()-e>o;(i||s||u)&&(clearInterval(l),i||s?h.info(`Description expanded successfully (length: ${c} -> ${r})`):h.warn("Description expansion timed out"),setTimeout(()=>d(),100));},100);})}var M="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",H="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",I="M7,2V13H10V22L17,10H13L17,2H7Z",F="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z";function b(o,e=24){const t=String(e),n=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const R=b(F),D=b(H),q=b(I),V=b(M),A="youtube-info-copier-template";function P(){return `
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
                <span class="panel-icon">${R}</span>
                <span class="panel-title">YouTube Info</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${D}</span>
                    動画情報をコピー
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${q}</span>
                    タイトル+URLのみ
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="閉じる">${V}</button>
            <div class="popup-title">コピーした概要</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}const $="https://youtu.be",z=o=>`${$}/${o}`;class B{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=false;expandTimer=null;logger=E("youtube-info-copier");constructor(){this.init();}init(){this.createShadowDOM(),this.setupFullscreenListener(),this.logger.info("YouTubeInfoCopier initialized.");}createShadowDOM(){this.container=document.createElement("div"),this.container.id="youtube-info-copier-container",this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:"closed"}),S(this.shadowRoot,P(),A),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(".control-handle"),this.panelElement=this.shadowRoot.querySelector(".control-panel"),this.popup=this.shadowRoot.querySelector(".popup"),this.setupEventListeners();}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;const e=this.shadowRoot.querySelector(".popup-close");this.handleElement.addEventListener("mouseenter",()=>this.expandPanel()),this.panelElement.addEventListener("mouseenter",()=>this.expandPanel()),this.container.addEventListener("mouseleave",n=>{this.container?.contains(n.relatedTarget)||this.collapsePanel();}),this.shadowRoot.querySelectorAll(".panel-button").forEach(n=>{n.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.handleButtonClick(n.dataset.action||"");});}),this.handleElement.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this.handleButtonClick("copy"));}),e?.addEventListener("click",()=>this.hidePopup()),document.addEventListener("click",n=>{this.container?.contains(n.target)||this.hidePopup();});}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=true,this.panelElement.classList.add("expanded"),this.container.style.pointerEvents="auto");}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=false,this.panelElement?.classList.remove("expanded"),this.container.style.pointerEvents="none";},1e3));}async handleButtonClick(e){try{switch(e){case "copy":await this.copyVideoInfo();break;case "quick-copy":await this.copyQuickInfo();break}}catch(t){this.logger.error("Error handling button click:",t);}}async copyQuickInfo(){try{const e=await this.getVideoInfo(),t=`${e.title}
${e.url}`;await navigator.clipboard.writeText(t),this.showSuccessFeedback();}catch(e){this.logger.error("クイックコピーエラー:",e),this.showErrorFeedback();}}async getVideoInfo(){const e=r=>r.map(i=>document.querySelector(i)).find(i=>i!==null)??null,n=e(p.titleCandidates)?.textContent?.trim()||"タイトル不明",c=e(p.channelCandidates)?.textContent?.trim()||"投稿者不明",x=new URLSearchParams(window.location.search).get("v")||window.location.pathname.split("/").pop(),d=x?z(x):window.location.href;await C(2e3).catch(r=>this.logger.debug("expandDescriptionIfNeeded failed:",r));let l="概要取得に失敗しました";for(const r of p.descriptionExpandedContent){const i=document.querySelector(r);if(i){const s=(i.textContent||i.innerText||"").trim();if(s&&s.length>50){l=s,this.logger.debug(`Description found using selector: ${r}`);break}}}if(l==="概要取得に失敗しました"){const r=document.querySelector(p.descriptionRoot);if(r){const i=r.querySelector("#expanded");if(i){const s=(i.textContent||i.innerText||"").trim();s&&s.length>50&&(l=s,this.logger.debug("Description found in #expanded div"));}if(l==="概要取得に失敗しました"){const u=(r.innerText||"").trim().replace(/\.\.\.もっと見る\n?/g,"").replace(/一部を表示\n?/g,"").trim();u&&u.length>10&&(l=u,this.logger.debug("Description found using innerText"));}}}return {title:n,author:c,url:d,description:l}}async copyVideoInfo(){try{const e=await this.getVideoInfo(),t=`タイトル：${e.title}
投稿者名：${e.author}
URL：${e.url}
概要：${e.description}`;await navigator.clipboard.writeText(t),this.showPopup(e.description),this.showSuccessFeedback();}catch(e){this.logger.error("コピーエラー:",e),this.showErrorFeedback();}}showSuccessFeedback(){this.handleElement&&(this.handleElement.style.background="rgba(76, 175, 80, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(76, 175, 80, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showErrorFeedback(){this.handleElement&&(this.handleElement.style.background="rgba(244, 67, 54, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(244, 67, 54, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showPopup(e){if(!this.shadowRoot||!this.popup)return;const t=this.shadowRoot.querySelector(".popup-content");t&&(t.textContent=e),this.popup.classList.add("show"),setTimeout(()=>this.hidePopup(),3e3);}hidePopup(){this.popup?.classList.remove("show");}handleFullscreenChange=()=>{const e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,this.handleFullscreenChange,false);}),this.handleFullscreenChange();}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>document.removeEventListener(t,this.handleFullscreenChange,!1)),this.container?.remove(),this.logger.info("YouTubeInfoCopier instance destroyed.");}catch(e){this.logger.error("Error during cleanup:",e);}}}let y=window.location.href,g=null;function f(){g&&(g.destroy(),g=null),window.location.pathname==="/watch"&&setTimeout(()=>{g=new B;},1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f();function v(){const o=document.body;if(!o){const t=()=>{document.removeEventListener("DOMContentLoaded",t),v();};document.addEventListener("DOMContentLoaded",t);return}new MutationObserver(()=>{window.location.href!==y&&(y=window.location.href,f());}).observe(o,{childList:true,subtree:true});}v();

})();