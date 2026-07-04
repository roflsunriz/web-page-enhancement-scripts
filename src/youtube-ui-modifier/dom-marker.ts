import type { YoutubeUiModifierSettings } from "@/shared/types";

type SubscriptionBadgeKind = "live" | "premiere" | "upcoming";

const EXTRA_SIDEBAR_ALLOWED_TAGS = [
  "all",
  "すべて",
  "全部",
  "सभी",
  "todos",
  "todo",
  "tous",
  "كل",
  "সব",
  "все",
  "تمام",
  "related",
  "関連",
  "相关推荐",
  "संबंधित",
  "relacionados",
  "asociados",
  "associé",
  "associés",
  "ذات صلة",
  "relacionado",
  "সম্পর্কিত",
  "похожие",
  "متعلقہ",
] as const;

const SUBSCRIPTION_BADGE_KEYWORDS = {
  live: [
    "live",
    "ライブ",
    "直播",
    "लाइव",
    "en vivo",
    "directo",
    "en direct",
    "مباشر",
    "ao vivo",
    "লাইভ",
    "эфир",
    "прямой",
    "لائیو",
  ],
  premiere: [
    "premiere",
    "premieres",
    "プレミア",
    "首播",
    "प्रीमियर",
    "estreno",
    "première",
    "العرض الأول",
    "estreia",
    "প্রিমিয়ার",
    "премьера",
    "پریمیئر",
  ],
  upcoming: [
    "upcoming",
    "scheduled",
    "配信予定",
    "公開予定",
    "即将",
    "आगामी",
    "próximamente",
    "programado",
    "à venir",
    "prévu",
    "قادم",
    "مجدول",
    "agendado",
    "আসন্ন",
    "запланировано",
    "предстоит",
    "آنے والا",
    "شیڈول",
  ],
} as const satisfies Record<SubscriptionBadgeKind, ReadonlyArray<string>>;

const SUBSCRIPTION_VOD_KEYWORDS = [
  "streamed",
  "配信済み",
  "已直播",
  "स्ट्रीम किया गया",
  "emitido",
  "transmitido",
  "diffusé",
  "تم بثه",
  "ট্রিম করা হয়েছে",
  "প্রচারিত",
  "трансляция",
  "стрим",
  "اسٹریم",
] as const;

const MOST_RELEVANT_KEYWORDS = [
  "most relevant",
  "関連性が高い",
  "最相关",
  "सबसे प्रासंगिक",
  "más relevante",
  "plus pertinent",
  "الأكثر صلة",
  "mais relevantes",
  "সবচেয়ে প্রাসঙ্গিক",
  "самые релевантные",
  "سب سے زیادہ متعلقہ",
] as const;

const CHANNEL_FOR_YOU_KEYWORDS = [
  "for you",
  "あなた向け",
  "为你推荐",
  "आपके लिए",
  "para ti",
  "pour vous",
  "لك",
  "para você",
  "আপনার জন্য",
  "для вас",
  "آپ کے لیے",
] as const;

const PLAYER_TOGGLE_KEYWORDS = {
  ambientMode: [
    "ambient",
    "アンビエント",
    "环境",
    "ऐम्बिएंट",
    "ambiente",
    "ambiant",
    "المحيط",
    "পরিবেশ",
    "фоновый",
    "محیطی",
  ],
  annotations: [
    "annotation",
    "アノテーション",
    "注释",
    "एनोटेशन",
    "anotaciones",
    "annotations",
    "تعليقات توضيحية",
    "anotações",
    "টীকা",
    "аннотации",
    "تشریحات",
  ],
} as const;

const CREATE_BUTTON_CONTAINER_SELECTORS = [
  "ytd-button-renderer",
  "ytd-topbar-menu-button-renderer",
  "yt-button-view-model",
  "yt-icon-button",
  "button",
  "a",
] as const;

const CREATE_BUTTON_ENDPOINT_FRAGMENTS = [
  "/upload",
  "studio.youtube.com",
  "upload.youtube.com",
] as const;

const CREATION_MENU_STYLE = "MULTI_PAGE_MENU_STYLE_TYPE_CREATION";
const CREATION_MENU_ITEM_STYLE = "COMPACT_LINK_STYLE_TYPE_CREATION_MENU";

type YoutubeRendererElement = Element & {
  data?: unknown;
  __data?: {
    data?: unknown;
  };
};

export class DomMarker {
  public apply(settings: YoutubeUiModifierSettings): void {
    if (!settings.globalEnabled) {
      return;
    }

    if (settings.hideAllShorts || settings.hideSearchShorts) {
      this.markShorts();
    }

    if (settings.showOnlyFirstHomepageRow) {
      this.markHiddenHomepageRows();
    }

    if (settings.hidePlayables) {
      this.markPlayables();
    }

    if (settings.hideNonTimestampComments) {
      this.markTimestampComments();
    }

    if (settings.hidePlaylistSuggestions) {
      this.markPlaylistSuggestions();
    }

    if (settings.hideExtraSidebarTags) {
      this.markExtraSidebarTags();
    }

    if (settings.hideClipButton) {
      this.markClipButtons();
    }

    if (settings.hideCreateButton) {
      this.markCreateButtons();
    }

    if (this.shouldMarkSubscriptionItems(settings)) {
      this.markSubscriptionItems(settings);
    }

    if (settings.hideChannelForYou) {
      this.markChannelForYou();
    }

    this.runActions(settings);
  }

  private markShorts(): void {
    const badges = document.querySelectorAll(
      'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]',
    );
    badges.forEach((badge) => {
      this.markClosest(badge, [
        "ytd-compact-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-rich-item-renderer",
        "ytd-video-renderer",
        "ytm-video-with-context-renderer",
      ]);
    });

    const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
    shortsLinks.forEach((link) => {
      this.markClosest(link, [
        "ytd-video-renderer",
        "ytd-rich-item-renderer",
        "ytd-compact-video-renderer",
        "ytm-video-with-context-renderer",
      ]);
    });

    const shelves = document.querySelectorAll(
      "*[is-shorts], ytd-reel-shelf-renderer, ytm-reel-shelf-renderer",
    );
    shelves.forEach((shelf) => {
      const container = shelf.closest("ytd-rich-section-renderer") ?? shelf;
      container.setAttribute("data-youtube-ui-modifier-short", "true");
    });
  }

  private markClosest(
    element: Element,
    selectors: ReadonlyArray<string>,
  ): void {
    for (const selector of selectors) {
      const target = element.closest(selector);
      if (target) {
        target.setAttribute("data-youtube-ui-modifier-short", "true");
      }
    }
  }

  private markHiddenHomepageRows(): void {
    const grid = document.querySelector(
      'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer',
    );
    if (!grid) {
      return;
    }

    const items = Array.from(
      grid.querySelectorAll(":scope > #contents > ytd-rich-item-renderer"),
    );
    const perRowValue = getComputedStyle(grid).getPropertyValue(
      "--ytd-rich-grid-items-per-row",
    );
    const perRow = Number.parseInt(perRowValue, 10) || 4;
    items.forEach((item, index) => {
      this.setBooleanMarker(
        item,
        "data-youtube-ui-modifier-hidden-home-row",
        index >= perRow,
      );
    });
  }

  private markPlayables(): void {
    document
      .querySelectorAll("ytd-mini-game-card-view-model")
      .forEach((card) => {
        const shelf = card.closest("ytd-rich-section-renderer") ?? card;
        shelf.setAttribute("data-youtube-ui-modifier-playable", "true");
      });
  }

  private markTimestampComments(): void {
    const timestamps = document.querySelectorAll(
      'yt-formatted-string:not(.published-time-text).ytd-comment-renderer > a.yt-simple-endpoint[href^="/watch"]',
    );

    timestamps.forEach((timestamp) => {
      timestamp
        .closest("ytd-comment-thread-renderer")
        ?.setAttribute("data-youtube-ui-modifier-timestamp-comment", "true");
    });
  }

  private markPlaylistSuggestions(): void {
    const headers = document.querySelectorAll(
      'ytd-item-section-header-renderer[title-style="ITEM_SECTION_HEADER_TITLE_STYLE_PLAYLIST_RECOMMENDATIONS"]',
    );

    headers.forEach((header) => {
      header
        .closest("ytd-item-section-renderer")
        ?.setAttribute("data-youtube-ui-modifier-playlist-suggestions", "true");
    });
  }

  private markExtraSidebarTags(): void {
    document.querySelectorAll("yt-chip-cloud-chip-renderer").forEach((chip) => {
      const title = chip
        .querySelector("yt-formatted-string")
        ?.getAttribute("title")
        ?.trim()
        .toLowerCase();
      this.setBooleanMarker(
        chip,
        "data-youtube-ui-modifier-hide-chip",
        title !== undefined &&
          !this.matchesKeyword(title, EXTRA_SIDEBAR_ALLOWED_TAGS),
      );
    });
  }

  private markClipButtons(): void {
    const clipPaths = document.querySelectorAll(
      'path[d^="M8 7c0 .55-.45 1-1 1s-1-.45-1-1"]',
    );
    clipPaths.forEach((path) => {
      path
        .closest("#menu button")
        ?.setAttribute("data-youtube-ui-modifier-clip-button", "true");
    });
  }

  private markCreateButtons(): void {
    const mastheadButtons = document.querySelector("ytd-masthead #buttons");
    if (!mastheadButtons) {
      return;
    }

    const containers = Array.from(
      mastheadButtons.querySelectorAll(
        CREATE_BUTTON_CONTAINER_SELECTORS.join(","),
      ),
    );
    containers.forEach((container) => {
      this.setBooleanMarker(
        container,
        "data-youtube-ui-modifier-create-button",
        this.isCreateButtonContainer(container),
      );
    });
  }

  private isCreateButtonContainer(container: Element): boolean {
    if (!this.isTopbarButtonContainer(container)) {
      return false;
    }

    return (
      this.hasCreateButtonShape(container) ||
      this.hasCreationMenuData(container) ||
      this.hasCreateEndpoint(container)
    );
  }

  private isTopbarButtonContainer(container: Element): boolean {
    const mastheadButtons = container.closest("ytd-masthead #buttons");
    return (
      mastheadButtons !== null && container.parentElement === mastheadButtons
    );
  }

  private hasCreateButtonShape(container: Element): boolean {
    return (
      container.matches("ytd-button-renderer[button-renderer][button-next]") &&
      container.querySelector(":scope > yt-button-shape > button") !== null &&
      container.querySelector(":scope > yt-button-shape > a") === null
    );
  }

  private hasCreateEndpoint(container: Element): boolean {
    const hrefValues = Array.from(container.querySelectorAll("a[href]"))
      .map((anchor) => anchor.getAttribute("href") ?? "")
      .concat(container.getAttribute("href") ?? "");

    const rendererData = this.getRendererData(container);
    if (rendererData) {
      hrefValues.push(...this.collectStrings(rendererData));
    }

    return hrefValues.some((value) =>
      this.matchesCreateEndpointFragment(value),
    );
  }

  private hasCreationMenuData(container: Element): boolean {
    const rendererData = this.getRendererData(container);
    if (!rendererData) {
      return false;
    }

    const commandStyle = this.getStringAtPath(rendererData, [
      "command",
      "openPopupAction",
      "popup",
      "multiPageMenuRenderer",
      "style",
    ]);
    if (commandStyle === CREATION_MENU_STYLE) {
      return true;
    }

    return this.collectStrings(rendererData).includes(CREATION_MENU_ITEM_STYLE);
  }

  private getRendererData(container: Element): unknown {
    const renderer = container as YoutubeRendererElement;
    return renderer.data ?? renderer.__data?.data ?? null;
  }

  private getStringAtPath(
    value: unknown,
    path: ReadonlyArray<string>,
  ): string | null {
    let current: unknown = value;
    for (const key of path) {
      const record = this.asRecord(current);
      if (!record) {
        return null;
      }
      current = record[key];
    }

    return typeof current === "string" ? current : null;
  }

  private collectStrings(value: unknown): Array<string> {
    const strings: Array<string> = [];
    this.collectStringsRecursive(value, strings, new WeakSet(), 0);
    return strings;
  }

  private collectStringsRecursive(
    value: unknown,
    strings: Array<string>,
    seen: WeakSet<object>,
    depth: number,
  ): void {
    if (depth > 8 || value === null || value === undefined) {
      return;
    }

    if (typeof value === "string") {
      strings.push(value);
      return;
    }

    if (typeof value !== "object") {
      return;
    }

    if (seen.has(value)) {
      return;
    }
    seen.add(value);

    if (Array.isArray(value)) {
      value.forEach((item) =>
        this.collectStringsRecursive(item, strings, seen, depth + 1),
      );
      return;
    }

    Object.values(value).forEach((item) =>
      this.collectStringsRecursive(item, strings, seen, depth + 1),
    );
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  }

  private matchesCreateEndpointFragment(value: string): boolean {
    return CREATE_BUTTON_ENDPOINT_FRAGMENTS.some((fragment) =>
      value.includes(fragment),
    );
  }

  private shouldMarkSubscriptionItems(
    settings: YoutubeUiModifierSettings,
  ): boolean {
    return (
      settings.hideSubscriptionShorts ||
      settings.hideSubscriptionLive ||
      settings.hideSubscriptionUpcoming ||
      settings.hideSubscriptionPremiere ||
      settings.hideSubscriptionVods ||
      settings.hideSubscriptionMostRelevant
    );
  }

  private markSubscriptionItems(settings: YoutubeUiModifierSettings): void {
    document
      .querySelectorAll("ytd-badge-supported-renderer")
      .forEach((badge) => {
        this.markBadgeText(badge);
      });

    document
      .querySelectorAll(
        'ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]',
      )
      .forEach((badge) => this.markBadgeText(badge));

    if (settings.hideSubscriptionShorts) {
      document
        .querySelectorAll(
          'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]',
        )
        .forEach((badge) => {
          badge
            .closest("ytd-grid-video-renderer")
            ?.setAttribute(
              "data-youtube-ui-modifier-subscription-short",
              "true",
            );
          badge
            .closest("ytd-rich-item-renderer")
            ?.setAttribute(
              "data-youtube-ui-modifier-subscription-short",
              "true",
            );
        });
    }

    if (settings.hideSubscriptionVods) {
      document.querySelectorAll("#metadata-line span").forEach((span) => {
        if (
          !this.matchesKeyword(
            this.getElementText(span),
            SUBSCRIPTION_VOD_KEYWORDS,
          )
        ) {
          return;
        }

        span
          .closest("ytd-grid-video-renderer")
          ?.setAttribute("data-youtube-ui-modifier-vod", "true");
        span
          .closest("ytd-rich-item-renderer")
          ?.setAttribute("data-youtube-ui-modifier-vod", "true");
      });
    }

    if (settings.hideSubscriptionMostRelevant) {
      document
        .querySelectorAll("ytd-rich-section-renderer ytd-rich-shelf-renderer")
        .forEach((shelf) => {
          const title = this.getElementText(shelf.querySelector("span#title"))
            .trim()
            .toLowerCase();
          if (this.matchesKeyword(title, MOST_RELEVANT_KEYWORDS)) {
            shelf
              .closest("ytd-rich-section-renderer")
              ?.setAttribute("data-youtube-ui-modifier-most-relevant", "true");
          }
        });
    }
  }

  private markBadgeText(badge: Element): void {
    const badgeText = this.getElementText(badge).trim().toLowerCase();
    const badgeKind = this.getSubscriptionBadgeKind(badgeText);
    if (!badgeKind) {
      return;
    }

    badge
      .closest("ytd-grid-video-renderer")
      ?.setAttribute("data-youtube-ui-modifier-badge-text", badgeKind);
    badge
      .closest("ytd-rich-item-renderer")
      ?.setAttribute("data-youtube-ui-modifier-badge-text", badgeKind);
  }

  private markChannelForYou(): void {
    document
      .querySelectorAll('ytd-item-section-renderer[page-subtype="channels"]')
      .forEach((section) => {
        const title = this.getElementText(section.querySelector("span#title"))
          .trim()
          .toLowerCase();
        if (this.matchesKeyword(title, CHANNEL_FOR_YOU_KEYWORDS)) {
          section.setAttribute(
            "data-youtube-ui-modifier-channel-for-you",
            "true",
          );
        }
      });
  }

  private runActions(settings: YoutubeUiModifierSettings): void {
    this.redirectIfNeeded(settings);

    if (settings.autoSkipAds) {
      this.skipAds();
    }

    if (settings.disableAutoplay) {
      this.disableAutoplay();
    }

    if (settings.disableAmbientMode) {
      this.disablePlayerToggle(PLAYER_TOGGLE_KEYWORDS.ambientMode);
    }

    if (settings.disableAnnotations) {
      this.disablePlayerToggle(PLAYER_TOGGLE_KEYWORDS.annotations);
    }

    if (settings.expandDescription || settings.hideComments) {
      this.expandDescription();
    }

    if (settings.enableTheaterMode) {
      this.enableTheaterMode();
    }

    if (settings.hideChannelAutoplay) {
      document
        .querySelector<HTMLVideoElement>(
          "ytd-channel-video-player-renderer video",
        )
        ?.pause();
    }

    if (settings.autofocusSearch || settings.searchEngineMode) {
      this.autofocusSearch();
    }

    if (settings.hideNotificationBell) {
      document.title = document.title.replace(/^\(\d+\)/, "");
    }
  }

  private redirectIfNeeded(settings: YoutubeUiModifierSettings): void {
    const path = window.location.pathname;
    const onHome = path === "/";
    if (settings.normalizeShorts && path.startsWith("/shorts/")) {
      window.location.replace(
        window.location.href.replace("/shorts/", "/watch/"),
      );
      return;
    }

    if (!onHome) {
      return;
    }

    if (settings.redirectHomeToSubscriptions) {
      window.location.replace("https://www.youtube.com/feed/subscriptions");
    } else if (settings.redirectHomeToWatchLater) {
      window.location.replace("https://www.youtube.com/playlist?list=WL");
    } else if (settings.redirectHomeToLibrary) {
      window.location.replace("https://www.youtube.com/feed/you");
    }
  }

  private skipAds(): void {
    document
      .querySelectorAll<HTMLElement>(
        ".ytp-ad-overlay-close-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-skip-ad button",
      )
      .forEach((button) => {
        if (this.isVisible(button)) {
          button.click();
        }
      });
  }

  private disableAutoplay(): void {
    document
      .querySelectorAll<HTMLElement>(
        '.ytp-autonav-toggle-button[aria-checked="true"]',
      )
      .forEach((button) => {
        if (this.isVisible(button)) {
          button.click();
        }
      });

    document
      .querySelectorAll<HTMLElement>(
        '.ytm-autonav-toggle-button-container[aria-pressed="true"]',
      )
      .forEach((button) => {
        if (this.isVisible(button)) {
          button.click();
        }
      });
  }

  private disablePlayerToggle(keywords: ReadonlyArray<string>): void {
    const menuItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".ytp-settings-menu .ytp-panel-menu > div",
      ),
    );
    if (menuItems.length === 0) {
      const settingsButton = document.querySelector<HTMLElement>(
        "#ytd-player button.ytp-settings-button, button.ytp-settings-button",
      );
      if (settingsButton && this.isVisible(settingsButton)) {
        settingsButton.click();
        settingsButton.click();
      }
      return;
    }

    menuItems.forEach((item) => {
      const text = this.getElementText(item).toLowerCase();
      const matches = keywords.some((keyword) =>
        text.includes(keyword.toLowerCase()),
      );
      if (!matches || item.getAttribute("aria-checked") !== "true") {
        return;
      }

      const toggle =
        item.querySelector<HTMLElement>(".ytp-menuitem-toggle-checkbox") ??
        item;
      if (this.isVisible(toggle)) {
        toggle.click();
      }
    });
  }

  private expandDescription(): void {
    document
      .querySelectorAll<HTMLElement>("#description #expand.button")
      .forEach((button) => {
        if (this.isVisible(button)) {
          button.click();
        }
      });
  }

  private enableTheaterMode(): void {
    const flexy = document.querySelector("ytd-watch-flexy");
    const button = document.querySelector<HTMLElement>(".ytp-size-button");
    if (
      flexy &&
      button &&
      !flexy.hasAttribute("theater") &&
      this.isVisible(button)
    ) {
      button.click();
    }
  }

  private autofocusSearch(): void {
    if (window.location.pathname.startsWith("/watch")) {
      return;
    }

    const input = document.querySelector<HTMLInputElement>("input#search");
    if (input && input.value === "" && document.activeElement !== input) {
      input.focus();
    }
  }

  private getElementText(element: Element | null): string {
    return element instanceof HTMLElement
      ? element.innerText
      : (element?.textContent ?? "");
  }

  private getSubscriptionBadgeKind(text: string): SubscriptionBadgeKind | null {
    for (const [kind, keywords] of Object.entries(
      SUBSCRIPTION_BADGE_KEYWORDS,
    ) as Array<[SubscriptionBadgeKind, ReadonlyArray<string>]>) {
      if (this.matchesKeyword(text, keywords)) {
        return kind;
      }
    }

    return null;
  }

  private matchesKeyword(
    text: string,
    keywords: ReadonlyArray<string>,
  ): boolean {
    const normalizedText = text.trim().toLowerCase();
    return keywords.some((keyword) =>
      normalizedText.includes(keyword.toLowerCase()),
    );
  }

  private isVisible(element: HTMLElement): boolean {
    return element.offsetParent !== null;
  }

  private setBooleanMarker(
    element: Element,
    attributeName: string,
    enabled: boolean,
  ): void {
    if (enabled) {
      element.setAttribute(attributeName, "true");
      return;
    }

    element.removeAttribute(attributeName);
  }
}
