import { describe, expect, test } from "bun:test";

import {
  AD_SLOT_SELECTORS,
  HIDDEN_UI_SELECTORS,
  OFFICIAL_FEATURE_BALLOON_SELECTOR,
  PROMOTION_ROOT_SELECTORS,
} from "./selectors.ts";

describe("Yahoo!メールの広告・案内セレクター", () => {
  test("公式のLINE連携案内ルートを対象にする", () => {
    expect(PROMOTION_ROOT_SELECTORS).toContain("#ly-linkage-promotion-modal");
  });

  test("公式の全画面インタースティシャル広告ルートを対象にする", () => {
    expect(AD_SLOT_SELECTORS).toContain("#tagYadsInterstitial");
    expect(HIDDEN_UI_SELECTORS).toContain("#tagYadsInterstitial");
  });

  test("機能案内は公式BalloonのDOM契約で識別する", () => {
    expect(OFFICIAL_FEATURE_BALLOON_SELECTOR).toContain(
      'button:last-child[buttontype="bgless"]',
    );
    expect(OFFICIAL_FEATURE_BALLOON_SELECTOR).toContain(
      '[buttonopacity="[object Object]"]',
    );
    expect(OFFICIAL_FEATURE_BALLOON_SELECTOR).toContain(
      '[marginleft="auto"][marginright="0"]',
    );
  });

  test("翻訳文言や生成クラスへ依存しない", () => {
    const selectors = HIDDEN_UI_SELECTORS.join("\n");

    expect(selectors).not.toMatch(/[ぁ-んァ-ヶ一-龠]/);
    expect(selectors).not.toContain("sc-");
    expect(selectors).not.toContain("title=");
  });
});
