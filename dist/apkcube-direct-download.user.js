// ==UserScript==
// @name         apkcube-direct-download
// @namespace    apkcubeDirectDownload
// @version      1.1.0
// @author       roflsunriz
// @description  Google Playのアプリページから端末不要でAPK/APKSの取得とバリアント選択へ進む
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apkcube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/apkcube-direct-download.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/apkcube-direct-download.meta.js
// @match        https://apkcube.com/*
// @match        https://play.google.com/store/apps/details*
// @sandbox      raw
// @grant        none
// @inject-into  page
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";var e=`apkcube-direct-download`,t=[`adbpage.com`,`adexchangerapid.com`,`skecaaztypvqr.space`,`usrpubtrk.com`],n=[`/loader.js`],r=`ad-banner`,i=[`adsbox`,`ad-banner`,`ads`,`ad-placement`,`pub_300x250`,`sponsored-ad`],a=[`iframe[src*="adbpage.com"]`,`iframe[src*="adexchangerapid.com"]`,`iframe[src*="skecaaztypvqr.space"]`,`iframe[src*="usrpubtrk.com"]`,`iframe[src*="doubleclick.net"]`,`iframe[src*="googlesyndication.com"]`,`ins.adsbygoogle`,`a[href*="adexchangerapid.com"]`,`a[href*="skecaaztypvqr.space"]`];function o(e){try{return new URL(e,`https://apkcube.com`).pathname===`/ads/banner-ad.js`}catch{return!1}}function s(e){let n=``;try{n=new URL(e,`https://apkcube.com`).hostname.toLowerCase()}catch{return!1}return t.some(e=>n===e||n.endsWith(`.${e}`))}function c(e){return e?n.some(t=>e.includes(t)):!1}function l(e){let t=e.split(`/`).filter(e=>e.length>0);return t.length===3&&t[2]===`download`}function u(e){if(typeof e!=`object`||!e)return!1;let t=e;if(t.id!==`ad-banner`)return!1;let n=t.classList;if(typeof n!=`object`||!n)return!1;let r=n.contains;if(typeof r!=`function`)return!1;let a=r;return i.some(e=>a.call(n,e)===!0)}var d=10,f=10;function p(){let t=window;return!t[`apkcube-direct-download`]&&(t[e]=!0,!0)}function m(){return new Response(`/* ${e}: decoy for ad-blocker detection */\nwindow.__ad_probe_ok__ = true;`,{status:200,headers:{"content-type":`text/javascript`}})}function h(e){return typeof e==`string`?e:e instanceof URL?e.href:e.url}function g(){let e=window.fetch.bind(window);window.fetch=((t,n)=>{let r=h(t);return o(r)?Promise.resolve(m()):s(r)?Promise.resolve(new Response(``,{status:204})):e(t,n)})}function _(){let e=XMLHttpRequest.prototype.open;if(XMLHttpRequest.prototype.open=function(t,n,r=!0,i=null,a=null){let o=s(n instanceof URL?n.href:n)?`data:text/plain,`:n;Reflect.apply(e,this,[t,o,r,i,a])},typeof navigator.sendBeacon==`function`){let e=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=(t,n)=>!s(t instanceof URL?t.href:t)&&e(t,n)}}function v(){let e=window.open.bind(window);window.open=((t,n,r)=>{if(t==null)return null;let i=String(t);return i===``||s(i)?null:e(t,n,r)})}function y(e){e.style.setProperty(`position`,`absolute`,`important`),e.style.setProperty(`left`,`-9999px`,`important`),e.style.setProperty(`top`,`0`,`important`),e.style.setProperty(`width`,`${d}px`,`important`),e.style.setProperty(`height`,`${f}px`,`important`),e.style.setProperty(`display`,`block`,`important`),e.style.setProperty(`visibility`,`visible`,`important`),e.style.setProperty(`opacity`,`1`,`important`),e.style.setProperty(`pointer-events`,`none`,`important`)}function b(e){for(let t of Array.from(e)){for(let e of Array.from(t.removedNodes))e instanceof HTMLElement&&e.id===`ad-banner`&&document.body&&!e.isConnected&&(y(e),document.body.append(e));for(let e of Array.from(t.addedNodes))if(e instanceof HTMLElement){u(e)&&y(e);for(let t of Array.from(e.querySelectorAll(`#${r}`)))u(t)&&y(t)}}}function x(){let e=window.getComputedStyle.bind(window);window.getComputedStyle=((t,n)=>{let r=e(t,n??void 0);return!(t instanceof HTMLElement)||t.id!==`ad-banner`||n!=null&&n!==``?r:new Proxy(r,{get(e,t){if(t===`display`)return`block`;if(t===`visibility`)return`visible`;if(t===`opacity`)return`1`;if(t===`getPropertyValue`)return t=>t===`display`?`block`:t===`visibility`?`visible`:t===`opacity`?`1`:e.getPropertyValue(t);let n=Reflect.get(e,t,e);return typeof n==`function`?n.bind(e):n}})});let t=Object.getOwnPropertyDescriptor(HTMLElement.prototype,`offsetHeight`),n=Object.getOwnPropertyDescriptor(HTMLElement.prototype,`offsetWidth`),r=t?.get,i=n?.get;typeof r==`function`&&Object.defineProperty(HTMLElement.prototype,"offsetHeight",{configurable:!0,get(){return this.id===`ad-banner`?f:r.call(this)}}),typeof i==`function`&&Object.defineProperty(HTMLElement.prototype,"offsetWidth",{configurable:!0,get(){return this.id===`ad-banner`?d:i.call(this)}})}function S(){if(l(window.location.pathname)){try{Object.defineProperty(document,"hidden",{value:!1,configurable:!0})}catch{}try{Object.defineProperty(document,"visibilityState",{value:`visible`,configurable:!0})}catch{}try{document.hasFocus=()=>!0}catch{}}}function C(e){for(let t of Array.from(e.querySelectorAll(`script[src]`)))c(t.getAttribute(`src`))&&t.remove()}function w(){document.documentElement&&(C(document),new MutationObserver(e=>{b(e);for(let t of Array.from(e))for(let e of Array.from(t.addedNodes))e instanceof HTMLElement&&C(e)}).observe(document.documentElement,{childList:!0,subtree:!0}))}function T(){let t=`${e}-styles`;if(document.getElementById(t))return;let n=document.createElement(`style`);n.id=t,n.textContent=`${a.join(`,
`)} {
      display: none !important;
    }`,(document.head??document.documentElement).append(n)}function E(){p()&&(g(),_(),v(),x(),S(),document.documentElement?(T(),w()):document.addEventListener(`DOMContentLoaded`,()=>{T(),w()},{once:!0}))}var D={ja:{title:`APK / APKS を取得`,description:`端末不要。CPU・Android・DPIなども選べます。`,recommended:`推奨構成を取得`,recommendedHint:`64-bit ARM・標準言語・全DPI`,universal:`Universal APKS`,universalHint:`32/64-bit ARM・全言語・全DPI`,variants:`端末・Android・CPU・DPIを指定`,providerNotice:`第三者配布元 APKCube を新しいタブで開きます。`,collapse:`APKダウンロードパネルを折りたたむ`,expand:`APKダウンロードパネルを開く`},en:{title:`Get APK / APKS`,description:`No device required. Choose CPU, Android and DPI.`,recommended:`Get recommended build`,recommendedHint:`64-bit ARM, standard languages, all DPI`,universal:`Universal APKS`,universalHint:`32/64-bit ARM, every language, all DPI`,variants:`Choose device, Android, CPU and DPI`,providerNotice:`Opens third-party provider APKCube in a new tab.`,collapse:`Collapse APK download panel`,expand:`Open APK download panel`},zh:{title:`获取 APK / APKS`,description:`无需设备，可选择 CPU、Android 和 DPI。`,recommended:`获取推荐版本`,recommendedHint:`64 位 ARM、常用语言、全部 DPI`,universal:`通用 APKS`,universalHint:`32/64 位 ARM、全部语言、全部 DPI`,variants:`选择设备、Android、CPU 和 DPI`,providerNotice:`将在新标签页打开第三方来源 APKCube。`,collapse:`收起 APK 下载面板`,expand:`打开 APK 下载面板`},hi:{title:`APK / APKS पाएँ`,description:`डिवाइस की ज़रूरत नहीं। CPU, Android और DPI चुनें।`,recommended:`सुझाया बिल्ड पाएँ`,recommendedHint:`64-bit ARM, मानक भाषाएँ, सभी DPI`,universal:`यूनिवर्सल APKS`,universalHint:`32/64-bit ARM, सभी भाषाएँ, सभी DPI`,variants:`डिवाइस, Android, CPU और DPI चुनें`,providerNotice:`तीसरे पक्ष APKCube को नए टैब में खोलता है।`,collapse:`APK डाउनलोड पैनल समेटें`,expand:`APK डाउनलोड पैनल खोलें`},es:{title:`Obtener APK / APKS`,description:`Sin dispositivo. Elige CPU, Android y DPI.`,recommended:`Obtener versión recomendada`,recommendedHint:`ARM de 64 bits, idiomas comunes, todos los DPI`,universal:`APKS universal`,universalHint:`ARM de 32/64 bits, todos los idiomas y DPI`,variants:`Elegir dispositivo, Android, CPU y DPI`,providerNotice:`Abre el proveedor externo APKCube en otra pestaña.`,collapse:`Contraer el panel de descarga APK`,expand:`Abrir el panel de descarga APK`},fr:{title:`Obtenir l’APK / APKS`,description:`Sans appareil. Choisissez CPU, Android et DPI.`,recommended:`Obtenir la version conseillée`,recommendedHint:`ARM 64 bits, langues courantes, tous les DPI`,universal:`APKS universel`,universalHint:`ARM 32/64 bits, toutes langues et tous DPI`,variants:`Choisir appareil, Android, CPU et DPI`,providerNotice:`Ouvre le fournisseur tiers APKCube dans un nouvel onglet.`,collapse:`Réduire le panneau de téléchargement APK`,expand:`Ouvrir le panneau de téléchargement APK`},ar:{title:`تنزيل APK / APKS`,description:`لا يلزم جهاز. اختر CPU وإصدار Android وDPI.`,recommended:`تنزيل الإصدار المقترح`,recommendedHint:`ARM ‏64 بت، اللغات الشائعة، كل DPI`,universal:`APKS شامل`,universalHint:`ARM ‏32/64 بت، كل اللغات وكل DPI`,variants:`اختيار الجهاز وAndroid وCPU وDPI`,providerNotice:`يفتح المزوّد الخارجي APKCube في علامة تبويب جديدة.`,collapse:`طي لوحة تنزيل APK`,expand:`فتح لوحة تنزيل APK`},pt:{title:`Obter APK / APKS`,description:`Sem dispositivo. Escolha CPU, Android e DPI.`,recommended:`Obter versão recomendada`,recommendedHint:`ARM 64 bits, idiomas comuns, todos os DPI`,universal:`APKS universal`,universalHint:`ARM 32/64 bits, todos os idiomas e DPI`,variants:`Escolher dispositivo, Android, CPU e DPI`,providerNotice:`Abre o provedor externo APKCube em nova aba.`,collapse:`Recolher painel de download de APK`,expand:`Abrir painel de download de APK`},bn:{title:`APK / APKS নিন`,description:`ডিভাইস লাগবে না। CPU, Android ও DPI বেছে নিন।`,recommended:`প্রস্তাবিত বিল্ড নিন`,recommendedHint:`64-bit ARM, সাধারণ ভাষা, সব DPI`,universal:`ইউনিভার্সাল APKS`,universalHint:`32/64-bit ARM, সব ভাষা ও সব DPI`,variants:`ডিভাইস, Android, CPU ও DPI বেছে নিন`,providerNotice:`তৃতীয় পক্ষ APKCube নতুন ট্যাবে খুলবে।`,collapse:`APK ডাউনলোড প্যানেল গুটান`,expand:`APK ডাউনলোড প্যানেল খুলুন`},ru:{title:`Получить APK / APKS`,description:`Устройство не нужно. Выберите CPU, Android и DPI.`,recommended:`Получить рекомендуемую сборку`,recommendedHint:`64-бит ARM, основные языки, все DPI`,universal:`Универсальный APKS`,universalHint:`32/64-бит ARM, все языки и DPI`,variants:`Выбрать устройство, Android, CPU и DPI`,providerNotice:`Откроет сторонний сервис APKCube в новой вкладке.`,collapse:`Свернуть панель загрузки APK`,expand:`Открыть панель загрузки APK`},ur:{title:`APK / APKS حاصل کریں`,description:`ڈیوائس درکار نہیں۔ CPU، Android اور DPI منتخب کریں۔`,recommended:`تجویز کردہ بلڈ حاصل کریں`,recommendedHint:`64-bit ARM، عام زبانیں، تمام DPI`,universal:`یونیورسل APKS`,universalHint:`32/64-bit ARM، تمام زبانیں اور DPI`,variants:`ڈیوائس، Android، CPU اور DPI منتخب کریں`,providerNotice:`تیسرے فریق APKCube کو نئے ٹیب میں کھولتا ہے۔`,collapse:`APK ڈاؤن لوڈ پینل سمیٹیں`,expand:`APK ڈاؤن لوڈ پینل کھولیں`}},O=new Set([`ar`,`ur`]);function k(e){let t=e.toLowerCase().split(`-`)[0]??``;return t in D?t:`en`}function A(e){return O.has(e)}var j=`https://apkcube.com`,M=/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;function N(e){return e.length<=255&&M.test(e)}function P(e){let t;try{t=e instanceof URL?e:new URL(e)}catch{return null}if(t.hostname!==`play.google.com`||t.pathname!==`/store/apps/details`)return null;let n=t.searchParams.get(`id`)?.trim()??``;return N(n)?n:null}function F(e,t){if(!N(e))throw Error(`Invalid Android package name: ${e}`);let n=new URL(`/apk-downloader`,j);return n.searchParams.set(`url`,e),t===`universal`&&(n.searchParams.set(`arch`,`universal`),n.searchParams.set(`langs`,`all`)),t===`variants`&&(n.hash=`download-options`),n.href}var I=`apkcube-google-play-download`,L=750;function R(e,t,n,r,i){let a=document.createElement(`a`);if(a.className=i,a.href=F(e,t),a.target=`_blank`,a.rel=`noopener noreferrer nofollow`,a.textContent=n,r){let e=document.createElement(`span`);e.textContent=r,a.append(e)}return a}function z(e){let t=k(navigator.language),n=D[t],r=document.createElement(`aside`);r.id=I,r.setAttribute(`data-package-name`,e),r.setAttribute(`dir`,A(t)?`rtl`:`ltr`);let i=r.attachShadow({mode:`open`}),a=document.createElement(`style`);a.textContent=`
    :host { color-scheme: light dark; font-family: Arial, "Noto Sans", sans-serif; }
    *, *::before, *::after { box-sizing: border-box; }
    .panel {
      position: fixed;
      z-index: 2147483646;
      inset-inline-end: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      width: min(370px, calc(100vw - 32px));
      border: 1px solid rgb(128 128 128 / 35%);
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      border-radius: 18px;
      padding: 16px;
      color: CanvasText;
      background: Canvas;
      background: color-mix(in srgb, Canvas 96%, transparent);
      box-shadow: 0 10px 35px rgb(0 0 0 / 24%);
      backdrop-filter: blur(12px);
    }
    .header { display: flex; align-items: flex-start; gap: 10px; }
    .heading { flex: 1; min-width: 0; }
    h2 { margin: 0; font-size: 17px; line-height: 1.3; }
    .description { margin: 5px 0 0; font-size: 12px; line-height: 1.5; opacity: .76; }
    .collapse {
      flex: 0 0 auto; width: 34px; height: 34px; border: 0; border-radius: 50%;
      color: inherit; background: rgb(128 128 128 / 14%);
      background: color-mix(in srgb, CanvasText 8%, transparent);
      cursor: pointer; font-size: 20px; line-height: 1;
    }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
    a { text-decoration: none; }
    .action {
      display: flex; min-height: 58px; flex-direction: column; align-items: flex-start;
      justify-content: center; border-radius: 13px; padding: 10px 12px;
      font-size: 13px; font-weight: 700; line-height: 1.3;
    }
    .action span { margin-top: 3px; font-size: 10px; font-weight: 400; opacity: .8; }
    .primary { color: #fff; background: #01875f; }
    .secondary {
      color: CanvasText; border: 1px solid rgb(128 128 128 / 35%);
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      background: rgb(128 128 128 / 12%);
      background: color-mix(in srgb, CanvasText 6%, transparent);
    }
    .variants { display: inline-block; margin-top: 11px; color: #087f5b; font-size: 12px; font-weight: 700; }
    .notice { margin: 8px 0 0; font-size: 10px; line-height: 1.4; opacity: .62; }
    .launcher {
      display: none; position: fixed; z-index: 2147483646;
      inset-inline-end: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      min-width: 64px; height: 48px; border: 0; border-radius: 24px;
      padding: 0 17px; color: #fff; background: #01875f;
      box-shadow: 0 6px 22px rgb(0 0 0 / 28%); cursor: pointer;
      font-size: 14px; font-weight: 800;
    }
    :host([data-collapsed="true"]) .panel { display: none; }
    :host([data-collapsed="true"]) .launcher { display: block; }
    a:focus-visible, button:focus-visible { outline: 3px solid #4285f4; outline-offset: 3px; }
    @media (max-width: 520px) {
      .panel {
        inset-inline: 10px; bottom: max(10px, env(safe-area-inset-bottom));
        width: auto; max-height: calc(100dvh - 20px); overflow: auto;
        border-radius: 16px; padding: 14px;
      }
      .actions { grid-template-columns: 1fr; }
      .action { min-height: 50px; }
      .launcher { inset-inline-end: 10px; bottom: max(10px, env(safe-area-inset-bottom)); }
    }
    @media (prefers-reduced-motion: no-preference) {
      .action, .collapse, .launcher { transition: transform 120ms ease, filter 120ms ease; }
      .action:hover, .collapse:hover, .launcher:hover { filter: brightness(1.06); }
      .action:active, .collapse:active, .launcher:active { transform: translateY(1px); }
    }
  `;let o=document.createElement(`section`);o.className=`panel`;let s=document.createElement(`div`);s.className=`header`;let c=document.createElement(`div`);c.className=`heading`;let l=document.createElement(`h2`);l.textContent=n.title,l.id=`${I}-title`;let u=document.createElement(`p`);u.className=`description`,u.textContent=n.description,c.append(l,u);let d=document.createElement(`button`);d.className=`collapse`,d.type=`button`,d.setAttribute(`aria-label`,n.collapse),d.textContent=`×`,d.addEventListener(`click`,()=>{r.setAttribute(`data-collapsed`,`true`),h.focus()}),s.append(c,d);let f=document.createElement(`div`);f.className=`actions`,f.append(R(e,`recommended`,n.recommended,n.recommendedHint,`action primary`),R(e,`universal`,n.universal,n.universalHint,`action secondary`));let p=R(e,`variants`,n.variants,null,`variants`),m=document.createElement(`p`);m.className=`notice`,m.textContent=n.providerNotice,o.append(s,f,p,m),o.setAttribute(`aria-labelledby`,l.id);let h=document.createElement(`button`);return h.className=`launcher`,h.type=`button`,h.setAttribute(`aria-label`,n.expand),h.textContent=`APK`,h.addEventListener(`click`,()=>{r.removeAttribute(`data-collapsed`),d.focus()}),i.append(a,o,h),r}function B(){let e=P(window.location.href),t=document.getElementById(I);e?t?.getAttribute(`data-package-name`)!==e&&(t?.remove(),(document.body??document.documentElement)?.append(z(e))):t?.remove()}function V(){let e=()=>{B(),window.setInterval(B,L),window.addEventListener(`popstate`,B)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()}window.location.hostname===`apkcube.com`?E():window.location.hostname===`play.google.com`&&V()})();
