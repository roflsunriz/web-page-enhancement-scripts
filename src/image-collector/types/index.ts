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
