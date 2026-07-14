/**
 * Twitter Clean UI - 設定UI
 */

import type { TranslationKeys, UIElementId } from "./types";
import type { SettingsManager } from "./settings-manager";
import type { ElementController } from "./element-controller";
import { t } from "./i18n";
import { UI_STYLES } from "./styles";

/**
 * 設定UIクラス
 */
export class SettingsUI {
  private settingsManager: SettingsManager;
  private controller: ElementController;
  private overlay: HTMLDivElement | null = null;
  private styleElement: HTMLStyleElement | null = null;

  /**
   * コンストラクタ
   */
  constructor(settingsManager: SettingsManager, controller: ElementController) {
    this.settingsManager = settingsManager;
    this.controller = controller;
    this.injectStyles();
  }

  /**
   * スタイルを注入
   */
  private injectStyles(): void {
    if (this.styleElement) return;

    this.styleElement = document.createElement("style");
    this.styleElement.textContent = UI_STYLES;
    document.head.appendChild(this.styleElement);
  }

  /**
   * UIを表示
   */
  public show(): void {
    if (this.overlay) return;

    this.overlay = this.createOverlay();
    this.overlay.dir = "auto";
    document.body.appendChild(this.overlay);

    // デフォルトで最初のタブを表示（DOMに追加された後）
    setTimeout(() => {
      this.showTab("visibility");
    }, 0);
  }

  /**
   * UIを非表示
   */
  public hide(): void {
    if (!this.overlay) return;

    this.overlay.remove();
    this.overlay = null;
  }

  /**
   * オーバーレイを作成
   */
  private createOverlay(): HTMLDivElement {
    const overlay = document.createElement("div");
    overlay.className = "twitter-clean-ui-overlay";

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.hide();
      }
    });

    const modal = this.createModal();
    overlay.appendChild(modal);

    return overlay;
  }

  /**
   * モーダルを作成
   */
  private createModal(): HTMLDivElement {
    const modal = document.createElement("div");
    modal.className = "twitter-clean-ui-modal";

    // ヘッダー
    const header = this.createHeader();
    modal.appendChild(header);

    // タブ
    const tabs = this.createTabs();
    modal.appendChild(tabs);

    // ボディ
    const body = document.createElement("div");
    body.className = "twitter-clean-ui-body";
    body.id = "twitter-clean-ui-body";
    modal.appendChild(body);

    // フッター
    const footer = this.createFooter();
    modal.appendChild(footer);

    return modal;
  }

  /**
   * ヘッダーを作成
   */
  private createHeader(): HTMLElement {
    const header = document.createElement("div");
    header.className = "twitter-clean-ui-header";

    const title = document.createElement("h2");
    title.className = "twitter-clean-ui-title";
    title.textContent = t("appName");
    header.appendChild(title);

    const closeButton = document.createElement("button");
    closeButton.className = "twitter-clean-ui-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => this.hide());
    header.appendChild(closeButton);

    return header;
  }

  /**
   * タブを作成
   */
  private createTabs(): HTMLElement {
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "twitter-clean-ui-tabs";

    const tabs = [
      { id: "visibility", label: t("leftSidebarSettings") },
      { id: "rightSidebar", label: t("rightSidebarSettings") },
      { id: "layout", label: t("layoutSettings") },
      { id: "profiles", label: t("profileSettings") },
    ];

    tabs.forEach((tab, index) => {
      const button = document.createElement("button");
      button.className = `twitter-clean-ui-tab ${index === 0 ? "active" : ""}`;
      button.textContent = tab.label;
      button.addEventListener("click", () => {
        // すべてのタブから active クラスを削除
        tabsContainer.querySelectorAll(".twitter-clean-ui-tab").forEach((t) => {
          t.classList.remove("active");
        });
        button.classList.add("active");
        this.showTab(tab.id);
      });
      tabsContainer.appendChild(button);
    });

    return tabsContainer;
  }

  /**
   * タブの内容を表示
   */
  private showTab(tabId: string): void {
    const body = document.getElementById("twitter-clean-ui-body");
    if (!body) return;

    body.innerHTML = "";

    switch (tabId) {
      case "visibility":
        body.appendChild(this.createVisibilityTab());
        break;
      case "rightSidebar":
        body.appendChild(this.createRightSidebarTab());
        break;
      case "layout":
        body.appendChild(this.createLayoutTab());
        break;
      case "profiles":
        body.appendChild(this.createProfilesTab());
        break;
    }
  }

  /**
   * 表示/非表示タブを作成（左サイドバー）
   */
  private createVisibilityTab(): HTMLElement {
    const container = document.createElement("div");

    const settings = this.settingsManager.getSettings();

    // 左サイドバーセクション
    const leftSidebarSection = this.createSection(t("leftSidebarSettings"));

    const leftSidebarElements: UIElementId[] = [
      "leftSidebar_Logo",
      "leftSidebar_HomeLink",
      "leftSidebar_ExploreLink",
      "leftSidebar_NotificationsLink",
      "leftSidebar_ConnectLink",
      "leftSidebar_MessagesLink",
      "leftSidebar_GrokLink",
      "leftSidebar_BookmarksLink",
      "leftSidebar_ListsLink",
      "leftSidebar_CommunitiesLink",
      "leftSidebar_ProfileLink",
      "leftSidebar_PremiumLink",
      "leftSidebar_BusinessLink",
      "leftSidebar_CreatorStudioLink",
      "leftSidebar_MoreMenu",
      "leftSidebar_TweetButton",
      "leftSidebar_ProfileMenu",
    ];

    leftSidebarElements.forEach((elementId) => {
      const visibility = settings.visibility as unknown as Record<
        string,
        boolean
      >;
      const control = this.createToggleControl(
        t(elementId as keyof TranslationKeys),
        visibility[elementId] ?? true,
        (checked) => {
          const partialVisibility: Partial<typeof settings.visibility> = {
            [elementId]: checked,
          };
          this.settingsManager.updateSettings({
            visibility: partialVisibility as typeof settings.visibility,
          });
          if (this.settingsManager.getSettings().enableRealTimePreview) {
            this.controller.applySettings(this.settingsManager.getSettings());
          }
        },
      );
      leftSidebarSection.appendChild(control);
    });

    container.appendChild(leftSidebarSection);

    return container;
  }

  /**
   * 右サイドバータブを作成
   */
  private createRightSidebarTab(): HTMLElement {
    const container = document.createElement("div");
    const settings = this.settingsManager.getSettings();

    const section = this.createSection(t("rightSidebarSettings"));

    const rightSidebarElements: UIElementId[] = [
      "rightSidebar",
      "rightSidebar_SearchBox",
      "rightSidebar_PremiumSubscribe",
      "rightSidebar_TrendsList",
      "rightSidebar_WhoToFollow",
      "rightSidebar_TodayNews",
      "rightSidebar_RelatedAccounts",
      "rightSidebar_Footer",
    ];

    rightSidebarElements.forEach((elementId) => {
      const visibility = settings.visibility as unknown as Record<
        string,
        boolean
      >;
      const control = this.createToggleControl(
        t(elementId as keyof TranslationKeys),
        visibility[elementId] ?? true,
        (checked) => {
          const partialVisibility: Partial<typeof settings.visibility> = {
            [elementId]: checked,
          };
          this.settingsManager.updateSettings({
            visibility: partialVisibility as typeof settings.visibility,
          });
          if (this.settingsManager.getSettings().enableRealTimePreview) {
            this.controller.applySettings(this.settingsManager.getSettings());
          }
        },
      );
      section.appendChild(control);
    });

    container.appendChild(section);
    return container;
  }

  /**
   * レイアウトタブを作成
   */
  private createLayoutTab(): HTMLElement {
    const container = document.createElement("div");
    const settings = this.settingsManager.getSettings();

    const section = this.createSection(t("layoutSettings"));

    // メインコンテンツの幅
    const mainContentControl = this.createSliderControl(
      t("mainContentWidth"),
      settings.layout.mainContentWidth,
      500,
      1200,
      (value) => {
        const partialLayout: Partial<typeof settings.layout> = {
          mainContentWidth: value,
        };
        this.settingsManager.updateSettings({
          layout: partialLayout as typeof settings.layout,
        });
        if (this.settingsManager.getSettings().enableRealTimePreview) {
          this.controller.applySettings(this.settingsManager.getSettings());
        }
      },
    );
    section.appendChild(mainContentControl);

    // タイムラインと右サイドバー間の余白
    const timelinePaddingControl = this.createSliderControl(
      t("timelineRightPadding"),
      settings.layout.timelineRightPadding,
      0,
      100,
      (value) => {
        const partialLayout: Partial<typeof settings.layout> = {
          timelineRightPadding: value,
        };
        this.settingsManager.updateSettings({
          layout: partialLayout as typeof settings.layout,
        });
        if (this.settingsManager.getSettings().enableRealTimePreview) {
          this.controller.applySettings(this.settingsManager.getSettings());
        }
      },
    );
    section.appendChild(timelinePaddingControl);

    // リアルタイムプレビュー
    const previewControl = this.createToggleControl(
      t("enableRealTimePreview"),
      settings.enableRealTimePreview,
      (checked) => {
        this.settingsManager.updateSettings({
          enableRealTimePreview: checked,
        });
        if (checked) {
          this.controller.applySettings(this.settingsManager.getSettings());
        }
      },
    );
    section.appendChild(previewControl);

    container.appendChild(section);
    return container;
  }

  /**
   * プロファイルタブを作成
   */
  private createProfilesTab(): HTMLElement {
    const container = document.createElement("div");

    const section = this.createSection(t("profileSettings"));

    // プロファイル一覧
    const profiles = this.settingsManager.getAllProfiles();
    const currentProfileId = this.settingsManager.getCurrentProfileId();

    const list = document.createElement("ul");
    list.className = "twitter-clean-ui-profile-list";

    profiles.forEach((profile) => {
      const item = document.createElement("li");
      item.className = `twitter-clean-ui-profile-item ${profile.id === currentProfileId ? "active" : ""}`;

      const name = document.createElement("span");
      name.className = "twitter-clean-ui-profile-name";
      name.textContent = profile.name;
      item.appendChild(name);

      const actions = document.createElement("div");
      actions.className = "twitter-clean-ui-profile-actions";

      // 切り替えボタン
      if (profile.id !== currentProfileId) {
        const switchBtn = document.createElement("button");
        switchBtn.className = "twitter-clean-ui-icon-button";
        switchBtn.textContent = "✓";
        switchBtn.title = t("switchProfile");
        switchBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.settingsManager.switchProfile(profile.id);
          this.controller.applySettings(this.settingsManager.getSettings());
          this.showTab("profiles"); // リフレッシュ
        });
        actions.appendChild(switchBtn);
      }

      // 削除ボタン（デフォルトプロファイル以外）
      if (profile.id !== "default") {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "twitter-clean-ui-icon-button";
        deleteBtn.textContent = t("deleteButton");
        deleteBtn.title = t("deleteProfile");
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (
            confirm(t("deleteProfileConfirm").replace("{name}", profile.name))
          ) {
            this.settingsManager.deleteProfile(profile.id);
            this.showTab("profiles"); // リフレッシュ
          }
        });
        actions.appendChild(deleteBtn);
      }

      item.appendChild(actions);
      list.appendChild(item);
    });

    section.appendChild(list);

    // 新規作成ボタン
    const createBtn = document.createElement("button");
    createBtn.className =
      "twitter-clean-ui-button twitter-clean-ui-button-primary";
    createBtn.textContent = t("createNewProfile");
    createBtn.style.marginTop = "12px";
    createBtn.addEventListener("click", () => {
      const name = prompt(t("enterProfileName"));
      if (name) {
        this.settingsManager.createProfile(name);
        this.showTab("profiles"); // リフレッシュ
      }
    });
    section.appendChild(createBtn);

    // エクスポート/インポート
    const exportBtn = document.createElement("button");
    exportBtn.className =
      "twitter-clean-ui-button twitter-clean-ui-button-secondary";
    exportBtn.textContent = t("exportSettings");
    exportBtn.style.marginTop = "12px";
    exportBtn.addEventListener("click", () => {
      const json = this.settingsManager.exportSettings();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `twitter-clean-ui-settings-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
    section.appendChild(exportBtn);

    const importBtn = document.createElement("button");
    importBtn.className =
      "twitter-clean-ui-button twitter-clean-ui-button-secondary";
    importBtn.textContent = t("importSettings");
    importBtn.style.marginTop = "12px";
    importBtn.style.marginLeft = "8px";
    importBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.addEventListener("change", async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          if (this.settingsManager.importSettings(text)) {
            alert(t("importSucceeded"));
            this.controller.applySettings(this.settingsManager.getSettings());
            this.showTab("profiles"); // リフレッシュ
          } else {
            alert(t("importFailed"));
          }
        }
      });
      input.click();
    });
    section.appendChild(importBtn);

    container.appendChild(section);
    return container;
  }

  /**
   * セクションを作成
   */
  private createSection(title: string): HTMLElement {
    const section = document.createElement("div");
    section.className = "twitter-clean-ui-section";

    const titleElement = document.createElement("span");
    titleElement.className = "twitter-clean-ui-section-title";
    titleElement.textContent = title;
    section.appendChild(titleElement);

    return section;
  }

  /**
   * トグルコントロールを作成
   */
  private createToggleControl(
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
  ): HTMLElement {
    const control = document.createElement("div");
    control.className = "twitter-clean-ui-control";

    const labelElement = document.createElement("span");
    labelElement.className = "twitter-clean-ui-label";
    labelElement.textContent = label;
    control.appendChild(labelElement);

    const toggle = document.createElement("div");
    toggle.className = `twitter-clean-ui-toggle ${checked ? "active" : ""}`;

    const slider = document.createElement("div");
    slider.className = "twitter-clean-ui-toggle-slider";
    toggle.appendChild(slider);

    toggle.addEventListener("click", () => {
      const isActive = toggle.classList.toggle("active");
      onChange(isActive);
    });

    control.appendChild(toggle);

    return control;
  }

  /**
   * スライダーコントロールを作成
   */
  private createSliderControl(
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: (value: number) => void,
  ): HTMLElement {
    const control = document.createElement("div");
    control.className = "twitter-clean-ui-control";

    const labelElement = document.createElement("span");
    labelElement.className = "twitter-clean-ui-label";
    labelElement.textContent = label;
    control.appendChild(labelElement);

    const sliderContainer = document.createElement("div");
    sliderContainer.className = "twitter-clean-ui-slider-container";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "twitter-clean-ui-slider";
    slider.min = String(min);
    slider.max = String(max);
    slider.value = String(value);
    sliderContainer.appendChild(slider);

    const valueDisplay = document.createElement("span");
    valueDisplay.className = "twitter-clean-ui-slider-value";
    valueDisplay.textContent = `${value}px`;
    sliderContainer.appendChild(valueDisplay);

    slider.addEventListener("input", () => {
      const newValue = Number(slider.value);
      valueDisplay.textContent = `${newValue}px`;
      onChange(newValue);
    });

    control.appendChild(sliderContainer);

    return control;
  }

  /**
   * フッターを作成
   */
  private createFooter(): HTMLElement {
    const footer = document.createElement("div");
    footer.className = "twitter-clean-ui-footer";

    const resetButton = document.createElement("button");
    resetButton.className =
      "twitter-clean-ui-button twitter-clean-ui-button-danger";
    resetButton.textContent = t("reset");
    resetButton.addEventListener("click", () => {
      if (confirm(t("resetSettingsConfirm"))) {
        this.settingsManager.reset();
        this.controller.applySettings(this.settingsManager.getSettings());
        this.showTab("visibility"); // リフレッシュ
      }
    });
    footer.appendChild(resetButton);

    const closeButton = document.createElement("button");
    closeButton.className =
      "twitter-clean-ui-button twitter-clean-ui-button-secondary";
    closeButton.textContent = t("close");
    closeButton.addEventListener("click", () => this.hide());
    footer.appendChild(closeButton);

    return footer;
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.hide();
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
  }
}
