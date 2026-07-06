import type { Logger } from "@/shared/logger";
import type { ImageMetadata } from "@/shared/types";
import { gmRequest } from "@/shared/network";
import {
  hasUserImageHashExclusions,
  isUserExcludedImage,
  isUserExcludedImageByPixelHash,
} from "@/shared/image-exclusion-settings";
import { isKnownInvalidImage } from "@/shared/known-invalid-images";
import { format, t } from "../i18n";

interface DeletedImageSize {
  width: number;
  height: number;
}

const DELETED_IMAGE_SIZES: DeletedImageSize[] = [
  { width: 320, height: 320 },
  { width: 161, height: 81 },
];

const IMAGE_COLLECTOR_MIN_SIZE = 50;
const IMAGE_COLLECTOR_MAX_SIZE = 5000;

export function isKnownBadImageCollectorCandidate(
  url: string,
  width?: number,
  height?: number,
): boolean {
  if (!isImageUrl(url)) {
    return true;
  }
  if (isUserExcludedImage("image-collector", url, width, height)) {
    return true;
  }
  if (
    isKnownInvalidImage(url, width, height, {
      pageHost: window.location.hostname,
    })
  ) {
    return true;
  }
  if (width === undefined || height === undefined) {
    return false;
  }
  if (isDeletedImageSize(width, height)) {
    return true;
  }
  if (width < IMAGE_COLLECTOR_MIN_SIZE || height < IMAGE_COLLECTOR_MIN_SIZE) {
    return true;
  }
  return width > IMAGE_COLLECTOR_MAX_SIZE || height > IMAGE_COLLECTOR_MAX_SIZE;
}

export class BadImageHandler {
  readonly minSize = IMAGE_COLLECTOR_MIN_SIZE;
  readonly maxSize = IMAGE_COLLECTOR_MAX_SIZE;
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly deletedImageSizes: DeletedImageSize[] = DELETED_IMAGE_SIZES;

  constructor(private readonly logger: Logger) {}

  async isValidImage(url: string): Promise<boolean | "large"> {
    if (!url) {
      return false;
    }

    if (!this.isImageUrl(url)) {
      return false;
    }

    if (isUserExcludedImage("image-collector", url, undefined, undefined)) {
      return false;
    }
    if (
      isKnownInvalidImage(url, undefined, undefined, {
        pageHost: window.location.hostname,
      })
    ) {
      return false;
    }

    try {
      const metadata = await this.getImageMetadata(url);
      if (!metadata) {
        return false;
      }

      if (
        isUserExcludedImage(
          "image-collector",
          url,
          metadata.width,
          metadata.height,
        )
      ) {
        return false;
      }
      if (
        isKnownInvalidImage(url, metadata.width, metadata.height, {
          pageHost: window.location.hostname,
        })
      ) {
        return false;
      }

      if (
        hasUserImageHashExclusions("image-collector") &&
        (await isUserExcludedImageByPixelHash("image-collector", url))
      ) {
        return false;
      }

      if (this.isDeletedImage(metadata)) {
        return false;
      }

      if (metadata.width < this.minSize || metadata.height < this.minSize) {
        return false;
      }

      if (metadata.width > this.maxSize || metadata.height > this.maxSize) {
        return false;
      }

      if (metadata.size > this.maxFileSize) {
        return "large";
      }

      return true;
    } catch (error) {
      this.logger.error("画像のメタデータ取得中にエラーが発生しました", error, {
        url,
      });
      return false;
    }
  }

  isDeletedImage(metadata: ImageMetadata): boolean {
    return this.deletedImageSizes.some(
      (size) =>
        size.width === metadata.width && size.height === metadata.height,
    );
  }

  createPlaceholder(url: string, metadata: ImageMetadata): HTMLDivElement {
    try {
      const placeholder = document.createElement("div");
      placeholder.classList.add("ic", "image-placeholder");

      const sizeInfo = document.createElement("div");
      sizeInfo.classList.add("ic", "size-info");
      sizeInfo.textContent = format("size", {
        height: String(metadata.height),
        size: this.formatBytes(metadata.size),
        width: String(metadata.width),
      });

      const loadButton = document.createElement("button");
      loadButton.classList.add("ic", "load-button");
      loadButton.textContent = t("loadImage");
      loadButton.addEventListener("click", () => {
        try {
          placeholder.replaceWith(this.createImageElement(url));
        } catch (error) {
          this.logger.error("画像の読み込み中にエラーが発生しました", error, {
            url,
          });
        }
      });

      placeholder.append(sizeInfo, loadButton);
      return placeholder;
    } catch (error) {
      this.logger.error(
        "プレースホルダーの作成中にエラーが発生しました",
        error,
        { url },
      );
      const fallback = document.createElement("div");
      fallback.classList.add("ic", "image-placeholder");
      fallback.textContent = t("imageLoadFailed");
      return fallback;
    }
  }

  createErrorPlaceholder(url: string): HTMLDivElement {
    try {
      const placeholder = document.createElement("div");
      placeholder.classList.add("ic", "image-placeholder");
      placeholder.style.backgroundColor = "rgba(220, 53, 69, 0.2)";

      const errorText = document.createElement("div");
      errorText.textContent = t("imageLoadFailed");
      errorText.style.color = "#dc3545";

      const retryButton = document.createElement("button");
      retryButton.classList.add("ic", "load-button");
      retryButton.textContent = t("retry");
      retryButton.addEventListener("click", () => {
        try {
          placeholder.replaceWith(this.createImageElement(url));
        } catch (error) {
          this.logger.error("画像の再読み込み中にエラーが発生しました", error, {
            url,
          });
        }
      });

      placeholder.append(errorText, retryButton);
      return placeholder;
    } catch (error) {
      this.logger.error(
        "エラープレースホルダーの作成中にエラーが発生しました",
        error,
        { url },
      );
      const fallback = document.createElement("div");
      fallback.textContent = t("imageLoadFailed");
      return fallback as HTMLDivElement;
    }
  }

  createImageElement(url: string): HTMLImageElement {
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("ic", "grid-image");
    return img;
  }

  async getImageMetadata(url: string): Promise<ImageMetadata | null> {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";

        const timeoutId = window.setTimeout(() => {
          this.logger.warn("画像サイズ取得がタイムアウトしました", { url });
          reject(new Error("Image size detection timeout"));
        }, 8000);

        img.onload = () => {
          try {
            window.clearTimeout(timeoutId);
            if (img.width === 0 || img.height === 0) {
              this.logger.warn("無効な画像サイズです", {
                url,
                width: img.width,
                height: img.height,
              });
              reject(new Error("Invalid image dimensions"));
              return;
            }

            gmRequest<{ responseText?: string }>({
              method: "HEAD",
              url,
              timeout: 5000,
            })
              .then((response) => {
                try {
                  const headers = response.headers ?? "";
                  const lengthMatch = headers.match(/Content-Length:\s*(\d+)/i);
                  const typeMatch = headers.match(/Content-Type:\s*([^;\n]+)/i);
                  const contentLength = lengthMatch
                    ? Number.parseInt(lengthMatch[1], 10)
                    : 0;
                  const contentType = typeMatch ? typeMatch[1] : "";

                  if (!contentType.startsWith("image/")) {
                    this.logger.warn("画像ではないコンテンツタイプです", {
                      url,
                      contentType,
                    });
                    reject(new Error("Not an image"));
                    return;
                  }

                  resolve({
                    width: img.width,
                    height: img.height,
                    size: Number.isFinite(contentLength) ? contentLength : 0,
                    loaded: img.complete,
                  });
                } catch (error) {
                  this.logger.error(
                    "ヘッダー解析中にエラーが発生しました",
                    error,
                    { url },
                  );
                  reject(error);
                }
              })
              .catch((err) => {
                this.logger.error(
                  "画像メタデータ取得中にエラーが発生しました",
                  err,
                  { url },
                );
                reject(new Error("HEAD request failed"));
              });
          } catch (error) {
            this.logger.error(
              "メタデータ取得処理でエラーが発生しました",
              error,
              { url },
            );
            reject(error);
          }
        };

        img.onerror = () => {
          window.clearTimeout(timeoutId);
          this.logger.warn("画像読み込みに失敗しました", { url });
          reject(new Error("Image load error"));
        };

        img.src = url;
      } catch (error) {
        this.logger.error(
          "メタデータ取得処理の開始中にエラーが発生しました",
          error,
          { url },
        );
        reject(error);
      }
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  private isImageUrl(url: string): boolean {
    return isImageUrl(url);
  }
}

function isDeletedImageSize(width: number, height: number): boolean {
  return DELETED_IMAGE_SIZES.some(
    (size) => size.width === width && size.height === height,
  );
}

function isImageUrl(url: string): boolean {
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const lower = url.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}
