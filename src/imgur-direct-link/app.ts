import { createLogger, Logger } from '@/shared/logger';
import { getMediaEntries, clearButtons } from './dom';
import { createShadowButton } from './ui';

export class ImgurCopierApp {
  private lastUrl: string = location.href;
  private observer: MutationObserver | null = null;
  private logger: Logger;
  private debounceTimer: number | null = null;

  constructor() {
    this.logger = createLogger('ImgurDirectLinkCopier');
  }

  public start(): void {
    this.observer = new MutationObserver(() => this.debouncedUpdate());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.update();
    this.logger.info('Application started and observer is running.');
  }

  public stop(): void {
    this.observer?.disconnect();
    clearButtons();
    this.logger.info('Application stopped and observer is disconnected.');
  }

  private debouncedUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => this.update(), 300);
  }

  private update(): void {
    const mediaEntries = getMediaEntries();
    if (mediaEntries.length === 0) {
      // メディアが見つからなければ既存のボタンをクリアして終了
      clearButtons();
      return;
    }

    // 不要になったボタンをクリア
    const existingButtons = new Set(mediaEntries.map((_, i) => `imgurCopyButton-container-${i}`));
    document.querySelectorAll('[data-imgur-direct-link-button-container]').forEach((btn) => {
      if (!existingButtons.has(btn.id)) {
        btn.remove();
      }
    });

    mediaEntries.forEach((entry, index) => {
      if (!entry.wrapper.querySelector(`#imgurCopyButton-container-${index}`))
        createShadowButton(index, entry.url, entry.wrapper);
    });
  }
}