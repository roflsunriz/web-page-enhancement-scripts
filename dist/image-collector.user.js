// ==UserScript==
// @name         image-collector
// @namespace    imageCollector
// @version      5.4.1
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

(function(){"use strict";var e={debug:`debug`,info:`info`,warn:`warn`,error:`error`},t={debug:10,info:20,warn:30,error:40},n=e=>t[e]>=t.warn,r=e=>{n=e},i=t=>{let r=`[${t}]`,i={};return Object.keys(e).forEach(a=>{let o=e[a];i[a]=(...e)=>{n(a,t)&&(console[o]??console.log)(r,...e)}}),i},a={debugMode:!1,showZipButton:!0,singleImageTest:!1},o=class{state;constructor(e){this.state={...a,...e}}get snapshot(){return{...this.state}}get debugMode(){return this.state.debugMode}get showZipButton(){return this.state.showZipButton}get singleImageTest(){return this.state.singleImageTest}isDebugEnabled(){return this.state.debugMode===!0}setDebugMode(e){return this.state.debugMode=!!e,this.state.debugMode}setShowZipButton(e){return this.state.showZipButton=!!e,this.state.showZipButton}setSingleImageTest(e){return this.state.singleImageTest=!!e,this.state.singleImageTest}update(e){this.state={...this.state,...e}}},s=typeof GM_registerMenuCommand<`u`?GM_registerMenuCommand:void 0,c=typeof GM_xmlhttpRequest<`u`?GM_xmlhttpRequest:void 0;function l(){return typeof unsafeWindow<`u`?unsafeWindow:window}function u(e,t){s(e,t)}function d(e,t,n){let r=l();r.setImageCollectorDebug=n=>{let r=e.setDebugMode(n);return t.info(`デバッグモード: ${r?`オン`:`オフ`}`),r},r.setImageCollectorZipButton=r=>{let i=e.setShowZipButton(r);return t.info(`ZIPボタン: ${i?`表示`:`非表示`}`),n.setZipButtonVisibility(i),i},r.setSingleImageTest=n=>{let r=e.setSingleImageTest(n);return t.info(`単一画像テストモード: ${r?`オン`:`オフ`}`),r}}var f=e=>new Promise((t,n)=>{c({url:e.url,method:e.method??`GET`,headers:e.headers,data:e.data,responseType:e.responseType??`text`,timeout:e.timeout,onprogress:e.onprogress,onload:e=>{t({status:e.status,statusText:e.statusText,response:e.response,finalUrl:e.finalUrl,headers:e.responseHeaders})},onerror:e=>{let t=e?.error??`unknown error`;n(Error(`GM_xmlhttpRequest failed: ${t}`))},ontimeout:()=>{n(Error(`GM_xmlhttpRequest timeout`))}})}),p=[`ja`,`en`,`zh-Hans`,`hi`,`es`,`fr`,`ar`,`pt`,`bn`,`ru`,`ur`],m=new Set([`ar`,`ur`]);function h(e){return m.has(e)?`rtl`:`ltr`}function g(e,t,n){let r=e[n],i={},a=e;for(let e of t)i[e]={...r,...a[e]??{}};return i}function _(e,t){return g(e,p,t)}function v(e,t){return e.replace(/\{([a-zA-Z0-9_]+)\}/g,(e,n)=>{let r=t[n];return r===void 0?e:String(r)})}function y(e){let t=Object.keys(e.translations),n=e.defaultLocale,r=n=>{let r=n.toLowerCase(),i=e.aliases?.[r];if(i)return i;let a=t.find(e=>e.toLowerCase()===r);if(a)return a;let o=r.split(`-`)[0];return t.find(e=>e.toLowerCase().split(`-`)[0]===o)??null},i=()=>{let t=navigator.languages.length>0?navigator.languages:[navigator.language];for(let e of t){let t=r(e);if(t)return t}return e.fallbackLocale},a=t=>e.translations[n]?.[t]||e.translations[e.fallbackLocale]?.[t]||(e.translations[e.defaultLocale]?.[t]??t);return{locales:t,getLocale:()=>n,setLocale:e=>{n=e},detectBrowserLocale:i,t:a,format:(e,t)=>v(a(e),t),getTranslations:(t=n)=>e.translations[t]??e.translations[e.fallbackLocale],getDirection:(e=n)=>h(e),getMissingTranslationKeys:t=>{let n=e.translations[e.fallbackLocale],r=e.translations[t];return Object.keys(n).filter(e=>!r[e])}}}var b=y({translations:_({ja:{collectComplete:`{total}枚の画像を収集しました！(高速:{fast}, 通常:{normal})`,collectStart:`画像収集を開始します...`,collectUnexpectedError:`画像収集中に予期しないエラーが発生しました`,classifiedImages:`画像を分類しました: 高速={fast}, 通常={normal}`,download:`ダウンロード`,externalImagesValidating:`外部画像を検証中...`,failedImagesInZip:`{count}枚の画像をZIPに含められませんでした`,fullscreenOriginal:`元ページを開く`,imageLoadFailed:`画像の読み込みに失敗しました`,imageReady:`{processed}/{total} 画像が準備されました`,loadImage:`画像を読み込む`,menuLaunch:`🚀起動`,noDownloadableImages:`ダウンロードできる画像がありません`,noImagesFound:`処理対象の画像が見つかりませんでした`,noImagesForZip:`ZIPに追加できる画像がありませんでした`,progress:`進捗: {percent}%`,reliableImagesProcessing:`信頼できる画像を高速処理中...`,retry:`再試行`,size:`サイズ: {width}x{height} ({size})`,testModeOneImage:`テストモード: 1枚だけZIPに追加します`,zipDownloadStarted:`ZIPファイルのダウンロードが開始されました`,zipEmpty:`ZIPファイルに画像が含まれていません`,zipGenerateFailed:`ZIPファイルの生成に失敗しました`,zipGenerating:`ZIPファイルを生成しています...`,zipLibraryUnavailable:`ZIPライブラリが読み込まれていないため、ダウンロードできません`,zipManyImagesSplit:`画像が多いため、{count}個のZIPファイルに分割します`,zipNoPrepared:`ZIPファイルが準備されていません。再度準備します...`,zipPartStarted:`パート{part}/{total}のダウンロードが開始されました。次のパートを準備中...`,zipPrepareComplete:`ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください`,zipPrepareFailed:`ZIPファイルの準備に失敗しました`,zipPrepareStart:`ZIPファイルの準備を開始します...`,zipProcessing:`現在処理中です。しばらくお待ちください...`,zipReadyCount:`{processed}/{total} 画像が準備されました`,zipSplitStarted:`全{count}個のZIPファイルのダウンロードを開始しました`,zipTestMode:`テストモード: 単一画像のみでZIPを生成します`},en:{collectComplete:`Collected {total} image(s)! (fast: {fast}, normal: {normal})`,collectStart:`Starting image collection...`,collectUnexpectedError:`An unexpected error occurred while collecting images`,classifiedImages:`Classified images: fast={fast}, normal={normal}`,download:`Download`,externalImagesValidating:`Validating external images...`,failedImagesInZip:`{count} image(s) could not be included in the ZIP`,fullscreenOriginal:`Open source page`,imageLoadFailed:`Failed to load the image`,imageReady:`{processed}/{total} image(s) are ready`,loadImage:`Load image`,menuLaunch:`🚀 Launch`,noDownloadableImages:`There are no downloadable images`,noImagesFound:`No target images were found`,noImagesForZip:`No images could be added to the ZIP`,progress:`Progress: {percent}%`,reliableImagesProcessing:`Fast-processing trusted images...`,retry:`Retry`,size:`Size: {width}x{height} ({size})`,testModeOneImage:`Test mode: adding only one image to the ZIP`,zipDownloadStarted:`ZIP download has started`,zipEmpty:`The ZIP file contains no images`,zipGenerateFailed:`Failed to generate the ZIP file`,zipGenerating:`Generating ZIP file...`,zipLibraryUnavailable:`The ZIP library is not loaded, so the download cannot continue`,zipManyImagesSplit:`Too many images; splitting into {count} ZIP files`,zipNoPrepared:`The ZIP file is not prepared. Preparing it again...`,zipPartStarted:`Part {part}/{total} download has started. Preparing the next part...`,zipPrepareComplete:`ZIP preparation is complete. Click the button to download.`,zipPrepareFailed:`Failed to prepare the ZIP file`,zipPrepareStart:`Starting ZIP preparation...`,zipProcessing:`Processing now. Please wait...`,zipReadyCount:`{processed}/{total} image(s) are ready`,zipSplitStarted:`Started downloading all {count} ZIP files`,zipTestMode:`Test mode: generating a ZIP with only one image`},"zh-Hans":{collectComplete:`已收集 {total} 张图片！（快速：{fast}，普通：{normal}）`,collectStart:`开始收集图片...`,collectUnexpectedError:`收集图片时发生意外错误`,classifiedImages:`图片已分类：快速={fast}，普通={normal}`,download:`下载`,externalImagesValidating:`正在验证外部图片...`,failedImagesInZip:`{count} 张图片无法加入 ZIP`,fullscreenOriginal:`打开来源页面`,imageLoadFailed:`图片加载失败`,imageReady:`{processed}/{total} 张图片已准备好`,loadImage:`加载图片`,menuLaunch:`🚀 启动`,noDownloadableImages:`没有可下载的图片`,noImagesFound:`未找到处理目标图片`,noImagesForZip:`没有可加入 ZIP 的图片`,progress:`进度：{percent}%`,reliableImagesProcessing:`正在快速处理可信图片...`,retry:`重试`,size:`尺寸：{width}x{height} ({size})`,testModeOneImage:`测试模式：仅向 ZIP 添加一张图片`,zipDownloadStarted:`ZIP 文件下载已开始`,zipEmpty:`ZIP 文件中没有图片`,zipGenerateFailed:`ZIP 文件生成失败`,zipGenerating:`正在生成 ZIP 文件...`,zipLibraryUnavailable:`ZIP 库未加载，无法继续下载`,zipManyImagesSplit:`图片过多，将拆分为 {count} 个 ZIP 文件`,zipNoPrepared:`ZIP 文件尚未准备好。正在重新准备...`,zipPartStarted:`第 {part}/{total} 部分下载已开始。正在准备下一部分...`,zipPrepareComplete:`ZIP 文件准备完成。点击按钮下载。`,zipPrepareFailed:`ZIP 文件准备失败`,zipPrepareStart:`开始准备 ZIP 文件...`,zipProcessing:`正在处理。请稍候...`,zipReadyCount:`{processed}/{total} 张图片已准备好`,zipSplitStarted:`已开始下载全部 {count} 个 ZIP 文件`,zipTestMode:`测试模式：仅用一张图片生成 ZIP`},hi:{collectComplete:`{total} छवियां एकत्र की गईं! (तेज: {fast}, सामान्य: {normal})`,collectStart:`छवि संग्रह शुरू किया जा रहा है...`,collectUnexpectedError:`छवियां एकत्र करते समय अनपेक्षित त्रुटि हुई`,classifiedImages:`छवियां वर्गीकृत: तेज={fast}, सामान्य={normal}`,download:`डाउनलोड`,externalImagesValidating:`बाहरी छवियों की जांच हो रही है...`,failedImagesInZip:`{count} छवियां ZIP में शामिल नहीं की जा सकीं`,fullscreenOriginal:`स्रोत पेज खोलें`,imageLoadFailed:`छवि लोड करने में विफल`,imageReady:`{processed}/{total} छवियां तैयार हैं`,loadImage:`छवि लोड करें`,menuLaunch:`🚀 शुरू करें`,noDownloadableImages:`डाउनलोड योग्य छवियां नहीं हैं`,noImagesFound:`लक्षित छवियां नहीं मिलीं`,noImagesForZip:`ZIP में जोड़ने योग्य छवियां नहीं मिलीं`,progress:`प्रगति: {percent}%`,reliableImagesProcessing:`विश्वसनीय छवियों को तेज़ी से संसाधित किया जा रहा है...`,retry:`फिर कोशिश करें`,size:`आकार: {width}x{height} ({size})`,testModeOneImage:`टेस्ट मोड: ZIP में केवल एक छवि जोड़ी जाएगी`,zipDownloadStarted:`ZIP डाउनलोड शुरू हो गया है`,zipEmpty:`ZIP फ़ाइल में कोई छवि नहीं है`,zipGenerateFailed:`ZIP फ़ाइल बनाने में विफल`,zipGenerating:`ZIP फ़ाइल बनाई जा रही है...`,zipLibraryUnavailable:`ZIP लाइब्रेरी लोड नहीं है, इसलिए डाउनलोड जारी नहीं रह सकता`,zipManyImagesSplit:`छवियां बहुत अधिक हैं; {count} ZIP फ़ाइलों में बांटा जाएगा`,zipNoPrepared:`ZIP फ़ाइल तैयार नहीं है। फिर से तैयार किया जा रहा है...`,zipPartStarted:`भाग {part}/{total} का डाउनलोड शुरू हुआ। अगला भाग तैयार हो रहा है...`,zipPrepareComplete:`ZIP तैयारी पूरी हुई। डाउनलोड करने के लिए बटन क्लिक करें।`,zipPrepareFailed:`ZIP फ़ाइल तैयार करने में विफल`,zipPrepareStart:`ZIP तैयारी शुरू हो रही है...`,zipProcessing:`अभी संसाधित हो रहा है। कृपया प्रतीक्षा करें...`,zipReadyCount:`{processed}/{total} छवियां तैयार हैं`,zipSplitStarted:`सभी {count} ZIP फ़ाइलों का डाउनलोड शुरू हुआ`,zipTestMode:`टेस्ट मोड: केवल एक छवि से ZIP बनाया जाएगा`},es:{collectComplete:`Se recopilaron {total} imagen(es). (rápidas: {fast}, normales: {normal})`,collectStart:`Iniciando recopilación de imágenes...`,collectUnexpectedError:`Ocurrió un error inesperado al recopilar imágenes`,classifiedImages:`Imágenes clasificadas: rápidas={fast}, normales={normal}`,download:`Descargar`,externalImagesValidating:`Validando imágenes externas...`,failedImagesInZip:`{count} imagen(es) no pudieron incluirse en el ZIP`,fullscreenOriginal:`Abrir página de origen`,imageLoadFailed:`No se pudo cargar la imagen`,imageReady:`{processed}/{total} imagen(es) listas`,loadImage:`Cargar imagen`,menuLaunch:`🚀 Iniciar`,noDownloadableImages:`No hay imágenes descargables`,noImagesFound:`No se encontraron imágenes objetivo`,noImagesForZip:`No hay imágenes para agregar al ZIP`,progress:`Progreso: {percent}%`,reliableImagesProcessing:`Procesando rápidamente imágenes confiables...`,retry:`Reintentar`,size:`Tamaño: {width}x{height} ({size})`,testModeOneImage:`Modo de prueba: se agregará solo una imagen al ZIP`,zipDownloadStarted:`La descarga del ZIP ha comenzado`,zipEmpty:`El archivo ZIP no contiene imágenes`,zipGenerateFailed:`No se pudo generar el archivo ZIP`,zipGenerating:`Generando archivo ZIP...`,zipLibraryUnavailable:`La biblioteca ZIP no está cargada, por lo que la descarga no puede continuar`,zipManyImagesSplit:`Hay demasiadas imágenes; se dividirán en {count} archivos ZIP`,zipNoPrepared:`El archivo ZIP no está preparado. Preparándolo de nuevo...`,zipPartStarted:`La descarga de la parte {part}/{total} comenzó. Preparando la siguiente parte...`,zipPrepareComplete:`La preparación del ZIP se completó. Haz clic en el botón para descargar.`,zipPrepareFailed:`No se pudo preparar el archivo ZIP`,zipPrepareStart:`Iniciando preparación del ZIP...`,zipProcessing:`Procesando ahora. Espera un momento...`,zipReadyCount:`{processed}/{total} imagen(es) listas`,zipSplitStarted:`Se inició la descarga de los {count} archivos ZIP`,zipTestMode:`Modo de prueba: se generará un ZIP con una sola imagen`},fr:{collectComplete:`{total} image(s) collectée(s) ! (rapides : {fast}, normales : {normal})`,collectStart:`Démarrage de la collecte d'images...`,collectUnexpectedError:`Une erreur inattendue s'est produite pendant la collecte des images`,classifiedImages:`Images classées : rapides={fast}, normales={normal}`,download:`Télécharger`,externalImagesValidating:`Validation des images externes...`,failedImagesInZip:`{count} image(s) n'ont pas pu être incluses dans le ZIP`,fullscreenOriginal:`Ouvrir la page source`,imageLoadFailed:`Échec du chargement de l'image`,imageReady:`{processed}/{total} image(s) prêtes`,loadImage:`Charger l'image`,menuLaunch:`🚀 Lancer`,noDownloadableImages:`Aucune image téléchargeable`,noImagesFound:`Aucune image cible trouvée`,noImagesForZip:`Aucune image ne peut être ajoutée au ZIP`,progress:`Progression : {percent}%`,reliableImagesProcessing:`Traitement rapide des images fiables en cours...`,retry:`Réessayer`,size:`Taille : {width}x{height} ({size})`,testModeOneImage:`Mode test : une seule image sera ajoutée au ZIP`,zipDownloadStarted:`Le téléchargement du ZIP a commencé`,zipEmpty:`Le fichier ZIP ne contient aucune image`,zipGenerateFailed:`Échec de la génération du fichier ZIP`,zipGenerating:`Génération du fichier ZIP...`,zipLibraryUnavailable:`La bibliothèque ZIP n'est pas chargée, le téléchargement ne peut pas continuer`,zipManyImagesSplit:`Trop d'images ; division en {count} fichiers ZIP`,zipNoPrepared:`Le fichier ZIP n'est pas prêt. Nouvelle préparation...`,zipPartStarted:`Le téléchargement de la partie {part}/{total} a commencé. Préparation de la suivante...`,zipPrepareComplete:`La préparation du ZIP est terminée. Cliquez sur le bouton pour télécharger.`,zipPrepareFailed:`Échec de la préparation du fichier ZIP`,zipPrepareStart:`Démarrage de la préparation du ZIP...`,zipProcessing:`Traitement en cours. Veuillez patienter...`,zipReadyCount:`{processed}/{total} image(s) prêtes`,zipSplitStarted:`Téléchargement des {count} fichiers ZIP lancé`,zipTestMode:`Mode test : génération d'un ZIP avec une seule image`},ar:{collectComplete:`تم جمع {total} صورة! (سريع: {fast}، عادي: {normal})`,collectStart:`بدء جمع الصور...`,collectUnexpectedError:`حدث خطأ غير متوقع أثناء جمع الصور`,classifiedImages:`تم تصنيف الصور: سريع={fast}، عادي={normal}`,download:`تنزيل`,externalImagesValidating:`جار التحقق من الصور الخارجية...`,failedImagesInZip:`تعذر تضمين {count} صورة في ملف ZIP`,fullscreenOriginal:`فتح صفحة المصدر`,imageLoadFailed:`فشل تحميل الصورة`,imageReady:`{processed}/{total} صورة جاهزة`,loadImage:`تحميل الصورة`,menuLaunch:`🚀 تشغيل`,noDownloadableImages:`لا توجد صور قابلة للتنزيل`,noImagesFound:`لم يتم العثور على صور مستهدفة`,noImagesForZip:`لا توجد صور يمكن إضافتها إلى ZIP`,progress:`التقدم: {percent}%`,reliableImagesProcessing:`جار المعالجة السريعة للصور الموثوقة...`,retry:`إعادة المحاولة`,size:`الحجم: {width}x{height} ({size})`,testModeOneImage:`وضع الاختبار: إضافة صورة واحدة فقط إلى ZIP`,zipDownloadStarted:`بدأ تنزيل ملف ZIP`,zipEmpty:`ملف ZIP لا يحتوي على صور`,zipGenerateFailed:`فشل إنشاء ملف ZIP`,zipGenerating:`جار إنشاء ملف ZIP...`,zipLibraryUnavailable:`لم يتم تحميل مكتبة ZIP، لذلك لا يمكن متابعة التنزيل`,zipManyImagesSplit:`عدد الصور كبير؛ سيتم التقسيم إلى {count} ملفات ZIP`,zipNoPrepared:`ملف ZIP غير جاهز. جار تجهيزه مرة أخرى...`,zipPartStarted:`بدأ تنزيل الجزء {part}/{total}. جار تجهيز الجزء التالي...`,zipPrepareComplete:`اكتمل تجهيز ZIP. انقر الزر للتنزيل.`,zipPrepareFailed:`فشل تجهيز ملف ZIP`,zipPrepareStart:`بدء تجهيز ملف ZIP...`,zipProcessing:`جار المعالجة الآن. يرجى الانتظار...`,zipReadyCount:`{processed}/{total} صورة جاهزة`,zipSplitStarted:`بدأ تنزيل جميع ملفات ZIP وعددها {count}`,zipTestMode:`وضع الاختبار: إنشاء ZIP بصورة واحدة فقط`},pt:{collectComplete:`{total} imagem(ns) coletada(s)! (rápidas: {fast}, normais: {normal})`,collectStart:`Iniciando coleta de imagens...`,collectUnexpectedError:`Ocorreu um erro inesperado ao coletar imagens`,classifiedImages:`Imagens classificadas: rápidas={fast}, normais={normal}`,download:`Baixar`,externalImagesValidating:`Validando imagens externas...`,failedImagesInZip:`{count} imagem(ns) não puderam ser incluídas no ZIP`,fullscreenOriginal:`Abrir página de origem`,imageLoadFailed:`Falha ao carregar a imagem`,imageReady:`{processed}/{total} imagem(ns) prontas`,loadImage:`Carregar imagem`,menuLaunch:`🚀 Iniciar`,noDownloadableImages:`Não há imagens para baixar`,noImagesFound:`Nenhuma imagem alvo foi encontrada`,noImagesForZip:`Nenhuma imagem pôde ser adicionada ao ZIP`,progress:`Progresso: {percent}%`,reliableImagesProcessing:`Processando rapidamente imagens confiáveis...`,retry:`Tentar novamente`,size:`Tamanho: {width}x{height} ({size})`,testModeOneImage:`Modo de teste: adicionando apenas uma imagem ao ZIP`,zipDownloadStarted:`O download do ZIP começou`,zipEmpty:`O arquivo ZIP não contém imagens`,zipGenerateFailed:`Falha ao gerar o arquivo ZIP`,zipGenerating:`Gerando arquivo ZIP...`,zipLibraryUnavailable:`A biblioteca ZIP não foi carregada, então o download não pode continuar`,zipManyImagesSplit:`Há muitas imagens; dividindo em {count} arquivos ZIP`,zipNoPrepared:`O arquivo ZIP não está preparado. Preparando novamente...`,zipPartStarted:`O download da parte {part}/{total} começou. Preparando a próxima parte...`,zipPrepareComplete:`A preparação do ZIP foi concluída. Clique no botão para baixar.`,zipPrepareFailed:`Falha ao preparar o arquivo ZIP`,zipPrepareStart:`Iniciando preparação do ZIP...`,zipProcessing:`Processando agora. Aguarde...`,zipReadyCount:`{processed}/{total} imagem(ns) prontas`,zipSplitStarted:`Download de todos os {count} arquivos ZIP iniciado`,zipTestMode:`Modo de teste: gerando um ZIP com apenas uma imagem`},bn:{collectComplete:`{total}টি ছবি সংগ্রহ করা হয়েছে! (দ্রুত: {fast}, সাধারণ: {normal})`,collectStart:`ছবি সংগ্রহ শুরু হচ্ছে...`,collectUnexpectedError:`ছবি সংগ্রহের সময় অপ্রত্যাশিত ত্রুটি ঘটেছে`,classifiedImages:`ছবি শ্রেণিবদ্ধ হয়েছে: দ্রুত={fast}, সাধারণ={normal}`,download:`ডাউনলোড`,externalImagesValidating:`বাহ্যিক ছবি যাচাই করা হচ্ছে...`,failedImagesInZip:`{count}টি ছবি ZIP-এ রাখা যায়নি`,fullscreenOriginal:`উৎস পেজ খুলুন`,imageLoadFailed:`ছবি লোড করতে ব্যর্থ`,imageReady:`{processed}/{total}টি ছবি প্রস্তুত`,loadImage:`ছবি লোড করুন`,menuLaunch:`🚀 চালু করুন`,noDownloadableImages:`ডাউনলোডযোগ্য ছবি নেই`,noImagesFound:`লক্ষ্য ছবি পাওয়া যায়নি`,noImagesForZip:`ZIP-এ যোগ করার মতো ছবি নেই`,progress:`অগ্রগতি: {percent}%`,reliableImagesProcessing:`বিশ্বস্ত ছবি দ্রুত প্রক্রিয়া করা হচ্ছে...`,retry:`আবার চেষ্টা করুন`,size:`আকার: {width}x{height} ({size})`,testModeOneImage:`টেস্ট মোড: ZIP-এ শুধু একটি ছবি যোগ করা হবে`,zipDownloadStarted:`ZIP ডাউনলোড শুরু হয়েছে`,zipEmpty:`ZIP ফাইলে কোনো ছবি নেই`,zipGenerateFailed:`ZIP ফাইল তৈরি করতে ব্যর্থ`,zipGenerating:`ZIP ফাইল তৈরি হচ্ছে...`,zipLibraryUnavailable:`ZIP লাইব্রেরি লোড হয়নি, তাই ডাউনলোড চলতে পারবে না`,zipManyImagesSplit:`ছবি বেশি; {count}টি ZIP ফাইলে ভাগ করা হচ্ছে`,zipNoPrepared:`ZIP ফাইল প্রস্তুত নয়। আবার প্রস্তুত করা হচ্ছে...`,zipPartStarted:`পার্ট {part}/{total} ডাউনলোড শুরু হয়েছে। পরের পার্ট প্রস্তুত হচ্ছে...`,zipPrepareComplete:`ZIP প্রস্তুতি শেষ। ডাউনলোড করতে বোতামে ক্লিক করুন।`,zipPrepareFailed:`ZIP ফাইল প্রস্তুত করতে ব্যর্থ`,zipPrepareStart:`ZIP প্রস্তুতি শুরু হচ্ছে...`,zipProcessing:`এখন প্রক্রিয়াকরণ চলছে। অপেক্ষা করুন...`,zipReadyCount:`{processed}/{total}টি ছবি প্রস্তুত`,zipSplitStarted:`সব {count}টি ZIP ফাইলের ডাউনলোড শুরু হয়েছে`,zipTestMode:`টেস্ট মোড: শুধু একটি ছবি দিয়ে ZIP তৈরি হচ্ছে`},ru:{collectComplete:`Собрано {total} изображений! (быстрые: {fast}, обычные: {normal})`,collectStart:`Начинается сбор изображений...`,collectUnexpectedError:`При сборе изображений произошла непредвиденная ошибка`,classifiedImages:`Изображения классифицированы: быстрые={fast}, обычные={normal}`,download:`Скачать`,externalImagesValidating:`Проверка внешних изображений...`,failedImagesInZip:`{count} изображений не удалось включить в ZIP`,fullscreenOriginal:`Открыть исходную страницу`,imageLoadFailed:`Не удалось загрузить изображение`,imageReady:`Готово изображений: {processed}/{total}`,loadImage:`Загрузить изображение`,menuLaunch:`🚀 Запустить`,noDownloadableImages:`Нет изображений для скачивания`,noImagesFound:`Целевые изображения не найдены`,noImagesForZip:`Нет изображений для добавления в ZIP`,progress:`Прогресс: {percent}%`,reliableImagesProcessing:`Быстрая обработка надежных изображений...`,retry:`Повторить`,size:`Размер: {width}x{height} ({size})`,testModeOneImage:`Тестовый режим: в ZIP будет добавлено только одно изображение`,zipDownloadStarted:`Загрузка ZIP началась`,zipEmpty:`ZIP-файл не содержит изображений`,zipGenerateFailed:`Не удалось создать ZIP-файл`,zipGenerating:`Создание ZIP-файла...`,zipLibraryUnavailable:`Библиотека ZIP не загружена, поэтому загрузку нельзя продолжить`,zipManyImagesSplit:`Слишком много изображений; разделение на {count} ZIP-файлов`,zipNoPrepared:`ZIP-файл не подготовлен. Подготовка заново...`,zipPartStarted:`Загрузка части {part}/{total} началась. Подготовка следующей части...`,zipPrepareComplete:`Подготовка ZIP завершена. Нажмите кнопку, чтобы скачать.`,zipPrepareFailed:`Не удалось подготовить ZIP-файл`,zipPrepareStart:`Начинается подготовка ZIP...`,zipProcessing:`Идет обработка. Подождите...`,zipReadyCount:`Готово изображений: {processed}/{total}`,zipSplitStarted:`Начата загрузка всех ZIP-файлов: {count}`,zipTestMode:`Тестовый режим: создание ZIP только с одним изображением`},ur:{collectComplete:`{total} تصاویر جمع ہو گئیں! (تیز: {fast}، عام: {normal})`,collectStart:`تصاویر جمع کرنا شروع ہو رہا ہے...`,collectUnexpectedError:`تصاویر جمع کرتے وقت غیر متوقع خرابی ہوئی`,classifiedImages:`تصاویر کی درجہ بندی ہو گئی: تیز={fast}، عام={normal}`,download:`ڈاؤن لوڈ`,externalImagesValidating:`بیرونی تصاویر کی توثیق ہو رہی ہے...`,failedImagesInZip:`{count} تصاویر ZIP میں شامل نہیں ہو سکیں`,fullscreenOriginal:`ماخذ صفحہ کھولیں`,imageLoadFailed:`تصویر لوڈ کرنے میں ناکامی`,imageReady:`{processed}/{total} تصاویر تیار ہیں`,loadImage:`تصویر لوڈ کریں`,menuLaunch:`🚀 شروع کریں`,noDownloadableImages:`ڈاؤن لوڈ کے قابل تصاویر نہیں ہیں`,noImagesFound:`ہدف تصاویر نہیں ملیں`,noImagesForZip:`ZIP میں شامل کرنے کے لیے تصاویر نہیں ہیں`,progress:`پیش رفت: {percent}%`,reliableImagesProcessing:`قابل اعتماد تصاویر تیزی سے پروسیس ہو رہی ہیں...`,retry:`دوبارہ کوشش`,size:`سائز: {width}x{height} ({size})`,testModeOneImage:`ٹیسٹ موڈ: ZIP میں صرف ایک تصویر شامل کی جائے گی`,zipDownloadStarted:`ZIP ڈاؤن لوڈ شروع ہو گیا ہے`,zipEmpty:`ZIP فائل میں کوئی تصویر نہیں`,zipGenerateFailed:`ZIP فائل بنانے میں ناکامی`,zipGenerating:`ZIP فائل بن رہی ہے...`,zipLibraryUnavailable:`ZIP لائبریری لوڈ نہیں ہے، اس لیے ڈاؤن لوڈ جاری نہیں رہ سکتا`,zipManyImagesSplit:`تصاویر بہت زیادہ ہیں؛ {count} ZIP فائلوں میں تقسیم ہو رہی ہیں`,zipNoPrepared:`ZIP فائل تیار نہیں۔ دوبارہ تیار کی جا رہی ہے...`,zipPartStarted:`حصہ {part}/{total} کا ڈاؤن لوڈ شروع ہو گیا۔ اگلا حصہ تیار ہو رہا ہے...`,zipPrepareComplete:`ZIP تیاری مکمل ہے۔ ڈاؤن لوڈ کے لیے بٹن پر کلک کریں۔`,zipPrepareFailed:`ZIP فائل تیار کرنے میں ناکامی`,zipPrepareStart:`ZIP تیاری شروع ہو رہی ہے...`,zipProcessing:`ابھی پروسیسنگ جاری ہے۔ براہ کرم انتظار کریں...`,zipReadyCount:`{processed}/{total} تصاویر تیار ہیں`,zipSplitStarted:`تمام {count} ZIP فائلوں کا ڈاؤن لوڈ شروع ہو گیا`,zipTestMode:`ٹیسٹ موڈ: صرف ایک تصویر کے ساتھ ZIP بنایا جا رہا ہے`}},`en`),defaultLocale:`ja`,fallbackLocale:`en`});b.setLocale(b.detectBrowserLocale());var x=b.format,S=b.t,C=class{logger;minSize=50;maxSize=5e3;maxFileSize=5*1024*1024;deletedImageSizes=[{width:320,height:320},{width:161,height:81}];constructor(e){this.logger=e}async isValidImage(e){if(!e||!this.isImageUrl(e))return!1;try{let t=await this.getImageMetadata(e);return!t||this.isDeletedImage(t)||t.width<this.minSize||t.height<this.minSize||t.width>this.maxSize||t.height>this.maxSize?!1:t.size>this.maxFileSize?`large`:!0}catch(t){return this.logger.error(`画像のメタデータ取得中にエラーが発生しました`,t,{url:e}),!1}}isDeletedImage(e){return this.deletedImageSizes.some(t=>t.width===e.width&&t.height===e.height)}createPlaceholder(e,t){try{let n=document.createElement(`div`);n.classList.add(`ic`,`image-placeholder`);let r=document.createElement(`div`);r.classList.add(`ic`,`size-info`),r.textContent=x(`size`,{height:String(t.height),size:this.formatBytes(t.size),width:String(t.width)});let i=document.createElement(`button`);return i.classList.add(`ic`,`load-button`),i.textContent=S(`loadImage`),i.addEventListener(`click`,()=>{try{n.replaceWith(this.createImageElement(e))}catch(t){this.logger.error(`画像の読み込み中にエラーが発生しました`,t,{url:e})}}),n.append(r,i),n}catch(t){this.logger.error(`プレースホルダーの作成中にエラーが発生しました`,t,{url:e});let n=document.createElement(`div`);return n.classList.add(`ic`,`image-placeholder`),n.textContent=S(`imageLoadFailed`),n}}createErrorPlaceholder(e){try{let t=document.createElement(`div`);t.classList.add(`ic`,`image-placeholder`),t.style.backgroundColor=`rgba(220, 53, 69, 0.2)`;let n=document.createElement(`div`);n.textContent=S(`imageLoadFailed`),n.style.color=`#dc3545`;let r=document.createElement(`button`);return r.classList.add(`ic`,`load-button`),r.textContent=S(`retry`),r.addEventListener(`click`,()=>{try{t.replaceWith(this.createImageElement(e))}catch(t){this.logger.error(`画像の再読み込み中にエラーが発生しました`,t,{url:e})}}),t.append(n,r),t}catch(t){this.logger.error(`エラープレースホルダーの作成中にエラーが発生しました`,t,{url:e});let n=document.createElement(`div`);return n.textContent=S(`imageLoadFailed`),n}}createImageElement(e){let t=document.createElement(`img`);return t.src=e,t.classList.add(`ic`,`grid-image`),t}async getImageMetadata(e){return new Promise((t,n)=>{try{let r=new Image;r.crossOrigin=`anonymous`;let i=window.setTimeout(()=>{this.logger.warn(`画像サイズ取得がタイムアウトしました`,{url:e}),n(Error(`Image size detection timeout`))},8e3);r.onload=()=>{try{if(window.clearTimeout(i),r.width===0||r.height===0){this.logger.warn(`無効な画像サイズです`,{url:e,width:r.width,height:r.height}),n(Error(`Invalid image dimensions`));return}f({method:`HEAD`,url:e,timeout:5e3}).then(i=>{try{let a=i.headers??``,o=a.match(/Content-Length:\s*(\d+)/i),s=a.match(/Content-Type:\s*([^;\n]+)/i),c=o?Number.parseInt(o[1],10):0,l=s?s[1]:``;if(!l.startsWith(`image/`)){this.logger.warn(`画像ではないコンテンツタイプです`,{url:e,contentType:l}),n(Error(`Not an image`));return}t({width:r.width,height:r.height,size:Number.isFinite(c)?c:0,loaded:r.complete})}catch(t){this.logger.error(`ヘッダー解析中にエラーが発生しました`,t,{url:e}),n(t)}}).catch(t=>{this.logger.error(`画像メタデータ取得中にエラーが発生しました`,t,{url:e}),n(Error(`HEAD request failed`))})}catch(t){this.logger.error(`メタデータ取得処理でエラーが発生しました`,t,{url:e}),n(t)}},r.onerror=()=>{window.clearTimeout(i),this.logger.warn(`画像読み込みに失敗しました`,{url:e}),n(Error(`Image load error`))},r.src=e}catch(t){this.logger.error(`メタデータ取得処理の開始中にエラーが発生しました`,t,{url:e}),n(t)}})}formatBytes(e){return e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/1024/1024).toFixed(1)} MB`}isImageUrl(e){let t=[`.jpg`,`.jpeg`,`.png`,`.gif`,`.webp`,`.svg`],n=e.toLowerCase();return t.some(e=>n.endsWith(e))}},w=class{logger;hostPatterns=[/(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,/(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,/(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,/(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,/(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,/(?:https?:\/\/)?(?:www\.)?500px\.com\//i,/(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,/(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,/(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,/(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,/(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,/(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,/(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,/(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,/(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,/(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,/(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,/(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,/(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,/(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,/(?:https?:\/\/)?(?:www\.)?x\.com\//i,/(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,/(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,/(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,/(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,/(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,/(?:https?:\/\/)?(?:www\.)?vk\.com\//i];constructor(e){this.logger=e}isSupportedHost(e){let t=this.hostPatterns.some(t=>t.test(e));return this.logger.debug(`ホストサポート判定`,{url:e,supported:t}),t}addHostPattern(e){let t=e instanceof RegExp?e:new RegExp(e,`i`);this.hostPatterns.push(t),this.logger.debug(`ホストパターンを追加しました`,{pattern:t.source})}},T=class{logger;trustedDomains;constructor(e){this.logger=e,this.trustedDomains=new Set([window.location.hostname,`cdn.jsdelivr.net`,`fonts.googleapis.com`,`fonts.gstatic.com`])}classifyImageSource(e,t=null){try{let n=new URL(e,window.location.href);return n.hostname===window.location.hostname?{trustLevel:`high`,reason:`same-domain`,fastPath:!0,element:t}:this.trustedDomains.has(n.hostname)?{trustLevel:`high`,reason:`trusted-cdn`,fastPath:!0,element:t}:t&&(t.tagName===`IMG`||t.tagName===`SOURCE`)&&t instanceof HTMLImageElement&&t.complete&&t.naturalWidth>0?{trustLevel:`medium`,reason:`loaded-dom-element`,fastPath:!0,element:t}:n.protocol===`https:`?{trustLevel:`medium`,reason:`https-external`,fastPath:!1,element:t}:{trustLevel:`low`,reason:`untrusted-source`,fastPath:!1,element:t}}catch(n){return this.logger.error(`画像ソース分類中にエラーが発生しました`,n,{url:e}),{trustLevel:`low`,reason:`classification-error`,fastPath:!1,element:t}}}getMetadataFromElement(e){return e instanceof HTMLImageElement?{width:e.naturalWidth||e.width||0,height:e.naturalHeight||e.height||0,size:0,loaded:e.complete}:null}},E=class{logger;batchSize;delay;queue=[];isProcessing=!1;constructor(e,t=5,n=1e3){this.logger=e,this.batchSize=t,this.delay=n}addRequest(e){this.queue.push(e),this.isProcessing||this.processBatch()}async processBatch(){try{this.isProcessing=!0;let e=0,t=0;for(;this.queue.length>0;){let n=this.queue.splice(0,this.batchSize);e+=1;try{let r=await Promise.allSettled(n.map(e=>e())),i=r.filter(e=>e.status===`rejected`).length;t+=i,i>0&&(this.logger.warn(`バッチ処理でエラーが発生しました`,{batchNumber:e,batchErrors:i}),r.forEach((t,n)=>{if(t.status===`rejected`){let r=t.reason instanceof Error?t.reason:void 0;this.logger.error(`バッチ処理タスクでエラーが発生しました`,r,{batchNumber:e,taskIndex:n})}}))}catch(n){this.logger.error(`バッチ処理中に予期しないエラーが発生しました`,n,{batchNumber:e}),t+=1}this.queue.length>0&&await new Promise(e=>setTimeout(e,this.delay))}t>0?this.logger.warn(`バッチ処理完了`,{processedBatches:e,totalErrors:t}):this.logger.debug(`バッチ処理完了`,{processedBatches:e,totalErrors:t})}catch(e){throw this.logger.error(`バッチ処理中に致命的なエラーが発生しました`,e),e}finally{this.isProcessing=!1}}},D=class{uiBatchUpdater;badImageHandler;progressBar;toast;logger;imageHostManager;imageSourceClassifier;requestLimiter;constructor(e,t,n,r,a){this.uiBatchUpdater=e,this.badImageHandler=t,this.progressBar=n,this.toast=r,this.logger=a,this.imageHostManager=new w(i(`ImageCollector2:ImageHostManager`)),this.imageSourceClassifier=new T(i(`ImageCollector2:SourceClassifier`)),this.requestLimiter=new E(i(`ImageCollector2:RequestLimiter`))}async collectImages(){this.logger.debug(`画像収集開始`),this.toast.show(S(`collectStart`),`info`),this.progressBar.show(),this.progressBar.update(0);try{let e=new Map,t=[],n=[];this.collectFromImages(e,t,n),this.collectFromPictureSources(e,t,n),this.collectFromAnchors(e,n),this.collectFromBackgrounds(e,n),this.logger.debug(`画像分類完了`,{fastPath:t.length,slowPath:n.length}),this.toast.show(x(`classifiedImages`,{fast:String(t.length),normal:String(n.length)}),`info`),t.length>0&&(this.toast.show(S(`reliableImagesProcessing`),`info`),await this.uiBatchUpdater.addImagesFastPath(t),this.progressBar.update(30)),n.length>0&&(this.toast.show(S(`externalImagesValidating`),`info`),await this.processSlowPathImages(n));let r=t.length+n.length;if(r===0){this.logger.warn(`処理対象の画像が0件です`),this.toast.show(S(`noImagesFound`),`warning`),this.progressBar.hide();return}this.progressBar.update(100),setTimeout(()=>{this.progressBar.hide(),this.toast.show(x(`collectComplete`,{fast:String(t.length),normal:String(n.length),total:String(r)}),`success`),this.logger.debug(`画像収集完了`,{totalImages:r})},500)}catch(e){this.logger.error(`画像収集処理中に予期しないエラーが発生しました`,e),this.toast.show(S(`collectUnexpectedError`),`error`),this.progressBar.hide()}}collectFromImages(e,t,n){document.querySelectorAll(`img`).forEach(r=>{try{let i=this.resolveUrl(r.src);if(!i)return;let a=this.imageSourceClassifier.classifyImageSource(i,r);e.set(i,{element:r,classification:a}),a.fastPath?(t.push({url:i,classification:a}),this.logger.debug(`高速パス画像`,{src:i.substring(0,50),reason:a.reason})):(n.push(i),this.logger.debug(`低速パス画像`,{src:i.substring(0,50),reason:a.reason}))}catch(e){this.logger.warn(`img要素の処理中にエラーが発生しました`,{error:e,src:r.src})}})}collectFromPictureSources(e,t,n){document.querySelectorAll(`picture source`).forEach(r=>{try{r.srcset.split(`,`).map(e=>e.trim().split(` `)[0]).filter(Boolean).forEach(i=>{let a=this.resolveUrl(i);if(!a||e.has(a))return;let o=this.imageSourceClassifier.classifyImageSource(a,r);e.set(a,{element:r,classification:o}),o.fastPath?(t.push({url:a,classification:o}),this.logger.debug(`高速パス(picture)`,{src:a.substring(0,50),reason:o.reason})):(n.push(a),this.logger.debug(`低速パス(picture)`,{src:a.substring(0,50),reason:o.reason}))})}catch(e){this.logger.warn(`picture要素の処理中にエラーが発生しました`,{error:e,srcset:r.srcset})}})}collectFromAnchors(e,t){document.querySelectorAll(`a`).forEach(n=>{try{let r=this.resolveUrl(n.href);if(!r||!this.isImageUrl(r)||e.has(r))return;let i=this.imageSourceClassifier.classifyImageSource(r);e.set(r,{element:null,classification:i}),t.push(r),this.logger.debug(`低速パス(link)`,{src:r.substring(0,50),reason:i.reason})}catch(e){this.logger.warn(`a要素の処理中にエラーが発生しました`,{error:e,href:n.href})}})}collectFromBackgrounds(e,t){document.querySelectorAll(`*`).forEach(n=>{try{let r=window.getComputedStyle(n).backgroundImage;if(!r||r===`none`)return;let i=r.replace(/^url\(["']?/,``).replace(/["']?\)$/,``),a=this.resolveUrl(i);if(!a||e.has(a))return;let o=this.imageSourceClassifier.classifyImageSource(a);e.set(a,{element:null,classification:o}),t.push(a),this.logger.debug(`低速パス(bg)`,{src:a.substring(0,50),reason:o.reason})}catch(e){this.logger.warn(`背景画像の処理中にエラーが発生しました`,{error:e,tag:n.tagName})}})}async processSlowPathImages(e){let t=[];for(let n of e)try{if(this.imageHostManager.isSupportedHost(n)){let e=await this.getSnsImageUrl(n);t.push(e)}else t.push(n)}catch(e){this.logger.warn(`SNS画像URL解決中にエラーが発生しました`,{error:e,url:n}),t.push(n)}let n=(await Promise.allSettled(t.map(async e=>{try{return await this.badImageHandler.isValidImage(e)?e:null}catch(t){return this.logger.warn(`画像検証中にエラーが発生しました`,{error:t,url:e}),null}}))).filter(e=>e.status===`fulfilled`).map(e=>e.value).filter(e=>e!==null);n.length>0&&await this.uiBatchUpdater.addImages(n),this.progressBar.update(60)}resolveUrl(e){if(!e)return null;try{if(e.includes(`?http`)){let t=e.split(`?http`)[1];if(t)return new URL(`http${t}`).href}return new URL(e,window.location.href).href}catch(t){return this.logger.debug(`URL解決に失敗しました`,{url:e,error:t}),null}}isImageUrl(e){if(!e)return!1;let t=[`.jpg`,`.jpeg`,`.png`,`.gif`,`.webp`,`.svg`],n=e.toLowerCase();return t.some(e=>n.endsWith(e))}async getSnsImageUrl(e){return/(twitter\.com|x\.com)/i.test(e)?new Promise(t=>{f({url:e,responseType:`text`}).then(n=>{try{let r=new DOMParser,i=String(n.response.responseText??``),a=r.parseFromString(i,`text/html`).querySelector(`meta[property="og:image"]`);a?.getAttribute(`content`)?t(a.getAttribute(`content`)??e):t(e)}catch(n){this.logger.warn(`SNS画像の解析中にエラーが発生しました`,{error:n,url:e}),t(e)}}).catch(n=>{this.logger.warn(`SNS画像URL取得中にエラーが発生しました`,{error:n,url:e}),t(e)})}):e}},O=Uint8Array,k=Uint16Array,ee=Int32Array,te=new O([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ne=new O([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),A=new O([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),j=function(e,t){for(var n=new k(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new ee(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},M=j(te,2),N=M.b,P=M.r;N[28]=258,P[258]=28;var F=j(ne,0);F.b;for(var I=F.r,L=new k(32768),R=0;R<32768;++R){var z=(R&43690)>>1|(R&21845)<<1;z=(z&52428)>>2|(z&13107)<<2,z=(z&61680)>>4|(z&3855)<<4,L[R]=((z&65280)>>8|(z&255)<<8)>>1}for(var B=(function(e,t,n){for(var r=e.length,i=0,a=new k(t);i<r;++i)e[i]&&++a[e[i]-1];var o=new k(t);for(i=1;i<t;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(n){s=new k(1<<t);var c=15-t;for(i=0;i<r;++i)if(e[i])for(var l=i<<4|e[i],u=t-e[i],d=o[e[i]-1]++<<u,f=d|(1<<u)-1;d<=f;++d)s[L[d]>>c]=l}else for(s=new k(r),i=0;i<r;++i)e[i]&&(s[i]=L[o[e[i]-1]++]>>15-e[i]);return s}),V=new O(288),R=0;R<144;++R)V[R]=8;for(var R=144;R<256;++R)V[R]=9;for(var R=256;R<280;++R)V[R]=7;for(var R=280;R<288;++R)V[R]=8;for(var H=new O(32),R=0;R<32;++R)H[R]=5;var re=B(V,9,0),ie=B(H,5,0),U=function(e){return(e+7)/8|0},W=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new O(e.subarray(t,n))},G=[`unexpected EOF`,`invalid block type`,`invalid length/literal`,`invalid distance`,`stream finished`,`no stream handler`,,`no callback`,`invalid UTF-8 data`,`extra field too long`,`date not in range 1980-2099`,`filename too long`,`stream finishing`,`invalid zip data`],K=function(e,t,n){var r=Error(t||G[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,K),!n)throw r;return r},q=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8},J=function(e,t,n){n<<=t&7;var r=t/8|0;e[r]|=n,e[r+1]|=n>>8,e[r+2]|=n>>16},Y=function(e,t){for(var n=[],r=0;r<e.length;++r)e[r]&&n.push({s:r,f:e[r]});var i=n.length,a=n.slice();if(!i)return{t:le,l:0};if(i==1){var o=new O(n[0].s+1);return o[n[0].s]=1,{t:o,l:1}}n.sort(function(e,t){return e.f-t.f}),n.push({s:-1,f:25001});var s=n[0],c=n[1],l=0,u=1,d=2;for(n[0]={s:-1,f:s.f+c.f,l:s,r:c};u!=i-1;)s=n[n[l].f<n[d].f?l++:d++],c=n[l!=u&&n[l].f<n[d].f?l++:d++],n[u++]={s:-1,f:s.f+c.f,l:s,r:c};for(var f=a[0].s,r=1;r<i;++r)a[r].s>f&&(f=a[r].s);var p=new k(f+1),m=X(n[u-1],p,0);if(m>t){var r=0,h=0,g=m-t,_=1<<g;for(a.sort(function(e,t){return p[t.s]-p[e.s]||e.f-t.f});r<i;++r){var v=a[r].s;if(p[v]>t)h+=_-(1<<m-p[v]),p[v]=t;else break}for(h>>=g;h>0;){var y=a[r].s;p[y]<t?h-=1<<t-p[y]++-1:++r}for(;r>=0&&h;--r){var b=a[r].s;p[b]==t&&(--p[b],++h)}m=t}return{t:new O(p),l:m}},X=function(e,t,n){return e.s==-1?Math.max(X(e.l,t,n+1),X(e.r,t,n+1)):t[e.s]=n},ae=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new k(++t),r=0,i=e[0],a=1,o=function(e){n[r++]=e},s=1;s<=t;++s)if(e[s]==i&&s!=t)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=e[s]}return{c:n.subarray(0,r),n:t}},Z=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},oe=function(e,t,n){var r=n.length,i=U(t+2);e[i]=r&255,e[i+1]=r>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var a=0;a<r;++a)e[i+a+4]=n[a];return(i+4+r)*8},se=function(e,t,n,r,i,a,o,s,c,l,u){q(t,u++,n),++i[256];for(var d=Y(i,15),f=d.t,p=d.l,m=Y(a,15),h=m.t,g=m.l,_=ae(f),v=_.c,y=_.n,b=ae(h),x=b.c,S=b.n,C=new k(19),w=0;w<v.length;++w)++C[v[w]&31];for(var w=0;w<x.length;++w)++C[x[w]&31];for(var T=Y(C,7),E=T.t,D=T.l,O=19;O>4&&!E[A[O-1]];--O);var ee=l+5<<3,j=Z(i,V)+Z(a,H)+o,M=Z(i,f)+Z(a,h)+o+14+3*O+Z(C,E)+2*C[16]+3*C[17]+7*C[18];if(c>=0&&ee<=j&&ee<=M)return oe(t,u,e.subarray(c,c+l));var N,P,F,I;if(q(t,u,1+(M<j)),u+=2,M<j){N=B(f,p,0),P=f,F=B(h,g,0),I=h;var L=B(E,D,0);q(t,u,y-257),q(t,u+5,S-1),q(t,u+10,O-4),u+=14;for(var w=0;w<O;++w)q(t,u+3*w,E[A[w]]);u+=3*O;for(var R=[v,x],z=0;z<2;++z)for(var U=R[z],w=0;w<U.length;++w){var W=U[w]&31;q(t,u,L[W]),u+=E[W],W>15&&(q(t,u,U[w]>>5&127),u+=U[w]>>12)}}else N=re,P=V,F=ie,I=H;for(var w=0;w<s;++w){var G=r[w];if(G>255){var W=G>>18&31;J(t,u,N[W+257]),u+=P[W+257],W>7&&(q(t,u,G>>23&31),u+=te[W]);var K=G&31;J(t,u,F[K]),u+=I[K],K>3&&(J(t,u,G>>5&8191),u+=ne[K])}else J(t,u,N[G]),u+=P[G]}return J(t,u,N[256]),u+P[256]},ce=new ee([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),le=new O(0),ue=function(e,t,n,r,i,a){var o=a.z||e.length,s=new O(r+o+5*(1+Math.ceil(o/7e3))+i),c=s.subarray(r,s.length-i),l=a.l,u=(a.r||0)&7;if(t){u&&(c[0]=a.r>>3);for(var d=ce[t-1],f=d>>13,p=d&8191,m=(1<<n)-1,h=a.p||new k(32768),g=a.h||new k(m+1),_=Math.ceil(n/3),v=2*_,y=function(t){return(e[t]^e[t+1]<<_^e[t+2]<<v)&m},b=new ee(25e3),x=new k(288),S=new k(32),C=0,w=0,T=a.i||0,E=0,D=a.w||0,A=0;T+2<o;++T){var j=y(T),M=T&32767,N=g[j];if(h[M]=N,g[j]=M,D<=T){var F=o-T;if((C>7e3||E>24576)&&(F>423||!l)){u=se(e,c,0,b,x,S,w,E,A,T-A,u),E=C=w=0,A=T;for(var L=0;L<286;++L)x[L]=0;for(var L=0;L<30;++L)S[L]=0}var R=2,z=0,B=p,V=M-N&32767;if(F>2&&j==y(T-V))for(var H=Math.min(f,F)-1,re=Math.min(32767,T),ie=Math.min(258,F);V<=re&&--B&&M!=N;){if(e[T+R]==e[T+R-V]){for(var G=0;G<ie&&e[T+G]==e[T+G-V];++G);if(G>R){if(R=G,z=V,G>H)break;for(var K=Math.min(V,G-2),q=0,L=0;L<K;++L){var J=T-V+L&32767,Y=J-h[J]&32767;Y>q&&(q=Y,N=J)}}}M=N,N=h[M],V+=M-N&32767}if(z){b[E++]=268435456|P[R]<<18|I[z];var X=P[R]&31,ae=I[z]&31;w+=te[X]+ne[ae],++x[257+X],++S[ae],D=T+R,++C}else b[E++]=e[T],++x[e[T]]}}for(T=Math.max(T,D);T<o;++T)b[E++]=e[T],++x[e[T]];u=se(e,c,l,b,x,S,w,E,A,T-A,u),l||(a.r=u&7|c[u/8|0]<<3,u-=7,a.h=g,a.p=h,a.i=T,a.w=D)}else{for(var T=a.w||0;T<o+l;T+=65535){var Z=T+65535;Z>=o&&(c[u/8|0]=l,Z=o),u=oe(c,u+1,e.subarray(T,Z))}a.i=o}return W(s,0,r+U(u)+i)},de=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(n&1&&-306674912)^n>>>1;e[t]=n}return e})(),fe=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=de[n&255^t[r]]^n>>>8;e=n},d:function(){return~e}}},pe=function(e,t,n,r,i){if(!i&&(i={l:1},t.dictionary)){var a=t.dictionary.subarray(-32768),o=new O(a.length+e.length);o.set(a),o.set(e,a.length),e=o,i.w=a.length}return ue(e,t.level==null?6:t.level,t.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,n,r,i)},me=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},Q=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function he(e,t){return pe(e,t||{},0,0)}var ge=function(e,t,n,r){for(var i in e){var a=e[i],o=t+i,s=r;Array.isArray(a)&&(s=me(r,a[1]),a=a[0]),ArrayBuffer.isView(a)?n[o]=[a,s]:(n[o+=`/`]=[new O(0),s],ge(a,o,n,r))}},_e=typeof TextEncoder<`u`&&new TextEncoder,ve=typeof TextDecoder<`u`&&new TextDecoder;try{ve.decode(le,{stream:!0})}catch{}function ye(e,t){if(t){for(var n=new O(e.length),r=0;r<e.length;++r)n[r]=e.charCodeAt(r);return n}if(_e)return _e.encode(e);for(var i=e.length,a=new O(e.length+(e.length>>1)),o=0,s=function(e){a[o++]=e},r=0;r<i;++r){if(o+5>a.length){var c=new O(o+8+(i-r<<1));c.set(a),a=c}var l=e.charCodeAt(r);l<128||t?s(l):l<2048?(s(192|l>>6),s(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++r)&1023,s(240|l>>18),s(128|l>>12&63),s(128|l>>6&63),s(128|l&63)):(s(224|l>>12),s(128|l>>6&63),s(128|l&63))}return W(a,0,o)}var be=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&K(9),t+=r+4}return t},xe=function(e,t,n,r,i,a,o,s){var c=r.length,l=n.extra,u=s&&s.length,d=be(l);Q(e,t,o==null?67324752:33639248),t+=4,o!=null&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(a<0&&8),e[t++]=i&&8,e[t++]=n.compression&255,e[t++]=n.compression>>8;var f=new Date(n.mtime==null?Date.now():n.mtime),p=f.getFullYear()-1980;if((p<0||p>119)&&K(10),Q(e,t,p<<25|f.getMonth()+1<<21|f.getDate()<<16|f.getHours()<<11|f.getMinutes()<<5|f.getSeconds()>>1),t+=4,a!=-1&&(Q(e,t,n.crc),Q(e,t+4,a<0?-a-2:a),Q(e,t+8,n.size)),Q(e,t+12,c),Q(e,t+14,d),t+=16,o!=null&&(Q(e,t,u),Q(e,t+6,n.attrs),Q(e,t+10,o),t+=14),e.set(r,t),t+=c,d)for(var m in l){var h=l[m],g=h.length;Q(e,t,+m),Q(e,t+2,g),e.set(h,t+4),t+=4+g}return u&&(e.set(s,t),t+=u),t},Se=function(e,t,n,r,i){Q(e,t,101010256),Q(e,t+8,n),Q(e,t+10,n),Q(e,t+12,r),Q(e,t+16,i)};function Ce(e,t){t||={};var n={},r=[];ge(e,``,n,t);var i=0,a=0;for(var o in n){var s=n[o],c=s[0],l=s[1],u=l.level==0?0:8,d=ye(o),f=d.length,p=l.comment,m=p&&ye(p),h=m&&m.length,g=be(l.extra);f>65535&&K(11);var _=u?he(c,l):c,v=_.length,y=fe();y.p(c),r.push(me(l,{size:c.length,crc:y.d(),c:_,f:d,m,u:f!=o.length||m&&p.length!=h,o:i,compression:u})),i+=30+f+g+v,a+=76+2*(f+g)+(h||0)+v}for(var b=new O(a+22),x=i,S=a-i,C=0;C<r.length;++C){var d=r[C];xe(b,d.o,d,d.f,d.u,d.c.length);var w=30+d.f.length+be(d.extra);b.set(d.c,d.o+w),xe(b,i,d,d.f,d.u,d.c.length,d.o,d.m),i+=16+w+(d.m?d.m.length:0)}return Se(b,i,r.length,S,x),b}var we=`M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z`,Te=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,Ee=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,De=`M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z`,Oe=`M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z`,ke=`M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11.1C12.36 22.24 14.09 23 16 23C19.87 23 23 19.87 23 16C23 14.09 22.24 12.36 21 11.1V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1M5 5H19V7H5M5 9H19V9.67C18.09 9.24 17.07 9 16 9C12.13 9 9 12.13 9 16C9 17.07 9.24 18.09 9.67 19H5M16 11.15C18.68 11.15 20.85 13.32 20.85 16C20.85 18.68 18.68 20.85 16 20.85C13.32 20.85 11.15 18.68 11.15 16C11.15 13.32 13.32 11.15 16 11.15M15 13V16.69L18.19 18.53L18.94 17.23L16.5 15.82V13Z`,Ae=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,je=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,Me=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,Ne=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z`,Pe=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M5,5V7H19V5H5M5,9V11H13V9H5M5,13V15H15V13H5Z`,Fe=`M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z`,Ie=`M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z`,Le=`M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z`,Re=`M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z`,ze=`M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z`,Be=`M7,2V13H10V22L17,10H13L17,2H7Z`,Ve=`M5,4V7H10.5V19H13.5V7H19V4H5Z`,He=`M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z`,Ue=`M16,17H5V7H16L19.55,12M17.63,5.84C17.27,5.33 16.67,5 16,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H16C16.67,19 17.27,18.66 17.63,18.15L22,12L17.63,5.84Z`,We=`M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z`,Ge=`M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z`,Ke=`M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z`,qe=`M8,5.14V19.14L19,12.14L8,5.14Z`,Je=`M17 19.1L19.5 20.6L18.8 17.8L21 15.9L18.1 15.7L17 13L15.9 15.6L13 15.9L15.2 17.8L14.5 20.6L17 19.1M3 14H11V16H3V14M3 6H15V8H3V6M3 10H15V12H3V10Z`,Ye=`M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z`,Xe=`M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9`,Ze=`M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z`,Qe=`M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z`,$e=`M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z`;function $(e,t=24){return`<svg xmlns="http://www.w3.org/2000/svg" width="${String(t)}" height="${String(t)}" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${e}"></path></svg>`}var et=$(Re),tt=$(Le),nt=$($e);$(Oe),$(qe),$(Ye),$(Ge),$(Ie),$(Be),$(Me),$(Ke),$(We),$(Ne),$(Ue),$(Ve),$(we),$(ze),$(Fe),$(Je),$(ke),$(Pe),$(Ze),$(De),$(Ae),$(je),$(Ee),$(Te),$(He),$(Qe),$(Xe);var rt={maxZipSize:500*1024*1024,maxImagesPerZip:300,compressionLevel:6,splitZipFiles:!0},it=class{uiBuilder;badImageHandler;toast;progressBar;logger;config;options;filesData=new Map;downloadedUrls=new Set;isProcessing=!1;constructor(e,t,n,r,i,a,o=rt){this.uiBuilder=e,this.badImageHandler=t,this.toast=n,this.progressBar=r,this.logger=i,this.config=a,this.options=o}async prepareZip(){if(this.logger.debug(`prepareZip開始`),this.isProcessing){this.logger.debug(`既に処理中のため、prepareZipをスキップ`),this.toast.show(S(`zipProcessing`),`info`);return}this.isProcessing=!0;try{this.filesData.clear(),this.uiBuilder.setZipButtonState(`processing`,nt),this.toast.show(S(`zipPrepareStart`),`info`),this.progressBar.show(),this.progressBar.update(0);let e=Array.from(this.uiBuilder.imageData.keys());this.config.singleImageTest&&e.length>0&&(this.logger.debug(`単一画像テストモード: 最初の1枚だけ処理します`),e=[e[0]],this.toast.show(S(`testModeOneImage`),`warning`));let t=e.length;if(this.logger.debug(`画像URL ${t}件を収集`),t===0){this.toast.show(S(`noDownloadableImages`),`error`),this.uiBuilder.setZipButtonState(`initial`,et);return}let n=0,r=0,i=0,a=[],o=this.uiBuilder.imageData;for(let[n,s]of e.entries())try{this.logger.debug(`画像情報収集 ${n+1}/${t}: ${s.substring(0,50)}...`);let e=o.get(s);if(!e){this.logger.error(`画像データが見つかりません`,void 0,{url:s}),r+=1;continue}if(this.logger.debug(`メタデータ`,{width:e.metadata?.width,height:e.metadata?.height,size:e.metadata?.size,hasBlob:e.blob!==null}),e.blob)i+=1,this.logger.debug(`既存のBlobを使用`,{size:e.blob.size});else try{let t=await this.fetchImageAsBlob(s);e.blob=t,o.set(s,e),this.logger.debug(`Blobダウンロード成功`,{size:t.size})}catch(e){this.logger.error(`画像のダウンロードに失敗しました`,e,{url:s}),r+=1;continue}let c=this.getFilenameFromUrl(s);a.push({url:s,entry:e,fileName:c})}catch(e){this.logger.error(`画像メタデータ処理中にエラーが発生しました`,e,{url:s,index:n}),r+=1}this.logger.debug(`並列処理開始`,{count:a.length}),a.length===0&&this.toast.show(S(`noImagesForZip`),`warning`);let s=await Promise.all(a.map(async({url:e,entry:t,fileName:n},r)=>{try{if(!t.blob)return this.logger.error(`Blobが存在しません`,void 0,{url:e,fileName:n}),{success:!1,url:e,fileName:n};this.logger.debug(`画像変換`,{index:r+1,fileName:n});let i=new Uint8Array(await t.blob.arrayBuffer());return i.byteLength===0?(this.logger.warn(`変換後のデータが空です`,{url:e,fileName:n}),{success:!1,url:e,fileName:n}):{success:!0,url:e,fileName:n,bytes:i}}catch(t){return this.logger.error(`画像処理中にエラーが発生しました`,t,{url:e,fileName:n}),{success:!1,url:e,fileName:n}}}));for(let e of s){e.success&&e.bytes?(this.filesData.set(e.fileName,e.bytes),this.downloadedUrls.add(e.url),n+=1):r+=1;let i=n/t*100;this.progressBar.update(i)}this.logger.debug(`並列処理完了`,{processed:n,failed:r,skipped:i,filesCount:this.filesData.size}),this.toast.show(x(`zipReadyCount`,{processed:String(n),total:String(t)}),`info`),this.config.singleImageTest&&(this.logger.debug(`単一画像テストモードで実行されました`),this.toast.show(S(`zipTestMode`),`info`)),r>0&&this.toast.show(x(`failedImagesInZip`,{count:String(r)}),`warning`),n>0?(this.toast.show(S(`zipPrepareComplete`),`success`),this.uiBuilder.setZipButtonState(`ready`,tt)):(this.logger.error(`処理された画像が0件です`,void 0,{total:t,processed:n,failed:r}),this.toast.show(S(`zipGenerateFailed`),`error`),this.uiBuilder.setZipButtonState(`initial`,et),this.filesData.clear())}catch(e){this.logger.error(`ZIP準備中にエラーが発生しました`,e,{filesDataSize:this.filesData.size}),this.toast.show(S(`zipPrepareFailed`),`error`),this.uiBuilder.setZipButtonState(`initial`,et),this.filesData.clear()}finally{this.progressBar.hide(),this.isProcessing=!1}}async downloadZip(){if(this.logger.debug(`downloadZip開始`),!this.fflateAvailable()){this.toast.show(S(`zipLibraryUnavailable`),`error`),this.logger.error(`fflate利用不可のためダウンロード中止`);return}if(this.filesData.size===0){this.logger.warn(`ファイルデータが空のため準備からやり直し`),this.toast.show(S(`zipNoPrepared`),`warning`),await this.prepareZip();return}let e=Array.from(this.filesData.entries());if(e.length===0){this.logger.error(`ZIPファイルが空です`),this.toast.show(S(`zipEmpty`),`error`),this.uiBuilder.setZipButtonState(`initial`,et);return}this.logger.debug(`ZIP内のファイル数`,{count:e.length});try{this.isProcessing=!0,this.toast.show(S(`zipGenerating`),`info`),this.progressBar.show();let t=e.length;this.options.splitZipFiles&&t>this.options.maxImagesPerZip?await this.generateSplitZips(e,t):await this.generateSingleZip(e)}catch(e){this.logger.error(`ZIPダウンロード中に詳細エラー情報`,e,{filesDataSize:this.filesData.size}),this.toast.show(S(`zipGenerateFailed`),`error`)}finally{this.progressBar.hide(),this.uiBuilder.setZipButtonState(`initial`,`<span class="ic material-icons">download</span>`),this.isProcessing=!1}}async generateSingleZip(e){this.logger.debug(`単一ZIPファイル生成開始`);let t=performance.now(),n={};for(let[t,r]of e)n[t]=r;let r=Ce(n,this.createZipOptions());if(this.logger.debug(`ZIP生成時間`,{milliseconds:Math.round(performance.now()-t)}),!r)throw Error(`ZIP生成結果がnullです`);let i=this.createZipBlob(r),a=`images_${this.getFormattedDate()}.zip`;await this.triggerDownload(i,a),this.toast.show(S(`zipDownloadStarted`),`success`)}async generateSplitZips(e,t){this.logger.debug(`分割ZIPファイル生成開始`,{totalEntries:t});let n=Math.ceil(t/this.options.maxImagesPerZip);this.toast.show(x(`zipManyImagesSplit`,{count:String(n)}),`info`);for(let r=0;r<n;r+=1){let i=r*this.options.maxImagesPerZip,a=Math.min((r+1)*this.options.maxImagesPerZip,t),o=e.slice(i,a);this.logger.debug(`分割ZIP生成`,{part:r+1,start:i+1,end:a}),this.progressBar.update(r/n*100);let s={};for(let[e,t]of o)s[e]=t;let c=Ce(s,this.createZipOptions()),l=this.createZipBlob(c),u=`images_${this.getFormattedDate()}_part${r+1}of${n}.zip`;await this.triggerDownload(l,u),r<n-1&&(this.toast.show(x(`zipPartStarted`,{part:String(r+1),total:String(n)}),`success`),await new Promise(e=>setTimeout(e,1500)))}this.toast.show(x(`zipSplitStarted`,{count:String(n)}),`success`)}triggerDownload(e,t){return this.logger.debug(`ダウンロード開始`,{filename:t}),new Promise((n,r)=>{try{let r=document.createElement(`a`);r.href=URL.createObjectURL(e),r.download=t,document.body.appendChild(r),r.click(),setTimeout(()=>{document.body.removeChild(r),URL.revokeObjectURL(r.href),n()},100)}catch(e){this.logger.error(`ダウンロードリンク作成エラー`,e,{filename:t}),r(e)}})}fetchImageAsBlob(e){return this.logger.debug(`fetchImageAsBlob開始`,{url:e.substring(0,50)}),new Promise((t,n)=>{f({url:e,responseType:`blob`,timeout:3e4}).then(r=>{let i=r.response;i?(this.logger.debug(`画像ダウンロード成功`,{url:e.substring(0,50),size:i.size}),t(i)):(this.logger.error(`レスポンスまたはレスポンスデータが空です`,void 0,{url:e}),n(Error(`Empty response`)))}).catch(t=>{this.logger.error(`画像ダウンロード失敗`,void 0,{url:e,error:t}),n(t)})})}createZipOptions(){return{level:this.options.compressionLevel,mem:8}}createZipBlob(e){let t=e.slice().buffer;return new Blob([t],{type:`application/zip`})}getFilenameFromUrl(e){let[t]=e.split(`?`),n=t?.split(`/`).pop()??`image.jpg`;n.includes(`.`)||(n+=`.jpg`);let r=n.substring(0,n.lastIndexOf(`.`)),i=n.substring(n.lastIndexOf(`.`)),a=1,o=n;for(;this.filesData.has(o);)o=`${r}_${a}${i}`,a+=1;return o}getFormattedDate(){let e=new Date;return`${e.getFullYear()}${String(e.getMonth()+1).padStart(2,`0`)}${String(e.getDate()).padStart(2,`0`)}_${String(e.getHours()).padStart(2,`0`)}${String(e.getMinutes()).padStart(2,`0`)}`}fflateAvailable(){return typeof Ce==`function`}},at=class{uiBuilder;imageCollector;logger;constructor(e,t,n){this.uiBuilder=e,this.imageCollector=t,this.logger=n}register(){u(S(`menuLaunch`),()=>{try{this.uiBuilder.showModal(),this.imageCollector.collectImages()}catch(e){this.logger.error(`メニューコマンド実行中にエラーが発生しました`,e)}}),this.logger.debug(`メニューコマンドを登録しました`)}},ot=(e={})=>{let t=document.createElement(`div`);e.id&&(t.id=e.id),t.style.position=`relative`;let n=t.attachShadow({mode:e.mode??`open`});if(e.cssText){let t=document.createElement(`style`);t.textContent=e.cssText,n.appendChild(t)}return e.adoptStyles?.length&&e.adoptStyles.forEach(e=>{let t=document.createElement(`style`);t.textContent=e,n.appendChild(t)}),document.body.appendChild(t),{host:t,root:n,dispose:()=>{t.remove()}}},st=class{logger;progressContainer=null;progressBar=null;progressText=null;shadowHost=null;shadowRoot=null;constructor(e){this.logger=e,this.init()}show(){this.getContainer().style.display=`block`}hide(){this.getContainer().style.display=`none`}update(e){let t=Math.max(0,Math.min(100,e));this.getProgressBar().style.width=`${t}%`,this.getProgressText().textContent=x(`progress`,{percent:t.toFixed(0)})}init(){let{host:e,root:t}=ot({id:`progress-shadow-host`,mode:`closed`});this.shadowHost=e,this.shadowRoot=t;let n=document.createElement(`style`);n.textContent=`
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
    `,this.shadowRoot.appendChild(n),this.progressContainer=document.createElement(`div`),this.progressContainer.classList.add(`ic`,`progress-container`),this.progressBar=document.createElement(`div`),this.progressBar.classList.add(`ic`,`progress-bar`),this.progressContainer.appendChild(this.progressBar),this.progressText=document.createElement(`div`),this.progressText.classList.add(`ic`,`progress-text`),this.progressText.textContent=x(`progress`,{percent:`0`}),this.progressContainer.appendChild(this.progressText),this.shadowRoot.appendChild(this.progressContainer),this.logger.debug(`プログレスバーUIを初期化しました`)}getContainer(){if(!this.progressContainer)throw Error(`Progress container is not initialized.`);return this.progressContainer}getProgressBar(){if(!this.progressBar)throw Error(`Progress bar is not initialized.`);return this.progressBar}getProgressText(){if(!this.progressText)throw Error(`Progress text is not initialized.`);return this.progressText}},ct=class{logger;toastContainer=null;shadowHost=null;shadowRoot=null;constructor(e){this.logger=e,this.init()}show(e,t=`info`,n=3e3){let r=this.getToastContainer(),i=document.createElement(`div`);i.classList.add(`ic`,`toast`,`ic.toast-${t}`),i.textContent=e,r.appendChild(i),setTimeout(()=>{i.classList.add(`show`)},10),setTimeout(()=>{i.classList.remove(`show`),setTimeout(()=>{i.parentNode&&i.remove()},300)},n)}init(){let{host:e,root:t}=ot({id:`toast-shadow-host`,mode:`closed`});this.shadowHost=e,this.shadowRoot=t;let n=document.createElement(`style`);n.textContent=`
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
    `,this.shadowRoot.appendChild(n),this.toastContainer=document.createElement(`div`),this.toastContainer.classList.add(`ic`,`toast-container`),this.shadowRoot.appendChild(this.toastContainer),this.logger.debug(`トーストUIを初期化しました`)}getToastContainer(){if(!this.toastContainer)throw Error(`Toast container is not initialized.`);return this.toastContainer}},lt=class{uiBuilder;badImageHandler;logger;imageQueue=[];isProcessing=!1;constructor(e,t,n){this.uiBuilder=e,this.badImageHandler=t,this.logger=n}async addImagesFastPath(e){if(!Array.isArray(e)){this.logger.error(`imageItemsが配列ではありません`,void 0,{type:typeof e});return}let t=0,n=0;for(let r of e)try{let{url:e,classification:i}=r,a=null,o=i.element;if(o instanceof HTMLImageElement&&o.naturalWidth>0&&o.naturalHeight>0&&(a={width:o.naturalWidth,height:o.naturalHeight,size:0,loaded:o.complete},this.logger.debug(`DOM要素からメタデータ取得: ${e.substring(0,50)}...`,{width:a.width,height:a.height})),!a&&(a=await this.badImageHandler.getImageMetadata(e),!a)){this.logger.warn(`高速パスでもメタデータ取得に失敗しました`,{url:e}),n+=1;continue}this.imageQueue.push({url:e,metadata:a}),t+=1}catch(e){this.logger.error(`高速パス画像処理中にエラーが発生しました`,e,{url:r.url}),n+=1}this.logger.debug(`高速パス処理完了`,{successCount:t,failureCount:n}),this.isProcessing||this.processBatch()}async addImages(e){if(!Array.isArray(e)){this.logger.error(`imageUrlsが配列ではありません`,void 0,{type:typeof e});return}let t=0,n=0;for(let r of e)try{let e=await this.badImageHandler.getImageMetadata(r);if(!e){this.logger.warn(`画像のメタデータ取得に失敗しました`,{url:r}),n+=1;continue}this.imageQueue.push({url:r,metadata:e}),t+=1}catch(e){this.logger.error(`画像メタデータの取得中にエラーが発生しました`,e,{url:r}),n+=1}this.logger.debug(`画像追加処理完了`,{successCount:t,failureCount:n}),this.isProcessing||this.processBatch()}async processBatch(){try{this.isProcessing=!0;let e=()=>{try{this.imageQueue.splice(0,5).forEach(({url:e,metadata:t})=>{try{this.uiBuilder.addImageToGrid(e,t)}catch(t){this.logger.error(`グリッドへの画像追加中にエラーが発生しました`,t,{url:e})}}),this.imageQueue.length>0?requestAnimationFrame(e):(this.isProcessing=!1,this.logger.debug(`バッチ処理が完了しました`))}catch(e){this.logger.error(`バッチ処理中にエラーが発生しました`,e),this.isProcessing=!1}};requestAnimationFrame(e)}catch(e){this.logger.error(`バッチ処理の開始中にエラーが発生しました`,e),this.isProcessing=!1}}},ut=class{config;badImageHandler;logger;modal=null;gridContainer=null;closeButton=null;zipButton=null;shadowHost=null;shadowRoot=null;imageStore=new Map;constructor(e,t,n){this.config=e,this.badImageHandler=t,this.logger=n}buildModal(){try{let{host:e,root:t}=ot({id:`image-collector-shadow-host`,mode:`closed`});this.shadowHost=e,this.shadowRoot=t,this.injectShadowStyles(this.shadowRoot),this.modal=document.createElement(`div`),this.modal.classList.add(`image-collector-modal`),this.gridContainer=document.createElement(`div`),this.gridContainer.classList.add(`ic`,`image-grid-container`),this.modal.appendChild(this.gridContainer),this.zipButton=document.createElement(`button`),this.zipButton.classList.add(`ic`,`zip-download-button`),this.zipButton.innerHTML=et,this.zipButton.dataset.state=`initial`,this.zipButton.style.display=this.config.showZipButton?`flex`:`none`,this.modal.appendChild(this.zipButton),this.closeButton=document.createElement(`button`),this.closeButton.classList.add(`ic`,`close-button`),this.closeButton.textContent=`×`,this.modal.appendChild(this.closeButton),this.shadowRoot.appendChild(this.modal),document.body.appendChild(this.shadowHost),this.logger.debug(`モーダルの構築が完了しました`)}catch(e){throw this.logger.error(`モーダルの構築中にエラーが発生しました`,e),e}}addImageToGrid(e,t){let n=this.getGridContainer(),r=this.createImageItem(e,t);n.appendChild(r)}showModal(){this.getModalElement().style.display=`block`}hideModal(){let e=this.getGridContainer();e.innerHTML=``,this.getModalElement().style.display=`none`}setZipButtonVisibility(e){let t=this.getZipButton();t.style.display=e?`flex`:`none`}setZipButtonState(e,t){let n=this.getZipButton();n.dataset.state=e,n.innerHTML=t}get imageData(){return this.imageStore}getModalElement(){if(!this.modal)throw Error(`Modal has not been built yet.`);return this.modal}getGridContainer(){if(!this.gridContainer)throw Error(`Grid container has not been built yet.`);return this.gridContainer}getZipButton(){if(!this.zipButton)throw Error(`ZIP button has not been built yet.`);return this.zipButton}getCloseButton(){if(!this.closeButton)throw Error(`Close button has not been built yet.`);return this.closeButton}injectShadowStyles(e){let t=document.createElement(`style`);t.textContent=`
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
    `,e.appendChild(t)}createImageItem(e,t){let n=document.createElement(`div`);if(n.classList.add(`ic`,`image-item`),this.imageStore.set(e,{metadata:t,blob:null}),t.size>this.badImageHandler.maxFileSize)return n.appendChild(this.badImageHandler.createPlaceholder(e,t)),n;let r=document.createElement(`img`);return r.src=e,r.alt=`Collected Image`,r.classList.add(`ic`,`grid-image`),r.onerror=()=>{this.logger.warn(`画像の読み込みに失敗しました`,{imageUrl:e});let t=this.badImageHandler.createErrorPlaceholder(e);n.replaceChildren(t)},n.appendChild(r),n}},dt=class{uiBuilder;zipDownloader;logger;constructor(e,t,n){this.uiBuilder=e,this.zipDownloader=t,this.logger=n}initialize(){this.setupModalInteractions(),this.setupZipButton(),this.setupGridInteractions(),this.logger.debug(`イベントハンドラーの設定が完了しました`)}setupModalInteractions(){let e=this.uiBuilder.getModalElement();e.addEventListener(`click`,t=>{try{t.target===e&&this.uiBuilder.hideModal()}catch(e){this.logger.error(`モーダルクリックイベント処理中にエラーが発生しました`,e)}}),this.uiBuilder.getCloseButton().addEventListener(`click`,()=>{try{this.uiBuilder.hideModal()}catch(e){this.logger.error(`閉じるボタンクリック処理中にエラーが発生しました`,e)}})}setupZipButton(){this.uiBuilder.getZipButton().addEventListener(`click`,()=>{try{let e=this.uiBuilder.getZipButton().dataset.state;e===`initial`?this.zipDownloader.prepareZip():e===`ready`&&this.zipDownloader.downloadZip()}catch(e){this.logger.error(`ZIPボタンクリック処理中にエラーが発生しました`,e)}})}setupGridInteractions(){this.uiBuilder.getGridContainer().addEventListener(`click`,e=>{try{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`.ic.grid-image`);if(!n)return;let r=n.src,i=n.dataset.originalUrl??r;this.showFullScreenImage(r,i)}catch(e){this.logger.error(`画像クリック処理中にエラーが発生しました`,e)}})}showFullScreenImage(e,t){let{root:n,dispose:r}=ot({id:`fullscreen-shadow-host`,mode:`closed`}),i=document.createElement(`style`);i.textContent=`
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
    `,n.appendChild(i);let a=document.createElement(`div`);a.classList.add(`ic`,`full-screen-container`);let o=document.createElement(`img`);o.src=e,o.classList.add(`ic`,`full-screen-image`),a.appendChild(o);let s=document.createElement(`button`);s.classList.add(`ic`,`download-button`),s.textContent=S(`download`),s.addEventListener(`click`,()=>{try{this.downloadImage(e)}catch(t){this.logger.error(`フルスクリーンダウンロード中にエラーが発生しました`,t,{imageUrl:e})}}),a.appendChild(s);let c=document.createElement(`button`);c.classList.add(`ic`,`original-link-button`),c.textContent=S(`fullscreenOriginal`),c.addEventListener(`click`,()=>{window.open(t,`_blank`)}),a.appendChild(c);let l=document.createElement(`div`);l.classList.add(`ic`,`file-name-display`),l.textContent=t.split(`/`).pop()??t,a.appendChild(l);let u=document.createElement(`button`);u.classList.add(`ic`,`full-screen-close-button`),u.textContent=`×`,u.addEventListener(`click`,()=>{try{r()}catch(e){this.logger.error(`フルスクリーンモーダルの閉じる処理でエラーが発生しました`,e)}}),a.appendChild(u),a.addEventListener(`click`,e=>{if(e.target===a)try{r()}catch(e){this.logger.error(`フルスクリーンモーダルの削除中にエラーが発生しました`,e)}}),n.appendChild(a)}async downloadImage(e){try{let t=(await f({url:e,responseType:`blob`})).response;if(!t){this.logger.error(`ダウンロードしたBlobが空です`,void 0,{imageUrl:e});return}let n=document.createElement(`a`);n.href=URL.createObjectURL(t),n.download=e.split(`/`).pop()??`image`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(n.href),this.logger.debug(`画像のダウンロードが完了しました`,{imageUrl:e})}catch(t){this.logger.error(`ダウンロード要求の作成中にエラーが発生しました`,t,{imageUrl:e})}}};async function ft(){let e=new o(a);r(t=>t===`warn`||t===`error`?!0:e.isDebugEnabled());let t=i(`ImageCollector2:Bootstrap`);t.info(`legacy collector bootstrap start`),pt(e,t)}function pt(e,t){try{let n=new C(i(`ImageCollector2:BadImageHandler`)),r=new ut(e,n,i(`ImageCollector2:UIBuilder`));r.buildModal(),requestAnimationFrame(()=>{try{let a=new st(i(`ImageCollector2:ProgressBar`)),o=new ct(i(`ImageCollector2:Toast`)),s=new lt(r,n,i(`ImageCollector2:UIBatchUpdater`)),c=new it(r,n,o,a,i(`ImageCollector2:ZipDownloader`),e),l=new dt(r,c,i(`ImageCollector2:UIEventHandler`));l.initialize();let u=new D(s,n,a,o,i(`ImageCollector2:ImageCollectorMain`));new at(r,u,i(`ImageCollector2:MenuRegister`)).register(),d(e,i(`ImageCollector2:ConfigCommands`),r),mt({config:e,uiBuilder:r,uiBatchUpdater:s,uiEventHandler:l,imageCollectorMain:u,badImageHandler:n,toast:o,progressBar:a,zipDownloader:c}),t.info(`legacy collector components initialized`)}catch(e){t.error(`遅延初期化中にエラーが発生しました`,e)}})}catch(e){t.error(`コンポーネント初期化中にエラーが発生しました`,e)}}function mt(e){l().ImageCollector2={MenuRegister:at,UIBuilder:ut,UIBatchUpdater:lt,UIEventHandler:dt,ImageCollectorMain:D,BadImageHandler:C,ImageSourceClassifier:T,Toast:ct,ProgressBar:st,RequestBatchLimiter:E,ImageHostManager:w,ZipDownloader:it,...e,config:e.config}}var ht=class{options;log;constructor(e={}){this.options=e,this.log=i(`ImageCollectorApp`)}start(){this.log.info(`starting legacy collector`),ft()}},gt=i(`ImageCollector2`);async function _t(){gt.info(`bootstrap start`);try{new ht().start(),gt.info(`legacy bootstrap completed`)}catch(e){gt.error(`bootstrap failed`,e)}}_t()})();
