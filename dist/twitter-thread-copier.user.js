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

    const $="[TwitterThreadCopier]",c={log:e=>{console.log($,e);},error:e=>{console.error($,e);}};function _(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:""}}const d=_();var j="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",G="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",z="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function C(e,t=24){const o=String(t),r=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}const S={LOADING:C(z),CLIPBOARD:C(j),COPY:C(G)};class W{shadowRoot=null;container=null;init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),document.body.appendChild(this.container),c.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style");t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.shadowRoot?.appendChild(t);}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,c.log("Shadow DOM destroyed");}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const o=document.createElement("select");o.id="copy-mode-select",o.innerHTML=`
      <option value="all">全ツイート</option>
      <option value="first">最初のツイートのみ</option>
      <option value="shitaraba">したらば (4096文字)</option>
      <option value="5ch">5ch (2048文字)</option>
    `,o.value=d.copyMode,o.addEventListener("change",n=>{d.copyMode=n.target.value,c.log(`Copy mode changed to: ${d.copyMode}`);}),t.appendChild(o);const r=document.createElement("label"),s=document.createElement("input");s.type="checkbox",s.id="translate-checkbox",s.checked=d.translateEnabled,s.addEventListener("change",n=>{d.translateEnabled=n.target.checked,c.log(`Translation ${d.translateEnabled?"enabled":"disabled"}`);}),r.appendChild(s),r.appendChild(document.createTextNode("日本語に翻訳")),t.appendChild(r),this.appendChild(t),c.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const o=document.createElement("button");o.className="copy-thread-button",o.id="twitter-thread-copier-button",o.title="スレッドをコピー",o.addEventListener("click",async()=>{d.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(o),this.updateMainButtonText(),c.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(t){if(d.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">収集中...</span>${S.LOADING}`;return}if(d.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">翻訳中...</span>${S.LOADING}`;return}if(t.classList.remove("loading"),d.isSecondStage)t.classList.add("ready"),t.innerHTML=`<span class="text">クリックしてコピー</span>${S.CLIPBOARD}`;else if(d.startFromTweetId){const o=d.startFromTweetText.length>20?d.startFromTweetText.substring(0,20)+"...":d.startFromTweetText;t.innerHTML=`<span class="text">${o}からコピー</span>${S.COPY}`;}else t.classList.remove("ready"),t.innerHTML=`<span class="text">スレッドをコピー</span>${S.COPY}`;}}showToast(t,o){let r=this.querySelector(".copy-toast");r||(r=document.createElement("div"),r.className="copy-toast",this.appendChild(r)),r.innerHTML=`
      <div class="toast-title">${t}</div>
      <div class="toast-content">${o.substring(0,100)}</div>
    `,r.classList.remove("visible"),setTimeout(()=>{r?.classList.add("visible"),setTimeout(()=>{r?.classList.remove("visible"),setTimeout(()=>r?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{if(Array.from(t.children).find(a=>a.classList.contains("start-point-button")))return;const r=t.querySelector('a[href*="/status/"]');if(!r)return;const s=r.href.split("/").pop()?.split("?")[0]??"";if(!s)return;const n=document.createElement("button");n.className="start-point-button",n.textContent="★",n.title="この位置からコピー開始",n.dataset.tweetId=s,d.startFromTweetId===s&&(n.classList.add("active"),n.textContent="✓",t.classList.add("start-point-set")),n.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),this.setStartPoint(t,s);}),t.appendChild(n);});}setStartPoint(t,o){d.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(a=>{a.classList.remove("start-point-set");const i=a.querySelector(".start-point-button");i&&(i.classList.remove("active"),i.textContent="★");});const r=t.querySelector('div[data-testid="User-Name"]')?.innerText??"",s=t.querySelector('div[data-testid="tweetText"]')?.innerText??"";d.startFromTweetId=o,d.startFromTweetAuthor=r,d.startFromTweetText=s,t.classList.add("start-point-set");const n=t.querySelector(".start-point-button");n&&(n.classList.add("active"),n.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点設定完了",`${r}のツイートを起点に設定しました`),c.log(`Start point set: ${o} by ${r}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");d.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent="起点をリセット",t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){d.startFromTweetId=null,d.startFromTweetAuthor="",d.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const o=t.querySelector(".start-point-button");o&&(o.classList.remove("active"),o.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast("起点リセット","コピー起点をリセットしました"),c.log("Start point reset");}}const g=new W;async function Q(){try{let e=function(){const i=document.querySelectorAll('article[data-testid="tweet"]');i.length>0&&!r&&(r=L(i[0]),s=q(i[0])),i.forEach(l=>{const u=l.querySelector('a[href*="/status/"]');if(!u)return;const p=u.href.split("/"),h=p.indexOf("status");if(h===-1||h+1>=p.length)return;const w=p[h+1].split("?")[0];if(o.has(w))return;const f=L(l);if(r&&f!==r)return;let m=q(l);f===r&&!m&&s&&(m=s);const x=l.querySelector('div[data-testid="tweetText"]');let y="";x&&(y=R(x));const b=l.querySelector("time"),A=b?b.getAttribute("datetime"):"",N=A?J(new Date(A)):"",O=Z(l),V=Y(l),D=u.href?u.href.split("?")[0]:"";t.push({id:w,author:f,handle:m,text:y,time:N,url:D,mediaUrls:O,quotedTweet:V}),o.add(w);});};const t=[],o=new Set;let r="",s="";const n=window.scrollY;async function a(){try{await E(),e();let u=t.length,p=0;for(let h=0;h<30;h++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(w=>setTimeout(w,700)),await E(),e(),t.length===u){if(p++,p>=3)break}else u=t.length,p=0;}catch(w){c.error(`スクロール処理エラー (試行 ${h+1}): ${w.message}`);continue}try{window.scrollTo(0,n);}catch(h){c.error(`スクロール位置復元エラー: ${h.message}`);}}catch(u){throw c.error(`スクロール収集処理エラー: ${u.message}`),u}}return await a(),t.sort((i,l)=>{const u=new Date(i.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]),p=new Date(l.time.replace(/年|月|日/g,"-").replace(/:/g,"-").split(" ")[0]);return u.getTime()-p.getTime()}),t}catch(e){return c.error(`ツイート収集中にエラーが発生: ${e.message}`),c.error(`エラースタック: ${e.stack}`),[]}}function q(e){try{const o=Array.from(e.querySelectorAll("span")).find(n=>{try{const a=n.textContent?n.textContent.trim():"";return a.startsWith("@")&&!a.includes(" ")&&a.length>1}catch{return !1}});if(o)return o.textContent.trim();const r=Array.from(e.querySelectorAll('a[role="link"][href^="/"]'));for(const n of r)try{const a=n.getAttribute("href");if(a&&!a.includes("/status/")&&a.length>1&&!a.includes("/i/"))return "@"+a.replace(/^\//,"")}catch{continue}const s=e.querySelector('div[data-testid="User-Name"]');if(s){const n=s.querySelectorAll("span");for(const a of Array.from(n))try{const i=a.textContent?a.textContent.trim():"";if(i.startsWith("@")&&!i.includes(" "))return i}catch{continue}}return ""}catch(t){return c.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function L(e){try{const t=e.querySelector('div[data-testid="User-Name"] a[role="link"] span');return t&&t.textContent?t.textContent.trim():""}catch(t){return c.error(`ユーザー名取得エラー: ${t.message}`),""}}function Y(e){const t=e.querySelector('[data-testid="tweetQuotedLink"]');let o=null;if(t)try{const r=t.closest('div[role="link"]');r&&(o=k(r));}catch(r){c.error(`引用ツイート取得エラー: ${r.message}`);}else try{const r=e.innerText||"",s=r.includes("引用")||r.includes("Quote")||r.includes("quote"),n=e.querySelectorAll('div[role="link"]');if(n.length>0&&s)for(let a=0;a<n.length;a++){const i=n[a],l=i.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const u=k(i);if(u&&u.author&&u.text){o=u;break}}catch(u){c.error(`代替引用ツイート抽出エラー: ${u.message}`);}}}catch(r){c.error(`代替引用ツイート検索エラー: ${r.message}`);}return o}function k(e){const t=e.querySelector('div[dir="ltr"] > span'),o=t?t.textContent.trim():"",r=e.querySelector('div[dir="ltr"] span:nth-child(2)'),s=r?r.textContent.trim():"";let n="";const a=e.querySelector('div[data-testid="tweetText"]');if(a)n=R(a);else {const f=(e.innerText||"").split(`
`).map(y=>y.trim()).filter(y=>y);let m=-1;for(let y=0;y<f.length;y++)if(f[y].includes(s)){m=y;break}const x=m+1;m>=0&&x<f.length&&(n=f.slice(x+1).join(`
`));}const i=[];e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(w=>{const f=w.querySelector('img[src*="pbs.twimg.com/media"]');if(f){const m=T(f.src);m&&!i.includes(m)&&i.push(m);}}),i.length===0&&(e.querySelectorAll('[role="group"]').forEach(m=>{m.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(y=>{const b=T(y.src);b&&!i.includes(b)&&i.push(b);});}),e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(m=>{const x=T(m.src);x&&!i.includes(x)&&i.push(x);}));let u="",p="";const h=e.querySelectorAll('a[href*="/status/"]');for(const w of Array.from(h)){const f=w.href;if(f&&f.includes("/status/")){const m=f.split("/"),x=m.indexOf("status");if(x!==-1&&x+1<m.length){u=m[x+1].split("?")[0],p=f;break}}}return o&&n?{author:o,handle:s,text:n,id:u,url:p,mediaUrls:i}:null}function Z(e){const t=[];return e.querySelectorAll('[data-testid="tweetPhoto"]').forEach(s=>{const n=s.querySelector('img[src*="pbs.twimg.com/media"]');if(n){const a=T(n.src);a&&!t.includes(a)&&t.push(a);}}),e.querySelectorAll("video").forEach(s=>{if(s.src&&s.src.startsWith("blob:"))try{if(s.poster&&s.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=I(s.poster);if(i&&!t.includes(i)){t.push(i);return}}const a=e.querySelector('a[href*="/status/"]');if(a){const i=a.href.split("/"),l=i.indexOf("status");if(l!==-1&&l+1<i.length){const p=`https://twitter.com/i/status/${i[l+1].split("?")[0]}`;t.includes(p)||t.push(`[動画] ${p}`);}}}catch(a){c.error("Error processing blob URL: "+a);}else {if(s.poster&&s.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=I(s.poster);a&&!t.includes(a)&&t.push(a);}s.src&&s.src.includes("video.twimg.com")&&(t.includes(s.src)||t.push(s.src));}s.querySelectorAll("source").forEach(a=>{if(a.src&&a.src.includes("video.twimg.com"))t.includes(a.src)||t.push(a.src);else if(a.src&&a.src.startsWith("blob:")){const i=e.querySelector('a[href*="/status/"]');if(i){const l=i.href.split("/"),u=l.indexOf("status");if(u!==-1&&u+1<l.length){const h=`https://twitter.com/i/status/${l[u+1].split("?")[0]}`;t.includes(h)||t.push(`[動画] ${h}`);}}}});}),t.length===0&&e.querySelectorAll('[role="group"]').forEach(n=>{n.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(i=>{const l=T(i.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&e.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(n=>{const a=T(n.src);a&&!t.includes(a)&&t.push(a);}),t}function T(e){if(!e||typeof e!="string"||!e.includes("pbs.twimg.com/media"))return null;try{const t=e.match(/format=([^&]+)/),o=t?t[1]:"jpg",r=e.split("?")[0];if(!r||r.length===0)return c.error(`無効なベースURL: ${e}`),null;const s=r+"."+o;try{return new URL(s),s}catch(n){return c.error(`無効なURL形式: ${s}, エラー内容: ${n.message}`),null}}catch(t){return c.error(`メディアURL処理エラー: ${t.message}`),null}}function I(e){if(!e||!e.includes("tweet_video_thumb"))return null;try{const t=e.match(/tweet_video_thumb\/([^.]+)/);return !t||!t[1]?null:`https://video.twimg.com/tweet_video/${t[1]}.mp4`}catch(t){return c.error(`動画URL生成エラー: ${t.message}`),null}}function R(e){try{const t=e.querySelector('[role="button"]');if(t){const o=t.textContent?.trim()??"";if(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)){const r=[],s=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null);let n;for(;n=s.nextNode();)n.textContent?.trim()&&n.parentElement&&!n.parentElement.closest('[role="button"]')&&r.push(n.textContent);return M(r,e).replace(/(さらに表示|Show more|もっと見る)/g,"").trim()}}return M([e.innerText],e)}catch(t){return c.error(`ツイートテキスト取得エラー: ${t.message}`),e.innerText}}function M(e,t){try{const o=Array.from(t.querySelectorAll('p, div[dir="auto"]'));return o.length>1?o.map(r=>r.textContent?.trim()??"").filter(r=>!r.match(/(さらに表示|Show more|もっと見る)/i)).join(`
`):e.join(" ").trim()}catch(o){return c.error(`改行保持処理エラー: ${o.message}`),e.join(" ").trim()}}async function E(){try{const e=document.querySelectorAll('[data-testid="tweet"] [role="button"]');let t=0;for(const o of Array.from(e))try{const r=o.textContent?o.textContent.trim():"";(r==="さらに表示"||r==="Show more"||r.match(/もっと見る/i)||r.match(/show more/i))&&!o.hasAttribute("href")&&!o.querySelector("a")&&o.closest('[data-testid="tweet"]')&&o.click&&(o.click(),t++,await new Promise(n=>setTimeout(n,100)));}catch(r){c.error(`個別ツイート展開エラー: ${r.message}`);continue}return t}catch(e){return c.error(`ツイート展開処理エラー: ${e.message}`),0}}function J(e){const t=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),s=String(e.getHours()).padStart(2,"0"),n=String(e.getMinutes()).padStart(2,"0");return `${t}年${o}月${r}日 ${s}:${n}`}const X="http://localhost:3002/v1/chat/completions",K="https://translate.googleapis.com/translate_a/single";async function tt(e){const t=e.map(nt),o=t.map(n=>({tweet:n,textSegments:B(n.text),quotedSegments:n.quotedTweet?B(n.quotedTweet.text):null})),r=[];for(const n of o){for(const a of n.textSegments)U(a,r);if(n.quotedSegments)for(const a of n.quotedSegments)U(a,r);}if(r.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let n=0;n<r.length;n++){const a=r[n];try{const l=await et(a.original);a.translated=l,!s&&l!==a.original&&(s=!0);}catch(l){c.error(`セグメント翻訳に失敗: ${l.message}`),a.translated=a.original;}n<r.length-1&&await F(1e3+Math.random()*500);}for(const n of o)n.tweet.text=P(n.textSegments),n.quotedSegments&&n.tweet.quotedTweet&&(n.tweet.quotedTweet.text=P(n.quotedSegments));return {tweets:t,hasTranslation:s}}function U(e,t){if(e.kind==="text"){if(e.original.trim().length===0){e.translated=e.original;return}t.push(e);}}function P(e){return e.length===0?"":e.map(t=>t.kind==="fixed"?t.value:t.translated??t.original).join("")}function B(e){if(!e)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,o=[];let r=0,s;for(;(s=t.exec(e))!==null;)s.index>r&&o.push({kind:"text",original:e.slice(r,s.index)}),o.push({kind:"fixed",value:s[0]}),r=s.index+s[0].length;return r<e.length&&o.push({kind:"text",original:e.slice(r)}),o.length===0&&o.push({kind:"text",original:e}),o}async function et(e){if(e.trim().length===0)return e;const t=await rt(e);if(t)return t;try{return await ot(e)}catch(o){return c.error(`Google翻訳にも失敗しました: ${o.message}`),e}}async function rt(e){try{const t=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${e}
<|plamo:op|>output lang=ja`,o=await new Promise((n,a)=>{GM_xmlhttpRequest({method:"POST",url:X,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"user",content:t}],temperature:0,max_tokens:4096,stream:!1}),timeout:3e4,onload:i=>i.status>=200&&i.status<300?n(i):a(new Error(`API error: ${i.status}`)),onerror:i=>a(i),ontimeout:()=>a(new Error("Timeout"))});}),s=JSON.parse(o.responseText)?.choices?.[0]?.message?.content;if(s&&s.trim().length>0)return c.log("ローカルAIでの翻訳に成功しました。"),s;throw new Error("ローカルAIからの翻訳結果が空です。")}catch(t){return c.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function ot(e){const t="auto";let r=0;const s=3;for(;r<s;)try{const n=`${K}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(e)}`,a=await new Promise((u,p)=>{GM_xmlhttpRequest({method:"GET",url:n,timeout:15e3,onload:h=>h.status>=200&&h.status<300?u(h):p(new Error(`API error: ${h.status}`)),onerror:h=>p(h),ontimeout:()=>p(new Error("Timeout"))});}),i=JSON.parse(a.responseText);if(!i?.sentences?.length)throw new Error("Invalid translation response format.");const l=i.sentences.map(u=>u?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(n){if(r++,c.error(`Google翻訳試行 ${r}/${s} 失敗: ${n.message}`),r>=s)throw n;await F(1e3*Math.pow(2,r));}throw new Error("Google翻訳に失敗しました。")}function nt(e){return {...e,mediaUrls:[...e.mediaUrls],quotedTweet:e.quotedTweet?{...e.quotedTweet,mediaUrls:[...e.quotedTweet.mediaUrls]}:null}}async function F(e){await new Promise(t=>setTimeout(t,e));}function v(e){let t=`${e.author} ${e.handle}
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

`;for(let s=0;s<e.length;s++){const n=e[s],a=v(n),i=s===0?a:r+a;if(o.length+i.length>t){const l=t-o.length;l>r.length&&(o+=i.substring(0,l-3)+"...");break}o+=i;}return o}function st(e){if(!e||e.length===0)return "";let t=v(e[0]);for(let o=1;o<e.length;o++)t+=`

---

`+v(e[o]);return t}function at(e,t,o,r=null){let s="";if(r&&(s+=`${r}のツイートから`),e.length>0){const n=e[0].author;s+=`${n}のスレッド`;}return s+=`(${e.length}件)をコピーしました。`,s+=`文字数: ${it(t.length)}`,(o==="shitaraba"||o==="5ch")&&(s+=`/${o==="shitaraba"?4096:2048}`),s}function it(e){return e<1e3?e.toString():e<1e4?(e/1e3).toFixed(1)+"k":Math.round(e/1e3)+"k"}async function lt(e){if(!e||!e.formattedText){const r=e?"コピーするテキストがありません (formattedText is null)":"コピーするデータがありません (threadData is null)";return c.error(`クリップボードコピー失敗: ${r}`),g.showToast("エラー",r),false}if(e.formattedText.trim().length===0)return c.error("クリップボードコピー失敗: formattedTextが空です"),g.showToast("エラー","コピーするテキストが空です"),false;let t=false,o=null;if(navigator.clipboard&&window.ClipboardItem)try{const r=new Blob([e.formattedText],{type:"text/plain"}),s=new window.ClipboardItem({"text/plain":r});await navigator.clipboard.write([s]),t=!0;}catch(r){o=r,c.error(`ClipboardItem API失敗: ${o.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e.formattedText),t=!0;}catch(r){o=r,c.error(`Navigator clipboard API失敗: ${o.message}`);}if(!t)try{const r=document.createElement("textarea");if(r.value=e.formattedText,r.style.position="fixed",r.style.left="-9999px",document.body.appendChild(r),r.select(),t=document.execCommand("copy"),document.body.removeChild(r),!t)throw new Error("execCommand returned false")}catch(r){o=r,c.error(`execCommand fallback失敗: ${o.message}`);}if(t)g.showToast("コピーしました",e.summary);else {const r=o?o.message:"不明なエラー";c.error(`クリップボードコピー失敗: ${r}`),g.showToast("エラー","クリップボードへのコピーに失敗しました。");}return t}class ct{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),c.log("Application initialized.");}catch(t){c.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){d.collectedThreadData&&(await lt(d.collectedThreadData),d.isSecondStage=!1,d.collectedThreadData=null,g.updateMainButtonText());return}if(d.isCollecting)return;d.isCollecting=!0,g.updateMainButtonText();try{const o=await Q();let r=o;if(d.startFromTweetId){const l=o.findIndex(u=>u.id===d.startFromTweetId);l!==-1&&(r=o.slice(l));}let s="",n=r,a=!1;if(r.length>0){if(d.translateEnabled)try{d.translationInProgress=!0,g.updateMainButtonText(),g.showToast("翻訳中","翻訳処理を実行しています...");const l=await tt(r);n=l.tweets,a=l.hasTranslation;}catch(l){c.error(`Translation error: ${l}`),g.showToast("翻訳エラー","翻訳中にエラーが発生しましたが、原文をコピーできます"),n=r,a=!1;}finally{d.translationInProgress=!1;}switch(d.copyMode){case "first":s=v(n[0]);break;case "shitaraba":s=H(n,4096);break;case "5ch":s=H(n,2048);break;default:s=st(n);break}}let i=at(r,s,d.copyMode,d.startFromTweetAuthor);d.translateEnabled&&a&&s.trim().length>0&&(i+=" (翻訳済み)"),d.collectedThreadData={formattedText:s,summary:i},d.isSecondStage=!0,g.showToast("準備完了",`${i} クリックしてコピーしてください`);}catch(o){c.error(`Error in copy process: ${o}`),g.showToast("エラー","スレッドのコピーに失敗しました");}finally{d.isCollecting=!1,d.translationInProgress=!1,g.updateMainButtonText();}}catch(o){c.error(`Button click handler error: ${o}`),g.showToast("内部エラー","処理中に予期せぬエラーが発生しました。");}}updateButtonVisibility(){this.isTwitterStatusPage()?(g.init(),g.addMainButton(this.handleButtonClick.bind(this)),g.updateAllUI()):g.destroy();}isTwitterStatusPage(){return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href)}observeUrlChanges(){let t=location.href;const o=a=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300),console.log(`URL changed (${a}): ${t}`));},r=history.pushState;history.pushState=function(...a){r.apply(this,a),o("pushState");};const s=history.replaceState;history.replaceState=function(...a){s.apply(this,a),o("replaceState");},window.addEventListener("popstate",()=>o("popstate")),new MutationObserver(()=>o("mutation")).observe(document.body,{childList:true,subtree:true});}}new ct;

})();