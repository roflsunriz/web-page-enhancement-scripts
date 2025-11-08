// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      6.5.1
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

    const L="[TwitterThreadCopier]",u={log:n=>{console.log(L,n);},error:n=>{console.error(L,n);},warn:(n,t)=>{t?console.warn(L,n,t):console.warn(L,n);}};function at(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const l=at();var lt="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",ct="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",dt="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function k(n,t=24){const e=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${n}"></path></svg>`}const m={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},C={LOADING:k(dt),CLIPBOARD:k(lt),COPY:k(ct)};class ut{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),u.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style"),e=m.article;t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),l.selectedTweetIds=[],u.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll(m.article).forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let o=Array.from(t.children).find(r=>r.classList.contains("select-tweet-button"));o?o.dataset.tweetId||(o.dataset.tweetId=e):(o=document.createElement("button"),o.type="button",o.className="select-tweet-button",o.textContent="+",o.title="このツイートを選択",o.dataset.tweetId=e,o.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(o));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;l.selectedTweetIds.forEach((e,o)=>{t.set(e,o+1);}),document.querySelectorAll(m.article).forEach(e=>{const o=this.extractTweetId(e);if(!o)return;const r=e.querySelector(".select-tweet-button");if(r)if(t.has(o)){const s=t.get(o)??0;e.classList.add("tweet-selected"),r.classList.add("active"),r.textContent=s>0?s.toString():"✓",r.title=`選択中 (${s})`;}else e.classList.remove("tweet-selected"),r.classList.remove("active"),r.textContent="+",r.title="このツイートを選択";}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const o=l.selectedTweetIds.includes(e);o?l.selectedTweetIds=l.selectedTweetIds.filter(i=>i!==e):l.selectedTweetIds=[...l.selectedTweetIds,e],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null;const r=l.selectedTweetIds.length,s=r>0?`${r}件選択中`:"選択をすべて解除しました";this.refreshSelectionIndicators(),this.updateMainButtonText(),o?this.showToast("選択解除",s):this.showToast("選択追加",s),u.log(`Selected tweet ids: ${l.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");l.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent="選択をリセット",t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){l.selectedTweetIds.length!==0&&(l.selectedTweetIds=[],l.isSecondStage&&(l.isSecondStage=false),l.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast("選択リセット","選択したツイートをすべて解除しました"),u.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">全て</option>
      <option value="first">最初</option>
      <option value="shitaraba">4K</option>
      <option value="5ch">2K</option>
    `,e.value=l.copyMode,e.addEventListener("change",g=>{l.copyMode=g.target.value,u.log(`Copy mode changed to: ${l.copyMode}`);}),t.appendChild(e);const o=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.id="translate-checkbox",r.checked=l.translateEnabled,r.addEventListener("change",g=>{l.translateEnabled=g.target.checked,u.log(`Translation ${l.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(r),o.appendChild(document.createTextNode("翻訳")),t.appendChild(o);const s=document.createElement("label");s.textContent="翻訳プロバイダー:";const i=document.createElement("select");i.id="provider-select",i.innerHTML=`
      <option value="local">ローカルAI</option>
      <option value="google">Google翻訳</option>
      <option value="openai">OpenAI</option>
    `;const a=localStorage.getItem("translationProvider");a==="local"||a==="google"||a==="openai"?i.value=a:i.value="local",i.addEventListener("change",g=>{const d=g.target.value;localStorage.setItem("translationProvider",d),u.log(`Translation provider set to ${d}`);});const c=document.createElement("div");c.appendChild(s),c.appendChild(i),t.appendChild(c);const h=document.createElement("label");h.textContent="OpenAIモデル:";const p=document.createElement("input");p.type="text",p.id="openai-model-input";const f=localStorage.getItem("openai_model");p.value=f??"gpt-oss-120b",p.addEventListener("change",g=>{const d=g.target.value.trim();d&&(localStorage.setItem("openai_model",d),u.log(`OpenAI model set to ${d}`));});const w=document.createElement("div");w.appendChild(h),w.appendChild(p),t.appendChild(w),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),u.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title="スレッドをコピー",e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}l.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),u.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(l.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${C.LOADING}`;return}if(l.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${C.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),l.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${C.CLIPBOARD}`;return}const e=l.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">選択ツイート(${e})をコピー</span>${C.COPY}`;return}if(l.startFromTweetId){const o=l.startFromTweetText.length>20?l.startFromTweetText.substring(0,20)+"...":l.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${C.COPY}`;return}t.innerHTML=`<span class="text">スレッドをコピー</span>${C.COPY}`;}showToast(t,e){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${e.substring(0,100)}</div>
    `,o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll(m.article).forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const o=this.extractTweetId(t);if(!o)return;const r=document.createElement("button");r.className="start-point-button",r.textContent="★",r.title="この位置からコピー開始",r.dataset.tweetId=o,l.startFromTweetId===o&&(r.classList.add("active"),r.textContent="✓",t.classList.add("start-point-set")),r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,o);}),t.appendChild(r);});}setStartPoint(t,e){l.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector(m.userName)?.innerText??"",r=t.querySelector(m.tweetText)?.innerText??"";l.startFromTweetId=e,l.startFromTweetAuthor=o,l.startFromTweetText=r,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${o}のツイートを起点に設定しました`),u.log(`Start point set: ${e} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");l.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){l.startFromTweetId=null,l.startFromTweetAuthor="",l.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),u.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const o=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},r=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,o();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const c=a.relatedTarget;c&&t.contains(c)||r();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",o),t.addEventListener("focusout",a=>{const c=a.relatedTarget;c&&t.contains(c)||r();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return u.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const r=this.ensureFloatingContainer(),s=r.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},r.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(i){u.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const r=this.floatingContainer;if(!r)return;const s=o.clientX-this.dragState.startX,i=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,r.classList.add("has-custom-position"),r.style.bottom="auto",r.style.right="auto";}const a=this.dragState.initialTop+i,c=this.dragState.initialLeft+s,{top:h,left:p}=this.clampPosition(a,c,r);this.applyPosition(h,p,r);});const e=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,o){const s=o.offsetHeight||0,i=o.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),c=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),c)}}applyPosition(t,e,o){const r=o??this.ensureFloatingContainer();r.style.top=`${t}px`,r.style.left=`${e}px`,r.style.bottom="auto",r.style.right="auto",r.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(u.warn("stored position is invalid",e),null)}catch(t){return u.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){u.warn("failed to save UI position",t);}}}const y=new ut;var ht=typeof GM_notification<"u"?GM_notification:void 0,pt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const ft=pt;function gt(n,t,e,o){ht({text:n,title:t,image:e,onclick:o});}const mt="https://twitter.com",wt="https://t.co",xt="https://video.twimg.com",N=n=>`${mt}/i/status/${n}`,Tt=n=>`${xt}/tweet_video/${n}.mp4`,yt=/https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/,bt=`${wt}/`,vt="https://translate.googleapis.com/translate_a/single";async function St(){try{const n=[],t=new Set;let e="",o="";const r=window.location.href,s=l.copyMode==="first";let i=!1;const a=window.scrollY;async function c(){if(i)return;const p=Array.from(document.querySelectorAll(m.article));p.length>0&&!e&&(e=B(p[0]),o=O(p[0]));for(const f of p){const w=f.querySelector(m.statusLink);if(!w)continue;const g=w.href.split("/"),d=g.indexOf("status");if(d===-1||d+1>=g.length)continue;const x=g[d+1].split("?")[0];if(t.has(x))continue;const T=B(f);if(e&&T!==e)continue;let b=O(f);T===e&&!b&&o&&(b=o);const E=f.querySelector(m.tweetText);let U="";E&&(U=await Z(E));const _=f.querySelector("time"),q=_?_.getAttribute("datetime"):"",ot=q?$t(new Date(q)):"",rt=It(f),it=await Ct(f),st=t.size===0?r:w.href?w.href.split("?")[0]:"";if(n.push({id:x,author:T,handle:b,text:U,time:ot,url:st,mediaUrls:rt,quotedTweet:it}),t.add(x),s){i=!0;break}}}async function h(){try{if(await D(),await c(),i)return;let w=n.length,g=0;for(let d=0;d<30;d++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(x=>setTimeout(x,700)),await D(),await c(),i)return;if(n.length===w){if(g++,g>=3)break}else w=n.length,g=0;}catch(x){u.error(`スクロール処理エラー (試行 ${d+1}): ${x.message}`);continue}try{window.scrollTo(0,a);}catch(d){u.error(`スクロール位置復元エラー: ${d.message}`);}}catch(w){throw u.error(`スクロール収集処理エラー: ${w.message}`),w}}return await h(),n.sort((p,f)=>{const w=new Date(p.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),g=new Date(f.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return w.getTime()-g.getTime()}),n}catch(n){return u.error(`ツイート収集中にエラーが発生: ${n.message}`),u.error(`エラースタック: ${n.stack}`),[]}}function O(n){try{const e=Array.from(n.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const o=Array.from(n.querySelectorAll(m.userLink));for(const s of o)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const r=n.querySelector(m.userName);if(r){const s=r.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return u.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function B(n){try{const t=n.querySelector(m.userNameLinkSpan);return t&&t.textContent?t.textContent.trim():""}catch(t){return u.error(`ユーザー名取得エラー: ${t.message}`),""}}async function Ct(n){const t=n.querySelector(m.quotedLink);let e=null;if(t)try{const o=t.closest(m.roleLink);o&&(e=await H(o));}catch(o){u.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=n.innerText||"",r=o.includes("引用")||o.includes("Quote")||o.includes("quote"),s=n.querySelectorAll(m.roleLink);if(s.length>0&&r)for(let i=0;i<s.length;i++){const a=s[i],c=a.innerText||"";if(c.includes("@")&&(c.includes("年")||c.includes("時間")||c.includes("分")||c.includes("日")))try{const h=await H(a);if(h&&h.author&&h.text){e=h;break}}catch(h){u.error(`代替引用ツイート抽出エラー: ${h.message}`);}}}catch(o){u.error(`代替引用ツイート検索エラー: ${o.message}`);}return e}async function H(n){const t=n.querySelector(m.quotedAuthor),e=t?t.textContent.trim():"",o=n.querySelector(m.quotedHandle),r=o?o.textContent.trim():"";let s="";const i=n.querySelector(m.tweetText);if(i)s=await Z(i);else {const g=(n.innerText||"").split(`
`).map(T=>T.trim()).filter(T=>T);let d=-1;for(let T=0;T<g.length;T++)if(g[T].includes(r)){d=T;break}const x=d+1;d>=0&&x<g.length&&(s=g.slice(x+1).join(`
`));}const a=[];n.querySelectorAll(m.tweetPhoto).forEach(w=>{const g=w.querySelector(m.tweetMediaImage);if(g){const d=I(g.src);d&&!a.includes(d)&&a.push(d);}}),a.length===0&&(n.querySelectorAll(m.roleGroup).forEach(d=>{d.querySelectorAll(m.tweetMediaImage).forEach(T=>{const b=I(T.src);b&&!a.includes(b)&&a.push(b);});}),n.querySelectorAll(m.tweetMediaImage).forEach(d=>{const x=I(d.src);x&&!a.includes(x)&&a.push(x);}));let h="",p="";const f=n.querySelectorAll(m.statusLink);for(const w of Array.from(f)){const g=w.href;if(g&&g.includes("/status/")){const d=g.split("/"),x=d.indexOf("status");if(x!==-1&&x+1<d.length){h=d[x+1].split("?")[0],p=g;break}}}return e&&s?{author:e,handle:r,text:s,id:h,url:p,mediaUrls:a}:null}function It(n){const t=[];return n.querySelectorAll(m.tweetPhoto).forEach(r=>{const s=r.querySelector(m.tweetMediaImage);if(s){const i=I(s.src);i&&!t.includes(i)&&t.push(i);}}),n.querySelectorAll("video").forEach(r=>{if(r.src&&r.src.startsWith("blob:"))try{if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=F(r.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=n.querySelector(m.statusLink);if(i){const a=i.href.split("/"),c=a.indexOf("status");if(c!==-1&&c+1<a.length){const h=a[c+1].split("?")[0],p=N(h);t.includes(p)||t.push(`[動画] ${p}`);}}}catch(i){u.error("Error processing blob URL: "+i);}else {if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=F(r.poster);i&&!t.includes(i)&&t.push(i);}r.src&&r.src.includes("video.twimg.com")&&(t.includes(r.src)||t.push(r.src));}r.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=n.querySelector(m.statusLink);if(a){const c=a.href.split("/"),h=c.indexOf("status");if(h!==-1&&h+1<c.length){const p=c[h+1].split("?")[0],f=N(p);t.includes(f)||t.push(`[動画] ${f}`);}}}});}),t.length===0&&n.querySelectorAll(m.roleGroup).forEach(s=>{s.querySelectorAll(m.tweetMediaImage).forEach(a=>{const c=I(a.src);c&&!t.includes(c)&&t.push(c);});}),t.length===0&&n.querySelectorAll(m.tweetMediaImage).forEach(s=>{const i=I(s.src);i&&!t.includes(i)&&t.push(i);}),t}function I(n){if(!n||typeof n!="string"||!n.includes("pbs.twimg.com/media"))return null;try{const t=n.match(/format=([^&]+)/),e=t?t[1]:"jpg",o=n.split("?")[0];if(!o||o.length===0)return u.error(`無効なベースURL: ${n}`),null;const r=o+"."+e;try{return new URL(r),r}catch(s){return u.error(`無効なURL形式: ${r}, エラー内容: ${s.message}`),null}}catch(t){return u.error(`メディアURL処理エラー: ${t.message}`),null}}function F(n){if(!n||!n.includes("tweet_video_thumb"))return null;try{const t=n.match(/tweet_video_thumb\/([^.]+)/);if(!t||!t[1])return null;const e=t[1];return Tt(e)}catch(t){return u.error(`動画URL生成エラー: ${t.message}`),null}}async function Z(n){try{const t=n.cloneNode(!0);return await At(t)}catch(t){return u.error(`ツイートテキスト取得エラー: ${t.message}`),n.innerText??""}}async function At(n){const t=Array.from(n.querySelectorAll("a[href]")),e=[];for(const o of t)if(Lt(o,o.textContent??"")){const r=o.getAttribute("href");r&&r.startsWith(bt)&&e.push(Et(r).then(s=>({anchor:o,resolvedUrl:s})));}if(e.length>0){const o=await Promise.all(e);for(const{anchor:r,resolvedUrl:s}of o)if(s){const i=document.createTextNode(s);r.replaceWith(i);}}return n.innerText}function Et(n){return new Promise(t=>{ft({method:"HEAD",url:n,timeout:1e4,onload:e=>{t(e.finalUrl||n);},onerror:()=>{t(n);},ontimeout:()=>{t(n);}});})}function Lt(n,t){const e=t.trim();return /^https?:\/\//i.test(e)||n.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(n.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function D(){try{const n=document.querySelectorAll(m.tweetButtonsWithinArticle);let t=0;for(const e of Array.from(n))try{const o=e.textContent?e.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest(m.tweetRoot)&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(o){u.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(n){return u.error(`ツイート展開処理エラー: ${n.message}`),0}}function $t(n){const t=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0"),r=String(n.getHours()).padStart(2,"0"),s=String(n.getMinutes()).padStart(2,"0");return `${t}年${e}月${o}日 ${r}:${s}`}const G=150,Pt=.9144,Mt=.453592,kt=3.78541,P="[0-9０-９]",Rt=`${P}{1,3}(?:[,，]${P}{3})*`,Ut=`${P}+`,_t=`(?:[\\.．]${P}+)?`,z=`(?:${Rt}|${Ut})${_t}`,V="(?:兆|億|万)",S=`${z}(?:${V}${z})*${V}?`,qt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<currencyPrefix>米|US|ＵＳ)?ドル`,"gu"),Nt=new RegExp(`(?<symbol>(?:US\\$|ＵＳ\\$|\\$))\\s*(?<amount>${S})(?!\\s*(?:米|US|ＵＳ)?ドル)`,"gu"),Ot=new RegExp(`(?<amount>${S})\\s*ヤード`,"gu"),Bt=new RegExp(`(?<amount>${S})\\s*ポンド`,"gu"),Ht=new RegExp(`(?<amount>${S})\\s*ガロン`,"gu"),Ft=new RegExp(`(?<amount>${S})\\s*(?<unit>(?:[kKｋＫmMｍＭgGｇＧtTｔＴ]?[wWｗＷ]|(?:キロ|メガ|ギガ|テラ)ワット))(?![A-Za-zａ-ｚＡ-Ｚ])`,"gu"),Dt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<unit>[kKｋＫmMｍＭgGｇＧtTｔＴbBｂＢ])(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu"),Gt=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${S})\\s*(?<unit>ミリオン|ビリオン|トリリオン|キロ|メガ|ギガ|テラ|million|Million|billion|Billion|trillion|Trillion|kilo|Kilo|mega|Mega|giga|Giga|tera|Tera)(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu");function zt(n){if(!n||n.length===0)return n;let t=n;return t=v(t,qt,["円","JPY"],e=>Y(e*G)),t=v(t,Nt,["円","JPY"],e=>Y(e*G)),t=v(t,Ot,["メートル","m","ｍ"],e=>`${R(e*Pt)}メートル`),t=v(t,Bt,["キログラム","kg","㎏","キロ"],e=>`${R(e*Mt)}キログラム`),t=v(t,Ht,["リットル","l","L","ℓ"],e=>`${R(e*kt)}リットル`),t=v(t,Ft,["ワット","W","w","Ｗ","ｗ"],(e,o,r)=>{const s=o.unit??"";if(Jt(r))return null;const i=jt(s);if(i===null)return null;const a=e*i;return $(a,"ワット")}),t=v(t,Dt,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=X(s);return i===null||W(s,r)?null:$(e*i)}),t=v(t,Gt,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=X(s);return i===null||W(s,r)?null:$(e*i)}),t}function v(n,t,e,o){const r=[...n.matchAll(t)];if(r.length===0)return n;let s="",i=0;for(const a of r){const c=a.index??0,h=c+a[0].length,p=n.slice(i,c);s+=p;const f=a.groups??{},w=f.amount??"",g=Xt(w),d=Vt(n,h);if(g===null){s+=a[0],d?(s+=d.whitespace+d.openChar+d.inside+d.closeChar,i=d.endIndex):i=h;continue}if(d&&e.some(b=>d.inside.includes(b))){s+=a[0],s+=d.whitespace+d.openChar+d.inside+d.closeChar,i=d.endIndex;continue}const T=o(g,f,{text:n,match:a,startIndex:c,endIndex:h,followingParentheses:d});if(T===null){s+=a[0],d?(s+=d.whitespace+d.openChar+d.inside+d.closeChar,i=d.endIndex):i=h;continue}if(d){const b=d.inside.trim(),E=b.length>0?`${T}、${b}`:T;s+=a[0]+d.whitespace+d.openChar+E+d.closeChar,i=d.endIndex;}else s+=`${a[0]}（${T}）`,i=h;}return s+=n.slice(i),s}function Vt(n,t){let e=t,o="";for(;e<n.length;){const c=n[e];if(Yt(c)){o+=c,e+=1;continue}break}if(e>=n.length)return null;const r=n[e];if(r!=="("&&r!=="（")return null;const s=r==="("?")":"）",i=Wt(n,e,r,s);if(i===-1)return null;const a=n.slice(e+1,i);return {whitespace:o,openChar:r,closeChar:s,inside:a,endIndex:i+1}}function Wt(n,t,e,o){let r=0;for(let s=t;s<n.length;s+=1){const i=n[s];if(i===e)r+=1;else if(i===o&&(r-=1,r===0))return s}return  -1}function Yt(n){return /\s/u.test(n)}function W(n,t){if(!Qt(n))return  false;const e=t.text.slice(t.endIndex,t.endIndex+6);return /^(?:バイト|ビット|ヘルツ|メートル|リットル|グラム|ワット|ジュール|パスカル|ボルト|アンペア)/u.test(e)}function Xt(n){if(!n)return null;const t=n.replace(/[０-９]/gu,a=>String.fromCharCode(a.charCodeAt(0)-65248)).replace(/[，]/gu,",").replace(/[．]/gu,".").replace(/,/gu,"").replace(/\s+/gu,"");if(t.length===0)return null;const e=/(\d+(?:\.\d+)?)(兆|億|万)?/gu;let o=0,r=false,s=null,i;for(;(i=e.exec(t))!==null;){if(i[0].length===0)continue;const a=Number.parseFloat(i[1]);if(Number.isNaN(a))return null;r=true;const c=i[2];c?o+=a*Kt(c):s=a;}return r?(s!==null&&(o+=s),o):null}function Kt(n){switch(n){case "万":return 1e4;case "億":return 1e8;case "兆":return 1e12;default:return 1}}function $(n,t=""){const e=Math.abs(n),o=[{threshold:1e12,divisor:1e12,suffix:`兆${t}`},{threshold:1e8,divisor:1e8,suffix:`億${t}`},{threshold:1e4,divisor:1e4,suffix:`万${t}`}];for(const r of o)if(e>=r.threshold){const s=n/r.divisor;return `${A(s)}${r.suffix}`}return t.length>0?`${A(n)}${t}`:A(n)}function Y(n){return $(n,"円")}function R(n){return Math.abs(n)<1?A(n,3):A(n,2)}function A(n,t){const e=Math.abs(n);let o=t;o===void 0&&(e>=100?o=0:e>=10?o=1:e>=1?o=2:o=3);const r=Number.isFinite(n)?Number.parseFloat(n.toFixed(o)):0;return new Intl.NumberFormat("ja-JP",{maximumFractionDigits:o,minimumFractionDigits:0}).format(r)}function jt(n){if(!n)return null;const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\s+/gu,"");if(t.length===0)return null;const e=t.toUpperCase(),o=t[0];if(e==="KW"&&(o==="K"||o==="k"))return 1e3;if(e==="MW"&&o==="M")return 1e6;if(e==="GW"&&o==="G")return 1e9;if(e==="TW"&&o==="T")return 1e12;if(e==="W"&&(o==="W"||o==="w"))return 1;switch(t){case "ワット":return 1;case "キロワット":return 1e3;case "メガワット":return 1e6;case "ギガワット":return 1e9;case "テラワット":return 1e12;default:return null}}function Jt(n){return n.text.slice(n.endIndex,n.endIndex+1)==="時"}function X(n){switch(n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase()){case "k":case "kilo":case "キロ":return 1e3;case "m":case "mega":case "million":case "ミリオン":case "メガ":return 1e6;case "b":case "billion":case "g":case "giga":case "ビリオン":case "ギガ":return 1e9;case "t":case "tera":case "trillion":case "テラ":case "トリリオン":return 1e12;default:return null}}function Qt(n){const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase();return t==="k"||t==="kilo"||t==="キロ"||t==="m"||t==="mega"||t==="メガ"||t==="g"||t==="giga"||t==="ギガ"||t==="t"||t==="tera"||t==="テラ"}const Zt="http://localhost:3002/v1/chat/completions",te=vt,tt="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",ee=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function ne(){const n=localStorage.getItem("translationProvider");return n==="local"||n==="google"||n==="openai"?n:"local"}async function oe(n){const t=n.map(he),e=t.map(i=>({tweet:i,textSegments:J(i.text),quotedSegments:i.quotedTweet?J(i.quotedTweet.text):null})),o=[];let r=false;for(const i of e){for(const a of i.textSegments)K(a,o);if(i.quotedSegments)for(const a of i.quotedSegments)K(a,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<o.length;i++){const a=o[i];try{const{text:h,provider:p}=await ae(a.original),f=p==="none"?h:zt(h);a.translated=f,p==="local"&&(r=!0),!s&&f!==a.original&&(s=!0);}catch(h){u.error(`セグメント翻訳に失敗: ${h.message}`),a.translated=a.original;}i<o.length-1&&await nt(1e3+Math.random()*500);}for(const i of e)i.tweet.text=j(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=j(i.quotedSegments));return r&&gt("ローカルAIでの翻訳が完了しました。","Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function K(n,t){if(n.kind==="text"){if(n.original.trim().length===0){n.translated=n.original;return}t.push(n);}}function j(n){if(n.length===0)return "";let t="";for(const e of n)if(e.kind==="fixed"){const o=e.value;et(o)&&(t=se(t)),t+=o;}else t+=e.translated??e.original;return t}function J(n){if(!n)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let o=0,r;for(;(r=t.exec(n))!==null;)r.index>o&&e.push({kind:"text",original:n.slice(o,r.index)}),e.push({kind:"fixed",value:re(r[0])}),o=r.index+r[0].length;return o<n.length&&e.push({kind:"text",original:n.slice(o)}),e.length===0&&e.push({kind:"text",original:n}),e}function re(n){if(et(n)){const t=ie(n);return t.length>0?t:n}return n}function et(n){return /^https?:\/\//i.test(n.trim())}function ie(n){return n.replace(ee,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function se(n){return n.length===0?n:n.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function ae(n){if(n.trim().length===0)return {text:n,provider:"none"};const t=ne();if(t==="local"){const e=await le(n);return e?{text:e,provider:"local"}:{text:n,provider:"none"}}if(t==="google")try{return {text:await ce(n),provider:"google"}}catch(e){return u.error(`Google翻訳にも失敗しました: ${e.message}`),{text:n,provider:"none"}}if(t==="openai"){de();const e=await ue(n);return e?{text:e,provider:"openai"}:{text:n,provider:"none"}}return {text:n,provider:"none"}}async function le(n){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${n}
<|plamo:op|>output lang=ja`,e=await new Promise((s,i)=>{GM_xmlhttpRequest({method:"POST",url:Zt,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:tt},{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:a=>a.status>=200&&a.status<300?s(a):i(new Error(`API error: ${a.status}`)),onerror:a=>i(a),ontimeout:()=>i(new Error("Timeout"))});}),r=JSON.parse(e.responseText)?.choices?.[0]?.message?.content;if(r&&r.trim().length>0)return u.log("ローカルAIでの翻訳に成功しました。"),r;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return u.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function ce(n){const t="auto";let o=0;const r=3;for(;o<r;)try{const s=`${te}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(n)}`,i=await new Promise((h,p)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:f=>f.status>=200&&f.status<300?h(f):p(new Error(`API error: ${f.status}`)),onerror:f=>p(f),ontimeout:()=>p(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const c=a.sentences.map(h=>h?.trans??"").join("");if(!c.trim())throw new Error("Translation result is empty");return c}catch(s){if(o++,u.error(`Google翻訳試行 ${o}/${r} 失敗: ${s.message}`),o>=r)throw s;await nt(1e3*Math.pow(2,o));}throw new Error("Google翻訳に失敗しました。")}function de(){const n="openai_api_key",t="openai_endpoint",e="openai_model";if(!localStorage.getItem(n)){const o=prompt("OpenAI APIキーを入力してください");o&&localStorage.setItem(n,o);}if(!localStorage.getItem(t)){const o=prompt("OpenAI APIエンドポイント(URL)を入力してください(例:https://api.cerebras.ai/v1/chat/completions)");o&&localStorage.setItem(t,o);}if(!localStorage.getItem(e)){const o=prompt("OpenAIモデル名を入力してください (例: gpt-oss-120b)");o&&localStorage.setItem(e,o);}}async function ue(n){const t=localStorage.getItem("openai_api_key"),e=localStorage.getItem("openai_endpoint"),o=localStorage.getItem("openai_model")??"gpt-oss-120b";if(!t||!e)return u.error("OpenAI の設定が不足しています。"),null;try{const r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:o,messages:[{role:"system",content:tt},{role:"user",content:n}],temperature:0})});if(!r.ok)throw new Error(`API error: ${r.status}`);const i=(await r.json())?.choices?.[0]?.message?.content;if(i&&i.trim().length>0)return u.log("OpenAIでの翻訳に成功しました。"),i;throw new Error("OpenAI translation result is empty")}catch(r){return u.error(`OpenAI翻訳に失敗: ${r.message}`),null}}function he(n){return {...n,mediaUrls:[...n.mediaUrls],quotedTweet:n.quotedTweet?{...n.quotedTweet,mediaUrls:[...n.quotedTweet.mediaUrls]}:null}}async function nt(n){await new Promise(t=>setTimeout(t,n));}function M(n){let t=`${n.author} ${n.handle}
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
`;}return t}function pe(n,t){if(!n||n.length===0)return "";let e="";const o=`

---

`;for(let r=0;r<n.length;r++){const s=n[r],i=M(s),a=r===0?i:o+i;if(e.length+a.length>t){const c=t-e.length;c>o.length&&(e+=a.substring(0,c-3)+"...");break}e+=a;}return e}const fe=/https?:\/\/[^\s]+/g;class ge{hasThreadUrlIncluded=false;remainingMediaSlots=5;consumeThreadUrl(t){return !t||this.hasThreadUrlIncluded?null:(this.hasThreadUrlIncluded=true,t)}consumeMediaUrls(t){if(this.remainingMediaSlots<=0)return [];const o=t.filter(r=>r.trim().length>0).slice(0,this.remainingMediaSlots);return this.remainingMediaSlots-=o.length,o}}function Q(n){if(!n)return "";const e=n.replace(fe,"").replace(/[ \t]+\n/g,`
`).split(`
`).map(o=>o.replace(/[ \t]{2,}/g," ").trim());for(let o=e.length-1;o>=0&&e[o]==="";o--)e.pop();return e.join(`
`)}function me(n,t){const e=[];e.push(`${n.author} ${n.handle}`);const o=Q(n.text);o.length>0?e.push(o):e.push(""),e.push(n.time);const r=t.consumeThreadUrl(n.url);r&&e.push(r);const s=t.consumeMediaUrls(n.mediaUrls);if(s.length>0&&e.push(...s),n.quotedTweet){const{quotedTweet:i}=n;if(i){const a=[];a.push(`> 引用元: ${i.author} ${i.handle}`);const c=Q(i.text);c.length>0&&a.push(...c.split(`
`).map(p=>`> ${p}`));const h=t.consumeMediaUrls(i.mediaUrls);h.length>0&&a.push(...h.map(p=>`> ${p}`)),a.length>0&&(e.push(""),e.push(...a));}}return `${e.join(`
`)}
`}function we(n,t){if(!n||n.length===0)return "";const e=new ge;let o="";const r=`

---

`;for(let s=0;s<n.length;s++){const i=n[s],a=me(i,e),c=s===0?a:r+a;if(o.length+c.length>t){const h=t-o.length;h>r.length&&(o+=c.substring(0,h-3)+"...");break}o+=c;}return o}function xe(n){if(!n||n.length===0)return "";let t=M(n[0]);for(let e=1;e<n.length;e++)t+=`

---

`+M(n[e]);return t}function Te(n,t,e,o=null){let r="";if(o&&(r+=`${o}のツイートから`),n.length>0){const s=n[0].author;r+=`${s}のスレッド`;}return r+=`(${n.length}件)をコピーしました。`,r+=`文字数: ${ye(t.length)}`,(e==="shitaraba"||e==="5ch")&&(r+=`/${e==="shitaraba"?4096:2048}`),r}function ye(n){return n<1e3?n.toString():n<1e4?(n/1e3).toFixed(1)+"k":Math.round(n/1e3)+"k"}async function be(n){if(!n||!n.formattedText){const o=n?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return u.error(`クリップボードコピー失敗: ${o}`),y.showToast("エラー",o),false}if(n.formattedText.trim().length===0)return u.error("クリップボードコピー失敗: formattedTextが空です"),y.showToast("エラー","コピーするテキストが空です"),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([n.formattedText],{type:"text/plain"}),r=new window.ClipboardItem({"text/plain":o});await navigator.clipboard.write([r]),t=!0;}catch(o){e=o,u.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(n.formattedText),t=!0;}catch(o){e=o,u.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=n.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){e=o,u.error(`execCommand fallback失敗: ${e.message}`);}if(t)y.showToast("コピーしました",n.summary);else {const o=e?e.message:"不明なエラー";u.error(`クリップボードコピー失敗: ${o}`),y.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class ve{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),u.log("Application initialized.");}catch(t){u.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){l.collectedThreadData&&(await be(l.collectedThreadData),l.isSecondStage=!1,l.collectedThreadData=null,y.updateMainButtonText());return}if(l.isCollecting)return;l.isCollecting=!0,y.updateMainButtonText();try{const e=await St();let o=e;const r=l.selectedTweetIds??[];if(r.length>0){const h=new Map(e.map(f=>[f.id,f])),p=[];for(const f of r){const w=h.get(f);w&&p.push(w);}if(o=p,o.length===0){u.warn("選択済みツイートを取得できませんでした。"),l.collectedThreadData=null,l.isSecondStage=!1,y.showToast("選択エラー","選択したツイートが見つかりませんでした。再度読み込みしてください。");return}}else if(l.startFromTweetId){const h=e.findIndex(p=>p.id===l.startFromTweetId);h!==-1&&(o=e.slice(h));}let s="",i=o,a=!1;if(o.length>0){if(l.translateEnabled)try{l.translationInProgress=!0,y.updateMainButtonText(),y.showToast("翻訳中","翻訳処理を実行しています...");const h=await oe(o);i=h.tweets,a=h.hasTranslation;}catch(h){u.error(`Translation error: ${h}`),y.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=o,a=!1;}finally{l.translationInProgress=!1;}switch(l.copyMode){case "first":s=M(i[0]);break;case "shitaraba":s=we(i,4096);break;case "5ch":s=pe(i,2048);break;default:s=xe(i);break}}let c=Te(o,s,l.copyMode,r.length===0?l.startFromTweetAuthor:null);l.translateEnabled&&a&&s.trim().length>0&&(c+=" (翻訳済み)"),l.collectedThreadData={formattedText:s,summary:c},l.isSecondStage=!0,y.showToast("準備完了",`${c} クリックしてコピーしてください`);}catch(e){u.error(`Error in copy process: ${e}`),y.showToast("エラー","スレッドのコピーに失敗しました");}finally{l.isCollecting=!1,l.translationInProgress=!1,y.updateMainButtonText();}}catch(e){u.error(`Button click handler error: ${e}`),y.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(y.init(),y.addMainButton(this.handleButtonClick.bind(this)),y.updateAllUI()):y.destroy();}isTwitterStatusPage(){return yt.test(location.href)}observeUrlChanges(){let t=location.href;const e=i=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${i}): ${t}`));},o=history.pushState;history.pushState=function(...i){o.apply(this,i),e("pushState");};const r=history.replaceState;history.replaceState=function(...i){r.apply(this,i),e("replaceState");},window.addEventListener("popstate",()=>e("popstate")),new MutationObserver(()=>e("mutation")).observe(document.body,{childList:true,subtree:true});}}new ve;

})();