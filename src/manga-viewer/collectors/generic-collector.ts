import type { LoadingSpinner } from "../ui/loading-spinner";
import { ICollector, CollectionResult } from "./i-collector";
import { win } from "../util";
import { isInvalidImage } from "../invalid-image-database";
import {
  hasUserImageHashExclusions,
  isUserExcludedImageByPixelHash,
} from "@/shared/image-exclusion-settings";
import {
  collectPageImageCandidates,
  collectPageImages,
  getImageElementCandidateUrls,
} from "@/shared/page-image-candidates";
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
    const scanned = await collectPageImages({
      include: ["image", "source"],
      dynamicWaitMs: 3000,
      scroll: {
        enabled: true,
        maxScrolls: 20,
        stepRatio: 0.8,
        delayMs: 400,
        stopAfterNoNewScans: 3,
      },
      onProgress: (progress) => {
        if (progress.phase === "scroll") {
          this.spinner?.updateMessage(
            format("pageScan", {
              current: String(progress.currentScroll ?? 0),
              total: String(progress.totalScrolls ?? 0),
            }),
          );
          return;
        }
        this.spinner?.updateMessage(
          format("imageCollected", { count: String(progress.count) }),
        );
      },
      needsValidation: (candidate) => !this.isSameOrigin(candidate.url),
    });
    scanned.urls.forEach((url) => urlSet.add(url));

    return this.validateUrlsWithMetadata(scanned.items);
  }

  private async collectStaticImages(): Promise<
    { url: string; needsValidation: boolean }[]
  > {
    const urlsWithMetadata: { url: string; needsValidation: boolean }[] = [];
    const urlSet = new Set<string>();

    const collected = await collectPageImages({
      include: ["image", "source"],
      needsValidation: (candidate) => !this.isSameOrigin(candidate.url),
    });
    collected.items.forEach((item) => {
      if (urlSet.has(item.url)) return;
      urlSet.add(item.url);
      urlsWithMetadata.push({
        url: item.url,
        needsValidation: item.needsValidation,
      });
    });
    return urlsWithMetadata;
  }

  private collectVisibleImages(urlSet: Set<string>): number {
    const initialSize = urlSet.size;

    collectPageImageCandidates({ include: ["image", "source"] }).forEach(
      (candidate) => {
        urlSet.add(candidate.url);
      },
    );
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
      const imageUrl = getImageElementCandidateUrls(element)[0] ?? null;
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

  private isNicoMangaPage(): boolean {
    return /nicomanga\.com$/.test(window.location.hostname);
  }

  private async validateUrlsWithMetadata(
    urlsWithMetadata: { url: string; needsValidation: boolean }[],
  ): Promise<CollectionResult> {
    const validUrls: string[] = [];

    const filteredUrlsWithMetadataByUrl = urlsWithMetadata.filter((item) => {
      if (item.needsValidation) {
        return true;
      }
      return !isInvalidImage(item.url, undefined, undefined, {
        pageHost: window.location.hostname,
      });
    });
    const filteredUrlsWithMetadata = await this.filterUserHashExcludedImages(
      filteredUrlsWithMetadataByUrl,
    );

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

  private async filterUserHashExcludedImages(
    urlsWithMetadata: { url: string; needsValidation: boolean }[],
  ): Promise<{ url: string; needsValidation: boolean }[]> {
    if (!hasUserImageHashExclusions("manga-viewer")) {
      return urlsWithMetadata;
    }

    const filtered: { url: string; needsValidation: boolean }[] = [];
    for (const item of urlsWithMetadata) {
      const isExcluded = await isUserExcludedImageByPixelHash(
        "manga-viewer",
        item.url,
        {
          pageHost: window.location.hostname,
        },
      );
      if (!isExcluded) {
        filtered.push(item);
      }
    }
    return filtered;
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
