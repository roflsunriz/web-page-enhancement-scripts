// ==UserScript==
// @name         youtube-info-copier
// @namespace    youtubeInfoCopier
// @version      2.6.1
// @author       roflsunriz
// @description  YouTube動画の情報をワンクリックでクリップボードにコピー（従来/FAB/メニュー切替対応）
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.meta.js
// @match        https://www.youtube.com/*
// @match        https://youtu.be/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i},i=new WeakMap;function a(e){let{trustedTypes:t}=e;return!t||typeof t.createPolicy!=`function`?null:t}function o(e,t){let n=i.get(e);n||(n=new Map,i.set(e,n));let r=n.get(t);if(r)return r;let a=e.createPolicy(t,{createHTML:e=>e});return a?(n.set(t,a),a):null}function s(e,t,n=window){let r=a(n);if(!r)return e;let i=o(r,t);return i?i.createHTML(e):e}function c(e,t,n){let r=s(t,n,(e.ownerDocument??document).defaultView??window);if(typeof r==`string`){e.innerHTML=r;return}e.innerHTML=r}var l=typeof GM_getValue<`u`?GM_getValue:void 0,u=typeof GM_registerMenuCommand<`u`?GM_registerMenuCommand:void 0,d=typeof GM_setClipboard<`u`?GM_setClipboard:void 0,f=typeof GM_setValue<`u`?GM_setValue:void 0;function p(e,t){u(e,t)}function m(e,t){f(e,t)}function ee(e,t){return l(e,t)}function h(e,t){typeof t==`string`?d(e,t):d(e,`text`)}var g={descriptionCandidates:[`#description`,`ytd-expander#description`,`#meta-contents #description`,`#meta-contents`],inlineExpander:`ytd-text-inline-expander`,inlineExpanderById:`ytd-text-inline-expander#description-inline-expander`,interactiveElements:`tp-yt-paper-button, button, a`,titleCandidates:[`h1.ytd-watch-metadata yt-formatted-string`,`#title h1 yt-formatted-string`,`h1.title`],channelCandidates:[`#owner #channel-name a`,`ytd-channel-name a`,`.ytd-video-owner-renderer a`,`#upload-info #channel-name a`,`#owner-text a`],descriptionRoot:`#description-inline-expander`,descriptionExpandedContent:[`#description-inline-expander #expanded yt-attributed-string`,`#description-inline-expander #expanded yt-formatted-string`,`#description-inline-expander #snippet yt-attributed-string`]},_=r(`youtube-info-copier:dom-utils`);async function v(e=4e3){let t=g.descriptionCandidates.map(e=>document.querySelector(e)).find(Boolean);if(!t)return;let n=()=>{let e=t.querySelector(g.inlineExpander)||document.querySelector(g.inlineExpanderById);if(e?.hasAttribute(`is-expanded`))return _.debug(`Already has is-expanded attribute`),!0;let n=document.querySelector(`tp-yt-paper-button#expand`);if(n&&n.textContent?.includes(`もっと見る`))try{return _.debug(`Clicking tp-yt-paper-button#expand directly`),n.click(),_.info(`概要欄の「もっと見る」ボタンをクリックしました。`),!0}catch(e){_.warn(`Direct click failed:`,e)}let r=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,i=[];e&&i.push(...Array.from(e.querySelectorAll(g.interactiveElements))),i.push(...Array.from(document.querySelectorAll(g.interactiveElements)));for(let e of i)try{let t=(e.textContent||``).trim();if((e.getAttribute(`aria-expanded`)===`false`||r.test(t)||e.id&&/expand|more|collapse/i.test(e.id))&&typeof e.click==`function`)return _.debug(`Clicking element: ${e.tagName}#${e.id} "${t}"`),e.click(),_.info(`概要欄の「もっと見る」ボタンをクリックしました（フォールバック）。`),!0}catch{}return _.warn(`No expand button found`),!1},r=()=>{let e=t.querySelector(g.inlineExpander)||document.querySelector(g.inlineExpanderById),n=(e||t).querySelector(`#expanded`);if(n){let e=(n.textContent||n.innerText||``).trim();if(e&&e.length>200)return _.debug(`Description is expanded (found ${e.length} chars in #expanded)`),!0}if(e?.hasAttribute(`is-expanded`)&&n){let e=(n.textContent||n.innerText||``).trim();return e&&e.length>200?!0:(_.debug(`is-expanded attr found but content not yet loaded`),!1)}return!1};if(!r()&&n())return new Promise(n=>{let i=Date.now(),a=0,o=null,s=null,c=()=>{o&&=(o.disconnect(),null),s&&=(clearInterval(s),null)},l=o=>{a++;let s=t.querySelector(`#expanded`),l=s?(s.textContent||``).trim().length:0,u=r(),d=Date.now()-i;return _.debug(`Check ${a} (${o}): expanded=${u}, #expanded length=${l}, elapsed=${d}ms`),u?(c(),_.info(`Description expanded successfully (#expanded: ${l} chars) after ${d}ms`),setTimeout(()=>n(),200),!0):d>e?(c(),_.warn(`Description expansion timed out after ${d}ms (${a} checks)`),n(),!0):!1},u=t.querySelector(`#expanded`);u&&(o=new MutationObserver(()=>{l(`mutation`)}),o.observe(u,{childList:!0,subtree:!0,characterData:!0}),_.debug(`MutationObserver started on #expanded`)),s=window.setInterval(()=>{l(`poll`)},200),l(`initial`)})}var te=`M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z`,ne=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,re=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,ie=`M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z`,ae=`M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z`,oe=`M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z`,se=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,ce=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,le=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,ue=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z`,de=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z`,fe=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z`,pe=`M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z`,me=`M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z`,he=`M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z`,ge=`M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z`,_e=`M7,2V13H10V22L17,10H13L17,2H7Z`,y=`M5,4V7H10.5V19H13.5V7H19V4H5Z`,b=`M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z`,x=`M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z`,S=`M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z`,C=`M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z`,w=`M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z`,T=`M8,5.14V19.14L19,12.14L8,5.14Z`,E=`M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z`,D=`M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z`,O=`M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9`,k=`M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z`,A=`M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z`,j=`M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z`;function M(e,t=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${String(t)}" height="${String(t)}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}M(he),M(me),M(j),M(ae),M(T),M(D);var N=M(C),P=M(pe),F=M(_e),I=M(le);M(w),M(S),M(ue),M(x),M(y),M(te),M(ge),M(fe),M(E),M(oe),M(de),M(k),M(ie),M(se),M(ce),M(re),M(ne),M(b),M(A),M(O);var ve=[`ja`,`en`,`zh-Hans`,`hi`,`es`,`fr`,`ar`,`pt`,`bn`,`ru`,`ur`],ye=new Set([`ar`,`ur`]),be={zh:`zh-Hans`,"zh-cn":`zh-Hans`,"zh-sg":`zh-Hans`,"zh-my":`zh-Hans`,cmn:`zh-Hans`,"cmn-hans":`zh-Hans`,"cmn-hans-cn":`zh-Hans`,"pt-br":`pt`,"pt-pt":`pt`,"ar-sa":`ar`,"ar-ae":`ar`,"ar-eg":`ar`,"ur-pk":`ur`,"ur-in":`ur`};function xe(e){return ye.has(e)?`rtl`:`ltr`}function Se(e,t,n){let r=e[n],i={},a=e;for(let e of t)i[e]={...r,...a[e]??{}};return i}function Ce(e,t){return Se(e,ve,t)}function we(e){return L({...e,aliases:{...be,...e.aliases??{}},translations:Ce(e.translations,e.fallbackLocale)})}function Te(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function L(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>Te(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>xe(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var R=L({translations:{ja:{controlLabel:`YouTube動画情報コピー`,controlTitle:`YouTube動画情報`,copyVideoInfo:`動画情報をコピー`,copyTitleAndUrl:`タイトル+URLのみ`,close:`閉じる`,copiedSummary:`コピーした概要`,unknownTitle:`タイトル不明`,unknownAuthor:`投稿者不明`,descriptionFailed:`概要取得に失敗しました`,fullCopyText:`タイトル：{title}
投稿者名：{author}
URL：{url}
概要：{description}`},en:{controlLabel:`Copy YouTube video info`,controlTitle:`YouTube video info`,copyVideoInfo:`Copy video info`,copyTitleAndUrl:`Title + URL only`,close:`Close`,copiedSummary:`Copied summary`,unknownTitle:`Unknown title`,unknownAuthor:`Unknown author`,descriptionFailed:`Failed to get description`,fullCopyText:`Title: {title}
Author: {author}
URL: {url}
Description: {description}`},"zh-Hans":{controlLabel:`复制 YouTube 视频信息`,controlTitle:`YouTube 视频信息`,copyVideoInfo:`复制视频信息`,copyTitleAndUrl:`仅标题 + URL`,close:`关闭`,copiedSummary:`已复制的简介`,unknownTitle:`未知标题`,unknownAuthor:`未知作者`,descriptionFailed:`无法获取简介`,fullCopyText:`标题：{title}
作者：{author}
URL：{url}
简介：{description}`},hi:{controlLabel:`YouTube वीडियो जानकारी कॉपी करें`,controlTitle:`YouTube वीडियो जानकारी`,copyVideoInfo:`वीडियो जानकारी कॉपी करें`,copyTitleAndUrl:`केवल शीर्षक + URL`,close:`बंद करें`,copiedSummary:`कॉपी किया गया सारांश`,unknownTitle:`अज्ञात शीर्षक`,unknownAuthor:`अज्ञात लेखक`,descriptionFailed:`विवरण प्राप्त नहीं हो सका`,fullCopyText:`शीर्षक: {title}
लेखक: {author}
URL: {url}
विवरण: {description}`},es:{controlLabel:`Copiar informacion del video de YouTube`,controlTitle:`Informacion del video de YouTube`,copyVideoInfo:`Copiar informacion del video`,copyTitleAndUrl:`Solo titulo + URL`,close:`Cerrar`,copiedSummary:`Resumen copiado`,unknownTitle:`Titulo desconocido`,unknownAuthor:`Autor desconocido`,descriptionFailed:`No se pudo obtener la descripcion`,fullCopyText:`Titulo: {title}
Autor: {author}
URL: {url}
Descripcion: {description}`},fr:{controlLabel:`Copier les infos de la video YouTube`,controlTitle:`Infos de la video YouTube`,copyVideoInfo:`Copier les infos de la video`,copyTitleAndUrl:`Titre + URL seulement`,close:`Fermer`,copiedSummary:`Resume copie`,unknownTitle:`Titre inconnu`,unknownAuthor:`Auteur inconnu`,descriptionFailed:`Impossible d'obtenir la description`,fullCopyText:`Titre: {title}
Auteur: {author}
URL: {url}
Description: {description}`},ar:{controlLabel:`نسخ معلومات فيديو YouTube`,controlTitle:`معلومات فيديو YouTube`,copyVideoInfo:`نسخ معلومات الفيديو`,copyTitleAndUrl:`العنوان + الرابط فقط`,close:`إغلاق`,copiedSummary:`الملخص المنسوخ`,unknownTitle:`عنوان غير معروف`,unknownAuthor:`ناشر غير معروف`,descriptionFailed:`تعذر الحصول على الوصف`,fullCopyText:`العنوان: {title}
الناشر: {author}
URL: {url}
الوصف: {description}`},pt:{controlLabel:`Copiar informacoes do video do YouTube`,controlTitle:`Informacoes do video do YouTube`,copyVideoInfo:`Copiar informacoes do video`,copyTitleAndUrl:`Somente titulo + URL`,close:`Fechar`,copiedSummary:`Resumo copiado`,unknownTitle:`Titulo desconhecido`,unknownAuthor:`Autor desconhecido`,descriptionFailed:`Nao foi possivel obter a descricao`,fullCopyText:`Titulo: {title}
Autor: {author}
URL: {url}
Descricao: {description}`},bn:{controlLabel:`YouTube ভিডিও তথ্য কপি করুন`,controlTitle:`YouTube ভিডিও তথ্য`,copyVideoInfo:`ভিডিও তথ্য কপি করুন`,copyTitleAndUrl:`শুধু শিরোনাম + URL`,close:`বন্ধ`,copiedSummary:`কপি করা সারাংশ`,unknownTitle:`অজানা শিরোনাম`,unknownAuthor:`অজানা প্রকাশক`,descriptionFailed:`বিবরণ পাওয়া যায়নি`,fullCopyText:`শিরোনাম: {title}
প্রকাশক: {author}
URL: {url}
বিবরণ: {description}`},ru:{controlLabel:`Копировать информацию о видео YouTube`,controlTitle:`Информация о видео YouTube`,copyVideoInfo:`Копировать информацию о видео`,copyTitleAndUrl:`Только название + URL`,close:`Закрыть`,copiedSummary:`Скопированное описание`,unknownTitle:`Неизвестное название`,unknownAuthor:`Неизвестный автор`,descriptionFailed:`Не удалось получить описание`,fullCopyText:`Название: {title}
Автор: {author}
URL: {url}
Описание: {description}`},ur:{controlLabel:`YouTube ویڈیو کی معلومات کاپی کریں`,controlTitle:`YouTube ویڈیو کی معلومات`,copyVideoInfo:`ویڈیو کی معلومات کاپی کریں`,copyTitleAndUrl:`صرف عنوان + URL`,close:`بند کریں`,copiedSummary:`کاپی شدہ خلاصہ`,unknownTitle:`نامعلوم عنوان`,unknownAuthor:`نامعلوم ناشر`,descriptionFailed:`تفصیل حاصل نہیں ہو سکی`,fullCopyText:`عنوان: {title}
ناشر: {author}
URL: {url}
تفصیل: {description}`}},defaultLocale:`ja`,fallbackLocale:`en`,aliases:{zh:`zh-Hans`,"zh-cn":`zh-Hans`,"zh-sg":`zh-Hans`}});R.setLocale(R.detectBrowserLocale());var z=R.t,Ee=R.format,De=R.getDirection,Oe=`youtube-info-copier-template`;function ke(){return`
    <style>
        .glass-control-container {
            position: relative;
            pointer-events: none;
        }

        .control-handle {
            width: 6px;
            height: 60px;
            background: rgba(255, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            position: relative;
            z-index: 10;
            box-shadow: 2px 0 8px rgba(255, 0, 0, 0.4);
        }

        .control-handle:hover {
            width: 12px;
            background: rgba(255, 0, 0, 1.0);
            box-shadow: 2px 0 12px rgba(255, 0, 0, 0.6);
        }

        .control-handle:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
        }

        /* 準備中状態 */
        .control-handle.preparing {
            background: rgba(255, 152, 0, 0.8);
            box-shadow: 2px 0 8px rgba(255, 152, 0, 0.4);
            animation: pulse 1s ease-in-out infinite;
        }

        /* 準備完了状態 - ハートバウンシング */
        .control-handle.ready {
            background: rgba(76, 175, 80, 0.9);
            box-shadow: 2px 0 12px rgba(76, 175, 80, 0.6);
            animation: heartBounce 0.8s ease-in-out infinite;
        }

        .control-handle.error {
            background: rgba(244, 67, 54, 0.8);
            box-shadow: 2px 0 8px rgba(244, 67, 54, 0.4);
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        @keyframes heartBounce {
            0%, 100% {
                transform: scale(1);
            }
            10% {
                transform: scale(1.1);
            }
            20% {
                transform: scale(1);
            }
            30% {
                transform: scale(1.15);
            }
            40% {
                transform: scale(1);
            }
        }

        .control-panel {
            position: absolute;
            bottom: 0;
            left: 0;
            min-width: 280px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 0;
            overflow: hidden;
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 9;
            margin-left: 12px;
        }

        .control-panel.expanded {
            opacity: 1;
            transform: translateX(0) scale(1);
            pointer-events: auto;
        }

        .panel-header {
            background: rgba(255, 0, 0, 0.1);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-icon {
            display: inline-flex;
            width: 20px;
            height: 20px;
            color: rgba(255, 255, 255, 0.9);
        }

        .panel-icon svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        .panel-title {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
        }

        .panel-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .panel-button {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: left;
        }

        .panel-button:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .panel-button:active {
            transform: translateY(0);
        }

        .panel-button.primary {
            background: rgba(255, 0, 0, 0.2);
            border-color: rgba(255, 0, 0, 0.3);
            color: rgba(255, 255, 255, 0.95);
        }

        .panel-button.primary:hover {
            background: rgba(255, 0, 0, 0.3);
            border-color: rgba(255, 0, 0, 0.4);
        }

        .panel-button .panel-icon {
            width: 16px;
            height: 16px;
            color: currentColor;
        }

        .popup {
            position: absolute;
            bottom: 100%;
            left: 0;
            min-width: 200px;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            padding: 16px;
            margin-bottom: 8px;
            max-height: 300px;
            overflow-y: auto;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 15;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            pointer-events: none;
            margin-left: 12px;
        }
        
        .popup.show {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        
        .popup-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff0000;
            border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            padding-bottom: 8px;
        }
        
        .popup-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            background: rgba(245, 245, 245, 0.8);
            padding: 8px;
            border-radius: 8px;
            border-left: 3px solid #ff0000;
        }
        
        .popup-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .popup-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }

        .popup-close svg {
            width: 18px;
            height: 18px;
            display: block;
        }

        @media (max-width: 768px) {
            .control-handle { height: 50px; }
            .control-panel { min-width: 240px; }
            .panel-header { padding: 12px 16px; }
            .panel-content { padding: 8px; }
            .panel-button { padding: 10px 12px; font-size: 12px; }
            .popup { max-width: 280px; }
        }

        @media (prefers-contrast: high) {
            .control-handle { background: rgba(255, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
            .control-panel { background: rgba(0, 0, 0, 0.9); border: 2px solid rgba(255, 255, 255, 0.8); }
        }
    </style>
    
    <div class="glass-control-container" dir="${De()}">
        <div class="control-handle" aria-label="${z(`controlLabel`)}" title="${z(`controlTitle`)}" tabindex="0"></div>
        <div class="control-panel">
            <div class="panel-header">
                <span class="panel-icon">${N}</span>
                <span class="panel-title">${z(`controlTitle`)}</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${P}</span>
                    ${z(`copyVideoInfo`)}
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${F}</span>
                    ${z(`copyTitleAndUrl`)}
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="${z(`close`)}">${I}</button>
            <div class="popup-title">${z(`copiedSummary`)}</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}var B=`https://www.nicovideo.jp`;`${B}`,`${B}`;var Ae=`https://twitter.com`,je=`https://t.co`,Me=`https://youtu.be`;`${Ae}`,`${je}`;var Ne=e=>`${Me}/${e}`,Pe=`shared-fab-template`,Fe=class{container=null;shadowRoot=null;isExpanded=!1;expandTimer=null;config;fabSize;constructor(e){this.config=e,this.fabSize=e.size??56}init(){this.container=document.createElement(`div`),this.container.id=`fab-container`,this.container.style.cssText=this.buildPositionStyle(),this.shadowRoot=this.container.attachShadow({mode:`closed`});let e=document.createElement(`style`);e.textContent=this.getStyles(),this.shadowRoot.appendChild(e);let t=document.createElement(`div`);t.className=`fab-wrapper`,c(t,this.buildHTML(),Pe),this.shadowRoot.appendChild(t),this.setupEventListeners(t),this.setupFullscreenListener(),document.body.appendChild(this.container)}destroy(){this.expandTimer&&clearTimeout(this.expandTimer),document.removeEventListener(`fullscreenchange`,this.handleFullscreenChange),document.removeEventListener(`webkitfullscreenchange`,this.handleFullscreenChange),this.container?.remove(),this.container=null,this.shadowRoot=null}setVisible(e){this.container&&(this.container.style.display=e?`block`:`none`)}setColor(e){let t=this.shadowRoot?.querySelector(`.fab-main`);t&&(t.style.background=e)}resetColor(){let e=this.shadowRoot?.querySelector(`.fab-main`);e&&(e.style.background=``)}addMainClass(e){(this.shadowRoot?.querySelector(`.fab-main`))?.classList.add(e)}removeMainClass(e){(this.shadowRoot?.querySelector(`.fab-main`))?.classList.remove(e)}buildPositionStyle(){let{position:e}=this.config,t=[`position: fixed !important`,`z-index: 9999 !important`,`pointer-events: none !important`];return e.top&&t.push(`top: ${e.top} !important`),e.bottom&&t.push(`bottom: ${e.bottom} !important`),e.left&&t.push(`left: ${e.left} !important`),e.right&&t.push(`right: ${e.right} !important`),t.join(`; `)+`;`}buildHTML(){let e=this.config.actions&&this.config.actions.length>0,t=``;return e&&this.config.actions&&(t=`<div class="fab-speed-dial">${this.config.actions.map((e,t)=>`
        <div class="fab-speed-dial-item" data-action-index="${String(t)}">
          <span class="fab-speed-dial-label">${this.escapeHTML(e.label)}</span>
          <button class="fab-mini" aria-label="${this.escapeHTML(e.label)}" data-action-index="${String(t)}">
            <span class="fab-icon">${e.icon}</span>
          </button>
        </div>`).join(``)}</div>`),`
      ${t}
      <button class="fab-main" aria-label="${this.escapeHTML(this.config.label)}" title="${this.escapeHTML(this.config.label)}">
        <span class="fab-icon">${this.config.icon}</span>
      </button>
    `}setupEventListeners(e){if(!this.shadowRoot)return;let t=this.shadowRoot.querySelector(`.fab-main`),n=this.config.actions&&this.config.actions.length>0;if(t){if(this.config.onHover){let e=this.config.onHover;t.addEventListener(`mouseenter`,()=>e())}if(n)t.addEventListener(`mouseenter`,()=>this.expand()),t.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.isExpanded?this.collapse():this.expand()});else if(this.config.onClick){let e=this.config.onClick;t.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e()})}}n&&this.config.actions&&this.shadowRoot.querySelectorAll(`.fab-mini`).forEach(e=>{let t=e.dataset.actionIndex;if(t===void 0)return;let n=parseInt(t,10),r=this.config.actions?.[n];r&&e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),r.onClick(),this.collapse()})}),e.addEventListener(`mouseleave`,()=>{this.isExpanded&&(this.expandTimer=window.setTimeout(()=>this.collapse(),800))}),e.addEventListener(`mouseenter`,()=>{this.expandTimer&&=(clearTimeout(this.expandTimer),null)})}expand(){if(this.isExpanded)return;this.isExpanded=!0,(this.shadowRoot?.querySelector(`.fab-speed-dial`))?.classList.add(`expanded`);let e=this.shadowRoot?.querySelector(`.fab-wrapper`);e instanceof HTMLElement&&(e.style.pointerEvents=`auto`)}collapse(){if(!this.isExpanded)return;this.isExpanded=!1,(this.shadowRoot?.querySelector(`.fab-speed-dial`))?.classList.remove(`expanded`);let e=this.shadowRoot?.querySelector(`.fab-wrapper`);e instanceof HTMLElement&&(e.style.pointerEvents=``)}handleFullscreenChange=()=>{let e=!!document.fullscreenElement;this.container&&(this.container.style.display=e?`none`:`block`)};setupFullscreenListener(){document.addEventListener(`fullscreenchange`,this.handleFullscreenChange),document.addEventListener(`webkitfullscreenchange`,this.handleFullscreenChange)}escapeHTML(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}getStyles(){let{color:e}=this.config,t=this.fabSize,n=Math.round(t*.72);return`
      .fab-wrapper {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }

      .fab-main {
        width: ${String(t)}px;
        height: ${String(t)}px;
        border-radius: 50%;
        background: ${e};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        position: relative;
        z-index: 10;
      }

      .fab-main:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .fab-main:active {
        transform: scale(0.95);
      }

      .fab-icon {
        display: inline-flex;
        width: 24px;
        height: 24px;
        color: #fff;
      }

      .fab-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Speed dial */
      .fab-speed-dial {
        position: absolute;
        bottom: ${String(t+12)}px;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 10px;
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .fab-speed-dial.expanded {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .fab-speed-dial-item {
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }

      .fab-speed-dial-label {
        background: rgba(33, 33, 33, 0.85);
        backdrop-filter: blur(8px);
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(8px);
        transition: all 0.2s ease;
      }

      .fab-speed-dial.expanded .fab-speed-dial-label {
        opacity: 1;
        transform: translateX(0);
      }

      .fab-mini {
        width: ${String(n)}px;
        height: ${String(n)}px;
        border-radius: 50%;
        background: ${e};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fab-mini:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      }

      .fab-mini .fab-icon {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 768px) {
        .fab-main {
          width: ${String(Math.round(t*.85))}px;
          height: ${String(Math.round(t*.85))}px;
        }
        .fab-mini {
          width: ${String(Math.round(n*.85))}px;
          height: ${String(Math.round(n*.85))}px;
        }
        .fab-speed-dial-label {
          font-size: 11px;
          padding: 4px 10px;
        }
      }

      @media (prefers-contrast: high) {
        .fab-main,
        .fab-mini {
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
      }
    `}},Ie=class{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=!1;expandTimer=null;logger=r(`youtube-info-copier`);descriptionExpanded=!1;preExpandPromise=null;fab=null;launchStyle;constructor(e=`classic`){this.launchStyle=e,this.init()}init(){switch(this.launchStyle){case`classic`:this.createShadowDOM(),this.setupFullscreenListener();break;case`fab`:this.createFab();break;case`menu-only`:break;default:this.launchStyle}this.logger.info(`YouTubeInfoCopier initialized (style: ${this.launchStyle})`)}createFab(){this.fab=new Fe({icon:P,color:`rgba(255, 0, 0, 0.9)`,position:{bottom:`20px`,left:`20px`},label:z(`controlLabel`),onHover:()=>this.preExpandDescription(),actions:[{icon:P,label:z(`copyVideoInfo`),onClick:()=>{this.performCopy(`copy`)}},{icon:F,label:z(`copyTitleAndUrl`),onClick:()=>{this.performCopy(`quick-copy`)}}]}),this.fab.init()}async performCopy(e){try{switch(e===`copy`&&await this.ensureDescriptionExpanded(),e){case`copy`:await this.copyVideoInfo();break;case`quick-copy`:await this.copyQuickInfo();break}}catch(e){this.logger.error(`performCopy failed:`,e)}}async ensureDescriptionExpanded(){this.descriptionExpanded||(this.preExpandPromise||=(this.setFabPreparingState(),v(5e3).then(()=>{this.descriptionExpanded=!0,this.setFabReadyState()}).catch(e=>{this.logger.warn(`Description expansion failed:`,e),this.setFabErrorState()})),await this.preExpandPromise)}createShadowDOM(){this.container=document.createElement(`div`),this.container.id=`youtube-info-copier-container`,this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:`closed`}),c(this.shadowRoot,ke(),Oe),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(`.control-handle`),this.panelElement=this.shadowRoot.querySelector(`.control-panel`),this.popup=this.shadowRoot.querySelector(`.popup`),this.setupEventListeners()}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;let e=this.shadowRoot.querySelector(`.popup-close`);this.handleElement.addEventListener(`mouseenter`,()=>{this.expandPanel(),this.preExpandDescription()}),this.panelElement.addEventListener(`mouseenter`,()=>this.expandPanel()),this.container.addEventListener(`mouseleave`,e=>{this.container?.contains(e.relatedTarget)||this.collapsePanel()}),this.shadowRoot.querySelectorAll(`.panel-button`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),this.handleButtonClick(e.dataset.action||``)})}),this.handleElement.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.handleButtonClick(`copy`))}),e?.addEventListener(`click`,()=>this.hidePopup()),document.addEventListener(`click`,e=>{this.container?.contains(e.target)||this.hidePopup()})}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=!0,this.panelElement.classList.add(`expanded`),this.container.style.pointerEvents=`auto`)}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=!1,this.panelElement?.classList.remove(`expanded`),this.container.style.pointerEvents=`none`},1e3))}async handleButtonClick(e){try{if(e===`copy`&&!this.descriptionExpanded){this.logger.info(`Description not ready yet, please wait for animation...`),this.showNotReadyFeedback();return}(e===`copy`||e===`quick-copy`)&&await this.performCopy(e)}catch(e){this.logger.error(`Error handling button click:`,e)}}preExpandDescription(){this.descriptionExpanded||this.preExpandPromise||(this.logger.info(`Pre-expanding description...`),this.setPreparingState(),this.setFabPreparingState(),this.preExpandPromise=v(5e3).then(()=>{this.descriptionExpanded=!0,this.setReadyState(),this.setFabReadyState(),this.logger.info(`Pre-expansion completed - ready to copy!`)}).catch(e=>{this.logger.warn(`Pre-expansion failed:`,e),this.setErrorState(),this.setFabErrorState()}))}setPreparingState(){this.handleElement&&(this.handleElement.classList.add(`preparing`),this.handleElement.classList.remove(`ready`,`error`))}setReadyState(){this.handleElement&&(this.handleElement.classList.remove(`preparing`,`error`),this.handleElement.classList.add(`ready`),this.handleElement.setAttribute(`data-status`,`ready`))}setErrorState(){this.handleElement&&(this.handleElement.classList.remove(`preparing`,`ready`),this.handleElement.classList.add(`error`))}clearState(){this.handleElement&&(this.handleElement.classList.remove(`preparing`,`ready`,`error`),this.handleElement.removeAttribute(`data-status`))}setFabPreparingState(){this.fab?.setColor(`rgba(255, 152, 0, 0.9)`)}setFabReadyState(){this.fab?.setColor(`rgba(76, 175, 80, 0.9)`)}setFabErrorState(){this.fab?.setColor(`rgba(244, 67, 54, 0.9)`)}async writeToClipboard(e){h(e,`text`)}async copyQuickInfo(){try{let e=await this.getVideoInfo(),t=`${e.title}\n${e.url}`;await this.writeToClipboard(t),this.showSuccessFeedback()}catch(e){this.logger.error(`クイックコピーエラー:`,e),this.showErrorFeedback()}}async getVideoInfo(){let e=e=>e.map(e=>document.querySelector(e)).find(e=>e!==null)??null,t=e(g.titleCandidates)?.textContent?.trim()||z(`unknownTitle`),n=e(g.channelCandidates)?.textContent?.trim()||z(`unknownAuthor`),r=new URLSearchParams(window.location.search).get(`v`)||window.location.pathname.split(`/`).pop(),i=r?Ne(r):window.location.href;this.descriptionExpanded?this.logger.debug(`Description already expanded, fetching immediately`):this.logger.warn(`getVideoInfo called before description expanded`);let a=z(`descriptionFailed`);for(let e of g.descriptionExpandedContent){let t=document.querySelector(e);if(t){let n=(t.textContent||t.innerText||``).trim();if(n&&n.length>50){a=n,this.logger.debug(`Description found using selector: ${e}`);break}}}if(a===z(`descriptionFailed`)){let e=document.querySelector(g.descriptionRoot);if(e){let t=e.querySelector(`#expanded`);if(t){let e=(t.textContent||t.innerText||``).trim();e&&e.length>50&&(a=e,this.logger.debug(`Description found in #expanded div`))}if(a===z(`descriptionFailed`)){let t=(e.innerText||``).trim().replace(/\.\.\.もっと見る\n?/g,``).replace(/一部を表示\n?/g,``).trim();t&&t.length>10&&(a=t,this.logger.debug(`Description found using innerText`))}}}return{title:t,author:n,url:i,description:a}}async copyVideoInfo(){try{let e=await this.getVideoInfo(),t=Ee(`fullCopyText`,{title:e.title,author:e.author,url:e.url,description:e.description});await this.writeToClipboard(t),this.showPopup(e.description),this.showSuccessFeedback(),this.logger.info(`Video info copied successfully`)}catch(e){this.logger.error(`コピーエラー:`,e),this.showErrorFeedback()}}showSuccessFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background=`rgba(76, 175, 80, 0.8)`,this.handleElement.style.boxShadow=`2px 0 12px rgba(76, 175, 80, 0.4)`,setTimeout(()=>{this.handleElement&&(this.handleElement.style.background=``,this.handleElement.style.boxShadow=``)},1500)):this.fab&&(this.fab.setColor(`rgba(76, 175, 80, 0.9)`),setTimeout(()=>this.fab?.resetColor(),1500))}showErrorFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background=`rgba(244, 67, 54, 0.8)`,this.handleElement.style.boxShadow=`2px 0 12px rgba(244, 67, 54, 0.4)`,setTimeout(()=>{this.handleElement&&(this.handleElement.style.background=``,this.handleElement.style.boxShadow=``)},1500)):this.fab&&(this.fab.setColor(`rgba(244, 67, 54, 0.9)`),setTimeout(()=>this.fab?.resetColor(),1500))}showNotReadyFeedback(){this.handleElement?(this.handleElement.style.background=`rgba(255, 152, 0, 0.8)`,this.handleElement.style.boxShadow=`2px 0 12px rgba(255, 152, 0, 0.4)`,setTimeout(()=>{this.handleElement&&(this.handleElement.style.background=``,this.handleElement.style.boxShadow=``)},800)):this.fab&&(this.fab.setColor(`rgba(255, 152, 0, 0.9)`),setTimeout(()=>this.fab?.resetColor(),800))}showPopup(e){if(!this.shadowRoot||!this.popup)return;let t=this.shadowRoot.querySelector(`.popup-content`);t&&(t.textContent=e),this.popup.classList.add(`show`),setTimeout(()=>this.hidePopup(),3e3)}hidePopup(){this.popup?.classList.remove(`show`)}handleFullscreenChange=()=>{let e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?`none`:`block`)};setupFullscreenListener(){[`fullscreenchange`,`webkitfullscreenchange`,`mozfullscreenchange`,`MSFullscreenChange`].forEach(e=>{document.addEventListener(e,this.handleFullscreenChange,!1)}),this.handleFullscreenChange()}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),[`fullscreenchange`,`webkitfullscreenchange`,`mozfullscreenchange`,`MSFullscreenChange`].forEach(e=>document.removeEventListener(e,this.handleFullscreenChange,!1)),this.container?.remove(),this.fab?.destroy(),this.fab=null,this.descriptionExpanded=!1,this.preExpandPromise=null,this.logger.info(`YouTubeInfoCopier instance destroyed.`)}catch(e){this.logger.error(`Error during cleanup:`,e)}}},V=[`classic`,`fab`,`menu-only`],H={classic:`従来スタイル`,fab:`FABボタン`,"menu-only":`メニューのみ`},U=`launch-style-`,W=we({translations:{ja:{changeLaunchStyle:`起動スタイル変更`,current:`現在`,styleChanged:`起動スタイルを「{style}」に変更しました。`,reloadToApply:`ページを再読み込みすると反映されます。`,style_classic:H.classic,style_fab:H.fab,"style_menu-only":H[`menu-only`]},en:{changeLaunchStyle:`Change launch style`,current:`Current`,styleChanged:`Changed launch style to "{style}".`,reloadToApply:`Reload the page to apply it.`,style_classic:`Classic style`,style_fab:`FAB button`,"style_menu-only":`Menu only`},"zh-Hans":{changeLaunchStyle:`更改启动样式`,current:`当前`,styleChanged:`已将启动样式更改为“{style}”。`,reloadToApply:`重新加载页面后生效。`,style_classic:`经典样式`,style_fab:`FAB 按钮`,"style_menu-only":`仅菜单`},hi:{changeLaunchStyle:`लॉन्च शैली बदलें`,current:`वर्तमान`,styleChanged:`लॉन्च शैली "{style}" में बदल दी गई है।`,reloadToApply:`लागू करने के लिए पेज फिर से लोड करें।`,style_classic:`क्लासिक शैली`,style_fab:`FAB बटन`,"style_menu-only":`केवल मेन्यू`},es:{changeLaunchStyle:`Cambiar estilo de inicio`,current:`Actual`,styleChanged:`Estilo de inicio cambiado a "{style}".`,reloadToApply:`Recarga la página para aplicarlo.`,style_classic:`Estilo clásico`,style_fab:`Botón FAB`,"style_menu-only":`Solo menú`},fr:{changeLaunchStyle:`Changer le style de lancement`,current:`Actuel`,styleChanged:`Style de lancement défini sur "{style}".`,reloadToApply:`Rechargez la page pour appliquer le changement.`,style_classic:`Style classique`,style_fab:`Bouton FAB`,"style_menu-only":`Menu uniquement`},ar:{changeLaunchStyle:`تغيير نمط التشغيل`,current:`الحالي`,styleChanged:`تم تغيير نمط التشغيل إلى "{style}".`,reloadToApply:`أعد تحميل الصفحة لتطبيق التغيير.`,style_classic:`النمط الكلاسيكي`,style_fab:`زر FAB`,"style_menu-only":`القائمة فقط`},pt:{changeLaunchStyle:`Alterar estilo de abertura`,current:`Atual`,styleChanged:`Estilo de abertura alterado para "{style}".`,reloadToApply:`Recarregue a página para aplicar.`,style_classic:`Estilo clássico`,style_fab:`Botão FAB`,"style_menu-only":`Somente menu`},bn:{changeLaunchStyle:`লঞ্চ শৈলী পরিবর্তন করুন`,current:`বর্তমান`,styleChanged:`লঞ্চ শৈলী "{style}" করা হয়েছে।`,reloadToApply:`প্রয়োগ করতে পেজটি আবার লোড করুন।`,style_classic:`ক্লাসিক শৈলী`,style_fab:`FAB বোতাম`,"style_menu-only":`শুধু মেনু`},ru:{changeLaunchStyle:`Изменить стиль запуска`,current:`Текущий`,styleChanged:`Стиль запуска изменен на "{style}".`,reloadToApply:`Перезагрузите страницу, чтобы применить изменение.`,style_classic:`Классический стиль`,style_fab:`Кнопка FAB`,"style_menu-only":`Только меню`},ur:{changeLaunchStyle:`لانچ اسٹائل تبدیل کریں`,current:`موجودہ`,styleChanged:`لانچ اسٹائل "{style}" میں تبدیل کر دیا گیا ہے۔`,reloadToApply:`لاگو کرنے کے لیے صفحہ دوبارہ لوڈ کریں۔`,style_classic:`کلاسک انداز`,style_fab:`FAB بٹن`,"style_menu-only":`صرف مینو`}},defaultLocale:`ja`,fallbackLocale:`en`});W.setLocale(W.detectBrowserLocale());function G(e){return W.t(`style_${e}`)}function K(e,t=`classic`){let n=ee(`${U}${e}`);return typeof n==`string`&&V.includes(n)?n:t}function q(e,t){m(`${U}${e}`,t)}function Le(e){return V[(V.indexOf(e)+1)%V.length]}function Re(e,t){let n=K(e);p(`${W.t(`changeLaunchStyle`)} [${W.t(`current`)}: ${G(n)}]`,()=>{let n=Le(K(e));q(e,n),t?.(n),alert(`${W.format(`styleChanged`,{style:G(n)})}\n${W.t(`reloadToApply`)}`)})}var J=window.location.href,Y=null;Re(`youtube-info-copier`);function ze(){return K(`youtube-info-copier`)}function X(){if(window.location.pathname!==`/watch`){Y=null;return}Y=new Ie(ze())}function Z(){return window.location.pathname===`/watch`?(Y||X(),Y):null}p(z(`copyVideoInfo`),()=>{Z()?.performCopy(`copy`)}),p(z(`copyTitleAndUrl`),()=>{Z()?.performCopy(`quick-copy`)});function Q(){Y&&=(Y.destroy(),null),window.location.pathname===`/watch`&&setTimeout(()=>{X()},1e3)}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,Q):Q();function $(){let e=document.body;if(!e){let e=()=>{document.removeEventListener(`DOMContentLoaded`,e),$()};document.addEventListener(`DOMContentLoaded`,e);return}new MutationObserver(()=>{window.location.href!==J&&(J=window.location.href,Q())}).observe(e,{childList:!0,subtree:!0})}$()})();
