# X/Twitter UI 診断ツール

## 概要

このフォルダには、twitter-clean-uiの不具合を調査するための診断ツールが含まれています。実際のDOM構造、適用されているスタイル、要素の階層構造を詳細に分析し、JSON形式でダウンロードできます。

## 診断ツール一覧

| ファイル名 | バージョン | 用途 |
|-----------|-----------|------|
| `x-ui-diagnostic.js` | v2.0.0 | Grok・コミュニティ要素の検出 |
| `x-layout-diagnostic.js` | v1.0.0 | レイアウト設定の適用状況診断 |
| `x-video-diagnostic.js` | - | 動画関連の診断 |

---

# x-ui-diagnostic.js

### 現在のバージョン: v2.0.0 (Grok & Communities detection)

このバージョンは、左サイドバーの**「Grok」**と**「コミュニティ」**要素を検出することに特化しています。twitter-clean-uiにこれらの要素の表示切り替え機能を追加するための準備段階として使用します。

## 使用方法

### 🎯 推奨される診断手順

twitter-clean-uiの不具合を正確に診断するため、**2つのパターン**で実行することを推奨します。

#### パターンA: twitter-clean-ui **有効**（優先）

1. **ユーザースクリプトマネージャーでtwitter-clean-uiを有効にする**
2. X/Twitterをリロード（`F5` または `Ctrl+R`）
3. 診断スクリプトを実行（下記の手順参照）
4. ダウンロードされたJSONファイルを `x-ui-diagnostic-WITH-clean-ui.json` にリネーム

**目的**: 実際に問題が発生している状態を診断

#### パターンB: twitter-clean-ui **無効**（比較用）

1. **ユーザースクリプトマネージャーでtwitter-clean-uiを無効にする**
2. X/Twitterをリロード（`F5` または `Ctrl+R`）※重要！
3. 診断スクリプトを実行（下記の手順参照）
4. ダウンロードされたJSONファイルを `x-ui-diagnostic-WITHOUT-clean-ui.json` にリネーム

**目的**: オリジナルのX/TwitterのDOM構造とスタイルをベースラインとして取得

#### 💡 どちらを優先すべき？

**まずは「パターンA（有効）」で実行してください。**

- 問題が明確な場合、パターンAだけで修正できる可能性があります
- パターンAの結果を見て、比較が必要かどうか判断できます
- 両方のデータがあれば、twitter-clean-uiの影響範囲を正確に特定できます

---

### 1. X/Twitterを開く

1. ブラウザで X/Twitter（https://twitter.com または https://x.com）にアクセス
2. ページが完全に読み込まれるまで待機
3. ログインしている状態で実行してください（タイムラインが表示されている状態）

### 2. 開発者コンソールを開く

- **Windows/Linux**: `F12` キーまたは `Ctrl + Shift + I`
- **Mac**: `Cmd + Option + I`
- または、ブラウザメニューから「開発者ツール」→「コンソール」を選択

### 3. スクリプトを実行

1. `tools/diagnostic/x-ui-diagnostic.js` の内容を全てコピー
2. 開発者コンソールに貼り付け
3. `Enter` キーを押して実行
4. 診断が自動的に開始されます

### 4. 結果の確認

- **コンソール出力**: 診断結果がカラフルな形式でコンソールに表示されます
  - 📊 診断結果の全データ
  - 🔍 検出された問題の一覧
  - 💾 ダウンロード完了メッセージ
  
- **JSONファイル**: 診断結果が自動的にダウンロードされます
  - ファイル名: `x-ui-diagnostic-[タイムスタンプ].json`
  - 内容: ページの基本情報、各UI要素の詳細情報、検出された問題の一覧

### 5. 再実行する場合

コンソールで以下のコマンドを実行：
```javascript
runXUIDiagnostic()
```

### 6. 結果の共有

- パターンAのみ実行した場合: 1つのJSONファイルを共有
- 両方実行した場合: 2つのJSONファイルを共有（推奨）
  - `x-ui-diagnostic-WITH-clean-ui.json`
  - `x-ui-diagnostic-WITHOUT-clean-ui.json`

## 調査項目（v2.0.0）

### 1. 左サイドバーの構造分析

**目的**: 左サイドバー全体の構造を把握する

**調査内容**:
- `header[role="banner"]`内のすべてのリンクとボタンの列挙
- 各要素のテキスト、href、aria-label、data-testid属性の取得
- 要素の総数とインデックス情報

### 2. Grok要素の検出

**目的**: 「Grok」リンクを正確に特定する

**調査内容**:
- 「Grok」テキストを含む要素の検索（完全一致と部分一致）
- リンク要素（`<a>`タグ）の特定（最大5階層まで遡る）
- `href`属性、`data-testid`属性、`className`の取得
- 要素の階層構造（8階層）
- 要素の位置とサイズ情報

**検出結果**:
- ✅ 成功: Grok要素が正常に検出された
- ❌ 失敗: Grok要素が見つからない（ユーザーがGrokにアクセスできない、またはUIに表示されていない）

### 3. コミュニティ要素の検出

**目的**: 「コミュニティ」リンクを正確に特定する

**調査内容**:
- 「コミュニティ」または「Communities」テキストを含む要素の検索
- リンク要素（`<a>`タグ）の特定（最大5階層まで遡る）
- `href`属性、`data-testid`属性、`className`の取得
- 要素の階層構造（8階層）
- 要素の位置とサイズ情報

**検出結果**:
- ✅ 成功: コミュニティ要素が正常に検出された
- ❌ 失敗: コミュニティ要素が見つからない（ユーザーがコミュニティ機能にアクセスできない、またはUIに表示されていない）

## 診断結果のフォーマット（v2.0.0）

```json
{
  "timestamp": "2025-11-24T12:34:56.789Z",
  "url": "https://x.com/home",
  "userAgent": "...",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "targetElements": {
    "grok": {
      "textKeyword": "Grok",
      "textContent": "Grok",
      "tagName": "A",
      "className": "...",
      "id": "",
      "attributes": {
        "href": "/i/grok",
        "data-testid": "...",
        "aria-label": "..."
      },
      "rect": {
        "top": 123,
        "left": 45,
        "width": 200,
        "height": 48
      },
      "computedStyle": {
        "display": "flex",
        "visibility": "visible"
      },
      "hierarchy": [
        { "level": 0, "tagName": "A", ... },
        { "level": 1, "tagName": "DIV", ... },
        ...
      ]
    },
    "communities": {
      // Grokと同じ構造
    }
  },
  "leftSidebarStructure": {
    "totalElements": 15,
    "elements": [
      {
        "index": 0,
        "tagName": "A",
        "text": "ホーム",
        "href": "/home",
        "ariaLabel": "ホーム",
        "dataTestId": "AppTabBar_Home_Link",
        "className": "..."
      },
      ...
    ]
  },
  "detectionSummary": {
    "grokFound": true,
    "communitiesFound": true
  }
}
```

### 重要なフィールド

- **targetElements.grok**: Grok要素の詳細情報（最も重要）
- **targetElements.communities**: コミュニティ要素の詳細情報（最も重要）
- **leftSidebarStructure**: 左サイドバーの全要素リスト（参考情報）
- **detectionSummary**: 検出成功/失敗のサマリー

## トラブルシューティング

### スクリプトが実行できない場合

1. ページを完全にリロードする
2. ログインしているか確認（タイムラインが表示されているか）
3. コンソールにエラーメッセージが表示されていないか確認
4. スクリプト全体が正しくコピーされているか確認

### 診断が完了しない場合

1. ページが完全に読み込まれているか確認
2. ネットワーク接続が安定しているか確認
3. React要素が正しくレンダリングされているか確認（画面をスクロールしてみる）
4. コンソールでエラーログを確認

### JSONファイルがダウンロードされない場合

1. ブラウザのダウンロード設定を確認
2. ポップアップブロッカーが有効になっていないか確認
3. ブラウザがファイルダウンロードを許可しているか確認
4. コンソールで以下を手動で実行：
```javascript
const diag = new XUIDiagnostic();
const results = diag.runDiagnostics();
diag.downloadResults();
```

### 要素が検出されない場合

1. X/Twitterのレイアウトが最新版か確認（デザイン変更の可能性）
2. ページを下にスクロールして要素を表示させる
3. 別のページ（例：ホームタイムライン、プロフィールページ）で試す
4. ブラウザの拡張機能が干渉していないか確認

## 開発者向け情報

### 診断クラスの直接使用

スクリプト実行後、グローバル関数が利用可能になります：

```javascript
// 簡易実行（推奨）
runXUIDiagnostic()

// 詳細な制御
const diagnostic = new XUIDiagnostic();
const results = diagnostic.runDiagnostics();
console.log(results);
diagnostic.downloadResults();
```

### 特定の調査項目のみ実行（v2.0.0）

```javascript
const diagnostic = new XUIDiagnostic();

// 左サイドバー構造のみ分析
diagnostic.analyzeLeftSidebar();
console.log(diagnostic.diagnosticData.leftSidebarStructure);

// Grok要素のみ検出
diagnostic.detectGrok();
console.log(diagnostic.diagnosticData.targetElements.grok);

// コミュニティ要素のみ検出
diagnostic.detectCommunities();
console.log(diagnostic.diagnosticData.targetElements.communities);
```

### 検出結果の確認

```javascript
// 検出成功/失敗の確認
const diagnostic = new XUIDiagnostic();
diagnostic.runDiagnostics();

if (diagnostic.diagnosticData.detectionSummary.grokFound) {
    console.log('✅ Grokが見つかりました');
    console.log('href:', diagnostic.diagnosticData.targetElements.grok.attributes.href);
    console.log('data-testid:', diagnostic.diagnosticData.targetElements.grok.attributes['data-testid']);
} else {
    console.log('❌ Grokが見つかりませんでした');
}

if (diagnostic.diagnosticData.detectionSummary.communitiesFound) {
    console.log('✅ コミュニティが見つかりました');
} else {
    console.log('❌ コミュニティが見つかりませんでした');
}
```

## バージョン履歴

### v2.0.0 (2025-11-24) - Grok & Communities detection
- 🎯 左サイドバーの「Grok」と「コミュニティ」要素の検出に特化
- 既存の診断項目を削除し、新機能追加の準備段階に最適化
- 左サイドバー構造の詳細分析機能を追加
- 検出結果を`targetElements`に集約し、よりシンプルな出力に変更
- コンソール出力を見やすく改善

### v1.0.0 (2025-11-24)
- 初回リリース
- タイムライン幅、プレミアムサブスクライブ、検索ボックスの診断機能を実装
- JSON形式でのダウンロード機能を実装

---

# x-layout-diagnostic.js

### 現在のバージョン: v1.1.0 (リアルタイム変更追跡対応)

## 概要

`x-layout-diagnostic.js`は、twitter-clean-uiの**レイアウト設定**が意図通り適用されない問題を調査するための診断ツールです。

### ✨ v1.1.0 新機能: リアルタイム変更追跡

twitter-clean-uiの設定UIでレイアウト値を変更した際に、**変更前後のスタイル状態を自動的に記録**します。これにより：
- どの設定変更がどのように反映されたか
- 反映されなかった設定はどれか
- CSSの優先度問題があるか

を詳細に追跡できます。

### 調査対象の設定

| 設定項目 | CSSセレクタ | 状態 |
|---------|------------|------|
| leftSidebarWidth (左サイドバーの幅) | `header[role="banner"]` | 🔍 要調査 |
| mainContentWidth (メインコンテンツの幅) | `[data-testid="primaryColumn"]` | ✅ 動作確認済み |
| rightSidebarWidth (右サイドバーの幅) | `[data-testid="sidebarColumn"]` | 🔍 要調査 |
| mainContentPadding (パディング) | `main[role="main"] > div` | 🔍 要調査 |
| timelineRightPadding (右余白) | `[data-testid="primaryColumn"]` | ✅ 動作確認済み |
| gap (カラム間隔) | `main[role="main"] > div` | 🔍 要調査 |

## 使用方法

### 1. スクリプトを実行

1. X/Twitter（https://x.com または https://twitter.com）のホームタイムラインを開く
2. 開発者コンソール（F12）を開く
3. `tools/diagnostic/x-layout-diagnostic.js`の内容をコピー＆ペースト
4. Enterキーで実行

### 2. 常駐モードで起動

スクリプト実行後、以下のコマンドが利用可能になります：

#### 🔍 基本診断
```javascript
collectLayoutDiagnostic()    // 現在のレイアウト状態を診断
downloadLayoutDiagnostic()   // 診断結果をJSONでダウンロード
```

#### 🎯 リアルタイム変更追跡（推奨）
```javascript
startLayoutWatch()           // 設定変更の監視を開始
stopLayoutWatch()            // 監視を停止
getChangeHistory()           // 変更履歴を表示
downloadChangeHistory()      // 変更履歴をJSONでダウンロード
clearChangeHistory()         // 変更履歴をクリア
```

#### 🎨 視覚化
```javascript
highlightLayoutElements()    // レイアウト要素をハイライト
clearLayoutHighlights()      // ハイライトを解除
```

### 3. リアルタイム変更追跡の使い方（推奨）

**最も効果的な調査方法**です：

1. `startLayoutWatch()` を実行して監視開始
2. twitter-clean-uiの設定UIを開く
3. レイアウト設定（幅、パディング、ギャップなど）を変更
4. コンソールに変更内容がリアルタイムで表示される
5. 問題の設定を特定したら `stopLayoutWatch()` で停止
6. `downloadChangeHistory()` で全変更履歴をJSONダウンロード

#### 出力例

```
━━━ 変更 #1 ━━━
⏱️ 2025-11-24T12:34:56.789Z
トリガー: style-mutation

📝 CSS変更あり
⚙️ 設定変更あり
  変更前: { leftSidebarWidth: 275, ... }
  変更後: { leftSidebarWidth: 300, ... }

🎨 要素スタイル変更:
  leftSidebar:
    width: 275px → 275px        ← 変わっていない！問題発見！
    width (inline): (なし) → (なし)
```

この例では、設定値は275→300に変更されたのに、実際のwidthは275pxのまま変わっていないことがわかります。

### 3. 診断結果の確認

`collectLayoutDiagnostic()`を実行すると、以下の情報がコンソールに表示されます：

- **📊 サマリー**: 設定が正しく適用されているかどうかの概要
- **⚙️ 保存された設定値**: GM_getValue/localStorageから取得した設定
- **🎨 注入されたスタイル**: `#twitter-clean-ui-styles`要素の内容
- **🔍 要素の検出状態**: 各セレクタでターゲット要素が見つかるか
- **⚠️ 検出された問題**: CSS優先度の問題など

### 4. 診断結果のダウンロード

`downloadLayoutDiagnostic()`を実行すると、JSONファイルが自動的にダウンロードされます。

## 診断結果のフォーマット

### 基本診断 (`downloadLayoutDiagnostic`)

```json
{
  "version": "1.1.0",
  "timestamp": "2025-11-24T12:34:56.789Z",
  "url": "https://x.com/home",
  "viewport": { "width": 1920, "height": 1080 },
  "summary": {
    "status": "warning",
    "message": "2個の設定が期待通りに適用されていません",
    "matchingSettings": ["mainContentWidth", "timelineRightPadding"],
    "mismatchedSettings": [
      { "key": "leftSidebarWidth", "expected": 275, "actual": 240 },
      { "key": "gap", "expected": 30, "actual": 0 }
    ]
  },
  "savedSettings": { /* レイアウト設定 */ },
  "injectedStyles": { /* 注入されたCSS */ },
  "elementsInfo": { /* 各要素の検出状態 */ },
  "settingsVsActual": { /* 設定値と実測値の比較 */ },
  "cssIssues": [ /* 検出された問題 */ ]
}
```

### 変更履歴 (`downloadChangeHistory`)

```json
{
  "version": "1.1.0",
  "recordedAt": "2025-11-24T12:45:00.000Z",
  "totalChanges": 3,
  "isWatching": false,
  "changes": [
    {
      "id": 1,
      "trigger": "style-mutation",
      "timestamp": "2025-11-24T12:34:56.789Z",
      "timeSincePrevious": 1234,
      "cssChanged": true,
      "settingsChanged": true,
      "settingsDiff": {
        "before": { "leftSidebarWidth": 275, ... },
        "after": { "leftSidebarWidth": 300, ... }
      },
      "elementChanges": {
        "leftSidebar": {
          "width": { "before": "275px", "after": "275px" },
          "_rect": { "before": { "width": 275 }, "after": { "width": 275 } }
        }
      },
      "snapshotBefore": { /* 変更前の全状態 */ },
      "snapshotAfter": { /* 変更後の全状態 */ }
    }
  ]
}
```

#### 変更履歴の重要フィールド

| フィールド | 説明 |
|-----------|------|
| `trigger` | 変更のトリガー（`style-mutation`, `inline-style-change`, `style-added`, `style-removed`）|
| `cssChanged` | CSSテキストが変更されたか |
| `settingsChanged` | 保存された設定が変更されたか |
| `settingsDiff` | 設定の変更前後の値 |
| `elementChanges` | 各要素のスタイル変化（**ここで問題を特定**）|

## トラブルシューティング

### 設定が反映されない場合のチェックポイント

1. **スタイル要素が存在するか**: `injectedStyles.exists`が`true`か確認
2. **CSSルールが正しいか**: `injectedStyles.cssRules`の内容を確認
3. **要素が見つかるか**: `elementsInfo.*.found`が`true`か確認
4. **インラインスタイルが適用されているか**: `inlineStyles`に値があるか確認
5. **計算済みスタイルが期待通りか**: `computedStyles`の値を確認

### よくある問題

| 症状 | 原因 | 対処法 |
|------|------|--------|
| スタイル要素が存在しない | ユーザースクリプトが実行されていない | ユーザースクリプトマネージャーを確認 |
| 要素が見つからない | X/Twitterのレイアウト変更 | セレクタの更新が必要 |
| 設定値と実測値が異なる | 他のCSSに上書きされている | `!important`の競合を調査 |
| インラインスタイルがない | CSSルール経由でのみ適用 | 他のスタイルシートとの優先度を確認 |

## バージョン履歴

### v1.1.0 (2025-11-24) - リアルタイム変更追跡対応
- 🎯 MutationObserverを使用したリアルタイム変更追跡機能を追加
- 設定変更時のスナップショット自動取得
- 変更前後の差分を詳細に表示
- 変更履歴の保存・ダウンロード機能
- 新コマンド: `startLayoutWatch`, `stopLayoutWatch`, `getChangeHistory`, `downloadChangeHistory`, `clearChangeHistory`

### v1.0.0 (2025-11-24) - Layout Settings Diagnostic
- 🎯 レイアウト設定（幅、パディング、ギャップ）の診断に特化
- 常駐モードで任意のタイミングでJSON出力可能
- レイアウト変化の監視機能（`startLayoutMonitor`）
- 要素のハイライト表示機能（`highlightLayoutElements`）
- 設定値と実測値の比較分析機能

---

## ライセンス

このツールは twitter-clean-ui プロジェクトの一部です。

## 貢献

不具合や改善案がある場合は、Issue または Pull Request を作成してください。

