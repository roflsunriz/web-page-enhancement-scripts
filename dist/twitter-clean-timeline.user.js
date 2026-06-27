// ==UserScript==
// @name         twitter-clean-timeline
// @namespace    twitterCleanTimeline
// @version      1.6.0
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

  const L={debug:"debug",info:"info",warn:"warn",error:"error"},E={debug:10,info:20,warn:30,error:40};let Z=t=>E[t]>=E.warn;const p=t=>{const e=`[${t}]`,r={};return Object.keys(L).forEach(o=>{const n=L[o];r[o]=(...s)=>{if(!Z(o))return;(console[n]??console.log)(e,...s);};}),r},g={article:'article[data-testid="tweet"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',retweetIndicator:".r-15zivkp"},P=[g.tweetPhoto,g.tweetVideo,g.mediaCardSmall,g.mediaCardLarge],J=p("twitter-clean-timeline"),z="twitter_clean_timeline_settings",j={showPlaceholder:false,debugMode:false,mediaFilter:{enabled:false,enableOnTimeline:false,enableOnLists:false,enableOnProfile:false,enableOnSearch:false,enableOnTweetDetail:false},muteFilter:{enabled:false,stringKeywords:[],regexKeywords:[]},retweetFilter:{enabled:false},replaceFilter:{enabled:false,replacements:[]}};let l={...j,...GM_getValue(z,{})};function q(){GM_setValue(z,l),J.info("設定を保存しました",l);}function Q(){l={...j},q();}const ee=new Set(["ar","ur"]);function te(t){return ee.has(t)?"rtl":"ltr"}function re(t,e){return t.replace(/\{([a-zA-Z0-9_]+)\}/g,(r,o)=>{const n=e[o];return n===void 0?r:String(n)})}function le(t){const e=Object.keys(t.translations);let r=t.defaultLocale;const o=a=>{const d=a.toLowerCase(),u=t.aliases?.[d];if(u)return u;const m=e.find(v=>v.toLowerCase()===d);if(m)return m;const Y=d.split("-")[0];return e.find(v=>v.toLowerCase().split("-")[0]===Y)??null},n=()=>{const a=navigator.languages.length>0?navigator.languages:[navigator.language];for(const d of a){const u=o(d);if(u)return u}return t.fallbackLocale},s=a=>{const d=t.translations[r]?.[a];if(d)return d;const u=t.translations[t.fallbackLocale]?.[a];return u||(t.translations[t.defaultLocale]?.[a]??a)};return {locales:e,getLocale:()=>r,setLocale:a=>{r=a;},detectBrowserLocale:n,t:s,format:(a,d)=>re(s(a),d),getTranslations:(a=r)=>t.translations[a]??t.translations[t.fallbackLocale],getDirection:(a=r)=>te(a),getMissingTranslationKeys:a=>{const d=t.translations[t.fallbackLocale],u=t.translations[a];return Object.keys(d).filter(m=>!u[m])}}}const oe={ja:{addRule:"ルール追加",cancel:"キャンセル",debugMode:"デバッグモード（コンソールに詳細ログを出力）",delete:"削除",filteredPlaceholder:"フィルタ済み: {reason}",globalSettings:"グローバル設定",homeTimeline:"ホームタイムライン",lists:"リスト",mediaFilter:"メディアフィルタ",muteFilter:"ミュートフィルタ",muteReason:"ミュート: {keyword}",noMediaReason:"メディアなし",noRules:"ルールがありません",profile:"プロフィール",regexHeader:"正規表現",regexPatterns:"正規表現パターン（1行1個）",replaceFilter:"置き換えフィルタ",replaceHeader:"置き換え",replacementRules:"置き換えルール",reset:"リセット",resetApplied:"設定をリセットして適用しました。",resetConfirm:"すべての設定をリセットしますか？",retweetFilter:"リツイートフィルタ（プロフィールページで動作）",retweetReason:"リツイート",save:"保存",saveApplied:"設定を保存して適用しました。",search:"検索",searchHeader:"検索",settingsMenu:"タイムラインフィルタ設定",settingsTitle:"Twitter Clean Timeline 設定",showPlaceholder:"プレースホルダー表示（フィルタされたツイートを小さく表示）",stringKeywords:"文字列キーワード（1行1個）",tweetDetail:"ツイート詳細"},en:{addRule:"Add rule",cancel:"Cancel",debugMode:"Debug mode (print detailed logs to the console)",delete:"Delete",filteredPlaceholder:"Filtered: {reason}",globalSettings:"Global settings",homeTimeline:"Home timeline",lists:"Lists",mediaFilter:"Media filter",muteFilter:"Mute filter",muteReason:"Muted: {keyword}",noMediaReason:"No media",noRules:"No rules",profile:"Profile",regexHeader:"Regex",regexPatterns:"Regex patterns (one per line)",replaceFilter:"Replacement filter",replaceHeader:"Replace",replacementRules:"Replacement rules",reset:"Reset",resetApplied:"Settings were reset and applied.",resetConfirm:"Reset all settings?",retweetFilter:"Retweet filter (works on profile pages)",retweetReason:"Retweet",save:"Save",saveApplied:"Settings were saved and applied.",search:"Search",searchHeader:"Find",settingsMenu:"Timeline filter settings",settingsTitle:"Twitter Clean Timeline Settings",showPlaceholder:"Show placeholders (show filtered tweets in compact form)",stringKeywords:"String keywords (one per line)",tweetDetail:"Tweet detail"}},y=le({translations:oe,defaultLocale:"ja",fallbackLocale:"en"});y.setLocale(y.detectBrowserLocale());const I=y.format,k=y.getDirection,i=y.t,ie=p("twitter-clean-timeline:placeholder");function ne(t){const e=document.createElement("div");return e.dataset.twitterCleanTimelinePlaceholder="1",e.dir=k(),e.textContent=I("filteredPlaceholder",{reason:t}),Object.assign(e.style,{fontSize:"12px",color:"rgb(113, 118, 123)",opacity:"0.6",padding:"8px 16px",borderBottom:"1px solid rgb(239, 243, 244)",backgroundColor:"rgb(247, 249, 249)",fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'}),e}function ae(t,e,r,o){const n=ne(e);try{if(t.replaceWith(n),o&&r>0){const s=n.getBoundingClientRect().height||0;return r-s}}catch(s){ie.error("プレースホルダー置換エラー",s),t.style.display="none";}return 0}const R=p("twitter-clean-timeline:remover");let x=0,F=false;function C(t){t&&(x+=t,!F&&(F=true,requestAnimationFrame(()=>{x!==0&&(window.scrollBy(0,x),l.debugMode&&R.debug(`スクロール補正: ${x}px`),x=0),F=false;})));}function se(t,e){const r=t.getBoundingClientRect(),o=r.height||0,n=r.bottom<=0,s=t.closest("article")??t;if(l.showPlaceholder){const c=ae(s,e,o,n);c>0&&C(c);}else try{s.remove(),n&&o>0&&C(o);}catch(c){R.error("ツイート削除エラー",c),s.style.display="none";}l.debugMode&&R.debug(`ツイート削除: ${e} (高さ: ${o}px, 上側: ${n})`);}class S{}const de=p("twitter-clean-timeline:media-filter");class ce extends S{get name(){return "media"}get enabled(){return l.mediaFilter.enabled}getPageType(){const e=window.location.pathname;return e==="/home"?"timeline":e.includes("/lists/")?"list":e.match(/^\/[^/]+$/)&&!e.match(/^\/search$|^\/explore$|^\/home$/)?"profile":e.match(/^\/search/)?"search":e.match(/\/status\//)?"tweetDetail":"other"}isEnabledForCurrentPage(){switch(this.getPageType()){case "timeline":return l.mediaFilter.enableOnTimeline;case "list":return l.mediaFilter.enableOnLists;case "profile":return l.mediaFilter.enableOnProfile;case "search":return l.mediaFilter.enableOnSearch;case "tweetDetail":return l.mediaFilter.enableOnTweetDetail;default:return  false}}shouldHideFromDOM(e){if(!this.enabled||!this.isEnabledForCurrentPage())return {shouldHide:false};const r=P.some(o=>e.querySelector(o));return l.debugMode&&de.debug("DOMメディアチェック:",{hasMedia:r,elementTagName:e.tagName,checkedSelectors:P.length}),r?{shouldHide:false}:{shouldHide:true,reason:i("noMediaReason"),filterName:this.name}}}const ue=p("twitter-clean-timeline:mute-filter");class pe extends S{muteRegexes=[];constructor(){super(),this.updateMuteRegexes();}get name(){return "mute"}get enabled(){return l.muteFilter.enabled}updateMuteRegexes(){this.muteRegexes=l.muteFilter.regexKeywords.filter(e=>e.trim()!=="").map(e=>{try{return new RegExp(e)}catch(r){return ue.error(`無効な正規表現パターン: ${e}`,r),null}}).filter(e=>e!==null);}isTextMuted(e){for(const r of l.muteFilter.stringKeywords)if(r&&e.includes(r))return {muted:true,keyword:r};for(const r of this.muteRegexes)if(r.test(e))return {muted:true,keyword:r.source};return {muted:false}}shouldHideFromDOM(e){if(!this.enabled||!e.innerText)return {shouldHide:false};const r=e.innerText,o=this.isTextMuted(r);return o.muted?{shouldHide:true,reason:I("muteReason",{keyword:o.keyword??""}),filterName:this.name}:{shouldHide:false}}}class fe extends S{get name(){return "retweet"}get enabled(){return l.retweetFilter.enabled}isProfilePage(){const e=window.location.pathname;return e.match(/^\/[^/]+$/)!==null&&!e.match(/^\/search$|^\/explore$|^\/home$/)}shouldHideFromDOM(e){return !this.enabled||!this.isProfilePage()?{shouldHide:false}:e.querySelector(g.retweetIndicator)?{shouldHide:true,reason:i("retweetReason"),filterName:this.name}:{shouldHide:false}}}const O=p("twitter-clean-timeline:replace-filter");class me{compiledReplacements=[];constructor(){this.updateReplacements();}get name(){return "replace"}get enabled(){return l.replaceFilter.enabled}updateReplacements(){this.compiledReplacements=l.replaceFilter.replacements.filter(e=>e.from.trim()!=="").map(e=>{if(e.isRegex)try{return {pattern:new RegExp(e.from,"g"),to:e.to,isRegex:!0}}catch(r){return O.error(`無効な正規表現パターン: ${e.from}`,r),null}else return {pattern:e.from,to:e.to,isRegex:false}}).filter(e=>e!==null);}replaceInElement(e){if(!(!this.enabled||this.compiledReplacements.length===0)&&e.dataset.ctlReplaced!=="true")try{this.replaceTextNodes(e),e.dataset.ctlReplaced="true";}catch(r){O.error("テキスト置き換え中にエラーが発生しました",r);}}replaceTextNodes(e){if(e.nodeType===Node.TEXT_NODE){const r=e;let o=r.textContent??"",n=false;for(const s of this.compiledReplacements)if(s.isRegex){const c=s.pattern;c.test(o)&&(o=o.replace(c,s.to),n=true);}else {const c=s.pattern;o.includes(c)&&(o=o.split(c).join(s.to),n=true);}n&&(r.textContent=o);}else if(e.nodeType===Node.ELEMENT_NODE){const r=e;if(r.tagName==="SCRIPT"||r.tagName==="STYLE"||r.tagName==="INPUT"||r.tagName==="TEXTAREA")return;const o=Array.from(e.childNodes);for(const n of o)this.replaceTextNodes(n);}}}const ge=p("twitter-clean-timeline:processor"),be=new ce,_=new pe,he=new fe,K=new me;function B(){_.updateMuteRegexes();}function V(){K.updateReplacements();}function G(t){if(!t)return;K.replaceInElement(t);const e=[be,_,he];for(const r of e){const o=r.shouldHideFromDOM(t);if(o.shouldHide){const n=o.reason??r.name;l.debugMode&&ge.debug(`ツイートをフィルタ: ${n}`),se(t,n);return}}}const T=p("twitter-clean-timeline:observer"),h=new Set;let $=false,w=null;function W(){$||($=true,requestAnimationFrame(()=>{$=false;const t=Array.from(h);h.clear();for(const e of t)document.body.contains(e)&&(e.dataset.ctlProcessed||(G(e),e.dataset.ctlProcessed="true"));}));}function xe(t){for(const e of t)if(e.type==="childList")for(const r of Array.from(e.addedNodes)){if(!(r instanceof HTMLElement))continue;const o=r.matches(g.article)?r:r.querySelector(g.article);o&&h.add(o);}h.size>0&&W();}function H(){if(w){T.warn("オブザーバーは既に起動しています");return}w=new MutationObserver(xe);const t=document.querySelector("main");t?(w.observe(t,{childList:true,subtree:true}),T.info("メイン要素の監視を開始しました")):(w.observe(document.body,{childList:true,subtree:true}),T.info("body要素の監視を開始しました（main要素が見つかりません）")),document.querySelectorAll(g.article).forEach(r=>{r.dataset.ctlProcessed||h.add(r);}),h.size>0&&W();}const M=p("twitter-clean-timeline:ui");function ye(){const t=document.querySelector("#ctl-settings-modal");t&&t.remove();const e=we();document.body.appendChild(e);}function U(){return l.replaceFilter.replacements.length===0?`<div style="color: #8b98a5; text-align: center; padding: 16px;">${i("noRules")}</div>`:`
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid #38444d;">
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">${i("searchHeader")}</th>
          <th style="padding: 8px; text-align: left; color: #e7e9ea; font-weight: bold; width: 35%;">${i("replaceHeader")}</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">${i("regexHeader")}</th>
          <th style="padding: 8px; text-align: center; color: #e7e9ea; font-weight: bold; width: 15%;">${i("delete")}</th>
        </tr>
      </thead>
      <tbody>
        ${l.replaceFilter.replacements.map((t,e)=>`
          <tr style="border-bottom: 1px solid #2f3336;">
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${e}" data-replace-field="from" value="${A(t.from)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px;">
              <input type="text" data-replace-index="${e}" data-replace-field="to" value="${A(t.to)}" 
                style="width: 100%; padding: 4px; border: 1px solid #38444d; border-radius: 4px; background-color: #15202b; color: #ffffff; box-sizing: border-box;">
            </td>
            <td style="padding: 8px; text-align: center;">
              <input type="checkbox" data-replace-index="${e}" data-replace-field="isRegex" ${t.isRegex?"checked":""}>
            </td>
            <td style="padding: 8px; text-align: center;">
              <button data-replace-delete="${e}" style="padding: 4px 8px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                ${i("delete")}
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}function A(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function we(){const t=document.createElement("div");t.id="ctl-settings-modal",t.dir=k(),Object.assign(t.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:"10000"});const e=document.createElement("div");e.dir=k(),Object.assign(e.style,{backgroundColor:"#15202b",color:"#ffffff",borderRadius:"16px",padding:"24px",width:"600px",maxWidth:"90vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)"}),e.innerHTML=`
    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #ffffff;">${i("settingsTitle")}</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">${i("globalSettings")}</h3>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-show-placeholder" ${l.showPlaceholder?"checked":""}>
        ${i("showPlaceholder")}
      </label>
      <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
        <input type="checkbox" id="ctl-debug-mode" ${l.debugMode?"checked":""}>
        ${i("debugMode")}
      </label>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-media-enabled" ${l.mediaFilter.enabled?"checked":""}>
          ${i("mediaFilter")}
        </label>
      </h3>
      <div style="margin-left: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-timeline" ${l.mediaFilter.enableOnTimeline?"checked":""}>
          ${i("homeTimeline")}
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-lists" ${l.mediaFilter.enableOnLists?"checked":""}>
          ${i("lists")}
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-profile" ${l.mediaFilter.enableOnProfile?"checked":""}>
          ${i("profile")}
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-search" ${l.mediaFilter.enableOnSearch?"checked":""}>
          ${i("search")}
        </label>
        <label style="display: block; margin-bottom: 8px; color: #e7e9ea; cursor: pointer;">
          <input type="checkbox" id="ctl-media-detail" ${l.mediaFilter.enableOnTweetDetail?"checked":""}>
          ${i("tweetDetail")}
        </label>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-mute-enabled" ${l.muteFilter.enabled?"checked":""}>
          ${i("muteFilter")}
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #e7e9ea;">${i("stringKeywords")}</label>
        <textarea id="ctl-mute-strings" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${l.muteFilter.stringKeywords.join(`
`)}</textarea>
        
        <label style="display: block; margin: 12px 0 4px 0; font-weight: bold; color: #e7e9ea;">${i("regexPatterns")}</label>
        <textarea id="ctl-mute-regexes" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #38444d; border-radius: 4px; font-family: monospace; background-color: #192734; color: #ffffff; box-sizing: border-box; resize: vertical;">${l.muteFilter.regexKeywords.join(`
`)}</textarea>
      </div>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-retweet-enabled" ${l.retweetFilter.enabled?"checked":""}>
          ${i("retweetFilter")}
        </label>
      </h3>
    </div>

    <div style="margin-bottom: 20px; padding-top: 16px; border-top: 1px solid #38444d;">
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ffffff;">
        <label style="cursor: pointer;">
          <input type="checkbox" id="ctl-replace-enabled" ${l.replaceFilter.enabled?"checked":""}>
          ${i("replaceFilter")}
        </label>
      </h3>
      <div style="margin-left: 24px; margin-right: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <label style="display: block; font-weight: bold; color: #e7e9ea;">${i("replacementRules")}</label>
          <button id="ctl-replace-add-btn" style="padding: 4px 12px; background-color: #1d9bf0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            ${i("addRule")}
          </button>
        </div>
        <div id="ctl-replace-table-container" style="max-height: 200px; overflow-y: auto; border: 1px solid #38444d; border-radius: 4px; background-color: #192734; padding: 8px;">
          ${U()}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 8px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #38444d;">
      <button id="ctl-save-btn" style="padding: 10px 24px; background-color: #1d9bf0; color: white; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold;">
        ${i("save")}
      </button>
      <button id="ctl-reset-btn" style="padding: 10px 20px; background-color: #ef4444; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        ${i("reset")}
      </button>
      <button id="ctl-cancel-btn" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 9999px; cursor: pointer;">
        ${i("cancel")}
      </button>
    </div>
  `;const r=e.querySelector("#ctl-save-btn"),o=e.querySelector("#ctl-reset-btn"),n=e.querySelector("#ctl-cancel-btn"),s=e.querySelector("#ctl-replace-add-btn");r?.addEventListener("click",()=>{ve(e),t.remove();}),o?.addEventListener("click",()=>{confirm(i("resetConfirm"))&&(Q(),B(),V(),X(),t.remove(),M.info("設定をリセットしました"),alert(i("resetApplied")));}),n?.addEventListener("click",()=>{t.remove();}),s?.addEventListener("click",()=>{l.replaceFilter.replacements.push({from:"",to:"",isRegex:false}),N(e);});const c=e.querySelector("#ctl-replace-table-container");return c?.addEventListener("click",b=>{const f=b.target;if(f.hasAttribute("data-replace-delete")){const a=Number(f.getAttribute("data-replace-delete"));l.replaceFilter.replacements.splice(a,1),N(e);}}),c?.addEventListener("input",b=>{const f=b.target,a=f.getAttribute("data-replace-index"),d=f.getAttribute("data-replace-field");if(a!==null&&d!==null){const u=Number(a),m=l.replaceFilter.replacements[u];m&&(d==="from"?m.from=f.value:d==="to"?m.to=f.value:d==="isRegex"&&(m.isRegex=f.checked));}}),t.addEventListener("click",b=>{b.target===t&&t.remove();}),t.appendChild(e),t}function N(t){const e=t.querySelector("#ctl-replace-table-container");e&&(e.innerHTML=U());}function X(){const t=document.querySelectorAll(g.article);t.forEach(e=>{delete e.dataset.ctlProcessed,delete e.dataset.ctlReplaced,G(e);}),M.info(`${t.length}件のツイートを再処理しました`);}function ve(t){const e=o=>t.querySelector(`#${o}`)?.checked??false,r=o=>t.querySelector(`#${o}`)?.value??"";l.showPlaceholder=e("ctl-show-placeholder"),l.debugMode=e("ctl-debug-mode"),l.mediaFilter.enabled=e("ctl-media-enabled"),l.mediaFilter.enableOnTimeline=e("ctl-media-timeline"),l.mediaFilter.enableOnLists=e("ctl-media-lists"),l.mediaFilter.enableOnProfile=e("ctl-media-profile"),l.mediaFilter.enableOnSearch=e("ctl-media-search"),l.mediaFilter.enableOnTweetDetail=e("ctl-media-detail"),l.muteFilter.enabled=e("ctl-mute-enabled"),l.muteFilter.stringKeywords=r("ctl-mute-strings").split(`
`).map(o=>o.trim()).filter(o=>o.length>0),l.muteFilter.regexKeywords=r("ctl-mute-regexes").split(`
`).map(o=>o.trim()).filter(o=>o.length>0),l.retweetFilter.enabled=e("ctl-retweet-enabled"),l.replaceFilter.enabled=e("ctl-replace-enabled"),q(),B(),V(),X(),M.info("設定を保存しました"),alert(i("saveApplied"));}const D=p("twitter-clean-timeline");function Fe(){D.info("Twitter Clean Timeline を初期化中..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{H();}):H(),GM_registerMenuCommand(i("settingsMenu"),ye),D.info("初期化完了",{mediaFilter:l.mediaFilter.enabled,muteFilter:l.muteFilter.enabled,retweetFilter:l.retweetFilter.enabled,showPlaceholder:l.showPlaceholder});}Fe();

})();