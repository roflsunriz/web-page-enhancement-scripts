import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const script = await readFile(
  new URL("../dist/nico-player-premium-controls.user.js", import.meta.url),
  "utf8",
);
assert.equal(
  (script.match(/\bimport\(/g) ?? []).length,
  1,
  "one native import must share the official ESM instance",
);
assert.equal(
  /System\.register|@require\s/.test(script),
  false,
  "no separate module loader or remote dependency",
);
const runtime = await readFile(
  new URL(
    "../test-fixtures/nico-player-premium-controls/official-jsx-runtime.js",
    import.meta.url,
  ),
  "utf8",
);
const withSwipe = process.argv.includes("--with-swipe");
const swipeScripts = withSwipe
  ? await Promise.all([
      readFile(
        new URL(
          "../dist/nico-mobile-swipe-fullscreen.user.js",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../dist/video-swipe-fullscreen.user.js", import.meta.url),
        "utf8",
      ),
    ])
  : [];
const fixture = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="modulepreload" href="https://res.sp.nicovideo.jp/web/assets/jsx-runtime-fixture.js"></head><body>
<div id="fixture-app"></div><script type="module">
import {j,fixtureOriginalRender} from 'https://res.sp.nicovideo.jp/web/assets/jsx-runtime-fixture.js';
window.fixtureRuntime=j;window.fixtureOriginalRender=fixtureOriginalRender;
window.fixtureAccount={id:0,isPremium:false};window.fixtureRights={isAvailable:false,payment:{isPremium:true}};
window.fixtureSettings={rate:1,resume:false,flip:false,forward:10,backward:10};window.fixtureSetterCalls=0;
const app=document.querySelector('#fixture-app');
function button(key,handler){const b=document.createElement('button');b.dataset.test=key;b.textContent=key;b.onclick=handler;return b}
function panel(){
 const p=j.jsx('panel',{isPremium:false,isVisible:true,skipAmountInfo:{forward:fixtureSettings.forward,backward:fixtureSettings.backward},isResumePlayback:fixtureSettings.resume,isFlipped:fixtureSettings.flip,
  setResumePlayback(v){fixtureSetterCalls++;fixtureSettings.resume=v;panel()},setFlipped(v){fixtureSetterCalls++;fixtureController.setFlip(v);panel()},onSkipAmountClick(){skip()},limitedSheetItemProps:{hqAudio:{isAppLimited:true}}}).props;
 const node=document.querySelector('#panel');node.replaceChildren();
 if(!p.isPremium){node.append(button('premium-registration',()=>{}));return}
 for(const [key,checked,set]of [['resume',p.isResumePlayback,p.setResumePlayback],['flip',p.isFlipped,p.setFlipped]]){const input=document.createElement('input');input.type='checkbox';input.dataset.test=key;input.checked=checked;input.onchange=()=>set(input.checked);node.append(input)}
 node.append(button('skip',p.onSkipAmountClick),button('rates',rates),button('close',()=>node.replaceChildren()));
}
function skip(){const node=document.querySelector('#panel');node.replaceChildren();for(const seconds of [5,10,15,30])node.append(button('skip-'+seconds,()=>{fixtureSetterCalls++;fixtureSettings.forward=seconds;panel()}));node.append(button('cancel',panel))}
function rates(){
 const p=j.jsx('rates',{currentPlaybackRate:fixtureSettings.rate,playbackRateList:[{playbackRate:2,available:false,label:'x2'},{playbackRate:1.75,available:false,label:'x1.75'},{playbackRate:1.5,available:false,label:'x1.5'},{playbackRate:1,available:true,label:'x1'}],onClickPlaybackRate(rate){fixtureSetterCalls++;fixtureController.setPlaybackRate(rate);panel()}}).props;
 const node=document.querySelector('#panel');node.replaceChildren();for(const rate of p.playbackRateList){const b=button('rate-'+rate.playbackRate,()=>p.onClickPlaybackRate(rate.playbackRate));b.disabled=!rate.available;node.append(b)}node.append(button('cancel',panel));
}
window.fixtureMount=(id)=>{
 app.replaceChildren();const wrapper=document.createElement('div');const video=document.createElement('video');video.dataset.name='video-content';video.style.width='320px';video.style.height='180px';wrapper.append(video);app.append(wrapper,button('settings',panel));
 const p=document.createElement('div');p.id='panel';app.append(p);
 const context={isPremium:false,storage:fixtureSettings};window.fixtureController={context,watch:{video:{id},viewer:fixtureAccount,payment:fixtureRights.payment},getVideoElement:()=>video,initializeWatch(){},getPlaybackRate:()=>fixtureSettings.rate,
  setPlaybackRate(rate){if(this.context.isPremium||rate<=1.25){fixtureSettings.rate=rate;video.playbackRate=rate}},setFlip(v){fixtureSettings.flip=v;video.style.transform=v?'scaleX(-1)':''}};
 window.fixtureOriginalContext=context;
 // React memoized facades retain the context used by the real controller methods.
 const root={memoizedProps:{},memoizedState:{memoizedState:[{...fixtureController}]},stateNode:null};root.stateNode={current:root};wrapper.__reactFiber$fixture=root;
 window.fixtureRecreate=()=>{window.fixtureRetired=fixtureController;window.fixtureRetiredContext=fixtureController.context;fixtureController={...fixtureController,context:{isPremium:false,storage:fixtureSettings}};window.fixtureOriginalContext=fixtureController.context;root.memoizedState.memoizedState=[{...fixtureController}];};
 app.append(button('comment',async()=>{await fetch('https://nvcomment.nicovideo.jp/v1/threads/fixture/comments',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer fixture-only'},body:JSON.stringify({body:'fixture comment',isPremium:false,commands:['red']})})}));
};fixtureMount(location.pathname.split('/').pop());window.fixtureReady=true;
</script></body></html>`;

const browser = await chromium.launch({ channel: "chrome", headless: true });
let passed = 0;
async function run(viewport) {
  const context = await browser.newContext({
    viewport,
    hasTouch: true,
    isMobile: viewport.width < 500,
  });
  const posts = [];
  const errors = [];
  await context.route("**/*", async (route) => {
    const request = route.request(),
      url = new URL(request.url());
    if (
      url.hostname === "sp.nicovideo.jp" &&
      url.pathname.startsWith("/watch/")
    )
      return route.fulfill({ contentType: "text/html", body: fixture });
    if (
      url.hostname === "res.sp.nicovideo.jp" &&
      url.pathname.endsWith("jsx-runtime-fixture.js")
    )
      return route.fulfill({
        contentType: "text/javascript",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: runtime + "\nexport const fixtureOriginalRender=n.jsx;",
      });
    if (url.hostname === "nvcomment.nicovideo.jp") {
      if (request.method() === "POST")
        posts.push({
          body: request.postData(),
          authorization: request.headers().authorization,
        });
      return route.fulfill({
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "https://sp.nicovideo.jp",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: '{"ok":true}',
      });
    }
    return route.fulfill({ status: 204, body: "" });
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const cdp = await context.newCDPSession(page);
  await cdp.send("Page.enable");
  if (withSwipe) {
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source:
        "window.GM_getValue=(_key,value)=>value;window.GM_setValue=()=>{};window.GM_registerMenuCommand=()=>1;",
    });
    for (const source of swipeScripts)
      await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source });
  }
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "window.fixtureOriginalFetch=window.fetch;window.fixtureOriginalXHR=window.XMLHttpRequest;",
  });
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: script });
  async function evaluate(expression) {
    const r = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (r.exceptionDetails)
      throw Error(r.exceptionDetails.exception.description);
    return r.result.value;
  }
  async function until(expression) {
    for (let attempt = 0; attempt < 50; attempt++) {
      if (await evaluate(expression)) return;
      await page.waitForTimeout(100);
    }
    throw Error("Timed out: " + expression);
  }
  async function click(key) {
    const point = await evaluate(
      `(()=>{const e=document.querySelector('[data-test=${JSON.stringify(key)}]');if(!e)throw Error('Missing control');const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`,
    );
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      ...point,
      button: "left",
      buttons: 1,
      clickCount: 1,
    });
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      ...point,
      button: "left",
      buttons: 0,
      clickCount: 1,
    });
  }
  async function check(name, condition) {
    assert.equal(await evaluate(condition), true, name);
    passed++;
  }
  const status =
    "window[Symbol.for('web-page-enhancement-scripts.nico-player-premium-controls')].status()";
  try {
    await cdp.send("Page.navigate", {
      url: "https://sp.nicovideo.jp/watch/sm100",
    });
    await until(
      `window.fixtureReady&&${status}.runtime&&${status}.controllers===1`,
    );
    await check(
      "enabling eligibility does not apply any settings",
      "fixtureSetterCalls===0&&fixtureSettings.rate===1&&!fixtureSettings.resume&&!fixtureSettings.flip&&fixtureSettings.forward===10&&fixtureController.context.storage===fixtureSettings",
    );
    await check(
      "account and rights retain real values",
      "!fixtureAccount.isPremium&&!fixtureRights.isAvailable&&fixtureRights.payment.isPremium&&fixtureController.watch.viewer===fixtureAccount",
    );
    await check(
      "requests and authentication transports remain original",
      "fetch===fixtureOriginalFetch&&XMLHttpRequest===fixtureOriginalXHR",
    );
    await click("settings");
    await check(
      "official panel exposes controls without registration",
      "!!document.querySelector('[data-test=resume]')&&!!document.querySelector('[data-test=flip]')&&!document.querySelector('[data-test=premium-registration]')",
    );
    await click("resume");
    await check(
      "resume ON is individually selected",
      "fixtureSettings.resume&&!fixtureSettings.flip&&fixtureSettings.rate===1",
    );
    await click("resume");
    await check(
      "resume OFF is individually selected",
      "!fixtureSettings.resume",
    );
    await click("flip");
    await check(
      "mirror ON reaches official view",
      "fixtureSettings.flip&&document.querySelector('video').style.transform==='scaleX(-1)'",
    );
    await click("flip");
    await check(
      "mirror OFF reaches official view",
      "!fixtureSettings.flip&&document.querySelector('video').style.transform===''",
    );
    await click("skip");
    await click("skip-30");
    await check(
      "skip uses official setter and retains other choices",
      "fixtureSettings.forward===30&&fixtureSettings.backward===10&&!fixtureSettings.resume&&!fixtureSettings.flip",
    );
    await click("rates");
    await check(
      "premium rate options can be selected",
      "!document.querySelector('[data-test=rate-2]').disabled",
    );
    await click("rate-2");
    await check(
      "rate reaches player controller and native video",
      "fixtureSettings.rate===2&&document.querySelector('video').playbackRate===2",
    );
    await click("rates");
    await click("rate-1");
    await check(
      "rate can return to normal",
      "fixtureSettings.rate===1&&document.querySelector('video').playbackRate===1",
    );
    await click("rates");
    await click("cancel");
    await check(
      "cancel does not change selections",
      "fixtureSettings.rate===1&&fixtureSettings.forward===30",
    );
    await click("close");
    await click("settings");
    await check(
      "reopening keeps selected settings",
      "!document.querySelector('[data-test=flip]').checked&&fixtureSettings.forward===30",
    );
    await evaluate(
      "window.fixtureSameVideo=fixtureController.getVideoElement();fixtureRecreate()",
    );
    await click("rates");
    await check(
      "same-DOM recreation is refreshed before the official click",
      "fixtureController.context.isPremium&&!fixtureRetiredContext.isPremium&&fixtureController.getVideoElement()===fixtureSameVideo&&fixtureSettings.rate===1&&!fixtureSettings.flip",
    );
    await click("rate-2");
    await check(
      "replacement controller and video agree on the chosen rate",
      "fixtureController.getPlaybackRate()===2&&fixtureSameVideo.playbackRate===2",
    );
    await click("rates");
    await click("rate-1");
    await click("flip");
    await check(
      "replacement controller mirror and checkbox agree",
      "fixtureSettings.flip&&document.querySelector('[data-test=flip]').checked&&fixtureSameVideo.style.transform==='scaleX(-1)'",
    );
    await click("flip");
    await click("comment");
    await until("true");
    await page.waitForTimeout(50);
    assert.equal(posts.length, 1);
    assert.deepEqual(JSON.parse(posts[0].body), {
      body: "fixture comment",
      isPremium: false,
      commands: ["red"],
    });
    assert.equal(posts[0].authorization, "Bearer fixture-only");
    passed++;
    await evaluate(
      "window.fixtureOld=fixtureController;window.fixtureOldContext=fixtureOriginalContext;history.pushState({},'', '/watch/sm200');fixtureMount('sm200')",
    );
    await until(
      `${status}.controllers===1&&fixtureController.context.isPremium&&fixtureOld.context===fixtureOldContext`,
    );
    await check(
      "SPA restores previous controller and activates replacement without altering settings",
      "fixtureOld.context===fixtureOldContext&&fixtureSettings.forward===30&&fixtureSettings.rate===1",
    );
    await click("settings");
    await check(
      "SPA replacement uses official controls",
      "!!document.querySelector('[data-test=resume]')",
    );
    await evaluate("history.pushState({},'', '/mylist')");
    await until(`!${status}.runtime&&${status}.controllers===0`);
    await check(
      "leaving watch restores only owned runtime and controller state",
      "fixtureRuntime.jsx===fixtureOriginalRender&&fixtureController.context===fixtureOriginalContext",
    );
    await evaluate("history.pushState({},'', '/watch/sm200')");
    await until(`${status}.runtime&&${status}.controllers===1`);
    await evaluate(
      "window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))",
    );
    await check(
      "pagehide restores eligibility and keeps feature settings",
      "!fixtureController.context.isPremium&&fixtureSettings.forward===30&&fixtureRuntime.jsx===fixtureOriginalRender",
    );
    await evaluate(
      "window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))",
    );
    await until(`${status}.runtime&&fixtureController.context.isPremium`);
    const before = await evaluate("fixtureRuntime.jsx.toString()");
    await evaluate(script);
    assert.equal(await evaluate("fixtureRuntime.jsx.toString()"), before);
    passed++;
    await check(
      "unrelated premium props preserve identity",
      "(()=>{const p={isPremium:false,changeComment(){}};return fixtureRuntime.jsx('comment',p).props===p})()",
    );
    assert.deepEqual(errors, [], "browser exceptions");
    passed++;
  } finally {
    await context.close();
  }
}
try {
  await run({ width: 390, height: 844 });
  await run({ width: 844, height: 390 });
  console.log(
    `nico-player-premium-controls${withSwipe ? " with both swipe scripts" : ""}: ${passed} browser assertions passed`,
  );
} finally {
  await browser.close();
}
