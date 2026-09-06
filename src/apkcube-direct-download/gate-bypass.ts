/**
 * apkcube.com のダウンロード導線に被さる邪魔要素を抑止するページコンテキスト処理。
 *
 * 抑止対象（2026-09-06 実測・公式バンドル de-minify の根拠付き）:
 * - `/ads/banner-ad.js` への広告ブロッカー探知 fetch（`1529` の `l()`）。
 *   成功応答に `__ad_probe_ok__` が無いと検出扱いになるため、
 *   同パスへの fetch を先回りして探知マーカー入りの 200 応答を返す。
 * - `#ad-banner` の bait 要素計測。非表示・除去で検出扱いになるため、
 *   可視寸法を強制し、計測値の取得（`getComputedStyle` / `offsetHeight` /
 *   `offsetWidth`）と除去に介入する。
 * - 30 秒カウントダウンモーダル（`downloadFlow.adblock*`、`adblockWaitSeconds:30`）。
 *   非フォーカス時に「一時停止中」で止まる（`!document.hidden && document.hasFocus()`）
 *   ため、ダウンロードページに限り可視状態として扱わせる。
 * - `/loader.js`（難読化の広告エンジン）と外部広告ホスト
 *   （adbpage / adexchangerapid / skecaaztypvqr / usrpubtrk）への通信・
 *   ポップアップ。ダウンロード本体（Next.js チャンクと
 *   `POST /api/downloads/request` → `location.assign`）とは無関係。
 *
 * やらないこと: Turnstile / 長押し検証 / PoW といった不正対策の突破、
 * ダウンロード自体の自動クリック。ダウンロードは利用者のクリックを起点にする。
 */
import {
  AD_SLOT_SELECTORS,
  BAIT_ID,
  PROBE_MARKER,
  SCRIPT_ID,
  isBaitElement,
  isBlockedHost,
  isBlockedScriptSrc,
  isDownloadPage,
  isProbeRequest,
} from "./selectors";

type WindowWithFlag = Window & {
  [SCRIPT_ID]?: boolean;
};

const BAIT_WIDTH_PX = 10;
const BAIT_HEIGHT_PX = 10;

function markInstalled(): boolean {
  const windowWithFlag = window as unknown as WindowWithFlag;
  if (windowWithFlag[SCRIPT_ID]) {
    return false;
  }

  windowWithFlag[SCRIPT_ID] = true;
  return true;
}

function createProbeResponse(): Response {
  return new Response(
    `/* ${SCRIPT_ID}: decoy for ad-blocker detection */\nwindow.${PROBE_MARKER} = true;`,
    {
      status: 200,
      headers: { "content-type": "text/javascript" },
    },
  );
}

function getRequestUrlText(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

/** 探知 fetch を成功扱いにし、広告ホストへの fetch を空応答で終わらせる。 */
function installFetchHook(): void {
  const originalFetch = window.fetch.bind(window);

  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const urlText = getRequestUrlText(input);

    if (isProbeRequest(urlText)) {
      return Promise.resolve(createProbeResponse());
    }

    if (isBlockedHost(urlText)) {
      return Promise.resolve(new Response("", { status: 204 }));
    }

    return originalFetch(input, init);
  }) as typeof window.fetch;
}

/** 広告ホストへの XHR / sendBeacon を無害化する。 */
function installXhrHook(): void {
  type OpenFunction = (
    method: string,
    url: string | URL,
    async?: boolean,
    user?: string | null,
    password?: string | null,
  ) => void;
  const originalOpen: OpenFunction = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    asyncFlag = true,
    user: string | null = null,
    password: string | null = null,
  ): void {
    const urlText = url instanceof URL ? url.href : url;
    const safeUrl = isBlockedHost(urlText) ? "data:text/plain," : url;
    Reflect.apply(originalOpen, this, [
      method,
      safeUrl,
      asyncFlag,
      user,
      password,
    ]);
  };

  if (typeof navigator.sendBeacon === "function") {
    const originalBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url: string | URL, data?: BodyInit | null) => {
      const urlText = url instanceof URL ? url.href : url;
      if (isBlockedHost(urlText)) {
        return false;
      }

      return originalBeacon(url, data);
    };
  }
}

/** 広告ホストへの `window.open` だけを抑止する。同一タブ遷移は触らない。 */
function installPopupGuard(): void {
  const originalOpen = window.open.bind(window);

  window.open = ((
    url?: string | URL | null,
    target?: string,
    features?: string,
  ): WindowProxy | null => {
    if (url === null || url === undefined) {
      return null;
    }

    const urlText = String(url);
    if (urlText === "" || isBlockedHost(urlText)) {
      return null;
    }

    return originalOpen(url, target, features);
  }) as typeof window.open;
}

function forceBaitVisible(element: HTMLElement): void {
  element.style.setProperty("position", "absolute", "important");
  element.style.setProperty("left", "-9999px", "important");
  element.style.setProperty("top", "0", "important");
  element.style.setProperty("width", `${BAIT_WIDTH_PX}px`, "important");
  element.style.setProperty("height", `${BAIT_HEIGHT_PX}px`, "important");
  element.style.setProperty("display", "block", "important");
  element.style.setProperty("visibility", "visible", "important");
  element.style.setProperty("opacity", "1", "important");
  element.style.setProperty("pointer-events", "none", "important");
}

/**
 * bait 要素の除去を元に戻す。計測は rAF 二回後に行われるため、
 * MutationObserver（microtask）での復旧が間に合う。
 */
function guardBaitRemoval(mutations: MutationRecord[]): void {
  for (const mutation of Array.from(mutations)) {
    for (const node of Array.from(mutation.removedNodes)) {
      if (
        node instanceof HTMLElement &&
        node.id === BAIT_ID &&
        document.body &&
        !node.isConnected
      ) {
        forceBaitVisible(node);
        document.body.append(node);
      }
    }

    for (const node of Array.from(mutation.addedNodes)) {
      if (node instanceof HTMLElement) {
        if (isBaitElement(node)) {
          forceBaitVisible(node);
        }

        for (const bait of Array.from(
          node.querySelectorAll<HTMLElement>(`#${BAIT_ID}`),
        )) {
          if (isBaitElement(bait)) {
            forceBaitVisible(bait);
          }
        }
      }
    }
  }
}

/**
 * bait への計算スタイル参照を可視値で応答させる。
 * フィルターのユーザー CSS（`!important`）で隠されている場合の予備層。
 */
function installBaitStyleGuard(): void {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);

  window.getComputedStyle = ((
    element: Element,
    pseudoElt?: string | null,
  ): CSSStyleDeclaration => {
    const style = originalGetComputedStyle(element, pseudoElt ?? undefined);
    if (
      !(element instanceof HTMLElement) ||
      element.id !== BAIT_ID ||
      (pseudoElt !== null && pseudoElt !== undefined && pseudoElt !== "")
    ) {
      return style;
    }

    return new Proxy(style, {
      get(target: CSSStyleDeclaration, property: string | symbol) {
        if (property === "display") {
          return "block";
        }

        if (property === "visibility") {
          return "visible";
        }

        if (property === "opacity") {
          return "1";
        }

        if (property === "getPropertyValue") {
          return (name: string): string => {
            if (name === "display") {
              return "block";
            }

            if (name === "visibility") {
              return "visible";
            }

            if (name === "opacity") {
              return "1";
            }

            return target.getPropertyValue(name);
          };
        }

        const value: unknown = Reflect.get(target, property, target);
        return typeof value === "function"
          ? (value as () => unknown).bind(target)
          : value;
      },
    });
  }) as typeof window.getComputedStyle;

  const heightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight",
  );
  const widthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  );
  const heightGetter = heightDescriptor?.get;
  const widthGetter = widthDescriptor?.get;

  if (typeof heightGetter === "function") {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      get(this: HTMLElement): number {
        if (this.id === BAIT_ID) {
          return BAIT_HEIGHT_PX;
        }

        return (heightGetter as () => number).call(this);
      },
    });
  }

  if (typeof widthGetter === "function") {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get(this: HTMLElement): number {
        if (this.id === BAIT_ID) {
          return BAIT_WIDTH_PX;
        }

        return (widthGetter as () => number).call(this);
      },
    });
  }
}

/**
 * カウントダウンの「一時停止中」を解消するため、ダウンロードページに限り
 * 可視・フォーカス状態として扱わせる。対象は公式の待機条件
 *（`!document.hidden && document.hasFocus()`）のみ。
 */
function installCountdownUnpauser(): void {
  if (!isDownloadPage(window.location.pathname)) {
    return;
  }

  try {
    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
  } catch {
    // ネイティブのまま。可視タブでは待機条件を満たす。
  }

  try {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  } catch {
    // ネイティブのまま。可視タブでは待機条件を満たす。
  }

  try {
    document.hasFocus = () => true;
  } catch {
    // ネイティブのまま。可視タブでは待機条件を満たす。
  }
}

function removeBlockedScripts(root: ParentNode): void {
  for (const script of Array.from(
    root.querySelectorAll<HTMLScriptElement>("script[src]"),
  )) {
    if (isBlockedScriptSrc(script.getAttribute("src"))) {
      script.remove();
    }
  }
}

function startDomObserver(): void {
  if (!document.documentElement) {
    return;
  }

  removeBlockedScripts(document);

  const observer = new MutationObserver((mutations) => {
    guardBaitRemoval(mutations);

    for (const mutation of Array.from(mutations)) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLElement) {
          removeBlockedScripts(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

/**
 * 広告スロットだけを非表示にする。bait のクラス・ID は使わない。
 * 使うと検出を自ら引き起こすため、`selectors.test.mjs` でも衝突を検査する。
 */
function injectAdSlotStyles(): void {
  const styleId = `${SCRIPT_ID}-styles`;
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `${AD_SLOT_SELECTORS.join(",\n")} {
      display: none !important;
    }`;

  const parent = document.head ?? document.documentElement;
  parent.append(style);
}

export function installGateBypass(): void {
  if (!markInstalled()) {
    return;
  }

  installFetchHook();
  installXhrHook();
  installPopupGuard();
  installBaitStyleGuard();
  installCountdownUnpauser();

  // `document-start`（特に CDP の起動時注入）では documentElement がまだ無い
  // 場合がある。DOM 依存の処理は要素ができてから行う。
  if (document.documentElement) {
    injectAdSlotStyles();
    startDomObserver();
    return;
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      injectAdSlotStyles();
      startDomObserver();
    },
    { once: true },
  );
}
