// ==UserScript==
// @name         hf-download-command-copier
// @namespace    hfDownloadCommandCopier
// @version      1.2.0
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

  var S=typeof GM_setClipboard<"u"?GM_setClipboard:void 0;function k(e,t){S(e,"text");}const P=new Set(["ar","ur"]);function E(e){return P.has(e)?"rtl":"ltr"}function z(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(o,n)=>{const a=t[n];return a===void 0?o:String(a)})}function D(e){const t=Object.keys(e.translations);let o=e.defaultLocale;const n=r=>{const i=r.toLowerCase(),l=e.aliases?.[i];if(l)return l;const m=t.find(b=>b.toLowerCase()===i);if(m)return m;const A=i.split("-")[0];return t.find(b=>b.toLowerCase().split("-")[0]===A)??null},a=()=>{const r=navigator.languages.length>0?navigator.languages:[navigator.language];for(const i of r){const l=n(i);if(l)return l}return e.fallbackLocale},d=r=>{const i=e.translations[o]?.[r];if(i)return i;const l=e.translations[e.fallbackLocale]?.[r];return l||(e.translations[e.defaultLocale]?.[r]??r)};return {locales:t,getLocale:()=>o,setLocale:r=>{o=r;},detectBrowserLocale:a,t:d,format:(r,i)=>z(d(r),i),getTranslations:(r=o)=>e.translations[r]??e.translations[e.fallbackLocale],getDirection:(r=o)=>E(r),getMissingTranslationKeys:r=>{const i=e.translations[e.fallbackLocale],l=e.translations[r];return Object.keys(i).filter(m=>!l[m])}}}const O={ja:{headerButton:"hf downloadをコピー",fileButton:"hf",copied:"コピー済み",toastCopied:"hf download コマンドをコピーしました",headerTitle:"このリポジトリをダウンロードする hf CLI コマンドをコピー",fileTitle:"{filePath} をダウンロードする hf CLI コマンドをコピー"},en:{headerButton:"Copy hf download",fileButton:"hf",copied:"Copied",toastCopied:"hf download command copied",headerTitle:"Copy hf CLI command to download this repository",fileTitle:"Copy hf CLI command to download {filePath}"},"zh-Hans":{headerButton:"复制 hf download",fileButton:"hf",copied:"已复制",toastCopied:"已复制 hf download 命令",headerTitle:"复制用于下载此仓库的 hf CLI 命令",fileTitle:"复制用于下载 {filePath} 的 hf CLI 命令"},hi:{headerButton:"hf download कॉपी करें",fileButton:"hf",copied:"कॉपी किया गया",toastCopied:"hf download कमांड कॉपी किया गया",headerTitle:"इस रिपॉजिटरी को डाउनलोड करने का hf CLI कमांड कॉपी करें",fileTitle:"{filePath} डाउनलोड करने का hf CLI कमांड कॉपी करें"},es:{headerButton:"Copiar hf download",fileButton:"hf",copied:"Copiado",toastCopied:"Comando hf download copiado",headerTitle:"Copiar comando hf CLI para descargar este repositorio",fileTitle:"Copiar comando hf CLI para descargar {filePath}"},fr:{headerButton:"Copier hf download",fileButton:"hf",copied:"Copie",toastCopied:"Commande hf download copiee",headerTitle:"Copier la commande hf CLI pour telecharger ce depot",fileTitle:"Copier la commande hf CLI pour telecharger {filePath}"},ar:{headerButton:"نسخ hf download",fileButton:"hf",copied:"تم النسخ",toastCopied:"تم نسخ أمر hf download",headerTitle:"نسخ أمر hf CLI لتنزيل هذا المستودع",fileTitle:"نسخ أمر hf CLI لتنزيل {filePath}"},pt:{headerButton:"Copiar hf download",fileButton:"hf",copied:"Copiado",toastCopied:"Comando hf download copiado",headerTitle:"Copiar comando hf CLI para baixar este repositorio",fileTitle:"Copiar comando hf CLI para baixar {filePath}"},bn:{headerButton:"hf download কপি করুন",fileButton:"hf",copied:"কপি হয়েছে",toastCopied:"hf download কমান্ড কপি হয়েছে",headerTitle:"এই রিপোজিটরি ডাউনলোডের hf CLI কমান্ড কপি করুন",fileTitle:"{filePath} ডাউনলোডের hf CLI কমান্ড কপি করুন"},ru:{headerButton:"Копировать hf download",fileButton:"hf",copied:"Скопировано",toastCopied:"Команда hf download скопирована",headerTitle:"Копировать команду hf CLI для загрузки этого репозитория",fileTitle:"Копировать команду hf CLI для загрузки {filePath}"},ur:{headerButton:"hf download کاپی کریں",fileButton:"hf",copied:"کاپی ہو گیا",toastCopied:"hf download کمانڈ کاپی ہو گیا",headerTitle:"اس ریپوزٹری کو ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں",fileTitle:"{filePath} ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں"}},p=D({translations:O,defaultLocale:"ja",fallbackLocale:"en",aliases:{zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans"}});p.setLocale(p.detectBrowserLocale());const u=p.t,_=p.format,F=p.getDirection,I="hf-download-command-copier",s="hf-download-command-copier-button",w=`${I}-header-button`,T=`${I}-toast`,g="main",y="Q4_K_S",R=new Set(["blog","chat","collections","docs","enterprise","join","leaderboards","login","models","new","notifications","organizations","posts","pricing","search","settings","spaces","tasks"]);function h(e){return /^[A-Za-z0-9._/@:+-]+$/.test(e)?e:`"${e.replace(/(["\\$`])/g,"\\$1")}"`}function M(){return window.location.pathname.split("/").map(e=>decodeURIComponent(e)).filter(Boolean)}function U(){const e=M();let t="model",o=0;e[0]==="datasets"?(t="dataset",o=1):e[0]==="spaces"&&(t="space",o=1);const n=e[o],a=e[o+1];if(!n||!a||t==="model"&&R.has(n))return null;const d=e[o+2],c=d==="tree"||d==="blob"?e[o+3]??g:g;return {repoId:`${n}/${a}`,repoName:a,repoType:t,revision:c}}function x(e){return e==="model"?"":` --repo-type ${e}`}function N(e){return e.repoType!=="model"?"":G(e).some(o=>o.includes(y))?` --include ${h(`*${y}*`)}`:""}function Q(e){const t=e.revision===g?"":` --revision ${h(e.revision)}`;return `hf download ${h(e.repoId)}${x(e.repoType)}${N(e)}${t} --local-dir .`}function j(e,t){const o=e.revision===g?"":` --revision ${h(e.revision)}`;return `hf download ${h(e.repoId)} ${h(t)}${x(e.repoType)}${o} --local-dir .`}function v(e,t){const n=new URL(e,window.location.origin).pathname.split("/").map(f=>decodeURIComponent(f)).filter(Boolean),a=n.indexOf("blob");if(a<0||(t.repoType==="model"?n.slice(0,a):n.slice(1,a)).join("/")!==t.repoId)return null;const c=n.slice(a+2).join("/");return c.length>0?c:null}function H(e){return Array.from(document.querySelectorAll('a[href*="/blob/"]')).map(t=>v(t.href,e)).filter(t=>t!==null&&t.endsWith(".gguf"))}function q(){const e=Array.from(document.querySelectorAll('[data-props*="ggufFilePaths"]'));for(const t of e){const o=t.getAttribute("data-props");if(!o)continue;const n=o.match(/"ggufFilePaths":\[(.*?)\]/s);if(!n)continue;const a=Array.from(n[1].matchAll(/"([^"]+\.gguf)"/g)).map(d=>d[1]);if(a.length>0)return a}return []}function G(e){const t=H(e);return t.length>0?t:q()}function K(e){document.getElementById(T)?.remove();const o=document.createElement("div");o.id=T,o.textContent=e,o.dir=F(),document.body.append(o),window.setTimeout(()=>{o.remove();},1800);}function Z(e,t){k(e);const o=t.textContent;t.textContent=u("copied"),t.setAttribute("data-copied","true"),K(u("toastCopied")),window.setTimeout(()=>{t.textContent=o??u("headerButton"),t.removeAttribute("data-copied");},1400);}function $(e,t,o){const n=document.createElement("button");return n.type="button",n.className=s,n.textContent=e,n.title=t,n.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),Z(o,n);}),n}function V(){const e=document.querySelector("main h1");return e?e.parentElement:null}function W(e){if(document.getElementById(w))return;const t=V();if(!t)return;const o=$(u("headerButton"),u("headerTitle"),Q(e));o.id=w,o.setAttribute("data-variant","header"),t.append(o);}function J(e){const t=Array.from(document.querySelectorAll('a[href*="/blob/"]'));for(const o of t){const n=v(o.href,e);if(!n)continue;const a=o.closest("li"),c=(a?Array.from(a.querySelectorAll(`.${s}[data-file-path]`)):[]).some(r=>r.getAttribute("data-file-path")===n);if(!a||c)continue;const f=$(u("fileButton"),_("fileTitle",{filePath:n}),j(e,n));f.setAttribute("data-file-path",n),f.setAttribute("data-variant","file");const C=o.parentElement;C&&C.append(f);}}function X(){const e=`${I}-styles`;if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=`
    .${s} {
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

    .${s}:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #111827;
    }

    .${s}[data-copied="true"] {
      background: #ecfdf5;
      border-color: #34d399;
      color: #047857;
    }

    .${s}[data-variant="header"] {
      margin-left: 12px;
      min-height: 30px;
      padding: 5px 11px;
    }

    html.dark .${s} {
      background: #111827;
      border-color: #374151;
      color: #d1d5db;
    }

    html.dark .${s}:hover {
      background: #1f2937;
      border-color: #4b5563;
      color: #f9fafb;
    }

    html.dark .${s}[data-copied="true"] {
      background: #052e26;
      border-color: #10b981;
      color: #a7f3d0;
    }

    #${T} {
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
  `,document.head.append(t);}function L(){const e=U();e&&(X(),W(e),J(e));}function Y(){if(!document.body)return;let e=window.location.href;new MutationObserver(()=>{L(),window.location.href!==e&&(e=window.location.href,document.getElementById(w)?.remove(),L());}).observe(document.body,{childList:true,subtree:true});}function B(){L(),Y();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B,{once:true}):B();

})();