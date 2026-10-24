import { MESSAGES, isRtlLocale, resolveLocale } from "./i18n";
import {
  buildApkCubeDownloaderUrl,
  getPlayPackageName,
  type DownloadPreset,
} from "./links";

const HOST_ID = "apkcube-google-play-download";
const WATCH_INTERVAL_MS = 750;

function createDownloadLink(
  packageName: string,
  preset: DownloadPreset,
  label: string,
  hint: string | null,
  className: string,
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = className;
  link.href = buildApkCubeDownloaderUrl(packageName, preset);
  link.target = "_blank";
  link.rel = "noopener noreferrer nofollow";
  link.textContent = label;

  if (hint) {
    const hintElement = document.createElement("span");
    hintElement.textContent = hint;
    link.append(hintElement);
  }

  return link;
}

function createPanel(packageName: string): HTMLElement {
  const locale = resolveLocale(navigator.language);
  const messages = MESSAGES[locale];
  const host = document.createElement("aside");
  host.id = HOST_ID;
  host.setAttribute("data-package-name", packageName);
  host.setAttribute("dir", isRtlLocale(locale) ? "rtl" : "ltr");

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { color-scheme: light dark; font-family: Arial, "Noto Sans", sans-serif; }
    *, *::before, *::after { box-sizing: border-box; }
    .panel {
      position: fixed;
      z-index: 2147483646;
      inset-inline-end: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      width: min(370px, calc(100vw - 32px));
      border: 1px solid rgb(128 128 128 / 35%);
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      border-radius: 18px;
      padding: 16px;
      color: CanvasText;
      background: Canvas;
      background: color-mix(in srgb, Canvas 96%, transparent);
      box-shadow: 0 10px 35px rgb(0 0 0 / 24%);
      backdrop-filter: blur(12px);
    }
    .header { display: flex; align-items: flex-start; gap: 10px; }
    .heading { flex: 1; min-width: 0; }
    h2 { margin: 0; font-size: 17px; line-height: 1.3; }
    .description { margin: 5px 0 0; font-size: 12px; line-height: 1.5; opacity: .76; }
    .collapse {
      flex: 0 0 auto; width: 34px; height: 34px; border: 0; border-radius: 50%;
      color: inherit; background: rgb(128 128 128 / 14%);
      background: color-mix(in srgb, CanvasText 8%, transparent);
      cursor: pointer; font-size: 20px; line-height: 1;
    }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
    a { text-decoration: none; }
    .action {
      display: flex; min-height: 58px; flex-direction: column; align-items: flex-start;
      justify-content: center; border-radius: 13px; padding: 10px 12px;
      font-size: 13px; font-weight: 700; line-height: 1.3;
    }
    .action span { margin-top: 3px; font-size: 10px; font-weight: 400; opacity: .8; }
    .primary { color: #fff; background: #01875f; }
    .secondary {
      color: CanvasText; border: 1px solid rgb(128 128 128 / 35%);
      border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
      background: rgb(128 128 128 / 12%);
      background: color-mix(in srgb, CanvasText 6%, transparent);
    }
    .variants { display: inline-block; margin-top: 11px; color: #087f5b; font-size: 12px; font-weight: 700; }
    .notice { margin: 8px 0 0; font-size: 10px; line-height: 1.4; opacity: .62; }
    .launcher {
      display: none; position: fixed; z-index: 2147483646;
      inset-inline-end: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      min-width: 64px; height: 48px; border: 0; border-radius: 24px;
      padding: 0 17px; color: #fff; background: #01875f;
      box-shadow: 0 6px 22px rgb(0 0 0 / 28%); cursor: pointer;
      font-size: 14px; font-weight: 800;
    }
    :host([data-collapsed="true"]) .panel { display: none; }
    :host([data-collapsed="true"]) .launcher { display: block; }
    a:focus-visible, button:focus-visible { outline: 3px solid #4285f4; outline-offset: 3px; }
    @media (max-width: 520px) {
      .panel {
        inset-inline: 10px; bottom: max(10px, env(safe-area-inset-bottom));
        width: auto; max-height: calc(100dvh - 20px); overflow: auto;
        border-radius: 16px; padding: 14px;
      }
      .actions { grid-template-columns: 1fr; }
      .action { min-height: 50px; }
      .launcher { inset-inline-end: 10px; bottom: max(10px, env(safe-area-inset-bottom)); }
    }
    @media (prefers-reduced-motion: no-preference) {
      .action, .collapse, .launcher { transition: transform 120ms ease, filter 120ms ease; }
      .action:hover, .collapse:hover, .launcher:hover { filter: brightness(1.06); }
      .action:active, .collapse:active, .launcher:active { transform: translateY(1px); }
    }
  `;

  const panel = document.createElement("section");
  panel.className = "panel";

  const header = document.createElement("div");
  header.className = "header";
  const heading = document.createElement("div");
  heading.className = "heading";
  const title = document.createElement("h2");
  title.textContent = messages.title;
  title.id = `${HOST_ID}-title`;
  const description = document.createElement("p");
  description.className = "description";
  description.textContent = messages.description;
  heading.append(title, description);

  const collapse = document.createElement("button");
  collapse.className = "collapse";
  collapse.type = "button";
  collapse.setAttribute("aria-label", messages.collapse);
  collapse.textContent = "×";
  collapse.addEventListener("click", () => {
    host.setAttribute("data-collapsed", "true");
    launcher.focus();
  });
  header.append(heading, collapse);

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    createDownloadLink(
      packageName,
      "recommended",
      messages.recommended,
      messages.recommendedHint,
      "action primary",
    ),
    createDownloadLink(
      packageName,
      "universal",
      messages.universal,
      messages.universalHint,
      "action secondary",
    ),
  );

  const variants = createDownloadLink(
    packageName,
    "variants",
    messages.variants,
    null,
    "variants",
  );
  const notice = document.createElement("p");
  notice.className = "notice";
  notice.textContent = messages.providerNotice;
  panel.append(header, actions, variants, notice);
  panel.setAttribute("aria-labelledby", title.id);

  const launcher = document.createElement("button");
  launcher.className = "launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", messages.expand);
  launcher.textContent = "APK";
  launcher.addEventListener("click", () => {
    host.removeAttribute("data-collapsed");
    collapse.focus();
  });

  shadow.append(style, panel, launcher);
  return host;
}

function syncPanel(): void {
  const packageName = getPlayPackageName(window.location.href);
  const existing = document.getElementById(HOST_ID);

  if (!packageName) {
    existing?.remove();
    return;
  }

  if (existing?.getAttribute("data-package-name") === packageName) {
    return;
  }

  existing?.remove();
  (document.body ?? document.documentElement)?.append(createPanel(packageName));
}

export function startPlayPageButton(): void {
  const start = (): void => {
    syncPanel();
    window.setInterval(syncPanel, WATCH_INTERVAL_MS);
    window.addEventListener("popstate", syncPanel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
