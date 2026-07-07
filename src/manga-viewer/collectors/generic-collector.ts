import type { LoadingSpinner } from "../ui/loading-spinner";
import { ICollector, CollectionResult } from "./i-collector";
import { win } from "../util";
import { isInvalidImage } from "../invalid-image-database";
import {
  hasUserImageHashExclusions,
  isUserExcludedImageByPixelHash,
} from "@/shared/image-exclusion-settings";
import { getImageCollectionDelaySettings } from "../image-collection-settings";
import {
  collectLoadedPageImages,
  collectPageImages,
  collectPageImagesWithScrollFallback,
  isDomOrderedPageImageCandidate,
  isLoadedPageImageCandidate,
  mergePageImageCollectionItems,
  sortPageImageCollectionItems,
  type PageImageCandidate,
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

  constructor(
    private readonly options: {
      preferFastLoadedWait?: boolean;
    } = {},
  ) {}

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
    const delaySettings = getImageCollectionDelaySettings();

    const fastLoadedImages = await this.collectFastLaunchImagesForLaunch();
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
      dynamicWaitMs: delaySettings.dynamicWaitMs,
      minCandidatesBeforeScroll: 2,
      fallbackDynamicWaitMs: delaySettings.fallbackDynamicWaitMs,
      exclude: (candidate) => this.isExcludedPageImageCandidate(candidate),
      scrollFallback: {
        enabled: true,
        maxScrolls: 20,
        stepRatio: 0.8,
        delayMs: delaySettings.scrollDelayMs,
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
      needsValidation: (candidate) =>
        this.needsExternalImageValidation(candidate),
    });
    return this.validateUrlsWithMetadata(scanned.items);
  }

  private async collectFastLaunchImages(): Promise<PageImageCollectionResult> {
    if (!this.isNicoMangaPage()) {
      return { items: [], urls: [] };
    }

    const loaded = collectLoadedPageImages({
      include: ["image"],
      minWidth: 100,
      minHeight: 100,
      exclude: (candidate) => this.isExcludedPageImageCandidate(candidate),
      needsValidation: () => false,
    });

    const observed = await collectPageImages({
      include: ["image", "source"],
      exclude: (candidate) => this.isExcludedPageImageCandidate(candidate),
      needsValidation: () => false,
    });
    const items = mergePageImageCollectionItems(loaded.items, observed.items);

    return {
      items,
      urls: items.map((item) => item.url),
    };
  }

  private async collectFastLaunchImagesForLaunch(): Promise<PageImageCollectionResult> {
    const initial = await this.collectFastLaunchImages();
    if (initial.items.length > 0 || !this.options.preferFastLoadedWait) {
      return initial;
    }

    const delaySettings = getImageCollectionDelaySettings();
    return this.waitForFastLaunchImages({
      minCount: 1,
      timeoutMs: delaySettings.fastLaunchRetryWaitMs,
      intervalMs: 100,
      currentBest: initial,
    });
  }

  private async waitForFastLaunchImages(options: {
    minCount: number;
    timeoutMs: number;
    intervalMs: number;
    currentBest: PageImageCollectionResult;
  }): Promise<PageImageCollectionResult> {
    const deadline = Date.now() + options.timeoutMs;
    let best = options.currentBest;

    while (Date.now() < deadline) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, options.intervalMs),
      );
      const current = await this.collectFastLaunchImages();
      if (current.items.length > best.items.length) {
        best = current;
      }
      if (current.items.length >= options.minCount) {
        return current;
      }
    }

    return best;
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
        dynamicWaitMs:
          getImageCollectionDelaySettings().additionalScanDynamicWaitMs,
        onProgress: (progress) => {
          this.safeUpdateProgress(
            0,
            format("imageCollected", { count: String(progress.count) }),
            "loading",
          );
        },
        exclude: (candidate) => this.isExcludedPageImageCandidate(candidate),
        needsValidation: (candidate) =>
          this.needsExternalImageValidation(candidate),
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
    urlsWithMetadata: PageImageCollectionItem[],
  ): Promise<CollectionResult> {
    const validUrlSet = new Set<string>();

    const filteredUrlsWithMetadataByUrl = urlsWithMetadata.filter((item) => {
      if (item.needsValidation) {
        return true;
      }
      return !this.isExcludedPageImageCandidate(item);
    });
    const filteredUrlsWithMetadata = await this.filterUserHashExcludedImages(
      filteredUrlsWithMetadataByUrl,
    );
    const orderedItems = sortPageImageCollectionItems(filteredUrlsWithMetadata);

    const buildOrderedValidUrls = () =>
      orderedItems
        .filter((item) => validUrlSet.has(item.url))
        .map((item) => item.url);

    // 検証不要なURLを先に抽出
    orderedItems
      .filter((item) => !item.needsValidation)
      .forEach((item) => validUrlSet.add(item.url));

    const initialUrls = buildOrderedValidUrls();

    this.spinner?.updateMessage(
      format("initialImagesReady", {
        count: String(initialUrls.length),
        remaining: String(orderedItems.length - initialUrls.length),
      }),
    );

    const result: CollectionResult = {
      initialUrls,
      onValidated: (callback) => {
        // バックグラウンドで検証処理
        (async () => {
          try {
            const validationNeeded = orderedItems.filter(
              (item) => item.needsValidation,
            );
            let validatedCount = 0;

            if (validationNeeded.length === 0) {
              this.safeUpdateProgress(
                100,
                format("readyImages", { count: String(validUrlSet.size) }),
                "complete",
              );
              callback(buildOrderedValidUrls());
              return;
            }

            for (const item of validationNeeded) {
              const isValid = await this.isImageAccessible(item.url);
              if (isValid) {
                validUrlSet.add(item.url);
                callback(buildOrderedValidUrls());
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
                count: String(validUrlSet.size),
              }),
              "complete",
            );
            callback(buildOrderedValidUrls());
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
            callback(buildOrderedValidUrls());
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

  private needsExternalImageValidation(candidate: PageImageCandidate): boolean {
    if (
      isLoadedPageImageCandidate(candidate, {
        minWidth: 100,
        minHeight: 100,
        exclude: (candidate) => this.isExcludedPageImageCandidate(candidate),
      })
    ) {
      return false;
    }

    if (
      isDomOrderedPageImageCandidate(candidate) &&
      (candidate.kind === "image" || candidate.kind === "source")
    ) {
      return false;
    }

    return !this.isSameOrigin(candidate.url);
  }

  private async filterUserHashExcludedImages(
    urlsWithMetadata: PageImageCollectionItem[],
  ): Promise<PageImageCollectionItem[]> {
    if (!hasUserImageHashExclusions("manga-viewer")) {
      return urlsWithMetadata;
    }

    const filtered: PageImageCollectionItem[] = [];
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

  private isExcludedPageImageCandidate(candidate: PageImageCandidate): boolean {
    if (
      isInvalidImage(candidate.url, candidate.width, candidate.height, {
        pageHost: window.location.hostname,
      })
    ) {
      return true;
    }

    if (!this.isNicoMangaPage()) {
      return false;
    }

    return this.isNicoMangaNonPageImage(candidate);
  }

  private isNicoMangaNonPageImage(candidate: PageImageCandidate): boolean {
    const element = candidate.element;
    if (!(element instanceof HTMLImageElement)) {
      return false;
    }

    const descriptor = [
      element.className,
      element.id,
      element.alt,
      element.getAttribute("role"),
    ]
      .filter((value): value is string => typeof value === "string")
      .join(" ")
      .toLowerCase();

    if (
      /(?:^|[-_\s])(cover|thumb|thumbnail|avatar|logo|banner|ad|ads|advert)(?:$|[-_\s])/i.test(
        descriptor,
      )
    ) {
      return true;
    }

    const rect = element.getBoundingClientRect();
    if (
      rect.width > 0 &&
      rect.height > 0 &&
      (rect.width < 100 || rect.height < 100)
    ) {
      return true;
    }

    return false;
  }
}
