import { logger } from "./logger.js";
import { state } from "./state.js";
import { uiManager } from "./ui.js";
import { scrapeTweets } from "./scraper.js";
import { translateTweets } from "./translator.js";
import {
  formatAllTweets,
  formatSingleTweet,
  formatTweetsWithLimit,
  generateSummary,
} from "./formatter.js";
import { executeClipboardCopy } from "./clipboard.js";
import { TWITTER_THREAD_URL_PATTERN } from "@/shared/constants/urls";

class TwitterThreadCopierApp {
  constructor() {
    this.init();
  }

  private init(): void {
    try {
      // ページの種類に関わらず、まずURL監視を開始する
      this.observeUrlChanges();
      this.updateButtonVisibility();
      this.observeUrlChanges();
      logger.log("Application initialized.");
    } catch (error) {
      logger.error(`初期化中にエラーが発生: ${(error as Error).message}`);
    }
  }

  private async handleButtonClick(action: "copy" | "clipboard"): Promise<void> {
    try {
      if (action === "clipboard") {
        if (state.collectedThreadData) {
          await executeClipboardCopy(state.collectedThreadData);
          state.isSecondStage = false;
          state.collectedThreadData = null;
          uiManager.updateMainButtonText();
        }
        return;
      }

      // 'copy' action
      if (state.isCollecting) return;
      state.isCollecting = true;
      uiManager.updateMainButtonText();

      try {
        const tweets = await scrapeTweets();
        let tweetsToProcess = tweets;
        const selectedIds = state.selectedTweetIds ?? [];
        if (selectedIds.length > 0) {
          const tweetMap = new Map(tweets.map((tweet) => [tweet.id, tweet]));
          const selectedTweets: typeof tweets = [];
          for (const id of selectedIds) {
            const found = tweetMap.get(id);
            if (found) {
              selectedTweets.push(found);
            }
          }
          tweetsToProcess = selectedTweets;
          if (tweetsToProcess.length === 0) {
            logger.warn("選択済みツイートを取得できませんでした。");
            state.collectedThreadData = null;
            state.isSecondStage = false;
            uiManager.showToast(
              "選択エラー",
              "選択したツイートが見つかりませんでした。再度読み込みしてください。",
            );
            return;
          }
        } else if (state.startFromTweetId) {
          const startIndex = tweets.findIndex(
            (tweet) => tweet.id === state.startFromTweetId,
          );
          if (startIndex !== -1) tweetsToProcess = tweets.slice(startIndex);
        }

        let formattedText = "";
        let tweetsForFormatting = tweetsToProcess;
        let hasTranslation = false;
        if (tweetsToProcess.length > 0) {
          if (state.translateEnabled) {
            try {
              state.translationInProgress = true;
              uiManager.updateMainButtonText();
              uiManager.showToast("翻訳中", "翻訳処理を実行しています...");
              const translationResult = await translateTweets(tweetsToProcess);
              tweetsForFormatting = translationResult.tweets;
              hasTranslation = translationResult.hasTranslation;
            } catch (translationError) {
              logger.error(`Translation error: ${translationError}`);
              uiManager.showToast("翻訳エラー", "翻訳中にエラーが発生しましたが、原文をコピーできます");
              tweetsForFormatting = tweetsToProcess;
              hasTranslation = false;
            } finally {
              state.translationInProgress = false;
            }
          }

          switch (state.copyMode) {
            case "first":
              formattedText = formatSingleTweet(tweetsForFormatting[0]);
              break;
            case "shitaraba":
              formattedText = formatTweetsWithLimit(tweetsForFormatting, 4096);
              break;
            case "5ch":
              formattedText = formatTweetsWithLimit(tweetsForFormatting, 2048);
              break;
            default:
              formattedText = formatAllTweets(tweetsForFormatting);
              break;
          }
        }

        let summary = generateSummary(
          tweetsToProcess,
          formattedText,
          state.copyMode,
          selectedIds.length === 0 ? state.startFromTweetAuthor : null,
        );

        if (state.translateEnabled && hasTranslation && formattedText.trim().length > 0) {
          summary += " (翻訳済み)";
        }

        state.collectedThreadData = { formattedText, summary };
        state.isSecondStage = true;
        uiManager.showToast("準備完了", `${summary} クリックしてコピーしてください`);
      } catch (error) {
        logger.error(`Error in copy process: ${error}`);
        uiManager.showToast("エラー", "スレッドのコピーに失敗しました");
      } finally {
        state.isCollecting = false;
        state.translationInProgress = false;
        uiManager.updateMainButtonText();
      }
    } catch (error) {
      logger.error(`Button click handler error: ${error}`);
      uiManager.showToast("内部エラー", "処理中に予期せぬエラーが発生しました。");
    }
  }

  private updateButtonVisibility(): void {
    // 現在のURLがツイート詳細ページかどうかを判定
    if (this.isTwitterStatusPage()) {
      // UI（Shadow DOM）がなければ初期化する
      uiManager.init();
      uiManager.addMainButton(this.handleButtonClick.bind(this));
      uiManager.updateAllUI();
    } else {
      uiManager.destroy();
    }
  }

  private isTwitterStatusPage(): boolean {
    return TWITTER_THREAD_URL_PATTERN.test(location.href);
  }

  private observeUrlChanges(): void {
    let lastUrl = location.href;

    const handleUrlChange = (source: string) => {
      // URLが実際に変更された場合のみ処理を実行
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        // 少し遅延させてから実行することで、DOMの更新を待つ
        setTimeout(() => this.updateButtonVisibility(), 300);
        console.log(`URL changed (${source}): ${lastUrl}`);
      }
    };

    // history APIの変更を監視 (pushStateとreplaceStateの両方)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange("pushState");
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange("replaceState");
    };

    window.addEventListener("popstate", () => handleUrlChange("popstate"));

    // DOMの変更を監視して、SPAでのページ遷移を捕捉する
    const observer = new MutationObserver(() => handleUrlChange("mutation"));
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

new TwitterThreadCopierApp();
