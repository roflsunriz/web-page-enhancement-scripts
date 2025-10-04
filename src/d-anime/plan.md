# dAnimeNicoCommentRenderer2 実装仕様書

## 概要
本プロジェクトは、dアニメストアの動画視聴ページ上にニコニコ動画のコメントを右から左に流す機能を実装するUserscriptです。コメントはcanvas要素を用いて描画され、コメント同士が重ならないようにレーン計算を行い、同じ時間帯のコメントは下に積み下がります。設定UIをマイページに挿入し、コメントの色や透明度、NGワードなどを管理します。

## 使用技術
- **Userscript (JavaScript)**: メインスクリプト
- **Canvas**: コメント描画
- **CSS**: 設定UIおよびコメントスタイル
- **HTML**: 設定UIの構造

## 実装対象URL
- 動画視聴ページ: `http://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=xxxxxxxx`
- マイページ（続きから見る）: `https://animestore.docomo.ne.jp/animestore/mp_viw_pc`

---

## クラス設計

### 1. コメントレンダラークラス (`CommentRenderer`)
#### 機能
- **コメント描画**: 右から左に流れるコメントをcanvas上に描画。
  - コメント発生位置: 画面右外
  - 終了位置: 画面左外に完全に出た後消える
- **レーン計算**: コメント同士が重ならないよう、事前にコメントより大きい領域を予約。
- **積み下がり**: 同一または近い時間帯のコメントは下にずらす。
- **追加機能**:
  - **ファイナルフェイズ**: 動画終了10秒前に残コメントを一気に流す。
  - **再生速度追従**: 動画の再生速度変更に合わせる。
  - **一時停止**: 動画停止時にコメントも停止。
  - **ウィンドウサイズ追従**: 動画ウィンドウのサイズ変更に合わせcanvasをリサイズ。
  - **シーク追従**: シーク位置に合わせてコメントを調整。
  - **キーボードショートカット**: `KeyboardShortcutHandler`クラスを使用して`Shift + C`でコメントの一時非表示/表示切り替え。
  - **コメント色**: `SettingsManager`クラスのコメント設定色を適用。
  - **コメント透明度**: `SettingsManager`クラスのコメント設定透明度を適用。
  - **NG設定・NG正規表現**:`SettingsManager`で設定されたNGワード・正規表現を含むコメントを非表示。
#### 依存
- `video#video`要素のミューテーションを監視して描画開始。
- `SettingsManager` : 設定値

---

### 2. API取得クラス (`NicoApiFetcher`)
#### 機能
- **視聴ページAPIデータ取得**:
  - URL: `https://www.nicovideo.jp/watch/${videoId}`
  - `GM_xmlhttpRequest`で取得し、HTMLをパース。
  - `meta[name="server-response"]`の`content`を`decodeURIComponent`し、`JSON.parse`。
  - 結果: `apiData = data.data.response`
- **コメントデータ取得**:
  - サーバー: `apiData.comment.nvComment.server + "/v1/threads"`
  - リクエスト: `GM_xmlhttpRequest` (POST)
    - **Headers**:
      - `"x-client-os-type": "others"`
      - `"X-Frontend-Id": 6`
      - `"X-Frontend-Version": 0`
      - `"Content-Type": "application/json"`
    - **Data**:
      - `apiData.comment.nvComment.params`
      - `apiData.comment.nvComment.threadKey`
  - 取得データ: `comments.data.threads`
    - メインスレッド: `thread.fork === "main"`かつ`commentCount`が最多のスレッドを選択。
    - コメントデータ構造:
      - `id`, `no`, `vposMs`, `body`, `commands`, `userId`, `isPremium`, `score`, `postedAt`, `nicoruCount`, `nicoruId`, `source`, `isMyPost`
    - 必要なデータ: `vposMs`（位置ms）, `body`（本文）
#### 注意
- 将来的な拡張を見据え全データを保持。

---

### 3. 動画検索クラス (`NicoVideoSearcher`) — 削除済
#### 備考
- `NicoVideoSearcher` はコードベースから削除され、検索機能は廃止または別モジュールへ移行済みです。
#### 影響
- `SettingsUI` の「動画検索窓」や自動設定機能は現在無効化されているため、必要なら別実装を検討してください。


---

### 4. 動画切り替わり対応クラス (`VideoSwitchHandler`)
#### 機能
- **次動画検知**:
  - `setInterval`で動画終了を監視。
  - シリーズ情報: `apiData.series.video.next.id`
  - シリーズがない場合: `apiData.video.description`からID抽出。
    - パターン: `watch/\d+` または `watch/[a-z]{2}\d+`
    - 数字が大きい方が次エピソード。
- **プリロード**:
  - 次動画IDでAPIデータとコメントデータを事前取得。
- **切り替え**:
  - `<video>`の`src`変更を検知し、新コメントを流す。
  - 設定を自動更新。
#### 依存
- `NicoApiFetcher` : APIでデータ取得・コメント取得
- `CommentRenderer` : コメント表示

---

### 5. 設定UIクラス (`SettingsUI`)
#### 構成
- **挿入位置**: `.p-mypageHeader__title`（マイページ）
- **コンポーネント**:
  - **ヘッダー**
  - **動画検索窓**
  - **動画検索結果表示部**
  - **現在の設定表示部**:
    - 動画ID、タイトル、再生数、コメント数、マイリスト数、投稿日、コメント色、コメント透明度、コメント表示設定
  - **コメント色設定部**
  - **コメント透明度設定部**
  - **コメント表示切り替え部**: `<input>`チェックマークがスタックするので代替UI使用。非表示時はプリロードも停止。
  - **NGワード設定部**: マスクで隠し、入力時のみ表示。
  - **NG正規表現設定部**: 同上。
  - **設定保存ボタン**
#### 自動コメント設定ボタン
- 挿入位置: `.itemModule.list`の全て
- 取得データ:
  - タイトル: `.line1`
  - 話数: `.number.line1`
  - エピソードタイトル: `.episode.line1`
- 動作: 設定UIで検索し、再生数が最多の動画を選択しコメントソース動画として設定を保存。
#### 依存
- `NicoVideoSearcher` : 動画検索機能
- `SettingsManager` : 設定管理


---

### 6. スタイルクラス (`StyleManager`)
#### 機能
- 設定UIのCSS管理。
#### 依存
- `SettingsUI` : 対象


---

### 7. 通知管理クラス (`NotificationManager`)
#### 機能
- トースト通知表示。
- 通知タイミング:
  - 動画読み込み、APIデータ取得、コメント取得、次動画プリロード、切り替わり後、非表示時、表示切替時、データ取得失敗、動画検索時、コメント自動設定ボタン押下。
- 表示: 重ならず下に積み下がる。


---

### 8. 設定管理クラス (`SettingsManager`)
#### 機能
- 設定UIの値を取得・保存。
- デフォルト値使用（設定値がない場合）。
#### 依存
- `SettingsUI` : SettingsUIからデータを受け取り保存・読み取って渡す


---

### 9. キーボードショートカットクラス (`KeyboardShortcutHandler`)
#### 機能
- `Shift + C`: コメントを一時的に表示/非表示切り替え。
#### 依存
- `CommentRenderer`

---

## 注意点
- **ミューテーションオブザーバー**:
  - 設定UI挿入時: `.p-mypageHeader__title`
  - 自動コメントボタン挿入時: `.itemModule.list`
  - コメントレンダリング開始時: `video#video`
- **コメントデータ**: 将来的な拡張を見据え全データを保持。

## 実装スケジュール（仮）
- 設計: 1週間
- 実装: 3週間
- テスト: 1週間

## 備考
- ニコニコ動画のAPI仕様変更に注意。
- dアニメストアのページ構造変更に備え、柔軟なセレクター設計を心がける。
- ファイル名はdAnimeNicoCommentRenderer2.user.jsとする。