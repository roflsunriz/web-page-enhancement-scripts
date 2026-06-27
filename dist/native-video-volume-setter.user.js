// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.2.0
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

(function () {
  'use strict';

  const D="nativeVideoVolumeSetter:volume";const c=e=>Math.min(1,Math.max(0,e)),I=()=>{const e=GM_getValue(D,null);return typeof e!="number"||Number.isNaN(e)?.35:c(e)},U=e=>{const n=c(e);return GM_setValue(D,n),n},z=e=>`${Math.round(c(e)*100)}%`,q=[".mp4",".webm",".ogg",".mkv",".mov",".avi"],G=e=>{const n=e.toLowerCase();return q.some(o=>n.endsWith(o))},K=()=>(document.contentType??"").toLowerCase().startsWith("video/"),_=()=>Array.from(document.querySelectorAll("video")),j=e=>e.length===0?false:K()||G(window.location.pathname),P=(e,n)=>{const o=c(n),s=r=>{r.volume=o,o>0&&r.muted&&(r.muted=false),o===0&&(r.muted=true);};e.forEach(r=>{if(r.readyState>=HTMLMediaElement.HAVE_METADATA){s(r);return}r.addEventListener("loadedmetadata",()=>s(r),{once:true});});},R=e=>{const n=[];return e.forEach(o=>{o.addedNodes.forEach(s=>{if(s instanceof HTMLVideoElement){n.push(s);return}s instanceof HTMLElement&&n.push(...Array.from(s.querySelectorAll("video")));});}),n},B=(e={})=>{const n=document.createElement("div");e.id&&(n.id=e.id),n.style.position="relative";const o=n.attachShadow({mode:e.mode??"open"});if(e.cssText){const s=document.createElement("style");s.textContent=e.cssText,o.appendChild(s);}return e.adoptStyles?.length&&e.adoptStyles.forEach(s=>{const r=document.createElement("style");r.textContent=s,o.appendChild(r);}),document.body.appendChild(n),{host:n,root:o,dispose:()=>{n.remove();}}},Y=new Set(["ar","ur"]);function $(e){return Y.has(e)?"rtl":"ltr"}function W(e,n){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(o,s)=>{const r=n[s];return r===void 0?o:String(r)})}function J(e){const n=Object.keys(e.translations);let o=e.defaultLocale;const s=t=>{const a=t.toLowerCase(),l=e.aliases?.[a];if(l)return l;const d=n.find(m=>m.toLowerCase()===a);if(d)return d;const f=a.split("-")[0];return n.find(m=>m.toLowerCase().split("-")[0]===f)??null},r=()=>{const t=navigator.languages.length>0?navigator.languages:[navigator.language];for(const a of t){const l=s(a);if(l)return l}return e.fallbackLocale},u=t=>{const a=e.translations[o]?.[t];if(a)return a;const l=e.translations[e.fallbackLocale]?.[t];return l||(e.translations[e.defaultLocale]?.[t]??t)};return {locales:n,getLocale:()=>o,setLocale:t=>{o=t;},detectBrowserLocale:r,t:u,format:(t,a)=>W(u(t),a),getTranslations:(t=o)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(t=o)=>$(t),getMissingTranslationKeys:t=>{const a=e.translations[e.fallbackLocale],l=e.translations[t];return Object.keys(a).filter(d=>!l[d])}}}const X={ja:{openSettings:"既定音量の調整ウィンドウを開く",title:"既定音量の調整",description:"スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。",currentVolume:"現在の音量: {volume}",close:"閉じる"},en:{openSettings:"Open default volume settings",title:"Default volume",description:"Fine-tune the default volume with the slider or number input. Changes apply immediately.",currentVolume:"Current volume: {volume}",close:"Close"},"zh-Hans":{openSettings:"打开默认音量设置",title:"默认音量",description:"使用滑块或数字输入微调默认音量，设置会立即生效。",currentVolume:"当前音量：{volume}",close:"关闭"},hi:{openSettings:"डिफॉल्ट वॉल्यूम सेटिंग खोलें",title:"डिफॉल्ट वॉल्यूम",description:"स्लाइडर या नंबर इनपुट से डिफॉल्ट वॉल्यूम समायोजित करें। बदलाव तुरंत लागू होंगे।",currentVolume:"वर्तमान वॉल्यूम: {volume}",close:"बंद करें"},es:{openSettings:"Abrir ajustes de volumen predeterminado",title:"Volumen predeterminado",description:"Ajusta el volumen predeterminado con el control deslizante o el campo numerico. Los cambios se aplican al instante.",currentVolume:"Volumen actual: {volume}",close:"Cerrar"},fr:{openSettings:"Ouvrir les parametres du volume par defaut",title:"Volume par defaut",description:"Ajustez le volume par defaut avec le curseur ou le champ numerique. Les changements s'appliquent immediatement.",currentVolume:"Volume actuel: {volume}",close:"Fermer"},ar:{openSettings:"فتح إعدادات مستوى الصوت الافتراضي",title:"مستوى الصوت الافتراضي",description:"اضبط مستوى الصوت الافتراضي عبر شريط التمرير أو الإدخال الرقمي. تطبق التغييرات فورا.",currentVolume:"مستوى الصوت الحالي: {volume}",close:"إغلاق"},pt:{openSettings:"Abrir configuracoes de volume padrao",title:"Volume padrao",description:"Ajuste o volume padrao com o controle deslizante ou campo numerico. As alteracoes sao aplicadas imediatamente.",currentVolume:"Volume atual: {volume}",close:"Fechar"},bn:{openSettings:"ডিফল্ট ভলিউম সেটিং খুলুন",title:"ডিফল্ট ভলিউম",description:"স্লাইডার বা সংখ্যা ইনপুট দিয়ে ডিফল্ট ভলিউম ঠিক করুন। পরিবর্তন সঙ্গে সঙ্গে প্রয়োগ হবে।",currentVolume:"বর্তমান ভলিউম: {volume}",close:"বন্ধ"},ru:{openSettings:"Открыть настройки громкости по умолчанию",title:"Громкость по умолчанию",description:"Настройте громкость по умолчанию ползунком или числом. Изменения применяются сразу.",currentVolume:"Текущая громкость: {volume}",close:"Закрыть"},ur:{openSettings:"ڈیفالٹ آواز کی ترتیبات کھولیں",title:"ڈیفالٹ آواز",description:"سلائیڈر یا نمبر ان پٹ سے ڈیفالٹ آواز ایڈجسٹ کریں۔ تبدیلیاں فورا لاگو ہوں گی۔",currentVolume:"موجودہ آواز: {volume}",close:"بند کریں"}},b=J({translations:X,defaultLocale:"ja",fallbackLocale:"en",aliases:{zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans"}});b.setLocale(b.detectBrowserLocale());const E=b.t,A=b.format,Z=b.getDirection,Q=`
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
`;let L=null;const ee=({initialVolume:e,applyVolume:n})=>{if(!document.body)return;L?.(),L=null;const{root:o,dispose:s}=B({id:"native-video-volume-setter-settings",cssText:Q}),r=document.createElement("div");r.className="nvvs-overlay";const u=document.createElement("section");u.className="nvvs-panel",u.dir=Z();const h=document.createElement("h2");h.className="nvvs-heading",h.textContent=E("title");const x=document.createElement("p");x.className="nvvs-description",x.textContent=E("description");const v=document.createElement("p");v.className="nvvs-current-value",v.textContent=A("currentVolume",{volume:z(e)});const t=document.createElement("input");t.className="nvvs-range",t.type="range",t.min="0",t.max="100",t.step="1";const a=document.createElement("input");a.className="nvvs-number",a.type="number",a.min="0",a.max="100",a.step="1";const l=i=>{t.style.setProperty("--nvvs-range-progress",`${i}%`);},d=Math.round(c(e)*100);t.value=d.toString(),a.value=t.value,l(d);const f=document.createElement("div");f.className="nvvs-input-row",f.append(t,a);const m=document.createElement("div");m.className="nvvs-button-row";const p=document.createElement("button");p.className="nvvs-button",p.type="button",p.textContent=E("close"),m.append(p),u.append(h,x,v,f,m),r.append(u),o.append(r);let S=c(e);const k=i=>{const y=Math.round(c(i)*100);l(y),t.value=y.toString(),a.value=t.value,v.textContent=A("currentVolume",{volume:z(i)});},T=i=>{if(!Number.isFinite(i))return;const y=Math.max(0,Math.min(100,i)),V=c(y/100);if(Math.abs(V-S)<1e-6){k(S);return}S=V,n(V),k(V);},F=()=>{T(Number(a.value));};t.addEventListener("input",()=>T(Number(t.value))),a.addEventListener("input",F);const M=i=>{i.target===r&&g();},C=i=>{i.key==="Escape"&&(i.preventDefault(),g());};r.addEventListener("click",M),p.addEventListener("click",g),document.addEventListener("keydown",C);let N=false;function g(){N||(N=true,r.removeEventListener("click",M),p.removeEventListener("click",g),document.removeEventListener("keydown",C),s(),L=null);}L=g;},w={value:I()},te=e=>{w.value=U(e),H();},ne=()=>{GM_registerMenuCommand(E("openSettings"),()=>{ee({initialVolume:w.value,applyVolume:te});});},H=()=>{const e=_();j(e)&&P(e,w.value);},oe=()=>{if(!document.body)return;new MutationObserver(n=>{const o=R(n);if(o.length===0)return;const s=_();j(s)&&P(o,w.value);}).observe(document.body,{childList:true,subtree:true});},O=()=>{H(),oe();};ne();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O,{once:true}):O();

})();