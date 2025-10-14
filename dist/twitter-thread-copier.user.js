// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      6.1.0
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

    const C="[TwitterThreadCopier]",c={log:o=>{console.log(C,o);},error:o=>{console.error(C,o);},warn:(o,t)=>{t?console.warn(C,o,t):console.warn(C,o);}};function j(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const l=j();var Q="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",X="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",J="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function I(o,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const h={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},v={LOADING:I(J),CLIPBOARD:I(Q),COPY:I(X)};class K{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style"),e=h.article;t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),l.selectedTweetIds=[],c.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll(h.article).forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let n=Array.from(t.children).find(r=>r.classList.contains("select-tweet-button"));n?n.dataset.tweetId||(n.dataset.tweetId=e):(n=document.createElement("button"),n.type="button",n.className="select-tweet-button",n.textContent="+",n.title="このツイートを選択",n.dataset.tweetId=e,n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(n));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;l.selectedTweetIds.forEach((e,n)=>{t.set(e,n+1);}),document.querySelectorAll(h.article).forEach(e=>{const n=this.extractTweetId(e);if(!n)return;const r=e.querySelector(".select-tweet-button");if(r)if(t.has(n)){const s=t.get(n)??0;e.classList.add("tweet-selected"),r.classList.add("active"),r.textContent=s>0?s.toString():"✓",r.title=`選択中 (${s})`;}else e.classList.remove("tweet-selected"),r.classList.remove("active"),r.textContent="+",r.title="このツイートを選択";}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const n=l.selectedTweetIds.includes(e);n?l.selectedTweetIds=l.selectedTweetIds.filter(i=>i!==e):l.selectedTweetIds=[...l.selectedTweetIds,e],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null;const r=l.selectedTweetIds.length,s=r>0?`${r}件選択中`:"選択をすべて解除しました";this.refreshSelectionIndicators(),this.updateMainButtonText(),n?this.showToast("選択解除",s):this.showToast("選択追加",s),c.log(`Selected tweet ids: ${l.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");l.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent="選択をリセット",t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){l.selectedTweetIds.length!==0&&(l.selectedTweetIds=[],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast("選択リセット","選択したツイートをすべて解除しました"),c.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">全て</option>
      <option value="first">最初</option>
      <option value="shitaraba">4K</option>
      <option value="5ch">2K</option>
    `,e.value=l.copyMode,e.addEventListener("change",s=>{l.copyMode=s.target.value,c.log(`Copy mode changed to: ${l.copyMode}`);}),t.appendChild(e);const n=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.id="translate-checkbox",r.checked=l.translateEnabled,r.addEventListener("change",s=>{l.translateEnabled=s.target.checked,c.log(`Translation ${l.translateEnabled?"enabled":"disabled"}`);}),n.appendChild(r),n.appendChild(document.createTextNode("翻訳")),t.appendChild(n),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title="スレッドをコピー",e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}l.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(l.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${v.LOADING}`;return}if(l.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${v.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),l.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${v.CLIPBOARD}`;return}const e=l.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">選択ツイート(${e})をコピー</span>${v.COPY}`;return}if(l.startFromTweetId){const n=l.startFromTweetText.length>20?l.startFromTweetText.substring(0,20)+"...":l.startFromTweetText;t.innerHTML=`<span class="text">${n}からコピー</span>${v.COPY}`;return}t.innerHTML=`<span class="text">スレッドをコピー</span>${v.COPY}`;}showToast(t,e){let n=this.querySelector(".copy-toast");n||(n=document.createElement("div"),n.className="copy-toast",this.appendChild(n)),n.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${e.substring(0,100)}</div>
    `,n.classList.remove("visible"),setTimeout(()=>{n?.classList.add("visible"),setTimeout(()=>{n?.classList.remove("visible"),setTimeout(()=>n?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll(h.article).forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const n=this.extractTweetId(t);if(!n)return;const r=document.createElement("button");r.className="start-point-button",r.textContent="★",r.title="この位置からコピー開始",r.dataset.tweetId=n,l.startFromTweetId===n&&(r.classList.add("active"),r.textContent="✓",t.classList.add("start-point-set")),r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(r);});}setStartPoint(t,e){l.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const n=t.querySelector(h.userName)?.innerText??"",r=t.querySelector(h.tweetText)?.innerText??"";l.startFromTweetId=e,l.startFromTweetAuthor=n,l.startFromTweetText=r,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${n}のツイートを起点に設定しました`),c.log(`Start point set: ${e} by ${n}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");l.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){l.startFromTweetId=null,l.startFromTweetAuthor="",l.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const n=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},r=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,n();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const d=a.relatedTarget;d&&t.contains(d)||r();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",n),t.addEventListener("focusout",a=>{const d=a.relatedTarget;d&&t.contains(d)||r();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return c.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",n=>{if(!n.isPrimary)return;const r=this.ensureFloatingContainer(),s=r.getBoundingClientRect();this.dragState={pointerId:n.pointerId,startX:n.clientX,startY:n.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},r.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(n.pointerId);}catch(i){c.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",n=>{if(!this.dragState||n.pointerId!==this.dragState.pointerId)return;const r=this.floatingContainer;if(!r)return;const s=n.clientX-this.dragState.startX,i=n.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,r.classList.add("has-custom-position"),r.style.bottom="auto",r.style.right="auto";}const a=this.dragState.initialTop+i,d=this.dragState.initialLeft+s,{top:u,left:p}=this.clampPosition(a,d,r);this.applyPosition(u,p,r);});const e=n=>{!this.dragState||n.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(n.pointerId)&&t.releasePointerCapture(n.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,n){const s=n.offsetHeight||0,i=n.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),d=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),d)}}applyPosition(t,e,n){const r=n??this.ensureFloatingContainer();r.style.top=`${t}px`,r.style.left=`${e}px`,r.style.bottom="auto",r.style.right="auto",r.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(c.warn("stored position is invalid",e),null)}catch(t){return c.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){c.warn("failed to save UI position",t);}}}const y=new K;var Z=typeof GM_notification<"u"?GM_notification:void 0,tt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const et=tt;function ot(o,t,e,n){Z({text:o,title:t,image:e,onclick:n});}const nt="https://twitter.com",rt="https://t.co",it="https://video.twimg.com",k=o=>`${nt}/i/status/${o}`,st=o=>`${it}/tweet_video/${o}.mp4`,at=/https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/,lt=`${rt}/`,ct="https://translate.googleapis.com/translate_a/single";async function dt(){try{const o=[],t=new Set;let e="",n="";const r=window.location.href,s=l.copyMode==="first";let i=!1;const a=window.scrollY;async function d(){if(i)return;const p=Array.from(document.querySelectorAll(h.article));p.length>0&&!e&&(e=q(p[0]),n=P(p[0]));for(const f of p){const w=f.querySelector(h.statusLink);if(!w)continue;const m=w.href.split("/"),g=m.indexOf("status");if(g===-1||g+1>=m.length)continue;const x=m[g+1].split("?")[0];if(t.has(x))continue;const b=q(f);if(e&&b!==e)continue;let T=P(f);b===e&&!T&&n&&(T=n);const A=f.querySelector(h.tweetText);let $="";A&&($=await D(A));const E=f.querySelector("time"),M=E?E.getAttribute("datetime"):"",z=M?mt(new Date(M)):"",W=ht(f),G=await ut(f),Y=t.size===0?r:w.href?w.href.split("?")[0]:"";if(o.push({id:x,author:b,handle:T,text:$,time:z,url:Y,mediaUrls:W,quotedTweet:G}),t.add(x),s){i=!0;break}}}async function u(){try{if(await H(),await d(),i)return;let w=o.length,m=0;for(let g=0;g<30;g++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(x=>setTimeout(x,700)),await H(),await d(),i)return;if(o.length===w){if(m++,m>=3)break}else w=o.length,m=0;}catch(x){c.error(`スクロール処理エラー (試行 ${g+1}): ${x.message}`);continue}try{window.scrollTo(0,a);}catch(g){c.error(`スクロール位置復元エラー: ${g.message}`);}}catch(w){throw c.error(`スクロール収集処理エラー: ${w.message}`),w}}return await u(),o.sort((p,f)=>{const w=new Date(p.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),m=new Date(f.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return w.getTime()-m.getTime()}),o}catch(o){return c.error(`ツイート収集中にエラーが発生: ${o.message}`),c.error(`エラースタック: ${o.stack}`),[]}}function P(o){try{const e=Array.from(o.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const n=Array.from(o.querySelectorAll(h.userLink));for(const s of n)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const r=o.querySelector(h.userName);if(r){const s=r.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function q(o){try{const t=o.querySelector(h.userNameLinkSpan);return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}async function ut(o){const t=o.querySelector(h.quotedLink);let e=null;if(t)try{const n=t.closest(h.roleLink);n&&(e=await U(n));}catch(n){c.error(`引用ツイート取得エラー: ${n.message}`);}else try{const n=o.innerText||"",r=n.includes("引用")||n.includes("Quote")||n.includes("quote"),s=o.querySelectorAll(h.roleLink);if(s.length>0&&r)for(let i=0;i<s.length;i++){const a=s[i],d=a.innerText||"";if(d.includes("@")&&(d.includes("年")||d.includes("時間")||d.includes("分")||d.includes("日")))try{const u=await U(a);if(u&&u.author&&u.text){e=u;break}}catch(u){c.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(n){c.error(`代替引用ツイート検索エラー: ${n.message}`);}return e}async function U(o){const t=o.querySelector(h.quotedAuthor),e=t?t.textContent.trim():"",n=o.querySelector(h.quotedHandle),r=n?n.textContent.trim():"";let s="";const i=o.querySelector(h.tweetText);if(i)s=await D(i);else {const m=(o.innerText||"").split(`
`).map(b=>b.trim()).filter(b=>b);let g=-1;for(let b=0;b<m.length;b++)if(m[b].includes(r)){g=b;break}const x=g+1;g>=0&&x<m.length&&(s=m.slice(x+1).join(`
`));}const a=[];o.querySelectorAll(h.tweetPhoto).forEach(w=>{const m=w.querySelector(h.tweetMediaImage);if(m){const g=S(m.src);g&&!a.includes(g)&&a.push(g);}}),a.length===0&&(o.querySelectorAll(h.roleGroup).forEach(g=>{g.querySelectorAll(h.tweetMediaImage).forEach(b=>{const T=S(b.src);T&&!a.includes(T)&&a.push(T);});}),o.querySelectorAll(h.tweetMediaImage).forEach(g=>{const x=S(g.src);x&&!a.includes(x)&&a.push(x);}));let u="",p="";const f=o.querySelectorAll(h.statusLink);for(const w of Array.from(f)){const m=w.href;if(m&&m.includes("/status/")){const g=m.split("/"),x=g.indexOf("status");if(x!==-1&&x+1<g.length){u=g[x+1].split("?")[0],p=m;break}}}return e&&s?{author:e,handle:r,text:s,id:u,url:p,mediaUrls:a}:null}function ht(o){const t=[];return o.querySelectorAll(h.tweetPhoto).forEach(r=>{const s=r.querySelector(h.tweetMediaImage);if(s){const i=S(s.src);i&&!t.includes(i)&&t.push(i);}}),o.querySelectorAll("video").forEach(r=>{if(r.src&&r.src.startsWith("blob:"))try{if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=R(r.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=o.querySelector(h.statusLink);if(i){const a=i.href.split("/"),d=a.indexOf("status");if(d!==-1&&d+1<a.length){const u=a[d+1].split("?")[0],p=k(u);t.includes(p)||t.push(`[動画] ${p}`);}}}catch(i){c.error("Error processing blob URL: "+i);}else {if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=R(r.poster);i&&!t.includes(i)&&t.push(i);}r.src&&r.src.includes("video.twimg.com")&&(t.includes(r.src)||t.push(r.src));}r.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=o.querySelector(h.statusLink);if(a){const d=a.href.split("/"),u=d.indexOf("status");if(u!==-1&&u+1<d.length){const p=d[u+1].split("?")[0],f=k(p);t.includes(f)||t.push(`[動画] ${f}`);}}}});}),t.length===0&&o.querySelectorAll(h.roleGroup).forEach(s=>{s.querySelectorAll(h.tweetMediaImage).forEach(a=>{const d=S(a.src);d&&!t.includes(d)&&t.push(d);});}),t.length===0&&o.querySelectorAll(h.tweetMediaImage).forEach(s=>{const i=S(s.src);i&&!t.includes(i)&&t.push(i);}),t}function S(o){if(!o||typeof o!="string"||!o.includes("pbs.twimg.com/media"))return null;try{const t=o.match(/format=([^&]+)/),e=t?t[1]:"jpg",n=o.split("?")[0];if(!n||n.length===0)return c.error(`無効なベースURL: ${o}`),null;const r=n+"."+e;try{return new URL(r),r}catch(s){return c.error(`無効なURL形式: ${r}, エラー内容: ${s.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function R(o){if(!o||!o.includes("tweet_video_thumb"))return null;try{const t=o.match(/tweet_video_thumb\/([^.]+)/);if(!t||!t[1])return null;const e=t[1];return st(e)}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}async function D(o){try{const t=o.cloneNode(!0);return await pt(t)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),o.innerText??""}}async function pt(o){const t=Array.from(o.querySelectorAll("a[href]")),e=[];for(const n of t)if(gt(n,n.textContent??"")){const r=n.getAttribute("href");r&&r.startsWith(lt)&&e.push(ft(r).then(s=>({anchor:n,resolvedUrl:s})));}if(e.length>0){const n=await Promise.all(e);for(const{anchor:r,resolvedUrl:s}of n)if(s){const i=document.createTextNode(s);r.replaceWith(i);}}return o.innerText}function ft(o){return new Promise(t=>{et({method:"HEAD",url:o,timeout:1e4,onload:e=>{t(e.finalUrl||o);},onerror:()=>{t(o);},ontimeout:()=>{t(o);}});})}function gt(o,t){const e=t.trim();return /^https?:\/\//i.test(e)||o.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(o.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function H(){try{const o=document.querySelectorAll(h.tweetButtonsWithinArticle);let t=0;for(const e of Array.from(o))try{const n=e.textContent?e.textContent.trim():"";(n==="さらに表示"||n==="Show more"||n.match(/もっと見る/i)||n.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest(h.tweetRoot)&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(n){c.error(`個別ツイート展開エラー: ${n.message}`);continue}return t}catch(o){return c.error(`ツイート展開処理エラー: ${o.message}`),0}}function mt(o){const t=o.getFullYear(),e=String(o.getMonth()+1).padStart(2,"0"),n=String(o.getDate()).padStart(2,"0"),r=String(o.getHours()).padStart(2,"0"),s=String(o.getMinutes()).padStart(2,"0");return `${t}年${e}月${n}日 ${r}:${s}`}const wt="http://localhost:3002/v1/chat/completions",xt=ct,yt="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text. Additionally, perform the following unit conversions within the text: 1. Convert US dollars to Japanese Yen (e.g., $100 -> 100ドル(15,000円)). Use the rate 1 USD = 150 JPY. 2. Convert imperial units to metric units: 1 yard = 0.9144 meters, 1 pound = 0.453592 kilograms, 1 US gallon = 3.78541 liters.",bt=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;async function Tt(o){const t=o.map($t),e=t.map(i=>({tweet:i,textSegments:F(i.text),quotedSegments:i.quotedTweet?F(i.quotedTweet.text):null})),n=[];let r=false;for(const i of e){for(const a of i.textSegments)B(a,n);if(i.quotedSegments)for(const a of i.quotedSegments)B(a,n);}if(n.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<n.length;i++){const a=n[i];try{const{text:u,provider:p}=await Lt(a.original);a.translated=u,p==="local"&&(r=!0),!s&&u!==a.original&&(s=!0);}catch(u){c.error(`セグメント翻訳に失敗: ${u.message}`),a.translated=a.original;}i<n.length-1&&await V(1e3+Math.random()*500);}for(const i of e)i.tweet.text=_(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=_(i.quotedSegments));return r&&ot("ローカルAIでの翻訳が完了しました。","Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function B(o,t){if(o.kind==="text"){if(o.original.trim().length===0){o.translated=o.original;return}t.push(o);}}function _(o){if(o.length===0)return "";let t="";for(const e of o)if(e.kind==="fixed"){const n=e.value;O(n)&&(t=Ct(t)),t+=n;}else t+=e.translated??e.original;return t}function F(o){if(!o)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let n=0,r;for(;(r=t.exec(o))!==null;)r.index>n&&e.push({kind:"text",original:o.slice(n,r.index)}),e.push({kind:"fixed",value:vt(r[0])}),n=r.index+r[0].length;return n<o.length&&e.push({kind:"text",original:o.slice(n)}),e.length===0&&e.push({kind:"text",original:o}),e}function vt(o){if(O(o)){const t=St(o);return t.length>0?t:o}return o}function O(o){return /^https?:\/\//i.test(o.trim())}function St(o){return o.replace(bt,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function Ct(o){return o.length===0?o:o.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function Lt(o){if(o.trim().length===0)return {text:o,provider:"none"};const t=await It(o);if(t)return {text:t,provider:"local"};try{return {text:await At(o),provider:"google"}}catch(e){return c.error(`Google翻訳にも失敗しました: ${e.message}`),{text:o,provider:"none"}}}async function It(o){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${o}
<|plamo:op|>output lang=ja`,e=await new Promise((s,i)=>{GM_xmlhttpRequest({method:"POST",url:wt,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:yt},{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:a=>a.status>=200&&a.status<300?s(a):i(new Error(`API error: ${a.status}`)),onerror:a=>i(a),ontimeout:()=>i(new Error("Timeout"))});}),r=JSON.parse(e.responseText)?.choices?.[0]?.message?.content;if(r&&r.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),r;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function At(o){const t="auto";let n=0;const r=3;for(;n<r;)try{const s=`${xt}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(o)}`,i=await new Promise((u,p)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:f=>f.status>=200&&f.status<300?u(f):p(new Error(`API error: ${f.status}`)),onerror:f=>p(f),ontimeout:()=>p(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const d=a.sentences.map(u=>u?.trans??"").join("");if(!d.trim())throw new Error("Translation result is empty");return d}catch(s){if(n++,c.error(`Google翻訳試行 ${n}/${r} 失敗: ${s.message}`),n>=r)throw s;await V(1e3*Math.pow(2,n));}throw new Error("Google翻訳に失敗しました。")}function $t(o){return {...o,mediaUrls:[...o.mediaUrls],quotedTweet:o.quotedTweet?{...o.quotedTweet,mediaUrls:[...o.quotedTweet.mediaUrls]}:null}}async function V(o){await new Promise(t=>setTimeout(t,o));}function L(o){let t=`${o.author} ${o.handle}
${o.text}
${o.time}
`;if(o.url&&(t+=`${o.url}
`),o.mediaUrls.length>0&&(t+=o.mediaUrls.join(`
`)+`
`),o.quotedTweet){const e=o.quotedTweet;t+=`
> 引用元: ${e.author} ${e.handle}
`,t+=`> ${e.text.replace(/\n/g,`
> `)}
`,e.mediaUrls.length>0&&(t+=`> ${e.mediaUrls.join(`
> `)}
`),t+=`> ${e.url}
`;}return t}function Et(o,t){if(!o||o.length===0)return "";let e="";const n=`

---

`;for(let r=0;r<o.length;r++){const s=o[r],i=L(s),a=r===0?i:n+i;if(e.length+a.length>t){const d=t-e.length;d>n.length&&(e+=a.substring(0,d-3)+"...");break}e+=a;}return e}const Mt=/https?:\/\/[^\s]+/g;class kt{hasThreadUrlIncluded=false;remainingMediaSlots=5;consumeThreadUrl(t){return !t||this.hasThreadUrlIncluded?null:(this.hasThreadUrlIncluded=true,t)}consumeMediaUrls(t){if(this.remainingMediaSlots<=0)return [];const n=t.filter(r=>r.trim().length>0).slice(0,this.remainingMediaSlots);return this.remainingMediaSlots-=n.length,n}}function N(o){if(!o)return "";const e=o.replace(Mt,"").replace(/[ \t]+\n/g,`
`).split(`
`).map(n=>n.replace(/[ \t]{2,}/g," ").trim());for(let n=e.length-1;n>=0&&e[n]==="";n--)e.pop();return e.join(`
`)}function Pt(o,t){const e=[];e.push(`${o.author} ${o.handle}`);const n=N(o.text);n.length>0?e.push(n):e.push(""),e.push(o.time);const r=t.consumeThreadUrl(o.url);r&&e.push(r);const s=t.consumeMediaUrls(o.mediaUrls);if(s.length>0&&e.push(...s),o.quotedTweet){const{quotedTweet:i}=o;if(i){const a=[];a.push(`> 引用元: ${i.author} ${i.handle}`);const d=N(i.text);d.length>0&&a.push(...d.split(`
`).map(p=>`> ${p}`));const u=t.consumeMediaUrls(i.mediaUrls);u.length>0&&a.push(...u.map(p=>`> ${p}`)),a.length>0&&(e.push(""),e.push(...a));}}return `${e.join(`
`)}
`}function qt(o,t){if(!o||o.length===0)return "";const e=new kt;let n="";const r=`

---

`;for(let s=0;s<o.length;s++){const i=o[s],a=Pt(i,e),d=s===0?a:r+a;if(n.length+d.length>t){const u=t-n.length;u>r.length&&(n+=d.substring(0,u-3)+"...");break}n+=d;}return n}function Ut(o){if(!o||o.length===0)return "";let t=L(o[0]);for(let e=1;e<o.length;e++)t+=`

---

`+L(o[e]);return t}function Rt(o,t,e,n=null){let r="";if(n&&(r+=`${n}のツイートから`),o.length>0){const s=o[0].author;r+=`${s}のスレッド`;}return r+=`(${o.length}件)をコピーしました。`,r+=`文字数: ${Ht(t.length)}`,(e==="shitaraba"||e==="5ch")&&(r+=`/${e==="shitaraba"?4096:2048}`),r}function Ht(o){return o<1e3?o.toString():o<1e4?(o/1e3).toFixed(1)+"k":Math.round(o/1e3)+"k"}async function Bt(o){if(!o||!o.formattedText){const n=o?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${n}`),y.showToast("エラー",n),false}if(o.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),y.showToast("エラー","コピーするテキストが空です"),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const n=new Blob([o.formattedText],{type:"text/plain"}),r=new window.ClipboardItem({"text/plain":n});await navigator.clipboard.write([r]),t=!0;}catch(n){e=n,c.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(o.formattedText),t=!0;}catch(n){e=n,c.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const n=document.createElement("textarea");if(n.value=o.formattedText,n.style.position="fixed",n.style.left="-9999px",document.body.appendChild(n),n.select(),t=document.execCommand("copy"),document.body.removeChild(n),!t)throw new Error("execCommand returned false")}catch(n){e=n,c.error(`execCommand fallback失敗: ${e.message}`);}if(t)y.showToast("コピーしました",o.summary);else {const n=e?e.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${n}`),y.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class _t{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){l.collectedThreadData&&(await Bt(l.collectedThreadData),l.isSecondStage=!1,l.collectedThreadData=null,y.updateMainButtonText());return}if(l.isCollecting)return;l.isCollecting=!0,y.updateMainButtonText();try{const e=await dt();let n=e;const r=l.selectedTweetIds??[];if(r.length>0){const u=new Map(e.map(f=>[f.id,f])),p=[];for(const f of r){const w=u.get(f);w&&p.push(w);}if(n=p,n.length===0){c.warn("選択済みツイートを取得できませんでした。"),l.collectedThreadData=null,l.isSecondStage=!1,y.showToast("選択エラー","選択したツイートが見つかりませんでした。再度読み込みしてください。");return}}else if(l.startFromTweetId){const u=e.findIndex(p=>p.id===l.startFromTweetId);u!==-1&&(n=e.slice(u));}let s="",i=n,a=!1;if(n.length>0){if(l.translateEnabled)try{l.translationInProgress=!0,y.updateMainButtonText(),y.showToast("翻訳中","翻訳処理を実行しています...");const u=await Tt(n);i=u.tweets,a=u.hasTranslation;}catch(u){c.error(`Translation error: ${u}`),y.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=n,a=!1;}finally{l.translationInProgress=!1;}switch(l.copyMode){case "first":s=L(i[0]);break;case "shitaraba":s=qt(i,4096);break;case "5ch":s=Et(i,2048);break;default:s=Ut(i);break}}let d=Rt(n,s,l.copyMode,r.length===0?l.startFromTweetAuthor:null);l.translateEnabled&&a&&s.trim().length>0&&(d+=" (翻訳済み)"),l.collectedThreadData={formattedText:s,summary:d},l.isSecondStage=!0,y.showToast("準備完了",`${d} クリックしてコピーしてください`);}catch(e){c.error(`Error in copy process: ${e}`),y.showToast("エラー","スレッドのコピーに失敗しました");}finally{l.isCollecting=!1,l.translationInProgress=!1,y.updateMainButtonText();}}catch(e){c.error(`Button click handler error: ${e}`),y.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(y.init(),y.addMainButton(this.handleButtonClick.bind(this)),y.updateAllUI()):y.destroy();}isTwitterStatusPage(){return at.test(location.href)}observeUrlChanges(){let t=location.href;const e=i=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${i}): ${t}`));},n=history.pushState;history.pushState=function(...i){n.apply(this,i),e("pushState");};const r=history.replaceState;history.replaceState=function(...i){r.apply(this,i),e("replaceState");},window.addEventListener("popstate",()=>e("popstate")),new MutationObserver(()=>e("mutation")).observe(document.body,{childList:true,subtree:true});}}new _t;

})();