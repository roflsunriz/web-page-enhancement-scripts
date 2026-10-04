import { createSupportedI18n } from "@/shared/i18n";
type Key = "copy" | "copied" | "failed" | "manual" | "media";
const i18n = createSupportedI18n<Key, "en">({
  defaultLocale: "ja",
  fallbackLocale: "en",
  translations: {
    ja: {
      media: "メディア {index}",
      copy: "{format} 直リンクをコピー",
      copied: "コピーしました",
      failed:
        "コピーに失敗しました。再試行するか、下のURLを手動でコピーしてください。",
      manual: "手動コピー用URL",
    },
    en: {
      media: "Media {index}",
      copy: "Copy {format} direct link",
      copied: "Copied",
      failed: "Copy failed. Retry or copy the URL below manually.",
      manual: "URL for manual copy",
    },
    "zh-Hans": {
      media: "媒体 {index}",
      copy: "复制 {format} 直链",
      copied: "已复制",
      failed: "复制失败。请重试或手动复制下面的链接。",
      manual: "手动复制链接",
    },
    hi: {
      media: "मीडिया {index}",
      copy: "{format} का सीधा लिंक कॉपी करें",
      copied: "कॉपी किया गया",
      failed: "कॉपी विफल। फिर कोशिश करें या नीचे का URL कॉपी करें।",
      manual: "कॉपी करने के लिए URL",
    },
    es: {
      media: "Medio {index}",
      copy: "Copiar enlace directo {format}",
      copied: "Copiado",
      failed: "Error al copiar. Reintente o copie la URL de abajo.",
      manual: "URL para copiar",
    },
    fr: {
      media: "Média {index}",
      copy: "Copier le lien direct {format}",
      copied: "Copié",
      failed: "Échec de la copie. Réessayez ou copiez l’URL ci-dessous.",
      manual: "URL à copier",
    },
    ar: {
      media: "الوسائط {index}",
      copy: "نسخ الرابط المباشر {format}",
      copied: "تم النسخ",
      failed: "فشل النسخ. حاول مجددًا أو انسخ الرابط أدناه يدويًا.",
      manual: "رابط للنسخ اليدوي",
    },
    pt: {
      media: "Mídia {index}",
      copy: "Copiar link direto {format}",
      copied: "Copiado",
      failed: "Falha ao copiar. Tente novamente ou copie a URL abaixo.",
      manual: "URL para copiar",
    },
    bn: {
      media: "মিডিয়া {index}",
      copy: "{format} সরাসরি লিঙ্ক কপি করুন",
      copied: "কপি হয়েছে",
      failed: "কপি ব্যর্থ। আবার চেষ্টা করুন বা নিচের URL কপি করুন।",
      manual: "কপি করার URL",
    },
    ru: {
      media: "Медиа {index}",
      copy: "Копировать прямую ссылку {format}",
      copied: "Скопировано",
      failed: "Ошибка копирования. Повторите или скопируйте URL ниже.",
      manual: "URL для копирования",
    },
    ur: {
      media: "میڈیا {index}",
      copy: "{format} کا براہ راست لنک کاپی کریں",
      copied: "کاپی ہو گیا",
      failed: "کاپی ناکام۔ دوبارہ کوشش کریں یا نیچے کا URL کاپی کریں۔",
      manual: "کاپی کرنے کے لیے URL",
    },
  },
});
i18n.setLocale(i18n.detectBrowserLocale());
export const { t, format, getDirection } = i18n;
