export interface LegacyCollectorConfig {
  debugMode: boolean;
  showZipButton: boolean;
  singleImageTest: boolean;
}

export interface ImageMetadata {
  width: number;
  height: number;
  size: number;
  loaded?: boolean;
}

export interface ImageDataEntry {
  metadata: ImageMetadata;
  blob: Blob | null;
  originalUrl?: string;
}

export interface ImageQueueItem {
  url: string;
  metadata: ImageMetadata;
}

export type ToastType = "info" | "success" | "warning" | "error";

export type ZipButtonState = "initial" | "processing" | "ready";

export interface ImageClassification {
  trustLevel: "high" | "medium" | "low";
  reason: string;
  fastPath: boolean;
  element: Element | null;
}

export interface ClassifiedImage {
  url: string;
  classification: ImageClassification;
}

export interface ZipDownloaderOptions {
  maxZipSize: number;
  maxImagesPerZip: number;
  compressionLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  splitZipFiles: boolean;
}

export type LegacyLogContext = Record<string, unknown>;

export type ImageDataMap = Map<string, ImageDataEntry>;

export type ImageCategory = "direct" | "gallery" | "thumbnail" | "unknown";

export interface ImageResource {
  url: string;
  filename?: string;
  width?: number;
  height?: number;
  category: ImageCategory;
  referer?: string;
}

export interface CollectionOptions {
  allowCrossOrigin: boolean;
  includeThumbnails: boolean;
  maxConcurrentRequests: number;
}

export interface ZipRequest {
  resources: ImageResource[];
  zipName: string;
}


