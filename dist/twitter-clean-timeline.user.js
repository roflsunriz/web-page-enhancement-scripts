// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.3.1
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

  const H={debug:"debug",info:"info",warn:"warn",error:"error"},f=t=>{const e=`[${t}]`,r={};return Object.keys(H).forEach(i=>{const o=H[i];r[i]=(...s)=>{(console[o]??console.log)(e,...s);};}),r};function X(t){return t?.data?.home?.home_timeline_urt??null}function k(t){return t?t.legacy?t.legacy:t.tweet?.legacy?t.tweet.legacy:null:null}function G(t){const e=k(t);if(!e)return  false;const r=e.extended_entities?.media,i=e.entities?.media,o=r??i??[];return Array.isArray(o)&&o.length>0}function U(t){const e=k(t);return e?!!(e.retweeted_status_id_str||(e.full_text??"").startsWith("RT @")):false}function Y(t){return k(t)?.full_text??""}function Q(t){return t?t.core?.user_results?.result?.legacy?.screen_name??"":""}class S{shouldHide(e,r){if(!this.enabled)return {shouldHide:false};if(e){const i=this.shouldHideFromJSON(e);if(i.shouldHide)return i}return r?this.shouldHideFromDOM(r):{shouldHide:false}}}const Z=f("twitter-clean-timeline"),L="twitter_clean_timeline_settings",_={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false}};let n={..._,...GM_getValue(L,{})};function C(){GM_setValue(L,n),Z.info("設定を保存しました",n);}function ee(){n={..._},C();}const m={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},$=[m.tweetPhoto,m.tweetVideo,m.mediaCardSmall,m.mediaCardLarge],w=f("twitter-clean-timeline:media-filter");class N extends S{get name(){return "media"}get enabled(){return n.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return n.mediaFilter.enableOnTimeline;case "list":return n.mediaFilter.enableOnLists;case "profile":return n.mediaFilter.enableOnProfile;case "search":return n.mediaFilter.enableOnSearch;case "tweetDetail":return n.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromJSON(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=G(e);return n.debugMode&&w.debug("JSON メディアチェック:",{hasMedia:r,hasTweet:!!e,hasLegacy:!!e?.legacy,hasExtendedEntities:!!e?.legacy?.extended_entities,hasBasicEntities:!!e?.legacy?.entities}),r?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=$.some(i=>e.querySelector(i));return n.debugMode&&w.debug("DOM メディアチェック:",{hasMedia:r,elementTagName:e.tagName,checkedSelectors:$.length}),r?{shouldHide:false}:(n.debugMode&&w.warn("DOMフォールバックでフィルタリング - JSONフィルタが動作していない可能性があります"),{shouldHide:true,reason:"メディアなし (DOM)",filterName:this.name})}}const te=f("twitter-clean-timeline:mute-filter");class D extends S{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return n.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=n.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(r){return te.error(`無効な正規表現パターン: ${e}`,r),null}}).filter(e=>e!==null);}isTextMuted(e){for(const r of n.muteFilter.stringKeywords)if(r&&e.includes(r))return {muted:true,keyword:r};for(const r of this.muteRegexes)if(r.test(e))return {muted:true,keyword:r.source};return {muted:false}}shouldHideFromJSON(e){if(!this.enabled)return {shouldHide:false};const r=Y(e),i=Q(e),o=`${r} @${i}`,s=this.isTextMuted(o);return s.muted?{shouldHide:true,reason:`ミュート: ${s.keyword}`,filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const r=e.innerText,i=this.isTextMuted(r);return i.muted?{shouldHide:true,reason:`ミュート (DOM): ${i.keyword}`,filterName:this.name}:{shouldHide:false}}}class A extends S{get name(){return "retweet"}get enabled(){return n.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromJSON(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:U(e)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(m.retweetIndicator)?{shouldHide:true,reason:"リツイート (DOM)",filterName:this.name}:{shouldHide:false}}}const l=f("twitter-clean-timeline:network"),re=new N,j=new D,ne=new A;function q(){j.updateMuteRegexes();}function I(t){if(!t)return  false;n.debugMode&&t.includes("/i/api/graphql/")&&l.debug("GraphQL API検出:",t);const e=["/HomeTimeline","/HomeLatestTimeline","/ForYouTimeline"];return t.includes("/i/api/graphql/")&&e.some(r=>t.includes(r))}function J(t){const e=X(t);if(n.debugMode&&l.debug("タイムラインデータ抽出結果:",{hasData:!!e,hasInstructions:!!e?.instructions,instructionsCount:e?.instructions?.length??0}),!e?.instructions){n.debugMode&&l.warn("タイムラインデータまたはinstructionsが見つかりません");return}let r=0,i=0;for(const o of e.instructions){if(!o?.type||!Array.isArray(o.entries)||!String(o.type).includes("AddEntries"))continue;const s=o.entries.length;o.entries=o.entries.filter(c=>{const u=c?.content;if(!u||u.entryType==="TimelineTimelineCursor"||u.entryType!=="TimelineTimelineItem")return  true;const d=u.itemContent?.tweet_results?.result;if(!d)return  true;i++;const g=[re,j,ne];for(const h of g){const y=h.shouldHideFromJSON(d);if(y.shouldHide)return n.debugMode&&l.debug(`JSON フィルタ: ${y.reason??h.name}`),false}return  true});const a=s-o.entries.length;r+=a;}n.debugMode&&l.info(`JSONフィルタリング完了: 処理=${i}件, フィルタ=${r}件`);}function ie(){const t=XMLHttpRequest.prototype,e=Object.getOwnPropertyDescriptor(t,"responseText"),r=Object.getOwnPropertyDescriptor(t,"response");if(!e?.get||!r?.get){l.error("XMLHttpRequest.prototype の記述子を取得できません");return}const i=e.get,o=t.open,s=t.send;t.open=function(a,c,...u){return this.__ctlUrl=typeof c=="string"?c:String(c),o.apply(this,[a,c,...u])},t.send=function(a){const c=this.__ctlUrl;return I(c??"")&&(n.debugMode&&l.info("タイムラインAPIをフック:",c),this.addEventListener("readystatechange",function(){if(this.readyState===4&&!this.__ctlPatched){this.__ctlPatched=true;try{const d=i.call(this);if(typeof d!="string"||!d){n.debugMode&&l.warn("レスポンスが空または文字列ではありません");return}const g=JSON.parse(d);n.debugMode&&l.debug("JSONパース成功、フィルタリング開始"),J(g);const h=JSON.stringify(g);if(Object.defineProperty(this,"responseText",{configurable:!0,get(){return h}}),this.responseType===""||this.responseType==="text")Object.defineProperty(this,"response",{configurable:!0,get(){return h}});else if(this.responseType==="json"){const y=JSON.parse(h);Object.defineProperty(this,"response",{configurable:!0,get(){return y}});}n.debugMode&&l.debug("レスポンス書き換え完了");}catch(d){l.error("XHRフックエラー",d);}}})),s.call(this,a)},l.info("XHRフックをインストールしました");}function oe(){const t=typeof unsafeWindow<"u"?unsafeWindow:window,e=t.fetch;if(!e){l.error("fetch APIが見つかりません");return}t.fetch=async function(...r){const[i]=r,o=typeof i=="string"?i:i instanceof Request?i.url:"";if(n.debugMode&&o.includes("/i/api/")&&l.debug("Fetch API呼び出し検出:",o),I(o)){n.debugMode&&l.info("タイムラインAPIをフック (fetch):",o);try{const a=await e.apply(this,r),u=await a.clone().text();if(!u)return n.debugMode&&l.warn("レスポンスが空です"),a;const d=JSON.parse(u);n.debugMode&&l.debug("JSONパース成功、フィルタリング開始"),J(d);const g=JSON.stringify(d),h=new Response(g,{status:a.status,statusText:a.statusText,headers:a.headers});return n.debugMode&&l.debug("レスポンス書き換え完了"),h}catch(a){return l.error("Fetchフックエラー",a),e.apply(this,r)}}return e.apply(this,r)},l.info("Fetchフックをインストールしました");}function le(){ie(),oe();}const se=f("twitter-clean-timeline:placeholder");function ae(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function de(t,e,r,i){const o=ae(e);try{if(t.replaceWith(o),i&&r>0){const s=o.getBoundingClientRect().height||0;return r-s}}catch(s){se.error("プレースホルダー置換エラー",s),t.style.display="none";}return 0}const O=f("twitter-clean-timeline:remover");let b=0,F=false;function P(t){t&&(b+=t,!F&&(F=true,requestAnimationFrame(()=>{b!==0&&(window.scrollBy(0,b),n.debugMode&&O.debug(`スクロール補正: ${b}px`),b=0),F=false;})));}function ce(t,e){const r=t.getBoundingClientRect(),i=r.height||0,o=r.bottom<=0,s=t.closest("article")??t;if(n.showPlaceholder){const a=de(s,e,i,o);a>0&&P(a);}else try{s.remove(),o&&i>0&&P(i);}catch(a){O.error("ツイート削除エラー",a),s.style.display="none";}n.debugMode&&O.debug(`ツイート削除: ${e} (高さ: ${i}px, 上側: ${o})`);}const ue=f("twitter-clean-timeline:processor"),fe=new N,z=new D,me=new A;function B(){z.updateMuteRegexes();}function K(t){if(!t)return;const e=[fe,z,me];for(const r of e){const i=r.shouldHideFromDOM(t);if(i.shouldHide){const o=i.reason??r.name;n.debugMode&&ue.debug(`ツイートをフィルタ: ${o}`),ce(t,o);return}}}const T=f("twitter-clean-timeline:observer"),p=new Set;let M=false,x=null;function W(){M||(M=true,requestAnimationFrame(()=>{M=false;const t=Array.from(p);p.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(K(e),e.dataset.ctlProcessed="true"));}));}function he(t){for(const e of t)if(e.type==="childList")for(const r of Array.from(e.addedNodes)){if(!(r instanceof HTMLElement))continue;const i=r.matches(m.article)?r:r.querySelector(m.article);i&&p.add(i);}p.size>0&&W();}function R(){if(x){T.warn("オブザーバーは既に起動しています");return}x=new MutationObserver(he);const t=document.querySelector("main");t?(x.observe(t,{childList:true,subtree:true}),T.info("メイン要素の監視を開始しました")):(x.observe(document.body,{childList:true,subtree:true}),T.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(m.article).forEach(r=>{r.dataset.ctlProcessed||p.add(r);}),p.size>0&&W();}const v=f("twitter-clean-timeline:ui");function ge(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=pe();document.body.appendChild(e);}function pe(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
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
      <div style="margin-left: 24px; margin-right: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">文字列キーワード（1行1個）</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${n.muteFilter.stringKeywords.join(`
`)}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">正規表現パターン（1行1個）</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${n.muteFilter.regexKeywords.join(`
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
  `;const r=e.querySelector("#ctl-save-btn"),i=e.querySelector("#ctl-reset-btn"),o=e.querySelector("#ctl-cancel-btn");return r?.addEventListener("click",()=>{be(e),t.remove();}),i?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(ee(),B(),q(),V(),t.remove(),v.info("設定をリセットしました"),alert("設定をリセットして適用しました。"));}),o?.addEventListener("click",()=>{t.remove();}),t.addEventListener("click",s=>{s.target===t&&t.remove();}),t.appendChild(e),t}function V(){const t=document.querySelectorAll(m.article);t.forEach(e=>{delete e.dataset.ctlProcessed,K(e);}),v.info(`${t.length}件のツイートを再処理しました`);}function be(t){const e=i=>t.querySelector(`#${i}`)?.checked??false,r=i=>t.querySelector(`#${i}`)?.value??"";n.showPlaceholder=e("ctl-show-placeholder"),n.debugMode=e("ctl-debug-mode"),n.mediaFilter.enabled=e("ctl-media-enabled"),n.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),n.mediaFilter.enableOnLists=e("ctl-media-lists"),n.mediaFilter.enableOnProfile=e("ctl-media-profile"),n.mediaFilter.enableOnSearch=e("ctl-media-search"),n.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),n.muteFilter.enabled=e("ctl-mute-enabled"),n.muteFilter.stringKeywords=r("ctl-mute-strings").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.muteFilter.regexKeywords=r("ctl-mute-regexes").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.retweetFilter.enabled=e("ctl-retweet-enabled"),C(),B(),q(),V(),v.info("設定を保存しました"),alert("設定を保存して適用しました。");}const E=f("twitter-clean-timeline");function ye(){E.info("Twitter Clean Timeline を初期化中..."),le(),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{R();}):R(),GM_registerMenuCommand("タイムラインフィルタ設定",ge),E.info("初期化完了",{mediaFilter:n.mediaFilter.enabled,muteFilter:n.muteFilter.enabled,retweetFilter:n.retweetFilter.enabled,showPlaceholder:n.showPlaceholder});}ye();

})();