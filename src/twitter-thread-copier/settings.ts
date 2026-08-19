import { logger } from "./logger.js";

export interface TranslatorSettings {
  localAiEndpoint: string;
  localAiSystemPrompt: string;
  openaiEndpoint: string;
  openaiModel: string;
  openaiSystemPrompt: string;
  openaiApiKey: string;
}

const STORAGE_KEY = "twitter-thread-copier-settings";

const DEFAULT_LOCAL_AI_ENDPOINT = "http://localhost:3002/v1/chat/completions";
const DEFAULT_LOCAL_AI_SYSTEM_PROMPT =
  "You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";

const DEFAULT_OPENAI_ENDPOINT = "https://api.cerebras.ai/v1/chat/completions";
const LEGACY_AUTOMATIC_OPENAI_MODEL = "gpt-oss-120b";
const DEFAULT_OPENAI_SYSTEM_PROMPT =
  "You are a highly skilled translation engine with expertise in the technology sector. Your function is to translate texts accurately into Japanese, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.";

export function getDefaultSettings(): TranslatorSettings {
  return {
    localAiEndpoint: DEFAULT_LOCAL_AI_ENDPOINT,
    localAiSystemPrompt: DEFAULT_LOCAL_AI_SYSTEM_PROMPT,
    openaiEndpoint: DEFAULT_OPENAI_ENDPOINT,
    openaiModel: "",
    openaiSystemPrompt: DEFAULT_OPENAI_SYSTEM_PROMPT,
    openaiApiKey: "",
  };
}

export function loadSettings(): TranslatorSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultSettings();
    }
    const parsed = JSON.parse(stored) as Partial<TranslatorSettings>;
    const defaults = getDefaultSettings();
    const openaiEndpoint = parsed.openaiEndpoint ?? defaults.openaiEndpoint;
    const storedModel = parsed.openaiModel ?? defaults.openaiModel;
    const openaiModel =
      openaiEndpoint === DEFAULT_OPENAI_ENDPOINT &&
      storedModel === LEGACY_AUTOMATIC_OPENAI_MODEL
        ? ""
        : storedModel;
    return {
      localAiEndpoint: parsed.localAiEndpoint ?? defaults.localAiEndpoint,
      localAiSystemPrompt:
        parsed.localAiSystemPrompt ?? defaults.localAiSystemPrompt,
      openaiEndpoint,
      openaiModel,
      openaiSystemPrompt:
        parsed.openaiSystemPrompt ?? defaults.openaiSystemPrompt,
      openaiApiKey: parsed.openaiApiKey ?? defaults.openaiApiKey,
    };
  } catch (error) {
    logger.error(`Failed to load settings: ${(error as Error).message}`);
    return getDefaultSettings();
  }
}

export function saveSettings(settings: TranslatorSettings): void {
  try {
    const json = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY, json);
    logger.log("Settings saved successfully");
  } catch (error) {
    logger.error(`Failed to save settings: ${(error as Error).message}`);
  }
}

export function resetSettings(): TranslatorSettings {
  const defaults = getDefaultSettings();
  saveSettings(defaults);
  return defaults;
}
