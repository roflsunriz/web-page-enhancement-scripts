import type {
  YoutubeUiModifierSettingId,
  YoutubeUiModifierSettings,
} from '@/shared/types';
import { STYLE_ID } from './constants';
import {
  BLUR_THUMBNAIL_SELECTORS,
  CENTER_WATCH_PAGE_CSS,
  CSS_RULES,
  DISABLE_LOGO_LINK_CSS,
  REVERSE_CHANNEL_VIDEOS_CSS,
  RESET_LEFT_NAV_MARGIN_CSS,
  SEARCH_ENGINE_MODE_CSS,
  SHRINK_THUMBNAIL_CSS,
} from './css-rules';

export class StyleManager {
  private readonly styleElement: HTMLStyleElement;

  public constructor() {
    this.styleElement = this.findOrCreateStyle(STYLE_ID);
  }

  public apply(settings: YoutubeUiModifierSettings): void {
    this.styleElement.textContent = this.createCss(settings);
  }

  private findOrCreateStyle(id: string): HTMLStyleElement {
    const existing = document.getElementById(id);
    if (existing instanceof HTMLStyleElement) {
      return existing;
    }

    const style = document.createElement('style');
    style.id = id;
    (document.head || document.documentElement).appendChild(style);
    return style;
  }

  private createCss(settings: YoutubeUiModifierSettings): string {
    if (!settings.globalEnabled) {
      return '';
    }

    const rules: string[] = [];

    for (const [id, selectors] of Object.entries(CSS_RULES) as Array<
      [YoutubeUiModifierSettingId, ReadonlyArray<string>]
    >) {
      if (!settings[id] || selectors.length === 0) {
        continue;
      }

      rules.push(`${selectors.join(',\n')} {\n  display: none !important;\n}`);
    }

    if (settings.blurVideoThumbnails) {
      rules.push(`${BLUR_THUMBNAIL_SELECTORS.join(',\n')} {\n  filter: blur(20px) !important;\n}`);
    }

    if (settings.shrinkVideoThumbnails) {
      rules.push(SHRINK_THUMBNAIL_CSS);
    }

    if (settings.hideEntireWatchSidebar) {
      rules.push(CENTER_WATCH_PAGE_CSS);
    }

    if (settings.hideLeftNavigation) {
      rules.push(RESET_LEFT_NAV_MARGIN_CSS);
    }

    if (settings.disableLogoLink) {
      rules.push(DISABLE_LOGO_LINK_CSS);
    }

    if (settings.reverseChannelVideos) {
      rules.push(REVERSE_CHANNEL_VIDEOS_CSS);
    }

    if (settings.searchEngineMode) {
      rules.push(SEARCH_ENGINE_MODE_CSS);
    }

    if (settings.grayscaleMode) {
      rules.push('ytd-app, ytm-app {\n  filter: grayscale(100%) !important;\n}');
    }

    return `/* YouTube UI Modifier */\n${rules.join('\n\n')}`;
  }
}
