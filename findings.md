# 調査知見

- 自動リロードはAmazonの配送状況とAbliterationの対象2画面のパスを厳密に判定する。AbliterationのSPA遷移を追うためmetadataはconsole配下を対象にし、実際のリロード前にパスを再確認する。対象追加時は `vite.config.ts` のmatchと `src/auto-page-reload/main.ts` の判定の両方を更新する。

- 管理設定だけのcommitはrepo versionだけを上げ、userscript実体を変えたときだけ個別versionを上げる。`vite.config.ts` が版の正本で、d-animeの表示versionはbuild時生成のため手編集しない。
- 新規scriptはsourceだけでなく `scripts/build-all.mjs`、Vite config、README、userscripts一覧へ接続する。`dist` の再生成差分を機能変更と混同しない。
- apkcubeの広告検知bait自体をCSSで隠すと検知を発火する。配信domain由来要素だけを隠し、公式assetは日付世代+manifest/hashで保存する。document-startではdocumentElement不在を考慮する。
- Google Playの公開ページには端末別APKのURLがなく、App Bundleから端末構成別に生成される。Play詳細URLの`id`だけを検証してAPKCube公式`/apk-downloader?url=<package>`へ渡す。2026-10-24時点の公式画面では`arch=universal&langs=all`が両ARM・全言語のUniversal APKS指定で、詳細設定は同画面の`#download-options`にある。
- APKCubeの安全・著作権／低評価拒否は公式bundleの`APP_BLACKLISTED`／`LOW_RATING_BLOCKED`、downloader応答の`reason`、warning noticeで識別する。Google Play上でdownloader HTMLを先読みし、拒否対象なら代替を照合してパネルの行先を差し替える。アプリ詳細のnoticeは`rounded-sm`、downloader内は`rounded-none`のため角丸classを条件にしない。代替はAPKMirrorの厳密package検索、APKPure公式Android APIの`version_list[].package_name`と`asset_usability`、Uptodown downloadページのGoogle Play IDを2026-10-24時点で照合する。確認できた候補からAPKPure、Uptodown、APKMirrorの順で選ぶ。検索結果URLだけでは存在根拠にしない。
- manga viewerのflip中間frameはtimer pollingだけでなくCanvas styleとbook全体のMutationObserverで同期観測する。最終spreadが正しい場合だけ元へ戻して最大3回再観測し、成功した中間shape検査を省かない。
- dアニメ等の公式asset fixtureは旧世代を削除せず、manifestの現行pointerを更新する。同一asset hashを別世代の根拠にしない。
- YouTube SPA readinessは表示中watch containerの `video-id`、URL `v`、title描画を一致させる。前動画DOMの存在だけでreadyにしない。
- ニコニコmobile fullscreenはhash classでなくvideoと同矩形のancestorを使い、inline size/transformを保つ。requestFullscreenはuser event内で同期実行し、成功後だけorientation lockする。OS動画fullscreenへ下swipe解除を約束しない。
- ニコニコpremium controlsは表示contextだけを変更し、sessionUser/comment/server権利を偽装しない。React runtimeはdirect exportまたは引数なしinitializerの戻りを `jsx/jsxs` 構造で照合し、export名/hashを固定しない。
- bilibili翻訳は実browser/CDPで原文を採取する。投稿内容へ反応しない完全一致辞書+両端固定regexに限定し、login操作は利用者が行う。
- 汎用video swipeはsiteのbubble listener後の0ms taskでcancel/fullscreen epoch/transient activationを再確認する。microtaskだけでは後続listenerを待てない。site固有seekbar等は明示除外する。
- GIF direct linkはpageに存在するCDN URLだけを使い、共有URLやgifvを推測変換しない。再利用video nodeの `currentSrc` は旧媒体を保持し得るため、現在のsrc属性/sourcesと描画更新を確認する。
- Dependabot修復後のcheckが `action_required` になる場合がある。`gh pr checks` の成功項目だけで判断せずrun一覧とlogを確認し、lockfileの固定URL integrityを失わない。
- YouTube古い順は公式3番目filterのcontinuationを終端までたどり、item数をvideo数と混同しない。queue所有はsessionStorage ID+URL+player IDで判定し、未知query markerに依存しない。
- YouTube終了はHTML `ended` と公式state 0の両方を扱う。navigation待ちの旧documentが一時生存してもqueueを消さず、公式autoplayはqueue中だけ停止して終了時に復元する。
- CI matrixは同じfrozen lockから独立するaudit/lint/type/test/buildだけを並列化し、生成順やartifact依存がある処理を無理に分けない。
