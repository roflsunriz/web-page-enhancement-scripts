/**
 * 代表動画選択ロジック
 *
 * 作品の代表動画（第一話相当）を決定する
 * - dアニメストア ニコニコ支店と作品タイトル投稿者の両方がある場合、再生数が多い方を優先
 * - 片方のみの場合はそちらを選択
 * - 見つからない場合は失敗扱い
 */

import { createLogger } from "@/shared/logger";
import type { NicoSearchResultItem, NicoApiClient } from "./nico-api-client";

const logger = createLogger("dAnimeCfRanking:RepresentativeSelector");

// =============================================================================
// 型定義
// =============================================================================

/** 選択結果 */
export interface SelectionResult {
  /** 成功したかどうか */
  success: boolean;
  /** 選択された動画（成功時） */
  video: NicoSearchResultItem | null;
  /** 失敗理由（失敗時） */
  failureReason: string | null;
}

// =============================================================================
// 代表動画選択
// =============================================================================

/**
 * 代表動画を選択する
 *
 * 選択ルール:
 * 1. dアニメストア ニコニコ支店の動画から最古を選択
 * 2. 作品タイトル投稿者の動画から最古を選択
 * 3. 両方存在する場合 → 再生数が多い方を優先
 * 4. 片方のみの場合 → そちらを選択
 * 5. どちらもない場合は失敗
 *
 * @param searchResults 検索結果
 * @param animeTitle アニメタイトル（投稿者ガード用）
 * @param apiClient NicoApiClientクラス参照
 * @returns 選択結果
 */
export function selectRepresentativeVideo(
  searchResults: NicoSearchResultItem[],
  animeTitle: string,
  apiClient: typeof NicoApiClient
): SelectionResult {
  if (searchResults.length === 0) {
    return {
      success: false,
      video: null,
      failureReason: "検索結果が0件です",
    };
  }

  // Step 1: dアニメストア ニコニコ支店の動画を抽出
  const danimeVideos = searchResults.filter((item) => {
    const uploaderType = apiClient.determineUploaderType(item.ownerName, animeTitle);
    return uploaderType === "danime";
  });

  // Step 2: 作品タイトル投稿者の動画を抽出（official = アニメタイトル投稿者）
  const titleUploaderVideos = searchResults.filter((item) => {
    const uploaderType = apiClient.determineUploaderType(item.ownerName, animeTitle);
    return uploaderType === "official";
  });

  // 各グループから最古の動画を取得
  const oldestDanime = findOldestVideo(danimeVideos);
  const oldestTitle = findOldestVideo(titleUploaderVideos);

  logger.debug("Candidate videos", {
    animeTitle,
    danimeCount: danimeVideos.length,
    titleUploaderCount: titleUploaderVideos.length,
    danimeVideo: oldestDanime ? { id: oldestDanime.videoId, views: oldestDanime.viewCount } : null,
    titleVideo: oldestTitle ? { id: oldestTitle.videoId, views: oldestTitle.viewCount } : null,
  });

  // Step 3: 両方存在する場合、再生数で比較
  if (oldestDanime && oldestTitle) {
    const danimeViews = oldestDanime.viewCount ?? 0;
    const titleViews = oldestTitle.viewCount ?? 0;

    const selected = danimeViews >= titleViews ? oldestDanime : oldestTitle;
    const source = danimeViews >= titleViews ? "dAnime" : "titleUploader";

    logger.info("Representative video selected (compared by viewCount)", {
      animeTitle,
      videoId: selected.videoId,
      viewCount: selected.viewCount,
      source,
      danimeViews,
      titleViews,
    });

    return {
      success: true,
      video: selected,
      failureReason: null,
    };
  }

  // Step 4: 片方のみの場合
  if (oldestDanime) {
    logger.info("Representative video selected (dAnime only)", {
      animeTitle,
      videoId: oldestDanime.videoId,
      viewCount: oldestDanime.viewCount,
    });
    return {
      success: true,
      video: oldestDanime,
      failureReason: null,
    };
  }

  if (oldestTitle) {
    logger.info("Representative video selected (titleUploader only)", {
      animeTitle,
      videoId: oldestTitle.videoId,
      viewCount: oldestTitle.viewCount,
    });
    return {
      success: true,
      video: oldestTitle,
      failureReason: null,
    };
  }

  // Step 5: 失敗
  logger.warn("No representative video found", {
    animeTitle,
    totalResults: searchResults.length,
    danimeCount: danimeVideos.length,
    titleUploaderCount: titleUploaderVideos.length,
  });

  return {
    success: false,
    video: null,
    failureReason: `公式動画が見つかりませんでした（検索結果: ${searchResults.length}件）`,
  };
}

/**
 * 動画配列から最古投稿日の動画を選択する
 * @param videos 動画配列
 * @returns 最古の動画（空配列の場合はnull）
 */
function findOldestVideo(
  videos: NicoSearchResultItem[]
): NicoSearchResultItem | null {
  if (videos.length === 0) {
    return null;
  }

  // postedAtが有効な動画のみをフィルタ
  const validVideos = videos.filter((v) => {
    if (!v.postedAt) return false;
    const date = new Date(v.postedAt);
    return !isNaN(date.getTime());
  });

  if (validVideos.length === 0) {
    // postedAtが無効な場合は最初の動画を返す
    logger.warn("No valid postedAt found, using first video");
    return videos[0];
  }

  // 投稿日でソート（昇順 = 古い順）
  const sorted = [...validVideos].sort((a, b) => {
    const dateA = new Date(a.postedAt).getTime();
    const dateB = new Date(b.postedAt).getTime();
    return dateA - dateB;
  });

  return sorted[0];
}

/**
 * タイトルマッチングで完全一致を判定する
 * @param searchTitle 検索タイトル（正規化済み）
 * @param videoTitle 動画タイトル
 * @returns 完全一致かどうか
 */
export function isExactTitleMatch(
  searchTitle: string,
  videoTitle: string
): boolean {
  // 両方を正規化して比較
  const normalizedSearch = normalizeForComparison(searchTitle);
  const normalizedVideo = normalizeForComparison(videoTitle);

  // 完全一致
  if (normalizedSearch === normalizedVideo) {
    return true;
  }

  // 動画タイトルが検索タイトルを含む（サブタイトル考慮）
  // 例: "作品名 第1話「サブタイトル」" が "作品名" を含む
  if (normalizedVideo.startsWith(normalizedSearch)) {
    return true;
  }

  return false;
}

/**
 * 比較用に文字列を正規化する
 */
function normalizeForComparison(str: string): string {
  return str
    .trim()
    .toLowerCase()
    // 全角→半角
    .replace(/[\uff01-\uff5e]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    // 連続スペースを単一に
    .replace(/\s+/g, " ");
}
