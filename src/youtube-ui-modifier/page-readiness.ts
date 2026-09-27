/** 表示設定がYouTubeの初期描画・動画切り替えに割り込まないための判定。 */
export function isPageReady(): boolean {
  if (!document.body) {
    return false;
  }

  if (
    window.location.hostname === "m.youtube.com" ||
    window.location.pathname !== "/watch"
  ) {
    return true;
  }

  const videoId = new URLSearchParams(window.location.search).get("v");
  const watchPage = document.querySelector(
    "ytd-watch-flexy:not([hidden]), ytd-watch-grid:not([hidden])",
  );
  const metadata = watchPage?.querySelector("ytd-watch-metadata");

  // SPA遷移では直前の動画のDOMが残る。存在だけでなく遷移先との一致を見る。
  return (
    videoId !== null &&
    watchPage !== null &&
    !watchPage.matches(".loading, .show-skeleton") &&
    metadata?.getAttribute("video-id") === videoId &&
    Boolean(metadata.querySelector("h1")?.textContent?.trim())
  );
}
