export type Locale =
  "ja" | "en" | "zh" | "hi" | "es" | "fr" | "ar" | "pt" | "bn" | "ru" | "ur";

export type Messages = {
  title: string;
  description: string;
  recommended: string;
  recommendedHint: string;
  universal: string;
  universalHint: string;
  variants: string;
  providerNotice: string;
  collapse: string;
  expand: string;
};

export const MESSAGES: Record<Locale, Messages> = {
  ja: {
    title: "APK / APKS を取得",
    description: "端末不要。CPU・Android・DPIなども選べます。",
    recommended: "推奨構成を取得",
    recommendedHint: "64-bit ARM・標準言語・全DPI",
    universal: "Universal APKS",
    universalHint: "32/64-bit ARM・全言語・全DPI",
    variants: "端末・Android・CPU・DPIを指定",
    providerNotice: "第三者配布元 APKCube を新しいタブで開きます。",
    collapse: "APKダウンロードパネルを折りたたむ",
    expand: "APKダウンロードパネルを開く",
  },
  en: {
    title: "Get APK / APKS",
    description: "No device required. Choose CPU, Android and DPI.",
    recommended: "Get recommended build",
    recommendedHint: "64-bit ARM, standard languages, all DPI",
    universal: "Universal APKS",
    universalHint: "32/64-bit ARM, every language, all DPI",
    variants: "Choose device, Android, CPU and DPI",
    providerNotice: "Opens third-party provider APKCube in a new tab.",
    collapse: "Collapse APK download panel",
    expand: "Open APK download panel",
  },
  zh: {
    title: "获取 APK / APKS",
    description: "无需设备，可选择 CPU、Android 和 DPI。",
    recommended: "获取推荐版本",
    recommendedHint: "64 位 ARM、常用语言、全部 DPI",
    universal: "通用 APKS",
    universalHint: "32/64 位 ARM、全部语言、全部 DPI",
    variants: "选择设备、Android、CPU 和 DPI",
    providerNotice: "将在新标签页打开第三方来源 APKCube。",
    collapse: "收起 APK 下载面板",
    expand: "打开 APK 下载面板",
  },
  hi: {
    title: "APK / APKS पाएँ",
    description: "डिवाइस की ज़रूरत नहीं। CPU, Android और DPI चुनें।",
    recommended: "सुझाया बिल्ड पाएँ",
    recommendedHint: "64-bit ARM, मानक भाषाएँ, सभी DPI",
    universal: "यूनिवर्सल APKS",
    universalHint: "32/64-bit ARM, सभी भाषाएँ, सभी DPI",
    variants: "डिवाइस, Android, CPU और DPI चुनें",
    providerNotice: "तीसरे पक्ष APKCube को नए टैब में खोलता है।",
    collapse: "APK डाउनलोड पैनल समेटें",
    expand: "APK डाउनलोड पैनल खोलें",
  },
  es: {
    title: "Obtener APK / APKS",
    description: "Sin dispositivo. Elige CPU, Android y DPI.",
    recommended: "Obtener versión recomendada",
    recommendedHint: "ARM de 64 bits, idiomas comunes, todos los DPI",
    universal: "APKS universal",
    universalHint: "ARM de 32/64 bits, todos los idiomas y DPI",
    variants: "Elegir dispositivo, Android, CPU y DPI",
    providerNotice: "Abre el proveedor externo APKCube en otra pestaña.",
    collapse: "Contraer el panel de descarga APK",
    expand: "Abrir el panel de descarga APK",
  },
  fr: {
    title: "Obtenir l’APK / APKS",
    description: "Sans appareil. Choisissez CPU, Android et DPI.",
    recommended: "Obtenir la version conseillée",
    recommendedHint: "ARM 64 bits, langues courantes, tous les DPI",
    universal: "APKS universel",
    universalHint: "ARM 32/64 bits, toutes langues et tous DPI",
    variants: "Choisir appareil, Android, CPU et DPI",
    providerNotice: "Ouvre le fournisseur tiers APKCube dans un nouvel onglet.",
    collapse: "Réduire le panneau de téléchargement APK",
    expand: "Ouvrir le panneau de téléchargement APK",
  },
  ar: {
    title: "تنزيل APK / APKS",
    description: "لا يلزم جهاز. اختر CPU وإصدار Android وDPI.",
    recommended: "تنزيل الإصدار المقترح",
    recommendedHint: "ARM ‏64 بت، اللغات الشائعة، كل DPI",
    universal: "APKS شامل",
    universalHint: "ARM ‏32/64 بت، كل اللغات وكل DPI",
    variants: "اختيار الجهاز وAndroid وCPU وDPI",
    providerNotice: "يفتح المزوّد الخارجي APKCube في علامة تبويب جديدة.",
    collapse: "طي لوحة تنزيل APK",
    expand: "فتح لوحة تنزيل APK",
  },
  pt: {
    title: "Obter APK / APKS",
    description: "Sem dispositivo. Escolha CPU, Android e DPI.",
    recommended: "Obter versão recomendada",
    recommendedHint: "ARM 64 bits, idiomas comuns, todos os DPI",
    universal: "APKS universal",
    universalHint: "ARM 32/64 bits, todos os idiomas e DPI",
    variants: "Escolher dispositivo, Android, CPU e DPI",
    providerNotice: "Abre o provedor externo APKCube em nova aba.",
    collapse: "Recolher painel de download de APK",
    expand: "Abrir painel de download de APK",
  },
  bn: {
    title: "APK / APKS নিন",
    description: "ডিভাইস লাগবে না। CPU, Android ও DPI বেছে নিন।",
    recommended: "প্রস্তাবিত বিল্ড নিন",
    recommendedHint: "64-bit ARM, সাধারণ ভাষা, সব DPI",
    universal: "ইউনিভার্সাল APKS",
    universalHint: "32/64-bit ARM, সব ভাষা ও সব DPI",
    variants: "ডিভাইস, Android, CPU ও DPI বেছে নিন",
    providerNotice: "তৃতীয় পক্ষ APKCube নতুন ট্যাবে খুলবে।",
    collapse: "APK ডাউনলোড প্যানেল গুটান",
    expand: "APK ডাউনলোড প্যানেল খুলুন",
  },
  ru: {
    title: "Получить APK / APKS",
    description: "Устройство не нужно. Выберите CPU, Android и DPI.",
    recommended: "Получить рекомендуемую сборку",
    recommendedHint: "64-бит ARM, основные языки, все DPI",
    universal: "Универсальный APKS",
    universalHint: "32/64-бит ARM, все языки и DPI",
    variants: "Выбрать устройство, Android, CPU и DPI",
    providerNotice: "Откроет сторонний сервис APKCube в новой вкладке.",
    collapse: "Свернуть панель загрузки APK",
    expand: "Открыть панель загрузки APK",
  },
  ur: {
    title: "APK / APKS حاصل کریں",
    description: "ڈیوائس درکار نہیں۔ CPU، Android اور DPI منتخب کریں۔",
    recommended: "تجویز کردہ بلڈ حاصل کریں",
    recommendedHint: "64-bit ARM، عام زبانیں، تمام DPI",
    universal: "یونیورسل APKS",
    universalHint: "32/64-bit ARM، تمام زبانیں اور DPI",
    variants: "ڈیوائس، Android، CPU اور DPI منتخب کریں",
    providerNotice: "تیسرے فریق APKCube کو نئے ٹیب میں کھولتا ہے۔",
    collapse: "APK ڈاؤن لوڈ پینل سمیٹیں",
    expand: "APK ڈاؤن لوڈ پینل کھولیں",
  },
};

const RTL_LOCALES = new Set<Locale>(["ar", "ur"]);

export function resolveLocale(language: string): Locale {
  const normalized = language.toLowerCase().split("-")[0] ?? "";
  return normalized in MESSAGES ? (normalized as Locale) : "en";
}

export function isRtlLocale(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}
