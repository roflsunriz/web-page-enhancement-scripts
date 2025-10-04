import type { Logger } from "@/shared/logger";
import type { ThreadCopyPayload } from "@/shared/types";

export class ClipboardService {
  constructor(private readonly logger: Logger) {}

  async copy(payload: ThreadCopyPayload): Promise<boolean> {
    if (!payload?.formattedText) {
      this.logger.error("clipboard copy failed: invalid payload");
      return false;
    }

    let copied = false;
    let lastError: unknown = null;

    if (navigator.clipboard && typeof window.ClipboardItem !== "undefined") {
      try {
        const type = "text/plain";
        const blob = new Blob([payload.formattedText], { type });
        const item = new ClipboardItem({ [type]: blob });
        await navigator.clipboard.write([item]);
        copied = true;
      } catch (error) {
        lastError = error;
        this.logger.warn("ClipboardItem API failed", error);
      }
    }

    if (!copied && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(payload.formattedText);
        copied = true;
      } catch (error) {
        lastError = error;
        this.logger.warn("navigator.clipboard.writeText failed", error);
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = payload.formattedText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (error) {
        lastError = error;
        this.logger.error("execCommand fallback failed", error);
        copied = false;
      }
    }

    if (!copied && lastError) {
      this.logger.error("clipboard copy failed", lastError);
    }

    return copied;
  }
}
