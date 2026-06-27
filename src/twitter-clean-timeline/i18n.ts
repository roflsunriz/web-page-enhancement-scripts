import { createI18n, type LocaleCode } from "@/shared/i18n";

type TimelineLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "addRule"
  | "cancel"
  | "debugMode"
  | "delete"
  | "filteredPlaceholder"
  | "globalSettings"
  | "homeTimeline"
  | "lists"
  | "mediaFilter"
  | "muteFilter"
  | "muteReason"
  | "noMediaReason"
  | "noRules"
  | "profile"
  | "regexHeader"
  | "regexPatterns"
  | "replaceFilter"
  | "replaceHeader"
  | "replacementRules"
  | "reset"
  | "resetApplied"
  | "resetConfirm"
  | "retweetFilter"
  | "retweetReason"
  | "save"
  | "saveApplied"
  | "search"
  | "searchHeader"
  | "settingsMenu"
  | "settingsTitle"
  | "showPlaceholder"
  | "stringKeywords"
  | "tweetDetail";

const translations = {
  ja: {
    addRule: "ルール追加",
    cancel: "キャンセル",
    debugMode: "デバッグモード（コンソールに詳細ログを出力）",
    delete: "削除",
    filteredPlaceholder: "フィルタ済み: {reason}",
    globalSettings: "グローバル設定",
    homeTimeline: "ホームタイムライン",
    lists: "リスト",
    mediaFilter: "メディアフィルタ",
    muteFilter: "ミュートフィルタ",
    muteReason: "ミュート: {keyword}",
    noMediaReason: "メディアなし",
    noRules: "ルールがありません",
    profile: "プロフィール",
    regexHeader: "正規表現",
    regexPatterns: "正規表現パターン（1行1個）",
    replaceFilter: "置き換えフィルタ",
    replaceHeader: "置き換え",
    replacementRules: "置き換えルール",
    reset: "リセット",
    resetApplied: "設定をリセットして適用しました。",
    resetConfirm: "すべての設定をリセットしますか？",
    retweetFilter: "リツイートフィルタ（プロフィールページで動作）",
    retweetReason: "リツイート",
    save: "保存",
    saveApplied: "設定を保存して適用しました。",
    search: "検索",
    searchHeader: "検索",
    settingsMenu: "タイムラインフィルタ設定",
    settingsTitle: "Twitter Clean Timeline 設定",
    showPlaceholder: "プレースホルダー表示（フィルタされたツイートを小さく表示）",
    stringKeywords: "文字列キーワード（1行1個）",
    tweetDetail: "ツイート詳細",
  },
  en: {
    addRule: "Add rule",
    cancel: "Cancel",
    debugMode: "Debug mode (print detailed logs to the console)",
    delete: "Delete",
    filteredPlaceholder: "Filtered: {reason}",
    globalSettings: "Global settings",
    homeTimeline: "Home timeline",
    lists: "Lists",
    mediaFilter: "Media filter",
    muteFilter: "Mute filter",
    muteReason: "Muted: {keyword}",
    noMediaReason: "No media",
    noRules: "No rules",
    profile: "Profile",
    regexHeader: "Regex",
    regexPatterns: "Regex patterns (one per line)",
    replaceFilter: "Replacement filter",
    replaceHeader: "Replace",
    replacementRules: "Replacement rules",
    reset: "Reset",
    resetApplied: "Settings were reset and applied.",
    resetConfirm: "Reset all settings?",
    retweetFilter: "Retweet filter (works on profile pages)",
    retweetReason: "Retweet",
    save: "Save",
    saveApplied: "Settings were saved and applied.",
    search: "Search",
    searchHeader: "Find",
    settingsMenu: "Timeline filter settings",
    settingsTitle: "Twitter Clean Timeline Settings",
    showPlaceholder: "Show placeholders (show filtered tweets in compact form)",
    stringKeywords: "String keywords (one per line)",
    tweetDetail: "Tweet detail",
  },
} satisfies Record<TimelineLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, TimelineLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
export const t = i18n.t;
