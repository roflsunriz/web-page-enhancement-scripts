import { describe, expect, test } from "bun:test";

import {
  buildApkCubeDownloaderUrl,
  getPlayPackageName,
  isValidPackageName,
} from "./links.ts";

describe("Google Play package ID", () => {
  test("アプリ詳細URLからpackage IDだけを抽出する", () => {
    expect(
      getPlayPackageName(
        "https://play.google.com/store/apps/details?id=com.openai.chatgpt&hl=ja",
      ),
    ).toBe("com.openai.chatgpt");
    expect(
      getPlayPackageName(
        "https://play.google.com/store/apps/details?hl=ja&id=org.example_app.mobile",
      ),
    ).toBe("org.example_app.mobile");
  });

  test("詳細ページ以外と不正な値を拒否する", () => {
    expect(getPlayPackageName("https://play.google.com/store/apps")).toBeNull();
    expect(
      getPlayPackageName(
        "https://example.com/store/apps/details?id=com.openai.chatgpt",
      ),
    ).toBeNull();
    expect(
      getPlayPackageName(
        "https://play.google.com/store/apps/details?id=not-a-package",
      ),
    ).toBeNull();
    expect(getPlayPackageName("not a URL")).toBeNull();
    expect(isValidPackageName("1invalid.example")).toBe(false);
  });
});

describe("APKCube downloader URL", () => {
  test("推奨構成はpackage IDだけを渡す", () => {
    expect(
      buildApkCubeDownloaderUrl("com.openai.chatgpt", "recommended"),
    ).toBe("https://apkcube.com/apk-downloader?url=com.openai.chatgpt");
  });

  test("Universal APKSは両ARMと全言語を要求する", () => {
    expect(buildApkCubeDownloaderUrl("com.example.app", "universal")).toBe(
      "https://apkcube.com/apk-downloader?url=com.example.app&arch=universal&langs=all",
    );
  });

  test("詳細指定は公式の設定セクションを開く", () => {
    expect(buildApkCubeDownloaderUrl("com.example.app", "variants")).toBe(
      "https://apkcube.com/apk-downloader?url=com.example.app#download-options",
    );
    expect(() =>
      buildApkCubeDownloaderUrl("../../unexpected", "recommended"),
    ).toThrow();
  });
});
