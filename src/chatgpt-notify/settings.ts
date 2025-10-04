import { Settings } from "@/shared/types";

const SETTINGS_KEY = "settings";

// デフォルト設定
export const DEFAULT_SETTINGS: Readonly<Settings> = {
  showNotification: true,
  playSound: false,
  soundVolume: 0.5,
  customSoundUrl: "",
};

// 設定の読み込み
export function loadSettings(): Settings {
  const savedSettings = GM_getValue(SETTINGS_KEY, {});
  return { ...DEFAULT_SETTINGS, ...savedSettings };
}

// 設定の保存
export const saveSettings = (settings: Settings): void => {
  GM_setValue(SETTINGS_KEY, settings);
};