/**
 * タイトル正規化ユーティリティ
 *
 * dアニメストアのタイトルをニコニコ動画検索用に正規化する
 * - 「2nd season / Season 2 / 第2期 / 2期」→「第2期」統一
 * - ローマ数字→アラビア数字変換（II → 2）
 * - 「続編 / 完結編 / 後編」は正規化しない
 */

import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnimeCfRanking:TitleNormalizer");

// =============================================================================
// ローマ数字変換テーブル
// =============================================================================

const ROMAN_TO_ARABIC: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
  XI: 11,
  XII: 12,
  XIII: 13,
  XIV: 14,
  XV: 15,
  XVI: 16,
  XVII: 17,
  XVIII: 18,
  XIX: 19,
  XX: 20,
};

// =============================================================================
// 正規化パターン
// =============================================================================

/**
 * シーズン表記パターン（キャプチャグループで数字を抽出）
 * - Season 2, season2, Season02
 * - 2nd season, 3rd season
 * - 第2期, 2期
 * - Part 2, part2
 */
const SEASON_PATTERNS: Array<{
  pattern: RegExp;
  extractor: (match: RegExpMatchArray) => number | null;
}> = [
  // "Season 2", "Season02", "season 3"
  {
    pattern: /[Ss]eason\s*0?(\d+)/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "2nd season", "3rd season", "1st Season"
  {
    pattern: /(\d+)(?:st|nd|rd|th)\s*[Ss]eason/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "第2期", "第02期"
  {
    pattern: /第0?(\d+)期/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "2期" (単独、ただし「第」なし)
  {
    pattern: /(?<![第\d])(\d+)期(?![間])/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "Part 2", "Part02"
  {
    pattern: /[Pp]art\s*0?(\d+)/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "第2シリーズ"
  {
    pattern: /第0?(\d+)シリーズ/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "2ndシーズン", "3rdシーズン"
  {
    pattern: /(\d+)(?:st|nd|rd|th)\s*シーズン/,
    extractor: (m) => parseInt(m[1], 10),
  },
  // "シーズン2"
  {
    pattern: /シーズン\s*0?(\d+)/,
    extractor: (m) => parseInt(m[1], 10),
  },
];

/**
 * ローマ数字シーズンパターン
 * - "II", "III" など単独のローマ数字（期を示す文脈）
 */
const ROMAN_SEASON_PATTERN = /(?:^|\s)(X{0,2}(?:IX|IV|V?I{0,3}))(?:\s|$|期|シーズン)/;

/**
 * 正規化しない表記（続編/完結編/後編など）
 */
const SKIP_PATTERNS = [
  /続編/,
  /完結編/,
  /後編/,
  /前編/,
  /劇場版/,
  /OVA/,
  /OAD/,
  /特別編/,
  /番外編/,
];

// =============================================================================
// 正規化関数
// =============================================================================

/**
 * タイトルからシーズン番号を抽出する
 * @param title 元タイトル
 * @returns シーズン番号（見つからない場合はnull）
 */
export function extractSeasonNumber(title: string): number | null {
  // アラビア数字パターンをチェック
  for (const { pattern, extractor } of SEASON_PATTERNS) {
    const match = title.match(pattern);
    if (match) {
      const num = extractor(match);
      if (num !== null && num > 0 && num <= 20) {
        return num;
      }
    }
  }

  // ローマ数字パターンをチェック
  const romanMatch = title.match(ROMAN_SEASON_PATTERN);
  if (romanMatch && romanMatch[1]) {
    const roman = romanMatch[1].toUpperCase();
    const arabic = ROMAN_TO_ARABIC[roman];
    if (arabic !== undefined) {
      return arabic;
    }
  }

  return null;
}

/**
 * タイトルを正規化する（第n期形式に統一）
 * @param title 元タイトル
 * @returns 正規化後タイトル
 */
export function normalizeTitle(title: string): string {
  // 空白のトリム
  const normalized = title.trim();

  // スキップすべきパターンのチェック
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(normalized)) {
      logger.debug("Skipping normalization (special pattern)", {
        title,
        pattern: pattern.source,
      });
      return normalized;
    }
  }

  // シーズン番号を抽出
  const seasonNumber = extractSeasonNumber(normalized);
  if (seasonNumber === null) {
    // シーズン表記がない場合はそのまま返す
    return normalized;
  }

  // 既に「第n期」形式ならそのまま
  if (new RegExp(`第0?${seasonNumber}期`).test(normalized)) {
    return normalized;
  }

  // シーズン表記を削除して「第n期」を付加
  let baseTitle = normalized;

  // 各パターンを削除
  for (const { pattern } of SEASON_PATTERNS) {
    baseTitle = baseTitle.replace(pattern, "").trim();
  }

  // ローマ数字も削除
  baseTitle = baseTitle.replace(ROMAN_SEASON_PATTERN, " ").trim();

  // 連続スペースを単一スペースに
  baseTitle = baseTitle.replace(/\s+/g, " ").trim();

  // 末尾のハイフンやスペースを削除
  baseTitle = baseTitle.replace(/[-\s]+$/, "").trim();

  // 「第n期」を付加
  const result = `${baseTitle} 第${seasonNumber}期`;

  logger.debug("Title normalized", {
    original: title,
    normalized: result,
    seasonNumber,
  });

  return result;
}

/**
 * ローマ数字をアラビア数字に変換する
 * @param roman ローマ数字文字列
 * @returns アラビア数字（変換できない場合はnull）
 */
export function romanToArabic(roman: string): number | null {
  const upper = roman.toUpperCase();
  return ROMAN_TO_ARABIC[upper] ?? null;
}

/**
 * タイトルの類似度を計算する（レーベンシュタイン距離ベース）
 * @param a 文字列A
 * @param b 文字列B
 * @returns 類似度（0-100、100が完全一致）
 */
export function calculateSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) {
    return 100;
  }
  return Math.round((1 - distance / maxLength) * 100);
}

/**
 * レーベンシュタイン距離を計算する
 */
function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;

  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];

  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[bn][an];
}
