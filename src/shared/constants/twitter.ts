export const TWITTER_SELECTORS = {
  article: 'article[data-testid="tweet"]',
  statusLink: 'a[href*="/status/"]',
  tweetText: 'div[data-testid="tweetText"]',
  tweetPhoto: 'div[data-testid="tweetPhoto"]',
  tweetVideo: 'div[data-testid="videoPlayer"]',
  mediaCardSmall: 'div[data-testid="card.layoutSmall.media"]',
  mediaCardLarge: 'div[data-testid="card.layoutLarge.media"]',
  userName: 'div[data-testid="User-Name"]',
  userNameLinkSpan: 'div[data-testid="User-Name"] a[role="link"] span',
  quotedLink: '[data-testid="tweetQuotedLink"]',
  tweetButtonsWithinArticle: '[data-testid="tweet"] [role="button"]',
  tweetContainerCandidates:
    '[data-testid="cellInnerDiv"], [data-testid="tweet"], article',
  tweetObserverTargets: '[data-testid="tweet"], [id^=id__], article[role="article"]',
  tweetCandidates: '[data-testid="tweet"], [id^=id__]',
  tweetRoot: '[data-testid="tweet"]',
  retweetIndicator: '.r-15zivkp',
  timelineMain: 'main[role="main"]',
  muteKeywordSpan: "div[role='link'] > div > div[dir='ltr']:first-child > span",
  userLink: 'a[role="link"][href^="/"]',
  quotedAuthor: 'div[dir="ltr"] > span',
  quotedHandle: 'div[dir="ltr"] span:nth-child(2)',
  roleLink: 'div[role="link"]',
  roleGroup: '[role="group"]',
  tweetMediaImage: 'img[src*="pbs.twimg.com/media"]',
  tweetMediaImageAlt: 'img[src*="ton.twimg.com/media"]',
} as const;

export const TWITTER_MEDIA_CARD_SELECTORS = [
  TWITTER_SELECTORS.tweetPhoto,
  TWITTER_SELECTORS.tweetVideo,
  TWITTER_SELECTORS.mediaCardSmall,
  TWITTER_SELECTORS.mediaCardLarge,
] as const;

export const TWITTER_IMAGE_SOURCE_SELECTOR = [
  TWITTER_SELECTORS.tweetMediaImage,
  TWITTER_SELECTORS.tweetMediaImageAlt,
].join(', ');

export const TWITTER_LAYOUT_DEFAULTS = {
  wideLayoutClass: '.r-1ye8kvj',
  wideLayoutXPath:
    '/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[5]',
} as const;
