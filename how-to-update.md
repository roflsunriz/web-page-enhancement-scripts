# 更新手順

## 前提

- Bun 1.3.8 以上を使用します。
- 作業前に `git status --short` で未コミット変更を確認します。

管理設定だけを変更する場合は、個別スクリプトの版を動かさず `package.json` のリポジトリ版だけを上げます。PR 用 CI は `bun install --frozen-lockfile` と `bun audit` を使用し、`PR Quick Checks` も Bun で lint と型検査を行います。`.github/workflows/dependabot-automation.yml` の共通処理 SHA と実際の CI 名を確認し、`actionlint` と PR のチェック結果で検証します。問題があれば設定コミットを revert し、取り込まれた依存更新は通常の revert コミットで戻します。

## 通常更新

1. 対象スクリプトのソースを更新します。
2. `vite.config.ts` の対象スクリプトの `version` を上げます。
   - `d-anime` の設定画面に表示するバージョンも、この値からビルド時に自動生成されます。`src/d-anime/config/default-settings.ts` は手動更新しません。
3. ユーザー向けの挙動や設定項目が変わる場合は、`README.md`、`userscripts.md` を更新します。
4. `CHANGELOG.md` を対象スクリプトの実バージョン単位で更新します。`main` / `origin/main` に push した時点でリリース済みなので、`Unreleased` 節は作りません。
5. 変更履歴はコミットメッセージではなく、実際の差分、変更ファイル、ユーザーに見える挙動を基に書きます。「バージョンを上げた」だけの記述は避けます。
6. 検証を実行します。

```powershell
bun run lint
bun run format
bun run type-check
bun run build
bun run test
```

`bun run test` は、`d-anime` の生成済みメタデータ、metaファイル、設定画面用のバージョンがすべて一致することも検証します。この検証だけを再実行する場合は、ビルド後に次のコマンドを実行します。

```powershell
bun run check:d-anime-version
```

## 復旧方針

- ビルド生成物に問題がある場合は、生成元を修正してから `bun run build` を再実行します。
- `d-anime` のメタデータと設定画面のバージョンが一致しない場合は、`vite.config.ts` の対象 `version` とバージョン注入設定を確認し、`src/d-anime/config/default-settings.ts` へ固定値を書き戻さずに修正します。
- 依存関係を変更した場合は、`bun.lock` の差分を確認し、問題があれば依存関係の変更を取り消して再検証します。

CI 完了より Dependabot の分類が遅れる場合は、`callback_workflow_file` が指す呼び出し側 workflow を `workflow_dispatch` し、同じ PR 番号・head SHA・全チェックを再確認する。呼び出し側のファイル名を変える際はこの入力も一緒に更新する。
