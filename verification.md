# 検証手順と対策

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
