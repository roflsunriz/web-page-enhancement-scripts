import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "headerButton"
  | "fileButton"
  | "copied"
  | "toastCopied"
  | "headerTitle"
  | "fileTitle";

const translations = {
  ja: {
    headerButton: "hf downloadをコピー",
    fileButton: "hf",
    copied: "コピー済み",
    toastCopied: "hf download コマンドをコピーしました",
    headerTitle: "このリポジトリをダウンロードする hf CLI コマンドをコピー",
    fileTitle: "{filePath} をダウンロードする hf CLI コマンドをコピー",
  },
  en: {
    headerButton: "Copy hf download",
    fileButton: "hf",
    copied: "Copied",
    toastCopied: "hf download command copied",
    headerTitle: "Copy hf CLI command to download this repository",
    fileTitle: "Copy hf CLI command to download {filePath}",
  },
  "zh-Hans": {
    headerButton: "复制 hf download",
    fileButton: "hf",
    copied: "已复制",
    toastCopied: "已复制 hf download 命令",
    headerTitle: "复制用于下载此仓库的 hf CLI 命令",
    fileTitle: "复制用于下载 {filePath} 的 hf CLI 命令",
  },
  hi: {
    headerButton: "hf download कॉपी करें",
    fileButton: "hf",
    copied: "कॉपी किया गया",
    toastCopied: "hf download कमांड कॉपी किया गया",
    headerTitle: "इस रिपॉजिटरी को डाउनलोड करने का hf CLI कमांड कॉपी करें",
    fileTitle: "{filePath} डाउनलोड करने का hf CLI कमांड कॉपी करें",
  },
  es: {
    headerButton: "Copiar hf download",
    fileButton: "hf",
    copied: "Copiado",
    toastCopied: "Comando hf download copiado",
    headerTitle: "Copiar comando hf CLI para descargar este repositorio",
    fileTitle: "Copiar comando hf CLI para descargar {filePath}",
  },
  fr: {
    headerButton: "Copier hf download",
    fileButton: "hf",
    copied: "Copie",
    toastCopied: "Commande hf download copiee",
    headerTitle: "Copier la commande hf CLI pour telecharger ce depot",
    fileTitle: "Copier la commande hf CLI pour telecharger {filePath}",
  },
  ar: {
    headerButton: "نسخ hf download",
    fileButton: "hf",
    copied: "تم النسخ",
    toastCopied: "تم نسخ أمر hf download",
    headerTitle: "نسخ أمر hf CLI لتنزيل هذا المستودع",
    fileTitle: "نسخ أمر hf CLI لتنزيل {filePath}",
  },
  pt: {
    headerButton: "Copiar hf download",
    fileButton: "hf",
    copied: "Copiado",
    toastCopied: "Comando hf download copiado",
    headerTitle: "Copiar comando hf CLI para baixar este repositorio",
    fileTitle: "Copiar comando hf CLI para baixar {filePath}",
  },
  bn: {
    headerButton: "hf download কপি করুন",
    fileButton: "hf",
    copied: "কপি হয়েছে",
    toastCopied: "hf download কমান্ড কপি হয়েছে",
    headerTitle: "এই রিপোজিটরি ডাউনলোডের hf CLI কমান্ড কপি করুন",
    fileTitle: "{filePath} ডাউনলোডের hf CLI কমান্ড কপি করুন",
  },
  ru: {
    headerButton: "Копировать hf download",
    fileButton: "hf",
    copied: "Скопировано",
    toastCopied: "Команда hf download скопирована",
    headerTitle: "Копировать команду hf CLI для загрузки этого репозитория",
    fileTitle: "Копировать команду hf CLI для загрузки {filePath}",
  },
  ur: {
    headerButton: "hf download کاپی کریں",
    fileButton: "hf",
    copied: "کاپی ہو گیا",
    toastCopied: "hf download کمانڈ کاپی ہو گیا",
    headerTitle: "اس ریپوزٹری کو ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں",
    fileTitle: "{filePath} ڈاؤن لوڈ کرنے کی hf CLI کمانڈ کاپی کریں",
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
