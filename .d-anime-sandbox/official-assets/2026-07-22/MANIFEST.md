# dアニメストア公式資産 2026-07-22 世代の記録

取得日時: 2026-07-22T23:58:25.273Z。世代更新のたびに日付ディレクトリを切って追加し、
世代間で差分を取って再現スクリプトの汎化に使う。
世代の正本は `test-fixtures/d-anime/official-assets-manifest.json`。

対象ページ: `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=<redacted>`

## chunks/（取得時の生ファイル、ファイル名の `-<v>` が公式 `?v=` 世代）

| ファイル | サイズ | SHA-256（先頭16桁） | 取得元 |
| --- | --- | --- | --- |
| `sc_d_pc-20260514102930.js` | 778 | `80b022798f8218fd` | https://animestore.docomo.ne.jp/animestore/script/pc/sc_d_pc.js?v=20260514102930 |
| `ini-dash-20250801184904.js` | 437925 | `b35535fdd580b417` | https://animestore.docomo.ne.jp/js/cms/ini-dash.js?v=20250801184904 |
| `player.min-20260319174448.js` | 205630 | `99a1886d92e81208` | https://animestore.docomo.ne.jp/js/cms/player.min.js?v=20260319174448 |
| `PlayMovie-20251003175130.js` | 84931 | `5ea4bf236e947215` | https://animestore.docomo.ne.jp/js/PlayMovie.js?v=20251003175130 |

`player.min.js` から `SkipUI` クラス、`initializeSub1st`、`destroyPlayer` を抽出して
`scripts/replay-d-anime-official-phases.mjs` がローカルDOMで再現する
（詳細は `docs/d-anime-player-lifecycle-research.md`）。

## formatted/（prettier で整形した同一ファイル、差分読み用）
