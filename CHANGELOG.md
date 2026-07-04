# 変更履歴

このプロジェクトの主な変更は Keep a Changelog 形式で記録します。

## [Unreleased]

### Added

- 共通 i18n 基盤 `src/shared/i18n` を追加し、ロケール検出、フォールバック、RTL 判定、欠落キー検出を利用できるようにしました。
- `imgur-direct-link` のコピーボタンと通知文言を多言語化しました。
- `youtube-info-copier` の操作 UI とコピー本文の見出しを多言語化しました。
- `chatgpt-notify` の設定 UI と通知文言を多言語化しました。
- `native-video-volume-setter` の設定パネルを多言語化しました。
- `hf-download-command-copier` のボタンと通知文言を多言語化しました。
- `yahoo-mail-mark-read` の追加ボタン、通知、エラー文言を多言語化しました。
- `khinsider-direct-link-saver` のパネルと進捗文言を多言語化しました。
- `trickcal-tool-sweep` のメニューと完了メッセージを多言語化しました。
- `x-auto-spam-reporter` の操作ボタン、通知、エラー文言を多言語化しました。
- `twitter-clean-timeline` の設定 UI とプレースホルダー文言を多言語化しました。
- `twitter-thread-copier` の操作 UI、通知、翻訳設定モーダルを多言語化しました。
- `manga-viewer` の起動 UI、ビューア操作、読み込み進捗、エラー表示を多言語化しました。
- `image-collector` のメニュー、進捗、プレースホルダー、ZIP 操作文言を多言語化しました。
- `d-anime-cf-ranking` の設定パネル、詳細ランキング、バッジ tooltip を多言語化しました。
- `youtube-ui-modifier` のメニュー、モーダル外枠、復帰ボックスの操作文言を多言語化しました。
- `d-anime-nico-comment-renderer` の通知種別と設定保存/読み込み系通知を多言語化しました。
- `youtube-ui-modifier` の設定カテゴリ、設定項目ラベル、説明文を多言語化しました。
- `d-anime-nico-comment-renderer` の設定 UI、検索 UI、動画切り替え通知を多言語化しました。
- `twitter-clean-ui` のプロファイル削除ボタン文言を多言語化しました。
- `manga-viewer` と `youtube-info-copier` の起動スタイル切り替えメニューを多言語化しました。
- `twitter-thread-copier` の翻訳完了通知と翻訳設定エラー文言を多言語化しました。
- 共通 i18n 基盤に日本語＋主要10言語のロケール定義、ロケール表示名、標準エイリアス、翻訳補完ヘルパーを追加しました。
- `trickcal-tool-sweep`、`khinsider-direct-link-saver`、`twitter-clean-timeline` の辞書を主要10言語の実翻訳へ拡張しました。
- `image-collector`、`d-anime-cf-ranking`、`manga-viewer`、`twitter-thread-copier`、`d-anime-nico-comment-renderer`、`youtube-ui-modifier`、`twitter-clean-ui`、共通起動スタイルメニューを主要10言語の実翻訳へ拡張しました。
- `youtube-ui-modifier` の設定カテゴリ、設定項目ラベル、設定説明文を主要10言語の実翻訳へ拡張しました。
- `youtube-ui-modifier` の設定モーダルに自動追従対応の表示言語プルダウンを追加しました。
- `yahoo-mail-ad-cleaner` を追加し、Yahoo!メール PC版に残る広告枠と空きカラムを非表示にできるようにしました。

### Changed

- `image-collector` と `manga-viewer` に Tampermonkey のスクリプト一覧向け独自アイコンを追加し、バージョンをそれぞれ `5.4.2`、`10.10.2` に更新しました。
- `trickcal-tool-sweep` の Rank 8 素材画像をトリッカル Wiki の鮮明な画像アセットへ差し替え、バージョンを `1.3.2` に更新しました。
- `youtube-ui-modifier` の日本語表示時に設定カテゴリ、設定項目ラベル、説明文が英語へフォールバックする問題を修正しました。
- 開発依存関係を更新し、依存関係監査で検出された脆弱性を解消しました。
- `youtube-ui-modifier` 以外の全ユーザースクリプトを audit 対応の再ビルドとしてパッチバージョン更新しました。
- `youtube-ui-modifier` の「作成ボタンを隠す」説明文から実装者向けの表現を削除しました。
- `twitter-clean-ui` の多言語処理を共通 i18n 基盤へ移行し、設定 UI の未翻訳文言を辞書管理へ寄せました。
- `twitter-clean-ui` のバージョンを `1.13.0` に更新しました。
- `imgur-direct-link` のバージョンを `3.3.0` に更新しました。
- `youtube-info-copier` のバージョンを `2.5.0` に更新しました。
- `chatgpt-notify` のバージョンを `2.2.0` に更新しました。
- `native-video-volume-setter` のバージョンを `1.2.0` に更新しました。
- `hf-download-command-copier` のバージョンを `1.2.0` に更新しました。
- `yahoo-mail-mark-read` のバージョンを `1.2.0` に更新しました。
- `khinsider-direct-link-saver` のバージョンを `1.4.0` に更新しました。
- `trickcal-tool-sweep` のバージョンを `1.2.0` に更新しました。
- `x-auto-spam-reporter` のバージョンを `1.2.0` に更新しました。
- `twitter-clean-timeline` のバージョンを `1.6.0` に更新しました。
- `twitter-thread-copier` のバージョンを `6.9.0` に更新しました。
- `manga-viewer` のバージョンを `10.8.0` に更新しました。
- `image-collector` のバージョンを `5.3.0` に更新しました。
- `d-anime-cf-ranking` のバージョンを `1.4.0` に更新しました。
- `youtube-ui-modifier` のバージョンを `1.5.0` に更新しました。
- `d-anime-nico-comment-renderer` のバージョンを `7.4.0` に更新しました。
- `youtube-ui-modifier` のバージョンを `1.6.0` に更新しました。
- `d-anime-nico-comment-renderer` のバージョンを `7.5.0` に更新しました。
- `twitter-clean-ui` のバージョンを `1.14.0` に更新しました。
- `manga-viewer` のバージョンを `10.9.0` に更新しました。
- `youtube-info-copier` のバージョンを `2.6.0` に更新しました。
- `twitter-thread-copier` のバージョンを `6.10.0` に更新しました。
- ルートパッケージのバージョンを `2.2.0` に更新しました。
- `d-anime-cf-ranking` のバージョンを `1.5.0` に更新しました。
- `d-anime-nico-comment-renderer` のバージョンを `7.6.0` に更新しました。
- `image-collector` のバージョンを `5.4.0` に更新しました。
- `khinsider-direct-link-saver` のバージョンを `1.5.0` に更新しました。
- `manga-viewer` のバージョンを `10.10.0` に更新しました。
- `trickcal-tool-sweep` のバージョンを `1.3.0` に更新しました。
- `twitter-clean-timeline` のバージョンを `1.7.0` に更新しました。
- `twitter-thread-copier` のバージョンを `6.11.0` に更新しました。
- `twitter-clean-ui` のバージョンを `1.15.0` に更新しました。
- `youtube-ui-modifier` のバージョンを `1.7.0` に更新しました。
- `youtube-ui-modifier` の YouTube 表示言語に依存していた一部の判定を多言語対応に変更しました。
- `youtube-ui-modifier` のバージョンを `1.8.0` に更新しました。
- `youtube-ui-modifier` のバージョンを `1.8.1` に更新しました。
- `youtube-ui-modifier` のバージョンを `1.8.2` に更新しました。
- ルートパッケージのバージョンを `2.3.0` に更新しました。
- ルートパッケージのバージョンを `2.4.0` に更新しました。
- ルートパッケージのバージョンを `2.5.0` に更新しました。
- ルートパッケージのバージョンを `2.5.1` に更新しました。
- ルートパッケージのバージョンを `2.5.2` に更新しました。
- ルートパッケージのバージョンを `2.5.3` に更新しました。
