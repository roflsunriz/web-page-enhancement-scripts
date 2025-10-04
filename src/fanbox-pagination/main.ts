import { PaginationUI } from './pagination-ui';
import { UrlChangeObserver } from './url-change-observer';

const PAGINATION_SELECTOR = '[class*="Pagination__DesktopWrapper-sc-"]';

/**
 * メイン処理
 */
function main() {
  const paginationUI = new PaginationUI();

  const initOrUpdatePagination = () => {
    // ページネーションが表示されるまで待機し、表示されたら上部にも追加する
    // 遷移時に一瞬前のページのが残ることがあるため、少し遅延させる
    setTimeout(() => {
      paginationUI.create();
    }, 500);
  };

  // URLの変更を監視し、変更されたらページネーションを更新する
  const urlObserver = new UrlChangeObserver(initOrUpdatePagination);
  urlObserver.start();

  // MutationObserverでページネーションの出現を監視
  // PAGINATION_SELECTORの要素を監視するように変更
  const target = document.querySelector(PAGINATION_SELECTOR);
  if (target) {
    const observer = new MutationObserver(initOrUpdatePagination);
    observer.observe(target, { childList: true, subtree: true });
  }

  // 初回実行
  initOrUpdatePagination();
}

main();