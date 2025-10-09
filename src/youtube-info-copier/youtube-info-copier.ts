import { createLogger } from '@/shared/logger';
import { setTrustedInnerHTML } from '@/shared/trusted-html';
import { YouTubeVideoInfo } from '@/shared/types';
import { expandDescriptionIfNeeded } from './dom-utils';
import { TEMPLATE_POLICY_NAME, getTemplate } from './ui';

export class YouTubeInfoCopier {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private handleElement: HTMLDivElement | null = null;
  private panelElement: HTMLDivElement | null = null;
  private popup: HTMLDivElement | null = null;
  private isExpanded = false;
  private expandTimer: number | null = null;
  private logger = createLogger('youtube-info-copier');

  constructor() {
    this.init();
  }

  private init(): void {
    this.createShadowDOM();
    this.setupFullscreenListener();
    this.logger.info('YouTubeInfoCopier initialized.');
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

    this.handleElement.addEventListener('mouseenter', () => this.expandPanel());
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
      switch (action) {
        case 'copy':
          await this.copyVideoInfo();
          break;
        case 'quick-copy':
          await this.copyQuickInfo();
          break;
      }
    } catch (error) {
      this.logger.error('Error handling button click:', error);
    }
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
    const titleElement =
      document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
      document.querySelector('#title h1 yt-formatted-string') ||
      document.querySelector('h1.title');
    const title = titleElement?.textContent?.trim() || 'タイトル不明';

    const channelElement =
      document.querySelector('#owner #channel-name a') ||
      document.querySelector('ytd-channel-name a') ||
      document.querySelector('.ytd-video-owner-renderer a') ||
      document.querySelector('#upload-info #channel-name a') ||
      document.querySelector('#owner-text a');
    const author = channelElement?.textContent?.trim() || '投稿者不明';

    const videoId = new URLSearchParams(window.location.search).get('v') || window.location.pathname.split('/').pop();
    const url = videoId ? `https://youtu.be/${videoId}` : window.location.href;

    await expandDescriptionIfNeeded(2000).catch((err) => this.logger.debug('expandDescriptionIfNeeded failed:', err));

    const descriptionElement = document.querySelector<HTMLElement>('#description');
    let description = '概要取得に失敗しました';
    if (descriptionElement) {
      const spans = descriptionElement.querySelectorAll('span');
      if (spans.length > 0) {
        const textSet = new Set<string>();
        const orderedTexts: string[] = [];
        spans.forEach((span) => {
          const text = (span.textContent || span.innerText || '').trim();
          if (text && !textSet.has(text)) {
            textSet.add(text);
            orderedTexts.push(text);
          }
        });
        description = orderedTexts.join('').trim();
      } else {
        description = (descriptionElement.textContent || descriptionElement.innerText || '').trim();
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
    } catch (error) {
      this.logger.error('コピーエラー:', error);
      this.showErrorFeedback();
    }
  }

  private showSuccessFeedback(): void {
    if (!this.handleElement) return;
    this.handleElement.style.background = 'rgba(76, 175, 80, 0.8)';
    this.handleElement.style.boxShadow = '2px 0 12px rgba(76, 175, 80, 0.4)';
    setTimeout(() => {
      if (this.handleElement) {
        this.handleElement.style.background = '';
        this.handleElement.style.boxShadow = '';
      }
    }, 1500);
  }

  private showErrorFeedback(): void {
    if (!this.handleElement) return;
    this.handleElement.style.background = 'rgba(244, 67, 54, 0.8)';
    this.handleElement.style.boxShadow = '2px 0 12px rgba(244, 67, 54, 0.4)';
    setTimeout(() => {
      if (this.handleElement) {
        this.handleElement.style.background = '';
        this.handleElement.style.boxShadow = '';
      }
    }, 1500);
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
      this.logger.info('YouTubeInfoCopier instance destroyed.');
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }
}
