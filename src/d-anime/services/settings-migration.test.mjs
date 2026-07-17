import { describe, expect, test } from "bun:test";
import { cloneDefaultSettings } from "../config/default-settings.ts";
import { migrateStoredRendererSettings } from "./settings-migration.ts";

describe("migrateStoredRendererSettings", () => {
  test("最新版の描画エンジンはスクロール時間を自動計算する", () => {
    expect(cloneDefaultSettings().scrollVisibleDurationMs).toBeNull();
  });

  test("旧comment-overlayの既定スクロール時間を自動計算へ移行する", () => {
    const stored = { scrollVisibleDurationMs: 6_700 };

    const migrated = migrateStoredRendererSettings(stored);

    expect(migrated.scrollVisibleDurationMs).toBeNull();
    expect(stored.scrollVisibleDurationMs).toBe(6_700);
  });

  test("明示的なカスタム値は維持する", () => {
    const stored = { scrollVisibleDurationMs: 5_000 };

    expect(migrateStoredRendererSettings(stored)).toBe(stored);
  });

  test("すでに自動計算を使う設定は維持する", () => {
    const stored = { scrollVisibleDurationMs: null };

    expect(migrateStoredRendererSettings(stored)).toBe(stored);
  });

  test("不正な保存値は空設定として扱う", () => {
    expect(migrateStoredRendererSettings(null)).toEqual({});
    expect(migrateStoredRendererSettings([])).toEqual({});
  });
});
