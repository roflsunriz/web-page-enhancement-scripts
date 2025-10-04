import "@types/tampermonkey";

declare const unsafeWindow: Window & typeof globalThis;

declare namespace GM {}

declare global {
  interface Window {
    ImageCollector2?: Record<string, unknown>;
    setImageCollectorDebug?(value: boolean): boolean;
    setImageCollectorZipButton?(value: boolean): boolean;
    setSingleImageTest?(value: boolean): boolean;
  }
}

export {};
