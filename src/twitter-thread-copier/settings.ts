import { logger } from "./logger.js";

export type TranslationProvider =
  "local" | "google" | "openrouter-free" | "sakura" | "cerebras" | "custom";

export interface TranslatorSettings {
  settingsVersion: 2;
  localAiEndpoint: string;
  localAiSystemPrompt: string;
  cloudSystemPrompt: string;
  openRouterApiKey: string;
  sakuraApiKey: string;
  cerebrasApiKey: string;
  customEndpoint: string;
  customModel: string;
  customApiKey: string;
}

export interface RemoteProviderSettings {
  endpoint: string;
  model: string;
  apiKey: string;
  resolveModelFromCatalog: boolean;
}

const STORAGE_KEY = "twitter-thread-copier-settings";
const PROVIDER_STORAGE_KEY = "translationProvider";
type SecretField =
  "openRouterApiKey" | "sakuraApiKey" | "cerebrasApiKey" | "customApiKey";
const SECRET_FIELDS: readonly SecretField[] = [
  "openRouterApiKey",
  "sakuraApiKey",
  "cerebrasApiKey",
  "customApiKey",
];
const SECRET_STORAGE_KEYS: Record<SecretField, string> = {
  openRouterApiKey: "twitter-thread-copier-secret-openrouter",
  sakuraApiKey: "twitter-thread-copier-secret-sakura",
  cerebrasApiKey: "twitter-thread-copier-secret-cerebras",
  customApiKey: "twitter-thread-copier-secret-custom",
};

const DEFAULT_LOCAL_AI_ENDPOINT = "http://localhost:3002/v1/chat/completions";
const DEFAULT_LOCAL_AI_SYSTEM_PROMPT =
  "You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";
const DEFAULT_CLOUD_SYSTEM_PROMPT = DEFAULT_LOCAL_AI_SYSTEM_PROMPT;

export const OPENROUTER_ENDPOINT =
  "https://openrouter.ai/api/v1/chat/completions";
export const SAKURA_ENDPOINT =
  "https://api.ai.sakura.ad.jp/v1/chat/completions";
export const CEREBRAS_ENDPOINT = "https://api.cerebras.ai/v1/chat/completions";
export const OPENROUTER_FREE_MODEL = "openrouter/free";

const SUPPORTED_PROVIDERS: readonly TranslationProvider[] = [
  "local",
  "google",
  "openrouter-free",
  "sakura",
  "cerebras",
  "custom",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(
  source: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  return typeof source[key] === "string" ? source[key] : fallback;
}

function inferProviderFromEndpoint(endpoint: string): TranslationProvider {
  const normalized = endpoint.toLowerCase();
  if (normalized.includes("openrouter.ai")) return "openrouter-free";
  if (normalized.includes("api.ai.sakura.ad.jp")) return "sakura";
  if (normalized.includes("api.cerebras.ai")) return "cerebras";
  return "custom";
}

function readStoredObject(): Record<string, unknown> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  const parsed = JSON.parse(stored) as unknown;
  return isRecord(parsed) ? parsed : {};
}

function readSecret(field: SecretField): string {
  try {
    const value = GM_getValue(SECRET_STORAGE_KEYS[field], "");
    return typeof value === "string" ? value : "";
  } catch (error) {
    logger.error(
      `Failed to read protected userscript value: ${field}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return "";
  }
}

function writeSecret(field: SecretField, value: string): void {
  try {
    if (value) {
      GM_setValue(SECRET_STORAGE_KEYS[field], value);
    } else {
      GM_deleteValue(SECRET_STORAGE_KEYS[field]);
    }
  } catch (error) {
    logger.error(
      `Failed to write protected userscript value: ${field}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function clearSecrets(): void {
  for (const field of SECRET_FIELDS) writeSecret(field, "");
}

function removePlaintextSecrets(
  parsed: Record<string, unknown>,
  legacyProvider: TranslationProvider,
): void {
  const legacyApiKey = readString(parsed, "openaiApiKey");
  const candidates: Record<SecretField, string> = {
    openRouterApiKey: readString(
      parsed,
      "openRouterApiKey",
      legacyProvider === "openrouter-free" ? legacyApiKey : "",
    ),
    sakuraApiKey: readString(
      parsed,
      "sakuraApiKey",
      legacyProvider === "sakura" ? legacyApiKey : "",
    ),
    cerebrasApiKey: readString(
      parsed,
      "cerebrasApiKey",
      legacyProvider === "cerebras" ? legacyApiKey : "",
    ),
    customApiKey: readString(
      parsed,
      "customApiKey",
      legacyProvider === "custom" ? legacyApiKey : "",
    ),
  };
  const plaintextFields = [...SECRET_FIELDS, "openaiApiKey"];
  if (!plaintextFields.some((field) => field in parsed)) return;

  for (const field of SECRET_FIELDS) {
    if (!readSecret(field) && candidates[field]) {
      writeSecret(field, candidates[field]);
    }
  }

  const sanitized = { ...parsed };
  for (const field of plaintextFields) delete sanitized[field];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
}

function savePublicSettings(settings: TranslatorSettings): void {
  const publicSettings = {
    settingsVersion: settings.settingsVersion,
    localAiEndpoint: settings.localAiEndpoint,
    localAiSystemPrompt: settings.localAiSystemPrompt,
    cloudSystemPrompt: settings.cloudSystemPrompt,
    customEndpoint: settings.customEndpoint,
    customModel: settings.customModel,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(publicSettings));
}

export function getDefaultSettings(): TranslatorSettings {
  return {
    settingsVersion: 2,
    localAiEndpoint: DEFAULT_LOCAL_AI_ENDPOINT,
    localAiSystemPrompt: DEFAULT_LOCAL_AI_SYSTEM_PROMPT,
    cloudSystemPrompt: DEFAULT_CLOUD_SYSTEM_PROMPT,
    openRouterApiKey: "",
    sakuraApiKey: "",
    cerebrasApiKey: "",
    customEndpoint: "",
    customModel: "",
    customApiKey: "",
  };
}

export function loadSettings(): TranslatorSettings {
  const defaults = getDefaultSettings();
  try {
    const parsed = readStoredObject();
    const legacyEndpoint = readString(parsed, "openaiEndpoint");
    const legacyModel = readString(parsed, "openaiModel");
    const legacyProvider = inferProviderFromEndpoint(legacyEndpoint);
    removePlaintextSecrets(parsed, legacyProvider);

    return {
      settingsVersion: 2,
      localAiEndpoint: readString(
        parsed,
        "localAiEndpoint",
        defaults.localAiEndpoint,
      ),
      localAiSystemPrompt: readString(
        parsed,
        "localAiSystemPrompt",
        defaults.localAiSystemPrompt,
      ),
      cloudSystemPrompt: readString(
        parsed,
        "cloudSystemPrompt",
        readString(parsed, "openaiSystemPrompt", defaults.cloudSystemPrompt),
      ),
      openRouterApiKey: readSecret("openRouterApiKey"),
      sakuraApiKey: readSecret("sakuraApiKey"),
      cerebrasApiKey: readSecret("cerebrasApiKey"),
      customEndpoint: readString(
        parsed,
        "customEndpoint",
        legacyProvider === "custom" ? legacyEndpoint : "",
      ),
      customModel: readString(
        parsed,
        "customModel",
        legacyProvider === "custom" ? legacyModel : "",
      ),
      customApiKey: readSecret("customApiKey"),
    };
  } catch (error) {
    logger.error(`Failed to load settings: ${(error as Error).message}`);
    return defaults;
  }
}

export function saveSettings(settings: TranslatorSettings): void {
  try {
    for (const field of SECRET_FIELDS) writeSecret(field, settings[field]);
    savePublicSettings(settings);
    logger.log("Settings saved successfully");
  } catch (error) {
    logger.error(`Failed to save settings: ${(error as Error).message}`);
  }
}

export function resetSettings(): TranslatorSettings {
  const defaults = getDefaultSettings();
  clearSecrets();
  savePublicSettings(defaults);
  return defaults;
}

export function loadTranslationProvider(): TranslationProvider {
  const stored = localStorage.getItem(PROVIDER_STORAGE_KEY);
  if (stored && SUPPORTED_PROVIDERS.includes(stored as TranslationProvider)) {
    return stored as TranslationProvider;
  }
  if (stored === "openai") {
    try {
      const provider = inferProviderFromEndpoint(
        readString(readStoredObject(), "openaiEndpoint"),
      );
      saveTranslationProvider(provider);
      return provider;
    } catch (error) {
      logger.warn("Failed to migrate legacy translation provider", error);
    }
  }
  return "local";
}

export function saveTranslationProvider(provider: TranslationProvider): void {
  localStorage.setItem(PROVIDER_STORAGE_KEY, provider);
}

export function isRemoteProvider(
  provider: TranslationProvider,
): provider is Exclude<TranslationProvider, "local" | "google"> {
  return provider !== "local" && provider !== "google";
}

export function getRemoteProviderSettings(
  provider: Exclude<TranslationProvider, "local" | "google">,
  settings: TranslatorSettings,
): RemoteProviderSettings {
  switch (provider) {
    case "openrouter-free":
      return {
        endpoint: OPENROUTER_ENDPOINT,
        model: OPENROUTER_FREE_MODEL,
        apiKey: settings.openRouterApiKey,
        resolveModelFromCatalog: false,
      };
    case "sakura":
      return {
        endpoint: SAKURA_ENDPOINT,
        model: "",
        apiKey: settings.sakuraApiKey,
        resolveModelFromCatalog: true,
      };
    case "cerebras":
      return {
        endpoint: CEREBRAS_ENDPOINT,
        model: "",
        apiKey: settings.cerebrasApiKey,
        resolveModelFromCatalog: true,
      };
    case "custom":
      return {
        endpoint: settings.customEndpoint,
        model: settings.customModel,
        apiKey: settings.customApiKey,
        resolveModelFromCatalog: false,
      };
  }
}
