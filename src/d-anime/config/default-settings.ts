import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay";

export const cloneDefaultSettings = (): RendererSettings => ({
  ...cloneOverlayDefaults(),
  shadowIntensity: "strong",
  autoSearchEnabled: true,
});

// comment-overlayではなくd-anime-nico-comment-rendererのバージョンをUIへ表示する値です。
// vite.config.tsのd-animeバージョンと常に一致させます。
export const USERSCRIPT_VERSION_UI_DISPLAY = "v7.6.2";
