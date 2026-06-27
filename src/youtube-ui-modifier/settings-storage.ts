import { getValue } from "@/shared/userscript";
import type {
  YoutubeUiModifierSettingId,
  YoutubeUiModifierSettings,
} from "@/shared/types";
import {
  INDEXED_DB_CORRUPT_BACKUP_KEY,
  INDEXED_DB_NAME,
  INDEXED_DB_SETTINGS_KEY,
  INDEXED_DB_STORE_NAME,
  INDEXED_DB_VERSION,
  STORAGE_KEY,
} from "./constants";
import { DEFAULT_SETTINGS } from "./settings-definitions";

type SettingsRecord = {
  key: typeof INDEXED_DB_SETTINGS_KEY;
  schemaVersion: number;
  settings: YoutubeUiModifierSettings;
  updatedAt: number;
};

type CorruptBackupRecord = {
  key: typeof INDEXED_DB_CORRUPT_BACKUP_KEY;
  capturedAt: number;
  value: unknown;
  reason: string;
};

type StoredRecord = SettingsRecord | CorruptBackupRecord;

const SETTING_IDS = Object.keys(
  DEFAULT_SETTINGS,
) as YoutubeUiModifierSettingId[];

export class SettingsStorage {
  public async load(): Promise<YoutubeUiModifierSettings> {
    const database = await this.openDatabase();

    try {
      const stored = await this.getRecord(database, INDEXED_DB_SETTINGS_KEY);
      const migrated = this.migrateStoredValue(stored);
      await this.putSettingsRecord(database, migrated);
      return migrated;
    } catch (error) {
      await this.backupCorruptValue(
        database,
        await this.safeGetRecord(database),
        this.getErrorMessage(error),
      );
      const legacy = this.loadLegacySettings();
      await this.putSettingsRecord(database, legacy);
      return legacy;
    }
  }

  public async save(settings: YoutubeUiModifierSettings): Promise<void> {
    const database = await this.openDatabase();
    await this.putSettingsRecord(database, this.normalizeSettings(settings));
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(INDEXED_DB_STORE_NAME)) {
          database.createObjectStore(INDEXED_DB_STORE_NAME, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB open failed"));
      request.onblocked = () =>
        reject(new Error("IndexedDB migration blocked"));
    });
  }

  private getRecord(database: IDBDatabase, key: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        INDEXED_DB_STORE_NAME,
        "readonly",
      );
      const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB read failed"));
    });
  }

  private putRecord(database: IDBDatabase, value: StoredRecord): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        INDEXED_DB_STORE_NAME,
        "readwrite",
      );
      const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB write failed"));
    });
  }

  private async putSettingsRecord(
    database: IDBDatabase,
    settings: YoutubeUiModifierSettings,
  ): Promise<void> {
    await this.putRecord(database, {
      key: INDEXED_DB_SETTINGS_KEY,
      schemaVersion: INDEXED_DB_VERSION,
      settings,
      updatedAt: Date.now(),
    });
  }

  private async backupCorruptValue(
    database: IDBDatabase,
    value: unknown,
    reason: string,
  ): Promise<void> {
    await this.putRecord(database, {
      key: INDEXED_DB_CORRUPT_BACKUP_KEY,
      capturedAt: Date.now(),
      value,
      reason,
    });
  }

  private async safeGetRecord(database: IDBDatabase): Promise<unknown> {
    try {
      return await this.getRecord(database, INDEXED_DB_SETTINGS_KEY);
    } catch (error) {
      return {
        readError: this.getErrorMessage(error),
      };
    }
  }

  private migrateStoredValue(value: unknown): YoutubeUiModifierSettings {
    if (value === undefined) {
      return this.loadLegacySettings();
    }

    if (this.isSettingsRecord(value)) {
      return this.normalizeSettings(value.settings);
    }

    if (this.isPartialSettings(value)) {
      return this.normalizeSettings(value);
    }

    throw new Error("Stored settings are corrupt or unsupported");
  }

  private loadLegacySettings(): YoutubeUiModifierSettings {
    try {
      const legacy = getValue<Partial<YoutubeUiModifierSettings>>(
        STORAGE_KEY,
        undefined,
      );
      if (this.isPartialSettings(legacy)) {
        return this.normalizeSettings(legacy);
      }
    } catch {
      // 旧ストレージの読み込み失敗は復旧可能としてデフォルトへ戻す。
    }

    return { ...DEFAULT_SETTINGS };
  }

  private normalizeSettings(
    settings: Partial<YoutubeUiModifierSettings>,
  ): YoutubeUiModifierSettings {
    const normalized: YoutubeUiModifierSettings = { ...DEFAULT_SETTINGS };

    SETTING_IDS.forEach((id) => {
      const value = settings[id];
      if (typeof value === "boolean") {
        normalized[id] = value;
      }
    });

    return normalized;
  }

  private isSettingsRecord(value: unknown): value is SettingsRecord {
    if (!this.isObject(value)) {
      return false;
    }

    return (
      value.key === INDEXED_DB_SETTINGS_KEY &&
      this.isPartialSettings(value.settings)
    );
  }

  private isPartialSettings(
    value: unknown,
  ): value is Partial<YoutubeUiModifierSettings> {
    if (!this.isObject(value)) {
      return false;
    }

    return Object.entries(value).every(([key, settingValue]) => {
      return (
        SETTING_IDS.includes(key as YoutubeUiModifierSettingId) &&
        typeof settingValue === "boolean"
      );
    });
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
