import { createLogger, Logger } from '@/shared/logger';
import { isTargetPage, getMediaEntries, clearButtons } from './dom';
import { createShadowButton } from './ui';

export class ImgurCopierApp {
  private lastUrl: string = location.href;
  private observer: MutationObserver;
  private logger: Logger;
  constructor() {
    this.logger = createLogger('ImgurDirectLinkCopier');
    this.observer = new MutationObserver(() => this.handleUrlChange());
  }

  public start(): void {
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.update();
    this.logger.info('Application started and observer is running.');
  }

  public stop(): void {
    this.observer.disconnect();
    clearButtons();
    this.logger.info('Application stopped and observer is disconnected.');
  }

  private handleUrlChange(): void {
    if (location.href !== this.lastUrl) {
      this.lastUrl = location.href;
      this.logger.info(`URL changed to: ${this.lastUrl}`);
      // 少し待ってからDOMの更新を反映させる
      setTimeout(() => this.update(), 500);
    }
  }

  private update(): void {
    if (!isTargetPage()) {
      clearButtons();
      return;
    }

    const mediaEntries = getMediaEntries();
    if (mediaEntries.length === 0) {
      return;
    }

    // 既存のボタンをクリアしてから再生成
    clearButtons();

    mediaEntries.forEach((entry, index) => {
      createShadowButton(index, entry.url, entry.wrapper);
    });
  }
}