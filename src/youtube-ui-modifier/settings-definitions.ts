import type {
  YoutubeUiModifierCategoryDefinition,
  YoutubeUiModifierSettings,
} from "@/shared/types";

export const DEFAULT_SETTINGS: YoutubeUiModifierSettings = {
  language: "auto",
  globalEnabled: true,
  hideAds: false,
  hideAllShorts: false,
  hideVideoThumbnails: false,
  blurVideoThumbnails: false,
  shrinkVideoThumbnails: false,
  disablePlayOnHover: false,
  searchEngineMode: false,
  scheduleEnabled: false,
  hideHomepageSuggestions: false,
  showHomepageRevealBox: false,
  hideHomepageHeader: false,
  showOnlyFirstHomepageRow: false,
  hideHomepageExtraRows: false,
  hideHomepageInfiniteScroll: false,
  hidePlayables: false,
  hideWatchSidebar: false,
  showSidebarRevealBox: false,
  hideEntireWatchSidebar: false,
  hideSidebarInfiniteScroll: false,
  hideExtraSidebarTags: false,
  hideEndScreen: false,
  showEndScreenRevealBox: false,
  hideInfoCards: false,
  hideOverlaySuggestions: false,
  hideNextButton: false,
  hideVideoActions: false,
  hideClipButton: false,
  hideVideoLikes: false,
  hideChannelSubscribers: false,
  hideVideoDescription: false,
  hideEmbeddedMoreVideos: false,
  hideLiveChat: false,
  autoSkipAds: false,
  disableAutoplay: false,
  disableAmbientMode: false,
  disableAnnotations: false,
  expandDescription: false,
  disableFullscreenScroll: false,
  normalizeShorts: false,
  enableTheaterMode: false,
  hideComments: false,
  hideNonTimestampComments: false,
  hideCommentUsernames: false,
  hideCommentProfiles: false,
  hideCommentReplies: false,
  hideCommentUpvotes: false,
  hideSearchSuggestions: false,
  hideSearchShorts: false,
  hideSearchPromoted: false,
  hideSearchDescriptions: false,
  hideSearchExtraResults: false,
  hideThumbnailHoverOverlay: false,
  hideSearchInfiniteScroll: false,
  hideLeftNavigation: false,
  onlyShowPlaylists: false,
  disableLogoLink: false,
  hideHomeLink: false,
  hideExploreLink: false,
  hideShortsLink: false,
  hideSubscriptionsLink: false,
  hideSubscriptionsSection: false,
  hideQuickLinksSection: false,
  hideExploreSection: false,
  hideMoreFromYoutubeSection: false,
  hideSettingsSection: false,
  hideFooterSection: false,
  hideChannelAutoplay: false,
  hideChannelForYou: false,
  reverseChannelVideos: false,
  hideSubscriptionShorts: false,
  hideSubscriptionMostRelevant: false,
  hideSubscriptionLive: false,
  hideSubscriptionUpcoming: false,
  hideSubscriptionPremiere: false,
  hideSubscriptionVods: false,
  redirectHomeToSubscriptions: false,
  redirectHomeToWatchLater: false,
  redirectHomeToLibrary: false,
  hideNotificationBell: false,
  hidePlaylistSuggestions: false,
  autofocusSearch: false,
  hideContextBoxes: false,
  hideCreateButton: false,
  lockSettingsWithTimer: false,
  lockSettingsWithCode: false,
  grayscaleMode: false,
};

export const CATEGORIES: ReadonlyArray<YoutubeUiModifierCategoryDefinition> = [
  {
    id: "general",
    label: "全体",
    options: [
      {
        id: "globalEnabled",
        label: "YouTube UI Modifierを有効化",
        description: "すべての表示調整を一括でオン・オフします。",
      },
      {
        id: "hideAds",
        label: "広告枠を隠す",
        description:
          "ページ内の広告コンテナやプロモーション枠を非表示にします。",
      },
      {
        id: "hideAllShorts",
        label: "Shortsを隠す",
        description:
          "ナビゲーション、棚、検索結果、動画カード内のShortsを隠します。",
      },
      {
        id: "hideVideoThumbnails",
        label: "サムネイルを隠す",
        description: "動画サムネイルを隠して文字情報中心にします。",
      },
      {
        id: "blurVideoThumbnails",
        label: "サムネイルをぼかす",
        description: "サムネイル画像だけをぼかします。",
      },
      {
        id: "shrinkVideoThumbnails",
        label: "サムネイルを小さくする",
        description: "動画サムネイルを小さめの固定幅に抑えます。",
      },
      {
        id: "disablePlayOnHover",
        label: "ホバー再生プレビューを隠す",
        description: "マウスオーバー時の動画プレビュー要素を非表示にします。",
      },
      {
        id: "searchEngineMode",
        label: "検索エンジンモード",
        description:
          "検索バーと検索結果を中心に残し、YouTubeの他領域を抑制します。",
      },
      {
        id: "scheduleEnabled",
        label: "平日の日中だけ有効化",
        description: "月〜金の9:00〜17:00だけ表示調整を有効にします。",
      },
    ],
  },
  {
    id: "homepage",
    label: "ホーム",
    options: [
      {
        id: "hideHomepageSuggestions",
        label: "ホームのおすすめを隠す",
        description: "YouTubeホーム画面のおすすめ一覧を非表示にします。",
      },
      {
        id: "showHomepageRevealBox",
        label: "ホームに表示復帰ボックスを出す",
        description:
          "ホームのおすすめ非表示時に、一時表示用のボックスを表示します。",
      },
      {
        id: "hideHomepageHeader",
        label: "ホームのチップバーを隠す",
        description: "ホーム上部のカテゴリチップやヘッダーを隠します。",
      },
      {
        id: "showOnlyFirstHomepageRow",
        label: "ホームの最初の1行だけ残す",
        description: "ホームの動画グリッドで1行目以降を非表示にします。",
      },
      {
        id: "hideHomepageExtraRows",
        label: "ホームの追加棚を隠す",
        description: "Shortsやトレンドなどの追加セクションを隠します。",
      },
      {
        id: "hideHomepageInfiniteScroll",
        label: "ホームの無限スクロールを止める",
        description: "ホーム一覧末尾の継続読み込み要素を隠します。",
      },
      {
        id: "hidePlayables",
        label: "Playablesを隠す",
        description: "ホームなどに出るYouTube Playables棚を非表示にします。",
      },
    ],
  },
  {
    id: "watch",
    label: "視聴ページ",
    options: [
      {
        id: "hideWatchSidebar",
        label: "関連動画サイドバーを隠す",
        description: "動画右側の関連動画一覧を非表示にします。",
      },
      {
        id: "showSidebarRevealBox",
        label: "関連動画に表示復帰ボックスを出す",
        description: "関連動画非表示時に、一時表示用のボックスを表示します。",
      },
      {
        id: "hideEntireWatchSidebar",
        label: "サイドバー領域ごと隠す",
        description: "右カラム全体を隠し、動画カラムを中央寄せします。",
      },
      {
        id: "hideSidebarInfiniteScroll",
        label: "関連動画の無限スクロールを止める",
        description: "関連動画サイドバー末尾の継続読み込みを非表示にします。",
      },
      {
        id: "hideExtraSidebarTags",
        label: "関連動画タグを絞る",
        description:
          "関連動画上部のタグを「All」「Related」相当だけに絞ります。",
      },
      {
        id: "hideEndScreen",
        label: "終了画面のおすすめを隠す",
        description: "動画終了時のおすすめグリッドを非表示にします。",
      },
      {
        id: "showEndScreenRevealBox",
        label: "終了画面に表示復帰ボックスを出す",
        description:
          "終了画面のおすすめ非表示時に、一時表示用のボックスを表示します。",
      },
      {
        id: "hideInfoCards",
        label: "情報カードを隠す",
        description: "動画上に出るカード要素を非表示にします。",
      },
      {
        id: "hideOverlaySuggestions",
        label: "オーバーレイ候補を隠す",
        description: "カードティーザーや一時停止時の候補表示を隠します。",
      },
      {
        id: "hideNextButton",
        label: "次の動画ボタンを隠す",
        description: "プレイヤー内の次へボタンを非表示にします。",
      },
      {
        id: "hideVideoActions",
        label: "いいね・共有などを隠す",
        description: "動画下のアクションボタン群を非表示にします。",
      },
      {
        id: "hideClipButton",
        label: "クリップボタンを隠す",
        description: "動画下メニューのクリップボタンを検出して非表示にします。",
      },
      {
        id: "hideVideoLikes",
        label: "いいね数を隠す",
        description: "動画下のいいね数テキストを非表示にします。",
      },
      {
        id: "hideChannelSubscribers",
        label: "登録者数を隠す",
        description: "チャンネル所有者行の登録者数表示を非表示にします。",
      },
      {
        id: "hideVideoDescription",
        label: "概要欄を隠す",
        description: "動画説明エリアを非表示にします。",
      },
      {
        id: "hideEmbeddedMoreVideos",
        label: "埋め込みプレイヤーの候補を隠す",
        description: "一時停止時などに出る追加動画パネルを非表示にします。",
      },
      {
        id: "hideLiveChat",
        label: "ライブチャットを隠す",
        description: "視聴ページのチャット領域を非表示にします。",
      },
      {
        id: "autoSkipAds",
        label: "広告をスキップ・閉じる",
        description:
          "スキップ可能な広告ボタンやオーバーレイ広告の閉じるボタンを押します。",
      },
      {
        id: "disableAutoplay",
        label: "自動再生を無効化",
        description: "プレイヤーの自動再生トグルがオンならオフにします。",
      },
      {
        id: "disableAmbientMode",
        label: "アンビエントモードを無効化",
        description:
          "プレイヤー設定メニュー内のアンビエントモードを可能な範囲でオフにします。",
      },
      {
        id: "disableAnnotations",
        label: "アノテーションを無効化",
        description:
          "プレイヤー設定メニュー内のアノテーションを可能な範囲でオフにします。",
      },
      {
        id: "expandDescription",
        label: "概要欄を自動展開",
        description: "視聴ページの概要欄を可能な範囲で展開します。",
      },
      {
        id: "disableFullscreenScroll",
        label: "全画面時のスクロールを止める",
        description: "全画面プレイヤー中のページスクロール領域を隠します。",
      },
      {
        id: "normalizeShorts",
        label: "Shortsを通常プレイヤーで開く",
        description: "Shorts URLを通常のwatch URLへリダイレクトします。",
      },
      {
        id: "enableTheaterMode",
        label: "シアターモードを有効化",
        description: "視聴ページで通常表示ならシアターモードへ切り替えます。",
      },
    ],
  },
  {
    id: "comments",
    label: "コメント",
    options: [
      {
        id: "hideComments",
        label: "コメント欄を隠す",
        description: "コメント欄とコメント誘導パネルを非表示にします。",
      },
      {
        id: "hideNonTimestampComments",
        label: "時刻リンクなしコメントを隠す",
        description: "動画時刻リンクを含むコメントだけを残します。",
      },
      {
        id: "hideCommentUsernames",
        label: "コメント投稿者名を隠す",
        description: "コメント欄の投稿者名を非表示にします。",
      },
      {
        id: "hideCommentProfiles",
        label: "コメント投稿者アイコンを隠す",
        description: "コメント欄のプロフィール画像を非表示にします。",
      },
      {
        id: "hideCommentReplies",
        label: "返信を隠す",
        description: "コメント返信スレッドを非表示にします。",
      },
      {
        id: "hideCommentUpvotes",
        label: "コメントの高評価数を隠す",
        description: "コメントアクション内の高評価数を非表示にします。",
      },
    ],
  },
  {
    id: "search",
    label: "検索",
    options: [
      {
        id: "hideSearchSuggestions",
        label: "検索候補を隠す",
        description: "検索ボックスのサジェストドロップダウンを隠します。",
      },
      {
        id: "hideSearchShorts",
        label: "検索結果のShortsを隠す",
        description: "検索結果内のShortsカードやShorts棚を隠します。",
      },
      {
        id: "hideSearchPromoted",
        label: "検索結果の広告を隠す",
        description: "検索結果に混ざるプロモーション動画を隠します。",
      },
      {
        id: "hideSearchDescriptions",
        label: "検索結果の説明文を隠す",
        description: "検索結果カード内の説明文やメタデータ補足を隠します。",
      },
      {
        id: "hideSearchExtraResults",
        label: "検索結果の追加棚を隠す",
        description: "検索結果内の関連棚や追加セクションを隠します。",
      },
      {
        id: "hideThumbnailHoverOverlay",
        label: "サムネイルのホバー演出を隠す",
        description:
          "検索結果などのサムネイルスライドショー演出を非表示にします。",
      },
      {
        id: "hideSearchInfiniteScroll",
        label: "検索結果の無限スクロールを止める",
        description: "検索結果末尾の継続読み込み要素を非表示にします。",
      },
    ],
  },
  {
    id: "navigation",
    label: "左ナビ",
    options: [
      {
        id: "hideLeftNavigation",
        label: "左ナビ全体を隠す",
        description: "左ドロワーとミニガイドを非表示にします。",
      },
      {
        id: "onlyShowPlaylists",
        label: "プレイリストだけ表示",
        description:
          "左ナビでプレイリスト以外の主要リンクやセクションを抑制します。",
      },
      {
        id: "disableLogoLink",
        label: "YouTubeロゴリンクを無効化",
        description: "YouTubeロゴからホームへ戻るクリックを無効化します。",
      },
      {
        id: "hideHomeLink",
        label: "ホームリンクを隠す",
        description: "左ナビのホームリンクを非表示にします。",
      },
      {
        id: "hideExploreLink",
        label: "探索リンクを隠す",
        description: "探索、急上昇リンクを非表示にします。",
      },
      {
        id: "hideShortsLink",
        label: "Shortsリンクを隠す",
        description: "左ナビとモバイル下部ナビのShortsリンクを非表示にします。",
      },
      {
        id: "hideSubscriptionsLink",
        label: "登録チャンネルリンクを隠す",
        description: "登録チャンネルへの導線を非表示にします。",
      },
      {
        id: "hideSubscriptionsSection",
        label: "登録チャンネルセクションを隠す",
        description: "左ドロワーの登録チャンネルセクションを非表示にします。",
      },
      {
        id: "hideQuickLinksSection",
        label: "You/ライブラリ系セクションを隠す",
        description: "左ドロワーのYou、履歴などのセクションを非表示にします。",
      },
      {
        id: "hideExploreSection",
        label: "探索セクションを隠す",
        description: "左ドロワーの探索セクションを非表示にします。",
      },
      {
        id: "hideMoreFromYoutubeSection",
        label: "その他のYouTubeセクションを隠す",
        description:
          "左ドロワーのMore from YouTube相当のセクションを非表示にします。",
      },
      {
        id: "hideSettingsSection",
        label: "設定セクションを隠す",
        description: "左ドロワー下部の設定系セクションを非表示にします。",
      },
      {
        id: "hideFooterSection",
        label: "左ナビのフッターを隠す",
        description: "左ドロワー下部のフッターリンク群を非表示にします。",
      },
    ],
  },
  {
    id: "channel",
    label: "チャンネル",
    options: [
      {
        id: "hideChannelAutoplay",
        label: "チャンネル動画の自動再生を止める",
        description: "チャンネルページ上部の紹介動画があれば一時停止します。",
      },
      {
        id: "hideChannelForYou",
        label: "For Youセクションを隠す",
        description: "チャンネルページのFor Youセクションを非表示にします。",
      },
      {
        id: "reverseChannelVideos",
        label: "チャンネル動画を逆順表示",
        description: "チャンネルページの動画グリッドを逆順に表示します。",
      },
    ],
  },
  {
    id: "subscriptions",
    label: "登録",
    options: [
      {
        id: "hideSubscriptionShorts",
        label: "登録ページのShortsを隠す",
        description: "登録チャンネルページ内のShorts動画を非表示にします。",
      },
      {
        id: "hideSubscriptionMostRelevant",
        label: "Most relevant棚を隠す",
        description:
          "登録チャンネルページのMost relevantセクションを非表示にします。",
      },
      {
        id: "hideSubscriptionLive",
        label: "ライブ動画を隠す",
        description: "登録チャンネルページのライブ動画を非表示にします。",
      },
      {
        id: "hideSubscriptionUpcoming",
        label: "配信予定動画を隠す",
        description: "登録チャンネルページのUpcoming動画を非表示にします。",
      },
      {
        id: "hideSubscriptionPremiere",
        label: "プレミア公開を隠す",
        description: "登録チャンネルページのPremiere動画を非表示にします。",
      },
      {
        id: "hideSubscriptionVods",
        label: "配信アーカイブを隠す",
        description:
          "登録チャンネルページのStreamed表記の動画を非表示にします。",
      },
    ],
  },
  {
    id: "redirects",
    label: "リダイレクト",
    options: [
      {
        id: "redirectHomeToSubscriptions",
        label: "ホームを登録チャンネルへ",
        description: "ホームアクセス時に登録チャンネルへ移動します。",
      },
      {
        id: "redirectHomeToWatchLater",
        label: "ホームを後で見るへ",
        description: "ホームアクセス時にWatch Laterへ移動します。",
      },
      {
        id: "redirectHomeToLibrary",
        label: "ホームをYouページへ",
        description:
          "ホームアクセス時にYou/ライブラリ相当のページへ移動します。",
      },
    ],
  },
  {
    id: "other",
    label: "その他",
    options: [
      {
        id: "hideNotificationBell",
        label: "通知ベルを隠す",
        description: "ヘッダー右側の通知ベルを非表示にします。",
      },
      {
        id: "hidePlaylistSuggestions",
        label: "プレイリスト候補を隠す",
        description: "プレイリストページなどのおすすめセクションを隠します。",
      },
      {
        id: "autofocusSearch",
        label: "検索欄に自動フォーカス",
        description: "視聴ページ以外で検索欄が空なら自動的にフォーカスします。",
      },
      {
        id: "hideContextBoxes",
        label: "コンテキストボックスを隠す",
        description:
          "情報パネルや補足カードなどの文脈ボックスを非表示にします。",
      },
      {
        id: "hideCreateButton",
        label: "作成ボタンを隠す",
        description: "YouTube上部バーの作成ボタンを非表示にします。",
      },
      {
        id: "lockSettingsWithTimer",
        label: "設定を10秒タイマーでロック",
        description: "Tampermonkeyメニューから設定を開く前に10秒待機します。",
      },
      {
        id: "lockSettingsWithCode",
        label: "設定をコードでロック",
        description: "設定を開く前に確認コードの入力を求めます。",
      },
      {
        id: "grayscaleMode",
        label: "グレースケール表示",
        description: "YouTube全体を白黒表示にします。",
      },
    ],
  },
];
