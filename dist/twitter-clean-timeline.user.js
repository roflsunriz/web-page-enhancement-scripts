// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.5.0
// @author       roflsunriz
// @description  X/Twitterタイムラインの統合フィルタ（メディア・ミュート・リツイート・置き換え）。JSON事前フィルタリングとDOM削除でクリーンな体験を提供。
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

  const T={debug:"debug",info:"info",warn:"warn",error:"error"},d=t=>{const e=`[${t}]`,l={};return Object.keys(T).forEach(o=>{const i=T[o];l[o]=(...n)=>{(console[i]??console.log)(e,...n);};}),l},c={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},$=[c.tweetPhoto,c.tweetVideo,c.mediaCardSmall,c.mediaCardLarge],K=d("twitter-clean-timeline"),P="twitter_clean_timeline_settings",L={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false},replaceFilter:{enabled:false,replacements:[]}};let r={...L,...GM_getValue(P,{})};function N(){GM_setValue(P,r),K.info("設定を保存しました",r);}function V(){r={...L},N();}const W=d("twitter-clean-timeline:placeholder");function G(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.textContent=`フィルタ済み: ${t}`,Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function U(t,e,l,o){const i=G(e);try{if(t.replaceWith(i),o&&l>0){const n=i.getBoundingClientRect().height||0;return l-n}}catch(n){W.error("プレースホルダー置換エラー",n),t.style.display="none";}return 0}const v=d("twitter-clean-timeline:remover");let f=0,x=false;function R(t){t&&(f+=t,!x&&(x=true,requestAnimationFrame(()=>{f!==0&&(window.scrollBy(0,f),r.debugMode&&v.debug(`スクロール補正: ${f}px`),f=0),x=false;})));}function X(t,e){const l=t.getBoundingClientRect(),o=l.height||0,i=l.bottom<=0,n=t.closest("article")??t;if(r.showPlaceholder){const a=U(n,e,o,i);a>0&&R(a);}else try{n.remove(),i&&o>0&&R(o);}catch(a){v.error("ツイート削除エラー",a),n.style.display="none";}r.debugMode&&v.debug(`ツイート削除: ${e} (高さ: ${o}px, 上側: ${i})`);}class F{}const Y=d("twitter-clean-timeline:media-filter");class J extends F{get name(){return "media"}get enabled(){return r.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return r.mediaFilter.enableOnTimeline;case "list":return r.mediaFilter.enableOnLists;case "profile":return r.mediaFilter.enableOnProfile;case "search":return r.mediaFilter.enableOnSearch;case "tweetDetail":return r.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const l=$.some(o=>e.querySelector(o));return r.debugMode&&Y.debug("DOMメディアチェック:",{hasMedia:l,elementTagName:e.tagName,checkedSelectors:$.length}),l?{shouldHide:false}:{shouldHide:true,reason:"メディアなし",filterName:this.name}}}const Q=d("twitter-clean-timeline:mute-filter");class Z extends F{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return r.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=r.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(l){return Q.error(`無効な正規表現パターン: ${e}`,l),null}}).filter(e=>e!==null);}isTextMuted(e){for(const l of r.muteFilter.stringKeywords)if(l&&e.includes(l))return {muted:true,keyword:l};for(const l of this.muteRegexes)if(l.test(e))return {muted:true,keyword:l.source};return {muted:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const l=e.innerText,o=this.isTextMuted(l);return o.muted?{shouldHide:true,reason:`ミュート: ${o.keyword}`,filterName:this.name}:{shouldHide:false}}}class ee extends F{get name(){return "retweet"}get enabled(){return r.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(c.retweetIndicator)?{shouldHide:true,reason:"リツイート",filterName:this.name}:{shouldHide:false}}}const S=d("twitter-clean-timeline:replace-filter");class te{compiledReplacements=[];constructor(){this.updateReplacements();}get name(){return "replace"}get enabled(){return r.replaceFilter.enabled}updateReplacements(){this.compiledReplacements=r.replaceFilter.replacements.filter(e=>e.from.trim()!=="").map(e=>{if(e.isRegex)try{return {pattern:new RegExp(e.from,"g"),to:e.to,isRegex:!0}}catch(l){return S.error(`無効な正規表現パターン: ${e.from}`,l),null}else return {pattern:e.from,to:e.to,isRegex:false}}).filter(e=>e!==null);}replaceInElement(e){if(!(!this.enabled||this.compiledReplacements.length===0)&&e.dataset.ctlReplaced!=="true")try{this.replaceTextNodes(e),e.dataset.ctlReplaced="true";}catch(l){S.error("テキスト置き換え中にエラーが発生しました",l);}}replaceTextNodes(e){if(e.nodeType===Node.TEXT_NODE){const l=e;let o=l.textContent??"",i=false;for(const n of this.compiledReplacements)if(n.isRegex){const a=n.pattern;a.test(o)&&(o=o.replace(a,n.to),i=true);}else {const a=n.pattern;o.includes(a)&&(o=o.split(a).join(n.to),i=true);}i&&(l.textContent=o);}else if(e.nodeType===Node.ELEMENT_NODE){const l=e;if(l.tagName==="SCRIPT"||l.tagName==="STYLE"||l.tagName==="INPUT"||l.tagName==="TEXTAREA")return;const o=Array.from(e.childNodes);for(const i of o)this.replaceTextNodes(i);}}}const re=d("twitter-clean-timeline:processor"),le=new J,A=new Z,oe=new ee,H=new te;function z(){A.updateMuteRegexes();}function q(){H.updateReplacements();}function D(t){if(!t)return;H.replaceInElement(t);const e=[le,A,oe];for(const l of e){const o=l.shouldHideFromDOM(t);if(o.shouldHide){const i=o.reason??l.name;r.debugMode&&re.debug(`ツイートをフィルタ: ${i}`),X(t,i);return}}}const y=d("twitter-clean-timeline:observer"),p=new Set;let w=false,h=null;function I(){w||(w=true,requestAnimationFrame(()=>{w=false;const t=Array.from(p);p.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(D(e),e.dataset.ctlProcessed="true"));}));}function ie(t){for(const e of t)if(e.type==="childList")for(const l of Array.from(e.addedNodes)){if(!(l instanceof HTMLElement))continue;const o=l.matches(c.article)?l:l.querySelector(c.article);o&&p.add(o);}p.size>0&&I();}function E(){if(h){y.warn("オブザーバーは既に起動しています");return}h=new MutationObserver(ie);const t=document.querySelector("main");t?(h.observe(t,{childList:true,subtree:true}),y.info("メイン要素の監視を開始しました")):(h.observe(document.body,{childList:true,subtree:true}),y.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(c.article).forEach(l=>{l.dataset.ctlProcessed||p.add(l);}),p.size>0&&I();}const k=d("twitter-clean-timeline:ui");function ne(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=ae();document.body.appendChild(e);}function j(){return r.replaceFilter.replacements.length===0?'<div style="color: #8b98a5; text-align: center; padding: 16px;">ルールがありません</div>':`
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid #38444d;">
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">検索</th>
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">置き換え</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">正規表現</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">削除</th>
        </tr>
      </thead>
      <tbody>
        ${r.replaceFilter.replacements.map((t,e)=>`
          <tr style="border-bottom: 1px solid #2f3336;">
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${e}" data-replace-field="from" value="${M(t.from)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${e}" data-replace-field="to" value="${M(t.to)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px; text-align: center;">
              <input type="checkbox" data-replace-index="${e}" data-replace-field="isRegex" ${t.isRegex?"checked":""}>
            </td>
            <td style="padding: 8px; text-align: center;">
              <button data-replace-delete="${e}" style="padding: 4px 8px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                削除
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}function M(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function ae(){const t=document.createElement("div");t.id="ctl-settings-modal",Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
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

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-replace-enabled" ${r.replaceFilter.enabled?"checked":""}>
          置き換えフィルタ
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label style="display: block; font-weight: bold; color: #e7e9ea;">置き換えルール</label>
          <button id="ctl-replace-add-btn" style="padding: 4px 12px; background-color: #1d9bf0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ルール追加
          </button>
        </div>
        <div id="ctl-replace-table-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #38444d; border-radius: 4px; background-color: #192734; padding: 8px;">
          ${j()}
        </div>
      </div>
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
  `;const l=e.querySelector("#ctl-save-btn"),o=e.querySelector("#ctl-reset-btn"),i=e.querySelector("#ctl-cancel-btn"),n=e.querySelector("#ctl-replace-add-btn");l?.addEventListener("click",()=>{de(e),t.remove();}),o?.addEventListener("click",()=>{confirm("すべての設定をリセットしますか？")&&(V(),z(),q(),_(),t.remove(),k.info("設定をリセットしました"),alert("設定をリセットして適用しました。"));}),i?.addEventListener("click",()=>{t.remove();}),n?.addEventListener("click",()=>{r.replaceFilter.replacements.push({from:"",to:"",isRegex:false}),O(e);});const a=e.querySelector("#ctl-replace-table-container");return a?.addEventListener("click",u=>{const s=u.target;if(s.hasAttribute("data-replace-delete")){const b=Number(s.getAttribute("data-replace-delete"));r.replaceFilter.replacements.splice(b,1),O(e);}}),a?.addEventListener("input",u=>{const s=u.target,b=s.getAttribute("data-replace-index"),m=s.getAttribute("data-replace-field");if(b!==null&&m!==null){const B=Number(b),g=r.replaceFilter.replacements[B];g&&(m==="from"?g.from=s.value:m==="to"?g.to=s.value:m==="isRegex"&&(g.isRegex=s.checked));}}),t.addEventListener("click",u=>{u.target===t&&t.remove();}),t.appendChild(e),t}function O(t){const e=t.querySelector("#ctl-replace-table-container");e&&(e.innerHTML=j());}function _(){const t=document.querySelectorAll(c.article);t.forEach(e=>{delete e.dataset.ctlProcessed,delete e.dataset.ctlReplaced,D(e);}),k.info(`${t.length}件のツイートを再処理しました`);}function de(t){const e=o=>t.querySelector(`#${o}`)?.checked??false,l=o=>t.querySelector(`#${o}`)?.value??"";r.showPlaceholder=e("ctl-show-placeholder"),r.debugMode=e("ctl-debug-mode"),r.mediaFilter.enabled=e("ctl-media-enabled"),r.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),r.mediaFilter.enableOnLists=e("ctl-media-lists"),r.mediaFilter.enableOnProfile=e("ctl-media-profile"),r.mediaFilter.enableOnSearch=e("ctl-media-search"),r.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),r.muteFilter.enabled=e("ctl-mute-enabled"),r.muteFilter.stringKeywords=l("ctl-mute-strings").split(`
`).map(o=>o.trim()).filter(o=>o.length>0),r.muteFilter.regexKeywords=l("ctl-mute-regexes").split(`
`).map(o=>o.trim()).filter(o=>o.length>0),r.retweetFilter.enabled=e("ctl-retweet-enabled"),r.replaceFilter.enabled=e("ctl-replace-enabled"),N(),z(),q(),_(),k.info("設定を保存しました"),alert("設定を保存して適用しました。");}const C=d("twitter-clean-timeline");function ce(){C.info("Twitter Clean Timeline を初期化中..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{E();}):E(),GM_registerMenuCommand("タイムラインフィルタ設定",ne),C.info("初期化完了",{mediaFilter:r.mediaFilter.enabled,muteFilter:r.muteFilter.enabled,retweetFilter:r.retweetFilter.enabled,showPlaceholder:r.showPlaceholder});}ce();

})();