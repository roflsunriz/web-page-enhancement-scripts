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

// RENDERER_VERSION��Danmaku�̃o�[�W�����ł͂Ȃ��Ad-anime-nico-comment-renderer���[�U�[�X�N���v�g�̃o�[�W�����ł��B
// �Ȃ̂ŕύX���Ȃ����ƁI�I�I UI��d-anime-nico-comment-renderer�̃o�[�W�������\������邽�߂̂��̂ł��B
export const RENDERER_VERSION = "v7.0.0";
