// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.0.2
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

  const d="yahoo-mail-mark-read",r=`${d}-button`,s=`${d}-toast`,b='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',w='[data-cy="mailListCheckBoxAll"]',x='[data-cy="mailListCheckBoxAllInput"]',L='[data-cy="toolBarOthers"]',h='[data-cy="popupMenuRead"]',l="既読にする",m=180,g=450,A=3e3;function u(e){return new Promise(t=>{window.setTimeout(t,e);})}function a(e){return e.textContent?.replace(/\s+/g," ").trim()??""}function T(e){return e instanceof HTMLElement}function f(e){return T(e)&&typeof e.click=="function"}function i(e,t="info"){document.getElementById(s)?.remove();const n=document.createElement("div");n.id=s,n.dataset.variant=t,n.textContent=e,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function E(e){return a(e)||"このフォルダー"}function _(e){return e.getAttribute("data-cy-identifier")}function k(e){const t=_(e);return t!==null&&window.location.pathname.endsWith(`/list/${t}`)}async function C(e){if(!f(e))throw new Error("フォルダーを選択できません。");k(e)||(e.click(),await u(g));}function S(){return document.querySelector(x)?.checked??false}function O(){if(S())return;const e=document.querySelector(w);if(!f(e))throw new Error("メール一覧の全選択チェックボックスが見つかりません。");e.click();}function M(){const e=document.querySelector(L);return e&&!e.disabled?e:null}function R(){const e=document.querySelector(h);if(f(e))return e;const t=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(o=>a(o).includes(l)),n=t.find(o=>a(o)===l);return n||(t.find(o=>!Array.from(o.children).some(c=>a(c).includes(l)))??null)}async function I(){const e=Date.now();for(;Date.now()-e<A;){const t=R();if(t)return t;await u(80);}throw new Error("「既読にする」メニューが見つかりません。")}async function v(e,t){const n=E(e);t.disabled=true,t.dataset.running="true",i(`${n} を開いています`);try{await C(e),i(`${n} のメールを選択しています`),O(),await u(m);const o=M();if(!o)throw new Error("メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。");o.click();const c=await I();await u(m),c.click(),i(`${n} を既読にしました`);}catch(o){const c=o instanceof Error?o.message:"既読化に失敗しました。";i(c,"error");}finally{t.disabled=false,delete t.dataset.running;}}function $(e){const t=document.createElement("button");return t.type="button",t.className=r,t.textContent="既読",t.title=`${E(e)} の表示中メールをすべて既読にする`,t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),v(e,t);}),t}function y(){const e=Array.from(document.querySelectorAll(b));for(const t of e){const n=t.closest("li");!n||n.querySelector(`.${r}`)||n.append($(t));}}function B(){if(document.getElementById(`${d}-styles`))return;const e=document.createElement("style");e.id=`${d}-styles`,e.textContent=`
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
  `,document.head.append(e);}function D(){if(!document.body)return;new MutationObserver(()=>{y();}).observe(document.body,{childList:true,subtree:true});}function p(){B(),y(),D();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p,{once:true}):p();

})();