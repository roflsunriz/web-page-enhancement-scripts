import { logger } from "./logger.js";
import { state } from "./state.js";
import { uiManager } from "./ui.js";
import { scrapeTweets } from "./scraper.js";
import { translateTweets } from "./translator.js";
import {
  formatAllTweets,
  formatSingleTweet,
  formatTweetsWithLimit,
  formatShitarabaTweetsWithLimit,
  generateSummary,
} from "./formatter.js";
import { executeClipboardCopy } from "./clipboard.js";
import { TWITTER_THREAD_URL_PATTERN } from "@/shared/constants/urls";
import { format, t } from "./i18n.js";

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
              t("selectionErrorTitle"),
              t("selectionErrorContent"),
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
              uiManager.showToast(
                t("translationToastTitle"),
                t("translationToastContent"),
              );
              const translationResult = await translateTweets(tweetsToProcess);
              tweetsForFormatting = translationResult.tweets;
              hasTranslation = translationResult.hasTranslation;
            } catch (translationError) {
              logger.error(`Translation error: ${translationError}`);
              uiManager.showToast(
                t("translationErrorTitle"),
                t("translationErrorContent"),
              );
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
              formattedText = formatShitarabaTweetsWithLimit(
                tweetsForFormatting,
                4096,
              );
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

        if (
          state.translateEnabled &&
          hasTranslation &&
          formattedText.trim().length > 0
        ) {
          summary += t("translatedSuffix");
        }

        state.collectedThreadData = { formattedText, summary };
        state.isSecondStage = true;
        uiManager.showToast(
          t("readyTitle"),
          format("readyContent", { summary }),
        );
      } catch (error) {
        logger.error(`Error in copy process: ${error}`);
        uiManager.showToast(t("unknownError"), t("threadCopyFailed"));
      } finally {
        state.isCollecting = false;
        state.translationInProgress = false;
        uiManager.updateMainButtonText();
      }
    } catch (error) {
      logger.error(`Button click handler error: ${error}`);
      uiManager.showToast(
        t("internalErrorTitle"),
        t("internalErrorContent"),
      );
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

    const handleUrlChange = () => {
      // URLが実際に変更された場合のみ処理を実行
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        // 少し遅延させてから実行することで、DOMの更新を待つ
        setTimeout(() => this.updateButtonVisibility(), 300);
      }
    };

    // history APIの変更を監視 (pushStateとreplaceStateの両方)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };

    window.addEventListener("popstate", () => handleUrlChange());

    // DOMの変更を監視して、SPAでのページ遷移を捕捉する
    const observer = new MutationObserver(() => handleUrlChange());
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

new TwitterThreadCopierApp();
