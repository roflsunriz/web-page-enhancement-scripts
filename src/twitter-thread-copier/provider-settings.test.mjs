import { beforeEach, describe, expect, test } from "bun:test";
import {
  CEREBRAS_ENDPOINT,
  OPENROUTER_ENDPOINT,
  OPENROUTER_FREE_MODEL,
  SAKURA_ENDPOINT,
  getDefaultSettings,
  getRemoteProviderSettings,
  initializeSettingsStorage,
  loadSettings,
  loadTranslationProvider,
  resetSettings,
  saveSettings,
} from "./settings.js";

const values = new Map();
const secretValues = new Map();
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
Object.defineProperty(globalThis, "GM", {
  configurable: true,
  value: {
    getValue: async (key, fallback) => secretValues.get(key) ?? fallback,
    setValue: async (key, value) => secretValues.set(key, value),
    deleteValue: async (key) => secretValues.delete(key),
  },
});

describe("translation provider settings", () => {
  beforeEach(() => {
    storage.clear();
    secretValues.clear();
  });

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

  test("Firefox系Promise APIで起動時に旧平文設定を自動移行する", async () => {
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

    await initializeSettingsStorage();
    const settings = loadSettings();
    expect(settings.cerebrasApiKey).toBe("legacy-key");
    expect(settings.cloudSystemPrompt).toBe("legacy prompt");
    expect(settings.customApiKey).toBe("");
    expect(loadTranslationProvider()).toBe("cerebras");
    expect(storage.getItem("translationProvider")).toBe("cerebras");
    expect(secretValues.get("twitter-thread-copier-secret-cerebras")).toBe(
      "legacy-key",
    );
    const sanitized = storage.getItem("twitter-thread-copier-settings");
    expect(sanitized).not.toContain("legacy-key");
    expect(sanitized).not.toContain("openaiApiKey");
    expect(sanitized).not.toContain("cerebrasApiKey");
  });

  test("APIキーをuserscript専用領域だけへ保存する", async () => {
    await saveSettings({
      ...getDefaultSettings(),
      openRouterApiKey: "openrouter-secret",
      sakuraApiKey: "sakura-secret",
      cerebrasApiKey: "cerebras-secret",
      customApiKey: "custom-secret",
    });

    const publicSettings = storage.getItem("twitter-thread-copier-settings");
    expect(publicSettings ?? "").not.toContain("secret");
    expect(publicSettings ?? "").not.toContain("ApiKey");
    expect(secretValues.get("twitter-thread-copier-secret-openrouter")).toBe(
      "openrouter-secret",
    );
    expect(secretValues.get("twitter-thread-copier-secret-sakura")).toBe(
      "sakura-secret",
    );
    expect(secretValues.get("twitter-thread-copier-secret-cerebras")).toBe(
      "cerebras-secret",
    );
    expect(secretValues.get("twitter-thread-copier-secret-custom")).toBe(
      "custom-secret",
    );
  });

  test("設定リセットでuserscript専用領域のAPIキーも削除する", async () => {
    secretValues.set("twitter-thread-copier-secret-openrouter", "secret");
    secretValues.set("twitter-thread-copier-secret-sakura", "secret");
    secretValues.set("twitter-thread-copier-secret-cerebras", "secret");
    secretValues.set("twitter-thread-copier-secret-custom", "secret");

    await resetSettings();
    expect(secretValues.size).toBe(0);
  });
});
