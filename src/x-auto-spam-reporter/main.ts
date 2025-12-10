/**
 * X/Twitter Auto Spam Reporter - メインエントリーポイント
 *
 * ツイート詳細ページのリプライをワンクリックでスパム報告＆ブロックするスクリプト
 */

import { createLogger } from '@/shared/logger';
import { SELECTORS } from './selectors';
import { ReporterUI } from './ui';
import { SpamReporter } from './reporter';

const logger = createLogger('x-auto-spam-reporter');

/**
 * メインアプリケーションクラス
 */
class XAutoSpamReporter {
  private ui: ReporterUI;
  private reporter: SpamReporter;
  private observer: MutationObserver | null = null;
  private isInitialized = false;

  constructor() {
    this.ui = new ReporterUI();
    this.reporter = new SpamReporter();
  }

  /**
   * 初期化
   */
  public initialize(): void {
    if (this.isInitialized) {
      logger.warn('既に初期化済みです');
      return;
    }

    logger.info('初期化中...');

    this.setupObserver();
    this.processExistingTweets();
    this.registerMenuCommand();

    this.isInitialized = true;
    this.ui.showToast('🚨 スパム自動報告モード\nリプライの「🚨」ボタンをクリック', 4000, 'info');
    logger.info('初期化完了');
  }

  /**
   * MutationObserverをセットアップ
   */
  private setupObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTORS.tweet)) {
              this.addButtonToTweet(node);
            }
            node.querySelectorAll<HTMLElement>(SELECTORS.tweet).forEach((tweet) => {
              this.addButtonToTweet(tweet);
            });
          }
        }
      }
    });

    const primaryColumn = document.querySelector(SELECTORS.primaryColumn);
    if (primaryColumn) {
      this.observer.observe(primaryColumn, { childList: true, subtree: true });
    } else {
      this.observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  /**
   * 既存のツイートを処理
   */
  private processExistingTweets(): void {
    document.querySelectorAll<HTMLElement>(SELECTORS.tweet).forEach((tweet) => {
      this.addButtonToTweet(tweet);
    });
  }

  /**
   * メインツイートかどうかを判定
   */
  private isMainTweet(tweetElement: HTMLElement): boolean {
    const allTweets = document.querySelectorAll(SELECTORS.tweet);
    return allTweets.length > 0 && allTweets[0] === tweetElement;
  }

  /**
   * ツイートにボタンを追加
   */
  private addButtonToTweet(tweetElement: HTMLElement): void {
    // メインツイートはスキップ
    if (this.isMainTweet(tweetElement)) return;

    this.ui.addButtonToTweet(tweetElement, async (tweet, button) => {
      if (this.reporter.processing) {
        this.ui.showToast('⏳ 処理中です...', 2000, 'warning');
        return;
      }

      this.ui.setButtonProcessing(button);

      try {
        // ユーザー名を取得（表示用）
        const userNameEl = tweet.querySelector(SELECTORS.userName);
        const userName = userNameEl?.textContent?.match(/@[\w]+/)?.[0] ?? '不明';
        this.ui.showToast(`🔄 ${userName} を報告中...`, 0, 'processing');

        const result = await this.reporter.report(tweet);

        if (result.success) {
          this.ui.setButtonDone(button);
          const stats = this.reporter.getStats();
          const message = `✅ ${result.userName} をスパム報告＆ブロックしました\n(報告: ${stats.reported}, ブロック: ${stats.blocked})`;
          this.ui.showToast(message, 3000, 'success');
        }
      } catch (error) {
        this.ui.resetButton(button);
        const errorMessage = error instanceof Error ? error.message : '不明なエラー';
        this.ui.showToast(`❌ エラー: ${errorMessage}`, 4000, 'error');
      }
    });
  }

  /**
   * メニューコマンドを登録
   */
  private registerMenuCommand(): void {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('統計を表示', () => {
        const stats = this.reporter.getStats();
        this.ui.showToast(
          `📊 統計\n報告: ${stats.reported}\nブロック: ${stats.blocked}\nエラー: ${stats.errors}`,
          5000,
          'info'
        );
      });

      GM_registerMenuCommand('自動ブロックをOFF', () => {
        this.reporter.setAutoBlock(false);
        this.ui.showToast('自動ブロック: OFF', 2000, 'info');
      });

      GM_registerMenuCommand('自動ブロックをON', () => {
        this.reporter.setAutoBlock(true);
        this.ui.showToast('自動ブロック: ON', 2000, 'info');
      });
    }
  }

  /**
   * 統計を取得
   */
  public getStats(): { reported: number; blocked: number; errors: number } {
    return this.reporter.getStats();
  }

  /**
   * 自動ブロックの設定を変更
   */
  public setAutoBlock(enabled: boolean): void {
    this.reporter.setAutoBlock(enabled);
    this.ui.showToast(`自動ブロック: ${enabled ? 'ON' : 'OFF'}`, 2000, 'info');
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.ui.destroy();
    this.isInitialized = false;
    logger.info('クリーンアップ完了');
  }
}

/**
 * react-rootが読み込まれるまで待機
 */
function waitForReactRoot(timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = (): void => {
      const reactRoot = document.getElementById('react-root');
      if (reactRoot) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for react-root'));
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}

/**
 * メイン処理
 */
(async () => {
  try {
    logger.info('起動中...');

    // react-rootが読み込まれるまで待機
    await waitForReactRoot();
    logger.info('React root found');

    // アプリケーションを初期化
    const app = new XAutoSpamReporter();
    app.initialize();

    // グローバルに公開（デバッグ用）
    (window as unknown as { xAutoSpamReporter: XAutoSpamReporter }).xAutoSpamReporter = app;

    logger.info('起動完了');
  } catch (error) {
    logger.error('起動エラー:', error);
  }
})();

