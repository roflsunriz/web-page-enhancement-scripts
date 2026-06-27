import {
  buildSupportedTranslationMap,
  createI18n,
  type LocaleCode,
} from "@/shared/i18n";

type TranslationKey =
  | "autoChapterNavigation"
  | "chapterNext"
  | "chapterPrevious"
  | "clickNextChapter"
  | "close"
  | "collectionSystemStart"
  | "controlPanelTitle"
  | "defaultLoadingImages"
  | "endOfContents"
  | "errorOccurred"
  | "fastLoadedImages"
  | "foundTweetImages"
  | "imageCollecting"
  | "imageCollected"
  | "imageSearch"
  | "initialImagesReady"
  | "launch"
  | "launchError"
  | "launchMenu"
  | "lastPage"
  | "loadedImages"
  | "loadedImagesReady"
  | "loadingImages"
  | "loadingImagesWithErrors"
  | "nextDynamicImages"
  | "noImages"
  | "noImagesDescription"
  | "noImagesFound"
  | "pageScan"
  | "preloadComplete"
  | "preloadCompleteWithErrors"
  | "processingComplete"
  | "readyImages"
  | "reanalyze"
  | "reset"
  | "retryCollection"
  | "retryingImages"
  | "retrying"
  | "scrollFound"
  | "scrollSearchImages"
  | "stateOff"
  | "stateOn"
  | "validationComplete"
  | "validationError"
  | "validatingImages"
  | "validImageSearch"
  | "viewerLaunch"
  | "zoom";

const translations = buildSupportedTranslationMap(
  {
    ja: {
      autoChapterNavigation: "チャプター自動移動: {state}",
      chapterNext: "次のチャプター",
      chapterPrevious: "前のチャプター",
      clickNextChapter: "クリックして次のチャプターへ",
      close: "閉じる",
      collectionSystemStart: "画像収集システムを開始中...",
      controlPanelTitle: "マンガビューア",
      defaultLoadingImages: "画像を読み込み中...",
      endOfContents: "End of Contents",
      errorOccurred: "エラーが発生しました。",
      fastLoadedImages:
        "{count}枚の読み込み済み画像を検出しました。高速起動します...",
      foundTweetImages: "{count}枚のツイート画像を見つけました。検証中...",
      imageCollecting: "ページ上の画像を収集しています...",
      imageCollected: "{count}枚の画像を収集しました...",
      imageSearch: "画像を検索中...",
      initialImagesReady: "{count}枚を即時追加。残り{remaining}枚を検証中...",
      launch: "ビューア起動",
      launchError: "ビューア起動中にエラーが発生しました: {message}",
      launchMenu: "ブック風マンガビューア起動",
      lastPage: "最後のページです",
      loadedImages: "{count}枚の画像を読み込みました。ビューアを準備中...",
      loadedImagesReady:
        "{count}枚の読み込み済み画像を確認しました。ビューアを起動中...",
      loadingImages: "画像をプリロード中... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "画像をプリロード中... {loaded}/{total} ({percent}%) - {errors}枚エラー",
      nextDynamicImages: "動的に読み込まれる画像を待機中...",
      noImages: "画像が見つかりません",
      noImagesDescription:
        "ページの読み込みが完了する前に画像収集が行われた可能性があります。",
      noImagesFound: "画像が見つかりませんでした",
      pageScan: "ページをスキャン中... ({current}/{total})",
      preloadComplete: "{total}枚の画像をプリロード完了。ビューアを起動中...",
      preloadCompleteWithErrors:
        "{total}枚中{loaded}枚の画像をプリロード完了（{errors}枚エラー）。ビューアを起動中...",
      processingComplete: "処理完了: {count}枚の画像を処理しました",
      readyImages: "準備完了: {count}枚の画像",
      reanalyze: "再分析",
      reset: "リセット",
      retryCollection: "画像を再収集する",
      retryingImages: "画像を再収集中...",
      retrying: "再収集中...",
      scrollFound: "スクロール中... ({current}/) - {count}枚発見",
      scrollSearchImages: "画像を探すためにページをスクロール中...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "検証完了: {count}枚の有効な画像",
      validationError: "検証中にエラーが発生しました",
      validatingImages: "画像検証中... {current}/{total}",
      validImageSearch: "有効な画像を検索中です...",
      viewerLaunch: "マンガビューア起動",
      zoom: "ズーム: {percent}%",
    },
    en: {
      autoChapterNavigation: "Auto chapter navigation: {state}",
      chapterNext: "Next chapter",
      chapterPrevious: "Previous chapter",
      clickNextChapter: "Click to go to the next chapter",
      close: "Close",
      collectionSystemStart: "Starting the image collection system...",
      controlPanelTitle: "Manga Viewer",
      defaultLoadingImages: "Loading images...",
      endOfContents: "End of Contents",
      errorOccurred: "An error occurred.",
      fastLoadedImages:
        "Detected {count} already-loaded images. Starting quickly...",
      foundTweetImages: "Found {count} tweet images. Validating...",
      imageCollecting: "Collecting images on the page...",
      imageCollected: "Collected {count} images...",
      imageSearch: "Searching for images...",
      initialImagesReady:
        "Added {count} image(s) immediately. Validating {remaining} remaining...",
      launch: "Launch viewer",
      launchError: "An error occurred while launching the viewer: {message}",
      launchMenu: "Launch Book-Style Manga Viewer",
      lastPage: "This is the last page",
      loadedImages: "Loaded {count} image(s). Preparing the viewer...",
      loadedImagesReady:
        "Confirmed {count} already-loaded image(s). Launching the viewer...",
      loadingImages: "Preloading images... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "Preloading images... {loaded}/{total} ({percent}%) - {errors} error(s)",
      nextDynamicImages: "Waiting for dynamically loaded images...",
      noImages: "No images found",
      noImagesDescription:
        "Image collection may have run before the page finished loading.",
      noImagesFound: "No images were found",
      pageScan: "Scanning page... ({current}/{total})",
      preloadComplete: "Preloaded {total} image(s). Launching the viewer...",
      preloadCompleteWithErrors:
        "Preloaded {loaded} of {total} image(s) ({errors} error(s)). Launching the viewer...",
      processingComplete: "Complete: processed {count} image(s)",
      readyImages: "Ready: {count} image(s)",
      reanalyze: "Analyze again",
      reset: "Reset",
      retryCollection: "Collect images again",
      retryingImages: "Collecting images again...",
      retrying: "Collecting again...",
      scrollFound: "Scrolling... ({current}/) - {count} found",
      scrollSearchImages: "Scrolling the page to find images...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "Validation complete: {count} valid image(s)",
      validationError: "An error occurred during validation",
      validatingImages: "Validating images... {current}/{total}",
      validImageSearch: "Searching for valid images...",
      viewerLaunch: "Launch Manga Viewer",
      zoom: "Zoom: {percent}%",
    },
    "zh-Hans": {
      autoChapterNavigation: "章节自动跳转：{state}",
      chapterNext: "下一章",
      chapterPrevious: "上一章",
      clickNextChapter: "点击前往下一章",
      close: "关闭",
      collectionSystemStart: "正在启动图片收集系统...",
      controlPanelTitle: "漫画阅读器",
      defaultLoadingImages: "正在加载图片...",
      endOfContents: "内容结束",
      errorOccurred: "发生错误。",
      fastLoadedImages: "检测到 {count} 张已加载图片。快速启动中...",
      foundTweetImages: "找到 {count} 张推文图片。正在验证...",
      imageCollecting: "正在收集页面上的图片...",
      imageCollected: "已收集 {count} 张图片...",
      imageSearch: "正在搜索图片...",
      initialImagesReady:
        "已立即添加 {count} 张图片。正在验证剩余 {remaining} 张...",
      launch: "启动阅读器",
      launchError: "启动阅读器时发生错误：{message}",
      launchMenu: "启动书本风格漫画阅读器",
      lastPage: "这是最后一页",
      loadedImages: "已加载 {count} 张图片。正在准备阅读器...",
      loadedImagesReady: "已确认 {count} 张已加载图片。正在启动阅读器...",
      loadingImages: "正在预加载图片... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "正在预加载图片... {loaded}/{total} ({percent}%) - {errors} 个错误",
      nextDynamicImages: "正在等待动态加载的图片...",
      noImages: "未找到图片",
      noImagesDescription: "图片收集可能在页面加载完成前执行了。",
      noImagesFound: "未找到图片",
      pageScan: "正在扫描页面... ({current}/{total})",
      preloadComplete: "已预加载 {total} 张图片。正在启动阅读器...",
      preloadCompleteWithErrors:
        "已预加载 {loaded}/{total} 张图片（{errors} 个错误）。正在启动阅读器...",
      processingComplete: "完成：已处理 {count} 张图片",
      readyImages: "准备完成：{count} 张图片",
      reanalyze: "重新分析",
      reset: "重置",
      retryCollection: "重新收集图片",
      retryingImages: "正在重新收集图片...",
      retrying: "正在重新收集...",
      scrollFound: "正在滚动... ({current}/) - 已找到 {count} 张",
      scrollSearchImages: "正在滚动页面以查找图片...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "验证完成：{count} 张有效图片",
      validationError: "验证期间发生错误",
      validatingImages: "正在验证图片... {current}/{total}",
      validImageSearch: "正在搜索有效图片...",
      viewerLaunch: "启动漫画阅读器",
      zoom: "缩放：{percent}%",
    },
    hi: {
      autoChapterNavigation: "स्वचालित अध्याय नेविगेशन: {state}",
      chapterNext: "अगला अध्याय",
      chapterPrevious: "पिछला अध्याय",
      clickNextChapter: "अगले अध्याय पर जाने के लिए क्लिक करें",
      close: "बंद करें",
      collectionSystemStart: "छवि संग्रह प्रणाली शुरू हो रही है...",
      controlPanelTitle: "मंगा व्यूअर",
      defaultLoadingImages: "छवियां लोड हो रही हैं...",
      endOfContents: "सामग्री समाप्त",
      errorOccurred: "एक त्रुटि हुई।",
      fastLoadedImages:
        "{count} पहले से लोड छवियां मिलीं। तेज़ी से शुरू हो रहा है...",
      foundTweetImages: "{count} ट्वीट छवियां मिलीं। जांच हो रही है...",
      imageCollecting: "पेज पर छवियां एकत्र की जा रही हैं...",
      imageCollected: "{count} छवियां एकत्र की गईं...",
      imageSearch: "छवियां खोजी जा रही हैं...",
      initialImagesReady:
        "{count} छवियां तुरंत जोड़ी गईं। शेष {remaining} की जांच हो रही है...",
      launch: "व्यूअर शुरू करें",
      launchError: "व्यूअर शुरू करते समय त्रुटि हुई: {message}",
      launchMenu: "बुक-स्टाइल मंगा व्यूअर शुरू करें",
      lastPage: "यह अंतिम पेज है",
      loadedImages: "{count} छवियां लोड हुईं। व्यूअर तैयार हो रहा है...",
      loadedImagesReady:
        "{count} पहले से लोड छवियां पुष्टि हुईं। व्यूअर शुरू हो रहा है...",
      loadingImages:
        "छवियां प्रीलोड हो रही हैं... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "छवियां प्रीलोड हो रही हैं... {loaded}/{total} ({percent}%) - {errors} त्रुटियां",
      nextDynamicImages: "गतिशील रूप से लोड होने वाली छवियों की प्रतीक्षा...",
      noImages: "छवियां नहीं मिलीं",
      noImagesDescription:
        "पेज लोड पूरा होने से पहले छवि संग्रह चल गया हो सकता है।",
      noImagesFound: "कोई छवि नहीं मिली",
      pageScan: "पेज स्कैन हो रहा है... ({current}/{total})",
      preloadComplete: "{total} छवियां प्रीलोड हुईं। व्यूअर शुरू हो रहा है...",
      preloadCompleteWithErrors:
        "{total} में से {loaded} छवियां प्रीलोड हुईं ({errors} त्रुटियां)। व्यूअर शुरू हो रहा है...",
      processingComplete: "पूर्ण: {count} छवियां संसाधित हुईं",
      readyImages: "तैयार: {count} छवियां",
      reanalyze: "फिर से विश्लेषण करें",
      reset: "रीसेट",
      retryCollection: "छवियां फिर से एकत्र करें",
      retryingImages: "छवियां फिर से एकत्र हो रही हैं...",
      retrying: "फिर से एकत्र हो रहा है...",
      scrollFound: "स्क्रॉल हो रहा है... ({current}/) - {count} मिलीं",
      scrollSearchImages: "छवियां खोजने के लिए पेज स्क्रॉल हो रहा है...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "जांच पूर्ण: {count} मान्य छवियां",
      validationError: "जांच के दौरान त्रुटि हुई",
      validatingImages: "छवियों की जांच हो रही है... {current}/{total}",
      validImageSearch: "मान्य छवियां खोजी जा रही हैं...",
      viewerLaunch: "मंगा व्यूअर शुरू करें",
      zoom: "ज़ूम: {percent}%",
    },
    es: {
      autoChapterNavigation: "Navegación automática de capítulos: {state}",
      chapterNext: "Capítulo siguiente",
      chapterPrevious: "Capítulo anterior",
      clickNextChapter: "Haz clic para ir al capítulo siguiente",
      close: "Cerrar",
      collectionSystemStart: "Iniciando sistema de recopilación de imágenes...",
      controlPanelTitle: "Visor de manga",
      defaultLoadingImages: "Cargando imágenes...",
      endOfContents: "Fin del contenido",
      errorOccurred: "Ocurrió un error.",
      fastLoadedImages:
        "Se detectaron {count} imágenes ya cargadas. Iniciando rápidamente...",
      foundTweetImages:
        "Se encontraron {count} imágenes de tweets. Validando...",
      imageCollecting: "Recopilando imágenes de la página...",
      imageCollected: "Se recopilaron {count} imágenes...",
      imageSearch: "Buscando imágenes...",
      initialImagesReady:
        "Se agregaron {count} imagen(es) de inmediato. Validando {remaining} restantes...",
      launch: "Iniciar visor",
      launchError: "Ocurrió un error al iniciar el visor: {message}",
      launchMenu: "Iniciar visor de manga estilo libro",
      lastPage: "Esta es la última página",
      loadedImages: "Se cargaron {count} imagen(es). Preparando el visor...",
      loadedImagesReady:
        "Se confirmaron {count} imagen(es) ya cargadas. Iniciando el visor...",
      loadingImages: "Precargando imágenes... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "Precargando imágenes... {loaded}/{total} ({percent}%) - {errors} error(es)",
      nextDynamicImages: "Esperando imágenes cargadas dinámicamente...",
      noImages: "No se encontraron imágenes",
      noImagesDescription:
        "La recopilación de imágenes pudo ejecutarse antes de que la página terminara de cargar.",
      noImagesFound: "No se encontraron imágenes",
      pageScan: "Escaneando página... ({current}/{total})",
      preloadComplete:
        "Se precargaron {total} imagen(es). Iniciando el visor...",
      preloadCompleteWithErrors:
        "Se precargaron {loaded} de {total} imagen(es) ({errors} error(es)). Iniciando el visor...",
      processingComplete: "Completado: se procesaron {count} imagen(es)",
      readyImages: "Listo: {count} imagen(es)",
      reanalyze: "Analizar de nuevo",
      reset: "Restablecer",
      retryCollection: "Recopilar imágenes de nuevo",
      retryingImages: "Recopilando imágenes de nuevo...",
      retrying: "Recopilando de nuevo...",
      scrollFound: "Desplazando... ({current}/) - {count} encontradas",
      scrollSearchImages: "Desplazando la página para buscar imágenes...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "Validación completa: {count} imagen(es) válidas",
      validationError: "Ocurrió un error durante la validación",
      validatingImages: "Validando imágenes... {current}/{total}",
      validImageSearch: "Buscando imágenes válidas...",
      viewerLaunch: "Iniciar visor de manga",
      zoom: "Zoom: {percent}%",
    },
    fr: {
      autoChapterNavigation: "Navigation automatique des chapitres : {state}",
      chapterNext: "Chapitre suivant",
      chapterPrevious: "Chapitre précédent",
      clickNextChapter: "Cliquez pour passer au chapitre suivant",
      close: "Fermer",
      collectionSystemStart: "Démarrage du système de collecte d'images...",
      controlPanelTitle: "Lecteur de manga",
      defaultLoadingImages: "Chargement des images...",
      endOfContents: "Fin du contenu",
      errorOccurred: "Une erreur s'est produite.",
      fastLoadedImages:
        "{count} images déjà chargées détectées. Démarrage rapide...",
      foundTweetImages: "{count} images de tweets trouvées. Validation...",
      imageCollecting: "Collecte des images de la page...",
      imageCollected: "{count} images collectées...",
      imageSearch: "Recherche d'images...",
      initialImagesReady:
        "{count} image(s) ajoutée(s) immédiatement. Validation des {remaining} restantes...",
      launch: "Lancer le lecteur",
      launchError:
        "Une erreur s'est produite au lancement du lecteur : {message}",
      launchMenu: "Lancer le lecteur de manga style livre",
      lastPage: "C'est la dernière page",
      loadedImages: "{count} image(s) chargée(s). Préparation du lecteur...",
      loadedImagesReady:
        "{count} image(s) déjà chargée(s) confirmée(s). Lancement du lecteur...",
      loadingImages:
        "Préchargement des images... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "Préchargement des images... {loaded}/{total} ({percent}%) - {errors} erreur(s)",
      nextDynamicImages: "Attente des images chargées dynamiquement...",
      noImages: "Aucune image trouvée",
      noImagesDescription:
        "La collecte d'images a peut-être été lancée avant la fin du chargement de la page.",
      noImagesFound: "Aucune image n'a été trouvée",
      pageScan: "Analyse de la page... ({current}/{total})",
      preloadComplete:
        "{total} image(s) préchargée(s). Lancement du lecteur...",
      preloadCompleteWithErrors:
        "{loaded} image(s) sur {total} préchargée(s) ({errors} erreur(s)). Lancement du lecteur...",
      processingComplete: "Terminé : {count} image(s) traitée(s)",
      readyImages: "Prêt : {count} image(s)",
      reanalyze: "Analyser à nouveau",
      reset: "Réinitialiser",
      retryCollection: "Collecter les images à nouveau",
      retryingImages: "Nouvelle collecte des images...",
      retrying: "Nouvelle collecte...",
      scrollFound: "Défilement... ({current}/) - {count} trouvée(s)",
      scrollSearchImages: "Défilement de la page pour trouver des images...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "Validation terminée : {count} image(s) valide(s)",
      validationError: "Une erreur s'est produite pendant la validation",
      validatingImages: "Validation des images... {current}/{total}",
      validImageSearch: "Recherche d'images valides...",
      viewerLaunch: "Lancer le lecteur de manga",
      zoom: "Zoom : {percent}%",
    },
    ar: {
      autoChapterNavigation: "التنقل التلقائي بين الفصول: {state}",
      chapterNext: "الفصل التالي",
      chapterPrevious: "الفصل السابق",
      clickNextChapter: "انقر للانتقال إلى الفصل التالي",
      close: "إغلاق",
      collectionSystemStart: "بدء نظام جمع الصور...",
      controlPanelTitle: "عارض المانغا",
      defaultLoadingImages: "جار تحميل الصور...",
      endOfContents: "نهاية المحتوى",
      errorOccurred: "حدث خطأ.",
      fastLoadedImages: "تم اكتشاف {count} صورة محملة مسبقا. بدء سريع...",
      foundTweetImages:
        "تم العثور على {count} صورة من التغريدات. جار التحقق...",
      imageCollecting: "جار جمع الصور من الصفحة...",
      imageCollected: "تم جمع {count} صورة...",
      imageSearch: "جار البحث عن الصور...",
      initialImagesReady:
        "تمت إضافة {count} صورة فورا. جار التحقق من {remaining} المتبقية...",
      launch: "تشغيل العارض",
      launchError: "حدث خطأ أثناء تشغيل العارض: {message}",
      launchMenu: "تشغيل عارض المانغا بنمط الكتاب",
      lastPage: "هذه هي الصفحة الأخيرة",
      loadedImages: "تم تحميل {count} صورة. جار تجهيز العارض...",
      loadedImagesReady:
        "تم تأكيد {count} صورة محملة مسبقا. جار تشغيل العارض...",
      loadingImages:
        "جار التحميل المسبق للصور... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "جار التحميل المسبق للصور... {loaded}/{total} ({percent}%) - {errors} خطأ",
      nextDynamicImages: "انتظار الصور المحملة ديناميكيا...",
      noImages: "لم يتم العثور على صور",
      noImagesDescription: "ربما تم جمع الصور قبل اكتمال تحميل الصفحة.",
      noImagesFound: "لم يتم العثور على صور",
      pageScan: "جار فحص الصفحة... ({current}/{total})",
      preloadComplete: "تم تحميل {total} صورة مسبقا. جار تشغيل العارض...",
      preloadCompleteWithErrors:
        "تم تحميل {loaded} من {total} صورة مسبقا ({errors} خطأ). جار تشغيل العارض...",
      processingComplete: "اكتمل: تمت معالجة {count} صورة",
      readyImages: "جاهز: {count} صورة",
      reanalyze: "إعادة التحليل",
      reset: "إعادة ضبط",
      retryCollection: "جمع الصور مرة أخرى",
      retryingImages: "جار جمع الصور مرة أخرى...",
      retrying: "جار الجمع مرة أخرى...",
      scrollFound: "جار التمرير... ({current}/) - تم العثور على {count}",
      scrollSearchImages: "جار تمرير الصفحة للعثور على الصور...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "اكتمل التحقق: {count} صورة صالحة",
      validationError: "حدث خطأ أثناء التحقق",
      validatingImages: "جار التحقق من الصور... {current}/{total}",
      validImageSearch: "جار البحث عن صور صالحة...",
      viewerLaunch: "تشغيل عارض المانغا",
      zoom: "التكبير: {percent}%",
    },
    pt: {
      autoChapterNavigation: "Navegação automática de capítulos: {state}",
      chapterNext: "Próximo capítulo",
      chapterPrevious: "Capítulo anterior",
      clickNextChapter: "Clique para ir ao próximo capítulo",
      close: "Fechar",
      collectionSystemStart: "Iniciando o sistema de coleta de imagens...",
      controlPanelTitle: "Visualizador de mangá",
      defaultLoadingImages: "Carregando imagens...",
      endOfContents: "Fim do conteúdo",
      errorOccurred: "Ocorreu um erro.",
      fastLoadedImages:
        "{count} imagens já carregadas detectadas. Iniciando rapidamente...",
      foundTweetImages: "{count} imagens de tweets encontradas. Validando...",
      imageCollecting: "Coletando imagens na página...",
      imageCollected: "{count} imagens coletadas...",
      imageSearch: "Procurando imagens...",
      initialImagesReady:
        "{count} imagem(ns) adicionada(s) imediatamente. Validando {remaining} restantes...",
      launch: "Iniciar visualizador",
      launchError: "Ocorreu um erro ao iniciar o visualizador: {message}",
      launchMenu: "Iniciar visualizador de mangá em estilo de livro",
      lastPage: "Esta é a última página",
      loadedImages:
        "{count} imagem(ns) carregada(s). Preparando o visualizador...",
      loadedImagesReady:
        "{count} imagem(ns) já carregada(s) confirmada(s). Iniciando o visualizador...",
      loadingImages: "Pré-carregando imagens... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "Pré-carregando imagens... {loaded}/{total} ({percent}%) - {errors} erro(s)",
      nextDynamicImages: "Aguardando imagens carregadas dinamicamente...",
      noImages: "Nenhuma imagem encontrada",
      noImagesDescription:
        "A coleta de imagens pode ter sido executada antes do fim do carregamento da página.",
      noImagesFound: "Nenhuma imagem foi encontrada",
      pageScan: "Escaneando página... ({current}/{total})",
      preloadComplete:
        "{total} imagem(ns) pré-carregada(s). Iniciando o visualizador...",
      preloadCompleteWithErrors:
        "{loaded} de {total} imagem(ns) pré-carregada(s) ({errors} erro(s)). Iniciando o visualizador...",
      processingComplete: "Concluído: {count} imagem(ns) processada(s)",
      readyImages: "Pronto: {count} imagem(ns)",
      reanalyze: "Analisar novamente",
      reset: "Redefinir",
      retryCollection: "Coletar imagens novamente",
      retryingImages: "Coletando imagens novamente...",
      retrying: "Coletando novamente...",
      scrollFound: "Rolando... ({current}/) - {count} encontrada(s)",
      scrollSearchImages: "Rolando a página para encontrar imagens...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "Validação concluída: {count} imagem(ns) válida(s)",
      validationError: "Ocorreu um erro durante a validação",
      validatingImages: "Validando imagens... {current}/{total}",
      validImageSearch: "Procurando imagens válidas...",
      viewerLaunch: "Iniciar visualizador de mangá",
      zoom: "Zoom: {percent}%",
    },
    bn: {
      autoChapterNavigation: "স্বয়ংক্রিয় অধ্যায় নেভিগেশন: {state}",
      chapterNext: "পরের অধ্যায়",
      chapterPrevious: "আগের অধ্যায়",
      clickNextChapter: "পরের অধ্যায়ে যেতে ক্লিক করুন",
      close: "বন্ধ করুন",
      collectionSystemStart: "ছবি সংগ্রহ ব্যবস্থা শুরু হচ্ছে...",
      controlPanelTitle: "মাঙ্গা ভিউয়ার",
      defaultLoadingImages: "ছবি লোড হচ্ছে...",
      endOfContents: "বিষয়বস্তু শেষ",
      errorOccurred: "একটি ত্রুটি ঘটেছে।",
      fastLoadedImages:
        "{count}টি আগে লোড হওয়া ছবি পাওয়া গেছে। দ্রুত চালু হচ্ছে...",
      foundTweetImages: "{count}টি টুইট ছবি পাওয়া গেছে। যাচাই হচ্ছে...",
      imageCollecting: "পেজের ছবি সংগ্রহ করা হচ্ছে...",
      imageCollected: "{count}টি ছবি সংগ্রহ করা হয়েছে...",
      imageSearch: "ছবি খোঁজা হচ্ছে...",
      initialImagesReady:
        "{count}টি ছবি সঙ্গে সঙ্গে যোগ করা হয়েছে। বাকি {remaining}টি যাচাই হচ্ছে...",
      launch: "ভিউয়ার চালু করুন",
      launchError: "ভিউয়ার চালু করার সময় ত্রুটি ঘটেছে: {message}",
      launchMenu: "বুক-স্টাইল মাঙ্গা ভিউয়ার চালু করুন",
      lastPage: "এটি শেষ পেজ",
      loadedImages: "{count}টি ছবি লোড হয়েছে। ভিউয়ার প্রস্তুত হচ্ছে...",
      loadedImagesReady:
        "{count}টি আগে লোড হওয়া ছবি নিশ্চিত হয়েছে। ভিউয়ার চালু হচ্ছে...",
      loadingImages: "ছবি প্রিলোড হচ্ছে... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "ছবি প্রিলোড হচ্ছে... {loaded}/{total} ({percent}%) - {errors}টি ত্রুটি",
      nextDynamicImages: "ডাইনামিকভাবে লোড হওয়া ছবির অপেক্ষা...",
      noImages: "কোনো ছবি পাওয়া যায়নি",
      noImagesDescription: "পেজ লোড শেষ হওয়ার আগেই ছবি সংগ্রহ চলেছে হতে পারে।",
      noImagesFound: "কোনো ছবি পাওয়া যায়নি",
      pageScan: "পেজ স্ক্যান হচ্ছে... ({current}/{total})",
      preloadComplete: "{total}টি ছবি প্রিলোড হয়েছে। ভিউয়ার চালু হচ্ছে...",
      preloadCompleteWithErrors:
        "{total}টির মধ্যে {loaded}টি ছবি প্রিলোড হয়েছে ({errors}টি ত্রুটি)। ভিউয়ার চালু হচ্ছে...",
      processingComplete: "সম্পন্ন: {count}টি ছবি প্রক্রিয়া হয়েছে",
      readyImages: "প্রস্তুত: {count}টি ছবি",
      reanalyze: "আবার বিশ্লেষণ করুন",
      reset: "রিসেট",
      retryCollection: "ছবি আবার সংগ্রহ করুন",
      retryingImages: "ছবি আবার সংগ্রহ হচ্ছে...",
      retrying: "আবার সংগ্রহ হচ্ছে...",
      scrollFound: "স্ক্রল হচ্ছে... ({current}/) - {count}টি পাওয়া গেছে",
      scrollSearchImages: "ছবি খুঁজতে পেজ স্ক্রল হচ্ছে...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "যাচাই সম্পন্ন: {count}টি বৈধ ছবি",
      validationError: "যাচাইয়ের সময় ত্রুটি ঘটেছে",
      validatingImages: "ছবি যাচাই হচ্ছে... {current}/{total}",
      validImageSearch: "বৈধ ছবি খোঁজা হচ্ছে...",
      viewerLaunch: "মাঙ্গা ভিউয়ার চালু করুন",
      zoom: "জুম: {percent}%",
    },
    ru: {
      autoChapterNavigation: "Автопереход по главам: {state}",
      chapterNext: "Следующая глава",
      chapterPrevious: "Предыдущая глава",
      clickNextChapter: "Нажмите, чтобы перейти к следующей главе",
      close: "Закрыть",
      collectionSystemStart: "Запуск системы сбора изображений...",
      controlPanelTitle: "Просмотр манги",
      defaultLoadingImages: "Загрузка изображений...",
      endOfContents: "Конец содержимого",
      errorOccurred: "Произошла ошибка.",
      fastLoadedImages:
        "Обнаружено уже загруженных изображений: {count}. Быстрый запуск...",
      foundTweetImages: "Найдено изображений из твитов: {count}. Проверка...",
      imageCollecting: "Сбор изображений на странице...",
      imageCollected: "Собрано изображений: {count}...",
      imageSearch: "Поиск изображений...",
      initialImagesReady:
        "Сразу добавлено изображений: {count}. Проверка оставшихся: {remaining}...",
      launch: "Запустить просмотр",
      launchError: "Ошибка при запуске просмотра: {message}",
      launchMenu: "Запустить просмотр манги в книжном стиле",
      lastPage: "Это последняя страница",
      loadedImages: "Загружено изображений: {count}. Подготовка просмотра...",
      loadedImagesReady:
        "Подтверждено уже загруженных изображений: {count}. Запуск просмотра...",
      loadingImages:
        "Предзагрузка изображений... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "Предзагрузка изображений... {loaded}/{total} ({percent}%) - ошибок: {errors}",
      nextDynamicImages: "Ожидание динамически загружаемых изображений...",
      noImages: "Изображения не найдены",
      noImagesDescription:
        "Сбор изображений мог выполниться до завершения загрузки страницы.",
      noImagesFound: "Изображения не найдены",
      pageScan: "Сканирование страницы... ({current}/{total})",
      preloadComplete:
        "Предзагружено изображений: {total}. Запуск просмотра...",
      preloadCompleteWithErrors:
        "Предзагружено {loaded} из {total} изображений (ошибок: {errors}). Запуск просмотра...",
      processingComplete: "Готово: обработано изображений: {count}",
      readyImages: "Готово: изображений {count}",
      reanalyze: "Анализировать снова",
      reset: "Сбросить",
      retryCollection: "Собрать изображения снова",
      retryingImages: "Повторный сбор изображений...",
      retrying: "Повторный сбор...",
      scrollFound: "Прокрутка... ({current}/) - найдено {count}",
      scrollSearchImages: "Прокрутка страницы для поиска изображений...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "Проверка завершена: валидных изображений {count}",
      validationError: "Во время проверки произошла ошибка",
      validatingImages: "Проверка изображений... {current}/{total}",
      validImageSearch: "Поиск валидных изображений...",
      viewerLaunch: "Запустить просмотр манги",
      zoom: "Масштаб: {percent}%",
    },
    ur: {
      autoChapterNavigation: "خودکار باب نیویگیشن: {state}",
      chapterNext: "اگلا باب",
      chapterPrevious: "پچھلا باب",
      clickNextChapter: "اگلے باب پر جانے کے لیے کلک کریں",
      close: "بند کریں",
      collectionSystemStart: "تصویر جمع کرنے کا نظام شروع ہو رہا ہے...",
      controlPanelTitle: "مانگا ویور",
      defaultLoadingImages: "تصاویر لوڈ ہو رہی ہیں...",
      endOfContents: "مواد ختم",
      errorOccurred: "ایک خرابی ہوئی۔",
      fastLoadedImages:
        "{count} پہلے سے لوڈ تصاویر ملیں۔ تیزی سے شروع ہو رہا ہے...",
      foundTweetImages: "{count} ٹویٹ تصاویر ملیں۔ توثیق ہو رہی ہے...",
      imageCollecting: "صفحے کی تصاویر جمع ہو رہی ہیں...",
      imageCollected: "{count} تصاویر جمع ہو گئیں...",
      imageSearch: "تصاویر تلاش ہو رہی ہیں...",
      initialImagesReady:
        "{count} تصاویر فوری شامل ہو گئیں۔ باقی {remaining} کی توثیق ہو رہی ہے...",
      launch: "ویور شروع کریں",
      launchError: "ویور شروع کرتے وقت خرابی ہوئی: {message}",
      launchMenu: "بک اسٹائل مانگا ویور شروع کریں",
      lastPage: "یہ آخری صفحہ ہے",
      loadedImages: "{count} تصاویر لوڈ ہو گئیں۔ ویور تیار ہو رہا ہے...",
      loadedImagesReady:
        "{count} پہلے سے لوڈ تصاویر کی تصدیق ہو گئی۔ ویور شروع ہو رہا ہے...",
      loadingImages:
        "تصاویر پری لوڈ ہو رہی ہیں... {loaded}/{total} ({percent}%)",
      loadingImagesWithErrors:
        "تصاویر پری لوڈ ہو رہی ہیں... {loaded}/{total} ({percent}%) - {errors} خرابیاں",
      nextDynamicImages: "ڈائنامک طور پر لوڈ ہونے والی تصاویر کا انتظار...",
      noImages: "تصاویر نہیں ملیں",
      noImagesDescription:
        "ممکن ہے تصویر جمع کرنا صفحہ مکمل لوڈ ہونے سے پہلے چل گیا ہو۔",
      noImagesFound: "کوئی تصویر نہیں ملی",
      pageScan: "صفحہ اسکین ہو رہا ہے... ({current}/{total})",
      preloadComplete: "{total} تصاویر پری لوڈ ہو گئیں۔ ویور شروع ہو رہا ہے...",
      preloadCompleteWithErrors:
        "{total} میں سے {loaded} تصاویر پری لوڈ ہوئیں ({errors} خرابیاں)۔ ویور شروع ہو رہا ہے...",
      processingComplete: "مکمل: {count} تصاویر پروسیس ہوئیں",
      readyImages: "تیار: {count} تصاویر",
      reanalyze: "دوبارہ تجزیہ کریں",
      reset: "ری سیٹ",
      retryCollection: "تصاویر دوبارہ جمع کریں",
      retryingImages: "تصاویر دوبارہ جمع ہو رہی ہیں...",
      retrying: "دوبارہ جمع ہو رہا ہے...",
      scrollFound: "اسکرول ہو رہا ہے... ({current}/) - {count} ملیں",
      scrollSearchImages: "تصاویر تلاش کرنے کے لیے صفحہ اسکرول ہو رہا ہے...",
      stateOff: "OFF",
      stateOn: "ON",
      validationComplete: "توثیق مکمل: {count} درست تصاویر",
      validationError: "توثیق کے دوران خرابی ہوئی",
      validatingImages: "تصاویر کی توثیق ہو رہی ہے... {current}/{total}",
      validImageSearch: "درست تصاویر تلاش ہو رہی ہیں...",
      viewerLaunch: "مانگا ویور شروع کریں",
      zoom: "زوم: {percent}%",
    },
  },
  "en",
);

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
