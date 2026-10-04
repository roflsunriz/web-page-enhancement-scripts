web-page-enhancement-scripts
================================
[![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml/badge.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/release.yaml)
[![Lint](https://img.shields.io/badge/lint-ESLint-blue?logo=eslint&logoColor=white)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/pulls)
[![CI](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/ci.yaml/badge.svg)](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/workflows/ci.yaml)


これは複数のウェブページ向けユーザースクリプト（Tampermonkey / Greasemonkey）を管理するリポジトリです。TypeScript と Vite を用いて開発され、`dist/` にビルド済みの userscript（`.user.js` / `.meta.js`）が出力されます。

プロジェクト構成（概要）
-----------------------

- `src/` — 各ユーザースクリプトのソースコード。サブディレクトリごとに機能を分離。
  - `apkcube-direct-download/` — apkcube.com の待ち時間・検出ダイアログやポップアップを抑止しダウンロードへ直行
  - `bilibili-jp-localize/` — bilibiliの動画視聴ページとアカウントページのUI日本語化
  - `chatgpt-notify/` — 生成完了通知（ChatGPT 連携想定）
  - `d-anime/` — dアニメ向けニコニコ動画コメントレンダリングスクリプト。通常・固定・複数行コメントや動画終端での配置と表示タイミングをニコニコ動画の挙動に近づけて再現
  - `d-anime-cf-ranking/` — dアニメCFページ向け作品人気度ランキング表示スクリプト
  - `gif-direct-link-copier/` — GIPHY・Tenor・ImgurのGIF本体URLをコピー（動画のみの場合は形式を表示）
  - `hf-download-command-copier/` — Hugging Face のリポジトリページに `hf download` コマンドをコピーするボタンを追加
  - `image-collector/` — ページ内画像の一括収集・ZIP ダウンロード
  - `imgur-direct-link/` — Imgur 画像の直接リンク取得
  - `khinsider-direct-link-saver/` — KHInsider のアルバムページから音声ファイルを並列ダウンロード
  - `video-swipe-fullscreen/` — Webページの動画へ上下ドラッグ全画面を追加

  - `nico-player-premium-controls/` — モバイル公式パネルのローカル再生設定を個別選択可能にする
  - `nico-mobile-swipe-fullscreen/` — ニコニコ動画モバイル版で上スワイプ全画面・下スワイプ解除
  - `native-video-volume-setter/` — ブラウザ標準のビデオプレーヤー音量を既定値に揃える補助スクリプト
  - `video-screen-off-detection-blocker/` — video要素の画面オフ・バックグラウンド検知を遮断する補助スクリプト
  - `manga-viewer/` — 漫画・画像閲覧ブックスタイルビューア（React コンポーネント含む）
  - `trickcal-tool-sweep/` — Trickcal 掃蕩工具の素材画像と日本語ツールチップ補助
  - `twitter-*` 系 — Twitter 関連の各種ユーティリティ（画像、フィルタ、スレッドコピー等）
  - `x-auto-spam-reporter/` — X/Twitter のリプライをワンクリックでスパム報告＆ブロック
  - `x-community-note-close/` — X/Twitter のコミュニティノート評価モーダルをバックドロップクリックで閉じる
  - `yahoo-mail-ad-cleaner/` — Yahoo!メール PC版に残る広告枠、全画面プロモーション、連携案内、機能案内を非表示化
  - `yahoo-mail-mark-read/` — Yahoo!メール PC版でフォルダー内メールを素早く既読化
  - `youtube-info-copier/` — YouTube の動画情報をコピーするツール
  - `youtube-ui-modifier/` — YouTube のおすすめ、Shorts、コメント、ナビゲーションなどを設定モーダルから表示調整するツール
- `shared/` — DOM ヘルパー、GM HTTP、ロガー、共通型定義、スクリプト設定モーダルなどのユーティリティ
- `dist/` — ビルド済みの userscript（配布用）

各種ユーザースクリプトの説明は[userscripts.md](userscripts.md)を参照してください。

ユーザースクリプトのサブスクライブ
----------------------
リンクをクリックすることでTampermonkeyが自動的にインストールウィンドウを開き、インストールを行うことができます。

- [apkcube-direct-download](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/apkcube-direct-download.user.js)
- [bilibili-jp-localize](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/bilibili-jp-localize.user.js)
- [chatgpt-notify](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/chatgpt-notify.user.js)
- [d-anime-cf-ranking](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/d-anime-cf-ranking.user.js)
- [d-anime-nico-comment-renderer](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/d-anime-nico-comment-renderer.user.js)
- [fanbox-floating-menu](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/fanbox-floating-menu.user.js)
- [fanbox-pagination-helper](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/fanbox-pagination-helper.user.js)
- [gif-direct-link-copier](https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/gif-direct-link-copier.user.js)
- [hf-download-command-copier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/hf-download-command-copier.user.js)
- [image-collector](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/image-collector.user.js)
- [imgur-direct-link](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/imgur-direct-link.user.js)
- [khinsider-direct-link-saver](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/khinsider-direct-link-saver.user.js)
- [video-swipe-fullscreen](https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-swipe-fullscreen.user.js)
- [nico-mobile-swipe-fullscreen](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/nico-mobile-swipe-fullscreen.user.js)
- [nico-player-premium-controls](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/nico-player-premium-controls.user.js)
- [native-video-volume-setter](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/native-video-volume-setter.user.js)
- [book-style-manga-viewer](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/manga-viewer.user.js)
- [trickcal-tool-sweep](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/trickcal-tool-sweep.user.js)
- [twitter-clean-ui](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-clean-ui.user.js)
- [twitter-full-size-image](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-full-size-image.user.js)
- [twitter-clean-timeline](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-clean-timeline.user.js)
- [twitter-thread-copier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/twitter-thread-copier.user.js)
- [video-screen-off-detection-blocker](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/video-screen-off-detection-blocker.user.js)
- [x-auto-spam-reporter](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/x-auto-spam-reporter.user.js)
- [x-community-note-close](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/x-community-note-close.user.js)
- [yahoo-mail-ad-cleaner](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/yahoo-mail-ad-cleaner.user.js)
- [yahoo-mail-mark-read](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/yahoo-mail-mark-read.user.js)
- [youtube-info-copier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/youtube-info-copier.user.js)
- [youtube-ui-modifier](https://github.com/roflsunriz/web-page-enhancement-scripts/raw/refs/heads/main/dist/youtube-ui-modifier.user.js)

GIF本体の直リンクをコピー
-------------------------

独立した `gif-direct-link-copier` 1.0.0を追加しました。[配布用userscript](https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/gif-direct-link-copier.user.js)をuserscript managerへ導入して保存し、閲覧ページを再読み込みします。[ローカル配布物](dist/gif-direct-link-copier.user.js)からの導入も可能です。

| サイト | 対応する公開閲覧ページ | コピー対象・ボタン位置 |
| --- | --- | --- |
| GIPHY | `/gifs/<slug-ID>` | 表示中のGIF本体。メディアの下 |
| Tenor | `/view/<slug-ID>`、`/ja/view/...`など言語別ページ | ページに記載されたGIFを優先。メディアの下 |
| Imgur | `/gallery/<ID>`、`/a/<ID>`、`/<ID>`（slug付きも対応） | 描画済み投稿メディアごとに、見出し付近へ番号付きボタン。確認した実ページはMP4 |

「GIF 直リンクをコピー」を押すとメディアURLをコピーします。GIFが記載されていない場合は「MP4」または「WebM」と表示し、共有ページURLや拡張子を置換したURLはコピーしません。失敗時は再試行の案内と手動コピー用URLを表示します。

一覧・検索・コメント・おすすめ画像、GIPHY Clips、WebPのみの媒体、`blob:`や`.gifv`は対象外です。Imgurの未描画メディアはスクロールして読み込んでください。サイト側にGIF URLが存在してもページに出ていなければ取得できません。リンクの恒久性やサイト改修後の動作は保証できません。PCとモバイル幅のChromeで公開ページを確認し、WebM単独・ImgurのGIFはfixtureで検証しました。実端末・Firefox・userscript manager実環境は未検証です。[検証と制限](verification.md#gif-direct-link-copier-1002026-10-04)を参照してください。

汎用の動画スワイプ全画面
------------------------------------

[配布用userscript](https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-swipe-fullscreen.user.js)をuserscript managerへ導入して保存し、ページを再読み込みします。手元の `dist/video-swipe-fullscreen.user.js` からも導入できます。動画中央から上へ64px以上・1.2秒以内のドラッグで全画面と横画面ロックを試し、その全画面中の下ドラッグで復元します。サイト別無効化、iframe・shadow DOMの条件、ニコニコ版との併用は [利用説明](docs/video-swipe-fullscreen.md) を参照してください。ニコニコ専用版を併用する場合は1.0.1へ更新してください。

配布・導入
---------

1. `dist/` 内の `.user.js` ファイルを開いて右上のRawボタンを押すとTampermonkeyのユーザースクリプトとして読み込めます。そのままインストールするか、Tampermonkey の「新しいスクリプトを追加」から貼り付けてインストールします。
2. `.meta.js` はメタ情報の参照やホスティング時に使用できます。

ニコニコ動画モバイル版のスワイプ全画面
------------------------------------

`nico-mobile-swipe-fullscreen` を導入し、`https://sp.nicovideo.jp/watch/<動画ID>` を開きます。動画の中央付近（操作ボタン・上下左右の端を除く）から、1本指またはマウス左ボタンで上へ64px以上、1.2秒以内にドラッグして離すと全画面表示になります。その全画面中に中央付近から下へ同じようにドラッグすると通常表示に戻ります。最初に横へ動かした操作、タップ、複数指、ページ本文・操作ボタン・シークバーからの操作は対象外です。動画中央からの上方向ドラッグはこの操作に割り当てるため、ページを上方向へスクロールするときは動画の外から操作してください。

横画面ロックはブラウザが許可した場合だけ利用します。未対応・拒否時は全画面を維持して案内を表示するので、端末を手動で回転してください。通常表示へ戻ると、このスクリプトが取得した画面ロックを解除します。ブラウザが全画面そのものに未対応・拒否した場合は通常表示を維持します。iPhone等のOS管理の動画全画面ではページ側が下スワイプを受け取れないため、自動フォールバックせず既存の全画面ボタンを案内します。OS・ブラウザの設定変更は不要です。

上のインストールリンクをuserscript managerを導入したブラウザで開いて保存します。ローカルの `dist/nico-mobile-swipe-fullscreen.user.js` を新規スクリプトへ貼り付けても導入できます。対応APIがあっても全端末での成功を保証するものではありません。[確認範囲・ブラウザ制約](verification.md#nico-mobile-swipe-fullscreen-1002026-10-02)を参照してください。

ニコニコ動画モバイルの公式再生設定
----------------------------------

`nico-player-premium-controls` 1.0.1 の上記インストールリンクを、ページコンテキスト注入に対応するuserscript managerのあるブラウザで開いて保存し、`https://sp.nicovideo.jp/watch/<動画ID>` を再読み込みします。公式プレーヤーの設定パネルでレジューム・反転のON/OFF、送り／戻し秒数を個別に選び、再生速度パネルで速度を選択します。導入だけでは現在の選択や保存済み設定を変更しません。

対象はモバイル版のみです。会員情報・コメント送信・認証・画質やコンテンツの権利判定は変更しません。サーバー側の権限、視聴履歴からの再開位置の取得、高画質・高音質等を提供するものではありません。サイト内部の構造に依存するため、動作しなくなったらスクリプトを無効にして再読み込みしてください。無効化で既存の保存済み設定を削除することはありません。[検証と制限](verification.md#nico-player-premium-controls-1012026-10-02)を参照してください。

アップデート手順
---------------

1. Tampermonkeyのアイコンを押し、ダッシュボードを開きます。
2. 「インストール済み」タブを開き、対象のスクリプトを選択します。
3. 「選択したスクリプトすべてにこの操作を適用」から「更新を確認」を選択し「実行」ボタンを押すと、最新版があれば自動的に更新されます。

インストール（開発環境）
----------------------

前提
- Bun（推奨：v1.3.8以上）

手順
1. リポジトリをクローンします。

```bash
git clone https://github.com/roflsunriz/web-page-enhancement-scripts.git
cd web-page-enhancement-scripts
```

2. 依存関係をインストールします。

```bash
powershell -c "irm bun.sh/install.ps1|iex"
bun install
```

3. 開発サーバを起動します（スクリプト毎にモードを指定）。例：

```bash
# YouTube 情報コピー UI を開発する場合
bun dev:youtube-info-copier

# 画像収集機能を開発する場合
bun dev:image-collector

# book-style-manga-viewer を開発する場合
bun dev:manga-viewer
```

開発用のモードは `package.json` の `scripts` に多数定義されています（例: `dev:d-anime`, `dev:twitter-thread-copier` 等）。

ビルド
-----

すべての userscript をビルドして `dist/` に出力するには：

```bash
bun run build
```

コード品質チェック
------------------

型チェック、リンティング、フォーマットは以下で実行できます:

```bash
bun type-check   # tsc --noEmit
bun lint         # eslint src/**/*.ts
bun format       # prettier --write src/**/*.ts
```


開発者向けノート
-----------------

- 型定義は `src/shared/types` に集約されています。
- ユーザー向け UI 文言は、可能な限り `src/shared/i18n` の共通基盤と各スクリプトの辞書で管理します。
- 共通 i18n 基盤は、日本語に加えて総話者数ベースの主要 10 言語（英語、簡体字中国語、ヒンディー語、スペイン語、フランス語、アラビア語、ポルトガル語、ベンガル語、ロシア語、ウルドゥー語）のロケール定義、表示名、RTL 判定、翻訳補完ヘルパーを提供します。
- 各スクリプトは SPA 向けに `MutationObserver` を使った URL 監視やシャドウ DOM を使用することがあります。
- 大量ダウンロード系（image-collector）はバッチ制御やリトライを実装しています。

貢献
----

[開発への参加](CONTRIBUTING.md)、[行動規範](CODE_OF_CONDUCT.md)、[サポート](SUPPORT.md)、[セキュリティ報告](SECURITY.md) を参照してください。

PR 前に以下を実行してください：

```bash
bun install
bun type-check
bun lint
bun run build
```

ライセンス
-------

MIT


CI / PR Checks
-------------

このリポジトリは GitHub Actions を使った CI と PR Checksを提供します。

- **CI**: `main` ブランチへの push および PR で依存関係監査、`lint` / `type-check` / `test` / `build` を実行します。
- **PR Quick Checks**: PR 作成時に `lint` と `type-check` を早期に検出します。

## 依存更新の自動処理

`.github/dependabot.yml` は Bun と GitHub Actions の更新を毎週確認します。Dependabot の patch／minor PR は `CI` と `PR Quick Checks` を含む全 PR チェックの成功後に自動で squash merge されます。失敗ジョブは 1 回再実行し、修復できない PR と major 更新は手動で確認します。PR Quick Checks も Bun の固定 lockfile を使用します。
