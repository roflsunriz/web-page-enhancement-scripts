/**
 * Twitter Clean UI - UI要素制御システム
 */

import type { UIElementId, Settings } from './types';
import type { ElementDetector } from './element-detector';
import { CSSInjector } from './css-injector';
import { UI_ELEMENTS } from './constants';

/**
 * UI要素制御クラス
 */
export class ElementController {
  private detector: ElementDetector;
  private cssInjector: CSSInjector;
  private appliedStyles: Map<UIElementId, string> = new Map();
  private hiddenElements: Set<UIElementId> = new Set();
  private styleElement: HTMLStyleElement;

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
   * 要素がCSSInjectで処理可能かチェック
   */
  private canBeHandledByCSS(elementId: UIElementId): boolean {
    const definition = UI_ELEMENTS.find((def) => def.id === elementId);
    if (!definition) return false;

    const firstStrategy = definition.strategies[0];
    if (!firstStrategy) return false;

    // querySelector/querySelectorAllの要素はCSSで処理可能
    return firstStrategy.type === 'querySelector' || firstStrategy.type === 'querySelectorAll';
  }

  /**
   * 設定を適用（CSS静的インジェクション + 動的要素処理）
   */
  public applySettings(settings: Settings): void {
    // CSS静的インジェクションで静的要素を処理（最速）
    this.cssInjector.applySettings(settings);

    // 動的要素を処理（カスタムファインダーで検出される要素のみ）
    const { visibility } = settings;
    
    // すべての要素に対して表示/非表示を適用
    Object.entries(visibility).forEach(([key, visible]) => {
      const elementId = key as UIElementId;
      
      // CSSで処理できる要素はスキップ（CSSInjectorに任せる）
      if (this.canBeHandledByCSS(elementId)) {
        return;
      }
      
      // 検出された要素に対してのみ適用（カスタムファインダー要素）
      if (this.detector.isDetected(elementId)) {
        this.toggleElement(elementId, visible);
      }
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
  }
}

