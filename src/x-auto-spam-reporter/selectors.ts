/**
 * X/Twitter Auto Spam Reporter - セレクタ定義
 */

export const SELECTORS = {
  tweet: 'article[data-testid="tweet"]',
  moreButton: '[data-testid="caret"]',
  reportMenuItem: '[data-testid="report"]',
  blockMenuItem: '[data-testid="block"]',
  menu: '[role="menu"]',
  menuItem: '[role="menuitem"]',
  dialog: '[role="dialog"]',
  nextButton: '[data-testid="ocfSettingsListNextButton"]',
  layersContainer: '#layers',
  primaryColumn: '[data-testid="primaryColumn"]',
  userName: '[data-testid="User-Name"]',
} as const;

export const SPAM_KEYWORDS = {
  ja: ['スパム'],
  en: ['spam', 'Spam'],
} as const;

export const BLOCK_KEYWORDS = {
  ja: ['さんをブロック'],
  en: ['Block @'],
} as const;

export const NEXT_KEYWORDS = {
  ja: ['次へ'],
  en: ['Next'],
} as const;

export const DONE_KEYWORDS = {
  ja: ['完了'],
  en: ['Done'],
} as const;

