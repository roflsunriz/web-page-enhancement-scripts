import { setTimeoutSafely } from '@/manga-viewer/util';
import { svgBookOpen, svgPlay, svgRefresh } from '@/shared/icons/mdi';
import { globalState } from '../state';

export class GlassControlPanel {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private handleElement: HTMLDivElement | null = null;
  private panelElement: HTMLDivElement | null = null;
  private containerElement: HTMLDivElement | null = null;
  public isVisible = false;
  private isExpanded = false;
  private isHiddenByFullscreen = false;
  private originalVisibilityState = false;
  private expandTimer: number | null = null;
  private localEventListeners: {
    element: EventTarget;
    event: string;
    handler: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }[];

  constructor() {
    this.localEventListeners = [];
  }

  async init(): Promise<boolean> {
    try {
      this.shadowHost = document.createElement('div');
      this.shadowHost.id = 'manga-viewer-control-panel-host';
      this.shadowHost.style.cssText = `
        position: fixed !important; top: 20px !important; right: 12px !important;
        z-index: 9999 !important; pointer-events: none !important;
      `;
      this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });

      const style = document.createElement('style');
      style.textContent = this.getGlassControlStyles();
      this.shadowRoot.appendChild(style);

      this.containerElement = document.createElement('div');
      this.containerElement.className = 'glass-control-container hidden';
      this.containerElement.innerHTML = `
        <div class="control-handle" aria-label="マンガビューアコントロール" title="マンガビューア"></div>
        <div class="control-panel">
            <div class="panel-header">
                <span class="panel-icon">${svgBookOpen}</span>
                <span class="panel-title">マンガビューア</span>
            </div>
            <div class="panel-content">
                <button class="panel-button primary" data-action="launch">
                    <span class="panel-icon">${svgPlay}</span>
                    ビューア起動
                </button>
                <button class="panel-button" data-action="reanalyze">
                    <span class="panel-icon">${svgRefresh}</span>
                    再分析
                </button>
            </div>
        </div>
      `;
      this.shadowRoot.appendChild(this.containerElement);
      document.body.appendChild(this.shadowHost);

      this.handleElement = this.shadowRoot.querySelector('.control-handle');
      this.panelElement = this.shadowRoot.querySelector('.control-panel');

      this.setupEventListeners();
      this.observeFullscreenChanges();
      this.show();
      return true;
    } catch (error) {
      console.error('[MangaViewer] Error initializing Glass Control Panel:', error);
      return false;
    }
  }

  private addLocalEventListener(
    element: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions = false,
  ) {
    element.addEventListener(event, handler, options);
    this.localEventListeners.push({ element, event, handler, options });
  }

  private setupEventListeners(): void {
    if (!this.handleElement || !this.panelElement || !this.containerElement) return;

    this.addLocalEventListener(this.handleElement, 'mouseenter', () => this.expandPanel());
    this.addLocalEventListener(this.panelElement, 'mouseenter', () => this.expandPanel());
    this.addLocalEventListener(this.containerElement, 'mouseleave', (e) => {
      if (!this.containerElement?.contains((e as MouseEvent).relatedTarget as Node)) {
        this.collapsePanel();
      }
    });

    this.shadowRoot?.querySelectorAll('.panel-button').forEach((button) => {
      this.addLocalEventListener(button, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleButtonClick(button.getAttribute('data-action'));
      });
    });
  }

  private expandPanel(): void {
    if (!this.isExpanded && this.containerElement && !this.containerElement.classList.contains('hidden')) {
      if (this.expandTimer) clearTimeout(this.expandTimer);
      this.isExpanded = true;
      this.panelElement?.classList.add('expanded');
      this.containerElement.style.pointerEvents = 'auto';
    }
  }

  private collapsePanel(): void {
    if (this.isExpanded) {
      this.expandTimer = setTimeoutSafely(() => {
        this.isExpanded = false;
        this.panelElement?.classList.remove('expanded');
        this.containerElement!.style.pointerEvents = 'none';
      }, 1000);
    }
  }

  private async handleButtonClick(action: string | null): Promise<void> {
    if (action === 'launch') {
      await globalState.app?.launch();
      this.hide();
    } else if (action === 'reanalyze') {
      // 再分析の場合もlaunchViewerを呼び出す
      await globalState.app?.launch();
      this.hide();
    }
  }

  private observeFullscreenChanges(): void {
    const handler = () => {
      const isFullscreen = !!document.fullscreenElement;
      if (isFullscreen) {
        if (!this.isHiddenByFullscreen) {
          this.originalVisibilityState = this.isVisible;
          if (this.isVisible) this.hide();
          this.isHiddenByFullscreen = true;
        }
      } else {
        if (this.isHiddenByFullscreen) {
          if (this.originalVisibilityState) this.show();
          this.isHiddenByFullscreen = false;
        }
      }
    };
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(
      (event) => this.addLocalEventListener(document, event, handler),
    );
  }

  show(): void {
    if (this.containerElement && !this.isVisible && !this.isHiddenByFullscreen) {
      this.containerElement.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hide(): void {
    if (this.containerElement && this.isVisible) {
      this.containerElement.classList.add('hidden');
      this.isVisible = false;
    }
  }

  destroy(): void {
    this.localEventListeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.localEventListeners = [];
    if (this.expandTimer) clearTimeout(this.expandTimer);
    this.shadowHost?.remove();
  }

  private getGlassControlStyles(): string {
    return `
      .glass-control-container { position: relative; pointer-events: none; }
      .glass-control-container.hidden { display: none; }
      .control-handle { width: 6px; height: 60px; background: rgba(74, 144, 226, 0.8); backdrop-filter: blur(10px); border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; transition: all 0.3s; pointer-events: auto; position: relative; z-index: 10; box-shadow: -2px 0 8px rgba(74, 144, 226, 0.4); }
      .control-handle:hover { width: 12px; background: rgba(74, 144, 226, 1.0); }
      .control-panel { position: absolute; top: 0; right: 0; min-width: 280px; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); overflow: hidden; opacity: 0; transform: translateX(100%) scale(0.8); transition: all 0.3s; pointer-events: none; z-index: 9; margin-right: 12px; }
      .control-panel.expanded { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
      .panel-header { background: rgba(255, 255, 255, 0.1); padding: 16px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .panel-icon { display: inline-flex; width: 20px; height: 20px; color: rgba(255, 255, 255, 0.9); }
      .panel-icon svg { width: 100%; height: 100%; display: block; }
      .panel-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
      .panel-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
      .panel-button { width: 100%; padding: 12px 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.85); transition: all 0.2s; text-align: left; }
      .panel-button:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateY(-1px); }
      .panel-button.primary { background: rgba(74, 144, 226, 0.2); border-color: rgba(74, 144, 226, 0.3); color: rgba(255, 255, 255, 0.95); }
      .panel-button.primary:hover { background: rgba(74, 144, 226, 0.3); border-color: rgba(74, 144, 226, 0.4); }
      .panel-button .panel-icon { width: 16px; height: 16px; color: currentColor; }
    `;
  }
}
