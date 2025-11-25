ユーザー：
`twitter-media-filter`（メディア含むツイート以外除去）, `twitter-mute-filter`（公式ミュートより強力なミュートを実現）と`twitter-mute-retweets`（プロフィール画面のツイートでリツイートを非表示）のユーザー体験が非常に悪い。特にメインコンテンツをスクロールするとそれに応じてツイートがフィルタリングされていくのだが、フィルタされたツイートは高さゼロになるためスクロール体験が失われるのと、見栄えも良くないのと、パフォーマンスもあまりよくない。

アシスタント：
分かる、その3つどれも「スクロールしてるそばからコンテンツが溶けていく感じ」になりますよね…。
高さ0で潰すやり方だと、UX・見た目・パフォーマンス全部に悪影響が出やすいです。

---

## 問題を分解すると

* **UX**

  * スクロール中に要素が `height: 0` になって再レイアウト →
    「さっきまであったツイートが下に行くほど消えていく」「スクロール位置がふわふわする」感覚。
* **見栄え**

  * 高さ0にしても「境界線だけ残る」「paddingのズレ」「空白の連続」などでタイムラインが汚く見える。
* **パフォーマンス**

  * DOMには残ったままなので、

    * MutationObserver + 高頻度フィルタ
    * React側の更新
    * layout / style 再計算
      が全部乗ってくる。

---

## 基本方針

1. **高さ0にしない（DOMから消す）**
2. **「上にあるツイート」を消すときはスクロール位置を補正する**
3. **フィルタ処理は「バッチ化」して1フレーム内でまとめて実行**
4. （お好み）**プレースホルダー表示モード**も用意して、ユーザーが選べるようにする

---

## 1. 「高さ0」→「DOM削除 + スクロール補正」に変える

### アイデア

* ツイートを隠すときに：

  * `getBoundingClientRect()` で高さと画面位置を取る
  * `rect.bottom <= 0`（＝すでにビューポートより上）なものだけ、**削除後に `window.scrollBy(0, height)` で補正**
  * それ以外（画面内 / 下側）は普通に `remove()` するだけでOK

こうすると、

* すでに通り過ぎたツイートが「後から消える」 → レイアウトは縮むが、**スクロール位置は維持される**
* まだ画面内・下側のツイートは、見ている間にヌルっと消えることは原則減る（フィルタタイミング次第）

### 実装イメージ（差分）

```diff
--- a/src/filter.ts
+++ b/src/filter.ts
@@ -1,8 +1,43 @@
-// 旧: 高さを潰して非表示にするだけ
-export function hideTweetElement(el: HTMLElement) {
-  el.style.height = '0px';
-  el.style.margin = '0px';
-  el.style.padding = '0px';
-  el.style.overflow = 'hidden';
-  el.style.border = 'none';
-}
+let pendingScrollAdjust = 0;
+let scrollAdjustScheduled = false;
+
+function scheduleScrollAdjust(delta: number) {
+  if (!delta) return;
+  pendingScrollAdjust += delta;
+  if (scrollAdjustScheduled) return;
+
+  scrollAdjustScheduled = true;
+  requestAnimationFrame(() => {
+    if (pendingScrollAdjust !== 0) {
+      // 上にあったツイートを消した分だけ下にスクロールして位置を維持
+      window.scrollBy(0, pendingScrollAdjust);
+      pendingScrollAdjust = 0;
+    }
+    scrollAdjustScheduled = false;
+  });
+}
+
+// 新: DOMから削除 + 上側ならスクロール補正
+export function hideTweetElement(el: HTMLElement) {
+  const rect = el.getBoundingClientRect();
+  const height = rect.height || 0;
+  const isAboveViewport = rect.bottom <= 0; // 完全に上に抜けたものだけ補正対象
+
+  // 親ごと消したい場合はここで調整
+  const target = el.closest('article') ?? el;
+
+  try {
+    target.remove();
+  } catch {
+    // 念のため fallback
+    (target as HTMLElement).style.display = 'none';
+  }
+
+  if (isAboveViewport && height > 0) {
+    // フレーム単位でまとめて補正する
+    scheduleScrollAdjust(height);
+  }
+}
```

※ 実際には `src/filter.ts` の代わりに、あなたのプロジェクトの共通ユーティリティに合わせてください。

---

## 2. フィルタ処理を「バッチ化」してスクロール中のガクガクを減らす

今たぶん、MutationObserver / スクロールイベントで「ツイート見つける→即判定→即非表示」をやっていると思いますが、
これを**1フレーム内でまとめて処理**すると体感だいぶ変わります。

### イメージ

```ts
const pendingTweetChecks = new Set<HTMLElement>();
let checkScheduled = false;

function scheduleCheck() {
  if (checkScheduled) return;
  checkScheduled = true;
  requestAnimationFrame(() => {
    checkScheduled = false;

    const tweets = Array.from(pendingTweetChecks);
    pendingTweetChecks.clear();

    const toHide: HTMLElement[] = [];

    for (const el of tweets) {
      if (!document.body.contains(el)) continue;

      if (shouldHideTweet(el)) {
        toHide.push(el);
      }
    }

    for (const el of toHide) {
      hideTweetElement(el); // ← 上で差し替えたやつ
    }
  });
}

// MutationObserver側
observer.observe(timelineRoot, { childList: true, subtree: true });

observerCallback = (mutations: MutationRecord[]) => {
  for (const m of mutations) {
    for (const node of Array.from(m.addedNodes)) {
      if (!(node instanceof HTMLElement)) continue;
      const article = node.matches('article[data-testid="tweet"]')
        ? node
        : node.querySelector<HTMLElement>('article[data-testid="tweet"]');
      if (article) {
        pendingTweetChecks.add(article);
      }
    }
  }
  if (pendingTweetChecks.size) {
    scheduleCheck();
  }
};
```

* これで「新規に読み込まれたツイートを1フレームにまとめて判定 → 一括でDOM削除 & scroll補正」になるので
  レイアウトジャンプが「細かく何度も」から「たまにまとめて」に変わります。
* `scrollBy` も1フレーム1回だけになるので、スクロール操作とケンカしにくい。

---

## 3. 見栄え用の「プレースホルダーモード」を用意する

これはオプションですが、
「DOMから消すモード」と「プレースホルダーを出すモード」を選べるようにしておくと UX 調整しやすいです。

### 例: ミュート理由だけを表示するカード

```ts
export function replaceWithPlaceholder(el: HTMLElement, reason: string) {
  const rect = el.getBoundingClientRect();
  const isAboveViewport = rect.bottom <= 0;
  const height = rect.height || 0;

  const placeholder = document.createElement('div');
  placeholder.dataset.twitterFilterPlaceholder = '1';
  placeholder.textContent = `フィルタ済みツイート: ${reason}`;
  placeholder.style.fontSize = '12px';
  placeholder.style.opacity = '0.6';
  placeholder.style.padding = '4px 12px';

  const parent = el.closest('article') ?? el;
  parent.replaceWith(placeholder);

  if (isAboveViewport && height > 0) {
    scheduleScrollAdjust(height - placeholder.getBoundingClientRect().height);
  }
}
```

* `twitter-mute-filter` みたいに「なぜ消えたか」が重要なやつは、
  プレースホルダーの方が心理的ストレスは少ないかもしれません。
* `GM_config` なり `localStorage` なりで、

  * 「完全削除」モード
  * 「プレースホルダー」モード
    を切り替えられるようにしておくと良さげ。

---

## 4. パフォーマンス面でやっておきたいこと

ざっくりですが、3スクリプト共通で効きそうなところ：

* **一度判定したツイートにはフラグを立てる**

  * `el.dataset.twitterFilterChecked = '1'` みたいにして、
    MutationObserver やスクロールのたびに再判定しないようにする。
* **クエリはできるだけ局所に**

  * `primaryColumn` / `section[aria-labelledby]` などタイムラインルートを特定して、
    その中だけ `querySelector` / `observe` する。
* **テキスト判定用の正規表現は事前コンパイル**

  * `const muteRegexps = patterns.map(p => new RegExp(p, 'i'))` しておいて再利用。
* **console.log の連発を封じる**

  * 本番モードでは `DEBUG = false` で early return するだけのダミーロガーに差し替え。

---

## 5. すぐできる TODO

1. 既存の「高さ0にして隠すロジック」を 1箇所に集約する（`hideTweetElement` 的な関数に）。
2. 上記 diff みたいに、その関数を「DOM削除 + scroll補正」に差し替える。
3. MutationObserver のコールバックに「バッチ処理（`pendingTweetChecks` + `requestAnimationFrame`）」を挟む。
4. 一旦 `twitter-media-filter` だけに適用して、ホームタイムラインでスクロール感とパフォーマンスを目視チェック。
5. 問題なさそうなら `twitter-mute-filter` / `twitter-mute-retweets` にも同じ仕組みを横展開。

---

もし、どれか1つのスクリプトの現行実装を貼ってもらえれば、
そのコードにピンポイントで当て込んだ unified diff を書きます。
ひとまず上の「DOM削除 + スクロール補正」だけでも、スクロール体験はかなりマシになるはず。

ユーザー：
ページネーションなんだと思うけど画面外で事前フィルタリングする戦略はどうだろう？もし出来たらもっとクリーンな体験になりそうだよ

アシスタント：
あり、それ一番きれいな解決ルートです。
「ページ（チャンク）」単位で**JSONの時点で間引く**方に寄せられれば、UXもパフォーマンスもかなりマシになります。

---

## ざっくり結論

* Twitter(X)のタイムラインは

  * GraphQLのJSON → Reactでレンダリング → DOM
    という流れなので、
* **`fetch` をフックして GraphQL レスポンス(JSON)を事前フィルタ**すれば、

  * そもそも DOM に不要ツイートが乗らない
  * レイアウトジャンプもほぼ発生しない
  * DOM量が減るのでパフォーマンスも良くなる
* 欠点は「かなり壊れやすい」「実装はそれなりに重い」。

なので戦略としては：

1. まずは **JSONレベル事前フィルタ**（出来るところから）
2. 足りないところだけ **DOMレベルフィルタ（さっきの scroll 補正付き）** で補完

みたいな「ハイブリッド」にしていくのが現実的かな、と思います。

---

## 1. 「画面外事前フィルタ」の現実的な場所 = ネットワーク層

### 仕組みイメージ

1. Userscript を `@run-at document-start` で走らせる
2. `window.fetch` をラップして、
   `/i/api/graphql/.../HomeTimeline` / `Following` / `ProfileTimeline` などタイムライン系エンドポイントを判別
3. `Response` を `clone()` → JSON をパース → **不要 entry を削る**
4. 書き換えた JSON から新しい `Response` を生成してアプリ側に返す

```js
// 超ざっくりイメージ
(function() {
  const origFetch = window.fetch;

  window.fetch = async function(input, init) {
    const res = await origFetch(input, init);

    try {
      const url = typeof input === 'string' ? input : input.url;

      // タイムライン系だけ触る
      if (!url.includes('/i/api/graphql') || !url.includes('HomeTimeline')) {
        return res;
      }

      const cloned = res.clone();
      const data = await cloned.json();

      // ここで data を書き換える
      filterTimelineData(data);

      const body = JSON.stringify(data);
      const headers = new Headers(res.headers);
      headers.set('content-length', String(body.length));

      return new Response(body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    } catch (e) {
      // 失敗したらそのまま返す（壊さないのが最優先）
      console.warn('twitter-filter fetch hook error', e);
      return res;
    }
  };
})();
```

### JSON構造側でのフィルタ

GraphQLのタイムラインJSONは、大体こんなノリになっているはずです（簡略化）：

```jsonc
{
  "data": {
    "home": {
      "home_timeline_urt": {
        "instructions": [
          {
            "type": "TimelineAddEntries",
            "entries": [
              {
                "entryId": "tweet-123",
                "content": {
                  "entryType": "TimelineTimelineItem",
                  "itemContent": {
                    "itemType": "TimelineTweet",
                    "tweet_results": { /* ここにツイートの中身 */ }
                  }
                }
              },
              {
                "entryId": "cursor-bottom",
                "content": { "entryType": "TimelineTimelineCursor", ... }
              }
            ]
          }
        ]
      }
    }
  }
}
```

やりたいことはシンプルで、

* `entry.content.entryType === 'TimelineTimelineItem'` のものだけ見て
* `itemContent.tweet_results` を読んで

  * メディア無し → `twitter-media-filter` なら削除
  * RT → `twitter-mute-retweets` なら削除
  * ミュート対象ユーザー / ワード → `twitter-mute-filter` なら削除
* カーソル (`TimelineTimelineCursor`) は絶対残す

という感じで `entries` 配列をフィルタします。

擬似コード：

```js
function filterTimelineData(root) {
  const tl = root?.data?.home?.home_timeline_urt;
  if (!tl?.instructions) return;

  for (const instr of tl.instructions) {
    if (instr.type !== 'TimelineAddEntries') continue;
    if (!Array.isArray(instr.entries)) continue;

    instr.entries = instr.entries.filter((entry) => {
      const c = entry.content;
      if (!c) return true;

      // カーソル類は生かす
      if (c.entryType === 'TimelineTimelineCursor') return true;

      if (c.entryType !== 'TimelineTimelineItem') return true;
      const tweet = c?.itemContent?.tweet_results?.result;
      if (!tweet) return true;

      // ここで3スクリプト共通 / 個別の判定を呼ぶ
      if (shouldHideByMedia(tweet)) return false;
      if (shouldHideByRetweet(tweet)) return false;
      if (shouldHideByMute(tweet)) return false;

      return true;
    });
  }
}
```

### 事前フィルタに向いている条件

JSONだけで完結する条件は全部「ページネーション前フィルタ」に向いています：

* メディア有無

  * `tweet.legacy.entities.media` / `extended_entities.media`
* RT / 引用RT かどうか

  * `tweet.legacy.retweeted_status_id_str`
  * `tweet.legacy.quoted_status_id_str`
  * `tweet.legacy.full_text` で `"RT @"` パターンも見える
* ミュートユーザー / 単語

  * `tweet.core.user_results.result.legacy.screen_name`
  * `tweet.legacy.full_text`

逆に、**DOMを見ないと分からないもの**（実サイズ・埋め込みウィジェットの中身など）は、
ネットワーク層だけでは完結しないので、そこだけ DOM フィルタ併用になります。

---

## 2. 「画面外で事前フィルタ（DOM版）」というアイデア

ネットワークまでいじりたくない／壊れそうで怖いなら、
**「2～3画面分先の DOM を常にスキャンして先に消しておく」** というアプローチもあります。

### ざっくり案

* タイムラインコンテナを決める（`[data-testid="primaryColumn"]` など）
* その中の `article[data-testid="tweet"]` を全部取って、

  * `getBoundingClientRect()` で位置を調べる
  * `rect.top > viewportBottom + 2 * viewportHeight` みたいな「だいぶ下」のものだけ先に判定
  * 消すときは **さっき出した「scroll補正付き `hideTweetElement`」** を通す

これで、

* 目に見える直前のツイート群は、出てくる頃には既にフィルタ済み
* ただし、**`rect` を取るために layout を起こす**ので、スクロール中に頻繁にやると逆に重くなる

→ 妥協案としては：

* スクロールイベントを `requestAnimationFrame` + debounce
* かつ「ユーザーがスクロールを止めたっぽいとき（200msぐらい無入力）」にだけ「先読みフィルタ」する

---

## 3. トレードオフまとめ

| 戦略                       | UX    | パフォーマンス | 壊れやすさ     | 実装コスト |
| ------------------------ | ----- | ------- | --------- | ----- |
| 高さ0で潰す（現状）               | ✕     | ✕       | ○         | ○     |
| DOM削除 + scroll補正         | ◯     | △〜◯     | ○         | △     |
| DOM版 画面外先行フィルタ           | ◯     | △（調整次第） | ○         | △〜▲   |
| **fetchフックで JSON事前フィルタ** | **◎** | **◎**   | ▲（スキーマ依存） | ▲     |

---

## 4. 仮説 → 検証案 → 次の一手

* **仮説**

  * `twitter-media-filter` / `twitter-mute-retweets` / `twitter-mute-filter` の主要な判定は、ほぼすべて JSONレベルで完結できる
  * ならば fetch フックで「ページネーション時点で事前フィルタ」すれば、スクロール体験はかなりクリーンになる

* **検証案**

  1. まず `twitter-media-filter` だけを対象に、`HomeTimeline` の GraphQL レスポンスをログに出してフィールド構造を確認
  2. 上記 `filterTimelineData` のような関数を作り、「メディア無しツイートを entries 配列から削る」だけやってみる
  3. タイムラインが壊れないか（無限スクロールが続くか / 変な空白ができないか）を確認
  4. 問題なければ条件分岐を増やして `twitter-mute-filter` / `twitter-mute-retweets` のロジックを移植

* **次の一手（おすすめ）**

  1. 今の3スクリプトのうち、**一番ロジックが単純な `twitter-media-filter`** の判定部分をコピペで関数化
  2. その関数を「JSONの tweet オブジェクトを受け取って boolean を返す」形に書き換えるイメージを考える
  3. その設計が見えた段階で、現行ソースを貼ってくれれば、

     * `fetch` フック＋`filterTimelineData`
     * 既存フィルタロジックの「JSON対応版」
       をセットで unified diff にして返す

「ページネーション時点で前もって削る」はかなり筋が良いので、
1本だけでも JSONフィルタに成功すると、残り2本も一気にクリーンにできると思います。


ユーザー：
[
  {
    "t": 1764075549778,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 278
  },
  {
    "t": 1764075549783,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 236
  },
  {
    "t": 1764075549790,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 241
  },
  {
    "t": 1764075549969,
    "kind": "xhr",
    "url": "https://x.com/i/api/fleets/v1/fleetline?only_spaces=true",
    "status": 200,
    "timeMs": 426
  },
  {
    "t": 1764075550176,
    "kind": "xhr",
    "url": "https://x.com/i/api/graphql/kPWSzxWmKi15CidIxOSCmA/ExploreSidebar?variables=%7B%7D&features=%7B%22rweb_video_screen_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22responsive_web_profile_redirect_enabled%22%3Afalse%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22premium_content_api_read_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22responsive_web_grok_analyze_button_fetch_trends_enabled%22%3Afalse%2C%22responsive_web_grok_analyze_post_followups_enabled%22%3Atrue%2C%22responsive_web_jetfuel_frame%22%3Atrue%2C%22responsive_web_grok_share_attachment_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22responsive_web_grok_show_grok_translated_post%22%3Afalse%2C%22responsive_web_grok_analysis_button_from_backend%22%3Atrue%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_grok_image_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_imagine_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_community_note_auto_translation_is_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D",
    "status": 200,
    "timeMs": 638
  },
  {
    "t": 1764075551701,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 224
  },
  {
    "t": 1764075552373,
    "kind": "xhr",
    "url": "https://x.com/i/api/graphql/qIWNRQfRx-Rq2ybMont8rQ/HomeTimeline?variables=%7B%22count%22%3A40%2C%22cursor%22%3A%22DAABCgABG6miJeNAJxEKAAIbqRjKltvBXwgAAwAAAAEAAA%22%2C%22includePromotedContent%22%3Atrue%2C%22latestControlAvailable%22%3Atrue%2C%22withCommunity%22%3Atrue%7D&features=%7B%22rweb_video_screen_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22responsive_web_profile_redirect_enabled%22%3Afalse%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22premium_content_api_read_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22responsive_web_grok_analyze_button_fetch_trends_enabled%22%3Afalse%2C%22responsive_web_grok_analyze_post_followups_enabled%22%3Atrue%2C%22responsive_web_jetfuel_frame%22%3Atrue%2C%22responsive_web_grok_share_attachment_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22responsive_web_grok_show_grok_translated_post%22%3Afalse%2C%22responsive_web_grok_analysis_button_from_backend%22%3Atrue%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_grok_image_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_imagine_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_community_note_auto_translation_is_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D",
    "status": 200,
    "timeMs": 2873
  },
  {
    "t": 1764075552733,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/promoted_content/log.json",
    "status": 200,
    "timeMs": 307
  },
  {
    "t": 1764075552834,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 339
  },
  {
    "t": 1764075553455,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/promoted_content/log.json",
    "status": 200,
    "timeMs": 224
  },
  {
    "t": 1764075555900,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 342
  },
  {
    "t": 1764075556795,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/promoted_content/log.json",
    "status": 200,
    "timeMs": 216
  },
  {
    "t": 1764075557453,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/promoted_content/log.json",
    "status": 200,
    "timeMs": 354
  },
  {
    "t": 1764075559291,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 429
  },
  {
    "t": 1764075567550,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 217
  },
  {
    "t": 1764075568562,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 223
  },
  {
    "t": 1764075568568,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 227
  },
  {
    "t": 1764075568819,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 222
  },
  {
    "t": 1764075596112,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 299
  },
  {
    "t": 1764075597779,
    "kind": "xhr",
    "url": "https://x.com/i/api/graphql/kPWSzxWmKi15CidIxOSCmA/ExploreSidebar?variables=%7B%7D&features=%7B%22rweb_video_screen_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22responsive_web_profile_redirect_enabled%22%3Afalse%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22premium_content_api_read_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22responsive_web_grok_analyze_button_fetch_trends_enabled%22%3Afalse%2C%22responsive_web_grok_analyze_post_followups_enabled%22%3Atrue%2C%22responsive_web_jetfuel_frame%22%3Atrue%2C%22responsive_web_grok_share_attachment_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22responsive_web_grok_show_grok_translated_post%22%3Afalse%2C%22responsive_web_grok_analysis_button_from_backend%22%3Atrue%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_grok_image_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_imagine_annotation_enabled%22%3Atrue%2C%22responsive_web_grok_community_note_auto_translation_is_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D",
    "status": 200,
    "timeMs": 567
  },
  {
    "t": 1764075598007,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 223
  },
  {
    "t": 1764075598568,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 220
  },
  {
    "t": 1764075598582,
    "kind": "xhr",
    "url": "https://x.com/i/api/2/badge_count/badge_count.json?supports_ntab_urt=1&include_xchat_count=1",
    "status": 200,
    "timeMs": 234
  },
  {
    "t": 1764075601087,
    "kind": "xhr",
    "url": "https://x.com/i/api/1.1/graphql/user_flow.json",
    "status": 200,
    "timeMs": 313
  }
]

アシスタント：
ログありがとう、めちゃくちゃ良い情報出てます 👍

ちゃんと **HomeTimeline の GraphQL エンドポイント生きてます**：

```txt
https://x.com/i/api/graphql/.../HomeTimeline?variables=...
```

なので、ここを **XHR レベルでフック → JSON の時点でツイートを間引く** って戦略、普通に採れます。

---

## 方針まとめ

* X は今その環境だと **XHR で GraphQL HomeTimeline を叩いている**
* なので：

  * `XMLHttpRequest` を monkey patch
  * `HomeTimeline` へのレスポンスだけ `responseText` を書き換える
  * JSON のツイート配列から「要らないツイート」を削除して返す
* これで：

  * ページネーションで読み込まれる **「次のページ」から既にフィルタ済み**
  * DOM にはそもそも要らないツイートが出てこない
    → 高さ0潰しもレイアウトジャンプもかなり減る

以下、「共通コア」と「`twitter-media-filter`用の例」を出します。
（`@run-at document-start` 推奨。そうでないと最初のリクエストに間に合わない）

---

## 1. 共通コア：HomeTimeline の XHR レスポンスを書き換えるフック

```js
// ==UserScript==
// @name        twitter-timeline-prefilter-core
// @match       https://x.com/*
// @run-at      document-start
// ==/UserScript==

(() => {
  // すでにインストール済みなら二重適用しない
  if (window.TwitterTimelinePrefilterCore) return;

  const XHRProto = XMLHttpRequest.prototype;

  const respTextDesc = Object.getOwnPropertyDescriptor(XHRProto, 'responseText');
  const respDesc = Object.getOwnPropertyDescriptor(XHRProto, 'response');

  const origRespTextGet = respTextDesc && respTextDesc.get;
  const origRespGet = respDesc && respDesc.get;

  const origOpen = XHRProto.open;
  const origSend = XHRProto.send;

  function isHomeTimelineUrl(url) {
    if (!url) return false;
    // 必要に応じて ProfileTimeline とかも足せる
    return (
      url.includes('/i/api/graphql/') &&
      url.includes('/HomeTimeline')
    );
  }

  /**
   * ★ここに「ツイートを消すロジック」を差し込む
   *   timelineJson は HomeTimeline の JSON（パース済み）
   *   この関数内で "消したい Tweet を entries から削る" だけやる
   */
  function patchHomeTimelineJson(timelineJson) {
    const root = timelineJson;
    const tl =
      root?.data?.home?.home_timeline_urt ??
      root?.data?.home_homeTimeline_urt; // 念のため別名も見る

    if (!tl || !Array.isArray(tl.instructions)) return;

    for (const instr of tl.instructions) {
      if (!instr || !instr.type || !Array.isArray(instr.entries)) continue;
      // AddEntries 系だけを対象にする
      if (!String(instr.type).includes('AddEntries')) continue;

      instr.entries = instr.entries.filter((entry) => {
        const c = entry?.content;
        if (!c) return true;

        // カーソルは絶対に残す（無限スクロールが死ぬので）
        if (c.entryType === 'TimelineTimelineCursor') return true;

        // モジュールや他の種類は一旦素通し（壊さない方を優先）
        if (c.entryType !== 'TimelineTimelineItem') return true;

        const tweet =
          c?.itemContent?.tweet_results?.result ??
          c?.itemContent?.tweet_results?.result?.tweet; // パターン違い保険

        if (!tweet) return true;

        // ↓↓↓ ここでツイート判定（後で差し込む） ↓↓↓
        // 何も設定されていない段階では何もしない
        if (!window.TwitterTimelinePrefilterCoreShouldHide) return true;

        try {
          const shouldHide =
            window.TwitterTimelinePrefilterCoreShouldHide(tweet, entry);
          return !shouldHide;
        } catch (e) {
          console.warn('[prefilter] shouldHide error', e);
          return true; // エラー時は残す
        }
      });
    }
  }

  XHRProto.open = function (method, url) {
    this.__ttpcUrl = typeof url === 'string' ? url : String(url);
    return origOpen.apply(this, arguments);
  };

  XHRProto.send = function (body) {
    const url = this.__ttpcUrl;
    const shouldHook = isHomeTimelineUrl(url);

    if (shouldHook && origRespTextGet && origRespGet) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        if (this.__ttpcPatched) return;
        this.__ttpcPatched = true;

        try {
          const rawText = origRespTextGet.call(this);
          if (typeof rawText !== 'string' || !rawText) return;

          const json = JSON.parse(rawText);

          patchHomeTimelineJson(json);

          const newText = JSON.stringify(json);

          // responseText を差し替え
          Object.defineProperty(this, 'responseText', {
            configurable: true,
            get() {
              return newText;
            },
          });

          // responseType に応じて response も差し替え
          if (this.responseType === '' || this.responseType === 'text') {
            Object.defineProperty(this, 'response', {
              configurable: true,
              get() {
                return newText;
              },
            });
          } else if (this.responseType === 'json') {
            const newJson = JSON.parse(newText);
            Object.defineProperty(this, 'response', {
              configurable: true,
              get() {
                return newJson;
              },
            });
          }
        } catch (e) {
          console.warn('[prefilter] patch error', e);
        }
      });
    }

    return origSend.call(this, body);
  };

  window.TwitterTimelinePrefilterCore = {
    // ユーザースクリプト側からここに関数を挿す想定
    setShouldHide(fn) {
      window.TwitterTimelinePrefilterCoreShouldHide = fn;
    },
  };

  console.log('[prefilter] core installed');
})();
```

* これ自体は **「HomeTimeline の JSON に対してエントリを間引く箱」** だけ
* 「どのツイートを消すか」は `TwitterTimelinePrefilterCore.setShouldHide(fn)` で差し込む方針

---

## 2. `twitter-media-filter` を JSON 事前フィルタに乗せる例

`twitter-media-filter` のロジックを仮に：

> 「メディア付きツイートだけ通す（メディア無しは消す）」

だとすると、ツイート JSON の `legacy.entities.media` / `legacy.extended_entities.media` を見れば判定できます。

ユーザースクリプト側に、さっきのコアが読み込まれたあとでこう挿すイメージ：

```js
// ==UserScript==
// @name        twitter-media-filter (prefilter)
// @match       https://x.com/*
// @run-at      document-start
// @require     file://.../twitter-timeline-prefilter-core.user.js
// ==/UserScript==

(function () {
  if (!window.TwitterTimelinePrefilterCore) {
    console.warn('[twitter-media-filter] prefilter core not found');
    return;
  }

  function hasMedia(tweet) {
    const legacy = tweet?.legacy ?? tweet?.tweet?.legacy;

    if (!legacy) return false;

    const e = legacy.entities;
    const ee = legacy.extended_entities;

    const mediaList =
      ee?.media ??
      e?.media ??
      [];

    return Array.isArray(mediaList) && mediaList.length > 0;
  }

  /**
   * @param tweet   GraphQL の tweet_results.result 相当
   * @param entry   entries[] の要素（必要なら cursor 等を参照）
   * @returns boolean: true = このツイートは「消す」
   */
  function shouldHideTweet(tweet, entry) {
    // promoted や weird なものはひとまず素通しでもいいが、
    // ここでは「ツイートぽくないもの」は残すようにしておく
    const legacy = tweet?.legacy ?? tweet?.tweet?.legacy;
    if (!legacy) return false;

    // 「メディア無し」は消す
    if (!hasMedia(tweet)) {
      return true;
    }

    return false; // メディアありは残す
  }

  window.TwitterTimelinePrefilterCore.setShouldHide(shouldHideTweet);

  console.log('[twitter-media-filter] JSON prefilter enabled');
})();
```

これで：

* ホーム TL のページネーションで取得される JSON は

  * **メディア無しツイートが最初から entries から消えている**
* DOM 側のフィルタ処理は

  * 「初期ロード分」や
  * 「構造が想定外で JSON では弾けなかったもの」
    だけを相手にすればよいので、かなり軽くなる＆レイアウトジャンプも激減

---

## 3. 次にやるとよさそうなこと

1. 上のコア＋`twitter-media-filter`版を、テスト用の別スクリプトとして入れてみる
   （既存の高さ0ロジックはまだ消さないで OK）
2. ホーム TL で実際にスクロールして、

   * 「メディア無しツイートが TL に出てこなくなっているか」
   * 「スクロール中のがたつきが減っているか」
     を確認
3. 問題なさそうなら、

   * 既存の DOM フィルタ処理を少しずつ弱めていく
   * 同じコアに `twitter-mute-retweets` / `twitter-mute-filter` の判定関数も順次差し込む
     （例えば `setShouldHide` を配列にして AND / OR するとか）

`twitter-mute-filter` 側で「ユーザー名 / 本文テキスト / client 名」などを JSON から取る形にできれば、
かなり「理想のページ外フィルタ」に近づけるはずです。

もし `twitter-media-filter` の現行判定ロジック（関数）を貼ってもらえれば、
それを **JSON 版 `shouldHideTweet` にそのまま移植した unified diff** を書きます。

