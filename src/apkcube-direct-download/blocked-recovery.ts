import {
  BLOCKED_AVAILABILITY_EVENT,
  isBlockedAvailabilityCode,
} from "./availability-signal";
import {
  resolveAlternativeSources,
  selectPreferredAlternativeSource,
} from "./alternative-sources";
import { getApkCubePagePackageName, isValidPackageName } from "./links";
import { requestProviderPage } from "./provider-request";

const BLOCKED_NOTICE_SELECTOR =
  ".border-warning-border.bg-warning-soft.text-warning-ink.font-medium";

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

async function scan(): Promise<void> {
  scanQueued = false;
  const notice = findBlockedNotice();
  const packageName = getPagePackageName();
  if (!notice || !packageName) {
    return;
  }

  const key = `${window.location.href}\n${packageName}`;
  if (lookupKey === key) {
    return;
  }
  lookupKey = key;

  const sources = await resolveAlternativeSources(
    packageName,
    requestProviderPage,
  );
  const preferred = selectPreferredAlternativeSource(sources);
  if (
    !preferred ||
    lookupKey !== key ||
    !notice.isConnected ||
    getPagePackageName() !== packageName
  ) {
    return;
  }

  window.location.replace(preferred.url);
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
