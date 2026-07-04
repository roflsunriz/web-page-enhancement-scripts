import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  "openSettings" | "title" | "description" | "currentVolume" | "close";

const translations = {
  ja: {
    openSettings: "既定音量の調整ウィンドウを開く",
    title: "既定音量の調整",
    description:
      "スライダーまたは数値入力で既定音量を微調整し、即時に反映できます。",
    currentVolume: "現在の音量: {volume}",
    close: "閉じる",
  },
  en: {
    openSettings: "Open default volume settings",
    title: "Default volume",
    description:
      "Fine-tune the default volume with the slider or number input. Changes apply immediately.",
    currentVolume: "Current volume: {volume}",
    close: "Close",
  },
  "zh-Hans": {
    openSettings: "打开默认音量设置",
    title: "默认音量",
    description: "使用滑块或数字输入微调默认音量，设置会立即生效。",
    currentVolume: "当前音量：{volume}",
    close: "关闭",
  },
  hi: {
    openSettings: "डिफॉल्ट वॉल्यूम सेटिंग खोलें",
    title: "डिफॉल्ट वॉल्यूम",
    description:
      "स्लाइडर या नंबर इनपुट से डिफॉल्ट वॉल्यूम समायोजित करें। बदलाव तुरंत लागू होंगे।",
    currentVolume: "वर्तमान वॉल्यूम: {volume}",
    close: "बंद करें",
  },
  es: {
    openSettings: "Abrir ajustes de volumen predeterminado",
    title: "Volumen predeterminado",
    description:
      "Ajusta el volumen predeterminado con el control deslizante o el campo numerico. Los cambios se aplican al instante.",
    currentVolume: "Volumen actual: {volume}",
    close: "Cerrar",
  },
  fr: {
    openSettings: "Ouvrir les parametres du volume par defaut",
    title: "Volume par defaut",
    description:
      "Ajustez le volume par defaut avec le curseur ou le champ numerique. Les changements s'appliquent immediatement.",
    currentVolume: "Volume actuel: {volume}",
    close: "Fermer",
  },
  ar: {
    openSettings: "فتح إعدادات مستوى الصوت الافتراضي",
    title: "مستوى الصوت الافتراضي",
    description:
      "اضبط مستوى الصوت الافتراضي عبر شريط التمرير أو الإدخال الرقمي. تطبق التغييرات فورا.",
    currentVolume: "مستوى الصوت الحالي: {volume}",
    close: "إغلاق",
  },
  pt: {
    openSettings: "Abrir configuracoes de volume padrao",
    title: "Volume padrao",
    description:
      "Ajuste o volume padrao com o controle deslizante ou campo numerico. As alteracoes sao aplicadas imediatamente.",
    currentVolume: "Volume atual: {volume}",
    close: "Fechar",
  },
  bn: {
    openSettings: "ডিফল্ট ভলিউম সেটিং খুলুন",
    title: "ডিফল্ট ভলিউম",
    description:
      "স্লাইডার বা সংখ্যা ইনপুট দিয়ে ডিফল্ট ভলিউম ঠিক করুন। পরিবর্তন সঙ্গে সঙ্গে প্রয়োগ হবে।",
    currentVolume: "বর্তমান ভলিউম: {volume}",
    close: "বন্ধ",
  },
  ru: {
    openSettings: "Открыть настройки громкости по умолчанию",
    title: "Громкость по умолчанию",
    description:
      "Настройте громкость по умолчанию ползунком или числом. Изменения применяются сразу.",
    currentVolume: "Текущая громкость: {volume}",
    close: "Закрыть",
  },
  ur: {
    openSettings: "ڈیفالٹ آواز کی ترتیبات کھولیں",
    title: "ڈیفالٹ آواز",
    description:
      "سلائیڈر یا نمبر ان پٹ سے ڈیفالٹ آواز ایڈجسٹ کریں۔ تبدیلیاں فورا لاگو ہوں گی۔",
    currentVolume: "موجودہ آواز: {volume}",
    close: "بند کریں",
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
