# 変更履歴

このプロジェクトの主な変更は Keep a Changelog 形式で記録します。

## [Unreleased]

### Added

- 共通 i18n 基盤 `src/shared/i18n` を追加し、ロケール検出、フォールバック、RTL 判定、欠落キー検出を利用できるようにしました。

### Changed

- `twitter-clean-ui` の多言語処理を共通 i18n 基盤へ移行し、設定 UI の未翻訳文言を辞書管理へ寄せました。
- `twitter-clean-ui` のバージョンを `1.12.6` に更新しました。
