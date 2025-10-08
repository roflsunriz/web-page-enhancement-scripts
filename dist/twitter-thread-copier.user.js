// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.5.1
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
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const S="[TwitterThreadCopier]",c={log:e=>{console.log(S,e);},error:e=>{console.error(S,e);},warn:(e,t)=>{t?console.warn(S,e,t):console.warn(S,e);}};function j(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const d=j();var X="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",Q="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",J="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function L(e,t=24){const o=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const v={LOADING:L(J),CLIPBOARD:L(X),COPY:L(Q)};class K{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:o}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,o,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
      .copy-thread-button.ready { background-color: #1DA1F2; }
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),c.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const o=document.createElement("select");o.id="copy-mode-select",o.innerHTML=`
      <option value="all">全て</option>
      <option value="first">最初</option>
      <option value="shitaraba">4K</option>
      <option value="5ch">2K</option>
    `,o.value=d.copyMode,o.addEventListener("change",i=>{d.copyMode=i.target.value,c.log(`Copy mode changed to: ${d.copyMode}`);}),t.appendChild(o);const r=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=d.translateEnabled,n.addEventListener("change",i=>{d.translateEnabled=i.target.checked,c.log(`Translation ${d.translateEnabled?"enabled":"disabled"}`);}),r.appendChild(n),r.appendChild(document.createTextNode("翻訳")),t.appendChild(r),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const o=document.createElement("button");o.className="copy-thread-button",o.id="twitter-thread-copier-button",o.title="スレッドをコピー",o.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}d.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(o),this.mainButton=o,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(o),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(d.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${v.LOADING}`;return}if(d.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${v.LOADING}`;return}if(t.classList.remove("loading"),d.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${v.CLIPBOARD}`;else if(d.startFromTweetId){const o=d.startFromTweetText.length>20?d.startFromTweetText.substring(0,20)+"...":d.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${v.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${v.COPY}`;}}showToast(t,o){let r=this.querySelector(".copy-toast");r||(r=document.createElement("div"),r.className="copy-toast",this.appendChild(r)),r.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${o.substring(0,100)}</div>
    `,r.classList.remove("visible"),setTimeout(()=>{r?.classList.add("visible"),setTimeout(()=>{r?.classList.remove("visible"),setTimeout(()=>r?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const r=t.querySelector('a[href*="/status/"]');if(!r)return;const n=r.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const i=document.createElement("button");i.className="start-point-button",i.textContent="★",i.title="この位置からコピー開始",i.dataset.tweetId=n,d.startFromTweetId===n&&(i.classList.add("active"),i.textContent="✓",t.classList.add("start-point-set")),i.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(i);});}setStartPoint(t,o){d.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(s=>{s.classList.remove("start-point-set");const a=s.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const r=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";d.startFromTweetId=o,d.startFromTweetAuthor=r,d.startFromTweetText=n,t.classList.add("start-point-set");const i=t.querySelector(".start-point-button");i&&(i.classList.add("active"),i.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${r}のツイートを起点に設定しました`),c.log(`Start point set: ${o} by ${r}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");d.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){d.startFromTweetId=null,d.startFromTweetAuthor="",d.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const o=t.querySelector(".start-point-button");o&&(o.classList.remove("active"),o.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),o=this.controlPanel;o.classList.add("hover-hidden");const r=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},n=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},i=()=>{this.hoverPointerCount+=1,r();},s=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const l=a.relatedTarget;l&&t.contains(l)||n();};this.mainButton.addEventListener("pointerenter",i),this.mainButton.addEventListener("pointerleave",s),o.addEventListener("pointerenter",i),o.addEventListener("pointerleave",s),t.addEventListener("focusin",r),t.addEventListener("focusout",a=>{const l=a.relatedTarget;l&&t.contains(l)||n();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const o=document.activeElement;return !!o&&t.contains(o)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return c.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const o=this.loadPosition();o&&(this.customPosition=o,this.applyPosition(o.top,o.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",r=>{if(!r.isPrimary)return;const n=this.ensureFloatingContainer(),i=n.getBoundingClientRect();this.dragState={pointerId:r.pointerId,startX:r.clientX,startY:r.clientY,initialTop:this.customPosition?.top??i.top,initialLeft:this.customPosition?.left??i.left,moved:false},n.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(r.pointerId);}catch(s){c.warn("pointer capture failed",s);}}),t.addEventListener("pointermove",r=>{if(!this.dragState||r.pointerId!==this.dragState.pointerId)return;const n=this.floatingContainer;if(!n)return;const i=r.clientX-this.dragState.startX,s=r.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(i)<4&&Math.abs(s)<4)return;this.dragState.moved=true,n.classList.add("has-custom-position"),n.style.bottom="auto",n.style.right="auto";}const a=this.dragState.initialTop+s,l=this.dragState.initialLeft+i,{top:h,left:m}=this.clampPosition(a,l,n);this.applyPosition(h,m,n);});const o=r=>{!this.dragState||r.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(r.pointerId)&&t.releasePointerCapture(r.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o);}clampPosition(t,o,r){const i=r.offsetHeight||0,s=r.offsetWidth||0,a=Math.max(16,window.innerHeight-i-16),l=Math.max(16,window.innerWidth-s-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,o),l)}}applyPosition(t,o,r){const n=r??this.ensureFloatingContainer();n.style.top=`${t}px`,n.style.left=`${o}px`,n.style.bottom="auto",n.style.right="auto",n.classList.add("has-custom-position"),this.customPosition={top:t,left:o},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const o=JSON.parse(t);return typeof o.top=="number"&&typeof o.left=="number"&&Number.isFinite(o.top)&&Number.isFinite(o.left)?{top:o.top,left:o.left}:(c.warn("stored position is invalid",o),null)}catch(t){return c.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){c.warn("failed to save UI position",t);}}}const y=new K;async function Z(){try{let e=function(){if(a)return;const m=Array.from(document.querySelectorAll('article[data-testid="tweet"]'));m.length>0&&!r&&(r=k(m[0]),n=I(m[0]));for(const p of m){const w=p.querySelector('a[href*="/status/"]');if(!w)continue;const f=w.href.split("/"),u=f.indexOf("status");if(u===-1||u+1>=f.length)continue;const g=f[u+1].split("?")[0];if(o.has(g))continue;const x=k(p);if(r&&x!==r)continue;let b=I(p);x===r&&!b&&n&&(b=n);const A=p.querySelector('div[data-testid="tweetText"]');let E="";A&&(E=D(A));const $=p.querySelector("time"),P=$?$.getAttribute("datetime"):"",z=P?st(new Date(P)):"",W=et(p),Y=tt(p),G=o.size===0?i:w.href?w.href.split("?")[0]:"";if(t.push({id:g,author:x,handle:b,text:E,time:z,url:G,mediaUrls:W,quotedTweet:Y}),o.add(g),s){a=!0;break}}};const t=[],o=new Set;let r="",n="";const i=window.location.href,s=d.copyMode==="first";let a=!1;const l=window.scrollY;async function h(){try{if(await B(),e(),a)return;let w=t.length,f=0;for(let u=0;u<30;u++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(g=>setTimeout(g,700)),await B(),e(),a)return;if(t.length===w){if(f++,f>=3)break}else w=t.length,f=0;}catch(g){c.error(`スクロール処理エラー (試行 ${u+1}): ${g.message}`);continue}try{window.scrollTo(0,l);}catch(u){c.error(`スクロール位置復元エラー: ${u.message}`);}}catch(w){throw c.error(`スクロール収集処理エラー: ${w.message}`),w}}return await h(),t.sort((m,p)=>{const w=new Date(m.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),f=new Date(p.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return w.getTime()-f.getTime()}),t}catch(e){return c.error(`ツイート収集中にエラーが発生: ${e.message}`),c.error(`エラースタック: ${e.stack}`),[]}}function I(e){try{const o=Array.from(e.querySelectorAll("span")).find(i=>{try{const s=i.textContent?i.textContent.trim():"";return s.startsWith("@")&&!s.includes(" ")&&s.length>1}catch{return !1}});if(o)return o.textContent.trim();const r=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const i of r)try{const s=i.getAttribute("href");if(s&&!s.includes("/status/")&&s.length>1&&!s.includes("/i/"))return "@"+s.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const i=n.querySelectorAll("span");for(const s of Array.from(i))try{const a=s.textContent?s.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function k(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}function tt(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let o=null;if(t)try{const r=t.closest('div[role="link"]');r&&(o=q(r));}catch(r){c.error(`引用ツイート取得エラー: ${r.message}`);}else try{const r=e.innerText||"",n=r.includes("引用")||r.includes("Quote")||r.includes("quote"),i=e.querySelectorAll('div[role="link"]');if(i.length>0&&n)for(let s=0;s<i.length;s++){const a=i[s],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const h=q(a);if(h&&h.author&&h.text){o=h;break}}catch(h){c.error(`代替引用ツイート抽出エラー: ${h.message}`);}}}catch(r){c.error(`代替引用ツイート検索エラー: ${r.message}`);}return o}function q(e){const t=e.querySelector('div[dir="ltr"] > span'),o=t?t.textContent.trim():"",r=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=r?r.textContent.trim():"";let i="";const s=e.querySelector('div[data-testid="tweetText"]');if(s)i=D(s);else {const f=(e.innerText||"").split(`
`).map(x=>x.trim()).filter(x=>x);let u=-1;for(let x=0;x<f.length;x++)if(f[x].includes(n)){u=x;break}const g=u+1;u>=0&&g<f.length&&(i=f.slice(g+1).join(`
`));}const a=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(w=>{const f=w.querySelector('img[src*="pbs.twimg.com/media"]');if(f){const u=T(f.src);u&&!a.includes(u)&&a.push(u);}}),a.length===0&&(e.querySelectorAll('[role="group"]').forEach(u=>{u.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(x=>{const b=T(x.src);b&&!a.includes(b)&&a.push(b);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(u=>{const g=T(u.src);g&&!a.includes(g)&&a.push(g);}));let h="",m="";const p=e.querySelectorAll('a[href*="/status/"]');for(const w of Array.from(p)){const f=w.href;if(f&&f.includes("/status/")){const u=f.split("/"),g=u.indexOf("status");if(g!==-1&&g+1<u.length){h=u[g+1].split("?")[0],m=f;break}}}return o&&i?{author:o,handle:n,text:i,id:h,url:m,mediaUrls:a}:null}function et(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const i=n.querySelector('img[src*="pbs.twimg.com/media"]');if(i){const s=T(i.src);s&&!t.includes(s)&&t.push(s);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=M(n.poster);if(a&&!t.includes(a)){t.push(a);return}}const s=e.querySelector('a[href*="/status/"]');if(s){const a=s.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const m=`https://twitter.com/i/status/${a[l+1].split("?")[0]}`;t.includes(m)||t.push(`[動画] ${m}`);}}}catch(s){c.error("Error processing blob URL: "+s);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const s=M(n.poster);s&&!t.includes(s)&&t.push(s);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(s=>{if(s.src&&s.src.includes("video.twimg.com"))t.includes(s.src)||t.push(s.src);else if(s.src&&s.src.startsWith("blob:")){const a=e.querySelector('a[href*="/status/"]');if(a){const l=a.href.split("/"),h=l.indexOf("status");if(h!==-1&&h+1<l.length){const p=`https://twitter.com/i/status/${l[h+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(i=>{i.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const l=T(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const s=T(i.src);s&&!t.includes(s)&&t.push(s);}),t}function T(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),o=t?t[1]:"jpg",r=e.split("?")[0];if(!r||r.length===0)return c.error(`無効なベースURL: ${e}`),null;const n=r+"."+o;try{return new URL(n),n}catch(i){return c.error(`無効なURL形式: ${n}, エラー内容: ${i.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function M(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}const ot=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function D(e){try{const t=e.cloneNode(!0);rt(t);const o=t.querySelector('[role="button"]');if(o){const r=o.textContent?.trim()??"";if(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)){const n=[],i=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null);let s;for(;s=i.nextNode();)s.textContent?.trim()&&s.parentElement&&!s.parentElement.closest('[role="button"]')&&n.push(s.textContent);return H(n,t).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return H([t.innerText],t)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function H(e,t){try{const o=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return o.length>1?o.map(r=>r.textContent?.trim()??"").filter(r=>!r.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(o){return c.error(`改行保持処理エラー: ${o.message}`),e.join(" ").trim()}}function rt(e){const t=Array.from(e.querySelectorAll("a[href]"));for(const o of t){const r=nt(o);if(r===null)continue;const i=(e.ownerDocument??document).createTextNode(r);o.replaceWith(i);}}function nt(e){const t=e.textContent??"";if(!t)return null;if(!it(e,t))return t;const o=e.getAttribute("data-expanded-url")??e.getAttribute("data-url")??e.getAttribute("title")??e.getAttribute("href")??t,r=U(o);if(r.length>0)return r;const n=U(t);return n.length>0?n:t}function it(e,t){const o=t.trim();return /^https?:\/\//i.test(o)||e.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(e.getAttribute("href")??"")?!(o.startsWith("@")||o.startsWith("#")):false}function U(e){return e.replace(ot,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}async function B(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const o of Array.from(e))try{const r=o.textContent?o.textContent.trim():"";(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)||r.match(/show more/i))&&!o.hasAttribute("href")&&!o.querySelector("a")&&o.closest('[data-testid="tweet"]')&&o.click&&(o.click(),t++,await new Promise(i=>setTimeout(i,100)));}catch(r){c.error(`個別ツイート展開エラー: ${r.message}`);continue}return t}catch(e){return c.error(`ツイート展開処理エラー: ${e.message}`),0}}function st(e){const t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0");return `${t}年${o}月${r}日 ${n}:${i}`}const at="http://localhost:3002/v1/chat/completions",lt="https://translate.googleapis.com/translate_a/single",ct="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",dt=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;async function ut(e){const t=e.map(yt),o=t.map(i=>({tweet:i,textSegments:N(i.text),quotedSegments:i.quotedTweet?N(i.quotedTweet.text):null})),r=[];for(const i of o){for(const s of i.textSegments)F(s,r);if(i.quotedSegments)for(const s of i.quotedSegments)F(s,r);}if(r.length===0)return {tweets:t,hasTranslation:false};let n=false;for(let i=0;i<r.length;i++){const s=r[i];try{const l=await mt(s.original);s.translated=l,!n&&l!==s.original&&(n=!0);}catch(l){c.error(`セグメント翻訳に失敗: ${l.message}`),s.translated=s.original;}i<r.length-1&&await _(1e3+Math.random()*500);}for(const i of o)i.tweet.text=R(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=R(i.quotedSegments));return {tweets:t,hasTranslation:n}}function F(e,t){if(e.kind==="text"){if(e.original.trim().length===0){e.translated=e.original;return}t.push(e);}}function R(e){if(e.length===0)return "";let t="";for(const o of e)if(o.kind==="fixed"){const r=o.value;V(r)&&(t=ft(t)),t+=r;}else t+=o.translated??o.original;return t}function N(e){if(!e)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,o=[];let r=0,n;for(;(n=t.exec(e))!==null;)n.index>r&&o.push({kind:"text",original:e.slice(r,n.index)}),o.push({kind:"fixed",value:ht(n[0])}),r=n.index+n[0].length;return r<e.length&&o.push({kind:"text",original:e.slice(r)}),o.length===0&&o.push({kind:"text",original:e}),o}function ht(e){if(V(e)){const t=pt(e);return t.length>0?t:e}return e}function V(e){return /^https?:\/\//i.test(e.trim())}function pt(e){return e.replace(dt,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function ft(e){return e.length===0?e:e.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function mt(e){if(e.trim().length===0)return e;const t=await gt(e);if(t)return t;try{return await wt(e)}catch(o){return c.error(`Google翻訳にも失敗しました: ${o.message}`),e}}async function gt(e){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${e}
<|plamo:op|>output lang=ja`,o=await new Promise((i,s)=>{GM_xmlhttpRequest({method:"POST",url:at,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:ct},{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:a=>a.status>=200&&a.status<300?i(a):s(new Error(`API error: ${a.status}`)),onerror:a=>s(a),ontimeout:()=>s(new Error("Timeout"))});}),n=JSON.parse(o.responseText)?.choices?.[0]?.message?.content;if(n&&n.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),n;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function wt(e){const t="auto";let r=0;const n=3;for(;r<n;)try{const i=`${lt}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(e)}`,s=await new Promise((h,m)=>{GM_xmlhttpRequest({method:"GET",url:i,timeout:15e3,onload:p=>p.status>=200&&p.status<300?h(p):m(new Error(`API error: ${p.status}`)),onerror:p=>m(p),ontimeout:()=>m(new Error("Timeout"))});}),a=JSON.parse(s.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(h=>h?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(i){if(r++,c.error(`Google翻訳試行 ${r}/${n} 失敗: ${i.message}`),r>=n)throw i;await _(1e3*Math.pow(2,r));}throw new Error("Google翻訳に失敗しました。")}function yt(e){return {...e,mediaUrls:[...e.mediaUrls],quotedTweet:e.quotedTweet?{...e.quotedTweet,mediaUrls:[...e.quotedTweet.mediaUrls]}:null}}async function _(e){await new Promise(t=>setTimeout(t,e));}function C(e){let t=`${e.author} ${e.handle}
${e.text}
${e.time}
`;if(e.url&&(t+=`${e.url}
`),e.mediaUrls.length>0&&(t+=e.mediaUrls.join(`
`)+`
`),e.quotedTweet){const o=e.quotedTweet;t+=`
> 引用元: ${o.author} ${o.handle}
`,t+=`> ${o.text.replace(/\n/g,`
> `)}
`,o.mediaUrls.length>0&&(t+=`> ${o.mediaUrls.join(`
> `)}
`),t+=`> ${o.url}
`;}return t}function O(e,t){if(!e||e.length===0)return "";let o="";const r=`

---

`;for(let n=0;n<e.length;n++){const i=e[n],s=C(i),a=n===0?s:r+s;if(o.length+a.length>t){const l=t-o.length;l>r.length&&(o+=a.substring(0,l-3)+"...");break}o+=a;}return o}function xt(e){if(!e||e.length===0)return "";let t=C(e[0]);for(let o=1;o<e.length;o++)t+=`

---

`+C(e[o]);return t}function bt(e,t,o,r=null){let n="";if(r&&(n+=`${r}のツイートから`),e.length>0){const i=e[0].author;n+=`${i}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${Tt(t.length)}`,(o==="shitaraba"||o==="5ch")&&(n+=`/${o==="shitaraba"?4096:2048}`),n}function Tt(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function vt(e){if(!e||!e.formattedText){const r=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${r}`),y.showToast("エラー",r),false}if(e.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),y.showToast("エラー","コピーするテキストが空です"),false;let t=false,o=null;if(navigator.clipboard&&window.ClipboardItem)try{const r=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":r});await navigator.clipboard.write([n]),t=!0;}catch(r){o=r,c.error(`ClipboardItem API失敗: ${o.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(r){o=r,c.error(`Navigator clipboard API失敗: ${o.message}`);}if(!t)try{const r=document.createElement("textarea");if(r.value=e.formattedText,r.style.position="fixed",r.style.left="-9999px",document.body.appendChild(r),r.select(),t=document.execCommand("copy"),document.body.removeChild(r),!t)throw new Error("execCommand returned false")}catch(r){o=r,c.error(`execCommand fallback失敗: ${o.message}`);}if(t)y.showToast("コピーしました",e.summary);else {const r=o?o.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${r}`),y.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class St{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){d.collectedThreadData&&(await vt(d.collectedThreadData),d.isSecondStage=!1,d.collectedThreadData=null,y.updateMainButtonText());return}if(d.isCollecting)return;d.isCollecting=!0,y.updateMainButtonText();try{const o=await Z();let r=o;if(d.startFromTweetId){const l=o.findIndex(h=>h.id===d.startFromTweetId);l!==-1&&(r=o.slice(l));}let n="",i=r,s=!1;if(r.length>0){if(d.translateEnabled)try{d.translationInProgress=!0,y.updateMainButtonText(),y.showToast("翻訳中","翻訳処理を実行しています...");const l=await ut(r);i=l.tweets,s=l.hasTranslation;}catch(l){c.error(`Translation error: ${l}`),y.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=r,s=!1;}finally{d.translationInProgress=!1;}switch(d.copyMode){case "first":n=C(i[0]);break;case "shitaraba":n=O(i,4096);break;case "5ch":n=O(i,2048);break;default:n=xt(i);break}}let a=bt(r,n,d.copyMode,d.startFromTweetAuthor);d.translateEnabled&&s&&n.trim().length>0&&(a+=" (翻訳済み)"),d.collectedThreadData={formattedText:n,summary:a},d.isSecondStage=!0,y.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(o){c.error(`Error in copy process: ${o}`),y.showToast("エラー","スレッドのコピーに失敗しました");}finally{d.isCollecting=!1,d.translationInProgress=!1,y.updateMainButtonText();}}catch(o){c.error(`Button click handler error: ${o}`),y.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(y.init(),y.addMainButton(this.handleButtonClick.bind(this)),y.updateAllUI()):y.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const o=s=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${s}): ${t}`));},r=history.pushState;history.pushState=function(...s){r.apply(this,s),o("pushState");};const n=history.replaceState;history.replaceState=function(...s){n.apply(this,s),o("replaceState");},window.addEventListener("popstate",()=>o("popstate")),new MutationObserver(()=>o("mutation")).observe(document.body,{childList:true,subtree:true});}}new St;

})();