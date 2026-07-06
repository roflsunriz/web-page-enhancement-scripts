import { createLogger, type Logger } from "@/shared/logger";
import type { ClassifiedImage, ImageClassification } from "@/shared/types";
import { UIBatchUpdater } from "../ui/ui-batch-updater";
import { ProgressBar } from "../ui/progress-bar";
import { Toast } from "../ui/toast";
import type { BadImageHandler } from "./bad-image-handler";
import { ImageHostManager } from "./image-host-manager";
import { ImageSourceClassifier } from "./image-source-classifier";
import { RequestBatchLimiter } from "./request-batch-limiter";
import { isKnownBadImageCollectorCandidate } from "./bad-image-handler";
import { gmRequest } from "@/shared/network";
import {
  hasUserImageHashExclusions,
  isUserExcludedImage,
  isUserExcludedImageByPixelHash,
} from "@/shared/image-exclusion-settings";
import {
  collectLoadedPageImages,
  collectPageImagesWithScrollFallback,
  mergePageImageCollectionItems,
  type PageImageCandidate,
} from "@/shared/page-image-candidates";
import { format, t } from "../i18n";

interface CollectedImageData {
  element: Element | null;
  classification: ImageClassification;
}

export class ImageCollectorMain {
  private readonly imageHostManager: ImageHostManager;
  private readonly imageSourceClassifier: ImageSourceClassifier;
  private readonly requestLimiter: RequestBatchLimiter;

  constructor(
    private readonly uiBatchUpdater: UIBatchUpdater,
    private readonly badImageHandler: BadImageHandler,
    private readonly progressBar: ProgressBar,
    private readonly toast: Toast,
    private readonly logger: Logger,
  ) {
    this.imageHostManager = new ImageHostManager(
      createLogger("ImageCollector2:ImageHostManager"),
    );
    this.imageSourceClassifier = new ImageSourceClassifier(
      createLogger("ImageCollector2:SourceClassifier"),
    );
    this.requestLimiter = new RequestBatchLimiter(
      createLogger("ImageCollector2:RequestLimiter"),
    );
  }

  async collectImages(): Promise<void> {
    this.logger.debug("画像収集開始");
    this.toast.show(t("collectStart"), "info");
    this.progressBar.show();
    this.progressBar.update(0);

    try {
      const imageData = new Map<string, CollectedImageData>();
      let fastPathImages: ClassifiedImage[] = [];
      const slowPathImages: string[] = [];

      await this.collectFromPageCandidates(
        imageData,
        fastPathImages,
        slowPathImages,
      );

      this.logger.debug("画像分類完了", {
        fastPath: fastPathImages.length,
        slowPath: slowPathImages.length,
      });
      this.toast.show(
        format("classifiedImages", {
          fast: String(fastPathImages.length),
          normal: String(slowPathImages.length),
        }),
        "info",
      );

      if (fastPathImages.length > 0) {
        fastPathImages =
          await this.filterUserExcludedFastPathImages(fastPathImages);
      }

      if (fastPathImages.length > 0) {
        this.toast.show(t("reliableImagesProcessing"), "info");
        await this.uiBatchUpdater.addImagesFastPath(fastPathImages);
        this.progressBar.update(30);
      }

      if (slowPathImages.length > 0) {
        this.toast.show(t("externalImagesValidating"), "info");
        await this.processSlowPathImages(slowPathImages);
      }

      const totalImages = fastPathImages.length + slowPathImages.length;
      if (totalImages === 0) {
        this.logger.warn("処理対象の画像が0件です");
        this.toast.show(t("noImagesFound"), "warning");
        this.progressBar.hide();
        return;
      }

      this.progressBar.update(100);
      setTimeout(() => {
        this.progressBar.hide();
        this.toast.show(
          format("collectComplete", {
            fast: String(fastPathImages.length),
            normal: String(slowPathImages.length),
            total: String(totalImages),
          }),
          "success",
        );
        this.logger.debug("画像収集完了", { totalImages });
      }, 500);
    } catch (error) {
      this.logger.error(
        "画像収集処理中に予期しないエラーが発生しました",
        error,
      );
      this.toast.show(t("collectUnexpectedError"), "error");
      this.progressBar.hide();
    }
  }

  private async collectFromPageCandidates(
    imageData: Map<string, CollectedImageData>,
    fastPathImages: ClassifiedImage[],
    slowPathImages: string[],
  ): Promise<void> {
    const loaded = collectLoadedPageImages({
      exclude: (candidate) => this.isUserExcludedCandidate(candidate),
    });
    const collected = await collectPageImagesWithScrollFallback({
      dynamicWaitMs: 500,
      minCandidatesBeforeScroll: 1,
      fallbackDynamicWaitMs: 1500,
      scrollFallback: {
        enabled: true,
        maxScrolls: 20,
        stepRatio: 0.8,
        delayMs: 400,
        stopAfterNoNewScans: 3,
      },
      exclude: (candidate) => this.isUserExcludedCandidate(candidate),
    });

    mergePageImageCollectionItems(loaded.items, collected.items).forEach(
      (candidate) => {
        try {
          const classification = this.imageSourceClassifier.classifyImageSource(
            candidate.url,
            candidate.element ?? undefined,
          );
          imageData.set(candidate.url, {
            element: candidate.element,
            classification,
          });

          if (this.canUseFastPath(candidate, classification)) {
            fastPathImages.push({ url: candidate.url, classification });
            this.logger.debug("高速パス画像", {
              src: candidate.url.substring(0, 50),
              reason: classification.reason,
            });
          } else {
            slowPathImages.push(candidate.url);
            this.logger.debug("低速パス画像", {
              src: candidate.url.substring(0, 50),
              reason: classification.reason,
            });
          }
        } catch (error) {
          this.logger.warn("画像候補の処理中にエラーが発生しました", {
            error,
            src: candidate.url,
          });
        }
      },
    );
  }

  private isUserExcludedCandidate(candidate: PageImageCandidate): boolean {
    return (
      isKnownBadImageCollectorCandidate(
        candidate.url,
        candidate.width,
        candidate.height,
      ) ||
      isUserExcludedImage(
        "image-collector",
        candidate.url,
        candidate.width,
        candidate.height,
      )
    );
  }

  private canUseFastPath(
    candidate: PageImageCandidate,
    classification: ImageClassification,
  ): boolean {
    return (
      classification.fastPath &&
      (candidate.kind === "image" || candidate.kind === "source")
    );
  }

  private async processSlowPathImages(slowPathImages: string[]): Promise<void> {
    const resolvedUrls: string[] = [];

    for (const url of slowPathImages) {
      try {
        if (this.imageHostManager.isSupportedHost(url)) {
          const resolved = await this.getSnsImageUrl(url);
          resolvedUrls.push(resolved);
        } else {
          resolvedUrls.push(url);
        }
      } catch (error) {
        this.logger.warn("SNS画像URL解決中にエラーが発生しました", {
          error,
          url,
        });
        resolvedUrls.push(url);
      }
    }

    const validationResults = await Promise.allSettled(
      resolvedUrls.map(async (url) => {
        try {
          const isValid = await this.badImageHandler.isValidImage(url);
          return isValid ? url : null;
        } catch (error) {
          this.logger.warn("画像検証中にエラーが発生しました", { error, url });
          return null;
        }
      }),
    );

    const filtered = validationResults
      .filter(
        (result): result is PromiseFulfilledResult<string | null> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value)
      .filter((value): value is string => value !== null);

    if (filtered.length > 0) {
      await this.uiBatchUpdater.addImages(filtered);
    }

    this.progressBar.update(60);
  }

  private async filterUserExcludedFastPathImages(
    images: ClassifiedImage[],
  ): Promise<ClassifiedImage[]> {
    if (!hasUserImageHashExclusions("image-collector")) {
      return images;
    }

    const filtered: ClassifiedImage[] = [];
    for (const image of images) {
      const isExcluded = await isUserExcludedImageByPixelHash(
        "image-collector",
        image.url,
      );
      if (!isExcluded) {
        filtered.push(image);
      }
    }
    return filtered;
  }

  private async getSnsImageUrl(url: string): Promise<string> {
    if (!/(twitter\.com|x\.com)/i.test(url)) {
      return url;
    }

    return new Promise((resolve) => {
      gmRequest<string>({ url, responseType: "text" })
        .then((res) => {
          try {
            const parser = new DOMParser();
            const body = String(
              (res.response as unknown as { responseText?: string })
                .responseText ?? "",
            );
            const doc = parser.parseFromString(body, "text/html");
            const meta = doc.querySelector('meta[property="og:image"]');
            if (meta?.getAttribute("content")) {
              resolve(meta.getAttribute("content") ?? url);
            } else {
              resolve(url);
            }
          } catch (error) {
            this.logger.warn("SNS画像の解析中にエラーが発生しました", {
              error,
              url,
            });
            resolve(url);
          }
        })
        .catch((error: unknown) => {
          this.logger.warn("SNS画像URL取得中にエラーが発生しました", {
            error,
            url,
          });
          resolve(url);
        });
    });
  }
}
