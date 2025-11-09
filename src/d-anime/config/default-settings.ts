import type { RendererSettings } from "@/shared/types";

type ReadonlySettings = {
  readonly [K in keyof RendererSettings]: RendererSettings[K];
};

export const DEFAULT_RENDERER_SETTINGS: ReadonlySettings = {
  commentColor: "#FFFFFF",
  commentOpacity: 1,
  isCommentVisible: true,
  useContainerResizeObserver: true,
  ngWords: [],
  ngRegexps: [],
  scrollDirection: "rtl",
  renderStyle: "outline-only",
  syncMode: "raf",
  scrollVisibleDurationMs: 4000,
  useFixedLaneCount: false,
  fixedLaneCount: 12,
  useDprScaling: true,
  enableForceRefresh: true,
};

export const cloneDefaultSettings = (): RendererSettings => ({
  ...DEFAULT_RENDERER_SETTINGS,
  ngWords: [...DEFAULT_RENDERER_SETTINGS.ngWords],
  ngRegexps: [...DEFAULT_RENDERER_SETTINGS.ngRegexps],
});

// RENDERER_VERSIONはDanmakuのバージョンではなく、d-anime-nico-comment-rendererのバージョンです。
// この値はUIに表示されるバージョンです。変更したときだけバージョンアップすること。
export const RENDERER_VERSION = "v7.0.1";
