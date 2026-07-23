import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { chromium } from "playwright";
import { format } from "prettier";

const CDP_ENDPOINT = "http://127.0.0.1:9222";
const MY_PAGE_URL = "https://animestore.docomo.ne.jp/animestore/mp_viw_pc";
const WATCH_PAGE_URL =
  "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=";
const LOCAL_ASSET_DIR = resolve(".d-anime-sandbox", "official-assets");
const FORMATTED_ASSET_DIR = resolve(LOCAL_ASSET_DIR, "formatted");
const FIXTURE_PATH = resolve("test-fixtures", "d-anime", "mypage-mock.html");
const MANIFEST_PATH = resolve(
  "test-fixtures",
  "d-anime",
  "official-assets-manifest.json",
);

const TARGET_ASSET_PATHS = new Set([
  "/js/PlayMovie.js",
  "/js/cms/ini-dash.js",
  "/js/cms/player.min.js",
  "/animestore/script/pc/sc_d_pc.js",
]);

const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

const evaluateValue = async (session, expression) => {
  const response = await session.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) {
    const description = response.exceptionDetails.exception?.description;
    throw new Error(description ?? response.exceptionDetails.text);
  }
  return response.result.value;
};

const waitForDocument = async (session, predicateExpression) => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const ready = await evaluateValue(
      session,
      `document.readyState === 'complete' && (${predicateExpression})`,
    );
    if (ready) {
      return;
    }
    await delay(100);
  }
  throw new Error("ページの準備完了を20秒以内に確認できませんでした。");
};

const sha256 = (content) => createHash("sha256").update(content).digest("hex");

const browser = await chromium.connectOverCDP(CDP_ENDPOINT);
const context = browser.contexts()[0];
const page = context?.pages()[0];

if (!context || !page) {
  throw new Error("raw CDP に接続された Chrome ページがありません。");
}

const session = await context.newCDPSession(page);
await session.send("Page.enable");
await session.send("Network.enable", {
  maxTotalBufferSize: 50 * 1024 * 1024,
  maxResourceBufferSize: 20 * 1024 * 1024,
});
await session.send("Network.setCacheDisabled", { cacheDisabled: true });

await session.send("Page.navigate", { url: MY_PAGE_URL });
await waitForDocument(
  session,
  "Boolean(document.querySelector('.p-mypageHeader__title') && document.querySelector('.itemModule.list'))",
);

const partId = await evaluateValue(
  session,
  `(() => {
    const anchor = document.querySelector('a[href*="partId="]');
    if (!anchor) return null;
    return new URL(anchor.href, location.href).searchParams.get('partId');
  })()`,
);

if (typeof partId !== "string" || !/^\d{8}$/.test(partId)) {
  throw new Error("マイページから8桁の partId を取得できませんでした。");
}

const mypageMock = await evaluateValue(
  session,
  `(() => {
    const source = document.querySelector('.itemModule.list');
    if (!source) throw new Error('視聴履歴アイテムがありません。');
    const item = source.cloneNode(true);
    item.removeAttribute('data-auto-fill-enabled');
    item.querySelectorAll('script, iframe, object, embed').forEach((node) => node.remove());
    item.querySelectorAll('*').forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        if (
          attribute.name.startsWith('data-') ||
          attribute.name.startsWith('on') ||
          attribute.name === 'style'
        ) {
          element.removeAttribute(attribute.name);
        }
      });
      if (element instanceof HTMLAnchorElement) {
        element.href = '#';
      }
      if (element instanceof HTMLImageElement) {
        element.removeAttribute('srcset');
        element.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="9"/%3E';
        element.alt = 'モックサムネイル';
      }
      if (element instanceof HTMLInputElement) {
        element.value = '';
      }
    });
    const title = item.querySelector('.line1');
    const episodeNumber = item.querySelector('.number.line1 span');
    const episodeTitle = item.querySelector('.episode.line1 span');
    if (title) title.textContent = 'モック作品タイトル';
    if (episodeNumber) episodeNumber.textContent = '第1話';
    if (episodeTitle) episodeTitle.textContent = 'モックエピソード';
    return '<!doctype html>\\n<html lang="ja">\\n<head>\\n<meta charset="utf-8">\\n<title>dアニメストア マイページモック</title>\\n</head>\\n<body>\\n<header class="p-mypageHeader"><h1 class="p-mypageHeader__title">マイページ</h1></header>\\n<main class="p-mypageMain">' + item.outerHTML + '</main>\\n</body>\\n</html>\\n';
  })()`,
);

const responseMetadata = new Map();
const capturedBodies = new Map();
const bodyPromises = [];

session.on("Network.responseReceived", ({ requestId, response, type }) => {
  if (type !== "Script") {
    return;
  }
  const url = new URL(response.url);
  if (
    url.hostname === "animestore.docomo.ne.jp" &&
    TARGET_ASSET_PATHS.has(url.pathname)
  ) {
    responseMetadata.set(requestId, {
      mimeType: response.mimeType,
      status: response.status,
      url: response.url,
    });
  }
});

session.on("Network.loadingFinished", ({ requestId }) => {
  const metadata = responseMetadata.get(requestId);
  if (!metadata) {
    return;
  }
  bodyPromises.push(
    session
      .send("Network.getResponseBody", { requestId })
      .then(({ body, base64Encoded }) => {
        const content = base64Encoded
          ? Buffer.from(body, "base64")
          : Buffer.from(body, "utf8");
        capturedBodies.set(metadata.url, { content, ...metadata });
      }),
  );
});

await session.send("Page.navigate", { url: `${WATCH_PAGE_URL}${partId}` });
await waitForDocument(
  session,
  "Boolean(document.querySelector('video#video'))",
);
await delay(2_000);
await Promise.all(bodyPromises);

const playerState = await evaluateValue(
  session,
  `(() => {
    const video = document.querySelector('video#video');
    const initial = {
      readyState: video?.readyState ?? -1,
      paused: video?.paused ?? true,
      ended: video?.ended ?? false,
      hasCurrentSrc: Boolean(video?.currentSrc),
    };
    video?.pause();
    return {
      initial,
      afterCapture: {
        paused: video?.paused ?? true,
      },
    };
  })()`,
);

await mkdir(LOCAL_ASSET_DIR, { recursive: true });
await mkdir(FORMATTED_ASSET_DIR, { recursive: true });
await mkdir(resolve("test-fixtures", "d-anime"), { recursive: true });
const formattedMypageMock = await format(mypageMock, { parser: "html" });
await writeFile(FIXTURE_PATH, formattedMypageMock, "utf8");

const assets = [];
for (const [url, captured] of [...capturedBodies].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  const parsedUrl = new URL(url);
  const version = parsedUrl.searchParams.get("v") ?? "unversioned";
  const filename = `${basename(parsedUrl.pathname, ".js")}-${version}.js`;
  const outputPath = resolve(LOCAL_ASSET_DIR, filename);
  await writeFile(outputPath, captured.content);
  const formatted = await format(captured.content.toString("utf8"), {
    parser: "babel",
  });
  await writeFile(resolve(FORMATTED_ASSET_DIR, filename), formatted, "utf8");
  assets.push({
    filename,
    mimeType: captured.mimeType,
    sha256: sha256(captured.content),
    size: captured.content.byteLength,
    status: captured.status,
    url: `${parsedUrl.origin}${parsedUrl.pathname}?v=${version}`,
  });
}

const manifest = {
  captureVersion: 1,
  capturedAt: new Date().toISOString(),
  cdpEndpoint: CDP_ENDPOINT,
  mypage: {
    fixture: "mypage-mock.html",
    sourceUrl: MY_PAGE_URL,
  },
  player: {
    assets,
    initialState: playerState.initial,
    stateAfterCapture: playerState.afterCapture,
    sourceUrl: `${WATCH_PAGE_URL}<redacted>`,
  },
};
await writeFile(
  MANIFEST_PATH,
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      assetDirectory: LOCAL_ASSET_DIR,
      assetCount: assets.length,
      fixture: FIXTURE_PATH,
      manifest: MANIFEST_PATH,
      playerState,
    },
    null,
    2,
  ),
);

await session.detach();
await browser.close();
