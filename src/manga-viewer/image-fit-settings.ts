import { getValue, setValue } from "@/shared/userscript";

const STORAGE_KEY = "manga-viewer-image-fit-mode";

export type ImageFitMode = "width" | "height";

const DEFAULT_IMAGE_FIT_MODE: ImageFitMode = "width";

export function getImageFitMode(): ImageFitMode {
  const stored = getValue<unknown>(STORAGE_KEY);
  return isImageFitMode(stored) ? stored : DEFAULT_IMAGE_FIT_MODE;
}

export function setImageFitMode(mode: ImageFitMode): void {
  setValue(STORAGE_KEY, mode);
}

function isImageFitMode(value: unknown): value is ImageFitMode {
  return value === "width" || value === "height";
}
