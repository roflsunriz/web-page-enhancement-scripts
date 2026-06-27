import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "copy"
  | "copyDirectLink"
  | "notDirectLink"
  | "copySuccess"
  | "copyFailed";

const translations = {
  ja: {
    copy: "コピー",
    copyDirectLink: "ダイレクトリンクをコピー",
    notDirectLink: "直接リンクではありません（i.imgur.comのみ許可）",
    copySuccess: "メディア{index}のリンクをコピー:\n{url}",
    copyFailed: "クリップボードへのコピーに失敗しました",
  },
  en: {
    copy: "Copy",
    copyDirectLink: "Copy direct link",
    notDirectLink: "This is not a direct link. Only i.imgur.com is allowed.",
    copySuccess: "Copied media {index} link:\n{url}",
    copyFailed: "Failed to copy to clipboard.",
  },
  "zh-Hans": {
    copy: "复制",
    copyDirectLink: "复制直链",
    notDirectLink: "这不是直链。仅允许 i.imgur.com。",
    copySuccess: "已复制媒体 {index} 链接:\n{url}",
    copyFailed: "复制到剪贴板失败。",
  },
  hi: {
    copy: "कॉपी",
    copyDirectLink: "डायरेक्ट लिंक कॉपी करें",
    notDirectLink: "यह डायरेक्ट लिंक नहीं है। केवल i.imgur.com की अनुमति है।",
    copySuccess: "मीडिया {index} लिंक कॉपी किया गया:\n{url}",
    copyFailed: "क्लिपबोर्ड पर कॉपी नहीं हो सका।",
  },
  es: {
    copy: "Copiar",
    copyDirectLink: "Copiar enlace directo",
    notDirectLink: "No es un enlace directo. Solo se permite i.imgur.com.",
    copySuccess: "Enlace del medio {index} copiado:\n{url}",
    copyFailed: "No se pudo copiar al portapapeles.",
  },
  fr: {
    copy: "Copier",
    copyDirectLink: "Copier le lien direct",
    notDirectLink: "Ce n'est pas un lien direct. Seul i.imgur.com est autorise.",
    copySuccess: "Lien du media {index} copie:\n{url}",
    copyFailed: "Echec de la copie dans le presse-papiers.",
  },
  ar: {
    copy: "نسخ",
    copyDirectLink: "نسخ الرابط المباشر",
    notDirectLink: "هذا ليس رابطا مباشرا. يسمح فقط بـ i.imgur.com.",
    copySuccess: "تم نسخ رابط الوسائط {index}:\n{url}",
    copyFailed: "فشل النسخ إلى الحافظة.",
  },
  pt: {
    copy: "Copiar",
    copyDirectLink: "Copiar link direto",
    notDirectLink: "Este nao e um link direto. Apenas i.imgur.com e permitido.",
    copySuccess: "Link da midia {index} copiado:\n{url}",
    copyFailed: "Falha ao copiar para a area de transferencia.",
  },
  bn: {
    copy: "কপি",
    copyDirectLink: "সরাসরি লিঙ্ক কপি করুন",
    notDirectLink: "এটি সরাসরি লিঙ্ক নয়। শুধু i.imgur.com অনুমোদিত।",
    copySuccess: "মিডিয়া {index} লিঙ্ক কপি হয়েছে:\n{url}",
    copyFailed: "ক্লিপবোর্ডে কপি করা যায়নি।",
  },
  ru: {
    copy: "Копировать",
    copyDirectLink: "Копировать прямую ссылку",
    notDirectLink: "Это не прямая ссылка. Разрешен только i.imgur.com.",
    copySuccess: "Ссылка на медиа {index} скопирована:\n{url}",
    copyFailed: "Не удалось скопировать в буфер обмена.",
  },
  ur: {
    copy: "کاپی",
    copyDirectLink: "براہ راست لنک کاپی کریں",
    notDirectLink: "یہ براہ راست لنک نہیں ہے۔ صرف i.imgur.com کی اجازت ہے۔",
    copySuccess: "میڈیا {index} کا لنک کاپی ہو گیا:\n{url}",
    copyFailed: "کلپ بورڈ میں کاپی نہیں ہو سکا۔",
  },
} satisfies Record<LocaleCode, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
  aliases: {
    zh: "zh-Hans",
    "zh-cn": "zh-Hans",
    "zh-sg": "zh-Hans",
  },
});

i18n.setLocale(i18n.detectBrowserLocale());

export const t = i18n.t;
export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
