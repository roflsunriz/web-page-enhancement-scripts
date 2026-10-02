import { completed, intent, type Direction, type Point } from "./gesture";
import { FullscreenController } from "./fullscreen";

const VIDEO = 'video[data-name="video-content"]';
const CONTROL =
  'button, a, input, select, textarea, [contenteditable], [role="button"], [role="slider"], [role="menu"], [role="dialog"]';
type Gesture = {
  id: number;
  input: "touch" | "mouse";
  start: Point;
  video: HTMLVideoElement;
  root: HTMLElement;
  href: string;
  direction: Direction;
  claimed: boolean;
  cancelled: boolean;
};

// The mobile site uses hashed CSS classes. Use the observed data-name marker
// and same-size ancestors instead. Stop before related buttons/page content.
export function playerRoot(video: HTMLVideoElement) {
  const rect = video.getBoundingClientRect();
  let root: HTMLElement = video;
  let node = video.parentElement;
  for (
    let depth = 0;
    node && depth < 8 && node !== document.body;
    depth++, node = node.parentElement
  ) {
    if (node.querySelectorAll(VIDEO).length !== 1) break;
    const box = node.getBoundingClientRect();
    if (box.height === 0) continue;
    if (
      Math.abs(box.x - rect.x) > 4 ||
      Math.abs(box.y - rect.y) > 4 ||
      Math.abs(box.width - rect.width) > 4 ||
      Math.abs(box.height - rect.height) > 4
    )
      break;
    root = node;
  }
  return root;
}

function boot() {
  if (window.top !== window.self || location.hostname !== "sp.nicovideo.jp")
    return;
  // DOM marker works across userscript sandboxes and gives this dedicated
  // player implementation priority over video-swipe-fullscreen on watch pages.
  const marker = "data-nico-mobile-swipe-owner";
  if (document.documentElement.hasAttribute(marker)) return;
  document.documentElement.setAttribute(marker, "1");
  const controller = new FullscreenController();
  let gesture: Gesture | null = null;
  let suppress: { root: HTMLElement; until: number } | null = null;
  const watch = () => /^\/watch\/[^/]+\/?$/.test(location.pathname);
  const point = (x: number, y: number): Point => ({
    x,
    y,
    time: performance.now(),
  });

  const start = (
    event: Event,
    input: Gesture["input"],
    id: number,
    x: number,
    y: number,
  ) => {
    if (
      !watch() ||
      event.defaultPrevented ||
      !(event.target instanceof Element) ||
      event.target.closest(CONTROL)
    )
      return;
    controller.reconcile();
    for (const video of document.querySelectorAll<HTMLVideoElement>(VIDEO)) {
      const rect = video.getBoundingClientRect();
      // Leave edge controls (including native controls) and seek bars untouched.
      const insetX = Math.max(24, rect.width * 0.1);
      const insetY = Math.max(32, rect.height * 0.18);
      if (
        rect.width < 120 ||
        rect.height < 100 ||
        getComputedStyle(video).visibility !== "visible" ||
        x < rect.left + insetX ||
        x > rect.right - insetX ||
        y < rect.top + insetY ||
        y > rect.bottom - insetY
      )
        continue;
      const activeRoot = controller.activeRoot(video);
      const root = activeRoot ?? playerRoot(video);
      if (!root.contains(event.target)) continue;
      // The site's transparent tap surface is a sibling of the stage. Accept
      // non-control surfaces inside this player; buttons/sliders remain excluded.
      const active = !!activeRoot;
      if (document.fullscreenElement && !active) return;
      gesture = {
        id,
        input,
        start: point(x, y),
        video,
        root,
        href: location.href,
        direction: active ? "down" : "up",
        claimed: false,
        cancelled: false,
      };
      return;
    }
  };

  const valid = (g: Gesture) =>
    watch() &&
    g.href === location.href &&
    g.video.isConnected &&
    g.root.isConnected &&
    g.root.contains(g.video) &&
    (g.direction === "down"
      ? controller.isActive(g.video)
      : !document.fullscreenElement);

  const move = (event: Event, x: number, y: number) => {
    const g = gesture;
    if (!g) return;
    const p = point(x, y);
    if (
      !valid(g) ||
      intent(g.start, p, g.direction) === "cancel" ||
      (!g.claimed && event.defaultPrevented)
    ) {
      if (!g.claimed) {
        gesture = null;
        return;
      }
      g.cancelled = true;
    }
    if (intent(g.start, p, g.direction) === "pending") return;
    // If scrolling has already won, do not turn it into fullscreen.
    if (!event.cancelable) {
      gesture = null;
      return;
    }
    g.claimed = true;
    event.preventDefault();
    event.stopPropagation();
  };

  const end = (event: Event, x: number, y: number) => {
    const g = gesture;
    gesture = null;
    if (!g?.claimed) return;
    suppress = { root: g.root, until: performance.now() + 400 };
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    if (
      g.cancelled ||
      !valid(g) ||
      !completed(g.start, point(x, y), g.direction)
    )
      return;
    if (g.direction === "up") controller.enter(g.root, g.video);
    else void controller.exit();
  };

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const t = event.touches[0];
      start(event, "touch", t.identifier, t.clientX, t.clientY);
    },
    { capture: true, passive: true },
  );
  document.addEventListener(
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
    { capture: true, passive: false },
  );
  document.addEventListener(
    "touchend",
    (event) => {
      const t = Array.from(event.changedTouches).find(
        (t) => gesture?.id === t.identifier,
      );
      if (gesture?.input === "touch" && t) end(event, t.clientX, t.clientY);
    },
    { capture: true, passive: false },
  );
  document.addEventListener(
    "touchcancel",
    () => {
      gesture = null;
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse") return;
      if (event.button !== 0 || !event.isPrimary || gesture) {
        gesture = null;
        return;
      }
      start(event, "mouse", event.pointerId, event.clientX, event.clientY);
    },
    true,
  );
  document.addEventListener(
    "pointermove",
    (event) => {
      if (gesture?.input !== "mouse" || gesture.id !== event.pointerId) return;
      if (event.buttons !== 1) {
        gesture = null;
        return;
      }
      move(event, event.clientX, event.clientY);
    },
    true,
  );
  document.addEventListener(
    "pointerup",
    (event) => {
      if (gesture?.input === "mouse" && gesture.id === event.pointerId)
        end(event, event.clientX, event.clientY);
    },
    true,
  );
  document.addEventListener(
    "pointercancel",
    () => {
      gesture = null;
    },
    true,
  );
  document.addEventListener(
    "click",
    (event) => {
      if (
        suppress &&
        performance.now() < suppress.until &&
        event.target instanceof Node &&
        suppress.root.contains(event.target) &&
        event.detail > 0 &&
        !(event.target instanceof Element && event.target.closest(CONTROL))
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
  // Delegation automatically handles replacement videos; observer/poll only
  // release owned fullscreen/locks on removal or history.pushState navigation.
  new MutationObserver(() => controller.reconcile()).observe(document.body, {
    childList: true,
    subtree: true,
  });
  window.setInterval(() => controller.reconcile(), 500);
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();
