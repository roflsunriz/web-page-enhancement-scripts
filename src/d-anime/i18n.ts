import { createI18n, type LocaleCode } from "@/shared/i18n";
import type { NotificationType } from "@/d-anime/services/notification";

type DanimeLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "error"
  | "idLoadFailed"
  | "idSaveFailed"
  | "info"
  | "manualSearchLoadFailed"
  | "manualSearchSaveFailed"
  | "noMessage"
  | "playbackLoadFailed"
  | "playbackSaveFailed"
  | "settingsLoadFailed"
  | "settingsSaved"
  | "settingsSaveFailed"
  | "success"
  | "videoDataLoadFailed"
  | "videoDataSaveFailed"
  | "warning";

const translations = {
  ja: {
    error: "エラー",
    idLoadFailed: "ID情報の読込に失敗しました",
    idSaveFailed: "ID情報の保存に失敗しました",
    info: "情報",
    manualSearchLoadFailed: "検索設定の読込に失敗しました",
    manualSearchSaveFailed: "検索設定の保存に失敗しました",
    noMessage: "メッセージはありません",
    playbackLoadFailed: "再生設定の読み込みに失敗しました",
    playbackSaveFailed: "再生設定の保存に失敗しました",
    settingsLoadFailed: "設定の読み込みに失敗しました",
    settingsSaved: "設定を保存しました",
    settingsSaveFailed: "設定の保存に失敗しました",
    success: "成功",
    videoDataLoadFailed: "動画データの読み込みに失敗しました",
    videoDataSaveFailed: "動画データの保存に失敗しました",
    warning: "警告",
  },
  en: {
    error: "Error",
    idLoadFailed: "Failed to load ID information",
    idSaveFailed: "Failed to save ID information",
    info: "Info",
    manualSearchLoadFailed: "Failed to load search settings",
    manualSearchSaveFailed: "Failed to save search settings",
    noMessage: "No message",
    playbackLoadFailed: "Failed to load playback settings",
    playbackSaveFailed: "Failed to save playback settings",
    settingsLoadFailed: "Failed to load settings",
    settingsSaved: "Settings saved",
    settingsSaveFailed: "Failed to save settings",
    success: "Success",
    videoDataLoadFailed: "Failed to load video data",
    videoDataSaveFailed: "Failed to save video data",
    warning: "Warning",
  },
} satisfies Record<DanimeLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, DanimeLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export function getNotificationTypeLabel(type: NotificationType): string {
  return i18n.t(type);
}

export const t = i18n.t;
