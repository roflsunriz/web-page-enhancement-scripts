import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const source = await readFile(
  new URL("../dist/youtube-oldest-player.user.js", import.meta.url),
  "utf8",
);
const dir = new URL("../artifacts/youtube-oldest/", import.meta.url);
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const reports = [];
const root = `document.getElementById('youtube-oldest-player')?.shadowRoot`;
async function evaluate(cdp, expression) {
  const r = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails)
    throw Error(
      r.exceptionDetails.exception?.description ?? r.exceptionDetails.text,
    );
  return r.result.value;
}
async function wait(cdp, expression, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      if (await evaluate(cdp, expression)) return;
    } catch (error) {
      if (
        !/navigated or closed|Cannot find context|Execution context was destroyed/.test(
          String(error),
        )
      )
        throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw Error(`Timeout: ${expression}`);
}
async function click(cdp, action) {
  await wait(
    cdp,
    `!document.getElementById('youtube-oldest-player')?.hidden && ${root}?.querySelector('[data-action="${action}"]')?.getBoundingClientRect().width>0`,
  );
  const point = await evaluate(
    cdp,
    `(()=>{const r=${root}.querySelector('[data-action="${action}"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
  );
  await wait(
    cdp,
    `document.readyState==='complete' && ${root}?.elementFromPoint(${point.x},${point.y})?.dataset.action===${JSON.stringify(action)}`,
  );
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    button: "left",
    clickCount: 1,
    ...point,
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    button: "left",
    clickCount: 1,
    ...point,
  });
}
try {
  for (const handle of process.argv[2]
    ? [process.argv[2]]
    : ["LOCAL58TV", "YouTube"]) {
    const context = await browser.newContext({
      locale: "ja",
      viewport: { width: 1280, height: 720 },
    });
    const report = { handle, date: "2026-10-13", steps: [], error: null };
    reports.push(report);
    let cdp;
    try {
      const page = await context.newPage();
      cdp = await context.newCDPSession(page);
      await cdp.send("Page.enable");
      await cdp.send("Runtime.enable");
      await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source });
      await cdp.send("Page.navigate", {
        url: `https://www.youtube.com/@${handle}/videos`,
      });
      await wait(
        cdp,
        `${root}?.querySelector('[data-action="start"]:not(:disabled)')`,
      );
      report.steps.push("channel-button");
      await click(cdp, "start");
      await wait(
        cdp,
        `${root}?.querySelector('[data-action="play"]') || ${root}?.querySelector('p').textContent.includes('取得できません')`,
        180000,
      );
      assert.ok(
        await evaluate(
          cdp,
          `${root}.querySelector('[data-action="play"]')!==null`,
        ),
      );
      report.collection = await evaluate(
        cdp,
        `${root}.querySelector('p').textContent`,
      );
      report.steps.push("all-continuations-collected");
      await click(cdp, "play");
      await wait(
        cdp,
        `location.pathname==='/watch' && !document.getElementById('youtube-oldest-player')?.hidden && ${root}?.querySelector('[data-action="next"]')`,
      );
      const queue = await evaluate(
        cdp,
        `JSON.parse(sessionStorage.getItem('youtube-oldest-player-v1'))`,
      );
      report.count = queue.videos.length;
      report.first = queue.videos[0];
      report.last = queue.videos.at(-1);
      report.steps.push("first-watch-navigation");
      await wait(
        cdp,
        `document.getElementById('movie_player')?.getVideoData?.().video_id === ${JSON.stringify(queue.videos[0].id)}`,
      );
      report.steps.push("official-player-id-matches");
      const before = await evaluate(
        cdp,
        `(()=>{const v=document.querySelector('#movie_player video');return {duration:v?.duration,paused:v?.paused,time:v?.currentTime,error:v?.error?.code,ad:document.getElementById('movie_player').classList.contains('ad-showing'),playability:window.ytInitialPlayerResponse?.playabilityStatus?.status}})()`,
      );
      report.playback = before;
      report.autonav = await evaluate(
        cdp,
        `[...document.querySelectorAll('.ytp-autonav-toggle-button')].map(e=>({tag:e.tagName,checked:e.getAttribute('aria-checked'),outer:e.outerHTML.slice(0,450)}))`,
      );
      // Seek only this signed-out, isolated public video. A real media end is required.
      if (handle === "LOCAL58TV") {
        await evaluate(
          cdp,
          `(()=>{window.__oldestTrace=[];const log=e=>{const p=document.getElementById('movie_player');const v=p?.querySelector('video');window.__oldestTrace.push({event:e.type??e,time:v?.currentTime,duration:v?.duration,ended:v?.ended,id:p?.getVideoData?.().video_id,url:new URL(location.href).searchParams.get('v'),state:p?.getPlayerState?.(),ad:p?.classList.contains('ad-showing')})};for(const event of ['ended','timeupdate','yt-navigate-start'])window.addEventListener(event,log,true);document.getElementById('movie_player')?.addEventListener('onStateChange',e=>log({type:'state-'+(e.data??e)}));})()`,
        );
        await wait(
          cdp,
          `(()=>{const p=document.getElementById('movie_player');const v=p?.querySelector('video');return !p?.classList.contains('ad-showing')&&v?.readyState>=2&&Number.isFinite(v.duration)&&v.duration>0})()`,
          45000,
        );
        await evaluate(
          cdp,
          `(()=>{const v=document.querySelector('#movie_player video');v.currentTime=v.duration-.5;void v.play().catch(()=>{})})()`,
        );
        await wait(
          cdp,
          `new URL(location.href).searchParams.get('v')===${JSON.stringify(queue.videos[1].id)}`,
          45000,
        );
        report.steps.push("real-video-ended-next");
        await wait(
          cdp,
          `${root}?.querySelector('[data-action="previous"]:not(:disabled)')`,
        );
        await click(cdp, "previous");
        await wait(
          cdp,
          `new URL(location.href).searchParams.get('v')===${JSON.stringify(queue.videos[0].id)} && ${root}?.querySelector('[data-action="pause"]')`,
        );
        report.steps.push("previous");
      }
      await click(cdp, "next");
      await wait(
        cdp,
        `new URL(location.href).searchParams.get('v')===${JSON.stringify(queue.videos[1].id)} && ${root}?.querySelector('[data-action="pause"]')`,
      );
      report.steps.push("manual-next");
      await click(cdp, "pause");
      await wait(cdp, `${root}?.querySelector('[data-action="resume"]')`);
      if (handle === "LOCAL58TV") {
        await wait(
          cdp,
          `document.getElementById('movie_player')?.getVideoData?.().video_id===${JSON.stringify(queue.videos[1].id)} && document.querySelector('#movie_player video')?.readyState>=2`,
          45000,
        );
        await evaluate(
          cdp,
          `(()=>{const v=document.querySelector('#movie_player video');v.currentTime=v.duration-.5;void v.play().catch(()=>{})})()`,
        );
        await wait(
          cdp,
          `document.getElementById('movie_player')?.getPlayerState?.()===0`,
          45000,
        );
        await new Promise((resolve) => setTimeout(resolve, 1200));
        assert.equal(
          await evaluate(cdp, `new URL(location.href).searchParams.get('v')`),
          queue.videos[1].id,
        );
        report.steps.push("paused-real-end-stays-current");
      }
      await cdp.send("Page.reload");
      await wait(cdp, `${root}?.querySelector('[data-action="resume"]')`);
      report.steps.push("paused-state-survives-reload");
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
      await writeFile(
        new URL(`${handle.toLowerCase()}-watch.png`, dir),
        Buffer.from(shot.data, "base64"),
      );
      await click(cdp, "stop");
      assert.equal(
        await evaluate(
          cdp,
          `sessionStorage.getItem('youtube-oldest-player-v1')`,
        ),
        null,
      );
      report.steps.push("stop-clears-queue");
      await wait(
        cdp,
        `document.querySelector('.ytp-autonav-toggle-button')?.getAttribute('aria-checked')===${JSON.stringify(String(queue.originalAutoplay))}`,
      );
      report.steps.push("native-autoplay-restored");
      console.log(handle, report.count, report.steps.join(", "));
    } catch (error) {
      report.error = String(error);
      if (cdp) {
        report.failureState = await evaluate(
          cdp,
          `({url:location.href,stored:!!sessionStorage.getItem('youtube-oldest-player-v1'),panel:${root}?.querySelector('section')?.textContent,host:!!document.getElementById('youtube-oldest-player'),video:document.getElementById('movie_player')?.getVideoData?.().video_id,trace:window.__oldestTrace?.slice(-12),api:document.getElementById('movie_player')?.getApiInterface?.().filter(v=>/autonav|state/i.test(v))})`,
        ).catch(() => null);
      }
      console.log(handle, report.error);
      console.log(report.failureState);
      if (cdp) {
        const shot = await cdp
          .send("Page.captureScreenshot", { format: "png" })
          .catch(() => null);
        if (shot)
          await writeFile(
            new URL(`${handle.toLowerCase()}-failure.png`, dir),
            Buffer.from(shot.data, "base64"),
          );
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(
    new URL("live-2026-10-13.json", dir),
    JSON.stringify(reports, null, 2),
  );
}
if (reports.some((report) => report.error)) process.exitCode = 1;
