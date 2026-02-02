# AGENTS.md is a file that contains the rules for the agents.

## ルール
- 常に日本語で応答してください。
- powershellでファイルの読み書きをする代わりにネイティブツールを使用するようにしてください。
- ファイル名の命名規則はケバブケースです。
- 編集完了後に品質確認を行ってください。具体的には、bun lint, bun type-check, bun buildをこの順番で実行してください。
- エラーがないことを確認してください。エラーがある場合は修正してください。
- ビルドが成功したことを確認してください。ビルドが成功しない場合は修正してください。
- 型`any`を使用しないでください。`unknown`か、より具体的な型を使用してください。常に具体的な型を利用することを心がけてください。
- src/d-animeはd-anime-nico-comment-renderer.user.jsを編集するためのプロジェクトです。
- src/chatgpt-notifyはchatgpt-notify.user.jsを編集するためのプロジェクトです。
- src/fanbox-floating-menuはfanbox-floating-menu.user.jsを編集するためのプロジェクトです。
- src/fanbox-pagination-helperはfanbox-pagination-helper.user.jsを編集するためのプロジェクトです。
- src/image-collectorはimage-collector.user.jsを編集するためのプロジェクトです。
- src/imgur-direct-linkはimgur-direct-link.user.jsを編集するためのプロジェクトです。
- src/manga-viewerはbook-style-manga-viewer.user.jsを編集するためのプロジェクトです。
- src/twitter-clean-timelineはtwitter-clean-timeline.user.jsを編集するためのプロジェクトです。
- src/twitter-clean-uiはtwitter-clean-ui.user.jsを編集するためのプロジェクトです。
- src/twitter-full-size-imageはtwitter-full-size-image.user.jsを編集するためのプロジェクトです。
- src/twitter-thread-copierはtwitter-thread-copier.user.jsを編集するためのプロジェクトです。
- src/youtube-info-copierはyoutube-info-copier.user.jsを編集するためのプロジェクトです。
- src/vite.config.tsは各プロジェクトのビルド設定を行っています。ここにバージョン情報もあります。
- ビルドする前にsrc/vite.config.tsを編集しバージョンを上げてください。
- src/d-anime/config/default-settings.tsにユーザースクリプトのバージョン情報(USERSCRIPT_VERSION_UI_DISPLAY)があります。ここもバージョンを上げて、ビルドする前に編集してください。必ずsrc/vite.config.tsで指定しているバージョン情報と一致させてください。USERSCRIPT_VERSION_UI_DISPLAYはd-anime-nico-comment-rendererユーザースクリプトのバージョンです。また、ユーザーが実際に目にするUIに表示されるバージョン情報です。
- バージョンアップの目安は、パッチ(v.x.y.zのz部分)が軽微なバグフィックス、マイナー(v.x.y.zのy部分)が機能追加、メジャー(v.x.y.zのx部分)が大幅な機能追加や破壊的変更です。