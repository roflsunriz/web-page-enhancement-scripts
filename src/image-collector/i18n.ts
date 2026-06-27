import {
  buildSupportedTranslationMap,
  createI18n,
  type LocaleCode,
} from "@/shared/i18n";

type TranslationKey =
  | "collectComplete"
  | "collectStart"
  | "collectUnexpectedError"
  | "classifiedImages"
  | "download"
  | "externalImagesValidating"
  | "failedImagesInZip"
  | "fullscreenOriginal"
  | "imageLoadFailed"
  | "imageReady"
  | "loadImage"
  | "menuLaunch"
  | "noDownloadableImages"
  | "noImagesFound"
  | "noImagesForZip"
  | "progress"
  | "reliableImagesProcessing"
  | "retry"
  | "size"
  | "testModeOneImage"
  | "zipDownloadStarted"
  | "zipEmpty"
  | "zipGenerateFailed"
  | "zipGenerating"
  | "zipLibraryUnavailable"
  | "zipManyImagesSplit"
  | "zipNoPrepared"
  | "zipPartStarted"
  | "zipPrepareComplete"
  | "zipPrepareFailed"
  | "zipPrepareStart"
  | "zipProcessing"
  | "zipReadyCount"
  | "zipSplitStarted"
  | "zipTestMode";

const translations = buildSupportedTranslationMap(
  {
    ja: {
      collectComplete:
        "{total}枚の画像を収集しました！(高速:{fast}, 通常:{normal})",
      collectStart: "画像収集を開始します...",
      collectUnexpectedError: "画像収集中に予期しないエラーが発生しました",
      classifiedImages: "画像を分類しました: 高速={fast}, 通常={normal}",
      download: "ダウンロード",
      externalImagesValidating: "外部画像を検証中...",
      failedImagesInZip: "{count}枚の画像をZIPに含められませんでした",
      fullscreenOriginal: "元ページを開く",
      imageLoadFailed: "画像の読み込みに失敗しました",
      imageReady: "{processed}/{total} 画像が準備されました",
      loadImage: "画像を読み込む",
      menuLaunch: "🚀起動",
      noDownloadableImages: "ダウンロードできる画像がありません",
      noImagesFound: "処理対象の画像が見つかりませんでした",
      noImagesForZip: "ZIPに追加できる画像がありませんでした",
      progress: "進捗: {percent}%",
      reliableImagesProcessing: "信頼できる画像を高速処理中...",
      retry: "再試行",
      size: "サイズ: {width}x{height} ({size})",
      testModeOneImage: "テストモード: 1枚だけZIPに追加します",
      zipDownloadStarted: "ZIPファイルのダウンロードが開始されました",
      zipEmpty: "ZIPファイルに画像が含まれていません",
      zipGenerateFailed: "ZIPファイルの生成に失敗しました",
      zipGenerating: "ZIPファイルを生成しています...",
      zipLibraryUnavailable:
        "ZIPライブラリが読み込まれていないため、ダウンロードできません",
      zipManyImagesSplit: "画像が多いため、{count}個のZIPファイルに分割します",
      zipNoPrepared: "ZIPファイルが準備されていません。再度準備します...",
      zipPartStarted:
        "パート{part}/{total}のダウンロードが開始されました。次のパートを準備中...",
      zipPrepareComplete:
        "ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",
      zipPrepareFailed: "ZIPファイルの準備に失敗しました",
      zipPrepareStart: "ZIPファイルの準備を開始します...",
      zipProcessing: "現在処理中です。しばらくお待ちください...",
      zipReadyCount: "{processed}/{total} 画像が準備されました",
      zipSplitStarted: "全{count}個のZIPファイルのダウンロードを開始しました",
      zipTestMode: "テストモード: 単一画像のみでZIPを生成します",
    },
    en: {
      collectComplete:
        "Collected {total} image(s)! (fast: {fast}, normal: {normal})",
      collectStart: "Starting image collection...",
      collectUnexpectedError:
        "An unexpected error occurred while collecting images",
      classifiedImages: "Classified images: fast={fast}, normal={normal}",
      download: "Download",
      externalImagesValidating: "Validating external images...",
      failedImagesInZip: "{count} image(s) could not be included in the ZIP",
      fullscreenOriginal: "Open source page",
      imageLoadFailed: "Failed to load the image",
      imageReady: "{processed}/{total} image(s) are ready",
      loadImage: "Load image",
      menuLaunch: "🚀 Launch",
      noDownloadableImages: "There are no downloadable images",
      noImagesFound: "No target images were found",
      noImagesForZip: "No images could be added to the ZIP",
      progress: "Progress: {percent}%",
      reliableImagesProcessing: "Fast-processing trusted images...",
      retry: "Retry",
      size: "Size: {width}x{height} ({size})",
      testModeOneImage: "Test mode: adding only one image to the ZIP",
      zipDownloadStarted: "ZIP download has started",
      zipEmpty: "The ZIP file contains no images",
      zipGenerateFailed: "Failed to generate the ZIP file",
      zipGenerating: "Generating ZIP file...",
      zipLibraryUnavailable:
        "The ZIP library is not loaded, so the download cannot continue",
      zipManyImagesSplit: "Too many images; splitting into {count} ZIP files",
      zipNoPrepared: "The ZIP file is not prepared. Preparing it again...",
      zipPartStarted:
        "Part {part}/{total} download has started. Preparing the next part...",
      zipPrepareComplete:
        "ZIP preparation is complete. Click the button to download.",
      zipPrepareFailed: "Failed to prepare the ZIP file",
      zipPrepareStart: "Starting ZIP preparation...",
      zipProcessing: "Processing now. Please wait...",
      zipReadyCount: "{processed}/{total} image(s) are ready",
      zipSplitStarted: "Started downloading all {count} ZIP files",
      zipTestMode: "Test mode: generating a ZIP with only one image",
    },
    "zh-Hans": {
      collectComplete:
        "已收集 {total} 张图片！（快速：{fast}，普通：{normal}）",
      collectStart: "开始收集图片...",
      collectUnexpectedError: "收集图片时发生意外错误",
      classifiedImages: "图片已分类：快速={fast}，普通={normal}",
      download: "下载",
      externalImagesValidating: "正在验证外部图片...",
      failedImagesInZip: "{count} 张图片无法加入 ZIP",
      fullscreenOriginal: "打开来源页面",
      imageLoadFailed: "图片加载失败",
      imageReady: "{processed}/{total} 张图片已准备好",
      loadImage: "加载图片",
      menuLaunch: "🚀 启动",
      noDownloadableImages: "没有可下载的图片",
      noImagesFound: "未找到处理目标图片",
      noImagesForZip: "没有可加入 ZIP 的图片",
      progress: "进度：{percent}%",
      reliableImagesProcessing: "正在快速处理可信图片...",
      retry: "重试",
      size: "尺寸：{width}x{height} ({size})",
      testModeOneImage: "测试模式：仅向 ZIP 添加一张图片",
      zipDownloadStarted: "ZIP 文件下载已开始",
      zipEmpty: "ZIP 文件中没有图片",
      zipGenerateFailed: "ZIP 文件生成失败",
      zipGenerating: "正在生成 ZIP 文件...",
      zipLibraryUnavailable: "ZIP 库未加载，无法继续下载",
      zipManyImagesSplit: "图片过多，将拆分为 {count} 个 ZIP 文件",
      zipNoPrepared: "ZIP 文件尚未准备好。正在重新准备...",
      zipPartStarted: "第 {part}/{total} 部分下载已开始。正在准备下一部分...",
      zipPrepareComplete: "ZIP 文件准备完成。点击按钮下载。",
      zipPrepareFailed: "ZIP 文件准备失败",
      zipPrepareStart: "开始准备 ZIP 文件...",
      zipProcessing: "正在处理。请稍候...",
      zipReadyCount: "{processed}/{total} 张图片已准备好",
      zipSplitStarted: "已开始下载全部 {count} 个 ZIP 文件",
      zipTestMode: "测试模式：仅用一张图片生成 ZIP",
    },
    hi: {
      collectComplete:
        "{total} छवियां एकत्र की गईं! (तेज: {fast}, सामान्य: {normal})",
      collectStart: "छवि संग्रह शुरू किया जा रहा है...",
      collectUnexpectedError: "छवियां एकत्र करते समय अनपेक्षित त्रुटि हुई",
      classifiedImages: "छवियां वर्गीकृत: तेज={fast}, सामान्य={normal}",
      download: "डाउनलोड",
      externalImagesValidating: "बाहरी छवियों की जांच हो रही है...",
      failedImagesInZip: "{count} छवियां ZIP में शामिल नहीं की जा सकीं",
      fullscreenOriginal: "स्रोत पेज खोलें",
      imageLoadFailed: "छवि लोड करने में विफल",
      imageReady: "{processed}/{total} छवियां तैयार हैं",
      loadImage: "छवि लोड करें",
      menuLaunch: "🚀 शुरू करें",
      noDownloadableImages: "डाउनलोड योग्य छवियां नहीं हैं",
      noImagesFound: "लक्षित छवियां नहीं मिलीं",
      noImagesForZip: "ZIP में जोड़ने योग्य छवियां नहीं मिलीं",
      progress: "प्रगति: {percent}%",
      reliableImagesProcessing:
        "विश्वसनीय छवियों को तेज़ी से संसाधित किया जा रहा है...",
      retry: "फिर कोशिश करें",
      size: "आकार: {width}x{height} ({size})",
      testModeOneImage: "टेस्ट मोड: ZIP में केवल एक छवि जोड़ी जाएगी",
      zipDownloadStarted: "ZIP डाउनलोड शुरू हो गया है",
      zipEmpty: "ZIP फ़ाइल में कोई छवि नहीं है",
      zipGenerateFailed: "ZIP फ़ाइल बनाने में विफल",
      zipGenerating: "ZIP फ़ाइल बनाई जा रही है...",
      zipLibraryUnavailable:
        "ZIP लाइब्रेरी लोड नहीं है, इसलिए डाउनलोड जारी नहीं रह सकता",
      zipManyImagesSplit:
        "छवियां बहुत अधिक हैं; {count} ZIP फ़ाइलों में बांटा जाएगा",
      zipNoPrepared: "ZIP फ़ाइल तैयार नहीं है। फिर से तैयार किया जा रहा है...",
      zipPartStarted:
        "भाग {part}/{total} का डाउनलोड शुरू हुआ। अगला भाग तैयार हो रहा है...",
      zipPrepareComplete:
        "ZIP तैयारी पूरी हुई। डाउनलोड करने के लिए बटन क्लिक करें।",
      zipPrepareFailed: "ZIP फ़ाइल तैयार करने में विफल",
      zipPrepareStart: "ZIP तैयारी शुरू हो रही है...",
      zipProcessing: "अभी संसाधित हो रहा है। कृपया प्रतीक्षा करें...",
      zipReadyCount: "{processed}/{total} छवियां तैयार हैं",
      zipSplitStarted: "सभी {count} ZIP फ़ाइलों का डाउनलोड शुरू हुआ",
      zipTestMode: "टेस्ट मोड: केवल एक छवि से ZIP बनाया जाएगा",
    },
    es: {
      collectComplete:
        "Se recopilaron {total} imagen(es). (rápidas: {fast}, normales: {normal})",
      collectStart: "Iniciando recopilación de imágenes...",
      collectUnexpectedError:
        "Ocurrió un error inesperado al recopilar imágenes",
      classifiedImages:
        "Imágenes clasificadas: rápidas={fast}, normales={normal}",
      download: "Descargar",
      externalImagesValidating: "Validando imágenes externas...",
      failedImagesInZip: "{count} imagen(es) no pudieron incluirse en el ZIP",
      fullscreenOriginal: "Abrir página de origen",
      imageLoadFailed: "No se pudo cargar la imagen",
      imageReady: "{processed}/{total} imagen(es) listas",
      loadImage: "Cargar imagen",
      menuLaunch: "🚀 Iniciar",
      noDownloadableImages: "No hay imágenes descargables",
      noImagesFound: "No se encontraron imágenes objetivo",
      noImagesForZip: "No hay imágenes para agregar al ZIP",
      progress: "Progreso: {percent}%",
      reliableImagesProcessing: "Procesando rápidamente imágenes confiables...",
      retry: "Reintentar",
      size: "Tamaño: {width}x{height} ({size})",
      testModeOneImage: "Modo de prueba: se agregará solo una imagen al ZIP",
      zipDownloadStarted: "La descarga del ZIP ha comenzado",
      zipEmpty: "El archivo ZIP no contiene imágenes",
      zipGenerateFailed: "No se pudo generar el archivo ZIP",
      zipGenerating: "Generando archivo ZIP...",
      zipLibraryUnavailable:
        "La biblioteca ZIP no está cargada, por lo que la descarga no puede continuar",
      zipManyImagesSplit:
        "Hay demasiadas imágenes; se dividirán en {count} archivos ZIP",
      zipNoPrepared:
        "El archivo ZIP no está preparado. Preparándolo de nuevo...",
      zipPartStarted:
        "La descarga de la parte {part}/{total} comenzó. Preparando la siguiente parte...",
      zipPrepareComplete:
        "La preparación del ZIP se completó. Haz clic en el botón para descargar.",
      zipPrepareFailed: "No se pudo preparar el archivo ZIP",
      zipPrepareStart: "Iniciando preparación del ZIP...",
      zipProcessing: "Procesando ahora. Espera un momento...",
      zipReadyCount: "{processed}/{total} imagen(es) listas",
      zipSplitStarted: "Se inició la descarga de los {count} archivos ZIP",
      zipTestMode: "Modo de prueba: se generará un ZIP con una sola imagen",
    },
    fr: {
      collectComplete:
        "{total} image(s) collectée(s) ! (rapides : {fast}, normales : {normal})",
      collectStart: "Démarrage de la collecte d'images...",
      collectUnexpectedError:
        "Une erreur inattendue s'est produite pendant la collecte des images",
      classifiedImages: "Images classées : rapides={fast}, normales={normal}",
      download: "Télécharger",
      externalImagesValidating: "Validation des images externes...",
      failedImagesInZip:
        "{count} image(s) n'ont pas pu être incluses dans le ZIP",
      fullscreenOriginal: "Ouvrir la page source",
      imageLoadFailed: "Échec du chargement de l'image",
      imageReady: "{processed}/{total} image(s) prêtes",
      loadImage: "Charger l'image",
      menuLaunch: "🚀 Lancer",
      noDownloadableImages: "Aucune image téléchargeable",
      noImagesFound: "Aucune image cible trouvée",
      noImagesForZip: "Aucune image ne peut être ajoutée au ZIP",
      progress: "Progression : {percent}%",
      reliableImagesProcessing:
        "Traitement rapide des images fiables en cours...",
      retry: "Réessayer",
      size: "Taille : {width}x{height} ({size})",
      testModeOneImage: "Mode test : une seule image sera ajoutée au ZIP",
      zipDownloadStarted: "Le téléchargement du ZIP a commencé",
      zipEmpty: "Le fichier ZIP ne contient aucune image",
      zipGenerateFailed: "Échec de la génération du fichier ZIP",
      zipGenerating: "Génération du fichier ZIP...",
      zipLibraryUnavailable:
        "La bibliothèque ZIP n'est pas chargée, le téléchargement ne peut pas continuer",
      zipManyImagesSplit: "Trop d'images ; division en {count} fichiers ZIP",
      zipNoPrepared: "Le fichier ZIP n'est pas prêt. Nouvelle préparation...",
      zipPartStarted:
        "Le téléchargement de la partie {part}/{total} a commencé. Préparation de la suivante...",
      zipPrepareComplete:
        "La préparation du ZIP est terminée. Cliquez sur le bouton pour télécharger.",
      zipPrepareFailed: "Échec de la préparation du fichier ZIP",
      zipPrepareStart: "Démarrage de la préparation du ZIP...",
      zipProcessing: "Traitement en cours. Veuillez patienter...",
      zipReadyCount: "{processed}/{total} image(s) prêtes",
      zipSplitStarted: "Téléchargement des {count} fichiers ZIP lancé",
      zipTestMode: "Mode test : génération d'un ZIP avec une seule image",
    },
    ar: {
      collectComplete: "تم جمع {total} صورة! (سريع: {fast}، عادي: {normal})",
      collectStart: "بدء جمع الصور...",
      collectUnexpectedError: "حدث خطأ غير متوقع أثناء جمع الصور",
      classifiedImages: "تم تصنيف الصور: سريع={fast}، عادي={normal}",
      download: "تنزيل",
      externalImagesValidating: "جار التحقق من الصور الخارجية...",
      failedImagesInZip: "تعذر تضمين {count} صورة في ملف ZIP",
      fullscreenOriginal: "فتح صفحة المصدر",
      imageLoadFailed: "فشل تحميل الصورة",
      imageReady: "{processed}/{total} صورة جاهزة",
      loadImage: "تحميل الصورة",
      menuLaunch: "🚀 تشغيل",
      noDownloadableImages: "لا توجد صور قابلة للتنزيل",
      noImagesFound: "لم يتم العثور على صور مستهدفة",
      noImagesForZip: "لا توجد صور يمكن إضافتها إلى ZIP",
      progress: "التقدم: {percent}%",
      reliableImagesProcessing: "جار المعالجة السريعة للصور الموثوقة...",
      retry: "إعادة المحاولة",
      size: "الحجم: {width}x{height} ({size})",
      testModeOneImage: "وضع الاختبار: إضافة صورة واحدة فقط إلى ZIP",
      zipDownloadStarted: "بدأ تنزيل ملف ZIP",
      zipEmpty: "ملف ZIP لا يحتوي على صور",
      zipGenerateFailed: "فشل إنشاء ملف ZIP",
      zipGenerating: "جار إنشاء ملف ZIP...",
      zipLibraryUnavailable:
        "لم يتم تحميل مكتبة ZIP، لذلك لا يمكن متابعة التنزيل",
      zipManyImagesSplit: "عدد الصور كبير؛ سيتم التقسيم إلى {count} ملفات ZIP",
      zipNoPrepared: "ملف ZIP غير جاهز. جار تجهيزه مرة أخرى...",
      zipPartStarted:
        "بدأ تنزيل الجزء {part}/{total}. جار تجهيز الجزء التالي...",
      zipPrepareComplete: "اكتمل تجهيز ZIP. انقر الزر للتنزيل.",
      zipPrepareFailed: "فشل تجهيز ملف ZIP",
      zipPrepareStart: "بدء تجهيز ملف ZIP...",
      zipProcessing: "جار المعالجة الآن. يرجى الانتظار...",
      zipReadyCount: "{processed}/{total} صورة جاهزة",
      zipSplitStarted: "بدأ تنزيل جميع ملفات ZIP وعددها {count}",
      zipTestMode: "وضع الاختبار: إنشاء ZIP بصورة واحدة فقط",
    },
    pt: {
      collectComplete:
        "{total} imagem(ns) coletada(s)! (rápidas: {fast}, normais: {normal})",
      collectStart: "Iniciando coleta de imagens...",
      collectUnexpectedError: "Ocorreu um erro inesperado ao coletar imagens",
      classifiedImages:
        "Imagens classificadas: rápidas={fast}, normais={normal}",
      download: "Baixar",
      externalImagesValidating: "Validando imagens externas...",
      failedImagesInZip: "{count} imagem(ns) não puderam ser incluídas no ZIP",
      fullscreenOriginal: "Abrir página de origem",
      imageLoadFailed: "Falha ao carregar a imagem",
      imageReady: "{processed}/{total} imagem(ns) prontas",
      loadImage: "Carregar imagem",
      menuLaunch: "🚀 Iniciar",
      noDownloadableImages: "Não há imagens para baixar",
      noImagesFound: "Nenhuma imagem alvo foi encontrada",
      noImagesForZip: "Nenhuma imagem pôde ser adicionada ao ZIP",
      progress: "Progresso: {percent}%",
      reliableImagesProcessing: "Processando rapidamente imagens confiáveis...",
      retry: "Tentar novamente",
      size: "Tamanho: {width}x{height} ({size})",
      testModeOneImage: "Modo de teste: adicionando apenas uma imagem ao ZIP",
      zipDownloadStarted: "O download do ZIP começou",
      zipEmpty: "O arquivo ZIP não contém imagens",
      zipGenerateFailed: "Falha ao gerar o arquivo ZIP",
      zipGenerating: "Gerando arquivo ZIP...",
      zipLibraryUnavailable:
        "A biblioteca ZIP não foi carregada, então o download não pode continuar",
      zipManyImagesSplit:
        "Há muitas imagens; dividindo em {count} arquivos ZIP",
      zipNoPrepared:
        "O arquivo ZIP não está preparado. Preparando novamente...",
      zipPartStarted:
        "O download da parte {part}/{total} começou. Preparando a próxima parte...",
      zipPrepareComplete:
        "A preparação do ZIP foi concluída. Clique no botão para baixar.",
      zipPrepareFailed: "Falha ao preparar o arquivo ZIP",
      zipPrepareStart: "Iniciando preparação do ZIP...",
      zipProcessing: "Processando agora. Aguarde...",
      zipReadyCount: "{processed}/{total} imagem(ns) prontas",
      zipSplitStarted: "Download de todos os {count} arquivos ZIP iniciado",
      zipTestMode: "Modo de teste: gerando um ZIP com apenas uma imagem",
    },
    bn: {
      collectComplete:
        "{total}টি ছবি সংগ্রহ করা হয়েছে! (দ্রুত: {fast}, সাধারণ: {normal})",
      collectStart: "ছবি সংগ্রহ শুরু হচ্ছে...",
      collectUnexpectedError: "ছবি সংগ্রহের সময় অপ্রত্যাশিত ত্রুটি ঘটেছে",
      classifiedImages: "ছবি শ্রেণিবদ্ধ হয়েছে: দ্রুত={fast}, সাধারণ={normal}",
      download: "ডাউনলোড",
      externalImagesValidating: "বাহ্যিক ছবি যাচাই করা হচ্ছে...",
      failedImagesInZip: "{count}টি ছবি ZIP-এ রাখা যায়নি",
      fullscreenOriginal: "উৎস পেজ খুলুন",
      imageLoadFailed: "ছবি লোড করতে ব্যর্থ",
      imageReady: "{processed}/{total}টি ছবি প্রস্তুত",
      loadImage: "ছবি লোড করুন",
      menuLaunch: "🚀 চালু করুন",
      noDownloadableImages: "ডাউনলোডযোগ্য ছবি নেই",
      noImagesFound: "লক্ষ্য ছবি পাওয়া যায়নি",
      noImagesForZip: "ZIP-এ যোগ করার মতো ছবি নেই",
      progress: "অগ্রগতি: {percent}%",
      reliableImagesProcessing: "বিশ্বস্ত ছবি দ্রুত প্রক্রিয়া করা হচ্ছে...",
      retry: "আবার চেষ্টা করুন",
      size: "আকার: {width}x{height} ({size})",
      testModeOneImage: "টেস্ট মোড: ZIP-এ শুধু একটি ছবি যোগ করা হবে",
      zipDownloadStarted: "ZIP ডাউনলোড শুরু হয়েছে",
      zipEmpty: "ZIP ফাইলে কোনো ছবি নেই",
      zipGenerateFailed: "ZIP ফাইল তৈরি করতে ব্যর্থ",
      zipGenerating: "ZIP ফাইল তৈরি হচ্ছে...",
      zipLibraryUnavailable:
        "ZIP লাইব্রেরি লোড হয়নি, তাই ডাউনলোড চলতে পারবে না",
      zipManyImagesSplit: "ছবি বেশি; {count}টি ZIP ফাইলে ভাগ করা হচ্ছে",
      zipNoPrepared: "ZIP ফাইল প্রস্তুত নয়। আবার প্রস্তুত করা হচ্ছে...",
      zipPartStarted:
        "পার্ট {part}/{total} ডাউনলোড শুরু হয়েছে। পরের পার্ট প্রস্তুত হচ্ছে...",
      zipPrepareComplete: "ZIP প্রস্তুতি শেষ। ডাউনলোড করতে বোতামে ক্লিক করুন।",
      zipPrepareFailed: "ZIP ফাইল প্রস্তুত করতে ব্যর্থ",
      zipPrepareStart: "ZIP প্রস্তুতি শুরু হচ্ছে...",
      zipProcessing: "এখন প্রক্রিয়াকরণ চলছে। অপেক্ষা করুন...",
      zipReadyCount: "{processed}/{total}টি ছবি প্রস্তুত",
      zipSplitStarted: "সব {count}টি ZIP ফাইলের ডাউনলোড শুরু হয়েছে",
      zipTestMode: "টেস্ট মোড: শুধু একটি ছবি দিয়ে ZIP তৈরি হচ্ছে",
    },
    ru: {
      collectComplete:
        "Собрано {total} изображений! (быстрые: {fast}, обычные: {normal})",
      collectStart: "Начинается сбор изображений...",
      collectUnexpectedError:
        "При сборе изображений произошла непредвиденная ошибка",
      classifiedImages:
        "Изображения классифицированы: быстрые={fast}, обычные={normal}",
      download: "Скачать",
      externalImagesValidating: "Проверка внешних изображений...",
      failedImagesInZip: "{count} изображений не удалось включить в ZIP",
      fullscreenOriginal: "Открыть исходную страницу",
      imageLoadFailed: "Не удалось загрузить изображение",
      imageReady: "Готово изображений: {processed}/{total}",
      loadImage: "Загрузить изображение",
      menuLaunch: "🚀 Запустить",
      noDownloadableImages: "Нет изображений для скачивания",
      noImagesFound: "Целевые изображения не найдены",
      noImagesForZip: "Нет изображений для добавления в ZIP",
      progress: "Прогресс: {percent}%",
      reliableImagesProcessing: "Быстрая обработка надежных изображений...",
      retry: "Повторить",
      size: "Размер: {width}x{height} ({size})",
      testModeOneImage:
        "Тестовый режим: в ZIP будет добавлено только одно изображение",
      zipDownloadStarted: "Загрузка ZIP началась",
      zipEmpty: "ZIP-файл не содержит изображений",
      zipGenerateFailed: "Не удалось создать ZIP-файл",
      zipGenerating: "Создание ZIP-файла...",
      zipLibraryUnavailable:
        "Библиотека ZIP не загружена, поэтому загрузку нельзя продолжить",
      zipManyImagesSplit:
        "Слишком много изображений; разделение на {count} ZIP-файлов",
      zipNoPrepared: "ZIP-файл не подготовлен. Подготовка заново...",
      zipPartStarted:
        "Загрузка части {part}/{total} началась. Подготовка следующей части...",
      zipPrepareComplete:
        "Подготовка ZIP завершена. Нажмите кнопку, чтобы скачать.",
      zipPrepareFailed: "Не удалось подготовить ZIP-файл",
      zipPrepareStart: "Начинается подготовка ZIP...",
      zipProcessing: "Идет обработка. Подождите...",
      zipReadyCount: "Готово изображений: {processed}/{total}",
      zipSplitStarted: "Начата загрузка всех ZIP-файлов: {count}",
      zipTestMode: "Тестовый режим: создание ZIP только с одним изображением",
    },
    ur: {
      collectComplete:
        "{total} تصاویر جمع ہو گئیں! (تیز: {fast}، عام: {normal})",
      collectStart: "تصاویر جمع کرنا شروع ہو رہا ہے...",
      collectUnexpectedError: "تصاویر جمع کرتے وقت غیر متوقع خرابی ہوئی",
      classifiedImages: "تصاویر کی درجہ بندی ہو گئی: تیز={fast}، عام={normal}",
      download: "ڈاؤن لوڈ",
      externalImagesValidating: "بیرونی تصاویر کی توثیق ہو رہی ہے...",
      failedImagesInZip: "{count} تصاویر ZIP میں شامل نہیں ہو سکیں",
      fullscreenOriginal: "ماخذ صفحہ کھولیں",
      imageLoadFailed: "تصویر لوڈ کرنے میں ناکامی",
      imageReady: "{processed}/{total} تصاویر تیار ہیں",
      loadImage: "تصویر لوڈ کریں",
      menuLaunch: "🚀 شروع کریں",
      noDownloadableImages: "ڈاؤن لوڈ کے قابل تصاویر نہیں ہیں",
      noImagesFound: "ہدف تصاویر نہیں ملیں",
      noImagesForZip: "ZIP میں شامل کرنے کے لیے تصاویر نہیں ہیں",
      progress: "پیش رفت: {percent}%",
      reliableImagesProcessing:
        "قابل اعتماد تصاویر تیزی سے پروسیس ہو رہی ہیں...",
      retry: "دوبارہ کوشش",
      size: "سائز: {width}x{height} ({size})",
      testModeOneImage: "ٹیسٹ موڈ: ZIP میں صرف ایک تصویر شامل کی جائے گی",
      zipDownloadStarted: "ZIP ڈاؤن لوڈ شروع ہو گیا ہے",
      zipEmpty: "ZIP فائل میں کوئی تصویر نہیں",
      zipGenerateFailed: "ZIP فائل بنانے میں ناکامی",
      zipGenerating: "ZIP فائل بن رہی ہے...",
      zipLibraryUnavailable:
        "ZIP لائبریری لوڈ نہیں ہے، اس لیے ڈاؤن لوڈ جاری نہیں رہ سکتا",
      zipManyImagesSplit:
        "تصاویر بہت زیادہ ہیں؛ {count} ZIP فائلوں میں تقسیم ہو رہی ہیں",
      zipNoPrepared: "ZIP فائل تیار نہیں۔ دوبارہ تیار کی جا رہی ہے...",
      zipPartStarted:
        "حصہ {part}/{total} کا ڈاؤن لوڈ شروع ہو گیا۔ اگلا حصہ تیار ہو رہا ہے...",
      zipPrepareComplete: "ZIP تیاری مکمل ہے۔ ڈاؤن لوڈ کے لیے بٹن پر کلک کریں۔",
      zipPrepareFailed: "ZIP فائل تیار کرنے میں ناکامی",
      zipPrepareStart: "ZIP تیاری شروع ہو رہی ہے...",
      zipProcessing: "ابھی پروسیسنگ جاری ہے۔ براہ کرم انتظار کریں...",
      zipReadyCount: "{processed}/{total} تصاویر تیار ہیں",
      zipSplitStarted: "تمام {count} ZIP فائلوں کا ڈاؤن لوڈ شروع ہو گیا",
      zipTestMode: "ٹیسٹ موڈ: صرف ایک تصویر کے ساتھ ZIP بنایا جا رہا ہے",
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
