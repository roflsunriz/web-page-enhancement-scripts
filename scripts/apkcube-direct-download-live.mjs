import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const packageName = process.argv[2] ?? "com.openai.chatgpt";
assert.match(
  packageName,
  /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/,
);

const source = await readFile(
  new URL("../dist/apkcube-direct-download.user.js", import.meta.url),
  "utf8",
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const gmStub = `window.GM_xmlhttpRequest=(details)=>{queueMicrotask(()=>details.onload?.({status:404,statusText:'Not Found',response:'',responseText:'',responseHeaders:'',finalUrl:details.url}));return{abort(){}}};`;

async function inspect(width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    locale: "ja-JP",
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const errors = [];
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  cdp.on("Runtime.exceptionThrown", (event) => {
    errors.push(
      event.exceptionDetails.exception?.description ??
        event.exceptionDetails.text,
    );
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: gmStub + source,
  });
  await page.goto(
    `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=ja`,
    { waitUntil: "domcontentloaded", timeout: 60000 },
  );
  await page.waitForSelector("#apkcube-google-play-download", {
    state: "attached",
    timeout: 30000,
  });
  const state = await page
    .locator("#apkcube-google-play-download")
    .evaluate((host) => {
      const root = host.shadowRoot;
      if (!root) throw new Error("Shadow root was not created");
      const panel = root.querySelector(".panel");
      if (!(panel instanceof HTMLElement)) {
        throw new Error("Download panel was not created");
      }
      const rect = panel.getBoundingClientRect();
      return {
        packageName: host.getAttribute("data-package-name"),
        rect: {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        },
        links: Array.from(root.querySelectorAll("a"), (link) => link.href),
      };
    });
  assert.equal(state.packageName, packageName);
  assert.ok(state.rect.left >= 0 && state.rect.right <= width);
  assert.ok(state.rect.top >= 0 && state.rect.bottom <= height);
  assert.deepEqual(state.links, [
    `https://apkcube.com/apk-downloader?url=${packageName}`,
    `https://apkcube.com/apk-downloader?url=${packageName}&arch=universal&langs=all`,
    `https://apkcube.com/apk-downloader?url=${packageName}#download-options`,
  ]);
  assert.deepEqual(errors, []);
  results.push({ width, height, title: await page.title(), ...state });
  await context.close();
}

try {
  await inspect(1280, 720);
  await inspect(390, 844);
  console.log(JSON.stringify({ packageName, results }, null, 2));
} finally {
  await browser.close();
}
