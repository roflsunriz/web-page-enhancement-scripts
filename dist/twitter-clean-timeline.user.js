// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.3.2
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

  const H={debug:"debug",info:"info",warn:"warn",error:"error"},c=t=>{const e=`[${t}]`,r={};return Object.keys(H).forEach(i=>{const o=H[i];r[i]=(...l)=>{(console[o]??console.log)(e,...l);};}),r};function U(t){return t?.data?.home?.home_timeline_urt??null}function O(t){return t?t.legacy?t.legacy:t.tweet?.legacy?t.tweet.legacy:null:null}function V(t){const e=O(t);if(!e)return  false;const r=e.extended_entities?.media,i=e.entities?.media,o=r??i??[];return Array.isArray(o)&&o.length>0}function X(t){const e=O(t);return e?!!(e.retweeted_status_id_str||(e.full_text??"").startsWith("RT @")):false}function G(t){return O(t)?.full_text??""}function W(t){return t?t.core?.user_results?.result?.legacy?.screen_name??"":""}class S{shouldHide(e,r){if(!this.enabled)return {shouldHide:false};if(e){const i=this.shouldHideFromJSON(e);if(i.shouldHide)return i}return r?this.shouldHideFromDOM(r):{shouldHide:false}}}const Y=c("twitter-clean-timeline"),R="twitter_clean_timeline_settings",C={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false}};let n={...C,...GM_getValue(R,{})};function _(){GM_setValue(R,n),Y.info("設定を保存しました",n);}function Q(){n={...C},_();}const u={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},$=[u.tweetPhoto,u.tweetVideo,u.mediaCardSmall,u.mediaCardLarge],w=c("twitter-clean-timeline:media-filter");class D extends S{get name(){return "media"}get enabled(){return n.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return n.mediaFilter.enableOnTimeline;case "list":return n.mediaFilter.enableOnLists;case "profile":return n.mediaFilter.enableOnProfile;case "search":return n.mediaFilter.enableOnSearch;case "tweetDetail":return n.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromJSON(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=V(e);return n.debugMode&&w.debug("JSON メディアチェック:",{hasMedia:r,hasTweet:!!e,hasLegacy:!!e?.legacy,hasExtendedEntities:!!e?.legacy?.extended_entities,hasBasicEntities:!!e?.legacy?.entities}),r?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=$.some(i=>e.querySelector(i));return n.debugMode&&w.debug("DOM メディアチェック:",{hasMedia:r,elementTagName:e.tagName,checkedSelectors:$.length}),r?{shouldHide:false}:(n.debugMode&&w.warn("DOMフォールバックでフィルタリング - JSONフィルタが動作していない可能性があります"),{shouldHide:true,reason:"メディアなし (DOM)",filterName:this.name})}}const Z=c("twitter-clean-timeline:mute-filter");class N extends S{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return n.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=n.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(r){return Z.error(`無効な正規表現パターン: ${e}`,r),null}}).filter(e=>e!==null);}isTextMuted(e){for(const r of n.muteFilter.stringKeywords)if(r&&e.includes(r))return {muted:true,keyword:r};for(const r of this.muteRegexes)if(r.test(e))return {muted:true,keyword:r.source};return {muted:false}}shouldHideFromJSON(e){if(!this.enabled)return {shouldHide:false};const r=G(e),i=W(e),o=`${r} @${i}`,l=this.isTextMuted(o);return l.muted?{shouldHide:true,reason:`ミュート: ${l.keyword}`,filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const r=e.innerText,i=this.isTextMuted(r);return i.muted?{shouldHide:true,reason:`ミュート (DOM): ${i.keyword}`,filterName:this.name}:{shouldHide:false}}}class A extends S{get name(){return "retweet"}get enabled(){return n.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromJSON(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:X(e)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(u.retweetIndicator)?{shouldHide:true,reason:"リツイート (DOM)",filterName:this.name}:{shouldHide:false}}}const s=c("twitter-clean-timeline:network"),ee=new D,J=new N,te=new A;function j(){J.updateMuteRegexes();}function ne(t){if(!t)return  false;n.debugMode&&t.includes("/i/api/graphql/")&&s.debug("GraphQL API検出:",t);const e=["/HomeTimeline","/HomeLatestTimeline","/ForYouTimeline"];return t.includes("/i/api/graphql/")&&e.some(r=>t.includes(r))}function re(t){const e=U(t);if(n.debugMode&&s.debug("タイムラインデータ抽出結果:",{hasData:!!e,hasInstructions:!!e?.instructions,instructionsCount:e?.instructions?.length??0}),!e?.instructions){n.debugMode&&s.warn("タイムラインデータまたはinstructionsが見つかりません");return}let r=0,i=0;for(const o of e.instructions){if(!o?.type||!Array.isArray(o.entries)||!String(o.type).includes("AddEntries"))continue;const l=o.entries.length;o.entries=o.entries.filter(d=>{const m=d?.content;if(!m||m.entryType==="TimelineTimelineCursor"||m.entryType!=="TimelineTimelineItem")return  true;const f=m.itemContent?.tweet_results?.result;if(!f)return  true;i++;const b=[ee,J,te];for(const g of b){const y=g.shouldHideFromJSON(f);if(y.shouldHide)return n.debugMode&&s.debug(`JSON フィルタ: ${y.reason??g.name}`),false}return  true});const a=l-o.entries.length;r+=a;}n.debugMode&&s.info(`JSONフィルタリング完了: 処理=${i}件, フィルタ=${r}件`);}function ie(){const t=XMLHttpRequest.prototype,e=Object.getOwnPropertyDescriptor(t,"responseText"),r=Object.getOwnPropertyDescriptor(t,"response");if(!e?.get||!r?.get){s.error("XMLHttpRequest.prototype の記述子を取得できません");return}const i=e.get,o=t.open,l=t.send;t.open=function(a,d,...m){return this.__ctlUrl=typeof d=="string"?d:String(d),o.apply(this,[a,d,...m])},t.send=function(a){const d=this.__ctlUrl;return ne(d??"")&&(n.debugMode&&s.info("タイムラインAPIをフック:",d),this.addEventListener("readystatechange",function(){if(this.readyState===4&&!this.__ctlPatched){this.__ctlPatched=true;try{const f=i.call(this);if(typeof f!="string"||!f){n.debugMode&&s.warn("レスポンスが空または文字列ではありません");return}const b=JSON.parse(f);n.debugMode&&s.debug("JSONパース成功、フィルタリング開始"),re(b);const g=JSON.stringify(b);if(Object.defineProperty(this,"responseText",{configurable:!0,get(){return g}}),this.responseType===""||this.responseType==="text")Object.defineProperty(this,"response",{configurable:!0,get(){return g}});else if(this.responseType==="json"){const y=JSON.parse(g);Object.defineProperty(this,"response",{configurable:!0,get(){return y}});}n.debugMode&&s.debug("レスポンス書き換え完了");}catch(f){s.error("XHRフックエラー",f);}}})),l.call(this,a)},s.info("XHRフックをインストールしました");}function oe(){const t=`
    (function() {
      const originalFetch = window.fetch;
      const debugMode = ${n.debugMode};
      
      // タイムラインエンドポイント判定
      function isHomeTimelineUrl(url) {
        if (!url) return false;
        
        if (debugMode && url.includes('/i/api/')) {
          console.log('[twitter-clean-timeline:network] Fetch API呼び出し検出:', url);
        }
        
        const timelinePatterns = [
          '/HomeTimeline',
          '/HomeLatestTimeline',
          '/ForYouTimeline',
        ];
        
        return url.includes('/i/api/graphql/') && 
               timelinePatterns.some(pattern => url.includes(pattern));
      }
      
      // フィルタリング処理
      function filterTimelineJson(response) {
        try {
          const timelineData = response?.data?.home?.home_timeline_urt;
          
          if (!timelineData?.instructions) {
            return response;
          }
          
          let totalFiltered = 0;
          let totalProcessed = 0;
          const mediaFilterEnabled = ${n.mediaFilter.enabled};
          
          for (const instruction of timelineData.instructions) {
            if (!instruction?.type || !Array.isArray(instruction.entries)) continue;
            
            if (!String(instruction.type).includes('AddEntries')) continue;
            
            const originalLength = instruction.entries.length;
            
            instruction.entries = instruction.entries.filter((entry) => {
              const content = entry?.content;
              if (!content) return true;
              
              if (content.entryType === 'TimelineTimelineCursor') return true;
              if (content.entryType !== 'TimelineTimelineItem') return true;
              
              const tweet = content.itemContent?.tweet_results?.result;
              if (!tweet) return true;
              
              totalProcessed++;
              
              // メディアフィルタ
              if (mediaFilterEnabled) {
                const legacy = tweet.legacy || tweet.tweet?.legacy;
                if (legacy) {
                  const extendedMedia = legacy.extended_entities?.media;
                  const basicMedia = legacy.entities?.media;
                  const mediaList = extendedMedia ?? basicMedia ?? [];
                  const hasMedia = Array.isArray(mediaList) && mediaList.length > 0;
                  
                  if (!hasMedia) {
                    if (debugMode) {
                      console.log('[twitter-clean-timeline:network] JSONフィルタ: メディアなし');
                    }
                    return false;
                  }
                }
              }
              
              return true;
            });
            
            totalFiltered += originalLength - instruction.entries.length;
          }
          
          if (debugMode && totalFiltered > 0) {
            console.log('[twitter-clean-timeline:network] JSONフィルタリング完了: 処理=' + totalProcessed + '件, フィルタ=' + totalFiltered + '件');
          }
          
          return response;
        } catch (e) {
          console.error('[twitter-clean-timeline:network] フィルタリングエラー:', e);
          return response;
        }
      }
      
      // fetchをフック
      window.fetch = async function(...args) {
        const [resource] = args;
        const url = typeof resource === 'string' ? resource : resource instanceof Request ? resource.url : '';
        
        if (isHomeTimelineUrl(url)) {
          if (debugMode) {
            console.log('[twitter-clean-timeline:network] タイムラインAPIをフック (fetch):', url);
          }
          
          try {
            const response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();
            const text = await clonedResponse.text();
            
            if (!text) {
              return response;
            }
            
            const json = JSON.parse(text);
            const filteredJson = filterTimelineJson(json);
            const newText = JSON.stringify(filteredJson);
            
            return new Response(newText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          } catch (e) {
            console.error('[twitter-clean-timeline:network] Fetchフックエラー:', e);
            return originalFetch.apply(this, args);
          }
        }
        
        return originalFetch.apply(this, args);
      };
      
      console.log('[twitter-clean-timeline:network] Fetchフック注入完了');
    })();
  `,e=document.createElement("script");e.textContent=t,(document.head||document.documentElement).appendChild(e),e.remove(),s.info("Fetchフックをページコンテキストに注入しました");}function le(){ie(),oe();}const se=c("twitter-clean-timeline:placeholder");function ae(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function ce(t,e,r,i){const o=ae(e);try{if(t.replaceWith(o),i&&r>0){const l=o.getBoundingClientRect().height||0;return r-l}}catch(l){se.error("プレースホルダー置換エラー",l),t.style.display="none";}return 0}const k=c("twitter-clean-timeline:remover");let p=0,F=false;function P(t){t&&(p+=t,!F&&(F=true,requestAnimationFrame(()=>{p!==0&&(window.scrollBy(0,p),n.debugMode&&k.debug(`スクロール補正: ${p}px`),p=0),F=false;})));}function de(t,e){const r=t.getBoundingClientRect(),i=r.height||0,o=r.bottom<=0,l=t.closest("article")??t;if(n.showPlaceholder){const a=ce(l,e,i,o);a>0&&P(a);}else try{l.remove(),o&&i>0&&P(i);}catch(a){k.error("ツイート削除エラー",a),l.style.display="none";}n.debugMode&&k.debug(`ツイート削除: ${e} (高さ: ${i}px, 上側: ${o})`);}const ue=c("twitter-clean-timeline:processor"),fe=new D,q=new N,me=new A;function I(){q.updateMuteRegexes();}function z(t){if(!t)return;const e=[fe,q,me];for(const r of e){const i=r.shouldHideFromDOM(t);if(i.shouldHide){const o=i.reason??r.name;n.debugMode&&ue.debug(`ツイートをフィルタ: ${o}`),de(t,o);return}}}const T=c("twitter-clean-timeline:observer"),h=new Set;let M=false,x=null;function B(){M||(M=true,requestAnimationFrame(()=>{M=false;const t=Array.from(h);h.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(z(e),e.dataset.ctlProcessed="true"));}));}function ge(t){for(const e of t)if(e.type==="childList")for(const r of Array.from(e.addedNodes)){if(!(r instanceof HTMLElement))continue;const i=r.matches(u.article)?r:r.querySelector(u.article);i&&h.add(i);}h.size>0&&B();}function E(){if(x){T.warn("オブザーバーは既に起動しています");return}x=new MutationObserver(ge);const t=document.querySelector("main");t?(x.observe(t,{childList:true,subtree:true}),T.info("メイン要素の監視を開始しました")):(x.observe(document.body,{childList:true,subtree:true}),T.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(u.article).forEach(r=>{r.dataset.ctlProcessed||h.add(r);}),h.size>0&&B();}const v=c("twitter-clean-timeline:ui");function he(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=pe();document.body.appendChild(e);}function pe(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
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
  `;const r=e.querySelector("#ctl-save-btn"),i=e.querySelector("#ctl-reset-btn"),o=e.querySelector("#ctl-cancel-btn");return r?.addEventListener("click",()=>{be(e),t.remove();}),i?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(Q(),I(),j(),K(),t.remove(),v.info("設定をリセットしました"),alert("設定をリセットして適用しました。"));}),o?.addEventListener("click",()=>{t.remove();}),t.addEventListener("click",l=>{l.target===t&&t.remove();}),t.appendChild(e),t}function K(){const t=document.querySelectorAll(u.article);t.forEach(e=>{delete e.dataset.ctlProcessed,z(e);}),v.info(`${t.length}件のツイートを再処理しました`);}function be(t){const e=i=>t.querySelector(`#${i}`)?.checked??false,r=i=>t.querySelector(`#${i}`)?.value??"";n.showPlaceholder=e("ctl-show-placeholder"),n.debugMode=e("ctl-debug-mode"),n.mediaFilter.enabled=e("ctl-media-enabled"),n.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),n.mediaFilter.enableOnLists=e("ctl-media-lists"),n.mediaFilter.enableOnProfile=e("ctl-media-profile"),n.mediaFilter.enableOnSearch=e("ctl-media-search"),n.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),n.muteFilter.enabled=e("ctl-mute-enabled"),n.muteFilter.stringKeywords=r("ctl-mute-strings").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.muteFilter.regexKeywords=r("ctl-mute-regexes").split(`
`).map(i=>i.trim()).filter(i=>i.length>0),n.retweetFilter.enabled=e("ctl-retweet-enabled"),_(),I(),j(),K(),v.info("設定を保存しました"),alert("設定を保存して適用しました。");}const L=c("twitter-clean-timeline");function ye(){L.info("Twitter Clean Timeline を初期化中..."),le(),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{E();}):E(),GM_registerMenuCommand("タイムラインフィルタ設定",he),L.info("初期化完了",{mediaFilter:n.mediaFilter.enabled,muteFilter:n.muteFilter.enabled,retweetFilter:n.retweetFilter.enabled,showPlaceholder:n.showPlaceholder});}ye();

})();