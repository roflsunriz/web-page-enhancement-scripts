// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.0.4
// @author       roflsunriz
// @description  Yahoo!メール PC版のフォルダー一覧に、表示中メールをまとめて既読にするボタンを追加
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-mark-read.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-mark-read.meta.js
// @match        https://mail.yahoo.co.jp/*
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const s="yahoo-mail-mark-read",i=`${s}-button`,d=`${s}-toast`,g='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',h='[title^="未読メール："]',O='[data-cy="mailListCheckBoxAll"]',S='[data-cy="mailListCheckBoxAllInput"]',k='[data-cy="toolBarOthers"]',C='[data-cy="popupMenuRead"]',f="既読にする",y=180,M=8e3,m=5e3,R=3e3,I=80;function E(t){return new Promise(e=>{window.setTimeout(e,t);})}function u(t){return t.textContent?.replace(/\s+/g," ").trim()??""}function v(t){return t instanceof HTMLElement}function b(t){return v(t)&&typeof t.click=="function"}function l(t){return t.getClientRects().length>0}function p(t){return "disabled"in t&&typeof t.disabled=="boolean"?t.disabled:t.getAttribute("aria-disabled")==="true"}async function c(t,e,n){const o=Date.now();for(;Date.now()-o<e;){const r=t();if(r!==null)return r;await E(I);}throw new Error(n)}function a(t,e="info"){document.getElementById(d)?.remove();const n=document.createElement("div");n.id=d,n.dataset.variant=e,n.textContent=t,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function T(t){return u(t)||"このフォルダー"}function B(t){return t.querySelector(h)!==null}function $(t){return t.getAttribute("data-cy-identifier")}function x(t){const e=$(t);return e!==null&&window.location.pathname.endsWith(`/list/${e}`)}async function D(t){if(!b(t))throw new Error("フォルダーを選択できません。");x(t)||t.click(),await c(()=>x(t)&&_()?true:null,M,"フォルダーの読み込みが完了しませんでした。");}function w(){return document.querySelector(S)?.checked??false}function _(){const t=document.querySelector(O);return b(t)&&l(t)?t:null}async function F(){if(w())return;(await c(_,m,"メール一覧の全選択チェックボックスが見つかりません。")).click(),await c(()=>w()?true:null,m,"メールの選択が完了しませんでした。");}function N(){const t=document.querySelector(k);return t&&l(t)&&!p(t)?t:null}function U(){const t=document.querySelector(C);if(b(t)&&l(t)&&!p(t))return t;const e=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(o=>l(o)&&!p(o)&&u(o).includes(f)),n=e.find(o=>u(o)===f);return n||(e.find(o=>!Array.from(o.children).some(r=>u(r).includes(f)))??null)}async function P(){return c(U,R,"「既読にする」メニューが見つかりません。")}async function q(){return (await c(N,m,"メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。")).click(),P()}async function H(t,e){const n=T(t);e.disabled=true,e.dataset.running="true",a(`${n} を開いています`);try{await D(t),a(`${n} のメールを選択しています`),await F(),await E(y);const o=await q();await E(y),o.click(),a(`${n} を既読にしました`);}catch(o){const r=o instanceof Error?o.message:"既読化に失敗しました。";a(r,"error");}finally{e.disabled=false,delete e.dataset.running;}}function K(t){const e=document.createElement("button");return e.type="button",e.className=i,e.textContent="既読",e.title=`${T(t)} の表示中メールをすべて既読にする`,e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),H(t,e);}),e}function A(){const t=Array.from(document.querySelectorAll(g));for(const e of t){const n=e.closest("li");if(!n)continue;const o=n.querySelector(`.${i}`);if(!B(n)){o?.remove();continue}o||n.append(K(e));}}function X(){if(document.getElementById(`${s}-styles`))return;const t=document.createElement("style");t.id=`${s}-styles`,t.textContent=`
    .${i} {
      align-items: center;
      background: #ffffff;
      border: 1px solid #c9d3df;
      border-radius: 4px;
      color: #445564;
      cursor: pointer;
      display: inline-flex;
      flex: none;
      font: 700 11px/1.2 Helvetica, Arial, sans-serif;
      justify-content: center;
      margin-left: auto;
      min-height: 22px;
      min-width: 38px;
      padding: 2px 7px;
      white-space: nowrap;
    }

    .${i}:hover {
      background: #f2f6fb;
      border-color: #8da4bd;
      color: #0057af;
    }

    .${i}:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .${i}[data-running="true"] {
      background: #eaf4ff;
      border-color: #66a6e8;
      color: #0057af;
    }

    #${d} {
      background: #263442;
      border-radius: 6px;
      bottom: 24px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
      color: #ffffff;
      font: 700 13px/1.4 Helvetica, Arial, sans-serif;
      max-width: 360px;
      padding: 10px 14px;
      position: fixed;
      right: 24px;
      z-index: 2147483647;
    }

    #${d}[data-variant="error"] {
      background: #b3261e;
    }
  `,document.head.append(t);}function j(){if(!document.body)return;new MutationObserver(()=>{A();}).observe(document.body,{childList:true,subtree:true});}function L(){X(),A(),j();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",L,{once:true}):L();

})();