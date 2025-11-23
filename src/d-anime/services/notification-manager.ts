import { ShadowDOMComponent } from "@/d-anime/shadow/shadow-dom-component";
import { ShadowStyleManager } from "@/d-anime/styles/shadow-style-manager";
import type { NotificationType, Notifier } from "@/d-anime/services/notification";

type NotificationHandle = {
  element: HTMLDivElement;
  timerId?: number;
};

const ICON_MAP: Record<NotificationType, string> = {
  success: "✔",
  warning: "⚠",
  error: "✖",
  info: "ℹ",
};

export class NotificationManager
  extends ShadowDOMComponent
  implements Notifier
{
  private static instance: NotificationManager | null = null;
  private static notifications: NotificationHandle[] = [];

  private hostElement: HTMLDivElement | null = null;
  private initialized = false;

  static getInstance(): NotificationManager {
    if (!this.instance) {
      this.instance = new NotificationManager();
    }
    return this.instance;
  }

  static show(
    message: string,
    type: NotificationType = "info",
    duration = 3000,
  ): NotificationHandle | null {
    try {
      const manager = this.getInstance();
      manager.initialize();
      if (!manager.initialized) {
        return null;
      }
      return manager.createNotification(message, type, duration);
    } catch (error) {
      console.error("[NotificationManager] show failed", error);
      return null;
    }
  }

  static removeNotification(handle: NotificationHandle): void {
    const manager = this.getInstance();
    manager.removeNotification(handle.element);
  }

  show(message: string, type: NotificationType = "info"): void {
    NotificationManager.show(message, type);
  }

  initialize(): void {
    if (this.initialized) {
      return;
    }

    try {
      this.hostElement = document.createElement("div");
      this.hostElement.className = "nico-comment-shadow-host notification-host";
      this.hostElement.style.cssText = [
        "position: fixed",
        "top: 0",
        "right: 0",
        "z-index: 2147483647",
        "pointer-events: none",
      ].join(";");
      document.body.appendChild(this.hostElement);

      this.createShadowDOM(this.hostElement);
      this.addStyles(ShadowStyleManager.getNotificationStyles());
      this.setHTML('<div class="notification-container"></div>');

      this.initialized = true;
    } catch (error) {
      console.error("[NotificationManager] initialize failed", error);
      this.initialized = false;
    }
  }

  destroy(): void {
    NotificationManager.notifications.forEach((notif) => {
      if (notif.timerId) {
        window.clearTimeout(notif.timerId);
      }
    });
    NotificationManager.notifications = [];

    if (this.hostElement?.parentNode) {
      this.hostElement.parentNode.removeChild(this.hostElement);
    }
    this.hostElement = null;
    this.initialized = false;
    NotificationManager.instance = null;
  }

  private createNotification(
    message: string,
    type: NotificationType,
    duration: number,
  ): NotificationHandle | null {
    try {
      const container = this.querySelector<HTMLDivElement>(
        ".notification-container",
      );
      if (!container) {
        throw new Error("Notification container not found");
      }

      const iconSymbol = ICON_MAP[type] ?? ICON_MAP.info;

      const notification = document.createElement("div");
      notification.className = `notification-item ${type}`;

      const icon = document.createElement("div");
      icon.className = "notification-icon";
      icon.innerHTML = `<span>${iconSymbol}</span>`;
      notification.appendChild(icon);

      const content = document.createElement("div");
      content.className = "notification-content";

      const typeTitle = document.createElement("div");
      typeTitle.className = "notification-type";
      typeTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      content.appendChild(typeTitle);

      const messageElement = document.createElement("div");
      messageElement.className = "notification-message";
      // HTMLメッセージまたは改行を含むテキストメッセージを表示
      if (message.includes('<')) {
        // HTMLメッセージの場合はそのまま挿入
        messageElement.innerHTML = message || "No message";
      } else {
        // プレーンテキストの場合は改行を<br>タグに変換
        const formattedMessage = (message || "No message")
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('<br>');
        messageElement.innerHTML = formattedMessage;
      }
      content.appendChild(messageElement);

      notification.appendChild(content);

      const closeButton = document.createElement("button");
      closeButton.className = "notification-close";
      closeButton.innerHTML = "&times;";
      closeButton.addEventListener("click", () => {
        this.removeNotification(notification);
      });
      notification.appendChild(closeButton);

      container.appendChild(notification);

      requestAnimationFrame(() => {
        notification.classList.add("show");
      });

      const handle: NotificationHandle = {
        element: notification,
        timerId: window.setTimeout(() => {
          this.removeNotification(notification);
        }, duration),
      };

      NotificationManager.notifications.push(handle);
      return handle;
    } catch (error) {
      console.error("[NotificationManager] createNotification failed", error);
      return null;
    }
  }

  private removeNotification(notification: HTMLElement | null): void {
    if (!notification) {
      return;
    }

    const handle = NotificationManager.notifications.find(
      (item) => item.element === notification,
    );
    if (handle?.timerId) {
      window.clearTimeout(handle.timerId);
    }

    notification.classList.remove("show");

    window.setTimeout(() => {
      try {
        notification.remove();
        NotificationManager.notifications =
          NotificationManager.notifications.filter(
            (item) => item.element !== notification,
          );
      } catch (error) {
        console.error(
          "[NotificationManager] removeNotification cleanup failed",
          error,
        );
      }
    }, 500);
  }
}
