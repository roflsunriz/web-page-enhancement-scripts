import type { Logger } from "@/shared/logger";
import { createLogger } from "@/shared/logger";
import type { ClassifiedImage, ImageClassification } from "@/shared/types";
import { UIBatchUpdater } from "../ui/ui-batch-updater";
import { ProgressBar } from "../ui/progress-bar";
import { Toast } from "../ui/toast";
import type { BadImageHandler } from "./bad-image-handler";
import { ImageHostManager } from "./image-host-manager";
import { ImageSourceClassifier } from "./image-source-classifier";
import { RequestBatchLimiter } from "./request-batch-limiter";
import { gmRequest } from "@/shared/network";

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
    this.toast.show("画像収集を開始します...", "info");
    this.progressBar.show();
    this.progressBar.update(0);

    try {
      const imageData = new Map<string, CollectedImageData>();
      const fastPathImages: ClassifiedImage[] = [];
      const slowPathImages: string[] = [];

      this.collectFromImages(imageData, fastPathImages, slowPathImages);
      this.collectFromPictureSources(imageData, fastPathImages, slowPathImages);
      this.collectFromAnchors(imageData, slowPathImages);
      this.collectFromBackgrounds(imageData, slowPathImages);

      this.logger.debug("画像分類完了", {
        fastPath: fastPathImages.length,
        slowPath: slowPathImages.length,
      });
      this.toast.show(
        `画像を分類しました: 高速=${fastPathImages.length}, 通常=${slowPathImages.length}`,
        "info",
      );

      if (fastPathImages.length > 0) {
        this.toast.show("信頼できる画像を高速処理中...", "info");
        await this.uiBatchUpdater.addImagesFastPath(fastPathImages);
        this.progressBar.update(30);
      }

      if (slowPathImages.length > 0) {
        this.toast.show("外部画像を検証中...", "info");
        await this.processSlowPathImages(slowPathImages);
      }

      const totalImages = fastPathImages.length + slowPathImages.length;
      if (totalImages === 0) {
        this.logger.warn("処理対象の画像が0件です");
        this.toast.show("処理対象の画像が見つかりませんでした", "warning");
        this.progressBar.hide();
        return;
      }

      this.progressBar.update(100);
      setTimeout(() => {
        this.progressBar.hide();
        this.toast.show(
          `${totalImages}枚の画像を収集しました！(高速:${fastPathImages.length}, 通常:${slowPathImages.length})`,
          "success",
        );
        this.logger.debug("画像収集完了", { totalImages });
      }, 500);
    } catch (error) {
      this.logger.error(
        "画像収集処理中に予期しないエラーが発生しました",
        error instanceof Error ? error : undefined,
      );
      this.toast.show("画像収集中に予期しないエラーが発生しました", "error");
      this.progressBar.hide();
    }
  }

  private collectFromImages(
    imageData: Map<string, CollectedImageData>,
    fastPathImages: ClassifiedImage[],
    slowPathImages: string[],
  ): void {
    document.querySelectorAll("img").forEach((img) => {
      try {
        const src = this.resolveUrl(img.src);
        if (!src) {
          return;
        }
        const classification = this.imageSourceClassifier.classifyImageSource(
          src,
          img,
        );
        imageData.set(src, { element: img, classification });

        if (classification.fastPath) {
          fastPathImages.push({ url: src, classification });
          this.logger.debug("高速パス画像", {
            src: src.substring(0, 50),
            reason: classification.reason,
          });
        } else {
          slowPathImages.push(src);
          this.logger.debug("低速パス画像", {
            src: src.substring(0, 50),
            reason: classification.reason,
          });
        }
      } catch (error) {
        this.logger.warn("img要素の処理中にエラーが発生しました", {
          error,
          src: img.src,
        });
      }
    });
  }

  private collectFromPictureSources(
    imageData: Map<string, CollectedImageData>,
    fastPathImages: ClassifiedImage[],
    slowPathImages: string[],
  ): void {
    document
      .querySelectorAll<HTMLSourceElement>("picture source")
      .forEach((source) => {
        try {
          const srcset = source.srcset
            .split(",")
            .map((s: string) => s.trim().split(" ")[0])
            .filter(Boolean);

          srcset.forEach((src: string) => {
            const resolved = this.resolveUrl(src);
            if (!resolved || imageData.has(resolved)) {
              return;
            }
            const classification =
              this.imageSourceClassifier.classifyImageSource(resolved, source);
            imageData.set(resolved, { element: source, classification });

            if (classification.fastPath) {
              fastPathImages.push({ url: resolved, classification });
              this.logger.debug("高速パス(picture)", {
                src: resolved.substring(0, 50),
                reason: classification.reason,
              });
            } else {
              slowPathImages.push(resolved);
              this.logger.debug("低速パス(picture)", {
                src: resolved.substring(0, 50),
                reason: classification.reason,
              });
            }
          });
        } catch (error) {
          this.logger.warn("picture要素の処理中にエラーが発生しました", {
            error,
            srcset: source.srcset,
          });
        }
      });
  }

  private collectFromAnchors(
    imageData: Map<string, CollectedImageData>,
    slowPathImages: string[],
  ): void {
    document.querySelectorAll("a").forEach((anchor) => {
      try {
        const href = this.resolveUrl(anchor.href);
        if (!href || !this.isImageUrl(href) || imageData.has(href)) {
          return;
        }
        const classification =
          this.imageSourceClassifier.classifyImageSource(href);
        imageData.set(href, { element: null, classification });
        slowPathImages.push(href);
        this.logger.debug("低速パス(link)", {
          src: href.substring(0, 50),
          reason: classification.reason,
        });
      } catch (error) {
        this.logger.warn("a要素の処理中にエラーが発生しました", {
          error,
          href: anchor.href,
        });
      }
    });
  }

  private collectFromBackgrounds(
    imageData: Map<string, CollectedImageData>,
    slowPathImages: string[],
  ): void {
    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      try {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (!bgImage || bgImage === "none") {
          return;
        }
        const url = bgImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
        const resolved = this.resolveUrl(url);
        if (!resolved || imageData.has(resolved)) {
          return;
        }
        const classification =
          this.imageSourceClassifier.classifyImageSource(resolved);
        imageData.set(resolved, { element: null, classification });
        slowPathImages.push(resolved);
        this.logger.debug("低速パス(bg)", {
          src: resolved.substring(0, 50),
          reason: classification.reason,
        });
      } catch (error) {
        this.logger.warn("背景画像の処理中にエラーが発生しました", {
          error,
          tag: element.tagName,
        });
      }
    });
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

  private resolveUrl(url: string | null | undefined): string | null {
    if (!url) {
      return null;
    }

    try {
      if (url.includes("?http")) {
        const redirect = url.split("?http")[1];
        if (redirect) {
          return new URL(`http${redirect}`).href;
        }
      }
      return new URL(url, window.location.href).href;
    } catch (error) {
      this.logger.debug("URL解決に失敗しました", { url, error });
      return null;
    }
  }

  private isImageUrl(url: string | null | undefined): boolean {
    if (!url) {
      return false;
    }
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const lower = url.toLowerCase();
    return extensions.some((ext) => lower.endsWith(ext));
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
            const body = String((res.response as unknown as { responseText?: string }).responseText ?? "");
            const doc = parser.parseFromString(body, "text/html");
            const meta = doc.querySelector('meta[property="og:image"]');
            if (meta?.getAttribute("content")) {
              resolve(meta.getAttribute("content") ?? url);
            } else {
              resolve(url);
            }
          } catch (error) {
            this.logger.warn("SNS画像の解析中にエラーが発生しました", { error, url });
            resolve(url);
          }
        })
        .catch(() => resolve(url));
    });
  }
}
