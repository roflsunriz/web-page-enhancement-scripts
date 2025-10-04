import {
  REDIRECT_SESSION_KEY,
  MAX_REDIRECTS,
} from "./constants";
import {
  parseTwitterImageUrl,
  isAlreadyFullsize,
  buildFullsizeUrl,
} from "./url-parser";

/**
 * リダイレクトループを防止しつつ、必要であればフルサイズ画像URLへのリダイレクトを実行します。
 * @param currentUrl - 現在のページのURL
 */
export function handleRedirect(currentUrl: string): void {
  const parsedUrl = parseTwitterImageUrl(currentUrl);

  // Twitterの画像URLでなければカウンターをリセットして終了
  if (!parsedUrl) {
    sessionStorage.removeItem(REDIRECT_SESSION_KEY);
    return;
  }

  // リダイレクト回数チェック
  const redirectCount = parseInt(
    sessionStorage.getItem(REDIRECT_SESSION_KEY) || "0",
  );
  if (redirectCount >= MAX_REDIRECTS) {
    console.log("Maximum redirect count reached, stopping redirect.");
    sessionStorage.removeItem(REDIRECT_SESSION_KEY);
    return;
  }

  // 既にフルサイズの場合はカウンターをリセットして終了
  if (isAlreadyFullsize(currentUrl)) {
    console.log("Already fullsize image URL:", currentUrl);
    sessionStorage.removeItem(REDIRECT_SESSION_KEY);
    return;
  }

  // リダイレクト回数をインクリメント
  sessionStorage.setItem(REDIRECT_SESSION_KEY, (redirectCount + 1).toString());

  // フルサイズURLを構築
  const fullsizeUrl = buildFullsizeUrl(currentUrl, parsedUrl);

  // リダイレクト実行
  console.log("Redirecting from:", currentUrl);
  console.log("Redirecting to:", fullsizeUrl);
  window.location.replace(fullsizeUrl);
}