import { createI18n, type LocaleCode } from "@/shared/i18n";

type MangaViewerLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "autoChapterNavigation"
  | "chapterNext"
  | "chapterPrevious"
  | "clickNextChapter"
  | "close"
  | "collectionSystemStart"
  | "controlPanelTitle"
  | "defaultLoadingImages"
  | "endOfContents"
  | "errorOccurred"
  | "fastLoadedImages"
  | "foundTweetImages"
  | "imageCollecting"
  | "imageCollected"
  | "imageSearch"
  | "initialImagesReady"
  | "launch"
  | "launchError"
  | "launchMenu"
  | "lastPage"
  | "loadedImages"
  | "loadedImagesReady"
  | "loadingImages"
  | "loadingImagesWithErrors"
  | "nextDynamicImages"
  | "noImages"
  | "noImagesDescription"
  | "noImagesFound"
  | "pageScan"
  | "preloadComplete"
  | "preloadCompleteWithErrors"
  | "processingComplete"
  | "readyImages"
  | "reanalyze"
  | "reset"
  | "retryCollection"
  | "retryingImages"
  | "retrying"
  | "scrollFound"
  | "scrollSearchImages"
  | "stateOff"
  | "stateOn"
  | "validationComplete"
  | "validationError"
  | "validatingImages"
  | "validImageSearch"
  | "viewerLaunch"
  | "zoom";

const translations = {
  ja: {
    autoChapterNavigation: "チャプター自動移動: {state}",
    chapterNext: "次のチャプター",
    chapterPrevious: "前のチャプター",
    clickNextChapter: "クリックして次のチャプターへ",
    close: "閉じる",
    collectionSystemStart: "画像収集システムを開始中...",
    controlPanelTitle: "マンガビューア",
    defaultLoadingImages: "画像を読み込み中...",
    endOfContents: "End of Contents",
    errorOccurred: "エラーが発生しました。",
    fastLoadedImages: "{count}枚の読み込み済み画像を検出しました。高速起動します...",
    foundTweetImages: "{count}枚のツイート画像を見つけました。検証中...",
    imageCollecting: "ページ上の画像を収集しています...",
    imageCollected: "{count}枚の画像を収集しました...",
    imageSearch: "画像を検索中...",
    initialImagesReady: "{count}枚を即時追加。残り{remaining}枚を検証中...",
    launch: "ビューア起動",
    launchError: "ビューア起動中にエラーが発生しました: {message}",
    launchMenu: "ブック風マンガビューア起動",
    lastPage: "最後のページです",
    loadedImages: "{count}枚の画像を読み込みました。ビューアを準備中...",
    loadedImagesReady: "{count}枚の読み込み済み画像を確認しました。ビューアを起動中...",
    loadingImages: "画像をプリロード中... {loaded}/{total} ({percent}%)",
    loadingImagesWithErrors:
      "画像をプリロード中... {loaded}/{total} ({percent}%) - {errors}枚エラー",
    nextDynamicImages: "動的に読み込まれる画像を待機中...",
    noImages: "画像が見つかりません",
    noImagesDescription:
      "ページの読み込みが完了する前に画像収集が行われた可能性があります。",
    noImagesFound: "画像が見つかりませんでした",
    pageScan: "ページをスキャン中... ({current}/{total})",
    preloadComplete: "{total}枚の画像をプリロード完了。ビューアを起動中...",
    preloadCompleteWithErrors:
      "{total}枚中{loaded}枚の画像をプリロード完了（{errors}枚エラー）。ビューアを起動中...",
    processingComplete: "処理完了: {count}枚の画像を処理しました",
    readyImages: "準備完了: {count}枚の画像",
    reanalyze: "再分析",
    reset: "リセット",
    retryCollection: "画像を再収集する",
    retryingImages: "画像を再収集中...",
    retrying: "再収集中...",
    scrollFound: "スクロール中... ({current}/) - {count}枚発見",
    scrollSearchImages: "画像を探すためにページをスクロール中...",
    stateOff: "OFF",
    stateOn: "ON",
    validationComplete: "検証完了: {count}枚の有効な画像",
    validationError: "検証中にエラーが発生しました",
    validatingImages: "画像検証中... {current}/{total}",
    validImageSearch: "有効な画像を検索中です...",
    viewerLaunch: "マンガビューア起動",
    zoom: "ズーム: {percent}%",
  },
  en: {
    autoChapterNavigation: "Auto chapter navigation: {state}",
    chapterNext: "Next chapter",
    chapterPrevious: "Previous chapter",
    clickNextChapter: "Click to go to the next chapter",
    close: "Close",
    collectionSystemStart: "Starting the image collection system...",
    controlPanelTitle: "Manga Viewer",
    defaultLoadingImages: "Loading images...",
    endOfContents: "End of Contents",
    errorOccurred: "An error occurred.",
    fastLoadedImages: "Detected {count} already-loaded images. Starting quickly...",
    foundTweetImages: "Found {count} tweet images. Validating...",
    imageCollecting: "Collecting images on the page...",
    imageCollected: "Collected {count} images...",
    imageSearch: "Searching for images...",
    initialImagesReady:
      "Added {count} image(s) immediately. Validating {remaining} remaining...",
    launch: "Launch viewer",
    launchError: "An error occurred while launching the viewer: {message}",
    launchMenu: "Launch Book-Style Manga Viewer",
    lastPage: "This is the last page",
    loadedImages: "Loaded {count} image(s). Preparing the viewer...",
    loadedImagesReady:
      "Confirmed {count} already-loaded image(s). Launching the viewer...",
    loadingImages: "Preloading images... {loaded}/{total} ({percent}%)",
    loadingImagesWithErrors:
      "Preloading images... {loaded}/{total} ({percent}%) - {errors} error(s)",
    nextDynamicImages: "Waiting for dynamically loaded images...",
    noImages: "No images found",
    noImagesDescription:
      "Image collection may have run before the page finished loading.",
    noImagesFound: "No images were found",
    pageScan: "Scanning page... ({current}/{total})",
    preloadComplete: "Preloaded {total} image(s). Launching the viewer...",
    preloadCompleteWithErrors:
      "Preloaded {loaded} of {total} image(s) ({errors} error(s)). Launching the viewer...",
    processingComplete: "Complete: processed {count} image(s)",
    readyImages: "Ready: {count} image(s)",
    reanalyze: "Analyze again",
    reset: "Reset",
    retryCollection: "Collect images again",
    retryingImages: "Collecting images again...",
    retrying: "Collecting again...",
    scrollFound: "Scrolling... ({current}/) - {count} found",
    scrollSearchImages: "Scrolling the page to find images...",
    stateOff: "OFF",
    stateOn: "ON",
    validationComplete: "Validation complete: {count} valid image(s)",
    validationError: "An error occurred during validation",
    validatingImages: "Validating images... {current}/{total}",
    validImageSearch: "Searching for valid images...",
    viewerLaunch: "Launch Manga Viewer",
    zoom: "Zoom: {percent}%",
  },
} satisfies Record<MangaViewerLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, MangaViewerLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
