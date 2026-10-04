import { GM_setClipboard } from "vite-plugin-monkey/dist/client";

export async function copyUrl(url: string): Promise<void> {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(url);
    return;
  } catch {
    // Managers can copy when the browser Clipboard API is unavailable/denied.
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(new Error("Clipboard confirmation timed out")),
        2000,
      );
      try {
        if (typeof GM_setClipboard !== "function")
          throw new Error("Clipboard manager unavailable");
        GM_setClipboard(url, "text", () => {
          window.clearTimeout(timer);
          resolve();
        });
      } catch (error) {
        window.clearTimeout(timer);
        reject(error);
      }
    });
  }
}
