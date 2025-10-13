import { TwitterWideLayoutSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';
import { TWITTER_LAYOUT_DEFAULTS } from '@/shared/constants/twitter';

const logger = createLogger('twitter-wide-layout-fix');

const STORAGE_KEYS = {
  css: 'twitterWideLayoutFix_css',
  xpath: 'twitterWideLayoutFix_xpath',
  width: 'twitterWideLayoutFix_width',
};

export const DEFAULT_SETTINGS: TwitterWideLayoutSettings = {
  css: [
    `${TWITTER_LAYOUT_DEFAULTS.wideLayoutClass} {`,
    '    max-width: {{WIDTH}} !important;',
    '}',
  ].join('\n'),
  xpath: TWITTER_LAYOUT_DEFAULTS.wideLayoutXPath,
  width: '900',
};

export let settings: TwitterWideLayoutSettings = {
  css: GM_getValue(STORAGE_KEYS.css, DEFAULT_SETTINGS.css),
  xpath: GM_getValue(STORAGE_KEYS.xpath, DEFAULT_SETTINGS.xpath),
  width: GM_getValue(STORAGE_KEYS.width, DEFAULT_SETTINGS.width),
};

export function updateSettings(newSettings: Partial<TwitterWideLayoutSettings>): void {
  settings = { ...settings, ...newSettings };
  GM_setValue(STORAGE_KEYS.css, settings.css);
  GM_setValue(STORAGE_KEYS.xpath, settings.xpath);
  GM_setValue(STORAGE_KEYS.width, settings.width);
  logger.info('Settings saved:', settings);
}
