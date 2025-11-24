/**
 * Twitter Clean UI - メインエントリーポイント
 */

import { ElementDetector } from './element-detector';
import { ElementController } from './element-controller';
import { SettingsManager } from './settings-manager';
import { SettingsUI } from './settings-ui';
import { setLanguage, detectBrowserLanguage } from './i18n';

/**
 * アプリケーションクラス
 */
class TwitterCleanUI {
  private detector: ElementDetector;
  private controller: ElementController;
  private settingsManager: SettingsManager;
  private settingsUI: SettingsUI;
  private isInitialized: boolean = false;

  /**
   * コンストラクタ
   */
  constructor() {
    this.detector = new ElementDetector();
    this.controller = new ElementController(this.detector);
    this.settingsManager = new SettingsManager();
    this.settingsUI = new SettingsUI(this.settingsManager, this.controller);
  }

  /**
   * 初期化
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[TwitterCleanUI] Already initialized');
      return;
    }

    console.log('[TwitterCleanUI] Initializing...');

    try {
      // 言語設定
      const settings = this.settingsManager.getSettings();
      setLanguage(settings.language || detectBrowserLanguage());

      // UI要素を検出
      this.detector.detectAll();
      const stats = this.detector.getStatistics();
      console.log(`[TwitterCleanUI] Detected ${stats.detected}/${stats.total} elements`);

      // 設定を適用
      this.controller.applySettings(settings);
      console.log('[TwitterCleanUI] Settings applied');

      // UI要素の監視を開始
      this.detector.startObserving();

      // メニューコマンドを登録
      this.registerMenuCommand();

      // 広告の自動非表示（定期的にチェック）
      this.startPromotedTweetsWatcher();

      this.isInitialized = true;
      console.log('[TwitterCleanUI] Initialized successfully');
    } catch (error) {
      console.error('[TwitterCleanUI] Initialization failed:', error);
    }
  }

  /**
   * メニューコマンドを登録
   */
  private registerMenuCommand(): void {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('設定を開く', () => {
        this.settingsUI.show();
      });
    } else {
      // GM_registerMenuCommandが使えない場合は、キーボードショートカットを登録
      document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + X で設定を開く
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
          e.preventDefault();
          this.settingsUI.show();
        }
      });
      console.log('[TwitterCleanUI] Keyboard shortcut registered: Ctrl + Shift + X');
    }
  }

  /**
   * 広告ツイートの監視を開始
   */
  private startPromotedTweetsWatcher(): void {
    const settings = this.settingsManager.getSettings();
    
    if (!settings.visibility.promotedTweets) {
      // 広告を非表示にする設定の場合、定期的にチェック
      setInterval(() => {
        this.controller.hideAllPromotedTweets();
      }, 2000); // 2秒ごとにチェック
    }
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.detector.stopObserving();
    this.controller.destroy();
    this.settingsUI.destroy();
    this.isInitialized = false;
    console.log('[TwitterCleanUI] Destroyed');
  }
}

/**
 * DOMContentLoadedイベントで初期化
 */
function waitForPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
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
    console.log('[TwitterCleanUI] Starting...');

    // ページが読み込まれるまで待機
    await waitForPageLoad();
    console.log('[TwitterCleanUI] Page loaded');

    // react-rootが読み込まれるまで待機
    await waitForReactRoot();
    console.log('[TwitterCleanUI] React root found');

    // アプリケーションを初期化
    const app = new TwitterCleanUI();
    await app.initialize();

    // グローバルに公開（デバッグ用）
    (window as unknown as { twitterCleanUI: TwitterCleanUI }).twitterCleanUI = app;
  } catch (error) {
    console.error('[TwitterCleanUI] Fatal error:', error);
  }
})();

