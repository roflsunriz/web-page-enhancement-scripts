import { describe, expect, test } from "bun:test";
import { parseWatchResponse } from "./watch-response.ts";

const video = {
  id: "so123",
  title: "50%25 test",
  description: "watch/so456",
  count: { view: 10 },
};
const comment = {
  nvComment: {
    server: "https://public.nvcomment.nicovideo.jp",
    params: { targets: [{ id: "1", fork: "main" }] },
    threadKey: "fixture",
  },
};
const series = { video: { next: { id: "so456" } } };
const wrap = (response) =>
  JSON.stringify({ meta: { status: 200 }, data: { response } });

describe("watch response", () => {
  test("従来形式と直接data形式で動画・コメント・シリーズを保持する", () => {
    for (const text of [
      wrap({ video, comment, series }),
      JSON.stringify({ data: { video, comment, series } }),
    ]) {
      const result = parseWatchResponse(text);
      expect(result.video).toMatchObject(video);
      expect(result.comment).toEqual(comment);
      expect(result.series).toEqual(series);
    }
  });
  test("watchV4は内側を優先し、外側だけにあるコメントとシリーズを保持する", () => {
    const result = parseWatchResponse(
      wrap({
        video: { ...video, title: "old" },
        comment,
        series,
        $watchV4: { data: { video } },
      }),
    );
    expect(result.video).toMatchObject(video);
    expect(result.comment).toEqual(comment);
    expect(result.series).toEqual(series);
  });
  test("不完全なV4は有効な外側の動画情報がある場合だけ従来形式に戻る", () => {
    expect(
      parseWatchResponse(wrap({ video, comment, $watchV4: { data: null } }))
        .video?.id,
    ).toBe("so123");
    expect(() =>
      parseWatchResponse(wrap({ $watchV4: { data: null } })),
    ).toThrow();
  });
  test("APIエラー、mediaのみ、型不正は成功データにしない", () => {
    expect(() =>
      parseWatchResponse(
        JSON.stringify({
          meta: { status: 403 },
          data: { response: { video, comment } },
        }),
      ),
    ).toThrow();
    expect(() =>
      parseWatchResponse(JSON.stringify({ data: { media: {} } })),
    ).toThrow();
    expect(() =>
      parseWatchResponse(wrap({ video: { id: 123, title: "x" } })),
    ).toThrow();
  });
  test("旧式のパーセント符号化JSONも読める", () => {
    expect(
      parseWatchResponse(encodeURIComponent(wrap({ video, comment }))).video
        ?.title,
    ).toBe("50%25 test");
  });
});
