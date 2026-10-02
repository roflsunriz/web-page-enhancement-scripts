import { contains, fullscreenElement, parent } from "./player";
import { message } from "./settings";

type Orientation = ScreenOrientation & {
  lock?: (value: "landscape") => Promise<void>;
};
type StyleChange = {
  element: HTMLElement;
  property: string;
  value: string;
  priority: string;
  applied: string;
};
type Session = {
  root: HTMLElement;
  video: HTMLVideoElement;
  href: string;
  cancelled: boolean;
  locked: boolean;
  styles: StyleChange[];
};

export class FullscreenController {
  private session: Session | null = null;
  private pending = false;
  private exiting = false;
  private locking = false;
  private toast: HTMLElement | null = null;
  private timer = 0;
  epoch = 0;

  constructor() {
    document.addEventListener("fullscreenchange", () => {
      this.epoch++;
      this.reconcile();
    });
  }

  activeRoot(video: HTMLVideoElement): HTMLElement | null {
    const s = this.session;
    return s && s.video === video && this.valid(s) ? s.root : null;
  }

  private notify(key: "unsupported" | "enter" | "rotate" | "exit") {
    this.toast?.remove();
    window.clearTimeout(this.timer);
    const toast = document.createElement("div");
    toast.dataset.videoSwipeStatus = key;
    toast.setAttribute("role", "status");
    toast.dir = "auto";
    toast.textContent = message(key);
    toast.style.cssText =
      "position:fixed;inset:12px 12px auto;margin:0;border:0;z-index:2147483647;background:#222;color:white;padding:12px;border-radius:8px;font:14px/1.5 sans-serif;pointer-events:none;";
    // A video is a replaced element: status appended inside it is not rendered.
    const fs = fullscreenElement();
    (fs && !(fs instanceof HTMLVideoElement) ? fs : document.body).append(
      toast,
    );
    if (
      fs instanceof HTMLVideoElement &&
      typeof toast.showPopover === "function"
    ) {
      // A manual popover joins the top layer above a fullscreen video. Normal
      // descendants of body would be hidden behind that replaced element.
      toast.setAttribute("popover", "manual");
      try {
        toast.showPopover();
      } catch (error: unknown) {
        console.info(
          "[video-swipe-fullscreen] Status overlay unavailable",
          error,
        );
      }
    }
    this.toast = toast;
    this.timer = window.setTimeout(() => toast.remove(), 5000);
  }

  private valid(s: Session): boolean {
    return (
      !s.cancelled &&
      s.href === location.href &&
      s.root.isConnected &&
      s.video.isConnected &&
      contains(s.root, s.video) &&
      fullscreenElement() === s.root
    );
  }

  private style(
    s: Session,
    element: HTMLElement,
    property: string,
    value: string,
  ) {
    s.styles.push({
      element,
      property,
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property),
      applied: value,
    });
    // Owned fullscreen only; restore previous value/priority on every exit path.
    element.style.setProperty(property, value, "important");
  }

  private fit(s: Session) {
    this.style(s, s.root, "background-color", "rgb(0, 0, 0)");
    this.style(s, s.video, "object-fit", "contain");
    for (
      let node: Element | null = s.video;
      node && node !== s.root;
      node = parent(node)
    ) {
      if (!(node instanceof HTMLElement)) continue;
      const zeroHeight = node.getBoundingClientRect().height === 0;
      this.style(s, node, "width", "100%");
      this.style(s, node, "height", "100%");
      if (node !== s.video && zeroHeight) {
        this.style(s, node, "position", "absolute");
        this.style(s, node, "inset", "0px");
      }
    }
    s.root.setAttribute("data-video-swipe-fullscreen", "");
  }

  // The next task after release sees later listeners' cancellation. Standard
  // transient activation is checked by the caller before this request.
  enter(root: HTMLElement, video: HTMLVideoElement) {
    if (this.pending || this.locking || this.session || fullscreenElement())
      return;
    if (!root.requestFullscreen || !document.fullscreenEnabled) {
      this.notify("unsupported");
      return;
    }
    const s: Session = {
      root,
      video,
      href: location.href,
      cancelled: false,
      locked: false,
      styles: [],
    };
    this.session = s;
    this.pending = true;
    try {
      void root
        .requestFullscreen()
        .then(async () => {
          if (!this.valid(s)) {
            if (fullscreenElement() === root) await document.exitFullscreen();
            this.clear(s);
            return;
          }
          this.fit(s);
          const orientation = screen.orientation as Orientation | undefined;
          if (!orientation?.lock) {
            this.notify("rotate");
            return;
          }
          this.locking = true;
          try {
            await orientation.lock("landscape");
            s.locked = true;
            if (!this.valid(s)) this.unlock(s);
          } catch (error: unknown) {
            if (this.valid(s)) {
              console.info(
                "[video-swipe-fullscreen] Landscape unavailable",
                error,
              );
              this.notify("rotate");
            }
          } finally {
            this.locking = false;
          }
        })
        .catch((error: unknown) => {
          console.warn("[video-swipe-fullscreen] Fullscreen failed", error);
          this.clear(s);
          if (!s.cancelled) this.notify("enter");
        })
        .finally(() => {
          this.pending = false;
          this.reconcile();
        });
    } catch (error: unknown) {
      console.warn("[video-swipe-fullscreen] Fullscreen failed", error);
      this.clear(s);
      this.pending = false;
      this.notify("enter");
    }
  }

  async exit() {
    const s = this.session;
    if (!s || this.exiting || fullscreenElement() !== s.root) return;
    this.exiting = true;
    try {
      await document.exitFullscreen();
      this.clear(s);
    } catch (error: unknown) {
      console.warn("[video-swipe-fullscreen] Exit failed", error);
      this.notify("exit");
    } finally {
      this.exiting = false;
    }
  }

  private unlock(s: Session) {
    if (!s.locked) return;
    s.locked = false;
    try {
      screen.orientation?.unlock();
    } catch (error: unknown) {
      console.warn("[video-swipe-fullscreen] Unlock failed", error);
    }
  }

  private clear(s: Session) {
    this.unlock(s);
    s.root.removeAttribute("data-video-swipe-fullscreen");
    for (const change of [...s.styles].reverse()) {
      const { element, property, value, priority, applied } = change;
      if (
        element.style.getPropertyValue(property) === applied &&
        element.style.getPropertyPriority(property) === "important"
      ) {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      }
    }
    s.styles = [];
    if (this.session === s) this.session = null;
    this.toast?.remove();
  }

  reconcile() {
    const s = this.session;
    if (!s) return;
    if (
      s.href !== location.href ||
      !s.root.isConnected ||
      !s.video.isConnected ||
      !contains(s.root, s.video)
    ) {
      s.cancelled = true;
      void this.exit();
      this.clear(s);
    } else if (
      fullscreenElement() !== s.root &&
      (!this.pending || s.styles.length > 0)
    ) {
      s.cancelled = true;
      this.clear(s);
    }
  }

  suspend() {
    const s = this.session;
    if (s) {
      s.cancelled = true;
      void this.exit();
      this.clear(s);
    }
  }
}
