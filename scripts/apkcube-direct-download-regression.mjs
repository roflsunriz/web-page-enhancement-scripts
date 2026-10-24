import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/apkcube-direct-download.user.js", import.meta.url),
  "utf8",
);

assert.match(source, /@version\s+1\.4\.0/);
assert.match(source, /@match\s+https:\/\/apkcube\.com\/\*/);
assert.match(
  source,
  /@match\s+https:\/\/play\.google\.com\/store\/apps\/details\*/,
);
assert.match(source, /@grant\s+GM_xmlhttpRequest/);
for (const host of [
  "apkcube.com",
  "www.apkmirror.com",
  "tapi.pureapk.com",
  "en.uptodown.com",
]) {
  assert.match(
    source,
    new RegExp(`@connect\\s+${host.replaceAll(".", "\\.")}`),
  );
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let checks = 0;

function gmMockSource(routes = []) {
  return `window.__gmCalls=[];window.__gmPending=0;window.GM_xmlhttpRequest=(details)=>{window.__gmCalls.push(details.url);window.__gmPending++;const routes=${JSON.stringify(routes)};const route=routes.find(item=>details.url.includes(item.includes));queueMicrotask(()=>{window.__gmPending--;if(!route){details.onload?.({status:404,statusText:'Not Found',response:'',responseText:'',responseHeaders:'',finalUrl:details.url});return;}const response={status:route.status??200,statusText:route.status===404?'Not Found':'OK',response:route.body??'',responseText:route.body??'',responseHeaders:'',finalUrl:route.finalUrl??details.url};details.onload?.(response);});return{abort(){}}};`;
}

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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: gmMockSource() + source,
  });
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

async function runPlayPreflightCase() {
  const packageName = "jp.co.airfront.android.a2chMate";
  const expectedUrl = `https://apkpure.com/app/${packageName}/download`;
  const routes = [
    {
      includes: "apkcube.com/apk-downloader",
      body: String.raw`{"reason":"low-rated","className":"rounded-none"}`,
    },
    {
      includes: "www.apkmirror.com",
      body: `Results for ${packageName} <a href="/apk/example/chmate/chmate-2-release/">release</a>`,
    },
    {
      includes: "tapi.pureapk.com",
      body: JSON.stringify({
        version_list: [
          { package_name: packageName, asset_usability: "USABLE" },
        ],
      }),
    },
    {
      includes: "en.uptodown.com/android/search",
      body: '<a href="https://chmate.en.uptodown.com/android">app</a>',
    },
    {
      includes: "chmate.en.uptodown.com/android/download",
      finalUrl: "https://chmate.en.uptodown.com/android/download",
      body: `<td>${packageName}</td>`,
    },
  ];
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "ja-JP",
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
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><main style="min-height:900px">ChMate</main>',
        ).toString("base64"),
      })
      .catch((error) => errors.push(String(error)));
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: gmMockSource(routes) + source,
  });
  await cdp.send("Page.navigate", {
    url: `https://play.google.com/store/apps/details?id=${packageName}`,
  });

  try {
    const host = "document.querySelector('#apkcube-google-play-download')";
    await waitFor(cdp, `${host}?.shadowRoot`);
    const state = await evaluate(
      cdp,
      `(()=>{const host=${host};return{destination:host.dataset.destination,links:[...host.shadowRoot.querySelectorAll('a')].map(a=>a.href)}})()`,
    );
    assert.equal(state.destination, "apkpure");
    assert.deepEqual(state.links, [expectedUrl]);
    const before = await cdp.send("Page.getNavigationHistory");
    assert.equal(
      before.entries.some((entry) => entry.url.includes("apkcube.com")),
      false,
    );
    await clickCenter(cdp, `${host}.shadowRoot.querySelector('a')`);
    await waitFor(
      cdp,
      `window.location.href===${JSON.stringify(expectedUrl)}`,
      5000,
    );
    assert.equal(page.url(), expectedUrl);
    checks += 4;
  } finally {
    await context.close();
  }
}

async function runBlockedAlternativeCase({
  packageName,
  noticeClass,
  routes,
  expectedUrl,
  expectLookup = true,
}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "ja-JP",
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
    const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><main style="max-width:720px;margin:auto;padding:20px"><div class="${noticeClass}"><svg></svg><div><p>安全上または著作権上の理由により APKCube ではダウンロードできません</p></div></div><a href="https://play.google.com/store/apps/details?id=${packageName}">Google Play</a></main>`;
    void cdp
      .send("Fetch.fulfillRequest", {
        requestId: event.requestId,
        responseCode: 200,
        responseHeaders: [
          { name: "Content-Type", value: "text/html; charset=utf-8" },
        ],
        body: Buffer.from(html).toString("base64"),
      })
      .catch((error) => errors.push(String(error)));
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: gmMockSource(routes) + source,
  });
  await cdp.send("Page.navigate", {
    url: `https://apkcube.com/example/${packageName}`,
  });

  try {
    if (expectedUrl) {
      await waitFor(
        cdp,
        `window.location.href===${JSON.stringify(expectedUrl)}`,
        5000,
      );
      assert.equal(page.url(), expectedUrl);
      const history = await cdp.send("Page.getNavigationHistory");
      assert.equal(
        history.entries.some((entry) => entry.url.includes("apkcube.com")),
        false,
      );
      checks += 2;
      return;
    }

    if (expectLookup) {
      await waitFor(
        cdp,
        "window.__gmPending===0 && window.__gmCalls.length>=3",
      );
    } else {
      await waitFor(cdp, "document.readyState==='complete'");
      await new Promise((resolve) => setTimeout(resolve, 150));
      assert.equal(await evaluate(cdp, "window.__gmCalls.length"), 0);
    }
    assert.match(page.url(), /^https:\/\/apkcube\.com\//);
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
  await runPlayPreflightCase();
  const blockedClass =
    "flex items-start gap-2 border text-start text-sm font-medium border-warning-border bg-warning-soft text-warning-ink rounded-none border-x-0 border-b-0 px-4 py-3";
  await runBlockedAlternativeCase({
    packageName: "com.example.blocked",
    noticeClass: blockedClass,
    routes: [
      {
        includes: "www.apkmirror.com",
        body: 'Results for com.example.blocked <a href="/apk/example/blocked/blocked-2-release/">release</a>',
      },
      {
        includes: "tapi.pureapk.com",
        body: JSON.stringify({
          version_list: [
            {
              package_name: "com.example.blocked",
              asset_usability: "USABLE",
            },
          ],
        }),
      },
      {
        includes: "en.uptodown.com/android/search",
        body: '<a href="https://blocked.en.uptodown.com/android">app</a>',
      },
      {
        includes: "blocked.en.uptodown.com/android/download",
        finalUrl: "https://blocked.en.uptodown.com/android/download",
        body: "<td>com.example.blocked</td>",
      },
    ],
    expectedUrl: "https://apkpure.com/app/com.example.blocked/download",
  });
  await runBlockedAlternativeCase({
    packageName: "com.example.missing",
    noticeClass: blockedClass,
    routes: [
      {
        includes: "www.apkmirror.com",
        body: "com.example.missing No results found matching your query",
      },
      {
        includes: "tapi.pureapk.com",
        body: JSON.stringify({ version_list: [] }),
      },
      { includes: "en.uptodown.com/android/search", body: "no results" },
    ],
    expectedUrl: null,
  });
  await runBlockedAlternativeCase({
    packageName: "com.example.paid",
    noticeClass:
      "flex items-start gap-2 rounded-sm border px-3 py-2 text-start text-sm font-medium border-rule-2 bg-muted/60 text-ink-2",
    routes: [],
    expectedUrl: null,
    expectLookup: false,
  });
  assert.deepEqual(errors, []);
  console.log(`apkcube-direct-download regression: ${checks} checks passed`);
} finally {
  await browser.close();
}
