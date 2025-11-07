import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay";

export const cloneDefaultSettings = (): RendererSettings => ({
  ...cloneOverlayDefaults(),
  enableForceRefresh: true,
});


// RENDERER_VERSIONはcomment-overlayのバージョンではなく、d-anime-nico-comment-rendererユーザースクリプトのバージョンです。
// なので変更しないこと！！！ UIにd-anime-nico-comment-rendererのバージョンが表示されるためのものです。
export const RENDERER_VERSION = "v6.11.1";
