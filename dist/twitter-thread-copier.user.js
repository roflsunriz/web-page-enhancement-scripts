// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.0.1
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

    const H="[TwitterThreadCopier]",l={log:e=>{console.log(H,e);},error:e=>{console.error(H,e);}};function Y(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const c=Y();var Z="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",J="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",X="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function P(e,t=24){const o=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const L={LOADING:P(X),CLIPBOARD:P(Z),COPY:P(J)};class K{shadowRoot=null;container=null;init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),document.body.appendChild(this.container),l.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
      .copy-thread-button {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #1DA1F2; /* Twitter Blue */
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: auto;
      }
      .copy-thread-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .copy-thread-button.success { background-color: #4CAF50; }
      .copy-thread-button.ready { background-color: #1DA1F2; }
      .copy-thread-button.loading svg { animation: spinning 1.5s linear infinite; }
      .copy-thread-button svg { display: block; }
      .control-panel-container {
          position: fixed;
          bottom: 160px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
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
          position: fixed;
          bottom: 180px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: auto;
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
          position: fixed;
          bottom: 220px;
          right: 20px;
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
      }
      .reset-start-point.visible { opacity: 1; visibility: visible; }
      .reset-start-point:hover { background-color: #ff5252; transform: scale(1.05); }
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.shadowRoot?.appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,l.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const o=document.createElement("select");o.id="copy-mode-select",o.innerHTML=`
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
    `,o.value=c.copyMode,o.addEventListener("change",a=>{c.copyMode=a.target.value,l.log(`Copy mode changed to: ${c.copyMode}`);}),t.appendChild(o);const r=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=c.translateEnabled,n.addEventListener("change",a=>{c.translateEnabled=a.target.checked,l.log(`Translation ${c.translateEnabled?"enabled":"disabled"}`);}),r.appendChild(n),r.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(r),this.appendChild(t),l.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const o=document.createElement("button");o.className="copy-thread-button",o.id="twitter-thread-copier-button",o.title="スレッドをコピー",this.updateMainButtonText(),o.addEventListener("click",async()=>{c.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(o),l.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(c.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${L.LOADING}`;return}if(c.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${L.LOADING}`;return}if(t.classList.remove("loading"),c.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${L.CLIPBOARD}`;else if(c.startFromTweetId){const o=c.startFromTweetText.length>20?c.startFromTweetText.substring(0,20)+"...":c.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${L.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${L.COPY}`;}}showToast(t,o){let r=this.querySelector(".copy-toast");r||(r=document.createElement("div"),r.className="copy-toast",this.appendChild(r)),r.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${o.substring(0,100)}</div>
    `,r.classList.remove("visible"),setTimeout(()=>{r?.classList.add("visible"),setTimeout(()=>{r?.classList.remove("visible"),setTimeout(()=>r?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const r=t.querySelector('a[href*="/status/"]');if(!r)return;const n=r.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const a=document.createElement("button");a.className="start-point-button",a.textContent="★",a.title="この位置からコピー開始",a.dataset.tweetId=n,c.startFromTweetId===n&&(a.classList.add("active"),a.textContent="✓",t.classList.add("start-point-set")),a.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(a);});}setStartPoint(t,o){c.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(s=>{s.classList.remove("start-point-set");const i=s.querySelector(".start-point-button");i&&(i.classList.remove("active"),i.textContent="★");});const r=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";c.startFromTweetId=o,c.startFromTweetAuthor=r,c.startFromTweetText=n,t.classList.add("start-point-set");const a=t.querySelector(".start-point-button");a&&(a.classList.add("active"),a.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${r}のツイートを起点に設定しました`),l.log(`Start point set: ${o} by ${r}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");c.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){c.startFromTweetId=null,c.startFromTweetAuthor="",c.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const o=t.querySelector(".start-point-button");o&&(o.classList.remove("active"),o.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),l.log("Start point reset");}}const b=new K;async function tt(){try{let e=function(){const i=document.querySelectorAll('article[data-testid="tweet"]');i.length>0&&!r&&(r=D(i[0]),n=N(i[0])),i.forEach(d=>{const u=d.querySelector('a[href*="/status/"]');if(!u)return;const g=u.href.split("/"),y=g.indexOf("status");if(y===-1||y+1>=g.length)return;const T=g[y+1].split("?")[0];if(o.has(T))return;const x=D(d);if(r&&x!==r)return;let p=N(d);x===r&&!p&&n&&(p=n);const w=d.querySelector('div[data-testid="tweetText"]');let m="";w&&(m=G(w));const S=d.querySelector("time"),E=S?S.getAttribute("datetime"):"",f=E?ot(new Date(E)):"",h=rt(d),M=et(d);t.push({id:T,author:x,handle:p,text:m,time:f,mediaUrls:h,quotedTweet:M}),o.add(T);});};const t=[],o=new Set;let r="",n="";const a=window.scrollY;async function s(){try{await W(),e();let u=t.length,g=0;for(let y=0;y<30;y++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(T=>setTimeout(T,700)),await W(),e(),t.length===u){if(g++,g>=3)break}else u=t.length,g=0;}catch(T){l.error(`スクロール処理エラー (試行 ${y+1}): ${T.message}`);continue}try{window.scrollTo(0,a);}catch(y){l.error(`スクロール位置復元エラー: ${y.message}`);}}catch(u){throw l.error(`スクロール収集処理エラー: ${u.message}`),u}}return await s(),t.sort((i,d)=>{const u=new Date(i.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),g=new Date(d.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return u.getTime()-g.getTime()}),t}catch(e){return l.error(`ツイート収集中にエラーが発生: ${e.message}`),l.error(`エラースタック: ${e.stack}`),[]}}function N(e){try{const o=Array.from(e.querySelectorAll("span")).find(a=>{try{const s=a.textContent?a.textContent.trim():"";return s.startsWith("@")&&!s.includes(" ")&&s.length>1}catch{return !1}});if(o)return o.textContent.trim();const r=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const a of r)try{const s=a.getAttribute("href");if(s&&!s.includes("/status/")&&s.length>1&&!s.includes("/i/"))return "@"+s.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const a=n.querySelectorAll("span");for(const s of Array.from(a))try{const i=s.textContent?s.textContent.trim():"";if(i.startsWith("@")&&!i.includes(" "))return i}catch{continue}}return ""}catch(t){return l.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function D(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return l.error(`ユーザー名取得エラー: ${t.message}`),""}}function et(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let o=null;if(t)try{const r=t.closest('div[role="link"]');r&&(o=O(r));}catch(r){l.error(`引用ツイート取得エラー: ${r.message}`);}else try{const r=e.innerText||"",n=r.includes("引用")||r.includes("Quote")||r.includes("quote"),a=e.querySelectorAll('div[role="link"]');if(a.length>0&&n)for(let s=0;s<a.length;s++){const i=a[s],d=i.innerText||"";if(d.includes("@")&&(d.includes("年")||d.includes("時間")||d.includes("分")||d.includes("日")))try{const u=O(i);if(u&&u.author&&u.text){o=u;break}}catch(u){l.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(r){l.error(`代替引用ツイート検索エラー: ${r.message}`);}return o}function O(e){const t=e.querySelector('div[dir="ltr"] > span'),o=t?t.textContent.trim():"",r=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=r?r.textContent.trim():"";let a="";const s=e.querySelector('div[data-testid="tweetText"]');if(s)a=G(s);else {const x=(e.innerText||"").split(`
`).map(m=>m.trim()).filter(m=>m);let p=-1;for(let m=0;m<x.length;m++)if(x[m].includes(n)){p=m;break}const w=p+1;p>=0&&w<x.length&&(a=x.slice(w+1).join(`
`));}const i=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(T=>{const x=T.querySelector('img[src*="pbs.twimg.com/media"]');if(x){const p=C(x.src);p&&!i.includes(p)&&i.push(p);}}),i.length===0&&(e.querySelectorAll('[role="group"]').forEach(p=>{p.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(m=>{const S=C(m.src);S&&!i.includes(S)&&i.push(S);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(p=>{const w=C(p.src);w&&!i.includes(w)&&i.push(w);}));let u="",g="";const y=e.querySelectorAll('a[href*="/status/"]');for(const T of Array.from(y)){const x=T.href;if(x&&x.includes("/status/")){const p=x.split("/"),w=p.indexOf("status");if(w!==-1&&w+1<p.length){u=p[w+1].split("?")[0],g=x;break}}}return o&&a?{author:o,handle:n,text:a,id:u,url:g,mediaUrls:i}:null}function rt(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const a=n.querySelector('img[src*="pbs.twimg.com/media"]');if(a){const s=C(a.src);s&&!t.includes(s)&&t.push(s);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=V(n.poster);if(i&&!t.includes(i)){t.push(i);return}}const s=e.querySelector('a[href*="/status/"]');if(s){const i=s.href.split("/"),d=i.indexOf("status");if(d!==-1&&d+1<i.length){const g=`https://twitter.com/i/status/${i[d+1].split("?")[0]}`;t.includes(g)||t.push(`[動画] ${g}`);}}}catch(s){l.error("Error processing blob URL: "+s);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const s=V(n.poster);s&&!t.includes(s)&&t.push(s);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(s=>{if(s.src&&s.src.includes("video.twimg.com"))t.includes(s.src)||t.push(s.src);else if(s.src&&s.src.startsWith("blob:")){const i=e.querySelector('a[href*="/status/"]');if(i){const d=i.href.split("/"),u=d.indexOf("status");if(u!==-1&&u+1<d.length){const y=`https://twitter.com/i/status/${d[u+1].split("?")[0]}`;t.includes(y)||t.push(`[動画] ${y}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(a=>{a.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const d=C(i.src);d&&!t.includes(d)&&t.push(d);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const s=C(a.src);s&&!t.includes(s)&&t.push(s);}),t}function C(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),o=t?t[1]:"jpg",r=e.split("?")[0];if(!r||r.length===0)return l.error(`無効なベースURL: ${e}`),null;const n=r+"."+o;try{return new URL(n),n}catch(a){return l.error(`無効なURL形式: ${n}, エラー内容: ${a.message}`),null}}catch(t){return l.error(`メディアURL処理エラー: ${t.message}`),null}}function V(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return l.error(`動画URL生成エラー: ${t.message}`),null}}function G(e){try{const t=e.querySelector('[role="button"]');if(t){const o=t.textContent?.trim()??"";if(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)){const r=[],n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let a;for(;a=n.nextNode();)a.textContent?.trim()&&a.parentElement&&!a.parentElement.closest('[role="button"]')&&r.push(a.textContent);return _(r,e).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return _([e.innerText],e)}catch(t){return l.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function _(e,t){try{const o=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return o.length>1?o.map(r=>r.textContent?.trim()??"").filter(r=>!r.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(o){return l.error(`改行保持処理エラー: ${o.message}`),e.join(" ").trim()}}async function W(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const o of Array.from(e))try{const r=o.textContent?o.textContent.trim():"";(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)||r.match(/show more/i))&&!o.hasAttribute("href")&&!o.querySelector("a")&&o.closest('[data-testid="tweet"]')&&o.click&&(o.click(),t++,await new Promise(a=>setTimeout(a,100)));}catch(r){l.error(`個別ツイート展開エラー: ${r.message}`);continue}return t}catch(e){return l.error(`ツイート展開処理エラー: ${e.message}`),0}}function ot(e){const t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),a=String(e.getMinutes()).padStart(2,"0");return `${t}年${o}月${r}日 ${n}:${a}`}const nt="https://translate.googleapis.com/translate_a/single";async function st(e){try{let t=function(f){const h=n++;return `###${f}${h}###`};const o={},r=new Map;let n=0;const a=/(https?:\/\/[^\s]+)|(\[動画\]\s+https?:\/\/[^\s]+)|(https:\/\/video\.twimg\.com\/[^\s]+)|(https:\/\/pbs\.twimg\.com\/[^\s]+)/g,s=/([A-Za-z0-9_]+\s+)?(@[a-zA-Z0-9_]+)/g,i=/(\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2})/g,d=/[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F0}\u{23F3}\u{25B6}\u{23F8}-\u{23FA}]/gu,T=e.replace(a,f=>{const h=t("URL");return o[h]=f,r.set(h.toLowerCase(),h),h}).replace(s,f=>{const h=t("USER");return o[h]=f,r.set(h.toLowerCase(),h),h}).replace(i,f=>{const h=t("TIME");return o[h]=f,r.set(h.toLowerCase(),h),h}).replace(d,f=>{const h=t("EMOJI");return o[h]=f,r.set(h.toLowerCase(),h),h}),x=800,p=[],w=T.split(`
`);let m="";for(const f of w)m.length+f.length+1>x&&m.length>0?(p.push(m),m=f):m=m?`${m}
${f}`:f;m&&p.push(m);const S=[];for(let f=0;f<p.length;f++){const h=p[f];if(!h||h.trim().length===0){S.push("");continue}const M="auto",Q="ja";let F="",A=0;const q=3;for(;A<q;)try{const $=`${nt}?client=gtx&sl=${M}&tl=${Q}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(h)}`,I=await new Promise((U,B)=>{GM_xmlhttpRequest({method:"GET",url:$,timeout:15e3,onload:v=>v.status>=200&&v.status<300?U(v):B(new Error(`API error: ${v.status}`)),onerror:v=>B(v),ontimeout:()=>B(new Error("Timeout"))});}),R=JSON.parse(I.responseText);if(!R?.sentences?.length)throw new Error("Invalid translation response format.");if(F=R.sentences.map(U=>U?.trans||"").join(""),!F.trim())throw new Error("Translation result is empty");S.push(F);break}catch($){if(A++,l.error(`翻訳試行 ${A}/${q} 失敗: ${$.message}`),A>=q){l.error("翻訳失敗後、元のテキストを使用します。"),S.push(h);break}await new Promise(I=>setTimeout(I,1e3*Math.pow(2,A)));}f<p.length-1&&await new Promise($=>setTimeout($,1500+Math.random()*1e3));}const E=S.join(`
`);return at(E,o,r)}catch(t){throw l.error("Translation error: "+t),t}}function j(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function at(e,t,o){let r=e;Object.keys(t).forEach(a=>{r=r.replace(new RegExp(j(a),"g"),t[a]);});const n=it(r);for(const a of n){const s=a.replace(/\s+/g,"").toLowerCase();let i=o.get(s);if(!i){const d=s.match(/(\d+)/);if(d){const u=d[1];for(const[g,y]of o.entries())if(g.includes(u)){i=y;break}}}i&&t[i]?r=r.replace(new RegExp(j(a),"g"),t[i]):l.error(`プレースホルダーの復元に失敗: ${a}`);}return r}function it(e){const t=e.match(/###\s*[A-Za-z]*\s*\d+\s*###/g)||[];return [...new Set(t)]}function k(e){let t=`${e.author} ${e.handle}
${e.text}
${e.time}
`;if(e.mediaUrls.length>0&&(t+=e.mediaUrls.join(`
`)+`
`),e.quotedTweet){const o=e.quotedTweet;t+=`
> 引用元: ${o.author} ${o.handle}
`,t+=`> ${o.text.replace(/\n/g,`
> `)}
`,o.mediaUrls.length>0&&(t+=`> ${o.mediaUrls.join(`
> `)}
`),t+=`> ${o.url}
`;}return t}function z(e,t){if(!e||e.length===0)return "";let o="";const r=`

---

`;for(let n=0;n<e.length;n++){const a=e[n],s=k(a),i=n===0?s:r+s;if(o.length+i.length>t){const d=t-o.length;d>r.length&&(o+=i.substring(0,d-3)+"...");break}o+=i;}return o}function lt(e){if(!e||e.length===0)return "";let t=k(e[0]);for(let o=1;o<e.length;o++)t+=`

---

`+k(e[o]);return t}function ct(e,t,o,r=null){let n="";if(r&&(n+=`${r}のツイートから`),e.length>0){const a=e[0].author;n+=`${a}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${dt(t.length)}`,(o==="shitaraba"||o==="5ch")&&(n+=`/${o==="shitaraba"?4096:2048}`),n}function dt(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function ut(e){if(!e||!e.formattedText){const r=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return l.error(`クリップボードコピー失敗: ${r}`),b.showToast("エラー",r),false}if(e.formattedText.trim().length===0)return l.error("クリップボードコピー失敗: formattedTextが空です"),b.showToast("エラー","コピーするテキストが空です"),false;let t=false,o=null;if(navigator.clipboard&&window.ClipboardItem)try{const r=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":r});await navigator.clipboard.write([n]),t=!0;}catch(r){o=r,l.error(`ClipboardItem API失敗: ${o.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(r){o=r,l.error(`Navigator clipboard API失敗: ${o.message}`);}if(!t)try{const r=document.createElement("textarea");if(r.value=e.formattedText,r.style.position="fixed",r.style.left="-9999px",document.body.appendChild(r),r.select(),t=document.execCommand("copy"),document.body.removeChild(r),!t)throw new Error("execCommand returned false")}catch(r){o=r,l.error(`execCommand fallback失敗: ${o.message}`);}if(t)b.showToast("コピーしました",e.summary);else {const r=o?o.message:"不明なエラー";l.error(`クリップボードコピー失敗: ${r}`),b.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class ht{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),l.log("Application initialized.");}catch(t){l.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){c.collectedThreadData&&(await ut(c.collectedThreadData),c.isSecondStage=!1,c.collectedThreadData=null,b.updateMainButtonText());return}if(c.isCollecting)return;c.isCollecting=!0,b.updateMainButtonText();try{const o=await tt();let r=o;if(c.startFromTweetId){const s=o.findIndex(i=>i.id===c.startFromTweetId);s!==-1&&(r=o.slice(s));}let n="";if(r.length>0)switch(c.copyMode){case "first":n=k(r[0]);break;case "shitaraba":n=z(r,4096);break;case "5ch":n=z(r,2048);break;default:n=lt(r);break}let a=ct(r,n,c.copyMode,c.startFromTweetAuthor);if(c.translateEnabled&&n.trim().length>0){c.translationInProgress=!0,b.updateMainButtonText();try{b.showToast("翻訳中","翻訳処理を実行しています...");const s=await st(n);s&&s.trim().length>0?(n=s,a+=" (翻訳済み)"):b.showToast("翻訳警告","翻訳結果が空のため、原文を使用します");}catch(s){l.error(`Translation error: ${s}`),b.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます");}finally{c.translationInProgress=!1;}}c.collectedThreadData={formattedText:n,summary:a},c.isSecondStage=!0,b.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(o){l.error(`Error in copy process: ${o}`),b.showToast("エラー","スレッドのコピーに失敗しました");}finally{c.isCollecting=!1,c.translationInProgress=!1,b.updateMainButtonText();}}catch(o){l.error(`Button click handler error: ${o}`),b.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(b.init(),b.addMainButton(this.handleButtonClick.bind(this)),b.updateAllUI()):b.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const o=s=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${s}): ${t}`));},r=history.pushState;history.pushState=function(...s){r.apply(this,s),o("pushState");};const n=history.replaceState;history.replaceState=function(...s){n.apply(this,s),o("replaceState");},window.addEventListener("popstate",()=>o("popstate")),new MutationObserver(()=>o("mutation")).observe(document.body,{childList:true,subtree:true});}}new ht;

})();