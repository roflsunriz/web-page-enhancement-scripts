const CHATGPT_FAVICON_URL = "https://chat.openai.com/favicon.ico";
const CHATGPT_SOUND_SAMPLE_URL = "https://example.com/sound.mp3";

const NICOVIDEO_BASE_URL = "https://www.nicovideo.jp";
const NICOVIDEO_SEARCH_BASE_URL = `${NICOVIDEO_BASE_URL}/search`;
const NICOVIDEO_WATCH_BASE_URL = `${NICOVIDEO_BASE_URL}/watch`;

const TWITTER_BASE_URL = "https://twitter.com";
const TWITTER_SHORT_BASE_URL = "https://t.co";
const TWITTER_VIDEO_BASE_URL = "https://video.twimg.com";
const TWIMG_MEDIA_HOST_SUFFIX = ".twimg.com";

const YOUTUBE_SHORT_BASE_URL = "https://youtu.be";

export const CHATGPT_URLS = {
  favicon: CHATGPT_FAVICON_URL,
  soundSample: CHATGPT_SOUND_SAMPLE_URL,
} as const;

export const NICOVIDEO_URLS = {
  base: NICOVIDEO_BASE_URL,
  searchBase: NICOVIDEO_SEARCH_BASE_URL,
  watchBase: NICOVIDEO_WATCH_BASE_URL,
} as const;

export const buildNicovideoWatchUrl = (videoId: string): string =>
  `${NICOVIDEO_WATCH_BASE_URL}/${videoId}`;

export const buildNicovideoSearchUrl = (keyword: string): string =>
  `${NICOVIDEO_SEARCH_BASE_URL}/${encodeURIComponent(keyword)}`;

export const TWITTER_URLS = {
  base: TWITTER_BASE_URL,
  shortBase: TWITTER_SHORT_BASE_URL,
  videoBase: TWITTER_VIDEO_BASE_URL,
  mutedKeywords: `${TWITTER_BASE_URL}/settings/muted_keywords`,
} as const;

export const buildTwitterStatusInfoUrl = (tweetId: string): string =>
  `${TWITTER_BASE_URL}/i/status/${tweetId}`;

export const buildTwitterVideoUrl = (videoId: string): string =>
  `${TWITTER_VIDEO_BASE_URL}/tweet_video/${videoId}.mp4`;

export const buildTwimgMediaBaseUrl = (subdomain: string): string =>
  `https://${subdomain}${TWIMG_MEDIA_HOST_SUFFIX}`;

export const TWITTER_THREAD_URL_PATTERN =
  /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/;

export const TWITTER_SHORT_URL_PREFIX = `${TWITTER_SHORT_BASE_URL}/`;

export const YOUTUBE_URLS = {
  shortBase: YOUTUBE_SHORT_BASE_URL,
} as const;

export const buildYoutubeShortUrl = (videoId: string): string =>
  `${YOUTUBE_SHORT_BASE_URL}/${videoId}`;

export const GOOGLE_TRANSLATE_API_URL =
  "https://translate.googleapis.com/translate_a/single";
