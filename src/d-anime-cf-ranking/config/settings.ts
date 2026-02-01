/**
 * 設定管理
 *
 * - Zodスキーマ定義
 * - Tampermonkeyメニュー連携
 * - GM_setValue/GM_getValue による永続化
 */

import { z } from "zod";
import type { Settings } from "@/shared/types/d-anime-cf-ranking";
import { DEFAULT_SETTINGS } from "@/shared/types/d-anime-cf-ranking";
import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnimeCfRanking:Settings");

// =============================================================================
// Zodスキーマ
// =============================================================================

/** 設定スキーマ */
export const SettingsSchema = z.object({
  enabled: z.boolean(),
});

/** キャッシュエントリスキーマ */
export const CacheEntrySchema = z.object({
  title: z.string(),
  canonicalQuery: z.string(),
  representativeVideoId: z.string().nullable(),
  representativeVideo: z
    .object({
      videoId: z.string(),
      title: z.string(),
      postedAt: z.string(),
      uploaderType: z.enum(["danime", "official", "unknown"]),
      uploaderName: z.string(),
    })
    .nullable(),
  metrics: z
    .object({
      viewCount: z.number(),
      mylistCount: z.number(),
      commentCount: z.number(),
      likeCount: z.number(),
    })
    .nullable(),
  fetchedAt: z.string(),
  status: z.enum(["ok", "failed", "pending"]),
  failureReason: z.string().nullable(),
});

// =============================================================================
// GM_* API型定義
// =============================================================================

declare function GM_getValue<T>(key: string, defaultValue: T): T;
declare function GM_setValue(key: string, value: unknown): void;
declare function GM_registerMenuCommand(
  caption: string,
  onClick: () => void
): void;

// =============================================================================
// 設定管理
// =============================================================================

const SETTINGS_KEY = "dAnimeCfRanking_settings";

/** 現在の設定をキャッシュ */
let currentSettings: Settings | null = null;

/** 設定変更時のコールバック */
type SettingsChangeCallback = (settings: Settings) => void;
const changeCallbacks: SettingsChangeCallback[] = [];

/**
 * 設定を読み込む
 */
export function loadSettings(): Settings {
  try {
    const stored = GM_getValue<unknown>(SETTINGS_KEY, null);
    if (stored === null) {
      currentSettings = { ...DEFAULT_SETTINGS };
      return currentSettings;
    }

    const parsed = SettingsSchema.safeParse(stored);
    if (parsed.success) {
      currentSettings = parsed.data;
      return currentSettings;
    }

    logger.warn("Invalid settings found, using defaults", {
      error: parsed.error,
    });
    currentSettings = { ...DEFAULT_SETTINGS };
    return currentSettings;
  } catch (error) {
    logger.error("Failed to load settings", error as Error);
    currentSettings = { ...DEFAULT_SETTINGS };
    return currentSettings;
  }
}

/**
 * 設定を保存する
 */
export function saveSettings(settings: Settings): void {
  try {
    const validated = SettingsSchema.parse(settings);
    GM_setValue(SETTINGS_KEY, validated);
    currentSettings = validated;

    // コールバック呼び出し
    for (const callback of changeCallbacks) {
      try {
        callback(validated);
      } catch (error) {
        logger.error("Settings change callback error", error as Error);
      }
    }

    logger.info("Settings saved", { settings: validated });
  } catch (error) {
    logger.error("Failed to save settings", error as Error);
  }
}

/**
 * 現在の設定を取得する
 */
export function getSettings(): Settings {
  if (currentSettings === null) {
    return loadSettings();
  }
  return currentSettings;
}

/**
 * 設定変更時のコールバックを登録する
 */
export function onSettingsChange(callback: SettingsChangeCallback): void {
  changeCallbacks.push(callback);
}

/**
 * 表示ON/OFFをトグルする
 */
export function toggleEnabled(): void {
  const settings = getSettings();
  saveSettings({ ...settings, enabled: !settings.enabled });
}

// =============================================================================
// Tampermonkeyメニュー登録
// =============================================================================

/**
 * Tampermonkeyメニューを登録する
 */
export function registerMenuCommands(): void {
  const settings = getSettings();

  GM_registerMenuCommand(
    settings.enabled ? "🔵 ランキング表示: ON" : "⚪ ランキング表示: OFF",
    () => {
      toggleEnabled();
      // メニュー更新のためページをリロード
      window.location.reload();
    }
  );

  logger.info("Menu commands registered", { enabled: settings.enabled });
}
