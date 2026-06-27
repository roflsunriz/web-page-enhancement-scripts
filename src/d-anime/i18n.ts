import { createI18n, type LocaleCode } from "@/shared/i18n";
import type { NotificationType } from "@/d-anime/services/notification";

type DanimeLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "color"
  | "commentColor"
  | "commentOpacity"
  | "commentSettings"
  | "commentSettingsPanel"
  | "commentVisibility"
  | "commentVisibilityToggle"
  | "currentVideoUnset"
  | "error"
  | "animeTitle"
  | "autoFillSearchForm"
  | "autoSearch"
  | "autoSearchDescription"
  | "autoSearchDisabledManual"
  | "autoSearchEnabled"
  | "autoSearchInfo"
  | "fixedPlaybackRate"
  | "formInput"
  | "freeInput"
  | "idLoadFailed"
  | "idSaveFailed"
  | "info"
  | "manualSearchLoadFailed"
  | "manualSearchSaveFailed"
  | "manualSearchPlaceholder"
  | "ngRegex"
  | "ngRegexPlaceholder"
  | "ngTab"
  | "ngWords"
  | "ngWordsPlaceholder"
  | "noMessage"
  | "playbackRate"
  | "playbackRateFixedToggle"
  | "postedAt"
  | "commentsSet"
  | "autoSetupComplete"
  | "autoSetupError"
  | "commentsHiddenSkip"
  | "commentsLoadComplete"
  | "commentsLoadErrorSelectAnother"
  | "commentsUnavailable"
  | "commentSourceUpdated"
  | "commentFetchError"
  | "domUpdateWaitFailed"
  | "episodeChangeDetected"
  | "episodeNumberMissing"
  | "episodeSwitchError"
  | "initializationError"
  | "initializingCommentLoader"
  | "manualModeSelectAnimeTitle"
  | "manualModeSelectVideo"
  | "manualModeCommentsLoadComplete"
  | "metadataAutoFetchFailed"
  | "niconicoNotFound"
  | "niconicoNotFoundManual"
  | "nextEpisodeAutoSetupComplete"
  | "nextVideoCommentsUnavailableClear"
  | "noAnimeTitle"
  | "officialVideoMissingUseFirst"
  | "officialVideoMissingManual"
  | "officialVideoSafeguardInfo"
  | "unknownTitle"
  | "structuredInput"
  | "thumbnail"
  | "videoDataMissing"
  | "videoId"
  | "videoOwner"
  | "videoSwitchDetected"
  | "videoSwitchError"
  | "episodeNumber"
  | "episodeTitleOptional"
  | "commentCount"
  | "commentCountLong"
  | "mylistCount"
  | "mylistCountLong"
  | "officialVideoMissing"
  | "searchingKeyword"
  | "searchKeywordRequired"
  | "searchNoResults"
  | "searchFormFilled"
  | "similarity"
  | "viewCount"
  | "viewCountLong"
  | "search"
  | "searchAnimePlaceholder"
  | "searchEpisodeNumberPlaceholder"
  | "searchEpisodeTitlePlaceholder"
  | "searchFreeword"
  | "searchInputModeToggle"
  | "searchPage"
  | "searchTab"
  | "searchVideoHeading"
  | "saveSettings"
  | "settings"
  | "settingsClose"
  | "settingsFabLabel"
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
    color: "カラー",
    commentColor: "コメントカラー",
    commentOpacity: "不透明度",
    commentSettings: "コメント設定",
    commentSettingsPanel: "コメント設定パネル",
    commentVisibility: "コメント表示",
    commentVisibilityToggle: "コメント表示切替",
    currentVideoUnset: "オーバーレイする動画が未設定です",
    error: "エラー",
    animeTitle: "アニメタイトル",
    autoFillSearchForm: "検索フォームにタイトル・話数・エピソードタイトルを入力",
    autoSearch: "自動検索",
    autoSearchDescription: "視聴ページ表示時に自動でコメントを設定",
    autoSearchDisabledManual:
      "自動検索を無効にしました（手動設定モード）",
    autoSearchEnabled: "自動検索を有効にしました",
    autoSearchInfo: "自動検索についての説明",
    fixedPlaybackRate: "速度固定",
    formInput: "フォーム入力",
    freeInput: "自由入力",
    idLoadFailed: "ID情報の読込に失敗しました",
    idSaveFailed: "ID情報の保存に失敗しました",
    info: "情報",
    manualSearchLoadFailed: "検索設定の読込に失敗しました",
    manualSearchSaveFailed: "検索設定の保存に失敗しました",
    manualSearchPlaceholder: "検索キーワードを入力",
    ngRegex: "NG正規表現",
    ngRegexPlaceholder: "NG正規表現を1行ずつ入力",
    ngTab: "NG",
    ngWords: "NGワード",
    ngWordsPlaceholder: "NGワードを1行ずつ入力",
    noMessage: "メッセージはありません",
    playbackRate: "再生速度",
    playbackRateFixedToggle: "再生速度固定ON/OFF",
    postedAt: "投稿日",
    commentsSet: "「{title}」のコメントを設定しました",
    autoSetupComplete: "ニコニコ動画を自動設定しました",
    autoSetupError: "自動設定エラー: {message}",
    commentsHiddenSkip: "コメント非表示設定のためスキップしました",
    commentsLoadComplete: "コメントの読み込みが完了しました（{count}件）",
    commentsLoadErrorSelectAnother:
      "コメント読み込みエラー: {message}\nフローティングボタンから別の動画を選択してください。",
    commentsUnavailable: "コメントを取得できませんでした",
    commentSourceUpdated: "コメントソースを更新しました: {title}（{count}件）",
    commentFetchError: "コメント取得エラー: {message}",
    domUpdateWaitFailed: "DOM更新の待機に失敗しました: {message}",
    episodeChangeDetected: "エピソード切り替えを検知しました...",
    episodeNumberMissing: "エピソード話数を取得できませんでした",
    episodeSwitchError: "エピソード切り替えエラー: {message}",
    initializationError: "初期化エラー: {message}",
    initializingCommentLoader: "コメントローダーを初期化中...",
    manualModeSelectAnimeTitle:
      "手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。",
    manualModeSelectVideo:
      "手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。",
    manualModeCommentsLoadComplete:
      "【手動設定モード】コメントの読み込みが完了しました（{count}件）\n動画: {title}",
    metadataAutoFetchFailed:
      "視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。",
    niconicoNotFound: "ニコニコ動画が見つかりませんでした",
    niconicoNotFoundManual:
      "ニコニコ動画が見つかりませんでした。手動で検索してください。",
    nextEpisodeAutoSetupComplete: "次のエピソードを自動設定しました",
    nextVideoCommentsUnavailableClear:
      "次の動画のコメントを取得できませんでした。コメント表示をクリアします。",
    noAnimeTitle:
      "アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。",
    officialVideoMissingUseFirst:
      "公式動画が見つかりませんでした。検索結果の最初の動画を使用します。",
    officialVideoMissingManual:
      "公式動画が見つかりませんでした。手動で検索してください。",
    officialVideoSafeguardInfo: "公式動画セーフガードについて",
    unknownTitle: "不明なタイトル",
    structuredInput: "詳細入力",
    thumbnail: "サムネイル",
    videoDataMissing: "動画データが見つかりません。",
    videoId: "動画ID",
    videoOwner: "投稿者",
    videoSwitchDetected: "動画の切り替わりを検知しました...",
    videoSwitchError: "動画切り替えエラー: {message}",
    episodeNumber: "話数",
    episodeTitleOptional: "エピソードタイトル（任意）",
    commentCount: "コメント",
    commentCountLong: "コメント数",
    mylistCount: "マイリスト",
    mylistCountLong: "マイリスト数",
    officialVideoMissing:
      "公式動画が見つかりませんでした。全ての検索結果を表示しています。",
    searchingKeyword: "「{keyword}」を検索中...",
    searchKeywordRequired: "検索キーワードを入力してください",
    searchNoResults: "検索結果が見つかりませんでした",
    searchFormFilled: "「{keyword}」を検索フォームに入力しました",
    similarity: "類似度: {score}%",
    viewCount: "再生",
    viewCountLong: "再生数",
    search: "検索",
    searchAnimePlaceholder: "例: 葬送のフリーレン",
    searchEpisodeNumberPlaceholder: "例: 第1話",
    searchEpisodeTitlePlaceholder: "例: 冒険の終わり",
    searchFreeword: "フリーワード検索",
    searchInputModeToggle: "入力モードを切り替え（詳細入力 / 自由入力）",
    searchPage: "検索ページ",
    searchTab: "検索",
    searchVideoHeading: "コメントをオーバーレイする動画を検索",
    saveSettings: "設定を保存",
    settings: "設定",
    settingsClose: "設定を閉じる",
    settingsFabLabel: "ニコニココメント設定を開く",
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
    color: "Color",
    commentColor: "Comment color",
    commentOpacity: "Opacity",
    commentSettings: "Comment settings",
    commentSettingsPanel: "Comment settings panel",
    commentVisibility: "Show comments",
    commentVisibilityToggle: "Toggle comment visibility",
    currentVideoUnset: "No overlay video is set",
    error: "Error",
    animeTitle: "Anime title",
    autoFillSearchForm:
      "Fill the search form with title, episode number, and episode title",
    autoSearch: "Auto search",
    autoSearchDescription:
      "Set comments automatically when the watch page opens",
    autoSearchDisabledManual: "Auto search disabled (manual setup mode)",
    autoSearchEnabled: "Auto search enabled",
    autoSearchInfo: "About auto search",
    fixedPlaybackRate: "Lock speed",
    formInput: "Fill form",
    freeInput: "Free input",
    idLoadFailed: "Failed to load ID information",
    idSaveFailed: "Failed to save ID information",
    info: "Info",
    manualSearchLoadFailed: "Failed to load search settings",
    manualSearchSaveFailed: "Failed to save search settings",
    manualSearchPlaceholder: "Enter a search keyword",
    ngRegex: "NG regular expressions",
    ngRegexPlaceholder: "Enter one NG regular expression per line",
    ngTab: "NG",
    ngWords: "NG words",
    ngWordsPlaceholder: "Enter one NG word per line",
    noMessage: "No message",
    playbackRate: "Playback speed",
    playbackRateFixedToggle: "Playback speed lock on/off",
    postedAt: "Posted at",
    commentsSet: 'Set comments from "{title}"',
    autoSetupComplete: "Niconico video was set automatically",
    autoSetupError: "Auto setup error: {message}",
    commentsHiddenSkip: "Skipped because comments are hidden in settings",
    commentsLoadComplete: "Finished loading comments ({count})",
    commentsLoadErrorSelectAnother:
      "Comment loading error: {message}\nSelect another video from the floating button.",
    commentsUnavailable: "Could not fetch comments",
    commentSourceUpdated: "Updated comment source: {title} ({count})",
    commentFetchError: "Comment fetch error: {message}",
    domUpdateWaitFailed: "Failed to wait for DOM update: {message}",
    episodeChangeDetected: "Detected episode change...",
    episodeNumberMissing: "Could not get the episode number",
    episodeSwitchError: "Episode switch error: {message}",
    initializationError: "Initialization error: {message}",
    initializingCommentLoader: "Initializing comment loader...",
    manualModeSelectAnimeTitle:
      "Manual mode is enabled. Open the Search tab from the floating button and set an anime title.",
    manualModeSelectVideo:
      "Manual mode is enabled. Open the Search tab from the floating button and select a video.",
    manualModeCommentsLoadComplete:
      "[Manual mode] Finished loading comments ({count})\nVideo: {title}",
    metadataAutoFetchFailed:
      "Automatic fetch from the watch page failed. Metadata could not be acquired.",
    niconicoNotFound: "No Niconico video was found",
    niconicoNotFoundManual:
      "No Niconico video was found. Search manually.",
    nextEpisodeAutoSetupComplete: "Set up the next episode automatically",
    nextVideoCommentsUnavailableClear:
      "Could not fetch comments for the next video. Clearing comment display.",
    noAnimeTitle:
      "Could not get the anime title. Search accuracy may be reduced.",
    officialVideoMissingUseFirst:
      "No official video was found. Using the first search result.",
    officialVideoMissingManual:
      "No official video was found. Search manually.",
    officialVideoSafeguardInfo: "About the official video safeguard",
    unknownTitle: "Unknown title",
    structuredInput: "Detailed input",
    thumbnail: "Thumbnail",
    videoDataMissing: "Video data was not found.",
    videoId: "Video ID",
    videoOwner: "Uploader",
    videoSwitchDetected: "Detected video switch...",
    videoSwitchError: "Video switch error: {message}",
    episodeNumber: "Episode number",
    episodeTitleOptional: "Episode title (optional)",
    commentCount: "Comments",
    commentCountLong: "Comment count",
    mylistCount: "Mylist",
    mylistCountLong: "Mylist count",
    officialVideoMissing:
      "No official video was found. Showing all search results.",
    searchingKeyword: 'Searching for "{keyword}"...',
    searchKeywordRequired: "Enter a search keyword",
    searchNoResults: "No search results were found",
    searchFormFilled: 'Filled the search form with "{keyword}"',
    similarity: "Similarity: {score}%",
    viewCount: "Views",
    viewCountLong: "View count",
    search: "Search",
    searchAnimePlaceholder: "Example: Frieren: Beyond Journey's End",
    searchEpisodeNumberPlaceholder: "Example: Episode 1",
    searchEpisodeTitlePlaceholder: "Example: The Journey's End",
    searchFreeword: "Free-word search",
    searchInputModeToggle: "Switch input mode (detailed / free input)",
    searchPage: "Search page",
    searchTab: "Search",
    searchVideoHeading: "Search for the video to overlay comments from",
    saveSettings: "Save settings",
    settings: "Settings",
    settingsClose: "Close settings",
    settingsFabLabel: "Open Niconico comment settings",
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

export const format = i18n.format;
export const t = i18n.t;
