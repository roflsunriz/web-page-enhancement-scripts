// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      5.1.0
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

    const O="[TwitterThreadCopier]",l={log:e=>{console.log(O,e);},error:e=>{console.error(O,e);}};function Z(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const c=Z();var J="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",X="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",K="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function H(e,t=24){const o=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const M={LOADING:H(K),CLIPBOARD:H(J),COPY:H(X)};class tt{shadowRoot=null;container=null;init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),document.body.appendChild(this.container),l.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
    `,o.value=c.copyMode,o.addEventListener("change",a=>{c.copyMode=a.target.value,l.log(`Copy mode changed to: ${c.copyMode}`);}),t.appendChild(o);const r=document.createElement("label"),n=document.createElement("input");n.type="checkbox",n.id="translate-checkbox",n.checked=c.translateEnabled,n.addEventListener("change",a=>{c.translateEnabled=a.target.checked,l.log(`Translation ${c.translateEnabled?"enabled":"disabled"}`);}),r.appendChild(n),r.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(r),this.appendChild(t),l.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const o=document.createElement("button");o.className="copy-thread-button",o.id="twitter-thread-copier-button",o.title="スレッドをコピー",this.updateMainButtonText(),o.addEventListener("click",async()=>{c.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(o),l.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(c.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${M.LOADING}`;return}if(c.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${M.LOADING}`;return}if(t.classList.remove("loading"),c.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${M.CLIPBOARD}`;else if(c.startFromTweetId){const o=c.startFromTweetText.length>20?c.startFromTweetText.substring(0,20)+"...":c.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${M.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${M.COPY}`;}}showToast(t,o){let r=this.querySelector(".copy-toast");r||(r=document.createElement("div"),r.className="copy-toast",this.appendChild(r)),r.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${o.substring(0,100)}</div>
    `,r.classList.remove("visible"),setTimeout(()=>{r?.classList.add("visible"),setTimeout(()=>{r?.classList.remove("visible"),setTimeout(()=>r?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const r=t.querySelector('a[href*="/status/"]');if(!r)return;const n=r.href.split("/").pop()?.split("?")[0]??"";if(!n)return;const a=document.createElement("button");a.className="start-point-button",a.textContent="★",a.title="この位置からコピー開始",a.dataset.tweetId=n,c.startFromTweetId===n&&(a.classList.add("active"),a.textContent="✓",t.classList.add("start-point-set")),a.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(a);});}setStartPoint(t,o){c.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(s=>{s.classList.remove("start-point-set");const i=s.querySelector(".start-point-button");i&&(i.classList.remove("active"),i.textContent="★");});const r=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",n=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";c.startFromTweetId=o,c.startFromTweetAuthor=r,c.startFromTweetText=n,t.classList.add("start-point-set");const a=t.querySelector(".start-point-button");a&&(a.classList.add("active"),a.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${r}のツイートを起点に設定しました`),l.log(`Start point set: ${o} by ${r}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");c.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){c.startFromTweetId=null,c.startFromTweetAuthor="",c.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const o=t.querySelector(".start-point-button");o&&(o.classList.remove("active"),o.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),l.log("Start point reset");}}const y=new tt;async function et(){try{let e=function(){const i=document.querySelectorAll('article[data-testid="tweet"]');i.length>0&&!r&&(r=_(i[0]),n=D(i[0])),i.forEach(u=>{const p=u.querySelector('a[href*="/status/"]');if(!p)return;const g=p.href.split("/"),b=g.indexOf("status");if(b===-1||b+1>=g.length)return;const T=g[b+1].split("?")[0];if(o.has(T))return;const x=_(u);if(r&&x!==r)return;let h=D(u);x===r&&!h&&n&&(h=n);const w=u.querySelector('div[data-testid="tweetText"]');let f="";w&&(f=Y(w));const S=u.querySelector("time"),F=S?S.getAttribute("datetime"):"",U=F?nt(new Date(F)):"",P=ot(u),m=rt(u);t.push({id:T,author:x,handle:h,text:f,time:U,mediaUrls:P,quotedTweet:m}),o.add(T);});};const t=[],o=new Set;let r="",n="";const a=window.scrollY;async function s(){try{await G(),e();let p=t.length,g=0;for(let b=0;b<30;b++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(T=>setTimeout(T,700)),await G(),e(),t.length===p){if(g++,g>=3)break}else p=t.length,g=0;}catch(T){l.error(`スクロール処理エラー (試行 ${b+1}): ${T.message}`);continue}try{window.scrollTo(0,a);}catch(b){l.error(`スクロール位置復元エラー: ${b.message}`);}}catch(p){throw l.error(`スクロール収集処理エラー: ${p.message}`),p}}return await s(),t.sort((i,u)=>{const p=new Date(i.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),g=new Date(u.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return p.getTime()-g.getTime()}),t}catch(e){return l.error(`ツイート収集中にエラーが発生: ${e.message}`),l.error(`エラースタック: ${e.stack}`),[]}}function D(e){try{const o=Array.from(e.querySelectorAll("span")).find(a=>{try{const s=a.textContent?a.textContent.trim():"";return s.startsWith("@")&&!s.includes(" ")&&s.length>1}catch{return !1}});if(o)return o.textContent.trim();const r=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const a of r)try{const s=a.getAttribute("href");if(s&&!s.includes("/status/")&&s.length>1&&!s.includes("/i/"))return "@"+s.replace(/^\//,"")}catch{continue}const n=e.querySelector('div[data-testid="User-Name"]');if(n){const a=n.querySelectorAll("span");for(const s of Array.from(a))try{const i=s.textContent?s.textContent.trim():"";if(i.startsWith("@")&&!i.includes(" "))return i}catch{continue}}return ""}catch(t){return l.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function _(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return l.error(`ユーザー名取得エラー: ${t.message}`),""}}function rt(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let o=null;if(t)try{const r=t.closest('div[role="link"]');r&&(o=V(r));}catch(r){l.error(`引用ツイート取得エラー: ${r.message}`);}else try{const r=e.innerText||"",n=r.includes("引用")||r.includes("Quote")||r.includes("quote"),a=e.querySelectorAll('div[role="link"]');if(a.length>0&&n)for(let s=0;s<a.length;s++){const i=a[s],u=i.innerText||"";if(u.includes("@")&&(u.includes("年")||u.includes("時間")||u.includes("分")||u.includes("日")))try{const p=V(i);if(p&&p.author&&p.text){o=p;break}}catch(p){l.error(`代替引用ツイート抽出エラー: ${p.message}`);}}}catch(r){l.error(`代替引用ツイート検索エラー: ${r.message}`);}return o}function V(e){const t=e.querySelector('div[dir="ltr"] > span'),o=t?t.textContent.trim():"",r=e.querySelector('div[dir="ltr"] span:nth-child(2)'),n=r?r.textContent.trim():"";let a="";const s=e.querySelector('div[data-testid="tweetText"]');if(s)a=Y(s);else {const x=(e.innerText||"").split(`
`).map(f=>f.trim()).filter(f=>f);let h=-1;for(let f=0;f<x.length;f++)if(x[f].includes(n)){h=f;break}const w=h+1;h>=0&&w<x.length&&(a=x.slice(w+1).join(`
`));}const i=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(T=>{const x=T.querySelector('img[src*="pbs.twimg.com/media"]');if(x){const h=I(x.src);h&&!i.includes(h)&&i.push(h);}}),i.length===0&&(e.querySelectorAll('[role="group"]').forEach(h=>{h.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(f=>{const S=I(f.src);S&&!i.includes(S)&&i.push(S);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(h=>{const w=I(h.src);w&&!i.includes(w)&&i.push(w);}));let p="",g="";const b=e.querySelectorAll('a[href*="/status/"]');for(const T of Array.from(b)){const x=T.href;if(x&&x.includes("/status/")){const h=x.split("/"),w=h.indexOf("status");if(w!==-1&&w+1<h.length){p=h[w+1].split("?")[0],g=x;break}}}return o&&a?{author:o,handle:n,text:a,id:p,url:g,mediaUrls:i}:null}function ot(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(n=>{const a=n.querySelector('img[src*="pbs.twimg.com/media"]');if(a){const s=I(a.src);s&&!t.includes(s)&&t.push(s);}}),e.querySelectorAll("video").forEach(n=>{if(n.src&&n.src.startsWith("blob:"))try{if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=W(n.poster);if(i&&!t.includes(i)){t.push(i);return}}const s=e.querySelector('a[href*="/status/"]');if(s){const i=s.href.split("/"),u=i.indexOf("status");if(u!==-1&&u+1<i.length){const g=`https://twitter.com/i/status/${i[u+1].split("?")[0]}`;t.includes(g)||t.push(`[動画] ${g}`);}}}catch(s){l.error("Error processing blob URL: "+s);}else {if(n.poster&&n.poster.includes("pbs.twimg.com/tweet_video_thumb")){const s=W(n.poster);s&&!t.includes(s)&&t.push(s);}n.src&&n.src.includes("video.twimg.com")&&(t.includes(n.src)||t.push(n.src));}n.querySelectorAll("source").forEach(s=>{if(s.src&&s.src.includes("video.twimg.com"))t.includes(s.src)||t.push(s.src);else if(s.src&&s.src.startsWith("blob:")){const i=e.querySelector('a[href*="/status/"]');if(i){const u=i.href.split("/"),p=u.indexOf("status");if(p!==-1&&p+1<u.length){const b=`https://twitter.com/i/status/${u[p+1].split("?")[0]}`;t.includes(b)||t.push(`[動画] ${b}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(a=>{a.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const u=I(i.src);u&&!t.includes(u)&&t.push(u);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(a=>{const s=I(a.src);s&&!t.includes(s)&&t.push(s);}),t}function I(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),o=t?t[1]:"jpg",r=e.split("?")[0];if(!r||r.length===0)return l.error(`無効なベースURL: ${e}`),null;const n=r+"."+o;try{return new URL(n),n}catch(a){return l.error(`無効なURL形式: ${n}, エラー内容: ${a.message}`),null}}catch(t){return l.error(`メディアURL処理エラー: ${t.message}`),null}}function W(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return l.error(`動画URL生成エラー: ${t.message}`),null}}function Y(e){try{const t=e.querySelector('[role="button"]');if(t){const o=t.textContent?.trim()??"";if(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)){const r=[],n=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let a;for(;a=n.nextNode();)a.textContent?.trim()&&a.parentElement&&!a.parentElement.closest('[role="button"]')&&r.push(a.textContent);return j(r,e).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return j([e.innerText],e)}catch(t){return l.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function j(e,t){try{const o=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return o.length>1?o.map(r=>r.textContent?.trim()??"").filter(r=>!r.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(o){return l.error(`改行保持処理エラー: ${o.message}`),e.join(" ").trim()}}async function G(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const o of Array.from(e))try{const r=o.textContent?o.textContent.trim():"";(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)||r.match(/show more/i))&&!o.hasAttribute("href")&&!o.querySelector("a")&&o.closest('[data-testid="tweet"]')&&o.click&&(o.click(),t++,await new Promise(a=>setTimeout(a,100)));}catch(r){l.error(`個別ツイート展開エラー: ${r.message}`);continue}return t}catch(e){return l.error(`ツイート展開処理エラー: ${e.message}`),0}}function nt(e){const t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),n=String(e.getHours()).padStart(2,"0"),a=String(e.getMinutes()).padStart(2,"0");return `${t}年${o}月${r}日 ${n}:${a}`}const st="http://localhost:3002/v1/chat/completions",at="https://translate.googleapis.com/translate_a/single";async function it(e){try{let t=function(m){const d=n++;return `###${m}${d}###`};const o={},r=new Map;let n=0;const a=/(https?:\/\/[^\s]+)|(\[動画\]\s+https?:\/\/[^\s]+)|(https:\/\/video\.twimg\.com\/[^\s]+)|(https:\/\/pbs\.twimg\.com\/[^\s]+)/g,s=/([A-Za-z0-9_]+\s+)?(@[a-zA-Z0-9_]+)/g,i=/(\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2})/g,u=/[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F0}\u{23F3}\u{25B6}\u{23F8}-\u{23FA}]/gu,T=e.replace(a,m=>{const d=t("URL");return o[d]=m,r.set(d.toLowerCase(),d),d}).replace(s,m=>{const d=t("USER");return o[d]=m,r.set(d.toLowerCase(),d),d}).replace(i,m=>{const d=t("TIME");return o[d]=m,r.set(d.toLowerCase(),d),d}).replace(u,m=>{const d=t("EMOJI");return o[d]=m,r.set(d.toLowerCase(),d),d}),x=5e3,h=[],w=T.split(`
`);let f="";for(const m of w)f.length+m.length+1>x&&f.length>0?(h.push(f),f=m):f=f?`${f}
${m}`:m;f&&h.push(f);const S=[];async function F(m){try{const d=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${m}
<|plamo:op|>output lang=ja`,A=await new Promise((E,L)=>{GM_xmlhttpRequest({method:"POST",url:st,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"user",content:d}],temperature:0,max_tokens:4096,stream:!1}),timeout:3e4,onload:C=>C.status>=200&&C.status<300?E(C):L(new Error(`API error: ${C.status}`)),onerror:C=>L(C),ontimeout:()=>L(new Error("Timeout"))});}),$=JSON.parse(A.responseText)?.choices?.[0]?.message?.content;if($&&$.trim().length>0)return l.log("ローカルAIでの翻訳に成功しました。"),$;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(d){return l.error(`ローカルAIでの翻訳に失敗: ${d.message}`),null}}async function U(m){const d="auto";let v=0;const $=3;for(;v<$;)try{const E=`${at}?client=gtx&sl=${d}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(m)}`,L=await new Promise((B,R)=>{GM_xmlhttpRequest({method:"GET",url:E,timeout:15e3,onload:k=>k.status>=200&&k.status<300?B(k):R(new Error(`API error: ${k.status}`)),onerror:k=>R(k),ontimeout:()=>R(new Error("Timeout"))});}),C=JSON.parse(L.responseText);if(!C?.sentences?.length)throw new Error("Invalid translation response format.");const N=C.sentences.map(B=>B?.trans||"").join("");if(!N.trim())throw new Error("Translation result is empty");return N}catch(E){if(v++,l.error(`Google翻訳試行 ${v}/${$} 失敗: ${E.message}`),v>=$)throw E;await new Promise(L=>setTimeout(L,1e3*Math.pow(2,v)));}throw new Error("Google翻訳に失敗しました。")}for(let m=0;m<h.length;m++){const d=h[m];if(!d||d.trim().length===0){S.push("");continue}let A=await F(d);if(!A){l.log("ローカルAIでの翻訳に失敗したため、Google翻訳にフォールバックします。");try{A=await U(d);}catch(v){l.error(`Google翻訳にも失敗しました: ${v.message}`),l.error("翻訳失敗後、元のテキストを使用します。"),A=d;}}S.push(A),m<h.length-1&&await new Promise(v=>setTimeout(v,1500+Math.random()*1e3));}const P=S.join(`
`);return lt(P,o,r)}catch(t){throw l.error("Translation error: "+t),t}}function z(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function lt(e,t,o){let r=e;Object.keys(t).forEach(a=>{r=r.replace(new RegExp(z(a),"g"),t[a]);});const n=ct(r);for(const a of n){const s=a.replace(/\s+/g,"").toLowerCase();let i=o.get(s);if(!i){const u=s.match(/(\d+)/);if(u){const p=u[1];for(const[g,b]of o.entries())if(g.includes(p)){i=b;break}}}i&&t[i]?r=r.replace(new RegExp(z(a),"g"),t[i]):l.error(`プレースホルダーの復元に失敗: ${a}`);}return r}function ct(e){const t=e.match(/###\s*[A-Za-z]*\s*\d+\s*###/g)||[];return [...new Set(t)]}function q(e){let t=`${e.author} ${e.handle}
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
`;}return t}function Q(e,t){if(!e||e.length===0)return "";let o="";const r=`

---

`;for(let n=0;n<e.length;n++){const a=e[n],s=q(a),i=n===0?s:r+s;if(o.length+i.length>t){const u=t-o.length;u>r.length&&(o+=i.substring(0,u-3)+"...");break}o+=i;}return o}function ut(e){if(!e||e.length===0)return "";let t=q(e[0]);for(let o=1;o<e.length;o++)t+=`

---

`+q(e[o]);return t}function dt(e,t,o,r=null){let n="";if(r&&(n+=`${r}のツイートから`),e.length>0){const a=e[0].author;n+=`${a}のスレッド`;}return n+=`(${e.length}件)をコピーしました。`,n+=`文字数: ${pt(t.length)}`,(o==="shitaraba"||o==="5ch")&&(n+=`/${o==="shitaraba"?4096:2048}`),n}function pt(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function ht(e){if(!e||!e.formattedText){const r=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return l.error(`クリップボードコピー失敗: ${r}`),y.showToast("エラー",r),false}if(e.formattedText.trim().length===0)return l.error("クリップボードコピー失敗: formattedTextが空です"),y.showToast("エラー","コピーするテキストが空です"),false;let t=false,o=null;if(navigator.clipboard&&window.ClipboardItem)try{const r=new Blob([e.formattedText],{type:"text/plain"}),n=new window.ClipboardItem({"text/plain":r});await navigator.clipboard.write([n]),t=!0;}catch(r){o=r,l.error(`ClipboardItem API失敗: ${o.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(r){o=r,l.error(`Navigator clipboard API失敗: ${o.message}`);}if(!t)try{const r=document.createElement("textarea");if(r.value=e.formattedText,r.style.position="fixed",r.style.left="-9999px",document.body.appendChild(r),r.select(),t=document.execCommand("copy"),document.body.removeChild(r),!t)throw new Error("execCommand returned false")}catch(r){o=r,l.error(`execCommand fallback失敗: ${o.message}`);}if(t)y.showToast("コピーしました",e.summary);else {const r=o?o.message:"不明なエラー";l.error(`クリップボードコピー失敗: ${r}`),y.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class mt{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),l.log("Application initialized.");}catch(t){l.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){c.collectedThreadData&&(await ht(c.collectedThreadData),c.isSecondStage=!1,c.collectedThreadData=null,y.updateMainButtonText());return}if(c.isCollecting)return;c.isCollecting=!0,y.updateMainButtonText();try{const o=await et();let r=o;if(c.startFromTweetId){const s=o.findIndex(i=>i.id===c.startFromTweetId);s!==-1&&(r=o.slice(s));}let n="";if(r.length>0)switch(c.copyMode){case "first":n=q(r[0]);break;case "shitaraba":n=Q(r,4096);break;case "5ch":n=Q(r,2048);break;default:n=ut(r);break}let a=dt(r,n,c.copyMode,c.startFromTweetAuthor);if(c.translateEnabled&&n.trim().length>0){c.translationInProgress=!0,y.updateMainButtonText();try{y.showToast("翻訳中","翻訳処理を実行しています...");const s=await it(n);s&&s.trim().length>0?(n=s,a+=" (翻訳済み)"):y.showToast("翻訳警告","翻訳結果が空のため、原文を使用します");}catch(s){l.error(`Translation error: ${s}`),y.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます");}finally{c.translationInProgress=!1;}}c.collectedThreadData={formattedText:n,summary:a},c.isSecondStage=!0,y.showToast("準備完了",`${a} クリックしてコピーしてください`);}catch(o){l.error(`Error in copy process: ${o}`),y.showToast("エラー","スレッドのコピーに失敗しました");}finally{c.isCollecting=!1,c.translationInProgress=!1,y.updateMainButtonText();}}catch(o){l.error(`Button click handler error: ${o}`),y.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(y.init(),y.addMainButton(this.handleButtonClick.bind(this)),y.updateAllUI()):y.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const o=s=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${s}): ${t}`));},r=history.pushState;history.pushState=function(...s){r.apply(this,s),o("pushState");};const n=history.replaceState;history.replaceState=function(...s){n.apply(this,s),o("replaceState");},window.addEventListener("popstate",()=>o("popstate")),new MutationObserver(()=>o("mutation")).observe(document.body,{childList:true,subtree:true});}}new mt;

})();