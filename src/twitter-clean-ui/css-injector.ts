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
    if (!definition) {
      console.log(`[CSSInjector] generateSelector: No definition found for ${elementId}`);
      return '';
    }

    // 最初の戦略からセレクタを取得
    const firstStrategy = definition.strategies[0];
    if (!firstStrategy) {
      console.log(`[CSSInjector] generateSelector: No strategy found for ${elementId}`);
      return '';
    }

    let selector = '';
    switch (firstStrategy.type) {
      case 'querySelector':
      case 'querySelectorAll':
        selector = firstStrategy.selector || '';
        break;

      case 'xpath':
        // XPathは複雑なのでスキップ
        break;

      case 'custom':
        // カスタムファインダーは動的なのでスキップ
        break;

      default:
        break;
    }
    
    console.log(`[CSSInjector] generateSelector for ${elementId}: type=${firstStrategy.type}, selector=${selector}`);
    return selector;
  }

  /**
   * 表示/非表示設定からCSSを生成
   */
  private generateVisibilityCSS(settings: Settings): string {
    const rules: string[] = [];
    const { visibility } = settings;

    console.log('[CSSInjector] generateVisibilityCSS called with visibility:', visibility);
    console.log('[CSSInjector] ConnectLink value:', visibility.leftSidebar_ConnectLink, 'type:', typeof visibility.leftSidebar_ConnectLink);
    console.log('[CSSInjector] BusinessLink value:', visibility.leftSidebar_BusinessLink, 'type:', typeof visibility.leftSidebar_BusinessLink);

    Object.entries(visibility).forEach(([key, visible]) => {
      const elementId = key as UIElementId;

      // 明示的にfalseの場合のみ非表示CSSルールを追加
      // undefinedやtrueの場合は表示（CSSルールを追加しない）
      if (visible === false) {
        const selector = this.generateSelector(elementId);
        console.log(`[CSSInjector] Element ${elementId} is false, selector: ${selector}`);
        if (selector) {
          rules.push(`${selector} { display: none !important; }`);
        }
      }
    });

    console.log('[CSSInjector] Generated CSS rules:', rules);
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
        margin-right: ${layout.timelineRightPadding}px !important;
        padding-right: 0px !important;
      }

      /* 右サイドバーのチラつき防止 */
      /* Twitter/X本体のopacityアニメーションを無効化 */
      [data-testid="sidebarColumn"] {
        opacity: 1 !important;
        transition: none !important;
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

