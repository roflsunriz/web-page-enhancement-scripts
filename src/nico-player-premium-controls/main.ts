import { installRuntimeAdapter, isJsxRuntime } from "./eligibility";
import {
  findControllers,
  unlockController,
  type PlayerController,
} from "./controller";

// Account data, request bodies, fetch/XHR, cookies and content-rights responses stay untouched.
const KEY = Symbol.for(
  "web-page-enhancement-scripts.nico-player-premium-controls",
);
type Status = { runtime: boolean; controllers: number; error: string | null };
const host = window as unknown as Record<symbol, unknown>;

if (
  window.top === window &&
  location.hostname === "sp.nicovideo.jp" &&
  !host[KEY]
) {
  const status: Status = { runtime: false, controllers: 0, error: null };
  host[KEY] = { status: () => ({ ...status }) };
  let restoreRuntime: (() => void) | null = null;
  const controllers = new Map<PlayerController, () => void>();
  let loading = false;
  let currentUrl = "";
  let generation = 0;
  let suspended = false;
  let lastScan = 0;
  let warned = false;
  const runtimeAttempts = new Set<string>();

  function deactivate(): void {
    generation++;
    runtimeAttempts.clear();
    restoreRuntime?.();
    restoreRuntime = null;
    for (const restore of controllers.values()) restore();
    controllers.clear();
    status.runtime = false;
    status.controllers = 0;
  }

  function runtimeUrl(): string | null {
    const resources = performance
      .getEntriesByType("resource")
      .map((entry) => entry.name);
    const preloads = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="modulepreload"]'),
    ).map((link) => link.href);
    for (const source of [...resources, ...preloads]) {
      const url = new URL(source, location.href);
      if (
        url.origin === "https://res.sp.nicovideo.jp" &&
        /^\/.*\/jsx-runtime-[^/]+\.js$/.test(url.pathname)
      )
        return url.href;
    }
    return null;
  }

  function failure(error: unknown): void {
    status.error =
      error instanceof Error
        ? error.message
        : "Unsupported official player structure";
    if (warned) return;
    warned = true;
    const message = navigator.language.startsWith("ja")
      ? "公式プレイヤーの設定制限を解除できませんでした。ページを再読み込みし、改善しない場合はスクリプトを無効にしてください。"
      : "Could not enable the official player settings. Reload the page, or disable this script if the problem persists.";
    console.warn("[nico-player-premium-controls]", message, status.error);
  }

  async function update(forceScan = false): Promise<void> {
    if (currentUrl !== location.href) {
      deactivate();
      currentUrl = location.href;
      runtimeAttempts.clear();
      warned = false;
      status.error = null;
    }
    const videoId = /^\/watch\/([a-z]+\d+)\/?$/.exec(location.pathname)?.[1];
    if (suspended || !videoId) {
      if (restoreRuntime || controllers.size) deactivate();
      return;
    }
    for (const [controller, restore] of controllers) {
      const video = controller.getVideoElement();
      if (
        !(video instanceof HTMLVideoElement) ||
        !video.isConnected ||
        controller.watch.video.id !== videoId
      ) {
        restore();
        controllers.delete(controller);
      }
    }
    status.controllers = controllers.size;
    if (!restoreRuntime && !loading) {
      const url = runtimeUrl();
      if (url && !runtimeAttempts.has(url)) {
        runtimeAttempts.add(url);
        loading = true;
        const started = generation;
        try {
          const module: unknown = await import(/* @vite-ignore */ url);
          if (started !== generation || suspended) return;
          const runtime = Object.values(module as Record<string, unknown>).find(
            isJsxRuntime,
          );
          if (!runtime) throw new Error("Unsupported official JSX runtime");
          restoreRuntime = installRuntimeAdapter(runtime);
          status.runtime = true;
        } catch (error: unknown) {
          if (started === generation) failure(error);
        } finally {
          loading = false;
        }
      }
    }
    if (!restoreRuntime) return;
    if (!forceScan && performance.now() - lastScan < 750) return;
    lastScan = performance.now();
    try {
      const videos = document.querySelectorAll<HTMLVideoElement>(
        'video[data-name="video-content"]',
      );
      const active = new Set<PlayerController>();
      for (const video of videos) {
        for (const controller of findControllers(video, videoId))
          active.add(controller);
      }
      // Resume settings can recreate the controller while retaining the same video DOM.
      for (const [controller, restore] of controllers) {
        if (!active.has(controller)) {
          restore();
          controllers.delete(controller);
        }
      }
      for (const controller of active) {
        if (!controllers.has(controller))
          controllers.set(controller, unlockController(controller));
      }
      status.controllers = controllers.size;
    } catch (error: unknown) {
      failure(error);
    }
  }

  const observer = new MutationObserver(() => {
    void update();
  });
  observer.observe(document, { childList: true, subtree: true });
  // Observe SPA URL changes without replacing history methods or navigation handlers.
  window.setInterval(() => {
    void update();
  }, 500);
  // Refresh before official React click handlers, including the first click after recreation.
  // No event cancellation, setting setters or navigation changes are performed here.
  document.addEventListener(
    "click",
    () => {
      void update(true);
    },
    true,
  );
  window.addEventListener("pagehide", () => {
    suspended = true;
    deactivate();
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    void update();
  });
  window.setTimeout(() => {
    if (
      !suspended &&
      /^\/watch\//.test(location.pathname) &&
      (!status.runtime || !status.controllers)
    ) {
      failure(
        new Error(
          "The official player adapter is not ready; site structure or page injection may be unsupported",
        ),
      );
    }
  }, 15000);
  void update();
}
