// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.8.0
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

    const S="[TwitterThreadCopier]",c={log:r=>{console.log(S,r);},error:r=>{console.error(S,r);},warn:(r,t)=>{t?console.warn(S,r,t):console.warn(S,r);}};function W(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const l=W();var Y="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",j="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",Q="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function L(r,t=24){const e=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${r}"></path></svg>`}const T={LOADING:L(Q),CLIPBOARD:L(Y),COPY:L(j)};class X{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
      article[data-testid="tweet"]:hover .start-point-button { opacity: 1; }
      .start-point-button:hover { background-color: rgba(29, 161, 242, 0.2); transform: scale(1.1); }
      .start-point-button.active { background-color: #1DA1F2; color: white; opacity: 1; }
      .start-point-button.active:hover { background-color: #1991DB; }
      article[data-testid="tweet"].start-point-set { background-color: rgba(29, 161, 242, 0.05); border: 1px solid rgba(29, 161, 242, 0.2); border-radius: 8px; }
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
      article[data-testid="tweet"]:hover .select-tweet-button { opacity: 1; }
      .select-tweet-button:hover { transform: scale(1.1); }
      .select-tweet-button.active {
          background-color: #1DA1F2;
          color: white;
          border-color: #1DA1F2;
          opacity: 1;
      }
      article[data-testid="tweet"].tweet-selected {
          background-color: rgba(29, 161, 242, 0.04);
          border: 1px solid rgba(29, 161, 242, 0.3);
          border-radius: 8px;
      }
      article[data-testid="tweet"].tweet-selected.start-point-set {
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),l.selectedTweetIds=[],c.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let o=Array.from(t.children).find(n=>n.classList.contains("select-tweet-button"));o?o.dataset.tweetId||(o.dataset.tweetId=e):(o=document.createElement("button"),o.type="button",o.className="select-tweet-button",o.textContent="+",o.title="このツイートを選択",o.dataset.tweetId=e,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(o));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;l.selectedTweetIds.forEach((e,o)=>{t.set(e,o+1);}),document.querySelectorAll('article[data-testid="tweet"]').forEach(e=>{const o=this.extractTweetId(e);if(!o)return;const n=e.querySelector(".select-tweet-button");if(n)if(t.has(o)){const s=t.get(o)??0;e.classList.add("tweet-selected"),n.classList.add("active"),n.textContent=s>0?s.toString():"✓",n.title=`選択中 (${s})`;}else e.classList.remove("tweet-selected"),n.classList.remove("active"),n.textContent="+",n.title="このツイートを選択";}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const o=l.selectedTweetIds.includes(e);o?l.selectedTweetIds=l.selectedTweetIds.filter(i=>i!==e):l.selectedTweetIds=[...l.selectedTweetIds,e],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null;const n=l.selectedTweetIds.length,s=n>0?`${n}件選択中`:"選択をすべて解除しました";this.refreshSelectionIndicators(),this.updateMainButtonText(),o?this.showToast("選択解除",s):this.showToast("選択追加",s),c.log(`Selected tweet ids: ${l.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");l.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent="選択をリセット",t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){l.selectedTweetIds.length!==0&&(l.selectedTweetIds=[],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast("選択リセット","選択したツイートをすべて解除しました"),c.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">全て</option>
      <option value="first">最初</option>
      <option value="shitaraba">4K</option>
      <option value="5ch">2K</option>
    `,e.value=l.copyMode,e.addEventListener("change",s=>{l.copyMode=s.target.value,c.log(`Copy mode changed to: ${l.copyMode}`);}),t.appendChild(e);const o=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=l.translateEnabled,n.addEventListener("change",s=>{l.translateEnabled=s.target.checked,c.log(`Translation ${l.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(n),o.appendChild(document.createTextNode("翻訳")),t.appendChild(o),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title="スレッドをコピー",e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}l.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(l.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${T.LOADING}`;return}if(l.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${T.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),l.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${T.CLIPBOARD}`;return}const e=l.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">選択ツイート(${e})をコピー</span>${T.COPY}`;return}if(l.startFromTweetId){const o=l.startFromTweetText.length>20?l.startFromTweetText.substring(0,20)+"...":l.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${T.COPY}`;return}t.innerHTML=`<span class="text">スレッドをコピー</span>${T.COPY}`;}showToast(t,e){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${e.substring(0,100)}</div>
    `,o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const o=this.extractTweetId(t);if(!o)return;const n=document.createElement("button");n.className="start-point-button",n.textContent="★",n.title="この位置からコピー開始",n.dataset.tweetId=o,l.startFromTweetId===o&&(n.classList.add("active"),n.textContent="✓",t.classList.add("start-point-set")),n.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,o);}),t.appendChild(n);});}setStartPoint(t,e){l.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";l.startFromTweetId=e,l.startFromTweetAuthor=o,l.startFromTweetText=n,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${o}のツイートを起点に設定しました`),c.log(`Start point set: ${e} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");l.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){l.startFromTweetId=null,l.startFromTweetAuthor="",l.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const o=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},n=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,o();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const d=a.relatedTarget;d&&t.contains(d)||n();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",o),t.addEventListener("focusout",a=>{const d=a.relatedTarget;d&&t.contains(d)||n();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return c.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const n=this.ensureFloatingContainer(),s=n.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},n.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(i){c.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const n=this.floatingContainer;if(!n)return;const s=o.clientX-this.dragState.startX,i=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,n.classList.add("has-custom-position"),n.style.bottom="auto",n.style.right="auto";}const a=this.dragState.initialTop+i,d=this.dragState.initialLeft+s,{top:u,left:p}=this.clampPosition(a,d,n);this.applyPosition(u,p,n);});const e=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,o){const s=o.offsetHeight||0,i=o.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),d=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),d)}}applyPosition(t,e,o){const n=o??this.ensureFloatingContainer();n.style.top=`${t}px`,n.style.left=`${e}px`,n.style.bottom="auto",n.style.right="auto",n.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(c.warn("stored position is invalid",e),null)}catch(t){return c.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){c.warn("failed to save UI position",t);}}}const x=new X;var J=typeof GM_notification<"u"?GM_notification:void 0,K=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const Z=K;function tt(r,t,e,o){J({text:r,title:t,image:e,onclick:o});}async function et(){try{const r=[],t=new Set;let e="",o="";const n=window.location.href,s=l.copyMode==="first";let i=!1;const a=window.scrollY;async function d(){if(i)return;const p=Array.from(document.querySelectorAll('article[data-testid="tweet"]'));p.length>0&&!e&&(e=M(p[0]),o=E(p[0]));for(const h of p){const m=h.querySelector('a[href*="/status/"]');if(!m)continue;const g=m.href.split("/"),f=g.indexOf("status");if(f===-1||f+1>=g.length)continue;const w=g[f+1].split("?")[0];if(t.has(w))continue;const y=M(h);if(e&&y!==e)continue;let b=E(h);y===e&&!b&&o&&(b=o);const I=h.querySelector('div[data-testid="tweetText"]');let A="";I&&(A=await N(I));const $=h.querySelector("time"),P=$?$.getAttribute("datetime"):"",_=P?at(new Date(P)):"",V=rt(h),z=await ot(h),G=t.size===0?n:m.href?m.href.split("?")[0]:"";if(r.push({id:w,author:y,handle:b,text:A,time:_,url:G,mediaUrls:V,quotedTweet:z}),t.add(w),s){i=!0;break}}}async function u(){try{if(await H(),await d(),i)return;let m=r.length,g=0;for(let f=0;f<30;f++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(w=>setTimeout(w,700)),await H(),await d(),i)return;if(r.length===m){if(g++,g>=3)break}else m=r.length,g=0;}catch(w){c.error(`スクロール処理エラー (試行 ${f+1}): ${w.message}`);continue}try{window.scrollTo(0,a);}catch(f){c.error(`スクロール位置復元エラー: ${f.message}`);}}catch(m){throw c.error(`スクロール収集処理エラー: ${m.message}`),m}}return await u(),r.sort((p,h)=>{const m=new Date(p.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),g=new Date(h.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return m.getTime()-g.getTime()}),r}catch(r){return c.error(`ツイート収集中にエラーが発生: ${r.message}`),c.error(`エラースタック: ${r.stack}`),[]}}function E(r){try{const e=Array.from(r.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const o=Array.from(r.querySelectorAll('a[role="link"][href^="/"]'));for(const s of o)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const n=r.querySelector('div[data-testid="User-Name"]');if(n){const s=n.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function M(r){try{const t=r.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}async function ot(r){const t=r.querySelector('[data-testid="tweetQuotedLink"]');let e=null;if(t)try{const o=t.closest('div[role="link"]');o&&(e=await k(o));}catch(o){c.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=r.innerText||"",n=o.includes("引用")||o.includes("Quote")||o.includes("quote"),s=r.querySelectorAll('div[role="link"]');if(s.length>0&&n)for(let i=0;i<s.length;i++){const a=s[i],d=a.innerText||"";if(d.includes("@")&&(d.includes("年")||d.includes("時間")||d.includes("分")||d.includes("日")))try{const u=await k(a);if(u&&u.author&&u.text){e=u;break}}catch(u){c.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(o){c.error(`代替引用ツイート検索エラー: ${o.message}`);}return e}async function k(r){const t=r.querySelector('div[dir="ltr"] > span'),e=t?t.textContent.trim():"",o=r.querySelector('div[dir="ltr"] span:nth-child(2)'),n=o?o.textContent.trim():"";let s="";const i=r.querySelector('div[data-testid="tweetText"]');if(i)s=await N(i);else {const g=(r.innerText||"").split(`
`).map(y=>y.trim()).filter(y=>y);let f=-1;for(let y=0;y<g.length;y++)if(g[y].includes(n)){f=y;break}const w=f+1;f>=0&&w<g.length&&(s=g.slice(w+1).join(`
`));}const a=[];r.querySelectorAll('[data-testid="tweetPhoto"]').forEach(m=>{const g=m.querySelector('img[src*="pbs.twimg.com/media"]');if(g){const f=v(g.src);f&&!a.includes(f)&&a.push(f);}}),a.length===0&&(r.querySelectorAll('[role="group"]').forEach(f=>{f.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(y=>{const b=v(y.src);b&&!a.includes(b)&&a.push(b);});}),r.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(f=>{const w=v(f.src);w&&!a.includes(w)&&a.push(w);}));let u="",p="";const h=r.querySelectorAll('a[href*="/status/"]');for(const m of Array.from(h)){const g=m.href;if(g&&g.includes("/status/")){const f=g.split("/"),w=f.indexOf("status");if(w!==-1&&w+1<f.length){u=f[w+1].split("?")[0],p=g;break}}}return e&&s?{author:e,handle:n,text:s,id:u,url:p,mediaUrls:a}:null}function rt(r){const t=[];return r.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const s=n.querySelector('img[src*="pbs.twimg.com/media"]');if(s){const i=v(s.src);i&&!t.includes(i)&&t.push(i);}}),r.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=q(n.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=r.querySelector('a[href*="/status/"]');if(i){const a=i.href.split("/"),d=a.indexOf("status");if(d!==-1&&d+1<a.length){const p=`https://twitter.com/i/status/${a[d+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}catch(i){c.error("Error processing blob URL: "+i);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=q(n.poster);i&&!t.includes(i)&&t.push(i);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=r.querySelector('a[href*="/status/"]');if(a){const d=a.href.split("/"),u=d.indexOf("status");if(u!==-1&&u+1<d.length){const h=`https://twitter.com/i/status/${d[u+1].split("?")[0]}`;t.includes(h)||t.push(`[動画] ${h}`);}}}});}),t.length===0&&r.querySelectorAll('[role="group"]').forEach(s=>{s.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const d=v(a.src);d&&!t.includes(d)&&t.push(d);});}),t.length===0&&r.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(s=>{const i=v(s.src);i&&!t.includes(i)&&t.push(i);}),t}function v(r){if(!r||typeof r!="string"||!r.includes("pbs.twimg.com/media"))return null;try{const t=r.match(/format=([^&]+)/),e=t?t[1]:"jpg",o=r.split("?")[0];if(!o||o.length===0)return c.error(`無効なベースURL: ${r}`),null;const n=o+"."+e;try{return new URL(n),n}catch(s){return c.error(`無効なURL形式: ${n}, エラー内容: ${s.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function q(r){if(!r||!r.includes("tweet_video_thumb"))return null;try{const t=r.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}async function N(r){try{const t=r.cloneNode(!0);return await nt(t)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),r.innerText??""}}async function nt(r){const t=Array.from(r.querySelectorAll("a[href]")),e=[];for(const o of t)if(st(o,o.textContent??"")){const n=o.getAttribute("href");n&&n.startsWith("https://t.co/")&&e.push(it(n).then(s=>({anchor:o,resolvedUrl:s})));}if(e.length>0){const o=await Promise.all(e);for(const{anchor:n,resolvedUrl:s}of o)if(s){const i=document.createTextNode(s);n.replaceWith(i);}}return r.innerText}function it(r){return new Promise(t=>{Z({method:"HEAD",url:r,timeout:1e4,onload:e=>{t(e.finalUrl||r);},onerror:()=>{t(r);},ontimeout:()=>{t(r);}});})}function st(r,t){const e=t.trim();return /^https?:\/\//i.test(e)||r.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(r.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function H(){try{const r=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const e of Array.from(r))try{const o=e.textContent?e.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest('[data-testid="tweet"]')&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(o){c.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(r){return c.error(`ツイート展開処理エラー: ${r.message}`),0}}function at(r){const t=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),o=String(r.getDate()).padStart(2,"0"),n=String(r.getHours()).padStart(2,"0"),s=String(r.getMinutes()).padStart(2,"0");return `${t}年${e}月${o}日 ${n}:${s}`}const lt="http://localhost:3002/v1/chat/completions",ct="https://translate.googleapis.com/translate_a/single",dt="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",ut=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;async function ht(r){const t=r.map(yt),e=t.map(i=>({tweet:i,textSegments:R(i.text),quotedSegments:i.quotedTweet?R(i.quotedTweet.text):null})),o=[];let n=false;for(const i of e){for(const a of i.textSegments)U(a,o);if(i.quotedSegments)for(const a of i.quotedSegments)U(a,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<o.length;i++){const a=o[i];try{const{text:u,provider:p}=await mt(a.original);a.translated=u,p==="local"&&(n=!0),!s&&u!==a.original&&(s=!0);}catch(u){c.error(`セグメント翻訳に失敗: ${u.message}`),a.translated=a.original;}i<o.length-1&&await O(1e3+Math.random()*500);}for(const i of e)i.tweet.text=B(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=B(i.quotedSegments));return n&&tt("ローカルAIでの翻訳が完了しました。","Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function U(r,t){if(r.kind==="text"){if(r.original.trim().length===0){r.translated=r.original;return}t.push(r);}}function B(r){if(r.length===0)return "";let t="";for(const e of r)if(e.kind==="fixed"){const o=e.value;D(o)&&(t=gt(t)),t+=o;}else t+=e.translated??e.original;return t}function R(r){if(!r)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let o=0,n;for(;(n=t.exec(r))!==null;)n.index>o&&e.push({kind:"text",original:r.slice(o,n.index)}),e.push({kind:"fixed",value:pt(n[0])}),o=n.index+n[0].length;return o<r.length&&e.push({kind:"text",original:r.slice(o)}),e.length===0&&e.push({kind:"text",original:r}),e}function pt(r){if(D(r)){const t=ft(r);return t.length>0?t:r}return r}function D(r){return /^https?:\/\//i.test(r.trim())}function ft(r){return r.replace(ut,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function gt(r){return r.length===0?r:r.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function mt(r){if(r.trim().length===0)return {text:r,provider:"none"};const t=await wt(r);if(t)return {text:t,provider:"local"};try{return {text:await xt(r),provider:"google"}}catch(e){return c.error(`Google翻訳にも失敗しました: ${e.message}`),{text:r,provider:"none"}}}async function wt(r){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${r}
<|plamo:op|>output lang=ja`,e=await new Promise((s,i)=>{GM_xmlhttpRequest({method:"POST",url:lt,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:dt},{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:a=>a.status>=200&&a.status<300?s(a):i(new Error(`API error: ${a.status}`)),onerror:a=>i(a),ontimeout:()=>i(new Error("Timeout"))});}),n=JSON.parse(e.responseText)?.choices?.[0]?.message?.content;if(n&&n.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),n;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function xt(r){const t="auto";let o=0;const n=3;for(;o<n;)try{const s=`${ct}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(r)}`,i=await new Promise((u,p)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:h=>h.status>=200&&h.status<300?u(h):p(new Error(`API error: ${h.status}`)),onerror:h=>p(h),ontimeout:()=>p(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const d=a.sentences.map(u=>u?.trans??"").join("");if(!d.trim())throw new Error("Translation result is empty");return d}catch(s){if(o++,c.error(`Google翻訳試行 ${o}/${n} 失敗: ${s.message}`),o>=n)throw s;await O(1e3*Math.pow(2,o));}throw new Error("Google翻訳に失敗しました。")}function yt(r){return {...r,mediaUrls:[...r.mediaUrls],quotedTweet:r.quotedTweet?{...r.quotedTweet,mediaUrls:[...r.quotedTweet.mediaUrls]}:null}}async function O(r){await new Promise(t=>setTimeout(t,r));}function C(r){let t=`${r.author} ${r.handle}
${r.text}
${r.time}
`;if(r.url&&(t+=`${r.url}
`),r.mediaUrls.length>0&&(t+=r.mediaUrls.join(`
`)+`
`),r.quotedTweet){const e=r.quotedTweet;t+=`
> 引用元: ${e.author} ${e.handle}
`,t+=`> ${e.text.replace(/\n/g,`
> `)}
`,e.mediaUrls.length>0&&(t+=`> ${e.mediaUrls.join(`
> `)}
`),t+=`> ${e.url}
`;}return t}function F(r,t){if(!r||r.length===0)return "";let e="";const o=`

---

`;for(let n=0;n<r.length;n++){const s=r[n],i=C(s),a=n===0?i:o+i;if(e.length+a.length>t){const d=t-e.length;d>o.length&&(e+=a.substring(0,d-3)+"...");break}e+=a;}return e}function bt(r){if(!r||r.length===0)return "";let t=C(r[0]);for(let e=1;e<r.length;e++)t+=`

---

`+C(r[e]);return t}function Tt(r,t,e,o=null){let n="";if(o&&(n+=`${o}のツイートから`),r.length>0){const s=r[0].author;n+=`${s}のスレッド`;}return n+=`(${r.length}件)をコピーしました。`,n+=`文字数: ${vt(t.length)}`,(e==="shitaraba"||e==="5ch")&&(n+=`/${e==="shitaraba"?4096:2048}`),n}function vt(r){return r<1e3?r.toString():r<1e4?(r/1e3).toFixed(1)+"k":Math.round(r/1e3)+"k"}async function St(r){if(!r||!r.formattedText){const o=r?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー",o),false}if(r.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),x.showToast("エラー","コピーするテキストが空です"),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([r.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":o});await navigator.clipboard.write([n]),t=!0;}catch(o){e=o,c.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(r.formattedText),t=!0;}catch(o){e=o,c.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=r.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){e=o,c.error(`execCommand fallback失敗: ${e.message}`);}if(t)x.showToast("コピーしました",r.summary);else {const o=e?e.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class Ct{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){l.collectedThreadData&&(await St(l.collectedThreadData),l.isSecondStage=!1,l.collectedThreadData=null,x.updateMainButtonText());return}if(l.isCollecting)return;l.isCollecting=!0,x.updateMainButtonText();try{const e=await et();let o=e;const n=l.selectedTweetIds??[];if(n.length>0){const u=new Map(e.map(h=>[h.id,h])),p=[];for(const h of n){const m=u.get(h);m&&p.push(m);}if(o=p,o.length===0){c.warn("選択済みツイートを取得できませんでした。"),l.collectedThreadData=null,l.isSecondStage=!1,x.showToast("選択エラー","選択したツイートが見つかりませんでした。再度読み込みしてください。");return}}else if(l.startFromTweetId){const u=e.findIndex(p=>p.id===l.startFromTweetId);u!==-1&&(o=e.slice(u));}let s="",i=o,a=!1;if(o.length>0){if(l.translateEnabled)try{l.translationInProgress=!0,x.updateMainButtonText(),x.showToast("翻訳中","翻訳処理を実行しています...");const u=await ht(o);i=u.tweets,a=u.hasTranslation;}catch(u){c.error(`Translation error: ${u}`),x.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=o,a=!1;}finally{l.translationInProgress=!1;}switch(l.copyMode){case "first":s=C(i[0]);break;case "shitaraba":s=F(i,4096);break;case "5ch":s=F(i,2048);break;default:s=bt(i);break}}let d=Tt(o,s,l.copyMode,n.length===0?l.startFromTweetAuthor:null);l.translateEnabled&&a&&s.trim().length>0&&(d+=" (翻訳済み)"),l.collectedThreadData={formattedText:s,summary:d},l.isSecondStage=!0,x.showToast("準備完了",`${d} クリックしてコピーしてください`);}catch(e){c.error(`Error in copy process: ${e}`),x.showToast("エラー","スレッドのコピーに失敗しました");}finally{l.isCollecting=!1,l.translationInProgress=!1,x.updateMainButtonText();}}catch(e){c.error(`Button click handler error: ${e}`),x.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(x.init(),x.addMainButton(this.handleButtonClick.bind(this)),x.updateAllUI()):x.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const e=i=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${i}): ${t}`));},o=history.pushState;history.pushState=function(...i){o.apply(this,i),e("pushState");};const n=history.replaceState;history.replaceState=function(...i){n.apply(this,i),e("replaceState");},window.addEventListener("popstate",()=>e("popstate")),new MutationObserver(()=>e("mutation")).observe(document.body,{childList:true,subtree:true});}}new Ct;

})();