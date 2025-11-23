import { SettingsManager } from "@/d-anime/services/settings-manager";
import type { VideoMetadata } from "@/shared/types";
import { NotificationManager } from "@/d-anime/services/notification-manager";
import { CommentRenderer } from "@/d-anime/comments/comment-renderer";
import { createLogger } from "@/shared/logger";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";
import type {
  FetcherCommentResult,
  NicoApiFetcher,
  NicoApiResponseBody,
} from "@/d-anime/services/nico-api-fetcher";
import { DebounceExecutor } from "@/d-anime/utils/debounce-executor";
import { VideoEventLogger } from "@/d-anime/debug/video-event-logger";

const MONITOR_INTERVAL_MS = 1000;
const PRELOAD_DEBOUNCE_MS = 100;
const END_THRESHOLD_SECONDS = 30;
const VIDEO_WAIT_TIMEOUT_MS = 10000;
const VIDEO_WAIT_INTERVAL_MS = 100;

const WATCH_DESCRIPTION_PATTERN = /watch\/(?:([a-z]{2}))?(\d+)/gi;

const logger = createLogger("dAnime:VideoSwitchHandler");

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
  private lastVideoSource: Nullable<string> = null;
  private checkIntervalId: number | null = null;
  private isSwitching = false;
  private readonly debounce: DebounceExecutor;
  private readonly videoEventLogger: VideoEventLogger;

  constructor(
    private readonly renderer: CommentRenderer,
    private readonly fetcher: NicoApiFetcher,
    private readonly settingsManager: SettingsManager,
    private readonly monitorInterval = MONITOR_INTERVAL_MS,
    debounceDelay = PRELOAD_DEBOUNCE_MS,
  ) {
    this.debounce = new DebounceExecutor(debounceDelay);
    this.videoEventLogger = new VideoEventLogger("VideoSwitchHandler");
  }

  /**
   * lastVideoSourceをリセットして次回の切り替えを強制的に新規動画として扱う
   */
  resetVideoSource(): void {
    logger.info("videoSwitch:resetVideoSource", {
      previousSource: this.lastVideoSource,
    });
    this.lastVideoSource = null;
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
      logger.warn("videoSwitch:alreadySwitching", {
        timestamp: Date.now(),
      });
      return;
    }
    this.isSwitching = true;

    try {
      logger.warn("videoSwitch:entry", {
        videoElementProvided: !!videoElement,
        currentRendererComments: this.renderer.getCommentsSnapshot().length,
        lastVideoId: this.lastVideoId,
        nextVideoId: this.nextVideoId,
        lastVideoSource: this.lastVideoSource,
        rendererVideoElement: this.renderer.getVideoElement() ? "attached" : "detached",
        rendererVideoSrc: this.renderer.getCurrentVideoSource(),
        sampleCurrentComments: this.renderer.getCommentsSnapshot().slice(0, 3).map(c => ({
          text: c.text?.substring(0, 30),
          vposMs: c.vposMs,
        })),
      });

      const resolvedVideoElement =
        (await this.resolveVideoElement(videoElement)) ?? null;

      const backupPreloaded =
        this.preloadedComments ?? this.lastPreloadedComments ?? null;
      const elementId =
        resolvedVideoElement?.dataset?.videoId ??
        resolvedVideoElement?.getAttribute?.("data-video-id") ??
        null;
      const videoId = this.nextVideoId ?? elementId ?? this.lastVideoId;

      logger.warn("videoSwitch:videoIdResolution", {
        videoId: videoId ?? null,
        nextVideoId: this.nextVideoId,
        elementId,
        lastVideoId: this.lastVideoId,
        hasBackupPreloaded: !!backupPreloaded,
        backupPreloadedCount: backupPreloaded?.length ?? 0,
      });

      if (!resolvedVideoElement || (!videoId && !backupPreloaded)) {
        logger.warn("videoSwitch:earlyReturn", {
          reason: !resolvedVideoElement ? "no video element" : "no videoId and no backup",
          hasVideoElement: !!resolvedVideoElement,
          hasVideoId: !!videoId,
          hasBackupPreloaded: !!backupPreloaded,
        });
        this.handleMissingVideoInfo(backupPreloaded);
        return;
      }

      logger.warn("videoSwitch:start", {
        videoId: videoId ?? null,
        elementVideoId: resolvedVideoElement.dataset?.videoId ?? null,
        preloadedCount: backupPreloaded?.length ?? 0,
        currentTime: resolvedVideoElement.currentTime,
        duration: resolvedVideoElement.duration,
        readyState: resolvedVideoElement.readyState,
        currentSrc: resolvedVideoElement.currentSrc,
        lastVideoSource: this.lastVideoSource,
      });

      NotificationManager.show("動画の切り替わりを検知しました...", "info");

      // イベントロガーをアタッチ
      this.videoEventLogger.attach(resolvedVideoElement);

      this.resetRendererState(resolvedVideoElement);

      const currentVideo = this.renderer.getVideoElement();
      if (currentVideo !== resolvedVideoElement && resolvedVideoElement) {
        logger.debug("videoSwitch:rebind", {
          previousSrc: this.renderer.getCurrentVideoSource(),
          newSrc:
            (typeof resolvedVideoElement.currentSrc === "string" &&
              resolvedVideoElement.currentSrc.length > 0)
              ? resolvedVideoElement.currentSrc
              : resolvedVideoElement.getAttribute("src") ?? null,
        });
        this.renderer.initialize(resolvedVideoElement);
      } else if (
        currentVideo === resolvedVideoElement &&
        resolvedVideoElement &&
        this.hasVideoSourceChanged(resolvedVideoElement)
      ) {
        logger.debug("videoSwitch:rebind:sameElement", {
          previousSrc: this.lastVideoSource ?? null,
          newSrc: this.getVideoSource(resolvedVideoElement),
        });
        this.renderer.clearComments();
        this.renderer.destroy();
        this.renderer.initialize(resolvedVideoElement);
      } else if (!currentVideo && !resolvedVideoElement) {
        logger.warn("videoSwitch:missingVideoElement", {
          lastVideoId: this.lastVideoId,
          nextVideoId: this.nextVideoId,
        });
        this.isSwitching = false;
        return;
      }

      let apiData: NicoApiResponseBody | null = null;
      if (videoId) {
        apiData = await this.fetchVideoApiData(videoId, backupPreloaded);
        if (apiData) {
          this.persistVideoMetadata(apiData);
          this.lastVideoId = videoId;
        }
      }

      const loadedCount = await this.populateComments(videoId, backupPreloaded);
      if (loadedCount === 0) {
        this.renderer.clearComments();
        NotificationManager.show("コメントを取得できませんでした", "warning");
        logger.warn("videoSwitch:commentsMissing", {
          videoId: videoId ?? null,
        });
      } else {
        logger.warn("videoSwitch:commentsLoaded", {
          videoId: videoId ?? null,
          count: loadedCount,
        });
      }

      this.nextVideoId = null;
      this.preloadedComments = null;
      this.lastVideoSource = this.getVideoSource(resolvedVideoElement);

      const finalComments = this.renderer.getCommentsSnapshot();
      logger.warn("videoSwitch:complete", {
        videoId: videoId ?? null,
        finalTime: resolvedVideoElement.currentTime,
        loadedCount,
        finalCommentsCount: finalComments.length,
        rendererVideoSrc: this.renderer.getCurrentVideoSource(),
        sampleFinalComments: finalComments.slice(0, 5).map(c => ({
          text: c.text?.substring(0, 30),
          vposMs: c.vposMs,
          vposSec: (c.vposMs / 1000).toFixed(2),
        })),
      });

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
      logger.error("videoSwitch:error", error as Error, {
        nextVideoId: this.nextVideoId,
        lastVideoId: this.lastVideoId,
      });
      NotificationManager.show(
        `動画切り替えエラー: ${(error as Error).message}`,
        "error",
      );
      this.renderer.clearComments();
    } finally {
      this.isSwitching = false;
    }
  }

  private async resolveVideoElement(
    videoElement: HTMLVideoElement | null,
  ): Promise<HTMLVideoElement | null> {
    if (videoElement) {
      const currentSrc = this.getVideoSource(videoElement);
      const previousSrc = this.lastVideoSource;
      if (!currentSrc || currentSrc === previousSrc) {
        await this.waitForSourceChange(videoElement);
      }
      return videoElement;
    }

    const deadline = Date.now() + VIDEO_WAIT_TIMEOUT_MS;
    let latestElement: HTMLVideoElement | null = null;

    while (Date.now() < deadline) {
      const candidate = document.querySelector<HTMLVideoElement>(
        DANIME_SELECTORS.watchVideoElement,
      );
      if (candidate) {
        latestElement = candidate;
        const sourceChanged = this.hasVideoSourceChanged(candidate);
        if (candidate.readyState >= 2 || !candidate.paused || sourceChanged) {
          if (sourceChanged) {
            this.lastVideoSource = null;
          }
          return candidate;
        }
      }
      await new Promise((resolve) =>
        window.setTimeout(resolve, VIDEO_WAIT_INTERVAL_MS),
      );
    }

    return latestElement;
  }

  private async waitForSourceChange(
    videoElement: HTMLVideoElement,
  ): Promise<void> {
    const initialSource = this.getVideoSource(videoElement);
    if (!initialSource) {
      return;
    }

    const deadline = Date.now() + VIDEO_WAIT_TIMEOUT_MS;

    while (Date.now() < deadline) {
      const currentSource = this.getVideoSource(videoElement);
      if (currentSource && currentSource !== initialSource) {
        this.lastVideoSource = null;
        return;
      }
      await new Promise((resolve) =>
        window.setTimeout(resolve, VIDEO_WAIT_INTERVAL_MS),
      );
    }
  }

  private hasVideoSourceChanged(videoElement: HTMLVideoElement): boolean {
    const currentSource = this.getVideoSource(videoElement);
    if (!currentSource) {
      return false;
    }
    if (!this.lastVideoSource) {
      return true;
    }
    return this.lastVideoSource !== currentSource;
  }

  private getVideoSource(videoElement: HTMLVideoElement): string | null {
    if (!videoElement) {
      return null;
    }
    // Firefox では src=null 期間や currentSrc 解決前があるため順にフォールバック
    const cur =
      typeof videoElement.currentSrc === "string" ? videoElement.currentSrc : "";
    if (cur.length > 0) return cur;
    const attr = videoElement.getAttribute("src") ?? "";
    if (attr.length > 0) return attr;
    const sourceEl = videoElement.querySelector("source[src]") as HTMLSourceElement | null;
    if (sourceEl && typeof sourceEl.src === "string" && sourceEl.src.length > 0) {
      return sourceEl.src;
    }
    return null;
  }

  private resetRendererState(videoElement: HTMLVideoElement): void {
    const beforeTime = videoElement.currentTime;
    const currentSource = this.getVideoSource(videoElement);
    const sourceChanged = this.lastVideoSource !== currentSource;
    const commentsBeforeClear = this.renderer.getCommentsSnapshot().length;

    logger.warn("videoSwitch:resetRendererState:before", {
      currentTime: beforeTime,
      duration: videoElement.duration,
      src: currentSource,
      lastSrc: this.lastVideoSource ?? null,
      sourceChanged,
      readyState: videoElement.readyState,
      paused: videoElement.paused,
      commentsCount: commentsBeforeClear,
    });

    // 動画ソースが実際に変わった場合のみcurrentTimeをリセット
    // これにより、同じ動画での誤発火による10秒巻き戻しバグを防ぐ
    if (sourceChanged) {
      try {
        this.videoEventLogger.logManualSeek(
          beforeTime,
          0,
          "resetRendererState: video source changed",
        );
        videoElement.currentTime = 0;
        logger.warn("videoSwitch:resetRendererState:seeked", {
          currentTime: videoElement.currentTime,
          timeDiff: videoElement.currentTime - beforeTime,
        });
      } catch (error) {
        logger.debug("videoSwitch:resetCurrentTimeFailed", error as Error);
      }
    } else {
      logger.warn("videoSwitch:resetRendererState:skipSeek", {
        reason: "same video source, skipping currentTime reset",
        currentTime: beforeTime,
        willClearComments: true,
      });
    }

    // コメントをクリア（エピソード切り替えの場合はコントローラー側でdestroy済み）
    logger.warn("videoSwitch:resetRendererState:clearingComments", {
      commentsBeforeClear,
      sourceChanged,
      currentVideoSrc: this.renderer.getCurrentVideoSource(),
    });
    
    this.renderer.clearComments();
    
    logger.warn("videoSwitch:resetRendererState:commentsCleared", {
      commentsAfterClear: this.renderer.getCommentsSnapshot().length,
      rendererVideoSrc: this.renderer.getCurrentVideoSource(),
    });
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
    logger.warn("videoSwitch:handleMissingVideoInfo", {
      hasBackupPreloaded: !!backupPreloaded,
      backupPreloadedCount: backupPreloaded?.length ?? 0,
      hasLastPreloadedComments: !!this.lastPreloadedComments,
      lastPreloadedCount: this.lastPreloadedComments?.length ?? 0,
      willClearComments: !backupPreloaded && !this.lastPreloadedComments,
    });

    // backupもlastPreloadedもない場合のみクリア
    // エピソード切り替え処理中はコメントを保持する
    if (!backupPreloaded && !this.lastPreloadedComments) {
      logger.warn("videoSwitch:clearingCommentsInMissingInfo", {
        currentCommentCount: this.renderer.getCommentsSnapshot().length,
      });
      this.renderer.clearComments();
      NotificationManager.show(
        "次の動画のコメントを取得できませんでした。コメント表示をクリアします。",
        "warning",
      );
    } else {
      logger.info("videoSwitch:preservingComments", {
        reason: "backup or last preloaded comments available",
        currentCommentCount: this.renderer.getCommentsSnapshot().length,
      });
    }
  }

  private async fetchVideoApiData(
    videoId: string,
    backupPreloaded: Nullable<FetcherCommentResult[]>,
  ): Promise<NicoApiResponseBody | null> {
    try {
      const data = await this.fetcher.fetchApiData(videoId);
      logger.debug("videoSwitch:apiFetched", { videoId });
      return data;
    } catch (error) {
      logger.error("videoSwitch:apiFetchError", error as Error, { videoId });
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

    logger.warn("videoSwitch:populateComments:start", {
      videoId,
      backupPreloadedCount: backupPreloaded?.length ?? 0,
      hasBackupPreloaded: !!backupPreloaded,
    });

    if (Array.isArray(backupPreloaded) && backupPreloaded.length > 0) {
      comments = backupPreloaded;
      logger.warn("videoSwitch:populateComments:usingBackup", {
        count: comments.length,
      });
    } else if (videoId) {
      try {
        logger.warn("videoSwitch:populateComments:fetching", { videoId });
        comments = await this.fetcher.fetchAllData(videoId);
        logger.warn("videoSwitch:commentsFetched", {
          videoId,
          count: comments.length,
        });
      } catch (error) {
        logger.error("videoSwitch:commentsFetchError", error as Error, {
          videoId,
        });
        NotificationManager.show(
          `コメント取得エラー: ${(error as Error).message}`,
          "error",
        );
        comments = null;
      }
    }

    if (!comments || comments.length === 0) {
      logger.warn("videoSwitch:populateComments:noComments");
      return 0;
    }

    const filtered = comments.filter(
      (comment) => !this.renderer.isNGComment(comment.text),
    );
    
    logger.warn("videoSwitch:populateComments:addingToRenderer", {
      filteredCount: filtered.length,
      totalCount: comments.length,
      rendererCommentsBeforeAdd: this.renderer.getCommentsSnapshot().length,
      rendererVideoElement: this.renderer.getVideoElement() ? "attached" : "detached",
      rendererVideoSrc: this.renderer.getCurrentVideoSource(),
    });
    
    // コメントを1つずつ追加（最初の数件をログ出力）
    filtered.forEach((comment, index) => {
      this.renderer.addComment(comment.text, comment.vposMs, comment.commands);
      
      if (index < 3) {
        logger.warn(`videoSwitch:populateComments:addedComment[${index}]`, {
          text: comment.text.substring(0, 30),
          vposMs: comment.vposMs,
          vposSec: (comment.vposMs / 1000).toFixed(2),
          commands: comment.commands,
        });
      }
    });

    logger.warn("videoSwitch:populateComments:complete", {
      addedCount: filtered.length,
      rendererCommentsAfterAdd: this.renderer.getCommentsSnapshot().length,
      rendererVideoSrcAfterAdd: this.renderer.getCurrentVideoSource(),
      sampleComments: this.renderer.getCommentsSnapshot().slice(0, 3).map(c => ({
        text: c.text?.substring(0, 30),
        vposMs: c.vposMs,
      })),
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
        logger.debug("videoSwitch:detectedNext", { videoId: nextId });
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
      if (this.nextVideoId) {
        logger.debug("videoSwitch:candidateFromDescription", {
          candidate: this.nextVideoId,
        });
      }
    } catch (error) {
      logger.error("videoSwitch:nextIdError", error as Error, {
        lastVideoId: this.lastVideoId,
      });
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
      logger.debug("videoSwitch:preloaded", {
        videoId: this.nextVideoId,
        count: filtered.length,
      });
    } catch (error) {
      logger.error("videoSwitch:preloadError", error as Error, {
        videoId: this.nextVideoId,
      });
      this.preloadedComments = null;
    }
  }
}
