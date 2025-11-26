/**
 * Twitter Clean UI - CSS静的インジェクションシステム
 * 
 * パフォーマンス最適化のため、JavaScriptでの個別スタイル操作ではなく、
 * CSS静的インジェクションで要素を制御する
 */

import type { UIElementId, Settings } from './types';
import { UI_ELEMENTS } from './constants';

/**
 * CSS静的インジェクタークラス
 */
export class CSSInjector {
  private styleElement: HTMLStyleElement;
  private currentCSS: string = '';

  /**
   * コンストラクタ
   */
  constructor() {
    this.styleElement = this.createStyleElement();
  }

  /**
   * スタイル要素を作成
   */
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = 'twitter-clean-ui-static-styles';
    style.type = 'text/css';
    document.head.appendChild(style);
    return style;
  }

  /**
   * 要素IDからCSSセレクタを生成
   */
  private generateSelector(elementId: UIElementId): string {
    const definition = UI_ELEMENTS.find((def) => def.id === elementId);
    if (!definition) return '';

    // 最初の戦略からセレクタを取得
    const firstStrategy = definition.strategies[0];
    if (!firstStrategy) return '';

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

      // 広告ツイートは特別処理（後でIntersectionObserverで処理）
      if (elementId === 'promotedTweets') {
        if (!visible) {
          // CSS :has() セレクタで広告を非表示（モダンブラウザ対応）
          rules.push(`
            article:has([data-testid="placementTracking"]):has(:is(
              [aria-label*="プロモーション"],
              [aria-label*="Promoted"],
              span:has-text("プロモーション"),
              span:has-text("Promoted")
            )) {
              display: none !important;
            }
          `.trim());
        }
        return;
      }

      // 非表示の場合のみCSSルールを追加
      if (!visible) {
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
   */
  private generateLayoutCSS(settings: Settings): string {
    const { layout } = settings;

    return `
      /* 左サイドバーの幅 */
      header[role="banner"] {
        width: ${layout.leftSidebarWidth}px !important;
        min-width: ${layout.leftSidebarWidth}px !important;
        max-width: ${layout.leftSidebarWidth}px !important;
        flex-shrink: 0 !important;
      }

      /* メインコンテンツの幅 - data-testidセレクタ */
      [data-testid="primaryColumn"] {
        width: ${layout.mainContentWidth}px !important;
        max-width: ${layout.mainContentWidth}px !important;
        min-width: ${layout.mainContentWidth}px !important;
      }

      /* メインコンテンツのパディング */
      [data-testid="primaryColumn"] > div:first-child {
        padding: ${layout.mainContentPadding}px !important;
      }

      /* タイムラインと右サイドバー間の余白 */
      [data-testid="primaryColumn"] {
        margin-right: ${layout.timelineRightPadding}px !important;
        padding-right: 0px !important;
      }
    `.trim();
  }

  /**
   * 設定を適用してCSSを更新
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

