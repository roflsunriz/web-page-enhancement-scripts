# 公式JSX runtimeフィクスチャ

- 出典: https://res.sp.nicovideo.jp/web/assets/jsx-runtime-CnDyYxjH.js
- 採取: 2026-10-02、未ログインの公開モバイル視聴ページがロードした資産。
- `official-jsx-runtime.js`: 445 bytes、SHA-256 `cb59b609fe53ba4d97c0003aebd53299b9031336f7738800f99169cc4fcf63d1`。
- コードはReact JSX runtimeの公開配布部分。MITライセンスを `LICENSE.react` に同梱する。認証情報・個人情報・HTML・会員レスポンスは含まない。
- ブラウザ回帰テストはこの実runtimeをnative ESMとして配信し、公式パネル／コントローラーの観測したprops構造を縮小した独自fixtureを接続する。テストが取得前のrender参照を保持できるよう、配信時だけ追加のexportを付ける。保存された公式runtimeの本文は変更しない。

## 任意の実サイト検証

`inspect-active-controller.js` と `open-official-sheet.js` は `scripts/nico-player-premium-controls-live.mjs` がCDPで使用する観測用ヘルパーです。現行Reactツリーを上限付きで読むための独自コードで、配布userscriptには含まれません。Map、Cookie、認証情報は読まず、公開動画のローカル設定と実会員atomのguest判定のみ確認します。

`verification-2026-10-02.json` は分離Chromeで最終版1.0.1を検査した25項目の結果です。導入前後の値保持、レジューム変更での再生成、反転ON/OFF、本編の速度2倍/1倍、実SPA移動後の一致が成功しています。実機の結果ではありません。
