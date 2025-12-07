// ==UserScript==
// @name         native-video-volume-setter
// @namespace    nativeVideoVolumeSetter
// @version      1.0.0
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

	const a="nativeVideoVolumeSetter:volume";const l=e=>Math.min(1,Math.max(0,e)),f=()=>{const e=GM_getValue(a,null);return typeof e!="number"||Number.isNaN(e)?.35:l(e)},E=e=>{const t=l(e);return GM_setValue(a,t),t},u=e=>`${Math.round(l(e)*100)}%`,h=[".mp4",".webm",".ogg",".mkv",".mov",".avi"];const v=e=>{const t=e.toLowerCase();return h.some(n=>t.includes(n))},p=()=>{const e=(document.contentType??"").toLowerCase();return e.startsWith("video/")||e==="application/octet-stream"},M=e=>{const t=document.body;if(!t)return  false;const n=t.querySelectorAll("*").length,o=t.querySelectorAll("video").length;return t.childElementCount<=6||n-o<=8||o===e.length},w=e=>{const t=window.innerWidth*window.innerHeight;return t===0?false:e.some(n=>{const{width:o,height:r}=n.getBoundingClientRect();return o>0&&r>0&&o*r/t>.4})},c=()=>Array.from(document.querySelectorAll("video")),d=e=>{if(e.length===0)return  false;const t=`${window.location.pathname}${window.location.search}`,n=v(t);return p()||n||w(e)&&M(e)},m=(e,t)=>{const n=l(t),o=r=>{r.volume=n,n>0&&r.muted&&(r.muted=false),n===0&&(r.muted=true);};e.forEach(r=>{if(r.readyState>=HTMLMediaElement.HAVE_METADATA){o(r);return}r.addEventListener("loadedmetadata",()=>o(r),{once:true});});},L=e=>{const t=[];return e.forEach(n=>{n.addedNodes.forEach(o=>{if(o instanceof HTMLVideoElement){t.push(o);return}o instanceof HTMLElement&&t.push(...Array.from(o.querySelectorAll("video")));});}),t},s={value:f()},y=()=>{const e=window.prompt(`既定の音量を 0〜100 で入力してください。
現在値: ${u(s.value)}`,Math.round(l(s.value)*100).toString());if(e===null)return null;const t=Number(e.trim());return !Number.isFinite(t)||t<0||t>100?(window.alert("0〜100 の数値で入力してください。"),null):l(t/100)},A=()=>{GM_registerMenuCommand(`デフォルト音量を設定（現在: ${u(s.value)}）`,()=>{const e=y();e!==null&&(s.value=E(e),V(),window.alert(`既定音量を ${u(s.value)} に設定しました。`));});},V=()=>{const e=c();d(e)&&m(e,s.value);},g=()=>{if(!document.body)return;new MutationObserver(t=>{const n=L(t);if(n.length===0)return;const o=c();d(o)&&m(n,s.value);}).observe(document.body,{childList:true,subtree:true});},i=()=>{V(),g();};A();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i,{once:true}):i();

})();