// ==UserScript==
// @name         hf-download-command-copier
// @namespace    hfDownloadCommandCopier
// @version      1.0.0
// @author       roflsunriz
// @description  Hugging Faceのリポジトリページにhf downloadコマンドのコピーボタンを追加
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/hf-download-command-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/hf-download-command-copier.meta.js
// @match        https://huggingface.co/*/*
// @match        https://huggingface.co/datasets/*/*
// @match        https://huggingface.co/spaces/*/*
// @exclude      https://huggingface.co/login*
// @exclude      https://huggingface.co/join*
// @exclude      https://huggingface.co/settings*
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var x=typeof GM_setClipboard<"u"?GM_setClipboard:void 0;function $(e,t){x(e,"text");}const m="hf-download-command-copier",i="hf-download-command-copier-button",p=`${m}-header-button`,u=`${m}-toast`,l="main",C=new Set(["blog","chat","collections","docs","enterprise","join","leaderboards","login","models","new","notifications","organizations","posts","pricing","search","settings","spaces","tasks"]);function a(e){return /^[A-Za-z0-9._/@:+-]+$/.test(e)?e:`"${e.replace(/(["\\$`])/g,"\\$1")}"`}function v(){return window.location.pathname.split("/").map(e=>decodeURIComponent(e)).filter(Boolean)}function I(){const e=v();let t="model",o=0;e[0]==="datasets"?(t="dataset",o=1):e[0]==="spaces"&&(t="space",o=1);const n=e[o],r=e[o+1];if(!n||!r||t==="model"&&C.has(n))return null;const c=e[o+2],s=c==="tree"||c==="blob"?e[o+3]??l:l;return {repoId:`${n}/${r}`,repoName:r,repoType:t,revision:s}}function h(e){return e==="model"?"":` --repo-type ${e}`}function E(e){const t=e.revision===l?"":` --revision ${a(e.revision)}`;return `hf download ${a(e.repoId)}${h(e.repoType)}${t} --local-dir ${a(e.repoName)}`}function S(e,t){const o=e.revision===l?"":` --revision ${a(e.revision)}`;return `hf download ${a(e.repoId)} ${a(t)}${h(e.repoType)}${o} --local-dir ${a(e.repoName)}`}function T(e,t){const n=new URL(e,window.location.origin).pathname.split("/").map(d=>decodeURIComponent(d)).filter(Boolean),r=n.indexOf("blob");if(r<0||(t.repoType==="model"?n.slice(0,r):n.slice(1,r)).join("/")!==t.repoId)return null;const s=n.slice(r+2).join("/");return s.length>0?s:null}function k(e){document.getElementById(u)?.remove();const o=document.createElement("div");o.id=u,o.textContent=e,document.body.append(o),window.setTimeout(()=>{o.remove();},1800);}function B(e,t){$(e);const o=t.textContent;t.textContent="Copied",t.setAttribute("data-copied","true"),k("hf download command copied"),window.setTimeout(()=>{t.textContent=o??"Copy hf",t.removeAttribute("data-copied");},1400);}function y(e,t,o){const n=document.createElement("button");return n.type="button",n.className=i,n.textContent=e,n.title=t,n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),B(o,n);}),n}function A(){const e=document.querySelector("main h1");return e?e.parentElement:null}function O(e){if(document.getElementById(p))return;const t=A();if(!t)return;const o=y("Copy hf download","Copy hf CLI command to download this repository",E(e));o.id=p,o.setAttribute("data-variant","header"),t.append(o);}function _(e){const t=Array.from(document.querySelectorAll('a[href*="/blob/"]'));for(const o of t){const n=T(o.href,e);if(!n)continue;const r=o.closest("li"),s=(r?Array.from(r.querySelectorAll(`.${i}[data-file-path]`)):[]).some(w=>w.getAttribute("data-file-path")===n);if(!r||s)continue;const d=y("hf",`Copy hf CLI command to download ${n}`,S(e,n));d.setAttribute("data-file-path",n),d.setAttribute("data-variant","file");const b=o.parentElement;b&&b.append(d);}}function R(){const e=`${m}-styles`;if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
    .${i} {
      align-items: center;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #374151;
      cursor: pointer;
      display: inline-flex;
      flex: none;
      font: 600 12px/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      gap: 4px;
      margin-left: 8px;
      min-height: 22px;
      padding: 3px 8px;
      transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
      white-space: nowrap;
    }

    .${i}:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #111827;
    }

    .${i}[data-copied="true"] {
      background: #ecfdf5;
      border-color: #34d399;
      color: #047857;
    }

    .${i}[data-variant="header"] {
      margin-left: 12px;
      min-height: 30px;
      padding: 5px 11px;
    }

    html.dark .${i} {
      background: #111827;
      border-color: #374151;
      color: #d1d5db;
    }

    html.dark .${i}:hover {
      background: #1f2937;
      border-color: #4b5563;
      color: #f9fafb;
    }

    html.dark .${i}[data-copied="true"] {
      background: #052e26;
      border-color: #10b981;
      color: #a7f3d0;
    }

    #${u} {
      background: #111827;
      border-radius: 8px;
      bottom: 24px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
      color: #ffffff;
      font: 600 13px/1.4 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 10px 14px;
      position: fixed;
      right: 24px;
      z-index: 99999;
    }
  `,document.head.append(t);}function f(){const e=I();e&&(R(),O(e),_(e));}function L(){if(!document.body)return;let e=window.location.href;new MutationObserver(()=>{f(),window.location.href!==e&&(e=window.location.href,document.getElementById(p)?.remove(),f());}).observe(document.body,{childList:true,subtree:true});}function g(){f(),L();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:true}):g();

})();