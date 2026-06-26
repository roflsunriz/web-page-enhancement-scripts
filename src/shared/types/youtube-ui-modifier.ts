export type YoutubeUiModifierSettingId =
  | 'globalEnabled'
  | 'hideAds'
  | 'hideAllShorts'
  | 'hideVideoThumbnails'
  | 'blurVideoThumbnails'
  | 'shrinkVideoThumbnails'
  | 'disablePlayOnHover'
  | 'searchEngineMode'
  | 'scheduleEnabled'
  | 'hideHomepageSuggestions'
  | 'showHomepageRevealBox'
  | 'hideHomepageHeader'
  | 'showOnlyFirstHomepageRow'
  | 'hideHomepageExtraRows'
  | 'hideHomepageInfiniteScroll'
  | 'hidePlayables'
  | 'hideWatchSidebar'
  | 'showSidebarRevealBox'
  | 'hideEntireWatchSidebar'
  | 'hideSidebarInfiniteScroll'
  | 'hideExtraSidebarTags'
  | 'hideEndScreen'
  | 'showEndScreenRevealBox'
  | 'hideInfoCards'
  | 'hideOverlaySuggestions'
  | 'hideNextButton'
  | 'hideVideoActions'
  | 'hideClipButton'
  | 'hideVideoLikes'
  | 'hideChannelSubscribers'
  | 'hideVideoDescription'
  | 'hideEmbeddedMoreVideos'
  | 'hideLiveChat'
  | 'autoSkipAds'
  | 'disableAutoplay'
  | 'disableAmbientMode'
  | 'disableAnnotations'
  | 'expandDescription'
  | 'disableFullscreenScroll'
  | 'normalizeShorts'
  | 'enableTheaterMode'
  | 'hideComments'
  | 'hideNonTimestampComments'
  | 'hideCommentUsernames'
  | 'hideCommentProfiles'
  | 'hideCommentReplies'
  | 'hideCommentUpvotes'
  | 'hideSearchSuggestions'
  | 'hideSearchShorts'
  | 'hideSearchPromoted'
  | 'hideSearchDescriptions'
  | 'hideSearchExtraResults'
  | 'hideThumbnailHoverOverlay'
  | 'hideSearchInfiniteScroll'
  | 'hideLeftNavigation'
  | 'onlyShowPlaylists'
  | 'disableLogoLink'
  | 'hideHomeLink'
  | 'hideExploreLink'
  | 'hideShortsLink'
  | 'hideSubscriptionsLink'
  | 'hideSubscriptionsSection'
  | 'hideQuickLinksSection'
  | 'hideExploreSection'
  | 'hideMoreFromYoutubeSection'
  | 'hideSettingsSection'
  | 'hideFooterSection'
  | 'hideChannelAutoplay'
  | 'hideChannelForYou'
  | 'reverseChannelVideos'
  | 'hideSubscriptionShorts'
  | 'hideSubscriptionMostRelevant'
  | 'hideSubscriptionLive'
  | 'hideSubscriptionUpcoming'
  | 'hideSubscriptionPremiere'
  | 'hideSubscriptionVods'
  | 'redirectHomeToSubscriptions'
  | 'redirectHomeToWatchLater'
  | 'redirectHomeToLibrary'
  | 'hideNotificationBell'
  | 'hidePlaylistSuggestions'
  | 'autofocusSearch'
  | 'hideContextBoxes'
  | 'hideCreateButton'
  | 'lockSettingsWithTimer'
  | 'lockSettingsWithCode'
  | 'grayscaleMode';

export type YoutubeUiModifierSettings = Record<YoutubeUiModifierSettingId, boolean>;

export type YoutubeUiModifierOptionDefinition = {
  id: YoutubeUiModifierSettingId;
  label: string;
  description: string;
};

export type YoutubeUiModifierCategoryDefinition = {
  id: string;
  label: string;
  options: ReadonlyArray<YoutubeUiModifierOptionDefinition>;
};

export type YoutubeUiModifierSettingsChangeHandler = (
  id: YoutubeUiModifierSettingId,
  value: boolean
) => void;
