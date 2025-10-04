const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const node = mutation.addedNodes[i];
      if (!(node instanceof HTMLElement)) continue;

      // 終端要素が追加されたら終端と判断
      if (
        node.querySelector('[data-testid="good-response-turn-action-button"]')
      ) {
        // コールバックが設定されていれば実行
        observerCallback?.();
        return; // 一度通知したらここで終了
      }
    }
  }
});

let observerCallback: (() => void) | null = null;

export function startObserver(onGenerationComplete: () => void): void {
  observerCallback = onGenerationComplete;
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}