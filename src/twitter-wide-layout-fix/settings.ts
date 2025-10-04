import { TwitterWideLayoutSettings } from '@/shared/types';
import { createLogger } from '@/shared/logger';

const logger = createLogger('twitter-wide-layout-fix');

const STORAGE_KEYS = {
  css: 'twitterWideLayoutFix_css',
  xpath: 'twitterWideLayoutFix_xpath',
  width: 'twitterWideLayoutFix_width',
};

export const DEFAULT_SETTINGS: TwitterWideLayoutSettings = {
  css: ['.r-1ye8kvj {', '    max-width: {{WIDTH}} !important;', '}'].join('\n'),
  xpath: '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]',
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