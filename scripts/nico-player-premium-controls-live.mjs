// Optional live verification. Uses a fresh Chrome context, no existing login/profile.
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const script = await readFile(
  new URL("../dist/nico-player-premium-controls.user.js", import.meta.url),
  "utf8",
);
const inspect = await readFile(
  new URL(
    "../test-fixtures/nico-player-premium-controls/inspect-active-controller.js",
    import.meta.url,
  ),
  "utf8",
);
const sheet = await readFile(
  new URL(
    "../test-fixtures/nico-player-premium-controls/open-official-sheet.js",
    import.meta.url,
  ),
  "utf8",
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const deadline = setTimeout(() => {
  void browser.close();
}, 180000);
const results = [];
let checks = 0;
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Page.enable");
  async function evaluate(expression) {
    const response = await cdp.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    });
    if (response.exceptionDetails)
      throw Error(response.exceptionDetails.exception.description);
    return response.result.value;
  }
  async function until(name, condition, seconds = 30) {
    for (let attempt = 0; attempt < seconds; attempt++) {
      if (await condition()) return;
      await page.waitForTimeout(1000);
    }
    throw Error(`${name}: timed out after ${seconds}s`);
  }
  async function current() {
    await evaluate(inspect);
    return evaluate(
      `(()=>{const c=window.__activeControllerProbe?.[0],v=document.querySelector('video[data-name="video-content"]');if(!c||!v)return null;return {path:location.pathname,checked:[...document.querySelectorAll('input[type=checkbox]')].map(e=>e.checked),flip:c.isFlip(),storedFlip:c.storage.isFlip(),storedRate:c.storage.getPlaybackRate(),rate:c.getPlaybackRate(),nativeRate:v.playbackRate,transform:v.style.transform,external:c.media._isExternalMediaControl(),ready:v.readyState,premium:c.context.isPremium}})()`,
    );
  }
  function check(name, condition) {
    assert.equal(condition, true, name);
    checks++;
  }
  async function clickPoint(point) {
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
    await page.waitForTimeout(250);
  }
  async function checkbox(index) {
    await clickPoint(
      await evaluate(
        `(()=>{const input=document.querySelectorAll('input[type=checkbox]')[${index}];if(!input)throw Error('Missing official checkbox');const e=input.closest('label')||input,r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
      ),
    );
  }
  async function choose(text) {
    const point = await evaluate(
      `(()=>{const e=[...document.querySelectorAll('*')].find(e=>e.textContent===${JSON.stringify(text)}&&e.children.length===0);if(!e)throw Error('Missing official choice');const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`,
    );
    await clickPoint(point);
  }
  async function open(name) {
    await evaluate(`window.__premiumDesiredSheet=${JSON.stringify(name)}`);
    const result = await evaluate(sheet);
    check(`official ${name} sheet opens`, result.opened);
    await page.waitForTimeout(250);
  }
  async function mirror(on) {
    await checkbox(2);
    await until(
      `mirror ${on}`,
      async () => {
        const value = await current();
        return (
          value.checked[2] === on &&
          value.flip === on &&
          value.storedFlip === on &&
          value.transform === (on ? "rotateY(180deg)" : "none")
        );
      },
      10,
    );
    const value = await current();
    results.push({ step: `mirror ${on}`, ...value });
    checks++;
  }
  async function rates() {
    await open("playbackrate");
    await until(
      "official ad/external control ends",
      async () => {
        const value = await current();
        return value && !value.external && value.premium && value.ready >= 2;
      },
      45,
    );
    await choose("x2.0");
    await until(
      "2x reaches active controller and video",
      async () => {
        const value = await current();
        return value.rate === 2 && value.nativeRate === 2;
      },
      5,
    );
    checks++;
    results.push({ step: "rate 2", ...(await current()) });
    await open("playbackrate");
    await choose("x1.0");
    await until(
      "1x reaches active controller and video",
      async () => {
        const value = await current();
        return value.rate === 1 && value.nativeRate === 1;
      },
      5,
    );
    checks++;
    results.push({ step: "rate 1", ...(await current()) });
  }
  await cdp.send("Page.navigate", { url: "https://sp.nicovideo.jp/watch/sm9" });
  await until("public watch controller", async () => {
    const value = await current();
    return value !== null && value.ready >= 2;
  });
  const initial = await current();
  await evaluate(script);
  await until("script adapter", async () =>
    evaluate(
      `window[Symbol.for('web-page-enhancement-scripts.nico-player-premium-controls')]?.status().runtime&&window[Symbol.for('web-page-enhancement-scripts.nico-player-premium-controls')]?.status().controllers===1`,
    ),
  );
  const enabled = await current();
  for (const key of [
    "storedFlip",
    "storedRate",
    "rate",
    "nativeRate",
    "transform",
  ])
    check(`injection preserves ${key}`, initial[key] === enabled[key]);
  results.push({ step: "injection preserved values", initial, enabled });
  // Close the app promotion in this disposable profile, then use the official play button.
  await clickPoint({ x: 330, y: 254 });
  await evaluate(
    `(()=>{const button=document.elementFromPoint(195,210)?.closest('button');button?.click()})()`,
  );
  await page.waitForTimeout(3000);
  await open("main");
  const panelBefore = await current();
  check("official mirror initial OFF", panelBefore.checked[2] === false);
  await checkbox(1);
  await until(
    "resume toggles",
    async () => (await current()).checked[1] !== panelBefore.checked[1],
    10,
  );
  checks++;
  await checkbox(1);
  await until(
    "resume returns and recreated controller is eligible",
    async () => {
      const value = await current();
      return value.checked[1] === panelBefore.checked[1] && value.premium;
    },
    10,
  );
  checks++;
  await mirror(true);
  await mirror(false);
  await rates();
  // Compare real guest membership through the already-loaded official atom, never write it.
  check(
    "real account remains guest",
    await evaluate(
      `(async()=>{const url=performance.getEntriesByType('resource').map(e=>e.name).find(u=>/\\/sessionUserAtom-[^/]+\\.js$/.test(u));if(!url)return false;const module=await import(url),atom=Object.values(module).find(v=>v&&typeof v.read==='function'&&typeof v.write==='function');return window.__nicoLiveStores.some(store=>store.get(atom)===null)})()`,
    ),
  );
  const next = await evaluate(
    `(()=>{const a=[...document.querySelectorAll('a[href]')].find(e=>new URL(e.href).hostname==='sp.nicovideo.jp'&&/^\\/watch\\/[a-z]+\\d+$/.test(new URL(e.href).pathname)&&new URL(e.href).pathname!==location.pathname);return a?new URL(a.href).pathname:null})()`,
  );
  assert.ok(next, "public SPA link exists");
  await evaluate(
    `window.__nicoLiveRetired=window.__activeControllerProbe[0];window.__premiumSheet.close();window.__reactRouterDataRouter.navigate(${JSON.stringify(next)})`,
  );
  await until("SPA controller", async () => {
    const value = await current();
    return value?.path === next && value.premium;
  });
  check(
    "retired SPA controller eligibility restored",
    await evaluate(
      `window.__nicoLiveRetired===window.__activeControllerProbe[0]||window.__nicoLiveRetired.context.isPremium===false`,
    ),
  );
  await open("main");
  const spa = await current();
  check(
    "SPA keeps normal rate and mirror OFF",
    spa.rate === 1 && spa.nativeRate === 1 && spa.checked[2] === false,
  );
  results.push({ step: "SPA initial", ...spa });
  await mirror(true);
  await mirror(false);
  await rates();
  console.log(JSON.stringify({ passed: true, checks, results }, null, 2));
} finally {
  clearTimeout(deadline);
  await browser.close();
}
