import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/auto-page-reload.user.js", import.meta.url),
  "utf8",
);
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
    ({ source }) => {
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
    { source },
  );
  const page = await context.newPage();
  for (const url of [
    "https://www.amazon.co.jp/progress-tracker/package?orderId=fixture",
    "https://abliteration.ai/console/billing",
    "https://abliteration.ai/console/activity",
  ]) {
    await page.goto(url);
    await page.evaluate(() => {
      window.fakeNow = 59000;
      window.tick();
    });
    assert.equal(page.url(), url);
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
  assert.equal(
    await page.evaluate(() => localStorage.getItem("interval")),
    "2",
  );
  await page.evaluate(() => {
    history.pushState({}, "", "/console/other");
    window.fakeNow = 5000;
    window.tick();
  });
  await page.evaluate(() => {
    window.fakeNow = 10000;
    window.tick();
  });
  assert.match(page.url(), /\/console\/other$/);
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
  console.log(
    "auto-page-reload: targets, interval, validation and SPA navigation passed",
  );
} finally {
  await browser.close();
}
