# プロジェクト固有の知見

共通指針と [AGENTS.md](AGENTS.md) を読んだ後、作業前にこの文書を全文読む。元の条件・確認日・未検証事項を保ったまま、固有の実現手段と再利用する知見を集約する。

## 共通指針の具体化と適用範囲

- 対象: 共通指針の「設計と実装方針」「検証」「更新手順」「ドキュメント」と、各節に明記した共通ルール。
- 理由・範囲: Bun/Viteで複数のuserscriptを生成する。バージョン・履歴の管理、翻訳対象文言の照合、サイト固有の検証には下記の適用条件がある。ユーザーが明示した変更禁止・版管理・公開条件は移行によって緩和しない。
- 代替手段・検証: 以下の実効コマンド・根拠を用い、[検証記録](verification.md) で成功・未検証を区別する。共通方針の完了条件やユーザーの明示指示は弱めない。

## CIの品質検査matrix

- 依存監査、lint、型検査、テスト、全userscriptビルドは同じ固定lockfileから独立して実行できるため、CIではBunキャッシュを共有するfail-fast matrixとして並列実行する。スクリプトの生成順に依存する個別処理をmatrixへ追加する場合は、同じジョブ内へ戻すか成果物依存を明示する。

## AGENTS.mdから移した知見

## ルール

- PowerShellでファイルの読み書きをする代わりに、可能な限り編集用のネイティブツールを使用する。
- 変更（コミット）ごとにバージョンを上げる。
- ユーザースクリプトを変更しない管理設定だけのコミットでは、ユーザーの2026-09-23指定に従って `package.json` のリポジトリ版だけを上げる。個別スクリプトの版は実体に変更があるときだけ上げる。`CHANGELOG.md` には対象を取り違えないよう、リポジトリ運用の節で理由と検証を記録する。
- ファイル名の命名規則はケバブケース。
- 型 `any` を使用しない。`unknown` か、より具体的な型を使用し、常に具体的な型を利用する。
- 新規スクリプト追加時は `scripts/build-all.mjs`、`vite.config.ts`、`README.md`、`userscripts.md` も更新する。

## プロジェクト構成

- `src/bilibili-jp-localize` は `bilibili-jp-localize.user.js` を編集するためのプロジェクト。
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

- `main` / `origin/main` に push した時点でリリース済みとして扱う。公開を依頼されていない独立worktreeの変更は共通ルールに従って `Unreleased` に記録し、公開済みの実バージョンとは区別する。
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

## manga-viewer 回帰テストの知見（2026-09-06 確認）

- `scripts/nicomanga-image-collection-regression.mjs` は完全オフラインの hermetic フィクスチャ。nicomanga.com の URL は `page.route("**/*")` で全充足する識別子であり、外部サーバーへの実通信は発生しない。未知要求も 204 で空充足する。
- ページめくり中間状態の観測はタイマーポーリングだけに頼らない。WebGL カール用 Canvas の style 監視に加え、従来描画経路の中間フレーム（`.mv-flip-page` の class/style 書き換え）を `.mv-flip-book` 全体の MutationObserver で同期観測する。WebGL 無効環境の高解像度 CI で取り逃がしタイムアウトが再発した教訓（`captureMangaViewerPageTurnAnimation`）。
- 2026-09-23 に同じコミットの CI で漫画ビューアの中間フレーム観測が初回だけ5秒でタイムアウトし、失敗ジョブ1回の再実行では成功した。再発時は `scripts/nicomanga-image-collection-regression.mjs` の最終 spread と `__pageFlipDebug.lastStarted`、MutationObserver の観測を照合し、テスト無効化や期待値緩和をしない（`verification.md`）。
- その後、別コミットでは初回と失敗ジョブ再実行の両方で同じ観測タイムアウトが発生した。最終 spread が正しい場合に限り、元の見開きへ戻して最大3回の再観測を行う。中間フレームの形状検査は成功した観測結果に対して必ず実施する。
- Dependabot PR は `pull_request` イベントの `GITHUB_TOKEN` がラベル書き込みを拒否するため、ラベル付けは `pull_request_target` で PR コードをチェックアウトせず、明示した `issues: write`／`pull-requests: write` 権限で実行する。該当ラベルのない `chore(deps)` は正常終了させ、CI 成功後の自動処理を不要に止めない。

## dアニメストア公式資産の世代管理

- 取得済み公式資産は `.d-anime-sandbox/official-assets/<YYYY-MM-DD>/` に世代ディレクトリで置く（Git 管理対象、`.apkcube-sandbox` と同型）。`chunks/` が生ファイル、`formatted/` が整形済み、各世代の `MANIFEST.md` が対応表。
- 世代の正本は `test-fixtures/d-anime/official-assets-manifest.json`（`assetDirectory` が現行世代を指す）。更新時は取得スクリプトを再実行し、旧世代ディレクトリを消さずに残す。運用方針は `.d-anime-sandbox/official-assets/README.md` に従う。

## YouTube UI Modifier の起動と待機（2026-09-27 確認）

- `document-start` では `documentElement` 自体がない場合があり、コンストラクター内のスタイル挿入が同期例外になる。`main.ts` はDOM準備後に構築し、コンストラクターの失敗も捕捉する。回帰検証は `scripts/youtube-ui-modifier-regression.mjs`。
- 視聴ページのSPA遷移では前の動画のDOMが残るため、単なる要素存在では準備完了としない。`page-readiness.ts` は表示中の視聴コンテナー内の `ytd-watch-metadata[video-id]` とURLの `v` の一致、タイトルの描画を確認する。待機中も保存済み設定と設定メニューを維持する。
- Issue #8のユーザー環境は全スクリプトとuBlock Originの併用。漫画ビューアはYouTubeをメタデータで除外している。検証では実際の適用対象のみを組み合わせ、Firefoxの実利用プロファイルを変更せず分離する。実測結果と未確認条件は `verification.md` に記載する。

## ニコニコ動画モバイルのスワイプ全画面（2026-10-02 確認）

- 実ページは `video[data-name="video-content"]` と `data-name="stage" / "inner" / "content"` を使う。プレーヤー外周はハッシュ付きクラスのため、それへ依存せず動画とほぼ同じ矩形の祖先で操作パネルを含む全画面対象を求める。途中に高さ0のラッパーがあるため、全画面中のみ動画までの祖先を埋める。サイトのinline寸法・transformはアスペクト比とコメント層の配置を担うため強制上書きしない。全画面後は矩形が変わるので解除判定には取得時のルートを保持する（`src/nico-mobile-swipe-fullscreen`）。
- 透明なタップ面はstageの兄弟要素であり、stage内だけを対象にすると実ページで開始できない。プレーヤー内の中央領域を対象にし、button / slider等の操作要素は除外する。
- 全画面要求はユーザー操作終了イベント内で同期的に呼び、横画面ロックは全画面成功後に試す。OS管理の動画全画面はDOMへタッチが届かないため、下スワイプ解除を約束するフォールバックには使わない。遅延ロック成功後の解除漏れも回帰テストで確認する（`scripts/nico-mobile-swipe-fullscreen-regression.mjs`、`verification.md`）。

## ニコニコ動画モバイルの公式設定（2026-10-02 確認）

- `src/nico-player-premium-controls` は独立スクリプト。モバイルの公式JSX runtimeの設定パネル／速度一覧propsと、DOM動画・URL IDが一致するコントローラーの`context.isPremium`だけを変更する。実際の`sessionUser` / `watch.viewer` / コメント送信 / サーバー権利は改変しない。
- React compilerのコントローラー参照は`updateQueue.memoCache`にもある。DOM上の動画自身にfiberがない場合は祖先からrootのcurrentへ進む。探索は上限付き・own descriptorの値のみ。getterやMapを辿らない。
- `scripts/nico-native-import-plugin.ts` が公式ネイティブESMの共有を保持する。他ターゲットには適用しない。標準importをSystemJSに戻すと公式側へ反映できない。
- 2026-10-12の公式JSX runtimeは直接オブジェクトではなく、キャッシュ付きCommonJS初期化関数をexportしていた。公式JSXモジュールに限り直接exportを優先し、引数なし初期化関数の戻り値を`jsx`/`jsxs`の構造で照合する。export名・ハッシュ・`/web/assets`の固定は避ける（`resolveJsxRuntime`、fixture README、verification.md）。
- 単体8件、配布物を使うオフラインChrome50項目を通常テストへ登録。fixtureの公式React runtimeは出典・ハッシュとMITライセンスを同梱する。レジューム変更でコントローラーが同一動画DOMを再利用して作り直されるため、現行rootを周期的・公式クリック処理前に照合する。広告の外部メディア制御中は速度変更が公式側で止まるので本編で確認する。context参照は保持する。PC版は別の会員判定に依存するため対象外。実機・ログイン済み・サーバー再開位置は確認していない。

## bilibili 日本語化の知見（2026-09-08 確認）

- `bilibili.com` の動画ページは bot 判定（HTTP 412）で素の fetch が失敗するため、実 DOM の取得は CDP 経由の実ブラウザで行う。WebFetch での事前取得はトップページのナビ文言程度に留める。
- `account.bilibili.com/account/home` は未ログインだと空表示のため、デバッグ用 Chrome（画面あり）でユーザーが手動ログインしてから CDP で文言を採取する。認証操作はユーザーの手で行い、エージェントはログイン状態を変更しない。
- 翻訳スクリプト自体が表示原文に依存するため、共通ルール「表示言語に依存したセレクターを使わない」の対象外とする。安定化策として、ユーザー投稿内容（動画タイトル・コメント・弾幕）には反応しない完全一致辞書＋両端固定の正規表現に限定し、構造セレクターは使わない。
- ログインモーダルは遅延描画かつログイン済みプロファイルでは描画されないため、実ブラウザ検証の対象外とし、辞書収録と単体テストで担保する（`verification.md` の該当節を参照）。

## 汎用動画スワイプ全画面（2026-10-02確認）

- `video-swipe-fullscreen` はwindowのbubbleでサイトのtarget/document操作を優先する。trustedイベントではリスナー間にmicrotaskチェックポイントが走り、queueMicrotaskでは後続windowリスナーを待てない。終了後の0ms taskでcancel・fullscreen epoch・transient activationを再確認して要求する。遅い非同期のサイト処理を完全検出することはできない（回帰・公式DOM/Fullscreen仕様はverification.md参照）。
- sp.nicovideo.jpは旧専用版との併用のため既定無効。専用版1.0.1のdata-nico-mobile-swipe-ownerを視聴URLで優先し、sandbox間はwindow変数ではなくDOM属性で協調する。
- 実サイト調査では同一プロセスのiframeに専用CDP sessionがない場合がある。その場合はPage.getFrameTreeとRuntime.executionContextCreatedのdefault context IDで読む。主要サイトの測定・対象URL・識別属性・未確認範囲はdocs/video-swipe-site-audit.md、証拠はartifacts/video-swipe-site-audit/。Twitchのseekbar-interaction-areaは実際にシークするため、data-test-selector付きプレイヤー内だけsite-policy.tsで除外する。

## GIF直リンクコピー（2026-10-04確認）

- 新規 `src/gif-direct-link-copier` はページに記載されたCDN URLだけを使う。GIPHYの `data-giphy-id` とURL ID、Tenorの `store-cache.gifs.byId[ID].results`（legacy_info.post_idも確認）/JSON-LD、Imgurの現在投稿OG/canonicalと描画メディアを照合する。GIPHYの `_s.gif` は静止サムネイルなので候補にしない。共有URLやgifvの拡張子変換を追加しない。
- Imgur現行公開ページは `.Gallery-Content--mediaContainer` が固定高さ・transform付き `.VirtualList--item` に入る。media直下に通常フローのボタンを追加すると次itemに重なり実クリック不能になる。見出し下（`.VirtualList` の親の前）へ置き、`data-index`由来の番号を表示する。
- source/src更新後もvideo.currentSrcが旧媒体を保持することが実ポインター回帰で判明。現在のDOM属性とsourcesだけを抽出し、Imgurの旧投稿と同じsourceを持つ再利用ノードは新描画まで待つ。回帰は `bun run test:gif-direct-link-copier`、実ページ・未検証範囲はverification.md。公開先mainが明示承認された後、updateURL/downloadURLを公開配布物へ設定した。

## Dependabot PR #11 の検証（2026-10-11確認）

- ESLint 10.12.0 のPRでは、元のCIが `source-map-js@1.2.1` のGHSA-68fv-2mgg-jv7qで失敗し、自動修復コミット後の `CI` と `PR Quick Checks` は `action_required` になった。`gh pr checks` の成功項目だけで全CI成功と判断せず、`gh run list` と失敗ログを確認する（`verification.md`）。
- 自動修復が `bun.lock` の `page-flip-2` 固定URLの整合性値を削除した。依存更新時は元の検証済み値を保持し、固定lockfileインストールで確認する。Vite更新による `dist/` の再生成差分は個別スクリプトの変更・版上げと区別する。

## YouTube古い順再生（2026-10-13確認）

- チャンネルの現行「動画」タブは `chipBarViewModel` の3フィルター（新しい順・人気・古い順）と `lockupViewModel` を使う。公式が提供する3番目のcontinuationを使い、応答でその選択状態を確認する。並び順自体は固定の内部仕様なので、更新時は実ページで照合する。言語ラベルや相対投稿日から推測しない。
- 並べ替え応答は `reloadContinuationItemsCommand`、続きは `appendContinuationItemsAction`。30本だけの取得で完了扱いせず、終端まで読む。第二ページ28本にcontinuationが付く例もあるため、項目数を動画数と混同しない。縮約fixture・回帰と実サイト検査は `test-fixtures/youtube-oldest-player/README.md` を参照。
- キューはタブ内sessionStorageの現在IDとURL・公式プレーヤーIDの一致で所有する。実ページが未知のqueryパラメーターを削除するため独自URLマーカーに依存しない。広告・古いDOMのイベントでは移動しない。`location.assign` 後も旧documentは遷移待機中に生存するため、待機中に旧URLを見て保存キューを消してはいけない。750ms遅延のdocument応答で回帰する。
- HTMLの `ended` 前に公式 `onStateChange` の0が発生し、そのまま関連動画へ遷移する例を実測した。両通知を扱い、公式自動再生はキュー中だけオフ、終了・通常離脱で元へ戻す。子フレームでは実行しない。早期にhtml直下へパネルを置くと実ページの描画に重なりクリックできなかったため、DOM準備後にbodyへ置く。詳細はverification.mdと実測記録を参照。

## READMEなどから移した開発・運用情報

## 依存更新の自動処理

`.github/dependabot.yml` は Bun と GitHub Actions の更新を毎週確認します。Dependabot の patch／minor PR は `CI` と `PR Quick Checks` を含む全 PR チェックの成功後に自動で squash merge されます。失敗ジョブは 1 回再実行し、修復できない PR と major 更新は手動で確認します。自動修復後のチェックが実行待ちになった場合も、変更内容と検証結果を確認してから手動で処理します。PR Quick Checks も Bun の固定 lockfile を使用します。

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
  - `youtube-oldest-player/` — チャンネルの公開動画を古い順に全件取得して連続再生
  - `youtube-ui-modifier/` — YouTube のおすすめ、Shorts、コメント、ナビゲーションなどを設定モーダルから表示調整するツール
- `shared/` — DOM ヘルパー、GM HTTP、ロガー、共通型定義、スクリプト設定モーダルなどのユーティリティ
- `dist/` — ビルド済みの userscript（配布用）

各種ユーザースクリプトの説明は[userscripts.md](userscripts.md)を参照してください。

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

3. 開発サーバを起動します。スクリプトごとにモードを指定してください。

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

次のコマンドで、すべてのuserscriptをビルドして`dist/`へ出力します。

```bash
bun run build
```

コード品質チェック
------------------

型チェック、lint、フォーマットは次のコマンドで実行します。

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

CI / PR Checks
-------------

このリポジトリは GitHub Actions を使った CI と PR Checksを提供します。

- **CI**: `main` ブランチへの push および PR で依存関係監査、`lint` / `type-check` / `test` / `build` を実行します。
- **PR Quick Checks**: PR 作成時に `lint` と `type-check` を実行し、問題を早期に検出します。

## 文書の役割

- [README.md](README.md): 利用開始と操作、利用者が知る必要のある制限。
- この文書: 固有の配置・ツール・実行手段・例外・再利用する調査知見。
- [verification.md](verification.md): 検証手順、実測結果、証拠、未検証事項。
- [how-to-update.md](how-to-update.md): 更新と復旧の手順。
