import { describe, expect, test } from "bun:test";
import { resolveCommentLoadingMode } from "./comment-loading-policy.ts";

describe("コメント読み込み方針", () => {
  test("表示設定がON/OFFどちらでも自動読み込みを選ぶ", () => {
    for (const isCommentVisible of [true, false]) {
      expect(
        resolveCommentLoadingMode({
          autoSearchEnabled: true,
          isCommentVisible,
        }),
      ).toBe("auto");
    }
  });

  test("表示設定がON/OFFどちらでも手動設定済み動画の読み込みを選ぶ", () => {
    for (const isCommentVisible of [true, false]) {
      expect(
        resolveCommentLoadingMode({
          autoSearchEnabled: false,
          isCommentVisible,
        }),
      ).toBe("manual");
    }
  });
});
