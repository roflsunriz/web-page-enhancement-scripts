import type { LegacyConfiguration } from "../config";
import type { Logger } from "@/shared/logger";
import type { ImageDataMap, ImageMetadata } from "@/shared/types";
import type { BadImageHandler } from "../core/bad-image-handler";
import { svgDownload } from "../../shared/icons/mdi";
import { createShadowHost } from "@/shared/dom";

export class UIBuilder {
  private modal: HTMLDivElement | null = null;
  private gridContainer: HTMLDivElement | null = null;
  private closeButton: HTMLButtonElement | null = null;
  private zipButton: HTMLButtonElement | null = null;
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private readonly imageStore: ImageDataMap = new Map();

  constructor(
    private readonly config: LegacyConfiguration,
    private readonly badImageHandler: BadImageHandler,
    private readonly logger: Logger,
  ) {}

  buildModal(): void {
    try {
      const { host, root } = createShadowHost({ id: "image-collector-shadow-host", mode: "closed" });
      this.shadowHost = host;
      this.shadowRoot = root;
      this.injectShadowStyles(this.shadowRoot);

      this.modal = document.createElement("div");
      this.modal.classList.add("image-collector-modal");

      this.gridContainer = document.createElement("div");
      this.gridContainer.classList.add("ic", "image-grid-container");
      this.modal.appendChild(this.gridContainer);

      this.zipButton = document.createElement("button");
      this.zipButton.classList.add("ic", "zip-download-button");
      this.zipButton.innerHTML = svgDownload;
      this.zipButton.dataset.state = "initial";
      this.zipButton.style.display = this.config.showZipButton
        ? "flex"
        : "none";
      this.modal.appendChild(this.zipButton);

      this.closeButton = document.createElement("button");
      this.closeButton.classList.add("ic", "close-button");
      this.closeButton.textContent = "×";
      this.modal.appendChild(this.closeButton);

      this.shadowRoot.appendChild(this.modal);
      document.body.appendChild(this.shadowHost);

      this.logger.debug("モーダルの構築が完了しました");
    } catch (error) {
      this.logger.error(
        "モーダルの構築中にエラーが発生しました",
        error instanceof Error ? error : undefined,
      );
      throw error;
    }
  }

  addImageToGrid(imageUrl: string, metadata: ImageMetadata): void {
    const grid = this.getGridContainer();
    const item = this.createImageItem(imageUrl, metadata);
    grid.appendChild(item);
  }

  showModal(): void {
    this.getModalElement().style.display = "block";
  }

  hideModal(): void {
    const grid = this.getGridContainer();
    grid.innerHTML = "";
    this.getModalElement().style.display = "none";
  }

  setZipButtonVisibility(visible: boolean): void {
    const button = this.getZipButton();
    button.style.display = visible ? "flex" : "none";
  }

  setZipButtonState(state: string, iconHtml: string): void {
    const button = this.getZipButton();
    button.dataset.state = state;
    button.innerHTML = iconHtml;
  }

  get imageData(): ImageDataMap {
    return this.imageStore;
  }

  getModalElement(): HTMLDivElement {
    if (!this.modal) {
      throw new Error("Modal has not been built yet.");
    }
    return this.modal;
  }

  getGridContainer(): HTMLDivElement {
    if (!this.gridContainer) {
      throw new Error("Grid container has not been built yet.");
    }
    return this.gridContainer;
  }

  getZipButton(): HTMLButtonElement {
    if (!this.zipButton) {
      throw new Error("ZIP button has not been built yet.");
    }
    return this.zipButton;
  }

  getCloseButton(): HTMLButtonElement {
    if (!this.closeButton) {
      throw new Error("Close button has not been built yet.");
    }
    return this.closeButton;
  }

  private injectShadowStyles(root: ShadowRoot): void {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .image-collector-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: none;
        z-index: 9999;
        backdrop-filter: blur(10px);
        overflow-y: auto;
      }

      .ic.image-grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        padding: 20px;
        max-width: 90%;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(5px);
        margin-top: 50px;
      }

      .ic.image-item {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;
      }

      .ic.image-item:hover {
        transform: scale(1.05);
      }

      .ic.grid-image {
        width: 100%;
        height: auto;
        display: block;
        opacity: 0.9;
        transition: opacity 0.3s ease;
      }

      .ic.grid-image:hover {
        opacity: 1;
      }

      .ic.close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10000;
        transition: color 0.3s ease;
      }

      .ic.close-button:hover {
        color: #ff4444;
      }

      .ic.zip-download-button {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: rgba(0, 123, 255, 0.2);
        border: 2px solid rgba(0, 123, 255, 0.4);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
      }

      .ic.zip-download-button:hover {
        background-color: rgba(0, 123, 255, 0.4);
        transform: scale(1.1);
      }

      .ic.zip-download-button[data-state="processing"] {
        background-color: rgba(255, 193, 7, 0.2);
        border-color: rgba(255, 193, 7, 0.4);
        animation: pulse 1.5s infinite;
      }

      .ic.zip-download-button[data-state="ready"] {
        background-color: rgba(40, 167, 69, 0.2);
        border-color: rgba(40, 167, 69, 0.4);
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
        }
      }

      /* Material Icons font removed; now using inline SVG from @mdi/js */

      .ic.image-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        text-align: center;
      }

      .ic.size-info {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10px;
      }

      .ic.load-button {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .ic.load-button:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

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
    root.appendChild(styleElement);
  }

  private createImageItem(
    imageUrl: string,
    metadata: ImageMetadata,
  ): HTMLDivElement {
    const imageItem = document.createElement("div");
    imageItem.classList.add("ic", "image-item");

    this.imageStore.set(imageUrl, { metadata, blob: null });

    if (metadata.size > this.badImageHandler.maxFileSize) {
      imageItem.appendChild(
        this.badImageHandler.createPlaceholder(imageUrl, metadata),
      );
      return imageItem;
    }

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Collected Image";
    img.classList.add("ic", "grid-image");

    img.onerror = () => {
      this.logger.warn("画像の読み込みに失敗しました", { imageUrl });
      const placeholder = this.badImageHandler.createErrorPlaceholder(imageUrl);
      imageItem.replaceChildren(placeholder);
    };

    imageItem.appendChild(img);
    return imageItem;
  }
}
