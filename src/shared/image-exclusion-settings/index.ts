import type { ScriptSettingsCustomSectionContext } from "@/shared/script-settings";
import { gmRequest } from "@/shared/network/gmHttp";
import {
  collectPageImageCandidates,
  scanPageImageCandidates,
  type PageImageCandidate,
} from "@/shared/page-image-candidates";
import { getValue, setValue } from "@/shared/userscript";

const STORAGE_KEY_PREFIX = "image-exclusion-fingerprints-";
const LEGACY_MANGA_VIEWER_STORAGE_KEY =
  "manga-viewer-image-exclusion-fingerprints";
const HASH_SIZE = 64;
const PIXEL_HASH_ALGORITHM = `sha256-rgba-${HASH_SIZE}x${HASH_SIZE}`;
const scannedCandidateCache = new Map<string, PageImageCandidate[]>();

type ImageExclusionFingerprint = {
  id: string;
  enabled: boolean;
  pageHost: string;
  host: string;
  path: string;
  sourceUrl?: string;
  pixelHash?: string;
  pixelHashAlgorithm?: string;
  width?: number;
  height?: number;
  label?: string;
  createdAt: string;
};

type ImageCandidate = {
  url: string;
  pageHost: string;
  host: string;
  path: string;
  pixelHash?: string;
  pixelHashAlgorithm?: string;
  width?: number;
  height?: number;
};

export function isUserExcludedImage(
  scriptId: string,
  url: string,
  width?: number,
  height?: number,
  context: { pageHost?: string } = {},
): boolean {
  const candidate = parseCandidate(
    url,
    context.pageHost ?? window.location.host,
  );
  if (!candidate) return false;

  return getImageExclusionFingerprints(scriptId).some((fingerprint) => {
    if (!fingerprint.enabled) return false;
    if (fingerprint.pageHost && fingerprint.pageHost !== candidate.pageHost) {
      return false;
    }
    if (
      fingerprint.host !== candidate.host ||
      fingerprint.path !== candidate.path
    ) {
      return false;
    }
    if (
      fingerprint.width !== undefined &&
      width !== undefined &&
      fingerprint.width !== width
    ) {
      return false;
    }
    if (
      fingerprint.height !== undefined &&
      height !== undefined &&
      fingerprint.height !== height
    ) {
      return false;
    }
    return true;
  });
}

export function hasUserImageHashExclusions(scriptId: string): boolean {
  return getImageExclusionFingerprints(scriptId).some(
    (fingerprint) =>
      fingerprint.enabled &&
      fingerprint.pixelHash !== undefined &&
      fingerprint.pixelHashAlgorithm === PIXEL_HASH_ALGORITHM,
  );
}

export async function isUserExcludedImageByPixelHash(
  scriptId: string,
  url: string,
  context: { pageHost?: string } = {},
): Promise<boolean> {
  const candidate = parseCandidate(
    url,
    context.pageHost ?? window.location.host,
  );
  if (!candidate) return false;

  const fingerprints = getImageExclusionFingerprints(scriptId).filter(
    (fingerprint) =>
      fingerprint.enabled &&
      fingerprint.pixelHash !== undefined &&
      fingerprint.pixelHashAlgorithm === PIXEL_HASH_ALGORITHM &&
      (!fingerprint.pageHost || fingerprint.pageHost === candidate.pageHost),
  );
  if (fingerprints.length === 0) return false;

  const hashed = await createPixelHashCandidate(candidate);
  if (!hashed) return false;

  return fingerprints.some(
    (fingerprint) =>
      fingerprint.pixelHash === hashed.pixelHash &&
      fingerprint.pixelHashAlgorithm === hashed.pixelHashAlgorithm &&
      (fingerprint.width === undefined ||
        hashed.width === undefined ||
        fingerprint.width === hashed.width) &&
      (fingerprint.height === undefined ||
        hashed.height === undefined ||
        fingerprint.height === hashed.height),
  );
}

export function createImageExclusionSettingsSection(
  context: ScriptSettingsCustomSectionContext,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ss-section";

  const title = document.createElement("h3");
  title.textContent = "不要画像の指紋";
  section.appendChild(title);

  const description = document.createElement("div");
  description.className = "ss-empty";
  description.textContent =
    "登録した画像と同じ画素ハッシュ、または同じ host/path の画像を収集対象から除外します。";
  section.appendChild(description);

  section.append(
    createManualForm(context),
    createFingerprintList(context),
    createCandidateList(context),
  );

  return section;
}

function createManualForm(
  context: ScriptSettingsCustomSectionContext,
): HTMLElement {
  const form = document.createElement("form");
  form.className = "ss-rule-form";

  const input = document.createElement("input");
  input.name = "image-url";
  input.type = "text";
  input.placeholder = "除外したい画像URL";

  const button = document.createElement("button");
  button.type = "submit";
  button.className = "ss-primary";
  button.textContent = "URLからハッシュ登録";

  form.append(input, button);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidate = parseCandidate(input.value, context.currentUrl.hostname);
    if (!candidate) return;
    button.disabled = true;
    button.textContent = "計算中...";
    const hashed = await createPixelHashCandidate(candidate);
    addFingerprint(context.scriptId, hashed ?? candidate);
    context.notifySettingsChanged();
    context.render();
  });

  return form;
}

function createFingerprintList(
  context: ScriptSettingsCustomSectionContext,
): HTMLElement {
  const list = document.createElement("div");
  list.className = "ss-rule-list";
  const fingerprints = getImageExclusionFingerprints(context.scriptId);

  if (fingerprints.length === 0) {
    const empty = document.createElement("div");
    empty.className = "ss-empty";
    empty.textContent = "不要画像の指紋はまだありません。";
    list.appendChild(empty);
    return list;
  }

  fingerprints.forEach((fingerprint) => {
    const row = document.createElement("div");
    row.className = "ss-rule-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = fingerprint.enabled;
    checkbox.addEventListener("change", () => {
      updateFingerprint(context.scriptId, fingerprint.id, {
        enabled: checkbox.checked,
      });
      context.notifySettingsChanged();
      context.render();
    });

    const label = document.createElement("div");
    label.className = "ss-rule-label";
    const type = document.createElement("span");
    type.className = "ss-rule-type";
    type.textContent = `${fingerprint.host}${formatSize(fingerprint)}`;
    const pattern = document.createElement("span");
    pattern.textContent = fingerprint.path;
    const hash = document.createElement("span");
    hash.textContent = fingerprint.pixelHash
      ? `${fingerprint.pixelHashAlgorithm}: ${fingerprint.pixelHash}`
      : "URL指紋のみ";
    label.append(type, pattern, hash);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ss-danger";
    remove.textContent = "削除";
    remove.addEventListener("click", () => {
      removeFingerprint(context.scriptId, fingerprint.id);
      context.notifySettingsChanged();
      context.render();
    });

    row.append(checkbox, label, remove);
    list.appendChild(row);
  });

  return list;
}

function createCandidateList(
  context: ScriptSettingsCustomSectionContext,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "ss-rule-list";
  const title = document.createElement("div");
  title.className = "ss-empty";
  title.textContent = "現在ページの画像候補";
  wrapper.appendChild(title);

  const scanButton = document.createElement("button");
  scanButton.type = "button";
  scanButton.className = "ss-secondary";
  scanButton.textContent = "ページをスキャンして候補更新";
  scanButton.addEventListener("click", async () => {
    scanButton.disabled = true;
    scanButton.textContent = "スキャン中...";
    const scanned = await scanPageImageCandidates({
      dynamicWaitMs: 1500,
      scroll: {
        enabled: true,
        maxScrolls: 12,
        stepRatio: 0.8,
        delayMs: 300,
        stopAfterNoNewScans: 3,
      },
    });
    scannedCandidateCache.set(getCandidateCacheKey(context), scanned);
    context.render();
  });
  wrapper.appendChild(scanButton);

  const candidates = collectImageCandidates(context.currentUrl.hostname);
  const count = document.createElement("div");
  count.className = "ss-empty";
  count.textContent = `候補: ${candidates.length}件`;
  wrapper.appendChild(count);
  if (candidates.length === 0) {
    const empty = document.createElement("div");
    empty.className = "ss-empty";
    empty.textContent = "登録できる画像候補が見つかりません。";
    wrapper.appendChild(empty);
    return wrapper;
  }

  candidates.forEach((candidate) => {
    const row = document.createElement("div");
    row.className = "ss-rule-row";
    row.dataset.imageExclusionCandidate = "true";

    const preview = document.createElement("img");
    preview.src = candidate.url;
    preview.alt = "";
    preview.loading = "lazy";
    preview.style.width = "64px";
    preview.style.height = "64px";
    preview.style.objectFit = "contain";
    preview.style.background = "#f3f4f6";
    preview.style.borderRadius = "6px";

    const label = document.createElement("div");
    label.className = "ss-rule-label";
    const meta = document.createElement("span");
    meta.className = "ss-rule-type";
    meta.textContent = `${candidate.host}${formatSize(candidate)}`;
    const path = document.createElement("span");
    path.textContent = candidate.path;
    const hash = document.createElement("span");
    hash.textContent = "ハッシュ未計算";
    label.append(meta, path, hash);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "ss-secondary";
    add.textContent = "ハッシュ登録";
    add.addEventListener("click", async () => {
      add.disabled = true;
      add.textContent = "計算中...";
      hash.textContent = "画素ハッシュを計算中...";
      const hashed = await createPixelHashCandidate(candidate);
      if (hashed) {
        hash.textContent = `${hashed.pixelHashAlgorithm}: ${hashed.pixelHash}`;
      } else {
        hash.textContent = "ハッシュ計算に失敗したためURL指紋で登録します";
      }
      addFingerprint(context.scriptId, hashed ?? candidate);
      context.notifySettingsChanged();
      context.render();
    });

    row.append(preview, label, add);
    wrapper.appendChild(row);
  });

  return wrapper;
}

function collectImageCandidates(pageHost: string): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  const seen = new Set<string>();

  getCachedOrCurrentPageCandidates(pageHost).forEach((pageCandidate) => {
    const candidate = parseCandidate(pageCandidate.url, pageHost);
    if (!candidate) return;
    const key = `${candidate.pageHost}\n${candidate.host}\n${candidate.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({
      ...candidate,
      width: pageCandidate.width,
      height: pageCandidate.height,
    });
  });

  return candidates;
}

function getCachedOrCurrentPageCandidates(
  pageHost: string,
): PageImageCandidate[] {
  const cacheKey = `${pageHost}\n${window.location.href}`;
  return scannedCandidateCache.get(cacheKey) ?? collectPageImageCandidates();
}

function getCandidateCacheKey(
  context: ScriptSettingsCustomSectionContext,
): string {
  return `${context.currentUrl.hostname}\n${context.currentUrl.href}`;
}

function addFingerprint(scriptId: string, candidate: ImageCandidate): void {
  const fingerprints = getImageExclusionFingerprints(scriptId);
  const existing = fingerprints.find(
    (fingerprint) =>
      (candidate.pixelHash !== undefined &&
        fingerprint.pixelHash === candidate.pixelHash &&
        fingerprint.pixelHashAlgorithm === candidate.pixelHashAlgorithm) ||
      (fingerprint.pageHost === candidate.pageHost &&
        fingerprint.host === candidate.host &&
        fingerprint.path === candidate.path),
  );
  if (existing) {
    updateFingerprint(scriptId, existing.id, {
      enabled: true,
      pixelHash: candidate.pixelHash,
      pixelHashAlgorithm: candidate.pixelHashAlgorithm,
      width: candidate.width,
      height: candidate.height,
    });
    return;
  }

  setImageExclusionFingerprints(scriptId, [
    ...fingerprints,
    {
      ...candidate,
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      enabled: true,
      createdAt: new Date().toISOString(),
    },
  ]);
}

function updateFingerprint(
  scriptId: string,
  id: string,
  patch: Partial<
    Pick<
      ImageExclusionFingerprint,
      "enabled" | "pixelHash" | "pixelHashAlgorithm" | "width" | "height"
    >
  >,
): void {
  setImageExclusionFingerprints(
    scriptId,
    getImageExclusionFingerprints(scriptId).map((fingerprint) =>
      fingerprint.id === id ? { ...fingerprint, ...patch } : fingerprint,
    ),
  );
}

function removeFingerprint(scriptId: string, id: string): void {
  setImageExclusionFingerprints(
    scriptId,
    getImageExclusionFingerprints(scriptId).filter(
      (fingerprint) => fingerprint.id !== id,
    ),
  );
}

function getImageExclusionFingerprints(
  scriptId: string,
): ImageExclusionFingerprint[] {
  const stored =
    getValue<unknown>(getStorageKey(scriptId)) ??
    (scriptId === "manga-viewer"
      ? getValue<unknown>(LEGACY_MANGA_VIEWER_STORAGE_KEY)
      : undefined);
  if (!Array.isArray(stored)) return [];
  return stored.filter(isImageExclusionFingerprint);
}

function setImageExclusionFingerprints(
  scriptId: string,
  fingerprints: ImageExclusionFingerprint[],
): void {
  setValue(getStorageKey(scriptId), fingerprints);
}

function getStorageKey(scriptId: string): string {
  return `${STORAGE_KEY_PREFIX}${scriptId}`;
}

function parseCandidate(url: string, pageHost: string): ImageCandidate | null {
  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return {
      url: parsed.href,
      pageHost: pageHost.toLowerCase(),
      host: parsed.hostname.toLowerCase(),
      path: parsed.pathname,
    };
  } catch {
    return null;
  }
}

async function createPixelHashCandidate(
  candidate: ImageCandidate,
): Promise<ImageCandidate | null> {
  try {
    const imageData = await loadImageData(candidate.url);
    const bytes = new Uint8Array(imageData.data);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      bytes.buffer as ArrayBuffer,
    );
    return {
      ...candidate,
      width: imageData.width,
      height: imageData.height,
      pixelHash: toHex(new Uint8Array(digest)),
      pixelHashAlgorithm: PIXEL_HASH_ALGORITHM,
    };
  } catch (error) {
    console.warn("[ImageExclusion] pixel hash calculation failed:", error);
    return null;
  }
}

async function loadImageData(
  url: string,
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const response = await gmRequest<Blob>({
    url,
    responseType: "blob",
    timeout: 30000,
  });
  const objectUrl = URL.createObjectURL(response.response);
  try {
    const image = await loadImageElement(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = HASH_SIZE;
    canvas.height = HASH_SIZE;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("Canvas 2D context is unavailable");
    }
    context.drawImage(image, 0, 0, HASH_SIZE, HASH_SIZE);
    return {
      data: context.getImageData(0, 0, HASH_SIZE, HASH_SIZE).data,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image decode failed"));
    image.src = url;
  });
}

function isImageExclusionFingerprint(
  value: unknown,
): value is ImageExclusionFingerprint {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    id?: unknown;
    enabled?: unknown;
    pageHost?: unknown;
    host?: unknown;
    path?: unknown;
    width?: unknown;
    height?: unknown;
    label?: unknown;
    sourceUrl?: unknown;
    pixelHash?: unknown;
    pixelHashAlgorithm?: unknown;
    createdAt?: unknown;
  };
  return (
    typeof candidate.id === "string" &&
    typeof candidate.enabled === "boolean" &&
    typeof candidate.pageHost === "string" &&
    typeof candidate.host === "string" &&
    typeof candidate.path === "string" &&
    (candidate.sourceUrl === undefined ||
      typeof candidate.sourceUrl === "string") &&
    (candidate.pixelHash === undefined ||
      typeof candidate.pixelHash === "string") &&
    (candidate.pixelHashAlgorithm === undefined ||
      typeof candidate.pixelHashAlgorithm === "string") &&
    (candidate.width === undefined || typeof candidate.width === "number") &&
    (candidate.height === undefined || typeof candidate.height === "number") &&
    (candidate.label === undefined || typeof candidate.label === "string") &&
    typeof candidate.createdAt === "string"
  );
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function formatSize(value: { width?: number; height?: number }): string {
  if (value.width === undefined || value.height === undefined) {
    return "";
  }
  return ` ${value.width}x${value.height}`;
}
