// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.0.3
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

  const d="yahoo-mail-mark-read",r=`${d}-button`,s=`${d}-toast`,b='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',w='[title^="未読メール："]',x='[data-cy="mailListCheckBoxAll"]',L='[data-cy="mailListCheckBoxAllInput"]',h='[data-cy="toolBarOthers"]',A='[data-cy="popupMenuRead"]',l="既読にする",m=180,_=450,g=3e3;function u(e){return new Promise(t=>{window.setTimeout(t,e);})}function a(e){return e.textContent?.replace(/\s+/g," ").trim()??""}function T(e){return e instanceof HTMLElement}function f(e){return T(e)&&typeof e.click=="function"}function c(e,t="info"){document.getElementById(s)?.remove();const n=document.createElement("div");n.id=s,n.dataset.variant=t,n.textContent=e,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function p(e){return a(e)||"このフォルダー"}function S(e){return e.querySelector(w)!==null}function C(e){return e.getAttribute("data-cy-identifier")}function O(e){const t=C(e);return t!==null&&window.location.pathname.endsWith(`/list/${t}`)}async function k(e){if(!f(e))throw new Error("フォルダーを選択できません。");O(e)||(e.click(),await u(_));}function R(){return document.querySelector(L)?.checked??false}function M(){if(R())return;const e=document.querySelector(x);if(!f(e))throw new Error("メール一覧の全選択チェックボックスが見つかりません。");e.click();}function v(){const e=document.querySelector(h);return e&&!e.disabled?e:null}function I(){const e=document.querySelector(A);if(f(e))return e;const t=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(o=>a(o).includes(l)),n=t.find(o=>a(o)===l);return n||(t.find(o=>!Array.from(o.children).some(i=>a(i).includes(l)))??null)}async function B(){const e=Date.now();for(;Date.now()-e<g;){const t=I();if(t)return t;await u(80);}throw new Error("「既読にする」メニューが見つかりません。")}async function $(e,t){const n=p(e);t.disabled=true,t.dataset.running="true",c(`${n} を開いています`);try{await k(e),c(`${n} のメールを選択しています`),M(),await u(m);const o=v();if(!o)throw new Error("メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。");o.click();const i=await B();await u(m),i.click(),c(`${n} を既読にしました`);}catch(o){const i=o instanceof Error?o.message:"既読化に失敗しました。";c(i,"error");}finally{t.disabled=false,delete t.dataset.running;}}function D(e){const t=document.createElement("button");return t.type="button",t.className=r,t.textContent="既読",t.title=`${p(e)} の表示中メールをすべて既読にする`,t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),$(e,t);}),t}function y(){const e=Array.from(document.querySelectorAll(b));for(const t of e){const n=t.closest("li");if(!n)continue;const o=n.querySelector(`.${r}`);if(!S(n)){o?.remove();continue}o||n.append(D(t));}}function F(){if(document.getElementById(`${d}-styles`))return;const e=document.createElement("style");e.id=`${d}-styles`,e.textContent=`
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

    #${s} {
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

    #${s}[data-variant="error"] {
      background: #b3261e;
    }
  `,document.head.append(e);}function N(){if(!document.body)return;new MutationObserver(()=>{y();}).observe(document.body,{childList:true,subtree:true});}function E(){F(),y(),N();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E,{once:true}):E();

})();