import assert from "node:assert/strict";

import { resolveAlternativeSources } from "../src/apkcube-direct-download/alternative-sources.ts";

const packageName = process.argv[2] ?? "com.openai.chatgpt";
assert.match(
  packageName,
  /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/,
);

const request = async (url) => {
  const target = new URL(url);
  const isApkPureApi = target.hostname === "tapi.pureapk.com";
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      Accept: isApkPureApi
        ? "application/json"
        : "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      ...(isApkPureApi
        ? {
            "Ual-Access-Businessid": "projecta",
            "Ual-Access-ProjectA": JSON.stringify({
              device_info: { os_ver: "35" },
            }),
          }
        : {}),
    },
  });
  return {
    status: response.status,
    responseText: await response.text(),
    finalUrl: response.url,
  };
};

const sources = await resolveAlternativeSources(packageName, request);
assert.deepEqual(
  sources.map((source) => source.id),
  ["apkmirror", "apkpure", "uptodown"],
);
console.log(JSON.stringify({ packageName, sources }, null, 2));
