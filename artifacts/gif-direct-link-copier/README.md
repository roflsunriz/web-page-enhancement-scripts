# GIF直リンクコピーの実ページ確認

2026-10-04、ログイン不要の公開ページを分離Chromeコンテキストで確認。ビルド済みuserscriptをCDPで注入し、実ポインター入力後のシステムクリップボードをボタンのURLと照合しました。userscript manager・実モバイル端末での検証ではありません。

- `live-results.json`: GIPHY、Tenor、Imgurギャラリー・単体・アルバムを1280×900と390×900で確認した10条件。描画DOM、位置、コピーしたURL、成功表示を記録。
- `media-check.json`: ページが実際に公開するURL5本を部分GETし、Content-TypeとGIF89a/ftypを確認。
- PNG: 主要3サイトのPC/モバイル幅でコピー成功した表示。ページは外部サービスの公開コンテンツです。

URLに署名や有効期限が付く場合があり、この時点の応答を記録しています。再確認手順と未検証範囲は../../verification.mdのgif-direct-link-copier節を参照してください。
