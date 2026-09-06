# dアニメストア公式資産（世代管理）

`scripts/capture-d-anime-official-assets.mjs` がログイン済み Chrome（raw CDP）から
取得した公式 JavaScript を保管する。Git 管理対象。

## 配置

- `<basename>-<v>.js`: 取得時の生ファイル。`<v>` は公式 URL の `?v=` 値。
- `formatted/`: prettier（babel）で整形した同一ファイル。差分読み用。
- 世代の正本は `test-fixtures/d-anime/official-assets-manifest.json`
  （ファイル名・サイズ・SHA-256・取得日時・取得元 URL）。
  `scripts/replay-d-anime-official-phases.mjs` は実行前に SHA-256 を照合する。

## 世代管理の方針

- 公式更新時は取得スクリプトを再実行する。新 `?v=` は新ファイルとして追加され、
  マニフェストが更新される。旧世代ファイルは消さずに残す。
- 世代の履歴は Git のコミット履歴で辿る。差分確認には `formatted/` を使う。
- 認証情報、Cookie、作品名、作品・話数の識別子、動画 URL はここへ保存しない
  （取得スクリプトと調査境界 `docs/d-anime-player-lifecycle-research.md` に従う）。
