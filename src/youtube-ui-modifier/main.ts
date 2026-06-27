import { YoutubeUiModifierApp } from "./app";

if (window.top === window.self) {
  new YoutubeUiModifierApp().initialize().catch((error: unknown) => {
    console.error("[YouTube UI Modifier] initialization failed", error);
  });
}
