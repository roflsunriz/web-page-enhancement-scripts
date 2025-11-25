// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.0.1
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
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const v={debug:"debug",info:"info",warn:"warn",error:"error"},d=t=>{const e=`[${t}]`,r={};return Object.keys(v).forEach(i=>{const o=v[i];r[i]=(...l)=>{(console[o]??console.log)(e,...l);};}),r};function A(t){return t?.data?.home?.home_timeline_urt??null}function k(t){return t?t.legacy?t.legacy:t.tweet?.legacy?t.tweet.legacy:null:null}function I(t){const e=k(t);if(!e)return  false;const r=e.extended_entities?.media,i=e.entities?.media,o=r??i??[];return Array.isArray(o)&&o.length>0}function J(t){const e=k(t);return e?!!(e.retweeted_status_id_str||(e.full_text??"").startsWith("RT @")):false}function z(t){return k(t)?.full_text??""}function B(t){return t?t.core?.user_results?.result?.legacy?.screen_name??"":""}class O{shouldHide(e,r){if(!this.enabled)return {shouldHide:false};if(e){const i=this.shouldHideFromJSON(e);if(i.shouldHide)return i}return r?this.shouldHideFromDOM(r):{shouldHide:false}}}const K=d("twitter-clean-timeline"),$="twitter_clean_timeline_settings",P={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false}};let n={...P,...GM_getValue($,{})};function R(){GM_setValue($,n),K.info("設定を保存しました",n);}function V(){n={...P},R();}const c={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},X=[c.tweetPhoto,c.tweetVideo,c.mediaCardSmall,c.mediaCardLarge];class _ extends O{get name(){return "media"}get enabled(){return n.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return n.mediaFilter.enableOnTimeline;case "list":return n.mediaFilter.enableOnLists;case "profile":return n.mediaFilter.enableOnProfile;case "search":return n.mediaFilter.enableOnSearch;case "tweetDetail":return n.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromJSON(e){return !this.enabled||!this.isEnabledForCurrentPage()?{shouldHide:false}:I(e)?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}shouldHideFromDOM(e){return !this.enabled||!this.isEnabledForCurrentPage()?{shouldHide:false}:X.some(i=>e.querySelector(i))?{shouldHide:false}:{shouldHide:true,reason:"メディアなし (DOM)",filterName:this.name}}}const W=d("twitter-clean-timeline:mute-filter");class C extends O{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return n.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=n.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(r){return W.error(`無効な正規表現パターン: ${e}`,r),null}}).filter(e=>e!==null);}isTextMuted(e){for(const r of n.muteFilter.stringKeywords)if(r&&e.includes(r))return {muted:true,keyword:r};for(const r of this.muteRegexes)if(r.test(e))return {muted:true,keyword:r.source};return {muted:false}}shouldHideFromJSON(e){if(!this.enabled)return {shouldHide:false};const r=z(e),i=B(e),o=`${r} @${i}`,l=this.isTextMuted(o);return l.muted?{shouldHide:true,reason:`ミュート: ${l.keyword}`,filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const r=e.innerText,i=this.isTextMuted(r);return i.muted?{shouldHide:true,reason:`ミュート (DOM): ${i.keyword}`,filterName:this.name}:{shouldHide:false}}}class E extends O{get name(){return "retweet"}get enabled(){return n.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromJSON(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:J(e)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(c.retweetIndicator)?{shouldHide:true,reason:"リツイート (DOM)",filterName:this.name}:{shouldHide:false}}}const b=d("twitter-clean-timeline:xhr"),G=new _,L=new C,U=new E;function Y(){L.updateMuteRegexes();}function Q(t){return t?t.includes("/i/api/graphql/")&&t.includes("/HomeTimeline"):false}function Z(t){const e=A(t);if(!e?.instructions)return;let r=0;for(const i of e.instructions){if(!i?.type||!Array.isArray(i.entries)||!String(i.type).includes("AddEntries"))continue;const o=i.entries.length;i.entries=i.entries.filter(s=>{const a=s?.content;if(!a||a.entryType==="TimelineTimelineCursor"||a.entryType!=="TimelineTimelineItem")return  true;const h=a.itemContent?.tweet_results?.result;if(!h)return  true;const u=[G,L,U];for(const p of u){const f=p.shouldHideFromJSON(h);if(f.shouldHide)return n.debugMode&&b.debug(`JSON フィルタ: ${f.reason??p.name}`),false}return  true});const l=o-i.entries.length;r+=l;}r>0&&n.debugMode&&b.info(`JSONから ${r} 件のツイートをフィルタしました`);}function ee(){const t=XMLHttpRequest.prototype,e=Object.getOwnPropertyDescriptor(t,"responseText"),r=Object.getOwnPropertyDescriptor(t,"response");if(!e?.get||!r?.get){b.error("XMLHttpRequest.prototype の記述子を取得できません");return}const i=e.get,o=t.open,l=t.send;t.open=function(s,a,...h){return this.__ctlUrl=typeof a=="string"?a:String(a),o.apply(this,[s,a,...h])},t.send=function(s){const a=this.__ctlUrl;return Q(a??"")&&this.addEventListener("readystatechange",function(){if(this.readyState===4&&!this.__ctlPatched){this.__ctlPatched=true;try{const u=i.call(this);if(typeof u!="string"||!u)return;const p=JSON.parse(u);Z(p);const f=JSON.stringify(p);if(Object.defineProperty(this,"responseText",{configurable:!0,get(){return f}}),this.responseType===""||this.responseType==="text")Object.defineProperty(this,"response",{configurable:!0,get(){return f}});else if(this.responseType==="json"){const q=JSON.parse(f);Object.defineProperty(this,"response",{configurable:!0,get(){return q}});}}catch(u){b.error("XHRフックエラー",u);}}}),l.call(this,s)},b.info("XHRフックをインストールしました");}const te=d("twitter-clean-timeline:placeholder");function re(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function ie(t,e,r,i){const o=re(e);try{if(t.replaceWith(o),i&&r>0){const l=o.getBoundingClientRect().height||0;return r-l}}catch(l){te.error("プレースホルダー置換エラー",l),t.style.display="none";}return 0}const T=d("twitter-clean-timeline:remover");let g=0,x=false;function M(t){t&&(g+=t,!x&&(x=true,requestAnimationFrame(()=>{g!==0&&(window.scrollBy(0,g),n.debugMode&&T.debug(`スクロール補正: ${g}px`),g=0),x=false;})));}function ne(t,e){const r=t.getBoundingClientRect(),i=r.height||0,o=r.bottom<=0,l=t.closest("article")??t;if(n.showPlaceholder){const s=ie(l,e,i,o);s>0&&M(s);}else try{l.remove(),o&&i>0&&M(i);}catch(s){T.error("ツイート削除エラー",s),l.style.display="none";}n.debugMode&&T.debug(`ツイート削除: ${e} (高さ: ${i}px, 上側: ${o})`);}const oe=d("twitter-clean-timeline:processor"),le=new _,D=new C,se=new E;function ae(){D.updateMuteRegexes();}function de(t){if(!t)return;const e=[le,D,se];for(const r of e){const i=r.shouldHideFromDOM(t);if(i.shouldHide){const o=i.reason??r.name;n.debugMode&&oe.debug(`ツイートをフィルタ: ${o}`),ne(t,o);return}}}const w=d("twitter-clean-timeline:observer"),m=new Set;let F=false,y=null;function N(){F||(F=true,requestAnimationFrame(()=>{F=false;const t=Array.from(m);m.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(de(e),e.dataset.ctlProcessed="true"));}));}function ce(t){for(const e of t)if(e.type==="childList")for(const r of Array.from(e.addedNodes)){if(!(r instanceof HTMLElement))continue;const i=r.matches(c.article)?r:r.querySelector(c.article);i&&m.add(i);}m.size>0&&N();}function S(){if(y){w.warn("オブザーバーは既に起動しています");return}y=new MutationObserver(ce);const t=document.querySelector("main");t?(y.observe(t,{childList:true,subtree:true}),w.info("メイン要素の監視を開始しました")):(y.observe(document.body,{childList:true,subtree:true}),w.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(c.article).forEach(r=>{r.dataset.ctlProcessed||m.add(r);}),m.size>0&&N();}const j=d("twitter-clean-timeline:ui");function ue(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=fe();document.body.appendChild(e);}function fe(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ffffff;">Twitter Clean Timeline 設定</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">グローバル設定</h3>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-show-placeholder" ${n.showPlaceholder?"checked":""}>
        プレースホルダー表示（フィルタされたツイートを小さく表示）
      </label>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-debug-mode" ${n.debugMode?"checked":""}>
        デバッグモード（コンソールに詳細ログを出力）
      </label>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-media-enabled" ${n.mediaFilter.enabled?"checked":""}>
          メディアフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-timeline" ${n.mediaFilter.enableOnTimeline?"checked":""}>
          ホームタイムライン
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-lists" ${n.mediaFilter.enableOnLists?"checked":""}>
          リスト
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-profile" ${n.mediaFilter.enableOnProfile?"checked":""}>
          プロフィール
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-search" ${n.mediaFilter.enableOnSearch?"checked":""}>
          検索
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-detail" ${n.mediaFilter.enableOnTweetDetail?"checked":""}>
          ツイート詳細
        </label>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-mute-enabled" ${n.muteFilter.enabled?"checked":""}>
          ミュートフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff;">${n.muteFilter.stringKeywords.join(`
`)}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff;">${n.muteFilter.regexKeywords.join(`
`)}</textarea>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-retweet-enabled" ${n.retweetFilter.enabled?"checked":""}>
          リツイートフィルタ（プロフィールページで動作）
        </label>
      </h3>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #38444d;">
      <button id="ctl-save-btn" style="flex: 1; padding: 10px; background-color: #1d9bf0; color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold;">
        保存
      </button>
      <button id="ctl-reset-btn" style="padding: 10px 16px; background-color: #ef4444; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        リセット
      </button>
      <button id="ctl-cancel-btn" style="padding: 10px 16px; background-color: #6b7280; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        キャンセル
      </button>
    </div>
  `;const r=e.querySelector("#ctl-save-btn"),i=e.querySelector("#ctl-reset-btn"),o=e.querySelector("#ctl-cancel-btn");return r?.addEventListener("click",()=>{me(e),t.remove();}),i?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(V(),t.remove(),j.info("設定をリセットしました"),alert("設定をリセットしました。ページをリロードしてください。"));}),o?.addEventListener("click",()=>{t.remove();}),t.addEventListener("click",l=>{l.target===t&&t.remove();}),t.appendChild(e),t}function me(t){const e=i=>t.querySelector(`#${i}`)?.checked??false,r=i=>t.querySelector(`#${i}`)?.value??"";n.showPlaceholder=e("ctl-show-placeholder"),n.debugMode=e("ctl-debug-mode"),n.mediaFilter.enabled=e("ctl-media-enabled"),n.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),n.mediaFilter.enableOnLists=e("ctl-media-lists"),n.mediaFilter.enableOnProfile=e("ctl-media-profile"),n.mediaFilter.enableOnSearch=e("ctl-media-search"),n.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),n.muteFilter.enabled=e("ctl-mute-enabled"),n.muteFilter.stringKeywords=r("ctl-mute-strings").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.muteFilter.regexKeywords=r("ctl-mute-regexes").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.retweetFilter.enabled=e("ctl-retweet-enabled"),R(),ae(),Y(),j.info("設定を保存しました"),alert("設定を保存しました。ページをリロードすると反映されます。");}const H=d("twitter-clean-timeline");function he(){H.info("Twitter Clean Timeline を初期化中..."),ee(),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{S();}):S(),GM_registerMenuCommand("タイムラインフィルタ設定",ue),H.info("初期化完了",{mediaFilter:n.mediaFilter.enabled,muteFilter:n.muteFilter.enabled,retweetFilter:n.retweetFilter.enabled,showPlaceholder:n.showPlaceholder});}he();

})();