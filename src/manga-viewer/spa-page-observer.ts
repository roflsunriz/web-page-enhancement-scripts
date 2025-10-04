import { addEventListenerSafely, setIntervalSafely, setTimeoutSafely } from './util';

export type PageChangeInfo = {
  previousUrl: string;
  currentUrl: string;
  previousPageType: PageType;
  currentPageType: PageType;
};

export type PageType = 'twitter-status' | 'twitter-general' | 'generic';

export type SPAObserverCallback = (changeInfo: PageChangeInfo) => void;

// SPAページ変更検出システム
export class SPAPageObserver {
  private currentUrl: string = window.location.href;
  private currentPageType: PageType = this.determineCurrentPageType();
  private observers: SPAObserverCallback[] = [];
  private isObserving = false;
  private urlCheckInterval: number | null = null;

  // 現在のページタイプを判定
  private determineCurrentPageType(): PageType {
    const url = window.location.href;

    if (
      (url.includes('twitter.com') || url.includes('x.com')) &&
      url.includes('/status/')
    ) {
      return 'twitter-status';
    } else if (
      url.includes('twitter.com') ||
      url.includes('x.com')
    ) {
      return 'twitter-general';
    } else {
      return 'generic';
    }
  }

  // URL変更の監視を開始
  public startObserving(): void {
    if (this.isObserving) return;

    // history API のオーバーライド
    this.wrapHistoryAPI();

    // popstate イベントの監視
    addEventListenerSafely(window, 'popstate', () => {
      this.checkForUrlChange();
    });

    // 定期的なURL変更チェック（フォールバック）
    this.urlCheckInterval = setIntervalSafely(() => {
      this.checkForUrlChange();
    }, 1000);

    this.isObserving = true;
  }

  // history APIをラップして変更を検出
  private wrapHistoryAPI(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history.pushState = (...args: [data: any, unused: string, url?: string | URL | null]) => {
      originalPushState.call(history, ...args);
      setTimeoutSafely(() => this.checkForUrlChange(), 100);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history.replaceState = (...args: [data: any, unused: string, url?: string | URL | null]) => {
      originalReplaceState.call(history, ...args);
      setTimeoutSafely(() => this.checkForUrlChange(), 100);
    };
  }

  // URL変更のチェック
  private checkForUrlChange(): void {
    const newUrl = window.location.href;
    const newPageType = this.determineCurrentPageType();

    if (newUrl !== this.currentUrl || newPageType !== this.currentPageType) {
      const changeInfo: PageChangeInfo = {
        previousUrl: this.currentUrl,
        currentUrl: newUrl,
        previousPageType: this.currentPageType,
        currentPageType: newPageType,
      };

      this.currentUrl = newUrl;
      this.currentPageType = newPageType;

      // オブザーバーに通知
      this.notifyObservers(changeInfo);
    }
  }

  // オブザーバーの追加
  public addObserver(callback: SPAObserverCallback): void {
    if (typeof callback === 'function') {
      this.observers.push(callback);
    }
  }

  // オブザーバーの削除
  public removeObserver(callback: SPAObserverCallback): void {
    this.observers = this.observers.filter((obs) => obs !== callback);
  }

  // オブザーバーに通知
  private notifyObservers(changeInfo: PageChangeInfo): void {
    this.observers.forEach((callback) => {
      try {
        callback(changeInfo);
      } catch (error) {
        console.error('[MangaViewer] Error in SPA observer callback:', error);
      }
    });
  }

  // 監視停止
  public stopObserving(): void {
    if (this.urlCheckInterval) {
      clearInterval(this.urlCheckInterval);
      this.urlCheckInterval = null;
    }
    this.isObserving = false;
  }

  // 現在のページタイプを取得
  public getCurrentPageType(): PageType {
    return this.currentPageType;
  }

  // Twitter状態ページかどうか判定
  public isTwitterStatusPage(): boolean {
    return this.currentPageType === 'twitter-status';
  }
}
