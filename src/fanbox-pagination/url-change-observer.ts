/**
 * SPAサイトのURL変更を監視するクラス
 */
export class UrlChangeObserver {
  private lastUrl: string;
  private callback: () => void;
  private originalPushState: (data: unknown, unused: string, url?: string | URL | null) => void;
  private originalReplaceState: (data: unknown, unused: string, url?: string | URL | null) => void;

  constructor(callback: () => void) {
    this.lastUrl = location.href;
    this.callback = callback;
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
  }

  /**
   * URLの変更を監視する
   */
  private handleUrlChange = (): void => {
    // 少し遅延させて、DOMの更新を待ってからコールバックを実行
    requestAnimationFrame(() => {
      if (this.lastUrl !== location.href) {
        this.lastUrl = location.href;
        this.callback();
      }
    });
  };

  /**
   * 監視を開始する
   */
  start(): void {
    history.pushState = (...args) => {
      this.originalPushState.apply(history, args);
      this.handleUrlChange();
    };

    history.replaceState = (...args) => {
      this.originalReplaceState.apply(history, args);
      this.handleUrlChange();
    };

    window.addEventListener('popstate', this.handleUrlChange);
  }
}