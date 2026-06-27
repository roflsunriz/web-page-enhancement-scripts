import { createI18n, type LocaleCode } from "@/shared/i18n";

type KhinsiderLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "close"
  | "concurrency"
  | "startSave"
  | "stop"
  | "idle"
  | "openPanel"
  | "fetchAndSave"
  | "noTrackLinks"
  | "noDirectAudio"
  | "htmlResponse"
  | "nonAudioRedirect"
  | "parsingStage"
  | "downloadStage"
  | "parsingProgress"
  | "stopped"
  | "parsingComplete"
  | "stopPending"
  | "noAudioLinks"
  | "downloading"
  | "downloadProgress"
  | "downloadStopped"
  | "downloadComplete";

const translations = {
  ja: {
    close: "閉じる",
    concurrency: "並列",
    startSave: "保存開始",
    stop: "停止",
    idle: "待機中",
    openPanel: "KHInsider音声保存パネルを開く",
    fetchAndSave: "KHInsider音声ファイルを取得して保存",
    noTrackLinks: "末尾が.mp3の曲ページリンクが見つかりません",
    noDirectAudio: "音声ファイルの直リンクが見つかりません",
    htmlResponse: "HTMLが返されたため音声ファイルとして保存できません",
    nonAudioRedirect: "音声ファイルURLではないレスポンスにリダイレクトされました",
    parsingStage: "解析",
    downloadStage: "ダウンロード",
    parsingProgress:
      "解析中: {completed}/{total} 保存対象 {done} 失敗 {failed} スキップ {skipped}",
    stopped: "停止しました",
    parsingComplete:
      "解析完了: {found}/{total}件の音声ファイルを見つけました",
    stopPending: "停止しました。進行中のリクエストは完了後に破棄されます",
    noAudioLinks: "保存対象の音声リンクがありません",
    downloading: "ダウンロード中: {completed}/{total}",
    downloadProgress:
      "ダウンロード中: {processed}/{total} 完了 {completed} 失敗 {failed}",
    downloadStopped: "ダウンロードを停止しました",
    downloadComplete: "ダウンロード完了: 完了 {completed} 失敗 {failed}",
  },
  en: {
    close: "Close",
    concurrency: "Concurrency",
    startSave: "Start saving",
    stop: "Stop",
    idle: "Idle",
    openPanel: "Open KHInsider audio saver panel",
    fetchAndSave: "Fetch and save KHInsider audio files",
    noTrackLinks: "No track page links ending in .mp3 were found",
    noDirectAudio: "No direct audio file link was found",
    htmlResponse: "HTML was returned, so it cannot be saved as an audio file",
    nonAudioRedirect: "Redirected to a response that is not an audio file URL",
    parsingStage: "Parsing",
    downloadStage: "Download",
    parsingProgress:
      "Parsing: {completed}/{total} targets {done} failed {failed} skipped {skipped}",
    stopped: "Stopped",
    parsingComplete: "Parsing complete: found {found}/{total} audio files",
    stopPending:
      "Stopped. In-flight requests will be discarded after they finish",
    noAudioLinks: "There are no audio links to save",
    downloading: "Downloading: {completed}/{total}",
    downloadProgress:
      "Downloading: {processed}/{total} complete {completed} failed {failed}",
    downloadStopped: "Download stopped",
    downloadComplete: "Download complete: complete {completed} failed {failed}",
  },
} satisfies Record<KhinsiderLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, KhinsiderLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const t = i18n.t;
export const format = i18n.format;
export const getTextDirection = i18n.getDirection;
