import { RetweetMuteSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-mute-retweets');
const SETTINGS_KEY = 'tmf_retweet_settings';

export const defaultSettings: RetweetMuteSettings = {
  enabled: true,
  checkInterval: 300,
};

export let settings: RetweetMuteSettings = { ...defaultSettings, ...GM_getValue<Partial<RetweetMuteSettings>>(SETTINGS_KEY, {}) };

export function saveSettings(): void {
  GM_setValue(SETTINGS_KEY, settings);
  logger.info('設定を保存しました:', settings);
}

export function updateSettings(newSettings: Partial<RetweetMuteSettings>): void {
  settings = { ...settings, ...newSettings };
  saveSettings();
}