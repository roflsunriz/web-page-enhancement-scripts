# YouTube古い順再生の実測結果

2026-10-13、未ログインの分離ヘッドレスGoogle Chromeで、ビルド済み `youtube-oldest-player.user.js` を実行した。元のブラウザプロファイルや認証は変更していない。

`live-2026-10-13.json` は全件取得数・先頭と最後の動画・成功した操作を記録する。`local58tv-watch.png` と `youtube-watch.png` は連続再生を一時停止し再読み込みした画面。Cookie・認証情報・視聴履歴は収録していない。

再実行は `node scripts/youtube-oldest-player-live.mjs`。チャンネル1件だけの実行は末尾にhandleを指定する。ネットワークが必要で、実際の公開動画の再生・末尾へのシークを行う。録画等のダウンロードやアカウントへの書き込みは行わない。実環境でフィルター・ページ数・動画の公開状態が変わると結果も変わる。
