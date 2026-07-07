import React from "@/shared/react";
import { createRoot } from "@/shared/react";
import type { Root as ReactRoot } from "@/shared/react";
import { globalState } from "../state";
import { setTimeoutSafely } from "../util";
import { LoadingSpinner } from "./loading-spinner";
import { ViewerComponent } from "./viewer-component";
import viewerStyles from "./viewer.css?inline";
import { createShadowHost } from "@/shared/dom";
import { format } from "../i18n";

// React.createElementのエイリアス（インポート後に定義）
const e = React.createElement;
const VIEWER_HOST_ID = "book-style-manga-viewer-root";

export class UIBuilder {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private spinner: LoadingSpinner | null = null;
  private reactRoot: ReactRoot | null = null;
  private updateImagesCallback: ((images: string[]) => void) | null = null;
  private currentImageUrls: string[] = [];

  public setSpinner(spinner: LoadingSpinner) {
    this.spinner = spinner;
  }

  public getUpdateImagesCallback(): ((images: string[]) => void) | null {
    return this.updateImagesCallback;
  }

  public async preloadImages(imageUrls: string[]) {
    if (!imageUrls || imageUrls.length === 0) {
      console.error("[MangaViewer] preloadImages: no image URLs provided");
      return;
    }

    const total = imageUrls.length;
    let loaded = 0;
    let errors = 0;
    const alreadyLoadedUrls = this.collectAlreadyLoadedImageUrls();
    const urlsToPreload = imageUrls.filter(
      (url) => !alreadyLoadedUrls.has(url),
    );
    loaded = total - urlsToPreload.length;

    if (urlsToPreload.length === 0) {
      this.spinner?.updateMessage(
        format("loadedImagesReady", { count: String(total) }),
        100,
      );
      this.spinner?.setComplete();
      return;
    }

    const initialPercent = Math.round((loaded / total) * 100);
    this.spinner?.updateMessage(
      format("loadingImages", {
        loaded: String(loaded),
        percent: String(initialPercent),
        total: String(total),
      }),
      initialPercent,
    );

    const batchSize = 5;
    for (let i = 0; i < urlsToPreload.length; i += batchSize) {
      const batch = urlsToPreload.slice(i, i + batchSize);
      await Promise.all(
        batch.map(
          (url) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = url;
              img.onload = () => {
                loaded++;
                resolve();
              };
              img.onerror = () => {
                errors++;
                loaded++; // エラーでもロード済みとしてカウント
                console.error(
                  `[MangaViewer] preloadImages: failed to load image ${url}`,
                );
                resolve();
              };
            }),
        ),
      );
      const percent = Math.round((loaded / total) * 100);
      const message =
        errors > 0
          ? format("loadingImagesWithErrors", {
              errors: String(errors),
              loaded: String(loaded),
              percent: String(percent),
              total: String(total),
            })
          : format("loadingImages", {
              loaded: String(loaded),
              percent: String(percent),
              total: String(total),
            });
      this.spinner?.updateMessage(message, percent);
    }

    const finalMessage =
      errors > 0
        ? format("preloadCompleteWithErrors", {
            errors: String(errors),
            loaded: String(loaded - errors),
            total: String(total),
          })
        : format("preloadComplete", { total: String(total) });
    this.spinner?.updateMessage(finalMessage, 100);
    this.spinner?.setComplete();
  }

  private collectAlreadyLoadedImageUrls(): Set<string> {
    const urls = new Set<string>();
    document.querySelectorAll("img").forEach((imgElement) => {
      if (
        !imgElement.complete ||
        imgElement.naturalWidth <= 0 ||
        imgElement.naturalHeight <= 0
      ) {
        return;
      }

      if (imgElement.currentSrc && imgElement.currentSrc.startsWith("http")) {
        urls.add(imgElement.currentSrc);
      }
      if (imgElement.src && imgElement.src.startsWith("http")) {
        urls.add(imgElement.src);
      }
    });
    return urls;
  }

  public async buildAndRenderViewer(
    initialImageUrls: string[],
    options: { initialAutoNav?: boolean } = {},
    onCloseCallback: () => void,
  ): Promise<HTMLElement | null> {
    globalState.isViewerActive = true;

    if (initialImageUrls.length > 0) {
      void this.preloadImages(initialImageUrls);
    } else {
      this.spinner?.updateMessage(format("validImageSearch", {}));
    }

    document
      .querySelectorAll<HTMLElement>(`#${VIEWER_HOST_ID}`)
      .forEach((staleHost) => staleHost.remove());

    const { host, root } = createShadowHost({
      id: VIEWER_HOST_ID,
      mode: "closed",
    });
    this.shadowHost = host;
    this.shadowHost.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 10001; pointer-events: auto;
    `;
    this.shadowRoot = root;

    const style = document.createElement("style");
    style.textContent = viewerStyles;
    this.shadowRoot.appendChild(style);
    const reactContainer = document.createElement("div");
    this.shadowRoot.appendChild(reactContainer);

    this.reactRoot = createRoot(reactContainer) as ReactRoot;

    // 初回レンダリング
    this.currentImageUrls = initialImageUrls;
    this.renderViewer(initialImageUrls, options, onCloseCallback);

    // 画像更新用のコールバックを設定
    this.updateImagesCallback = (newImages: string[]) => {
      if (areSameImageUrls(this.currentImageUrls, newImages)) {
        return;
      }
      this.currentImageUrls = newImages;
      this.renderViewer(newImages, options, onCloseCallback);
    };

    // フォールバックでフォーカスを設定。安全なタイマーヘルパーを利用して例外を吸収する
    setTimeoutSafely(() => {
      this.shadowRoot
        ?.querySelector<HTMLElement>(".manga-viewer-container")
        ?.focus();
    }, 100);

    return this.shadowHost;
  }

  private renderViewer(
    images: string[],
    options: { initialAutoNav?: boolean },
    onCloseCallback: () => void,
  ) {
    if (!this.reactRoot) return;

    this.reactRoot.render(
      e(ViewerComponent, {
        images: images,
        onClose: () => {
          try {
            this.reactRoot?.unmount();
            this.shadowHost?.remove();
            this.shadowHost = null;
            this.shadowRoot = null;
            this.reactRoot = null;
            onCloseCallback();
          } catch (closeError) {
            console.error("[MangaViewer] Error closing viewer:", closeError);
          }
        },
        initialAutoNav: options.initialAutoNav,
      }),
    );
  }
}

const areSameImageUrls = (left: string[], right: string[]): boolean =>
  left.length === right.length &&
  left.every((url, index) => url === right[index]);
