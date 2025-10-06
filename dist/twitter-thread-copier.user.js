// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.3.2
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
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const v="[TwitterThreadCopier]",c={log:e=>{console.log(v,e);},error:e=>{console.error(v,e);},warn:(e,t)=>{t?console.warn(v,e,t):console.warn(v,e);}};function z(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const d=z();var j="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",G="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",W="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function L(e,t=24){const o=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const S={LOADING:L(W),CLIPBOARD:L(j),COPY:L(G)};class Y{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:o}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,o,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,window.removeEventListener("resize",this.handleResize),c.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const o=document.createElement("select");o.id="copy-mode-select",o.innerHTML=`
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
    `,o.value=d.copyMode,o.addEventListener("change",i=>{d.copyMode=i.target.value,c.log(`Copy mode changed to: ${d.copyMode}`);}),t.appendChild(o);const r=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=d.translateEnabled,n.addEventListener("change",i=>{d.translateEnabled=i.target.checked,c.log(`Translation ${d.translateEnabled?"enabled":"disabled"}`);}),r.appendChild(n),r.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(r),this.appendChild(t),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const o=document.createElement("button");o.className="copy-thread-button",o.id="twitter-thread-copier-button",o.title="スレッドをコピー",o.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}d.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(o),this.updateMainButtonText(),this.initializeDrag(o),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(d.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${S.LOADING}`;return}if(d.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${S.LOADING}`;return}if(t.classList.remove("loading"),d.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${S.CLIPBOARD}`;else if(d.startFromTweetId){const o=d.startFromTweetText.length>20?d.startFromTweetText.substring(0,20)+"...":d.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${S.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${S.COPY}`;}}showToast(t,o){let r=this.querySelector(".copy-toast");r||(r=document.createElement("div"),r.className="copy-toast",this.appendChild(r)),r.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${o.substring(0,100)}</div>
    `,r.classList.remove("visible"),setTimeout(()=>{r?.classList.add("visible"),setTimeout(()=>{r?.classList.remove("visible"),setTimeout(()=>r?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const r=t.querySelector('a[href*="/status/"]');if(!r)return;const n=r.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const i=document.createElement("button");i.className="start-point-button",i.textContent="★",i.title="この位置からコピー開始",i.dataset.tweetId=n,d.startFromTweetId===n&&(i.classList.add("active"),i.textContent="✓",t.classList.add("start-point-set")),i.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(i);});}setStartPoint(t,o){d.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(s=>{s.classList.remove("start-point-set");const a=s.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const r=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";d.startFromTweetId=o,d.startFromTweetAuthor=r,d.startFromTweetText=n,t.classList.add("start-point-set");const i=t.querySelector(".start-point-button");i&&(i.classList.add("active"),i.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${r}のツイートを起点に設定しました`),c.log(`Start point set: ${o} by ${r}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");d.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){d.startFromTweetId=null,d.startFromTweetAuthor="",d.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const o=t.querySelector(".start-point-button");o&&(o.classList.remove("active"),o.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const o=this.loadPosition();o&&(this.customPosition=o,this.applyPosition(o.top,o.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",r=>{if(!r.isPrimary)return;const n=this.ensureFloatingContainer(),i=n.getBoundingClientRect();this.dragState={pointerId:r.pointerId,startX:r.clientX,startY:r.clientY,initialTop:this.customPosition?.top??i.top,initialLeft:this.customPosition?.left??i.left,moved:false},n.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(r.pointerId);}catch(s){c.warn("pointer capture failed",s);}}),t.addEventListener("pointermove",r=>{if(!this.dragState||r.pointerId!==this.dragState.pointerId)return;const n=this.floatingContainer;if(!n)return;const i=r.clientX-this.dragState.startX,s=r.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(i)<4&&Math.abs(s)<4)return;this.dragState.moved=true,n.classList.add("has-custom-position"),n.style.bottom="auto",n.style.right="auto";}const a=this.dragState.initialTop+s,l=this.dragState.initialLeft+i,{top:u,left:h}=this.clampPosition(a,l,n);this.applyPosition(u,h,n);});const o=r=>{!this.dragState||r.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(r.pointerId)&&t.releasePointerCapture(r.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o);}clampPosition(t,o,r){const i=r.offsetHeight||0,s=r.offsetWidth||0,a=Math.max(16,window.innerHeight-i-16),l=Math.max(16,window.innerWidth-s-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,o),l)}}applyPosition(t,o,r){const n=r??this.ensureFloatingContainer();n.style.top=`${t}px`,n.style.left=`${o}px`,n.style.bottom="auto",n.style.right="auto",n.classList.add("has-custom-position"),this.customPosition={top:t,left:o},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const o=JSON.parse(t);return typeof o.top=="number"&&typeof o.left=="number"&&Number.isFinite(o.top)&&Number.isFinite(o.left)?{top:o.top,left:o.left}:(c.warn("stored position is invalid",o),null)}catch(t){return c.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){c.warn("failed to save UI position",t);}}}const g=new Y;async function Q(){try{let e=function(){const l=document.querySelectorAll('article[data-testid="tweet"]');l.length>0&&!r&&(r=q(l[0]),n=I(l[0])),l.forEach(u=>{const h=u.querySelector('a[href*="/status/"]');if(!h)return;const p=h.href.split("/"),y=p.indexOf("status");if(y===-1||y+1>=p.length)return;const m=p[y+1].split("?")[0];if(o.has(m))return;const f=q(u);if(r&&f!==r)return;let w=I(u);f===r&&!w&&n&&(w=n);const x=u.querySelector('div[data-testid="tweetText"]');let b="";x&&(b=R(x));const A=u.querySelector("time"),$=A?A.getAttribute("datetime"):"",O=$?K(new Date($)):"",D=J(u),V=X(u),_=o.size===0?i:h.href?h.href.split("?")[0]:"";t.push({id:m,author:f,handle:w,text:b,time:O,url:_,mediaUrls:D,quotedTweet:V}),o.add(m);});};const t=[],o=new Set;let r="",n="";const i=window.location.href,s=window.scrollY;async function a(){try{await E(),e();let h=t.length,p=0;for(let y=0;y<30;y++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(m=>setTimeout(m,700)),await E(),e(),t.length===h){if(p++,p>=3)break}else h=t.length,p=0;}catch(m){c.error(`スクロール処理エラー (試行 ${y+1}): ${m.message}`);continue}try{window.scrollTo(0,s);}catch(y){c.error(`スクロール位置復元エラー: ${y.message}`);}}catch(h){throw c.error(`スクロール収集処理エラー: ${h.message}`),h}}return await a(),t.sort((l,u)=>{const h=new Date(l.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),p=new Date(u.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return h.getTime()-p.getTime()}),t}catch(e){return c.error(`ツイート収集中にエラーが発生: ${e.message}`),c.error(`エラースタック: ${e.stack}`),[]}}function I(e){try{const o=Array.from(e.querySelectorAll("span")).find(i=>{try{const s=i.textContent?i.textContent.trim():"";return s.startsWith("@")&&!s.includes(" ")&&s.length>1}catch{return !1}});if(o)return o.textContent.trim();const r=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const i of r)try{const s=i.getAttribute("href");if(s&&!s.includes("/status/")&&s.length>1&&!s.includes("/i/"))return "@"+s.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const i=n.querySelectorAll("span");for(const s of Array.from(i))try{const a=s.textContent?s.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function q(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}function X(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let o=null;if(t)try{const r=t.closest('div[role="link"]');r&&(o=k(r));}catch(r){c.error(`引用ツイート取得エラー: ${r.message}`);}else try{const r=e.innerText||"",n=r.includes("引用")||r.includes("Quote")||r.includes("quote"),i=e.querySelectorAll('div[role="link"]');if(i.length>0&&n)for(let s=0;s<i.length;s++){const a=i[s],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const u=k(a);if(u&&u.author&&u.text){o=u;break}}catch(u){c.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(r){c.error(`代替引用ツイート検索エラー: ${r.message}`);}return o}function k(e){const t=e.querySelector('div[dir="ltr"] > span'),o=t?t.textContent.trim():"",r=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=r?r.textContent.trim():"";let i="";const s=e.querySelector('div[data-testid="tweetText"]');if(s)i=R(s);else {const m=(e.innerText||"").split(`
`).map(x=>x.trim()).filter(x=>x);let f=-1;for(let x=0;x<m.length;x++)if(m[x].includes(n)){f=x;break}const w=f+1;f>=0&&w<m.length&&(i=m.slice(w+1).join(`
`));}const a=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(y=>{const m=y.querySelector('img[src*="pbs.twimg.com/media"]');if(m){const f=T(m.src);f&&!a.includes(f)&&a.push(f);}}),a.length===0&&(e.querySelectorAll('[role="group"]').forEach(f=>{f.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(x=>{const b=T(x.src);b&&!a.includes(b)&&a.push(b);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(f=>{const w=T(f.src);w&&!a.includes(w)&&a.push(w);}));let u="",h="";const p=e.querySelectorAll('a[href*="/status/"]');for(const y of Array.from(p)){const m=y.href;if(m&&m.includes("/status/")){const f=m.split("/"),w=f.indexOf("status");if(w!==-1&&w+1<f.length){u=f[w+1].split("?")[0],h=m;break}}}return o&&i?{author:o,handle:n,text:i,id:u,url:h,mediaUrls:a}:null}function J(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const i=n.querySelector('img[src*="pbs.twimg.com/media"]');if(i){const s=T(i.src);s&&!t.includes(s)&&t.push(s);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=P(n.poster);if(a&&!t.includes(a)){t.push(a);return}}const s=e.querySelector('a[href*="/status/"]');if(s){const a=s.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const h=`https://twitter.com/i/status/${a[l+1].split("?")[0]}`;t.includes(h)||t.push(`[動画] ${h}`);}}}catch(s){c.error("Error processing blob URL: "+s);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const s=P(n.poster);s&&!t.includes(s)&&t.push(s);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(s=>{if(s.src&&s.src.includes("video.twimg.com"))t.includes(s.src)||t.push(s.src);else if(s.src&&s.src.startsWith("blob:")){const a=e.querySelector('a[href*="/status/"]');if(a){const l=a.href.split("/"),u=l.indexOf("status");if(u!==-1&&u+1<l.length){const p=`https://twitter.com/i/status/${l[u+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(i=>{i.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const l=T(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const s=T(i.src);s&&!t.includes(s)&&t.push(s);}),t}function T(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),o=t?t[1]:"jpg",r=e.split("?")[0];if(!r||r.length===0)return c.error(`無効なベースURL: ${e}`),null;const n=r+"."+o;try{return new URL(n),n}catch(i){return c.error(`無効なURL形式: ${n}, エラー内容: ${i.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function P(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}function R(e){try{const t=e.querySelector('[role="button"]');if(t){const o=t.textContent?.trim()??"";if(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)){const r=[],n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let i;for(;i=n.nextNode();)i.textContent?.trim()&&i.parentElement&&!i.parentElement.closest('[role="button"]')&&r.push(i.textContent);return M(r,e).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return M([e.innerText],e)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function M(e,t){try{const o=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return o.length>1?o.map(r=>r.textContent?.trim()??"").filter(r=>!r.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(o){return c.error(`改行保持処理エラー: ${o.message}`),e.join(" ").trim()}}async function E(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const o of Array.from(e))try{const r=o.textContent?o.textContent.trim():"";(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)||r.match(/show more/i))&&!o.hasAttribute("href")&&!o.querySelector("a")&&o.closest('[data-testid="tweet"]')&&o.click&&(o.click(),t++,await new Promise(i=>setTimeout(i,100)));}catch(r){c.error(`個別ツイート展開エラー: ${r.message}`);continue}return t}catch(e){return c.error(`ツイート展開処理エラー: ${e.message}`),0}}function K(e){const t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0");return `${t}年${o}月${r}日 ${n}:${i}`}const Z="http://localhost:3002/v1/chat/completions",tt="https://translate.googleapis.com/translate_a/single";async function et(e){const t=e.map(it),o=t.map(i=>({tweet:i,textSegments:N(i.text),quotedSegments:i.quotedTweet?N(i.quotedTweet.text):null})),r=[];for(const i of o){for(const s of i.textSegments)U(s,r);if(i.quotedSegments)for(const s of i.quotedSegments)U(s,r);}if(r.length===0)return {tweets:t,hasTranslation:false};let n=false;for(let i=0;i<r.length;i++){const s=r[i];try{const l=await ot(s.original);s.translated=l,!n&&l!==s.original&&(n=!0);}catch(l){c.error(`セグメント翻訳に失敗: ${l.message}`),s.translated=s.original;}i<r.length-1&&await F(1e3+Math.random()*500);}for(const i of o)i.tweet.text=B(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=B(i.quotedSegments));return {tweets:t,hasTranslation:n}}function U(e,t){if(e.kind==="text"){if(e.original.trim().length===0){e.translated=e.original;return}t.push(e);}}function B(e){return e.length===0?"":e.map(t=>t.kind==="fixed"?t.value:t.translated??t.original).join("")}function N(e){if(!e)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,o=[];let r=0,n;for(;(n=t.exec(e))!==null;)n.index>r&&o.push({kind:"text",original:e.slice(r,n.index)}),o.push({kind:"fixed",value:n[0]}),r=n.index+n[0].length;return r<e.length&&o.push({kind:"text",original:e.slice(r)}),o.length===0&&o.push({kind:"text",original:e}),o}async function ot(e){if(e.trim().length===0)return e;const t=await rt(e);if(t)return t;try{return await nt(e)}catch(o){return c.error(`Google翻訳にも失敗しました: ${o.message}`),e}}async function rt(e){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${e}
<|plamo:op|>output lang=ja`,o=await new Promise((i,s)=>{GM_xmlhttpRequest({method:"POST",url:Z,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:3e4,onload:a=>a.status>=200&&a.status<300?i(a):s(new Error(`API error: ${a.status}`)),onerror:a=>s(a),ontimeout:()=>s(new Error("Timeout"))});}),n=JSON.parse(o.responseText)?.choices?.[0]?.message?.content;if(n&&n.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),n;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function nt(e){const t="auto";let r=0;const n=3;for(;r<n;)try{const i=`${tt}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(e)}`,s=await new Promise((u,h)=>{GM_xmlhttpRequest({method:"GET",url:i,timeout:15e3,onload:p=>p.status>=200&&p.status<300?u(p):h(new Error(`API error: ${p.status}`)),onerror:p=>h(p),ontimeout:()=>h(new Error("Timeout"))});}),a=JSON.parse(s.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(u=>u?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(i){if(r++,c.error(`Google翻訳試行 ${r}/${n} 失敗: ${i.message}`),r>=n)throw i;await F(1e3*Math.pow(2,r));}throw new Error("Google翻訳に失敗しました。")}function it(e){return {...e,mediaUrls:[...e.mediaUrls],quotedTweet:e.quotedTweet?{...e.quotedTweet,mediaUrls:[...e.quotedTweet.mediaUrls]}:null}}async function F(e){await new Promise(t=>setTimeout(t,e));}function C(e){let t=`${e.author} ${e.handle}
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
`;}return t}function H(e,t){if(!e||e.length===0)return "";let o="";const r=`

---

`;for(let n=0;n<e.length;n++){const i=e[n],s=C(i),a=n===0?s:r+s;if(o.length+a.length>t){const l=t-o.length;l>r.length&&(o+=a.substring(0,l-3)+"...");break}o+=a;}return o}function st(e){if(!e||e.length===0)return "";let t=C(e[0]);for(let o=1;o<e.length;o++)t+=`

---

`+C(e[o]);return t}function at(e,t,o,r=null){let n="";if(r&&(n+=`${r}のツイートから`),e.length>0){const i=e[0].author;n+=`${i}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${lt(t.length)}`,(o==="shitaraba"||o==="5ch")&&(n+=`/${o==="shitaraba"?4096:2048}`),n}function lt(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function ct(e){if(!e||!e.formattedText){const r=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${r}`),g.showToast("エラー",r),false}if(e.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),g.showToast("エラー","コピーするテキストが空です"),false;let t=false,o=null;if(navigator.clipboard&&window.ClipboardItem)try{const r=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":r});await navigator.clipboard.write([n]),t=!0;}catch(r){o=r,c.error(`ClipboardItem API失敗: ${o.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(r){o=r,c.error(`Navigator clipboard API失敗: ${o.message}`);}if(!t)try{const r=document.createElement("textarea");if(r.value=e.formattedText,r.style.position="fixed",r.style.left="-9999px",document.body.appendChild(r),r.select(),t=document.execCommand("copy"),document.body.removeChild(r),!t)throw new Error("execCommand returned false")}catch(r){o=r,c.error(`execCommand fallback失敗: ${o.message}`);}if(t)g.showToast("コピーしました",e.summary);else {const r=o?o.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${r}`),g.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class dt{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){d.collectedThreadData&&(await ct(d.collectedThreadData),d.isSecondStage=!1,d.collectedThreadData=null,g.updateMainButtonText());return}if(d.isCollecting)return;d.isCollecting=!0,g.updateMainButtonText();try{const o=await Q();let r=o;if(d.startFromTweetId){const l=o.findIndex(u=>u.id===d.startFromTweetId);l!==-1&&(r=o.slice(l));}let n="",i=r,s=!1;if(r.length>0){if(d.translateEnabled)try{d.translationInProgress=!0,g.updateMainButtonText(),g.showToast("翻訳中","翻訳処理を実行しています...");const l=await et(r);i=l.tweets,s=l.hasTranslation;}catch(l){c.error(`Translation error: ${l}`),g.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=r,s=!1;}finally{d.translationInProgress=!1;}switch(d.copyMode){case "first":n=C(i[0]);break;case "shitaraba":n=H(i,4096);break;case "5ch":n=H(i,2048);break;default:n=st(i);break}}let a=at(r,n,d.copyMode,d.startFromTweetAuthor);d.translateEnabled&&s&&n.trim().length>0&&(a+=" (翻訳済み)"),d.collectedThreadData={formattedText:n,summary:a},d.isSecondStage=!0,g.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(o){c.error(`Error in copy process: ${o}`),g.showToast("エラー","スレッドのコピーに失敗しました");}finally{d.isCollecting=!1,d.translationInProgress=!1,g.updateMainButtonText();}}catch(o){c.error(`Button click handler error: ${o}`),g.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(g.init(),g.addMainButton(this.handleButtonClick.bind(this)),g.updateAllUI()):g.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const o=s=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${s}): ${t}`));},r=history.pushState;history.pushState=function(...s){r.apply(this,s),o("pushState");};const n=history.replaceState;history.replaceState=function(...s){n.apply(this,s),o("replaceState");},window.addEventListener("popstate",()=>o("popstate")),new MutationObserver(()=>o("mutation")).observe(document.body,{childList:true,subtree:true});}}new dt;

})();