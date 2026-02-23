/**
 * Twitter Clean UI - メインエントリーポイント
 *
 * FOUC（Flash of Unstyled Content）防止のため、3フェーズでCSSを注入する:
 * Phase 0: サイドバークローク（visibility: hidden）を即座に注入
 * Phase 1: キャッシュ済みCSSを同期的に注入（即時）
 * Phase 2: 初期化完了後にCSSInjectorが同じ<style>要素を再利用して動的更新 → クローク解除
 *
 * SPA遷移時は history API をインターセプトし、遷移ごとにクローク→再適用→リビールのサイクルを実行
 */

import { ElementDetector } from './element-detector';
import { ElementController } from './element-controller';
import { SettingsManager } from './settings-manager';
import { SettingsUI } from './settings-ui';
import { setLanguage, detectBrowserLanguage } from './i18n';
import { CSS_CACHE_KEY } from './constants';
import { CSSInjector } from './css-injector';

const SIDEBAR_CLOAK_ID = 'twitter-clean-ui-sidebar-cloak';
const SIDEBAR_CLOAK_CSS = '[data-testid="sidebarColumn"] { visibility: hidden !important; }';
const SIDEBAR_REVEAL_FAILSAFE_MS = 2000;
const SIDEBAR_NAV_SETTLE_INTERVAL_MS = 100;
const SIDEBAR_NAV_SETTLE_MAX_RETRIES = 20;

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
  private primaryMutationObserver: MutationObserver | null = null;
  private sidebarMutationObserver: MutationObserver | null = null;
  private applySettingsDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;
  private sidebarDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private revealFailsafeTimer: ReturnType<typeof setTimeout> | null = null;
  private lastUrl: string = '';

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

      this.detector.detectAll();
      this.controller.applySettings(settings);

      this.startPrimaryMutationObserver();
      this.startSidebarMutationObserver();
      this.registerMenuCommand();
      this.startSettingsWatcher();
      this.setupNavigationInterception();

      this.revealSidebar();

      this.isInitialized = true;
    } catch (error) {
      console.error('[TwitterCleanUI] Initialization failed:', error);
      this.revealSidebar();
    }
  }

  // ─── サイドバークローク制御 ───

  private cloakSidebar(): void {
    let cloakEl = document.getElementById(SIDEBAR_CLOAK_ID) as HTMLStyleElement | null;
    if (!cloakEl) {
      cloakEl = document.createElement('style');
      cloakEl.id = SIDEBAR_CLOAK_ID;
      const target = document.head || document.documentElement;
      target.appendChild(cloakEl);
    }
    cloakEl.textContent = SIDEBAR_CLOAK_CSS;

    this.clearRevealFailsafe();
    this.revealFailsafeTimer = setTimeout(() => {
      this.revealSidebar();
    }, SIDEBAR_REVEAL_FAILSAFE_MS);
  }

  private revealSidebar(): void {
    this.clearRevealFailsafe();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const cloakEl = document.getElementById(SIDEBAR_CLOAK_ID);
        if (cloakEl) {
          cloakEl.textContent = '';
        }
      });
    });
  }

  private clearRevealFailsafe(): void {
    if (this.revealFailsafeTimer !== null) {
      clearTimeout(this.revealFailsafeTimer);
      this.revealFailsafeTimer = null;
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

    const origPushState = history.pushState.bind(history) as typeof history.pushState;
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      origPushState(...args);
      onNavigate();
    };

    const origReplaceState = history.replaceState.bind(history) as typeof history.replaceState;
    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      origReplaceState(...args);
      onNavigate();
    };

    window.addEventListener('popstate', () => {
      onNavigate();
    });
  }

  /**
   * SPA遷移発生時: クローク → サイドバーDOM安定待ち → 検出+適用 → リビール
   */
  private handleNavigation(): void {
    this.cloakSidebar();

    let retryCount = 0;
    const settle = (): void => {
      this.detector.detectAll();
      this.controller.applySettings(this.settingsManager.getSettings());

      const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
      const hasSidebarContent = sidebar !== null && sidebar.children.length > 0;

      if (hasSidebarContent || retryCount >= SIDEBAR_NAV_SETTLE_MAX_RETRIES) {
        this.revealSidebar();
        this.reattachSidebarObserver();
        return;
      }

      retryCount++;
      setTimeout(settle, SIDEBAR_NAV_SETTLE_INTERVAL_MS);
    };

    setTimeout(settle, SIDEBAR_NAV_SETTLE_INTERVAL_MS);
  }

  // ─── MutationObserver: primaryColumn ───

  private startPrimaryMutationObserver(): void {
    this.primaryMutationObserver = new MutationObserver(() => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }

      this.rafId = requestAnimationFrame(() => {
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

    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');

    if (primaryColumn) {
      this.primaryMutationObserver.observe(primaryColumn, {
        childList: true,
        subtree: true,
      });
    } else {
      this.primaryMutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // ─── MutationObserver: sidebarColumn ───

  private startSidebarMutationObserver(): void {
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (!sidebar) return;

    this.sidebarMutationObserver = new MutationObserver((mutations) => {
      const hasSignificantChange = mutations.some(
        (m) => m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0)
      );
      if (!hasSignificantChange) return;

      if (this.sidebarDebounceTimer) {
        clearTimeout(this.sidebarDebounceTimer);
      }

      this.sidebarDebounceTimer = setTimeout(() => {
        this.cloakSidebar();
        this.detector.detectAll();
        this.controller.applySettings(this.settingsManager.getSettings());
        this.revealSidebar();
      }, 200);
    });

    this.sidebarMutationObserver.observe(sidebar, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * SPA遷移後にサイドバーのDOMが置き換わるため、Observerを再接続する
   */
  private reattachSidebarObserver(): void {
    if (this.sidebarMutationObserver) {
      this.sidebarMutationObserver.disconnect();
      this.sidebarMutationObserver = null;
    }
    this.startSidebarMutationObserver();
  }

  // ─── 定期チェック（フォールバック） ───

  private startSettingsWatcher(): void {
    let checkCount = 0;
    const initialInterval = setInterval(() => {
      this.detector.detectAll();
      this.controller.applySettings(this.settingsManager.getSettings());
      checkCount++;
      if (checkCount >= 10) {
        clearInterval(initialInterval);
      }
    }, 500);

    this.settingsWatcherInterval = setInterval(() => {
      this.detector.detectAll();
      this.controller.applySettings(this.settingsManager.getSettings());
    }, 5000);
  }

  // ─── メニューコマンド ───

  private registerMenuCommand(): void {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('設定を開く', () => {
        this.settingsUI.show();
      });
    } else {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
          e.preventDefault();
          this.settingsUI.show();
        }
      });
    }
  }

  // ─── クリーンアップ ───

  public destroy(): void {
    if (this.settingsWatcherInterval) {
      clearInterval(this.settingsWatcherInterval);
    }
    if (this.applySettingsDebounceTimer) {
      clearTimeout(this.applySettingsDebounceTimer);
    }
    if (this.sidebarDebounceTimer) {
      clearTimeout(this.sidebarDebounceTimer);
    }
    this.clearRevealFailsafe();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.primaryMutationObserver) {
      this.primaryMutationObserver.disconnect();
    }
    if (this.sidebarMutationObserver) {
      this.sidebarMutationObserver.disconnect();
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
 * Phase 0 + Phase 1: サイドバークローク + 即時CSS注入（FOUC防止）
 *
 * @run-at document-start で実行されるため、DOM解析前にCSSを注入できる。
 *
 * Phase 0: サイドバークロークCSS（visibility: hidden）を無条件で挿入し、
 *          サイドバーが一瞬もスタイル未適用状態で表示されないようにする。
 *
 * Phase 1: 前回セッションでキャッシュされたCSSテキストを同期的に読み出し、
 *          <style>要素を即座に挿入する。
 *
 * Phase 2（初期化完了後）でCSSInjectorがPhase 1の<style>要素を再利用し、
 * 最新の設定でCSSを更新した後、クロークを解除してサイドバーを表示する。
 */
function injectEarlyCSS(): void {
  try {
    const cloakStyle = document.createElement('style');
    cloakStyle.id = SIDEBAR_CLOAK_ID;
    cloakStyle.textContent = SIDEBAR_CLOAK_CSS;
    const cloakTarget = document.head || document.documentElement;
    cloakTarget.appendChild(cloakStyle);
  } catch {
    // クローク注入失敗は無視
  }

  try {
    let cachedCSS: string | null = null;

    if (typeof GM_getValue !== 'undefined') {
      cachedCSS = GM_getValue(CSS_CACHE_KEY, null) as string | null;
    } else {
      cachedCSS = localStorage.getItem(CSS_CACHE_KEY);
    }

    if (!cachedCSS) return;

    const style = document.createElement('style');
    style.id = CSSInjector.STYLE_ELEMENT_ID;
    style.type = 'text/css';
    style.textContent = cachedCSS;

    const target = document.head || document.documentElement;
    target.appendChild(style);
  } catch {
    // 早期注入失敗は無視（Phase 2で通常通りCSSが適用される）
  }
}

// Phase 0 + Phase 1: 即座に実行（同期的・ブロッキング）
injectEarlyCSS();

/**
 * Phase 2: 通常の非同期初期化
 */
(async () => {
  try {
    await waitForPageLoad();
    await waitForReactRoot();

    const app = new TwitterCleanUI();
    await app.initialize();

    (window as unknown as { twitterCleanUI: TwitterCleanUI }).twitterCleanUI = app;
  } catch (error) {
    console.error('[TwitterCleanUI] Fatal error:', error);
    const cloakEl = document.getElementById(SIDEBAR_CLOAK_ID);
    if (cloakEl) {
      cloakEl.textContent = '';
    }
  }
})();

