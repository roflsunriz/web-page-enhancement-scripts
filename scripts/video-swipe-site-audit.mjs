// Public pages, fresh browser contexts, raw CDP input/measurement. No login,
// profile imports, extensions, API patches or browser security overrides.
import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const out = resolve(
  process.env.VIDEO_SWIPE_AUDIT ?? "artifacts/video-swipe-site-audit",
);
await mkdir(out, { recursive: true });
const source = await readFile(
  new URL("../dist/video-swipe-fullscreen.user.js", import.meta.url),
  "utf8",
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ua =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36";
const candidates = [
  {
    name: "youtube",
    urls: [
      "https://m.youtube.com/watch?v=aqz-KE-bpKQ",
      "https://m.youtube.com/watch?v=YE7VzlLtp-4",
    ],
  },
  {
    name: "vimeo",
    urls: ["https://vimeo.com/253905163", "https://vimeo.com/110644917"],
  },
  {
    name: "dailymotion",
    urls: [
      "https://www.dailymotion.com/video/x3a9qru",
      "https://www.dailymotion.com/video/x36f6l4",
    ],
  },
  {
    name: "nico",
    urls: [
      "https://sp.nicovideo.jp/watch/sm9",
      "https://sp.nicovideo.jp/watch/sm8628149",
    ],
  },
  {
    name: "twitch",
    urls: [
      "https://www.twitch.tv/twitch/videos",
      "https://www.twitch.tv/twitch/clips",
    ],
  },
  {
    name: "bilibili",
    urls: [
      "https://www.bilibili.com/video/BV1DT4y1z7a1/",
      "https://www.bilibili.com/video/BV1hK4y187dT/",
    ],
  },
];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
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
const inspect = `(()=>{
  const attrs=e=>e?Object.fromEntries([...e.attributes].filter(a=>/^(id|class|role|data-|aria-label|title|controls|playsinline)/.test(a.name)).map(a=>[a.name,a.value.slice(0,180)])):null;
  const ancestry=e=>{const out=[];for(let n=e,d=0;n&&d<7;d++,n=n.parentElement)out.push({tag:n.tagName,attrs:attrs(n),rect:n.getBoundingClientRect().toJSON()});return out};
  return {url:location.href,title:document.title,text:document.body?.innerText.slice(0,1200),scrollY,fs:attrs(document.fullscreenElement),fullscreenEnabled:document.fullscreenEnabled,
    videos:[...document.querySelectorAll('video')].map(v=>({attrs:attrs(v),rect:v.getBoundingClientRect().toJSON(),paused:v.paused,readyState:v.readyState,currentTime:v.currentTime,error:v.error?.code,ancestry:ancestry(v)})),
    iframes:[...document.querySelectorAll('iframe')].map(e=>({src:e.src,allow:e.allow,allowFullscreen:e.allowFullscreen,rect:e.getBoundingClientRect().toJSON()})),
    buttons:[...document.querySelectorAll('button,[role=button]')].map(e=>({attrs:attrs(e),text:e.textContent?.trim().slice(0,70),rect:e.getBoundingClientRect().toJSON()})).filter(b=>b.rect.width>0&&b.rect.height>0).slice(0,65),
    links:[...document.querySelectorAll('a[href]')].map(e=>e.href).filter(h=>/twitch.tv\\/(videos\\/\\d+|[^/]+\\/clip\\/)|clips.twitch.tv\\//.test(h)).slice(0,12),trace:window.__swipeAuditTrace||[]}
})()`;
async function touch(cdp, a, b = a) {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...a, id: 1 }],
  });
  if (b.x !== a.x || b.y !== a.y) {
    for (let i = 1; i <= 4; i++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          {
            x: a.x + ((b.x - a.x) * i) / 4,
            y: a.y + ((b.y - a.y) * i) / 4,
            id: 1,
          },
        ],
      });
      await delay(35);
    }
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await delay(800);
}
async function audit(candidate) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    userAgent: ua,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  const report = {
    name: candidate.name,
    browser: await browser.version(),
    viewport: "390x844",
    ua,
    attempts: [],
  };
  let status = null;
  const mainFrameId = (await cdp.send("Page.getFrameTree")).frameTree.frame.id;
  const contexts = new Map();
  cdp.on("Runtime.executionContextCreated", (e) => {
    if (e.context.auxData?.isDefault)
      contexts.set(e.context.auxData.frameId, e.context.id);
  });
  cdp.on("Network.responseReceived", (e) => {
    if (e.type === "Document" && e.frameId === mainFrameId)
      status = e.response.status;
  });
  try {
    for (let index = 0; index < candidate.urls.length; index++) {
      const url = candidate.urls[index];
      const attempt = { requested: url, status: null, measurements: [] };
      report.attempts.push(attempt);
      console.log(`AUDIT ${candidate.name} ${url}`);
      try {
        status = null;
        const navigation = await cdp.send("Page.navigate", { url });
        if (navigation.errorText) {
          attempt.error = navigation.errorText;
          continue;
        }
        const deadline = Date.now() + 18000;
        while (Date.now() < deadline) {
          const state = await evaluate(cdp, "document.readyState").catch(
            () => "loading",
          );
          if (state === "complete") break;
          await delay(400);
        }
        await delay(6000);
        attempt.status = status;
        let state = await evaluate(cdp, inspect);
        attempt.measurements.push({ phase: "loaded", state });
        // Discover an actual public VOD/clip from Twitch's rendered links.
        if (
          candidate.name === "twitch" &&
          state.links.length &&
          !/\/videos\/\d+|\/clip\//.test(state.url)
        ) {
          candidate.urls.splice(index + 1, 0, state.links[0]);
        }
        // App prompts / consent are left as evidence; no challenge bypass.
        // Use a close button only when its intent is explicitly visible.
        const close = state.buttons.find(
          (b) =>
            /閉じる|close|not now|later|keep using web|continue watching/i.test(
              [b.attrs?.["aria-label"], b.attrs?.title, b.text].join(" "),
            ) &&
            b.rect.y >= 0 &&
            b.rect.bottom <= 844,
        );
        if (close) {
          await touch(cdp, {
            x: close.rect.x + close.rect.width / 2,
            y: close.rect.y + close.rect.height / 2,
          });
          state = await evaluate(cdp, inspect);
          attempt.measurements.push({ phase: "visible-dismiss", state });
        }
        const targets = [{ cdp, offset: { x: 0, y: 0 }, state, label: "top" }];
        for (const frame of page
          .frames()
          .filter((f) => f !== page.mainFrame())) {
          try {
            let frameCdp;
            try {
              frameCdp = await context.newCDPSession(frame);
              await frameCdp.send("Runtime.enable");
            } catch {
              const tree = (await cdp.send("Page.getFrameTree")).frameTree;
              const flatten = (node) => [
                node.frame,
                ...(node.childFrames ?? []).flatMap(flatten),
              ];
              const entry = flatten(tree).find((f) => f.url === frame.url());
              const id = entry && contexts.get(entry.id);
              if (!id)
                throw new Error(
                  "No observable default frame execution context",
                );
              frameCdp = {
                send: (method, params) =>
                  cdp.send(
                    method,
                    method === "Runtime.evaluate"
                      ? { ...params, contextId: id }
                      : params,
                  ),
              };
            }
            const frameState = await evaluate(frameCdp, inspect);
            const iframe = state.iframes.find(
              (f) =>
                f.src &&
                (frame.url().startsWith(f.src) ||
                  f.src.startsWith(frame.url())),
            );
            if (iframe)
              targets.push({
                cdp: frameCdp,
                offset: { x: iframe.rect.x, y: iframe.rect.y },
                state: frameState,
                label: frame.url(),
              });
            attempt.measurements.push({
              phase: "frame-loaded",
              frame: frame.url(),
              state: frameState,
            });
          } catch (error) {
            attempt.measurements.push({
              phase: "frame-unavailable",
              frame: frame.url(),
              reason: String(error).slice(0, 220),
            });
          }
        }
        let exercised = false;
        for (const target of targets) {
          const video = target.state.videos.find(
            (v) =>
              v.rect.width >= 120 &&
              v.rect.height >= 100 &&
              v.rect.y + target.offset.y < 744 &&
              v.rect.bottom + target.offset.y > 100,
          );
          if (!video) continue;
          const rect = video.rect;
          const x = rect.x + rect.width * 0.35 + target.offset.x;
          const y = Math.max(
            70,
            Math.min(740, rect.y + rect.height / 2 + target.offset.y),
          );
          const travel = Math.max(70, Math.min(110, rect.height * 0.32));
          if (x < 0 || x > 390) continue;
          exercised = true;
          await evaluate(
            target.cdp,
            `window.__swipeAuditTrace=[];for(const type of ['touchstart','touchmove','touchend','fullscreenchange'])window.addEventListener(type,e=>setTimeout(()=>__swipeAuditTrace.push({type,prevented:e.defaultPrevented,target:e.target?.tagName,attrs:e.target?.getAttribute?.('class'),fs:document.fullscreenElement?.tagName||null,scrollY}),0),{passive:true,capture:true})`,
          );
          if (video.paused)
            await touch(cdp, {
              x: rect.x + rect.width / 2 + target.offset.x,
              y,
            });
          await delay(3200); // let normal playback controls fade before swiping
          attempt.measurements.push({
            phase: "native-tap-play",
            frame: target.label,
            state: await evaluate(target.cdp, inspect),
          });
          await touch(cdp, { x, y: y + travel / 2 }, { x, y: y - travel / 2 });
          let after = await evaluate(target.cdp, inspect);
          attempt.measurements.push({
            phase: "native-up",
            frame: target.label,
            state: after,
          });
          await touch(cdp, { x, y: y - travel / 2 }, { x, y: y + travel / 2 });
          attempt.measurements.push({
            phase: "native-down",
            frame: target.label,
            state: await evaluate(target.cdp, inspect),
          });
          // Test native full-screen button then down swipe when up did not enter.
          if (!after.fs) {
            await touch(cdp, { x, y });
            after = await evaluate(target.cdp, inspect);
            const button = after.buttons.find(
              (b) =>
                /fullscreen|全画面|全屏|フルスクリーン/i.test(
                  [
                    b.attrs?.["aria-label"],
                    b.attrs?.title,
                    b.attrs?.["data-a-target"],
                    b.text,
                  ].join(" "),
                ) &&
                b.rect.width > 0 &&
                b.rect.height > 0,
            );
            if (button) {
              await touch(cdp, {
                x: button.rect.x + button.rect.width / 2 + target.offset.x,
                y: button.rect.y + button.rect.height / 2 + target.offset.y,
              });
              const fullscreen = await evaluate(target.cdp, inspect);
              attempt.measurements.push({
                phase: "native-fullscreen-button",
                frame: target.label,
                state: fullscreen,
              });
              const fsVideo = fullscreen.videos.find(
                (v) => v.rect.width > 120 && v.rect.height > 100,
              );
              if (fullscreen.fs && fsVideo) {
                const r = fsVideo.rect,
                  fy = r.y + r.height / 2;
                await touch(
                  cdp,
                  { x: r.x + r.width * 0.35, y: fy - 45 },
                  { x: r.x + r.width * 0.35, y: fy + 45 },
                );
                attempt.measurements.push({
                  phase: "native-fullscreen-down",
                  frame: target.label,
                  state: await evaluate(target.cdp, inspect),
                });
              }
            }
          }
          await evaluate(
            target.cdp,
            "document.fullscreenElement?document.exitFullscreen():undefined",
          ).catch(() => {});
          await delay(1200); // fullscreen exit can relayout the player asynchronously
          // Inject the actual local distribution in this fresh, disposable page.
          await evaluate(
            target.cdp,
            "window.GM_getValue=(k,d)=>location.hostname==='sp.nicovideo.jp'?true:d;window.GM_setValue=()=>{};window.GM_registerMenuCommand=()=>{}",
          );
          await evaluate(target.cdp, source);
          let current = await evaluate(target.cdp, inspect);
          if (candidate.name === "twitch") {
            const resume = current.buttons.find(
              (b) =>
                b.attrs?.["data-a-target"] === "player-play-pause-button" &&
                b.attrs?.["data-a-player-state"] === "paused",
            );
            if (resume) {
              await touch(cdp, {
                x: resume.rect.x + resume.rect.width / 2 + target.offset.x,
                y: resume.rect.y + resume.rect.height / 2 + target.offset.y,
              });
              await delay(3200);
              current = await evaluate(target.cdp, inspect);
              attempt.measurements.push({
                phase: "generic-resume-playback",
                frame: target.label,
                state: current,
              });
            }
          }
          const v = current.videos.find(
            (v) => v.rect.width > 120 && v.rect.height > 100,
          );
          if (v) {
            const r = v.rect,
              gx = r.x + r.width * 0.35 + target.offset.x,
              gy = r.y + r.height / 2 + target.offset.y;
            await touch(cdp, { x: gx, y: gy }, { x: gx, y: gy - 80 });
            const fsState = await evaluate(target.cdp, inspect);
            attempt.measurements.push({
              phase: "generic-up",
              frame: target.label,
              state: fsState,
            });
            const fv = fsState.videos.find(
              (v) => v.rect.width > 120 && v.rect.height > 100,
            );
            if (fsState.fs && fv) {
              await delay(3200);
              const r = fv.rect,
                gy = r.y + r.height / 2;
              await touch(
                cdp,
                { x: r.x + r.width * 0.35, y: gy - 40 },
                { x: r.x + r.width * 0.35, y: gy + 40 },
              );
              attempt.measurements.push({
                phase: "generic-down",
                frame: target.label,
                state: await evaluate(target.cdp, inspect),
              });
            }
          }
          break;
        }
        attempt.exercised = exercised;
        await cdp
          .send("Page.captureScreenshot", { format: "png" })
          .then((r) =>
            writeFile(
              `${out}/${candidate.name}-${index}.png`,
              Buffer.from(r.data, "base64"),
            ),
          );
        await writeFile(
          `${out}/${candidate.name}.json`,
          JSON.stringify(report, null, 2),
          "utf8",
        );
        console.log(
          `RESULT ${candidate.name}: status=${attempt.status} videos=${state.videos.length} exercised=${exercised}`,
        );
        if (exercised && targetPlayable(attempt)) break;
      } catch (error) {
        attempt.error = String(error);
        console.log(`ERROR ${candidate.name} ${String(error).slice(0, 160)}`);
      }
      if (index >= 3) break;
    }
    await writeFile(
      `${out}/${candidate.name}.json`,
      JSON.stringify(report, null, 2),
      "utf8",
    );
    return report;
  } finally {
    await context.close();
  }
}
function targetPlayable(attempt) {
  return attempt.measurements.some(
    (m) =>
      m.phase === "native-tap-play" &&
      m.state.videos.some((v) => v.readyState >= 2),
  );
}
try {
  const selected = process.env.VIDEO_SWIPE_SITES
    ? candidates.filter((c) =>
        process.env.VIDEO_SWIPE_SITES.split(",").includes(c.name),
      )
    : candidates;
  for (let index = 0; index < selected.length; index += 2) {
    const results = await Promise.allSettled(
      selected.slice(index, index + 2).map(audit),
    );
    for (const result of results)
      if (result.status === "rejected") console.log(String(result.reason));
  }
} finally {
  await browser.close();
}
