import { FANBOX_SELECTORS } from '@/shared/constants/fanbox';

const CONTAINER_ID = 'fanbox-floating-menu-container';

/**
 * フローティングメニューのUIを管理するクラス
 */
export class FloatingMenuUI {
  private container: HTMLElement | null = null;

  /**
   * メニューを削除する
   */
  public remove(): void {
    this.container?.remove();
    this.container = null;
  }

  /**
   * 元のメニュー要素からフローティングメニューを作成して表示する
   * @param originalMenu - クローンの元となるメニュー要素
   */
  public create(originalMenu: Element): void {
    // 既存のメニューがあれば削除
    this.remove();

    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    this.container = container;

    // Shadow DOMを作成し、外部のCSSの影響を受けないようにする
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = this.getStyle();

    const menuClone = originalMenu.cloneNode(true) as HTMLElement;
    menuClone.classList.add('floating-menu');

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(menuClone);

    document.body.appendChild(container);
  }

  /**
   * Shadow DOM内に適用するスタイル定義を取得する
   * @returns CSSスタイル文字列
   */
  private getStyle(): string {
    const { footerPrevLink, footerNextLink } = FANBOX_SELECTORS;
    return `
      .floating-menu {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 0 5px 5px 0;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
      }
      .floating-menu a,
      .floating-menu ${footerPrevLink},
      .floating-menu ${footerNextLink} {
          padding: 5px 10px;
          border-radius: 3px;
          text-decoration: none;
          color: #333;
          transition: background-color 0.2s;
      }
      .floating-menu a:hover,
      .floating-menu ${footerPrevLink}:hover,
      .floating-menu ${footerNextLink}:hover {
          background-color: rgba(0,0,0,0.1);
      }
    `;
  }
}
