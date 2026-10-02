# 主要動画サイトの上下スワイプ実測（2026-10-02）

ユーザーのPCにある Google Chrome 154.0.8037.93 を分離されたヘッドレス一時コンテキストで起動し、390×844・タッチ入力・Android相当UAで公開ページを操作した。アカウントを持ち込まず、ログイン・bot対策回避・セキュリティ設定変更・追加インストールは行っていない。実サイト巡回は `scripts/video-swipe-site-audit.mjs`、生のDOM属性・矩形・再生状態・イベント・全画面状態は `artifacts/video-swipe-site-audit/*.json` とPNGに保存した。

標準機能の確認は **userscriptを注入する前** に行った。中央付近からの上・下ドラッグ（約70〜110px）、表示できる標準全画面ボタン、その全画面中の下ドラッグを測定した。続いて配布スクリプトを一時注入し、全画面と復元を確認した。注入用のGM設定関数はテスト用スタブであり、userscript managerでの実注入確認とは区別する。ニコニコだけは汎用版単独の確認のため、この一時ページで既定無効を解除した。

|サイト・視聴URL|標準上／下スワイプの観測|再生・条件|識別子と汎用版への反映|
|---|---|---|---|
|[YouTube](https://m.youtube.com/watch?v=aqz-KE-bpKQ)|通常表示の上・下で全画面変化なし。標準ボタンで全画面にした回も下ドラッグでは解除しなかった。操作面の表示状態により `touchmove.defaultPrevented=true`。|公開動画が再生しcurrentTimeが進んだ。ページ本体200。ログインしない。|`#movie_player`、`video.html5-main-video`、`#player-container-id`、`.player-controls-background` を観測。長年の意味的ID/クラスでも将来変更はあり得る。サイトが既処理にしたイベントを汎用版は見送り、この操作面で上スワイプを強制しない。ホスト一括除外は追加しない。|
|[Vimeo](https://vimeo.com/253905163)|標準上はページスクロール、下は復帰。全画面変化なし。今回の標準全画面ボタン操作では状態変化を確認できなかった。|公開動画が再生しcurrentTimeが進んだ。ページ200。|動画と `.vp-target` の操作面を確認。外周の `css-*` は生成クラスのためコードへ埋め込まない。汎用版で全画面・下スワイプ復元を確認。除外なし。|
|[Dailymotion](https://www.dailymotion.com/video/x3a9qru)|標準上・下で全画面変化なし。標準ボタンはiframe内BODYを全画面にし、その下スワイプで解除しなかった。|`https://geo.dailymotion.com/player/xtv3w.html?` のiframeで公開動画が継続再生。親ページ200。|`[data-testid="player-root"]`、`[data-vertical-player-ui="true"]`、`.vod_tap` を観測。`data-vertical-player-ui` は標準スワイプ全画面の存在を意味しない。親の `allow` に `fullscreen` がある。汎用版をiframe内で実行して全画面・復元を確認。親からiframeへ無理にアクセスしない。|
|[ニコニコ](https://sp.nicovideo.jp/watch/sm9)|標準上はスクロール、下は復帰。全画面変化なし。|公開視聴ページ200、動画readyState=4。ただし中央以外のタップ後もpaused=true/currentTime=0の回があり、今回の巡回で継続再生の検証はしていない。|`video[data-name="video-content"]` とstage/inner/content属性を確認。外周は生成クラス。汎用版単独で全画面・復元を確認。専用版併用は既定無効と明示的マーカーで分担。|
|[Twitch VOD](https://m.twitch.tv/videos/2882198501)|公式チャンネルの一覧からこの公開VODへのリンクを実際に取得。標準上はシーク操作面で再生位置が変化、標準下はタップとして一時停止する回があり、全画面変化なし。標準ボタンで全画面、下ドラッグでは解除しなかった。|公開VODは再生・currentTime進行を確認。ページ本体200。別フレームの429を本体応答と混同しない。|`[data-test-selector="video-player__video-container"]`、`[data-a-target="video-ref"]`、`[data-a-target="player-play-pause-button"]`、`[data-a-target="player-fullscreen-button"]`。ハッシュ付き装飾クラスは使わない。意味的 `.seekbar-interaction-area` はrole=sliderでなくてもシークするため、この識別プレイヤー内だけ `site-policy.ts` で除外。全面の再生buttonは通常のbutton除外で尊重する。|
|[bilibili候補1](https://www.bilibili.com/video/BV1DT4y1z7a1/)・[候補2](https://www.bilibili.com/video/BV1hK4y187dT/)|両方とも `m.bilibili.com/video/...` へ通常リダイレクト。視聴プレイヤーの上下操作は未確認。|ページ200。アプリ誘導とサムネイル一覧を表示。唯一の `video.gsl-video` は0×0の非表示要素で、視聴動画として確認できない。|`.gsl-video` は `.gsl-area` / `.gsl-wrap.gsl-lazy-loaded` 内にあった。これを再生プレイヤー識別子と誤認しない。アプリ起動・ログイン・制限回避は行わず、未検証として残す。サイト全体の除外を推測で追加しない。|

この6サイトの上記ページ・環境・操作範囲で、「標準の上スワイプで全画面、下スワイプで解除」の両方が発動した例は確認できなかった。これは各サイトの全バージョン、アプリ、全実機に機能が存在しないという証明ではない。短いドラッグの閾値差、再生状態、操作面、A/B配信、端末差により結果が変わり得る。

Twitchは再生状態を標準の `player-play-pause-button` で復帰させた追加測定も実施した。このときは `.click-handler` からのドラッグ終了をサイトが `preventDefault` し、通常の一時停止操作になった。汎用版は追加の全画面要求を見送った。したがってTwitchのこの操作面とYouTubeの既処理操作面について、汎用版で全画面化できたとは報告しない。これらの結果と動画全体を覆う再生buttonは、サイト側操作の優先を実ページで確認した証拠である。

重複回避は、確認したイベントキャンセル・伝播停止・全画面変化・ユーザー操作権消費・専用版のマーカー・Twitchのシーク面に基づく。観測していない標準機能をホスト名だけからあると判定するコードは追加しなかった。サイトが遅延処理で全画面を要求する等の任意ハンドラまで完全検出できないため、競合時はサイト別無効化メニューで止める。

今後標準ジェスチャーが発動した場合は、再生状態・通常／全画面・上下それぞれ・URL範囲・当該操作面とプレイヤーの安定した属性を再測定し、その属性に限った除外を追加する。現在のUIのハッシュ付きクラスや翻訳文言を判定キーにしない。
