import { cloneDefaultSettings } from "@/d-anime/config/default-settings";
import { SettingsManager } from "@/d-anime/services/settings-manager";
import type { RendererSettings, VideoMetadata } from "@/shared/types";
import { NotificationManager } from "@/d-anime/services/notification-manager";
import { CommentRenderer } from "@/d-anime/comments/comment-renderer";
import { NicoApiFetcher } from "@/d-anime/services/nico-api-fetcher";
import { VideoSwitchHandler } from "@/d-anime/services/video-switch-handler";
import { PlaybackRateController } from "@/d-anime/services/playback-rate-controller";
import { DebounceExecutor } from "@/d-anime/utils/debounce-executor";
import type { DanimeGlobal } from "@/d-anime/globals";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";
import { createLogger } from "@/shared/logger";
import { getGlobalVideoEventLogger } from "@/d-anime/debug/video-event-logger";
import { NicoVideoSearcher } from "@/d-anime/services/nico-video-searcher";

const INITIALIZATION_RETRY_MS = 100;
const SWITCH_DEBOUNCE_MS = 1000;
const SWITCH_COOLDOWN_MS = 3000;
const PARTID_MONITOR_INTERVAL_MS = 2000;

const logger = createLogger("dAnime:WatchPageController");

export class WatchPageController {
  private initialized = false;
  private readonly switchDebounce = new DebounceExecutor(SWITCH_DEBOUNCE_MS);
  private switchCallback: (() => void) | null = null;
  private lastSwitchTimestamp = 0;
  private currentVideoElement: HTMLVideoElement | null = null;
  private videoMutationObserver: MutationObserver | null = null;
  private domMutationObserver: MutationObserver | null = null;
  private videoEndedListener: (() => void) | null = null;
  private playbackRateController: PlaybackRateController | null = null;
  private lastPartId: string | null = null;
  private partIdMonitorIntervalId: number | null = null;

  constructor(private readonly global: DanimeGlobal) {}

  async initialize(): Promise<void> {
    await this.ensureDocumentReady();
    this.waitForVideoElement();
  }

  private async ensureDocumentReady(): Promise<void> {
    if (document.readyState === "complete") {
      return;
    }

    await new Promise<void>((resolve) => {
      window.addEventListener("load", () => resolve(), { once: true });
    });
  }

  private waitForVideoElement(): void {
    if (this.initialized) {
      return;
    }

    const videoElement = document.querySelector<HTMLVideoElement>(
      DANIME_SELECTORS.watchVideoElement,
    );
    if (!videoElement) {
      window.setTimeout(
        () => this.waitForVideoElement(),
        INITIALIZATION_RETRY_MS,
      );
      return;
    }

    if (videoElement.readyState === 0) {
      videoElement.addEventListener(
        "loadedmetadata",
        () => {
          void this.initializeWithVideo(videoElement);
        },
        { once: true },
      );
      return;
    }

    void this.initializeWithVideo(videoElement);
  }

  private async initializeWithVideo(
    videoElement: HTMLVideoElement,
  ): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    try {
      NotificationManager.show("コメントローダーを初期化中...");

      const notifier = NotificationManager.getInstance();
      const settingsManager =
        this.global.settingsManager ?? new SettingsManager(notifier);
      this.global.settingsManager = settingsManager;
      this.global.instances.settingsManager = settingsManager;

      let videoData = settingsManager.loadVideoData();
      
      // 動画データがない場合は視聴ページから自動取得を試みる
      if (!videoData?.videoId) {
        logger.info("watchPageController:autoSetup", {
          reason: "videoData not found, attempting auto-setup",
        });
        
        const autoSetupSuccess = await this.autoSetupComments(settingsManager);
        
        if (autoSetupSuccess) {
          videoData = settingsManager.loadVideoData();
          logger.info("watchPageController:autoSetupSuccess", {
            videoId: videoData?.videoId,
          });
        } else {
          throw new Error(
            "動画データが見つかりません。視聴ページからの自動取得にも失敗しました。",
          );
        }
      }

      if (!videoData?.videoId) {
        throw new Error(
          "動画データが見つかりません。",
        );
      }

      const fetcher = new NicoApiFetcher();
      this.global.instances.fetcher = fetcher;

      await fetcher.fetchApiData(videoData.videoId);
      const comments = await fetcher.fetchComments();

      const settings = this.mergeSettings(settingsManager.loadSettings());
      const renderer = new CommentRenderer(settings);
      renderer.initialize(videoElement);
      this.global.instances.renderer = renderer;
      this.currentVideoElement = videoElement;

      const playbackRateController =
        this.playbackRateController ??
        new PlaybackRateController(settingsManager);
      this.playbackRateController = playbackRateController;
      this.global.instances.playbackRateController = playbackRateController;
      playbackRateController.bind(videoElement);

      settingsManager.addObserver((newSettings: RendererSettings) => {
        renderer.settings = this.mergeSettings(newSettings);
      });

      comments.forEach((comment) => {
        renderer.addComment(comment.text, comment.vposMs, comment.commands);
      });

      const switchHandler = new VideoSwitchHandler(
        renderer,
        fetcher,
        settingsManager,
      );
      switchHandler.startMonitoring();
      this.global.instances.switchHandler = switchHandler;

      this.setupSwitchHandling(videoElement, switchHandler);
      this.observeVideoElement();

      // partId監視を開始（エピソード切り替えの自動同期）
      this.startPartIdMonitoring();

      NotificationManager.show(
        `コメントの読み込みが完了しました（${comments.length}件）`,
        "success",
      );
    } catch (error) {
      this.initialized = false;
      NotificationManager.show(
        `初期化エラー: ${(error as Error).message}`,
        "error",
      );
      throw error;
    }
  }

  private mergeSettings(settings: RendererSettings): RendererSettings {
    const defaults = cloneDefaultSettings();
    return {
      ...defaults,
      ...settings,
      ngWords: [...(settings.ngWords ?? defaults.ngWords)],
      ngRegexps: [...(settings.ngRegexps ?? defaults.ngRegexps)],
    };
  }

  private setupSwitchHandling(
    videoElement: HTMLVideoElement,
    switchHandler: VideoSwitchHandler,
  ): void {
    this.currentVideoElement = videoElement;

    this.switchCallback = () => {
      const now = Date.now();
      if (now - this.lastSwitchTimestamp < SWITCH_COOLDOWN_MS) {
        logger.debug("watchPageController:switchCooldown", {
          timeSinceLastSwitch: now - this.lastSwitchTimestamp,
          cooldownMs: SWITCH_COOLDOWN_MS,
        });
        return;
      }
      this.lastSwitchTimestamp = now;
      const targetVideo = this.currentVideoElement;
      logger.info("watchPageController:switchHandlerTriggered", {
        currentTime: targetVideo?.currentTime ?? null,
        duration: targetVideo?.duration ?? null,
      });
      void switchHandler.onVideoSwitch(targetVideo);
    };

    this.global.utils.initializeWithVideo = async (video) => {
      if (!video) {
        return;
      }
      this.rebindVideoElement(video);
      this.playbackRateController?.bind(video);
      await switchHandler.onVideoSwitch(video);
    };

    this.currentVideoElement = videoElement;
  }

  private observeVideoElement(): void {
    const videoElement = this.currentVideoElement;
    if (!videoElement) {
      return;
    }

    this.domMutationObserver?.disconnect();

    this.domMutationObserver = new MutationObserver(() => {
      const nextVideo = document.querySelector<HTMLVideoElement>(
        DANIME_SELECTORS.watchVideoElement,
      );
      if (!nextVideo || nextVideo === this.currentVideoElement) {
        return;
      }
      this.rebindVideoElement(nextVideo);
    });

    this.domMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.attachVideoEventListeners(videoElement);
  }

  private rebindVideoElement(videoElement: HTMLVideoElement): void {
    this.detachVideoEventListeners();
    this.currentVideoElement = videoElement;
    const renderer = this.global.instances.renderer;
    const switchHandler = this.global.instances.switchHandler;

    if (renderer) {
      renderer.clearComments();
      renderer.destroy();
      renderer.initialize(videoElement);
      renderer.resize();
    }
    this.playbackRateController?.bind(videoElement);
    if (switchHandler) {
      void switchHandler.onVideoSwitch(videoElement);
      this.setupSwitchHandling(videoElement, switchHandler);
    }
    this.attachVideoEventListeners(videoElement);
  }

  private attachVideoEventListeners(video: HTMLVideoElement): void {
    this.detachVideoEventListeners();

    // グローバルイベントロガーをアタッチ
    const globalLogger = getGlobalVideoEventLogger();
    globalLogger.attach(video);

    const listener = (): void => {
      if (!this.switchCallback) {
        return;
      }
      logger.info("watchPageController:eventTriggered", {
        currentTime: video.currentTime,
        duration: video.duration,
        ended: video.ended,
        paused: video.paused,
      });
      this.switchDebounce.resetExecution(this.switchCallback);
      this.switchDebounce.execOnce(this.switchCallback);
    };
    video.addEventListener("ended", listener);
    // Firefox: 同一ノードでの src 差し替え時に確実に走るイベントをトリガに追加
    video.addEventListener("loadedmetadata", listener);
    video.addEventListener("emptied", listener);
    this.videoEndedListener = listener;
  }

  private detachVideoEventListeners(): void {
    const video = this.currentVideoElement;

    // グローバルイベントロガーをデタッチ
    const globalLogger = getGlobalVideoEventLogger();
    globalLogger.detach();

    if (video && this.videoEndedListener) {
      video.removeEventListener("ended", this.videoEndedListener);
      video.removeEventListener("loadedmetadata", this.videoEndedListener);
      video.removeEventListener("emptied", this.videoEndedListener);
    }
    this.videoEndedListener = null;
  }

  private extractMetadataFromPage(): {
    animeTitle: string;
    episodeNumber: string;
    episodeTitle: string;
  } | null {
    try {
      const animeTitleElement = document.querySelector(
        DANIME_SELECTORS.watchPageAnimeTitle,
      );
      const episodeNumberElement = document.querySelector(
        DANIME_SELECTORS.watchPageEpisodeNumber,
      );
      const episodeTitleElement = document.querySelector(
        DANIME_SELECTORS.watchPageEpisodeTitle,
      );

      const animeTitle = animeTitleElement?.textContent?.trim() ?? "";
      const episodeNumber = episodeNumberElement?.textContent?.trim() ?? "";
      const episodeTitle = episodeTitleElement?.textContent?.trim() ?? "";

      if (!animeTitle || !episodeNumber || !episodeTitle) {
        logger.warn("watchPageController:extractMetadata:incomplete", {
          animeTitle,
          episodeNumber,
          episodeTitle,
        });
        return null;
      }

      logger.info("watchPageController:extractMetadata:success", {
        animeTitle,
        episodeNumber,
        episodeTitle,
      });

      return {
        animeTitle,
        episodeNumber,
        episodeTitle,
      };
    } catch (error) {
      logger.error("watchPageController:extractMetadata:error", error as Error);
      return null;
    }
  }

  private async autoSetupComments(
    settingsManager: SettingsManager,
  ): Promise<boolean> {
    try {
      // 視聴ページからメタデータを抽出
      const metadata = this.extractMetadataFromPage();
      if (!metadata) {
        logger.warn("watchPageController:autoSetup:metadataNotFound");
        return false;
      }

      // 検索キーワードを構築
      const keyword = [
        metadata.animeTitle,
        metadata.episodeNumber,
        metadata.episodeTitle,
      ]
        .filter(Boolean)
        .join(" ");

      logger.info("watchPageController:autoSetup:searching", { keyword });
      NotificationManager.show(`「${keyword}」を検索中...`, "info");

      // ニコニコ動画を検索
      const searcher = new NicoVideoSearcher();
      const results = await searcher.search(keyword);

      if (results.length === 0) {
        logger.warn("watchPageController:autoSetup:noResults", { keyword });
        NotificationManager.show(
          "ニコニコ動画が見つかりませんでした",
          "warning",
        );
        return false;
      }

      // コメント数が最も多い動画を選択（既にコメント数順にソートされている）
      const bestMatch = results[0];
      logger.info("watchPageController:autoSetup:bestMatch", {
        videoId: bestMatch.videoId,
        title: bestMatch.title,
        commentCount: bestMatch.commentCount,
        similarity: bestMatch.similarity,
      });

      // 動画情報をフェッチして保存
      const fetcher = new NicoApiFetcher();
      const apiData = await fetcher.fetchApiData(bestMatch.videoId);

      const videoMetadata: VideoMetadata = {
        videoId: bestMatch.videoId,
        title: bestMatch.title,
        viewCount: apiData.video?.count?.view ?? bestMatch.viewCount,
        commentCount: apiData.video?.count?.comment ?? bestMatch.commentCount,
        mylistCount: apiData.video?.count?.mylist ?? bestMatch.mylistCount,
        postedAt: apiData.video?.registeredAt ?? bestMatch.postedAt,
        thumbnail: apiData.video?.thumbnail?.url ?? bestMatch.thumbnail,
        owner: apiData.owner ?? bestMatch.owner ?? null,
        channel: apiData.channel ?? bestMatch.channel ?? null,
      };

      const success = settingsManager.saveVideoData(
        bestMatch.title,
        videoMetadata,
      );

      if (success) {
        logger.info("watchPageController:autoSetup:success", {
          videoId: bestMatch.videoId,
        });
        NotificationManager.show(
          `「${bestMatch.title}」を自動設定しました（コメント数: ${bestMatch.commentCount.toLocaleString()}件）`,
          "success",
        );
        return true;
      }

      return false;
    } catch (error) {
      logger.error("watchPageController:autoSetup:error", error as Error);
      NotificationManager.show(
        `自動設定エラー: ${(error as Error).message}`,
        "error",
      );
      return false;
    }
  }

  private getCurrentPartId(): string | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("partId");
    } catch (error) {
      logger.error("watchPageController:getCurrentPartId:error", error as Error);
      return null;
    }
  }

  private startPartIdMonitoring(): void {
    this.stopPartIdMonitoring();
    
    // 初期値を設定
    this.lastPartId = this.getCurrentPartId();
    
    logger.info("watchPageController:startPartIdMonitoring", {
      initialPartId: this.lastPartId,
    });

    this.partIdMonitorIntervalId = window.setInterval(() => {
      void this.checkPartIdChange();
    }, PARTID_MONITOR_INTERVAL_MS);
  }

  private stopPartIdMonitoring(): void {
    if (this.partIdMonitorIntervalId !== null) {
      window.clearInterval(this.partIdMonitorIntervalId);
      this.partIdMonitorIntervalId = null;
      logger.info("watchPageController:stopPartIdMonitoring");
    }
  }

  private async checkPartIdChange(): Promise<void> {
    const currentPartId = this.getCurrentPartId();
    
    if (currentPartId === null || currentPartId === this.lastPartId) {
      return;
    }

    logger.info("watchPageController:partIdChanged", {
      oldPartId: this.lastPartId,
      newPartId: currentPartId,
    });

    this.lastPartId = currentPartId;
    await this.onPartIdChanged();
  }

  private async onPartIdChanged(): Promise<void> {
    try {
      const settingsManager = this.global.settingsManager;
      if (!settingsManager) {
        logger.warn("watchPageController:onPartIdChanged:noSettingsManager");
        return;
      }

      NotificationManager.show("エピソード切り替えを検知しました...", "info");

      // 新しいエピソードのメタデータを取得して再設定
      const success = await this.autoSetupComments(settingsManager);

      if (success) {
        // 動画要素を再初期化
        const videoElement = this.currentVideoElement ?? 
          document.querySelector<HTMLVideoElement>(DANIME_SELECTORS.watchVideoElement);
        
        if (videoElement) {
          const renderer = this.global.instances.renderer;
          const switchHandler = this.global.instances.switchHandler;
          
          if (renderer && switchHandler) {
            logger.info("watchPageController:onPartIdChanged:triggerSwitch");
            await switchHandler.onVideoSwitch(videoElement);
          }
        }
      } else {
        logger.warn("watchPageController:onPartIdChanged:autoSetupFailed");
      }
    } catch (error) {
      logger.error("watchPageController:onPartIdChanged:error", error as Error);
      NotificationManager.show(
        `エピソード切り替えエラー: ${(error as Error).message}`,
        "error",
      );
    }
  }

}
