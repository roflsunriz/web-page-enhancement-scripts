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
  private detectionCache: Map<string, HTMLElement | null> = new Map();
  private cacheTimestamps: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 3000; // 3秒間キャッシュ

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
   * キャッシュキーを生成
   */
  private getCacheKey(strategy: DetectionStrategy): string {
    return `${strategy.type}:${strategy.selector || strategy.xpath || strategy.method}`;
  }

  /**
   * キャッシュから要素を取得
   */
  private getFromCache(strategy: DetectionStrategy): HTMLElement | null | undefined {
    const key = this.getCacheKey(strategy);
    const timestamp = this.cacheTimestamps.get(key);

    // キャッシュが有効期限内の場合のみ返す
    if (timestamp && Date.now() - timestamp < this.CACHE_DURATION) {
      return this.detectionCache.get(key);
    }

    return undefined;
  }

  /**
   * キャッシュに要素を保存
   */
  private saveToCache(strategy: DetectionStrategy, element: HTMLElement | null): void {
    const key = this.getCacheKey(strategy);
    this.detectionCache.set(key, element);
    this.cacheTimestamps.set(key, Date.now());
  }

  /**
   * キャッシュをクリア
   */
  public clearCache(): void {
    this.detectionCache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * 単一の検出戦略を実行（キャッシュ機構付き）
   */
  private executeStrategy(strategy: DetectionStrategy): HTMLElement | null {
    // カスタムファインダー以外はキャッシュを利用
    if (strategy.type !== 'custom') {
      const cached = this.getFromCache(strategy);
      if (cached !== undefined) {
        return cached;
      }
    }

    try {
      let element: HTMLElement | null = null;

      switch (strategy.type) {
        case 'querySelector': {
          if (!strategy.selector) return null;
          element = document.querySelector(strategy.selector) as HTMLElement | null;
          break;
        }

        case 'querySelectorAll': {
          if (!strategy.selector) return null;
          const elements = document.querySelectorAll(strategy.selector);
          element = elements.length > 0 ? (elements[0] as HTMLElement) : null;
          break;
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
          element = result.singleNodeValue as HTMLElement | null;
          break;
        }

        case 'custom': {
          if (!strategy.finder) return null;
          element = strategy.finder();
          break;
        }

        default:
          return null;
      }

      // キャッシュに保存（customファインダー以外）
      if (strategy.type !== 'custom') {
        this.saveToCache(strategy, element);
      }

      return element;
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
   * 広告ツイートをすべて検出（最適化版）
   * placementTracking は動画ツイートにも使われるため、
   * 実際に広告であるかどうかを「プロモーション」「Promoted」ラベルで判定する
   */
  public detectAllPromotedTweets(): HTMLElement[] {
    const elements = Array.from(
      document.querySelectorAll('[data-testid="placementTracking"]')
    );
    const promotedTweets: HTMLElement[] = [];

    for (const element of elements) {
      // 最も近いarticleタグを取得（closest使用で高速化）
      const tweetContainer = (element as HTMLElement).closest('article');

      // ツイートコンテナ内に広告ラベルが含まれているかチェック
      if (tweetContainer) {
        // aria-label で判定（textContentより高速）
        const promotedLabel = tweetContainer.querySelector(
          '[aria-label*="プロモーション"], [aria-label*="Promoted"]'
        );

        if (promotedLabel) {
          promotedTweets.push(element as HTMLElement);
          continue;
        }

        // フォールバック: textContent で判定（重い処理）
        const textContent = tweetContainer.textContent || '';
        const isPromoted =
          textContent.includes('プロモーション') ||
          textContent.includes('Promoted') ||
          textContent.includes('広告');

        if (isPromoted) {
          promotedTweets.push(element as HTMLElement);
        }
      }
    }

    return promotedTweets;
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.stopObserving();
    this.detectedElements.clear();
    this.clearCache();
  }
}

