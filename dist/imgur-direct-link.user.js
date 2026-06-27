// ==UserScript==
// @name         imgur-image-link-copier
// @namespace    imgurImageLinkCopier
// @version      3.3.0
// @author       roflsunriz
// @description  Copy image link from Imgur with TypeScript.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.meta.js
// @match        https://imgur.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';

  const x={debug:"debug",info:"info",warn:"warn",error:"error"},b={debug:10,info:20,warn:30,error:40};let D=e=>b[e]>=b.warn;const h=e=>{const i=`[${e}]`,t={};return Object.keys(x).forEach(o=>{const a=x[o];t[o]=(...c)=>{if(!D(o))return;(console[a]??console.log)(i,...c);};}),t},w={mediaWrapper:".PostContent-imageWrapper"},E=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|gifv|mp4|webm|webp|avif)$/i;function T(){const e=document.querySelectorAll(w.mediaWrapper),i=[];return e.forEach(t=>{const o=t.querySelector("img"),a=t.querySelector("video source");let c=(o&&o instanceof HTMLImageElement?o.src:void 0)??(a&&a instanceof HTMLSourceElement?a.src:void 0);c&&E.test(c)&&(c.endsWith(".gifv")&&(c=c.replace(/\.gifv$/,".mp4")),i.push({url:c,wrapper:t}));}),i}function L(){document.querySelectorAll('[id^="imgurCopyButton-container"]').forEach(e=>e.remove());}const S=new Set(["ar","ur"]);function F(e){return S.has(e)?"rtl":"ltr"}function z(e,i){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(t,o)=>{const a=i[o];return a===void 0?t:String(a)})}function A(e){const i=Object.keys(e.translations);let t=e.defaultLocale;const o=n=>{const r=n.toLowerCase(),s=e.aliases?.[r];if(s)return s;const u=i.find(g=>g.toLowerCase()===r);if(u)return u;const C=r.split("-")[0];return i.find(g=>g.toLowerCase().split("-")[0]===C)??null},a=()=>{const n=navigator.languages.length>0?navigator.languages:[navigator.language];for(const r of n){const s=o(r);if(s)return s}return e.fallbackLocale},c=n=>{const r=e.translations[t]?.[n];if(r)return r;const s=e.translations[e.fallbackLocale]?.[n];return s||(e.translations[e.defaultLocale]?.[n]??n)};return {locales:i,getLocale:()=>t,setLocale:n=>{t=n;},detectBrowserLocale:a,t:c,format:(n,r)=>z(c(n),r),getTranslations:(n=t)=>e.translations[n]??e.translations[e.fallbackLocale],getDirection:(n=t)=>F(n),getMissingTranslationKeys:n=>{const r=e.translations[e.fallbackLocale],s=e.translations[n];return Object.keys(r).filter(u=>!s[u])}}}const B={ja:{copy:"コピー",copyDirectLink:"ダイレクトリンクをコピー",notDirectLink:"直接リンクではありません（i.imgur.comのみ許可）",copySuccess:`メディア{index}のリンクをコピー:
{url}`,copyFailed:"クリップボードへのコピーに失敗しました"},en:{copy:"Copy",copyDirectLink:"Copy direct link",notDirectLink:"This is not a direct link. Only i.imgur.com is allowed.",copySuccess:`Copied media {index} link:
{url}`,copyFailed:"Failed to copy to clipboard."},"zh-Hans":{copy:"复制",copyDirectLink:"复制直链",notDirectLink:"这不是直链。仅允许 i.imgur.com。",copySuccess:`已复制媒体 {index} 链接:
{url}`,copyFailed:"复制到剪贴板失败。"},hi:{copy:"कॉपी",copyDirectLink:"डायरेक्ट लिंक कॉपी करें",notDirectLink:"यह डायरेक्ट लिंक नहीं है। केवल i.imgur.com की अनुमति है।",copySuccess:`मीडिया {index} लिंक कॉपी किया गया:
{url}`,copyFailed:"क्लिपबोर्ड पर कॉपी नहीं हो सका।"},es:{copy:"Copiar",copyDirectLink:"Copiar enlace directo",notDirectLink:"No es un enlace directo. Solo se permite i.imgur.com.",copySuccess:`Enlace del medio {index} copiado:
{url}`,copyFailed:"No se pudo copiar al portapapeles."},fr:{copy:"Copier",copyDirectLink:"Copier le lien direct",notDirectLink:"Ce n'est pas un lien direct. Seul i.imgur.com est autorise.",copySuccess:`Lien du media {index} copie:
{url}`,copyFailed:"Echec de la copie dans le presse-papiers."},ar:{copy:"نسخ",copyDirectLink:"نسخ الرابط المباشر",notDirectLink:"هذا ليس رابطا مباشرا. يسمح فقط بـ i.imgur.com.",copySuccess:`تم نسخ رابط الوسائط {index}:
{url}`,copyFailed:"فشل النسخ إلى الحافظة."},pt:{copy:"Copiar",copyDirectLink:"Copiar link direto",notDirectLink:"Este nao e um link direto. Apenas i.imgur.com e permitido.",copySuccess:`Link da midia {index} copiado:
{url}`,copyFailed:"Falha ao copiar para a area de transferencia."},bn:{copy:"কপি",copyDirectLink:"সরাসরি লিঙ্ক কপি করুন",notDirectLink:"এটি সরাসরি লিঙ্ক নয়। শুধু i.imgur.com অনুমোদিত।",copySuccess:`মিডিয়া {index} লিঙ্ক কপি হয়েছে:
{url}`,copyFailed:"ক্লিপবোর্ডে কপি করা যায়নি।"},ru:{copy:"Копировать",copyDirectLink:"Копировать прямую ссылку",notDirectLink:"Это не прямая ссылка. Разрешен только i.imgur.com.",copySuccess:`Ссылка на медиа {index} скопирована:
{url}`,copyFailed:"Не удалось скопировать в буфер обмена."},ur:{copy:"کاپی",copyDirectLink:"براہ راست لنک کاپی کریں",notDirectLink:"یہ براہ راست لنک نہیں ہے۔ صرف i.imgur.com کی اجازت ہے۔",copySuccess:`میڈیا {index} کا لنک کاپی ہو گیا:
{url}`,copyFailed:"کلپ بورڈ میں کاپی نہیں ہو سکا۔"}},d=A({translations:B,defaultLocale:"ja",fallbackLocale:"en",aliases:{zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans"}});d.setLocale(d.detectBrowserLocale());const m=d.t,M=d.format,v=d.getDirection,k=/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|mp4|webm|webp|avif)$/i;function y(e,i=true){const t=document.createElement("div");t.textContent=e,t.dir=v(),t.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${i?"#4CAF50":"#f44336"};
    color: white;
    padding: 16px;
    white-space: pre-wrap;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
    opacity: 1;
  `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),500);},3e3);}function I(e,i,t){if(!k.test(i))return;(!t.style.position||t.style.position==="")&&(t.style.position="relative");const o=document.createElement("div");o.id=`imgurCopyButton-container-${e}`,o.dataset.imgurDirectLinkButtonContainer="true";const a=o.attachShadow({mode:"open"}),c=document.createElement("style");c.textContent=`
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
  `;const l=document.createElement("button");l.className="btn",l.dir=v(),l.textContent=m("copy"),l.title=m("copyDirectLink");for(let r=0;r<10;r++){const s=document.createElement("span");s.className="particle",l.appendChild(s);}const f=r=>{if(r.preventDefault(),r.stopPropagation(),!k.test(i)){y(m("notDirectLink"),false),l.setAttribute("disabled","true");return}l.classList.add("explode"),l.addEventListener("animationend",()=>{l.classList.remove("explode");},{once:true}),navigator.clipboard.writeText(i).then(()=>y(M("copySuccess",{index:e+1,url:i}))).catch(s=>{h("ImgurDirectLinkCopier").error("クリップボードへのコピーに失敗: ",s),y(m("copyFailed"),false);});};l.addEventListener("pointerdown",f,{passive:false}),l.addEventListener("click",f),a.append(c,l),t.appendChild(o);let p=null;const n=r=>{r?(p&&(clearTimeout(p),p=null),o.style.opacity="1"):p=window.setTimeout(()=>{o.style.opacity="0.1";},120);};t.addEventListener("mouseenter",()=>n(true),{passive:true}),t.addEventListener("mouseleave",()=>n(false),{passive:true}),o.addEventListener("mouseenter",()=>n(true),{passive:true}),o.addEventListener("mouseleave",()=>n(false),{passive:true});}class R{lastUrl=location.href;observer=null;logger;debounceTimer=null;constructor(){this.logger=h("ImgurDirectLinkCopier");}start(){this.observer=new MutationObserver(()=>this.debouncedUpdate()),this.observer.observe(document.body,{childList:true,subtree:true}),this.update(),this.logger.info("Application started and observer is running.");}stop(){this.observer?.disconnect(),L(),this.logger.info("Application stopped and observer is disconnected.");}debouncedUpdate(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>this.update(),300);}update(){const i=T();if(i.length===0){L();return}const t=new Set(i.map((o,a)=>`imgurCopyButton-container-${a}`));document.querySelectorAll("[data-imgur-direct-link-button-container]").forEach(o=>{t.has(o.id)||o.remove();}),i.forEach((o,a)=>{o.wrapper.querySelector(`#imgurCopyButton-container-${a}`)||I(a,o.url,o.wrapper);});}}function $(){const e=h("ImgurDirectLinkCopier");e.info("Userscript bootstrapping..."),new R().start(),e.info("Bootstrap complete.");}$();

})();