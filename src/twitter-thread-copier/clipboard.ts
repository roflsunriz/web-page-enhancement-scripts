import { logger } from "./logger";
import { uiManager } from "./ui.js";
import { t } from "./i18n.js";

type ClipboardItemConstructor = new (
  items: Record<string, Blob>,
) => ClipboardItem;

/**
 * テキストをクリップボードにコピーする。
 * 複数の方法を試し、成功するまでフォールバックする。
 * @param threadData - コピーするテキストとサマリーを含むオブジェクト
 * @returns コピーが成功したかどうか
 */
export async function executeClipboardCopy(
  threadData: {
    formattedText: string;
    summary: string;
  } | null,
): Promise<boolean> {
  if (!threadData || !threadData.formattedText) {
    const errorMessage = !threadData ? t("copyNoData") : t("copyNoText");
    logger.error(`クリップボードコピー失敗: ${errorMessage}`);
    uiManager.showToast(t("unknownError"), errorMessage);
    return false;
  }

  if (threadData.formattedText.trim().length === 0) {
    logger.error("クリップボードコピー失敗: formattedTextが空です");
    uiManager.showToast(t("unknownError"), t("copyEmptyText"));
    return false;
  }

  let copySuccess = false;
  let lastError: Error | null = null;

  // 1. ClipboardItem API (推奨)
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const blob = new Blob([threadData.formattedText], { type: "text/plain" });
      const clipboardWindow = window as Window & {
        ClipboardItem: ClipboardItemConstructor;
      };
      const item = new clipboardWindow.ClipboardItem({ "text/plain": blob });
      await navigator.clipboard.write([item]);
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
    uiManager.showToast(t("copied"), threadData.summary);
  } else {
    const errorMsg = lastError ? lastError.message : t("unknownError");
    logger.error(`クリップボードコピー失敗: ${errorMsg}`);
    uiManager.showToast(t("unknownError"), t("copyFailed"));
  }

  return copySuccess;
}
