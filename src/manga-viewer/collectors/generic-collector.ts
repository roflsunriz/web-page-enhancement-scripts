import type { LoadingSpinner } from "../ui/loading-spinner";
import { ICollector, CollectionResult } from "./i-collector";
import { win } from "../util";
import { isInvalidImage } from "../invalid-image-database";
import {
  hasUserImageHashExclusions,
  isUserExcludedImageByPixelHash,
} from "@/shared/image-exclusion-settings";
import {
  collectLoadedPageImages,
  collectPageImages,
  collectPageImagesWithScrollFallback,
  isLoadedPageImageCandidate,
  mergePageImageCollectionItems,
  type PageImageCollectionResult,
  type PageImageCollectionItem,
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

    const fastLoadedImages = this.collectFastLoadedImages();
    if (fastLoadedImages.items.length >= 2) {
      this.spinner?.updateMessage(
        format("fastLoadedImages", {
          count: String(fastLoadedImages.items.length),
        }),
      );
      return this.createFastLoadedResult(fastLoadedImages.items);
    }

    this.spinner?.updateMessage(t("nextDynamicImages"));
    const scanned = await collectPageImagesWithScrollFallback({
      include: ["image", "source"],
      dynamicWaitMs: 500,
      minCandidatesBeforeScroll: 2,
      fallbackDynamicWaitMs: 1500,
      scrollFallback: {
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
    return this.validateUrlsWithMetadata(scanned.items);
  }

  private collectFastLoadedImages(): PageImageCollectionResult {
    if (!this.isNicoMangaPage()) {
      return { items: [], urls: [] };
    }

    return collectLoadedPageImages({
      include: ["image"],
      minWidth: 100,
      minHeight: 100,
      exclude: (candidate) =>
        isInvalidImage(candidate.url, candidate.width, candidate.height, {
          pageHost: window.location.hostname,
        }),
      needsValidation: () => false,
    });
  }

  private createFastLoadedResult(
    fastLoadedImages: PageImageCollectionItem[],
  ): CollectionResult {
    const initialUrls = fastLoadedImages.map((item) => item.url);
    return {
      initialUrls,
      onValidated: (callback) => {
        callback(initialUrls);
        void this.scanAdditionalImages(fastLoadedImages, callback);
      },
    };
  }

  private async scanAdditionalImages(
    initialItems: PageImageCollectionItem[],
    callback: (urls: string[]) => void,
  ): Promise<void> {
    try {
      const scanned = await collectPageImages({
        include: ["image", "source"],
        dynamicWaitMs: 500,
        onProgress: (progress) => {
          this.safeUpdateProgress(
            0,
            format("imageCollected", { count: String(progress.count) }),
            "loading",
          );
        },
        exclude: (candidate) =>
          isInvalidImage(candidate.url, candidate.width, candidate.height, {
            pageHost: window.location.hostname,
          }),
        needsValidation: (candidate) =>
          !isLoadedPageImageCandidate(candidate, {
            minWidth: 100,
            minHeight: 100,
            exclude: (candidate) =>
              isInvalidImage(candidate.url, candidate.width, candidate.height, {
                pageHost: window.location.hostname,
              }),
          }),
      });

      const mergedItems = mergePageImageCollectionItems(
        initialItems,
        scanned.items,
      );
      const result = await this.validateUrlsWithMetadata(mergedItems);
      callback(result.initialUrls);
      result.onValidated(callback);
    } catch (error) {
      console.error("[GenericCollector] additional scan error", error);
      this.safeUpdateProgress(
        100,
        format("readyImages", { count: String(initialItems.length) }),
        "complete",
      );
      callback(initialItems.map((item) => item.url));
    }
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
