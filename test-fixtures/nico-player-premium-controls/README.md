# 公式JSX runtimeフィクスチャ

- 出典: https://res.sp.nicovideo.jp/web/assets/jsx-runtime-CnDyYxjH.js
- 採取: 2026-10-02、未ログインの公開モバイル視聴ページがロードした資産。
- `official-jsx-runtime.js`: 445 bytes、SHA-256 `cb59b609fe53ba4d97c0003aebd53299b9031336f7738800f99169cc4fcf63d1`。
- コードはReact JSX runtimeの公開配布部分。MITライセンスを `LICENSE.react` に同梱する。認証情報・個人情報・HTML・会員レスポンスは含まない。
- ブラウザ回帰テストはこの実runtimeをnative ESMとして配信し、公式パネル／コントローラーの観測したprops構造を縮小した独自fixtureを接続する。テストが取得前のrender参照を保持できるよう、配信時だけ追加のexportを付ける。保存された公式runtimeの本文は変更しない。

## 初期化関数をexportする公式runtime（2026-10-12）

- 出典: https://res.sp.nicovideo.jp/assets/jsx-runtime-aIqNzS8k.js
- `official-jsx-runtime-lazy.js`: 430 bytes、SHA-256 `2d6482dde8e7a314bdcefc17e07e7dc56ea3db662d2d735d56faed57002922c3`。未ログイン公開モバイル視聴ページがロードした本文をそのまま保存した。React部分のMITライセンスは同梱の `LICENSE.react` を参照。
- 現行モジュールはexport `t`が関数であり、呼び出すとキャッシュされた `jsx` / `jsxs` オブジェクトを返す。旧モジュールのexport `j`は直接オブジェクトだった。配布コードはこれらの名前へ依存しない。
- 相対import先の `components-CpcYECLb.js` はオフライン検査ではfixture独自のキャッシュ付きCommonJS初期化helperへ差し替える。公式vendorバンドル全体は同梱しない。runtime本文は変更せず、配信時だけ元のrender参照を検証するexportを追加する。
- `scripts/nico-player-premium-controls-regression.mjs` は旧/新runtime、読み込み時/後から注入、390×844/844×390の8条件で、合計204項目を検査する。両スワイプ配布物との併用も同じ204項目を検査する。

## 任意の実サイト検証

`inspect-active-controller.js` と `open-official-sheet.js` は `scripts/nico-player-premium-controls-live.mjs` がCDPで使用する観測用ヘルパーです。現行Reactツリーを上限付きで読むための独自コードで、配布userscriptには含まれません。Map、Cookie、認証情報は読まず、公開動画のローカル設定と実会員atomのguest判定のみ確認します。

`verification-2026-10-02.json` は分離Chromeで最終版1.0.1を検査した25項目の結果です。導入前後の値保持、レジューム変更での再生成、反転ON/OFF、本編の速度2倍/1倍、実SPA移動後の一致が成功しています。実機の結果ではありません。
