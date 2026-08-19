export interface ModelInfo {
  id: string;
  created: number;
}

export type CatalogRequest = (
  url: string,
  headers: Record<string, string>,
) => Promise<unknown>;

const CACHE_TTL_MS = 10 * 60 * 1000;
const NON_CHAT_MODEL_PATTERN =
  /(?:^|[/_.-])(embedding|embed|whisper|speech|tts|voice|e5)(?:$|[/_.-])/i;

let cachedCatalog:
  | {
      endpoint: string;
      apiKey: string;
      expiresAt: number;
      models: ModelInfo[];
    }
  | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function buildModelsEndpoint(chatEndpoint: string): string {
  const url = new URL(chatEndpoint);
  const replaced = url.pathname.replace(
    /\/(?:chat\/completions|responses|completions)\/?$/,
    "/models",
  );
  url.pathname =
    replaced === url.pathname
      ? `${url.pathname.replace(/\/+$/, "")}/models`
      : replaced;
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function parseModelCatalog(payload: unknown): ModelInfo[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error("Invalid model catalog response");
  }
  const models: ModelInfo[] = [];
  for (const item of payload.data) {
    if (!isRecord(item) || typeof item.id !== "string" || !item.id.trim()) {
      continue;
    }
    models.push({
      id: item.id.trim(),
      created:
        typeof item.created === "number" && Number.isFinite(item.created)
          ? item.created
          : 0,
    });
  }
  if (models.length === 0) {
    throw new Error("Model catalog is empty");
  }
  return models;
}

export function selectChatModel(
  endpoint: string,
  models: readonly ModelInfo[],
  configuredModel: string,
): string {
  const candidates = models.filter(
    (model) => !NON_CHAT_MODEL_PATTERN.test(model.id),
  );
  const configured = configuredModel.trim();
  if (configured && candidates.some((model) => model.id === configured)) {
    return configured;
  }
  const sorted = candidates.toSorted(
    (left, right) =>
      modelPriority(endpoint, left.id) - modelPriority(endpoint, right.id) ||
      right.created - left.created ||
      left.id.localeCompare(right.id, "en"),
  );
  if (!sorted[0]) {
    throw new Error("No chat model is available");
  }
  return sorted[0].id;
}

export async function resolveOpenAIModel(
  endpoint: string,
  apiKey: string,
  configuredModel: string,
  requestCatalog: CatalogRequest = requestCatalogWithGm,
): Promise<string> {
  try {
    const models = await getCatalog(endpoint, apiKey, requestCatalog);
    return selectChatModel(endpoint, models, configuredModel);
  } catch (error) {
    if (configuredModel.trim()) return configuredModel.trim();
    throw error;
  }
}

async function getCatalog(
  endpoint: string,
  apiKey: string,
  requestCatalog: CatalogRequest,
): Promise<ModelInfo[]> {
  const modelsEndpoint = buildModelsEndpoint(endpoint);
  const now = Date.now();
  if (
    cachedCatalog &&
    cachedCatalog.endpoint === modelsEndpoint &&
    cachedCatalog.apiKey === apiKey &&
    cachedCatalog.expiresAt > now
  ) {
    return cachedCatalog.models;
  }

  const payload = await requestCatalog(modelsEndpoint, {
    Accept: "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  });
  const models = parseModelCatalog(payload);
  cachedCatalog = {
    endpoint: modelsEndpoint,
    apiKey,
    expiresAt: now + CACHE_TTL_MS,
    models,
  };
  return models;
}

function modelPriority(endpoint: string, modelId: string): number {
  const lowered = modelId.toLowerCase();
  if (endpoint.includes("api.ai.sakura.ad.jp")) {
    if (["llm-jp", "plamo", "cotomi"].some((name) => lowered.includes(name))) {
      return 0;
    }
    if (lowered === "gpt-oss-120b") return 1;
  } else if (
    endpoint.includes("api.cerebras.ai") &&
    lowered === "gpt-oss-120b"
  ) {
    return 0;
  }
  if (lowered.includes("coder") || lowered.includes("code")) return 4;
  if (/(?:^|[/_.-])(?:vl|vision)(?:$|[/_.-])/i.test(lowered)) return 3;
  return 2;
}

function requestCatalogWithGm(
  url: string,
  headers: Record<string, string>,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers,
      timeout: 15000,
      onload: (response) => {
        if (response.status < 200 || response.status >= 300) {
          reject(new Error(`Model catalog API error: ${response.status}`));
          return;
        }
        try {
          resolve(JSON.parse(response.responseText as string) as unknown);
        } catch (error) {
          reject(error);
        }
      },
      onerror: (error) => reject(error),
      ontimeout: () => reject(new Error("Model catalog request timed out")),
    });
  });
}

export function clearModelCatalogCache(): void {
  cachedCatalog = undefined;
}
