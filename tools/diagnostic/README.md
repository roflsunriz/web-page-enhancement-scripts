# X/Twitter UI 診断ツール

## 概要

`x-ui-diagnostic.js`は、twitter-clean-uiの不具合を調査するための診断ツールです。実際のDOM構造、適用されているスタイル、要素の階層構造を詳細に分析し、JSON形式でダウンロードできます。

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

## 調査項目

### 1. タイムライン幅の調査

**目的**: メインコンテンツの幅調整が正しく機能しているか確認

**調査内容**:
- `[data-testid="primaryColumn"]`の検出状況
- 適用されている`max-width`、`padding-right`の値
- 実際のレンダリング幅と設定値の比較
- `main[role="main"]`とその子要素の構造

**検出される問題**:
- `paddingRight`が異常に大きい（50px以上）
- `max-width`が正しく適用されていない
- 実際の幅が期待値と異なる

### 2. プレミアムサブスクライブセクションの調査

**目的**: 「プレミアムにサブスクライブ」セクションの非表示処理が他の要素に影響していないか確認

**調査内容**:
- 「プレミアムにサブスクライブ」テキストを含む要素の検出
- ボーダー付きコンテナの特定（最大5階層まで探索）
- 要素の階層構造（8階層まで）
- タイムラインとの位置関係

**検出される問題**:
- プレミアムサブスクライブの検出領域とタイムラインが重複
- 親要素を過剰に取得している
- 不適切なコンテナを対象にしている

### 3. 検索ボックスの調査

**目的**: 検索ボックスの非表示処理が正しく機能するか確認

**調査内容**:
- `[data-testid="SearchBox_Search_Input"]`の検出状況
- 検索ボックスのコンテナ階層（最大10階層まで探索）
- サイドバーとの位置関係
- 各階層の`display`、`position`、`padding`等のスタイル

**検出される問題**:
- 検索ボックスの入力フィールドが見つからない
- 適切なコンテナが特定できない
- 検出ロジックが機能していない

## 診断結果のフォーマット

```json
{
  "timestamp": "2025-11-24T12:34:56.789Z",
  "url": "https://x.com/home",
  "userAgent": "...",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "elements": {
    "timelineWidth": { ... },
    "premiumSubscribe": { ... },
    "searchBox": { ... },
    "pageStructure": { ... }
  },
  "issues": [
    {
      "type": "timelineWidth",
      "severity": "high",
      "message": "問題の説明",
      "details": { ... }
    }
  ]
}
```

### 重要度レベル

- **critical**: 致命的な問題（機能が完全に動作しない）
- **high**: 高い問題（主要な機能に大きな影響がある）
- **medium**: 中程度の問題（一部の機能に影響がある）
- **low**: 軽微な問題（ユーザー体験に小さな影響）

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

### 特定の調査項目のみ実行

```javascript
const diagnostic = new XUIDiagnostic();

// タイムライン幅のみ調査
diagnostic.investigateTimelineWidth();
console.log(diagnostic.diagnosticData);

// プレミアムサブスクライブのみ調査
diagnostic.investigatePremiumSubscribe();
console.log(diagnostic.diagnosticData);

// 検索ボックスのみ調査
diagnostic.investigateSearchBox();
console.log(diagnostic.diagnosticData);
```

### カスタム診断の追加

`XUIDiagnostic`クラスに新しいメソッドを追加することで、追加の診断項目を実装できます：

```javascript
investigateCustomFeature() {
    // カスタム調査ロジック
    const data = this.collectElementInfo('selector', 'description');
    this.diagnosticData.elements.customFeature = data;
    
    // 問題の検出
    if (/* 条件 */) {
        this.diagnosticData.issues.push({
            type: 'customFeature',
            severity: 'high',
            message: '問題の説明',
            details: { /* 詳細情報 */ }
        });
    }
}
```

## バージョン履歴

### v1.0.0 (2025-11-24)
- 初回リリース
- タイムライン幅、プレミアムサブスクライブ、検索ボックスの診断機能を実装
- JSON形式でのダウンロード機能を実装

## ライセンス

このツールは twitter-clean-ui プロジェクトの一部です。

## 貢献

不具合や改善案がある場合は、Issue または Pull Request を作成してください。

