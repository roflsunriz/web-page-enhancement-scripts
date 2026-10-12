import { describe, expect, test } from "bun:test";
import {
  installRuntimeAdapter,
  resolveJsxRuntime,
  unlockPlayerProps,
} from "./eligibility.ts";
import { unlockController } from "./controller.ts";

const noop = () => {};
const panel = () => ({
  isPremium: false,
  setResumePlayback: noop,
  setFlipped: noop,
  onSkipAmountClick: noop,
  skipAmountInfo: { forward: 15, backward: 5 },
  isResumePlayback: false,
  isFlipped: true,
  videoQualityLabel: "360p",
  limitedSheetItemProps: { hqAudio: { isAppLimited: true } },
});

describe("official player eligibility only", () => {
  test("resolves direct runtime exports without depending on the export name", () => {
    const runtime = { jsx: noop, jsxs: noop };
    expect(resolveJsxRuntime({ renamed: runtime })).toBe(runtime);
  });
  test("resolves a lazy CommonJS export to the site's cached runtime instance", () => {
    let cached;
    const module = {
      renamed() {
        return (cached ??= { jsx: noop, jsxs: noop });
      },
    };
    const siteRuntime = module.renamed();
    const runtime = resolveJsxRuntime(module);
    expect(runtime).toBe(siteRuntime);
    const original = siteRuntime.jsx;
    const restore = installRuntimeAdapter(runtime);
    expect(module.renamed().jsx).not.toBe(original);
    restore();
    expect(module.renamed().jsx).toBe(original);
  });
  test("prefers direct exports and does not invoke export getters or argument-taking functions", () => {
    const runtime = { jsx: noop, jsxs: noop };
    const module = {
      factory() {
        throw Error("unnecessary initializer");
      },
      get getter() {
        throw Error("must not run export getter");
      },
      direct: runtime,
    };
    expect(resolveJsxRuntime(module)).toBe(runtime);
    expect(() =>
      resolveJsxRuntime({
        get getter() {
          throw Error("must not run export getter");
        },
        withArgument(required) {
          throw Error("must not run with missing arguments: " + required);
        },
      }),
    ).toThrow("Unsupported official JSX runtime");
  });
  test("rejects malformed modules and preserves initializer failures", () => {
    for (const module of [null, [], {}, { factory: () => ({ jsx: noop }) }])
      expect(() => resolveJsxRuntime(module)).toThrow();
    expect(() =>
      resolveJsxRuntime({
        factory() {
          throw Error("official initialization failed");
        },
      }),
    ).toThrow("official initialization failed");
  });
  test("unlocks the panel without changing selected values or calling setters", () => {
    let calls = 0;
    const original = {
      ...panel(),
      setFlipped: () => {
        calls++;
      },
    };
    const result = unlockPlayerProps(original);
    expect(result).toEqual({ ...original, isPremium: true });
    expect(original.isPremium).toBe(false);
    expect(result.skipAmountInfo).toBe(original.skipAmountInfo);
    expect(result.limitedSheetItemProps).toBe(original.limitedSheetItemProps);
    expect(calls).toBe(0);
  });
  test("unlocks only existing rate candidates and preserves the selection and callbacks", () => {
    const original = {
      playbackRateList: [
        { playbackRate: 2, available: false, label: "x2" },
        { playbackRate: 1, available: true },
      ],
      currentPlaybackRate: 1,
      onClickPlaybackRate: noop,
    };
    const result = unlockPlayerProps(original);
    expect(result.currentPlaybackRate).toBe(1);
    expect(result.playbackRateList.map((r) => r.available)).toEqual([
      true,
      true,
    ]);
    expect(original.playbackRateList[0].available).toBe(false);
    expect(result.onClickPlaybackRate).toBe(noop);
  });
  test("account, comment, quality, app limits and malformed props retain identity", () => {
    const examples = [
      null,
      {},
      { isPremium: false },
      { isPremium: false, changeComment: noop },
      { isPremium: false, items: [{ isAvailable: false }] },
      { isAppLimited: true },
      {
        playbackRateList: [{ playbackRate: NaN, available: false }],
        onClickPlaybackRate: noop,
      },
      { ...panel(), onSkipAmountClick: undefined },
    ];
    for (const value of examples) expect(unlockPlayerProps(value)).toBe(value);
  });
  test("runtime preserves receiver, key, unrelated elements and restores owned wrappers", () => {
    const runtime = {
      jsx(type, props, key) {
        return { type, props, key, receiver: this };
      },
      jsxs(type, props, key) {
        return { type, props, key };
      },
    };
    const jsx = runtime.jsx;
    const restore = installRuntimeAdapter(runtime);
    expect(runtime.jsx("panel", panel(), "original-key")).toMatchObject({
      key: "original-key",
      props: { isPremium: true },
      receiver: runtime,
    });
    const comment = { isPremium: false, body: "text" };
    expect(runtime.jsx("comment", comment).props).toBe(comment);
    restore();
    expect(runtime.jsx).toBe(jsx);
  });
  test("restore does not overwrite an adapter installed later by another script", () => {
    const runtime = { jsx: noop, jsxs: noop };
    const restore = installRuntimeAdapter(runtime);
    runtime.jsx = noop;
    restore();
    expect(runtime.jsx).toBe(noop);
  });
  test("frozen runtimes fail and partial installation rolls back", () => {
    expect(() =>
      installRuntimeAdapter(Object.freeze({ jsx: noop, jsxs: noop })),
    ).toThrow();
    const runtime = { jsx: noop, jsxs: noop };
    Object.defineProperty(runtime, "jsxs", { writable: false });
    expect(() => installRuntimeAdapter(runtime)).toThrow();
    expect(runtime.jsx).toBe(noop);
  });
  test("controller eligibility preserves storage, watch/viewer/rights and feature values", () => {
    const context = {
      isPremium: false,
      storage: { rate: 1, flip: false, resume: true },
    };
    const controller = {
      context,
      watch: {
        viewer: { isPremium: false },
        payment: { isPremium: true },
        video: { id: "sm9" },
      },
      setPlaybackRate() {
        throw Error("must not run");
      },
      setFlip() {
        throw Error("must not run");
      },
    };
    const watch = controller.watch;
    const restore = unlockController(controller);
    expect(controller.context.isPremium).toBe(true);
    expect(controller.context.storage).toBe(context.storage);
    expect(controller.watch).toBe(watch);
    expect(controller.context).toBe(context);
    expect(context.isPremium).toBe(true);
    restore();
    expect(controller.context).toBe(context);
    expect(context.isPremium).toBe(false);
  });
  test("real premium context and subsequently replaced contexts are preserved", () => {
    const original = { isPremium: true };
    const controller = { context: original };
    unlockController(controller)();
    expect(controller.context).toBe(original);
    const regular = { context: { isPremium: false } };
    const restore = unlockController(regular);
    const replacement = { isPremium: false };
    regular.context = replacement;
    restore();
    expect(regular.context).toBe(replacement);
  });
});
