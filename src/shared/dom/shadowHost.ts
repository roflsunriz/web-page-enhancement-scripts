export interface ShadowHostOptions {
  id?: string;
  mode?: ShadowRootMode;
  cssText?: string;
  hostCssText?: string;
  adoptStyles?: string[];
  appendTo?: "body" | "documentElement";
}

export interface ShadowHostHandle {
  host: HTMLDivElement;
  root: ShadowRoot;
  dispose: () => void;
}

export const createShadowHost = (
  options: ShadowHostOptions = {},
): ShadowHostHandle => {
  const host = document.createElement("div");
  if (options.id) {
    host.id = options.id;
  }

  host.style.position = "relative";
  if (options.hostCssText) {
    host.style.cssText = options.hostCssText;
  }
  const root = host.attachShadow({ mode: options.mode ?? "open" });

  if (options.cssText) {
    const styleEl = document.createElement("style");
    styleEl.textContent = options.cssText;
    root.appendChild(styleEl);
  }

  if (options.adoptStyles?.length) {
    options.adoptStyles.forEach((css) => {
      const styleEl = document.createElement("style");
      styleEl.textContent = css;
      root.appendChild(styleEl);
    });
  }

  const parent =
    options.appendTo === "documentElement"
      ? document.documentElement
      : document.body;
  parent.appendChild(host);

  return {
    host,
    root,
    dispose: () => {
      host.remove();
    },
  };
};
