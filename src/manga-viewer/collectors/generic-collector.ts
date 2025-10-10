import type { LoadingSpinner } from '../ui/loading-spinner';
import { ICollector, CollectionResult } from './i-collector';
import { win } from '../util';
import { isInvalidImage } from '../invalid-image-database';

// unsafeWindowの型定義を拡張
declare global {
  interface Window {
    MangaViewer?: { updateProgress?: (percent: number, message: string, phase: string) => void };
  }
}

/**
 * 一般的なウェブサイトから画像を収集するためのコレクター。
 */
export class GenericCollector implements ICollector {
  private spinner: LoadingSpinner | null = null;

  private safeUpdateProgress(percent: number, message: string, phase: string | null = null): void {
    type LocalMangaViewer = {
      updateProgress?: (p: number, m: string, ph?: string | null) => void;
      _progressBuffer?: Array<[number, string, string | null]>;
    };
    try {
      const holder = win as unknown as { MangaViewer?: LocalMangaViewer };
      if (!holder.MangaViewer) {
        holder.MangaViewer = {} as LocalMangaViewer;
      }
      const mv = holder.MangaViewer;
      if (typeof mv.updateProgress === 'function') {
        mv.updateProgress(percent, message, phase);
      } else {
        mv._progressBuffer = mv._progressBuffer || [];
        mv._progressBuffer.push([percent, message, phase]);
      }
    } catch (err) {
      console.error('[GenericCollector] safeUpdateProgress error', err);
    }
  }

  public setSpinner(spinner: LoadingSpinner | null): void {
    this.spinner = spinner;
  }

  public async collect(): Promise<CollectionResult> {
    try {
      console.debug('[GenericCollector] collect start');
    } catch (err) {
      console.debug('[GenericCollector] collect debug error:', err);
    }
    this.spinner?.updateMessage('ページ上の画像を収集しています...');

    // 1. 初期表示されている画像を収集
    const urlSet = new Set<string>();
    this.collectVisibleImages(urlSet);

    // 2. 動的に読み込まれる画像を待機・収集
    this.spinner?.updateMessage('動的に読み込まれる画像を待機中...');
    await this.waitForDynamicImages(urlSet, 3000); // 3秒間監視

    // 3. ページをスクロールしてさらに画像を収集
    await this.scrollPageToCollectImages(urlSet);

    const collectedUrls = Array.from(urlSet).map(url => ({ url, needsValidation: !this.isSameOrigin(url) }));
    return this.validateUrlsWithMetadata(collectedUrls);
  }

  private async collectStaticImages(): Promise<{ url: string; needsValidation: boolean }[]> {
    const images = document.querySelectorAll('img, picture source');
    const urlsWithMetadata: { url: string; needsValidation: boolean }[] = [];
    const urlSet = new Set<string>();

    images.forEach((element) => {
      let imageUrl: string | null = null;
      if (element.tagName === 'IMG') {
        const imgElement = element as HTMLImageElement;
        imageUrl = imgElement.src;
        if (!imageUrl) imageUrl = imgElement.dataset.src ?? null;
        // srcsetもチェックする
        if (!imageUrl && imgElement.srcset) {
          imageUrl = imgElement.srcset.split(',')[0].trim().split(' ')[0];
        }
      } else if (element.tagName === 'SOURCE') {
        const srcset = (element as HTMLSourceElement).srcset;
        if (srcset) {
          // srcsetから最初のURLを抽出する（例: "image.jpg 1x, image-2x.jpg 2x" -> "image.jpg"）
          imageUrl = srcset.split(',')[0].trim().split(' ')[0];
        } else {
          imageUrl = null;
        }
      }

      if (imageUrl && imageUrl.startsWith('http') && !urlSet.has(imageUrl)) {
        urlSet.add(imageUrl);
        urlsWithMetadata.push({
          url: imageUrl,
          needsValidation: !this.isSameOrigin(imageUrl),
        });
      }
    });
    return urlsWithMetadata;
  }

  private collectVisibleImages(urlSet: Set<string>): number {
    const initialSize = urlSet.size;
    const images = document.querySelectorAll('img, picture source');

    images.forEach((element) => {
      let imageUrl: string | null = null;
      if (element.tagName === 'IMG') {
        const imgElement = element as HTMLImageElement;
        imageUrl = imgElement.src;
        if (!imageUrl || imageUrl.startsWith('data:')) imageUrl = imgElement.dataset.src ?? null;
        if (!imageUrl && imgElement.srcset) {
          imageUrl = imgElement.srcset.split(',')[0].trim().split(' ')[0];
        }
      } else if (element.tagName === 'SOURCE') {
        const srcset = (element as HTMLSourceElement).srcset;
        if (srcset) {
          imageUrl = srcset.split(',')[0].trim().split(' ')[0];
        }
      }

      if (imageUrl && imageUrl.startsWith('http') && !urlSet.has(imageUrl)) {
        urlSet.add(imageUrl);
      }
    });
    return urlSet.size - initialSize;
  }

  private waitForDynamicImages(urlSet: Set<string>, timeout: number): Promise<void> {
    return new Promise((resolve) => {
      let imageCount = urlSet.size;
      const observer = new MutationObserver(() => {
        const newImages = this.collectVisibleImages(urlSet);
        if (newImages > 0) {
          imageCount = urlSet.size;
          this.spinner?.updateMessage(`${imageCount}枚の画像を収集しました...`);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });

      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, timeout);
    });
  }

  private async scrollPageToCollectImages(urlSet: Set<string>): Promise<void> {
    const originalScrollY = window.scrollY;
    const maxScrolls = 20;
    const scrollStep = window.innerHeight * 0.8;
    let noNewImagesCount = 0;

    for (let i = 0; i < maxScrolls; i++) {
      const lastSize = urlSet.size;
      window.scrollBy(0, scrollStep);
      this.spinner?.updateMessage(`ページをスキャン中... (${i + 1}/${maxScrolls})`);
      await new Promise(resolve => setTimeout(resolve, 400));
      this.collectVisibleImages(urlSet);

      if (urlSet.size === lastSize) {
        noNewImagesCount++;
      } else {
        noNewImagesCount = 0;
      }

      if (noNewImagesCount >= 3 || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        break;
      }
    }

    this.collectVisibleImages(urlSet); // 最終確認
    window.scrollTo(0, originalScrollY); // 元の位置に戻す
  }

  private async validateUrlsWithMetadata(
    urlsWithMetadata: { url: string; needsValidation: boolean }[],
  ): Promise<CollectionResult> {
    try {
      console.debug('[GenericCollector] validateUrlsWithMetadata start', { total: urlsWithMetadata.length });
    } catch (err) {
      console.debug('[GenericCollector] validateUrlsWithMetadata debug error:', err);
    }
    const validUrls: string[] = [];
    const minInitialUrls = 2;

    const filteredUrlsWithMetadata = urlsWithMetadata.filter((item) => {
      if (item.needsValidation) {
        return true;
      }
      return !isInvalidImage(item.url);
    });

    // 検証不要なURLを先に抽出
    const preValidatedUrls = filteredUrlsWithMetadata
      .filter((item) => !item.needsValidation)
      .map((item) => item.url);
    validUrls.push(...preValidatedUrls);

    const initialUrls = validUrls.slice(0, minInitialUrls);

    this.spinner?.updateMessage(
      `${preValidatedUrls.length}枚を即時追加。残り${
        filteredUrlsWithMetadata.length - preValidatedUrls.length
      }枚を検証中...`,
    );

    const result: CollectionResult = {
      initialUrls,
      onValidated: (callback) => {
        // バックグラウンドで検証処理
        (async () => {
          try {
            const validationNeeded = filteredUrlsWithMetadata.filter((item) => item.needsValidation);
            console.debug('[GenericCollector] validationNeeded count', { validationNeeded: validationNeeded.length });
            let validatedCount = 0;

            for (const item of validationNeeded) {
              const isValid = await this.isImageAccessible(item.url);
              if (isValid) {
                validUrls.push(item.url);
              }
              validatedCount++;
              if (typeof win.MangaViewer?.updateProgress === 'function') {
                const percent = Math.round((validatedCount / validationNeeded.length) * 100);
                try {
                  console.debug('[GenericCollector] updateProgress ->', { percent, total: validationNeeded.length });
                } catch (err) {
                  console.debug('[GenericCollector] updateProgress debug error:', err);
                }
                this.safeUpdateProgress(percent, `画像検証中... /${validationNeeded.length}`, 'loading');
              }
            }

            try {
              console.debug('[GenericCollector] about to call final updateProgress', { validCount: validUrls.length });
              this.safeUpdateProgress(100, `検証完了: ${validUrls.length}枚の有効な画像`, 'complete');
            } catch (err) {
              console.error('[GenericCollector] error calling final updateProgress', err);
            }
            callback(validUrls);
          } catch (err) {
            console.error('[GenericCollector] validation error', err);
            // エラー時は完了を通知してコールバックする
            if (typeof win.MangaViewer?.updateProgress === 'function') {
              win.MangaViewer.updateProgress(100, '検証中にエラーが発生しました', 'complete');
            }
            callback(validUrls);
          }
        })();
      },
    };

    return result;
  }

  private isSameOrigin(url: string): boolean {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private isImageAccessible(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (isInvalidImage(url, img.naturalWidth, img.naturalHeight)) {
          resolve(false);
          return;
        }
        resolve(img.naturalWidth > 100 && img.naturalHeight > 100);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}
