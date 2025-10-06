export interface QuotedTweet {
  author: string;
  handle: string;
  text: string;
  id: string;
  url: string;
  mediaUrls: string[];
}

export interface TweetData {
  id: string;
  author: string;
  handle: string;
  text: string;
  time: string;
  url?: string;
  mediaUrls: string[];
  quotedTweet: QuotedTweet | null;
}

export type ThreadCopyPayload = {
  formattedText: string;
  tweets: TweetData[];
};

export type TranslationRequest = {
  sourceText: string;
  sourceLang?: string;
  targetLang: string;
};

export type CopyMode = "all" | "first" | "shitaraba" | "5ch";


