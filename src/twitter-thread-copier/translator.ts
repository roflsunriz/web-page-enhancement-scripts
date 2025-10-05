import { logger } from "./logger.js";

const LOCAL_AI_ENDPOINT = "http://localhost:3002/v1/chat/completions";
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

    const MAX_CHUNK_SIZE = 5000;
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

    // --- OpenAI互換APIによる翻訳 ---
    async function translateWithLocalAI(chunk: string): Promise<string | null> {
      try {
        const prompt = `<|plamo:op|>dataset
translation
<|plamo:op|>input lang=auto
${chunk}
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
                messages: [{ role: "user", content: prompt }],
                temperature: 0,
                max_tokens: 4096,
                stream: false,
              }),
              timeout: 30000, // 30秒に延長
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
          return translated;
        }
        throw new Error("ローカルAIからの翻訳結果が空です。");
      } catch (error) {
        logger.error(
          `ローカルAIでの翻訳に失敗: ${(error as Error).message}`,
        );
        return null;
      }
    }

    // --- Google翻訳によるフォールバック ---
    async function translateWithGoogle(chunk: string): Promise<string> {
      const sourceLang = "auto";
      const targetLang = "ja";
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
          const translatedText = data.sentences
            .map((s: { trans: string }) => s?.trans || "")
            .join("");
          if (!translatedText.trim()) throw new Error("Translation result is empty");
          return translatedText;
        } catch (error) {
          retryCount++;
          logger.error(`Google翻訳試行 ${retryCount}/${MAX_RETRIES} 失敗: ${(error as Error).message}`);
          if (retryCount >= MAX_RETRIES) throw error;
          await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, retryCount)));
        }
      }
      throw new Error("Google翻訳に失敗しました。");
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk || chunk.trim().length === 0) {
        translatedChunks.push("");
        continue;
      }

      // 1. ローカルAIで試行
      let translatedText = await translateWithLocalAI(chunk);

      // 2. 失敗したらGoogle翻訳にフォールバック
      if (!translatedText) {
        logger.log("ローカルAIでの翻訳に失敗したため、Google翻訳にフォールバックします。");
        try {
          translatedText = await translateWithGoogle(chunk);
        } catch (googleError) {
          logger.error(`Google翻訳にも失敗しました: ${(googleError as Error).message}`);
          logger.error("翻訳失敗後、元のテキストを使用します。");
          translatedText = chunk; // 最終フォールバック
        }
      }
      translatedChunks.push(translatedText);

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