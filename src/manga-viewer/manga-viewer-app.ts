import { globalState } from "./state";
import { checkReactAvailability, isMobile, setViewport, win } from "./util";
import { ChapterNavigator } from "./chapter-navigator";
import { DataLoader } from "./data-loader";
import { GlassControlPanel } from "./ui/glass-control-panel";
import { LoadingSpinner } from "./ui/loading-spinner";
import { UIBuilder } from "./ui/ui-builder";
import { SPAPageObserver } from "./spa-page-observer";
import { getLaunchStyle } from "@/shared/launch-style";
import {
  isSiteAccessAllowed,
  registerScriptSettingsMenu,
} from "@/shared/script-settings";
import { FabButton } from "@/shared/ui/fab";
import { svgBookOpen } from "@/shared/icons/mdi";
import type { LaunchStyle } from "@/shared/types/launch-style";
import { format, t } from "./i18n";
import { createImageExclusionSettingsSectionFactory } from "@/shared/image-exclusion-settings";
import { isInvalidImage } from "./invalid-image-database";

const SCRIPT_ID = "manga-viewer";
const RUNTIME_STATE_KEY = "__bookStyleMangaViewerRuntime";

type RuntimeState = {
  activeOwnerId: string | null;
  launchOwnerId: string | null;
};

type RuntimeWindow = Window &
  typeof globalThis & {
    [RUNTIME_STATE_KEY]?: RuntimeState;
  };

type LaunchOptions = {
  preferFastLoadedWait?: boolean;
};

export class MangaViewerApp {
  private controlPanel: GlassControlPanel | null = null;
  private fab: FabButton | null = null;
  private spaObserver: SPAPageObserver;
  private launchStyle: LaunchStyle = "classic";
  private launchShortcutHandler: ((e: KeyboardEvent) => void) | null = null;
  private beforeUnloadHandler: (() => void) | null = null;
  private isLaunchInProgress = false;
  private readonly ownerId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;

  constructor() {
    this.spaObserver = new SPAPageObserver();
    this.installEarlyKeydownHook();
  }

  public async initialize() {
    this.launchStyle = getLaunchStyle(SCRIPT_ID);
    globalState.app = this;

    registerScriptSettingsMenu({
      scriptId: SCRIPT_ID,
      scriptName: "book-style-manga-viewer",
      includeLaunchStyle: true,
      customSections: [
        createImageExclusionSettingsSectionFactory({
          shouldIncludeCandidate: (candidate) =>
            !isInvalidImage(candidate.url, candidate.width, candidate.height, {
              pageHost: candidate.pageHost,
            }) &&
            !(
              candidate.width !== undefined &&
              candidate.height !== undefined &&
              (candidate.width < 100 || candidate.height < 100)
            ),
        }),
      ],
      defaultLaunchStyle: "classic",
    });

    if (!isSiteAccessAllowed(SCRIPT_ID)) {
      return;
    }

    // 起動スタイルに応じたUIを作成
    switch (this.launchStyle) {
      case "classic": {
        this.controlPanel = new GlassControlPanel();
        await this.controlPanel.init();
        globalState.controlPanel = this.controlPanel;
        break;
      }
      case "fab": {
        this.fab = new FabButton({
          icon: svgBookOpen,
          color: "rgba(74, 144, 226, 0.9)",
          position: { top: "20px", right: "20px" },
          label: t("viewerLaunch"),
          onClick: () => {
            void this.launch();
          },
        });
        this.fab.init();
        break;
      }
      case "menu-only":
        // UIなし: メニューコマンドのみ
        break;
      default: {
        // exhaustive check
        const _exhaustive: never = this.launchStyle;
        void _exhaustive;
      }
    }

    this.spaObserver.startObserving();

    // メニューコマンド: メインアクション（全スタイル共通）
    void import("@/shared/userscript").then((m) =>
      m.registerMenuCommand(t("launchMenu"), () => this.launch()),
    );

    this.launchShortcutHandler = (keyboardEvent: KeyboardEvent) => {
      if (
        keyboardEvent.ctrlKey &&
        keyboardEvent.shiftKey &&
        (keyboardEvent.key === "M" || keyboardEvent.code === "KeyM")
      ) {
        keyboardEvent.preventDefault();
        if (this.launchStyle === "classic") {
          if (this.controlPanel?.isVisible) {
            this.controlPanel?.hide();
          } else {
            this.controlPanel?.show();
          }
        } else {
          // FAB/メニューのみモードではショートカットで直接起動
          void this.launch();
        }
      }
    };
    document.addEventListener("keydown", this.launchShortcutHandler, true);

    const navigator = new ChapterNavigator();
    if (navigator.checkAutoLaunch()) {
      const autoLaunchDelayMs = 1200 + Math.floor(Math.random() * 501);
      setTimeout(
        () => this.launch({ preferFastLoadedWait: true }),
        autoLaunchDelayMs,
      );
    }

    this.beforeUnloadHandler = () => this.destroy();
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  public async launch(options: LaunchOptions = {}) {
    const runtimeState = this.getRuntimeState();
    if (globalState.isViewerActive || runtimeState.activeOwnerId !== null) {
      console.warn("[MangaViewer] Viewer is already active.");
      return;
    }

    if (this.isLaunchInProgress || runtimeState.launchOwnerId !== null) {
      console.warn("[MangaViewer] Viewer launch is already in progress.");
      return;
    }

    this.isLaunchInProgress = true;
    runtimeState.launchOwnerId = this.ownerId;
    let spinner: LoadingSpinner | null = null;
    try {
      if (!checkReactAvailability()) {
        throw new Error("React or ReactDOM is not available.");
      }

      this.controlPanel?.hide();
      this.fab?.setVisible(false);

      if (isMobile()) {
        setViewport();
      }

      spinner = new LoadingSpinner();
      spinner.show(t("imageSearch"));

      const loader = new DataLoader({
        preferFastLoadedWait: options.preferFastLoadedWait,
      });
      loader.setSpinner(spinner);

      const result = await loader.collectImageUrls();
      if (!result) {
        throw new Error("Image collection returned invalid result");
      }

      spinner.updateMessage(
        format("loadedImages", { count: String(result.initialUrls.length) }),
      );

      const builder = new UIBuilder();
      builder.setSpinner(spinner);

      const isTwitter =
        window.location.href.includes("twitter.com") ||
        window.location.href.includes("x.com");
      const viewerOptions = { initialAutoNav: !isTwitter };

      const viewerElement = await builder.buildAndRenderViewer(
        result.initialUrls,
        viewerOptions,
        () => this.cleanup(),
      );
      if (!viewerElement) {
        throw new Error("Failed to build viewer");
      }
      runtimeState.activeOwnerId = this.ownerId;

      result.onValidated((updatedUrls) => {
        builder.getUpdateImagesCallback()?.(updatedUrls);
      });

      spinner.hide();
      spinner = null;
    } catch (error) {
      console.error("[MangaViewer] launchViewer: unexpected error:", error);
      this.cleanup();
      spinner?.hide();
      alert(
        format("launchError", {
          message: (error as Error).message || String(error),
        }),
      );
    } finally {
      this.isLaunchInProgress = false;
      if (runtimeState.launchOwnerId === this.ownerId) {
        runtimeState.launchOwnerId = null;
      }
    }
  }

  private cleanup() {
    const runtimeState = this.getRuntimeState();
    if (runtimeState.activeOwnerId === this.ownerId) {
      runtimeState.activeOwnerId = null;
    }
    if (runtimeState.launchOwnerId === this.ownerId) {
      runtimeState.launchOwnerId = null;
    }

    globalState.eventListeners.forEach(
      ({ element, event, handler, options }) => {
        try {
          element.removeEventListener(event, handler, options);
        } catch {
          /* ignore */
        }
      },
    );
    globalState.eventListeners = [];

    globalState.timers.forEach((timerId) => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    globalState.timers = [];

    globalState.observers.forEach((observer) => observer.disconnect());
    globalState.observers = [];

    this.controlPanel?.show();
    this.fab?.setVisible(true);
    globalState.keyDispatcher = null;
    globalState.isViewerActive = false;
  }

  private destroy() {
    if (this.launchShortcutHandler) {
      document.removeEventListener("keydown", this.launchShortcutHandler, true);
      this.launchShortcutHandler = null;
    }
    if (this.beforeUnloadHandler) {
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }
    this.controlPanel?.destroy();
    this.controlPanel = null;
    globalState.controlPanel = null;
    this.fab?.destroy();
    this.fab = null;
    this.cleanup();
  }

  private installEarlyKeydownHook() {
    if (globalState.earlyKeyHookInstalled) return;
    try {
      window.addEventListener(
        "keydown",
        (e: KeyboardEvent & { __mvHandled?: boolean }) => {
          if (!globalState.isViewerActive) return;
          const ae = document.activeElement as HTMLElement;
          if (
            ae &&
            (ae.tagName === "INPUT" ||
              ae.tagName === "TEXTAREA" ||
              ae.tagName === "SELECT" ||
              ae.isContentEditable)
          )
            return;

          if (typeof globalState.keyDispatcher === "function") {
            if (e.__mvHandled) return;
            e.__mvHandled = true;
            try {
              globalState.keyDispatcher(e);
            } catch {
              // Silently ignore errors in the key dispatcher
            }
          }
        },
        { capture: true },
      );
      globalState.earlyKeyHookInstalled = true;
    } catch {
      /* Errors during hook installation are not critical */
    }
  }

  private getRuntimeState(): RuntimeState {
    const runtimeWindow = win as RuntimeWindow;
    runtimeWindow[RUNTIME_STATE_KEY] ??= {
      activeOwnerId: null,
      launchOwnerId: null,
    };
    return runtimeWindow[RUNTIME_STATE_KEY];
  }
}
