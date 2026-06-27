/**
 * X/Twitter Auto Spam Reporter - メインエントリーポイント
 *
 * ツイート詳細ページのリプライをワンクリックでスパム報告＆ブロックするスクリプト
 * SPA対応: URL変更を監視して、statusページでのみ動作
 */

import { createLogger } from "@/shared/logger";
import { SELECTORS } from "./selectors";
import { ReporterUI } from "./ui";
import { SpamReporter } from "./reporter";
import { format, t } from "./i18n";

const logger = createLogger("x-auto-spam-reporter");

/**
 * 現在のURLがstatusページかどうかを判定
 */
function isStatusPage(): boolean {
  const url = window.location.href;
  // /status/ を含むURLがstatusページ
  // 例: https://x.com/username/status/1234567890
  return /https:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/\d+/.test(url);
}

/**
 * ツイートコンテンツが読み込まれるまで待機
 * @param timeout タイムアウト（ミリ秒）
 * @returns コンテンツが見つかった場合はtrue、タイムアウトした場合はfalse
 */
function waitForContent(timeout: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const check = (): void => {
      // ツイートが1つでも存在すればOK
      const tweets = document.querySelectorAll(SELECTORS.tweet);
      if (tweets.length > 0) {
        resolve(true);
        return;
      }

      // primaryColumnが存在すればOK（ツイートがまだ読み込まれていなくても）
      const primaryColumn = document.querySelector(SELECTORS.primaryColumn);
      if (primaryColumn) {
        // primaryColumnはあるがツイートがない場合、もう少し待つ
        const elapsed = Date.now() - startTime;
        if (elapsed > 2000) {
          // 2秒以上経過していればprimaryColumnだけでOKとする
          resolve(true);
          return;
        }
      }

      if (Date.now() - startTime > timeout) {
        logger.warn("コンテンツの読み込みがタイムアウトしました");
        resolve(false);
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}

/**
 * メインアプリケーションクラス
 */
class XAutoSpamReporter {
  private ui: ReporterUI;
  private reporter: SpamReporter;
  private observer: MutationObserver | null = null;
  private isInitialized = false;
  private isActive = false;

  constructor() {
    this.ui = new ReporterUI();
    this.reporter = new SpamReporter();
  }

  /**
   * 初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn("既に初期化済みです");
      return;
    }

    logger.info("初期化中...");

    // statusページでのみアクティブ化
    if (isStatusPage()) {
      await this.activate();
    }

    this.registerMenuCommand();
    this.isInitialized = true;
    logger.info("初期化完了");
  }

  /**
   * スクリプトをアクティブ化（statusページでのみ）
   * コンテンツの読み込みを待ってからObserverを設定
   */
  public async activate(): Promise<void> {
    if (this.isActive) return;

    logger.info("statusページを検出 - アクティブ化待機中...");

    // コンテンツが読み込まれるまで待機
    const contentLoaded = await waitForContent();
    if (!contentLoaded) {
      logger.warn("コンテンツの読み込みに失敗しましたが、Observerは設定します");
    }

    // URL遷移中に別ページに移動した場合はキャンセル
    if (!isStatusPage()) {
      logger.info("アクティブ化中に別ページに遷移しました");
      return;
    }

    logger.info("statusページを検出 - アクティブ化");
    this.setupObserver();
    this.processExistingTweets();
    this.isActive = true;
    this.ui.showToast(t("activeModeToast"), 4000, "info");
  }

  /**
   * スクリプトを非アクティブ化（statusページ以外）
   */
  public deactivate(): void {
    if (!this.isActive) return;

    logger.info("statusページ以外に遷移 - 非アクティブ化");
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.ui.removeAllButtons();
    this.isActive = false;
  }

  /**
   * URL変更時の処理
   */
  public async handleUrlChange(): Promise<void> {
    if (isStatusPage()) {
      if (!this.isActive) {
        // 非アクティブ → アクティブ
        await this.activate();
      } else {
        // 別のstatusページに遷移した場合
        logger.info("別のstatusページに遷移 - コンテンツ再読み込み待機");

        // コンテンツが読み込まれるまで待機
        const contentLoaded = await waitForContent();
        if (!contentLoaded) {
          logger.warn("コンテンツの読み込みに失敗");
        }

        // Observerを再設定（新しいprimaryColumnを監視するため）
        this.setupObserver();
        this.processExistingTweets();
      }
    } else {
      // statusページ以外に遷移
      this.deactivate();
    }
  }

  /**
   * MutationObserverをセットアップ
   */
  private setupObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTORS.tweet)) {
              this.addButtonToTweet(node);
            }
            node
              .querySelectorAll<HTMLElement>(SELECTORS.tweet)
              .forEach((tweet) => {
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
        this.ui.showToast(t("processingToast"), 2000, "warning");
        return;
      }

      this.ui.setButtonProcessing(button);

      try {
        // ユーザー名を取得（表示用）
        const userNameEl = tweet.querySelector(SELECTORS.userName);
        const userName =
          userNameEl?.textContent?.match(/@[\w]+/)?.[0] ?? t("unknownUser");
        this.ui.showToast(format("reportingUser", { userName }), 0, "processing");

        const result = await this.reporter.report(tweet);

        if (result.success) {
          this.ui.setButtonDone(button);
          const stats = this.reporter.getStats();
          const message = format("successMessage", {
            blocked: String(stats.blocked),
            reported: String(stats.reported),
            userName: result.userName,
          });
          this.ui.showToast(message, 3000, "success");
        }
      } catch (error) {
        this.ui.resetButton(button);
        const errorMessage =
          error instanceof Error ? error.message : t("unknownError");
        this.ui.showToast(
          format("errorToast", { message: errorMessage }),
          4000,
          "error",
        );
      }
    });
  }

  /**
   * メニューコマンドを登録
   */
  private registerMenuCommand(): void {
    if (typeof GM_registerMenuCommand !== "undefined") {
      GM_registerMenuCommand(t("showStatsMenu"), () => {
        const stats = this.reporter.getStats();
        this.ui.showToast(
          format("statsToast", {
            blocked: String(stats.blocked),
            errors: String(stats.errors),
            reported: String(stats.reported),
          }),
          5000,
          "info",
        );
      });

      GM_registerMenuCommand(t("autoBlockOffMenu"), () => {
        this.reporter.setAutoBlock(false);
        this.ui.showToast(
          format("autoBlockState", { state: t("stateOff") }),
          2000,
          "info",
        );
      });

      GM_registerMenuCommand(t("autoBlockOnMenu"), () => {
        this.reporter.setAutoBlock(true);
        this.ui.showToast(
          format("autoBlockState", { state: t("stateOn") }),
          2000,
          "info",
        );
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
    this.ui.showToast(
      format("autoBlockState", {
        state: enabled ? t("stateOn") : t("stateOff"),
      }),
      2000,
      "info",
    );
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
    this.isActive = false;
    logger.info("クリーンアップ完了");
  }
}

/**
 * URL変更を監視するクラス（SPA対応）
 * history.pushState/replaceState のフック + setInterval によるフォールバック
 */
class UrlChangeObserver {
  private lastUrl: string;
  private callback: () => Promise<void>;
  private debounceTimer: number | null = null;
  private pollingIntervalId: number | null = null;
  private isProcessing = false;

  constructor(callback: () => Promise<void>) {
    this.lastUrl = location.href;
    this.callback = callback;
  }

  /**
   * URL変更の監視を開始
   */
  public start(): void {
    // history.pushState をフック
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleUrlChange();
    };

    // history.replaceState をフック
    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleUrlChange();
    };

    // ブラウザの「戻る」「進む」ボタンによるURL変更を検知
    window.addEventListener("popstate", () => this.handleUrlChange());

    // フォールバック: 定期的にURLをチェック
    // （一部のSPAフレームワークはhistory APIをラップしていて検知できない場合がある）
    this.pollingIntervalId = window.setInterval(() => {
      if (this.lastUrl !== location.href) {
        logger.info("ポーリングでURL変更を検出");
        this.handleUrlChange();
      }
    }, 500);
  }

  /**
   * 監視を停止
   */
  public stop(): void {
    if (this.pollingIntervalId !== null) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private handleUrlChange(): void {
    if (this.lastUrl === location.href) return;
    this.lastUrl = location.href;

    // DOMの更新を待つために少し遅延させてコールバックを実行（デバウンス）
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      // 前回のコールバックが処理中の場合はスキップ
      if (this.isProcessing) {
        logger.info("前回の処理が実行中のためスキップ");
        return;
      }
      this.isProcessing = true;
      this.callback()
        .catch((error: unknown) => {
          logger.error("URL変更コールバックでエラー:", error);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    }, 100); // デバウンス時間を短縮（コンテンツ待機は別で行うため）
  }
}

/**
 * react-rootが読み込まれるまで待機
 */
function waitForReactRoot(timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = (): void => {
      const reactRoot = document.getElementById("react-root");
      if (reactRoot) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for react-root"));
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
    logger.info("起動中...");

    // react-rootが読み込まれるまで待機
    await waitForReactRoot();
    logger.info("React root found");

    // アプリケーションを初期化
    const app = new XAutoSpamReporter();
    await app.initialize();

    // URL変更を監視
    const urlObserver = new UrlChangeObserver(async () => {
      logger.info("URL変更を検出");
      await app.handleUrlChange();
    });
    urlObserver.start();

    // グローバルに公開（デバッグ用）
    (
      window as unknown as { xAutoSpamReporter: XAutoSpamReporter }
    ).xAutoSpamReporter = app;

    logger.info("起動完了");
  } catch (error) {
    logger.error("起動エラー:", error);
  }
})();
