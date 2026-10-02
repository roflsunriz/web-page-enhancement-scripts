# 更新手順

## 前提

- Bun 1.3.8 以上を使用します。
- 作業前に `git status --short` で未コミット変更を確認します。

管理設定だけを変更する場合は、個別スクリプトの版を動かさず `package.json` のリポジトリ版だけを上げます。PR 用 CI は `bun install --frozen-lockfile` と `bun audit` を使用し、`PR Quick Checks` も Bun で lint と型検査を行います。`.github/workflows/dependabot-automation.yml` の共通処理 SHA と実際の CI 名を確認し、`actionlint` と PR のチェック結果で検証します。問題があれば設定コミットを revert し、取り込まれた依存更新は通常の revert コミットで戻します。

分類が CI より遅れる場合は `callback_workflow_file` が指す呼び出し側 workflow を `workflow_dispatch` し、同じ PR 番号・head SHA・全チェックを再確認します。ファイル名を変更するときはこの入力も一緒に更新します。

## 通常更新

1. 対象スクリプトのソースを更新します。
2. `vite.config.ts` の対象スクリプトの `version` を上げます。
   - `d-anime` の設定画面に表示するバージョンも、この値からビルド時に自動生成されます。`src/d-anime/config/default-settings.ts` は手動更新しません。
3. ユーザー向けの挙動や設定項目が変わる場合は、`README.md`、`userscripts.md` を更新します。
4. `CHANGELOG.md` を対象スクリプトの実バージョン単位で更新します。未公開の独立worktree変更は `Unreleased` に記録し、承認された公開時に実バージョンの履歴へ移します。`main` / `origin/main` に push した時点でリリース済みとして扱います。
5. 変更履歴はコミットメッセージではなく、実際の差分、変更ファイル、ユーザーに見える挙動を基に書きます。「バージョンを上げた」だけの記述は避けます。
6. 検証を実行します。

```powershell
bun run lint
bun run format
bun run type-check
bun run build
bun run test
```

`bun run test` は Chrome を使ったオフラインの YouTube UI Modifier 回帰テストも実行します。早期起動、動画情報の遅延描画、前の動画のDOMが残る遷移、設定切り替え、複数画面幅を確認します。単独実行は `node scripts/youtube-ui-modifier-regression.mjs` です。実サイトでの併用検証の条件は `verification.md` を参照してください。

`bun run test` は、`d-anime` の生成済みメタデータ、metaファイル、設定画面用のバージョンがすべて一致することも検証します。この検証だけを再実行する場合は、ビルド後に次のコマンドを実行します。

```powershell
bun run check:d-anime-version
```

新規ニコニコ動画スワイプ全画面の単独ビルドは `bunx --no-install vite build --mode nico-mobile-swipe-fullscreen`、操作回帰は `node scripts/nico-mobile-swipe-fullscreen-regression.mjs` です。横画面ロックが失敗した場合は端末を手動で回転します。利用停止はuserscript managerでこのスクリプトを無効にしてページを再読み込みします。設定・依存の追加は不要です。

## モバイル公式再生設定の更新

`bunx --no-install vite build --mode nico-player-premium-controls` で単独ビルド、`bun test src/nico-player-premium-controls/eligibility.test.mjs` と `node scripts/nico-player-premium-controls-regression.mjs` で検査します。通常の `bun run build` / `bun run test` にも含まれます。

`scripts/nico-native-import-plugin.ts` はこのターゲットのnative dynamic importのみを一時マーカーに置換し、monkeyのIIFE生成後に戻します。SystemJSではサイトのネイティブESMキャッシュを共有できないためです。置換数や出力形式が変わればビルドを失敗させます。生成物に `@require` / `System.register` がなく、標準importが1件あることも回帰検証します。distを手編集しません。

公式の2種類のprops構造、React fiberの`memoCache`、コントローラー構造が変わった場合は採取済み資産と実ページを比較してください。会員データ全体やfetch/XHRを改変する方法へ拡大しません。停止時はuserscript managerで無効化して再読み込みします。

実ページの単独検査は `node scripts/nico-player-premium-controls-live.mjs`。既存Chromeの新規一時コンテキストで公開動画を開くため、ネットワークと約1〜3分が必要です。既存プロファイルと認証は使用しません。公式広告終了待ちは45秒、SPA準備は30秒、全体は180秒で打ち切ります。未対応構造・通信失敗は検査失敗として報告し、ブラウザ設定は変更しません。

## 復旧方針

- ビルド生成物に問題がある場合は、生成元を修正してから `bun run build` を再実行します。
- `d-anime` のメタデータと設定画面のバージョンが一致しない場合は、`vite.config.ts` の対象 `version` とバージョン注入設定を確認し、`src/d-anime/config/default-settings.ts` へ固定値を書き戻さずに修正します。
- 依存関係を変更した場合は、`bun.lock` の差分を確認し、問題があれば依存関係の変更を取り消して再検証します。

## 汎用動画スワイプ全画面

依存を導入済みの作業ツリーで `bunx --no-install vite build --mode video-swipe-fullscreen` を実行します。専用版の協調マーカーを変更した場合は `bunx --no-install vite build --mode nico-mobile-swipe-fullscreen` も実行します。回帰は `bun run test:video-swipe-fullscreen` と `node scripts/nico-mobile-swipe-fullscreen-regression.mjs`、通常検査はlint・型検査・全ビルド・`bun run test`です。ブラウザ回帰には既存Google Chromeを使用します。

実サイトの再調査は `node scripts/video-swipe-site-audit.mjs` です。公開サイトへ通信するため通常のオフライン回帰やCIには含めません。分離された一時プロファイルを使用し、ログイン・bot対策回避・既存認証の変更はしません。`VIDEO_SWIPE_SITES` でサイト名のカンマ区切り、`VIDEO_SWIPE_AUDIT` で証拠の出力先を指定できます。標準スワイプと識別属性を実測し、調査結果と狭い除外が必要かを見直します。

配布はREADMEの公開インストールリンクまたは `dist/video-swipe-fullscreen.user.js` を使用します。更新URLは `vite.config.ts` の公開main向け設定から生成します。無効化・復旧はmanagerで本スクリプトを無効にして再読み込みします。ニコニコ専用版1.0.0との併用中は汎用版の同サイト設定を有効にしません。公開前に最新origin/mainとの整合、依存監査、全テストを確認し、通常push後にリモートSHA・配布ファイル・CIを確認します。他worktreeの未公開変更は混ぜません。
