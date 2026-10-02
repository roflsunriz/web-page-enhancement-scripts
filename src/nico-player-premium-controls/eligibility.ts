export type Props = Record<string, unknown>;

export function isRecord(value: unknown): value is Props {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isRate(value: unknown): value is Props {
  return (
    isRecord(value) &&
    typeof value.playbackRate === "number" &&
    Number.isFinite(value.playbackRate) &&
    typeof value.available === "boolean"
  );
}

// These are the two local player presenters observed in the mobile watch bundle.
// Do not match a generic isPremium field: account, comment and quality props also use it.
export function unlockPlayerProps(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (
    typeof value.isPremium === "boolean" &&
    typeof value.setResumePlayback === "function" &&
    typeof value.setFlipped === "function" &&
    typeof value.onSkipAmountClick === "function" &&
    isRecord(value.skipAmountInfo)
  ) {
    return value.isPremium ? value : { ...value, isPremium: true };
  }
  if (
    Array.isArray(value.playbackRateList) &&
    value.playbackRateList.length > 0 &&
    value.playbackRateList.every(isRate) &&
    typeof value.onClickPlaybackRate === "function"
  ) {
    if (value.playbackRateList.every((rate: Props) => rate.available))
      return value;
    return {
      ...value,
      playbackRateList: value.playbackRateList.map((rate: Props) =>
        rate.available ? rate : { ...rate, available: true },
      ),
    };
  }
  return value;
}

type Render = (
  this: unknown,
  type: unknown,
  props: unknown,
  ...args: unknown[]
) => unknown;
export interface JsxRuntime {
  jsx: Render;
  jsxs: Render;
}

export function isJsxRuntime(value: unknown): value is JsxRuntime {
  return (
    isRecord(value) &&
    typeof value.jsx === "function" &&
    typeof value.jsxs === "function"
  );
}

export function installRuntimeAdapter(runtime: JsxRuntime): () => void {
  const originals = { jsx: runtime.jsx, jsxs: runtime.jsxs };
  const wrappers = {} as Record<"jsx" | "jsxs", Render>;
  try {
    for (const key of ["jsx", "jsxs"] as const) {
      wrappers[key] = function (type, props, ...args) {
        return Reflect.apply(originals[key], this, [
          type,
          unlockPlayerProps(props),
          ...args,
        ]);
      };
      if (
        !Reflect.set(runtime, key, wrappers[key]) ||
        runtime[key] !== wrappers[key]
      ) {
        throw new Error("The official JSX runtime cannot be adapted");
      }
    }
  } catch (error: unknown) {
    for (const key of ["jsx", "jsxs"] as const) {
      if (runtime[key] === wrappers[key])
        Reflect.set(runtime, key, originals[key]);
    }
    throw error;
  }
  return () => {
    for (const key of ["jsx", "jsxs"] as const) {
      if (runtime[key] === wrappers[key])
        Reflect.set(runtime, key, originals[key]);
    }
  };
}
