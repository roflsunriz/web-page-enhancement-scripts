import {
  buildSupportedTranslationMap,
  createI18n,
  getLocaleMetadata,
  type LocaleCode,
} from "@/shared/i18n";
import type {
  YoutubeUiModifierLanguageSetting,
  YoutubeUiModifierSettingId,
} from "@/shared/types";

type TranslationKey =
  | "activeSettings"
  | "close"
  | "dismissReveal"
  | "enabledCount"
  | "globalDisabled"
  | "languageAuto"
  | "languageSelectLabel"
  | "menuOpenSettings"
  | "menuToggleEnabled"
  | "noActiveSettings"
  | "resetConfirm"
  | "resetSettings"
  | "revealRecommendations"
  | "settingsCodePrompt"
  | "settingsSubtitle"
  | "settingsTitle";

const translations = buildSupportedTranslationMap(
  {
    ja: {
      activeSettings: "有効中",
      close: "閉じる",
      dismissReveal: "今後表示しない",
      enabledCount: "有効な項目: {count}",
      globalDisabled: "全体設定: 無効",
      languageAuto: "自動（ブラウザ設定）",
      languageSelectLabel: "表示言語",
      menuOpenSettings: "YouTube UI Modifier 設定を開く",
      menuToggleEnabled: "YouTube UI Modifier 有効/無効",
      noActiveSettings: "現在オンになっている設定はありません。",
      resetConfirm: "YouTube UI Modifierの設定を初期化しますか？",
      resetSettings: "初期設定に戻す",
      revealRecommendations: "おすすめを表示する",
      settingsCodePrompt: "YouTube UI Modifierの設定コードを入力してください",
      settingsSubtitle:
        "YouTube UI 表示調整パネル - リアルタイムで設定反映・自動設定保存",
      settingsTitle: "YouTube UI Modifier",
    },
    en: {
      activeSettings: "Active",
      close: "Close",
      dismissReveal: "Do not show again",
      enabledCount: "Active items: {count}",
      globalDisabled: "Global setting: disabled",
      languageAuto: "Auto (browser setting)",
      languageSelectLabel: "Display language",
      menuOpenSettings: "Open YouTube UI Modifier settings",
      menuToggleEnabled: "Toggle YouTube UI Modifier",
      noActiveSettings: "No settings are currently on.",
      resetConfirm: "Reset YouTube UI Modifier settings?",
      resetSettings: "Restore defaults",
      revealRecommendations: "Show recommendations",
      settingsCodePrompt: "Enter the YouTube UI Modifier settings code",
      settingsSubtitle:
        "YouTube UI display adjustment panel - real-time changes and automatic saving",
      settingsTitle: "YouTube UI Modifier",
    },
    "zh-Hans": {
      activeSettings: "已启用",
      close: "关闭",
      dismissReveal: "以后不再显示",
      enabledCount: "启用项目：{count}",
      globalDisabled: "全局设置：已禁用",
      languageAuto: "自动（浏览器设置）",
      languageSelectLabel: "显示语言",
      menuOpenSettings: "打开 YouTube UI Modifier 设置",
      menuToggleEnabled: "切换 YouTube UI Modifier",
      noActiveSettings: "当前没有开启的设置。",
      resetConfirm: "重置 YouTube UI Modifier 设置？",
      resetSettings: "恢复默认值",
      revealRecommendations: "显示推荐",
      settingsCodePrompt: "请输入 YouTube UI Modifier 设置代码",
      settingsSubtitle: "YouTube UI 显示调整面板 - 实时变更并自动保存",
      settingsTitle: "YouTube UI Modifier",
    },
    hi: {
      activeSettings: "सक्रिय",
      close: "बंद करें",
      dismissReveal: "फिर न दिखाएं",
      enabledCount: "सक्रिय आइटम: {count}",
      globalDisabled: "वैश्विक सेटिंग: अक्षम",
      languageAuto: "स्वचालित (ब्राउज़र सेटिंग)",
      languageSelectLabel: "प्रदर्शन भाषा",
      menuOpenSettings: "YouTube UI Modifier सेटिंग्स खोलें",
      menuToggleEnabled: "YouTube UI Modifier टॉगल करें",
      noActiveSettings: "अभी कोई सेटिंग चालू नहीं है।",
      resetConfirm: "YouTube UI Modifier सेटिंग्स रीसेट करें?",
      resetSettings: "डिफ़ॉल्ट बहाल करें",
      revealRecommendations: "सुझाव दिखाएं",
      settingsCodePrompt: "YouTube UI Modifier सेटिंग कोड दर्ज करें",
      settingsSubtitle:
        "YouTube UI प्रदर्शन समायोजन पैनल - रीयल-टाइम बदलाव और स्वचालित सहेजना",
      settingsTitle: "YouTube UI Modifier",
    },
    es: {
      activeSettings: "Activo",
      close: "Cerrar",
      dismissReveal: "No volver a mostrar",
      enabledCount: "Elementos activos: {count}",
      globalDisabled: "Ajuste global: desactivado",
      languageAuto: "Automático (configuración del navegador)",
      languageSelectLabel: "Idioma de visualización",
      menuOpenSettings: "Abrir ajustes de YouTube UI Modifier",
      menuToggleEnabled: "Activar/desactivar YouTube UI Modifier",
      noActiveSettings: "No hay ajustes activos actualmente.",
      resetConfirm: "¿Restablecer los ajustes de YouTube UI Modifier?",
      resetSettings: "Restaurar valores predeterminados",
      revealRecommendations: "Mostrar recomendaciones",
      settingsCodePrompt:
        "Introduce el código de ajustes de YouTube UI Modifier",
      settingsSubtitle:
        "Panel de ajuste de visualización de YouTube UI - cambios en tiempo real y guardado automático",
      settingsTitle: "YouTube UI Modifier",
    },
    fr: {
      activeSettings: "Actif",
      close: "Fermer",
      dismissReveal: "Ne plus afficher",
      enabledCount: "Éléments actifs : {count}",
      globalDisabled: "Paramètre global : désactivé",
      languageAuto: "Auto (paramètre du navigateur)",
      languageSelectLabel: "Langue d'affichage",
      menuOpenSettings: "Ouvrir les paramètres de YouTube UI Modifier",
      menuToggleEnabled: "Activer/désactiver YouTube UI Modifier",
      noActiveSettings: "Aucun paramètre n'est actuellement activé.",
      resetConfirm: "Réinitialiser les paramètres de YouTube UI Modifier ?",
      resetSettings: "Restaurer les valeurs par défaut",
      revealRecommendations: "Afficher les recommandations",
      settingsCodePrompt:
        "Saisissez le code des paramètres de YouTube UI Modifier",
      settingsSubtitle:
        "Panneau d'ajustement de l'affichage YouTube UI - changements en temps réel et sauvegarde automatique",
      settingsTitle: "YouTube UI Modifier",
    },
    ar: {
      activeSettings: "نشط",
      close: "إغلاق",
      dismissReveal: "عدم العرض مرة أخرى",
      enabledCount: "العناصر النشطة: {count}",
      globalDisabled: "الإعداد العام: معطل",
      languageAuto: "تلقائي (إعداد المتصفح)",
      languageSelectLabel: "لغة العرض",
      menuOpenSettings: "فتح إعدادات YouTube UI Modifier",
      menuToggleEnabled: "تبديل YouTube UI Modifier",
      noActiveSettings: "لا توجد إعدادات مفعلة حاليا.",
      resetConfirm: "إعادة ضبط إعدادات YouTube UI Modifier؟",
      resetSettings: "استعادة الإعدادات الافتراضية",
      revealRecommendations: "عرض التوصيات",
      settingsCodePrompt: "أدخل رمز إعدادات YouTube UI Modifier",
      settingsSubtitle: "لوحة ضبط عرض YouTube UI - تغييرات فورية وحفظ تلقائي",
      settingsTitle: "YouTube UI Modifier",
    },
    pt: {
      activeSettings: "Ativo",
      close: "Fechar",
      dismissReveal: "Não mostrar novamente",
      enabledCount: "Itens ativos: {count}",
      globalDisabled: "Configuração global: desativada",
      languageAuto: "Automático (configuração do navegador)",
      languageSelectLabel: "Idioma de exibição",
      menuOpenSettings: "Abrir configurações do YouTube UI Modifier",
      menuToggleEnabled: "Alternar YouTube UI Modifier",
      noActiveSettings: "Nenhuma configuração está ativa no momento.",
      resetConfirm: "Redefinir configurações do YouTube UI Modifier?",
      resetSettings: "Restaurar padrões",
      revealRecommendations: "Mostrar recomendações",
      settingsCodePrompt:
        "Digite o código de configurações do YouTube UI Modifier",
      settingsSubtitle:
        "Painel de ajuste de exibição do YouTube UI - mudanças em tempo real e salvamento automático",
      settingsTitle: "YouTube UI Modifier",
    },
    bn: {
      activeSettings: "সক্রিয়",
      close: "বন্ধ করুন",
      dismissReveal: "আবার দেখাবেন না",
      enabledCount: "সক্রিয় আইটেম: {count}",
      globalDisabled: "গ্লোবাল সেটিং: নিষ্ক্রিয়",
      languageAuto: "স্বয়ংক্রিয় (ব্রাউজার সেটিং)",
      languageSelectLabel: "প্রদর্শন ভাষা",
      menuOpenSettings: "YouTube UI Modifier সেটিংস খুলুন",
      menuToggleEnabled: "YouTube UI Modifier চালু/বন্ধ করুন",
      noActiveSettings: "বর্তমানে কোনো সেটিং চালু নেই।",
      resetConfirm: "YouTube UI Modifier সেটিংস রিসেট করবেন?",
      resetSettings: "ডিফল্টে ফিরিয়ে আনুন",
      revealRecommendations: "সুপারিশ দেখান",
      settingsCodePrompt: "YouTube UI Modifier সেটিংস কোড লিখুন",
      settingsSubtitle:
        "YouTube UI প্রদর্শন সমন্বয় প্যানেল - রিয়েল-টাইম পরিবর্তন ও স্বয়ংক্রিয় সংরক্ষণ",
      settingsTitle: "YouTube UI Modifier",
    },
    ru: {
      activeSettings: "Активно",
      close: "Закрыть",
      dismissReveal: "Больше не показывать",
      enabledCount: "Активных пунктов: {count}",
      globalDisabled: "Глобальная настройка: отключено",
      languageAuto: "Авто (настройка браузера)",
      languageSelectLabel: "Язык интерфейса",
      menuOpenSettings: "Открыть настройки YouTube UI Modifier",
      menuToggleEnabled: "Переключить YouTube UI Modifier",
      noActiveSettings: "Сейчас нет включенных настроек.",
      resetConfirm: "Сбросить настройки YouTube UI Modifier?",
      resetSettings: "Вернуть значения по умолчанию",
      revealRecommendations: "Показать рекомендации",
      settingsCodePrompt: "Введите код настроек YouTube UI Modifier",
      settingsSubtitle:
        "Панель настройки отображения YouTube UI - изменения в реальном времени и автосохранение",
      settingsTitle: "YouTube UI Modifier",
    },
    ur: {
      activeSettings: "فعال",
      close: "بند کریں",
      dismissReveal: "دوبارہ نہ دکھائیں",
      enabledCount: "فعال آئٹمز: {count}",
      globalDisabled: "عالمی سیٹنگ: غیر فعال",
      languageAuto: "خودکار (براؤزر سیٹنگ)",
      languageSelectLabel: "ڈسپلے زبان",
      menuOpenSettings: "YouTube UI Modifier سیٹنگز کھولیں",
      menuToggleEnabled: "YouTube UI Modifier ٹوگل کریں",
      noActiveSettings: "فی الحال کوئی سیٹنگ آن نہیں ہے۔",
      resetConfirm: "YouTube UI Modifier سیٹنگز ری سیٹ کریں؟",
      resetSettings: "ڈیفالٹس بحال کریں",
      revealRecommendations: "سفارشات دکھائیں",
      settingsCodePrompt: "YouTube UI Modifier سیٹنگز کوڈ درج کریں",
      settingsSubtitle:
        "YouTube UI ڈسپلے ایڈجسٹمنٹ پینل - ریئل ٹائم تبدیلیاں اور خودکار محفوظ کرنا",
      settingsTitle: "YouTube UI Modifier",
    },
  },
  "en",
);

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;

export function applyLanguageSetting(
  language: YoutubeUiModifierLanguageSetting,
): void {
  i18n.setLocale(language === "auto" ? i18n.detectBrowserLocale() : language);
}

export function getCurrentLocale(): LocaleCode {
  return i18n.getLocale();
}

export function getTextDirection(): "ltr" | "rtl" {
  return i18n.getDirection();
}

export function getLanguageOptions(): ReadonlyArray<{
  value: YoutubeUiModifierLanguageSetting;
  label: string;
}> {
  return [
    {
      value: "auto",
      label: t("languageAuto"),
    },
    ...i18n.locales.map((locale) => {
      const metadata = getLocaleMetadata(locale);
      return {
        value: locale,
        label:
          metadata.nativeName === metadata.englishName
            ? metadata.nativeName
            : `${metadata.nativeName} (${metadata.englishName})`,
      };
    }),
  ];
}

const categoryLabels: Partial<Record<LocaleCode, Record<string, string>>> = {
  en: {
    channel: "Channel",
    comments: "Comments",
    general: "General",
    homepage: "Home",
    navigation: "Left navigation",
    other: "Other",
    redirects: "Redirects",
    search: "Search",
    subscriptions: "Subscriptions",
    watch: "Watch page",
  },
  "zh-Hans": {
    channel: "频道",
    comments: "评论",
    general: "一般",
    homepage: "首页",
    navigation: "左侧导航",
    other: "其他",
    redirects: "重定向",
    search: "搜索",
    subscriptions: "订阅",
    watch: "观看页面",
  },
  hi: {
    channel: "चैनल",
    comments: "टिप्पणियाँ",
    general: "सामान्य",
    homepage: "घर",
    navigation: "बायां नेविगेशन",
    other: "अन्य",
    redirects: "पुनर्निर्देशन",
    search: "खोजें",
    subscriptions: "सदस्यताएँ",
    watch: "पेज देखें",
  },
  es: {
    channel: "canal",
    comments: "Comentarios",
    general: "generales",
    homepage: "Inicio",
    navigation: "Navegación izquierda",
    other: "Otro",
    redirects: "Redirecciones",
    search: "Buscar",
    subscriptions: "Suscripciones",
    watch: "Ver página",
  },
  fr: {
    channel: "Chaîne",
    comments: "Commentaires",
    general: "Général",
    homepage: "Accueil",
    navigation: "Navigation de gauche",
    other: "Autre",
    redirects: "Redirections",
    search: "Rechercher",
    subscriptions: "Abonnements",
    watch: "Regarder la page",
  },
  ar: {
    channel: "قناة",
    comments: "التعليقات",
    general: "عام",
    homepage: "الصفحة الرئيسية",
    navigation: "الملاحة اليسرى",
    other: "أخرى",
    redirects: "عمليات إعادة التوجيه",
    search: "بحث",
    subscriptions: "الاشتراكات",
    watch: "صفحة المشاهدة",
  },
  pt: {
    channel: "Canal",
    comments: "Comentários",
    general: "Geral",
    homepage: "Página inicial",
    navigation: "Navegação à esquerda",
    other: "Outro",
    redirects: "Redirecionamentos",
    search: "Pesquisar",
    subscriptions: "Assinaturas",
    watch: "Assistir página",
  },
  bn: {
    channel: "চ্যানেল",
    comments: "মন্তব্য",
    general: "সাধারণ",
    homepage: "বাড়ি",
    navigation: "বাম নেভিগেশন",
    other: "অন্যান্য",
    redirects: "পুনঃনির্দেশ",
    search: "অনুসন্ধান করুন",
    subscriptions: "সদস্যতা",
    watch: "দেখুন পাতা",
  },
  ru: {
    channel: "Канал",
    comments: "Комментарии",
    general: "Общий",
    homepage: "Главная",
    navigation: "Левая навигация",
    other: "Другое",
    redirects: "Перенаправления",
    search: "Поиск",
    subscriptions: "Подписки",
    watch: "Страница просмотра",
  },
  ur: {
    channel: "چینل",
    comments: "تبصرے",
    general: "جنرل",
    homepage: "گھر",
    navigation: "بائیں نیویگیشن",
    other: "دیگر",
    redirects: "ری ڈائریکٹ کرتا ہے۔",
    search: "تلاش کریں۔",
    subscriptions: "سبسکرپشنز",
    watch: "صفحہ دیکھیں",
  },
};

const optionLabels: Partial<
  Record<LocaleCode, Record<YoutubeUiModifierSettingId, string>>
> = {
  en: {
    autofocusSearch: "Auto-focus search box",
    autoSkipAds: "Skip and close ads",
    blurVideoThumbnails: "Blur thumbnails",
    disableAmbientMode: "Disable ambient mode",
    disableAnnotations: "Disable annotations",
    disableAutoplay: "Disable autoplay",
    disableFullscreenScroll: "Stop scrolling in fullscreen",
    disableLogoLink: "Disable YouTube logo link",
    disablePlayOnHover: "Hide hover playback preview",
    enableTheaterMode: "Enable theater mode",
    expandDescription: "Auto-expand description",
    globalEnabled: "Enable YouTube UI Modifier",
    grayscaleMode: "Grayscale display",
    hideAds: "Hide ad slots",
    hideAllShorts: "Hide Shorts",
    hideChannelAutoplay: "Stop channel video autoplay",
    hideChannelForYou: "Hide For You section",
    hideChannelSubscribers: "Hide subscriber count",
    hideClipButton: "Hide Clip button",
    hideCommentProfiles: "Hide comment author icons",
    hideCommentReplies: "Hide replies",
    hideCommentUpvotes: "Hide comment like counts",
    hideCommentUsernames: "Hide comment author names",
    hideComments: "Hide comments",
    hideContextBoxes: "Hide context boxes",
    hideCreateButton: "Hide Create button",
    hideEmbeddedMoreVideos: "Hide embedded player suggestions",
    hideEndScreen: "Hide end screen recommendations",
    hideEntireWatchSidebar: "Hide the whole sidebar area",
    hideExploreLink: "Hide Explore links",
    hideExploreSection: "Hide Explore section",
    hideExtraSidebarTags: "Limit related-video tags",
    hideFooterSection: "Hide left-nav footer",
    hideHomeLink: "Hide Home link",
    hideHomepageExtraRows: "Hide extra Home shelves",
    hideHomepageHeader: "Hide Home chip bar",
    hideHomepageInfiniteScroll: "Stop Home infinite scroll",
    hideHomepageSuggestions: "Hide Home recommendations",
    hideInfoCards: "Hide info cards",
    hideLeftNavigation: "Hide all left navigation",
    hideLiveChat: "Hide live chat",
    hideMoreFromYoutubeSection: "Hide other YouTube sections",
    hideNextButton: "Hide Next button",
    hideNonTimestampComments: "Hide comments without timestamp links",
    hideNotificationBell: "Hide notification bell",
    hideOverlaySuggestions: "Hide overlay suggestions",
    hidePlayables: "Hide Playables",
    hidePlaylistSuggestions: "Hide playlist suggestions",
    hideQuickLinksSection: "Hide You/Library sections",
    hideSearchDescriptions: "Hide search result descriptions",
    hideSearchExtraResults: "Hide extra search shelves",
    hideSearchInfiniteScroll: "Stop search infinite scroll",
    hideSearchPromoted: "Hide search ads",
    hideSearchShorts: "Hide Shorts in search results",
    hideSearchSuggestions: "Hide search suggestions",
    hideSettingsSection: "Hide settings section",
    hideShortsLink: "Hide Shorts links",
    hideSidebarInfiniteScroll: "Stop related-video infinite scroll",
    hideSubscriptionLive: "Hide live videos",
    hideSubscriptionMostRelevant: "Hide Most relevant shelf",
    hideSubscriptionPremiere: "Hide premieres",
    hideSubscriptionShorts: "Hide Shorts on Subscriptions",
    hideSubscriptionUpcoming: "Hide upcoming videos",
    hideSubscriptionVods: "Hide streamed archives",
    hideSubscriptionsLink: "Hide Subscriptions link",
    hideSubscriptionsSection: "Hide subscriptions section",
    hideThumbnailHoverOverlay: "Hide thumbnail hover effects",
    hideVideoActions: "Hide Like/Share actions",
    hideVideoDescription: "Hide description",
    hideVideoLikes: "Hide like count",
    hideVideoThumbnails: "Hide thumbnails",
    hideWatchSidebar: "Hide related-video sidebar",
    lockSettingsWithCode: "Lock settings with a code",
    lockSettingsWithTimer: "Lock settings with a 10-second timer",
    normalizeShorts: "Open Shorts in normal player",
    onlyShowPlaylists: "Show only playlists",
    redirectHomeToLibrary: "Redirect Home to You page",
    redirectHomeToSubscriptions: "Redirect Home to Subscriptions",
    redirectHomeToWatchLater: "Redirect Home to Watch Later",
    reverseChannelVideos: "Reverse channel video order",
    scheduleEnabled: "Enable only during weekday work hours",
    searchEngineMode: "Search engine mode",
    showEndScreenRevealBox: "Show reveal box on end screen",
    showHomepageRevealBox: "Show reveal box on Home",
    showOnlyFirstHomepageRow: "Keep only the first Home row",
    showSidebarRevealBox: "Show reveal box for related videos",
    shrinkVideoThumbnails: "Shrink thumbnails",
  },
  "zh-Hans": {
    autofocusSearch: "自动对焦搜索框",
    autoSkipAds: "跳过并关闭广告",
    blurVideoThumbnails: "模糊缩略图",
    disableAmbientMode: "禁用环境模式",
    disableAnnotations: "禁用注释",
    disableAutoplay: "禁用自动播放",
    disableFullscreenScroll: "停止全屏滚动",
    disableLogoLink: "禁用 YouTube 徽标链接",
    disablePlayOnHover: "隐藏悬停播放预览",
    enableTheaterMode: "启用影院模式",
    expandDescription: "自动展开描述",
    globalEnabled: "启用 YouTube 用户界面修改器",
    grayscaleMode: "灰度显示",
    hideAds: "隐藏广告位",
    hideAllShorts: "隐藏短裤",
    hideChannelAutoplay: "停止频道视频自动播放",
    hideChannelForYou: "为您隐藏部分",
    hideChannelSubscribers: "隐藏订阅者数量",
    hideClipButton: "隐藏剪辑按钮",
    hideCommentProfiles: "隐藏评论作者图标",
    hideCommentReplies: "隐藏回复",
    hideCommentUpvotes: "隐藏评论点赞数",
    hideCommentUsernames: "隐藏评论作者姓名",
    hideComments: "隐藏评论",
    hideContextBoxes: "隐藏上下文框",
    hideCreateButton: "隐藏创建按钮",
    hideEmbeddedMoreVideos: "隐藏嵌入式播放器建议",
    hideEndScreen: "隐藏片尾画面推荐",
    hideEntireWatchSidebar: "隐藏整个侧边栏区域",
    hideExploreLink: "隐藏探索链接",
    hideExploreSection: "隐藏探索部分",
    hideExtraSidebarTags: "限制相关视频标签",
    hideFooterSection: "隐藏左侧导航页脚",
    hideHomeLink: "隐藏主页链接",
    hideHomepageExtraRows: "隐藏额外的家庭架子",
    hideHomepageHeader: "隐藏首页筹码栏",
    hideHomepageInfiniteScroll: "停止主页无限滚动",
    hideHomepageSuggestions: "隐藏首页推荐",
    hideInfoCards: "隐藏信息卡",
    hideLeftNavigation: "隐藏所有左侧导航",
    hideLiveChat: "隐藏实时聊天",
    hideMoreFromYoutubeSection: "隐藏其他 YouTube 部分",
    hideNextButton: "隐藏下一步按钮",
    hideNonTimestampComments: "隐藏没有时间戳链接的评论",
    hideNotificationBell: "隐藏通知铃声",
    hideOverlaySuggestions: "隐藏叠加建议",
    hidePlayables: "隐藏可玩内容",
    hidePlaylistSuggestions: "隐藏播放列表建议",
    hideQuickLinksSection: "隐藏您/图书馆部分",
    hideSearchDescriptions: "隐藏搜索结果描述",
    hideSearchExtraResults: "隐藏额外的搜索架",
    hideSearchInfiniteScroll: "停止搜索无限滚动",
    hideSearchPromoted: "隐藏搜索广告",
    hideSearchShorts: "在搜索结果中隐藏 Shorts 内容",
    hideSearchSuggestions: "隐藏搜索建议",
    hideSettingsSection: "隐藏设置部分",
    hideShortsLink: "隐藏 Shorts 链接",
    hideSidebarInfiniteScroll: "停止相关视频无限滚动",
    hideSubscriptionLive: "隐藏直播视频",
    hideSubscriptionMostRelevant: "隐藏最相关的货架",
    hideSubscriptionPremiere: "隐藏首映",
    hideSubscriptionShorts: "在订阅中隐藏 Shorts",
    hideSubscriptionUpcoming: "隐藏即将播放的视频",
    hideSubscriptionVods: "隐藏流式存档",
    hideSubscriptionsLink: "隐藏订阅链接",
    hideSubscriptionsSection: "隐藏订阅部分",
    hideThumbnailHoverOverlay: "隐藏缩略图悬停效果",
    hideVideoActions: "隐藏点赞/分享操作",
    hideVideoDescription: "隐藏描述",
    hideVideoLikes: "隐藏喜欢计数",
    hideVideoThumbnails: "隐藏缩略图",
    hideWatchSidebar: "隐藏相关视频侧边栏",
    lockSettingsWithCode: "使用代码锁定设置",
    lockSettingsWithTimer: "使用 10 秒计时器锁定设置",
    normalizeShorts: "在普通播放器中打开 Shorts",
    onlyShowPlaylists: "仅显示播放列表",
    redirectHomeToLibrary: "将主页重定向到您的页面",
    redirectHomeToSubscriptions: "将主页重定向到订阅",
    redirectHomeToWatchLater: "重定向首页以供稍后观看",
    reverseChannelVideos: "反向通道视频顺序",
    scheduleEnabled: "仅在工作日工作时间启用",
    searchEngineMode: "搜索引擎模式",
    showEndScreenRevealBox: "在片尾屏幕上显示显示框",
    showHomepageRevealBox: "在主页上显示显示框",
    showOnlyFirstHomepageRow: "仅保留第一个主行",
    showSidebarRevealBox: "显示相关视频的显示框",
    shrinkVideoThumbnails: "缩小缩略图",
  },
  hi: {
    autofocusSearch: "ऑटो-फ़ोकस खोज बॉक्स",
    autoSkipAds: "विज्ञापन छोड़ें और बंद करें",
    blurVideoThumbnails: "थंबनेल धुंधला करें",
    disableAmbientMode: "परिवेश मोड अक्षम करें",
    disableAnnotations: "एनोटेशन अक्षम करें",
    disableAutoplay: "ऑटोप्ले अक्षम करें",
    disableFullscreenScroll: "फ़ुलस्क्रीन में स्क्रॉल करना बंद करें",
    disableLogoLink: "YouTube लोगो लिंक अक्षम करें",
    disablePlayOnHover: "होवर प्लेबैक पूर्वावलोकन छिपाएँ",
    enableTheaterMode: "थिएटर मोड सक्षम करें",
    expandDescription: "विवरण स्वतः विस्तृत करें",
    globalEnabled: "YouTube UI संशोधक सक्षम करें",
    grayscaleMode: "ग्रेस्केल डिस्प्ले",
    hideAds: "विज्ञापन स्लॉट छिपाएँ",
    hideAllShorts: "शॉर्ट्स छुपाएं",
    hideChannelAutoplay: "चैनल वीडियो ऑटोप्ले बंद करें",
    hideChannelForYou: "आपके लिए छिपाएँ अनुभाग",
    hideChannelSubscribers: "ग्राहक संख्या छिपाएँ",
    hideClipButton: "क्लिप बटन छिपाएँ",
    hideCommentProfiles: "टिप्पणी लेखक चिह्न छिपाएँ",
    hideCommentReplies: "उत्तर छिपाएँ",
    hideCommentUpvotes: "गिनती की तरह टिप्पणी छिपाएँ",
    hideCommentUsernames: "टिप्पणी लेखक के नाम छिपाएँ",
    hideComments: "टिप्पणियाँ छिपाएँ",
    hideContextBoxes: "संदर्भ बक्से छिपाएँ",
    hideCreateButton: "बनाएँ बटन छिपाएँ",
    hideEmbeddedMoreVideos: "एम्बेडेड प्लेयर सुझाव छिपाएँ",
    hideEndScreen: "एंड स्क्रीन अनुशंसाएँ छुपाएँ",
    hideEntireWatchSidebar: "संपूर्ण साइडबार क्षेत्र छिपाएँ",
    hideExploreLink: "लिंक खोजें छुपाएं",
    hideExploreSection: "अन्वेषण अनुभाग छिपाएँ",
    hideExtraSidebarTags: "संबंधित-वीडियो टैग सीमित करें",
    hideFooterSection: "बाएँ-नेव पाद लेख को छिपाएँ",
    hideHomeLink: "होम लिंक छिपाएँ",
    hideHomepageExtraRows: "घर की अतिरिक्त अलमारियाँ छिपाएँ",
    hideHomepageHeader: "होम चिप बार छिपाएँ",
    hideHomepageInfiniteScroll: "होम अनंत स्क्रॉल बंद करो",
    hideHomepageSuggestions: "होम सिफ़ारिशें छिपाएँ",
    hideInfoCards: "जानकारी कार्ड छिपाएँ",
    hideLeftNavigation: "सभी बाएँ नेविगेशन छिपाएँ",
    hideLiveChat: "लाइव चैट छुपाएं",
    hideMoreFromYoutubeSection: "अन्य YouTube अनुभाग छिपाएँ",
    hideNextButton: "अगला बटन छिपाएँ",
    hideNonTimestampComments: "टाइमस्टैम्प लिंक के बिना टिप्पणियाँ छिपाएँ",
    hideNotificationBell: "अधिसूचना घंटी छिपाएँ",
    hideOverlaySuggestions: "ओवरले सुझाव छिपाएँ",
    hidePlayables: "बजाने योग्य वस्तुएं छुपाएं",
    hidePlaylistSuggestions: "प्लेलिस्ट सुझाव छिपाएँ",
    hideQuickLinksSection: "आप/पुस्तकालय अनुभाग छिपाएँ",
    hideSearchDescriptions: "खोज परिणाम विवरण छिपाएँ",
    hideSearchExtraResults: "अतिरिक्त खोज अलमारियाँ छिपाएँ",
    hideSearchInfiniteScroll: "अनंत स्क्रॉल खोजना बंद करें",
    hideSearchPromoted: "खोज विज्ञापन छिपाएँ",
    hideSearchShorts: "खोज परिणामों में शॉर्ट्स छिपाएँ",
    hideSearchSuggestions: "खोज सुझाव छिपाएँ",
    hideSettingsSection: "सेटिंग्स अनुभाग छिपाएँ",
    hideShortsLink: "शॉर्ट्स लिंक छिपाएँ",
    hideSidebarInfiniteScroll: "संबंधित-वीडियो अनंत स्क्रॉल बंद करें",
    hideSubscriptionLive: "लाइव वीडियो छुपाएं",
    hideSubscriptionMostRelevant: "सर्वाधिक प्रासंगिक शेल्फ छिपाएँ",
    hideSubscriptionPremiere: "प्रीमियर छुपाएं",
    hideSubscriptionShorts: "सब्सक्रिप्शन पर शॉर्ट्स छिपाएँ",
    hideSubscriptionUpcoming: "आने वाले वीडियो छिपाएँ",
    hideSubscriptionVods: "स्ट्रीम किए गए पुरालेख छिपाएँ",
    hideSubscriptionsLink: "सदस्यता लिंक छिपाएँ",
    hideSubscriptionsSection: "सदस्यता अनुभाग छिपाएँ",
    hideThumbnailHoverOverlay: "थंबनेल होवर प्रभाव छिपाएँ",
    hideVideoActions: "लाइक/शेयर क्रियाएं छिपाएं",
    hideVideoDescription: "विवरण छिपाएँ",
    hideVideoLikes: "गिनती की तरह छिपाओ",
    hideVideoThumbnails: "थंबनेल छिपाएँ",
    hideWatchSidebar: "संबंधित-वीडियो साइडबार छिपाएँ",
    lockSettingsWithCode: "एक कोड के साथ सेटिंग्स लॉक करें",
    lockSettingsWithTimer: "10 सेकंड के टाइमर के साथ सेटिंग्स लॉक करें",
    normalizeShorts: "शॉर्ट्स को सामान्य प्लेयर में खोलें",
    onlyShowPlaylists: "केवल प्लेलिस्ट दिखाएं",
    redirectHomeToLibrary: "होम टू यू पेज को रीडायरेक्ट करें",
    redirectHomeToSubscriptions: "होम को सदस्यता पर पुनर्निर्देशित करें",
    redirectHomeToWatchLater: "बाद में देखने के लिए होम रीडायरेक्ट करें",
    reverseChannelVideos: "रिवर्स चैनल वीडियो क्रम",
    scheduleEnabled: "केवल कार्यदिवस के कार्य घंटों के दौरान सक्षम करें",
    searchEngineMode: "खोज इंजन मोड",
    showEndScreenRevealBox: "एंड स्क्रीन पर रिवील बॉक्स दिखाएँ",
    showHomepageRevealBox: "होम पर रिवील बॉक्स दिखाएँ",
    showOnlyFirstHomepageRow: "केवल पहली होम पंक्ति रखें",
    showSidebarRevealBox: "संबंधित वीडियो के लिए रिवील बॉक्स दिखाएं",
    shrinkVideoThumbnails: "थंबनेल सिकोड़ें",
  },
  fr: {
    autofocusSearch: "Champ de recherche avec mise au point automatique",
    autoSkipAds: "Ignorer et fermer les annonces",
    blurVideoThumbnails: "Flou des vignettes",
    disableAmbientMode: "Désactiver le mode ambiant",
    disableAnnotations: "Désactiver les annotations",
    disableAutoplay: "Désactiver la lecture automatique",
    disableFullscreenScroll: "Arrêter de défiler en plein écran",
    disableLogoLink: "Désactiver le lien du logo YouTube",
    disablePlayOnHover: "Masquer l'aperçu de la lecture au survol",
    enableTheaterMode: "Activer le mode cinéma",
    expandDescription: "Description à développer automatiquement",
    globalEnabled: "Activer le modificateur de l'interface utilisateur YouTube",
    grayscaleMode: "Affichage en niveaux de gris",
    hideAds: "Masquer les espaces publicitaires",
    hideAllShorts: "Masquer les courts métrages",
    hideChannelAutoplay:
      "Arrêter la lecture automatique de la vidéo de la chaîne",
    hideChannelForYou: "Section Masquer pour vous",
    hideChannelSubscribers: "Masquer le nombre d'abonnés",
    hideClipButton: "Masquer le bouton Clip",
    hideCommentProfiles: "Masquer les icônes de l'auteur du commentaire",
    hideCommentReplies: "Masquer les réponses",
    hideCommentUpvotes: "Masquer le commentaire comme compte",
    hideCommentUsernames: "Masquer les noms des auteurs des commentaires",
    hideComments: "Masquer les commentaires",
    hideContextBoxes: "Masquer les zones contextuelles",
    hideCreateButton: "Masquer le bouton Créer",
    hideEmbeddedMoreVideos: "Masquer les suggestions de joueurs intégrées",
    hideEndScreen: "Masquer les recommandations de l'écran de fin",
    hideEntireWatchSidebar: "Masquer toute la zone de la barre latérale",
    hideExploreLink: "Masquer les liens Explorer",
    hideExploreSection: "Masquer la section Explorer",
    hideExtraSidebarTags: "Limiter les balises de vidéos associées",
    hideFooterSection: "Masquer le pied de page de navigation gauche",
    hideHomeLink: "Masquer le lien Accueil",
    hideHomepageExtraRows: "Masquer les étagères supplémentaires de la maison",
    hideHomepageHeader: "Masquer la barre de jetons Accueil",
    hideHomepageInfiniteScroll: "Arrêter le défilement infini de la maison",
    hideHomepageSuggestions: "Masquer les recommandations pour la maison",
    hideInfoCards: "Masquer les fiches d'informations",
    hideLeftNavigation: "Masquer toute la navigation de gauche",
    hideLiveChat: "Masquer le chat en direct",
    hideMoreFromYoutubeSection: "Masquer les autres sections YouTube",
    hideNextButton: "Masquer le bouton Suivant",
    hideNonTimestampComments:
      "Masquer les commentaires sans liens d'horodatage",
    hideNotificationBell: "Masquer la cloche de notification",
    hideOverlaySuggestions: "Masquer les suggestions de superposition",
    hidePlayables: "Masquer les éléments jouables",
    hidePlaylistSuggestions: "Masquer les suggestions de playlist",
    hideQuickLinksSection: "Masquer les sections Vous/Bibliothèque",
    hideSearchDescriptions:
      "Masquer les descriptions des résultats de recherche",
    hideSearchExtraResults: "Masquer les étagères de recherche supplémentaires",
    hideSearchInfiniteScroll: "Arrêter la recherche défilement infini",
    hideSearchPromoted: "Masquer les annonces de recherche",
    hideSearchShorts:
      "Masquer les courts métrages dans les résultats de recherche",
    hideSearchSuggestions: "Masquer les suggestions de recherche",
    hideSettingsSection: "Masquer la section des paramètres",
    hideShortsLink: "Masquer les liens vers les Shorts",
    hideSidebarInfiniteScroll:
      "Arrêter le défilement infini des vidéos associées",
    hideSubscriptionLive: "Masquer les vidéos en direct",
    hideSubscriptionMostRelevant: "Masquer l'étagère la plus pertinente",
    hideSubscriptionPremiere: "Masquer les premières",
    hideSubscriptionShorts: "Masquer les courts métrages sur les abonnements",
    hideSubscriptionUpcoming: "Masquer les vidéos à venir",
    hideSubscriptionVods: "Masquer les archives diffusées",
    hideSubscriptionsLink: "Masquer le lien des abonnements",
    hideSubscriptionsSection: "Masquer la section abonnements",
    hideThumbnailHoverOverlay: "Masquer les effets de survol des vignettes",
    hideVideoActions: "Masquer les actions J'aime/Partager",
    hideVideoDescription: "Masquer la description",
    hideVideoLikes: "Cacher comme compte",
    hideVideoThumbnails: "Masquer les vignettes",
    hideWatchSidebar: "Masquer la barre latérale des vidéos associées",
    lockSettingsWithCode: "Verrouiller les paramètres avec un code",
    lockSettingsWithTimer:
      "Verrouiller les paramètres avec une minuterie de 10 secondes",
    normalizeShorts: "Ouvrir les shorts dans le lecteur normal",
    onlyShowPlaylists: "Afficher uniquement les listes de lecture",
    redirectHomeToLibrary: "Rediriger la page d'accueil vers vous",
    redirectHomeToSubscriptions:
      "Rediriger la page d'accueil vers les abonnements",
    redirectHomeToWatchLater:
      "Rediriger vers la page d'accueil pour regarder plus tard",
    reverseChannelVideos: "Ordre vidéo des canaux inversés",
    scheduleEnabled:
      "Activer uniquement pendant les heures de travail en semaine",
    searchEngineMode: "Mode moteur de recherche",
    showEndScreenRevealBox:
      "Afficher la boîte de révélation sur l'écran de fin",
    showHomepageRevealBox:
      "Afficher la boîte de révélation sur la page d'accueil",
    showOnlyFirstHomepageRow:
      "Conserver uniquement la première ligne d'accueil",
    showSidebarRevealBox:
      "Afficher la zone de révélation pour les vidéos associées",
    shrinkVideoThumbnails: "Réduire les vignettes",
  },
  pt: {
    autofocusSearch: "Caixa de pesquisa com foco automático",
    autoSkipAds: "Pular e fechar anúncios",
    blurVideoThumbnails: "Desfocar miniaturas",
    disableAmbientMode: "Desativar modo ambiente",
    disableAnnotations: "Desativar anotações",
    disableAutoplay: "Desativar reprodução automática",
    disableFullscreenScroll: "Pare de rolar em tela cheia",
    disableLogoLink: "Desativar link do logotipo do YouTube",
    disablePlayOnHover: "Ocultar visualização da reprodução instantânea",
    enableTheaterMode: "Ativar modo teatro",
    expandDescription: "Descrição de expansão automática",
    globalEnabled: "Ativar modificador de interface do YouTube",
    grayscaleMode: "Exibição em escala de cinza",
    hideAds: "Ocultar espaços de anúncio",
    hideAllShorts: "Ocultar Shorts",
    hideChannelAutoplay:
      "Interromper a reprodução automática do vídeo do canal",
    hideChannelForYou: "Seção Ocultar para você",
    hideChannelSubscribers: "Ocultar contagem de assinantes",
    hideClipButton: "Botão Ocultar clipe",
    hideCommentProfiles: "Ocultar ícones de autores de comentários",
    hideCommentReplies: "Ocultar respostas",
    hideCommentUpvotes: "Ocultar comentários como contagens",
    hideCommentUsernames: "Ocultar nomes de autores de comentários",
    hideComments: "Ocultar comentários",
    hideContextBoxes: "Ocultar caixas de contexto",
    hideCreateButton: "Ocultar botão Criar",
    hideEmbeddedMoreVideos: "Ocultar sugestões de players incorporados",
    hideEndScreen: "Ocultar recomendações da tela final",
    hideEntireWatchSidebar: "Ocultar toda a área da barra lateral",
    hideExploreLink: "Ocultar links Explorar",
    hideExploreSection: "Ocultar seção Explorar",
    hideExtraSidebarTags: "Limitar tags de vídeos relacionados",
    hideFooterSection: "Ocultar rodapé de navegação à esquerda",
    hideHomeLink: "Ocultar link inicial",
    hideHomepageExtraRows: "Ocultar prateleiras extras da casa",
    hideHomepageHeader: "Ocultar barra de fichas inicial",
    hideHomepageInfiniteScroll: "Parar rolagem infinita inicial",
    hideHomepageSuggestions: "Ocultar recomendações da página inicial",
    hideInfoCards: "Ocultar cartões de informações",
    hideLeftNavigation: "Ocultar toda a navegação à esquerda",
    hideLiveChat: "Ocultar chat ao vivo",
    hideMoreFromYoutubeSection: "Ocultar outras seções do YouTube",
    hideNextButton: "Ocultar botão Próximo",
    hideNonTimestampComments:
      "Ocultar comentários sem links de carimbo de data/hora",
    hideNotificationBell: "Ocultar sino de notificação",
    hideOverlaySuggestions: "Ocultar sugestões de sobreposição",
    hidePlayables: "Ocultar jogáveis",
    hidePlaylistSuggestions: "Ocultar sugestões de playlists",
    hideQuickLinksSection: "Seções Ocultar você/Biblioteca",
    hideSearchDescriptions: "Ocultar descrições dos resultados da pesquisa",
    hideSearchExtraResults: "Ocultar prateleiras de pesquisa extras",
    hideSearchInfiniteScroll: "Pare de pesquisar rolagem infinita",
    hideSearchPromoted: "Ocultar anúncios de pesquisa",
    hideSearchShorts: "Ocultar Shorts nos resultados da pesquisa",
    hideSearchSuggestions: "Ocultar sugestões de pesquisa",
    hideSettingsSection: "Ocultar seção de configurações",
    hideShortsLink: "Ocultar links de Shorts",
    hideSidebarInfiniteScroll:
      "Interromper a rolagem infinita do vídeo relacionado",
    hideSubscriptionLive: "Ocultar vídeos ao vivo",
    hideSubscriptionMostRelevant: "Ocultar estante mais relevante",
    hideSubscriptionPremiere: "Ocultar estreias",
    hideSubscriptionShorts: "Ocultar Shorts nas Assinaturas",
    hideSubscriptionUpcoming: "Ocultar os próximos vídeos",
    hideSubscriptionVods: "Ocultar arquivos transmitidos",
    hideSubscriptionsLink: "Ocultar link de assinaturas",
    hideSubscriptionsSection: "Ocultar seção de assinaturas",
    hideThumbnailHoverOverlay: "Ocultar efeitos de foco em miniatura",
    hideVideoActions: "Ocultar ações Curtir/Compartilhar",
    hideVideoDescription: "Ocultar descrição",
    hideVideoLikes: "Ocultar contagem de curtidas",
    hideVideoThumbnails: "Ocultar miniaturas",
    hideWatchSidebar: "Ocultar barra lateral de vídeos relacionados",
    lockSettingsWithCode: "Bloqueie as configurações com um código",
    lockSettingsWithTimer:
      "Bloqueie as configurações com um temporizador de 10 segundos",
    normalizeShorts: "Shorts abertos no player normal",
    onlyShowPlaylists: "Mostrar apenas playlists",
    redirectHomeToLibrary: "Redirecionar página inicial para você",
    redirectHomeToSubscriptions: "Redirecionar página inicial para assinaturas",
    redirectHomeToWatchLater: "Redirecionar para casa para assistir mais tarde",
    reverseChannelVideos: "Ordem reversa do vídeo do canal",
    scheduleEnabled:
      "Ativar apenas durante o horário de trabalho durante a semana",
    searchEngineMode: "Modo mecanismo de pesquisa",
    showEndScreenRevealBox: "Mostrar caixa de revelação na tela final",
    showHomepageRevealBox: "Mostrar caixa de revelação na página inicial",
    showOnlyFirstHomepageRow: "Mantenha apenas a primeira linha inicial",
    showSidebarRevealBox: "Mostrar caixa de revelação para vídeos relacionados",
    shrinkVideoThumbnails: "Reduzir miniaturas",
  },
  bn: {
    autofocusSearch: "অটো-ফোকাস অনুসন্ধান বাক্স",
    autoSkipAds: "এড়িয়ে যান এবং বিজ্ঞাপন বন্ধ করুন",
    blurVideoThumbnails: "থাম্বনেলগুলি ঝাপসা করুন",
    disableAmbientMode: "অ্যাম্বিয়েন্ট মোড অক্ষম করুন",
    disableAnnotations: "টীকা অক্ষম করুন",
    disableAutoplay: "অটোপ্লে অক্ষম করুন",
    disableFullscreenScroll: "পূর্ণস্ক্রীনে স্ক্রোল করা বন্ধ করুন",
    disableLogoLink: "YouTube লোগো লিঙ্ক অক্ষম করুন",
    disablePlayOnHover: "হোভার প্লেব্যাক প্রিভিউ লুকান",
    enableTheaterMode: "থিয়েটার মোড সক্ষম করুন",
    expandDescription: "স্বতঃ-প্রসারিত বিবরণ",
    globalEnabled: "YouTube UI সংশোধক সক্ষম করুন৷",
    grayscaleMode: "গ্রেস্কেল ডিসপ্লে",
    hideAds: "বিজ্ঞাপন স্লট লুকান",
    hideAllShorts: "শর্টস লুকান",
    hideChannelAutoplay: "চ্যানেল ভিডিও অটোপ্লে বন্ধ করুন",
    hideChannelForYou: "আপনার জন্য বিভাগটি লুকান",
    hideChannelSubscribers: "গ্রাহক সংখ্যা লুকান",
    hideClipButton: "ক্লিপ বোতাম লুকান",
    hideCommentProfiles: "মন্তব্য লেখক আইকন লুকান",
    hideCommentReplies: "উত্তর লুকান",
    hideCommentUpvotes: "সংখ্যা মত মন্তব্য লুকান",
    hideCommentUsernames: "মন্তব্য লেখকের নাম লুকান",
    hideComments: "মন্তব্য লুকান",
    hideContextBoxes: "প্রসঙ্গ বাক্স লুকান",
    hideCreateButton: "লুকান তৈরি বোতাম",
    hideEmbeddedMoreVideos: "এমবেড করা প্লেয়ার সাজেশন লুকান",
    hideEndScreen: "শেষ স্ক্রীন প্রস্তাবনা লুকান",
    hideEntireWatchSidebar: "পুরো সাইডবার এলাকা লুকান",
    hideExploreLink: "অন্বেষণ লিঙ্ক লুকান",
    hideExploreSection: "অন্বেষণ বিভাগ লুকান",
    hideExtraSidebarTags: "সম্পর্কিত-ভিডিও ট্যাগ সীমাবদ্ধ করুন",
    hideFooterSection: "বাম-নেভি ফুটার লুকান",
    hideHomeLink: "হোম লিঙ্ক লুকান",
    hideHomepageExtraRows: "অতিরিক্ত হোম তাক লুকান",
    hideHomepageHeader: "হোম চিপ বার লুকান",
    hideHomepageInfiniteScroll: "স্টপ হোম ইনফিনিট স্ক্রোল",
    hideHomepageSuggestions: "হোম সুপারিশ লুকান",
    hideInfoCards: "তথ্য কার্ড লুকান",
    hideLeftNavigation: "সমস্ত বাম নেভিগেশন লুকান",
    hideLiveChat: "লাইভ চ্যাট লুকান",
    hideMoreFromYoutubeSection: "অন্যান্য YouTube বিভাগ লুকান",
    hideNextButton: "পরবর্তী বোতাম লুকান",
    hideNonTimestampComments: "টাইমস্ট্যাম্প লিঙ্ক ছাড়া মন্তব্য লুকান",
    hideNotificationBell: "বিজ্ঞপ্তি বেল লুকান",
    hideOverlaySuggestions: "ওভারলে সাজেশন লুকান",
    hidePlayables: "খেলার যোগ্য লুকান",
    hidePlaylistSuggestions: "প্লেলিস্টের সাজেশন লুকান",
    hideQuickLinksSection: "আপনি/লাইব্রেরি বিভাগগুলি লুকান",
    hideSearchDescriptions: "অনুসন্ধান ফলাফল বিবরণ লুকান",
    hideSearchExtraResults: "অতিরিক্ত অনুসন্ধান তাক লুকান",
    hideSearchInfiniteScroll: "অসীম স্ক্রোল অনুসন্ধান বন্ধ করুন",
    hideSearchPromoted: "অনুসন্ধান বিজ্ঞাপন লুকান",
    hideSearchShorts: "সার্চের ফলাফলে Shorts লুকান",
    hideSearchSuggestions: "অনুসন্ধান পরামর্শ লুকান",
    hideSettingsSection: "সেটিংস বিভাগ লুকান",
    hideShortsLink: "Shorts লিঙ্ক লুকান",
    hideSidebarInfiniteScroll: "সম্পর্কিত-ভিডিও অসীম স্ক্রোল বন্ধ করুন",
    hideSubscriptionLive: "লাইভ ভিডিও লুকান",
    hideSubscriptionMostRelevant: "সবচেয়ে প্রাসঙ্গিক তাক লুকান",
    hideSubscriptionPremiere: "প্রিমিয়ার লুকান",
    hideSubscriptionShorts: "সাবস্ক্রিপশনে শর্ট লুকান",
    hideSubscriptionUpcoming: "আসন্ন ভিডিও লুকান",
    hideSubscriptionVods: "প্রবাহিত আর্কাইভগুলি লুকান৷",
    hideSubscriptionsLink: "সদস্যতা লিঙ্ক লুকান",
    hideSubscriptionsSection: "সদস্যতা বিভাগ লুকান",
    hideThumbnailHoverOverlay: "থাম্বনেল হোভার প্রভাব লুকান",
    hideVideoActions: "লাইক/শেয়ার অ্যাকশন লুকান",
    hideVideoDescription: "বর্ণনা লুকান",
    hideVideoLikes: "গণনা মত লুকান",
    hideVideoThumbnails: "থাম্বনেল লুকান",
    hideWatchSidebar: "সম্পর্কিত-ভিডিও সাইডবার লুকান",
    lockSettingsWithCode: "একটি কোড দিয়ে সেটিংস লক করুন",
    lockSettingsWithTimer: "10-সেকেন্ডের টাইমার দিয়ে সেটিংস লক করুন",
    normalizeShorts: "সাধারণ প্লেয়ারে শর্টস খুলুন",
    onlyShowPlaylists: "শুধুমাত্র প্লেলিস্ট দেখান",
    redirectHomeToLibrary: "আপনি পৃষ্ঠায় হোম পুনঃনির্দেশিত",
    redirectHomeToSubscriptions: "সাবস্ক্রিপশনে হোম রিডাইরেক্ট করুন",
    redirectHomeToWatchLater: "পরে দেখার জন্য হোম রিডাইরেক্ট করুন",
    reverseChannelVideos: "চ্যানেল ভিডিও অর্ডার বিপরীত",
    scheduleEnabled: "শুধুমাত্র সপ্তাহের দিনের কাজের সময় সক্রিয় করুন",
    searchEngineMode: "সার্চ ইঞ্জিন মোড",
    showEndScreenRevealBox: "শেষ পর্দায় প্রকাশ বাক্স দেখান",
    showHomepageRevealBox: "হোমে প্রকাশ বাক্স দেখান",
    showOnlyFirstHomepageRow: "শুধুমাত্র প্রথম হোম সারি রাখুন",
    showSidebarRevealBox: "সম্পর্কিত ভিডিওর জন্য প্রকাশ বাক্স দেখান",
    shrinkVideoThumbnails: "থাম্বনেল সঙ্কুচিত করুন",
  },
  ru: {
    autofocusSearch: "Поле поиска автофокуса",
    autoSkipAds: "Пропустить и закрыть рекламу",
    blurVideoThumbnails: "Размытие миниатюр",
    disableAmbientMode: "Отключить режим окружающей среды",
    disableAnnotations: "Отключить аннотации",
    disableAutoplay: "Отключить автозапуск",
    disableFullscreenScroll: "Прекратить прокрутку в полноэкранном режиме",
    disableLogoLink: "Отключить ссылку на логотип YouTube",
    disablePlayOnHover:
      "Скрыть предварительный просмотр воспроизведения при наведении",
    enableTheaterMode: "Включить режим театра",
    expandDescription: "Авторазвертывание описания",
    globalEnabled: "Включить модификатор пользовательского интерфейса YouTube",
    grayscaleMode: "Отображение в оттенках серого",
    hideAds: "Скрыть рекламные места",
    hideAllShorts: "Скрыть шорты",
    hideChannelAutoplay: "Остановить автовоспроизведение видео на канале",
    hideChannelForYou: "Скрыть раздел «Для вас»",
    hideChannelSubscribers: "Скрыть количество подписчиков",
    hideClipButton: "Кнопка «Скрыть клип»",
    hideCommentProfiles: "Скрыть значки авторов комментариев",
    hideCommentReplies: "Скрыть ответы",
    hideCommentUpvotes: "Скрыть комментарий лайков засчитывается",
    hideCommentUsernames: "Скрыть имена авторов комментариев",
    hideComments: "Скрыть комментарии",
    hideContextBoxes: "Скрыть контекстные поля",
    hideCreateButton: "Скрыть кнопку «Создать»",
    hideEmbeddedMoreVideos: "Скрыть предложения встроенного проигрывателя",
    hideEndScreen: "Скрыть рекомендации конечной заставки",
    hideEntireWatchSidebar: "Скрыть всю область боковой панели",
    hideExploreLink: "Скрыть ссылки «Изучить»",
    hideExploreSection: "Скрыть раздел «Обзор»",
    hideExtraSidebarTags: "Ограничить теги похожих видео",
    hideFooterSection: "Скрыть левый нижний колонтитул",
    hideHomeLink: "Скрыть домашнюю ссылку",
    hideHomepageExtraRows: "Скрыть дополнительные домашние полки",
    hideHomepageHeader: "Скрыть домашний чип-бар",
    hideHomepageInfiniteScroll: "Остановить бесконечную прокрутку дома",
    hideHomepageSuggestions: "Скрыть рекомендации на главной странице",
    hideInfoCards: "Скрыть информационные карточки",
    hideLeftNavigation: "Скрыть всю левую навигацию",
    hideLiveChat: "Скрыть чат",
    hideMoreFromYoutubeSection: "Скрыть другие разделы YouTube",
    hideNextButton: "Скрыть кнопку «Далее»",
    hideNonTimestampComments:
      "Скрыть комментарии без ссылок на временные метки",
    hideNotificationBell: "Скрыть колокольчик уведомлений",
    hideOverlaySuggestions: "Скрыть предложения наложения",
    hidePlayables: "Скрыть игровые объекты",
    hidePlaylistSuggestions: "Скрыть предложения плейлистов",
    hideQuickLinksSection: "Скрыть разделы «Вы/Библиотека»",
    hideSearchDescriptions: "Скрыть описания результатов поиска",
    hideSearchExtraResults: "Скрыть дополнительные полки поиска",
    hideSearchInfiniteScroll: "Остановить поиск, бесконечная прокрутка",
    hideSearchPromoted: "Скрыть поисковые объявления",
    hideSearchShorts: "Скрыть шорты в результатах поиска",
    hideSearchSuggestions: "Скрыть подсказки по поиску",
    hideSettingsSection: "Скрыть раздел настроек",
    hideShortsLink: "Скрыть ссылки на короткие видео",
    hideSidebarInfiniteScroll: "Остановить бесконечную прокрутку похожих видео",
    hideSubscriptionLive: "Скрыть прямые трансляции",
    hideSubscriptionMostRelevant: "Скрыть самую актуальную полку",
    hideSubscriptionPremiere: "Скрыть премьеры",
    hideSubscriptionShorts: "Скрыть шорты в подписках",
    hideSubscriptionUpcoming: "Скрыть предстоящие видео",
    hideSubscriptionVods: "Скрыть потоковые архивы",
    hideSubscriptionsLink: "Скрыть ссылку на подписки",
    hideSubscriptionsSection: "Скрыть раздел подписок",
    hideThumbnailHoverOverlay: "Скрыть эффекты при наведении миниатюр",
    hideVideoActions: "Скрыть действия «Мне нравится/Поделиться»",
    hideVideoDescription: "Скрыть описание",
    hideVideoLikes: "Скрыть лайк",
    hideVideoThumbnails: "Скрыть миниатюры",
    hideWatchSidebar: "Скрыть боковую панель похожих видео",
    lockSettingsWithCode: "Блокировка настроек кодом",
    lockSettingsWithTimer:
      "Блокировка настроек с помощью 10-секундного таймера",
    normalizeShorts: "Откройте шорты в обычном плеере",
    onlyShowPlaylists: "Показать только плейлисты",
    redirectHomeToLibrary: "Перенаправление домой на вашу страницу",
    redirectHomeToSubscriptions: "Перенаправить на главную страницу «Подписки»",
    redirectHomeToWatchLater:
      "Перенаправить на главную, чтобы посмотреть позже",
    reverseChannelVideos: "Обратный порядок видеоканалов",
    scheduleEnabled: "Включать только в рабочее время в будние дни",
    searchEngineMode: "Режим поисковой системы",
    showEndScreenRevealBox: "Показывать окно раскрытия на конечном экране",
    showHomepageRevealBox: "Показывать окно раскрытия на главной странице",
    showOnlyFirstHomepageRow: "Оставить только первую строку Home",
    showSidebarRevealBox: "Показывать окно раскрытия для похожих видео",
    shrinkVideoThumbnails: "Сжать миниатюры",
  },
  ur: {
    autofocusSearch: "آٹو فوکس سرچ باکس",
    autoSkipAds: "اشتہارات کو چھوڑیں اور بند کریں۔",
    blurVideoThumbnails: "تھمب نیلز کو دھندلا کریں۔",
    disableAmbientMode: "ایمبیئنٹ موڈ کو غیر فعال کریں۔",
    disableAnnotations: "تشریحات کو غیر فعال کریں۔",
    disableAutoplay: "آٹو پلے کو غیر فعال کریں۔",
    disableFullscreenScroll: "پوری اسکرین میں اسکرول کرنا بند کریں۔",
    disableLogoLink: "YouTube لوگو لنک کو غیر فعال کریں۔",
    disablePlayOnHover: "ہوور پلے بیک پیش نظارہ چھپائیں۔",
    enableTheaterMode: "تھیٹر موڈ کو فعال کریں۔",
    expandDescription: "تفصیل کو خود بخود پھیلائیں۔",
    globalEnabled: "YouTube UI موڈیفائر کو فعال کریں۔",
    grayscaleMode: "گرے اسکیل ڈسپلے",
    hideAds: "اشتہار کی سلاٹ چھپائیں۔",
    hideAllShorts: "شارٹس چھپائیں۔",
    hideChannelAutoplay: "چینل ویڈیو آٹو پلے بند کریں۔",
    hideChannelForYou: "آپ کے لیے سیکشن چھپائیں۔",
    hideChannelSubscribers: "صارفین کی تعداد چھپائیں۔",
    hideClipButton: "کلپ کا بٹن چھپائیں۔",
    hideCommentProfiles: "تبصرہ مصنف کی شبیہیں چھپائیں۔",
    hideCommentReplies: "جوابات چھپائیں۔",
    hideCommentUpvotes: "کمینٹ لائک گنتی چھپائیں۔",
    hideCommentUsernames: "تبصرہ مصنف کے نام چھپائیں۔",
    hideComments: "تبصرے چھپائیں۔",
    hideContextBoxes: "سیاق و سباق کے خانے چھپائیں۔",
    hideCreateButton: "بنائیں بٹن کو چھپائیں۔",
    hideEmbeddedMoreVideos: "ایمبیڈڈ پلیئر کی تجاویز چھپائیں۔",
    hideEndScreen: "اینڈ اسکرین کی تجاویز چھپائیں۔",
    hideEntireWatchSidebar: "سائڈبار کے پورے علاقے کو چھپائیں۔",
    hideExploreLink: "ایکسپلور لنکس کو چھپائیں۔",
    hideExploreSection: "ایکسپلور سیکشن کو چھپائیں۔",
    hideExtraSidebarTags: "متعلقہ ویڈیو ٹیگز کو محدود کریں۔",
    hideFooterSection: "بائیں طرف کا فوٹر چھپائیں۔",
    hideHomeLink: "ہوم لنک چھپائیں۔",
    hideHomepageExtraRows: "گھر کے اضافی شیلف چھپائیں۔",
    hideHomepageHeader: "ہوم چپ بار کو چھپائیں۔",
    hideHomepageInfiniteScroll: "ہوم لامحدود اسکرول کو روکیں۔",
    hideHomepageSuggestions: "ہوم تجاویز چھپائیں۔",
    hideInfoCards: "معلوماتی کارڈ چھپائیں۔",
    hideLeftNavigation: "تمام بائیں نیویگیشن چھپائیں۔",
    hideLiveChat: "لائیو چیٹ چھپائیں۔",
    hideMoreFromYoutubeSection: "یوٹیوب کے دیگر سیکشنز چھپائیں۔",
    hideNextButton: "اگلا بٹن چھپائیں۔",
    hideNonTimestampComments: "ٹائم اسٹیمپ لنکس کے بغیر تبصرے چھپائیں۔",
    hideNotificationBell: "اطلاعی گھنٹی کو چھپائیں۔",
    hideOverlaySuggestions: "اوورلے کی تجاویز چھپائیں۔",
    hidePlayables: "پلے ایبلز چھپائیں۔",
    hidePlaylistSuggestions: "پلے لسٹ کی تجاویز چھپائیں۔",
    hideQuickLinksSection: "آپ/لائبریری کے حصے چھپائیں۔",
    hideSearchDescriptions: "تلاش کے نتائج کی تفصیل چھپائیں۔",
    hideSearchExtraResults: "اضافی سرچ شیلف چھپائیں۔",
    hideSearchInfiniteScroll: "لامحدود اسکرول کی تلاش بند کریں۔",
    hideSearchPromoted: "تلاش کے اشتہارات چھپائیں۔",
    hideSearchShorts: "تلاش کے نتائج میں شارٹس چھپائیں۔",
    hideSearchSuggestions: "تلاش کی تجاویز چھپائیں۔",
    hideSettingsSection: "ترتیبات کا سیکشن چھپائیں۔",
    hideShortsLink: "شارٹس کے لنکس چھپائیں۔",
    hideSidebarInfiniteScroll: "متعلقہ-ویڈیو لامحدود اسکرول کو روکیں۔",
    hideSubscriptionLive: "لائیو ویڈیوز چھپائیں۔",
    hideSubscriptionMostRelevant: "انتہائی متعلقہ شیلف چھپائیں۔",
    hideSubscriptionPremiere: "پریمیئرز چھپائیں۔",
    hideSubscriptionShorts: "سبسکرپشنز پر شارٹس چھپائیں۔",
    hideSubscriptionUpcoming: "آنے والی ویڈیوز چھپائیں۔",
    hideSubscriptionVods: "اسٹریم شدہ آرکائیوز کو چھپائیں۔",
    hideSubscriptionsLink: "سبسکرپشنز کا لنک چھپائیں۔",
    hideSubscriptionsSection: "سبسکرپشنز سیکشن چھپائیں۔",
    hideThumbnailHoverOverlay: "تھمب نیل ہوور اثرات کو چھپائیں۔",
    hideVideoActions: "لائک/شیئر کی کارروائیاں چھپائیں۔",
    hideVideoDescription: "تفصیل چھپائیں۔",
    hideVideoLikes: "گنتی کی طرح چھپائیں۔",
    hideVideoThumbnails: "تھمب نیلز چھپائیں۔",
    hideWatchSidebar: "متعلقہ-ویڈیو سائڈبار چھپائیں۔",
    lockSettingsWithCode: "کوڈ کے ساتھ ترتیبات کو لاک کریں۔",
    lockSettingsWithTimer: "10 سیکنڈ ٹائمر کے ساتھ سیٹنگز کو لاک کریں۔",
    normalizeShorts: "نارمل پلیئر میں شارٹس کھولیں۔",
    onlyShowPlaylists: "صرف پلے لسٹس دکھائیں۔",
    redirectHomeToLibrary: "ہوم ٹو یو پیج کو ری ڈائریکٹ کریں۔",
    redirectHomeToSubscriptions: "ہوم کو سبسکرپشنز پر ری ڈائریکٹ کریں۔",
    redirectHomeToWatchLater: "بعد میں دیکھنے کے لیے ہوم کو ری ڈائریکٹ کریں۔",
    reverseChannelVideos: "چینل ویڈیو آرڈر کو ریورس کریں۔",
    scheduleEnabled: "صرف ہفتے کے دن کام کے اوقات میں فعال کریں۔",
    searchEngineMode: "سرچ انجن موڈ",
    showEndScreenRevealBox: "اختتامی اسکرین پر ظاہر باکس دکھائیں۔",
    showHomepageRevealBox: "ہوم پر ظاہر باکس دکھائیں۔",
    showOnlyFirstHomepageRow: "صرف پہلی ہوم قطار رکھیں",
    showSidebarRevealBox: "متعلقہ ویڈیوز کے لیے ظاہر باکس دکھائیں۔",
    shrinkVideoThumbnails: "تھمب نیلز سکڑیں۔",
  },
  es: {
    autofocusSearch: "Cuadro de búsqueda de enfoque automático",
    autoSkipAds: "Saltar y cerrar anuncios",
    blurVideoThumbnails: "Miniaturas borrosas",
    disableAmbientMode: "Desactivar el modo ambiente",
    disableAnnotations: "Deshabilitar anotaciones",
    disableAutoplay: "Deshabilitar la reproducción automática",
    disableFullscreenScroll: "Deja de desplazarte en pantalla completa",
    disableLogoLink: "Deshabilitar el enlace del logotipo de YouTube",
    disablePlayOnHover:
      "Ocultar vista previa de reproducción al pasar el mouse",
    enableTheaterMode: "Habilitar el modo teatro",
    expandDescription: "Descripción de expansión automática",
    globalEnabled:
      "Habilitar el modificador de la interfaz de usuario de YouTube",
    grayscaleMode: "Pantalla en escala de grises",
    hideAds: "Ocultar espacios publicitarios",
    hideAllShorts: "Ocultar pantalones cortos",
    hideChannelAutoplay:
      "Detener la reproducción automática del vídeo del canal",
    hideChannelForYou: "Sección Ocultar para ti",
    hideChannelSubscribers: "Ocultar recuento de suscriptores",
    hideClipButton: "Botón Ocultar clip",
    hideCommentProfiles: "Ocultar iconos de autor de comentarios",
    hideCommentReplies: "Ocultar respuestas",
    hideCommentUpvotes: "Ocultar comentarios como recuentos",
    hideCommentUsernames: "Ocultar nombres de autores de comentarios",
    hideComments: "Ocultar comentarios",
    hideContextBoxes: "Ocultar cuadros de contexto",
    hideCreateButton: "Ocultar botón Crear",
    hideEmbeddedMoreVideos: "Ocultar sugerencias de reproductores integrados",
    hideEndScreen: "Ocultar recomendaciones de la pantalla final",
    hideEntireWatchSidebar: "Ocultar toda el área de la barra lateral",
    hideExploreLink: "Ocultar enlaces de exploración",
    hideExploreSection: "Ocultar sección Explorar",
    hideExtraSidebarTags: "Limitar etiquetas de vídeos relacionados",
    hideFooterSection: "Ocultar pie de página de navegación izquierdo",
    hideHomeLink: "Ocultar enlace de inicio",
    hideHomepageExtraRows: "Ocultar estantes adicionales para el hogar",
    hideHomepageHeader: "Ocultar barra de chips de inicio",
    hideHomepageInfiniteScroll: "Detener Inicio desplazamiento infinito",
    hideHomepageSuggestions: "Ocultar recomendaciones de inicio",
    hideInfoCards: "Ocultar tarjetas de información",
    hideLeftNavigation: "Ocultar toda la navegación izquierda",
    hideLiveChat: "Ocultar chat en vivo",
    hideMoreFromYoutubeSection: "Ocultar otras secciones de YouTube",
    hideNextButton: "Ocultar botón Siguiente",
    hideNonTimestampComments:
      "Ocultar comentarios sin enlaces de marca de tiempo",
    hideNotificationBell: "Ocultar campana de notificación",
    hideOverlaySuggestions: "Ocultar sugerencias de superposición",
    hidePlayables: "Ocultar jugables",
    hidePlaylistSuggestions: "Ocultar sugerencias de listas de reproducción",
    hideQuickLinksSection: "Ocultar secciones Usted/Biblioteca",
    hideSearchDescriptions: "Ocultar descripciones de resultados de búsqueda",
    hideSearchExtraResults: "Ocultar estantes de búsqueda adicionales",
    hideSearchInfiniteScroll: "Detener búsqueda desplazamiento infinito",
    hideSearchPromoted: "Ocultar anuncios de búsqueda",
    hideSearchShorts: "Ocultar pantalones cortos en los resultados de búsqueda",
    hideSearchSuggestions: "Ocultar sugerencias de búsqueda",
    hideSettingsSection: "Ocultar sección de configuración",
    hideShortsLink: "Ocultar enlaces de cortos",
    hideSidebarInfiniteScroll:
      "Detener el desplazamiento infinito de vídeos relacionados",
    hideSubscriptionLive: "Ocultar videos en vivo",
    hideSubscriptionMostRelevant: "Ocultar estante más relevante",
    hideSubscriptionPremiere: "Ocultar estrenos",
    hideSubscriptionShorts: "Ocultar cortos en suscripciones",
    hideSubscriptionUpcoming: "Ocultar próximos vídeos",
    hideSubscriptionVods: "Ocultar archivos transmitidos",
    hideSubscriptionsLink: "Ocultar enlace de Suscripciones",
    hideSubscriptionsSection: "Ocultar sección de suscripciones",
    hideThumbnailHoverOverlay: "Ocultar efectos de desplazamiento en miniatura",
    hideVideoActions: "Ocultar acciones de Me gusta/Compartir",
    hideVideoDescription: "Ocultar descripción",
    hideVideoLikes: "Ocultar como contar",
    hideVideoThumbnails: "Ocultar miniaturas",
    hideWatchSidebar: "Ocultar barra lateral de videos relacionados",
    lockSettingsWithCode: "Bloquear configuraciones con un código",
    lockSettingsWithTimer:
      "Bloquea la configuración con un temporizador de 10 segundos",
    normalizeShorts: "Abrir cortos en el reproductor normal",
    onlyShowPlaylists: "Mostrar solo listas de reproducción",
    redirectHomeToLibrary: "Redirigir a casa a su página",
    redirectHomeToSubscriptions: "Redirigir a Inicio a Suscripciones",
    redirectHomeToWatchLater: "Redirigir a casa para verlo más tarde",
    reverseChannelVideos: "Orden de vídeo del canal inverso",
    scheduleEnabled: "Habilitar solo durante el horario laboral entre semana",
    searchEngineMode: "Modo de motor de búsqueda",
    showEndScreenRevealBox: "Mostrar cuadro de revelación en la pantalla final",
    showHomepageRevealBox: "Mostrar cuadro de revelación en Inicio",
    showOnlyFirstHomepageRow: "Mantenga solo la primera fila de Inicio",
    showSidebarRevealBox:
      "Mostrar cuadro de revelación para videos relacionados",
    shrinkVideoThumbnails: "Reducir miniaturas",
  },
  ar: {
    autofocusSearch: "مربع البحث التركيز التلقائي",
    autoSkipAds: "تخطي وإغلاق الإعلانات",
    blurVideoThumbnails: "طمس الصور المصغرة",
    disableAmbientMode: "تعطيل الوضع المحيط",
    disableAnnotations: "تعطيل التعليقات التوضيحية",
    disableAutoplay: "تعطيل التشغيل التلقائي",
    disableFullscreenScroll: "توقف عن التمرير في وضع ملء الشاشة",
    disableLogoLink: "تعطيل رابط شعار YouTube",
    disablePlayOnHover: "إخفاء معاينة تشغيل التمرير",
    enableTheaterMode: "تمكين وضع المسرح",
    expandDescription: "التوسيع التلقائي للوصف",
    globalEnabled: "تمكين معدّل واجهة مستخدم YouTube",
    grayscaleMode: "عرض التدرج الرمادي",
    hideAds: "إخفاء الشرائح الإعلانية",
    hideAllShorts: "إخفاء السراويل القصيرة",
    hideChannelAutoplay: "إيقاف التشغيل التلقائي لفيديو القناة",
    hideChannelForYou: "إخفاء قسم لك",
    hideChannelSubscribers: "إخفاء عدد المشتركين",
    hideClipButton: "إخفاء زر المقطع",
    hideCommentProfiles: "إخفاء أيقونات مؤلف التعليق",
    hideCommentReplies: "إخفاء الردود",
    hideCommentUpvotes: "إخفاء عدد الإعجابات بالتعليقات",
    hideCommentUsernames: "إخفاء أسماء مؤلفي التعليق",
    hideComments: "إخفاء التعليقات",
    hideContextBoxes: "إخفاء مربعات السياق",
    hideCreateButton: "إخفاء زر إنشاء",
    hideEmbeddedMoreVideos: "إخفاء اقتراحات المشغل المضمنة",
    hideEndScreen: "إخفاء توصيات شاشة النهاية",
    hideEntireWatchSidebar: "إخفاء منطقة الشريط الجانبي بالكامل",
    hideExploreLink: "إخفاء استكشاف الروابط",
    hideExploreSection: "إخفاء قسم الاستكشاف",
    hideExtraSidebarTags: "الحد من علامات الفيديو ذات الصلة",
    hideFooterSection: "إخفاء تذييل التنقل الأيسر",
    hideHomeLink: "إخفاء رابط الصفحة الرئيسية",
    hideHomepageExtraRows: "إخفاء الرفوف المنزلية الإضافية",
    hideHomepageHeader: "إخفاء شريط الشريحة الرئيسية",
    hideHomepageInfiniteScroll: "إيقاف الصفحة الرئيسية التمرير اللانهائي",
    hideHomepageSuggestions: "إخفاء التوصيات الرئيسية",
    hideInfoCards: "إخفاء بطاقات المعلومات",
    hideLeftNavigation: "إخفاء كل التنقل الأيسر",
    hideLiveChat: "إخفاء الدردشة المباشرة",
    hideMoreFromYoutubeSection: "إخفاء أقسام اليوتيوب الأخرى",
    hideNextButton: "إخفاء زر التالي",
    hideNonTimestampComments: "إخفاء التعليقات بدون روابط الطابع الزمني",
    hideNotificationBell: "اخفاء جرس الاشعارات",
    hideOverlaySuggestions: "إخفاء اقتراحات التراكب",
    hidePlayables: "إخفاء العناصر القابلة للتشغيل",
    hidePlaylistSuggestions: "إخفاء اقتراحات قائمة التشغيل",
    hideQuickLinksSection: "إخفاء أنت / أقسام المكتبة",
    hideSearchDescriptions: "إخفاء أوصاف نتائج البحث",
    hideSearchExtraResults: "إخفاء أرفف البحث الإضافية",
    hideSearchInfiniteScroll: "توقف عن البحث عن التمرير اللانهائي",
    hideSearchPromoted: "إخفاء إعلانات البحث",
    hideSearchShorts: "إخفاء السراويل القصيرة في نتائج البحث",
    hideSearchSuggestions: "إخفاء اقتراحات البحث",
    hideSettingsSection: "إخفاء قسم الإعدادات",
    hideShortsLink: "إخفاء روابط السراويل القصيرة",
    hideSidebarInfiniteScroll: "إيقاف التمرير اللانهائي للفيديو ذي الصلة",
    hideSubscriptionLive: "إخفاء مقاطع الفيديو المباشرة",
    hideSubscriptionMostRelevant: "إخفاء الرف الأكثر صلة",
    hideSubscriptionPremiere: "إخفاء العروض الأولى",
    hideSubscriptionShorts: "إخفاء السراويل القصيرة على الاشتراكات",
    hideSubscriptionUpcoming: "إخفاء مقاطع الفيديو القادمة",
    hideSubscriptionVods: "إخفاء الأرشيفات المتدفقة",
    hideSubscriptionsLink: "إخفاء رابط الاشتراكات",
    hideSubscriptionsSection: "إخفاء قسم الاشتراكات",
    hideThumbnailHoverOverlay: "إخفاء تأثيرات التمرير المصغرة",
    hideVideoActions: "إخفاء إجراءات الإعجاب/المشاركة",
    hideVideoDescription: "إخفاء الوصف",
    hideVideoLikes: "إخفاء عدد الإعجابات",
    hideVideoThumbnails: "إخفاء الصور المصغرة",
    hideWatchSidebar: "إخفاء الشريط الجانبي للفيديو ذي الصلة",
    lockSettingsWithCode: "قفل الإعدادات برمز",
    lockSettingsWithTimer: "قفل الإعدادات بمؤقت مدته 10 ثوانٍ",
    normalizeShorts: "فتح السراويل في لاعب عادي",
    onlyShowPlaylists: "عرض قوائم التشغيل فقط",
    redirectHomeToLibrary: "إعادة توجيه الصفحة الرئيسية إليك",
    redirectHomeToSubscriptions: "إعادة توجيه الصفحة الرئيسية إلى الاشتراكات",
    redirectHomeToWatchLater: "إعادة توجيه الصفحة الرئيسية للمشاهدة لاحقًا",
    reverseChannelVideos: "عكس ترتيب فيديو القناة",
    scheduleEnabled: "تمكين فقط خلال ساعات العمل خلال أيام الأسبوع",
    searchEngineMode: "وضع محرك البحث",
    showEndScreenRevealBox: "إظهار مربع الكشف على شاشة النهاية",
    showHomepageRevealBox: "إظهار مربع الكشف على الصفحة الرئيسية",
    showOnlyFirstHomepageRow: "احتفظ بالصف الرئيسي الأول فقط",
    showSidebarRevealBox: "إظهار مربع الكشف لمقاطع الفيديو ذات الصلة",
    shrinkVideoThumbnails: "تقليص الصور المصغرة",
  },
};

const optionDescriptions: Partial<
  Record<LocaleCode, Record<YoutubeUiModifierSettingId, string>>
> = {
  en: {
    autofocusSearch:
      "Focus the search box automatically outside watch pages when it is empty.",
    autoSkipAds: "Click skippable ad buttons and overlay ad close buttons.",
    blurVideoThumbnails: "Blur only video thumbnail images.",
    disableAmbientMode:
      "Turn off ambient mode in the player settings menu where possible.",
    disableAnnotations:
      "Turn off annotations in the player settings menu where possible.",
    disableAutoplay: "Turn the player autoplay toggle off when it is on.",
    disableFullscreenScroll:
      "Hide scrollable page areas while the player is fullscreen.",
    disableLogoLink: "Disable clicks from the YouTube logo back to Home.",
    disablePlayOnHover: "Hide video preview elements shown on mouse hover.",
    enableTheaterMode:
      "Switch watch pages to theater mode when using normal mode.",
    expandDescription: "Expand the watch page description where possible.",
    globalEnabled: "Turn all display adjustments on or off at once.",
    grayscaleMode: "Display all of YouTube in grayscale.",
    hideAds: "Hide ad containers and promotion slots on the page.",
    hideAllShorts:
      "Hide Shorts in navigation, shelves, search results, and video cards.",
    hideChannelAutoplay:
      "Pause the intro video at the top of channel pages when present.",
    hideChannelForYou: "Hide the For You section on channel pages.",
    hideChannelSubscribers: "Hide subscriber counts in the channel owner row.",
    hideClipButton: "Detect and hide the Clip button below videos.",
    hideCommentProfiles: "Hide profile images in the comments area.",
    hideCommentReplies: "Hide comment reply threads.",
    hideCommentUpvotes: "Hide like counts inside comment actions.",
    hideCommentUsernames: "Hide author names in the comments area.",
    hideComments: "Hide the comments area and comment prompt panels.",
    hideContextBoxes:
      "Hide contextual boxes such as info panels and supplemental cards.",
    hideCreateButton:
      "Hide the top bar Create button identified by CDP inspection.",
    hideEmbeddedMoreVideos:
      "Hide extra video panels shown on pause in embedded players.",
    hideEndScreen: "Hide the recommendation grid shown when a video ends.",
    hideEntireWatchSidebar:
      "Hide the whole right column and center the video column.",
    hideExploreLink: "Hide Explore and Trending links.",
    hideExploreSection: "Hide the Explore section in the left drawer.",
    hideExtraSidebarTags:
      'Limit related-video tags to items equivalent to "All" and "Related".',
    hideFooterSection: "Hide footer links at the bottom of the left drawer.",
    hideHomeLink: "Hide the Home link in left navigation.",
    hideHomepageExtraRows:
      "Hide additional sections such as Shorts and Trending.",
    hideHomepageHeader: "Hide category chips and headers at the top of Home.",
    hideHomepageInfiniteScroll:
      "Hide continuation loaders at the end of Home lists.",
    hideHomepageSuggestions: "Hide recommendation lists on YouTube Home.",
    hideInfoCards: "Hide card elements shown over videos.",
    hideLeftNavigation: "Hide the left drawer and mini guide.",
    hideLiveChat: "Hide the live chat area on watch pages.",
    hideMoreFromYoutubeSection:
      "Hide sections equivalent to More from YouTube in the left drawer.",
    hideNextButton: "Hide the Next button inside the player.",
    hideNonTimestampComments:
      "Keep only comments that include video timestamp links.",
    hideNotificationBell:
      "Hide the notification bell on the right side of the header.",
    hideOverlaySuggestions:
      "Hide card teasers and candidate overlays shown while paused.",
    hidePlayables: "Hide YouTube Playables shelves on Home and similar pages.",
    hidePlaylistSuggestions:
      "Hide recommendation sections on playlist pages and similar pages.",
    hideQuickLinksSection:
      "Hide You, History, and similar sections in the left drawer.",
    hideSearchDescriptions:
      "Hide descriptions and supplemental metadata in search result cards.",
    hideSearchExtraResults:
      "Hide related shelves and extra sections in search results.",
    hideSearchInfiniteScroll:
      "Hide continuation loaders at the end of search results.",
    hideSearchPromoted: "Hide promoted videos mixed into search results.",
    hideSearchShorts: "Hide Shorts cards and Shorts shelves in search results.",
    hideSearchSuggestions: "Hide the search box suggestion dropdown.",
    hideSettingsSection:
      "Hide settings-related sections at the bottom of the left drawer.",
    hideShortsLink:
      "Hide Shorts links in left navigation and mobile bottom navigation.",
    hideSidebarInfiniteScroll:
      "Hide continuation loading at the end of the related-video sidebar.",
    hideSubscriptionLive: "Hide live videos on the Subscriptions page.",
    hideSubscriptionMostRelevant:
      "Hide the Most relevant section on the Subscriptions page.",
    hideSubscriptionPremiere: "Hide Premiere videos on the Subscriptions page.",
    hideSubscriptionShorts: "Hide Shorts videos on the Subscriptions page.",
    hideSubscriptionUpcoming: "Hide Upcoming videos on the Subscriptions page.",
    hideSubscriptionVods:
      "Hide videos marked as Streamed on the Subscriptions page.",
    hideSubscriptionsLink: "Hide navigation paths to subscriptions.",
    hideSubscriptionsSection:
      "Hide the subscriptions section in the left drawer.",
    hideThumbnailHoverOverlay:
      "Hide thumbnail slideshow effects in search results and similar pages.",
    hideVideoActions: "Hide the action button group below videos.",
    hideVideoDescription: "Hide the video description area.",
    hideVideoLikes: "Hide like-count text below videos.",
    hideVideoThumbnails: "Hide video thumbnails to emphasize text information.",
    hideWatchSidebar:
      "Hide the related-video list on the right side of videos.",
    lockSettingsWithCode:
      "Ask for a confirmation code before opening settings.",
    lockSettingsWithTimer:
      "Wait 10 seconds before opening settings from the Tampermonkey menu.",
    normalizeShorts: "Redirect Shorts URLs to normal watch URLs.",
    onlyShowPlaylists:
      "Suppress major links and sections other than playlists in the left navigation.",
    redirectHomeToLibrary:
      "Move to the You/Library-equivalent page when opening Home.",
    redirectHomeToSubscriptions: "Move to Subscriptions when opening Home.",
    redirectHomeToWatchLater: "Move to Watch Later when opening Home.",
    reverseChannelVideos: "Display channel page video grids in reverse order.",
    scheduleEnabled:
      "Enable display adjustments only Monday through Friday from 9:00 to 17:00.",
    searchEngineMode:
      "Keep the search bar and search results central while suppressing other YouTube areas.",
    showEndScreenRevealBox:
      "Show a temporary reveal box when end screen recommendations are hidden.",
    showHomepageRevealBox:
      "Show a temporary reveal box when Home recommendations are hidden.",
    showOnlyFirstHomepageRow:
      "Hide rows after the first row in the Home video grid.",
    showSidebarRevealBox:
      "Show a temporary reveal box when related videos are hidden.",
    shrinkVideoThumbnails: "Keep video thumbnails to a smaller fixed width.",
  },
  "zh-Hans": {
    autofocusSearch: "当搜索框为空时，自动将搜索框聚焦到观看页面之外。",
    autoSkipAds: "点击可跳过的广告按钮并覆盖广告关闭按钮。",
    blurVideoThumbnails: "仅模糊视频缩略图。",
    disableAmbientMode: "尽可能在播放器设置菜单中关闭环境模式。",
    disableAnnotations: "尽可能关闭播放器设置菜单中的注释。",
    disableAutoplay: "当播放器自动播放开关打开时将其关闭。",
    disableFullscreenScroll: "当播放器全屏时隐藏可滚动页面区域。",
    disableLogoLink: "禁止从 YouTube 徽标点击返回首页。",
    disablePlayOnHover: "隐藏鼠标悬停时显示的视频预览元素。",
    enableTheaterMode: "使用普通模式时将观看页面切换到影院模式。",
    expandDescription: "尽可能展开观看页面描述。",
    globalEnabled: "立即打开或关闭所有显示调整。",
    grayscaleMode: "以灰度显示所有 YouTube 内容。",
    hideAds: "隐藏页面上的广告容器和促销位。",
    hideAllShorts: "在导航、书架、搜索结果和视频卡中隐藏 Shorts。",
    hideChannelAutoplay: "暂停频道页面顶部的介绍视频（如果存在）。",
    hideChannelForYou: "隐藏频道页面上的“为您推荐”部分。",
    hideChannelSubscribers: "隐藏频道所有者行中的订阅者计数。",
    hideClipButton: "检测并隐藏视频下方的剪辑按钮。",
    hideCommentProfiles: "在评论区隐藏个人资料图片。",
    hideCommentReplies: "隐藏评论回复线程。",
    hideCommentUpvotes: "在评论操作中隐藏点赞计数。",
    hideCommentUsernames: "在评论区隐藏作者姓名。",
    hideComments: "隐藏评论区和评论提示面板。",
    hideContextBoxes: "隐藏上下文框，例如信息面板和补充卡。",
    hideCreateButton: "隐藏由 CDP 检查识别的顶部栏“创建”按钮。",
    hideEmbeddedMoreVideos: "隐藏嵌入式播放器中暂停时显示的额外视频面板。",
    hideEndScreen: "隐藏视频结束时显示的推荐网格。",
    hideEntireWatchSidebar: "隐藏整个右列并将视频列居中。",
    hideExploreLink: "隐藏探索和趋势链接。",
    hideExploreSection: "隐藏左侧抽屉中的探索部分。",
    hideExtraSidebarTags: "将相关视频标签限制为相当于“全部”和“相关”的项目。",
    hideFooterSection: "隐藏左侧抽屉底部的页脚链接。",
    hideHomeLink: "隐藏左侧导航栏中的主页链接。",
    hideHomepageExtraRows: "隐藏 Shorts 和 Trending 等其他部分。",
    hideHomepageHeader: "隐藏主页顶部的类别条和标题。",
    hideHomepageInfiniteScroll: "隐藏主页列表末尾的连续加载程序。",
    hideHomepageSuggestions: "隐藏 YouTube 首页上的推荐列表。",
    hideInfoCards: "隐藏视频中显示的卡片元素。",
    hideLeftNavigation: "隐藏左侧抽屉和迷你导轨。",
    hideLiveChat: "隐藏观看页面上的实时聊天区域。",
    hideMoreFromYoutubeSection:
      "隐藏左侧抽屉中与 YouTube 中的更多内容等效的部分。",
    hideNextButton: "隐藏播放器内的“下一步”按钮。",
    hideNonTimestampComments: "仅保留包含视频时间戳链接的评论。",
    hideNotificationBell: "隐藏标题右侧的通知铃。",
    hideOverlaySuggestions: "隐藏暂停时显示的卡片预告片和候选覆盖图。",
    hidePlayables: "隐藏主页和类似页面上的 YouTube Playables 书架。",
    hidePlaylistSuggestions: "隐藏播放列表页面和类似页面上的推荐部分。",
    hideQuickLinksSection: "隐藏你、历史和左侧抽屉中的类似部分。",
    hideSearchDescriptions: "隐藏搜索结果卡中的描述和补充元数据。",
    hideSearchExtraResults: "隐藏搜索结果中的相关书架和额外部分。",
    hideSearchInfiniteScroll: "在搜索结果末尾隐藏连续加载器。",
    hideSearchPromoted: "隐藏混合到搜索结果中的推荐视频。",
    hideSearchShorts: "在搜索结果中隐藏 Shorts 卡和 Shorts 书架。",
    hideSearchSuggestions: "隐藏搜索框建议下拉菜单。",
    hideSettingsSection: "隐藏左侧抽屉底部与设置相关的部分。",
    hideShortsLink: "隐藏左侧导航和移动设备底部导航中的 Shorts 链接。",
    hideSidebarInfiniteScroll: "隐藏相关视频侧边栏末尾的连续加载。",
    hideSubscriptionLive: "在订阅页面上隐藏实时视频。",
    hideSubscriptionMostRelevant: "隐藏订阅页面上最相关的部分。",
    hideSubscriptionPremiere: "在订阅页面上隐藏首映视频。",
    hideSubscriptionShorts: "在订阅页面上隐藏 Shorts 视频。",
    hideSubscriptionUpcoming: "在订阅页面上隐藏即将播放的视频。",
    hideSubscriptionVods: "隐藏订阅页面上标记为流式传输的视频。",
    hideSubscriptionsLink: "隐藏订阅的导航路径。",
    hideSubscriptionsSection: "隐藏左侧抽屉中的订阅部分。",
    hideThumbnailHoverOverlay: "在搜索结果和类似页面中隐藏缩略图幻灯片效果。",
    hideVideoActions: "隐藏视频下方的操作按钮组。",
    hideVideoDescription: "隐藏视频描述区域。",
    hideVideoLikes: "隐藏视频下方的点赞数文本。",
    hideVideoThumbnails: "隐藏视频缩略图以强调文本信息。",
    hideWatchSidebar: "隐藏视频右侧的相关视频列表。",
    lockSettingsWithCode: "打开设置之前要求输入确认码。",
    lockSettingsWithTimer:
      "等待 10 秒钟，然后再从 Tampermonkey 菜单中打开设置。",
    normalizeShorts: "将 Shorts 网址重定向到普通观看网址。",
    onlyShowPlaylists: "隐藏左侧导航中除播放列表之外的主要链接和部分。",
    redirectHomeToLibrary: "打开主页时移至“您/图书馆”的等效页面。",
    redirectHomeToSubscriptions: "打开主页时移至订阅。",
    redirectHomeToWatchLater: "打开主页时移至稍后观看。",
    reverseChannelVideos: "以相反顺序显示频道页面视频网格。",
    scheduleEnabled: "仅在周一至周五 9:00 至 17:00 期间启用显示调整。",
    searchEngineMode:
      "将搜索栏和搜索结果保持在中心位置，同时隐藏其他 YouTube 区域。",
    showEndScreenRevealBox: "隐藏片尾屏幕推荐时显示临时显示框。",
    showHomepageRevealBox: "隐藏主页推荐时显示临时显示框。",
    showOnlyFirstHomepageRow: "隐藏主视频网格中第一行之后的行。",
    showSidebarRevealBox: "隐藏相关视频时显示临时显示框。",
    shrinkVideoThumbnails: "将视频缩略图保持较小的固定宽度。",
  },
  hi: {
    autofocusSearch:
      "जब खोज बॉक्स खाली हो तो दृश्य पृष्ठों के बाहर स्वचालित रूप से खोज बॉक्स पर ध्यान केंद्रित करें।",
    autoSkipAds:
      "स्किप करने योग्य विज्ञापन बटन पर क्लिक करें और विज्ञापन बंद करें बटन को ओवरले करें।",
    blurVideoThumbnails: "केवल वीडियो थंबनेल छवियों को धुंधला करें।",
    disableAmbientMode:
      "जहां संभव हो, प्लेयर सेटिंग मेनू में परिवेश मोड बंद करें।",
    disableAnnotations:
      "जहां संभव हो, प्लेयर सेटिंग मेनू में एनोटेशन बंद करें।",
    disableAutoplay: "प्लेयर के चालू होने पर ऑटोप्ले टॉगल को बंद कर दें।",
    disableFullscreenScroll:
      "प्लेयर फ़ुलस्क्रीन होने पर स्क्रॉल करने योग्य पृष्ठ क्षेत्र छिपाएँ।",
    disableLogoLink: "YouTube लोगो से होम पर वापस क्लिक अक्षम करें।",
    disablePlayOnHover:
      "माउस होवर पर दिखाए गए वीडियो पूर्वावलोकन तत्वों को छुपाएं।",
    enableTheaterMode:
      "सामान्य मोड का उपयोग करते समय वॉच पेजों को थिएटर मोड में स्विच करें।",
    expandDescription: "जहां संभव हो, दृश्य पृष्ठ विवरण का विस्तार करें.",
    globalEnabled: "सभी डिस्प्ले समायोजनों को एक साथ चालू या बंद करें।",
    grayscaleMode: "संपूर्ण YouTube को ग्रेस्केल में प्रदर्शित करें.",
    hideAds: "पृष्ठ पर विज्ञापन कंटेनर और प्रचार स्लॉट छिपाएँ।",
    hideAllShorts:
      "नेविगेशन, शेल्फ़, खोज परिणाम और वीडियो कार्ड में शॉर्ट्स छिपाएँ।",
    hideChannelAutoplay:
      "परिचय वीडियो मौजूद होने पर चैनल पेजों के शीर्ष पर रोकें।",
    hideChannelForYou: "चैनल पेजों पर आपके लिए अनुभाग छिपाएँ।",
    hideChannelSubscribers: "चैनल स्वामी पंक्ति में ग्राहकों की संख्या छिपाएँ।",
    hideClipButton: "वीडियो के नीचे क्लिप बटन को पहचानें और छिपाएँ।",
    hideCommentProfiles: "टिप्पणी क्षेत्र में प्रोफ़ाइल चित्र छिपाएँ।",
    hideCommentReplies: "टिप्पणी उत्तर थ्रेड छिपाएँ.",
    hideCommentUpvotes: "टिप्पणी क्रियाओं के अंदर लाइक की संख्या छिपाएँ।",
    hideCommentUsernames: "टिप्पणी क्षेत्र में लेखक के नाम छिपाएँ।",
    hideComments: "टिप्पणी क्षेत्र और टिप्पणी शीघ्र पैनल छिपाएँ।",
    hideContextBoxes: "सूचना पैनल और पूरक कार्ड जैसे प्रासंगिक बक्से छुपाएं।",
    hideCreateButton:
      "सीडीपी निरीक्षण द्वारा पहचाने गए शीर्ष बार क्रिएट बटन को छुपाएं।",
    hideEmbeddedMoreVideos:
      "एम्बेडेड प्लेयर्स में रुकने पर दिखाए गए अतिरिक्त वीडियो पैनल छिपाएँ।",
    hideEndScreen: "वीडियो समाप्त होने पर दिखाई गई अनुशंसा ग्रिड छिपाएँ।",
    hideEntireWatchSidebar:
      "पूरे दाएँ कॉलम को छिपाएँ और वीडियो कॉलम को बीच में रखें।",
    hideExploreLink: "एक्सप्लोर और ट्रेंडिंग लिंक छुपाएं।",
    hideExploreSection: "बाएँ दराज में एक्सप्लोर अनुभाग छिपाएँ।",
    hideExtraSidebarTags:
      'संबंधित-वीडियो टैग को "सभी" और "संबंधित" के समकक्ष आइटम तक सीमित करें।',
    hideFooterSection: "बाएँ दराज के नीचे फ़ुटर लिंक छिपाएँ।",
    hideHomeLink: "बाएँ नेविगेशन में होम लिंक छिपाएँ।",
    hideHomepageExtraRows: "शॉर्ट्स और ट्रेंडिंग जैसे अतिरिक्त अनुभाग छुपाएं।",
    hideHomepageHeader: "होम के शीर्ष पर श्रेणी चिप्स और हेडर छिपाएँ।",
    hideHomepageInfiniteScroll: "होम सूचियों के अंत में निरंतरता लोडर छिपाएँ।",
    hideHomepageSuggestions: "YouTube होम पर अनुशंसा सूचियाँ छिपाएँ।",
    hideInfoCards: "वीडियो पर दिखाए गए कार्ड तत्वों को छिपाएँ।",
    hideLeftNavigation: "बाएँ दराज और मिनी गाइड को छिपाएँ।",
    hideLiveChat: "दृश्य पृष्ठों पर लाइव चैट क्षेत्र छिपाएँ।",
    hideMoreFromYoutubeSection:
      "बाएँ दराज में YouTube से अधिक के समतुल्य अनुभाग छिपाएँ।",
    hideNextButton: "प्लेयर के अंदर अगला बटन छिपाएँ।",
    hideNonTimestampComments:
      "केवल वही टिप्पणियाँ रखें जिनमें वीडियो टाइमस्टैम्प लिंक शामिल हों।",
    hideNotificationBell: "हेडर के दाईं ओर अधिसूचना घंटी छुपाएं।",
    hideOverlaySuggestions:
      "रुके हुए समय में दिखाए गए कार्ड टीज़र और उम्मीदवार ओवरले छिपाएँ।",
    hidePlayables:
      "होम और समान पृष्ठों पर YouTube Playables अलमारियों को छुपाएं।",
    hidePlaylistSuggestions:
      "प्लेलिस्ट पृष्ठों और समान पृष्ठों पर अनुशंसा अनुभाग छिपाएँ।",
    hideQuickLinksSection:
      "बाएं दराज में आपको, इतिहास और इसी तरह के अनुभाग छुपाएं।",
    hideSearchDescriptions:
      "खोज परिणाम कार्ड में विवरण और पूरक मेटाडेटा छिपाएँ।",
    hideSearchExtraResults:
      "खोज परिणामों में संबंधित शेल्फ़ और अतिरिक्त अनुभाग छिपाएँ।",
    hideSearchInfiniteScroll: "खोज परिणामों के अंत में निरंतरता लोडर छिपाएँ।",
    hideSearchPromoted: "खोज परिणामों में मिश्रित प्रचारित वीडियो छिपाएँ।",
    hideSearchShorts: "खोज परिणामों में शॉर्ट्स कार्ड और शॉर्ट्स शेल्फ छुपाएं।",
    hideSearchSuggestions: "खोज बॉक्स सुझाव ड्रॉपडाउन छुपाएं.",
    hideSettingsSection: "बाएँ दराज के नीचे सेटिंग्स-संबंधित अनुभाग छिपाएँ।",
    hideShortsLink:
      "बाएं नेविगेशन और मोबाइल बॉटम नेविगेशन में शॉर्ट्स लिंक छुपाएं।",
    hideSidebarInfiniteScroll:
      "संबंधित-वीडियो साइडबार के अंत में निरंतर लोडिंग छिपाएँ।",
    hideSubscriptionLive: "सदस्यता पृष्ठ पर लाइव वीडियो छिपाएँ।",
    hideSubscriptionMostRelevant:
      "सदस्यता पृष्ठ पर सर्वाधिक प्रासंगिक अनुभाग छिपाएँ।",
    hideSubscriptionPremiere: "सदस्यता पृष्ठ पर प्रीमियर वीडियो छिपाएँ।",
    hideSubscriptionShorts: "सब्सक्रिप्शन पेज पर शॉर्ट्स वीडियो छुपाएं।",
    hideSubscriptionUpcoming: "सदस्यता पृष्ठ पर आगामी वीडियो छिपाएँ।",
    hideSubscriptionVods:
      "सदस्यता पृष्ठ पर स्ट्रीम किए गए के रूप में चिह्नित वीडियो छुपाएं।",
    hideSubscriptionsLink: "सदस्यताओं के लिए नेविगेशन पथ छिपाएँ.",
    hideSubscriptionsSection: "बाएँ दराज में सदस्यता अनुभाग छिपाएँ।",
    hideThumbnailHoverOverlay:
      "खोज परिणामों और समान पृष्ठों में थंबनेल स्लाइड शो प्रभाव छुपाएं।",
    hideVideoActions: "वीडियो के नीचे एक्शन बटन समूह छिपाएँ।",
    hideVideoDescription: "वीडियो विवरण क्षेत्र छिपाएँ.",
    hideVideoLikes: "वीडियो के नीचे लाइक-काउंट टेक्स्ट छुपाएं।",
    hideVideoThumbnails:
      "टेक्स्ट जानकारी पर ज़ोर देने के लिए वीडियो थंबनेल छिपाएँ।",
    hideWatchSidebar: "वीडियो के दाईं ओर संबंधित वीडियो सूची छुपाएं।",
    lockSettingsWithCode: "सेटिंग्स खोलने से पहले एक पुष्टिकरण कोड मांगें।",
    lockSettingsWithTimer:
      "टैम्परमॉन्की मेनू से सेटिंग्स खोलने से पहले 10 सेकंड प्रतीक्षा करें।",
    normalizeShorts:
      "शॉर्ट्स यूआरएल को सामान्य घड़ी यूआरएल पर रीडायरेक्ट करें।",
    onlyShowPlaylists:
      "बाएं नेविगेशन में प्लेलिस्ट के अलावा अन्य प्रमुख लिंक और अनुभागों को दबाएँ।",
    redirectHomeToLibrary: "होम खोलते समय आप/लाइब्रेरी-समकक्ष पृष्ठ पर जाएँ।",
    redirectHomeToSubscriptions: "होम खोलते समय सब्सक्रिप्शन पर जाएँ।",
    redirectHomeToWatchLater: "होम खोलते समय बाद में देखें पर जाएँ।",
    reverseChannelVideos:
      "चैनल पेज वीडियो ग्रिड को उल्टे क्रम में प्रदर्शित करें।",
    scheduleEnabled:
      "केवल सोमवार से शुक्रवार तक 9:00 से 17:00 तक प्रदर्शन समायोजन सक्षम करें।",
    searchEngineMode:
      "अन्य YouTube क्षेत्रों को दबाते समय खोज बार और खोज परिणामों को केंद्रीय रखें।",
    showEndScreenRevealBox:
      "एंड स्क्रीन अनुशंसाएँ छिपी होने पर एक अस्थायी प्रकट बॉक्स दिखाएँ।",
    showHomepageRevealBox:
      "होम अनुशंसाएँ छिपी होने पर एक अस्थायी प्रकट बॉक्स दिखाएँ।",
    showOnlyFirstHomepageRow:
      "होम वीडियो ग्रिड में पहली पंक्ति के बाद पंक्तियाँ छिपाएँ।",
    showSidebarRevealBox:
      "संबंधित वीडियो छुपे होने पर एक अस्थायी खुलासा बॉक्स दिखाएं।",
    shrinkVideoThumbnails: "वीडियो थंबनेल को छोटी निश्चित चौड़ाई पर रखें।",
  },
  fr: {
    autofocusSearch:
      "Concentrez automatiquement le champ de recherche en dehors des pages de surveillance lorsqu'il est vide.",
    autoSkipAds:
      "Cliquez sur les boutons d'annonce désactivables et superposez les boutons de fermeture d'annonce.",
    blurVideoThumbnails: "Flou uniquement les images miniatures de la vidéo.",
    disableAmbientMode:
      "Désactivez le mode ambiant dans le menu des paramètres du lecteur lorsque cela est possible.",
    disableAnnotations:
      "Désactivez les annotations dans le menu des paramètres du lecteur lorsque cela est possible.",
    disableAutoplay:
      "Désactivez la fonction de lecture automatique du lecteur lorsqu'elle est activée.",
    disableFullscreenScroll:
      "Masquez les zones de page déroulantes lorsque le lecteur est en plein écran.",
    disableLogoLink:
      "Désactivez les clics depuis le logo YouTube vers l'accueil.",
    disablePlayOnHover:
      "Masquer les éléments d’aperçu vidéo affichés au survol de la souris.",
    enableTheaterMode:
      "Basculez les pages de surveillance en mode cinéma lorsque vous utilisez le mode normal.",
    expandDescription:
      "Développez la description de la page de lecture lorsque cela est possible.",
    globalEnabled:
      "Activez ou désactivez tous les réglages d’affichage en même temps.",
    grayscaleMode: "Affichez tout YouTube en niveaux de gris.",
    hideAds:
      "Masquez les conteneurs publicitaires et les emplacements de promotion sur la page.",
    hideAllShorts:
      "Masquez les Shorts dans la navigation, les étagères, les résultats de recherche et les cartes vidéo.",
    hideChannelAutoplay:
      "Mettez en pause la vidéo d'introduction en haut des pages de la chaîne lorsqu'elle est présente.",
    hideChannelForYou:
      "Masquez la section Pour vous sur les pages des chaînes.",
    hideChannelSubscribers:
      "Masquez le nombre d’abonnés dans la ligne du propriétaire de la chaîne.",
    hideClipButton: "Détectez et masquez le bouton Clip sous les vidéos.",
    hideCommentProfiles:
      "Masquez les images de profil dans la zone de commentaires.",
    hideCommentReplies: "Masquer les fils de réponse aux commentaires.",
    hideCommentUpvotes:
      "Masquez le nombre de likes dans les actions de commentaires.",
    hideCommentUsernames:
      "Masquez les noms des auteurs dans la zone des commentaires.",
    hideComments:
      "Masquez la zone de commentaires et les panneaux d’invite de commentaires.",
    hideContextBoxes:
      "Masquez les boîtes contextuelles telles que les panneaux d’informations et les cartes supplémentaires.",
    hideCreateButton:
      "Masquer le bouton Créer de la barre supérieure identifié par l'inspection CDP.",
    hideEmbeddedMoreVideos:
      "Masquez les panneaux vidéo supplémentaires affichés en pause dans les lecteurs intégrés.",
    hideEndScreen:
      "Masquez la grille de recommandations affichée à la fin d’une vidéo.",
    hideEntireWatchSidebar:
      "Masquez toute la colonne de droite et centrez la colonne vidéo.",
    hideExploreLink: "Masquer les liens Explorer et Tendances.",
    hideExploreSection: "Masquez la section Explorer dans le tiroir de gauche.",
    hideExtraSidebarTags:
      "Limitez les balises de vidéos associées aux éléments équivalents à « Tous » et « Associés ».",
    hideFooterSection:
      "Masquez les liens de pied de page en bas du tiroir de gauche.",
    hideHomeLink: "Masquez le lien Accueil dans la navigation de gauche.",
    hideHomepageExtraRows:
      "Masquez les sections supplémentaires telles que Shorts et Tendances.",
    hideHomepageHeader:
      "Masquez les puces et les en-têtes de catégorie en haut de la page d'accueil.",
    hideHomepageInfiniteScroll:
      "Masquez les chargeurs de continuation à la fin des listes d’accueil.",
    hideHomepageSuggestions:
      "Masquer les listes de recommandations sur YouTube Home.",
    hideInfoCards: "Masquez les éléments de la carte affichés sur les vidéos.",
    hideLeftNavigation: "Cachez le tiroir de gauche et le mini-guide.",
    hideLiveChat:
      "Masquez la zone de chat en direct sur les pages de surveillance.",
    hideMoreFromYoutubeSection:
      "Masquez les sections équivalentes à Plus de YouTube dans le tiroir de gauche.",
    hideNextButton: "Masquez le bouton Suivant à l’intérieur du lecteur.",
    hideNonTimestampComments:
      "Conservez uniquement les commentaires qui incluent des liens d’horodatage vidéo.",
    hideNotificationBell:
      "Masquez la cloche de notification sur le côté droit de l’en-tête.",
    hideOverlaySuggestions:
      "Masquez les teasers de cartes et les superpositions de candidats affichés en pause.",
    hidePlayables:
      "Masquez les étagères YouTube Playables sur les pages d'accueil et similaires.",
    hidePlaylistSuggestions:
      "Masquez les sections de recommandations sur les pages de playlist et les pages similaires.",
    hideQuickLinksSection:
      "Cachez-vous, l'historique et les sections similaires dans le tiroir de gauche.",
    hideSearchDescriptions:
      "Masquez les descriptions et les métadonnées supplémentaires dans les cartes de résultats de recherche.",
    hideSearchExtraResults:
      "Masquez les étagères associées et les sections supplémentaires dans les résultats de recherche.",
    hideSearchInfiniteScroll:
      "Masquez les chargeurs de continuation à la fin des résultats de recherche.",
    hideSearchPromoted:
      "Masquez les vidéos sponsorisées mélangées aux résultats de recherche.",
    hideSearchShorts:
      "Masquez les fiches Shorts et les étagères Shorts dans les résultats de recherche.",
    hideSearchSuggestions:
      "Masquez la liste déroulante des suggestions du champ de recherche.",
    hideSettingsSection:
      "Masquez les sections liées aux paramètres en bas du tiroir de gauche.",
    hideShortsLink:
      "Masquer les liens Shorts dans la navigation de gauche et dans la navigation inférieure du mobile.",
    hideSidebarInfiniteScroll:
      "Masquez le chargement de la suite à la fin de la barre latérale de la vidéo associée.",
    hideSubscriptionLive:
      "Masquez les vidéos en direct sur la page Abonnements.",
    hideSubscriptionMostRelevant:
      "Masquez la section la plus pertinente sur la page Abonnements.",
    hideSubscriptionPremiere:
      "Masquez les vidéos Premiere sur la page Abonnements.",
    hideSubscriptionShorts:
      "Masquez les vidéos Shorts sur la page Abonnements.",
    hideSubscriptionUpcoming:
      "Masquez les vidéos à venir sur la page Abonnements.",
    hideSubscriptionVods:
      "Masquez les vidéos marquées comme diffusées en streaming sur la page Abonnements.",
    hideSubscriptionsLink:
      "Masquez les chemins de navigation vers les abonnements.",
    hideSubscriptionsSection:
      "Masquez la section abonnements dans le tiroir de gauche.",
    hideThumbnailHoverOverlay:
      "Masquez les effets du diaporama miniature dans les résultats de recherche et les pages similaires.",
    hideVideoActions: "Masquez le groupe de boutons d'action sous les vidéos.",
    hideVideoDescription: "Masquez la zone de description de la vidéo.",
    hideVideoLikes: "Masquez le texte du nombre de likes sous les vidéos.",
    hideVideoThumbnails:
      "Masquez les miniatures des vidéos pour mettre en valeur les informations textuelles.",
    hideWatchSidebar:
      "Masquez la liste des vidéos associées sur le côté droit des vidéos.",
    lockSettingsWithCode:
      "Demandez un code de confirmation avant d'ouvrir les paramètres.",
    lockSettingsWithTimer:
      "Attendez 10 secondes avant d'ouvrir les paramètres depuis le menu Tampermonkey.",
    normalizeShorts:
      "Redirigez les URL des courts métrages vers les URL de lecture normales.",
    onlyShowPlaylists:
      "Supprimez les principaux liens et sections autres que les listes de lecture dans la navigation de gauche.",
    redirectHomeToLibrary:
      "Accédez à la page Vous/équivalent à la bibliothèque lors de l’ouverture de l’accueil.",
    redirectHomeToSubscriptions:
      "Accédez à Abonnements lors de l’ouverture de l’accueil.",
    redirectHomeToWatchLater:
      "Passez à Regarder plus tard lors de l’ouverture de l’accueil.",
    reverseChannelVideos:
      "Affichez les grilles vidéo des pages de chaînes dans l’ordre inverse.",
    scheduleEnabled:
      "Activez les réglages d'affichage uniquement du lundi au vendredi, de 9h00 à 17h00.",
    searchEngineMode:
      "Gardez la barre de recherche et les résultats de recherche au centre tout en supprimant les autres zones YouTube.",
    showEndScreenRevealBox:
      "Afficher une boîte de révélation temporaire lorsque les recommandations de l'écran de fin sont masquées.",
    showHomepageRevealBox:
      "Afficher une boîte de révélation temporaire lorsque les recommandations d'accueil sont masquées.",
    showOnlyFirstHomepageRow:
      "Masquez les lignes après la première ligne dans la grille vidéo d'accueil.",
    showSidebarRevealBox:
      "Afficher une boîte de révélation temporaire lorsque les vidéos associées sont masquées.",
    shrinkVideoThumbnails:
      "Conservez les vignettes vidéo sur une largeur fixe plus petite.",
  },
  pt: {
    autofocusSearch:
      "Foque a caixa de pesquisa automaticamente fora das páginas de exibição quando ela estiver vazia.",
    autoSkipAds:
      "Clique nos botões de anúncios ignoráveis e nos botões de fechamento de anúncios sobrepostos.",
    blurVideoThumbnails: "Desfoque apenas imagens em miniatura de vídeo.",
    disableAmbientMode:
      "Desligue o modo ambiente no menu de configurações do player sempre que possível.",
    disableAnnotations:
      "Desative as anotações no menu de configurações do player sempre que possível.",
    disableAutoplay:
      "Desligue a reprodução automática do player quando estiver ligada.",
    disableFullscreenScroll:
      "Oculte áreas de página roláveis enquanto o player estiver em tela cheia.",
    disableLogoLink:
      "Desative os cliques do logotipo do YouTube de volta à página inicial.",
    disablePlayOnHover:
      "Oculte os elementos de visualização do vídeo mostrados ao passar o mouse.",
    enableTheaterMode:
      "Mude as páginas de exibição para o modo teatro ao usar o modo normal.",
    expandDescription:
      "Expanda a descrição da página de exibição sempre que possível.",
    globalEnabled:
      "Ative ou desative todos os ajustes de exibição de uma só vez.",
    grayscaleMode: "Exiba todo o YouTube em escala de cinza.",
    hideAds: "Oculte contêineres de anúncios e espaços promocionais na página.",
    hideAllShorts:
      "Oculte Shorts na navegação, estantes, resultados de pesquisa e placas de vídeo.",
    hideChannelAutoplay:
      "Pause o vídeo de introdução na parte superior das páginas do canal, quando presente.",
    hideChannelForYou: "Oculte a seção Para você nas páginas do canal.",
    hideChannelSubscribers:
      "Oculte a contagem de inscritos na linha do proprietário do canal.",
    hideClipButton: "Detecte e oculte o botão Clip abaixo dos vídeos.",
    hideCommentProfiles: "Oculte as imagens do perfil na área de comentários.",
    hideCommentReplies: "Ocultar tópicos de resposta a comentários.",
    hideCommentUpvotes:
      "Oculte contagens de curtidas dentro de ações de comentários.",
    hideCommentUsernames: "Oculte os nomes dos autores na área de comentários.",
    hideComments:
      "Oculte a área de comentários e os painéis de prompt de comentários.",
    hideContextBoxes:
      "Oculte caixas contextuais, como painéis de informações e cartões complementares.",
    hideCreateButton:
      "Oculte o botão Criar da barra superior identificado pela inspeção do CDP.",
    hideEmbeddedMoreVideos:
      "Oculte painéis de vídeo extras exibidos em pausa em players incorporados.",
    hideEndScreen:
      "Oculte a grade de recomendações exibida quando um vídeo termina.",
    hideEntireWatchSidebar:
      "Oculte toda a coluna da direita e centralize a coluna do vídeo.",
    hideExploreLink: "Ocultar links Explorar e Tendências.",
    hideExploreSection: "Oculte a seção Explorar na gaveta esquerda.",
    hideExtraSidebarTags:
      'Limite as tags de vídeos relacionados a itens equivalentes a "Todos" e "Relacionados".',
    hideFooterSection:
      "Oculte os links do rodapé na parte inferior da gaveta esquerda.",
    hideHomeLink: "Oculte o link Home na navegação esquerda.",
    hideHomepageExtraRows:
      "Oculte seções adicionais, como Shorts e Tendências.",
    hideHomepageHeader:
      "Oculte ícones e cabeçalhos de categoria na parte superior da página inicial.",
    hideHomepageInfiniteScroll:
      "Oculte os carregadores de continuação no final das listas iniciais.",
    hideHomepageSuggestions:
      "Ocultar listas de recomendações na página inicial do YouTube.",
    hideInfoCards: "Oculte os elementos do cartão exibidos nos vídeos.",
    hideLeftNavigation: "Esconda a gaveta esquerda e a mini guia.",
    hideLiveChat: "Oculte a área de chat ao vivo nas páginas de exibição.",
    hideMoreFromYoutubeSection:
      "Oculte seções equivalentes a Mais do YouTube na gaveta esquerda.",
    hideNextButton: "Oculte o botão Avançar dentro do player.",
    hideNonTimestampComments:
      "Mantenha apenas comentários que incluam links de carimbo de data/hora do vídeo.",
    hideNotificationBell:
      "Oculte o sino de notificação no lado direito do cabeçalho.",
    hideOverlaySuggestions:
      "Oculte teasers de cartões e sobreposições de candidatos exibidos durante a pausa.",
    hidePlayables:
      "Oculte as prateleiras de Playables do YouTube na página inicial e em páginas semelhantes.",
    hidePlaylistSuggestions:
      "Oculte seções de recomendação em páginas de playlists e páginas semelhantes.",
    hideQuickLinksSection:
      "Oculte você, histórico e seções semelhantes na gaveta esquerda.",
    hideSearchDescriptions:
      "Oculte descrições e metadados complementares nos cartões de resultados de pesquisa.",
    hideSearchExtraResults:
      "Oculte estantes relacionadas e seções extras nos resultados da pesquisa.",
    hideSearchInfiniteScroll:
      "Oculte os carregadores de continuação no final dos resultados da pesquisa.",
    hideSearchPromoted:
      "Oculte vídeos promovidos misturados aos resultados da pesquisa.",
    hideSearchShorts:
      "Oculte cards e estantes de Shorts nos resultados da pesquisa.",
    hideSearchSuggestions:
      "Oculte o menu suspenso de sugestões da caixa de pesquisa.",
    hideSettingsSection:
      "Oculte as seções relacionadas às configurações na parte inferior da gaveta esquerda.",
    hideShortsLink:
      "Oculte links de Shorts na navegação esquerda e na navegação inferior do celular.",
    hideSidebarInfiniteScroll:
      "Oculte o carregamento de continuação no final da barra lateral do vídeo relacionado.",
    hideSubscriptionLive: "Oculte vídeos ao vivo na página de inscrições.",
    hideSubscriptionMostRelevant:
      "Oculte a seção Mais relevante na página Assinaturas.",
    hideSubscriptionPremiere:
      "Oculte os vídeos do Premiere na página de assinaturas.",
    hideSubscriptionShorts: "Oculte vídeos de Shorts na página de inscrições.",
    hideSubscriptionUpcoming:
      "Oculte os próximos vídeos na página de inscrições.",
    hideSubscriptionVods:
      "Ocultar vídeos marcados como Transmitidos na página de Inscrições.",
    hideSubscriptionsLink: "Oculte caminhos de navegação para assinaturas.",
    hideSubscriptionsSection:
      "Oculte a seção de assinaturas na gaveta esquerda.",
    hideThumbnailHoverOverlay:
      "Oculte efeitos de apresentação de slides em miniatura nos resultados de pesquisa e páginas semelhantes.",
    hideVideoActions: "Oculte o grupo de botões de ação abaixo dos vídeos.",
    hideVideoDescription: "Oculte a área de descrição do vídeo.",
    hideVideoLikes: "Oculte o texto de contagem de curtidas abaixo dos vídeos.",
    hideVideoThumbnails:
      "Oculte as miniaturas dos vídeos para enfatizar as informações do texto.",
    hideWatchSidebar:
      "Oculte a lista de vídeos relacionados no lado direito dos vídeos.",
    lockSettingsWithCode:
      "Peça um código de confirmação antes de abrir as configurações.",
    lockSettingsWithTimer:
      "Aguarde 10 segundos antes de abrir as configurações do menu Tampermonkey.",
    normalizeShorts:
      "Redirecione URLs de Shorts para URLs de exibição normais.",
    onlyShowPlaylists:
      "Suprima links e seções principais que não sejam listas de reprodução na navegação esquerda.",
    redirectHomeToLibrary:
      "Vá para a página equivalente a Você/Biblioteca ao abrir a Página inicial.",
    redirectHomeToSubscriptions:
      "Vá para Assinaturas ao abrir a página inicial.",
    redirectHomeToWatchLater:
      "Vá para Assistir mais tarde ao abrir a página inicial.",
    reverseChannelVideos:
      "Exiba as grades de vídeo da página do canal na ordem inversa.",
    scheduleEnabled:
      "Habilite os ajustes de exibição apenas de segunda a sexta, das 9h às 17h.",
    searchEngineMode:
      "Mantenha a barra de pesquisa e os resultados da pesquisa centralizados enquanto suprime outras áreas do YouTube.",
    showEndScreenRevealBox:
      "Mostrar uma caixa de revelação temporária quando as recomendações da tela final estiverem ocultas.",
    showHomepageRevealBox:
      "Mostrar uma caixa de revelação temporária quando as recomendações da página inicial estiverem ocultas.",
    showOnlyFirstHomepageRow:
      "Oculte as linhas após a primeira linha na grade do vídeo doméstico.",
    showSidebarRevealBox:
      "Mostrar uma caixa de revelação temporária quando vídeos relacionados estiverem ocultos.",
    shrinkVideoThumbnails:
      "Mantenha as miniaturas dos vídeos em uma largura fixa menor.",
  },
  bn: {
    autofocusSearch:
      "সার্চ বাক্সটি যখন খালি থাকে তখন দেখার পৃষ্ঠাগুলির বাইরে স্বয়ংক্রিয়ভাবে ফোকাস করুন৷",
    autoSkipAds:
      "এড়িয়ে যাওয়া বিজ্ঞাপন বোতাম এবং ওভারলে বিজ্ঞাপন বন্ধ বোতামে ক্লিক করুন।",
    blurVideoThumbnails: "শুধুমাত্র ভিডিও থাম্বনেল ছবি অস্পষ্ট করুন।",
    disableAmbientMode:
      "যেখানে সম্ভব প্লেয়ার সেটিংস মেনুতে অ্যাম্বিয়েন্ট মোড বন্ধ করুন।",
    disableAnnotations: "যেখানে সম্ভব প্লেয়ার সেটিংস মেনুতে টীকা বন্ধ করুন।",
    disableAutoplay: "প্লেয়ার অটোপ্লে টগল চালু হলে এটি বন্ধ করুন।",
    disableFullscreenScroll:
      "প্লেয়ার পূর্ণস্ক্রীন থাকাকালীন স্ক্রোলযোগ্য পৃষ্ঠার এলাকাগুলি লুকান৷",
    disableLogoLink: "YouTube লোগো থেকে হোমে ফিরে ক্লিকগুলি অক্ষম করুন৷",
    disablePlayOnHover: "মাউস হোভারে দেখানো ভিডিও প্রিভিউ উপাদান লুকান।",
    enableTheaterMode:
      "সাধারণ মোড ব্যবহার করার সময় ঘড়ির পৃষ্ঠাগুলিকে থিয়েটার মোডে পরিবর্তন করুন।",
    expandDescription: "যেখানে সম্ভব দেখা পৃষ্ঠার বিবরণ প্রসারিত করুন।",
    globalEnabled: "সব ডিসপ্লে অ্যাডজাস্টমেন্ট একবারে চালু বা বন্ধ করুন।",
    grayscaleMode: "সমস্ত YouTube গ্রেস্কেলে প্রদর্শন করুন।",
    hideAds: "পৃষ্ঠায় বিজ্ঞাপন কন্টেনার এবং প্রচার স্লট লুকান.",
    hideAllShorts:
      "নেভিগেশন, তাক, অনুসন্ধান ফলাফল এবং ভিডিও কার্ডগুলিতে শর্টস লুকান।",
    hideChannelAutoplay:
      "উপস্থিত থাকাকালীন চ্যানেল পৃষ্ঠাগুলির শীর্ষে ভূমিকা ভিডিওটি বিরতি দিন৷",
    hideChannelForYou: "চ্যানেল পৃষ্ঠাগুলিতে আপনার জন্য বিভাগটি লুকান।",
    hideChannelSubscribers: "চ্যানেল মালিকের সারিতে গ্রাহক সংখ্যা লুকান।",
    hideClipButton: "ভিডিওগুলির নীচে ক্লিপ বোতামটি সনাক্ত করুন এবং লুকান৷",
    hideCommentProfiles: "মন্তব্য এলাকায় প্রোফাইল ছবি লুকান.",
    hideCommentReplies: "মন্তব্য উত্তর থ্রেড লুকান.",
    hideCommentUpvotes: "মন্তব্য কর্মের মধ্যে লাইক গণনা লুকান.",
    hideCommentUsernames: "মন্তব্য এলাকায় লেখক নাম লুকান.",
    hideComments: "মন্তব্য এলাকা এবং মন্তব্য প্রম্পট প্যানেল লুকান.",
    hideContextBoxes:
      "তথ্য প্যানেল এবং সম্পূরক কার্ডের মতো প্রাসঙ্গিক বাক্সগুলি লুকান৷",
    hideCreateButton:
      "সিডিপি পরিদর্শন দ্বারা চিহ্নিত শীর্ষ বার তৈরি করুন বোতামটি লুকান।",
    hideEmbeddedMoreVideos:
      "এমবেড করা প্লেয়ারে বিরতিতে দেখানো অতিরিক্ত ভিডিও প্যানেল লুকান।",
    hideEndScreen: "একটি ভিডিও শেষ হলে দেখানো সুপারিশ গ্রিড লুকান।",
    hideEntireWatchSidebar:
      "পুরো ডান কলামটি লুকান এবং ভিডিও কলামকে কেন্দ্র করে।",
    hideExploreLink: "এক্সপ্লোর এবং ট্রেন্ডিং লিঙ্কগুলি লুকান৷",
    hideExploreSection: "বাম ড্রয়ারে এক্সপ্লোর বিভাগটি লুকান।",
    hideExtraSidebarTags:
      'সম্পর্কিত-ভিডিও ট্যাগগুলিকে "সমস্ত" এবং "সম্পর্কিত" এর সমতুল্য আইটেমগুলিতে সীমাবদ্ধ করুন।',
    hideFooterSection: "বাম ড্রয়ারের নীচে ফুটার লিঙ্কগুলি লুকান৷",
    hideHomeLink: "বাম নেভিগেশনে হোম লিঙ্কটি লুকান।",
    hideHomepageExtraRows: "অতিরিক্ত বিভাগ লুকান যেমন শর্টস এবং ট্রেন্ডিং।",
    hideHomepageHeader: "হোমের শীর্ষে বিভাগ চিপ এবং শিরোনামগুলি লুকান৷",
    hideHomepageInfiniteScroll: "হোম তালিকার শেষে ধারাবাহিকতা লোডার লুকান।",
    hideHomepageSuggestions: "YouTube হোমে সুপারিশ তালিকা লুকান।",
    hideInfoCards: "ভিডিওতে দেখানো কার্ড উপাদান লুকান।",
    hideLeftNavigation: "বাম ড্রয়ার এবং মিনি গাইড লুকান.",
    hideLiveChat: "ওয়াচ পেজে লাইভ চ্যাট এলাকা লুকান।",
    hideMoreFromYoutubeSection:
      "বাম ড্রয়ারে YouTube থেকে More এর সমতুল্য বিভাগগুলি লুকান৷",
    hideNextButton: "প্লেয়ারের ভিতরে নেক্সট বোতামটি লুকান।",
    hideNonTimestampComments:
      "শুধুমাত্র ভিডিও টাইমস্ট্যাম্প লিঙ্ক অন্তর্ভুক্ত মন্তব্য রাখুন.",
    hideNotificationBell: "হেডারের ডানদিকে বিজ্ঞপ্তি বেলটি লুকান।",
    hideOverlaySuggestions:
      "পজ করার সময় দেখানো কার্ড টিজার এবং প্রার্থীর ওভারলে লুকান।",
    hidePlayables: "হোম এবং অনুরূপ পৃষ্ঠাগুলিতে YouTube Playables তাক লুকান৷",
    hidePlaylistSuggestions:
      "প্লেলিস্ট পৃষ্ঠা এবং অনুরূপ পৃষ্ঠাগুলিতে সুপারিশ বিভাগগুলি লুকান৷",
    hideQuickLinksSection:
      "বাম ড্রয়ারে আপনি, ইতিহাস এবং অনুরূপ বিভাগগুলি লুকান৷",
    hideSearchDescriptions:
      "অনুসন্ধান ফলাফল কার্ডে বর্ণনা এবং সম্পূরক মেটাডেটা লুকান।",
    hideSearchExtraResults:
      "অনুসন্ধান ফলাফলে সম্পর্কিত তাক এবং অতিরিক্ত বিভাগ লুকান।",
    hideSearchInfiniteScroll: "সার্চ ফলাফলের শেষে ধারাবাহিকতা লোডার লুকান।",
    hideSearchPromoted: "অনুসন্ধান ফলাফলে মিশ্রিত প্রচারিত ভিডিওগুলি লুকান৷",
    hideSearchShorts: "সার্চের ফলাফলে Shorts কার্ড এবং Shorts শেল্ফ লুকান।",
    hideSearchSuggestions: "সার্চ বক্স সাজেশন ড্রপডাউন লুকান।",
    hideSettingsSection: "বাম ড্রয়ারের নীচে সেটিংস-সম্পর্কিত বিভাগগুলি লুকান৷",
    hideShortsLink:
      "বাঁদিকের নেভিগেশন এবং মোবাইলের নিচের নেভিগেশনে Shorts লিঙ্ক লুকান।",
    hideSidebarInfiniteScroll:
      "সম্পর্কিত-ভিডিও সাইডবারের শেষে ধারাবাহিকতা লোডিং লুকান।",
    hideSubscriptionLive: "সদস্যতা পৃষ্ঠায় লাইভ ভিডিও লুকান.",
    hideSubscriptionMostRelevant:
      "সদস্যতা পৃষ্ঠায় সবচেয়ে প্রাসঙ্গিক বিভাগটি লুকান।",
    hideSubscriptionPremiere: "সদস্যতা পৃষ্ঠায় প্রিমিয়ার ভিডিও লুকান।",
    hideSubscriptionShorts: "সদস্যতা পৃষ্ঠায় Shorts ভিডিও লুকান।",
    hideSubscriptionUpcoming: "সদস্যতা পৃষ্ঠায় আসন্ন ভিডিও লুকান.",
    hideSubscriptionVods:
      "সাবস্ক্রিপশন পৃষ্ঠায় প্রবাহিত হিসাবে চিহ্নিত ভিডিওগুলি লুকান৷",
    hideSubscriptionsLink: "সদস্যতা নেভিগেশন পাথ লুকান.",
    hideSubscriptionsSection: "বাম ড্রয়ারে সদস্যতা বিভাগটি লুকান।",
    hideThumbnailHoverOverlay:
      "অনুসন্ধান ফলাফল এবং অনুরূপ পৃষ্ঠাগুলিতে থাম্বনেইল স্লাইডশো প্রভাবগুলি লুকান৷",
    hideVideoActions: "ভিডিওগুলির নীচে অ্যাকশন বোতাম গ্রুপটি লুকান৷",
    hideVideoDescription: "ভিডিও বর্ণনা এলাকা লুকান.",
    hideVideoLikes: "ভিডিওর নিচে লাইক-কাউন্ট টেক্সট লুকান।",
    hideVideoThumbnails: "পাঠ্য তথ্যের উপর জোর দিতে ভিডিও থাম্বনেইল লুকান।",
    hideWatchSidebar: "ভিডিওগুলির ডানদিকে সম্পর্কিত-ভিডিও তালিকাটি লুকান৷",
    lockSettingsWithCode:
      "সেটিংস খোলার আগে একটি নিশ্চিতকরণ কোডের জন্য জিজ্ঞাসা করুন।",
    lockSettingsWithTimer:
      "Tampermonkey মেনু থেকে সেটিংস খোলার আগে 10 সেকেন্ড অপেক্ষা করুন।",
    normalizeShorts: "শর্ট ইউআরএলগুলোকে সাধারণ ঘড়ির ইউআরএলে রিডাইরেক্ট করুন।",
    onlyShowPlaylists:
      "বাম নেভিগেশনে প্লেলিস্ট ব্যতীত প্রধান লিঙ্ক এবং বিভাগগুলি দমন করুন।",
    redirectHomeToLibrary:
      "হোম খোলার সময় আপনি/লাইব্রেরি-সমতুল্য পৃষ্ঠায় যান।",
    redirectHomeToSubscriptions: "হোম খোলার সময় সাবস্ক্রিপশনে যান।",
    redirectHomeToWatchLater: "হোম খোলার সময় পরে দেখুন-এ যান।",
    reverseChannelVideos:
      "চ্যানেল পৃষ্ঠা ভিডিও গ্রিড বিপরীত ক্রমে প্রদর্শন করুন।",
    scheduleEnabled:
      "শুধুমাত্র সোমবার থেকে শুক্রবার 9:00 থেকে 17:00 পর্যন্ত প্রদর্শন সমন্বয় সক্ষম করুন।",
    searchEngineMode:
      "অন্যান্য YouTube এলাকাগুলিকে দমন করার সময় অনুসন্ধান বার এবং অনুসন্ধান ফলাফল কেন্দ্রীয় রাখুন৷",
    showEndScreenRevealBox:
      "শেষ স্ক্রীন প্রস্তাবনাগুলি লুকানো থাকলে একটি অস্থায়ী প্রকাশ বাক্স দেখান৷",
    showHomepageRevealBox:
      "হোম প্রস্তাবনাগুলি লুকানো থাকলে একটি অস্থায়ী প্রকাশ বাক্স দেখান৷",
    showOnlyFirstHomepageRow: "হোম ভিডিও গ্রিডে প্রথম সারির পরে সারি লুকান।",
    showSidebarRevealBox:
      "সম্পর্কিত ভিডিওগুলি লুকানো থাকলে একটি অস্থায়ী প্রকাশ বাক্স দেখান৷",
    shrinkVideoThumbnails: "একটি ছোট নির্দিষ্ট প্রস্থে ভিডিও থাম্বনেল রাখুন।",
  },
  ru: {
    autofocusSearch:
      "Автоматически выводит окно поиска за пределы страниц просмотра, когда оно пусто.",
    autoSkipAds:
      "Нажмите кнопки пропускаемых объявлений и наложите кнопки закрытия объявлений.",
    blurVideoThumbnails: "Размытие только миниатюр видео.",
    disableAmbientMode:
      "Отключите режим окружения в меню настроек плеера, где это возможно.",
    disableAnnotations:
      "Отключите аннотации в меню настроек плеера, где это возможно.",
    disableAutoplay:
      "Выключите переключатель автозапуска проигрывателя, когда он включен.",
    disableFullscreenScroll:
      "Скрывайте прокручиваемые области страниц, когда плеер работает в полноэкранном режиме.",
    disableLogoLink:
      "Отключите переходы от логотипа YouTube обратно на главную.",
    disablePlayOnHover:
      "Скрыть элементы предварительного просмотра видео, отображаемые при наведении курсора мыши.",
    enableTheaterMode:
      "Переключите страницы просмотра в режим театра при использовании обычного режима.",
    expandDescription:
      "Разверните описание страницы просмотра, где это возможно.",
    globalEnabled: "Включите или выключите все настройки дисплея одновременно.",
    grayscaleMode: "Отобразить весь YouTube в оттенках серого.",
    hideAds: "Скройте рекламные контейнеры и рекламные места на странице.",
    hideAllShorts:
      "Скрывайте шорты в навигации, на полках, в результатах поиска и на видеокартах.",
    hideChannelAutoplay:
      "Приостановите вступительное видео вверху страниц канала, если оно есть.",
    hideChannelForYou: "Скройте раздел «Для вас» на страницах канала.",
    hideChannelSubscribers:
      "Скрыть количество подписчиков в строке владельца канала.",
    hideClipButton: "Обнаружьте и скройте кнопку «Клип» под видео.",
    hideCommentProfiles: "Скройте изображения профиля в области комментариев.",
    hideCommentReplies: "Скрыть ветки ответов на комментарии.",
    hideCommentUpvotes:
      "Скрывайте количество лайков внутри действий комментариев.",
    hideCommentUsernames: "Скрыть имена авторов в комментариях.",
    hideComments:
      "Скройте область комментариев и панели подсказок для комментариев.",
    hideContextBoxes:
      "Скройте контекстные поля, такие как информационные панели и дополнительные карточки.",
    hideCreateButton:
      "Скройте верхнюю панель. Кнопка «Создать», обнаруженная при проверке CDP.",
    hideEmbeddedMoreVideos:
      "Скрыть дополнительные видеопанели, отображаемые во время паузы во встроенных проигрывателях.",
    hideEndScreen:
      "Скрыть сетку рекомендаций, отображаемую по окончании видео.",
    hideEntireWatchSidebar:
      "Скройте весь правый столбец и отцентрируйте столбец видео.",
    hideExploreLink: "Скрыть ссылки «Обзор» и «Тенденции».",
    hideExploreSection: "Скройте раздел «Обзор» в левом ящике.",
    hideExtraSidebarTags:
      "Ограничьте теги похожих видео элементами, эквивалентными «Все» и «Похожие».",
    hideFooterSection:
      "Скройте ссылки нижнего колонтитула в нижней части левого ящика.",
    hideHomeLink: "Скройте ссылку «Домой» в левой панели навигации.",
    hideHomepageExtraRows:
      "Скройте дополнительные разделы, такие как «Короткие видео» и «Тенденции».",
    hideHomepageHeader:
      "Скройте чипы категорий и заголовки в верхней части главной страницы.",
    hideHomepageInfiniteScroll:
      "Скрыть загрузчики продолжений в конце главных списков.",
    hideHomepageSuggestions:
      "Скрыть списки рекомендаций на главной странице YouTube.",
    hideInfoCards: "Скройте элементы карточки, отображаемые поверх видео.",
    hideLeftNavigation: "Спрячьте левый ящик и мини-гид.",
    hideLiveChat: "Скройте область чата на страницах просмотра.",
    hideMoreFromYoutubeSection:
      "Скройте разделы, эквивалентные разделу «Еще с YouTube», в левом ящике.",
    hideNextButton: "Скройте кнопку «Далее» внутри плеера.",
    hideNonTimestampComments:
      "Сохраняйте только комментарии, содержащие ссылки на временные метки видео.",
    hideNotificationBell:
      "Скройте колокольчик уведомлений в правой части заголовка.",
    hideOverlaySuggestions:
      "Скройте тизеры карточек и наложения кандидатов, отображаемые во время паузы.",
    hidePlayables:
      "Скройте полки с YouTube Playables на главной и подобных страницах.",
    hidePlaylistSuggestions:
      "Скрывайте разделы рекомендаций на страницах плейлистов и подобных страницах.",
    hideQuickLinksSection:
      "Скройте разделы «Вы», «История» и подобные в левом ящике.",
    hideSearchDescriptions:
      "Скрывайте описания и дополнительные метаданные в карточках результатов поиска.",
    hideSearchExtraResults:
      "Скрывайте связанные полки и дополнительные разделы в результатах поиска.",
    hideSearchInfiniteScroll:
      "Скрыть загрузчики продолжений в конце результатов поиска.",
    hideSearchPromoted:
      "Скрыть рекламируемые видео, смешанные с результатами поиска.",
    hideSearchShorts:
      "Скрыть карточки Shorts и полки Shorts в результатах поиска.",
    hideSearchSuggestions:
      "Скрыть раскрывающийся список предложений в окне поиска.",
    hideSettingsSection:
      "Скройте разделы, связанные с настройками, в нижней части левого ящика.",
    hideShortsLink:
      "Скрыть ссылки Shorts в левой и нижней навигации на мобильных устройствах.",
    hideSidebarInfiniteScroll:
      "Скрыть загрузку продолжения в конце боковой панели похожего видео.",
    hideSubscriptionLive: "Скройте прямые трансляции на странице «Подписки».",
    hideSubscriptionMostRelevant:
      "Скройте раздел «Самое актуальное» на странице «Подписки».",
    hideSubscriptionPremiere:
      "Скрыть премьерные видеоролики на странице «Подписки».",
    hideSubscriptionShorts: "Скройте видео Shorts на странице «Подписки».",
    hideSubscriptionUpcoming:
      "Скрыть предстоящие видео на странице «Подписки».",
    hideSubscriptionVods:
      "Скройте видео, помеченные как «Потоковое воспроизведение» на странице «Подписки».",
    hideSubscriptionsLink: "Скрыть пути навигации к подпискам.",
    hideSubscriptionsSection: "Скройте раздел подписок в левом ящике.",
    hideThumbnailHoverOverlay:
      "Скройте эффекты слайд-шоу миниатюр в результатах поиска и на похожих страницах.",
    hideVideoActions: "Скройте группу кнопок действий под видео.",
    hideVideoDescription: "Скройте область описания видео.",
    hideVideoLikes: "Скрыть текст с количеством лайков под видео.",
    hideVideoThumbnails:
      "Скройте миниатюры видео, чтобы подчеркнуть текстовую информацию.",
    hideWatchSidebar: "Скройте список похожих видео справа от видео.",
    lockSettingsWithCode:
      "Прежде чем открывать настройки, попросите код подтверждения.",
    lockSettingsWithTimer:
      "Подождите 10 секунд, прежде чем открывать настройки из меню Tampermonkey.",
    normalizeShorts:
      "Перенаправьте URL-адреса Shorts на обычные URL-адреса просмотра.",
    onlyShowPlaylists:
      "Подавить основные ссылки и разделы, кроме плейлистов, в левой панели навигации.",
    redirectHomeToLibrary:
      "Перейдите на страницу, эквивалентную «Вы/Библиотека», при открытии «Домой».",
    redirectHomeToSubscriptions:
      "Перейдите в раздел «Подписки» при открытии главной страницы.",
    redirectHomeToWatchLater:
      "Перейдите к просмотру позже при открытии главной страницы.",
    reverseChannelVideos:
      "Отображение сетки видео на странице канала в обратном порядке.",
    scheduleEnabled:
      "Включайте настройку дисплея только с понедельника по пятницу с 9:00 до 17:00.",
    searchEngineMode:
      "Держите панель поиска и результаты поиска в центре, закрывая при этом другие области YouTube.",
    showEndScreenRevealBox:
      "Показывать временное окно отображения, когда рекомендации конечного экрана скрыты.",
    showHomepageRevealBox:
      "Показывать временное окно отображения, когда домашние рекомендации скрыты.",
    showOnlyFirstHomepageRow:
      "Скрыть строки после первой строки в сетке домашнего видео.",
    showSidebarRevealBox:
      "Показывать временное окно раскрытия, когда похожие видео скрыты.",
    shrinkVideoThumbnails:
      "Миниатюры видео должны иметь меньшую фиксированную ширину.",
  },
  ur: {
    autofocusSearch:
      "تلاش کے خانے کو خالی ہونے پر دیکھنے کے صفحات کے باہر خود بخود فوکس کریں۔",
    autoSkipAds:
      "چھوڑنے کے قابل اشتہار بٹن پر کلک کریں اور اشتہار بند کرنے والے بٹنوں کو اوورلے کریں۔",
    blurVideoThumbnails: "صرف ویڈیو تھمب نیل تصاویر کو دھندلا کریں۔",
    disableAmbientMode:
      "جہاں ممکن ہو پلیئر سیٹنگ مینو میں ایمبیئنٹ موڈ کو آف کریں۔",
    disableAnnotations:
      "جہاں ممکن ہو پلیئر سیٹنگ مینو میں تشریحات کو بند کر دیں۔",
    disableAutoplay: "پلیئر آٹو پلے ٹوگل آن ہونے پر اسے آف کر دیں۔",
    disableFullscreenScroll:
      "جب پلیئر پوری اسکرین پر ہو تو اسکرول کے قابل صفحہ کے علاقوں کو چھپائیں۔",
    disableLogoLink: "یوٹیوب لوگو سے واپس ہوم پر کلکس کو غیر فعال کریں۔",
    disablePlayOnHover:
      "ماؤس ہور پر دکھائے گئے ویڈیو پیش نظارہ عناصر کو چھپائیں۔",
    enableTheaterMode:
      "عام موڈ استعمال کرتے وقت واچ پیجز کو تھیٹر موڈ میں تبدیل کریں۔",
    expandDescription: "جہاں ممکن ہو دیکھیں صفحہ کی تفصیل کو پھیلائیں۔",
    globalEnabled: "تمام ڈسپلے ایڈجسٹمنٹ کو ایک ساتھ آن یا آف کریں۔",
    grayscaleMode: "تمام YouTube کو گرے اسکیل میں ڈسپلے کریں۔",
    hideAds: "صفحہ پر اشتہار کے کنٹینرز اور پروموشن سلاٹس کو چھپائیں۔",
    hideAllShorts:
      "نیویگیشن، شیلف، تلاش کے نتائج اور ویڈیو کارڈز میں شارٹس چھپائیں۔",
    hideChannelAutoplay:
      "موجود ہونے پر چینل کے صفحات کے اوپری حصے میں تعارفی ویڈیو کو روک دیں۔",
    hideChannelForYou: "چینل کے صفحات پر آپ کے لیے سیکشن کو چھپائیں۔",
    hideChannelSubscribers:
      "چینل کے مالک کی قطار میں سبسکرائبرز کی تعداد چھپائیں۔",
    hideClipButton: "ویڈیوز کے نیچے کلپ بٹن کا پتہ لگائیں اور چھپائیں۔",
    hideCommentProfiles: "پروفائل امیجز کو تبصرے کے علاقے میں چھپائیں۔",
    hideCommentReplies: "تبصرہ کے جواب کے دھاگوں کو چھپائیں۔",
    hideCommentUpvotes: "تبصرے کی کارروائیوں کے اندر پسند کی تعداد کو چھپائیں۔",
    hideCommentUsernames: "تبصرے کے علاقے میں مصنف کے نام چھپائیں۔",
    hideComments: "تبصرے کے علاقے کو چھپائیں اور پرامپٹ پینل کمنٹس کریں۔",
    hideContextBoxes:
      "سیاق و سباق کے خانوں کو چھپائیں جیسے معلوماتی پینلز اور اضافی کارڈز۔",
    hideCreateButton:
      "اوپری بار کو چھپائیں CDP معائنہ کے ذریعہ شناخت کردہ بٹن بنائیں۔",
    hideEmbeddedMoreVideos:
      "ایمبیڈڈ پلیئرز میں توقف پر دکھائے گئے اضافی ویڈیو پینلز کو چھپائیں۔",
    hideEndScreen:
      "ویڈیو کے ختم ہونے پر دکھائی جانے والی سفارشی گرڈ کو چھپائیں۔",
    hideEntireWatchSidebar:
      "پورے دائیں کالم کو چھپائیں اور ویڈیو کالم کو بیچ میں رکھیں۔",
    hideExploreLink: "ایکسپلور اور ٹرینڈنگ لنکس چھپائیں۔",
    hideExploreSection: "بائیں دراز میں ایکسپلور سیکشن کو چھپائیں۔",
    hideExtraSidebarTags:
      'متعلقہ ویڈیو ٹیگز کو "تمام" اور "متعلقہ" کے مساوی آئٹمز تک محدود کریں۔',
    hideFooterSection: "بائیں دراز کے نیچے فوٹر کے لنکس کو چھپائیں۔",
    hideHomeLink: "بائیں نیویگیشن میں ہوم لنک کو چھپائیں۔",
    hideHomepageExtraRows: "شارٹس اور ٹرینڈنگ جیسے اضافی حصے چھپائیں۔",
    hideHomepageHeader: "ہوم کے اوپری حصے میں زمرہ کے چپس اور ہیڈر چھپائیں۔",
    hideHomepageInfiniteScroll:
      "ہوم لسٹوں کے آخر میں تسلسل کے لوڈرز کو چھپائیں۔",
    hideHomepageSuggestions: "YouTube ہوم پر سفارشات کی فہرستیں چھپائیں۔",
    hideInfoCards: "ویڈیوز پر دکھائے گئے کارڈ کے عناصر کو چھپائیں۔",
    hideLeftNavigation: "بائیں دراز اور منی گائیڈ کو چھپائیں۔",
    hideLiveChat: "لائیو چیٹ ایریا کو واچ پیجز پر چھپائیں۔",
    hideMoreFromYoutubeSection:
      "بائیں دراز میں YouTube سے More کے برابر حصے چھپائیں۔",
    hideNextButton: "پلیئر کے اندر اگلا بٹن چھپائیں۔",
    hideNonTimestampComments:
      "صرف تبصرے رکھیں جن میں ویڈیو ٹائم اسٹیمپ لنکس شامل ہوں۔",
    hideNotificationBell: "ہیڈر کے دائیں جانب نوٹیفکیشن بیل کو چھپائیں۔",
    hideOverlaySuggestions:
      "موقوف کے دوران دکھائے گئے کارڈ ٹیزرز اور امیدوار اوورلیز کو چھپائیں۔",
    hidePlayables:
      "ہوم اور ملتے جلتے صفحات پر YouTube Playables شیلف کو چھپائیں۔",
    hidePlaylistSuggestions:
      "پلے لسٹ کے صفحات اور ملتے جلتے صفحات پر سفارشی حصے چھپائیں۔",
    hideQuickLinksSection:
      "آپ، تاریخ، اور اسی طرح کے حصے بائیں دراز میں چھپائیں۔",
    hideSearchDescriptions:
      "تلاش کے رزلٹ کارڈز میں تفصیل اور اضافی میٹا ڈیٹا چھپائیں۔",
    hideSearchExtraResults:
      "تلاش کے نتائج میں متعلقہ شیلف اور اضافی حصے چھپائیں۔",
    hideSearchInfiniteScroll:
      "تلاش کے نتائج کے آخر میں تسلسل لوڈرز کو چھپائیں۔",
    hideSearchPromoted: "تلاش کے نتائج میں ملی جلی ترقی یافتہ ویڈیوز چھپائیں۔",
    hideSearchShorts: "تلاش کے نتائج میں شارٹس کارڈز اور شارٹس شیلف چھپائیں۔",
    hideSearchSuggestions: "سرچ باکس کی تجویز ڈراپ ڈاؤن کو چھپائیں۔",
    hideSettingsSection: "بائیں دراز کے نیچے ترتیبات سے متعلقہ حصے چھپائیں۔",
    hideShortsLink:
      "بائیں نیویگیشن اور موبائل نیچے نیویگیشن میں شارٹس کے لنکس چھپائیں۔",
    hideSidebarInfiniteScroll:
      "متعلقہ ویڈیو سائڈبار کے آخر میں تسلسل کی لوڈنگ کو چھپائیں۔",
    hideSubscriptionLive: "سبسکرپشنز صفحہ پر لائیو ویڈیوز چھپائیں۔",
    hideSubscriptionMostRelevant:
      "سبسکرپشنز صفحہ پر انتہائی متعلقہ سیکشن کو چھپائیں۔",
    hideSubscriptionPremiere: "سبسکرپشنز صفحہ پر پریمیئر ویڈیوز چھپائیں۔",
    hideSubscriptionShorts: "سبسکرپشنز کے صفحہ پر شارٹس کی ویڈیوز چھپائیں۔",
    hideSubscriptionUpcoming: "سبسکرپشنز پیج پر آنے والی ویڈیوز چھپائیں۔",
    hideSubscriptionVods:
      "سبسکرپشنز کے صفحہ پر اسٹریم شدہ کے بطور نشان زد ویڈیوز چھپائیں۔",
    hideSubscriptionsLink: "سبسکرپشنز کے لیے نیویگیشن کے راستے چھپائیں۔",
    hideSubscriptionsSection: "سبسکرپشن سیکشن کو بائیں دراز میں چھپائیں۔",
    hideThumbnailHoverOverlay:
      "تلاش کے نتائج اور ملتے جلتے صفحات میں تھمب نیل سلائیڈ شو کے اثرات کو چھپائیں۔",
    hideVideoActions: "ویڈیوز کے نیچے ایکشن بٹن گروپ کو چھپائیں۔",
    hideVideoDescription: "ویڈیو کی تفصیل کا علاقہ چھپائیں۔",
    hideVideoLikes: "ویڈیوز کے نیچے لائیک کاؤنٹ ٹیکسٹ چھپائیں۔",
    hideVideoThumbnails:
      "متن کی معلومات پر زور دینے کے لیے ویڈیو تھمب نیلز چھپائیں۔",
    hideWatchSidebar: "متعلقہ ویڈیو کی فہرست کو ویڈیوز کے دائیں جانب چھپائیں۔",
    lockSettingsWithCode: "سیٹنگز کھولنے سے پہلے تصدیقی کوڈ طلب کریں۔",
    lockSettingsWithTimer:
      "ٹیمپرمونکی مینو سے ترتیبات کھولنے سے پہلے 10 سیکنڈ انتظار کریں۔",
    normalizeShorts: "Short URLs کو عام واچ URLs پر ری ڈائریکٹ کریں۔",
    onlyShowPlaylists:
      "بائیں نیویگیشن میں پلے لسٹ کے علاوہ بڑے لنکس اور سیکشنز کو دبا دیں۔",
    redirectHomeToLibrary: "ہوم کھولتے وقت آپ/لائبریری کے مساوی صفحہ پر جائیں۔",
    redirectHomeToSubscriptions: "ہوم کھولتے وقت سبسکرپشنز پر جائیں۔",
    redirectHomeToWatchLater: "ہوم کھولتے وقت بعد میں دیکھیں پر جائیں۔",
    reverseChannelVideos: "چینل پیج ویڈیو گرڈز کو الٹی ترتیب میں ڈسپلے کریں۔",
    scheduleEnabled:
      "ڈسپلے ایڈجسٹمنٹ کو صرف پیر سے جمعہ 9:00 سے 17:00 تک فعال کریں۔",
    searchEngineMode:
      "YouTube کے دیگر علاقوں کو دباتے ہوئے سرچ بار اور تلاش کے نتائج کو مرکزی رکھیں۔",
    showEndScreenRevealBox:
      "اختتامی اسکرین کی سفارشات پوشیدہ ہونے پر ایک عارضی انکشاف باکس دکھائیں۔",
    showHomepageRevealBox:
      "ہوم سفارشات کے پوشیدہ ہونے پر ایک عارضی انکشاف باکس دکھائیں۔",
    showOnlyFirstHomepageRow:
      "ہوم ویڈیو گرڈ میں پہلی قطار کے بعد قطاریں چھپائیں۔",
    showSidebarRevealBox:
      "متعلقہ ویڈیوز کے چھپے ہونے پر ایک عارضی انکشاف باکس دکھائیں۔",
    shrinkVideoThumbnails:
      "ویڈیو تھمب نیلز کو ایک چھوٹی مقررہ چوڑائی تک رکھیں۔",
  },
  es: {
    autofocusSearch:
      "Enfoca el cuadro de búsqueda automáticamente fuera de las páginas de visualización cuando esté vacío.",
    autoSkipAds:
      "Haga clic en los botones de anuncios que se pueden omitir y en los botones de cierre de anuncios superpuestos.",
    blurVideoThumbnails:
      "Desenfoque sólo las imágenes en miniatura de los vídeos.",
    disableAmbientMode:
      "Desactive el modo ambiente en el menú de configuración del reproductor siempre que sea posible.",
    disableAnnotations:
      "Desactive las anotaciones en el menú de configuración del reproductor cuando sea posible.",
    disableAutoplay:
      "Desactiva la reproducción automática del reproductor cuando esté activada.",
    disableFullscreenScroll:
      "Oculte áreas de páginas desplazables mientras el reproductor está en pantalla completa.",
    disableLogoLink:
      "Desactive los clics desde el logotipo de YouTube para regresar a Inicio.",
    disablePlayOnHover:
      "Oculte los elementos de vista previa del video que se muestran al pasar el mouse.",
    enableTheaterMode:
      "Cambie las páginas de visualización al modo cine cuando utilice el modo normal.",
    expandDescription:
      "Amplíe la descripción de la página de visualización siempre que sea posible.",
    globalEnabled: "Active o desactive todos los ajustes de pantalla a la vez.",
    grayscaleMode: "Muestra todo YouTube en escala de grises.",
    hideAds:
      "Oculte contenedores de anuncios y espacios de promoción en la página.",
    hideAllShorts:
      "Oculte cortos en la navegación, estantes, resultados de búsqueda y tarjetas de video.",
    hideChannelAutoplay:
      "Pausa el vídeo de introducción en la parte superior de las páginas del canal cuando esté presente.",
    hideChannelForYou: "Oculta la sección Para ti en las páginas del canal.",
    hideChannelSubscribers:
      "Oculta el recuento de suscriptores en la fila del propietario del canal.",
    hideClipButton: "Detecta y oculta el botón Clip debajo de los videos.",
    hideCommentProfiles:
      "Ocultar imágenes de perfil en el área de comentarios.",
    hideCommentReplies: "Ocultar hilos de respuesta a comentarios.",
    hideCommentUpvotes:
      "Ocultar el recuento de me gusta dentro de las acciones de comentarios.",
    hideCommentUsernames:
      "Oculte los nombres de los autores en el área de comentarios.",
    hideComments:
      "Oculte el área de comentarios y los paneles de mensajes de comentarios.",
    hideContextBoxes:
      "Oculte cuadros contextuales como paneles de información y tarjetas complementarias.",
    hideCreateButton:
      "Oculte el botón Crear de la barra superior identificado por la inspección de CDP.",
    hideEmbeddedMoreVideos:
      "Oculte paneles de video adicionales que se muestran en pausa en reproductores integrados.",
    hideEndScreen:
      "Oculta la cuadrícula de recomendaciones que se muestra cuando finaliza un vídeo.",
    hideEntireWatchSidebar:
      "Oculta toda la columna derecha y centra la columna del vídeo.",
    hideExploreLink: "Ocultar enlaces de Exploración y Tendencias.",
    hideExploreSection: "Oculta la sección Explorar en el cajón izquierdo.",
    hideExtraSidebarTags:
      'Limite las etiquetas de videos relacionados a elementos equivalentes a "Todos" y "Relacionados".',
    hideFooterSection:
      "Oculte los enlaces de pie de página en la parte inferior del cajón izquierdo.",
    hideHomeLink: "Oculte el enlace Inicio en la navegación izquierda.",
    hideHomepageExtraRows:
      "Oculte secciones adicionales como Cortos y Tendencias.",
    hideHomepageHeader:
      "Oculte fichas de categoría y encabezados en la parte superior de Inicio.",
    hideHomepageInfiniteScroll:
      "Ocultar cargadores de continuación al final de las listas de inicio.",
    hideHomepageSuggestions:
      "Ocultar listas de recomendaciones en YouTube Home.",
    hideInfoCards:
      "Oculte los elementos de la tarjeta que se muestran en los videos.",
    hideLeftNavigation: "Oculta el cajón izquierdo y la mini guía.",
    hideLiveChat:
      "Oculta el área de chat en vivo en las páginas de visualización.",
    hideMoreFromYoutubeSection:
      "Oculta secciones equivalentes a Más de YouTube en el cajón izquierdo.",
    hideNextButton: "Oculta el botón Siguiente dentro del reproductor.",
    hideNonTimestampComments:
      "Mantenga solo los comentarios que incluyan enlaces de marca de tiempo de video.",
    hideNotificationBell:
      "Oculta la campana de notificación en el lado derecho del encabezado.",
    hideOverlaySuggestions:
      "Oculte los avances de tarjetas y las superposiciones de candidatos que se muestran mientras está en pausa.",
    hidePlayables:
      "Oculte los estantes de YouTube Reproducibles en Inicio y páginas similares.",
    hidePlaylistSuggestions:
      "Oculte secciones de recomendaciones en páginas de listas de reproducción y páginas similares.",
    hideQuickLinksSection:
      "Oculte usted, Historia y secciones similares en el cajón izquierdo.",
    hideSearchDescriptions:
      "Oculte descripciones y metadatos complementarios en las tarjetas de resultados de búsqueda.",
    hideSearchExtraResults:
      "Oculte estantes relacionados y secciones adicionales en los resultados de búsqueda.",
    hideSearchInfiniteScroll:
      "Ocultar cargadores de continuación al final de los resultados de búsqueda.",
    hideSearchPromoted:
      "Oculte videos promocionados mezclados con los resultados de búsqueda.",
    hideSearchShorts:
      "Oculte tarjetas de cortos y estantes de cortos en los resultados de búsqueda.",
    hideSearchSuggestions:
      "Oculte el menú desplegable de sugerencias del cuadro de búsqueda.",
    hideSettingsSection:
      "Oculte las secciones relacionadas con la configuración en la parte inferior del cajón izquierdo.",
    hideShortsLink:
      "Ocultar enlaces de Shorts en la navegación izquierda y en la navegación inferior del móvil.",
    hideSidebarInfiniteScroll:
      "Ocultar la carga de continuación al final de la barra lateral del vídeo relacionado.",
    hideSubscriptionLive: "Oculte videos en vivo en la página Suscripciones.",
    hideSubscriptionMostRelevant:
      "Oculte la sección Más relevante en la página Suscripciones.",
    hideSubscriptionPremiere:
      "Oculte videos de Premiere en la página Suscripciones.",
    hideSubscriptionShorts: "Oculte videos cortos en la página Suscripciones.",
    hideSubscriptionUpcoming:
      "Ocultar próximos vídeos en la página Suscripciones.",
    hideSubscriptionVods:
      "Oculte videos marcados como Transmitidos en la página Suscripciones.",
    hideSubscriptionsLink: "Ocultar rutas de navegación para suscripciones.",
    hideSubscriptionsSection:
      "Oculta la sección de suscripciones en el cajón izquierdo.",
    hideThumbnailHoverOverlay:
      "Oculte efectos de presentación de diapositivas en miniatura en los resultados de búsqueda y páginas similares.",
    hideVideoActions:
      "Oculte el grupo de botones de acción debajo de los videos.",
    hideVideoDescription: "Oculta el área de descripción del video.",
    hideVideoLikes:
      "Ocultar el texto de recuento de Me gusta debajo de los vídeos.",
    hideVideoThumbnails:
      "Oculte miniaturas de videos para enfatizar la información del texto.",
    hideWatchSidebar:
      "Oculte la lista de videos relacionados en el lado derecho de los videos.",
    lockSettingsWithCode:
      "Solicite un código de confirmación antes de abrir la configuración.",
    lockSettingsWithTimer:
      "Espere 10 segundos antes de abrir la configuración desde el menú de Tampermonkey.",
    normalizeShorts:
      "Redirigir las URL de Shorts a las URL de visualización normales.",
    onlyShowPlaylists:
      "Suprime los enlaces y secciones principales que no sean listas de reproducción en la navegación izquierda.",
    redirectHomeToLibrary:
      "Vaya a la página equivalente a Usted/Biblioteca al abrir Inicio.",
    redirectHomeToSubscriptions: "Vaya a Suscripciones al abrir Inicio.",
    redirectHomeToWatchLater: "Vaya a Ver más tarde al abrir Inicio.",
    reverseChannelVideos:
      "Muestra las cuadrículas de vídeo de la página del canal en orden inverso.",
    scheduleEnabled:
      "Habilite los ajustes de visualización solo de lunes a viernes de 9:00 a 17:00.",
    searchEngineMode:
      "Mantenga la barra de búsqueda y los resultados de búsqueda en el centro mientras suprime otras áreas de YouTube.",
    showEndScreenRevealBox:
      "Muestra un cuadro de revelación temporal cuando las recomendaciones de la pantalla final están ocultas.",
    showHomepageRevealBox:
      "Muestra un cuadro de revelación temporal cuando las recomendaciones de Inicio están ocultas.",
    showOnlyFirstHomepageRow:
      "Oculte filas después de la primera fila en la cuadrícula de videos caseros.",
    showSidebarRevealBox:
      "Muestra un cuadro de revelación temporal cuando los videos relacionados están ocultos.",
    shrinkVideoThumbnails:
      "Mantenga las miniaturas de los vídeos en un ancho fijo más pequeño.",
  },
  ar: {
    autofocusSearch:
      "قم بتركيز مربع البحث تلقائيًا خارج صفحات المشاهدة عندما يكون فارغًا.",
    autoSkipAds:
      "انقر على أزرار الإعلانات القابلة للتخطي وأزرار إغلاق الإعلانات المركّبة.",
    blurVideoThumbnails: "طمس الصور المصغرة للفيديو فقط.",
    disableAmbientMode:
      "قم بإيقاف تشغيل الوضع المحيط في قائمة إعدادات المشغل حيثما أمكن ذلك.",
    disableAnnotations:
      "قم بإيقاف تشغيل التعليقات التوضيحية في قائمة إعدادات المشغل حيثما أمكن ذلك.",
    disableAutoplay:
      "قم بإيقاف تشغيل التشغيل التلقائي للمشغل عندما يكون قيد التشغيل.",
    disableFullscreenScroll:
      "إخفاء مناطق الصفحة القابلة للتمرير عندما يكون المشغل في وضع ملء الشاشة.",
    disableLogoLink: "قم بتعطيل النقرات من شعار YouTube إلى الصفحة الرئيسية.",
    disablePlayOnHover:
      "إخفاء عناصر معاينة الفيديو التي تظهر عند تحريك الماوس.",
    enableTheaterMode:
      "قم بتبديل صفحات المشاهدة إلى وضع المسرح عند استخدام الوضع العادي.",
    expandDescription: "قم بتوسيع وصف صفحة المشاهدة حيثما أمكن ذلك.",
    globalEnabled: "قم بتشغيل كافة تعديلات العرض أو إيقاف تشغيلها مرة واحدة.",
    grayscaleMode: "عرض كل محتوى YouTube بالتدرج الرمادي.",
    hideAds: "إخفاء الحاويات الإعلانية وفتحات الترويج على الصفحة.",
    hideAllShorts:
      "إخفاء السراويل القصيرة في التنقل والأرفف ونتائج البحث وبطاقات الفيديو.",
    hideChannelAutoplay:
      "قم بإيقاف مقطع الفيديو التقديمي مؤقتًا أعلى صفحات القناة عند وجوده.",
    hideChannelForYou: 'إخفاء قسم "لك" في صفحات القناة.',
    hideChannelSubscribers: "إخفاء أعداد المشتركين في صف مالك القناة.",
    hideClipButton: "كشف وإخفاء زر المقطع الموجود أسفل مقاطع الفيديو.",
    hideCommentProfiles: "إخفاء صور الملف الشخصي في منطقة التعليقات.",
    hideCommentReplies: "إخفاء مواضيع الرد على التعليقات.",
    hideCommentUpvotes: "إخفاء أعداد الإعجابات داخل إجراءات التعليق.",
    hideCommentUsernames: "إخفاء أسماء المؤلفين في منطقة التعليقات.",
    hideComments: "إخفاء منطقة التعليقات ولوحات المطالبة بالتعليق.",
    hideContextBoxes:
      "إخفاء المربعات السياقية مثل لوحات المعلومات والبطاقات الإضافية.",
    hideCreateButton:
      "قم بإخفاء زر إنشاء الشريط العلوي الذي تم تحديده بواسطة فحص CDP.",
    hideEmbeddedMoreVideos:
      "إخفاء لوحات الفيديو الإضافية التي تظهر عند الإيقاف المؤقت في المشغلات المضمنة.",
    hideEndScreen: "إخفاء شبكة التوصيات التي تظهر عند انتهاء الفيديو.",
    hideEntireWatchSidebar:
      "قم بإخفاء العمود الأيمن بالكامل وقم بتوسيط عمود الفيديو.",
    hideExploreLink: "إخفاء روابط الاستكشاف والروابط الشائعة.",
    hideExploreSection: "إخفاء قسم الاستكشاف في الدرج الأيسر.",
    hideExtraSidebarTags:
      'قم بتقييد علامات الفيديو ذات الصلة بالعناصر المكافئة لـ "الكل" و"ذات صلة".',
    hideFooterSection: "إخفاء روابط التذييل في أسفل الدرج الأيسر.",
    hideHomeLink: "إخفاء رابط الصفحة الرئيسية في شريط التنقل الأيمن.",
    hideHomepageExtraRows: "إخفاء الأقسام الإضافية مثل Shorts وTrending.",
    hideHomepageHeader:
      "إخفاء شرائح الفئات ورؤوسها في الجزء العلوي من الصفحة الرئيسية.",
    hideHomepageInfiniteScroll:
      "إخفاء أدوات التحميل المستمرة في نهاية القوائم الرئيسية.",
    hideHomepageSuggestions: "إخفاء قوائم التوصيات على صفحة YouTube الرئيسية.",
    hideInfoCards: "إخفاء عناصر البطاقة المعروضة فوق مقاطع الفيديو.",
    hideLeftNavigation: "قم بإخفاء الدرج الأيسر والدليل الصغير.",
    hideLiveChat: "إخفاء منطقة الدردشة المباشرة على صفحات المشاهدة.",
    hideMoreFromYoutubeSection:
      "قم بإخفاء الأقسام المكافئة لـ المزيد من YouTube في الدرج الأيسر.",
    hideNextButton: "إخفاء زر التالي داخل المشغل.",
    hideNonTimestampComments:
      "احتفظ فقط بالتعليقات التي تتضمن روابط الطابع الزمني للفيديو.",
    hideNotificationBell: "إخفاء جرس الإشعارات على الجانب الأيمن من الرأس.",
    hideOverlaySuggestions:
      "إخفاء الجمل المحفزة للبطاقة وتراكبات المرشحين المعروضة أثناء الإيقاف المؤقت.",
    hidePlayables:
      "إخفاء رفوف YouTube Playables على الصفحة الرئيسية والصفحات المشابهة.",
    hidePlaylistSuggestions:
      "إخفاء أقسام التوصيات في صفحات قائمة التشغيل والصفحات المشابهة.",
    hideQuickLinksSection:
      "قم بإخفاء أنت والتاريخ والأقسام المشابهة في الدرج الأيسر.",
    hideSearchDescriptions:
      "إخفاء الأوصاف وبيانات التعريف التكميلية في بطاقات نتائج البحث.",
    hideSearchExtraResults:
      "إخفاء الرفوف ذات الصلة والأقسام الإضافية في نتائج البحث.",
    hideSearchInfiniteScroll:
      "إخفاء أدوات التحميل المستمرة في نهاية نتائج البحث.",
    hideSearchPromoted: "إخفاء مقاطع الفيديو الدعائية الممزوجة بنتائج البحث.",
    hideSearchShorts: "إخفاء بطاقات Shorts ورفوف Shorts في نتائج البحث.",
    hideSearchSuggestions: "إخفاء القائمة المنسدلة لاقتراحات مربع البحث.",
    hideSettingsSection:
      "إخفاء الأقسام المتعلقة بالإعدادات في أسفل الدرج الأيسر.",
    hideShortsLink:
      "إخفاء روابط Shorts في شريط التنقل الأيسر وشريط التنقل السفلي على الهاتف المحمول.",
    hideSidebarInfiniteScroll:
      "إخفاء استمرار التحميل في نهاية الشريط الجانبي للفيديو ذي الصلة.",
    hideSubscriptionLive: "إخفاء مقاطع الفيديو المباشرة في صفحة الاشتراكات.",
    hideSubscriptionMostRelevant:
      "قم بإخفاء القسم الأكثر صلة في صفحة الاشتراكات.",
    hideSubscriptionPremiere: "إخفاء مقاطع الفيديو الأولى في صفحة الاشتراكات.",
    hideSubscriptionShorts: "إخفاء مقاطع الفيديو القصيرة في صفحة الاشتراكات.",
    hideSubscriptionUpcoming: "إخفاء مقاطع الفيديو القادمة في صفحة الاشتراكات.",
    hideSubscriptionVods:
      "إخفاء مقاطع الفيديو التي تم وضع علامة عليها على أنها متدفقة في صفحة الاشتراكات.",
    hideSubscriptionsLink: "إخفاء مسارات التنقل للاشتراكات.",
    hideSubscriptionsSection: "إخفاء قسم الاشتراكات في الدرج الأيسر.",
    hideThumbnailHoverOverlay:
      "إخفاء تأثيرات عرض الشرائح المصغرة في نتائج البحث والصفحات المشابهة.",
    hideVideoActions: "إخفاء مجموعة أزرار الإجراء أسفل مقاطع الفيديو.",
    hideVideoDescription: "إخفاء منطقة وصف الفيديو.",
    hideVideoLikes: "إخفاء نص عدد الإعجابات أسفل مقاطع الفيديو.",
    hideVideoThumbnails:
      "إخفاء الصور المصغرة للفيديو للتأكيد على المعلومات النصية.",
    hideWatchSidebar:
      "إخفاء قائمة مقاطع الفيديو ذات الصلة على الجانب الأيمن من مقاطع الفيديو.",
    lockSettingsWithCode: "اطلب رمز التأكيد قبل فتح الإعدادات.",
    lockSettingsWithTimer:
      "انتظر 10 ثوانٍ قبل فتح الإعدادات من قائمة Tampermonkey.",
    normalizeShorts:
      "إعادة توجيه عناوين URL الخاصة بالشورتات إلى عناوين URL العادية للمشاهدة.",
    onlyShowPlaylists:
      "منع الروابط والأقسام الرئيسية بخلاف قوائم التشغيل في شريط التنقل الأيمن.",
    redirectHomeToLibrary:
      "انتقل إلى صفحة أنت/المكتبة المكافئة عند فتح الصفحة الرئيسية.",
    redirectHomeToSubscriptions:
      "انتقل إلى الاشتراكات عند فتح الصفحة الرئيسية.",
    redirectHomeToWatchLater:
      'انتقل إلى "المشاهدة لاحقًا" عند فتح الصفحة الرئيسية.',
    reverseChannelVideos: "عرض شبكات الفيديو على صفحة القناة بترتيب عكسي.",
    scheduleEnabled:
      "تمكين تعديلات العرض فقط من الاثنين إلى الجمعة من الساعة 9:00 إلى الساعة 17:00.",
    searchEngineMode:
      "احتفظ بشريط البحث ونتائج البحث في المركز مع منع مناطق YouTube الأخرى.",
    showEndScreenRevealBox:
      "إظهار مربع كشف مؤقت عندما تكون توصيات شاشة النهاية مخفية.",
    showHomepageRevealBox:
      "إظهار مربع الكشف المؤقت عندما تكون توصيات الصفحة الرئيسية مخفية.",
    showOnlyFirstHomepageRow:
      "إخفاء الصفوف بعد الصف الأول في شبكة الفيديو الرئيسية.",
    showSidebarRevealBox:
      "إظهار مربع الكشف المؤقت عندما تكون مقاطع الفيديو ذات الصلة مخفية.",
    shrinkVideoThumbnails: "احتفظ بالصور المصغرة للفيديو بعرض ثابت أصغر.",
  },
};

export function translateCategoryLabel(id: string, fallback: string): string {
  if (i18n.getLocale() === "ja") {
    return fallback;
  }

  return (
    categoryLabels[i18n.getLocale()]?.[id] ??
    categoryLabels.en?.[id] ??
    fallback
  );
}

export function translateOptionLabel(
  id: YoutubeUiModifierSettingId,
  fallback: string,
): string {
  if (i18n.getLocale() === "ja") {
    return fallback;
  }

  return (
    optionLabels[i18n.getLocale()]?.[id] ?? optionLabels.en?.[id] ?? fallback
  );
}

export function translateOptionDescription(
  id: YoutubeUiModifierSettingId,
  fallback: string,
): string {
  if (i18n.getLocale() === "ja") {
    return fallback;
  }

  return (
    optionDescriptions[i18n.getLocale()]?.[id] ??
    optionDescriptions.en?.[id] ??
    fallback
  );
}
