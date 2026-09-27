import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

// 実ページの主要タグ・IDを縮小したオフラインフィクスチャ（2026-09-27採取）。
// YouTube本体のロード完了を再現するテストではなく、スクリプトの起動と表示設定を検証する。
const fixture = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<ytd-app><ytd-masthead><div id="buttons"></div></ytd-masthead>
<ytd-page-manager><ytd-watch-flexy class="loading show-skeleton">
<div id="primary"><ytd-watch-metadata><h1></h1>
<div id="owner">Channel</div><div id="description">Description</div>
</ytd-watch-metadata><ytd-comments id="comments">Comments</ytd-comments></div>
<div id="secondary"><div id="secondary-inner"><div id="related">Related videos</div>
<ytd-ad-slot-renderer><div id="fulfilled-layout">Advertisement</div></ytd-ad-slot-renderer>
</div></div></ytd-watch-flexy></ytd-page-manager></ytd-app></body></html>`;
const settings = Object.fromEntries(
  [
    "hideAds",
    "hideHomepageExtraRows",
    "hideExploreLink",
    "hideShortsLink",
    "hideMoreFromYoutubeSection",
    "hideFooterSection",
    "hideChannelAutoplay",
    "hideChannelForYou",
    "hideCreateButton",
  ].map((key) => [key, true]),
);
const source = await readFile(
  process.argv[2] ??
    new URL("../dist/youtube-ui-modifier.user.js", import.meta.url),
  "utf8",
);
const shim = `window.__menus=[];
window.GM_getValue=()=>(${JSON.stringify(settings)});
window.GM_registerMenuCommand=(label,callback)=>window.__menus.push(callback);`;
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function evaluate(session, expression) {
  const result = await session.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.exception?.description ??
        result.exceptionDetails.text,
    );
  return result.result.value;
}

async function waitFor(session, expression) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (await evaluate(session, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out: ${expression}`);
}

try {
  for (const timing of ["document-start", "loaded"]) {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const session = await context.newCDPSession(page);
      const errors = [];
      session.on("Runtime.exceptionThrown", ({ exceptionDetails }) =>
        errors.push(exceptionDetails.text),
      );
      session.on("Runtime.consoleAPICalled", ({ type, args }) => {
        if (type === "error")
          errors.push(
            args.map((arg) => arg.value ?? arg.description).join(" "),
          );
      });
      await session.send("Page.enable");
      await session.send("Runtime.enable");
      await session.send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
      session.on("Fetch.requestPaused", ({ requestId, resourceType }) => {
        void session
          .send("Fetch.fulfillRequest", {
            requestId,
            responseCode: 200,
            responseHeaders: [
              { name: "Content-Type", value: "text/html; charset=utf-8" },
            ],
            body: Buffer.from(
              resourceType === "Document"
                ? timing === "loaded"
                  ? fixture.replaceAll("ytd-watch-flexy", "ytd-watch-grid")
                  : fixture
                : "",
            ).toString("base64"),
          })
          .catch((error) => errors.push(String(error)));
      });
      await session.send("Page.addScriptToEvaluateOnNewDocument", {
        source: `${shim}\nwindow.__startedWithoutRoot=!document.documentElement;\n${timing === "document-start" ? source : ""}`,
      });
      await session.send("Page.navigate", {
        url: "https://www.youtube.com/watch?v=fixture",
      });
      await waitFor(session, "document.readyState === 'complete'");
      if (timing === "loaded") await evaluate(session, source);
      await waitFor(session, "window.__menus?.length === 2");
      assert.equal(
        await evaluate(session, "window.__startedWithoutRoot"),
        true,
      );
      assert.equal(
        await evaluate(
          session,
          "document.querySelectorAll('#youtube-ui-modifier-styles').length",
        ),
        1,
      );
      assert.notEqual(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
        "loading page must not be modified",
      );
      await evaluate(
        session,
        "document.querySelector('ytd-watch-metadata').setAttribute('video-id','fixture'); document.querySelector('h1').textContent='Video title'",
      );
      // タイトルだけが先に描画されても、ページがloading中なら適用しない。
      await new Promise((resolve) => setTimeout(resolve, 200));
      assert.notEqual(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      await evaluate(
        session,
        "document.querySelector('ytd-watch-flexy,ytd-watch-grid').className='hide-skeleton'",
      );
      await waitFor(
        session,
        "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display==='none'",
      );
      assert.equal(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      assert.equal(
        await evaluate(
          session,
          "[...document.querySelectorAll('h1,#owner,#description,#comments,#related')].every(e => e.getBoundingClientRect().height > 0)",
        ),
        true,
      );

      await evaluate(session, "window.__menus[0]()");
      for (const [width, height] of [
        [1920, 1080],
        [1280, 720],
        [390, 844],
      ]) {
        await session.send("Emulation.setDeviceMetricsOverride", {
          width,
          height,
          deviceScaleFactor: 1,
          mobile: false,
        });
        assert.equal(
          await evaluate(
            session,
            `(() => {
          const r=document.querySelector('.youtube-ui-modifier-dialog').getBoundingClientRect();
          return r.width>0 && r.height>0 && r.left>=0 && r.top>=0 && r.right<=innerWidth+1 && r.bottom<=innerHeight+1;
        })()`,
          ),
          true,
          `${timing}: modal bounds at ${width}x${height}`,
        );
      }
      await evaluate(
        session,
        "document.querySelector('[data-setting-id=hideAds] input').click()",
      );
      assert.notEqual(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      await evaluate(
        session,
        "document.querySelector('[data-setting-id=hideAds] input').click()",
      );
      assert.equal(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      await evaluate(
        session,
        "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))",
      );
      assert.equal(
        await evaluate(
          session,
          "document.getElementById('youtube-ui-modifier-modal')===null",
        ),
        true,
      );
      await evaluate(session, "window.__menus[1]()");
      assert.notEqual(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      await evaluate(session, "window.__menus[1]()");
      assert.equal(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
      );
      await evaluate(session, "history.pushState({},'', '/watch?v=next')");
      assert.notEqual(
        await evaluate(
          session,
          "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display",
        ),
        "none",
        "previous video's DOM must not enable settings",
      );
      await evaluate(
        session,
        "document.querySelector('ytd-watch-metadata').setAttribute('video-id','next'); document.querySelector('h1').textContent='Next video'",
      );
      await waitFor(
        session,
        "getComputedStyle(document.querySelector('ytd-ad-slot-renderer')).display==='none' && window.__menus.length===2",
      );
      assert.deepEqual(errors, [], `${timing}: browser errors`);
      console.log(
        `YouTube UI Modifier: ${timing}, visibility, toggles, navigation, 3 viewports passed`,
      );
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
