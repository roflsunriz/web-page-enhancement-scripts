// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.1.1
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

  const A="nativeVideoVolumeSetter:volume";const c=e=>Math.min(1,Math.max(0,e)),z=()=>{const e=GM_getValue(A,null);return typeof e!="number"||Number.isNaN(e)?.35:c(e)},H=e=>{const t=c(e);return GM_setValue(A,t),t},C=e=>`${Math.round(c(e)*100)}%`,R=[".mp4",".webm",".ogg",".mkv",".mov",".avi"];const U=e=>{const t=e.toLowerCase();return R.some(n=>t.includes(n))},F=()=>{const e=(document.contentType??"").toLowerCase();return e.startsWith("video/")||e==="application/octet-stream"},$=e=>{const t=document.body;if(!t)return  false;const n=t.querySelectorAll("*").length,o=t.querySelectorAll("video").length;return t.childElementCount<=6||n-o<=8||o===e.length},Y=e=>{const t=window.innerWidth*window.innerHeight;return t===0?false:e.some(n=>{const{width:o,height:r}=n.getBoundingClientRect();return o>0&&r>0&&o*r/t>.4})},_=()=>Array.from(document.querySelectorAll("video")),O=e=>{if(e.length===0)return  false;const t=`${window.location.pathname}${window.location.search}`,n=U(t);return F()||n||Y(e)&&$(e)},D=(e,t)=>{const n=c(t),o=r=>{r.volume=n,n>0&&r.muted&&(r.muted=false),n===0&&(r.muted=true);};e.forEach(r=>{if(r.readyState>=HTMLMediaElement.HAVE_METADATA){o(r);return}r.addEventListener("loadedmetadata",()=>o(r),{once:true});});},q=e=>{const t=[];return e.forEach(n=>{n.addedNodes.forEach(o=>{if(o instanceof HTMLVideoElement){t.push(o);return}o instanceof HTMLElement&&t.push(...Array.from(o.querySelectorAll("video")));});}),t},B=(e={})=>{const t=document.createElement("div");e.id&&(t.id=e.id),t.style.position="relative";const n=t.attachShadow({mode:e.mode??"open"});if(e.cssText){const o=document.createElement("style");o.textContent=e.cssText,n.appendChild(o);}return e.adoptStyles?.length&&e.adoptStyles.forEach(o=>{const r=document.createElement("style");r.textContent=o,n.appendChild(r);}),document.body.appendChild(t),{host:t,root:n,dispose:()=>{t.remove();}}},G=`
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
`;let p=null;const X=({initialVolume:e,applyVolume:t})=>{if(!document.body)return;p?.(),p=null;const{root:n,dispose:o}=B({id:"native-video-volume-setter-settings",cssText:G}),r=document.createElement("div");r.className="nvvs-overlay";const g=document.createElement("section");g.className="nvvs-panel";const b=document.createElement("h2");b.className="nvvs-heading",b.textContent="既定音量の調整";const h=document.createElement("p");h.className="nvvs-description",h.textContent="スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。";const u=document.createElement("p");u.className="nvvs-current-value",u.textContent=`現在の音量: ${C(e)}`;const s=document.createElement("input");s.className="nvvs-range",s.type="range",s.min="0",s.max="100",s.step="1";const i=document.createElement("input");i.className="nvvs-number",i.type="number",i.min="0",i.max="100",i.step="1";const w=a=>{s.style.setProperty("--nvvs-range-progress",`${a}%`);},V=Math.round(c(e)*100);s.value=V.toString(),i.value=s.value,w(V);const E=document.createElement("div");E.className="nvvs-input-row",E.append(s,i);const y=document.createElement("div");y.className="nvvs-button-row";const l=document.createElement("button");l.className="nvvs-button",l.type="button",l.textContent="閉じる",y.append(l),g.append(b,h,u,E,y),r.append(g),n.append(r);let x=c(e);const L=a=>{const m=Math.round(c(a)*100);w(m),s.value=m.toString(),i.value=s.value,u.textContent=`現在の音量: ${C(a)}`;},k=a=>{if(!Number.isFinite(a))return;const m=Math.max(0,Math.min(100,a)),v=c(m/100);if(Math.abs(v-x)<1e-6){L(x);return}x=v,t(v),L(v);},P=()=>{k(Number(i.value));};s.addEventListener("input",()=>k(Number(s.value))),i.addEventListener("input",P);const N=a=>{a.target===r&&d();},M=a=>{a.key==="Escape"&&(a.preventDefault(),d());};r.addEventListener("click",N),l.addEventListener("click",d),document.addEventListener("keydown",M);let S=false;function d(){S||(S=true,r.removeEventListener("click",N),l.removeEventListener("click",d),document.removeEventListener("keydown",M),o(),p=null);}p=d;},f={value:z()},j=e=>{f.value=H(e),I();},K=()=>{GM_registerMenuCommand("既定音量の調整ウィンドウを開く",()=>{X({initialVolume:f.value,applyVolume:j});});},I=()=>{const e=_();O(e)&&D(e,f.value);},W=()=>{if(!document.body)return;new MutationObserver(t=>{const n=q(t);if(n.length===0)return;const o=_();O(o)&&D(n,f.value);}).observe(document.body,{childList:true,subtree:true});},T=()=>{I(),W();};K();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",T,{once:true}):T();

})();