/**
 * X/Twitter Auto Spam Reporter - 報告ロジック
 */

import { createLogger } from '@/shared/logger';
import {
  SELECTORS,
  SPAM_KEYWORDS,
  BLOCK_KEYWORDS,
  NEXT_KEYWORDS,
  DONE_KEYWORDS,
} from './selectors';
import type { ReporterConfig, ReporterStats } from '@/shared/types';

const logger = createLogger('x-auto-spam-reporter:reporter');

const DEFAULT_CONFIG: ReporterConfig = {
  debug: true,
  autoBlock: true,
  delays: {
    menuOpen: 300,
    menuClick: 200,
    dialogLoad: 500,
    stepInterval: 400,
    animation: 300,
  },
};

export class SpamReporter {
  private config: ReporterConfig;
  private stats: ReporterStats = {
    reported: 0,
    blocked: 0,
    errors: 0,
  };
  private isProcessing = false;

  constructor(config: Partial<ReporterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 処理中かどうか
   */
  public get processing(): boolean {
    return this.isProcessing;
  }

  /**
   * 統計を取得
   */
  public getStats(): ReporterStats {
    return { ...this.stats };
  }

  /**
   * 自動ブロックの設定を変更
   */
  public setAutoBlock(enabled: boolean): void {
    this.config.autoBlock = enabled;
    logger.info(`自動ブロック: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * 指定時間待機
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 要素が出現するまで待機
   */
  private async waitForElement(
    selector: string,
    timeout: number = 5000
  ): Promise<HTMLElement | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        return element;
      }
      await this.sleep(100);
    }

    return null;
  }

  /**
   * スクロール可能なコンテナを取得
   */
  private getScrollableContainer(): HTMLElement | null {
    const dialog = document.querySelector<HTMLElement>(SELECTORS.dialog);
    if (!dialog) return null;

    const scrollables = Array.from(dialog.querySelectorAll<HTMLElement>('div'));
    for (const el of scrollables) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      if (
        (overflowY === 'auto' || overflowY === 'scroll') &&
        el.scrollHeight > el.clientHeight
      ) {
        return el;
      }
    }

    return dialog;
  }

  /**
   * スクロールしながら要素を探す
   */
  private async findElementWithScroll(
    container: HTMLElement | null,
    finder: () => HTMLElement | null,
    maxScrollAttempts: number = 10
  ): Promise<HTMLElement | null> {
    const scrollContainer = container ?? this.getScrollableContainer() ?? document.body;

    // まず現在の位置で探す
    let element = finder();
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(200);
      return element;
    }

    // スクロールしながら探す
    const scrollStep = 200;

    for (let i = 0; i < maxScrollAttempts; i++) {
      scrollContainer.scrollTop += scrollStep;
      await this.sleep(150);

      element = finder();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await this.sleep(200);
        return element;
      }

      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        break;
      }
    }

    // 見つからなかった場合、上にスクロールして再度探す
    scrollContainer.scrollTop = 0;
    await this.sleep(200);

    element = finder();
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(200);
      return element;
    }

    return null;
  }

  /**
   * テキストを含む要素を探す
   */
  private findByText(
    keywords: readonly string[],
    selectors: string = 'label, button, [role="button"], [role="option"], [role="radio"]'
  ): HTMLElement | null {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors));
    for (const el of elements) {
      const text = el.textContent ?? '';
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return el;
        }
      }
    }
    return null;
  }

  /**
   * スパムオプションを選択
   */
  private async selectSpamOption(): Promise<void> {
    const dialog = await this.waitForElement(SELECTORS.dialog, 3000);
    if (!dialog) {
      throw new Error('報告ダイアログが見つかりません');
    }

    await this.sleep(this.config.delays.dialogLoad);

    const scrollContainer = this.getScrollableContainer();

    const allKeywords = [...SPAM_KEYWORDS.ja, ...SPAM_KEYWORDS.en];
    const spamLabel = await this.findElementWithScroll(scrollContainer, () =>
      this.findByText(allKeywords)
    );

    if (!spamLabel) {
      throw new Error('「スパム」オプションが見つかりません');
    }

    logger.debug('スパムオプションをクリック');
    spamLabel.click();
    await this.sleep(this.config.delays.menuClick);
  }

  /**
   * 「次へ」ボタンをクリック
   */
  private async clickNextButton(): Promise<void> {
    const scrollContainer = this.getScrollableContainer();

    const allKeywords = [...NEXT_KEYWORDS.ja, ...NEXT_KEYWORDS.en];
    const nextButton = await this.findElementWithScroll(scrollContainer, () => {
      // data-testidで探す
      const btn = document.querySelector<HTMLElement>(SELECTORS.nextButton);
      if (btn) {
        const text = btn.textContent?.trim() ?? '';
        const doneKeywords = [...DONE_KEYWORDS.ja, ...DONE_KEYWORDS.en];
        if (!doneKeywords.some((k) => text === k)) {
          return btn;
        }
      }

      // テキストで探す
      return this.findByText(allKeywords, 'button, [role="button"]');
    });

    if (nextButton) {
      logger.debug('「次へ」ボタンをクリック');
      nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(200);
      nextButton.click();
      await this.sleep(this.config.delays.animation);
    } else {
      logger.debug('「次へ」ボタンが見つかりません（スキップ）');
    }
  }

  /**
   * ブロックボタンをクリック
   */
  private async clickBlockButton(): Promise<void> {
    const scrollContainer = this.getScrollableContainer();

    const allKeywords = [...BLOCK_KEYWORDS.ja, ...BLOCK_KEYWORDS.en];
    const blockButton = await this.findElementWithScroll(scrollContainer, () =>
      this.findByText(allKeywords, 'button, [role="button"]')
    );

    if (!blockButton) {
      logger.debug('ブロックボタンが見つかりません（スキップ）');
      return;
    }

    logger.debug('ブロックボタンをクリック');
    blockButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await this.sleep(200);
    blockButton.click();
    await this.sleep(this.config.delays.animation);
  }

  /**
   * 完了ボタンをクリック
   */
  private async clickDoneButton(): Promise<void> {
    const scrollContainer = this.getScrollableContainer();

    const allKeywords = [...DONE_KEYWORDS.ja, ...DONE_KEYWORDS.en];
    const doneButton = await this.findElementWithScroll(scrollContainer, () => {
      const btn = document.querySelector<HTMLElement>(SELECTORS.nextButton);
      if (btn) return btn;
      return this.findByText(allKeywords, 'button, [role="button"]');
    });

    if (doneButton) {
      logger.debug('完了ボタンをクリック');
      doneButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(200);
      doneButton.click();
      await this.sleep(this.config.delays.animation);
    }
  }

  /**
   * ダイアログを閉じる試み
   */
  private async tryCloseDialog(): Promise<void> {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await this.sleep(200);

    const closeButtons = Array.from(
      document.querySelectorAll<HTMLElement>('[aria-label="閉じる"], [aria-label="Close"]')
    );
    for (const btn of closeButtons) {
      btn.click();
      await this.sleep(200);
    }
  }

  /**
   * 報告フローを実行
   */
  public async report(tweetElement: HTMLElement): Promise<{ success: boolean; userName: string }> {
    if (this.isProcessing) {
      throw new Error('既に処理中です');
    }

    this.isProcessing = true;

    // ユーザー名を取得
    const userNameEl = tweetElement.querySelector(SELECTORS.userName);
    const userName = userNameEl?.textContent?.match(/@[\w]+/)?.[0] ?? '不明';

    try {
      logger.info(`報告開始: ${userName}`);

      // Step 1: 3点メニューを開く
      const moreButton = tweetElement.querySelector<HTMLElement>(SELECTORS.moreButton);
      if (!moreButton) {
        throw new Error('3点メニューボタンが見つかりません');
      }

      moreButton.click();
      await this.sleep(this.config.delays.menuOpen);

      // Step 2: "ポストを報告" をクリック
      const reportItem = await this.waitForElement(SELECTORS.reportMenuItem, 3000);
      if (!reportItem) {
        throw new Error('「ポストを報告」が見つかりません');
      }

      reportItem.click();
      await this.sleep(this.config.delays.dialogLoad);

      // Step 3: "スパム" を選択
      await this.selectSpamOption();
      await this.sleep(this.config.delays.stepInterval);

      // Step 4: 「次へ」ボタンをクリック
      await this.clickNextButton();
      await this.sleep(this.config.delays.dialogLoad);

      // Step 5: 自動ブロックが有効なら実行
      if (this.config.autoBlock) {
        await this.clickBlockButton();
        await this.sleep(this.config.delays.stepInterval);
        this.stats.blocked++;
      }

      // Step 6: 完了ボタンをクリック
      await this.clickDoneButton();

      // 成功
      this.stats.reported++;
      logger.info(`報告完了: ${userName}`);

      return { success: true, userName };
    } catch (error) {
      this.stats.errors++;
      logger.error('報告エラー:', error);

      // ダイアログを閉じる試み
      await this.tryCloseDialog();

      throw error;
    } finally {
      this.isProcessing = false;
    }
  }
}

