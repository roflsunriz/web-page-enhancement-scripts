import type {
  YoutubeUiModifierSettingId,
  YoutubeUiModifierSettings,
  YoutubeUiModifierSettingsChangeHandler,
} from "@/shared/types";
import { t } from "./i18n";

type RevealBoxConfig = {
  boxId: string;
  containerSelector: string;
  enabledSetting: YoutubeUiModifierSettingId;
  revealSetting: YoutubeUiModifierSettingId;
  targetSetting: YoutubeUiModifierSettingId;
  shouldShow: (settings: YoutubeUiModifierSettings) => boolean;
};

const REVEAL_BOXES: ReadonlyArray<RevealBoxConfig> = [
  {
    boxId: "youtube-ui-modifier-homepage-reveal",
    containerSelector: "ytd-page-manager",
    enabledSetting: "showHomepageRevealBox",
    revealSetting: "showHomepageRevealBox",
    targetSetting: "hideHomepageSuggestions",
    shouldShow: (settings) => settings.hideHomepageSuggestions,
  },
  {
    boxId: "youtube-ui-modifier-sidebar-reveal",
    containerSelector: "#secondary-inner",
    enabledSetting: "showSidebarRevealBox",
    revealSetting: "showSidebarRevealBox",
    targetSetting: "hideWatchSidebar",
    shouldShow: (settings) => settings.hideWatchSidebar,
  },
  {
    boxId: "youtube-ui-modifier-endscreen-reveal",
    containerSelector: "#movie_player",
    enabledSetting: "showEndScreenRevealBox",
    revealSetting: "showEndScreenRevealBox",
    targetSetting: "hideEndScreen",
    shouldShow: (settings) =>
      settings.hideEndScreen &&
      document.querySelector("#movie_player.ended-mode") !== null,
  },
];

export class RevealBoxManager {
  private readonly closedBoxIds = new Set<string>();

  public apply(
    settings: YoutubeUiModifierSettings,
    onSettingChange: YoutubeUiModifierSettingsChangeHandler,
  ): void {
    if (!settings.globalEnabled) {
      this.removeAll();
      return;
    }

    REVEAL_BOXES.forEach((config) => {
      if (
        !settings[config.enabledSetting] ||
        !config.shouldShow(settings) ||
        this.closedBoxIds.has(config.boxId)
      ) {
        document.getElementById(config.boxId)?.remove();
        return;
      }

      this.ensureBox(config, onSettingChange);
    });
  }

  private ensureBox(
    config: RevealBoxConfig,
    onSettingChange: YoutubeUiModifierSettingsChangeHandler,
  ): void {
    if (document.getElementById(config.boxId)) {
      return;
    }

    const container = document.querySelector(config.containerSelector);
    if (!container) {
      return;
    }

    const box = document.createElement("div");
    box.id = config.boxId;
    box.className = "youtube-ui-modifier-reveal-box";

    const actions = document.createElement("div");
    actions.className = "youtube-ui-modifier-reveal-actions";

    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.textContent = t("dismissReveal");
    dismiss.addEventListener("click", () => {
      onSettingChange(config.revealSetting, false);
      box.remove();
    });
    actions.appendChild(dismiss);

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "x";
    close.addEventListener("click", () => {
      this.closedBoxIds.add(config.boxId);
      box.remove();
    });
    actions.appendChild(close);

    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "youtube-ui-modifier-reveal-primary";
    reveal.textContent = t("revealRecommendations");
    reveal.addEventListener("click", () => {
      onSettingChange(config.targetSetting, false);
      box.remove();
    });

    box.appendChild(actions);
    box.appendChild(reveal);
    container.appendChild(box);
  }

  private removeAll(): void {
    REVEAL_BOXES.forEach((config) =>
      document.getElementById(config.boxId)?.remove(),
    );
  }
}
