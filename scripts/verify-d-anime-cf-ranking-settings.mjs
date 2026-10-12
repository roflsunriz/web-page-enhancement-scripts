// Verify the storage path as well as schemas after a validation-library update.
// Run in its own Bun process so browser globals remain isolated from other tests.
import assert from "node:assert/strict";
Object.defineProperty(globalThis, "navigator", {
  value: { languages: ["ja"], language: "ja" },
  configurable: true,
});
const { SettingsSchema, CacheEntrySchema, loadSettings, saveSettings } =
  await import("../src/d-anime-cf-ranking/config/settings.ts");
import {
  DEFAULT_SETTINGS,
  TTL_MIN_HOURS,
  TTL_MAX_HOURS,
} from "../src/shared/types/d-anime-cf-ranking.ts";
assert.deepEqual(SettingsSchema.parse(DEFAULT_SETTINGS), DEFAULT_SETTINGS);
for (const cacheTtlHours of [TTL_MIN_HOURS, TTL_MAX_HOURS]) {
  assert.equal(
    SettingsSchema.safeParse({ ...DEFAULT_SETTINGS, cacheTtlHours }).success,
    true,
  );
}
for (const value of [
  null,
  {},
  { ...DEFAULT_SETTINGS, enabled: "true" },
  { ...DEFAULT_SETTINGS, cacheTtlHours: TTL_MIN_HOURS - 1 },
  { ...DEFAULT_SETTINGS, cacheTtlHours: TTL_MAX_HOURS + 1 },
  { ...DEFAULT_SETTINGS, cacheTtlHours: NaN },
]) {
  assert.equal(SettingsSchema.safeParse(value).success, false);
}
const cache = {
  title: "fixture title",
  canonicalQuery: "fixture query",
  representativeVideoId: null,
  representativeVideo: null,
  metrics: null,
  fetchedAt: "2026-10-12T03:00:00.000Z",
  status: "pending",
  failureReason: null,
};
assert.deepEqual(CacheEntrySchema.parse(cache), cache);
assert.equal(
  CacheEntrySchema.safeParse({ ...cache, status: "unknown" }).success,
  false,
);
assert.equal(
  CacheEntrySchema.safeParse({
    ...cache,
    metrics: { viewCount: "10", mylistCount: 0, commentCount: 0, likeCount: 0 },
  }).success,
  false,
);
let stored = { ...DEFAULT_SETTINGS, enabled: false };
let writes = 0;
globalThis.GM_getValue = () => stored;
globalThis.GM_setValue = (_key, value) => {
  writes++;
  stored = value;
};
assert.deepEqual(loadSettings(), stored);
saveSettings({ ...DEFAULT_SETTINGS, cacheTtlHours: TTL_MAX_HOURS });
assert.equal(writes, 1);
assert.equal(stored.cacheTtlHours, TTL_MAX_HOURS);
saveSettings({ ...DEFAULT_SETTINGS, enabled: "invalid" });
assert.equal(writes, 1);
stored = { enabled: true, cacheTtlHours: "invalid" };
assert.deepEqual(loadSettings(), DEFAULT_SETTINGS);
console.log(
  "CF ranking: settings and cache validation, valid storage persistence and invalid input recovery passed",
);
