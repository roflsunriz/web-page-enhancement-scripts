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

export class CommentRenderer {
  private _settings: RendererSettings;
  private readonly comments: Comment[] = [];
  private readonly reservedLanes = new Map<number, LaneReservation[]>();
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private laneCount = 12;
  private laneHeight = 0;
  private currentTime = 0;
  private duration = 0;
  private playbackRate = 1;
  private isPlaying = true;
  private lastDrawTime = 0;
  private finalPhaseActive = false;
  private readonly virtualCanvasExtension = 1000;
  private readonly minLaneSpacing = 1;
  private frameId: number | null = null;
  private keyboardHandler: KeyboardShortcutHandler | null = null;

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
      this.videoElement = videoElement;
      this.duration = toMilliseconds(videoElement.duration);

      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      if (!this.ctx) {
        throw new Error("Failed to acquire 2D canvas context");
      }

      const rect = videoElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        throw new Error("Invalid video element dimensions");
      }

      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.canvas.style.position = "absolute";
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.zIndex = "1000";

      const parent = videoElement.parentElement ?? document.body;
      parent.style.position = parent.style.position || "relative";
      parent.appendChild(this.canvas);

      this.calculateLaneHeight();
      this.setupVideoEventListeners(videoElement);
      this.setupKeyboardShortcuts();
      this.setupResizeListener(videoElement);
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
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  getCommentsSnapshot(): Comment[] {
    return [...this.comments];
  }

  destroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.keyboardHandler?.stopListening();
    this.keyboardHandler = null;
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.ctx = null;
    this.videoElement = null;
    this.comments.length = 0;
    this.reservedLanes.clear();
  }

  updateSettings(newSettings: RendererSettings): void {
    this.settings = newSettings;
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
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

  private calculateLaneHeight(): void {
    if (!this.canvas) {
      return;
    }
    const baseHeight = Math.max(24, Math.floor(this.canvas.height * 0.05));
    this.laneHeight = baseHeight * this.minLaneSpacing * 1.2;
    this.laneCount = Math.max(
      1,
      Math.floor((this.canvas.height / this.laneHeight) * 0.9),
    );
  }

  private updateComments(): void {
    const video = this.videoElement;
    if (!video || !this.ctx || !this.canvas) {
      return;
    }

    this.currentTime = toMilliseconds(video.currentTime);
    this.playbackRate = video.playbackRate;
    this.isPlaying = !video.paused;

    const isNearEnd =
      this.duration > 0 && this.duration - this.currentTime <= 10_000;

    if (isNearEnd && !this.finalPhaseActive) {
      this.finalPhaseActive = true;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
          ? comment.vpos > this.currentTime - 10_000 && !comment.hasShown
          : comment.vpos >= this.currentTime - 2_000 &&
            comment.vpos <= this.currentTime + 2_000;

        if (shouldShow) {
          comment.prepare(
            this.ctx,
            this.canvas.width + this.virtualCanvasExtension,
            this.canvas.height,
          );
          comment.lane = this.findAvailableLane(comment);
          comment.y = comment.lane * this.laneHeight;
          comment.x = this.canvas.width + this.virtualCanvasExtension;
          comment.isActive = true;
          comment.hasShown = true;
        }
      }

      if (comment.isActive) {
        comment.update(this.playbackRate, !this.isPlaying);
      }
    }

    this.comments.forEach((comment) => {
      if (comment.isActive && comment.x < -comment.width) {
        comment.isActive = false;
      }
    });
  }

  private findAvailableLane(comment: Comment): number {
    const currentTime = this.currentTime;
    const commentEnd =
      ((comment.reservationWidth + this.virtualCanvasExtension) /
        comment.speed) *
      2;
    const minSpacing = this.minLaneSpacing;

    for (let lane = 0; lane < this.laneCount; lane += 1) {
      let isAvailable = true;
      const reservations = this.reservedLanes.get(lane) ?? [];
      for (const reservation of reservations) {
        const timeOverlap = currentTime < reservation.endTime;
        const spaceOverlap =
          Math.abs(lane * this.laneHeight - reservation.comment.y) <
          comment.height * minSpacing;
        const xOverlap =
          Math.abs(comment.x - reservation.comment.x) <
          Math.max(comment.width, reservation.comment.width);
        if (timeOverlap && (spaceOverlap || xOverlap)) {
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

    return Math.floor(Math.random() * Math.max(this.laneCount, 1));
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const activeComments = this.comments.filter((comment) => comment.isActive);
    const now = performance.now();

    if (this._settings.isCommentVisible) {
      const deltaTime = (now - this.lastDrawTime) / (1000 / 60);
      activeComments.forEach((comment) => {
        const interpolatedX = comment.x - comment.speed * deltaTime;
        comment.draw(this.ctx as CanvasRenderingContext2D, interpolatedX);
      });
    }

    this.lastDrawTime = now;
  }

  private update = (): void => {
    if (!this.videoElement) {
      return;
    }
    if (!this._settings.isCommentVisible) {
      return;
    }
    this.updateComments();
    this.draw();
    this.frameId = requestAnimationFrame(this.update);
  };

  private startAnimation(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.frameId = requestAnimationFrame(this.update);
  }

  private onSeek(): void {
    if (!this.videoElement || !this.ctx || !this.canvas) {
      return;
    }

    this.finalPhaseActive = false;
    this.currentTime = toMilliseconds(this.videoElement.currentTime);

    this.comments.forEach((comment) => {
      if (
        comment.vpos >= this.currentTime - 4_000 &&
        comment.vpos <= this.currentTime + 4_000
      ) {
        comment.prepare(
          this.ctx as CanvasRenderingContext2D,
          this.canvas!.width,
          this.canvas!.height,
        );
        comment.lane = this.findAvailableLane(comment);
        comment.y = comment.lane * this.laneHeight;
        const timeDiff = (this.currentTime - comment.vpos) / 1000;
        const distance = comment.speed * timeDiff * 60;
        comment.x = this.canvas!.width - distance;
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

  private resize(videoElement: HTMLVideoElement): void {
    if (!this.canvas) {
      return;
    }
    const rect = videoElement.getBoundingClientRect();
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    const scaleX = oldWidth ? this.canvas.width / oldWidth : 1;
    const scaleY = oldHeight ? this.canvas.height / oldHeight : 1;

    this.comments.forEach((comment) => {
      if (comment.isActive) {
        comment.x *= scaleX;
        comment.y *= scaleY;
        comment.baseSpeed *= scaleX;
        comment.speed *= scaleX;
        comment.fontSize = Math.max(24, Math.floor(this.canvas!.height * 0.05));
      }
    });

    this.calculateLaneHeight();
  }

  private setupVideoEventListeners(videoElement: HTMLVideoElement): void {
    try {
      videoElement.addEventListener("play", () => {
        this.isPlaying = true;
        const now = performance.now();
        this.comments.forEach((comment) => {
          comment.lastUpdateTime = now;
          comment.isPaused = false;
        });
      });

      videoElement.addEventListener("pause", () => {
        this.isPlaying = false;
      });

      videoElement.addEventListener("seeking", () => this.onSeek());
      videoElement.addEventListener("ratechange", () => {
        this.playbackRate = videoElement.playbackRate;
      });
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
          if (!this._settings.isCommentVisible) {
            this.comments.forEach((comment) => {
              comment.isActive = false;
            });
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

  private setupResizeListener(videoElement: HTMLVideoElement): void {
    try {
      window.addEventListener("resize", () => {
        try {
          this.resize(videoElement);
        } catch (error) {
          logger.error(error as Error, "CommentRenderer.resize");
        }
      });
    } catch (error) {
      logger.error(error as Error, "CommentRenderer.setupResizeListener");
    }
  }
}
