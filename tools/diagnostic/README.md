# X/Twitter UI診断ツール

このディレクトリには、X/TwitterのUI要素を自動診断するスニペットが含まれています。

## 概要

`x-ui-diagnostic.js`は、X/TwitterのページでDOM要素を分析し、主要なUI要素（サイドバー、ヘッダー、広告など）を自動検出してJSON形式でエクスポートするための診断スクリプトです。

## 目的

このツールは、次の目的で作成されました：

1. X/TwitterのUI要素のセレクタ、XPath、構造情報を収集
2. 複数の検出方法（ヒューリスティック）を試行して確実性を向上
3. `twitter-clean-ui`ユーザースクリプトの開発に必要な情報を提供
4. UI変更時の影響範囲を素早く把握

## 使用方法

### ステップ1: X/Twitterにアクセス

ブラウザ（推奨: Firefox）で以下のURLにアクセスします：

- https://x.com
- または https://twitter.com

**注意**: ログイン状態で実行することを推奨します。ログイン状態でないと、一部のUI要素（プロフィールメニューなど）が表示されません。

### ステップ2: 開発者コンソールを開く

- **Windows/Linux**: `F12`または`Ctrl + Shift + I`
- **Mac**: `Cmd + Option + I`

または、ブラウザメニューから「開発者ツール」を選択します。

### ステップ3: スニペットを実行

1. `x-ui-diagnostic.js`ファイルをテキストエディタで開く
2. ファイル全体をコピー（Ctrl+A → Ctrl+C）
3. 開発者コンソールの「コンソール」タブに切り替え
4. コピーしたコードを貼り付け
5. `Enter`キーを押して実行

### ステップ4: 結果の確認

スクリプトが実行されると：

1. コンソールに診断進行状況が表示されます（各要素の検出成功/失敗）
2. 自動的に`x-ui-diagnostic-YYYY-MM-DD.json`という名前のJSONファイルがダウンロードされます
3. コンソールに以下の情報が表示されます：
   - 統計情報（総要素数、検出数、平均信頼度）
   - **カテゴリ別検出結果**（左サイドバー、右サイドバー、メインコンテンツなど）
   - **詳細な検出結果テーブル**（カテゴリごとに整理）

### ステップ5: 結果の共有

ダウンロードされたJSONファイルをアシスタント（AI）に共有することで、実際のDOM構造に基づいた`twitter-clean-ui`ユーザースクリプトの実装が可能になります。

## 診断される要素

以下のUI要素が検出されます：

### 基本要素

| 要素名 | 説明 |
|--------|------|
| `reactRoot` | Reactアプリケーションのルート要素 |
| `header` | ヘッダー |
| `mainContent` | メインコンテンツエリア（タイムライン） |

### 左サイドバー要素

| 要素名 | 説明 |
|--------|------|
| `leftSidebar` | 左サイドバー全体 |
| `leftSidebar_Container` | 左サイドバーのコンテナ（パディング調整用） |
| `leftSidebar_Logo` | Xロゴ |
| `leftSidebar_Navigation` | ナビゲーションメニュー全体 |
| `leftSidebar_HomeLink` | ホームリンク |
| `leftSidebar_ExploreLink` | 話題を検索リンク |
| `leftSidebar_NotificationsLink` | 通知リンク |
| `leftSidebar_MessagesLink` | メッセージリンク |
| `leftSidebar_BookmarksLink` | ブックマークリンク |
| `leftSidebar_ListsLink` | リストリンク |
| `leftSidebar_ProfileLink` | プロフィールリンク |
| `leftSidebar_PremiumLink` | Premiumリンク |
| `leftSidebar_CommunitiesLink` | コミュニティリンク |
| `leftSidebar_VerifiedOrgsLink` | 認証済み組織リンク |
| `leftSidebar_MoreMenu` | もっと見るメニュー |
| `tweetButton` | ツイート作成ボタン |
| `profileMenu` | プロフィールメニュー |

### 右サイドバー要素

| 要素名 | 説明 |
|--------|------|
| `rightSidebar` | 右サイドバー全体 |
| `rightSidebar_SearchBox` | 検索ボックス全体 |
| `searchBar` | 検索入力フィールド |
| `rightSidebar_PremiumSubscribe` | Premiumサブスクライブセクション |
| `rightSidebar_WhatsHappening` | いまどうしてる？セクション |
| `rightSidebar_TrendsList` | トレンド一覧 |
| `trendingSection` | 個別トレンド項目 |
| `rightSidebar_WhoToFollow` | おすすめユーザーセクション全体 |
| `rightSidebar_WhoToFollowList` | おすすめユーザー一覧 |
| `whoToFollow` | おすすめユーザーセクション（aside要素） |
| `rightSidebar_RelevantPeople` | 関連するユーザー |
| `rightSidebar_Footer` | フッターリンク |
| `rightSidebar_StickyContainer` | Stickyコンテナ（スクロール固定用） |

### メインコンテンツ要素

| 要素名 | 説明 |
|--------|------|
| `mainContent_PrimaryColumn` | プライマリカラム（タイムライン本体） |
| `mainContent_Container` | メインコンテンツのコンテナ（パディング調整用） |
| `mainContent_TimelineHeader` | タイムラインヘッダー |
| `mainContent_TabBar` | タブバー（おすすめ/フォロー中） |
| `mainContent_TweetComposer` | ツイート作成ボックス |
| `timeline` | タイムライン（ツイート一覧） |
| `promotedTweets` | 広告ツイート |

### レイアウトとスペーシング

| 要素名 | 説明 |
|--------|------|
| `layout_MainContainer` | メインコンテナ（3カラムの親） |
| `layout_CenterColumn` | 中央カラム（header + main） |
| `spacing_RightSidebarGap` | 右サイドバーとメインコンテンツの間のスペース |
| `spacing_LeftSidebarGap` | 左サイドバーとメインコンテンツの間のスペース |

### その他

| 要素名 | 説明 |
|--------|------|
| `navigationBar` | ナビゲーションバー |
| `bottomNavBar` | 下部ナビゲーションバー（モバイル表示） |

## 出力されるJSON構造

```json
{
  "timestamp": "2025-11-24T12:34:56.789Z",
  "url": "https://x.com/home",
  "userAgent": "Mozilla/5.0...",
  "viewport": {
    "width": 1920,
    "height": 1080
  },
  "elements": [
    {
      "name": "leftSidebar",
      "found": true,
      "description": "左サイドバー（ナビゲーションメニュー）",
      "tagName": "div",
      "id": null,
      "classes": ["css-175oi2r", "r-1abc02t", ...],
      "dataAttributes": {...},
      "ariaAttributes": {...},
      "role": "navigation",
      "dimensions": {
        "width": 275,
        "height": 800,
        "top": 0,
        "left": 0
      },
      "visibility": {
        "display": "flex",
        "visibility": "visible",
        "opacity": "1",
        "isVisible": true
      },
      "structure": {
        "childrenCount": 5,
        "hasText": true,
        "nestLevel": 10
      },
      "detection": {
        "method": "Navigation links container",
        "selector": "custom",
        "confidence": 0.75,
        "xpath": "/html/body/div[1]/div/div/...",
        "cssSelector": "div > div > div.css-175oi2r > ..."
      }
    },
    ...
  ],
  "statistics": {
    "totalElements": 14,
    "foundElements": 12,
    "notFoundElements": 2,
    "averageConfidence": 0.82
  }
}
```

## 検出方法（ヒューリスティック）

スクリプトは以下の複数の方法を組み合わせて要素を検出します：

1. **data-testid属性**: X/Twitterが内部的に使用するテスト用ID
2. **role属性**: ARIA roleによる検出
3. **構造パターン**: 特定のHTML構造
4. **セレクタ**: CSS セレクタ、XPath
5. **カスタム検索**: 複合条件による検索

各検出方法には**信頼度スコア**（0.0〜1.0）が付与されており、より確実な方法ほど高いスコアが設定されています。

## v2.0の新機能: アウトライン/ボーダー調査

診断スニペット v2.0では、要素を非表示にした際にアウトラインが残る問題を調査できる機能が追加されました。

### 追加された情報

各要素について以下の情報が追加されています：

- **`styles`**: border, outline, box-shadow, margin, padding等の詳細なスタイル情報
- **`visualFeatures`**: 視覚的な装飾の有無（hasVisualBorder, hasBoxShadow, hasBackground等）
- **`parentChain`**: 親要素の階層情報（最大5階層、各親要素のスタイルと視覚的特徴を含む）
- **`recommendation`**: 非表示にする際の推奨ターゲット要素と理由

### コンソール出力例

```
=== 非表示ターゲット推奨分析 ===
rightSidebar_PremiumSubscribe: 親要素 (深さ 2) の div を非表示にすることを推奨
  理由: border, box-shadow, background を持つ
rightSidebar_TrendsList: 親要素 (深さ 3) の section を非表示にすることを推奨
  理由: border, box-shadow を持つ
```

### 実装への適用方法

1. JSONファイルで該当要素の `recommendation.suggestedHideTarget` を確認
2. 「親要素 (深さ N)」の場合、`parentChain[N-1]` の情報から親要素を特定
3. その親要素を検出して非表示にするロジックを実装

## パフォーマンスへの配慮

- 検索範囲を`#react-root`や特定のコンテナに限定
- 効率的な`querySelector`/`querySelectorAll`を使用
- テキストコンテンツの全体走査を避ける
- 非同期処理でUIをブロックしない設計

## トラブルシューティング

### 一部の要素が検出されない

- **原因**: ページの読み込みが完了していない
- **解決策**: ページが完全に読み込まれるまで待ってから実行

### JSONファイルがダウンロードされない

- **原因**: ブラウザのポップアップブロック設定
- **解決策**: コンソールにも結果が出力されるので、手動でコピー&保存可能

### "ReferenceError"などのエラーが出る

- **原因**: スクリプトの一部のみがコピーされた
- **解決策**: スクリプト全体を確実にコピーしてから実行

### 検出される要素が少ない

- **原因1**: ログアウト状態で実行している
  - **解決策**: ログインしてから実行
- **原因2**: 言語設定が想定と異なる
  - **解決策**: 日本語または英語の表示で実行

## 異なるページでの実行

診断スクリプトは以下のページでも実行できます：

- ホームタイムライン: `https://x.com/home`
- 通知: `https://x.com/notifications`
- プロフィール: `https://x.com/[ユーザー名]`
- 検索結果: `https://x.com/search?q=...`

ページによって検出される要素が異なる場合があります。

## 診断結果の活用方法

診断結果JSONには各UI要素について以下の情報が含まれています：

- **セレクタ情報**: CSS セレクタ、XPath、data-testid属性
- **寸法情報**: 幅、高さ、位置
- **可視性情報**: display、visibility、opacity
- **構造情報**: 子要素数、ネストレベル
- **検出方法**: 使用した検出手法と信頼度スコア

これらの情報を使用して、以下のようなカスタマイズが可能です：

### 1. 個別要素の表示/非表示

```javascript
// 例: 右サイドバーのPremiumサブスクライブセクションを非表示
const premiumSection = document.querySelector('[data-testid="..."]');
if (premiumSection) {
  premiumSection.style.display = 'none';
}
```

### 2. 幅の調整

```javascript
// 例: メインコンテンツの幅を調整
const mainContent = document.querySelector('main[role="main"]');
if (mainContent) {
  mainContent.style.maxWidth = '900px';
}
```

### 3. スペーシングの調整

```javascript
// 例: 右サイドバーとメインコンテンツの間隔を調整
const centerColumn = document.querySelector('...');
if (centerColumn) {
  centerColumn.style.gap = '40px';
}
```

## 次のステップ

1. 診断結果JSONをアシスタントに共有
2. 結果を基に`twitter-clean-ui`ユーザースクリプトの実装計画を立案
3. 実際のセレクタと検出方法を使用してユーザースクリプトを開発
4. 各UI要素の表示/非表示、幅調整、スペーシング調整機能を実装
5. リアルタイムプレビューと設定保存機能を追加

## ライセンス

このプロジェクトのライセンスに従います（MIT License）。

