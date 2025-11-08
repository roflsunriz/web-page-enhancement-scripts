import { cloneDefaultSettings } from "../../config/default-settings";
import { SettingsManager } from "../../services/settings-manager";
import type { RendererSettings } from "@/shared/types";
import { NotificationManager } from "../notification-manager";
import { CommentRenderer } from "../comment-renderer";
import { NicoApiFetcher } from "../services/nico-api-fetcher";
import { VideoSwitchHandler } from "../services/video-switch-handler";
import { PlaybackRateController } from "../services/playback-rate-controller";
import { DebounceExecutor } from "../utils/debounce-executor";
import type { DanimeGlobal } from "../globals";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";

const INITIALIZATION_RETRY_MS = 100;
const SWITCH_DEBOUNCE_MS = 1000;
const SWITCH_COOLDOWN_MS = 3000;
const FORCE_REFRESH_DELAY_MS = 10000;

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
  private forceRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  private hasForceRefreshed = false;

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

      const videoData = settingsManager.loadVideoData();
      if (!videoData?.videoId) {
        throw new Error(
          "動画データが見つかりません。マイページで設定してください。",
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

      settingsManager.addObserver((newSettings) => {
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
        return;
      }
      this.lastSwitchTimestamp = now;
      const targetVideo = this.currentVideoElement;
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
    this.clearForceRefreshTimer();
    this.hasForceRefreshed = false;
    this.currentVideoElement = videoElement;
    const renderer = this.global.instances.renderer;
    const switchHandler = this.global.instances.switchHandler;

    if (renderer) {
      renderer.clearComments();
      renderer.destroy();
      renderer.initialize(videoElement);
      renderer.hardReset();
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
    const listener = (): void => {
      if (!this.switchCallback) {
        return;
      }
      this.switchDebounce.resetExecution(this.switchCallback);
      this.switchDebounce.execOnce(this.switchCallback);
    };
    video.addEventListener("ended", listener);
    // Firefox: 同一ノードでの src 差し替え時に確実に走るイベントをトリガに追加
    video.addEventListener("loadedmetadata", listener);
    video.addEventListener("emptied", listener);
    this.videoEndedListener = listener;

    // 動画再生開始時に再初期化タイマーを設定（初回のみ）
    video.addEventListener(
      "play",
      () => {
        this.scheduleForceRefresh();
      },
      { once: true },
    );
  }

  private detachVideoEventListeners(): void {
    const video = this.currentVideoElement;
    if (video && this.videoEndedListener) {
      video.removeEventListener("ended", this.videoEndedListener);
      video.removeEventListener("loadedmetadata", this.videoEndedListener);
      video.removeEventListener("emptied", this.videoEndedListener);
    }
    this.videoEndedListener = null;
  }

  private scheduleForceRefresh(): void {
    // 既に再初期化済みの場合はスキップ
    if (this.hasForceRefreshed) {
      return;
    }

    // 既存のタイマーをクリア
    this.clearForceRefreshTimer();

    // 設定で無効化されている場合はスキップ
    const renderer = this.global.instances.renderer;
    const settingsManager = this.global.settingsManager;
    if (!renderer || !settingsManager) {
      return;
    }

    const settings = settingsManager.getSettings();
    if (settings.enableForceRefresh === false) {
      return;
    }

    // 10秒後に再初期化処理を実行
    this.forceRefreshTimer = setTimeout(() => {
      this.forceRefreshComments();
    }, FORCE_REFRESH_DELAY_MS);
  }

  private forceRefreshComments(): void {
    const renderer = this.global.instances.renderer;
    if (!renderer || this.hasForceRefreshed) {
      return;
    }

    try {
      // 現在のコメントをレンダラーから取得（SPA対応）
      const currentComments = renderer.getCommentsSnapshot();
      if (currentComments.length === 0) {
        return;
      }

      // ゴーストコメントを完全に削除して内部状態をリセット
      renderer.clearComments();
      renderer.hardReset();

      // 取得したコメントを再追加して強制再描画
      currentComments.forEach((comment) => {
        const commands = comment.commands ?? [];
        renderer.addComment(comment.text, comment.vposMs, commands);
      });

      this.hasForceRefreshed = true;
      this.clearForceRefreshTimer();
    } catch (error) {
      console.error("[WatchPageController] Force refresh failed", error);
    }
  }

  private clearForceRefreshTimer(): void {
    if (this.forceRefreshTimer !== null) {
      clearTimeout(this.forceRefreshTimer);
      this.forceRefreshTimer = null;
    }
  }
}
