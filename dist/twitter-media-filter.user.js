// ==UserScript==
// @name         Twitter/X Media Filter
// @namespace    twitterMediaFilter
// @version      2.0.0
// @author       roflsunriz
// @description  タイムライン/リスト/詳細ページで画像/動画を含まないツイートを非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/b681199a5da925299a474366e73c793e/raw/twitter_media_filter.user.js
// @updateURL    https://gist.githubusercontent.com/roflsunriz/b681199a5da925299a474366e73c793e/raw/twitter_media_filter.user.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const u={debug:"debug",info:"info",warn:"warn",error:"error"},c=e=>{const t=`[${e}]`,o={};return Object.keys(u).forEach(r=>{const i=u[r];o[r]=(...a)=>{(console[i]??console.log)(t,...a);};}),o},h=c("twitter-media-filter"),b="tmf_settings",g={enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false,debugMode:false};let n={...g,...GM_getValue(b,{})};function y(){GM_setValue(b,n),h.info("設定を保存しました: ",n);}function w(e){n={...n,...e},y();}const f=c("twitter-media-filter");function v(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}function x(){const e=new MutationObserver(a=>{for(const l of a)if(l.type==="childList"&&l.addedNodes.length>0){setTimeout(d,100);return}}),t=document.querySelector("main");t?(e.observe(t,{childList:true,subtree:true}),f.info("メイン要素の監視を開始しました")):(e.observe(document.body,{childList:true,subtree:true}),f.info("body要素の監視を開始しました（main要素を探しています）"));let o=location.href;const r=new MutationObserver(()=>{location.href!==o&&(o=location.href,f.info(`ページ遷移を検知: ${location.href}`),setTimeout(d,500));}),i=document.querySelector("title");i&&r.observe(i,{subtree:true,childList:true});}const S=c("twitter-media-filter");function k(){switch(v()){case "timeline":return n.enableOnTimeline;case "list":return n.enableOnLists;case "profile":return n.enableOnProfile;case "search":return n.enableOnSearch;case "tweetDetail":return n.enableOnTweetDetail;default:return  false}}function M(e){return ['div[data-testid="tweetPhoto"]','div[data-testid="videoPlayer"]','div[data-testid="card.layoutSmall.media"]','div[data-testid="card.layoutLarge.media"]'].some(o=>e.querySelector(o))}function d(){if(!k())return;S.info("タイムライン処理開始"),document.querySelectorAll('article[data-testid="tweet"]').forEach(t=>{t.hasAttribute("data-media-filter-processed")||(M(t)||(t.style.display="none"),t.setAttribute("data-media-filter-processed","true"));});}let s=null;const O=()=>`
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
`;function T(){s&&s.remove(),s=document.createElement("div"),s.id="tmf-shadow-host";const e=s.attachShadow({mode:"closed"}),t=document.createElement("style");t.textContent=O(),e.appendChild(t);const o=document.createElement("div"),r=document.documentElement.style.colorScheme==="dark"||document.body.classList.contains("dark-theme")||window.matchMedia("(prefers-color-scheme: dark)").matches;o.innerHTML=`
      <div class="tmf-modal ${r?"dark-mode":""}">
          <div class="tmf-modal-header"><div class="tmf-modal-title">Twitter Media Filter 設定</div><div class="tmf-modal-close">✕</div></div>
          <div class="tmf-settings-container">
              ${Object.keys(n).map(i=>`
                  <div class="tmf-setting-item">
                      <span class="tmf-setting-label">${i.replace("enableOn","")}</span>
                      <label class="tmf-switch"><input type="checkbox" id="tmf-${i}" ${n[i]?"checked":""}><span class="tmf-slider"></span></label>
                  </div>
              `).join("")}
          </div>
          <div class="tmf-footer"><button id="tmf-save-button">保存</button></div>
      </div>
  `,e.appendChild(o),document.body.appendChild(s),e.querySelector(".tmf-modal-close")?.addEventListener("click",()=>s.style.display="none"),o.addEventListener("click",i=>{i.target===o&&(s.style.display="none");}),e.querySelector("#tmf-save-button")?.addEventListener("click",()=>{const i=Object.keys(n).reduce((a,l)=>{const m=e.querySelector(`#tmf-${l}`);return m&&(a[l]=m.checked),a},{});w(i),s.style.display="none",d();});}function L(){T(),s&&(s.style.display="flex");}const E=c("twitter-media-filter");function p(){E.info("Twitter Media Filterを初期化中..."),GM_registerMenuCommand("メディアフィルター設定",L),x(),setTimeout(d,1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();

})();