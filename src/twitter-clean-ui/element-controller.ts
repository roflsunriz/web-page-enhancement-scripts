/**
 * Twitter Clean UI - UI要素制御システム
 */

import type { UIElementId, Settings } from './types';
import type { ElementDetector } from './element-detector';
import { CSSInjector } from './css-injector';
import { TWITTER_LAYOUT_DEFAULTS } from '@/shared/constants/twitter';

/**
 * UI要素制御クラス
 */
export class ElementController {
  private detector: ElementDetector;
  private cssInjector: CSSInjector;
  private appliedStyles: Map<UIElementId, string> = new Map();
  private hiddenElements: Set<UIElementId> = new Set();
  private styleElement: HTMLStyleElement;
  private promotedTweetsCache: WeakSet<HTMLElement> = new WeakSet();

  /**
   * コンストラクタ
   */
  constructor(detector: ElementDetector) {
    this.detector = detector;
    this.cssInjector = new CSSInjector();
    this.styleElement = this.createStyleElement();
  }

  /**
   * スタイル要素を作成（動的要素用のフォールバック）
   */
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = 'twitter-clean-ui-dynamic-styles';
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

    // CSSの!importantルールを上書きするため、setPropertyで!importantを使用
    if (originalDisplay && originalDisplay !== 'none') {
      element.style.setProperty('display', originalDisplay, 'important');
    } else {
      // revertを使用して、元のスタイルに戻す
      element.style.setProperty('display', 'revert', 'important');
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
   * すべての広告ツイートを非表示（キャッシュ機構付き）
   */
  public hideAllPromotedTweets(): void {
    const promotedTweets = this.detector.detectAllPromotedTweets();
    promotedTweets.forEach((tweet) => {
      // 既に処理済みの要素はスキップ
      if (this.promotedTweetsCache.has(tweet)) {
        return;
      }

      tweet.style.setProperty('display', 'none', 'important');
      this.promotedTweetsCache.add(tweet);
    });
  }

  /**
   * 広告ツイートのキャッシュをクリア
   */
  public clearPromotedTweetsCache(): void {
    this.promotedTweetsCache = new WeakSet();
  }

  /**
   * レイアウトを適用（XPath要素用の動的CSS）
   */
  public applyLayout(settings: Settings): void {
    const { layout } = settings;

    // XPathクラスセレクタ用の追加CSS（CSSInjectorではカバーできない部分）
    const css = `
      /* メインコンテンツの幅 - CSSクラスセレクタ（twitter-wide-layout-fixから移植） */
      ${TWITTER_LAYOUT_DEFAULTS.wideLayoutClass} {
        max-width: ${layout.mainContentWidth}px !important;
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
   * 設定を適用（CSS静的インジェクション + 動的要素処理）
   */
  public applySettings(settings: Settings): void {
    // 検出キャッシュをクリアして要素を再検出（設定変更時に確実に最新状態を取得）
    this.detector.clearCache();
    this.detector.detectAll();

    // CSS静的インジェクションで静的要素を処理（最速）
    this.cssInjector.applySettings(settings);

    // レイアウト設定を適用（XPath要素用の動的CSS）
    this.applyLayout(settings);

    // カスタムファインダー要素をJavaScriptで処理（CSS対応不可の要素）
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

      // 要素を検出してから処理（custom要素対応）
      const detected = this.detector.getDetectedElement(elementId);
      if (!detected) {
        // 未検出の場合は検出を試みる
        this.detector.detectElement(elementId);
      }

      // CSS静的インジェクションで処理できない要素のみJavaScriptで処理
      this.toggleElement(elementId, visible);
    });
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
    this.cssInjector.clear();
    this.styleElement.textContent = '';
    this.appliedStyles.clear();
    this.hiddenElements.clear();
    this.clearPromotedTweetsCache();
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
    this.cssInjector.destroy();
    if (this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
    this.appliedStyles.clear();
    this.hiddenElements.clear();
    this.clearPromotedTweetsCache();
  }
}

