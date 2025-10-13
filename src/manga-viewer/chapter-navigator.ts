import { MANGA_NAVIGATION_SELECTORS } from '@/shared/constants/manga';

export class ChapterNavigator {
  private prevChapterSelectors: string[];
  private nextChapterSelectors: string[];
  public isNavigating = false;

  constructor() {
    this.prevChapterSelectors = [
      ...MANGA_NAVIGATION_SELECTORS.defaultPrev,
    ];
    this.nextChapterSelectors = [
      ...MANGA_NAVIGATION_SELECTORS.defaultNext,
    ];

    // nicomanga系ドメイン向けの優先セレクタを先頭に追加
    const h = location.hostname;
    const isNicoManga = /nicomanga\.com$/.test(h) || /nico.*manga/.test(h);
    if (isNicoManga) {
      this.prevChapterSelectors.unshift(
        ...MANGA_NAVIGATION_SELECTORS.nicoPrevPriority,
      );
      this.nextChapterSelectors.unshift(
        ...MANGA_NAVIGATION_SELECTORS.nicoNextPriority,
      );
    }
  }

  // 汎用フォールバック（最後に走る簡易ヒューリスティクス）
  private _fallbackFind(dir: 'next' | 'prev'): string | null {
    try {
      // 1) <link rel="next|prev">
      const link = document.querySelector<HTMLLinkElement>(`link[rel="${dir}"]`);
      if (link && link.href) return link.href;
      // 2) rel付きの <a>
      const relA = document.querySelector<HTMLAnchorElement>(`a[rel="${dir}"]`);
      if (relA && relA.href) return relA.href;
      // 3) テキスト・矢印で推定
      const patterns =
        dir === 'next'
          ? [/^\s*(次|next|›|»)\s*$/i, /(次|next|›|»)/i]
          : [/^\s*(前|prev|‹|«)\s*$/i, /(前|prev|‹|«)/i];
      const candidates = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
      for (const a of candidates) {
        const t = (a.textContent || '').trim();
        if (patterns.some((re) => re.test(t))) return a.href;
      }
      return null;
    } catch {
      return null;
    }
  }

  private navigate(direction: 'prev' | 'next'): boolean {
    const selectors = direction === 'prev' ? this.prevChapterSelectors : this.nextChapterSelectors;
    try {
      for (const selector of selectors) {
        const button = document.querySelector<HTMLElement & { href?: string }>(selector);
        if (button) {
          try {
            localStorage.setItem('mangaViewer_autoLaunch', 'true');
          } catch {
            // Ignore potential security errors if localStorage is disabled.
          }
          if (button.href) {
            window.location.assign(button.href);
            return true;
          }
          button.click();
          return true;
        }
      }
      // フォールバック
      const fallbackUrl = this._fallbackFind(direction);
      if (fallbackUrl) {
        try {
          localStorage.setItem('mangaViewer_autoLaunch', 'true');
        } catch {
          // Ignore potential security errors if localStorage is disabled.
        }
        window.location.assign(fallbackUrl);
        return true;
      }
      console.warn(`[MangaViewer] navigate${direction === 'prev' ? 'Prev' : 'Next'}Chapter: no button found`);
      return false;
    } catch (e) {
      console.warn(`[MangaViewer] navigate${direction === 'prev' ? 'Prev' : 'Next'}Chapter: error:`, e);
      return false;
    }
  }

  /**
   * 前のチャプターへ移動する
   * @returns {boolean} 移動が成功したかどうか
   */
  public navigatePrevChapter(): boolean {
    return this.navigate('prev');
  }

  /**
   * 次のチャプターへ移動する
   * @returns {boolean} 移動が成功したかどうか
   */
  public navigateNextChapter(): boolean {
    return this.navigate('next');
  }

  /**
   * チャプター移動中かどうかをチェックし、移動中であればビューアを自動起動する
   * @returns {boolean} ビューアを自動起動する必要があるかどうか
   */
  public checkAutoLaunch(): boolean {
    try {
      const shouldAutoLaunch =
        localStorage.getItem('mangaViewer_autoLaunch') === 'true';
      if (shouldAutoLaunch) {
        try {
          // フラグをリセット
          localStorage.removeItem('mangaViewer_autoLaunch');
        } catch (storageError) {
          console.error(
            '[MangaViewer] checkAutoLaunch: failed to remove localStorage flag:',
            storageError,
          );
          // localStorage操作が失敗してもtrueを返す（自動起動は実行）
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        '[MangaViewer] checkAutoLaunch: unexpected error:',
        error,
      );
      return false;
    }
  }
}
