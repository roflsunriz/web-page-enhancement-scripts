import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay";

export const cloneDefaultSettings = (): RendererSettings => ({
  ...cloneOverlayDefaults(),
  shadowIntensity: "strong",
  autoSearchEnabled: true,
});


// USERSCRIPT_VERSION_UI_DISPLAYはcomment-overlayのバージョンではなく、d-anime-nico-comment-rendererユーザースクリプトのバージョンです。
// なので変更しないこと！！！ UIにd-anime-nico-comment-rendererのバージョンが表示されるためのものです。
export const USERSCRIPT_VERSION_UI_DISPLAY = "v7.2.1";
