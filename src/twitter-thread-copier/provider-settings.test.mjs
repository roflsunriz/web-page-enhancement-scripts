import { beforeEach, describe, expect, test } from "bun:test";
import {
  CEREBRAS_ENDPOINT,
  OPENROUTER_ENDPOINT,
  OPENROUTER_FREE_MODEL,
  SAKURA_ENDPOINT,
  getDefaultSettings,
  getRemoteProviderSettings,
  loadSettings,
  loadTranslationProvider,
} from "./settings.js";

const values = new Map();
const storage = {
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  get length() {
    return values.size;
  },
  removeItem: (key) => values.delete(key),
  setItem: (key, value) => values.set(key, String(value)),
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage,
});

describe("translation provider settings", () => {
  beforeEach(() => storage.clear());

  test("OpenRouter FreeはAPIキーだけでfree routerを使う", () => {
    const settings = {
      ...getDefaultSettings(),
      openRouterApiKey: "openrouter-key",
    };

    expect(getRemoteProviderSettings("openrouter-free", settings)).toEqual({
      endpoint: OPENROUTER_ENDPOINT,
      model: OPENROUTER_FREE_MODEL,
      apiKey: "openrouter-key",
      resolveModelFromCatalog: false,
    });
  });

  test("SakuraとCerebrasはAPIキーだけでモデル一覧を自動解決する", () => {
    const settings = {
      ...getDefaultSettings(),
      sakuraApiKey: "sakura-key",
      cerebrasApiKey: "cerebras-key",
    };

    expect(getRemoteProviderSettings("sakura", settings)).toEqual({
      endpoint: SAKURA_ENDPOINT,
      model: "",
      apiKey: "sakura-key",
      resolveModelFromCatalog: true,
    });
    expect(getRemoteProviderSettings("cerebras", settings)).toEqual({
      endpoint: CEREBRAS_ENDPOINT,
      model: "",
      apiKey: "cerebras-key",
      resolveModelFromCatalog: true,
    });
  });

  test("自由入力だけURL・モデル・APIキーをそのまま使う", () => {
    const settings = {
      ...getDefaultSettings(),
      customEndpoint: "https://example.com/v1/chat/completions",
      customModel: "example-model",
      customApiKey: "example-key",
    };

    expect(getRemoteProviderSettings("custom", settings)).toEqual({
      endpoint: "https://example.com/v1/chat/completions",
      model: "example-model",
      apiKey: "example-key",
      resolveModelFromCatalog: false,
    });
  });

  test("旧OpenAI互換のCerebras設定を新しい専用設定へ移行する", () => {
    storage.setItem(
      "twitter-thread-copier-settings",
      JSON.stringify({
        localAiEndpoint: "http://localhost:3002/v1/chat/completions",
        openaiEndpoint: CEREBRAS_ENDPOINT,
        openaiModel: "removed-model",
        openaiSystemPrompt: "legacy prompt",
        openaiApiKey: "legacy-key",
      }),
    );
    storage.setItem("translationProvider", "openai");

    const settings = loadSettings();
    expect(settings.cerebrasApiKey).toBe("legacy-key");
    expect(settings.cloudSystemPrompt).toBe("legacy prompt");
    expect(settings.customApiKey).toBe("");
    expect(loadTranslationProvider()).toBe("cerebras");
    expect(storage.getItem("translationProvider")).toBe("cerebras");
  });
});
