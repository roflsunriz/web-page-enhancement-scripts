/**
 * d-anime-cf-ranking 型定義
 *
 * dアニメストアCFページのニコニコ人気度ランキング表示用
 */

// =============================================================================
// 基本型
// =============================================================================

/** キャッシュエントリの状態 */
export type CacheStatus = "ok" | "failed" | "pending";

/** ランク帯（パーセンタイル） */
export type RankTier = "S" | "A" | "B" | "C" | "D";

/** 投稿者種別 */
export type UploaderType = "danime" | "official" | "unknown";

// =============================================================================
// ニコニコ動画指標
// =============================================================================

/** ニコニコ動画の人気指標（4指標） */
export interface NicoMetrics {
  /** 再生数 */
  viewCount: number;
  /** マイリスト数 */
  mylistCount: number;
  /** コメント数 */
  commentCount: number;
  /** いいね数 */
  likeCount: number;
}

/** 正規化された指標（0-1） */
export interface NormalizedMetrics {
  viewCount: number;
  mylistCount: number;
  commentCount: number;
  likeCount: number;
}

// =============================================================================
// 代表動画
// =============================================================================

/** 代表動画の情報 */
export interface RepresentativeVideo {
  /** ニコニコ動画ID（so~） */
  videoId: string;
  /** 動画タイトル */
  title: string;
  /** 投稿日時（ISO8601） */
  postedAt: string;
  /** 投稿者種別 */
  uploaderType: UploaderType;
  /** 投稿者名 */
  uploaderName: string;
}

// =============================================================================
// スコア・順位
// =============================================================================

/** スコア計算結果 */
export interface ScoreData {
  /** 総合スコア（0-1） */
  totalScore: number;
  /** 正規化後の各指標 */
  normalizedMetrics: NormalizedMetrics;
  /** log10変換後の各指標（デバッグ用） */
  logMetrics: NicoMetrics;
}

/** 順位データ */
export interface RankData {
  /** 順位（1始まり） */
  rank: number;
  /** 総作品数 */
  totalCount: number;
  /** ランク帯 */
  tier: RankTier;
  /** スコア情報 */
  score: ScoreData;
}

// =============================================================================
// キャッシュ
// =============================================================================

/** IndexedDBに保存するキャッシュエントリ */
export interface CacheEntry {
  /** 作品タイトル（検索キー） */
  title: string;
  /** 検索に用いた正規化後タイトル */
  canonicalQuery: string;
  /** 代表動画ID */
  representativeVideoId: string | null;
  /** 代表動画情報 */
  representativeVideo: RepresentativeVideo | null;
  /** 4指標 */
  metrics: NicoMetrics | null;
  /** 取得時刻（ISO8601） */
  fetchedAt: string;
  /** 状態 */
  status: CacheStatus;
  /** 失敗時の理由 */
  failureReason: string | null;
}

/** キャッシュストア（IndexedDB用） */
export interface CacheStore {
  /** キー: 作品タイトル */
  [title: string]: CacheEntry;
}

// =============================================================================
// 設定
// =============================================================================

/** ユーザー設定 */
export interface Settings {
  /** 表示ON/OFF */
  enabled: boolean;
}

/** デフォルト設定 */
export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
};

// =============================================================================
// 作品カード情報
// =============================================================================

/** dアニメストアの作品カード情報 */
export interface AnimeCard {
  /** 作品ID（data-workid） */
  workId: string;
  /** 作品タイトル */
  title: string;
  /** DOM要素 */
  element: HTMLElement;
  /** 挿入位置のDOM要素（circleProgressの後、checkの前） */
  insertionPoint: HTMLElement | null;
}

// =============================================================================
// 表示状態
// =============================================================================

/** 作品カードの表示状態 */
export interface CardDisplayState {
  /** 作品タイトル */
  title: string;
  /** ロード中かどうか */
  isLoading: boolean;
  /** エラーかどうか */
  isError: boolean;
  /** エラーメッセージ */
  errorMessage: string | null;
  /** 順位データ */
  rankData: RankData | null;
  /** キャッシュエントリ */
  cacheEntry: CacheEntry | null;
}

// =============================================================================
// フェッチ制御
// =============================================================================

/** フェッチキューアイテム */
export interface FetchQueueItem {
  /** 作品タイトル */
  title: string;
  /** 正規化タイトル */
  canonicalQuery: string;
  /** コールバック */
  resolve: (entry: CacheEntry) => void;
  /** エラーコールバック */
  reject: (error: Error) => void;
}

// =============================================================================
// ツールチップ情報
// =============================================================================

/** ツールチップに表示する詳細情報 */
export interface TooltipData {
  /** 順位 */
  rank: number;
  /** 総作品数 */
  totalCount: number;
  /** ランク帯 */
  tier: RankTier;
  /** 総合スコア */
  totalScore: number;
  /** 生の指標 */
  rawMetrics: NicoMetrics;
  /** 正規化指標 */
  normalizedMetrics: NormalizedMetrics;
  /** 代表動画情報 */
  representativeVideo: RepresentativeVideo | null;
  /** データ取得日時 */
  fetchedAt: string;
  /** ランキング確定済みか */
  isRankingFinalized: boolean;
}

// =============================================================================
// 定数
// =============================================================================

/** TTL（キャッシュ有効期限）: 24時間（ミリ秒） */
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** ビューポート内の最大取得件数 */
export const MAX_VIEWPORT_ITEMS = 10;

/** 並列取得数 */
export const MAX_CONCURRENT_FETCHES = 3;

/** リトライクールダウン（ミリ秒） */
export const RETRY_COOLDOWN_MS = 3000;

/** 順位再計算のスロットル間隔（ミリ秒） */
export const RECALCULATE_THROTTLE_MS = 500;

/** ビューポート変更のデバウンス間隔（ミリ秒） */
export const VIEWPORT_DEBOUNCE_MS = 300;

/** IndexedDBデータベース名 */
export const IDB_DATABASE_NAME = "dAnimeCfRankingCache";

/** IndexedDBストア名 */
export const IDB_STORE_NAME = "metricsCache";

/** IndexedDBバージョン */
export const IDB_VERSION = 1;
