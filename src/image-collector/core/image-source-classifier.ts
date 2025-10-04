import type { Logger } from "@/shared/logger";
import type { ImageClassification, ImageMetadata } from "@/shared/types";

export class ImageSourceClassifier {
  private readonly trustedDomains: Set<string>;

  constructor(private readonly logger: Logger) {
    this.trustedDomains = new Set([
      window.location.hostname,
      "cdn.jsdelivr.net",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
    ]);
  }

  classifyImageSource(
    url: string,
    sourceElement: Element | null = null,
  ): ImageClassification {
    try {
      const urlObj = new URL(url, window.location.href);

      if (urlObj.hostname === window.location.hostname) {
        return {
          trustLevel: "high",
          reason: "same-domain",
          fastPath: true,
          element: sourceElement,
        };
      }

      if (this.trustedDomains.has(urlObj.hostname)) {
        return {
          trustLevel: "high",
          reason: "trusted-cdn",
          fastPath: true,
          element: sourceElement,
        };
      }

      if (
        sourceElement &&
        (sourceElement.tagName === "IMG" || sourceElement.tagName === "SOURCE")
      ) {
        if (
          sourceElement instanceof HTMLImageElement &&
          sourceElement.complete &&
          sourceElement.naturalWidth > 0
        ) {
          return {
            trustLevel: "medium",
            reason: "loaded-dom-element",
            fastPath: true,
            element: sourceElement,
          };
        }
      }

      if (urlObj.protocol === "https:") {
        return {
          trustLevel: "medium",
          reason: "https-external",
          fastPath: false,
          element: sourceElement,
        };
      }

      return {
        trustLevel: "low",
        reason: "untrusted-source",
        fastPath: false,
        element: sourceElement,
      };
    } catch (error) {
      this.logger.error(
        "画像ソース分類中にエラーが発生しました",
        error instanceof Error ? error : undefined,
        { url },
      );
      return {
        trustLevel: "low",
        reason: "classification-error",
        fastPath: false,
        element: sourceElement,
      };
    }
  }

  getMetadataFromElement(element: Element): ImageMetadata | null {
    if (element instanceof HTMLImageElement) {
      return {
        width: element.naturalWidth || element.width || 0,
        height: element.naturalHeight || element.height || 0,
        size: 0,
        loaded: element.complete,
      };
    }
    return null;
  }
}
