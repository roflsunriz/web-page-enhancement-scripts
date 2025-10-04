import { settings } from './settings';

let styleElement: HTMLStyleElement | null = null;

/**
 * 幅の値を解決し、必要に応じて 'px' を追加します。
 * @param value - 幅の値。
 * @returns 解決されたCSSの幅の値。
 */
export function resolveWidth(value: string): string {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    const fallback = settings.width.toString();
    return /^\d+(\.\d+)?$/.test(fallback) ? `${fallback}px` : fallback;
  }
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

/**
 * CSSテンプレートをレンダリングします。
 * @param cssText - CSSテンプレート文字列。
 * @param widthValue - 幅の値。
 * @returns レンダリングされたCSS文字列。
 */
function renderCss(cssText: string, widthValue: string): string {
  const resolvedWidth = resolveWidth(widthValue);
  return cssText.replace(/{{WIDTH}}/g, resolvedWidth);
}

/**
 * スタイルをページに注入または更新します。
 */
export function applyStyles(): void {
  const renderedCss = renderCss(settings.css, settings.width);
  if (styleElement) {
    styleElement.textContent = renderedCss;
  } else {
    styleElement = GM_addStyle(renderedCss);
  }
  applyStyleByXpath();
}

/**
 * XPathを使用して要素にスタイルを適用します。
 */
export function applyStyleByXpath(): void {
  const target = document.evaluate(settings.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement | null;
  if (target) {
    target.style.setProperty('max-width', resolveWidth(settings.width), 'important');
  }
}