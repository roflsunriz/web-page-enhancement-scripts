// ==UserScript==
// @name         hf-download-command-copier
// @namespace    hfDownloadCommandCopier
// @version      1.1.0
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

  var I=typeof GM_setClipboard<"u"?GM_setClipboard:void 0;function C(e,t){I(e,"text");}const m="hf-download-command-copier",i="hf-download-command-copier-button",u=`${m}-header-button`,f=`${m}-toast`,l="main",g="Q4_K_S",v=new Set(["blog","chat","collections","docs","enterprise","join","leaderboards","login","models","new","notifications","organizations","posts","pricing","search","settings","spaces","tasks"]);function d(e){return /^[A-Za-z0-9._/@:+-]+$/.test(e)?e:`"${e.replace(/(["\\$`])/g,"\\$1")}"`}function A(){return window.location.pathname.split("/").map(e=>decodeURIComponent(e)).filter(Boolean)}function S(){const e=A();let t="model",o=0;e[0]==="datasets"?(t="dataset",o=1):e[0]==="spaces"&&(t="space",o=1);const n=e[o],r=e[o+1];if(!n||!r||t==="model"&&v.has(n))return null;const a=e[o+2],s=a==="tree"||a==="blob"?e[o+3]??l:l;return {repoId:`${n}/${r}`,repoName:r,repoType:t,revision:s}}function y(e){return e==="model"?"":` --repo-type ${e}`}function T(e){return e.repoType!=="model"?"":D(e).some(o=>o.includes(g))?` --include ${d(`*${g}*`)}`:""}function E(e){const t=e.revision===l?"":` --revision ${d(e.revision)}`;return `hf download ${d(e.repoId)}${y(e.repoType)}${T(e)}${t} --local-dir .`}function k(e,t){const o=e.revision===l?"":` --revision ${d(e.revision)}`;return `hf download ${d(e.repoId)} ${d(t)}${y(e.repoType)}${o} --local-dir .`}function w(e,t){const n=new URL(e,window.location.origin).pathname.split("/").map(c=>decodeURIComponent(c)).filter(Boolean),r=n.indexOf("blob");if(r<0||(t.repoType==="model"?n.slice(0,r):n.slice(1,r)).join("/")!==t.repoId)return null;const s=n.slice(r+2).join("/");return s.length>0?s:null}function B(e){return Array.from(document.querySelectorAll('a[href*="/blob/"]')).map(t=>w(t.href,e)).filter(t=>t!==null&&t.endsWith(".gguf"))}function _(){const e=Array.from(document.querySelectorAll('[data-props*="ggufFilePaths"]'));for(const t of e){const o=t.getAttribute("data-props");if(!o)continue;const n=o.match(/"ggufFilePaths":\[(.*?)\]/s);if(!n)continue;const r=Array.from(n[1].matchAll(/"([^"]+\.gguf)"/g)).map(a=>a[1]);if(r.length>0)return r}return []}function D(e){const t=B(e);return t.length>0?t:_()}function F(e){document.getElementById(f)?.remove();const o=document.createElement("div");o.id=f,o.textContent=e,document.body.append(o),window.setTimeout(()=>{o.remove();},1800);}function O(e,t){C(e);const o=t.textContent;t.textContent="Copied",t.setAttribute("data-copied","true"),F("hf download command copied"),window.setTimeout(()=>{t.textContent=o??"Copy hf",t.removeAttribute("data-copied");},1400);}function x(e,t,o){const n=document.createElement("button");return n.type="button",n.className=i,n.textContent=e,n.title=t,n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),O(o,n);}),n}function P(){const e=document.querySelector("main h1");return e?e.parentElement:null}function L(e){if(document.getElementById(u))return;const t=P();if(!t)return;const o=x("Copy hf download","Copy hf CLI command to download this repository",E(e));o.id=u,o.setAttribute("data-variant","header"),t.append(o);}function R(e){const t=Array.from(document.querySelectorAll('a[href*="/blob/"]'));for(const o of t){const n=w(o.href,e);if(!n)continue;const r=o.closest("li"),s=(r?Array.from(r.querySelectorAll(`.${i}[data-file-path]`)):[]).some($=>$.getAttribute("data-file-path")===n);if(!r||s)continue;const c=x("hf",`Copy hf CLI command to download ${n}`,k(e,n));c.setAttribute("data-file-path",n),c.setAttribute("data-variant","file");const h=o.parentElement;h&&h.append(c);}}function U(){const e=`${m}-styles`;if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
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

    #${f} {
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
  `,document.head.append(t);}function p(){const e=S();e&&(U(),L(e),R(e));}function z(){if(!document.body)return;let e=window.location.href;new MutationObserver(()=>{p(),window.location.href!==e&&(e=window.location.href,document.getElementById(u)?.remove(),p());}).observe(document.body,{childList:true,subtree:true});}function b(){p(),z();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",b,{once:true}):b();

})();