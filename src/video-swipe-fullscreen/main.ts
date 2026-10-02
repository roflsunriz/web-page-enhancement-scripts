import {
  completed,
  intent,
  type Direction,
  type Point,
} from "../nico-mobile-swipe-fullscreen/gesture";
import { FullscreenController } from "./fullscreen";
import {
  CONTROL,
  contains,
  fullscreenElement,
  inCenter,
  playerRoot,
  videos,
} from "./player";
import { siteEnabled } from "./settings";
import { siteControl } from "./site-policy";

type Gesture = {
  id: number;
  input: "touch" | "mouse";
  start: Point;
  video: HTMLVideoElement;
  root: HTMLElement;
  href: string;
  epoch: number;
  direction: Direction;
  claimed: boolean;
  cancelled: boolean;
};

function boot() {
  const marker = "data-video-swipe-owner";
  if (document.documentElement.hasAttribute(marker)) return;
  document.documentElement.setAttribute(marker, "1");
  if (!siteEnabled()) return;
  const controller = new FullscreenController();
  let gesture: Gesture | null = null;
  let suppress: { root: HTMLElement; until: number } | null = null;
  const point = (x: number, y: number): Point => ({
    x,
    y,
    time: performance.now(),
  });
  const nicoOwns = () =>
    location.hostname === "sp.nicovideo.jp" &&
    /^\/watch\/[^/]+\/?$/.test(location.pathname) &&
    document.documentElement.hasAttribute("data-nico-mobile-swipe-owner");

  const start = (
    event: Event,
    input: Gesture["input"],
    id: number,
    x: number,
    y: number,
  ) => {
    gesture = null;
    if (!event.isTrusted || event.defaultPrevented || nicoOwns()) return;
    const path = event.composedPath();
    if (siteControl(path)) return;
    if (path.some((node) => node instanceof Element && node.matches(CONTROL)))
      return;
    const target = path.find(
      (node): node is Element => node instanceof Element,
    );
    if (!target) return;
    controller.reconcile();
    // No stale registry: this includes videos inserted by SPAs and open roots.
    for (const video of videos(document)) {
      if (!inCenter(video, x, y)) continue;
      const activeRoot = controller.activeRoot(video);
      const root = activeRoot ?? playerRoot(video);
      if (!contains(root, target)) continue;
      if (fullscreenElement() && !activeRoot) return;
      gesture = {
        id,
        input,
        start: point(x, y),
        video,
        root,
        href: location.href,
        epoch: controller.epoch,
        direction: activeRoot ? "down" : "up",
        claimed: false,
        cancelled: false,
      };
      // Later listeners on window may also own the start event.
      const g = gesture;
      window.setTimeout(() => {
        if (event.defaultPrevented && gesture === g) gesture = null;
      }, 0);
      return;
    }
  };

  const valid = (g: Gesture) =>
    !nicoOwns() &&
    g.href === location.href &&
    g.video.isConnected &&
    g.root.isConnected &&
    contains(g.root, g.video) &&
    g.epoch === controller.epoch &&
    (g.direction === "down"
      ? controller.activeRoot(g.video) === g.root
      : !fullscreenElement());

  const move = (event: Event, x: number, y: number) => {
    const g = gesture;
    if (!g) return;
    const decision = intent(g.start, point(x, y), g.direction);
    if (!valid(g) || event.defaultPrevented || decision === "cancel") {
      // Once rejected, a diagonal/reversed drag never becomes a swipe again.
      if (!g.claimed) {
        gesture = null;
        return;
      }
      g.cancelled = true;
    }
    if (decision === "pending") return;
    if (!event.cancelable) {
      gesture = null;
      return;
    }
    g.claimed = true;
    event.preventDefault();
    // Keep propagation intact so the site's own gesture listeners run first
    // on target/document, and can cancel the release or change fullscreen.
  };

  const end = (event: Event, x: number, y: number) => {
    const g = gesture;
    gesture = null;
    if (!g?.claimed) return;
    const p = point(x, y);
    if (
      g.cancelled ||
      event.defaultPrevented ||
      !valid(g) ||
      !completed(g.start, p, g.direction)
    )
      return;
    suppress = { root: g.root, until: performance.now() + 400 };
    // Browser microtask checkpoints can run BETWEEN trusted event listeners.
    // A zero-delay task observes all release listeners; transient activation is
    // checked again before requesting fullscreen (no long async work).
    window.setTimeout(() => {
      if (
        g.cancelled ||
        event.defaultPrevented ||
        !valid(g) ||
        !completed(g.start, p, g.direction)
      )
        return;
      // An earlier synchronous site request consumes transient activation even
      // if its fullscreenchange has not arrived yet. Do not issue a second one.
      if (
        g.direction === "up" &&
        navigator.userActivation &&
        !navigator.userActivation.isActive
      )
        return;
      if (g.direction === "up") controller.enter(g.root, g.video);
      else void controller.exit();
    }, 0);
  };

  // Window bubble sees target/document handlers before deciding. Never patch
  // addEventListener or fullscreen APIs to guess arbitrary site ownership.
  window.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const t = event.touches[0];
      start(event, "touch", t.identifier, t.clientX, t.clientY);
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const t = event.touches[0];
      if (gesture?.input === "touch" && gesture.id === t.identifier)
        move(event, t.clientX, t.clientY);
    },
    { passive: false },
  );
  window.addEventListener(
    "touchend",
    (event) => {
      const t = Array.from(event.changedTouches).find(
        (t) => gesture?.id === t.identifier,
      );
      if (gesture?.input === "touch" && t) end(event, t.clientX, t.clientY);
    },
    { passive: false },
  );
  window.addEventListener(
    "touchcancel",
    () => {
      gesture = null;
    },
    { passive: true },
  );
  window.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    if (event.button !== 0 || !event.isPrimary || gesture) {
      gesture = null;
      return;
    }
    start(event, "mouse", event.pointerId, event.clientX, event.clientY);
  });
  window.addEventListener("pointermove", (event) => {
    if (gesture?.input !== "mouse" || gesture.id !== event.pointerId) return;
    if (event.buttons !== 1) {
      gesture = null;
      return;
    }
    move(event, event.clientX, event.clientY);
  });
  window.addEventListener("pointerup", (event) => {
    if (gesture?.input === "mouse" && gesture.id === event.pointerId)
      end(event, event.clientX, event.clientY);
  });
  window.addEventListener("pointercancel", () => {
    gesture = null;
  });
  window.addEventListener(
    "click",
    (event) => {
      const path = event.composedPath();
      if (
        suppress &&
        performance.now() < suppress.until &&
        event.detail > 0 &&
        path.includes(suppress.root) &&
        !path.some((node) => node instanceof Element && node.matches(CONTROL))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppress = null;
      }
    },
    true,
  );
  window.addEventListener("blur", () => {
    gesture = null;
  });
  document.addEventListener(
    "scroll",
    () => {
      gesture = null;
    },
    { capture: true, passive: true },
  );
  window.addEventListener("pagehide", () => {
    gesture = null;
    controller.suspend();
  });
  window.addEventListener("popstate", () => {
    gesture = null;
    controller.reconcile();
  });
  new MutationObserver(() => controller.reconcile()).observe(
    document.documentElement,
    { childList: true, subtree: true },
  );
  // Shadow-root removal and pushState need reconciliation without patching page APIs.
  window.setInterval(() => {
    if (gesture && !valid(gesture)) gesture = null;
    controller.reconcile();
  }, 500);
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
