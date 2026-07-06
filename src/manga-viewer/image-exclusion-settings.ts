import type { ScriptSettingsCustomSectionContext } from "@/shared/script-settings";
import { getValue, setValue } from "@/shared/userscript";

const STORAGE_KEY = "manga-viewer-image-exclusion-fingerprints";
const MAX_CANDIDATES = 12;

type ImageExclusionFingerprint = {
  id: string;
  enabled: boolean;
  pageHost: string;
  host: string;
  path: string;
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
  width?: number;
  height?: number;
};

export function isUserExcludedImage(
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

  return getImageExclusionFingerprints().some((fingerprint) => {
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
    "登録した画像と同じ host/path の画像を manga-viewer の収集対象から除外します。";
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
  button.textContent = "URLを登録";

  form.append(input, button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const candidate = parseCandidate(input.value, context.currentUrl.hostname);
    if (!candidate) return;
    addFingerprint(candidate);
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
  const fingerprints = getImageExclusionFingerprints();

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
      updateFingerprint(fingerprint.id, { enabled: checkbox.checked });
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
    label.append(type, pattern);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ss-danger";
    remove.textContent = "削除";
    remove.addEventListener("click", () => {
      removeFingerprint(fingerprint.id);
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

  const candidates = collectImageCandidates(context.currentUrl.hostname);
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

    const label = document.createElement("div");
    label.className = "ss-rule-label";
    const meta = document.createElement("span");
    meta.className = "ss-rule-type";
    meta.textContent = `${candidate.host}${formatSize(candidate)}`;
    const path = document.createElement("span");
    path.textContent = candidate.path;
    label.append(meta, path);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "ss-secondary";
    add.textContent = "登録";
    add.addEventListener("click", () => {
      addFingerprint(candidate);
      context.notifySettingsChanged();
      context.render();
    });

    row.append(label, add);
    wrapper.appendChild(row);
  });

  return wrapper;
}

function collectImageCandidates(pageHost: string): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  const seen = new Set<string>();

  document.querySelectorAll("img").forEach((element) => {
    const imageElement = element as HTMLImageElement;
    const url = imageElement.currentSrc || imageElement.src;
    const candidate = parseCandidate(url, pageHost);
    if (!candidate) return;
    const width = imageElement.naturalWidth || imageElement.width || undefined;
    const height =
      imageElement.naturalHeight || imageElement.height || undefined;
    const key = `${candidate.pageHost}\n${candidate.host}\n${candidate.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ ...candidate, width, height });
  });

  return candidates.slice(0, MAX_CANDIDATES);
}

function addFingerprint(candidate: ImageCandidate): void {
  const fingerprints = getImageExclusionFingerprints();
  const existing = fingerprints.find(
    (fingerprint) =>
      fingerprint.pageHost === candidate.pageHost &&
      fingerprint.host === candidate.host &&
      fingerprint.path === candidate.path,
  );
  if (existing) {
    updateFingerprint(existing.id, {
      enabled: true,
      width: candidate.width,
      height: candidate.height,
    });
    return;
  }

  setImageExclusionFingerprints([
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
  id: string,
  patch: Partial<
    Pick<ImageExclusionFingerprint, "enabled" | "width" | "height">
  >,
): void {
  setImageExclusionFingerprints(
    getImageExclusionFingerprints().map((fingerprint) =>
      fingerprint.id === id ? { ...fingerprint, ...patch } : fingerprint,
    ),
  );
}

function removeFingerprint(id: string): void {
  setImageExclusionFingerprints(
    getImageExclusionFingerprints().filter(
      (fingerprint) => fingerprint.id !== id,
    ),
  );
}

function getImageExclusionFingerprints(): ImageExclusionFingerprint[] {
  const stored = getValue<unknown>(STORAGE_KEY);
  if (!Array.isArray(stored)) return [];
  return stored.filter(isImageExclusionFingerprint);
}

function setImageExclusionFingerprints(
  fingerprints: ImageExclusionFingerprint[],
): void {
  setValue(STORAGE_KEY, fingerprints);
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
    createdAt?: unknown;
  };
  return (
    typeof candidate.id === "string" &&
    typeof candidate.enabled === "boolean" &&
    typeof candidate.pageHost === "string" &&
    typeof candidate.host === "string" &&
    typeof candidate.path === "string" &&
    (candidate.width === undefined || typeof candidate.width === "number") &&
    (candidate.height === undefined || typeof candidate.height === "number") &&
    (candidate.label === undefined || typeof candidate.label === "string") &&
    typeof candidate.createdAt === "string"
  );
}

function formatSize(value: { width?: number; height?: number }): string {
  if (value.width === undefined || value.height === undefined) {
    return "";
  }
  return ` ${value.width}x${value.height}`;
}
