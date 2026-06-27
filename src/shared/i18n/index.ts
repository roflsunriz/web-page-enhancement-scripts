export type LocaleCode =
  | "ja"
  | "en"
  | "zh-Hans"
  | "hi"
  | "es"
  | "fr"
  | "ar"
  | "pt"
  | "bn"
  | "ru"
  | "ur";

export type TextDirection = "ltr" | "rtl";

export type TranslationTable<TKey extends string> = Readonly<
  Record<TKey, string>
>;
export type TranslationParams = Readonly<Record<string, string | number>>;

export type TranslationMap<
  TKey extends string,
  TLocale extends LocaleCode,
> = Readonly<Record<TLocale, TranslationTable<TKey>>>;

export interface I18nOptions<TKey extends string, TLocale extends LocaleCode> {
  translations: TranslationMap<TKey, TLocale>;
  defaultLocale: TLocale;
  fallbackLocale: TLocale;
  aliases?: Readonly<Record<string, TLocale>>;
}

export interface I18n<TKey extends string, TLocale extends LocaleCode> {
  readonly locales: readonly TLocale[];
  getLocale: () => TLocale;
  setLocale: (locale: TLocale) => void;
  detectBrowserLocale: () => TLocale;
  t: (key: TKey) => string;
  format: (key: TKey, params: TranslationParams) => string;
  getTranslations: (locale?: TLocale) => TranslationTable<TKey>;
  getDirection: (locale?: TLocale) => TextDirection;
  getMissingTranslationKeys: (locale: TLocale) => TKey[];
}

const RTL_LOCALES = new Set<LocaleCode>(["ar", "ur"]);

export function getTextDirection(locale: LocaleCode): TextDirection {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function interpolateTranslation(
  template: string,
  params: TranslationParams,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function createI18n<TKey extends string, TLocale extends LocaleCode>(
  options: I18nOptions<TKey, TLocale>,
): I18n<TKey, TLocale> {
  const locales = Object.keys(options.translations) as TLocale[];
  let currentLocale = options.defaultLocale;

  const resolveLocale = (rawLocale: string): TLocale | null => {
    const normalized = rawLocale.toLowerCase();
    const alias = options.aliases?.[normalized];
    if (alias) {
      return alias;
    }

    const exact = locales.find((locale) => locale.toLowerCase() === normalized);
    if (exact) {
      return exact;
    }

    const language = normalized.split("-")[0];
    return (
      locales.find(
        (locale) => locale.toLowerCase().split("-")[0] === language,
      ) ?? null
    );
  };

  const detectBrowserLocale = (): TLocale => {
    const browserLocales =
      navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];

    for (const locale of browserLocales) {
      const detected = resolveLocale(locale);
      if (detected) {
        return detected;
      }
    }

    return options.fallbackLocale;
  };

  const t = (key: TKey): string => {
    const currentText = options.translations[currentLocale]?.[key];
    if (currentText) {
      return currentText;
    }

    const fallbackText = options.translations[options.fallbackLocale]?.[key];
    if (fallbackText) {
      return fallbackText;
    }

    return options.translations[options.defaultLocale]?.[key] ?? key;
  };

  const format = (key: TKey, params: TranslationParams): string =>
    interpolateTranslation(t(key), params);

  const getTranslations = (
    locale: TLocale = currentLocale,
  ): TranslationTable<TKey> =>
    options.translations[locale] ??
    options.translations[options.fallbackLocale];

  const getMissingTranslationKeys = (locale: TLocale): TKey[] => {
    const fallbackTranslations = options.translations[options.fallbackLocale];
    const localeTranslations = options.translations[locale];
    return (Object.keys(fallbackTranslations) as TKey[]).filter(
      (key) => !localeTranslations[key],
    );
  };

  return {
    locales,
    getLocale: () => currentLocale,
    setLocale: (locale: TLocale) => {
      currentLocale = locale;
    },
    detectBrowserLocale,
    t,
    format,
    getTranslations,
    getDirection: (locale: TLocale = currentLocale) => getTextDirection(locale),
    getMissingTranslationKeys,
  };
}
