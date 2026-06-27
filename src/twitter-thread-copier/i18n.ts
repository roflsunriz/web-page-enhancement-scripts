import { createI18n, type LocaleCode } from "@/shared/i18n";

type ThreadCopierLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "allMode"
  | "clickToCopy"
  | "collecting"
  | "copyEmptyText"
  | "copyFailed"
  | "copyFromStart"
  | "copyNoData"
  | "copyNoText"
  | "copySelectedTweets"
  | "copyThread"
  | "copied"
  | "firstMode"
  | "googleTranslate"
  | "internalErrorContent"
  | "internalErrorTitle"
  | "localAi"
  | "openAiCompatible"
  | "readyContent"
  | "readyTitle"
  | "resetConfirm"
  | "resetSelection"
  | "selectTweet"
  | "selectedCount"
  | "selectedTitle"
  | "selectionAdded"
  | "selectionCleared"
  | "selectionClearedAll"
  | "selectionErrorContent"
  | "selectionErrorTitle"
  | "selectionRemoved"
  | "selectionReset"
  | "settings"
  | "settingsApiEndpoint"
  | "settingsApiKey"
  | "settingsApiKeyPlaceholder"
  | "settingsCancel"
  | "settingsLocalAi"
  | "settingsModel"
  | "settingsOpenAi"
  | "settingsReset"
  | "settingsResetContent"
  | "settingsResetTitle"
  | "settingsSave"
  | "settingsSavedContent"
  | "settingsSavedTitle"
  | "settingsSystemPrompt"
  | "settingsTitle"
  | "startPointReset"
  | "startPointResetContent"
  | "startPointResetTitle"
  | "startPointSetContent"
  | "startPointSetTitle"
  | "startPointTitle"
  | "summaryChars"
  | "summaryCopied"
  | "summaryStartFrom"
  | "summaryThread"
  | "threadCopyFailed"
  | "translatedSuffix"
  | "translating"
  | "translation"
  | "translationErrorContent"
  | "translationErrorTitle"
  | "translationProvider"
  | "translationToastContent"
  | "translationToastTitle"
  | "unknownError";

const translations = {
  ja: {
    allMode: "全て",
    clickToCopy: "クリックしてコピー",
    collecting: "収集中...",
    copyEmptyText: "コピーするテキストが空です",
    copyFailed: "クリップボードへのコピーに失敗しました。",
    copyFromStart: "{text}からコピー",
    copyNoData: "コピーするデータがありません (threadData is null)",
    copyNoText: "コピーするテキストがありません (formattedText is null)",
    copySelectedTweets: "選択ツイート({count})をコピー",
    copyThread: "スレッドをコピー",
    copied: "コピーしました",
    firstMode: "最初のみ",
    googleTranslate: "Google翻訳",
    internalErrorContent: "処理中に予期せぬエラーが発生しました。",
    internalErrorTitle: "内部エラー",
    localAi: "ローカルAI",
    openAiCompatible: "OpenAI互換",
    readyContent: "{summary} クリックしてコピーしてください",
    readyTitle: "準備完了",
    resetConfirm: "設定をデフォルトに戻しますか？",
    resetSelection: "選択をリセット",
    selectTweet: "このツイートを選択",
    selectedCount: "{count}件選択中",
    selectedTitle: "選択中 ({order})",
    selectionAdded: "選択追加",
    selectionCleared: "選択をすべて解除しました",
    selectionClearedAll: "選択したツイートをすべて解除しました",
    selectionErrorContent:
      "選択したツイートが見つかりませんでした。再度読み込みしてください。",
    selectionErrorTitle: "選択エラー",
    selectionRemoved: "選択解除",
    selectionReset: "選択リセット",
    settings: "設定",
    settingsApiEndpoint: "APIエンドポイント",
    settingsApiKey: "APIキー",
    settingsApiKeyPlaceholder: "常に必要なので必ず入力してください",
    settingsCancel: "キャンセル",
    settingsLocalAi: "ローカルAI設定",
    settingsModel: "モデル名",
    settingsOpenAi: "OpenAI互換設定",
    settingsReset: "リセット",
    settingsResetContent: "設定をデフォルトに戻しました",
    settingsResetTitle: "設定リセット",
    settingsSave: "保存",
    settingsSavedContent: "設定を保存しました",
    settingsSavedTitle: "設定保存",
    settingsSystemPrompt: "システムプロンプト",
    settingsTitle: "翻訳設定",
    startPointReset: "起点をリセット",
    startPointResetContent: "コピー起点をリセットしました",
    startPointResetTitle: "起点リセット",
    startPointSetContent: "{author}のツイートを起点に設定しました",
    startPointSetTitle: "起点設定完了",
    startPointTitle: "この位置からコピー開始",
    summaryChars: "文字数: {count}",
    summaryCopied: "({count}件)をコピーしました。",
    summaryStartFrom: "{author}のツイートから",
    summaryThread: "{author}のスレッド",
    threadCopyFailed: "スレッドのコピーに失敗しました",
    translatedSuffix: " (翻訳済み)",
    translating: "翻訳中...",
    translation: "翻訳",
    translationErrorContent:
      "翻訳中にエラーが発生しましたが、原文をコピーできます",
    translationErrorTitle: "翻訳エラー",
    translationProvider: "翻訳プロバイダー:",
    translationToastContent: "翻訳処理を実行しています...",
    translationToastTitle: "翻訳中",
    unknownError: "不明なエラー",
  },
  en: {
    allMode: "All",
    clickToCopy: "Click to copy",
    collecting: "Collecting...",
    copyEmptyText: "There is no text to copy",
    copyFailed: "Failed to copy to the clipboard.",
    copyFromStart: "Copy from {text}",
    copyNoData: "There is no data to copy (threadData is null)",
    copyNoText: "There is no text to copy (formattedText is null)",
    copySelectedTweets: "Copy selected tweets ({count})",
    copyThread: "Copy thread",
    copied: "Copied",
    firstMode: "First only",
    googleTranslate: "Google Translate",
    internalErrorContent: "An unexpected error occurred while processing.",
    internalErrorTitle: "Internal error",
    localAi: "Local AI",
    openAiCompatible: "OpenAI-compatible",
    readyContent: "{summary} Click to copy.",
    readyTitle: "Ready",
    resetConfirm: "Reset settings to defaults?",
    resetSelection: "Reset selection",
    selectTweet: "Select this tweet",
    selectedCount: "{count} selected",
    selectedTitle: "Selected ({order})",
    selectionAdded: "Selection added",
    selectionCleared: "Cleared all selections",
    selectionClearedAll: "Cleared all selected tweets",
    selectionErrorContent:
      "Selected tweets were not found. Reload the page and try again.",
    selectionErrorTitle: "Selection error",
    selectionRemoved: "Selection removed",
    selectionReset: "Selection reset",
    settings: "Settings",
    settingsApiEndpoint: "API endpoint",
    settingsApiKey: "API key",
    settingsApiKeyPlaceholder: "Required. Enter a key before using this provider.",
    settingsCancel: "Cancel",
    settingsLocalAi: "Local AI settings",
    settingsModel: "Model name",
    settingsOpenAi: "OpenAI-compatible settings",
    settingsReset: "Reset",
    settingsResetContent: "Settings were reset to defaults",
    settingsResetTitle: "Settings reset",
    settingsSave: "Save",
    settingsSavedContent: "Settings were saved",
    settingsSavedTitle: "Settings saved",
    settingsSystemPrompt: "System prompt",
    settingsTitle: "Translation Settings",
    startPointReset: "Reset start point",
    startPointResetContent: "The copy start point was reset",
    startPointResetTitle: "Start point reset",
    startPointSetContent: "Set {author}'s tweet as the start point",
    startPointSetTitle: "Start point set",
    startPointTitle: "Start copying from here",
    summaryChars: "Characters: {count}",
    summaryCopied: "Copied {count} tweet(s).",
    summaryStartFrom: "From {author}'s tweet, ",
    summaryThread: "{author}'s thread",
    threadCopyFailed: "Failed to copy the thread",
    translatedSuffix: " (translated)",
    translating: "Translating...",
    translation: "Translate",
    translationErrorContent:
      "Translation failed, but you can still copy the original text",
    translationErrorTitle: "Translation error",
    translationProvider: "Translation provider:",
    translationToastContent: "Running translation...",
    translationToastTitle: "Translating",
    unknownError: "Unknown error",
  },
} satisfies Record<ThreadCopierLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, ThreadCopierLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
export const t = i18n.t;
