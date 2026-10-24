import {
  BLOCKED_AVAILABILITY_EVENT,
  isBlockedAvailabilityCode,
} from "./availability-signal";
import {
  resolveAlternativeSources,
  type AlternativeSource,
} from "./alternative-sources";
import { MESSAGES, isRtlLocale, resolveLocale } from "./i18n";
import { getApkCubePagePackageName, isValidPackageName } from "./links";
import { requestProviderPage } from "./provider-request";

const HOST_ID = "apkcube-alternative-downloads";
const BLOCKED_NOTICE_SELECTOR =
  ".border-warning-border.bg-warning-soft.text-warning-ink.rounded-sm.font-medium";

let signaledPackageName: string | null = null;
let lookupKey: string | null = null;
let scanQueued = false;

export function isBlockedStoreNotice(element: Element): boolean {
  return (
    element.matches(BLOCKED_NOTICE_SELECTOR) &&
    element.querySelector(":scope > div > p") !== null
  );
}

function findBlockedNotice(): HTMLElement | null {
  for (const element of document.querySelectorAll<HTMLElement>(
    BLOCKED_NOTICE_SELECTOR,
  )) {
    if (isBlockedStoreNotice(element)) {
      return element;
    }
  }
  return null;
}

function getPagePackageName(): string | null {
  const playLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      'a[href*="play.google.com/store/apps/details"]',
    ),
    (link) => link.href,
  );
  return (
    getApkCubePagePackageName(window.location.href, playLinks) ??
    signaledPackageName
  );
}

function createAlternativePanel(
  packageName: string,
  sources: AlternativeSource[],
): HTMLElement {
  const locale = resolveLocale(navigator.language);
  const messages = MESSAGES[locale];
  const host = document.createElement("aside");
  host.id = HOST_ID;
  host.setAttribute("data-package-name", packageName);
  host.setAttribute("dir", isRtlLocale(locale) ? "rtl" : "ltr");
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { color-scheme: light dark; display: block; margin-top: 12px; font-family: Arial, "Noto Sans", sans-serif; }
    * { box-sizing: border-box; }
    section { border: 1px solid rgb(128 128 128 / 35%); border-radius: 12px; padding: 14px; color: CanvasText; background: Canvas; }
    h2 { margin: 0; font-size: 15px; line-height: 1.35; }
    p { margin: 5px 0 0; font-size: 12px; line-height: 1.5; opacity: .76; }
    .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 8px; margin-top: 12px; }
    a { display: flex; min-height: 48px; flex-direction: column; justify-content: center; border: 1px solid rgb(128 128 128 / 35%); border-radius: 10px; padding: 9px 11px; color: CanvasText; background: rgb(128 128 128 / 10%); text-decoration: none; }
    a strong { font-size: 13px; }
    a span { margin-top: 2px; font-size: 10px; opacity: .72; }
    .caution { font-size: 10px; opacity: .62; }
    a:focus-visible { outline: 3px solid #4285f4; outline-offset: 2px; }
    @media (prefers-reduced-motion: no-preference) { a { transition: transform 120ms ease, background 120ms ease; } a:hover { background: rgb(128 128 128 / 18%); } a:active { transform: translateY(1px); } }
  `;

  const section = document.createElement("section");
  const title = document.createElement("h2");
  title.id = `${HOST_ID}-title`;
  title.textContent = messages.alternativeTitle;
  section.setAttribute("aria-labelledby", title.id);

  const description = document.createElement("p");
  description.textContent = messages.alternativeDescription;
  const links = document.createElement("div");
  links.className = "links";
  for (const source of sources) {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer nofollow";
    link.setAttribute("data-provider", source.id);
    const name = document.createElement("strong");
    name.textContent = source.name;
    const action = document.createElement("span");
    action.textContent = messages.alternativeAction;
    link.append(name, action);
    links.append(link);
  }

  const caution = document.createElement("p");
  caution.className = "caution";
  caution.textContent = messages.alternativeCaution;
  section.append(title, description, links, caution);
  shadow.append(style, section);
  return host;
}

async function scan(): Promise<void> {
  scanQueued = false;
  const notice = findBlockedNotice();
  const packageName = getPagePackageName();
  const existing = document.getElementById(HOST_ID);
  if (!notice || !packageName) {
    existing?.remove();
    return;
  }

  const key = `${window.location.href}\n${packageName}`;
  if (lookupKey === key) {
    return;
  }
  lookupKey = key;
  existing?.remove();

  const sources = await resolveAlternativeSources(
    packageName,
    requestProviderPage,
  );
  if (
    sources.length === 0 ||
    lookupKey !== key ||
    !notice.isConnected ||
    getPagePackageName() !== packageName
  ) {
    return;
  }

  notice.insertAdjacentElement(
    "afterend",
    createAlternativePanel(packageName, sources),
  );
}

function queueScan(): void {
  if (scanQueued) {
    return;
  }
  scanQueued = true;
  queueMicrotask(() => void scan());
}

function onBlockedAvailability(event: Event): void {
  if (!(event instanceof CustomEvent)) {
    return;
  }
  const detail: unknown = event.detail;
  if (typeof detail !== "object" || detail === null) {
    return;
  }

  const record = detail as Record<string, unknown>;
  const packageName = record["packageName"];
  const code = record["code"];
  if (
    typeof packageName === "string" &&
    isValidPackageName(packageName) &&
    isBlockedAvailabilityCode(code)
  ) {
    signaledPackageName = packageName;
    lookupKey = null;
    queueScan();
  }
}

export function startBlockedDownloadRecovery(): void {
  window.addEventListener(BLOCKED_AVAILABILITY_EVENT, onBlockedAvailability);
  const start = (): void => {
    queueScan();
    const observer = new MutationObserver(queueScan);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
}
