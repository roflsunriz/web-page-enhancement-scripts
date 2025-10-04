import { applyStyleByXpath } from './styler';

/**
 * DOMの変更を監視するオブザーバーを設定します。
 */
export function setupObserver(): void {
  if (!document.body) {
    window.addEventListener('DOMContentLoaded', () => setupObserver());
    return;
  }

  const observer = new MutationObserver(() => applyStyleByXpath());
  observer.observe(document.body, { childList: true, subtree: true });
}