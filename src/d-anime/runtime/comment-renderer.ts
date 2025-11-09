import Danmaku from "danmaku";
import { cloneDefaultSettings } from "../config/default-settings";
import type {
  DanmakuCommentStyle,
  RendererSettings,
} from "@/shared/types";
import { KeyboardShortcutHandler } from "./input/keyboard-shortcut-handler";
import { createLogger, type Logger } from "@/shared/logger";
import { Comment } from "./comment";

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  red: "#FF0000",
  pink: "#FF8080",
  orange: "#FF9900",
  yellow: "#FFFF00",
  green: "#00FF00",
  cyan: "#00FFFF",
  blue: "#0000FF",
  purple: "#C000FF",
  black: "#000000",
  white2: "#CC9",
  red2: "#C03",
  pink2: "#F3C",
  orange2: "#F60",
  yellow2: "#990",
  green2: "#0C6",
  cyan2: "#0CC",
  blue2: "#39F",
  purple2: "#63C",
  black2: "#666",
};

const FONT_FAMILY_MAP: Record<string, string> = {
  defont:
    '"MS PGothic","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic","Meiryo","Segoe UI","Osaka","Noto Sans JP","Source Han Sans JP","sans-serif"',
  gothic:
    '"Noto Sans JP","Noto Sans CJK JP","Yu Gothic","Yu Gothic Medium","Meiryo","MS PGothic","Segoe UI","Helvetica","Arial","sans-serif"',
  mincho:
    '"MS PMincho","MS Mincho","Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Source Han Serif JP","Times New Roman","serif"',
};

const SIZE_SCALE_MAP: Record<string, number> = {
  small: 0.8,
  medium: 1,
  big: 1.4,
};

const HEX_COLOR_PATTERN =
  /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const DEFAULT_FONT_FAMILY = FONT_FAMILY_MAP.defont;
const DEFAULT_TEXT_SHADOW =
  "0 0 3px rgba(0, 0, 0, 0.85), 0 0 6px rgba(0, 0, 0, 0.65)";
const MIN_FONT_SIZE = 16;
const DEFAULT_LINE_HEIGHT = 1.2;

export interface CommentRendererConfig {
  loggerNamespace?: string;
}

export interface CommentRendererInitializeOptions {
  video: HTMLVideoElement;
}

interface CommentRecord {
  id: number;
  comment: Comment;
}

interface NormalizedCommand {
  raw: string;
  lower: string;
}

const normalizeCommands = (commands: string[]): NormalizedCommand[] =>
  commands
    .map((command) => command.trim())
    .filter((command) => command.length > 0)
    .map((command) => ({
      raw: command,
      lower: command.toLowerCase(),
    }));

const isRendererSettings = (value: unknown): value is RendererSettings => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<RendererSettings>;
  return (
    typeof candidate.commentColor === "string" &&
    typeof candidate.commentOpacity === "number" &&
    typeof candidate.isCommentVisible === "boolean" &&
    Array.isArray(candidate.ngWords) &&
    Array.isArray(candidate.ngRegexps)
  );
};

const isInitializeOptions = (
  value: unknown,
): value is CommentRendererInitializeOptions =>
  !!value &&
  typeof value === "object" &&
  "video" in value &&
  (value as CommentRendererInitializeOptions).video instanceof
    HTMLVideoElement;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toOpacityString = (value: number): string =>
  clamp(value, 0, 1).toFixed(2);

export class CommentRenderer {
  private danmaku: Danmaku | null = null;
  private hostElement: HTMLDivElement | null = null;
  private containerElement: HTMLDivElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private keyboardHandler: KeyboardShortcutHandler | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private settingsValue: RendererSettings;
  private ngRegexps: RegExp[] = [];
  private comments: CommentRecord[] = [];
  private commentCounter = 0;
  private currentVideoSource: string | null = null;
  private readonly logger: Logger;
  private readonly handleWindowResize = (): void => {
    this.syncHostLayout();
  };

  constructor(settings: RendererSettings | null, config?: CommentRendererConfig);
  constructor(config?: CommentRendererConfig);
  constructor(
    settingsOrConfig?: RendererSettings | CommentRendererConfig | null,
    maybeConfig?: CommentRendererConfig,
  ) {
    let selectedConfig: CommentRendererConfig = {};
    if (isRendererSettings(settingsOrConfig) || settingsOrConfig === null) {
      this.settingsValue = settingsOrConfig
        ? this.cloneSettings(settingsOrConfig)
        : cloneDefaultSettings();
      selectedConfig = maybeConfig ?? {};
    } else {
      this.settingsValue = cloneDefaultSettings();
      selectedConfig = settingsOrConfig ?? {};
    }
    this.logger = createLogger(
      selectedConfig.loggerNamespace ?? "dAnime:CommentRenderer",
    );
    this.cacheNgRegexps();
  }

  get settings(): RendererSettings {
    return this.cloneSettings(this.settingsValue);
  }

  set settings(value: RendererSettings) {
    this.updateSettings(value);
  }

  initialize(options: HTMLVideoElement | CommentRendererInitializeOptions): void {
    const video = this.resolveVideoElement(options);
    this.destroyDanmaku();
    this.createRenderer(video);
    this.setupKeyboardShortcuts();
  }

  addComment(
    text: string,
    vposMs: number,
    commands: string[] = [],
  ): Comment | null {
    if (!text) {
      return null;
    }
    const normalizedCommands = [...commands];
    const comment = new Comment({ text, vposMs, commands: normalizedCommands });
    const record: CommentRecord = {
      id: ++this.commentCounter,
      comment,
    };
    this.comments.push(record);
    this.emitDanmaku(comment);
    return comment;
  }

  clearComments(): void {
    this.comments = [];
    this.commentCounter = 0;
    this.danmaku?.clear();
  }

  resetState(): void {
    this.replayAllComments();
  }

  /**
   * ゴーストコメントのゴーストコメント状態を完全に初期化
   */
  hardReset(): void {
    if (!this.videoElement) {
      return;
    }
    const preserved = this.comments.map<CommentRecord>((record) => ({
      id: record.id,
      comment: new Comment({
        text: record.comment.text,
        vposMs: record.comment.vposMs,
        commands: [...record.comment.commands],
      }),
    }));
    this.comments = preserved;
    this.destroyDanmaku();
    this.createRenderer(this.videoElement);
  }

  destroy(): void {
    this.teardownKeyboardShortcuts();
    this.destroyDanmaku();
    this.videoElement = null;
    this.currentVideoSource = null;
  }

  updateSettings(newSettings: RendererSettings): void {
    this.settingsValue = this.cloneSettings(newSettings);
    this.cacheNgRegexps();
    this.applyVisibility();
    this.replayAllComments();
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  getCurrentVideoSource(): string | null {
    return this.currentVideoSource;
  }

  getCommentsSnapshot(): Comment[] {
    return this.comments.map(
      (record) =>
        new Comment({
          text: record.comment.text,
          vposMs: record.comment.vposMs,
          commands: [...record.comment.commands],
        }),
    );
  }

  isNGComment(text: string): boolean {
    const normalized = text.toLowerCase();
    if (!normalized) {
      return false;
    }
    if (
      this.settingsValue.ngWords.some((word) =>
        normalized.includes(word.toLowerCase()),
      )
    ) {
      return true;
    }
    return this.ngRegexps.some((regex) => regex.test(text));
  }

  resize(width?: number, height?: number): void {
    if (this.hostElement) {
      if (typeof width === "number" && typeof height === "number") {
        this.hostElement.style.width = `${width}px`;
        this.hostElement.style.height = `${height}px`;
      } else {
        this.syncHostLayout();
      }
    }
    this.danmaku?.resize();
  }

  private resolveVideoElement(
    target: HTMLVideoElement | CommentRendererInitializeOptions,
  ): HTMLVideoElement {
    if (target instanceof HTMLVideoElement) {
      return target;
    }
    if (isInitializeOptions(target)) {
      return target.video;
    }
    throw new Error("A valid HTMLVideoElement is required");
  }

  private createRenderer(video: HTMLVideoElement): void {
    this.videoElement = video;
    this.currentVideoSource = this.getVideoSource(video);

    const host = this.createOverlayHost(video);
    const container = document.createElement("div");
    container.className = "danime-danmaku-container";
    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    container.style.willChange = "transform";
    host.appendChild(container);

    this.hostElement = host;
    this.containerElement = container;

    this.danmaku = new Danmaku({
      container,
      media: video,
      comments: [],
      speed: 230,
      engine: "dom",
    });

    this.applyVisibility();
    this.setupResizeObserver(video);
    this.emitExistingComments();
  }

  private createOverlayHost(video: HTMLVideoElement): HTMLDivElement {
    const parent = video.parentElement;
    if (!parent) {
      throw new Error("Video element must have a parent node");
    }
    const computed = window.getComputedStyle(parent);
    if (computed.position === "static") {
      parent.style.position = "relative";
    }
    const host = document.createElement("div");
    host.className = "danime-danmaku-host";
    host.style.position = "absolute";
    host.style.pointerEvents = "none";
    host.style.zIndex = "2147482000";
    host.style.display = "block";
    host.style.transformOrigin = "top left";
    parent.appendChild(host);
    this.syncHostLayout(host, video);
    return host;
  }

  private setupResizeObserver(video: HTMLVideoElement): void {
    this.teardownResizeObserver();

    if (
      this.settingsValue.useContainerResizeObserver &&
      typeof ResizeObserver !== "undefined"
    ) {
      this.resizeObserver = new ResizeObserver(() => {
        this.syncHostLayout();
      });
      this.resizeObserver.observe(video);
    } else {
      this.resizeObserver = null;
    }

    window.addEventListener("resize", this.handleWindowResize);
    this.syncHostLayout();
  }

  private teardownResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("resize", this.handleWindowResize);
  }

  private syncHostLayout(): void;
  private syncHostLayout(host: HTMLDivElement, video: HTMLVideoElement): void;
  private syncHostLayout(
    hostOverride?: HTMLDivElement,
    videoOverride?: HTMLVideoElement,
  ): void {
    const host = hostOverride ?? this.hostElement;
    const video = videoOverride ?? this.videoElement;
    if (!host || !video) {
      return;
    }
    const { offsetTop, offsetLeft, clientWidth, clientHeight } = video;
    host.style.top = `${offsetTop}px`;
    host.style.left = `${offsetLeft}px`;
    host.style.width = `${clientWidth}px`;
    host.style.height = `${clientHeight}px`;
  }

  private emitExistingComments(): void {
    if (!this.danmaku) {
      return;
    }
    for (const record of this.comments) {
      this.emitDanmaku(record.comment);
    }
  }

  private replayAllComments(): void {
    if (!this.danmaku) {
      return;
    }
    this.danmaku.clear();
    this.emitExistingComments();
  }

  private emitDanmaku(comment: Comment): void {
    if (!this.danmaku) {
      return;
    }
    const payload = this.buildDanmakuPayload(comment);
    if (!payload) {
      return;
    }
    this.danmaku.emit(payload);
  }

  private buildDanmakuPayload(
    comment: Comment,
  ): {
    text: string;
    time: number;
    mode: "ltr" | "rtl" | "top" | "bottom";
    style: DanmakuCommentStyle;
  } | null {
    const commands = normalizeCommands(comment.commands);
    if (this.hasCommand(commands, "invisible")) {
      return null;
    }

    const mode = this.resolveMode(commands);
    const color = this.resolveColor(commands);
    const fontSize = this.getFontSize(commands);
    const fontFamily = this.getFontFamily(commands);
    const letterSpacing = this.getLetterSpacing(commands);
    const lineHeight = this.getLineHeight(commands);
    const opacityMultiplier = this.hasCommand(commands, "_live") ? 0.5 : 1;

    const style: DanmakuCommentStyle = {
      color,
      fontSize: `${fontSize}px`,
      fontFamily,
      fontWeight: "600",
      whiteSpace: "pre",
      textShadow: DEFAULT_TEXT_SHADOW,
      opacity: toOpacityString(
        this.settingsValue.commentOpacity * opacityMultiplier,
      ),
    };

    if (letterSpacing !== 0) {
      style.letterSpacing = `${letterSpacing}px`;
    }
    if (lineHeight !== DEFAULT_LINE_HEIGHT) {
      style.lineHeight = lineHeight.toString();
    }

    return {
      text: comment.text,
      time: Math.max(0, comment.vposMs / 1000),
      mode,
      style,
    };
  }

  private resolveMode(commands: NormalizedCommand[]): "ltr" | "rtl" | "top" | "bottom" {
    if (this.hasCommand(commands, "ue")) {
      return "top";
    }
    if (this.hasCommand(commands, "shita")) {
      return "bottom";
    }
    if (this.hasCommand(commands, "ltr")) {
      return "ltr";
    }
    if (this.hasCommand(commands, "rtl")) {
      return "rtl";
    }
    return this.settingsValue.scrollDirection === "ltr" ? "ltr" : "rtl";
  }

  private resolveColor(commands: NormalizedCommand[]): string {
    for (const command of commands) {
      if (HEX_COLOR_PATTERN.test(command.raw)) {
        return command.raw.toUpperCase();
      }
      const mapped = COLOR_MAP[command.lower];
      if (mapped) {
        return mapped;
      }
    }
    return this.settingsValue.commentColor.toUpperCase();
  }

  private getFontSize(commands: NormalizedCommand[]): number {
    const video = this.videoElement;
    const baseHeight =
      (video?.clientHeight ?? video?.videoHeight ?? 360) / 18 || 24;
    const baseSize = Math.max(MIN_FONT_SIZE, Math.round(baseHeight));
    const sizeCommand = commands.find((command) =>
      Object.prototype.hasOwnProperty.call(SIZE_SCALE_MAP, command.lower),
    );
    const scale = sizeCommand ? SIZE_SCALE_MAP[sizeCommand.lower] : 1;
    return Math.round(baseSize * scale);
  }

  private getFontFamily(commands: NormalizedCommand[]): string {
    const fontCommand = commands.find((command) =>
      Object.prototype.hasOwnProperty.call(FONT_FAMILY_MAP, command.lower),
    );
    if (fontCommand) {
      return FONT_FAMILY_MAP[fontCommand.lower];
    }
    return DEFAULT_FONT_FAMILY;
  }

  private getLetterSpacing(commands: NormalizedCommand[]): number {
    const target = commands.find(
      (command) =>
        command.lower.startsWith("ls:") ||
        command.lower.startsWith("letterspacing:"),
    );
    if (!target) {
      return 0;
    }
    const [, value] = target.raw.split(":");
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return clamp(parsed, -100, 100);
  }

  private getLineHeight(commands: NormalizedCommand[]): number {
    const target = commands.find(
      (command) =>
        command.lower.startsWith("lh:") ||
        command.lower.startsWith("lineheight:"),
    );
    if (!target) {
      return DEFAULT_LINE_HEIGHT;
    }
    const [, value] = target.raw.split(":");
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return DEFAULT_LINE_HEIGHT;
    }
    if (target.lower.includes("%")) {
      return clamp(parsed / 100, 0.25, 5);
    }
    return clamp(parsed, 0.25, 5);
  }

  private hasCommand(
    commands: NormalizedCommand[],
    name: string,
  ): boolean {
    return commands.some((command) => command.lower === name);
  }

  private destroyDanmaku(): void {
    this.danmaku?.destroy();
    this.danmaku = null;
    this.containerElement?.remove();
    this.containerElement = null;
    this.hostElement?.remove();
    this.hostElement = null;
    this.teardownResizeObserver();
  }

  private setupKeyboardShortcuts(): void {
    this.teardownKeyboardShortcuts();
    const handler = new KeyboardShortcutHandler();
    handler.addShortcut("C", "Shift", () => {
      try {
        const currentSettings = this.settings;
        const nextSettings: RendererSettings = {
          ...currentSettings,
          isCommentVisible: !currentSettings.isCommentVisible,
        };
        this.updateSettings(nextSettings);
        this.syncGlobalSettings(nextSettings);
      } catch (error) {
        this.logger.error("CommentRenderer.keyboardShortcut", error as Error);
      }
    });
    handler.startListening();
    this.keyboardHandler = handler;
  }

  private teardownKeyboardShortcuts(): void {
    this.keyboardHandler?.stopListening();
    this.keyboardHandler = null;
  }

  private applyVisibility(): void {
    const visible = this.settingsValue.isCommentVisible;
    if (visible) {
      this.containerElement?.style.removeProperty("visibility");
      this.danmaku?.show();
    } else {
      this.containerElement?.style.setProperty("visibility", "hidden");
      this.danmaku?.hide();
    }
  }

  private cacheNgRegexps(): void {
    this.ngRegexps = this.settingsValue.ngRegexps
      .map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (error) {
          this.logger.warn("Invalid NG regexp skipped", error as Error, {
            pattern,
          });
          return null;
        }
      })
      .filter((regex): regex is RegExp => regex !== null);
  }

  private syncGlobalSettings(settings: RendererSettings): void {
    const globalWindow = window as typeof window & {
      dAniRenderer?: {
        settingsManager?: {
          updateSettings: (s: RendererSettings) => void;
        };
      };
    };
    const globalSettingsManager =
      globalWindow.dAniRenderer?.settingsManager;
    globalSettingsManager?.updateSettings(settings);
  }

  private cloneSettings(settings: RendererSettings): RendererSettings {
    return {
      ...settings,
      ngWords: [...settings.ngWords],
      ngRegexps: [...settings.ngRegexps],
    };
  }

  private getVideoSource(video: HTMLVideoElement): string | null {
    if (video.currentSrc) {
      return video.currentSrc;
    }
    if (typeof video.src === "string" && video.src.length > 0) {
      return video.src;
    }
    return null;
  }
}
