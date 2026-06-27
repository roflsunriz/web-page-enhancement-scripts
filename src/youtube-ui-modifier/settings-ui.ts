import type {
  YoutubeUiModifierCategoryDefinition,
  YoutubeUiModifierOptionDefinition,
  YoutubeUiModifierSettingId,
  YoutubeUiModifierSettings,
  YoutubeUiModifierSettingsChangeHandler,
} from "@/shared/types";
import { MODAL_ID, PANEL_ID, STATUS_ID, UI_STYLE_ID } from "./constants";
import { DEFAULT_SETTINGS } from "./settings-definitions";
import { UI_STYLES } from "./ui-styles";
import { format, t } from "./i18n";

const ENABLED_FILTER_CATEGORY_ID = "__enabled__";

type SettingsUiOptions = {
  categories: ReadonlyArray<YoutubeUiModifierCategoryDefinition>;
  getSettings: () => YoutubeUiModifierSettings;
  onSettingChange: YoutubeUiModifierSettingsChangeHandler;
  onReset: () => void;
};

export class SettingsUi {
  private readonly categories: ReadonlyArray<YoutubeUiModifierCategoryDefinition>;
  private readonly getSettings: () => YoutubeUiModifierSettings;
  private readonly onSettingChange: YoutubeUiModifierSettingsChangeHandler;
  private readonly onReset: () => void;
  private activeCategoryId: string;

  public constructor(options: SettingsUiOptions) {
    this.categories = options.categories;
    this.getSettings = options.getSettings;
    this.onSettingChange = options.onSettingChange;
    this.onReset = options.onReset;
    this.activeCategoryId = this.categories[0]?.id ?? "general";
    this.injectStyles();
  }

  public show(): void {
    if (document.getElementById(MODAL_ID)) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "youtube-ui-modifier-overlay";
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.hide();
      }
    });

    const modal = document.createElement("section");
    modal.className = "youtube-ui-modifier-dialog";
    modal.setAttribute("aria-label", t("settingsTitle"));
    modal.appendChild(this.createHeader());
    modal.appendChild(this.createContent());
    modal.appendChild(this.createFooter());

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    this.renderActiveCategory();
  }

  public hide(): void {
    document.getElementById(MODAL_ID)?.remove();
  }

  public refresh(): void {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    modal
      .querySelectorAll<HTMLButtonElement>(".youtube-ui-modifier-category")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.categoryId === this.activeCategoryId,
        );
      });

    modal
      .querySelectorAll<HTMLElement>(".youtube-ui-modifier-option")
      .forEach((row) => {
        const id = row.dataset.settingId;
        if (!this.isSettingId(id)) {
          return;
        }

        const input = row.querySelector<HTMLInputElement>(
          'input[type="checkbox"]',
        );
        if (input) {
          input.checked = this.getSettings()[id];
        }
      });

    this.updateStatus();

    if (this.activeCategoryId === ENABLED_FILTER_CATEGORY_ID) {
      this.renderActiveCategory();
    }
  }

  public renderActiveCategory(): void {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) {
      return;
    }

    if (this.activeCategoryId === ENABLED_FILTER_CATEGORY_ID) {
      this.renderEnabledFilter(panel);
      return;
    }

    const category =
      this.categories.find((item) => item.id === this.activeCategoryId) ??
      this.categories[0];
    if (!category) {
      return;
    }

    panel.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = category.label;
    panel.appendChild(heading);

    const list = document.createElement("div");
    list.className = "youtube-ui-modifier-option-list";
    category.options.forEach((option) => {
      list.appendChild(this.createOption(option));
    });

    panel.appendChild(list);
    this.refresh();
  }

  private injectStyles(): void {
    const existing = document.getElementById(UI_STYLE_ID);
    if (existing instanceof HTMLStyleElement) {
      existing.textContent = UI_STYLES;
      return;
    }

    const style = document.createElement("style");
    style.id = UI_STYLE_ID;
    style.textContent = UI_STYLES;
    (document.head || document.documentElement).appendChild(style);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement("header");
    header.className = "youtube-ui-modifier-header";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = t("settingsTitle");
    titleWrap.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.textContent = t("settingsSubtitle");
    titleWrap.appendChild(subtitle);
    header.appendChild(titleWrap);

    const closeButton = document.createElement("button");
    closeButton.className = "youtube-ui-modifier-icon-button";
    closeButton.type = "button";
    closeButton.title = t("close");
    closeButton.textContent = "x";
    closeButton.addEventListener("click", () => this.hide());
    header.appendChild(closeButton);

    return header;
  }

  private createContent(): HTMLElement {
    const content = document.createElement("div");
    content.className = "youtube-ui-modifier-content";
    content.appendChild(this.createSidebar());

    const panel = document.createElement("div");
    panel.className = "youtube-ui-modifier-panel";
    panel.id = PANEL_ID;
    content.appendChild(panel);

    return content;
  }

  private createSidebar(): HTMLElement {
    const nav = document.createElement("nav");
    nav.className = "youtube-ui-modifier-sidebar";

    const enabledButton = document.createElement("button");
    enabledButton.type = "button";
    enabledButton.className =
      "youtube-ui-modifier-category youtube-ui-modifier-category-filter";
    enabledButton.dataset.categoryId = ENABLED_FILTER_CATEGORY_ID;
    enabledButton.textContent = t("activeSettings");
    enabledButton.addEventListener("click", () => {
      this.activeCategoryId = ENABLED_FILTER_CATEGORY_ID;
      this.renderActiveCategory();
    });
    nav.appendChild(enabledButton);

    const divider = document.createElement("div");
    divider.className = "youtube-ui-modifier-sidebar-divider";
    nav.appendChild(divider);

    this.categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "youtube-ui-modifier-category";
      button.dataset.categoryId = category.id;
      button.textContent = category.label;
      button.addEventListener("click", () => {
        this.activeCategoryId = category.id;
        this.renderActiveCategory();
      });
      nav.appendChild(button);
    });

    return nav;
  }

  private renderEnabledFilter(panel: HTMLElement): void {
    panel.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = t("activeSettings");
    panel.appendChild(heading);

    const enabledOptions = this.getEnabledOptions();
    if (enabledOptions.length === 0) {
      const empty = document.createElement("p");
      empty.className = "youtube-ui-modifier-empty";
      empty.textContent = t("noActiveSettings");
      panel.appendChild(empty);
      this.refreshCategoryButtons();
      this.updateStatus();
      return;
    }

    const list = document.createElement("div");
    list.className = "youtube-ui-modifier-option-list";
    enabledOptions.forEach((option) => {
      list.appendChild(this.createOption(option));
    });

    panel.appendChild(list);
    this.refreshCategoryButtons();
    this.updateStatus();
  }

  private getEnabledOptions(): YoutubeUiModifierOptionDefinition[] {
    const settings = this.getSettings();
    return this.categories
      .flatMap((category) => category.options)
      .filter((option) => option.id !== "globalEnabled" && settings[option.id]);
  }

  private refreshCategoryButtons(): void {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    modal
      .querySelectorAll<HTMLButtonElement>(".youtube-ui-modifier-category")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.categoryId === this.activeCategoryId,
        );
      });
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement("footer");
    footer.className = "youtube-ui-modifier-footer";

    const status = document.createElement("span");
    status.className = "youtube-ui-modifier-status";
    status.id = STATUS_ID;
    footer.appendChild(status);

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className =
      "youtube-ui-modifier-button youtube-ui-modifier-button-danger";
    resetButton.textContent = t("resetSettings");
    resetButton.addEventListener("click", () => {
      if (window.confirm(t("resetConfirm"))) {
        this.onReset();
        this.renderActiveCategory();
      }
    });
    footer.appendChild(resetButton);

    return footer;
  }

  private createOption(option: YoutubeUiModifierOptionDefinition): HTMLElement {
    const row = document.createElement("label");
    row.className = "youtube-ui-modifier-option";
    row.dataset.settingId = option.id;

    const text = document.createElement("span");
    text.className = "youtube-ui-modifier-option-text";

    const title = document.createElement("span");
    title.className = "youtube-ui-modifier-option-title";
    title.textContent = option.label;
    text.appendChild(title);

    const description = document.createElement("span");
    description.className = "youtube-ui-modifier-option-description";
    description.textContent = option.description;
    text.appendChild(description);

    row.appendChild(text);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = this.getSettings()[option.id];
    input.addEventListener("change", () =>
      this.onSettingChange(option.id, input.checked),
    );
    row.appendChild(input);

    const switchTrack = document.createElement("span");
    switchTrack.className = "youtube-ui-modifier-switch";
    row.appendChild(switchTrack);

    return row;
  }

  private updateStatus(): void {
    const status = document.getElementById(STATUS_ID);
    if (!status) {
      return;
    }

    const settings = this.getSettings();
    const enabledCount = Object.entries(settings).filter(
      ([key, value]) => key !== "globalEnabled" && value,
    ).length;
    status.textContent = settings.globalEnabled
      ? format("enabledCount", { count: String(enabledCount) })
      : t("globalDisabled");
  }

  private isSettingId(
    value: string | undefined,
  ): value is YoutubeUiModifierSettingId {
    return value !== undefined && value in DEFAULT_SETTINGS;
  }
}
