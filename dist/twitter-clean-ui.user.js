// ==UserScript==
// @name         twitter-clean-ui
// @namespace    twitterCleanUI
// @version      1.6.4
// @author       roflsunriz
// @description  X/Twitterのメニューとサイドバーをカスタマイズ。UI要素の表示/非表示、幅調整、広告非表示などをリアルタイムプレビューで設定可能。Grok、コミュニティ、つながる、ビジネスのON/OFF対応。ツイート詳細ページの関連性の高いアカウント表示切替対応。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const b="twitter_clean_ui_settings",f={visibility:{leftSidebar:true,leftSidebar_Logo:true,leftSidebar_HomeLink:true,leftSidebar_ExploreLink:true,leftSidebar_NotificationsLink:true,leftSidebar_MessagesLink:true,leftSidebar_GrokLink:true,leftSidebar_ConnectLink:true,leftSidebar_BookmarksLink:true,leftSidebar_ListsLink:true,leftSidebar_CommunitiesLink:true,leftSidebar_ProfileLink:true,leftSidebar_PremiumLink:true,leftSidebar_BusinessLink:true,leftSidebar_MoreMenu:true,leftSidebar_TweetButton:true,leftSidebar_ProfileMenu:true,rightSidebar:true,rightSidebar_SearchBox:true,rightSidebar_PremiumSubscribe:false,rightSidebar_TrendsList:true,rightSidebar_WhoToFollow:true,rightSidebar_RelatedAccounts:true,rightSidebar_Footer:true},layout:{leftSidebarWidth:275,mainContentWidth:600,timelineRightPadding:0},enableRealTimePreview:true,language:"ja"},m=[{id:"leftSidebar",category:"leftSidebar",description:"左サイドバー全体",strategies:[{type:"querySelector",selector:'header[role="banner"]',method:"header banner role",confidence:.95}]},{id:"leftSidebar_Logo",category:"leftSidebar",description:"Xロゴ",strategies:[{type:"querySelector",selector:'h1[role="heading"] a[aria-label*="X"]',method:"X logo link",confidence:.9}]},{id:"leftSidebar_HomeLink",category:"leftSidebar",description:"ホームリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Home_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ExploreLink",category:"leftSidebar",description:"話題を検索リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Explore_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_NotificationsLink",category:"leftSidebar",description:"通知リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Notifications_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_MessagesLink",category:"leftSidebar",description:"メッセージリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_DirectMessage_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_GrokLink",category:"leftSidebar",description:"Grokリンク",strategies:[{type:"querySelector",selector:'a[href="/i/grok"]',method:"href selector",confidence:.95},{type:"querySelector",selector:'a[aria-label="Grok"]',method:"aria-label",confidence:.9}]},{id:"leftSidebar_ConnectLink",category:"leftSidebar",description:"つながるリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Connect_Link"]',method:"data-testid",confidence:.95},{type:"querySelector",selector:'a[href="/i/connect_people"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_BookmarksLink",category:"leftSidebar",description:"ブックマークリンク",strategies:[{type:"querySelector",selector:'a[href="/i/bookmarks"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_ListsLink",category:"leftSidebar",description:"リストリンク",strategies:[{type:"querySelector",selector:'a[href*="/lists"]',method:"href contains",confidence:.85}]},{id:"leftSidebar_CommunitiesLink",category:"leftSidebar",description:"コミュニティリンク",strategies:[{type:"querySelector",selector:'a[href*="/communities"]',method:"href contains",confidence:.9},{type:"querySelector",selector:'a[aria-label="コミュニティ"], a[aria-label="Communities"]',method:"aria-label",confidence:.95}]},{id:"leftSidebar_ProfileLink",category:"leftSidebar",description:"プロフィールリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Profile_Link"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_PremiumLink",category:"leftSidebar",description:"Premiumリンク",strategies:[{type:"querySelector",selector:'a[href="/i/premium_sign_up"]',method:"href selector",confidence:.9},{type:"querySelector",selector:'a[data-testid="premium-signup-tab"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_BusinessLink",category:"leftSidebar",description:"ビジネスリンク",strategies:[{type:"querySelector",selector:'a[data-testid="premium-business-signup-tab"]',method:"data-testid",confidence:.95},{type:"querySelector",selector:'a[href="/i/premium-business"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_MoreMenu",category:"leftSidebar",description:"もっと見るメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="AppTabBar_More_Menu"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_TweetButton",category:"leftSidebar",description:"ツイート作成ボタン",strategies:[{type:"querySelector",selector:'a[data-testid="SideNav_NewTweet_Button"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ProfileMenu",category:"leftSidebar",description:"プロフィールメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="SideNav_AccountSwitcher_Button"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar",category:"rightSidebar",description:"右サイドバー全体",strategies:[{type:"querySelector",selector:'[data-testid="sidebarColumn"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar_SearchBox",category:"rightSidebar",description:"検索ボックス",strategies:[{type:"custom",method:"Search box container",confidence:.85,finder:()=>{const o=document.querySelector('[data-testid="SearchBox_Search_Input"]');if(!o)return null;const e=document.querySelector('[data-testid="sidebarColumn"]');if(!e)return null;let t=o;for(let n=0;n<8&&!(!t.parentElement||(t=t.parentElement,t===e)||!e.contains(t));n++){const r=window.getComputedStyle(t),a=r.backgroundColor!=="rgba(0, 0, 0, 0)"&&r.backgroundColor!=="transparent",l=r.border!==""&&r.border!=="0px none rgb(0, 0, 0)",c=r.borderRadius!=="0px";if((a||l)&&c)return t.parentElement&&e.contains(t.parentElement)&&t.parentElement!==e?t.parentElement:t}let i=o;for(let n=0;n<5&&!(!i.parentElement||i.parentElement===e);n++)i=i.parentElement;return i}}]},{id:"rightSidebar_PremiumSubscribe",category:"rightSidebar",description:"Premiumサブスクライブセクション",strategies:[{type:"custom",method:"Premium subscribe section - find bordered container first",confidence:.9,finder:()=>{const o=document.querySelector('[data-testid="sidebarColumn"]');if(!o)return null;const e=Array.from(o.querySelectorAll("div"));for(const t of e){const i=window.getComputedStyle(t),n=i.border.match(/^(\d+(?:\.\d+)?)px/),r=n&&parseFloat(n[1])>0,a=i.borderRadius!=="0px"&&i.borderRadius!=="9999px";if(r&&a){const l=t.textContent||"";if(l.length<500&&(l.includes("プレミアムにサブスクライブ")||l.includes("Subscribe to Premium")))return t}}return null}}]},{id:"rightSidebar_TrendsList",category:"rightSidebar",description:"トレンド一覧",strategies:[{type:"custom",method:"Trends list with border container",confidence:.9,finder:()=>{const o=document.querySelectorAll('[data-testid="trend"]');if(o.length===0)return null;let t=o[0].parentElement;for(let i=0;i<8&&t;i++){if(t.querySelectorAll('[data-testid="trend"]').length>1){let r=t.parentElement;for(let a=0;a<5&&r;a++){const l=window.getComputedStyle(r),c=l.border.match(/^(\d+(?:\.\d+)?)px/);if(c&&parseFloat(c[1])>0&&l.borderRadius!=="0px")return r;r=r.parentElement;}return t.parentElement?.parentElement}t=t.parentElement;}return null}}]},{id:"rightSidebar_WhoToFollow",category:"rightSidebar",description:"おすすめユーザーセクション",strategies:[{type:"custom",method:"Who to follow with border container",confidence:.9,finder:()=>{const o=document.querySelector('aside[aria-label*="おすすめユーザー"], aside[aria-label*="Who to follow"]');if(!o)return null;let e=o;for(let t=0;t<5&&e.parentElement;t++){const i=window.getComputedStyle(e.parentElement),n=i.border.match(/^(\d+(?:\.\d+)?)px/);if(n&&parseFloat(n[1])>0&&i.borderRadius!=="0px")return e.parentElement;e=e.parentElement;}return o.parentElement?.parentElement}}]},{id:"rightSidebar_RelatedAccounts",category:"rightSidebar",description:"関連性の高いアカウント（ツイート詳細ページ）",strategies:[{type:"custom",method:"Related accounts section - find by heading text",confidence:.9,finder:()=>{const o=document.querySelector('[data-testid="sidebarColumn"]');if(!o)return null;const e=["関連性の高いアカウント","Relevant accounts","Relevant people"],t=Array.from(o.querySelectorAll("div, section, aside"));for(const i of t){const n=i.textContent||"";if(n.length>3e3)continue;let r=null;for(const a of e)if(n.includes(a)){r=a;break}if(r){let a=i;for(let l=0;l<5&&!(!a.parentElement||a.parentElement===o||!o.contains(a.parentElement));l++){const c=window.getComputedStyle(a.parentElement),s=c.border.match(/^(\d+(?:\.\d+)?)px/),h=s&&parseFloat(s[1])>0,u=c.borderRadius!=="0px";if(h&&u)return a.parentElement;a=a.parentElement;}return i.parentElement&&o.contains(i.parentElement)?i.parentElement:i}}return null}}]},{id:"rightSidebar_Footer",category:"rightSidebar",description:"フッターリンク",strategies:[{type:"custom",method:"Footer navigation",confidence:.8,finder:()=>{const o=document.querySelector('[data-testid="sidebarColumn"]');if(!o)return null;const e=Array.from(o.querySelectorAll("nav"));for(const t of e){const i=t.getAttribute("aria-label");if(i?.includes("フッター")||i?.includes("Footer"))return t.parentElement}return null}}]}];class C{detectedElements=new Map;observer=null;detectionCache=new Map;cacheTimestamps=new Map;CACHE_DURATION=3e3;constructor(){this.setupObserver();}setupObserver(){this.observer=new MutationObserver(()=>{this.detectAll();});}startObserving(){this.observer&&this.observer.observe(document.body,{childList:true,subtree:true});}stopObserving(){this.observer&&this.observer.disconnect();}getCacheKey(e){return `${e.type}:${e.selector||e.xpath||e.method}`}getFromCache(e){const t=this.getCacheKey(e),i=this.cacheTimestamps.get(t);if(i&&Date.now()-i<this.CACHE_DURATION)return this.detectionCache.get(t)}saveToCache(e,t){const i=this.getCacheKey(e);this.detectionCache.set(i,t),this.cacheTimestamps.set(i,Date.now());}clearCache(){this.detectionCache.clear(),this.cacheTimestamps.clear();}executeStrategy(e){if(e.type!=="custom"){const t=this.getFromCache(e);if(t!==void 0)return t}try{let t=null;switch(e.type){case "querySelector":{if(!e.selector)return null;t=document.querySelector(e.selector);break}case "querySelectorAll":{if(!e.selector)return null;const i=document.querySelectorAll(e.selector);t=i.length>0?i[0]:null;break}case "xpath":{if(!e.xpath)return null;t=document.evaluate(e.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;break}case "custom":{if(!e.finder)return null;t=e.finder();break}default:return null}return e.type!=="custom"&&this.saveToCache(e,t),t}catch(t){return console.warn(`[ElementDetector] Strategy failed: ${e.method}`,t),null}}detectElement(e){const t=m.find(i=>i.id===e);if(!t)return console.warn(`[ElementDetector] Definition not found: ${e}`),null;for(const i of t.strategies){const n=this.executeStrategy(i);if(n){const r={id:e,element:n,method:i.method,confidence:i.confidence};return this.detectedElements.set(e,r),r}}return this.detectedElements.delete(e),null}detectAll(){for(const e of m)this.detectElement(e.id);}getDetectedElement(e){return this.detectedElements.get(e)||null}getAllDetectedElements(){return new Map(this.detectedElements)}isDetected(e){return this.detectedElements.has(e)}getDetectedCount(){return this.detectedElements.size}getStatistics(){const e=m.length,t=this.detectedElements.size,i=e-t;let n=0;this.detectedElements.forEach(a=>{n+=a.confidence;});const r=t>0?n/t:0;return {total:e,detected:t,notDetected:i,averageConfidence:r}}destroy(){this.stopObserving(),this.detectedElements.clear(),this.clearCache();}}class v{styleElement;currentCSS="";constructor(){this.styleElement=this.createStyleElement();}createStyleElement(){const e=document.createElement("style");return e.id="twitter-clean-ui-static-styles",e.type="text/css",document.head.appendChild(e),e}generateSelector(e){const t=m.find(r=>r.id===e);if(!t)return console.log(`[CSSInjector] generateSelector: No definition found for ${e}`),"";const i=t.strategies[0];if(!i)return console.log(`[CSSInjector] generateSelector: No strategy found for ${e}`),"";let n="";switch(i.type){case "querySelector":case "querySelectorAll":n=i.selector||"";break}return console.log(`[CSSInjector] generateSelector for ${e}: type=${i.type}, selector=${n}`),n}generateVisibilityCSS(e){const t=[],{visibility:i}=e;return console.log("[CSSInjector] generateVisibilityCSS called with visibility:",i),console.log("[CSSInjector] ConnectLink value:",i.leftSidebar_ConnectLink,"type:",typeof i.leftSidebar_ConnectLink),console.log("[CSSInjector] BusinessLink value:",i.leftSidebar_BusinessLink,"type:",typeof i.leftSidebar_BusinessLink),Object.entries(i).forEach(([n,r])=>{const a=n;if(r===false){const l=this.generateSelector(a);console.log(`[CSSInjector] Element ${a} is false, selector: ${l}`),l&&t.push(`${l} { display: none !important; }`);}}),console.log("[CSSInjector] Generated CSS rules:",t),t.join(`
`)}generateLayoutCSS(e){const{layout:t}=e;return `
      /* 左サイドバーの幅 */
      header[role="banner"] {
        width: ${t.leftSidebarWidth}px !important;
        min-width: ${t.leftSidebarWidth}px !important;
        max-width: ${t.leftSidebarWidth}px !important;
        flex-shrink: 0 !important;
      }

      /* メインコンテンツの幅 - data-testidセレクタ */
      [data-testid="primaryColumn"] {
        width: ${t.mainContentWidth}px !important;
        max-width: ${t.mainContentWidth}px !important;
        min-width: ${t.mainContentWidth}px !important;
        margin-right: ${t.timelineRightPadding}px !important;
        padding-right: 0px !important;
      }

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
    `.trim(),this.styleElement.textContent=this.currentCSS;}getCurrentCSS(){return this.currentCSS}clear(){this.styleElement.textContent="",this.currentCSS="";}destroy(){this.clear(),this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement);}}const y={wideLayoutClass:".r-1ye8kvj",wideLayoutXPath:"/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]"};class E{detector;cssInjector;appliedStyles=new Map;hiddenElements=new Set;styleElement;constructor(e){this.detector=e,this.cssInjector=new v,this.styleElement=this.createStyleElement();}createStyleElement(){const e=document.createElement("style");return e.id="twitter-clean-ui-dynamic-styles",document.head.appendChild(e),e}hideElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,n=window.getComputedStyle(i).display;this.appliedStyles.has(e)||this.appliedStyles.set(e,n),i.style.setProperty("display","none","important"),this.hiddenElements.add(e);}showElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,n=this.appliedStyles.get(e);n?i.style.display=n:i.style.removeProperty("display"),this.hiddenElements.delete(e);}toggleElement(e,t){t?this.showElement(e):this.hideElement(e);}applyLayout(e){const{layout:t}=e,i=`
      /* メインコンテンツの幅 - CSSクラスセレクタ（twitter-wide-layout-fixから移植） */
      ${y.wideLayoutClass} {
        max-width: ${t.mainContentWidth}px !important;
      }
    `;this.styleElement.textContent=i,this.applyStyleByXpath(t.mainContentWidth);}applyStyleByXpath(e){const t=document.evaluate(y.wideLayoutXPath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;t&&t.style.setProperty("max-width",`${e}px`,"important");}canBeHandledByCSS(e){const t=m.find(n=>n.id===e);if(!t)return  false;const i=t.strategies[0];return i?i.type==="querySelector"||i.type==="querySelectorAll":false}applySettings(e){console.log("[ElementController] applySettings called"),console.log("[ElementController] visibility:",e.visibility),console.log("[ElementController] ConnectLink:",e.visibility.leftSidebar_ConnectLink),console.log("[ElementController] BusinessLink:",e.visibility.leftSidebar_BusinessLink),this.cssInjector.applySettings(e),this.applyLayout(e);const{visibility:t}=e;Object.entries(t).forEach(([i,n])=>{const r=i;this.canBeHandledByCSS(r)||this.detector.isDetected(r)&&this.toggleElement(r,n);});}reset(){this.hiddenElements.forEach(e=>{this.showElement(e);}),this.cssInjector.clear(),this.styleElement.textContent="",this.appliedStyles.clear(),this.hiddenElements.clear();}setElementWidth(e,t){const i=this.detector.getDetectedElement(e);i&&(i.element.style.setProperty("width",`${t}px`,"important"),i.element.style.setProperty("min-width",`${t}px`,"important"));}setElementPadding(e,t){const i=this.detector.getDetectedElement(e);i&&i.element.style.setProperty("padding",`${t}px`,"important");}isHidden(e){return this.hiddenElements.has(e)}destroy(){this.reset(),this.cssInjector.destroy(),this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement),this.appliedStyles.clear(),this.hiddenElements.clear();}}class k{currentSettings;profiles=new Map;currentProfileId="default";constructor(){this.currentSettings={...f},this.load();}async load(){try{const e=await this.loadFromStorage();console.log("[SettingsManager] Loaded data from storage:",e),e?(console.log("[SettingsManager] Before merge - data.settings.visibility:",e.settings?.visibility),this.currentSettings=this.mergeWithDefaults(e.settings),console.log("[SettingsManager] After merge - currentSettings.visibility:",this.currentSettings.visibility),console.log("[SettingsManager] ConnectLink:",this.currentSettings.visibility.leftSidebar_ConnectLink),console.log("[SettingsManager] BusinessLink:",this.currentSettings.visibility.leftSidebar_BusinessLink),this.currentProfileId=e.currentProfileId,Object.entries(e.profiles).forEach(([t,i])=>{this.profiles.set(t,{...i,settings:this.mergeWithDefaults(i.settings)});})):(console.log("[SettingsManager] No data found, creating default profile"),this.createDefaultProfile());}catch(e){console.error("[SettingsManager] Failed to load settings:",e),this.createDefaultProfile();}}mergeWithDefaults(e){const t={...f,...e,visibility:{...f.visibility,...e.visibility},layout:{...f.layout,...e.layout}};return console.log("[SettingsManager] mergeWithDefaults result:",t.visibility),t}async loadFromStorage(){return new Promise(e=>{if(typeof GM_getValue>"u"){const t=localStorage.getItem(b);e(t?JSON.parse(t):null);}else {const t=GM_getValue(b,null);e(t?JSON.parse(t):null);}})}async saveToStorage(e){return new Promise(t=>{const i=JSON.stringify(e);typeof GM_setValue>"u"?localStorage.setItem(b,i):GM_setValue(b,i),t();})}createDefaultProfile(){const e=Date.now(),t={id:"default",name:"Default",settings:{...f},createdAt:e,updatedAt:e};this.profiles.set("default",t),this.currentProfileId="default",this.currentSettings={...f},this.save();}getSettings(){return {...this.currentSettings}}updateSettings(e){this.currentSettings={...this.currentSettings,...e,visibility:{...this.currentSettings.visibility,...e.visibility||{}},layout:{...this.currentSettings.layout,...e.layout||{}}};const t=this.profiles.get(this.currentProfileId);t&&(t.settings={...this.currentSettings},t.updatedAt=Date.now()),this.save();}async save(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};await this.saveToStorage(e);}reset(){this.currentSettings={...f},this.save();}createProfile(e){const t=`profile_${Date.now()}`,i=Date.now(),n={id:t,name:e,settings:{...this.currentSettings},createdAt:i,updatedAt:i};return this.profiles.set(t,n),this.save(),n}deleteProfile(e){if(e==="default")return console.warn("[SettingsManager] Cannot delete default profile"),false;const t=this.profiles.delete(e);return t&&(this.currentProfileId===e&&this.switchProfile("default"),this.save()),t}switchProfile(e){const t=this.profiles.get(e);return t?(this.currentProfileId=e,this.currentSettings={...t.settings},this.save(),true):(console.warn(`[SettingsManager] Profile not found: ${e}`),false)}getCurrentProfileId(){return this.currentProfileId}getProfile(e){return this.profiles.get(e)||null}getAllProfiles(){return Array.from(this.profiles.values())}exportSettings(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};return JSON.stringify(e,null,2)}importSettings(e){try{const t=JSON.parse(e);if(!t.settings||!t.profiles||!t.currentProfileId)throw new Error("Invalid settings data");return this.currentSettings=t.settings,this.currentProfileId=t.currentProfileId,this.profiles.clear(),Object.entries(t.profiles).forEach(([i,n])=>{this.profiles.set(i,n);}),this.save(),!0}catch(t){return console.error("[SettingsManager] Failed to import settings:",t),false}}renameProfile(e,t){const i=this.profiles.get(e);return i?(i.name=t,i.updatedAt=Date.now(),this.save(),true):false}}const x={appName:"twitter-clean-ui",settings:"設定",save:"保存",cancel:"キャンセル",reset:"リセット",apply:"適用",close:"閉じる",leftSidebarSettings:"左サイドバー設定",rightSidebarSettings:"右サイドバー設定",layoutSettings:"レイアウト設定",profileSettings:"プロファイル設定",leftSidebar:"左サイドバー全体",leftSidebar_Logo:"Xロゴ",leftSidebar_HomeLink:"ホーム",leftSidebar_ExploreLink:"話題を検索",leftSidebar_NotificationsLink:"通知",leftSidebar_MessagesLink:"メッセージ",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"つながる",leftSidebar_BookmarksLink:"ブックマーク",leftSidebar_ListsLink:"リスト",leftSidebar_CommunitiesLink:"コミュニティ",leftSidebar_ProfileLink:"プロフィール",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"ビジネス",leftSidebar_MoreMenu:"もっと見る",leftSidebar_TweetButton:"ポストボタン",leftSidebar_ProfileMenu:"プロフィールメニュー",rightSidebar:"右サイドバー全体",rightSidebar_SearchBox:"検索ボックス",rightSidebar_PremiumSubscribe:"Premiumサブスクライブ",rightSidebar_TrendsList:"トレンド",rightSidebar_WhoToFollow:"おすすめユーザー",rightSidebar_RelatedAccounts:"関連性の高いアカウント",rightSidebar_Footer:"フッター",leftSidebarWidth:"左サイドバーの幅",mainContentWidth:"メインコンテンツの幅",timelineRightPadding:"タイムラインと右サイドバー間の余白",enableRealTimePreview:"リアルタイムプレビュー",createNewProfile:"新しいプロファイルを作成",deleteProfile:"プロファイルを削除",exportSettings:"設定をエクスポート",importSettings:"設定をインポート"},_={appName:"twitter-clean-ui",settings:"Settings",save:"Save",cancel:"Cancel",reset:"Reset",apply:"Apply",close:"Close",leftSidebarSettings:"Left Sidebar Settings",rightSidebarSettings:"Right Sidebar Settings",layoutSettings:"Layout Settings",profileSettings:"Profile Settings",leftSidebar:"Left Sidebar (Entire)",leftSidebar_Logo:"X Logo",leftSidebar_HomeLink:"Home",leftSidebar_ExploreLink:"Explore",leftSidebar_NotificationsLink:"Notifications",leftSidebar_MessagesLink:"Messages",leftSidebar_GrokLink:"Grok",leftSidebar_ConnectLink:"Connect",leftSidebar_BookmarksLink:"Bookmarks",leftSidebar_ListsLink:"Lists",leftSidebar_CommunitiesLink:"Communities",leftSidebar_ProfileLink:"Profile",leftSidebar_PremiumLink:"Premium",leftSidebar_BusinessLink:"Business",leftSidebar_MoreMenu:"More",leftSidebar_TweetButton:"Post Button",leftSidebar_ProfileMenu:"Profile Menu",rightSidebar:"Right Sidebar (Entire)",rightSidebar_SearchBox:"Search Box",rightSidebar_PremiumSubscribe:"Premium Subscribe",rightSidebar_TrendsList:"Trends",rightSidebar_WhoToFollow:"Who to Follow",rightSidebar_RelatedAccounts:"Relevant Accounts",rightSidebar_Footer:"Footer",leftSidebarWidth:"Left Sidebar Width",mainContentWidth:"Main Content Width",timelineRightPadding:"Timeline Right Padding",enableRealTimePreview:"Real-time Preview",createNewProfile:"Create New Profile",deleteProfile:"Delete Profile",exportSettings:"Export Settings",importSettings:"Import Settings"},L={ja:x,en:_};let w="ja";function T(o){w=o;}function P(){return navigator.language.toLowerCase().startsWith("ja")?"ja":"en"}function d(o){return L[w][o]}const M=`
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
`;class I{settingsManager;controller;overlay=null;styleElement=null;constructor(e,t){this.settingsManager=e,this.controller=t,this.injectStyles();}injectStyles(){this.styleElement||(this.styleElement=document.createElement("style"),this.styleElement.textContent=M,document.head.appendChild(this.styleElement));}show(){this.overlay||(this.overlay=this.createOverlay(),document.body.appendChild(this.overlay),setTimeout(()=>{this.showTab("visibility");},0));}hide(){this.overlay&&(this.overlay.remove(),this.overlay=null);}createOverlay(){const e=document.createElement("div");e.className="twitter-clean-ui-overlay",e.addEventListener("click",i=>{i.target===e&&this.hide();});const t=this.createModal();return e.appendChild(t),e}createModal(){const e=document.createElement("div");e.className="twitter-clean-ui-modal";const t=this.createHeader();e.appendChild(t);const i=this.createTabs();e.appendChild(i);const n=document.createElement("div");n.className="twitter-clean-ui-body",n.id="twitter-clean-ui-body",e.appendChild(n);const r=this.createFooter();return e.appendChild(r),e}createHeader(){const e=document.createElement("div");e.className="twitter-clean-ui-header";const t=document.createElement("h2");t.className="twitter-clean-ui-title",t.textContent=d("appName"),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-close",i.textContent="×",i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}createTabs(){const e=document.createElement("div");return e.className="twitter-clean-ui-tabs",[{id:"visibility",label:d("leftSidebarSettings")},{id:"rightSidebar",label:d("rightSidebarSettings")},{id:"layout",label:d("layoutSettings")},{id:"profiles",label:d("profileSettings")}].forEach((i,n)=>{const r=document.createElement("button");r.className=`twitter-clean-ui-tab ${n===0?"active":""}`,r.textContent=i.label,r.addEventListener("click",()=>{e.querySelectorAll(".twitter-clean-ui-tab").forEach(a=>{a.classList.remove("active");}),r.classList.add("active"),this.showTab(i.id);}),e.appendChild(r);}),e}showTab(e){const t=document.getElementById("twitter-clean-ui-body");if(t)switch(t.innerHTML="",e){case "visibility":t.appendChild(this.createVisibilityTab());break;case "rightSidebar":t.appendChild(this.createRightSidebarTab());break;case "layout":t.appendChild(this.createLayoutTab());break;case "profiles":t.appendChild(this.createProfilesTab());break}}createVisibilityTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(d("leftSidebarSettings"));return ["leftSidebar_Logo","leftSidebar_HomeLink","leftSidebar_ExploreLink","leftSidebar_NotificationsLink","leftSidebar_ConnectLink","leftSidebar_MessagesLink","leftSidebar_GrokLink","leftSidebar_BookmarksLink","leftSidebar_ListsLink","leftSidebar_CommunitiesLink","leftSidebar_ProfileLink","leftSidebar_PremiumLink","leftSidebar_BusinessLink","leftSidebar_MoreMenu","leftSidebar_TweetButton","leftSidebar_ProfileMenu"].forEach(r=>{const l=t.visibility[r];console.log(`[SettingsUI] Creating toggle for ${r}: value=${l}, type=${typeof l}, fallback=${l??true}`);const c=this.createToggleControl(d(r),l??true,s=>{console.log(`[SettingsUI] Toggle changed for ${r}: ${s}`);const h={[r]:s};this.settingsManager.updateSettings({visibility:h});const u=this.settingsManager.getSettings();console.log(`[SettingsUI] After update - ${r}:`,u.visibility[r]),u.enableRealTimePreview&&(console.log("[SettingsUI] Applying settings for real-time preview"),this.controller.applySettings(u));});i.appendChild(c);}),e.appendChild(i),e}createRightSidebarTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(d("rightSidebarSettings"));return ["rightSidebar","rightSidebar_SearchBox","rightSidebar_PremiumSubscribe","rightSidebar_TrendsList","rightSidebar_WhoToFollow","rightSidebar_RelatedAccounts","rightSidebar_Footer"].forEach(r=>{const a=t.visibility,l=this.createToggleControl(d(r),a[r]??true,c=>{const s={[r]:c};this.settingsManager.updateSettings({visibility:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(l);}),e.appendChild(i),e}createLayoutTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(d("layoutSettings")),n=this.createSliderControl(d("leftSidebarWidth"),t.layout.leftSidebarWidth,200,400,c=>{const s={leftSidebarWidth:c};this.settingsManager.updateSettings({layout:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(n);const r=this.createSliderControl(d("mainContentWidth"),t.layout.mainContentWidth,500,1200,c=>{const s={mainContentWidth:c};this.settingsManager.updateSettings({layout:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(r);const a=this.createSliderControl(d("timelineRightPadding"),t.layout.timelineRightPadding,0,100,c=>{const s={timelineRightPadding:c};this.settingsManager.updateSettings({layout:s}),this.settingsManager.getSettings().enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(a);const l=this.createToggleControl(d("enableRealTimePreview"),t.enableRealTimePreview,c=>{this.settingsManager.updateSettings({enableRealTimePreview:c});});return i.appendChild(l),e.appendChild(i),e}createProfilesTab(){const e=document.createElement("div"),t=this.createSection(d("profileSettings")),i=this.settingsManager.getAllProfiles(),n=this.settingsManager.getCurrentProfileId(),r=document.createElement("ul");r.className="twitter-clean-ui-profile-list",i.forEach(s=>{const h=document.createElement("li");h.className=`twitter-clean-ui-profile-item ${s.id===n?"active":""}`;const u=document.createElement("span");u.className="twitter-clean-ui-profile-name",u.textContent=s.name,h.appendChild(u);const p=document.createElement("div");if(p.className="twitter-clean-ui-profile-actions",s.id!==n){const g=document.createElement("button");g.className="twitter-clean-ui-icon-button",g.textContent="✓",g.title="切り替え",g.addEventListener("click",S=>{S.stopPropagation(),this.settingsManager.switchProfile(s.id),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles");}),p.appendChild(g);}if(s.id!=="default"){const g=document.createElement("button");g.className="twitter-clean-ui-icon-button",g.textContent="🗑",g.title="削除",g.addEventListener("click",S=>{S.stopPropagation(),confirm(`${s.name} を削除しますか？`)&&(this.settingsManager.deleteProfile(s.id),this.showTab("profiles"));}),p.appendChild(g);}h.appendChild(p),r.appendChild(h);}),t.appendChild(r);const a=document.createElement("button");a.className="twitter-clean-ui-button twitter-clean-ui-button-primary",a.textContent=d("createNewProfile"),a.style.marginTop="12px",a.addEventListener("click",()=>{const s=prompt("プロファイル名を入力してください:");s&&(this.settingsManager.createProfile(s),this.showTab("profiles"));}),t.appendChild(a);const l=document.createElement("button");l.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",l.textContent=d("exportSettings"),l.style.marginTop="12px",l.addEventListener("click",()=>{const s=this.settingsManager.exportSettings(),h=new Blob([s],{type:"application/json"}),u=URL.createObjectURL(h),p=document.createElement("a");p.href=u,p.download=`twitter-clean-ui-settings-${Date.now()}.json`,p.click(),URL.revokeObjectURL(u);}),t.appendChild(l);const c=document.createElement("button");return c.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",c.textContent=d("importSettings"),c.style.marginTop="12px",c.style.marginLeft="8px",c.addEventListener("click",()=>{const s=document.createElement("input");s.type="file",s.accept="application/json",s.addEventListener("change",async h=>{const u=h.target.files?.[0];if(u){const p=await u.text();this.settingsManager.importSettings(p)?(alert("設定をインポートしました"),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles")):alert("設定のインポートに失敗しました");}}),s.click();}),t.appendChild(c),e.appendChild(t),e}createSection(e){const t=document.createElement("div");t.className="twitter-clean-ui-section";const i=document.createElement("span");return i.className="twitter-clean-ui-section-title",i.textContent=e,t.appendChild(i),t}createToggleControl(e,t,i){const n=document.createElement("div");n.className="twitter-clean-ui-control";const r=document.createElement("span");r.className="twitter-clean-ui-label",r.textContent=e,n.appendChild(r);const a=document.createElement("div");a.className=`twitter-clean-ui-toggle ${t?"active":""}`;const l=document.createElement("div");return l.className="twitter-clean-ui-toggle-slider",a.appendChild(l),a.addEventListener("click",()=>{const c=a.classList.toggle("active");i(c);}),n.appendChild(a),n}createSliderControl(e,t,i,n,r){const a=document.createElement("div");a.className="twitter-clean-ui-control";const l=document.createElement("span");l.className="twitter-clean-ui-label",l.textContent=e,a.appendChild(l);const c=document.createElement("div");c.className="twitter-clean-ui-slider-container";const s=document.createElement("input");s.type="range",s.className="twitter-clean-ui-slider",s.min=String(i),s.max=String(n),s.value=String(t),c.appendChild(s);const h=document.createElement("span");return h.className="twitter-clean-ui-slider-value",h.textContent=`${t}px`,c.appendChild(h),s.addEventListener("input",()=>{const u=Number(s.value);h.textContent=`${u}px`,r(u);}),a.appendChild(c),a}createFooter(){const e=document.createElement("div");e.className="twitter-clean-ui-footer";const t=document.createElement("button");t.className="twitter-clean-ui-button twitter-clean-ui-button-danger",t.textContent=d("reset"),t.addEventListener("click",()=>{confirm("設定をリセットしますか？")&&(this.settingsManager.reset(),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("visibility"));}),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",i.textContent=d("close"),i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}destroy(){this.hide(),this.styleElement&&this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement);}}class N{detector;controller;settingsManager;settingsUI;isInitialized=false;settingsWatcherInterval=null;mutationObserver=null;applySettingsDebounceTimer=null;rafId=null;constructor(){this.detector=new C,this.controller=new E(this.detector),this.settingsManager=new k,this.settingsUI=new I(this.settingsManager,this.controller);}async initialize(){if(this.isInitialized){console.log("[TwitterCleanUI] Already initialized");return}console.log("[TwitterCleanUI] Initializing...");try{const e=this.settingsManager.getSettings();console.log("[TwitterCleanUI] Initial settings:",e),console.log("[TwitterCleanUI] visibility keys:",Object.keys(e.visibility)),console.log("[TwitterCleanUI] ConnectLink in settings:",e.visibility.leftSidebar_ConnectLink),console.log("[TwitterCleanUI] BusinessLink in settings:",e.visibility.leftSidebar_BusinessLink),T(e.language||P()),this.detector.detectAll();const t=this.detector.getStatistics();console.log(`[TwitterCleanUI] Detected ${t.detected}/${t.total} elements`),this.controller.applySettings(e),console.log("[TwitterCleanUI] Settings applied"),this.startMutationObserver(),this.registerMenuCommand(),this.startSettingsWatcher(),this.isInitialized=!0,console.log("[TwitterCleanUI] Initialized successfully");}catch(e){console.error("[TwitterCleanUI] Initialization failed:",e);}}startMutationObserver(){this.mutationObserver=new MutationObserver(()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(()=>{this.applySettingsDebounceTimer&&clearTimeout(this.applySettingsDebounceTimer),this.applySettingsDebounceTimer=setTimeout(()=>{this.detector.detectAll(),this.controller.applySettings(this.settingsManager.getSettings()),this.rafId=null;},500);});});const e=document.querySelector('[data-testid="primaryColumn"]');e?this.mutationObserver.observe(e,{childList:true,subtree:true}):this.mutationObserver.observe(document.body,{childList:true,subtree:true});}startSettingsWatcher(){let e=0;const t=setInterval(()=>{this.detector.detectAll(),this.controller.applySettings(this.settingsManager.getSettings()),e++,e>=10&&clearInterval(t);},500);this.settingsWatcherInterval=setInterval(()=>{this.detector.detectAll(),this.controller.applySettings(this.settingsManager.getSettings());},5e3);}registerMenuCommand(){typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand("設定を開く",()=>{this.settingsUI.show();}):(document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="X"&&(e.preventDefault(),this.settingsUI.show());}),console.log("[TwitterCleanUI] Keyboard shortcut registered: Ctrl + Shift + X"));}destroy(){this.settingsWatcherInterval&&clearInterval(this.settingsWatcherInterval),this.applySettingsDebounceTimer&&clearTimeout(this.applySettingsDebounceTimer),this.rafId!==null&&cancelAnimationFrame(this.rafId),this.mutationObserver&&this.mutationObserver.disconnect(),this.detector.stopObserving(),this.controller.destroy(),this.settingsUI.destroy(),this.isInitialized=false,console.log("[TwitterCleanUI] Destroyed");}}function B(){return new Promise(o=>{document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>o()):o();})}function R(o=1e4){return new Promise((e,t)=>{const i=Date.now(),n=()=>{if(document.getElementById("react-root")){e();return}if(Date.now()-i>o){t(new Error("Timeout waiting for react-root"));return}setTimeout(n,100);};n();})}(async()=>{try{console.log("[TwitterCleanUI] Starting..."),await B(),console.log("[TwitterCleanUI] Page loaded"),await R(),console.log("[TwitterCleanUI] React root found");const o=new N;await o.initialize(),window.twitterCleanUI=o;}catch(o){console.error("[TwitterCleanUI] Fatal error:",o);}})();

})();