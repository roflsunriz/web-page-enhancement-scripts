import { createShadowHost, type ShadowHostHandle } from "@/shared/dom";
import { getLaunchStyle, setLaunchStyle } from "@/shared/launch-style";
import {
  LAUNCH_STYLES,
  LAUNCH_STYLE_LABELS,
  type LaunchStyle,
} from "@/shared/types/launch-style";
import { getValue, registerMenuCommand, setValue } from "@/shared/userscript";

const STORAGE_KEY_PREFIX = "script-settings-";

type SiteAccessMode = "all" | "allowlist";
type SiteAccessRuleType = "domain" | "regex";

type SiteAccessRule = {
  id: string;
  type: SiteAccessRuleType;
  pattern: string;
  enabled: boolean;
};

type StoredScriptSettings = {
  siteAccessMode: SiteAccessMode;
  siteAccessRules: SiteAccessRule[];
};

type ScriptSettingsOptions = {
  scriptId: string;
  scriptName: string;
  includeLaunchStyle?: boolean;
  defaultLaunchStyle?: LaunchStyle;
  onSettingsChanged?: () => void;
};

const DEFAULT_SETTINGS: StoredScriptSettings = {
  siteAccessMode: "all",
  siteAccessRules: [],
};

let activeModal: ShadowHostHandle | null = null;

export function isSiteAccessAllowed(
  scriptId: string,
  url: URL = new URL(window.location.href),
): boolean {
  const settings = getScriptSettings(scriptId);
  if (settings.siteAccessMode === "all") return true;

  return settings.siteAccessRules.some(
    (rule) => rule.enabled && doesRuleMatch(rule, url),
  );
}

export function registerScriptSettingsMenu(
  options: ScriptSettingsOptions,
): void {
  registerMenuCommand(`${options.scriptName} 設定`, () => {
    openScriptSettingsModal(options);
  });
}

function getScriptSettings(scriptId: string): StoredScriptSettings {
  const stored = getValue<unknown>(getStorageKey(scriptId));
  if (!isStoredScriptSettings(stored)) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    siteAccessMode: stored.siteAccessMode,
    siteAccessRules: stored.siteAccessRules,
  };
}

function setScriptSettings(
  scriptId: string,
  settings: StoredScriptSettings,
): void {
  setValue(getStorageKey(scriptId), settings);
}

function getStorageKey(scriptId: string): string {
  return `${STORAGE_KEY_PREFIX}${scriptId}`;
}

function isStoredScriptSettings(value: unknown): value is StoredScriptSettings {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    siteAccessMode?: unknown;
    siteAccessRules?: unknown;
  };
  if (
    candidate.siteAccessMode !== "all" &&
    candidate.siteAccessMode !== "allowlist"
  ) {
    return false;
  }
  if (!Array.isArray(candidate.siteAccessRules)) return false;
  return candidate.siteAccessRules.every(isSiteAccessRule);
}

function isSiteAccessRule(value: unknown): value is SiteAccessRule {
  if (!value || typeof value !== "object") return false;
  const candidate = value as {
    id?: unknown;
    type?: unknown;
    pattern?: unknown;
    enabled?: unknown;
  };
  return (
    typeof candidate.id === "string" &&
    (candidate.type === "domain" || candidate.type === "regex") &&
    typeof candidate.pattern === "string" &&
    typeof candidate.enabled === "boolean"
  );
}

function doesRuleMatch(rule: SiteAccessRule, url: URL): boolean {
  if (rule.type === "domain") {
    const pattern = normalizeDomain(rule.pattern);
    if (!pattern) return false;
    return url.hostname === pattern || url.hostname.endsWith(`.${pattern}`);
  }

  try {
    return new RegExp(rule.pattern).test(url.href);
  } catch {
    return false;
  }
}

function normalizeDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`)
      .hostname;
  } catch {
    return trimmed.replace(/^\.+|\.+$/g, "");
  }
}

function openScriptSettingsModal(options: ScriptSettingsOptions): void {
  activeModal?.dispose();
  activeModal = createShadowHost({
    id: `script-settings-${options.scriptId}`,
    mode: "closed",
    cssText: `
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: auto;
    `,
  });
  const root = activeModal.root;
  const style = document.createElement("style");
  style.textContent = getModalStyles();
  root.appendChild(style);

  const shell = document.createElement("div");
  shell.className = "ss-backdrop";
  root.appendChild(shell);

  const render = () => {
    const settings = getScriptSettings(options.scriptId);
    const currentLaunchStyle = getLaunchStyle(
      options.scriptId,
      options.defaultLaunchStyle,
    );
    const currentUrl = new URL(window.location.href);
    const isAllowed = isSiteAccessAllowed(options.scriptId, currentUrl);

    shell.replaceChildren(
      createModalContent({
        options,
        settings,
        currentLaunchStyle,
        currentUrl,
        isAllowed,
        render,
      }),
    );
  };

  shell.addEventListener("click", (event) => {
    if (event.target === shell) closeModal();
  });
  render();
}

type ModalContentContext = {
  options: ScriptSettingsOptions;
  settings: StoredScriptSettings;
  currentLaunchStyle: LaunchStyle;
  currentUrl: URL;
  isAllowed: boolean;
  render: () => void;
};

function createModalContent(context: ModalContentContext): HTMLElement {
  const { options, currentLaunchStyle, isAllowed } = context;
  const panel = document.createElement("section");
  panel.className = "ss-panel";

  const header = document.createElement("div");
  header.className = "ss-header";
  const title = document.createElement("h2");
  title.textContent = `${options.scriptName} 設定`;
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "ss-icon-button";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", closeModal);
  header.append(title, closeButton);

  const status = document.createElement("div");
  status.className = isAllowed ? "ss-status allowed" : "ss-status blocked";
  status.textContent = isAllowed
    ? "現在のページでは起動 UI を表示します"
    : "現在のページでは起動 UI を表示しません";

  panel.append(header, status);

  if (options.includeLaunchStyle) {
    panel.append(createLaunchStyleSection(options, currentLaunchStyle));
  }

  panel.append(createSiteAccessSection(context));

  const footer = document.createElement("div");
  footer.className = "ss-footer";
  const reloadHint = document.createElement("span");
  reloadHint.textContent =
    "起動 UI の表示状態はページ再読み込み後に確実に反映されます。";
  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "ss-primary";
  doneButton.textContent = "閉じる";
  doneButton.addEventListener("click", closeModal);
  footer.append(reloadHint, doneButton);
  panel.append(footer);

  return panel;
}

function createLaunchStyleSection(
  options: ScriptSettingsOptions,
  currentLaunchStyle: LaunchStyle,
): HTMLElement {
  const section = createSection("起動スタイル");
  const group = document.createElement("div");
  group.className = "ss-segmented";

  LAUNCH_STYLES.forEach((style) => {
    const label = document.createElement("label");
    label.className = "ss-segment";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "launch-style";
    input.value = style;
    input.checked = style === currentLaunchStyle;
    input.addEventListener("change", () => {
      setLaunchStyle(options.scriptId, style);
      options.onSettingsChanged?.();
    });
    const text = document.createElement("span");
    text.textContent = LAUNCH_STYLE_LABELS[style];
    label.append(input, text);
    group.appendChild(label);
  });

  section.appendChild(group);
  return section;
}

function createSiteAccessSection(context: ModalContentContext): HTMLElement {
  const { options, settings, currentUrl, render } = context;
  const section = createSection("対象サイト");

  const modeGroup = document.createElement("div");
  modeGroup.className = "ss-radio-group";
  modeGroup.append(
    createModeRadio(options, settings, "all", "すべてのサイトで表示", render),
    createModeRadio(
      options,
      settings,
      "allowlist",
      "許可したサイトでのみ表示",
      render,
    ),
  );

  const quickActions = document.createElement("div");
  quickActions.className = "ss-actions";
  const addCurrentDomain = document.createElement("button");
  addCurrentDomain.type = "button";
  addCurrentDomain.className = "ss-secondary";
  addCurrentDomain.textContent = `現在のドメインを許可: ${currentUrl.hostname}`;
  addCurrentDomain.addEventListener("click", () => {
    const next = addRule(settings, {
      type: "domain",
      pattern: currentUrl.hostname,
      enabled: true,
    });
    next.siteAccessMode = "allowlist";
    setScriptSettings(options.scriptId, next);
    options.onSettingsChanged?.();
    render();
  });
  quickActions.appendChild(addCurrentDomain);

  const form = document.createElement("form");
  form.className = "ss-rule-form";
  const typeSelect = document.createElement("select");
  typeSelect.name = "rule-type";
  appendOption(typeSelect, "domain", "ドメイン");
  appendOption(typeSelect, "regex", "正規表現");
  const patternInput = document.createElement("input");
  patternInput.name = "pattern";
  patternInput.type = "text";
  patternInput.placeholder = "example.com または https?://example\\.com/.*";
  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.className = "ss-primary";
  addButton.textContent = "追加";
  form.append(typeSelect, patternInput, addButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = typeSelect.value === "regex" ? "regex" : "domain";
    const pattern = patternInput.value.trim();
    if (!pattern) return;
    const next = addRule(settings, { type, pattern, enabled: true });
    next.siteAccessMode = "allowlist";
    setScriptSettings(options.scriptId, next);
    options.onSettingsChanged?.();
    render();
  });

  section.append(modeGroup, quickActions, form, createRuleList(context));
  return section;
}

function createModeRadio(
  options: ScriptSettingsOptions,
  settings: StoredScriptSettings,
  mode: SiteAccessMode,
  labelText: string,
  render: () => void,
): HTMLElement {
  const label = document.createElement("label");
  label.className = "ss-radio";
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "site-access-mode";
  input.value = mode;
  input.checked = settings.siteAccessMode === mode;
  input.addEventListener("change", () => {
    setScriptSettings(options.scriptId, { ...settings, siteAccessMode: mode });
    options.onSettingsChanged?.();
    render();
  });
  const text = document.createElement("span");
  text.textContent = labelText;
  label.append(input, text);
  return label;
}

function createRuleList(context: ModalContentContext): HTMLElement {
  const { options, settings, render } = context;
  const list = document.createElement("div");
  list.className = "ss-rule-list";

  if (settings.siteAccessRules.length === 0) {
    const empty = document.createElement("div");
    empty.className = "ss-empty";
    empty.textContent = "許可ルールはまだありません。";
    list.appendChild(empty);
    return list;
  }

  settings.siteAccessRules.forEach((rule) => {
    const row = document.createElement("div");
    row.className = "ss-rule-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = rule.enabled;
    checkbox.addEventListener("change", () => {
      const next = updateRule(settings, rule.id, {
        enabled: checkbox.checked,
      });
      setScriptSettings(options.scriptId, next);
      options.onSettingsChanged?.();
      render();
    });

    const label = document.createElement("div");
    label.className = "ss-rule-label";
    const type = document.createElement("span");
    type.className = "ss-rule-type";
    type.textContent = rule.type === "domain" ? "ドメイン" : "正規表現";
    const pattern = document.createElement("span");
    pattern.textContent = rule.pattern;
    label.append(type, pattern);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "ss-danger";
    remove.textContent = "削除";
    remove.addEventListener("click", () => {
      setScriptSettings(options.scriptId, removeRule(settings, rule.id));
      options.onSettingsChanged?.();
      render();
    });

    row.append(checkbox, label, remove);
    list.appendChild(row);
  });

  return list;
}

function addRule(
  settings: StoredScriptSettings,
  rule: Omit<SiteAccessRule, "id">,
): StoredScriptSettings {
  const pattern =
    rule.type === "domain" ? normalizeDomain(rule.pattern) : rule.pattern;
  const existing = settings.siteAccessRules.find(
    (item) => item.type === rule.type && item.pattern === pattern,
  );
  if (existing) {
    return updateRule(settings, existing.id, { enabled: true });
  }
  return {
    ...settings,
    siteAccessRules: [
      ...settings.siteAccessRules,
      {
        ...rule,
        pattern,
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      },
    ],
  };
}

function updateRule(
  settings: StoredScriptSettings,
  id: string,
  patch: Partial<Pick<SiteAccessRule, "enabled">>,
): StoredScriptSettings {
  return {
    ...settings,
    siteAccessRules: settings.siteAccessRules.map((rule) =>
      rule.id === id ? { ...rule, ...patch } : rule,
    ),
  };
}

function removeRule(
  settings: StoredScriptSettings,
  id: string,
): StoredScriptSettings {
  return {
    ...settings,
    siteAccessRules: settings.siteAccessRules.filter((rule) => rule.id !== id),
  };
}

function createSection(titleText: string): HTMLElement {
  const section = document.createElement("section");
  section.className = "ss-section";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.appendChild(title);
  return section;
}

function appendOption(
  select: HTMLSelectElement,
  value: string,
  label: string,
): void {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

function closeModal(): void {
  activeModal?.dispose();
  activeModal = null;
}

function getModalStyles(): string {
  return `
    :host { all: initial; color-scheme: light dark; }
    * { box-sizing: border-box; }
    .ss-backdrop {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15, 23, 42, 0.62);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .ss-panel {
      width: min(720px, 100%);
      max-height: min(760px, calc(100vh - 48px));
      overflow: auto;
      background: #ffffff;
      color: #111827;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      box-shadow: 0 24px 64px rgba(15, 23, 42, 0.28);
      padding: 20px;
    }
    .ss-header,
    .ss-footer,
    .ss-actions,
    .ss-rule-form,
    .ss-rule-row,
    .ss-radio-group,
    .ss-segmented {
      display: flex;
      gap: 10px;
    }
    .ss-header,
    .ss-footer,
    .ss-rule-row {
      align-items: center;
    }
    .ss-header,
    .ss-footer {
      justify-content: space-between;
    }
    h2, h3 { margin: 0; line-height: 1.25; }
    h2 { font-size: 20px; }
    h3 { font-size: 15px; }
    .ss-section {
      display: grid;
      gap: 12px;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid #e5e7eb;
    }
    .ss-status {
      margin-top: 14px;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 13px;
      border: 1px solid;
    }
    .ss-status.allowed {
      background: #ecfdf5;
      color: #065f46;
      border-color: #a7f3d0;
    }
    .ss-status.blocked {
      background: #fef2f2;
      color: #991b1b;
      border-color: #fecaca;
    }
    .ss-segmented,
    .ss-radio-group {
      flex-wrap: wrap;
    }
    .ss-segment,
    .ss-radio {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      cursor: pointer;
      background: #f9fafb;
      font-size: 13px;
    }
    .ss-rule-form {
      align-items: stretch;
      flex-wrap: wrap;
    }
    select,
    input[type="text"] {
      min-height: 36px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 7px 10px;
      font: inherit;
      background: #ffffff;
      color: #111827;
    }
    input[type="text"] {
      flex: 1 1 280px;
      min-width: 0;
    }
    button {
      min-height: 36px;
      border-radius: 6px;
      border: 1px solid transparent;
      padding: 7px 12px;
      font: inherit;
      cursor: pointer;
    }
    .ss-primary {
      background: #2563eb;
      color: #ffffff;
    }
    .ss-secondary {
      background: #eef2ff;
      color: #1e40af;
      border-color: #c7d2fe;
    }
    .ss-danger {
      background: #fff1f2;
      color: #be123c;
      border-color: #fecdd3;
    }
    .ss-icon-button {
      min-width: 36px;
      padding: 0;
      background: #f3f4f6;
      color: #111827;
      border-color: #d1d5db;
      font-size: 22px;
      line-height: 1;
    }
    .ss-rule-list {
      display: grid;
      gap: 8px;
    }
    .ss-rule-row {
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #ffffff;
    }
    .ss-rule-label {
      display: grid;
      gap: 2px;
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
      font-size: 13px;
    }
    .ss-rule-type,
    .ss-empty,
    .ss-footer {
      color: #6b7280;
      font-size: 12px;
    }
    @media (prefers-color-scheme: dark) {
      .ss-panel {
        background: #111827;
        color: #f9fafb;
        border-color: #374151;
      }
      .ss-section { border-color: #374151; }
      .ss-segment,
      .ss-radio,
      select,
      input[type="text"],
      .ss-rule-row {
        background: #1f2937;
        color: #f9fafb;
        border-color: #374151;
      }
      .ss-icon-button {
        background: #1f2937;
        color: #f9fafb;
        border-color: #374151;
      }
      .ss-rule-type,
      .ss-empty,
      .ss-footer {
        color: #9ca3af;
      }
    }
  `;
}
