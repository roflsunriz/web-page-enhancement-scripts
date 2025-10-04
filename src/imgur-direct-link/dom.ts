export type MediaEntry = {
  url: string;
  wrapper: HTMLElement;
};

/**
 * スクリプトの対象ページ（アップロード後の結果ページ）かどうかを判定します。
 */
export function isTargetPage(): boolean {
  return document.querySelector('.UploadPost') !== null;
}

/**
 * ページ上のすべてのメディア（画像・動画）のURLとラッパー要素を取得します。
 */
export function getMediaEntries(): MediaEntry[] {
  const mediaWrappers = document.querySelectorAll<HTMLElement>('.PostContent-imageWrapper');
  const entries: MediaEntry[] = [];

  mediaWrappers.forEach((wrapper) => {
    const imgElement = wrapper.querySelector('img');
    const videoElement = wrapper.querySelector('video source');

    const url =
      (imgElement && imgElement instanceof HTMLImageElement ? imgElement.src : undefined) ??
      (videoElement && videoElement instanceof HTMLSourceElement ? videoElement.src : undefined);

    if (url) {
      entries.push({ url, wrapper });
    }
  });

  return entries;
}

/**
 * ページに追加されたすべてのコピーボタンを削除します。
 */
export function clearButtons(): void {
  document.querySelectorAll('[id^="imgurCopyButton-container"]').forEach((container) => container.remove());
}