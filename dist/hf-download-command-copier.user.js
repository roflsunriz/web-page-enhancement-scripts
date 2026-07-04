// ==UserScript==
// @name         hf-download-command-copier
// @namespace    hfDownloadCommandCopier
// @version      1.2.1
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

(function(){"use strict";var e=typeof GM_setClipboard<`u`?GM_setClipboard:void 0;function t(t,n){typeof n==`string`?e(t,n):e(t,`text`)}var n=new Set([`ar`,`ur`]);function r(e){return n.has(e)?`rtl`:`ltr`}function i(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function a(e){let t=Object.keys(e.translations),n=e.defaultLocale,a=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},o=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=a(e);if(t)return t}return e.fallbackLocale},s=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:o,t:s,format:(e,t)=>i(s(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>r(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var o=a({translations:{ja:{headerButton:`hf downloadをコピー`,fileButton:`hf`,copied:`コピー済み`,toastCopied:`hf download コマンドをコピーしました`,headerTitle:`このリポジトリをダウンロードする hf CLI コマンドをコピー`,fileTitle:`{filePath} をダウンロードする hf CLI コマンドをコピー`},en:{headerButton:`Copy hf download`,fileButton:`hf`,copied:`Copied`,toastCopied:`hf download command copied`,headerTitle:`Copy hf CLI command to download this repository`,fileTitle:`Copy hf CLI command to download {filePath}`},"zh-Hans":{headerButton:`复制 hf download`,fileButton:`hf`,copied:`已复制`,toastCopied:`已复制 hf download 命令`,headerTitle:`复制用于下载此仓库的 hf CLI 命令`,fileTitle:`复制用于下载 {filePath} 的 hf CLI 命令`},hi:{headerButton:`hf download कॉपी करें`,fileButton:`hf`,copied:`कॉपी किया गया`,toastCopied:`hf download कमांड कॉपी किया गया`,headerTitle:`इस रिपॉजिटरी को डाउनलोड करने का hf CLI कमांड कॉपी करें`,fileTitle:`{filePath} डाउनलोड करने का hf CLI कमांड कॉपी करें`},es:{headerButton:`Copiar hf download`,fileButton:`hf`,copied:`Copiado`,toastCopied:`Comando hf download copiado`,headerTitle:`Copiar comando hf CLI para descargar este repositorio`,fileTitle:`Copiar comando hf CLI para descargar {filePath}`},fr:{headerButton:`Copier hf download`,fileButton:`hf`,copied:`Copie`,toastCopied:`Commande hf download copiee`,headerTitle:`Copier la commande hf CLI pour telecharger ce depot`,fileTitle:`Copier la commande hf CLI pour telecharger {filePath}`},ar:{headerButton:`نسخ hf download`,fileButton:`hf`,copied:`تم النسخ`,toastCopied:`تم نسخ أمر hf download`,headerTitle:`نسخ أمر hf CLI لتنزيل هذا المستودع`,fileTitle:`نسخ أمر hf CLI لتنزيل {filePath}`},pt:{headerButton:`Copiar hf download`,fileButton:`hf`,copied:`Copiado`,toastCopied:`Comando hf download copiado`,headerTitle:`Copiar comando hf CLI para baixar este repositorio`,fileTitle:`Copiar comando hf CLI para baixar {filePath}`},bn:{headerButton:`hf download কপি করুন`,fileButton:`hf`,copied:`কপি হয়েছে`,toastCopied:`hf download কমান্ড কপি হয়েছে`,headerTitle:`এই রিপোজিটরি ডাউনলোডের hf CLI কমান্ড কপি করুন`,fileTitle:`{filePath} ডাউনলোডের hf CLI কমান্ড কপি করুন`},ru:{headerButton:`Копировать hf download`,fileButton:`hf`,copied:`Скопировано`,toastCopied:`Команда hf download скопирована`,headerTitle:`Копировать команду hf CLI для загрузки этого репозитория`,fileTitle:`Копировать команду hf CLI для загрузки {filePath}`},ur:{headerButton:`hf download کاپی کریں`,fileButton:`hf`,copied:`کاپی ہو گیا`,toastCopied:`hf download کمانڈ کاپی ہو گیا`,headerTitle:`اس ریپوزٹری کو ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں`,fileTitle:`{filePath} ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں`}},defaultLocale:`ja`,fallbackLocale:`en`,aliases:{zh:`zh-Hans`,"zh-cn":`zh-Hans`,"zh-sg":`zh-Hans`}});o.setLocale(o.detectBrowserLocale());var s=o.t,c=o.format,l=o.getDirection,u=`hf-download-command-copier`,d=`hf-download-command-copier-button`,f=`${u}-header-button`,p=`${u}-toast`,m=`main`,h=`Q4_K_S`,g=new Set([`blog`,`chat`,`collections`,`docs`,`enterprise`,`join`,`leaderboards`,`login`,`models`,`new`,`notifications`,`organizations`,`posts`,`pricing`,`search`,`settings`,`spaces`,`tasks`]);function _(e){return/^[A-Za-z0-9._/@:+-]+$/.test(e)?e:`"${e.replace(/(["\\$`])/g,`\\$1`)}"`}function v(){return window.location.pathname.split(`/`).map(e=>decodeURIComponent(e)).filter(Boolean)}function y(){let e=v(),t=`model`,n=0;e[0]===`datasets`?(t=`dataset`,n=1):e[0]===`spaces`&&(t=`space`,n=1);let r=e[n],i=e[n+1];if(!r||!i||t===`model`&&g.has(r))return null;let a=e[n+2],o=a===`tree`||a===`blob`?e[n+3]??m:m;return{repoId:`${r}/${i}`,repoName:i,repoType:t,revision:o}}function b(e){return e===`model`?``:` --repo-type ${e}`}function x(e){return e.repoType===`model`&&D(e).some(e=>e.includes(h))?` --include ${_(`*${h}*`)}`:``}function S(e){let t=e.revision===m?``:` --revision ${_(e.revision)}`;return`hf download ${_(e.repoId)}${b(e.repoType)}${x(e)}${t} --local-dir .`}function C(e,t){let n=e.revision===m?``:` --revision ${_(e.revision)}`;return`hf download ${_(e.repoId)} ${_(t)}${b(e.repoType)}${n} --local-dir .`}function w(e,t){let n=new URL(e,window.location.origin).pathname.split(`/`).map(e=>decodeURIComponent(e)).filter(Boolean),r=n.indexOf(`blob`);if(r<0||(t.repoType===`model`?n.slice(0,r):n.slice(1,r)).join(`/`)!==t.repoId)return null;let i=n.slice(r+2).join(`/`);return i.length>0?i:null}function T(e){return Array.from(document.querySelectorAll(`a[href*="/blob/"]`)).map(t=>w(t.href,e)).filter(e=>e!==null&&e.endsWith(`.gguf`))}function E(){let e=Array.from(document.querySelectorAll(`[data-props*="ggufFilePaths"]`));for(let t of e){let e=t.getAttribute(`data-props`);if(!e)continue;let n=e.match(/"ggufFilePaths":\[(.*?)\]/s);if(!n)continue;let r=Array.from(n[1].matchAll(/"([^"]+\.gguf)"/g)).map(e=>e[1]);if(r.length>0)return r}return[]}function D(e){let t=T(e);return t.length>0?t:E()}function O(e){document.getElementById(p)?.remove();let t=document.createElement(`div`);t.id=p,t.textContent=e,t.dir=l(),document.body.append(t),window.setTimeout(()=>{t.remove()},1800)}function k(e,n){t(e);let r=n.textContent;n.textContent=s(`copied`),n.setAttribute(`data-copied`,`true`),O(s(`toastCopied`)),window.setTimeout(()=>{n.textContent=r??s(`headerButton`),n.removeAttribute(`data-copied`)},1400)}function A(e,t,n){let r=document.createElement(`button`);return r.type=`button`,r.className=d,r.textContent=e,r.title=t,r.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),k(n,r)}),r}function j(){let e=document.querySelector(`main h1`);return e?e.parentElement:null}function M(e){if(document.getElementById(f))return;let t=j();if(!t)return;let n=A(s(`headerButton`),s(`headerTitle`),S(e));n.id=f,n.setAttribute(`data-variant`,`header`),t.append(n)}function N(e){let t=Array.from(document.querySelectorAll(`a[href*="/blob/"]`));for(let n of t){let t=w(n.href,e);if(!t)continue;let r=n.closest(`li`),i=(r?Array.from(r.querySelectorAll(`.${d}[data-file-path]`)):[]).some(e=>e.getAttribute(`data-file-path`)===t);if(!r||i)continue;let a=A(s(`fileButton`),c(`fileTitle`,{filePath:t}),C(e,t));a.setAttribute(`data-file-path`,t),a.setAttribute(`data-variant`,`file`);let o=n.parentElement;o&&o.append(a)}}function P(){let e=`${u}-styles`;if(document.getElementById(e))return;let t=document.createElement(`style`);t.id=e,t.textContent=`
    .${d} {
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

    .${d}:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
      color: #111827;
    }

    .${d}[data-copied="true"] {
      background: #ecfdf5;
      border-color: #34d399;
      color: #047857;
    }

    .${d}[data-variant="header"] {
      margin-left: 12px;
      min-height: 30px;
      padding: 5px 11px;
    }

    html.dark .${d} {
      background: #111827;
      border-color: #374151;
      color: #d1d5db;
    }

    html.dark .${d}:hover {
      background: #1f2937;
      border-color: #4b5563;
      color: #f9fafb;
    }

    html.dark .${d}[data-copied="true"] {
      background: #052e26;
      border-color: #10b981;
      color: #a7f3d0;
    }

    #${p} {
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
  `,document.head.append(t)}function F(){let e=y();e&&(P(),M(e),N(e))}function I(){if(!document.body)return;let e=window.location.href;new MutationObserver(()=>{F(),window.location.href!==e&&(e=window.location.href,document.getElementById(f)?.remove(),F())}).observe(document.body,{childList:!0,subtree:!0})}function L(){F(),I()}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,L,{once:!0}):L()})();
