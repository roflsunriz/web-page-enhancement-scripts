import {
  addStyle,
  getValue,
  registerMenuCommand,
  setClipboard,
  setValue,
  xmlHttpRequest,
} from '@/shared/userscript';

type AudioExtension = 'flac' | 'm4a' | 'aac' | 'mp3';

type FetchState = 'pending' | 'running' | 'done' | 'failed' | 'skipped';

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

type StoredDirectLink = {
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
};

const SCRIPT_ID = 'khinsider-direct-link-saver';
const PANEL_ID = `${SCRIPT_ID}-panel`;
const STYLE_ID = `${SCRIPT_ID}-styles`;
const STORAGE_LINKS_KEY = `${SCRIPT_ID}:links`;
const STORAGE_CONCURRENCY_KEY = `${SCRIPT_ID}:concurrency`;
const DEFAULT_CONCURRENCY = 4;
const MIN_CONCURRENCY = 1;
const MAX_CONCURRENCY = 12;
const REQUEST_TIMEOUT_MS = 30_000;
const TRACK_PAGE_EXTENSION = 'mp3';
const AUDIO_EXTENSIONS = ['flac', 'm4a', 'aac', 'mp3'] as const;
const AUDIO_EXTENSION_PRIORITIES: Record<AudioExtension, number> = {
  flac: 3,
  m4a: 2,
  aac: 2,
  mp3: 1,
};

let activeRunId = 0;
let currentResults: DirectLinkResult[] = [];

function clampConcurrency(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONCURRENCY;
  }

  return Math.min(MAX_CONCURRENCY, Math.max(MIN_CONCURRENCY, Math.floor(value)));
}

function getSavedConcurrency(): number {
  return clampConcurrency(getValue<number>(STORAGE_CONCURRENCY_KEY, DEFAULT_CONCURRENCY) ?? DEFAULT_CONCURRENCY);
}

function saveConcurrency(value: number): void {
  setValue(STORAGE_CONCURRENCY_KEY, clampConcurrency(value));
}

function getStoredLinks(): StoredDirectLink[] {
  return getValue<StoredDirectLink[]>(STORAGE_LINKS_KEY, []) ?? [];
}

function saveStoredLinks(links: StoredDirectLink[]): void {
  setValue(STORAGE_LINKS_KEY, links);
}

function getUrlExtension(urlText: string): AudioExtension | null {
  try {
    const url = new URL(urlText, window.location.href);
    const pathname = decodeURIComponent(url.pathname).toLowerCase();
    const extension = AUDIO_EXTENSIONS.find((candidate) => pathname.endsWith(`.${candidate}`));
    return extension ?? null;
  } catch {
    return null;
  }
}

function isKhinsiderAlbumTrackLink(link: HTMLAnchorElement): boolean {
  try {
    const url = new URL(link.href, window.location.href);
    return url.hostname === window.location.hostname && getUrlExtension(url.href) === TRACK_PAGE_EXTENSION;
  } catch {
    return false;
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function getTrackTitle(link: HTMLAnchorElement, index: number): string {
  const linkText = normalizeText(link.textContent ?? '');
  if (linkText.length > 0 && !/^\d+:\d+$/.test(linkText) && !/^\d+(?:\.\d+)?\s*(?:kb|mb|gb)$/i.test(linkText)) {
    return linkText;
  }

  const row = link.closest('tr');
  const rowText = row ? normalizeText(row.textContent ?? '') : '';
  return rowText.length > 0 ? rowText : `track-${String(index + 1).padStart(2, '0')}`;
}

function collectTrackPages(): TrackPage[] {
  const seenUrls = new Set<string>();
  const tracks: TrackPage[] = [];

  for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
    if (!isKhinsiderAlbumTrackLink(link)) {
      continue;
    }

    const url = new URL(link.href, window.location.href);
    url.hash = '';
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
      method: 'GET',
      url,
      timeout: REQUEST_TIMEOUT_MS,
      responseType: 'text',
      onload: (response) => {
        resolve({
          status: response.status,
          statusText: response.statusText,
          responseText: response.responseText,
          finalUrl: response.finalUrl,
        });
      },
      onerror: (error) => {
        const reason = typeof error.error === 'string' ? error.error : 'request failed';
        reject(new Error(reason));
      },
      ontimeout: () => {
        reject(new Error('request timeout'));
      },
    });
  });
}

function parseDocument(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

function getDirectAudioCandidates(document: Document, baseUrl: string): Array<{ url: string; extension: AudioExtension }> {
  const candidates: Array<{ url: string; extension: AudioExtension }> = [];
  const seenUrls = new Set<string>();

  for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
    const url = new URL(link.getAttribute('href') ?? '', baseUrl);
    const extension = getUrlExtension(url.href);
    if (!extension || seenUrls.has(url.href)) {
      continue;
    }

    seenUrls.add(url.href);
    candidates.push({ url: url.href, extension });
  }

  return candidates;
}

function chooseBestAudioCandidate(
  candidates: Array<{ url: string; extension: AudioExtension }>,
): { url: string; extension: AudioExtension } | null {
  return candidates.reduce<{ url: string; extension: AudioExtension } | null>((best, candidate) => {
    if (!best) {
      return candidate;
    }

    const bestPriority = AUDIO_EXTENSION_PRIORITIES[best.extension];
    const candidatePriority = AUDIO_EXTENSION_PRIORITIES[candidate.extension];
    return candidatePriority > bestPriority ? candidate : best;
  }, null);
}

async function fetchDirectLink(track: TrackPage): Promise<DirectLinkResult> {
  const response = await requestText(track.url);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const document = parseDocument(response.responseText);
  const bestCandidate = chooseBestAudioCandidate(getDirectAudioCandidates(document, response.finalUrl || track.url));
  if (!bestCandidate) {
    return {
      ...track,
      state: 'skipped',
      directUrl: null,
      extension: null,
      error: '音声ファイルの直リンクが見つかりません',
    };
  }

  return {
    ...track,
    state: 'done',
    directUrl: bestCandidate.url,
    extension: bestCandidate.extension,
    error: null,
  };
}

function createInitialResults(tracks: TrackPage[]): DirectLinkResult[] {
  return tracks.map((track) => ({
    ...track,
    state: 'pending',
    directUrl: null,
    extension: null,
    error: null,
  }));
}

async function runConcurrent<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;

  async function runWorker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index], index);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
}

function toStoredLinks(results: DirectLinkResult[]): StoredDirectLink[] {
  return results
    .filter((result): result is DirectLinkResult & { directUrl: string; extension: AudioExtension } =>
      result.state === 'done' && result.directUrl !== null && result.extension !== null,
    )
    .map((result) => ({
      title: result.title,
      trackPageUrl: result.url,
      directUrl: result.directUrl,
      extension: result.extension,
    }));
}

function formatStoredLinks(links: StoredDirectLink[]): string {
  return links.map((link) => link.directUrl).join('\n');
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

function updateOutput(): void {
  const panel = getPanel();
  if (!panel) {
    return;
  }

  const links = currentResults.length > 0 ? toStoredLinks(currentResults) : getStoredLinks();
  const output = panel.querySelector<HTMLTextAreaElement>('[data-role="output"]');
  const copyButton = panel.querySelector<HTMLButtonElement>('[data-action="copy"]');
  const clearButton = panel.querySelector<HTMLButtonElement>('[data-action="clear"]');

  if (output) {
    output.value = formatStoredLinks(links);
  }
  if (copyButton) {
    copyButton.disabled = links.length === 0;
  }
  if (clearButton) {
    clearButton.disabled = links.length === 0;
  }
}

function updateProgress(results: DirectLinkResult[]): void {
  const doneCount = results.filter((result) => result.state === 'done').length;
  const failedCount = results.filter((result) => result.state === 'failed').length;
  const skippedCount = results.filter((result) => result.state === 'skipped').length;
  const completedCount = doneCount + failedCount + skippedCount;
  const totalCount = results.length;

  setStatus(`取得中: ${completedCount}/${totalCount} 保存 ${doneCount} 失敗 ${failedCount} スキップ ${skippedCount}`);
  updateOutput();
}

function setRunning(running: boolean): void {
  const panel = getPanel();
  if (!panel) {
    return;
  }

  panel.querySelector<HTMLButtonElement>('[data-action="start"]')?.toggleAttribute('disabled', running);
  panel.querySelector<HTMLButtonElement>('[data-action="stop"]')?.toggleAttribute('disabled', !running);
  const concurrencyInput = panel.querySelector<HTMLInputElement>('[data-role="concurrency"]');
  if (concurrencyInput) {
    concurrencyInput.disabled = running;
  }
}

async function startExtraction(): Promise<void> {
  const runId = activeRunId + 1;
  activeRunId = runId;

  const tracks = collectTrackPages();
  if (tracks.length === 0) {
    currentResults = [];
    saveStoredLinks([]);
    updateOutput();
    setStatus('末尾が.mp3の曲ページリンクが見つかりません');
    return;
  }

  const concurrency = getSavedConcurrency();
  currentResults = createInitialResults(tracks);
  setRunning(true);
  updateProgress(currentResults);

  await runConcurrent(tracks, concurrency, async (track, index) => {
    if (activeRunId !== runId) {
      return;
    }

    currentResults[index] = { ...currentResults[index], state: 'running' };
    updateProgress(currentResults);

    try {
      currentResults[index] = await fetchDirectLink(track);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      currentResults[index] = {
        ...track,
        state: 'failed',
        directUrl: null,
        extension: null,
        error: message,
      };
    }

    updateProgress(currentResults);
  });

  if (activeRunId !== runId) {
    setStatus('停止しました');
    setRunning(false);
    return;
  }

  const storedLinks = toStoredLinks(currentResults);
  saveStoredLinks(storedLinks);
  updateOutput();
  setStatus(`完了: ${storedLinks.length}/${tracks.length}件の直リンクを保存しました`);
  setRunning(false);
}

function stopExtraction(): void {
  activeRunId += 1;
  setRunning(false);
  setStatus('停止しました。進行中のリクエストは完了後に破棄されます');
}

function copySavedLinks(): void {
  const links = currentResults.length > 0 ? toStoredLinks(currentResults) : getStoredLinks();
  setClipboard(formatStoredLinks(links));
  setStatus(`${links.length}件の直リンクをコピーしました`);
}

function clearSavedLinks(): void {
  currentResults = [];
  saveStoredLinks([]);
  updateOutput();
  setStatus('保存済みリンクを削除しました');
}

function createPanel(): HTMLElement {
  const panel = document.createElement('section');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <div class="${SCRIPT_ID}__header">
      <strong>KHInsider Direct Links</strong>
      <button type="button" data-action="hide" title="閉じる">×</button>
    </div>
    <div class="${SCRIPT_ID}__controls">
      <label>
        並列
        <input type="number" min="${MIN_CONCURRENCY}" max="${MAX_CONCURRENCY}" step="1" value="${getSavedConcurrency()}" data-role="concurrency">
      </label>
      <button type="button" data-action="start">取得</button>
      <button type="button" data-action="stop" disabled>停止</button>
      <button type="button" data-action="copy">コピー</button>
      <button type="button" data-action="clear">削除</button>
    </div>
    <div class="${SCRIPT_ID}__status" data-role="status">待機中</div>
    <textarea class="${SCRIPT_ID}__output" data-role="output" spellcheck="false"></textarea>
  `;

  panel.querySelector<HTMLButtonElement>('[data-action="start"]')?.addEventListener('click', () => {
    void startExtraction();
  });
  panel.querySelector<HTMLButtonElement>('[data-action="stop"]')?.addEventListener('click', stopExtraction);
  panel.querySelector<HTMLButtonElement>('[data-action="copy"]')?.addEventListener('click', copySavedLinks);
  panel.querySelector<HTMLButtonElement>('[data-action="clear"]')?.addEventListener('click', clearSavedLinks);
  panel.querySelector<HTMLButtonElement>('[data-action="hide"]')?.addEventListener('click', () => {
    panel.hidden = true;
  });
  const concurrencyInput = panel.querySelector<HTMLInputElement>('[data-role="concurrency"]');
  concurrencyInput?.addEventListener('change', () => {
    const concurrency = clampConcurrency(Number(concurrencyInput.value));
    concurrencyInput.value = String(concurrency);
    saveConcurrency(concurrency);
  });

  document.body.append(panel);
  updateOutput();
  return panel;
}

function showPanel(): void {
  const panel = getPanel() ?? createPanel();
  panel.hidden = false;
  updateOutput();
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
      margin: 10px 0 8px;
    }

    .${SCRIPT_ID}__output {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      box-sizing: border-box;
      font: 12px/1.45 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
      height: 180px;
      resize: vertical;
      width: 100%;
    }
  `);

  const marker = document.createElement('meta');
  marker.id = STYLE_ID;
  document.head.append(marker);
}

function initialize(): void {
  injectStyles();
  registerMenuCommand('KHInsider直リンク抽出パネルを開く', showPanel);
  registerMenuCommand('KHInsider直リンク抽出を開始', () => {
    showPanel();
    void startExtraction();
  });
  showPanel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
