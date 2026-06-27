import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "controlLabel"
  | "controlTitle"
  | "copyVideoInfo"
  | "copyTitleAndUrl"
  | "close"
  | "copiedSummary"
  | "unknownTitle"
  | "unknownAuthor"
  | "descriptionFailed"
  | "fullCopyText";

const translations = {
  ja: {
    controlLabel: "YouTube動画情報コピー",
    controlTitle: "YouTube動画情報",
    copyVideoInfo: "動画情報をコピー",
    copyTitleAndUrl: "タイトル+URLのみ",
    close: "閉じる",
    copiedSummary: "コピーした概要",
    unknownTitle: "タイトル不明",
    unknownAuthor: "投稿者不明",
    descriptionFailed: "概要取得に失敗しました",
    fullCopyText:
      "タイトル：{title}\n投稿者名：{author}\nURL：{url}\n概要：{description}",
  },
  en: {
    controlLabel: "Copy YouTube video info",
    controlTitle: "YouTube video info",
    copyVideoInfo: "Copy video info",
    copyTitleAndUrl: "Title + URL only",
    close: "Close",
    copiedSummary: "Copied summary",
    unknownTitle: "Unknown title",
    unknownAuthor: "Unknown author",
    descriptionFailed: "Failed to get description",
    fullCopyText:
      "Title: {title}\nAuthor: {author}\nURL: {url}\nDescription: {description}",
  },
  "zh-Hans": {
    controlLabel: "复制 YouTube 视频信息",
    controlTitle: "YouTube 视频信息",
    copyVideoInfo: "复制视频信息",
    copyTitleAndUrl: "仅标题 + URL",
    close: "关闭",
    copiedSummary: "已复制的简介",
    unknownTitle: "未知标题",
    unknownAuthor: "未知作者",
    descriptionFailed: "无法获取简介",
    fullCopyText:
      "标题：{title}\n作者：{author}\nURL：{url}\n简介：{description}",
  },
  hi: {
    controlLabel: "YouTube वीडियो जानकारी कॉपी करें",
    controlTitle: "YouTube वीडियो जानकारी",
    copyVideoInfo: "वीडियो जानकारी कॉपी करें",
    copyTitleAndUrl: "केवल शीर्षक + URL",
    close: "बंद करें",
    copiedSummary: "कॉपी किया गया सारांश",
    unknownTitle: "अज्ञात शीर्षक",
    unknownAuthor: "अज्ञात लेखक",
    descriptionFailed: "विवरण प्राप्त नहीं हो सका",
    fullCopyText:
      "शीर्षक: {title}\nलेखक: {author}\nURL: {url}\nविवरण: {description}",
  },
  es: {
    controlLabel: "Copiar informacion del video de YouTube",
    controlTitle: "Informacion del video de YouTube",
    copyVideoInfo: "Copiar informacion del video",
    copyTitleAndUrl: "Solo titulo + URL",
    close: "Cerrar",
    copiedSummary: "Resumen copiado",
    unknownTitle: "Titulo desconocido",
    unknownAuthor: "Autor desconocido",
    descriptionFailed: "No se pudo obtener la descripcion",
    fullCopyText:
      "Titulo: {title}\nAutor: {author}\nURL: {url}\nDescripcion: {description}",
  },
  fr: {
    controlLabel: "Copier les infos de la video YouTube",
    controlTitle: "Infos de la video YouTube",
    copyVideoInfo: "Copier les infos de la video",
    copyTitleAndUrl: "Titre + URL seulement",
    close: "Fermer",
    copiedSummary: "Resume copie",
    unknownTitle: "Titre inconnu",
    unknownAuthor: "Auteur inconnu",
    descriptionFailed: "Impossible d'obtenir la description",
    fullCopyText:
      "Titre: {title}\nAuteur: {author}\nURL: {url}\nDescription: {description}",
  },
  ar: {
    controlLabel: "نسخ معلومات فيديو YouTube",
    controlTitle: "معلومات فيديو YouTube",
    copyVideoInfo: "نسخ معلومات الفيديو",
    copyTitleAndUrl: "العنوان + الرابط فقط",
    close: "إغلاق",
    copiedSummary: "الملخص المنسوخ",
    unknownTitle: "عنوان غير معروف",
    unknownAuthor: "ناشر غير معروف",
    descriptionFailed: "تعذر الحصول على الوصف",
    fullCopyText:
      "العنوان: {title}\nالناشر: {author}\nURL: {url}\nالوصف: {description}",
  },
  pt: {
    controlLabel: "Copiar informacoes do video do YouTube",
    controlTitle: "Informacoes do video do YouTube",
    copyVideoInfo: "Copiar informacoes do video",
    copyTitleAndUrl: "Somente titulo + URL",
    close: "Fechar",
    copiedSummary: "Resumo copiado",
    unknownTitle: "Titulo desconhecido",
    unknownAuthor: "Autor desconhecido",
    descriptionFailed: "Nao foi possivel obter a descricao",
    fullCopyText:
      "Titulo: {title}\nAutor: {author}\nURL: {url}\nDescricao: {description}",
  },
  bn: {
    controlLabel: "YouTube ভিডিও তথ্য কপি করুন",
    controlTitle: "YouTube ভিডিও তথ্য",
    copyVideoInfo: "ভিডিও তথ্য কপি করুন",
    copyTitleAndUrl: "শুধু শিরোনাম + URL",
    close: "বন্ধ",
    copiedSummary: "কপি করা সারাংশ",
    unknownTitle: "অজানা শিরোনাম",
    unknownAuthor: "অজানা প্রকাশক",
    descriptionFailed: "বিবরণ পাওয়া যায়নি",
    fullCopyText:
      "শিরোনাম: {title}\nপ্রকাশক: {author}\nURL: {url}\nবিবরণ: {description}",
  },
  ru: {
    controlLabel: "Копировать информацию о видео YouTube",
    controlTitle: "Информация о видео YouTube",
    copyVideoInfo: "Копировать информацию о видео",
    copyTitleAndUrl: "Только название + URL",
    close: "Закрыть",
    copiedSummary: "Скопированное описание",
    unknownTitle: "Неизвестное название",
    unknownAuthor: "Неизвестный автор",
    descriptionFailed: "Не удалось получить описание",
    fullCopyText:
      "Название: {title}\nАвтор: {author}\nURL: {url}\nОписание: {description}",
  },
  ur: {
    controlLabel: "YouTube ویڈیو کی معلومات کاپی کریں",
    controlTitle: "YouTube ویڈیو کی معلومات",
    copyVideoInfo: "ویڈیو کی معلومات کاپی کریں",
    copyTitleAndUrl: "صرف عنوان + URL",
    close: "بند کریں",
    copiedSummary: "کاپی شدہ خلاصہ",
    unknownTitle: "نامعلوم عنوان",
    unknownAuthor: "نامعلوم ناشر",
    descriptionFailed: "تفصیل حاصل نہیں ہو سکی",
    fullCopyText:
      "عنوان: {title}\nناشر: {author}\nURL: {url}\nتفصیل: {description}",
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
