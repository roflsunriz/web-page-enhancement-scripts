// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.2.2
// @author       roflsunriz
// @description  新規タブで開かれたブラウザ標準のビデオプレーヤーの音量を好みの既定値に揃えるシンプルな補助スクリプト
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=videojs.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/native-video-volume-setter.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/native-video-volume-setter.meta.js
// @match        *://*/*
// @exclude      https://www.youtube.com/*
// @exclude      https://youtu.be/*
// @exclude      https://twitter.com/*
// @exclude      https://x.com/*
// @exclude      https://www.netflix.com/*
// @exclude      https://www.primevideo.com/*
// @exclude      https://www.disneyplus.com/*
// @exclude      https://abema.tv/*
// @exclude      https://www.abema.tv/*
// @exclude      https://tver.jp/*
// @exclude      https://www.tver.jp/*
// @exclude      https://www.twitch.tv/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function(){"use strict";var e=`nativeVideoVolumeSetter:volume`,t=e=>Math.min(1,Math.max(0,e)),n=()=>{let n=GM_getValue(e,null);return typeof n!=`number`||Number.isNaN(n)?.35:t(n)},r=n=>{let r=t(n);return GM_setValue(e,r),r},i=e=>`${Math.round(t(e)*100)}%`,a=[`.mp4`,`.webm`,`.ogg`,`.mkv`,`.mov`,`.avi`],o=e=>{let t=e.toLowerCase();return a.some(e=>t.endsWith(e))},s=()=>(document.contentType??``).toLowerCase().startsWith(`video/`),c=()=>Array.from(document.querySelectorAll(`video`)),l=e=>e.length===0?!1:s()||o(window.location.pathname),u=(e,n)=>{let r=t(n),i=e=>{e.volume=r,r>0&&e.muted&&(e.muted=!1),r===0&&(e.muted=!0)};e.forEach(e=>{if(e.readyState>=HTMLMediaElement.HAVE_METADATA){i(e);return}e.addEventListener(`loadedmetadata`,()=>i(e),{once:!0})})},d=e=>{let t=[];return e.forEach(e=>{e.addedNodes.forEach(e=>{if(e instanceof HTMLVideoElement){t.push(e);return}e instanceof HTMLElement&&t.push(...Array.from(e.querySelectorAll(`video`)))})}),t},f=(e={})=>{let t=document.createElement(`div`);e.id&&(t.id=e.id),t.style.position=`relative`,e.hostCssText&&(t.style.cssText=e.hostCssText);let n=t.attachShadow({mode:e.mode??`open`});if(e.cssText){let t=document.createElement(`style`);t.textContent=e.cssText,n.appendChild(t)}return e.adoptStyles?.length&&e.adoptStyles.forEach(e=>{let t=document.createElement(`style`);t.textContent=e,n.appendChild(t)}),(e.appendTo===`documentElement`?document.documentElement:document.body).appendChild(t),{host:t,root:n,dispose:()=>{t.remove()}}},p=new Set([`ar`,`ur`]);function m(e){return p.has(e)?`rtl`:`ltr`}function h(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function g(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>h(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>m(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var _=g({translations:{ja:{openSettings:`既定音量の調整ウィンドウを開く`,title:`既定音量の調整`,description:`スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。`,currentVolume:`現在の音量: {volume}`,close:`閉じる`},en:{openSettings:`Open default volume settings`,title:`Default volume`,description:`Fine-tune the default volume with the slider or number input. Changes apply immediately.`,currentVolume:`Current volume: {volume}`,close:`Close`},"zh-Hans":{openSettings:`打开默认音量设置`,title:`默认音量`,description:`使用滑块或数字输入微调默认音量，设置会立即生效。`,currentVolume:`当前音量：{volume}`,close:`关闭`},hi:{openSettings:`डिफॉल्ट वॉल्यूम सेटिंग खोलें`,title:`डिफॉल्ट वॉल्यूम`,description:`स्लाइडर या नंबर इनपुट से डिफॉल्ट वॉल्यूम समायोजित करें। बदलाव तुरंत लागू होंगे।`,currentVolume:`वर्तमान वॉल्यूम: {volume}`,close:`बंद करें`},es:{openSettings:`Abrir ajustes de volumen predeterminado`,title:`Volumen predeterminado`,description:`Ajusta el volumen predeterminado con el control deslizante o el campo numerico. Los cambios se aplican al instante.`,currentVolume:`Volumen actual: {volume}`,close:`Cerrar`},fr:{openSettings:`Ouvrir les parametres du volume par defaut`,title:`Volume par defaut`,description:`Ajustez le volume par defaut avec le curseur ou le champ numerique. Les changements s'appliquent immediatement.`,currentVolume:`Volume actuel: {volume}`,close:`Fermer`},ar:{openSettings:`فتح إعدادات مستوى الصوت الافتراضي`,title:`مستوى الصوت الافتراضي`,description:`اضبط مستوى الصوت الافتراضي عبر شريط التمرير أو الإدخال الرقمي. تطبق التغييرات فورا.`,currentVolume:`مستوى الصوت الحالي: {volume}`,close:`إغلاق`},pt:{openSettings:`Abrir configuracoes de volume padrao`,title:`Volume padrao`,description:`Ajuste o volume padrao com o controle deslizante ou campo numerico. As alteracoes sao aplicadas imediatamente.`,currentVolume:`Volume atual: {volume}`,close:`Fechar`},bn:{openSettings:`ডিফল্ট ভলিউম সেটিং খুলুন`,title:`ডিফল্ট ভলিউম`,description:`স্লাইডার বা সংখ্যা ইনপুট দিয়ে ডিফল্ট ভলিউম ঠিক করুন। পরিবর্তন সঙ্গে সঙ্গে প্রয়োগ হবে।`,currentVolume:`বর্তমান ভলিউম: {volume}`,close:`বন্ধ`},ru:{openSettings:`Открыть настройки громкости по умолчанию`,title:`Громкость по умолчанию`,description:`Настройте громкость по умолчанию ползунком или числом. Изменения применяются сразу.`,currentVolume:`Текущая громкость: {volume}`,close:`Закрыть`},ur:{openSettings:`ڈیفالٹ آواز کی ترتیبات کھولیں`,title:`ڈیفالٹ آواز`,description:`سلائیڈر یا نمبر ان پٹ سے ڈیفالٹ آواز ایڈجسٹ کریں۔ تبدیلیاں فورا لاگو ہوں گی۔`,currentVolume:`موجودہ آواز: {volume}`,close:`بند کریں`}},defaultLocale:`ja`,fallbackLocale:`en`,aliases:{zh:`zh-Hans`,"zh-cn":`zh-Hans`,"zh-sg":`zh-Hans`}});_.setLocale(_.detectBrowserLocale());var v=_.t,y=_.format,b=_.getDirection,x=`
:host {
  all: initial;
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  font-family: "Inter", "Noto Sans JP", "Segoe UI", system-ui, sans-serif;
  color: #e2e8f0;
}
.nvvs-overlay {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.nvvs-panel {
  background: #0f172a;
  border-radius: 18px;
  padding: 1.5rem;
  width: min(360px, 100%);
  box-shadow: 0 20px 45px rgba(2, 6, 23, 0.85);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.nvvs-heading {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
}
.nvvs-description {
  margin: 0;
  color: #cbd5f5;
  font-size: 0.95rem;
}
.nvvs-current-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #e0e7ff;
}
.nvvs-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nvvs-range {
  flex: 1;
  --nvvs-range-progress: 0%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #3b82f6 var(--nvvs-range-progress),
    #1f2937 var(--nvvs-range-progress)
  );
  cursor: pointer;
  outline: none;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.nvvs-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: transparent;
  border-radius: 50%;
  margin-top: -10px;
  border: none;
  cursor: inherit;
}
.nvvs-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: inherit;
}
.nvvs-range::-ms-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: inherit;
}
.nvvs-range::-moz-range-track,
.nvvs-range::-ms-track {
  background: transparent;
  border-color: transparent;
}
.nvvs-range,
.nvvs-number {
  -webkit-appearance: none;
  appearance: none;
}
.nvvs-number {
  width: 90px;
  padding: 0.35rem 0.55rem;
  font-size: 0.95rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #111b30;
  color: #f1f5f9;
  text-align: center;
}
.nvvs-number:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.nvvs-button-row {
  display: flex;
  justify-content: flex-end;
}
.nvvs-button {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.nvvs-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.nvvs-button:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}
`,S=null,C=({initialVolume:e,applyVolume:n})=>{if(!document.body)return;S?.(),S=null;let{root:r,dispose:a}=f({id:`native-video-volume-setter-settings`,cssText:x}),o=document.createElement(`div`);o.className=`nvvs-overlay`;let s=document.createElement(`section`);s.className=`nvvs-panel`,s.dir=b();let c=document.createElement(`h2`);c.className=`nvvs-heading`,c.textContent=v(`title`);let l=document.createElement(`p`);l.className=`nvvs-description`,l.textContent=v(`description`);let u=document.createElement(`p`);u.className=`nvvs-current-value`,u.textContent=y(`currentVolume`,{volume:i(e)});let d=document.createElement(`input`);d.className=`nvvs-range`,d.type=`range`,d.min=`0`,d.max=`100`,d.step=`1`;let p=document.createElement(`input`);p.className=`nvvs-number`,p.type=`number`,p.min=`0`,p.max=`100`,p.step=`1`;let m=e=>{d.style.setProperty(`--nvvs-range-progress`,`${e}%`)},h=Math.round(t(e)*100);d.value=h.toString(),p.value=d.value,m(h);let g=document.createElement(`div`);g.className=`nvvs-input-row`,g.append(d,p);let _=document.createElement(`div`);_.className=`nvvs-button-row`;let C=document.createElement(`button`);C.className=`nvvs-button`,C.type=`button`,C.textContent=v(`close`),_.append(C),s.append(c,l,u,g,_),o.append(s),r.append(o);let w=t(e),T=e=>{let n=Math.round(t(e)*100);m(n),d.value=n.toString(),p.value=d.value,u.textContent=y(`currentVolume`,{volume:i(e)})},E=e=>{if(!Number.isFinite(e))return;let r=t(Math.max(0,Math.min(100,e))/100);if(Math.abs(r-w)<1e-6){T(w);return}w=r,n(r),T(r)};d.addEventListener(`input`,()=>E(Number(d.value))),p.addEventListener(`input`,()=>{E(Number(p.value))});let D=e=>{e.target===o&&A()},O=e=>{e.key===`Escape`&&(e.preventDefault(),A())};o.addEventListener(`click`,D),C.addEventListener(`click`,A),document.addEventListener(`keydown`,O);let k=!1;function A(){k||(k=!0,o.removeEventListener(`click`,D),C.removeEventListener(`click`,A),document.removeEventListener(`keydown`,O),a(),S=null)}S=A},w={value:n()},T=e=>{w.value=r(e),D()},E=()=>{GM_registerMenuCommand(v(`openSettings`),()=>{C({initialVolume:w.value,applyVolume:T})})},D=()=>{let e=c();l(e)&&u(e,w.value)},O=()=>{document.body&&new MutationObserver(e=>{let t=d(e);t.length!==0&&l(c())&&u(t,w.value)}).observe(document.body,{childList:!0,subtree:!0})},k=()=>{D(),O()};E(),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,k,{once:!0}):k()})();
