import { describe, expect, test } from "bun:test";
import { intent, completed } from "./gesture.ts";

const start = { x: 100, y: 200, time: 0 };
describe("縦スワイプの意図と確定", () => {
  test("タップと微小移動は未確定", () => {
    expect(intent(start, { x: 102, y: 197, time: 150 }, "up")).toBe("pending");
    expect(completed(start, { ...start, time: 150 }, "up")).toBe(false);
  });
  test("縦方向64pxと時間1200msの境界", () => {
    expect(intent(start, { x: 100, y: 192, time: 20 }, "up")).toBe("claim");
    expect(completed(start, { x: 100, y: 136, time: 1200 }, "up")).toBe(true);
    expect(completed(start, { x: 100, y: 137, time: 200 }, "up")).toBe(false);
    expect(completed(start, { x: 100, y: 100, time: 1201 }, "up")).toBe(false);
  });
  test("横シークと斜め移動は対象外", () => {
    expect(intent(start, { x: 110, y: 195, time: 20 }, "up")).toBe("cancel");
    expect(completed(start, { x: 180, y: 100, time: 200 }, "up")).toBe(false);
  });
  test("通常表示の下移動と全画面の上移動は対象外", () => {
    expect(intent(start, { x: 100, y: 210, time: 20 }, "up")).toBe("cancel");
    expect(intent(start, { x: 100, y: 190, time: 20 }, "down")).toBe("cancel");
    expect(completed(start, { x: 100, y: 270, time: 200 }, "down")).toBe(true);
  });
  test("長押しからの移動は対象外", () => {
    expect(intent(start, { x: 100, y: 120, time: 1300 }, "up")).toBe("cancel");
  });
});
