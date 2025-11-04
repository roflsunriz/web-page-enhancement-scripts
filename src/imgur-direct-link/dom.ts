import { IMGUR_SELECTORS } from '@/shared/constants/imgur';

export type MediaEntry = {
  url: string;
  wrapper: HTMLElement;
};

// i.imgur.com のダイレクトリンクのみ許可
const DIRECT_IMGUR_RE =
  /^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|gifv|mp4|webm|webp|avif)$/i;

/**
 * ページ上のすべてのメディア（画像・動画）のURLとラッパー要素を取得します。
 */
export function getMediaEntries(): MediaEntry[] {
  const mediaWrappers = document.querySelectorAll<HTMLElement>(IMGUR_SELECTORS.mediaWrapper);
  const entries: MediaEntry[] = [];

  mediaWrappers.forEach((wrapper) => {
    const imgElement = wrapper.querySelector('img');
    const videoElement = wrapper.querySelector('video source');
    let url =
      (imgElement && imgElement instanceof HTMLImageElement ? imgElement.src : undefined) ??
      (videoElement && videoElement instanceof HTMLSourceElement ? videoElement.src : undefined);

    // 直接リンク以外を取得しない
    if (url && DIRECT_IMGUR_RE.test(url)) {
      if (url.endsWith('.gifv')) {
        url = url.replace(/\.gifv$/, '.mp4');
      }
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
