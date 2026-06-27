// ==UserScript==
// @name         image-collector
// @namespace    imageCollector
// @version      5.4.0
// @author       roflsunriz
// @description  Collect images from various hosts and export as archive.
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.meta.js
// @match        *://*
// @match        *://*/*
// @connect      *
// @connect      */*
// @connect      imgur.com
// @connect      flickr.com
// @connect      pinterest.com
// @connect      deviantart.com
// @connect      artstation.com
// @connect      500px.com
// @connect      unsplash.com
// @connect      pexels.com
// @connect      pixiv.net
// @connect      tinypic.com
// @connect      postimages.org
// @connect      imgbox.com
// @connect      imagebam.com
// @connect      imagevenue.com
// @connect      imageshack.us
// @connect      photobucket.com
// @connect      freeimage.host
// @connect      ibb.co
// @connect      imgbb.com
// @connect      gyazo.com
// @connect      twitter.com
// @connect      x.com
// @connect      instagram.com
// @connect      facebook.com
// @connect      reddit.com
// @connect      tumblr.com
// @connect      weibo.com
// @connect      vk.com
// @connect      example.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    const Se={debug:"debug",info:"info",warn:"warn",error:"error"},Ce={debug:10,info:20,warn:30,error:40};let De=o=>Ce[o]>=Ce.warn;const it=o=>{De=o;},x=o=>{const e=`[${o}]`,t={};return Object.keys(Se).forEach(r=>{const a=Se[r];t[r]=(...i)=>{if(!De(r,o))return;(console[a]??console.log)(e,...i);};}),t},Re={debugMode:false,showZipButton:true,singleImageTest:false};class st{state;constructor(e){this.state={...Re,...e};}get snapshot(){return {...this.state}}get debugMode(){return this.state.debugMode}get showZipButton(){return this.state.showZipButton}get singleImageTest(){return this.state.singleImageTest}isDebugEnabled(){return this.state.debugMode===true}setDebugMode(e){return this.state.debugMode=!!e,this.state.debugMode}setShowZipButton(e){return this.state.showZipButton=!!e,this.state.showZipButton}setSingleImageTest(e){return this.state.singleImageTest=!!e,this.state.singleImageTest}update(e){this.state={...this.state,...e};}}var nt=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,lt=typeof GM_xmlhttpRequest<"u"?GM_xmlhttpRequest:void 0;function Ue(){return typeof unsafeWindow<"u"?unsafeWindow:window}function ct(o,e){nt(o,e);}function gt(o,e,t){const r=Ue();r.setImageCollectorDebug=a=>{const i=o.setDebugMode(a);return e.info(`デバッグモード: ${i?"オン":"オフ"}`),i},r.setImageCollectorZipButton=a=>{const i=o.setShowZipButton(a);return e.info(`ZIPボタン: ${i?"表示":"非表示"}`),t.setZipButtonVisibility(i),i},r.setSingleImageTest=a=>{const i=o.setSingleImageTest(a);return e.info(`単一画像テストモード: ${i?"オン":"オフ"}`),i};}const oe=o=>new Promise((e,t)=>{lt({url:o.url,method:o.method??"GET",headers:o.headers,data:o.data,responseType:o.responseType??"text",timeout:o.timeout,onprogress:o.onprogress,onload:r=>{e({status:r.status,statusText:r.statusText,response:r.response,finalUrl:r.finalUrl,headers:r.responseHeaders});},onerror:r=>{const a=r?.error??"unknown error";t(new Error(`GM_xmlhttpRequest failed: ${a}`));},ontimeout:()=>{t(new Error("GM_xmlhttpRequest timeout"));}});}),dt=["en","zh-Hans","hi","es","fr","ar","pt","bn","ru","ur"],ht=["ja",...dt],pt=new Set(["ar","ur"]);function ut(o){return pt.has(o)?"rtl":"ltr"}function mt(o,e,t){const r=o[t],a={},i=o;for(const s of e)a[s]={...r,...i[s]??{}};return a}function ft(o,e){return mt(o,ht,e)}function wt(o,e){return o.replace(/\{([a-zA-Z0-9_]+)\}/g,(t,r)=>{const a=e[r];return a===void 0?t:String(a)})}function It(o){const e=Object.keys(o.translations);let t=o.defaultLocale;const r=d=>{const n=d.toLowerCase(),c=o.aliases?.[n];if(c)return c;const h=e.find(I=>I.toLowerCase()===n);if(h)return h;const p=n.split("-")[0];return e.find(I=>I.toLowerCase().split("-")[0]===p)??null},a=()=>{const d=navigator.languages.length>0?navigator.languages:[navigator.language];for(const n of d){const c=r(n);if(c)return c}return o.fallbackLocale},i=d=>{const n=o.translations[t]?.[d];if(n)return n;const c=o.translations[o.fallbackLocale]?.[d];return c||(o.translations[o.defaultLocale]?.[d]??d)};return {locales:e,getLocale:()=>t,setLocale:d=>{t=d;},detectBrowserLocale:a,t:i,format:(d,n)=>wt(i(d),n),getTranslations:(d=t)=>o.translations[d]??o.translations[o.fallbackLocale],getDirection:(d=t)=>ut(d),getMissingTranslationKeys:d=>{const n=o.translations[o.fallbackLocale],c=o.translations[d];return Object.keys(n).filter(h=>!c[h])}}}const bt=ft({ja:{collectComplete:"{total}枚の画像を収集しました！(高速:{fast}, 通常:{normal})",collectStart:"画像収集を開始します...",collectUnexpectedError:"画像収集中に予期しないエラーが発生しました",classifiedImages:"画像を分類しました: 高速={fast}, 通常={normal}",download:"ダウンロード",externalImagesValidating:"外部画像を検証中...",failedImagesInZip:"{count}枚の画像をZIPに含められませんでした",fullscreenOriginal:"元ページを開く",imageLoadFailed:"画像の読み込みに失敗しました",imageReady:"{processed}/{total} 画像が準備されました",loadImage:"画像を読み込む",menuLaunch:"🚀起動",noDownloadableImages:"ダウンロードできる画像がありません",noImagesFound:"処理対象の画像が見つかりませんでした",noImagesForZip:"ZIPに追加できる画像がありませんでした",progress:"進捗: {percent}%",reliableImagesProcessing:"信頼できる画像を高速処理中...",retry:"再試行",size:"サイズ: {width}x{height} ({size})",testModeOneImage:"テストモード: 1枚だけZIPに追加します",zipDownloadStarted:"ZIPファイルのダウンロードが開始されました",zipEmpty:"ZIPファイルに画像が含まれていません",zipGenerateFailed:"ZIPファイルの生成に失敗しました",zipGenerating:"ZIPファイルを生成しています...",zipLibraryUnavailable:"ZIPライブラリが読み込まれていないため、ダウンロードできません",zipManyImagesSplit:"画像が多いため、{count}個のZIPファイルに分割します",zipNoPrepared:"ZIPファイルが準備されていません。再度準備します...",zipPartStarted:"パート{part}/{total}のダウンロードが開始されました。次のパートを準備中...",zipPrepareComplete:"ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",zipPrepareFailed:"ZIPファイルの準備に失敗しました",zipPrepareStart:"ZIPファイルの準備を開始します...",zipProcessing:"現在処理中です。しばらくお待ちください...",zipReadyCount:"{processed}/{total} 画像が準備されました",zipSplitStarted:"全{count}個のZIPファイルのダウンロードを開始しました",zipTestMode:"テストモード: 単一画像のみでZIPを生成します"},en:{collectComplete:"Collected {total} image(s)! (fast: {fast}, normal: {normal})",collectStart:"Starting image collection...",collectUnexpectedError:"An unexpected error occurred while collecting images",classifiedImages:"Classified images: fast={fast}, normal={normal}",download:"Download",externalImagesValidating:"Validating external images...",failedImagesInZip:"{count} image(s) could not be included in the ZIP",fullscreenOriginal:"Open source page",imageLoadFailed:"Failed to load the image",imageReady:"{processed}/{total} image(s) are ready",loadImage:"Load image",menuLaunch:"🚀 Launch",noDownloadableImages:"There are no downloadable images",noImagesFound:"No target images were found",noImagesForZip:"No images could be added to the ZIP",progress:"Progress: {percent}%",reliableImagesProcessing:"Fast-processing trusted images...",retry:"Retry",size:"Size: {width}x{height} ({size})",testModeOneImage:"Test mode: adding only one image to the ZIP",zipDownloadStarted:"ZIP download has started",zipEmpty:"The ZIP file contains no images",zipGenerateFailed:"Failed to generate the ZIP file",zipGenerating:"Generating ZIP file...",zipLibraryUnavailable:"The ZIP library is not loaded, so the download cannot continue",zipManyImagesSplit:"Too many images; splitting into {count} ZIP files",zipNoPrepared:"The ZIP file is not prepared. Preparing it again...",zipPartStarted:"Part {part}/{total} download has started. Preparing the next part...",zipPrepareComplete:"ZIP preparation is complete. Click the button to download.",zipPrepareFailed:"Failed to prepare the ZIP file",zipPrepareStart:"Starting ZIP preparation...",zipProcessing:"Processing now. Please wait...",zipReadyCount:"{processed}/{total} image(s) are ready",zipSplitStarted:"Started downloading all {count} ZIP files",zipTestMode:"Test mode: generating a ZIP with only one image"},"zh-Hans":{collectComplete:"已收集 {total} 张图片！（快速：{fast}，普通：{normal}）",collectStart:"开始收集图片...",collectUnexpectedError:"收集图片时发生意外错误",classifiedImages:"图片已分类：快速={fast}，普通={normal}",download:"下载",externalImagesValidating:"正在验证外部图片...",failedImagesInZip:"{count} 张图片无法加入 ZIP",fullscreenOriginal:"打开来源页面",imageLoadFailed:"图片加载失败",imageReady:"{processed}/{total} 张图片已准备好",loadImage:"加载图片",menuLaunch:"🚀 启动",noDownloadableImages:"没有可下载的图片",noImagesFound:"未找到处理目标图片",noImagesForZip:"没有可加入 ZIP 的图片",progress:"进度：{percent}%",reliableImagesProcessing:"正在快速处理可信图片...",retry:"重试",size:"尺寸：{width}x{height} ({size})",testModeOneImage:"测试模式：仅向 ZIP 添加一张图片",zipDownloadStarted:"ZIP 文件下载已开始",zipEmpty:"ZIP 文件中没有图片",zipGenerateFailed:"ZIP 文件生成失败",zipGenerating:"正在生成 ZIP 文件...",zipLibraryUnavailable:"ZIP 库未加载，无法继续下载",zipManyImagesSplit:"图片过多，将拆分为 {count} 个 ZIP 文件",zipNoPrepared:"ZIP 文件尚未准备好。正在重新准备...",zipPartStarted:"第 {part}/{total} 部分下载已开始。正在准备下一部分...",zipPrepareComplete:"ZIP 文件准备完成。点击按钮下载。",zipPrepareFailed:"ZIP 文件准备失败",zipPrepareStart:"开始准备 ZIP 文件...",zipProcessing:"正在处理。请稍候...",zipReadyCount:"{processed}/{total} 张图片已准备好",zipSplitStarted:"已开始下载全部 {count} 个 ZIP 文件",zipTestMode:"测试模式：仅用一张图片生成 ZIP"},hi:{collectComplete:"{total} छवियां एकत्र की गईं! (तेज: {fast}, सामान्य: {normal})",collectStart:"छवि संग्रह शुरू किया जा रहा है...",collectUnexpectedError:"छवियां एकत्र करते समय अनपेक्षित त्रुटि हुई",classifiedImages:"छवियां वर्गीकृत: तेज={fast}, सामान्य={normal}",download:"डाउनलोड",externalImagesValidating:"बाहरी छवियों की जांच हो रही है...",failedImagesInZip:"{count} छवियां ZIP में शामिल नहीं की जा सकीं",fullscreenOriginal:"स्रोत पेज खोलें",imageLoadFailed:"छवि लोड करने में विफल",imageReady:"{processed}/{total} छवियां तैयार हैं",loadImage:"छवि लोड करें",menuLaunch:"🚀 शुरू करें",noDownloadableImages:"डाउनलोड योग्य छवियां नहीं हैं",noImagesFound:"लक्षित छवियां नहीं मिलीं",noImagesForZip:"ZIP में जोड़ने योग्य छवियां नहीं मिलीं",progress:"प्रगति: {percent}%",reliableImagesProcessing:"विश्वसनीय छवियों को तेज़ी से संसाधित किया जा रहा है...",retry:"फिर कोशिश करें",size:"आकार: {width}x{height} ({size})",testModeOneImage:"टेस्ट मोड: ZIP में केवल एक छवि जोड़ी जाएगी",zipDownloadStarted:"ZIP डाउनलोड शुरू हो गया है",zipEmpty:"ZIP फ़ाइल में कोई छवि नहीं है",zipGenerateFailed:"ZIP फ़ाइल बनाने में विफल",zipGenerating:"ZIP फ़ाइल बनाई जा रही है...",zipLibraryUnavailable:"ZIP लाइब्रेरी लोड नहीं है, इसलिए डाउनलोड जारी नहीं रह सकता",zipManyImagesSplit:"छवियां बहुत अधिक हैं; {count} ZIP फ़ाइलों में बांटा जाएगा",zipNoPrepared:"ZIP फ़ाइल तैयार नहीं है। फिर से तैयार किया जा रहा है...",zipPartStarted:"भाग {part}/{total} का डाउनलोड शुरू हुआ। अगला भाग तैयार हो रहा है...",zipPrepareComplete:"ZIP तैयारी पूरी हुई। डाउनलोड करने के लिए बटन क्लिक करें।",zipPrepareFailed:"ZIP फ़ाइल तैयार करने में विफल",zipPrepareStart:"ZIP तैयारी शुरू हो रही है...",zipProcessing:"अभी संसाधित हो रहा है। कृपया प्रतीक्षा करें...",zipReadyCount:"{processed}/{total} छवियां तैयार हैं",zipSplitStarted:"सभी {count} ZIP फ़ाइलों का डाउनलोड शुरू हुआ",zipTestMode:"टेस्ट मोड: केवल एक छवि से ZIP बनाया जाएगा"},es:{collectComplete:"Se recopilaron {total} imagen(es). (rápidas: {fast}, normales: {normal})",collectStart:"Iniciando recopilación de imágenes...",collectUnexpectedError:"Ocurrió un error inesperado al recopilar imágenes",classifiedImages:"Imágenes clasificadas: rápidas={fast}, normales={normal}",download:"Descargar",externalImagesValidating:"Validando imágenes externas...",failedImagesInZip:"{count} imagen(es) no pudieron incluirse en el ZIP",fullscreenOriginal:"Abrir página de origen",imageLoadFailed:"No se pudo cargar la imagen",imageReady:"{processed}/{total} imagen(es) listas",loadImage:"Cargar imagen",menuLaunch:"🚀 Iniciar",noDownloadableImages:"No hay imágenes descargables",noImagesFound:"No se encontraron imágenes objetivo",noImagesForZip:"No hay imágenes para agregar al ZIP",progress:"Progreso: {percent}%",reliableImagesProcessing:"Procesando rápidamente imágenes confiables...",retry:"Reintentar",size:"Tamaño: {width}x{height} ({size})",testModeOneImage:"Modo de prueba: se agregará solo una imagen al ZIP",zipDownloadStarted:"La descarga del ZIP ha comenzado",zipEmpty:"El archivo ZIP no contiene imágenes",zipGenerateFailed:"No se pudo generar el archivo ZIP",zipGenerating:"Generando archivo ZIP...",zipLibraryUnavailable:"La biblioteca ZIP no está cargada, por lo que la descarga no puede continuar",zipManyImagesSplit:"Hay demasiadas imágenes; se dividirán en {count} archivos ZIP",zipNoPrepared:"El archivo ZIP no está preparado. Preparándolo de nuevo...",zipPartStarted:"La descarga de la parte {part}/{total} comenzó. Preparando la siguiente parte...",zipPrepareComplete:"La preparación del ZIP se completó. Haz clic en el botón para descargar.",zipPrepareFailed:"No se pudo preparar el archivo ZIP",zipPrepareStart:"Iniciando preparación del ZIP...",zipProcessing:"Procesando ahora. Espera un momento...",zipReadyCount:"{processed}/{total} imagen(es) listas",zipSplitStarted:"Se inició la descarga de los {count} archivos ZIP",zipTestMode:"Modo de prueba: se generará un ZIP con una sola imagen"},fr:{collectComplete:"{total} image(s) collectée(s) ! (rapides : {fast}, normales : {normal})",collectStart:"Démarrage de la collecte d'images...",collectUnexpectedError:"Une erreur inattendue s'est produite pendant la collecte des images",classifiedImages:"Images classées : rapides={fast}, normales={normal}",download:"Télécharger",externalImagesValidating:"Validation des images externes...",failedImagesInZip:"{count} image(s) n'ont pas pu être incluses dans le ZIP",fullscreenOriginal:"Ouvrir la page source",imageLoadFailed:"Échec du chargement de l'image",imageReady:"{processed}/{total} image(s) prêtes",loadImage:"Charger l'image",menuLaunch:"🚀 Lancer",noDownloadableImages:"Aucune image téléchargeable",noImagesFound:"Aucune image cible trouvée",noImagesForZip:"Aucune image ne peut être ajoutée au ZIP",progress:"Progression : {percent}%",reliableImagesProcessing:"Traitement rapide des images fiables en cours...",retry:"Réessayer",size:"Taille : {width}x{height} ({size})",testModeOneImage:"Mode test : une seule image sera ajoutée au ZIP",zipDownloadStarted:"Le téléchargement du ZIP a commencé",zipEmpty:"Le fichier ZIP ne contient aucune image",zipGenerateFailed:"Échec de la génération du fichier ZIP",zipGenerating:"Génération du fichier ZIP...",zipLibraryUnavailable:"La bibliothèque ZIP n'est pas chargée, le téléchargement ne peut pas continuer",zipManyImagesSplit:"Trop d'images ; division en {count} fichiers ZIP",zipNoPrepared:"Le fichier ZIP n'est pas prêt. Nouvelle préparation...",zipPartStarted:"Le téléchargement de la partie {part}/{total} a commencé. Préparation de la suivante...",zipPrepareComplete:"La préparation du ZIP est terminée. Cliquez sur le bouton pour télécharger.",zipPrepareFailed:"Échec de la préparation du fichier ZIP",zipPrepareStart:"Démarrage de la préparation du ZIP...",zipProcessing:"Traitement en cours. Veuillez patienter...",zipReadyCount:"{processed}/{total} image(s) prêtes",zipSplitStarted:"Téléchargement des {count} fichiers ZIP lancé",zipTestMode:"Mode test : génération d'un ZIP avec une seule image"},ar:{collectComplete:"تم جمع {total} صورة! (سريع: {fast}، عادي: {normal})",collectStart:"بدء جمع الصور...",collectUnexpectedError:"حدث خطأ غير متوقع أثناء جمع الصور",classifiedImages:"تم تصنيف الصور: سريع={fast}، عادي={normal}",download:"تنزيل",externalImagesValidating:"جار التحقق من الصور الخارجية...",failedImagesInZip:"تعذر تضمين {count} صورة في ملف ZIP",fullscreenOriginal:"فتح صفحة المصدر",imageLoadFailed:"فشل تحميل الصورة",imageReady:"{processed}/{total} صورة جاهزة",loadImage:"تحميل الصورة",menuLaunch:"🚀 تشغيل",noDownloadableImages:"لا توجد صور قابلة للتنزيل",noImagesFound:"لم يتم العثور على صور مستهدفة",noImagesForZip:"لا توجد صور يمكن إضافتها إلى ZIP",progress:"التقدم: {percent}%",reliableImagesProcessing:"جار المعالجة السريعة للصور الموثوقة...",retry:"إعادة المحاولة",size:"الحجم: {width}x{height} ({size})",testModeOneImage:"وضع الاختبار: إضافة صورة واحدة فقط إلى ZIP",zipDownloadStarted:"بدأ تنزيل ملف ZIP",zipEmpty:"ملف ZIP لا يحتوي على صور",zipGenerateFailed:"فشل إنشاء ملف ZIP",zipGenerating:"جار إنشاء ملف ZIP...",zipLibraryUnavailable:"لم يتم تحميل مكتبة ZIP، لذلك لا يمكن متابعة التنزيل",zipManyImagesSplit:"عدد الصور كبير؛ سيتم التقسيم إلى {count} ملفات ZIP",zipNoPrepared:"ملف ZIP غير جاهز. جار تجهيزه مرة أخرى...",zipPartStarted:"بدأ تنزيل الجزء {part}/{total}. جار تجهيز الجزء التالي...",zipPrepareComplete:"اكتمل تجهيز ZIP. انقر الزر للتنزيل.",zipPrepareFailed:"فشل تجهيز ملف ZIP",zipPrepareStart:"بدء تجهيز ملف ZIP...",zipProcessing:"جار المعالجة الآن. يرجى الانتظار...",zipReadyCount:"{processed}/{total} صورة جاهزة",zipSplitStarted:"بدأ تنزيل جميع ملفات ZIP وعددها {count}",zipTestMode:"وضع الاختبار: إنشاء ZIP بصورة واحدة فقط"},pt:{collectComplete:"{total} imagem(ns) coletada(s)! (rápidas: {fast}, normais: {normal})",collectStart:"Iniciando coleta de imagens...",collectUnexpectedError:"Ocorreu um erro inesperado ao coletar imagens",classifiedImages:"Imagens classificadas: rápidas={fast}, normais={normal}",download:"Baixar",externalImagesValidating:"Validando imagens externas...",failedImagesInZip:"{count} imagem(ns) não puderam ser incluídas no ZIP",fullscreenOriginal:"Abrir página de origem",imageLoadFailed:"Falha ao carregar a imagem",imageReady:"{processed}/{total} imagem(ns) prontas",loadImage:"Carregar imagem",menuLaunch:"🚀 Iniciar",noDownloadableImages:"Não há imagens para baixar",noImagesFound:"Nenhuma imagem alvo foi encontrada",noImagesForZip:"Nenhuma imagem pôde ser adicionada ao ZIP",progress:"Progresso: {percent}%",reliableImagesProcessing:"Processando rapidamente imagens confiáveis...",retry:"Tentar novamente",size:"Tamanho: {width}x{height} ({size})",testModeOneImage:"Modo de teste: adicionando apenas uma imagem ao ZIP",zipDownloadStarted:"O download do ZIP começou",zipEmpty:"O arquivo ZIP não contém imagens",zipGenerateFailed:"Falha ao gerar o arquivo ZIP",zipGenerating:"Gerando arquivo ZIP...",zipLibraryUnavailable:"A biblioteca ZIP não foi carregada, então o download não pode continuar",zipManyImagesSplit:"Há muitas imagens; dividindo em {count} arquivos ZIP",zipNoPrepared:"O arquivo ZIP não está preparado. Preparando novamente...",zipPartStarted:"O download da parte {part}/{total} começou. Preparando a próxima parte...",zipPrepareComplete:"A preparação do ZIP foi concluída. Clique no botão para baixar.",zipPrepareFailed:"Falha ao preparar o arquivo ZIP",zipPrepareStart:"Iniciando preparação do ZIP...",zipProcessing:"Processando agora. Aguarde...",zipReadyCount:"{processed}/{total} imagem(ns) prontas",zipSplitStarted:"Download de todos os {count} arquivos ZIP iniciado",zipTestMode:"Modo de teste: gerando um ZIP com apenas uma imagem"},bn:{collectComplete:"{total}টি ছবি সংগ্রহ করা হয়েছে! (দ্রুত: {fast}, সাধারণ: {normal})",collectStart:"ছবি সংগ্রহ শুরু হচ্ছে...",collectUnexpectedError:"ছবি সংগ্রহের সময় অপ্রত্যাশিত ত্রুটি ঘটেছে",classifiedImages:"ছবি শ্রেণিবদ্ধ হয়েছে: দ্রুত={fast}, সাধারণ={normal}",download:"ডাউনলোড",externalImagesValidating:"বাহ্যিক ছবি যাচাই করা হচ্ছে...",failedImagesInZip:"{count}টি ছবি ZIP-এ রাখা যায়নি",fullscreenOriginal:"উৎস পেজ খুলুন",imageLoadFailed:"ছবি লোড করতে ব্যর্থ",imageReady:"{processed}/{total}টি ছবি প্রস্তুত",loadImage:"ছবি লোড করুন",menuLaunch:"🚀 চালু করুন",noDownloadableImages:"ডাউনলোডযোগ্য ছবি নেই",noImagesFound:"লক্ষ্য ছবি পাওয়া যায়নি",noImagesForZip:"ZIP-এ যোগ করার মতো ছবি নেই",progress:"অগ্রগতি: {percent}%",reliableImagesProcessing:"বিশ্বস্ত ছবি দ্রুত প্রক্রিয়া করা হচ্ছে...",retry:"আবার চেষ্টা করুন",size:"আকার: {width}x{height} ({size})",testModeOneImage:"টেস্ট মোড: ZIP-এ শুধু একটি ছবি যোগ করা হবে",zipDownloadStarted:"ZIP ডাউনলোড শুরু হয়েছে",zipEmpty:"ZIP ফাইলে কোনো ছবি নেই",zipGenerateFailed:"ZIP ফাইল তৈরি করতে ব্যর্থ",zipGenerating:"ZIP ফাইল তৈরি হচ্ছে...",zipLibraryUnavailable:"ZIP লাইব্রেরি লোড হয়নি, তাই ডাউনলোড চলতে পারবে না",zipManyImagesSplit:"ছবি বেশি; {count}টি ZIP ফাইলে ভাগ করা হচ্ছে",zipNoPrepared:"ZIP ফাইল প্রস্তুত নয়। আবার প্রস্তুত করা হচ্ছে...",zipPartStarted:"পার্ট {part}/{total} ডাউনলোড শুরু হয়েছে। পরের পার্ট প্রস্তুত হচ্ছে...",zipPrepareComplete:"ZIP প্রস্তুতি শেষ। ডাউনলোড করতে বোতামে ক্লিক করুন।",zipPrepareFailed:"ZIP ফাইল প্রস্তুত করতে ব্যর্থ",zipPrepareStart:"ZIP প্রস্তুতি শুরু হচ্ছে...",zipProcessing:"এখন প্রক্রিয়াকরণ চলছে। অপেক্ষা করুন...",zipReadyCount:"{processed}/{total}টি ছবি প্রস্তুত",zipSplitStarted:"সব {count}টি ZIP ফাইলের ডাউনলোড শুরু হয়েছে",zipTestMode:"টেস্ট মোড: শুধু একটি ছবি দিয়ে ZIP তৈরি হচ্ছে"},ru:{collectComplete:"Собрано {total} изображений! (быстрые: {fast}, обычные: {normal})",collectStart:"Начинается сбор изображений...",collectUnexpectedError:"При сборе изображений произошла непредвиденная ошибка",classifiedImages:"Изображения классифицированы: быстрые={fast}, обычные={normal}",download:"Скачать",externalImagesValidating:"Проверка внешних изображений...",failedImagesInZip:"{count} изображений не удалось включить в ZIP",fullscreenOriginal:"Открыть исходную страницу",imageLoadFailed:"Не удалось загрузить изображение",imageReady:"Готово изображений: {processed}/{total}",loadImage:"Загрузить изображение",menuLaunch:"🚀 Запустить",noDownloadableImages:"Нет изображений для скачивания",noImagesFound:"Целевые изображения не найдены",noImagesForZip:"Нет изображений для добавления в ZIP",progress:"Прогресс: {percent}%",reliableImagesProcessing:"Быстрая обработка надежных изображений...",retry:"Повторить",size:"Размер: {width}x{height} ({size})",testModeOneImage:"Тестовый режим: в ZIP будет добавлено только одно изображение",zipDownloadStarted:"Загрузка ZIP началась",zipEmpty:"ZIP-файл не содержит изображений",zipGenerateFailed:"Не удалось создать ZIP-файл",zipGenerating:"Создание ZIP-файла...",zipLibraryUnavailable:"Библиотека ZIP не загружена, поэтому загрузку нельзя продолжить",zipManyImagesSplit:"Слишком много изображений; разделение на {count} ZIP-файлов",zipNoPrepared:"ZIP-файл не подготовлен. Подготовка заново...",zipPartStarted:"Загрузка части {part}/{total} началась. Подготовка следующей части...",zipPrepareComplete:"Подготовка ZIP завершена. Нажмите кнопку, чтобы скачать.",zipPrepareFailed:"Не удалось подготовить ZIP-файл",zipPrepareStart:"Начинается подготовка ZIP...",zipProcessing:"Идет обработка. Подождите...",zipReadyCount:"Готово изображений: {processed}/{total}",zipSplitStarted:"Начата загрузка всех ZIP-файлов: {count}",zipTestMode:"Тестовый режим: создание ZIP только с одним изображением"},ur:{collectComplete:"{total} تصاویر جمع ہو گئیں! (تیز: {fast}، عام: {normal})",collectStart:"تصاویر جمع کرنا شروع ہو رہا ہے...",collectUnexpectedError:"تصاویر جمع کرتے وقت غیر متوقع خرابی ہوئی",classifiedImages:"تصاویر کی درجہ بندی ہو گئی: تیز={fast}، عام={normal}",download:"ڈاؤن لوڈ",externalImagesValidating:"بیرونی تصاویر کی توثیق ہو رہی ہے...",failedImagesInZip:"{count} تصاویر ZIP میں شامل نہیں ہو سکیں",fullscreenOriginal:"ماخذ صفحہ کھولیں",imageLoadFailed:"تصویر لوڈ کرنے میں ناکامی",imageReady:"{processed}/{total} تصاویر تیار ہیں",loadImage:"تصویر لوڈ کریں",menuLaunch:"🚀 شروع کریں",noDownloadableImages:"ڈاؤن لوڈ کے قابل تصاویر نہیں ہیں",noImagesFound:"ہدف تصاویر نہیں ملیں",noImagesForZip:"ZIP میں شامل کرنے کے لیے تصاویر نہیں ہیں",progress:"پیش رفت: {percent}%",reliableImagesProcessing:"قابل اعتماد تصاویر تیزی سے پروسیس ہو رہی ہیں...",retry:"دوبارہ کوشش",size:"سائز: {width}x{height} ({size})",testModeOneImage:"ٹیسٹ موڈ: ZIP میں صرف ایک تصویر شامل کی جائے گی",zipDownloadStarted:"ZIP ڈاؤن لوڈ شروع ہو گیا ہے",zipEmpty:"ZIP فائل میں کوئی تصویر نہیں",zipGenerateFailed:"ZIP فائل بنانے میں ناکامی",zipGenerating:"ZIP فائل بن رہی ہے...",zipLibraryUnavailable:"ZIP لائبریری لوڈ نہیں ہے، اس لیے ڈاؤن لوڈ جاری نہیں رہ سکتا",zipManyImagesSplit:"تصاویر بہت زیادہ ہیں؛ {count} ZIP فائلوں میں تقسیم ہو رہی ہیں",zipNoPrepared:"ZIP فائل تیار نہیں۔ دوبارہ تیار کی جا رہی ہے...",zipPartStarted:"حصہ {part}/{total} کا ڈاؤن لوڈ شروع ہو گیا۔ اگلا حصہ تیار ہو رہا ہے...",zipPrepareComplete:"ZIP تیاری مکمل ہے۔ ڈاؤن لوڈ کے لیے بٹن پر کلک کریں۔",zipPrepareFailed:"ZIP فائل تیار کرنے میں ناکامی",zipPrepareStart:"ZIP تیاری شروع ہو رہی ہے...",zipProcessing:"ابھی پروسیسنگ جاری ہے۔ براہ کرم انتظار کریں...",zipReadyCount:"{processed}/{total} تصاویر تیار ہیں",zipSplitStarted:"تمام {count} ZIP فائلوں کا ڈاؤن لوڈ شروع ہو گیا",zipTestMode:"ٹیسٹ موڈ: صرف ایک تصویر کے ساتھ ZIP بنایا جا رہا ہے"}},"en"),re=It({translations:bt,defaultLocale:"ja",fallbackLocale:"en"});re.setLocale(re.detectBrowserLocale());const V=re.format,f=re.t;class He{constructor(e){this.logger=e;}minSize=50;maxSize=5e3;maxFileSize=5*1024*1024;deletedImageSizes=[{width:320,height:320},{width:161,height:81}];async isValidImage(e){if(!e||!this.isImageUrl(e))return  false;try{const t=await this.getImageMetadata(e);return !t||this.isDeletedImage(t)||t.width<this.minSize||t.height<this.minSize||t.width>this.maxSize||t.height>this.maxSize?!1:t.size>this.maxFileSize?"large":!0}catch(t){return this.logger.error("画像のメタデータ取得中にエラーが発生しました",t,{url:e}),false}}isDeletedImage(e){return this.deletedImageSizes.some(t=>t.width===e.width&&t.height===e.height)}createPlaceholder(e,t){try{const r=document.createElement("div");r.classList.add("ic","image-placeholder");const a=document.createElement("div");a.classList.add("ic","size-info"),a.textContent=V("size",{height:String(t.height),size:this.formatBytes(t.size),width:String(t.width)});const i=document.createElement("button");return i.classList.add("ic","load-button"),i.textContent=f("loadImage"),i.addEventListener("click",()=>{try{r.replaceWith(this.createImageElement(e));}catch(s){this.logger.error("画像の読み込み中にエラーが発生しました",s,{url:e});}}),r.append(a,i),r}catch(r){this.logger.error("プレースホルダーの作成中にエラーが発生しました",r,{url:e});const a=document.createElement("div");return a.classList.add("ic","image-placeholder"),a.textContent=f("imageLoadFailed"),a}}createErrorPlaceholder(e){try{const t=document.createElement("div");t.classList.add("ic","image-placeholder"),t.style.backgroundColor="rgba(220, 53, 69, 0.2)";const r=document.createElement("div");r.textContent=f("imageLoadFailed"),r.style.color="#dc3545";const a=document.createElement("button");return a.classList.add("ic","load-button"),a.textContent=f("retry"),a.addEventListener("click",()=>{try{t.replaceWith(this.createImageElement(e));}catch(i){this.logger.error("画像の再読み込み中にエラーが発生しました",i,{url:e});}}),t.append(r,a),t}catch(t){this.logger.error("エラープレースホルダーの作成中にエラーが発生しました",t,{url:e});const r=document.createElement("div");return r.textContent=f("imageLoadFailed"),r}}createImageElement(e){const t=document.createElement("img");return t.src=e,t.classList.add("ic","grid-image"),t}async getImageMetadata(e){return new Promise((t,r)=>{try{const a=new Image;a.crossOrigin="anonymous";const i=window.setTimeout(()=>{this.logger.warn("画像サイズ取得がタイムアウトしました",{url:e}),r(new Error("Image size detection timeout"));},8e3);a.onload=()=>{try{if(window.clearTimeout(i),a.width===0||a.height===0){this.logger.warn("無効な画像サイズです",{url:e,width:a.width,height:a.height}),r(new Error("Invalid image dimensions"));return}oe({method:"HEAD",url:e,timeout:5e3}).then(s=>{try{const l=s.headers??"",g=l.match(/Content-Length:\s*(\d+)/i),d=l.match(/Content-Type:\s*([^;\n]+)/i),n=g?Number.parseInt(g[1],10):0,c=d?d[1]:"";if(!c.startsWith("image/")){this.logger.warn("画像ではないコンテンツタイプです",{url:e,contentType:c}),r(new Error("Not an image"));return}t({width:a.width,height:a.height,size:Number.isFinite(n)?n:0,loaded:a.complete});}catch(l){this.logger.error("ヘッダー解析中にエラーが発生しました",l,{url:e}),r(l);}}).catch(s=>{this.logger.error("画像メタデータ取得中にエラーが発生しました",s,{url:e}),r(new Error("HEAD request failed"));});}catch(s){this.logger.error("メタデータ取得処理でエラーが発生しました",s,{url:e}),r(s);}},a.onerror=()=>{window.clearTimeout(i),this.logger.warn("画像読み込みに失敗しました",{url:e}),r(new Error("Image load error"));},a.src=e;}catch(a){this.logger.error("メタデータ取得処理の開始中にエラーが発生しました",a,{url:e}),r(a);}})}formatBytes(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}isImageUrl(e){const t=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=e.toLowerCase();return t.some(a=>r.endsWith(a))}}class Ae{constructor(e){this.logger=e;}hostPatterns=[/(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,/(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,/(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,/(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,/(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,/(?:https?:\/\/)?(?:www\.)?500px\.com\//i,/(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,/(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,/(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,/(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,/(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,/(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,/(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,/(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,/(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,/(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,/(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,/(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,/(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,/(?:https?:\/\/)?(?:www\.)?x\.com\//i,/(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,/(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,/(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,/(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,/(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,/(?:https?:\/\/)?(?:www\.)?vk\.com\//i];isSupportedHost(e){const t=this.hostPatterns.some(r=>r.test(e));return this.logger.debug("ホストサポート判定",{url:e,supported:t}),t}addHostPattern(e){const t=e instanceof RegExp?e:new RegExp(e,"i");this.hostPatterns.push(t),this.logger.debug("ホストパターンを追加しました",{pattern:t.source});}}class Oe{constructor(e){this.logger=e,this.trustedDomains=new Set([window.location.hostname,"cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com"]);}trustedDomains;classifyImageSource(e,t=null){try{const r=new URL(e,window.location.href);return r.hostname===window.location.hostname?{trustLevel:"high",reason:"same-domain",fastPath:!0,element:t}:this.trustedDomains.has(r.hostname)?{trustLevel:"high",reason:"trusted-cdn",fastPath:!0,element:t}:t&&(t.tagName==="IMG"||t.tagName==="SOURCE")&&t instanceof HTMLImageElement&&t.complete&&t.naturalWidth>0?{trustLevel:"medium",reason:"loaded-dom-element",fastPath:!0,element:t}:r.protocol==="https:"?{trustLevel:"medium",reason:"https-external",fastPath:!1,element:t}:{trustLevel:"low",reason:"untrusted-source",fastPath:!1,element:t}}catch(r){return this.logger.error("画像ソース分類中にエラーが発生しました",r,{url:e}),{trustLevel:"low",reason:"classification-error",fastPath:false,element:t}}}getMetadataFromElement(e){return e instanceof HTMLImageElement?{width:e.naturalWidth||e.width||0,height:e.naturalHeight||e.height||0,size:0,loaded:e.complete}:null}}class Ge{constructor(e,t=5,r=1e3){this.logger=e,this.batchSize=t,this.delay=r;}queue=[];isProcessing=false;addRequest(e){this.queue.push(e),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;let e=0,t=0;for(;this.queue.length>0;){const r=this.queue.splice(0,this.batchSize);e+=1;try{const a=await Promise.allSettled(r.map(s=>s())),i=a.filter(s=>s.status==="rejected").length;t+=i,i>0&&(this.logger.warn("バッチ処理でエラーが発生しました",{batchNumber:e,batchErrors:i}),a.forEach((s,l)=>{if(s.status==="rejected"){const g=s.reason instanceof Error?s.reason:void 0;this.logger.error("バッチ処理タスクでエラーが発生しました",g,{batchNumber:e,taskIndex:l});}}));}catch(a){this.logger.error("バッチ処理中に予期しないエラーが発生しました",a,{batchNumber:e}),t+=1;}this.queue.length>0&&await new Promise(a=>setTimeout(a,this.delay));}t>0?this.logger.warn("バッチ処理完了",{processedBatches:e,totalErrors:t}):this.logger.debug("バッチ処理完了",{processedBatches:e,totalErrors:t});}catch(e){throw this.logger.error("バッチ処理中に致命的なエラーが発生しました",e),e}finally{this.isProcessing=false;}}}class Ve{constructor(e,t,r,a,i){this.uiBatchUpdater=e,this.badImageHandler=t,this.progressBar=r,this.toast=a,this.logger=i,this.imageHostManager=new Ae(x("ImageCollector2:ImageHostManager")),this.imageSourceClassifier=new Oe(x("ImageCollector2:SourceClassifier")),this.requestLimiter=new Ge(x("ImageCollector2:RequestLimiter"));}imageHostManager;imageSourceClassifier;requestLimiter;async collectImages(){this.logger.debug("画像収集開始"),this.toast.show(f("collectStart"),"info"),this.progressBar.show(),this.progressBar.update(0);try{const e=new Map,t=[],r=[];this.collectFromImages(e,t,r),this.collectFromPictureSources(e,t,r),this.collectFromAnchors(e,r),this.collectFromBackgrounds(e,r),this.logger.debug("画像分類完了",{fastPath:t.length,slowPath:r.length}),this.toast.show(V("classifiedImages",{fast:String(t.length),normal:String(r.length)}),"info"),t.length>0&&(this.toast.show(f("reliableImagesProcessing"),"info"),await this.uiBatchUpdater.addImagesFastPath(t),this.progressBar.update(30)),r.length>0&&(this.toast.show(f("externalImagesValidating"),"info"),await this.processSlowPathImages(r));const a=t.length+r.length;if(a===0){this.logger.warn("処理対象の画像が0件です"),this.toast.show(f("noImagesFound"),"warning"),this.progressBar.hide();return}this.progressBar.update(100),setTimeout(()=>{this.progressBar.hide(),this.toast.show(V("collectComplete",{fast:String(t.length),normal:String(r.length),total:String(a)}),"success"),this.logger.debug("画像収集完了",{totalImages:a});},500);}catch(e){this.logger.error("画像収集処理中に予期しないエラーが発生しました",e),this.toast.show(f("collectUnexpectedError"),"error"),this.progressBar.hide();}}collectFromImages(e,t,r){document.querySelectorAll("img").forEach(a=>{try{const i=this.resolveUrl(a.src);if(!i)return;const s=this.imageSourceClassifier.classifyImageSource(i,a);e.set(i,{element:a,classification:s}),s.fastPath?(t.push({url:i,classification:s}),this.logger.debug("高速パス画像",{src:i.substring(0,50),reason:s.reason})):(r.push(i),this.logger.debug("低速パス画像",{src:i.substring(0,50),reason:s.reason}));}catch(i){this.logger.warn("img要素の処理中にエラーが発生しました",{error:i,src:a.src});}});}collectFromPictureSources(e,t,r){document.querySelectorAll("picture source").forEach(a=>{try{a.srcset.split(",").map(s=>s.trim().split(" ")[0]).filter(Boolean).forEach(s=>{const l=this.resolveUrl(s);if(!l||e.has(l))return;const g=this.imageSourceClassifier.classifyImageSource(l,a);e.set(l,{element:a,classification:g}),g.fastPath?(t.push({url:l,classification:g}),this.logger.debug("高速パス(picture)",{src:l.substring(0,50),reason:g.reason})):(r.push(l),this.logger.debug("低速パス(picture)",{src:l.substring(0,50),reason:g.reason}));});}catch(i){this.logger.warn("picture要素の処理中にエラーが発生しました",{error:i,srcset:a.srcset});}});}collectFromAnchors(e,t){document.querySelectorAll("a").forEach(r=>{try{const a=this.resolveUrl(r.href);if(!a||!this.isImageUrl(a)||e.has(a))return;const i=this.imageSourceClassifier.classifyImageSource(a);e.set(a,{element:null,classification:i}),t.push(a),this.logger.debug("低速パス(link)",{src:a.substring(0,50),reason:i.reason});}catch(a){this.logger.warn("a要素の処理中にエラーが発生しました",{error:a,href:r.href});}});}collectFromBackgrounds(e,t){document.querySelectorAll("*").forEach(r=>{try{const a=window.getComputedStyle(r).backgroundImage;if(!a||a==="none")return;const i=a.replace(/^url\(["']?/,"").replace(/["']?\)$/,""),s=this.resolveUrl(i);if(!s||e.has(s))return;const l=this.imageSourceClassifier.classifyImageSource(s);e.set(s,{element:null,classification:l}),t.push(s),this.logger.debug("低速パス(bg)",{src:s.substring(0,50),reason:l.reason});}catch(a){this.logger.warn("背景画像の処理中にエラーが発生しました",{error:a,tag:r.tagName});}});}async processSlowPathImages(e){const t=[];for(const i of e)try{if(this.imageHostManager.isSupportedHost(i)){const s=await this.getSnsImageUrl(i);t.push(s);}else t.push(i);}catch(s){this.logger.warn("SNS画像URL解決中にエラーが発生しました",{error:s,url:i}),t.push(i);}const a=(await Promise.allSettled(t.map(async i=>{try{return await this.badImageHandler.isValidImage(i)?i:null}catch(s){return this.logger.warn("画像検証中にエラーが発生しました",{error:s,url:i}),null}}))).filter(i=>i.status==="fulfilled").map(i=>i.value).filter(i=>i!==null);a.length>0&&await this.uiBatchUpdater.addImages(a),this.progressBar.update(60);}resolveUrl(e){if(!e)return null;try{if(e.includes("?http")){const t=e.split("?http")[1];if(t)return new URL(`http${t}`).href}return new URL(e,window.location.href).href}catch(t){return this.logger.debug("URL解決に失敗しました",{url:e,error:t}),null}}isImageUrl(e){if(!e)return  false;const t=[".jpg",".jpeg",".png",".gif",".webp",".svg"],r=e.toLowerCase();return t.some(a=>r.endsWith(a))}async getSnsImageUrl(e){return /(twitter\.com|x\.com)/i.test(e)?new Promise(t=>{oe({url:e,responseType:"text"}).then(r=>{try{const a=new DOMParser,i=String(r.response.responseText??""),l=a.parseFromString(i,"text/html").querySelector('meta[property="og:image"]');l?.getAttribute("content")?t(l.getAttribute("content")??e):t(e);}catch(a){this.logger.warn("SNS画像の解析中にエラーが発生しました",{error:a,url:e}),t(e);}}).catch(r=>{this.logger.warn("SNS画像URL取得中にエラーが発生しました",{error:r,url:e}),t(e);});}):e}}var S=Uint8Array,F=Uint16Array,Ie=Int32Array,be=new S([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Pe=new S([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Le=new S([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ne=function(o,e){for(var t=new F(31),r=0;r<31;++r)t[r]=e+=1<<o[r-1];for(var a=new Ie(t[30]),r=1;r<30;++r)for(var i=t[r];i<t[r+1];++i)a[i]=i-t[r]<<5|r;return {b:t,r:a}},$e=Ne(be,2),Pt=$e.b,ue=$e.r;Pt[28]=258,ue[258]=28;var vt=Ne(Pe,0),Be=vt.r,me=new F(32768);for(var w=0;w<32768;++w){var q=(w&43690)>>1|(w&21845)<<1;q=(q&52428)>>2|(q&13107)<<2,q=(q&61680)>>4|(q&3855)<<4,me[w]=((q&65280)>>8|(q&255)<<8)>>1;}var te=(function(o,e,t){for(var r=o.length,a=0,i=new F(e);a<r;++a)o[a]&&++i[o[a]-1];var s=new F(e);for(a=1;a<e;++a)s[a]=s[a-1]+i[a-1]<<1;var l;for(l=new F(r),a=0;a<r;++a)o[a]&&(l[a]=me[s[o[a]-1]++]>>15-o[a]);return l}),j=new S(288);for(var w=0;w<144;++w)j[w]=8;for(var w=144;w<256;++w)j[w]=9;for(var w=256;w<280;++w)j[w]=7;for(var w=280;w<288;++w)j[w]=8;var ae=new S(32);for(var w=0;w<32;++w)ae[w]=5;var zt=te(j,9),yt=te(ae,5),qe=function(o){return (o+7)/8|0},je=function(o,e,t){return (t==null||t>o.length)&&(t=o.length),new S(o.subarray(e,t))},Zt=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],ie=function(o,e,t){var r=new Error(e||Zt[o]);if(r.code=o,Error.captureStackTrace&&Error.captureStackTrace(r,ie),!t)throw r;return r},N=function(o,e,t){t<<=e&7;var r=e/8|0;o[r]|=t,o[r+1]|=t>>8;},X=function(o,e,t){t<<=e&7;var r=e/8|0;o[r]|=t,o[r+1]|=t>>8,o[r+2]|=t>>16;},de=function(o,e){for(var t=[],r=0;r<o.length;++r)o[r]&&t.push({s:r,f:o[r]});var a=t.length,i=t.slice();if(!a)return {t:We,l:0};if(a==1){var s=new S(t[0].s+1);return s[t[0].s]=1,{t:s,l:1}}t.sort(function(L,B){return L.f-B.f}),t.push({s:-1,f:25001});var l=t[0],g=t[1],d=0,n=1,c=2;for(t[0]={s:-1,f:l.f+g.f,l,r:g};n!=a-1;)l=t[t[d].f<t[c].f?d++:c++],g=t[d!=n&&t[d].f<t[c].f?d++:c++],t[n++]={s:-1,f:l.f+g.f,l,r:g};for(var h=i[0].s,r=1;r<a;++r)i[r].s>h&&(h=i[r].s);var p=new F(h+1),I=fe(t[n-1],p,0);if(I>e){var r=0,b=0,C=I-e,U=1<<C;for(i.sort(function(B,P){return p[P.s]-p[B.s]||B.f-P.f});r<a;++r){var T=i[r].s;if(p[T]>e)b+=U-(1<<I-p[T]),p[T]=e;else break}for(b>>=C;b>0;){var H=i[r].s;p[H]<e?b-=1<<e-p[H]++-1:++r;}for(;r>=0&&b;--r){var v=i[r].s;p[v]==e&&(--p[v],++b);}I=e;}return {t:new S(p),l:I}},fe=function(o,e,t){return o.s==-1?Math.max(fe(o.l,e,t+1),fe(o.r,e,t+1)):e[o.s]=t},Me=function(o){for(var e=o.length;e&&!o[--e];);for(var t=new F(++e),r=0,a=o[0],i=1,s=function(g){t[r++]=g;},l=1;l<=e;++l)if(o[l]==a&&l!=e)++i;else {if(!a&&i>2){for(;i>138;i-=138)s(32754);i>2&&(s(i>10?i-11<<5|28690:i-3<<5|12305),i=0);}else if(i>3){for(s(a),--i;i>6;i-=6)s(8304);i>2&&(s(i-3<<5|8208),i=0);}for(;i--;)s(a);i=1,a=o[l];}return {c:t.subarray(0,r),n:e}},J=function(o,e){for(var t=0,r=0;r<e.length;++r)t+=o[r]*e[r];return t},_e=function(o,e,t){var r=t.length,a=qe(e+2);o[a]=r&255,o[a+1]=r>>8,o[a+2]=o[a]^255,o[a+3]=o[a+1]^255;for(var i=0;i<r;++i)o[a+i+4]=t[i];return (a+4+r)*8},Ee=function(o,e,t,r,a,i,s,l,g,d,n){N(e,n++,t),++a[256];for(var c=de(a,15),h=c.t,p=c.l,I=de(i,15),b=I.t,C=I.l,U=Me(h),T=U.c,H=U.n,v=Me(b),L=v.c,B=v.n,P=new F(19),m=0;m<T.length;++m)++P[T[m]&31];for(var m=0;m<L.length;++m)++P[L[m]&31];for(var u=de(P,7),M=u.t,_=u.l,E=19;E>4&&!M[Le[E-1]];--E);var W=d+5<<3,k=J(a,j)+J(i,ae)+s,D=J(a,h)+J(i,b)+s+14+3*E+J(P,M)+2*P[16]+3*P[17]+7*P[18];if(g>=0&&W<=k&&W<=D)return _e(e,n,o.subarray(g,g+d));var A,z,R,$;if(N(e,n,1+(D<k)),n+=2,D<k){A=te(h,p),z=h,R=te(b,C),$=b;var ne=te(M,_);N(e,n,H-257),N(e,n+5,B-1),N(e,n+10,E-4),n+=14;for(var m=0;m<E;++m)N(e,n+3*m,M[Le[m]]);n+=3*E;for(var O=[T,L],K=0;K<2;++K)for(var Q=O[K],m=0;m<Q.length;++m){var G=Q[m]&31;N(e,n,ne[G]),n+=M[G],G>15&&(N(e,n,Q[m]>>5&127),n+=Q[m]>>12);}}else A=zt,z=j,R=yt,$=ae;for(var m=0;m<l;++m){var Z=r[m];if(Z>255){var G=Z>>18&31;X(e,n,A[G+257]),n+=z[G+257],G>7&&(N(e,n,Z>>23&31),n+=be[G]);var Y=Z&31;X(e,n,R[Y]),n+=$[Y],Y>3&&(X(e,n,Z>>5&8191),n+=Pe[Y]);}else X(e,n,A[Z]),n+=z[Z];}return X(e,n,A[256]),n+z[256]},xt=new Ie([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),We=new S(0),St=function(o,e,t,r,a,i){var s=i.z||o.length,l=new S(r+s+5*(1+Math.ceil(s/7e3))+a),g=l.subarray(r,l.length-a),d=i.l,n=(i.r||0)&7;if(e){n&&(g[0]=i.r>>3);for(var c=xt[e-1],h=c>>13,p=c&8191,I=(1<<t)-1,b=i.p||new F(32768),C=i.h||new F(I+1),U=Math.ceil(t/3),T=2*U,H=function(ge){return (o[ge]^o[ge+1]<<U^o[ge+2]<<T)&I},v=new Ie(25e3),L=new F(288),B=new F(32),P=0,m=0,u=i.i||0,M=0,_=i.w||0,E=0;u+2<s;++u){var W=H(u),k=u&32767,D=C[W];if(b[k]=D,C[W]=k,_<=u){var A=s-u;if((P>7e3||M>24576)&&(A>423||!d)){n=Ee(o,g,0,v,L,B,m,M,E,u-E,n),M=P=m=0,E=u;for(var z=0;z<286;++z)L[z]=0;for(var z=0;z<30;++z)B[z]=0;}var R=2,$=0,ne=p,O=k-D&32767;if(A>2&&W==H(u-O))for(var K=Math.min(h,A)-1,Q=Math.min(32767,u),G=Math.min(258,A);O<=Q&&--ne&&k!=D;){if(o[u+R]==o[u+R-O]){for(var Z=0;Z<G&&o[u+Z]==o[u+Z-O];++Z);if(Z>R){if(R=Z,$=O,Z>K)break;for(var Y=Math.min(O,Z-2),ze=0,z=0;z<Y;++z){var le=u-O+z&32767,ot=b[le],ye=le-ot&32767;ye>ze&&(ze=ye,D=le);}}}k=D,D=b[k],O+=k-D&32767;}if($){v[M++]=268435456|ue[R]<<18|Be[$];var Ze=ue[R]&31,xe=Be[$]&31;m+=be[Ze]+Pe[xe],++L[257+Ze],++B[xe],_=u+R,++P;}else v[M++]=o[u],++L[o[u]];}}for(u=Math.max(u,_);u<s;++u)v[M++]=o[u],++L[o[u]];n=Ee(o,g,d,v,L,B,m,M,E,u-E,n),d||(i.r=n&7|g[n/8|0]<<3,n-=7,i.h=C,i.p=b,i.i=u,i.w=_);}else {for(var u=i.w||0;u<s+d;u+=65535){var ce=u+65535;ce>=s&&(g[n/8|0]=d,ce=s),n=_e(g,n+1,o.subarray(u,ce));}i.i=s;}return je(l,0,r+qe(n)+a)},Ct=(function(){for(var o=new Int32Array(256),e=0;e<256;++e){for(var t=e,r=9;--r;)t=(t&1&&-306674912)^t>>>1;o[e]=t;}return o})(),Lt=function(){var o=-1;return {p:function(e){for(var t=o,r=0;r<e.length;++r)t=Ct[t&255^e[r]]^t>>>8;o=t;},d:function(){return ~o}}},Bt=function(o,e,t,r,a){if(!a&&(a={l:1},e.dictionary)){var i=e.dictionary.subarray(-32768),s=new S(i.length+o.length);s.set(i),s.set(o,i.length),o=s,a.w=i.length;}return St(o,e.level==null?6:e.level,e.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(o.length)))*1.5):20:12+e.mem,t,r,a)},Qe=function(o,e){var t={};for(var r in o)t[r]=o[r];for(var r in e)t[r]=e[r];return t},y=function(o,e,t){for(;t;++e)o[e]=t,t>>>=8;};function Mt(o,e){return Bt(o,e||{},0,0)}var Ye=function(o,e,t,r){for(var a in o){var i=o[a],s=e+a,l=r;Array.isArray(i)&&(l=Qe(r,i[1]),i=i[0]),i instanceof S?t[s]=[i,l]:(t[s+="/"]=[new S(0),l],Ye(i,s,t,r));}},Fe=typeof TextEncoder<"u"&&new TextEncoder,Et=typeof TextDecoder<"u"&&new TextDecoder,Ft=0;try{Et.decode(We,{stream:!0}),Ft=1;}catch{}function Te(o,e){var t;if(Fe)return Fe.encode(o);for(var r=o.length,a=new S(o.length+(o.length>>1)),i=0,s=function(d){a[i++]=d;},t=0;t<r;++t){if(i+5>a.length){var l=new S(i+8+(r-t<<1));l.set(a),a=l;}var g=o.charCodeAt(t);g<128||e?s(g):g<2048?(s(192|g>>6),s(128|g&63)):g>55295&&g<57344?(g=65536+(g&1047552)|o.charCodeAt(++t)&1023,s(240|g>>18),s(128|g>>12&63),s(128|g>>6&63),s(128|g&63)):(s(224|g>>12),s(128|g>>6&63),s(128|g&63));}return je(a,0,i)}var we=function(o){var e=0;if(o)for(var t in o){var r=o[t].length;r>65535&&ie(9),e+=r+4;}return e},ke=function(o,e,t,r,a,i,s,l){var g=r.length,d=t.extra,n=l&&l.length,c=we(d);y(o,e,s!=null?33639248:67324752),e+=4,s!=null&&(o[e++]=20,o[e++]=t.os),o[e]=20,e+=2,o[e++]=t.flag<<1|(i<0&&8),o[e++]=a&&8,o[e++]=t.compression&255,o[e++]=t.compression>>8;var h=new Date(t.mtime==null?Date.now():t.mtime),p=h.getFullYear()-1980;if((p<0||p>119)&&ie(10),y(o,e,p<<25|h.getMonth()+1<<21|h.getDate()<<16|h.getHours()<<11|h.getMinutes()<<5|h.getSeconds()>>1),e+=4,i!=-1&&(y(o,e,t.crc),y(o,e+4,i<0?-i-2:i),y(o,e+8,t.size)),y(o,e+12,g),y(o,e+14,c),e+=16,s!=null&&(y(o,e,n),y(o,e+6,t.attrs),y(o,e+10,s),e+=14),o.set(r,e),e+=g,c)for(var I in d){var b=d[I],C=b.length;y(o,e,+I),y(o,e+2,C),o.set(b,e+4),e+=4+C;}return n&&(o.set(l,e),e+=n),e},Tt=function(o,e,t,r,a){y(o,e,101010256),y(o,e+8,t),y(o,e+10,t),y(o,e+12,r),y(o,e+16,a);};function he(o,e){e||(e={});var t={},r=[];Ye(o,"",t,e);var a=0,i=0;for(var s in t){var l=t[s],g=l[0],d=l[1],n=d.level==0?0:8,c=Te(s),h=c.length,p=d.comment,I=p&&Te(p),b=I&&I.length,C=we(d.extra);h>65535&&ie(11);var U=n?Mt(g,d):g,T=U.length,H=Lt();H.p(g),r.push(Qe(d,{size:g.length,crc:H.d(),c:U,f:c,m:I,u:h!=s.length||I&&p.length!=b,o:a,compression:n})),a+=30+h+C+T,i+=76+2*(h+C)+(b||0)+T;}for(var v=new S(i+22),L=a,B=i-a,P=0;P<r.length;++P){var c=r[P];ke(v,c.o,c,c.f,c.u,c.c.length);var m=30+c.f.length+we(c.extra);v.set(c.c,c.o+m),ke(v,a,c,c.f,c.u,c.c.length,c.o,c.m),a+=16+m+(c.m?c.m.length:0);}return Tt(v,a,r.length,B,L),v}var kt="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z",Dt="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z",Rt="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z";function ve(o,e=24){const t=String(e),r=String(e);return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${r}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${o}"></path></svg>`}const ee=ve(Dt),Ut=ve(kt),Ht=ve(Rt),At={maxZipSize:500*1024*1024,maxImagesPerZip:300,compressionLevel:6,splitZipFiles:true};class Ke{constructor(e,t,r,a,i,s,l=At){this.uiBuilder=e,this.badImageHandler=t,this.toast=r,this.progressBar=a,this.logger=i,this.config=s,this.options=l;}filesData=new Map;downloadedUrls=new Set;isProcessing=false;async prepareZip(){if(this.logger.debug("prepareZip開始"),this.isProcessing){this.logger.debug("既に処理中のため、prepareZipをスキップ"),this.toast.show(f("zipProcessing"),"info");return}this.isProcessing=true;try{this.filesData.clear(),this.uiBuilder.setZipButtonState("processing",Ht),this.toast.show(f("zipPrepareStart"),"info"),this.progressBar.show(),this.progressBar.update(0);let e=Array.from(this.uiBuilder.imageData.keys());this.config.singleImageTest&&e.length>0&&(this.logger.debug("単一画像テストモード: 最初の1枚だけ処理します"),e=[e[0]],this.toast.show(f("testModeOneImage"),"warning"));const t=e.length;if(this.logger.debug(`画像URL ${t}件を収集`),t===0){this.toast.show(f("noDownloadableImages"),"error"),this.uiBuilder.setZipButtonState("initial",ee);return}let r=0,a=0,i=0;const s=[],l=this.uiBuilder.imageData;for(const[d,n]of e.entries())try{this.logger.debug(`画像情報収集 ${d+1}/${t}: ${n.substring(0,50)}...`);const c=l.get(n);if(!c){this.logger.error("画像データが見つかりません",void 0,{url:n}),a+=1;continue}if(this.logger.debug("メタデータ",{width:c.metadata?.width,height:c.metadata?.height,size:c.metadata?.size,hasBlob:c.blob!==null}),c.blob)i+=1,this.logger.debug("既存のBlobを使用",{size:c.blob.size});else try{const p=await this.fetchImageAsBlob(n);c.blob=p,l.set(n,c),this.logger.debug("Blobダウンロード成功",{size:p.size});}catch(p){this.logger.error("画像のダウンロードに失敗しました",p,{url:n}),a+=1;continue}const h=this.getFilenameFromUrl(n);s.push({url:n,entry:c,fileName:h});}catch(c){this.logger.error("画像メタデータ処理中にエラーが発生しました",c,{url:n,index:d}),a+=1;}this.logger.debug("並列処理開始",{count:s.length}),s.length===0&&this.toast.show(f("noImagesForZip"),"warning");const g=await Promise.all(s.map(async({url:d,entry:n,fileName:c},h)=>{try{if(!n.blob)return this.logger.error("Blobが存在しません",void 0,{url:d,fileName:c}),{success:!1,url:d,fileName:c};this.logger.debug("画像変換",{index:h+1,fileName:c});const p=new Uint8Array(await n.blob.arrayBuffer());return p.byteLength===0?(this.logger.warn("変換後のデータが空です",{url:d,fileName:c}),{success:!1,url:d,fileName:c}):{success:!0,url:d,fileName:c,bytes:p}}catch(p){return this.logger.error("画像処理中にエラーが発生しました",p,{url:d,fileName:c}),{success:!1,url:d,fileName:c}}}));for(const d of g){d.success&&d.bytes?(this.filesData.set(d.fileName,d.bytes),this.downloadedUrls.add(d.url),r+=1):a+=1;const n=r/t*100;this.progressBar.update(n);}this.logger.debug("並列処理完了",{processed:r,failed:a,skipped:i,filesCount:this.filesData.size}),this.toast.show(V("zipReadyCount",{processed:String(r),total:String(t)}),"info"),this.config.singleImageTest&&(this.logger.debug("単一画像テストモードで実行されました"),this.toast.show(f("zipTestMode"),"info")),a>0&&this.toast.show(V("failedImagesInZip",{count:String(a)}),"warning"),r>0?(this.toast.show(f("zipPrepareComplete"),"success"),this.uiBuilder.setZipButtonState("ready",Ut)):(this.logger.error("処理された画像が0件です",void 0,{total:t,processed:r,failed:a}),this.toast.show(f("zipGenerateFailed"),"error"),this.uiBuilder.setZipButtonState("initial",ee),this.filesData.clear());}catch(e){this.logger.error("ZIP準備中にエラーが発生しました",e,{filesDataSize:this.filesData.size}),this.toast.show(f("zipPrepareFailed"),"error"),this.uiBuilder.setZipButtonState("initial",ee),this.filesData.clear();}finally{this.progressBar.hide(),this.isProcessing=false;}}async downloadZip(){if(this.logger.debug("downloadZip開始"),!this.fflateAvailable()){this.toast.show(f("zipLibraryUnavailable"),"error"),this.logger.error("fflate利用不可のためダウンロード中止");return}if(this.filesData.size===0){this.logger.warn("ファイルデータが空のため準備からやり直し"),this.toast.show(f("zipNoPrepared"),"warning"),await this.prepareZip();return}const e=Array.from(this.filesData.entries());if(e.length===0){this.logger.error("ZIPファイルが空です"),this.toast.show(f("zipEmpty"),"error"),this.uiBuilder.setZipButtonState("initial",ee);return}this.logger.debug("ZIP内のファイル数",{count:e.length});try{this.isProcessing=!0,this.toast.show(f("zipGenerating"),"info"),this.progressBar.show();const t=e.length;this.options.splitZipFiles&&t>this.options.maxImagesPerZip?await this.generateSplitZips(e,t):await this.generateSingleZip(e);}catch(t){this.logger.error("ZIPダウンロード中に詳細エラー情報",t,{filesDataSize:this.filesData.size}),this.toast.show(f("zipGenerateFailed"),"error");}finally{this.progressBar.hide(),this.uiBuilder.setZipButtonState("initial",'<span class="ic material-icons">download</span>'),this.isProcessing=false;}}async generateSingleZip(e){this.logger.debug("単一ZIPファイル生成開始");const t=performance.now(),r={};for(const[g,d]of e)r[g]=d;const a=this.createZipOptions(),i=he(r,a);if(this.logger.debug("ZIP生成時間",{milliseconds:Math.round(performance.now()-t)}),!i)throw new Error("ZIP生成結果がnullです");const s=this.createZipBlob(i),l=`images_${this.getFormattedDate()}.zip`;await this.triggerDownload(s,l),this.toast.show(f("zipDownloadStarted"),"success");}async generateSplitZips(e,t){this.logger.debug("分割ZIPファイル生成開始",{totalEntries:t});const r=Math.ceil(t/this.options.maxImagesPerZip);this.toast.show(V("zipManyImagesSplit",{count:String(r)}),"info");for(let a=0;a<r;a+=1){const i=a*this.options.maxImagesPerZip,s=Math.min((a+1)*this.options.maxImagesPerZip,t),l=e.slice(i,s);this.logger.debug("分割ZIP生成",{part:a+1,start:i+1,end:s}),this.progressBar.update(a/r*100);const g={};for(const[h,p]of l)g[h]=p;const d=he(g,this.createZipOptions()),n=this.createZipBlob(d),c=`images_${this.getFormattedDate()}_part${a+1}of${r}.zip`;await this.triggerDownload(n,c),a<r-1&&(this.toast.show(V("zipPartStarted",{part:String(a+1),total:String(r)}),"success"),await new Promise(h=>setTimeout(h,1500)));}this.toast.show(V("zipSplitStarted",{count:String(r)}),"success");}triggerDownload(e,t){return this.logger.debug("ダウンロード開始",{filename:t}),new Promise((r,a)=>{try{const i=document.createElement("a");i.href=URL.createObjectURL(e),i.download=t,document.body.appendChild(i),i.click(),setTimeout(()=>{document.body.removeChild(i),URL.revokeObjectURL(i.href),r();},100);}catch(i){this.logger.error("ダウンロードリンク作成エラー",i,{filename:t}),a(i);}})}fetchImageAsBlob(e){return this.logger.debug("fetchImageAsBlob開始",{url:e.substring(0,50)}),new Promise((t,r)=>{oe({url:e,responseType:"blob",timeout:3e4}).then(a=>{const i=a.response;i?(this.logger.debug("画像ダウンロード成功",{url:e.substring(0,50),size:i.size}),t(i)):(this.logger.error("レスポンスまたはレスポンスデータが空です",void 0,{url:e}),r(new Error("Empty response")));}).catch(a=>{this.logger.error("画像ダウンロード失敗",void 0,{url:e,error:a}),r(a);});})}createZipOptions(){return {level:this.options.compressionLevel,mem:8}}createZipBlob(e){const t=e.slice().buffer;return new Blob([t],{type:"application/zip"})}getFilenameFromUrl(e){const[t]=e.split("?");let r=t?.split("/").pop()??"image.jpg";r.includes(".")||(r+=".jpg");const a=r.substring(0,r.lastIndexOf(".")),i=r.substring(r.lastIndexOf("."));let s=1,l=r;for(;this.filesData.has(l);)l=`${a}_${s}${i}`,s+=1;return l}getFormattedDate(){const e=new Date,t=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0"),i=String(e.getHours()).padStart(2,"0"),s=String(e.getMinutes()).padStart(2,"0");return `${t}${r}${a}_${i}${s}`}fflateAvailable(){return typeof he=="function"}}class Xe{constructor(e,t,r){this.uiBuilder=e,this.imageCollector=t,this.logger=r;}register(){ct(f("menuLaunch"),()=>{try{this.uiBuilder.showModal(),this.imageCollector.collectImages();}catch(e){this.logger.error("メニューコマンド実行中にエラーが発生しました",e);}}),this.logger.debug("メニューコマンドを登録しました");}}const se=(o={})=>{const e=document.createElement("div");o.id&&(e.id=o.id),e.style.position="relative";const t=e.attachShadow({mode:o.mode??"open"});if(o.cssText){const r=document.createElement("style");r.textContent=o.cssText,t.appendChild(r);}return o.adoptStyles?.length&&o.adoptStyles.forEach(r=>{const a=document.createElement("style");a.textContent=r,t.appendChild(a);}),document.body.appendChild(e),{host:e,root:t,dispose:()=>{e.remove();}}};class Je{constructor(e){this.logger=e,this.init();}progressContainer=null;progressBar=null;progressText=null;shadowHost=null;shadowRoot=null;show(){this.getContainer().style.display="block";}hide(){this.getContainer().style.display="none";}update(e){const t=Math.max(0,Math.min(100,e));this.getProgressBar().style.width=`${t}%`,this.getProgressText().textContent=V("progress",{percent:t.toFixed(0)});}init(){const{host:e,root:t}=se({id:"progress-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t;const r=document.createElement("style");r.textContent=`
      .ic.progress-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 5px;
        z-index: 10001;
        display: none;
      }

      .ic.progress-bar {
        height: 10px;
        background-color: #4caf50;
        border-radius: 5px;
        width: 0%;
        transition: width 0.3s ease;
      }

      .ic.progress-text {
        text-align: center;
        color: white;
        margin-top: 5px;
        font-size: 0.9rem;
      }
    `,this.shadowRoot.appendChild(r),this.progressContainer=document.createElement("div"),this.progressContainer.classList.add("ic","progress-container"),this.progressBar=document.createElement("div"),this.progressBar.classList.add("ic","progress-bar"),this.progressContainer.appendChild(this.progressBar),this.progressText=document.createElement("div"),this.progressText.classList.add("ic","progress-text"),this.progressText.textContent=V("progress",{percent:"0"}),this.progressContainer.appendChild(this.progressText),this.shadowRoot.appendChild(this.progressContainer),this.logger.debug("プログレスバーUIを初期化しました");}getContainer(){if(!this.progressContainer)throw new Error("Progress container is not initialized.");return this.progressContainer}getProgressBar(){if(!this.progressBar)throw new Error("Progress bar is not initialized.");return this.progressBar}getProgressText(){if(!this.progressText)throw new Error("Progress text is not initialized.");return this.progressText}}class et{constructor(e){this.logger=e,this.init();}toastContainer=null;shadowHost=null;shadowRoot=null;show(e,t="info",r=3e3){const a=this.getToastContainer(),i=document.createElement("div");i.classList.add("ic","toast",`ic.toast-${t}`),i.textContent=e,a.appendChild(i),setTimeout(()=>{i.classList.add("show");},10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{i.parentNode&&i.remove();},300);},r);}init(){const{host:e,root:t}=se({id:"toast-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t;const r=document.createElement("style");r.textContent=`
      .ic.toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .ic.toast {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .ic.toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .ic.toast-info {
        background-color: rgba(0, 123, 255, 0.9);
      }

      .ic.toast-success {
        background-color: rgba(40, 167, 69, 0.9);
      }

      .ic.toast-warning {
        background-color: rgba(255, 193, 7, 0.9);
      }

      .ic.toast-error {
        background-color: rgba(220, 53, 69, 0.9);
      }
    `,this.shadowRoot.appendChild(r),this.toastContainer=document.createElement("div"),this.toastContainer.classList.add("ic","toast-container"),this.shadowRoot.appendChild(this.toastContainer),this.logger.debug("トーストUIを初期化しました");}getToastContainer(){if(!this.toastContainer)throw new Error("Toast container is not initialized.");return this.toastContainer}}class tt{constructor(e,t,r){this.uiBuilder=e,this.badImageHandler=t,this.logger=r;}imageQueue=[];isProcessing=false;async addImagesFastPath(e){if(!Array.isArray(e)){this.logger.error("imageItemsが配列ではありません",void 0,{type:typeof e});return}let t=0,r=0;for(const a of e)try{const{url:i,classification:s}=a;let l=null;const g=s.element;if(g instanceof HTMLImageElement&&g.naturalWidth>0&&g.naturalHeight>0&&(l={width:g.naturalWidth,height:g.naturalHeight,size:0,loaded:g.complete},this.logger.debug(`DOM要素からメタデータ取得: ${i.substring(0,50)}...`,{width:l.width,height:l.height})),!l&&(l=await this.badImageHandler.getImageMetadata(i),!l)){this.logger.warn("高速パスでもメタデータ取得に失敗しました",{url:i}),r+=1;continue}this.imageQueue.push({url:i,metadata:l}),t+=1;}catch(i){this.logger.error("高速パス画像処理中にエラーが発生しました",i,{url:a.url}),r+=1;}this.logger.debug("高速パス処理完了",{successCount:t,failureCount:r}),this.isProcessing||this.processBatch();}async addImages(e){if(!Array.isArray(e)){this.logger.error("imageUrlsが配列ではありません",void 0,{type:typeof e});return}let t=0,r=0;for(const a of e)try{const i=await this.badImageHandler.getImageMetadata(a);if(!i){this.logger.warn("画像のメタデータ取得に失敗しました",{url:a}),r+=1;continue}this.imageQueue.push({url:a,metadata:i}),t+=1;}catch(i){this.logger.error("画像メタデータの取得中にエラーが発生しました",i,{url:a}),r+=1;}this.logger.debug("画像追加処理完了",{successCount:t,failureCount:r}),this.isProcessing||this.processBatch();}async processBatch(){try{this.isProcessing=!0;const e=5,t=()=>{try{this.imageQueue.splice(0,e).forEach(({url:a,metadata:i})=>{try{this.uiBuilder.addImageToGrid(a,i);}catch(s){this.logger.error("グリッドへの画像追加中にエラーが発生しました",s,{url:a});}}),this.imageQueue.length>0?requestAnimationFrame(t):(this.isProcessing=!1,this.logger.debug("バッチ処理が完了しました"));}catch(r){this.logger.error("バッチ処理中にエラーが発生しました",r),this.isProcessing=!1;}};requestAnimationFrame(t);}catch(e){this.logger.error("バッチ処理の開始中にエラーが発生しました",e),this.isProcessing=false;}}}class rt{constructor(e,t,r){this.config=e,this.badImageHandler=t,this.logger=r;}modal=null;gridContainer=null;closeButton=null;zipButton=null;shadowHost=null;shadowRoot=null;imageStore=new Map;buildModal(){try{const{host:e,root:t}=se({id:"image-collector-shadow-host",mode:"closed"});this.shadowHost=e,this.shadowRoot=t,this.injectShadowStyles(this.shadowRoot),this.modal=document.createElement("div"),this.modal.classList.add("image-collector-modal"),this.gridContainer=document.createElement("div"),this.gridContainer.classList.add("ic","image-grid-container"),this.modal.appendChild(this.gridContainer),this.zipButton=document.createElement("button"),this.zipButton.classList.add("ic","zip-download-button"),this.zipButton.innerHTML=ee,this.zipButton.dataset.state="initial",this.zipButton.style.display=this.config.showZipButton?"flex":"none",this.modal.appendChild(this.zipButton),this.closeButton=document.createElement("button"),this.closeButton.classList.add("ic","close-button"),this.closeButton.textContent="×",this.modal.appendChild(this.closeButton),this.shadowRoot.appendChild(this.modal),document.body.appendChild(this.shadowHost),this.logger.debug("モーダルの構築が完了しました");}catch(e){throw this.logger.error("モーダルの構築中にエラーが発生しました",e),e}}addImageToGrid(e,t){const r=this.getGridContainer(),a=this.createImageItem(e,t);r.appendChild(a);}showModal(){this.getModalElement().style.display="block";}hideModal(){const e=this.getGridContainer();e.innerHTML="",this.getModalElement().style.display="none";}setZipButtonVisibility(e){const t=this.getZipButton();t.style.display=e?"flex":"none";}setZipButtonState(e,t){const r=this.getZipButton();r.dataset.state=e,r.innerHTML=t;}get imageData(){return this.imageStore}getModalElement(){if(!this.modal)throw new Error("Modal has not been built yet.");return this.modal}getGridContainer(){if(!this.gridContainer)throw new Error("Grid container has not been built yet.");return this.gridContainer}getZipButton(){if(!this.zipButton)throw new Error("ZIP button has not been built yet.");return this.zipButton}getCloseButton(){if(!this.closeButton)throw new Error("Close button has not been built yet.");return this.closeButton}injectShadowStyles(e){const t=document.createElement("style");t.textContent=`
      .image-collector-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none;
        z-index: 9999;
        backdrop-filter: blur(10px);
        overflow-y: auto;
      }

      .ic.image-grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        padding: 20px;
        max-width: 90%;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(5px);
        margin-top: 50px;
      }

      .ic.image-item {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
      }

      .ic.image-item:hover {
        transform: scale(1.05);
      }

      .ic.grid-image {
        width: 100%;
        height: auto;
        display: block;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }

      .ic.grid-image:hover {
        opacity: 1;
      }

      .ic.close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10000;
        transition: color 0.3s ease;
      }

      .ic.close-button:hover {
        color: #ff4444;
      }

      .ic.zip-download-button {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: rgba(0, 123, 255, 0.2);
        border: 2px solid rgba(0, 123, 255, 0.4);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
      }

      .ic.zip-download-button:hover {
        background-color: rgba(0, 123, 255, 0.4);
        transform: scale(1.1);
      }

      .ic.zip-download-button[data-state="processing"] {
        background-color: rgba(255, 193, 7, 0.2);
        border-color: rgba(255, 193, 7, 0.4);
        animation: pulse 1.5s infinite;
      }

      .ic.zip-download-button[data-state="ready"] {
        background-color: rgba(40, 167, 69, 0.2);
        border-color: rgba(40, 167, 69, 0.4);
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
        }
      }

      /* Material Icons font removed; now using inline SVG from @mdi/js */

      .ic.image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        text-align: center;
      }

      .ic.size-info {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10px;
      }

      .ic.load-button {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.load-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ic.full-screen-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }

      .ic.download-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.download-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10003;
        transition: color 0.3s ease;
      }

      .ic.full-screen-close-button:hover {
        color: #ff4444;
      }

      .ic.original-link-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.original-link-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.file-name-display {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 1.2rem;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 10003;
      }
    `,e.appendChild(t);}createImageItem(e,t){const r=document.createElement("div");if(r.classList.add("ic","image-item"),this.imageStore.set(e,{metadata:t,blob:null}),t.size>this.badImageHandler.maxFileSize)return r.appendChild(this.badImageHandler.createPlaceholder(e,t)),r;const a=document.createElement("img");return a.src=e,a.alt="Collected Image",a.classList.add("ic","grid-image"),a.onerror=()=>{this.logger.warn("画像の読み込みに失敗しました",{imageUrl:e});const i=this.badImageHandler.createErrorPlaceholder(e);r.replaceChildren(i);},r.appendChild(a),r}}class at{constructor(e,t,r){this.uiBuilder=e,this.zipDownloader=t,this.logger=r;}initialize(){this.setupModalInteractions(),this.setupZipButton(),this.setupGridInteractions(),this.logger.debug("イベントハンドラーの設定が完了しました");}setupModalInteractions(){const e=this.uiBuilder.getModalElement();e.addEventListener("click",t=>{try{t.target===e&&this.uiBuilder.hideModal();}catch(r){this.logger.error("モーダルクリックイベント処理中にエラーが発生しました",r);}}),this.uiBuilder.getCloseButton().addEventListener("click",()=>{try{this.uiBuilder.hideModal();}catch(t){this.logger.error("閉じるボタンクリック処理中にエラーが発生しました",t);}});}setupZipButton(){this.uiBuilder.getZipButton().addEventListener("click",()=>{try{const e=this.uiBuilder.getZipButton().dataset.state;e==="initial"?this.zipDownloader.prepareZip():e==="ready"&&this.zipDownloader.downloadZip();}catch(e){this.logger.error("ZIPボタンクリック処理中にエラーが発生しました",e);}});}setupGridInteractions(){this.uiBuilder.getGridContainer().addEventListener("click",t=>{try{const r=t.target;if(!(r instanceof Element))return;const a=r.closest(".ic.grid-image");if(!a)return;const i=a.src,s=a.dataset.originalUrl??i;this.showFullScreenImage(i,s);}catch(r){this.logger.error("画像クリック処理中にエラーが発生しました",r);}});}showFullScreenImage(e,t){const{root:r,dispose:a}=se({id:"fullscreen-shadow-host",mode:"closed"}),i=document.createElement("style");i.textContent=`
      .ic.full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ic.full-screen-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }

      .ic.download-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.download-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10003;
        transition: color 0.3s ease;
      }

      .ic.full-screen-close-button:hover {
        color: #ff4444;
      }

      .ic.original-link-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.original-link-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.file-name-display {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 1.2rem;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 10003;
      }
    `,r.appendChild(i);const s=document.createElement("div");s.classList.add("ic","full-screen-container");const l=document.createElement("img");l.src=e,l.classList.add("ic","full-screen-image"),s.appendChild(l);const g=document.createElement("button");g.classList.add("ic","download-button"),g.textContent=f("download"),g.addEventListener("click",()=>{try{this.downloadImage(e);}catch(h){this.logger.error("フルスクリーンダウンロード中にエラーが発生しました",h,{imageUrl:e});}}),s.appendChild(g);const d=document.createElement("button");d.classList.add("ic","original-link-button"),d.textContent=f("fullscreenOriginal"),d.addEventListener("click",()=>{window.open(t,"_blank");}),s.appendChild(d);const n=document.createElement("div");n.classList.add("ic","file-name-display"),n.textContent=t.split("/").pop()??t,s.appendChild(n);const c=document.createElement("button");c.classList.add("ic","full-screen-close-button"),c.textContent="×",c.addEventListener("click",()=>{try{a();}catch(h){this.logger.error("フルスクリーンモーダルの閉じる処理でエラーが発生しました",h);}}),s.appendChild(c),s.addEventListener("click",h=>{if(h.target===s)try{a();}catch(p){this.logger.error("フルスクリーンモーダルの削除中にエラーが発生しました",p);}}),r.appendChild(s);}async downloadImage(e){try{const r=(await oe({url:e,responseType:"blob"})).response;if(!r){this.logger.error("ダウンロードしたBlobが空です",void 0,{imageUrl:e});return}const a=document.createElement("a");a.href=URL.createObjectURL(r),a.download=e.split("/").pop()??"image",document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(a.href),this.logger.debug("画像のダウンロードが完了しました",{imageUrl:e});}catch(t){this.logger.error("ダウンロード要求の作成中にエラーが発生しました",t,{imageUrl:e});}}}async function Ot(){const o=new st(Re);it(t=>t==="warn"||t==="error"?true:o.isDebugEnabled());const e=x("ImageCollector2:Bootstrap");e.info("legacy collector bootstrap start"),Gt(o,e);}function Gt(o,e){try{const t=new He(x("ImageCollector2:BadImageHandler")),r=new rt(o,t,x("ImageCollector2:UIBuilder"));r.buildModal(),requestAnimationFrame(()=>{try{const a=new Je(x("ImageCollector2:ProgressBar")),i=new et(x("ImageCollector2:Toast")),s=new tt(r,t,x("ImageCollector2:UIBatchUpdater")),l=new Ke(r,t,i,a,x("ImageCollector2:ZipDownloader"),o),g=new at(r,l,x("ImageCollector2:UIEventHandler"));g.initialize();const d=new Ve(s,t,a,i,x("ImageCollector2:ImageCollectorMain"));new Xe(r,d,x("ImageCollector2:MenuRegister")).register(),gt(o,x("ImageCollector2:ConfigCommands"),r),Vt({config:o,uiBuilder:r,uiBatchUpdater:s,uiEventHandler:g,imageCollectorMain:d,badImageHandler:t,toast:i,progressBar:a,zipDownloader:l}),e.info("legacy collector components initialized");}catch(a){e.error("遅延初期化中にエラーが発生しました",a);}});}catch(t){e.error("コンポーネント初期化中にエラーが発生しました",t);}}function Vt(o){Ue().ImageCollector2={MenuRegister:Xe,UIBuilder:rt,UIBatchUpdater:tt,UIEventHandler:at,ImageCollectorMain:Ve,BadImageHandler:He,ImageSourceClassifier:Oe,Toast:et,ProgressBar:Je,RequestBatchLimiter:Ge,ImageHostManager:Ae,ZipDownloader:Ke,...o,config:o.config};}class Nt{constructor(e={}){this.options=e,this.log=x("ImageCollectorApp");}log;start(){this.log.info("starting legacy collector"),Ot();}}const pe=x("ImageCollector2");async function $t(){pe.info("bootstrap start");try{new Nt().start(),pe.info("legacy bootstrap completed");}catch(o){pe.error("bootstrap failed",o);}}$t();

})();