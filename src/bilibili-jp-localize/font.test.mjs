import { describe, expect, test } from "bun:test";

import {
  FONT_STYLESHEET_URL,
  JAPANESE_FONT_STACK,
  getLocalizedFontCss,
} from "./font.ts";
import { TRANSLATED_ATTRIBUTE } from "./translator.ts";

describe("日本語化箇所の専用フォント", () => {
  test("Noto Sans JP を優先しOS標準フォントへフォールバックする", () => {
    expect(JAPANESE_FONT_STACK[0]).toBe("Noto Sans JP");
    expect(JAPANESE_FONT_STACK).toContain("Yu Gothic");
    expect(JAPANESE_FONT_STACK).toContain("Hiragino Kaku Gothic ProN");
    expect(JAPANESE_FONT_STACK).toContain("Meiryo");
    expect(JAPANESE_FONT_STACK[JAPANESE_FONT_STACK.length - 1]).toBe(
      "sans-serif",
    );
  });

  test("Google Fonts から Noto Sans JP を読み込む", () => {
    const url = new URL(FONT_STYLESHEET_URL);
    expect(url.hostname).toBe("fonts.googleapis.com");
    expect(FONT_STYLESHEET_URL).toContain("Noto+Sans+JP");
  });

  test("翻訳済み要素だけを対象にし!importantを使わない", () => {
    const css = getLocalizedFontCss();
    expect(css).toContain(`[${TRANSLATED_ATTRIBUTE}="translated"]`);
    expect(css).toContain('"Noto Sans JP"');
    expect(css).not.toContain("!important");
  });
});
