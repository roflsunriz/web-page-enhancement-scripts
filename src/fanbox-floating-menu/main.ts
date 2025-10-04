import { FloatingMenuUI } from './floating-menu-ui';
import { UrlChangeObserver } from './url-change-observer';
import { waitForElement } from './wait-for-element';

const ORIGINAL_MENU_SELECTOR = '[class*="FooterLinks__Wrapper-sc-"]';

/**
 * メイン処理
 */
async function main() {
  const menuUI = new FloatingMenuUI();

  /**
   * メニューを初期化または更新する
   */
  const initOrUpdateMenu = async () => {
    try {
      // Fanboxのフッターにある元のメニューが表示されるのを待つ
      const originalMenu = await waitForElement(ORIGINAL_MENU_SELECTOR);
      // 元のメニューを元にフローティングメニューを作成・表示する
      menuUI.create(originalMenu);
    } catch (error) {
      // 要素が見つからなかった場合などは、既存のメニューを削除する
      menuUI.remove();
      console.error('[Fanbox Floating Menu] Could not display floating menu:', (error as Error).message);
    }
  };

  // URLの変更を監視し、変更されたらメニューを更新する
  const urlObserver = new UrlChangeObserver(initOrUpdateMenu);
  urlObserver.start();

  // スクリプト読み込み時に初回実行
  initOrUpdateMenu();
}

main();