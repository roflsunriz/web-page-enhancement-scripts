import { cloneDefaultSettings } from "../config/default-settings";
import type {
  DanmakuComment,
  DanmakuCommentStyle,
  RendererSettings,
} from "@/shared/types";
import { KeyboardShortcutHandler } from "./input/keyboard-shortcut-handler";
import { createLogger } from "@/shared/logger";
import Danmaku from "danmaku";

const logger = createLogger("dAnime:CommentRenderer");

const toMilliseconds = (seconds: number): number => seconds * 1000;
const DEFAULT_FONT_WEIGHT = "bold";
const DEFAULT_FONT_FAMILY = "'MS PGothic', 'sans-serif'";
const FALLBACK_FONT_SIZE_PX = 24;
const DEFAULT_TEXT_SHADOW =
  "1px 1px 2px #000, -1px -1px 2px #000, 1px -1px 2px #000, -1px 1px 2px #000";
const RESYNC_TIME_WINDOW_MS = 2000;
const TARGET_LANE_COUNT = 16;
const COMMENT_DURATION_SECONDS = 4;
const MIN_FONT_SIZE_PX = 18;
const MAX_FONT_SIZE_PX = 60;
const ESTIMATED_LINE_HEIGHT_RATIO = 1.2;
const FULLSCREEN_EVENTS = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
] as const;

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

const getFullscreenElement = (): Element | null => {
  const doc = document as FullscreenDocument;
  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  );
};

export class CommentRenderer {
  private _settings: RendererSettings;
  private danmaku: Danmaku | null = null;
  private allComments: DanmakuComment[] = [];
  private lastEmittedIndex = -1;
  private canvas: HTMLCanvasElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private currentTime = 0;
  private duration = 0;
  private finalPhaseActive = false;
  private keyboardHandler: KeyboardShortcutHandler | null = null;
  private sizeObserver: ResizeObserver | null = null;
  private readonly isResizeObserverAvailable: boolean;
  private container: HTMLDivElement | null = null;
  private fullscreenEventsAttached = false;
  private scrollListenerAttached = false;
  private cachedFontSizePx = FALLBACK_FONT_SIZE_PX;


  constructor(settings: RendererSettings | null) {
    this._settings = settings ? { ...settings } : cloneDefaultSettings();
    this.isResizeObserverAvailable = typeof ResizeObserver !== "undefined";
  }

  get settings(): RendererSettings {
    return this._settings;
  }

  set settings(value: RendererSettings) {
    this._settings = { ...value };
  }

  initialize(videoElement: HTMLVideoElement): void {
    try {
      logger.debug("initialize:start", {
        readyState: videoElement.readyState,
        duration: videoElement.duration,
      });
      if (this.danmaku) {
        this.destroy();
      }

      this.videoElement = videoElement;
      this.duration = toMilliseconds(videoElement.duration);

      logger.info("videoRenderer:boundVideo", {
        src: this.resolveVideoSource(videoElement),
        videoId: videoElement.dataset?.videoId ?? null,
        durationMs: this.duration,
      });

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.pointerEvents = "none";
      container.style.zIndex = "1000";
      container.style.top = "0px";
      container.style.left = "0px";

      const rect = videoElement.getBoundingClientRect();
      container.style.width = `${rect.width}px`;
      container.style.height = `${rect.height}px`;

      const parent = videoElement.parentElement ?? document.body;
      parent.style.position = parent.style.position || "relative";
      parent.appendChild(container);

      this.container = container;

      const commentSpeed = rect.width / COMMENT_DURATION_SECONDS;
      this.danmaku = new Danmaku({
        container,
        media: videoElement,
        comments: [],
        engine: "canvas",
        speed: commentSpeed,
      });

      this.canvas = container.querySelector("canvas");
      this.setupVideoEventListeners(videoElement);
      this.setupKeyboardShortcuts();
      this.setupResizeListener(container, videoElement);
      logger.debug("initialize:completed");
    } catch (error) {
      logger.error("CommentRenderer.initialize", error as Error);
      throw error;
    }
  }

  addComment(
    text: string,
    vpos: number,
    commands?: string[],
  ): DanmakuComment | null {
    if (this.isNGComment(text)) {
      return null;
    }
    const duplicate = this.allComments.some(
      (comment) => comment.text === text && comment.time === vpos / 1000,
    );
    if (duplicate) {
      return null;
    }
    const comment: DanmakuComment = {
      text,
      time: vpos / 1000,
      style: this.createCommentStyle(),
      commands: commands ? [...commands] : undefined,
    };
    this.allComments.push(comment);
    this.allComments.sort((a, b) => a.time - b.time);
    return comment;
  }

  clearComments(): void {
    this.allComments = [];
    this.lastEmittedIndex = -1;
    this.finalPhaseActive = false;
    this.danmaku?.clear();
  }

  resetState(): void {
    this.clearComments();
    this.currentTime = 0;
    this.finalPhaseActive = false;
  }

  destroy(): void {
    const previousVideo = this.videoElement;
    if (previousVideo) {
      logger.info("videoRenderer:unbindVideo", {
        src: this.resolveVideoSource(previousVideo),
        videoId: previousVideo.dataset?.videoId ?? null,
      });
    }
    this.keyboardHandler?.stopListening();
    this.keyboardHandler = null;
    this.teardownResizeListener();
    this.danmaku?.destroy();
    this.danmaku = null;
    this.videoElement = null;
    this.container = null;
  }

  updateSettings(newSettings: RendererSettings): void {
    const previousSettings = this.settings;
    this.settings = newSettings;
    if (this.danmaku) {
      this.syncWithDanmaku(previousSettings);
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  getCurrentVideoSource(): string | null {
    const video = this.videoElement;
    return video ? this.resolveVideoSource(video) : null;
  }

  getCommentsSnapshot(): DanmakuComment[] {
    return this.allComments.map((comment) => ({
      ...comment,
      style: { ...comment.style },
      commands: comment.commands ? [...comment.commands] : undefined,
    }));
  }

  isNGComment(text: string): boolean {
    try {
      if (typeof text !== "string") {
        return true;
      }
      if (Array.isArray(this._settings.ngWords)) {
        if (
          this._settings.ngWords.some(
            (word) =>
              typeof word === "string" && word.length && text.includes(word),
          )
        ) {
          return true;
        }
      }
      if (Array.isArray(this._settings.ngRegexps)) {
        return this._settings.ngRegexps.some((pattern) => {
          try {
            if (typeof pattern === "string" && pattern.length) {
              return new RegExp(pattern).test(text);
            }
            return false;
          } catch (regexError) {
            logger.error(
              "CommentRenderer.isNGComment.regex",
              regexError as Error,
              { pattern, text },
            );
            return false;
          }
        });
      }
      return false;
    } catch (error) {
      logger.error("CommentRenderer.isNGComment", error as Error, { text });
      return true;
    }
  }

  private updateComments(): void {
    const video = this.videoElement;
    if (!video || !this.danmaku) {
      return;
    }

    this.currentTime = toMilliseconds(video.currentTime);

    const isNearEnd =
      this.duration > 0 && this.duration - this.currentTime <= 10_000;

    if (isNearEnd && !this.finalPhaseActive) {
      this.finalPhaseActive = true;
      this.danmaku.clear();
    }

    if (!isNearEnd && this.finalPhaseActive) {
      this.finalPhaseActive = false;
    }

    const emitThreshold = this.currentTime + 2000;
    for (let i = this.lastEmittedIndex + 1; i < this.allComments.length; i++) {
      const comment = this.allComments[i];
      const vpos = comment.time * 1000;
      if (vpos < emitThreshold) {
        if (!this.isNGComment(comment.text)) {
          this.danmaku.emit({
            ...comment,
            style: this.createCommentStyle(comment.style),
          });
        }
        this.lastEmittedIndex = i;
      } else {
        break;
      }
    }
  }

  private onSeek(): void {
    if (!this.videoElement || !this.danmaku) {
      return;
    }

    this.finalPhaseActive = false;
    this.currentTime = toMilliseconds(this.videoElement.currentTime);
    this.danmaku.clear();

    const seekTime = this.videoElement.currentTime;
    let newIndex = -1;
    for (let i = 0; i < this.allComments.length; i++) {
      if (this.allComments[i].time >= seekTime) {
        newIndex = i - 1;
        break;
      }
    }
    this.lastEmittedIndex = newIndex;
  }

  private resize(width?: number, height?: number): void {
    if (!this.danmaku || !this.container) {
      return;
    }
    const video = this.videoElement;
    const rect = video?.getBoundingClientRect();
    const targetWidth = width ?? rect?.width ?? this.container.clientWidth;
    const targetHeight = height ?? rect?.height ?? this.container.clientHeight;
    if (targetWidth <= 0 || targetHeight <= 0) {
      return;
    }
    if (video && rect) {
      this.updateContainerPlacement(rect);
    }
    this.container.style.width = `${targetWidth}px`;
    this.container.style.height = `${targetHeight}px`;
    this.danmaku.resize();
    this.danmaku.speed = (targetWidth / COMMENT_DURATION_SECONDS) * (this.videoElement?.playbackRate ?? 1);
  }

  private setupVideoEventListeners(videoElement: HTMLVideoElement): void {
    try {
      videoElement.addEventListener("seeking", () => this.onSeek());
      videoElement.addEventListener("ratechange", () => {
        if (this.danmaku) {
          const containerWidth = this.container?.clientWidth ?? 0;
          const baseSpeed = containerWidth / COMMENT_DURATION_SECONDS;
          this.danmaku.speed = baseSpeed * videoElement.playbackRate;
        }
      });
      videoElement.addEventListener("timeupdate", () => this.updateComments());
    } catch (error) {
      logger.error(
        "CommentRenderer.setupVideoEventListeners",
        error as Error,
      );
      throw error;
    }
  }

  private setupKeyboardShortcuts(): void {
    try {
      this.keyboardHandler = new KeyboardShortcutHandler();
      this.keyboardHandler.addShortcut("C", "Shift", () => {
        try {
          this._settings.isCommentVisible = !this._settings.isCommentVisible;
          if (this._settings.isCommentVisible) {
            this.danmaku?.show();
          } else {
            this.danmaku?.hide();
          }
          const globalSettingsManager = (
            window as typeof window & {
              dAniRenderer?: {
                settingsManager?: {
                  updateSettings: (settings: RendererSettings) => void;
                };
              };
            }
          ).dAniRenderer?.settingsManager;
          globalSettingsManager?.updateSettings(this._settings);
        } catch (error) {
          logger.error(error as Error, "CommentRenderer.keyboardShortcut");
        }
      });
      this.keyboardHandler.startListening();
    } catch (error) {
      logger.error(error as Error, "CommentRenderer.setupKeyboardShortcuts");
    }
  }

  private setupResizeListener(
    container: HTMLDivElement,
    videoElement: HTMLVideoElement,
  ): void {
    try {
      this.teardownResizeListener();
      if (this.isResizeObserverAvailable) {
        this.sizeObserver = new ResizeObserver((entries) => {
          try {
            const entry = entries.find(
              (item) => item.target === videoElement,
            );
            if (!entry) {
              return;
            }
            this.resize(entry.contentRect.width, entry.contentRect.height);
          } catch (error) {
            logger.error(error as Error, "CommentRenderer.resizeObserver");
          }
        });
        this.sizeObserver.observe(videoElement);
      } else {
        window.addEventListener("resize", this.handleWindowResize);
      }
      this.addViewportEventListeners();
      this.resize();
    } catch (error) {
      logger.error(error as Error, "CommentRenderer.setupResizeListener");
    }
  }

  private teardownResizeListener(): void {
    if (this.sizeObserver) {
      this.sizeObserver.disconnect();
      this.sizeObserver = null;
    }
    if (!this.isResizeObserverAvailable) {
      window.removeEventListener("resize", this.handleWindowResize);
    }
    this.removeViewportEventListeners();
  }

  private handleWindowResize = () => {
    this.resize();
  };

  private handleWindowScroll = () => {
    this.resize();
  };

  private handleFullscreenChange = () => {
    this.resize();
  };

  private addViewportEventListeners(): void {
    if (!this.scrollListenerAttached) {
      window.addEventListener("scroll", this.handleWindowScroll, {
        passive: true,
      });
      this.scrollListenerAttached = true;
    }
    if (!this.fullscreenEventsAttached) {
      FULLSCREEN_EVENTS.forEach((eventName) => {
        document.addEventListener(eventName, this.handleFullscreenChange);
      });
      this.fullscreenEventsAttached = true;
    }
  }

  private removeViewportEventListeners(): void {
    if (this.scrollListenerAttached) {
      window.removeEventListener("scroll", this.handleWindowScroll);
      this.scrollListenerAttached = false;
    }
    if (this.fullscreenEventsAttached) {
      FULLSCREEN_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, this.handleFullscreenChange);
      });
      this.fullscreenEventsAttached = false;
    }
  }

  private updateContainerPlacement(rect: DOMRect): void {
    const container = this.container;
    const video = this.videoElement;
    if (!container || !video) {
      return;
    }
    this.syncContainerParent();
    const isFullscreen = Boolean(getFullscreenElement());
    const parent = container.parentElement;
    if (!parent) {
      return;
    }
    if (isFullscreen) {
      container.style.position = "fixed";
      container.style.top = `${rect.top}px`;
      container.style.left = `${rect.left}px`;
    } else {
      const parentRect = parent.getBoundingClientRect();
      const offsetTop = rect.top - parentRect.top;
      const offsetLeft = rect.left - parentRect.left;
      container.style.position = "absolute";
      container.style.top = `${offsetTop}px`;
      container.style.left = `${offsetLeft}px`;
    }
    container.style.width = `${rect.width}px`;
    container.style.height = `${rect.height}px`;
    container.style.overflow = "hidden";
  }

  private syncContainerParent(): void {
    const container = this.container;
    const video = this.videoElement;
    if (!container || !video) {
      return;
    }
    const fullscreenElement = getFullscreenElement();
    const isVideoInFullscreen = fullscreenElement?.contains(video) ?? false;
    const targetParent = isVideoInFullscreen
      ? fullscreenElement
      : video.parentElement;
    if (!targetParent) {
      return;
    }
    if (container.parentElement === targetParent) {
      return;
    }
    container.remove();
    const style = targetParent instanceof HTMLElement ? targetParent.style : null;
    if (style && !style.position) {
      style.position = "relative";
    }
    targetParent.appendChild(container);
  }

  private createCommentStyle(
    baseStyle?: DanmakuCommentStyle,
  ): DanmakuCommentStyle {
    const fontSizePx = this.computeFontSizePx();
    const font = this.composeFontString(baseStyle?.font, fontSizePx);
    const opacity = Number.isFinite(this._settings.commentOpacity)
      ? Math.max(0, Math.min(1, this._settings.commentOpacity))
      : 1;
    const strokeWidth = this.resolveStrokeWidth(baseStyle?.lineWidth, fontSizePx);
    return {
      font,
      textShadow: baseStyle?.textShadow ?? DEFAULT_TEXT_SHADOW,
      color: this._settings.commentColor,
      fillStyle: this._settings.commentColor,
      strokeStyle: baseStyle?.strokeStyle ?? "#000000",
      lineWidth: strokeWidth,
      opacity: opacity.toString(),
      globalAlpha: opacity,
    };
  }

  private computeFontSizePx(): number {
    const containerHeight = this.getContainerHeight();
    if (containerHeight <= 0) {
      this.cachedFontSizePx = FALLBACK_FONT_SIZE_PX;
      return this.cachedFontSizePx;
    }
    const idealFontSize =
      containerHeight / (TARGET_LANE_COUNT * ESTIMATED_LINE_HEIGHT_RATIO);
    const clamped = Math.min(
      MAX_FONT_SIZE_PX,
      Math.max(MIN_FONT_SIZE_PX, idealFontSize),
    );
    const rounded = Math.round(clamped);
    this.cachedFontSizePx = rounded;
    return rounded;
  }

  private getContainerHeight(): number {
    if (this.container) {
      const { height } = this.container.getBoundingClientRect();
      if (Number.isFinite(height) && height > 0) {
        return height;
      }
    }
    const videoRect = this.videoElement?.getBoundingClientRect();
    const videoHeight = videoRect?.height;
    if (Number.isFinite(videoHeight) && videoHeight !== undefined && videoHeight > 0) {
      return videoHeight;
    }
    return this.cachedFontSizePx * TARGET_LANE_COUNT * ESTIMATED_LINE_HEIGHT_RATIO;
  }

  private composeFontString(baseFont: string | undefined, fontSizePx: number): string {
    if (typeof baseFont === "string" && baseFont.trim().length > 0) {
      const fontSizePattern = /\d+(?:\.\d+)?px/iu;
      if (fontSizePattern.test(baseFont)) {
        return baseFont.replace(fontSizePattern, `${fontSizePx}px`).trim();
      }
    }
    return `${DEFAULT_FONT_WEIGHT} ${fontSizePx}px ${DEFAULT_FONT_FAMILY}`;
  }

  private resolveStrokeWidth(
    baseStrokeWidth: number | undefined,
    fontSizePx: number,
  ): number {
    if (Number.isFinite(baseStrokeWidth) && baseStrokeWidth !== undefined) {
      return baseStrokeWidth;
    }
    return Math.max(2, Math.floor(fontSizePx / 12));
  }

  private applySettingsToComments(): void {
    this.allComments = this.allComments.map((comment) => ({
      ...comment,
      style: this.createCommentStyle(comment.style),
    }));
  }

  private syncWithDanmaku(previousSettings: RendererSettings): void {
    const danmakuInstance = this.danmaku;
    if (!danmakuInstance) {
      return;
    }

    if (this.settings.isCommentVisible) {
      danmakuInstance.show();
    } else {
      danmakuInstance.hide();
    }

    const shouldResyncComments =
      previousSettings.commentColor !== this.settings.commentColor ||
      previousSettings.commentOpacity !== this.settings.commentOpacity ||
      !this.areNgListsEqual(previousSettings, this.settings);

    if (!shouldResyncComments) {
      return;
    }

    this.applySettingsToComments();

    const video = this.videoElement;
    const currentTimeMs = video ? toMilliseconds(video.currentTime) : 0;
    const timeWindowStart = currentTimeMs - RESYNC_TIME_WINDOW_MS;

    danmakuInstance.clear();

    const commentsToEmit = this.allComments.filter((comment) => {
      const timeMs = comment.time * 1000;
      if (timeMs > currentTimeMs + RESYNC_TIME_WINDOW_MS) {
        return false;
      }
      if (timeMs < timeWindowStart) {
        return false;
      }
      return !this.isNGComment(comment.text);
    });

    commentsToEmit.forEach((comment) => {
      danmakuInstance.emit({
        ...comment,
        style: this.createCommentStyle(comment.style),
      });
    });
  }

  private areNgListsEqual(
    previousSettings: RendererSettings,
    nextSettings: RendererSettings,
  ): boolean {
    const prevWords = previousSettings.ngWords ?? [];
    const nextWords = nextSettings.ngWords ?? [];
    const prevRegex = previousSettings.ngRegexps ?? [];
    const nextRegex = nextSettings.ngRegexps ?? [];
    if (prevWords.length !== nextWords.length ||
      prevRegex.length !== nextRegex.length) {
      return false;
    }
    const wordsChanged = prevWords.some((word, index) => word !== nextWords[index]);
    if (wordsChanged) {
      return false;
    }
    const regexChanged = prevRegex.some((pattern, index) => pattern !== nextRegex[index]);
    return !regexChanged;
  }

  private resolveVideoSource(video: HTMLVideoElement): string | null {
    if (typeof video.currentSrc === "string" && video.currentSrc.length > 0) {
      return video.currentSrc;
    }
    const source = video.getAttribute("src");
    return source && source.length > 0 ? source : null;
  }
}
