# apkcube.com 公式資産 世代記録

取得日: 2026-09-06。サイト更新のたびに日付ディレクトリを切って追加し、
世代間で差分を取って `src/apkcube-direct-download` の汎化に使う。
このディレクトリは Git 管理対象。通信キャプチャに混入した AdGuard ローカル拡張の
セッション情報は除去済み（2026-09-06 確認）。

対象ページ:
- `https://apkcube.com/chatgpt/com.openai.chatgpt`（詳細）
- `https://apkcube.com/chatgpt/com.openai.chatgpt/download`（ダウンロード）

## chunks/（公式 Next.js バンドル・広告資産、ファイル名は取得時のまま）

| ファイル | SHA256（先頭16桁） | 役割 |
| --- | --- | --- |
| `1529-564ad2b0508b041d.js` | `A6E5A559900C4FDB` | ダウンロード実行フロー `V`（`POST /api/downloads/request` → `location.assign`、adblock モーダル、`window.__ad_probe_ok__` bait 計測） |
| `5206-07d6d778bf9e5c15.js` | `D9EB1573BB00433B` | API クライアント（`apks` / `fetch` / `fetch-status` / `downloads/request`、指紋・PoW） |
| `4704-150458f110a137c9.js` | `DE4A200E21F31A05` | Turnstile・長押し検証・PoW |
| `6280-29e5bcdb4f4b972d.js` | `ED2C4ECEB6500B55` | 広告設定（`adblockWaitSeconds:30`、スロット定義、`/loader.js`・adbpage 参照） |
| `download-page-5fcb0d299d567e0a.js` | `55CD1E76FE593B33` | ダウンロードページ固有 UI（表示のみ） |
| `loader.js` | `F3F8E6AD32F6D4BFC` | 難読化の広告エンジン（先頭 `window['ZpQw9XkLmN8c3vR3']`、キーは世代で変わる可能性あり） |
| `banner-ad.js` | `96C22C56C7B7B89F6` | 広告ブロッカー探知用デコイ（本文に `__ad_probe_ok__`） |

世代更新の当たり所: チャンクの contenthash（ファイル名）が変わったら同名置換で再取得し、
`V`・`l()`（探知 fetch）・bait 生成・`adblockWaitSeconds`・`api/downloads/request` の有無を
`captures/chunk-grep.json` と同じ観点で再確認する。

## api/（実レスポンス例）

- `apks-com.openai.chatgpt.json`: `GET /api/apps/<packageId>/apks?k=<token>` の 200 応答
  （`apks[]`、`security`、`securityByApkId`）。`k` は時限トークンで世代・時刻依存。

## captures/（CDP 実測の記録）

- `top.json`: トップページのリンク・スクリプト・API 候補
- `detail.json`: 詳細ページのボタン・ダウンロード導線・通信一覧
- `download-requests.json`: ダウンロードページの通信一覧（`api/apps/.../apks?k=`、`ads/banner-ad.js` を含む）
- `page-grep.json` / `chunk-grep.json`: 公式チャンク内の `api/`・`download`・`adblock` 等の出現箇所
- `rsc.json`: `_rsc`・API・チャンクの応答本文（先頭 30KB）
- `verify-result.json`: ビルド済み userscript の CDP 検証結果（PASS 時の値）

## 再取得手順

1. `%USERPROFILE%\Documents` の `chrome-debug.ps1` 相当で headless Chrome を remote debugging 付きで起動する。
2. raw CDP で `Page.navigate` し、`Network` イベントと `Network.getResponseBody` で本文を回収する。
3. チャンクは `/_next/static/chunks/<hash>.js` をそのまま保存し、ファイル名の hash を変えない。
4. 保存後に SHA256 を取り、この MANIFEST の表へ世代ディレクトリごとに追加する。
