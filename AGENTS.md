# AGENTS.md

共通ルールは `COMMON-AGENTS.md` を必ず確認し、上位方針として扱う。
このファイルでは `web-page-enhancement-scripts` 固有の補足だけを記載する。

## ルール

- PowerShellでファイルの読み書きをする代わりに、可能な限り編集用のネイティブツールを使用する。
- 変更（コミット）ごとにバージョンを上げる。
- ファイル名の命名規則はケバブケース。
- 型 `any` を使用しない。`unknown` か、より具体的な型を使用し、常に具体的な型を利用する。
- 新規スクリプト追加時は `scripts/build-all.mjs`、`vite.config.ts`、`README.md`、`userscripts.md` も更新する。

## プロジェクト構成

- `src/d-anime` は `d-anime-nico-comment-renderer.user.js` を編集するためのプロジェクト。
- `src/d-anime-cf-ranking` は `d-anime-cf-ranking.user.js` を編集するためのプロジェクト。
- `src/chatgpt-notify` は `chatgpt-notify.user.js` を編集するためのプロジェクト。
- `src/fanbox-floating-menu` は `fanbox-floating-menu.user.js` を編集するためのプロジェクト。
- `src/fanbox-pagination-helper` は `fanbox-pagination-helper.user.js` を編集するためのプロジェクト。
- `src/image-collector` は `image-collector.user.js` を編集するためのプロジェクト。
- `src/imgur-direct-link` は `imgur-direct-link.user.js` を編集するためのプロジェクト。
- `src/manga-viewer` は `book-style-manga-viewer.user.js` を編集するためのプロジェクト。
- `src/twitter-clean-timeline` は `twitter-clean-timeline.user.js` を編集するためのプロジェクト。
- `src/twitter-clean-ui` は `twitter-clean-ui.user.js` を編集するためのプロジェクト。
- `src/twitter-full-size-image` は `twitter-full-size-image.user.js` を編集するためのプロジェクト。
- `src/twitter-thread-copier` は `twitter-thread-copier.user.js` を編集するためのプロジェクト。
- `src/youtube-info-copier` は `youtube-info-copier.user.js` を編集するためのプロジェクト。
- `scripts/build-all.mjs` はすべてのプロジェクトをビルドするためのスクリプト。`vite.config.ts` の build コマンド `bun run build` はこのスクリプトを実行している。
- ルートディレクトリの `vite.config.ts` は各プロジェクトのビルド設定を行っている。ここにバージョン情報もある。
- `docs` フォルダには開発チェックリストや実際のWebページのコードスニペット、ニコニコ動画のAPI仕様書などがある。

## バージョン管理

- ビルドする前に `vite.config.ts` を編集しバージョンを上げる。
- `src/d-anime/config/default-settings.ts` にユーザースクリプトのバージョン情報 `USERSCRIPT_VERSION_UI_DISPLAY` がある。ここもバージョンを上げて、ビルドする前に編集する。
- `USERSCRIPT_VERSION_UI_DISPLAY` はルートディレクトリの `vite.config.ts` で指定しているバージョン情報と必ず一致させる。
- バージョンアップの目安は、パッチ（v.x.y.z の z 部分）が軽微なバグフィックス、マイナー（v.x.y.z の y 部分）が機能追加、メジャー（v.x.y.z の x 部分）が大幅な機能追加や破壊的変更。
