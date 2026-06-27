import { createI18n, type LocaleCode } from "@/shared/i18n";

type YoutubeUiModifierLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "activeSettings"
  | "close"
  | "dismissReveal"
  | "enabledCount"
  | "globalDisabled"
  | "menuOpenSettings"
  | "menuToggleEnabled"
  | "noActiveSettings"
  | "resetConfirm"
  | "resetSettings"
  | "revealRecommendations"
  | "settingsCodePrompt"
  | "settingsSubtitle"
  | "settingsTitle";

const translations = {
  ja: {
    activeSettings: "有効中",
    close: "閉じる",
    dismissReveal: "今後表示しない",
    enabledCount: "有効な項目: {count}",
    globalDisabled: "全体設定: 無効",
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
} satisfies Record<YoutubeUiModifierLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, YoutubeUiModifierLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
