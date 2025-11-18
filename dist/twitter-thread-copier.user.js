// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      6.7.0
// @author       roflsunriz
// @description  Copy entire Twitter/X threads with formatting and expansions.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @connect      translate.googleapis.com
// @connect      *.googleapis.com
// @connect      t.co
// @connect      *
// @connect      localhost
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const I="[TwitterThreadCopier]",d={log:n=>{console.log(I,n);},error:n=>{console.error(I,n);},warn:(n,t)=>{t?console.warn(I,n,t):console.warn(I,n);}};function dt(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const c=dt();var ut="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",pt="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",ht="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",gt="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function P(n,t=24){const e=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${n}"></path></svg>`}const m={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},et="twitter-thread-copier-settings",mt="http://localhost:3002/v1/chat/completions",ft="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",bt="https://api.cerebras.ai/v1/chat/completions",wt="gpt-oss-120b",yt="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";function M(){return {localAiEndpoint:mt,localAiSystemPrompt:ft,openaiEndpoint:bt,openaiModel:wt,openaiSystemPrompt:yt,openaiApiKey:""}}function U(){try{const n=localStorage.getItem(et);if(!n)return M();const t=JSON.parse(n),e=M();return {localAiEndpoint:t.localAiEndpoint??e.localAiEndpoint,localAiSystemPrompt:t.localAiSystemPrompt??e.localAiSystemPrompt,openaiEndpoint:t.openaiEndpoint??e.openaiEndpoint,openaiModel:t.openaiModel??e.openaiModel,openaiSystemPrompt:t.openaiSystemPrompt??e.openaiSystemPrompt,openaiApiKey:t.openaiApiKey??e.openaiApiKey}}catch(n){return d.error(`Failed to load settings: ${n.message}`),M()}}function nt(n){try{const t=JSON.stringify(n);localStorage.setItem(et,t),d.log("Settings saved successfully");}catch(t){d.error(`Failed to save settings: ${t.message}`);}}function xt(){const n=M();return nt(n),n}const C={LOADING:P(gt),CLIPBOARD:P(ut),COPY:P(ht),SETTINGS:P(pt)};class Tt{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;settingsModal=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),d.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style"),e=m.article;t.textContent=`
      .floating-ui-container {
          position: fixed;
          bottom: 100px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          z-index: 9999;
          pointer-events: none;
          user-select: none;
      }
      .floating-ui-container.has-custom-position {
          bottom: auto;
          right: auto;
      }
      .floating-ui-container.dragging {
          cursor: grabbing;
      }
      .floating-ui-container > * {
          pointer-events: auto;
      }
      .copy-thread-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #1DA1F2; /* Twitter Blue */
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 3;
          position: relative;
          touch-action: none;
      }
      .copy-thread-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .copy-thread-button.dragging {
          cursor: grabbing;
      }
      .copy-thread-button:not(.dragging) {
          cursor: grab;
      }
      .copy-thread-button.success { background-color: #4CAF50; }
      .copy-thread-button.ready {
          background-color: #FFC400;
          box-shadow: 0 4px 18px rgba(255, 196, 0, 0.55);
          animation: copy-ready-pulse 1.8s ease-in-out infinite;
      }
      .copy-thread-button.ready::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(255, 232, 124, 0.0);
          box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          opacity: 0.7;
          pointer-events: none;
          animation: copy-ready-wave 1.8s ease-out infinite;
      }
      .copy-thread-button.loading svg { animation: spinning 1.5s linear infinite; }
      .copy-thread-button svg { display: block; }
      .control-panel-container {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
          order: 1;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      }
      .control-panel-container.hover-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(8px);
      }
      .floating-ui-container.show-hover-controls .control-panel-container.hover-hidden {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
      }
      .control-panel-container select, .control-panel-container input { margin-left: 8px; transform: scale(0.96); }
      .control-panel-container label { display: flex; align-items: center; white-space: nowrap; }
      .control-panel-container select { background-color: #333; color: white; border: 1px solid #666; border-radius: 4px; padding: 2px 4px; }
      .copy-thread-button .text {
          position: absolute;
          font-size: 12px;
          white-space: nowrap;
          top: -25px;
          background-color: #333;
          padding: 3px 8px;
          border-radius: 4px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
      }
      .copy-thread-button:hover .text { opacity: 1; visibility: visible; }
      @keyframes spinning { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes copy-ready-pulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(255, 196, 0, 0.45); }
          50% { box-shadow: 0 6px 24px rgba(255, 196, 0, 0.65); }
      }
      @keyframes copy-ready-wave {
          0% {
              transform: scale(1);
              opacity: 0.7;
              box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          }
          70% {
              transform: scale(1.55);
              opacity: 0;
              box-shadow: 0 0 0 18px rgba(255, 232, 124, 0);
          }
          100% {
              transform: scale(1.6);
              opacity: 0;
              box-shadow: 0 0 0 20px rgba(255, 232, 124, 0);
          }
      }
      .copy-toast {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.3s ease;
          pointer-events: none;
          order: 0;
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          will-change: transform, opacity;
      }
      .copy-toast.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
      }
      .toast-title { font-weight: bold; margin-bottom: 5px; }
      .toast-content { font-size: 13px; opacity: 0.9; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
      .start-point-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.1);
          border: 2px solid #1DA1F2;
          color: #1DA1F2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: auto;
          font-size: 14px;
          font-weight: bold;
      }
      ${e}:hover .start-point-button { opacity: 1; }
      .start-point-button:hover { background-color: rgba(29, 161, 242, 0.2); transform: scale(1.1); }
      .start-point-button.active { background-color: #1DA1F2; color: white; opacity: 1; }
      .start-point-button.active:hover { background-color: #1991DB; }
      ${e}.start-point-set { background-color: rgba(29, 161, 242, 0.05); border: 1px solid rgba(29, 161, 242, 0.2); border-radius: 8px; }
      .select-tweet-button {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.08);
          border: 2px solid rgba(29, 161, 242, 0.4);
          color: #1DA1F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          pointer-events: auto;
          opacity: 0;
          transition: all 0.3s ease;
      }
      ${e}:hover .select-tweet-button { opacity: 1; }
      .select-tweet-button:hover { transform: scale(1.1); }
      .select-tweet-button.active {
          background-color: #1DA1F2;
          color: white;
          border-color: #1DA1F2;
          opacity: 1;
      }
      ${e}.tweet-selected {
          background-color: rgba(29, 161, 242, 0.04);
          border: 1px solid rgba(29, 161, 242, 0.3);
          border-radius: 8px;
      }
      ${e}.tweet-selected.start-point-set {
          box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.12);
      }
      .reset-selection {
          padding: 8px 12px;
          background-color: #5e72e4;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 1;
      }
      .reset-selection.visible { opacity: 1; visibility: visible; }
      .reset-selection:hover { background-color: #4b5cd5; transform: scale(1.05); }
      .reset-start-point {
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 2;
      }
      .reset-start-point.visible { opacity: 1; visibility: visible; }
      .reset-start-point:hover { background-color: #ff5252; transform: scale(1.05); }
      .control-panel-container .settings-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.15);
          border: 1px solid rgba(29, 161, 242, 0.5);
          color: #1DA1F2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 4px;
      }
      .control-panel-container .settings-button:hover {
          background-color: rgba(29, 161, 242, 0.3);
          transform: scale(1.05);
          border-color: #1DA1F2;
      }
      .control-panel-container .settings-button svg {
          width: 18px;
          height: 18px;
      }
      .settings-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: none;
      }
      .settings-modal-overlay.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
      }
      .settings-modal {
          background-color: #1e1e1e;
          color: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          transform: scale(0.9);
          transition: transform 0.3s ease;
      }
      .settings-modal-overlay.visible .settings-modal {
          transform: scale(1);
      }
      .settings-modal h2 {
          margin: 0 0 20px 0;
          font-size: 24px;
          color: #1DA1F2;
      }
      .settings-modal h3 {
          margin: 16px 0 8px 0;
          font-size: 18px;
          color: #1DA1F2;
          border-bottom: 1px solid #333;
          padding-bottom: 4px;
      }
      .settings-modal label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #ccc;
      }
      .settings-modal input[type="text"],
      .settings-modal textarea {
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 16px;
          background-color: #2a2a2a;
          border: 1px solid #444;
          border-radius: 6px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
      }
      .settings-modal textarea {
          min-height: 80px;
          resize: vertical;
          font-family: monospace;
      }
      .settings-modal input[type="text"]:focus,
      .settings-modal textarea:focus {
          outline: none;
          border-color: #1DA1F2;
      }
      .settings-modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
      }
      .settings-modal button {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
      }
      .settings-modal .btn-save {
          background-color: #1DA1F2;
          color: white;
      }
      .settings-modal .btn-save:hover {
          background-color: #1991DB;
      }
      .settings-modal .btn-reset {
          background-color: #ff6b6b;
          color: white;
      }
      .settings-modal .btn-reset:hover {
          background-color: #ff5252;
      }
      .settings-modal .btn-cancel {
          background-color: #444;
          color: white;
      }
      .settings-modal .btn-cancel:hover {
          background-color: #555;
      }
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),c.selectedTweetIds=[],d.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll(m.article).forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let o=Array.from(t.children).find(r=>r.classList.contains("select-tweet-button"));o?o.dataset.tweetId||(o.dataset.tweetId=e):(o=document.createElement("button"),o.type="button",o.className="select-tweet-button",o.textContent="+",o.title="このツイートを選択",o.dataset.tweetId=e,o.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(o));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;c.selectedTweetIds.forEach((e,o)=>{t.set(e,o+1);}),document.querySelectorAll(m.article).forEach(e=>{const o=this.extractTweetId(e);if(!o)return;const r=e.querySelector(".select-tweet-button");if(r)if(t.has(o)){const s=t.get(o)??0;e.classList.add("tweet-selected"),r.classList.add("active"),r.textContent=s>0?s.toString():"✓",r.title=`選択中 (${s})`;}else e.classList.remove("tweet-selected"),r.classList.remove("active"),r.textContent="+",r.title="このツイートを選択";}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const o=c.selectedTweetIds.includes(e);o?c.selectedTweetIds=c.selectedTweetIds.filter(i=>i!==e):c.selectedTweetIds=[...c.selectedTweetIds,e],c.isSecondStage&&(c.isSecondStage=false),c.collectedThreadData=null;const r=c.selectedTweetIds.length,s=r>0?`${r}件選択中`:"選択をすべて解除しました";this.refreshSelectionIndicators(),this.updateMainButtonText(),o?this.showToast("選択解除",s):this.showToast("選択追加",s),d.log(`Selected tweet ids: ${c.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");c.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent="選択をリセット",t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){c.selectedTweetIds.length!==0&&(c.selectedTweetIds=[],c.isSecondStage&&(c.isSecondStage=false),c.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast("選択リセット","選択したツイートをすべて解除しました"),d.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">全て</option>
      <option value="first">最初のみ</option>
      <option value="shitaraba">4K(shitaraba)</option>
      <option value="5ch">2K(5ch)</option>
    `,e.value=c.copyMode,e.addEventListener("change",h=>{c.copyMode=h.target.value,d.log(`Copy mode changed to: ${c.copyMode}`);}),t.appendChild(e);const o=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.id="translate-checkbox",r.checked=c.translateEnabled,r.addEventListener("change",h=>{c.translateEnabled=h.target.checked,d.log(`Translation ${c.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(r),o.appendChild(document.createTextNode("翻訳")),t.appendChild(o);const s=document.createElement("label");s.textContent="翻訳プロバイダー:";const i=document.createElement("select");i.id="provider-select",i.innerHTML=`
      <option value="local">ローカルAI</option>
      <option value="google">Google翻訳</option>
      <option value="openai">OpenAI互換</option>
    `;const a=localStorage.getItem("translationProvider");a==="local"||a==="google"||a==="openai"?i.value=a:i.value="local",i.addEventListener("change",h=>{const g=h.target.value;localStorage.setItem("translationProvider",g),d.log(`Translation provider set to ${g}`);});const l=document.createElement("div");l.appendChild(s),l.appendChild(i),t.appendChild(l);const u=document.createElement("button");u.className="settings-button",u.type="button",u.title="設定",u.innerHTML=C.SETTINGS,u.addEventListener("click",()=>this.showSettingsModal()),t.appendChild(u),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),d.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title="スレッドをコピー",e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}c.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),d.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(c.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${C.LOADING}`;return}if(c.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${C.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),c.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${C.CLIPBOARD}`;return}const e=c.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">選択ツイート(${e})をコピー</span>${C.COPY}`;return}if(c.startFromTweetId){const o=c.startFromTweetText.length>20?c.startFromTweetText.substring(0,20)+"...":c.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${C.COPY}`;return}t.innerHTML=`<span class="text">スレッドをコピー</span>${C.COPY}`;}showToast(t,e){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${e.substring(0,100)}</div>
    `,o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll(m.article).forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const o=this.extractTweetId(t);if(!o)return;const r=document.createElement("button");r.className="start-point-button",r.textContent="★",r.title="この位置からコピー開始",r.dataset.tweetId=o,c.startFromTweetId===o&&(r.classList.add("active"),r.textContent="✓",t.classList.add("start-point-set")),r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,o);}),t.appendChild(r);});}setStartPoint(t,e){c.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector(m.userName)?.innerText??"",r=t.querySelector(m.tweetText)?.innerText??"";c.startFromTweetId=e,c.startFromTweetAuthor=o,c.startFromTweetText=r,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${o}のツイートを起点に設定しました`),d.log(`Start point set: ${e} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");c.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){c.startFromTweetId=null,c.startFromTweetAuthor="",c.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),d.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const o=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},r=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,o();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const l=a.relatedTarget;l&&t.contains(l)||r();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",o),t.addEventListener("focusout",a=>{const l=a.relatedTarget;l&&t.contains(l)||r();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return d.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const r=this.ensureFloatingContainer(),s=r.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},r.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(i){d.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const r=this.floatingContainer;if(!r)return;const s=o.clientX-this.dragState.startX,i=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,r.classList.add("has-custom-position"),r.style.bottom="auto",r.style.right="auto";}const a=this.dragState.initialTop+i,l=this.dragState.initialLeft+s,{top:u,left:h}=this.clampPosition(a,l,r);this.applyPosition(u,h,r);});const e=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,o){const s=o.offsetHeight||0,i=o.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),l=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),l)}}applyPosition(t,e,o){const r=o??this.ensureFloatingContainer();r.style.top=`${t}px`,r.style.left=`${e}px`,r.style.bottom="auto",r.style.right="auto",r.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(d.warn("stored position is invalid",e),null)}catch(t){return d.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){d.warn("failed to save UI position",t);}}showSettingsModal(){if(this.settingsModal){this.settingsModal.classList.add("visible");return}const t=document.createElement("div");t.className="settings-modal-overlay";const e=document.createElement("div");e.className="settings-modal";const o=U();if(e.innerHTML=`
      <h2>翻訳設定</h2>
      
      <h3>ローカルAI設定</h3>
      <label>APIエンドポイント</label>
      <input type="text" id="local-ai-endpoint" value="${this.escapeHtml(o.localAiEndpoint)}" />
      
      <label>システムプロンプト</label>
      <textarea id="local-ai-system-prompt">${this.escapeHtml(o.localAiSystemPrompt)}</textarea>
      
      <h3>OpenAI互換設定</h3>
      <label>APIエンドポイント</label>
      <input type="text" id="openai-endpoint" value="${this.escapeHtml(o.openaiEndpoint)}" />
      
      <label>モデル名</label>
      <input type="text" id="openai-model" value="${this.escapeHtml(o.openaiModel)}" />
      
      <label>システムプロンプト</label>
      <textarea id="openai-system-prompt">${this.escapeHtml(o.openaiSystemPrompt)}</textarea>
      
      <label>APIキー</label>
      <input type="text" id="openai-api-key" value="${this.escapeHtml(o.openaiApiKey)}" placeholder="常に必要なので必ず入力してください" />
      
      <div class="settings-modal-buttons">
        <button class="btn-reset" type="button">リセット</button>
        <button class="btn-cancel" type="button">キャンセル</button>
        <button class="btn-save" type="button">保存</button>
      </div>
    `,t.appendChild(e),!this.shadowRoot)return;this.shadowRoot.appendChild(t),this.settingsModal=t;const r=e.querySelector(".btn-save"),s=e.querySelector(".btn-cancel"),i=e.querySelector(".btn-reset");r&&r.addEventListener("click",()=>{const a={localAiEndpoint:e.querySelector("#local-ai-endpoint")?.value??o.localAiEndpoint,localAiSystemPrompt:e.querySelector("#local-ai-system-prompt")?.value??o.localAiSystemPrompt,openaiEndpoint:e.querySelector("#openai-endpoint")?.value??o.openaiEndpoint,openaiModel:e.querySelector("#openai-model")?.value??o.openaiModel,openaiSystemPrompt:e.querySelector("#openai-system-prompt")?.value??o.openaiSystemPrompt,openaiApiKey:e.querySelector("#openai-api-key")?.value??o.openaiApiKey};nt(a),this.hideSettingsModal(),this.showToast("設定保存","設定を保存しました");}),s&&s.addEventListener("click",()=>{this.hideSettingsModal();}),i&&i.addEventListener("click",()=>{confirm("設定をデフォルトに戻しますか？")&&(xt(),this.hideSettingsModal(),this.showToast("設定リセット","設定をデフォルトに戻しました"));}),t.addEventListener("click",a=>{a.target===t&&this.hideSettingsModal();}),requestAnimationFrame(()=>{t.classList.add("visible");}),d.log("Settings modal opened");}hideSettingsModal(){this.settingsModal&&(this.settingsModal.classList.remove("visible"),setTimeout(()=>{this.settingsModal?.remove(),this.settingsModal=null;},300),d.log("Settings modal closed"));}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}const x=new Tt;var vt=typeof GM_notification<"u"?GM_notification:void 0,St=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Ct=St;function At(n,t,e,o){vt({text:n,title:t,image:e,onclick:o});}const Et="https://twitter.com",Lt="https://t.co",It="https://video.twimg.com",F=n=>`${Et}/i/status/${n}`,Pt=n=>`${It}/tweet_video/${n}.mp4`,Mt=/https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/,$t=`${Lt}/`,kt="https://translate.googleapis.com/translate_a/single";async function Rt(){try{const n=[],t=new Set;let e="",o="";const r=window.location.href,s=c.copyMode==="first";let i=!1;const a=window.scrollY;async function l(){if(i)return;const h=Array.from(document.querySelectorAll(m.article));h.length>0&&!e&&(e=B(h[0]),o=O(h[0]));for(const g of h){const b=g.querySelector(m.statusLink);if(!b)continue;const f=b.href.split("/"),p=f.indexOf("status");if(p===-1||p+1>=f.length)continue;const w=f[p+1].split("?")[0];if(t.has(w))continue;const y=B(g);if(e&&y!==e)continue;let T=O(g);y===e&&!T&&o&&(T=o);const L=g.querySelector(m.tweetText);let _="";L&&(_=await ot(L));const N=g.querySelector("time"),H=N?N.getAttribute("datetime"):"",st=H?Ft(new Date(H)):"",at=qt(g),lt=await Ut(g),ct=t.size===0?r:b.href?b.href.split("?")[0]:"";if(n.push({id:w,author:y,handle:T,text:_,time:st,url:ct,mediaUrls:at,quotedTweet:lt}),t.add(w),s){i=!0;break}}}async function u(){try{if(await G(),await l(),i)return;let b=n.length,f=0;for(let p=0;p<30;p++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(w=>setTimeout(w,700)),await G(),await l(),i)return;if(n.length===b){if(f++,f>=3)break}else b=n.length,f=0;}catch(w){d.error(`スクロール処理エラー (試行 ${p+1}): ${w.message}`);continue}try{window.scrollTo(0,a);}catch(p){d.error(`スクロール位置復元エラー: ${p.message}`);}}catch(b){throw d.error(`スクロール収集処理エラー: ${b.message}`),b}}return await u(),n.sort((h,g)=>{const b=new Date(h.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),f=new Date(g.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return b.getTime()-f.getTime()}),n}catch(n){return d.error(`ツイート収集中にエラーが発生: ${n.message}`),d.error(`エラースタック: ${n.stack}`),[]}}function O(n){try{const e=Array.from(n.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const o=Array.from(n.querySelectorAll(m.userLink));for(const s of o)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const r=n.querySelector(m.userName);if(r){const s=r.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return d.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function B(n){try{const t=n.querySelector(m.userNameLinkSpan);return t&&t.textContent?t.textContent.trim():""}catch(t){return d.error(`ユーザー名取得エラー: ${t.message}`),""}}async function Ut(n){const t=n.querySelector(m.quotedLink);let e=null;if(t)try{const o=t.closest(m.roleLink);o&&(e=await D(o));}catch(o){d.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=n.innerText||"",r=o.includes("引用")||o.includes("Quote")||o.includes("quote"),s=n.querySelectorAll(m.roleLink);if(s.length>0&&r)for(let i=0;i<s.length;i++){const a=s[i],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const u=await D(a);if(u&&u.author&&u.text){e=u;break}}catch(u){d.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(o){d.error(`代替引用ツイート検索エラー: ${o.message}`);}return e}async function D(n){const t=n.querySelector(m.quotedAuthor),e=t?t.textContent.trim():"",o=n.querySelector(m.quotedHandle),r=o?o.textContent.trim():"";let s="";const i=n.querySelector(m.tweetText);if(i)s=await ot(i);else {const f=(n.innerText||"").split(`
`).map(y=>y.trim()).filter(y=>y);let p=-1;for(let y=0;y<f.length;y++)if(f[y].includes(r)){p=y;break}const w=p+1;p>=0&&w<f.length&&(s=f.slice(w+1).join(`
`));}const a=[];n.querySelectorAll(m.tweetPhoto).forEach(b=>{const f=b.querySelector(m.tweetMediaImage);if(f){const p=A(f.src);p&&!a.includes(p)&&a.push(p);}}),a.length===0&&(n.querySelectorAll(m.roleGroup).forEach(p=>{p.querySelectorAll(m.tweetMediaImage).forEach(y=>{const T=A(y.src);T&&!a.includes(T)&&a.push(T);});}),n.querySelectorAll(m.tweetMediaImage).forEach(p=>{const w=A(p.src);w&&!a.includes(w)&&a.push(w);}));let u="",h="";const g=n.querySelectorAll(m.statusLink);for(const b of Array.from(g)){const f=b.href;if(f&&f.includes("/status/")){const p=f.split("/"),w=p.indexOf("status");if(w!==-1&&w+1<p.length){u=p[w+1].split("?")[0],h=f;break}}}return e&&s?{author:e,handle:r,text:s,id:u,url:h,mediaUrls:a}:null}function qt(n){const t=[];return n.querySelectorAll(m.tweetPhoto).forEach(r=>{const s=r.querySelector(m.tweetMediaImage);if(s){const i=A(s.src);i&&!t.includes(i)&&t.push(i);}}),n.querySelectorAll("video").forEach(r=>{if(r.src&&r.src.startsWith("blob:"))try{if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=z(r.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=n.querySelector(m.statusLink);if(i){const a=i.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const u=a[l+1].split("?")[0],h=F(u);t.includes(h)||t.push(`[動画] ${h}`);}}}catch(i){d.error("Error processing blob URL: "+i);}else {if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=z(r.poster);i&&!t.includes(i)&&t.push(i);}r.src&&r.src.includes("video.twimg.com")&&(t.includes(r.src)||t.push(r.src));}r.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=n.querySelector(m.statusLink);if(a){const l=a.href.split("/"),u=l.indexOf("status");if(u!==-1&&u+1<l.length){const h=l[u+1].split("?")[0],g=F(h);t.includes(g)||t.push(`[動画] ${g}`);}}}});}),t.length===0&&n.querySelectorAll(m.roleGroup).forEach(s=>{s.querySelectorAll(m.tweetMediaImage).forEach(a=>{const l=A(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&n.querySelectorAll(m.tweetMediaImage).forEach(s=>{const i=A(s.src);i&&!t.includes(i)&&t.push(i);}),t}function A(n){if(!n||typeof n!="string"||!n.includes("pbs.twimg.com/media"))return null;try{const t=n.match(/format=([^&]+)/),e=t?t[1]:"jpg",o=n.split("?")[0];if(!o||o.length===0)return d.error(`無効なベースURL: ${n}`),null;const r=o+"."+e;try{return new URL(r),r}catch(s){return d.error(`無効なURL形式: ${r}, エラー内容: ${s.message}`),null}}catch(t){return d.error(`メディアURL処理エラー: ${t.message}`),null}}function z(n){if(!n||!n.includes("tweet_video_thumb"))return null;try{const t=n.match(/tweet_video_thumb\/([^.]+)/);if(!t||!t[1])return null;const e=t[1];return Pt(e)}catch(t){return d.error(`動画URL生成エラー: ${t.message}`),null}}async function ot(n){try{const t=n.cloneNode(!0);return await _t(t)}catch(t){return d.error(`ツイートテキスト取得エラー: ${t.message}`),n.innerText??""}}async function _t(n){const t=Array.from(n.querySelectorAll("a[href]")),e=[];for(const o of t)if(Ht(o,o.textContent??"")){const r=o.getAttribute("href");r&&r.startsWith($t)&&e.push(Nt(r).then(s=>({anchor:o,resolvedUrl:s})));}if(e.length>0){const o=await Promise.all(e);for(const{anchor:r,resolvedUrl:s}of o)if(s){const i=document.createTextNode(s);r.replaceWith(i);}}return n.innerText}function Nt(n){return new Promise(t=>{Ct({method:"HEAD",url:n,timeout:1e4,onload:e=>{t(e.finalUrl||n);},onerror:()=>{t(n);},ontimeout:()=>{t(n);}});})}function Ht(n,t){const e=t.trim();return /^https?:\/\//i.test(e)||n.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(n.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function G(){try{const n=document.querySelectorAll(m.tweetButtonsWithinArticle);let t=0;for(const e of Array.from(n))try{const o=e.textContent?e.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest(m.tweetRoot)&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(o){d.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(n){return d.error(`ツイート展開処理エラー: ${n.message}`),0}}function Ft(n){const t=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0"),r=String(n.getHours()).padStart(2,"0"),s=String(n.getMinutes()).padStart(2,"0");return `${t}年${e}月${o}日 ${r}:${s}`}const V=150,Ot=.9144,Bt=.453592,Dt=3.78541,k="[0-9０-９]",zt=`${k}{1,3}(?:[,，]${k}{3})*`,Gt=`${k}+`,Vt=`(?:[\\.．]${k}+)?`,W=`(?:${zt}|${Gt})${Vt}`,Y="(?:兆|億|万)",S=`${W}(?:${Y}${W})*${Y}?`,Wt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<currencyPrefix>米|US|ＵＳ)?ドル`,"gu"),Yt=new RegExp(`(?<symbol>(?:US\\$|ＵＳ\\$|\\$))\\s*(?<amount>${S})(?!\\s*(?:米|US|ＵＳ)?ドル)`,"gu"),Kt=new RegExp(`(?<amount>${S})\\s*ヤード`,"gu"),Xt=new RegExp(`(?<amount>${S})\\s*ポンド`,"gu"),jt=new RegExp(`(?<amount>${S})\\s*ガロン`,"gu"),Jt=new RegExp(`(?<amount>${S})\\s*(?<unit>(?:[kKｋＫmMｍＭgGｇＧtTｔＴ]?[wWｗＷ]|(?:キロ|メガ|ギガ|テラ)ワット))(?![A-Za-zａ-ｚＡ-Ｚ])`,"gu"),Qt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<unit>[kKｋＫmMｍＭgGｇＧtTｔＴbBｂＢ])(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu"),Zt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<unit>ミリオン|ビリオン|トリリオン|キロ|メガ|ギガ|テラ|million|Million|billion|Billion|trillion|Trillion|kilo|Kilo|mega|Mega|giga|Giga|tera|Tera)(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu");function te(n){if(!n||n.length===0)return n;let t=n;return t=v(t,Wt,["円","JPY"],e=>X(e*V)),t=v(t,Yt,["円","JPY"],e=>X(e*V)),t=v(t,Kt,["メートル","m","ｍ"],e=>`${q(e*Ot)}メートル`),t=v(t,Xt,["キログラム","kg","㎏","キロ"],e=>`${q(e*Bt)}キログラム`),t=v(t,jt,["リットル","l","L","ℓ"],e=>`${q(e*Dt)}リットル`),t=v(t,Jt,["ワット","W","w","Ｗ","ｗ"],(e,o,r)=>{const s=o.unit??"";if(ae(r))return null;const i=se(s);if(i===null)return null;const a=e*i;return $(a,"ワット")}),t=v(t,Qt,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=j(s);return i===null||K(s,r)?null:$(e*i)}),t=v(t,Zt,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=j(s);return i===null||K(s,r)?null:$(e*i)}),t}function v(n,t,e,o){const r=[...n.matchAll(t)];if(r.length===0)return n;let s="",i=0;for(const a of r){const l=a.index??0,u=l+a[0].length,h=n.slice(i,l);s+=h;const g=a.groups??{},b=g.amount??"",f=re(b),p=ee(n,u);if(f===null){s+=a[0],p?(s+=p.whitespace+p.openChar+p.inside+p.closeChar,i=p.endIndex):i=u;continue}if(p&&e.some(T=>p.inside.includes(T))){s+=a[0],s+=p.whitespace+p.openChar+p.inside+p.closeChar,i=p.endIndex;continue}const y=o(f,g,{text:n,match:a,startIndex:l,endIndex:u,followingParentheses:p});if(y===null){s+=a[0],p?(s+=p.whitespace+p.openChar+p.inside+p.closeChar,i=p.endIndex):i=u;continue}if(p){const T=p.inside.trim(),L=T.length>0?`${y}、${T}`:y;s+=a[0]+p.whitespace+p.openChar+L+p.closeChar,i=p.endIndex;}else s+=`${a[0]}（${y}）`,i=u;}return s+=n.slice(i),s}function ee(n,t){let e=t,o="";for(;e<n.length;){const l=n[e];if(oe(l)){o+=l,e+=1;continue}break}if(e>=n.length)return null;const r=n[e];if(r!=="("&&r!=="（")return null;const s=r==="("?")":"）",i=ne(n,e,r,s);if(i===-1)return null;const a=n.slice(e+1,i);return {whitespace:o,openChar:r,closeChar:s,inside:a,endIndex:i+1}}function ne(n,t,e,o){let r=0;for(let s=t;s<n.length;s+=1){const i=n[s];if(i===e)r+=1;else if(i===o&&(r-=1,r===0))return s}return  -1}function oe(n){return /\s/u.test(n)}function K(n,t){if(!le(n))return  false;const e=t.text.slice(t.endIndex,t.endIndex+6);return /^(?:バイト|ビット|ヘルツ|メートル|リットル|グラム|ワット|ジュール|パスカル|ボルト|アンペア)/u.test(e)}function re(n){if(!n)return null;const t=n.replace(/[０-９]/gu,a=>String.fromCharCode(a.charCodeAt(0)-65248)).replace(/[，]/gu,",").replace(/[．]/gu,".").replace(/,/gu,"").replace(/\s+/gu,"");if(t.length===0)return null;const e=/(\d+(?:\.\d+)?)(兆|億|万)?/gu;let o=0,r=false,s=null,i;for(;(i=e.exec(t))!==null;){if(i[0].length===0)continue;const a=Number.parseFloat(i[1]);if(Number.isNaN(a))return null;r=true;const l=i[2];l?o+=a*ie(l):s=a;}return r?(s!==null&&(o+=s),o):null}function ie(n){switch(n){case "万":return 1e4;case "億":return 1e8;case "兆":return 1e12;default:return 1}}function $(n,t=""){const e=Math.abs(n),o=[{threshold:1e12,divisor:1e12,suffix:`兆${t}`},{threshold:1e8,divisor:1e8,suffix:`億${t}`},{threshold:1e4,divisor:1e4,suffix:`万${t}`}];for(const r of o)if(e>=r.threshold){const s=n/r.divisor;return `${E(s)}${r.suffix}`}return t.length>0?`${E(n)}${t}`:E(n)}function X(n){return $(n,"円")}function q(n){return Math.abs(n)<1?E(n,3):E(n,2)}function E(n,t){const e=Math.abs(n);let o=t;o===void 0&&(e>=100?o=0:e>=10?o=1:e>=1?o=2:o=3);const r=Number.isFinite(n)?Number.parseFloat(n.toFixed(o)):0;return new Intl.NumberFormat("ja-JP",{maximumFractionDigits:o,minimumFractionDigits:0}).format(r)}function se(n){if(!n)return null;const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\s+/gu,"");if(t.length===0)return null;const e=t.toUpperCase(),o=t[0];if(e==="KW"&&(o==="K"||o==="k"))return 1e3;if(e==="MW"&&o==="M")return 1e6;if(e==="GW"&&o==="G")return 1e9;if(e==="TW"&&o==="T")return 1e12;if(e==="W"&&(o==="W"||o==="w"))return 1;switch(t){case "ワット":return 1;case "キロワット":return 1e3;case "メガワット":return 1e6;case "ギガワット":return 1e9;case "テラワット":return 1e12;default:return null}}function ae(n){return n.text.slice(n.endIndex,n.endIndex+1)==="時"}function j(n){switch(n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase()){case "k":case "kilo":case "キロ":return 1e3;case "m":case "mega":case "million":case "ミリオン":case "メガ":return 1e6;case "b":case "billion":case "g":case "giga":case "ビリオン":case "ギガ":return 1e9;case "t":case "tera":case "trillion":case "テラ":case "トリリオン":return 1e12;default:return null}}function le(n){const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase();return t==="k"||t==="kilo"||t==="キロ"||t==="m"||t==="mega"||t==="メガ"||t==="g"||t==="giga"||t==="ギガ"||t==="t"||t==="tera"||t==="テラ"}const ce=kt,de=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function ue(){const n=localStorage.getItem("translationProvider");return n==="local"||n==="google"||n==="openai"?n:"local"}async function pe(n){const t=n.map(Te),e=t.map(i=>({tweet:i,textSegments:Z(i.text),quotedSegments:i.quotedTweet?Z(i.quotedTweet.text):null})),o=[];let r=false;for(const i of e){for(const a of i.textSegments)J(a,o);if(i.quotedSegments)for(const a of i.quotedSegments)J(a,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<o.length;i++){const a=o[i];try{const{text:u,provider:h}=await fe(a.original),g=h==="none"?u:te(u);a.translated=g,h==="local"&&(r=!0),!s&&g!==a.original&&(s=!0);}catch(u){d.error(`セグメント翻訳に失敗: ${u.message}`),a.translated=a.original;}i<o.length-1&&await it(1e3+Math.random()*500);}for(const i of e)i.tweet.text=Q(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=Q(i.quotedSegments));return r&&At("ローカルAIでの翻訳が完了しました。","Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function J(n,t){if(n.kind==="text"){if(n.original.trim().length===0){n.translated=n.original;return}t.push(n);}}function Q(n){if(n.length===0)return "";let t="";for(const e of n)if(e.kind==="fixed"){const o=e.value;rt(o)&&(t=me(t)),t+=o;}else t+=e.translated??e.original;return t}function Z(n){if(!n)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let o=0,r;for(;(r=t.exec(n))!==null;)r.index>o&&e.push({kind:"text",original:n.slice(o,r.index)}),e.push({kind:"fixed",value:he(r[0])}),o=r.index+r[0].length;return o<n.length&&e.push({kind:"text",original:n.slice(o)}),e.length===0&&e.push({kind:"text",original:n}),e}function he(n){if(rt(n)){const t=ge(n);return t.length>0?t:n}return n}function rt(n){return /^https?:\/\//i.test(n.trim())}function ge(n){return n.replace(de,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function me(n){return n.length===0?n:n.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function fe(n){if(n.trim().length===0)return {text:n,provider:"none"};const t=ue();if(t==="local"){const e=await be(n);return e?{text:e,provider:"local"}:{text:n,provider:"none"}}if(t==="google")try{return {text:await we(n),provider:"google"}}catch(e){return d.error(`Google翻訳にも失敗しました: ${e.message}`),{text:n,provider:"none"}}if(t==="openai"){ye();const e=await xe(n);return e?{text:e,provider:"openai"}:{text:n,provider:"none"}}return {text:n,provider:"none"}}async function be(n){try{const t=U(),e=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${n}
<|plamo:op|>output lang=ja`,o=await new Promise((i,a)=>{GM_xmlhttpRequest({method:"POST",url:t.localAiEndpoint,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:t.localAiSystemPrompt},{role:"user",content:e}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:l=>l.status>=200&&l.status<300?i(l):a(new Error(`API error: ${l.status}`)),onerror:l=>a(l),ontimeout:()=>a(new Error("Timeout"))});}),s=JSON.parse(o.responseText)?.choices?.[0]?.message?.content;if(s&&s.trim().length>0)return d.log("ローカルAIでの翻訳に成功しました。"),s;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return d.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function we(n){const t="auto";let o=0;const r=3;for(;o<r;)try{const s=`${ce}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(n)}`,i=await new Promise((u,h)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:g=>g.status>=200&&g.status<300?u(g):h(new Error(`API error: ${g.status}`)),onerror:g=>h(g),ontimeout:()=>h(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(u=>u?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(s){if(o++,d.error(`Google翻訳試行 ${o}/${r} 失敗: ${s.message}`),o>=r)throw s;await it(1e3*Math.pow(2,o));}throw new Error("Google翻訳に失敗しました。")}function ye(){U().openaiApiKey||d.warn("OpenAI互換 APIキーが設定されていません。設定画面から設定してください。");}async function xe(n){const t=U();if(!t.openaiEndpoint)return d.error("OpenAI互換 APIエンドポイントが設定されていません。"),null;try{const e={"Content-Type":"application/json"};t.openaiApiKey&&(e.Authorization=`Bearer ${t.openaiApiKey}`);const o=await fetch(t.openaiEndpoint,{method:"POST",headers:e,body:JSON.stringify({model:t.openaiModel,messages:[{role:"system",content:t.openaiSystemPrompt},{role:"user",content:n}],temperature:0})});if(!o.ok)throw new Error(`API error: ${o.status}`);const s=(await o.json())?.choices?.[0]?.message?.content;if(s&&s.trim().length>0)return d.log("OpenAI互換での翻訳に成功しました。"),s;throw new Error("OpenAI Compatible translation result is empty")}catch(e){return d.error(`OpenAI互換翻訳に失敗: ${e.message}`),null}}function Te(n){return {...n,mediaUrls:[...n.mediaUrls],quotedTweet:n.quotedTweet?{...n.quotedTweet,mediaUrls:[...n.quotedTweet.mediaUrls]}:null}}async function it(n){await new Promise(t=>setTimeout(t,n));}function R(n){let t=`${n.author} ${n.handle}
${n.text}
${n.time}
`;if(n.url&&(t+=`${n.url}
`),n.mediaUrls.length>0&&(t+=n.mediaUrls.join(`
`)+`
`),n.quotedTweet){const e=n.quotedTweet;t+=`
> 引用元: ${e.author} ${e.handle}
`,t+=`> ${e.text.replace(/\n/g,`
> `)}
`,e.mediaUrls.length>0&&(t+=`> ${e.mediaUrls.join(`
> `)}
`),t+=`> ${e.url}
`;}return t}function ve(n,t){if(!n||n.length===0)return "";let e="";const o=`

---

`;for(let r=0;r<n.length;r++){const s=n[r],i=R(s),a=r===0?i:o+i;if(e.length+a.length>t){const l=t-e.length;l>o.length&&(e+=a.substring(0,l-3)+"...");break}e+=a;}return e}const Se=/https?:\/\/[^\s]+/g;class Ce{hasThreadUrlIncluded=false;remainingMediaSlots=5;consumeThreadUrl(t){return !t||this.hasThreadUrlIncluded?null:(this.hasThreadUrlIncluded=true,t)}consumeMediaUrls(t){if(this.remainingMediaSlots<=0)return [];const o=t.filter(r=>r.trim().length>0).slice(0,this.remainingMediaSlots);return this.remainingMediaSlots-=o.length,o}}function tt(n){if(!n)return "";const e=n.replace(Se,"").replace(/[ \t]+\n/g,`
`).split(`
`).map(o=>o.replace(/[ \t]{2,}/g," ").trim());for(let o=e.length-1;o>=0&&e[o]==="";o--)e.pop();return e.join(`
`)}function Ae(n,t){const e=[];e.push(`${n.author} ${n.handle}`);const o=tt(n.text);o.length>0?e.push(o):e.push(""),e.push(n.time);const r=t.consumeThreadUrl(n.url);r&&e.push(r);const s=t.consumeMediaUrls(n.mediaUrls);if(s.length>0&&e.push(...s),n.quotedTweet){const{quotedTweet:i}=n;if(i){const a=[];a.push(`> 引用元: ${i.author} ${i.handle}`);const l=tt(i.text);l.length>0&&a.push(...l.split(`
`).map(h=>`> ${h}`));const u=t.consumeMediaUrls(i.mediaUrls);u.length>0&&a.push(...u.map(h=>`> ${h}`)),a.length>0&&(e.push(""),e.push(...a));}}return `${e.join(`
`)}
`}function Ee(n,t){if(!n||n.length===0)return "";const e=new Ce;let o="";const r=`

---

`;for(let s=0;s<n.length;s++){const i=n[s],a=Ae(i,e),l=s===0?a:r+a;if(o.length+l.length>t){const u=t-o.length;u>r.length&&(o+=l.substring(0,u-3)+"...");break}o+=l;}return o}function Le(n){if(!n||n.length===0)return "";let t=R(n[0]);for(let e=1;e<n.length;e++)t+=`

---

`+R(n[e]);return t}function Ie(n,t,e,o=null){let r="";if(o&&(r+=`${o}のツイートから`),n.length>0){const s=n[0].author;r+=`${s}のスレッド`;}return r+=`(${n.length}件)をコピーしました。`,r+=`文字数: ${Pe(t.length)}`,(e==="shitaraba"||e==="5ch")&&(r+=`/${e==="shitaraba"?4096:2048}`),r}function Pe(n){return n<1e3?n.toString():n<1e4?(n/1e3).toFixed(1)+"k":Math.round(n/1e3)+"k"}async function Me(n){if(!n||!n.formattedText){const o=n?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return d.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー",o),false}if(n.formattedText.trim().length===0)return d.error("クリップボードコピー失敗: formattedTextが空です"),x.showToast("エラー","コピーするテキストが空です"),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([n.formattedText],{type:"text/plain"}),r=new window.ClipboardItem({"text/plain":o});await navigator.clipboard.write([r]),t=!0;}catch(o){e=o,d.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(n.formattedText),t=!0;}catch(o){e=o,d.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=n.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){e=o,d.error(`execCommand fallback失敗: ${e.message}`);}if(t)x.showToast("コピーしました",n.summary);else {const o=e?e.message:"不明なエラー";d.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class $e{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),d.log("Application initialized.");}catch(t){d.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){c.collectedThreadData&&(await Me(c.collectedThreadData),c.isSecondStage=!1,c.collectedThreadData=null,x.updateMainButtonText());return}if(c.isCollecting)return;c.isCollecting=!0,x.updateMainButtonText();try{const e=await Rt();let o=e;const r=c.selectedTweetIds??[];if(r.length>0){const u=new Map(e.map(g=>[g.id,g])),h=[];for(const g of r){const b=u.get(g);b&&h.push(b);}if(o=h,o.length===0){d.warn("選択済みツイートを取得できませんでした。"),c.collectedThreadData=null,c.isSecondStage=!1,x.showToast("選択エラー","選択したツイートが見つかりませんでした。再度読み込みしてください。");return}}else if(c.startFromTweetId){const u=e.findIndex(h=>h.id===c.startFromTweetId);u!==-1&&(o=e.slice(u));}let s="",i=o,a=!1;if(o.length>0){if(c.translateEnabled)try{c.translationInProgress=!0,x.updateMainButtonText(),x.showToast("翻訳中","翻訳処理を実行しています...");const u=await pe(o);i=u.tweets,a=u.hasTranslation;}catch(u){d.error(`Translation error: ${u}`),x.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=o,a=!1;}finally{c.translationInProgress=!1;}switch(c.copyMode){case "first":s=R(i[0]);break;case "shitaraba":s=Ee(i,4096);break;case "5ch":s=ve(i,2048);break;default:s=Le(i);break}}let l=Ie(o,s,c.copyMode,r.length===0?c.startFromTweetAuthor:null);c.translateEnabled&&a&&s.trim().length>0&&(l+=" (翻訳済み)"),c.collectedThreadData={formattedText:s,summary:l},c.isSecondStage=!0,x.showToast("準備完了",`${l} クリックしてコピーしてください`);}catch(e){d.error(`Error in copy process: ${e}`),x.showToast("エラー","スレッドのコピーに失敗しました");}finally{c.isCollecting=!1,c.translationInProgress=!1,x.updateMainButtonText();}}catch(e){d.error(`Button click handler error: ${e}`),x.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(x.init(),x.addMainButton(this.handleButtonClick.bind(this)),x.updateAllUI()):x.destroy();}isTwitterStatusPage(){return Mt.test(location.href)}observeUrlChanges(){let t=location.href;const e=i=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${i}): ${t}`));},o=history.pushState;history.pushState=function(...i){o.apply(this,i),e("pushState");};const r=history.replaceState;history.replaceState=function(...i){r.apply(this,i),e("replaceState");},window.addEventListener("popstate",()=>e("popstate")),new MutationObserver(()=>e("mutation")).observe(document.body,{childList:true,subtree:true});}}new $e;

})();