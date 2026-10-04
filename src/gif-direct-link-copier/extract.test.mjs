import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { extract, directMedia, identity } from "./extract.ts";
const fixtures = JSON.parse(
  readFileSync(
    new URL(
      "../../test-fixtures/gif-direct-link-copier/public-pages.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const clone = (i) => structuredClone(fixtures[i]);
describe("公開ページからのメディア抽出", () => {
  test("実採取GIPHY 2件でOG GIFをそのまま選びWebPやMP4より優先", () => {
    for (const f of fixtures.slice(0, 2))
      expect(extract(f)).toEqual([
        { key: f.groups[0].key, format: "GIF", url: f.jsonLd[0].image.url },
      ]);
  });
  test("Tenor旧IDと64bit文字列IDで元GIFを優先", () => {
    for (const f of fixtures.slice(2, 4))
      expect(extract(f)[0].url).toBe(
        f.tenorCache.gifs.byId[f.groups[0].key].results[0].media_formats.gif
          .url,
      );
  });
  test("Imgurの表示済み投稿動画2件、静止WebPは除外", () => {
    expect(extract(fixtures[4])).toEqual([
      {
        key: "iMoeEpa:1",
        format: "MP4",
        url: "https://i.imgur.com/QERk0ho.mp4",
      },
      {
        key: "iMoeEpa:2",
        format: "MP4",
        url: "https://i.imgur.com/1Vrz09M.mp4",
      },
    ]);
  });
  test("GIFがない場合MP4、次にWebM、拡張子は変更しない", () => {
    const f = clone(0);
    f.metaUrls = [];
    f.jsonLd = [];
    f.groups[0].urls = [
      "https://media.giphy.com/media/7Wcyq7KvKFNTO/giphy.webm?token=abc",
      "https://media.giphy.com/media/7Wcyq7KvKFNTO/giphy.mp4?token=abc",
    ];
    expect(extract(f)[0].format).toBe("MP4");
    f.groups[0].urls.pop();
    expect(extract(f)[0]).toMatchObject({
      format: "WebM",
      url: f.groups[0].urls[0],
    });
  });
  test("静止GIPHY _s.gif とgifvはメディア候補から除外", () => {
    expect(
      directMedia("https://media.giphy.com/media/abc/giphy_s.gif", "giphy"),
    ).toBeNull();
    expect(directMedia("https://i.imgur.com/abc.gifv", "imgur")).toBeNull();
  });
  test("サイト外・共有ページ・認証付きURL・blob・data・httpは拒否", () => {
    for (const url of [
      "https://giphy.com/gifs/test.gif",
      "https://media.giphy.com.evil.test/a.gif",
      "https://media.giphy.com@evil.test/a.gif",
      "https://user:pass@media.giphy.com/a.gif",
      "http://media.giphy.com/a.gif",
      "blob:https://media.giphy.com/a.gif",
      "data:image/gif;base64,abc",
      "https://media.giphy.com:8443/a.gif",
      "https://media.giphy.com/a.gif#x",
      "bad",
    ])
      expect(directMedia(url, "giphy")).toBeNull();
  });
  test("形式判定にクエリのgif文字を使わず署名付きURLを保持", () => {
    expect(
      directMedia("https://i.imgur.com/AbC.mp4?format=gif&sig=abc", "imgur"),
    ).toEqual({
      format: "MP4",
      url: "https://i.imgur.com/AbC.mp4?format=gif&sig=abc",
    });
  });
  test("別GIFと前ページOGは採用しない", () => {
    const f = clone(0);
    f.url = "https://giphy.com/gifs/other-OTHER";
    expect(extract(f)).toEqual([]);
  });
  test("Tenor遷移中の前ページキャッシュと構造化データは拒否", () => {
    const f = clone(2);
    f.url = "https://tenor.com/ja/view/other-gif-12345";
    expect(extract(f)).toEqual([]);
  });
  test("Tenor結果IDがキャッシュキーと不一致なら拒否", () => {
    const f = clone(2);
    f.jsonLd = [];
    const item = f.tenorCache.gifs.byId["22114616"].results[0];
    item.id = "other";
    item.legacy_info.post_id = "other";
    expect(extract(f)).toEqual([]);
  });
  test("Tenor関連GIFの描画グループは無視", () => {
    const f = clone(2);
    f.groups = [
      {
        key: "22114616",
        urls: ["https://media.tenor.com/unrelatedAAAAC/tenor.gif"],
      },
    ];
    expect(extract(f)).toEqual([]);
  });
  test("Tenor cacheが壊れても一致するJSON-LDで取得", () => {
    const f = clone(2);
    f.tenorCache = "malformed";
    f.groups[0].urls = [f.jsonLd[0].image.contentUrl];
    expect(extract(f)[0].format).toBe("GIF");
  });
  test("Imgur SPAで前投稿が残っている間は出さない", () => {
    const f = clone(4);
    f.url = "https://imgur.com/gallery/other-Another";
    expect(extract(f)).toEqual([]);
  });
  test("Imgur同一媒体のGIFがDOMにあればMP4より優先", () => {
    const f = clone(4);
    f.groups[1].urls.push("https://i.imgur.com/QERk0ho.gif");
    expect(extract(f).find((e) => e.key === "iMoeEpa:1").format).toBe("GIF");
  });
  test("遅延描画・空・未知形式は空結果", () => {
    const f = clone(0);
    f.groups = [];
    expect(extract(f)).toEqual([]);
    f.groups = [{ key: "7Wcyq7KvKFNTO", urls: ["data:invalid"] }];
    f.metaUrls = [];
    f.jsonLd = [];
    expect(extract(f)).toEqual([]);
  });
  test("検索・一覧・閉鎖候補サービスは対応範囲外", () => {
    for (const url of [
      "https://giphy.com/",
      "https://giphy.com/search/cat",
      "https://tenor.com/search/cat",
      "https://gfycat.com/test",
      "https://redgifs.com/watch/test",
    ])
      expect(identity(url)).toBeNull();
  });
  test("Tenor地域別URLとImgur album/単体IDを認識", () => {
    expect(
      identity("https://tenor.com/zh-CN/view/happy-boy-gif-22114616"),
    ).toEqual({ site: "tenor", id: "22114616" });
    expect(identity("https://imgur.com/a/AbC1234")).toEqual({
      site: "imgur",
      id: "AbC1234",
    });
    expect(identity("https://imgur.com/AbC1234")).toEqual({
      site: "imgur",
      id: "AbC1234",
    });
  });
});
