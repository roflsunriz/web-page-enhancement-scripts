# Conventional Commits 記法ガイド

## 1. はじめに

Conventional Commitsは、コミットメッセージに一貫性を持たせるためのシンプルで分かりやすい規約です。この規約に従うことで、以下のようなメリットがあります。

*   **CHANGELOGの自動生成:** コミット履歴から自動的にCHANGELOGを作成できます。
*   **セマンティックバージョニングの自動化:** `feat`や`fix`などの`type`に基づいて、自動でバージョンアップ（メジャー、マイナー、パッチ）を判断できます。
*   **可読性の向上:** チームメンバーや他の開発者が、変更の意図を素早く理解できるようになります。
*   **履歴の整理:** コミット履歴の検索や絞り込みが容易になります。

## 2. コミットメッセージの構造

Conventional Commitsのメッセージは、以下の構造を持ちます。

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

---

### 2.1. `<type>` (必須)

コミットの種類を示すキーワードです。以下のいずれかを使用します。

*   **feat:** ユーザー向けの新しい機能の追加
*   **fix:** ユーザー向けのバグ修正
*   **docs:** ドキュメントのみの変更
*   **style:** コードの動作に影響しない変更（フォーマット、セミコロンの欠落など）
*   **refactor:** バグ修正でも機能追加でもないコードの内部的な改善
*   **perf:** パフォーマンスを向上させるコードの変更
*   **test:** テストコードの追加・修正
*   **build:** ビルドシステムや外部依存に関する変更（例: npm, webpack, gulp）
*   **ci:** CI/CDの設定ファイルやスクリプトの変更（例: GitHub Actions, CircleCI）
*   **chore:** 上記のいずれにも当てはまらない雑多な変更（例: `.gitignore`の更新）

### 2.2. `[optional scope]` (任意)

変更が影響する範囲を`()`で囲んで示します。プロジェクト固有のスコープ（例: `api`, `ui`, `db`）を設定すると、より変更箇所が分かりやすくなります。

### 2.3. `<description>` (必須)

変更内容の簡潔な説明です。以下のルールに従います。

*   **現在形・命令形**で記述します。（例: `add`, `change`, `fix`）
*   文頭は**小文字**で始めます。
*   文末に**ピリオド（`.`）は付けません**。

### 2.4. `[optional body]` (任意)

変更の動機や、以前の動作との違いなど、より詳細なコンテキストを記述します。`description`から1行空けて記述します。

### 2.5. `[optional footer(s)]` (任意)

`body`から1行空けて記述します。主に以下の2つの目的で使用します。

1.  **破壊的変更 (Breaking Changes):**
    `BREAKING CHANGE:` というプレフィックスを付けて、APIの互換性を壊す変更の詳細を記述します。
2.  **関連するIssueの参照:**
    `Closes #123` や `Fixes #456` のように、関連するIssue番号を記述します。

---

## 3. 破壊的変更 (BREAKING CHANGE)

APIの互換性を壊すような重大な変更は、コミットメッセージで明示する必要があります。これにより、メジャーバージョンの更新が必要であることが伝わります。

明示するには2つの方法があります。

1.  **フッターに `BREAKING CHANGE:` を追加する**
2.  **`<type>` の直後に `!` を付ける**

```
// フッターを使用する例
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

```
// `!` を使用する例
refactor!: drop support for Node 6
```

---

## 4. 具体例

### 例1: 新機能の追加

`feat: add user authentication endpoint`

### 例2: スコープ付きのバグ修正

`fix(api): correct pagination logic for user list`

### 例3: 詳細な説明とIssueへの参照を含むコミット

`fix: prevent race condition on form submission`

### 例4: 破壊的変更を含むリファクタリング

`refactor(auth)!: rename user ID field from \`uid\` to \`userId\``

### 例5: ドキュメントの更新

`docs: update installation guide for Windows users`