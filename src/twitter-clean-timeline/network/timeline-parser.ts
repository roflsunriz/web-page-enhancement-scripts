/**
 * twitter-clean-timeline - GraphQL JSONパーサー
 */

import type {
  HomeTimelineResponse,
  TimelineData,
  TweetResult,
  TweetLegacy,
} from '@/shared/types';

/**
 * HomeTimelineレスポンスからタイムラインデータを取得
 */
export function extractTimelineData(response: HomeTimelineResponse): TimelineData | null {
  return response?.data?.home?.home_timeline_urt ?? null;
}

/**
 * TweetResultからlegacyデータを取得（ネスト対応）
 */
export function getTweetLegacy(tweet: TweetResult | undefined): TweetLegacy | null {
  if (!tweet) return null;
  
  // 直接legacyがある場合
  if (tweet.legacy) return tweet.legacy;
  
  // tweet.tweetにネストされている場合（引用RTなど）
  if (tweet.tweet?.legacy) return tweet.tweet.legacy;
  
  return null;
}

/**
 * ツイートにメディアが含まれているかチェック
 */
export function hasMediaInTweet(tweet: TweetResult | undefined): boolean {
  const legacy = getTweetLegacy(tweet);
  if (!legacy) return false;

  const extendedMedia = legacy.extended_entities?.media;
  const basicMedia = legacy.entities?.media;

  const mediaList = extendedMedia ?? basicMedia ?? [];
  return Array.isArray(mediaList) && mediaList.length > 0;
}

/**
 * ツイートがリツイートかどうかチェック
 */
export function isRetweet(tweet: TweetResult | undefined): boolean {
  const legacy = getTweetLegacy(tweet);
  if (!legacy) return false;

  // retweeted_status_id_strがあればRT
  if (legacy.retweeted_status_id_str) return true;

  // テキストが "RT @" で始まる場合もRT
  const text = legacy.full_text ?? '';
  if (text.startsWith('RT @')) return true;

  return false;
}

/**
 * ツイートの本文テキストを取得
 */
export function getTweetText(tweet: TweetResult | undefined): string {
  const legacy = getTweetLegacy(tweet);
  return legacy?.full_text ?? '';
}

/**
 * ツイートのユーザー名を取得
 */
export function getTweetUsername(tweet: TweetResult | undefined): string {
  if (!tweet) return '';
  
  const screenName = tweet.core?.user_results?.result?.legacy?.screen_name;
  return screenName ?? '';
}

