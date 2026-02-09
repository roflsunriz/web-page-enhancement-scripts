import { createLogger } from '@/shared/logger';
import { setTrustedInnerHTML } from '@/shared/trusted-html';
import type { YouTubeVideoInfo } from '@/shared/types';
import { expandDescriptionIfNeeded } from './dom-utils';
import { TEMPLATE_POLICY_NAME, getTemplate } from './ui';
import { YOUTUBE_SELECTORS } from '@/shared/constants/youtube';
import { buildYoutubeShortUrl } from '@/shared/constants/urls';
import { FabButton } from '@/shared/ui/fab';
import { svgContentCopy, svgFlash } from '@/shared/icons/mdi';
import type { LaunchStyle } from '@/shared/types/launch-style';

export class YouTubeInfoCopier {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private handleElement: HTMLDivElement | null = null;
  private panelElement: HTMLDivElement | null = null;
  private popup: HTMLDivElement | null = null;
  private isExpanded = false;
  private expandTimer: number | null = null;
  private logger = createLogger('youtube-info-copier');
  private descriptionExpanded = false;
  private preExpandPromise: Promise<void> | null = null;
  private fab: FabButton | null = null;
  private readonly launchStyle: LaunchStyle;

  constructor(launchStyle: LaunchStyle = 'classic') {
    this.launchStyle = launchStyle;
    this.init();
  }

  private init(): void {
    switch (this.launchStyle) {
      case 'classic':
        this.createShadowDOM();
        this.setupFullscreenListener();
        break;
      case 'fab':
        this.createFab();
        break;
      case 'menu-only':
        // UIなし: メニューコマンドから performCopy() を呼び出す
        break;
      default: {
        const _exhaustive: never = this.launchStyle;
        void _exhaustive;
      }
    }
    this.logger.info(`YouTubeInfoCopier initialized (style: ${this.launchStyle})`);
  }

  private createFab(): void {
    this.fab = new FabButton({
      icon: svgContentCopy,
      color: 'rgba(255, 0, 0, 0.9)',
      position: { bottom: '20px', left: '20px' },
      label: 'YouTube動画情報コピー',
      onHover: () => this.preExpandDescription(),
      actions: [
        {
          icon: svgContentCopy,
          label: '動画情報をコピー',
          onClick: () => {
            void this.performCopy('copy');
          },
        },
        {
          icon: svgFlash,
          label: 'タイトル+URLのみ',
          onClick: () => {
            void this.performCopy('quick-copy');
          },
        },
      ],
    });
    this.fab.init();
  }

  /**
   * 外部（メニューコマンド/FAB）から呼び出し可能なコピー実行メソッド
   */
  public async performCopy(action: 'copy' | 'quick-copy'): Promise<void> {
    try {
      if (action === 'copy') {
        await this.ensureDescriptionExpanded();
      }
      switch (action) {
        case 'copy':
          await this.copyVideoInfo();
          break;
        case 'quick-copy':
          await this.copyQuickInfo();
          break;
      }
    } catch (error) {
      this.logger.error('performCopy failed:', error);
    }
  }

  /**
   * 概要欄が展開済みでなければ展開を待つ
   */
  private async ensureDescriptionExpanded(): Promise<void> {
    if (this.descriptionExpanded) return;

    if (!this.preExpandPromise) {
      this.setFabPreparingState();
      this.preExpandPromise = expandDescriptionIfNeeded(5000)
        .then(() => {
          this.descriptionExpanded = true;
          this.setFabReadyState();
        })
        .catch((err: unknown) => {
          this.logger.warn('Description expansion failed:', err);
          this.setFabErrorState();
        });
    }
    await this.preExpandPromise;
  }

  private createShadowDOM(): void {
    this.container = document.createElement('div');
    this.container.id = 'youtube-info-copier-container';
    this.container.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      left: 0px !important;
      z-index: 9999 !important;
      pointer-events: none !important;
    `;

    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });
    setTrustedInnerHTML(this.shadowRoot, getTemplate(), TEMPLATE_POLICY_NAME);
    document.body.appendChild(this.container);

    this.handleElement = this.shadowRoot.querySelector('.control-handle');
    this.panelElement = this.shadowRoot.querySelector('.control-panel');
    this.popup = this.shadowRoot.querySelector('.popup');

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.shadowRoot || !this.handleElement || !this.panelElement || !this.container) return;

    const popupClose = this.shadowRoot.querySelector<HTMLButtonElement>('.popup-close');

    this.handleElement.addEventListener('mouseenter', () => {
      this.expandPanel();
      // パネル展開時に概要欄も事前展開（クリックのユーザーアクティベーション保持のため）
      this.preExpandDescription();
    });
    this.panelElement.addEventListener('mouseenter', () => this.expandPanel());
    this.container.addEventListener('mouseleave', (e) => {
      if (!this.container?.contains(e.relatedTarget as Node)) {
        this.collapsePanel();
      }
    });

    const buttons = this.shadowRoot.querySelectorAll<HTMLButtonElement>('.panel-button');
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleButtonClick(button.dataset.action || '');
      });
    });

    this.handleElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleButtonClick('copy');
      }
    });

    popupClose?.addEventListener('click', () => this.hidePopup());
    document.addEventListener('click', (e) => {
      if (!this.container?.contains(e.target as Node)) {
        this.hidePopup();
      }
    });
  }

  private expandPanel(): void {
    if (!this.isExpanded && this.panelElement && this.container) {
      if (this.expandTimer) clearTimeout(this.expandTimer);
      this.isExpanded = true;
      this.panelElement.classList.add('expanded');
      this.container.style.pointerEvents = 'auto';
    }
  }

  private collapsePanel(): void {
    if (this.isExpanded && this.panelElement && this.container) {
      this.expandTimer = window.setTimeout(() => {
        this.isExpanded = false;
        this.panelElement?.classList.remove('expanded');
        this.container!.style.pointerEvents = 'none';
      }, 1000);
    }
  }

  private async handleButtonClick(action: string): Promise<void> {
    try {
      // 完全コピーの場合は準備完了を確認（classicモード: ボタンクリック時のみ即時チェック）
      if (action === 'copy' && !this.descriptionExpanded) {
        this.logger.info('Description not ready yet, please wait for animation...');
        this.showNotReadyFeedback();
        return;
      }
      
      if (action === 'copy' || action === 'quick-copy') {
        await this.performCopy(action);
      }
    } catch (error) {
      this.logger.error('Error handling button click:', error);
    }
  }

  private preExpandDescription(): void {
    if (this.descriptionExpanded || this.preExpandPromise) {
      return;
    }
    
    this.logger.info('Pre-expanding description...');
    this.setPreparingState();
    this.setFabPreparingState();
    
    this.preExpandPromise = expandDescriptionIfNeeded(5000)
      .then(() => {
        this.descriptionExpanded = true;
        this.setReadyState();
        this.setFabReadyState();
        this.logger.info('Pre-expansion completed - ready to copy!');
      })
      .catch((err: unknown) => {
        this.logger.warn('Pre-expansion failed:', err);
        this.setErrorState();
        this.setFabErrorState();
      });
  }

  // --- Classic mode state management ---

  private setPreparingState(): void {
    if (this.handleElement) {
      this.handleElement.classList.add('preparing');
      this.handleElement.classList.remove('ready', 'error');
    }
  }

  private setReadyState(): void {
    if (this.handleElement) {
      this.handleElement.classList.remove('preparing', 'error');
      this.handleElement.classList.add('ready');
      this.handleElement.setAttribute('data-status', 'ready');
    }
  }

  private setErrorState(): void {
    if (this.handleElement) {
      this.handleElement.classList.remove('preparing', 'ready');
      this.handleElement.classList.add('error');
    }
  }

  private clearState(): void {
    if (this.handleElement) {
      this.handleElement.classList.remove('preparing', 'ready', 'error');
      this.handleElement.removeAttribute('data-status');
    }
  }

  // --- FAB mode state management ---

  private setFabPreparingState(): void {
    this.fab?.setColor('rgba(255, 152, 0, 0.9)');
  }

  private setFabReadyState(): void {
    this.fab?.setColor('rgba(76, 175, 80, 0.9)');
  }

  private setFabErrorState(): void {
    this.fab?.setColor('rgba(244, 67, 54, 0.9)');
  }

  private async copyQuickInfo(): Promise<void> {
    try {
      const info = await this.getVideoInfo();
      const text = `${info.title}\n${info.url}`;
      await navigator.clipboard.writeText(text);
      this.showSuccessFeedback();
    } catch (error) {
      this.logger.error('クイックコピーエラー:', error);
      this.showErrorFeedback();
    }
  }

  private async getVideoInfo(): Promise<YouTubeVideoInfo> {
    const pickFirstElement = (selectors: readonly string[]): HTMLElement | null =>
      selectors
        .map((selector) => document.querySelector<HTMLElement>(selector))
        .find((element): element is HTMLElement => element !== null) ?? null;

    const titleElement = pickFirstElement(YOUTUBE_SELECTORS.titleCandidates);
    const title = titleElement?.textContent?.trim() || 'タイトル不明';

    const channelElement = pickFirstElement(YOUTUBE_SELECTORS.channelCandidates);
    const author = channelElement?.textContent?.trim() || '投稿者不明';

    const videoId = new URLSearchParams(window.location.search).get('v') || window.location.pathname.split('/').pop();
    const url = videoId ? buildYoutubeShortUrl(videoId) : window.location.href;

    // 準備完了状態ならすぐに概要取得、そうでなければエラー
    if (!this.descriptionExpanded) {
      this.logger.warn('getVideoInfo called before description expanded');
    } else {
      this.logger.debug('Description already expanded, fetching immediately');
    }

    let description = '概要取得に失敗しました';
    
    // 展開後のコンテンツを優先的に取得
    for (const selector of YOUTUBE_SELECTORS.descriptionExpandedContent) {
      const expandedElement = document.querySelector<HTMLElement>(selector);
      if (expandedElement) {
        const text = (expandedElement.textContent || expandedElement.innerText || '').trim();
        if (text && text.length > 50) {
          description = text;
          this.logger.debug(`Description found using selector: ${selector}`);
          break;
        }
      }
    }
    
    // フォールバック: 古い方法で取得
    if (description === '概要取得に失敗しました') {
      const descriptionElement = document.querySelector<HTMLElement>(YOUTUBE_SELECTORS.descriptionRoot);
      if (descriptionElement) {
        // #expanded 要素を優先的に探す
        const expandedDiv = descriptionElement.querySelector<HTMLElement>('#expanded');
        if (expandedDiv) {
          const expandedText = (expandedDiv.textContent || expandedDiv.innerText || '').trim();
          if (expandedText && expandedText.length > 50) {
            description = expandedText;
            this.logger.debug('Description found in #expanded div');
          }
        }
        
        // まだ見つからない場合は innerText を使用
        if (description === '概要取得に失敗しました') {
          const fullText = (descriptionElement.innerText || '').trim();
          // "...もっと見る" などのボタンテキストを除去
          const cleanText = fullText
            .replace(/\.\.\.もっと見る\n?/g, '')
            .replace(/一部を表示\n?/g, '')
            .trim();
          if (cleanText && cleanText.length > 10) {
            description = cleanText;
            this.logger.debug('Description found using innerText');
          }
        }
      }
    }

    return { title, author, url, description };
  }

  private async copyVideoInfo(): Promise<void> {
    try {
      const info = await this.getVideoInfo();
      const text = `タイトル：${info.title}\n投稿者名：${info.author}\nURL：${info.url}\n概要：${info.description}`;
      await navigator.clipboard.writeText(text);
      this.showPopup(info.description);
      this.showSuccessFeedback();
      this.logger.info('Video info copied successfully');
    } catch (error) {
      this.logger.error('コピーエラー:', error);
      this.showErrorFeedback();
    }
  }

  private showSuccessFeedback(): void {
    if (this.handleElement) {
      this.clearState();
      this.handleElement.style.background = 'rgba(76, 175, 80, 0.8)';
      this.handleElement.style.boxShadow = '2px 0 12px rgba(76, 175, 80, 0.4)';
      setTimeout(() => {
        if (this.handleElement) {
          this.handleElement.style.background = '';
          this.handleElement.style.boxShadow = '';
        }
      }, 1500);
    } else if (this.fab) {
      this.fab.setColor('rgba(76, 175, 80, 0.9)');
      setTimeout(() => this.fab?.resetColor(), 1500);
    }
  }

  private showErrorFeedback(): void {
    if (this.handleElement) {
      this.clearState();
      this.handleElement.style.background = 'rgba(244, 67, 54, 0.8)';
      this.handleElement.style.boxShadow = '2px 0 12px rgba(244, 67, 54, 0.4)';
      setTimeout(() => {
        if (this.handleElement) {
          this.handleElement.style.background = '';
          this.handleElement.style.boxShadow = '';
        }
      }, 1500);
    } else if (this.fab) {
      this.fab.setColor('rgba(244, 67, 54, 0.9)');
      setTimeout(() => this.fab?.resetColor(), 1500);
    }
  }

  private showNotReadyFeedback(): void {
    if (this.handleElement) {
      this.handleElement.style.background = 'rgba(255, 152, 0, 0.8)';
      this.handleElement.style.boxShadow = '2px 0 12px rgba(255, 152, 0, 0.4)';
      setTimeout(() => {
        if (this.handleElement) {
          this.handleElement.style.background = '';
          this.handleElement.style.boxShadow = '';
        }
      }, 800);
    } else if (this.fab) {
      this.fab.setColor('rgba(255, 152, 0, 0.9)');
      setTimeout(() => this.fab?.resetColor(), 800);
    }
  }

  private showPopup(description: string): void {
    if (!this.shadowRoot || !this.popup) return;
    const popupContent = this.shadowRoot.querySelector<HTMLDivElement>('.popup-content');
    if (popupContent) {
      popupContent.textContent = description;
    }
    this.popup.classList.add('show');
    setTimeout(() => this.hidePopup(), 3000);
  }

  private hidePopup(): void {
    this.popup?.classList.remove('show');
  }

  private handleFullscreenChange = (): void => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
    );
    if (this.container) {
      this.container.style.display = isFullscreen ? 'none' : 'block';
    }
  };

  private setupFullscreenListener(): void {
    const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    fullscreenEvents.forEach((event) => {
      document.addEventListener(event, this.handleFullscreenChange, false);
    });
    this.handleFullscreenChange();
  }

  public destroy(): void {
    try {
      if (this.expandTimer) clearTimeout(this.expandTimer);
      const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
      fullscreenEvents.forEach((event) => document.removeEventListener(event, this.handleFullscreenChange, false));
      this.container?.remove();
      this.fab?.destroy();
      this.fab = null;
      
      // 状態をリセット
      this.descriptionExpanded = false;
      this.preExpandPromise = null;
      
      this.logger.info('YouTubeInfoCopier instance destroyed.');
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }
}
