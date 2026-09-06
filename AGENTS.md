# AGENTS.md

## 作業開始前の必須手順（最優先・例外なし）

1. エージェントは、調査、計画、コマンド実行、スキル利用、ファイル編集、コミット、プッシュを始める前に、必ずリポジトリ直下の `.\COMMON-AGENTS.md` を開き、先頭から末尾まで全文を読む。
2. `COMMON-AGENTS.md` はGit管理外のシンボリックリンクである。`git`や既定のignore設定が有効な`rg --files`の検索結果だけで、ファイルが存在しないと判断してはならない。PowerShellでは最初に次を実行する。

```powershell
Get-Content -Raw -LiteralPath .\COMMON-AGENTS.md
```

3. 読み取りに失敗した場合、出力が省略された場合、または末尾まで読めたことを確認できない場合は、一切の作業を開始せず、パスとシンボリックリンク先を確認して全文を再取得する。必要なら分割して末尾まで読む。
4. 全文を読了するまで、ローカル `AGENTS.md` だけを根拠に作業を続けてはならない。読了後は `COMMON-AGENTS.md` を最優先の指針とし、読了直後の最初の進捗報告で全文を読了したことを明示する。
   このファイルでは `web-page-enhancement-scripts` 固有の補足だけを記載する。

## ルール

- PowerShellでファイルの読み書きをする代わりに、可能な限り編集用のネイティブツールを使用する。
- 変更（コミット）ごとにバージョンを上げる。
- ファイル名の命名規則はケバブケース。
- 型 `any` を使用しない。`unknown` か、より具体的な型を使用し、常に具体的な型を利用する。
- 新規スクリプト追加時は `scripts/build-all.mjs`、`vite.config.ts`、`README.md`、`userscripts.md` も更新する。

## プロジェクト構成

- `src/d-anime` は `d-anime-nico-comment-renderer.user.js` を編集するためのプロジェクト。
- `src/d-anime-cf-ranking` は `d-anime-cf-ranking.user.js` を編集するためのプロジェクト。
- `src/chatgpt-notify` は `chatgpt-notify.user.js` を編集するためのプロジェクト。
- `src/fanbox-floating-menu` は `fanbox-floating-menu.user.js` を編集するためのプロジェクト。
- `src/fanbox-pagination-helper` は `fanbox-pagination-helper.user.js` を編集するためのプロジェクト。
- `src/image-collector` は `image-collector.user.js` を編集するためのプロジェクト。
- `src/imgur-direct-link` は `imgur-direct-link.user.js` を編集するためのプロジェクト。
- `src/manga-viewer` は `book-style-manga-viewer.user.js` を編集するためのプロジェクト。
- `src/twitter-clean-timeline` は `twitter-clean-timeline.user.js` を編集するためのプロジェクト。
- `src/twitter-clean-ui` は `twitter-clean-ui.user.js` を編集するためのプロジェクト。
- `src/twitter-full-size-image` は `twitter-full-size-image.user.js` を編集するためのプロジェクト。
- `src/twitter-thread-copier` は `twitter-thread-copier.user.js` を編集するためのプロジェクト。
- `src/youtube-info-copier` は `youtube-info-copier.user.js` を編集するためのプロジェクト。
- `scripts/build-all.mjs` はすべてのプロジェクトをビルドするためのスクリプト。`vite.config.ts` の build コマンド `bun run build` はこのスクリプトを実行している。
- ルートディレクトリの `vite.config.ts` は各プロジェクトのビルド設定を行っている。ここにバージョン情報もある。
- `docs` フォルダには開発チェックリストや実際のWebページのコードスニペット、ニコニコ動画のAPI仕様書などがある。

## バージョン管理

- ビルドする前に `vite.config.ts` を編集しバージョンを上げる。
- `src/d-anime/config/default-settings.ts` の `USERSCRIPT_VERSION_UI_DISPLAY` は、ビルド時に `vite.config.ts` の対象スクリプトのバージョンから自動生成されるため、手動更新しない。
- バージョンアップの目安は、パッチ（v.x.y.z の z 部分）が軽微なバグフィックス、マイナー（v.x.y.z の y 部分）が機能追加、メジャー（v.x.y.z の x 部分）が大幅な機能追加や破壊的変更。

## 変更履歴

- `main` / `origin/main` に push した時点でリリース済みとして扱う。`CHANGELOG.md` に `Unreleased` 節を作らない。
- `CHANGELOG.md` はスクリプトごとの実バージョン単位で記録する。リポジトリ全体の雑多な箇条書きや「バージョンを上げた」だけの記述にしない。
- コミットメッセージは参考情報に留め、変更履歴は実際の差分、変更ファイル、ユーザーに見える挙動を基に書く。
- 複数スクリプトのバージョンを同時に上げた場合も、各スクリプトの節にそれぞれ該当バージョンの内容を書く。

## apkcube.com 対応の知見（2026-09-06 確認）

- 詳細ページは `https://apkcube.com/<slug>/<appId>`、ダウンロードページは `https://apkcube.com/<slug>/<appId>/download`。
- APK 一覧は `GET /api/apps/<packageId>/apks?k=<token>`、実行は `POST /api/downloads/request` → `{url}` → `window.location.assign(url)`。公式バンドルは `1529`（実行フロー `V`）、`5206`（API 呼び出し）、`4704`（Turnstile・長押し・PoW）、`6280`（広告設定 `adblockWaitSeconds:30`）。
- 検出二本立て: `fetch("/ads/banner-ad.js")` の応答マーカー `__ad_probe_ok__` と、`#ad-banner.adsbox...` の bait 計測。非表示 CSS で bait のクラス・ID を隠すと自ら検出を引き起こすため、広告非表示は配信ドメイン由来の要素だけを対象にする（`src/apkcube-direct-download/selectors.test.mjs` で衝突を検査）。
- 取得済み公式資産は `.apkcube-sandbox/official-assets/<YYYY-MM-DD>/` に世代ディレクトリで保管する（Git 管理対象）。世代更新時はチャンク hash・`MANIFEST.md` の対応表で差分を取り、検出経路の変化を確認する。
- CDP 検証では `Page.addScriptToEvaluateOnNewDocument` でビルド済み userscript を `document-start` 相当で注入できる。ただし注入時点では `documentElement` が無いため、DOM 依存処理は存在確認後の遅延実行にする（`gate-bypass.ts` の教訓）。
- 検証用 Chrome は手動起動のまま残すと後続作業と競合するため、検証後は `PUT /json/close/<targetId>` で後片付けし、不要になればデバッグプロセスを停止する。
