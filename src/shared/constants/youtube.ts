export const YOUTUBE_SELECTORS = {
  descriptionCandidates: [
    '#description',
    'ytd-expander#description',
    '#meta-contents #description',
    '#meta-contents',
  ],
  inlineExpander: 'ytd-text-inline-expander',
  inlineExpanderById: 'ytd-text-inline-expander#description-inline-expander',
  interactiveElements: 'tp-yt-paper-button, button, a',
  titleCandidates: [
    'h1.ytd-watch-metadata yt-formatted-string',
    '#title h1 yt-formatted-string',
    'h1.title',
  ],
  channelCandidates: [
    '#owner #channel-name a',
    'ytd-channel-name a',
    '.ytd-video-owner-renderer a',
    '#upload-info #channel-name a',
    '#owner-text a',
  ],
  descriptionRoot: '#description-inline-expander',
  descriptionExpandedContent: [
    '#description-inline-expander #expanded yt-attributed-string',
    '#description-inline-expander #expanded yt-formatted-string',
    '#description-inline-expander #snippet yt-attributed-string',
  ],
} as const;
