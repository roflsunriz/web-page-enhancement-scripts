// ==UserScript==
// @name         khinsider-direct-link-saver
// @namespace    khinsiderDirectLinkSaver
// @version      1.5.1
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

(function(){"use strict";var e=typeof GM_addStyle<`u`?GM_addStyle:void 0,t=typeof GM_download<`u`?GM_download:void 0,n=typeof GM_getValue<`u`?GM_getValue:void 0,r=typeof GM_registerMenuCommand<`u`?GM_registerMenuCommand:void 0,i=typeof GM_setValue<`u`?GM_setValue:void 0,a=typeof GM_xmlhttpRequest<`u`?GM_xmlhttpRequest:void 0;function o(e,t){r(e,t)}function s(t){e(t)}var c=a;function ee(e,t){i(e,t)}function te(e,t){return n(e,t)}var ne=new Set([`ar`,`ur`]);function re(e){return ne.has(e)?`rtl`:`ltr`}function ie(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function l(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>ie(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>re(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var u=l({translations:{ja:{close:`閉じる`,concurrency:`並列`,startSave:`保存開始`,stop:`停止`,idle:`待機中`,openPanel:`KHInsider音声保存パネルを開く`,fetchAndSave:`KHInsider音声ファイルを取得して保存`,noTrackLinks:`末尾が.mp3の曲ページリンクが見つかりません`,noDirectAudio:`音声ファイルの直リンクが見つかりません`,htmlResponse:`HTMLが返されたため音声ファイルとして保存できません`,nonAudioRedirect:`音声ファイルURLではないレスポンスにリダイレクトされました`,parsingStage:`解析`,downloadStage:`ダウンロード`,parsingProgress:`解析中: {completed}/{total} 保存対象 {done} 失敗 {failed} スキップ {skipped}`,stopped:`停止しました`,parsingComplete:`解析完了: {found}/{total}件の音声ファイルを見つけました`,stopPending:`停止しました。進行中のリクエストは完了後に破棄されます`,noAudioLinks:`保存対象の音声リンクがありません`,downloading:`ダウンロード中: {completed}/{total}`,downloadProgress:`ダウンロード中: {processed}/{total} 完了 {completed} 失敗 {failed}`,downloadStopped:`ダウンロードを停止しました`,downloadComplete:`ダウンロード完了: 完了 {completed} 失敗 {failed}`},en:{close:`Close`,concurrency:`Concurrency`,startSave:`Start saving`,stop:`Stop`,idle:`Idle`,openPanel:`Open KHInsider audio saver panel`,fetchAndSave:`Fetch and save KHInsider audio files`,noTrackLinks:`No track page links ending in .mp3 were found`,noDirectAudio:`No direct audio file link was found`,htmlResponse:`HTML was returned, so it cannot be saved as an audio file`,nonAudioRedirect:`Redirected to a response that is not an audio file URL`,parsingStage:`Parsing`,downloadStage:`Download`,parsingProgress:`Parsing: {completed}/{total} targets {done} failed {failed} skipped {skipped}`,stopped:`Stopped`,parsingComplete:`Parsing complete: found {found}/{total} audio files`,stopPending:`Stopped. In-flight requests will be discarded after they finish`,noAudioLinks:`There are no audio links to save`,downloading:`Downloading: {completed}/{total}`,downloadProgress:`Downloading: {processed}/{total} complete {completed} failed {failed}`,downloadStopped:`Download stopped`,downloadComplete:`Download complete: complete {completed} failed {failed}`},"zh-Hans":{close:`关闭`,concurrency:`并发`,startSave:`开始保存`,stop:`停止`,idle:`待机中`,openPanel:`打开 KHInsider 音频保存面板`,fetchAndSave:`获取并保存 KHInsider 音频文件`,noTrackLinks:`未找到以 .mp3 结尾的曲目页面链接`,noDirectAudio:`未找到音频文件直链`,htmlResponse:`返回的是 HTML，无法作为音频文件保存`,nonAudioRedirect:`已重定向到不是音频文件 URL 的响应`,parsingStage:`解析`,downloadStage:`下载`,parsingProgress:`解析中：{completed}/{total} 目标 {done} 失败 {failed} 跳过 {skipped}`,stopped:`已停止`,parsingComplete:`解析完成：找到 {found}/{total} 个音频文件`,stopPending:`已停止。正在进行的请求完成后会被丢弃`,noAudioLinks:`没有可保存的音频链接`,downloading:`下载中：{completed}/{total}`,downloadProgress:`下载中：{processed}/{total} 完成 {completed} 失败 {failed}`,downloadStopped:`下载已停止`,downloadComplete:`下载完成：完成 {completed} 失败 {failed}`},hi:{close:`बंद करें`,concurrency:`समांतरता`,startSave:`सहेजना शुरू करें`,stop:`रोकें`,idle:`निष्क्रिय`,openPanel:`KHInsider ऑडियो सेवर पैनल खोलें`,fetchAndSave:`KHInsider ऑडियो फाइलें लाएं और सहेजें`,noTrackLinks:`.mp3 पर समाप्त होने वाले ट्रैक पेज लिंक नहीं मिले`,noDirectAudio:`सीधा ऑडियो फाइल लिंक नहीं मिला`,htmlResponse:`HTML मिला, इसलिए इसे ऑडियो फाइल के रूप में सहेजा नहीं जा सकता`,nonAudioRedirect:`ऐसे रिस्पॉन्स पर रीडायरेक्ट हुआ जो ऑडियो फाइल URL नहीं है`,parsingStage:`विश्लेषण`,downloadStage:`डाउनलोड`,parsingProgress:`विश्लेषण: {completed}/{total} लक्ष्य {done} विफल {failed} छोड़ा {skipped}`,stopped:`रुक गया`,parsingComplete:`विश्लेषण पूरा: {found}/{total} ऑडियो फाइलें मिलीं`,stopPending:`रुक गया। चल रहे अनुरोध पूरे होने के बाद छोड़ दिए जाएंगे`,noAudioLinks:`सहेजने के लिए कोई ऑडियो लिंक नहीं है`,downloading:`डाउनलोड हो रहा है: {completed}/{total}`,downloadProgress:`डाउनलोड: {processed}/{total} पूर्ण {completed} विफल {failed}`,downloadStopped:`डाउनलोड रोक दिया गया`,downloadComplete:`डाउनलोड पूरा: पूर्ण {completed} विफल {failed}`},es:{close:`Cerrar`,concurrency:`Concurrencia`,startSave:`Iniciar guardado`,stop:`Detener`,idle:`Inactivo`,openPanel:`Abrir panel de guardado de audio de KHInsider`,fetchAndSave:`Obtener y guardar archivos de audio de KHInsider`,noTrackLinks:`No se encontraron enlaces de pistas que terminen en .mp3`,noDirectAudio:`No se encontro un enlace directo al archivo de audio`,htmlResponse:`Se devolvio HTML, por lo que no se puede guardar como audio`,nonAudioRedirect:`Se redirigio a una respuesta que no es una URL de audio`,parsingStage:`Analisis`,downloadStage:`Descarga`,parsingProgress:`Analizando: {completed}/{total} objetivos {done} fallidos {failed} omitidos {skipped}`,stopped:`Detenido`,parsingComplete:`Analisis completo: se encontraron {found}/{total} archivos de audio`,stopPending:`Detenido. Las solicitudes en curso se descartaran al finalizar`,noAudioLinks:`No hay enlaces de audio para guardar`,downloading:`Descargando: {completed}/{total}`,downloadProgress:`Descargando: {processed}/{total} completados {completed} fallidos {failed}`,downloadStopped:`Descarga detenida`,downloadComplete:`Descarga completa: completados {completed} fallidos {failed}`},fr:{close:`Fermer`,concurrency:`Concurrence`,startSave:`Demarrer l'enregistrement`,stop:`Arreter`,idle:`Inactif`,openPanel:`Ouvrir le panneau d'enregistrement audio KHInsider`,fetchAndSave:`Recuperer et enregistrer les fichiers audio KHInsider`,noTrackLinks:`Aucun lien de piste se terminant par .mp3 n'a ete trouve`,noDirectAudio:`Aucun lien direct vers un fichier audio n'a ete trouve`,htmlResponse:`Une reponse HTML a ete renvoyee, elle ne peut pas etre enregistree comme audio`,nonAudioRedirect:`Redirection vers une reponse qui n'est pas une URL de fichier audio`,parsingStage:`Analyse`,downloadStage:`Telechargement`,parsingProgress:`Analyse : {completed}/{total} cibles {done} echecs {failed} ignores {skipped}`,stopped:`Arrete`,parsingComplete:`Analyse terminee : {found}/{total} fichiers audio trouves`,stopPending:`Arrete. Les requetes en cours seront ignorees apres leur fin`,noAudioLinks:`Aucun lien audio a enregistrer`,downloading:`Telechargement : {completed}/{total}`,downloadProgress:`Telechargement : {processed}/{total} termines {completed} echecs {failed}`,downloadStopped:`Telechargement arrete`,downloadComplete:`Telechargement termine : termines {completed} echecs {failed}`},ar:{close:`إغلاق`,concurrency:`التوازي`,startSave:`بدء الحفظ`,stop:`إيقاف`,idle:`خامل`,openPanel:`فتح لوحة حفظ صوت KHInsider`,fetchAndSave:`جلب ملفات صوت KHInsider وحفظها`,noTrackLinks:`لم يتم العثور على روابط صفحات مقاطع تنتهي بـ .mp3`,noDirectAudio:`لم يتم العثور على رابط مباشر لملف صوتي`,htmlResponse:`تم إرجاع HTML، لذلك لا يمكن حفظه كملف صوتي`,nonAudioRedirect:`تمت إعادة التوجيه إلى استجابة ليست عنوان URL لملف صوتي`,parsingStage:`التحليل`,downloadStage:`التنزيل`,parsingProgress:`جار التحليل: {completed}/{total} أهداف {done} فشل {failed} تخطي {skipped}`,stopped:`تم الإيقاف`,parsingComplete:`اكتمل التحليل: تم العثور على {found}/{total} ملف صوتي`,stopPending:`تم الإيقاف. سيتم تجاهل الطلبات الجارية بعد اكتمالها`,noAudioLinks:`لا توجد روابط صوتية للحفظ`,downloading:`جار التنزيل: {completed}/{total}`,downloadProgress:`جار التنزيل: {processed}/{total} مكتمل {completed} فشل {failed}`,downloadStopped:`تم إيقاف التنزيل`,downloadComplete:`اكتمل التنزيل: مكتمل {completed} فشل {failed}`},pt:{close:`Fechar`,concurrency:`Concorrencia`,startSave:`Iniciar salvamento`,stop:`Parar`,idle:`Ocioso`,openPanel:`Abrir painel de salvamento de audio do KHInsider`,fetchAndSave:`Buscar e salvar arquivos de audio do KHInsider`,noTrackLinks:`Nenhum link de faixa terminado em .mp3 foi encontrado`,noDirectAudio:`Nenhum link direto de audio foi encontrado`,htmlResponse:`HTML foi retornado, portanto nao pode ser salvo como audio`,nonAudioRedirect:`Redirecionado para uma resposta que nao e uma URL de audio`,parsingStage:`Analise`,downloadStage:`Download`,parsingProgress:`Analisando: {completed}/{total} alvos {done} falhas {failed} ignorados {skipped}`,stopped:`Parado`,parsingComplete:`Analise concluida: encontrados {found}/{total} arquivos de audio`,stopPending:`Parado. Requisicoes em andamento serao descartadas ao terminar`,noAudioLinks:`Nao ha links de audio para salvar`,downloading:`Baixando: {completed}/{total}`,downloadProgress:`Baixando: {processed}/{total} concluidos {completed} falhas {failed}`,downloadStopped:`Download parado`,downloadComplete:`Download concluido: concluidos {completed} falhas {failed}`},bn:{close:`বন্ধ`,concurrency:`সমান্তরালতা`,startSave:`সংরক্ষণ শুরু`,stop:`থামান`,idle:`নিষ্ক্রিয়`,openPanel:`KHInsider অডিও সেভার প্যানেল খুলুন`,fetchAndSave:`KHInsider অডিও ফাইল আনুন এবং সংরক্ষণ করুন`,noTrackLinks:`.mp3 দিয়ে শেষ হওয়া ট্র্যাক পেজ লিংক পাওয়া যায়নি`,noDirectAudio:`সরাসরি অডিও ফাইল লিংক পাওয়া যায়নি`,htmlResponse:`HTML ফেরত এসেছে, তাই অডিও ফাইল হিসেবে সংরক্ষণ করা যাবে না`,nonAudioRedirect:`অডিও ফাইল URL নয় এমন রেসপন্সে রিডাইরেক্ট হয়েছে`,parsingStage:`বিশ্লেষণ`,downloadStage:`ডাউনলোড`,parsingProgress:`বিশ্লেষণ: {completed}/{total} লক্ষ্য {done} ব্যর্থ {failed} এড়ানো {skipped}`,stopped:`থামানো হয়েছে`,parsingComplete:`বিশ্লেষণ শেষ: {found}/{total} অডিও ফাইল পাওয়া গেছে`,stopPending:`থামানো হয়েছে। চলমান অনুরোধ শেষ হলে বাতিল করা হবে`,noAudioLinks:`সংরক্ষণের জন্য কোনো অডিও লিংক নেই`,downloading:`ডাউনলোড হচ্ছে: {completed}/{total}`,downloadProgress:`ডাউনলোড: {processed}/{total} সম্পন্ন {completed} ব্যর্থ {failed}`,downloadStopped:`ডাউনলোড থামানো হয়েছে`,downloadComplete:`ডাউনলোড শেষ: সম্পন্ন {completed} ব্যর্থ {failed}`},ru:{close:`Закрыть`,concurrency:`Параллельность`,startSave:`Начать сохранение`,stop:`Остановить`,idle:`Ожидание`,openPanel:`Открыть панель сохранения аудио KHInsider`,fetchAndSave:`Получить и сохранить аудиофайлы KHInsider`,noTrackLinks:`Ссылки на страницы треков, оканчивающиеся на .mp3, не найдены`,noDirectAudio:`Прямая ссылка на аудиофайл не найдена`,htmlResponse:`Вернулся HTML, поэтому его нельзя сохранить как аудиофайл`,nonAudioRedirect:`Произошло перенаправление на ответ, который не является URL аудиофайла`,parsingStage:`Анализ`,downloadStage:`Загрузка`,parsingProgress:`Анализ: {completed}/{total} целей {done} ошибок {failed} пропущено {skipped}`,stopped:`Остановлено`,parsingComplete:`Анализ завершен: найдено {found}/{total} аудиофайлов`,stopPending:`Остановлено. Текущие запросы будут отброшены после завершения`,noAudioLinks:`Нет аудиоссылок для сохранения`,downloading:`Загрузка: {completed}/{total}`,downloadProgress:`Загрузка: {processed}/{total} завершено {completed} ошибок {failed}`,downloadStopped:`Загрузка остановлена`,downloadComplete:`Загрузка завершена: завершено {completed} ошибок {failed}`},ur:{close:`بند کریں`,concurrency:`ہم وقتی`,startSave:`محفوظ کرنا شروع کریں`,stop:`روکیں`,idle:`خالی`,openPanel:`KHInsider آڈیو سیور پینل کھولیں`,fetchAndSave:`KHInsider آڈیو فائلیں حاصل کرکے محفوظ کریں`,noTrackLinks:`.mp3 پر ختم ہونے والے ٹریک صفحہ لنکس نہیں ملے`,noDirectAudio:`براہ راست آڈیو فائل لنک نہیں ملا`,htmlResponse:`HTML واپس آیا، اس لیے اسے آڈیو فائل کے طور پر محفوظ نہیں کیا جا سکتا`,nonAudioRedirect:`ایسے جواب پر ری ڈائریکٹ ہوا جو آڈیو فائل URL نہیں ہے`,parsingStage:`تجزیہ`,downloadStage:`ڈاؤن لوڈ`,parsingProgress:`تجزیہ: {completed}/{total} اہداف {done} ناکام {failed} چھوڑے گئے {skipped}`,stopped:`روک دیا گیا`,parsingComplete:`تجزیہ مکمل: {found}/{total} آڈیو فائلیں ملیں`,stopPending:`روک دیا گیا۔ جاری درخواستیں مکمل ہونے کے بعد رد کر دی جائیں گی`,noAudioLinks:`محفوظ کرنے کے لیے کوئی آڈیو لنک نہیں`,downloading:`ڈاؤن لوڈ ہو رہا ہے: {completed}/{total}`,downloadProgress:`ڈاؤن لوڈ: {processed}/{total} مکمل {completed} ناکام {failed}`,downloadStopped:`ڈاؤن لوڈ روک دیا گیا`,downloadComplete:`ڈاؤن لوڈ مکمل: مکمل {completed} ناکام {failed}`}},defaultLocale:`ja`,fallbackLocale:`en`});u.setLocale(u.detectBrowserLocale());var d=u.t,f=u.format,ae=u.getDirection,p=`khinsider-direct-link-saver`,m=`${p}-panel`,h=`${p}-styles`,g=`${p}:concurrency`,_=4,v=1,y=12,b=3e4,oe=`mp3`,se=[`flac`,`m4a`,`aac`,`mp3`],x={flac:3,m4a:2,aac:2,mp3:1},S=0,C=0,w=[];function T(e){return Number.isFinite(e)?Math.min(y,Math.max(v,Math.floor(e))):_}function E(){return T(te(g,_)??_)}function ce(e){ee(g,T(e))}function D(e){try{let t=new URL(e,window.location.href),n=decodeURIComponent(t.pathname).toLowerCase();return se.find(e=>n.endsWith(`.${e}`))??null}catch{return null}}function le(e){try{let t=new URL(e.href,window.location.href);return t.hostname===window.location.hostname&&D(t.href)===oe}catch{return!1}}function O(e){return e.replace(/\s+/g,` `).trim()}function ue(e,t){let n=O(e.textContent??``);if(n.length>0&&!/^\d+:\d+$/.test(n)&&!/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(n))return n;let r=e.closest(`tr`),i=r?O(r.textContent??``):``;return i.length>0?i:`track-${String(t+1).padStart(2,`0`)}`}function k(){let e=new Set,t=[];for(let n of Array.from(document.querySelectorAll(`a[href]`))){if(!le(n))continue;let r=new URL(n.href,window.location.href);r.hash=``;let i=r.href;e.has(i)||(e.add(i),t.push({index:t.length,title:ue(n,t.length),url:i}))}return t}function A(e){return new Promise((t,n)=>{c({method:`GET`,url:e,timeout:b,responseType:`text`,onload:e=>{t({status:e.status,statusText:e.statusText,responseText:e.responseText,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=typeof e.error==`string`?e.error:`request failed`;n(Error(t))},ontimeout:()=>{n(Error(`request timeout`))}})})}function j(e,t){return new Promise((n,r)=>{c({method:`HEAD`,url:e,headers:{Referer:t},timeout:b,onload:e=>{n({status:e.status,statusText:e.statusText,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=typeof e.error==`string`?e.error:`request failed`;r(Error(t))},ontimeout:()=>{r(Error(`HEAD request timeout`))}})})}function M(e){return new DOMParser().parseFromString(e,`text/html`)}function N(e,t){let n=[],r=new Set;function i(e){if(!e)return;let i=new URL(e,t),a=D(i.href);!a||r.has(i.href)||(r.add(i.href),n.push({url:i.href,extension:a}))}for(let t of Array.from(e.querySelectorAll(`.songDownloadLink`)))i(t.closest(`a[href]`)?.getAttribute(`href`)??null);for(let t of Array.from(e.querySelectorAll(`audio[src]`)))i(t.getAttribute(`src`));return n}function P(e){return e.reduce((e,t)=>{if(!e)return t;let n=x[e.extension];return x[t.extension]>n?t:e},null)}async function F(e){let t=await A(e.url);if(t.status<200||t.status>=300)throw Error(`HTTP ${t.status} ${t.statusText}`);let n=P(N(M(t.responseText),t.finalUrl||e.url));return n?{...e,state:`done`,directUrl:n.url,extension:n.extension,error:null}:{...e,state:`skipped`,directUrl:null,extension:null,error:d(`noDirectAudio`)}}function I(e){return e.map(e=>({...e,state:`pending`,directUrl:null,extension:null,error:null}))}async function L(e,t,n){let r=0;async function i(t){for(;r<e.length;){let i=r;r+=1,await n(e[i],i,t)}}let a=Math.min(t,e.length);await Promise.all(Array.from({length:a},(e,t)=>i(t)))}function R(e){return e.filter(e=>e.state===`done`&&e.directUrl!==null&&e.extension!==null).map(e=>({title:e.title,trackPageUrl:e.url,directUrl:e.directUrl,extension:e.extension}))}function z(e){let t=new Set([`<`,`>`,`:`,`"`,`/`,`\\`,`|`,`?`,`*`]),n=e.split(``).map(e=>t.has(e)||e.charCodeAt(0)<32?`_`:e).join(``).replace(/\s+/g,` `).trim();return n.length>0?n:`track`}function B(e,t){return`${String(t+1).padStart(2,`0`)} ${z(e.title)}.${e.extension}`}function V(e,t){let n=t.toLowerCase(),r=e.split(/\r?\n/).find(e=>e.toLowerCase().startsWith(`${n}:`));return r?r.slice(r.indexOf(`:`)+1).trim():null}function H(e,t){if(e.status<200||e.status>=300)throw Error(`HTTP ${e.status} ${e.statusText}`);let n=V(e.headers,`content-type`)??``;if(/text\/html/i.test(n))throw Error(d(`htmlResponse`));if(!D(e.finalUrl||t.directUrl))throw Error(d(`nonAudioRedirect`))}function U(){return document.getElementById(m)}function W(e){let t=U()?.querySelector(`[data-role="status"]`);t&&(t.textContent=e)}function G(e,t,n){let r=U();if(!r)return;let i=r.querySelector(`[data-role="progress"]`),a=r.querySelector(`[data-role="overall-bar"]`),o=r.querySelector(`[data-role="lanes"]`),s=Math.min(n,t);i&&(i.hidden=t===0,i.setAttribute(`data-stage`,e)),a&&(a.style.width=`0%`),o&&o.replaceChildren(...Array.from({length:s},(t,n)=>{let r=document.createElement(`div`);return r.className=`${p}__lane`,r.dataset.lane=String(n),r.dataset.state=`idle`,r.title=`${e} worker ${n+1}`,r}))}function K(e,t){let n=U()?.querySelector(`[data-role="overall-bar"]`);if(!n)return;let r=t>0?Math.round(e/t*100):0;n.style.width=`${Math.min(100,Math.max(0,r))}%`}function q(e,t){let n=U()?.querySelector(`[data-lane="${e}"]`);n&&(n.dataset.state=t)}function J(e){let t=e.filter(e=>e.state===`done`).length,n=e.filter(e=>e.state===`failed`).length,r=e.filter(e=>e.state===`skipped`).length,i=t+n+r,a=e.length;K(i,a),W(f(`parsingProgress`,{completed:i,total:a,done:t,failed:n,skipped:r}))}function Y(e){let t=U();if(!t)return;t.querySelector(`[data-action="start-download"]`)?.toggleAttribute(`disabled`,e),t.querySelector(`[data-action="stop"]`)?.toggleAttribute(`disabled`,!e);let n=t.querySelector(`[data-role="concurrency"]`);n&&(n.disabled=e)}async function de(){let e=S+1;S=e;let t=k();if(t.length===0)return w=[],W(d(`noTrackLinks`)),[];let n=E();if(w=I(t),Y(!0),G(d(`parsingStage`),t.length,n),J(w),await L(t,n,async(t,n,r)=>{if(S===e){q(r,`active`),w[n]={...w[n],state:`running`},J(w);try{w[n]=await F(t)}catch(e){let r=e instanceof Error?e.message:`unknown error`;w[n]={...t,state:`failed`,directUrl:null,extension:null,error:r}}q(r,w[n].state===`done`?`done`:`failed`),J(w)}}),S!==e)return W(d(`stopped`)),Y(!1),[];let r=R(w);return K(t.length,t.length),W(f(`parsingComplete`,{found:r.length,total:t.length})),Y(!1),r}function fe(){S+=1,Y(!1),W(d(`stopPending`))}function X(e,n){return new Promise((r,i)=>{(async()=>{let a=await j(e.directUrl,e.trackPageUrl);H(a,e),t({url:a.finalUrl||e.directUrl,name:n,saveAs:!1,onload:()=>{r()},onerror:e=>{i(Error(`download failed: ${e.error}`))},ontimeout:()=>{i(Error(`download timeout`))}})})().catch(e=>{i(e instanceof Error?e:Error(`download failed`))})})}async function pe(e){let t=C+1;if(C=t,e.length===0){W(d(`noAudioLinks`));return}let n=E(),r=0,i=0;if(Y(!0),G(d(`downloadStage`),e.length,n),W(f(`downloading`,{completed:0,total:e.length})),await L(e,n,async(n,a,o)=>{if(C===t){q(o,`active`);try{await X(n,B(n,a)),r+=1,q(o,`done`)}catch{i+=1,q(o,`failed`)}K(r+i,e.length),W(f(`downloadProgress`,{processed:r+i,total:e.length,completed:r,failed:i}))}}),C!==t){W(d(`downloadStopped`)),Y(!1);return}K(e.length,e.length),W(f(`downloadComplete`,{completed:r,failed:i})),Y(!1)}async function Z(){let e=await de();e.length>0&&await pe(e)}function me(){let e=document.createElement(`section`);e.id=m,e.dir=ae(),e.innerHTML=`
    <div class="${p}__header">
      <strong>KHInsider Audio Saver</strong>
      <button type="button" data-action="hide" title="${d(`close`)}">×</button>
    </div>
    <div class="${p}__controls">
      <label>
        ${d(`concurrency`)}
        <input type="number" min="${v}" max="${y}" step="1" value="${E()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start-download">${d(`startSave`)}</button>
      <button type="button" data-action="stop" disabled>${d(`stop`)}</button>
    </div>
    <div class="${p}__status" data-role="status">${d(`idle`)}</div>
    <div class="${p}__progress" data-role="progress" hidden>
      <div class="${p}__overall">
        <div class="${p}__overall-bar" data-role="overall-bar"></div>
      </div>
      <div class="${p}__lanes" data-role="lanes"></div>
    </div>
  `,e.querySelector(`[data-action="start-download"]`)?.addEventListener(`click`,()=>{Z()}),e.querySelector(`[data-action="stop"]`)?.addEventListener(`click`,()=>{fe(),C+=1}),e.querySelector(`[data-action="hide"]`)?.addEventListener(`click`,()=>{e.hidden=!0});let t=e.querySelector(`[data-role="concurrency"]`);return t?.addEventListener(`change`,()=>{let e=T(Number(t.value));t.value=String(e),ce(e)}),document.body.append(e),e}function Q(){let e=U()??me();e.hidden=!1}function he(){if(document.getElementById(h))return;s(`
    #${m} {
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

    #${m}[hidden] {
      display: none;
    }

    .${p}__header,
    .${p}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${p}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${p}__controls {
      flex-wrap: wrap;
    }

    #${m} button,
    #${m} input {
      font: inherit;
    }

    #${m} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${m} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${m} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${m} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${m} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${p}__status {
      color: #374151;
      margin-top: 10px;
    }

    .${p}__progress {
      margin-top: 10px;
    }

    .${p}__progress[hidden] {
      display: none;
    }

    .${p}__overall {
      background: #e5e7eb;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      width: 100%;
    }

    .${p}__overall-bar {
      background: #2563eb;
      height: 100%;
      transition: width 180ms ease;
      width: 0%;
    }

    .${p}__lanes {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
      margin-top: 8px;
    }

    .${p}__lane {
      background: #e5e7eb;
      border-radius: 999px;
      height: 6px;
      overflow: hidden;
      position: relative;
    }

    .${p}__lane::before {
      background: #9ca3af;
      content: "";
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }

    .${p}__lane[data-state="active"]::before {
      animation: ${p}-lane 850ms linear infinite;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      width: 80%;
    }

    .${p}__lane[data-state="done"]::before {
      background: #16a34a;
      transform: translateX(0);
    }

    .${p}__lane[data-state="failed"]::before {
      background: #dc2626;
      transform: translateX(0);
    }

    @keyframes ${p}-lane {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(140%);
      }
    }
  `);let e=document.createElement(`meta`);e.id=h,document.head.append(e)}function $(){he(),o(d(`openPanel`),Q),o(d(`fetchAndSave`),()=>{Q(),Z()}),Q()}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,$,{once:!0}):$()})();
