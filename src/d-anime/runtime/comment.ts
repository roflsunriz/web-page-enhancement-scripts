import type { RendererSettings } from "@/shared/types";
import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnime:Comment");

export class Comment {
  text: string;
  vpos: number;
  commands: string[];
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  baseSpeed = 0;
  speed = 0;
  lane = -1;
  color: string;
  fontSize = 0;
  fontFamily = "Arial";
  opacity: number;
  isActive = false;
  hasShown = false;
  isPaused = false;
  lastUpdateTime = 0;
  reservationWidth = 0;

  constructor(
    text: string,
    vpos: number,
    commands: string[] = [],
    settings: RendererSettings,
  ) {
    if (typeof text !== "string") {
      throw new Error("Comment text must be a string");
    }
    if (!Number.isFinite(vpos) || vpos < 0) {
      throw new Error("Comment vpos must be a non-negative number");
    }

    this.text = text;
    this.vpos = vpos;
    this.commands = Array.isArray(commands) ? commands : [];
    this.color = settings.commentColor;
    this.opacity = settings.commentOpacity;
  }

  prepare(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    try {
      if (!ctx) {
        throw new Error("Canvas context is required");
      }
      if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight)) {
        throw new Error("Canvas dimensions must be numbers");
      }

      this.fontSize = Math.max(24, Math.floor(canvasHeight * 0.05));
      ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      this.width = ctx.measureText(this.text).width;
      this.height = this.fontSize;

      const maxReservationWidth = ctx.measureText("あ".repeat(150)).width;
      this.reservationWidth = Math.min(maxReservationWidth, this.width * 5.0);
      this.x = canvasWidth;
      this.baseSpeed = (canvasWidth + this.reservationWidth) / (12 * 60);
      this.speed = this.baseSpeed;
      this.lastUpdateTime = performance.now();
    } catch (error) {
      logger.error("Comment.prepare", error as Error, {
        text: this.text,
        canvasWidth,
        canvasHeight,
        hasContext: Boolean(ctx),
      });
      throw error;
    }
  }

  update(playbackRate = 1.0, isPaused = false): void {
    try {
      if (!this.isActive || this.isPaused) {
        return;
      }
      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastUpdateTime) / (1000 / 60);
      this.speed = this.baseSpeed * playbackRate;
      this.x -= this.speed * deltaTime;
      if (this.x < -this.width) {
        this.isActive = false;
      }
      this.lastUpdateTime = currentTime;
      this.isPaused = isPaused;
    } catch (error) {
      logger.error("Comment.update", error as Error, {
        text: this.text,
        playbackRate,
        isPaused,
        isActive: this.isActive,
      });
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    interpolatedX: number | null = null,
  ): void {
    try {
      if (!this.isActive || !ctx) {
        return;
      }

      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.fontSize}px ${this.fontFamily}`;

      const drawX = interpolatedX ?? this.x;
      const drawY = this.y + this.fontSize;

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(3, this.fontSize / 8);
      ctx.lineJoin = "round";
      ctx.strokeText(this.text, drawX, drawY);

      ctx.fillStyle = this.color;
      ctx.fillText(this.text, drawX, drawY);

      ctx.restore();
    } catch (error) {
      logger.error("Comment.draw", error as Error, {
        text: this.text,
        isActive: this.isActive,
        hasContext: Boolean(ctx),
        interpolatedX,
      });
    }
  }
}
