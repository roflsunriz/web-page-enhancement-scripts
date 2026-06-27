import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "settings"
  | "settingsTitle"
  | "enableNotification"
  | "playSoundOnComplete"
  | "volumeLabel"
  | "customSoundUrlLabel"
  | "cancel"
  | "save"
  | "saved"
  | "notificationTitle"
  | "notificationText";

const translations = {
  ja: {
    settings: "設定",
    settingsTitle: "ChatGPT 完了通知 - 設定",
    enableNotification: "通知を有効にする",
    playSoundOnComplete: "完了時に音を鳴らす",
    volumeLabel: "音量",
    customSoundUrlLabel: "カスタム通知音URL（空白の場合はデフォルト）",
    cancel: "キャンセル",
    save: "保存",
    saved: "保存しました！",
    notificationTitle: "ChatGPT 完了通知",
    notificationText: "生成が完了しました！",
  },
  en: {
    settings: "Settings",
    settingsTitle: "ChatGPT Completion Notification - Settings",
    enableNotification: "Enable notifications",
    playSoundOnComplete: "Play sound when complete",
    volumeLabel: "Volume",
    customSoundUrlLabel: "Custom notification sound URL (default if blank)",
    cancel: "Cancel",
    save: "Save",
    saved: "Saved!",
    notificationTitle: "ChatGPT Completion Notification",
    notificationText: "Generation is complete!",
  },
  "zh-Hans": {
    settings: "设置",
    settingsTitle: "ChatGPT 完成通知 - 设置",
    enableNotification: "启用通知",
    playSoundOnComplete: "完成时播放声音",
    volumeLabel: "音量",
    customSoundUrlLabel: "自定义通知音 URL（留空则使用默认）",
    cancel: "取消",
    save: "保存",
    saved: "已保存！",
    notificationTitle: "ChatGPT 完成通知",
    notificationText: "生成已完成！",
  },
  hi: {
    settings: "सेटिंग्स",
    settingsTitle: "ChatGPT पूर्णता सूचना - सेटिंग्स",
    enableNotification: "सूचनाएं सक्षम करें",
    playSoundOnComplete: "पूरा होने पर ध्वनि चलाएं",
    volumeLabel: "वॉल्यूम",
    customSoundUrlLabel: "कस्टम सूचना ध्वनि URL (खाली हो तो डिफॉल्ट)",
    cancel: "रद्द करें",
    save: "सहेजें",
    saved: "सहेजा गया!",
    notificationTitle: "ChatGPT पूर्णता सूचना",
    notificationText: "जनरेशन पूरी हो गई!",
  },
  es: {
    settings: "Configuracion",
    settingsTitle: "Notificacion de finalizacion de ChatGPT - Configuracion",
    enableNotification: "Activar notificaciones",
    playSoundOnComplete: "Reproducir sonido al finalizar",
    volumeLabel: "Volumen",
    customSoundUrlLabel:
      "URL de sonido de notificacion personalizado (predeterminado si esta vacio)",
    cancel: "Cancelar",
    save: "Guardar",
    saved: "Guardado!",
    notificationTitle: "Notificacion de finalizacion de ChatGPT",
    notificationText: "La generacion ha finalizado!",
  },
  fr: {
    settings: "Parametres",
    settingsTitle: "Notification de fin ChatGPT - Parametres",
    enableNotification: "Activer les notifications",
    playSoundOnComplete: "Jouer un son a la fin",
    volumeLabel: "Volume",
    customSoundUrlLabel:
      "URL du son de notification personnalise (par defaut si vide)",
    cancel: "Annuler",
    save: "Enregistrer",
    saved: "Enregistre!",
    notificationTitle: "Notification de fin ChatGPT",
    notificationText: "La generation est terminee!",
  },
  ar: {
    settings: "الإعدادات",
    settingsTitle: "إشعار اكتمال ChatGPT - الإعدادات",
    enableNotification: "تفعيل الإشعارات",
    playSoundOnComplete: "تشغيل صوت عند الاكتمال",
    volumeLabel: "مستوى الصوت",
    customSoundUrlLabel: "رابط صوت إشعار مخصص (الافتراضي عند تركه فارغا)",
    cancel: "إلغاء",
    save: "حفظ",
    saved: "تم الحفظ!",
    notificationTitle: "إشعار اكتمال ChatGPT",
    notificationText: "اكتمل التوليد!",
  },
  pt: {
    settings: "Configuracoes",
    settingsTitle: "Notificacao de conclusao do ChatGPT - Configuracoes",
    enableNotification: "Ativar notificacoes",
    playSoundOnComplete: "Tocar som ao concluir",
    volumeLabel: "Volume",
    customSoundUrlLabel:
      "URL de som de notificacao personalizada (padrao se vazio)",
    cancel: "Cancelar",
    save: "Salvar",
    saved: "Salvo!",
    notificationTitle: "Notificacao de conclusao do ChatGPT",
    notificationText: "A geracao foi concluida!",
  },
  bn: {
    settings: "সেটিংস",
    settingsTitle: "ChatGPT সম্পন্ন通知 - সেটিংস",
    enableNotification: "নোটিফিকেশন চালু করুন",
    playSoundOnComplete: "শেষ হলে শব্দ বাজান",
    volumeLabel: "ভলিউম",
    customSoundUrlLabel: "কাস্টম নোটিফিকেশন শব্দ URL (ফাঁকা থাকলে ডিফল্ট)",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    saved: "সংরক্ষিত!",
    notificationTitle: "ChatGPT সম্পন্ন通知",
    notificationText: "জেনারেশন সম্পন্ন হয়েছে!",
  },
  ru: {
    settings: "Настройки",
    settingsTitle: "Уведомление о завершении ChatGPT - Настройки",
    enableNotification: "Включить уведомления",
    playSoundOnComplete: "Воспроизводить звук при завершении",
    volumeLabel: "Громкость",
    customSoundUrlLabel:
      "URL пользовательского звука уведомления (по умолчанию, если пусто)",
    cancel: "Отмена",
    save: "Сохранить",
    saved: "Сохранено!",
    notificationTitle: "Уведомление о завершении ChatGPT",
    notificationText: "Генерация завершена!",
  },
  ur: {
    settings: "ترتیبات",
    settingsTitle: "ChatGPT مکمل ہونے کی اطلاع - ترتیبات",
    enableNotification: "اطلاعات فعال کریں",
    playSoundOnComplete: "مکمل ہونے پر آواز چلائیں",
    volumeLabel: "آواز",
    customSoundUrlLabel: "کسٹم اطلاع آواز URL (خالی ہو تو ڈیفالٹ)",
    cancel: "منسوخ",
    save: "محفوظ کریں",
    saved: "محفوظ ہو گیا!",
    notificationTitle: "ChatGPT مکمل ہونے کی اطلاع",
    notificationText: "جنریشن مکمل ہو گئی!",
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
export const getTextDirection = i18n.getDirection;
