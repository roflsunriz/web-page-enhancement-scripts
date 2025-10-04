import type { LegacyConfiguration } from "../config";
import type { Logger } from "@/shared/logger";
import type { ImageDataEntry, ZipDownloaderOptions } from "@/shared/types";
import { zipSync, type ZipOptions } from "fflate";
import { UIBuilder } from "../ui/ui-builder";
import { svgDownload, svgProcessing, svgSave } from "../../shared/icons/mdi";
import { ProgressBar } from "../ui/progress-bar";
import { Toast } from "../ui/toast";
import type { BadImageHandler } from "./bad-image-handler";
import { gmRequest } from "@/shared/network";

interface ProcessableImage {
  url: string;
  entry: ImageDataEntry;
  fileName: string;
}

interface ProcessedImage {
  success: boolean;
  url: string;
  fileName: string;
  bytes?: Uint8Array;
}

const DEFAULT_ZIP_OPTIONS: ZipDownloaderOptions = {
  maxZipSize: 500 * 1024 * 1024,
  maxImagesPerZip: 300,
  compressionLevel: 6,
  splitZipFiles: true,
};

export class ZipDownloader {
  private readonly filesData = new Map<string, Uint8Array>();
  private readonly downloadedUrls = new Set<string>();
  private isProcessing = false;

  constructor(
    private readonly uiBuilder: UIBuilder,
    private readonly badImageHandler: BadImageHandler,
    private readonly toast: Toast,
    private readonly progressBar: ProgressBar,
    private readonly logger: Logger,
    private readonly config: LegacyConfiguration,
    private readonly options: ZipDownloaderOptions = DEFAULT_ZIP_OPTIONS,
  ) {}

  async prepareZip(): Promise<void> {
    this.logger.debug("prepareZip開始");
    if (this.isProcessing) {
      this.logger.debug("既に処理中のため、prepareZipをスキップ");
      this.toast.show("現在処理中です。しばらくお待ちください...", "info");
      return;
    }

    this.isProcessing = true;

    try {
      this.filesData.clear();
      this.uiBuilder.setZipButtonState("processing", svgProcessing);
      this.toast.show("ZIPファイルの準備を開始します...", "info");
      this.progressBar.show();
      this.progressBar.update(0);

      let imageUrls = Array.from(this.uiBuilder.imageData.keys());
      if (this.config.singleImageTest && imageUrls.length > 0) {
        this.logger.debug("単一画像テストモード: 最初の1枚だけ処理します");
        imageUrls = [imageUrls[0]];
        this.toast.show("テストモード: 1枚だけZIPに追加します", "warning");
      }

      const total = imageUrls.length;
      this.logger.debug(`画像URL ${total}件を収集`);

      if (total === 0) {
        this.toast.show("ダウンロードできる画像がありません", "error");
        this.uiBuilder.setZipButtonState("initial", svgDownload);
        return;
      }

      let processed = 0;
      let failed = 0;
      let skipped = 0;

      const imagesToProcess: ProcessableImage[] = [];
      const imageDataMap = this.uiBuilder.imageData;

      for (const [index, url] of imageUrls.entries()) {
        try {
          this.logger.debug(
            `画像情報収集 ${index + 1}/${total}: ${(url as string).substring(0, 50)}...`,
          );
          const imageData = imageDataMap.get(url);
          if (!imageData) {
            this.logger.error("画像データが見つかりません", undefined, { url });
            failed += 1;
            continue;
          }

          this.logger.debug("メタデータ", {
            width: imageData.metadata?.width,
            height: imageData.metadata?.height,
            size: imageData.metadata?.size,
            hasBlob: imageData.blob !== null,
          });

          if (!imageData.blob) {
            try {
              const blob = await this.fetchImageAsBlob(url as string);
              imageData.blob = blob;
              imageDataMap.set(url, imageData);
              this.logger.debug("Blobダウンロード成功", { size: blob.size });
            } catch (error) {
              this.logger.error(
                "画像のダウンロードに失敗しました",
                error instanceof Error ? error : undefined,
                { url },
              );
              failed += 1;
              continue;
            }
          } else {
            skipped += 1;
            this.logger.debug("既存のBlobを使用", {
              size: imageData.blob.size,
            });
          }

          const fileName = this.getFilenameFromUrl(url as string);
          imagesToProcess.push({ url: url as string, entry: imageData, fileName });
        } catch (error) {
          this.logger.error(
            "画像メタデータ処理中にエラーが発生しました",
            error instanceof Error ? error : undefined,
            {
              url,
              index,
            },
          );
          failed += 1;
        }
      }

      this.logger.debug("並列処理開始", { count: imagesToProcess.length });
      if (imagesToProcess.length === 0) {
        this.toast.show("ZIPに追加できる画像がありませんでした", "warning");
      }

      const processedEntries = await Promise.all(
        imagesToProcess.map(async ({ url, entry, fileName }, index) => {
          try {
            if (!entry.blob) {
              this.logger.error("Blobが存在しません", undefined, {
                url,
                fileName,
              });
              return { success: false, url, fileName } satisfies ProcessedImage;
            }

            this.logger.debug("画像変換", { index: index + 1, fileName });
            const bytes = new Uint8Array(await entry.blob.arrayBuffer());
            if (bytes.byteLength === 0) {
              this.logger.warn("変換後のデータが空です", { url, fileName });
              return { success: false, url, fileName } satisfies ProcessedImage;
            }

            return {
              success: true,
              url,
              fileName,
              bytes,
            } satisfies ProcessedImage;
          } catch (error) {
            this.logger.error(
              "画像処理中にエラーが発生しました",
              error instanceof Error ? error : undefined,
              {
                url,
                fileName,
              },
            );
            return { success: false, url, fileName } satisfies ProcessedImage;
          }
        }),
      );

      for (const entry of processedEntries) {
        if (entry.success && entry.bytes) {
          this.filesData.set(entry.fileName, entry.bytes);
          this.downloadedUrls.add(entry.url);
          processed += 1;
        } else {
          failed += 1;
        }
        const progress = (processed / total) * 100;
        this.progressBar.update(progress);
      }

      this.logger.debug("並列処理完了", {
        processed,
        failed,
        skipped,
        filesCount: this.filesData.size,
      });
      this.toast.show(`${processed}/${total} 画像が準備されました`, "info");

      if (this.config.singleImageTest) {
        this.logger.debug("単一画像テストモードで実行されました");
        this.toast.show("テストモード: 単一画像のみでZIPを生成します", "info");
      }

      if (failed > 0) {
        this.toast.show(
          `${failed}枚の画像をZIPに含められませんでした`,
          "warning",
        );
      }

      if (processed > 0) {
        this.toast.show(
          "ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",
          "success",
        );
        this.uiBuilder.setZipButtonState("ready", svgSave);
      } else {
        this.logger.error("処理された画像が0件です", undefined, {
          total,
          processed,
          failed,
        });
        this.toast.show("ZIPファイルの作成に失敗しました", "error");
        this.uiBuilder.setZipButtonState("initial", svgDownload);
        this.filesData.clear();
      }
    } catch (error) {
      this.logger.error(
        "ZIP準備中にエラーが発生しました",
        error instanceof Error ? error : undefined,
        {
          filesDataSize: this.filesData.size,
        },
      );
      this.toast.show("ZIPファイルの準備に失敗しました", "error");
      this.uiBuilder.setZipButtonState("initial", svgDownload);
      this.filesData.clear();
    } finally {
      this.progressBar.hide();
      this.isProcessing = false;
    }
  }

  async downloadZip(): Promise<void> {
    this.logger.debug("downloadZip開始");
    if (!this.fflateAvailable()) {
      this.toast.show(
        "ZIPライブラリが読み込まれていないため、ダウンロードできません",
        "error",
      );
      this.logger.error("fflate利用不可のためダウンロード中止");
      return;
    }

    if (this.filesData.size === 0) {
      this.logger.warn("ファイルデータが空のため準備からやり直し");
      this.toast.show(
        "ZIPファイルが準備されていません。再度準備します...",
        "warning",
      );
      await this.prepareZip();
      return;
    }

    const fileEntries = Array.from(this.filesData.entries());
    if (fileEntries.length === 0) {
      this.logger.error("ZIPファイルが空です");
      this.toast.show("ZIPファイルに画像が含まれていません", "error");
      this.uiBuilder.setZipButtonState("initial", svgDownload);
      return;
    }

    this.logger.debug("ZIP内のファイル数", { count: fileEntries.length });

    try {
      this.isProcessing = true;
      this.toast.show("ZIPファイルを生成しています...", "info");
      this.progressBar.show();

      const totalEntries = fileEntries.length;
      const needsSplitting =
        this.options.splitZipFiles &&
        totalEntries > this.options.maxImagesPerZip;

      if (needsSplitting) {
        await this.generateSplitZips(fileEntries, totalEntries);
      } else {
        await this.generateSingleZip(fileEntries);
      }
    } catch (error) {
      this.logger.error(
        "ZIPダウンロード中に詳細エラー情報",
        error instanceof Error ? error : undefined,
        {
          filesDataSize: this.filesData.size,
        },
      );
      this.toast.show("ZIPファイルの生成に失敗しました", "error");
    } finally {
      this.progressBar.hide();
      this.uiBuilder.setZipButtonState(
        "initial",
        '<span class="ic material-icons">download</span>',
      );
      this.isProcessing = false;
    }
  }

  private async generateSingleZip(
    entries: Array<[string, Uint8Array]>,
  ): Promise<void> {
    this.logger.debug("単一ZIPファイル生成開始");
    console.time("[ZipDownloader] ZIP生成時間");

    const files: Record<string, Uint8Array> = {};
    for (const [filename, bytes] of entries) {
      files[filename] = bytes;
    }

    const zipOptions = this.createZipOptions();

    const zipData = zipSync(files, zipOptions);
    console.timeEnd("[ZipDownloader] ZIP生成時間");

    if (!zipData) {
      throw new Error("ZIP生成結果がnullです");
    }

    const blob = this.createZipBlob(zipData);
    const filename = `images_${this.getFormattedDate()}.zip`;
    await this.triggerDownload(blob, filename);
    this.toast.show("ZIPファイルのダウンロードが開始されました", "success");
  }

  private async generateSplitZips(
    entries: Array<[string, Uint8Array]>,
    totalEntries: number,
  ): Promise<void> {
    this.logger.debug("分割ZIPファイル生成開始", { totalEntries });
    const totalParts = Math.ceil(totalEntries / this.options.maxImagesPerZip);
    this.toast.show(
      `画像が多いため、${totalParts}個のZIPファイルに分割します`,
      "info",
    );

    for (let part = 0; part < totalParts; part += 1) {
      const start = part * this.options.maxImagesPerZip;
      const end = Math.min(
        (part + 1) * this.options.maxImagesPerZip,
        totalEntries,
      );
      const slice = entries.slice(start, end);

      this.logger.debug("分割ZIP生成", {
        part: part + 1,
        start: start + 1,
        end,
      });
      this.progressBar.update((part / totalParts) * 100);

      const files: Record<string, Uint8Array> = {};
      for (const [filename, bytes] of slice) {
        files[filename] = bytes;
      }

      const zipData = zipSync(files, this.createZipOptions());
      const blob = this.createZipBlob(zipData);
      const filename = `images_${this.getFormattedDate()}_part${part + 1}of${totalParts}.zip`;
      await this.triggerDownload(blob, filename);

      if (part < totalParts - 1) {
        this.toast.show(
          `パート${part + 1}/${totalParts}のダウンロードが開始されました。次のパートを準備中...`,
          "success",
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    this.toast.show(
      `全${totalParts}個のZIPファイルのダウンロードを開始しました`,
      "success",
    );
  }

  private triggerDownload(blob: Blob, filename: string): Promise<void> {
    this.logger.debug("ダウンロード開始", { filename });
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          resolve();
        }, 100);
      } catch (error) {
        this.logger.error(
          "ダウンロードリンク作成エラー",
          error instanceof Error ? error : undefined,
          { filename },
        );
        reject(error);
      }
    });
  }

  private fetchImageAsBlob(url: string): Promise<Blob> {
    this.logger.debug("fetchImageAsBlob開始", { url: url.substring(0, 50) });
    return new Promise((resolve, reject) => {
      gmRequest<Blob>({ url, responseType: "blob", timeout: 30000 })
        .then((res) => {
          const blob = res.response as Blob | null;
          if (blob) {
            this.logger.debug("画像ダウンロード成功", {
              url: url.substring(0, 50),
              size: blob.size,
            });
            resolve(blob);
          } else {
            this.logger.error(
              "レスポンスまたはレスポンスデータが空です",
              undefined,
              { url },
            );
            reject(new Error("Empty response"));
          }
        })
        .catch((err) => {
          this.logger.error("画像ダウンロード失敗", undefined, { url, error: err });
          reject(err);
        });
    });
  }

  private createZipOptions(): ZipOptions {
    return {
      level: this.options.compressionLevel,
      mem: 8,
    };
  }

  private createZipBlob(zipData: Uint8Array): Blob {
    const arrayBuffer = zipData.slice().buffer;
    return new Blob([arrayBuffer], { type: "application/zip" });
  }

  private getFilenameFromUrl(url: string): string {
    const [path] = url.split("?");
    let fileName = path?.split("/").pop() ?? "image.jpg";

    if (!fileName.includes(".")) {
      fileName += ".jpg";
    }

    const base = fileName.substring(0, fileName.lastIndexOf("."));
    const extension = fileName.substring(fileName.lastIndexOf("."));
    let counter = 1;
    let newFileName = fileName;

    while (this.filesData.has(newFileName)) {
      newFileName = `${base}_${counter}${extension}`;
      counter += 1;
    }

    return newFileName;
  }

  private getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  private fflateAvailable(): boolean {
    return typeof zipSync === "function";
  }
}
