import type { YoutubeUiModifierSettings } from '@/shared/types';

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

    if (this.shouldMarkSubscriptionItems(settings)) {
      this.markSubscriptionItems(settings);
    }

    if (settings.hideChannelForYou) {
      this.markChannelForYou();
    }

    this.runActions(settings);
  }

  private markShorts(): void {
    const badges = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    badges.forEach((badge) => {
      this.markClosest(badge, [
        'ytd-compact-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-rich-item-renderer',
        'ytd-video-renderer',
        'ytm-video-with-context-renderer',
      ]);
    });

    const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
    shortsLinks.forEach((link) => {
      this.markClosest(link, [
        'ytd-video-renderer',
        'ytd-rich-item-renderer',
        'ytd-compact-video-renderer',
        'ytm-video-with-context-renderer',
      ]);
    });

    const shelves = document.querySelectorAll('*[is-shorts], ytd-reel-shelf-renderer, ytm-reel-shelf-renderer');
    shelves.forEach((shelf) => {
      const container = shelf.closest('ytd-rich-section-renderer') ?? shelf;
      container.setAttribute('data-youtube-ui-modifier-short', 'true');
    });
  }

  private markClosest(element: Element, selectors: ReadonlyArray<string>): void {
    for (const selector of selectors) {
      const target = element.closest(selector);
      if (target) {
        target.setAttribute('data-youtube-ui-modifier-short', 'true');
      }
    }
  }

  private markHiddenHomepageRows(): void {
    const grid = document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');
    if (!grid) {
      return;
    }

    const items = Array.from(grid.querySelectorAll(':scope > #contents > ytd-rich-item-renderer'));
    const perRowValue = getComputedStyle(grid).getPropertyValue('--ytd-rich-grid-items-per-row');
    const perRow = Number.parseInt(perRowValue, 10) || 4;
    items.forEach((item, index) => {
      item.toggleAttribute('data-youtube-ui-modifier-hidden-home-row', index >= perRow);
    });
  }

  private markPlayables(): void {
    document.querySelectorAll('ytd-mini-game-card-view-model').forEach((card) => {
      const shelf = card.closest('ytd-rich-section-renderer') ?? card;
      shelf.setAttribute('data-youtube-ui-modifier-playable', 'true');
    });
  }

  private markTimestampComments(): void {
    const timestamps = document.querySelectorAll(
      'yt-formatted-string:not(.published-time-text).ytd-comment-renderer > a.yt-simple-endpoint[href^="/watch"]'
    );

    timestamps.forEach((timestamp) => {
      timestamp
        .closest('ytd-comment-thread-renderer')
        ?.setAttribute('data-youtube-ui-modifier-timestamp-comment', 'true');
    });
  }

  private markPlaylistSuggestions(): void {
    const headers = document.querySelectorAll(
      'ytd-item-section-header-renderer[title-style="ITEM_SECTION_HEADER_TITLE_STYLE_PLAYLIST_RECOMMENDATIONS"]'
    );

    headers.forEach((header) => {
      header
        .closest('ytd-item-section-renderer')
        ?.setAttribute('data-youtube-ui-modifier-playlist-suggestions', 'true');
    });
  }

  private markExtraSidebarTags(): void {
    const allowedTitles = new Set(['all', 'related']);
    document.querySelectorAll('yt-chip-cloud-chip-renderer').forEach((chip) => {
      const title = chip.querySelector('yt-formatted-string')?.getAttribute('title')?.trim().toLowerCase();
      chip.toggleAttribute('data-youtube-ui-modifier-hide-chip', title !== undefined && !allowedTitles.has(title));
    });
  }

  private markClipButtons(): void {
    const clipPaths = document.querySelectorAll('path[d^="M8 7c0 .55-.45 1-1 1s-1-.45-1-1"]');
    clipPaths.forEach((path) => {
      path.closest('#menu button')?.setAttribute('data-youtube-ui-modifier-clip-button', 'true');
    });
  }

  private shouldMarkSubscriptionItems(settings: YoutubeUiModifierSettings): boolean {
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
    document.querySelectorAll('ytd-badge-supported-renderer').forEach((badge) => {
      this.markBadgeText(badge);
    });

    document
      .querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]')
      .forEach((badge) => this.markBadgeText(badge));

    if (settings.hideSubscriptionShorts) {
      document
        .querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')
        .forEach((badge) => {
          badge.closest('ytd-grid-video-renderer')?.setAttribute('data-youtube-ui-modifier-subscription-short', 'true');
          badge.closest('ytd-rich-item-renderer')?.setAttribute('data-youtube-ui-modifier-subscription-short', 'true');
        });
    }

    if (settings.hideSubscriptionVods) {
      document.querySelectorAll('#metadata-line span').forEach((span) => {
        if (!this.getElementText(span).includes('Streamed')) {
          return;
        }

        span.closest('ytd-grid-video-renderer')?.setAttribute('data-youtube-ui-modifier-vod', 'true');
        span.closest('ytd-rich-item-renderer')?.setAttribute('data-youtube-ui-modifier-vod', 'true');
      });
    }

    if (settings.hideSubscriptionMostRelevant) {
      document.querySelectorAll('ytd-rich-section-renderer ytd-rich-shelf-renderer').forEach((shelf) => {
        const title = this.getElementText(shelf.querySelector('span#title')).trim().toLowerCase();
        if (title === 'most relevant') {
          shelf.closest('ytd-rich-section-renderer')?.setAttribute('data-youtube-ui-modifier-most-relevant', 'true');
        }
      });
    }
  }

  private markBadgeText(badge: Element): void {
    const badgeText = this.getElementText(badge).trim().split(' ')[0]?.trim().toLowerCase();
    if (!badgeText) {
      return;
    }

    badge.closest('ytd-grid-video-renderer')?.setAttribute('data-youtube-ui-modifier-badge-text', badgeText);
    badge.closest('ytd-rich-item-renderer')?.setAttribute('data-youtube-ui-modifier-badge-text', badgeText);
  }

  private markChannelForYou(): void {
    document.querySelectorAll('ytd-item-section-renderer[page-subtype="channels"]').forEach((section) => {
      const title = this.getElementText(section.querySelector('span#title')).trim().toLowerCase();
      if (title === 'for you') {
        section.setAttribute('data-youtube-ui-modifier-channel-for-you', 'true');
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
      this.disablePlayerToggle(['ambient', 'アンビエント']);
    }

    if (settings.disableAnnotations) {
      this.disablePlayerToggle(['annotation', 'アノテーション']);
    }

    if (settings.expandDescription || settings.hideComments) {
      this.expandDescription();
    }

    if (settings.enableTheaterMode) {
      this.enableTheaterMode();
    }

    if (settings.hideChannelAutoplay) {
      document.querySelector<HTMLVideoElement>('ytd-channel-video-player-renderer video')?.pause();
    }

    if (settings.autofocusSearch || settings.searchEngineMode) {
      this.autofocusSearch();
    }

    if (settings.hideNotificationBell) {
      document.title = document.title.replace(/^\(\d+\)/, '');
    }
  }

  private redirectIfNeeded(settings: YoutubeUiModifierSettings): void {
    const path = window.location.pathname;
    const onHome = path === '/';
    if (settings.normalizeShorts && path.startsWith('/shorts/')) {
      window.location.replace(window.location.href.replace('/shorts/', '/watch/'));
      return;
    }

    if (!onHome) {
      return;
    }

    if (settings.redirectHomeToSubscriptions) {
      window.location.replace('https://www.youtube.com/feed/subscriptions');
    } else if (settings.redirectHomeToWatchLater) {
      window.location.replace('https://www.youtube.com/playlist?list=WL');
    } else if (settings.redirectHomeToLibrary) {
      window.location.replace('https://www.youtube.com/feed/you');
    }
  }

  private skipAds(): void {
    document
      .querySelectorAll<HTMLElement>(
        '.ytp-ad-overlay-close-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-skip-ad button'
      )
      .forEach((button) => {
        if (this.isVisible(button)) {
          button.click();
        }
      });
  }

  private disableAutoplay(): void {
    document.querySelectorAll<HTMLElement>('.ytp-autonav-toggle-button[aria-checked="true"]').forEach((button) => {
      if (this.isVisible(button)) {
        button.click();
      }
    });

    document.querySelectorAll<HTMLElement>('.ytm-autonav-toggle-button-container[aria-pressed="true"]').forEach((button) => {
      if (this.isVisible(button)) {
        button.click();
      }
    });
  }

  private disablePlayerToggle(keywords: ReadonlyArray<string>): void {
    const menuItems = Array.from(document.querySelectorAll<HTMLElement>('.ytp-settings-menu .ytp-panel-menu > div'));
    if (menuItems.length === 0) {
      const settingsButton = document.querySelector<HTMLElement>('#ytd-player button.ytp-settings-button, button.ytp-settings-button');
      if (settingsButton && this.isVisible(settingsButton)) {
        settingsButton.click();
        settingsButton.click();
      }
      return;
    }

    menuItems.forEach((item) => {
      const text = this.getElementText(item).toLowerCase();
      const matches = keywords.some((keyword) => text.includes(keyword.toLowerCase()));
      if (!matches || item.getAttribute('aria-checked') !== 'true') {
        return;
      }

      const toggle = item.querySelector<HTMLElement>('.ytp-menuitem-toggle-checkbox') ?? item;
      if (this.isVisible(toggle)) {
        toggle.click();
      }
    });
  }

  private expandDescription(): void {
    document.querySelectorAll<HTMLElement>('#description #expand.button').forEach((button) => {
      if (this.isVisible(button)) {
        button.click();
      }
    });
  }

  private enableTheaterMode(): void {
    const flexy = document.querySelector('ytd-watch-flexy');
    const button = document.querySelector<HTMLElement>('.ytp-size-button');
    if (flexy && button && !flexy.hasAttribute('theater') && this.isVisible(button)) {
      button.click();
    }
  }

  private autofocusSearch(): void {
    if (window.location.pathname.startsWith('/watch')) {
      return;
    }

    const input = document.querySelector<HTMLInputElement>('input#search');
    if (input && input.value === '' && document.activeElement !== input) {
      input.focus();
    }
  }

  private getElementText(element: Element | null): string {
    return element instanceof HTMLElement ? element.innerText : element?.textContent ?? '';
  }

  private isVisible(element: HTMLElement): boolean {
    return element.offsetParent !== null;
  }
}
