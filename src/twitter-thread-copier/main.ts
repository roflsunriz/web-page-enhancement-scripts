import { logger } from "./logger.js";
import { state } from "./state.js";
import { uiManager } from "./ui.js";
import { scrapeTweets } from "./scraper.js";
import { translateText } from "./translator.js";
import {
  formatAllTweets,
  formatSingleTweet,
  formatTweetsWithLimit,
  generateSummary,
} from "./formatter.js";
import { executeClipboardCopy } from "./clipboard.js";

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
        if (state.startFromTweetId) {
          const startIndex = tweets.findIndex(
            (tweet) => tweet.id === state.startFromTweetId,
          );
          if (startIndex !== -1) tweetsToProcess = tweets.slice(startIndex);
        }

        let formattedText = "";
        if (tweetsToProcess.length > 0) {
          switch (state.copyMode) {
            case "first":
              formattedText = formatSingleTweet(tweetsToProcess[0]);
              break;
            case "shitaraba":
              formattedText = formatTweetsWithLimit(tweetsToProcess, 4096);
              break;
            case "5ch":
              formattedText = formatTweetsWithLimit(tweetsToProcess, 2048);
              break;
            default:
              formattedText = formatAllTweets(tweetsToProcess);
              break;
          }
        }

        let summary = generateSummary(
          tweetsToProcess,
          formattedText,
          state.copyMode,
          state.startFromTweetAuthor,
        );

        if (state.translateEnabled && formattedText.trim().length > 0) {
          state.translationInProgress = true;
          uiManager.updateMainButtonText();
          try {
            uiManager.showToast("翻訳中", "翻訳処理を実行しています...");
            const translatedText = await translateText(formattedText);
            if (translatedText && translatedText.trim().length > 0) {
              formattedText = translatedText;
              summary += " (翻訳済み)";
            } else {
              uiManager.showToast("翻訳警告", "翻訳結果が空のため、原文を使用します");
            }
          } catch (translationError) {
            logger.error(`Translation error: ${translationError}`);
            uiManager.showToast("翻訳エラー", "翻訳中にエラーが発生しましたが、原文をコピーできます");
          } finally {
            state.translationInProgress = false;
          }
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
    return /https?:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/[0-9]+/.test(location.href);
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
