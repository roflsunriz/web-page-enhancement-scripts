import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const fixtures = JSON.parse(
  await readFile(
    new URL(
      "../test-fixtures/gif-direct-link-copier/public-pages.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const source = await readFile(
  new URL("../dist/gif-direct-link-copier.user.js", import.meta.url),
  "utf8",
);
assert.match(source, /@version\s+1\.0\.0/);
assert.match(source, /@noframes/);
assert.match(
  source,
  /@downloadURL\s+https:\/\/raw\.githubusercontent\.com\/roflsunriz\/web-page-enhancement-scripts\/refs\/heads\/main\/dist\/gif-direct-link-copier\.user\.js/,
);
assert.match(
  source,
  /@updateURL\s+https:\/\/raw\.githubusercontent\.com\/roflsunriz\/web-page-enhancement-scripts\/refs\/heads\/main\/dist\/gif-direct-link-copier\.meta\.js/,
);
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
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, expression)) return;
    await new Promise((r) => setTimeout(r, 25));
  }
  throw new Error(`Timed out: ${expression}`);
}
const escapeAttr = (text) =>
  text.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
function markup(f) {
  const head =
    `<meta property="og:url" content="${escapeAttr(f.pageUrl ?? "")}">` +
    f.metaUrls
      .map((url) => `<meta property="og:image" content="${escapeAttr(url)}">`)
      .join("") +
    f.jsonLd
      .map(
        (j) =>
          `<script type="application/ld+json">${JSON.stringify(j)}</script>`,
      )
      .join("") +
    (f.tenorCache
      ? `<script id="store-cache" type="text/x-cache">${JSON.stringify(f.tenorCache)}</script>`
      : "");
  const groups = f.groups
    .map((g, index) => {
      const media = g.urls
        .map((url) =>
          url.includes(".mp4") || url.includes(".webm")
            ? `<video controls><source src="${escapeAttr(url)}"></video>`
            : `<img src="${escapeAttr(url)}" width="280" height="200">`,
        )
        .join("");
      return f.url.includes("giphy.com")
        ? `<div style="display:flex;flex-direction:column"><div style="position:relative;height:200px;overflow:hidden"><div data-giphy-id="${g.key}"><picture>${media}</picture></div></div></div>`
        : f.url.includes("tenor.com")
          ? `<div class="Gif">${media}</div>`
          : `<div class="VirtualList--item" data-index="${index}" style="position:absolute;top:0;left:0;right:0;height:200px;transform:translateY(${index * 200}px)"><div class="Gallery-Content--mediaContainer">${media}</div></div>`;
    })
    .join("");
  return {
    head,
    groups: f.url.includes("imgur.com")
      ? `<h1 class="Gallery-Title">Post</h1><div class="Gallery-ContentWrapper" style="overflow:hidden"><div class="VirtualList" style="height:600px;position:relative">${groups}</div></div>`
      : groups,
  };
}
const hostQuery = `[...document.querySelectorAll('[data-gif-direct-link-button]')]`;
const count = `${hostQuery}.length`;
async function setup(
  index,
  width = 390,
  height = 844,
  locale = "ja-JP",
  delayed = false,
) {
  const f = fixtures[index],
    parts = markup(f);
  const context = await browser.newContext({
    viewport: { width, height },
    locale,
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
            {
              name: "Content-Type",
              value:
                e.resourceType === "Document"
                  ? "text/html; charset=utf-8"
                  : "text/plain",
            },
          ],
          body: Buffer.from(
            e.resourceType === "Document"
              ? `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:12px}main{max-width:700px}video{width:100%;height:180px}img{max-width:100%}</style>${parts.head}<main id="media">${delayed ? "" : parts.groups}</main><aside><img src="https://media.tenor.com/unrelatedAAAAC/tenor.gif"></aside><div class="MediaPreview-wrapper"><video src="https://i.imgur.com/Other.mp4"></video></div>`
              : "",
          ).toString("base64"),
        })
        .catch((e) => errors.push(String(e))),
  );
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      `window.__copied=[];window.__mode='ok';Object.defineProperty(navigator,'clipboard',{value:{writeText:async url=>{if(__mode==='denied'||__mode==='fallback'||__mode==='timeout')throw Error('denied');__copied.push(url)}}});window.GM_setClipboard=(url,type,callback)=>{if(__mode==='denied')throw Error('manager denied');if(__mode==='timeout')return;__copied.push(url);callback()};` +
      source,
  });
  await cdp.send("Page.navigate", { url: f.url });
  await waitFor(cdp, `document.readyState==='complete'`);
  return { context, cdp, f, parts };
}
async function click(cdp, index = 0) {
  const point = await evaluate(
    cdp,
    `(()=>{const h=${hostQuery}[${index}];h.scrollIntoView({block:'center'});const r=h.shadowRoot.querySelector('button').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,reachable:document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===h}})()`,
  );
  assert.equal(
    point.reachable,
    true,
    "Copy control must receive a real pointer click",
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
try {
  for (const [index, width, height, locale] of [
    [0, 1920, 1080, "ja-JP"],
    [1, 390, 844, "en-US"],
    [2, 320, 640, "ar"],
    [3, 844, 390, "ur"],
    [4, 768, 1024, "ja-JP"],
  ]) {
    const { context, cdp, f } = await setup(index, width, height, locale);
    try {
      await waitFor(cdp, `${count}===${index === 4 ? 2 : 1}`);
      cases++;
      await evaluate(cdp, source);
      await new Promise((r) => setTimeout(r, 250));
      assert.equal(await evaluate(cdp, count), index === 4 ? 2 : 1);
      cases++;
      const before = await evaluate(
        cdp,
        `${hostQuery}.map(h=>{const b=h.shadowRoot.querySelector('button'),r=b.getBoundingClientRect();return {text:b.textContent,width:r.width,height:r.height,left:r.left,right:r.right,dir:h.shadowRoot.querySelector('.row').dir}})`,
      );
      for (const b of before) {
        assert.ok(b.height >= 44);
        assert.ok(b.left >= 0 && b.right <= width);
        assert.match(b.text, index === 4 ? /MP4/ : /GIF/);
        assert.equal(b.dir, locale === "ar" || locale === "ur" ? "rtl" : "ltr");
      }
      cases++;
      if (index === 4) {
        assert.equal(
          await evaluate(
            cdp,
            `${hostQuery}.every(h=>!h.closest('.VirtualList--item'))`,
          ),
          true,
        );
        cases++;
      }
      await click(cdp);
      await waitFor(cdp, "__copied.length===1");
      const copied = await evaluate(cdp, "__copied[0]");
      assert.ok(
        index === 4 ? copied.endsWith("QERk0ho.mp4") : copied.endsWith(".gif"),
      );
      cases++;
      await evaluate(cdp, "__mode='denied'");
      await click(cdp);
      await waitFor(
        cdp,
        `${hostQuery}[0].shadowRoot.querySelector('textarea').hidden===false`,
      );
      assert.equal(
        await evaluate(
          cdp,
          `${hostQuery}[0].shadowRoot.querySelector('textarea').value`,
        ),
        copied,
      );
      assert.equal(await evaluate(cdp, "__copied.length"), 1);
      cases++;
      await evaluate(cdp, "__mode='fallback'");
      await click(cdp);
      await waitFor(cdp, "__copied.length===2");
      assert.equal(
        await evaluate(
          cdp,
          `${hostQuery}[0].shadowRoot.querySelector('textarea').hidden`,
        ),
        true,
      );
      cases++;
      await evaluate(
        cdp,
        `history.pushState({},'',${JSON.stringify(f.url.includes("tenor") ? "/view/new-gif-987654321" : f.url.includes("giphy") ? "/gifs/new-OTHER" : "/gallery/new-OTHER")});${hostQuery}[0].shadowRoot.querySelector('button').click()`,
      );
      assert.equal(await evaluate(cdp, "__copied.length"), 2);
      await waitFor(cdp, `${count}===0`);
      cases++;
      await evaluate(
        cdp,
        `history.replaceState({},'',${JSON.stringify(f.url)})`,
      );
      await waitFor(cdp, `${count}===${index === 4 ? 2 : 1}`);
      cases++;
      await evaluate(cdp, "document.querySelector('#media').innerHTML=''");
      await waitFor(cdp, `${count}===0`);
      cases++;
    } finally {
      await context.close();
    }
  }
  const recycled = await setup(4);
  try {
    await waitFor(recycled.cdp, count + "===2");
    await evaluate(
      recycled.cdp,
      "history.pushState({},'', '/gallery/new-NewPost');document.querySelector('meta[property=\"og:url\"]').content=location.href",
    );
    await waitFor(recycled.cdp, count + "===0");
    cases++;
    await evaluate(
      recycled.cdp,
      "document.querySelector('.VirtualList--item[data-index=\"1\"] source').src='https://i.imgur.com/NewMedia.mp4'",
    );
    await waitFor(recycled.cdp, count + "===1");
    await click(recycled.cdp);
    await waitFor(recycled.cdp, "__copied.length===1");
    assert.equal(
      await evaluate(recycled.cdp, "__copied[0]"),
      "https://i.imgur.com/NewMedia.mp4",
    );
    cases++;
  } finally {
    await recycled.context.close();
  }
  const { context, cdp, parts } = await setup(0, 390, 844, "ja-JP", true);
  try {
    assert.equal(await evaluate(cdp, count), 0);
    await evaluate(
      cdp,
      `document.querySelector('#media').innerHTML=${JSON.stringify(parts.groups)}`,
    );
    await waitFor(cdp, `${count}===1`);
    cases++;
    await evaluate(cdp, "__mode='timeout'");
    await click(cdp);
    await waitFor(
      cdp,
      `${hostQuery}[0].shadowRoot.querySelector('textarea').hidden===false`,
    );
    cases++;
    await evaluate(
      cdp,
      "__mode='ok';window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))",
    );
    await click(cdp);
    await waitFor(cdp, "__copied.length===1");
    cases++;
    if (process.env.GIF_COPY_ARTIFACTS) {
      await mkdir(process.env.GIF_COPY_ARTIFACTS, { recursive: true });
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
      await writeFile(
        `${process.env.GIF_COPY_ARTIFACTS}/mobile.png`,
        Buffer.from(shot.data, "base64"),
      );
    }
  } finally {
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    `gif-direct-link-copier: ${cases} browser checks passed (5 viewports, RTL, clipboard, SPA, delayed DOM, duplication, bfcache).`,
  );
} finally {
  await browser.close();
}
