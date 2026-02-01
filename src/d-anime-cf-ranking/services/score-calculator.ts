/**
 * スコア計算・順位化
 *
 * - log10(value + 1) 変換
 * - min-max正規化（ページ内全作品母集団）
 * - 4指標等重み平均
 * - 順位降順算出
 * - ランク帯判定（S/A/B/C/D）
 */

import { createLogger } from "@/shared/logger";
import type {
  NicoMetrics,
  NormalizedMetrics,
  ScoreData,
  RankData,
  RankTier,
} from "@/shared/types/d-anime-cf-ranking";

const logger = createLogger("dAnimeCfRanking:ScoreCalculator");

// =============================================================================
// 型定義
// =============================================================================

/** 作品のスコア計算用入力 */
export interface ScoreInput {
  /** 作品タイトル */
  title: string;
  /** 指標（null=欠損） */
  metrics: NicoMetrics | null;
}

/** 作品のスコア計算結果 */
export interface ScoreOutput {
  /** 作品タイトル */
  title: string;
  /** スコアデータ（欠損の場合はnull） */
  scoreData: ScoreData | null;
}

/** 順位計算結果 */
export interface RankOutput {
  /** 作品タイトル */
  title: string;
  /** 順位データ（欠損の場合はnull） */
  rankData: RankData | null;
}

// =============================================================================
// ランク帯定義
// =============================================================================

/**
 * パーセンタイルからランク帯を判定する
 * @param percentile パーセンタイル（0-100、0が最上位）
 * @returns ランク帯
 */
export function determineRankTier(percentile: number): RankTier {
  if (percentile <= 3) return "S+++"; // 上位3%
  if (percentile <= 6) return "S++";  // 3-6%
  if (percentile <= 10) return "S+";  // 6-10%
  if (percentile <= 15) return "S";   // 10-15%
  if (percentile <= 25) return "A";   // 15-25%
  if (percentile <= 40) return "B";   // 25-40%
  if (percentile <= 55) return "C";   // 40-55%
  if (percentile <= 70) return "D";   // 55-70%
  if (percentile <= 85) return "E";   // 70-85%
  if (percentile <= 95) return "F";   // 85-95%
  return "G";                          // 95-100%
}

// =============================================================================
// スコア計算
// =============================================================================

/**
 * 単一の指標値をlog10変換する
 * @param value 元の値
 * @returns log10(value + 1)
 */
export function logTransform(value: number): number {
  return Math.log10(value + 1);
}

/**
 * 指標をlog10変換する
 * @param metrics 元の指標
 * @returns log10変換後の指標
 */
export function transformMetrics(metrics: NicoMetrics): NicoMetrics {
  return {
    viewCount: logTransform(metrics.viewCount),
    mylistCount: logTransform(metrics.mylistCount),
    commentCount: logTransform(metrics.commentCount),
    likeCount: logTransform(metrics.likeCount),
  };
}

/**
 * min-max正規化を行う
 * @param values 値の配列
 * @returns 正規化された値の配列（0-1）
 */
export function minMaxNormalize(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  // max == min の場合は全て同値なので0に固定
  if (max === min) {
    return values.map(() => 0);
  }

  return values.map((v) => (v - min) / (max - min));
}

/**
 * 複数作品の指標をまとめてmin-max正規化する
 * @param inputs スコア入力配列
 * @returns 正規化された指標の配列（欠損はnull）
 */
export function normalizeAllMetrics(
  inputs: ScoreInput[]
): Array<NormalizedMetrics | null> {
  // 欠損でない指標を抽出
  const validInputs = inputs.filter(
    (input): input is ScoreInput & { metrics: NicoMetrics } =>
      input.metrics !== null
  );

  if (validInputs.length === 0) {
    return inputs.map(() => null);
  }

  // 各指標のlog変換値を収集
  const viewLogs = validInputs.map((i) => logTransform(i.metrics.viewCount));
  const mylistLogs = validInputs.map((i) => logTransform(i.metrics.mylistCount));
  const commentLogs = validInputs.map((i) => logTransform(i.metrics.commentCount));
  const likeLogs = validInputs.map((i) => logTransform(i.metrics.likeCount));

  // min-max正規化
  const viewNorm = minMaxNormalize(viewLogs);
  const mylistNorm = minMaxNormalize(mylistLogs);
  const commentNorm = minMaxNormalize(commentLogs);
  const likeNorm = minMaxNormalize(likeLogs);

  // 結果をマッピング
  let validIndex = 0;
  return inputs.map((input) => {
    if (input.metrics === null) {
      return null;
    }

    const normalized: NormalizedMetrics = {
      viewCount: viewNorm[validIndex],
      mylistCount: mylistNorm[validIndex],
      commentCount: commentNorm[validIndex],
      likeCount: likeNorm[validIndex],
    };
    validIndex++;
    return normalized;
  });
}

/**
 * 正規化された指標から総合スコアを計算する（4指標等重み平均）
 * @param normalized 正規化された指標
 * @returns 総合スコア（0-1）
 */
export function calculateTotalScore(normalized: NormalizedMetrics): number {
  const sum =
    normalized.viewCount +
    normalized.mylistCount +
    normalized.commentCount +
    normalized.likeCount;
  return sum / 4;
}

// =============================================================================
// 順位計算
// =============================================================================

/**
 * 複数作品のスコアを計算し、順位を付ける
 * @param inputs スコア入力配列
 * @returns 順位出力配列
 */
export function calculateRanks(inputs: ScoreInput[]): RankOutput[] {
  // 正規化
  const normalizedMetrics = normalizeAllMetrics(inputs);

  // スコア計算
  const scores: ScoreOutput[] = inputs.map((input, index) => {
    const normalized = normalizedMetrics[index];
    if (normalized === null || input.metrics === null) {
      return {
        title: input.title,
        scoreData: null,
      };
    }

    const totalScore = calculateTotalScore(normalized);
    const logMetrics = transformMetrics(input.metrics);

    return {
      title: input.title,
      scoreData: {
        totalScore,
        normalizedMetrics: normalized,
        logMetrics,
      },
    };
  });

  // スコアが有効なものを抽出してソート
  const validScores = scores
    .map((s, index) => ({ ...s, originalIndex: index }))
    .filter((s) => s.scoreData !== null);

  validScores.sort((a, b) => {
    // スコア降順
    const scoreA = a.scoreData?.totalScore ?? 0;
    const scoreB = b.scoreData?.totalScore ?? 0;
    return scoreB - scoreA;
  });

  // 順位を付ける
  // totalCountはスコアが有効なカード数（ランキング対象数）を使用
  const totalCount = validScores.length;
  const rankMap = new Map<number, number>();

  validScores.forEach((item, index) => {
    rankMap.set(item.originalIndex, index + 1); // 1始まり
  });

  // 結果を構築
  const results: RankOutput[] = scores.map((score, index) => {
    if (score.scoreData === null) {
      return {
        title: score.title,
        rankData: null,
      };
    }

    const rank = rankMap.get(index) ?? 0;
    const percentile = totalCount > 0 ? (rank / totalCount) * 100 : 100;
    const tier = determineRankTier(percentile);

    return {
      title: score.title,
      rankData: {
        rank,
        totalCount,
        tier,
        score: score.scoreData,
      },
    };
  });

  logger.debug("Ranks calculated", {
    inputCount: inputs.length,
    validCount: totalCount,
  });

  return results;
}

/**
 * 単一作品のスコアを計算する（既存の正規化データを使用）
 * @param metrics 指標
 * @param allInputs 全作品の入力（正規化母集団）
 * @returns スコアデータ
 */
export function calculateSingleScore(
  metrics: NicoMetrics,
  allInputs: ScoreInput[]
): ScoreData | null {
  // 対象作品を含めて正規化
  const targetInput: ScoreInput = { title: "__target__", metrics };
  const allWithTarget = [...allInputs, targetInput];

  const normalizedMetrics = normalizeAllMetrics(allWithTarget);
  const targetNormalized = normalizedMetrics[normalizedMetrics.length - 1];

  if (targetNormalized === null) {
    return null;
  }

  const totalScore = calculateTotalScore(targetNormalized);
  const logMetrics = transformMetrics(metrics);

  return {
    totalScore,
    normalizedMetrics: targetNormalized,
    logMetrics,
  };
}
