// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.0.1
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

  const a="yahoo-mail-mark-read",r=`${a}-button`,i=`${a}-toast`,E='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',x='[data-cy="mailListCheckBoxAll"]',w='[data-cy="mailListCheckBoxAllInput"]',L='[data-cy="toolBarOthers"]',T='[data-cy="popupMenuRead"]',d="既読にする",l=180,g=3e3;function u(e){return new Promise(t=>{window.setTimeout(t,e);})}function c(e){return e.textContent?.replace(/\s+/g," ").trim()??""}function h(e){return e instanceof HTMLElement}function p(e){return h(e)&&typeof e.click=="function"}function s(e,t="info"){document.getElementById(i)?.remove();const n=document.createElement("div");n.id=i,n.dataset.variant=t,n.textContent=e,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function f(e){return c(e)||"このフォルダー"}function A(){return document.querySelector(w)?.checked??false}function k(){if(A())return;const e=document.querySelector(x);if(!p(e))throw new Error("メール一覧の全選択チェックボックスが見つかりません。");e.click();}function C(){const e=document.querySelector(L);return e&&!e.disabled?e:null}function S(){const e=document.querySelector(T);if(p(e))return e;const t=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(o=>c(o).includes(d)),n=t.find(o=>c(o)===d);return n||(t.find(o=>!Array.from(o.children).some(y=>c(y).includes(d)))??null)}async function _(){const e=Date.now();for(;Date.now()-e<g;){const t=S();if(t)return t;await u(80);}throw new Error("「既読にする」メニューが見つかりません。")}async function O(e,t){t.disabled=true,t.dataset.running="true",s(`${e} のメールを選択しています`);try{k(),await u(l);const n=C();if(!n)throw new Error("メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。");n.click();const o=await _();await u(l),o.click(),s(`${e} を既読にしました`);}catch(n){const o=n instanceof Error?n.message:"既読化に失敗しました。";s(o,"error");}finally{t.disabled=false,delete t.dataset.running;}}function M(e){const t=document.createElement("button");return t.type="button",t.className=r,t.textContent="既読",t.title=`${f(e)} の表示中メールをすべて既読にする`,t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),O(f(e),t);}),t}function b(){const e=Array.from(document.querySelectorAll(E));for(const t of e){const n=t.closest("li");!n||n.querySelector(`.${r}`)||n.append(M(t));}}function R(){if(document.getElementById(`${a}-styles`))return;const e=document.createElement("style");e.id=`${a}-styles`,e.textContent=`
    .${r} {
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

    .${r}:hover {
      background: #f2f6fb;
      border-color: #8da4bd;
      color: #0057af;
    }

    .${r}:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .${r}[data-running="true"] {
      background: #eaf4ff;
      border-color: #66a6e8;
      color: #0057af;
    }

    #${i} {
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

    #${i}[data-variant="error"] {
      background: #b3261e;
    }
  `,document.head.append(e);}function v(){if(!document.body)return;new MutationObserver(()=>{b();}).observe(document.body,{childList:true,subtree:true});}function m(){R(),b(),v();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m,{once:true}):m();

})();