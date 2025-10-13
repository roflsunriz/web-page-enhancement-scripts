export const MANGA_NAVIGATION_SELECTORS = {
  defaultPrev: ['.nav-button.prev', '.rd_sd-button_item.rd_top-left'],
  defaultNext: ['.nav-button.next', '.rd_sd-button_item.rd_top-right'],
  nicoPrevPriority: [
    'a[rel="prev"]',
    'link[rel="prev"]',
    '.pager__item--prev a',
    'a.pager-prev',
    'a[aria-label="前へ"]',
  ],
  nicoNextPriority: [
    'a[rel="next"]',
    'link[rel="next"]',
    '.pager__item--next a',
    'a.pager-next',
    'a[aria-label="次へ"]',
  ],
} as const;
