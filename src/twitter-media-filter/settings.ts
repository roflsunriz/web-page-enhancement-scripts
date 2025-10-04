import { TwitterMediaSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-media-filter');

const SETTINGS_KEY = 'tmf_settings';

export const defaultSettings: TwitterMediaSettings = {
  enableOnTimeline: false,
  enableOnLists: false,
  enableOnProfile: false,
  enableOnSearch: false,
  enableOnTweetDetail: false,
  debugMode: false,
};

export let settings: TwitterMediaSettings = { ...defaultSettings, ...GM_getValue<Partial<TwitterMediaSettings>>(SETTINGS_KEY, {}) };

export function saveSettings(): void {
  GM_setValue(SETTINGS_KEY, settings);
  logger.info('設定を保存しました: ', settings);
}

export function updateSettings(newSettings: Partial<TwitterMediaSettings>): void {
  settings = { ...settings, ...newSettings };
  saveSettings();
}