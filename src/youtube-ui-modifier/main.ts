import { YoutubeUiModifierApp } from "./app";

async function initialize(): Promise<void> {
  try {
    await new YoutubeUiModifierApp().initialize();
  } catch (error: unknown) {
    console.error("[YouTube UI Modifier] initialization failed", error);
  }
}

if (window.top === window.self) {
  // document-start では head/documentElement も存在しないことがある。
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void initialize(), {
      once: true,
    });
  } else {
    void initialize();
  }
}
