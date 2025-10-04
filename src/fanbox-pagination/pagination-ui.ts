import { styles } from './styles';
import { addStyle } from '@/shared/userscript';

const PAGINATION_SELECTOR = '[class*="Pagination__DesktopWrapper-sc-"]';
const CONTAINER_SELECTOR = '[class*="CreatorPostList__Wrapper-sc-"]';
const TOP_PAGINATION_ID = 'fanbox-pagination-helper-top-pagination';

/**
 * ページネーションのUIを管理するクラス
 */
export class PaginationUI {
  constructor() {
    addStyle(styles);
  }

  /**
   * 上部ページネーションを作成して表示する
   */
  create(): void {
    this.remove();

    const originalPagination = document.querySelector<HTMLElement>(PAGINATION_SELECTOR);
    if (!originalPagination) {
      return;
    }

    const container = document.querySelector<HTMLElement>(CONTAINER_SELECTOR);
    if (!container) {
      return;
    }

    const clone = originalPagination.cloneNode(true) as HTMLElement;
    clone.id = TOP_PAGINATION_ID;
    clone.classList.add('custom-pagination');

    container.insertBefore(clone, container.firstChild);
  }

  /**
   * 既存の上部ページネーションを削除する
   */
  remove(): void {
    document.getElementById(TOP_PAGINATION_ID)?.remove();
  }
}