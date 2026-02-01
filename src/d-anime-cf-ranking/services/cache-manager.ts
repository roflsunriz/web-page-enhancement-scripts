/**
 * キャッシュマネージャー
 *
 * - IndexedDB初期化
 * - TTL判定（24時間）
 * - CRUD操作
 * - 状態管理（ok/failed/pending）
 */

import { createLogger } from "@/shared/logger";
import type { CacheEntry, CacheStatus } from "@/shared/types/d-anime-cf-ranking";
import {
  CACHE_TTL_MS,
  IDB_DATABASE_NAME,
  IDB_STORE_NAME,
  IDB_VERSION,
} from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:CacheManager");

// =============================================================================
// IndexedDB操作
// =============================================================================

let db: IDBDatabase | null = null;

/**
 * IndexedDBを初期化する
 * @returns Promise<IDBDatabase>
 */
export async function initDatabase(): Promise<IDBDatabase> {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_DATABASE_NAME, IDB_VERSION);

    request.onerror = () => {
      logger.error("Failed to open IndexedDB", request.error as Error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      logger.info("IndexedDB initialized");
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // 既存ストアがあれば削除
      if (database.objectStoreNames.contains(IDB_STORE_NAME)) {
        database.deleteObjectStore(IDB_STORE_NAME);
      }

      // ストア作成（titleをキーとする）
      const store = database.createObjectStore(IDB_STORE_NAME, {
        keyPath: "title",
      });

      // インデックス作成
      store.createIndex("status", "status", { unique: false });
      store.createIndex("fetchedAt", "fetchedAt", { unique: false });

      logger.info("IndexedDB store created");
    };
  });
}

/**
 * データベース接続を取得する
 */
async function getDatabase(): Promise<IDBDatabase> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// =============================================================================
// キャッシュ操作
// =============================================================================

/**
 * キャッシュエントリを取得する
 * @param title 作品タイトル
 * @returns CacheEntry または null
 */
export async function getCacheEntry(title: string): Promise<CacheEntry | null> {
  try {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IDB_STORE_NAME, "readonly");
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.get(title);

      request.onerror = () => {
        logger.error("Failed to get cache entry", request.error as Error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result as CacheEntry | null);
      };
    });
  } catch (error) {
    logger.error("getCacheEntry failed", error as Error);
    return null;
  }
}

/**
 * キャッシュエントリを保存する
 * @param entry キャッシュエントリ
 */
export async function setCacheEntry(entry: CacheEntry): Promise<void> {
  try {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IDB_STORE_NAME, "readwrite");
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.put(entry);

      request.onerror = () => {
        logger.error("Failed to set cache entry", request.error as Error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.debug("Cache entry saved", { title: entry.title, status: entry.status });
        resolve();
      };
    });
  } catch (error) {
    logger.error("setCacheEntry failed", error as Error);
  }
}

/**
 * キャッシュエントリを削除する
 * @param title 作品タイトル
 */
export async function deleteCacheEntry(title: string): Promise<void> {
  try {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IDB_STORE_NAME, "readwrite");
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.delete(title);

      request.onerror = () => {
        logger.error("Failed to delete cache entry", request.error as Error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.debug("Cache entry deleted", { title });
        resolve();
      };
    });
  } catch (error) {
    logger.error("deleteCacheEntry failed", error as Error);
  }
}

/**
 * 全キャッシュエントリを取得する
 * @returns CacheEntry配列
 */
export async function getAllCacheEntries(): Promise<CacheEntry[]> {
  try {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IDB_STORE_NAME, "readonly");
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        logger.error("Failed to get all cache entries", request.error as Error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result as CacheEntry[]);
      };
    });
  } catch (error) {
    logger.error("getAllCacheEntries failed", error as Error);
    return [];
  }
}

/**
 * キャッシュをクリアする
 */
export async function clearCache(): Promise<void> {
  try {
    const database = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IDB_STORE_NAME, "readwrite");
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        logger.error("Failed to clear cache", request.error as Error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.info("Cache cleared");
        resolve();
      };
    });
  } catch (error) {
    logger.error("clearCache failed", error as Error);
  }
}

// =============================================================================
// TTL判定
// =============================================================================

/**
 * キャッシュエントリが有効期限内かどうかを判定する
 * @param entry キャッシュエントリ
 * @returns 有効期限内ならtrue
 */
export function isCacheValid(entry: CacheEntry | null): boolean {
  if (!entry) {
    return false;
  }

  // pending状態は常に無効（再取得が必要）
  if (entry.status === "pending") {
    return false;
  }

  // fetchedAtをチェック
  const fetchedAt = new Date(entry.fetchedAt).getTime();
  if (isNaN(fetchedAt)) {
    return false;
  }

  const now = Date.now();
  const age = now - fetchedAt;

  return age < CACHE_TTL_MS;
}

/**
 * キャッシュエントリの残り有効時間を取得する
 * @param entry キャッシュエントリ
 * @returns 残り時間（ミリ秒）、期限切れなら0
 */
export function getCacheRemainingTime(entry: CacheEntry): number {
  const fetchedAt = new Date(entry.fetchedAt).getTime();
  if (isNaN(fetchedAt)) {
    return 0;
  }

  const expiresAt = fetchedAt + CACHE_TTL_MS;
  const remaining = expiresAt - Date.now();

  return Math.max(0, remaining);
}

// =============================================================================
// ユーティリティ
// =============================================================================

/**
 * 新しいキャッシュエントリを作成する（pending状態）
 * @param title 作品タイトル
 * @param canonicalQuery 正規化タイトル
 * @returns CacheEntry
 */
export function createPendingEntry(
  title: string,
  canonicalQuery: string
): CacheEntry {
  return {
    title,
    canonicalQuery,
    representativeVideoId: null,
    representativeVideo: null,
    metrics: null,
    fetchedAt: new Date().toISOString(),
    status: "pending",
    failureReason: null,
  };
}

/**
 * キャッシュエントリを成功状態に更新する
 * @param entry 元のエントリ
 * @param updates 更新内容
 * @returns 更新後のCacheEntry
 */
export function markEntrySuccess(
  entry: CacheEntry,
  updates: Pick<CacheEntry, "representativeVideoId" | "representativeVideo" | "metrics">
): CacheEntry {
  return {
    ...entry,
    ...updates,
    fetchedAt: new Date().toISOString(),
    status: "ok" as CacheStatus,
    failureReason: null,
  };
}

/**
 * キャッシュエントリを失敗状態に更新する
 * @param entry 元のエントリ
 * @param reason 失敗理由
 * @returns 更新後のCacheEntry
 */
export function markEntryFailed(
  entry: CacheEntry,
  reason: string
): CacheEntry {
  return {
    ...entry,
    fetchedAt: new Date().toISOString(),
    status: "failed" as CacheStatus,
    failureReason: reason,
  };
}
