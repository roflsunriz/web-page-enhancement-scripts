/**
 * Twitter Clean UI - UI要素制御システム
 */

import type { UIElementId, Settings } from './types';
import type { ElementDetector } from './element-detector';
import { TWITTER_LAYOUT_DEFAULTS } from '@/shared/constants/twitter';

/**
 * UI要素制御クラス
 */
export class ElementController {
  private detector: ElementDetector;
  private appliedStyles: Map<UIElementId, string> = new Map();
  private hiddenElements: Set<UIElementId> = new Set();
  private styleElement: HTMLStyleElement;

  /**
   * コンストラクタ
   */
  constructor(detector: ElementDetector) {
    this.detector = detector;
    this.styleElement = this.createStyleElement();
  }

  /**
   * スタイル要素を作成
   */
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = 'twitter-clean-ui-styles';
    document.head.appendChild(style);
    return style;
  }

  /**
   * 要素を非表示
   */
  public hideElement(elementId: UIElementId): void {
    const detected = this.detector.getDetectedElement(elementId);
    if (!detected) return;

    const element = detected.element;
    const originalDisplay = window.getComputedStyle(element).display;

    // 元のスタイルを保存
    if (!this.appliedStyles.has(elementId)) {
      this.appliedStyles.set(elementId, originalDisplay);
    }

    // 非表示
    element.style.setProperty('display', 'none', 'important');
    this.hiddenElements.add(elementId);
  }

  /**
   * 要素を表示
   */
  public showElement(elementId: UIElementId): void {
    const detected = this.detector.getDetectedElement(elementId);
    if (!detected) return;

    const element = detected.element;
    const originalDisplay = this.appliedStyles.get(elementId);

    // 元のスタイルに戻す
    if (originalDisplay) {
      element.style.display = originalDisplay;
    } else {
      element.style.removeProperty('display');
    }

    this.hiddenElements.delete(elementId);
  }

  /**
   * 要素の表示/非表示を切り替え
   */
  public toggleElement(elementId: UIElementId, visible: boolean): void {
    if (visible) {
      this.showElement(elementId);
    } else {
      this.hideElement(elementId);
    }
  }

  /**
   * すべての広告ツイートを非表示
   */
  public hideAllPromotedTweets(): void {
    const promotedTweets = this.detector.detectAllPromotedTweets();
    promotedTweets.forEach((tweet) => {
      tweet.style.setProperty('display', 'none', 'important');
    });
  }

  /**
   * レイアウトを適用
   */
  public applyLayout(settings: Settings): void {
    const { layout } = settings;

    // 動的CSSを生成
    const css = `
      /* 左サイドバーの幅 */
      header[role="banner"] {
        width: ${layout.leftSidebarWidth}px !important;
        min-width: ${layout.leftSidebarWidth}px !important;
        max-width: ${layout.leftSidebarWidth}px !important;
        flex-shrink: 0 !important;
      }

      /* メインコンテンツの幅 - CSSクラスセレクタ（twitter-wide-layout-fixから移植） */
      ${TWITTER_LAYOUT_DEFAULTS.wideLayoutClass} {
        max-width: ${layout.mainContentWidth}px !important;
      }

      /* メインコンテンツの幅 - data-testidセレクタ */
      [data-testid="primaryColumn"] {
        width: ${layout.mainContentWidth}px !important;
        max-width: ${layout.mainContentWidth}px !important;
        min-width: ${layout.mainContentWidth}px !important;
      }

      /* 右サイドバーの幅 */
      [data-testid="sidebarColumn"] {
        width: ${layout.rightSidebarWidth}px !important;
        min-width: ${layout.rightSidebarWidth}px !important;
        max-width: ${layout.rightSidebarWidth}px !important;
        flex-shrink: 0 !important;
      }

      /* メインコンテンツのパディング */
      [data-testid="primaryColumn"] > div:first-child {
        padding: ${layout.mainContentPadding}px !important;
      }

      /* タイムラインと右サイドバー間の余白（マージンで実装） */
      [data-testid="primaryColumn"] {
        margin-right: ${layout.timelineRightPadding}px !important;
        /* パディングではなくマージンを使用することで、コンテンツ幅を維持 */
        padding-right: 0px !important;
      }

      /* カラム間の間隔 - 横並びのメインコンテナを対象 */
      main[role="main"] > div > div {
        gap: ${layout.gap}px !important;
      }

      /* 3カラムレイアウトのコンテナ（primaryColumnとsidebarColumnの親）*/
      [data-testid="primaryColumn"]  {
        /* タイムラインと右サイドバー間のマージンで間隔を実現 */
      }
    `;

    this.styleElement.textContent = css;

    // XPathベースの要素にもスタイルを適用（twitter-wide-layout-fixから移植）
    this.applyStyleByXpath(layout.mainContentWidth);
  }

  /**
   * XPathを使用して要素にスタイルを適用（twitter-wide-layout-fixから移植）
   */
  private applyStyleByXpath(width: number): void {
    const target = document.evaluate(
      TWITTER_LAYOUT_DEFAULTS.wideLayoutXPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement | null;
    if (target) {
      target.style.setProperty('max-width', `${width}px`, 'important');
    }
  }

  /**
   * 設定を適用
   */
  public applySettings(settings: Settings): void {
    // 表示/非表示設定を適用
    const { visibility } = settings;

    Object.entries(visibility).forEach(([key, visible]) => {
      const elementId = key as UIElementId;
      
      // 広告ツイートは特別処理
      if (elementId === 'promotedTweets') {
        if (!visible) {
          this.hideAllPromotedTweets();
        }
        return;
      }

      this.toggleElement(elementId, visible);
    });

    // レイアウト設定を適用
    this.applyLayout(settings);
  }

  /**
   * すべての変更をリセット
   */
  public reset(): void {
    // すべての要素を表示
    this.hiddenElements.forEach((elementId) => {
      this.showElement(elementId);
    });

    // スタイルをクリア
    this.styleElement.textContent = '';
    this.appliedStyles.clear();
    this.hiddenElements.clear();
  }

  /**
   * 要素の幅を設定
   */
  public setElementWidth(elementId: UIElementId, width: number): void {
    const detected = this.detector.getDetectedElement(elementId);
    if (!detected) return;

    detected.element.style.setProperty('width', `${width}px`, 'important');
    detected.element.style.setProperty('min-width', `${width}px`, 'important');
  }

  /**
   * 要素のパディングを設定
   */
  public setElementPadding(elementId: UIElementId, padding: number): void {
    const detected = this.detector.getDetectedElement(elementId);
    if (!detected) return;

    detected.element.style.setProperty('padding', `${padding}px`, 'important');
  }

  /**
   * 要素が非表示かチェック
   */
  public isHidden(elementId: UIElementId): boolean {
    return this.hiddenElements.has(elementId);
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.reset();
    if (this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
    this.appliedStyles.clear();
    this.hiddenElements.clear();
  }
}

