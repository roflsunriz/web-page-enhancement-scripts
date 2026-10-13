import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { oldestToken, oldestSelected, parsePage, parseQueue } from "./model.ts";

const fixture = (name) =>
  JSON.parse(
    readFileSync(
      new URL(
        `../../test-fixtures/youtube-oldest-player/${name}-sorted.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  );
describe("official browse responses", () => {
  test("all thirteen LOCAL58 uploads are oldest first and titles survive", () => {
    const result = parsePage(fixture("local58tv").first);
    expect(result.videos).toHaveLength(13);
    expect(result.videos[0].id).toBe("jh09uIN6tl0");
    expect(result.videos[0].title).not.toBe(result.videos[0].id);
    expect(result.next).toBeUndefined();
  });
  test("thirty initial videos and twenty-eight continuation videos, with more pages remaining", () => {
    const { first, second } = fixture("youtube");
    expect(parsePage(first).videos).toHaveLength(30);
    expect(parsePage(first).next).toBeTruthy();
    expect(parsePage(second).videos).toHaveLength(28);
    expect(parsePage(second).next).toBeTruthy();
  });
  test("legacy renderer, duplicate-free extraction boundaries and invalid types", () => {
    const response = {
      onResponseReceivedActions: [
        {
          appendContinuationItemsAction: {
            continuationItems: [
              {
                richItemRenderer: {
                  content: {
                    videoRenderer: {
                      videoId: "abcdefghijk",
                      title: { runs: [{ text: "A" }, { text: "B" }] },
                    },
                  },
                },
              },
              {
                richItemRenderer: {
                  content: {
                    lockupViewModel: {
                      contentId: "badbadbadba",
                      contentType: "LOCKUP_CONTENT_TYPE_PLAYLIST",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    };
    expect(parsePage(response).videos).toEqual([
      { id: "abcdefghijk", title: "AB" },
    ]);
    expect(() => parsePage({ error: {} })).toThrow();
    expect(
      parsePage({
        onResponseReceivedActions: [
          { appendContinuationItemsAction: { continuationItems: [] } },
        ],
      }),
    ).toEqual({ videos: [], next: undefined });
  });
  test("localized labels are not used and changed filter structures fail", () => {
    const content = {
      chipBarViewModel: {
        chips: [
          {},
          {},
          {
            chipViewModel: {
              text: "अन्य",
              tapCommand: { continuationCommand: { token: "dynamic" } },
            },
          },
        ],
      },
    };
    expect(oldestToken(content)).toBe("dynamic");
    expect(oldestSelected(fixture("local58tv").first)).toBe(true);
    expect(
      oldestSelected({
        feedFilterChipBarRenderer: {
          contents: [{}, {}, { chipCloudChipRenderer: { isSelected: true } }],
        },
      }),
    ).toBe(true);
    content.chipBarViewModel.chips.push({});
    expect(() => oldestToken(content)).toThrow();
  });
  test("queue schema rejects old versions, duplicate IDs and corrupted entries", () => {
    const queue = {
      version: 1,
      key: "abcdefgh",
      channel: "/@sample/videos",
      currentId: "abcdefghijk",
      originalAutoplay: null,
      videos: [{ id: "abcdefghijk", title: "A" }],
      active: true,
    };
    expect(parseQueue(queue)).toEqual(queue);
    for (const data of [
      null,
      { ...queue, version: 0 },
      { ...queue, active: "true" },
      { ...queue, videos: [...queue.videos, ...queue.videos] },
      { ...queue, videos: [{ id: "<script>", title: "A" }] },
    ])
      expect(parseQueue(data)).toBeNull();
  });
});
