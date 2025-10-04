export type UnsafeWindow = Window & typeof globalThis;

export function getUnsafeWindow(): UnsafeWindow {
  if (typeof unsafeWindow !== "undefined") {
    return unsafeWindow as UnsafeWindow;
  }

  return window as unknown as UnsafeWindow;
}
