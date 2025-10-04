import type { BadImageHandler } from "../core/bad-image-handler";
import type { Logger } from "@/shared/logger";
import type { ClassifiedImage, ImageMetadata, ImageQueueItem } from "@/shared/types";
import { UIBuilder } from "./ui-builder";

export class UIBatchUpdater {
  private readonly imageQueue: ImageQueueItem[] = [];
  private isProcessing = false;

  constructor(
    private readonly uiBuilder: UIBuilder,
    private readonly badImageHandler: BadImageHandler,
    private readonly logger: Logger,
  ) {}

  async addImagesFastPath(images: ClassifiedImage[]): Promise<void> {
    if (!Array.isArray(images)) {
      this.logger.error("imageItemsが配列ではありません", undefined, {
        type: typeof images,
      });
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const item of images) {
      try {
        const { url, classification } = item;
        let metadata: ImageMetadata | null = null;

        const element = classification.element;
        if (
          element instanceof HTMLImageElement &&
          element.naturalWidth > 0 &&
          element.naturalHeight > 0
        ) {
          metadata = {
            width: element.naturalWidth,
            height: element.naturalHeight,
            size: 0,
            loaded: element.complete,
          };
          this.logger.debug(
            `DOM要素からメタデータ取得: ${url.substring(0, 50)}...`,
            {
              width: metadata.width,
              height: metadata.height,
            },
          );
        }

        if (!metadata) {
          metadata = await this.badImageHandler.getImageMetadata(url);
          if (!metadata) {
            this.logger.warn("高速パスでもメタデータ取得に失敗しました", {
              url,
            });
            failureCount += 1;
            continue;
          }
        }

        this.imageQueue.push({ url, metadata });
        successCount += 1;
      } catch (error) {
        this.logger.error(
          "高速パス画像処理中にエラーが発生しました",
          error instanceof Error ? error : undefined,
          {
            url: item.url,
          },
        );
        failureCount += 1;
      }
    }

    this.logger.debug("高速パス処理完了", { successCount, failureCount });

    if (!this.isProcessing) {
      void this.processBatch();
    }
  }

  async addImages(imageUrls: string[]): Promise<void> {
    if (!Array.isArray(imageUrls)) {
      this.logger.error("imageUrlsが配列ではありません", undefined, {
        type: typeof imageUrls,
      });
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const url of imageUrls) {
      try {
        const metadata = await this.badImageHandler.getImageMetadata(url);
        if (!metadata) {
          this.logger.warn("画像のメタデータ取得に失敗しました", { url });
          failureCount += 1;
          continue;
        }
        this.imageQueue.push({ url, metadata });
        successCount += 1;
      } catch (error) {
        this.logger.error(
          "画像メタデータの取得中にエラーが発生しました",
          error instanceof Error ? error : undefined,
          {
            url,
          },
        );
        failureCount += 1;
      }
    }

    this.logger.debug("画像追加処理完了", { successCount, failureCount });

    if (!this.isProcessing) {
      void this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    try {
      this.isProcessing = true;
      const batchSize = 5;

      const processNext = (): void => {
        try {
          const imagesToAdd = this.imageQueue.splice(0, batchSize);
          imagesToAdd.forEach(({ url, metadata }) => {
            try {
              this.uiBuilder.addImageToGrid(url, metadata);
            } catch (error) {
              this.logger.error(
                "グリッドへの画像追加中にエラーが発生しました",
                error instanceof Error ? error : undefined,
                {
                  url,
                },
              );
            }
          });

          if (this.imageQueue.length > 0) {
            requestAnimationFrame(processNext);
          } else {
            this.isProcessing = false;
            this.logger.debug("バッチ処理が完了しました");
          }
        } catch (error) {
          this.logger.error(
            "バッチ処理中にエラーが発生しました",
            error instanceof Error ? error : undefined,
          );
          this.isProcessing = false;
        }
      };

      requestAnimationFrame(processNext);
    } catch (error) {
      this.logger.error(
        "バッチ処理の開始中にエラーが発生しました",
        error instanceof Error ? error : undefined,
      );
      this.isProcessing = false;
    }
  }
}
