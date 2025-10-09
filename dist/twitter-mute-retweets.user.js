// ==UserScript==
// @name         twitter-mute-retweets
// @namespace    twitterMuteRetweets
// @version      2.1.0
// @author       roflsunriz
// @description  閲覧中のユーザがつぶやいていないツイート（リツイート）を非表示にする
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-retweets.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-retweets.meta.js
// @match        https://x.com/*
// @exclude      https://x.com/*/status/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  const h={debug:"debug",info:"info",warn:"warn",error:"error"},u=t=>{const e=`[${t}]`,n={};return Object.keys(h).forEach(o=>{const c=h[o];n[o]=(...l)=>{(console[c]??console.log)(e,...l);};}),n},C=u("twitter-mute-retweets"),v="tmf_retweet_settings",L={enabled:true,checkInterval:300};let r={...L,...GM_getValue(v,{})};function T(){GM_setValue(v,r),C.info("設定を保存しました:",r);}function B(t){r={...r,...t},T();}const R=u("twitter-mute-retweets");function $(t){let e=t;for(;e&&e.tagName!=="ARTICLE";)e=e.parentElement;return e}function y(){if(!r.enabled)return;const t=document.querySelectorAll(".r-15zivkp");R.debug(`${t.length}個のリツイートインジケータが見つかりました。`),t.forEach(e=>{const n=$(e);n&&!n.dataset.hidden&&(n.style.display="none",n.dataset.hidden="true");});}const f=u("twitter-mute-retweets");let a=null,m=location.href;function k(t,e){let n;return function(...c){const l=()=>{clearTimeout(n),t(...c);};clearTimeout(n),n=window.setTimeout(l,e);}}let d=k(y,r.checkInterval);function z(t){if(r.enabled){for(const e of t)if(e.type==="childList"&&e.addedNodes.length>0){d();return}}}function x(){if(a)return;const t=document.querySelector('main[role="main"]');if(!t){setTimeout(x,1e3);return}a=new MutationObserver(z),a.observe(t,{childList:true,subtree:true}),f.info("タイムラインの監視を開始しました。"),d();}function _(){a&&(a.disconnect(),a=null,f.info("タイムラインの監視を停止しました。"));}function N(){d=k(y,r.checkInterval);}setInterval(()=>{m!==location.href&&(m=location.href,f.info("URLの変更を検知:",m),r.enabled&&setTimeout(d,500));},1e3);const O=(t={})=>{const e=document.createElement("div");t.id&&(e.id=t.id),e.style.position="relative";const n=e.attachShadow({mode:t.mode??"open"});if(t.cssText){const o=document.createElement("style");o.textContent=t.cssText,n.appendChild(o);}return t.adoptStyles?.length&&t.adoptStyles.forEach(o=>{const c=document.createElement("style");c.textContent=o,n.appendChild(c);}),document.body.appendChild(e),{host:e,root:n,dispose:()=>{e.remove();}}};let i=null;const A=()=>`
  .modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5); z-index: 2147483646;
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background-color: #fff; border: 1px solid #ccc; border-radius: 8px;
    padding: 20px; width: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px; line-height: 1.4;
  }
  .modal.dark {
    background-color: #15202b; color: #fff; border: 1px solid #38444d;
  }
  .modal h2 {
    margin: 0 0 15px 0; font-size: 18px; font-weight: bold;
  }
  .setting-item { margin-bottom: 15px; }
  .setting-item label { display: flex; align-items: center; cursor: pointer; }
  .setting-item input[type="checkbox"] { margin-right: 8px; }
  .interval-setting { margin-top: 15px; margin-bottom: 15px; }
  .interval-setting label { display: block; margin-bottom: 5px; }
  .interval-setting input[type="number"] {
    width: 80px; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;
  }
  .modal.dark .interval-setting input[type="number"] {
    background-color: #192734; border-color: #38444d; color: #fff;
  }
  .button-group { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
  .button {
    padding: 8px 16px; border: none; border-radius: 999px; cursor: pointer;
    font-size: 14px; font-weight: 500; transition: background-color 0.2s;
  }
  .button-primary { background-color: #1d9bf0; color: white; }
  .button-primary:hover { background-color: #1a8cd8; }
  .button-secondary { background-color: #e0e0e0; color: #000; }
  .button-secondary:hover { background-color: #d0d0d0; }
  .modal.dark .button-secondary { background-color: #38444d; color: #fff; }
  .modal.dark .button-secondary:hover { background-color: #5c6e7e; }
`;function G(){i?.dispose(),i=null;const t=O({id:"retweet-settings-modal-host",mode:"closed"});i=t;const{root:e}=t,n=document.createElement("style");n.textContent=A(),e.appendChild(n);const o=document.createElement("div");o.className="modal-backdrop";const c=document.createElement("div");c.className="modal",(document.body.style.backgroundColor==="rgb(21, 32, 43)"||window.matchMedia("(prefers-color-scheme: dark)").matches)&&c.classList.add("dark"),c.innerHTML=`
    <h2>リツイート非表示の設定</h2>
    <div class="setting-item">
      <label>
        <input type="checkbox" id="retweet-hide-enabled" ${r.enabled?"checked":""}>
        リツイート非表示を有効にする
      </label>
    </div>
    <div class="interval-setting">
      <label for="retweet-check-interval">更新間隔 (ミリ秒):</label>
      <input type="number" id="retweet-check-interval" min="100" max="1000" step="100" value="${r.checkInterval}">
    </div>
    <div class="button-group">
      <button class="button button-secondary" id="cancel-button">キャンセル</button>
      <button class="button button-primary" id="save-button">保存</button>
    </div>
  `,o.appendChild(c),e.appendChild(o);const g=e.getElementById("retweet-hide-enabled"),E=e.getElementById("retweet-check-interval"),I=e.getElementById("save-button"),S=e.getElementById("cancel-button"),b=()=>{i&&(i.dispose(),i=null);};I.addEventListener("click",()=>{const s={enabled:g.checked,checkInterval:parseInt(E.value,10)||r.checkInterval},M=r.enabled;B(s),M!==s.enabled&&w(),N(),b();}),S.addEventListener("click",b),o.addEventListener("click",s=>{s.target===o&&b();});}const p=u("twitter-mute-retweets");function w(){r.enabled?(p.info("リツイート非表示機能が有効です。監視を開始します。"),x()):(p.info("リツイート非表示機能が無効です。監視を停止します。"),_());}function j(){p.info("スクリプトを初期化中..."),GM_registerMenuCommand("リツイート非表示の設定",G),w(),setTimeout(d,1e3);}j();

})();