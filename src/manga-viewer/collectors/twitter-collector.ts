import type { LoadingSpinner } from "../ui/loading-spinner";
import { ICollector, CollectionResult } from "./i-collector";
import { win } from "../util";
import { TWITTER_IMAGE_SOURCE_SELECTOR } from "@/shared/constants/twitter";
import { format, t } from "../i18n";

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
      format("foundTweetImages", { count: String(orderedUrls.length) }),
    );
    return this.validateTwitterUrls(orderedUrls);
  }

  private processTwitterImageUrl(imageUrl: string): string {
    try {
      const url = new URL(imageUrl);
      url.searchParams.set("name", "orig");
      return url.toString();
    } catch {
      return imageUrl;
    }
  }

  private collectVisibleImages(collectedUrls: Set<string>): void {
    document.querySelectorAll(TWITTER_IMAGE_SOURCE_SELECTOR).forEach((img) => {
      const imageUrl = this.processTwitterImageUrl(
        (img as HTMLImageElement).src,
      );
      if (imageUrl && imageUrl.startsWith("http")) {
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

    this.spinner?.updateMessage(t("scrollSearchImages"));

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
        format("scrollFound", {
          count: String(collectedUrls.size),
          current: String(i + 1),
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
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
      format("initialImagesReady", {
        count: String(initialUrls.length),
        remaining: String(Math.max(0, validUrls.length - initialUrls.length)),
      }),
    );

    return {
      initialUrls,
      onValidated: (callback) => {
        // Twitterの画像は検証不要なので、即座に全URLを返す
        setTimeout(() => {
          callback(validUrls);
          if (typeof win.MangaViewer?.updateProgress === "function") {
            win.MangaViewer.updateProgress(
              100,
              format("processingComplete", {
                count: String(validUrls.length),
              }),
              "complete",
            );
          }
        }, 500);
      },
    };
  }
}
