// ==UserScript==
// @name         youtube-info-copier
// @namespace    youtubeInfoCopier
// @version      2.6.0
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

(function () {
  'use strict';

  const R={debug:"debug",info:"info",warn:"warn",error:"error"},$={debug:10,info:20,warn:30,error:40};let G=n=>$[n]>=$.warn;const I=n=>{const e=`[${n}]`,t={};return Object.keys(R).forEach(o=>{const r=R[o];t[o]=(...a)=>{if(!G(o))return;(console[r]??console.log)(e,...a);};}),t},_=new WeakMap;function j(n){const{trustedTypes:e}=n;return !e||typeof e.createPolicy!="function"?null:e}function N(n,e){let t=_.get(n);t||(t=new Map,_.set(n,t));const o=t.get(e);if(o)return o;const r=n.createPolicy(e,{createHTML:a=>a});return r?(t.set(e,r),r):null}function X(n,e,t=window){const o=j(t);if(!o)return n;const r=N(o,e);return r?r.createHTML(n):n}function B(n,e,t){const r=(n.ownerDocument??document).defaultView??window,a=X(e,t,r);if(typeof a=="string"){n.innerHTML=a;return}n.innerHTML=a;}var Z=typeof GM_getValue<"u"?GM_getValue:void 0,K=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,Q=typeof GM_setClipboard<"u"?GM_setClipboard:void 0,W=typeof GM_setValue<"u"?GM_setValue:void 0;function A(n,e){K(n,e);}function J(n,e){W(n,e);}function ee(n,e){return Z(n,e)}function te(n,e){Q(n,e);}const b={descriptionCandidates:["#description","ytd-expander#description","#meta-contents #description","#meta-contents"],inlineExpander:"ytd-text-inline-expander",inlineExpanderById:"ytd-text-inline-expander#description-inline-expander",interactiveElements:"tp-yt-paper-button, button, a",titleCandidates:["h1.ytd-watch-metadata yt-formatted-string","#title h1 yt-formatted-string","h1.title"],channelCandidates:["#owner #channel-name a","ytd-channel-name a",".ytd-video-owner-renderer a","#upload-info #channel-name a","#owner-text a"],descriptionRoot:"#description-inline-expander",descriptionExpandedContent:["#description-inline-expander #expanded yt-attributed-string","#description-inline-expander #expanded yt-formatted-string","#description-inline-expander #snippet yt-attributed-string"]},h=I("youtube-info-copier:dom-utils");async function H(n=4e3){const e=b.descriptionCandidates.map(a=>document.querySelector(a)).find(Boolean);if(!e)return;const t=()=>{const a=e.querySelector(b.inlineExpander)||document.querySelector(b.inlineExpanderById);if(a?.hasAttribute("is-expanded"))return h.debug("Already has is-expanded attribute"),true;const c=document.querySelector("tp-yt-paper-button#expand");if(c&&c.textContent?.includes("もっと見る"))try{return h.debug("Clicking tp-yt-paper-button#expand directly"),c.click(),h.info("概要欄の「もっと見る」ボタンをクリックしました。"),!0}catch(i){h.warn("Direct click failed:",i);}const p=/(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i,d=[];a&&d.push(...Array.from(a.querySelectorAll(b.interactiveElements))),d.push(...Array.from(document.querySelectorAll(b.interactiveElements)));for(const i of d)try{const s=(i.textContent||"").trim();if((i.getAttribute("aria-expanded")==="false"||p.test(s)||i.id&&/expand|more|collapse/i.test(i.id))&&typeof i.click=="function")return h.debug(`Clicking element: ${i.tagName}#${i.id} "${s}"`),i.click(),h.info("概要欄の「もっと見る」ボタンをクリックしました（フォールバック）。"),!0}catch{}return h.warn("No expand button found"),false},o=()=>{const a=e.querySelector(b.inlineExpander)||document.querySelector(b.inlineExpanderById),c=(a||e).querySelector("#expanded");if(c){const p=(c.textContent||c.innerText||"").trim();if(p&&p.length>200)return h.debug(`Description is expanded (found ${p.length} chars in #expanded)`),true}if(a?.hasAttribute("is-expanded")&&c){const p=(c.textContent||c.innerText||"").trim();return p&&p.length>200?true:(h.debug("is-expanded attr found but content not yet loaded"),false)}return  false};if(!(o()||!t()))return new Promise(a=>{const c=Date.now();let p=0,d=null,i=null;const s=()=>{d&&(d.disconnect(),d=null),i&&(clearInterval(i),i=null);},l=L=>{p++;const y=e.querySelector("#expanded"),F=y?(y.textContent||"").trim().length:0,M=o(),w=Date.now()-c;return h.debug(`Check ${p} (${L}): expanded=${M}, #expanded length=${F}, elapsed=${w}ms`),M?(s(),h.info(`Description expanded successfully (#expanded: ${F} chars) after ${w}ms`),setTimeout(()=>a(),200),true):w>n?(s(),h.warn(`Description expansion timed out after ${w}ms (${p} checks)`),a(),true):false},f=e.querySelector("#expanded");f&&(d=new MutationObserver(()=>{l("mutation");}),d.observe(f,{childList:true,subtree:true,characterData:true}),h.debug("MutationObserver started on #expanded")),i=window.setInterval(()=>{l("poll");},200),l("initial");})}var ne="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",oe="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",ie="M7,2V13H10V22L17,10H13L17,2H7Z",ae="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z";function E(n,e=24){const t=String(e),o=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${n}"></path></svg>`}const re=E(ae),S=E(oe),D=E(ie),se=E(ne),le=["en","zh-Hans","hi","es","fr","ar","pt","bn","ru","ur"],ce=["ja",...le],de=new Set(["ar","ur"]),pe={zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans","zh-my":"zh-Hans",cmn:"zh-Hans","cmn-hans":"zh-Hans","cmn-hans-cn":"zh-Hans","pt-br":"pt","pt-pt":"pt","ar-sa":"ar","ar-ae":"ar","ar-eg":"ar","ur-pk":"ur","ur-in":"ur"};function ue(n){return de.has(n)?"rtl":"ltr"}function he(n,e,t){const o=n[t],r={},a=n;for(const c of e)r[c]={...o,...a[c]??{}};return r}function fe(n,e){return he(n,ce,e)}function be(n){return P({...n,aliases:{...pe,...n.aliases??{}},translations:fe(n.translations,n.fallbackLocale)})}function me(n,e){return n.replace(/\{([a-zA-Z0-9_]+)\}/g,(t,o)=>{const r=e[o];return r===void 0?t:String(r)})}function P(n){const e=Object.keys(n.translations);let t=n.defaultLocale;const o=i=>{const s=i.toLowerCase(),l=n.aliases?.[s];if(l)return l;const f=e.find(y=>y.toLowerCase()===s);if(f)return f;const L=s.split("-")[0];return e.find(y=>y.toLowerCase().split("-")[0]===L)??null},r=()=>{const i=navigator.languages.length>0?navigator.languages:[navigator.language];for(const s of i){const l=o(s);if(l)return l}return n.fallbackLocale},a=i=>{const s=n.translations[t]?.[i];if(s)return s;const l=n.translations[n.fallbackLocale]?.[i];return l||(n.translations[n.defaultLocale]?.[i]??i)};return {locales:e,getLocale:()=>t,setLocale:i=>{t=i;},detectBrowserLocale:r,t:a,format:(i,s)=>me(a(i),s),getTranslations:(i=t)=>n.translations[i]??n.translations[n.fallbackLocale],getDirection:(i=t)=>ue(i),getMissingTranslationKeys:i=>{const s=n.translations[n.fallbackLocale],l=n.translations[i];return Object.keys(s).filter(f=>!l[f])}}}const ge={ja:{controlLabel:"YouTube動画情報コピー",controlTitle:"YouTube動画情報",copyVideoInfo:"動画情報をコピー",copyTitleAndUrl:"タイトル+URLのみ",close:"閉じる",copiedSummary:"コピーした概要",unknownTitle:"タイトル不明",unknownAuthor:"投稿者不明",descriptionFailed:"概要取得に失敗しました",fullCopyText:`タイトル：{title}
投稿者名：{author}
URL：{url}
概要：{description}`},en:{controlLabel:"Copy YouTube video info",controlTitle:"YouTube video info",copyVideoInfo:"Copy video info",copyTitleAndUrl:"Title + URL only",close:"Close",copiedSummary:"Copied summary",unknownTitle:"Unknown title",unknownAuthor:"Unknown author",descriptionFailed:"Failed to get description",fullCopyText:`Title: {title}
Author: {author}
URL: {url}
Description: {description}`},"zh-Hans":{controlLabel:"复制 YouTube 视频信息",controlTitle:"YouTube 视频信息",copyVideoInfo:"复制视频信息",copyTitleAndUrl:"仅标题 + URL",close:"关闭",copiedSummary:"已复制的简介",unknownTitle:"未知标题",unknownAuthor:"未知作者",descriptionFailed:"无法获取简介",fullCopyText:`标题：{title}
作者：{author}
URL：{url}
简介：{description}`},hi:{controlLabel:"YouTube वीडियो जानकारी कॉपी करें",controlTitle:"YouTube वीडियो जानकारी",copyVideoInfo:"वीडियो जानकारी कॉपी करें",copyTitleAndUrl:"केवल शीर्षक + URL",close:"बंद करें",copiedSummary:"कॉपी किया गया सारांश",unknownTitle:"अज्ञात शीर्षक",unknownAuthor:"अज्ञात लेखक",descriptionFailed:"विवरण प्राप्त नहीं हो सका",fullCopyText:`शीर्षक: {title}
लेखक: {author}
URL: {url}
विवरण: {description}`},es:{controlLabel:"Copiar informacion del video de YouTube",controlTitle:"Informacion del video de YouTube",copyVideoInfo:"Copiar informacion del video",copyTitleAndUrl:"Solo titulo + URL",close:"Cerrar",copiedSummary:"Resumen copiado",unknownTitle:"Titulo desconocido",unknownAuthor:"Autor desconocido",descriptionFailed:"No se pudo obtener la descripcion",fullCopyText:`Titulo: {title}
Autor: {author}
URL: {url}
Descripcion: {description}`},fr:{controlLabel:"Copier les infos de la video YouTube",controlTitle:"Infos de la video YouTube",copyVideoInfo:"Copier les infos de la video",copyTitleAndUrl:"Titre + URL seulement",close:"Fermer",copiedSummary:"Resume copie",unknownTitle:"Titre inconnu",unknownAuthor:"Auteur inconnu",descriptionFailed:"Impossible d'obtenir la description",fullCopyText:`Titre: {title}
Auteur: {author}
URL: {url}
Description: {description}`},ar:{controlLabel:"نسخ معلومات فيديو YouTube",controlTitle:"معلومات فيديو YouTube",copyVideoInfo:"نسخ معلومات الفيديو",copyTitleAndUrl:"العنوان + الرابط فقط",close:"إغلاق",copiedSummary:"الملخص المنسوخ",unknownTitle:"عنوان غير معروف",unknownAuthor:"ناشر غير معروف",descriptionFailed:"تعذر الحصول على الوصف",fullCopyText:`العنوان: {title}
الناشر: {author}
URL: {url}
الوصف: {description}`},pt:{controlLabel:"Copiar informacoes do video do YouTube",controlTitle:"Informacoes do video do YouTube",copyVideoInfo:"Copiar informacoes do video",copyTitleAndUrl:"Somente titulo + URL",close:"Fechar",copiedSummary:"Resumo copiado",unknownTitle:"Titulo desconhecido",unknownAuthor:"Autor desconhecido",descriptionFailed:"Nao foi possivel obter a descricao",fullCopyText:`Titulo: {title}
Autor: {author}
URL: {url}
Descricao: {description}`},bn:{controlLabel:"YouTube ভিডিও তথ্য কপি করুন",controlTitle:"YouTube ভিডিও তথ্য",copyVideoInfo:"ভিডিও তথ্য কপি করুন",copyTitleAndUrl:"শুধু শিরোনাম + URL",close:"বন্ধ",copiedSummary:"কপি করা সারাংশ",unknownTitle:"অজানা শিরোনাম",unknownAuthor:"অজানা প্রকাশক",descriptionFailed:"বিবরণ পাওয়া যায়নি",fullCopyText:`শিরোনাম: {title}
প্রকাশক: {author}
URL: {url}
বিবরণ: {description}`},ru:{controlLabel:"Копировать информацию о видео YouTube",controlTitle:"Информация о видео YouTube",copyVideoInfo:"Копировать информацию о видео",copyTitleAndUrl:"Только название + URL",close:"Закрыть",copiedSummary:"Скопированное описание",unknownTitle:"Неизвестное название",unknownAuthor:"Неизвестный автор",descriptionFailed:"Не удалось получить описание",fullCopyText:`Название: {title}
Автор: {author}
URL: {url}
Описание: {description}`},ur:{controlLabel:"YouTube ویڈیو کی معلومات کاپی کریں",controlTitle:"YouTube ویڈیو کی معلومات",copyVideoInfo:"ویڈیو کی معلومات کاپی کریں",copyTitleAndUrl:"صرف عنوان + URL",close:"بند کریں",copiedSummary:"کاپی شدہ خلاصہ",unknownTitle:"نامعلوم عنوان",unknownAuthor:"نامعلوم ناشر",descriptionFailed:"تفصیل حاصل نہیں ہو سکی",fullCopyText:`عنوان: {title}
ناشر: {author}
URL: {url}
تفصیل: {description}`}},x=P({translations:ge,defaultLocale:"ja",fallbackLocale:"en",aliases:{zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans"}});x.setLocale(x.detectBrowserLocale());const u=x.t,ye=x.format,xe=x.getDirection,we="youtube-info-copier-template";function Te(){return `
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
    
    <div class="glass-control-container" dir="${xe()}">
        <div class="control-handle" aria-label="${u("controlLabel")}" title="${u("controlTitle")}" tabindex="0"></div>
        <div class="control-panel">
            <div class="panel-header">
                <span class="panel-icon">${re}</span>
                <span class="panel-title">${u("controlTitle")}</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="copy">
                    <span class="panel-icon">${S}</span>
                    ${u("copyVideoInfo")}
                </button>
                <button class="panel-button" data-action="quick-copy">
                    <span class="panel-icon">${D}</span>
                    ${u("copyTitleAndUrl")}
                </button>
            </div>
        </div>
        
        <div class="popup">
            <button class="popup-close" aria-label="${u("close")}">${se}</button>
            <div class="popup-title">${u("copiedSummary")}</div>
            <div class="popup-content"></div>
        </div>
    </div>
  `}const Ee="https://youtu.be",Le=n=>`${Ee}/${n}`,ve="shared-fab-template";class Se{container=null;shadowRoot=null;isExpanded=false;expandTimer=null;config;fabSize;constructor(e){this.config=e,this.fabSize=e.size??56;}init(){this.container=document.createElement("div"),this.container.id="fab-container",this.container.style.cssText=this.buildPositionStyle(),this.shadowRoot=this.container.attachShadow({mode:"closed"});const e=document.createElement("style");e.textContent=this.getStyles(),this.shadowRoot.appendChild(e);const t=document.createElement("div");t.className="fab-wrapper",B(t,this.buildHTML(),ve),this.shadowRoot.appendChild(t),this.setupEventListeners(t),this.setupFullscreenListener(),document.body.appendChild(this.container);}destroy(){this.expandTimer&&clearTimeout(this.expandTimer),document.removeEventListener("fullscreenchange",this.handleFullscreenChange),document.removeEventListener("webkitfullscreenchange",this.handleFullscreenChange),this.container?.remove(),this.container=null,this.shadowRoot=null;}setVisible(e){this.container&&(this.container.style.display=e?"block":"none");}setColor(e){const t=this.shadowRoot?.querySelector(".fab-main");t&&(t.style.background=e);}resetColor(){const e=this.shadowRoot?.querySelector(".fab-main");e&&(e.style.background="");}addMainClass(e){this.shadowRoot?.querySelector(".fab-main")?.classList.add(e);}removeMainClass(e){this.shadowRoot?.querySelector(".fab-main")?.classList.remove(e);}buildPositionStyle(){const{position:e}=this.config,t=["position: fixed !important","z-index: 9999 !important","pointer-events: none !important"];return e.top&&t.push(`top: ${e.top} !important`),e.bottom&&t.push(`bottom: ${e.bottom} !important`),e.left&&t.push(`left: ${e.left} !important`),e.right&&t.push(`right: ${e.right} !important`),t.join("; ")+";"}buildHTML(){const e=this.config.actions&&this.config.actions.length>0;let t="";return e&&this.config.actions&&(t=`<div class="fab-speed-dial">${this.config.actions.map((r,a)=>`
        <div class="fab-speed-dial-item" data-action-index="${String(a)}">
          <span class="fab-speed-dial-label">${this.escapeHTML(r.label)}</span>
          <button class="fab-mini" aria-label="${this.escapeHTML(r.label)}" data-action-index="${String(a)}">
            <span class="fab-icon">${r.icon}</span>
          </button>
        </div>`).join("")}</div>`),`
      ${t}
      <button class="fab-main" aria-label="${this.escapeHTML(this.config.label)}" title="${this.escapeHTML(this.config.label)}">
        <span class="fab-icon">${this.config.icon}</span>
      </button>
    `}setupEventListeners(e){if(!this.shadowRoot)return;const t=this.shadowRoot.querySelector(".fab-main"),o=this.config.actions&&this.config.actions.length>0;if(t){if(this.config.onHover){const r=this.config.onHover;t.addEventListener("mouseenter",()=>r());}if(o)t.addEventListener("mouseenter",()=>this.expand()),t.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.isExpanded?this.collapse():this.expand();});else if(this.config.onClick){const r=this.config.onClick;t.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),r();});}}o&&this.config.actions&&this.shadowRoot.querySelectorAll(".fab-mini").forEach(a=>{const c=a.dataset.actionIndex;if(c===void 0)return;const p=parseInt(c,10),d=this.config.actions?.[p];d&&a.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),d.onClick(),this.collapse();});}),e.addEventListener("mouseleave",()=>{this.isExpanded&&(this.expandTimer=window.setTimeout(()=>this.collapse(),800));}),e.addEventListener("mouseenter",()=>{this.expandTimer&&(clearTimeout(this.expandTimer),this.expandTimer=null);});}expand(){if(this.isExpanded)return;this.isExpanded=true,this.shadowRoot?.querySelector(".fab-speed-dial")?.classList.add("expanded");const t=this.shadowRoot?.querySelector(".fab-wrapper");t instanceof HTMLElement&&(t.style.pointerEvents="auto");}collapse(){if(!this.isExpanded)return;this.isExpanded=false,this.shadowRoot?.querySelector(".fab-speed-dial")?.classList.remove("expanded");const t=this.shadowRoot?.querySelector(".fab-wrapper");t instanceof HTMLElement&&(t.style.pointerEvents="");}handleFullscreenChange=()=>{const e=!!document.fullscreenElement;this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){document.addEventListener("fullscreenchange",this.handleFullscreenChange),document.addEventListener("webkitfullscreenchange",this.handleFullscreenChange);}escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}getStyles(){const{color:e}=this.config,t=this.fabSize,o=Math.round(t*.72);return `
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
        width: ${String(o)}px;
        height: ${String(o)}px;
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
          width: ${String(Math.round(o*.85))}px;
          height: ${String(Math.round(o*.85))}px;
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
    `}}class Ce{container=null;shadowRoot=null;handleElement=null;panelElement=null;popup=null;isExpanded=false;expandTimer=null;logger=I("youtube-info-copier");descriptionExpanded=false;preExpandPromise=null;fab=null;launchStyle;constructor(e="classic"){this.launchStyle=e,this.init();}init(){switch(this.launchStyle){case "classic":this.createShadowDOM(),this.setupFullscreenListener();break;case "fab":this.createFab();break;case "menu-only":break;default:this.launchStyle;}this.logger.info(`YouTubeInfoCopier initialized (style: ${this.launchStyle})`);}createFab(){this.fab=new Se({icon:S,color:"rgba(255, 0, 0, 0.9)",position:{bottom:"20px",left:"20px"},label:u("controlLabel"),onHover:()=>this.preExpandDescription(),actions:[{icon:S,label:u("copyVideoInfo"),onClick:()=>{this.performCopy("copy");}},{icon:D,label:u("copyTitleAndUrl"),onClick:()=>{this.performCopy("quick-copy");}}]}),this.fab.init();}async performCopy(e){try{switch(e==="copy"&&await this.ensureDescriptionExpanded(),e){case "copy":await this.copyVideoInfo();break;case "quick-copy":await this.copyQuickInfo();break}}catch(t){this.logger.error("performCopy failed:",t);}}async ensureDescriptionExpanded(){this.descriptionExpanded||(this.preExpandPromise||(this.setFabPreparingState(),this.preExpandPromise=H(5e3).then(()=>{this.descriptionExpanded=true,this.setFabReadyState();}).catch(e=>{this.logger.warn("Description expansion failed:",e),this.setFabErrorState();})),await this.preExpandPromise);}createShadowDOM(){this.container=document.createElement("div"),this.container.id="youtube-info-copier-container",this.container.style.cssText=`
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `,this.shadowRoot=this.container.attachShadow({mode:"closed"}),B(this.shadowRoot,Te(),we),document.body.appendChild(this.container),this.handleElement=this.shadowRoot.querySelector(".control-handle"),this.panelElement=this.shadowRoot.querySelector(".control-panel"),this.popup=this.shadowRoot.querySelector(".popup"),this.setupEventListeners();}setupEventListeners(){if(!this.shadowRoot||!this.handleElement||!this.panelElement||!this.container)return;const e=this.shadowRoot.querySelector(".popup-close");this.handleElement.addEventListener("mouseenter",()=>{this.expandPanel(),this.preExpandDescription();}),this.panelElement.addEventListener("mouseenter",()=>this.expandPanel()),this.container.addEventListener("mouseleave",o=>{this.container?.contains(o.relatedTarget)||this.collapsePanel();}),this.shadowRoot.querySelectorAll(".panel-button").forEach(o=>{o.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.handleButtonClick(o.dataset.action||"");});}),this.handleElement.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this.handleButtonClick("copy"));}),e?.addEventListener("click",()=>this.hidePopup()),document.addEventListener("click",o=>{this.container?.contains(o.target)||this.hidePopup();});}expandPanel(){!this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer&&clearTimeout(this.expandTimer),this.isExpanded=true,this.panelElement.classList.add("expanded"),this.container.style.pointerEvents="auto");}collapsePanel(){this.isExpanded&&this.panelElement&&this.container&&(this.expandTimer=window.setTimeout(()=>{this.isExpanded=false,this.panelElement?.classList.remove("expanded"),this.container.style.pointerEvents="none";},1e3));}async handleButtonClick(e){try{if(e==="copy"&&!this.descriptionExpanded){this.logger.info("Description not ready yet, please wait for animation..."),this.showNotReadyFeedback();return}(e==="copy"||e==="quick-copy")&&await this.performCopy(e);}catch(t){this.logger.error("Error handling button click:",t);}}preExpandDescription(){this.descriptionExpanded||this.preExpandPromise||(this.logger.info("Pre-expanding description..."),this.setPreparingState(),this.setFabPreparingState(),this.preExpandPromise=H(5e3).then(()=>{this.descriptionExpanded=true,this.setReadyState(),this.setFabReadyState(),this.logger.info("Pre-expansion completed - ready to copy!");}).catch(e=>{this.logger.warn("Pre-expansion failed:",e),this.setErrorState(),this.setFabErrorState();}));}setPreparingState(){this.handleElement&&(this.handleElement.classList.add("preparing"),this.handleElement.classList.remove("ready","error"));}setReadyState(){this.handleElement&&(this.handleElement.classList.remove("preparing","error"),this.handleElement.classList.add("ready"),this.handleElement.setAttribute("data-status","ready"));}setErrorState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready"),this.handleElement.classList.add("error"));}clearState(){this.handleElement&&(this.handleElement.classList.remove("preparing","ready","error"),this.handleElement.removeAttribute("data-status"));}setFabPreparingState(){this.fab?.setColor("rgba(255, 152, 0, 0.9)");}setFabReadyState(){this.fab?.setColor("rgba(76, 175, 80, 0.9)");}setFabErrorState(){this.fab?.setColor("rgba(244, 67, 54, 0.9)");}async writeToClipboard(e){te(e,"text");}async copyQuickInfo(){try{const e=await this.getVideoInfo(),t=`${e.title}
${e.url}`;await this.writeToClipboard(t),this.showSuccessFeedback();}catch(e){this.logger.error("クイックコピーエラー:",e),this.showErrorFeedback();}}async getVideoInfo(){const e=i=>i.map(s=>document.querySelector(s)).find(s=>s!==null)??null,o=e(b.titleCandidates)?.textContent?.trim()||u("unknownTitle"),a=e(b.channelCandidates)?.textContent?.trim()||u("unknownAuthor"),c=new URLSearchParams(window.location.search).get("v")||window.location.pathname.split("/").pop(),p=c?Le(c):window.location.href;this.descriptionExpanded?this.logger.debug("Description already expanded, fetching immediately"):this.logger.warn("getVideoInfo called before description expanded");let d=u("descriptionFailed");for(const i of b.descriptionExpandedContent){const s=document.querySelector(i);if(s){const l=(s.textContent||s.innerText||"").trim();if(l&&l.length>50){d=l,this.logger.debug(`Description found using selector: ${i}`);break}}}if(d===u("descriptionFailed")){const i=document.querySelector(b.descriptionRoot);if(i){const s=i.querySelector("#expanded");if(s){const l=(s.textContent||s.innerText||"").trim();l&&l.length>50&&(d=l,this.logger.debug("Description found in #expanded div"));}if(d===u("descriptionFailed")){const f=(i.innerText||"").trim().replace(/\.\.\.もっと見る\n?/g,"").replace(/一部を表示\n?/g,"").trim();f&&f.length>10&&(d=f,this.logger.debug("Description found using innerText"));}}}return {title:o,author:a,url:p,description:d}}async copyVideoInfo(){try{const e=await this.getVideoInfo(),t=ye("fullCopyText",{title:e.title,author:e.author,url:e.url,description:e.description});await this.writeToClipboard(t),this.showPopup(e.description),this.showSuccessFeedback(),this.logger.info("Video info copied successfully");}catch(e){this.logger.error("コピーエラー:",e),this.showErrorFeedback();}}showSuccessFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background="rgba(76, 175, 80, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(76, 175, 80, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500)):this.fab&&(this.fab.setColor("rgba(76, 175, 80, 0.9)"),setTimeout(()=>this.fab?.resetColor(),1500));}showErrorFeedback(){this.handleElement?(this.clearState(),this.handleElement.style.background="rgba(244, 67, 54, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(244, 67, 54, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},1500)):this.fab&&(this.fab.setColor("rgba(244, 67, 54, 0.9)"),setTimeout(()=>this.fab?.resetColor(),1500));}showNotReadyFeedback(){this.handleElement?(this.handleElement.style.background="rgba(255, 152, 0, 0.8)",this.handleElement.style.boxShadow="2px 0 12px rgba(255, 152, 0, 0.4)",setTimeout(()=>{this.handleElement&&(this.handleElement.style.background="",this.handleElement.style.boxShadow="");},800)):this.fab&&(this.fab.setColor("rgba(255, 152, 0, 0.9)"),setTimeout(()=>this.fab?.resetColor(),800));}showPopup(e){if(!this.shadowRoot||!this.popup)return;const t=this.shadowRoot.querySelector(".popup-content");t&&(t.textContent=e),this.popup.classList.add("show"),setTimeout(()=>this.hidePopup(),3e3);}hidePopup(){this.popup?.classList.remove("show");}handleFullscreenChange=()=>{const e=!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement);this.container&&(this.container.style.display=e?"none":"block");};setupFullscreenListener(){["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>{document.addEventListener(t,this.handleFullscreenChange,false);}),this.handleFullscreenChange();}destroy(){try{this.expandTimer&&clearTimeout(this.expandTimer),["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"].forEach(t=>document.removeEventListener(t,this.handleFullscreenChange,!1)),this.container?.remove(),this.fab?.destroy(),this.fab=null,this.descriptionExpanded=!1,this.preExpandPromise=null,this.logger.info("YouTubeInfoCopier instance destroyed.");}catch(e){this.logger.error("Error during cleanup:",e);}}}const T=["classic","fab","menu-only"],v={classic:"従来スタイル",fab:"FABボタン","menu-only":"メニューのみ"},V="launch-style-",m=be({translations:{ja:{changeLaunchStyle:"起動スタイル変更",current:"現在",styleChanged:"起動スタイルを「{style}」に変更しました。",reloadToApply:"ページを再読み込みすると反映されます。",style_classic:v.classic,style_fab:v.fab,"style_menu-only":v["menu-only"]},en:{changeLaunchStyle:"Change launch style",current:"Current",styleChanged:'Changed launch style to "{style}".',reloadToApply:"Reload the page to apply it.",style_classic:"Classic style",style_fab:"FAB button","style_menu-only":"Menu only"},"zh-Hans":{changeLaunchStyle:"更改启动样式",current:"当前",styleChanged:"已将启动样式更改为“{style}”。",reloadToApply:"重新加载页面后生效。",style_classic:"经典样式",style_fab:"FAB 按钮","style_menu-only":"仅菜单"},hi:{changeLaunchStyle:"लॉन्च शैली बदलें",current:"वर्तमान",styleChanged:'लॉन्च शैली "{style}" में बदल दी गई है।',reloadToApply:"लागू करने के लिए पेज फिर से लोड करें।",style_classic:"क्लासिक शैली",style_fab:"FAB बटन","style_menu-only":"केवल मेन्यू"},es:{changeLaunchStyle:"Cambiar estilo de inicio",current:"Actual",styleChanged:'Estilo de inicio cambiado a "{style}".',reloadToApply:"Recarga la página para aplicarlo.",style_classic:"Estilo clásico",style_fab:"Botón FAB","style_menu-only":"Solo menú"},fr:{changeLaunchStyle:"Changer le style de lancement",current:"Actuel",styleChanged:'Style de lancement défini sur "{style}".',reloadToApply:"Rechargez la page pour appliquer le changement.",style_classic:"Style classique",style_fab:"Bouton FAB","style_menu-only":"Menu uniquement"},ar:{changeLaunchStyle:"تغيير نمط التشغيل",current:"الحالي",styleChanged:'تم تغيير نمط التشغيل إلى "{style}".',reloadToApply:"أعد تحميل الصفحة لتطبيق التغيير.",style_classic:"النمط الكلاسيكي",style_fab:"زر FAB","style_menu-only":"القائمة فقط"},pt:{changeLaunchStyle:"Alterar estilo de abertura",current:"Atual",styleChanged:'Estilo de abertura alterado para "{style}".',reloadToApply:"Recarregue a página para aplicar.",style_classic:"Estilo clássico",style_fab:"Botão FAB","style_menu-only":"Somente menu"},bn:{changeLaunchStyle:"লঞ্চ শৈলী পরিবর্তন করুন",current:"বর্তমান",styleChanged:'লঞ্চ শৈলী "{style}" করা হয়েছে।',reloadToApply:"প্রয়োগ করতে পেজটি আবার লোড করুন।",style_classic:"ক্লাসিক শৈলী",style_fab:"FAB বোতাম","style_menu-only":"শুধু মেনু"},ru:{changeLaunchStyle:"Изменить стиль запуска",current:"Текущий",styleChanged:'Стиль запуска изменен на "{style}".',reloadToApply:"Перезагрузите страницу, чтобы применить изменение.",style_classic:"Классический стиль",style_fab:"Кнопка FAB","style_menu-only":"Только меню"},ur:{changeLaunchStyle:"لانچ اسٹائل تبدیل کریں",current:"موجودہ",styleChanged:'لانچ اسٹائل "{style}" میں تبدیل کر دیا گیا ہے۔',reloadToApply:"لاگو کرنے کے لیے صفحہ دوبارہ لوڈ کریں۔",style_classic:"کلاسک انداز",style_fab:"FAB بٹن","style_menu-only":"صرف مینو"}},defaultLocale:"ja",fallbackLocale:"en"});m.setLocale(m.detectBrowserLocale());function U(n){return m.t(`style_${n}`)}function C(n,e="classic"){const t=`${V}${n}`,o=ee(t);return typeof o=="string"&&T.includes(o)?o:e}function ke(n,e){const t=`${V}${n}`;J(t,e);}function Ae(n){const t=(T.indexOf(n)+1)%T.length;return T[t]}function Fe(n,e){const t=C(n),o=`${m.t("changeLaunchStyle")} [${m.t("current")}: ${U(t)}]`;A(o,()=>{const r=C(n),a=Ae(r);ke(n,a),alert(`${m.format("styleChanged",{style:U(a)})}
${m.t("reloadToApply")}`);});}let z=window.location.href,g=null;Fe("youtube-info-copier");function Me(){return C("youtube-info-copier")}function q(){if(window.location.pathname!=="/watch"){g=null;return}g=new Ce(Me());}function Y(){return window.location.pathname!=="/watch"?null:(g||q(),g)}A(u("copyVideoInfo"),()=>{Y()?.performCopy("copy");});A(u("copyTitleAndUrl"),()=>{Y()?.performCopy("quick-copy");});function k(){g&&(g.destroy(),g=null),window.location.pathname==="/watch"&&setTimeout(()=>{q();},1e3);}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k();function O(){const n=document.body;if(!n){const t=()=>{document.removeEventListener("DOMContentLoaded",t),O();};document.addEventListener("DOMContentLoaded",t);return}new MutationObserver(()=>{window.location.href!==z&&(z=window.location.href,k());}).observe(n,{childList:true,subtree:true});}O();

})();