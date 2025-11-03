import { createLogger } from "@/shared/logger";
import type { PlaybackSettings } from "@/shared/types";
import { SettingsManager } from "../../services/settings-manager";

const logger = createLogger("dAnime:PlaybackRateController");
const DEFAULT_PLAYBACK_RATE = 1;
const APPLY_RETRY_DELAY_MS = 200;
const RATE_EPSILON = 0.0001;

export class PlaybackRateController {
  private currentVideo: HTMLVideoElement | null = null;
  private playbackSettings: PlaybackSettings;
  private readonly settingsObserver: (settings: PlaybackSettings) => void;
  private isApplying = false;
  private retryTimer: number | null = null;

  private readonly handleLoadedMetadata = (): void => {
    this.applyCurrentMode();
  };

  private readonly handleRateChange = (): void => {
    if (this.isApplying) {
      return;
    }
    if (!this.playbackSettings.fixedModeEnabled) {
      return;
    }
    this.scheduleApply();
  };

  private readonly handlePlay = (): void => {
    this.applyCurrentMode();
  };

  private readonly handleEmptied = (): void => {
    this.scheduleApply();
  };

  constructor(private readonly settingsManager: SettingsManager) {
    this.playbackSettings = this.settingsManager.getPlaybackSettings();
    this.settingsObserver = (settings) => {
      this.playbackSettings = settings;
      this.applyCurrentMode();
    };
    this.settingsManager.addPlaybackObserver(this.settingsObserver);
  }

  bind(video: HTMLVideoElement): void {
    if (this.currentVideo === video) {
      this.applyCurrentMode();
      return;
    }

    this.detachVideoListeners();
    this.cancelScheduledApply();
    this.currentVideo = video;
    this.attachVideoListeners(video);
    this.applyCurrentMode();
  }

  unbind(): void {
    this.cancelScheduledApply();
    this.detachVideoListeners();
    this.currentVideo = null;
  }

  dispose(): void {
    this.unbind();
    this.settingsManager.removePlaybackObserver(this.settingsObserver);
  }

  private attachVideoListeners(video: HTMLVideoElement): void {
    video.addEventListener("loadedmetadata", this.handleLoadedMetadata);
    video.addEventListener("ratechange", this.handleRateChange);
    video.addEventListener("play", this.handlePlay);
    video.addEventListener("emptied", this.handleEmptied);
  }

  private detachVideoListeners(): void {
    if (!this.currentVideo) {
      return;
    }
    this.currentVideo.removeEventListener(
      "loadedmetadata",
      this.handleLoadedMetadata,
    );
    this.currentVideo.removeEventListener("ratechange", this.handleRateChange);
    this.currentVideo.removeEventListener("play", this.handlePlay);
    this.currentVideo.removeEventListener("emptied", this.handleEmptied);
  }

  private applyCurrentMode(): void {
    const video = this.currentVideo;
    if (!video) {
      return;
    }

    if (this.playbackSettings.fixedModeEnabled) {
      this.setPlaybackRate(video, this.playbackSettings.fixedRate);
    } else {
      this.setPlaybackRate(video, DEFAULT_PLAYBACK_RATE);
    }
  }

  private setPlaybackRate(video: HTMLVideoElement, rate: number): void {
    if (!Number.isFinite(rate) || rate <= 0) {
      return;
    }
    if (Math.abs(video.playbackRate - rate) <= RATE_EPSILON) {
      return;
    }

    this.isApplying = true;
    try {
      video.playbackRate = rate;
    } catch (error) {
      logger.warn("再生速度の設定に失敗しました", error);
      this.scheduleApply();
    } finally {
      window.setTimeout(() => {
        this.isApplying = false;
      }, 0);
    }
  }

  private scheduleApply(): void {
    this.cancelScheduledApply();
    this.retryTimer = window.setTimeout(() => {
      this.retryTimer = null;
      this.applyCurrentMode();
    }, APPLY_RETRY_DELAY_MS);
  }

  private cancelScheduledApply(): void {
    if (this.retryTimer !== null) {
      window.clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }
}
