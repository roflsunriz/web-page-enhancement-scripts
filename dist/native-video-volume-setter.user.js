// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.1.0
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

  const T="nativeVideoVolumeSetter:volume";const i=e=>Math.min(1,Math.max(0,e)),H=()=>{const e=GM_getValue(T,null);return typeof e!="number"||Number.isNaN(e)?.35:i(e)},P=e=>{const t=i(e);return GM_setValue(T,t),t},S=e=>`${Math.round(i(e)*100)}%`,R=[".mp4",".webm",".ogg",".mkv",".mov",".avi"];const z=e=>{const t=e.toLowerCase();return R.some(n=>t.includes(n))},U=()=>{const e=(document.contentType??"").toLowerCase();return e.startsWith("video/")||e==="application/octet-stream"},F=e=>{const t=document.body;if(!t)return  false;const n=t.querySelectorAll("*").length,o=t.querySelectorAll("video").length;return t.childElementCount<=6||n-o<=8||o===e.length},$=e=>{const t=window.innerWidth*window.innerHeight;return t===0?false:e.some(n=>{const{width:o,height:s}=n.getBoundingClientRect();return o>0&&s>0&&o*s/t>.4})},A=()=>Array.from(document.querySelectorAll("video")),k=e=>{if(e.length===0)return  false;const t=`${window.location.pathname}${window.location.search}`,n=z(t);return U()||n||$(e)&&F(e)},_=(e,t)=>{const n=i(t),o=s=>{s.volume=n,n>0&&s.muted&&(s.muted=false),n===0&&(s.muted=true);};e.forEach(s=>{if(s.readyState>=HTMLMediaElement.HAVE_METADATA){o(s);return}s.addEventListener("loadedmetadata",()=>o(s),{once:true});});},q=e=>{const t=[];return e.forEach(n=>{n.addedNodes.forEach(o=>{if(o instanceof HTMLVideoElement){t.push(o);return}o instanceof HTMLElement&&t.push(...Array.from(o.querySelectorAll("video")));});}),t},B=(e={})=>{const t=document.createElement("div");e.id&&(t.id=e.id),t.style.position="relative";const n=t.attachShadow({mode:e.mode??"open"});if(e.cssText){const o=document.createElement("style");o.textContent=e.cssText,n.appendChild(o);}return e.adoptStyles?.length&&e.adoptStyles.forEach(o=>{const s=document.createElement("style");s.textContent=o,n.appendChild(s);}),document.body.appendChild(t),{host:t,root:n,dispose:()=>{t.remove();}}},G=`
:host {
  all: initial;
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  font-family: "Inter", "Noto Sans JP", "Segoe UI", system-ui, sans-serif;
}
.nvvs-overlay {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(3, 3, 3, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.nvvs-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  width: min(320px, 100%);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.nvvs-heading {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111;
}
.nvvs-description {
  margin: 0;
  color: #4a4a4a;
  font-size: 0.95rem;
}
.nvvs-current-value {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1c1c1c;
}
.nvvs-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nvvs-range {
  flex: 1;
}
.nvvs-range,
.nvvs-number {
  -webkit-appearance: none;
  appearance: none;
}
.nvvs-number {
  width: 90px;
  padding: 0.25rem 0.5rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
.nvvs-number:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
.nvvs-button-row {
  display: flex;
  justify-content: flex-end;
}
.nvvs-button {
  border: none;
  background: #111;
  color: #fff;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.nvvs-button:hover {
  background: #282828;
}
.nvvs-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
`;let v=null;const Y=({initialVolume:e,applyVolume:t})=>{if(!document.body)return;v?.(),v=null;const{root:n,dispose:o}=B({id:"native-video-volume-setter-settings",cssText:G}),s=document.createElement("div");s.className="nvvs-overlay";const f=document.createElement("section");f.className="nvvs-panel";const b=document.createElement("h2");b.className="nvvs-heading",b.textContent="既定音量の調整";const E=document.createElement("p");E.className="nvvs-description",E.textContent="スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。";const d=document.createElement("p");d.className="nvvs-current-value",d.textContent=`現在の音量: ${S(e)}`;const r=document.createElement("input");r.className="nvvs-range",r.type="range",r.min="0",r.max="100",r.step="1";const a=document.createElement("input");a.className="nvvs-number",a.type="number",a.min="0",a.max="100",a.step="1";const D=Math.round(i(e)*100);r.value=D.toString(),a.value=r.value;const h=document.createElement("div");h.className="nvvs-input-row",h.append(r,a);const y=document.createElement("div");y.className="nvvs-button-row";const c=document.createElement("button");c.className="nvvs-button",c.type="button",c.textContent="閉じる",y.append(c),f.append(b,E,d,h,y),s.append(f),n.append(s);let g=i(e);const V=l=>{const x=Math.round(i(l)*100);r.value=x.toString(),a.value=r.value,d.textContent=`現在の音量: ${S(l)}`;},w=l=>{if(!Number.isFinite(l))return;const x=Math.max(0,Math.min(100,l)),m=i(x/100);if(Math.abs(m-g)<1e-6){V(g);return}g=m,t(m),V(m);},I=()=>{w(Number(a.value));};r.addEventListener("input",()=>w(Number(r.value))),a.addEventListener("input",I);const L=l=>{l.target===s&&u();},N=l=>{l.key==="Escape"&&(l.preventDefault(),u());};s.addEventListener("click",L),c.addEventListener("click",u),document.addEventListener("keydown",N);let M=false;function u(){M||(M=true,s.removeEventListener("click",L),c.removeEventListener("click",u),document.removeEventListener("keydown",N),o(),v=null);}v=u;},p={value:H()},X=e=>{p.value=P(e),O();},j=()=>{GM_registerMenuCommand("既定音量の調整ウィンドウを開く",()=>{Y({initialVolume:p.value,applyVolume:X});});},O=()=>{const e=A();k(e)&&_(e,p.value);},K=()=>{if(!document.body)return;new MutationObserver(t=>{const n=q(t);if(n.length===0)return;const o=A();k(o)&&_(n,p.value);}).observe(document.body,{childList:true,subtree:true});},C=()=>{O(),K();};j();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",C,{once:true}):C();

})();