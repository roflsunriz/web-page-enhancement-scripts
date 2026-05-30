import {
  getValue,
  registerMenuCommand,
  setValue,
} from '@/shared/userscript';

type Rank8MaterialName =
  | '物理武器碎片（8階）'
  | '魔法武器碎片（8階）'
  | '盔甲碎片（8階）'
  | '帽子碎片（8階）'
  | '靴子碎片（8階）'
  | '璀璨的飾品碎片（階）'
  | '燦爛的飾品碎片（8階）';

type MaterialReplacement = {
  imageUrl: string;
  japaneseName: string;
};

type FeatureSettings = {
  replaceImages: boolean;
  replaceTooltips: boolean;
};

const SCRIPT_ID = 'trickcal-tool-sweep';
const REPLACED_ATTRIBUTE = `data-${SCRIPT_ID}-material`;
const SETTINGS_KEYS = {
  replaceImages: `${SCRIPT_ID}.replace-images`,
  replaceTooltips: `${SCRIPT_ID}.replace-tooltips`,
} as const;
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/images';
const DEFAULT_SETTINGS: FeatureSettings = {
  replaceImages: true,
  replaceTooltips: true,
};

const MATERIAL_REPLACEMENTS = {
  '物理武器碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/physical-weapons.png`,
    japaneseName: '物理武器の欠片（8階）',
  },
  '魔法武器碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/magical-weapon.png`,
    japaneseName: '魔法武器の欠片（8階）',
  },
  '盔甲碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/armor.png`,
    japaneseName: '鎧の欠片（8階）',
  },
  '帽子碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/hat.png`,
    japaneseName: '帽子の欠片（8階）',
  },
  '靴子碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/boots.png`,
    japaneseName: '靴の欠片（8階）',
  },
  '璀璨的飾品碎片（階）': {
    imageUrl: `${IMAGE_BASE_URL}/glistening-decorations.png`,
    japaneseName: '煌めく装飾品の欠片（8階）',
  },
  '燦爛的飾品碎片（8階）': {
    imageUrl: `${IMAGE_BASE_URL}/glorious-decorations.png`,
    japaneseName: '輝く装飾品の欠片（8階）',
  },
} satisfies Record<Rank8MaterialName, MaterialReplacement>;

const materialNames = Object.keys(MATERIAL_REPLACEMENTS) as Rank8MaterialName[];
const japaneseNameToMaterialName = new Map(
  materialNames.map((materialName) => [
    MATERIAL_REPLACEMENTS[materialName].japaneseName,
    materialName,
  ]),
);

let pendingAnimationFrame: number | null = null;
let settings = loadSettings();

function loadSettings(): FeatureSettings {
  return {
    replaceImages: getValue<boolean>(SETTINGS_KEYS.replaceImages, DEFAULT_SETTINGS.replaceImages)
      ?? DEFAULT_SETTINGS.replaceImages,
    replaceTooltips: getValue<boolean>(SETTINGS_KEYS.replaceTooltips, DEFAULT_SETTINGS.replaceTooltips)
      ?? DEFAULT_SETTINGS.replaceTooltips,
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

function getMaterialName(value: string | null): Rank8MaterialName | null {
  if (!value) {
    return null;
  }

  if (Object.hasOwn(MATERIAL_REPLACEMENTS, value)) {
    return value as Rank8MaterialName;
  }

  return japaneseNameToMaterialName.get(value) ?? null;
}

function getElementMaterialName(element: Element): Rank8MaterialName | null {
  const explicitName = getMaterialName(element.getAttribute(REPLACED_ATTRIBUTE));
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

  const trimmedText = element.textContent?.trim() ?? '';
  return getMaterialName(trimmedText);
}

function restoreVisibleImage(image: HTMLImageElement): void {
  image.style.removeProperty('display');
  image.style.removeProperty('opacity');
}

function toAbsoluteUrl(url: string): string {
  return new URL(url, window.location.origin).href;
}

function hidePlaceholder(image: HTMLImageElement): void {
  const placeholder = image.nextElementSibling;
  if (!(placeholder instanceof HTMLElement)) {
    return;
  }
  if (!placeholder.classList.contains('card-placeholder')) {
    return;
  }

  placeholder.style.display = 'none';
}

function restorePlaceholder(image: HTMLImageElement): void {
  const placeholder = image.nextElementSibling;
  if (!(placeholder instanceof HTMLElement)) {
    return;
  }
  if (!placeholder.classList.contains('card-placeholder')) {
    return;
  }

  placeholder.style.removeProperty('display');
}

function getOriginalImageUrl(materialName: Rank8MaterialName): string {
  return `/assets/gears/${materialName}.webp`;
}

function replaceImage(image: HTMLImageElement, materialName: Rank8MaterialName, replacement: MaterialReplacement): void {
  if (image.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    image.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (image.src !== toAbsoluteUrl(replacement.imageUrl)) {
    image.src = replacement.imageUrl;
  }
  const altText = settings.replaceTooltips ? replacement.japaneseName : materialName;
  if (image.alt !== altText) {
    image.alt = altText;
  }
  restoreVisibleImage(image);
  hidePlaceholder(image);
}

function restoreImage(image: HTMLImageElement, materialName: Rank8MaterialName): void {
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

function replaceLabel(element: HTMLElement, materialName: Rank8MaterialName, replacement: MaterialReplacement): void {
  if (element.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    element.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (element.title !== replacement.japaneseName) {
    element.title = replacement.japaneseName;
  }
}

function restoreLabel(element: HTMLElement, materialName: Rank8MaterialName): void {
  if (element.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    element.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (element.title !== materialName) {
    element.title = materialName;
  }
}

function replaceTooltip(element: Element, materialName: Rank8MaterialName, replacement: MaterialReplacement): void {
  const tooltip = element.querySelector<HTMLElement>('.card-tooltip');
  if (!tooltip) {
    return;
  }

  if (tooltip.getAttribute(REPLACED_ATTRIBUTE) !== materialName) {
    tooltip.setAttribute(REPLACED_ATTRIBUTE, materialName);
  }
  if (tooltip.textContent !== replacement.japaneseName) {
    tooltip.textContent = replacement.japaneseName;
  }
}

function restoreTooltip(element: Element, materialName: Rank8MaterialName): void {
  const tooltip = element.querySelector<HTMLElement>('.card-tooltip');
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

  const replacement = MATERIAL_REPLACEMENTS[materialName];
  if (element instanceof HTMLElement) {
    if (settings.replaceTooltips) {
      replaceLabel(element, materialName, replacement);
      replaceTooltip(element, materialName, replacement);
    } else {
      restoreLabel(element, materialName);
      restoreTooltip(element, materialName);
    }
  }

  if (element instanceof HTMLImageElement) {
    if (settings.replaceImages) {
      replaceImage(element, materialName, replacement);
    } else {
      restoreImage(element, materialName);
    }
    return;
  }

  const image = element.querySelector<HTMLImageElement>('img');
  if (image) {
    if (settings.replaceImages) {
      replaceImage(image, materialName, replacement);
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
    attributeFilter: ['title', 'alt', 'src', 'style'],
    childList: true,
    subtree: true,
  });
}

function registerSettingsMenu(): void {
  registerMenuCommand(
    `画像差し替え: ${settings.replaceImages ? 'ON' : 'OFF'}`,
    () => {
      saveSetting('replaceImages', !settings.replaceImages);
      enhanceVisibleMaterials();
      window.alert(`画像差し替えを${settings.replaceImages ? 'ON' : 'OFF'}にしました。メニュー表示はページ再読み込み後に更新されます。`);
    },
  );

  registerMenuCommand(
    `ツールチップ置き換え: ${settings.replaceTooltips ? 'ON' : 'OFF'}`,
    () => {
      saveSetting('replaceTooltips', !settings.replaceTooltips);
      enhanceVisibleMaterials();
      window.alert(`ツールチップ置き換えを${settings.replaceTooltips ? 'ON' : 'OFF'}にしました。メニュー表示はページ再読み込み後に更新されます。`);
    },
  );
}

function initialize(): void {
  registerSettingsMenu();
  enhanceVisibleMaterials();
  startObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
