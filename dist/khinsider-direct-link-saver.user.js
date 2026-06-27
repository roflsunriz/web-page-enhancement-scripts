// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.5.0
// @author       roflsunriz
// @description  KHInsiderのアルバムページから音声ファイルを並列ダウンロード
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downloads.khinsider.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.meta.js
// @match        https://downloads.khinsider.com/game-soundtracks/album/*
// @connect      downloads.khinsider.com
// @connect      vgmtreasurechest.com
// @connect      *.vgmtreasurechest.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var X=typeof GM_addStyle<"u"?GM_addStyle:void 0,Y=typeof GM_download<"u"?GM_download:void 0,j=typeof GM_getValue<"u"?GM_getValue:void 0,W=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,Q=typeof GM_setValue<"u"?GM_setValue:void 0,Z=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function D(e,t){W(e,t);}function J(e){X(e);}const q=Z;function ee(e,t){Q(e,t);}function te(e,t){return j(e,t)}const ne=new Set(["ar","ur"]);function oe(e){return ne.has(e)?"rtl":"ltr"}function ae(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(n,o)=>{const a=t[o];return a===void 0?n:String(a)})}function re(e){const t=Object.keys(e.translations);let n=e.defaultLocale;const o=i=>{const l=i.toLowerCase(),g=e.aliases?.[l];if(g)return g;const L=t.find(k=>k.toLowerCase()===l);if(L)return L;const V=l.split("-")[0];return t.find(k=>k.toLowerCase().split("-")[0]===V)??null},a=()=>{const i=navigator.languages.length>0?navigator.languages:[navigator.language];for(const l of i){const g=o(l);if(g)return g}return e.fallbackLocale},r=i=>{const l=e.translations[n]?.[i];if(l)return l;const g=e.translations[e.fallbackLocale]?.[i];return g||(e.translations[e.defaultLocale]?.[i]??i)};return {locales:t,getLocale:()=>n,setLocale:i=>{n=i;},detectBrowserLocale:a,t:r,format:(i,l)=>ae(r(i),l),getTranslations:(i=n)=>e.translations[i]??e.translations[e.fallbackLocale],getDirection:(i=n)=>oe(i),getMissingTranslationKeys:i=>{const l=e.translations[e.fallbackLocale],g=e.translations[i];return Object.keys(l).filter(L=>!g[L])}}}const de={ja:{close:"閉じる",concurrency:"並列",startSave:"保存開始",stop:"停止",idle:"待機中",openPanel:"KHInsider音声保存パネルを開く",fetchAndSave:"KHInsider音声ファイルを取得して保存",noTrackLinks:"末尾が.mp3の曲ページリンクが見つかりません",noDirectAudio:"音声ファイルの直リンクが見つかりません",htmlResponse:"HTMLが返されたため音声ファイルとして保存できません",nonAudioRedirect:"音声ファイルURLではないレスポンスにリダイレクトされました",parsingStage:"解析",downloadStage:"ダウンロード",parsingProgress:"解析中: {completed}/{total} 保存対象 {done} 失敗 {failed} スキップ {skipped}",stopped:"停止しました",parsingComplete:"解析完了: {found}/{total}件の音声ファイルを見つけました",stopPending:"停止しました。進行中のリクエストは完了後に破棄されます",noAudioLinks:"保存対象の音声リンクがありません",downloading:"ダウンロード中: {completed}/{total}",downloadProgress:"ダウンロード中: {processed}/{total} 完了 {completed} 失敗 {failed}",downloadStopped:"ダウンロードを停止しました",downloadComplete:"ダウンロード完了: 完了 {completed} 失敗 {failed}"},en:{close:"Close",concurrency:"Concurrency",startSave:"Start saving",stop:"Stop",idle:"Idle",openPanel:"Open KHInsider audio saver panel",fetchAndSave:"Fetch and save KHInsider audio files",noTrackLinks:"No track page links ending in .mp3 were found",noDirectAudio:"No direct audio file link was found",htmlResponse:"HTML was returned, so it cannot be saved as an audio file",nonAudioRedirect:"Redirected to a response that is not an audio file URL",parsingStage:"Parsing",downloadStage:"Download",parsingProgress:"Parsing: {completed}/{total} targets {done} failed {failed} skipped {skipped}",stopped:"Stopped",parsingComplete:"Parsing complete: found {found}/{total} audio files",stopPending:"Stopped. In-flight requests will be discarded after they finish",noAudioLinks:"There are no audio links to save",downloading:"Downloading: {completed}/{total}",downloadProgress:"Downloading: {processed}/{total} complete {completed} failed {failed}",downloadStopped:"Download stopped",downloadComplete:"Download complete: complete {completed} failed {failed}"},"zh-Hans":{close:"关闭",concurrency:"并发",startSave:"开始保存",stop:"停止",idle:"待机中",openPanel:"打开 KHInsider 音频保存面板",fetchAndSave:"获取并保存 KHInsider 音频文件",noTrackLinks:"未找到以 .mp3 结尾的曲目页面链接",noDirectAudio:"未找到音频文件直链",htmlResponse:"返回的是 HTML，无法作为音频文件保存",nonAudioRedirect:"已重定向到不是音频文件 URL 的响应",parsingStage:"解析",downloadStage:"下载",parsingProgress:"解析中：{completed}/{total} 目标 {done} 失败 {failed} 跳过 {skipped}",stopped:"已停止",parsingComplete:"解析完成：找到 {found}/{total} 个音频文件",stopPending:"已停止。正在进行的请求完成后会被丢弃",noAudioLinks:"没有可保存的音频链接",downloading:"下载中：{completed}/{total}",downloadProgress:"下载中：{processed}/{total} 完成 {completed} 失败 {failed}",downloadStopped:"下载已停止",downloadComplete:"下载完成：完成 {completed} 失败 {failed}"},hi:{close:"बंद करें",concurrency:"समांतरता",startSave:"सहेजना शुरू करें",stop:"रोकें",idle:"निष्क्रिय",openPanel:"KHInsider ऑडियो सेवर पैनल खोलें",fetchAndSave:"KHInsider ऑडियो फाइलें लाएं और सहेजें",noTrackLinks:".mp3 पर समाप्त होने वाले ट्रैक पेज लिंक नहीं मिले",noDirectAudio:"सीधा ऑडियो फाइल लिंक नहीं मिला",htmlResponse:"HTML मिला, इसलिए इसे ऑडियो फाइल के रूप में सहेजा नहीं जा सकता",nonAudioRedirect:"ऐसे रिस्पॉन्स पर रीडायरेक्ट हुआ जो ऑडियो फाइल URL नहीं है",parsingStage:"विश्लेषण",downloadStage:"डाउनलोड",parsingProgress:"विश्लेषण: {completed}/{total} लक्ष्य {done} विफल {failed} छोड़ा {skipped}",stopped:"रुक गया",parsingComplete:"विश्लेषण पूरा: {found}/{total} ऑडियो फाइलें मिलीं",stopPending:"रुक गया। चल रहे अनुरोध पूरे होने के बाद छोड़ दिए जाएंगे",noAudioLinks:"सहेजने के लिए कोई ऑडियो लिंक नहीं है",downloading:"डाउनलोड हो रहा है: {completed}/{total}",downloadProgress:"डाउनलोड: {processed}/{total} पूर्ण {completed} विफल {failed}",downloadStopped:"डाउनलोड रोक दिया गया",downloadComplete:"डाउनलोड पूरा: पूर्ण {completed} विफल {failed}"},es:{close:"Cerrar",concurrency:"Concurrencia",startSave:"Iniciar guardado",stop:"Detener",idle:"Inactivo",openPanel:"Abrir panel de guardado de audio de KHInsider",fetchAndSave:"Obtener y guardar archivos de audio de KHInsider",noTrackLinks:"No se encontraron enlaces de pistas que terminen en .mp3",noDirectAudio:"No se encontro un enlace directo al archivo de audio",htmlResponse:"Se devolvio HTML, por lo que no se puede guardar como audio",nonAudioRedirect:"Se redirigio a una respuesta que no es una URL de audio",parsingStage:"Analisis",downloadStage:"Descarga",parsingProgress:"Analizando: {completed}/{total} objetivos {done} fallidos {failed} omitidos {skipped}",stopped:"Detenido",parsingComplete:"Analisis completo: se encontraron {found}/{total} archivos de audio",stopPending:"Detenido. Las solicitudes en curso se descartaran al finalizar",noAudioLinks:"No hay enlaces de audio para guardar",downloading:"Descargando: {completed}/{total}",downloadProgress:"Descargando: {processed}/{total} completados {completed} fallidos {failed}",downloadStopped:"Descarga detenida",downloadComplete:"Descarga completa: completados {completed} fallidos {failed}"},fr:{close:"Fermer",concurrency:"Concurrence",startSave:"Demarrer l'enregistrement",stop:"Arreter",idle:"Inactif",openPanel:"Ouvrir le panneau d'enregistrement audio KHInsider",fetchAndSave:"Recuperer et enregistrer les fichiers audio KHInsider",noTrackLinks:"Aucun lien de piste se terminant par .mp3 n'a ete trouve",noDirectAudio:"Aucun lien direct vers un fichier audio n'a ete trouve",htmlResponse:"Une reponse HTML a ete renvoyee, elle ne peut pas etre enregistree comme audio",nonAudioRedirect:"Redirection vers une reponse qui n'est pas une URL de fichier audio",parsingStage:"Analyse",downloadStage:"Telechargement",parsingProgress:"Analyse : {completed}/{total} cibles {done} echecs {failed} ignores {skipped}",stopped:"Arrete",parsingComplete:"Analyse terminee : {found}/{total} fichiers audio trouves",stopPending:"Arrete. Les requetes en cours seront ignorees apres leur fin",noAudioLinks:"Aucun lien audio a enregistrer",downloading:"Telechargement : {completed}/{total}",downloadProgress:"Telechargement : {processed}/{total} termines {completed} echecs {failed}",downloadStopped:"Telechargement arrete",downloadComplete:"Telechargement termine : termines {completed} echecs {failed}"},ar:{close:"إغلاق",concurrency:"التوازي",startSave:"بدء الحفظ",stop:"إيقاف",idle:"خامل",openPanel:"فتح لوحة حفظ صوت KHInsider",fetchAndSave:"جلب ملفات صوت KHInsider وحفظها",noTrackLinks:"لم يتم العثور على روابط صفحات مقاطع تنتهي بـ .mp3",noDirectAudio:"لم يتم العثور على رابط مباشر لملف صوتي",htmlResponse:"تم إرجاع HTML، لذلك لا يمكن حفظه كملف صوتي",nonAudioRedirect:"تمت إعادة التوجيه إلى استجابة ليست عنوان URL لملف صوتي",parsingStage:"التحليل",downloadStage:"التنزيل",parsingProgress:"جار التحليل: {completed}/{total} أهداف {done} فشل {failed} تخطي {skipped}",stopped:"تم الإيقاف",parsingComplete:"اكتمل التحليل: تم العثور على {found}/{total} ملف صوتي",stopPending:"تم الإيقاف. سيتم تجاهل الطلبات الجارية بعد اكتمالها",noAudioLinks:"لا توجد روابط صوتية للحفظ",downloading:"جار التنزيل: {completed}/{total}",downloadProgress:"جار التنزيل: {processed}/{total} مكتمل {completed} فشل {failed}",downloadStopped:"تم إيقاف التنزيل",downloadComplete:"اكتمل التنزيل: مكتمل {completed} فشل {failed}"},pt:{close:"Fechar",concurrency:"Concorrencia",startSave:"Iniciar salvamento",stop:"Parar",idle:"Ocioso",openPanel:"Abrir painel de salvamento de audio do KHInsider",fetchAndSave:"Buscar e salvar arquivos de audio do KHInsider",noTrackLinks:"Nenhum link de faixa terminado em .mp3 foi encontrado",noDirectAudio:"Nenhum link direto de audio foi encontrado",htmlResponse:"HTML foi retornado, portanto nao pode ser salvo como audio",nonAudioRedirect:"Redirecionado para uma resposta que nao e uma URL de audio",parsingStage:"Analise",downloadStage:"Download",parsingProgress:"Analisando: {completed}/{total} alvos {done} falhas {failed} ignorados {skipped}",stopped:"Parado",parsingComplete:"Analise concluida: encontrados {found}/{total} arquivos de audio",stopPending:"Parado. Requisicoes em andamento serao descartadas ao terminar",noAudioLinks:"Nao ha links de audio para salvar",downloading:"Baixando: {completed}/{total}",downloadProgress:"Baixando: {processed}/{total} concluidos {completed} falhas {failed}",downloadStopped:"Download parado",downloadComplete:"Download concluido: concluidos {completed} falhas {failed}"},bn:{close:"বন্ধ",concurrency:"সমান্তরালতা",startSave:"সংরক্ষণ শুরু",stop:"থামান",idle:"নিষ্ক্রিয়",openPanel:"KHInsider অডিও সেভার প্যানেল খুলুন",fetchAndSave:"KHInsider অডিও ফাইল আনুন এবং সংরক্ষণ করুন",noTrackLinks:".mp3 দিয়ে শেষ হওয়া ট্র্যাক পেজ লিংক পাওয়া যায়নি",noDirectAudio:"সরাসরি অডিও ফাইল লিংক পাওয়া যায়নি",htmlResponse:"HTML ফেরত এসেছে, তাই অডিও ফাইল হিসেবে সংরক্ষণ করা যাবে না",nonAudioRedirect:"অডিও ফাইল URL নয় এমন রেসপন্সে রিডাইরেক্ট হয়েছে",parsingStage:"বিশ্লেষণ",downloadStage:"ডাউনলোড",parsingProgress:"বিশ্লেষণ: {completed}/{total} লক্ষ্য {done} ব্যর্থ {failed} এড়ানো {skipped}",stopped:"থামানো হয়েছে",parsingComplete:"বিশ্লেষণ শেষ: {found}/{total} অডিও ফাইল পাওয়া গেছে",stopPending:"থামানো হয়েছে। চলমান অনুরোধ শেষ হলে বাতিল করা হবে",noAudioLinks:"সংরক্ষণের জন্য কোনো অডিও লিংক নেই",downloading:"ডাউনলোড হচ্ছে: {completed}/{total}",downloadProgress:"ডাউনলোড: {processed}/{total} সম্পন্ন {completed} ব্যর্থ {failed}",downloadStopped:"ডাউনলোড থামানো হয়েছে",downloadComplete:"ডাউনলোড শেষ: সম্পন্ন {completed} ব্যর্থ {failed}"},ru:{close:"Закрыть",concurrency:"Параллельность",startSave:"Начать сохранение",stop:"Остановить",idle:"Ожидание",openPanel:"Открыть панель сохранения аудио KHInsider",fetchAndSave:"Получить и сохранить аудиофайлы KHInsider",noTrackLinks:"Ссылки на страницы треков, оканчивающиеся на .mp3, не найдены",noDirectAudio:"Прямая ссылка на аудиофайл не найдена",htmlResponse:"Вернулся HTML, поэтому его нельзя сохранить как аудиофайл",nonAudioRedirect:"Произошло перенаправление на ответ, который не является URL аудиофайла",parsingStage:"Анализ",downloadStage:"Загрузка",parsingProgress:"Анализ: {completed}/{total} целей {done} ошибок {failed} пропущено {skipped}",stopped:"Остановлено",parsingComplete:"Анализ завершен: найдено {found}/{total} аудиофайлов",stopPending:"Остановлено. Текущие запросы будут отброшены после завершения",noAudioLinks:"Нет аудиоссылок для сохранения",downloading:"Загрузка: {completed}/{total}",downloadProgress:"Загрузка: {processed}/{total} завершено {completed} ошибок {failed}",downloadStopped:"Загрузка остановлена",downloadComplete:"Загрузка завершена: завершено {completed} ошибок {failed}"},ur:{close:"بند کریں",concurrency:"ہم وقتی",startSave:"محفوظ کرنا شروع کریں",stop:"روکیں",idle:"خالی",openPanel:"KHInsider آڈیو سیور پینل کھولیں",fetchAndSave:"KHInsider آڈیو فائلیں حاصل کرکے محفوظ کریں",noTrackLinks:".mp3 پر ختم ہونے والے ٹریک صفحہ لنکس نہیں ملے",noDirectAudio:"براہ راست آڈیو فائل لنک نہیں ملا",htmlResponse:"HTML واپس آیا، اس لیے اسے آڈیو فائل کے طور پر محفوظ نہیں کیا جا سکتا",nonAudioRedirect:"ایسے جواب پر ری ڈائریکٹ ہوا جو آڈیو فائل URL نہیں ہے",parsingStage:"تجزیہ",downloadStage:"ڈاؤن لوڈ",parsingProgress:"تجزیہ: {completed}/{total} اہداف {done} ناکام {failed} چھوڑے گئے {skipped}",stopped:"روک دیا گیا",parsingComplete:"تجزیہ مکمل: {found}/{total} آڈیو فائلیں ملیں",stopPending:"روک دیا گیا۔ جاری درخواستیں مکمل ہونے کے بعد رد کر دی جائیں گی",noAudioLinks:"محفوظ کرنے کے لیے کوئی آڈیو لنک نہیں",downloading:"ڈاؤن لوڈ ہو رہا ہے: {completed}/{total}",downloadProgress:"ڈاؤن لوڈ: {processed}/{total} مکمل {completed} ناکام {failed}",downloadStopped:"ڈاؤن لوڈ روک دیا گیا",downloadComplete:"ڈاؤن لوڈ مکمل: مکمل {completed} ناکام {failed}"}},b=re({translations:de,defaultLocale:"ja",fallbackLocale:"en"});b.setLocale(b.detectBrowserLocale());const u=b.t,y=b.format,se=b.getDirection,d="khinsider-direct-link-saver",f=`${d}-panel`,M=`${d}-styles`,N=`${d}:concurrency`,P=4,K=1,O=12,G=3e4,ie="mp3",le=["flac","m4a","aac","mp3"],E={flac:3,m4a:2,aac:2,mp3:1};let S=0,v=0,p=[];function R(e){return Number.isFinite(e)?Math.min(O,Math.max(K,Math.floor(e))):P}function $(){return R(te(N,P)??P)}function ce(e){ee(N,R(e));}function I(e){try{const t=new URL(e,window.location.href),n=decodeURIComponent(t.pathname).toLowerCase();return le.find(a=>n.endsWith(`.${a}`))??null}catch{return null}}function ue(e){try{const t=new URL(e.href,window.location.href);return t.hostname===window.location.hostname&&I(t.href)===ie}catch{return  false}}function U(e){return e.replace(/\s+/g," ").trim()}function pe(e,t){const n=U(e.textContent??"");if(n.length>0&&!/^\d+:\d+$/.test(n)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(n))return n;const o=e.closest("tr"),a=o?U(o.textContent??""):"";return a.length>0?a:`track-${String(t+1).padStart(2,"0")}`}function fe(){const e=new Set,t=[];for(const n of Array.from(document.querySelectorAll("a[href]"))){if(!ue(n))continue;const o=new URL(n.href,window.location.href);o.hash="";const a=o.href;e.has(a)||(e.add(a),t.push({index:t.length,title:pe(n,t.length),url:a}));}return t}function ge(e){return new Promise((t,n)=>{q({method:"GET",url:e,timeout:G,responseType:"text",onload:o=>{t({status:o.status,statusText:o.statusText,responseText:o.responseText,finalUrl:o.finalUrl,headers:o.responseHeaders});},onerror:o=>{const a=typeof o.error=="string"?o.error:"request failed";n(new Error(a));},ontimeout:()=>{n(new Error("request timeout"));}});})}function me(e,t){return new Promise((n,o)=>{q({method:"HEAD",url:e,headers:{Referer:t},timeout:G,onload:a=>{n({status:a.status,statusText:a.statusText,finalUrl:a.finalUrl,headers:a.responseHeaders});},onerror:a=>{const r=typeof a.error=="string"?a.error:"request failed";o(new Error(r));},ontimeout:()=>{o(new Error("HEAD request timeout"));}});})}function he(e){return new DOMParser().parseFromString(e,"text/html")}function we(e,t){const n=[],o=new Set;function a(r){if(!r)return;const s=new URL(r,t),c=I(s.href);!c||o.has(s.href)||(o.add(s.href),n.push({url:s.href,extension:c}));}for(const r of Array.from(e.querySelectorAll(".songDownloadLink")))a(r.closest("a[href]")?.getAttribute("href")??null);for(const r of Array.from(e.querySelectorAll("audio[src]")))a(r.getAttribute("src"));return n}function Se(e){return e.reduce((t,n)=>{if(!t)return n;const o=E[t.extension];return E[n.extension]>o?n:t},null)}async function ve(e){const t=await ge(e.url);if(t.status<200||t.status>=300)throw new Error(`HTTP ${t.status} ${t.statusText}`);const n=he(t.responseText),o=Se(we(n,t.finalUrl||e.url));return o?{...e,state:"done",directUrl:o.url,extension:o.extension,error:null}:{...e,state:"skipped",directUrl:null,extension:null,error:u("noDirectAudio")}}function ye(e){return e.map(t=>({...t,state:"pending",directUrl:null,extension:null,error:null}))}async function z(e,t,n){let o=0;async function a(s){for(;o<e.length;){const c=o;o+=1,await n(e[c],c,s);}}const r=Math.min(t,e.length);await Promise.all(Array.from({length:r},(s,c)=>a(c)));}function Ae(e){return e.filter(t=>t.state==="done"&&t.directUrl!==null&&t.extension!==null).map(t=>({title:t.title,trackPageUrl:t.url,directUrl:t.directUrl,extension:t.extension}))}function be(e){const t=new Set(["<",">",":",'"',"/","\\","|","?","*"]),n=e.split("").map(o=>t.has(o)||o.charCodeAt(0)<32?"_":o).join("").replace(/\s+/g," ").trim();return n.length>0?n:"track"}function Le(e,t){return `${String(t+1).padStart(2,"0")} ${be(e.title)}.${e.extension}`}function xe(e,t){const n=t.toLowerCase(),o=e.split(/\r?\n/).find(a=>a.toLowerCase().startsWith(`${n}:`));return o?o.slice(o.indexOf(":")+1).trim():null}function _e(e,t){if(e.status<200||e.status>=300)throw new Error(`HTTP ${e.status} ${e.statusText}`);const n=xe(e.headers,"content-type")??"";if(/text\/html/i.test(n))throw new Error(u("htmlResponse"));if(!I(e.finalUrl||t.directUrl))throw new Error(u("nonAudioRedirect"))}function w(){return document.getElementById(f)}function m(e){const t=w()?.querySelector('[data-role="status"]');t&&(t.textContent=e);}function B(e,t,n){const o=w();if(!o)return;const a=o.querySelector('[data-role="progress"]'),r=o.querySelector('[data-role="overall-bar"]'),s=o.querySelector('[data-role="lanes"]'),c=Math.min(n,t);a&&(a.hidden=t===0,a.setAttribute("data-stage",e)),r&&(r.style.width="0%"),s&&s.replaceChildren(...Array.from({length:c},(_,i)=>{const l=document.createElement("div");return l.className=`${d}__lane`,l.dataset.lane=String(i),l.dataset.state="idle",l.title=`${e} worker ${i+1}`,l}));}function x(e,t){const n=w()?.querySelector('[data-role="overall-bar"]');if(!n)return;const o=t>0?Math.round(e/t*100):0;n.style.width=`${Math.min(100,Math.max(0,o))}%`;}function A(e,t){const n=w()?.querySelector(`[data-lane="${e}"]`);n&&(n.dataset.state=t);}function C(e){const t=e.filter(s=>s.state==="done").length,n=e.filter(s=>s.state==="failed").length,o=e.filter(s=>s.state==="skipped").length,a=t+n+o,r=e.length;x(a,r),m(y("parsingProgress",{completed:a,total:r,done:t,failed:n,skipped:o}));}function h(e){const t=w();if(!t)return;t.querySelector('[data-action="start-download"]')?.toggleAttribute("disabled",e),t.querySelector('[data-action="stop"]')?.toggleAttribute("disabled",!e);const n=t.querySelector('[data-role="concurrency"]');n&&(n.disabled=e);}async function ke(){const e=S+1;S=e;const t=fe();if(t.length===0)return p=[],m(u("noTrackLinks")),[];const n=$();if(p=ye(t),h(true),B(u("parsingStage"),t.length,n),C(p),await z(t,n,async(a,r,s)=>{if(S===e){A(s,"active"),p[r]={...p[r],state:"running"},C(p);try{p[r]=await ve(a);}catch(c){const _=c instanceof Error?c.message:"unknown error";p[r]={...a,state:"failed",directUrl:null,extension:null,error:_};}A(s,p[r].state==="done"?"done":"failed"),C(p);}}),S!==e)return m(u("stopped")),h(false),[];const o=Ae(p);return x(t.length,t.length),m(y("parsingComplete",{found:o.length,total:t.length})),h(false),o}function Ce(){S+=1,h(false),m(u("stopPending"));}function Te(e,t){return new Promise((n,o)=>{(async()=>{const a=await me(e.directUrl,e.trackPageUrl);_e(a,e),Y({url:a.finalUrl||e.directUrl,name:t,saveAs:false,onload:()=>{n();},onerror:r=>{o(new Error(`download failed: ${r.error}`));},ontimeout:()=>{o(new Error("download timeout"));}});})().catch(a=>{o(a instanceof Error?a:new Error("download failed"));});})}async function Pe(e){const t=v+1;if(v=t,e.length===0){m(u("noAudioLinks"));return}const n=$();let o=0,a=0;if(h(true),B(u("downloadStage"),e.length,n),m(y("downloading",{completed:0,total:e.length})),await z(e,n,async(r,s,c)=>{if(v===t){A(c,"active");try{await Te(r,Le(r,s)),o+=1,A(c,"done");}catch{a+=1,A(c,"failed");}x(o+a,e.length),m(y("downloadProgress",{processed:o+a,total:e.length,completed:o,failed:a}));}}),v!==t){m(u("downloadStopped")),h(false);return}x(e.length,e.length),m(y("downloadComplete",{completed:o,failed:a})),h(false);}async function F(){const e=await ke();e.length>0&&await Pe(e);}function Re(){const e=document.createElement("section");e.id=f,e.dir=se(),e.innerHTML=`
    <div class="${d}__header">
      <strong>KHInsider Audio Saver</strong>
      <button type="button" data-action="hide" title="${u("close")}">×</button>
    </div>
    <div class="${d}__controls">
      <label>
        ${u("concurrency")}
        <input type="number" min="${K}" max="${O}" step="1" value="${$()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start-download">${u("startSave")}</button>
      <button type="button" data-action="stop" disabled>${u("stop")}</button>
    </div>
    <div class="${d}__status" data-role="status">${u("idle")}</div>
    <div class="${d}__progress" data-role="progress" hidden>
      <div class="${d}__overall">
        <div class="${d}__overall-bar" data-role="overall-bar"></div>
      </div>
      <div class="${d}__lanes" data-role="lanes"></div>
    </div>
  `,e.querySelector('[data-action="start-download"]')?.addEventListener("click",()=>{F();}),e.querySelector('[data-action="stop"]')?.addEventListener("click",()=>{Ce(),v+=1;}),e.querySelector('[data-action="hide"]')?.addEventListener("click",()=>{e.hidden=true;});const t=e.querySelector('[data-role="concurrency"]');return t?.addEventListener("change",()=>{const n=R(Number(t.value));t.value=String(n),ce(n);}),document.body.append(e),e}function T(){const e=w()??Re();e.hidden=false;}function $e(){if(document.getElementById(M))return;J(`
    #${f} {
      background: #fff;
      border: 1px solid #9ca3af;
      border-radius: 8px;
      box-shadow: 0 12px 32px rgb(0 0 0 / 24%);
      color: #111827;
      font: 13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: min(560px, calc(100vw - 24px));
      padding: 12px;
      position: fixed;
      right: 16px;
      top: 16px;
      width: 520px;
      z-index: 999999;
    }

    #${f}[hidden] {
      display: none;
    }

    .${d}__header,
    .${d}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${d}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${d}__controls {
      flex-wrap: wrap;
    }

    #${f} button,
    #${f} input {
      font: inherit;
    }

    #${f} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${f} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${f} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${f} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${f} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${d}__status {
      color: #374151;
      margin-top: 10px;
    }

    .${d}__progress {
      margin-top: 10px;
    }

    .${d}__progress[hidden] {
      display: none;
    }

    .${d}__overall {
      background: #e5e7eb;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      width: 100%;
    }

    .${d}__overall-bar {
      background: #2563eb;
      height: 100%;
      transition: width 180ms ease;
      width: 0%;
    }

    .${d}__lanes {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
      margin-top: 8px;
    }

    .${d}__lane {
      background: #e5e7eb;
      border-radius: 999px;
      height: 6px;
      overflow: hidden;
      position: relative;
    }

    .${d}__lane::before {
      background: #9ca3af;
      content: "";
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }

    .${d}__lane[data-state="active"]::before {
      animation: ${d}-lane 850ms linear infinite;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      width: 80%;
    }

    .${d}__lane[data-state="done"]::before {
      background: #16a34a;
      transform: translateX(0);
    }

    .${d}__lane[data-state="failed"]::before {
      background: #dc2626;
      transform: translateX(0);
    }

    @keyframes ${d}-lane {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(140%);
      }
    }
  `);const e=document.createElement("meta");e.id=M,document.head.append(e);}function H(){$e(),D(u("openPanel"),T),D(u("fetchAndSave"),()=>{T(),F();}),T();}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",H,{once:true}):H();

})();