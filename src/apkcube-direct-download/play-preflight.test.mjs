import { describe, expect, test } from "bun:test";

import {
  isBlockedApkCubeDownloaderHtml,
  preflightPlayDownload,
} from "./play-preflight.ts";

const PACKAGE_NAME = "jp.co.airfront.android.a2chMate";

describe("APKCube preflight", () => {
  test("downloaderのlow-rated/blacklistedと拒否文を識別する", () => {
    expect(
      isBlockedApkCubeDownloaderHtml(
        String.raw`{"reason":"low-rated","className":"rounded-none"}`,
      ),
    ).toBe(true);
    expect(
      isBlockedApkCubeDownloaderHtml(
        String.raw`{"reason":"blacklisted","className":"rounded-sm"}`,
      ),
    ).toBe(true);
    expect(
      isBlockedApkCubeDownloaderHtml(
        "Not available for download on APKCube due to safety or copyright reasons",
      ),
    ).toBe(true);
    expect(isBlockedApkCubeDownloaderHtml('{"reason":"paid"}')).toBe(false);
  });

  test("拒否をGoogle Play上で先回りし優先配布元を返す", async () => {
    const request = async (url) => {
      if (url.startsWith("https://apkcube.com/")) {
        return {
          status: 200,
          finalUrl: url,
          responseText: String.raw`{"reason":"low-rated"}`,
        };
      }
      if (url.startsWith("https://www.apkmirror.com/")) {
        return {
          status: 200,
          finalUrl: url,
          responseText: `${PACKAGE_NAME}<a href="/apk/example/chmate/chmate-1-release/">release</a>`,
        };
      }
      if (url.startsWith("https://tapi.pureapk.com/")) {
        return {
          status: 200,
          finalUrl: url,
          responseText: JSON.stringify({
            version_list: [
              { package_name: PACKAGE_NAME, asset_usability: "USABLE" },
            ],
          }),
        };
      }
      return { status: 200, finalUrl: url, responseText: "" };
    };

    expect(await preflightPlayDownload(PACKAGE_NAME, request)).toEqual({
      kind: "blocked",
      alternative: {
        id: "apkpure",
        name: "APKPure",
        url: `https://apkpure.com/app/${PACKAGE_NAME}/download`,
      },
    });
  });

  test("通常・取得失敗・拒否だが代替なしは安全に区別する", async () => {
    expect(
      await preflightPlayDownload(PACKAGE_NAME, async (url) => ({
        status: 200,
        finalUrl: url,
        responseText: '{"reason":"ready"}',
      })),
    ).toEqual({ kind: "passthrough" });

    expect(
      await preflightPlayDownload(PACKAGE_NAME, async (url) => ({
        status: url.startsWith("https://apkcube.com/") ? 200 : 404,
        finalUrl: url,
        responseText: url.startsWith("https://apkcube.com/")
          ? String.raw`{"reason":"low-rated"}`
          : "",
      })),
    ).toEqual({ kind: "blocked", alternative: null });
  });
});
