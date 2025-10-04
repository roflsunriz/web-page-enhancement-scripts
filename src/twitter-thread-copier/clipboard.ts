import { logger } from "./logger";
import { uiManager } from "./ui.js";

/**
 * テキストをクリップボードにコピーする。
 * 複数の方法を試し、成功するまでフォールバックする。
 * @param threadData - コピーするテキストとサマリーを含むオブジェクト
 * @returns コピーが成功したかどうか
 */
export async function executeClipboardCopy(threadData: {
  formattedText: string;
  summary: string;
} | null): Promise<boolean> {
  if (!threadData || !threadData.formattedText) {
    const errorMessage = !threadData
      ? "コピーするデータがありません (threadData is null)"
      : "コピーするテキストがありません (formattedText is null)";
    logger.error(`クリップボードコピー失敗: ${errorMessage}`);
    uiManager.showToast("エラー", errorMessage);
    return false;
  }

  if (threadData.formattedText.trim().length === 0) {
    logger.error("クリップボードコピー失敗: formattedTextが空です");
    uiManager.showToast("エラー", "コピーするテキストが空です");
    return false;
  }

  let copySuccess = false;
  let lastError: Error | null = null;

  // 1. ClipboardItem API (推奨)
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const blob = new Blob([threadData.formattedText], { type: "text/plain" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = new (window as any).ClipboardItem({ "text/plain": blob });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (navigator.clipboard as any).write([item]);
      copySuccess = true;
    } catch (clipboardError) {
      lastError = clipboardError as Error;
      logger.error(`ClipboardItem API失敗: ${lastError.message}`);
    }
  }

  // 2. navigator.clipboard.writeText (フォールバック)
  if (!copySuccess && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(threadData.formattedText);
      copySuccess = true;
    } catch (navigatorError) {
      lastError = navigatorError as Error;
      logger.error(`Navigator clipboard API失敗: ${lastError.message}`);
    }
  }

  // 3. execCommand (最終手段)
  if (!copySuccess) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = threadData.formattedText;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      copySuccess = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (!copySuccess) throw new Error("execCommand returned false");
    } catch (execError) {
      lastError = execError as Error;
      logger.error(`execCommand fallback失敗: ${lastError.message}`);
    }
  }

  if (copySuccess) {
    uiManager.showToast("コピーしました", threadData.summary);
  } else {
    const errorMsg = lastError ? lastError.message : "不明なエラー";
    logger.error(`クリップボードコピー失敗: ${errorMsg}`);
    uiManager.showToast("エラー", "クリップボードへのコピーに失敗しました。");
  }

  return copySuccess;
}