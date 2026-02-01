/**
 * ビューポート監視
 *
 * - IntersectionObserver設定
 * - ビューポート内10件制限
 * - スクロール追従
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard } from "@/shared/types/d-anime-cf-ranking";
import { MAX_VIEWPORT_ITEMS, VIEWPORT_DEBOUNCE_MS } from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:ViewportObserver");

// =============================================================================
// 型定義
// =============================================================================

/** ビューポート内カード変更時のコールバック */
type ViewportChangeCallback = (visibleCards: AnimeCard[]) => void;

/** 監視対象カード情報 */
interface ObservedCard {
  card: AnimeCard;
  isVisible: boolean;
}

// =============================================================================
// ビューポート監視クラス
// =============================================================================

/**
 * ビューポート内のカードを監視し、表示状態が変わったら通知する
 */
export class ViewportObserver {
  private observer: IntersectionObserver | null = null;
  private observedCards: Map<HTMLElement, ObservedCard> = new Map();
  private callback: ViewportChangeCallback | null = null;
  private maxItems: number = MAX_VIEWPORT_ITEMS;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private debounceDelay = VIEWPORT_DEBOUNCE_MS;

  /**
   * 監視を開始する
   * @param callback ビューポート内カード変更時のコールバック
   * @param options オプション
   */
  start(
    callback: ViewportChangeCallback,
    options?: {
      maxItems?: number;
      rootMargin?: string;
      threshold?: number;
    }
  ): void {
    this.callback = callback;
    this.maxItems = options?.maxItems ?? MAX_VIEWPORT_ITEMS;

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null, // viewport
        rootMargin: options?.rootMargin ?? "100px", // 少し余裕を持たせる
        threshold: options?.threshold ?? 0,
      }
    );

    logger.info("Viewport observer started", { maxItems: this.maxItems });
  }

  /**
   * 監視を停止する
   */
  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.observedCards.clear();
    this.callback = null;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    logger.info("Viewport observer stopped");
  }

  /**
   * カードを監視対象に追加する
   * @param card 追加するカード
   */
  observe(card: AnimeCard): void {
    if (!this.observer) {
      logger.warn("Observer not started");
      return;
    }

    if (this.observedCards.has(card.element)) {
      return; // 既に監視中
    }

    this.observedCards.set(card.element, {
      card,
      isVisible: false,
    });

    this.observer.observe(card.element);
  }

  /**
   * 複数カードを監視対象に追加する
   * @param cards 追加するカード配列
   */
  observeAll(cards: AnimeCard[]): void {
    for (const card of cards) {
      this.observe(card);
    }
  }

  /**
   * カードを監視対象から除外する
   * @param card 除外するカード
   */
  unobserve(card: AnimeCard): void {
    if (!this.observer) return;

    this.observer.unobserve(card.element);
    this.observedCards.delete(card.element);
  }

  /**
   * 現在ビューポート内にあるカードを取得する（最大件数制限付き）
   * @returns ビューポート内のカード配列
   */
  getVisibleCards(): AnimeCard[] {
    const visibleCards: AnimeCard[] = [];

    for (const observed of this.observedCards.values()) {
      if (observed.isVisible) {
        visibleCards.push(observed.card);
      }
    }

    // DOM順にソート（上から順）
    visibleCards.sort((a, b) => {
      const rectA = a.element.getBoundingClientRect();
      const rectB = b.element.getBoundingClientRect();
      return rectA.top - rectB.top;
    });

    // 最大件数で制限
    return visibleCards.slice(0, this.maxItems);
  }

  /**
   * IntersectionObserverのコールバック
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    let hasChange = false;

    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const observed = this.observedCards.get(element);

      if (observed) {
        const wasVisible = observed.isVisible;
        observed.isVisible = entry.isIntersecting;

        if (wasVisible !== observed.isVisible) {
          hasChange = true;
        }
      }
    }

    if (hasChange) {
      this.notifyChange();
    }
  }

  /**
   * 変更をデバウンスして通知する
   */
  private notifyChange(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      if (this.callback) {
        const visibleCards = this.getVisibleCards();
        logger.debug("Viewport changed", { visibleCount: visibleCards.length });
        this.callback(visibleCards);
      }
    }, this.debounceDelay);
  }
}

/**
 * ViewportObserverのシングルトンインスタンスを作成する
 */
export function createViewportObserver(): ViewportObserver {
  return new ViewportObserver();
}
