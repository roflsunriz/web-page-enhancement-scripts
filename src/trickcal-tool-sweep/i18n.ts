import { createI18n, type LocaleCode } from "@/shared/i18n";

type TrickcalLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "stateOff"
  | "stateOn"
  | "replaceImagesMenu"
  | "replaceTooltipsMenu"
  | "replaceImagesChanged"
  | "replaceTooltipsChanged";

const translations = {
  ja: {
    stateOff: "OFF",
    stateOn: "ON",
    replaceImagesMenu: "画像差し替え: {state}",
    replaceTooltipsMenu: "ツールチップ置き換え: {state}",
    replaceImagesChanged:
      "画像差し替えを{state}にしました。メニュー表示はページ再読み込み後に更新されます。",
    replaceTooltipsChanged:
      "ツールチップ置き換えを{state}にしました。メニュー表示はページ再読み込み後に更新されます。",
  },
  en: {
    stateOff: "Off",
    stateOn: "On",
    replaceImagesMenu: "Replace images: {state}",
    replaceTooltipsMenu: "Replace tooltips: {state}",
    replaceImagesChanged:
      "Replace images is now {state}. The menu display will update after reloading the page.",
    replaceTooltipsChanged:
      "Replace tooltips is now {state}. The menu display will update after reloading the page.",
  },
} satisfies Record<TrickcalLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, TrickcalLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
