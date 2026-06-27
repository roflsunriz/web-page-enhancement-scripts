// ==UserScript==
// @name         twitter-clean-ui
// @namespace    twitterCleanUI
// @version      1.15.0
// @author       roflsunriz
// @description  X/Twitterのメニューとサイドバーをカスタマイズ。UI要素の表示/非表示、幅調整、広告非表示などをリアルタイムプレビューで設定可能。Grok、コミュニティ、フォローのON/OFF対応。ツイート詳細ページの関連性の高いアカウント表示切替対応。クリエイタースタジオ、本日のニュース表示切替対応。設定ページでのレイアウト崩れ防止。サイドバークロークによるFOUC完全防止。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const S="twitter-clean-ui-sidebar-cloak",E='[data-testid="sidebarColumn"] { visibility: hidden !important; }';try{const r=document.createElement("style");r.id=S,r.textContent=E,(document.head||document.documentElement).appendChild(r);}catch{}const _="twitter_clean_ui_settings",w="twitter_clean_ui_css_cache",g={visibility:{leftSidebar:true,leftSidebar_Logo:true,leftSidebar_HomeLink:true,leftSidebar_ExploreLink:true,leftSidebar_NotificationsLink:true,leftSidebar_MessagesLink:true,leftSidebar_GrokLink:true,leftSidebar_ConnectLink:true,leftSidebar_BookmarksLink:true,leftSidebar_ListsLink:true,leftSidebar_CommunitiesLink:true,leftSidebar_ProfileLink:true,leftSidebar_PremiumLink:true,leftSidebar_BusinessLink:true,leftSidebar_CreatorStudioLink:true,leftSidebar_MoreMenu:true,leftSidebar_TweetButton:true,leftSidebar_ProfileMenu:true,rightSidebar:true,rightSidebar_SearchBox:true,rightSidebar_PremiumSubscribe:false,rightSidebar_TrendsList:true,rightSidebar_WhoToFollow:true,rightSidebar_TodayNews:true,rightSidebar_RelatedAccounts:true,rightSidebar_Footer:true},layout:{mainContentWidth:600,timelineRightPadding:16},enableRealTimePreview:true,language:"ja"},p=[{id:"leftSidebar",category:"leftSidebar",description:"左サイドバー全体",strategies:[{type:"querySelector",selector:'header[role="banner"]',method:"header banner role",confidence:.95}]},{id:"leftSidebar_Logo",category:"leftSidebar",description:"Xロゴ",strategies:[{type:"querySelector",selector:'h1[role="heading"] a[aria-label*="X"]',method:"X logo link",confidence:.9}]},{id:"leftSidebar_HomeLink",category:"leftSidebar",description:"ホームリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Home_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ExploreLink",category:"leftSidebar",description:"話題を検索リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Explore_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_NotificationsLink",category:"leftSidebar",description:"通知リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Notifications_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_MessagesLink",category:"leftSidebar",description:"メッセージリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_DirectMessage_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_GrokLink",category:"leftSidebar",description:"Grokリンク",strategies:[{type:"querySelector",selector:'a[href="/i/grok"]',method:"href selector",confidence:.95},{type:"querySelector",selector:'a[aria-label="Grok"]',method:"aria-label",confidence:.9}]},{id:"leftSidebar_ConnectLink",category:"leftSidebar",description:"フォロー/つながるリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Follow_Link"]',method:"data-testid (Follow)",confidence:.95},{type:"querySelector",selector:'a[data-testid="AppTabBar_Connect_Link"]',method:"data-testid (Connect - legacy)",confidence:.9},{type:"querySelector",selector:'a[href="/i/connect_people"]',method:"href selector",confidence:.85}]},{id:"leftSidebar_BookmarksLink",category:"leftSidebar",description:"ブックマークリンク",strategies:[{type:"querySelector",selector:'a[href="/i/bookmarks"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_ListsLink",category:"leftSidebar",description:"リストリンク",strategies:[{type:"querySelector",selector:'a[href*="/lists"]',method:"href contains",confidence:.85}]},{id:"leftSidebar_CommunitiesLink",category:"leftSidebar",description:"コミュニティリンク",strategies:[{type:"querySelector",selector:'a[href*="/communities"]',method:"href contains",confidence:.9},{type:"querySelector",selector:'a[aria-label="コミュニティ"], a[aria-label="Communities"]',method:"aria-label",confidence:.95}]},{id:"leftSidebar_ProfileLink",category:"leftSidebar",description:"プロフィールリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Profile_Link"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_PremiumLink",category:"leftSidebar",description:"Premiumリンク",strategies:[{type:"querySelector",selector:'a[href="/i/premium_sign_up"]',method:"href selector",confidence:.9},{type:"querySelector",selector:'a[data-testid="premium-signup-tab"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_BusinessLink",category:"leftSidebar",description:"ビジネスリンク",strategies:[{type:"querySelector",selector:'a[data-testid="premium-business-signup-tab"]',method:"data-testid",confidence:.95},{type:"querySelector",selector:'a[href="/i/premium-business"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_CreatorStudioLink",category:"leftSidebar",description:"クリエイタースタジオリンク",strategies:[{type:"querySelector",selector:'a[href="/i/jf/creators/studio"]',method:"href selector",confidence:.95},{type:"querySelector",selector:'a[aria-label="クリエイタースタジオ"], a[aria-label="Creator Studio"]',method:"aria-label",confidence:.85}]},{id:"leftSidebar_MoreMenu",category:"leftSidebar",description:"もっと見るメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="AppTabBar_More_Menu"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_TweetButton",category:"leftSidebar",description:"ツイート作成ボタン",strategies:[{type:"querySelector",selector:'a[data-testid="SideNav_NewTweet_Button"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ProfileMenu",category:"leftSidebar",description:"プロフィールメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="SideNav_AccountSwitcher_Button"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar",category:"rightSidebar",description:"右サイドバー全体",strategies:[{type:"querySelector",selector:'[data-testid="sidebarColumn"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar_SearchBox",category:"rightSidebar",description:"検索ボックス",strategies:[{type:"custom",method:"Search box container",confidence:.85,finder:()=>{const r=document.querySelector('[data-testid="sidebarColumn"]');if(!r)return null;const e=r.querySelector('[data-testid="SearchBox_Search_Input"]');if(!e)return null;let t=e;for(let n=0;n<8&&!(!t.parentElement||(t=t.parentElement,t===r)||!r.contains(t));n++){const a=window.getComputedStyle(t),o=a.backgroundColor!=="rgba(0, 0, 0, 0)"&&a.backgroundColor!=="transparent",l=a.border!==""&&a.border!=="0px none rgb(0, 0, 0)",d=a.borderRadius!=="0px";if((o||l)&&d)return t.parentElement&&r.contains(t.parentElement)&&t.parentElement!==r?t.parentElement:t}let i=e;for(let n=0;n<5&&!(!i.parentElement||i.parentElement===r||!r.contains(i.parentElement));n++)i=i.parentElement;return i}}]},{id:"rightSidebar_PremiumSubscribe",category:"rightSidebar",description:"Premiumサブスクライブセクション",strategies:[{type:"custom",method:"Premium subscribe section - find bordered container first",confidence:.9,finder:()=>{const r=document.querySelector('[data-testid="sidebarColumn"]');if(!r)return null;const e=Array.from(r.querySelectorAll("div"));for(const t of e){const i=window.getComputedStyle(t),n=i.border.match(/^(\d+(?:\.\d+)?)px/),a=n&&parseFloat(n[1])>0,o=i.borderRadius!=="0px"&&i.borderRadius!=="9999px";if(a&&o){const l=t.textContent||"";if(l.length<500&&(l.includes("プレミアムにサブスクライブ")||l.includes("Subscribe to Premium")))return t}}return null}}]},{id:"rightSidebar_TrendsList",category:"rightSidebar",description:"トレンド一覧",strategies:[{type:"custom",method:"Trends list with border container",confidence:.9,finder:()=>{const r=document.querySelectorAll('[data-testid="trend"]');if(r.length===0)return null;let t=r[0].parentElement;for(let i=0;i<8&&t;i++){if(t.querySelectorAll('[data-testid="trend"]').length>1){let a=t.parentElement;for(let o=0;o<5&&a;o++){const l=window.getComputedStyle(a),d=l.border.match(/^(\d+(?:\.\d+)?)px/);if(d&&parseFloat(d[1])>0&&l.borderRadius!=="0px")return a;a=a.parentElement;}return t.parentElement?.parentElement}t=t.parentElement;}return null}}]},{id:"rightSidebar_WhoToFollow",category:"rightSidebar",description:"おすすめユーザーセクション",strategies:[{type:"custom",method:"Who to follow with border container",confidence:.9,finder:()=>{const r=document.querySelector('aside[aria-label*="おすすめユーザー"], aside[aria-label*="Who to follow"]');if(!r)return null;let e=r;for(let t=0;t<5&&e.parentElement;t++){const i=window.getComputedStyle(e.parentElement),n=i.border.match(/^(\d+(?:\.\d+)?)px/);if(n&&parseFloat(n[1])>0&&i.borderRadius!=="0px")return e.parentElement;e=e.parentElement;}return r.parentElement?.parentElement}}]},{id:"rightSidebar_TodayNews",category:"rightSidebar",description:"本日のニュースセクション",strategies:[{type:"custom",method:"Today news section - find news_sidebar testid and bordered container",confidence:.9,finder:()=>{const r=document.querySelector('[data-testid="sidebarColumn"]');if(!r)return null;const e=r.querySelector('[data-testid="news_sidebar"]');if(!e)return null;let t=e;for(let i=0;i<5&&!(!t.parentElement||t.parentElement===r||!r.contains(t.parentElement));i++){const n=window.getComputedStyle(t.parentElement),a=n.border.match(/^(\d+(?:\.\d+)?)px/),o=a&&parseFloat(a[1])>0,l=n.borderRadius!=="0px";if(o&&l)return t.parentElement;t=t.parentElement;}return e.parentElement?.parentElement}}]},{id:"rightSidebar_RelatedAccounts",category:"rightSidebar",description:"関連性の高いアカウント（ツイート詳細ページ）",strategies:[{type:"custom",method:"Related accounts section - find by heading text",confidence:.9,finder:()=>{const r=document.querySelector('[data-testid="sidebarColumn"]');if(!r)return null;const e=["関連性の高いアカウント","Relevant accounts","Relevant people"],t=Array.from(r.querySelectorAll("div, section, aside"));for(const i of t){const n=i.textContent||"";if(n.length>3e3)continue;let a=null;for(const o of e)if(n.includes(o)){a=o;break}if(a){let o=i;for(let l=0;l<5&&!(!o.parentElement||o.parentElement===r||!r.contains(o.parentElement));l++){const d=window.getComputedStyle(o.parentElement),s=d.border.match(/^(\d+(?:\.\d+)?)px/),c=s&&parseFloat(s[1])>0,f=d.borderRadius!=="0px";if(c&&f)return o.parentElement;o=o.parentElement;}return i.parentElement&&r.contains(i.parentElement)?i.parentElement:i}}return null}}]},{id:"rightSidebar_Footer",category:"rightSidebar",description:"フッターリンク",strategies:[{type:"custom",method:"Footer navigation",confidence:.8,finder:()=>{const r=document.querySelector('[data-testid="sidebarColumn"]');if(!r)return null;const e=Array.from(r.querySelectorAll("nav"));for(const t of e){const i=t.getAttribute("aria-label");if(i?.includes("フッター")||i?.includes("Footer"))return t.parentElement}return null}}]}];class v{detectedElements=new Map;observer=null;detectionCache=new Map;cacheTimestamps=new Map;CACHE_DURATION=3e3;constructor(){this.setupObserver();}setupObserver(){this.observer=new MutationObserver(()=>{this.detectAll();});}startObserving(){this.observer&&this.observer.observe(document.body,{childList:true,subtree:true});}stopObserving(){this.observer&&this.observer.disconnect();}getCacheKey(e){return `${e.type}:${e.selector||e.xpath||e.method}`}getFromCache(e){const t=this.getCacheKey(e),i=this.cacheTimestamps.get(t);if(i&&Date.now()-i<this.CACHE_DURATION)return this.detectionCache.get(t)}saveToCache(e,t){const i=this.getCacheKey(e);this.detectionCache.set(i,t),this.cacheTimestamps.set(i,Date.now());}clearCache(){this.detectionCache.clear(),this.cacheTimestamps.clear();}executeStrategy(e){if(e.type!=="custom"){const t=this.getFromCache(e);if(t!==void 0)return t}try{let t=null;switch(e.type){case "querySelector":{if(!e.selector)return null;t=document.querySelector(e.selector);break}case "querySelectorAll":{if(!e.selector)return null;const i=document.querySelectorAll(e.selector);t=i.length>0?i[0]:null;break}case "xpath":{if(!e.xpath)return null;t=document.evaluate(e.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;break}case "custom":{if(!e.finder)return null;t=e.finder();break}default:return null}return e.type!=="custom"&&this.saveToCache(e,t),t}catch(t){return console.warn(`[ElementDetector] Strategy failed: ${e.method}`,t),null}}detectElement(e){const t=p.find(i=>i.id===e);if(!t)return console.warn(`[ElementDetector] Definition not found: ${e}`),null;for(const i of t.strategies){const n=this.executeStrategy(i);if(n){const a={id:e,element:n,method:i.method,confidence:i.confidence};return this.detectedElements.set(e,a),a}}return this.detectedElements.delete(e),null}detectAll(){for(const e of p)this.detectElement(e.id);}getDetectedElement(e){return this.detectedElements.get(e)||null}getAllDetectedElements(){return new Map(this.detectedElements)}isDetected(e){return this.detectedElements.has(e)}getDetectedCount(){return this.detectedElements.size}getStatistics(){const e=p.length,t=this.detectedElements.size,i=e-t;let n=0;this.detectedElements.forEach(o=>{n+=o.confidence;});const a=t>0?n/t:0;return {total:e,detected:t,notDetected:i,averageConfidence:a}}destroy(){this.stopObserving(),this.detectedElements.clear(),this.clearCache();}}function P(){const r=window.location.pathname;return r==="/settings"||r.startsWith("/settings/")}function x(){const r=window.location.pathname;return r==="/explore"||r.startsWith("/explore/")}class y{static STYLE_ELEMENT_ID="twitter-clean-ui-static-styles";styleElement;currentCSS="";constructor(){this.styleElement=this.findOrCreateStyleElement();}findOrCreateStyleElement(){const e=document.getElementById(y.STYLE_ELEMENT_ID);return e||this.createStyleElement()}createStyleElement(){const e=document.createElement("style");return e.id=y.STYLE_ELEMENT_ID,e.type="text/css",(document.head||document.documentElement).appendChild(e),e}generateSelector(e){const t=p.find(n=>n.id===e);if(!t)return "";const i=t.strategies[0];if(!i)return "";switch(i.type){case "querySelector":case "querySelectorAll":return i.selector||"";case "xpath":return "";case "custom":return "";default:return ""}}generateVisibilityCSS(e){const t=[],{visibility:i}=e;return Object.entries(i).forEach(([n,a])=>{const o=n;if(a===false){if(o==="rightSidebar"&&x())return;const l=this.generateSelector(o);l&&t.push(`${l} { display: none !important; }`);}}),t.join(`
`)}generateLayoutCSS(e){const{layout:t}=e;return `
      ${P()?"":`
      /* メインコンテンツの幅 - data-testidセレクタ */
      [data-testid="primaryColumn"] {
        width: ${t.mainContentWidth}px !important;
        max-width: ${t.mainContentWidth}px !important;
        min-width: ${t.mainContentWidth}px !important;
        margin-right: ${t.timelineRightPadding}px !important;
        padding-right: 0px !important;
      }`}

      /* 右サイドバーのチラつき防止 */
      /* Twitter/X本体のopacityアニメーションを無効化 */
      [data-testid="sidebarColumn"] {
        opacity: 1 !important;
        transition: none !important;
      }
    `.trim()}applySettings(e){const t=this.generateVisibilityCSS(e),i=this.generateLayoutCSS(e);this.currentCSS=`
      /* === Twitter Clean UI - 静的スタイル === */
      
      /* 表示/非表示設定 */
      ${t}
      
      /* レイアウト設定 */
      ${i}
    `.trim(),this.styleElement.textContent=this.currentCSS,this.saveCSSToCache(this.currentCSS);}saveCSSToCache(e){try{typeof GM_setValue<"u"?GM_setValue(w,e):localStorage.setItem(w,e);}catch{}}getCurrentCSS(){return this.currentCSS}clear(){this.styleElement.textContent="",this.currentCSS="";}destroy(){this.clear(),this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement);}}const L={wideLayoutClass:".r-1ye8kvj",wideLayoutXPath:"/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]"};function T(){const r=window.location.pathname;return r==="/settings"||r.startsWith("/settings/")}class M{detector;cssInjector;appliedStyles=new Map;hiddenElements=new Set;styleElement;constructor(e){this.detector=e,this.cssInjector=new y,this.styleElement=this.createStyleElement();}createStyleElement(){const e=document.createElement("style");return e.id="twitter-clean-ui-dynamic-styles",document.head.appendChild(e),e}hideElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,n=window.getComputedStyle(i).display;this.appliedStyles.has(e)||this.appliedStyles.set(e,n),i.style.setProperty("display","none","important"),this.hiddenElements.add(e);}showElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,n=this.appliedStyles.get(e);n?i.style.display=n:i.style.removeProperty("display"),this.hiddenElements.delete(e);}toggleElement(e,t){t?this.showElement(e):this.hideElement(e);}applyLayout(e){if(T()){this.styleElement.textContent="";return}const{layout:t}=e,i=`
      /* メインコンテンツの幅 - CSSクラスセレクタ（twitter-wide-layout-fixから移植） */
      ${L.wideLayoutClass} {
        max-width: ${t.mainContentWidth}px !important;
      }
    `;this.styleElement.textContent=i,this.applyStyleByXpath(t.mainContentWidth);}applyStyleByXpath(e){const t=document.evaluate(L.wideLayoutXPath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;t&&t.style.setProperty("max-width",`${e}px`,"important");}canBeHandledByCSS(e){const t=p.find(n=>n.id===e);if(!t)return  false;const i=t.strategies[0];return i?i.type==="querySelector"||i.type==="querySelectorAll":false}applySettings(e){this.cssInjector.applySettings(e),this.applyLayout(e);const{visibility:t}=e;Object.entries(t).forEach(([i,n])=>{const a=i;if(this.canBeHandledByCSS(a)){if(n&&this.detector.isDetected(a)){const o=this.detector.getDetectedElement(a);o?.element.style.display&&o.element.style.removeProperty("display");}return}this.detector.isDetected(a)&&this.toggleElement(a,n);});}reset(){this.hiddenElements.forEach(e=>{this.showElement(e);}),this.cssInjector.clear(),this.styleElement.textContent="",this.appliedStyles.clear(),this.hiddenElements.clear();}setElementWidth(e,t){const i=this.detector.getDetectedElement(e);i&&(i.element.style.setProperty("width",`${t}px`,"important"),i.element.style.setProperty("min-width",`${t}px`,"important"));}setElementPadding(e,t){const i=this.detector.getDetectedElement(e);i&&i.element.style.setProperty("padding",`${t}px`,"important");}isHidden(e){return this.hiddenElements.has(e)}destroy(){this.reset(),this.cssInjector.destroy(),this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement),this.appliedStyles.clear(),this.hiddenElements.clear();}}class N{currentSettings;profiles=new Map;currentProfileId="default";initialized=false;initPromise=null;constructor(){this.currentSettings={...g},this.initPromise=this.load();}async initialize(){this.initialized||this.initPromise&&(await this.initPromise,this.initialized=true);}isInitialized(){return this.initialized}async load(){try{const e=await this.loadFromStorage();e?(this.currentSettings=this.mergeWithDefaults(e.settings),this.currentProfileId=e.currentProfileId,Object.entries(e.profiles).forEach(([t,i])=>{this.profiles.set(t,{...i,settings:this.mergeWithDefaults(i.settings)});})):this.createDefaultProfile();}catch(e){console.error("[SettingsManager] Failed to load settings:",e),this.createDefaultProfile();}}mergeWithDefaults(e){return {...g,...e,visibility:{...g.visibility,...e.visibility},layout:{...g.layout,...e.layout}}}async loadFromStorage(){return new Promise(e=>{if(typeof GM_getValue>"u"){const t=localStorage.getItem(_);e(t?JSON.parse(t):null);}else {const t=GM_getValue(_,null);e(t?JSON.parse(t):null);}})}async saveToStorage(e){return new Promise(t=>{const i=JSON.stringify(e);typeof GM_setValue>"u"?localStorage.setItem(_,i):GM_setValue(_,i),t();})}createDefaultProfile(){const e=Date.now(),t={id:"default",name:"Default",settings:{...g},createdAt:e,updatedAt:e};this.profiles.set("default",t),this.currentProfileId="default",this.currentSettings={...g},this.save();}getSettings(){return {...this.currentSettings}}updateSettings(e){this.currentSettings={...this.currentSettings,...e,visibility:{...this.currentSettings.visibility,...e.visibility||{}},layout:{...this.currentSettings.layout,...e.layout||{}}};const t=this.profiles.get(this.currentProfileId);t&&(t.settings={...this.currentSettings},t.updatedAt=Date.now()),this.save();}async save(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};await this.saveToStorage(e);}reset(){this.currentSettings={...g},this.save();}createProfile(e){const t=`profile_${Date.now()}`,i=Date.now(),n={id:t,name:e,settings:{...this.currentSettings},createdAt:i,updatedAt:i};return this.profiles.set(t,n),this.save(),n}deleteProfile(e){if(e==="default")return console.warn("[SettingsManager] Cannot delete default profile"),false;const t=this.profiles.delete(e);return t&&(this.currentProfileId===e&&this.switchProfile("default"),this.save()),t}switchProfile(e){const t=this.profiles.get(e);return t?(this.currentProfileId=e,this.currentSettings={...t.settings},this.save(),true):(console.warn(`[SettingsManager] Profile not found: ${e}`),false)}getCurrentProfileId(){return this.currentProfileId}getProfile(e){return this.profiles.get(e)||null}getAllProfiles(){return Array.from(this.profiles.values())}exportSettings(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};return JSON.stringify(e,null,2)}importSettings(e){try{const t=JSON.parse(e);if(!t.settings||!t.profiles||!t.currentProfileId)throw new Error("Invalid settings data");return this.currentSettings=t.settings,this.currentProfileId=t.currentProfileId,this.profiles.clear(),Object.entries(t.profiles).forEach(([i,n])=>{this.profiles.set(i,n);}),this.save(),!0}catch(t){return console.error("[SettingsManager] Failed to import settings:",t),false}}renameProfile(e,t){const i=this.profiles.get(e);return i?(i.name=t,i.updatedAt=Date.now(),this.save(),true):false}}const B=["en","zh-Hans","hi","es","fr","ar","pt","bn","ru","ur"],A=["ja",...B],R=new Set(["ar","ur"]);function F(r){return R.has(r)?"rtl":"ltr"}function I(r,e,t){const i=r[t],n={},a=r;for(const o of e)n[o]={...i,...a[o]??{}};return n}function D(r,e){return I(r,A,e)}function O(r,e){return r.replace(/\{([a-zA-Z0-9_]+)\}/g,(t,i)=>{const n=e[i];return n===void 0?t:String(n)})}function q(r){const e=Object.keys(r.translations);let t=r.defaultLocale;const i=s=>{const c=s.toLowerCase(),f=r.aliases?.[c];if(f)return f;const m=e.find(b=>b.toLowerCase()===c);if(m)return m;const h=c.split("-")[0];return e.find(b=>b.toLowerCase().split("-")[0]===h)??null},n=()=>{const s=navigator.languages.length>0?navigator.languages:[navigator.language];for(const c of s){const f=i(c);if(f)return f}return r.fallbackLocale},a=s=>{const c=r.translations[t]?.[s];if(c)return c;const f=r.translations[r.fallbackLocale]?.[s];return f||(r.translations[r.defaultLocale]?.[s]??s)};return {locales:e,getLocale:()=>t,setLocale:s=>{t=s;},detectBrowserLocale:n,t:a,format:(s,c)=>O(a(s),c),getTranslations:(s=t)=>r.translations[s]??r.translations[r.fallbackLocale],getDirection:(s=t)=>F(s),getMissingTranslationKeys:s=>{const c=r.translations[r.fallbackLocale],f=r.translations[s];return Object.keys(c).filter(m=>!f[m])}}}const W={appName:"twitter-clean-ui",settings:"設定",save:"保存",cancel:"キャンセル",reset:"リセット",apply:"適用",close:"閉じる",leftSidebarSettings:"左サイドバー設定",rightSidebarSettings:"右サイドバー設定",layoutSettings:"レイアウト設定",profileSettings:"プロファイル設定",leftSidebar:"左サイドバー全体",leftSidebar_Logo:"Xロゴ",leftSidebar_HomeLink:"ホーム",leftSidebar_ExploreLink:"話題を検索",leftSidebar_NotificationsLink:"通知",leftSidebar_MessagesLink:"メッセージ",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"フォロー",leftSidebar_BookmarksLink:"ブックマーク",leftSidebar_ListsLink:"リスト",leftSidebar_CommunitiesLink:"コミュニティ",leftSidebar_ProfileLink:"プロフィール",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"ビジネス",leftSidebar_CreatorStudioLink:"クリエイタースタジオ",leftSidebar_MoreMenu:"もっと見る",leftSidebar_TweetButton:"ポストボタン",leftSidebar_ProfileMenu:"プロフィールメニュー",rightSidebar:"右サイドバー全体",rightSidebar_SearchBox:"検索ボックス",rightSidebar_PremiumSubscribe:"Premiumサブスクライブ",rightSidebar_TrendsList:"トレンド",rightSidebar_WhoToFollow:"おすすめユーザー",rightSidebar_TodayNews:"本日のニュース",rightSidebar_RelatedAccounts:"関連性の高いアカウント",rightSidebar_Footer:"フッター",mainContentWidth:"メインコンテンツの幅",timelineRightPadding:"タイムラインと右サイドバー間の余白",enableRealTimePreview:"リアルタイムプレビュー",createNewProfile:"新しいプロファイルを作成",deleteButton:"削除",deleteProfile:"プロファイルを削除",exportSettings:"設定をエクスポート",importSettings:"設定をインポート",openSettings:"設定を開く",switchProfile:"切り替え",deleteProfileConfirm:"プロファイル「{name}」を削除しますか？",enterProfileName:"プロファイル名を入力してください:",importSucceeded:"設定をインポートしました",importFailed:"設定のインポートに失敗しました",resetSettingsConfirm:"設定をリセットしますか？"},j={appName:"twitter-clean-ui",settings:"Settings",save:"Save",cancel:"Cancel",reset:"Reset",apply:"Apply",close:"Close",leftSidebarSettings:"Left Sidebar Settings",rightSidebarSettings:"Right Sidebar Settings",layoutSettings:"Layout Settings",profileSettings:"Profile Settings",leftSidebar:"Left Sidebar (Entire)",leftSidebar_Logo:"X Logo",leftSidebar_HomeLink:"Home",leftSidebar_ExploreLink:"Explore",leftSidebar_NotificationsLink:"Notifications",leftSidebar_MessagesLink:"Messages",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Follow",leftSidebar_BookmarksLink:"Bookmarks",leftSidebar_ListsLink:"Lists",leftSidebar_CommunitiesLink:"Communities",leftSidebar_ProfileLink:"Profile",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Business",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"More",leftSidebar_TweetButton:"Post Button",leftSidebar_ProfileMenu:"Profile Menu",rightSidebar:"Right Sidebar (Entire)",rightSidebar_SearchBox:"Search Box",rightSidebar_PremiumSubscribe:"Premium Subscribe",rightSidebar_TrendsList:"Trends",rightSidebar_WhoToFollow:"Who to Follow",rightSidebar_TodayNews:"Today's News",rightSidebar_RelatedAccounts:"Relevant Accounts",rightSidebar_Footer:"Footer",mainContentWidth:"Main Content Width",timelineRightPadding:"Timeline Right Padding",enableRealTimePreview:"Real-time Preview",createNewProfile:"Create New Profile",deleteButton:"Delete",deleteProfile:"Delete Profile",exportSettings:"Export Settings",importSettings:"Import Settings",openSettings:"Open Settings",switchProfile:"Switch",deleteProfileConfirm:'Delete profile "{name}"?',enterProfileName:"Enter profile name:",importSucceeded:"Settings imported.",importFailed:"Failed to import settings.",resetSettingsConfirm:"Reset settings?"},G={ja:W,en:j,"zh-Hans":{appName:"twitter-clean-ui",settings:"设置",save:"保存",cancel:"取消",reset:"重置",apply:"应用",close:"关闭",leftSidebarSettings:"左侧边栏设置",rightSidebarSettings:"右侧边栏设置",layoutSettings:"布局设置",profileSettings:"配置文件设置",leftSidebar:"左侧边栏（整体）",leftSidebar_Logo:"X 标志",leftSidebar_HomeLink:"主页",leftSidebar_ExploreLink:"探索",leftSidebar_NotificationsLink:"通知",leftSidebar_MessagesLink:"消息",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"关注",leftSidebar_BookmarksLink:"书签",leftSidebar_ListsLink:"列表",leftSidebar_CommunitiesLink:"社群",leftSidebar_ProfileLink:"个人资料",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"商务",leftSidebar_CreatorStudioLink:"创作者工作室",leftSidebar_MoreMenu:"更多",leftSidebar_TweetButton:"发帖按钮",leftSidebar_ProfileMenu:"个人资料菜单",rightSidebar:"右侧边栏（整体）",rightSidebar_SearchBox:"搜索框",rightSidebar_PremiumSubscribe:"Premium 订阅",rightSidebar_TrendsList:"趋势",rightSidebar_WhoToFollow:"推荐关注",rightSidebar_TodayNews:"今日新闻",rightSidebar_RelatedAccounts:"相关账号",rightSidebar_Footer:"页脚",mainContentWidth:"主内容宽度",timelineRightPadding:"时间线右侧留白",enableRealTimePreview:"实时预览",createNewProfile:"创建新配置文件",deleteButton:"删除",deleteProfile:"删除配置文件",exportSettings:"导出设置",importSettings:"导入设置",openSettings:"打开设置",switchProfile:"切换",deleteProfileConfirm:"删除配置文件“{name}”？",enterProfileName:"请输入配置文件名称：",importSucceeded:"设置已导入。",importFailed:"导入设置失败。",resetSettingsConfirm:"重置设置？"},hi:{appName:"twitter-clean-ui",settings:"सेटिंग्स",save:"सहेजें",cancel:"रद्द करें",reset:"रीसेट",apply:"लागू करें",close:"बंद करें",leftSidebarSettings:"बायां साइडबार सेटिंग्स",rightSidebarSettings:"दायां साइडबार सेटिंग्स",layoutSettings:"लेआउट सेटिंग्स",profileSettings:"प्रोफ़ाइल सेटिंग्स",leftSidebar:"बायां साइडबार (पूरा)",leftSidebar_Logo:"X लोगो",leftSidebar_HomeLink:"होम",leftSidebar_ExploreLink:"एक्सप्लोर",leftSidebar_NotificationsLink:"सूचनाएं",leftSidebar_MessagesLink:"संदेश",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"फ़ॉलो",leftSidebar_BookmarksLink:"बुकमार्क",leftSidebar_ListsLink:"लिस्ट",leftSidebar_CommunitiesLink:"कम्युनिटी",leftSidebar_ProfileLink:"प्रोफ़ाइल",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"बिज़नेस",leftSidebar_CreatorStudioLink:"क्रिएटर स्टूडियो",leftSidebar_MoreMenu:"और",leftSidebar_TweetButton:"पोस्ट बटन",leftSidebar_ProfileMenu:"प्रोफ़ाइल मेन्यू",rightSidebar:"दायां साइडबार (पूरा)",rightSidebar_SearchBox:"खोज बॉक्स",rightSidebar_PremiumSubscribe:"Premium सदस्यता",rightSidebar_TrendsList:"ट्रेंड",rightSidebar_WhoToFollow:"किसे फ़ॉलो करें",rightSidebar_TodayNews:"आज की खबरें",rightSidebar_RelatedAccounts:"संबंधित अकाउंट",rightSidebar_Footer:"फ़ुटर",mainContentWidth:"मुख्य सामग्री की चौड़ाई",timelineRightPadding:"टाइमलाइन दायां पैडिंग",enableRealTimePreview:"रीयल-टाइम पूर्वावलोकन",createNewProfile:"नई प्रोफ़ाइल बनाएं",deleteButton:"हटाएं",deleteProfile:"प्रोफ़ाइल हटाएं",exportSettings:"सेटिंग्स निर्यात करें",importSettings:"सेटिंग्स आयात करें",openSettings:"सेटिंग्स खोलें",switchProfile:"स्विच",deleteProfileConfirm:'प्रोफ़ाइल "{name}" हटाएं?',enterProfileName:"प्रोफ़ाइल नाम दर्ज करें:",importSucceeded:"सेटिंग्स आयात हो गईं।",importFailed:"सेटिंग्स आयात करने में विफल।",resetSettingsConfirm:"सेटिंग्स रीसेट करें?"},es:{appName:"twitter-clean-ui",settings:"Ajustes",save:"Guardar",cancel:"Cancelar",reset:"Restablecer",apply:"Aplicar",close:"Cerrar",leftSidebarSettings:"Ajustes de la barra lateral izquierda",rightSidebarSettings:"Ajustes de la barra lateral derecha",layoutSettings:"Ajustes de diseño",profileSettings:"Ajustes de perfil",leftSidebar:"Barra lateral izquierda (completa)",leftSidebar_Logo:"Logo de X",leftSidebar_HomeLink:"Inicio",leftSidebar_ExploreLink:"Explorar",leftSidebar_NotificationsLink:"Notificaciones",leftSidebar_MessagesLink:"Mensajes",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Seguir",leftSidebar_BookmarksLink:"Marcadores",leftSidebar_ListsLink:"Listas",leftSidebar_CommunitiesLink:"Comunidades",leftSidebar_ProfileLink:"Perfil",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Empresa",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"Más",leftSidebar_TweetButton:"Botón de publicar",leftSidebar_ProfileMenu:"Menú de perfil",rightSidebar:"Barra lateral derecha (completa)",rightSidebar_SearchBox:"Cuadro de búsqueda",rightSidebar_PremiumSubscribe:"Suscripción Premium",rightSidebar_TrendsList:"Tendencias",rightSidebar_WhoToFollow:"A quién seguir",rightSidebar_TodayNews:"Noticias de hoy",rightSidebar_RelatedAccounts:"Cuentas relacionadas",rightSidebar_Footer:"Pie de página",mainContentWidth:"Ancho del contenido principal",timelineRightPadding:"Espacio derecho de la cronología",enableRealTimePreview:"Vista previa en tiempo real",createNewProfile:"Crear nuevo perfil",deleteButton:"Eliminar",deleteProfile:"Eliminar perfil",exportSettings:"Exportar ajustes",importSettings:"Importar ajustes",openSettings:"Abrir ajustes",switchProfile:"Cambiar",deleteProfileConfirm:'¿Eliminar el perfil "{name}"?',enterProfileName:"Introduce el nombre del perfil:",importSucceeded:"Ajustes importados.",importFailed:"No se pudieron importar los ajustes.",resetSettingsConfirm:"¿Restablecer ajustes?"},fr:{appName:"twitter-clean-ui",settings:"Paramètres",save:"Enregistrer",cancel:"Annuler",reset:"Réinitialiser",apply:"Appliquer",close:"Fermer",leftSidebarSettings:"Paramètres de la barre latérale gauche",rightSidebarSettings:"Paramètres de la barre latérale droite",layoutSettings:"Paramètres de mise en page",profileSettings:"Paramètres de profil",leftSidebar:"Barre latérale gauche (complète)",leftSidebar_Logo:"Logo X",leftSidebar_HomeLink:"Accueil",leftSidebar_ExploreLink:"Explorer",leftSidebar_NotificationsLink:"Notifications",leftSidebar_MessagesLink:"Messages",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Suivre",leftSidebar_BookmarksLink:"Signets",leftSidebar_ListsLink:"Listes",leftSidebar_CommunitiesLink:"Communautés",leftSidebar_ProfileLink:"Profil",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Entreprise",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"Plus",leftSidebar_TweetButton:"Bouton publier",leftSidebar_ProfileMenu:"Menu du profil",rightSidebar:"Barre latérale droite (complète)",rightSidebar_SearchBox:"Champ de recherche",rightSidebar_PremiumSubscribe:"Abonnement Premium",rightSidebar_TrendsList:"Tendances",rightSidebar_WhoToFollow:"Suggestions d'abonnement",rightSidebar_TodayNews:"Actualités du jour",rightSidebar_RelatedAccounts:"Comptes liés",rightSidebar_Footer:"Pied de page",mainContentWidth:"Largeur du contenu principal",timelineRightPadding:"Marge droite de la chronologie",enableRealTimePreview:"Aperçu en temps réel",createNewProfile:"Créer un nouveau profil",deleteButton:"Supprimer",deleteProfile:"Supprimer le profil",exportSettings:"Exporter les paramètres",importSettings:"Importer les paramètres",openSettings:"Ouvrir les paramètres",switchProfile:"Changer",deleteProfileConfirm:'Supprimer le profil "{name}" ?',enterProfileName:"Saisissez le nom du profil :",importSucceeded:"Paramètres importés.",importFailed:"Échec de l'importation des paramètres.",resetSettingsConfirm:"Réinitialiser les paramètres ?"},ar:{appName:"twitter-clean-ui",settings:"الإعدادات",save:"حفظ",cancel:"إلغاء",reset:"إعادة ضبط",apply:"تطبيق",close:"إغلاق",leftSidebarSettings:"إعدادات الشريط الجانبي الأيسر",rightSidebarSettings:"إعدادات الشريط الجانبي الأيمن",layoutSettings:"إعدادات التخطيط",profileSettings:"إعدادات الملف الشخصي",leftSidebar:"الشريط الجانبي الأيسر (كامل)",leftSidebar_Logo:"شعار X",leftSidebar_HomeLink:"الرئيسية",leftSidebar_ExploreLink:"استكشاف",leftSidebar_NotificationsLink:"الإشعارات",leftSidebar_MessagesLink:"الرسائل",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"متابعة",leftSidebar_BookmarksLink:"الإشارات المرجعية",leftSidebar_ListsLink:"القوائم",leftSidebar_CommunitiesLink:"المجتمعات",leftSidebar_ProfileLink:"الملف الشخصي",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"الأعمال",leftSidebar_CreatorStudioLink:"استوديو المبدعين",leftSidebar_MoreMenu:"المزيد",leftSidebar_TweetButton:"زر النشر",leftSidebar_ProfileMenu:"قائمة الملف الشخصي",rightSidebar:"الشريط الجانبي الأيمن (كامل)",rightSidebar_SearchBox:"مربع البحث",rightSidebar_PremiumSubscribe:"اشتراك Premium",rightSidebar_TrendsList:"المتداول",rightSidebar_WhoToFollow:"من تتابع",rightSidebar_TodayNews:"أخبار اليوم",rightSidebar_RelatedAccounts:"حسابات ذات صلة",rightSidebar_Footer:"التذييل",mainContentWidth:"عرض المحتوى الرئيسي",timelineRightPadding:"الهامش الأيمن للخط الزمني",enableRealTimePreview:"معاينة فورية",createNewProfile:"إنشاء ملف شخصي جديد",deleteButton:"حذف",deleteProfile:"حذف الملف الشخصي",exportSettings:"تصدير الإعدادات",importSettings:"استيراد الإعدادات",openSettings:"فتح الإعدادات",switchProfile:"تبديل",deleteProfileConfirm:'حذف الملف الشخصي "{name}"؟',enterProfileName:"أدخل اسم الملف الشخصي:",importSucceeded:"تم استيراد الإعدادات.",importFailed:"فشل استيراد الإعدادات.",resetSettingsConfirm:"إعادة ضبط الإعدادات؟"},pt:{appName:"twitter-clean-ui",settings:"Configurações",save:"Salvar",cancel:"Cancelar",reset:"Redefinir",apply:"Aplicar",close:"Fechar",leftSidebarSettings:"Configurações da barra lateral esquerda",rightSidebarSettings:"Configurações da barra lateral direita",layoutSettings:"Configurações de layout",profileSettings:"Configurações de perfil",leftSidebar:"Barra lateral esquerda (inteira)",leftSidebar_Logo:"Logo do X",leftSidebar_HomeLink:"Início",leftSidebar_ExploreLink:"Explorar",leftSidebar_NotificationsLink:"Notificações",leftSidebar_MessagesLink:"Mensagens",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Seguir",leftSidebar_BookmarksLink:"Itens salvos",leftSidebar_ListsLink:"Listas",leftSidebar_CommunitiesLink:"Comunidades",leftSidebar_ProfileLink:"Perfil",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Negócios",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"Mais",leftSidebar_TweetButton:"Botão de publicar",leftSidebar_ProfileMenu:"Menu do perfil",rightSidebar:"Barra lateral direita (inteira)",rightSidebar_SearchBox:"Caixa de busca",rightSidebar_PremiumSubscribe:"Assinatura Premium",rightSidebar_TrendsList:"Tendências",rightSidebar_WhoToFollow:"Quem seguir",rightSidebar_TodayNews:"Notícias de hoje",rightSidebar_RelatedAccounts:"Contas relacionadas",rightSidebar_Footer:"Rodapé",mainContentWidth:"Largura do conteúdo principal",timelineRightPadding:"Espaço direito da timeline",enableRealTimePreview:"Prévia em tempo real",createNewProfile:"Criar novo perfil",deleteButton:"Excluir",deleteProfile:"Excluir perfil",exportSettings:"Exportar configurações",importSettings:"Importar configurações",openSettings:"Abrir configurações",switchProfile:"Alternar",deleteProfileConfirm:'Excluir o perfil "{name}"?',enterProfileName:"Digite o nome do perfil:",importSucceeded:"Configurações importadas.",importFailed:"Falha ao importar configurações.",resetSettingsConfirm:"Redefinir configurações?"},bn:{appName:"twitter-clean-ui",settings:"সেটিংস",save:"সংরক্ষণ",cancel:"বাতিল",reset:"রিসেট",apply:"প্রয়োগ",close:"বন্ধ",leftSidebarSettings:"বাম সাইডবার সেটিংস",rightSidebarSettings:"ডান সাইডবার সেটিংস",layoutSettings:"লেআউট সেটিংস",profileSettings:"প্রোফাইল সেটিংস",leftSidebar:"বাম সাইডবার (সম্পূর্ণ)",leftSidebar_Logo:"X লোগো",leftSidebar_HomeLink:"হোম",leftSidebar_ExploreLink:"এক্সপ্লোর",leftSidebar_NotificationsLink:"নোটিফিকেশন",leftSidebar_MessagesLink:"মেসেজ",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"ফলো",leftSidebar_BookmarksLink:"বুকমার্ক",leftSidebar_ListsLink:"লিস্ট",leftSidebar_CommunitiesLink:"কমিউনিটি",leftSidebar_ProfileLink:"প্রোফাইল",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"বিজনেস",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"আরও",leftSidebar_TweetButton:"পোস্ট বোতাম",leftSidebar_ProfileMenu:"প্রোফাইল মেনু",rightSidebar:"ডান সাইডবার (সম্পূর্ণ)",rightSidebar_SearchBox:"সার্চ বক্স",rightSidebar_PremiumSubscribe:"Premium সাবস্ক্রাইব",rightSidebar_TrendsList:"ট্রেন্ড",rightSidebar_WhoToFollow:"কাকে ফলো করবেন",rightSidebar_TodayNews:"আজকের খবর",rightSidebar_RelatedAccounts:"সম্পর্কিত অ্যাকাউন্ট",rightSidebar_Footer:"ফুটার",mainContentWidth:"মূল কনটেন্টের প্রস্থ",timelineRightPadding:"টাইমলাইনের ডান প্যাডিং",enableRealTimePreview:"রিয়েল-টাইম প্রিভিউ",createNewProfile:"নতুন প্রোফাইল তৈরি করুন",deleteButton:"মুছুন",deleteProfile:"প্রোফাইল মুছুন",exportSettings:"সেটিংস এক্সপোর্ট",importSettings:"সেটিংস ইমপোর্ট",openSettings:"সেটিংস খুলুন",switchProfile:"বদলান",deleteProfileConfirm:'"{name}" প্রোফাইল মুছবেন?',enterProfileName:"প্রোফাইল নাম লিখুন:",importSucceeded:"সেটিংস ইমপোর্ট হয়েছে।",importFailed:"সেটিংস ইমপোর্ট ব্যর্থ হয়েছে।",resetSettingsConfirm:"সেটিংস রিসেট করবেন?"},ru:{appName:"twitter-clean-ui",settings:"Настройки",save:"Сохранить",cancel:"Отмена",reset:"Сбросить",apply:"Применить",close:"Закрыть",leftSidebarSettings:"Настройки левой боковой панели",rightSidebarSettings:"Настройки правой боковой панели",layoutSettings:"Настройки макета",profileSettings:"Настройки профиля",leftSidebar:"Левая боковая панель (целиком)",leftSidebar_Logo:"Логотип X",leftSidebar_HomeLink:"Главная",leftSidebar_ExploreLink:"Обзор",leftSidebar_NotificationsLink:"Уведомления",leftSidebar_MessagesLink:"Сообщения",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Подписки",leftSidebar_BookmarksLink:"Закладки",leftSidebar_ListsLink:"Списки",leftSidebar_CommunitiesLink:"Сообщества",leftSidebar_ProfileLink:"Профиль",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Бизнес",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"Еще",leftSidebar_TweetButton:"Кнопка публикации",leftSidebar_ProfileMenu:"Меню профиля",rightSidebar:"Правая боковая панель (целиком)",rightSidebar_SearchBox:"Поле поиска",rightSidebar_PremiumSubscribe:"Подписка Premium",rightSidebar_TrendsList:"Тренды",rightSidebar_WhoToFollow:"Кого читать",rightSidebar_TodayNews:"Сегодняшние новости",rightSidebar_RelatedAccounts:"Связанные аккаунты",rightSidebar_Footer:"Подвал",mainContentWidth:"Ширина основного содержимого",timelineRightPadding:"Правый отступ ленты",enableRealTimePreview:"Предпросмотр в реальном времени",createNewProfile:"Создать новый профиль",deleteButton:"Удалить",deleteProfile:"Удалить профиль",exportSettings:"Экспорт настроек",importSettings:"Импорт настроек",openSettings:"Открыть настройки",switchProfile:"Переключить",deleteProfileConfirm:'Удалить профиль "{name}"?',enterProfileName:"Введите имя профиля:",importSucceeded:"Настройки импортированы.",importFailed:"Не удалось импортировать настройки.",resetSettingsConfirm:"Сбросить настройки?"},ur:{appName:"twitter-clean-ui",settings:"سیٹنگز",save:"محفوظ کریں",cancel:"منسوخ",reset:"ری سیٹ",apply:"لاگو",close:"بند",leftSidebarSettings:"بائیں سائیڈ بار سیٹنگز",rightSidebarSettings:"دائیں سائیڈ بار سیٹنگز",layoutSettings:"لے آؤٹ سیٹنگز",profileSettings:"پروفائل سیٹنگز",leftSidebar:"بائیں سائیڈ بار (مکمل)",leftSidebar_Logo:"X لوگو",leftSidebar_HomeLink:"ہوم",leftSidebar_ExploreLink:"ایکسپلور",leftSidebar_NotificationsLink:"اطلاعات",leftSidebar_MessagesLink:"پیغامات",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"فالو",leftSidebar_BookmarksLink:"بک مارکس",leftSidebar_ListsLink:"لسٹس",leftSidebar_CommunitiesLink:"کمیونٹیز",leftSidebar_ProfileLink:"پروفائل",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"بزنس",leftSidebar_CreatorStudioLink:"Creator Studio",leftSidebar_MoreMenu:"مزید",leftSidebar_TweetButton:"پوسٹ بٹن",leftSidebar_ProfileMenu:"پروفائل مینو",rightSidebar:"دائیں سائیڈ بار (مکمل)",rightSidebar_SearchBox:"سرچ باکس",rightSidebar_PremiumSubscribe:"Premium سبسکرائب",rightSidebar_TrendsList:"ٹرینڈز",rightSidebar_WhoToFollow:"کسے فالو کریں",rightSidebar_TodayNews:"آج کی خبریں",rightSidebar_RelatedAccounts:"متعلقہ اکاؤنٹس",rightSidebar_Footer:"فوٹر",mainContentWidth:"مرکزی مواد کی چوڑائی",timelineRightPadding:"ٹائم لائن دائیں پیڈنگ",enableRealTimePreview:"ریئل ٹائم پیش نظارہ",createNewProfile:"نیا پروفائل بنائیں",deleteButton:"حذف",deleteProfile:"پروفائل حذف کریں",exportSettings:"سیٹنگز ایکسپورٹ کریں",importSettings:"سیٹنگز امپورٹ کریں",openSettings:"سیٹنگز کھولیں",switchProfile:"تبدیل",deleteProfileConfirm:'پروفائل "{name}" حذف کریں؟',enterProfileName:"پروفائل نام درج کریں:",importSucceeded:"سیٹنگز امپورٹ ہو گئیں۔",importFailed:"سیٹنگز امپورٹ کرنے میں ناکامی۔",resetSettingsConfirm:"سیٹنگز ری سیٹ کریں؟"}},k=q({translations:D(G,"en"),defaultLocale:"ja",fallbackLocale:"en"});function z(r){k.setLocale(r);}function U(){return k.detectBrowserLocale()}function u(r){return k.t(r)}const H=`
.twitter-clean-ui-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
}

.twitter-clean-ui-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.twitter-clean-ui-header {
  padding: 20px;
  border-bottom: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.twitter-clean-ui-title {
  font-size: 20px;
  font-weight: bold;
  color: #14171a;
  margin: 0;
}

.twitter-clean-ui-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #657786;
  padding: 4px 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.twitter-clean-ui-close:hover {
  background: #f7f9fa;
}

.twitter-clean-ui-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  height: 500px;
  min-height: 500px;
  max-height: 500px;
}

.twitter-clean-ui-section {
  margin-bottom: 24px;
}

.twitter-clean-ui-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #14171a;
  margin-bottom: 12px;
  display: block;
}

.twitter-clean-ui-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f7f9fa;
}

.twitter-clean-ui-control:last-child {
  border-bottom: none;
}

.twitter-clean-ui-label {
  font-size: 14px;
  color: #14171a;
  flex: 1;
}

.twitter-clean-ui-toggle {
  position: relative;
  width: 48px;
  height: 24px;
  background: #cfd9de;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.twitter-clean-ui-toggle.active {
  background: #1d9bf0;
}

.twitter-clean-ui-toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.twitter-clean-ui-toggle.active .twitter-clean-ui-toggle-slider {
  transform: translateX(24px);
}

.twitter-clean-ui-slider-container {
  flex: 1;
  max-width: 300px;
}

.twitter-clean-ui-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e1e8ed;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.twitter-clean-ui-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1d9bf0;
  cursor: pointer;
  transition: transform 0.2s;
}

.twitter-clean-ui-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.twitter-clean-ui-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1d9bf0;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;
}

.twitter-clean-ui-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.twitter-clean-ui-slider-value {
  margin-left: 12px;
  font-size: 14px;
  color: #657786;
  min-width: 60px;
  text-align: right;
}

.twitter-clean-ui-footer {
  padding: 16px 20px;
  border-top: 1px solid #e1e8ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.twitter-clean-ui-button {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.twitter-clean-ui-button-primary {
  background: #1d9bf0;
  color: white;
}

.twitter-clean-ui-button-primary:hover {
  background: #1a8cd8;
}

.twitter-clean-ui-button-secondary {
  background: #eff3f4;
  color: #0f1419;
}

.twitter-clean-ui-button-secondary:hover {
  background: #d7dbdc;
}

.twitter-clean-ui-button-danger {
  background: #f4212e;
  color: white;
}

.twitter-clean-ui-button-danger:hover {
  background: #dc1928;
}

.twitter-clean-ui-tabs {
  display: flex;
  gap: 4px;
  padding: 0 20px;
  border-bottom: 1px solid #e1e8ed;
}

.twitter-clean-ui-tab {
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #536471;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.twitter-clean-ui-tab:hover {
  background: #f7f9fa;
}

.twitter-clean-ui-tab.active {
  color: #0f1419;
  border-bottom-color: #1d9bf0;
}

.twitter-clean-ui-profile-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.twitter-clean-ui-profile-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.twitter-clean-ui-profile-item:hover {
  background: #f7f9fa;
}

.twitter-clean-ui-profile-item.active {
  background: #eff3f4;
  font-weight: bold;
}

.twitter-clean-ui-profile-name {
  font-size: 14px;
  color: #0f1419;
}

.twitter-clean-ui-profile-actions {
  display: flex;
  gap: 8px;
}

.twitter-clean-ui-icon-button {
  padding: 4px 8px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #657786;
  transition: all 0.2s;
}

.twitter-clean-ui-icon-button:hover {
  background: #eff3f4;
  color: #0f1419;
}

/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .twitter-clean-ui-modal {
    background: #15202b;
  }

  .twitter-clean-ui-header,
  .twitter-clean-ui-footer {
    border-color: #38444d;
  }

  .twitter-clean-ui-title,
  .twitter-clean-ui-section-title,
  .twitter-clean-ui-label {
    color: #f7f9fa;
  }

  .twitter-clean-ui-control {
    border-color: #2f3336;
  }

  .twitter-clean-ui-close:hover,
  .twitter-clean-ui-tab:hover,
  .twitter-clean-ui-profile-item:hover {
    background: #1e2732;
  }

  .twitter-clean-ui-tab.active {
    color: #f7f9fa;
  }

  .twitter-clean-ui-button-secondary {
    background: #1e2732;
    color: #f7f9fa;
  }

  .twitter-clean-ui-button-secondary:hover {
    background: #2f3336;
  }

  .twitter-clean-ui-profile-item.active {
    background: #1e2732;
  }

  .twitter-clean-ui-icon-button:hover {
    background: #1e2732;
    color: #f7f9fa;
  }
}
`;class ${settingsManager;controller;overlay=null;styleElement=null;constructor(e,t){this.settingsManager=e,this.controller=t,this.injectStyles();}injectStyles(){this.styleElement||(this.styleElement=document.createElement("style"),this.styleElement.textContent=H,document.head.appendChild(this.styleElement));}show(){this.overlay||(this.overlay=this.createOverlay(),this.overlay.dir="auto",document.body.appendChild(this.overlay),setTimeout(()=>{this.showTab("visibility");},0));}hide(){this.overlay&&(this.overlay.remove(),this.overlay=null);}createOverlay(){const e=document.createElement("div");e.className="twitter-clean-ui-overlay",e.addEventListener("click",i=>{i.target===e&&this.hide();});const t=this.createModal();return e.appendChild(t),e}createModal(){const e=document.createElement("div");e.className="twitter-clean-ui-modal";const t=this.createHeader();e.appendChild(t);const i=this.createTabs();e.appendChild(i);const n=document.createElement("div");n.className="twitter-clean-ui-body",n.id="twitter-clean-ui-body",e.appendChild(n);const a=this.createFooter();return e.appendChild(a),e}createHeader(){const e=document.createElement("div");e.className="twitter-clean-ui-header";const t=document.createElement("h2");t.className="twitter-clean-ui-title",t.textContent=u("appName"),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-close",i.textContent="×",i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}createTabs(){const e=document.createElement("div");return e.className="twitter-clean-ui-tabs",[{id:"visibility",label:u("leftSidebarSettings")},{id:"rightSidebar",label:u("rightSidebarSettings")},{id:"layout",label:u("layoutSettings")},{id:"profiles",label:u("profileSettings")}].forEach((i,n)=>{const a=document.createElement("button");a.className=`twitter-clean-ui-tab ${n===0?"active":""}`,a.textContent=i.label,a.addEventListener("click",()=>{e.querySelectorAll(".twitter-clean-ui-tab").forEach(o=>{o.classList.remove("active");}),a.classList.add("active"),this.showTab(i.id);}),e.appendChild(a);}),e}showTab(e){const t=document.getElementById("twitter-clean-ui-body");if(t)switch(t.innerHTML="",e){case "visibility":t.appendChild(this.createVisibilityTab());break;case "rightSidebar":t.appendChild(this.createRightSidebarTab());break;case "layout":t.appendChild(this.createLayoutTab());break;case "profiles":t.appendChild(this.createProfilesTab());break}}createVisibilityTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(u("leftSidebarSettings"));return ["leftSidebar_Logo","leftSidebar_HomeLink","leftSidebar_ExploreLink","leftSidebar_NotificationsLink","leftSidebar_ConnectLink","leftSidebar_MessagesLink","leftSidebar_GrokLink","leftSidebar_BookmarksLink","leftSidebar_ListsLink","leftSidebar_CommunitiesLink","leftSidebar_ProfileLink","leftSidebar_PremiumLink","leftSidebar_BusinessLink","leftSidebar_CreatorStudioLink","leftSidebar_MoreMenu","leftSidebar_TweetButton","leftSidebar_ProfileMenu"].forEach(a=>{const o=t.visibility,l=this.createToggleControl(u(a),o[a]??true,d=>{const s={[a]:d};this.settingsManager.updateSettings({visibility:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(l);}),e.appendChild(i),e}createRightSidebarTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(u("rightSidebarSettings"));return ["rightSidebar","rightSidebar_SearchBox","rightSidebar_PremiumSubscribe","rightSidebar_TrendsList","rightSidebar_WhoToFollow","rightSidebar_TodayNews","rightSidebar_RelatedAccounts","rightSidebar_Footer"].forEach(a=>{const o=t.visibility,l=this.createToggleControl(u(a),o[a]??true,d=>{const s={[a]:d};this.settingsManager.updateSettings({visibility:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(l);}),e.appendChild(i),e}createLayoutTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(u("layoutSettings")),n=this.createSliderControl(u("mainContentWidth"),t.layout.mainContentWidth,500,1200,l=>{const d={mainContentWidth:l};this.settingsManager.updateSettings({layout:d}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(n);const a=this.createSliderControl(u("timelineRightPadding"),t.layout.timelineRightPadding,0,100,l=>{const d={timelineRightPadding:l};this.settingsManager.updateSettings({layout:d}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(a);const o=this.createToggleControl(u("enableRealTimePreview"),t.enableRealTimePreview,l=>{this.settingsManager.updateSettings({enableRealTimePreview:l});});return i.appendChild(o),e.appendChild(i),e}createProfilesTab(){const e=document.createElement("div"),t=this.createSection(u("profileSettings")),i=this.settingsManager.getAllProfiles(),n=this.settingsManager.getCurrentProfileId(),a=document.createElement("ul");a.className="twitter-clean-ui-profile-list",i.forEach(s=>{const c=document.createElement("li");c.className=`twitter-clean-ui-profile-item ${s.id===n?"active":""}`;const f=document.createElement("span");f.className="twitter-clean-ui-profile-name",f.textContent=s.name,c.appendChild(f);const m=document.createElement("div");if(m.className="twitter-clean-ui-profile-actions",s.id!==n){const h=document.createElement("button");h.className="twitter-clean-ui-icon-button",h.textContent="✓",h.title=u("switchProfile"),h.addEventListener("click",b=>{b.stopPropagation(),this.settingsManager.switchProfile(s.id),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles");}),m.appendChild(h);}if(s.id!=="default"){const h=document.createElement("button");h.className="twitter-clean-ui-icon-button",h.textContent=u("deleteButton"),h.title=u("deleteProfile"),h.addEventListener("click",b=>{b.stopPropagation(),confirm(u("deleteProfileConfirm").replace("{name}",s.name))&&(this.settingsManager.deleteProfile(s.id),this.showTab("profiles"));}),m.appendChild(h);}c.appendChild(m),a.appendChild(c);}),t.appendChild(a);const o=document.createElement("button");o.className="twitter-clean-ui-button twitter-clean-ui-button-primary",o.textContent=u("createNewProfile"),o.style.marginTop="12px",o.addEventListener("click",()=>{const s=prompt(u("enterProfileName"));s&&(this.settingsManager.createProfile(s),this.showTab("profiles"));}),t.appendChild(o);const l=document.createElement("button");l.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",l.textContent=u("exportSettings"),l.style.marginTop="12px",l.addEventListener("click",()=>{const s=this.settingsManager.exportSettings(),c=new Blob([s],{type:"application/json"}),f=URL.createObjectURL(c),m=document.createElement("a");m.href=f,m.download=`twitter-clean-ui-settings-${Date.now()}.json`,m.click(),URL.revokeObjectURL(f);}),t.appendChild(l);const d=document.createElement("button");return d.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",d.textContent=u("importSettings"),d.style.marginTop="12px",d.style.marginLeft="8px",d.addEventListener("click",()=>{const s=document.createElement("input");s.type="file",s.accept="application/json",s.addEventListener("change",async c=>{const f=c.target.files?.[0];if(f){const m=await f.text();this.settingsManager.importSettings(m)?(alert(u("importSucceeded")),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles")):alert(u("importFailed"));}}),s.click();}),t.appendChild(d),e.appendChild(t),e}createSection(e){const t=document.createElement("div");t.className="twitter-clean-ui-section";const i=document.createElement("span");return i.className="twitter-clean-ui-section-title",i.textContent=e,t.appendChild(i),t}createToggleControl(e,t,i){const n=document.createElement("div");n.className="twitter-clean-ui-control";const a=document.createElement("span");a.className="twitter-clean-ui-label",a.textContent=e,n.appendChild(a);const o=document.createElement("div");o.className=`twitter-clean-ui-toggle ${t?"active":""}`;const l=document.createElement("div");return l.className="twitter-clean-ui-toggle-slider",o.appendChild(l),o.addEventListener("click",()=>{const d=o.classList.toggle("active");i(d);}),n.appendChild(o),n}createSliderControl(e,t,i,n,a){const o=document.createElement("div");o.className="twitter-clean-ui-control";const l=document.createElement("span");l.className="twitter-clean-ui-label",l.textContent=e,o.appendChild(l);const d=document.createElement("div");d.className="twitter-clean-ui-slider-container";const s=document.createElement("input");s.type="range",s.className="twitter-clean-ui-slider",s.min=String(i),s.max=String(n),s.value=String(t),d.appendChild(s);const c=document.createElement("span");return c.className="twitter-clean-ui-slider-value",c.textContent=`${t}px`,d.appendChild(c),s.addEventListener("input",()=>{const f=Number(s.value);c.textContent=`${f}px`,a(f);}),o.appendChild(d),o}createFooter(){const e=document.createElement("div");e.className="twitter-clean-ui-footer";const t=document.createElement("button");t.className="twitter-clean-ui-button twitter-clean-ui-button-danger",t.textContent=u("reset"),t.addEventListener("click",()=>{confirm(u("resetSettingsConfirm"))&&(this.settingsManager.reset(),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("visibility"));}),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",i.textContent=u("close"),i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}destroy(){this.hide(),this.styleElement&&this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement);}}try{let r=null;if(typeof GM_getValue<"u"?r=GM_getValue(w,null):r=localStorage.getItem(w),r){const e=document.createElement("style");e.id=y.STYLE_ELEMENT_ID,e.type="text/css";const t=window.location.pathname,i=t==="/explore"||t.startsWith("/explore/");e.textContent=i?r.replace(/\[data-testid="sidebarColumn"\]\s*\{[^}]*display\s*:\s*none[^}]*\}/g,""):r,(document.head||document.documentElement).appendChild(e);}}catch{}const X=2e3,C=100,V=20;class K{detector;controller;settingsManager;settingsUI;isInitialized=false;settingsWatcherInterval=null;primaryMutationObserver=null;sidebarMutationObserver=null;applySettingsDebounceTimer=null;rafId=null;sidebarDebounceTimer=null;revealFailsafeTimer=null;lastUrl="";isApplyingSettings=false;primaryObservingBody=false;constructor(){this.detector=new v,this.controller=new M(this.detector),this.settingsManager=new N,this.settingsUI=new $(this.settingsManager,this.controller),this.lastUrl=location.href;}async initialize(){if(!this.isInitialized)try{await this.settingsManager.initialize();const e=this.settingsManager.getSettings();z(e.language||U()),this.guardedApplySettings(),this.startPrimaryMutationObserver(),this.startSidebarMutationObserver(),this.registerMenuCommand(),this.startSettingsWatcher(),this.setupNavigationInterception(),this.revealSidebar(),this.isInitialized=!0;}catch(e){console.error("[TwitterCleanUI] Initialization failed:",e),this.revealSidebar();}}guardedApplySettings(){this.isApplyingSettings=true;try{this.detector.detectAll();const e=this.settingsManager.getSettings();this.controller.applySettings(e);}finally{this.isApplyingSettings=false;}}cloakSidebar(){let e=document.getElementById(S);e||(e=document.createElement("style"),e.id=S,(document.head||document.documentElement).appendChild(e)),e.textContent=E,this.clearRevealFailsafe(),this.revealFailsafeTimer=setTimeout(()=>{this.revealSidebar();},X);}revealSidebar(){this.clearRevealFailsafe(),requestAnimationFrame(()=>{requestAnimationFrame(()=>{const e=document.getElementById(S);e&&(e.textContent="");});});}clearRevealFailsafe(){this.revealFailsafeTimer!==null&&(clearTimeout(this.revealFailsafeTimer),this.revealFailsafeTimer=null);}setupNavigationInterception(){const e=()=>{const n=location.href;n!==this.lastUrl&&(this.lastUrl=n,this.handleNavigation());},t=history.pushState.bind(history);history.pushState=(...n)=>{t(...n),e();};const i=history.replaceState.bind(history);history.replaceState=(...n)=>{i(...n),e();},window.addEventListener("popstate",()=>{e();});}handleNavigation(){this.cloakSidebar();let e=0;const t=()=>{this.guardedApplySettings();const i=document.querySelector('[data-testid="sidebarColumn"]');if(i!==null&&i.children.length>0||e>=V){this.revealSidebar(),this.reattachSidebarObserver();return}e++,setTimeout(t,C);};setTimeout(t,C);}startPrimaryMutationObserver(){this.primaryMutationObserver=new MutationObserver(()=>{this.isApplyingSettings||(this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(()=>{this.applySettingsDebounceTimer&&clearTimeout(this.applySettingsDebounceTimer),this.applySettingsDebounceTimer=setTimeout(()=>{this.guardedApplySettings(),this.reattachPrimaryObserverIfNeeded(),this.rafId=null;},500);}));}),this.attachPrimaryObserver();}attachPrimaryObserver(){if(!this.primaryMutationObserver)return;this.primaryMutationObserver.disconnect();const e=document.querySelector('[data-testid="primaryColumn"]'),t=e??document.body;this.primaryObservingBody=!e,this.primaryMutationObserver.observe(t,{childList:true,subtree:true});}reattachPrimaryObserverIfNeeded(){if(!this.primaryObservingBody)return;document.querySelector('[data-testid="primaryColumn"]')&&this.attachPrimaryObserver();}startSidebarMutationObserver(){const e=document.querySelector('[data-testid="sidebarColumn"]');e&&(this.sidebarMutationObserver=new MutationObserver(t=>{this.isApplyingSettings||!t.some(n=>n.type==="childList"&&(n.addedNodes.length>0||n.removedNodes.length>0))||(this.sidebarDebounceTimer&&clearTimeout(this.sidebarDebounceTimer),this.sidebarDebounceTimer=setTimeout(()=>{this.guardedApplySettings();},200));}),this.sidebarMutationObserver.observe(e,{childList:true,subtree:true}));}reattachSidebarObserver(){this.sidebarMutationObserver&&(this.sidebarMutationObserver.disconnect(),this.sidebarMutationObserver=null),this.startSidebarMutationObserver();}startSettingsWatcher(){let e=0;const t=setInterval(()=>{this.guardedApplySettings(),e++,e>=10&&clearInterval(t);},500);this.settingsWatcherInterval=setInterval(()=>{this.guardedApplySettings();},5e3);}registerMenuCommand(){typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand(u("openSettings"),()=>{this.settingsUI.show();}):document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="X"&&(e.preventDefault(),this.settingsUI.show());});}destroy(){this.settingsWatcherInterval&&clearInterval(this.settingsWatcherInterval),this.applySettingsDebounceTimer&&clearTimeout(this.applySettingsDebounceTimer),this.sidebarDebounceTimer&&clearTimeout(this.sidebarDebounceTimer),this.clearRevealFailsafe(),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.primaryMutationObserver&&this.primaryMutationObserver.disconnect(),this.sidebarMutationObserver&&this.sidebarMutationObserver.disconnect(),this.detector.stopObserving(),this.controller.destroy(),this.settingsUI.destroy(),this.isInitialized=false;}}function Y(){return new Promise(r=>{document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>r()):r();})}function J(r=1e4){return new Promise((e,t)=>{const i=Date.now(),n=()=>{if(document.getElementById("react-root")){e();return}if(Date.now()-i>r){t(new Error("Timeout waiting for react-root"));return}setTimeout(n,100);};n();})}(async()=>{try{await Y(),await J();const r=new K;await r.initialize(),window.twitterCleanUI=r;}catch(r){console.error("[TwitterCleanUI] Fatal error:",r);const e=document.getElementById(S);e&&(e.textContent="");}})();

})();