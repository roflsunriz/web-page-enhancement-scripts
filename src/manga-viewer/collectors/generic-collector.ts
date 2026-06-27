import type { LoadingSpinner } from "../ui/loading-spinner";
import { ICollector, CollectionResult } from "./i-collector";
import { win } from "../util";
import { isInvalidImage } from "../invalid-image-database";
import { format, t } from "../i18n";

// unsafeWindowの型定義を拡張
declare global {
  interface Window {
    MangaViewer?: {
      updateProgress?: (
        percent: number,
        message: string,
        phase: string,
      ) => void;
    };
  }
}

/**
 * 一般的なウェブサイトから画像を収集するためのコレクター。
 */
export class GenericCollector implements ICollector {
  private spinner: LoadingSpinner | null = null;

  private safeUpdateProgress(
    percent: number,
    message: string,
    phase: string | null = null,
  ): void {
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
      if (typeof mv.updateProgress === "function") {
        mv.updateProgress(percent, message, phase);
      } else {
        mv._progressBuffer = mv._progressBuffer || [];
        mv._progressBuffer.push([percent, message, phase]);
      }
    } catch (err) {
      console.error("[GenericCollector] safeUpdateProgress error", err);
    }
  }

  public setSpinner(spinner: LoadingSpinner | null): void {
    this.spinner = spinner;
  }

  public async collect(): Promise<CollectionResult> {
    this.spinner?.updateMessage(t("imageCollecting"));

    // 1. 初期表示されている画像を収集
    const urlSet = new Set<string>();
    this.collectVisibleImages(urlSet);

    if (this.canUseFastLoadedImages(urlSet)) {
      this.spinner?.updateMessage(
        format("fastLoadedImages", { count: String(urlSet.size) }),
      );
      return this.validateUrlsWithMetadata(this.toUrlsWithMetadata(urlSet));
    }

    // 2. 動的に読み込まれる画像を待機・収集
    this.spinner?.updateMessage(t("nextDynamicImages"));
    await this.waitForDynamicImages(urlSet, 3000); // 3秒間監視

    // 3. ページをスクロールしてさらに画像を収集
    await this.scrollPageToCollectImages(urlSet);

    return this.validateUrlsWithMetadata(this.toUrlsWithMetadata(urlSet));
  }

  private async collectStaticImages(): Promise<
    { url: string; needsValidation: boolean }[]
  > {
    const images = document.querySelectorAll("img, picture source");
    const urlsWithMetadata: { url: string; needsValidation: boolean }[] = [];
    const urlSet = new Set<string>();

    images.forEach((element) => {
      const imageUrl = this.getImageUrlFromElement(element);

      if (imageUrl && !urlSet.has(imageUrl)) {
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
    const images = document.querySelectorAll("img, picture source");

    images.forEach((element) => {
      const imageUrl = this.getImageUrlFromElement(element);

      if (imageUrl && !urlSet.has(imageUrl)) {
        urlSet.add(imageUrl);
      }
    });
    return urlSet.size - initialSize;
  }

  private toUrlsWithMetadata(
    urlSet: Set<string>,
  ): { url: string; needsValidation: boolean }[] {
    return Array.from(urlSet).map((url) => ({
      url,
      needsValidation: !this.isSameOrigin(url),
    }));
  }

  private canUseFastLoadedImages(urlSet: Set<string>): boolean {
    if (!this.isNicoMangaPage() || urlSet.size < 2) {
      return false;
    }

    let loadedImageCount = 0;
    document.querySelectorAll("img").forEach((element) => {
      const imageUrl = this.getImageUrl(element);
      if (
        imageUrl &&
        urlSet.has(imageUrl) &&
        element.complete &&
        element.naturalWidth > 100 &&
        element.naturalHeight > 100 &&
        !isInvalidImage(imageUrl, element.naturalWidth, element.naturalHeight, {
          pageHost: window.location.hostname,
        })
      ) {
        loadedImageCount++;
      }
    });

    return loadedImageCount >= 2;
  }

  private getImageUrlFromElement(element: Element): string | null {
    if (element.tagName === "SOURCE") {
      return this.normalizeImageUrl(
        this.getFirstSrcsetUrl((element as HTMLSourceElement).srcset),
      );
    }

    if (element.tagName !== "IMG") {
      return null;
    }

    const imgElement = element as HTMLImageElement;
    const candidates = [
      imgElement.currentSrc,
      imgElement.getAttribute("src"),
      imgElement.dataset.src,
      this.getFirstSrcsetUrl(imgElement.srcset),
    ];

    for (const candidate of candidates) {
      const normalizedUrl = this.normalizeImageUrl(candidate);
      if (normalizedUrl) {
        return normalizedUrl;
      }
    }

    return null;
  }

  private getImageUrl(imgElement: HTMLImageElement): string | null {
    return this.getImageUrlFromElement(imgElement);
  }

  private getFirstSrcsetUrl(srcset: string): string | null {
    return srcset.split(",")[0]?.trim().split(" ")[0] ?? null;
  }

  private normalizeImageUrl(rawUrl: string | null | undefined): string | null {
    if (!rawUrl) {
      return null;
    }

    const trimmedUrl = rawUrl.trim();
    if (
      !trimmedUrl ||
      trimmedUrl.startsWith("data:") ||
      trimmedUrl.startsWith("blob:")
    ) {
      return null;
    }

    try {
      const url = new URL(trimmedUrl, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return null;
      }
      if (this.isLikelyDocumentUrl(url)) {
        return null;
      }
      return url.href;
    } catch {
      return null;
    }
  }

  private isLikelyDocumentUrl(url: URL): boolean {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = "";

    const candidateUrl = new URL(url.href);
    candidateUrl.hash = "";
    if (candidateUrl.href === currentUrl.href) {
      return true;
    }

    return /\.(?:html?|php|aspx?|jsp)$/i.test(candidateUrl.pathname);
  }

  private isNicoMangaPage(): boolean {
    return /nicomanga\.com$/.test(window.location.hostname);
  }

  private waitForDynamicImages(
    urlSet: Set<string>,
    timeout: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      let imageCount = urlSet.size;
      const observer = new MutationObserver(() => {
        const newImages = this.collectVisibleImages(urlSet);
        if (newImages > 0) {
          imageCount = urlSet.size;
          this.spinner?.updateMessage(
            format("imageCollected", { count: String(imageCount) }),
          );
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "srcset"],
      });

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
      this.spinner?.updateMessage(
        format("pageScan", {
          current: String(i + 1),
          total: String(maxScrolls),
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.collectVisibleImages(urlSet);

      if (urlSet.size === lastSize) {
        noNewImagesCount++;
      } else {
        noNewImagesCount = 0;
      }

      if (
        noNewImagesCount >= 3 ||
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        break;
      }
    }

    this.collectVisibleImages(urlSet); // 最終確認
    window.scrollTo(0, originalScrollY); // 元の位置に戻す
  }

  private async validateUrlsWithMetadata(
    urlsWithMetadata: { url: string; needsValidation: boolean }[],
  ): Promise<CollectionResult> {
    const validUrls: string[] = [];

    const filteredUrlsWithMetadata = urlsWithMetadata.filter((item) => {
      if (item.needsValidation) {
        return true;
      }
      return !isInvalidImage(item.url, undefined, undefined, {
        pageHost: window.location.hostname,
      });
    });

    // 検証不要なURLを先に抽出
    const preValidatedUrls = filteredUrlsWithMetadata
      .filter((item) => !item.needsValidation)
      .map((item) => item.url);
    validUrls.push(...preValidatedUrls);

    const initialUrls = [...validUrls];

    this.spinner?.updateMessage(
      format("initialImagesReady", {
        count: String(preValidatedUrls.length),
        remaining: String(
          filteredUrlsWithMetadata.length - preValidatedUrls.length,
        ),
      }),
    );

    const result: CollectionResult = {
      initialUrls,
      onValidated: (callback) => {
        // バックグラウンドで検証処理
        (async () => {
          try {
            const validationNeeded = filteredUrlsWithMetadata.filter(
              (item) => item.needsValidation,
            );
            let validatedCount = 0;

            if (validationNeeded.length === 0) {
              this.safeUpdateProgress(
                100,
                format("readyImages", { count: String(validUrls.length) }),
                "complete",
              );
              callback([...validUrls]);
              return;
            }

            for (const item of validationNeeded) {
              const isValid = await this.isImageAccessible(item.url);
              if (isValid) {
                validUrls.push(item.url);
                callback([...validUrls]);
              }
              validatedCount++;
              if (typeof win.MangaViewer?.updateProgress === "function") {
                const percent = Math.round(
                  (validatedCount / validationNeeded.length) * 100,
                );
                this.safeUpdateProgress(
                  percent,
                  format("validatingImages", {
                    current: String(validatedCount),
                    total: String(validationNeeded.length),
                  }),
                  "loading",
                );
              }
            }

            this.safeUpdateProgress(
              100,
              format("validationComplete", {
                count: String(validUrls.length),
              }),
              "complete",
            );
            callback([...validUrls]);
          } catch (err) {
            console.error("[GenericCollector] validation error", err);
            // エラー時は完了を通知してコールバックする
            if (typeof win.MangaViewer?.updateProgress === "function") {
              win.MangaViewer.updateProgress(
                100,
                t("validationError"),
                "complete",
              );
            }
            callback([...validUrls]);
          }
        })();
      },
    };

    return result;
  }

  private isSameOrigin(url: string): boolean {
    try {
      return (
        new URL(url, window.location.href).origin === window.location.origin
      );
    } catch {
      return false;
    }
  }

  private isImageAccessible(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (
          isInvalidImage(url, img.naturalWidth, img.naturalHeight, {
            pageHost: window.location.hostname,
          })
        ) {
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
