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
  private intersectionObserver: IntersectionObserver | null = null;
  private applySettingsDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;
  private sidebarColumn: HTMLElement | null = null;
  private sidebarColumnOriginalOpacity: string | null = null;
  private isSidebarMasked: boolean = false;

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

      // UI要素の監視を開始（DOM変更時に設定を再適用）
      this.startMutationObserver();

      // メニューコマンドを登録
      this.registerMenuCommand();

      // 広告の自動非表示（IntersectionObserverで効率的に検出）
      this.startPromotedTweetsWatcher();

      // 設定の定期適用を開始（フォールバック）
      this.startSettingsWatcher();

      this.isInitialized = true;
      console.log('[TwitterCleanUI] Initialized successfully');
    } catch (error) {
      console.error('[TwitterCleanUI] Initialization failed:', error);
    }
  }

  /**
   * MutationObserverを開始してDOM変更時に設定を再適用（最適化版）
   */
  private startMutationObserver(): void {
    // 右サイドバーの参照を取得
    this.sidebarColumn = document.querySelector<HTMLElement>('[data-testid="sidebarColumn"]');

    this.mutationObserver = new MutationObserver((mutations) => {
      // 右サイドバー内の変更は無視（チラつきの原因となるため）
      const sidebarColumn = this.sidebarColumn || document.querySelector<HTMLElement>('[data-testid="sidebarColumn"]');
      if (sidebarColumn) {
        const isSidebarMutation = mutations.some((mutation) => {
          const target = mutation.target as Node;
          return sidebarColumn.contains(target) || target === sidebarColumn;
        });
        if (isSidebarMutation) {
          return; // 右サイドバー内の変更は無視
        }
      }

      // MutationObserverが反応した瞬間に右サイドバーをマスク（既にマスクされている場合はスキップ）
      if (!this.isSidebarMasked) {
        this.maskSidebarColumn();
      }

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
          // applySettings完了後にマスクを解除
          this.unmaskSidebarColumn();
          this.rafId = null;
        }, 500);
      });
    });

    // 監視範囲をメインコンテンツのみに限定（パフォーマンス最適化）
    // 右サイドバーは監視しない（内部のDOM変更が頻繁に発生し、チラつきの原因となるため）
    // 右サイドバーの要素はsettingsWatcherの定期チェック（5秒ごと）で処理される
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
   * 右サイドバーをマスク（opacity:0）
   */
  private maskSidebarColumn(): void {
    // サイドバーの参照を再取得（DOMが再構築される可能性があるため）
    if (!this.sidebarColumn || !document.contains(this.sidebarColumn)) {
      this.sidebarColumn = document.querySelector<HTMLElement>('[data-testid="sidebarColumn"]');
    }

    if (this.sidebarColumn && !this.isSidebarMasked) {
      // 元のopacity値を保存（初回のみ）
      if (this.sidebarColumnOriginalOpacity === null) {
        const computedStyle = window.getComputedStyle(this.sidebarColumn);
        this.sidebarColumnOriginalOpacity = computedStyle.opacity || '';
      }

      // opacity:0でマスク
      this.sidebarColumn.style.setProperty('opacity', '0', 'important');
      this.isSidebarMasked = true;
    }
  }

  /**
   * 右サイドバーのマスクを解除（opacityを元に戻す）
   */
  private unmaskSidebarColumn(): void {
    if (!this.isSidebarMasked) {
      return;
    }

    // サイドバーの参照を再取得（DOMが再構築される可能性があるため）
    if (!this.sidebarColumn || !document.contains(this.sidebarColumn)) {
      this.sidebarColumn = document.querySelector<HTMLElement>('[data-testid="sidebarColumn"]');
    }

    if (this.sidebarColumn && this.sidebarColumnOriginalOpacity !== null) {
      // 元のopacity値に戻す
      if (this.sidebarColumnOriginalOpacity === '') {
        this.sidebarColumn.style.removeProperty('opacity');
      } else {
        this.sidebarColumn.style.setProperty('opacity', this.sidebarColumnOriginalOpacity, 'important');
      }
      this.isSidebarMasked = false;
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
      console.log('[TwitterCleanUI] Keyboard shortcut registered: Ctrl + Shift + X');
    }
  }

  /**
   * 広告ツイートの監視を開始（IntersectionObserver使用）
   */
  private startPromotedTweetsWatcher(): void {
    const settings = this.settingsManager.getSettings();
    
    if (!settings.visibility.promotedTweets) {
      // IntersectionObserverで画面に表示される広告のみ処理（効率的）
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          // 画面に表示された要素のみ処理
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length > 0) {
            // requestAnimationFrameでバッチ処理
            requestAnimationFrame(() => {
              this.controller.hideAllPromotedTweets();
            });
          }
        },
        {
          root: null,
          rootMargin: '100px', // 画面外100pxまで監視
          threshold: 0.01, // 1%以上表示されたら反応
        }
      );

      // タイムライン全体を監視
      const timeline = document.querySelector('[data-testid="primaryColumn"]');
      if (timeline) {
        this.intersectionObserver.observe(timeline);
      }

      // 初回実行
      this.controller.hideAllPromotedTweets();
    }
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    // マスクを解除
    this.unmaskSidebarColumn();

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
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.detector.stopObserving();
    this.controller.destroy();
    this.settingsUI.destroy();
    this.sidebarColumn = null;
    this.sidebarColumnOriginalOpacity = null;
    this.isSidebarMasked = false;
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

