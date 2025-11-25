// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.2.0
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

  const H={debug:"debug",info:"info",warn:"warn",error:"error"},d=t=>{const e=`[${t}]`,r={};return Object.keys(H).forEach(n=>{const o=H[n];r[n]=(...l)=>{(console[o]??console.log)(e,...l);};}),r};function V(t){return t?.data?.home?.home_timeline_urt??null}function S(t){return t?t.legacy?t.legacy:t.tweet?.legacy?t.tweet.legacy:null:null}function X(t){const e=S(t);if(!e)return  false;const r=e.extended_entities?.media,n=e.entities?.media,o=r??n??[];return Array.isArray(o)&&o.length>0}function G(t){const e=S(t);return e?!!(e.retweeted_status_id_str||(e.full_text??"").startsWith("RT @")):false}function W(t){return S(t)?.full_text??""}function U(t){return t?t.core?.user_results?.result?.legacy?.screen_name??"":""}class k{shouldHide(e,r){if(!this.enabled)return {shouldHide:false};if(e){const n=this.shouldHideFromJSON(e);if(n.shouldHide)return n}return r?this.shouldHideFromDOM(r):{shouldHide:false}}}const Y=d("twitter-clean-timeline"),L="twitter_clean_timeline_settings",_={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false}};let i={..._,...GM_getValue(L,{})};function C(){GM_setValue(L,i),Y.info("設定を保存しました",i);}function Q(){i={..._},C();}const u={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},$=[u.tweetPhoto,u.tweetVideo,u.mediaCardSmall,u.mediaCardLarge],w=d("twitter-clean-timeline:media-filter");class D extends k{get name(){return "media"}get enabled(){return i.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return i.mediaFilter.enableOnTimeline;case "list":return i.mediaFilter.enableOnLists;case "profile":return i.mediaFilter.enableOnProfile;case "search":return i.mediaFilter.enableOnSearch;case "tweetDetail":return i.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromJSON(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=X(e);return i.debugMode&&w.debug("JSON メディアチェック:",{hasMedia:r,hasTweet:!!e,hasLegacy:!!e?.legacy,hasExtendedEntities:!!e?.legacy?.extended_entities,hasBasicEntities:!!e?.legacy?.entities}),r?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=$.some(n=>e.querySelector(n));return i.debugMode&&w.debug("DOM メディアチェック:",{hasMedia:r,elementTagName:e.tagName,checkedSelectors:$.length}),r?{shouldHide:false}:(i.debugMode&&w.warn("DOMフォールバックでフィルタリング - JSONフィルタが動作していない可能性があります"),{shouldHide:true,reason:"メディアなし (DOM)",filterName:this.name})}}const Z=d("twitter-clean-timeline:mute-filter");class N extends k{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return i.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=i.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(r){return Z.error(`無効な正規表現パターン: ${e}`,r),null}}).filter(e=>e!==null);}isTextMuted(e){for(const r of i.muteFilter.stringKeywords)if(r&&e.includes(r))return {muted:true,keyword:r};for(const r of this.muteRegexes)if(r.test(e))return {muted:true,keyword:r.source};return {muted:false}}shouldHideFromJSON(e){if(!this.enabled)return {shouldHide:false};const r=W(e),n=U(e),o=`${r} @${n}`,l=this.isTextMuted(o);return l.muted?{shouldHide:true,reason:`ミュート: ${l.keyword}`,filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const r=e.innerText,n=this.isTextMuted(r);return n.muted?{shouldHide:true,reason:`ミュート (DOM): ${n.keyword}`,filterName:this.name}:{shouldHide:false}}}class A extends k{get name(){return "retweet"}get enabled(){return i.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromJSON(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:G(e)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(u.retweetIndicator)?{shouldHide:true,reason:"リツイート (DOM)",filterName:this.name}:{shouldHide:false}}}const s=d("twitter-clean-timeline:xhr"),ee=new D,j=new N,te=new A;function q(){j.updateMuteRegexes();}function re(t){if(!t)return  false;i.debugMode&&t.includes("/i/api/graphql/")&&s.debug("GraphQL API検出:",t);const e=["/HomeTimeline","/HomeLatestTimeline","/ForYouTimeline"];return t.includes("/i/api/graphql/")&&e.some(r=>t.includes(r))}function ie(t){const e=V(t);if(i.debugMode&&s.debug("タイムラインデータ抽出結果:",{hasData:!!e,hasInstructions:!!e?.instructions,instructionsCount:e?.instructions?.length??0}),!e?.instructions){i.debugMode&&s.warn("タイムラインデータまたはinstructionsが見つかりません");return}let r=0,n=0;for(const o of e.instructions){if(!o?.type||!Array.isArray(o.entries)||!String(o.type).includes("AddEntries"))continue;const l=o.entries.length;o.entries=o.entries.filter(c=>{const m=c?.content;if(!m||m.entryType==="TimelineTimelineCursor"||m.entryType!=="TimelineTimelineItem")return  true;const f=m.itemContent?.tweet_results?.result;if(!f)return  true;n++;const p=[ee,j,te];for(const h of p){const y=h.shouldHideFromJSON(f);if(y.shouldHide)return i.debugMode&&s.debug(`JSON フィルタ: ${y.reason??h.name}`),false}return  true});const a=l-o.entries.length;r+=a;}i.debugMode&&s.info(`JSONフィルタリング完了: 処理=${n}件, フィルタ=${r}件`);}function ne(){const t=XMLHttpRequest.prototype,e=Object.getOwnPropertyDescriptor(t,"responseText"),r=Object.getOwnPropertyDescriptor(t,"response");if(!e?.get||!r?.get){s.error("XMLHttpRequest.prototype の記述子を取得できません");return}const n=e.get,o=t.open,l=t.send;t.open=function(a,c,...m){return this.__ctlUrl=typeof c=="string"?c:String(c),o.apply(this,[a,c,...m])},t.send=function(a){const c=this.__ctlUrl;return re(c??"")&&(i.debugMode&&s.info("タイムラインAPIをフック:",c),this.addEventListener("readystatechange",function(){if(this.readyState===4&&!this.__ctlPatched){this.__ctlPatched=true;try{const f=n.call(this);if(typeof f!="string"||!f){i.debugMode&&s.warn("レスポンスが空または文字列ではありません");return}const p=JSON.parse(f);i.debugMode&&s.debug("JSONパース成功、フィルタリング開始"),ie(p);const h=JSON.stringify(p);if(Object.defineProperty(this,"responseText",{configurable:!0,get(){return h}}),this.responseType===""||this.responseType==="text")Object.defineProperty(this,"response",{configurable:!0,get(){return h}});else if(this.responseType==="json"){const y=JSON.parse(h);Object.defineProperty(this,"response",{configurable:!0,get(){return y}});}i.debugMode&&s.debug("レスポンス書き換え完了");}catch(f){s.error("XHRフックエラー",f);}}})),l.call(this,a)},s.info("XHRフックをインストールしました");}const oe=d("twitter-clean-timeline:placeholder");function le(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function se(t,e,r,n){const o=le(e);try{if(t.replaceWith(o),n&&r>0){const l=o.getBoundingClientRect().height||0;return r-l}}catch(l){oe.error("プレースホルダー置換エラー",l),t.style.display="none";}return 0}const O=d("twitter-clean-timeline:remover");let b=0,F=false;function P(t){t&&(b+=t,!F&&(F=true,requestAnimationFrame(()=>{b!==0&&(window.scrollBy(0,b),i.debugMode&&O.debug(`スクロール補正: ${b}px`),b=0),F=false;})));}function ae(t,e){const r=t.getBoundingClientRect(),n=r.height||0,o=r.bottom<=0,l=t.closest("article")??t;if(i.showPlaceholder){const a=se(l,e,n,o);a>0&&P(a);}else try{l.remove(),o&&n>0&&P(n);}catch(a){O.error("ツイート削除エラー",a),l.style.display="none";}i.debugMode&&O.debug(`ツイート削除: ${e} (高さ: ${n}px, 上側: ${o})`);}const de=d("twitter-clean-timeline:processor"),ce=new D,I=new N,ue=new A;function J(){I.updateMuteRegexes();}function z(t){if(!t)return;const e=[ce,I,ue];for(const r of e){const n=r.shouldHideFromDOM(t);if(n.shouldHide){const o=n.reason??r.name;i.debugMode&&de.debug(`ツイートをフィルタ: ${o}`),ae(t,o);return}}}const T=d("twitter-clean-timeline:observer"),g=new Set;let M=false,x=null;function B(){M||(M=true,requestAnimationFrame(()=>{M=false;const t=Array.from(g);g.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(z(e),e.dataset.ctlProcessed="true"));}));}function fe(t){for(const e of t)if(e.type==="childList")for(const r of Array.from(e.addedNodes)){if(!(r instanceof HTMLElement))continue;const n=r.matches(u.article)?r:r.querySelector(u.article);n&&g.add(n);}g.size>0&&B();}function E(){if(x){T.warn("オブザーバーは既に起動しています");return}x=new MutationObserver(fe);const t=document.querySelector("main");t?(x.observe(t,{childList:true,subtree:true}),T.info("メイン要素の監視を開始しました")):(x.observe(document.body,{childList:true,subtree:true}),T.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(u.article).forEach(r=>{r.dataset.ctlProcessed||g.add(r);}),g.size>0&&B();}const v=d("twitter-clean-timeline:ui");function me(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=he();document.body.appendChild(e);}function he(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ffffff;">Twitter Clean Timeline 設定</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">グローバル設定</h3>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-show-placeholder" ${i.showPlaceholder?"checked":""}>
        プレースホルダー表示（フィルタされたツイートを小さく表示）
      </label>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-debug-mode" ${i.debugMode?"checked":""}>
        デバッグモード（コンソールに詳細ログを出力）
      </label>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-media-enabled" ${i.mediaFilter.enabled?"checked":""}>
          メディアフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-timeline" ${i.mediaFilter.enableOnTimeline?"checked":""}>
          ホームタイムライン
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-lists" ${i.mediaFilter.enableOnLists?"checked":""}>
          リスト
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-profile" ${i.mediaFilter.enableOnProfile?"checked":""}>
          プロフィール
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-search" ${i.mediaFilter.enableOnSearch?"checked":""}>
          検索
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-detail" ${i.mediaFilter.enableOnTweetDetail?"checked":""}>
          ツイート詳細
        </label>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-mute-enabled" ${i.muteFilter.enabled?"checked":""}>
          ミュートフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${i.muteFilter.stringKeywords.join(`
`)}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${i.muteFilter.regexKeywords.join(`
`)}</textarea>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-retweet-enabled" ${i.retweetFilter.enabled?"checked":""}>
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
  `;const r=e.querySelector("#ctl-save-btn"),n=e.querySelector("#ctl-reset-btn"),o=e.querySelector("#ctl-cancel-btn");return r?.addEventListener("click",()=>{ge(e),t.remove();}),n?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(Q(),J(),q(),K(),t.remove(),v.info("設定をリセットしました"),alert("設定をリセットして適用しました。"));}),o?.addEventListener("click",()=>{t.remove();}),t.addEventListener("click",l=>{l.target===t&&t.remove();}),t.appendChild(e),t}function K(){const t=document.querySelectorAll(u.article);t.forEach(e=>{delete e.dataset.ctlProcessed,z(e);}),v.info(`${t.length}件のツイートを再処理しました`);}function ge(t){const e=n=>t.querySelector(`#${n}`)?.checked??false,r=n=>t.querySelector(`#${n}`)?.value??"";i.showPlaceholder=e("ctl-show-placeholder"),i.debugMode=e("ctl-debug-mode"),i.mediaFilter.enabled=e("ctl-media-enabled"),i.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),i.mediaFilter.enableOnLists=e("ctl-media-lists"),i.mediaFilter.enableOnProfile=e("ctl-media-profile"),i.mediaFilter.enableOnSearch=e("ctl-media-search"),i.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),i.muteFilter.enabled=e("ctl-mute-enabled"),i.muteFilter.stringKeywords=r("ctl-mute-strings").split(`
`).map(n=>n.trim()).filter(n=>n.length>0),i.muteFilter.regexKeywords=r("ctl-mute-regexes").split(`
`).map(n=>n.trim()).filter(n=>n.length>0),i.retweetFilter.enabled=e("ctl-retweet-enabled"),C(),J(),q(),K(),v.info("設定を保存しました"),alert("設定を保存して適用しました。");}const R=d("twitter-clean-timeline");function be(){R.info("Twitter Clean Timeline を初期化中..."),ne(),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{E();}):E(),GM_registerMenuCommand("タイムラインフィルタ設定",me),R.info("初期化完了",{mediaFilter:i.mediaFilter.enabled,muteFilter:i.muteFilter.enabled,retweetFilter:i.retweetFilter.enabled,showPlaceholder:i.showPlaceholder});}be();

})();