import type { YoutubeUiModifierSettingId } from "@/shared/types";

export const CSS_RULES: Partial<
  Record<YoutubeUiModifierSettingId, ReadonlyArray<string>>
> = {
  hideAds: [
    "#masthead-ad",
    "ytd-mealbar-promo-renderer",
    "ytd-carousel-ad-renderer",
    ".ytd-display-ad-renderer",
    "ytd-ad-slot-renderer",
    "ytd-action-companion-ad-renderer",
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    "ytm-companion-ad-renderer",
    "ytm-promoted-sparkles-web-renderer",
  ],
  hideAllShorts: [
    'a[title="Shorts"]',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    "ytd-reel-shelf-renderer",
    "grid-shelf-view-model.ytGridShelfViewModelHostHasBottomButton.ytd-item-section-renderer.ytGridShelfViewModelHost",
    '[data-youtube-ui-modifier-short="true"]',
    "ytm-reel-shelf-renderer",
  ],
  hideVideoThumbnails: [
    "ytd-thumbnail",
    "yt-thumbnail-view-model",
    "ytd-playlist-thumbnail",
  ],
  hidePlayables: ['[data-youtube-ui-modifier-playable="true"]'],
  disablePlayOnHover: [
    "#video-preview",
    "#mouseover-overlay",
    "ytd-thumbnail-overlay-loading-preview-renderer[is-preview-loading]",
  ],
  hideHomepageSuggestions: [
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
    'div[tab-identifier="FEwhat_to_watch"] .rich-grid-renderer-contents',
  ],
  hideHomepageHeader: [
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > div#header',
    'div[tab-identifier="FEwhat_to_watch"] div.chip-bar-contents',
  ],
  showOnlyFirstHomepageRow: [
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer[data-youtube-ui-modifier-hidden-home-row="true"]',
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-continuation-item-renderer',
  ],
  hideHomepageExtraRows: [
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer',
    'div[tab-identifier="FEwhat_to_watch"] ytm-reel-shelf-renderer',
  ],
  hideHomepageInfiniteScroll: [
    'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-continuation-item-renderer',
    "div.rich-grid-renderer-contents > ytm-continuation-item-renderer",
  ],
  hideWatchSidebar: [
    "#secondary > div.circle",
    "#related",
    'ytm-item-section-renderer[section-identifier="related-items"]',
  ],
  hideEntireWatchSidebar: ["#secondary"],
  hideSidebarInfiniteScroll: [
    "#secondary #contents ytd-continuation-item-renderer",
  ],
  hideExtraSidebarTags: [
    'yt-chip-cloud-chip-renderer[data-youtube-ui-modifier-hide-chip="true"]',
  ],
  hideEndScreen: [".html5-endscreen", ".ytp-fullscreen-grid-stills-container"],
  hideInfoCards: [".ytp-ce-element.ytp-ce-element"],
  hideOverlaySuggestions: [
    ".ytp-cards-teaser",
    "button.ytp-button.ytp-cards-button",
    "div.ytp-pause-overlay",
  ],
  hideNextButton: ["a.ytp-next-button"],
  hideVideoActions: [
    "#menu-container",
    "#actions",
    "ytm-slim-video-action-bar-renderer",
  ],
  hideClipButton: ['#menu button[data-youtube-ui-modifier-clip-button="true"]'],
  hideVideoLikes: [
    "like-button-view-model .yt-spec-button-shape-next__button-text-content",
  ],
  hideChannelSubscribers: ["#owner-sub-count"],
  hideVideoDescription: ["ytd-watch-metadata #description"],
  hideEmbeddedMoreVideos: ["div.ytp-pause-overlay"],
  hideLiveChat: ["#chat"],
  disableFullscreenScroll: ["ytd-watch-flexy[fullscreen] div#columns"],
  hideComments: [
    "#comments",
    "#comment-teaser",
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]',
    "ytm-comments-entry-point-header-renderer",
  ],
  hideNonTimestampComments: [
    'ytd-comment-thread-renderer:not([data-youtube-ui-modifier-timestamp-comment="true"])',
  ],
  hideCommentUsernames: ["#author-text"],
  hideCommentProfiles: ["#author-thumbnail"],
  hideCommentReplies: ["#replies.ytd-comment-thread-renderer"],
  hideCommentUpvotes: [
    "#vote-count-middle.ytd-comment-action-buttons-renderer",
  ],
  hideSearchSuggestions: [
    "div.sbdd_a",
    ".searchbox-dropdown",
    ".ytSearchboxComponentSuggestionsContainer",
  ],
  hideSearchShorts: [
    '#container.ytd-search [data-youtube-ui-modifier-short="true"]',
    "#container.ytd-search ytd-reel-shelf-renderer",
    "#container.ytd-search grid-shelf-view-model.ytGridShelfViewModelHostHasBottomButton.ytd-item-section-renderer.ytGridShelfViewModelHost",
    'ytm-search [data-youtube-ui-modifier-short="true"]',
    "ytm-search ytm-reel-shelf-renderer",
  ],
  hideSearchPromoted: ["#container.ytd-search ytd-search-pyv-renderer"],
  hideSearchDescriptions: [
    "#contents .metadata-snippet-container",
    "#contents .metadata-snippet-container-one-line",
    "#contents #description-text",
    "#contents #description",
    "#contents ytd-expandable-metadata-renderer",
  ],
  hideSearchExtraResults: ["#container.ytd-search ytd-shelf-renderer"],
  hideThumbnailHoverOverlay: ["#mouseover-overlay"],
  hideSearchInfiniteScroll: [
    ".ytd-search #contents > ytd-continuation-item-renderer",
  ],
  hideLeftNavigation: [
    "tp-yt-app-drawer#guide",
    'ytd-mini-guide-renderer[role="navigation"]',
    "yt-icon-button#guide-button",
  ],
  onlyShowPlaylists: [
    "ytd-guide-collapsible-section-entry-renderer #header",
    "#section-items > :nth-child(1)",
    "#section-items > :nth-child(2)",
    "#section-items > :nth-child(3)",
    "#section-items > :nth-child(4)",
    "ytd-guide-collapsible-entry-renderer #expanded > ytd-guide-entry-renderer",
  ],
  hideHomeLink: [
    'a:not(#logo)[href="/"]',
    "ytm-pivot-bar-item-renderer:nth-child(1)",
  ],
  hideExploreLink: [
    'a[href="/feed/trending"]',
    'a[href="/feed/explore"]',
    'ytm-chip-cloud-chip-renderer[chip-style="STYLE_EXPLORE_LAUNCHER_CHIP"]',
  ],
  hideShortsLink: [
    'a[title="Shorts"]',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    "ytm-pivot-bar-item-renderer:nth-child(2)",
  ],
  hideSubscriptionsLink: ['a[href="/feed/subscriptions"]'],
  hideSubscriptionsSection: [
    "ytd-guide-section-renderer.style-scope:nth-of-type(2)",
  ],
  hideQuickLinksSection: [
    "ytd-guide-section-renderer.style-scope:nth-of-type(3)",
  ],
  hideExploreSection: ["ytd-guide-section-renderer.style-scope:nth-of-type(4)"],
  hideMoreFromYoutubeSection: [
    "ytd-guide-section-renderer.style-scope:nth-of-type(5)",
  ],
  hideSettingsSection: [
    "ytd-guide-section-renderer.style-scope:nth-of-type(6)",
  ],
  hideFooterSection: ["#guide-renderer > div#footer"],
  hideChannelForYou: ['[data-youtube-ui-modifier-channel-for-you="true"]'],
  hideSubscriptionShorts: [
    'ytd-grid-video-renderer[data-youtube-ui-modifier-subscription-short="true"]',
    'ytd-rich-item-renderer[data-youtube-ui-modifier-subscription-short="true"]',
  ],
  hideSubscriptionMostRelevant: [
    'ytd-rich-section-renderer[data-youtube-ui-modifier-most-relevant="true"]',
  ],
  hideSubscriptionLive: [
    'ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="live"]',
    'ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="live"]',
  ],
  hideSubscriptionUpcoming: [
    'ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="upcoming"]',
    'ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="upcoming"]',
  ],
  hideSubscriptionPremiere: [
    'ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="premiere"]',
    'ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="premiere"]',
  ],
  hideSubscriptionVods: [
    'ytd-grid-video-renderer[data-youtube-ui-modifier-vod="true"]',
    'ytd-rich-item-renderer[data-youtube-ui-modifier-vod="true"]',
  ],
  hideNotificationBell: ["ytd-notification-topbar-button-renderer"],
  hidePlaylistSuggestions: [
    'ytd-item-section-renderer[data-youtube-ui-modifier-playlist-suggestions="true"]',
  ],
  hideContextBoxes: ["ytd-info-panel-container-renderer"],
  hideCreateButton: [
    'ytd-masthead ytd-button-renderer:has(button[aria-label="作成"])',
    'ytd-masthead ytd-button-renderer:has(button[aria-label="Create"])',
    'ytd-masthead ytd-button-renderer:has(button[aria-label="만들기"])',
  ],
};

export const BLUR_THUMBNAIL_SELECTORS = [
  "ytd-thumbnail img",
  "ytd-playlist-thumbnail img",
  "yt-thumbnail-view-model img",
  ".video-thumbnail-img",
] as const;

export const CENTER_WATCH_PAGE_CSS = `
ytd-watch-flexy[flexy][is-two-columns_]:not([fullscreen]):not([theater]) {
  --ytd-watch-flexy-max-player-width: calc(var(--ytd-watch-flexy-chat-max-height) * var(--ytd-watch-flexy-width-ratio) / var(--ytd-watch-flexy-height-ratio)) !important;
}

#columns {
  justify-content: center !important;
}
`.trim();

export const SHRINK_THUMBNAIL_CSS = `
ytd-thumbnail,
ytd-rich-item-renderer yt-thumbnail-view-model,
ytd-playlist-thumbnail,
*:has(> yt-collection-thumbnail-view-model),
ytd-channel-renderer #avatar-section,
ytd-movie-renderer .thumbnail-container {
  max-width: 240px !important;
  min-width: 210px !important;
  max-height: 134px !important;
}
`.trim();

export const DISABLE_LOGO_LINK_CSS = `
#logo[href="/"] {
  pointer-events: none !important;
}
`.trim();

export const REVERSE_CHANNEL_VIDEOS_CSS = `
ytd-browse[page-subtype="channels"] #contents.ytd-rich-grid-renderer {
  flex-direction: column-reverse !important;
}
`.trim();

export const RESET_LEFT_NAV_MARGIN_CSS = `
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app,
ytd-app[mini-guide-visible] ytd-page-manager.ytd-app,
ytd-playlist-sidebar-renderer,
ytd-playlist-header-renderer {
  margin-left: 0 !important;
  left: 0 !important;
}
`.trim();

export const SEARCH_ENGINE_MODE_CSS = `
ytd-app *,
ytm-app * {
  visibility: hidden;
}

#container.ytd-masthead,
ytd-topbar-logo-renderer,
ytd-topbar-logo-renderer *,
#center.ytd-masthead,
#center.ytd-masthead *,
ytd-topbar-menu-button-renderer,
ytd-topbar-menu-button-renderer *,
ytd-popup-container,
ytd-popup-container *,
ytd-search,
ytd-search *,
ytd-watch-flexy,
ytd-watch-flexy * {
  visibility: visible !important;
}

ytd-browse,
ytd-channel-renderer,
ytd-thumbnail,
.ytp-ce-element.ytp-ce-element,
#secondary,
#top-row,
ytd-merch-shelf-renderer,
#comments {
  display: none !important;
}

ytd-search {
  position: absolute !important;
  left: 0 !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

ytd-video-renderer {
  margin-top: 35px !important;
}

#container.ytd-masthead {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--yt-spec-base-background) !important;
}
`.trim();
