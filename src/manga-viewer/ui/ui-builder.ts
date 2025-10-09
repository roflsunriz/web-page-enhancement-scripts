import React from '@/shared/react';
import { createRoot } from '@/shared/react';
import type { Root as ReactRoot } from '@/shared/react';
import { globalState } from '../state';
import { setTimeoutSafely } from '../util';
import { LoadingSpinner } from './loading-spinner';
import { ViewerComponent } from './viewer-component';
import viewerStyles from './viewer.css?inline';
import { win } from '../util';
import { createShadowHost } from '@/shared/dom';

// React.createElementのエイリアス（インポート後に定義）
const e = React.createElement;

export class UIBuilder {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private spinner: LoadingSpinner | null = null;
  private reactRoot: ReactRoot | null = null;
  private updateImagesCallback: ((images: string[]) => void) | null = null;

  public setSpinner(spinner: LoadingSpinner) {
    this.spinner = spinner;
  }

  public getUpdateImagesCallback(): ((images: string[]) => void) | null {
    return this.updateImagesCallback;
  }

  public async preloadImages(imageUrls: string[]) {
    if (!imageUrls || imageUrls.length === 0) {
      console.error('[MangaViewer] preloadImages: no image URLs provided');
      return;
    }

    const total = imageUrls.length;
    let loaded = 0;
    let errors = 0;

    this.spinner?.updateMessage(`画像をプリロード中... 0/${total} (0%)`, 0);

    const batchSize = 5;
    for (let i = 0; i < total; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
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
                console.error(`[MangaViewer] preloadImages: failed to load image ${url}`);
                resolve();
              };
            }),
        ),
      );
      const percent = Math.round((loaded / total) * 100);
      const message =
        errors > 0
          ? `画像をプリロード中... ${loaded}/${total} (${percent}%) - ${errors}枚エラー`
          : `画像をプリロード中... ${loaded}/${total} (${percent}%)`;
      this.spinner?.updateMessage(message, percent);
    }

    const finalMessage =
      errors > 0
        ? `${total}枚中${loaded - errors}枚の画像をプリロード完了（${errors}枚エラー）。ビューアを起動中...`
        : `${total}枚の画像をプリロード完了。ビューアを起動中...`;
    this.spinner?.updateMessage(finalMessage, 100);
    this.spinner?.setComplete();
  }

  public async buildAndRenderViewer(
    initialImageUrls: string[],
    options: { initialAutoNav?: boolean } = {},
    onCloseCallback: () => void,
  ): Promise<HTMLElement | null> {
    globalState.isViewerActive = true;

    if (initialImageUrls.length > 0) {
      await this.preloadImages(initialImageUrls);
    } else {
      this.spinner?.updateMessage('有効な画像を検索中です...');
    }

    const { host, root } = createShadowHost({ mode: 'closed' });
    this.shadowHost = host;
    this.shadowHost.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 10001; pointer-events: auto;
    `;
    this.shadowRoot = root;

    const style = document.createElement('style');
    style.textContent = viewerStyles;
    this.shadowRoot.appendChild(style);
    const reactContainer = document.createElement('div');
    this.shadowRoot.appendChild(reactContainer);

    this.reactRoot = createRoot(reactContainer) as ReactRoot;

    // 初回レンダリング
    this.renderViewer(initialImageUrls, options, onCloseCallback, true);

    // 画像更新用のコールバックを設定
    this.updateImagesCallback = (newImages: string[]) => {
      this.renderViewer(newImages, options, onCloseCallback, false);
    };

    // フォールバックでフォーカスを設定。安全なタイマーヘルパーを利用して例外を吸収する
    setTimeoutSafely(() => {
      this.shadowRoot?.querySelector<HTMLElement>('.manga-viewer-container')?.focus();
    }, 100);

    return this.shadowHost;
  }

  private renderViewer(
    images: string[],
    options: { initialAutoNav?: boolean },
    onCloseCallback: () => void,
    isFirstRender: boolean,
  ) {
    if (!this.reactRoot) return;

    if (typeof win !== 'undefined' && images.length > 0 && isFirstRender) {
      try {
        console.debug('[UIBuilder] first render: images count', { count: images.length });
      } catch (err) {
        // ignore error in debug logging, reference variable to satisfy linter
        void err;
      }
      // 初期の無意味な 0% 通知は削除。実際の進捗はコレクター/プリロード側で報告される。
    }

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
            console.error('[MangaViewer] Error closing viewer:', closeError);
          }
        },
        initialAutoNav: options.initialAutoNav,
      }),
    );
  }
}
