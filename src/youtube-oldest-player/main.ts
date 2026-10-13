import { collect, pageContent } from "./collector";
import { direction, t } from "./i18n";
import {
  STORAGE_KEY,
  oldestToken,
  parseQueue,
  watchUrl,
  type Queue,
} from "./model";

const HOST_ID = "youtube-oldest-player";
const channelPath = () =>
  /^\/(?:@[^/]+|(?:channel|c|user)\/[^/]+)\/videos\/?$/.test(location.pathname);
interface PlayerElement extends HTMLElement {
  getVideoData?: () => { video_id?: string };
  getPlayerState?: () => number;
}

function start(): void {
  if (document.getElementById(HOST_ID)) return;
  const host = document.createElement("div");
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `:host{position:fixed;inset-inline-end:12px;bottom:12px;z-index:2147483646;max-width:calc(100vw - 24px);font:14px/1.5 system-ui;color-scheme:light dark}section{box-sizing:border-box;width:350px;max-width:calc(100vw - 24px);max-height:45vh;overflow:auto;padding:12px;border:1px solid #888;border-radius:12px;background:Canvas;color:CanvasText;box-shadow:0 2px 12px #0004}p{margin:0 0 8px;overflow-wrap:anywhere}nav{display:flex;flex-wrap:wrap;gap:6px}button{font:inherit;max-width:100%;overflow-wrap:anywhere;cursor:pointer;padding:6px 10px;border:1px solid #888;border-radius:16px;background:ButtonFace;color:ButtonText}button:disabled{opacity:.5;cursor:default}button:focus-visible{outline:2px solid #3ea6ff;outline-offset:2px}`;
  const panel = document.createElement("section");
  panel.dir = direction;
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const nav = document.createElement("nav");
  panel.append(status, nav);
  shadow.append(style, panel);
  document.body.append(host);

  let queue: Queue | null = null;
  let ready: Queue | null = null;
  let work: AbortController | null = null;
  let message = "";
  let recovery = "";
  let count = 0;
  let currentUrl = location.href;
  let signature = "";
  let attemptedVideo: HTMLVideoElement | null = null;
  let navigating = false;
  let boundPlayer: PlayerElement | null = null;
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      queue = parseQueue(JSON.parse(saved));
      if (!queue) {
        sessionStorage.removeItem(STORAGE_KEY);
        recovery = t("recovered");
      }
    }
  } catch {
    recovery = t("recovered");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Storage unavailable: show recovery message. */
    }
  }

  function save(): boolean {
    try {
      if (queue) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      else sessionStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      message = t("storage");
      return false;
    }
  }
  function index(): number {
    const url = new URL(location.href);
    if (
      !queue ||
      url.pathname !== "/watch" ||
      url.searchParams.get("v") !== queue.currentId
    )
      return -1;
    return queue.videos.findIndex(
      (video) => video.id === url.searchParams.get("v"),
    );
  }
  function move(target: number): void {
    if (!queue || target < 0 || target >= queue.videos.length) return;
    const previousId = queue.currentId;
    queue.currentId = queue.videos[target].id;
    if (save()) {
      navigating = true;
      host.hidden = true;
      location.assign(watchUrl(queue, target));
    } else queue.currentId = previousId;
  }
  function restoreAutoplay(): void {
    const toggle = document.querySelector<HTMLElement>(
      ".ytp-autonav-toggle-button",
    );
    if (queue?.originalAutoplay === null || !queue || !toggle) return;
    const checked = toggle.getAttribute("aria-checked");
    if (
      (checked === "true" || checked === "false") &&
      (checked === "true") !== queue.originalAutoplay
    )
      toggle.closest("button")?.click();
  }
  function holdAutoplay(): void {
    if (!queue || index() < 0) return;
    const toggle = document.querySelector<HTMLElement>(
      ".ytp-autonav-toggle-button",
    );
    const checked = toggle?.getAttribute("aria-checked");
    if (checked !== "true" && checked !== "false") return;
    if (queue.originalAutoplay === null) {
      queue.originalAutoplay = checked === "true";
      if (!save()) return;
    }
    if (checked === "true") toggle?.closest("button")?.click();
  }
  function button(
    key: Parameters<typeof t>[0],
    action: () => void,
    disabled = false,
  ): void {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = t(key);
    element.dataset.action = key;
    element.disabled = disabled;
    element.addEventListener("click", action);
    nav.append(element);
  }
  async function load(): Promise<void> {
    work = new AbortController();
    const job = work;
    const url = location.href;
    ready = null;
    count = 0;
    message = "";
    render();
    try {
      const videos = await collect(job.signal, (value) => {
        count = value;
        render();
      });
      if (location.href !== url || job.signal.aborted) return;
      ready = {
        version: 1,
        key: crypto.randomUUID(),
        channel: location.pathname,
        currentId: videos[0].id,
        originalAutoplay: null,
        videos,
        active: true,
      };
      message = t("ready", { count: videos.length });
    } catch (error) {
      if (!job.signal.aborted) {
        message = t("failed");
        console.warn("[youtube-oldest-player]", error);
      }
    } finally {
      if (work === job) work = null;
      render();
    }
  }
  function render(): void {
    const position = index();
    const visible = channelPath() || position >= 0;
    host.hidden = !visible || navigating;
    let supported = false;
    if (channelPath()) {
      try {
        oldestToken(pageContent());
        supported = true;
      } catch {
        /* Wait for current channel data. */
      }
    }
    const text =
      position >= 0 && queue
        ? `${position + 1} / ${queue.videos.length} · ${queue.videos[position].title}${message ? ` — ${message}` : ""}`
        : work
          ? t("collect", { count })
          : ready
            ? message
            : message || recovery || t("start");
    if (status.textContent !== text) status.textContent = text;
    const state = JSON.stringify([
      visible,
      position,
      queue?.active,
      work !== null,
      ready?.key,
      supported,
    ]);
    if (signature === state) return;
    signature = state;
    nav.replaceChildren();
    if (position >= 0 && queue) {
      status.textContent = `${position + 1} / ${queue.videos.length} · ${queue.videos[position].title}${message ? ` — ${message}` : ""}`;
      button("previous", () => move(position - 1), position === 0);
      button(
        "next",
        () => move(position + 1),
        position === queue.videos.length - 1,
      );
      button(queue.active ? "pause" : "resume", () => {
        if (queue) {
          queue.active = !queue.active;
          const video = document.querySelector<HTMLVideoElement>(
            "#movie_player video.html5-main-video",
          );
          const player = document.getElementById(
            "movie_player",
          ) as PlayerElement | null;
          if (
            queue.active &&
            video &&
            (video.ended || player?.getPlayerState?.() === 0) &&
            currentPlayer(video)
          ) {
            advance();
            return;
          }
          save();
          render();
        }
      });
      button("stop", () => {
        restoreAutoplay();
        queue = null;
        save();
        message = "";
        render();
      });
    } else if (work) {
      status.textContent = t("collect", { count });
      button("cancel", () => {
        work?.abort();
        work = null;
        message = "";
        render();
      });
    } else if (ready) {
      status.textContent = message;
      button("play", () => {
        queue = ready;
        ready = null;
        move(0);
      });
      button("cancel", () => {
        ready = null;
        message = "";
        render();
      });
    } else {
      status.textContent = message || recovery || t("start");
      button(
        "start",
        () => {
          void load();
        },
        !supported,
      );
    }
  }

  function currentPlayer(video: HTMLVideoElement): boolean {
    const position = index();
    const player = document.getElementById(
      "movie_player",
    ) as PlayerElement | null;
    if (
      position < 0 ||
      !queue ||
      !player ||
      player.classList.contains("ad-showing") ||
      player.classList.contains("ad-interrupting")
    )
      return false;
    return (
      player.contains(video) &&
      player.getVideoData?.().video_id === queue.videos[position].id
    );
  }
  function advance(): void {
    if (!queue?.active || navigating) return;
    const position = index();
    if (position < 0) return;
    if (position + 1 < queue.videos.length) move(position + 1);
    else {
      queue.active = false;
      message = t("done");
      save();
      render();
    }
  }
  const playerStateChanged = (event: Event) => {
    const state: unknown = event;
    const video = document.querySelector<HTMLVideoElement>(
      "#movie_player video.html5-main-video",
    );
    if (
      (state === 0 ||
        (typeof state === "object" &&
          state !== null &&
          "data" in state &&
          state.data === 0)) &&
      video &&
      currentPlayer(video)
    )
      advance();
  };
  window.addEventListener(
    "ended",
    (event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement) || !currentPlayer(video)) return;
      // Own only this queue's main-video end. Suppress the related-video successor.
      event.stopImmediatePropagation();
      advance();
    },
    true,
  );
  const tick = () => {
    // Full-document navigation is asynchronous on real sites. Preserve the saved
    // queue while the departing document is still alive (including slow loads).
    if (navigating) return;
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      work?.abort();
      work = null;
      ready = null;
      message = "";
      attemptedVideo = null;
      if (queue && index() < 0) {
        restoreAutoplay();
        queue = null;
        save();
      }
    }
    // YouTube removes unknown query parameters on initial watch-page load.
    // Persist the expected video ID instead of depending on a URL marker.
    if (queue && index() < 0 && !work) {
      restoreAutoplay();
      queue = null;
      save();
    }
    const video = document.querySelector<HTMLVideoElement>(
      "#movie_player video.html5-main-video",
    );
    const player = document.getElementById(
      "movie_player",
    ) as PlayerElement | null;
    if (player?.getPlayerState && player !== boundPlayer) {
      boundPlayer?.removeEventListener("onStateChange", playerStateChanged);
      player.addEventListener("onStateChange", playerStateChanged);
      boundPlayer = player;
    }
    holdAutoplay();
    if (
      video &&
      queue?.active &&
      attemptedVideo !== video &&
      currentPlayer(video) &&
      !video.ended &&
      video.readyState >= 2
    ) {
      attemptedVideo = video;
      void video.play().catch(() => {
        message = t("blocked");
        render();
      });
    }
    render();
  };
  tick();
  window.setInterval(tick, 500);
  window.addEventListener("yt-navigate-finish", tick);
  window.addEventListener("pagehide", () => {
    if (!navigating) restoreAutoplay();
  });
}
// CDP document-start injection also reaches child frames; enforce @noframes
// at runtime so same-origin frames cannot clear the parent tab's queue.
if (window.top === window) {
  if (document.readyState === "loading" || !document.body)
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
}
