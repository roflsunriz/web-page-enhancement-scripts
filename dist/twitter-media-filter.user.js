// ==UserScript==
// @name         twitter-media-filter
// @namespace    twitterMediaFilter
// @version      2.2.0
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

  const b={debug:"debug",info:"info",warn:"warn",error:"error"},m=e=>{const t=`[${e}]`,n={};return Object.keys(b).forEach(o=>{const r=b[o];n[o]=(...s)=>{(console[r]??console.log)(t,...s);};}),n},w=m("twitter-media-filter"),y="tmf_settings",v={enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false,debugMode:false};let i={...v,...GM_getValue(y,{})};function x(){GM_setValue(y,i),w.info("設定を保存しました: ",i);}function S(e){i={...i,...e},x();}const f=m("twitter-media-filter");function T(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}function E(){const e=new MutationObserver(s=>{for(const l of s)if(l.type==="childList"&&l.addedNodes.length>0){setTimeout(c,100);return}}),t=document.querySelector("main");t?(e.observe(t,{childList:true,subtree:true}),f.info("メイン要素の監視を開始しました")):(e.observe(document.body,{childList:true,subtree:true}),f.info("body要素の監視を開始しました（main要素を探しています）"));let n=location.href;const o=new MutationObserver(()=>{location.href!==n&&(n=location.href,f.info(`ページ遷移を検知: ${location.href}`),setTimeout(c,500));}),r=document.querySelector("title");r&&o.observe(r,{subtree:true,childList:true});}const d={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]'},k=[d.tweetPhoto,d.tweetVideo,d.mediaCardSmall,d.mediaCardLarge],O=m("twitter-media-filter");function M(){switch(T()){case "timeline":return i.enableOnTimeline;case "list":return i.enableOnLists;case "profile":return i.enableOnProfile;case "search":return i.enableOnSearch;case "tweetDetail":return i.enableOnTweetDetail;default:return  false}}function L(e){return k.some(t=>e.querySelector(t))}function c(){if(!M())return;O.info("タイムライン処理開始"),document.querySelectorAll(d.article).forEach(t=>{t.hasAttribute("data-media-filter-processed")||(L(t)||(t.style.display="none"),t.setAttribute("data-media-filter-processed","true"));});}const C=(e={})=>{const t=document.createElement("div");e.id&&(t.id=e.id),t.style.position="relative";const n=t.attachShadow({mode:e.mode??"open"});if(e.cssText){const o=document.createElement("style");o.textContent=e.cssText,n.appendChild(o);}return e.adoptStyles?.length&&e.adoptStyles.forEach(o=>{const r=document.createElement("style");r.textContent=o,n.appendChild(r);}),document.body.appendChild(t),{host:t,root:n,dispose:()=>{t.remove();}}};let a=null,u=null;const $=()=>`
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
`;function _(){u?.dispose(),u=null,a=null;const e=C({id:"tmf-shadow-host",mode:"closed"});u=e,a=e.host,a.style.cssText="",a.style.display="none";const{root:t}=e,n=document.createElement("style");n.textContent=$(),t.appendChild(n);const o=document.createElement("div"),r=document.documentElement.style.colorScheme==="dark"||document.body.classList.contains("dark-theme")||window.matchMedia("(prefers-color-scheme: dark)").matches;o.innerHTML=`
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
  `,t.appendChild(o),t.querySelector(".tmf-modal-close")?.addEventListener("click",()=>a.style.display="none"),o.addEventListener("click",s=>{s.target===o&&(a.style.display="none");}),t.querySelector("#tmf-save-button")?.addEventListener("click",()=>{const s=Object.keys(i).reduce((l,h)=>{const p=t.querySelector(`#tmf-${h}`);return p&&(l[h]=p.checked),l},{});S(s),a.style.display="none",c();});}function j(){_(),a&&(a.style.display="flex");}const D=m("twitter-media-filter");function g(){D.info("Twitter Media Filterを初期化中..."),GM_registerMenuCommand("メディアフィルター設定",j),E(),setTimeout(c,1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g();

})();