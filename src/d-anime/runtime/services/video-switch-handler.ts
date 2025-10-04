import { SettingsManager } from "../../services/settings-manager";
import type { VideoMetadata } from "@/shared/types";
import { NotificationManager } from "../notification-manager";
import { CommentRenderer } from "../comment-renderer";
import type {
  FetcherCommentResult,
  NicoApiFetcher,
  NicoApiResponseBody,
} from "./nico-api-fetcher";
import { DebounceExecutor } from "../utils/debounce-executor";

const MONITOR_INTERVAL_MS = 1000;
const PRELOAD_DEBOUNCE_MS = 100;
const END_THRESHOLD_SECONDS = 30;

const WATCH_DESCRIPTION_PATTERN = /watch\/(?:([a-z]{2}))?(\d+)/gi;

type Nullable<T> = T | null;

const toVideoMetadata = (
  apiData: NicoApiResponseBody | null,
): VideoMetadata | null => {
  if (!apiData?.video) {
    return null;
  }

  const registeredAt = apiData.video.registeredAt;
  const postedAt = registeredAt
    ? new Date(registeredAt).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : undefined;

  return {
    videoId: apiData.video.id,
    title: apiData.video.title,
    viewCount: apiData.video.count?.view,
    mylistCount: apiData.video.count?.mylist,
    commentCount: apiData.video.count?.comment,
    postedAt,
    thumbnail: apiData.video.thumbnail?.url,
    owner: apiData.owner ?? null,
    channel: apiData.channel ?? null,
  };
};

const extractVideoIdCandidates = (description: string): string[] => {
  const matches: string[] = [];
  let result: RegExpExecArray | null;
  while ((result = WATCH_DESCRIPTION_PATTERN.exec(description)) !== null) {
    const [, prefix = "", numberPart = ""] = result;
    if (!numberPart) {
      continue;
    }
    matches.push(`${prefix}${numberPart}`);
  }
  return matches;
};

export class VideoSwitchHandler {
  private nextVideoId: Nullable<string> = null;
  private preloadedComments: Nullable<FetcherCommentResult[]> = null;
  private lastPreloadedComments: Nullable<FetcherCommentResult[]> = null;
  private lastVideoId: Nullable<string> = null;
  private checkIntervalId: number | null = null;
  private isSwitching = false;
  private readonly debounce: DebounceExecutor;

  constructor(
    private readonly renderer: CommentRenderer,
    private readonly fetcher: NicoApiFetcher,
    private readonly settingsManager: SettingsManager,
    private readonly monitorInterval = MONITOR_INTERVAL_MS,
    debounceDelay = PRELOAD_DEBOUNCE_MS,
  ) {
    this.debounce = new DebounceExecutor(debounceDelay);
  }

  startMonitoring(): void {
    this.stopMonitoring();
    this.checkIntervalId = window.setInterval(() => {
      void this.checkVideoEnd();
    }, this.monitorInterval);
  }

  stopMonitoring(): void {
    if (this.checkIntervalId) {
      window.clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
  }

  async onVideoSwitch(videoElement: HTMLVideoElement | null): Promise<void> {
    if (this.isSwitching) {
      return;
    }
    this.isSwitching = true;

    try {
      const backupPreloaded =
        this.preloadedComments ?? this.lastPreloadedComments ?? null;
      const elementId =
        videoElement?.dataset?.videoId ??
        videoElement?.getAttribute?.("data-video-id") ??
        null;
      const videoId = this.nextVideoId ?? elementId ?? this.lastVideoId;

      if (!videoElement || (!videoId && !backupPreloaded)) {
        this.handleMissingVideoInfo(backupPreloaded);
        return;
      }

      NotificationManager.show("動画の切り替わりを検知しました...", "info");

      let apiData: NicoApiResponseBody | null = null;
      if (videoId) {
        apiData = await this.fetchVideoApiData(videoId, backupPreloaded);
        if (apiData) {
          this.persistVideoMetadata(apiData);
          this.lastVideoId = videoId;
        }
      }

      this.renderer.clearComments();

      const loadedCount = await this.populateComments(videoId, backupPreloaded);
      if (loadedCount === 0) {
        NotificationManager.show("コメントを取得できませんでした", "warning");
      }

      this.nextVideoId = null;
      this.preloadedComments = null;

      if (apiData) {
        const metadata = toVideoMetadata(apiData);
        if (metadata) {
          const message = `コメントソースを更新しました: ${metadata.title ?? "不明なタイトル"}（${loadedCount}件）`;
          NotificationManager.show(
            message,
            loadedCount > 0 ? "success" : "warning",
          );
        }
      }
    } catch (error) {
      console.error(
        "[VideoSwitchHandler] 動画切り替え中にエラーが発生しました",
        error,
      );
      NotificationManager.show(
        `動画切り替えエラー: ${(error as Error).message}`,
        "error",
      );
      this.renderer.clearComments();
    } finally {
      this.isSwitching = false;
    }
  }

  private async checkVideoEnd(): Promise<void> {
    const video = this.renderer.getVideoElement();
    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    const remaining = video.duration - video.currentTime;
    if (remaining > END_THRESHOLD_SECONDS) {
      return;
    }

    if (!this.nextVideoId) {
      const throttledFind = async () => {
        await this.findNextVideoId();
      };
      this.debounce.execOnce(throttledFind);
    }

    if (this.nextVideoId && !this.preloadedComments) {
      const throttledPreload = async () => {
        await this.preloadComments();
      };
      this.debounce.execOnce(throttledPreload);
    }
  }

  private handleMissingVideoInfo(
    backupPreloaded: Nullable<FetcherCommentResult[]>,
  ): void {
    if (!backupPreloaded) {
      this.renderer.clearComments();
      NotificationManager.show(
        "次の動画のコメントを取得できませんでした。コメント表示をクリアします。",
        "warning",
      );
    }
  }

  private async fetchVideoApiData(
    videoId: string,
    backupPreloaded: Nullable<FetcherCommentResult[]>,
  ): Promise<NicoApiResponseBody | null> {
    try {
      return await this.fetcher.fetchApiData(videoId);
    } catch (error) {
      console.error("[VideoSwitchHandler] API取得エラー", error);
      if (!backupPreloaded) {
        throw error;
      }
      return null;
    }
  }

  private persistVideoMetadata(apiData: NicoApiResponseBody): void {
    const metadata = toVideoMetadata(apiData);
    if (!metadata) {
      return;
    }
    this.settingsManager.saveVideoData(metadata.title ?? "", metadata);
  }

  private async populateComments(
    videoId: Nullable<string>,
    backupPreloaded: Nullable<FetcherCommentResult[]>,
  ): Promise<number> {
    let comments: FetcherCommentResult[] | null = null;

    if (Array.isArray(backupPreloaded) && backupPreloaded.length > 0) {
      comments = backupPreloaded;
    } else if (videoId) {
      try {
        comments = await this.fetcher.fetchAllData(videoId);
      } catch (error) {
        console.error("[VideoSwitchHandler] コメント取得エラー", error);
        NotificationManager.show(
          `コメント取得エラー: ${(error as Error).message}`,
          "error",
        );
        comments = null;
      }
    }

    if (!comments || comments.length === 0) {
      return 0;
    }

    const filtered = comments.filter(
      (comment) => !this.renderer.isNGComment(comment.text),
    );
    filtered.forEach((comment) => {
      this.renderer.addComment(comment.text, comment.vpos, comment.commands);
    });

    this.lastPreloadedComments = [...filtered];
    return filtered.length;
  }

  private async findNextVideoId(): Promise<void> {
    try {
      const apiData = this.fetcher.lastApiData;
      if (!apiData) {
        return;
      }

      const nextId = apiData.series?.video?.next?.id;
      if (nextId) {
        this.nextVideoId = nextId;
        return;
      }

      const description = apiData.video?.description ?? "";
      if (!description) {
        return;
      }

      const candidates = extractVideoIdCandidates(description);
      if (candidates.length === 0) {
        return;
      }

      const sorted = [...candidates].sort((a, b) => {
        const numA = parseInt(a.replace(/^[a-z]{2}/i, ""), 10) || 0;
        const numB = parseInt(b.replace(/^[a-z]{2}/i, ""), 10) || 0;
        return numB - numA;
      });

      this.nextVideoId = sorted[0] ?? null;
    } catch (error) {
      console.error("[VideoSwitchHandler] 次の動画ID取得エラー", error);
    }
  }

  private async preloadComments(): Promise<void> {
    if (!this.nextVideoId) {
      return;
    }

    try {
      const comments = await this.fetcher.fetchAllData(this.nextVideoId);
      const filtered = comments.filter(
        (comment) => !this.renderer.isNGComment(comment.text),
      );
      this.preloadedComments = filtered.length > 0 ? filtered : null;
    } catch (error) {
      console.error("[VideoSwitchHandler] コメントプリロードエラー", error);
      this.preloadedComments = null;
    }
  }
}
