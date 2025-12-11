/**
 * X/Twitter Auto Spam Reporter - UI管理
 */

import { createLogger } from '@/shared/logger';
import {
  svgAlertOctagon,
  svgCheck,
  svgCheckCircle,
  svgAlertCircle,
  svgAlert,
  svgInformation,
  svgSync,
  svgProcessing,
} from '@/shared/icons/mdi';

const logger = createLogger('x-auto-spam-reporter:ui');

const BUTTON_STYLES = {
  default: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    zIndex: '9999',
    padding: '6px',
    fontSize: '14px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  },
  hover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.6)',
  },
  processing: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    cursor: 'wait',
  },
  done: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
} as const;

const TOAST_STYLES = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '16px 24px',
  background: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  borderRadius: '12px',
  fontSize: '14px',
  zIndex: '99999',
  maxWidth: '400px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
} as const;

const TOAST_COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  processing: '#3b82f6',
  info: '#6b7280',
} as const;

const TOAST_ICONS = {
  info: svgInformation,
  success: svgCheckCircle,
  error: svgAlertCircle,
  warning: svgAlert,
  processing: svgSync,
} as const;

// ボタン用アイコン
const BUTTON_ICONS = {
  default: svgAlertOctagon,
  processing: svgProcessing,
  done: svgCheck,
} as const;

type ToastType = keyof typeof TOAST_ICONS;

export class ReporterUI {
  private toastElement: HTMLElement | null = null;
  private addedButtons: WeakSet<HTMLElement> = new WeakSet();

  /**
   * ツイートに報告ボタンを追加
   */
  public addButtonToTweet(
    tweetElement: HTMLElement,
    onClick: (tweet: HTMLElement, button: HTMLButtonElement) => Promise<void>
  ): void {
    if (this.addedButtons.has(tweetElement)) return;

    const button = document.createElement('button');
    button.innerHTML = BUTTON_ICONS.default;
    button.title = 'スパムとして報告＆ブロック';
    button.className = 'x-auto-spam-reporter-btn';
    Object.assign(button.style, BUTTON_STYLES.default);

    // ホバー効果
    button.addEventListener('mouseenter', () => {
      if (button.dataset['processing'] !== 'true') {
        Object.assign(button.style, BUTTON_STYLES.hover);
      }
    });
    button.addEventListener('mouseleave', () => {
      if (button.dataset['processing'] !== 'true') {
        button.style.transform = '';
        button.style.boxShadow = BUTTON_STYLES.default.boxShadow;
      }
    });

    // ツイート要素をrelative positionに
    const currentPosition = window.getComputedStyle(tweetElement).position;
    if (currentPosition === 'static') {
      tweetElement.style.position = 'relative';
    }

    // クリックイベント
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await onClick(tweetElement, button);
    });

    tweetElement.appendChild(button);
    this.addedButtons.add(tweetElement);
    logger.debug('ボタンを追加しました');
  }

  /**
   * ボタンを処理中状態に変更
   */
  public setButtonProcessing(button: HTMLButtonElement): void {
    button.dataset['processing'] = 'true';
    Object.assign(button.style, BUTTON_STYLES.processing);
    button.innerHTML = BUTTON_ICONS.processing;
  }

  /**
   * ボタンを完了状態に変更
   */
  public setButtonDone(button: HTMLButtonElement): void {
    button.dataset['processing'] = 'false';
    Object.assign(button.style, BUTTON_STYLES.done);
    button.innerHTML = BUTTON_ICONS.done;
    button.disabled = true;
  }

  /**
   * ボタンをデフォルト状態に戻す
   */
  public resetButton(button: HTMLButtonElement): void {
    button.dataset['processing'] = 'false';
    Object.assign(button.style, BUTTON_STYLES.default);
    button.innerHTML = BUTTON_ICONS.default;
  }

  /**
   * トースト通知を表示
   */
  public showToast(message: string, duration: number = 3000, type: ToastType = 'info'): void {
    if (this.toastElement) {
      this.toastElement.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'x-auto-spam-reporter-toast';

    const icon = TOAST_ICONS[type];
    toast.innerHTML = `
      <span style="display: flex; align-items: center;">${icon}</span>
      <span style="white-space: pre-line;">${this.escapeHtml(message)}</span>
    `;

    Object.assign(toast.style, TOAST_STYLES);

    const color = TOAST_COLORS[type];
    if (color) {
      toast.style.borderLeft = `4px solid ${color}`;
    }

    document.body.appendChild(toast);
    this.toastElement = toast;

    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  /**
   * HTMLエスケープ
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * すべてのボタンを削除（ページ遷移時など）
   */
  public removeAllButtons(): void {
    document.querySelectorAll('.x-auto-spam-reporter-btn').forEach((btn) => btn.remove());
    this.addedButtons = new WeakSet();
    logger.debug('すべてのボタンを削除しました');
  }

  /**
   * クリーンアップ
   */
  public destroy(): void {
    this.removeAllButtons();
    document.querySelectorAll('.x-auto-spam-reporter-toast').forEach((el) => el.remove());
    this.toastElement = null;
    logger.debug('UIをクリーンアップしました');
  }
}

