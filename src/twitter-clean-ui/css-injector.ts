/**
 * Twitter Clean UI - CSS静的インジェクションシステム
 * 
 * パフォーマンス最適化のため、JavaScriptでの個別スタイル操作ではなく、
 * CSS静的インジェクションで要素を制御する
 */

import type { UIElementId, Settings } from './types';
import { UI_ELEMENTS, CSS_CACHE_KEY } from './constants';

/**
 * 設定ページかどうかを判定
 * 「もっと見る」→「設定とプライバシー」で開かれるページは /settings/* パスを持つ
 */
function isSettingsPage(): boolean {
  const path = window.location.pathname;
  return path === '/settings' || path.startsWith('/settings/');
}

/**
 * CSS静的インジェクタークラス
 */
export class CSSInjector {
  /** 静的スタイル要素のID（早期注入と共有） */
  public static readonly STYLE_ELEMENT_ID = 'twitter-clean-ui-static-styles';

  private styleElement: HTMLStyleElement;
  private currentCSS: string = '';

  /**
   * コンストラクタ
   * 早期注入で作成済みの<style>要素があれば再利用する
   */
  constructor() {
    this.styleElement = this.findOrCreateStyleElement();
  }

  /**
   * 既存のスタイル要素を探すか、なければ新規作成
   */
  private findOrCreateStyleElement(): HTMLStyleElement {
    const existing = document.getElementById(
      CSSInjector.STYLE_ELEMENT_ID
    ) as HTMLStyleElement | null;
    if (existing) {
      return existing;
    }
    return this.createStyleElement();
  }

  /**
   * スタイル要素を新規作成
   */
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = CSSInjector.STYLE_ELEMENT_ID;
    style.type = 'text/css';
    const target = document.head || document.documentElement;
    target.appendChild(style);
    return style;
  }

  /**
   * 要素IDからCSSセレクタを生成
   */
  private generateSelector(elementId: UIElementId): string {
    const definition = UI_ELEMENTS.find((def) => def.id === elementId);
    if (!definition) {
      return '';
    }

    // 最初の戦略からセレクタを取得
    const firstStrategy = definition.strategies[0];
    if (!firstStrategy) {
      return '';
    }

    switch (firstStrategy.type) {
      case 'querySelector':
      case 'querySelectorAll':
        return firstStrategy.selector || '';

      case 'xpath':
        // XPathは複雑なのでスキップ
        return '';

      case 'custom':
        // カスタムファインダーは動的なのでスキップ
        return '';

      default:
        return '';
    }
  }

  /**
   * 表示/非表示設定からCSSを生成
   */
  private generateVisibilityCSS(settings: Settings): string {
    const rules: string[] = [];
    const { visibility } = settings;

    Object.entries(visibility).forEach(([key, visible]) => {
      const elementId = key as UIElementId;

      // 明示的にfalseの場合のみ非表示CSSルールを追加
      // undefinedやtrueの場合は表示（CSSルールを追加しない）
      if (visible === false) {
        const selector = this.generateSelector(elementId);
        if (selector) {
          rules.push(`${selector} { display: none !important; }`);
        }
      }
    });

    return rules.join('\n');
  }

  /**
   * レイアウト設定からCSSを生成
   * 設定ページ（/settings/*）では primaryColumn の幅制御をスキップする
   * （共通セレクタ使用によるレイアウト崩れ防止）
   */
  private generateLayoutCSS(settings: Settings): string {
    const { layout } = settings;

    // 設定ページではメインコンテンツ幅の制御を無効化
    const primaryColumnCSS = isSettingsPage()
      ? ''
      : `
      /* メインコンテンツの幅 - data-testidセレクタ */
      [data-testid="primaryColumn"] {
        width: ${layout.mainContentWidth}px !important;
        max-width: ${layout.mainContentWidth}px !important;
        min-width: ${layout.mainContentWidth}px !important;
        margin-right: ${layout.timelineRightPadding}px !important;
        padding-right: 0px !important;
      }`;

    return `
      ${primaryColumnCSS}

      /* 右サイドバーのチラつき防止 */
      /* Twitter/X本体のopacityアニメーションを無効化 */
      [data-testid="sidebarColumn"] {
        opacity: 1 !important;
        transition: none !important;
      }
    `.trim();
  }

  /**
   * 設定を適用してCSSを更新し、キャッシュに保存
   */
  public applySettings(settings: Settings): void {
    const visibilityCSS = this.generateVisibilityCSS(settings);
    const layoutCSS = this.generateLayoutCSS(settings);

    this.currentCSS = `
      /* === Twitter Clean UI - 静的スタイル === */
      
      /* 表示/非表示設定 */
      ${visibilityCSS}
      
      /* レイアウト設定 */
      ${layoutCSS}
    `.trim();

    this.styleElement.textContent = this.currentCSS;

    const sidebarRules = this.currentCSS.split('\n')
      .filter((line: string) => line.includes('sidebarColumn') || line.includes('sidebar'))
      .map((line: string) => line.trim())
      .filter(Boolean);
    if (sidebarRules.length > 0) {
      console.log('[CLOAK-DBG] CSSInjector: sidebar-related rules:', sidebarRules);
    }

    // FOUC防止: 次回ロード用にCSSをキャッシュ
    this.saveCSSToCache(this.currentCSS);
  }

  /**
   * CSSテキストをストレージにキャッシュ保存
   * 次回スクリプト実行時の即時注入に使用される
   */
  private saveCSSToCache(css: string): void {
    try {
      if (typeof GM_setValue !== 'undefined') {
        GM_setValue(CSS_CACHE_KEY, css);
      } else {
        localStorage.setItem(CSS_CACHE_KEY, css);
      }
    } catch {
      // キャッシュ保存失敗は無視（次回はフォールバック動作）
    }
  }

  /**
   * 現在のCSSを取得
   */
  public getCurrentCSS(): string {
    return this.currentCSS;
  }

  /**
   * すべてのスタイルをクリア
   */
  public clear(): void {
    this.styleElement.textContent = '';
    this.currentCSS = '';
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.clear();
    if (this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
  }
}

