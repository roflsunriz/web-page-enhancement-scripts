// ==UserScript==
// @name         twitter-mute-filter
// @namespace    twitterMuteFilter
// @version      2.2.0
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

  const T={debug:"debug",info:"info",warn:"warn",error:"error"},h=t=>{const e=`[${t}]`,n={};return Object.keys(T).forEach(r=>{const d=T[r];n[r]=(...i)=>{(console[d]??console.log)(e,...i);};}),n},L=h("twitter-mute-filter"),M="twitter_filter_settings",I={version:1.3,stringKeywords:[],regexKeywords:[],lastImport:null,enabled:true,debugMode:false};let o={...I,...GM_getValue(M,{})};function K(){GM_setValue(M,o),A(),L.info("設定を保存しました: ",o);}function B(t){o={...o,...t},K();}function z(){if(!("enabled"in o)||!("debugMode"in o)){const t=GM_getValue(M,{});o={...I,...t,enabled:Object.prototype.hasOwnProperty.call(t,"enabled")&&typeof t.enabled=="boolean"?t.enabled:true,debugMode:Object.prototype.hasOwnProperty.call(t,"debugMode")&&typeof t.debugMode=="boolean"?t.debugMode:false},K(),L.info("設定を新しいバージョンにマイグレーションしました。");}}const v={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},E=h("twitter-mute-filter");let O=[];function A(){O=o.regexKeywords.filter(t=>t.trim()!=="").map(t=>{try{return new RegExp(t)}catch(e){return E.error(`無効な正規表現パターン: ${t}`,e),null}}).filter(t=>t!==null);}function j(t){if(!o.enabled||!t.innerText)return  false;const e=t.innerText;for(const n of o.stringKeywords)if(n&&e.includes(n))return E.info(`ミュート (文字列一致): "${n}"`),true;for(const n of O)if(n.test(e))return E.info(`ミュート (正規表現): "${n.source}"`),true;return  false}function S(t){const e=t.closest(v.tweetContainerCandidates);e&&!e.dataset.tfMuted&&j(t)&&(e.style.display="none",e.dataset.tfMuted="true");}const C=h("twitter-mute-filter");async function R(){try{if(!window.location.href.includes("/settings/muted_keywords"))return confirm(`Twitterのミュートキーワード設定ページに移動して取得します。よろしいですか？
※現在のページから移動します`)&&(window.location.href="https://twitter.com/settings/muted_keywords"),null;const t=[],e=new Set,n=window.scrollY,r=()=>{let a=0;return document.querySelectorAll(v.muteKeywordSpan).forEach(g=>{const s=g.textContent?.trim();!s||e.has(s)||s.length>50||s.match(/^(編集|削除|メニュー|Edit|Delete|Menu|Settings)/i)||(t.push(s),e.add(s),a++,C.info(`キーワード検出: "${s}"`));}),a},i=await(async()=>{let g=0,s=0;for(let w=0;w<50;w++)if(window.scrollBy(0,window.innerHeight*.7),await new Promise(y=>setTimeout(y,800)),r(),t.length===g){if(s++,s>=3)break}else g=t.length,s=0;return window.scrollTo(0,n),t})();return i.length>0?alert(`${i.length}件のミュートキーワードを取得しました。
設定を保存してください。`):alert("ミュートキーワードが見つかりませんでした。画面を更新してもう一度お試しください。"),i}catch(t){return C.error("ミュートキーワードの取得に失敗しました",t),alert("ミュートキーワードの取得に失敗しました。"),null}}const q=(t={})=>{const e=document.createElement("div");t.id&&(e.id=t.id),e.style.position="relative";const n=e.attachShadow({mode:t.mode??"open"});if(t.cssText){const r=document.createElement("style");r.textContent=t.cssText,n.appendChild(r);}return t.adoptStyles?.length&&t.adoptStyles.forEach(r=>{const d=document.createElement("style");d.textContent=r,n.appendChild(d);}),document.body.appendChild(e),{host:e,root:n,dispose:()=>{e.remove();}}};let k=null,b=null;const D=()=>`
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
`;function H(){b?.dispose(),b=null,k=null;const t=q({mode:"closed"});b=t,k=t.host,k.style.cssText="";const{root:e}=t,n=document.createElement("style");n.textContent=D(),e.appendChild(n);const r=document.createElement("div");r.className="tf-modal-overlay";const d=document.documentElement.style.colorScheme==="dark",i=o.enabled?"tf-status-enabled":"tf-status-disabled",a=o.enabled?"機能は有効です":"機能は無効です";r.innerHTML=`
    <div class="tf-modal ${d?"dark-mode":""}">
      <div class="tf-modal-title">Twitter文章完全ミュート 設定 v${o.version}</div>
      <div class="tf-status-indicator ${i}">${a}</div>
      <div class="tf-toggle-section ${d?"dark-mode":""}">
        <div class="tf-toggle-label ${d?"dark-mode":""}">ミュート機能を有効にする</div>
        <div class="tf-toggle-switch ${o.enabled?"active":""}" id="tf-toggle">
          <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${d?"dark-mode":""}">通常ミュートキーワード</div>
        <textarea class="tf-textarea ${d?"dark-mode":""}" id="tf-string-keywords" placeholder="1行に1つのキーワードを入力">${o.stringKeywords.join(`
`)}</textarea>
        <div class="tf-info ${d?"dark-mode":""}">部分一致するツイートをミュートします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${d?"dark-mode":""}">正規表現ミュートキーワード</div>
        <textarea class="tf-textarea" id="tf-regex-keywords" placeholder="1行に1つの正規表現パターンを入力">${o.regexKeywords.join(`
`)}</textarea>
        <div class="tf-info ${d?"dark-mode":""}">例: 「テス(ト)?」は「テス」「テスト」にマッチします</div>
      </div>
      <div class="tf-modal-section">
        <div class="tf-keyword-type ${d?"dark-mode":""}">デバッグモード</div>
        <div class="tf-toggle-switch ${o.debugMode?"active":""}" id="tf-debug-toggle">
            <div class="tf-toggle-slider"></div>
        </div>
      </div>
      <div class="tf-button-row">
        <button class="tf-button tf-cancel-button ${d?"dark-mode":""}" id="tf-cancel">キャンセル</button>
        <button class="tf-button tf-import-button" id="tf-import">公式ミュートを取り込む</button>
        <button class="tf-button tf-save-button" id="tf-save">保存</button>
      </div>
    </div>
  `,e.appendChild(r);const p=e.getElementById("tf-toggle"),g=e.getElementById("tf-debug-toggle"),s=e.querySelector(".tf-status-indicator"),w=(l,f,c)=>{l.addEventListener("click",()=>{const u=l.classList.toggle("active");f&&c&&(f.className=`tf-status-indicator ${u?"tf-status-enabled":"tf-status-disabled"}`,f.textContent=u?c.on:c.off);});};w(p,s,{on:"機能は有効です",off:"機能は無効です"}),w(g);const y=()=>{b&&(b.dispose(),b=null,k=null);};e.getElementById("tf-cancel").addEventListener("click",y),r.addEventListener("click",l=>{l.target===r&&y();}),e.getElementById("tf-import").addEventListener("click",async()=>{const l=await R();if(l){const f=e.getElementById("tf-string-keywords"),c=new Set(f.value.split(`
`).filter(u=>u.trim()!==""));l.forEach(u=>c.add(u)),f.value=Array.from(c).join(`
`);}}),e.getElementById("tf-save").addEventListener("click",()=>{const l=e.getElementById("tf-string-keywords").value.split(`
`).map(m=>m.trim()).filter(m=>m!==""),f=e.getElementById("tf-regex-keywords").value.split(`
`).map(m=>m.trim()).filter(m=>m!==""),c=p.classList.contains("active"),u=g.classList.contains("active");B({stringKeywords:l,regexKeywords:f,enabled:c,debugMode:u,lastImport:o.lastImport}),y();const x=document.createElement("div");x.style.cssText=`
        position: fixed; top: 20px; right: 20px;
        background: #1d9bf0; color: white; padding: 12px 20px;
        border-radius: 8px; z-index: 2147483647; font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `,x.textContent=`設定を保存しました。機能は${c?"有効":"無効"}です。`,document.body.appendChild(x),setTimeout(()=>x.remove(),3e3);});}function _(){H();}const N=h("twitter-mute-filter");function P(){if(!o.enabled)return;const t=document.querySelectorAll(v.tweetObserverTargets);t.forEach(S),N.info(`${t.length}件のツイートをチェックしました`);}function G(){new MutationObserver(r=>{if(o.enabled){for(const d of r)if(d.type==="childList"&&d.addedNodes.length>0){for(const i of Array.from(d.addedNodes))if(i.nodeType===Node.ELEMENT_NODE){const a=i;a.querySelectorAll(v.tweetCandidates).forEach(S),a.matches(v.tweetCandidates)&&S(a);}}}}).observe(document.body,{childList:true,subtree:true});let e=location.href;new MutationObserver(()=>{location.href!==e&&(e=location.href,N.info("URL変更を検知:",e),e.includes("/settings/muted_keywords")?setTimeout(_,1e3):setTimeout(P,500));}).observe(document.body,{childList:true,subtree:true});}const $=h("twitter-mute-filter");function U(){$.info("Twitter Mute Filterを初期化中..."),z(),A(),GM_registerMenuCommand("ミュート設定",_),G(),o.enabled&&$.info("ミュート機能は有効です。");}window.addEventListener("load",U,false);

})();