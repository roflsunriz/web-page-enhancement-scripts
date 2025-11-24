// ==UserScript==
// @name         twitter-clean-ui
// @namespace    twitterCleanUI
// @version      1.1.0
// @author       roflsunriz
// @description  X/Twitterのメニューとサイドバーをカスタマイズ。UI要素の表示/非表示、幅調整、広告非表示などをリアルタイムプレビューで設定可能。
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

  const m="twitter_clean_ui_settings",f={visibility:{leftSidebar:true,leftSidebar_Logo:true,leftSidebar_HomeLink:true,leftSidebar_ExploreLink:true,leftSidebar_NotificationsLink:true,leftSidebar_MessagesLink:true,leftSidebar_BookmarksLink:true,leftSidebar_ListsLink:true,leftSidebar_ProfileLink:true,leftSidebar_PremiumLink:true,leftSidebar_MoreMenu:true,leftSidebar_TweetButton:true,leftSidebar_ProfileMenu:true,rightSidebar:true,rightSidebar_SearchBox:true,rightSidebar_PremiumSubscribe:false,rightSidebar_TrendsList:true,rightSidebar_WhoToFollow:true,rightSidebar_Footer:true,mainContent_TweetComposer:true,promotedTweets:false},layout:{leftSidebarWidth:275,mainContentWidth:600,rightSidebarWidth:350,mainContentPadding:0,timelineRightPadding:0,gap:30},enableRealTimePreview:true,language:"ja"},S=[{id:"leftSidebar",category:"leftSidebar",description:"左サイドバー全体",strategies:[{type:"querySelector",selector:'header[role="banner"]',method:"header banner role",confidence:.95}]},{id:"leftSidebar_Logo",category:"leftSidebar",description:"Xロゴ",strategies:[{type:"querySelector",selector:'h1[role="heading"] a[aria-label*="X"]',method:"X logo link",confidence:.9}]},{id:"leftSidebar_HomeLink",category:"leftSidebar",description:"ホームリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Home_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ExploreLink",category:"leftSidebar",description:"話題を検索リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Explore_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_NotificationsLink",category:"leftSidebar",description:"通知リンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Notifications_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_MessagesLink",category:"leftSidebar",description:"メッセージリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_DirectMessage_Link"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_BookmarksLink",category:"leftSidebar",description:"ブックマークリンク",strategies:[{type:"querySelector",selector:'a[href="/i/bookmarks"]',method:"href selector",confidence:.9}]},{id:"leftSidebar_ListsLink",category:"leftSidebar",description:"リストリンク",strategies:[{type:"querySelector",selector:'a[href*="/lists"]',method:"href contains",confidence:.85}]},{id:"leftSidebar_ProfileLink",category:"leftSidebar",description:"プロフィールリンク",strategies:[{type:"querySelector",selector:'a[data-testid="AppTabBar_Profile_Link"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_PremiumLink",category:"leftSidebar",description:"Premiumリンク",strategies:[{type:"querySelector",selector:'a[href="/i/premium_sign_up"]',method:"href selector",confidence:.9},{type:"querySelector",selector:'a[data-testid="premium-signup-tab"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_MoreMenu",category:"leftSidebar",description:"もっと見るメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="AppTabBar_More_Menu"]',method:"data-testid",confidence:.9}]},{id:"leftSidebar_TweetButton",category:"leftSidebar",description:"ツイート作成ボタン",strategies:[{type:"querySelector",selector:'a[data-testid="SideNav_NewTweet_Button"]',method:"data-testid",confidence:.95}]},{id:"leftSidebar_ProfileMenu",category:"leftSidebar",description:"プロフィールメニュー",strategies:[{type:"querySelector",selector:'button[data-testid="SideNav_AccountSwitcher_Button"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar",category:"rightSidebar",description:"右サイドバー全体",strategies:[{type:"querySelector",selector:'[data-testid="sidebarColumn"]',method:"data-testid",confidence:.95}]},{id:"rightSidebar_SearchBox",category:"rightSidebar",description:"検索ボックス",strategies:[{type:"custom",method:"Search box container",confidence:.85,finder:()=>{const a=document.querySelector('[data-testid="SearchBox_Search_Input"]');if(!a)return null;let e=a;for(let t=0;t<10&&e.parentElement;t++){e=e.parentElement;const i=document.querySelector('[data-testid="sidebarColumn"]');if(i?.contains(e)&&e.parentElement===i.firstElementChild)return e}return null}}]},{id:"rightSidebar_PremiumSubscribe",category:"rightSidebar",description:"Premiumサブスクライブセクション",strategies:[{type:"custom",method:"Premium subscribe section with border container",confidence:.85,finder:()=>{const a=document.querySelector('[data-testid="sidebarColumn"]');if(!a)return null;const e=Array.from(a.querySelectorAll("div, section, aside"));for(const t of e){const i=t.textContent||"";if(i.includes("プレミアムにサブスクライブ")||i.includes("Subscribe to Premium")||i.includes("認証マーク")&&i.includes("プレミアム")){let r=t;for(let n=0;n<5&&r.parentElement;n++){const s=window.getComputedStyle(r.parentElement),u=s.border.match(/^(\d+(?:\.\d+)?)px/);if(u&&parseFloat(u[1])>0&&s.borderRadius!=="0px")return r.parentElement;r=r.parentElement;}return t.parentElement?.parentElement}}return null}}]},{id:"rightSidebar_TrendsList",category:"rightSidebar",description:"トレンド一覧",strategies:[{type:"custom",method:"Trends list with border container",confidence:.9,finder:()=>{const a=document.querySelectorAll('[data-testid="trend"]');if(a.length===0)return null;let t=a[0].parentElement;for(let i=0;i<8&&t;i++){if(t.querySelectorAll('[data-testid="trend"]').length>1){let n=t.parentElement;for(let s=0;s<5&&n;s++){const u=window.getComputedStyle(n),l=u.border.match(/^(\d+(?:\.\d+)?)px/);if(l&&parseFloat(l[1])>0&&u.borderRadius!=="0px")return n;n=n.parentElement;}return t.parentElement?.parentElement}t=t.parentElement;}return null}}]},{id:"rightSidebar_WhoToFollow",category:"rightSidebar",description:"おすすめユーザーセクション",strategies:[{type:"custom",method:"Who to follow with border container",confidence:.9,finder:()=>{const a=document.querySelector('aside[aria-label*="おすすめユーザー"], aside[aria-label*="Who to follow"]');if(!a)return null;let e=a;for(let t=0;t<5&&e.parentElement;t++){const i=window.getComputedStyle(e.parentElement),r=i.border.match(/^(\d+(?:\.\d+)?)px/);if(r&&parseFloat(r[1])>0&&i.borderRadius!=="0px")return e.parentElement;e=e.parentElement;}return a.parentElement?.parentElement}}]},{id:"rightSidebar_Footer",category:"rightSidebar",description:"フッターリンク",strategies:[{type:"custom",method:"Footer navigation",confidence:.8,finder:()=>{const a=document.querySelector('[data-testid="sidebarColumn"]');if(!a)return null;const e=Array.from(a.querySelectorAll("nav"));for(const t of e){const i=t.getAttribute("aria-label");if(i?.includes("フッター")||i?.includes("Footer"))return t.parentElement}return null}}]},{id:"mainContent",category:"mainContent",description:"メインコンテンツエリア",strategies:[{type:"querySelector",selector:'[data-testid="primaryColumn"]',method:"data-testid",confidence:.95}]},{id:"mainContent_TweetComposer",category:"mainContent",description:"ツイート作成ボックス",strategies:[{type:"custom",method:"Tweet composer container",confidence:.85,finder:()=>{const a=document.querySelector('[data-testid="tweetTextarea_0"]');if(!a)return null;let e=a;for(let t=0;t<15&&e.parentElement;t++){e=e.parentElement;const i=document.querySelector('[data-testid="primaryColumn"]');if(i?.contains(e)&&e.parentElement===i)return e}return null}}]},{id:"promotedTweets",category:"mainContent",description:"広告ツイート",strategies:[{type:"querySelectorAll",selector:'[data-testid="placementTracking"]',method:"data-testid",confidence:.9}]}];class w{detectedElements=new Map;observer=null;constructor(){this.setupObserver();}setupObserver(){this.observer=new MutationObserver(()=>{this.detectAll();});}startObserving(){this.observer&&this.observer.observe(document.body,{childList:true,subtree:true});}stopObserving(){this.observer&&this.observer.disconnect();}executeStrategy(e){try{switch(e.type){case "querySelector":return e.selector?document.querySelector(e.selector):null;case "querySelectorAll":{if(!e.selector)return null;const t=document.querySelectorAll(e.selector);return t.length>0?t[0]:null}case "xpath":return e.xpath?document.evaluate(e.xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue:null;case "custom":return e.finder?e.finder():null;default:return null}}catch(t){return console.warn(`[ElementDetector] Strategy failed: ${e.method}`,t),null}}detectElement(e){const t=S.find(i=>i.id===e);if(!t)return console.warn(`[ElementDetector] Definition not found: ${e}`),null;for(const i of t.strategies){const r=this.executeStrategy(i);if(r){const n={id:e,element:r,method:i.method,confidence:i.confidence};return this.detectedElements.set(e,n),n}}return this.detectedElements.delete(e),null}detectAll(){for(const e of S)this.detectElement(e.id);}getDetectedElement(e){return this.detectedElements.get(e)||null}getAllDetectedElements(){return new Map(this.detectedElements)}isDetected(e){return this.detectedElements.has(e)}getDetectedCount(){return this.detectedElements.size}getStatistics(){const e=S.length,t=this.detectedElements.size,i=e-t;let r=0;this.detectedElements.forEach(s=>{r+=s.confidence;});const n=t>0?r/t:0;return {total:e,detected:t,notDetected:i,averageConfidence:n}}detectAllPromotedTweets(){const e=document.querySelectorAll('[data-testid="placementTracking"]');return Array.from(e)}destroy(){this.stopObserving(),this.detectedElements.clear();}}class E{detector;appliedStyles=new Map;hiddenElements=new Set;styleElement;constructor(e){this.detector=e,this.styleElement=this.createStyleElement();}createStyleElement(){const e=document.createElement("style");return e.id="twitter-clean-ui-styles",document.head.appendChild(e),e}hideElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,r=window.getComputedStyle(i).display;this.appliedStyles.has(e)||this.appliedStyles.set(e,r),i.style.setProperty("display","none","important"),this.hiddenElements.add(e);}showElement(e){const t=this.detector.getDetectedElement(e);if(!t)return;const i=t.element,r=this.appliedStyles.get(e);r?i.style.display=r:i.style.removeProperty("display"),this.hiddenElements.delete(e);}toggleElement(e,t){t?this.showElement(e):this.hideElement(e);}hideAllPromotedTweets(){this.detector.detectAllPromotedTweets().forEach(t=>{t.style.setProperty("display","none","important");});}applyLayout(e){const{layout:t}=e,i=`
      /* 左サイドバーの幅 */
      header[role="banner"] {
        width: ${t.leftSidebarWidth}px !important;
        min-width: ${t.leftSidebarWidth}px !important;
      }

      /* メインコンテンツの幅 */
      [data-testid="primaryColumn"] {
        max-width: ${t.mainContentWidth}px !important;
      }

      /* 右サイドバーの幅 */
      [data-testid="sidebarColumn"] {
        width: ${t.rightSidebarWidth}px !important;
        min-width: ${t.rightSidebarWidth}px !important;
      }

      /* メインコンテンツのパディング */
      main[role="main"] > div {
        padding: ${t.mainContentPadding}px !important;
      }

      /* タイムラインと右サイドバー間の余白 */
      [data-testid="primaryColumn"] {
        padding-right: ${t.timelineRightPadding}px !important;
      }

      /* カラム間の間隔 */
      main[role="main"] > div {
        gap: ${t.gap}px !important;
      }
    `;this.styleElement.textContent=i;}applySettings(e){const{visibility:t}=e;Object.entries(t).forEach(([i,r])=>{const n=i;if(n==="promotedTweets"){r||this.hideAllPromotedTweets();return}this.toggleElement(n,r);}),this.applyLayout(e);}reset(){this.hiddenElements.forEach(e=>{this.showElement(e);}),this.styleElement.textContent="",this.appliedStyles.clear(),this.hiddenElements.clear();}setElementWidth(e,t){const i=this.detector.getDetectedElement(e);i&&(i.element.style.setProperty("width",`${t}px`,"important"),i.element.style.setProperty("min-width",`${t}px`,"important"));}setElementPadding(e,t){const i=this.detector.getDetectedElement(e);i&&i.element.style.setProperty("padding",`${t}px`,"important");}isHidden(e){return this.hiddenElements.has(e)}destroy(){this.reset(),this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement),this.appliedStyles.clear(),this.hiddenElements.clear();}}class C{currentSettings;profiles=new Map;currentProfileId="default";constructor(){this.currentSettings={...f},this.load();}async load(){try{const e=await this.loadFromStorage();e?(this.currentSettings=e.settings,this.currentProfileId=e.currentProfileId,Object.entries(e.profiles).forEach(([t,i])=>{this.profiles.set(t,i);})):this.createDefaultProfile();}catch(e){console.error("[SettingsManager] Failed to load settings:",e),this.createDefaultProfile();}}async loadFromStorage(){return new Promise(e=>{if(typeof GM_getValue>"u"){const t=localStorage.getItem(m);e(t?JSON.parse(t):null);}else {const t=GM_getValue(m,null);e(t?JSON.parse(t):null);}})}async saveToStorage(e){return new Promise(t=>{const i=JSON.stringify(e);typeof GM_setValue>"u"?localStorage.setItem(m,i):GM_setValue(m,i),t();})}createDefaultProfile(){const e=Date.now(),t={id:"default",name:"Default",settings:{...f},createdAt:e,updatedAt:e};this.profiles.set("default",t),this.currentProfileId="default",this.currentSettings={...f},this.save();}getSettings(){return {...this.currentSettings}}updateSettings(e){this.currentSettings={...this.currentSettings,...e,visibility:{...this.currentSettings.visibility,...e.visibility||{}},layout:{...this.currentSettings.layout,...e.layout||{}}};const t=this.profiles.get(this.currentProfileId);t&&(t.settings={...this.currentSettings},t.updatedAt=Date.now()),this.save();}async save(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};await this.saveToStorage(e);}reset(){this.currentSettings={...f},this.save();}createProfile(e){const t=`profile_${Date.now()}`,i=Date.now(),r={id:t,name:e,settings:{...this.currentSettings},createdAt:i,updatedAt:i};return this.profiles.set(t,r),this.save(),r}deleteProfile(e){if(e==="default")return console.warn("[SettingsManager] Cannot delete default profile"),false;const t=this.profiles.delete(e);return t&&(this.currentProfileId===e&&this.switchProfile("default"),this.save()),t}switchProfile(e){const t=this.profiles.get(e);return t?(this.currentProfileId=e,this.currentSettings={...t.settings},this.save(),true):(console.warn(`[SettingsManager] Profile not found: ${e}`),false)}getCurrentProfileId(){return this.currentProfileId}getProfile(e){return this.profiles.get(e)||null}getAllProfiles(){return Array.from(this.profiles.values())}exportSettings(){const e={currentProfileId:this.currentProfileId,profiles:Object.fromEntries(this.profiles),settings:this.currentSettings};return JSON.stringify(e,null,2)}importSettings(e){try{const t=JSON.parse(e);if(!t.settings||!t.profiles||!t.currentProfileId)throw new Error("Invalid settings data");return this.currentSettings=t.settings,this.currentProfileId=t.currentProfileId,this.profiles.clear(),Object.entries(t.profiles).forEach(([i,r])=>{this.profiles.set(i,r);}),this.save(),!0}catch(t){return console.error("[SettingsManager] Failed to import settings:",t),false}}renameProfile(e,t){const i=this.profiles.get(e);return i?(i.name=t,i.updatedAt=Date.now(),this.save(),true):false}}const v={appName:"X きれいなメニューとサイドバー",settings:"設定",save:"保存",cancel:"キャンセル",reset:"リセット",apply:"適用",close:"閉じる",leftSidebarSettings:"左サイドバー設定",rightSidebarSettings:"右サイドバー設定",mainContentSettings:"メインコンテンツ設定",layoutSettings:"レイアウト設定",profileSettings:"プロファイル設定",leftSidebar:"左サイドバー全体",leftSidebar_Logo:"Xロゴ",leftSidebar_HomeLink:"ホーム",leftSidebar_ExploreLink:"話題を検索",leftSidebar_NotificationsLink:"通知",leftSidebar_MessagesLink:"メッセージ",leftSidebar_BookmarksLink:"ブックマーク",leftSidebar_ListsLink:"リスト",leftSidebar_ProfileLink:"プロフィール",leftSidebar_PremiumLink:"Premium",leftSidebar_MoreMenu:"もっと見る",leftSidebar_TweetButton:"ポストボタン",leftSidebar_ProfileMenu:"プロフィールメニュー",rightSidebar:"右サイドバー全体",rightSidebar_SearchBox:"検索ボックス",rightSidebar_PremiumSubscribe:"Premiumサブスクライブ",rightSidebar_TrendsList:"トレンド",rightSidebar_WhoToFollow:"おすすめユーザー",rightSidebar_Footer:"フッター",mainContent_TweetComposer:"ポスト作成ボックス",promotedTweets:"広告ポスト",leftSidebarWidth:"左サイドバーの幅",mainContentWidth:"メインコンテンツの幅",rightSidebarWidth:"右サイドバーの幅",mainContentPadding:"メインコンテンツの余白",timelineRightPadding:"タイムラインと右サイドバー間の余白",gap:"カラム間の間隔",enableRealTimePreview:"リアルタイムプレビュー",createNewProfile:"新しいプロファイルを作成",deleteProfile:"プロファイルを削除",exportSettings:"設定をエクスポート",importSettings:"設定をインポート"},x={appName:"X Clean Menu and Sidebar",settings:"Settings",save:"Save",cancel:"Cancel",reset:"Reset",apply:"Apply",close:"Close",leftSidebarSettings:"Left Sidebar Settings",rightSidebarSettings:"Right Sidebar Settings",mainContentSettings:"Main Content Settings",layoutSettings:"Layout Settings",profileSettings:"Profile Settings",leftSidebar:"Left Sidebar (Entire)",leftSidebar_Logo:"X Logo",leftSidebar_HomeLink:"Home",leftSidebar_ExploreLink:"Explore",leftSidebar_NotificationsLink:"Notifications",leftSidebar_MessagesLink:"Messages",leftSidebar_BookmarksLink:"Bookmarks",leftSidebar_ListsLink:"Lists",leftSidebar_ProfileLink:"Profile",leftSidebar_PremiumLink:"Premium",leftSidebar_MoreMenu:"More",leftSidebar_TweetButton:"Post Button",leftSidebar_ProfileMenu:"Profile Menu",rightSidebar:"Right Sidebar (Entire)",rightSidebar_SearchBox:"Search Box",rightSidebar_PremiumSubscribe:"Premium Subscribe",rightSidebar_TrendsList:"Trends",rightSidebar_WhoToFollow:"Who to Follow",rightSidebar_Footer:"Footer",mainContent_TweetComposer:"Post Composer",promotedTweets:"Promoted Posts",leftSidebarWidth:"Left Sidebar Width",mainContentWidth:"Main Content Width",rightSidebarWidth:"Right Sidebar Width",mainContentPadding:"Main Content Padding",timelineRightPadding:"Timeline Right Padding",gap:"Column Gap",enableRealTimePreview:"Real-time Preview",createNewProfile:"Create New Profile",deleteProfile:"Delete Profile",exportSettings:"Export Settings",importSettings:"Import Settings"},P={ja:v,en:x};let y="ja";function _(a){y=a;}function T(){return navigator.language.toLowerCase().startsWith("ja")?"ja":"en"}function c(a){return P[y][a]}const k=`
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
`;class L{settingsManager;controller;overlay=null;styleElement=null;constructor(e,t){this.settingsManager=e,this.controller=t,this.injectStyles();}injectStyles(){this.styleElement||(this.styleElement=document.createElement("style"),this.styleElement.textContent=k,document.head.appendChild(this.styleElement));}show(){this.overlay||(this.overlay=this.createOverlay(),document.body.appendChild(this.overlay),setTimeout(()=>{this.showTab("visibility");},0));}hide(){this.overlay&&(this.overlay.remove(),this.overlay=null);}createOverlay(){const e=document.createElement("div");e.className="twitter-clean-ui-overlay",e.addEventListener("click",i=>{i.target===e&&this.hide();});const t=this.createModal();return e.appendChild(t),e}createModal(){const e=document.createElement("div");e.className="twitter-clean-ui-modal";const t=this.createHeader();e.appendChild(t);const i=this.createTabs();e.appendChild(i);const r=document.createElement("div");r.className="twitter-clean-ui-body",r.id="twitter-clean-ui-body",e.appendChild(r);const n=this.createFooter();return e.appendChild(n),e}createHeader(){const e=document.createElement("div");e.className="twitter-clean-ui-header";const t=document.createElement("h2");t.className="twitter-clean-ui-title",t.textContent=c("appName"),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-close",i.textContent="×",i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}createTabs(){const e=document.createElement("div");return e.className="twitter-clean-ui-tabs",[{id:"visibility",label:c("leftSidebarSettings")},{id:"rightSidebar",label:c("rightSidebarSettings")},{id:"layout",label:c("layoutSettings")},{id:"profiles",label:c("profileSettings")}].forEach((i,r)=>{const n=document.createElement("button");n.className=`twitter-clean-ui-tab ${r===0?"active":""}`,n.textContent=i.label,n.addEventListener("click",()=>{e.querySelectorAll(".twitter-clean-ui-tab").forEach(s=>{s.classList.remove("active");}),n.classList.add("active"),this.showTab(i.id);}),e.appendChild(n);}),e}showTab(e){const t=document.getElementById("twitter-clean-ui-body");if(t)switch(t.innerHTML="",e){case "visibility":t.appendChild(this.createVisibilityTab());break;case "rightSidebar":t.appendChild(this.createRightSidebarTab());break;case "layout":t.appendChild(this.createLayoutTab());break;case "profiles":t.appendChild(this.createProfilesTab());break}}createVisibilityTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(c("leftSidebarSettings"));["leftSidebar_Logo","leftSidebar_HomeLink","leftSidebar_ExploreLink","leftSidebar_NotificationsLink","leftSidebar_MessagesLink","leftSidebar_BookmarksLink","leftSidebar_ListsLink","leftSidebar_ProfileLink","leftSidebar_PremiumLink","leftSidebar_MoreMenu","leftSidebar_TweetButton","leftSidebar_ProfileMenu"].forEach(l=>{const o=t.visibility,d=this.createToggleControl(c(l),o[l]??true,p=>{const g={[l]:p};this.settingsManager.updateSettings({visibility:g}),t.enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(d);}),e.appendChild(i);const n=this.createSection(c("mainContentSettings")),s=this.createToggleControl(c("mainContent_TweetComposer"),t.visibility.mainContent_TweetComposer,l=>{const o={mainContent_TweetComposer:l};this.settingsManager.updateSettings({visibility:o}),t.enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});n.appendChild(s);const u=this.createToggleControl(c("promotedTweets"),t.visibility.promotedTweets,l=>{const o={promotedTweets:l};this.settingsManager.updateSettings({visibility:o}),t.enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});return n.appendChild(u),e.appendChild(n),e}createRightSidebarTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(c("rightSidebarSettings"));return ["rightSidebar","rightSidebar_SearchBox","rightSidebar_PremiumSubscribe","rightSidebar_TrendsList","rightSidebar_WhoToFollow","rightSidebar_Footer"].forEach(n=>{const s=t.visibility,u=this.createToggleControl(c(n),s[n]??true,l=>{const o={[n]:l};this.settingsManager.updateSettings({visibility:o}),t.enableRealTimePreview&&this.controller.applySettings(this.settingsManager.getSettings());});i.appendChild(u);}),e.appendChild(i),e}createLayoutTab(){const e=document.createElement("div"),t=this.settingsManager.getSettings(),i=this.createSection(c("layoutSettings")),r=this.createSliderControl(c("leftSidebarWidth"),t.layout.leftSidebarWidth,200,400,d=>{const p={leftSidebarWidth:d};this.settingsManager.updateSettings({layout:p}),t.enableRealTimePreview&&this.controller.applyLayout(this.settingsManager.getSettings());});i.appendChild(r);const n=this.createSliderControl(c("mainContentWidth"),t.layout.mainContentWidth,500,1200,d=>{const p={mainContentWidth:d};this.settingsManager.updateSettings({layout:p}),t.enableRealTimePreview&&this.controller.applyLayout(this.settingsManager.getSettings());});i.appendChild(n);const s=this.createSliderControl(c("rightSidebarWidth"),t.layout.rightSidebarWidth,300,500,d=>{const p={rightSidebarWidth:d};this.settingsManager.updateSettings({layout:p}),t.enableRealTimePreview&&this.controller.applyLayout(this.settingsManager.getSettings());});i.appendChild(s);const u=this.createSliderControl(c("timelineRightPadding"),t.layout.timelineRightPadding,0,100,d=>{const p={timelineRightPadding:d};this.settingsManager.updateSettings({layout:p}),t.enableRealTimePreview&&this.controller.applyLayout(this.settingsManager.getSettings());});i.appendChild(u);const l=this.createSliderControl(c("gap"),t.layout.gap,0,60,d=>{const p={gap:d};this.settingsManager.updateSettings({layout:p}),t.enableRealTimePreview&&this.controller.applyLayout(this.settingsManager.getSettings());});i.appendChild(l);const o=this.createToggleControl(c("enableRealTimePreview"),t.enableRealTimePreview,d=>{this.settingsManager.updateSettings({enableRealTimePreview:d});});return i.appendChild(o),e.appendChild(i),e}createProfilesTab(){const e=document.createElement("div"),t=this.createSection(c("profileSettings")),i=this.settingsManager.getAllProfiles(),r=this.settingsManager.getCurrentProfileId(),n=document.createElement("ul");n.className="twitter-clean-ui-profile-list",i.forEach(o=>{const d=document.createElement("li");d.className=`twitter-clean-ui-profile-item ${o.id===r?"active":""}`;const p=document.createElement("span");p.className="twitter-clean-ui-profile-name",p.textContent=o.name,d.appendChild(p);const g=document.createElement("div");if(g.className="twitter-clean-ui-profile-actions",o.id!==r){const h=document.createElement("button");h.className="twitter-clean-ui-icon-button",h.textContent="✓",h.title="切り替え",h.addEventListener("click",b=>{b.stopPropagation(),this.settingsManager.switchProfile(o.id),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles");}),g.appendChild(h);}if(o.id!=="default"){const h=document.createElement("button");h.className="twitter-clean-ui-icon-button",h.textContent="🗑",h.title="削除",h.addEventListener("click",b=>{b.stopPropagation(),confirm(`${o.name} を削除しますか？`)&&(this.settingsManager.deleteProfile(o.id),this.showTab("profiles"));}),g.appendChild(h);}d.appendChild(g),n.appendChild(d);}),t.appendChild(n);const s=document.createElement("button");s.className="twitter-clean-ui-button twitter-clean-ui-button-primary",s.textContent=c("createNewProfile"),s.style.marginTop="12px",s.addEventListener("click",()=>{const o=prompt("プロファイル名を入力してください:");o&&(this.settingsManager.createProfile(o),this.showTab("profiles"));}),t.appendChild(s);const u=document.createElement("button");u.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",u.textContent=c("exportSettings"),u.style.marginTop="12px",u.addEventListener("click",()=>{const o=this.settingsManager.exportSettings(),d=new Blob([o],{type:"application/json"}),p=URL.createObjectURL(d),g=document.createElement("a");g.href=p,g.download=`twitter-clean-ui-settings-${Date.now()}.json`,g.click(),URL.revokeObjectURL(p);}),t.appendChild(u);const l=document.createElement("button");return l.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",l.textContent=c("importSettings"),l.style.marginTop="12px",l.style.marginLeft="8px",l.addEventListener("click",()=>{const o=document.createElement("input");o.type="file",o.accept="application/json",o.addEventListener("change",async d=>{const p=d.target.files?.[0];if(p){const g=await p.text();this.settingsManager.importSettings(g)?(alert("設定をインポートしました"),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("profiles")):alert("設定のインポートに失敗しました");}}),o.click();}),t.appendChild(l),e.appendChild(t),e}createSection(e){const t=document.createElement("div");t.className="twitter-clean-ui-section";const i=document.createElement("span");return i.className="twitter-clean-ui-section-title",i.textContent=e,t.appendChild(i),t}createToggleControl(e,t,i){const r=document.createElement("div");r.className="twitter-clean-ui-control";const n=document.createElement("span");n.className="twitter-clean-ui-label",n.textContent=e,r.appendChild(n);const s=document.createElement("div");s.className=`twitter-clean-ui-toggle ${t?"active":""}`;const u=document.createElement("div");return u.className="twitter-clean-ui-toggle-slider",s.appendChild(u),s.addEventListener("click",()=>{const l=s.classList.toggle("active");i(l);}),r.appendChild(s),r}createSliderControl(e,t,i,r,n){const s=document.createElement("div");s.className="twitter-clean-ui-control";const u=document.createElement("span");u.className="twitter-clean-ui-label",u.textContent=e,s.appendChild(u);const l=document.createElement("div");l.className="twitter-clean-ui-slider-container";const o=document.createElement("input");o.type="range",o.className="twitter-clean-ui-slider",o.min=String(i),o.max=String(r),o.value=String(t),l.appendChild(o);const d=document.createElement("span");return d.className="twitter-clean-ui-slider-value",d.textContent=`${t}px`,l.appendChild(d),o.addEventListener("input",()=>{const p=Number(o.value);d.textContent=`${p}px`,n(p);}),s.appendChild(l),s}createFooter(){const e=document.createElement("div");e.className="twitter-clean-ui-footer";const t=document.createElement("button");t.className="twitter-clean-ui-button twitter-clean-ui-button-danger",t.textContent=c("reset"),t.addEventListener("click",()=>{confirm("設定をリセットしますか？")&&(this.settingsManager.reset(),this.controller.applySettings(this.settingsManager.getSettings()),this.showTab("visibility"));}),e.appendChild(t);const i=document.createElement("button");return i.className="twitter-clean-ui-button twitter-clean-ui-button-secondary",i.textContent=c("close"),i.addEventListener("click",()=>this.hide()),e.appendChild(i),e}destroy(){this.hide(),this.styleElement&&this.styleElement.parentNode&&this.styleElement.parentNode.removeChild(this.styleElement);}}class M{detector;controller;settingsManager;settingsUI;isInitialized=false;constructor(){this.detector=new w,this.controller=new E(this.detector),this.settingsManager=new C,this.settingsUI=new L(this.settingsManager,this.controller);}async initialize(){if(this.isInitialized){console.log("[TwitterCleanUI] Already initialized");return}console.log("[TwitterCleanUI] Initializing...");try{const e=this.settingsManager.getSettings();_(e.language||T()),this.detector.detectAll();const t=this.detector.getStatistics();console.log(`[TwitterCleanUI] Detected ${t.detected}/${t.total} elements`),this.controller.applySettings(e),console.log("[TwitterCleanUI] Settings applied"),this.detector.startObserving(),this.registerMenuCommand(),this.startPromotedTweetsWatcher(),this.isInitialized=!0,console.log("[TwitterCleanUI] Initialized successfully");}catch(e){console.error("[TwitterCleanUI] Initialization failed:",e);}}registerMenuCommand(){typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand("設定を開く",()=>{this.settingsUI.show();}):(document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&e.key==="X"&&(e.preventDefault(),this.settingsUI.show());}),console.log("[TwitterCleanUI] Keyboard shortcut registered: Ctrl + Shift + X"));}startPromotedTweetsWatcher(){this.settingsManager.getSettings().visibility.promotedTweets||setInterval(()=>{this.controller.hideAllPromotedTweets();},2e3);}destroy(){this.detector.stopObserving(),this.controller.destroy(),this.settingsUI.destroy(),this.isInitialized=false,console.log("[TwitterCleanUI] Destroyed");}}function N(){return new Promise(a=>{document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>a()):a();})}function R(a=1e4){return new Promise((e,t)=>{const i=Date.now(),r=()=>{if(document.getElementById("react-root")){e();return}if(Date.now()-i>a){t(new Error("Timeout waiting for react-root"));return}setTimeout(r,100);};r();})}(async()=>{try{console.log("[TwitterCleanUI] Starting..."),await N(),console.log("[TwitterCleanUI] Page loaded"),await R(),console.log("[TwitterCleanUI] React root found");const a=new M;await a.initialize(),window.twitterCleanUI=a;}catch(a){console.error("[TwitterCleanUI] Fatal error:",a);}})();

})();