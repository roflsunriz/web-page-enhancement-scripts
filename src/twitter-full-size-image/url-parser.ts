import { TWITTER_IMAGE_PATTERN, FULL_SIZE_NAMES } from "./constants";
import { buildTwimgMediaBaseUrl } from "@/shared/constants/urls";

/**
 * パースされたTwitter画像URLの情報
 */
export interface TwitterImageMatch {
  domain: string;
  mediaId: string;
}

/**
 * URLがTwitterの画像URLかどうかをパースし、情報を返します。
 * @param url - チェックするURL
 * @returns パースされた情報、または一致しない場合はnull
 */
export function parseTwitterImageUrl(url: string): TwitterImageMatch | null {
  const match = url.match(TWITTER_IMAGE_PATTERN);
  if (!match) {
    return null;
  }
  return {
    domain: match[1], // pbs or ton
    mediaId: match[2], // 画像ID部分
  };
}

/**
 * URLが既にフルサイズ画像（orig, 4096x4096など）を指しているか判定します。
 * @param url - チェックするURL
 * @returns フルサイズの場合はtrue
 */
export function isAlreadyFullsize(url: string): boolean {
  const urlParams = new URLSearchParams(new URL(url).search);
  const name = urlParams.get("name");
  return name ? FULL_SIZE_NAMES.includes(name) : false;
}

/**
 * 画像のフォーマット（拡張子）を推測します。
 * @param mediaId - 画像ID
 * @param searchParams - URLの検索パラメータ
 * @returns 推測されたフォーマット（例: 'jpg', 'png'）
 */
function guessImageFormat(
  mediaId: string,
  searchParams: URLSearchParams,
): string {
  const formatParam = searchParams.get("format");
  if (formatParam) {
    return formatParam;
  }
  if (mediaId.includes(".")) {
    const parts = mediaId.split(".");
    const extension = parts[parts.length - 1].split(":")[0];
    return extension;
  }
  return "jpg"; // デフォルト
}

export function buildFullsizeUrl(
  currentUrl: string,
  parsed: TwitterImageMatch,
): string {
  const searchParams = new URLSearchParams(new URL(currentUrl).search);
  const format = guessImageFormat(parsed.mediaId, searchParams);
  const baseMediaId = parsed.mediaId.split(".")[0];

  const mediaBaseUrl = buildTwimgMediaBaseUrl(parsed.domain);
  return `${mediaBaseUrl}/media/${baseMediaId}?format=${format}&name=orig`;
}
