import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const targetUrl =
  "https://nicomanga.com/manga572/monster-no-goshujin-sama-raw/chapter-c55.3i107213.html";
const prevChapterUrl =
  "https://nicomanga.com/manga572/monster-no-goshujin-sama-raw/chapter-c55.2i107212.html";
const nextChapterUrl =
  "https://nicomanga.com/manga572/monster-no-goshujin-sama-raw/chapter-c55.4i107214.html";
const imageUrls = Array.from({ length: 8 }, (_, index) => {
  const page = String(index + 1).padStart(3, "0");
  return `https://nicomanga.com/uploads/chapter-c55.3i107213/page-${page}.png`;
});
const adUrl =
  "https://nicomanga.com/uploads/PoweredBy_200px-Black_HorizLogo.png";
const coverThumbUrl =
  "https://nicomanga.com/covers/monster-no-goshujin-sama-cover.png";

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
  await runMangaViewerPartialLoadedRegression();
  await runMangaViewerSettingsRegression();
  await runMangaViewerDestroyRegression();
  await runMangaViewerShortcutRegression();
  await runImageCollectorRegression();
  console.log("NicoManga image collection regression passed");
} finally {
  await browser.close();
}

async function runMangaViewerRegression() {
  const page = await createFixturePage({ includeCoverThumb: true });
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

  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");

  const result = await page.evaluate(() => {
    const state = window.__userscriptTest;
    const viewerSources = getOpenShadowImages(".mv-page");
    const spread = getMangaViewerSpreadState();
    return {
      menuCount: state.menuCommands.length,
      settingMenuCount: state.menuCommands.filter((item) =>
        /設定|Settings/i.test(item.caption),
      ).length,
      scrollByCount: state.scrollByCount,
      xhrCount: state.xhrUrls.length,
      viewerSources,
      spread,
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
    result.spread.left?.includes("page-002.png") &&
      result.spread.right?.includes("page-001.png"),
    `manga-viewer did not render the first spread left=page-002 right=page-001: ${JSON.stringify(result.spread)}`,
  );
  assertMangaViewerImageAspect(result.spread, 640 / 960);
  assert(
    !result.viewerSources.some((src) => src.includes("PoweredBy")),
    "manga-viewer included a known invalid NicoManga ad image",
  );

  await turnMangaViewerPage(page, "next");
  await waitForMangaViewerAnimationState(page, [
    "page-002.png",
    "page-001.png",
    "page-004.png",
    "page-003.png",
  ]);
  await waitForMangaViewerSpread(page, "page-004.png", "page-003.png");

  await turnMangaViewerPage(page, "previous");
  await waitForMangaViewerAnimationState(page, [
    "page-004.png",
    "page-003.png",
    "page-002.png",
    "page-001.png",
  ]);
  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");

  await page.close();
}

async function runMangaViewerSettingsRegression() {
  const page = await createFixturePage({ includeCoverThumb: true });
  await installUserscriptHarness(page, "manga-viewer");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForMenuCommand(page, /book-style-manga-viewer 設定/);
  await page.evaluate(() => {
    const command = window.__userscriptTest.menuCommands.find((item) =>
      /book-style-manga-viewer 設定/.test(item.caption),
    );
    if (!command) {
      throw new Error("manga-viewer settings menu was not registered");
    }
    command.callback();
  });

  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("*")).some((element) =>
      element.shadowRoot?.querySelector(".ss-panel"),
    ),
  );

  const settingsResult = await page.evaluate(() => {
    const root = Array.from(document.querySelectorAll("*"))
      .map((element) => element.shadowRoot)
      .find((shadowRoot) => shadowRoot?.querySelector(".ss-panel"));
    const inputs = Array.from(
      root?.querySelectorAll("input[type='number']") ?? [],
    );
    const labels = Array.from(
      root?.querySelectorAll(".ss-rule-type") ?? [],
    ).map((element) => element.textContent ?? "");
    const firstInput = inputs[0];
    if (firstInput instanceof HTMLInputElement) {
      firstInput.value = "750";
      firstInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return {
      inputCount: inputs.length,
      labels,
      stored: window.__userscriptTest.getStoredValue(
        "manga-viewer-image-collection-delays",
      ),
    };
  });

  assert(
    settingsResult.inputCount >= 5,
    `manga-viewer delay settings inputs were missing: ${settingsResult.inputCount}`,
  );
  assert(
    settingsResult.labels.some((label) =>
      label.includes("自動起動時の高速再確認待機"),
    ),
    `manga-viewer delay settings label was missing: ${settingsResult.labels.join(", ")}`,
  );
  assert(
    settingsResult.stored?.fastLaunchRetryWaitMs === 750,
    `manga-viewer delay setting was not saved: ${JSON.stringify(settingsResult.stored)}`,
  );

  await page.close();
}

async function runMangaViewerPartialLoadedRegression() {
  const page = await createFixturePage({
    delayImagesFromPage: 4,
    includeCoverThumb: true,
  });
  await installUserscriptHarness(page, "manga-viewer");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForFixtureImagesLoaded(page, imageUrls.slice(0, 3));
  await launchMangaViewerFromMenu(page);
  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");

  const spread = await page.evaluate(() => getMangaViewerSpreadState());
  assert(
    spread.header?.includes("1 / 4"),
    `manga-viewer rendered a partial initial page count while later images were still loading: ${JSON.stringify(spread)}`,
  );
  assert(
    spread.left?.includes("page-002.png") &&
      spread.right?.includes("page-001.png"),
    `manga-viewer did not render the first full-count spread: ${JSON.stringify(spread)}`,
  );

  await page.close();
}

async function runMangaViewerShortcutRegression() {
  const page = await createFixturePage({ includeCoverThumb: true });
  await installUserscriptHarness(page, "manga-viewer");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForFixtureImagesLoaded(page);
  await launchMangaViewerFromMenu(page);
  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");
  await page.evaluate(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  await page.waitForSelector("#book-style-manga-viewer-root", {
    state: "detached",
  });

  await launchMangaViewerFromMenu(page);
  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");
  await turnMangaViewerPage(page, "previous");
  await page.waitForURL(prevChapterUrl);

  await page.close();
}

async function runMangaViewerDestroyRegression() {
  const page = await createFixturePage({ includeCoverThumb: true });
  await installUserscriptHarness(page, "manga-viewer");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await waitForFixtureImagesLoaded(page);
  await launchMangaViewerFromMenu(page);
  await waitForMangaViewerSpread(page, "page-002.png", "page-001.png");

  await page.evaluate(() => {
    window.dispatchEvent(new Event("beforeunload"));
  });
  await page.waitForSelector("#book-style-manga-viewer-root", {
    state: "detached",
  });

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

async function createFixturePage(options = {}) {
  const { delayImagesFromPage = Infinity, includeCoverThumb = false } = options;
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
    console.error(`[browser:pageerror] ${error.stack || error.message}`);
  });

  await page.route("**/*", async (route) => {
    const requestUrl = route.request().url();
    if (requestUrl === targetUrl) {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: createNicoMangaFixtureHtml({ includeCoverThumb }),
      });
      return;
    }
    if (requestUrl === prevChapterUrl || requestUrl === nextChapterUrl) {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: "<!doctype html><html><body>chapter navigation target</body></html>",
      });
      return;
    }
    if (requestUrl.endsWith(".png")) {
      const pageNumber = getFixturePageNumber(requestUrl);
      if (pageNumber !== null && pageNumber >= delayImagesFromPage) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
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

async function launchMangaViewerFromMenu(page) {
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
}

async function waitForMenuCommand(page, pattern) {
  await page.waitForFunction((source) => {
    const regexp = new RegExp(source);
    return window.__userscriptTest.menuCommands.some((item) =>
      regexp.test(item.caption),
    );
  }, pattern.source);
}

async function waitForFixtureImagesLoaded(page, expectedUrls = imageUrls) {
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

async function waitForMangaViewerSpread(
  page,
  leftPageFileName,
  rightPageFileName,
) {
  try {
    await page.waitForFunction(
      ({ leftPageFileName, rightPageFileName }) => {
        const spread = getMangaViewerSpreadState();
        return (
          spread.left?.includes(leftPageFileName) &&
          spread.right?.includes(rightPageFileName)
        );
      },
      { leftPageFileName, rightPageFileName },
    );
  } catch (error) {
    const state = await page.evaluate(() => getMangaViewerSpreadState());
    throw new Error(
      `manga-viewer spread did not become left=${leftPageFileName} right=${rightPageFileName}: ${JSON.stringify(state)}`,
      { cause: error },
    );
  }
}

async function waitForMangaViewerAnimationState(page, expectedPageFileNames) {
  const visiblePageFileNames = expectedPageFileNames.slice(-2);
  await waitForMangaViewerSpread(
    page,
    visiblePageFileNames[0],
    visiblePageFileNames[1],
  );
  await page.waitForTimeout(250);
}

async function turnMangaViewerPage(page, direction) {
  await page.evaluate(
    (key) => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key,
          bubbles: true,
          cancelable: true,
        }),
      );
    },
    direction === "next" ? "ArrowLeft" : "ArrowRight",
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
    scrollByCount: 0,
    getStoredValue: (key) => store.get(key)
  };
  window.getOpenShadowImages = (selector) => Array.from(document.querySelectorAll("*"))
    .flatMap((element) => element.shadowRoot ? Array.from(element.shadowRoot.querySelectorAll(selector)) : [])
    .map((image) => image.currentSrc || image.src)
    .filter((src) => src.includes("/uploads/"));
  window.getMangaViewerShadowRoot = () => Array.from(document.querySelectorAll("*"))
    .map((element) => element.shadowRoot)
    .find((root) => root?.querySelector(".manga-viewer-container")) || null;
  window.getMangaViewerSpreadState = () => {
    const root = window.getMangaViewerShadowRoot();
    const book = root?.querySelector(".mv-flip-book");
    const block = root?.querySelector(".stf__block");
    const bookRect = book?.getBoundingClientRect();
    const blockRect = block?.getBoundingClientRect();
    const debug = window.MangaViewer?.__pageFlipDebug ?? null;
    const spreadSelector = debug ? '[data-logical-spread-index="' + String(debug.currentSpreadIndex) + '"]' : "";
    const getSrc = (selector) => {
      const image = root?.querySelector(selector);
      return image ? image.currentSrc || image.src : null;
    };
    const getRect = (selector) => {
      const element = root?.querySelector(selector);
      const rect = element?.getBoundingClientRect();
      return rect
        ? {
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height
          }
        : null;
    };
  return {
      left: getSrc(".mv-flip-page" + spreadSelector + ".--simple.--left .mv-flip-image") || getSrc('.mv-static-page[data-page-side="left"] .mv-flip-image'),
      right: getSrc(".mv-flip-page" + spreadSelector + ".--simple.--right .mv-flip-image") || getSrc('.mv-static-page[data-page-side="right"] .mv-flip-image'),
      leftImageRect: getRect(".mv-flip-page" + spreadSelector + ".--simple.--left .mv-flip-image") || getRect('.mv-static-page[data-page-side="left"] .mv-flip-image'),
      rightImageRect: getRect(".mv-flip-page" + spreadSelector + ".--simple.--right .mv-flip-image") || getRect('.mv-static-page[data-page-side="right"] .mv-flip-image'),
      pageCount: root?.querySelectorAll(".mv-flip-page").length ?? 0,
      bookRect: bookRect ? { width: bookRect.width, height: bookRect.height } : null,
      blockRect: blockRect ? { width: blockRect.width, height: blockRect.height } : null,
      classList: Array.from(root?.querySelectorAll(".mv-flip-page") ?? []).map((element) => element.className),
      sources: Array.from(root?.querySelectorAll(".mv-flip-image") ?? []).map((image) => image.currentSrc || image.src),
      activePages: Array.from(root?.querySelectorAll(".mv-flip-page") ?? [])
        .filter((element) => getComputedStyle(element).display !== "none")
        .map((element) => {
          const image = element.querySelector(".mv-flip-image");
          const rect = element.getBoundingClientRect();
          const imageRect = image?.getBoundingClientRect();
          return {
            side: element.dataset.pageSide,
            source: image ? image.currentSrc || image.src : null,
            rect: {
              left: rect.left,
              right: rect.right,
              width: rect.width,
              height: rect.height
            },
            imageRect: imageRect
              ? {
                  left: imageRect.left,
                  right: imageRect.right,
                  width: imageRect.width,
                  height: imageRect.height
                }
              : null
          };
        }),
      activeSources: Array.from(root?.querySelectorAll(".mv-flip-page") ?? [])
        .filter((element) => getComputedStyle(element).display !== "none")
        .map((element) => {
          const image = element.querySelector(".mv-flip-image");
          return image ? image.currentSrc || image.src : null;
        })
        .filter(Boolean),
      debug,
      header: root?.querySelector(".mv-header-text")?.textContent ?? null
    };
  };

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

function createNicoMangaFixtureHtml(options = {}) {
  const { includeCoverThumb = false } = options;
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
      <nav>
        <a rel="prev" href="${prevChapterUrl}">前</a>
        <a rel="next" href="${nextChapterUrl}">次</a>
      </nav>
      ${
        includeCoverThumb
          ? `<img class="manga-cover-thumb" width="45" height="60" src="${coverThumbUrl}" alt="cover">`
          : ""
      }
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
  const isCover = url === coverThumbUrl;
  const width = isCover ? 320 : pageNumber === "ad" ? 200 : 640;
  const height = isCover ? 454 : pageNumber === "ad" ? 50 : 960;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f8fafc"/>
  <text x="24" y="56" font-family="sans-serif" font-size="32" fill="#111827">${pageNumber}</text>
</svg>`;
}

function getFixturePageNumber(url) {
  const match = /page-(\d+)/.exec(url);
  return match ? Number(match[1]) : null;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertMangaViewerImageAspect(spread, expectedAspectRatio) {
  const tolerance = 0.02;
  for (const [side, rect] of [
    ["left", spread.leftImageRect],
    ["right", spread.rightImageRect],
  ]) {
    assert(
      rect && rect.width > 0 && rect.height > 0,
      `manga-viewer ${side} image did not expose a visible image rect: ${JSON.stringify(spread)}`,
    );
    const actualAspectRatio = rect.width / rect.height;
    assert(
      Math.abs(actualAspectRatio - expectedAspectRatio) <= tolerance,
      `manga-viewer ${side} image aspect ratio was stretched: expected=${expectedAspectRatio} actual=${actualAspectRatio} rect=${JSON.stringify(rect)}`,
    );
  }
  const maxPageWidth = (spread.blockRect?.width ?? spread.bookRect?.width) / 2;
  assert(
    Number.isFinite(maxPageWidth) && maxPageWidth > 0,
    `manga-viewer did not expose a measurable book width: ${JSON.stringify(spread)}`,
  );
  for (const activePage of spread.activePages ?? []) {
    assert(
      activePage.rect.width <= maxPageWidth + 1,
      `manga-viewer active page escaped half-spread bounds: max=${maxPageWidth} page=${JSON.stringify(activePage)} spread=${JSON.stringify(spread)}`,
    );
    if (activePage.imageRect) {
      assert(
        activePage.imageRect.width <= maxPageWidth + 1,
        `manga-viewer image escaped half-spread bounds: max=${maxPageWidth} page=${JSON.stringify(activePage)} spread=${JSON.stringify(spread)}`,
      );
    }
  }
  const spineX = (spread.bookRect?.width ?? spread.blockRect?.width) / 2;
  for (const activePage of spread.activePages ?? []) {
    if (!activePage.imageRect) continue;
    const innerGap =
      activePage.side === "left"
        ? spineX - activePage.imageRect.right
        : activePage.imageRect.left - spineX;
    assert(
      Math.abs(innerGap) <= 1,
      `manga-viewer image was not aligned to the spine: gap=${innerGap} page=${JSON.stringify(activePage)} spread=${JSON.stringify(spread)}`,
    );
  }
}
