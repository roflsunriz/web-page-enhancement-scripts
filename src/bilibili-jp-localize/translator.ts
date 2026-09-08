import { DICTIONARY, REGEX_RULES } from "./dictionary";

export const TRANSLATED_ATTRIBUTE = "data-bilibili-jp-localize";

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
    translateTree(document.body ?? document.documentElement);
    translateTitle();
  });
}

/**
 * SPA の遅延描画に追従するため MutationObserver で再翻訳する。
 */
export function startTranslator(): void {
  translateTree(document.body ?? document.documentElement);
  translateTitle();
  if (!document.body) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        translateTree(document.body);
        translateTitle();
        observeBody();
      },
      { once: true },
    );
    return;
  }
  observeBody();
}

function observeBody(): void {
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
  const body = document.body;
  if (!body) {
    return;
  }
  observer.observe(body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TARGET_ATTRIBUTES],
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: false,
  });
}
