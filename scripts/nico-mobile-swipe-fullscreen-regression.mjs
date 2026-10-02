import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

// Reduced structural fixture from sp.nicovideo.jp/watch/sm9, 2026-10-02.
// Names and the zero-height wrapper are observed; hashed classes are omitted.
const fixture = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{margin:0;height:2200px}#player{position:relative;width:100%;height:219px;margin-top:100px;background:#222}
.zero{height:0}[data-name=stage]{position:relative;width:100%;height:219px}
[data-name=inner],[data-name=content],[data-name=comment],video{position:absolute;inset:0;width:100%;height:100%}
[data-name=comment]{pointer-events:none}button{position:absolute;bottom:0;right:0;width:50px;height:30px}
input{position:absolute;bottom:0;left:0;width:70%;height:24px}
</style><div id="player"><div class="zero"><div data-name="stage"><div data-name="inner">
<div data-name="content"><video data-name="video-content" playsinline></video><div data-name="overlay-icon"></div></div>
<div data-name="comment"></div></div></div></div><button id="control">Play</button><input type="range" id="seek"></div>
<div id="outside" style="height:1800px">Page content</div>`;
const source = await readFile(
  new URL("../dist/nico-mobile-swipe-fullscreen.user.js", import.meta.url),
  "utf8",
);
assert.match(source, /@version\s+1\.0\.1/);
assert.match(source, /@match\s+https:\/\/sp\.nicovideo\.jp\/\*/);
assert.match(source, /@noframes/);
const browser = await chromium.launch({ channel: "chrome", headless: true });
let cases = 0;
const errors = [];
async function evaluate(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails)
    throw new Error(
      r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
    );
  return r.result.value;
}
async function waitFor(cdp, expression) {
  const deadline = Date.now() + 4000;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, expression)) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`Timed out: ${expression}`);
}
async function setup({
  mock = true,
  width = 390,
  height = 844,
  path = "/watch/sm9",
} = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  const observed = { enter: 0 };
  await cdp.send("Runtime.addBinding", { name: "__recordEnter" });
  cdp.on("Runtime.bindingCalled", (e) => {
    if (e.name === "__recordEnter") observed.enter++;
  });
  cdp.on("Runtime.exceptionThrown", (e) =>
    errors.push(
      e.exceptionDetails.exception?.description ?? e.exceptionDetails.text,
    ),
  );
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  cdp.on(
    "Fetch.requestPaused",
    (e) =>
      void cdp
        .send("Fetch.fulfillRequest", {
          requestId: e.requestId,
          responseCode: 200,
          responseHeaders: [
            { name: "Content-Type", value: "text/html; charset=utf-8" },
          ],
          body: Buffer.from(
            e.resourceType === "Document" ? fixture : "",
          ).toString("base64"),
        })
        .catch(() => {}),
  );
  await cdp.send("Page.navigate", { url: `https://sp.nicovideo.jp${path}` });
  await waitFor(
    cdp,
    `location.href === 'https://sp.nicovideo.jp${path}' && document.readyState === 'complete' && !!document.querySelector('#player')`,
  );
  await evaluate(
    cdp,
    `window.__calls={enter:0,exit:0,lock:0,unlock:0,click:0,control:0,seek:0};
    document.querySelector('video').addEventListener('click',()=>__calls.click++);
    document.querySelector('#control').addEventListener('click',()=>__calls.control++);
    document.querySelector('#seek').addEventListener('input',()=>__calls.seek++);`,
  );
  if (mock)
    await evaluate(
      cdp,
      `window.__fs=null;window.__mode='ok';window.__lockMode='ok';
    Object.defineProperty(document,'fullscreenEnabled',{get:()=>__mode!=='unsupported',configurable:true});
    Object.defineProperty(document,'fullscreenElement',{get:()=>__fs,configurable:true});
    HTMLElement.prototype.requestFullscreen=function(){__recordEnter('enter');__calls.enter++;if(__mode==='reject')return Promise.reject(new Error('denied'));
      const enter=()=>{__fs=this;document.dispatchEvent(new Event('fullscreenchange'))};
      if(__mode==='pending')return new Promise(r=>window.__enterResolve=()=>{enter();r()});enter();return Promise.resolve()};
    document.exitFullscreen=()=>{__calls.exit++;if(__mode==='exit-reject')return Promise.reject(new Error('exit denied'));
      __fs=null;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve()};
    Object.defineProperty(screen.orientation,'lock',{configurable:true,value:()=>{__calls.lock++;
      if(__lockMode==='reject')return Promise.reject(new Error('not supported'));
      if(__lockMode==='pending')return new Promise(r=>window.__lockResolve=r);return Promise.resolve()}});
    Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>__calls.unlock++});`,
    );
  await evaluate(cdp, source);
  return { context, page, cdp, observed };
}
async function mouse(cdp, from, to) {
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: from.x,
    y: from.y,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: from.x,
    y: from.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: to.x,
    y: to.y,
    button: "left",
    buttons: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: to.x,
    y: to.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
}
async function touch(cdp, from, to, { cancel = false, multi = false } = {}) {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...from, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: multi
      ? [
          { ...to, id: 1 },
          { x: to.x + 15, y: to.y, id: 2 },
        ]
      : [{ ...to, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: cancel ? "touchCancel" : "touchEnd",
    touchPoints: [],
  });
}
const from = { x: 195, y: 250 },
  up = { x: 195, y: 150 };
async function run(name, fn, options) {
  const s = await setup(options);
  try {
    await fn(s);
    cases++;
    console.log(`PASS ${name}`);
  } finally {
    await s.context.close();
  }
}
try {
  await run(
    "touch up/down; lock and owned unlock; no tap after swipe",
    async ({ cdp }) => {
      await touch(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__fs.id"), "player");
      assert.equal(await evaluate(cdp, "__calls.click"), 0);
      await touch(cdp, { x: 195, y: 180 }, { x: 195, y: 290 });
      await waitFor(cdp, "__fs===null");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 1);
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelectorAll('[data-nico-swipe-fill]').length",
        ),
        0,
      );
    },
  );
  await run("mouse drag and controls stay interactive", async ({ cdp }) => {
    await mouse(cdp, from, up);
    await waitFor(cdp, "__calls.lock===1");
    await mouse(cdp, { x: 370, y: 305 }, { x: 370, y: 305 });
    assert.equal(await evaluate(cdp, "__calls.control"), 1);
    await mouse(cdp, { x: 195, y: 150 }, { x: 195, y: 260 });
    await waitFor(cdp, "__fs===null");
  });
  await run(
    "transparent tap surface beside stage accepts swipe",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        "const surface=document.createElement('div');surface.style.cssText='position:absolute;left:15%;top:20%;width:70%;height:60%;z-index:3';document.querySelector('#player').append(surface)",
      );
      await touch(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__fs.id"), "player");
    },
  );
  await run(
    "owned root remains valid when fullscreen changes player geometry",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(
        cdp,
        "document.querySelector('#player').style.height='400px'",
      );
      await mouse(cdp, { x: 195, y: 150 }, from);
      await waitFor(cdp, "__fs===null");
    },
  );
  for (const [name, a, b, opts] of [
    ["tap", from, from, {}],
    ["horizontal seek", from, { x: 285, y: 250 }, {}],
    ["diagonal", from, { x: 280, y: 160 }, {}],
    ["short", from, { x: 195, y: 220 }, {}],
    ["wrong direction", from, { x: 195, y: 290 }, {}],
    ["edge control", { x: 370, y: 290 }, { x: 370, y: 180 }, {}],
    ["seek bar", { x: 90, y: 306 }, { x: 90, y: 205 }, {}],
    ["outside player", { x: 190, y: 600 }, { x: 190, y: 450 }, {}],
    ["multitouch", from, up, { multi: true }],
    ["touch cancel", from, up, { cancel: true }],
  ])
    await run(name, async ({ cdp, observed }) => {
      await touch(cdp, a, b, opts);
      const calls = await evaluate(cdp, "window.__calls");
      // Chrome may interpret an unconsumed horizontal touchscreen drag as Back.
      // Count requests outside the document so navigation cannot erase evidence.
      assert.equal(observed.enter, 0);
      if (!calls) {
        assert.equal(name, "horizontal seek");
        return;
      }
      assert.equal(calls.enter, 0);
      assert.equal(calls.lock, 0);
      if (name === "tap") assert.equal(await evaluate(cdp, "__calls.click"), 1);
      if (name === "outside player")
        assert.ok(
          (await evaluate(cdp, "scrollY")) > 0,
          "page scroll preserved",
        );
    });
  await run(
    "reversed claimed drag does not trigger fullscreen",
    async ({ cdp }) => {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ ...from, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y: 230, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y: 270, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ ...up, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      assert.equal(await evaluate(cdp, "__calls.enter"), 0);
      assert.equal(await evaluate(cdp, "__calls.click"), 0);
    },
  );
  for (const mode of ["unsupported", "reject"])
    await run(`fullscreen ${mode}`, async ({ cdp }) => {
      await evaluate(cdp, `__mode='${mode}'`);
      await mouse(cdp, from, up);
      await waitFor(cdp, "document.querySelector('[role=status]')");
      assert.equal(await evaluate(cdp, "__fs"), null);
      assert.equal(await evaluate(cdp, "__calls.lock"), 0);
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelectorAll('[data-nico-swipe-fullscreen]').length",
        ),
        0,
      );
    });
  await run(
    "orientation refusal keeps fullscreen; no unowned unlock",
    async ({ cdp }) => {
      await evaluate(cdp, "__lockMode='reject'");
      await mouse(cdp, from, up);
      await waitFor(cdp, "document.querySelector('[role=status]')");
      assert.equal(await evaluate(cdp, "__fs.id"), "player");
      await evaluate(cdp, "document.exitFullscreen()");
      await waitFor(
        cdp,
        "!document.querySelector('[data-nico-swipe-fullscreen]')",
      );
      assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
    },
  );
  await run("missing orientation lock keeps fullscreen", async ({ cdp }) => {
    await evaluate(
      cdp,
      "Object.defineProperty(screen.orientation,'lock',{value:undefined,configurable:true})",
    );
    await mouse(cdp, from, up);
    await waitFor(cdp, "document.querySelector('[role=status]')");
    assert.equal(await evaluate(cdp, "__fs.id"), "player");
    assert.equal(await evaluate(cdp, "__calls.lock"), 0);
  });
  await run("external fullscreen is untouched", async ({ cdp }) => {
    await evaluate(cdp, "__fs=document.body");
    await mouse(cdp, { x: 195, y: 150 }, from);
    assert.equal(await evaluate(cdp, "__fs===document.body"), true);
    assert.equal(await evaluate(cdp, "__calls.exit"), 0);
    assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
  });
  await run(
    "SPA from listing then watch; cleanup on pushState",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      assert.equal(await evaluate(cdp, "__calls.enter"), 0);
      await evaluate(cdp, "history.pushState({},'', '/watch/sm10')");
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "history.pushState({},'', '/watch/sm11')");
      await waitFor(cdp, "__fs===null");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 1);
    },
    { path: "/ranking" },
  );
  await run(
    "video replacement releases fullscreen and accepts new video",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(
        cdp,
        "const v=document.querySelector('video');v.replaceWith(v.cloneNode())",
      );
      await waitFor(cdp, "__fs===null");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 1);
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===2");
    },
  );
  await run(
    "lock resolves after external exit; no lock leak",
    async ({ cdp }) => {
      await evaluate(cdp, "__lockMode='pending'");
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "document.exitFullscreen();__lockResolve()");
      await waitFor(cdp, "__calls.unlock===1");
      await waitFor(
        cdp,
        "!document.querySelector('[data-nico-swipe-fullscreen]')",
      );
    },
  );
  await run(
    "fullscreen resolves after navigation; exits without locking",
    async ({ cdp }) => {
      await evaluate(cdp, "__mode='pending'");
      await mouse(cdp, from, up);
      await evaluate(cdp, "history.pushState({},'', '/ranking')");
      await waitFor(
        cdp,
        "!document.querySelector('[data-nico-swipe-fullscreen]')",
      );
      await evaluate(cdp, "__enterResolve()");
      await waitFor(cdp, "__calls.exit===1");
      assert.equal(await evaluate(cdp, "__calls.lock"), 0);
    },
  );
  await run(
    "exit refusal retains active session; retry unlocks",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "__mode='exit-reject'");
      await mouse(cdp, { x: 195, y: 150 }, from);
      await waitFor(cdp, "document.querySelector('[role=status]')");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
      await evaluate(cdp, "__mode='ok'");
      await mouse(cdp, { x: 195, y: 150 }, from);
      await waitFor(cdp, "__calls.unlock===1");
    },
  );
  await run("navigation during drag is cancelled", async ({ cdp }) => {
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      ...from,
      button: "left",
      buttons: 1,
      clickCount: 1,
    });
    await evaluate(cdp, "history.pushState({},'', '/watch/sm11')");
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      ...up,
      button: "left",
      buttons: 1,
    });
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      ...up,
      button: "left",
      buttons: 0,
      clickCount: 1,
    });
    assert.equal(await evaluate(cdp, "__calls.enter"), 0);
  });
  await run("pagehide releases owned lock", async ({ cdp }) => {
    await mouse(cdp, from, up);
    await waitFor(cdp, "__calls.lock===1");
    await evaluate(cdp, "window.dispatchEvent(new Event('pagehide'))");
    await waitFor(cdp, "__calls.unlock===1");
  });
  for (const [width, height] of [
    [390, 844],
    [844, 390],
  ])
    await run(
      `real Fullscreen API ${width}x${height}`,
      async ({ cdp, page }) => {
        await evaluate(
          cdp,
          "document.addEventListener('fullscreenchange',()=>{const inner=document.querySelector('[data-name=inner]');if(document.fullscreenElement){inner.style.cssText='left:50%;top:50%;width:100%;height:219px;transform:translate(-50%,-50%)'}else{inner.style.cssText=''}})",
        );
        await mouse(cdp, { x: width / 2, y: 250 }, { x: width / 2, y: 150 });
        await waitFor(cdp, "document.fullscreenElement?.id==='player'");
        const rect = await evaluate(
          cdp,
          "JSON.stringify({root:document.querySelector('#player').getBoundingClientRect().toJSON(),video:document.querySelector('video').getBoundingClientRect().toJSON(),w:innerWidth,h:innerHeight})",
        );
        const r = JSON.parse(rect);
        assert.ok(Math.abs(r.root.width - r.w) < 2);
        assert.ok(Math.abs(r.root.height - r.h) < 2);
        assert.ok(r.video.x >= -2);
        assert.ok(r.video.y >= -2);
        assert.ok(r.video.right <= r.w + 2);
        assert.ok(r.video.bottom <= r.h + 2);
        // Linux/desktop Chrome cannot lock a physical display. A rejection is a
        // documented fallback, not evidence that a phone rotated successfully.
        await mouse(
          cdp,
          { x: r.w / 2, y: r.video.y + r.video.height / 2 - 55 },
          { x: r.w / 2, y: r.video.y + r.video.height / 2 + 55 },
        );
        await waitFor(cdp, "document.fullscreenElement===null");
        assert.equal(
          await evaluate(
            cdp,
            "document.querySelector('video').getBoundingClientRect().height",
          ),
          219,
        );
        await page.screenshot({
          path:
            process.env.NICO_SWIPE_SCREENSHOT ??
            `${process.env.TEMP ?? "/tmp"}/nico-swipe-${width}.png`,
        });
      },
      { mock: false, width, height },
    );
  assert.deepEqual(errors, [], "no uncaught browser exceptions");
  await run(
    "repeat injection issues one fullscreen request",
    async ({ cdp }) => {
      await evaluate(cdp, source);
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__calls.enter"), 1);
    },
  );
  console.log(`Nico mobile swipe: ${cases} browser cases passed`);
} finally {
  await browser.close();
}
