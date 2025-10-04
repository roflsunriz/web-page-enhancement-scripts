/**
 * 指定されたセレクターの要素がDOMに表示されるまで待機する
 * @param selector - CSSセレクター
 * @param timeout - タイムアウト時間 (ミリ秒)
 * @returns 見つかった要素を解決するPromise
 */
export function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    // 最初に要素が存在するか確認
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }

    // 要素が見つからない場合、MutationObserverでDOMの変更を監視
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found: ${selector}`));
    }, timeout);

    observer.observe(document.body, { childList: true, subtree: true });
  });
}