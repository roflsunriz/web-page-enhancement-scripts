// ==UserScript==
// @name         yahoo-mail-mark-read
// @namespace    yahooMailMarkRead
// @version      1.1.0
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

  const i="yahoo-mail-mark-read",a=`${i}-button`,m=`${i}-bulk-button`,l=`${i}-toast`,L='[data-cy="systemFolderLabel"], [data-cy="personalFolderLabel"]',B='[title^="未読メール："]',w="1",M='[data-cy="mailListCheckBoxAll"]',I='[data-cy="mailListCheckBoxAllInput"]',v='[data-cy="toolBarOthers"]',D='[data-cy="popupMenuRead"]',y="既読にする",p=180,F=8e3,E=5e3,N=3e3,q=80;function d(t){return new Promise(e=>{window.setTimeout(e,t);})}function s(t){return t.textContent?.replace(/\s+/g," ").trim()??""}function U(t){return t instanceof HTMLElement}function x(t){return U(t)&&typeof t.click=="function"}function f(t){return t.getClientRects().length>0}function g(t){return "disabled"in t&&typeof t.disabled=="boolean"?t.disabled:t.getAttribute("aria-disabled")==="true"}async function u(t,e,n){const o=Date.now();for(;Date.now()-o<e;){const r=t();if(r!==null)return r;await d(q);}throw new Error(n)}function c(t,e="info"){document.getElementById(l)?.remove();const n=document.createElement("div");n.id=l,n.dataset.variant=e,n.textContent=t,document.body.append(n),window.setTimeout(()=>{n.remove();},2200);}function A(t){return b(t)===w?"受信箱":s(t)||"このフォルダー"}function S(t){return t.querySelector(B)!==null}function b(t){return t.getAttribute("data-cy-identifier")}function k(t){const e=b(t);return e!==null&&window.location.pathname.endsWith(`/list/${e}`)}async function P(t){if(!x(t))throw new Error("フォルダーを選択できません。");k(t)||t.click(),await u(()=>k(t)&&O()?true:null,F,"フォルダーの読み込みが完了しませんでした。");}function T(){return document.querySelector(I)?.checked??false}function O(){const t=document.querySelector(M);return x(t)&&f(t)?t:null}async function H(){if(T())return;(await u(O,E,"メール一覧の全選択チェックボックスが見つかりません。")).click(),await u(()=>T()?true:null,E,"メールの選択が完了しませんでした。");}function K(){const t=document.querySelector(v);return t&&f(t)&&!g(t)?t:null}function X(){const t=document.querySelector(D);if(x(t)&&f(t)&&!g(t))return t;const e=Array.from(document.querySelectorAll('button, [role="menuitem"], [role="option"], li, div')).filter(o=>f(o)&&!g(o)&&s(o).includes(y)),n=e.find(o=>s(o)===y);return n||(e.find(o=>!Array.from(o.children).some(r=>s(r).includes(y)))??null)}async function j(){return u(X,N,"「既読にする」メニューが見つかりません。")}async function z(){return (await u(K,E,"メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。")).click(),j()}async function C(t){await P(t),await H(),await d(p);const e=await z();await d(p),e.click();}async function G(t,e){const n=A(t);e.disabled=true,e.dataset.running="true",c(`${n} を開いています`);try{c(`${n} を既読にしています`),await C(t),c(`${n} を既読にしました`);}catch(o){const r=o instanceof Error?o.message:"既読化に失敗しました。";c(r,"error");}finally{e.disabled=false,delete e.dataset.running;}}function R(){return Array.from(document.querySelectorAll(L)).filter(t=>{const e=t.closest("li");return !e||!S(e)?false:b(t)===w||t.getAttribute("data-cy")==="personalFolderLabel"})}function _(t){const e=document.querySelectorAll(`.${a}, .${m}`);for(const n of Array.from(e))n.disabled=t,t?n.dataset.running="true":delete n.dataset.running;}async function V(t){const e=R();if(e.length===0){c("受信箱と個人フォルダに未読メールはありません");return}_(true),t.dataset.running="true";let n=0;try{for(const o of e){const r=A(o);c(`${r} を既読にしています (${n+1}/${e.length})`),await C(o),n+=1,await d(p);}c(`受信箱と個人フォルダ ${n} 件を既読にしました`);}catch(o){const r=o instanceof Error?o.message:"一括既読化に失敗しました。";c(`${n}/${e.length} 件完了: ${r}`,"error");}finally{_(false);}}function W(t){const e=document.createElement("button");return e.type="button",e.className=a,e.textContent="既読",e.title=`${A(t)} の表示中メールをすべて既読にする`,e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),G(t,e);}),e}function Y(){const t=document.createElement("button");return t.type="button",t.className=`${a} ${m}`,t.textContent="一括既読",t.title="受信箱と未読がある個人フォルダを順番に開いて既読にする",t.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),V(t);}),t}function J(){const t=Array.from(document.querySelectorAll(L)).find(r=>b(r)===w),e=document.querySelector(`.${m}`),n=R().length>0;if(!t||!n){e?.remove();return}const o=t.closest("li");!o||e||o.append(Y());}function $(){const t=Array.from(document.querySelectorAll(L));for(const e of t){const n=e.closest("li");if(!n)continue;const o=n.querySelector(`.${a}:not(.${m})`);if(!S(n)){o?.remove();continue}o||n.append(W(e));}J();}function Q(){if(document.getElementById(`${i}-styles`))return;const t=document.createElement("style");t.id=`${i}-styles`,t.textContent=`
    .${a} {
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

    .${a}:hover {
      background: #f2f6fb;
      border-color: #8da4bd;
      color: #0057af;
    }

    .${a}:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .${a}[data-running="true"] {
      background: #eaf4ff;
      border-color: #66a6e8;
      color: #0057af;
    }

    #${l} {
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

    #${l}[data-variant="error"] {
      background: #b3261e;
    }
  `,document.head.append(t);}function Z(){if(!document.body)return;new MutationObserver(()=>{$();}).observe(document.body,{childList:true,subtree:true});}function h(){Q(),$(),Z();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h,{once:true}):h();

})();