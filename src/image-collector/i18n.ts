import { createI18n, type LocaleCode } from "@/shared/i18n";

type ImageCollectorLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "collectComplete"
  | "collectStart"
  | "collectUnexpectedError"
  | "classifiedImages"
  | "download"
  | "externalImagesValidating"
  | "failedImagesInZip"
  | "fullscreenOriginal"
  | "imageLoadFailed"
  | "imageReady"
  | "loadImage"
  | "menuLaunch"
  | "noDownloadableImages"
  | "noImagesFound"
  | "noImagesForZip"
  | "progress"
  | "reliableImagesProcessing"
  | "retry"
  | "size"
  | "testModeOneImage"
  | "zipDownloadStarted"
  | "zipEmpty"
  | "zipGenerateFailed"
  | "zipGenerating"
  | "zipLibraryUnavailable"
  | "zipManyImagesSplit"
  | "zipNoPrepared"
  | "zipPartStarted"
  | "zipPrepareComplete"
  | "zipPrepareFailed"
  | "zipPrepareStart"
  | "zipProcessing"
  | "zipReadyCount"
  | "zipSplitStarted"
  | "zipTestMode";

const translations = {
  ja: {
    collectComplete:
      "{total}枚の画像を収集しました！(高速:{fast}, 通常:{normal})",
    collectStart: "画像収集を開始します...",
    collectUnexpectedError: "画像収集中に予期しないエラーが発生しました",
    classifiedImages: "画像を分類しました: 高速={fast}, 通常={normal}",
    download: "ダウンロード",
    externalImagesValidating: "外部画像を検証中...",
    failedImagesInZip: "{count}枚の画像をZIPに含められませんでした",
    fullscreenOriginal: "元ページを開く",
    imageLoadFailed: "画像の読み込みに失敗しました",
    imageReady: "{processed}/{total} 画像が準備されました",
    loadImage: "画像を読み込む",
    menuLaunch: "🚀起動",
    noDownloadableImages: "ダウンロードできる画像がありません",
    noImagesFound: "処理対象の画像が見つかりませんでした",
    noImagesForZip: "ZIPに追加できる画像がありませんでした",
    progress: "進捗: {percent}%",
    reliableImagesProcessing: "信頼できる画像を高速処理中...",
    retry: "再試行",
    size: "サイズ: {width}x{height} ({size})",
    testModeOneImage: "テストモード: 1枚だけZIPに追加します",
    zipDownloadStarted: "ZIPファイルのダウンロードが開始されました",
    zipEmpty: "ZIPファイルに画像が含まれていません",
    zipGenerateFailed: "ZIPファイルの生成に失敗しました",
    zipGenerating: "ZIPファイルを生成しています...",
    zipLibraryUnavailable:
      "ZIPライブラリが読み込まれていないため、ダウンロードできません",
    zipManyImagesSplit: "画像が多いため、{count}個のZIPファイルに分割します",
    zipNoPrepared: "ZIPファイルが準備されていません。再度準備します...",
    zipPartStarted:
      "パート{part}/{total}のダウンロードが開始されました。次のパートを準備中...",
    zipPrepareComplete:
      "ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",
    zipPrepareFailed: "ZIPファイルの準備に失敗しました",
    zipPrepareStart: "ZIPファイルの準備を開始します...",
    zipProcessing: "現在処理中です。しばらくお待ちください...",
    zipReadyCount: "{processed}/{total} 画像が準備されました",
    zipSplitStarted: "全{count}個のZIPファイルのダウンロードを開始しました",
    zipTestMode: "テストモード: 単一画像のみでZIPを生成します",
  },
  en: {
    collectComplete:
      "Collected {total} image(s)! (fast: {fast}, normal: {normal})",
    collectStart: "Starting image collection...",
    collectUnexpectedError: "An unexpected error occurred while collecting images",
    classifiedImages: "Classified images: fast={fast}, normal={normal}",
    download: "Download",
    externalImagesValidating: "Validating external images...",
    failedImagesInZip: "{count} image(s) could not be included in the ZIP",
    fullscreenOriginal: "Open source page",
    imageLoadFailed: "Failed to load the image",
    imageReady: "{processed}/{total} image(s) are ready",
    loadImage: "Load image",
    menuLaunch: "🚀 Launch",
    noDownloadableImages: "There are no downloadable images",
    noImagesFound: "No target images were found",
    noImagesForZip: "No images could be added to the ZIP",
    progress: "Progress: {percent}%",
    reliableImagesProcessing: "Fast-processing trusted images...",
    retry: "Retry",
    size: "Size: {width}x{height} ({size})",
    testModeOneImage: "Test mode: adding only one image to the ZIP",
    zipDownloadStarted: "ZIP download has started",
    zipEmpty: "The ZIP file contains no images",
    zipGenerateFailed: "Failed to generate the ZIP file",
    zipGenerating: "Generating ZIP file...",
    zipLibraryUnavailable:
      "The ZIP library is not loaded, so the download cannot continue",
    zipManyImagesSplit: "Too many images; splitting into {count} ZIP files",
    zipNoPrepared: "The ZIP file is not prepared. Preparing it again...",
    zipPartStarted:
      "Part {part}/{total} download has started. Preparing the next part...",
    zipPrepareComplete:
      "ZIP preparation is complete. Click the button to download.",
    zipPrepareFailed: "Failed to prepare the ZIP file",
    zipPrepareStart: "Starting ZIP preparation...",
    zipProcessing: "Processing now. Please wait...",
    zipReadyCount: "{processed}/{total} image(s) are ready",
    zipSplitStarted: "Started downloading all {count} ZIP files",
    zipTestMode: "Test mode: generating a ZIP with only one image",
  },
} satisfies Record<ImageCollectorLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, ImageCollectorLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
