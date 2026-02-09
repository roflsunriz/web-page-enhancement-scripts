/**
 * 共有FAB（Floating Action Button）コンポーネント
 *
 * Shadow DOMで隔離され、フルスクリーン対応・speed dial対応のFABを提供する。
 */

/** FABのアクション定義 */
export interface FabAction {
  /** SVG icon文字列 */
  icon: string;
  /** ボタンラベル */
  label: string;
  /** クリックハンドラ */
  onClick: () => void;
}

/** FABの位置 */
export interface FabPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

/** FAB設定 */
export interface FabConfig {
  /** SVG icon文字列 */
  icon: string;
  /** アクセントカラー（CSS値） */
  color: string;
  /** 固定位置 */
  position: FabPosition;
  /** アクセシブルラベル */
  label: string;
  /** メインボタンクリック時の処理（actionsが空の場合に使用） */
  onClick?: () => void;
  /** FABメインボタンにホバーした時のコールバック */
  onHover?: () => void;
  /** speed dial アクション一覧（設定すると展開式になる） */
  actions?: FabAction[];
  /** FABのサイズ (px)。既定は56 */
  size?: number;
}

export class FabButton {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private isExpanded = false;
  private expandTimer: number | null = null;
  private readonly config: FabConfig;
  private readonly fabSize: number;

  constructor(config: FabConfig) {
    this.config = config;
    this.fabSize = config.size ?? 56;
  }

  /** FABを生成しDOMに追加する */
  init(): void {
    this.container = document.createElement('div');
    this.container.id = 'fab-container';
    this.container.style.cssText = this.buildPositionStyle();

    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = this.getStyles();
    this.shadowRoot.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'fab-wrapper';
    wrapper.innerHTML = this.buildHTML();
    this.shadowRoot.appendChild(wrapper);

    this.setupEventListeners(wrapper);
    this.setupFullscreenListener();
    document.body.appendChild(this.container);
  }

  /** FABをDOMから削除し、リソースを解放する */
  destroy(): void {
    if (this.expandTimer) clearTimeout(this.expandTimer);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    this.container?.remove();
    this.container = null;
    this.shadowRoot = null;
  }

  /** FABの表示/非表示を切り替える */
  setVisible(visible: boolean): void {
    if (this.container) {
      this.container.style.display = visible ? 'block' : 'none';
    }
  }

  /** FABメインボタンの色を一時的に変更する */
  setColor(color: string): void {
    const mainBtn = this.shadowRoot?.querySelector<HTMLButtonElement>('.fab-main');
    if (mainBtn) {
      mainBtn.style.background = color;
    }
  }

  /** FABメインボタンの色をリセットする */
  resetColor(): void {
    const mainBtn = this.shadowRoot?.querySelector<HTMLButtonElement>('.fab-main');
    if (mainBtn) {
      mainBtn.style.background = '';
    }
  }

  /** FABメインボタンにCSSクラスを追加する */
  addMainClass(className: string): void {
    const mainBtn = this.shadowRoot?.querySelector<HTMLButtonElement>('.fab-main');
    mainBtn?.classList.add(className);
  }

  /** FABメインボタンからCSSクラスを削除する */
  removeMainClass(className: string): void {
    const mainBtn = this.shadowRoot?.querySelector<HTMLButtonElement>('.fab-main');
    mainBtn?.classList.remove(className);
  }

  private buildPositionStyle(): string {
    const { position } = this.config;
    const parts: string[] = [
      'position: fixed !important',
      'z-index: 9999 !important',
      'pointer-events: none !important',
    ];
    if (position.top) parts.push(`top: ${position.top} !important`);
    if (position.bottom) parts.push(`bottom: ${position.bottom} !important`);
    if (position.left) parts.push(`left: ${position.left} !important`);
    if (position.right) parts.push(`right: ${position.right} !important`);
    return parts.join('; ') + ';';
  }

  private buildHTML(): string {
    const hasActions = this.config.actions && this.config.actions.length > 0;

    let actionsHTML = '';
    if (hasActions && this.config.actions) {
      const items = this.config.actions
        .map(
          (action, i) => `
        <div class="fab-speed-dial-item" data-action-index="${String(i)}">
          <span class="fab-speed-dial-label">${this.escapeHTML(action.label)}</span>
          <button class="fab-mini" aria-label="${this.escapeHTML(action.label)}" data-action-index="${String(i)}">
            <span class="fab-icon">${action.icon}</span>
          </button>
        </div>`,
        )
        .join('');
      actionsHTML = `<div class="fab-speed-dial">${items}</div>`;
    }

    return `
      ${actionsHTML}
      <button class="fab-main" aria-label="${this.escapeHTML(this.config.label)}" title="${this.escapeHTML(this.config.label)}">
        <span class="fab-icon">${this.config.icon}</span>
      </button>
    `;
  }

  private setupEventListeners(wrapper: HTMLDivElement): void {
    if (!this.shadowRoot) return;

    const mainBtn = this.shadowRoot.querySelector<HTMLButtonElement>('.fab-main');
    const hasActions = this.config.actions && this.config.actions.length > 0;

    if (mainBtn) {
      // ホバーコールバック（全モード共通）
      if (this.config.onHover) {
        const hoverHandler = this.config.onHover;
        mainBtn.addEventListener('mouseenter', () => hoverHandler());
      }

      if (hasActions) {
        // speed dial モード: ホバーで展開
        mainBtn.addEventListener('mouseenter', () => this.expand());
        mainBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.isExpanded) {
            this.collapse();
          } else {
            this.expand();
          }
        });
      } else if (this.config.onClick) {
        // 単一アクションモード
        const handler = this.config.onClick;
        mainBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handler();
        });
      }
    }

    // speed dial アクションのクリック処理
    if (hasActions && this.config.actions) {
      const actionButtons = this.shadowRoot.querySelectorAll<HTMLButtonElement>('.fab-mini');
      actionButtons.forEach((btn) => {
        const idxStr = btn.dataset['actionIndex'];
        if (idxStr === undefined) return;
        const idx = parseInt(idxStr, 10);
        const action = this.config.actions?.[idx];
        if (action) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            action.onClick();
            this.collapse();
          });
        }
      });
    }

    // コンテナからマウスが離れたら折りたたむ
    wrapper.addEventListener('mouseleave', () => {
      if (this.isExpanded) {
        this.expandTimer = window.setTimeout(() => this.collapse(), 800);
      }
    });
    wrapper.addEventListener('mouseenter', () => {
      if (this.expandTimer) {
        clearTimeout(this.expandTimer);
        this.expandTimer = null;
      }
    });
  }

  private expand(): void {
    if (this.isExpanded) return;
    this.isExpanded = true;
    const dial = this.shadowRoot?.querySelector('.fab-speed-dial');
    dial?.classList.add('expanded');
    const wrapper = this.shadowRoot?.querySelector('.fab-wrapper');
    if (wrapper instanceof HTMLElement) {
      wrapper.style.pointerEvents = 'auto';
    }
  }

  private collapse(): void {
    if (!this.isExpanded) return;
    this.isExpanded = false;
    const dial = this.shadowRoot?.querySelector('.fab-speed-dial');
    dial?.classList.remove('expanded');
    const wrapper = this.shadowRoot?.querySelector('.fab-wrapper');
    if (wrapper instanceof HTMLElement) {
      wrapper.style.pointerEvents = '';
    }
  }

  private readonly handleFullscreenChange = (): void => {
    const isFullscreen = !!document.fullscreenElement;
    if (this.container) {
      this.container.style.display = isFullscreen ? 'none' : 'block';
    }
  };

  private setupFullscreenListener(): void {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
  }

  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private getStyles(): string {
    const { color } = this.config;
    const size = this.fabSize;
    const miniSize = Math.round(size * 0.72);

    return `
      .fab-wrapper {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }

      .fab-main {
        width: ${String(size)}px;
        height: ${String(size)}px;
        border-radius: 50%;
        background: ${color};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        position: relative;
        z-index: 10;
      }

      .fab-main:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .fab-main:active {
        transform: scale(0.95);
      }

      .fab-icon {
        display: inline-flex;
        width: 24px;
        height: 24px;
        color: #fff;
      }

      .fab-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Speed dial */
      .fab-speed-dial {
        position: absolute;
        bottom: ${String(size + 12)}px;
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 10px;
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .fab-speed-dial.expanded {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .fab-speed-dial-item {
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }

      .fab-speed-dial-label {
        background: rgba(33, 33, 33, 0.85);
        backdrop-filter: blur(8px);
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(8px);
        transition: all 0.2s ease;
      }

      .fab-speed-dial.expanded .fab-speed-dial-label {
        opacity: 1;
        transform: translateX(0);
      }

      .fab-mini {
        width: ${String(miniSize)}px;
        height: ${String(miniSize)}px;
        border-radius: 50%;
        background: ${color};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fab-mini:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      }

      .fab-mini .fab-icon {
        width: 18px;
        height: 18px;
      }

      @media (max-width: 768px) {
        .fab-main {
          width: ${String(Math.round(size * 0.85))}px;
          height: ${String(Math.round(size * 0.85))}px;
        }
        .fab-mini {
          width: ${String(Math.round(miniSize * 0.85))}px;
          height: ${String(Math.round(miniSize * 0.85))}px;
        }
        .fab-speed-dial-label {
          font-size: 11px;
          padding: 4px 10px;
        }
      }

      @media (prefers-contrast: high) {
        .fab-main,
        .fab-mini {
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
      }
    `;
  }
}
