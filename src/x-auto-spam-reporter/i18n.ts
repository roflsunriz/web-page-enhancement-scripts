import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "activeModeToast"
  | "autoBlockOffMenu"
  | "autoBlockOnMenu"
  | "autoBlockState"
  | "errorAlreadyProcessing"
  | "errorDialogNotFound"
  | "errorMoreMenuNotFound"
  | "errorReportMenuItemNotFound"
  | "errorSpamOptionNotFound"
  | "errorToast"
  | "processingToast"
  | "reportButtonTitle"
  | "reportingUser"
  | "showStatsMenu"
  | "stateOff"
  | "stateOn"
  | "statsToast"
  | "successMessage"
  | "unknownError"
  | "unknownUser";

const translations = {
  ja: {
    activeModeToast:
      "🚨 スパム自動報告モード\nリプライの「🚨」ボタンをクリック",
    autoBlockOffMenu: "自動ブロックをOFF",
    autoBlockOnMenu: "自動ブロックをON",
    autoBlockState: "自動ブロック: {state}",
    errorAlreadyProcessing: "既に処理中です",
    errorDialogNotFound: "報告ダイアログが見つかりません",
    errorMoreMenuNotFound: "3点メニューボタンが見つかりません",
    errorReportMenuItemNotFound: "「ポストを報告」が見つかりません",
    errorSpamOptionNotFound: "「スパム」オプションが見つかりません",
    errorToast: "❌ エラー: {message}",
    processingToast: "⏳ 処理中です...",
    reportButtonTitle: "スパムとして報告＆ブロック",
    reportingUser: "🔄 {userName} を報告中...",
    showStatsMenu: "統計を表示",
    stateOff: "OFF",
    stateOn: "ON",
    statsToast:
      "📊 統計\n報告: {reported}\nブロック: {blocked}\nエラー: {errors}",
    successMessage:
      "✅ {userName} をスパム報告＆ブロックしました\n(報告: {reported}, ブロック: {blocked})",
    unknownError: "不明なエラー",
    unknownUser: "不明",
  },
  en: {
    activeModeToast:
      '🚨 Auto spam report mode\nClick the "🚨" button on a reply',
    autoBlockOffMenu: "Turn auto block off",
    autoBlockOnMenu: "Turn auto block on",
    autoBlockState: "Auto block: {state}",
    errorAlreadyProcessing: "A report is already in progress",
    errorDialogNotFound: "Report dialog was not found",
    errorMoreMenuNotFound: "More menu button was not found",
    errorReportMenuItemNotFound: "Report post menu item was not found",
    errorSpamOptionNotFound: "Spam option was not found",
    errorToast: "❌ Error: {message}",
    processingToast: "⏳ Processing...",
    reportButtonTitle: "Report as spam and block",
    reportingUser: "🔄 Reporting {userName}...",
    showStatsMenu: "Show stats",
    stateOff: "OFF",
    stateOn: "ON",
    statsToast:
      "📊 Stats\nReported: {reported}\nBlocked: {blocked}\nErrors: {errors}",
    successMessage:
      "✅ Reported {userName} as spam and blocked them\n(Reported: {reported}, Blocked: {blocked})",
    unknownError: "Unknown error",
    unknownUser: "Unknown",
  },
  "zh-Hans": {
    activeModeToast: "🚨 自动垃圾信息举报模式\n点击回复上的“🚨”按钮",
    autoBlockOffMenu: "关闭自动屏蔽",
    autoBlockOnMenu: "开启自动屏蔽",
    autoBlockState: "自动屏蔽: {state}",
    errorAlreadyProcessing: "已有处理正在进行",
    errorDialogNotFound: "找不到举报对话框",
    errorMoreMenuNotFound: "找不到更多菜单按钮",
    errorReportMenuItemNotFound: "找不到“举报帖子”菜单项",
    errorSpamOptionNotFound: "找不到“垃圾信息”选项",
    errorToast: "❌ 错误: {message}",
    processingToast: "⏳ 正在处理...",
    reportButtonTitle: "举报为垃圾信息并屏蔽",
    reportingUser: "🔄 正在举报 {userName}...",
    showStatsMenu: "显示统计",
    stateOff: "关",
    stateOn: "开",
    statsToast:
      "📊 统计\n已举报: {reported}\n已屏蔽: {blocked}\n错误: {errors}",
    successMessage:
      "✅ 已将 {userName} 举报为垃圾信息并屏蔽\n(举报: {reported}, 屏蔽: {blocked})",
    unknownError: "未知错误",
    unknownUser: "未知",
  },
  hi: {
    activeModeToast: '🚨 ऑटो स्पैम रिपोर्ट मोड\nरिप्लाई पर "🚨" बटन क्लिक करें',
    autoBlockOffMenu: "ऑटो ब्लॉक बंद करें",
    autoBlockOnMenu: "ऑटो ब्लॉक चालू करें",
    autoBlockState: "ऑटो ब्लॉक: {state}",
    errorAlreadyProcessing: "रिपोर्ट पहले से चल रही है",
    errorDialogNotFound: "रिपोर्ट डायलॉग नहीं मिला",
    errorMoreMenuNotFound: "अधिक मेनू बटन नहीं मिला",
    errorReportMenuItemNotFound: "पोस्ट रिपोर्ट मेनू आइटम नहीं मिला",
    errorSpamOptionNotFound: "स्पैम विकल्प नहीं मिला",
    errorToast: "❌ त्रुटि: {message}",
    processingToast: "⏳ प्रोसेस हो रहा है...",
    reportButtonTitle: "स्पैम के रूप में रिपोर्ट और ब्लॉक करें",
    reportingUser: "🔄 {userName} को रिपोर्ट कर रहे हैं...",
    showStatsMenu: "आंकड़े दिखाएं",
    stateOff: "बंद",
    stateOn: "चालू",
    statsToast:
      "📊 आंकड़े\nरिपोर्ट: {reported}\nब्लॉक: {blocked}\nत्रुटियां: {errors}",
    successMessage:
      "✅ {userName} को स्पैम के रूप में रिपोर्ट और ब्लॉक किया\n(रिपोर्ट: {reported}, ब्लॉक: {blocked})",
    unknownError: "अज्ञात त्रुटि",
    unknownUser: "अज्ञात",
  },
  es: {
    activeModeToast:
      '🚨 Modo de reporte automático de spam\nHaz clic en "🚨" en una respuesta',
    autoBlockOffMenu: "Desactivar bloqueo automático",
    autoBlockOnMenu: "Activar bloqueo automático",
    autoBlockState: "Bloqueo automático: {state}",
    errorAlreadyProcessing: "Ya hay un reporte en curso",
    errorDialogNotFound: "No se encontró el diálogo de reporte",
    errorMoreMenuNotFound: "No se encontró el botón de más opciones",
    errorReportMenuItemNotFound:
      "No se encontró la opción para reportar el post",
    errorSpamOptionNotFound: "No se encontró la opción de spam",
    errorToast: "❌ Error: {message}",
    processingToast: "⏳ Procesando...",
    reportButtonTitle: "Reportar como spam y bloquear",
    reportingUser: "🔄 Reportando a {userName}...",
    showStatsMenu: "Mostrar estadísticas",
    stateOff: "OFF",
    stateOn: "ON",
    statsToast:
      "📊 Estadísticas\nReportados: {reported}\nBloqueados: {blocked}\nErrores: {errors}",
    successMessage:
      "✅ {userName} fue reportado como spam y bloqueado\n(Reportados: {reported}, Bloqueados: {blocked})",
    unknownError: "Error desconocido",
    unknownUser: "Desconocido",
  },
  fr: {
    activeModeToast:
      '🚨 Mode de signalement automatique du spam\nCliquez sur "🚨" sur une réponse',
    autoBlockOffMenu: "Désactiver le blocage auto",
    autoBlockOnMenu: "Activer le blocage auto",
    autoBlockState: "Blocage auto: {state}",
    errorAlreadyProcessing: "Un signalement est déjà en cours",
    errorDialogNotFound: "La boîte de dialogue de signalement est introuvable",
    errorMoreMenuNotFound: "Le bouton de menu est introuvable",
    errorReportMenuItemNotFound:
      "L'option de signalement du post est introuvable",
    errorSpamOptionNotFound: "L'option spam est introuvable",
    errorToast: "❌ Erreur: {message}",
    processingToast: "⏳ Traitement...",
    reportButtonTitle: "Signaler comme spam et bloquer",
    reportingUser: "🔄 Signalement de {userName}...",
    showStatsMenu: "Afficher les stats",
    stateOff: "OFF",
    stateOn: "ON",
    statsToast:
      "📊 Stats\nSignalés: {reported}\nBloqués: {blocked}\nErreurs: {errors}",
    successMessage:
      "✅ {userName} a été signalé comme spam et bloqué\n(Signalés: {reported}, Bloqués: {blocked})",
    unknownError: "Erreur inconnue",
    unknownUser: "Inconnu",
  },
  ar: {
    activeModeToast: '🚨 وضع الإبلاغ التلقائي عن السبام\nانقر زر "🚨" في الرد',
    autoBlockOffMenu: "إيقاف الحظر التلقائي",
    autoBlockOnMenu: "تشغيل الحظر التلقائي",
    autoBlockState: "الحظر التلقائي: {state}",
    errorAlreadyProcessing: "يوجد إبلاغ قيد التنفيذ بالفعل",
    errorDialogNotFound: "لم يتم العثور على نافذة الإبلاغ",
    errorMoreMenuNotFound: "لم يتم العثور على زر المزيد",
    errorReportMenuItemNotFound: "لم يتم العثور على خيار الإبلاغ عن المنشور",
    errorSpamOptionNotFound: "لم يتم العثور على خيار السبام",
    errorToast: "❌ خطأ: {message}",
    processingToast: "⏳ جار المعالجة...",
    reportButtonTitle: "الإبلاغ كسبام وحظر",
    reportingUser: "🔄 جار الإبلاغ عن {userName}...",
    showStatsMenu: "عرض الإحصاءات",
    stateOff: "إيقاف",
    stateOn: "تشغيل",
    statsToast:
      "📊 الإحصاءات\nتم الإبلاغ: {reported}\nمحظور: {blocked}\nأخطاء: {errors}",
    successMessage:
      "✅ تم الإبلاغ عن {userName} كسبام وحظره\n(الإبلاغ: {reported}, الحظر: {blocked})",
    unknownError: "خطأ غير معروف",
    unknownUser: "غير معروف",
  },
  pt: {
    activeModeToast:
      '🚨 Modo de denúncia automática de spam\nClique no botão "🚨" em uma resposta',
    autoBlockOffMenu: "Desativar bloqueio automático",
    autoBlockOnMenu: "Ativar bloqueio automático",
    autoBlockState: "Bloqueio automático: {state}",
    errorAlreadyProcessing: "Já existe uma denúncia em andamento",
    errorDialogNotFound: "A janela de denúncia não foi encontrada",
    errorMoreMenuNotFound: "O botão de mais opções não foi encontrado",
    errorReportMenuItemNotFound:
      "O item para denunciar o post não foi encontrado",
    errorSpamOptionNotFound: "A opção de spam não foi encontrada",
    errorToast: "❌ Erro: {message}",
    processingToast: "⏳ Processando...",
    reportButtonTitle: "Denunciar como spam e bloquear",
    reportingUser: "🔄 Denunciando {userName}...",
    showStatsMenu: "Mostrar estatísticas",
    stateOff: "OFF",
    stateOn: "ON",
    statsToast:
      "📊 Estatísticas\nDenunciados: {reported}\nBloqueados: {blocked}\nErros: {errors}",
    successMessage:
      "✅ {userName} foi denunciado como spam e bloqueado\n(Denunciados: {reported}, Bloqueados: {blocked})",
    unknownError: "Erro desconhecido",
    unknownUser: "Desconhecido",
  },
  bn: {
    activeModeToast:
      '🚨 অটো স্প্যাম রিপোর্ট মোড\nরিপ্লাইয়ের "🚨" বোতামে ক্লিক করুন',
    autoBlockOffMenu: "অটো ব্লক বন্ধ করুন",
    autoBlockOnMenu: "অটো ব্লক চালু করুন",
    autoBlockState: "অটো ব্লক: {state}",
    errorAlreadyProcessing: "একটি রিপোর্ট ইতিমধ্যে চলছে",
    errorDialogNotFound: "রিপোর্ট ডায়ালগ পাওয়া যায়নি",
    errorMoreMenuNotFound: "আরও মেনু বোতাম পাওয়া যায়নি",
    errorReportMenuItemNotFound: "পোস্ট রিপোর্ট মেনু আইটেম পাওয়া যায়নি",
    errorSpamOptionNotFound: "স্প্যাম অপশন পাওয়া যায়নি",
    errorToast: "❌ ত্রুটি: {message}",
    processingToast: "⏳ প্রসেস হচ্ছে...",
    reportButtonTitle: "স্প্যাম হিসেবে রিপোর্ট ও ব্লক করুন",
    reportingUser: "🔄 {userName} কে রিপোর্ট করা হচ্ছে...",
    showStatsMenu: "পরিসংখ্যান দেখান",
    stateOff: "বন্ধ",
    stateOn: "চালু",
    statsToast:
      "📊 পরিসংখ্যান\nরিপোর্ট: {reported}\nব্লক: {blocked}\nত্রুটি: {errors}",
    successMessage:
      "✅ {userName} কে স্প্যাম হিসেবে রিপোর্ট ও ব্লক করা হয়েছে\n(রিপোর্ট: {reported}, ব্লক: {blocked})",
    unknownError: "অজানা ত্রুটি",
    unknownUser: "অজানা",
  },
  ru: {
    activeModeToast:
      '🚨 Режим авто-жалобы на спам\nНажмите кнопку "🚨" у ответа',
    autoBlockOffMenu: "Отключить автоблокировку",
    autoBlockOnMenu: "Включить автоблокировку",
    autoBlockState: "Автоблокировка: {state}",
    errorAlreadyProcessing: "Жалоба уже выполняется",
    errorDialogNotFound: "Диалог жалобы не найден",
    errorMoreMenuNotFound: "Кнопка дополнительного меню не найдена",
    errorReportMenuItemNotFound: "Пункт жалобы на пост не найден",
    errorSpamOptionNotFound: "Опция спама не найдена",
    errorToast: "❌ Ошибка: {message}",
    processingToast: "⏳ Обработка...",
    reportButtonTitle: "Пожаловаться на спам и заблокировать",
    reportingUser: "🔄 Жалоба на {userName}...",
    showStatsMenu: "Показать статистику",
    stateOff: "Выкл",
    stateOn: "Вкл",
    statsToast:
      "📊 Статистика\nЖалобы: {reported}\nЗаблокировано: {blocked}\nОшибки: {errors}",
    successMessage:
      "✅ {userName} отмечен как спам и заблокирован\n(Жалобы: {reported}, Блокировки: {blocked})",
    unknownError: "Неизвестная ошибка",
    unknownUser: "Неизвестно",
  },
  ur: {
    activeModeToast: '🚨 آٹو اسپام رپورٹ موڈ\nجواب پر "🚨" بٹن کلک کریں',
    autoBlockOffMenu: "آٹو بلاک بند کریں",
    autoBlockOnMenu: "آٹو بلاک آن کریں",
    autoBlockState: "آٹو بلاک: {state}",
    errorAlreadyProcessing: "رپورٹ پہلے ہی جاری ہے",
    errorDialogNotFound: "رپورٹ ڈائیلاگ نہیں ملا",
    errorMoreMenuNotFound: "مزید مینو بٹن نہیں ملا",
    errorReportMenuItemNotFound: "پوسٹ رپورٹ مینو آئٹم نہیں ملا",
    errorSpamOptionNotFound: "اسپام آپشن نہیں ملا",
    errorToast: "❌ خرابی: {message}",
    processingToast: "⏳ کارروائی جاری ہے...",
    reportButtonTitle: "اسپام کے طور پر رپورٹ اور بلاک کریں",
    reportingUser: "🔄 {userName} کو رپورٹ کیا جا رہا ہے...",
    showStatsMenu: "اعداد و شمار دکھائیں",
    stateOff: "بند",
    stateOn: "چالو",
    statsToast:
      "📊 اعداد و شمار\nرپورٹ: {reported}\nبلاک: {blocked}\nخرابیاں: {errors}",
    successMessage:
      "✅ {userName} کو اسپام کے طور پر رپورٹ اور بلاک کر دیا گیا\n(رپورٹ: {reported}, بلاک: {blocked})",
    unknownError: "نامعلوم خرابی",
    unknownUser: "نامعلوم",
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

export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
export const t = i18n.t;
