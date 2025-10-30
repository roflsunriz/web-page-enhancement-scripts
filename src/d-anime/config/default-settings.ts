import type { RendererSettings } from "@/shared/types";

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, unknown>
    ? DeepReadonly<T[K]>
    : T[K];
};

const baseSettings: RendererSettings = {
  commentColor: "#FFFFFF",
  commentOpacity: 0.75,
  isCommentVisible: true,
  // FirefoxでのResizeObserverの挙動を安定させるためのフラグ
  // true: コンテナを監視 (推奨)
  // false: video要素を監視 (旧挙動、デバッグ用)
  useContainerResizeObserver: true,
  ngWords: [],
  ngRegexps: [],
};

export const DEFAULT_RENDERER_SETTINGS: DeepReadonly<RendererSettings> =
  baseSettings;

export const cloneDefaultSettings = (): RendererSettings => ({
  ...DEFAULT_RENDERER_SETTINGS,
  ngWords: [...DEFAULT_RENDERER_SETTINGS.ngWords],
  ngRegexps: [...DEFAULT_RENDERER_SETTINGS.ngRegexps],
});

export const RENDERER_VERSION = "v6.1.5";
