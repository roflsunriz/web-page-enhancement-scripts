import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay/dist/comment-overlay.es";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay/dist/comment-overlay.es";

export const cloneDefaultSettings = (): RendererSettings =>
  cloneOverlayDefaults();


// RENDERER_VERSIONはcomment-overlayのバージョンではなく、d-anime-nico-comment-rendererユーザースクリプトのバージョンです。
// なので変更しないこと！！！ UIにd-anime-nico-comment-rendererのバージョンが表示されるためのものです。
export const RENDERER_VERSION = "v6.7.0";
