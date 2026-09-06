import { describe, expect, test } from "bun:test";

import {
  AD_SLOT_SELECTORS,
  BAIT_CLASSES,
  BAIT_ID,
  BLOCKED_HOSTS,
  BLOCKED_SCRIPT_SRC_SNIPPETS,
  PROBE_MARKER,
  PROBE_PATH,
  isBaitElement,
  isBlockedHost,
  isBlockedScriptSrc,
  isDownloadPage,
  isDetailPage,
  isProbeRequest,
} from "./selectors.ts";

describe("apkcubeの探知プローブ判定", () => {
  test("公式の探知パスを識別する", () => {
    expect(PROBE_PATH).toBe("/ads/banner-ad.js");
    expect(PROBE_MARKER).toBe("__ad_probe_ok__");
    expect(isProbeRequest("/ads/banner-ad.js")).toBe(true);
    expect(isProbeRequest("https://apkcube.com/ads/banner-ad.js?x=1")).toBe(
      true,
    );
    expect(isProbeRequest("https://apkcube.com/loader.js")).toBe(false);
  });
});

describe("apkcubeの広告ホスト遮断", () => {
  test("実通信キャプチャで確認した外部ホストを対象にする", () => {
    expect(BLOCKED_HOSTS).toContain("adbpage.com");
    expect(BLOCKED_HOSTS).toContain("adexchangerapid.com");
    expect(BLOCKED_HOSTS).toContain("skecaaztypvqr.space");
    expect(BLOCKED_HOSTS).toContain("usrpubtrk.com");
  });

  test("サブドメインも遮断し無関係ホストは通す", () => {
    expect(isBlockedHost("https://adbpage.com/adblock?v=3")).toBe(true);
    expect(isBlockedHost("https://x.adexchangerapid.com/ad/czcf.php")).toBe(
      true,
    );
    expect(isBlockedHost("https://apkcube.com/ads/banner-ad.js")).toBe(false);
    expect(isBlockedHost("https://apkcube.com/api/presence")).toBe(false);
    expect(
      isBlockedHost("https://play-lh.googleusercontent.com/abc"),
    ).toBe(false);
  });

  test("同梱の広告エンジンだけを除去対象にする", () => {
    expect(BLOCKED_SCRIPT_SRC_SNIPPETS).toContain("/loader.js");
    expect(isBlockedScriptSrc("https://apkcube.com/loader.js")).toBe(true);
    expect(
      isBlockedScriptSrc("https://apkcube.com/_next/static/chunks/1529.js"),
    ).toBe(false);
    expect(isBlockedScriptSrc(null)).toBe(false);
  });
});

describe("apkcubeのbait要素保護", () => {
  test("広告スロット非表示はbaitのID・クラスに触れない", () => {
    const selectors = AD_SLOT_SELECTORS.join("\n");

    expect(selectors).not.toContain(`#${BAIT_ID}`);
    for (const className of BAIT_CLASSES) {
      const classSelector = new RegExp(
        `(^|[\\s,{>+~])\\.${className}(?![\\w-])`,
      );
      expect(selectors).not.toMatch(classSelector);
    }
    expect(selectors).not.toMatch(/[ぁ-んァ-ヶ一-龠]/);
  });

  test("bait要素をIDとクラスの組み合わせで識別する", () => {
    const bait = {
      id: BAIT_ID,
      classList: {
        contains: (token) => token === "adsbox",
      },
    };
    expect(isBaitElement(bait)).toBe(true);

    const withoutBaitClass = {
      id: BAIT_ID,
      classList: {
        contains: () => false,
      },
    };
    expect(isBaitElement(withoutBaitClass)).toBe(false);
    expect(isBaitElement({})).toBe(false);
    expect(isBaitElement(null)).toBe(false);
  });
});

describe("apkcubeのページ判定", () => {
  test("ダウンロードページ形式を識別する", () => {
    expect(isDownloadPage("/chatgpt/com.openai.chatgpt/download")).toBe(true);
    expect(isDownloadPage("/chatgpt/com.openai.chatgpt")).toBe(false);
    expect(isDownloadPage("/apps")).toBe(false);
    expect(isDownloadPage("/")).toBe(false);
  });

  test("詳細ページ形式を識別する", () => {
    expect(isDetailPage("/chatgpt/com.openai.chatgpt")).toBe(true);
    expect(isDetailPage("/chatgpt/com.openai.chatgpt/download")).toBe(false);
    expect(isDetailPage("/")).toBe(false);
  });
});
