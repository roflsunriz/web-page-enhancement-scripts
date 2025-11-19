import { createLogger } from "@/shared/logger";

const logger = createLogger("dAnime:VideoEventLogger");

export interface VideoEventLogData {
  event: string;
  currentTime: number;
  duration: number;
  readyState: number;
  paused: boolean;
  ended: boolean;
  src: string | null;
  networkState: number;
  timestamp: number;
}

export class VideoEventLogger {
  private video: HTMLVideoElement | null = null;
  private lastCurrentTime = 0;
  private eventListeners = new Map<string, EventListener>();
  private isEnabled = true;

  private readonly TRACKED_EVENTS = [
    "loadstart",
    "loadedmetadata",
    "loadeddata",
    "canplay",
    "canplaythrough",
    "play",
    "playing",
    "pause",
    "seeking",
    "seeked",
    "timeupdate",
    "ended",
    "emptied",
    "stalled",
    "suspend",
    "waiting",
    "error",
    "abort",
  ] as const;

  constructor(private readonly prefix = "") {}

  enable(): void {
    this.isEnabled = true;
    logger.info(`${this.prefix}:enabled`);
  }

  disable(): void {
    this.isEnabled = false;
    logger.info(`${this.prefix}:disabled`);
  }

  attach(video: HTMLVideoElement): void {
    this.detach();
    this.video = video;
    this.lastCurrentTime = video.currentTime;

    logger.info(`${this.prefix}:attach`, {
      src: this.getVideoSource(video),
      duration: video.duration,
      currentTime: video.currentTime,
      readyState: video.readyState,
    });

    this.TRACKED_EVENTS.forEach((eventName) => {
      const listener = () => {
        this.handleEvent(eventName);
      };
      this.eventListeners.set(eventName, listener);
      video.addEventListener(eventName, listener);
    });

    // currentTimeの変更を監視（setterのフック）
    this.setupCurrentTimeWatcher();
  }

  detach(): void {
    if (!this.video) {
      return;
    }

    this.eventListeners.forEach((listener, eventName) => {
      this.video?.removeEventListener(eventName, listener);
    });
    this.eventListeners.clear();

    logger.info(`${this.prefix}:detach`, {
      src: this.getVideoSource(this.video),
      finalTime: this.video.currentTime,
    });

    this.video = null;
  }

  private handleEvent(eventName: string): void {
    if (!this.isEnabled || !this.video) {
      return;
    }

    const video = this.video;
    const logData: VideoEventLogData = {
      event: eventName,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
      paused: video.paused,
      ended: video.ended,
      src: this.getVideoSource(video),
      networkState: video.networkState,
      timestamp: Date.now(),
    };

    // currentTimeの変更を検出
    const timeDiff = Math.abs(video.currentTime - this.lastCurrentTime);
    if (timeDiff > 0.1) {
      logger.info(`${this.prefix}:event:${eventName}`, {
        ...logData,
        timeDiff: timeDiff.toFixed(2),
        direction: video.currentTime > this.lastCurrentTime ? "forward" : "backward",
      });
      this.lastCurrentTime = video.currentTime;
    } else if (eventName !== "timeupdate") {
      // timeupdateは頻繁すぎるので、currentTime変更がない場合はスキップ
      logger.debug(`${this.prefix}:event:${eventName}`, logData);
    }

    // 特定のイベントでは追加情報をログ
    switch (eventName) {
      case "error":
        logger.error(
          `${this.prefix}:videoError`,
          new Error("Video error detected"),
          {
            errorCode: video.error?.code ?? null,
            errorMessage: video.error?.message ?? null,
            ...logData,
          },
        );
        break;

      case "ended":
        logger.warn(`${this.prefix}:videoEnded`, {
          ...logData,
          message: "動画再生が終了しました",
        });
        break;

      case "emptied":
        logger.warn(`${this.prefix}:videoEmptied`, {
          ...logData,
          message: "動画要素が空になりました（src変更の可能性）",
        });
        break;

      case "seeking":
        logger.warn(`${this.prefix}:seeking`, {
          ...logData,
          from: this.lastCurrentTime,
          to: video.currentTime,
          diff: (video.currentTime - this.lastCurrentTime).toFixed(2),
        });
        break;
    }
  }

  private setupCurrentTimeWatcher(): void {
    // currentTimeの直接変更を検出するためのProxy（可能な場合）
    const originalCurrentTimeDescriptor = Object.getOwnPropertyDescriptor(
      HTMLMediaElement.prototype,
      "currentTime",
    );

    if (!originalCurrentTimeDescriptor?.set) {
      logger.warn(`${this.prefix}:currentTimeWatcher:unsupported`);
      return;
    }

    // Note: このアプローチは全てのvideoタグに影響するため、
    // より安全な方法としてはMutationObserverやsetIntervalを使う方が良い
    logger.debug(`${this.prefix}:currentTimeWatcher:setup`);
  }

  logManualSeek(from: number, to: number, reason: string): void {
    if (!this.isEnabled) {
      return;
    }

    logger.warn(`${this.prefix}:manualSeek`, {
      from: from.toFixed(2),
      to: to.toFixed(2),
      diff: (to - from).toFixed(2),
      reason,
      stackTrace: new Error().stack,
    });
  }

  private getVideoSource(video: HTMLVideoElement): string | null {
    const cur =
      typeof video.currentSrc === "string" ? video.currentSrc : "";
    if (cur.length > 0) {
      // URLの長さが100文字を超える場合は短縮
      return cur.length > 100 ? `${cur.slice(0, 100)}...` : cur;
    }
    const attr = video.getAttribute("src") ?? "";
    if (attr.length > 0) {
      return attr.length > 100 ? `${attr.slice(0, 100)}...` : attr;
    }
    return null;
  }
}

// シングルトンインスタンス
let globalVideoEventLogger: VideoEventLogger | null = null;

export function getGlobalVideoEventLogger(): VideoEventLogger {
  if (!globalVideoEventLogger) {
    globalVideoEventLogger = new VideoEventLogger("global");
  }
  return globalVideoEventLogger;
}

