// ==UserScript==
// @name         twitter-mute-filter
// @namespace    twitterMuteFilter
// @version      2.1.0
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

  const S={debug:"debug",info:"info",warn:"warn",error:"error"},x=t=>{const e=`[${t}]`,r={};return Object.keys(S).forEach(d=>{const n=S[d];r[d]=(...i)=>{(console[n]??console.log)(e,...i);};}),r},C=x("twitter-mute-filter"),M="twitter_filter_settings",I={version:1.3,stringKeywords:[],regexKeywords:[],lastImport:null,enabled:true,debugMode:false};let o={...I,...GM_getValue(M,{})};function K(){GM_setValue(M,o),_(),C.info("設定を保存しました: ",o);}function B(t){o={...o,...t},K();}function N(){if(!("enabled"in o)||!("debugMode"in o)){const t=GM_getValue(M,{});o={...I,...t,enabled:Object.prototype.hasOwnProperty.call(t,"enabled")&&typeof t.enabled=="boolean"?t.enabled:true,debugMode:Object.prototype.hasOwnProperty.call(t,"debugMode")&&typeof t.debugMode=="boolean"?t.debugMode:false},K(),C.info("設定を新しいバージョンにマイグレーションしました。");}}const k=x("twitter-mute-filter");let L=[];function _(){L=o.regexKeywords.filter(t=>t.trim()!=="").map(t=>{try{return new RegExp(t)}catch(e){return k.error(`無効な正規表現パターン: ${t}`,e),null}}).filter(t=>t!==null);}function j(t){if(!o.enabled||!t.innerText)return  false;const e=t.innerText;for(const r of o.stringKeywords)if(r&&e.includes(r))return k.info(`ミュート (文字列一致): "${r}"`),true;for(const r of L)if(r.test(e))return k.info(`ミュート (正規表現): "${r.source}"`),true;return  false}function E(t){const e=t.closest('[data-testid="cellInnerDiv"], [data-testid="tweet"], article');e&&!e.dataset.tfMuted&&j(t)&&(e.style.display="none",e.dataset.tfMuted="true");}const $=x("twitter-mute-filter");async function z(){try{if(!window.location.href.includes("/settings/muted_keywords"))return confirm(`Twitterのミュートキーワード設定ページに移動して取得します。よろしいですか？
※現在のページから移動します`)&&(window.location.href="https://twitter.com/settings/muted_keywords"),null;const t=[],e=new Set,r=window.scrollY,d=()=>{let l=0;return document.querySelectorAll("div[role='link'] > div > div[dir='ltr']:first-child > span").forEach(g=>{const s=g.textContent?.trim();!s||e.has(s)||s.length>50||s.match(/^(編集|削除|メニュー|Edit|Delete|Menu|Settings)/i)||(t.push(s),e.add(s),l++,$.info(`キーワード検出: "${s}"`));}),l},i=await(async()=>{let g=0,s=0;for(let w=0;w<50;w++)if(window.scrollBy(0,window.innerHeight*.7),await new Promise(y=>setTimeout(y,800)),d(),t.length===g){if(s++,s>=3)break}else g=t.length,s=0;return window.scrollTo(0,r),t})();return i.length>0?alert(`${i.length}件のミュートキーワードを取得しました。
設定を保存してください。`):alert("ミュートキーワードが見つかりませんでした。画面を更新してもう一度お試しください。"),i}catch(t){return $.error("ミュートキーワードの取得に失敗しました",t),alert("ミュートキーワードの取得に失敗しました。"),null}}const D=(t={})=>{const e=document.createElement("div");t.id&&(e.id=t.id),e.style.position="relative";const r=e.attachShadow({mode:t.mode??"open"});if(t.cssText){const d=document.createElement("style");d.textContent=t.cssText,r.appendChild(d);}return t.adoptStyles?.length&&t.adoptStyles.forEach(d=>{const n=document.createElement("style");n.textContent=d,r.appendChild(n);}),document.body.appendChild(e),{host:e,root:r,dispose:()=>{e.remove();}}};let v=null,p=null;const H=()=>`
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
`;function R(){p?.dispose(),p=null,v=null;const t=D({mode:"closed"});p=t,v=t.host,v.style.cssText="";const{root:e}=t,r=document.createElement("style");r.textContent=H(),e.appendChild(r);const d=document.createElement("div");d.className="tf-modal-overlay";const n=document.documentElement.style.colorScheme==="dark",i=o.enabled?"tf-status-enabled":"tf-status-disabled",l=o.enabled?"機能は有効です":"機能は無効です";d.innerHTML=`
    <div class="tf-modal ${n?"dark-mode":""}">
      <div class="tf-modal-title">Twitter文章完全ミュート 設定 v${o.version}</div>
      <div class="tf-status-indicator ${i}">${l}</div>
      <div class="tf-toggle-section ${n?"dark-mode":""}">
        <div class="tf-toggle-label ${n?"dark-mode":""}">ミュート機能を有効にする</div>
        <div class="tf-toggle-switch ${o.enabled?"active":""}" id="tf-toggle">
          <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${n?"dark-mode":""}">通常ミュートキーワード</div>
        <textarea class="tf-textarea ${n?"dark-mode":""}" id="tf-string-keywords" placeholder="1行に1つのキーワードを入力">${o.stringKeywords.join(`
`)}</textarea>
        <div class="tf-info ${n?"dark-mode":""}">部分一致するツイートをミュートします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${n?"dark-mode":""}">正規表現ミュートキーワード</div>
        <textarea class="tf-textarea" id="tf-regex-keywords" placeholder="1行に1つの正規表現パターンを入力">${o.regexKeywords.join(`
`)}</textarea>
        <div class="tf-info ${n?"dark-mode":""}">例: 「テス(ト)?」は「テス」「テスト」にマッチします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${n?"dark-mode":""}">デバッグモード</div>
        <div class="tf-toggle-switch ${o.debugMode?"active":""}" id="tf-debug-toggle">
            <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-button-row">
        <button class="tf-button tf-cancel-button ${n?"dark-mode":""}" id="tf-cancel">キャンセル</button>
        <button class="tf-button tf-import-button" id="tf-import">公式ミュートを取り込む</button>
        <button class="tf-button tf-save-button" id="tf-save">保存</button>
      </div>
    </div>
  `,e.appendChild(d);const m=e.getElementById("tf-toggle"),g=e.getElementById("tf-debug-toggle"),s=e.querySelector(".tf-status-indicator"),w=(a,f,c)=>{a.addEventListener("click",()=>{const u=a.classList.toggle("active");f&&c&&(f.className=`tf-status-indicator ${u?"tf-status-enabled":"tf-status-disabled"}`,f.textContent=u?c.on:c.off);});};w(m,s,{on:"機能は有効です",off:"機能は無効です"}),w(g);const y=()=>{p&&(p.dispose(),p=null,v=null);};e.getElementById("tf-cancel").addEventListener("click",y),d.addEventListener("click",a=>{a.target===d&&y();}),e.getElementById("tf-import").addEventListener("click",async()=>{const a=await z();if(a){const f=e.getElementById("tf-string-keywords"),c=new Set(f.value.split(`
`).filter(u=>u.trim()!==""));a.forEach(u=>c.add(u)),f.value=Array.from(c).join(`
`);}}),e.getElementById("tf-save").addEventListener("click",()=>{const a=e.getElementById("tf-string-keywords").value.split(`
`).map(b=>b.trim()).filter(b=>b!==""),f=e.getElementById("tf-regex-keywords").value.split(`
`).map(b=>b.trim()).filter(b=>b!==""),c=m.classList.contains("active"),u=g.classList.contains("active");B({stringKeywords:a,regexKeywords:f,enabled:c,debugMode:u,lastImport:o.lastImport}),y();const h=document.createElement("div");h.style.cssText=`
        position: fixed; top: 20px; right: 20px;
        background: #1d9bf0; color: white; padding: 12px 20px;
        border-radius: 8px; z-index: 2147483647; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `,h.textContent=`設定を保存しました。機能は${c?"有効":"無効"}です。`,document.body.appendChild(h),setTimeout(()=>h.remove(),3e3);});}function O(){R();}const A=x("twitter-mute-filter");function G(){if(!o.enabled)return;const t=document.querySelectorAll('[data-testid="tweet"], [id^=id__], article[role="article"]');t.forEach(E),A.info(`${t.length}件のツイートをチェックしました`);}function V(){new MutationObserver(d=>{if(o.enabled){for(const n of d)if(n.type==="childList"&&n.addedNodes.length>0){for(const i of Array.from(n.addedNodes))if(i.nodeType===Node.ELEMENT_NODE){const l=i;l.querySelectorAll('[data-testid="tweet"], [id^=id__]').forEach(E),l.matches('[data-testid="tweet"], [id^=id__]')&&E(l);}}}}).observe(document.body,{childList:true,subtree:true});let e=location.href;new MutationObserver(()=>{location.href!==e&&(e=location.href,A.info("URL変更を検知:",e),e.includes("/settings/muted_keywords")?setTimeout(O,1e3):setTimeout(G,500));}).observe(document.body,{childList:true,subtree:true});}const T=x("twitter-mute-filter");function q(){T.info("Twitter Mute Filterを初期化中..."),N(),_(),GM_registerMenuCommand("ミュート設定",O),V(),o.enabled&&T.info("ミュート機能は有効です。");}window.addEventListener("load",q,false);

})();