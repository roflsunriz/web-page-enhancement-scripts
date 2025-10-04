web-page-enhancement-scripts
================================
[![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml/badge.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml)
[![Lint](https://img.shields.io/badge/lint-eslint9-blue?logo=eslint&logoColor=white)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript%205.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/pulls)


これは複数のウェブページ向けユーザースクリプト（Tampermonkey / Greasemonkey）を管理するリポジトリです。TypeScript と Vite を用いて開発され、`dist/` にビルド済みの userscript（`.user.js` / `.meta.js`）が出力されます。

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

2. 依存関係をインストールします（lockfile を変更しない運用を推奨）。

```bash
npm ci
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

配布・導入
---------

1. `dist/` 内の `.user.js` ファイルを直接ブラウザで開くか、Tampermonkey の「新しいスクリプトを追加」から貼り付けてインストールします。
2. `.meta.js` はメタ情報の参照やホスティング時に使用できます。

開発者向けノート
-----------------

- 型定義は `src/shared/types` に集約されています。
- 各スクリプトは SPA 向けに `MutationObserver` を使った URL 監視やシャドウ DOM を使用することがあります。
- 大量ダウンロード系（image-collector）はバッチ制御やリトライを実装しています。

貢献
----

PR 前に以下を実行してください：

```bash
npm ci
npm run type-check
npm run lint
npm run build
```

ライセンス
-------

MIT


CI / Releases
-------------

このリポジトリは GitHub Actions を使った CI とリリースワークフローを提供します。

- **CI**: `main` ブランチへの push および PR で `lint` / `type-check` / `build` を実行します。
- **PR Quick Checks**: PR 作成時に `lint` と `type-check` を早期に検出します。
- **Release**: `v*.*.*` タグを push すると `dist/` をビルドしてアーティファクトをリリースに添付します。

リリース手順（ローカル）:

```bash
# 1. バージョンを更新して tag を作成
git tag v1.2.3
git push origin v1.2.3

# 2. GitHub 上で Release が自動作成され、dist が添付されます
```

CI バッジ：

```
![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/ci.yaml/badge.svg)
```


