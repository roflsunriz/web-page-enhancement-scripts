import assert from "node:assert/strict";
import { chromium } from "playwright";

const build = await Bun.build({
  entrypoints: ["./scripts/d-anime-watch-v4-entry.ts"],
  target: "browser",
  format: "iife",
  plugins: [
    {
      name: "offline-gm",
      setup(builder) {
        builder.onResolve({ filter: /^@\/shared\/network\/gmHttp$/ }, () => ({
          path: "gm",
          namespace: "mock",
        }));
        builder.onLoad({ filter: /.*/, namespace: "mock" }, () => ({
          contents:
            "export const gmRequest = request => globalThis.mockRequest(request);",
          loader: "js",
        }));
      },
    },
  ],
});
if (!build.success) throw new Error(build.logs.join("\n"));
const source = await build.outputs[0].text();
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage();
  await page.route("**/*", (route) => route.abort());
  await page.setContent("<!doctype html><title>offline</title>");
  await page.addScriptTag({ content: source });
  const result = await page.evaluate(async () => {
    const video = {
      id: "so123",
      title: "Title 50%25",
      description: "watch/so456",
    };
    const comment = {
      nvComment: {
        server: "https://public.nvcomment.nicovideo.jp",
        params: { targets: [{ id: "fixture", fork: "main" }] },
        threadKey: "fixture",
      },
    };
    const series = { video: { next: { id: "so456" } } };
    let status = 200;
    let html = "";
    const requests = [];
    window.mockRequest = async (request) => {
      requests.push(request);
      return request.method === "GET"
        ? { status, response: html }
        : {
            status: 200,
            response: JSON.stringify({
              data: {
                threads: [
                  {
                    fork: "main",
                    commentCount: 1,
                    comments: [
                      { body: "comment", vposMs: 1200, commands: ["red"] },
                    ],
                  },
                ],
              },
            }),
          };
    };
    const outcomes = [];
    for (const response of [
      { data: { response: { video, comment, series } } },
      {
        data: { response: { comment, series, $watchV4: { data: { video } } } },
      },
      { data: { video, comment, series } },
    ]) {
      const element = document.createElement("meta");
      element.name = "server-response";
      element.content = JSON.stringify(response);
      html = `<!doctype html><head>${element.outerHTML}</head>`;
      const fetcher = new window.NicoApiFetcher();
      const comments = await fetcher.fetchAllData("so123");
      outcomes.push({
        video: fetcher.lastApiData.video,
        series: fetcher.lastApiData.series,
        comments,
      });
    }
    status = 403;
    let failed = false;
    try {
      await new window.NicoApiFetcher().fetchApiData("so123");
    } catch {
      failed = true;
    }
    return { outcomes, requests, failed };
  });
  for (const item of result.outcomes) {
    assert.equal(item.video.title, "Title 50%25");
    assert.equal(item.series.video.next.id, "so456");
    assert.deepEqual(item.comments, [
      { text: "comment", vposMs: 1200, commands: ["red"] },
    ]);
  }
  assert.equal(result.failed, true);
  const post = result.requests.find((request) => request.method === "POST");
  assert.equal(post.url, "https://public.nvcomment.nicovideo.jp/v1/threads");
  assert.equal(JSON.parse(post.data).threadKey, "fixture");
  console.log(
    "d-anime watchV4: HTML, metadata, series, comment request and HTTP failure passed",
  );
} finally {
  await browser.close();
}
