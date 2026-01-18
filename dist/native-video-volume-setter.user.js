// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.1.2
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

  const A="nativeVideoVolumeSetter:volume";const c=e=>Math.min(1,Math.max(0,e)),I=()=>{const e=GM_getValue(A,null);return typeof e!="number"||Number.isNaN(e)?.35:c(e)},U=e=>{const t=c(e);return GM_setValue(A,t),t},T=e=>`${Math.round(c(e)*100)}%`,F=[".mp4",".webm",".ogg",".mkv",".mov",".avi"],H=e=>{const t=e.toLowerCase();return F.some(r=>t.endsWith(r))},G=()=>(document.contentType??"").toLowerCase().startsWith("video/"),O=()=>Array.from(document.querySelectorAll("video")),P=e=>e.length===0?false:G()||H(window.location.pathname),_=(e,t)=>{const r=c(t),o=n=>{n.volume=r,r>0&&n.muted&&(n.muted=false),r===0&&(n.muted=true);};e.forEach(n=>{if(n.readyState>=HTMLMediaElement.HAVE_METADATA){o(n);return}n.addEventListener("loadedmetadata",()=>o(n),{once:true});});},$=e=>{const t=[];return e.forEach(r=>{r.addedNodes.forEach(o=>{if(o instanceof HTMLVideoElement){t.push(o);return}o instanceof HTMLElement&&t.push(...Array.from(o.querySelectorAll("video")));});}),t},R=(e={})=>{const t=document.createElement("div");e.id&&(t.id=e.id),t.style.position="relative";const r=t.attachShadow({mode:e.mode??"open"});if(e.cssText){const o=document.createElement("style");o.textContent=e.cssText,r.appendChild(o);}return e.adoptStyles?.length&&e.adoptStyles.forEach(o=>{const n=document.createElement("style");n.textContent=o,r.appendChild(n);}),document.body.appendChild(t),{host:t,root:r,dispose:()=>{t.remove();}}},Y=`
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
`;let p=null;const j=({initialVolume:e,applyVolume:t})=>{if(!document.body)return;p?.(),p=null;const{root:r,dispose:o}=R({id:"native-video-volume-setter-settings",cssText:Y}),n=document.createElement("div");n.className="nvvs-overlay";const b=document.createElement("section");b.className="nvvs-panel";const g=document.createElement("h2");g.className="nvvs-heading",g.textContent="既定音量の調整";const h=document.createElement("p");h.className="nvvs-description",h.textContent="スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。";const u=document.createElement("p");u.className="nvvs-current-value",u.textContent=`現在の音量: ${T(e)}`;const s=document.createElement("input");s.className="nvvs-range",s.type="range",s.min="0",s.max="100",s.step="1";const i=document.createElement("input");i.className="nvvs-number",i.type="number",i.min="0",i.max="100",i.step="1";const V=a=>{s.style.setProperty("--nvvs-range-progress",`${a}%`);},w=Math.round(c(e)*100);s.value=w.toString(),i.value=s.value,V(w);const x=document.createElement("div");x.className="nvvs-input-row",x.append(s,i);const y=document.createElement("div");y.className="nvvs-button-row";const l=document.createElement("button");l.className="nvvs-button",l.type="button",l.textContent="閉じる",y.append(l),b.append(g,h,u,x,y),n.append(b),r.append(n);let E=c(e);const k=a=>{const m=Math.round(c(a)*100);V(m),s.value=m.toString(),i.value=s.value,u.textContent=`現在の音量: ${T(a)}`;},L=a=>{if(!Number.isFinite(a))return;const m=Math.max(0,Math.min(100,a)),v=c(m/100);if(Math.abs(v-E)<1e-6){k(E);return}E=v,t(v),k(v);},D=()=>{L(Number(i.value));};s.addEventListener("input",()=>L(Number(s.value))),i.addEventListener("input",D);const M=a=>{a.target===n&&d();},N=a=>{a.key==="Escape"&&(a.preventDefault(),d());};n.addEventListener("click",M),l.addEventListener("click",d),document.addEventListener("keydown",N);let S=false;function d(){S||(S=true,n.removeEventListener("click",M),l.removeEventListener("click",d),document.removeEventListener("keydown",N),o(),p=null);}p=d;},f={value:I()},q=e=>{f.value=U(e),z();},K=()=>{GM_registerMenuCommand("既定音量の調整ウィンドウを開く",()=>{j({initialVolume:f.value,applyVolume:q});});},z=()=>{const e=O();P(e)&&_(e,f.value);},W=()=>{if(!document.body)return;new MutationObserver(t=>{const r=$(t);if(r.length===0)return;const o=O();P(o)&&_(r,f.value);}).observe(document.body,{childList:true,subtree:true});},C=()=>{z(),W();};K();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",C,{once:true}):C();

})();