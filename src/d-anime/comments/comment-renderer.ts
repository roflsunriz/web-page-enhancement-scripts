import type {
  Comment,
  CommentRendererConfig,
  CommentRendererInitializeOptions,
} from "comment-overlay";
import { CommentRenderer as OverlayCommentRenderer } from "comment-overlay";
import type { RendererSettings } from "@/shared/types";
import { KeyboardShortcutHandler } from "@/d-anime/input/keyboard-shortcut-handler";
import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnime:CommentRenderer");

const withDefaultNamespace = (
  config?: CommentRendererConfig | null,
): CommentRendererConfig => ({
  loggerNamespace: "dAnime:CommentRenderer",
  ...(config ?? {}),
});

const isRendererSettings = (value: unknown): value is RendererSettings => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<RendererSettings>;
  return (
    typeof candidate.commentColor === "string" &&
    typeof candidate.commentOpacity === "number" &&
    typeof candidate.isCommentVisible === "boolean"
  );
};

type WindowWithSettingsManager = typeof window & {
  dAniRenderer?: {
    settingsManager?: {
      updateSettings: (settings: RendererSettings) => void;
    };
  };
};

export class CommentRenderer {
  private readonly renderer: OverlayCommentRenderer;
  private keyboardHandler: KeyboardShortcutHandler | null = null;

  constructor(settings: RendererSettings | null, config?: CommentRendererConfig);
  constructor(config?: CommentRendererConfig);
  constructor(
    settingsOrConfig?:
      | RendererSettings
      | CommentRendererConfig
      | null
      | undefined,
    maybeConfig?: CommentRendererConfig,
  ) {
    if (isRendererSettings(settingsOrConfig) || settingsOrConfig === null) {
      this.renderer = new OverlayCommentRenderer(
        settingsOrConfig ?? null,
        withDefaultNamespace(maybeConfig),
      );
    } else {
      this.renderer = new OverlayCommentRenderer(
        withDefaultNamespace(settingsOrConfig),
      );
    }
  }

  get settings(): RendererSettings {
    return this.renderer.settings;
  }

  set settings(value: RendererSettings) {
    this.renderer.settings = value;
  }

  initialize(options: HTMLVideoElement | CommentRendererInitializeOptions): void {
    this.renderer.initialize(options);
    this.setupKeyboardShortcuts();
  }

  addComment(
    text: string,
    vposMs: number,
    commands: string[] = [],
  ): Comment | null {
    return this.renderer.addComment(text, vposMs, commands);
  }

  clearComments(): void {
    this.renderer.clearComments();
  }

  resetState(): void {
    this.renderer.resetState();
  }

  destroy(): void {
    this.teardownKeyboardShortcuts();
    this.renderer.destroy();
  }

  updateSettings(newSettings: RendererSettings): void {
    this.renderer.settings = newSettings;
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.renderer.getVideoElement();
  }

  getCurrentVideoSource(): string | null {
    return this.renderer.getCurrentVideoSource();
  }

  getCommentsSnapshot(): Comment[] {
    return this.renderer.getCommentsSnapshot();
  }

  isNGComment(text: string): boolean {
    return this.renderer.isNGComment(text);
  }

  resize(width?: number, height?: number): void {
    this.renderer.resize(width, height);
  }

  private setupKeyboardShortcuts(): void {
    this.teardownKeyboardShortcuts();
    const handler = new KeyboardShortcutHandler();
    handler.addShortcut("C", "Shift", () => {
      try {
        const currentSettings = this.renderer.settings;
        const nextSettings: RendererSettings = {
          ...currentSettings,
          isCommentVisible: !currentSettings.isCommentVisible,
        };
        this.renderer.settings = nextSettings;
        this.syncGlobalSettings(nextSettings);

        // コメント非表示時にキャンバスをクリアして画面上のコメントを消す
        // comment-overlayライブラリはisCommentVisible=falseの時processFrameが
        // 早期リターンしてdraw()を呼ばないため、手動でクリアが必要
        if (!nextSettings.isCommentVisible) {
          this.clearCanvas();
        }
      } catch (error) {
        logger.error("CommentRenderer.keyboardShortcut", error as Error);
      }
    });
    handler.startListening();
    this.keyboardHandler = handler;
  }

  private clearCanvas(): void {
    const canvas = this.renderer.canvas;
    const ctx = this.renderer.ctx;
    if (!canvas || !ctx) {
      return;
    }
    // DPRスケーリングが適用されている可能性があるため、論理サイズを使用
    const displayWidth = this.renderer.displayWidth;
    const displayHeight = this.renderer.displayHeight;
    const width = displayWidth > 0 ? displayWidth : canvas.width;
    const height = displayHeight > 0 ? displayHeight : canvas.height;
    ctx.clearRect(0, 0, width, height);
  }

  private teardownKeyboardShortcuts(): void {
    this.keyboardHandler?.stopListening();
    this.keyboardHandler = null;
  }

  private syncGlobalSettings(settings: RendererSettings): void {
    const globalSettingsManager =
      (window as WindowWithSettingsManager).dAniRenderer?.settingsManager;
    globalSettingsManager?.updateSettings(settings);
  }
}
