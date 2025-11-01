import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay/dist/comment-overlay.es";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay/dist/comment-overlay.es";

export const cloneDefaultSettings = (): RendererSettings =>
  cloneOverlayDefaults();

export const RENDERER_VERSION = "v6.5.0";
