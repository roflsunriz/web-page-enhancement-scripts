import { cloneDefaultSettings } from "../config/default-settings";
import type { RendererSettings } from "@/shared/types";
import { Comment } from "./comment";
import { KeyboardShortcutHandler } from "./input/keyboard-shortcut-handler";
import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnime:CommentRenderer");

interface LaneReservation {
  comment: Comment;
  endTime: number;
  reservationWidth: number;
}

const toMilliseconds = (seconds: number): number => seconds * 1000;
const FINAL_PHASE_THRESHOLD_MS = 10_000;
const ACTIVE_WINDOW_MS = 2_000;
const SEEK_WINDOW_MS = 4_000;
const VIRTUAL_CANVAS_EXTENSION_PX = 1000;
const MIN_LANE_COUNT = 1;
const DEFAULT_LANE_COUNT = 12;
const MIN_FONT_SIZE_PX = 24;

export class CommentRenderer {
  private _settings: RendererSettings;
  private readonly comments: Comment[] = [];
  private readonly reservedLanes = new Map<number, LaneReservation[]>();
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private containerElement: HTMLElement | null = null;
  private laneCount = DEFAULT_LANE_COUNT;
  private laneHeight = 0;
  private currentTime = 0;
  private duration = 0;
  private playbackRate = 1;
  private isPlaying = true;
  private lastDrawTime = 0;
  private finalPhaseActive = false;
  private frameId: number | null = null;
  private keyboardHandler: KeyboardShortcutHandler | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeObserverTarget: Element | null = null;
  private readonly isResizeObserverAvailable = typeof ResizeObserver !== "undefined";
  private readonly cleanupTasks: Array<() => void> = [];

  constructor(settings: RendererSettings | null) {
    this._settings = settings ? { ...settings } : cloneDefaultSettings();
  }

  get settings(): RendererSettings {
    return this._settings;
  }

  set settings(value: RendererSettings) {
    this._settings = { ...value };
  }

  initialize(videoElement: HTMLVideoElement): void {
    try {
      this.destroyCanvasOnly();

      this.videoElement = videoElement;
      this.containerElement = videoElement.parentElement ?? document.body;
      this.duration = Number.isFinite(videoElement.duration)
        ? toMilliseconds(videoElement.duration)
        : 0;
      this.playbackRate = videoElement.playbackRate;
      this.isPlaying = !videoElement.paused;
      this.lastDrawTime = performance.now();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to acquire 2D canvas context");
      }

      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1000";

      const parent = this.containerElement;
      if (parent instanceof HTMLElement) {
        const style = getComputedStyle(parent);
        if (style.position === "static") {
          parent.style.position = "relative";
        }
        parent.appendChild(canvas);
      }

      this.canvas = canvas;
      this.ctx = context;

      this.resize();
      this.calculateLaneMetrics();
      this.setupVideoEventListeners(videoElement);
      this.setupKeyboardShortcuts();
      this.setupResizeHandling(videoElement);
      this.startAnimation();
    } catch (error) {
      logger.error("CommentRenderer.initialize", error as Error);
      throw error;
    }
  }

  addComment(
    text: string,
    vpos: number,
    commands: string[] = [],
  ): Comment | null {
    if (this.isNGComment(text)) {
      return null;
    }
    const duplicate = this.comments.some(
      (comment) => comment.text === text && comment.vpos === vpos,
    );
    if (duplicate) {
      return null;
    }

    const comment = new Comment(text, vpos, commands, this._settings);
    this.comments.push(comment);
    this.comments.sort((a, b) => a.vpos - b.vpos);
    return comment;
  }

  clearComments(): void {
    this.comments.length = 0;
    this.reservedLanes.clear();
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  resetState(): void {
    this.clearComments();
    this.currentTime = 0;
    this.finalPhaseActive = false;
  }

  destroy(): void {
    this.stopAnimation();
    this.keyboardHandler?.stopListening();
    this.keyboardHandler = null;
    this.cleanupResizeHandling();
    this.runCleanupTasks();

    if (this.canvas) {
      this.canvas.remove();
    }
    this.canvas = null;
    this.ctx = null;
    this.videoElement = null;
    this.containerElement = null;
    this.comments.length = 0;
    this.reservedLanes.clear();
    this.finalPhaseActive = false;
  }

  updateSettings(newSettings: RendererSettings): void {
    const previousUseContainer = this._settings.useContainerResizeObserver;
    this.settings = newSettings;

    this.comments.forEach((comment) => {
      comment.color = this._settings.commentColor;
      comment.opacity = this._settings.commentOpacity;
    });

    if (!this._settings.isCommentVisible && this.ctx && this.canvas) {
      this.comments.forEach((comment) => {
        comment.isActive = false;
      });
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (
      previousUseContainer !== this._settings.useContainerResizeObserver &&
      this.videoElement
    ) {
      this.setupResizeHandling(this.videoElement);
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  getCurrentVideoSource(): string | null {
    const video = this.videoElement;
    if (!video) {
      return null;
    }
    if (typeof video.currentSrc === "string" && video.currentSrc.length > 0) {
      return video.currentSrc;
    }
    const attribute = video.getAttribute("src");
    if (attribute && attribute.length > 0) {
      return attribute;
    }
    const sourceElement = video.querySelector("source[src]") as
      | HTMLSourceElement
      | null;
    if (sourceElement && typeof sourceElement.src === "string") {
      return sourceElement.src;
    }
    return null;
  }

  getCommentsSnapshot(): Comment[] {
    return [...this.comments];
  }

  isNGComment(text: string): boolean {
    try {
      if (typeof text !== "string") {
        return true;
      }

      if (Array.isArray(this._settings.ngWords)) {
        const containsNgWord = this._settings.ngWords.some(
          (word) =>
            typeof word === "string" && word.length > 0 && text.includes(word),
        );
        if (containsNgWord) {
          return true;
        }
      }

      if (Array.isArray(this._settings.ngRegexps)) {
        return this._settings.ngRegexps.some((pattern) => {
          if (typeof pattern !== "string" || pattern.length === 0) {
            return false;
          }
          try {
            return new RegExp(pattern).test(text);
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

  resize(width?: number, height?: number): void {
    const video = this.videoElement;
    const canvas = this.canvas;
    if (!video || !canvas) {
      return;
    }

    const rect = video.getBoundingClientRect();
    const measuredWidth = width ?? rect.width ?? canvas.width;
    const measuredHeight = height ?? rect.height ?? canvas.height;

    if (
      !Number.isFinite(measuredWidth) ||
      !Number.isFinite(measuredHeight) ||
      measuredWidth <= 0 ||
      measuredHeight <= 0
    ) {
      return;
    }

    const nextWidth = Math.max(1, Math.floor(measuredWidth));
    const nextHeight = Math.max(1, Math.floor(measuredHeight));

    if (!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight)) {
      return;
    }

    const previousWidth = canvas.width || nextWidth;
    const previousHeight = canvas.height || nextHeight;

    if (previousWidth === nextWidth && previousHeight === nextHeight) {
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    canvas.style.width = `${nextWidth}px`;
    canvas.style.height = `${nextHeight}px`;

    const scaleX = previousWidth > 0 ? nextWidth / previousWidth : 1;
    const scaleY = previousHeight > 0 ? nextHeight / previousHeight : 1;

    if (scaleX !== 1 || scaleY !== 1) {
      this.comments.forEach((comment) => {
        if (comment.isActive) {
          comment.x *= scaleX;
          comment.y *= scaleY;
          comment.baseSpeed *= scaleX;
          comment.speed *= scaleX;
          comment.fontSize = Math.max(
            MIN_FONT_SIZE_PX,
            Math.floor(nextHeight * 0.05),
          );
        }
      });
    }

    this.calculateLaneMetrics();
  }

  private destroyCanvasOnly(): void {
    this.stopAnimation();
    this.cleanupResizeHandling();
    this.runCleanupTasks();
    if (this.canvas) {
      this.canvas.remove();
    }
    this.canvas = null;
    this.ctx = null;
  }

  private calculateLaneMetrics(): void {
    const canvas = this.canvas;
    if (!canvas) {
      return;
    }

    const baseHeight = Math.max(
      MIN_FONT_SIZE_PX,
      Math.floor(canvas.height * 0.05),
    );
    this.laneHeight = baseHeight * 1.2;
    const availableLanes = Math.floor(
      canvas.height / Math.max(this.laneHeight, 1),
    );
    this.laneCount = Math.max(MIN_LANE_COUNT, availableLanes);
  }

  private updateComments(): void {
    const video = this.videoElement;
    const canvas = this.canvas;
    const context = this.ctx;
    if (!video || !canvas || !context) {
      return;
    }

    this.currentTime = toMilliseconds(video.currentTime);
    this.playbackRate = video.playbackRate;
    this.isPlaying = !video.paused;

    const isNearEnd =
      this.duration > 0 &&
      this.duration - this.currentTime <= FINAL_PHASE_THRESHOLD_MS;

    if (isNearEnd && !this.finalPhaseActive) {
      this.finalPhaseActive = true;
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.comments.forEach((comment) => {
        comment.isActive = false;
      });
      this.reservedLanes.clear();
    }

    if (!isNearEnd && this.finalPhaseActive) {
      this.finalPhaseActive = false;
    }

    for (const comment of this.comments) {
      if (this.isNGComment(comment.text)) {
        continue;
      }

      comment.color = this._settings.commentColor;
      comment.opacity = this._settings.commentOpacity;

      if (!comment.isActive) {
        const shouldShow = isNearEnd
          ? comment.vpos > this.currentTime - FINAL_PHASE_THRESHOLD_MS &&
            !comment.hasShown
          : comment.vpos >= this.currentTime - ACTIVE_WINDOW_MS &&
            comment.vpos <= this.currentTime + ACTIVE_WINDOW_MS;

        if (shouldShow) {
          comment.prepare(
            context,
            canvas.width + VIRTUAL_CANVAS_EXTENSION_PX,
            canvas.height,
          );
          comment.lane = this.findAvailableLane(comment);
          comment.y = comment.lane * this.laneHeight;
          comment.x = canvas.width + VIRTUAL_CANVAS_EXTENSION_PX;
          comment.isActive = true;
          comment.hasShown = true;
        }
      }

      if (comment.isActive) {
        comment.update(this.playbackRate, !this.isPlaying);
      }
    }

    for (const comment of this.comments) {
      if (comment.isActive && comment.x < -comment.width) {
        comment.isActive = false;
      }
    }
  }

  private findAvailableLane(comment: Comment): number {
    const currentTime = this.currentTime;
    const commentEnd =
      ((comment.reservationWidth + VIRTUAL_CANVAS_EXTENSION_PX) /
        Math.max(comment.speed, 1)) *
      2;

    for (let lane = 0; lane < this.laneCount; lane += 1) {
      let isAvailable = true;
      const reservations = this.reservedLanes.get(lane) ?? [];

      for (const reservation of reservations) {
        const timeOverlap = currentTime < reservation.endTime;
        const verticalOverlap =
          Math.abs(lane * this.laneHeight - reservation.comment.y) <
          comment.height;
        const horizontalOverlap =
          Math.abs(comment.x - reservation.comment.x) <
          Math.max(comment.width, reservation.comment.width);

        if (timeOverlap && (verticalOverlap || horizontalOverlap)) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        if (!this.reservedLanes.has(lane)) {
          this.reservedLanes.set(lane, []);
        }
        this.reservedLanes.get(lane)?.push({
          comment,
          endTime: currentTime + commentEnd,
          reservationWidth: comment.reservationWidth,
        });
        return lane;
      }
    }

    return Math.floor(Math.random() * Math.max(this.laneCount, MIN_LANE_COUNT));
  }

  private draw(): void {
    const canvas = this.canvas;
    const context = this.ctx;
    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    const activeComments = this.comments.filter((comment) => comment.isActive);
    const now = performance.now();

    if (this._settings.isCommentVisible) {
      const deltaTime = (now - this.lastDrawTime) / (1000 / 60);
      activeComments.forEach((comment) => {
        const interpolatedX = comment.x - comment.speed * deltaTime;
        comment.draw(context, interpolatedX);
      });
    }

    this.lastDrawTime = now;
  }

  private readonly updateFrame = (): void => {
    if (!this.videoElement) {
      return;
    }
    if (!this._settings.isCommentVisible) {
      this.frameId = requestAnimationFrame(this.updateFrame);
      return;
    }
    this.updateComments();
    this.draw();
    this.frameId = requestAnimationFrame(this.updateFrame);
  };

  private startAnimation(): void {
    this.stopAnimation();
    this.frameId = requestAnimationFrame(this.updateFrame);
  }

  private stopAnimation(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private onSeek(): void {
    const canvas = this.canvas;
    const context = this.ctx;
    const video = this.videoElement;
    if (!canvas || !context || !video) {
      return;
    }

    this.finalPhaseActive = false;
    this.currentTime = toMilliseconds(video.currentTime);

    this.comments.forEach((comment) => {
      if (
        comment.vpos >= this.currentTime - SEEK_WINDOW_MS &&
        comment.vpos <= this.currentTime + SEEK_WINDOW_MS
      ) {
        comment.prepare(context, canvas.width, canvas.height);
        comment.lane = this.findAvailableLane(comment);
        comment.y = comment.lane * this.laneHeight;
        const timeDiff = (this.currentTime - comment.vpos) / 1000;
        const distance = comment.speed * timeDiff * 60;
        comment.x = canvas.width - distance;
        comment.isActive = comment.x > -comment.width;
        if (comment.x < -comment.width) {
          comment.isActive = false;
          comment.hasShown = true;
        }
      } else {
        comment.isActive = false;
      }
    });

    this.reservedLanes.clear();
  }

  private setupVideoEventListeners(videoElement: HTMLVideoElement): void {
    try {
      const onPlay = (): void => {
        this.isPlaying = true;
        const now = performance.now();
        this.comments.forEach((comment) => {
          comment.lastUpdateTime = now;
          comment.isPaused = false;
        });
      };
      const onPause = (): void => {
        this.isPlaying = false;
      };
      const onSeeking = (): void => {
        this.onSeek();
      };
      const onRateChange = (): void => {
        this.playbackRate = videoElement.playbackRate;
      };

      videoElement.addEventListener("play", onPlay);
      videoElement.addEventListener("pause", onPause);
      videoElement.addEventListener("seeking", onSeeking);
      videoElement.addEventListener("ratechange", onRateChange);

      this.addCleanup(() =>
        videoElement.removeEventListener("play", onPlay),
      );
      this.addCleanup(() =>
        videoElement.removeEventListener("pause", onPause),
      );
      this.addCleanup(() =>
        videoElement.removeEventListener("seeking", onSeeking),
      );
      this.addCleanup(() =>
        videoElement.removeEventListener("ratechange", onRateChange),
      );
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
      this.keyboardHandler?.stopListening();
      this.keyboardHandler = new KeyboardShortcutHandler();
      this.keyboardHandler.addShortcut("C", "Shift", () => {
        try {
          this._settings.isCommentVisible = !this._settings.isCommentVisible;
          if (!this._settings.isCommentVisible) {
            this.comments.forEach((comment) => {
              comment.isActive = false;
            });
            if (this.ctx && this.canvas) {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
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

  private setupResizeHandling(videoElement: HTMLVideoElement): void {
    this.cleanupResizeHandling();

    if (this._settings.useContainerResizeObserver && this.isResizeObserverAvailable) {
      const target = videoElement.parentElement ?? videoElement;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            this.resize(width, height);
          } else {
            this.resize();
          }
        }
      });
      observer.observe(target);
      this.resizeObserver = observer;
      this.resizeObserverTarget = target;
    } else {
      const onResize = (): void => {
        this.resize();
      };
      window.addEventListener("resize", onResize);
      this.addCleanup(() => window.removeEventListener("resize", onResize));
    }
  }

  private cleanupResizeHandling(): void {
    if (this.resizeObserver && this.resizeObserverTarget) {
      this.resizeObserver.unobserve(this.resizeObserverTarget);
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.resizeObserverTarget = null;
  }

  private addCleanup(task: () => void): void {
    this.cleanupTasks.push(task);
  }

  private runCleanupTasks(): void {
    while (this.cleanupTasks.length > 0) {
      const task = this.cleanupTasks.pop();
      try {
        task?.();
      } catch (error) {
        logger.error("CommentRenderer.cleanupTask", error as Error);
      }
    }
  }
}
