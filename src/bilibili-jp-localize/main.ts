import { getValue, registerMenuCommand, setValue } from "@/shared/userscript";
import { format, t } from "./i18n";
import { startTranslator } from "./translator";

const SCRIPT_ID = "bilibili-jp-localize";
const ENABLED_KEY = `${SCRIPT_ID}.enabled`;

function loadEnabled(): boolean {
  return getValue<boolean>(ENABLED_KEY, true) ?? true;
}

function registerToggleMenu(enabled: boolean): void {
  registerMenuCommand(
    format("toggleMenu", {
      state: enabled ? t("stateOn") : t("stateOff"),
    }),
    () => {
      const next = !loadEnabled();
      setValue(ENABLED_KEY, next);
      window.alert(
        format("toggledMessage", {
          state: next ? t("stateOn") : t("stateOff"),
        }),
      );
    },
  );
}

function initialize(): void {
  const enabled = loadEnabled();
  registerToggleMenu(enabled);
  if (!enabled) {
    return;
  }
  startTranslator();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
