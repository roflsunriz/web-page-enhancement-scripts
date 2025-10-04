import { logger } from "./logger.js";
import type { TweetData, QuotedTweet } from "@/shared/types";

// ツイートとリプライを収集
export async function scrapeTweets(): Promise<TweetData[]> {
  try {
    const tweets: TweetData[] = [];
    const processedIds = new Set<string>();
    let mainAuthorUsername = "";
    let mainAuthorHandle = "";

    // スクロール前の位置を記憶
    const originalScrollPos = window.scrollY;

    // スレッド内のツイートを取得
    function collectVisibleTweets() {
      const tweetElements = document.querySelectorAll<HTMLElement>(
        'article[data-testid="tweet"]',
      );

      // 最初のツイートの著者のユーザー名を取得
      if (tweetElements.length > 0 && !mainAuthorUsername) {
        mainAuthorUsername = getDisplayName(tweetElements[0]);
        mainAuthorHandle = getUsernameHandle(tweetElements[0]);
      }

      tweetElements.forEach((tweetElement) => {
        // ツイートのIDを取得
        const tweetLink = tweetElement.querySelector<HTMLAnchorElement>(
          'a[href*="/status/"]',
        );
        if (!tweetLink) return;

        const hrefParts = tweetLink.href.split("/");
        const statusIndex = hrefParts.indexOf("status");
        if (statusIndex === -1 || statusIndex + 1 >= hrefParts.length) return;

        const tweetId = hrefParts[statusIndex + 1].split("?")[0];
        if (processedIds.has(tweetId)) return;

        // 著者名とハンドルを取得
        const author = getDisplayName(tweetElement);

        // メインの著者でない場合はスキップ
        if (mainAuthorUsername && author !== mainAuthorUsername) return;

        // ハンドルを取得
        let handle = getUsernameHandle(tweetElement);

        // メインユーザーの場合で、ハンドルが取得できない場合は保存したハンドルを使用
        if (author === mainAuthorUsername && !handle && mainAuthorHandle) {
          handle = mainAuthorHandle;
        }

        // ツイート本文
        const tweetTextElement = tweetElement.querySelector<HTMLElement>(
          'div[data-testid="tweetText"]',
        );
        let tweetText = "";

        if (tweetTextElement) {
          // ツイート本文全体を取得
          tweetText = getTweetFullText(tweetTextElement);
        }

        // 日時
        const timeElement = tweetElement.querySelector("time");
        const timestamp = timeElement ? timeElement.getAttribute("datetime") : "";
        const formattedTime = timestamp
          ? formatDateTime(new Date(timestamp))
          : "";

        // ツイート内のメディア（画像）を取得
        const mediaUrls = getMediaUrls(tweetElement);

        // 引用ツイートを取得
        const quotedTweet = getQuotedTweet(tweetElement);

        // ツイート情報を保存
        tweets.push({
          id: tweetId,
          author,
          handle,
          text: tweetText,
          time: formattedTime,
          mediaUrls,
          quotedTweet,
        });

        processedIds.add(tweetId);
      });
    }

    // スクロールしながらツイートを収集
    async function scrollAndCollect() {
      const maxScrollAttempts = 30;
      const scrollDelay = 700; // より確実にロードされるように待機時間を増やす

      try {
        // 最初のスクロール前に一度展開処理
        await expandTruncatedTweets();
        collectVisibleTweets();
        let lastTweetCount = tweets.length;
        let noNewTweetsCount = 0;

        for (let i = 0; i < maxScrollAttempts; i++) {
          try {
            window.scrollBy(0, window.innerHeight * 0.7);

            await new Promise((resolve) => setTimeout(resolve, scrollDelay));

            // スクロール後、表示された「さらに表示」ボタンを展開
            await expandTruncatedTweets();
            collectVisibleTweets();

            if (tweets.length === lastTweetCount) {
              noNewTweetsCount++;
              if (noNewTweetsCount >= 3) {
                break; // 3回連続で新しいツイートが見つからなければ終了
              }
            } else {
              lastTweetCount = tweets.length;
              noNewTweetsCount = 0;
            }
          } catch (scrollError) {
            logger.error(
              `スクロール処理エラー (試行 ${i + 1}): ${
                (scrollError as Error).message
              }`,
            );
            // スクロールエラーが発生しても処理を続行
            continue;
          }
        }

        // 元のスクロール位置に戻る
        try {
          window.scrollTo(0, originalScrollPos);
        } catch (scrollBackError) {
          logger.error(
            `スクロール位置復元エラー: ${(scrollBackError as Error).message}`,
          );
        }
      } catch (error) {
        logger.error(`スクロール収集処理エラー: ${(error as Error).message}`);
        throw error;
      }
    }

    await scrollAndCollect();

    // 収集したツイートを時系列順に並べ替え (古い順)
    tweets.sort((a, b) => {
      const dateA = new Date(
        a.time.replace(/年|月|日/g, "-").replace(/:/g, "-").split(" ")[0],
      );
      const dateB = new Date(
        b.time.replace(/年|月|日/g, "-").replace(/:/g, "-").split(" ")[0],
      );
      return dateA.getTime() - dateB.getTime();
    });

    return tweets;
  } catch (error) {
    logger.error(`ツイート収集中にエラーが発生: ${(error as Error).message}`);
    logger.error(`エラースタック: ${(error as Error).stack}`);
    return [];
  }
}

// --- Helper Functions ---

function getUsernameHandle(tweetElement: HTMLElement): string {
  // ... (Implementation from legacy.ts)
  try {
    const allSpans = Array.from(tweetElement.querySelectorAll("span"));
    const handleSpan = allSpans.find((span) => {
      try {
        const text = span.textContent ? span.textContent.trim() : "";
        return text.startsWith("@") && !text.includes(" ") && text.length > 1;
      } catch {
        return false;
      }
    });
    if (handleSpan) {
      return handleSpan.textContent.trim();
    }
    const userLinks = Array.from(
      tweetElement.querySelectorAll('a[role="link"][href^="/"]'),
    );
    for (const link of userLinks) {
      try {
        const href = link.getAttribute("href");
        if (
          href &&
          !href.includes("/status/") &&
          href.length > 1 &&
          !href.includes("/i/")
        ) {
          return "@" + href.replace(/^\//, "");
        }
      } catch {
        continue;
      }
    }
    const userNameArea = tweetElement.querySelector(
      'div[data-testid="User-Name"]',
    );
    if (userNameArea) {
      const allUserNameSpans = userNameArea.querySelectorAll("span");
      for (const span of Array.from(allUserNameSpans)) {
        try {
          const text = span.textContent ? span.textContent.trim() : "";
          if (text.startsWith("@") && !text.includes(" ")) {
            return text;
          }
        } catch {
          continue;
        }
      }
    }
    return "";
  } catch (error) {
    logger.error(`ユーザーハンドル取得エラー: ${(error as Error).message}`);
    return "";
  }
}

function getDisplayName(tweetElement: HTMLElement): string {
  // ... (Implementation from legacy.ts)
  try {
    const userNameElement = tweetElement.querySelector(
      'div[data-testid="User-Name"] a[role="link"] span',
    );
    return userNameElement && userNameElement.textContent
      ? userNameElement.textContent.trim()
      : "";
  } catch (error) {
    logger.error(`ユーザー名取得エラー: ${(error as Error).message}`);
    return "";
  }
}

function getQuotedTweet(tweetElement: HTMLElement): QuotedTweet | null {
  // ... (Implementation from legacy.ts)
  const quotedTweetElement = tweetElement.querySelector(
    '[data-testid="tweetQuotedLink"]',
  );
  let foundQuotedTweet: QuotedTweet | null = null;
  if (quotedTweetElement) {
    try {
      const quotedTweetContainer =
        quotedTweetElement.closest('div[role="link"]');
      if (quotedTweetContainer) {
        foundQuotedTweet = extractQuotedTweetInfo(
          quotedTweetContainer as HTMLElement,
        );
      }
    } catch (error) {
      logger.error(`引用ツイート取得エラー: ${(error as Error).message}`);
    }
  } else {
    try {
      const tweetText = tweetElement.innerText || "";
      const hasQuoteKeyword =
        tweetText.includes("引用") ||
        tweetText.includes("Quote") ||
        tweetText.includes("quote");
      const linkElements =
        tweetElement.querySelectorAll<HTMLElement>('div[role="link"]');
      if (linkElements.length > 0 && hasQuoteKeyword) {
        for (let i = 0; i < linkElements.length; i++) {
          const element = linkElements[i];
          const elementText = element.innerText || "";
          if (
            elementText.includes("@") &&
            (elementText.includes("年") ||
              elementText.includes("時間") ||
              elementText.includes("分") ||
              elementText.includes("日"))
          ) {
            try {
              const extractedData = extractQuotedTweetInfo(element);
              if (extractedData && extractedData.author && extractedData.text) {
                foundQuotedTweet = extractedData;
                break;
              }
            } catch (error) {
              logger.error(`代替引用ツイート抽出エラー: ${(error as Error).message}`);
            }
          }
        }
      }
    } catch (error) {
      logger.error(`代替引用ツイート検索エラー: ${(error as Error).message}`);
    }
  }
  return foundQuotedTweet;
}

function extractQuotedTweetInfo(
  quotedTweetContainer: HTMLElement,
): QuotedTweet | null {
  // ... (Implementation from legacy.ts)
  const quotedAuthorElement = quotedTweetContainer.querySelector(
    'div[dir="ltr"] > span',
  );
  const quotedAuthor = quotedAuthorElement
    ? quotedAuthorElement.textContent.trim()
    : "";
  const quotedHandleElement = quotedTweetContainer.querySelector(
    'div[dir="ltr"] span:nth-child(2)',
  );
  const quotedHandle = quotedHandleElement
    ? quotedHandleElement.textContent.trim()
    : "";
  let quotedText = "";
  const quotedTextElement = quotedTweetContainer.querySelector(
    'div[data-testid="tweetText"]',
  );
  if (quotedTextElement) {
    quotedText = getTweetFullText(quotedTextElement as HTMLElement);
  } else {
    const textContent = quotedTweetContainer.innerText || "";
    const lines = textContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    let handleIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(quotedHandle)) {
        handleIndex = i;
        break;
      }
    }
    const dateLineIndex = handleIndex + 1;
    if (handleIndex >= 0 && dateLineIndex < lines.length) {
      const contentLines = lines.slice(dateLineIndex + 1);
      quotedText = contentLines.join("\n");
    }
  }
  const quotedMediaUrls: string[] = [];
  const quotedPhotoElements = quotedTweetContainer.querySelectorAll<HTMLElement>(
    '[data-testid="tweetPhoto"]',
  );
  quotedPhotoElements.forEach((photoElement) => {
    const imgElement = photoElement.querySelector<HTMLImageElement>(
      'img[src*="pbs.twimg.com/media"]',
    );
    if (imgElement) {
      const mediaUrl = getHighQualityMediaUrl(imgElement.src);
      if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
        quotedMediaUrls.push(mediaUrl);
      }
    }
  });
  if (quotedMediaUrls.length === 0) {
    const groupElements =
      quotedTweetContainer.querySelectorAll<HTMLElement>('[role="group"]');
    groupElements.forEach((groupElement) => {
      const imgElements = groupElement.querySelectorAll<HTMLImageElement>(
        'img[src*="pbs.twimg.com/media"]',
      );
      imgElements.forEach((imgElement) => {
        const mediaUrl = getHighQualityMediaUrl(imgElement.src);
        if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
          quotedMediaUrls.push(mediaUrl);
        }
      });
    });
    const imgElements = quotedTweetContainer.querySelectorAll<HTMLImageElement>(
      'img[src*="pbs.twimg.com/media"]',
    );
    imgElements.forEach((imgElement) => {
      const mediaUrl = getHighQualityMediaUrl(imgElement.src);
      if (mediaUrl && !quotedMediaUrls.includes(mediaUrl)) {
        quotedMediaUrls.push(mediaUrl);
      }
    });
  }
  let quotedTweetId = "";
  let quotedTweetUrl = "";
  const quotedLinks = quotedTweetContainer.querySelectorAll<HTMLAnchorElement>(
    'a[href*="/status/"]',
  );
  for (const link of Array.from(quotedLinks)) {
    const href = link.href;
    if (href && href.includes("/status/")) {
      const hrefParts = href.split("/");
      const statusIndex = hrefParts.indexOf("status");
      if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
        quotedTweetId = hrefParts[statusIndex + 1].split("?")[0];
        quotedTweetUrl = href;
        break;
      }
    }
  }
  if (quotedAuthor && quotedText) {
    return {
      author: quotedAuthor,
      handle: quotedHandle,
      text: quotedText,
      id: quotedTweetId,
      url: quotedTweetUrl,
      mediaUrls: quotedMediaUrls,
    };
  } else {
    return null;
  }
}

function getMediaUrls(tweetElement: HTMLElement): string[] {
  // ... (Implementation from legacy.ts)
  const mediaUrls: string[] = [];
  const photoElements = tweetElement.querySelectorAll<HTMLElement>(
    '[data-testid="tweetPhoto"]',
  );
  photoElements.forEach((photoElement) => {
    const imgElement = photoElement.querySelector<HTMLImageElement>(
      'img[src*="pbs.twimg.com/media"]',
    );
    if (imgElement) {
      const mediaUrl = getHighQualityMediaUrl(imgElement.src);
      if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
        mediaUrls.push(mediaUrl);
      }
    }
  });
  const videoElements =
    tweetElement.querySelectorAll<HTMLVideoElement>("video");
  videoElements.forEach((videoElement) => {
    if (videoElement.src && videoElement.src.startsWith("blob:")) {
      try {
        if (
          videoElement.poster &&
          videoElement.poster.includes("pbs.twimg.com/tweet_video_thumb")
        ) {
          const mediaUrl = getVideoUrl(videoElement.poster);
          if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
            mediaUrls.push(mediaUrl);
            return;
          }
        }
        const tweetLink = tweetElement.querySelector<HTMLAnchorElement>(
          'a[href*="/status/"]'
        );
        if (tweetLink) {
          const hrefParts = tweetLink.href.split("/");
          const statusIndex = hrefParts.indexOf("status");
          if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
            const tweetId = hrefParts[statusIndex + 1].split("?")[0];
            const tweetInfoUrl = `https://twitter.com/i/status/${tweetId}`;
            if (!mediaUrls.includes(tweetInfoUrl)) {
              mediaUrls.push(`[動画] ${tweetInfoUrl}`);
            }
          }
        }
      } catch (error) {
        logger.error("Error processing blob URL: " + error);
      }
    } else {
      if (
        videoElement.poster &&
        videoElement.poster.includes("pbs.twimg.com/tweet_video_thumb")
      ) {
        const mediaUrl = getVideoUrl(videoElement.poster);
        if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
          mediaUrls.push(mediaUrl);
        }
      }
      if (
        videoElement.src &&
        videoElement.src.includes("video.twimg.com")
      ) {
        if (!mediaUrls.includes(videoElement.src)) {
          mediaUrls.push(videoElement.src);
        }
      }
    }
    const sourceElements = videoElement.querySelectorAll<HTMLSourceElement>(
      "source",
    );
    sourceElements.forEach((sourceElement) => {
      if (
        sourceElement.src &&
        sourceElement.src.includes("video.twimg.com")
      ) {
        if (!mediaUrls.includes(sourceElement.src)) {
          mediaUrls.push(sourceElement.src);
        }
      } else if (sourceElement.src && sourceElement.src.startsWith("blob:")) {
        const tweetLink = tweetElement.querySelector<HTMLAnchorElement>(
          'a[href*="/status/"]',
        );
        if (tweetLink) {
          const hrefParts = tweetLink.href.split("/");
          const statusIndex = hrefParts.indexOf("status");
          if (statusIndex !== -1 && statusIndex + 1 < hrefParts.length) {
            const tweetId = hrefParts[statusIndex + 1].split("?")[0];
            const tweetInfoUrl = `https://twitter.com/i/status/${tweetId}`;
            if (!mediaUrls.includes(tweetInfoUrl)) {
              mediaUrls.push(`[動画] ${tweetInfoUrl}`);
            }
          }
        }
      }
    });
  });
  if (mediaUrls.length === 0) {
    const groupElements =
      tweetElement.querySelectorAll<HTMLElement>('[role="group"]');
    groupElements.forEach((groupElement) => {
      const imgElements = groupElement.querySelectorAll<HTMLImageElement>(
        'img[src*="pbs.twimg.com/media"]',
      );
      imgElements.forEach((imgElement) => {
        const mediaUrl = getHighQualityMediaUrl(imgElement.src);
        if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
          mediaUrls.push(mediaUrl);
        }
      });
    });
  }
  if (mediaUrls.length === 0) {
    const imgElements = tweetElement.querySelectorAll<HTMLImageElement>(
      'img[src*="pbs.twimg.com/media"]',
    );
    imgElements.forEach((imgElement) => {
      const mediaUrl = getHighQualityMediaUrl(imgElement.src);
      if (mediaUrl && !mediaUrls.includes(mediaUrl)) {
        mediaUrls.push(mediaUrl);
      }
    });
  }
  return mediaUrls;
}

function getHighQualityMediaUrl(url: string): string | null {
  // ... (Implementation from legacy.ts)
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes("pbs.twimg.com/media")
  )
    return null;
  try {
    const formatMatch = url.match(/format=([^&]+)/);
    const format = formatMatch ? formatMatch[1] : "jpg";
    const baseUrl = url.split("?")[0];
    if (!baseUrl || baseUrl.length === 0) {
      logger.error(`無効なベースURL: ${url}`);
      return null;
    }
    const cleanUrl = baseUrl + "." + format;
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch (urlError) {
      logger.error(`無効なURL形式: ${cleanUrl}, エラー内容: ${(urlError as Error).message}`);
      return null;
    }
  } catch (error) {
    logger.error(`メディアURL処理エラー: ${(error as Error).message}`);
    return null;
  }
}

function getVideoUrl(posterUrl: string): string | null {
  // ... (Implementation from legacy.ts)
  if (!posterUrl || !posterUrl.includes("tweet_video_thumb")) return null;
  try {
    const match = posterUrl.match(/tweet_video_thumb\/([^.]+)/);
    if (!match || !match[1]) return null;
    const videoId = match[1];
    const videoUrl = `https://video.twimg.com/tweet_video/${videoId}.mp4`;
    return videoUrl;
  } catch (error) {
    logger.error(`動画URL生成エラー: ${(error as Error).message}`);
    return null;
  }
}

function getTweetFullText(tweetTextElement: HTMLElement): string {
  try {
    // 「さらに表示」ボタンがあるか確認
    const showMoreButton = tweetTextElement.querySelector('[role="button"]');
    if (showMoreButton) {
      const buttonText = showMoreButton.textContent?.trim() ?? "";
      if (
        buttonText === "さらに表示" ||
        buttonText === "Show more" ||
        buttonText.match(/もっと見る/i)
      ) {
        // 隠れている要素も含めて全テキストノードを列挙
        const textNodes: string[] = [];
        const walker = document.createTreeWalker(
          tweetTextElement,
          NodeFilter.SHOW_TEXT,
          null,
        );

        let node;
        while ((node = walker.nextNode())) {
          if (
            node.textContent?.trim() &&
            node.parentElement &&
            !node.parentElement.closest('[role="button"]')
          ) {
            textNodes.push(node.textContent);
          }
        }

        // 全テキストノードを連結し、改行を維持
        const fullText = preserveLineBreaks(textNodes, tweetTextElement);
        // 「さらに表示」というテキストが混入している場合は除去
        return fullText.replace(/(さらに表示|Show more|もっと見る)/g, "").trim();
      }
    }

    // 「さらに表示」がない場合は、DOM構造から改行を維持しつつテキストを取得
    return preserveLineBreaks([tweetTextElement.innerText], tweetTextElement);
  } catch (error) {
    logger.error(`ツイートテキスト取得エラー: ${(error as Error).message}`);
    return tweetTextElement.innerText; // フォールバック
  }
}

// テキストの改行を保持する補助関数
function preserveLineBreaks(
  textNodes: string[],
  container: HTMLElement,
): string {
  try {
    const paragraphElements = Array.from(
      container.querySelectorAll('p, div[dir="auto"]'),
    );
    if (paragraphElements.length > 1) {
      return paragraphElements
        .map((el) => el.textContent?.trim() ?? "")
        .filter((text) => !text.match(/(さらに表示|Show more|もっと見る)/i))
        .join("\n");
    }
    return textNodes.join(" ").trim();
  } catch (error) {
    logger.error(`改行保持処理エラー: ${(error as Error).message}`);
    return textNodes.join(" ").trim();
  }
}

async function expandTruncatedTweets(): Promise<number> {
  // ... (Implementation from legacy.ts)
  try {
    const expandButtons = document.querySelectorAll<HTMLElement>(
      '[data-testid="tweet"] [role="button"]',
    );
    let expandedCount = 0;
    for (const button of Array.from(expandButtons)) {
      try {
        const buttonText = button.textContent ? button.textContent.trim() : "";
        if (
          buttonText === "さらに表示" ||
          buttonText === "Show more" ||
          buttonText.match(/もっと見る/i) ||
          buttonText.match(/show more/i)
        ) {
          const isExpandButton =
            !button.hasAttribute("href") &&
            !button.querySelector("a") &&
            button.closest('[data-testid="tweet"]');
          if (isExpandButton && button.click) {
            button.click();
            expandedCount++;
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        logger.error(`個別ツイート展開エラー: ${(error as Error).message}`);
        continue;
      }
    }
    return expandedCount;
  } catch (error) {
    logger.error(`ツイート展開処理エラー: ${(error as Error).message}`);
    return 0;
  }
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}