import { logger } from "./logger.js";

const GOOGLE_TRANSLATE_ENDPOINT =
  "https://translate.googleapis.com/translate_a/single";

export async function translateText(text: string): Promise<string> {
  try {
    const placeholders: { [key: string]: string } = {};
    const placeholderMap = new Map<string, string>();
    let placeholderIndex = 0;

    const URL_PATTERN =
      /(https?:\/\/[^\s]+)|(\[動画\]\s+https?:\/\/[^\s]+)|(https:\/\/video\.twimg\.com\/[^\s]+)|(https:\/\/pbs\.twimg\.com\/[^\s]+)/g;
    const USERNAME_PATTERN = /([A-Za-z0-9_]+\s+)?(@[a-zA-Z0-9_]+)/g;
    const DATETIME_PATTERN = /(\d{4}年\d{1,2}月\d{1,2}日\s+\d{1,2}:\d{2})/g;
    const EMOJI_PATTERN =
      /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F0}\u{23F3}\u{25B6}\u{23F8}-\u{23FA}]/gu;

    function createPlaceholder(type: string) {
      const id = placeholderIndex++;
      return `###${type}${id}###`;
    }

    const textWithoutUrls = text.replace(URL_PATTERN, (match) => {
      const placeholder = createPlaceholder("URL");
      placeholders[placeholder] = match;
      placeholderMap.set(placeholder.toLowerCase(), placeholder);
      return placeholder;
    });

    const textWithoutUsernames = textWithoutUrls.replace(
      USERNAME_PATTERN,
      (match) => {
        const placeholder = createPlaceholder("USER");
        placeholders[placeholder] = match;
        placeholderMap.set(placeholder.toLowerCase(), placeholder);
        return placeholder;
      },
    );

    const textWithoutDatetimes = textWithoutUsernames.replace(
      DATETIME_PATTERN,
      (match) => {
        const placeholder = createPlaceholder("TIME");
        placeholders[placeholder] = match;
        placeholderMap.set(placeholder.toLowerCase(), placeholder);
        return placeholder;
      },
    );

    const textWithoutEmojis = textWithoutDatetimes.replace(
      EMOJI_PATTERN,
      (match) => {
        const placeholder = createPlaceholder("EMOJI");
        placeholders[placeholder] = match;
        placeholderMap.set(placeholder.toLowerCase(), placeholder);
        return placeholder;
      },
    );

    const MAX_CHUNK_SIZE = 800;
    const chunks: string[] = [];
    const paragraphs = textWithoutEmojis.split("\n");
    let currentChunk = "";

    for (const paragraph of paragraphs) {
      if (
        currentChunk.length + paragraph.length + 1 > MAX_CHUNK_SIZE &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n${paragraph}` : paragraph;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    const translatedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk || chunk.trim().length === 0) {
        translatedChunks.push("");
        continue;
      }

      const sourceLang = "auto";
      const targetLang = "ja";
      let translatedText = "";
      let retryCount = 0;
      const MAX_RETRIES = 3;

      while (retryCount < MAX_RETRIES) {
        try {
          const url = `${GOOGLE_TRANSLATE_ENDPOINT}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
            chunk,
          )}`;

          const response = await new Promise<GM.Response<unknown>>(
            (resolve, reject) => {
              GM_xmlhttpRequest({
                method: "GET",
                url: url,
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

          translatedText = data.sentences
            .map((s: { trans: string }) => s?.trans || "")
            .join("");
          if (!translatedText.trim()) {
            throw new Error("Translation result is empty");
          }

          translatedChunks.push(translatedText);
          break;
        } catch (error) {
          retryCount++;
          logger.error(
            `翻訳試行 ${retryCount}/${MAX_RETRIES} 失敗: ${
              (error as Error).message
            }`,
          );
          if (retryCount >= MAX_RETRIES) {
            logger.error(`翻訳失敗後、元のテキストを使用します。`);
            translatedChunks.push(chunk);
            break;
          }
          await new Promise((res) =>
            setTimeout(res, 1000 * Math.pow(2, retryCount)),
          );
        }
      }
      if (i < chunks.length - 1) {
        await new Promise((res) =>
          setTimeout(res, 1500 + Math.random() * 1000),
        );
      }
    }

    const translatedResult = translatedChunks.join("\n");
    return restorePlaceholders(translatedResult, placeholders, placeholderMap);
  } catch (error) {
    logger.error("Translation error: " + error);
    throw error;
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function restorePlaceholders(
  translatedText: string,
  placeholders: { [key: string]: string },
  placeholderMap: Map<string, string>,
): string {
  let result = translatedText;

  // 1. Direct match
  Object.keys(placeholders).forEach((originalPlaceholder) => {
    result = result.replace(
      new RegExp(escapeRegExp(originalPlaceholder), "g"),
      placeholders[originalPlaceholder],
    );
  });

  // 2. Fuzzy match for modified placeholders
  const remaining = findRemainingPlaceholders(result);
  for (const found of remaining) {
    const condensed = found.replace(/\s+/g, "").toLowerCase();
    let originalPlaceholder = placeholderMap.get(condensed);

    if (!originalPlaceholder) {
      const idMatch = condensed.match(/(\d+)/);
      if (idMatch) {
        const idStr = idMatch[1];
        for (const [key, value] of placeholderMap.entries()) {
          if (key.includes(idStr)) {
            originalPlaceholder = value;
            break;
          }
        }
      }
    }

    if (originalPlaceholder && placeholders[originalPlaceholder]) {
      result = result.replace(
        new RegExp(escapeRegExp(found), "g"),
        placeholders[originalPlaceholder],
      );
    } else {
      logger.error(`プレースホルダーの復元に失敗: ${found}`);
    }
  }

  return result;
}

function findRemainingPlaceholders(text: string): string[] {
  const matches = text.match(/###\s*[A-Za-z]*\s*\d+\s*###/g) || [];
  return [...new Set(matches)];
}