import type { CopyMode } from "./state";
import type { TweetData } from "@/shared/types";

/**
 * 単一ツイートをフォーマットする
 * @param tweet - フォーマットするツイートデータ
 * @returns フォーマットされた文字列
 */
export function formatSingleTweet(tweet: TweetData): string {
  let formatted = `${tweet.author} ${tweet.handle}\n${tweet.text}\n${tweet.time}\n`;
  if (tweet.url) {
    formatted += `${tweet.url}\n`;
  }

  if (tweet.mediaUrls.length > 0) {
    formatted += tweet.mediaUrls.join("\n") + "\n";
  }

  if (tweet.quotedTweet) {
    const qt = tweet.quotedTweet;
    formatted += `\n> 引用元: ${qt.author} ${qt.handle}\n`;
    formatted += `> ${qt.text.replace(/\n/g, "\n> ")}\n`;
    if (qt.mediaUrls.length > 0) {
      formatted += `> ${qt.mediaUrls.join("\n> ")}\n`;
    }
    formatted += `> ${qt.url}\n`;
  }

  return formatted;
}

/**
 * 複数のツイートを文字数制限付きでフォーマットする
 * @param tweets - ツイートデータの配列
 * @param limit - 文字数制限
 * @returns フォーマットされた文字列
 */
export function formatTweetsWithLimit(
  tweets: TweetData[],
  limit: number,
): string {
  if (!tweets || tweets.length === 0) {
    return "";
  }

  let result = "";
  const separator = "\n\n---\n\n";

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    const formattedTweet = formatSingleTweet(tweet);
    const textToAdd = i === 0 ? formattedTweet : separator + formattedTweet;

    if (result.length + textToAdd.length > limit) {
      const remaining = limit - result.length;
      if (remaining > separator.length) {
        result += textToAdd.substring(0, remaining - 3) + "...";
      }
      break;
    }
    result += textToAdd;
  }

  return result;
}

const SHITARABA_TEXT_URL_PATTERN = /https?:\/\/[^\s]+/g;

class ShitarabaUrlLimiter {
  private hasThreadUrlIncluded = false;
  private remainingMediaSlots = 5;

  consumeThreadUrl(url?: string): string | null {
    if (!url || this.hasThreadUrlIncluded) {
      return null;
    }
    this.hasThreadUrlIncluded = true;
    return url;
  }

  consumeMediaUrls(urls: string[]): string[] {
    if (this.remainingMediaSlots <= 0) {
      return [];
    }

    const filtered = urls.filter((candidate) => candidate.trim().length > 0);
    const allowed = filtered.slice(0, this.remainingMediaSlots);
    this.remainingMediaSlots -= allowed.length;
    return allowed;
  }
}

function sanitizeTextForShitaraba(text: string): string {
  if (!text) {
    return "";
  }

  const withoutUrls = text
    .replace(SHITARABA_TEXT_URL_PATTERN, "")
    .replace(/[ \t]+\n/g, "\n");

  const normalizedLines = withoutUrls
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trim());

  for (let i = normalizedLines.length - 1; i >= 0; i--) {
    if (normalizedLines[i] !== "") {
      break;
    }
    normalizedLines.pop();
  }

  return normalizedLines.join("\n");
}

function formatShitarabaTweet(
  tweet: TweetData,
  limiter: ShitarabaUrlLimiter,
): string {
  const lines: string[] = [];

  lines.push(`${tweet.author} ${tweet.handle}`);

  const sanitizedText = sanitizeTextForShitaraba(tweet.text);
  if (sanitizedText.length > 0) {
    lines.push(sanitizedText);
  } else {
    lines.push("");
  }

  lines.push(tweet.time);

  const threadUrl = limiter.consumeThreadUrl(tweet.url);
  if (threadUrl) {
    lines.push(threadUrl);
  }

  const mediaUrls = limiter.consumeMediaUrls(tweet.mediaUrls);
  if (mediaUrls.length > 0) {
    lines.push(...mediaUrls);
  }

  if (tweet.quotedTweet) {
    const { quotedTweet } = tweet;
    if (quotedTweet) {
      const quoteLines: string[] = [];
      quoteLines.push(`> 引用元: ${quotedTweet.author} ${quotedTweet.handle}`);

      const sanitizedQuoteText = sanitizeTextForShitaraba(quotedTweet.text);
      if (sanitizedQuoteText.length > 0) {
        quoteLines.push(
          ...sanitizedQuoteText.split("\n").map((line) => `> ${line}`),
        );
      }

      const quoteMediaUrls = limiter.consumeMediaUrls(quotedTweet.mediaUrls);
      if (quoteMediaUrls.length > 0) {
        quoteLines.push(...quoteMediaUrls.map((url) => `> ${url}`));
      }

      if (quoteLines.length > 0) {
        lines.push("");
        lines.push(...quoteLines);
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

export function formatShitarabaTweetsWithLimit(
  tweets: TweetData[],
  limit: number,
): string {
  if (!tweets || tweets.length === 0) {
    return "";
  }

  const limiter = new ShitarabaUrlLimiter();

  let result = "";
  const separator = "\n\n---\n\n";

  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    const formattedTweet = formatShitarabaTweet(tweet, limiter);
    const textToAdd = i === 0 ? formattedTweet : separator + formattedTweet;

    if (result.length + textToAdd.length > limit) {
      const remaining = limit - result.length;
      if (remaining > separator.length) {
        result += textToAdd.substring(0, remaining - 3) + "...";
      }
      break;
    }

    result += textToAdd;
  }

  return result;
}

/**
 * 全てのツイートを連結してフォーマットする
 * @param tweets - ツイートデータの配列
 * @returns フォーマットされた文字列
 */
export function formatAllTweets(tweets: TweetData[]): string {
  if (!tweets || tweets.length === 0) {
    return "";
  }

  let formatted = formatSingleTweet(tweets[0]);

  for (let i = 1; i < tweets.length; i++) {
    formatted += "\n\n---\n\n" + formatSingleTweet(tweets[i]);
  }

  return formatted;
}

/**
 * コピー結果のサマリーメッセージを生成する
 * @param tweets - 処理されたツイートの配列
 * @param formattedText - フォーマット後のテキスト
 * @param mode - コピーモード
 * @param startFromAuthor - コピー開始点の著者名
 * @returns サマリー文字列
 */
export function generateSummary(
  tweets: TweetData[],
  formattedText: string,
  mode: CopyMode,
  startFromAuthor: string | null = null,
): string {
  let summary = "";

  if (startFromAuthor) {
    summary += `${startFromAuthor}のツイートから`;
  }

  if (tweets.length > 0) {
    const author = tweets[0].author;
    summary += `${author}のスレッド`;
  }

  summary += `(${tweets.length}件)をコピーしました。`;
  summary += `文字数: ${formatByteSize(formattedText.length)}`;

  if (mode === "shitaraba" || mode === "5ch") {
    const limit = mode === "shitaraba" ? 4096 : 2048;
    summary += `/${limit}`;
  }

  return summary;
}

/**
 * バイト数を読みやすい形式にフォーマットする
 * @param size - バイト数
 * @returns フォーマットされた文字列
 */
function formatByteSize(size: number): string {
  if (size < 1000) {
    return size.toString();
  } else if (size < 10000) {
    return (size / 1000).toFixed(1) + "k";
  } else {
    return Math.round(size / 1000) + "k";
  }
}
