type UrlChangeCallback = () => void;

/**
 * URLの変更を監視し、変更時にコールバックを実行するクラス
 */
export class UrlChangeObserver {
  private lastUrl: string = location.href;
  private callback: UrlChangeCallback;
  private debounceTimer: number | null = null;

  constructor(callback: UrlChangeCallback) {
    this.callback = callback;
  }

  /**
   * URL変更の監視を開始する
   */
  public start(): void {
    // history.pushState/replaceStateをフックしてURL変更を検知
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleUrlChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleUrlChange();
    };

    // ブラウザの「戻る」「進む」ボタンによるURL変更を検知
    window.addEventListener('popstate', () => this.handleUrlChange());
  }

  private handleUrlChange(): void {
    if (this.lastUrl === location.href) return;
    this.lastUrl = location.href;

    // DOMの更新を待つために少し遅延させてコールバックを実行（デバウンス）
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => this.callback(), 500);
  }
}