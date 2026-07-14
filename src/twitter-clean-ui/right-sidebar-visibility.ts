/**
 * Twitter Clean UI - 右サイドバーの早期表示制御
 *
 * X の描画前から CSS を適用できるよう、このモジュールは DOM 検出処理や
 * UI 定義に依存させない。
 */

import type { UIElementId, VisibilitySettings } from "./types";

export const RIGHT_SIDEBAR_STYLE_ELEMENT_ID =
  "twitter-clean-ui-right-sidebar-styles";

export const RIGHT_SIDEBAR_ELEMENT_IDS = [
  "rightSidebar",
  "rightSidebar_SearchBox",
  "rightSidebar_PremiumSubscribe",
  "rightSidebar_TrendsList",
  "rightSidebar_WhoToFollow",
  "rightSidebar_TodayNews",
  "rightSidebar_RelatedAccounts",
  "rightSidebar_Footer",
] as const satisfies readonly UIElementId[];

export type RightSidebarElementId = (typeof RIGHT_SIDEBAR_ELEMENT_IDS)[number];

export type RightSidebarVisibility = Pick<
  VisibilitySettings,
  RightSidebarElementId
>;

export const DEFAULT_RIGHT_SIDEBAR_VISIBILITY: RightSidebarVisibility = {
  rightSidebar: true,
  rightSidebar_SearchBox: true,
  rightSidebar_PremiumSubscribe: false,
  rightSidebar_TrendsList: true,
  rightSidebar_WhoToFollow: true,
  rightSidebar_TodayNews: true,
  rightSidebar_RelatedAccounts: true,
  rightSidebar_Footer: true,
};

export const RIGHT_SIDEBAR_SELECTORS: Record<RightSidebarElementId, string> = {
  rightSidebar: '[data-testid="sidebarColumn"]',
  rightSidebar_SearchBox:
    '[data-testid="sidebarColumn"] form[role="search"]:has([data-testid="SearchBox_Search_Input"])',
  rightSidebar_PremiumSubscribe:
    '[data-testid="sidebarColumn"] div:has(> aside a[href="/i/premium_sign_up"])',
  rightSidebar_TrendsList:
    '[data-testid="sidebarColumn"] div:has(> section [data-testid="trend"])',
  rightSidebar_WhoToFollow:
    '[data-testid="sidebarColumn"] div:has(> div > aside a[href^="/i/connect_people"])',
  rightSidebar_TodayNews:
    '[data-testid="sidebarColumn"] div:has(> [data-testid="news_sidebar"])',
  rightSidebar_RelatedAccounts:
    '[data-testid="sidebarColumn"] div:has(> div > aside [data-testid="UserCell"]):not(:has(a[href^="/i/connect_people"]))',
  rightSidebar_Footer:
    '[data-testid="sidebarColumn"] div:has(> nav[role="navigation"])',
};

export function isRightSidebarElementId(
  elementId: UIElementId,
): elementId is RightSidebarElementId {
  return RIGHT_SIDEBAR_ELEMENT_IDS.some(
    (candidateId) => candidateId === elementId,
  );
}

function isExplorePage(pathname: string): boolean {
  return pathname === "/explore" || pathname.startsWith("/explore/");
}

export function generateRightSidebarVisibilityCSS(
  visibility: RightSidebarVisibility,
  pathname: string,
): string {
  if (visibility.rightSidebar === false && !isExplorePage(pathname)) {
    return `${RIGHT_SIDEBAR_SELECTORS.rightSidebar} { display: none !important; }`;
  }

  return RIGHT_SIDEBAR_ELEMENT_IDS.filter(
    (elementId) =>
      elementId !== "rightSidebar" && visibility[elementId] === false,
  )
    .map(
      (elementId) =>
        `${RIGHT_SIDEBAR_SELECTORS[elementId]} { display: none !important; }`,
    )
    .join("\n");
}

export function applyRightSidebarVisibilityCSS(
  visibility: RightSidebarVisibility,
  pathname: string = window.location.pathname,
): void {
  let style = document.getElementById(
    RIGHT_SIDEBAR_STYLE_ELEMENT_ID,
  ) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = RIGHT_SIDEBAR_STYLE_ELEMENT_ID;
    style.type = "text/css";

    const target = document.head || document.documentElement;
    if (!target) return;
    target.appendChild(style);
  }

  style.textContent = generateRightSidebarVisibilityCSS(visibility, pathname);
}

export function clearRightSidebarVisibilityCSS(): void {
  const style = document.getElementById(RIGHT_SIDEBAR_STYLE_ELEMENT_ID);
  if (style) {
    style.textContent = "";
  }
}

export function removeRightSidebarVisibilityStyle(): void {
  document.getElementById(RIGHT_SIDEBAR_STYLE_ELEMENT_ID)?.remove();
}

/**
 * 旧バージョンのキャッシュに含まれる右サイドバー全体のルールを除去する。
 * 現在の右サイドバー設定は専用の早期 style 要素で管理する。
 */
export function stripLegacyRightSidebarVisibilityCSS(css: string): string {
  return css.replace(
    /\[data-testid="sidebarColumn"\]\s*\{(?=[^}]*display\s*:\s*none)[^}]*\}/g,
    "",
  );
}
