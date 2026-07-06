# 変更履歴

このリポジトリでは、`main` / `origin/main` に push された時点でリリース済みとして扱います。`Unreleased` 節は使わず、必ず対象スクリプトの実バージョンごとに記録します。

コミットメッセージは参考情報に留め、各エントリは `vite.config.ts` のバージョン差分と実際に変更されたファイルを基に作成します。

## スクリプト別リリース履歴

### d-anime-nico-comment-renderer

#### 7.6.1 - 2026-07-04
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `src/shared/types/twitter-clean-timeline.ts`, `vite.config.ts`

#### 7.6.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/i18n.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`

#### 7.5.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/i18n.ts`, `src/d-anime/services/video-switch-handler.ts`, `src/d-anime/settings/player-control-button.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/launch-style/index.ts`, `userscripts.md`

#### 7.4.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 主な変更ファイル: `README.md`, `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/debug/video-event-logger.ts`, `src/d-anime/i18n.ts`, `src/d-anime/services/nico-video-searcher.ts`, `src/d-anime/services/notification-manager.ts`

#### 7.3.13 - 2026-06-26
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/shared/logger/index.ts`, `vite.config.ts`

#### 7.3.12 - 2026-06-20
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/d-anime/config/default-settings.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 7.3.11 - 2026-05-09
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 7.3.10 - 2026-04-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 7.3.9 - 2026-04-17
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 7.3.8 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/services/settings-manager.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 7.3.7 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 7.3.6 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 7.3.5 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 7.3.4 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/player-control-button.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 7.3.3 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/player-control-button.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/icons/mdi.ts`, `vite.config.ts`

#### 7.3.2 - 2026-03-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/player-control-button.ts`, `vite.config.ts`

#### 7.3.1 - 2026-03-04
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/player-control-button.ts`, `vite.config.ts`

#### 7.3.0 - 2026-03-04
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/settings/player-control-button.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/constants/d-anime.ts`, `vite.config.ts`

#### 7.2.3 - 2026-02-14
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 7.2.2 - 2026-02-14
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/auto-button.css`, `vite.config.ts`

#### 7.2.1 - 2026-02-14
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 7.2.0 - 2026-02-14
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 7.1.1 - 2026-01-26
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 7.1.0 - 2025-12-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 7.0.4 - 2025-12-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 7.0.3 - 2025-12-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 7.0.2 - 2025-12-13
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 7.0.1 - 2025-12-13
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 7.0.0 - 2025-12-13
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/nico-video-searcher.ts`, `src/d-anime/services/settings-manager.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 6.16.1 - 2025-12-12
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 6.16.0 - 2025-12-12
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 6.15.15 - 2025-12-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.15.14 - 2025-12-01
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.15.13 - 2025-11-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.15.12 - 2025-11-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.15.11 - 2025-11-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.15.10 - 2025-11-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.9 - 2025-11-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.8 - 2025-11-24
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.15.7 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.15.6 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.5 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.4 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/video-switch-handler.ts`, `src/d-anime/settings/settings-ui.ts`, `vite.config.ts`

#### 6.15.3 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.2 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/debug/video-event-logger.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.15.1 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/notification-manager.ts`, `src/d-anime/settings/settings-ui.ts`, `src/d-anime/styles/notification.css`, `vite.config.ts`

#### 6.15.0 - 2025-11-23
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/nico-video-searcher.ts`, `src/shared/constants/d-anime.ts`, `vite.config.ts`

#### 6.14.0 - 2025-11-19
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.13.2 - 2025-11-19
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.13.1 - 2025-11-19
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/debug/video-event-logger.ts`, `src/d-anime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.13.0 - 2025-11-18
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.12.0 - 2025-11-16
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/watch-page-controller.ts`, `src/d-anime/services/settings-manager.ts`, `src/d-anime/services/video-switch-handler.ts`, `src/d-anime/settings/settings-ui.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 6.11.6 - 2025-11-11
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- ニコニコ API 取得とコメント取得処理を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/application.ts`, `src/d-anime/bootstrap.ts`, `src/d-anime/comments/comment-renderer.ts`, `src/d-anime/comments/comment.ts`, `src/d-anime/config/default-settings.ts`, `src/d-anime/controllers/mypage-controller.ts`, `src/d-anime/controllers/watch-page-controller.ts`

#### 6.11.5 - 2025-11-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.11.4 - 2025-11-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.11.3 - 2025-11-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.11.2 - 2025-11-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.11.1 - 2025-11-08
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.11.0 - 2025-11-07
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 6.10.0 - 2025-11-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.9.3 - 2025-11-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.9.2 - 2025-11-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.9.1 - 2025-11-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `vite.config.ts`

#### 6.9.0 - 2025-11-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/comment.ts`, `src/shared/types/comment-overlay.d.ts`, `vite.config.ts`

#### 6.8.1 - 2025-11-03
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.8.0 - 2025-11-03
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/globals.ts`, `src/d-anime/runtime/services/playback-rate-controller.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/d-anime/services/settings-manager.ts`, `src/d-anime/styles/common.css`, `src/shared/types/danime.ts`

#### 6.7.0 - 2025-11-03
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- ニコニコ API 取得とコメント取得処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/services/nico-api-fetcher.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 6.6.1 - 2025-11-02
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.6.0 - 2025-11-02
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.5.1 - 2025-11-02
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.5.0 - 2025-11-02
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/class.mmd`, `src/d-anime/config/default-settings.ts`, `src/d-anime/flow.mmd`, `src/d-anime/original.js.old`, `src/d-anime/plan.md`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/comment.ts`

#### 6.4.1 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment.ts`, `vite.config.ts`

#### 6.4.0 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/comment.ts`, `vite.config.ts`

#### 6.3.0 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 6.2.3 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 6.2.2 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 6.2.1 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 6.2.0 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/styles/common.css`, `vite.config.ts`

#### 6.1.8 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 6.1.7 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 6.1.5 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 6.1.4 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.1.3 - 2025-10-31
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 6.1.2 - 2025-10-30
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `vite.config.ts`

#### 6.1.1 - 2025-10-30
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/styles/common.css`, `vite.config.ts`

#### 6.1.0 - 2025-10-30
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/notification-manager.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/d-anime/styles/common.css`, `src/shared/icons/mdi.ts`, `vite.config.ts`

#### 6.0.0 - 2025-10-30
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 5.9.0 - 2025-10-29
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 5.8.0 - 2025-10-29
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/config/default-settings.ts`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 5.7.0 - 2025-10-28
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/comment-renderer.ts`, `vite.config.ts`

#### 5.6.3 - 2025-10-28
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 5.6.2 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.6.1 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/services/nico-video-searcher.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.6.0 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/services/nico-video-searcher.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.5.3 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 5.5.2 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/comment-renderer.ts`, `src/d-anime/runtime/services/video-switch-handler.ts`, `vite.config.ts`

#### 5.5.1 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/comment-renderer.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 5.5.0 - 2025-10-27
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/comment-renderer.ts`, `src/shared/types/danime.ts`, `src/shared/types/index.ts`, `vite.config.ts`

#### 5.4.0 - 2025-10-26
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/original.js.old`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/d-anime/services/settings-manager.ts`, `vite.config.ts`

#### 5.3.1 - 2025-10-13
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- ニコニコ API 取得とコメント取得処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/services/nico-api-fetcher.ts`, `src/d-anime/runtime/services/nico-video-searcher.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/shared/constants/index.ts`, `src/shared/constants/urls.ts`, `vite.config.ts`

#### 5.3.0 - 2025-10-13
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/controllers/mypage-controller.ts`, `src/d-anime/runtime/controllers/watch-page-controller.ts`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`

#### 5.2.1 - 2025-10-12
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.2.0 - 2025-10-12
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/settings/settings-ui.ts`, `src/d-anime/styles/auto-button.css`, `src/d-anime/styles/common.css`, `src/shared/icons/mdi.ts`, `vite.config.ts`

#### 5.1.1 - 2025-10-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.1.0 - 2025-10-06
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/d-anime/runtime/settings/settings-ui.ts`, `vite.config.ts`

#### 5.0.1 - 2025-10-05
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 5.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- コメント描画エンジン、レーン、同期、キャンバス処理を変更。
- 視聴ページの動画切り替え検出、再生状態追従、初期化を変更。
- 動画ソース変更時のコメント再取得とレンダラー再初期化を変更。
- ニコニコ動画検索、候補表示、類似度計算を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/d-anime/class.mmd`, `src/d-anime/config/default-settings.ts`, `src/d-anime/flow.mmd`, `src/d-anime/main.ts`, `src/d-anime/original.js`, `src/d-anime/plan.md`

### d-anime-cf-ranking

#### 1.5.1 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/d-anime-cf-ranking/ui/control-panel.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `src/shared/types/twitter-clean-timeline.ts`, `vite.config.ts`

#### 1.5.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- ランキングバッジの表示、色、ツールチップを変更。
- 詳細ランキング一覧モーダルを変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/d-anime-cf-ranking/i18n.ts`, `src/d-anime-cf-ranking/ui/rank-badge.ts`, `src/d-anime-cf-ranking/ui/ranking-list-modal.ts`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `userscripts.md`

#### 1.4.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- ランキングバッジの表示、色、ツールチップを変更。
- 詳細ランキング一覧モーダルを変更。
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ランキングスコア計算と代表動画選択を変更。
- 主な変更ファイル: `README.md`, `src/d-anime-cf-ranking/config/settings.ts`, `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/dom/viewport-observer.ts`, `src/d-anime-cf-ranking/i18n.ts`, `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/cache-manager.ts`, `src/d-anime-cf-ranking/services/fetch-controller.ts`

#### 1.3.0 - 2026-06-26
- 詳細ランキング一覧モーダルを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/ui/control-panel.ts`, `src/d-anime-cf-ranking/ui/ranking-list-modal.ts`, `vite.config.ts`

#### 1.2.2 - 2026-06-26
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/logger/index.ts`, `vite.config.ts`

#### 1.2.1 - 2026-05-30
- ランキングバッジの表示、色、ツールチップを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/ui/rank-badge.ts`, `vite.config.ts`

#### 1.2.0 - 2026-05-30
- ランキングバッジの表示、色、ツールチップを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/ui/rank-badge.ts`, `vite.config.ts`

#### 1.1.0 - 2026-02-03
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/config/settings.ts`, `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/cache-manager.ts`, `src/d-anime-cf-ranking/ui/control-panel.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `vite.config.ts`

#### 1.0.10 - 2026-02-02
- ランキングスコア計算と代表動画選択を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/services/representative-selector.ts`, `vite.config.ts`

#### 1.0.9 - 2026-02-02
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.8 - 2026-02-02
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `vite.config.ts`

#### 1.0.7 - 2026-02-02
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `vite.config.ts`

#### 1.0.6 - 2026-02-02
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.5 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ランキングスコア計算と代表動画選択を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/score-calculator.ts`, `src/d-anime-cf-ranking/ui/rank-badge.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `vite.config.ts`

#### 1.0.3 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/ui/rank-badge.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `vite.config.ts`

#### 1.0.2 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/ui/rank-badge.ts`, `vite.config.ts`

#### 1.0.1 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/ui/rank-badge.ts`, `vite.config.ts`

#### 0.0.2 - 2026-02-02
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/services/fetch-controller.ts`, `vite.config.ts`

#### 0.0.1 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.1.0 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.5 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.4 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.3 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `vite.config.ts`

#### 1.0.2 - 2026-02-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/nico-api-client.ts`, `vite.config.ts`

#### 1.0.1 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ランキングスコア計算と代表動画選択を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/dom/viewport-observer.ts`, `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/nico-api-client.ts`, `src/d-anime-cf-ranking/services/representative-selector.ts`, `src/d-anime-cf-ranking/ui/rank-badge.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `vite.config.ts`

#### 1.0.0 - 2026-02-02
- ランキングバッジの表示、色、ツールチップを変更。
- ランキング対象カードの検出、可視範囲監視、遅延初期化を変更。
- ランキングスコア計算と代表動画選択を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `package.json`, `src/d-anime-cf-ranking/config/settings.ts`, `src/d-anime-cf-ranking/dom/card-detector.ts`, `src/d-anime-cf-ranking/dom/viewport-observer.ts`, `src/d-anime-cf-ranking/main.ts`, `src/d-anime-cf-ranking/services/cache-manager.ts`, `src/d-anime-cf-ranking/services/fetch-controller.ts`, `src/d-anime-cf-ranking/services/nico-api-client.ts`

### chatgpt-notify

#### 2.2.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 2.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/chatgpt-notify/i18n.ts`, `src/chatgpt-notify/main.ts`, `src/chatgpt-notify/notification.ts`, `src/chatgpt-notify/original.js.old`, `src/chatgpt-notify/settings.ts`, `src/chatgpt-notify/ui.ts`

#### 2.1.1 - 2025-10-13
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/chatgpt-notify/notification.ts`, `src/chatgpt-notify/ui.ts`, `src/shared/constants/index.ts`, `src/shared/constants/urls.ts`, `vite.config.ts`

#### 2.1.0 - 2025-10-13
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/chatgpt-notify/dom-observer.ts`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`

#### 2.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/chatgpt-notify/dom-observer.ts`, `src/chatgpt-notify/main.ts`, `src/chatgpt-notify/notification.ts`, `src/chatgpt-notify/original.js`, `src/chatgpt-notify/settings.ts`, `src/chatgpt-notify/ui.ts`

### fanbox-floating-menu

#### 2.1.1 - 2026-07-04
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/fanbox-floating-menu/floating-menu-ui.ts`, `src/fanbox-floating-menu/main.ts`, `src/fanbox-floating-menu/original.js.old`, `src/fanbox-floating-menu/url-change-observer.ts`, `src/fanbox-floating-menu/wait-for-element.ts`, `src/shared/constants/d-anime.ts`

#### 2.1.0 - 2025-10-13
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/fanbox-floating-menu/floating-menu-ui.ts`, `src/fanbox-floating-menu/main.ts`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`

#### 2.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/fanbox-floating-menu/floating-menu-ui.ts`, `src/fanbox-floating-menu/main.ts`, `src/fanbox-floating-menu/original.js`, `src/fanbox-floating-menu/url-change-observer.ts`, `src/fanbox-floating-menu/wait-for-element.ts`, `src/shared/dom/index.ts`

### fanbox-pagination-helper

#### 2.1.1 - 2026-07-04
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/fanbox-pagination/main.ts`, `src/fanbox-pagination/original.js.old`, `src/fanbox-pagination/pagination-ui.ts`, `src/fanbox-pagination/styles.ts`, `src/fanbox-pagination/url-change-observer.ts`, `src/shared/constants/d-anime.ts`

#### 2.1.0 - 2025-10-13
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/fanbox-pagination/main.ts`, `src/fanbox-pagination/pagination-ui.ts`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`

#### 2.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/fanbox-pagination/main.ts`, `src/fanbox-pagination/original.js`, `src/fanbox-pagination/pagination-ui.ts`, `src/fanbox-pagination/styles.ts`, `src/fanbox-pagination/url-change-observer.ts`, `src/shared/dom/index.ts`

### image-collector

#### 5.6.5 - 2026-07-06
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/image-collector/core/image-collector.ts`, `vite.config.ts`

#### 5.6.4 - 2026-07-06
- 共通ページ画像候補スキャナの候補抽出、ロード済み画像判定、スクロールフォールバックを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/page-image-candidates/index.ts`, `vite.config.ts`

#### 5.6.3 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 既知の不要画像、削除済み画像、サイズ範囲の判定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/image-collector/core/bad-image-handler.ts`, `src/image-collector/runtime/bootstrap.ts`, `src/shared/image-exclusion-settings/index.ts`, `src/shared/script-settings/index.ts`, `vite.config.ts`

#### 5.6.2 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/image-exclusion-settings/index.ts`, `vite.config.ts`

#### 5.6.1 - 2026-07-06
- 共通ページ画像候補スキャナの候補抽出、ロード済み画像判定、スクロールフォールバックを変更。
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- Shadow DOM host の配置と重なり順を変更。
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- 主な変更ファイル: `src/image-collector/core/image-collector.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/image-exclusion-settings/index.ts`, `src/shared/page-image-candidates/index.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 5.6.0 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- 既知の不要画像、削除済み画像、サイズ範囲の判定を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `src/image-collector/core/bad-image-handler.ts`, `src/image-collector/core/image-collector.ts`, `src/image-collector/runtime/bootstrap.ts`, `src/shared/image-exclusion-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 5.5.2 - 2026-07-06
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 5.5.1 - 2026-07-06
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/script-settings/index.ts`, `vite.config.ts`

#### 5.5.0 - 2026-07-06
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `src/image-collector/runtime/bootstrap.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 5.4.2 - 2026-07-04
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 5.4.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 5.4.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/image-collector/core/zip-downloader.ts`, `src/image-collector/i18n.ts`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `userscripts.md`, `vite.config.ts`

#### 5.3.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- 既知の不要画像、削除済み画像、サイズ範囲の判定を変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 主な変更ファイル: `README.md`, `src/image-collector/core/bad-image-handler.ts`, `src/image-collector/core/image-collector.ts`, `src/image-collector/core/image-host-manager.ts`, `src/image-collector/core/image-source-classifier.ts`, `src/image-collector/core/request-batch-limiter.ts`, `src/image-collector/core/zip-downloader.ts`, `src/image-collector/i18n.ts`

#### 5.2.2 - 2026-06-26
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- 既知の不要画像、削除済み画像、サイズ範囲の判定を変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `package.json`, `src/image-collector/class.mmd`, `src/image-collector/core/bad-image-handler.ts`, `src/image-collector/core/image-collector.ts`, `src/image-collector/core/image-source-classifier.ts`, `src/image-collector/core/request-batch-limiter.ts`, `src/image-collector/core/zip-downloader.ts`, `src/image-collector/flow.mmd`

#### 5.2.0 - 2025-10-13
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`

#### 5.1.0 - 2025-10-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/image-collector/ui/progress-bar.ts`, `src/image-collector/ui/toast.ts`, `src/image-collector/ui/ui-event-handler.ts`, `vite.config.ts`

#### 5.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 5.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画像収集の入口、fast path / slow path 分類、検証対象の組み立てを変更。
- 既知の不要画像、削除済み画像、サイズ範囲の判定を変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/image-collector/class.mmd`, `src/image-collector/config.ts`, `src/image-collector/core/bad-image-handler.ts`, `src/image-collector/core/image-collector.ts`, `src/image-collector/core/image-host-manager.ts`, `src/image-collector/core/image-source-classifier.ts`

### imgur-direct-link

#### 3.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/imgur-direct-link/app.ts`, `src/imgur-direct-link/dom.ts`, `src/imgur-direct-link/main.ts`, `src/imgur-direct-link/original.js`, `src/imgur-direct-link/ui.ts`, `src/shared/dom/index.ts`

### book-style-manga-viewer

#### 10.13.5 - 2026-07-06
- 共通ページ画像候補スキャナの候補抽出、ロード済み画像判定、スクロールフォールバックを変更。
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/shared/page-image-candidates/index.ts`, `vite.config.ts`

#### 10.13.4 - 2026-07-06
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `vite.config.ts`

#### 10.13.3 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/invalid-image-database.ts`, `src/manga-viewer/manga-viewer-app.ts`, `src/shared/image-exclusion-settings/index.ts`, `src/shared/script-settings/index.ts`, `vite.config.ts`

#### 10.13.2 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/image-exclusion-settings/index.ts`, `vite.config.ts`

#### 10.13.1 - 2026-07-06
- 共通ページ画像候補スキャナの候補抽出、ロード済み画像判定、スクロールフォールバックを変更。
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- Shadow DOM host の配置と重なり順を変更。
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/image-exclusion-settings/index.ts`, `src/shared/page-image-candidates/index.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.13.0 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/invalid-image-database.ts`, `src/manga-viewer/manga-viewer-app.ts`, `src/shared/image-exclusion-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.12.0 - 2026-07-06
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/manga-viewer/image-exclusion-settings.ts`, `src/manga-viewer/invalid-image-database.ts`, `src/manga-viewer/manga-viewer-app.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.11.1 - 2026-07-06
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/script-settings/index.ts`, `vite.config.ts`

#### 10.11.0 - 2026-07-06
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `src/manga-viewer/manga-viewer-app.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.10.5 - 2026-07-06
- 対象ページの DOM 解析と操作アプリ本体を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/manga-viewer-app.ts`, `vite.config.ts`

#### 10.10.4 - 2026-07-06
- 対象ページの DOM 解析と操作アプリ本体を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/manga-viewer-app.ts`, `vite.config.ts`

#### 10.10.3 - 2026-07-06
- 対象ページの DOM 解析と操作アプリ本体を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/manga-viewer-app.ts`, `vite.config.ts`

#### 10.10.2 - 2026-07-04
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 10.10.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 10.10.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/manga-viewer/i18n.ts`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.9.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/launch-style/index.ts`, `userscripts.md`, `vite.config.ts`

#### 10.8.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 章移動と次章・前章ナビゲーションを変更。
- 主な変更ファイル: `README.md`, `src/manga-viewer/chapter-navigator.ts`, `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/collectors/i-collector.ts`, `src/manga-viewer/collectors/twitter-collector.ts`, `src/manga-viewer/constants.ts`, `src/manga-viewer/data-loader.ts`, `src/manga-viewer/i18n.ts`

#### 10.7.1 - 2026-06-04
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/ui/viewer-component.tsx`, `vite.config.ts`

#### 10.7.0 - 2026-06-04
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/ui/viewer-component.tsx`, `src/manga-viewer/ui/viewer.css`, `vite.config.ts`

#### 10.6.7 - 2026-06-04
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/ui/viewer-component.tsx`, `vite.config.ts`

#### 10.6.6 - 2026-06-04
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `vite.config.ts`

#### 10.6.5 - 2026-06-04
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/collectors/i-collector.ts`, `src/manga-viewer/ui/ui-builder.ts`, `vite.config.ts`

#### 10.6.4 - 2026-06-04
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/ui/ui-builder.ts`, `vite.config.ts`

#### 10.6.3 - 2026-06-04
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/invalid-image-database.ts`, `vite.config.ts`

#### 10.6.1 - 2026-06-04
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/invalid-image-database.ts`, `vite.config.ts`

#### 10.6.0 - 2026-02-09
- 起動スタイル選択とメニュー連携を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/manga-viewer-app.ts`, `src/shared/launch-style/index.ts`, `src/shared/types/index.ts`, `src/shared/types/launch-style.ts`, `src/shared/ui/fab.ts`, `vite.config.ts`

#### 10.5.2 - 2025-12-27
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/ui/ui-builder.ts`, `src/manga-viewer/ui/viewer-component.tsx`, `src/manga-viewer/util.ts`, `vite.config.ts`

#### 10.5.1 - 2025-12-03
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/arch.mmd`, `src/manga-viewer/original.js.old`, `src/manga-viewer/plan.md`, `src/shared/types/comment-overlay.d.ts`, `src/shared/types/danime.ts`, `vite.config.ts`

#### 10.5.0 - 2025-10-13
- 章移動と次章・前章ナビゲーションを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/chapter-navigator.ts`, `src/manga-viewer/collectors/twitter-collector.ts`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`

#### 10.4.2 - 2025-10-10
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/invalid-image-database.ts`, `vite.config.ts`

#### 10.4.1 - 2025-10-10
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/invalid-image-database.ts`, `vite.config.ts`

#### 10.4.0 - 2025-10-10
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- 漫画ビューアの既知不要画像データベースとサイト別除外ルールを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/invalid-image-database.ts`, `vite.config.ts`

#### 10.3.0 - 2025-10-09
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/ui/glass-control-panel.ts`, `src/manga-viewer/ui/loading-spinner.ts`, `src/manga-viewer/ui/ui-builder.ts`, `vite.config.ts`

#### 10.2.0 - 2025-10-09
- ビューア本体、操作パネル、表示レイアウトを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/manga-viewer/ui/glass-control-panel.ts`, `src/shared/icons/mdi.ts`, `vite.config.ts`

#### 10.1.0 - 2025-10-08
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/manga-viewer/collectors/twitter-collector.ts`, `vite.config.ts`

#### 10.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 10.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 汎用画像コレクターの画像候補収集、検証、追加反映フローを変更。
- ビューア本体、操作パネル、表示レイアウトを変更。
- 章移動と次章・前章ナビゲーションを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/manga-viewer/arch.mmd`, `src/manga-viewer/chapter-navigator.ts`, `src/manga-viewer/collectors/generic-collector.ts`, `src/manga-viewer/collectors/i-collector.ts`, `src/manga-viewer/collectors/twitter-collector.ts`, `src/manga-viewer/constants.ts`

### twitter-full-size-image

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画像 URL の解析とフルサイズ画像へのリダイレクトを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/dom/index.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/icons/mdi.ts`, `src/shared/logger/index.ts`, `src/shared/network/gmHttp.ts`, `src/shared/network/index.ts`

### twitter-clean-timeline

#### 1.7.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.7.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `src/twitter-clean-timeline/i18n.ts`, `src/twitter-clean-timeline/ui/settings-ui.ts`, `userscripts.md`, `vite.config.ts`

#### 1.6.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.5.1 - 2026-06-26
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/logger/index.ts`, `vite.config.ts`

#### 1.5.0 - 2025-11-27
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/types/twitter-clean-timeline.ts`, `src/twitter-clean-timeline/dom/tweet-processor.ts`, `src/twitter-clean-timeline/filters/replace-filter.ts`, `src/twitter-clean-timeline/settings.ts`, `src/twitter-clean-timeline/ui/settings-ui.ts`, `vite.config.ts`

#### 1.4.0 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/types/twitter-clean-timeline.ts`, `src/twitter-clean-timeline/filters/base-filter.ts`, `src/twitter-clean-timeline/filters/media-filter.ts`, `src/twitter-clean-timeline/filters/mute-filter.ts`, `src/twitter-clean-timeline/filters/retweet-filter.ts`, `src/twitter-clean-timeline/main.ts`, `src/twitter-clean-timeline/network/timeline-parser.ts`, `src/twitter-clean-timeline/network/xhr-interceptor.ts`

#### 1.3.3 - 2025-11-25
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/network/xhr-interceptor.ts`, `vite.config.ts`

#### 1.3.2 - 2025-11-25
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/network/xhr-interceptor.ts`, `vite.config.ts`

#### 1.3.1 - 2025-11-25
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/network/xhr-interceptor.ts`, `vite.config.ts`

#### 1.3.0 - 2025-11-25
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/main.ts`, `src/twitter-clean-timeline/network/xhr-interceptor.ts`, `vite.config.ts`

#### 1.2.0 - 2025-11-25
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/filters/media-filter.ts`, `src/twitter-clean-timeline/network/xhr-interceptor.ts`, `vite.config.ts`

#### 1.1.1 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-timeline/ui/settings-ui.ts`, `vite.config.ts`

#### 1.0.1 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/types/index.ts`, `src/shared/types/twitter-clean-timeline.ts`, `src/shared/types/twitter-media.ts`, `src/shared/types/twitter-mute-retweets.ts`, `src/shared/types/twitter-mute.ts`, `src/twitter-clean-timeline/filters/base-filter.ts`, `src/twitter-clean-timeline/filters/media-filter.ts`, `src/twitter-clean-timeline/filters/mute-filter.ts`

#### 1.0.0 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- タイムライン投稿の検出、フィルター、置換、XHR 解析を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `README.md`, `src/twitter-clean-timeline/dom/observer.ts`, `src/twitter-clean-timeline/dom/placeholder.ts`, `src/twitter-clean-timeline/dom/tweet-processor.ts`, `src/twitter-clean-timeline/dom/tweet-remover.ts`, `src/twitter-clean-timeline/filters/base-filter.ts`, `src/twitter-clean-timeline/filters/media-filter.ts`, `src/twitter-clean-timeline/filters/mute-filter.ts`

### twitter-clean-ui

#### 1.15.1 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.15.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `package.json`, `src/shared/launch-style/index.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/types.ts`, `userscripts.md`, `vite.config.ts`

#### 1.14.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/launch-style/index.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/types.ts`, `userscripts.md`, `vite.config.ts`

#### 1.13.0 - 2026-06-27
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/i18n/index.ts`, `userscripts.md`, `vite.config.ts`

#### 1.12.6 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.12.5 - 2026-03-06
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.12.4 - 2026-02-23
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/sidebar-cloak.ts`, `vite.config.ts`

#### 1.12.3 - 2026-02-23
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/sidebar-cloak.ts`, `vite.config.ts`

#### 1.12.2 - 2026-02-23
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.12.1 - 2026-02-23
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/sidebar-cloak.ts`, `vite.config.ts`

#### 1.12.0 - 2026-02-23
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.11.0 - 2026-02-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.10.0 - 2026-02-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.9.0 - 2026-02-09
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.8.0 - 2026-01-15
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.7.2 - 2025-12-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.7.1 - 2025-12-17
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/settings-manager.ts`, `src/twitter-clean-ui/settings-ui.ts`, `vite.config.ts`

#### 1.6.5 - 2025-12-17
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/settings-manager.ts`, `vite.config.ts`

#### 1.6.4 - 2025-12-17
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/settings-manager.ts`, `src/twitter-clean-ui/settings-ui.ts`, `vite.config.ts`

#### 1.6.3 - 2025-12-17
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `vite.config.ts`

#### 1.6.2 - 2025-12-17
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/settings-manager.ts`, `vite.config.ts`

#### 1.6.1 - 2025-12-17
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/settings-ui.ts`, `vite.config.ts`

#### 1.6.0 - 2025-12-17
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.5.1 - 2025-12-05
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.5.0 - 2025-12-05
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/element-detector.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/types.ts`

#### 1.4.4 - 2025-12-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.4.3 - 2025-12-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.4.2 - 2025-12-03
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.4.1 - 2025-12-03
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.5.1 - 2025-12-03
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.5.0 - 2025-12-03
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.4.2 - 2025-12-01
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.4.1 - 2025-11-28
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/settings-ui.ts`, `vite.config.ts`

#### 1.4.0 - 2025-11-28
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.3.9 - 2025-11-28
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.3.8 - 2025-11-28
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/settings-ui.ts`, `vite.config.ts`

#### 1.3.7 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.3.6 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.3.5 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.4.3 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.4.2 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.4.1 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.4.0 - 2025-11-27
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/css-injector.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/element-detector.ts`, `src/twitter-clean-ui/main.ts`, `vite.config.ts`

#### 1.3.5 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.3.4 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.3.3 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-detector.ts`, `vite.config.ts`

#### 1.3.2 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `vite.config.ts`

#### 1.3.1 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.3.0 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/main.ts`, `src/twitter-clean-ui/settings-ui.ts`, `src/twitter-clean-ui/styles.ts`, `vite.config.ts`

#### 1.2.0 - 2025-11-25
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/types.ts`, `vite.config.ts`

#### 1.1.1 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.1.0 - 2025-11-25
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/element-controller.ts`, `vite.config.ts`

#### 1.0.0 - 2025-11-25
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `package.json`, `src/shared/types/index.ts`, `src/shared/types/twitter-wide-layout.ts`, `src/twitter-clean-ui/constants.ts`, `src/twitter-clean-ui/element-controller.ts`, `src/twitter-clean-ui/element-detector.ts`, `src/twitter-clean-ui/i18n.ts`, `src/twitter-clean-ui/main.ts`

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/dom/index.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/icons/mdi.ts`, `src/shared/logger/index.ts`, `src/shared/network/gmHttp.ts`, `src/shared/network/index.ts`

### twitter-thread-copier

#### 6.11.1 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/shared/types/d-anime-cf-ranking.ts`, `src/shared/types/twitter-clean-timeline.ts`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 6.11.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `src/twitter-thread-copier/i18n.ts`, `src/twitter-thread-copier/main.ts`, `userscripts.md`, `vite.config.ts`

#### 6.10.0 - 2026-06-27
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/i18n.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 6.9.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 6.8.0 - 2026-05-09
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/types/twitter-thread.ts`, `src/twitter-thread-copier/scraper.ts`, `vite.config.ts`

#### 6.7.3 - 2025-12-27
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/main.ts`, `vite.config.ts`

#### 6.7.2 - 2025-12-24
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/scraper.ts`, `vite.config.ts`

#### 6.7.1 - 2025-11-19
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 6.7.0 - 2025-11-19
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/settings.ts`, `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 6.6.1 - 2025-11-11
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 6.6.0 - 2025-11-11
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/settings.ts`, `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/types.ts`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 6.5.1 - 2025-11-08
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 6.5.0 - 2025-11-08
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/types/comment-overlay.d.ts`, `src/shared/types/danime.ts`, `src/twitter-thread-copier/class.mmd`, `src/twitter-thread-copier/flow.mmd`, `src/twitter-thread-copier/original.js.old`, `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/ui.ts`

#### 6.4.0 - 2025-10-14
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/auto-conversion.ts`, `vite.config.ts`

#### 6.3.0 - 2025-10-14
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/auto-conversion.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 6.2.0 - 2025-10-14
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/auto-conversion.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 6.1.0 - 2025-10-14
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 6.0.0 - 2025-10-14
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/formatter.ts`, `src/twitter-thread-copier/main.ts`, `src/twitter-thread-copier/original.js.old`, `vite.config.ts`

#### 5.9.1 - 2025-10-13
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/index.ts`, `src/shared/constants/urls.ts`, `src/twitter-thread-copier/main.ts`, `src/twitter-thread-copier/scraper.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.9.0 - 2025-10-13
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`

#### 5.8.0 - 2025-10-12
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 5.7.1 - 2025-10-10
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.7.0 - 2025-10-10
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/scraper.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.6.0 - 2025-10-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/main.ts`, `src/twitter-thread-copier/state.ts`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 5.5.1 - 2025-10-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 5.5.0 - 2025-10-08
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/scraper.ts`, `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.4.3 - 2025-10-07
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/scraper.ts`, `vite.config.ts`

#### 5.4.2 - 2025-10-07
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.4.1 - 2025-10-07
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 5.4.0 - 2025-10-07
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/services/clipboard.ts`, `src/twitter-thread-copier/services/translator.ts`, `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/ui/control-panel.ts`, `src/twitter-thread-copier/ui/reset-start-point-button.ts`, `src/twitter-thread-copier/ui/shadow-dom-host.ts`, `src/twitter-thread-copier/ui/toast.ts`

#### 5.3.2 - 2025-10-07
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/scraper.ts`, `vite.config.ts`

#### 5.3.1 - 2025-10-06
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 5.3.0 - 2025-10-06
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/types/twitter-thread.ts`, `src/twitter-thread-copier/formatter.ts`, `src/twitter-thread-copier/logger.ts`, `src/twitter-thread-copier/main.ts`, `src/twitter-thread-copier/scraper.ts`, `src/twitter-thread-copier/translator.ts`, `src/twitter-thread-copier/ui.ts`

#### 5.2.0 - 2025-10-06
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/twitter-thread-copier/ui.ts`, `vite.config.ts`

#### 5.1.0 - 2025-10-06
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/twitter-thread-copier/translator.ts`, `vite.config.ts`

#### 5.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 5.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ツイート収集、整形、翻訳、クリップボード出力を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/dom/index.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/icons/mdi.ts`, `src/shared/logger/index.ts`, `src/shared/network/gmHttp.ts`, `src/shared/network/index.ts`

### youtube-info-copier

#### 2.6.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 2.6.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/launch-style/index.ts`, `userscripts.md`, `vite.config.ts`

#### 2.5.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 2.4.3 - 2026-06-26
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/logger/index.ts`, `vite.config.ts`

#### 2.4.2 - 2026-03-21
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.4.1 - 2026-03-21
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/ui/fab.ts`, `src/youtube-info-copier/main.ts`, `vite.config.ts`

#### 2.4.0 - 2026-02-09
- 起動スタイル選択とメニュー連携を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/launch-style/index.ts`, `src/shared/types/index.ts`, `src/shared/types/launch-style.ts`, `src/shared/ui/fab.ts`, `src/youtube-info-copier/main.ts`, `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.3.2 - 2025-11-24
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-info-copier/dom-utils.ts`, `src/youtube-info-copier/ui.ts`, `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.3.1 - 2025-11-24
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-info-copier/dom-utils.ts`, `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.3.0 - 2025-11-24
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/youtube.ts`, `src/shared/types/comment-overlay.d.ts`, `src/shared/types/danime.ts`, `src/youtube-info-copier/dom-utils.ts`, `src/youtube-info-copier/original.js.old`, `src/youtube-info-copier/youtube-info-copier.ts`, `userscripts.md`

#### 2.2.1 - 2025-10-13
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/index.ts`, `src/shared/constants/urls.ts`, `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.2.0 - 2025-10-13
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/constants/chatgpt.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/fanbox.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`

#### 2.1.0 - 2025-10-09
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/shared/icons/mdi.ts`, `src/youtube-info-copier/ui.ts`, `src/youtube-info-copier/youtube-info-copier.ts`, `vite.config.ts`

#### 2.0.1 - 2025-10-05
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 2.0.0 - 2025-10-04
- Shadow DOM host の配置と重なり順を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/dom/index.ts`, `src/shared/dom/shadowHost.ts`, `src/shared/icons/mdi.ts`, `src/shared/logger/index.ts`, `src/shared/network/gmHttp.ts`, `src/shared/network/index.ts`

### native-video-volume-setter

#### 1.2.2 - 2026-07-06
- 共通ページ画像候補スキャナの候補抽出、ロード済み画像判定、スクロールフォールバックを変更。
- 不要画像の URL 指紋、画素ハッシュ、候補プレビュー登録フローを変更。
- 共通設定モーダル、対象サイト許可ルール、起動スタイル設定を変更。
- Shadow DOM host の配置と重なり順を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/dom/shadowHost.ts`, `src/shared/image-exclusion-settings/index.ts`, `src/shared/page-image-candidates/index.ts`, `src/shared/script-settings/index.ts`, `userscripts.md`, `vite.config.ts`

#### 1.2.1 - 2026-07-04
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/native-video-volume-setter/i18n.ts`, `src/shared/types/d-anime-cf-ranking.ts`, `src/shared/types/twitter-clean-timeline.ts`, `vite.config.ts`

#### 1.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 動画音量の保存、復元、対象 video 要素の制御を変更。
- 主な変更ファイル: `README.md`, `src/native-video-volume-setter/i18n.ts`, `src/native-video-volume-setter/main.ts`, `src/native-video-volume-setter/settings-panel.ts`, `src/native-video-volume-setter/video-controller.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`

#### 1.1.2 - 2026-01-18
- 動画音量の保存、復元、対象 video 要素の制御を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/native-video-volume-setter/video-controller.ts`, `vite.config.ts`

#### 1.1.1 - 2025-12-09
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/native-video-volume-setter/settings-panel.ts`, `vite.config.ts`

#### 1.1.0 - 2025-12-09
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/native-video-volume-setter/main.ts`, `src/native-video-volume-setter/settings-panel.ts`, `vite.config.ts`

#### 1.0.0 - 2025-12-07
- 動画音量の保存、復元、対象 video 要素の制御を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/native-video-volume-setter/main.ts`, `src/native-video-volume-setter/video-controller.ts`, `src/native-video-volume-setter/volume-settings.ts`, `userscripts.md`, `vite.config.ts`

### x-auto-spam-reporter

#### 1.2.1 - 2026-07-04
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/x-auto-spam-reporter/i18n.ts`, `src/x-auto-spam-reporter/main.ts`, `vite.config.ts`

#### 1.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.1.2 - 2026-06-26
- スパム報告対象の検出、選択、送信操作を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/shared/logger/index.ts`, `vite.config.ts`

#### 1.1.1 - 2025-12-12
- スパム報告対象の検出、選択、送信操作を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/x-auto-spam-reporter/main.ts`, `vite.config.ts`

#### 1.1.0 - 2025-12-12
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/x-auto-spam-reporter/main.ts`, `src/x-auto-spam-reporter/ui.ts`, `vite.config.ts`

#### 1.0.0 - 2025-12-11
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `src/shared/icons/mdi.ts`, `src/shared/types/index.ts`, `src/shared/types/x-auto-spam-reporter.ts`, `src/x-auto-spam-reporter/main.ts`, `src/x-auto-spam-reporter/reporter.ts`, `src/x-auto-spam-reporter/selectors.ts`, `src/x-auto-spam-reporter/ui.ts`

### x-community-note-close

#### 1.0.1 - 2026-07-04
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- Community Notes モーダルの背景クリック閉じ処理を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`

#### 1.0.0 - 2026-03-26
- Community Notes モーダルの背景クリック閉じ処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/x-community-note-close/backdrop-close.ts`, `src/x-community-note-close/main.ts`, `vite.config.ts`

### hf-download-command-copier

#### 1.2.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/hf-download-command-copier/i18n.ts`, `src/hf-download-command-copier/main.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`

#### 1.1.0 - 2026-05-12
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/hf-download-command-copier/main.ts`, `vite.config.ts`

#### 1.0.1 - 2026-05-12
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `userscripts.md`, `vite.config.ts`

#### 1.0.0 - 2026-05-12
- スクリプトの起動、初期化、ページ監視処理を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/hf-download-command-copier/main.ts`, `vite.config.ts`

### trickcal-tool-sweep

#### 1.3.2 - 2026-07-04
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `vite.config.ts`

#### 1.3.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.3.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `src/trickcal-tool-sweep/i18n.ts`, `src/trickcal-tool-sweep/main.ts`, `userscripts.md`, `vite.config.ts`

#### 1.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.1.0 - 2026-05-30
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/trickcal-tool-sweep/main.ts`, `userscripts.md`, `vite.config.ts`

#### 1.0.0 - 2026-05-30
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/trickcal-tool-sweep/main.ts`, `userscripts.md`, `vite.config.ts`

### khinsider-direct-link-saver

#### 1.5.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.5.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/khinsider-direct-link-saver/i18n.ts`, `src/khinsider-direct-link-saver/main.ts`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `userscripts.md`, `vite.config.ts`

#### 1.4.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/khinsider-direct-link-saver/i18n.ts`, `src/khinsider-direct-link-saver/main.ts`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`

#### 1.3.0 - 2026-06-08
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `src/khinsider-direct-link-saver/main.ts`, `userscripts.md`, `vite.config.ts`

#### 1.1.2 - 2026-06-08
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/khinsider-direct-link-saver/main.ts`, `vite.config.ts`

#### 1.1.1 - 2026-06-08
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/khinsider-direct-link-saver/main.ts`, `vite.config.ts`

#### 1.1.0 - 2026-06-08
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `src/khinsider-direct-link-saver/main.ts`, `userscripts.md`, `vite.config.ts`

#### 1.0.0 - 2026-06-08
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/khinsider-direct-link-saver/main.ts`, `userscripts.md`, `vite.config.ts`

### yahoo-mail-mark-read

#### 1.2.1 - 2026-07-04
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/yahoo-mail-mark-read/i18n.ts`, `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.2.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- スパム報告対象の検出、選択、送信操作を変更。
- 通信、API 呼び出し、リクエスト制限、レスポンス解析を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.1.0 - 2026-06-26
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.0.4 - 2026-06-23
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.0.3 - 2026-06-10
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.0.2 - 2026-06-10
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.0.1 - 2026-06-10
- スクリプトの起動、初期化、ページ監視処理を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/yahoo-mail-mark-read/main.ts`, `vite.config.ts`

#### 1.0.0 - 2026-06-10
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/yahoo-mail-mark-read/main.ts`, `userscripts.md`, `vite.config.ts`

### youtube-ui-modifier

#### 1.8.5 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/youtube-ui-modifier/dom-marker.ts`, `vite.config.ts`

#### 1.8.4 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/youtube-ui-modifier/dom-marker.ts`, `vite.config.ts`

#### 1.8.3 - 2026-07-04
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/youtube-ui-modifier/css-rules.ts`, `src/youtube-ui-modifier/dom-marker.ts`, `vite.config.ts`

#### 1.8.2 - 2026-07-04
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `src/youtube-ui-modifier/i18n.ts`, `src/youtube-ui-modifier/settings-definitions.ts`, `vite.config.ts`

#### 1.8.1 - 2026-07-04
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `bun.lock`, `package.json`, `src/shared/types/d-anime-cf-ranking.ts`, `src/shared/types/twitter-clean-timeline.ts`, `src/youtube-ui-modifier/i18n.ts`, `vite.config.ts`

#### 1.8.0 - 2026-07-04
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 主な変更ファイル: `package.json`, `src/shared/types/youtube-ui-modifier.ts`, `src/youtube-ui-modifier/app.ts`, `src/youtube-ui-modifier/css-rules.ts`, `src/youtube-ui-modifier/dom-marker.ts`, `src/youtube-ui-modifier/i18n.ts`, `src/youtube-ui-modifier/settings-definitions.ts`, `src/youtube-ui-modifier/settings-storage.ts`

#### 1.7.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/i18n/index.ts`, `src/shared/launch-style/index.ts`, `src/youtube-ui-modifier/i18n.ts`, `userscripts.md`, `vite.config.ts`

#### 1.6.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/launch-style/index.ts`, `src/youtube-ui-modifier/i18n.ts`, `src/youtube-ui-modifier/settings-ui.ts`, `userscripts.md`, `vite.config.ts`

#### 1.5.0 - 2026-06-27
- 起動スタイル選択とメニュー連携を変更。
- 設定 UI、設定項目、既定値、保存形式を変更。
- 日本語と多言語表示の翻訳辞書、ロケール検出、フォールバックを変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 主な変更ファイル: `README.md`, `src/shared/constants/d-anime.ts`, `src/shared/constants/imgur.ts`, `src/shared/constants/index.ts`, `src/shared/constants/manga.ts`, `src/shared/constants/twitter.ts`, `src/shared/constants/youtube.ts`, `src/shared/dom/index.ts`

#### 1.4.1 - 2026-06-26
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-ui-modifier/main.ts`, `vite.config.ts`

#### 1.4.0 - 2026-06-26
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-ui-modifier/settings-ui.ts`, `src/youtube-ui-modifier/ui-styles.ts`, `vite.config.ts`

#### 1.3.0 - 2026-06-26
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `src/shared/types/youtube-ui-modifier.ts`, `src/youtube-ui-modifier/app.ts`, `src/youtube-ui-modifier/constants.ts`, `src/youtube-ui-modifier/css-rules.ts`, `src/youtube-ui-modifier/main.ts`, `src/youtube-ui-modifier/settings-definitions.ts`, `src/youtube-ui-modifier/settings-storage.ts`, `vite.config.ts`

#### 1.2.1 - 2026-06-26
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `src/youtube-ui-modifier/settings-ui.ts`, `vite.config.ts`

#### 1.2.0 - 2026-06-26
- 設定 UI、設定項目、既定値、保存形式を変更。
- 画面 UI、ボタン、モーダル、スタイルを変更。
- ページ DOM の判定、マーカー属性、CSS 注入、非表示制御を変更。
- 対象ページの DOM 解析と操作アプリ本体を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/shared/types/index.ts`, `src/shared/types/youtube-ui-modifier.ts`, `src/youtube-ui-modifier/app.ts`, `src/youtube-ui-modifier/constants.ts`, `src/youtube-ui-modifier/css-rules.ts`, `src/youtube-ui-modifier/dom-marker.ts`

### yahoo-mail-ad-cleaner

#### 1.0.1 - 2026-07-04
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `package.json`, `vite.config.ts`

#### 1.0.0 - 2026-07-02
- スクリプトの起動、初期化、ページ監視処理を変更。
- 共通ヘルパー、型定義、アイコン、ログ出力を変更。
- README と userscripts 一覧の導線を変更。
- 依存関係、実行環境、ビルド設定を変更。
- ユーザースクリプトのメタデータ、match/connect、配布ファイルを変更。
- 主な変更ファイル: `README.md`, `package.json`, `src/yahoo-mail-ad-cleaner/main.ts`, `userscripts.md`, `vite.config.ts`
