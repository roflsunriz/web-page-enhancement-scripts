const USD_TO_JPY = 150;
const YARD_TO_METER = 0.9144;
const POUND_TO_KILOGRAM = 0.453592;
const GALLON_TO_LITER = 3.78541;

const DIGIT_PATTERN = "[0-9０-９]";
const GROUPED_INTEGER_PATTERN = `${DIGIT_PATTERN}{1,3}(?:[,，]${DIGIT_PATTERN}{3})*`;
const UNGROUPED_INTEGER_PATTERN = `${DIGIT_PATTERN}+`;
const DECIMAL_PART_PATTERN = `(?:[\\.．]${DIGIT_PATTERN}+)?`;
const NUMBER_PATTERN = `(?:${GROUPED_INTEGER_PATTERN}|${UNGROUPED_INTEGER_PATTERN})${DECIMAL_PART_PATTERN}`;
const JAPANESE_UNIT_PATTERN = "(?:兆|億|万)";
const COMPOSITE_NUMBER_PATTERN = `${NUMBER_PATTERN}(?:${JAPANESE_UNIT_PATTERN}${NUMBER_PATTERN})*${JAPANESE_UNIT_PATTERN}?`;

const USD_TEXT_REGEX = new RegExp(
  `(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*(?<currencyPrefix>米|US|ＵＳ)?ドル`,
  "gu",
);

const USD_SYMBOL_REGEX = new RegExp(
  `(?<symbol>(?:US\\$|ＵＳ\\$|\\$))\\s*(?<amount>${COMPOSITE_NUMBER_PATTERN})(?!\\s*(?:米|US|ＵＳ)?ドル)`,
  "gu",
);

const YARD_REGEX = new RegExp(
  `(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*ヤード`,
  "gu",
);

const POUND_REGEX = new RegExp(
  `(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*ポンド`,
  "gu",
);

const GALLON_REGEX = new RegExp(
  `(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*ガロン`,
  "gu",
);

const LETTER_SUFFIX_REGEX = new RegExp(
  `(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*(?<unit>[kKｋＫmMｍＭgGｇＧtTｔＴbBｂＢ])(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,
  "gu",
);

const TEXTUAL_SUFFIX_REGEX = new RegExp(
  `(?<prefix>約|およそ|ほぼ)?\\s*(?<amount>${COMPOSITE_NUMBER_PATTERN})\\s*(?<unit>ミリオン|ビリオン|トリリオン|キロ|メガ|ギガ|テラ|million|Million|billion|Billion|trillion|Trillion|kilo|Kilo|mega|Mega|giga|Giga|tera|Tera)(?!(?:[A-Za-zａ-ｚＡ-Ｚ]))`,
  "gu",
);

type NamedGroups = Record<string, string | undefined>;

interface ParenthesesInfo {
  whitespace: string;
  openChar: "(" | "（";
  closeChar: ")" | "）";
  inside: string;
  endIndex: number;
}

interface ConversionContext {
  text: string;
  match: RegExpMatchArray;
  startIndex: number;
  endIndex: number;
  followingParentheses: ParenthesesInfo | null;
}

export function applyAutoConversions(text: string): string {
  if (!text || text.length === 0) {
    return text;
  }

  let result = text;
  result = appendConversion(result, USD_TEXT_REGEX, ["円", "JPY"], (amount) =>
    formatYen(amount * USD_TO_JPY),
  );
  result = appendConversion(result, USD_SYMBOL_REGEX, ["円", "JPY"], (amount) =>
    formatYen(amount * USD_TO_JPY),
  );
  result = appendConversion(
    result,
    YARD_REGEX,
    ["メートル", "m", "ｍ"],
    (amount) => `${formatMeasurement(amount * YARD_TO_METER)}メートル`,
  );
  result = appendConversion(
    result,
    POUND_REGEX,
    ["キログラム", "kg", "㎏", "キロ"],
    (amount) => `${formatMeasurement(amount * POUND_TO_KILOGRAM)}キログラム`,
  );
  result = appendConversion(
    result,
    GALLON_REGEX,
    ["リットル", "l", "L", "ℓ"],
    (amount) => `${formatMeasurement(amount * GALLON_TO_LITER)}リットル`,
  );
  result = appendConversion(
    result,
    LETTER_SUFFIX_REGEX,
    ["万", "億", "兆"],
    (amount, groups, context) => {
      const unit = groups.unit ?? "";
      const multiplier = getUnitMultiplier(unit);
      if (multiplier === null) {
        return null;
      }
      if (shouldSkipDueToFollowingWord(unit, context)) {
        return null;
      }
      return formatJapaneseLargeNumber(amount * multiplier);
    },
  );
  result = appendConversion(
    result,
    TEXTUAL_SUFFIX_REGEX,
    ["万", "億", "兆"],
    (amount, groups, context) => {
      const unit = groups.unit ?? "";
      const multiplier = getUnitMultiplier(unit);
      if (multiplier === null) {
        return null;
      }
      if (shouldSkipDueToFollowingWord(unit, context)) {
        return null;
      }
      return formatJapaneseLargeNumber(amount * multiplier);
    },
  );

  return result;
}

function appendConversion(
  text: string,
  regex: RegExp,
  keywords: readonly string[],
  converter: (
    amount: number,
    groups: NamedGroups,
    context: ConversionContext,
  ) => string | null,
): string {
  const matches = [...text.matchAll(regex)];
  if (matches.length === 0) {
    return text;
  }

  let result = "";
  let lastIndex = 0;

  for (const match of matches) {
    const startIndex = match.index ?? 0;
    const endIndex = startIndex + match[0].length;
    const segment = text.slice(lastIndex, startIndex);
    result += segment;

    const groups = (match.groups ?? {}) as NamedGroups;
    const amountText = groups.amount ?? "";
    const parsedAmount = parseJapaneseNumericString(amountText);

    const followingParentheses = inspectFollowingParentheses(text, endIndex);
    if (parsedAmount === null) {
      result += match[0];
      if (followingParentheses) {
        result +=
          followingParentheses.whitespace +
          followingParentheses.openChar +
          followingParentheses.inside +
          followingParentheses.closeChar;
        lastIndex = followingParentheses.endIndex;
      } else {
        lastIndex = endIndex;
      }
      continue;
    }

    if (
      followingParentheses &&
      keywords.some((keyword) => followingParentheses.inside.includes(keyword))
    ) {
      result += match[0];
      result +=
        followingParentheses.whitespace +
        followingParentheses.openChar +
        followingParentheses.inside +
        followingParentheses.closeChar;
      lastIndex = followingParentheses.endIndex;
      continue;
    }

    const context: ConversionContext = {
      text,
      match,
      startIndex,
      endIndex,
      followingParentheses,
    };
    const convertedValue = converter(parsedAmount, groups, context);
    if (convertedValue === null) {
      result += match[0];
      if (followingParentheses) {
        result +=
          followingParentheses.whitespace +
          followingParentheses.openChar +
          followingParentheses.inside +
          followingParentheses.closeChar;
        lastIndex = followingParentheses.endIndex;
      } else {
        lastIndex = endIndex;
      }
      continue;
    }

    if (followingParentheses) {
      const trimmedInside = followingParentheses.inside.trim();
      const combinedInside =
        trimmedInside.length > 0
          ? `${convertedValue}、${trimmedInside}`
          : convertedValue;
      result +=
        match[0] +
        followingParentheses.whitespace +
        followingParentheses.openChar +
        combinedInside +
        followingParentheses.closeChar;
      lastIndex = followingParentheses.endIndex;
    } else {
      result += `${match[0]}（${convertedValue}）`;
      lastIndex = endIndex;
    }
  }

  result += text.slice(lastIndex);
  return result;
}

function inspectFollowingParentheses(
  text: string,
  startIndex: number,
): ParenthesesInfo | null {
  let pointer = startIndex;
  let whitespace = "";

  while (pointer < text.length) {
    const char = text[pointer];
    if (isWhitespaceCharacter(char)) {
      whitespace += char;
      pointer += 1;
      continue;
    }
    break;
  }

  if (pointer >= text.length) {
    return null;
  }

  const openChar = text[pointer];
  if (openChar !== "(" && openChar !== "（") {
    return null;
  }

  const closeChar = openChar === "(" ? ")" : "）";
  const closingIndex = findClosingParenthesisIndex(text, pointer, openChar, closeChar);
  if (closingIndex === -1) {
    return null;
  }

  const inside = text.slice(pointer + 1, closingIndex);
  return {
    whitespace,
    openChar,
    closeChar,
    inside,
    endIndex: closingIndex + 1,
  };
}

function findClosingParenthesisIndex(
  text: string,
  openIndex: number,
  openChar: string,
  closeChar: string,
): number {
  let depth = 0;
  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];
    if (char === openChar) {
      depth += 1;
    } else if (char === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function isWhitespaceCharacter(char: string): boolean {
  return /\s/u.test(char);
}

function shouldSkipDueToFollowingWord(
  rawUnit: string,
  context: ConversionContext,
): boolean {
  if (!isMetricPrefix(rawUnit)) {
    return false;
  }
  const nextSlice = context.text.slice(context.endIndex, context.endIndex + 6);
  return /^(?:バイト|ビット|ヘルツ|メートル|リットル|グラム|ワット|ジュール|パスカル|ボルト|アンペア)/u.test(
    nextSlice,
  );
}

function parseJapaneseNumericString(raw: string): number | null {
  if (!raw) {
    return null;
  }

  const normalized = raw
    .replace(/[０-９]/gu, (digit) =>
      String.fromCharCode(digit.charCodeAt(0) - 0xfee0),
    )
    .replace(/[，]/gu, ",")
    .replace(/[．]/gu, ".")
    .replace(/,/gu, "")
    .replace(/\s+/gu, "");

  if (normalized.length === 0) {
    return null;
  }

  const pattern = /(\d+(?:\.\d+)?)(兆|億|万)?/gu;
  let total = 0;
  let hasMatch = false;
  let unitlessValue: number | null = null;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(normalized)) !== null) {
    if (match[0].length === 0) {
      continue;
    }
    const value = Number.parseFloat(match[1]);
    if (Number.isNaN(value)) {
      return null;
    }
    hasMatch = true;
    const unit = match[2];
    if (unit) {
      total += value * getJapaneseUnitMultiplier(unit);
    } else {
      unitlessValue = value;
    }
  }

  if (!hasMatch) {
    return null;
  }

  if (unitlessValue !== null) {
    total += unitlessValue;
  }

  return total;
}

function getJapaneseUnitMultiplier(unit: string): number {
  switch (unit) {
    case "万":
      return 10_000;
    case "億":
      return 100_000_000;
    case "兆":
      return 1_000_000_000_000;
    default:
      return 1;
  }
}

function formatJapaneseLargeNumber(amount: number, suffix = ""): string {
  const absAmount = Math.abs(amount);
  const units = [
    { threshold: 1_000_000_000_000, divisor: 1_000_000_000_000, suffix: `兆${suffix}` },
    { threshold: 100_000_000, divisor: 100_000_000, suffix: `億${suffix}` },
    { threshold: 10_000, divisor: 10_000, suffix: `万${suffix}` },
  ];

  for (const unit of units) {
    if (absAmount >= unit.threshold) {
      const value = amount / unit.divisor;
      return `${formatNumberWithPrecision(value)}${unit.suffix}`;
    }
  }

  if (suffix.length > 0) {
    return `${formatNumberWithPrecision(amount)}${suffix}`;
  }
  return formatNumberWithPrecision(amount);
}

function formatYen(amount: number): string {
  return formatJapaneseLargeNumber(amount, "円");
}

function formatMeasurement(value: number): string {
  const absValue = Math.abs(value);
  if (absValue < 1) {
    return formatNumberWithPrecision(value, 3);
  }
  return formatNumberWithPrecision(value, 2);
}

function formatNumberWithPrecision(
  value: number,
  maxFractionDigits?: number,
): string {
  const absValue = Math.abs(value);
  let fractionDigits = maxFractionDigits;
  if (fractionDigits === undefined) {
    if (absValue >= 100) {
      fractionDigits = 0;
    } else if (absValue >= 10) {
      fractionDigits = 1;
    } else if (absValue >= 1) {
      fractionDigits = 2;
    } else {
      fractionDigits = 3;
    }
  }

  const adjustedValue = Number.isFinite(value)
    ? Number.parseFloat(value.toFixed(fractionDigits))
    : 0;

  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(adjustedValue);
}

function getUnitMultiplier(rawUnit: string): number | null {
  const normalized = rawUnit
    .replace(/[Ａ-Ｚａ-ｚ]/gu, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "k":
    case "kilo":
    case "キロ":
      return 1_000;
    case "m":
    case "mega":
    case "million":
    case "ミリオン":
    case "メガ":
      return 1_000_000;
    case "b":
    case "billion":
    case "g":
    case "giga":
    case "ビリオン":
    case "ギガ":
      return 1_000_000_000;
    case "t":
    case "tera":
    case "trillion":
    case "テラ":
    case "トリリオン":
      return 1_000_000_000_000;
    default:
      return null;
  }
}

function isMetricPrefix(rawUnit: string): boolean {
  const normalized = rawUnit
    .replace(/[Ａ-Ｚａ-ｚ]/gu, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .trim()
    .toLowerCase();

  return (
    normalized === "k" ||
    normalized === "kilo" ||
    normalized === "キロ" ||
    normalized === "m" ||
    normalized === "mega" ||
    normalized === "メガ" ||
    normalized === "g" ||
    normalized === "giga" ||
    normalized === "ギガ" ||
    normalized === "t" ||
    normalized === "tera" ||
    normalized === "テラ"
  );
}
