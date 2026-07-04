import { registerMenuCommand } from "@/shared/userscript";
import type {
  YoutubeUiModifierLanguageSetting,
  YoutubeUiModifierSettingId,
  YoutubeUiModifierSettings,
} from "@/shared/types";
import { OBSERVER_DEBOUNCE_MS } from "./constants";
import { DomMarker } from "./dom-marker";
import { CATEGORIES, DEFAULT_SETTINGS } from "./settings-definitions";
import { SettingsStorage } from "./settings-storage";
import { SettingsUi } from "./settings-ui";
import { StyleManager } from "./style-manager";
import { RevealBoxManager } from "./reveal-box-manager";
import { applyLanguageSetting, t } from "./i18n";

export class YoutubeUiModifierApp {
  private readonly storage = new SettingsStorage();
  private readonly styleManager = new StyleManager();
  private readonly domMarker = new DomMarker();
  private readonly revealBoxManager = new RevealBoxManager();
  private readonly settingsUi: SettingsUi;
  private settings: YoutubeUiModifierSettings = { ...DEFAULT_SETTINGS };
  private observer: MutationObserver | null = null;
  private applyTimer: ReturnType<typeof setTimeout> | null = null;
  private actionInterval: ReturnType<typeof setInterval> | null = null;

  public constructor() {
    this.settingsUi = new SettingsUi({
      categories: CATEGORIES,
      getSettings: () => this.settings,
      onSettingChange: (id, value) => this.updateSetting(id, value),
      onLanguageChange: (language) => this.updateLanguage(language),
      onReset: () => this.resetSettings(),
    });
  }

  public async initialize(): Promise<void> {
    this.settings = await this.storage.load();
    applyLanguageSetting(this.settings.language);
    this.applySettings();
    this.registerMenuCommands();
    this.startObserver();
    this.startActionInterval();
    this.patchHistoryNavigation();
    document.addEventListener("keydown", this.handleKeydown);
  }

  private registerMenuCommands(): void {
    registerMenuCommand(t("menuOpenSettings"), () => this.openSettingsUi());
    registerMenuCommand(t("menuToggleEnabled"), () => {
      this.updateSetting("globalEnabled", !this.settings.globalEnabled);
    });
  }

  private updateSetting(id: YoutubeUiModifierSettingId, value: boolean): void {
    this.settings = {
      ...this.settings,
      [id]: value,
    };
    this.applySettingEffects(id, value);
    void this.storage.save(this.settings);
    this.applySettings();
  }

  private updateLanguage(language: YoutubeUiModifierLanguageSetting): void {
    this.settings = {
      ...this.settings,
      language,
    };
    applyLanguageSetting(language);
    void this.storage.save(this.settings);
    this.settingsUi.rerender();
  }

  private applySettingEffects(
    id: YoutubeUiModifierSettingId,
    value: boolean,
  ): void {
    if (!value) {
      return;
    }

    if (id === "showOnlyFirstHomepageRow") {
      this.settings.hideHomepageSuggestions = false;
      this.settings.hideHomepageExtraRows = true;
      this.settings.hideHomepageInfiniteScroll = true;
    }

    if (id === "onlyShowPlaylists") {
      this.settings.hideLeftNavigation = false;
      this.settings.hideSubscriptionsSection = true;
      this.settings.hideExploreSection = true;
      this.settings.hideMoreFromYoutubeSection = true;
      this.settings.hideSettingsSection = true;
      this.settings.hideFooterSection = true;
      this.settings.hideHomeLink = true;
      this.settings.hideExploreLink = true;
      this.settings.hideShortsLink = true;
      this.settings.hideSubscriptionsLink = true;
    }

    if (id === "redirectHomeToSubscriptions") {
      this.settings.redirectHomeToWatchLater = false;
      this.settings.redirectHomeToLibrary = false;
    } else if (id === "redirectHomeToWatchLater") {
      this.settings.redirectHomeToSubscriptions = false;
      this.settings.redirectHomeToLibrary = false;
    } else if (id === "redirectHomeToLibrary") {
      this.settings.redirectHomeToSubscriptions = false;
      this.settings.redirectHomeToWatchLater = false;
    }
  }

  private resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    applyLanguageSetting(this.settings.language);
    void this.storage.save(this.settings);
    this.applySettings();
    this.settingsUi.rerender();
  }

  private applySettings(): void {
    const effectiveSettings = this.getEffectiveSettings();
    this.styleManager.apply(effectiveSettings);
    this.domMarker.apply(effectiveSettings);
    this.revealBoxManager.apply(effectiveSettings, (id, value) =>
      this.updateSetting(id, value),
    );
    this.settingsUi.refresh();
  }

  private startObserver(): void {
    if (!document.body) {
      window.setTimeout(() => this.startObserver(), 100);
      return;
    }

    this.observer = new MutationObserver(() => this.scheduleDomMarker());
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private scheduleDomMarker(): void {
    if (this.applyTimer) {
      clearTimeout(this.applyTimer);
    }

    this.applyTimer = setTimeout(() => {
      this.applyTimer = null;
      this.domMarker.apply(this.getEffectiveSettings());
    }, OBSERVER_DEBOUNCE_MS);
  }

  private startActionInterval(): void {
    this.actionInterval = setInterval(() => {
      const effectiveSettings = this.getEffectiveSettings();
      this.domMarker.apply(effectiveSettings);
      this.revealBoxManager.apply(effectiveSettings, (id, value) =>
        this.updateSetting(id, value),
      );
    }, 1000);
  }

  private openSettingsUi(): void {
    if (this.settings.lockSettingsWithCode) {
      const code = window.prompt(t("settingsCodePrompt"));
      if (code !== "youtube-ui-modifier") {
        return;
      }
    }

    if (this.settings.lockSettingsWithTimer) {
      window.setTimeout(() => this.settingsUi.show(), 10000);
      return;
    }

    this.settingsUi.show();
  }

  private getEffectiveSettings(): YoutubeUiModifierSettings {
    if (!this.settings.scheduleEnabled || this.isInsideSchedule()) {
      return this.settings;
    }

    return {
      ...this.settings,
      globalEnabled: false,
    };
  }

  private isInsideSchedule(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  }

  private patchHistoryNavigation(): void {
    const onNavigate = (): void => {
      window.setTimeout(() => this.applySettings(), 50);
      window.setTimeout(() => this.applySettings(), 500);
    };

    const originalPushState = history.pushState.bind(
      history,
    ) as typeof history.pushState;
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      originalPushState(...args);
      onNavigate();
    };

    const originalReplaceState = history.replaceState.bind(
      history,
    ) as typeof history.replaceState;
    history.replaceState = (
      ...args: Parameters<typeof history.replaceState>
    ) => {
      originalReplaceState(...args);
      onNavigate();
    };

    window.addEventListener("popstate", onNavigate);
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.settingsUi.hide();
    }
  };
}
