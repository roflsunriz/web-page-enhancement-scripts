// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.5.0
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

    const v="[TwitterThreadCopier]",l={log:e=>{console.log(v,e);},error:e=>{console.error(v,e);},warn:(e,t)=>{t?console.warn(v,e,t):console.warn(v,e);}};function j(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const d=j();var X="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",Q="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",J="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function A(e,t=24){const r=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const S={LOADING:A(J),CLIPBOARD:A(X),COPY:A(Q)};class Z{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:r}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,r,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),l.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,window.removeEventListener("resize",this.handleResize),l.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const r=document.createElement("select");r.id="copy-mode-select",r.innerHTML=`
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
    `,r.value=d.copyMode,r.addEventListener("change",i=>{d.copyMode=i.target.value,l.log(`Copy mode changed to: ${d.copyMode}`);}),t.appendChild(r);const o=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=d.translateEnabled,n.addEventListener("change",i=>{d.translateEnabled=i.target.checked,l.log(`Translation ${d.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(n),o.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(o),this.appendChild(t),l.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const r=document.createElement("button");r.className="copy-thread-button",r.id="twitter-thread-copier-button",r.title="スレッドをコピー",r.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}d.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(r),this.updateMainButtonText(),this.initializeDrag(r),l.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(d.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${S.LOADING}`;return}if(d.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${S.LOADING}`;return}if(t.classList.remove("loading"),d.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${S.CLIPBOARD}`;else if(d.startFromTweetId){const r=d.startFromTweetText.length>20?d.startFromTweetText.substring(0,20)+"...":d.startFromTweetText;t.innerHTML=`<span class="text">${r}からコピー</span>${S.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${S.COPY}`;}}showToast(t,r){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${r.substring(0,100)}</div>
    `,o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const o=t.querySelector('a[href*="/status/"]');if(!o)return;const n=o.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const i=document.createElement("button");i.className="start-point-button",i.textContent="★",i.title="この位置からコピー開始",i.dataset.tweetId=n,d.startFromTweetId===n&&(i.classList.add("active"),i.textContent="✓",t.classList.add("start-point-set")),i.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(i);});}setStartPoint(t,r){d.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(s=>{s.classList.remove("start-point-set");const a=s.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";d.startFromTweetId=r,d.startFromTweetAuthor=o,d.startFromTweetText=n,t.classList.add("start-point-set");const i=t.querySelector(".start-point-button");i&&(i.classList.add("active"),i.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${o}のツイートを起点に設定しました`),l.log(`Start point set: ${r} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");d.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){d.startFromTweetId=null,d.startFromTweetAuthor="",d.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const r=t.querySelector(".start-point-button");r&&(r.classList.remove("active"),r.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),l.log("Start point reset");}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const r=this.loadPosition();r&&(this.customPosition=r,this.applyPosition(r.top,r.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const n=this.ensureFloatingContainer(),i=n.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??i.top,initialLeft:this.customPosition?.left??i.left,moved:false},n.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(s){l.warn("pointer capture failed",s);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const n=this.floatingContainer;if(!n)return;const i=o.clientX-this.dragState.startX,s=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(i)<4&&Math.abs(s)<4)return;this.dragState.moved=true,n.classList.add("has-custom-position"),n.style.bottom="auto",n.style.right="auto";}const a=this.dragState.initialTop+s,c=this.dragState.initialLeft+i,{top:h,left:m}=this.clampPosition(a,c,n);this.applyPosition(h,m,n);});const r=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r);}clampPosition(t,r,o){const i=o.offsetHeight||0,s=o.offsetWidth||0,a=Math.max(16,window.innerHeight-i-16),c=Math.max(16,window.innerWidth-s-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,r),c)}}applyPosition(t,r,o){const n=o??this.ensureFloatingContainer();n.style.top=`${t}px`,n.style.left=`${r}px`,n.style.bottom="auto",n.style.right="auto",n.classList.add("has-custom-position"),this.customPosition={top:t,left:r},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const r=JSON.parse(t);return typeof r.top=="number"&&typeof r.left=="number"&&Number.isFinite(r.top)&&Number.isFinite(r.left)?{top:r.top,left:r.left}:(l.warn("stored position is invalid",r),null)}catch(t){return l.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){l.warn("failed to save UI position",t);}}}const x=new Z;async function K(){try{let e=function(){if(a)return;const m=Array.from(document.querySelectorAll('article[data-testid="tweet"]'));m.length>0&&!o&&(o=q(m[0]),n=k(m[0]));for(const p of m){const w=p.querySelector('a[href*="/status/"]');if(!w)continue;const f=w.href.split("/"),u=f.indexOf("status");if(u===-1||u+1>=f.length)continue;const g=f[u+1].split("?")[0];if(r.has(g))continue;const y=q(p);if(o&&y!==o)continue;let b=k(p);y===o&&!b&&n&&(b=n);const L=p.querySelector('div[data-testid="tweetText"]');let $="";L&&($=D(L));const E=p.querySelector("time"),I=E?E.getAttribute("datetime"):"",z=I?st(new Date(I)):"",W=et(p),Y=tt(p),G=r.size===0?i:w.href?w.href.split("?")[0]:"";if(t.push({id:g,author:y,handle:b,text:$,time:z,url:G,mediaUrls:W,quotedTweet:Y}),r.add(g),s){a=!0;break}}};const t=[],r=new Set;let o="",n="";const i=window.location.href,s=d.copyMode==="first";let a=!1;const c=window.scrollY;async function h(){try{if(await B(),e(),a)return;let w=t.length,f=0;for(let u=0;u<30;u++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(g=>setTimeout(g,700)),await B(),e(),a)return;if(t.length===w){if(f++,f>=3)break}else w=t.length,f=0;}catch(g){l.error(`スクロール処理エラー (試行 ${u+1}): ${g.message}`);continue}try{window.scrollTo(0,c);}catch(u){l.error(`スクロール位置復元エラー: ${u.message}`);}}catch(w){throw l.error(`スクロール収集処理エラー: ${w.message}`),w}}return await h(),t.sort((m,p)=>{const w=new Date(m.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),f=new Date(p.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return w.getTime()-f.getTime()}),t}catch(e){return l.error(`ツイート収集中にエラーが発生: ${e.message}`),l.error(`エラースタック: ${e.stack}`),[]}}function k(e){try{const r=Array.from(e.querySelectorAll("span")).find(i=>{try{const s=i.textContent?i.textContent.trim():"";return s.startsWith("@")&&!s.includes(" ")&&s.length>1}catch{return !1}});if(r)return r.textContent.trim();const o=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const i of o)try{const s=i.getAttribute("href");if(s&&!s.includes("/status/")&&s.length>1&&!s.includes("/i/"))return "@"+s.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const i=n.querySelectorAll("span");for(const s of Array.from(i))try{const a=s.textContent?s.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return l.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function q(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return l.error(`ユーザー名取得エラー: ${t.message}`),""}}function tt(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let r=null;if(t)try{const o=t.closest('div[role="link"]');o&&(r=P(o));}catch(o){l.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=e.innerText||"",n=o.includes("引用")||o.includes("Quote")||o.includes("quote"),i=e.querySelectorAll('div[role="link"]');if(i.length>0&&n)for(let s=0;s<i.length;s++){const a=i[s],c=a.innerText||"";if(c.includes("@")&&(c.includes("年")||c.includes("時間")||c.includes("分")||c.includes("日")))try{const h=P(a);if(h&&h.author&&h.text){r=h;break}}catch(h){l.error(`代替引用ツイート抽出エラー: ${h.message}`);}}}catch(o){l.error(`代替引用ツイート検索エラー: ${o.message}`);}return r}function P(e){const t=e.querySelector('div[dir="ltr"] > span'),r=t?t.textContent.trim():"",o=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=o?o.textContent.trim():"";let i="";const s=e.querySelector('div[data-testid="tweetText"]');if(s)i=D(s);else {const f=(e.innerText||"").split(`
`).map(y=>y.trim()).filter(y=>y);let u=-1;for(let y=0;y<f.length;y++)if(f[y].includes(n)){u=y;break}const g=u+1;u>=0&&g<f.length&&(i=f.slice(g+1).join(`
`));}const a=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(w=>{const f=w.querySelector('img[src*="pbs.twimg.com/media"]');if(f){const u=T(f.src);u&&!a.includes(u)&&a.push(u);}}),a.length===0&&(e.querySelectorAll('[role="group"]').forEach(u=>{u.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(y=>{const b=T(y.src);b&&!a.includes(b)&&a.push(b);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(u=>{const g=T(u.src);g&&!a.includes(g)&&a.push(g);}));let h="",m="";const p=e.querySelectorAll('a[href*="/status/"]');for(const w of Array.from(p)){const f=w.href;if(f&&f.includes("/status/")){const u=f.split("/"),g=u.indexOf("status");if(g!==-1&&g+1<u.length){h=u[g+1].split("?")[0],m=f;break}}}return r&&i?{author:r,handle:n,text:i,id:h,url:m,mediaUrls:a}:null}function et(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const i=n.querySelector('img[src*="pbs.twimg.com/media"]');if(i){const s=T(i.src);s&&!t.includes(s)&&t.push(s);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=M(n.poster);if(a&&!t.includes(a)){t.push(a);return}}const s=e.querySelector('a[href*="/status/"]');if(s){const a=s.href.split("/"),c=a.indexOf("status");if(c!==-1&&c+1<a.length){const m=`https://twitter.com/i/status/${a[c+1].split("?")[0]}`;t.includes(m)||t.push(`[動画] ${m}`);}}}catch(s){l.error("Error processing blob URL: "+s);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const s=M(n.poster);s&&!t.includes(s)&&t.push(s);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(s=>{if(s.src&&s.src.includes("video.twimg.com"))t.includes(s.src)||t.push(s.src);else if(s.src&&s.src.startsWith("blob:")){const a=e.querySelector('a[href*="/status/"]');if(a){const c=a.href.split("/"),h=c.indexOf("status");if(h!==-1&&h+1<c.length){const p=`https://twitter.com/i/status/${c[h+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(i=>{i.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const c=T(a.src);c&&!t.includes(c)&&t.push(c);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const s=T(i.src);s&&!t.includes(s)&&t.push(s);}),t}function T(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),r=t?t[1]:"jpg",o=e.split("?")[0];if(!o||o.length===0)return l.error(`無効なベースURL: ${e}`),null;const n=o+"."+r;try{return new URL(n),n}catch(i){return l.error(`無効なURL形式: ${n}, エラー内容: ${i.message}`),null}}catch(t){return l.error(`メディアURL処理エラー: ${t.message}`),null}}function M(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return l.error(`動画URL生成エラー: ${t.message}`),null}}const rt=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function D(e){try{const t=e.cloneNode(!0);ot(t);const r=t.querySelector('[role="button"]');if(r){const o=r.textContent?.trim()??"";if(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)){const n=[],i=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null);let s;for(;s=i.nextNode();)s.textContent?.trim()&&s.parentElement&&!s.parentElement.closest('[role="button"]')&&n.push(s.textContent);return U(n,t).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return U([t.innerText],t)}catch(t){return l.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function U(e,t){try{const r=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return r.length>1?r.map(o=>o.textContent?.trim()??"").filter(o=>!o.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(r){return l.error(`改行保持処理エラー: ${r.message}`),e.join(" ").trim()}}function ot(e){const t=Array.from(e.querySelectorAll("a[href]"));for(const r of t){const o=nt(r);if(o===null)continue;const i=(e.ownerDocument??document).createTextNode(o);r.replaceWith(i);}}function nt(e){const t=e.textContent??"";if(!t)return null;if(!it(e,t))return t;const r=e.getAttribute("data-expanded-url")??e.getAttribute("data-url")??e.getAttribute("title")??e.getAttribute("href")??t,o=R(r);if(o.length>0)return o;const n=R(t);return n.length>0?n:t}function it(e,t){const r=t.trim();return /^https?:\/\//i.test(r)||e.hasAttribute("data-expanded-url")?true:/^https?:\/\//i.test(e.getAttribute("href")??"")?!(r.startsWith("@")||r.startsWith("#")):false}function R(e){return e.replace(rt,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}async function B(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const r of Array.from(e))try{const o=r.textContent?r.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!r.hasAttribute("href")&&!r.querySelector("a")&&r.closest('[data-testid="tweet"]')&&r.click&&(r.click(),t++,await new Promise(i=>setTimeout(i,100)));}catch(o){l.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(e){return l.error(`ツイート展開処理エラー: ${e.message}`),0}}function st(e){const t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0");return `${t}年${r}月${o}日 ${n}:${i}`}const at="http://localhost:3002/v1/chat/completions",lt="https://translate.googleapis.com/translate_a/single",ct="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",dt=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;async function ut(e){const t=e.map(xt),r=t.map(i=>({tweet:i,textSegments:N(i.text),quotedSegments:i.quotedTweet?N(i.quotedTweet.text):null})),o=[];for(const i of r){for(const s of i.textSegments)F(s,o);if(i.quotedSegments)for(const s of i.quotedSegments)F(s,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let n=false;for(let i=0;i<o.length;i++){const s=o[i];try{const c=await mt(s.original);s.translated=c,!n&&c!==s.original&&(n=!0);}catch(c){l.error(`セグメント翻訳に失敗: ${c.message}`),s.translated=s.original;}i<o.length-1&&await V(1e3+Math.random()*500);}for(const i of r)i.tweet.text=H(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=H(i.quotedSegments));return {tweets:t,hasTranslation:n}}function F(e,t){if(e.kind==="text"){if(e.original.trim().length===0){e.translated=e.original;return}t.push(e);}}function H(e){if(e.length===0)return "";let t="";for(const r of e)if(r.kind==="fixed"){const o=r.value;_(o)&&(t=ft(t)),t+=o;}else t+=r.translated??r.original;return t}function N(e){if(!e)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,r=[];let o=0,n;for(;(n=t.exec(e))!==null;)n.index>o&&r.push({kind:"text",original:e.slice(o,n.index)}),r.push({kind:"fixed",value:ht(n[0])}),o=n.index+n[0].length;return o<e.length&&r.push({kind:"text",original:e.slice(o)}),r.length===0&&r.push({kind:"text",original:e}),r}function ht(e){if(_(e)){const t=pt(e);return t.length>0?t:e}return e}function _(e){return /^https?:\/\//i.test(e.trim())}function pt(e){return e.replace(dt,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function ft(e){return e.length===0?e:e.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function mt(e){if(e.trim().length===0)return e;const t=await gt(e);if(t)return t;try{return await wt(e)}catch(r){return l.error(`Google翻訳にも失敗しました: ${r.message}`),e}}async function gt(e){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${e}
<|plamo:op|>output lang=ja`,r=await new Promise((i,s)=>{GM_xmlhttpRequest({method:"POST",url:at,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:ct},{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:12e4,onload:a=>a.status>=200&&a.status<300?i(a):s(new Error(`API error: ${a.status}`)),onerror:a=>s(a),ontimeout:()=>s(new Error("Timeout"))});}),n=JSON.parse(r.responseText)?.choices?.[0]?.message?.content;if(n&&n.trim().length>0)return l.log("ローカルAIでの翻訳に成功しました。"),n;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return l.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function wt(e){const t="auto";let o=0;const n=3;for(;o<n;)try{const i=`${lt}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(e)}`,s=await new Promise((h,m)=>{GM_xmlhttpRequest({method:"GET",url:i,timeout:15e3,onload:p=>p.status>=200&&p.status<300?h(p):m(new Error(`API error: ${p.status}`)),onerror:p=>m(p),ontimeout:()=>m(new Error("Timeout"))});}),a=JSON.parse(s.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const c=a.sentences.map(h=>h?.trans??"").join("");if(!c.trim())throw new Error("Translation result is empty");return c}catch(i){if(o++,l.error(`Google翻訳試行 ${o}/${n} 失敗: ${i.message}`),o>=n)throw i;await V(1e3*Math.pow(2,o));}throw new Error("Google翻訳に失敗しました。")}function xt(e){return {...e,mediaUrls:[...e.mediaUrls],quotedTweet:e.quotedTweet?{...e.quotedTweet,mediaUrls:[...e.quotedTweet.mediaUrls]}:null}}async function V(e){await new Promise(t=>setTimeout(t,e));}function C(e){let t=`${e.author} ${e.handle}
${e.text}
${e.time}
`;if(e.url&&(t+=`${e.url}
`),e.mediaUrls.length>0&&(t+=e.mediaUrls.join(`
`)+`
`),e.quotedTweet){const r=e.quotedTweet;t+=`
> 引用元: ${r.author} ${r.handle}
`,t+=`> ${r.text.replace(/\n/g,`
> `)}
`,r.mediaUrls.length>0&&(t+=`> ${r.mediaUrls.join(`
> `)}
`),t+=`> ${r.url}
`;}return t}function O(e,t){if(!e||e.length===0)return "";let r="";const o=`

---

`;for(let n=0;n<e.length;n++){const i=e[n],s=C(i),a=n===0?s:o+s;if(r.length+a.length>t){const c=t-r.length;c>o.length&&(r+=a.substring(0,c-3)+"...");break}r+=a;}return r}function yt(e){if(!e||e.length===0)return "";let t=C(e[0]);for(let r=1;r<e.length;r++)t+=`

---

`+C(e[r]);return t}function bt(e,t,r,o=null){let n="";if(o&&(n+=`${o}のツイートから`),e.length>0){const i=e[0].author;n+=`${i}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${Tt(t.length)}`,(r==="shitaraba"||r==="5ch")&&(n+=`/${r==="shitaraba"?4096:2048}`),n}function Tt(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function St(e){if(!e||!e.formattedText){const o=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return l.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー",o),false}if(e.formattedText.trim().length===0)return l.error("クリップボードコピー失敗: formattedTextが空です"),x.showToast("エラー","コピーするテキストが空です"),false;let t=false,r=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":o});await navigator.clipboard.write([n]),t=!0;}catch(o){r=o,l.error(`ClipboardItem API失敗: ${r.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(o){r=o,l.error(`Navigator clipboard API失敗: ${r.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=e.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){r=o,l.error(`execCommand fallback失敗: ${r.message}`);}if(t)x.showToast("コピーしました",e.summary);else {const o=r?r.message:"不明なエラー";l.error(`クリップボードコピー失敗: ${o}`),x.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class vt{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),l.log("Application initialized.");}catch(t){l.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){d.collectedThreadData&&(await St(d.collectedThreadData),d.isSecondStage=!1,d.collectedThreadData=null,x.updateMainButtonText());return}if(d.isCollecting)return;d.isCollecting=!0,x.updateMainButtonText();try{const r=await K();let o=r;if(d.startFromTweetId){const c=r.findIndex(h=>h.id===d.startFromTweetId);c!==-1&&(o=r.slice(c));}let n="",i=o,s=!1;if(o.length>0){if(d.translateEnabled)try{d.translationInProgress=!0,x.updateMainButtonText(),x.showToast("翻訳中","翻訳処理を実行しています...");const c=await ut(o);i=c.tweets,s=c.hasTranslation;}catch(c){l.error(`Translation error: ${c}`),x.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),i=o,s=!1;}finally{d.translationInProgress=!1;}switch(d.copyMode){case "first":n=C(i[0]);break;case "shitaraba":n=O(i,4096);break;case "5ch":n=O(i,2048);break;default:n=yt(i);break}}let a=bt(o,n,d.copyMode,d.startFromTweetAuthor);d.translateEnabled&&s&&n.trim().length>0&&(a+=" (翻訳済み)"),d.collectedThreadData={formattedText:n,summary:a},d.isSecondStage=!0,x.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(r){l.error(`Error in copy process: ${r}`),x.showToast("エラー","スレッドのコピーに失敗しました");}finally{d.isCollecting=!1,d.translationInProgress=!1,x.updateMainButtonText();}}catch(r){l.error(`Button click handler error: ${r}`),x.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(x.init(),x.addMainButton(this.handleButtonClick.bind(this)),x.updateAllUI()):x.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const r=s=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${s}): ${t}`));},o=history.pushState;history.pushState=function(...s){o.apply(this,s),r("pushState");};const n=history.replaceState;history.replaceState=function(...s){n.apply(this,s),r("replaceState");},window.addEventListener("popstate",()=>r("popstate")),new MutationObserver(()=>r("mutation")).observe(document.body,{childList:true,subtree:true});}}new vt;

})();