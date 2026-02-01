# 開発チェックリスト：d-anime-cf-ranking

## 概要
dアニメストアのCFページ（クール別ページ）上の作品カードに、ニコニコ動画の人気指標を基にした総合順位をオーバーレイ表示するユーザースクリプト

## Phase 1: 基盤整備 ✅

- [x] `src/d-anime-cf-ranking/` フォルダ作成
- [x] `src/d-anime-cf-ranking/main.ts` エントリポイント作成
- [x] `vite.config.ts` にメタデータ・エントリ追加
- [x] パスエイリアス `@/d-anime-cf-ranking` 追加

## Phase 2: 型定義 ✅

- [x] `src/shared/types/d-anime-cf-ranking.ts` 作成
  - [x] `NicoMetrics` - 再生数/マイリスト数/コメント数/いいね数
  - [x] `CacheEntry` - キャッシュエントリ（title, metrics, fetchedAt, status, failureReason）
  - [x] `CacheStatus` - "ok" | "failed" | "pending"
  - [x] `RankData` - スコア/順位/ランク帯
  - [x] `Settings` - 設定（表示ON/OFF）
  - [x] `RepresentativeVideo` - 代表動画情報

## Phase 3: 設定・永続化 ✅

- [x] `src/d-anime-cf-ranking/config/settings.ts`
  - [x] Zodスキーマ定義（SettingsSchema, CacheEntrySchema）
  - [x] デフォルト設定
  - [x] Tampermonkeyメニュー連携（表示ON/OFF）
- [x] `src/d-anime-cf-ranking/services/cache-manager.ts`
  - [x] IndexedDB初期化
  - [x] TTL判定（24時間）
  - [x] CRUD操作

## Phase 4: タイトル正規化 ✅

- [x] `src/d-anime-cf-ranking/services/title-normalizer.ts`
  - [x] `2nd season / Season 2 / 第2期 / 2期` → `第2期` 統一
  - [x] ローマ数字変換（II → 2 → 第2期）
  - [x] `続編 / 完結編 / 後編` は正規化しない
- [ ] Vitestユニットテスト（Phase 13で実施）

## Phase 5: ニコニコAPI連携 ✅

- [x] `src/d-anime-cf-ranking/services/nico-api-client.ts`
  - [x] 検索API（タイトル検索）※既存NicoVideoSearcher参照
  - [x] 視聴ページAPI（指標取得: view/mylist/comment/like）
  - [x] 投稿者名ガード（dアニメストア ニコニコ支店 vs 作品タイトル投稿者）

## Phase 6: 代表動画決定 ✅

- [x] `src/d-anime-cf-ranking/services/representative-selector.ts`
  - [x] 投稿者ガード適用後の動画群から「最古投稿日」の動画を選択
  - [x] dアニメストア ニコニコ支店投稿者フォールバック
  - [x] 見つからない場合は失敗扱い
- [ ] Vitestユニットテスト（Phase 13で実施）

## Phase 7: スコア計算・順位化 ✅

- [x] `src/d-anime-cf-ranking/services/score-calculator.ts`
  - [x] log10(value + 1) 変換
  - [x] min-max正規化（ページ内全作品母集団）
  - [x] 4指標等重み平均
  - [x] 順位降順算出
  - [x] ランク帯判定（S/A/B/C/D）
- [ ] Vitestユニットテスト（Phase 13で実施）

## Phase 8: DOM操作 ✅

- [x] `src/d-anime-cf-ranking/dom/card-detector.ts`
  - [x] `.itemModule.list[data-workid]` 作品カード検出
  - [x] `.newTVtitle span` タイトル抽出
  - [x] MutationObserver（動的カード追加対応）
- [x] 挿入位置ロジック（card-detector.ts内）
  - [x] `.circleProgress` と `.check` の間に挿入位置特定
  - [x] 再探索・再挿入ロジック

## Phase 9: UI/コンポーネント ✅

- [x] `src/d-anime-cf-ranking/ui/rank-badge.ts`（vanilla TS実装）
  - [x] 「第{rank}位」表示
  - [x] ランク色分け（S/A/B/C/D）
  - [x] ローディング状態（…）
  - [x] 失敗状態（警告アイコン + リトライボタン）
  - [x] ホバーツールチップ（総合スコア/指標/代表動画/取得日時）

## Phase 10: 取得制御 ✅

- [x] `src/d-anime-cf-ranking/dom/viewport-observer.ts`
  - [x] IntersectionObserver設定
  - [x] ビューポート内10件制限
  - [x] スクロール追従
- [x] `src/d-anime-cf-ranking/services/fetch-controller.ts`
  - [x] 並列5件制限
  - [x] キュー管理
  - [x] 逐次描画トリガー

## Phase 11: キャッシュ・状態管理 ✅

- [x] IndexedDB保存項目
  - [x] title（検索キー）
  - [x] canonicalQuery（正規化後タイトル）
  - [x] representativeVideoId
  - [x] metrics（4指標）
  - [x] fetchedAt
  - [x] status（ok/failed/pending）
  - [x] failureReason
- [x] TTL判定（24時間）ロジック
- [ ] Vitestユニットテスト（Phase 13で実施）

## Phase 12: エラーハンドリング・リトライ ✅

- [x] 失敗表示UI
  - [x] 警告アイコン（⚠️）
  - [x] ホバーで理由表示
- [x] リトライボタン
  - [x] クリックで当該作品のみ再取得（TTL無視）
  - [x] クールダウン制御（連打対策）

## Phase 13: Vitestユニットテスト ⏳

- [ ] タイトル正規化テスト
  - [ ] season/ローマ数字/期扱いしない語
- [ ] 代表動画決定テスト
  - [ ] 投稿者フィルタ→最古投稿日選択
- [ ] スコア計算テスト
  - [ ] log→minmax→平均→順位
  - [ ] max==min時の正規化
  - [ ] 欠損作品の扱い
- [ ] TTL判定テスト
  - [ ] 24時間判定
  - [ ] 状態遷移（ok/failed/pending）

## Phase 14: Playwright E2Eテスト ⏳

- [ ] CFページでの作品カード検出
- [ ] ネットワークモックで順位表示確認
- [ ] ホバーで詳細ツールチップ表示
- [ ] 失敗状態モック→リトライ動作確認
- [ ] スクロールでビューポート10件制限確認

## Phase 15: 品質確認・ビルド ✅

- [x] `npm run lint` パス
- [x] `npm run type-check` パス
- [x] `npm run build` パス
- [x] バージョン更新（vite.config.ts）- v1.0.0
- [ ] 実環境での動作確認（手動テスト要）

---

## 参考資料

- 要件定義書: `docs/requirements_d_anime_ranking.md`
- HTMLスニペット: `docs/d_anime_CF_snippet.html`
- ニコニコAPI:
  - `docs/nico-watch-api.md`
  - `docs/nv-comment-api.md`
  - `docs/nv-comment-api-snippet.md`
- 既存実装参考:
  - `src/d-anime/services/nico-video-searcher.ts`
  - `src/d-anime/services/nico-api-fetcher.ts`

## DOM構造メモ

```html
<!-- 作品カード -->
<div class="itemModule list" data-workid="28574">
  <section class="newTVContainer">
    <h3><p class="newTVtitle"><span>作品タイトル</span></p></h3>
    ...
    <!-- 挿入位置: circleProgress と check の間 -->
    <div class="circleProgress checked">...</div>
    <!-- ★ここに順位バッジを挿入 -->
    <div class="check">
      <input class="favo ui-favo" ...>
    </div>
  </section>
</div>
```

## ランク帯定義

| ランク | パーセンタイル |
|--------|----------------|
| S | 上位10% |
| A | 10–25% |
| B | 25–50% |
| C | 50–75% |
| D | 75–100% |

---

作成日: 2026-02-02
