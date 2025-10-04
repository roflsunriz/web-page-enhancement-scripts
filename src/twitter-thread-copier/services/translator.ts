import type { Logger } from "@/shared/logger";
import type { TranslationRequest } from "@/shared/types";
import { gmRequest } from "@/shared/network";

const GOOGLE_TRANSLATE_ENDPOINT =
  "https://translate.googleapis.com/translate_a/single";

interface TranslationApiPayload {
  sentences?: Array<{ trans?: string }>;
}

export class Translator {
  constructor(private readonly logger: Logger) {}

  async translate(request: TranslationRequest): Promise<string> {
    const text = request.sourceText.trim();
    if (!text) {
      return request.sourceText;
    }

    const url =
      GOOGLE_TRANSLATE_ENDPOINT +
      "?client=gtx&sl=" + encodeURIComponent(request.sourceLang ?? "auto") +
      "&tl=" + encodeURIComponent(request.targetLang) +
      "&dt=t&dj=1&q=" + encodeURIComponent(text);

    try {
      const response = await gmRequest<string>({ url, timeout: 15000 });
      const body = String((response.response as unknown as { responseText?: string }).responseText ?? "").trim();
      if (!body) {
        throw new Error("Empty translation response");
      }
      const parsed = JSON.parse(body) as TranslationApiPayload;
      const sentences = parsed.sentences ?? [];
      const result = sentences.map((item) => item.trans ?? "").join("");
      if (!result.trim()) {
        throw new Error("Translation result is empty");
      }
      return result;
    } catch (error) {
      this.logger.error("translation failed", error);
      return request.sourceText;
    }
  }
}
