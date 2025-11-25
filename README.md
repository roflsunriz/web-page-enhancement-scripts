web-page-enhancement-scripts
================================
[![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml/badge.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml)
[![Lint](https://img.shields.io/badge/lint-eslint9-blue?logo=eslint&logoColor=white)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript%205.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/pulls)
[![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/ci.yaml/badge.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/ci.yaml)


これは複数のウェブページ向けユーザースクリプト（Tampermonkey / Greasemonkey）を管理するリポジトリです。TypeScript と Vite を用いて開発され、`dist/` にビルド済みの userscript（`.user.js` / `.meta.js`）が出力されます。

プロジェクト構成（概要）
-----------------------

- `src/` — 各ユーザースクリプトのソースコード。サブディレクトリごとに機能を分離。
  - `chatgpt-notify/` — 生成完了通知（ChatGPT 連携想定）
  - `d-anime/` — dアニメ向けニコニコ動画コメントレンダリングスクリプト
  - `image-collector/` — ページ内画像の一括収集・ZIP ダウンロード
  - `imgur-direct-link/` — Imgur 画像の直接リンク取得
  - `manga-viewer/` — 漫画・画像閲覧ブックスタイルビューア（React コンポーネント含む）
  - `twitter-*` 系 — Twitter 関連の各種ユーティリティ（画像、フィルタ、スレッドコピー等）
  - `youtube-info-copier/` — YouTube の動画情報をコピーするツール
- `shared/` — DOM ヘルパー、GM HTTP、ロガー、共通型定義などのユーティリティ
- `dist/` — ビルド済みの userscript（配布用）

各種ユーザースクリプトの説明は[userscripts.md](userscripts.md)を参照してください。

ユーザースクリプトのサブスクライブ
----------------------
リンクをクリックすることでTampermonkeyが自動的にインストールウィンドウを開き、インストールを行うことができます。

- [chatgpt-notify](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/chatgpt-notify.user.js)
- [d-anime-nico-comment-renderer](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/d-anime-nico-comment-renderer.user.js)
- [fanbox-floating-menu](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/fanbox-floating-menu.user.js)
- [fanbox-pagination-helper](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/fanbox-pagination-helper.user.js)
- [image-collector](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/image-collector.user.js)
- [imgur-direct-link](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/imgur-direct-link.user.js)
- [book-style-manga-viewer](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/manga-viewer.user.js)
- [twitter-clean-ui](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-clean-ui.user.js)
- [twitter-full-size-image](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-full-size-image.user.js)
- [twitter-media-filter](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-media-filter.user.js)
- [twitter-mute-filter](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-mute-filter.user.js)
- [twitter-mute-retweets](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-mute-retweets.user.js)
- [twitter-thread-copier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-thread-copier.user.js)
- [youtube-info-copier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/youtube-info-copier.user.js)

配布・導入
---------

1. `dist/` 内の `.user.js` ファイルを開いて右上のRawボタンを押すとTampermonkeyのユーザースクリプトとして読み込めます。そのままインストールするか、Tampermonkey の「新しいスクリプトを追加」から貼り付けてインストールします。
2. `.meta.js` はメタ情報の参照やホスティング時に使用できます。

アップデート手順
---------------

1. Tampermonkeyのアイコンを押し、ダッシュボードを開きます。
2. 「インストール済み」タブを開き、対象のスクリプトを選択します。
3. 「選択したスクリプトすべてにこの操作を適用」から「更新を確認」を選択し「実行」ボタンを押すと、最新版があれば自動的に更新されます。

インストール（開発環境）
----------------------

前提
- Node.js LTS（推奨：v20 または v22）
- npm が利用可能であること

手順
1. リポジトリをクローンします。

```bash
git clone https://github.com/roflsunriz/web-page-enhancement-scripts.git
cd web-page-enhancement-scripts
```

2. 依存関係をインストールします。

```bash
npm install
```

3. 開発サーバを起動します（スクリプト毎にモードを指定）。例：

```bash
# YouTube 情報コピー UI を開発する場合
npm run dev:youtube-info-copier

# 画像収集機能を開発する場合
npm run dev:image-collector
```

開発用のモードは `package.json` の `scripts` に多数定義されています（例: `dev:d-anime`, `dev:twitter-thread-copier` 等）。

ビルド
-----

すべての userscript をビルドして `dist/` に出力するには：

```bash
npm run build
```

コード品質チェック
------------------

型チェック、リンティング、フォーマットは以下で実行できます:

```bash
npm run type-check   # tsc --noEmit
npm run lint         # eslint src/**/*.ts
npm run format       # prettier --write src/**/*.ts
```


開発者向けノート
-----------------

- 型定義は `src/shared/types` に集約されています。
- 各スクリプトは SPA 向けに `MutationObserver` を使った URL 監視やシャドウ DOM を使用することがあります。
- 大量ダウンロード系（image-collector）はバッチ制御やリトライを実装しています。

貢献
----

PR 前に以下を実行してください：

```bash
npm install
npm run type-check
npm run lint
npm run build
```

ライセンス
-------

MIT


CI / PR Checks
-------------

このリポジトリは GitHub Actions を使った CI と PR Checksを提供します。

- **CI**: `main` ブランチへの push および PR で `lint` / `type-check` / `build` を実行します。
- **PR Quick Checks**: PR 作成時に `lint` と `type-check` を早期に検出します。
