/** Twitter画像URLの正規表現パターン */
export const TWITTER_IMAGE_PATTERN =
  /^https:\/\/(pbs|ton)\.twimg\.com\/media\/([^?&]+)/;

/** フルサイズを示すパラメータ名 */
export const FULL_SIZE_NAMES = ["orig", "4096x4096", "large"];

/** リダイレクトループ防止用のセッションストレージキー */
export const REDIRECT_SESSION_KEY = "twitter_image_redirect_count";

/** 最大リダイレクト回数 */
export const MAX_REDIRECTS = 3;