# GIF直リンクコピーの公開ページfixture

`public-pages.json` は2026-10-04にログインなしで採取したGIPHY 2件、Tenor 2件、Imgur 1件から、抽出に必要なOG・JSON-LD・現在メディアURL・Tenor media_formatsだけを縮約したものです。ページの実行コード・APIキー・Cookieは含みません。出典URLは各レコードの `url`、追加条件・実媒体検証は `verification.md` を参照してください。

`extract.test.mjs` はこのfixtureと明示的な境界ケースを使用します。ブラウザ回帰は観測した `data-giphy-id` / `.Gif` / Imgur固定高さの `.VirtualList--item` と `.Gallery-Content--mediaContainer` を再現し、すべての外部通信をfixtureまたは空応答で充足します。テスト上の新媒体・不正URLは合成ケースで、実在する媒体として扱いません。
