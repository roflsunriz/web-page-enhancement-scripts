// ==UserScript==
// @name         youtube-ui-modifier
// @namespace    youtubeUiModifier
// @version      1.2.1
// @author       roflsunriz
// @description  YouTubeのおすすめ、Shorts、コメント、ナビゲーションなどを設定モーダルからリアルタイムに表示調整
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-ui-modifier.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-ui-modifier.meta.js
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  var g=typeof GM_getValue<"u"?GM_getValue:void 0,S=typeof GM_registerMenuCommand<"u"?GM_registerMenuCommand:void 0,v=typeof GM_setValue<"u"?GM_setValue:void 0;function u(n,e){S(n,e);}function x(n,e){v(n,e);}function E(n,e){return g(n,e)}const h="youtube-ui-modifier-settings",w="youtube-ui-modifier-styles",m="youtube-ui-modifier-ui-styles",l="youtube-ui-modifier-modal",p="youtube-ui-modifier-panel",b="youtube-ui-modifier-status",C=120;class k{apply(e){e.globalEnabled&&((e.hideAllShorts||e.hideSearchShorts)&&this.markShorts(),e.showOnlyFirstHomepageRow&&this.markHiddenHomepageRows(),e.hidePlayables&&this.markPlayables(),e.hideNonTimestampComments&&this.markTimestampComments(),e.hidePlaylistSuggestions&&this.markPlaylistSuggestions(),e.hideExtraSidebarTags&&this.markExtraSidebarTags(),e.hideClipButton&&this.markClipButtons(),this.shouldMarkSubscriptionItems(e)&&this.markSubscriptionItems(e),e.hideChannelForYou&&this.markChannelForYou(),this.runActions(e));}markShorts(){document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(o=>{this.markClosest(o,["ytd-compact-video-renderer","ytd-grid-video-renderer","ytd-rich-item-renderer","ytd-video-renderer","ytm-video-with-context-renderer"]);}),document.querySelectorAll('a[href^="/shorts/"]').forEach(o=>{this.markClosest(o,["ytd-video-renderer","ytd-rich-item-renderer","ytd-compact-video-renderer","ytm-video-with-context-renderer"]);}),document.querySelectorAll("*[is-shorts], ytd-reel-shelf-renderer, ytm-reel-shelf-renderer").forEach(o=>{(o.closest("ytd-rich-section-renderer")??o).setAttribute("data-youtube-ui-modifier-short","true");});}markClosest(e,t){for(const i of t){const o=e.closest(i);o&&o.setAttribute("data-youtube-ui-modifier-short","true");}}markHiddenHomepageRows(){const e=document.querySelector('ytd-browse[page-subtype="home"] ytd-rich-grid-renderer');if(!e)return;const t=Array.from(e.querySelectorAll(":scope > #contents > ytd-rich-item-renderer")),i=getComputedStyle(e).getPropertyValue("--ytd-rich-grid-items-per-row"),o=Number.parseInt(i,10)||4;t.forEach((r,d)=>{r.toggleAttribute("data-youtube-ui-modifier-hidden-home-row",d>=o);});}markPlayables(){document.querySelectorAll("ytd-mini-game-card-view-model").forEach(e=>{(e.closest("ytd-rich-section-renderer")??e).setAttribute("data-youtube-ui-modifier-playable","true");});}markTimestampComments(){document.querySelectorAll('yt-formatted-string:not(.published-time-text).ytd-comment-renderer > a.yt-simple-endpoint[href^="/watch"]').forEach(t=>{t.closest("ytd-comment-thread-renderer")?.setAttribute("data-youtube-ui-modifier-timestamp-comment","true");});}markPlaylistSuggestions(){document.querySelectorAll('ytd-item-section-header-renderer[title-style="ITEM_SECTION_HEADER_TITLE_STYLE_PLAYLIST_RECOMMENDATIONS"]').forEach(t=>{t.closest("ytd-item-section-renderer")?.setAttribute("data-youtube-ui-modifier-playlist-suggestions","true");});}markExtraSidebarTags(){const e=new Set(["all","related"]);document.querySelectorAll("yt-chip-cloud-chip-renderer").forEach(t=>{const i=t.querySelector("yt-formatted-string")?.getAttribute("title")?.trim().toLowerCase();t.toggleAttribute("data-youtube-ui-modifier-hide-chip",i!==void 0&&!e.has(i));});}markClipButtons(){document.querySelectorAll('path[d^="M8 7c0 .55-.45 1-1 1s-1-.45-1-1"]').forEach(t=>{t.closest("#menu button")?.setAttribute("data-youtube-ui-modifier-clip-button","true");});}shouldMarkSubscriptionItems(e){return e.hideSubscriptionShorts||e.hideSubscriptionLive||e.hideSubscriptionUpcoming||e.hideSubscriptionPremiere||e.hideSubscriptionVods||e.hideSubscriptionMostRelevant}markSubscriptionItems(e){document.querySelectorAll("ytd-badge-supported-renderer").forEach(t=>{this.markBadgeText(t);}),document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]').forEach(t=>this.markBadgeText(t)),e.hideSubscriptionShorts&&document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(t=>{t.closest("ytd-grid-video-renderer")?.setAttribute("data-youtube-ui-modifier-subscription-short","true"),t.closest("ytd-rich-item-renderer")?.setAttribute("data-youtube-ui-modifier-subscription-short","true");}),e.hideSubscriptionVods&&document.querySelectorAll("#metadata-line span").forEach(t=>{this.getElementText(t).includes("Streamed")&&(t.closest("ytd-grid-video-renderer")?.setAttribute("data-youtube-ui-modifier-vod","true"),t.closest("ytd-rich-item-renderer")?.setAttribute("data-youtube-ui-modifier-vod","true"));}),e.hideSubscriptionMostRelevant&&document.querySelectorAll("ytd-rich-section-renderer ytd-rich-shelf-renderer").forEach(t=>{this.getElementText(t.querySelector("span#title")).trim().toLowerCase()==="most relevant"&&t.closest("ytd-rich-section-renderer")?.setAttribute("data-youtube-ui-modifier-most-relevant","true");});}markBadgeText(e){const t=this.getElementText(e).trim().split(" ")[0]?.trim().toLowerCase();t&&(e.closest("ytd-grid-video-renderer")?.setAttribute("data-youtube-ui-modifier-badge-text",t),e.closest("ytd-rich-item-renderer")?.setAttribute("data-youtube-ui-modifier-badge-text",t));}markChannelForYou(){document.querySelectorAll('ytd-item-section-renderer[page-subtype="channels"]').forEach(e=>{this.getElementText(e.querySelector("span#title")).trim().toLowerCase()==="for you"&&e.setAttribute("data-youtube-ui-modifier-channel-for-you","true");});}runActions(e){this.redirectIfNeeded(e),e.autoSkipAds&&this.skipAds(),e.disableAutoplay&&this.disableAutoplay(),e.disableAmbientMode&&this.disablePlayerToggle(["ambient","アンビエント"]),e.disableAnnotations&&this.disablePlayerToggle(["annotation","アノテーション"]),(e.expandDescription||e.hideComments)&&this.expandDescription(),e.enableTheaterMode&&this.enableTheaterMode(),e.hideChannelAutoplay&&document.querySelector("ytd-channel-video-player-renderer video")?.pause(),(e.autofocusSearch||e.searchEngineMode)&&this.autofocusSearch(),e.hideNotificationBell&&(document.title=document.title.replace(/^\(\d+\)/,""));}redirectIfNeeded(e){const t=window.location.pathname,i=t==="/";if(e.normalizeShorts&&t.startsWith("/shorts/")){window.location.replace(window.location.href.replace("/shorts/","/watch/"));return}i&&(e.redirectHomeToSubscriptions?window.location.replace("https://www.youtube.com/feed/subscriptions"):e.redirectHomeToWatchLater?window.location.replace("https://www.youtube.com/playlist?list=WL"):e.redirectHomeToLibrary&&window.location.replace("https://www.youtube.com/feed/you"));}skipAds(){document.querySelectorAll(".ytp-ad-overlay-close-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-skip-ad button").forEach(e=>{this.isVisible(e)&&e.click();});}disableAutoplay(){document.querySelectorAll('.ytp-autonav-toggle-button[aria-checked="true"]').forEach(e=>{this.isVisible(e)&&e.click();}),document.querySelectorAll('.ytm-autonav-toggle-button-container[aria-pressed="true"]').forEach(e=>{this.isVisible(e)&&e.click();});}disablePlayerToggle(e){const t=Array.from(document.querySelectorAll(".ytp-settings-menu .ytp-panel-menu > div"));if(t.length===0){const i=document.querySelector("#ytd-player button.ytp-settings-button, button.ytp-settings-button");i&&this.isVisible(i)&&(i.click(),i.click());return}t.forEach(i=>{const o=this.getElementText(i).toLowerCase();if(!e.some(a=>o.includes(a.toLowerCase()))||i.getAttribute("aria-checked")!=="true")return;const d=i.querySelector(".ytp-menuitem-toggle-checkbox")??i;this.isVisible(d)&&d.click();});}expandDescription(){document.querySelectorAll("#description #expand.button").forEach(e=>{this.isVisible(e)&&e.click();});}enableTheaterMode(){const e=document.querySelector("ytd-watch-flexy"),t=document.querySelector(".ytp-size-button");e&&t&&!e.hasAttribute("theater")&&this.isVisible(t)&&t.click();}autofocusSearch(){if(window.location.pathname.startsWith("/watch"))return;const e=document.querySelector("input#search");e&&e.value===""&&document.activeElement!==e&&e.focus();}getElementText(e){return e instanceof HTMLElement?e.innerText:e?.textContent??""}isVisible(e){return e.offsetParent!==null}}const c={globalEnabled:true,hideAds:true,hideAllShorts:true,hideVideoThumbnails:false,blurVideoThumbnails:false,shrinkVideoThumbnails:false,disablePlayOnHover:false,searchEngineMode:false,scheduleEnabled:false,hideHomepageSuggestions:true,showHomepageRevealBox:true,hideHomepageHeader:false,showOnlyFirstHomepageRow:false,hideHomepageExtraRows:false,hideHomepageInfiniteScroll:false,hidePlayables:false,hideWatchSidebar:true,showSidebarRevealBox:true,hideEntireWatchSidebar:false,hideSidebarInfiniteScroll:false,hideExtraSidebarTags:false,hideEndScreen:true,showEndScreenRevealBox:true,hideInfoCards:false,hideOverlaySuggestions:false,hideNextButton:false,hideVideoActions:false,hideClipButton:false,hideVideoLikes:false,hideChannelSubscribers:false,hideVideoDescription:false,hideEmbeddedMoreVideos:false,hideLiveChat:false,autoSkipAds:false,disableAutoplay:false,disableAmbientMode:false,disableAnnotations:false,expandDescription:false,disableFullscreenScroll:false,normalizeShorts:false,enableTheaterMode:false,hideComments:false,hideNonTimestampComments:false,hideCommentUsernames:false,hideCommentProfiles:false,hideCommentReplies:false,hideCommentUpvotes:false,hideSearchSuggestions:false,hideSearchShorts:false,hideSearchPromoted:false,hideSearchDescriptions:false,hideSearchExtraResults:false,hideThumbnailHoverOverlay:false,hideSearchInfiniteScroll:false,hideLeftNavigation:false,onlyShowPlaylists:false,disableLogoLink:false,hideHomeLink:false,hideExploreLink:false,hideShortsLink:false,hideSubscriptionsLink:false,hideSubscriptionsSection:false,hideQuickLinksSection:false,hideExploreSection:false,hideMoreFromYoutubeSection:false,hideSettingsSection:false,hideFooterSection:false,hideChannelAutoplay:false,hideChannelForYou:false,reverseChannelVideos:false,hideSubscriptionShorts:false,hideSubscriptionMostRelevant:false,hideSubscriptionLive:false,hideSubscriptionUpcoming:false,hideSubscriptionPremiere:false,hideSubscriptionVods:false,redirectHomeToSubscriptions:false,redirectHomeToWatchLater:false,redirectHomeToLibrary:false,hideNotificationBell:false,hidePlaylistSuggestions:false,autofocusSearch:false,hideContextBoxes:false,lockSettingsWithTimer:false,lockSettingsWithCode:false,grayscaleMode:false},T=[{id:"general",label:"全体",options:[{id:"globalEnabled",label:"YouTube UI Modifierを有効化",description:"すべての表示調整を一括でオン・オフします。"},{id:"hideAds",label:"広告枠を隠す",description:"ページ内の広告コンテナやプロモーション枠を非表示にします。"},{id:"hideAllShorts",label:"Shortsを隠す",description:"ナビゲーション、棚、検索結果、動画カード内のShortsを隠します。"},{id:"hideVideoThumbnails",label:"サムネイルを隠す",description:"動画サムネイルを隠して文字情報中心にします。"},{id:"blurVideoThumbnails",label:"サムネイルをぼかす",description:"サムネイル画像だけをぼかします。"},{id:"shrinkVideoThumbnails",label:"サムネイルを小さくする",description:"動画サムネイルを小さめの固定幅に抑えます。"},{id:"disablePlayOnHover",label:"ホバー再生プレビューを隠す",description:"マウスオーバー時の動画プレビュー要素を非表示にします。"},{id:"searchEngineMode",label:"検索エンジンモード",description:"検索バーと検索結果を中心に残し、YouTubeの他領域を抑制します。"},{id:"scheduleEnabled",label:"平日の日中だけ有効化",description:"月〜金の9:00〜17:00だけ表示調整を有効にします。"}]},{id:"homepage",label:"ホーム",options:[{id:"hideHomepageSuggestions",label:"ホームのおすすめを隠す",description:"YouTubeホーム画面のおすすめ一覧を非表示にします。"},{id:"showHomepageRevealBox",label:"ホームに表示復帰ボックスを出す",description:"ホームのおすすめ非表示時に、一時表示用のボックスを表示します。"},{id:"hideHomepageHeader",label:"ホームのチップバーを隠す",description:"ホーム上部のカテゴリチップやヘッダーを隠します。"},{id:"showOnlyFirstHomepageRow",label:"ホームの最初の1行だけ残す",description:"ホームの動画グリッドで1行目以降を非表示にします。"},{id:"hideHomepageExtraRows",label:"ホームの追加棚を隠す",description:"Shortsやトレンドなどの追加セクションを隠します。"},{id:"hideHomepageInfiniteScroll",label:"ホームの無限スクロールを止める",description:"ホーム一覧末尾の継続読み込み要素を隠します。"},{id:"hidePlayables",label:"Playablesを隠す",description:"ホームなどに出るYouTube Playables棚を非表示にします。"}]},{id:"watch",label:"視聴ページ",options:[{id:"hideWatchSidebar",label:"関連動画サイドバーを隠す",description:"動画右側の関連動画一覧を非表示にします。"},{id:"showSidebarRevealBox",label:"関連動画に表示復帰ボックスを出す",description:"関連動画非表示時に、一時表示用のボックスを表示します。"},{id:"hideEntireWatchSidebar",label:"サイドバー領域ごと隠す",description:"右カラム全体を隠し、動画カラムを中央寄せします。"},{id:"hideSidebarInfiniteScroll",label:"関連動画の無限スクロールを止める",description:"関連動画サイドバー末尾の継続読み込みを非表示にします。"},{id:"hideExtraSidebarTags",label:"関連動画タグを絞る",description:"関連動画上部のタグを「All」「Related」相当だけに絞ります。"},{id:"hideEndScreen",label:"終了画面のおすすめを隠す",description:"動画終了時のおすすめグリッドを非表示にします。"},{id:"showEndScreenRevealBox",label:"終了画面に表示復帰ボックスを出す",description:"終了画面のおすすめ非表示時に、一時表示用のボックスを表示します。"},{id:"hideInfoCards",label:"情報カードを隠す",description:"動画上に出るカード要素を非表示にします。"},{id:"hideOverlaySuggestions",label:"オーバーレイ候補を隠す",description:"カードティーザーや一時停止時の候補表示を隠します。"},{id:"hideNextButton",label:"次の動画ボタンを隠す",description:"プレイヤー内の次へボタンを非表示にします。"},{id:"hideVideoActions",label:"いいね・共有などを隠す",description:"動画下のアクションボタン群を非表示にします。"},{id:"hideClipButton",label:"クリップボタンを隠す",description:"動画下メニューのクリップボタンを検出して非表示にします。"},{id:"hideVideoLikes",label:"いいね数を隠す",description:"動画下のいいね数テキストを非表示にします。"},{id:"hideChannelSubscribers",label:"登録者数を隠す",description:"チャンネル所有者行の登録者数表示を非表示にします。"},{id:"hideVideoDescription",label:"概要欄を隠す",description:"動画説明エリアを非表示にします。"},{id:"hideEmbeddedMoreVideos",label:"埋め込みプレイヤーの候補を隠す",description:"一時停止時などに出る追加動画パネルを非表示にします。"},{id:"hideLiveChat",label:"ライブチャットを隠す",description:"視聴ページのチャット領域を非表示にします。"},{id:"autoSkipAds",label:"広告をスキップ・閉じる",description:"スキップ可能な広告ボタンやオーバーレイ広告の閉じるボタンを押します。"},{id:"disableAutoplay",label:"自動再生を無効化",description:"プレイヤーの自動再生トグルがオンならオフにします。"},{id:"disableAmbientMode",label:"アンビエントモードを無効化",description:"プレイヤー設定メニュー内のアンビエントモードを可能な範囲でオフにします。"},{id:"disableAnnotations",label:"アノテーションを無効化",description:"プレイヤー設定メニュー内のアノテーションを可能な範囲でオフにします。"},{id:"expandDescription",label:"概要欄を自動展開",description:"視聴ページの概要欄を可能な範囲で展開します。"},{id:"disableFullscreenScroll",label:"全画面時のスクロールを止める",description:"全画面プレイヤー中のページスクロール領域を隠します。"},{id:"normalizeShorts",label:"Shortsを通常プレイヤーで開く",description:"Shorts URLを通常のwatch URLへリダイレクトします。"},{id:"enableTheaterMode",label:"シアターモードを有効化",description:"視聴ページで通常表示ならシアターモードへ切り替えます。"}]},{id:"comments",label:"コメント",options:[{id:"hideComments",label:"コメント欄を隠す",description:"コメント欄とコメント誘導パネルを非表示にします。"},{id:"hideNonTimestampComments",label:"時刻リンクなしコメントを隠す",description:"動画時刻リンクを含むコメントだけを残します。"},{id:"hideCommentUsernames",label:"コメント投稿者名を隠す",description:"コメント欄の投稿者名を非表示にします。"},{id:"hideCommentProfiles",label:"コメント投稿者アイコンを隠す",description:"コメント欄のプロフィール画像を非表示にします。"},{id:"hideCommentReplies",label:"返信を隠す",description:"コメント返信スレッドを非表示にします。"},{id:"hideCommentUpvotes",label:"コメントの高評価数を隠す",description:"コメントアクション内の高評価数を非表示にします。"}]},{id:"search",label:"検索",options:[{id:"hideSearchSuggestions",label:"検索候補を隠す",description:"検索ボックスのサジェストドロップダウンを隠します。"},{id:"hideSearchShorts",label:"検索結果のShortsを隠す",description:"検索結果内のShortsカードやShorts棚を隠します。"},{id:"hideSearchPromoted",label:"検索結果の広告を隠す",description:"検索結果に混ざるプロモーション動画を隠します。"},{id:"hideSearchDescriptions",label:"検索結果の説明文を隠す",description:"検索結果カード内の説明文やメタデータ補足を隠します。"},{id:"hideSearchExtraResults",label:"検索結果の追加棚を隠す",description:"検索結果内の関連棚や追加セクションを隠します。"},{id:"hideThumbnailHoverOverlay",label:"サムネイルのホバー演出を隠す",description:"検索結果などのサムネイルスライドショー演出を非表示にします。"},{id:"hideSearchInfiniteScroll",label:"検索結果の無限スクロールを止める",description:"検索結果末尾の継続読み込み要素を非表示にします。"}]},{id:"navigation",label:"左ナビ",options:[{id:"hideLeftNavigation",label:"左ナビ全体を隠す",description:"左ドロワーとミニガイドを非表示にします。"},{id:"onlyShowPlaylists",label:"プレイリストだけ表示",description:"左ナビでプレイリスト以外の主要リンクやセクションを抑制します。"},{id:"disableLogoLink",label:"YouTubeロゴリンクを無効化",description:"YouTubeロゴからホームへ戻るクリックを無効化します。"},{id:"hideHomeLink",label:"ホームリンクを隠す",description:"左ナビのホームリンクを非表示にします。"},{id:"hideExploreLink",label:"探索リンクを隠す",description:"探索、急上昇リンクを非表示にします。"},{id:"hideShortsLink",label:"Shortsリンクを隠す",description:"左ナビとモバイル下部ナビのShortsリンクを非表示にします。"},{id:"hideSubscriptionsLink",label:"登録チャンネルリンクを隠す",description:"登録チャンネルへの導線を非表示にします。"},{id:"hideSubscriptionsSection",label:"登録チャンネルセクションを隠す",description:"左ドロワーの登録チャンネルセクションを非表示にします。"},{id:"hideQuickLinksSection",label:"You/ライブラリ系セクションを隠す",description:"左ドロワーのYou、履歴などのセクションを非表示にします。"},{id:"hideExploreSection",label:"探索セクションを隠す",description:"左ドロワーの探索セクションを非表示にします。"},{id:"hideMoreFromYoutubeSection",label:"その他のYouTubeセクションを隠す",description:"左ドロワーのMore from YouTube相当のセクションを非表示にします。"},{id:"hideSettingsSection",label:"設定セクションを隠す",description:"左ドロワー下部の設定系セクションを非表示にします。"},{id:"hideFooterSection",label:"左ナビのフッターを隠す",description:"左ドロワー下部のフッターリンク群を非表示にします。"}]},{id:"channel",label:"チャンネル",options:[{id:"hideChannelAutoplay",label:"チャンネル動画の自動再生を止める",description:"チャンネルページ上部の紹介動画があれば一時停止します。"},{id:"hideChannelForYou",label:"For Youセクションを隠す",description:"チャンネルページのFor Youセクションを非表示にします。"},{id:"reverseChannelVideos",label:"チャンネル動画を逆順表示",description:"チャンネルページの動画グリッドを逆順に表示します。"}]},{id:"subscriptions",label:"登録",options:[{id:"hideSubscriptionShorts",label:"登録ページのShortsを隠す",description:"登録チャンネルページ内のShorts動画を非表示にします。"},{id:"hideSubscriptionMostRelevant",label:"Most relevant棚を隠す",description:"登録チャンネルページのMost relevantセクションを非表示にします。"},{id:"hideSubscriptionLive",label:"ライブ動画を隠す",description:"登録チャンネルページのライブ動画を非表示にします。"},{id:"hideSubscriptionUpcoming",label:"配信予定動画を隠す",description:"登録チャンネルページのUpcoming動画を非表示にします。"},{id:"hideSubscriptionPremiere",label:"プレミア公開を隠す",description:"登録チャンネルページのPremiere動画を非表示にします。"},{id:"hideSubscriptionVods",label:"配信アーカイブを隠す",description:"登録チャンネルページのStreamed表記の動画を非表示にします。"}]},{id:"redirects",label:"リダイレクト",options:[{id:"redirectHomeToSubscriptions",label:"ホームを登録チャンネルへ",description:"ホームアクセス時に登録チャンネルへ移動します。"},{id:"redirectHomeToWatchLater",label:"ホームを後で見るへ",description:"ホームアクセス時にWatch Laterへ移動します。"},{id:"redirectHomeToLibrary",label:"ホームをYouページへ",description:"ホームアクセス時にYou/ライブラリ相当のページへ移動します。"}]},{id:"other",label:"その他",options:[{id:"hideNotificationBell",label:"通知ベルを隠す",description:"ヘッダー右側の通知ベルを非表示にします。"},{id:"hidePlaylistSuggestions",label:"プレイリスト候補を隠す",description:"プレイリストページなどのおすすめセクションを隠します。"},{id:"autofocusSearch",label:"検索欄に自動フォーカス",description:"視聴ページ以外で検索欄が空なら自動的にフォーカスします。"},{id:"hideContextBoxes",label:"コンテキストボックスを隠す",description:"情報パネルや補足カードなどの文脈ボックスを非表示にします。"},{id:"lockSettingsWithTimer",label:"設定を10秒タイマーでロック",description:"Tampermonkeyメニューから設定を開く前に10秒待機します。"},{id:"lockSettingsWithCode",label:"設定をコードでロック",description:"設定を開く前に確認コードの入力を求めます。"},{id:"grayscaleMode",label:"グレースケール表示",description:"YouTube全体を白黒表示にします。"}]}];class A{load(){const e=E(h,{});return {...c,...e??{}}}save(e){x(h,e);}}const y=`
.youtube-ui-modifier-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 18, 24, 0.58);
  font-family: Arial, sans-serif;
}

.youtube-ui-modifier-dialog {
  width: min(920px, 96vw);
  max-height: min(760px, 92vh);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d7dce5;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}

.youtube-ui-modifier-header,
.youtube-ui-modifier-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.youtube-ui-modifier-footer {
  border-top: 1px solid #e5e7eb;
  border-bottom: 0;
}

.youtube-ui-modifier-header h2,
.youtube-ui-modifier-panel h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
  letter-spacing: 0;
}

.youtube-ui-modifier-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.youtube-ui-modifier-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 190px 1fr;
}

.youtube-ui-modifier-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  overflow-y: auto;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
}

.youtube-ui-modifier-category,
.youtube-ui-modifier-button,
.youtube-ui-modifier-icon-button {
  font: inherit;
  cursor: pointer;
}

.youtube-ui-modifier-category {
  width: 100%;
  padding: 10px 12px;
  color: #374151;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.youtube-ui-modifier-category:hover,
.youtube-ui-modifier-category.active {
  color: #b91c1c;
  background: #fee2e2;
}

.youtube-ui-modifier-panel {
  min-height: 0;
  padding: 20px;
  overflow-y: auto;
}

.youtube-ui-modifier-option-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.youtube-ui-modifier-option {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.youtube-ui-modifier-option-text {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.youtube-ui-modifier-option-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.youtube-ui-modifier-option-description {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.45;
}

.youtube-ui-modifier-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.youtube-ui-modifier-switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background 0.16s ease;
}

.youtube-ui-modifier-switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.16s ease;
}

.youtube-ui-modifier-option input:checked + .youtube-ui-modifier-switch {
  background: #dc2626;
}

.youtube-ui-modifier-option input:checked + .youtube-ui-modifier-switch::after {
  transform: translateX(20px);
}

.youtube-ui-modifier-icon-button {
  width: 34px;
  height: 34px;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.youtube-ui-modifier-button {
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
}

.youtube-ui-modifier-button-danger {
  color: #b91c1c;
  border-color: #fecaca;
  background: #fff5f5;
}

.youtube-ui-modifier-status {
  color: #4b5563;
  font-size: 13px;
}

.youtube-ui-modifier-reveal-box {
  position: relative;
  z-index: 2020;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
  margin: 48px auto;
  padding: 12px 16px;
  color: #374151;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.youtube-ui-modifier-reveal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.youtube-ui-modifier-reveal-box button {
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
}

.youtube-ui-modifier-reveal-box button:hover {
  text-decoration: underline;
}

.youtube-ui-modifier-reveal-primary {
  font-weight: 700;
  text-align: left;
}

@media (max-width: 700px) {
  .youtube-ui-modifier-overlay {
    padding: 10px;
  }

  .youtube-ui-modifier-content {
    grid-template-columns: 1fr;
  }

  .youtube-ui-modifier-sidebar {
    flex-direction: row;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .youtube-ui-modifier-category {
    width: auto;
    white-space: nowrap;
  }
}
`;class L{categories;getSettings;onSettingChange;onReset;activeCategoryId;constructor(e){this.categories=e.categories,this.getSettings=e.getSettings,this.onSettingChange=e.onSettingChange,this.onReset=e.onReset,this.activeCategoryId=this.categories[0]?.id??"general",this.injectStyles();}show(){if(document.getElementById(l))return;const e=document.createElement("div");e.id=l,e.className="youtube-ui-modifier-overlay",e.addEventListener("click",i=>{i.target===e&&this.hide();});const t=document.createElement("section");t.className="youtube-ui-modifier-dialog",t.setAttribute("aria-label","YouTube UI Modifier 設定"),t.appendChild(this.createHeader()),t.appendChild(this.createContent()),t.appendChild(this.createFooter()),e.appendChild(t),document.body.appendChild(e),this.renderActiveCategory();}hide(){document.getElementById(l)?.remove();}refresh(){const e=document.getElementById(l);e&&(e.querySelectorAll(".youtube-ui-modifier-category").forEach(t=>{t.classList.toggle("active",t.dataset.categoryId===this.activeCategoryId);}),e.querySelectorAll(".youtube-ui-modifier-option").forEach(t=>{const i=t.dataset.settingId;if(!this.isSettingId(i))return;const o=t.querySelector('input[type="checkbox"]');o&&(o.checked=this.getSettings()[i]);}),this.updateStatus());}renderActiveCategory(){const e=document.getElementById(p);if(!e)return;const t=this.categories.find(r=>r.id===this.activeCategoryId)??this.categories[0];if(!t)return;e.replaceChildren();const i=document.createElement("h3");i.textContent=t.label,e.appendChild(i);const o=document.createElement("div");o.className="youtube-ui-modifier-option-list",t.options.forEach(r=>{o.appendChild(this.createOption(r));}),e.appendChild(o),this.refresh();}injectStyles(){const e=document.getElementById(m);if(e instanceof HTMLStyleElement){e.textContent=y;return}const t=document.createElement("style");t.id=m,t.textContent=y,(document.head||document.documentElement).appendChild(t);}createHeader(){const e=document.createElement("header");e.className="youtube-ui-modifier-header";const t=document.createElement("div"),i=document.createElement("h2");i.textContent="YouTube UI Modifier",t.appendChild(i);const o=document.createElement("p");o.textContent="YouTube UI 表示調整パネル - リアルタイムで設定反映・自動設定保存",t.appendChild(o),e.appendChild(t);const r=document.createElement("button");return r.className="youtube-ui-modifier-icon-button",r.type="button",r.title="閉じる",r.textContent="x",r.addEventListener("click",()=>this.hide()),e.appendChild(r),e}createContent(){const e=document.createElement("div");e.className="youtube-ui-modifier-content",e.appendChild(this.createSidebar());const t=document.createElement("div");return t.className="youtube-ui-modifier-panel",t.id=p,e.appendChild(t),e}createSidebar(){const e=document.createElement("nav");return e.className="youtube-ui-modifier-sidebar",this.categories.forEach(t=>{const i=document.createElement("button");i.type="button",i.className="youtube-ui-modifier-category",i.dataset.categoryId=t.id,i.textContent=t.label,i.addEventListener("click",()=>{this.activeCategoryId=t.id,this.renderActiveCategory();}),e.appendChild(i);}),e}createFooter(){const e=document.createElement("footer");e.className="youtube-ui-modifier-footer";const t=document.createElement("span");t.className="youtube-ui-modifier-status",t.id=b,e.appendChild(t);const i=document.createElement("button");return i.type="button",i.className="youtube-ui-modifier-button youtube-ui-modifier-button-danger",i.textContent="初期設定に戻す",i.addEventListener("click",()=>{window.confirm("YouTube UI Modifierの設定を初期化しますか？")&&(this.onReset(),this.renderActiveCategory());}),e.appendChild(i),e}createOption(e){const t=document.createElement("label");t.className="youtube-ui-modifier-option",t.dataset.settingId=e.id;const i=document.createElement("span");i.className="youtube-ui-modifier-option-text";const o=document.createElement("span");o.className="youtube-ui-modifier-option-title",o.textContent=e.label,i.appendChild(o);const r=document.createElement("span");r.className="youtube-ui-modifier-option-description",r.textContent=e.description,i.appendChild(r),t.appendChild(i);const d=document.createElement("input");d.type="checkbox",d.checked=this.getSettings()[e.id],d.addEventListener("change",()=>this.onSettingChange(e.id,d.checked)),t.appendChild(d);const a=document.createElement("span");return a.className="youtube-ui-modifier-switch",t.appendChild(a),t}updateStatus(){const e=document.getElementById(b);if(!e)return;const t=this.getSettings(),i=Object.entries(t).filter(([o,r])=>o!=="globalEnabled"&&r).length;e.textContent=t.globalEnabled?`有効な項目: ${i}`:"全体設定: 無効";}isSettingId(e){return e!==void 0&&e in c}}const I={hideAds:["#masthead-ad","ytd-mealbar-promo-renderer","ytd-carousel-ad-renderer",".ytd-display-ad-renderer","ytd-ad-slot-renderer","ytd-action-companion-ad-renderer",'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',"ytm-companion-ad-renderer","ytm-promoted-sparkles-web-renderer"],hideAllShorts:['a[title="Shorts"]','ytd-mini-guide-entry-renderer[aria-label="Shorts"]',"ytd-reel-shelf-renderer","grid-shelf-view-model.ytGridShelfViewModelHostHasBottomButton.ytd-item-section-renderer.ytGridShelfViewModelHost",'[data-youtube-ui-modifier-short="true"]',"ytm-reel-shelf-renderer"],hideVideoThumbnails:["ytd-thumbnail","yt-thumbnail-view-model","ytd-playlist-thumbnail"],hidePlayables:['[data-youtube-ui-modifier-playable="true"]'],disablePlayOnHover:["#video-preview","#mouseover-overlay","ytd-thumbnail-overlay-loading-preview-renderer[is-preview-loading]"],hideHomepageSuggestions:['ytd-browse[page-subtype="home"] ytd-rich-grid-renderer','div[tab-identifier="FEwhat_to_watch"] .rich-grid-renderer-contents'],hideHomepageHeader:['ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > div#header','div[tab-identifier="FEwhat_to_watch"] div.chip-bar-contents'],showOnlyFirstHomepageRow:['ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer[data-youtube-ui-modifier-hidden-home-row="true"]','ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-continuation-item-renderer'],hideHomepageExtraRows:['ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer','div[tab-identifier="FEwhat_to_watch"] ytm-reel-shelf-renderer'],hideHomepageInfiniteScroll:['ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-continuation-item-renderer',"div.rich-grid-renderer-contents > ytm-continuation-item-renderer"],hideWatchSidebar:["#secondary > div.circle","#related",'ytm-item-section-renderer[section-identifier="related-items"]'],hideEntireWatchSidebar:["#secondary"],hideSidebarInfiniteScroll:["#secondary #contents ytd-continuation-item-renderer"],hideExtraSidebarTags:['yt-chip-cloud-chip-renderer[data-youtube-ui-modifier-hide-chip="true"]'],hideEndScreen:[".html5-endscreen",".ytp-fullscreen-grid-stills-container"],hideInfoCards:[".ytp-ce-element.ytp-ce-element"],hideOverlaySuggestions:[".ytp-cards-teaser","button.ytp-button.ytp-cards-button","div.ytp-pause-overlay"],hideNextButton:["a.ytp-next-button"],hideVideoActions:["#menu-container","#actions","ytm-slim-video-action-bar-renderer"],hideClipButton:['#menu button[data-youtube-ui-modifier-clip-button="true"]'],hideVideoLikes:["like-button-view-model .yt-spec-button-shape-next__button-text-content"],hideChannelSubscribers:["#owner-sub-count"],hideVideoDescription:["ytd-watch-metadata #description"],hideEmbeddedMoreVideos:["div.ytp-pause-overlay"],hideLiveChat:["#chat"],disableFullscreenScroll:["ytd-watch-flexy[fullscreen] div#columns"],hideComments:["#comments","#comment-teaser",'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]',"ytm-comments-entry-point-header-renderer"],hideNonTimestampComments:['ytd-comment-thread-renderer:not([data-youtube-ui-modifier-timestamp-comment="true"])'],hideCommentUsernames:["#author-text"],hideCommentProfiles:["#author-thumbnail"],hideCommentReplies:["#replies.ytd-comment-thread-renderer"],hideCommentUpvotes:["#vote-count-middle.ytd-comment-action-buttons-renderer"],hideSearchSuggestions:["div.sbdd_a",".searchbox-dropdown",".ytSearchboxComponentSuggestionsContainer"],hideSearchShorts:['#container.ytd-search [data-youtube-ui-modifier-short="true"]',"#container.ytd-search ytd-reel-shelf-renderer","#container.ytd-search grid-shelf-view-model.ytGridShelfViewModelHostHasBottomButton.ytd-item-section-renderer.ytGridShelfViewModelHost",'ytm-search [data-youtube-ui-modifier-short="true"]',"ytm-search ytm-reel-shelf-renderer"],hideSearchPromoted:["#container.ytd-search ytd-search-pyv-renderer"],hideSearchDescriptions:["#contents .metadata-snippet-container","#contents .metadata-snippet-container-one-line","#contents #description-text","#contents #description","#contents ytd-expandable-metadata-renderer"],hideSearchExtraResults:["#container.ytd-search ytd-shelf-renderer"],hideThumbnailHoverOverlay:["#mouseover-overlay"],hideSearchInfiniteScroll:[".ytd-search #contents > ytd-continuation-item-renderer"],hideLeftNavigation:["tp-yt-app-drawer#guide",'ytd-mini-guide-renderer[role="navigation"]',"yt-icon-button#guide-button"],onlyShowPlaylists:["ytd-guide-collapsible-section-entry-renderer #header","#section-items > :nth-child(1)","#section-items > :nth-child(2)","#section-items > :nth-child(3)","#section-items > :nth-child(4)","ytd-guide-collapsible-entry-renderer #expanded > ytd-guide-entry-renderer"],hideHomeLink:['a:not(#logo)[href="/"]',"ytm-pivot-bar-item-renderer:nth-child(1)"],hideExploreLink:['a[href="/feed/trending"]','a[href="/feed/explore"]','ytm-chip-cloud-chip-renderer[chip-style="STYLE_EXPLORE_LAUNCHER_CHIP"]'],hideShortsLink:['a[title="Shorts"]','ytd-mini-guide-entry-renderer[aria-label="Shorts"]',"ytm-pivot-bar-item-renderer:nth-child(2)"],hideSubscriptionsLink:['a[href="/feed/subscriptions"]'],hideSubscriptionsSection:["ytd-guide-section-renderer.style-scope:nth-of-type(2)"],hideQuickLinksSection:["ytd-guide-section-renderer.style-scope:nth-of-type(3)"],hideExploreSection:["ytd-guide-section-renderer.style-scope:nth-of-type(4)"],hideMoreFromYoutubeSection:["ytd-guide-section-renderer.style-scope:nth-of-type(5)"],hideSettingsSection:["ytd-guide-section-renderer.style-scope:nth-of-type(6)"],hideFooterSection:["#guide-renderer > div#footer"],hideChannelForYou:['[data-youtube-ui-modifier-channel-for-you="true"]'],hideSubscriptionShorts:['ytd-grid-video-renderer[data-youtube-ui-modifier-subscription-short="true"]','ytd-rich-item-renderer[data-youtube-ui-modifier-subscription-short="true"]'],hideSubscriptionMostRelevant:['ytd-rich-section-renderer[data-youtube-ui-modifier-most-relevant="true"]'],hideSubscriptionLive:['ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="live"]','ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="live"]'],hideSubscriptionUpcoming:['ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="upcoming"]','ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="upcoming"]'],hideSubscriptionPremiere:['ytd-grid-video-renderer[data-youtube-ui-modifier-badge-text="premiere"]','ytd-rich-item-renderer[data-youtube-ui-modifier-badge-text="premiere"]'],hideSubscriptionVods:['ytd-grid-video-renderer[data-youtube-ui-modifier-vod="true"]','ytd-rich-item-renderer[data-youtube-ui-modifier-vod="true"]'],hideNotificationBell:["ytd-notification-topbar-button-renderer"],hidePlaylistSuggestions:['ytd-item-section-renderer[data-youtube-ui-modifier-playlist-suggestions="true"]'],hideContextBoxes:["ytd-info-panel-container-renderer"]},M=["ytd-thumbnail img","ytd-playlist-thumbnail img","yt-thumbnail-view-model img",".video-thumbnail-img"],H=`
ytd-watch-flexy[flexy][is-two-columns_]:not([fullscreen]):not([theater]) {
  --ytd-watch-flexy-max-player-width: calc(var(--ytd-watch-flexy-chat-max-height) * var(--ytd-watch-flexy-width-ratio) / var(--ytd-watch-flexy-height-ratio)) !important;
}

#columns {
  justify-content: center !important;
}
`.trim(),R=`
ytd-thumbnail,
ytd-rich-item-renderer yt-thumbnail-view-model,
ytd-playlist-thumbnail,
*:has(> yt-collection-thumbnail-view-model),
ytd-channel-renderer #avatar-section,
ytd-movie-renderer .thumbnail-container {
  max-width: 240px !important;
  min-width: 210px !important;
  max-height: 134px !important;
}
`.trim(),_=`
#logo[href="/"] {
  pointer-events: none !important;
}
`.trim(),B=`
ytd-browse[page-subtype="channels"] #contents.ytd-rich-grid-renderer {
  flex-direction: column-reverse !important;
}
`.trim(),N=`
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app,
ytd-app[mini-guide-visible] ytd-page-manager.ytd-app,
ytd-playlist-sidebar-renderer,
ytd-playlist-header-renderer {
  margin-left: 0 !important;
  left: 0 !important;
}
`.trim(),V=`
ytd-app *,
ytm-app * {
  visibility: hidden;
}

#container.ytd-masthead,
ytd-topbar-logo-renderer,
ytd-topbar-logo-renderer *,
#center.ytd-masthead,
#center.ytd-masthead *,
ytd-topbar-menu-button-renderer,
ytd-topbar-menu-button-renderer *,
ytd-popup-container,
ytd-popup-container *,
ytd-search,
ytd-search *,
ytd-watch-flexy,
ytd-watch-flexy * {
  visibility: visible !important;
}

ytd-browse,
ytd-channel-renderer,
ytd-thumbnail,
.ytp-ce-element.ytp-ce-element,
#secondary,
#top-row,
ytd-merch-shelf-renderer,
#comments {
  display: none !important;
}

ytd-search {
  position: absolute !important;
  left: 0 !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

ytd-video-renderer {
  margin-top: 35px !important;
}

#container.ytd-masthead {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--yt-spec-base-background) !important;
}
`.trim();class P{styleElement;constructor(){this.styleElement=this.findOrCreateStyle(w);}apply(e){this.styleElement.textContent=this.createCss(e);}findOrCreateStyle(e){const t=document.getElementById(e);if(t instanceof HTMLStyleElement)return t;const i=document.createElement("style");return i.id=e,(document.head||document.documentElement).appendChild(i),i}createCss(e){if(!e.globalEnabled)return "";const t=[];for(const[i,o]of Object.entries(I))!e[i]||o.length===0||t.push(`${o.join(`,
`)} {
  display: none !important;
}`);return e.blurVideoThumbnails&&t.push(`${M.join(`,
`)} {
  filter: blur(20px) !important;
}`),e.shrinkVideoThumbnails&&t.push(R),e.hideEntireWatchSidebar&&t.push(H),e.hideLeftNavigation&&t.push(N),e.disableLogoLink&&t.push(_),e.reverseChannelVideos&&t.push(B),e.searchEngineMode&&t.push(V),e.grayscaleMode&&t.push(`ytd-app, ytm-app {
  filter: grayscale(100%) !important;
}`),`/* YouTube UI Modifier */
${t.join(`

`)}`}}const f=[{boxId:"youtube-ui-modifier-homepage-reveal",containerSelector:"ytd-page-manager",enabledSetting:"showHomepageRevealBox",revealSetting:"showHomepageRevealBox",targetSetting:"hideHomepageSuggestions",shouldShow:n=>n.hideHomepageSuggestions},{boxId:"youtube-ui-modifier-sidebar-reveal",containerSelector:"#secondary-inner",enabledSetting:"showSidebarRevealBox",revealSetting:"showSidebarRevealBox",targetSetting:"hideWatchSidebar",shouldShow:n=>n.hideWatchSidebar},{boxId:"youtube-ui-modifier-endscreen-reveal",containerSelector:"#movie_player",enabledSetting:"showEndScreenRevealBox",revealSetting:"showEndScreenRevealBox",targetSetting:"hideEndScreen",shouldShow:n=>n.hideEndScreen&&document.querySelector("#movie_player.ended-mode")!==null}];class U{closedBoxIds=new Set;apply(e,t){if(!e.globalEnabled){this.removeAll();return}f.forEach(i=>{if(!e[i.enabledSetting]||!i.shouldShow(e)||this.closedBoxIds.has(i.boxId)){document.getElementById(i.boxId)?.remove();return}this.ensureBox(i,t);});}ensureBox(e,t){if(document.getElementById(e.boxId))return;const i=document.querySelector(e.containerSelector);if(!i)return;const o=document.createElement("div");o.id=e.boxId,o.className="youtube-ui-modifier-reveal-box";const r=document.createElement("div");r.className="youtube-ui-modifier-reveal-actions";const d=document.createElement("button");d.type="button",d.textContent="今後表示しない",d.addEventListener("click",()=>{t(e.revealSetting,false),o.remove();}),r.appendChild(d);const a=document.createElement("button");a.type="button",a.textContent="x",a.addEventListener("click",()=>{this.closedBoxIds.add(e.boxId),o.remove();}),r.appendChild(a);const s=document.createElement("button");s.type="button",s.className="youtube-ui-modifier-reveal-primary",s.textContent="おすすめを表示する",s.addEventListener("click",()=>{t(e.targetSetting,false),o.remove();}),o.appendChild(r),o.appendChild(s),i.appendChild(o);}removeAll(){f.forEach(e=>document.getElementById(e.boxId)?.remove());}}class O{storage=new A;styleManager=new P;domMarker=new k;revealBoxManager=new U;settingsUi;settings={...c};observer=null;applyTimer=null;actionInterval=null;constructor(){this.settingsUi=new L({categories:T,getSettings:()=>this.settings,onSettingChange:(e,t)=>this.updateSetting(e,t),onReset:()=>this.resetSettings()});}initialize(){this.settings=this.storage.load(),this.applySettings(),this.registerMenuCommands(),this.startObserver(),this.startActionInterval(),this.patchHistoryNavigation(),document.addEventListener("keydown",this.handleKeydown);}registerMenuCommands(){u("YouTube UI Modifier 設定を開く",()=>this.openSettingsUi()),u("YouTube UI Modifier 有効/無効",()=>{this.updateSetting("globalEnabled",!this.settings.globalEnabled);});}updateSetting(e,t){this.settings={...this.settings,[e]:t},this.applySettingEffects(e,t),this.storage.save(this.settings),this.applySettings();}applySettingEffects(e,t){t&&(e==="showOnlyFirstHomepageRow"&&(this.settings.hideHomepageSuggestions=false,this.settings.hideHomepageExtraRows=true,this.settings.hideHomepageInfiniteScroll=true),e==="onlyShowPlaylists"&&(this.settings.hideLeftNavigation=false,this.settings.hideSubscriptionsSection=true,this.settings.hideExploreSection=true,this.settings.hideMoreFromYoutubeSection=true,this.settings.hideSettingsSection=true,this.settings.hideFooterSection=true,this.settings.hideHomeLink=true,this.settings.hideExploreLink=true,this.settings.hideShortsLink=true,this.settings.hideSubscriptionsLink=true),e==="redirectHomeToSubscriptions"?(this.settings.redirectHomeToWatchLater=false,this.settings.redirectHomeToLibrary=false):e==="redirectHomeToWatchLater"?(this.settings.redirectHomeToSubscriptions=false,this.settings.redirectHomeToLibrary=false):e==="redirectHomeToLibrary"&&(this.settings.redirectHomeToSubscriptions=false,this.settings.redirectHomeToWatchLater=false));}resetSettings(){this.settings={...c},this.storage.save(this.settings),this.applySettings();}applySettings(){const e=this.getEffectiveSettings();this.styleManager.apply(e),this.domMarker.apply(e),this.revealBoxManager.apply(e,(t,i)=>this.updateSetting(t,i)),this.settingsUi.refresh();}startObserver(){if(!document.body){window.setTimeout(()=>this.startObserver(),100);return}this.observer=new MutationObserver(()=>this.scheduleDomMarker()),this.observer.observe(document.body,{childList:true,subtree:true});}scheduleDomMarker(){this.applyTimer&&clearTimeout(this.applyTimer),this.applyTimer=setTimeout(()=>{this.applyTimer=null,this.domMarker.apply(this.settings);},C);}startActionInterval(){this.actionInterval=setInterval(()=>{const e=this.getEffectiveSettings();this.domMarker.apply(e),this.revealBoxManager.apply(e,(t,i)=>this.updateSetting(t,i));},1e3);}openSettingsUi(){if(!(this.settings.lockSettingsWithCode&&window.prompt("YouTube UI Modifierの設定コードを入力してください")!=="youtube-ui-modifier")){if(this.settings.lockSettingsWithTimer){window.setTimeout(()=>this.settingsUi.show(),1e4);return}this.settingsUi.show();}}getEffectiveSettings(){return !this.settings.scheduleEnabled||this.isInsideSchedule()?this.settings:{...this.settings,globalEnabled:false}}isInsideSchedule(){const e=new Date,t=e.getDay(),i=e.getHours();return t>=1&&t<=5&&i>=9&&i<17}patchHistoryNavigation(){const e=()=>{window.setTimeout(()=>this.applySettings(),50),window.setTimeout(()=>this.applySettings(),500);},t=history.pushState.bind(history);history.pushState=(...o)=>{t(...o),e();};const i=history.replaceState.bind(history);history.replaceState=(...o)=>{i(...o),e();},window.addEventListener("popstate",e);}handleKeydown=e=>{e.key==="Escape"&&this.settingsUi.hide();}}new O().initialize();

})();