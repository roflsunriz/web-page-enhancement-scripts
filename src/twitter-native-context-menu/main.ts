// サイトの処理へ渡さず、ブラウザの既定メニューはそのまま表示する。
window.addEventListener(
  "contextmenu",
  (event) => event.stopImmediatePropagation(),
  true,
);
