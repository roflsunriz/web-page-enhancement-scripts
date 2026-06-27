import {
  addStyle,
  getValue,
  registerMenuCommand,
  setValue,
  xmlHttpRequest,
} from "@/shared/userscript";
import {
  GM_download,
  type GmDownloadErrorEvent,
} from "vite-plugin-monkey/dist/client";
import { format, getTextDirection, t } from "./i18n";

type AudioExtension = "flac" | "m4a" | "aac" | "mp3";

type FetchState = "pending" | "running" | "done" | "failed" | "skipped";
type LaneState = "idle" | "active" | "done" | "failed";

type TrackPage = {
  index: number;
  title: string;
  url: string;
};

type DirectLinkResult = TrackPage & {
  state: FetchState;
  directUrl: string | null;
  extension: AudioExtension | null;
  error: string | null;
};

type DownloadTarget = {
  title: string;
  trackPageUrl: string;
  directUrl: string;
  extension: AudioExtension;
};

type GmTextResponse = {
  status: number;
  statusText: string;
  responseText: string;
  finalUrl: string;
  headers: string;
};

type GmHeadResponse = {
  status: number;
  statusText: string;
  finalUrl: string;
  headers: string;
};

const SCRIPT_ID = "khinsider-direct-link-saver";
const PANEL_ID = `${SCRIPT_ID}-panel`;
const STYLE_ID = `${SCRIPT_ID}-styles`;
const STORAGE_CONCURRENCY_KEY = `${SCRIPT_ID}:concurrency`;
const DEFAULT_CONCURRENCY = 4;
const MIN_CONCURRENCY = 1;
const MAX_CONCURRENCY = 12;
const REQUEST_TIMEOUT_MS = 30_000;
const TRACK_PAGE_EXTENSION = "mp3";
const AUDIO_EXTENSIONS = ["flac", "m4a", "aac", "mp3"] as const;
const AUDIO_EXTENSION_PRIORITIES: Record<AudioExtension, number> = {
  flac: 3,
  m4a: 2,
  aac: 2,
  mp3: 1,
};

let activeRunId = 0;
let activeDownloadRunId = 0;
let currentResults: DirectLinkResult[] = [];

function clampConcurrency(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONCURRENCY;
  }

  return Math.min(
    MAX_CONCURRENCY,
    Math.max(MIN_CONCURRENCY, Math.floor(value)),
  );
}

function getSavedConcurrency(): number {
  return clampConcurrency(
    getValue<number>(STORAGE_CONCURRENCY_KEY, DEFAULT_CONCURRENCY) ??
      DEFAULT_CONCURRENCY,
  );
}

function saveConcurrency(value: number): void {
  setValue(STORAGE_CONCURRENCY_KEY, clampConcurrency(value));
}

function getUrlExtension(urlText: string): AudioExtension | null {
  try {
    const url = new URL(urlText, window.location.href);
    const pathname = decodeURIComponent(url.pathname).toLowerCase();
    const extension = AUDIO_EXTENSIONS.find((candidate) =>
      pathname.endsWith(`.${candidate}`),
    );
    return extension ?? null;
  } catch {
    return null;
  }
}

function isKhinsiderAlbumTrackLink(link: HTMLAnchorElement): boolean {
  try {
    const url = new URL(link.href, window.location.href);
    return (
      url.hostname === window.location.hostname &&
      getUrlExtension(url.href) === TRACK_PAGE_EXTENSION
    );
  } catch {
    return false;
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getTrackTitle(link: HTMLAnchorElement, index: number): string {
  const linkText = normalizeText(link.textContent ?? "");
  if (
    linkText.length > 0 &&
    !/^\d+:\d+$/.test(linkText) &&
    !/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(linkText)
  ) {
    return linkText;
  }

  const row = link.closest("tr");
  const rowText = row ? normalizeText(row.textContent ?? "") : "";
  return rowText.length > 0
    ? rowText
    : `track-${String(index + 1).padStart(2, "0")}`;
}

function collectTrackPages(): TrackPage[] {
  const seenUrls = new Set<string>();
  const tracks: TrackPage[] = [];

  for (const link of Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a[href]"),
  )) {
    if (!isKhinsiderAlbumTrackLink(link)) {
      continue;
    }

    const url = new URL(link.href, window.location.href);
    url.hash = "";
    const normalizedUrl = url.href;
    if (seenUrls.has(normalizedUrl)) {
      continue;
    }

    seenUrls.add(normalizedUrl);
    tracks.push({
      index: tracks.length,
      title: getTrackTitle(link, tracks.length),
      url: normalizedUrl,
    });
  }

  return tracks;
}

function requestText(url: string): Promise<GmTextResponse> {
  return new Promise((resolve, reject) => {
    xmlHttpRequest({
      method: "GET",
      url,
      timeout: REQUEST_TIMEOUT_MS,
      responseType: "text",
      onload: (response) => {
        resolve({
          status: response.status,
          statusText: response.statusText,
          responseText: response.responseText,
          finalUrl: response.finalUrl,
          headers: response.responseHeaders,
        });
      },
      onerror: (error) => {
        const reason =
          typeof error.error === "string" ? error.error : "request failed";
        reject(new Error(reason));
      },
      ontimeout: () => {
        reject(new Error("request timeout"));
      },
    });
  });
}

function requestHead(url: string, refererUrl: string): Promise<GmHeadResponse> {
  return new Promise((resolve, reject) => {
    xmlHttpRequest({
      method: "HEAD",
      url,
      headers: {
        Referer: refererUrl,
      },
      timeout: REQUEST_TIMEOUT_MS,
      onload: (response) => {
        resolve({
          status: response.status,
          statusText: response.statusText,
          finalUrl: response.finalUrl,
          headers: response.responseHeaders,
        });
      },
      onerror: (error) => {
        const reason =
          typeof error.error === "string" ? error.error : "request failed";
        reject(new Error(reason));
      },
      ontimeout: () => {
        reject(new Error("HEAD request timeout"));
      },
    });
  });
}

function parseDocument(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

function getDirectAudioCandidates(
  document: Document,
  baseUrl: string,
): Array<{ url: string; extension: AudioExtension }> {
  const candidates: Array<{ url: string; extension: AudioExtension }> = [];
  const seenUrls = new Set<string>();

  function addCandidate(urlText: string | null): void {
    if (!urlText) {
      return;
    }

    const url = new URL(urlText, baseUrl);
    const extension = getUrlExtension(url.href);
    if (!extension || seenUrls.has(url.href)) {
      return;
    }

    seenUrls.add(url.href);
    candidates.push({ url: url.href, extension });
  }

  for (const downloadLabel of Array.from(
    document.querySelectorAll<HTMLElement>(".songDownloadLink"),
  )) {
    addCandidate(
      downloadLabel
        .closest<HTMLAnchorElement>("a[href]")
        ?.getAttribute("href") ?? null,
    );
  }

  for (const audio of Array.from(
    document.querySelectorAll<HTMLAudioElement>("audio[src]"),
  )) {
    addCandidate(audio.getAttribute("src"));
  }

  return candidates;
}

function chooseBestAudioCandidate(
  candidates: Array<{ url: string; extension: AudioExtension }>,
): { url: string; extension: AudioExtension } | null {
  return candidates.reduce<{ url: string; extension: AudioExtension } | null>(
    (best, candidate) => {
      if (!best) {
        return candidate;
      }

      const bestPriority = AUDIO_EXTENSION_PRIORITIES[best.extension];
      const candidatePriority = AUDIO_EXTENSION_PRIORITIES[candidate.extension];
      return candidatePriority > bestPriority ? candidate : best;
    },
    null,
  );
}

async function fetchDirectLink(track: TrackPage): Promise<DirectLinkResult> {
  const response = await requestText(track.url);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const document = parseDocument(response.responseText);
  const bestCandidate = chooseBestAudioCandidate(
    getDirectAudioCandidates(document, response.finalUrl || track.url),
  );
  if (!bestCandidate) {
    return {
      ...track,
      state: "skipped",
      directUrl: null,
      extension: null,
      error: t("noDirectAudio"),
    };
  }

  return {
    ...track,
    state: "done",
    directUrl: bestCandidate.url,
    extension: bestCandidate.extension,
    error: null,
  };
}

function createInitialResults(tracks: TrackPage[]): DirectLinkResult[] {
  return tracks.map((track) => ({
    ...track,
    state: "pending",
    directUrl: null,
    extension: null,
    error: null,
  }));
}

async function runConcurrent<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number, workerIndex: number) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;

  async function runWorker(workerIndex: number): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index], index, workerIndex);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(
    Array.from({ length: workerCount }, (_, workerIndex) =>
      runWorker(workerIndex),
    ),
  );
}

function toDownloadTargets(results: DirectLinkResult[]): DownloadTarget[] {
  return results
    .filter(
      (
        result,
      ): result is DirectLinkResult & {
        directUrl: string;
        extension: AudioExtension;
      } =>
        result.state === "done" &&
        result.directUrl !== null &&
        result.extension !== null,
    )
    .map((result) => ({
      title: result.title,
      trackPageUrl: result.url,
      directUrl: result.directUrl,
      extension: result.extension,
    }));
}

function sanitizeFileName(value: string): string {
  const invalidFileNameCharacters = new Set([
    "<",
    ">",
    ":",
    '"',
    "/",
    "\\",
    "|",
    "?",
    "*",
  ]);
  const sanitized = value
    .split("")
    .map((character) => {
      if (
        invalidFileNameCharacters.has(character) ||
        character.charCodeAt(0) < 32
      ) {
        return "_";
      }

      return character;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized.length > 0 ? sanitized : "track";
}

function createDownloadFileName(link: DownloadTarget, index: number): string {
  const prefix = String(index + 1).padStart(2, "0");
  return `${prefix} ${sanitizeFileName(link.title)}.${link.extension}`;
}

function parseHeaderValue(headers: string, name: string): string | null {
  const lowerName = name.toLowerCase();
  const line = headers
    .split(/\r?\n/)
    .find((headerLine) => headerLine.toLowerCase().startsWith(`${lowerName}:`));

  return line ? line.slice(line.indexOf(":") + 1).trim() : null;
}

function assertAudioResponse(
  response: GmHeadResponse,
  link: DownloadTarget,
): void {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const contentType = parseHeaderValue(response.headers, "content-type") ?? "";
  if (/text\/html/i.test(contentType)) {
    throw new Error(t("htmlResponse"));
  }

  if (!getUrlExtension(response.finalUrl || link.directUrl)) {
    throw new Error(
      t("nonAudioRedirect"),
    );
  }
}

function getPanel(): HTMLElement | null {
  return document.getElementById(PANEL_ID);
}

function setStatus(message: string): void {
  const status = getPanel()?.querySelector<HTMLElement>('[data-role="status"]');
  if (status) {
    status.textContent = message;
  }
}

function configureProgress(
  stage: string,
  totalCount: number,
  concurrency: number,
): void {
  const panel = getPanel();
  if (!panel) {
    return;
  }

  const progress = panel.querySelector<HTMLElement>('[data-role="progress"]');
  const overallBar = panel.querySelector<HTMLElement>(
    '[data-role="overall-bar"]',
  );
  const laneContainer = panel.querySelector<HTMLElement>('[data-role="lanes"]');
  const laneCount = Math.min(concurrency, totalCount);

  if (progress) {
    progress.hidden = totalCount === 0;
    progress.setAttribute("data-stage", stage);
  }
  if (overallBar) {
    overallBar.style.width = "0%";
  }
  if (laneContainer) {
    laneContainer.replaceChildren(
      ...Array.from({ length: laneCount }, (_, index) => {
        const lane = document.createElement("div");
        lane.className = `${SCRIPT_ID}__lane`;
        lane.dataset.lane = String(index);
        lane.dataset.state = "idle";
        lane.title = `${stage} worker ${index + 1}`;
        return lane;
      }),
    );
  }
}

function updateOverallProgress(
  completedCount: number,
  totalCount: number,
): void {
  const overallBar = getPanel()?.querySelector<HTMLElement>(
    '[data-role="overall-bar"]',
  );
  if (!overallBar) {
    return;
  }

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  overallBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
}

function setLaneState(workerIndex: number, state: LaneState): void {
  const lane = getPanel()?.querySelector<HTMLElement>(
    `[data-lane="${workerIndex}"]`,
  );
  if (lane) {
    lane.dataset.state = state;
  }
}

function updateProgress(results: DirectLinkResult[]): void {
  const doneCount = results.filter((result) => result.state === "done").length;
  const failedCount = results.filter(
    (result) => result.state === "failed",
  ).length;
  const skippedCount = results.filter(
    (result) => result.state === "skipped",
  ).length;
  const completedCount = doneCount + failedCount + skippedCount;
  const totalCount = results.length;

  updateOverallProgress(completedCount, totalCount);
  setStatus(
    format("parsingProgress", {
      completed: completedCount,
      total: totalCount,
      done: doneCount,
      failed: failedCount,
      skipped: skippedCount,
    }),
  );
}

function setRunning(running: boolean): void {
  const panel = getPanel();
  if (!panel) {
    return;
  }

  panel
    .querySelector<HTMLButtonElement>('[data-action="start-download"]')
    ?.toggleAttribute("disabled", running);
  panel
    .querySelector<HTMLButtonElement>('[data-action="stop"]')
    ?.toggleAttribute("disabled", !running);
  const concurrencyInput = panel.querySelector<HTMLInputElement>(
    '[data-role="concurrency"]',
  );
  if (concurrencyInput) {
    concurrencyInput.disabled = running;
  }
}

async function startExtraction(): Promise<DownloadTarget[]> {
  const runId = activeRunId + 1;
  activeRunId = runId;

  const tracks = collectTrackPages();
  if (tracks.length === 0) {
    currentResults = [];
    setStatus(t("noTrackLinks"));
    return [];
  }

  const concurrency = getSavedConcurrency();
  currentResults = createInitialResults(tracks);
  setRunning(true);
  configureProgress(t("parsingStage"), tracks.length, concurrency);
  updateProgress(currentResults);

  await runConcurrent(
    tracks,
    concurrency,
    async (track, index, workerIndex) => {
      if (activeRunId !== runId) {
        return;
      }

      setLaneState(workerIndex, "active");
      currentResults[index] = { ...currentResults[index], state: "running" };
      updateProgress(currentResults);

      try {
        currentResults[index] = await fetchDirectLink(track);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "unknown error";
        currentResults[index] = {
          ...track,
          state: "failed",
          directUrl: null,
          extension: null,
          error: message,
        };
      }

      setLaneState(
        workerIndex,
        currentResults[index].state === "done" ? "done" : "failed",
      );
      updateProgress(currentResults);
    },
  );

  if (activeRunId !== runId) {
    setStatus(t("stopped"));
    setRunning(false);
    return [];
  }

  const downloadTargets = toDownloadTargets(currentResults);
  updateOverallProgress(tracks.length, tracks.length);
  setStatus(
    format("parsingComplete", {
      found: downloadTargets.length,
      total: tracks.length,
    }),
  );
  setRunning(false);
  return downloadTargets;
}

function stopExtraction(): void {
  activeRunId += 1;
  setRunning(false);
  setStatus(t("stopPending"));
}

function downloadStoredLink(
  link: DownloadTarget,
  fileName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    void (async () => {
      const response = await requestHead(link.directUrl, link.trackPageUrl);
      assertAudioResponse(response, link);

      GM_download({
        url: response.finalUrl || link.directUrl,
        name: fileName,
        saveAs: false,
        onload: () => {
          resolve();
        },
        onerror: (error: GmDownloadErrorEvent) => {
          reject(new Error(`download failed: ${error.error}`));
        },
        ontimeout: () => {
          reject(new Error("download timeout"));
        },
      });
    })().catch((error: unknown) => {
      reject(error instanceof Error ? error : new Error("download failed"));
    });
  });
}

async function downloadSavedFiles(links: DownloadTarget[]): Promise<void> {
  const runId = activeDownloadRunId + 1;
  activeDownloadRunId = runId;

  if (links.length === 0) {
    setStatus(t("noAudioLinks"));
    return;
  }

  const concurrency = getSavedConcurrency();
  let completedCount = 0;
  let failedCount = 0;

  setRunning(true);
  configureProgress(t("downloadStage"), links.length, concurrency);
  setStatus(format("downloading", { completed: 0, total: links.length }));

  await runConcurrent(links, concurrency, async (link, index, workerIndex) => {
    if (activeDownloadRunId !== runId) {
      return;
    }

    setLaneState(workerIndex, "active");
    try {
      await downloadStoredLink(link, createDownloadFileName(link, index));
      completedCount += 1;
      setLaneState(workerIndex, "done");
    } catch {
      failedCount += 1;
      setLaneState(workerIndex, "failed");
    }

    updateOverallProgress(completedCount + failedCount, links.length);
    setStatus(
      format("downloadProgress", {
        processed: completedCount + failedCount,
        total: links.length,
        completed: completedCount,
        failed: failedCount,
      }),
    );
  });

  if (activeDownloadRunId !== runId) {
    setStatus(t("downloadStopped"));
    setRunning(false);
    return;
  }

  updateOverallProgress(links.length, links.length);
  setStatus(
    format("downloadComplete", {
      completed: completedCount,
      failed: failedCount,
    }),
  );
  setRunning(false);
}

async function extractAndDownload(): Promise<void> {
  const links = await startExtraction();
  if (links.length > 0) {
    await downloadSavedFiles(links);
  }
}

function createPanel(): HTMLElement {
  const panel = document.createElement("section");
  panel.id = PANEL_ID;
  panel.dir = getTextDirection();
  panel.innerHTML = `
    <div class="${SCRIPT_ID}__header">
      <strong>KHInsider Audio Saver</strong>
      <button type="button" data-action="hide" title="${t("close")}">×</button>
    </div>
    <div class="${SCRIPT_ID}__controls">
      <label>
        ${t("concurrency")}
        <input type="number" min="${MIN_CONCURRENCY}" max="${MAX_CONCURRENCY}" step="1" value="${getSavedConcurrency()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start-download">${t("startSave")}</button>
      <button type="button" data-action="stop" disabled>${t("stop")}</button>
    </div>
    <div class="${SCRIPT_ID}__status" data-role="status">${t("idle")}</div>
    <div class="${SCRIPT_ID}__progress" data-role="progress" hidden>
      <div class="${SCRIPT_ID}__overall">
        <div class="${SCRIPT_ID}__overall-bar" data-role="overall-bar"></div>
      </div>
      <div class="${SCRIPT_ID}__lanes" data-role="lanes"></div>
    </div>
  `;

  panel
    .querySelector<HTMLButtonElement>('[data-action="start-download"]')
    ?.addEventListener("click", () => {
      void extractAndDownload();
    });
  panel
    .querySelector<HTMLButtonElement>('[data-action="stop"]')
    ?.addEventListener("click", () => {
      stopExtraction();
      activeDownloadRunId += 1;
    });
  panel
    .querySelector<HTMLButtonElement>('[data-action="hide"]')
    ?.addEventListener("click", () => {
      panel.hidden = true;
    });
  const concurrencyInput = panel.querySelector<HTMLInputElement>(
    '[data-role="concurrency"]',
  );
  concurrencyInput?.addEventListener("change", () => {
    const concurrency = clampConcurrency(Number(concurrencyInput.value));
    concurrencyInput.value = String(concurrency);
    saveConcurrency(concurrency);
  });

  document.body.append(panel);
  return panel;
}

function showPanel(): void {
  const panel = getPanel() ?? createPanel();
  panel.hidden = false;
}

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  addStyle(`
    #${PANEL_ID} {
      background: #fff;
      border: 1px solid #9ca3af;
      border-radius: 8px;
      box-shadow: 0 12px 32px rgb(0 0 0 / 24%);
      color: #111827;
      font: 13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      max-width: min(560px, calc(100vw - 24px));
      padding: 12px;
      position: fixed;
      right: 16px;
      top: 16px;
      width: 520px;
      z-index: 999999;
    }

    #${PANEL_ID}[hidden] {
      display: none;
    }

    .${SCRIPT_ID}__header,
    .${SCRIPT_ID}__controls {
      align-items: center;
      display: flex;
      gap: 8px;
    }

    .${SCRIPT_ID}__header {
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .${SCRIPT_ID}__controls {
      flex-wrap: wrap;
    }

    #${PANEL_ID} button,
    #${PANEL_ID} input {
      font: inherit;
    }

    #${PANEL_ID} button {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #111827;
      cursor: pointer;
      min-height: 28px;
      padding: 4px 9px;
    }

    #${PANEL_ID} button:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    #${PANEL_ID} button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    #${PANEL_ID} label {
      align-items: center;
      display: inline-flex;
      gap: 5px;
    }

    #${PANEL_ID} input[type="number"] {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      min-height: 28px;
      padding: 3px 6px;
      width: 56px;
    }

    .${SCRIPT_ID}__status {
      color: #374151;
      margin-top: 10px;
    }

    .${SCRIPT_ID}__progress {
      margin-top: 10px;
    }

    .${SCRIPT_ID}__progress[hidden] {
      display: none;
    }

    .${SCRIPT_ID}__overall {
      background: #e5e7eb;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      width: 100%;
    }

    .${SCRIPT_ID}__overall-bar {
      background: #2563eb;
      height: 100%;
      transition: width 180ms ease;
      width: 0%;
    }

    .${SCRIPT_ID}__lanes {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
      margin-top: 8px;
    }

    .${SCRIPT_ID}__lane {
      background: #e5e7eb;
      border-radius: 999px;
      height: 6px;
      overflow: hidden;
      position: relative;
    }

    .${SCRIPT_ID}__lane::before {
      background: #9ca3af;
      content: "";
      inset: 0;
      position: absolute;
      transform: translateX(-100%);
    }

    .${SCRIPT_ID}__lane[data-state="active"]::before {
      animation: ${SCRIPT_ID}-lane 850ms linear infinite;
      background: linear-gradient(90deg, transparent, #2563eb, transparent);
      width: 80%;
    }

    .${SCRIPT_ID}__lane[data-state="done"]::before {
      background: #16a34a;
      transform: translateX(0);
    }

    .${SCRIPT_ID}__lane[data-state="failed"]::before {
      background: #dc2626;
      transform: translateX(0);
    }

    @keyframes ${SCRIPT_ID}-lane {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(140%);
      }
    }
  `);

  const marker = document.createElement("meta");
  marker.id = STYLE_ID;
  document.head.append(marker);
}

function initialize(): void {
  injectStyles();
  registerMenuCommand(t("openPanel"), showPanel);
  registerMenuCommand(t("fetchAndSave"), () => {
    showPanel();
    void extractAndDownload();
  });
  showPanel();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
