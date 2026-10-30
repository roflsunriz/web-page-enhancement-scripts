import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/twitter-native-context-menu.user.js", import.meta.url),
  "utf8",
);
const matches = [...source.matchAll(/^\/\/ @match\s+(\S+)/gm)].map(
  (match) => match[1],
);
assert.deepEqual(matches.sort(), ["https://twitter.com/*", "https://x.com/*"]);
assert.match(source, /^\/\/ @run-at\s+document-start$/m);
assert.match(source, /^\/\/ @grant\s+none$/m);

const html = `<!doctype html><meta charset="utf-8"><title>Context menu fixture</title>
  <a id="link" href="/next">Link</a>
  <img id="image" alt="image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="40" height="40">
  <input id="input" value="hello">
  <button id="button">Button</button>
  <script>
    window.site = { menus: 0, downs: 0, ups: 0, clicks: 0 };
    window.addEventListener('contextmenu', (event) => {
      window.site.menus++;
      event.preventDefault();
    }, true);
    document.addEventListener('contextmenu', () => window.site.menus++);
    document.addEventListener('mousedown', () => window.site.downs++);
    document.addEventListener('mouseup', () => window.site.ups++);
    document.addEventListener('click', () => window.site.clicks++);
  </script>`;

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const enabled of [false, true]) {
    const context = await browser.newContext();
    await context.route("https://**/*", (route) =>
      route.fulfill({ contentType: "text/html", body: html }),
    );
    await context.addInitScript(
      ({ source, enabled }) => {
        window.observedMenus = [];
        window.addEventListener(
          "contextmenu",
          (event) => {
            setTimeout(() =>
              window.observedMenus.push({
                target: event.target.id,
                prevented: event.defaultPrevented,
                trusted: event.isTrusted,
              }),
            );
          },
          true,
        );
        if (enabled) (0, eval)(source);
      },
      { source, enabled },
    );

    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const host of ["x.com", "twitter.com"]) {
      await page.goto(`https://${host}/home`);
      for (const id of ["link", "image", "input", "button"]) {
        await page.locator(`#${id}`).click({ button: "right" });
      }
      await page.waitForFunction(() => window.observedMenus.length === 4);
      const first = await page.evaluate(() => ({
        site: window.site,
        observed: window.observedMenus,
      }));
      assert.equal(
        first.site.menus,
        enabled ? 0 : 8,
        `${host}: site contextmenu`,
      );
      assert.equal(first.site.downs, 4, `${host}: right mousedown`);
      assert.equal(first.site.ups, 4, `${host}: right mouseup`);
      assert.deepEqual(
        first.observed,
        ["link", "image", "input", "button"].map((target) => ({
          target,
          prevented: !enabled,
          trusted: true,
        })),
        `${host}: native contextmenu default`,
      );

      await page.locator("#button").click();
      const afterLeftClick = await page.evaluate(() => window.site);
      assert.equal(afterLeftClick.clicks, 1, `${host}: left click`);
      assert.equal(afterLeftClick.downs, 5, `${host}: left mousedown`);
      assert.equal(afterLeftClick.ups, 5, `${host}: left mouseup`);
      await page.locator("#input").fill("edited");
      assert.equal(
        await page.locator("#input").inputValue(),
        "edited",
        `${host}: input`,
      );

      await page.locator("#button").focus();
      await page.keyboard.press("Shift+F10");
      await page.waitForFunction(() => window.observedMenus.length === 5);
      const keyboard = await page.evaluate(() => window.observedMenus.at(-1));
      assert.deepEqual(keyboard, {
        target: "button",
        prevented: !enabled,
        trusted: true,
      });
      assert.equal(
        await page.evaluate(() => window.site.menus),
        enabled ? 0 : 10,
      );

      await page.evaluate(() => {
        history.pushState({}, "", "/other");
        document.body.insertAdjacentHTML(
          "beforeend",
          '<button id="dynamic">Dynamic</button>',
        );
      });
      await page.locator("#dynamic").click({ button: "right" });
      await page.waitForFunction(() => window.observedMenus.length === 6);
      const dynamic = await page.evaluate(() => window.observedMenus.at(-1));
      assert.deepEqual(dynamic, {
        target: "dynamic",
        prevented: !enabled,
        trusted: true,
      });
      assert.equal(
        await page.evaluate(() => window.site.menus),
        enabled ? 0 : 12,
      );
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    "X/Twitter context menu: control and userscript browser cases passed",
  );
} finally {
  await browser.close();
}
