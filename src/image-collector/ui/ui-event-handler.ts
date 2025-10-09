import type { ZipDownloader } from "../core/zip-downloader";
import type { Logger } from "@/shared/logger";
import { UIBuilder } from "./ui-builder";
import { gmRequest } from "@/shared/network";
import { createShadowHost } from "@/shared/dom";
export class UIEventHandler {
  constructor(
    private readonly uiBuilder: UIBuilder,
    private readonly zipDownloader: ZipDownloader,
    private readonly logger: Logger,
  ) {}

  initialize(): void {
    this.setupModalInteractions();
    this.setupZipButton();
    this.setupGridInteractions();
    this.logger.debug("イベントハンドラーの設定が完了しました");
  }

  private setupModalInteractions(): void {
    const modal = this.uiBuilder.getModalElement();
    modal.addEventListener("click", (event) => {
      try {
        if (event.target === modal) {
          this.uiBuilder.hideModal();
        }
      } catch (error) {
        this.logger.error(
          "モーダルクリックイベント処理中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });

    this.uiBuilder.getCloseButton().addEventListener("click", () => {
      try {
        this.uiBuilder.hideModal();
      } catch (error) {
        this.logger.error(
          "閉じるボタンクリック処理中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
  }

  private setupZipButton(): void {
    this.uiBuilder.getZipButton().addEventListener("click", () => {
      try {
        const state = this.uiBuilder.getZipButton().dataset.state;
        if (state === "initial") {
          void this.zipDownloader.prepareZip();
        } else if (state === "ready") {
          void this.zipDownloader.downloadZip();
        }
      } catch (error) {
        this.logger.error(
          "ZIPボタンクリック処理中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
  }

  private setupGridInteractions(): void {
    const grid = this.uiBuilder.getGridContainer();
    grid.addEventListener("click", (event) => {
      try {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }
        const image = target.closest(
          ".ic.grid-image",
        ) as HTMLImageElement | null;
        if (!image) {
          return;
        }
        const imageUrl = image.src;
        const originalUrl = image.dataset.originalUrl ?? imageUrl;
        this.showFullScreenImage(imageUrl, originalUrl);
      } catch (error) {
        this.logger.error(
          "画像クリック処理中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
  }

  private showFullScreenImage(imageUrl: string, originalUrl: string): void {
    const { root: shadowRoot, dispose } = createShadowHost({
      id: "fullscreen-shadow-host",
      mode: "closed",
    });

    const style = document.createElement("style");
    style.textContent = `
      .ic.full-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10002;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ic.full-screen-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      }

      .ic.download-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.download-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.full-screen-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10003;
        transition: color 0.3s ease;
      }

      .ic.full-screen-close-button:hover {
        color: #ff4444;
      }

      .ic.original-link-button {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.original-link-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .ic.file-name-display {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 1.2rem;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 10003;
      }
    `;
    shadowRoot.appendChild(style);

    const container = document.createElement("div");
    container.classList.add("ic", "full-screen-container");

    const img = document.createElement("img");
    img.src = imageUrl;
    img.classList.add("ic", "full-screen-image");
    container.appendChild(img);

    const downloadButton = document.createElement("button");
    downloadButton.classList.add("ic", "download-button");
    downloadButton.textContent = "ダウンロード";
    downloadButton.addEventListener("click", () => {
      try {
        this.downloadImage(imageUrl);
      } catch (error) {
        this.logger.error(
          "フルスクリーンダウンロード中にエラーが発生しました",
          error instanceof Error ? error : undefined,
          {
            imageUrl,
          },
        );
      }
    });
    container.appendChild(downloadButton);

    const originalLinkButton = document.createElement("button");
    originalLinkButton.classList.add("ic", "original-link-button");
    originalLinkButton.textContent = "元ページを開く";
    originalLinkButton.addEventListener("click", () => {
      window.open(originalUrl, "_blank");
    });
    container.appendChild(originalLinkButton);

    const fileNameDisplay = document.createElement("div");
    fileNameDisplay.classList.add("ic", "file-name-display");
    fileNameDisplay.textContent = originalUrl.split("/").pop() ?? originalUrl;
    container.appendChild(fileNameDisplay);

    const closeButton = document.createElement("button");
    closeButton.classList.add("ic", "full-screen-close-button");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
      try {
        dispose();
      } catch (error) {
        this.logger.error(
          "フルスクリーンモーダルの閉じる処理でエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
    container.appendChild(closeButton);

    container.addEventListener("click", (event) => {
      if (event.target === container) {
        try {
          dispose();
        } catch (error) {
          this.logger.error(
            "フルスクリーンモーダルの削除中にエラーが発生しました",
            error instanceof Error ? error : undefined,
          );
        }
      }
    });

    shadowRoot.appendChild(container);
  }

  private async downloadImage(imageUrl: string): Promise<void> {
    try {
      const res = await gmRequest<Blob>({ url: imageUrl, responseType: "blob" });
      const blob = res.response as Blob | null;
      if (!blob) {
        this.logger.error("ダウンロードしたBlobが空です", undefined, { imageUrl });
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split("/").pop() ?? "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      this.logger.debug("画像のダウンロードが完了しました", { imageUrl });
    } catch (error) {
      this.logger.error(
        "ダウンロード要求の作成中にエラーが発生しました",
        error instanceof Error ? error : undefined,
        { imageUrl },
      );
    }
  }
}
