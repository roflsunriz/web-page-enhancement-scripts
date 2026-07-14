/**
 * Twitter Clean UI - メインエントリーポイント
 *
 * FOUC（Flash of Unstyled Content）防止のため、2系統のCSSを注入する:
 * - 右サイドバー: 保存設定から項目別CSSをdocument-startで同期注入
 * - その他のUI: キャッシュ済みCSSを同期注入し、初期化後に動的更新
 *
 * SPA遷移時は history API をインターセプトし、遷移先パスに合わせてCSSを即時再生成する。
 */

// 最初に評価し、保存済みの右サイドバー設定をdocument-startで適用する。
import "./startup-right-sidebar";

import { ElementDetector } from "./element-detector";
import { ElementController } from "./element-controller";
import { SettingsManager } from "./settings-manager";
import { SettingsUI } from "./settings-ui";
import { setLanguage, detectBrowserLanguage, t } from "./i18n";
import { CSS_CACHE_KEY } from "./storage-keys";
import { CSSInjector } from "./css-injector";
import { stripLegacyRightSidebarVisibilityCSS } from "./right-sidebar-visibility";
import type { Settings } from "./types";

// ─────────────────────────────────────────────────
// キャッシュ済みCSS即時注入
// 右サイドバーは専用styleで管理し、ここではそれ以外のCSSを注入する。
// ─────────────────────────────────────────────────
try {
  let cachedCSS: string | null = null;

  if (typeof GM_getValue !== "undefined") {
    cachedCSS = GM_getValue(CSS_CACHE_KEY, null) as string | null;
  } else {
    cachedCSS = localStorage.getItem(CSS_CACHE_KEY);
  }

  if (cachedCSS) {
    const style = document.createElement("style");
    style.id = CSSInjector.STYLE_ELEMENT_ID;
    style.type = "text/css";

    style.textContent = stripLegacyRightSidebarVisibilityCSS(cachedCSS);

    (document.head || document.documentElement).appendChild(style);
  }
} catch {
  // 早期注入失敗は無視（Phase 2で通常通りCSSが適用される）
}

// ─────────────────────────────────────────────────
// 以下、クラス定義・ヘルパー関数・Phase 2 初期化
// ─────────────────────────────────────────────────

/**
 * アプリケーションクラス
 */
class TwitterCleanUI {
  private detector: ElementDetector;
  private controller: ElementController;
  private settingsManager: SettingsManager;
  private settingsUI: SettingsUI;
  private isInitialized: boolean = false;
  private primaryMutationObserver: MutationObserver | null = null;
  private applySettingsDebounceTimer: ReturnType<typeof setTimeout> | null =
    null;
  private rafId: number | null = null;
  private lastUrl: string = "";
  private isApplyingSettings: boolean = false;
  private primaryObservingBody: boolean = false;

  constructor() {
    this.detector = new ElementDetector();
    this.controller = new ElementController(this.detector);
    this.settingsManager = new SettingsManager();
    this.settingsUI = new SettingsUI(this.settingsManager, this.controller);
    this.lastUrl = location.href;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.settingsManager.initialize();

      const settings = this.settingsManager.getSettings();
      setLanguage(settings.language || detectBrowserLanguage());

      this.guardedApplySettings(settings);

      this.startPrimaryMutationObserver();
      this.registerMenuCommand();
      this.setupNavigationInterception();

      this.isInitialized = true;
    } catch (error) {
      console.error("[TwitterCleanUI] Initialization failed:", error);
    }
  }

  // ─── 設定適用（ガード付き） ───

  /**
   * applySettings のガード付きラッパー。
   * 明示設定がなければ、リアルタイムプレビューで最後に実適用した設定を
   * 再利用し、OFF中の未適用変更がDOM監視経由で反映されるのを防ぐ。
   */
  private guardedApplySettings(settings?: Settings): void {
    this.isApplyingSettings = true;
    try {
      this.detector.detectAll();
      if (settings) {
        this.controller.applySettings(settings);
      } else {
        this.controller.reapplySettings();
      }
    } finally {
      this.isApplyingSettings = false;
    }
  }

  // ─── SPA遷移検知 ───

  private setupNavigationInterception(): void {
    const onNavigate = (): void => {
      const newUrl = location.href;
      if (newUrl === this.lastUrl) return;
      this.lastUrl = newUrl;
      this.handleNavigation();
    };

    const origPushState = history.pushState.bind(
      history,
    ) as typeof history.pushState;
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      origPushState(...args);
      onNavigate();
    };

    const origReplaceState = history.replaceState.bind(
      history,
    ) as typeof history.replaceState;
    history.replaceState = (
      ...args: Parameters<typeof history.replaceState>
    ) => {
      origReplaceState(...args);
      onNavigate();
    };

    window.addEventListener("popstate", () => {
      onNavigate();
    });
  }

  /**
   * SPA遷移発生時: 適用済み設定から遷移先パス用のCSSを即時再生成する。
   */
  private handleNavigation(): void {
    this.guardedApplySettings();
  }

  // ─── MutationObserver: primaryColumn ───

  private startPrimaryMutationObserver(): void {
    this.primaryMutationObserver = new MutationObserver(() => {
      if (this.isApplyingSettings) return;

      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => {
        if (this.applySettingsDebounceTimer) {
          clearTimeout(this.applySettingsDebounceTimer);
        }

        this.applySettingsDebounceTimer = setTimeout(() => {
          this.guardedApplySettings();
          this.reattachPrimaryObserverIfNeeded();
          this.rafId = null;
        }, 500);
      });
    });

    this.attachPrimaryObserver();
  }

  private attachPrimaryObserver(): void {
    if (!this.primaryMutationObserver) return;

    this.primaryMutationObserver.disconnect();

    const primaryColumn = document.querySelector(
      '[data-testid="primaryColumn"]',
    );
    const target = primaryColumn ?? document.body;
    this.primaryObservingBody = !primaryColumn;

    this.primaryMutationObserver.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * body を監視中なら primaryColumn が出現したかチェックし、あれば切り替える
   */
  private reattachPrimaryObserverIfNeeded(): void {
    if (!this.primaryObservingBody) return;
    const primaryColumn = document.querySelector(
      '[data-testid="primaryColumn"]',
    );
    if (primaryColumn) {
      this.attachPrimaryObserver();
    }
  }

  // ─── メニューコマンド ───

  private registerMenuCommand(): void {
    if (typeof GM_registerMenuCommand !== "undefined") {
      GM_registerMenuCommand(t("openSettings"), () => {
        this.settingsUI.show();
      });
    } else {
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "X") {
          e.preventDefault();
          this.settingsUI.show();
        }
      });
    }
  }

  // ─── クリーンアップ ───

  public destroy(): void {
    if (this.applySettingsDebounceTimer) {
      clearTimeout(this.applySettingsDebounceTimer);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.primaryMutationObserver) {
      this.primaryMutationObserver.disconnect();
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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
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
 * Phase 2: 通常の非同期初期化
 */
(async () => {
  try {
    await waitForPageLoad();
    await waitForReactRoot();

    const app = new TwitterCleanUI();
    await app.initialize();

    (window as unknown as { twitterCleanUI: TwitterCleanUI }).twitterCleanUI =
      app;
  } catch (error) {
    console.error("[TwitterCleanUI] Fatal error:", error);
  }
})();
