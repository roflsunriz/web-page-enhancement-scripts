// ==UserScript==
// @name         imgur-image-link-copier
// @namespace    imgurImageLinkCopier
// @version      3.3.1
// @author       roflsunriz
// @description  Copy image link from Imgur with TypeScript.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.meta.js
// @match        https://imgur.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i},i={mediaWrapper:`.PostContent-imageWrapper`},a=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|gifv|mp4|webm|webp|avif)$/i;function o(){let e=document.querySelectorAll(i.mediaWrapper),t=[];return e.forEach(e=>{let n=e.querySelector(`img`),r=e.querySelector(`video source`),i=(n&&n instanceof HTMLImageElement?n.src:void 0)??(r&&r instanceof HTMLSourceElement?r.src:void 0);i&&a.test(i)&&(i.endsWith(`.gifv`)&&(i=i.replace(/\.gifv$/,`.mp4`)),t.push({url:i,wrapper:e}))}),t}function s(){document.querySelectorAll(`[id^="imgurCopyButton-container"]`).forEach(e=>e.remove())}var c=new Set([`ar`,`ur`]);function l(e){return c.has(e)?`rtl`:`ltr`}function u(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function d(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>u(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>l(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var f=d({translations:{ja:{copy:`コピー`,copyDirectLink:`ダイレクトリンクをコピー`,notDirectLink:`直接リンクではありません（i.imgur.comのみ許可）`,copySuccess:`メディア{index}のリンクをコピー:
{url}`,copyFailed:`クリップボードへのコピーに失敗しました`},en:{copy:`Copy`,copyDirectLink:`Copy direct link`,notDirectLink:`This is not a direct link. Only i.imgur.com is allowed.`,copySuccess:`Copied media {index} link:
{url}`,copyFailed:`Failed to copy to clipboard.`},"zh-Hans":{copy:`复制`,copyDirectLink:`复制直链`,notDirectLink:`这不是直链。仅允许 i.imgur.com。`,copySuccess:`已复制媒体 {index} 链接:
{url}`,copyFailed:`复制到剪贴板失败。`},hi:{copy:`कॉपी`,copyDirectLink:`डायरेक्ट लिंक कॉपी करें`,notDirectLink:`यह डायरेक्ट लिंक नहीं है। केवल i.imgur.com की अनुमति है।`,copySuccess:`मीडिया {index} लिंक कॉपी किया गया:
{url}`,copyFailed:`क्लिपबोर्ड पर कॉपी नहीं हो सका।`},es:{copy:`Copiar`,copyDirectLink:`Copiar enlace directo`,notDirectLink:`No es un enlace directo. Solo se permite i.imgur.com.`,copySuccess:`Enlace del medio {index} copiado:
{url}`,copyFailed:`No se pudo copiar al portapapeles.`},fr:{copy:`Copier`,copyDirectLink:`Copier le lien direct`,notDirectLink:`Ce n'est pas un lien direct. Seul i.imgur.com est autorise.`,copySuccess:`Lien du media {index} copie:
{url}`,copyFailed:`Echec de la copie dans le presse-papiers.`},ar:{copy:`نسخ`,copyDirectLink:`نسخ الرابط المباشر`,notDirectLink:`هذا ليس رابطا مباشرا. يسمح فقط بـ i.imgur.com.`,copySuccess:`تم نسخ رابط الوسائط {index}:
{url}`,copyFailed:`فشل النسخ إلى الحافظة.`},pt:{copy:`Copiar`,copyDirectLink:`Copiar link direto`,notDirectLink:`Este nao e um link direto. Apenas i.imgur.com e permitido.`,copySuccess:`Link da midia {index} copiado:
{url}`,copyFailed:`Falha ao copiar para a area de transferencia.`},bn:{copy:`কপি`,copyDirectLink:`সরাসরি লিঙ্ক কপি করুন`,notDirectLink:`এটি সরাসরি লিঙ্ক নয়। শুধু i.imgur.com অনুমোদিত।`,copySuccess:`মিডিয়া {index} লিঙ্ক কপি হয়েছে:
{url}`,copyFailed:`ক্লিপবোর্ডে কপি করা যায়নি।`},ru:{copy:`Копировать`,copyDirectLink:`Копировать прямую ссылку`,notDirectLink:`Это не прямая ссылка. Разрешен только i.imgur.com.`,copySuccess:`Ссылка на медиа {index} скопирована:
{url}`,copyFailed:`Не удалось скопировать в буфер обмена.`},ur:{copy:`کاپی`,copyDirectLink:`براہ راست لنک کاپی کریں`,notDirectLink:`یہ براہ راست لنک نہیں ہے۔ صرف i.imgur.com کی اجازت ہے۔`,copySuccess:`میڈیا {index} کا لنک کاپی ہو گیا:
{url}`,copyFailed:`کلپ بورڈ میں کاپی نہیں ہو سکا۔`}},defaultLocale:`ja`,fallbackLocale:`en`,aliases:{zh:`zh-Hans`,"zh-cn":`zh-Hans`,"zh-sg":`zh-Hans`}});f.setLocale(f.detectBrowserLocale());var p=f.t,m=f.format,h=f.getDirection,g=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|mp4|webm|webp|avif)$/i;function _(e,t=!0){let n=document.createElement(`div`);n.textContent=e,n.dir=h(),n.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${t?`#4CAF50`:`#f44336`};
    color: white;
    padding: 16px;
    white-space: pre-wrap;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
    opacity: 1;
  `,document.body.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,setTimeout(()=>n.remove(),500)},3e3)}function v(e,t,n){if(!g.test(t))return;(!n.style.position||n.style.position===``)&&(n.style.position=`relative`);let i=document.createElement(`div`);i.id=`imgurCopyButton-container-${e}`,i.dataset.imgurDirectLinkButtonContainer=`true`;let a=i.attachShadow({mode:`open`}),o=document.createElement(`style`);o.textContent=`
    :host {
      position: absolute;
      top: 60px;
      right: 15px;
      z-index: 2147483647;
      /* ホバーでのガクガクを防ぐ: 常時配置して opacity だけ切替 */
      opacity: 0.1;
      transition: opacity 120ms ease;
      pointer-events: none; /* コンテナはイベントを拾わない */
    }
    .btn {
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 6px;
      background: rgba(0,0,0,0.65);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      cursor: pointer;
      pointer-events: auto; /* ボタンのみクリック可能 */
      user-select: none;
      transition: transform 60ms ease-out, filter 60ms ease-out, box-shadow 60ms ease-out;
      position: relative;
      overflow: hidden;
    }
    .btn .particle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ffd700;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    .btn.explode .particle {
      animation: explode-particles 400ms ease-out;
    }
    @keyframes explode-particles {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      20% { transform: translate(-50%, -50%) scale(1); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    .btn.explode .particle:nth-child(1) { animation: explode-particles 400ms ease-out, p1 400ms ease-out; } @keyframes p1 { to { transform: translate(30px, -30px); } }
    .btn.explode .particle:nth-child(2) { animation: explode-particles 400ms ease-out, p2 400ms ease-out; } @keyframes p2 { to { transform: translate(-25px, 28px); } }
    .btn.explode .particle:nth-child(3) { animation: explode-particles 400ms ease-out, p3 400ms ease-out; } @keyframes p3 { to { transform: translate(28px, 25px); } }
    .btn.explode .particle:nth-child(4) { animation: explode-particles 400ms ease-out, p4 400ms ease-out; } @keyframes p4 { to { transform: translate(-22px, -22px); } }
    .btn.explode .particle:nth-child(5) { animation: explode-particles 400ms ease-out, p5 400ms ease-out; } @keyframes p5 { to { transform: translate(25px, 0px); } }
    .btn.explode .particle:nth-child(6) { animation: explode-particles 400ms ease-out, p6 400ms ease-out; } @keyframes p6 { to { transform: translate(-25px, 0px); } }
    .btn.explode .particle:nth-child(7) { animation: explode-particles 400ms ease-out, p7 400ms ease-out; } @keyframes p7 { to { transform: translate(0, 25px); } }
    .btn.explode .particle:nth-child(8) { animation: explode-particles 400ms ease-out, p8 400ms ease-out; } @keyframes p8 { to { transform: translate(0, -25px); } }
    .btn.explode .particle:nth-child(9) { animation: explode-particles 400ms ease-out, p9 400ms ease-out; } @keyframes p9 { to { transform: translate(20px, 15px); } }
    .btn.explode .particle:nth-child(10) { animation: explode-particles 400ms ease-out, p10 400ms ease-out; } @keyframes p10 { to { transform: translate(-15px, -20px); } }
    .btn:hover { filter: brightness(1.12); }
    .btn:active {
      transform: translateY(1px);
      filter: brightness(0.9);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
    }
    .btn[disabled] {
      opacity: .5;
      cursor: not-allowed;
    }
  `;let s=document.createElement(`button`);s.className=`btn`,s.dir=h(),s.textContent=p(`copy`),s.title=p(`copyDirectLink`);for(let e=0;e<10;e++){let e=document.createElement(`span`);e.className=`particle`,s.appendChild(e)}let c=n=>{if(n.preventDefault(),n.stopPropagation(),!g.test(t)){_(p(`notDirectLink`),!1),s.setAttribute(`disabled`,`true`);return}s.classList.add(`explode`),s.addEventListener(`animationend`,()=>{s.classList.remove(`explode`)},{once:!0}),navigator.clipboard.writeText(t).then(()=>_(m(`copySuccess`,{index:e+1,url:t}))).catch(e=>{r(`ImgurDirectLinkCopier`).error(`クリップボードへのコピーに失敗: `,e),_(p(`copyFailed`),!1)})};s.addEventListener(`pointerdown`,c,{passive:!1}),s.addEventListener(`click`,c),a.append(o,s),n.appendChild(i);let l=null,u=e=>{e?(l&&=(clearTimeout(l),null),i.style.opacity=`1`):l=window.setTimeout(()=>{i.style.opacity=`0.1`},120)};n.addEventListener(`mouseenter`,()=>u(!0),{passive:!0}),n.addEventListener(`mouseleave`,()=>u(!1),{passive:!0}),i.addEventListener(`mouseenter`,()=>u(!0),{passive:!0}),i.addEventListener(`mouseleave`,()=>u(!1),{passive:!0})}var y=class{lastUrl=location.href;observer=null;logger;debounceTimer=null;constructor(){this.logger=r(`ImgurDirectLinkCopier`)}start(){this.observer=new MutationObserver(()=>this.debouncedUpdate()),this.observer.observe(document.body,{childList:!0,subtree:!0}),this.update(),this.logger.info(`Application started and observer is running.`)}stop(){this.observer?.disconnect(),s(),this.logger.info(`Application stopped and observer is disconnected.`)}debouncedUpdate(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.update(),300)}update(){let e=o();if(e.length===0){s();return}let t=new Set(e.map((e,t)=>`imgurCopyButton-container-${t}`));document.querySelectorAll(`[data-imgur-direct-link-button-container]`).forEach(e=>{t.has(e.id)||e.remove()}),e.forEach((e,t)=>{e.wrapper.querySelector(`#imgurCopyButton-container-${t}`)||v(t,e.url,e.wrapper)})}};function b(){let e=r(`ImgurDirectLinkCopier`);e.info(`Userscript bootstrapping...`),new y().start(),e.info(`Bootstrap complete.`)}b()})();
