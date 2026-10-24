import { describe, expect, test } from "bun:test";

import {
  getPackageNameFromApksApiUrl,
  parseBlockedAvailabilityDetail,
} from "./availability-signal.ts";

describe("APKCube availability signal", () => {
  test("APKS API URLからpackage IDを取得する", () => {
    expect(
      getPackageNameFromApksApiUrl(
        "https://apkcube.com/api/apps/com.example.app/apks?fresh=1",
      ),
    ).toBe("com.example.app");
    expect(getPackageNameFromApksApiUrl("/api/apps/org.example.mobile/apks")).toBe(
      "org.example.mobile",
    );
  });

  test("安全・著作権または低評価による拒否だけを通知対象にする", () => {
    expect(
      parseBlockedAvailabilityDetail("/api/apps/com.example.app/apks", {
        error: { code: "APP_BLACKLISTED" },
      }),
    ).toEqual({
      packageName: "com.example.app",
      code: "APP_BLACKLISTED",
    });
    expect(
      parseBlockedAvailabilityDetail("/api/apps/com.example.app/apks", {
        error: { code: "LOW_RATING_BLOCKED" },
      }),
    ).toEqual({
      packageName: "com.example.app",
      code: "LOW_RATING_BLOCKED",
    });
    expect(
      parseBlockedAvailabilityDetail("/api/apps/com.example.app/apks", {
        error: { code: "APP_PAID" },
      }),
    ).toBeNull();
  });

  test("別ホスト・別API・不正入力を拒否する", () => {
    expect(
      getPackageNameFromApksApiUrl(
        "https://example.com/api/apps/com.example.app/apks",
      ),
    ).toBeNull();
    expect(getPackageNameFromApksApiUrl("/api/apps/not-a-package/apks")).toBeNull();
    expect(parseBlockedAvailabilityDetail("/api/apps/com.example.app/apks", null)).toBeNull();
  });
});
