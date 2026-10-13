import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/youtube-oldest-player.user.js", import.meta.url),
  "utf8",
);
const fixture = JSON.parse(
  await readFile(
    new URL(
      "../test-fixtures/youtube-oldest-player/local58tv-sorted.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const find = (v, key) => {
  if (!v || typeof v !== "object") return;
  if (v[key]) return v[key];
  for (const x of Object.values(v)) {
    const r = find(x, key);
    if (r) return r;
  }
};
const chips = find(fixture.first, "chipBarViewModel");
const ordered = fixture.first.onResponseReceivedActions
  .flatMap((a) => a.reloadContinuationItemsCommand.continuationItems)
  .filter((x) => x.richItemRenderer)
  .slice(0, 3);
const ids = ordered.map(
  (x) => x.richItemRenderer.content.lockupViewModel.contentId,
);
const first = {
  onResponseReceivedActions: [
    {
      reloadContinuationItemsCommand: {
        continuationItems: [
          { chipBarViewModel: chips },
          ordered[0],
          {
            continuationItemRenderer: {
              continuationEndpoint: {
                continuationCommand: { token: "page-2" },
              },
            },
          },
        ],
      },
    },
  ],
};
const second = {
  onResponseReceivedActions: [
    {
      appendContinuationItemsAction: {
        continuationItems: [ordered[0], ...ordered.slice(1)],
      },
    },
  ],
};
const initial = {
  tabs: [
    {
      tabRenderer: {
        selected: true,
        endpoint: {
          commandMetadata: { webCommandMetadata: { url: "/@sample/videos" } },
        },
        content: { chipBarViewModel: chips },
      },
    },
  ],
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
// A short silent WAV drives a genuine HTMLMediaElement ended event offline.
const wav = Buffer.alloc(44 + 1600);
wav.write("RIFF");
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24);
wav.writeUInt32LE(16000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(1600, 40);
const media = `data:audio/wav;base64,${wav.toString("base64")}`;
let checks = 0;
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
const root = `document.getElementById('youtube-oldest-player')?.shadowRoot`;
async function wait(cdp, expression) {
  const end = Date.now() + 8000;
  while (Date.now() < end) {
    if (await evaluate(cdp, expression)) return;
    await new Promise((r) => setTimeout(r, 25));
  }
  throw Error(`Timeout: ${expression}`);
}
async function click(cdp, action) {
  const rect = await evaluate(
    cdp,
    `(()=>{const b=${root}.querySelector('[data-action="${action}"]');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
  );
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    button: "left",
    clickCount: 1,
    ...rect,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    button: "left",
    clickCount: 1,
    ...rect,
  });
}
async function setup(locale = "ja", width = 390, scenario = "ok") {
  const context = await browser.newContext({
    locale,
    viewport: { width, height: 640 },
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const requests = [];
  const errors = [];
  cdp.on("Runtime.exceptionThrown", (e) =>
    errors.push(e.exceptionDetails.text),
  );
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  cdp.on(
    "Fetch.requestPaused",
    async ({ requestId, request, resourceType }) => {
      try {
        let body = "",
          code = 200,
          type = "text/html";
        if (request.url.includes("/youtubei/")) {
          const token = JSON.parse(request.postData).continuation;
          requests.push(token);
          type = "application/json";
          if (scenario === "delay")
            await new Promise((r) => setTimeout(r, 900));
          code = scenario === "http" ? 503 : 200;
          const response = structuredClone(token === "page-2" ? second : first);
          if (scenario === "repeat")
            find(
              find(response, "continuationItemRenderer"),
              "continuationCommand",
            ).token = token;
          if (scenario === "sort")
            response.onResponseReceivedActions[0].reloadContinuationItemsCommand.continuationItems[0].chipBarViewModel.chips[2].chipViewModel.selected = false;
          body = JSON.stringify(response);
        } else if (resourceType === "Document") {
          const id = new URL(request.url).searchParams.get("v") ?? "";
          if (id) await new Promise((resolve) => setTimeout(resolve, 750));
          body = `<!doctype html><html lang="${locale}"><body><ytd-browse></ytd-browse><div id="movie_player"><video class="html5-main-video"></video><button id="native-autonav"><div class="ytp-autonav-toggle-button" aria-checked="true"></div></button></div><script>
            window.ytInitialData=${JSON.stringify(initial)};window.ytcfg={get:()=>({client:{clientName:'WEB',clientVersion:'fixture'}})};
            const p=document.getElementById('movie_player');p.getVideoData=()=>({video_id:${JSON.stringify(id)}});window.__state=1;window.__handlers=[];p.getPlayerState=()=>window.__state;
            p.addEventListener=(name,cb,...args)=>name==='onStateChange'?window.__handlers.push(cb):HTMLElement.prototype.addEventListener.call(p,name,cb,...args);
            p.removeEventListener=(name,cb,...args)=>name==='onStateChange'?(window.__handlers=window.__handlers.filter(v=>v!==cb)):HTMLElement.prototype.removeEventListener.call(p,name,cb,...args);
            document.getElementById('native-autonav').onclick=()=>{const t=document.querySelector('.ytp-autonav-toggle-button');t.setAttribute('aria-checked',t.getAttribute('aria-checked')==='true'?'false':'true')};
            window.__emitState=state=>{window.__state=state;for(const cb of window.__handlers)cb(state);if(state===0&&document.querySelector('.ytp-autonav-toggle-button').getAttribute('aria-checked')==='true'){history.pushState({},'', '/watch?v=xxxxxxxxxxx');window.dispatchEvent(new Event('yt-navigate-finish'))}};
          </script></body></html>`;
        }
        await cdp.send("Fetch.fulfillRequest", {
          requestId,
          responseCode: code,
          responseHeaders: [{ name: "Content-Type", value: type }],
          body: Buffer.from(body).toString("base64"),
        });
      } catch (error) {
        if (!String(error).includes("closed")) errors.push(String(error));
      }
    },
  );
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source });
  await cdp.send("Page.navigate", {
    url: "https://www.youtube.com/@sample/videos",
  });
  await wait(
    cdp,
    `${root}?.querySelector('[data-action="start"]:not(:disabled)')`,
  );
  return { context, cdp, requests, errors };
}
async function startQueue(cdp) {
  await click(cdp, "start");
  await wait(cdp, `${root}?.querySelector('[data-action="play"]')`);
  assert.match(
    await evaluate(cdp, `${root}.querySelector('p').textContent`),
    /3/,
  );
  checks++;
  await click(cdp, "play");
  await wait(
    cdp,
    `${root}?.querySelector('[data-action="next"]') && location.search.includes('${ids[0]}')`,
  );
  await wait(
    cdp,
    `document.querySelector('.ytp-autonav-toggle-button')?.getAttribute('aria-checked')==='false'`,
  );
  checks++;
}
try {
  const { context, cdp, requests, errors } = await setup();
  try {
    await startQueue(cdp);
    await evaluate(
      cdp,
      `(()=>{const f=document.createElement('iframe');f.src='/iframe';document.body.append(f)})()`,
    );
    await wait(
      cdp,
      `document.querySelector('iframe')?.contentDocument?.readyState==='complete'`,
    );
    assert.equal(
      await evaluate(
        cdp,
        `document.querySelector('iframe').contentDocument.getElementById('youtube-oldest-player')`,
      ),
      null,
    );
    checks++;
    assert.ok(
      await evaluate(cdp, `sessionStorage.getItem('youtube-oldest-player-v1')`),
    );
    checks++;
    assert.equal(requests.length, 2);
    checks++;
    assert.equal(
      await evaluate(
        cdp,
        `${root}.querySelector('[data-action="previous"]').disabled`,
      ),
      true,
    );
    checks++;
    // Ad and stale main-video events must never advance the queue.
    await evaluate(
      cdp,
      `document.getElementById('movie_player').classList.add('ad-showing');document.querySelector('video').dispatchEvent(new Event('ended'));`,
    );
    assert.equal(
      await evaluate(cdp, `new URL(location.href).searchParams.get('v')`),
      ids[0],
    );
    checks++;
    await evaluate(
      cdp,
      `document.getElementById('movie_player').classList.remove('ad-showing');document.getElementById('movie_player').getVideoData=()=>({video_id:'xxxxxxxxxxx'});document.querySelector('video').dispatchEvent(new Event('ended'));`,
    );
    assert.equal(
      await evaluate(cdp, `new URL(location.href).searchParams.get('v')`),
      ids[0],
    );
    checks++;
    await evaluate(
      cdp,
      `document.getElementById('movie_player').getVideoData=()=>({video_id:'${ids[0]}'});`,
    );
    await click(cdp, "pause");
    await evaluate(cdp, `window.__emitState(0)`);
    await evaluate(
      cdp,
      `document.querySelector('video').dispatchEvent(new Event('ended'))`,
    );
    assert.equal(
      await evaluate(cdp, `new URL(location.href).searchParams.get('v')`),
      ids[0],
    );
    checks++;
    await cdp.send("Page.reload");
    await wait(cdp, `${root}?.querySelector('[data-action="resume"]')`);
    checks++;
    await click(cdp, "resume");
    await evaluate(
      cdp,
      `(async()=>{const v=document.querySelector('video');v.src=${JSON.stringify(media)};await v.play()})()`,
    );
    await wait(
      cdp,
      `location.search.includes('${ids[1]}') && ${root}?.querySelector('[data-action="previous"]:not(:disabled)')`,
    );
    checks++;
    await click(cdp, "previous");
    await wait(
      cdp,
      `location.search.includes('${ids[0]}') && ${root}?.querySelector('[data-action="next"]')`,
    );
    checks++;
    await click(cdp, "next");
    await wait(
      cdp,
      `location.search.includes('${ids[1]}') && ${root}?.querySelector('[data-action="next"]')`,
    );
    await click(cdp, "next");
    await wait(
      cdp,
      `location.search.includes('${ids[2]}') && ${root}?.querySelector('[data-action="next"]:disabled')`,
    );
    checks++;
    await evaluate(cdp, `window.__emitState(0)`);
    await wait(cdp, `${root}.querySelector('p').textContent.includes('最後')`);
    checks++;
    await click(cdp, "stop");
    assert.equal(
      await evaluate(
        cdp,
        `document.querySelector('.ytp-autonav-toggle-button').getAttribute('aria-checked')`,
      ),
      "true",
    );
    checks++;
    assert.equal(
      await evaluate(cdp, `sessionStorage.getItem('youtube-oldest-player-v1')`),
      null,
    );
    checks++;
    assert.equal(
      await evaluate(cdp, `new URL(location.href).searchParams.has('yoc')`),
      false,
    );
    checks++;
    await cdp.send("Page.navigate", {
      url: "https://www.youtube.com/@sample/videos",
    });
    await wait(cdp, `${root}?.querySelector('[data-action="start"]')`);
    await startQueue(cdp);
    await evaluate(
      cdp,
      `history.pushState({},'', '/watch?v=xxxxxxxxxxx');window.dispatchEvent(new Event('yt-navigate-finish'))`,
    );
    assert.equal(
      await evaluate(cdp, `sessionStorage.getItem('youtube-oldest-player-v1')`),
      null,
    );
    checks++;
    assert.deepEqual(errors, []);
    checks++;
  } finally {
    await context.close();
  }
  for (const scenario of ["http", "repeat", "sort", "delay"]) {
    const { context, cdp, requests } = await setup("ja", 320, scenario);
    try {
      await click(cdp, "start");
      if (scenario === "delay") {
        await click(cdp, "cancel");
        await new Promise((r) => setTimeout(r, 1200));
        assert.equal(
          await evaluate(
            cdp,
            `${root}.querySelector('[data-action="play"]')===null`,
          ),
          true,
        );
      } else {
        await wait(
          cdp,
          `${root}.querySelector('[data-action="start"]') && ${root}.querySelector('p').textContent.includes('取得できません')`,
        );
        assert.equal(
          await evaluate(
            cdp,
            `sessionStorage.getItem('youtube-oldest-player-v1')`,
          ),
          null,
        );
        assert.ok(requests.length <= 2);
      }
      checks++;
    } finally {
      await context.close();
    }
  }
  for (const [locale, width] of [
    ["en", 1920],
    ["ar", 320],
    ["ur", 375],
    ["fr", 768],
    ["ja", 2560],
  ]) {
    const { context, cdp } = await setup(locale, width);
    try {
      await click(cdp, "start");
      await wait(cdp, `${root}.querySelector('[data-action="play"]')`);
      assert.equal(
        await evaluate(
          cdp,
          `(()=>{const p=${root}.querySelector('section');const r=p.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&p.scrollWidth<=p.clientWidth+1})()`,
        ),
        true,
      );
      checks++;
      if (["ar", "ur"].includes(locale)) {
        assert.equal(
          await evaluate(cdp, `${root}.querySelector('section').dir`),
          "rtl",
        );
        checks++;
      }
      await click(cdp, "cancel");
      checks++;
      // Corruption is explicitly recovered on refresh, and duplicate injection is harmless.
      await evaluate(
        cdp,
        `sessionStorage.setItem('youtube-oldest-player-v1','{bad')`,
      );
      await cdp.send("Page.reload");
      await wait(cdp, `${root}?.querySelector('[data-action="start"]')`);
      assert.equal(
        await evaluate(
          cdp,
          `document.querySelectorAll('#youtube-oldest-player').length`,
        ),
        1,
      );
      checks++;
      assert.equal(
        await evaluate(
          cdp,
          `sessionStorage.getItem('youtube-oldest-player-v1')`,
        ),
        null,
      );
      checks++;
      await evaluate(cdp, source);
      assert.equal(
        await evaluate(
          cdp,
          `document.querySelectorAll('#youtube-oldest-player').length`,
        ),
        1,
      );
      checks++;
    } finally {
      await context.close();
    }
  }
  {
    const { context, cdp } = await setup();
    try {
      await click(cdp, "start");
      await wait(cdp, `${root}.querySelector('[data-action="play"]')`);
      await evaluate(
        cdp,
        `Storage.prototype.setItem=()=>{throw new DOMException('fixture quota','QuotaExceededError')}`,
      );
      await click(cdp, "play");
      await wait(
        cdp,
        `${root}.querySelector('p').textContent.includes('保存できません')`,
      );
      assert.equal(await evaluate(cdp, `location.pathname`), "/@sample/videos");
      checks++;
    } finally {
      await context.close();
    }
  }
  console.log(`YouTube oldest player: ${checks} browser checks passed`);
} finally {
  await browser.close();
}
