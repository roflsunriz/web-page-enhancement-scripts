import { describe, expect, test } from "bun:test";
import {
  buildModelsEndpoint,
  clearModelCatalogCache,
  resolveOpenAIModel,
  selectChatModel,
} from "./model-catalog.js";

describe("model catalog", () => {
  test("chat endpointからmodels endpointを導出する", () => {
    expect(
      buildModelsEndpoint("https://api.cerebras.ai/v1/chat/completions"),
    ).toBe("https://api.cerebras.ai/v1/models");
  });

  test("音声・埋め込みを除外し配列順に依存しない", () => {
    const models = [
      { id: "whisper-large-v3-turbo", created: 40 },
      { id: "preview/Qwen3-Embedding-4B-FP16", created: 30 },
      { id: "new-chat-model", created: 20 },
    ];
    const endpoint = "https://api.cerebras.ai/v1/chat/completions";
    expect(selectChatModel(endpoint, models, "removed-model")).toBe(
      "new-chat-model",
    );
    expect(
      selectChatModel(endpoint, models.toReversed(), "removed-model"),
    ).toBe("new-chat-model");
  });

  test("認証付き一覧から廃止済み保存モデルを置き換える", async () => {
    clearModelCatalogCache();
    let authorization = "";
    const model = await resolveOpenAIModel(
      "https://api.ai.sakura.ad.jp/v1/chat/completions",
      "test-key",
      "removed-model",
      (_url, headers) => {
        authorization = headers.Authorization ?? "";
        return Promise.resolve({
          object: "list",
          data: [
            { id: "multilingual-e5-large", created: 20 },
            { id: "llm-jp-next", created: 10 },
          ],
        });
      },
    );

    expect(model).toBe("llm-jp-next");
    expect(authorization).toBe("Bearer test-key");
  });
});
