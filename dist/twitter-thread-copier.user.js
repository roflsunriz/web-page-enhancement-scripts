// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      6.10.0
// @author       roflsunriz
// @description  Copy entire Twitter/X threads with formatting and expansions.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.meta.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @connect      translate.googleapis.com
// @connect      *.googleapis.com
// @connect      t.co
// @connect      *
// @connect      localhost
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const M="[TwitterThreadCopier]",h={log:n=>{console.log(M,n);},error:n=>{console.error(M,n);},warn:(n,t)=>{t?console.warn(M,n,t):console.warn(M,n);}};function ft(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const u=ft();var yt="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",Tt="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",wt="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",bt="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function R(n,t=24){const e=String(t),o=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${n}"></path></svg>`}const T={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},lt="twitter-thread-copier-settings",xt="http://localhost:3002/v1/chat/completions",St="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",vt="https://api.cerebras.ai/v1/chat/completions",Ct="gpt-oss-120b",At="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";function k(){return {localAiEndpoint:xt,localAiSystemPrompt:St,openaiEndpoint:vt,openaiModel:Ct,openaiSystemPrompt:At,openaiApiKey:""}}function N(){try{const n=localStorage.getItem(lt);if(!n)return k();const t=JSON.parse(n),e=k();return {localAiEndpoint:t.localAiEndpoint??e.localAiEndpoint,localAiSystemPrompt:t.localAiSystemPrompt??e.localAiSystemPrompt,openaiEndpoint:t.openaiEndpoint??e.openaiEndpoint,openaiModel:t.openaiModel??e.openaiModel,openaiSystemPrompt:t.openaiSystemPrompt??e.openaiSystemPrompt,openaiApiKey:t.openaiApiKey??e.openaiApiKey}}catch(n){return h.error(`Failed to load settings: ${n.message}`),k()}}function ct(n){try{const t=JSON.stringify(n);localStorage.setItem(lt,t),h.log("Settings saved successfully");}catch(t){h.error(`Failed to save settings: ${t.message}`);}}function Et(){const n=k();return ct(n),n}const Lt=new Set(["ar","ur"]);function It(n){return Lt.has(n)?"rtl":"ltr"}function Pt(n,t){return n.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,o)=>{const r=t[o];return r===void 0?e:String(r)})}function $t(n){const t=Object.keys(n.translations);let e=n.defaultLocale;const o=c=>{const p=c.toLowerCase(),m=n.aliases?.[p];if(m)return m;const f=t.find(g=>g.toLowerCase()===p);if(f)return f;const y=p.split("-")[0];return t.find(g=>g.toLowerCase().split("-")[0]===y)??null},r=()=>{const c=navigator.languages.length>0?navigator.languages:[navigator.language];for(const p of c){const m=o(p);if(m)return m}return n.fallbackLocale},s=c=>{const p=n.translations[e]?.[c];if(p)return p;const m=n.translations[n.fallbackLocale]?.[c];return m||(n.translations[n.defaultLocale]?.[c]??c)};return {locales:t,getLocale:()=>e,setLocale:c=>{e=c;},detectBrowserLocale:r,t:s,format:(c,p)=>Pt(s(c),p),getTranslations:(c=e)=>n.translations[c]??n.translations[n.fallbackLocale],getDirection:(c=e)=>It(c),getMissingTranslationKeys:c=>{const p=n.translations[n.fallbackLocale],m=n.translations[c];return Object.keys(p).filter(f=>!m[f])}}}const Mt={ja:{allMode:"全て",clickToCopy:"クリックしてコピー",collecting:"収集中...",copyEmptyText:"コピーするテキストが空です",copyFailed:"クリップボードへのコピーに失敗しました。",copyFromStart:"{text}からコピー",copyNoData:"コピーするデータがありません (threadData is null)",copyNoText:"コピーするテキストがありません (formattedText is null)",copySelectedTweets:"選択ツイート({count})をコピー",copyThread:"スレッドをコピー",copied:"コピーしました",firstMode:"最初のみ",googleTranslate:"Google翻訳",googleTranslateFailed:"Google翻訳に失敗しました。",internalErrorContent:"処理中に予期せぬエラーが発生しました。",internalErrorTitle:"内部エラー",localAi:"ローカルAI",localAiEmptyResult:"ローカルAIからの翻訳結果が空です。",localAiTranslationComplete:"ローカルAIでの翻訳が完了しました。",openAiCompatible:"OpenAI互換",openAiEndpointMissing:"OpenAI互換 APIエンドポイントが設定されていません。",openAiKeyMissing:"OpenAI互換 APIキーが設定されていません。設定画面から設定してください。",readyContent:"{summary} クリックしてコピーしてください",readyTitle:"準備完了",resetConfirm:"設定をデフォルトに戻しますか？",resetSelection:"選択をリセット",selectTweet:"このツイートを選択",selectedCount:"{count}件選択中",selectedTitle:"選択中 ({order})",selectionAdded:"選択追加",selectionCleared:"選択をすべて解除しました",selectionClearedAll:"選択したツイートをすべて解除しました",selectionErrorContent:"選択したツイートが見つかりませんでした。再度読み込みしてください。",selectionErrorTitle:"選択エラー",selectionRemoved:"選択解除",selectionReset:"選択リセット",settings:"設定",settingsApiEndpoint:"APIエンドポイント",settingsApiKey:"APIキー",settingsApiKeyPlaceholder:"常に必要なので必ず入力してください",settingsCancel:"キャンセル",settingsLocalAi:"ローカルAI設定",settingsModel:"モデル名",settingsOpenAi:"OpenAI互換設定",settingsReset:"リセット",settingsResetContent:"設定をデフォルトに戻しました",settingsResetTitle:"設定リセット",settingsSave:"保存",settingsSavedContent:"設定を保存しました",settingsSavedTitle:"設定保存",settingsSystemPrompt:"システムプロンプト",settingsTitle:"翻訳設定",startPointReset:"起点をリセット",startPointResetContent:"コピー起点をリセットしました",startPointResetTitle:"起点リセット",startPointSetContent:"{author}のツイートを起点に設定しました",startPointSetTitle:"起点設定完了",startPointTitle:"この位置からコピー開始",summaryChars:"文字数: {count}",summaryCopied:"({count}件)をコピーしました。",summaryStartFrom:"{author}のツイートから",summaryThread:"{author}のスレッド",threadCopyFailed:"スレッドのコピーに失敗しました",translatedSuffix:" (翻訳済み)",translating:"翻訳中...",translation:"翻訳",translationErrorContent:"翻訳中にエラーが発生しましたが、原文をコピーできます",translationErrorTitle:"翻訳エラー",translationProvider:"翻訳プロバイダー:",translationToastContent:"翻訳処理を実行しています...",translationToastTitle:"翻訳中",unknownError:"不明なエラー"},en:{allMode:"All",clickToCopy:"Click to copy",collecting:"Collecting...",copyEmptyText:"There is no text to copy",copyFailed:"Failed to copy to the clipboard.",copyFromStart:"Copy from {text}",copyNoData:"There is no data to copy (threadData is null)",copyNoText:"There is no text to copy (formattedText is null)",copySelectedTweets:"Copy selected tweets ({count})",copyThread:"Copy thread",copied:"Copied",firstMode:"First only",googleTranslate:"Google Translate",googleTranslateFailed:"Google Translate failed.",internalErrorContent:"An unexpected error occurred while processing.",internalErrorTitle:"Internal error",localAi:"Local AI",localAiEmptyResult:"Local AI returned an empty translation result.",localAiTranslationComplete:"Local AI translation is complete.",openAiCompatible:"OpenAI-compatible",openAiEndpointMissing:"OpenAI-compatible API endpoint is not configured.",openAiKeyMissing:"OpenAI-compatible API key is not configured. Set it from the settings screen.",readyContent:"{summary} Click to copy.",readyTitle:"Ready",resetConfirm:"Reset settings to defaults?",resetSelection:"Reset selection",selectTweet:"Select this tweet",selectedCount:"{count} selected",selectedTitle:"Selected ({order})",selectionAdded:"Selection added",selectionCleared:"Cleared all selections",selectionClearedAll:"Cleared all selected tweets",selectionErrorContent:"Selected tweets were not found. Reload the page and try again.",selectionErrorTitle:"Selection error",selectionRemoved:"Selection removed",selectionReset:"Selection reset",settings:"Settings",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"Required. Enter a key before using this provider.",settingsCancel:"Cancel",settingsLocalAi:"Local AI settings",settingsModel:"Model name",settingsOpenAi:"OpenAI-compatible settings",settingsReset:"Reset",settingsResetContent:"Settings were reset to defaults",settingsResetTitle:"Settings reset",settingsSave:"Save",settingsSavedContent:"Settings were saved",settingsSavedTitle:"Settings saved",settingsSystemPrompt:"System prompt",settingsTitle:"Translation Settings",startPointReset:"Reset start point",startPointResetContent:"The copy start point was reset",startPointResetTitle:"Start point reset",startPointSetContent:"Set {author}'s tweet as the start point",startPointSetTitle:"Start point set",startPointTitle:"Start copying from here",summaryChars:"Characters: {count}",summaryCopied:"Copied {count} tweet(s).",summaryStartFrom:"From {author}'s tweet, ",summaryThread:"{author}'s thread",threadCopyFailed:"Failed to copy the thread",translatedSuffix:" (translated)",translating:"Translating...",translation:"Translate",translationErrorContent:"Translation failed, but you can still copy the original text",translationErrorTitle:"Translation error",translationProvider:"Translation provider:",translationToastContent:"Running translation...",translationToastTitle:"Translating",unknownError:"Unknown error"}},P=$t({translations:Mt,defaultLocale:"ja",fallbackLocale:"en"});P.setLocale(P.detectBrowserLocale());const v=P.format,O=P.getDirection,d=P.t,E={LOADING:R(bt),CLIPBOARD:R(yt),COPY:R(wt),SETTINGS:R(Tt)};class Rt{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;settingsModal=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),h.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style"),e=T.article;t.textContent=`
      .floating-ui-container {
          position: fixed;
          bottom: 100px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          z-index: 9999;
          pointer-events: none;
          user-select: none;
      }
      .floating-ui-container.has-custom-position {
          bottom: auto;
          right: auto;
      }
      .floating-ui-container.dragging {
          cursor: grabbing;
      }
      .floating-ui-container > * {
          pointer-events: auto;
      }
      .copy-thread-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #1DA1F2; /* Twitter Blue */
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 3;
          position: relative;
          touch-action: none;
      }
      .copy-thread-button:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
      .copy-thread-button.dragging {
          cursor: grabbing;
      }
      .copy-thread-button:not(.dragging) {
          cursor: grab;
      }
      .copy-thread-button.success { background-color: #4CAF50; }
      .copy-thread-button.ready {
          background-color: #FFC400;
          box-shadow: 0 4px 18px rgba(255, 196, 0, 0.55);
          animation: copy-ready-pulse 1.8s ease-in-out infinite;
      }
      .copy-thread-button.ready::after {
          content: "";
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(255, 232, 124, 0.0);
          box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          opacity: 0.7;
          pointer-events: none;
          animation: copy-ready-wave 1.8s ease-out infinite;
      }
      .copy-thread-button.loading svg { animation: spinning 1.5s linear infinite; }
      .copy-thread-button svg { display: block; }
      .control-panel-container {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          pointer-events: auto;
          order: 1;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
      }
      .control-panel-container.hover-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(8px);
      }
      .floating-ui-container.show-hover-controls .control-panel-container.hover-hidden {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
      }
      .control-panel-container select, .control-panel-container input { margin-left: 8px; transform: scale(0.96); }
      .control-panel-container label { display: flex; align-items: center; white-space: nowrap; }
      .control-panel-container select { background-color: #333; color: white; border: 1px solid #666; border-radius: 4px; padding: 2px 4px; }
      .copy-thread-button .text {
          position: absolute;
          font-size: 12px;
          white-space: nowrap;
          top: -25px;
          background-color: #333;
          padding: 3px 8px;
          border-radius: 4px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
      }
      .copy-thread-button:hover .text { opacity: 1; visibility: visible; }
      @keyframes spinning { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes copy-ready-pulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(255, 196, 0, 0.45); }
          50% { box-shadow: 0 6px 24px rgba(255, 196, 0, 0.65); }
      }
      @keyframes copy-ready-wave {
          0% {
              transform: scale(1);
              opacity: 0.7;
              box-shadow: 0 0 0 0 rgba(255, 232, 124, 0.45);
          }
          70% {
              transform: scale(1.55);
              opacity: 0;
              box-shadow: 0 0 0 18px rgba(255, 232, 124, 0);
          }
          100% {
              transform: scale(1.6);
              opacity: 0;
              box-shadow: 0 0 0 20px rgba(255, 232, 124, 0);
          }
      }
      .copy-toast {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.3s ease;
          pointer-events: none;
          order: 0;
          position: absolute;
          bottom: calc(100% + 12px);
          right: 0;
          will-change: transform, opacity;
      }
      .copy-toast.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
      }
      .toast-title { font-weight: bold; margin-bottom: 5px; }
      .toast-content { font-size: 13px; opacity: 0.9; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
      .start-point-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.1);
          border: 2px solid #1DA1F2;
          color: #1DA1F2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: auto;
          font-size: 14px;
          font-weight: bold;
      }
      ${e}:hover .start-point-button { opacity: 1; }
      .start-point-button:hover { background-color: rgba(29, 161, 242, 0.2); transform: scale(1.1); }
      .start-point-button.active { background-color: #1DA1F2; color: white; opacity: 1; }
      .start-point-button.active:hover { background-color: #1991DB; }
      ${e}.start-point-set { background-color: rgba(29, 161, 242, 0.05); border: 1px solid rgba(29, 161, 242, 0.2); border-radius: 8px; }
      .select-tweet-button {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.08);
          border: 2px solid rgba(29, 161, 242, 0.4);
          color: #1DA1F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          pointer-events: auto;
          opacity: 0;
          transition: all 0.3s ease;
      }
      ${e}:hover .select-tweet-button { opacity: 1; }
      .select-tweet-button:hover { transform: scale(1.1); }
      .select-tweet-button.active {
          background-color: #1DA1F2;
          color: white;
          border-color: #1DA1F2;
          opacity: 1;
      }
      ${e}.tweet-selected {
          background-color: rgba(29, 161, 242, 0.04);
          border: 1px solid rgba(29, 161, 242, 0.3);
          border-radius: 8px;
      }
      ${e}.tweet-selected.start-point-set {
          box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.12);
      }
      .reset-selection {
          padding: 8px 12px;
          background-color: #5e72e4;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 1;
      }
      .reset-selection.visible { opacity: 1; visibility: visible; }
      .reset-selection:hover { background-color: #4b5cd5; transform: scale(1.05); }
      .reset-start-point {
          padding: 8px 12px;
          background-color: #ff6b6b;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: auto;
          order: 2;
      }
      .reset-start-point.visible { opacity: 1; visibility: visible; }
      .reset-start-point:hover { background-color: #ff5252; transform: scale(1.05); }
      .control-panel-container .settings-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(29, 161, 242, 0.15);
          border: 1px solid rgba(29, 161, 242, 0.5);
          color: #1DA1F2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 4px;
      }
      .control-panel-container .settings-button:hover {
          background-color: rgba(29, 161, 242, 0.3);
          transform: scale(1.05);
          border-color: #1DA1F2;
      }
      .control-panel-container .settings-button svg {
          width: 18px;
          height: 18px;
      }
      .settings-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: none;
      }
      .settings-modal-overlay.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
      }
      .settings-modal {
          background-color: #1e1e1e;
          color: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          transform: scale(0.9);
          transition: transform 0.3s ease;
      }
      .settings-modal-overlay.visible .settings-modal {
          transform: scale(1);
      }
      .settings-modal h2 {
          margin: 0 0 20px 0;
          font-size: 24px;
          color: #1DA1F2;
      }
      .settings-modal h3 {
          margin: 16px 0 8px 0;
          font-size: 18px;
          color: #1DA1F2;
          border-bottom: 1px solid #333;
          padding-bottom: 4px;
      }
      .settings-modal label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #ccc;
      }
      .settings-modal input[type="text"],
      .settings-modal textarea {
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 16px;
          background-color: #2a2a2a;
          border: 1px solid #444;
          border-radius: 6px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
      }
      .settings-modal textarea {
          min-height: 80px;
          resize: vertical;
          font-family: monospace;
      }
      .settings-modal input[type="text"]:focus,
      .settings-modal textarea:focus {
          outline: none;
          border-color: #1DA1F2;
      }
      .settings-modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
      }
      .settings-modal button {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
      }
      .settings-modal .btn-save {
          background-color: #1DA1F2;
          color: white;
      }
      .settings-modal .btn-save:hover {
          background-color: #1991DB;
      }
      .settings-modal .btn-reset {
          background-color: #ff6b6b;
          color: white;
      }
      .settings-modal .btn-reset:hover {
          background-color: #ff5252;
      }
      .settings-modal .btn-cancel {
          background-color: #444;
          color: white;
      }
      .settings-modal .btn-cancel:hover {
          background-color: #555;
      }
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),u.selectedTweetIds=[],h.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll(T.article).forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let o=Array.from(t.children).find(r=>r.classList.contains("select-tweet-button"));o?o.dataset.tweetId||(o.dataset.tweetId=e):(o=document.createElement("button"),o.type="button",o.className="select-tweet-button",o.textContent="+",o.title=d("selectTweet"),o.dataset.tweetId=e,o.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(o));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;u.selectedTweetIds.forEach((e,o)=>{t.set(e,o+1);}),document.querySelectorAll(T.article).forEach(e=>{const o=this.extractTweetId(e);if(!o)return;const r=e.querySelector(".select-tweet-button");if(r)if(t.has(o)){const s=t.get(o)??0;e.classList.add("tweet-selected"),r.classList.add("active"),r.textContent=s>0?s.toString():"✓",r.title=v("selectedTitle",{order:String(s)});}else e.classList.remove("tweet-selected"),r.classList.remove("active"),r.textContent="+",r.title=d("selectTweet");}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const o=u.selectedTweetIds.includes(e);o?u.selectedTweetIds=u.selectedTweetIds.filter(i=>i!==e):u.selectedTweetIds=[...u.selectedTweetIds,e],u.isSecondStage&&(u.isSecondStage=false),u.collectedThreadData=null;const r=u.selectedTweetIds.length,s=r>0?v("selectedCount",{count:String(r)}):d("selectionCleared");this.refreshSelectionIndicators(),this.updateMainButtonText(),o?this.showToast(d("selectionRemoved"),s):this.showToast(d("selectionAdded"),s),h.log(`Selected tweet ids: ${u.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");u.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent=d("resetSelection"),t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){u.selectedTweetIds.length!==0&&(u.selectedTweetIds=[],u.isSecondStage&&(u.isSecondStage=false),u.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast(d("selectionReset"),d("selectionClearedAll")),h.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">${d("allMode")}</option>
      <option value="first">${d("firstMode")}</option>
      <option value="shitaraba">4K(shitaraba)</option>
      <option value="5ch">2K(5ch)</option>
    `,e.value=u.copyMode,e.addEventListener("change",p=>{u.copyMode=p.target.value,h.log(`Copy mode changed to: ${u.copyMode}`);}),t.appendChild(e);const o=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.id="translate-checkbox",r.checked=u.translateEnabled,r.addEventListener("change",p=>{u.translateEnabled=p.target.checked,h.log(`Translation ${u.translateEnabled?"enabled":"disabled"}`);}),o.appendChild(r),o.appendChild(document.createTextNode(d("translation"))),t.appendChild(o);const s=document.createElement("label");s.textContent=d("translationProvider");const i=document.createElement("select");i.id="provider-select",i.innerHTML=`
      <option value="local">${d("localAi")}</option>
      <option value="google">${d("googleTranslate")}</option>
      <option value="openai">${d("openAiCompatible")}</option>
    `;const a=localStorage.getItem("translationProvider");a==="local"||a==="google"||a==="openai"?i.value=a:i.value="local",i.addEventListener("change",p=>{const m=p.target.value;localStorage.setItem("translationProvider",m),h.log(`Translation provider set to ${m}`);});const l=document.createElement("div");l.appendChild(s),l.appendChild(i),t.appendChild(l);const c=document.createElement("button");c.className="settings-button",c.type="button",c.title=d("settings"),c.innerHTML=E.SETTINGS,c.addEventListener("click",()=>this.showSettingsModal()),t.appendChild(c),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),h.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title=d("copyThread"),e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}u.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),h.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(u.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">${d("collecting")}</span>${E.LOADING}`;return}if(u.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">${d("translating")}</span>${E.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),u.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">${d("clickToCopy")}</span>${E.CLIPBOARD}`;return}const e=u.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">${v("copySelectedTweets",{count:String(e)})}</span>${E.COPY}`;return}if(u.startFromTweetId){const o=u.startFromTweetText.length>20?u.startFromTweetText.substring(0,20)+"...":u.startFromTweetText;t.innerHTML=`<span class="text">${v("copyFromStart",{text:this.escapeHtml(o)})}</span>${E.COPY}`;return}t.innerHTML=`<span class="text">${d("copyThread")}</span>${E.COPY}`;}showToast(t,e){let o=this.querySelector(".copy-toast");o||(o=document.createElement("div"),o.className="copy-toast",this.appendChild(o)),o.innerHTML=`
      <div class="toast-title">${this.escapeHtml(t)}</div>
      <div class="toast-content">${this.escapeHtml(e.substring(0,100))}</div>
    `,o.dir=O(),o.classList.remove("visible"),setTimeout(()=>{o?.classList.add("visible"),setTimeout(()=>{o?.classList.remove("visible"),setTimeout(()=>o?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll(T.article).forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const o=this.extractTweetId(t);if(!o)return;const r=document.createElement("button");r.className="start-point-button",r.textContent="★",r.title=d("startPointTitle"),r.dataset.tweetId=o,u.startFromTweetId===o&&(r.classList.add("active"),r.textContent="✓",t.classList.add("start-point-set")),r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,o);}),t.appendChild(r);});}setStartPoint(t,e){u.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const o=t.querySelector(T.userName)?.innerText??"",r=t.querySelector(T.tweetText)?.innerText??"";u.startFromTweetId=e,u.startFromTweetAuthor=o,u.startFromTweetText=r,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast(d("startPointSetTitle"),v("startPointSetContent",{author:o})),h.log(`Start point set: ${e} by ${o}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");u.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent=d("startPointReset"),t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){u.startFromTweetId=null,u.startFromTweetAuthor="",u.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast(d("startPointResetTitle"),d("startPointResetContent")),h.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const o=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},r=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,o();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const l=a.relatedTarget;l&&t.contains(l)||r();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",o),t.addEventListener("focusout",a=>{const l=a.relatedTarget;l&&t.contains(l)||r();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return h.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",o=>{if(!o.isPrimary)return;const r=this.ensureFloatingContainer(),s=r.getBoundingClientRect();this.dragState={pointerId:o.pointerId,startX:o.clientX,startY:o.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},r.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(o.pointerId);}catch(i){h.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",o=>{if(!this.dragState||o.pointerId!==this.dragState.pointerId)return;const r=this.floatingContainer;if(!r)return;const s=o.clientX-this.dragState.startX,i=o.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,r.classList.add("has-custom-position"),r.style.bottom="auto",r.style.right="auto";}const a=this.dragState.initialTop+i,l=this.dragState.initialLeft+s,{top:c,left:p}=this.clampPosition(a,l,r);this.applyPosition(c,p,r);});const e=o=>{!this.dragState||o.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(o.pointerId)&&t.releasePointerCapture(o.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,o){const s=o.offsetHeight||0,i=o.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),l=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),l)}}applyPosition(t,e,o){const r=o??this.ensureFloatingContainer();r.style.top=`${t}px`,r.style.left=`${e}px`,r.style.bottom="auto",r.style.right="auto",r.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(h.warn("stored position is invalid",e),null)}catch(t){return h.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){h.warn("failed to save UI position",t);}}showSettingsModal(){if(this.settingsModal){this.settingsModal.classList.add("visible");return}const t=document.createElement("div");t.className="settings-modal-overlay",t.dir=O();const e=document.createElement("div");e.className="settings-modal",e.dir=O();const o=N();if(e.innerHTML=`
      <h2>${d("settingsTitle")}</h2>
      
      <h3>${d("settingsLocalAi")}</h3>
      <label>${d("settingsApiEndpoint")}</label>
      <input type="text" id="local-ai-endpoint" value="${this.escapeHtml(o.localAiEndpoint)}" />
      
      <label>${d("settingsSystemPrompt")}</label>
      <textarea id="local-ai-system-prompt">${this.escapeHtml(o.localAiSystemPrompt)}</textarea>
      
      <h3>${d("settingsOpenAi")}</h3>
      <label>${d("settingsApiEndpoint")}</label>
      <input type="text" id="openai-endpoint" value="${this.escapeHtml(o.openaiEndpoint)}" />
      
      <label>${d("settingsModel")}</label>
      <input type="text" id="openai-model" value="${this.escapeHtml(o.openaiModel)}" />
      
      <label>${d("settingsSystemPrompt")}</label>
      <textarea id="openai-system-prompt">${this.escapeHtml(o.openaiSystemPrompt)}</textarea>
      
      <label>${d("settingsApiKey")}</label>
      <input type="text" id="openai-api-key" value="${this.escapeHtml(o.openaiApiKey)}" placeholder="${d("settingsApiKeyPlaceholder")}" />
      
      <div class="settings-modal-buttons">
        <button class="btn-reset" type="button">${d("settingsReset")}</button>
        <button class="btn-cancel" type="button">${d("settingsCancel")}</button>
        <button class="btn-save" type="button">${d("settingsSave")}</button>
      </div>
    `,t.appendChild(e),!this.shadowRoot)return;this.shadowRoot.appendChild(t),this.settingsModal=t;const r=e.querySelector(".btn-save"),s=e.querySelector(".btn-cancel"),i=e.querySelector(".btn-reset");r&&r.addEventListener("click",()=>{const a={localAiEndpoint:e.querySelector("#local-ai-endpoint")?.value??o.localAiEndpoint,localAiSystemPrompt:e.querySelector("#local-ai-system-prompt")?.value??o.localAiSystemPrompt,openaiEndpoint:e.querySelector("#openai-endpoint")?.value??o.openaiEndpoint,openaiModel:e.querySelector("#openai-model")?.value??o.openaiModel,openaiSystemPrompt:e.querySelector("#openai-system-prompt")?.value??o.openaiSystemPrompt,openaiApiKey:e.querySelector("#openai-api-key")?.value??o.openaiApiKey};ct(a),this.hideSettingsModal(),this.showToast(d("settingsSavedTitle"),d("settingsSavedContent"));}),s&&s.addEventListener("click",()=>{this.hideSettingsModal();}),i&&i.addEventListener("click",()=>{confirm(d("resetConfirm"))&&(Et(),this.hideSettingsModal(),this.showToast(d("settingsResetTitle"),d("settingsResetContent")));}),t.addEventListener("click",a=>{a.target===t&&this.hideSettingsModal();}),requestAnimationFrame(()=>{t.classList.add("visible");}),h.log("Settings modal opened");}hideSettingsModal(){this.settingsModal&&(this.settingsModal.classList.remove("visible"),setTimeout(()=>{this.settingsModal?.remove(),this.settingsModal=null;},300),h.log("Settings modal closed"));}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}const x=new Rt;var kt=typeof GM_notification<"u"?GM_notification:void 0,Ut=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const qt=Ut;function _t(n,t,e,o){kt({text:n,title:t,image:e,onclick:o});}const Nt="https://twitter.com",Ft="https://t.co",Ot="https://video.twimg.com",V=n=>`${Nt}/i/status/${n}`,Ht=n=>`${Ot}/tweet_video/${n}.mp4`,Dt=/https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/,Bt=`${Ft}/`,Gt="https://translate.googleapis.com/translate_a/single";async function zt(){try{const n=[],t=new Set;let e="",o="";const r=window.location.href,s=u.copyMode==="first";let i=!1;const a=window.scrollY;async function l(){if(i)return;const p=Array.from(document.querySelectorAll(T.article));p.length>0&&!e&&(e=Y(p[0]),o=K(p[0]));for(const m of p){const f=m.querySelector(T.statusLink);if(!f)continue;const y=f.href.split("/"),g=y.indexOf("status");if(g===-1||g+1>=y.length)continue;const w=y[g+1].split("?")[0];if(t.has(w))continue;const b=Y(m);if(e&&b!==e)continue;let S=K(m);b===e&&!S&&o&&(S=o);const $=m.querySelector(T.tweetText);let B="";$&&(B=await dt($));const G=m.querySelector("time"),z=G?G.getAttribute("datetime"):"",F=z?new Date(z):null,W=F?.getTime()??0,pt=F&&Number.isFinite(W)?jt(F):"",ht=Vt(m),gt=await Wt(m),mt=t.size===0?r:f.href?f.href.split("?")[0]:"";if(n.push({id:w,author:b,handle:S,text:B,time:pt,timestampMs:W,url:mt,mediaUrls:ht,quotedTweet:gt}),t.add(w),s){i=!0;break}}}async function c(){try{if(await J(),await l(),i)return;let f=n.length,y=0;for(let g=0;g<30;g++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(w=>setTimeout(w,700)),await J(),await l(),i)return;if(n.length===f){if(y++,y>=3)break}else f=n.length,y=0;}catch(w){h.error(`スクロール処理エラー (試行 ${g+1}): ${w.message}`);continue}try{window.scrollTo(0,a);}catch(g){h.error(`スクロール位置復元エラー: ${g.message}`);}}catch(f){throw h.error(`スクロール収集処理エラー: ${f.message}`),f}}return await c(),n.sort((p,m)=>p.timestampMs-m.timestampMs),n}catch(n){return h.error(`ツイート収集中にエラーが発生: ${n.message}`),h.error(`エラースタック: ${n.stack}`),[]}}function K(n){try{const e=Array.from(n.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const o=Array.from(n.querySelectorAll(T.userLink));for(const s of o)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const r=n.querySelector(T.userName);if(r){const s=r.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return h.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function Y(n){try{const t=n.querySelector(T.userNameLinkSpan);return t&&t.textContent?t.textContent.trim():""}catch(t){return h.error(`ユーザー名取得エラー: ${t.message}`),""}}async function Wt(n){const t=n.querySelector(T.quotedLink);let e=null;if(t)try{const o=t.closest(T.roleLink);o&&(e=await X(o));}catch(o){h.error(`引用ツイート取得エラー: ${o.message}`);}else try{const o=n.innerText||"",r=o.includes("引用")||o.includes("Quote")||o.includes("quote"),s=n.querySelectorAll(T.roleLink);if(s.length>0&&r)for(let i=0;i<s.length;i++){const a=s[i],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const c=await X(a);if(c&&c.author&&c.text){e=c;break}}catch(c){h.error(`代替引用ツイート抽出エラー: ${c.message}`);}}}catch(o){h.error(`代替引用ツイート検索エラー: ${o.message}`);}return e}async function X(n){const t=n.querySelector(T.quotedAuthor),e=t?t.textContent.trim():"",o=n.querySelector(T.quotedHandle),r=o?o.textContent.trim():"";let s="";const i=n.querySelector(T.tweetText);if(i)s=await dt(i);else {const y=(n.innerText||"").split(`
`).map(b=>b.trim()).filter(b=>b);let g=-1;for(let b=0;b<y.length;b++)if(y[b].includes(r)){g=b;break}const w=g+1;g>=0&&w<y.length&&(s=y.slice(w+1).join(`
`));}const a=[];n.querySelectorAll(T.tweetPhoto).forEach(f=>{const y=f.querySelector(T.tweetMediaImage);if(y){const g=L(y.src);g&&!a.includes(g)&&a.push(g);}}),a.length===0&&(n.querySelectorAll(T.roleGroup).forEach(g=>{g.querySelectorAll(T.tweetMediaImage).forEach(b=>{const S=L(b.src);S&&!a.includes(S)&&a.push(S);});}),n.querySelectorAll(T.tweetMediaImage).forEach(g=>{const w=L(g.src);w&&!a.includes(w)&&a.push(w);}));let c="",p="";const m=n.querySelectorAll(T.statusLink);for(const f of Array.from(m)){const y=f.href;if(y&&y.includes("/status/")){const g=y.split("/"),w=g.indexOf("status");if(w!==-1&&w+1<g.length){c=g[w+1].split("?")[0],p=y;break}}}return e&&s?{author:e,handle:r,text:s,id:c,url:p,mediaUrls:a}:null}function Vt(n){const t=[];return n.querySelectorAll(T.tweetPhoto).forEach(r=>{const s=r.querySelector(T.tweetMediaImage);if(s){const i=L(s.src);i&&!t.includes(i)&&t.push(i);}}),n.querySelectorAll("video").forEach(r=>{if(r.src&&r.src.startsWith("blob:"))try{if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=j(r.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=n.querySelector(T.statusLink);if(i){const a=i.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const c=a[l+1].split("?")[0],p=V(c);t.includes(p)||t.push(`[動画] ${p}`);}}}catch(i){h.error("Error processing blob URL: "+i);}else {if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=j(r.poster);i&&!t.includes(i)&&t.push(i);}r.src&&r.src.includes("video.twimg.com")&&(t.includes(r.src)||t.push(r.src));}r.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=n.querySelector(T.statusLink);if(a){const l=a.href.split("/"),c=l.indexOf("status");if(c!==-1&&c+1<l.length){const p=l[c+1].split("?")[0],m=V(p);t.includes(m)||t.push(`[動画] ${m}`);}}}});}),t.length===0&&n.querySelectorAll(T.roleGroup).forEach(s=>{s.querySelectorAll(T.tweetMediaImage).forEach(a=>{const l=L(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&n.querySelectorAll(T.tweetMediaImage).forEach(s=>{const i=L(s.src);i&&!t.includes(i)&&t.push(i);}),t}function L(n){if(!n||typeof n!="string"||!n.includes("pbs.twimg.com/media"))return null;try{const t=n.match(/format=([^&]+)/),e=t?t[1]:"jpg",o=n.split("?")[0];if(!o||o.length===0)return h.error(`無効なベースURL: ${n}`),null;const r=o+"."+e;try{return new URL(r),r}catch(s){return h.error(`無効なURL形式: ${r}, エラー内容: ${s.message}`),null}}catch(t){return h.error(`メディアURL処理エラー: ${t.message}`),null}}function j(n){if(!n||!n.includes("tweet_video_thumb"))return null;try{const t=n.match(/tweet_video_thumb\/([^.]+)/);if(!t||!t[1])return null;const e=t[1];return Ht(e)}catch(t){return h.error(`動画URL生成エラー: ${t.message}`),null}}async function dt(n){try{const t=n.cloneNode(!0);return await Kt(t)}catch(t){return h.error(`ツイートテキスト取得エラー: ${t.message}`),n.innerText??""}}async function Kt(n){const t=Array.from(n.querySelectorAll("a[href]")),e=[];for(const o of t){const r=o.textContent??"";if(Xt(o,r)){const s=r.trim();if(/^https?:\/\//i.test(s)){e.push(Promise.resolve({anchor:o,resolvedUrl:s}));continue}const i=o.href;i&&i.startsWith(Bt)&&e.push(Yt(i).then(a=>({anchor:o,resolvedUrl:a})));}}if(e.length>0){const o=await Promise.all(e);for(const{anchor:r,resolvedUrl:s}of o)if(s){const i=document.createTextNode(s);r.replaceWith(i);}}return n.innerText}function Yt(n){return new Promise(t=>{qt({method:"HEAD",url:n,timeout:1e4,onload:e=>{t(e.finalUrl||n);},onerror:()=>{t(n);},ontimeout:()=>{t(n);}});})}function Xt(n,t){const e=t.trim();return /^https?:\/\//i.test(e)?true:/^https?:\/\//i.test(n.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function J(){try{const n=document.querySelectorAll(T.tweetButtonsWithinArticle);let t=0;for(const e of Array.from(n))try{const o=e.textContent?e.textContent.trim():"";(o==="さらに表示"||o==="Show more"||o.match(/もっと見る/i)||o.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest(T.tweetRoot)&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(o){h.error(`個別ツイート展開エラー: ${o.message}`);continue}return t}catch(n){return h.error(`ツイート展開処理エラー: ${n.message}`),0}}function jt(n,t=new Date){const e=n.getFullYear(),o=String(n.getMonth()+1).padStart(2,"0"),r=String(n.getDate()).padStart(2,"0"),s=String(n.getHours()).padStart(2,"0"),i=String(n.getMinutes()).padStart(2,"0");return `${e}年${o}月${r}日 ${s}:${i} (${Jt(n,t)})`}function Jt(n,t){const e=t.getTime()-n.getTime(),o=e>=0?"前":"後",r=Math.floor(Math.abs(e)/6e4);if(r<1)return e>=0?"たった今":"1分未満後";const s=r%60,i=Math.floor(r/60),a=i%24,l=Math.floor(i/24),c=l%30,p=Math.floor(l/30),m=p%12,f=Math.floor(p/12);return f>0?m>0?`${f}年${m}か月${o}`:`${f}年${o}`:p>0?c>0?`${p}か月${c}日${o}`:`${p}か月${o}`:l>0?a>0?`${l}日${a}時間${o}`:`${l}日${o}`:i>0?s>0?`${i}時間${s}分${o}`:`${i}時間${o}`:`${r}分${o}`}const Z=150,Zt=.9144,Qt=.453592,te=3.78541,q="[0-9０-９]",ee=`${q}{1,3}(?:[,，]${q}{3})*`,ne=`${q}+`,oe=`(?:[\\.．]${q}+)?`,Q=`(?:${ee}|${ne})${oe}`,tt="(?:兆|億|万)",A=`${Q}(?:${tt}${Q})*${tt}?`,re=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${A})\\s*(?<currencyPrefix>米|US|ＵＳ)?ドル`,"gu"),ie=new RegExp(`(?<symbol>(?:US\\$|ＵＳ\\$|\\$))\\s*(?<amount>${A})(?!\\s*(?:米|US|ＵＳ)?ドル)`,"gu"),se=new RegExp(`(?<amount>${A})\\s*ヤード`,"gu"),ae=new RegExp(`(?<amount>${A})\\s*ポンド`,"gu"),le=new RegExp(`(?<amount>${A})\\s*ガロン`,"gu"),ce=new RegExp(`(?<amount>${A})\\s*(?<unit>(?:[kKｋＫmMｍＭgGｇＧtTｔＴ]?[wWｗＷ]|(?:キロ|メガ|ギガ|テラ)ワット))(?![A-Za-zａ-ｚＡ-Ｚ])`,"gu"),de=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${A})\\s*(?<unit>[kKｋＫmMｍＭgGｇＧtTｔＴbBｂＢ])(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu"),ue=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${A})\\s*(?<unit>ミリオン|ビリオン|トリリオン|キロ|メガ|ギガ|テラ|million|Million|billion|Billion|trillion|Trillion|kilo|Kilo|mega|Mega|giga|Giga|tera|Tera)(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu");function pe(n){if(!n||n.length===0)return n;let t=n;return t=C(t,re,["円","JPY"],e=>nt(e*Z)),t=C(t,ie,["円","JPY"],e=>nt(e*Z)),t=C(t,se,["メートル","m","ｍ"],e=>`${H(e*Zt)}メートル`),t=C(t,ae,["キログラム","kg","㎏","キロ"],e=>`${H(e*Qt)}キログラム`),t=C(t,le,["リットル","l","L","ℓ"],e=>`${H(e*te)}リットル`),t=C(t,ce,["ワット","W","w","Ｗ","ｗ"],(e,o,r)=>{const s=o.unit??"";if(we(r))return null;const i=Te(s);if(i===null)return null;const a=e*i;return U(a,"ワット")}),t=C(t,de,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=ot(s);return i===null||et(s,r)?null:U(e*i)}),t=C(t,ue,["万","億","兆"],(e,o,r)=>{const s=o.unit??"",i=ot(s);return i===null||et(s,r)?null:U(e*i)}),t}function C(n,t,e,o){const r=[...n.matchAll(t)];if(r.length===0)return n;let s="",i=0;for(const a of r){const l=a.index??0,c=l+a[0].length,p=n.slice(i,l);s+=p;const m=a.groups??{},f=m.amount??"",y=fe(f),g=he(n,c);if(y===null){s+=a[0],g?(s+=g.whitespace+g.openChar+g.inside+g.closeChar,i=g.endIndex):i=c;continue}if(g&&e.some(S=>g.inside.includes(S))){s+=a[0],s+=g.whitespace+g.openChar+g.inside+g.closeChar,i=g.endIndex;continue}const b=o(y,m,{text:n,match:a,startIndex:l,endIndex:c,followingParentheses:g});if(b===null){s+=a[0],g?(s+=g.whitespace+g.openChar+g.inside+g.closeChar,i=g.endIndex):i=c;continue}if(g){const S=g.inside.trim(),$=S.length>0?`${b}、${S}`:b;s+=a[0]+g.whitespace+g.openChar+$+g.closeChar,i=g.endIndex;}else s+=`${a[0]}（${b}）`,i=c;}return s+=n.slice(i),s}function he(n,t){let e=t,o="";for(;e<n.length;){const l=n[e];if(me(l)){o+=l,e+=1;continue}break}if(e>=n.length)return null;const r=n[e];if(r!=="("&&r!=="（")return null;const s=r==="("?")":"）",i=ge(n,e,r,s);if(i===-1)return null;const a=n.slice(e+1,i);return {whitespace:o,openChar:r,closeChar:s,inside:a,endIndex:i+1}}function ge(n,t,e,o){let r=0;for(let s=t;s<n.length;s+=1){const i=n[s];if(i===e)r+=1;else if(i===o&&(r-=1,r===0))return s}return  -1}function me(n){return /\s/u.test(n)}function et(n,t){if(!be(n))return  false;const e=t.text.slice(t.endIndex,t.endIndex+6);return /^(?:バイト|ビット|ヘルツ|メートル|リットル|グラム|ワット|ジュール|パスカル|ボルト|アンペア)/u.test(e)}function fe(n){if(!n)return null;const t=n.replace(/[０-９]/gu,a=>String.fromCharCode(a.charCodeAt(0)-65248)).replace(/[，]/gu,",").replace(/[．]/gu,".").replace(/,/gu,"").replace(/\s+/gu,"");if(t.length===0)return null;const e=/(\d+(?:\.\d+)?)(兆|億|万)?/gu;let o=0,r=false,s=null,i;for(;(i=e.exec(t))!==null;){if(i[0].length===0)continue;const a=Number.parseFloat(i[1]);if(Number.isNaN(a))return null;r=true;const l=i[2];l?o+=a*ye(l):s=a;}return r?(s!==null&&(o+=s),o):null}function ye(n){switch(n){case "万":return 1e4;case "億":return 1e8;case "兆":return 1e12;default:return 1}}function U(n,t=""){const e=Math.abs(n),o=[{threshold:1e12,divisor:1e12,suffix:`兆${t}`},{threshold:1e8,divisor:1e8,suffix:`億${t}`},{threshold:1e4,divisor:1e4,suffix:`万${t}`}];for(const r of o)if(e>=r.threshold){const s=n/r.divisor;return `${I(s)}${r.suffix}`}return t.length>0?`${I(n)}${t}`:I(n)}function nt(n){return U(n,"円")}function H(n){return Math.abs(n)<1?I(n,3):I(n,2)}function I(n,t){const e=Math.abs(n);let o=t;o===void 0&&(e>=100?o=0:e>=10?o=1:e>=1?o=2:o=3);const r=Number.isFinite(n)?Number.parseFloat(n.toFixed(o)):0;return new Intl.NumberFormat("ja-JP",{maximumFractionDigits:o,minimumFractionDigits:0}).format(r)}function Te(n){if(!n)return null;const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\s+/gu,"");if(t.length===0)return null;const e=t.toUpperCase(),o=t[0];if(e==="KW"&&(o==="K"||o==="k"))return 1e3;if(e==="MW"&&o==="M")return 1e6;if(e==="GW"&&o==="G")return 1e9;if(e==="TW"&&o==="T")return 1e12;if(e==="W"&&(o==="W"||o==="w"))return 1;switch(t){case "ワット":return 1;case "キロワット":return 1e3;case "メガワット":return 1e6;case "ギガワット":return 1e9;case "テラワット":return 1e12;default:return null}}function we(n){return n.text.slice(n.endIndex,n.endIndex+1)==="時"}function ot(n){switch(n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase()){case "k":case "kilo":case "キロ":return 1e3;case "m":case "mega":case "million":case "ミリオン":case "メガ":return 1e6;case "b":case "billion":case "g":case "giga":case "ビリオン":case "ギガ":return 1e9;case "t":case "tera":case "trillion":case "テラ":case "トリリオン":return 1e12;default:return null}}function be(n){const t=n.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase();return t==="k"||t==="kilo"||t==="キロ"||t==="m"||t==="mega"||t==="メガ"||t==="g"||t==="giga"||t==="ギガ"||t==="t"||t==="tera"||t==="テラ"}const xe=Gt,Se=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function ve(){const n=localStorage.getItem("translationProvider");return n==="local"||n==="google"||n==="openai"?n:"local"}async function Ce(n){const t=n.map(ke),e=t.map(i=>({tweet:i,textSegments:st(i.text),quotedSegments:i.quotedTweet?st(i.quotedTweet.text):null})),o=[];let r=false;for(const i of e){for(const a of i.textSegments)rt(a,o);if(i.quotedSegments)for(const a of i.quotedSegments)rt(a,o);}if(o.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<o.length;i++){const a=o[i];try{const{text:c,provider:p}=await Ie(a.original),m=p==="none"?c:pe(c);a.translated=m,p==="local"&&(r=!0),!s&&m!==a.original&&(s=!0);}catch(c){h.error(`セグメント翻訳に失敗: ${c.message}`),a.translated=a.original;}i<o.length-1&&await D(1e3+Math.random()*500);}for(const i of e)i.tweet.text=it(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=it(i.quotedSegments));return r&&_t(d("localAiTranslationComplete"),"Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function rt(n,t){if(n.kind==="text"){if(n.original.trim().length===0){n.translated=n.original;return}t.push(n);}}function it(n){if(n.length===0)return "";let t="";for(const e of n)if(e.kind==="fixed"){const o=e.value;ut(o)&&(t=Le(t)),t+=o;}else t+=e.translated??e.original;return t}function st(n){if(!n)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let o=0,r;for(;(r=t.exec(n))!==null;)r.index>o&&e.push({kind:"text",original:n.slice(o,r.index)}),e.push({kind:"fixed",value:Ae(r[0])}),o=r.index+r[0].length;return o<n.length&&e.push({kind:"text",original:n.slice(o)}),e.length===0&&e.push({kind:"text",original:n}),e}function Ae(n){if(ut(n)){const t=Ee(n);return t.length>0?t:n}return n}function ut(n){return /^https?:\/\//i.test(n.trim())}function Ee(n){return n.replace(Se,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function Le(n){return n.length===0?n:n.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function Ie(n){if(n.trim().length===0)return {text:n,provider:"none"};const t=ve();if(t==="local"){const e=await Pe(n);return e?{text:e,provider:"local"}:{text:n,provider:"none"}}if(t==="google")try{return {text:await $e(n),provider:"google"}}catch(e){return h.error(`Google翻訳にも失敗しました: ${e.message}`),{text:n,provider:"none"}}if(t==="openai"){Me();const e=await Re(n);return e?{text:e,provider:"openai"}:{text:n,provider:"none"}}return {text:n,provider:"none"}}async function Pe(n){try{const t=N(),e=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${n}
<|plamo:op|>output lang=ja`,o=await new Promise((i,a)=>{GM_xmlhttpRequest({method:"POST",url:t.localAiEndpoint,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:t.localAiSystemPrompt},{role:"user",content:e}],temperature:0,max_tokens:8192,stream:!1}),timeout:12e4,onload:l=>l.status>=200&&l.status<300?i(l):a(new Error(`API error: ${l.status}`)),onerror:l=>a(l),ontimeout:()=>a(new Error("Timeout"))});}),s=JSON.parse(o.responseText)?.choices?.[0]?.message?.content;if(s&&s.trim().length>0)return h.log("ローカルAIでの翻訳に成功しました。"),s;throw new Error(d("localAiEmptyResult"))}catch(t){return h.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function $e(n){const t="auto";let o=0;const r=3;for(;o<r;)try{const s=`${xe}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(n)}`,i=await new Promise((c,p)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:m=>m.status>=200&&m.status<300?c(m):p(new Error(`API error: ${m.status}`)),onerror:m=>p(m),ontimeout:()=>p(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(c=>c?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(s){if(o++,h.error(`Google翻訳試行 ${o}/${r} 失敗: ${s.message}`),o>=r)throw s;await D(1e3*Math.pow(2,o));}throw new Error(d("googleTranslateFailed"))}function Me(){N().openaiApiKey||h.warn(d("openAiKeyMissing"));}async function Re(n){const t=N();if(!t.openaiEndpoint)return h.error(d("openAiEndpointMissing")),null;let e=0;const o=3,r=2e3;for(;e<o;)try{const s={"Content-Type":"application/json"};t.openaiApiKey&&(s.Authorization=`Bearer ${t.openaiApiKey}`),t.openaiEndpoint.includes("openrouter.ai")&&(s["HTTP-Referer"]=window.location.href,s["X-Title"]="Twitter Thread Copier");const a=`以下の英文を日本語に翻訳してください。翻訳結果のみを出力し、説明や注釈は不要です。

${n}`,l=await new Promise((m,f)=>{GM_xmlhttpRequest({method:"POST",url:t.openaiEndpoint,headers:s,data:JSON.stringify({model:t.openaiModel,messages:[{role:"system",content:t.openaiSystemPrompt},{role:"user",content:a}],temperature:0,max_tokens:8192}),timeout:6e4,onload:y=>y.status>=200&&y.status<300?m(y):f(new Error(`API error: ${y.status} - ${y.responseText}`)),onerror:y=>f(y),ontimeout:()=>f(new Error("Timeout"))});}),p=JSON.parse(l.responseText)?.choices?.[0]?.message?.content;if(p&&p.trim().length>0)return h.log("OpenAI互換での翻訳に成功しました。"),p;throw new Error("OpenAI Compatible translation result is empty")}catch(s){const i=s.message,a=i.includes("429");if(e++,h.error(`OpenAI互換翻訳試行 ${e}/${o} 失敗: ${i}`),e>=o)return h.error("OpenAI互換翻訳に失敗（最大リトライ回数到達）"),null;const l=a?r*Math.pow(2,e):r*e;h.log(`${l}ms後にリトライします...`),await D(l);}return null}function ke(n){return {...n,mediaUrls:[...n.mediaUrls],quotedTweet:n.quotedTweet?{...n.quotedTweet,mediaUrls:[...n.quotedTweet.mediaUrls]}:null}}async function D(n){await new Promise(t=>setTimeout(t,n));}function _(n){let t=`${n.author} ${n.handle}
${n.text}
${n.time}
`;if(n.url&&(t+=`${n.url}
`),n.mediaUrls.length>0&&(t+=n.mediaUrls.join(`
`)+`
`),n.quotedTweet){const e=n.quotedTweet;t+=`
> 引用元: ${e.author} ${e.handle}
`,t+=`> ${e.text.replace(/\n/g,`
> `)}
`,e.mediaUrls.length>0&&(t+=`> ${e.mediaUrls.join(`
> `)}
`),t+=`> ${e.url}
`;}return t}function Ue(n,t){if(!n||n.length===0)return "";let e="";const o=`

---

`;for(let r=0;r<n.length;r++){const s=n[r],i=_(s),a=r===0?i:o+i;if(e.length+a.length>t){const l=t-e.length;l>o.length&&(e+=a.substring(0,l-3)+"...");break}e+=a;}return e}const qe=/https?:\/\/[^\s]+/g;class _e{hasThreadUrlIncluded=false;remainingMediaSlots=5;consumeThreadUrl(t){return !t||this.hasThreadUrlIncluded?null:(this.hasThreadUrlIncluded=true,t)}consumeMediaUrls(t){if(this.remainingMediaSlots<=0)return [];const o=t.filter(r=>r.trim().length>0).slice(0,this.remainingMediaSlots);return this.remainingMediaSlots-=o.length,o}}function at(n){if(!n)return "";const e=n.replace(qe,"").replace(/[ \t]+\n/g,`
`).split(`
`).map(o=>o.replace(/[ \t]{2,}/g," ").trim());for(let o=e.length-1;o>=0&&e[o]==="";o--)e.pop();return e.join(`
`)}function Ne(n,t){const e=[];e.push(`${n.author} ${n.handle}`);const o=at(n.text);o.length>0?e.push(o):e.push(""),e.push(n.time);const r=t.consumeThreadUrl(n.url);r&&e.push(r);const s=t.consumeMediaUrls(n.mediaUrls);if(s.length>0&&e.push(...s),n.quotedTweet){const{quotedTweet:i}=n;if(i){const a=[];a.push(`> 引用元: ${i.author} ${i.handle}`);const l=at(i.text);l.length>0&&a.push(...l.split(`
`).map(p=>`> ${p}`));const c=t.consumeMediaUrls(i.mediaUrls);c.length>0&&a.push(...c.map(p=>`> ${p}`)),a.length>0&&(e.push(""),e.push(...a));}}return `${e.join(`
`)}
`}function Fe(n,t){if(!n||n.length===0)return "";const e=new _e;let o="";const r=`

---

`;for(let s=0;s<n.length;s++){const i=n[s],a=Ne(i,e),l=s===0?a:r+a;if(o.length+l.length>t){const c=t-o.length;c>r.length&&(o+=l.substring(0,c-3)+"...");break}o+=l;}return o}function Oe(n){if(!n||n.length===0)return "";let t=_(n[0]);for(let e=1;e<n.length;e++)t+=`

---

`+_(n[e]);return t}function He(n,t,e,o=null){let r="";if(o&&(r+=v("summaryStartFrom",{author:o})),n.length>0){const s=n[0].author;r+=v("summaryThread",{author:s});}return r+=v("summaryCopied",{count:String(n.length)}),r+=v("summaryChars",{count:De(t.length)}),(e==="shitaraba"||e==="5ch")&&(r+=`/${e==="shitaraba"?4096:2048}`),r}function De(n){return n<1e3?n.toString():n<1e4?(n/1e3).toFixed(1)+"k":Math.round(n/1e3)+"k"}async function Be(n){if(!n||!n.formattedText){const o=d(n?"copyNoText":"copyNoData");return h.error(`クリップボードコピー失敗: ${o}`),x.showToast(d("unknownError"),o),false}if(n.formattedText.trim().length===0)return h.error("クリップボードコピー失敗: formattedTextが空です"),x.showToast(d("unknownError"),d("copyEmptyText")),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const o=new Blob([n.formattedText],{type:"text/plain"}),r=window,s=new r.ClipboardItem({"text/plain":o});await navigator.clipboard.write([s]),t=!0;}catch(o){e=o,h.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(n.formattedText),t=!0;}catch(o){e=o,h.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const o=document.createElement("textarea");if(o.value=n.formattedText,o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select(),t=document.execCommand("copy"),document.body.removeChild(o),!t)throw new Error("execCommand returned false")}catch(o){e=o,h.error(`execCommand fallback失敗: ${e.message}`);}if(t)x.showToast(d("copied"),n.summary);else {const o=e?e.message:d("unknownError");h.error(`クリップボードコピー失敗: ${o}`),x.showToast(d("unknownError"),d("copyFailed"));}return t}class Ge{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),h.log("Application initialized.");}catch(t){h.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){u.collectedThreadData&&(await Be(u.collectedThreadData),u.isSecondStage=!1,u.collectedThreadData=null,x.updateMainButtonText());return}if(u.isCollecting)return;u.isCollecting=!0,x.updateMainButtonText();try{const e=await zt();let o=e;const r=u.selectedTweetIds??[];if(r.length>0){const c=new Map(e.map(m=>[m.id,m])),p=[];for(const m of r){const f=c.get(m);f&&p.push(f);}if(o=p,o.length===0){h.warn("選択済みツイートを取得できませんでした。"),u.collectedThreadData=null,u.isSecondStage=!1,x.showToast(d("selectionErrorTitle"),d("selectionErrorContent"));return}}else if(u.startFromTweetId){const c=e.findIndex(p=>p.id===u.startFromTweetId);c!==-1&&(o=e.slice(c));}let s="",i=o,a=!1;if(o.length>0){if(u.translateEnabled)try{u.translationInProgress=!0,x.updateMainButtonText(),x.showToast(d("translationToastTitle"),d("translationToastContent"));const c=await Ce(o);i=c.tweets,a=c.hasTranslation;}catch(c){h.error(`Translation error: ${c}`),x.showToast(d("translationErrorTitle"),d("translationErrorContent")),i=o,a=!1;}finally{u.translationInProgress=!1;}switch(u.copyMode){case "first":s=_(i[0]);break;case "shitaraba":s=Fe(i,4096);break;case "5ch":s=Ue(i,2048);break;default:s=Oe(i);break}}let l=He(o,s,u.copyMode,r.length===0?u.startFromTweetAuthor:null);u.translateEnabled&&a&&s.trim().length>0&&(l+=d("translatedSuffix")),u.collectedThreadData={formattedText:s,summary:l},u.isSecondStage=!0,x.showToast(d("readyTitle"),v("readyContent",{summary:l}));}catch(e){h.error(`Error in copy process: ${e}`),x.showToast(d("unknownError"),d("threadCopyFailed"));}finally{u.isCollecting=!1,u.translationInProgress=!1,x.updateMainButtonText();}}catch(e){h.error(`Button click handler error: ${e}`),x.showToast(d("internalErrorTitle"),d("internalErrorContent"));}}updateButtonVisibility(){this.isTwitterStatusPage()?(x.init(),x.addMainButton(this.handleButtonClick.bind(this)),x.updateAllUI()):x.destroy();}isTwitterStatusPage(){return Dt.test(location.href)}observeUrlChanges(){let t=location.href;const e=()=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300));},o=history.pushState;history.pushState=function(...i){o.apply(this,i),e();};const r=history.replaceState;history.replaceState=function(...i){r.apply(this,i),e();},window.addEventListener("popstate",()=>e()),new MutationObserver(()=>e()).observe(document.body,{childList:true,subtree:true});}}new Ge;

})();