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

export type TopLanguageLocale = Exclude<LocaleCode, "ja">;

export interface LocaleMetadata {
  code: LocaleCode;
  englishName: string;
  nativeName: string;
  direction: TextDirection;
}

export const TOP_LANGUAGE_LOCALES = [
  "en",
  "zh-Hans",
  "hi",
  "es",
  "fr",
  "ar",
  "pt",
  "bn",
  "ru",
  "ur",
] as const satisfies readonly TopLanguageLocale[];

export const SUPPORTED_LOCALES = [
  "ja",
  ...TOP_LANGUAGE_LOCALES,
] as const satisfies readonly LocaleCode[];

const RTL_LOCALES = new Set<LocaleCode>(["ar", "ur"]);

export const LOCALE_METADATA = {
  ja: {
    code: "ja",
    englishName: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
  },
  en: {
    code: "en",
    englishName: "English",
    nativeName: "English",
    direction: "ltr",
  },
  "zh-Hans": {
    code: "zh-Hans",
    englishName: "Mandarin Chinese",
    nativeName: "简体中文",
    direction: "ltr",
  },
  hi: {
    code: "hi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
  },
  es: {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
    direction: "ltr",
  },
  fr: {
    code: "fr",
    englishName: "French",
    nativeName: "Français",
    direction: "ltr",
  },
  ar: {
    code: "ar",
    englishName: "Modern Standard Arabic",
    nativeName: "العربية",
    direction: "rtl",
  },
  pt: {
    code: "pt",
    englishName: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
  },
  bn: {
    code: "bn",
    englishName: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
  },
  ru: {
    code: "ru",
    englishName: "Russian",
    nativeName: "Русский",
    direction: "ltr",
  },
  ur: {
    code: "ur",
    englishName: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
  },
} as const satisfies Record<LocaleCode, LocaleMetadata>;

export const DEFAULT_LOCALE_ALIASES: Readonly<Record<string, LocaleCode>> = {
  zh: "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh-my": "zh-Hans",
  cmn: "zh-Hans",
  "cmn-hans": "zh-Hans",
  "cmn-hans-cn": "zh-Hans",
  "pt-br": "pt",
  "pt-pt": "pt",
  "ar-sa": "ar",
  "ar-ae": "ar",
  "ar-eg": "ar",
  "ur-pk": "ur",
  "ur-in": "ur",
};

export type TranslationTable<TKey extends string> = Readonly<
  Record<TKey, string>
>;
export type TranslationParams = Readonly<Record<string, string | number>>;

export type TranslationMap<
  TKey extends string,
  TLocale extends LocaleCode,
> = Readonly<Record<TLocale, TranslationTable<TKey>>>;

export type PartialTranslationTable<TKey extends string> = Readonly<
  Partial<Record<TKey, string>>
>;

export type RequiredFallbackTranslations<
  TKey extends string,
  TLocale extends LocaleCode,
  TFallbackLocale extends TLocale,
> = Readonly<
  Record<TFallbackLocale, TranslationTable<TKey>> &
    Partial<
      Record<Exclude<TLocale, TFallbackLocale>, PartialTranslationTable<TKey>>
    >
>;

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

export function getTextDirection(locale: LocaleCode): TextDirection {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function getLocaleMetadata(locale: LocaleCode): LocaleMetadata {
  return LOCALE_METADATA[locale];
}

export function buildFallbackTranslationMap<
  TKey extends string,
  TLocale extends LocaleCode,
  TFallbackLocale extends TLocale,
>(
  translations: RequiredFallbackTranslations<TKey, TLocale, TFallbackLocale>,
  locales: readonly TLocale[],
  fallbackLocale: TFallbackLocale,
): TranslationMap<TKey, TLocale> {
  const fallbackTranslations = translations[fallbackLocale];
  const completed: Partial<Record<TLocale, TranslationTable<TKey>>> = {};
  const partialTranslations = translations as Readonly<
    Partial<Record<TLocale, PartialTranslationTable<TKey>>>
  >;

  for (const locale of locales) {
    completed[locale] = {
      ...fallbackTranslations,
      ...(partialTranslations[locale] ?? {}),
    };
  }

  return completed as TranslationMap<TKey, TLocale>;
}

export function buildSupportedTranslationMap<
  TKey extends string,
  TFallbackLocale extends LocaleCode,
>(
  translations: RequiredFallbackTranslations<TKey, LocaleCode, TFallbackLocale>,
  fallbackLocale: TFallbackLocale,
): TranslationMap<TKey, LocaleCode> {
  return buildFallbackTranslationMap(
    translations,
    SUPPORTED_LOCALES,
    fallbackLocale,
  );
}

export function createSupportedI18n<
  TKey extends string,
  TFallbackLocale extends LocaleCode,
>(
  options: Omit<
    I18nOptions<TKey, LocaleCode>,
    "aliases" | "fallbackLocale" | "translations"
  > & {
    translations: RequiredFallbackTranslations<
      TKey,
      LocaleCode,
      TFallbackLocale
    >;
    fallbackLocale: TFallbackLocale;
    aliases?: Readonly<Record<string, LocaleCode>>;
  },
): I18n<TKey, LocaleCode> {
  return createI18n<TKey, LocaleCode>({
    ...options,
    aliases: {
      ...DEFAULT_LOCALE_ALIASES,
      ...(options.aliases ?? {}),
    },
    translations: buildSupportedTranslationMap(
      options.translations,
      options.fallbackLocale,
    ),
  });
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
