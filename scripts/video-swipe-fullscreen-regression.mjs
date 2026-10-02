import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/video-swipe-fullscreen.user.js", import.meta.url),
  "utf8",
);
const nicoSource = await readFile(
  new URL("../dist/nico-mobile-swipe-fullscreen.user.js", import.meta.url),
  "utf8",
);
assert.match(source, /@version\s+1\.0\.0/);
assert.match(source, /@grant\s+GM_registerMenuCommand/);
assert.doesNotMatch(source, /@noframes|@updateURL|@downloadURL/);
const fixture = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;height:2400px}.player{position:relative;width:100%;height:219px;margin-top:100px;background:#222}
.player video,.overlay{position:absolute;inset:0;width:100%;height:100%}button{position:absolute;right:0;bottom:0;width:50px;height:30px}
input{position:absolute;bottom:0;left:0;width:70%;height:24px}#two{margin-top:40px}
</style><div class="player" id="one"><video playsinline></video><div class="overlay"></div>
<button id="control">Play</button><input id="seek" type="range"></div>
<div class="player" id="two"><video playsinline controls></video></div><div id="outside">Page content</div>`;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let cases = 0;
const artifacts = process.env.VIDEO_SWIPE_ARTIFACTS;
if (artifacts) await mkdir(artifacts, { recursive: true });

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
  const deadline = Date.now() + 4500;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, expression)) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(
    `Timed out: ${expression}; ${JSON.stringify(await evaluate(cdp, "window.__calls"))}`,
  );
}

async function setup({
  mock = true,
  width = 390,
  height = 844,
  hostname = "video.test",
  before = "",
  enabled,
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
  await cdp.send("Page.navigate", { url: `https://${hostname}/watch/sm9` });
  await waitFor(
    cdp,
    "document.readyState==='complete' && !!document.querySelector('#one')",
  );
  const observed = { enter: 0 };
  await cdp.send("Runtime.addBinding", { name: "__recordEnter" });
  cdp.on("Runtime.bindingCalled", (e) => {
    if (e.name === "__recordEnter") observed.enter++;
  });
  await evaluate(
    cdp,
    `window.__calls={enter:0,exit:0,lock:0,unlock:0,click:0,control:0};
    window.__store={};window.__menus=[];
    window.GM_getValue=(key,fallback)=>key in __store?__store[key]:fallback;
    window.GM_setValue=(key,value)=>__store[key]=value;
    window.GM_registerMenuCommand=(label,fn)=>__menus.push({label,fn});
    document.querySelector('.overlay').addEventListener('click',()=>__calls.click++);
    document.querySelector('#control').addEventListener('click',()=>__calls.control++);
    ${enabled === undefined ? "" : `__store['video-swipe-fullscreen:enabled:v1:${hostname}']=${enabled};`}`,
  );
  if (mock)
    await evaluate(
      cdp,
      `window.__fs=null;window.__mode='ok';window.__lockMode='ok';
    Object.defineProperty(document,'fullscreenEnabled',{get:()=>__mode!=='unsupported',configurable:true});
    Object.defineProperty(document,'fullscreenElement',{get:()=>__fs,configurable:true});
    HTMLElement.prototype.requestFullscreen=function(){__recordEnter('enter');__calls.enter++;
      if(__mode==='throw')throw new Error('denied');if(__mode==='reject')return Promise.reject(new Error('denied'));
      const enter=()=>{__fs=this;document.dispatchEvent(new Event('fullscreenchange'))};
      if(__mode==='pending')return new Promise(r=>window.__enterResolve=()=>{enter();r()});enter();return Promise.resolve()};
    document.exitFullscreen=()=>{__calls.exit++;if(__mode==='exit-reject')return Promise.reject(new Error('exit denied'));
      __fs=null;document.dispatchEvent(new Event('fullscreenchange'));return Promise.resolve()};
    Object.defineProperty(screen.orientation,'lock',{configurable:true,value:()=>{__calls.lock++;
      if(__lockMode==='reject')return Promise.reject(new Error('no lock'));
      if(__lockMode==='pending')return new Promise(r=>window.__lockResolve=r);return Promise.resolve()}});
    Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>__calls.unlock++});`,
    );
  if (before) await evaluate(cdp, before);
  await evaluate(cdp, source);
  return { context, page, cdp, observed };
}
async function mouse(cdp, from, to) {
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...from });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...from,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    ...to,
    button: "left",
    buttons: 1,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...to,
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
const noEnter = async (cdp) =>
  assert.equal(await evaluate(cdp, "__calls.enter"), 0);

try {
  await run(
    "touch up/down; overlay; owned unlock and style restoration",
    async ({ cdp }) => {
      const before = await evaluate(
        cdp,
        "document.querySelector('#one video').getAttribute('style')",
      );
      await touch(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__fs.id"), "one");
      assert.equal(await evaluate(cdp, "__calls.click"), 0);
      await touch(cdp, up, from);
      await waitFor(cdp, "__fs===null");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 1);
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelector('#one video').getAttribute('style')||null",
        ),
        before,
      );
    },
  );
  await run(
    "select second video; native edge controls untouched",
    async ({ cdp }) => {
      await mouse(cdp, { x: 195, y: 480 }, { x: 195, y: 380 });
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__fs.id"), "two");
    },
  );
  await run(
    "dynamic insertion, replacement, removal and retry",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        "document.querySelector('#one video').remove();document.querySelector('#one').prepend(document.createElement('video'))",
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(
        cdp,
        "const v=document.querySelector('#one video');v.replaceWith(v.cloneNode())",
      );
      await waitFor(cdp, "__fs===null");
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===2");
    },
  );
  await run(
    "SPA navigation releases session and accepts new page video",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "history.pushState({},'', '/new')");
      await waitFor(cdp, "__fs===null");
      assert.equal(await evaluate(cdp, "__calls.unlock"), 1);
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===2");
    },
  );
  await run(
    "multiple videos in one wrapper choose video itself",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        "document.querySelector('#two video').remove();document.querySelector('.overlay').remove();const v=document.createElement('video');v.style.cssText='left:80%;width:20%';document.querySelector('#one').append(v)",
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(
        await evaluate(cdp, "__fs===document.querySelector('#one video')"),
        true,
      );
    },
  );
  for (const [name, a, b, opts] of [
    ["tap", from, from, {}],
    ["horizontal", from, { x: 285, y: 250 }, {}],
    ["diagonal", from, { x: 280, y: 160 }, {}],
    ["short", from, { x: 195, y: 220 }, {}],
    ["wrong direction", from, { x: 195, y: 290 }, {}],
    ["button", { x: 370, y: 305 }, { x: 370, y: 205 }, {}],
    ["slider", { x: 90, y: 306 }, { x: 90, y: 205 }, {}],
    ["native controls edge", { x: 195, y: 560 }, { x: 195, y: 460 }, {}],
    ["page scroll", { x: 190, y: 720 }, { x: 190, y: 600 }, {}],
    ["multitouch", from, up, { multi: true }],
    ["touch cancel", from, up, { cancel: true }],
  ])
    await run(name, async ({ cdp, observed }) => {
      await touch(cdp, a, b, opts);
      assert.equal(observed.enter, 0);
      const calls = await evaluate(cdp, "window.__calls");
      if (!calls) {
        assert.equal(name, "horizontal");
        return;
      }
      assert.equal(calls.enter, 0);
      if (name === "tap") assert.equal(calls.click, 1);
      if (name === "page scroll") await waitFor(cdp, "scrollY>0");
    });
  await run(
    "reversed claimed gesture never becomes valid again",
    async ({ cdp }) => {
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        ...from,
        button: "left",
        buttons: 1,
        clickCount: 1,
      });
      for (const y of [230, 270, 150])
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x: 195,
          y,
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
      await noEnter(cdp);
    },
  );
  for (const type of [
    "pointerdown",
    "pointermove",
    "pointerup",
    "touchstart",
    "touchmove",
    "touchend",
  ]) {
    await run(
      `site owns ${type} via preventDefault`,
      async ({ cdp }) => {
        if (type.startsWith("touch")) await touch(cdp, from, up);
        else await mouse(cdp, from, up);
        await noEnter(cdp);
      },
      {
        before: `document.querySelector('.overlay').addEventListener('${type}',e=>e.preventDefault(),{passive:false})`,
      },
    );
  }
  await run("later window release listener can cancel", async ({ cdp }) => {
    await evaluate(
      cdp,
      "window.addEventListener('pointerup',e=>e.preventDefault())",
    );
    await mouse(cdp, from, up);
    await noEnter(cdp);
  });
  await run(
    "site stops propagation; generic handler never requests",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await noEnter(cdp);
    },
    {
      before:
        "document.querySelector('.overlay').addEventListener('pointerup',e=>e.stopPropagation())",
    },
  );
  await run(
    "site fullscreen transition during release wins",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await noEnter(cdp);
      assert.equal(await evaluate(cdp, "__fs===document.body"), true);
    },
    {
      before:
        "document.querySelector('.overlay').addEventListener('pointerup',()=>{__fs=document.body;document.dispatchEvent(new Event('fullscreenchange'))})",
    },
  );
  await run("external fullscreen up/down never owned", async ({ cdp }) => {
    await evaluate(cdp, "__fs=document.body");
    await mouse(cdp, from, up);
    await mouse(cdp, up, from);
    await noEnter(cdp);
    assert.equal(await evaluate(cdp, "__calls.exit"), 0);
    assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
  });
  for (const mode of ["unsupported", "reject", "throw"])
    await run(
      `fullscreen ${mode} preserves original state`,
      async ({ cdp }) => {
        await evaluate(cdp, `__mode='${mode}'`);
        await mouse(cdp, from, up);
        await waitFor(
          cdp,
          "document.querySelector('[data-video-swipe-status]')",
        );
        assert.equal(await evaluate(cdp, "__fs"), null);
        assert.equal(await evaluate(cdp, "__calls.lock"), 0);
        assert.equal(
          await evaluate(
            cdp,
            "document.querySelectorAll('[data-video-swipe-fullscreen]').length",
          ),
          0,
        );
      },
    );
  for (const mode of ["reject", "missing"])
    await run(
      `orientation ${mode} keeps fullscreen; no unowned unlock`,
      async ({ cdp }) => {
        await evaluate(
          cdp,
          mode === "reject"
            ? "__lockMode='reject'"
            : "Object.defineProperty(screen.orientation,'lock',{value:undefined,configurable:true})",
        );
        await mouse(cdp, from, up);
        await waitFor(
          cdp,
          "document.querySelector('[data-video-swipe-status=rotate]')",
        );
        assert.equal(await evaluate(cdp, "__fs.id"), "one");
        await evaluate(cdp, "document.exitFullscreen()");
        assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
      },
    );
  await run(
    "late orientation success after Escape is released",
    async ({ cdp }) => {
      await evaluate(cdp, "__lockMode='pending'");
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "document.exitFullscreen();__lockResolve()");
      await waitFor(cdp, "__calls.unlock===1");
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelectorAll('[data-video-swipe-fullscreen]').length",
        ),
        0,
      );
    },
  );
  await run(
    "pending fullscreen after navigation exits without lock",
    async ({ cdp }) => {
      await evaluate(cdp, "__mode='pending'");
      await mouse(cdp, from, up);
      await evaluate(cdp, "history.pushState({},'', '/new')");
      await new Promise((r) => setTimeout(r, 550));
      await evaluate(cdp, "__enterResolve()");
      await waitFor(cdp, "__calls.exit===1");
      assert.equal(await evaluate(cdp, "__calls.lock"), 0);
    },
  );
  await run(
    "exit rejection keeps session for down-swipe retry",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(cdp, "__mode='exit-reject'");
      await mouse(cdp, up, from);
      await waitFor(
        cdp,
        "document.querySelector('[data-video-swipe-status=exit]')",
      );
      assert.equal(await evaluate(cdp, "__calls.unlock"), 0);
      await evaluate(cdp, "__mode='ok'");
      await mouse(cdp, up, from);
      await waitFor(cdp, "__calls.unlock===1");
    },
  );
  await run(
    "repeat injection installs one owner/menu/request",
    async ({ cdp }) => {
      await evaluate(cdp, source);
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__calls.enter"), 1);
      assert.equal(await evaluate(cdp, "__menus.length"), 1);
    },
  );
  await run(
    "disable menu persists hostname; reload leaves video untouched",
    async ({ cdp }) => {
      await evaluate(cdp, "__menus[0].fn()");
      assert.equal(
        await evaluate(
          cdp,
          "__store['video-swipe-fullscreen:enabled:v1:video.test']",
        ),
        false,
      );
      const store = await evaluate(cdp, "__store");
      await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
        source: `window.__store=${JSON.stringify(store)};window.__menus=[];window.__calls={enter:0};
          window.GM_getValue=(k,d)=>k in __store?__store[k]:d;
          window.GM_setValue=(k,v)=>__store[k]=v;
          window.GM_registerMenuCommand=(label,fn)=>__menus.push({label,fn});
          HTMLElement.prototype.requestFullscreen=()=>{__calls.enter++;return Promise.resolve()};\n${source}`,
      });
      await cdp.send("Page.reload");
      await waitFor(
        cdp,
        "document.readyState==='complete' && __menus.length===1",
      );
      await mouse(cdp, from, up);
      await noEnter(cdp);
      await evaluate(cdp, "__menus[0].fn()");
      assert.equal(
        await evaluate(
          cdp,
          "__store['video-swipe-fullscreen:enabled:v1:video.test']",
        ),
        true,
      );
    },
  );
  await run(
    "stored disabled hostname registers enable menu and does nothing",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await noEnter(cdp);
      assert.equal(await evaluate(cdp, "__menus.length"), 1);
      await evaluate(cdp, "__menus[0].fn()");
      assert.equal(
        await evaluate(
          cdp,
          "__store['video-swipe-fullscreen:enabled:v1:video.test']",
        ),
        true,
      );
    },
    { enabled: false },
  );
  await run(
    "Nico legacy coexistence defaults generic off",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await noEnter(cdp);
      assert.equal(await evaluate(cdp, "__menus.length"), 1);
    },
    { hostname: "sp.nicovideo.jp" },
  );
  for (const order of ["generic-first", "nico-first"])
    await run(
      `Nico marker priority ${order}; one request only`,
      async ({ cdp }) => {
        if (order === "generic-first") await evaluate(cdp, nicoSource);
        await mouse(cdp, from, up);
        await waitFor(cdp, "__calls.lock===1");
        assert.equal(await evaluate(cdp, "__calls.enter"), 1);
        assert.equal(
          await evaluate(
            cdp,
            "document.querySelectorAll('[data-video-swipe-fullscreen]').length",
          ),
          0,
        );
      },
      {
        hostname: "sp.nicovideo.jp",
        enabled: true,
        before: `document.querySelector('#one video').dataset.name='video-content';${order === "nico-first" ? nicoSource : ""}`,
      },
    );
  await run(
    "open shadow root dynamically attached; controls remain excluded",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        `document.querySelector('#one').remove();const host=document.createElement('div');host.id='host';host.style.cssText='position:absolute;top:100px;left:0;width:390px;height:219px';
      document.body.append(host);host.attachShadow({mode:'open'}).innerHTML='<style>div,video{position:absolute;inset:0;width:100%;height:100%}button{position:absolute;right:0;bottom:0}</style><div id="shadow-player"><video></video><button>play</button></div>'`,
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      assert.equal(await evaluate(cdp, "__fs.id"), "host");
      await mouse(cdp, up, from);
      await waitFor(cdp, "__calls.unlock===1");
    },
  );
  await run(
    "closed shadow root is not guessed through host",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        `document.querySelector('#one').remove();const host=document.createElement('div');host.style.cssText='position:absolute;top:100px;width:390px;height:219px';document.body.append(host);
      host.attachShadow({mode:'closed'}).innerHTML='<video style="width:100%;height:100%"></video>'`,
      );
      await mouse(cdp, from, up);
      await noEnter(cdp);
    },
  );
  await run(
    "site style updates during fullscreen are preserved",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
      await evaluate(
        cdp,
        "document.querySelector('#one video').style.setProperty('width','88%')",
      );
      await evaluate(cdp, "document.exitFullscreen()");
      assert.equal(
        await evaluate(cdp, "document.querySelector('#one video').style.width"),
        "88%",
      );
    },
  );
  await run("pagehide releases only acquired lock", async ({ cdp }) => {
    await mouse(cdp, from, up);
    await waitFor(cdp, "__calls.lock===1");
    await evaluate(cdp, "window.dispatchEvent(new Event('pagehide'))");
    await waitFor(cdp, "__calls.unlock===1");
  });
  for (const allowed of [true, false])
    await run(
      `cross-origin iframe permission ${allowed}`,
      async ({ cdp, context, page }) => {
        const frameContexts = new Map();
        cdp.on("Runtime.executionContextCreated", (e) => {
          if (e.context.auxData?.isDefault)
            frameContexts.set(e.context.auxData.frameId, e.context.id);
        });
        await evaluate(
          cdp,
          `document.body.innerHTML='<iframe id="frame" src="https://frame.test/embed" ${allowed ? 'allow="fullscreen"' : ""} style="position:absolute;inset:0;width:390px;height:844px;border:0"></iframe>'`,
        );
        await waitFor(
          cdp,
          "document.querySelector('#frame')?.contentWindow!==null",
        );
        let frame, child;
        const deadline = Date.now() + 4500;
        while (Date.now() < deadline) {
          frame = page
            .frames()
            .find((f) => f.url() === "https://frame.test/embed");
          if (frame) break;
          await new Promise((r) => setTimeout(r, 20));
        }
        assert.ok(frame, "embedded frame loaded");
        try {
          child = await context.newCDPSession(frame);
        } catch {
          const tree = (
            await cdp.send("Page.getFrameTree")
          ).frameTree.childFrames.find(
            (f) => f.frame.url === "https://frame.test/embed",
          );
          const contextId = frameContexts.get(tree.frame.id);
          assert.ok(contextId);
          child = {
            send: (method, params) =>
              cdp.send(
                method,
                method === "Runtime.evaluate"
                  ? { ...params, contextId }
                  : params,
              ),
          };
        }
        await waitFor(
          child,
          "document.readyState==='complete' && !!document.querySelector('#one')",
        );
        await evaluate(
          child,
          "window.GM_getValue=(k,d)=>d;window.GM_registerMenuCommand=()=>{};window.GM_setValue=()=>{};window.__frameTrace=[];for(const type of ['touchstart','touchmove','touchend'])window.addEventListener(type,e=>__frameTrace.push({type,target:e.target.tagName,cancelable:e.cancelable,prevented:e.defaultPrevented}),{passive:true})",
        );
        await evaluate(child, source);
        await waitFor(
          child,
          "document.querySelector('#one').getBoundingClientRect().height===219 && document.documentElement.hasAttribute('data-video-swipe-owner')",
        );
        // Wait for a composited frame after iframe insertion, so browser touch
        // hit testing targets the new frame rather than its previous parent DOM.
        await cdp.send("Page.captureScreenshot", { format: "png" });
        await touch(cdp, from, up);
        if (allowed) {
          try {
            await waitFor(child, "document.fullscreenElement?.id==='one'");
          } catch (error) {
            console.log(
              await evaluate(
                child,
                "({trace:__frameTrace,enabled:document.fullscreenEnabled,status:document.querySelector('[role=status]')?.textContent,activation:navigator.userActivation.isActive})",
              ),
            );
            throw error;
          }
          const r = await evaluate(
            child,
            "document.querySelector('#one video').getBoundingClientRect().toJSON()",
          );
          await touch(
            cdp,
            { x: r.width * 0.35, y: r.height / 2 - 40 },
            { x: r.width * 0.35, y: r.height / 2 + 40 },
          );
          await waitFor(child, "document.fullscreenElement===null");
        } else {
          await waitFor(
            child,
            "!!document.querySelector('[data-video-swipe-status=unsupported]')",
          );
          assert.equal(
            await evaluate(child, "document.fullscreenElement"),
            null,
          );
        }
        await noEnter(cdp); // parent never tries to own the iframe's gesture
      },
      { mock: false },
    );
  await run(
    "real fullscreen inside open shadow root uses retargeted API correctly",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        `document.querySelector('#one').remove();const host=document.createElement('div');host.style.cssText='position:absolute;left:0;top:100px;width:390px;height:219px';document.body.append(host);
      host.attachShadow({mode:'open'}).innerHTML='<div id="inner-player" style="position:relative;width:390px;height:219px"><video style="width:100%;height:100%"></video></div>'`,
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "document.fullscreenElement!==null");
      const r = await evaluate(
        cdp,
        "document.querySelector('[data-video-swipe-fullscreen]').getBoundingClientRect().toJSON()",
      );
      await mouse(
        cdp,
        { x: r.width * 0.35, y: r.height / 2 - 40 },
        { x: r.width * 0.35, y: r.height / 2 + 40 },
      );
      await waitFor(cdp, "document.fullscreenElement===null");
    },
    { mock: false },
  );
  for (const [width, height] of [
    [390, 844],
    [844, 390],
  ])
    await run(
      `real Fullscreen API ${width}x${height}; dimensions and restore`,
      async ({ cdp, page }) => {
        await mouse(cdp, { x: width / 2, y: 250 }, { x: width / 2, y: 150 });
        await waitFor(cdp, "document.fullscreenElement?.id==='one'");
        const rect = await evaluate(
          cdp,
          "({root:document.querySelector('#one').getBoundingClientRect().toJSON(),video:document.querySelector('#one video').getBoundingClientRect().toJSON(),w:innerWidth,h:innerHeight})",
        );
        assert.ok(Math.abs(rect.root.width - rect.w) < 2);
        assert.ok(Math.abs(rect.root.height - rect.h) < 2);
        assert.ok(Math.abs(rect.video.width - rect.w) < 2);
        assert.ok(Math.abs(rect.video.height - rect.h) < 2);
        if (artifacts)
          await page.screenshot({
            path: `${artifacts}/fullscreen-${width}.png`,
          });
        await mouse(
          cdp,
          { x: rect.w / 2, y: rect.h / 2 - 40 },
          { x: rect.w / 2, y: rect.h / 2 + 40 },
        );
        await waitFor(cdp, "document.fullscreenElement===null");
        assert.equal(
          await evaluate(
            cdp,
            "document.querySelector('#one').getBoundingClientRect().height",
          ),
          219,
        );
        if (artifacts)
          await page.screenshot({ path: `${artifacts}/restored-${width}.png` });
      },
      { mock: false, width, height },
    );
  await run(
    "real site request consumes activation before generic release",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        "window.__sitePromise=null;document.querySelector('.overlay').addEventListener('pointerup',()=>{__sitePromise=document.querySelector('#one').requestFullscreen()})",
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "document.fullscreenElement?.id==='one'");
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelectorAll('[data-video-swipe-fullscreen]').length",
        ),
        0,
      );
    },
    { mock: false },
  );
  await run(
    "observed Twitch seek surface never requests fullscreen",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await noEnter(cdp);
      await touch(cdp, from, up);
      await noEnter(cdp);
    },
    {
      hostname: "m.twitch.tv",
      before:
        "document.querySelector('#one').dataset.testSelector='video-player__video-container';document.querySelector('.overlay').classList.add('seekbar-interaction-area')",
    },
  );
  await run(
    "Twitch seek exclusion is scoped to identified player",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
    },
    {
      hostname: "m.twitch.tv",
      before:
        "document.querySelector('.overlay').classList.add('seekbar-interaction-area')",
    },
  );
  await run(
    "matching class on unrelated hostname stays usable",
    async ({ cdp }) => {
      await mouse(cdp, from, up);
      await waitFor(cdp, "__calls.lock===1");
    },
    {
      before:
        "document.querySelector('#one').dataset.testSelector='video-player__video-container';document.querySelector('.overlay').classList.add('seekbar-interaction-area')",
    },
  );
  await run(
    "direct video fullscreen keeps landscape failure notice visible",
    async ({ cdp }) => {
      await evaluate(
        cdp,
        "document.querySelector('.overlay').remove();const second=document.createElement('video');second.style.cssText='left:80%;width:20%';document.querySelector('#one').append(second)",
      );
      await mouse(cdp, from, up);
      await waitFor(cdp, "document.fullscreenElement?.tagName==='VIDEO'");
      await waitFor(
        cdp,
        "document.querySelector('[data-video-swipe-status=rotate]')?.matches(':popover-open')",
      );
      const toast = await evaluate(
        cdp,
        "document.querySelector('[data-video-swipe-status]').getBoundingClientRect().toJSON()",
      );
      assert.ok(
        toast.width > 100 &&
          toast.height > 20 &&
          toast.top >= 0 &&
          toast.right <= 390,
      );
      await mouse(cdp, { x: 136, y: 330 }, { x: 136, y: 420 });
      await waitFor(cdp, "document.fullscreenElement===null");
      assert.equal(
        await evaluate(
          cdp,
          "document.querySelector('[data-video-swipe-status]')",
        ),
        null,
      );
    },
    { mock: false },
  );
  assert.deepEqual(errors, [], "no uncaught browser exceptions");
  const summary = `Video swipe fullscreen: ${cases} browser cases passed; no uncaught exceptions`;
  console.log(summary);
  if (artifacts)
    await writeFile(`${artifacts}/summary.txt`, `${summary}\n`, "utf8");
} finally {
  await browser.close();
}
