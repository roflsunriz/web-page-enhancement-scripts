import { MuteSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';
import { updateMuteRegexes } from './filter';

const logger = createLogger('twitter-mute-filter');

const SETTINGS_KEY = 'twitter_filter_settings';

export const defaultSettings: MuteSettings = {
  version: 1.3,
  stringKeywords: [],
  regexKeywords: [],
  lastImport: null,
  enabled: true,
  debugMode: false,
};

export let settings: MuteSettings = { ...defaultSettings, ...GM_getValue<Partial<MuteSettings>>(SETTINGS_KEY, {}) };

export function saveSettings(): void {
  GM_setValue(SETTINGS_KEY, settings);
  updateMuteRegexes();
  logger.info('設定を保存しました: ', settings);
}

export function updateSettings(newSettings: Partial<MuteSettings>): void {
  settings = { ...settings, ...newSettings };
  saveSettings();
}

/**
 * 古いバージョンの設定をマイグレーションします。
 */
export function migrateSettings(): void {
  if (!('enabled' in settings) || !('debugMode' in settings)) {
    // settingsの型安全性を保ちつつ、enabled/debugModeの有無を考慮してマージ
    const partialSettings = GM_getValue<Partial<MuteSettings>>(SETTINGS_KEY, {});
    settings = {
      ...defaultSettings,
      ...partialSettings,
      enabled:
        Object.prototype.hasOwnProperty.call(partialSettings, 'enabled') &&
        typeof partialSettings.enabled === 'boolean'
          ? partialSettings.enabled
          : true,
      debugMode:
        Object.prototype.hasOwnProperty.call(partialSettings, 'debugMode') &&
        typeof partialSettings.debugMode === 'boolean'
          ? partialSettings.debugMode
          : false,
    };
    saveSettings();
    logger.info('設定を新しいバージョンにマイグレーションしました。');
  }
}