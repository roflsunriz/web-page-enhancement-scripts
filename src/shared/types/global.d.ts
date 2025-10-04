import "@types/tampermonkey";

// The following globals are intentionally declared for runtime environments
// (Tampermonkey/Greasemonkey). ESLint may report them as unused in this
// declaration file; suppress the rule locally for clarity.
/* eslint-disable @typescript-eslint/no-unused-vars */
declare const unsafeWindow: Window & typeof globalThis;

declare namespace GM {}
/* eslint-enable @typescript-eslint/no-unused-vars */

declare global {
  interface Window {
    ImageCollector2?: Record<string, unknown>;
    setImageCollectorDebug?(value: boolean): boolean;
    setImageCollectorZipButton?(value: boolean): boolean;
    setSingleImageTest?(value: boolean): boolean;
  }
}

export {};
