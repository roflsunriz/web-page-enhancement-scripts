// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.0.0
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

  const c="yahoo-mail-mark-read",o=`${c}-button`,a=`${c}-toast`,b='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',y='[data-cy="mailListCheckBoxAll"]',E='[data-cy="mailListCheckBoxAllInput"]',x="メニューを開く",d="既読にする",u=180,w=3e3;function l(e){return new Promise(t=>{window.setTimeout(t,e);})}function i(e){return e.textContent?.replace(/\s+/g," ").trim()??""}function T(e){return e instanceof HTMLElement}function g(e){return T(e)&&typeof e.click=="function"}function s(e,t="info"){document.getElementById(a)?.remove();const n=document.createElement("div");n.id=a,n.dataset.variant=t,n.textContent=e,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function f(e){return i(e)||"このフォルダー"}function A(){return document.querySelector(E)?.checked??false}function h(){if(A())return;const e=document.querySelector(y);if(!g(e))throw new Error("メール一覧の全選択チェックボックスが見つかりません。");e.click();}function k(){return Array.from(document.querySelectorAll("button")).find(t=>t.title===x&&!t.disabled)??null}function L(){const e=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(n=>i(n).includes(d)),t=e.find(n=>i(n)===d);return t||(e.find(n=>!Array.from(n.children).some(r=>i(r).includes(d)))??null)}async function C(){const e=Date.now();for(;Date.now()-e<w;){const t=L();if(t)return t;await l(80);}throw new Error("「既読にする」メニューが見つかりません。")}async function _(e,t){t.disabled=true,t.dataset.running="true",s(`${e} のメールを選択しています`);try{h(),await l(u);const n=k();if(!n)throw new Error("メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。");n.click();const r=await C();await l(u),r.click(),s(`${e} を既読にしました`);}catch(n){const r=n instanceof Error?n.message:"既読化に失敗しました。";s(r,"error");}finally{t.disabled=false,delete t.dataset.running;}}function S(e){const t=document.createElement("button");return t.type="button",t.className=o,t.textContent="既読",t.title=`${f(e)} の表示中メールをすべて既読にする`,t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),_(f(e),t);}),t}function p(){const e=Array.from(document.querySelectorAll(b));for(const t of e){const n=t.closest("li");!n||n.querySelector(`.${o}`)||n.append(S(t));}}function v(){if(document.getElementById(`${c}-styles`))return;const e=document.createElement("style");e.id=`${c}-styles`,e.textContent=`
    .${o} {
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

    .${o}:hover {
      background: #f2f6fb;
      border-color: #8da4bd;
      color: #0057af;
    }

    .${o}:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .${o}[data-running="true"] {
      background: #eaf4ff;
      border-color: #66a6e8;
      color: #0057af;
    }

    #${a} {
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

    #${a}[data-variant="error"] {
      background: #b3261e;
    }
  `,document.head.append(e);}function M(){if(!document.body)return;new MutationObserver(()=>{p();}).observe(document.body,{childList:true,subtree:true});}function m(){v(),p(),M();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m,{once:true}):m();

})();