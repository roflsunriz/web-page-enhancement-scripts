import { TRANSLATED_ATTRIBUTE } from "./translator";

/**
 * 日本語化した箇所だけに適用する専用フォント。
 * Noto Sans JP（Google Fonts）を優先し、オフラインや読み込み失敗時は
 * OS 標準の美しい日本語フォントへフォールバックする。
 */
export const JAPANESE_FONT_STACK = [
  "Noto Sans JP",
  "Hiragino Kaku Gothic ProN",
  "Hiragino Sans",
  "Yu Gothic UI",
  "Yu Gothic",
  "Meiryo",
  "MS PGothic",
  "sans-serif",
] as const;

export const FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap";

const STYLE_ID = "bilibili-jp-localize-font";
const LINK_ID = "bilibili-jp-localize-font-link";

/**
 * 日本語化済み要素だけを対象にするフォント CSS を組み立てる（純粋関数）。
 * サイト全体のフォントは変えず、`!important` は使わない。
 */
export function getLocalizedFontCss(): string {
  const stack = JAPANESE_FONT_STACK.map((name) =>
    name === "sans-serif" ? name : `"${name}"`,
  ).join(", ");
  return `[${TRANSLATED_ATTRIBUTE}="translated"] {\n  font-family: ${stack};\n}`;
}

function injectFontStylesheet(): void {
  if (document.getElementById(LINK_ID)) {
    return;
  }
  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = FONT_STYLESHEET_URL;
  document.documentElement.append(link);
}

function injectFontStyle(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = getLocalizedFontCss();
  document.documentElement.append(style);
}

/**
 * 専用フォントの読み込みと適用ルールを投入する（冪等）。
 */
export function injectLocalizedFont(): void {
  injectFontStylesheet();
  injectFontStyle();
}
