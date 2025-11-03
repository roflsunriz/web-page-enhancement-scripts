import { GM_getValue, GM_setValue } from "$";
import { cloneDefaultSettings } from "../config/default-settings";
import type {
  PlaybackSettings,
  RendererSettings,
  VideoMetadata,
} from "@/shared/types";
import type { Notifier, NotificationType } from "./notification";

const SETTINGS_STORAGE_KEY = "settings";
const VIDEO_STORAGE_KEY = "currentVideo";
const LAST_DANIME_IDS_KEY = "lastDanimeIds";
const PLAYBACK_SETTINGS_KEY = "playbackSettings";

type SettingsObserver = (settings: RendererSettings) => void;
type PlaybackSettingsObserver = (settings: PlaybackSettings) => void;

const cloneSettings = (settings: RendererSettings): RendererSettings => ({
  ...settings,
  ngWords: [...settings.ngWords],
  ngRegexps: [...settings.ngRegexps],
});

const DEFAULT_PLAYBACK_SETTINGS: PlaybackSettings = {
  fixedModeEnabled: false,
  fixedRate: 1.11,
};

const clonePlaybackSettings = (
  settings: PlaybackSettings,
): PlaybackSettings => ({
  fixedModeEnabled: settings.fixedModeEnabled,
  fixedRate: settings.fixedRate,
});

export class SettingsManager {
  private settings: RendererSettings;
  private currentVideo: VideoMetadata | null;
  private readonly observers = new Set<SettingsObserver>();
  private playbackSettings: PlaybackSettings;
  private readonly playbackObservers = new Set<PlaybackSettingsObserver>();

  constructor(private readonly notifier?: Notifier) {
    this.settings = cloneDefaultSettings();
    this.currentVideo = null;
    this.loadSettings();
    this.currentVideo = this.loadVideoData();
    this.playbackSettings = clonePlaybackSettings(DEFAULT_PLAYBACK_SETTINGS);
    this.loadPlaybackSettings();
  }

  getSettings(): RendererSettings {
    return cloneSettings(this.settings);
  }

  loadSettings(): RendererSettings {
    try {
      const stored = GM_getValue<RendererSettings | string | null>(
        SETTINGS_STORAGE_KEY,
        null,
      );
      if (!stored) {
        this.settings = cloneDefaultSettings();
        return this.settings;
      }

      if (typeof stored === "string") {
        const parsed = JSON.parse(stored) as Partial<RendererSettings>;
        this.settings = {
          ...cloneDefaultSettings(),
          ...parsed,
          ngWords: Array.isArray(parsed?.ngWords) ? [...parsed.ngWords] : [],
          ngRegexps: Array.isArray(parsed?.ngRegexps)
            ? [...parsed.ngRegexps]
            : [],
        };
      } else {
        this.settings = {
          ...cloneDefaultSettings(),
          ...stored,
          ngWords: Array.isArray(stored.ngWords) ? [...stored.ngWords] : [],
          ngRegexps: Array.isArray(stored.ngRegexps)
            ? [...stored.ngRegexps]
            : [],
        };
      }

      this.notifyObservers();
      return this.settings;
    } catch (error) {
      console.error("[SettingsManager] 設定の読み込みに失敗しました", error);
      this.notify("設定の読み込みに失敗しました", "error");
      this.settings = cloneDefaultSettings();
      return this.settings;
    }
  }

  getPlaybackSettings(): PlaybackSettings {
    return clonePlaybackSettings(this.playbackSettings);
  }

  loadPlaybackSettings(): PlaybackSettings {
    try {
      const stored = GM_getValue<PlaybackSettings | string | null>(
        PLAYBACK_SETTINGS_KEY,
        null,
      );
      if (!stored) {
        this.playbackSettings = clonePlaybackSettings(DEFAULT_PLAYBACK_SETTINGS);
        this.notifyPlaybackObservers();
        return this.playbackSettings;
      }

      if (typeof stored === "string") {
        const parsed = JSON.parse(stored) as Partial<PlaybackSettings>;
        this.playbackSettings = {
          fixedModeEnabled:
            typeof parsed.fixedModeEnabled === "boolean"
              ? parsed.fixedModeEnabled
              : DEFAULT_PLAYBACK_SETTINGS.fixedModeEnabled,
          fixedRate:
            typeof parsed.fixedRate === "number"
              ? parsed.fixedRate
              : DEFAULT_PLAYBACK_SETTINGS.fixedRate,
        };
      } else {
        this.playbackSettings = {
          fixedModeEnabled: stored.fixedModeEnabled,
          fixedRate: stored.fixedRate,
        };
      }
      this.notifyPlaybackObservers();
      return this.playbackSettings;
    } catch (error) {
      console.error(
        "[SettingsManager] 再生設定の読み込みに失敗しました",
        error,
      );
      this.notify("再生設定の読み込みに失敗しました", "error");
      this.playbackSettings = clonePlaybackSettings(DEFAULT_PLAYBACK_SETTINGS);
      this.notifyPlaybackObservers();
      return this.playbackSettings;
    }
  }

  updatePlaybackSettings(
    newSettings: Partial<PlaybackSettings>,
  ): boolean {
    this.playbackSettings = {
      ...this.playbackSettings,
      ...newSettings,
    };
    return this.savePlaybackSettings();
  }

  private savePlaybackSettings(): boolean {
    try {
      GM_setValue(
        PLAYBACK_SETTINGS_KEY,
        JSON.stringify(this.playbackSettings),
      );
      this.notifyPlaybackObservers();
      return true;
    } catch (error) {
      console.error(
        "[SettingsManager] 再生設定の保存に失敗しました",
        error,
      );
      this.notify("再生設定の保存に失敗しました", "error");
      return false;
    }
  }

  saveSettings(): boolean {
    try {
      GM_setValue(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      this.notifyObservers();
      this.notify("設定を保存しました", "success");
      return true;
    } catch (error) {
      console.error("[SettingsManager] 設定の保存に失敗しました", error);
      this.notify("設定の保存に失敗しました", "error");
      return false;
    }
  }

  updateSettings(newSettings: Partial<RendererSettings>): boolean {
    this.settings = {
      ...this.settings,
      ...newSettings,
      ngWords: newSettings.ngWords
        ? [...newSettings.ngWords]
        : [...this.settings.ngWords],
      ngRegexps: newSettings.ngRegexps
        ? [...newSettings.ngRegexps]
        : [...this.settings.ngRegexps],
    };
    return this.saveSettings();
  }

  addObserver(observer: SettingsObserver): void {
    this.observers.add(observer);
  }

  removeObserver(observer: SettingsObserver): void {
    this.observers.delete(observer);
  }

  addPlaybackObserver(observer: PlaybackSettingsObserver): void {
    this.playbackObservers.add(observer);
    try {
      observer(this.getPlaybackSettings());
    } catch (error) {
      console.error("[SettingsManager] 再生設定の登録通知でエラー", error);
    }
  }

  removePlaybackObserver(observer: PlaybackSettingsObserver): void {
    this.playbackObservers.delete(observer);
  }

  private notifyObservers(): void {
    const snapshot = this.getSettings();
    for (const observer of this.observers) {
      try {
        observer(snapshot);
      } catch (error) {
        console.error("[SettingsManager] 設定変更通知でエラー", error);
      }
    }
  }

  private notifyPlaybackObservers(): void {
    const snapshot = this.getPlaybackSettings();
    for (const observer of this.playbackObservers) {
      try {
        observer(snapshot);
      } catch (error) {
        console.error("[SettingsManager] 再生設定通知でエラー", error);
      }
    }
  }

  loadVideoData(): VideoMetadata | null {
    try {
      const videoData = GM_getValue<VideoMetadata | null>(
        VIDEO_STORAGE_KEY,
        null,
      );
      return videoData ?? null;
    } catch (error) {
      console.error(
        "[SettingsManager] 動画データの読み込みに失敗しました",
        error,
      );
      this.notify("動画データの読み込みに失敗しました", "error");
      return null;
    }
  }

  saveVideoData(_title: string, videoInfo: VideoMetadata): boolean {
    try {
      const videoData: VideoMetadata = {
        videoId: videoInfo.videoId,
        title: videoInfo.title,
        viewCount: videoInfo.viewCount,
        commentCount: videoInfo.commentCount,
        mylistCount: videoInfo.mylistCount,
        postedAt: videoInfo.postedAt,
        thumbnail: videoInfo.thumbnail,
        owner: videoInfo.owner ?? null,
        channel: videoInfo.channel ?? null,
      };
      GM_setValue(VIDEO_STORAGE_KEY, videoData);
      this.currentVideo = videoData;
      return true;
    } catch (error) {
      console.error("[SettingsManager] 動画データの保存に失敗しました", error);
      this.notify("動画データの保存に失敗しました", "error");
      return false;
    }
  }

  getCurrentVideo(): VideoMetadata | null {
    return this.currentVideo ? { ...this.currentVideo } : null;
  }

  // --- 追加: dアニメの厳密な識別 (workId, partId) の保存/復元 ---
  saveLastDanimeIds(ids: { workId: string; partId: string }): boolean {
    try {
      GM_setValue(LAST_DANIME_IDS_KEY, ids);
      return true;
    } catch (e) {
      console.error("[SettingsManager] saveLastDanimeIds failed", e);
      this.notify("ID情報の保存に失敗しました", "error");
      return false;
    }
  }

  loadLastDanimeIds(): { workId: string; partId: string } | null {
    try {
      const ids = GM_getValue<{ workId: string; partId: string } | null>(
        LAST_DANIME_IDS_KEY,
        null,
      );
      return ids ?? null;
    } catch (e) {
      console.error("[SettingsManager] loadLastDanimeIds failed", e);
      this.notify("ID情報の読込に失敗しました", "error");
      return null;
    }
  }

  private notify(message: string, type: NotificationType = "info"): void {
    this.notifier?.show(message, type);
  }
}
