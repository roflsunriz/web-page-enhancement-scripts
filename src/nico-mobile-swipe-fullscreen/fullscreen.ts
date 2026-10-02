type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};
type Session = {
  root: HTMLElement;
  video: HTMLVideoElement;
  href: string;
  locked: boolean;
  cancelled: boolean;
  marks: HTMLElement[];
};

const messages = {
  ja: {
    unsupported:
      "このブラウザでは上スワイプ全画面に対応していません。動画の全画面ボタンを使ってください。",
    enter: "全画面にできませんでした。動画の全画面ボタンを試してください。",
    rotate: "横画面ロックを利用できません。端末を横に回転してください。",
    exit: "全画面を解除できませんでした。ブラウザの戻る操作・Esc・全画面ボタンを使ってください。",
  },
  en: {
    unsupported:
      "Swipe fullscreen is unavailable in this browser. Use the video fullscreen button.",
    enter: "Could not enter fullscreen. Try the video fullscreen button.",
    rotate: "Landscape lock is unavailable. Rotate your device manually.",
    exit: "Could not exit fullscreen. Use Back, Escape, or the fullscreen button.",
  },
};

export class FullscreenController {
  private session: Session | null = null;
  private pending = false;
  private toast: HTMLElement | null = null;
  private toastTimer = 0;

  constructor() {
    const style = document.createElement("style");
    style.textContent = `
      [data-nico-swipe-fullscreen]:fullscreen { background: #000; }
      [data-nico-swipe-fullscreen]:fullscreen [data-nico-swipe-fill] {
        /* Leave the site's inline letterboxing and comment layout intact. */
        position: absolute; inset: 0; width: 100%; height: 100%;
      }
      [data-nico-swipe-fullscreen]:fullscreen video[data-name="video-content"] {
        object-fit: contain;
      }
    `;
    document.head.append(style);
    document.addEventListener("fullscreenchange", () => this.reconcile());
  }

  isActive(video: HTMLVideoElement) {
    return (
      this.session?.video === video &&
      !this.session.cancelled &&
      document.fullscreenElement === this.session.root
    );
  }

  activeRoot(video: HTMLVideoElement) {
    return this.isActive(video) ? this.session?.root : null;
  }

  private notify(key: keyof typeof messages.en) {
    this.toast?.remove();
    window.clearTimeout(this.toastTimer);
    const toast = document.createElement("div");
    toast.setAttribute("role", "status");
    toast.textContent =
      messages[navigator.language.startsWith("ja") ? "ja" : "en"][key];
    toast.style.cssText =
      "position:fixed;inset:12px 12px auto;z-index:2147483647;background:#222;color:white;padding:12px;border-radius:8px;font:14px/1.5 sans-serif;pointer-events:none;";
    (document.fullscreenElement ?? document.body).append(toast);
    this.toast = toast;
    this.toastTimer = window.setTimeout(() => toast.remove(), 5000);
  }

  // Called synchronously from touchend/pointerup: do not wait before requesting
  // fullscreen, because requestFullscreen consumes transient user activation.
  enter(root: HTMLElement, video: HTMLVideoElement) {
    if (this.pending || document.fullscreenElement || this.session) return;
    if (!root.requestFullscreen || !document.fullscreenEnabled) {
      this.notify("unsupported");
      return;
    }
    const session: Session = {
      root,
      video,
      href: location.href,
      locked: false,
      cancelled: false,
      marks: [],
    };
    root.setAttribute("data-nico-swipe-fullscreen", "");
    for (
      let node: HTMLElement | null = video.parentElement;
      node && node !== root;
      node = node.parentElement
    ) {
      node.setAttribute("data-nico-swipe-fill", "");
      session.marks.push(node);
    }
    this.session = session;
    this.pending = true;
    try {
      void root
        .requestFullscreen()
        .then(async () => {
          if (!this.valid(session)) {
            if (document.fullscreenElement === root)
              await document.exitFullscreen();
            this.clear(session);
            return;
          }
          const orientation = screen.orientation as
            LockableOrientation | undefined;
          if (!orientation?.lock) {
            this.notify("rotate");
            return;
          }
          try {
            await orientation.lock("landscape");
            session.locked = true;
            if (!this.valid(session)) this.unlock(session);
          } catch (error: unknown) {
            if (this.valid(session)) {
              console.info(
                "[nico-mobile-swipe-fullscreen] Orientation lock unavailable",
                error,
              );
              this.notify("rotate");
            }
          }
        })
        .catch((error: unknown) => {
          console.warn(
            "[nico-mobile-swipe-fullscreen] Fullscreen request failed",
            error,
          );
          this.clear(session);
          if (!session.cancelled) this.notify("enter");
        })
        .finally(() => {
          this.pending = false;
          this.reconcile();
        });
    } catch (error: unknown) {
      console.warn(
        "[nico-mobile-swipe-fullscreen] Fullscreen request failed",
        error,
      );
      this.clear(session);
      this.pending = false;
      this.notify("enter");
    }
  }

  private valid(session: Session) {
    return (
      !session.cancelled &&
      session.href === location.href &&
      session.root.isConnected &&
      session.video.isConnected &&
      session.root.contains(session.video) &&
      document.fullscreenElement === session.root
    );
  }

  async exit() {
    const session = this.session;
    if (!session || document.fullscreenElement !== session.root) return;
    try {
      await document.exitFullscreen();
      this.clear(session);
    } catch (error: unknown) {
      console.warn(
        "[nico-mobile-swipe-fullscreen] Fullscreen exit failed",
        error,
      );
      this.notify("exit");
    }
  }

  private unlock(session: Session) {
    if (!session.locked) return;
    session.locked = false;
    try {
      screen.orientation?.unlock();
    } catch (error: unknown) {
      console.warn(
        "[nico-mobile-swipe-fullscreen] Orientation unlock failed",
        error,
      );
    }
  }

  private clear(session: Session) {
    this.unlock(session);
    session.root.removeAttribute("data-nico-swipe-fullscreen");
    for (const node of session.marks)
      node.removeAttribute("data-nico-swipe-fill");
    if (this.session === session) this.session = null;
    this.toast?.remove();
  }

  reconcile() {
    const session = this.session;
    if (!session) return;
    if (
      session.href !== location.href ||
      !session.video.isConnected ||
      !session.root.isConnected
    ) {
      session.cancelled = true;
      void this.exit();
      this.clear(session);
    } else if (!this.pending && document.fullscreenElement !== session.root) {
      session.cancelled = true;
      this.clear(session);
    }
  }

  suspend() {
    const session = this.session;
    if (session) {
      session.cancelled = true;
      void this.exit();
      this.clear(session);
    }
  }
}
