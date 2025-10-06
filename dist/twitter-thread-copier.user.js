// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.2.0
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

    const v="[TwitterThreadCopier]",c={log:e=>{console.log(v,e);},error:e=>{console.error(v,e);},warn:(e,t)=>{t?console.warn(v,e,t):console.warn(v,e);}};function _(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const d=_();var z="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",j="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",G="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function L(e,t=24){const r=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const S={LOADING:L(G),CLIPBOARD:L(z),COPY:L(j)};class W{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:r}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,r,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
          pointer-events: auto;
          order: 0;
          position: relative;
      }
      .copy-toast.visible { opacity: 1; transform: translateY(0); }
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,window.removeEventListener("resize",this.handleResize),c.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const r=document.createElement("select");r.id="copy-mode-select",r.innerHTML=`
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
    `,r.value=d.copyMode,r.addEventListener("change",s=>{d.copyMode=s.target.value,c.log(`Copy mode changed to: ${d.copyMode}`);}),t.appendChild(r);const o=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=d.translateEnabled,n.addEventListener("change",s=>{d.translateEnabled=s.target.checked,c.log(`Translation ${d.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(n),o.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(o),this.appendChild(t),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const r=document.createElement("button");r.className="copy-thread-button",r.id="twitter-thread-copier-button",r.title="スレッドをコピー",r.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}d.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(r),this.updateMainButtonText(),this.initializeDrag(r),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(d.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${S.LOADING}`;return}if(d.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${S.LOADING}`;return}if(t.classList.remove("loading"),d.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${S.CLIPBOARD}`;else if(d.startFromTweetId){const r=d.startFromTweetText.length>20?d.startFromTweetText.substring(0,20)+"...":d.startFromTweetText;t.innerHTML=`<span class="text">${r}からコピー</span>${S.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${S.COPY}`;}}showToast(t,r){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${r.substring(0,100)}</div>
    `,o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(i=>i.classList.contains("start-point-button")))return;const o=t.querySelector('a[href*="/status/"]');if(!o)return;const n=o.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const s=document.createElement("button");s.className="start-point-button",s.textContent="★",s.title="この位置からコピー開始",s.dataset.tweetId=n,d.startFromTweetId===n&&(s.classList.add("active"),s.textContent="✓",t.classList.add("start-point-set")),s.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(s);});}setStartPoint(t,r){d.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";d.startFromTweetId=r,d.startFromTweetAuthor=o,d.startFromTweetText=n,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${o}のツイートを起点に設定しました`),c.log(`Start point set: ${r} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");d.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){d.startFromTweetId=null,d.startFromTweetAuthor="",d.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const r=t.querySelector(".start-point-button");r&&(r.classList.remove("active"),r.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t),this.customPosition&&(t.classList.add("has-custom-position"),t.style.top=`${this.customPosition.top}px`,t.style.left=`${this.customPosition.left}px`,t.style.bottom="auto",t.style.right="auto"),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const n=this.ensureFloatingContainer(),s=n.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},n.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(i){c.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const n=this.floatingContainer;if(!n)return;const s=o.clientX-this.dragState.startX,i=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,n.classList.add("has-custom-position"),n.style.bottom="auto",n.style.right="auto";}const a=this.dragState.initialTop+i,l=this.dragState.initialLeft+s,{top:u,left:h}=this.clampPosition(a,l,n);this.applyPosition(u,h,n);});const r=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize()),this.dragState=null);};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r);}clampPosition(t,r,o){const s=o.offsetHeight||0,i=o.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),l=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,r),l)}}applyPosition(t,r,o){const n=o??this.ensureFloatingContainer();n.style.top=`${t}px`,n.style.left=`${r}px`,n.style.bottom="auto",n.style.right="auto",n.classList.add("has-custom-position"),this.customPosition={top:t,left:r};}}const f=new W;async function Y(){try{let e=function(){const a=document.querySelectorAll('article[data-testid="tweet"]');a.length>0&&!o&&(o=q(a[0]),n=A(a[0])),a.forEach(l=>{const u=l.querySelector('a[href*="/status/"]');if(!u)return;const h=u.href.split("/"),p=h.indexOf("status");if(p===-1||p+1>=h.length)return;const w=h[p+1].split("?")[0];if(r.has(w))return;const g=q(l);if(o&&g!==o)return;let m=A(l);g===o&&!m&&n&&(m=n);const x=l.querySelector('div[data-testid="tweetText"]');let y="";x&&(y=R(x));const b=l.querySelector("time"),$=b?b.getAttribute("datetime"):"",F=$?Z(new Date($)):"",D=X(l),O=Q(l),V=u.href?u.href.split("?")[0]:"";t.push({id:w,author:g,handle:m,text:y,time:F,url:V,mediaUrls:D,quotedTweet:O}),r.add(w);});};const t=[],r=new Set;let o="",n="";const s=window.scrollY;async function i(){try{await P(),e();let u=t.length,h=0;for(let p=0;p<30;p++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(w=>setTimeout(w,700)),await P(),e(),t.length===u){if(h++,h>=3)break}else u=t.length,h=0;}catch(w){c.error(`スクロール処理エラー (試行 ${p+1}): ${w.message}`);continue}try{window.scrollTo(0,s);}catch(p){c.error(`スクロール位置復元エラー: ${p.message}`);}}catch(u){throw c.error(`スクロール収集処理エラー: ${u.message}`),u}}return await i(),t.sort((a,l)=>{const u=new Date(a.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),h=new Date(l.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return u.getTime()-h.getTime()}),t}catch(e){return c.error(`ツイート収集中にエラーが発生: ${e.message}`),c.error(`エラースタック: ${e.stack}`),[]}}function A(e){try{const r=Array.from(e.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(r)return r.textContent.trim();const o=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const s of o)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const s=n.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function q(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}function Q(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let r=null;if(t)try{const o=t.closest('div[role="link"]');o&&(r=k(o));}catch(o){c.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=e.innerText||"",n=o.includes("引用")||o.includes("Quote")||o.includes("quote"),s=e.querySelectorAll('div[role="link"]');if(s.length>0&&n)for(let i=0;i<s.length;i++){const a=s[i],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const u=k(a);if(u&&u.author&&u.text){r=u;break}}catch(u){c.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(o){c.error(`代替引用ツイート検索エラー: ${o.message}`);}return r}function k(e){const t=e.querySelector('div[dir="ltr"] > span'),r=t?t.textContent.trim():"",o=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=o?o.textContent.trim():"";let s="";const i=e.querySelector('div[data-testid="tweetText"]');if(i)s=R(i);else {const g=(e.innerText||"").split(`
`).map(y=>y.trim()).filter(y=>y);let m=-1;for(let y=0;y<g.length;y++)if(g[y].includes(n)){m=y;break}const x=m+1;m>=0&&x<g.length&&(s=g.slice(x+1).join(`
`));}const a=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(w=>{const g=w.querySelector('img[src*="pbs.twimg.com/media"]');if(g){const m=T(g.src);m&&!a.includes(m)&&a.push(m);}}),a.length===0&&(e.querySelectorAll('[role="group"]').forEach(m=>{m.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(y=>{const b=T(y.src);b&&!a.includes(b)&&a.push(b);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(m=>{const x=T(m.src);x&&!a.includes(x)&&a.push(x);}));let u="",h="";const p=e.querySelectorAll('a[href*="/status/"]');for(const w of Array.from(p)){const g=w.href;if(g&&g.includes("/status/")){const m=g.split("/"),x=m.indexOf("status");if(x!==-1&&x+1<m.length){u=m[x+1].split("?")[0],h=g;break}}}return r&&s?{author:r,handle:n,text:s,id:u,url:h,mediaUrls:a}:null}function X(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const s=n.querySelector('img[src*="pbs.twimg.com/media"]');if(s){const i=T(s.src);i&&!t.includes(i)&&t.push(i);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=I(n.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=e.querySelector('a[href*="/status/"]');if(i){const a=i.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const h=`https://twitter.com/i/status/${a[l+1].split("?")[0]}`;t.includes(h)||t.push(`[動画] ${h}`);}}}catch(i){c.error("Error processing blob URL: "+i);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=I(n.poster);i&&!t.includes(i)&&t.push(i);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=e.querySelector('a[href*="/status/"]');if(a){const l=a.href.split("/"),u=l.indexOf("status");if(u!==-1&&u+1<l.length){const p=`https://twitter.com/i/status/${l[u+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(s=>{s.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const l=T(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(s=>{const i=T(s.src);i&&!t.includes(i)&&t.push(i);}),t}function T(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),r=t?t[1]:"jpg",o=e.split("?")[0];if(!o||o.length===0)return c.error(`無効なベースURL: ${e}`),null;const n=o+"."+r;try{return new URL(n),n}catch(s){return c.error(`無効なURL形式: ${n}, エラー内容: ${s.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function I(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}function R(e){try{const t=e.querySelector('[role="button"]');if(t){const r=t.textContent?.trim()??"";if(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)){const o=[],n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let s;for(;s=n.nextNode();)s.textContent?.trim()&&s.parentElement&&!s.parentElement.closest('[role="button"]')&&o.push(s.textContent);return M(o,e).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return M([e.innerText],e)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function M(e,t){try{const r=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return r.length>1?r.map(o=>o.textContent?.trim()??"").filter(o=>!o.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(r){return c.error(`改行保持処理エラー: ${r.message}`),e.join(" ").trim()}}async function P(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const r of Array.from(e))try{const o=r.textContent?r.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!r.hasAttribute("href")&&!r.querySelector("a")&&r.closest('[data-testid="tweet"]')&&r.click&&(r.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(o){c.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(e){return c.error(`ツイート展開処理エラー: ${e.message}`),0}}function Z(e){const t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0");return `${t}年${r}月${o}日 ${n}:${s}`}const J="http://localhost:3002/v1/chat/completions",K="https://translate.googleapis.com/translate_a/single";async function tt(e){const t=e.map(nt),r=t.map(s=>({tweet:s,textSegments:B(s.text),quotedSegments:s.quotedTweet?B(s.quotedTweet.text):null})),o=[];for(const s of r){for(const i of s.textSegments)E(i,o);if(s.quotedSegments)for(const i of s.quotedSegments)E(i,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let n=false;for(let s=0;s<o.length;s++){const i=o[s];try{const l=await et(i.original);i.translated=l,!n&&l!==i.original&&(n=!0);}catch(l){c.error(`セグメント翻訳に失敗: ${l.message}`),i.translated=i.original;}s<o.length-1&&await N(1e3+Math.random()*500);}for(const s of r)s.tweet.text=U(s.textSegments),s.quotedSegments&&s.tweet.quotedTweet&&(s.tweet.quotedTweet.text=U(s.quotedSegments));return {tweets:t,hasTranslation:n}}function E(e,t){if(e.kind==="text"){if(e.original.trim().length===0){e.translated=e.original;return}t.push(e);}}function U(e){return e.length===0?"":e.map(t=>t.kind==="fixed"?t.value:t.translated??t.original).join("")}function B(e){if(!e)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,r=[];let o=0,n;for(;(n=t.exec(e))!==null;)n.index>o&&r.push({kind:"text",original:e.slice(o,n.index)}),r.push({kind:"fixed",value:n[0]}),o=n.index+n[0].length;return o<e.length&&r.push({kind:"text",original:e.slice(o)}),r.length===0&&r.push({kind:"text",original:e}),r}async function et(e){if(e.trim().length===0)return e;const t=await ot(e);if(t)return t;try{return await rt(e)}catch(r){return c.error(`Google翻訳にも失敗しました: ${r.message}`),e}}async function ot(e){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${e}
<|plamo:op|>output lang=ja`,r=await new Promise((s,i)=>{GM_xmlhttpRequest({method:"POST",url:J,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:3e4,onload:a=>a.status>=200&&a.status<300?s(a):i(new Error(`API error: ${a.status}`)),onerror:a=>i(a),ontimeout:()=>i(new Error("Timeout"))});}),n=JSON.parse(r.responseText)?.choices?.[0]?.message?.content;if(n&&n.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),n;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function rt(e){const t="auto";let o=0;const n=3;for(;o<n;)try{const s=`${K}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(e)}`,i=await new Promise((u,h)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:p=>p.status>=200&&p.status<300?u(p):h(new Error(`API error: ${p.status}`)),onerror:p=>h(p),ontimeout:()=>h(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(u=>u?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(s){if(o++,c.error(`Google翻訳試行 ${o}/${n} 失敗: ${s.message}`),o>=n)throw s;await N(1e3*Math.pow(2,o));}throw new Error("Google翻訳に失敗しました。")}function nt(e){return {...e,mediaUrls:[...e.mediaUrls],quotedTweet:e.quotedTweet?{...e.quotedTweet,mediaUrls:[...e.quotedTweet.mediaUrls]}:null}}async function N(e){await new Promise(t=>setTimeout(t,e));}function C(e){let t=`${e.author} ${e.handle}
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
`;}return t}function H(e,t){if(!e||e.length===0)return "";let r="";const o=`

---

`;for(let n=0;n<e.length;n++){const s=e[n],i=C(s),a=n===0?i:o+i;if(r.length+a.length>t){const l=t-r.length;l>o.length&&(r+=a.substring(0,l-3)+"...");break}r+=a;}return r}function st(e){if(!e||e.length===0)return "";let t=C(e[0]);for(let r=1;r<e.length;r++)t+=`

---

`+C(e[r]);return t}function it(e,t,r,o=null){let n="";if(o&&(n+=`${o}のツイートから`),e.length>0){const s=e[0].author;n+=`${s}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${at(t.length)}`,(r==="shitaraba"||r==="5ch")&&(n+=`/${r==="shitaraba"?4096:2048}`),n}function at(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function lt(e){if(!e||!e.formattedText){const o=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${o}`),f.showToast("エラー",o),false}if(e.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),f.showToast("エラー","コピーするテキストが空です"),false;let t=false,r=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":o});await navigator.clipboard.write([n]),t=!0;}catch(o){r=o,c.error(`ClipboardItem API失敗: ${r.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(o){r=o,c.error(`Navigator clipboard API失敗: ${r.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=e.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){r=o,c.error(`execCommand fallback失敗: ${r.message}`);}if(t)f.showToast("コピーしました",e.summary);else {const o=r?r.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${o}`),f.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class ct{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){d.collectedThreadData&&(await lt(d.collectedThreadData),d.isSecondStage=!1,d.collectedThreadData=null,f.updateMainButtonText());return}if(d.isCollecting)return;d.isCollecting=!0,f.updateMainButtonText();try{const r=await Y();let o=r;if(d.startFromTweetId){const l=r.findIndex(u=>u.id===d.startFromTweetId);l!==-1&&(o=r.slice(l));}let n="",s=o,i=!1;if(o.length>0){if(d.translateEnabled)try{d.translationInProgress=!0,f.updateMainButtonText(),f.showToast("翻訳中","翻訳処理を実行しています...");const l=await tt(o);s=l.tweets,i=l.hasTranslation;}catch(l){c.error(`Translation error: ${l}`),f.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),s=o,i=!1;}finally{d.translationInProgress=!1;}switch(d.copyMode){case "first":n=C(s[0]);break;case "shitaraba":n=H(s,4096);break;case "5ch":n=H(s,2048);break;default:n=st(s);break}}let a=it(o,n,d.copyMode,d.startFromTweetAuthor);d.translateEnabled&&i&&n.trim().length>0&&(a+=" (翻訳済み)"),d.collectedThreadData={formattedText:n,summary:a},d.isSecondStage=!0,f.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(r){c.error(`Error in copy process: ${r}`),f.showToast("エラー","スレッドのコピーに失敗しました");}finally{d.isCollecting=!1,d.translationInProgress=!1,f.updateMainButtonText();}}catch(r){c.error(`Button click handler error: ${r}`),f.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(f.init(),f.addMainButton(this.handleButtonClick.bind(this)),f.updateAllUI()):f.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const r=i=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${i}): ${t}`));},o=history.pushState;history.pushState=function(...i){o.apply(this,i),r("pushState");};const n=history.replaceState;history.replaceState=function(...i){n.apply(this,i),r("replaceState");},window.addEventListener("popstate",()=>r("popstate")),new MutationObserver(()=>r("mutation")).observe(document.body,{childList:true,subtree:true});}}new ct;

})();