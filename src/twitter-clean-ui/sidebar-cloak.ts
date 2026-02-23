/**
 * サイドバークローク - 即時注入モジュール
 *
 * このモジュールは他のモジュールに一切依存しない。
 * main.ts の最初の import として読み込むことで、Vite バンドル内の
 * 最初のモジュールコードとして評価され、他の全モジュール（constants,
 * element-detector, css-injector 等）よりも前にクロークが挿入される。
 *
 * これにより、document-start 実行時の最速タイミングで
 * 右サイドバーに visibility: hidden が適用される。
 */

export const SIDEBAR_CLOAK_ID = 'twitter-clean-ui-sidebar-cloak';
export const SIDEBAR_CLOAK_CSS =
  '[data-testid="sidebarColumn"] { visibility: hidden !important; }';

try {
  const style = document.createElement('style');
  style.id = SIDEBAR_CLOAK_ID;
  style.textContent = SIDEBAR_CLOAK_CSS;
  (document.head || document.documentElement).appendChild(style);
} catch {
  // Phase 2 でフォールバック
}
