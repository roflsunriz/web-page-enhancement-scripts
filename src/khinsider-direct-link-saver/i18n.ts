import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "close"
  | "concurrency"
  | "startSave"
  | "stop"
  | "idle"
  | "openPanel"
  | "fetchAndSave"
  | "noTrackLinks"
  | "noDirectAudio"
  | "htmlResponse"
  | "nonAudioRedirect"
  | "parsingStage"
  | "downloadStage"
  | "parsingProgress"
  | "stopped"
  | "parsingComplete"
  | "stopPending"
  | "noAudioLinks"
  | "downloading"
  | "downloadProgress"
  | "downloadStopped"
  | "downloadComplete";

const translations = {
  ja: {
    close: "閉じる",
    concurrency: "並列",
    startSave: "保存開始",
    stop: "停止",
    idle: "待機中",
    openPanel: "KHInsider音声保存パネルを開く",
    fetchAndSave: "KHInsider音声ファイルを取得して保存",
    noTrackLinks: "末尾が.mp3の曲ページリンクが見つかりません",
    noDirectAudio: "音声ファイルの直リンクが見つかりません",
    htmlResponse: "HTMLが返されたため音声ファイルとして保存できません",
    nonAudioRedirect:
      "音声ファイルURLではないレスポンスにリダイレクトされました",
    parsingStage: "解析",
    downloadStage: "ダウンロード",
    parsingProgress:
      "解析中: {completed}/{total} 保存対象 {done} 失敗 {failed} スキップ {skipped}",
    stopped: "停止しました",
    parsingComplete: "解析完了: {found}/{total}件の音声ファイルを見つけました",
    stopPending: "停止しました。進行中のリクエストは完了後に破棄されます",
    noAudioLinks: "保存対象の音声リンクがありません",
    downloading: "ダウンロード中: {completed}/{total}",
    downloadProgress:
      "ダウンロード中: {processed}/{total} 完了 {completed} 失敗 {failed}",
    downloadStopped: "ダウンロードを停止しました",
    downloadComplete: "ダウンロード完了: 完了 {completed} 失敗 {failed}",
  },
  en: {
    close: "Close",
    concurrency: "Concurrency",
    startSave: "Start saving",
    stop: "Stop",
    idle: "Idle",
    openPanel: "Open KHInsider audio saver panel",
    fetchAndSave: "Fetch and save KHInsider audio files",
    noTrackLinks: "No track page links ending in .mp3 were found",
    noDirectAudio: "No direct audio file link was found",
    htmlResponse: "HTML was returned, so it cannot be saved as an audio file",
    nonAudioRedirect: "Redirected to a response that is not an audio file URL",
    parsingStage: "Parsing",
    downloadStage: "Download",
    parsingProgress:
      "Parsing: {completed}/{total} targets {done} failed {failed} skipped {skipped}",
    stopped: "Stopped",
    parsingComplete: "Parsing complete: found {found}/{total} audio files",
    stopPending:
      "Stopped. In-flight requests will be discarded after they finish",
    noAudioLinks: "There are no audio links to save",
    downloading: "Downloading: {completed}/{total}",
    downloadProgress:
      "Downloading: {processed}/{total} complete {completed} failed {failed}",
    downloadStopped: "Download stopped",
    downloadComplete: "Download complete: complete {completed} failed {failed}",
  },
  "zh-Hans": {
    close: "关闭",
    concurrency: "并发",
    startSave: "开始保存",
    stop: "停止",
    idle: "待机中",
    openPanel: "打开 KHInsider 音频保存面板",
    fetchAndSave: "获取并保存 KHInsider 音频文件",
    noTrackLinks: "未找到以 .mp3 结尾的曲目页面链接",
    noDirectAudio: "未找到音频文件直链",
    htmlResponse: "返回的是 HTML，无法作为音频文件保存",
    nonAudioRedirect: "已重定向到不是音频文件 URL 的响应",
    parsingStage: "解析",
    downloadStage: "下载",
    parsingProgress:
      "解析中：{completed}/{total} 目标 {done} 失败 {failed} 跳过 {skipped}",
    stopped: "已停止",
    parsingComplete: "解析完成：找到 {found}/{total} 个音频文件",
    stopPending: "已停止。正在进行的请求完成后会被丢弃",
    noAudioLinks: "没有可保存的音频链接",
    downloading: "下载中：{completed}/{total}",
    downloadProgress:
      "下载中：{processed}/{total} 完成 {completed} 失败 {failed}",
    downloadStopped: "下载已停止",
    downloadComplete: "下载完成：完成 {completed} 失败 {failed}",
  },
  hi: {
    close: "बंद करें",
    concurrency: "समांतरता",
    startSave: "सहेजना शुरू करें",
    stop: "रोकें",
    idle: "निष्क्रिय",
    openPanel: "KHInsider ऑडियो सेवर पैनल खोलें",
    fetchAndSave: "KHInsider ऑडियो फाइलें लाएं और सहेजें",
    noTrackLinks: ".mp3 पर समाप्त होने वाले ट्रैक पेज लिंक नहीं मिले",
    noDirectAudio: "सीधा ऑडियो फाइल लिंक नहीं मिला",
    htmlResponse:
      "HTML मिला, इसलिए इसे ऑडियो फाइल के रूप में सहेजा नहीं जा सकता",
    nonAudioRedirect:
      "ऐसे रिस्पॉन्स पर रीडायरेक्ट हुआ जो ऑडियो फाइल URL नहीं है",
    parsingStage: "विश्लेषण",
    downloadStage: "डाउनलोड",
    parsingProgress:
      "विश्लेषण: {completed}/{total} लक्ष्य {done} विफल {failed} छोड़ा {skipped}",
    stopped: "रुक गया",
    parsingComplete: "विश्लेषण पूरा: {found}/{total} ऑडियो फाइलें मिलीं",
    stopPending: "रुक गया। चल रहे अनुरोध पूरे होने के बाद छोड़ दिए जाएंगे",
    noAudioLinks: "सहेजने के लिए कोई ऑडियो लिंक नहीं है",
    downloading: "डाउनलोड हो रहा है: {completed}/{total}",
    downloadProgress:
      "डाउनलोड: {processed}/{total} पूर्ण {completed} विफल {failed}",
    downloadStopped: "डाउनलोड रोक दिया गया",
    downloadComplete: "डाउनलोड पूरा: पूर्ण {completed} विफल {failed}",
  },
  es: {
    close: "Cerrar",
    concurrency: "Concurrencia",
    startSave: "Iniciar guardado",
    stop: "Detener",
    idle: "Inactivo",
    openPanel: "Abrir panel de guardado de audio de KHInsider",
    fetchAndSave: "Obtener y guardar archivos de audio de KHInsider",
    noTrackLinks: "No se encontraron enlaces de pistas que terminen en .mp3",
    noDirectAudio: "No se encontro un enlace directo al archivo de audio",
    htmlResponse: "Se devolvio HTML, por lo que no se puede guardar como audio",
    nonAudioRedirect: "Se redirigio a una respuesta que no es una URL de audio",
    parsingStage: "Analisis",
    downloadStage: "Descarga",
    parsingProgress:
      "Analizando: {completed}/{total} objetivos {done} fallidos {failed} omitidos {skipped}",
    stopped: "Detenido",
    parsingComplete:
      "Analisis completo: se encontraron {found}/{total} archivos de audio",
    stopPending:
      "Detenido. Las solicitudes en curso se descartaran al finalizar",
    noAudioLinks: "No hay enlaces de audio para guardar",
    downloading: "Descargando: {completed}/{total}",
    downloadProgress:
      "Descargando: {processed}/{total} completados {completed} fallidos {failed}",
    downloadStopped: "Descarga detenida",
    downloadComplete:
      "Descarga completa: completados {completed} fallidos {failed}",
  },
  fr: {
    close: "Fermer",
    concurrency: "Concurrence",
    startSave: "Demarrer l'enregistrement",
    stop: "Arreter",
    idle: "Inactif",
    openPanel: "Ouvrir le panneau d'enregistrement audio KHInsider",
    fetchAndSave: "Recuperer et enregistrer les fichiers audio KHInsider",
    noTrackLinks: "Aucun lien de piste se terminant par .mp3 n'a ete trouve",
    noDirectAudio: "Aucun lien direct vers un fichier audio n'a ete trouve",
    htmlResponse:
      "Une reponse HTML a ete renvoyee, elle ne peut pas etre enregistree comme audio",
    nonAudioRedirect:
      "Redirection vers une reponse qui n'est pas une URL de fichier audio",
    parsingStage: "Analyse",
    downloadStage: "Telechargement",
    parsingProgress:
      "Analyse : {completed}/{total} cibles {done} echecs {failed} ignores {skipped}",
    stopped: "Arrete",
    parsingComplete:
      "Analyse terminee : {found}/{total} fichiers audio trouves",
    stopPending: "Arrete. Les requetes en cours seront ignorees apres leur fin",
    noAudioLinks: "Aucun lien audio a enregistrer",
    downloading: "Telechargement : {completed}/{total}",
    downloadProgress:
      "Telechargement : {processed}/{total} termines {completed} echecs {failed}",
    downloadStopped: "Telechargement arrete",
    downloadComplete:
      "Telechargement termine : termines {completed} echecs {failed}",
  },
  ar: {
    close: "إغلاق",
    concurrency: "التوازي",
    startSave: "بدء الحفظ",
    stop: "إيقاف",
    idle: "خامل",
    openPanel: "فتح لوحة حفظ صوت KHInsider",
    fetchAndSave: "جلب ملفات صوت KHInsider وحفظها",
    noTrackLinks: "لم يتم العثور على روابط صفحات مقاطع تنتهي بـ .mp3",
    noDirectAudio: "لم يتم العثور على رابط مباشر لملف صوتي",
    htmlResponse: "تم إرجاع HTML، لذلك لا يمكن حفظه كملف صوتي",
    nonAudioRedirect: "تمت إعادة التوجيه إلى استجابة ليست عنوان URL لملف صوتي",
    parsingStage: "التحليل",
    downloadStage: "التنزيل",
    parsingProgress:
      "جار التحليل: {completed}/{total} أهداف {done} فشل {failed} تخطي {skipped}",
    stopped: "تم الإيقاف",
    parsingComplete: "اكتمل التحليل: تم العثور على {found}/{total} ملف صوتي",
    stopPending: "تم الإيقاف. سيتم تجاهل الطلبات الجارية بعد اكتمالها",
    noAudioLinks: "لا توجد روابط صوتية للحفظ",
    downloading: "جار التنزيل: {completed}/{total}",
    downloadProgress:
      "جار التنزيل: {processed}/{total} مكتمل {completed} فشل {failed}",
    downloadStopped: "تم إيقاف التنزيل",
    downloadComplete: "اكتمل التنزيل: مكتمل {completed} فشل {failed}",
  },
  pt: {
    close: "Fechar",
    concurrency: "Concorrencia",
    startSave: "Iniciar salvamento",
    stop: "Parar",
    idle: "Ocioso",
    openPanel: "Abrir painel de salvamento de audio do KHInsider",
    fetchAndSave: "Buscar e salvar arquivos de audio do KHInsider",
    noTrackLinks: "Nenhum link de faixa terminado em .mp3 foi encontrado",
    noDirectAudio: "Nenhum link direto de audio foi encontrado",
    htmlResponse: "HTML foi retornado, portanto nao pode ser salvo como audio",
    nonAudioRedirect:
      "Redirecionado para uma resposta que nao e uma URL de audio",
    parsingStage: "Analise",
    downloadStage: "Download",
    parsingProgress:
      "Analisando: {completed}/{total} alvos {done} falhas {failed} ignorados {skipped}",
    stopped: "Parado",
    parsingComplete:
      "Analise concluida: encontrados {found}/{total} arquivos de audio",
    stopPending:
      "Parado. Requisicoes em andamento serao descartadas ao terminar",
    noAudioLinks: "Nao ha links de audio para salvar",
    downloading: "Baixando: {completed}/{total}",
    downloadProgress:
      "Baixando: {processed}/{total} concluidos {completed} falhas {failed}",
    downloadStopped: "Download parado",
    downloadComplete:
      "Download concluido: concluidos {completed} falhas {failed}",
  },
  bn: {
    close: "বন্ধ",
    concurrency: "সমান্তরালতা",
    startSave: "সংরক্ষণ শুরু",
    stop: "থামান",
    idle: "নিষ্ক্রিয়",
    openPanel: "KHInsider অডিও সেভার প্যানেল খুলুন",
    fetchAndSave: "KHInsider অডিও ফাইল আনুন এবং সংরক্ষণ করুন",
    noTrackLinks: ".mp3 দিয়ে শেষ হওয়া ট্র্যাক পেজ লিংক পাওয়া যায়নি",
    noDirectAudio: "সরাসরি অডিও ফাইল লিংক পাওয়া যায়নি",
    htmlResponse: "HTML ফেরত এসেছে, তাই অডিও ফাইল হিসেবে সংরক্ষণ করা যাবে না",
    nonAudioRedirect: "অডিও ফাইল URL নয় এমন রেসপন্সে রিডাইরেক্ট হয়েছে",
    parsingStage: "বিশ্লেষণ",
    downloadStage: "ডাউনলোড",
    parsingProgress:
      "বিশ্লেষণ: {completed}/{total} লক্ষ্য {done} ব্যর্থ {failed} এড়ানো {skipped}",
    stopped: "থামানো হয়েছে",
    parsingComplete: "বিশ্লেষণ শেষ: {found}/{total} অডিও ফাইল পাওয়া গেছে",
    stopPending: "থামানো হয়েছে। চলমান অনুরোধ শেষ হলে বাতিল করা হবে",
    noAudioLinks: "সংরক্ষণের জন্য কোনো অডিও লিংক নেই",
    downloading: "ডাউনলোড হচ্ছে: {completed}/{total}",
    downloadProgress:
      "ডাউনলোড: {processed}/{total} সম্পন্ন {completed} ব্যর্থ {failed}",
    downloadStopped: "ডাউনলোড থামানো হয়েছে",
    downloadComplete: "ডাউনলোড শেষ: সম্পন্ন {completed} ব্যর্থ {failed}",
  },
  ru: {
    close: "Закрыть",
    concurrency: "Параллельность",
    startSave: "Начать сохранение",
    stop: "Остановить",
    idle: "Ожидание",
    openPanel: "Открыть панель сохранения аудио KHInsider",
    fetchAndSave: "Получить и сохранить аудиофайлы KHInsider",
    noTrackLinks:
      "Ссылки на страницы треков, оканчивающиеся на .mp3, не найдены",
    noDirectAudio: "Прямая ссылка на аудиофайл не найдена",
    htmlResponse: "Вернулся HTML, поэтому его нельзя сохранить как аудиофайл",
    nonAudioRedirect:
      "Произошло перенаправление на ответ, который не является URL аудиофайла",
    parsingStage: "Анализ",
    downloadStage: "Загрузка",
    parsingProgress:
      "Анализ: {completed}/{total} целей {done} ошибок {failed} пропущено {skipped}",
    stopped: "Остановлено",
    parsingComplete: "Анализ завершен: найдено {found}/{total} аудиофайлов",
    stopPending:
      "Остановлено. Текущие запросы будут отброшены после завершения",
    noAudioLinks: "Нет аудиоссылок для сохранения",
    downloading: "Загрузка: {completed}/{total}",
    downloadProgress:
      "Загрузка: {processed}/{total} завершено {completed} ошибок {failed}",
    downloadStopped: "Загрузка остановлена",
    downloadComplete:
      "Загрузка завершена: завершено {completed} ошибок {failed}",
  },
  ur: {
    close: "بند کریں",
    concurrency: "ہم وقتی",
    startSave: "محفوظ کرنا شروع کریں",
    stop: "روکیں",
    idle: "خالی",
    openPanel: "KHInsider آڈیو سیور پینل کھولیں",
    fetchAndSave: "KHInsider آڈیو فائلیں حاصل کرکے محفوظ کریں",
    noTrackLinks: ".mp3 پر ختم ہونے والے ٹریک صفحہ لنکس نہیں ملے",
    noDirectAudio: "براہ راست آڈیو فائل لنک نہیں ملا",
    htmlResponse:
      "HTML واپس آیا، اس لیے اسے آڈیو فائل کے طور پر محفوظ نہیں کیا جا سکتا",
    nonAudioRedirect: "ایسے جواب پر ری ڈائریکٹ ہوا جو آڈیو فائل URL نہیں ہے",
    parsingStage: "تجزیہ",
    downloadStage: "ڈاؤن لوڈ",
    parsingProgress:
      "تجزیہ: {completed}/{total} اہداف {done} ناکام {failed} چھوڑے گئے {skipped}",
    stopped: "روک دیا گیا",
    parsingComplete: "تجزیہ مکمل: {found}/{total} آڈیو فائلیں ملیں",
    stopPending:
      "روک دیا گیا۔ جاری درخواستیں مکمل ہونے کے بعد رد کر دی جائیں گی",
    noAudioLinks: "محفوظ کرنے کے لیے کوئی آڈیو لنک نہیں",
    downloading: "ڈاؤن لوڈ ہو رہا ہے: {completed}/{total}",
    downloadProgress:
      "ڈاؤن لوڈ: {processed}/{total} مکمل {completed} ناکام {failed}",
    downloadStopped: "ڈاؤن لوڈ روک دیا گیا",
    downloadComplete: "ڈاؤن لوڈ مکمل: مکمل {completed} ناکام {failed}",
  },
} satisfies Record<LocaleCode, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const t = i18n.t;
export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
