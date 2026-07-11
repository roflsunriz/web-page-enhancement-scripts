import { addVideoScreenStateEventGuards } from "./screen-state-spoofer";

const VIDEO_SELECTOR = "video";
const INSTALLATION_KEY = Symbol.for(
  "videoScreenOffDetectionBlocker.videoObserverStarted",
);

const getGlobalState = (): Record<PropertyKey, unknown> =>
  window as unknown as Record<PropertyKey, unknown>;

class VideoObserver {
  private readonly guardedVideos = new WeakSet<HTMLVideoElement>();
  private readonly observedRoots = new WeakSet<Document | ShadowRoot>();

  public start(): void {
    this.observeFutureShadowRoots();
    this.observeRoot(document);
  }

  private observeRoot(root: Document | ShadowRoot): void {
    if (this.observedRoots.has(root)) {
      return;
    }

    this.observedRoots.add(root);
    this.scanRoot(root);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => this.scanNode(node));
      });
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  private scanRoot(root: Document | ShadowRoot): void {
    root.querySelectorAll<HTMLVideoElement>(VIDEO_SELECTOR).forEach((video) => {
      this.guardVideo(video);
    });

    root.querySelectorAll<Element>("*").forEach((element) => {
      this.observeOpenShadowRoot(element);
    });
  }

  private scanNode(node: Node): void {
    if (node instanceof HTMLVideoElement) {
      this.guardVideo(node);
    }

    if (!(node instanceof Element)) {
      return;
    }

    this.observeOpenShadowRoot(node);

    node.querySelectorAll<HTMLVideoElement>(VIDEO_SELECTOR).forEach((video) => {
      this.guardVideo(video);
    });

    node.querySelectorAll<Element>("*").forEach((element) => {
      this.observeOpenShadowRoot(element);
    });
  }

  private observeOpenShadowRoot(element: Element): void {
    if (element.shadowRoot !== null) {
      this.observeRoot(element.shadowRoot);
    }
  }

  private observeFutureShadowRoots(): void {
    const nativeAttachShadow = Element.prototype.attachShadow;
    const observeRoot = (shadowRoot: ShadowRoot): void =>
      this.observeRoot(shadowRoot);

    Object.defineProperty(Element.prototype, "attachShadow", {
      configurable: true,
      writable: true,
      value: function (this: Element, init: ShadowRootInit): ShadowRoot {
        const shadowRoot = nativeAttachShadow.call(this, init);
        observeRoot(shadowRoot);
        return shadowRoot;
      },
    });
  }

  private guardVideo(video: HTMLVideoElement): void {
    if (this.guardedVideos.has(video)) {
      return;
    }

    this.guardedVideos.add(video);
    addVideoScreenStateEventGuards(video);
  }
}

export const startVideoObserver = (): void => {
  const globalState = getGlobalState();

  if (globalState[INSTALLATION_KEY] === true) {
    return;
  }

  globalState[INSTALLATION_KEY] = true;
  new VideoObserver().start();
};
