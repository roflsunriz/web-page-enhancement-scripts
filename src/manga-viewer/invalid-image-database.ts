import { isUserExcludedImage } from "@/shared/image-exclusion-settings";
import { isKnownInvalidImage } from "@/shared/known-invalid-images";

export function isInvalidImage(
  url: string,
  width?: number,
  height?: number,
  context: { pageHost?: string } = {},
): boolean {
  if (!url) {
    return false;
  }

  if (isUserExcludedImage("manga-viewer", url, width, height, context)) {
    return true;
  }

  return isKnownInvalidImage(url, width, height, context);
}
