import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "inbox"
  | "thisFolder"
  | "selectFolderError"
  | "folderLoadTimeout"
  | "checkboxNotFound"
  | "mailSelectionTimeout"
  | "markReadMenuNotFound"
  | "mailOperationMenuNotFound"
  | "openingFolder"
  | "markingFolder"
  | "markedFolder"
  | "markReadFailed"
  | "noUnreadBulk"
  | "bulkProgress"
  | "bulkComplete"
  | "bulkFailed"
  | "bulkErrorProgress"
  | "singleButton"
  | "singleTitle"
  | "bulkButton"
  | "bulkTitle";

const translations = {
  ja: {
    inbox: "受信箱",
    thisFolder: "このフォルダー",
    selectFolderError: "フォルダーを選択できません。",
    folderLoadTimeout: "フォルダーの読み込みが完了しませんでした。",
    checkboxNotFound: "メール一覧の全選択チェックボックスが見つかりません。",
    mailSelectionTimeout: "メールの選択が完了しませんでした。",
    markReadMenuNotFound: "「既読にする」メニューが見つかりません。",
    mailOperationMenuNotFound:
      "メール操作メニューが見つかりません。メールが存在しないか、選択できていない可能性があります。",
    openingFolder: "{folderName} を開いています",
    markingFolder: "{folderName} を既読にしています",
    markedFolder: "{folderName} を既読にしました",
    markReadFailed: "既読化に失敗しました。",
    noUnreadBulk: "受信箱と個人フォルダに未読メールはありません",
    bulkProgress: "{folderName} を既読にしています ({current}/{total})",
    bulkComplete: "受信箱と個人フォルダ {count} 件を既読にしました",
    bulkFailed: "一括既読化に失敗しました。",
    bulkErrorProgress: "{completed}/{total} 件完了: {message}",
    singleButton: "既読",
    singleTitle: "{folderName} の表示中メールをすべて既読にする",
    bulkButton: "一括既読",
    bulkTitle: "受信箱と未読がある個人フォルダを順番に開いて既読にする",
  },
  en: {
    inbox: "Inbox",
    thisFolder: "this folder",
    selectFolderError: "Could not select the folder.",
    folderLoadTimeout: "The folder did not finish loading.",
    checkboxNotFound: "Could not find the select-all checkbox.",
    mailSelectionTimeout: "Mail selection did not complete.",
    markReadMenuNotFound: "Could not find the mark-as-read menu.",
    mailOperationMenuNotFound:
      "Could not find the mail action menu. There may be no mail, or mail may not be selected.",
    openingFolder: "Opening {folderName}",
    markingFolder: "Marking {folderName} as read",
    markedFolder: "Marked {folderName} as read",
    markReadFailed: "Failed to mark as read.",
    noUnreadBulk: "There is no unread mail in Inbox or personal folders.",
    bulkProgress: "Marking {folderName} as read ({current}/{total})",
    bulkComplete: "Marked {count} Inbox/personal folder(s) as read",
    bulkFailed: "Bulk mark-as-read failed.",
    bulkErrorProgress: "{completed}/{total} completed: {message}",
    singleButton: "Read",
    singleTitle: "Mark all visible mail in {folderName} as read",
    bulkButton: "Bulk read",
    bulkTitle: "Open Inbox and unread personal folders in order and mark as read",
  },
  "zh-Hans": {
    inbox: "收件箱",
    thisFolder: "此文件夹",
    selectFolderError: "无法选择文件夹。",
    folderLoadTimeout: "文件夹未完成加载。",
    checkboxNotFound: "找不到邮件列表的全选复选框。",
    mailSelectionTimeout: "邮件选择未完成。",
    markReadMenuNotFound: "找不到标记为已读菜单。",
    mailOperationMenuNotFound: "找不到邮件操作菜单。可能没有邮件，或尚未选择邮件。",
    openingFolder: "正在打开 {folderName}",
    markingFolder: "正在将 {folderName} 标记为已读",
    markedFolder: "已将 {folderName} 标记为已读",
    markReadFailed: "标记为已读失败。",
    noUnreadBulk: "收件箱和个人文件夹中没有未读邮件。",
    bulkProgress: "正在将 {folderName} 标记为已读 ({current}/{total})",
    bulkComplete: "已将收件箱和个人文件夹 {count} 项标记为已读",
    bulkFailed: "批量标记为已读失败。",
    bulkErrorProgress: "已完成 {completed}/{total}: {message}",
    singleButton: "已读",
    singleTitle: "将 {folderName} 中显示的所有邮件标记为已读",
    bulkButton: "批量已读",
    bulkTitle: "依次打开收件箱和有未读邮件的个人文件夹并标记为已读",
  },
  hi: {
    inbox: "इनबॉक्स",
    thisFolder: "यह फ़ोल्डर",
    selectFolderError: "फ़ोल्डर चयन नहीं किया जा सका।",
    folderLoadTimeout: "फ़ोल्डर लोड पूरा नहीं हुआ।",
    checkboxNotFound: "मेल सूची का सभी-चयन चेकबॉक्स नहीं मिला।",
    mailSelectionTimeout: "मेल चयन पूरा नहीं हुआ।",
    markReadMenuNotFound: "रीड के रूप में मार्क मेनू नहीं मिला।",
    mailOperationMenuNotFound:
      "मेल कार्रवाई मेनू नहीं मिला। मेल नहीं हो सकता है या चयन नहीं हुआ है।",
    openingFolder: "{folderName} खोल रहे हैं",
    markingFolder: "{folderName} को पढ़ा हुआ कर रहे हैं",
    markedFolder: "{folderName} पढ़ा हुआ कर दिया गया",
    markReadFailed: "पढ़ा हुआ करने में विफल।",
    noUnreadBulk: "इनबॉक्स और निजी फ़ोल्डरों में कोई अपठित मेल नहीं है।",
    bulkProgress: "{folderName} को पढ़ा हुआ कर रहे हैं ({current}/{total})",
    bulkComplete: "इनबॉक्स/निजी फ़ोल्डर {count} पढ़े हुए कर दिए गए",
    bulkFailed: "बल्क पढ़ा हुआ करना विफल।",
    bulkErrorProgress: "{completed}/{total} पूर्ण: {message}",
    singleButton: "पढ़ा",
    singleTitle: "{folderName} में दिख रहे सभी मेल पढ़े हुए करें",
    bulkButton: "बल्क पढ़ा",
    bulkTitle: "इनबॉक्स और अपठित निजी फ़ोल्डर क्रम से खोलकर पढ़े हुए करें",
  },
  es: {
    inbox: "Bandeja",
    thisFolder: "esta carpeta",
    selectFolderError: "No se pudo seleccionar la carpeta.",
    folderLoadTimeout: "La carpeta no termino de cargar.",
    checkboxNotFound: "No se encontro la casilla para seleccionar todo.",
    mailSelectionTimeout: "La seleccion de correos no se completo.",
    markReadMenuNotFound: "No se encontro el menu de marcar como leido.",
    mailOperationMenuNotFound:
      "No se encontro el menu de acciones. Puede que no haya correos o que no esten seleccionados.",
    openingFolder: "Abriendo {folderName}",
    markingFolder: "Marcando {folderName} como leido",
    markedFolder: "{folderName} marcado como leido",
    markReadFailed: "No se pudo marcar como leido.",
    noUnreadBulk: "No hay correo sin leer en Bandeja ni carpetas personales.",
    bulkProgress: "Marcando {folderName} como leido ({current}/{total})",
    bulkComplete: "{count} carpeta(s) marcadas como leidas",
    bulkFailed: "Fallo el marcado masivo como leido.",
    bulkErrorProgress: "{completed}/{total} completado: {message}",
    singleButton: "Leido",
    singleTitle: "Marcar como leidos todos los correos visibles en {folderName}",
    bulkButton: "Leido masivo",
    bulkTitle:
      "Abrir Bandeja y carpetas personales con no leidos en orden y marcarlas como leidas",
  },
  fr: {
    inbox: "Boite de reception",
    thisFolder: "ce dossier",
    selectFolderError: "Impossible de selectionner le dossier.",
    folderLoadTimeout: "Le dossier n'a pas fini de charger.",
    checkboxNotFound: "Case de selection globale introuvable.",
    mailSelectionTimeout: "La selection des messages n'est pas terminee.",
    markReadMenuNotFound: "Menu marquer comme lu introuvable.",
    mailOperationMenuNotFound:
      "Menu d'action mail introuvable. Il n'y a peut-etre aucun mail ou rien n'est selectionne.",
    openingFolder: "Ouverture de {folderName}",
    markingFolder: "Marquage de {folderName} comme lu",
    markedFolder: "{folderName} marque comme lu",
    markReadFailed: "Echec du marquage comme lu.",
    noUnreadBulk: "Aucun mail non lu dans la boite ou les dossiers personnels.",
    bulkProgress: "Marquage de {folderName} comme lu ({current}/{total})",
    bulkComplete: "{count} dossier(s) marques comme lus",
    bulkFailed: "Echec du marquage en lot.",
    bulkErrorProgress: "{completed}/{total} termine: {message}",
    singleButton: "Lu",
    singleTitle: "Marquer comme lus tous les mails visibles dans {folderName}",
    bulkButton: "Tout lire",
    bulkTitle:
      "Ouvrir la boite et les dossiers personnels non lus puis marquer comme lus",
  },
  ar: {
    inbox: "البريد الوارد",
    thisFolder: "هذا المجلد",
    selectFolderError: "تعذر اختيار المجلد.",
    folderLoadTimeout: "لم يكتمل تحميل المجلد.",
    checkboxNotFound: "تعذر العثور على مربع تحديد كل الرسائل.",
    mailSelectionTimeout: "لم يكتمل تحديد الرسائل.",
    markReadMenuNotFound: "تعذر العثور على قائمة وضع علامة كمقروء.",
    mailOperationMenuNotFound:
      "تعذر العثور على قائمة عمليات البريد. قد لا توجد رسائل أو لم يتم التحديد.",
    openingFolder: "جار فتح {folderName}",
    markingFolder: "جار وضع {folderName} كمقروء",
    markedFolder: "تم وضع {folderName} كمقروء",
    markReadFailed: "فشل وضع علامة كمقروء.",
    noUnreadBulk: "لا توجد رسائل غير مقروءة في الوارد أو المجلدات الشخصية.",
    bulkProgress: "جار وضع {folderName} كمقروء ({current}/{total})",
    bulkComplete: "تم وضع {count} مجلد كمقروء",
    bulkFailed: "فشل وضع العلامة كمقروء دفعة واحدة.",
    bulkErrorProgress: "اكتمل {completed}/{total}: {message}",
    singleButton: "مقروء",
    singleTitle: "وضع كل الرسائل الظاهرة في {folderName} كمقروءة",
    bulkButton: "مقروء دفعة",
    bulkTitle: "فتح الوارد والمجلدات الشخصية غير المقروءة بالترتيب ووضعها كمقروءة",
  },
  pt: {
    inbox: "Caixa de entrada",
    thisFolder: "esta pasta",
    selectFolderError: "Nao foi possivel selecionar a pasta.",
    folderLoadTimeout: "A pasta nao terminou de carregar.",
    checkboxNotFound: "Nao foi encontrada a caixa de selecao de todos os emails.",
    mailSelectionTimeout: "A selecao de emails nao foi concluida.",
    markReadMenuNotFound: "Nao foi encontrado o menu marcar como lido.",
    mailOperationMenuNotFound:
      "Nao foi encontrado o menu de acoes. Talvez nao haja emails ou nada esteja selecionado.",
    openingFolder: "Abrindo {folderName}",
    markingFolder: "Marcando {folderName} como lido",
    markedFolder: "{folderName} marcado como lido",
    markReadFailed: "Falha ao marcar como lido.",
    noUnreadBulk: "Nao ha emails nao lidos na Caixa de entrada ou pastas pessoais.",
    bulkProgress: "Marcando {folderName} como lido ({current}/{total})",
    bulkComplete: "{count} pasta(s) marcadas como lidas",
    bulkFailed: "Falha ao marcar em lote como lido.",
    bulkErrorProgress: "{completed}/{total} concluido: {message}",
    singleButton: "Lido",
    singleTitle: "Marcar todos os emails visiveis em {folderName} como lidos",
    bulkButton: "Ler em lote",
    bulkTitle:
      "Abrir Caixa de entrada e pastas pessoais com nao lidos em ordem e marcar como lidos",
  },
  bn: {
    inbox: "ইনবক্স",
    thisFolder: "এই ফোল্ডার",
    selectFolderError: "ফোল্ডার নির্বাচন করা যায়নি।",
    folderLoadTimeout: "ফোল্ডার লোড শেষ হয়নি।",
    checkboxNotFound: "মেইল তালিকার সব নির্বাচন চেকবক্স পাওয়া যায়নি।",
    mailSelectionTimeout: "মেইল নির্বাচন শেষ হয়নি।",
    markReadMenuNotFound: "পঠিত হিসেবে চিহ্নিত করার মেনু পাওয়া যায়নি।",
    mailOperationMenuNotFound:
      "মেইল অপারেশন মেনু পাওয়া যায়নি। মেইল নাও থাকতে পারে বা নির্বাচন হয়নি।",
    openingFolder: "{folderName} খোলা হচ্ছে",
    markingFolder: "{folderName} পঠিত করা হচ্ছে",
    markedFolder: "{folderName} পঠিত করা হয়েছে",
    markReadFailed: "পঠিত করতে ব্যর্থ।",
    noUnreadBulk: "ইনবক্স ও ব্যক্তিগত ফোল্ডারে অপঠিত মেইল নেই।",
    bulkProgress: "{folderName} পঠিত করা হচ্ছে ({current}/{total})",
    bulkComplete: "{count}টি ফোল্ডার পঠিত করা হয়েছে",
    bulkFailed: "একসাথে পঠিত করতে ব্যর্থ।",
    bulkErrorProgress: "{completed}/{total} সম্পন্ন: {message}",
    singleButton: "পঠিত",
    singleTitle: "{folderName} এ দৃশ্যমান সব মেইল পঠিত করুন",
    bulkButton: "একসাথে পঠিত",
    bulkTitle: "ইনবক্স ও অপঠিত ব্যক্তিগত ফোল্ডার খুলে পঠিত করুন",
  },
  ru: {
    inbox: "Входящие",
    thisFolder: "эта папка",
    selectFolderError: "Не удалось выбрать папку.",
    folderLoadTimeout: "Папка не загрузилась полностью.",
    checkboxNotFound: "Не найден флажок выбора всех писем.",
    mailSelectionTimeout: "Выбор писем не завершился.",
    markReadMenuNotFound: "Не найдено меню отметить как прочитанное.",
    mailOperationMenuNotFound:
      "Не найдено меню действий с письмами. Возможно, писем нет или они не выбраны.",
    openingFolder: "Открывается {folderName}",
    markingFolder: "{folderName}: отметка как прочитано",
    markedFolder: "{folderName} отмечена как прочитанная",
    markReadFailed: "Не удалось отметить как прочитанное.",
    noUnreadBulk: "Во Входящих и личных папках нет непрочитанных писем.",
    bulkProgress: "{folderName}: отметка как прочитано ({current}/{total})",
    bulkComplete: "Отмечено как прочитано папок: {count}",
    bulkFailed: "Массовая отметка как прочитано не удалась.",
    bulkErrorProgress: "{completed}/{total} завершено: {message}",
    singleButton: "Прочит.",
    singleTitle: "Отметить все видимые письма в {folderName} как прочитанные",
    bulkButton: "Все прочит.",
    bulkTitle:
      "Открыть Входящие и личные папки с непрочитанными письмами и отметить их",
  },
  ur: {
    inbox: "ان باکس",
    thisFolder: "یہ فولڈر",
    selectFolderError: "فولڈر منتخب نہیں ہو سکا۔",
    folderLoadTimeout: "فولڈر لوڈ مکمل نہیں ہوا۔",
    checkboxNotFound: "تمام میل منتخب کرنے کا چیک باکس نہیں ملا۔",
    mailSelectionTimeout: "میل کا انتخاب مکمل نہیں ہوا۔",
    markReadMenuNotFound: "پڑھا ہوا کرنے کا مینو نہیں ملا۔",
    mailOperationMenuNotFound:
      "میل کارروائی مینو نہیں ملا۔ ممکن ہے میل نہ ہو یا انتخاب نہ ہوا ہو۔",
    openingFolder: "{folderName} کھولا جا رہا ہے",
    markingFolder: "{folderName} کو پڑھا ہوا کیا جا رہا ہے",
    markedFolder: "{folderName} پڑھا ہوا ہو گیا",
    markReadFailed: "پڑھا ہوا کرنے میں ناکامی۔",
    noUnreadBulk: "ان باکس اور ذاتی فولڈرز میں کوئی غیر پڑھی میل نہیں ہے۔",
    bulkProgress: "{folderName} کو پڑھا ہوا کیا جا رہا ہے ({current}/{total})",
    bulkComplete: "{count} فولڈر پڑھا ہوا کر دیے گئے",
    bulkFailed: "ایک ساتھ پڑھا ہوا کرنے میں ناکامی۔",
    bulkErrorProgress: "{completed}/{total} مکمل: {message}",
    singleButton: "پڑھا",
    singleTitle: "{folderName} میں نظر آنے والی سب میل پڑھا ہوا کریں",
    bulkButton: "سب پڑھا",
    bulkTitle: "ان باکس اور غیر پڑھے ذاتی فولڈرز ترتیب سے کھول کر پڑھا ہوا کریں",
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
