import type { LoadingSpinner } from '../ui/loading-spinner';
import { ICollector, CollectionResult } from './i-collector';
import { win } from '../util';
import { TWITTER_IMAGE_SOURCE_SELECTOR } from '@/shared/constants/twitter';

/**
 * Twitter/Xから画像を収集するためのコレクター。
 */
export class TwitterCollector implements ICollector {
  private spinner: LoadingSpinner | null = null;

  public setSpinner(spinner: LoadingSpinner | null): void {
    this.spinner = spinner;
  }

  public async collect(): Promise<CollectionResult> {
    const orderedUrls = await this.scrollPageToCollectImages();
    this.spinner?.updateMessage(
      `${orderedUrls.length}枚のツイート画像を見つけました。検証中...`,
    );
    return this.validateTwitterUrls(orderedUrls);
  }

  private processTwitterImageUrl(imageUrl: string): string {
    try {
      const url = new URL(imageUrl);
      url.searchParams.set('name', 'orig');
      return url.toString();
    } catch {
      return imageUrl;
    }
  }

  private collectVisibleImages(collectedUrls: Set<string>): void {
    document.querySelectorAll(TWITTER_IMAGE_SOURCE_SELECTOR).forEach((img) => {
      const imageUrl = this.processTwitterImageUrl((img as HTMLImageElement).src);
      if (imageUrl && imageUrl.startsWith('http')) {
        collectedUrls.add(imageUrl);
      }
    });
  }

  private async scrollPageToCollectImages(): Promise<string[]> {
    const originalScrollY = window.scrollY;
    const collectedUrls = new Set<string>();
    const maxScrollAttempts = 25;
    const scrollPauseTime = 300;
    const scrollStepSize = 800;
    let lastImageCount = 0;

    this.spinner?.updateMessage('画像を探すためにページをスクロール中...');

    for (let i = 0; i < maxScrollAttempts; i++) {
      this.collectVisibleImages(collectedUrls);
      const currentImageCount = collectedUrls.size;

      if (i > 3 && currentImageCount === lastImageCount) {
        // 3回連続で新しい画像が見つからなければ終了
        break;
      }
      lastImageCount = currentImageCount;

      window.scrollBy(0, scrollStepSize);
      this.spinner?.updateMessage(
        `スクロール中... (${i + 1}/) - ${
          collectedUrls.size
        }枚発見`,
      );
      await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        // ページ末尾に到達
        break;
      }
    }

    // 最終確認
    this.collectVisibleImages(collectedUrls);
    window.scrollTo(0, originalScrollY);
    return Array.from(collectedUrls);
  }

  private async validateTwitterUrls(urls: string[]): Promise<CollectionResult> {
    const validUrls = [...new Set(urls)]; // 重複を削除
    const minInitialUrls = 2;
    const initialUrls = validUrls.slice(0, minInitialUrls);

    this.spinner?.updateMessage(
      `${initialUrls.length}枚の画像を即時表示します。残り${Math.max(
        0,
        validUrls.length - initialUrls.length,
      )}枚も準備完了。`,
    );

    return {
      initialUrls,
      onValidated: (callback) => {
        // Twitterの画像は検証不要なので、即座に全URLを返す
        setTimeout(() => {
          callback(validUrls);
          if (typeof win.MangaViewer?.updateProgress === 'function') {
            win.MangaViewer.updateProgress(
              100,
              `処理完了: ${validUrls.length}枚の画像を処理しました`,
              'complete',
            );
          }
        }, 500);
      },
    };
  }
}
