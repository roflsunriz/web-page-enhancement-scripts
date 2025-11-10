import commonStyles from "@/d-anime/styles/common.css?raw";
import notificationStyles from "@/d-anime/styles/notification.css?raw";
import autoButtonStyles from "@/d-anime/styles/auto-button.css?raw";

export class ShadowStyleManager {
  static getCommonStyles(): string {
    return commonStyles;
  }

  static getNotificationStyles(): string {
    return notificationStyles;
  }

  static getAutoButtonStyles(): string {
    return autoButtonStyles;
  }
}
