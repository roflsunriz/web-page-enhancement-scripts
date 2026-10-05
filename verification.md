# 検証手順と対策

## gif-direct-link-copier 1.0.0（2026-10-04）

独立userscriptの導入対象は `dist/gif-direct-link-copier.user.js`。ユーザーが公開先 `roflsunriz/web-page-enhancement-scripts` のmainへの公開を明示承認したため、配布・自動更新URLを設定した。作業開始時の対象mainはcleanで、共通AGENTSは全文読了、`.agents`は空。別リポジトリ・認証・投稿には触れていない。通常pushでmainへ反映し、GitHub CIと公開配布物を確認する。

### 公開ページと実メディア

ログインなしの分離Chromeで、次の公開ページを閲覧した。

| サイト | ページ | 確認できた媒体 |
| --- | --- | --- |
| GIPHY | `https://giphy.com/gifs/i-love-you-hugging-hug-me-7Wcyq7KvKFNTO` / `https://giphy.com/gifs/moodman-monkey-side-eye-sideeye-H5C8CevNMbpBqNqFjl` | GIF。OG/JSON-LDのURLと表示中のIDが一致 |
| Tenor | `https://tenor.com/view/happy-boy-gif-22114616` / `https://tenor.com/view/monkey-gif-4771695363483268470`（jaへ遷移） | GIF。store-cacheとJSON-LDが公開。旧ID・64bit文字列IDとも取得 |
| Imgur | `https://imgur.com/gallery/carefully-curated-vol-982-iMoeEpa` / `https://imgur.com/QERk0ho` / `https://imgur.com/a/iMoeEpa`（slug付きへ遷移） | `https://i.imgur.com/QERk0ho.mp4`。ギャラリーは2個の描画済み動画を抽出 |

- GIPHY 2件・Tenor 2件の掲載GIFとImgurのMP4を部分GETした。HTTP 200/206、`image/gif` + GIF89a／`video/mp4` + ftypを確認。URLを組み立てずページのURLをそのまま検証した。[応答証拠](artifacts/gif-direct-link-copier/media-check.json)。
- 3サイトの主要ページ、Imgur単体・アルバムを1280×900と390×900で実クリックし、実クリップボードの文字列がボタンのURLと一致することを確認した（計10ページ条件）。[DOM・コピー証拠](artifacts/gif-direct-link-copier/live-results.json)。主要3サイトのPC・モバイルスクリーンショットも同フォルダーに保存し、重なり・通知のコントラストを目視確認した。
- [GIPHY公式スキーマ](https://developers.giphy.com/docs/api/schema/)と[Tenor公式レスポンス仕様](https://developers.google.com/tenor/guides/response-objects-and-errors)でも共有URLと媒体URL、複数形式の区別を確認した。認証APIやAPIキーには依存しない。

### 回帰と品質確認

- `bun test src/gif-direct-link-copier/extract.test.mjs`：17件成功。公開ページ5件の縮約fixtureでGIF優先、動画のみ、現在IDの照合、関連・前投稿・静止サムネイル・不正URL・gifvの拒否、URLクエリ保持を確認した。
- `node scripts/gif-direct-link-copier-regression.mjs`：51項目成功。通信をfixtureだけで充足し、配布物をChromeのraw CDPで実行。1920×1080、390×844、320×640、844×390、768×1024、日英・アラビア語・ウルドゥー語、44px以上の操作面、RTL、実ポインター到達、繰り返し注入、遅延追加・削除、SPA待機／復帰、再利用動画、bfcache、コピー成功／両API拒否／manager成功／応答なしを確認した。
- Imgurは固定高さの仮想リスト内へボタンを追加すると隣の投稿画像に重なり、実クリックが失敗した。見出し下へ移した後に実ページで再確認し、同じ構造と実ポインタークリックの回帰を残した。
- videoのsource属性更新後に`currentSrc`が旧媒体のまま残り、追加した再利用DOMテストが旧URLの誤コピーを検出した。現在のsrc/source属性を取得するよう修正し、同じ期待値で再テストした。
- 変更TS・回帰MJSのPrettier、全体lint、型検査、全29ビルド、通常テストが成功。全単体は69件成功し、既存の漫画・YouTube・ニコニコ・汎用スワイプ・dアニメ版一致の回帰も成功。依存関係・lockfileは変更していない。

### 制限・未検証と再確認

- 実確認はChromeの分離プロファイルと指定公開サンプル。userscript managerの権限フォールバックはスタブ検証で、Tampermonkey/Violentmonkey/Greasemonkeyの実インストール、Firefox、iOS/Android実端末、ログイン済み環境は未検証。
- ImgurのGIF、各サイトのWebMだけの媒体は実ページで未確認。抽出fixtureで形式を確認し、MP4からGIFやWebMへの変換はしない。GIFの全フレーム数・アニメーションは検証していない。
- Imgurは描画済み投稿媒体に限定し、未描画・コメント・おすすめは収集しない。スクロールで別の媒体が描画されると見出し側のボタンも更新する。旧投稿と同じsourceを持つ再利用DOMは準備が確認できるまで表示しない。待機が続く場合は再読み込みする。
- GIF URLがページに公開されない、形式がWebPだけ、gifv/blobだけ、CDNが変わる、ページ構造が変わる場合はボタンを出さない。GIPHY Clips、一覧・検索、他サイトは対応範囲外。実行時の分類は掲載URLの拡張子に基づき、毎クリックのメディア通信や恒久的な生存保証はしない。
- 単独再確認は `bunx --no-install vite build --mode gif-direct-link-copier` → `bun run test:gif-direct-link-copier`。実ページではGIF/MP4/WebMの表示、ボタンの位置、コピー後の貼り付けを確認する。停止はmanagerで本スクリプトを無効にして再読み込みする。


## video-swipe-fullscreen 1.0.1 / ニコニコ協調 1.0.1（2026-10-02）

- 公開main `f8d2b41` から独立ブランチ `feat/video-swipe-fullscreen` と `task-5/video-swipe-worktree` を作成。完成コミット `45c40c9` を保存後、ユーザーがmain反映・通常pushを承認。最新origin/mainは `f8d2b41` と一致し取り込み競合なし。公開URLと導入説明を更新し、元mainへfast-forwardで反映する。並行premium作業・共有Git設定は変更しない。共通AGENTSは全文確認、元リポジトリの `.agents` は空で適用可能なローカルSKILL.mdなし。導入説明は `docs/video-swipe-fullscreen.md`、実サイトのURL・上下操作・DOM識別子・再生条件は `docs/video-swipe-site-audit.md`。
- 汎用版の `@match` はHTTP/HTTPS全ホスト、`@noframes`なし。managerが各フレームへ注入でき、Fullscreen Permissions Policyが許可することが前提。sp.nicovideo.jpは旧専用版との併用のため既定無効。専用版1.0.1のDOMマーカーは起動順によらず視聴ページで優先する。繰り返し注入も両版とも1回だけ起動する。

### 合格した検査

- `bun run lint`、`bun run type-check`、汎用版TS・追加回帰/調査MJS・専用版main/回帰へのPrettier整形とcheck、`bun run build`、`bun run test` が成功。既存44単体テスト、dアニメ切替、漫画ビューア、YouTube UI Modifier、dアニメ版一致検査も成功。既存設定ファイルとbuild-all.mjsの書式は周辺に合わせ、全ファイルの一括整形は行っていない。
- `scripts/video-swipe-fullscreen-regression.mjs` は55ブラウザケース成功。実ページで確認したoverlay構造とTwitch操作面を縮小したフィクスチャを使い、すべての通信を空応答またはフィクスチャで充足する。trustedなタッチ・マウスを分離Chromeへ送り、複数動画、動的挿入／置換／削除、SPA、open/closed shadow DOM、実Fullscreen API、別オリジンiframeの許可／拒否を検証した。
- タップ、横シーク、斜め、短距離、逆方向、途中反転、端、ボタン、slider、native-controls端、本文スクロール、複数指、キャンセルを検証。サイトがstart/move/endをpreventDefaultする、伝播を止める、後続windowリスナーが終了をcancelする、先に全画面を要求する場合に二重要求しないことを確認した。
- 全画面の未対応／reject／同期throw、orientationの未対応／reject／遅延成功、外部解除、pagehide、要求中の遷移、解除失敗と再試行、スタイル復元とサイト側の変更保持、重複注入、設定メニューの保存と実reload後の無効化、専用版の両起動順、Twitchの狭い除外と他ホスト非干渉を確認した。
- ニコニコ専用版の回帰は既存29ケース＋重複注入の1ケース、計30成功。共有する64px・1.2秒・縦横比1.6の判定は既存5単体テストも成功。
- 390×844、844×390で実Fullscreen APIのroot/video寸法と復元を測定。video自体の全画面でもmanual popoverで回転失敗通知が見え、下ドラッグで解除・通知消去されることを実APIで確認。PNGと要約は `artifacts/video-swipe-regression/`。ブラウザ内未捕捉例外0件。物理的な横画面回転の成功はWindowsでは検証できず、ロック成功・遅延・失敗・所有解除はスタブで検証した。
- `bun audit`: 205パッケージを検査して脆弱性0件。公開前に既存開発依存3件（@types/node、typescript-eslint、Vite）を互換性のある最新版へ更新。TypeScript 7.0.2はtypescript-eslint 8.71.0のpeer範囲外のため6.0.3を維持した。元worktreeの既存node_modulesを独立コピーし、依存更新はこの独立worktree内で実施した。全ビルドで発生した対象外のミニファイア差分はこのworktree内だけで復元し、今回の配布物に限定した。

### 実ページと未確認範囲

- 主要6サイトをログインせず巡回した。Vimeo・Dailymotion（iframe内）・ニコニコで汎用版の上全画面／下復元を確認。YouTubeとTwitchでは再生できたが、サイトが処理したイベント・シーク面・全面再生buttonを尊重したため、確認した操作面で汎用版の全画面化成功とは扱わない。bilibiliは2候補ともアプリ誘導画面と0×0の非表示gsl領域のvideoで、視聴動画・視聴ジェスチャー未確認。詳細・生測定・スクリーンショットは実サイト調査文書と `artifacts/video-swipe-site-audit/`。
- Android/iPhone実機、Firefox/Safari、実際のuserscript managerによるsandbox注入・フレーム別メニュー・永続化は未確認。標準DOM/GM APIのスタブとChromeでの注入検査で補った。既存ユーザープロファイル・認証・OS/browser設定の変更、ブラウザやuserscript managerの追加インストールはしていない。
- native controlsの内部DOM・closed root・HTML videoを露出しないプレイヤーは探索できない。全サイトのイベントハンドラや遅延ジェスチャーを完全検出できない。競合時はホスト別無効化してreloadする。OS管理のnative動画全画面は下スワイプを受け取れないため自動fallbackなし。

### 標準APIの根拠

- [WHATWG Fullscreen](https://fullscreen.spec.whatwg.org/): 要求時のtransient activationと消費、Permissions Policy、Document/ShadowRootのfullscreenElement、fullscreenchangeを確認。
- [WHATWG HTML user activation](https://html.spec.whatwg.org/multipage/interaction.html#transient-activation): activationの寿命と消費を確認。Chromeではtrustedリスナー間にもmicrotaskチェックポイントが走ることを実測したため、汎用版はrelease直後の0ms taskで既処理・epoch・activationを確認して要求する。任意の長い非同期処理を待つ方式ではない。実Fullscreen APIと先行サイト要求の回帰で成立を確認した。
- [WHATWG DOM events](https://dom.spec.whatwg.org/#dom-event-defaultprevented): cancelable/passive/defaultPrevented、composedPath、伝播を確認。任意のリスナー一覧取得やaddEventListenerのpatchは使わない。
- [W3C Screen Orientation](https://www.w3.org/TR/screen-orientation/): lock/unlockとsandbox・可視性・プラットフォーム上の拒否を確認。未対応・拒否時は全画面を維持し、手動回転を案内する。
- [WHATWG HTML popover](https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover): video自体の全画面では通常の子要素やbody上の通知が見えないため、対応ブラウザでmanual popoverをtop layerへ表示する。Popover API非対応時のその表示形態では通知の視認を保証できない。
- [Tampermonkey API](https://www.tampermonkey.net/documentation.php#api:GM_registerMenuCommand): GM_getValue / GM_setValue / GM_registerMenuCommandを使う。日本語・英語の文言と英語fallbackを備える。公開main向けupdateURL/downloadURLを生成し、メタデータと回帰で一致を確認する。

## nico-player-premium-controls 1.0.1（2026-10-02）

### 対象と境界

- `sp.nicovideo.jp/*` にdocument-start・grant none・page/rawで読み込み、`/watch/<動画ID>`だけで有効化する。PC版には適用しない。独立worktreeで検証済みの `055b7f58` 差分を、承認後に最新main `67bf8b4` へ統合した。汎用スワイプ版の登録・依存更新を保持し、premiumの承認済みソースは変更していない。元の試作worktreeと他作業のworktree、設定・認証を保持する。
- 公式設定パネルのpropsを構造で照合し`isPremium`のみtrueにした複製を渡す。速度一覧の`available`のみtrueにした複製を渡す。既存コールバック・選択値・保存先は保持する。実動画とIDが一致する公式コントローラーのcontext参照を保ち、ローカル速度／反転用isPremiumだけを変更する。導入時に設定setterを呼ばない。
- 公式公開ESMをnative importで共有する。特定のハッシュ名を固定せず、実際にロード／preloadされた公式originのjsx-runtimeを探す。React fiberのprops/state/memoCacheを上限付きで探索する。サイト内部APIに依存し、将来の構造変更への互換性は保証できない。失敗時は通常のパネルを維持しコンソールで案内する。
- 実会員情報、watch.viewer、Cookie、fetch/XHR、コメント本文と会員フラグ、認証ヘッダー、サービス権利レスポンスを変更しない。filter-matomeのserver-context方式は参考調査のみで、アカウント全体の偽装や通信改変を採用していない。画質／高音質／有料コンテンツ／サーバーの再開位置取得は対象外。
- URL変化、動画交換、watch離脱、pagehideで所有しているcontextとruntimeを復元し、再進入/pageshowで再取得する。第三者が後から置換した値は上書きしない。ユーザーが公式パネルで選んだ設定は公式の保存方法に従う。

### 再現可能な自動検証

- `bun run format` / `lint` / `type-check` / `build` / `test` が成功。全28スクリプトを標準ビルドし、対象外の再生成差分は開始時の内容に復元した。52単体テスト（追加8件）、1638 assertion、既存dアニメ・漫画・YouTube・ニコニコ専用スワイプ30ケース・汎用スワイプ55ケース・版一致検査が成功。`bun audit`は205パッケージ中0件、配布物の`node --check`成功。統合worktreeに固定lockfileから独立した依存を導入し、共有node_modulesを変更せず最新mainのVite 8.3.2で検証した。`bun outdated`の残りはTypeScript 7.0.2だけで、typescript-eslint 8.71.0のpeer範囲外のため6.0.3を維持した。
- 単独検査は `bun test src/nico-player-premium-controls/eligibility.test.mjs` と `node scripts/nico-player-premium-controls-regression.mjs`。既存Chromeを分離コンテキストで使用し、390×844と844×390で合計50項目を確認。外部要求は全てオフラインfixtureで充足し、未知要求も空応答にする。
- `node scripts/nico-player-premium-controls-regression.mjs --with-swipe` では両スワイプ配布物も同時注入し、同じ50項目が成功した。通常の `bun run test` に併用検査を追加した。最新main統合後の配布物でも、以下の実サイト検査25項目を再実行してすべて成功した。
- 現在の設定とstorage参照の保持、導入時setter呼び出し0、レジューム／反転のONとOFF、送り秒数選択、速度2倍と1倍がコントローラー／native videoへ反映、キャンセルと再表示、会員／権利の不変、元のfetch/XHRとコメント送信内容・認証ヘッダーの保持、SPAの新旧context復元、ページ離脱／復帰、重複注入、無関係のprops不変、ブラウザ例外0を確認する。
- 公式React JSX runtimeのfixtureは [出典とライセンス](test-fixtures/nico-player-premium-controls/README.md) を参照。パネルとコントローラーは公式propsの契約を縮小したフィクスチャであり、実サービスの全アプリをオフライン再現したものではない。

### 実ページ確認と未検証範囲

- Windowsの分離Chrome、Android相当UA・390×844・タッチ有効、未ログインの公開 `https://sp.nicovideo.jp/watch/sm9` で配布物をCDP一時注入。公式runtime1件とプレーヤー1件に適用し、エラーなし。公式設定にレジューム／スキップ／反転を表示し、会員atomがnullのまま、レジュームON・反転OFF・送り戻し10秒・速度1倍の初期値を維持していることを確認した。
- `sm9`でレジュームON→OFF→ONを操作すると、同一の動画DOMを維持したままAF atomがコントローラーを再作成する。現在のReact rootを750ms間隔と公式クリックのcapture段階で照合し、旧コントローラーを解除する最小修正を入れた。反転のON/OFFでチェック・現行controller.isFlip()・video.style.transformがそれぞれtrue/rotateY(180deg)、false/noneと一致した。導入時のレジュームON・反転OFF・10秒・速度1倍は維持した。
- 公式の外部メディア制御（広告中）では速度setterが停止する。広告を改変せず最大45秒待ち、本編で2倍選択→controller.getPlaybackRate()とvideo.playbackRateの両方が2、1倍選択→両方が1になることを確認した。
- 実ページの公開推薦リンク先へ公式routerでSPA遷移した。新controllerの取得、旧controllerのフラグ解除、初期選択の保持、反転ON/OFF、広告終了後の2倍/1倍が同様に一致した。各待機には上限を置き、全体180秒で分離Chromeを終了する。再現コマンドは `node scripts/nico-player-premium-controls-live.mjs`。ログイン・既存プロファイル・拡張には触れず、ネットワークが必要なため通常CIには含めない。
- 保存した実サイト検証スクリプトの最終実行は25項目すべて成功した。[実測JSON](test-fixtures/nico-player-premium-controls/verification-2026-10-02.json)に公開URLのpath、導入前後の値、反転・速度・SPAの結果を記録した。認証情報は含まない。
- PC版では別runtimeと会員依存のスキップ判定を確認した。モバイル用のprops変更だけをPCへ拡大すると表示と挙動が一致しないため、matchと動作条件の両方で除外している。
- Android/iOS実機、Firefox/Safari、userscript managerへの実インストール、ログイン済み一般／プレミアム、他拡張との併用、再生継続・シーク量・コメント同期の精度、サーバー視聴履歴のレジューム取得は未検証。既存ログイン、OS・ブラウザのセキュリティ設定は変更していない。
- 手動再検証は公式設定でレジュームと反転をそれぞれ変更して戻す、送り／戻し秒数を変更して戻す、速度2倍から1倍へ戻す、キャンセル・再表示・別動画へのSPA移動を確認する。元の設定値・会員状態・コメント送信・画質制限を比較し、確認後は元の選択へ戻す。

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

## 2026-10-05: GitHub受付・READMEの整備（公開前）

- 比較元: `9741ed3b5d66d6836b418fdbf001a4cc01b26824`（`main`）。
- 受付フォーム 2 件のYAML構造、重複キー・ID、入力型、選択肢、予約ファイル名を一括検査し、エラー0件。
- 既存の固有質問・入力例・必須条件を原文と照合。READMEのリンク・画像・コマンド・条件を確認し、裏付けがある誤記だけを訂正した。
- 既存のCI、Dependabot、labeler、ライセンスのファイル内容は比較元から変更していない。
- 製品のビルド・インストール・実機操作、GitHub上のフォーム表示、公開後CIは今回の静的検証に含めない。公開後に実際の受付表示と必要ラベルの適用を確認する。

### リポジトリ版の確認（2.7.1、未公開）

ローカルAGENTSの管理設定コミット方針に従い、package.jsonのversionだけを2.7.0から2.7.1へ更新した。JSONの他キー・依存指定・scriptsは原本と一致することを確認した。個別userscript版・生成物・lockfileは変更していない。公開済み版とは区別し、CHANGELOGのUnreleased内のリポジトリ運用節に記録した。
