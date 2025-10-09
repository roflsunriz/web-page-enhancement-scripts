// ==UserScript==
// @name         twitter-media-filter
// @namespace    twitterMediaFilter
// @version      2.1.0
// @author       roflsunriz
// @description  タイムライン/リスト/詳細ページで画像/動画を含まないツイートを非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-media-filter.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-media-filter.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const h={debug:"debug",info:"info",warn:"warn",error:"error"},c=e=>{const t=`[${e}]`,o={};return Object.keys(h).forEach(n=>{const r=h[n];o[n]=(...s)=>{(console[r]??console.log)(t,...s);};}),o},y=c("twitter-media-filter"),g="tmf_settings",w={enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false,debugMode:false};let i={...w,...GM_getValue(g,{})};function v(){GM_setValue(g,i),y.info("設定を保存しました: ",i);}function x(e){i={...i,...e},v();}const m=c("twitter-media-filter");function S(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}function k(){const e=new MutationObserver(s=>{for(const l of s)if(l.type==="childList"&&l.addedNodes.length>0){setTimeout(d,100);return}}),t=document.querySelector("main");t?(e.observe(t,{childList:true,subtree:true}),m.info("メイン要素の監視を開始しました")):(e.observe(document.body,{childList:true,subtree:true}),m.info("body要素の監視を開始しました（main要素を探しています）"));let o=location.href;const n=new MutationObserver(()=>{location.href!==o&&(o=location.href,m.info(`ページ遷移を検知: ${location.href}`),setTimeout(d,500));}),r=document.querySelector("title");r&&n.observe(r,{subtree:true,childList:true});}const E=c("twitter-media-filter");function M(){switch(S()){case "timeline":return i.enableOnTimeline;case "list":return i.enableOnLists;case "profile":return i.enableOnProfile;case "search":return i.enableOnSearch;case "tweetDetail":return i.enableOnTweetDetail;default:return  false}}function O(e){return ['div[data-testid="tweetPhoto"]','div[data-testid="videoPlayer"]','div[data-testid="card.layoutSmall.media"]','div[data-testid="card.layoutLarge.media"]'].some(o=>e.querySelector(o))}function d(){if(!M())return;E.info("タイムライン処理開始"),document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{t.hasAttribute("data-media-filter-processed")||(O(t)||(t.style.display="none"),t.setAttribute("data-media-filter-processed","true"));});}const T=(e={})=>{const t=document.createElement("div");e.id&&(t.id=e.id),t.style.position="relative";const o=t.attachShadow({mode:e.mode??"open"});if(e.cssText){const n=document.createElement("style");n.textContent=e.cssText,o.appendChild(n);}return e.adoptStyles?.length&&e.adoptStyles.forEach(n=>{const r=document.createElement("style");r.textContent=n,o.appendChild(r);}),document.body.appendChild(t),{host:t,root:o,dispose:()=>{t.remove();}}};let a=null,f=null;const L=()=>`
  :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 2147483647;
  }
  
  .tmf-modal {
      width: 400px;
      background-color: white;
      border-radius: 16px;
      padding: 20px;
      color: #000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  
  .tmf-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
  }
  
  .tmf-modal-title {
      font-size: 20px;
      font-weight: bold;
  }
  
  .tmf-modal-close {
      cursor: pointer;
      font-size: 20px;
  }
  
  .tmf-setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
  }
  
  .tmf-setting-item:last-child {
      border-bottom: none;
  }
  
  .tmf-switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 24px;
  }
  
  .tmf-switch input {
      opacity: 0;
      width: 0;
      height: 0;
  }
  
  .tmf-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
  }
  
  .tmf-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
  }
  
  input:checked + .tmf-slider {
      background-color: #1d9bf0;
  }
  
  input:focus + .tmf-slider {
      box-shadow: 0 0 1px #1d9bf0;
  }
  
  input:checked + .tmf-slider:before {
      transform: translateX(22px);
  }
  
  .tmf-setting-label {
      font-size: 15px;
  }
  
  .tmf-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
  }
  
  .tmf-footer button {
      background-color: #1d9bf0;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
  }
  
  .dark-mode .tmf-modal {
      background-color: #15202b;
      color: white;
  }
  
  .dark-mode .tmf-setting-item {
      border-bottom: 1px solid #38444d;
  }
`;function $(){f?.dispose(),f=null,a=null;const e=T({id:"tmf-shadow-host",mode:"closed"});f=e,a=e.host,a.style.cssText="",a.style.display="none";const{root:t}=e,o=document.createElement("style");o.textContent=L(),t.appendChild(o);const n=document.createElement("div"),r=document.documentElement.style.colorScheme==="dark"||document.body.classList.contains("dark-theme")||window.matchMedia("(prefers-color-scheme: dark)").matches;n.innerHTML=`
      <div class="tmf-modal ${r?"dark-mode":""}">
          <div class="tmf-modal-header"><div class="tmf-modal-title">Twitter Media Filter 設定</div><div class="tmf-modal-close">✕</div></div>
          <div class="tmf-settings-container">
              ${Object.keys(i).map(s=>`
                  <div class="tmf-setting-item">
                      <span class="tmf-setting-label">${s.replace("enableOn","")}</span>
                      <label class="tmf-switch"><input type="checkbox" id="tmf-${s}" ${i[s]?"checked":""}><span class="tmf-slider"></span></label>
                  </div>
              `).join("")}
          </div>
          <div class="tmf-footer"><button id="tmf-save-button">保存</button></div>
      </div>
  `,t.appendChild(n),t.querySelector(".tmf-modal-close")?.addEventListener("click",()=>a.style.display="none"),n.addEventListener("click",s=>{s.target===n&&(a.style.display="none");}),t.querySelector("#tmf-save-button")?.addEventListener("click",()=>{const s=Object.keys(i).reduce((l,u)=>{const p=t.querySelector(`#tmf-${u}`);return p&&(l[u]=p.checked),l},{});x(s),a.style.display="none",d();});}function C(){$(),a&&(a.style.display="flex");}const j=c("twitter-media-filter");function b(){j.info("Twitter Media Filterを初期化中..."),GM_registerMenuCommand("メディアフィルター設定",C),k(),setTimeout(d,1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",b):b();

})();