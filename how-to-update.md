# 更新手順

## 前提

- Bun 1.3.8 以上を使用します。
- 作業前に `git status --short` で未コミット変更を確認します。

## 通常更新

1. 対象スクリプトのソースを更新します。
2. `vite.config.ts` の対象スクリプトの `version` を上げます。
3. `d-anime` を更新する場合は、`src/d-anime/config/default-settings.ts` の `USERSCRIPT_VERSION_UI_DISPLAY` も同じ値へ更新します。
4. ユーザー向けの挙動や設定項目が変わる場合は、`README.md`、`userscripts.md`、`CHANGELOG.md` を更新します。
5. 検証を実行します。

```powershell
bun run lint
bun run format
bun run type-check
bun run build
```

## 復旧方針

- ビルド生成物に問題がある場合は、生成元を修正してから `bun run build` を再実行します。
- 依存関係を変更した場合は、`bun.lock` の差分を確認し、問題があれば依存関係の変更を取り消して再検証します。
