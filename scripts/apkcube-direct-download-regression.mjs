import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/apkcube-direct-download.user.js", import.meta.url),
  "utf8",
);

assert.match(source, /@version\s+1\.1\.0/);
assert.match(source, /@match\s+https:\/\/apkcube\.com\/\*/);
assert.match(
  source,
  /@match\s+https:\/\/play\.google\.com\/store\/apps\/details\*/,
);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let checks = 0;

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ??
        result.exceptionDetails.text,
    );
  }
  return result.result.value;
}

async function waitFor(cdp, expression, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out: ${expression}`);
}

async function clickCenter(cdp, expression) {
  const point = await evaluate(
    cdp,
    `(()=>{const element=${expression};const rect=element.getBoundingClientRect();return{x:rect.left+rect.width/2,y:rect.top+rect.height/2}})()`,
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
}

async function runCase(width, height, locale) {
  const context = await browser.newContext({
    viewport: { width, height },
    locale,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  cdp.on("Runtime.exceptionThrown", (event) => {
    errors.push(
      event.exceptionDetails.exception?.description ??
        event.exceptionDetails.text,
    );
  });
  await cdp.send("Fetch.enable", {
    patterns: [{ urlPattern: "*", resourceType: "Document" }],
  });
  cdp.on("Fetch.requestPaused", (event) => {
    void cdp
      .send("Fetch.fulfillRequest", {
        requestId: event.requestId,
        responseCode: 200,
        responseHeaders: [
          { name: "Content-Type", value: "text/html; charset=utf-8" },
        ],
        body: Buffer.from(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Example app</title><main style="min-height:1200px;padding:24px"><h1>Example app</h1></main>',
        ).toString("base64"),
      })
      .catch((error) => errors.push(String(error)));
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source });
  await cdp.send("Page.navigate", {
    url: "https://play.google.com/store/apps/details?id=com.example.first&hl=ja",
  });

  try {
    const host = "document.querySelector('#apkcube-google-play-download')";
    await waitFor(cdp, `${host}?.shadowRoot`);
    const state = await evaluate(
      cdp,
      `(()=>{const host=${host};const root=host.shadowRoot;const panel=root.querySelector('.panel');const rect=panel.getBoundingClientRect();return{dir:host.dir,left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,links:[...root.querySelectorAll('a')].map(a=>a.href),actions:[...root.querySelectorAll('.action')].map(a=>({width:a.getBoundingClientRect().width,height:a.getBoundingClientRect().height}))}})()`,
    );
    assert.equal(state.dir, locale === "ar" || locale === "ur" ? "rtl" : "ltr");
    assert.ok(state.left >= 0 && state.right <= width);
    assert.ok(state.top >= 0 && state.bottom <= height);
    assert.deepEqual(state.links, [
      "https://apkcube.com/apk-downloader?url=com.example.first",
      "https://apkcube.com/apk-downloader?url=com.example.first&arch=universal&langs=all",
      "https://apkcube.com/apk-downloader?url=com.example.first#download-options",
    ]);
    for (const action of state.actions) {
      assert.ok(action.width >= 120);
      assert.ok(action.height >= 50);
    }
    checks += 6;

    await clickCenter(cdp, `${host}.shadowRoot.querySelector('.collapse')`);
    assert.equal(await evaluate(cdp, `${host}.dataset.collapsed`), "true");
    await clickCenter(cdp, `${host}.shadowRoot.querySelector('.launcher')`);
    assert.equal(
      await evaluate(cdp, `${host}.hasAttribute('data-collapsed')`),
      false,
    );
    checks += 2;

    await evaluate(
      cdp,
      "history.pushState({},'', '/store/apps/details?id=org.example.second')",
    );
    await waitFor(
      cdp,
      `${host}?.dataset.packageName==='org.example.second'`,
      3000,
    );
    assert.equal(
      await evaluate(cdp, `${host}.shadowRoot.querySelector('.primary').href`),
      "https://apkcube.com/apk-downloader?url=org.example.second",
    );
    checks += 1;

    await evaluate(cdp, "history.pushState({},'', '/store/apps')");
    await waitFor(cdp, `${host}===null`, 3000);
    checks += 1;
  } finally {
    await context.close();
  }
}

try {
  await runCase(1280, 720, "ja-JP");
  await runCase(390, 844, "en-US");
  await runCase(320, 640, "ar");
  await runCase(844, 390, "ur");
  assert.deepEqual(errors, []);
  console.log(`apkcube-direct-download regression: ${checks} checks passed`);
} finally {
  await browser.close();
}
