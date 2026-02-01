/**
 * 作品カード検出
 *
 * - 作品カード検出（複数セレクタ対応）
 * - タイトル抽出（複数セレクタ対応）
 * - workId抽出（複数パターン対応）
 * - MutationObserver（動的カード追加対応）
 *
 * 対応ページ:
 * - CF/* ページ（カード: .itemModule.list[data-workid], タイトル: .newTVtitle span）
 * - CF/shinban-* ページ（カード: .itemModule.list, タイトル: .textContainer h2 span, workId: .check input[data-workid]）
 */

import { createLogger } from "@/shared/logger";
import type { AnimeCard } from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:CardDetector");

// =============================================================================
// セレクタ定義
// =============================================================================

/**
 * 作品カードセレクタ（複数パターン対応）
 * - CF/* ページ: .itemModule.list[data-workid]
 * - shinban-* ページ: .itemModule.list（data-workidがカード要素にない）
 */
const CARD_SELECTORS = [
  ".itemModule.list[data-workid]",  // CF/* ページ
  ".itemModule.list",               // CF/shinban-* ページ（汎用）
];

/** タイトルセレクタ（カード内）- 複数パターン対応 */
const TITLE_SELECTORS = [
  ".newTVtitle span",        // CF/* ページ
  ".textContainer h2 span",  // CF/shinban-* ページ
];

/** workId取得用セレクタ（カード内）- shinban-* ページ用 */
const WORKID_INPUT_SELECTOR = ".check input[data-workid]";

/** 円形グラフセレクタ（カード内）- CF/* ページのみ */
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
 * 要素が実際に表示されているかを判定する
 * - display: none でないか
 * - visibility: hidden でないか
 * - 親要素が非表示でないか（offsetParentがnullでないか）
 * @param element 判定する要素
 * @returns 表示されていればtrue
 */
function isElementVisible(element: HTMLElement): boolean {
  // offsetParent が null の場合、要素または祖先が display: none
  // ただし body や position: fixed の要素は例外
  if (element.offsetParent === null) {
    const style = window.getComputedStyle(element);
    if (style.display === "none") return false;
    if (style.position === "fixed") return true;
    // 祖先を遡ってチェック
    let parent = element.parentElement;
    while (parent) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.display === "none") return false;
      parent = parent.parentElement;
    }
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;

  return true;
}

/**
 * ページ内の全作品カードを検出する（重複除去、非表示カード除外）
 * @returns 作品カード情報の配列
 */
export function detectAllCards(): AnimeCard[] {
  // 複数セレクタを試行してカード要素を収集
  const cardElements = new Set<HTMLElement>();
  for (const selector of CARD_SELECTORS) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => cardElements.add(el));
  }

  const cards: AnimeCard[] = [];
  const seenTitles = new Set<string>();
  const seenWorkIds = new Set<string>();
  let hiddenCount = 0;

  cardElements.forEach((element) => {
    // 非表示のカードはスキップ
    if (!isElementVisible(element)) {
      hiddenCount++;
      return;
    }

    const card = parseCardElement(element);
    if (card && !seenTitles.has(card.title) && !seenWorkIds.has(card.workId)) {
      cards.push(card);
      seenTitles.add(card.title);
      seenWorkIds.add(card.workId);
    }
  });

  logger.debug("Cards detected", { 
    total: cardElements.size,
    visible: cards.length, 
    hidden: hiddenCount 
  });
  return cards;
}

/**
 * カード要素からタイトルを抽出する（複数セレクタ対応）
 * @param element カード要素
 * @returns タイトル文字列（見つからない場合はnull）
 */
function extractTitle(element: HTMLElement): string | null {
  for (const selector of TITLE_SELECTORS) {
    const titleElement = element.querySelector<HTMLElement>(selector);
    const title = titleElement?.textContent?.trim();
    if (title) {
      return title;
    }
  }
  return null;
}

/**
 * カード要素からworkIdを抽出する（複数パターン対応）
 * - CF/* ページ: element.dataset.workid
 * - shinban-* ページ: .check input[data-workid]
 * @param element カード要素
 * @returns workId（見つからない場合はnull）
 */
function extractWorkId(element: HTMLElement): string | null {
  // パターン1: カード要素自体にdata-workidがある場合（CF/* ページ）
  const directWorkId = element.dataset["workid"];
  if (directWorkId) {
    return directWorkId;
  }

  // パターン2: .check input[data-workid]から取得（shinban-* ページ）
  const workIdInput = element.querySelector<HTMLInputElement>(WORKID_INPUT_SELECTOR);
  if (workIdInput?.dataset["workid"]) {
    return workIdInput.dataset["workid"];
  }

  return null;
}

/**
 * カード要素をパースしてAnimeCard情報を抽出する
 * @param element カード要素
 * @returns AnimeCard（パース失敗時はnull）
 */
export function parseCardElement(element: HTMLElement): AnimeCard | null {
  // 作品ID（複数パターンから取得）
  const workId = extractWorkId(element);
  if (!workId) {
    // ログはデバッグ時のみ（多くのカードでworkIdがない場合がある）
    return null;
  }

  // タイトル（複数セレクタから検索）
  const title = extractTitle(element);
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
    workId: extractWorkId(cardElement),
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
 * 要素がカードセレクタにマッチするかどうかを判定する
 * @param element 判定する要素
 * @returns いずれかのカードセレクタにマッチすればtrue
 */
function matchesCardSelector(element: HTMLElement): boolean {
  return CARD_SELECTORS.some((selector) => element.matches(selector));
}

/**
 * 要素内からカード要素を検索する
 * @param element 検索対象の親要素
 * @returns カード要素の配列
 */
function findCardElementsIn(element: HTMLElement): HTMLElement[] {
  const cards: HTMLElement[] = [];
  for (const selector of CARD_SELECTORS) {
    const found = Array.from(element.querySelectorAll<HTMLElement>(selector));
    cards.push(...found);
  }
  // 重複除去
  return [...new Set(cards)];
}

/**
 * 動的に追加されるカードを監視するObserverを作成する
 * @param callback 新しいカードが検出されたときのコールバック
 * @returns MutationObserver
 */
export function createCardObserver(callback: CardAddedCallback): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    const newCards: AnimeCard[] = [];
    const seenWorkIds = new Set<string>();

    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;

      const addedNodes = Array.from(mutation.addedNodes);
      for (const node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // バッジ関連のノードは無視（自己トリガー防止）
        if (isBadgeRelatedNode(node)) continue;

        // 追加されたノード自体がカードの場合
        if (matchesCardSelector(node)) {
          const card = parseCardElement(node);
          if (card && !isBadgeInserted(node) && !seenWorkIds.has(card.workId)) {
            newCards.push(card);
            seenWorkIds.add(card.workId);
          }
        }

        // 追加されたノードの子孫にカードがある場合
        const childCards = findCardElementsIn(node);
        childCards.forEach((cardElement) => {
          if (!isBadgeInserted(cardElement)) {
            const card = parseCardElement(cardElement);
            if (card && !seenWorkIds.has(card.workId)) {
              newCards.push(card);
              seenWorkIds.add(card.workId);
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
