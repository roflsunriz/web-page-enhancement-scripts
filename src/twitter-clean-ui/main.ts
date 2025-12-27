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
  private settingsWatcherInterval: ReturnType<typeof setInterval> | null = null;
  private mutationObserver: MutationObserver | null = null;
  private applySettingsDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;

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
      return;
    }

    try {
      // 設定マネージャーの初期化完了を待機
      await this.settingsManager.initialize();

      // 言語設定
      const settings = this.settingsManager.getSettings();
      setLanguage(settings.language || detectBrowserLanguage());

      // UI要素を検出
      this.detector.detectAll();

      // 設定を適用
      this.controller.applySettings(settings);

      // UI要素の監視を開始（DOM変更時に設定を再適用）
      this.startMutationObserver();

      // メニューコマンドを登録
      this.registerMenuCommand();

      // 設定の定期適用を開始（フォールバック）
      this.startSettingsWatcher();

      this.isInitialized = true;
    } catch (error) {
      console.error('[TwitterCleanUI] Initialization failed:', error);
    }
  }

  /**
   * MutationObserverを開始してDOM変更時に設定を再適用（最適化版）
   */
  private startMutationObserver(): void {
    this.mutationObserver = new MutationObserver(() => {
      // requestAnimationFrameでバッチ処理（パフォーマンス最適化）
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => {
        // デバウンス処理（500msに緩和）
        if (this.applySettingsDebounceTimer) {
          clearTimeout(this.applySettingsDebounceTimer);
        }

        this.applySettingsDebounceTimer = setTimeout(() => {
          this.detector.detectAll();
          this.controller.applySettings(this.settingsManager.getSettings());
          this.rafId = null;
        }, 500);
      });
    });

    // 監視範囲をメインコンテンツのみに限定（パフォーマンス最適化）
    // 右サイドバーは定期チェック（5秒ごと）で処理される
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');

    // メインコンテンツを監視
    if (primaryColumn) {
      this.mutationObserver.observe(primaryColumn, {
        childList: true,
        subtree: true,
      });
    } else {
      // メインコンテンツが見つからない場合はbody全体を監視（フォールバック）
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * 設定の定期適用を開始（フォールバック）
   */
  private startSettingsWatcher(): void {
    // 最初の5秒間は頻繁にチェック（初期ロード対応）
    let checkCount = 0;
    const initialInterval = setInterval(() => {
      this.detector.detectAll();
      this.controller.applySettings(this.settingsManager.getSettings());
      checkCount++;
      if (checkCount >= 10) {
        clearInterval(initialInterval);
      }
    }, 500);

    // その後は5秒ごとにチェック（SPA遷移対応、頻度を緩和）
    this.settingsWatcherInterval = setInterval(() => {
      this.detector.detectAll();
      this.controller.applySettings(this.settingsManager.getSettings());
    }, 5000);
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
    }
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    if (this.settingsWatcherInterval) {
      clearInterval(this.settingsWatcherInterval);
    }
    if (this.applySettingsDebounceTimer) {
      clearTimeout(this.applySettingsDebounceTimer);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.detector.stopObserving();
    this.controller.destroy();
    this.settingsUI.destroy();
    this.isInitialized = false;
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
    // ページが読み込まれるまで待機
    await waitForPageLoad();

    // react-rootが読み込まれるまで待機
    await waitForReactRoot();

    // アプリケーションを初期化
    const app = new TwitterCleanUI();
    await app.initialize();

    // グローバルに公開（デバッグ用）
    (window as unknown as { twitterCleanUI: TwitterCleanUI }).twitterCleanUI = app;
  } catch (error) {
    console.error('[TwitterCleanUI] Fatal error:', error);
  }
})();

