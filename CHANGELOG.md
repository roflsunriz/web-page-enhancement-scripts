# Changelog

すべての変更は [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) に従って記載してください。

すべての重要な変更点をここに記録します。

## v1.2.1 - 2025-10-06
### 修正
- `d-anime-nico-comment-renderer.user.js`
  - 自動再生ボタンがニコニコ動画を開いてしまう意図しない実装をdアニメの動画を再生する仕様に修正しました。

## v1.2.0 - 2025-10-06
### 修正
- `twitter-thread-copier.user.js`
- UI表示時にアイコンが表示されるように修正しました。

## v1.1.0 - 2025-10-06
### 追加
- `twitter-thread-copier.user.js`
  - ローカルAIによる翻訳をプライマリ翻訳APIエンドポイントとして利用するようにしました。
  - Google翻訳による翻訳をフォールバックとして利用するようにしました。
  - オススメモデルはplamo-2-translateです。有志がGGUFに変換したモデルを公開しています。llama.cppで推論可能です。
  - 翻訳APIエンドポイントはhttp://localhost:3002/v1/chat/completionsを利用します。
  - オススメ翻訳拡張機能はイマーシブ翻訳(Immersive Translate)です。OpenAIライクなAPIに対応しているため、llama.cppと接続できます。

## v1.0.1 - 2025-10-05
### 修正
- `imgur-direct-link.user.js`
  - アップロードコンテンツページでダイレクトリンクが表示されない不具合を修正しました。
- スクリプト名とネームスペースをケバブケースに統一しました。

## v1.0.0 - 2025-10-04

以下は `dist/` に出力される各 userscript（.user.js）について、機能別の簡潔な解説です。

- `chatgpt-notify.user.js`
  - ChatGPT の生成完了を検知してデスクトップ通知や音声で知らせます。設定メニューから通知・サウンドのオン/オフや音量・カスタム音声の指定が可能です。

- `d-anime-nico-comment-renderer.user.js`
  - dAnime Store の動画プレーヤー上にニコニコ風の弾幕コメントを表示します。ニコニコの API からコメントを取得し、描画・レーン管理・NGワードフィルタ・表示制御・設定 UI を提供します。

- `fanbox-floating-menu.user.js`
  - Fanbox の記事ページにフローティングメニューを追加し、ページ内の前後移動リンクを常に表示することでページ移動を容易にします。

- `fanbox-pagination-helper.user.js`
  - Fanbox のページネーション UI をページ上部に追加し、長い一覧でも上部から簡単にページ移動できるようにします。

- `image-collector.user.js`
  - あらゆるページから画像を収集し、サムネイル一覧表示や ZIP ダウンロード機能を提供します。外部ホスト対応、サイズ/信頼度判定、バッチ処理、進捗表示、エラーハンドリングを備えます。

- `imgur-direct-link.user.js`
  - Imgur のページやリンクから直接画像のフルサイズ URL を抽出してコピーできるユーティリティ。ページ上で直接ダイレクトリンクを取得可能にします。

- `manga-viewer.user.js`
  - 漫画・画像のビューワー向け UI を提供します。チャプター移動、ページナビゲーション、画像プリロード・拡大縮小などの閲覧補助機能を含みます。

- `twitter-full-size-image.user.js`
  - Twitter（X）の画像リンクをフルサイズに自動リダイレクトするスクリプトです。

- `twitter-media-filter.user.js`
  - ツイートにメディアが含まれている場合のみ表示するフィルタリング機能を提供します。

- `twitter-mute-filter.user.js`
  - 特定の語句や正規表現に基づいてツイートをミュート（非表示）にするフィルタリング機能を提供します。インポート機能や設定 UI を備えています。

- `twitter-mute-retweets.user.js`
  - リツイート（RT）や引用リツイートを自動で検出して表示を抑制する機能を提供します。リツイートのみの表示を避けたい場合に有用です。

- `twitter-thread-copier.user.js`
  - スレッド（連投）を整形してコピーするためのユーティリティ。クリップボードへのコピー・引用整形・テキストフォーマッタ・自動翻訳・スクレイピングロジックを含みます。

- `twitter-wide-layout-fix.user.js`
  - Twitter のタイムラインレイアウトを広めに調整するスタイル修正を行います。カスタム CSS を注入して表示を改善します。

- `youtube-info-copier.user.js`
  - YouTube の動画情報（タイトル・説明・タグなど）を簡単にコピーできるユーティリティ。選択的にフォーマットしてクリップボードへ出力します。

注: 上記は dist 出力物の概要説明です。各スクリプトの詳細な実装や設定項目は `src/` 内の対応ディレクトリを参照してください。

---

## [未リリース]

### 追加
- 

### 修正
- 

### 変更
- 

### 削除
- 

---

## [バージョン番号] - YYYY-MM-DD

### 追加
- 

### 修正
- 

### 変更
- 

### 削除
- 
