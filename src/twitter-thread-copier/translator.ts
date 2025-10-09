import { logger } from "./logger.js";
import type { TweetData } from "@/shared/types";
import { notify } from "@/shared/userscript";

const LOCAL_AI_ENDPOINT = "http://localhost:3002/v1/chat/completions";
const GOOGLE_TRANSLATE_ENDPOINT =
  "https://translate.googleapis.com/translate_a/single";

const LOCAL_AI_SYSTEM_PROMPT =
  "You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into the target Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";

const ZERO_WIDTH_CHARS_REGEX = /(?:\u200B|\u200C|\u200D|\u2060|\uFEFF)/g;

type FixedSegment = {
  kind: "fixed";
  value: string;
};

type TextSegment = {
  kind: "text";
  original: string;
  translated?: string;
};

type Segment = FixedSegment | TextSegment;

export interface TranslateTweetsResult {
  tweets: TweetData[];
  hasTranslation: boolean;
}

export async function translateTweets(
  tweets: TweetData[],
): Promise<TranslateTweetsResult> {
  const clonedTweets = tweets.map(cloneTweet);
  const segmentedTweets = clonedTweets.map((tweet) => ({
    tweet,
    textSegments: segmentText(tweet.text),
    quotedSegments: tweet.quotedTweet ? segmentText(tweet.quotedTweet.text) : null,
  }));

  const translationQueue: TextSegment[] = [];

  for (const entry of segmentedTweets) {
    for (const segment of entry.textSegments) {
      enqueueTranslatableSegment(segment, translationQueue);
    }
    if (entry.quotedSegments) {
      for (const segment of entry.quotedSegments) {
        enqueueTranslatableSegment(segment, translationQueue);
      }
    }
  }

  if (translationQueue.length === 0) {
    return { tweets: clonedTweets, hasTranslation: false };
  }

  let hasTranslation = false;
  for (let i = 0; i < translationQueue.length; i++) {
    const segment = translationQueue[i];
    try {
      const translated = await translateSingleSegment(segment.original);
      segment.translated = translated;
      if (!hasTranslation && translated !== segment.original) {
        hasTranslation = true;
      }
    } catch (error) {
      logger.error(`セグメント翻訳に失敗: ${(error as Error).message}`);
      segment.translated = segment.original;
    }

    const hasMore = i < translationQueue.length - 1;
    if (hasMore) {
      await delay(1000 + Math.random() * 500);
    }
  }

  for (const entry of segmentedTweets) {
    entry.tweet.text = joinSegments(entry.textSegments);
    if (entry.quotedSegments && entry.tweet.quotedTweet) {
      entry.tweet.quotedTweet.text = joinSegments(entry.quotedSegments);
    }
  }

  return { tweets: clonedTweets, hasTranslation };
}

function enqueueTranslatableSegment(
  segment: Segment,
  queue: TextSegment[],
): void {
  if (segment.kind === "text") {
    if (segment.original.trim().length === 0) {
      segment.translated = segment.original;
      return;
    }
    queue.push(segment);
  }
}

function joinSegments(segments: Segment[]): string {
  if (segments.length === 0) {
    return "";
  }

  let result = "";
  for (const segment of segments) {
    if (segment.kind === "fixed") {
      const value = segment.value;
      if (isUrlLike(value)) {
        result = normalizeTrailingColon(result);
      }
      result += value;
    } else {
      result += segment.translated ?? segment.original;
    }
  }
  return result;
}

function segmentText(text: string): Segment[] {
  if (!text) {
    return [];
  }

  const pattern = /(https?:\/\/[^\s]+|@[A-Za-z0-9_]{1,15})/g;
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: "text",
        original: text.slice(lastIndex, match.index),
      });
    }
    segments.push({
      kind: "fixed",
      value: sanitizeFixedSegmentValue(match[0]),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      kind: "text",
      original: text.slice(lastIndex),
    });
  }

  if (segments.length === 0) {
    segments.push({ kind: "text", original: text });
  }

  return segments;
}

function sanitizeFixedSegmentValue(value: string): string {
  if (isUrlLike(value)) {
    const sanitized = normalizeUrlString(value);
    return sanitized.length > 0 ? sanitized : value;
  }
  return value;
}

function isUrlLike(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function normalizeUrlString(value: string): string {
  return value
    .replace(ZERO_WIDTH_CHARS_REGEX, "")
    .replace(/\s+/g, "")
    .replace(/\u2026+$/gu, "");
}

function normalizeTrailingColon(text: string): string {
  if (text.length === 0) {
    return text;
  }
  return text.replace(/：\s*$/u, ": ").replace(/:\s*$/u, ": ");
}

async function translateSingleSegment(text: string): Promise<string> {
  if (text.trim().length === 0) {
    return text;
  }

  const localResult = await translateWithLocalAI(text);
  if (localResult) {
    return localResult;
  }

  try {
    return await translateWithGoogle(text);
  } catch (error) {
    logger.error(`Google翻訳にも失敗しました: ${(error as Error).message}`);
    return text;
  }
}

async function translateWithLocalAI(text: string): Promise<string | null> {
  try {
    const prompt = `<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${text}
<|plamo:op|>output lang=ja`;

    const response = await new Promise<GM.Response<unknown>>(
      (resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: LOCAL_AI_ENDPOINT,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            model: "plamo-13b-instruct",
            messages: [
              { role: "system", content: LOCAL_AI_SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
            temperature: 0,
            max_tokens: 4096,
            stream: false,
          }),
          timeout: 120000, // 2 minutes
          onload: (res) =>
            res.status >= 200 && res.status < 300
              ? resolve(res as GM.Response<unknown>)
              : reject(new Error(`API error: ${res.status}`)),
          onerror: (err) => reject(err),
          ontimeout: () => reject(new Error("Timeout")),
        });
      },
    );

    const data = JSON.parse(response.responseText as string);
    const translated = data?.choices?.[0]?.message?.content;

    if (translated && translated.trim().length > 0) {
      logger.log("ローカルAIでの翻訳に成功しました。");
      notify("ローカルAIでの翻訳が完了しました。", "Twitter Thread Copier");
      return translated;
    }
    throw new Error("ローカルAIからの翻訳結果が空です。");
  } catch (error) {
    logger.error(`ローカルAIでの翻訳に失敗: ${(error as Error).message}`);
    return null;
  }
}

async function translateWithGoogle(text: string): Promise<string> {
  const sourceLang = "auto";
  const targetLang = "ja";
  let retryCount = 0;
  const MAX_RETRIES = 3;

  while (retryCount < MAX_RETRIES) {
    try {
      const url = `${GOOGLE_TRANSLATE_ENDPOINT}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
        text,
      )}`;

      const response = await new Promise<GM.Response<unknown>>(
        (resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url,
            timeout: 15000,
            onload: (res) =>
              res.status >= 200 && res.status < 300
                ? resolve(res as GM.Response<unknown>)
                : reject(new Error(`API error: ${res.status}`)),
            onerror: (err) => reject(err),
            ontimeout: () => reject(new Error("Timeout")),
          });
        },
      );

      const data = JSON.parse(response.responseText as string);
      if (!data?.sentences?.length) {
        throw new Error("Invalid translation response format.");
      }
      const translatedText = data.sentences
        .map((s: { trans: string }) => s?.trans ?? "")
        .join("");
      if (!translatedText.trim()) {
        throw new Error("Translation result is empty");
      }
      return translatedText;
    } catch (error) {
      retryCount++;
      logger.error(
        `Google翻訳試行 ${retryCount}/${MAX_RETRIES} 失敗: ${(error as Error).message}`,
      );
      if (retryCount >= MAX_RETRIES) {
        throw error;
      }
      await delay(1000 * Math.pow(2, retryCount));
    }
  }

  throw new Error("Google翻訳に失敗しました。");
}

function cloneTweet(tweet: TweetData): TweetData {
  return {
    ...tweet,
    mediaUrls: [...tweet.mediaUrls],
    quotedTweet: tweet.quotedTweet
      ? {
          ...tweet.quotedTweet,
          mediaUrls: [...tweet.quotedTweet.mediaUrls],
        }
      : null,
  };
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
