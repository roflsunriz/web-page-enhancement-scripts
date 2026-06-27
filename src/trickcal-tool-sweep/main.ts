import { getValue, registerMenuCommand, setValue } from "@/shared/userscript";
import { format, t } from "./i18n";

type FeatureSettings = {
  replaceImages: boolean;
  replaceTooltips: boolean;
};

const SCRIPT_ID = "trickcal-tool-sweep";
const REPLACED_ATTRIBUTE = `data-${SCRIPT_ID}-material`;
const SETTINGS_KEYS = {
  replaceImages: `${SCRIPT_ID}.replace-images`,
  replaceTooltips: `${SCRIPT_ID}.replace-tooltips`,
} as const;
const IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/images";
const DEFAULT_SETTINGS: FeatureSettings = {
  replaceImages: true,
  replaceTooltips: true,
};

const TOOLTIP_TRANSLATIONS = {
  泳鏡: "ゴーグル",
  可回收紙袋: "リサイクル紙袋",
  玩具手指虎: "おもちゃのナックル",
  堅硬的法棍: "硬いバゲット",
  拳擊手套: "ボクシンググローブ",
  古老勺子: "古いスプーン",
  故障的雨傘: "壊れた傘",
  紅色鉛筆: "赤い鉛筆",
  紅色套脖泳圈: "赤い首浮き輪",
  紅色圍裙: "赤いエプロン",
  紅色裙子: "赤いスカート",
  紅布腰帶: "赤布の腰帯",
  細線戒指: "細い糸の指輪",
  細線手環: "細い糸のブレスレット",
  小水槍: "小さな水鉄砲",
  小面具: "小さな仮面",
  小麵包刀: "小さなパン切りナイフ",
  陳舊眼鏡: "古びた眼鏡",
  陳舊的拖鞋: "古びたスリッパ",
  陳舊杯子: "古びたカップ",
  陳舊零錢包: "古びた小銭入れ",
  陳舊腕帶: "古びたリストバンド",
  陳舊梳子: "古びた櫛",
  糖球戒指: "キャンディ玉の指輪",
  糖球耳環: "キャンディ玉のイヤリング",
  能量飲: "エナジードリンク",
  破舊的披風: "ボロボロのマント",
  平凡的居家服: "普通の部屋着",
  平凡的拖鞋: "普通のスリッパ",
  涼感脖套: "冷感ネックゲイター",
  領口鬆垮的T恤: "襟元のゆるいTシャツ",
  鬆緊帶短褲: "ゴム入りショートパンツ",
  扔石彈弓: "石投げパチンコ",
  漩渦糖果項鍊: "うずまきキャンディのネックレス",
  趕製的尖頂帽: "急ごしらえのとんがり帽子",
  "靴子圖紙（2階）": "靴の図面（2階）",
  "燦爛的飾品圖紙（2階）": "輝く装飾品の図面（2階）",
  "物理武器圖紙（2階）": "物理武器の図面（2階）",
  "帽子圖紙（2階）": "帽子の図面（2階）",
  "魔法武器圖紙（2階）": "魔法武器の図面（2階）",
  "璀璨的飾品圖紙（2階）": "煌めく装飾品の図面（2階）",
  "盔甲圖紙（2階）": "鎧の図面（2階）",
  "靴子圖紙（3階）": "靴の図面（3階）",
  "燦爛的飾品圖紙（3階）": "輝く装飾品の図面（3階）",
  "物理武器圖紙（3階）": "物理武器の図面（3階）",
  "帽子圖紙（3階）": "帽子の図面（3階）",
  "魔法武器圖紙（3階）": "魔法武器の図面（3階）",
  "璀璨的飾品圖紙（3階）": "煌めく装飾品の図面（3階）",
  "盔甲圖紙（3階）": "鎧の図面（3階）",
  "靴子碎片（4階）": "靴の欠片（4階）",
  "燦爛的飾品碎片（4階）": "輝く装飾品の欠片（4階）",
  "物理武器碎片（4階）": "物理武器の欠片（4階）",
  "帽子碎片（4階）": "帽子の欠片（4階）",
  "魔法武器碎片（4階）": "魔法武器の欠片（4階）",
  "璀璨的飾品碎片（4階）": "煌めく装飾品の欠片（4階）",
  "盔甲碎片（4階）": "鎧の欠片（4階）",
  "靴子圖紙（5階）": "靴の図面（5階）",
  "燦爛的飾品圖紙（5階）": "輝く装飾品の図面（5階）",
  "物理武器圖紙（5階）": "物理武器の図面（5階）",
  "帽子圖紙（5階）": "帽子の図面（5階）",
  "魔法武器圖紙（5階）": "魔法武器の図面（5階）",
  "璀璨的飾品圖紙（5階）": "煌めく装飾品の図面（5階）",
  "盔甲圖紙（5階）": "鎧の図面（5階）",
  "靴子圖紙（6階）": "靴の図面（6階）",
  "燦爛的飾品碎片圖紙（6階）": "輝く装飾品の欠片図面（6階）",
  "物理武器圖紙（6階）": "物理武器の図面（6階）",
  "帽子圖紙（6階）": "帽子の図面（6階）",
  "魔法武器圖紙（6階）": "魔法武器の図面（6階）",
  "璀璨的飾品碎片圖紙（6階）": "煌めく装飾品の欠片図面（6階）",
  "盔甲圖紙（6階）": "鎧の図面（6階）",
  "靴子碎片（7階）": "靴の欠片（7階）",
  "燦爛的飾品碎片（7階）": "輝く装飾品の欠片（7階）",
  "物理武器碎片（7階）": "物理武器の欠片（7階）",
  "帽子碎片（7階）": "帽子の欠片（7階）",
  "魔法武器碎片（7階）": "魔法武器の欠片（7階）",
  "璀璨的飾品碎片（7階）": "煌めく装飾品の欠片（7階）",
  "盔甲碎片（7階）": "鎧の欠片（7階）",
  "靴子碎片（8階）": "靴の欠片（8階）",
  "燦爛的飾品碎片（8階）": "輝く装飾品の欠片（8階）",
  "物理武器碎片（8階）": "物理武器の欠片（8階）",
  "帽子碎片（8階）": "帽子の欠片（8階）",
  "魔法武器碎片（8階）": "魔法武器の欠片（8階）",
  "璀璨的飾品碎片（階）": "煌めく装飾品の欠片（8階）",
  "盔甲碎片（8階）": "鎧の欠片（8階）",
} as const;

type MaterialName = keyof typeof TOOLTIP_TRANSLATIONS;
type Rank8MaterialName =
  | "物理武器碎片（8階）"
  | "魔法武器碎片（8階）"
  | "盔甲碎片（8階）"
  | "帽子碎片（8階）"
  | "靴子碎片（8階）"
  | "璀璨的飾品碎片（階）"
  | "燦爛的飾品碎片（8階）";

const MATERIAL_REPLACEMENTS = {
  "物理武器碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/physical-weapons.png`,
  },
  "魔法武器碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/magical-weapon.png`,
  },
  "盔甲碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/armor.png`,
  },
  "帽子碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/hat.png`,
  },
  "靴子碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/boots.png`,
  },
  "璀璨的飾品碎片（階）": {
    imageUrl: `${IMAGE_BASE_URL}/glistening-decorations.png`,
  },
  "燦爛的飾品碎片（8階）": {
    imageUrl: `${IMAGE_BASE_URL}/glorious-decorations.png`,
  },
} satisfies Record<Rank8MaterialName, { imageUrl: string }>;

const materialNames = Object.keys(TOOLTIP_TRANSLATIONS) as MaterialName[];
const japaneseNameToMaterialName = new Map<string, MaterialName>(
  materialNames.map((materialName) => [
    TOOLTIP_TRANSLATIONS[materialName],
    materialName,
  ]),
);

let pendingAnimationFrame: number | null = null;
let settings = loadSettings();

function loadSettings(): FeatureSettings {
  return {
    replaceImages:
      getValue<boolean>(
        SETTINGS_KEYS.replaceImages,
        DEFAULT_SETTINGS.replaceImages,
      ) ?? DEFAULT_SETTINGS.replaceImages,
    replaceTooltips:
      getValue<boolean>(
        SETTINGS_KEYS.replaceTooltips,
        DEFAULT_SETTINGS.replaceTooltips,
      ) ?? DEFAULT_SETTINGS.replaceTooltips,
  };
}

function saveSetting(key: keyof FeatureSettings, value: boolean): void {
  const storageKey = SETTINGS_KEYS[key];
  setValue(storageKey, value);
  settings = {
    ...settings,
    [key]: value,
  };
}

function getMaterialName(value: string | null): MaterialName | null {
  if (!value) {
    return null;
  }

  if (Object.hasOwn(TOOLTIP_TRANSLATIONS, value)) {
    return value as MaterialName;
  }

  return japaneseNameToMaterialName.get(value) ?? null;
}

function getElementMaterialName(element: Element): MaterialName | null {
  const explicitName = getMaterialName(
    element.getAttribute(REPLACED_ATTRIBUTE),
  );
  if (explicitName) {
    return explicitName;
  }

  if (element instanceof HTMLElement) {
    const titleName = getMaterialName(element.title);
    if (titleName) {
      return titleName;
    }
  }

  if (element instanceof HTMLImageElement) {
    const altName = getMaterialName(element.alt);
    if (altName) {
      return altName;
    }
  }

  const trimmedText = element.textContent?.trim() ?? "";
  return getMaterialName(trimmedText);
}

function restoreVisibleImage(image: HTMLImageElement): void {
  image.style.removeProperty("display");
  image.style.removeProperty("opacity");
}

function toAbsoluteUrl(url: string): string {
  return new URL(url, window.location.origin).href;
}

function hidePlaceholder(image: HTMLImageElement): void {
  const placeholder = image.nextElementSibling;
  if (!(placeholder instanceof HTMLElement)) {
    return;
  }
  if (!placeholder.classList.contains("card-placeholder")) {
    return;
  }

  placeholder.style.display = "none";
}

function restorePlaceholder(image: HTMLImageElement): void {
  const placeholder = image.nextElementSibling;
  if (!(placeholder instanceof HTMLElement)) {
    return;
  }
  if (!placeholder.classList.contains("card-placeholder")) {
    return;
  }

  placeholder.style.removeProperty("display");
}

function getOriginalImageUrl(materialName: Rank8MaterialName): string {
  return `/assets/gears/${materialName}.webp`;
}

function hasImageReplacement(
  materialName: MaterialName,
): materialName is Rank8MaterialName {
  return Object.hasOwn(MATERIAL_REPLACEMENTS, materialName);
}

function replaceImage(
  image: HTMLImageElement,
  materialName: Rank8MaterialName,
  japaneseName: string,
): void {
  const replacement = MATERIAL_REPLACEMENTS[materialName];
  if (image.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    image.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (image.src !== toAbsoluteUrl(replacement.imageUrl)) {
    image.src = replacement.imageUrl;
  }
  const altText = settings.replaceTooltips ? japaneseName : materialName;
  if (image.alt !== altText) {
    image.alt = altText;
  }
  restoreVisibleImage(image);
  hidePlaceholder(image);
}

function restoreImage(
  image: HTMLImageElement,
  materialName: Rank8MaterialName,
): void {
  const imageUrl = getOriginalImageUrl(materialName);
  if (image.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    image.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (image.src !== toAbsoluteUrl(imageUrl)) {
    image.src = imageUrl;
  }
  if (image.alt !== materialName) {
    image.alt = materialName;
  }
  restoreVisibleImage(image);
  restorePlaceholder(image);
}

function replaceLabel(
  element: HTMLElement,
  materialName: MaterialName,
  japaneseName: string,
): void {
  if (element.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    element.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (element.title !== japaneseName) {
    element.title = japaneseName;
  }
}

function restoreLabel(element: HTMLElement, materialName: MaterialName): void {
  if (element.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    element.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (element.title !== materialName) {
    element.title = materialName;
  }
}

function replaceTooltip(
  element: Element,
  materialName: MaterialName,
  japaneseName: string,
): void {
  const tooltip = element.querySelector<HTMLElement>(".card-tooltip");
  if (!tooltip) {
    return;
  }

  if (tooltip.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    tooltip.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (tooltip.textContent !== japaneseName) {
    tooltip.textContent = japaneseName;
  }
}

function restoreTooltip(element: Element, materialName: MaterialName): void {
  const tooltip = element.querySelector<HTMLElement>(".card-tooltip");
  if (!tooltip) {
    return;
  }

  if (tooltip.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    tooltip.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (tooltip.textContent !== materialName) {
    tooltip.textContent = materialName;
  }
}

function enhanceMaterialElement(element: Element): void {
  const materialName = getElementMaterialName(element);
  if (!materialName) {
    return;
  }

  const japaneseName = TOOLTIP_TRANSLATIONS[materialName];
  if (element instanceof HTMLElement) {
    if (settings.replaceTooltips) {
      replaceLabel(element, materialName, japaneseName);
      replaceTooltip(element, materialName, japaneseName);
    } else {
      restoreLabel(element, materialName);
      restoreTooltip(element, materialName);
    }
  }

  if (!hasImageReplacement(materialName)) {
    return;
  }

  if (element instanceof HTMLImageElement) {
    if (settings.replaceImages) {
      replaceImage(element, materialName, japaneseName);
    } else {
      restoreImage(element, materialName);
    }
    return;
  }

  const image = element.querySelector<HTMLImageElement>("img");
  if (image) {
    if (settings.replaceImages) {
      replaceImage(image, materialName, japaneseName);
    } else {
      restoreImage(image, materialName);
    }
  }
}

function enhanceVisibleMaterials(): void {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement | HTMLImageElement>(
      `.material-card[title], .material-chip[title], .card-tooltip, img[alt], [${REPLACED_ATTRIBUTE}]`,
    ),
  );

  for (const candidate of candidates) {
    enhanceMaterialElement(candidate);
  }
}

function scheduleEnhancement(): void {
  if (pendingAnimationFrame !== null) {
    return;
  }

  pendingAnimationFrame = window.requestAnimationFrame(() => {
    pendingAnimationFrame = null;
    enhanceVisibleMaterials();
  });
}

function startObserver(): void {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["title", "alt", "src", "style"],
    childList: true,
    subtree: true,
  });
}

function registerSettingsMenu(): void {
  const replaceImagesState = settings.replaceImages
    ? t("stateOn")
    : t("stateOff");
  const replaceTooltipsState = settings.replaceTooltips
    ? t("stateOn")
    : t("stateOff");

  registerMenuCommand(
    format("replaceImagesMenu", {
      state: replaceImagesState,
    }),
    () => {
      saveSetting("replaceImages", !settings.replaceImages);
      enhanceVisibleMaterials();
      window.alert(
        format("replaceImagesChanged", {
          state: settings.replaceImages ? t("stateOn") : t("stateOff"),
        }),
      );
    },
  );

  registerMenuCommand(
    format("replaceTooltipsMenu", {
      state: replaceTooltipsState,
    }),
    () => {
      saveSetting("replaceTooltips", !settings.replaceTooltips);
      enhanceVisibleMaterials();
      window.alert(
        format("replaceTooltipsChanged", {
          state: settings.replaceTooltips ? t("stateOn") : t("stateOff"),
        }),
      );
    },
  );
}

function initialize(): void {
  registerSettingsMenu();
  enhanceVisibleMaterials();
  startObserver();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
