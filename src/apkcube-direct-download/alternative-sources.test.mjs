import { describe, expect, test } from "bun:test";

import {
  extractApkMirrorReleaseUrl,
  extractUptodownCandidateUrls,
  hasMatchingApkPurePackage,
  isMatchingUptodownDownload,
  resolveAlternativeSources,
} from "./alternative-sources.ts";
import { getApkCubePagePackageName } from "./links.ts";

const PACKAGE_NAME = "com.example.app";

describe("alternative provider parsers", () => {
  test("APKMirrorの厳密なpackage検索結果からreleaseだけを選ぶ", () => {
    const html = `Results for <span>${PACKAGE_NAME}</span>
      <a href="/apk/example/example-app/example-app-2-0-release/">2.0</a>`;
    expect(extractApkMirrorReleaseUrl(html, PACKAGE_NAME)).toBe(
      "https://www.apkmirror.com/apk/example/example-app/example-app-2-0-release/",
    );
    expect(
      extractApkMirrorReleaseUrl(
        `${html}<p>No results found matching your query</p>`,
        PACKAGE_NAME,
      ),
    ).toBeNull();
  });

  test("APKPureは利用可能な配布版とpackage IDの一致を必須にする", () => {
    const response = {
      status: 200,
      finalUrl: "https://tapi.pureapk.com/v3/get_app_his_version",
      responseText: JSON.stringify({
        version_list: [
          { package_name: PACKAGE_NAME, asset_usability: "USABLE" },
        ],
      }),
    };
    expect(hasMatchingApkPurePackage(response, PACKAGE_NAME)).toBe(true);
    expect(
      hasMatchingApkPurePackage(
        {
          ...response,
          responseText: JSON.stringify({
            version_list: [
              { package_name: "org.other.app", asset_usability: "USABLE" },
            ],
          }),
        },
        PACKAGE_NAME,
      ),
    ).toBe(false);
    expect(
      hasMatchingApkPurePackage({ ...response, status: 404 }, PACKAGE_NAME),
    ).toBe(false);
  });

  test("Uptodown候補を重複排除し、downloadページのGoogle Play IDを照合する", () => {
    const candidate = "https://example.en.uptodown.com/android";
    expect(
      extractUptodownCandidateUrls(
        `<a href="${candidate}">one</a><a href="${candidate}">two</a>`,
      ),
    ).toEqual([candidate]);
    expect(
      isMatchingUptodownDownload(
        {
          status: 200,
          finalUrl: `${candidate}/download`,
          responseText: `<span data-url="https://play.google.com/store/apps/details?id=${PACKAGE_NAME}&hl=en"></span>`,
        },
        PACKAGE_NAME,
      ),
    ).toBe(true);
    expect(
      isMatchingUptodownDownload(
        {
          status: 200,
          finalUrl: `${candidate}/download`,
          responseText: "<td>org.other.app</td>",
        },
        PACKAGE_NAME,
      ),
    ).toBe(false);
  });
});

describe("alternative provider resolution", () => {
  test("存在を確認できた3社のダウンロード導線だけを返す", async () => {
    const request = async (url) => {
      if (url.startsWith("https://www.apkmirror.com/")) {
        return {
          status: 200,
          finalUrl: url,
          responseText: `Results for ${PACKAGE_NAME}<a href="/apk/example/app/app-2-release/">release</a>`,
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
      if (url.startsWith("https://en.uptodown.com/android/search")) {
        return {
          status: 200,
          finalUrl: url,
          responseText:
            '<a href="https://example.en.uptodown.com/android">app</a>',
        };
      }
      return {
        status: 200,
        finalUrl: "https://example.en.uptodown.com/android/download",
        responseText: `<td>${PACKAGE_NAME}</td>`,
      };
    };

    expect(await resolveAlternativeSources(PACKAGE_NAME, request)).toEqual([
      {
        id: "apkmirror",
        name: "APKMirror",
        url: "https://www.apkmirror.com/apk/example/app/app-2-release/",
      },
      {
        id: "apkpure",
        name: "APKPure",
        url: `https://apkpure.com/app/${PACKAGE_NAME}/download`,
      },
      {
        id: "uptodown",
        name: "Uptodown",
        url: "https://example.en.uptodown.com/android/download",
      },
    ]);
  });

  test("該当なし・別package・404は代替として返さない", async () => {
    const request = async (url) => ({
      status: 200,
      finalUrl: url,
      responseText: url.includes("apkmirror")
        ? `${PACKAGE_NAME}<p>No results found matching your query</p>`
        : url.includes("pureapk")
          ? JSON.stringify({ version_list: [] })
          : '<a href="https://popular.en.uptodown.com/android">popular</a>',
    });
    expect(await resolveAlternativeSources(PACKAGE_NAME, request)).toEqual([]);
  });
});

describe("APKCube page package extraction", () => {
  test("query、詳細URL、Google Playリンクの順でpackage IDを取得する", () => {
    expect(
      getApkCubePagePackageName(
        `https://apkcube.com/apk-downloader?url=${PACKAGE_NAME}`,
      ),
    ).toBe(PACKAGE_NAME);
    expect(
      getApkCubePagePackageName(
        `https://apkcube.com/example/${PACKAGE_NAME}/download`,
      ),
    ).toBe(PACKAGE_NAME);
    expect(
      getApkCubePagePackageName("https://apkcube.com/apk-downloader?busy=1", [
        `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`,
      ]),
    ).toBe(PACKAGE_NAME);
  });
});
