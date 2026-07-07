import type {
  ScriptSettingsCustomSection,
  ScriptSettingsCustomSectionContext,
} from "@/shared/script-settings";
import { getValue, setValue } from "@/shared/userscript";
import { t } from "./i18n";

const STORAGE_KEY = "manga-viewer-image-collection-delays";
const SETTINGS_VERSION = 1;

export type ImageCollectionDelaySettings = {
  version: typeof SETTINGS_VERSION;
  fastLaunchRetryWaitMs: number;
  dynamicWaitMs: number;
  fallbackDynamicWaitMs: number;
  scrollDelayMs: number;
  additionalScanDynamicWaitMs: number;
};

type DelayField = {
  key: keyof Omit<ImageCollectionDelaySettings, "version">;
  labelKey:
    | "fastLaunchRetryDelay"
    | "dynamicImageWaitDelay"
    | "fallbackImageWaitDelay"
    | "scrollScanDelay"
    | "additionalImageScanDelay";
  min: number;
  max: number;
  step: number;
};

const DEFAULT_SETTINGS: ImageCollectionDelaySettings = {
  version: SETTINGS_VERSION,
  fastLaunchRetryWaitMs: 500,
  dynamicWaitMs: 500,
  fallbackDynamicWaitMs: 1500,
  scrollDelayMs: 400,
  additionalScanDynamicWaitMs: 500,
};

const DELAY_FIELDS: DelayField[] = [
  {
    key: "fastLaunchRetryWaitMs",
    labelKey: "fastLaunchRetryDelay",
    min: 0,
    max: 10000,
    step: 100,
  },
  {
    key: "dynamicWaitMs",
    labelKey: "dynamicImageWaitDelay",
    min: 0,
    max: 10000,
    step: 100,
  },
  {
    key: "fallbackDynamicWaitMs",
    labelKey: "fallbackImageWaitDelay",
    min: 0,
    max: 15000,
    step: 100,
  },
  {
    key: "scrollDelayMs",
    labelKey: "scrollScanDelay",
    min: 0,
    max: 5000,
    step: 50,
  },
  {
    key: "additionalScanDynamicWaitMs",
    labelKey: "additionalImageScanDelay",
    min: 0,
    max: 10000,
    step: 100,
  },
];

export function getImageCollectionDelaySettings(): ImageCollectionDelaySettings {
  const stored = getValue<unknown>(STORAGE_KEY);
  if (!isStoredSettings(stored)) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    version: SETTINGS_VERSION,
    fastLaunchRetryWaitMs: sanitizeDelay(
      stored.fastLaunchRetryWaitMs,
      "fastLaunchRetryWaitMs",
    ),
    dynamicWaitMs: sanitizeDelay(stored.dynamicWaitMs, "dynamicWaitMs"),
    fallbackDynamicWaitMs: sanitizeDelay(
      stored.fallbackDynamicWaitMs,
      "fallbackDynamicWaitMs",
    ),
    scrollDelayMs: sanitizeDelay(stored.scrollDelayMs, "scrollDelayMs"),
    additionalScanDynamicWaitMs: sanitizeDelay(
      stored.additionalScanDynamicWaitMs,
      "additionalScanDynamicWaitMs",
    ),
  };
}

export function createImageCollectionDelaySettingsSectionFactory(): ScriptSettingsCustomSection {
  return (context) => createSettingsSection(context);
}

function createSettingsSection(
  context: ScriptSettingsCustomSectionContext,
): HTMLElement {
  const settings = getImageCollectionDelaySettings();
  const section = document.createElement("section");
  section.className = "ss-section";

  const title = document.createElement("h3");
  title.textContent = t("imageCollectionDelaySettings");

  const description = document.createElement("div");
  description.className = "ss-empty";
  description.textContent = t("imageCollectionDelaySettingsDescription");

  const form = document.createElement("div");
  form.className = "ss-rule-list";

  DELAY_FIELDS.forEach((field) => {
    form.appendChild(createDelayField(context, settings, field));
  });

  section.append(title, description, form);
  return section;
}

function createDelayField(
  context: ScriptSettingsCustomSectionContext,
  settings: ImageCollectionDelaySettings,
  field: DelayField,
): HTMLElement {
  const row = document.createElement("label");
  row.className = "ss-rule-row";

  const label = document.createElement("div");
  label.className = "ss-rule-label";
  const title = document.createElement("span");
  title.className = "ss-rule-type";
  title.textContent = t(field.labelKey);
  const help = document.createElement("span");
  help.textContent = t("millisecondsUnit");
  label.append(title, help);

  const input = document.createElement("input");
  input.type = "number";
  input.min = String(field.min);
  input.max = String(field.max);
  input.step = String(field.step);
  input.value = String(settings[field.key]);
  input.addEventListener("change", () => {
    const nextValue = sanitizeDelay(Number(input.value), field.key);
    input.value = String(nextValue);
    setImageCollectionDelaySettings({
      ...getImageCollectionDelaySettings(),
      [field.key]: nextValue,
    });
    context.notifySettingsChanged();
  });

  row.append(label, input);
  return row;
}

function setImageCollectionDelaySettings(
  settings: ImageCollectionDelaySettings,
): void {
  setValue(STORAGE_KEY, {
    version: SETTINGS_VERSION,
    fastLaunchRetryWaitMs: sanitizeDelay(
      settings.fastLaunchRetryWaitMs,
      "fastLaunchRetryWaitMs",
    ),
    dynamicWaitMs: sanitizeDelay(settings.dynamicWaitMs, "dynamicWaitMs"),
    fallbackDynamicWaitMs: sanitizeDelay(
      settings.fallbackDynamicWaitMs,
      "fallbackDynamicWaitMs",
    ),
    scrollDelayMs: sanitizeDelay(settings.scrollDelayMs, "scrollDelayMs"),
    additionalScanDynamicWaitMs: sanitizeDelay(
      settings.additionalScanDynamicWaitMs,
      "additionalScanDynamicWaitMs",
    ),
  });
}

function sanitizeDelay(
  value: number,
  key: keyof Omit<ImageCollectionDelaySettings, "version">,
): number {
  const field = DELAY_FIELDS.find((candidate) => candidate.key === key);
  const fallback = DEFAULT_SETTINGS[key];
  if (!field || !Number.isFinite(value)) return fallback;

  const normalized = Math.round(value);
  return Math.min(field.max, Math.max(field.min, normalized));
}

function isStoredSettings(
  value: unknown,
): value is ImageCollectionDelaySettings {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    version?: unknown;
    fastLaunchRetryWaitMs?: unknown;
    dynamicWaitMs?: unknown;
    fallbackDynamicWaitMs?: unknown;
    scrollDelayMs?: unknown;
    additionalScanDynamicWaitMs?: unknown;
  };
  return (
    candidate.version === SETTINGS_VERSION &&
    typeof candidate.fastLaunchRetryWaitMs === "number" &&
    typeof candidate.dynamicWaitMs === "number" &&
    typeof candidate.fallbackDynamicWaitMs === "number" &&
    typeof candidate.scrollDelayMs === "number" &&
    typeof candidate.additionalScanDynamicWaitMs === "number"
  );
}
