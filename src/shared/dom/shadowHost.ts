export interface ShadowHostOptions {
  id?: string;
  mode?: ShadowRootMode;
  cssText?: string;
  adoptStyles?: string[];
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

  document.body.appendChild(host);

  return {
    host,
    root,
    dispose: () => {
      host.remove();
    },
  };
};
