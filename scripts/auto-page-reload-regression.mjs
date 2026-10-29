import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/auto-page-reload.user.js", import.meta.url),
  "utf8",
);
const matches = [...source.matchAll(/^\/\/ @match\s+(\S+)/gm)].map((m) => m[1]);
assert.deepEqual(matches.sort(), [
  "https://abliteration.ai/*",
  "https://www.amazon.co.jp/*",
]);
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext();
  await context.route("https://**/*", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>fixture</title>",
    }),
  );
  await context.addInitScript(
    ({ source, matches }) => {
      // Simulate userscript-manager injection only when the initial URL matches metadata.
      if (
        !matches.some((pattern) =>
          location.href.startsWith(pattern.slice(0, -1)),
        )
      )
        return;
      window.fakeNow = 0;
      Date.now = () => window.fakeNow;
      window.setInterval = (callback) => {
        window.tick = callback;
        return 1;
      };
      window.GM_getValue = (_key, fallback) =>
        JSON.parse(
          localStorage.getItem("interval") ?? JSON.stringify(fallback),
        );
      window.GM_setValue = (_key, value) =>
        localStorage.setItem("interval", JSON.stringify(value));
      window.GM_registerMenuCommand = (_label, callback) => {
        window.menu = callback;
      };
      window.prompt = () => window.answer;
      window.alert = () => {
        window.invalid = true;
      };
      eval(source);
    },
    { source, matches },
  );
  const page = await context.newPage();
  const countdown = () =>
    page.evaluate(
      () =>
        document
          .querySelector("[data-auto-page-reload-countdown]")
          ?.shadowRoot?.querySelector('[role="timer"]')?.textContent ?? null,
    );
  let loads = 0;
  page.on("load", () => {
    loads += 1;
  });
  await page.goto("https://example.invalid/");
  assert.equal(await page.evaluate(() => typeof window.tick), "undefined");
  for (const [initial, target] of [
    ["https://abliteration.ai/home", "/console/billing"],
    ["https://abliteration.ai/settings", "/console/activity"],
    [
      "https://www.amazon.co.jp/your-orders/orders",
      "/progress-tracker/package?orderId=fixture",
    ],
  ]) {
    await page.goto(initial);
    const initialLoads = loads;
    await page.evaluate(() => {
      window.fakeNow = 90000;
      window.tick();
    });
    assert.equal(page.url(), initial);
    assert.equal(await countdown(), null);
    await page.evaluate((target) => {
      history.pushState({}, "", target);
      window.tick();
    }, target);
    assert.match(await countdown(), /60/);
    await page.evaluate(() => {
      window.fakeNow = 149000;
      window.tick();
    });
    assert.ok(page.url().endsWith(target));
    assert.equal(loads, initialLoads);
    assert.match(await countdown(), /1/);
    const reload = page.waitForEvent("load");
    await page.evaluate(() => {
      window.fakeNow = 150000;
      window.tick();
    });
    await reload;
    assert.ok(page.url().endsWith(target));
    assert.equal(loads, initialLoads + 1);
  }
  for (const url of [
    "https://www.amazon.co.jp/progress-tracker/package?orderId=fixture",
    "https://abliteration.ai/console/billing",
    "https://abliteration.ai/console/activity",
  ]) {
    await page.goto(url);
    await page.evaluate(() => window.tick());
    assert.match(await countdown(), /60/);
    await page.evaluate(() => {
      window.fakeNow = 59000;
      window.tick();
    });
    assert.equal(page.url(), url);
    assert.match(await countdown(), /1/);
    const reload = page.waitForEvent("load");
    await page.evaluate(() => {
      window.fakeNow = 60000;
      window.tick();
    });
    await reload;
    assert.equal(page.url(), url);
  }
  await page.evaluate(() => {
    window.answer = "bad";
    window.menu();
  });
  assert.equal(await page.evaluate(() => window.invalid), true);
  await page.evaluate(() => {
    window.answer = "2";
    window.menu();
  });
  assert.match(await countdown(), /2/);
  assert.equal(
    await page.evaluate(() => localStorage.getItem("interval")),
    "2",
  );
  await page.evaluate(() => {
    history.pushState({}, "", "/console/other");
    window.fakeNow = 5000;
    window.tick();
  });
  const outsideLoads = loads;
  await page.evaluate(() => {
    window.fakeNow = 10000;
    window.tick();
  });
  assert.match(page.url(), /\/console\/other$/);
  assert.equal(loads, outsideLoads);
  assert.equal(await countdown(), null);
  await page.evaluate(() => {
    history.pushState({}, "", "/console/billing");
    window.tick();
  });
  const reload = page.waitForEvent("load");
  await page.evaluate(() => {
    window.fakeNow = 12000;
    window.tick();
  });
  await reload;
  assert.match(page.url(), /\/console\/billing$/);
  await page.evaluate(() => window.tick());
  for (const viewport of [
    { width: 320, height: 240 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    const bounds = await page.evaluate(() => {
      const element = document.querySelector(
        "[data-auto-page-reload-countdown]",
      );
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        pointerEvents: getComputedStyle(element).pointerEvents,
      };
    });
    assert.equal(bounds.pointerEvents, "none");
    assert.ok(
      bounds.left >= 0 &&
        bounds.top >= 0 &&
        bounds.right <= viewport.width &&
        bounds.bottom <= viewport.height,
    );
  }
  console.log(
    "auto-page-reload: targets, interval, validation and SPA navigation passed",
  );
} finally {
  await browser.close();
}
