import { setIntervalSafely, setTimeoutSafely } from '../util';
import viewerStyles from './viewer.css?inline';

export class LoadingSpinner {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private progressInterval: number | null = null;

  show(message = '画像を読み込み中...'): HTMLDivElement | null {
    try {
      this.hide();

      this.shadowHost = document.createElement('div');
      this.shadowHost.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        z-index: 10000; pointer-events: auto;
      `;

      if (this.shadowHost.attachShadow) {
        this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
      } else {
        this.shadowRoot = this.shadowHost as unknown as ShadowRoot;
      }

      const style = document.createElement('style');
      style.textContent = viewerStyles;
      this.shadowRoot.appendChild(style);

      const spinnerElement = document.createElement('div');
      spinnerElement.className = 'manga-viewer-loading';
      spinnerElement.innerHTML = `
        <div style="position: relative; width: 80px; height: 80px;">
          <div class="mv-spinner"></div>
          <div class="mv-glow-effect" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, rgba(255,107,107,0.3) 0%, rgba(255,107,107,0) 70%);"></div>
        </div>
        <div class="mv-message">${message}</div>
        <div style="width: 200px; height: 4px; background-color: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; margin-top: 20px;">
          <div class="mv-progress-bar" style="width: 0%; height: 100%; background-color: var(--mv-primary, #FF6B6B); border-radius: 2px; transition: width 0.3s ease;"></div>
        </div>
      `;
      this.shadowRoot.appendChild(spinnerElement);

      document.body.appendChild(this.shadowHost);
      this.startProgressAnimation();
      return this.shadowHost;
    } catch (error) {
      console.error('[MangaViewer] Error showing loading spinner:', error);
      return null;
    }
  }

  private startProgressAnimation(): void {
    const progressBar = this.shadowRoot?.querySelector<HTMLDivElement>('.mv-progress-bar');
    if (!progressBar) return;

    let width = 0;
    const maxPreloadWidth = 90;

    this.progressInterval = setIntervalSafely(() => {
      if (width >= maxPreloadWidth) {
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = null;
        return;
      }
      const increment = ((maxPreloadWidth - width) / 100) * 3;
      width = Math.min(width + Math.max(0.1, increment), maxPreloadWidth);
      progressBar.style.width = `${width}%`;
    }, 100);
  }

  setProgress(percent: number): void {
    const progressBar = this.shadowRoot?.querySelector<HTMLDivElement>('.mv-progress-bar');
    if (!progressBar) return;

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    progressBar.style.width = `${percent}%`;
  }

  setComplete(): void {
    this.setProgress(100);
    this.shadowRoot?.querySelector('.manga-viewer-loading')?.classList.add('mv-loading-complete');
    this.shadowRoot?.querySelector('.mv-spinner')?.classList.add('mv-spinner-complete');
  }

  hide(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.shadowHost) {
      this.shadowHost.style.transition = 'opacity 0.3s ease';
      this.shadowHost.style.opacity = '0';
      setTimeoutSafely(() => {
        this.shadowHost?.remove();
        this.shadowHost = null;
        this.shadowRoot = null;
      }, 300);
    }
  }

  updateMessage(message: string, progressPercent: number | null = null): void {
    const messageElement = this.shadowRoot?.querySelector<HTMLDivElement>('.mv-message');
    if (messageElement) {
      messageElement.style.opacity = '0';
      setTimeout(() => {
        messageElement.textContent = message;
        messageElement.style.opacity = '1';
      }, 150);
    }
    if (progressPercent !== null) {
      this.setProgress(progressPercent);
    }
  }
}
