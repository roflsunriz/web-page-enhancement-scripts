/**
 * twitter-clean-timeline - 設定管理
 */

import { CleanTimelineSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-clean-timeline');

const SETTINGS_KEY = 'twitter_clean_timeline_settings';

export const defaultSettings: CleanTimelineSettings = {
  showPlaceholder: false,
  debugMode: false,

  mediaFilter: {
    enabled: false,
    enableOnTimeline: false,
    enableOnLists: false,
    enableOnProfile: false,
    enableOnSearch: false,
    enableOnTweetDetail: false,
  },

  muteFilter: {
    enabled: false,
    stringKeywords: [],
    regexKeywords: [],
  },

  retweetFilter: {
    enabled: false,
  },

  replaceFilter: {
    enabled: false,
    replacements: [],
  },
};

export let settings: CleanTimelineSettings = {
  ...defaultSettings,
  ...GM_getValue<Partial<CleanTimelineSettings>>(SETTINGS_KEY, {}),
};

export function saveSettings(): void {
  GM_setValue(SETTINGS_KEY, settings);
  logger.info('設定を保存しました', settings);
}

export function updateSettings(newSettings: Partial<CleanTimelineSettings>): void {
  settings = { ...settings, ...newSettings };
  saveSettings();
}

export function resetSettings(): void {
  settings = { ...defaultSettings };
  saveSettings();
}

