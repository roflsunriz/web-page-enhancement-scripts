import { createI18n, type LocaleCode } from "@/shared/i18n";
import type { YoutubeUiModifierSettingId } from "@/shared/types";

type YoutubeUiModifierLocale = Extract<LocaleCode, "ja" | "en">;

type TranslationKey =
  | "activeSettings"
  | "close"
  | "dismissReveal"
  | "enabledCount"
  | "globalDisabled"
  | "menuOpenSettings"
  | "menuToggleEnabled"
  | "noActiveSettings"
  | "resetConfirm"
  | "resetSettings"
  | "revealRecommendations"
  | "settingsCodePrompt"
  | "settingsSubtitle"
  | "settingsTitle";

const translations = {
  ja: {
    activeSettings: "有効中",
    close: "閉じる",
    dismissReveal: "今後表示しない",
    enabledCount: "有効な項目: {count}",
    globalDisabled: "全体設定: 無効",
    menuOpenSettings: "YouTube UI Modifier 設定を開く",
    menuToggleEnabled: "YouTube UI Modifier 有効/無効",
    noActiveSettings: "現在オンになっている設定はありません。",
    resetConfirm: "YouTube UI Modifierの設定を初期化しますか？",
    resetSettings: "初期設定に戻す",
    revealRecommendations: "おすすめを表示する",
    settingsCodePrompt: "YouTube UI Modifierの設定コードを入力してください",
    settingsSubtitle:
      "YouTube UI 表示調整パネル - リアルタイムで設定反映・自動設定保存",
    settingsTitle: "YouTube UI Modifier",
  },
  en: {
    activeSettings: "Active",
    close: "Close",
    dismissReveal: "Do not show again",
    enabledCount: "Active items: {count}",
    globalDisabled: "Global setting: disabled",
    menuOpenSettings: "Open YouTube UI Modifier settings",
    menuToggleEnabled: "Toggle YouTube UI Modifier",
    noActiveSettings: "No settings are currently on.",
    resetConfirm: "Reset YouTube UI Modifier settings?",
    resetSettings: "Restore defaults",
    revealRecommendations: "Show recommendations",
    settingsCodePrompt: "Enter the YouTube UI Modifier settings code",
    settingsSubtitle:
      "YouTube UI display adjustment panel - real-time changes and automatic saving",
    settingsTitle: "YouTube UI Modifier",
  },
} satisfies Record<YoutubeUiModifierLocale, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, YoutubeUiModifierLocale>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;

const categoryLabels: Partial<Record<YoutubeUiModifierLocale, Record<string, string>>> = {
  en: {
    channel: "Channel",
    comments: "Comments",
    general: "General",
    homepage: "Home",
    navigation: "Left navigation",
    other: "Other",
    redirects: "Redirects",
    search: "Search",
    subscriptions: "Subscriptions",
    watch: "Watch page",
  },
};

const optionLabels: Partial<
  Record<YoutubeUiModifierLocale, Record<YoutubeUiModifierSettingId, string>>
> = {
  en: {
    autofocusSearch: "Auto-focus search box",
    autoSkipAds: "Skip and close ads",
    blurVideoThumbnails: "Blur thumbnails",
    disableAmbientMode: "Disable ambient mode",
    disableAnnotations: "Disable annotations",
    disableAutoplay: "Disable autoplay",
    disableFullscreenScroll: "Stop scrolling in fullscreen",
    disableLogoLink: "Disable YouTube logo link",
    disablePlayOnHover: "Hide hover playback preview",
    enableTheaterMode: "Enable theater mode",
    expandDescription: "Auto-expand description",
    globalEnabled: "Enable YouTube UI Modifier",
    grayscaleMode: "Grayscale display",
    hideAds: "Hide ad slots",
    hideAllShorts: "Hide Shorts",
    hideChannelAutoplay: "Stop channel video autoplay",
    hideChannelForYou: "Hide For You section",
    hideChannelSubscribers: "Hide subscriber count",
    hideClipButton: "Hide Clip button",
    hideCommentProfiles: "Hide comment author icons",
    hideCommentReplies: "Hide replies",
    hideCommentUpvotes: "Hide comment like counts",
    hideCommentUsernames: "Hide comment author names",
    hideComments: "Hide comments",
    hideContextBoxes: "Hide context boxes",
    hideCreateButton: "Hide Create button",
    hideEmbeddedMoreVideos: "Hide embedded player suggestions",
    hideEndScreen: "Hide end screen recommendations",
    hideEntireWatchSidebar: "Hide the whole sidebar area",
    hideExploreLink: "Hide Explore links",
    hideExploreSection: "Hide Explore section",
    hideExtraSidebarTags: "Limit related-video tags",
    hideFooterSection: "Hide left-nav footer",
    hideHomeLink: "Hide Home link",
    hideHomepageExtraRows: "Hide extra Home shelves",
    hideHomepageHeader: "Hide Home chip bar",
    hideHomepageInfiniteScroll: "Stop Home infinite scroll",
    hideHomepageSuggestions: "Hide Home recommendations",
    hideInfoCards: "Hide info cards",
    hideLeftNavigation: "Hide all left navigation",
    hideLiveChat: "Hide live chat",
    hideMoreFromYoutubeSection: "Hide other YouTube sections",
    hideNextButton: "Hide Next button",
    hideNonTimestampComments: "Hide comments without timestamp links",
    hideNotificationBell: "Hide notification bell",
    hideOverlaySuggestions: "Hide overlay suggestions",
    hidePlayables: "Hide Playables",
    hidePlaylistSuggestions: "Hide playlist suggestions",
    hideQuickLinksSection: "Hide You/Library sections",
    hideSearchDescriptions: "Hide search result descriptions",
    hideSearchExtraResults: "Hide extra search shelves",
    hideSearchInfiniteScroll: "Stop search infinite scroll",
    hideSearchPromoted: "Hide search ads",
    hideSearchShorts: "Hide Shorts in search results",
    hideSearchSuggestions: "Hide search suggestions",
    hideSettingsSection: "Hide settings section",
    hideShortsLink: "Hide Shorts links",
    hideSidebarInfiniteScroll: "Stop related-video infinite scroll",
    hideSubscriptionLive: "Hide live videos",
    hideSubscriptionMostRelevant: "Hide Most relevant shelf",
    hideSubscriptionPremiere: "Hide premieres",
    hideSubscriptionShorts: "Hide Shorts on Subscriptions",
    hideSubscriptionUpcoming: "Hide upcoming videos",
    hideSubscriptionVods: "Hide streamed archives",
    hideSubscriptionsLink: "Hide Subscriptions link",
    hideSubscriptionsSection: "Hide subscriptions section",
    hideThumbnailHoverOverlay: "Hide thumbnail hover effects",
    hideVideoActions: "Hide Like/Share actions",
    hideVideoDescription: "Hide description",
    hideVideoLikes: "Hide like count",
    hideVideoThumbnails: "Hide thumbnails",
    hideWatchSidebar: "Hide related-video sidebar",
    lockSettingsWithCode: "Lock settings with a code",
    lockSettingsWithTimer: "Lock settings with a 10-second timer",
    normalizeShorts: "Open Shorts in normal player",
    onlyShowPlaylists: "Show only playlists",
    redirectHomeToLibrary: "Redirect Home to You page",
    redirectHomeToSubscriptions: "Redirect Home to Subscriptions",
    redirectHomeToWatchLater: "Redirect Home to Watch Later",
    reverseChannelVideos: "Reverse channel video order",
    scheduleEnabled: "Enable only during weekday work hours",
    searchEngineMode: "Search engine mode",
    showEndScreenRevealBox: "Show reveal box on end screen",
    showHomepageRevealBox: "Show reveal box on Home",
    showOnlyFirstHomepageRow: "Keep only the first Home row",
    showSidebarRevealBox: "Show reveal box for related videos",
    shrinkVideoThumbnails: "Shrink thumbnails",
  },
};

const optionDescriptions: Partial<
  Record<YoutubeUiModifierLocale, Record<YoutubeUiModifierSettingId, string>>
> = {
  en: {
    autofocusSearch:
      "Focus the search box automatically outside watch pages when it is empty.",
    autoSkipAds: "Click skippable ad buttons and overlay ad close buttons.",
    blurVideoThumbnails: "Blur only video thumbnail images.",
    disableAmbientMode:
      "Turn off ambient mode in the player settings menu where possible.",
    disableAnnotations:
      "Turn off annotations in the player settings menu where possible.",
    disableAutoplay: "Turn the player autoplay toggle off when it is on.",
    disableFullscreenScroll: "Hide scrollable page areas while the player is fullscreen.",
    disableLogoLink: "Disable clicks from the YouTube logo back to Home.",
    disablePlayOnHover: "Hide video preview elements shown on mouse hover.",
    enableTheaterMode: "Switch watch pages to theater mode when using normal mode.",
    expandDescription: "Expand the watch page description where possible.",
    globalEnabled: "Turn all display adjustments on or off at once.",
    grayscaleMode: "Display all of YouTube in grayscale.",
    hideAds: "Hide ad containers and promotion slots on the page.",
    hideAllShorts: "Hide Shorts in navigation, shelves, search results, and video cards.",
    hideChannelAutoplay: "Pause the intro video at the top of channel pages when present.",
    hideChannelForYou: "Hide the For You section on channel pages.",
    hideChannelSubscribers: "Hide subscriber counts in the channel owner row.",
    hideClipButton: "Detect and hide the Clip button below videos.",
    hideCommentProfiles: "Hide profile images in the comments area.",
    hideCommentReplies: "Hide comment reply threads.",
    hideCommentUpvotes: "Hide like counts inside comment actions.",
    hideCommentUsernames: "Hide author names in the comments area.",
    hideComments: "Hide the comments area and comment prompt panels.",
    hideContextBoxes: "Hide contextual boxes such as info panels and supplemental cards.",
    hideCreateButton: "Hide the top bar Create button identified by CDP inspection.",
    hideEmbeddedMoreVideos: "Hide extra video panels shown on pause in embedded players.",
    hideEndScreen: "Hide the recommendation grid shown when a video ends.",
    hideEntireWatchSidebar: "Hide the whole right column and center the video column.",
    hideExploreLink: "Hide Explore and Trending links.",
    hideExploreSection: "Hide the Explore section in the left drawer.",
    hideExtraSidebarTags: 'Limit related-video tags to items equivalent to "All" and "Related".',
    hideFooterSection: "Hide footer links at the bottom of the left drawer.",
    hideHomeLink: "Hide the Home link in left navigation.",
    hideHomepageExtraRows: "Hide additional sections such as Shorts and Trending.",
    hideHomepageHeader: "Hide category chips and headers at the top of Home.",
    hideHomepageInfiniteScroll: "Hide continuation loaders at the end of Home lists.",
    hideHomepageSuggestions: "Hide recommendation lists on YouTube Home.",
    hideInfoCards: "Hide card elements shown over videos.",
    hideLeftNavigation: "Hide the left drawer and mini guide.",
    hideLiveChat: "Hide the live chat area on watch pages.",
    hideMoreFromYoutubeSection: "Hide sections equivalent to More from YouTube in the left drawer.",
    hideNextButton: "Hide the Next button inside the player.",
    hideNonTimestampComments: "Keep only comments that include video timestamp links.",
    hideNotificationBell: "Hide the notification bell on the right side of the header.",
    hideOverlaySuggestions: "Hide card teasers and candidate overlays shown while paused.",
    hidePlayables: "Hide YouTube Playables shelves on Home and similar pages.",
    hidePlaylistSuggestions: "Hide recommendation sections on playlist pages and similar pages.",
    hideQuickLinksSection: "Hide You, History, and similar sections in the left drawer.",
    hideSearchDescriptions: "Hide descriptions and supplemental metadata in search result cards.",
    hideSearchExtraResults: "Hide related shelves and extra sections in search results.",
    hideSearchInfiniteScroll: "Hide continuation loaders at the end of search results.",
    hideSearchPromoted: "Hide promoted videos mixed into search results.",
    hideSearchShorts: "Hide Shorts cards and Shorts shelves in search results.",
    hideSearchSuggestions: "Hide the search box suggestion dropdown.",
    hideSettingsSection: "Hide settings-related sections at the bottom of the left drawer.",
    hideShortsLink: "Hide Shorts links in left navigation and mobile bottom navigation.",
    hideSidebarInfiniteScroll: "Hide continuation loading at the end of the related-video sidebar.",
    hideSubscriptionLive: "Hide live videos on the Subscriptions page.",
    hideSubscriptionMostRelevant: "Hide the Most relevant section on the Subscriptions page.",
    hideSubscriptionPremiere: "Hide Premiere videos on the Subscriptions page.",
    hideSubscriptionShorts: "Hide Shorts videos on the Subscriptions page.",
    hideSubscriptionUpcoming: "Hide Upcoming videos on the Subscriptions page.",
    hideSubscriptionVods: "Hide videos marked as Streamed on the Subscriptions page.",
    hideSubscriptionsLink: "Hide navigation paths to subscriptions.",
    hideSubscriptionsSection: "Hide the subscriptions section in the left drawer.",
    hideThumbnailHoverOverlay: "Hide thumbnail slideshow effects in search results and similar pages.",
    hideVideoActions: "Hide the action button group below videos.",
    hideVideoDescription: "Hide the video description area.",
    hideVideoLikes: "Hide like-count text below videos.",
    hideVideoThumbnails: "Hide video thumbnails to emphasize text information.",
    hideWatchSidebar: "Hide the related-video list on the right side of videos.",
    lockSettingsWithCode: "Ask for a confirmation code before opening settings.",
    lockSettingsWithTimer: "Wait 10 seconds before opening settings from the Tampermonkey menu.",
    normalizeShorts: "Redirect Shorts URLs to normal watch URLs.",
    onlyShowPlaylists: "Suppress major links and sections other than playlists in the left navigation.",
    redirectHomeToLibrary: "Move to the You/Library-equivalent page when opening Home.",
    redirectHomeToSubscriptions: "Move to Subscriptions when opening Home.",
    redirectHomeToWatchLater: "Move to Watch Later when opening Home.",
    reverseChannelVideos: "Display channel page video grids in reverse order.",
    scheduleEnabled: "Enable display adjustments only Monday through Friday from 9:00 to 17:00.",
    searchEngineMode: "Keep the search bar and search results central while suppressing other YouTube areas.",
    showEndScreenRevealBox: "Show a temporary reveal box when end screen recommendations are hidden.",
    showHomepageRevealBox: "Show a temporary reveal box when Home recommendations are hidden.",
    showOnlyFirstHomepageRow: "Hide rows after the first row in the Home video grid.",
    showSidebarRevealBox: "Show a temporary reveal box when related videos are hidden.",
    shrinkVideoThumbnails: "Keep video thumbnails to a smaller fixed width.",
  },
};

export function translateCategoryLabel(id: string, fallback: string): string {
  return categoryLabels[i18n.getLocale()]?.[id] ?? fallback;
}

export function translateOptionLabel(
  id: YoutubeUiModifierSettingId,
  fallback: string,
): string {
  return optionLabels[i18n.getLocale()]?.[id] ?? fallback;
}

export function translateOptionDescription(
  id: YoutubeUiModifierSettingId,
  fallback: string,
): string {
  return optionDescriptions[i18n.getLocale()]?.[id] ?? fallback;
}
