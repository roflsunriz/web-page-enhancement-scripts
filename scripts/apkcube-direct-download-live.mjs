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

async function requestProviderPage(url) {
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
  const responseText = await response.text();
  return {
    status: response.status,
    statusText: response.statusText,
    response: responseText,
    responseText,
    responseHeaders: "",
    finalUrl: response.url,
  };
}

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

async function inspectBlockedRedirect() {
  const blockedPackage = "jp.co.airfront.android.a2chMate";
  const requestedUrl = `https://apkpure.com/app/${blockedPackage}/download`;
  const canonicalUrlPattern = new RegExp(
    `^https://apkpure\\.com/[^/]+/${blockedPackage.replaceAll(".", "\\.")}/download$`,
  );
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "ja-JP",
  });
  const page = await context.newPage();
  await page.exposeFunction("__apkcubeGmRequest", requestProviderPage);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Page.enable");
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      `window.GM_xmlhttpRequest=(details)=>{let aborted=false;window.__apkcubeGmRequest(details.url).then(response=>{if(!aborted)details.onload?.(response)},error=>{if(!aborted)details.onerror?.({error:String(error)})});return{abort(){aborted=true;details.onabort?.()}}};` +
      source,
  });
  await page.goto(
    `https://play.google.com/store/apps/details?id=${blockedPackage}&hl=ja`,
    { waitUntil: "domcontentloaded", timeout: 60000 },
  );
  const host = page.locator("#apkcube-google-play-download");
  await host.waitFor({ state: "attached", timeout: 60000 });
  assert.equal(await host.getAttribute("data-destination"), "apkpure");
  const links = await host
    .locator("a")
    .evaluateAll((elements) => elements.map((element) => element.href));
  assert.deepEqual(links, [requestedUrl]);
  const history = await cdp.send("Page.getNavigationHistory");
  assert.equal(
    history.entries.some((entry) => entry.url.includes("apkcube.com")),
    false,
  );
  await host.locator("a").click();
  await page.waitForURL(canonicalUrlPattern, {
    timeout: 60000,
    waitUntil: "commit",
  });
  assert.match(page.url(), canonicalUrlPattern);
  results.push({ blockedPackage, redirectedTo: page.url() });
  await context.close();
}

try {
  await inspect(1280, 720);
  await inspect(390, 844);
  await inspectBlockedRedirect();
  console.log(JSON.stringify({ packageName, results }, null, 2));
} finally {
  await browser.close();
}
