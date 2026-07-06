import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const targetUrl =
  "https://nicomanga.com/manga572/monster-no-goshujin-sama-raw/chapter-c55.3i107213.html";
const imageUrls = Array.from({ length: 8 }, (_, index) => {
  const page = String(index + 1).padStart(3, "0");
  return `https://nicomanga.com/uploads/chapter-c55.3i107213/page-${page}.png`;
});
const adUrl =
  "https://nicomanga.com/uploads/PoweredBy_200px-Black_HorizLogo.png";

const chromePathCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
].filter((path) => typeof path === "string" && path.length > 0);

const chromePath = chromePathCandidates.find((path) => existsSync(path));
if (!chromePath) {
  throw new Error(
    `Chrome executable was not found. Checked: ${chromePathCandidates.join(", ")}`,
  );
}

const scripts = {
  system: await readFile(
    join(repoRoot, "node_modules", "systemjs", "dist", "system.min.js"),
    "utf8",
  ),
  namedRegister: await readFile(
    join(
      repoRoot,
      "node_modules",
      "systemjs",
      "dist",
      "extras",
      "named-register.min.js",
    ),
    "utf8",
  ),
  mangaViewer: await readFile(
    join(repoRoot, "dist", "manga-viewer.user.js"),
    "utf8",
  ),
  imageCollector: await readFile(
    join(repoRoot, "dist", "image-collector.user.js"),
    "utf8",
  ),
};

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  await runMangaViewerRegression();
  await runImageCollectorRegression();
  console.log("NicoManga image collection regression passed");
} finally {
  await browser.close();
}

async function runMangaViewerRegression() {
  const page = await createFixturePage();
  await installUserscriptHarness(page, "manga-viewer");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForFixtureImagesLoaded(page);
  await assertDetachedFetchWorks(page, "manga-viewer");
  await waitForMenuCommand(
    page,
    /ブック風マンガビューア起動|Launch Book-Style Manga Viewer/,
  );
  await page.evaluate(() => {
    const commands = window.__userscriptTest.menuCommands;
    const command = commands.find((item) =>
      /ブック風マンガビューア起動|Launch Book-Style Manga Viewer/.test(
        item.caption,
      ),
    );
    if (!command) {
      throw new Error("manga-viewer launch menu was not registered");
    }
    command.callback();
  });

  await page.waitForFunction(() => {
    return getOpenShadowImages(".mv-page").some((src) =>
      src.includes("page-001.png"),
    );
  });

  const result = await page.evaluate(() => {
    const state = window.__userscriptTest;
    const viewerSources = getOpenShadowImages(".mv-page");
    return {
      menuCount: state.menuCommands.length,
      settingMenuCount: state.menuCommands.filter((item) =>
        /設定|Settings/i.test(item.caption),
      ).length,
      scrollByCount: state.scrollByCount,
      xhrCount: state.xhrUrls.length,
      viewerSources,
    };
  });

  assert(
    result.menuCount >= 2,
    "manga-viewer menu commands were not registered",
  );
  assert(
    result.settingMenuCount >= 1,
    "manga-viewer settings menu was not registered",
  );
  assert(
    result.scrollByCount === 0,
    `manga-viewer used scroll scan unexpectedly: ${result.scrollByCount}`,
  );
  assert(
    result.xhrCount === 0,
    `manga-viewer duplicated image networking through GM_xmlhttpRequest: ${result.xhrCount}`,
  );
  assert(
    result.viewerSources[0]?.includes("page-002.png") &&
      result.viewerSources[1]?.includes("page-001.png"),
    `manga-viewer did not render the first spread from the first two DOM pages: ${result.viewerSources.join(", ")}`,
  );
  assert(
    !result.viewerSources.some((src) => src.includes("PoweredBy")),
    "manga-viewer included a known invalid NicoManga ad image",
  );
  await page.close();
}

async function runImageCollectorRegression() {
  const page = await createFixturePage();
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForFixtureImagesLoaded(page);
  await runUserscriptNow(page, "image-collector");
  await assertDetachedFetchWorks(page, "image-collector");
  await waitForMenuCommand(page, /起動|Launch/i);
  await page.evaluate(() => {
    const commands = window.__userscriptTest.menuCommands;
    const command = commands.find((item) => /起動|Launch/i.test(item.caption));
    if (!command) {
      throw new Error("image-collector launch menu was not registered");
    }
    command.callback();
  });

  await page.waitForFunction(() => {
    const app = window.ImageCollector2;
    return app?.uiBuilder?.imageData?.size >= 8;
  });

  const result = await page.evaluate(() => {
    const state = window.__userscriptTest;
    const imageData = Array.from(
      window.ImageCollector2.uiBuilder.imageData.keys(),
    );
    return {
      menuCount: state.menuCommands.length,
      settingMenuCount: state.menuCommands.filter((item) =>
        /設定|Settings/i.test(item.caption),
      ).length,
      scrollByCount: state.scrollByCount,
      xhrCount: state.xhrUrls.length,
      imageData,
    };
  });

  assert(
    result.menuCount >= 2,
    "image-collector menu commands were not registered",
  );
  assert(
    result.settingMenuCount >= 1,
    "image-collector settings menu was not registered",
  );
  assert(
    result.scrollByCount === 0,
    `image-collector used scroll scan unexpectedly: ${result.scrollByCount}`,
  );
  assert(
    result.imageData.length === 8,
    `image-collector collected unexpected image count: ${result.imageData.length}`,
  );
  assert(
    result.imageData.every((url, index) => url === imageUrls[index]),
    `image-collector did not preserve DOM order: ${result.imageData.join(", ")}`,
  );
  assert(
    !result.imageData.some((url) => url === adUrl),
    "image-collector included a known invalid NicoManga ad image",
  );
  assert(
    result.xhrCount === 0,
    `image-collector duplicated image networking through GM_xmlhttpRequest: ${result.xhrCount}`,
  );
  await page.close();
}

async function createFixturePage() {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error(`[browser:${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    console.error(`[browser:pageerror] ${error.message}`);
  });

  await page.route("**/*", async (route) => {
    const requestUrl = route.request().url();
    if (requestUrl === targetUrl) {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: createNicoMangaFixtureHtml(),
      });
      return;
    }
    if (requestUrl.endsWith(".png")) {
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: createFixtureImageSvg(requestUrl),
      });
      return;
    }
    await route.fulfill({ status: 204, body: "" });
  });

  await page.addInitScript(createInitHarness());
  await page.addInitScript(scripts.system);
  await page.addInitScript(scripts.namedRegister);
  return page;
}

async function installUserscriptHarness(page, scriptName) {
  const script =
    scriptName === "manga-viewer"
      ? scripts.mangaViewer
      : scripts.imageCollector;
  await page.addInitScript(script);
}

async function runUserscriptNow(page, scriptName) {
  const script =
    scriptName === "manga-viewer"
      ? scripts.mangaViewer
      : scripts.imageCollector;
  await page.addScriptTag({ content: script });
}

async function waitForMenuCommand(page, pattern) {
  await page.waitForFunction((source) => {
    const regexp = new RegExp(source);
    return window.__userscriptTest.menuCommands.some((item) =>
      regexp.test(item.caption),
    );
  }, pattern.source);
}

async function waitForFixtureImagesLoaded(page) {
  await page.waitForFunction(
    (expectedUrls) =>
      expectedUrls.every((url) => {
        const image = Array.from(document.querySelectorAll("img")).find(
          (candidate) => candidate.currentSrc === url || candidate.src === url,
        );
        return Boolean(image?.complete && image.naturalWidth > 0);
      }),
    imageUrls,
  );
}

async function assertDetachedFetchWorks(page, label) {
  const result = await page.evaluate(async () => {
    try {
      const detachedFetch = window.fetch;
      const response = await detachedFetch("/api/detached-fetch-check");
      return {
        ok: response.status === 204,
        status: response.status,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        status: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  assert(
    result.ok,
    `${label} broke detached fetch calls: status=${String(result.status)} error=${String(result.error)}`,
  );
}

function createInitHarness() {
  return `
(() => {
  const store = new Map();
  const imageRequests = new Map();
  window.__userscriptTest = {
    menuCommands: [],
    requestUrls: [],
    xhrUrls: [],
    scrollByCount: 0
  };
  window.getOpenShadowImages = (selector) => Array.from(document.querySelectorAll("*"))
    .flatMap((element) => element.shadowRoot ? Array.from(element.shadowRoot.querySelectorAll(selector)) : [])
    .map((image) => image.currentSrc || image.src)
    .filter((src) => src.includes("/uploads/"));

  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    return originalAttachShadow.call(this, { ...init, mode: "open" });
  };

  const originalScrollBy = window.scrollBy.bind(window);
  window.scrollBy = (...args) => {
    window.__userscriptTest.scrollByCount += 1;
    return originalScrollBy(...args);
  };

  const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: true,
    enumerable: originalImageSrc.enumerable,
    get() {
      return originalImageSrc.get.call(this);
    },
    set(value) {
      const url = new URL(String(value), window.location.href).href;
      if (url.includes("/uploads/")) {
        imageRequests.set(url, (imageRequests.get(url) || 0) + 1);
        window.__userscriptTest.requestUrls = Array.from(imageRequests.entries())
          .flatMap(([requestUrl, count]) => Array.from({ length: count }, () => requestUrl));
      }
      originalImageSrc.set.call(this, value);
    }
  });

  window.GM_getValue = (key, defaultValue) => {
    if (key === "manga-viewer-launch-style") return "menu-only";
    if (key === "image-collector-launch-style") return "menu-only";
    if (key === "manga-viewer-site-access-settings") {
      return { mode: "allow-all", rules: [] };
    }
    if (key === "image-collector-site-access-settings") {
      return { mode: "allow-all", rules: [] };
    }
    return store.has(key) ? store.get(key) : defaultValue;
  };
  window.GM_setValue = (key, value) => {
    store.set(key, value);
  };
  window.GM_deleteValue = (key) => {
    store.delete(key);
  };
  window.GM_registerMenuCommand = (caption, callback) => {
    window.__userscriptTest.menuCommands.push({ caption, callback });
    return window.__userscriptTest.menuCommands.length;
  };
  window.GM_addStyle = (css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
    return style;
  };
  window.GM_xmlhttpRequest = (details) => {
    window.__userscriptTest.xhrUrls.push(details.url);
    const response = {
      response: new Blob(["<svg xmlns='http://www.w3.org/2000/svg' width='640' height='960'></svg>"], { type: "image/svg+xml" }),
      responseText: "",
      status: 200,
      statusText: "OK",
      finalUrl: details.url,
      readyState: 4,
      responseHeaders: "content-type: image/svg+xml"
    };
    window.setTimeout(() => {
      details.onload?.(response);
      details.onreadystatechange?.(response);
    }, 0);
    return { abort() {} };
  };
  window.unsafeWindow = window;
})();
`;
}

function createNicoMangaFixtureHtml() {
  const imageTags = imageUrls
    .map(
      (url, index) =>
        '<img class="chapter-page" width="640" height="960" alt="page ' +
        String(index + 1) +
        '" src="' +
        url +
        '">',
    )
    .join("\\n");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Monster no Goshujin-sama Raw Chapter 55.3</title>
    <style>
      body { margin: 0; background: #101010; }
      main { width: 720px; margin: 0 auto; }
      .chapter-page { display: block; width: 640px; height: 960px; margin: 0 auto 24px; }
      .spacer { height: 1800px; }
    </style>
  </head>
  <body>
    <main id="chapter-reader">
      ${imageTags}
      <img class="advertisement" width="200" height="50" src="${adUrl}" alt="advertisement">
      <div class="spacer"></div>
    </main>
  </body>
</html>`;
}

function createFixtureImageSvg(url) {
  const match = /page-(\d+)/.exec(url);
  const pageNumber = match ? match[1] : "ad";
  const width = pageNumber === "ad" ? 200 : 640;
  const height = pageNumber === "ad" ? 50 : 960;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="56" font-family="sans-serif" font-size="32" fill="#111827">${pageNumber}</text>
</svg>`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
