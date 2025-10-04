// ==UserScript==
// @name         twitter-mute-filter
// @namespace    twitterMuteFilter
// @version      2.0.1
// @author       roflsunriz
// @description  正規表現対応の強力なミュートフィルターをTwitter/Xに追加します。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-filter.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-filter.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const M={debug:"debug",info:"info",warn:"warn",error:"error"},x=t=>{const e=`[${t}]`,n={};return Object.keys(M).forEach(r=>{const c=M[r];n[r]=(...a)=>{(console[c]??console.log)(e,...a);};}),n},S=x("twitter-mute-filter"),k="twitter_filter_settings",T={version:1.3,stringKeywords:[],regexKeywords:[],lastImport:null,enabled:true,debugMode:false};let o={...T,...GM_getValue(k,{})};function C(){GM_setValue(k,o),K(),S.info("設定を保存しました: ",o);}function O(t){o={...o,...t},C();}function A(){if(!("enabled"in o)||!("debugMode"in o)){const t=GM_getValue(k,{});o={...T,...t,enabled:Object.prototype.hasOwnProperty.call(t,"enabled")&&typeof t.enabled=="boolean"?t.enabled:true,debugMode:Object.prototype.hasOwnProperty.call(t,"debugMode")&&typeof t.debugMode=="boolean"?t.debugMode:false},C(),S.info("設定を新しいバージョンにマイグレーションしました。");}}const v=x("twitter-mute-filter");let I=[];function K(){I=o.regexKeywords.filter(t=>t.trim()!=="").map(t=>{try{return new RegExp(t)}catch(e){return v.error(`無効な正規表現パターン: ${t}`,e),null}}).filter(t=>t!==null);}function B(t){if(!o.enabled||!t.innerText)return  false;const e=t.innerText;for(const n of o.stringKeywords)if(n&&e.includes(n))return v.info(`ミュート (文字列一致): "${n}"`),true;for(const n of I)if(n.test(e))return v.info(`ミュート (正規表現): "${n.source}"`),true;return  false}function h(t){const e=t.closest('[data-testid="cellInnerDiv"], [data-testid="tweet"], article');e&&!e.dataset.tfMuted&&B(t)&&(e.style.display="none",e.dataset.tfMuted="true");}const E=x("twitter-mute-filter");async function N(){try{if(!window.location.href.includes("/settings/muted_keywords"))return confirm(`Twitterのミュートキーワード設定ページに移動して取得します。よろしいですか？
※現在のページから移動します`)&&(window.location.href="https://twitter.com/settings/muted_keywords"),null;const t=[],e=new Set,n=window.scrollY,r=()=>{let s=0;return document.querySelectorAll("div[role='link'] > div > div[dir='ltr']:first-child > span").forEach(p=>{const d=p.textContent?.trim();!d||e.has(d)||d.length>50||d.match(/^(編集|削除|メニュー|Edit|Delete|Menu|Settings)/i)||(t.push(d),e.add(d),s++,E.info(`キーワード検出: "${d}"`));}),s},a=await(async()=>{let p=0,d=0;for(let m=0;m<50;m++)if(window.scrollBy(0,window.innerHeight*.7),await new Promise(i=>setTimeout(i,800)),r(),t.length===p){if(d++,d>=3)break}else p=t.length,d=0;return window.scrollTo(0,n),t})();return a.length>0?alert(`${a.length}件のミュートキーワードを取得しました。
設定を保存してください。`):alert("ミュートキーワードが見つかりませんでした。画面を更新してもう一度お試しください。"),a}catch(t){return E.error("ミュートキーワードの取得に失敗しました",t),alert("ミュートキーワードの取得に失敗しました。"),null}}let g=null;const j=()=>`
  .tf-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex; justify-content: center; align-items: center;
      z-index: 2147483647; pointer-events: all;
  }
  .tf-modal {
      background: white; color: black; border-radius: 16px;
      padding: 20px; width: 80%; max-width: 600px; max-height: 80vh;
      overflow-y: auto; display: flex; flex-direction: column;
      gap: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .tf-modal-title { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; color: #1d9bf0; }
  .tf-modal-section { display: flex; flex-direction: column; gap: 10px; }
  .tf-toggle-section {
      display: flex; align-items: center; justify-content: space-between;
      padding: 15px; background: #f7f9fa; border-radius: 12px; margin-bottom: 15px;
  }
  .tf-toggle-label { font-weight: bold; font-size: 1.1em; color: #14171a; }
  .tf-toggle-switch {
      position: relative; width: 60px; height: 30px; background: #ccd6dd;
      border-radius: 15px; cursor: pointer; transition: background 0.3s;
  }
  .tf-toggle-switch.active { background: #1d9bf0; }
  .tf-toggle-slider {
      position: absolute; top: 3px; left: 3px; width: 24px; height: 24px;
      background: white; border-radius: 50%; transition: transform 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .tf-toggle-switch.active .tf-toggle-slider { transform: translateX(30px); }
  .tf-textarea {
      width: 90%; height: 150px; padding: 12px; border: 2px solid #e1e8ed;
      border-radius: 8px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 14px; color: #14171a; background: #ffffff; resize: vertical;
      transition: border-color 0.3s;
  }
  .tf-textarea:focus { outline: none; border-color: #1d9bf0; }
  .tf-button-row { display: flex; justify-content: space-between; margin-top: 15px; gap: 10px; }
  .tf-button {
      padding: 12px 20px; border: none; border-radius: 20px; cursor: pointer;
      font-weight: bold; font-size: 14px; transition: all 0.3s; flex: 1;
  }
  .tf-save-button { background: #1d9bf0; color: white; }
  .tf-save-button:hover { background: #1a8cd8; }
  .tf-cancel-button { background: #e0e0e0; color: #14171a; }
  .tf-cancel-button:hover { background: #d0d0d0; }
  .tf-import-button { background: #17bf63; color: white; }
  .tf-import-button:hover { background: #14a85f; }
  .tf-info {
      font-size: 0.9em; color: #657786; background: #f7f9fa;
      padding: 8px 12px; border-radius: 8px; border-left: 4px solid #1d9bf0;
  }
  .tf-keyword-type { font-weight: bold; margin-bottom: 5px; color: #14171a; }
  .tf-status-indicator {
      font-size: 0.9em; padding: 8px 12px; border-radius: 8px;
      text-align: center; font-weight: bold;
  }
  .tf-status-enabled { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .tf-status-disabled { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .tf-modal.dark-mode { background: #15202b; color: #f7f9f9; }
  .tf-toggle-section.dark-mode { background: #192734; }
  .tf-toggle-label.dark-mode { color: #f7f9f9; }
  .tf-textarea.dark-mode { background: #192734; color: #f7f9f9; border-color: #38444d; }
  .tf-textarea.dark-mode:focus { border-color: #1d9bf0; }
  .tf-info.dark-mode { background: #192734; color: #8899a6; }
  .tf-keyword-type.dark-mode { color: #f7f9f9; }
  .tf-cancel-button.dark-mode { background: #38444d; color: #f7f9f9; }
  .tf-cancel-button.dark-mode:hover { background: #5c6e7e; }
`;function z(){g&&g.remove(),g=document.createElement("div");const t=g.attachShadow({mode:"closed"}),e=document.createElement("style");e.textContent=j(),t.appendChild(e);const n=document.createElement("div");n.className="tf-modal-overlay";const r=document.documentElement.style.colorScheme==="dark",c=o.enabled?"tf-status-enabled":"tf-status-disabled",a=o.enabled?"機能は有効です":"機能は無効です";n.innerHTML=`
    <div class="tf-modal ${r?"dark-mode":""}">
      <div class="tf-modal-title">Twitter文章完全ミュート 設定 v${o.version}</div>
      <div class="tf-status-indicator ${c}">${a}</div>
      <div class="tf-toggle-section ${r?"dark-mode":""}">
        <div class="tf-toggle-label ${r?"dark-mode":""}">ミュート機能を有効にする</div>
        <div class="tf-toggle-switch ${o.enabled?"active":""}" id="tf-toggle">
          <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${r?"dark-mode":""}">通常ミュートキーワード</div>
        <textarea class="tf-textarea ${r?"dark-mode":""}" id="tf-string-keywords" placeholder="1行に1つのキーワードを入力">${o.stringKeywords.join(`
`)}</textarea>
        <div class="tf-info ${r?"dark-mode":""}">部分一致するツイートをミュートします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${r?"dark-mode":""}">正規表現ミュートキーワード</div>
        <textarea class="tf-textarea" id="tf-regex-keywords" placeholder="1行に1つの正規表現パターンを入力">${o.regexKeywords.join(`
`)}</textarea>
        <div class="tf-info ${r?"dark-mode":""}">例: 「テス(ト)?」は「テス」「テスト」にマッチします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${r?"dark-mode":""}">デバッグモード</div>
        <div class="tf-toggle-switch ${o.debugMode?"active":""}" id="tf-debug-toggle">
            <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-button-row">
        <button class="tf-button tf-cancel-button ${r?"dark-mode":""}" id="tf-cancel">キャンセル</button>
        <button class="tf-button tf-import-button" id="tf-import">公式ミュートを取り込む</button>
        <button class="tf-button tf-save-button" id="tf-save">保存</button>
      </div>
    </div>
  `,t.appendChild(n),document.body.appendChild(g);const s=t.getElementById("tf-toggle"),w=t.getElementById("tf-debug-toggle"),p=t.querySelector(".tf-status-indicator"),d=(i,f,l)=>{i.addEventListener("click",()=>{const u=i.classList.toggle("active");f&&l&&(f.className=`tf-status-indicator ${u?"tf-status-enabled":"tf-status-disabled"}`,f.textContent=u?l.on:l.off);});};d(s,p,{on:"機能は有効です",off:"機能は無効です"}),d(w);const m=()=>{g&&(g.remove(),g=null);};t.getElementById("tf-cancel").addEventListener("click",m),n.addEventListener("click",i=>{i.target===n&&m();}),t.getElementById("tf-import").addEventListener("click",async()=>{const i=await N();if(i){const f=t.getElementById("tf-string-keywords"),l=new Set(f.value.split(`
`).filter(u=>u.trim()!==""));i.forEach(u=>l.add(u)),f.value=Array.from(l).join(`
`);}}),t.getElementById("tf-save").addEventListener("click",()=>{const i=t.getElementById("tf-string-keywords").value.split(`
`).map(b=>b.trim()).filter(b=>b!==""),f=t.getElementById("tf-regex-keywords").value.split(`
`).map(b=>b.trim()).filter(b=>b!==""),l=s.classList.contains("active"),u=w.classList.contains("active");O({stringKeywords:i,regexKeywords:f,enabled:l,debugMode:u,lastImport:o.lastImport}),m();const y=document.createElement("div");y.style.cssText=`
        position: fixed; top: 20px; right: 20px;
        background: #1d9bf0; color: white; padding: 12px 20px;
        border-radius: 8px; z-index: 2147483647; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `,y.textContent=`設定を保存しました。機能は${l?"有効":"無効"}です。`,document.body.appendChild(y),setTimeout(()=>y.remove(),3e3);});}function L(){z();}const _=x("twitter-mute-filter");function D(){if(!o.enabled)return;const t=document.querySelectorAll('[data-testid="tweet"], [id^=id__], article[role="article"]');t.forEach(h),_.info(`${t.length}件のツイートをチェックしました`);}function R(){new MutationObserver(r=>{if(o.enabled){for(const c of r)if(c.type==="childList"&&c.addedNodes.length>0){for(const a of Array.from(c.addedNodes))if(a.nodeType===Node.ELEMENT_NODE){const s=a;s.querySelectorAll('[data-testid="tweet"], [id^=id__]').forEach(h),s.matches('[data-testid="tweet"], [id^=id__]')&&h(s);}}}}).observe(document.body,{childList:true,subtree:true});let e=location.href;new MutationObserver(()=>{location.href!==e&&(e=location.href,_.info("URL変更を検知:",e),e.includes("/settings/muted_keywords")?setTimeout(L,1e3):setTimeout(D,500));}).observe(document.body,{childList:true,subtree:true});}const $=x("twitter-mute-filter");function G(){$.info("Twitter Mute Filterを初期化中..."),A(),K(),GM_registerMenuCommand("ミュート設定",L),R(),o.enabled&&$.info("ミュート機能は有効です。");}window.addEventListener("load",G,false);

})();