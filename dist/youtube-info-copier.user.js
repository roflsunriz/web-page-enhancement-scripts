// ==UserScript==
// @name         youtube-info-copier
// @namespace    youtubeInfoCopier
// @version      2.3.2
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

  const v={debug:"debug",info:"info",warn:"warn",error:"error"},L=o=>{const e=`[${o}]`,t={};return Object.keys(v).forEach(n=>{const d=v[n];t[n]=(...r)=>{(console[d]??console.log)(e,...r);};}),t},k=new WeakMap;function M(o){const{trustedTypes:e}=o;return !e||typeof e.createPolicy!="function"?null:e}function $(o,e){let t=k.get(o);t||(t=new Map,k.set(o,t));const n=t.get(e);if(n)return n;const d=o.createPolicy(e,{createHTML:r=>r});return d?(t.set(e,d),d):null}function D(o,e,t=window){const n=M(t);if(!n)return o;const d=$(n,e);return d?d.createHTML(o):o}function R(o,e,t){const d=(o.ownerDocument??document).defaultView??window,r=D(e,t,d);if(typeof r=="string"){o.innerHTML=r;return}o.innerHTML=r;}const h={descriptionCandidates:["#description","ytd-expander#description","#meta-contents #description","#meta-contents"],inlineExpander:"ytd-text-inline-expander",inlineExpanderById:"ytd-text-inline-expander#description-inline-expander",interactiveElements:"tp-yt-paper-button, button, a",titleCandidates:["h1.ytd-watch-metadata yt-formatted-string","#title h1 yt-formatted-string","h1.title"],channelCandidates:["#owner #channel-name a","ytd-channel-name a",".ytd-video-owner-renderer a","#upload-info #channel-name a","#owner-text a"],descriptionRoot:"#description-inline-expander",descriptionExpandedContent:["#description-inline-expander #expanded yt-attributed-string","#description-inline-expander #expanded yt-formatted-string","#description-inline-expander #snippet yt-attributed-string"]},u=L("youtube-info-copier:dom-utils");async function P(o=4e3){const e=h.descriptionCandidates.map(r=>document.querySelector(r)).find(Boolean);if(!e)return;const t=()=>{const r=e.querySelector(h.inlineExpander)||document.querySelector(h.inlineExpanderById);if(r?.hasAttribute("is-expanded"))return u.debug("Already has is-expanded attribute"),true;const s=document.querySelector("tp-yt-paper-button#expand");if(s&&s.textContent?.includes("もっと見る"))try{return u.debug("Clicking tp-yt-paper-button#expand directly"),s.click(),u.info("概要欄の「もっと見る」ボタンをクリックしました。"),!0}catch(i){u.warn("Direct click failed:",i);}const c=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,l=[];r&&l.push(...Array.from(r.querySelectorAll(h.interactiveElements))),l.push(...Array.from(document.querySelectorAll(h.interactiveElements)));for(const i of l)try{const a=(i.textContent||"").trim();if((i.getAttribute("aria-expanded")==="false"||c.test(a)||i.id&&/expand|more|collapse/i.test(i.id))&&typeof i.click=="function")return u.debug(`Clicking element: ${i.tagName}#${i.id} "${a}"`),i.click(),u.info("概要欄の「もっと見る」ボタンをクリックしました（フォールバック）。"),!0}catch{}return u.warn("No expand button found"),false},n=()=>{const r=e.querySelector(h.inlineExpander)||document.querySelector(h.inlineExpanderById),s=(r||e).querySelector("#expanded");if(s){const c=(s.textContent||s.innerText||"").trim();if(c&&c.length>200)return u.debug(`Description is expanded (found ${c.length} chars in #expanded)`),true}if(r?.hasAttribute("is-expanded")&&s){const c=(s.textContent||s.innerText||"").trim();return c&&c.length>200?true:(u.debug("is-expanded attr found but content not yet loaded"),false)}return  false};if(!(n()||!t()))return new Promise(r=>{const s=Date.now();let c=0,l=null,i=null;const a=()=>{l&&(l.disconnect(),l=null),i&&(clearInterval(i),i=null);},p=C=>{c++;const y=e.querySelector("#expanded"),w=y?(y.textContent||"").trim().length:0,E=n(),g=Date.now()-s;return u.debug(`Check ${c} (${C}): expanded=${E}, #expanded length=${w}, elapsed=${g}ms`),E?(a(),u.info(`Description expanded successfully (#expanded: ${w} chars) after ${g}ms`),setTimeout(()=>r(),200),true):g>o?(a(),u.warn(`Description expansion timed out after ${g}ms (${c} checks)`),r(),true):false},x=e.querySelector("#expanded");x&&(l=new MutationObserver(()=>{p("mutation");}),l.observe(x,{childList:true,subtree:true,characterData:true}),u.debug("MutationObserver started on #expanded")),i=window.setInterval(()=>{p("poll");},200),p("initial");})}var F="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",H="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",I="M7,2V13H10V22L17,10H13L17,2H7Z",q="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z";function f(o,e=24){const t=String(e),n=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const V=f(q),A=f(H),B=f(I),O=f(F),z="youtube-info-copier-template";function U(){return `
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
                <span class="panel-icon">${V}</span>
                <span class="panel-title">YouTube Info</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${A}</span>
                    動画情報をコピー
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${B}</span>
                    タイトル+URLのみ
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="閉じる">${O}</button>
            <div class="popup-title">コピーした概要</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}const Y="https://youtu.be",_=o=>`${Y}/${o}`;class N{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=false;expandTimer=null;logger=L("youtube-info-copier");descriptionExpanded=false;preExpandPromise=null;constructor(){this.init();}init(){this.createShadowDOM(),this.setupFullscreenListener(),this.logger.info("YouTubeInfoCopier initialized.");}createShadowDOM(){this.container=document.createElement("div"),this.container.id="youtube-info-copier-container",this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:"closed"}),R(this.shadowRoot,U(),z),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(".control-handle"),this.panelElement=this.shadowRoot.querySelector(".control-panel"),this.popup=this.shadowRoot.querySelector(".popup"),this.setupEventListeners();}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;const e=this.shadowRoot.querySelector(".popup-close");this.handleElement.addEventListener("mouseenter",()=>{this.expandPanel(),this.preExpandDescription();}),this.panelElement.addEventListener("mouseenter",()=>this.expandPanel()),this.container.addEventListener("mouseleave",n=>{this.container?.contains(n.relatedTarget)||this.collapsePanel();}),this.shadowRoot.querySelectorAll(".panel-button").forEach(n=>{n.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation(),this.handleButtonClick(n.dataset.action||"");});}),this.handleElement.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),this.handleButtonClick("copy"));}),e?.addEventListener("click",()=>this.hidePopup()),document.addEventListener("click",n=>{this.container?.contains(n.target)||this.hidePopup();});}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=true,this.panelElement.classList.add("expanded"),this.container.style.pointerEvents="auto");}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=false,this.panelElement?.classList.remove("expanded"),this.container.style.pointerEvents="none";},1e3));}async handleButtonClick(e){try{if(e==="copy"&&!this.descriptionExpanded){this.logger.info("Description not ready yet, please wait for animation..."),this.showNotReadyFeedback();return}switch(e){case "copy":await this.copyVideoInfo();break;case "quick-copy":await this.copyQuickInfo();break}}catch(t){this.logger.error("Error handling button click:",t);}}preExpandDescription(){this.descriptionExpanded||this.preExpandPromise||(this.logger.info("Pre-expanding description..."),this.setPreparingState(),this.preExpandPromise=P(5e3).then(()=>{this.descriptionExpanded=true,this.setReadyState(),this.logger.info("Pre-expansion completed - ready to copy!");}).catch(e=>{this.logger.warn("Pre-expansion failed:",e),this.setErrorState();}));}setPreparingState(){this.handleElement&&(this.handleElement.classList.add("preparing"),this.handleElement.classList.remove("ready","error"));}setReadyState(){this.handleElement&&(this.handleElement.classList.remove("preparing","error"),this.handleElement.classList.add("ready"),this.handleElement.setAttribute("data-status","ready"));}setErrorState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready"),this.handleElement.classList.add("error"));}clearState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready","error"),this.handleElement.removeAttribute("data-status"));}async copyQuickInfo(){try{const e=await this.getVideoInfo(),t=`${e.title}
${e.url}`;await navigator.clipboard.writeText(t),this.showSuccessFeedback();}catch(e){this.logger.error("クイックコピーエラー:",e),this.showErrorFeedback();}}async getVideoInfo(){const e=i=>i.map(a=>document.querySelector(a)).find(a=>a!==null)??null,n=e(h.titleCandidates)?.textContent?.trim()||"タイトル不明",r=e(h.channelCandidates)?.textContent?.trim()||"投稿者不明",s=new URLSearchParams(window.location.search).get("v")||window.location.pathname.split("/").pop(),c=s?_(s):window.location.href;this.descriptionExpanded?this.logger.debug("Description already expanded, fetching immediately"):this.logger.warn("getVideoInfo called before description expanded");let l="概要取得に失敗しました";for(const i of h.descriptionExpandedContent){const a=document.querySelector(i);if(a){const p=(a.textContent||a.innerText||"").trim();if(p&&p.length>50){l=p,this.logger.debug(`Description found using selector: ${i}`);break}}}if(l==="概要取得に失敗しました"){const i=document.querySelector(h.descriptionRoot);if(i){const a=i.querySelector("#expanded");if(a){const p=(a.textContent||a.innerText||"").trim();p&&p.length>50&&(l=p,this.logger.debug("Description found in #expanded div"));}if(l==="概要取得に失敗しました"){const x=(i.innerText||"").trim().replace(/\.\.\.もっと見る\n?/g,"").replace(/一部を表示\n?/g,"").trim();x&&x.length>10&&(l=x,this.logger.debug("Description found using innerText"));}}}return {title:n,author:r,url:c,description:l}}async copyVideoInfo(){try{const e=await this.getVideoInfo(),t=`タイトル：${e.title}
投稿者名：${e.author}
URL：${e.url}
概要：${e.description}`;await navigator.clipboard.writeText(t),this.showPopup(e.description),this.showSuccessFeedback(),this.logger.info("Video info copied successfully");}catch(e){this.logger.error("コピーエラー:",e),this.showErrorFeedback();}}showSuccessFeedback(){this.handleElement&&(this.clearState(),this.handleElement.style.background="rgba(76, 175, 80, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(76, 175, 80, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showErrorFeedback(){this.handleElement&&(this.clearState(),this.handleElement.style.background="rgba(244, 67, 54, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(244, 67, 54, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500));}showNotReadyFeedback(){this.handleElement&&(this.handleElement.style.background="rgba(255, 152, 0, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(255, 152, 0, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},800));}showPopup(e){if(!this.shadowRoot||!this.popup)return;const t=this.shadowRoot.querySelector(".popup-content");t&&(t.textContent=e),this.popup.classList.add("show"),setTimeout(()=>this.hidePopup(),3e3);}hidePopup(){this.popup?.classList.remove("show");}handleFullscreenChange=()=>{const e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,this.handleFullscreenChange,false);}),this.handleFullscreenChange();}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>document.removeEventListener(t,this.handleFullscreenChange,!1)),this.container?.remove(),this.descriptionExpanded=!1,this.preExpandPromise=null,this.logger.info("YouTubeInfoCopier instance destroyed.");}catch(e){this.logger.error("Error during cleanup:",e);}}}let S=window.location.href,b=null;function m(){b&&(b.destroy(),b=null),window.location.pathname==="/watch"&&setTimeout(()=>{b=new N;},1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m();function T(){const o=document.body;if(!o){const t=()=>{document.removeEventListener("DOMContentLoaded",t),T();};document.addEventListener("DOMContentLoaded",t);return}new MutationObserver(()=>{window.location.href!==S&&(S=window.location.href,m());}).observe(o,{childList:true,subtree:true});}T();

})();