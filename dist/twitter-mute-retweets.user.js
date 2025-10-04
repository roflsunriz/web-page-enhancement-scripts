// ==UserScript==
// @name         Twitter/X Mute Retweets
// @namespace    twitterMuteRetweets
// @version      2.0.0
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

  const h={debug:"debug",info:"info",warn:"warn",error:"error"},u=e=>{const t=`[${e}]`,o={};return Object.keys(h).forEach(i=>{const l=h[i];o[i]=(...a)=>{(console[l]??console.log)(t,...a);};}),o},S=u("twitter-mute-retweets"),v="tmf_retweet_settings",L={enabled:true,checkInterval:300};let n={...L,...GM_getValue(v,{})};function C(){GM_setValue(v,n),S.info("設定を保存しました:",n);}function T(e){n={...n,...e},C();}const B=u("twitter-mute-retweets");function R(e){let t=e;for(;t&&t.tagName!=="ARTICLE";)t=t.parentElement;return t}function k(){if(!n.enabled)return;const e=document.querySelectorAll(".r-15zivkp");B.debug(`${e.length}個のリツイートインジケータが見つかりました。`),e.forEach(t=>{const o=R(t);o&&!o.dataset.hidden&&(o.style.display="none",o.dataset.hidden="true");});}const f=u("twitter-mute-retweets");let c=null,m=location.href;function x(e,t){let o;return function(...l){const a=()=>{clearTimeout(o),e(...l);};clearTimeout(o),o=window.setTimeout(a,t);}}let d=x(k,n.checkInterval);function $(e){if(n.enabled){for(const t of e)if(t.type==="childList"&&t.addedNodes.length>0){d();return}}}function y(){if(c)return;const e=document.querySelector('main[role="main"]');if(!e){setTimeout(y,1e3);return}c=new MutationObserver($),c.observe(e,{childList:true,subtree:true}),f.info("タイムラインの監視を開始しました。"),d();}function z(){c&&(c.disconnect(),c=null,f.info("タイムラインの監視を停止しました。"));}function _(){d=x(k,n.checkInterval);}setInterval(()=>{m!==location.href&&(m=location.href,f.info("URLの変更を検知:",m),n.enabled&&setTimeout(d,500));},1e3);let r=null;const N=()=>`
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
`;function O(){r&&r.remove(),r=document.createElement("div"),r.id="retweet-settings-modal-host";const e=r.attachShadow({mode:"closed"}),t=document.createElement("style");t.textContent=N(),e.appendChild(t);const o=document.createElement("div");o.className="modal-backdrop";const i=document.createElement("div");i.className="modal",(document.body.style.backgroundColor==="rgb(21, 32, 43)"||window.matchMedia("(prefers-color-scheme: dark)").matches)&&i.classList.add("dark"),i.innerHTML=`
    <h2>リツイート非表示の設定</h2>
    <div class="setting-item">
      <label>
        <input type="checkbox" id="retweet-hide-enabled" ${n.enabled?"checked":""}>
        リツイート非表示を有効にする
      </label>
    </div>
    <div class="interval-setting">
      <label for="retweet-check-interval">更新間隔 (ミリ秒):</label>
      <input type="number" id="retweet-check-interval" min="100" max="1000" step="100" value="${n.checkInterval}">
    </div>
    <div class="button-group">
      <button class="button button-secondary" id="cancel-button">キャンセル</button>
      <button class="button button-primary" id="save-button">保存</button>
    </div>
  `,o.appendChild(i),e.appendChild(o),document.body.appendChild(r);const a=e.getElementById("retweet-hide-enabled"),g=e.getElementById("retweet-check-interval"),E=e.getElementById("save-button"),I=e.getElementById("cancel-button"),b=()=>{r&&(r.remove(),r=null);};E.addEventListener("click",()=>{const s={enabled:a.checked,checkInterval:parseInt(g.value,10)||n.checkInterval},M=n.enabled;T(s),M!==s.enabled&&w(),_(),b();}),I.addEventListener("click",b),o.addEventListener("click",s=>{s.target===o&&b();});}const p=u("twitter-mute-retweets");function w(){n.enabled?(p.info("リツイート非表示機能が有効です。監視を開始します。"),y()):(p.info("リツイート非表示機能が無効です。監視を停止します。"),z());}function A(){p.info("スクリプトを初期化中..."),GM_registerMenuCommand("リツイート非表示の設定",O),w(),setTimeout(d,1e3);}A();

})();