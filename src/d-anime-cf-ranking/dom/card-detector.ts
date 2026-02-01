/**
 * 作品カード検出
 *
 * - `.itemModule.list[data-workid]` 作品カード検出
 * - `.newTVtitle span` タイトル抽出
 * - MutationObserver（動的カード追加対応）
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard } from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:CardDetector");

// =============================================================================
// セレクタ定義
// =============================================================================

/** 作品カードセレクタ */
const CARD_SELECTOR = ".itemModule.list[data-workid]";

/** タイトルセレクタ（カード内） */
const TITLE_SELECTOR = ".newTVtitle span";

/** 円形グラフセレクタ（カード内） */
const CIRCLE_PROGRESS_SELECTOR = ".circleProgress";

/** チェック（ハート）セレクタ（カード内） */
const CHECK_SELECTOR = ".check";

/** 順位バッジを挿入済みかを示すdata属性 */
const BADGE_INSERTED_ATTR = "data-cf-ranking-badge";

/** 順位バッジのクラス名 */
const BADGE_CLASS = "cf-ranking-badge";

// =============================================================================
// カード検出
// =============================================================================

/**
 * ページ内の全作品カードを検出する
 * @returns 作品カード情報の配列
 */
export function detectAllCards(): AnimeCard[] {
  const cardElements = document.querySelectorAll<HTMLElement>(CARD_SELECTOR);
  const cards: AnimeCard[] = [];

  cardElements.forEach((element) => {
    const card = parseCardElement(element);
    if (card) {
      cards.push(card);
    }
  });

  logger.debug("Cards detected", { count: cards.length });
  return cards;
}

/**
 * カード要素をパースしてAnimeCard情報を抽出する
 * @param element カード要素
 * @returns AnimeCard（パース失敗時はnull）
 */
export function parseCardElement(element: HTMLElement): AnimeCard | null {
  // 作品ID
  const workId = element.dataset["workid"];
  if (!workId) {
    logger.warn("Card has no workid", { element });
    return null;
  }

  // タイトル
  const titleElement = element.querySelector<HTMLElement>(TITLE_SELECTOR);
  const title = titleElement?.textContent?.trim();
  if (!title) {
    logger.warn("Card has no title", { workId });
    return null;
  }

  // 挿入位置を特定
  const insertionPoint = findInsertionPoint(element);

  return {
    workId,
    title,
    element,
    insertionPoint,
  };
}

/**
 * 順位バッジの挿入位置を特定する
 * circleProgressの後、checkの前に挿入
 * @param cardElement カード要素
 * @returns 挿入位置の参照要素（check要素）、見つからない場合はnull
 */
export function findInsertionPoint(cardElement: HTMLElement): HTMLElement | null {
  const circleProgress = cardElement.querySelector<HTMLElement>(CIRCLE_PROGRESS_SELECTOR);
  const check = cardElement.querySelector<HTMLElement>(CHECK_SELECTOR);

  // circleProgressとcheckの両方が存在する場合、check要素を返す
  // （insertBeforeでcheck要素の前に挿入する）
  if (circleProgress && check) {
    return check;
  }

  // circleProgressのみ存在する場合、その次の兄弟要素を返す
  if (circleProgress && circleProgress.nextElementSibling) {
    return circleProgress.nextElementSibling as HTMLElement;
  }

  // checkのみ存在する場合、check要素を返す
  if (check) {
    return check;
  }

  // どちらも見つからない場合
  logger.warn("Insertion point not found", {
    workId: cardElement.dataset["workid"],
    hasCircleProgress: !!circleProgress,
    hasCheck: !!check,
  });

  return null;
}

/**
 * カードに順位バッジが挿入済みかどうかを判定する
 * @param cardElement カード要素
 * @returns 挿入済みならtrue
 */
export function isBadgeInserted(cardElement: HTMLElement): boolean {
  return cardElement.hasAttribute(BADGE_INSERTED_ATTR);
}

/**
 * カードに順位バッジ挿入済みマークを付ける
 * @param cardElement カード要素
 */
export function markBadgeInserted(cardElement: HTMLElement): void {
  cardElement.setAttribute(BADGE_INSERTED_ATTR, "true");
}

/**
 * 未処理のカードのみを抽出する
 * @param cards カード配列
 * @returns 未処理のカード配列
 */
export function filterUnprocessedCards(cards: AnimeCard[]): AnimeCard[] {
  return cards.filter((card) => !isBadgeInserted(card.element));
}

// =============================================================================
// MutationObserver
// =============================================================================

type CardAddedCallback = (cards: AnimeCard[]) => void;

/**
 * 追加されたノードがバッジ要素（またはその子孫）かどうかを判定する
 * @param node ノード
 * @returns バッジ関連のノードならtrue
 */
function isBadgeRelatedNode(node: Node): boolean {
  if (!(node instanceof HTMLElement)) return false;

  // ノード自体がバッジの場合
  if (node.classList.contains(BADGE_CLASS)) return true;

  // 親要素がバッジの場合（ツールチップなど）
  if (node.closest(`.${BADGE_CLASS}`)) return true;

  return false;
}

/**
 * 動的に追加されるカードを監視するObserverを作成する
 * @param callback 新しいカードが検出されたときのコールバック
 * @returns MutationObserver
 */
export function createCardObserver(callback: CardAddedCallback): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    const newCards: AnimeCard[] = [];

    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;

      const addedNodes = Array.from(mutation.addedNodes);
      for (const node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // バッジ関連のノードは無視（自己トリガー防止）
        if (isBadgeRelatedNode(node)) continue;

        // 追加されたノード自体がカードの場合
        if (node.matches(CARD_SELECTOR)) {
          const card = parseCardElement(node);
          if (card && !isBadgeInserted(node)) {
            newCards.push(card);
          }
        }

        // 追加されたノードの子孫にカードがある場合
        const childCards = Array.from(node.querySelectorAll<HTMLElement>(CARD_SELECTOR));
        childCards.forEach((cardElement) => {
          if (!isBadgeInserted(cardElement)) {
            const card = parseCardElement(cardElement);
            if (card) {
              newCards.push(card);
            }
          }
        });
      }
    }

    if (newCards.length > 0) {
      logger.debug("New cards detected by observer", { count: newCards.length });
      callback(newCards);
    }
  });

  return observer;
}

/**
 * カード監視を開始する
 * @param observer MutationObserver
 * @param targetElement 監視対象要素（デフォルト: document.body）
 */
export function startCardObserver(
  observer: MutationObserver,
  targetElement: Element = document.body
): void {
  observer.observe(targetElement, {
    childList: true,
    subtree: true,
  });
  logger.info("Card observer started");
}

/**
 * カード監視を停止する
 * @param observer MutationObserver
 */
export function stopCardObserver(observer: MutationObserver): void {
  observer.disconnect();
  logger.info("Card observer stopped");
}
