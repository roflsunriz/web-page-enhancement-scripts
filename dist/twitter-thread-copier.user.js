// ==UserScript==
// @name         twitter-thread-copier
// @namespace    twitterThreadCopier
// @version      6.11.0
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

    const M="[TwitterThreadCopier]",g={log:o=>{console.log(M,o);},error:o=>{console.error(M,o);},warn:(o,t)=>{t?console.warn(M,o,t):console.warn(M,o);}};function ft(){return {collectedThreadData:null,isCollecting:false,isSecondStage:false,translateEnabled:false,translationInProgress:false,copyMode:"all",startFromTweetId:null,startFromTweetAuthor:"",startFromTweetText:"",selectedTweetIds:[]}}const u=ft();var Tt="M19,3H14.82C14.25,1.44 12.53,0.64 11,1.2C10.14,1.5 9.5,2.16 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M17,11H7V9H17V11M15,15H7V13H15V15Z",yt="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",Ct="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",At="M13,2.03V2.05L13,4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03M11,2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06M4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1L4.26,5.67M2.06,13C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13H2.06M7.1,18.37L5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";function $(o,t=24){const e=String(t),n=String(t);return `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${n}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const y={article:'article[data-testid="tweet"]',statusLink:'a[href*="/status/"]',tweetText:'div[data-testid="tweetText"]',tweetPhoto:'div[data-testid="tweetPhoto"]',tweetVideo:'div[data-testid="videoPlayer"]',mediaCardSmall:'div[data-testid="card.layoutSmall.media"]',mediaCardLarge:'div[data-testid="card.layoutLarge.media"]',userName:'div[data-testid="User-Name"]',userNameLinkSpan:'div[data-testid="User-Name"] a[role="link"] span',quotedLink:'[data-testid="tweetQuotedLink"]',tweetButtonsWithinArticle:'[data-testid="tweet"] [role="button"]',tweetContainerCandidates:'[data-testid="cellInnerDiv"], [data-testid="tweet"], article',tweetObserverTargets:'[data-testid="tweet"], [id^=id__], article[role="article"]',tweetCandidates:'[data-testid="tweet"], [id^=id__]',tweetRoot:'[data-testid="tweet"]',retweetIndicator:".r-15zivkp",timelineMain:'main[role="main"]',muteKeywordSpan:"div[role='link'] > div > div[dir='ltr']:first-child > span",userLink:'a[role="link"][href^="/"]',quotedAuthor:'div[dir="ltr"] > span',quotedHandle:'div[dir="ltr"] span:nth-child(2)',roleLink:'div[role="link"]',roleGroup:'[role="group"]',tweetMediaImage:'img[src*="pbs.twimg.com/media"]',tweetMediaImageAlt:'img[src*="ton.twimg.com/media"]'},lt="twitter-thread-copier-settings",wt="http://localhost:3002/v1/chat/completions",St="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.",xt="https://api.cerebras.ai/v1/chat/completions",bt="gpt-oss-120b",vt="You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";function k(){return {localAiEndpoint:wt,localAiSystemPrompt:St,openaiEndpoint:xt,openaiModel:bt,openaiSystemPrompt:vt,openaiApiKey:""}}function q(){try{const o=localStorage.getItem(lt);if(!o)return k();const t=JSON.parse(o),e=k();return {localAiEndpoint:t.localAiEndpoint??e.localAiEndpoint,localAiSystemPrompt:t.localAiSystemPrompt??e.localAiSystemPrompt,openaiEndpoint:t.openaiEndpoint??e.openaiEndpoint,openaiModel:t.openaiModel??e.openaiModel,openaiSystemPrompt:t.openaiSystemPrompt??e.openaiSystemPrompt,openaiApiKey:t.openaiApiKey??e.openaiApiKey}}catch(o){return g.error(`Failed to load settings: ${o.message}`),k()}}function ct(o){try{const t=JSON.stringify(o);localStorage.setItem(lt,t),g.log("Settings saved successfully");}catch(t){g.error(`Failed to save settings: ${t.message}`);}}function Et(){const o=k();return ct(o),o}const Pt=["en","zh-Hans","hi","es","fr","ar","pt","bn","ru","ur"],It=["ja",...Pt],Rt=new Set(["ar","ur"]);function Lt(o){return Rt.has(o)?"rtl":"ltr"}function Mt(o,t,e){const n=o[e],r={},s=o;for(const i of t)r[i]={...n,...s[i]??{}};return r}function $t(o,t){return Mt(o,It,t)}function kt(o,t){return o.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{const r=t[n];return r===void 0?e:String(r)})}function Ot(o){const t=Object.keys(o.translations);let e=o.defaultLocale;const n=c=>{const p=c.toLowerCase(),h=o.aliases?.[p];if(h)return h;const f=t.find(m=>m.toLowerCase()===p);if(f)return f;const T=p.split("-")[0];return t.find(m=>m.toLowerCase().split("-")[0]===T)??null},r=()=>{const c=navigator.languages.length>0?navigator.languages:[navigator.language];for(const p of c){const h=n(p);if(h)return h}return o.fallbackLocale},s=c=>{const p=o.translations[e]?.[c];if(p)return p;const h=o.translations[o.fallbackLocale]?.[c];return h||(o.translations[o.defaultLocale]?.[c]??c)};return {locales:t,getLocale:()=>e,setLocale:c=>{e=c;},detectBrowserLocale:r,t:s,format:(c,p)=>kt(s(c),p),getTranslations:(c=e)=>o.translations[c]??o.translations[o.fallbackLocale],getDirection:(c=e)=>Lt(c),getMissingTranslationKeys:c=>{const p=o.translations[o.fallbackLocale],h=o.translations[c];return Object.keys(p).filter(f=>!h[f])}}}const Ft=$t({ja:{allMode:"全て",clickToCopy:"クリックしてコピー",collecting:"収集中...",copyEmptyText:"コピーするテキストが空です",copyFailed:"クリップボードへのコピーに失敗しました。",copyFromStart:"{text}からコピー",copyNoData:"コピーするデータがありません (threadData is null)",copyNoText:"コピーするテキストがありません (formattedText is null)",copySelectedTweets:"選択ツイート({count})をコピー",copyThread:"スレッドをコピー",copied:"コピーしました",firstMode:"最初のみ",googleTranslate:"Google翻訳",googleTranslateFailed:"Google翻訳に失敗しました。",internalErrorContent:"処理中に予期せぬエラーが発生しました。",internalErrorTitle:"内部エラー",localAi:"ローカルAI",localAiEmptyResult:"ローカルAIからの翻訳結果が空です。",localAiTranslationComplete:"ローカルAIでの翻訳が完了しました。",openAiCompatible:"OpenAI互換",openAiEndpointMissing:"OpenAI互換 APIエンドポイントが設定されていません。",openAiKeyMissing:"OpenAI互換 APIキーが設定されていません。設定画面から設定してください。",readyContent:"{summary} クリックしてコピーしてください",readyTitle:"準備完了",resetConfirm:"設定をデフォルトに戻しますか？",resetSelection:"選択をリセット",selectTweet:"このツイートを選択",selectedCount:"{count}件選択中",selectedTitle:"選択中 ({order})",selectionAdded:"選択追加",selectionCleared:"選択をすべて解除しました",selectionClearedAll:"選択したツイートをすべて解除しました",selectionErrorContent:"選択したツイートが見つかりませんでした。再度読み込みしてください。",selectionErrorTitle:"選択エラー",selectionRemoved:"選択解除",selectionReset:"選択リセット",settings:"設定",settingsApiEndpoint:"APIエンドポイント",settingsApiKey:"APIキー",settingsApiKeyPlaceholder:"常に必要なので必ず入力してください",settingsCancel:"キャンセル",settingsLocalAi:"ローカルAI設定",settingsModel:"モデル名",settingsOpenAi:"OpenAI互換設定",settingsReset:"リセット",settingsResetContent:"設定をデフォルトに戻しました",settingsResetTitle:"設定リセット",settingsSave:"保存",settingsSavedContent:"設定を保存しました",settingsSavedTitle:"設定保存",settingsSystemPrompt:"システムプロンプト",settingsTitle:"翻訳設定",startPointReset:"起点をリセット",startPointResetContent:"コピー起点をリセットしました",startPointResetTitle:"起点リセット",startPointSetContent:"{author}のツイートを起点に設定しました",startPointSetTitle:"起点設定完了",startPointTitle:"この位置からコピー開始",summaryChars:"文字数: {count}",summaryCopied:"({count}件)をコピーしました。",summaryStartFrom:"{author}のツイートから",summaryThread:"{author}のスレッド",threadCopyFailed:"スレッドのコピーに失敗しました",translatedSuffix:" (翻訳済み)",translating:"翻訳中...",translation:"翻訳",translationErrorContent:"翻訳中にエラーが発生しましたが、原文をコピーできます",translationErrorTitle:"翻訳エラー",translationProvider:"翻訳プロバイダー:",translationToastContent:"翻訳処理を実行しています...",translationToastTitle:"翻訳中",unknownError:"不明なエラー"},en:{allMode:"All",clickToCopy:"Click to copy",collecting:"Collecting...",copyEmptyText:"There is no text to copy",copyFailed:"Failed to copy to the clipboard.",copyFromStart:"Copy from {text}",copyNoData:"There is no data to copy (threadData is null)",copyNoText:"There is no text to copy (formattedText is null)",copySelectedTweets:"Copy selected tweets ({count})",copyThread:"Copy thread",copied:"Copied",firstMode:"First only",googleTranslate:"Google Translate",googleTranslateFailed:"Google Translate failed.",internalErrorContent:"An unexpected error occurred while processing.",internalErrorTitle:"Internal error",localAi:"Local AI",localAiEmptyResult:"Local AI returned an empty translation result.",localAiTranslationComplete:"Local AI translation is complete.",openAiCompatible:"OpenAI-compatible",openAiEndpointMissing:"OpenAI-compatible API endpoint is not configured.",openAiKeyMissing:"OpenAI-compatible API key is not configured. Set it from the settings screen.",readyContent:"{summary} Click to copy.",readyTitle:"Ready",resetConfirm:"Reset settings to defaults?",resetSelection:"Reset selection",selectTweet:"Select this tweet",selectedCount:"{count} selected",selectedTitle:"Selected ({order})",selectionAdded:"Selection added",selectionCleared:"Cleared all selections",selectionClearedAll:"Cleared all selected tweets",selectionErrorContent:"Selected tweets were not found. Reload the page and try again.",selectionErrorTitle:"Selection error",selectionRemoved:"Selection removed",selectionReset:"Selection reset",settings:"Settings",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"Required. Enter a key before using this provider.",settingsCancel:"Cancel",settingsLocalAi:"Local AI settings",settingsModel:"Model name",settingsOpenAi:"OpenAI-compatible settings",settingsReset:"Reset",settingsResetContent:"Settings were reset to defaults",settingsResetTitle:"Settings reset",settingsSave:"Save",settingsSavedContent:"Settings were saved",settingsSavedTitle:"Settings saved",settingsSystemPrompt:"System prompt",settingsTitle:"Translation Settings",startPointReset:"Reset start point",startPointResetContent:"The copy start point was reset",startPointResetTitle:"Start point reset",startPointSetContent:"Set {author}'s tweet as the start point",startPointSetTitle:"Start point set",startPointTitle:"Start copying from here",summaryChars:"Characters: {count}",summaryCopied:"Copied {count} tweet(s).",summaryStartFrom:"From {author}'s tweet, ",summaryThread:"{author}'s thread",threadCopyFailed:"Failed to copy the thread",translatedSuffix:" (translated)",translating:"Translating...",translation:"Translate",translationErrorContent:"Translation failed, but you can still copy the original text",translationErrorTitle:"Translation error",translationProvider:"Translation provider:",translationToastContent:"Running translation...",translationToastTitle:"Translating",unknownError:"Unknown error"},"zh-Hans":{allMode:"全部",clickToCopy:"点击复制",collecting:"正在收集...",copyEmptyText:"没有可复制的文本",copyFailed:"复制到剪贴板失败。",copyFromStart:"从 {text} 复制",copyNoData:"没有可复制的数据（threadData is null）",copyNoText:"没有可复制的文本（formattedText is null）",copySelectedTweets:"复制选中的推文（{count}）",copyThread:"复制线程",copied:"已复制",firstMode:"仅第一个",googleTranslate:"Google 翻译",googleTranslateFailed:"Google 翻译失败。",internalErrorContent:"处理时发生意外错误。",internalErrorTitle:"内部错误",localAi:"本地 AI",localAiEmptyResult:"本地 AI 返回的翻译结果为空。",localAiTranslationComplete:"本地 AI 翻译已完成。",openAiCompatible:"OpenAI 兼容",openAiEndpointMissing:"尚未设置 OpenAI 兼容 API 端点。",openAiKeyMissing:"尚未设置 OpenAI 兼容 API 密钥。请在设置画面中设置。",readyContent:"{summary} 点击复制。",readyTitle:"准备完成",resetConfirm:"将设置重置为默认值？",resetSelection:"重置选择",selectTweet:"选择这条推文",selectedCount:"已选择 {count} 条",selectedTitle:"已选择（{order}）",selectionAdded:"已添加选择",selectionCleared:"已清除所有选择",selectionClearedAll:"已清除所有选中的推文",selectionErrorContent:"未找到选中的推文。请重新加载页面后再试。",selectionErrorTitle:"选择错误",selectionRemoved:"已取消选择",selectionReset:"选择已重置",settings:"设置",settingsApiEndpoint:"API 端点",settingsApiKey:"API 密钥",settingsApiKeyPlaceholder:"必填。使用该提供方前请输入密钥。",settingsCancel:"取消",settingsLocalAi:"本地 AI 设置",settingsModel:"模型名称",settingsOpenAi:"OpenAI 兼容设置",settingsReset:"重置",settingsResetContent:"设置已重置为默认值",settingsResetTitle:"设置已重置",settingsSave:"保存",settingsSavedContent:"设置已保存",settingsSavedTitle:"设置已保存",settingsSystemPrompt:"系统提示词",settingsTitle:"翻译设置",startPointReset:"重置起点",startPointResetContent:"复制起点已重置",startPointResetTitle:"起点已重置",startPointSetContent:"已将 {author} 的推文设为起点",startPointSetTitle:"起点设置完成",startPointTitle:"从这里开始复制",summaryChars:"字符数：{count}",summaryCopied:"已复制 {count} 条推文。",summaryStartFrom:"从 {author} 的推文开始，",summaryThread:"{author} 的线程",threadCopyFailed:"复制线程失败",translatedSuffix:"（已翻译）",translating:"正在翻译...",translation:"翻译",translationErrorContent:"翻译失败，但仍可复制原文",translationErrorTitle:"翻译错误",translationProvider:"翻译提供方：",translationToastContent:"正在执行翻译...",translationToastTitle:"正在翻译",unknownError:"未知错误"},hi:{allMode:"सभी",clickToCopy:"कॉपी करने के लिए क्लिक करें",collecting:"एकत्र किया जा रहा है...",copyEmptyText:"कॉपी करने के लिए कोई टेक्स्ट नहीं है",copyFailed:"क्लिपबोर्ड में कॉपी करने में विफल।",copyFromStart:"{text} से कॉपी करें",copyNoData:"कॉपी करने के लिए कोई डेटा नहीं है (threadData is null)",copyNoText:"कॉपी करने के लिए कोई टेक्स्ट नहीं है (formattedText is null)",copySelectedTweets:"चुने गए ट्वीट कॉपी करें ({count})",copyThread:"थ्रेड कॉपी करें",copied:"कॉपी हो गया",firstMode:"केवल पहला",googleTranslate:"Google अनुवाद",googleTranslateFailed:"Google अनुवाद विफल रहा।",internalErrorContent:"प्रोसेसिंग के दौरान अनपेक्षित त्रुटि हुई।",internalErrorTitle:"आंतरिक त्रुटि",localAi:"स्थानीय AI",localAiEmptyResult:"स्थानीय AI से खाली अनुवाद परिणाम मिला।",localAiTranslationComplete:"स्थानीय AI अनुवाद पूरा हुआ।",openAiCompatible:"OpenAI-संगत",openAiEndpointMissing:"OpenAI-संगत API endpoint सेट नहीं है।",openAiKeyMissing:"OpenAI-संगत API key सेट नहीं है। इसे सेटिंग स्क्रीन से सेट करें।",readyContent:"{summary} कॉपी करने के लिए क्लिक करें।",readyTitle:"तैयार",resetConfirm:"सेटिंग्स को डिफ़ॉल्ट पर रीसेट करें?",resetSelection:"चयन रीसेट करें",selectTweet:"यह ट्वीट चुनें",selectedCount:"{count} चुने गए",selectedTitle:"चुना गया ({order})",selectionAdded:"चयन जोड़ा गया",selectionCleared:"सभी चयन साफ़ किए गए",selectionClearedAll:"सभी चुने गए ट्वीट साफ़ किए गए",selectionErrorContent:"चुने गए ट्वीट नहीं मिले। पेज फिर से लोड करके प्रयास करें।",selectionErrorTitle:"चयन त्रुटि",selectionRemoved:"चयन हटाया गया",selectionReset:"चयन रीसेट",settings:"सेटिंग्स",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"आवश्यक। इस provider का उपयोग करने से पहले key डालें।",settingsCancel:"रद्द करें",settingsLocalAi:"स्थानीय AI सेटिंग्स",settingsModel:"मॉडल नाम",settingsOpenAi:"OpenAI-संगत सेटिंग्स",settingsReset:"रीसेट",settingsResetContent:"सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गईं",settingsResetTitle:"सेटिंग्स रीसेट",settingsSave:"सहेजें",settingsSavedContent:"सेटिंग्स सहेजी गईं",settingsSavedTitle:"सेटिंग्स सहेजी गईं",settingsSystemPrompt:"सिस्टम prompt",settingsTitle:"अनुवाद सेटिंग्स",startPointReset:"शुरुआती बिंदु रीसेट करें",startPointResetContent:"कॉपी शुरुआती बिंदु रीसेट हो गया",startPointResetTitle:"शुरुआती बिंदु रीसेट",startPointSetContent:"{author} के ट्वीट को शुरुआती बिंदु बनाया गया",startPointSetTitle:"शुरुआती बिंदु सेट",startPointTitle:"यहां से कॉपी शुरू करें",summaryChars:"अक्षर: {count}",summaryCopied:"{count} ट्वीट कॉपी हुए।",summaryStartFrom:"{author} के ट्वीट से, ",summaryThread:"{author} का थ्रेड",threadCopyFailed:"थ्रेड कॉपी करने में विफल",translatedSuffix:" (अनुवादित)",translating:"अनुवाद हो रहा है...",translation:"अनुवाद",translationErrorContent:"अनुवाद विफल रहा, लेकिन मूल टेक्स्ट कॉपी किया जा सकता है",translationErrorTitle:"अनुवाद त्रुटि",translationProvider:"अनुवाद provider:",translationToastContent:"अनुवाद चल रहा है...",translationToastTitle:"अनुवाद हो रहा है",unknownError:"अज्ञात त्रुटि"},es:{allMode:"Todo",clickToCopy:"Haz clic para copiar",collecting:"Recopilando...",copyEmptyText:"No hay texto para copiar",copyFailed:"No se pudo copiar al portapapeles.",copyFromStart:"Copiar desde {text}",copyNoData:"No hay datos para copiar (threadData is null)",copyNoText:"No hay texto para copiar (formattedText is null)",copySelectedTweets:"Copiar tweets seleccionados ({count})",copyThread:"Copiar hilo",copied:"Copiado",firstMode:"Solo el primero",googleTranslate:"Google Translate",googleTranslateFailed:"Google Translate falló.",internalErrorContent:"Ocurrió un error inesperado durante el procesamiento.",internalErrorTitle:"Error interno",localAi:"IA local",localAiEmptyResult:"La IA local devolvió un resultado de traducción vacío.",localAiTranslationComplete:"La traducción con IA local se completó.",openAiCompatible:"Compatible con OpenAI",openAiEndpointMissing:"No se configuró el endpoint API compatible con OpenAI.",openAiKeyMissing:"No se configuró la clave API compatible con OpenAI. Defínela desde la pantalla de ajustes.",readyContent:"{summary} Haz clic para copiar.",readyTitle:"Listo",resetConfirm:"¿Restablecer los ajustes a los valores predeterminados?",resetSelection:"Restablecer selección",selectTweet:"Seleccionar este tweet",selectedCount:"{count} seleccionados",selectedTitle:"Seleccionado ({order})",selectionAdded:"Selección agregada",selectionCleared:"Se borraron todas las selecciones",selectionClearedAll:"Se borraron todos los tweets seleccionados",selectionErrorContent:"No se encontraron los tweets seleccionados. Recarga la página e inténtalo de nuevo.",selectionErrorTitle:"Error de selección",selectionRemoved:"Selección eliminada",selectionReset:"Selección restablecida",settings:"Ajustes",settingsApiEndpoint:"Endpoint API",settingsApiKey:"Clave API",settingsApiKeyPlaceholder:"Obligatoria. Introduce una clave antes de usar este proveedor.",settingsCancel:"Cancelar",settingsLocalAi:"Ajustes de IA local",settingsModel:"Nombre del modelo",settingsOpenAi:"Ajustes compatibles con OpenAI",settingsReset:"Restablecer",settingsResetContent:"Los ajustes se restablecieron",settingsResetTitle:"Ajustes restablecidos",settingsSave:"Guardar",settingsSavedContent:"Los ajustes se guardaron",settingsSavedTitle:"Ajustes guardados",settingsSystemPrompt:"Prompt del sistema",settingsTitle:"Ajustes de traducción",startPointReset:"Restablecer punto de inicio",startPointResetContent:"El punto de inicio de copia se restableció",startPointResetTitle:"Punto de inicio restablecido",startPointSetContent:"Se estableció el tweet de {author} como punto de inicio",startPointSetTitle:"Punto de inicio establecido",startPointTitle:"Empezar a copiar desde aquí",summaryChars:"Caracteres: {count}",summaryCopied:"Se copiaron {count} tweet(s).",summaryStartFrom:"Desde el tweet de {author}, ",summaryThread:"Hilo de {author}",threadCopyFailed:"No se pudo copiar el hilo",translatedSuffix:" (traducido)",translating:"Traduciendo...",translation:"Traducir",translationErrorContent:"La traducción falló, pero aún puedes copiar el texto original",translationErrorTitle:"Error de traducción",translationProvider:"Proveedor de traducción:",translationToastContent:"Ejecutando traducción...",translationToastTitle:"Traduciendo",unknownError:"Error desconocido"},fr:{allMode:"Tout",clickToCopy:"Cliquez pour copier",collecting:"Collecte...",copyEmptyText:"Aucun texte à copier",copyFailed:"Échec de la copie dans le presse-papiers.",copyFromStart:"Copier depuis {text}",copyNoData:"Aucune donnée à copier (threadData is null)",copyNoText:"Aucun texte à copier (formattedText is null)",copySelectedTweets:"Copier les tweets sélectionnés ({count})",copyThread:"Copier le fil",copied:"Copié",firstMode:"Premier seulement",googleTranslate:"Google Traduction",googleTranslateFailed:"Google Traduction a échoué.",internalErrorContent:"Une erreur inattendue s'est produite pendant le traitement.",internalErrorTitle:"Erreur interne",localAi:"IA locale",localAiEmptyResult:"L'IA locale a renvoyé un résultat de traduction vide.",localAiTranslationComplete:"La traduction par IA locale est terminée.",openAiCompatible:"Compatible OpenAI",openAiEndpointMissing:"Le point de terminaison API compatible OpenAI n'est pas configuré.",openAiKeyMissing:"La clé API compatible OpenAI n'est pas configurée. Définissez-la dans les paramètres.",readyContent:"{summary} Cliquez pour copier.",readyTitle:"Prêt",resetConfirm:"Réinitialiser les paramètres par défaut ?",resetSelection:"Réinitialiser la sélection",selectTweet:"Sélectionner ce tweet",selectedCount:"{count} sélectionné(s)",selectedTitle:"Sélectionné ({order})",selectionAdded:"Sélection ajoutée",selectionCleared:"Toutes les sélections ont été effacées",selectionClearedAll:"Tous les tweets sélectionnés ont été effacés",selectionErrorContent:"Les tweets sélectionnés sont introuvables. Rechargez la page et réessayez.",selectionErrorTitle:"Erreur de sélection",selectionRemoved:"Sélection retirée",selectionReset:"Sélection réinitialisée",settings:"Paramètres",settingsApiEndpoint:"Point de terminaison API",settingsApiKey:"Clé API",settingsApiKeyPlaceholder:"Obligatoire. Saisissez une clé avant d'utiliser ce fournisseur.",settingsCancel:"Annuler",settingsLocalAi:"Paramètres de l'IA locale",settingsModel:"Nom du modèle",settingsOpenAi:"Paramètres compatibles OpenAI",settingsReset:"Réinitialiser",settingsResetContent:"Les paramètres ont été réinitialisés",settingsResetTitle:"Paramètres réinitialisés",settingsSave:"Enregistrer",settingsSavedContent:"Les paramètres ont été enregistrés",settingsSavedTitle:"Paramètres enregistrés",settingsSystemPrompt:"Prompt système",settingsTitle:"Paramètres de traduction",startPointReset:"Réinitialiser le point de départ",startPointResetContent:"Le point de départ de copie a été réinitialisé",startPointResetTitle:"Point de départ réinitialisé",startPointSetContent:"Le tweet de {author} a été défini comme point de départ",startPointSetTitle:"Point de départ défini",startPointTitle:"Commencer la copie ici",summaryChars:"Caractères : {count}",summaryCopied:"{count} tweet(s) copié(s).",summaryStartFrom:"Depuis le tweet de {author}, ",summaryThread:"Fil de {author}",threadCopyFailed:"Échec de la copie du fil",translatedSuffix:" (traduit)",translating:"Traduction...",translation:"Traduire",translationErrorContent:"La traduction a échoué, mais vous pouvez toujours copier le texte original",translationErrorTitle:"Erreur de traduction",translationProvider:"Fournisseur de traduction :",translationToastContent:"Traduction en cours...",translationToastTitle:"Traduction",unknownError:"Erreur inconnue"},ar:{allMode:"الكل",clickToCopy:"انقر للنسخ",collecting:"جار الجمع...",copyEmptyText:"لا يوجد نص للنسخ",copyFailed:"فشل النسخ إلى الحافظة.",copyFromStart:"نسخ من {text}",copyNoData:"لا توجد بيانات للنسخ (threadData is null)",copyNoText:"لا يوجد نص للنسخ (formattedText is null)",copySelectedTweets:"نسخ التغريدات المحددة ({count})",copyThread:"نسخ السلسلة",copied:"تم النسخ",firstMode:"الأول فقط",googleTranslate:"ترجمة Google",googleTranslateFailed:"فشلت ترجمة Google.",internalErrorContent:"حدث خطأ غير متوقع أثناء المعالجة.",internalErrorTitle:"خطأ داخلي",localAi:"ذكاء اصطناعي محلي",localAiEmptyResult:"أعاد الذكاء الاصطناعي المحلي نتيجة ترجمة فارغة.",localAiTranslationComplete:"اكتملت الترجمة بالذكاء الاصطناعي المحلي.",openAiCompatible:"متوافق مع OpenAI",openAiEndpointMissing:"لم يتم تكوين نقطة نهاية API المتوافقة مع OpenAI.",openAiKeyMissing:"لم يتم تكوين مفتاح API المتوافق مع OpenAI. عينه من شاشة الإعدادات.",readyContent:"{summary} انقر للنسخ.",readyTitle:"جاهز",resetConfirm:"إعادة ضبط الإعدادات إلى الافتراضي؟",resetSelection:"إعادة ضبط التحديد",selectTweet:"تحديد هذه التغريدة",selectedCount:"{count} محددة",selectedTitle:"محدد ({order})",selectionAdded:"تمت إضافة التحديد",selectionCleared:"تم مسح كل التحديدات",selectionClearedAll:"تم مسح كل التغريدات المحددة",selectionErrorContent:"لم يتم العثور على التغريدات المحددة. أعد تحميل الصفحة وحاول مرة أخرى.",selectionErrorTitle:"خطأ في التحديد",selectionRemoved:"تمت إزالة التحديد",selectionReset:"تمت إعادة ضبط التحديد",settings:"الإعدادات",settingsApiEndpoint:"نقطة نهاية API",settingsApiKey:"مفتاح API",settingsApiKeyPlaceholder:"مطلوب. أدخل مفتاحا قبل استخدام هذا المزود.",settingsCancel:"إلغاء",settingsLocalAi:"إعدادات الذكاء الاصطناعي المحلي",settingsModel:"اسم النموذج",settingsOpenAi:"إعدادات متوافقة مع OpenAI",settingsReset:"إعادة ضبط",settingsResetContent:"تمت إعادة ضبط الإعدادات إلى الافتراضي",settingsResetTitle:"إعادة ضبط الإعدادات",settingsSave:"حفظ",settingsSavedContent:"تم حفظ الإعدادات",settingsSavedTitle:"تم حفظ الإعدادات",settingsSystemPrompt:"موجه النظام",settingsTitle:"إعدادات الترجمة",startPointReset:"إعادة ضبط نقطة البداية",startPointResetContent:"تمت إعادة ضبط نقطة بدء النسخ",startPointResetTitle:"إعادة ضبط نقطة البداية",startPointSetContent:"تم تعيين تغريدة {author} كنقطة بداية",startPointSetTitle:"تم تعيين نقطة البداية",startPointTitle:"بدء النسخ من هنا",summaryChars:"الأحرف: {count}",summaryCopied:"تم نسخ {count} تغريدة.",summaryStartFrom:"من تغريدة {author}، ",summaryThread:"سلسلة {author}",threadCopyFailed:"فشل نسخ السلسلة",translatedSuffix:" (مترجم)",translating:"جار الترجمة...",translation:"ترجمة",translationErrorContent:"فشلت الترجمة، لكن لا يزال بإمكانك نسخ النص الأصلي",translationErrorTitle:"خطأ في الترجمة",translationProvider:"مزود الترجمة:",translationToastContent:"جار تنفيذ الترجمة...",translationToastTitle:"جار الترجمة",unknownError:"خطأ غير معروف"},pt:{allMode:"Tudo",clickToCopy:"Clique para copiar",collecting:"Coletando...",copyEmptyText:"Não há texto para copiar",copyFailed:"Falha ao copiar para a área de transferência.",copyFromStart:"Copiar a partir de {text}",copyNoData:"Não há dados para copiar (threadData is null)",copyNoText:"Não há texto para copiar (formattedText is null)",copySelectedTweets:"Copiar tweets selecionados ({count})",copyThread:"Copiar thread",copied:"Copiado",firstMode:"Somente o primeiro",googleTranslate:"Google Tradutor",googleTranslateFailed:"O Google Tradutor falhou.",internalErrorContent:"Ocorreu um erro inesperado durante o processamento.",internalErrorTitle:"Erro interno",localAi:"IA local",localAiEmptyResult:"A IA local retornou um resultado de tradução vazio.",localAiTranslationComplete:"A tradução com IA local foi concluída.",openAiCompatible:"Compatível com OpenAI",openAiEndpointMissing:"O endpoint de API compatível com OpenAI não está configurado.",openAiKeyMissing:"A chave de API compatível com OpenAI não está configurada. Defina-a na tela de configurações.",readyContent:"{summary} Clique para copiar.",readyTitle:"Pronto",resetConfirm:"Redefinir configurações para os padrões?",resetSelection:"Redefinir seleção",selectTweet:"Selecionar este tweet",selectedCount:"{count} selecionado(s)",selectedTitle:"Selecionado ({order})",selectionAdded:"Seleção adicionada",selectionCleared:"Todas as seleções foram limpas",selectionClearedAll:"Todos os tweets selecionados foram limpos",selectionErrorContent:"Os tweets selecionados não foram encontrados. Recarregue a página e tente novamente.",selectionErrorTitle:"Erro de seleção",selectionRemoved:"Seleção removida",selectionReset:"Seleção redefinida",settings:"Configurações",settingsApiEndpoint:"Endpoint da API",settingsApiKey:"Chave da API",settingsApiKeyPlaceholder:"Obrigatória. Insira uma chave antes de usar este provedor.",settingsCancel:"Cancelar",settingsLocalAi:"Configurações da IA local",settingsModel:"Nome do modelo",settingsOpenAi:"Configurações compatíveis com OpenAI",settingsReset:"Redefinir",settingsResetContent:"As configurações foram redefinidas",settingsResetTitle:"Configurações redefinidas",settingsSave:"Salvar",settingsSavedContent:"As configurações foram salvas",settingsSavedTitle:"Configurações salvas",settingsSystemPrompt:"Prompt do sistema",settingsTitle:"Configurações de tradução",startPointReset:"Redefinir ponto inicial",startPointResetContent:"O ponto inicial da cópia foi redefinido",startPointResetTitle:"Ponto inicial redefinido",startPointSetContent:"O tweet de {author} foi definido como ponto inicial",startPointSetTitle:"Ponto inicial definido",startPointTitle:"Começar a copiar daqui",summaryChars:"Caracteres: {count}",summaryCopied:"{count} tweet(s) copiado(s).",summaryStartFrom:"A partir do tweet de {author}, ",summaryThread:"Thread de {author}",threadCopyFailed:"Falha ao copiar a thread",translatedSuffix:" (traduzido)",translating:"Traduzindo...",translation:"Traduzir",translationErrorContent:"A tradução falhou, mas você ainda pode copiar o texto original",translationErrorTitle:"Erro de tradução",translationProvider:"Provedor de tradução:",translationToastContent:"Executando tradução...",translationToastTitle:"Traduzindo",unknownError:"Erro desconhecido"},bn:{allMode:"সব",clickToCopy:"কপি করতে ক্লিক করুন",collecting:"সংগ্রহ হচ্ছে...",copyEmptyText:"কপি করার মতো টেক্সট নেই",copyFailed:"ক্লিপবোর্ডে কপি করতে ব্যর্থ।",copyFromStart:"{text} থেকে কপি করুন",copyNoData:"কপি করার মতো ডেটা নেই (threadData is null)",copyNoText:"কপি করার মতো টেক্সট নেই (formattedText is null)",copySelectedTweets:"নির্বাচিত টুইট কপি করুন ({count})",copyThread:"থ্রেড কপি করুন",copied:"কপি হয়েছে",firstMode:"শুধু প্রথমটি",googleTranslate:"Google Translate",googleTranslateFailed:"Google Translate ব্যর্থ হয়েছে।",internalErrorContent:"প্রক্রিয়াকরণের সময় অপ্রত্যাশিত ত্রুটি ঘটেছে।",internalErrorTitle:"অভ্যন্তরীণ ত্রুটি",localAi:"লোকাল AI",localAiEmptyResult:"লোকাল AI খালি অনুবাদ ফলাফল ফিরিয়েছে।",localAiTranslationComplete:"লোকাল AI অনুবাদ সম্পন্ন হয়েছে।",openAiCompatible:"OpenAI-সামঞ্জস্যপূর্ণ",openAiEndpointMissing:"OpenAI-সামঞ্জস্যপূর্ণ API endpoint সেট করা নেই।",openAiKeyMissing:"OpenAI-সামঞ্জস্যপূর্ণ API key সেট করা নেই। সেটিংস স্ক্রিন থেকে সেট করুন।",readyContent:"{summary} কপি করতে ক্লিক করুন।",readyTitle:"প্রস্তুত",resetConfirm:"সেটিংস ডিফল্টে রিসেট করবেন?",resetSelection:"নির্বাচন রিসেট",selectTweet:"এই টুইট নির্বাচন করুন",selectedCount:"{count}টি নির্বাচিত",selectedTitle:"নির্বাচিত ({order})",selectionAdded:"নির্বাচন যোগ হয়েছে",selectionCleared:"সব নির্বাচন পরিষ্কার হয়েছে",selectionClearedAll:"সব নির্বাচিত টুইট পরিষ্কার হয়েছে",selectionErrorContent:"নির্বাচিত টুইট পাওয়া যায়নি। পেজ রিলোড করে আবার চেষ্টা করুন।",selectionErrorTitle:"নির্বাচন ত্রুটি",selectionRemoved:"নির্বাচন সরানো হয়েছে",selectionReset:"নির্বাচন রিসেট",settings:"সেটিংস",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"প্রয়োজনীয়। এই provider ব্যবহারের আগে key দিন।",settingsCancel:"বাতিল",settingsLocalAi:"লোকাল AI সেটিংস",settingsModel:"মডেল নাম",settingsOpenAi:"OpenAI-সামঞ্জস্যপূর্ণ সেটিংস",settingsReset:"রিসেট",settingsResetContent:"সেটিংস ডিফল্টে রিসেট হয়েছে",settingsResetTitle:"সেটিংস রিসেট",settingsSave:"সংরক্ষণ",settingsSavedContent:"সেটিংস সংরক্ষিত হয়েছে",settingsSavedTitle:"সেটিংস সংরক্ষিত",settingsSystemPrompt:"সিস্টেম prompt",settingsTitle:"অনুবাদ সেটিংস",startPointReset:"শুরু বিন্দু রিসেট",startPointResetContent:"কপি শুরুর বিন্দু রিসেট হয়েছে",startPointResetTitle:"শুরু বিন্দু রিসেট",startPointSetContent:"{author}-এর টুইটকে শুরু বিন্দু করা হয়েছে",startPointSetTitle:"শুরু বিন্দু সেট",startPointTitle:"এখান থেকে কপি শুরু করুন",summaryChars:"অক্ষর: {count}",summaryCopied:"{count}টি টুইট কপি হয়েছে।",summaryStartFrom:"{author}-এর টুইট থেকে, ",summaryThread:"{author}-এর থ্রেড",threadCopyFailed:"থ্রেড কপি করতে ব্যর্থ",translatedSuffix:" (অনূদিত)",translating:"অনুবাদ হচ্ছে...",translation:"অনুবাদ",translationErrorContent:"অনুবাদ ব্যর্থ হয়েছে, তবে মূল টেক্সট এখনও কপি করা যাবে",translationErrorTitle:"অনুবাদ ত্রুটি",translationProvider:"অনুবাদ provider:",translationToastContent:"অনুবাদ চলছে...",translationToastTitle:"অনুবাদ হচ্ছে",unknownError:"অজানা ত্রুটি"},ru:{allMode:"Все",clickToCopy:"Нажмите, чтобы скопировать",collecting:"Сбор...",copyEmptyText:"Нет текста для копирования",copyFailed:"Не удалось скопировать в буфер обмена.",copyFromStart:"Копировать с {text}",copyNoData:"Нет данных для копирования (threadData is null)",copyNoText:"Нет текста для копирования (formattedText is null)",copySelectedTweets:"Копировать выбранные твиты ({count})",copyThread:"Копировать тред",copied:"Скопировано",firstMode:"Только первый",googleTranslate:"Google Переводчик",googleTranslateFailed:"Google Переводчик не сработал.",internalErrorContent:"Во время обработки произошла непредвиденная ошибка.",internalErrorTitle:"Внутренняя ошибка",localAi:"Локальный AI",localAiEmptyResult:"Локальный AI вернул пустой результат перевода.",localAiTranslationComplete:"Перевод локальным AI завершен.",openAiCompatible:"Совместимо с OpenAI",openAiEndpointMissing:"API endpoint, совместимый с OpenAI, не настроен.",openAiKeyMissing:"API key, совместимый с OpenAI, не настроен. Задайте его в настройках.",readyContent:"{summary} Нажмите, чтобы скопировать.",readyTitle:"Готово",resetConfirm:"Сбросить настройки по умолчанию?",resetSelection:"Сбросить выбор",selectTweet:"Выбрать этот твит",selectedCount:"Выбрано: {count}",selectedTitle:"Выбрано ({order})",selectionAdded:"Выбор добавлен",selectionCleared:"Все выборы очищены",selectionClearedAll:"Все выбранные твиты очищены",selectionErrorContent:"Выбранные твиты не найдены. Перезагрузите страницу и попробуйте снова.",selectionErrorTitle:"Ошибка выбора",selectionRemoved:"Выбор снят",selectionReset:"Выбор сброшен",settings:"Настройки",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"Обязательно. Введите key перед использованием provider.",settingsCancel:"Отмена",settingsLocalAi:"Настройки локального AI",settingsModel:"Название модели",settingsOpenAi:"Настройки совместимости с OpenAI",settingsReset:"Сбросить",settingsResetContent:"Настройки сброшены по умолчанию",settingsResetTitle:"Настройки сброшены",settingsSave:"Сохранить",settingsSavedContent:"Настройки сохранены",settingsSavedTitle:"Настройки сохранены",settingsSystemPrompt:"Системный prompt",settingsTitle:"Настройки перевода",startPointReset:"Сбросить начальную точку",startPointResetContent:"Начальная точка копирования сброшена",startPointResetTitle:"Начальная точка сброшена",startPointSetContent:"Твит {author} задан как начальная точка",startPointSetTitle:"Начальная точка задана",startPointTitle:"Начать копирование отсюда",summaryChars:"Символов: {count}",summaryCopied:"Скопировано твитов: {count}.",summaryStartFrom:"С твита {author}, ",summaryThread:"Тред {author}",threadCopyFailed:"Не удалось скопировать тред",translatedSuffix:" (переведено)",translating:"Перевод...",translation:"Перевести",translationErrorContent:"Перевод не удался, но исходный текст все еще можно скопировать",translationErrorTitle:"Ошибка перевода",translationProvider:"Provider перевода:",translationToastContent:"Выполняется перевод...",translationToastTitle:"Перевод",unknownError:"Неизвестная ошибка"},ur:{allMode:"سب",clickToCopy:"کاپی کرنے کے لیے کلک کریں",collecting:"جمع ہو رہا ہے...",copyEmptyText:"کاپی کرنے کے لیے کوئی متن نہیں",copyFailed:"کلپ بورڈ میں کاپی کرنے میں ناکامی۔",copyFromStart:"{text} سے کاپی کریں",copyNoData:"کاپی کرنے کے لیے کوئی ڈیٹا نہیں (threadData is null)",copyNoText:"کاپی کرنے کے لیے کوئی متن نہیں (formattedText is null)",copySelectedTweets:"منتخب ٹویٹس کاپی کریں ({count})",copyThread:"تھریڈ کاپی کریں",copied:"کاپی ہو گیا",firstMode:"صرف پہلا",googleTranslate:"Google Translate",googleTranslateFailed:"Google Translate ناکام ہوا۔",internalErrorContent:"پروسیسنگ کے دوران غیر متوقع خرابی ہوئی۔",internalErrorTitle:"اندرونی خرابی",localAi:"مقامی AI",localAiEmptyResult:"مقامی AI نے خالی ترجمہ نتیجہ واپس کیا۔",localAiTranslationComplete:"مقامی AI ترجمہ مکمل ہو گیا۔",openAiCompatible:"OpenAI compatible",openAiEndpointMissing:"OpenAI compatible API endpoint سیٹ نہیں ہے۔",openAiKeyMissing:"OpenAI compatible API key سیٹ نہیں ہے۔ اسے سیٹنگز اسکرین سے سیٹ کریں۔",readyContent:"{summary} کاپی کرنے کے لیے کلک کریں۔",readyTitle:"تیار",resetConfirm:"سیٹنگز کو ڈیفالٹ پر ری سیٹ کریں؟",resetSelection:"انتخاب ری سیٹ کریں",selectTweet:"یہ ٹویٹ منتخب کریں",selectedCount:"{count} منتخب",selectedTitle:"منتخب ({order})",selectionAdded:"انتخاب شامل ہو گیا",selectionCleared:"تمام انتخاب صاف ہو گئے",selectionClearedAll:"تمام منتخب ٹویٹس صاف ہو گئے",selectionErrorContent:"منتخب ٹویٹس نہیں ملیں۔ صفحہ دوبارہ لوڈ کر کے دوبارہ کوشش کریں۔",selectionErrorTitle:"انتخاب کی خرابی",selectionRemoved:"انتخاب ہٹا دیا گیا",selectionReset:"انتخاب ری سیٹ",settings:"سیٹنگز",settingsApiEndpoint:"API endpoint",settingsApiKey:"API key",settingsApiKeyPlaceholder:"ضروری۔ اس provider کو استعمال کرنے سے پہلے key درج کریں۔",settingsCancel:"منسوخ",settingsLocalAi:"مقامی AI سیٹنگز",settingsModel:"ماڈل نام",settingsOpenAi:"OpenAI compatible سیٹنگز",settingsReset:"ری سیٹ",settingsResetContent:"سیٹنگز ڈیفالٹ پر ری سیٹ ہو گئیں",settingsResetTitle:"سیٹنگز ری سیٹ",settingsSave:"محفوظ کریں",settingsSavedContent:"سیٹنگز محفوظ ہو گئیں",settingsSavedTitle:"سیٹنگز محفوظ",settingsSystemPrompt:"سسٹم prompt",settingsTitle:"ترجمہ سیٹنگز",startPointReset:"آغاز نقطہ ری سیٹ کریں",startPointResetContent:"کاپی آغاز نقطہ ری سیٹ ہو گیا",startPointResetTitle:"آغاز نقطہ ری سیٹ",startPointSetContent:"{author} کی ٹویٹ کو آغاز نقطہ بنایا گیا",startPointSetTitle:"آغاز نقطہ سیٹ",startPointTitle:"یہاں سے کاپی شروع کریں",summaryChars:"حروف: {count}",summaryCopied:"{count} ٹویٹس کاپی ہو گئیں۔",summaryStartFrom:"{author} کی ٹویٹ سے، ",summaryThread:"{author} کا تھریڈ",threadCopyFailed:"تھریڈ کاپی کرنے میں ناکامی",translatedSuffix:" (ترجمہ شدہ)",translating:"ترجمہ ہو رہا ہے...",translation:"ترجمہ",translationErrorContent:"ترجمہ ناکام ہوا، لیکن اصل متن اب بھی کاپی کیا جا سکتا ہے",translationErrorTitle:"ترجمہ خرابی",translationProvider:"ترجمہ provider:",translationToastContent:"ترجمہ چل رہا ہے...",translationToastTitle:"ترجمہ ہو رہا ہے",unknownError:"نامعلوم خرابی"}},"en"),R=Ot({translations:Ft,defaultLocale:"ja",fallbackLocale:"en"});R.setLocale(R.detectBrowserLocale());const x=R.format,_=R.getDirection,d=R.t,E={LOADING:$(At),CLIPBOARD:$(Tt),COPY:$(Ct),SETTINGS:$(yt)};class Nt{shadowRoot=null;container=null;floatingContainer=null;dragState=null;customPosition=null;ignoreNextClick=false;mainButton=null;controlPanel=null;settingsModal=null;hoverInteractionConfigured=false;hoverPointerCount=0;hoverHideTimeout=null;storageKey="twitter-thread-copier-ui-position";handleResize=()=>{if(!this.floatingContainer||!this.customPosition)return;const{top:t,left:e}=this.clampPosition(this.customPosition.top,this.customPosition.left,this.floatingContainer);this.applyPosition(t,e,this.floatingContainer);};init(){this.shadowRoot||(this.container=document.createElement("div"),this.container.id="twitter-thread-copier-shadow-host",this.container.style.cssText="position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483647;",this.shadowRoot=this.container.attachShadow({mode:"closed"}),this.addStyles(),this.ensureFloatingContainer(),document.body.appendChild(this.container),window.addEventListener("resize",this.handleResize),g.log("Shadow DOM initialized"));}addStyles(){if(!this.shadowRoot)return;const t=document.createElement("style"),e=y.article;t.textContent=`
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
    `,this.shadowRoot.appendChild(t);}querySelector(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}appendChild(t){this.ensureFloatingContainer().appendChild(t);}extractTweetId(t){const e=t.querySelector('a[href*="/status/"]');return e&&(e.href.split("/").pop()?.split("?")[0]??"")||null}destroy(){this.container&&this.container.remove(),this.shadowRoot=null,this.container=null,this.floatingContainer=null,this.dragState=null,this.customPosition=null,this.ignoreNextClick=false,this.mainButton=null,this.controlPanel=null,this.hoverInteractionConfigured=false,this.hoverPointerCount=0,this.clearHoverHideTimeout(),window.removeEventListener("resize",this.handleResize),u.selectedTweetIds=[],g.log("Shadow DOM destroyed");}addSelectionButtons(){document.querySelectorAll(y.article).forEach(t=>{const e=this.extractTweetId(t);if(!e)return;let n=Array.from(t.children).find(r=>r.classList.contains("select-tweet-button"));n?n.dataset.tweetId||(n.dataset.tweetId=e):(n=document.createElement("button"),n.type="button",n.className="select-tweet-button",n.textContent="+",n.title=d("selectTweet"),n.dataset.tweetId=e,n.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),this.toggleTweetSelection(t,e);}),t.appendChild(n));}),this.refreshSelectionIndicators();}refreshSelectionIndicators(){const t=new Map;u.selectedTweetIds.forEach((e,n)=>{t.set(e,n+1);}),document.querySelectorAll(y.article).forEach(e=>{const n=this.extractTweetId(e);if(!n)return;const r=e.querySelector(".select-tweet-button");if(r)if(t.has(n)){const s=t.get(n)??0;e.classList.add("tweet-selected"),r.classList.add("active"),r.textContent=s>0?s.toString():"✓",r.title=x("selectedTitle",{order:String(s)});}else e.classList.remove("tweet-selected"),r.classList.remove("active"),r.textContent="+",r.title=d("selectTweet");}),this.updateSelectionResetButton();}toggleTweetSelection(t,e){const n=u.selectedTweetIds.includes(e);n?u.selectedTweetIds=u.selectedTweetIds.filter(i=>i!==e):u.selectedTweetIds=[...u.selectedTweetIds,e],u.isSecondStage&&(u.isSecondStage=false),u.collectedThreadData=null;const r=u.selectedTweetIds.length,s=r>0?x("selectedCount",{count:String(r)}):d("selectionCleared");this.refreshSelectionIndicators(),this.updateMainButtonText(),n?this.showToast(d("selectionRemoved"),s):this.showToast(d("selectionAdded"),s),g.log(`Selected tweet ids: ${u.selectedTweetIds.join(",")}`);}updateSelectionResetButton(){let t=this.querySelector(".reset-selection");u.selectedTweetIds.length>0?(t||(t=document.createElement("button"),t.className="reset-selection",t.textContent=d("resetSelection"),t.addEventListener("click",()=>this.resetSelection()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetSelection(){u.selectedTweetIds.length!==0&&(u.selectedTweetIds=[],u.isSecondStage&&(u.isSecondStage=false),u.collectedThreadData=null,this.refreshSelectionIndicators(),this.updateMainButtonText(),this.showToast(d("selectionReset"),d("selectionClearedAll")),g.log("Selections reset"));}addControlPanel(){if(this.querySelector(".control-panel-container"))return;const t=document.createElement("div");t.className="control-panel-container";const e=document.createElement("select");e.id="copy-mode-select",e.innerHTML=`
      <option value="all">${d("allMode")}</option>
      <option value="first">${d("firstMode")}</option>
      <option value="shitaraba">4K(shitaraba)</option>
      <option value="5ch">2K(5ch)</option>
    `,e.value=u.copyMode,e.addEventListener("change",p=>{u.copyMode=p.target.value,g.log(`Copy mode changed to: ${u.copyMode}`);}),t.appendChild(e);const n=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.id="translate-checkbox",r.checked=u.translateEnabled,r.addEventListener("change",p=>{u.translateEnabled=p.target.checked,g.log(`Translation ${u.translateEnabled?"enabled":"disabled"}`);}),n.appendChild(r),n.appendChild(document.createTextNode(d("translation"))),t.appendChild(n);const s=document.createElement("label");s.textContent=d("translationProvider");const i=document.createElement("select");i.id="provider-select",i.innerHTML=`
      <option value="local">${d("localAi")}</option>
      <option value="google">${d("googleTranslate")}</option>
      <option value="openai">${d("openAiCompatible")}</option>
    `;const a=localStorage.getItem("translationProvider");a==="local"||a==="google"||a==="openai"?i.value=a:i.value="local",i.addEventListener("change",p=>{const h=p.target.value;localStorage.setItem("translationProvider",h),g.log(`Translation provider set to ${h}`);});const l=document.createElement("div");l.appendChild(s),l.appendChild(i),t.appendChild(l);const c=document.createElement("button");c.className="settings-button",c.type="button",c.title=d("settings"),c.innerHTML=E.SETTINGS,c.addEventListener("click",()=>this.showSettingsModal()),t.appendChild(c),this.appendChild(t),this.controlPanel=t,this.configureHoverVisibility(),g.log("Control panel added to shadow DOM");}addMainButton(t){if(this.querySelector(".copy-thread-button"))return;const e=document.createElement("button");e.className="copy-thread-button",e.id="twitter-thread-copier-button",e.title=d("copyThread"),e.addEventListener("click",async()=>{if(this.ignoreNextClick){this.ignoreNextClick=false;return}u.isSecondStage?await t("clipboard"):await t("copy");}),this.appendChild(e),this.mainButton=e,this.configureHoverVisibility(),this.updateMainButtonText(),this.initializeDrag(e),g.log("Copy button added to shadow DOM");}updateMainButtonText(){const t=this.querySelector("#twitter-thread-copier-button");if(!t)return;if(u.isCollecting){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">${d("collecting")}</span>${E.LOADING}`;return}if(u.translationInProgress){t.classList.add("loading"),t.classList.remove("ready"),t.innerHTML=`<span class="text">${d("translating")}</span>${E.LOADING}`;return}if(t.classList.remove("loading"),t.classList.remove("ready"),u.isSecondStage){t.classList.add("ready"),t.innerHTML=`<span class="text">${d("clickToCopy")}</span>${E.CLIPBOARD}`;return}const e=u.selectedTweetIds.length;if(e>0){t.innerHTML=`<span class="text">${x("copySelectedTweets",{count:String(e)})}</span>${E.COPY}`;return}if(u.startFromTweetId){const n=u.startFromTweetText.length>20?u.startFromTweetText.substring(0,20)+"...":u.startFromTweetText;t.innerHTML=`<span class="text">${x("copyFromStart",{text:this.escapeHtml(n)})}</span>${E.COPY}`;return}t.innerHTML=`<span class="text">${d("copyThread")}</span>${E.COPY}`;}showToast(t,e){let n=this.querySelector(".copy-toast");n||(n=document.createElement("div"),n.className="copy-toast",this.appendChild(n)),n.innerHTML=`
      <div class="toast-title">${this.escapeHtml(t)}</div>
      <div class="toast-content">${this.escapeHtml(e.substring(0,100))}</div>
    `,n.dir=_(),n.classList.remove("visible"),setTimeout(()=>{n?.classList.add("visible"),setTimeout(()=>{n?.classList.remove("visible"),setTimeout(()=>n?.remove(),500);},3e3);},10);}updateAllUI(){this.addControlPanel(),this.addSelectionButtons(),this.addStartPointButtons(),this.updateResetButton();}addStartPointButtons(){document.querySelectorAll(y.article).forEach(t=>{if(Array.from(t.children).find(s=>s.classList.contains("start-point-button")))return;const n=this.extractTweetId(t);if(!n)return;const r=document.createElement("button");r.className="start-point-button",r.textContent="★",r.title=d("startPointTitle"),r.dataset.tweetId=n,u.startFromTweetId===n&&(r.classList.add("active"),r.textContent="✓",t.classList.add("start-point-set")),r.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.setStartPoint(t,n);}),t.appendChild(r);});}setStartPoint(t,e){u.startFromTweetId&&document.querySelectorAll(".start-point-set").forEach(i=>{i.classList.remove("start-point-set");const a=i.querySelector(".start-point-button");a&&(a.classList.remove("active"),a.textContent="★");});const n=t.querySelector(y.userName)?.innerText??"",r=t.querySelector(y.tweetText)?.innerText??"";u.startFromTweetId=e,u.startFromTweetAuthor=n,u.startFromTweetText=r,t.classList.add("start-point-set");const s=t.querySelector(".start-point-button");s&&(s.classList.add("active"),s.textContent="✓"),this.updateResetButton(),this.updateMainButtonText(),this.showToast(d("startPointSetTitle"),x("startPointSetContent",{author:n})),g.log(`Start point set: ${e} by ${n}`);}updateResetButton(){let t=this.querySelector(".reset-start-point");u.startFromTweetId?(t||(t=document.createElement("button"),t.className="reset-start-point",t.textContent=d("startPointReset"),t.addEventListener("click",()=>this.resetStartPoint()),this.appendChild(t)),t.classList.add("visible")):t?.classList.remove("visible");}resetStartPoint(){u.startFromTweetId=null,u.startFromTweetAuthor="",u.startFromTweetText="",document.querySelectorAll(".start-point-set").forEach(t=>{t.classList.remove("start-point-set");const e=t.querySelector(".start-point-button");e&&(e.classList.remove("active"),e.textContent="★");}),this.updateResetButton(),this.updateMainButtonText(),this.showToast(d("startPointResetTitle"),d("startPointResetContent")),g.log("Start point reset");}configureHoverVisibility(){if(this.hoverInteractionConfigured||!this.mainButton||!this.controlPanel||!this.supportsHover())return;this.hoverInteractionConfigured=true;const t=this.ensureFloatingContainer(),e=this.controlPanel;e.classList.add("hover-hidden");const n=()=>{this.clearHoverHideTimeout(),t.classList.add("show-hover-controls");},r=()=>{this.clearHoverHideTimeout(),this.hoverHideTimeout=window.setTimeout(()=>{this.hoverPointerCount===0&&!this.hasFocusWithin(t)&&t.classList.remove("show-hover-controls");},150);},s=()=>{this.hoverPointerCount+=1,n();},i=a=>{this.hoverPointerCount=Math.max(0,this.hoverPointerCount-1);const l=a.relatedTarget;l&&t.contains(l)||r();};this.mainButton.addEventListener("pointerenter",s),this.mainButton.addEventListener("pointerleave",i),e.addEventListener("pointerenter",s),e.addEventListener("pointerleave",i),t.addEventListener("focusin",n),t.addEventListener("focusout",a=>{const l=a.relatedTarget;l&&t.contains(l)||r();});}clearHoverHideTimeout(){this.hoverHideTimeout!==null&&(window.clearTimeout(this.hoverHideTimeout),this.hoverHideTimeout=null);}hasFocusWithin(t){const e=document.activeElement;return !!e&&t.contains(e)}supportsHover(){try{return window.matchMedia("(hover: hover)").matches}catch(t){return g.warn("hover media query check failed",t),false}}ensureFloatingContainer(){if(!this.shadowRoot)throw new Error("Shadow root is not initialized");if(!this.floatingContainer){const t=document.createElement("div");t.className="floating-ui-container",this.shadowRoot.appendChild(t);const e=this.loadPosition();e&&(this.customPosition=e,this.applyPosition(e.top,e.left,t)),this.floatingContainer=t;}return this.floatingContainer}initializeDrag(t){if(t.dataset.dragInitialized==="true")return;t.dataset.dragInitialized="true",t.addEventListener("pointerdown",n=>{if(!n.isPrimary)return;const r=this.ensureFloatingContainer(),s=r.getBoundingClientRect();this.dragState={pointerId:n.pointerId,startX:n.clientX,startY:n.clientY,initialTop:this.customPosition?.top??s.top,initialLeft:this.customPosition?.left??s.left,moved:false},r.classList.add("dragging"),t.classList.add("dragging");try{t.setPointerCapture(n.pointerId);}catch(i){g.warn("pointer capture failed",i);}}),t.addEventListener("pointermove",n=>{if(!this.dragState||n.pointerId!==this.dragState.pointerId)return;const r=this.floatingContainer;if(!r)return;const s=n.clientX-this.dragState.startX,i=n.clientY-this.dragState.startY;if(!this.dragState.moved){if(Math.abs(s)<4&&Math.abs(i)<4)return;this.dragState.moved=true,r.classList.add("has-custom-position"),r.style.bottom="auto",r.style.right="auto";}const a=this.dragState.initialTop+i,l=this.dragState.initialLeft+s,{top:c,left:p}=this.clampPosition(a,l,r);this.applyPosition(c,p,r);});const e=n=>{!this.dragState||n.pointerId!==this.dragState.pointerId||(t.hasPointerCapture(n.pointerId)&&t.releasePointerCapture(n.pointerId),t.classList.remove("dragging"),this.floatingContainer?.classList.remove("dragging"),this.dragState.moved&&(this.ignoreNextClick=true,this.handleResize(),this.savePosition()),this.dragState=null);};t.addEventListener("pointerup",e),t.addEventListener("pointercancel",e);}clampPosition(t,e,n){const s=n.offsetHeight||0,i=n.offsetWidth||0,a=Math.max(16,window.innerHeight-s-16),l=Math.max(16,window.innerWidth-i-16);return {top:Math.min(Math.max(16,t),a),left:Math.min(Math.max(16,e),l)}}applyPosition(t,e,n){const r=n??this.ensureFloatingContainer();r.style.top=`${t}px`,r.style.left=`${e}px`,r.style.bottom="auto",r.style.right="auto",r.classList.add("has-custom-position"),this.customPosition={top:t,left:e},this.savePosition();}loadPosition(){try{const t=window.localStorage.getItem(this.storageKey);if(!t)return null;const e=JSON.parse(t);return typeof e.top=="number"&&typeof e.left=="number"&&Number.isFinite(e.top)&&Number.isFinite(e.left)?{top:e.top,left:e.left}:(g.warn("stored position is invalid",e),null)}catch(t){return g.warn("failed to load UI position",t),null}}savePosition(){if(this.customPosition)try{const t=JSON.stringify(this.customPosition);window.localStorage.setItem(this.storageKey,t);}catch(t){g.warn("failed to save UI position",t);}}showSettingsModal(){if(this.settingsModal){this.settingsModal.classList.add("visible");return}const t=document.createElement("div");t.className="settings-modal-overlay",t.dir=_();const e=document.createElement("div");e.className="settings-modal",e.dir=_();const n=q();if(e.innerHTML=`
      <h2>${d("settingsTitle")}</h2>
      
      <h3>${d("settingsLocalAi")}</h3>
      <label>${d("settingsApiEndpoint")}</label>
      <input type="text" id="local-ai-endpoint" value="${this.escapeHtml(n.localAiEndpoint)}" />
      
      <label>${d("settingsSystemPrompt")}</label>
      <textarea id="local-ai-system-prompt">${this.escapeHtml(n.localAiSystemPrompt)}</textarea>
      
      <h3>${d("settingsOpenAi")}</h3>
      <label>${d("settingsApiEndpoint")}</label>
      <input type="text" id="openai-endpoint" value="${this.escapeHtml(n.openaiEndpoint)}" />
      
      <label>${d("settingsModel")}</label>
      <input type="text" id="openai-model" value="${this.escapeHtml(n.openaiModel)}" />
      
      <label>${d("settingsSystemPrompt")}</label>
      <textarea id="openai-system-prompt">${this.escapeHtml(n.openaiSystemPrompt)}</textarea>
      
      <label>${d("settingsApiKey")}</label>
      <input type="text" id="openai-api-key" value="${this.escapeHtml(n.openaiApiKey)}" placeholder="${d("settingsApiKeyPlaceholder")}" />
      
      <div class="settings-modal-buttons">
        <button class="btn-reset" type="button">${d("settingsReset")}</button>
        <button class="btn-cancel" type="button">${d("settingsCancel")}</button>
        <button class="btn-save" type="button">${d("settingsSave")}</button>
      </div>
    `,t.appendChild(e),!this.shadowRoot)return;this.shadowRoot.appendChild(t),this.settingsModal=t;const r=e.querySelector(".btn-save"),s=e.querySelector(".btn-cancel"),i=e.querySelector(".btn-reset");r&&r.addEventListener("click",()=>{const a={localAiEndpoint:e.querySelector("#local-ai-endpoint")?.value??n.localAiEndpoint,localAiSystemPrompt:e.querySelector("#local-ai-system-prompt")?.value??n.localAiSystemPrompt,openaiEndpoint:e.querySelector("#openai-endpoint")?.value??n.openaiEndpoint,openaiModel:e.querySelector("#openai-model")?.value??n.openaiModel,openaiSystemPrompt:e.querySelector("#openai-system-prompt")?.value??n.openaiSystemPrompt,openaiApiKey:e.querySelector("#openai-api-key")?.value??n.openaiApiKey};ct(a),this.hideSettingsModal(),this.showToast(d("settingsSavedTitle"),d("settingsSavedContent"));}),s&&s.addEventListener("click",()=>{this.hideSettingsModal();}),i&&i.addEventListener("click",()=>{confirm(d("resetConfirm"))&&(Et(),this.hideSettingsModal(),this.showToast(d("settingsResetTitle"),d("settingsResetContent")));}),t.addEventListener("click",a=>{a.target===t&&this.hideSettingsModal();}),requestAnimationFrame(()=>{t.classList.add("visible");}),g.log("Settings modal opened");}hideSettingsModal(){this.settingsModal&&(this.settingsModal.classList.remove("visible"),setTimeout(()=>{this.settingsModal?.remove(),this.settingsModal=null;},300),g.log("Settings modal closed"));}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}}const w=new Nt;var qt=typeof GM_notification<"u"?GM_notification:void 0,Ut=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;const _t=Ut;function Dt(o,t,e,n){qt({text:o,title:t,image:e,onclick:n});}const Ht="https://twitter.com",Bt="https://t.co",Gt="https://video.twimg.com",W=o=>`${Ht}/i/status/${o}`,zt=o=>`${Gt}/tweet_video/${o}.mp4`,Kt=/https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/,Wt=`${Bt}/`,Vt="https://translate.googleapis.com/translate_a/single";async function jt(){try{const o=[],t=new Set;let e="",n="";const r=window.location.href,s=u.copyMode==="first";let i=!1;const a=window.scrollY;async function l(){if(i)return;const p=Array.from(document.querySelectorAll(y.article));p.length>0&&!e&&(e=j(p[0]),n=V(p[0]));for(const h of p){const f=h.querySelector(y.statusLink);if(!f)continue;const T=f.href.split("/"),m=T.indexOf("status");if(m===-1||m+1>=T.length)continue;const C=T[m+1].split("?")[0];if(t.has(C))continue;const A=j(h);if(e&&A!==e)continue;let S=V(h);A===e&&!S&&n&&(S=n);const L=h.querySelector(y.tweetText);let B="";L&&(B=await dt(L));const G=h.querySelector("time"),z=G?G.getAttribute("datetime"):"",U=z?new Date(z):null,K=U?.getTime()??0,pt=U&&Number.isFinite(K)?te(U):"",gt=Xt(h),mt=await Yt(h),ht=t.size===0?r:f.href?f.href.split("?")[0]:"";if(o.push({id:C,author:A,handle:S,text:B,time:pt,timestampMs:K,url:ht,mediaUrls:gt,quotedTweet:mt}),t.add(C),s){i=!0;break}}}async function c(){try{if(await J(),await l(),i)return;let f=o.length,T=0;for(let m=0;m<30;m++)try{if(window.scrollBy(0,window.innerHeight*.7),await new Promise(C=>setTimeout(C,700)),await J(),await l(),i)return;if(o.length===f){if(T++,T>=3)break}else f=o.length,T=0;}catch(C){g.error(`スクロール処理エラー (試行 ${m+1}): ${C.message}`);continue}try{window.scrollTo(0,a);}catch(m){g.error(`スクロール位置復元エラー: ${m.message}`);}}catch(f){throw g.error(`スクロール収集処理エラー: ${f.message}`),f}}return await c(),o.sort((p,h)=>p.timestampMs-h.timestampMs),o}catch(o){return g.error(`ツイート収集中にエラーが発生: ${o.message}`),g.error(`エラースタック: ${o.stack}`),[]}}function V(o){try{const e=Array.from(o.querySelectorAll("span")).find(s=>{try{const i=s.textContent?s.textContent.trim():"";return i.startsWith("@")&&!i.includes(" ")&&i.length>1}catch{return !1}});if(e)return e.textContent.trim();const n=Array.from(o.querySelectorAll(y.userLink));for(const s of n)try{const i=s.getAttribute("href");if(i&&!i.includes("/status/")&&i.length>1&&!i.includes("/i/"))return "@"+i.replace(/^\//,"")}catch{continue}const r=o.querySelector(y.userName);if(r){const s=r.querySelectorAll("span");for(const i of Array.from(s))try{const a=i.textContent?i.textContent.trim():"";if(a.startsWith("@")&&!a.includes(" "))return a}catch{continue}}return ""}catch(t){return g.error(`ユーザーハンドル取得エラー: ${t.message}`),""}}function j(o){try{const t=o.querySelector(y.userNameLinkSpan);return t&&t.textContent?t.textContent.trim():""}catch(t){return g.error(`ユーザー名取得エラー: ${t.message}`),""}}async function Yt(o){const t=o.querySelector(y.quotedLink);let e=null;if(t)try{const n=t.closest(y.roleLink);n&&(e=await Y(n));}catch(n){g.error(`引用ツイート取得エラー: ${n.message}`);}else try{const n=o.innerText||"",r=n.includes("引用")||n.includes("Quote")||n.includes("quote"),s=o.querySelectorAll(y.roleLink);if(s.length>0&&r)for(let i=0;i<s.length;i++){const a=s[i],l=a.innerText||"";if(l.includes("@")&&(l.includes("年")||l.includes("時間")||l.includes("分")||l.includes("日")))try{const c=await Y(a);if(c&&c.author&&c.text){e=c;break}}catch(c){g.error(`代替引用ツイート抽出エラー: ${c.message}`);}}}catch(n){g.error(`代替引用ツイート検索エラー: ${n.message}`);}return e}async function Y(o){const t=o.querySelector(y.quotedAuthor),e=t?t.textContent.trim():"",n=o.querySelector(y.quotedHandle),r=n?n.textContent.trim():"";let s="";const i=o.querySelector(y.tweetText);if(i)s=await dt(i);else {const T=(o.innerText||"").split(`
`).map(A=>A.trim()).filter(A=>A);let m=-1;for(let A=0;A<T.length;A++)if(T[A].includes(r)){m=A;break}const C=m+1;m>=0&&C<T.length&&(s=T.slice(C+1).join(`
`));}const a=[];o.querySelectorAll(y.tweetPhoto).forEach(f=>{const T=f.querySelector(y.tweetMediaImage);if(T){const m=P(T.src);m&&!a.includes(m)&&a.push(m);}}),a.length===0&&(o.querySelectorAll(y.roleGroup).forEach(m=>{m.querySelectorAll(y.tweetMediaImage).forEach(A=>{const S=P(A.src);S&&!a.includes(S)&&a.push(S);});}),o.querySelectorAll(y.tweetMediaImage).forEach(m=>{const C=P(m.src);C&&!a.includes(C)&&a.push(C);}));let c="",p="";const h=o.querySelectorAll(y.statusLink);for(const f of Array.from(h)){const T=f.href;if(T&&T.includes("/status/")){const m=T.split("/"),C=m.indexOf("status");if(C!==-1&&C+1<m.length){c=m[C+1].split("?")[0],p=T;break}}}return e&&s?{author:e,handle:r,text:s,id:c,url:p,mediaUrls:a}:null}function Xt(o){const t=[];return o.querySelectorAll(y.tweetPhoto).forEach(r=>{const s=r.querySelector(y.tweetMediaImage);if(s){const i=P(s.src);i&&!t.includes(i)&&t.push(i);}}),o.querySelectorAll("video").forEach(r=>{if(r.src&&r.src.startsWith("blob:"))try{if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const a=X(r.poster);if(a&&!t.includes(a)){t.push(a);return}}const i=o.querySelector(y.statusLink);if(i){const a=i.href.split("/"),l=a.indexOf("status");if(l!==-1&&l+1<a.length){const c=a[l+1].split("?")[0],p=W(c);t.includes(p)||t.push(`[動画] ${p}`);}}}catch(i){g.error("Error processing blob URL: "+i);}else {if(r.poster&&r.poster.includes("pbs.twimg.com/tweet_video_thumb")){const i=X(r.poster);i&&!t.includes(i)&&t.push(i);}r.src&&r.src.includes("video.twimg.com")&&(t.includes(r.src)||t.push(r.src));}r.querySelectorAll("source").forEach(i=>{if(i.src&&i.src.includes("video.twimg.com"))t.includes(i.src)||t.push(i.src);else if(i.src&&i.src.startsWith("blob:")){const a=o.querySelector(y.statusLink);if(a){const l=a.href.split("/"),c=l.indexOf("status");if(c!==-1&&c+1<l.length){const p=l[c+1].split("?")[0],h=W(p);t.includes(h)||t.push(`[動画] ${h}`);}}}});}),t.length===0&&o.querySelectorAll(y.roleGroup).forEach(s=>{s.querySelectorAll(y.tweetMediaImage).forEach(a=>{const l=P(a.src);l&&!t.includes(l)&&t.push(l);});}),t.length===0&&o.querySelectorAll(y.tweetMediaImage).forEach(s=>{const i=P(s.src);i&&!t.includes(i)&&t.push(i);}),t}function P(o){if(!o||typeof o!="string"||!o.includes("pbs.twimg.com/media"))return null;try{const t=o.match(/format=([^&]+)/),e=t?t[1]:"jpg",n=o.split("?")[0];if(!n||n.length===0)return g.error(`無効なベースURL: ${o}`),null;const r=n+"."+e;try{return new URL(r),r}catch(s){return g.error(`無効なURL形式: ${r}, エラー内容: ${s.message}`),null}}catch(t){return g.error(`メディアURL処理エラー: ${t.message}`),null}}function X(o){if(!o||!o.includes("tweet_video_thumb"))return null;try{const t=o.match(/tweet_video_thumb\/([^.]+)/);if(!t||!t[1])return null;const e=t[1];return zt(e)}catch(t){return g.error(`動画URL生成エラー: ${t.message}`),null}}async function dt(o){try{const t=o.cloneNode(!0);return await Jt(t)}catch(t){return g.error(`ツイートテキスト取得エラー: ${t.message}`),o.innerText??""}}async function Jt(o){const t=Array.from(o.querySelectorAll("a[href]")),e=[];for(const n of t){const r=n.textContent??"";if(Qt(n,r)){const s=r.trim();if(/^https?:\/\//i.test(s)){e.push(Promise.resolve({anchor:n,resolvedUrl:s}));continue}const i=n.href;i&&i.startsWith(Wt)&&e.push(Zt(i).then(a=>({anchor:n,resolvedUrl:a})));}}if(e.length>0){const n=await Promise.all(e);for(const{anchor:r,resolvedUrl:s}of n)if(s){const i=document.createTextNode(s);r.replaceWith(i);}}return o.innerText}function Zt(o){return new Promise(t=>{_t({method:"HEAD",url:o,timeout:1e4,onload:e=>{t(e.finalUrl||o);},onerror:()=>{t(o);},ontimeout:()=>{t(o);}});})}function Qt(o,t){const e=t.trim();return /^https?:\/\//i.test(e)?true:/^https?:\/\//i.test(o.getAttribute("href")??"")?!(e.startsWith("@")||e.startsWith("#")):false}async function J(){try{const o=document.querySelectorAll(y.tweetButtonsWithinArticle);let t=0;for(const e of Array.from(o))try{const n=e.textContent?e.textContent.trim():"";(n==="さらに表示"||n==="Show more"||n.match(/もっと見る/i)||n.match(/show more/i))&&!e.hasAttribute("href")&&!e.querySelector("a")&&e.closest(y.tweetRoot)&&e.click&&(e.click(),t++,await new Promise(s=>setTimeout(s,100)));}catch(n){g.error(`個別ツイート展開エラー: ${n.message}`);continue}return t}catch(o){return g.error(`ツイート展開処理エラー: ${o.message}`),0}}function te(o,t=new Date){const e=o.getFullYear(),n=String(o.getMonth()+1).padStart(2,"0"),r=String(o.getDate()).padStart(2,"0"),s=String(o.getHours()).padStart(2,"0"),i=String(o.getMinutes()).padStart(2,"0");return `${e}年${n}月${r}日 ${s}:${i} (${ee(o,t)})`}function ee(o,t){const e=t.getTime()-o.getTime(),n=e>=0?"前":"後",r=Math.floor(Math.abs(e)/6e4);if(r<1)return e>=0?"たった今":"1分未満後";const s=r%60,i=Math.floor(r/60),a=i%24,l=Math.floor(i/24),c=l%30,p=Math.floor(l/30),h=p%12,f=Math.floor(p/12);return f>0?h>0?`${f}年${h}か月${n}`:`${f}年${n}`:p>0?c>0?`${p}か月${c}日${n}`:`${p}か月${n}`:l>0?a>0?`${l}日${a}時間${n}`:`${l}日${n}`:i>0?s>0?`${i}時間${s}分${n}`:`${i}時間${n}`:`${r}分${n}`}const Z=150,oe=.9144,ne=.453592,re=3.78541,F="[0-9０-９]",ie=`${F}{1,3}(?:[,，]${F}{3})*`,se=`${F}+`,ae=`(?:[\\.．]${F}+)?`,Q=`(?:${ie}|${se})${ae}`,tt="(?:兆|億|万)",v=`${Q}(?:${tt}${Q})*${tt}?`,le=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${v})\\s*(?<currencyPrefix>米|US|ＵＳ)?ドル`,"gu"),ce=new RegExp(`(?<symbol>(?:US\\$|ＵＳ\\$|\\$))\\s*(?<amount>${v})(?!\\s*(?:米|US|ＵＳ)?ドル)`,"gu"),de=new RegExp(`(?<amount>${v})\\s*ヤード`,"gu"),ue=new RegExp(`(?<amount>${v})\\s*ポンド`,"gu"),pe=new RegExp(`(?<amount>${v})\\s*ガロン`,"gu"),ge=new RegExp(`(?<amount>${v})\\s*(?<unit>(?:[kKｋＫmMｍＭgGｇＧtTｔＴ]?[wWｗＷ]|(?:キロ|メガ|ギガ|テラ)ワット))(?![A-Za-zａ-ｚＡ-Ｚ])`,"gu"),me=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${v})\\s*(?<unit>[kKｋＫmMｍＭgGｇＧtTｔＴbBｂＢ])(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu"),he=new RegExp(`(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${v})\\s*(?<unit>ミリオン|ビリオン|トリリオン|キロ|メガ|ギガ|テラ|million|Million|billion|Billion|trillion|Trillion|kilo|Kilo|mega|Mega|giga|Giga|tera|Tera)(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,"gu");function fe(o){if(!o||o.length===0)return o;let t=o;return t=b(t,le,["円","JPY"],e=>ot(e*Z)),t=b(t,ce,["円","JPY"],e=>ot(e*Z)),t=b(t,de,["メートル","m","ｍ"],e=>`${D(e*oe)}メートル`),t=b(t,ue,["キログラム","kg","㎏","キロ"],e=>`${D(e*ne)}キログラム`),t=b(t,pe,["リットル","l","L","ℓ"],e=>`${D(e*re)}リットル`),t=b(t,ge,["ワット","W","w","Ｗ","ｗ"],(e,n,r)=>{const s=n.unit??"";if(xe(r))return null;const i=Se(s);if(i===null)return null;const a=e*i;return O(a,"ワット")}),t=b(t,me,["万","億","兆"],(e,n,r)=>{const s=n.unit??"",i=nt(s);return i===null||et(s,r)?null:O(e*i)}),t=b(t,he,["万","億","兆"],(e,n,r)=>{const s=n.unit??"",i=nt(s);return i===null||et(s,r)?null:O(e*i)}),t}function b(o,t,e,n){const r=[...o.matchAll(t)];if(r.length===0)return o;let s="",i=0;for(const a of r){const l=a.index??0,c=l+a[0].length,p=o.slice(i,l);s+=p;const h=a.groups??{},f=h.amount??"",T=Ae(f),m=Te(o,c);if(T===null){s+=a[0],m?(s+=m.whitespace+m.openChar+m.inside+m.closeChar,i=m.endIndex):i=c;continue}if(m&&e.some(S=>m.inside.includes(S))){s+=a[0],s+=m.whitespace+m.openChar+m.inside+m.closeChar,i=m.endIndex;continue}const A=n(T,h,{text:o,match:a,startIndex:l,endIndex:c,followingParentheses:m});if(A===null){s+=a[0],m?(s+=m.whitespace+m.openChar+m.inside+m.closeChar,i=m.endIndex):i=c;continue}if(m){const S=m.inside.trim(),L=S.length>0?`${A}、${S}`:A;s+=a[0]+m.whitespace+m.openChar+L+m.closeChar,i=m.endIndex;}else s+=`${a[0]}（${A}）`,i=c;}return s+=o.slice(i),s}function Te(o,t){let e=t,n="";for(;e<o.length;){const l=o[e];if(Ce(l)){n+=l,e+=1;continue}break}if(e>=o.length)return null;const r=o[e];if(r!=="("&&r!=="（")return null;const s=r==="("?")":"）",i=ye(o,e,r,s);if(i===-1)return null;const a=o.slice(e+1,i);return {whitespace:n,openChar:r,closeChar:s,inside:a,endIndex:i+1}}function ye(o,t,e,n){let r=0;for(let s=t;s<o.length;s+=1){const i=o[s];if(i===e)r+=1;else if(i===n&&(r-=1,r===0))return s}return  -1}function Ce(o){return /\s/u.test(o)}function et(o,t){if(!be(o))return  false;const e=t.text.slice(t.endIndex,t.endIndex+6);return /^(?:バイト|ビット|ヘルツ|メートル|リットル|グラム|ワット|ジュール|パスカル|ボルト|アンペア)/u.test(e)}function Ae(o){if(!o)return null;const t=o.replace(/[０-９]/gu,a=>String.fromCharCode(a.charCodeAt(0)-65248)).replace(/[，]/gu,",").replace(/[．]/gu,".").replace(/,/gu,"").replace(/\s+/gu,"");if(t.length===0)return null;const e=/(\d+(?:\.\d+)?)(兆|億|万)?/gu;let n=0,r=false,s=null,i;for(;(i=e.exec(t))!==null;){if(i[0].length===0)continue;const a=Number.parseFloat(i[1]);if(Number.isNaN(a))return null;r=true;const l=i[2];l?n+=a*we(l):s=a;}return r?(s!==null&&(n+=s),n):null}function we(o){switch(o){case "万":return 1e4;case "億":return 1e8;case "兆":return 1e12;default:return 1}}function O(o,t=""){const e=Math.abs(o),n=[{threshold:1e12,divisor:1e12,suffix:`兆${t}`},{threshold:1e8,divisor:1e8,suffix:`億${t}`},{threshold:1e4,divisor:1e4,suffix:`万${t}`}];for(const r of n)if(e>=r.threshold){const s=o/r.divisor;return `${I(s)}${r.suffix}`}return t.length>0?`${I(o)}${t}`:I(o)}function ot(o){return O(o,"円")}function D(o){return Math.abs(o)<1?I(o,3):I(o,2)}function I(o,t){const e=Math.abs(o);let n=t;n===void 0&&(e>=100?n=0:e>=10?n=1:e>=1?n=2:n=3);const r=Number.isFinite(o)?Number.parseFloat(o.toFixed(n)):0;return new Intl.NumberFormat("ja-JP",{maximumFractionDigits:n,minimumFractionDigits:0}).format(r)}function Se(o){if(!o)return null;const t=o.replace(/[Ａ-Ｚａ-ｚ]/gu,r=>String.fromCharCode(r.charCodeAt(0)-65248)).replace(/\s+/gu,"");if(t.length===0)return null;const e=t.toUpperCase(),n=t[0];if(e==="KW"&&(n==="K"||n==="k"))return 1e3;if(e==="MW"&&n==="M")return 1e6;if(e==="GW"&&n==="G")return 1e9;if(e==="TW"&&n==="T")return 1e12;if(e==="W"&&(n==="W"||n==="w"))return 1;switch(t){case "ワット":return 1;case "キロワット":return 1e3;case "メガワット":return 1e6;case "ギガワット":return 1e9;case "テラワット":return 1e12;default:return null}}function xe(o){return o.text.slice(o.endIndex,o.endIndex+1)==="時"}function nt(o){switch(o.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase()){case "k":case "kilo":case "キロ":return 1e3;case "m":case "mega":case "million":case "ミリオン":case "メガ":return 1e6;case "b":case "billion":case "g":case "giga":case "ビリオン":case "ギガ":return 1e9;case "t":case "tera":case "trillion":case "テラ":case "トリリオン":return 1e12;default:return null}}function be(o){const t=o.replace(/[Ａ-Ｚａ-ｚ]/gu,e=>String.fromCharCode(e.charCodeAt(0)-65248)).trim().toLowerCase();return t==="k"||t==="kilo"||t==="キロ"||t==="m"||t==="mega"||t==="メガ"||t==="g"||t==="giga"||t==="ギガ"||t==="t"||t==="tera"||t==="テラ"}const ve=Vt,Ee=/(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;function Pe(){const o=localStorage.getItem("translationProvider");return o==="local"||o==="google"||o==="openai"?o:"local"}async function Ie(o){const t=o.map(qe),e=t.map(i=>({tweet:i,textSegments:st(i.text),quotedSegments:i.quotedTweet?st(i.quotedTweet.text):null})),n=[];let r=false;for(const i of e){for(const a of i.textSegments)rt(a,n);if(i.quotedSegments)for(const a of i.quotedSegments)rt(a,n);}if(n.length===0)return {tweets:t,hasTranslation:false};let s=false;for(let i=0;i<n.length;i++){const a=n[i];try{const{text:c,provider:p}=await $e(a.original),h=p==="none"?c:fe(c);a.translated=h,p==="local"&&(r=!0),!s&&h!==a.original&&(s=!0);}catch(c){g.error(`セグメント翻訳に失敗: ${c.message}`),a.translated=a.original;}i<n.length-1&&await H(1e3+Math.random()*500);}for(const i of e)i.tweet.text=it(i.textSegments),i.quotedSegments&&i.tweet.quotedTweet&&(i.tweet.quotedTweet.text=it(i.quotedSegments));return r&&Dt(d("localAiTranslationComplete"),"Twitter Thread Copier"),{tweets:t,hasTranslation:s}}function rt(o,t){if(o.kind==="text"){if(o.original.trim().length===0){o.translated=o.original;return}t.push(o);}}function it(o){if(o.length===0)return "";let t="";for(const e of o)if(e.kind==="fixed"){const n=e.value;ut(n)&&(t=Me(t)),t+=n;}else t+=e.translated??e.original;return t}function st(o){if(!o)return [];const t=/(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g,e=[];let n=0,r;for(;(r=t.exec(o))!==null;)r.index>n&&e.push({kind:"text",original:o.slice(n,r.index)}),e.push({kind:"fixed",value:Re(r[0])}),n=r.index+r[0].length;return n<o.length&&e.push({kind:"text",original:o.slice(n)}),e.length===0&&e.push({kind:"text",original:o}),e}function Re(o){if(ut(o)){const t=Le(o);return t.length>0?t:o}return o}function ut(o){return /^https?:\/\//i.test(o.trim())}function Le(o){return o.replace(Ee,"").replace(/\s+/g,"").replace(/\u2026+$/gu,"")}function Me(o){return o.length===0?o:o.replace(/：\s*$/u,": ").replace(/:\s*$/u,": ")}async function $e(o){if(o.trim().length===0)return {text:o,provider:"none"};const t=Pe();if(t==="local"){const e=await ke(o);return e?{text:e,provider:"local"}:{text:o,provider:"none"}}if(t==="google")try{return {text:await Oe(o),provider:"google"}}catch(e){return g.error(`Google翻訳にも失敗しました: ${e.message}`),{text:o,provider:"none"}}if(t==="openai"){Fe();const e=await Ne(o);return e?{text:e,provider:"openai"}:{text:o,provider:"none"}}return {text:o,provider:"none"}}async function ke(o){try{const t=q(),e=`<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${o}
<|plamo:op|>output lang=ja`,n=await new Promise((i,a)=>{GM_xmlhttpRequest({method:"POST",url:t.localAiEndpoint,headers:{"Content-Type":"application/json"},data:JSON.stringify({model:"plamo-13b-instruct",messages:[{role:"system",content:t.localAiSystemPrompt},{role:"user",content:e}],temperature:0,max_tokens:8192,stream:!1}),timeout:12e4,onload:l=>l.status>=200&&l.status<300?i(l):a(new Error(`API error: ${l.status}`)),onerror:l=>a(l),ontimeout:()=>a(new Error("Timeout"))});}),s=JSON.parse(n.responseText)?.choices?.[0]?.message?.content;if(s&&s.trim().length>0)return g.log("ローカルAIでの翻訳に成功しました。"),s;throw new Error(d("localAiEmptyResult"))}catch(t){return g.error(`ローカルAIでの翻訳に失敗: ${t.message}`),null}}async function Oe(o){const t="auto";let n=0;const r=3;for(;n<r;)try{const s=`${ve}?client=gtx&sl=${t}&tl=ja&dt=t&dt=bd&dj=1&q=${encodeURIComponent(o)}`,i=await new Promise((c,p)=>{GM_xmlhttpRequest({method:"GET",url:s,timeout:15e3,onload:h=>h.status>=200&&h.status<300?c(h):p(new Error(`API error: ${h.status}`)),onerror:h=>p(h),ontimeout:()=>p(new Error("Timeout"))});}),a=JSON.parse(i.responseText);if(!a?.sentences?.length)throw new Error("Invalid translation response format.");const l=a.sentences.map(c=>c?.trans??"").join("");if(!l.trim())throw new Error("Translation result is empty");return l}catch(s){if(n++,g.error(`Google翻訳試行 ${n}/${r} 失敗: ${s.message}`),n>=r)throw s;await H(1e3*Math.pow(2,n));}throw new Error(d("googleTranslateFailed"))}function Fe(){q().openaiApiKey||g.warn(d("openAiKeyMissing"));}async function Ne(o){const t=q();if(!t.openaiEndpoint)return g.error(d("openAiEndpointMissing")),null;let e=0;const n=3,r=2e3;for(;e<n;)try{const s={"Content-Type":"application/json"};t.openaiApiKey&&(s.Authorization=`Bearer ${t.openaiApiKey}`),t.openaiEndpoint.includes("openrouter.ai")&&(s["HTTP-Referer"]=window.location.href,s["X-Title"]="Twitter Thread Copier");const a=`以下の英文を日本語に翻訳してください。翻訳結果のみを出力し、説明や注釈は不要です。

${o}`,l=await new Promise((h,f)=>{GM_xmlhttpRequest({method:"POST",url:t.openaiEndpoint,headers:s,data:JSON.stringify({model:t.openaiModel,messages:[{role:"system",content:t.openaiSystemPrompt},{role:"user",content:a}],temperature:0,max_tokens:8192}),timeout:6e4,onload:T=>T.status>=200&&T.status<300?h(T):f(new Error(`API error: ${T.status} - ${T.responseText}`)),onerror:T=>f(T),ontimeout:()=>f(new Error("Timeout"))});}),p=JSON.parse(l.responseText)?.choices?.[0]?.message?.content;if(p&&p.trim().length>0)return g.log("OpenAI互換での翻訳に成功しました。"),p;throw new Error("OpenAI Compatible translation result is empty")}catch(s){const i=s.message,a=i.includes("429");if(e++,g.error(`OpenAI互換翻訳試行 ${e}/${n} 失敗: ${i}`),e>=n)return g.error("OpenAI互換翻訳に失敗（最大リトライ回数到達）"),null;const l=a?r*Math.pow(2,e):r*e;g.log(`${l}ms後にリトライします...`),await H(l);}return null}function qe(o){return {...o,mediaUrls:[...o.mediaUrls],quotedTweet:o.quotedTweet?{...o.quotedTweet,mediaUrls:[...o.quotedTweet.mediaUrls]}:null}}async function H(o){await new Promise(t=>setTimeout(t,o));}function N(o){let t=`${o.author} ${o.handle}
${o.text}
${o.time}
`;if(o.url&&(t+=`${o.url}
`),o.mediaUrls.length>0&&(t+=o.mediaUrls.join(`
`)+`
`),o.quotedTweet){const e=o.quotedTweet;t+=`
> 引用元: ${e.author} ${e.handle}
`,t+=`> ${e.text.replace(/\n/g,`
> `)}
`,e.mediaUrls.length>0&&(t+=`> ${e.mediaUrls.join(`
> `)}
`),t+=`> ${e.url}
`;}return t}function Ue(o,t){if(!o||o.length===0)return "";let e="";const n=`

---

`;for(let r=0;r<o.length;r++){const s=o[r],i=N(s),a=r===0?i:n+i;if(e.length+a.length>t){const l=t-e.length;l>n.length&&(e+=a.substring(0,l-3)+"...");break}e+=a;}return e}const _e=/https?:\/\/[^\s]+/g;class De{hasThreadUrlIncluded=false;remainingMediaSlots=5;consumeThreadUrl(t){return !t||this.hasThreadUrlIncluded?null:(this.hasThreadUrlIncluded=true,t)}consumeMediaUrls(t){if(this.remainingMediaSlots<=0)return [];const n=t.filter(r=>r.trim().length>0).slice(0,this.remainingMediaSlots);return this.remainingMediaSlots-=n.length,n}}function at(o){if(!o)return "";const e=o.replace(_e,"").replace(/[ \t]+\n/g,`
`).split(`
`).map(n=>n.replace(/[ \t]{2,}/g," ").trim());for(let n=e.length-1;n>=0&&e[n]==="";n--)e.pop();return e.join(`
`)}function He(o,t){const e=[];e.push(`${o.author} ${o.handle}`);const n=at(o.text);n.length>0?e.push(n):e.push(""),e.push(o.time);const r=t.consumeThreadUrl(o.url);r&&e.push(r);const s=t.consumeMediaUrls(o.mediaUrls);if(s.length>0&&e.push(...s),o.quotedTweet){const{quotedTweet:i}=o;if(i){const a=[];a.push(`> 引用元: ${i.author} ${i.handle}`);const l=at(i.text);l.length>0&&a.push(...l.split(`
`).map(p=>`> ${p}`));const c=t.consumeMediaUrls(i.mediaUrls);c.length>0&&a.push(...c.map(p=>`> ${p}`)),a.length>0&&(e.push(""),e.push(...a));}}return `${e.join(`
`)}
`}function Be(o,t){if(!o||o.length===0)return "";const e=new De;let n="";const r=`

---

`;for(let s=0;s<o.length;s++){const i=o[s],a=He(i,e),l=s===0?a:r+a;if(n.length+l.length>t){const c=t-n.length;c>r.length&&(n+=l.substring(0,c-3)+"...");break}n+=l;}return n}function Ge(o){if(!o||o.length===0)return "";let t=N(o[0]);for(let e=1;e<o.length;e++)t+=`

---

`+N(o[e]);return t}function ze(o,t,e,n=null){let r="";if(n&&(r+=x("summaryStartFrom",{author:n})),o.length>0){const s=o[0].author;r+=x("summaryThread",{author:s});}return r+=x("summaryCopied",{count:String(o.length)}),r+=x("summaryChars",{count:Ke(t.length)}),(e==="shitaraba"||e==="5ch")&&(r+=`/${e==="shitaraba"?4096:2048}`),r}function Ke(o){return o<1e3?o.toString():o<1e4?(o/1e3).toFixed(1)+"k":Math.round(o/1e3)+"k"}async function We(o){if(!o||!o.formattedText){const n=d(o?"copyNoText":"copyNoData");return g.error(`クリップボードコピー失敗: ${n}`),w.showToast(d("unknownError"),n),false}if(o.formattedText.trim().length===0)return g.error("クリップボードコピー失敗: formattedTextが空です"),w.showToast(d("unknownError"),d("copyEmptyText")),false;let t=false,e=null;if(navigator.clipboard&&window.ClipboardItem)try{const n=new Blob([o.formattedText],{type:"text/plain"}),r=window,s=new r.ClipboardItem({"text/plain":n});await navigator.clipboard.write([s]),t=!0;}catch(n){e=n,g.error(`ClipboardItem API失敗: ${e.message}`);}if(!t&&navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(o.formattedText),t=!0;}catch(n){e=n,g.error(`Navigator clipboard API失敗: ${e.message}`);}if(!t)try{const n=document.createElement("textarea");if(n.value=o.formattedText,n.style.position="fixed",n.style.left="-9999px",document.body.appendChild(n),n.select(),t=document.execCommand("copy"),document.body.removeChild(n),!t)throw new Error("execCommand returned false")}catch(n){e=n,g.error(`execCommand fallback失敗: ${e.message}`);}if(t)w.showToast(d("copied"),o.summary);else {const n=e?e.message:d("unknownError");g.error(`クリップボードコピー失敗: ${n}`),w.showToast(d("unknownError"),d("copyFailed"));}return t}class Ve{constructor(){this.init();}init(){try{this.observeUrlChanges(),this.updateButtonVisibility(),this.observeUrlChanges(),g.log("Application initialized.");}catch(t){g.error(`初期化中にエラーが発生: ${t.message}`);}}async handleButtonClick(t){try{if(t==="clipboard"){u.collectedThreadData&&(await We(u.collectedThreadData),u.isSecondStage=!1,u.collectedThreadData=null,w.updateMainButtonText());return}if(u.isCollecting)return;u.isCollecting=!0,w.updateMainButtonText();try{const e=await jt();let n=e;const r=u.selectedTweetIds??[];if(r.length>0){const c=new Map(e.map(h=>[h.id,h])),p=[];for(const h of r){const f=c.get(h);f&&p.push(f);}if(n=p,n.length===0){g.warn("選択済みツイートを取得できませんでした。"),u.collectedThreadData=null,u.isSecondStage=!1,w.showToast(d("selectionErrorTitle"),d("selectionErrorContent"));return}}else if(u.startFromTweetId){const c=e.findIndex(p=>p.id===u.startFromTweetId);c!==-1&&(n=e.slice(c));}let s="",i=n,a=!1;if(n.length>0){if(u.translateEnabled)try{u.translationInProgress=!0,w.updateMainButtonText(),w.showToast(d("translationToastTitle"),d("translationToastContent"));const c=await Ie(n);i=c.tweets,a=c.hasTranslation;}catch(c){g.error(`Translation error: ${c}`),w.showToast(d("translationErrorTitle"),d("translationErrorContent")),i=n,a=!1;}finally{u.translationInProgress=!1;}switch(u.copyMode){case "first":s=N(i[0]);break;case "shitaraba":s=Be(i,4096);break;case "5ch":s=Ue(i,2048);break;default:s=Ge(i);break}}let l=ze(n,s,u.copyMode,r.length===0?u.startFromTweetAuthor:null);u.translateEnabled&&a&&s.trim().length>0&&(l+=d("translatedSuffix")),u.collectedThreadData={formattedText:s,summary:l},u.isSecondStage=!0,w.showToast(d("readyTitle"),x("readyContent",{summary:l}));}catch(e){g.error(`Error in copy process: ${e}`),w.showToast(d("unknownError"),d("threadCopyFailed"));}finally{u.isCollecting=!1,u.translationInProgress=!1,w.updateMainButtonText();}}catch(e){g.error(`Button click handler error: ${e}`),w.showToast(d("internalErrorTitle"),d("internalErrorContent"));}}updateButtonVisibility(){this.isTwitterStatusPage()?(w.init(),w.addMainButton(this.handleButtonClick.bind(this)),w.updateAllUI()):w.destroy();}isTwitterStatusPage(){return Kt.test(location.href)}observeUrlChanges(){let t=location.href;const e=()=>{location.href!==t&&(t=location.href,setTimeout(()=>this.updateButtonVisibility(),300));},n=history.pushState;history.pushState=function(...i){n.apply(this,i),e();};const r=history.replaceState;history.replaceState=function(...i){r.apply(this,i),e();},window.addEventListener("popstate",()=>e()),new MutationObserver(()=>e()).observe(document.body,{childList:true,subtree:true});}}new Ve;

})();