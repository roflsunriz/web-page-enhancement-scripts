// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.4.0
// @author       roflsunriz
// @description  X/Twitterタイムラインの統合フィルタ（メディア・ミュート・リツイート）。JSON事前フィルタリングとDOM削除でクリーンな体験を提供。
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-timeline.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-timeline.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const y={debug:"debug",info:"info",warn:"warn",error:"error"},d=t=>{const e=`[${t}]`,o={};return Object.keys(y).forEach(l=>{const i=y[l];o[l]=(...n)=>{(console[i]??console.log)(e,...n);};}),o},a={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},w=[a.tweetPhoto,a.tweetVideo,a.mediaCardSmall,a.mediaCardLarge],L=d("twitter-clean-timeline"),S="twitter_clean_timeline_settings",T={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false}};let r={...T,...GM_getValue(S,{})};function $(){GM_setValue(S,r),L.info("設定を保存しました",r);}function R(){r={...T},$();}const H=d("twitter-clean-timeline:placeholder");function D(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function q(t,e,o,l){const i=D(e);try{if(t.replaceWith(i),l&&o>0){const n=i.getBoundingClientRect().height||0;return o-n}}catch(n){H.error("プレースホルダー置換エラー",n),t.style.display="none";}return 0}const g=d("twitter-clean-timeline:remover");let u=0,f=false;function F(t){t&&(u+=t,!f&&(f=true,requestAnimationFrame(()=>{u!==0&&(window.scrollBy(0,u),r.debugMode&&g.debug(`スクロール補正: ${u}px`),u=0),f=false;})));}function z(t,e){const o=t.getBoundingClientRect(),l=o.height||0,i=o.bottom<=0,n=t.closest("article")??t;if(r.showPlaceholder){const c=q(n,e,l,i);c>0&&F(c);}else try{n.remove(),i&&l>0&&F(l);}catch(c){g.error("ツイート削除エラー",c),n.style.display="none";}r.debugMode&&g.debug(`ツイート削除: ${e} (高さ: ${l}px, 上側: ${i})`);}class h{}const A=d("twitter-clean-timeline:media-filter");class I extends h{get name(){return "media"}get enabled(){return r.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return r.mediaFilter.enableOnTimeline;case "list":return r.mediaFilter.enableOnLists;case "profile":return r.mediaFilter.enableOnProfile;case "search":return r.mediaFilter.enableOnSearch;case "tweetDetail":return r.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const o=w.some(l=>e.querySelector(l));return r.debugMode&&A.debug("DOMメディアチェック:",{hasMedia:o,elementTagName:e.tagName,checkedSelectors:w.length}),o?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}}const _=d("twitter-clean-timeline:mute-filter");class j extends h{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return r.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=r.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(o){return _.error(`無効な正規表現パターン: ${e}`,o),null}}).filter(e=>e!==null);}isTextMuted(e){for(const o of r.muteFilter.stringKeywords)if(o&&e.includes(o))return {muted:true,keyword:o};for(const o of this.muteRegexes)if(o.test(e))return {muted:true,keyword:o.source};return {muted:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const o=e.innerText,l=this.isTextMuted(o);return l.muted?{shouldHide:true,reason:`ミュート: ${l.keyword}`,filterName:this.name}:{shouldHide:false}}}class B extends h{get name(){return "retweet"}get enabled(){return r.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(a.retweetIndicator)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}}const K=d("twitter-clean-timeline:processor"),N=new I,M=new j,V=new B;function O(){M.updateMuteRegexes();}function P(t){if(!t)return;const e=[N,M,V];for(const o of e){const l=o.shouldHideFromDOM(t);if(l.shouldHide){const i=l.reason??o.name;r.debugMode&&K.debug(`ツイートをフィルタ: ${i}`),z(t,i);return}}}const b=d("twitter-clean-timeline:observer"),s=new Set;let p=false,m=null;function E(){p||(p=true,requestAnimationFrame(()=>{p=false;const t=Array.from(s);s.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(P(e),e.dataset.ctlProcessed="true"));}));}function W(t){for(const e of t)if(e.type==="childList")for(const o of Array.from(e.addedNodes)){if(!(o instanceof HTMLElement))continue;const l=o.matches(a.article)?o:o.querySelector(a.article);l&&s.add(l);}s.size>0&&E();}function v(){if(m){b.warn("オブザーバーは既に起動しています");return}m=new MutationObserver(W);const t=document.querySelector("main");t?(m.observe(t,{childList:true,subtree:true}),b.info("メイン要素の監視を開始しました")):(m.observe(document.body,{childList:true,subtree:true}),b.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(a.article).forEach(o=>{o.dataset.ctlProcessed||s.add(o);}),s.size>0&&E();}const x=d("twitter-clean-timeline:ui");function G(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=U();document.body.appendChild(e);}function U(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ffffff;">Twitter Clean Timeline 設定</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">グローバル設定</h3>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-show-placeholder" ${r.showPlaceholder?"checked":""}>
        プレースホルダー表示（フィルタされたツイートを小さく表示）
      </label>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-debug-mode" ${r.debugMode?"checked":""}>
        デバッグモード（コンソールに詳細ログを出力）
      </label>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-media-enabled" ${r.mediaFilter.enabled?"checked":""}>
          メディアフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-timeline" ${r.mediaFilter.enableOnTimeline?"checked":""}>
          ホームタイムライン
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-lists" ${r.mediaFilter.enableOnLists?"checked":""}>
          リスト
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-profile" ${r.mediaFilter.enableOnProfile?"checked":""}>
          プロフィール
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-search" ${r.mediaFilter.enableOnSearch?"checked":""}>
          検索
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-detail" ${r.mediaFilter.enableOnTweetDetail?"checked":""}>
          ツイート詳細
        </label>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-mute-enabled" ${r.muteFilter.enabled?"checked":""}>
          ミュートフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${r.muteFilter.stringKeywords.join(`
`)}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${r.muteFilter.regexKeywords.join(`
`)}</textarea>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-retweet-enabled" ${r.retweetFilter.enabled?"checked":""}>
          リツイートフィルタ（プロフィールページで動作）
        </label>
      </h3>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #38444d;">
      <button id="ctl-save-btn" style="padding: 10px 24px; background-color: #1d9bf0; color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold;">
        保存
      </button>
      <button id="ctl-reset-btn" style="padding: 10px 20px; background-color: #ef4444; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        リセット
      </button>
      <button id="ctl-cancel-btn" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        キャンセル
      </button>
    </div>
  `;const o=e.querySelector("#ctl-save-btn"),l=e.querySelector("#ctl-reset-btn"),i=e.querySelector("#ctl-cancel-btn");return o?.addEventListener("click",()=>{Y(e),t.remove();}),l?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(R(),O(),C(),t.remove(),x.info("設定をリセットしました"),alert("設定をリセットして適用しました。"));}),i?.addEventListener("click",()=>{t.remove();}),t.addEventListener("click",n=>{n.target===t&&t.remove();}),t.appendChild(e),t}function C(){const t=document.querySelectorAll(a.article);t.forEach(e=>{delete e.dataset.ctlProcessed,P(e);}),x.info(`${t.length}件のツイートを再処理しました`);}function Y(t){const e=l=>t.querySelector(`#${l}`)?.checked??false,o=l=>t.querySelector(`#${l}`)?.value??"";r.showPlaceholder=e("ctl-show-placeholder"),r.debugMode=e("ctl-debug-mode"),r.mediaFilter.enabled=e("ctl-media-enabled"),r.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),r.mediaFilter.enableOnLists=e("ctl-media-lists"),r.mediaFilter.enableOnProfile=e("ctl-media-profile"),r.mediaFilter.enableOnSearch=e("ctl-media-search"),r.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),r.muteFilter.enabled=e("ctl-mute-enabled"),r.muteFilter.stringKeywords=o("ctl-mute-strings").split(`
`).map(l=>l.trim()).filter(l=>l.length>0),r.muteFilter.regexKeywords=o("ctl-mute-regexes").split(`
`).map(l=>l.trim()).filter(l=>l.length>0),r.retweetFilter.enabled=e("ctl-retweet-enabled"),$(),O(),C(),x.info("設定を保存しました"),alert("設定を保存して適用しました。");}const k=d("twitter-clean-timeline");function J(){k.info("Twitter Clean Timeline を初期化中..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{v();}):v(),GM_registerMenuCommand("タイムラインフィルタ設定",G),k.info("初期化完了",{mediaFilter:r.mediaFilter.enabled,muteFilter:r.muteFilter.enabled,retweetFilter:r.retweetFilter.enabled,showPlaceholder:r.showPlaceholder});}J();

})();