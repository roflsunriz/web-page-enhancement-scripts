import { getUnsafeWindow } from "@/shared/userscript/getUnsafeWindow";
import { cloneDefaultSettings } from "@/d-anime/config/default-settings";
import { SettingsManager } from "@/d-anime/services/settings-manager";
import { Comment } from "@/d-anime/comments/comment";
import { CommentRenderer } from "@/d-anime/comments/comment-renderer";
import { KeyboardShortcutHandler } from "@/d-anime/input/keyboard-shortcut-handler";
import { NotificationManager } from "@/d-anime/services/notification-manager";
import { NicoApiFetcher } from "@/d-anime/services/nico-api-fetcher";
import { NicoVideoSearcher } from "@/d-anime/services/nico-video-searcher";
import { VideoSwitchHandler } from "@/d-anime/services/video-switch-handler";
import { DebounceExecutor } from "@/d-anime/utils/debounce-executor";
import { ShadowDOMComponent } from "@/d-anime/shadow/shadow-dom-component";
import { ShadowStyleManager } from "@/d-anime/styles/shadow-style-manager";
import { StyleManager } from "@/d-anime/styles/style-manager";
import { SettingsUI } from "@/d-anime/settings/settings-ui";
import { PlaybackRateController } from "@/d-anime/services/playback-rate-controller";

export interface DanimeGlobalInstances {
  renderer?: CommentRenderer;
  fetcher?: NicoApiFetcher;
  switchHandler?: VideoSwitchHandler;
  settingsManager?: SettingsManager;
  playbackRateController?: PlaybackRateController;
}

export interface DanimeGlobalApi {
  classes: {
    Comment: typeof Comment;
    CommentRenderer: typeof CommentRenderer;
    NicoApiFetcher: typeof NicoApiFetcher;
    NotificationManager: typeof NotificationManager;
    StyleManager: typeof StyleManager;
    SettingsUI: typeof SettingsUI;
    NicoVideoSearcher: typeof NicoVideoSearcher;
    VideoSwitchHandler: typeof VideoSwitchHandler;
    SettingsManager: typeof SettingsManager;
    KeyboardShortcutHandler: typeof KeyboardShortcutHandler;
    DebounceExecutor: typeof DebounceExecutor;
    ShadowDOMComponent: typeof ShadowDOMComponent;
    ShadowStyleManager: typeof ShadowStyleManager;
    PlaybackRateController: typeof PlaybackRateController;
  };
  instances: DanimeGlobalInstances;
  utils: {
    initialize: () => Promise<void>;
    initializeWithVideo: (video: HTMLVideoElement) => Promise<void>;
  };
  debug: {
    showState: () => void;
    showSettings: () => void;
    showComments: () => void;
  };
  settingsManager?: SettingsManager;
  defaultSettings: () => ReturnType<typeof cloneDefaultSettings>;
}

const noopAsync = async (): Promise<void> => {
  // placeholder until actual initialize functions are wired up
};

export const ensureDanimeGlobal = (): DanimeGlobalApi => {
  const globalWindow = getUnsafeWindow() as ReturnType<
    typeof getUnsafeWindow
  > & {
    dAniRenderer?: DanimeGlobalApi;
  };

  if (!globalWindow.dAniRenderer) {
    const instances: DanimeGlobalInstances = {};

    globalWindow.dAniRenderer = {
      classes: {
        Comment,
        CommentRenderer,
        NicoApiFetcher,
        NotificationManager,
        StyleManager,
        SettingsUI,
        NicoVideoSearcher,
        VideoSwitchHandler,
        SettingsManager,
        KeyboardShortcutHandler,
        DebounceExecutor,
        ShadowDOMComponent,
        ShadowStyleManager,
        PlaybackRateController,
      },
      instances,
      utils: {
        initialize: noopAsync,
        initializeWithVideo: noopAsync,
      },
      debug: {
        showState: () => {
          console.log("Current instances:", instances);
        },
        showSettings: () => {
          const manager = instances.settingsManager;
          if (!manager) {
            console.log("SettingsManager not initialized");
            return;
          }
          console.log("Current settings:", manager.getSettings());
        },
        showComments: () => {
          const renderer = instances.renderer;
          if (!renderer) {
            console.log("CommentRenderer not initialized");
            return;
          }
          console.log("Current comments:", renderer.getCommentsSnapshot());
        },
      },
      defaultSettings: cloneDefaultSettings,
    };
  }

  return globalWindow.dAniRenderer;
};

export type DanimeGlobal = ReturnType<typeof ensureDanimeGlobal>;
