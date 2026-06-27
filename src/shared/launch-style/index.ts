import { getValue, setValue, registerMenuCommand } from "@/shared/userscript";
import { createI18n, type LocaleCode } from "@/shared/i18n";
import {
  LAUNCH_STYLES,
  LAUNCH_STYLE_LABELS,
} from "@/shared/types/launch-style";
import type { LaunchStyle } from "@/shared/types/launch-style";

const STORAGE_KEY_PREFIX = "launch-style-";

type LaunchStyleLocale = Extract<LocaleCode, "ja" | "en">;
type TranslationKey =
  | "changeLaunchStyle"
  | "current"
  | "styleChanged"
  | "reloadToApply"
  | `style_${LaunchStyle}`;

const i18n = createI18n<TranslationKey, LaunchStyleLocale>({
  translations: {
    ja: {
      changeLaunchStyle: "起動スタイル変更",
      current: "現在",
      styleChanged: "起動スタイルを「{style}」に変更しました。",
      reloadToApply: "ページを再読み込みすると反映されます。",
      style_classic: LAUNCH_STYLE_LABELS.classic,
      style_fab: LAUNCH_STYLE_LABELS.fab,
      "style_menu-only": LAUNCH_STYLE_LABELS["menu-only"],
    },
    en: {
      changeLaunchStyle: "Change launch style",
      current: "Current",
      styleChanged: 'Changed launch style to "{style}".',
      reloadToApply: "Reload the page to apply it.",
      style_classic: "Classic style",
      style_fab: "FAB button",
      "style_menu-only": "Menu only",
    },
  },
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

function getLaunchStyleLabel(style: LaunchStyle): string {
  return i18n.t(`style_${style}`);
}

/**
 * 保存された起動スタイルを取得する
 */
export function getLaunchStyle(
  scriptId: string,
  defaultStyle: LaunchStyle = "classic",
): LaunchStyle {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  const stored = getValue<string>(key);
  if (
    typeof stored === "string" &&
    (LAUNCH_STYLES as readonly string[]).includes(stored)
  ) {
    return stored as LaunchStyle;
  }
  return defaultStyle;
}

/**
 * 起動スタイルを保存する
 */
export function setLaunchStyle(scriptId: string, style: LaunchStyle): void {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  setValue(key, style);
}

/**
 * 次の起動スタイルに循環する
 */
export function cycleLaunchStyle(current: LaunchStyle): LaunchStyle {
  const idx = LAUNCH_STYLES.indexOf(current);
  const nextIdx = (idx + 1) % LAUNCH_STYLES.length;
  return LAUNCH_STYLES[nextIdx];
}

/**
 * 起動スタイル切り替えメニューコマンドを登録する
 */
export function registerLaunchStyleMenu(
  scriptId: string,
  onStyleChanged?: (newStyle: LaunchStyle) => void,
): void {
  const current = getLaunchStyle(scriptId);
  const label = `${i18n.t("changeLaunchStyle")} [${i18n.t("current")}: ${getLaunchStyleLabel(current)}]`;
  registerMenuCommand(label, () => {
    const currentStyle = getLaunchStyle(scriptId);
    const newStyle = cycleLaunchStyle(currentStyle);
    setLaunchStyle(scriptId, newStyle);
    onStyleChanged?.(newStyle);
    alert(
      `${i18n.format("styleChanged", { style: getLaunchStyleLabel(newStyle) })}\n${i18n.t("reloadToApply")}`,
    );
  });
}
