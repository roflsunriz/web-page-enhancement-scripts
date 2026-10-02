# 検証手順と対策

## nico-mobile-swipe-fullscreen 1.0.0（2026-10-02）

### 対象と実装

- 対象リポジトリは `roflsunriz/web-page-enhancement-scripts`。既存mainの作業開始時の差分は0件。ルートの共通・個別AGENTSを全文確認し、リポジトリ `.agents` は空で関連SKILL.mdはなかった。
- `https://sp.nicovideo.jp/*` で読み込み、`/watch/<動画ID>` の `video[data-name="video-content"]` を操作対象にする。他サイト・iframeでは起動しない。一覧からのSPA遷移にも備えてmatchはwatch限定にしない。
- 動画の中央から1本指・マウス左ボタンで64px以上、1.2秒以内に縦ドラッグして離すと、通常表示では上方向で全画面要求、そのスクリプト自身の全画面中では下方向で解除。初動の縦/横比1.6未満、逆方向、タップ、短い移動、複数指、キャンセル、ボタン・リンク・入力・slider・dialog、動画端からの開始を除外する。ページ本文のスクロールと最初から横に動く操作には介入しない。動画中央からの上ドラッグは全画面用であり、同じ開始地点の上方向スクロールとは識別できないためスクロールは動画外から行う。
- SPAでは履歴を書き換えず、DOM交換とURL変化を監視して所有した全画面・画面ロックを解放する。取得後にロックPromiseが遅れて成功した場合も解放する。Escや既存ボタンによる解除、pagehideにも対応。他機能が開始した全画面・画面ロックは操作しない。

### 自動検証

- `bun run format`、`bun run lint`、`bun run type-check`、`bun run build`、`bun run test` を実行。44単体テスト（新規5件を含む）、dアニメ切替検証、漫画ビューア回帰、YouTube UI Modifier回帰、dアニメ版一致検査を確認した。
- `scripts/nico-mobile-swipe-fullscreen-regression.mjs` は採取した実ページのdata-name構造・高さ0の中間ラッパーを縮小したオフラインフィクスチャ。既存Google Chromeの分離コンテキストへタッチ・マウス入力を送る29ケースが合格した。全外部要求をフィクスチャで充足し、未知の要求も空応答にする。
- タップ・横シーク・斜め・短い移動・逆方向・端・ボタン・range・動画外スクロール・複数指・touchcancel・途中反転、透明タップ面、SPA進入と離脱、動画交換、遅延した全画面要求・遅延ロック、要求/解除拒否、ロックAPI不在、外部全画面非干渉、pagehideを確認。成功ロックと異常系はスタブで検証し、物理端末の画面回転を確認したという意味ではない。
- 390×844・844×390ではスタブを外した実Fullscreen APIで全画面化・解除を確認。全画面rootがviewportを満たし、動画のアスペクト比・中央寄せがroot内に収まることと通常表示への復元を測定した。サイトのinline寸法/transform変更と全画面後のルート寸法変化も再現する。
- Chromeが未消費の横タッチをブラウザ標準の「戻る」と解釈する場合がある。要求回数はページ外で観測し、ナビゲーションで証拠が消えないようにした。標準操作を抑止するための設定変更はしていない。
- 全26スクリプトの配布物を標準ビルドで生成。対象外の再生成差分は作業前の内容へ戻し、新規配布物2件だけを追加した。構文、メタデータ、空白差分も確認する。
- 既存CIの `bun audit` で `brace-expansion@5.0.9` のDoS脆弱性3件を検出。既存overrideを同一メジャーの修正版5.0.12へ限定更新し、`bun install --ignore-scripts` でlockfileを再生成した。lockfile差分は同依存の指定・版・integrityのみ。再監査は205パッケージ中0件。根拠は [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7)、[GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr)。

### 実ページと制約

- Windows PCの分離したヘッドレスChromeで、Android相当UA・390×844・タッチ入力を使用。未ログインの公開視聴ページ `https://sp.nicovideo.jp/watch/sm9` へビルド済みスクリプトを一時注入した。アプリ案内を一時プロファイル内で閉じ、中央再生ボタンを避けた動画領域の上スワイプで全画面、下スワイプで通常表示への復元を確認した。動画の継続再生やコメント同期の精度検証は対象外。
- 実測は通常時video約389×219、全画面root390×844、全画面時video390×219が中央に収まり、解除後のvideoは元の位置・寸法へ戻り追加属性も0件になる。画面ロックはPC Chromeで拒否され、全画面を保ち「端末を横に回転してください」の案内が表示された。画像でも中央配置と復元を確認した。
- [Fullscreen API標準](https://fullscreen.spec.whatwg.org/#dom-element-requestfullscreen) は一時的ユーザーアクティベーションとfullscreen権限を要求する。要求はtouchend/pointerup内で同期的に呼び、拒否・非対応なら通常表示を維持して既存ボタンを案内する。権限ポリシーやOS・ブラウザ設定は変更しない。
- [Screen Orientation標準](https://www.w3.org/TR/screen-orientation/#interaction-with-fullscreen-api) は全画面をロックの前提とし、未対応・制約違反では拒否し得る。全画面成功後だけ `screen.orientation.lock('landscape')` を試し、拒否・API不在時は通常の全画面を維持して手動回転へフォールバックする。解除時には、このスクリプトが取得したロックだけをunlockする。
- [WebKit公式説明](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/) の一般DOM全画面と動画ネイティブ全画面は別の機能。iOS等のOS管理の動画全画面はDOMの下スワイプを受け取れないため、`webkitEnterFullscreen` を自動フォールバックに使わない。ブラウザ名で判定せずAPIの有無と実要求の成否で分岐し、未対応なら既存ボタンを案内する。実験的機能を有効化する設定変更は行わない。
- `adb devices` に接続実機は0件。Android・iOS実機、Firefox/Safari、userscript managerでの実インストール、既存拡張との併用、ログイン済みの継続再生は未検証。PCエミュレーションでは物理回転・モバイルOSのネイティブ動画UI・全端末のスクロール開始タイミングを保証できない。
- 実機での再開には、既存認証を保持したモバイルブラウザとuserscript managerが必要。未導入ならインストール前に報告し、セキュリティ設定を変更せず、再生中の上/下スワイプ、タップ・シーク・スクロール・複数指、横画面拒否、既存ボタンの解除、SPA移動を確認する。ユーザー承認後、リモートmainのCI設定2コミットを保持してローカル変更をリベースし、通常pushした。実装コミットは `04e6c94`、GitHub CIも成功した。force push・mainマージ・タグ作成・GitHub Release・既存認証の変更は行っていない。


## YouTube UI Modifier 1.8.8 / Issue #8（2026-09-27）

### 修正と自動回帰

- 1.8.7の配布物を `Page.addScriptToEvaluateOnNewDocument` でdocument-start相当に実行すると、DOMが存在しないため `findOrCreateStyle` の `appendChild` が例外になり、設定メニューも登録されなかった。構築をDOMContentLoaded後へ移し、構築時の同期例外も捕捉した。
- デスクトップ視聴ページは `ytd-watch-flexy` または `ytd-watch-grid` 内の `ytd-watch-metadata` の `video-id` とURLの `v` が一致し、タイトルが描画され、コンテナーの `loading` / `show-skeleton` 状態が解除されてから表示設定を適用する。遷移中の古いDOMは準備完了に数えない。監視と定期確認で再適用し、保存設定は書き換えない。
- `node scripts/youtube-ui-modifier-regression.mjs` は外部通信をすべて充足するオフラインテスト。DOMなしでの起動、読み込み済みページでの起動、動画情報の遅延描画、2種類の視聴コンテナー、古い動画DOMが残る遷移、広告設定と全体ON/OFF、モーダル開閉、1920×1080・1280×720・390×844を確認する。YouTube本体のロードを模擬した成功判定には使わない。
- 旧配布物を第1引数で指定すると設定メニュー待ちで失敗し、修正後は成功した。通常の `bun run test` に組み込んだ。

### 実ページの比較

- Chrome 154.0.8037.58、raw CDP 9222、ログアウト状態で、公開動画 `hn2mnHHRGD8` を利用。1.8.7の9設定を単独／同時に指定した比較ではタイトル・関連動画が描画された。
- 1.8.8では9設定同時のCSS適用（1164文字）、タイトル・関連動画の表示を確認。関連動画リンクの実クリックで `yEFSELz8oP4` へSPA遷移し、遷移先の動画ID・タイトル・CSS再適用を確認した。
- YouTubeに適用される `image-collector`、`youtube-info-copier`、`native-video-volume-setter`、`video-screen-off-detection-blocker` との併用も比較した。漫画ビューアはメタデータでYouTubeを除外しているため注入しない。
- 分離したFirefox 153.0の検証プロファイルへuBlock Origin 1.72.2だけを配置し、有効状態を確認。既定フィルターと上記4本＋modifierの併用で、修正後は `hn2mnHHRGD8` と `SNViRm3eMQA` のタイトル・関連動画を確認した。ユーザーのFirefoxプロファイル、Cookie、履歴、拡張設定は変更していない。

### 未解決の観測と制約

- 間欠的に `ytd-page-manager` の子要素が空のままゴーストが残った。Chromeでmodifier未注入＋併用スクリプトの条件でも35秒後に残り、修正版modifierの非表示CSSが空の待機中にも発生した。modifierの9設定が単独原因とは断定できない。全スクリプト未注入の3回の比較は正常表示だった。
- Chromeの失敗通信には広告関連の `ERR_EMPTY_RESPONSE` があり、正常表示する試行でも同様に観測された。一部試行では動画配信ホストのDNS失敗もあったが、これらとゴースト残留との因果関係は未確定。
- ユーザー報告のFirefox 156.0.1＋Tampermonkey 5.5.0そのものでは未検証。今回の実ページ試験はGM APIを補って配布物を注入したもので、Tampermonkeyの実際のsandbox、ユーザーのuBlockカスタム設定、元の動画URLを完全再現していない。Issue #8は恒久解決済みとして閉じない。再発時は動画URL、読み込み開始からの経過時間、失敗通信、併用スクリプト単独の比較を確認する。

### 共通品質確認

- lint、format、型検査、全25スクリプトのビルド、39件の単体テスト、dアニメ切替検証、漫画ビューア回帰、YouTube回帰を実行。
- 依存更新後の `bun audit` は205パッケージで脆弱性0件。`bun outdated` の残りはTypeScript 7のみで、`typescript-eslint@8.70.1` のpeer条件 `>=4.8.4 <6.1.0` に従い6.0.3を維持した。
- 新しいビルドが検出した漫画ビューアの不要なdynamic importは静的importへ変更。React DOM更新を含む漫画ビューア10.23.3とmodifier1.8.8の配布物を `bun run build` で生成し、対象外配布物の整形差分は含めない。

## Dependabot 自動処理（2026-09-23）

- `.github/dependabot.yml` の Bun／GitHub Actions 監視先と、呼び出し側の `CI`／`PR Quick Checks` 名を確認する。
- 既存の `PR Quick Checks` は npm lockfile がないのに `npm ci` を実行していたため、Bun の固定 lockfile と同じ lint・型検査へ変更した。`CI` は固定インストールと `bun audit` を実行する。
- `actionlint` で変更した workflow を検査し、`bun audit` の既知脆弱性 0 件を確認する。実際の Dependabot PR のマージ経路は PR 発生時に検証する。
- 2026-09-23 の設定変更では Bun 1.4.0 の固定インストール、lint、型検査、全ビルド、39件の単体テスト、オフラインの切替検証、NicoManga 画像回帰を確認した。管理設定だけの変更にするため、format/build が再生成したユーザースクリプト本体と `dist/` はコミット対象に含めない。
- 分類後の `workflow_dispatch` は現在の PR 番号と head SHA を照合する。別の作成者、古い SHA、未完了の CI はマージしない。
- [main の CI 実行 35815411156](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/runs/35815411156) は、オフライン漫画ビューア回帰テストが中間フレームを5秒内に観測できず初回失敗した。同じコミットの失敗ジョブだけを一度再実行したところ成功した。製品コードと期待値は変更せず、再発時は保存された最終 spread・`lastStarted`・変異観測の経路を比較する。
- [main の CI 実行 35816361309](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/runs/35816361309) では、同じ観測タイムアウトが初回と失敗ジョブ再実行の両方で発生した。最終 spread と `lastStarted` は正しいため、CI の描画負荷による中間フレームの観測取り逃がしと判断した。テストはこの条件に限って見開きを戻して最大3回再観測する。ローカルのオフライン NicoManga 回帰テストは修正後に成功した。
- Dependabot PR #6 等の [既存ラベル付け実行](https://github.com/roflsunriz/web-page-enhancement-scripts/actions/runs/35810196105) は `Resource not accessible by integration` で失敗し、成功した CI とは別に自動マージを止めていた。`pull_request_target` でトークンにラベル書き込み権限を与え、チェックアウトを除去した。タイトルの `bug`／`fix`、`feat`／`feature`、`doc`／`docs` だけを対応する既存ラベルへ分類し、該当しない依存更新は何もせず成功する。変更した workflow は actionlint・ShellCheck と Prettier で確認した。

## bilibili-jp-localize

### 辞書の根拠と検証

辞書（`src/bilibili-jp-localize/dictionary.ts`）はCDPで取得した実DOMが根拠（2026-09-08取得）。

1. 動画視聴ページ `https://www.bilibili.com/video/BV1Lbt36cEoH/`（未ログイン、約800文言）
2. 公開アカウントページ `https://space.bilibili.com/1024544274`（未ログイン）
3. アカウントセンター `https://account.bilibili.com/account/home`（ログイン済み、デバッグ用Chromeでユーザーが手動ログイン）
4. 検索結果ページ `https://search.bilibili.com/all`・`/video?keyword=初音`（ログイン済み）
5. space タブ遷移先 `/upload/video`・`/dynamic`（ログイン済み、`/favlist` は非公開時ホームへ転送のため対象外）
6. アカウントセンターのタブ遷移先 `/account/big`・`/site/coin`・`/account/record?type=exp`（ログイン済み、`/account/face/mall` と `/account/official/home` は空表示のため対象外）

`account.bilibili.com` は未ログインだと空表示のため、ログイン後の取得が必須。動画タイトル・コメント・弾幕などのユーザー投稿内容は翻訳対象にしない（完全一致のUI定型文と両端固定の正規表現だけを使う）。

検証時は次を確認する。

- `bun test src/bilibili-jp-localize/dictionary.test.mjs src/bilibili-jp-localize/font.test.mjs` が成功する。
- ビルド成果物のメタデータが `1.3.0` になっている。
- 実ブラウザ（CDP）でビルド済み userscript を `Page.addScriptToEvaluateOnNewDocument` で注入し、動画ページを開き直すと、ナビ・操作ボタン・弾幕設定・タイトル接尾辞（`_哔哩哔哩_bilibili` → `_ビリビリ_bilibili`）が日本語化され、未翻訳のUI定型文が残らない。
- 検索結果ページと space ダイナミクスページでも同様に注入検証し、タブ・絞り込み・ページネーション・ピン留め等の日本語化と未翻訳残存ゼロを確認する。
- アカウントセンターのタブ遷移先は読み込みが不安定なため、描画後の遅延注入で検証し、大会員・コイン・ログイン履歴ページの日本語化と未翻訳残存ゼロを確認する。
- 日本語化済み要素に `data-bilibili-jp-localize="translated"` が付き、計算フォントが Noto Sans JP 優先スタックになる。
- おすすめ動画リンクのクリックによるSPA遷移後も、リロードなしで遷移先のUIが日本語化される。
- ログインモーダルは遅延描画かつログイン済みプロファイルでは描画されないため、実ブラウザでは未検証。辞書収録と単体テストで担保する。

## apkcube-direct-download

### ダウンロード導線の特定

apkcube.com の公式配信バンドルをde-minifyし、次の描画経路を確認する（2026-09-06、ChatGPT のダウンロードページで実測）。

1. ダウンロード実行は `POST /api/downloads/request`（`{packageName, apkId, captchaToken, ...}`）→ `{url}` → `window.location.assign(url)`（`1529-564ad2b0508b041d.js` の `V`）。
2. その前段に広告ブロッカー検出があり、検出時は 30 秒カウントダウンのモーダル（`downloadFlow.adblock*`、`6280` の `adblockWaitSeconds:30`）が開く。
3. 検出は二本立て（`1529` の探知 fetch と bait 計測）。`fetch("/ads/banner-ad.js")` の応答に `__ad_probe_ok__` が無い場合と、`#ad-banner.adsbox...` の bait 要素が非表示・除去されている場合に検出扱いになる。
4. カウントダウンは `!document.hidden && document.hasFocus()` を満たさないと「一時停止中」で止まる。
5. ポップアップの温床は同梱の `/loader.js`（難読化）と外部広告ホスト（adbpage.com / adexchangerapid.com / skecaaztypvqr.space / usrpubtrk.com）。

対策として、ユーザースクリプトを `document-start` でページコンテキストに実行し、探知 fetch へのマーカー付き応答、bait 要素の可視維持と計測値の保護、ダウンロードページでの可視状態扱い、広告ホストへの通信・`window.open` の抑止、広告スロットの非表示を行う。bait のクラス・ID を非表示 CSS に使わない（使うと検出を自ら引き起こす）。Turnstile・長押し検証・PoW の突破やダウンロードの自動開始は行わない。

検証時は次を確認する。

- `bun test src/apkcube-direct-download/selectors.test.mjs` が成功する。
- ビルド成果物のメタデータが `1.0.0` になっている。
- 実ブラウザ（CDP）でダウンロードページを開き、探知 fetch がマーカー付きで返り、bait 計測が非検出になり、広告ホストへの `window.open` が抑止される。
- 実ブラウザでメインのダウンロードボタンを押したとき、広告ブロッカー検出モーダルが出ず、「一時停止中」にならず、広告ホストへの通信・ポップアップが発生しない。
- 人間検証（長押し等）が必要な場合は正規の検証ダイアログだけが残り、完了後にダウンロードが始まる。

## yahoo-mail-ad-cleaner

### 全画面セルフプロモーション

Yahoo!メールの公式配信バンドルをde-minifyし、次の描画経路を確認する。

1. `MiffyExperimentIds.interstitialAd`（`mfn_88455`）の値を `SystemProp.showInterstitialAd` が保持する。
2. 実験値が `on` で広告表示対象の利用者の場合、`InterstitialAd` が `#tagYadsInterstitial` を生成する。
3. タブが可視状態へ戻ると、YADSへ広告IDと `yads_parent_element: "tagYadsInterstitial"` を渡して全画面広告を描画する。

対策として、ユーザースクリプトを `document-start` で実行し、`#tagYadsInterstitial` を既存広告枠と同じCSSルールで非表示にする。表示文言、LYPプレミアム固有のURL、配信クリエイティブ、生成クラスには依存しない。

検証時は次を確認する。

- `bun test src/yahoo-mail-ad-cleaner/selectors.test.mjs` が成功する。
- ビルド成果物のメタデータが `1.2.0` になっている。
- ビルド成果物のCSSに `#tagYadsInterstitial` が含まれる。
- Yahoo!メールの一覧表示、メール詳細、作成画面の操作を妨げない。
- 全画面広告の描画対象になった場合も、広告と背景オーバーレイが表示されず、操作可能な画面がそのまま残る。
