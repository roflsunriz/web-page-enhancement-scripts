/**
 * Twitter Clean UI - UI要素検出システム
 */

import type { DetectedElement, UIElementId, DetectionStrategy } from './types';
import { UI_ELEMENTS } from './constants';

/**
 * UI要素検出クラス
 */
export class ElementDetector {
  private detectedElements: Map<UIElementId, DetectedElement> = new Map();
  private observer: MutationObserver | null = null;

  /**
   * コンストラクタ
   */
  constructor() {
    this.setupObserver();
  }

  /**
   * MutationObserverをセットアップ
   */
  private setupObserver(): void {
    this.observer = new MutationObserver(() => {
      // DOM変更時に再検出（デバウンス済み）
      this.detectAll();
    });
  }

  /**
   * 監視を開始
   */
  public startObserving(): void {
    if (this.observer) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * 監視を停止
   */
  public stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * 単一の検出戦略を実行
   */
  private executeStrategy(strategy: DetectionStrategy): HTMLElement | null {
    try {
      switch (strategy.type) {
        case 'querySelector': {
          if (!strategy.selector) return null;
          return document.querySelector(strategy.selector) as HTMLElement | null;
        }

        case 'querySelectorAll': {
          if (!strategy.selector) return null;
          const elements = document.querySelectorAll(strategy.selector);
          return elements.length > 0 ? (elements[0] as HTMLElement) : null;
        }

        case 'xpath': {
          if (!strategy.xpath) return null;
          const result = document.evaluate(
            strategy.xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          return result.singleNodeValue as HTMLElement | null;
        }

        case 'custom': {
          if (!strategy.finder) return null;
          return strategy.finder();
        }

        default:
          return null;
      }
    } catch (error) {
      console.warn(`[ElementDetector] Strategy failed: ${strategy.method}`, error);
      return null;
    }
  }

  /**
   * 単一の要素を検出
   */
  public detectElement(elementId: UIElementId): DetectedElement | null {
    const definition = UI_ELEMENTS.find((def) => def.id === elementId);
    if (!definition) {
      console.warn(`[ElementDetector] Definition not found: ${elementId}`);
      return null;
    }

    // 複数の戦略を試行
    for (const strategy of definition.strategies) {
      const element = this.executeStrategy(strategy);
      if (element) {
        const detected: DetectedElement = {
          id: elementId,
          element,
          method: strategy.method,
          confidence: strategy.confidence,
        };
        this.detectedElements.set(elementId, detected);
        return detected;
      }
    }

    // 検出失敗
    this.detectedElements.delete(elementId);
    return null;
  }

  /**
   * すべての要素を検出
   */
  public detectAll(): void {
    for (const definition of UI_ELEMENTS) {
      this.detectElement(definition.id);
    }
  }

  /**
   * 検出済み要素を取得
   */
  public getDetectedElement(elementId: UIElementId): DetectedElement | null {
    return this.detectedElements.get(elementId) || null;
  }

  /**
   * すべての検出済み要素を取得
   */
  public getAllDetectedElements(): Map<UIElementId, DetectedElement> {
    return new Map(this.detectedElements);
  }

  /**
   * 要素が検出されているかチェック
   */
  public isDetected(elementId: UIElementId): boolean {
    return this.detectedElements.has(elementId);
  }

  /**
   * 検出された要素の数を取得
   */
  public getDetectedCount(): number {
    return this.detectedElements.size;
  }

  /**
   * 検出統計を取得
   */
  public getStatistics(): {
    total: number;
    detected: number;
    notDetected: number;
    averageConfidence: number;
  } {
    const total = UI_ELEMENTS.length;
    const detected = this.detectedElements.size;
    const notDetected = total - detected;

    let sumConfidence = 0;
    this.detectedElements.forEach((element) => {
      sumConfidence += element.confidence;
    });

    const averageConfidence = detected > 0 ? sumConfidence / detected : 0;

    return {
      total,
      detected,
      notDetected,
      averageConfidence,
    };
  }

  /**
   * 広告ツイートをすべて検出
   */
  public detectAllPromotedTweets(): HTMLElement[] {
    const elements = document.querySelectorAll('[data-testid="placementTracking"]');
    return Array.from(elements) as HTMLElement[];
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.stopObserving();
    this.detectedElements.clear();
  }
}

