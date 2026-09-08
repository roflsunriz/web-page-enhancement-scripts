import { DICTIONARY, REGEX_RULES } from "./dictionary";
import { injectLocalizedFont } from "./font";

export const TRANSLATED_ATTRIBUTE = "data-bilibili-jp-localize";
const TRANSLATED_VALUE = "translated";

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "CODE",
  "PRE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
]);

const TARGET_ATTRIBUTES = [
  "title",
  "alt",
  "aria-label",
  "placeholder",
] as const;

/**
 * UI 定型文を日本語へ変換する。該当なしは null。
 * 前後空白は無視し、動画タイトル等のユーザー投稿文には反応しない。
 */
export function translateText(raw: string): string | null {
  const text = raw.replace(/\s+/g, " ").trim();
  if (text.length === 0 || text.length > 60) {
    return null;
  }
  const exact = (DICTIONARY as Record<string, string>)[text];
  if (exact !== undefined) {
    return exact;
  }
  for (const rule of REGEX_RULES) {
    if (rule.pattern.test(text)) {
      return text.replace(rule.pattern, rule.replace);
    }
  }
  return null;
}

function markTranslated(element: Element): void {
  if (element.getAttribute(TRANSLATED_ATTRIBUTE) !== TRANSLATED_VALUE) {
    element.setAttribute(TRANSLATED_ATTRIBUTE, TRANSLATED_VALUE);
  }
}

function translateAttributes(element: Element): void {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  for (const name of TARGET_ATTRIBUTES) {
    const value = element.getAttribute(name);
    if (!value) {
      continue;
    }
    const translated = translateText(value);
    if (translated !== null && translated !== value) {
      element.setAttribute(name, translated);
      markTranslated(element);
    }
  }
}

function translateTextNode(node: Text): void {
  const translated = translateText(node.nodeValue ?? "");
  if (translated === null) {
    return;
  }
  if (node.nodeValue === translated) {
    return;
  }
  node.nodeValue = translated;
  if (node.parentElement) {
    markTranslated(node.parentElement);
  }
}

function shouldSkip(element: Element): boolean {
  return SKIP_TAGS.has(element.tagName);
}

/**
 * 指定ルート配下のテキストと対象属性を日本語化する。
 */
export function translateTree(root: ParentNode): void {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
  );
  let current = walker.nextNode();
  while (current !== null) {
    if (current.nodeType === Node.TEXT_NODE) {
      const parent = current.parentElement;
      if (parent === null || shouldSkip(parent)) {
        current = walker.nextNode();
        continue;
      }
      translateTextNode(current as Text);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as Element;
      if (shouldSkip(element)) {
        current = walker.nextNode();
        continue;
      }
      translateAttributes(element);
    }
    current = walker.nextNode();
  }
  if (root instanceof Element) {
    translateAttributes(root);
  }
}

function translateTitle(): void {
  const suffix = "_哔哩哔哩_bilibili";
  if (document.title.endsWith(suffix)) {
    document.title = `${document.title.slice(0, -suffix.length)}_ビリビリ_bilibili`;
  }
}

let scheduled = false;

function scheduleTranslate(): void {
  if (scheduled) {
    return;
  }
  scheduled = true;
  window.requestAnimationFrame(() => {
    scheduled = false;
    translateNow();
  });
}

/**
 * 現在の DOM 全体を即時に日本語化する。SPA の画面遷移直後にも使う。
 */
export function translateNow(): void {
  translateTree(document.body ?? document.documentElement);
  translateTitle();
}

/**
 * SPA 全体（body 差し替え・head の title 書き換え・遅延描画）に追従する。
 * documentElement を監視するため SPA 遷移で監視が外れることはない。
 */
export function startTranslator(): void {
  injectLocalizedFont();
  translateNow();
  if (!document.body) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        translateNow();
        observeDocument();
      },
      { once: true },
    );
    return;
  }
  observeDocument();
}

function observeDocument(): void {
  const observer = new MutationObserver((mutations) => {
    let touched = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        touched = true;
        break;
      }
      if (
        mutation.type === "characterData" ||
        (mutation.type === "attributes" &&
          TARGET_ATTRIBUTES.includes(
            mutation.attributeName as (typeof TARGET_ATTRIBUTES)[number],
          ))
      ) {
        touched = true;
        break;
      }
    }
    if (touched) {
      scheduleTranslate();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TARGET_ATTRIBUTES],
  });
}
