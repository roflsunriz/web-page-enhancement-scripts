//////////////////////////////////////////////////////////////////////////////////////
//
//                   ,,:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,,
//             ;;::;;;,,...``` ::::::::::::::::::::::::::::::::::::::::::;;
//          :::;               ::::::::::::::::::::::::::::::::::::::::::::::;
//        :::`         ::::    ::::::::::::::::::::::::::::::::::::::::::::::::;
//       ;:,           ::::    ::::::::::::::::::::::::::::::::::::::::::::::::::
//      ::             ::::    :::::::::::::::::::::::::::::::::::::::::::::::::::
//     ;:        .:::. ::::    :::::::::::::::::::::::;,      ;:::::::::::::::::::;
//     ::     :::::::::::::    ::::::::::::::::::::;             ,;::::::::::::::::
//    ,:;   `:::::   ::::::    ::::::::::::::::;,                    ;:::::::::::::;
//    ;:,   ::::       ::::    :::::::::::::;       ;::::;`     ;:::;   ,;:::::::::;
//    ;:.   ::::       ::::    :::::::::;,      .;::;,.:;:::;,,;::;;,       ;::::::;
//    ;:`   :::::     :::::    ::::::;       ,;:::::     :::::::,              ,;::;
//    ;:     ,::::::::::::.    :::::        ;:::::::;::::::::::::::;              :;
//    ;:        :::::::        :::::;,         ;:::,   ,;::;     ::::;         .;::;
//    ;:                       ::   .;::;         ;::::  ;::;:,;:::;        ;::;, :;
//    ;:                       ::       ;::;,        ,;::::::::;,       .;::;     :;
//    ;:                       ::          .;::;        ,;;;;,       ;::;,        :;
//    ;:                       ::              ;::;,             .;::;`           :;
//    ;:                       ::      ;          ,;::;       ;:::;               :;
//    ;:                       ::      ::             ;:::::::;,             ,    :;
//    ;:                       ::      :::;             .:::;             ;::.    :;
//    ;:                       ::      :::::;            :::          ,  ;:::.    :;
//    ;:                       ::      :::::::           ,:;       :::;  ;:::.    :;
//    ;:                       ::      ::::::::;         ,:;      `:::;  ;:::.    :;
//    ;:                       ::      ::::::::::;       ,:;      `:::;  ;:::.    :;
//    ;:                       ::      ::::::::::::`     ,:;      `:::;  ;:::.    :;
//    ;:                       ::      `                 ,:;      `:::;  ;;:      :'
//    ':`                      :::                       ,:;      `:::;           :'
//    ':`                      :::::;                    ,:;      `:;           ,;:'
//    ':,                      ::::::::;.                ,:;                 ;:::::'
//    ;:;                      :::::::::::::             ,:;             .;::::::::'
//     :;                      :::::::::::::::;          ,:;          :;:::::::::::`
//     ::                      ::::::::::::::::::;,      ,:;       ;:::::::::::::::
//      :;                     ::::::::::::::::::::::;   ,::   ,;::::::::::::::::::
//      ;:;                    ::::::::::::::::::::::::::::::::::::::::::::::::::'
//        ::.                  :::::::::::::::::::::::::::::::::::::::::::::::::`
//         :::,                :::::::::::::::::::::::::::::::::::::::::::::::;
//            ;::;,            ::::::::::::::::::::::::::::::::::::::::::::;.
//               .;;::::::::::::::::::::::::::::::::::::::::::::::::::;',
//
//                    c NTT docomo Anime Store inc, All Right Reserved.
//
//////////////////////////////////////////////////////////////////////////////////////
const VERSION = "2025_2Q-PC-2603_1",
  DEFAULT_BANDWIDTH = 5e6,
  MAX_BUFFER_TIME = 180,
  CONTINUOUS_PLAY_TIME = 10800,
  CONTINUOUS_PLAY_COUNT = 3,
  INITIAL_PLAY = 0,
  REPEAT_PLAY = 1,
  NEXT_PLAY = 2,
  REPLAY = 3,
  PREV_PLAY = 4,
  PLAYSTATUS_BEFORE_PLAY = 0,
  PLAYSTATUS_SEND_PLAY_START = 1,
  PLAYSTATUS_PLAYING = 2,
  PLAYSTATUS_PLAY_END = 3,
  PLAYSTATUS_PLAY_FINISH = 4,
  PLAYSTATUS_PLAY_ERROR = 5,
  PLAYSTATUS_PLAY_ERROR_AFTER_PLAY = 6,
  PREV_BTN_JUDGE_TIME_SEC = 3;
var prevBtnStay = !1,
  nextBtnStay = !1;
const POPUP_PREV_MODE = 0,
  POPUP_GO_HEAD_MODE = 1,
  COOKIE_VOLUME = "volume_setting",
  COOKIE_MUTE = "mute_setting",
  COOKIE_CONTINUOUS_PLAY = "continuous_play",
  COOKIE_OP_SKIP = "op_skip",
  COOKIE_REPEAT_PLAY = "repeat_play",
  COOKIE_MYLIST_SET = "mylist_set",
  COOKIE_PLAYSPEED = "play_speed",
  COOKIE_VIDEO_BITRATE = "video_bitrate",
  COOKIE_AUDIO_BITRATE = "audio_bitrate",
  COOKIE_DISPLAY_WIDTH = "PC030011_window_width",
  COOKIE_DISPLAY_HEIGHT = "PC030011_window_height",
  COOKIE_FAV_TOAST_SHOW = "##fav_toast_show",
  COOKIE_TIME_FORMAT = "time_format";
var PLAYER_COOKIE_LIST = [
  COOKIE_VOLUME,
  COOKIE_MUTE,
  "continuous_play",
  "op_skip",
  "repeat_play",
  "play_speed",
  "video_bitrate",
  "audio_bitrate",
  COOKIE_DISPLAY_WIDTH,
  COOKIE_DISPLAY_HEIGHT,
  "##fav_toast_show",
  "time_format",
  "mylist_set",
];
const VIDEO_BITRATE_NORMAL = 0,
  VIDEO_BITRATE_GOOD = 1,
  VIDEO_BITRATE_HIGH = 2,
  VIDEO_BITRATE_HD = 3,
  VIDEO_BITRATE_FULLHD = 4,
  VIDEO_BITRATE_NORMAL_MIN = 5e5,
  VIDEO_BITRATE_GOOD_MIN = 85e4,
  VIDEO_BITRATE_HIGH_MIN = 15e5,
  VIDEO_BITRATE_HD_MIN = 25e5,
  VIDEO_BITRATE_FULLHD_MIN = 35e5,
  AUDIO_BITRATE_128 = 0,
  AUDIO_BITRATE_192 = 1,
  AUDIO_BITRATE_128_MIN = 128e3,
  AUDIO_BITRATE_192_MIN = 192e3,
  SET_OFF = 0,
  SET_ON = 1,
  DEF_VOLUME = 0.5,
  DEF_MUTE = 0,
  DEF_CONTINUE = 1,
  DEF_OPSKIP = 0,
  DEF_REPEAT = 0,
  DEF_MYLIST = 1,
  DEF_PLAYBACK_SPEED = 1,
  DEF_AUDIO_BITRATE = 0,
  TIME_FORMAT_REMAIN = 0,
  TIME_FORMAT_PLAY = 1,
  DEF_TIME_FORMAT = 0,
  RESUME_KIND_START = 0,
  RESUME_KIND_ALIVE = 1,
  RESUME_KIND_POINT = 2,
  RESUME_STATE_STOP = 0,
  RESUME_STATE_PLAYING = 1,
  RESUME_STATE_PAUSE = 2,
  RESUME_STATE_START = 3,
  RESUME_TYPE = "MEDIAPLAYER_RESUMEINFO",
  RESUME_VERSION = "1.0.0",
  PLAY_CONTENT_TYPE = 0,
  RESUME_MAX_NUMBER = 99999999,
  FROM_ENDED_EVENT = 0,
  FROM_OPSKIP_EVENT = 1,
  APP_PLAYREADY = "08",
  APP_WIDEVINE = "09",
  NO_IMAGE_URL = "/img/img_scene_nodata.jpg",
  KEY_STATUS_NONE = 0,
  KEY_STATUS_DOWN = 1,
  KEY_STATUS_PAUSED = 2,
  USER_MOUSE = 0,
  USER_TOUCH = 1,
  NO_ERROR = 0,
  ERROR = 1,
  WS010105_OK = "00",
  WS010105_ERROR_CODE = "1",
  WS010105_ERROR_AGE_CONFIRM_NINSYOU = "34",
  WS010105_ERROR_AGE_CONFIRM_KAKUNIN = "35",
  WS010105_ERROR_AGE_CONFIRM_NG = "36",
  WS010105_ERROR_AGE_CONFIRM_FUDOUI = "37",
  WS010105_ERROR_AGE_CONFIRM_KYOHI = "38",
  WS010105_ERROR_AGE_CONFIRM_ERROR = "39",
  INIPLAYER_ERROR_CODE = "2",
  TOKEN_ERROR_CODE = "3",
  HTML5PLAYER_ERROR_CODE = "4",
  WS100302_ERROR_CODE = "5",
  WS100101_ERROR_CODE = "7",
  WS100104_ERROR_CODE = "8",
  WS100305_ERROR_CODE = "9",
  WS100306_ERROR_CODE = "11",
  WS100303_ERROR_CODE = "12",
  WS100135_ERROR_CODE = "13",
  WS100334_ERROR_CODE = "14",
  HTML5PLAYER_ERROR_NETWORK = "0001",
  HTML5PLAYER_ERROR_NETWORK_WS010105 = "0010",
  HTML5PLAYER_ERROR_NETWORK_WS100302 = "0011",
  HTML5PLAYER_ERROR_NETWORK_API = "0012",
  HTML5PLAYER_ERROR_NETWORK_MANIFEST = "0013",
  HTML5PLAYER_ERROR_RECOMMEND = "0014",
  HTML5PLAYER_ERROR_NETWORK_RECOMMEND = "0015",
  HTML5PLAYER_ERROR_WS100101 = "0016",
  HTML5PLAYER_ERROR_NETWORK_WS100101 = "0017",
  HTML5PLAYER_ERROR_WS100104 = "0018",
  HTML5PLAYER_ERROR_NETWORK_WS100104 = "0019",
  HTML5PLAYER_ERROR_WS100305 = "0020",
  HTML5PLAYER_ERROR_NETWORK_WS100305 = "0021",
  HTML5PLAYER_ERROR_WS100306 = "0022",
  HTML5PLAYER_ERROR_NETWORK_WS100306 = "0023",
  HTML5PLAYER_ERROR_WS100303 = "0024",
  HTML5PLAYER_ERROR_NETWORK_WS100303 = "0025",
  HTML5PLAYER_ERROR_CREATE_PLAYER = "0002",
  HTML5PLAYER_ERROR_VIDEO = "0003",
  HTML5PLAYER_ERROR_AUDIO = "0004",
  HTML5PLAYER_ERROR_WS010105 = "0005",
  HTML5PLAYER_ERROR_WS100302 = "0006",
  HTML5PLAYER_ERROR_APISERVER = "0007",
  HTML5PLAYER_ERROR_WS100135 = "0026",
  HTML5PLAYER_ERROR_NETWORK_WS100135 = "0027",
  HTML5PLAYER_ERROR_WS100334 = "0028",
  HTML5PLAYER_ERROR_NETWORK_WS100334 = "0029",
  HTML5PLAYER_ERROR_NETWORK_GET_TERMS = "30",
  HTML5PLAYER_ERROR_KEYID = "0008",
  HTML5PLAYER_ERROR_OTHER = "9999",
  HTML5PLAYER_STOP_CONTINUOUS_PLAY = "8000",
  ERROR_MSG_WS010105_22 = "この話は現在公開されておりません",
  ERROR_MSG_WS010105_23 = "このコンテンツは現在視聴できません",
  ERROR_MSG_WS010105_26 =
    "同一dアカウントによる複数端末での動画視聴はできません",
  ERROR_MSG_WS010105_28 =
    "この作品はレンタル作品です。ご利用の端末からのレンタルはできません",
  ERROR_MSG_WS010105_29 = "視聴数が上限に達しているため、視聴できません",
  ERROR_MSG_WS010105_30 = "このコンテンツは当選者のみ視聴可能です",
  ERROR_MSG_WS010105_31 =
    "このコンテンツはキャンペーンコード入力後にご視聴頂けます",
  ERROR_MSG_WS010105_33 = "習熟IDのため視聴できません",
  ERROR_MSG_WS010105_81 =
    "海外からのアクセスです<br>日本国内でのみ利用可能なサービスとなります",
  ERROR_MSG_WS010105_86 =
    "会員専用のコンテンツとなります<br>ログイン後お楽しみください",
  ERROR_MSG_WS010105_PLAYLIST = "年齢制限のある作品のため視聴できません",
  ERROR_MSG_WS010105_36 = "お客様の年齢では本作品は視聴できません。",
  ERROR_MSG_WS010105_37 =
    "利用者情報の提供が拒否されているため、年齢制限のある作品は視聴できません。<br>設定方法は",
  ERROR_MSG_WS010105_38 =
    "契約者による利用者情報拒否設定がされているため、年齢制限のある作品は視聴できません。<br>詳しくは",
  ERROR_MSG_WS010105_39 =
    "お客様の年齢が確認できませんでした。<br>しばらく待ってから再度お試しください。",
  AGE_CONFIRM_URL = "/rest/WS010302",
  ERROR_MSG_NETWORK =
    "正常に動画ファイルを取得できませんでした。時間を置いてから再度ご視聴いただくか、以下をご確認ください。<br>・通信環境/通信速度を確認する。",
  ERROR_MSG_RENTAL =
    "この作品はレンタル作品です。レンタル後にお楽しみいただけます",
  ERROR_MSG_CANNNOT_PLAY = "この作品はご利用の端末で現在視聴いただけません",
  ERROR_MSG_UNKOWN = "動画再生に失敗しました",
  ERROR_MSG_GET_FILE =
    "正常に動画ファイルを取得できませんでした。時間を置いてから再度ご視聴いただくか、以下をご確認ください。<br>・「画質」を落として再生する。<br>・通信環境/通信速度を確認する。<br>・ブラウザのキャッシュON設定になっているか。<br>・リモートデスクトップ経由で再生していないか。",
  ERROR_MSG_HDCP =
    "外部出力（プロジェクター、TVやBluetoothなど）を行う機器を取り外した後、再度お試しください。<br>※著作権で保護されたコンテンツの外部出力再生は禁止されております。",
  ERROR_WS100302_22 = "上限数に達しましたので、登録できません",
  ERROR_WS100302_23 = "この作品は現在公開されておりません",
  ERROR_WS100302_86 = "会員専用の機能となります<br>ログイン後にご利用ください",
  ERROR_WS100302_87 = "会員専用の機能となります<br>ログイン後にご利用ください",
  ERROR_WS100302_OV = "マイページへの登録に失敗しました",
  SUCCESS_WS100302 = "「気になる」登録をした作品はマイページで確認できます。";
var WE010105_ERROR_MSG_MAP = {
    22: "この話は現在公開されておりません",
    23: "このコンテンツは現在視聴できません",
    24: ERROR_MSG_CANNNOT_PLAY,
    26: ERROR_MSG_WS010105_26,
    27: ERROR_MSG_RENTAL,
    28: ERROR_MSG_WS010105_28,
    29: ERROR_MSG_WS010105_29,
    30: "このコンテンツは当選者のみ視聴可能です",
    31: ERROR_MSG_WS010105_31,
    33: "習熟IDのため視聴できません",
    36: ERROR_MSG_WS010105_36,
    37: ERROR_MSG_WS010105_37,
    38: ERROR_MSG_WS010105_38,
    39: ERROR_MSG_WS010105_39,
    81: ERROR_MSG_WS010105_81,
    86: ERROR_MSG_WS010105_86,
    87: ERROR_MSG_WS010105_86,
  },
  WS100302_ERROR_MSG_MAP = {
    22: ERROR_WS100302_22,
    23: ERROR_WS100302_23,
    86: ERROR_WS100302_86,
    87: ERROR_WS100302_87,
  },
  INIPLAYER_ERROR_MSG_MAP = {
    1001: ERROR_MSG_GET_FILE,
    2001: ERROR_MSG_GET_FILE,
    1002: ERROR_MSG_CANNNOT_PLAY,
    3001: ERROR_MSG_CANNNOT_PLAY,
    3003: ERROR_MSG_CANNNOT_PLAY,
    3004: ERROR_MSG_CANNNOT_PLAY,
    4001: ERROR_MSG_CANNNOT_PLAY,
    4002: ERROR_MSG_CANNNOT_PLAY,
    3002: ERROR_MSG_NETWORK,
    3005: ERROR_MSG_HDCP,
    9002: ERROR_MSG_CANNNOT_PLAY,
  },
  APISERVER_ERROR_MAP = [
    [1002, "31002", ERROR_MSG_NETWORK],
    [1001, "31001", "動画再生に失敗しました"],
    [1010, "31010", "動画再生に失敗しました"],
    [100, "32100", "動画再生に失敗しました"],
    [110, "32110", "動画再生に失敗しました"],
    [200, "32200", "動画再生に失敗しました"],
    [300, "32300", "動画再生に失敗しました"],
    [400, "32400", "動画再生に失敗しました"],
    [800, "32800", ERROR_MSG_CANNNOT_PLAY],
    [999, "32999", "動画再生に失敗しました"],
    [1, "33001", ERROR_MSG_RENTAL],
    [2, "33002", ERROR_MSG_NETWORK],
    [3, "33003", ERROR_MSG_CANNNOT_PLAY],
  ];
const MYLIST_UNREGISTERED = "0",
  MYLIST_REGISTERED = "1",
  MYLIST_INCOMPATIBLE = "2",
  ERROR_MYLIST_OV = "エラーが発生しました。",
  ERROR_DEL_MYLIST = "マイリストからの削除に失敗しました";
var WS100303_ERROR_MSG_MAP = { 23: ERROR_WS100302_23 };
const ERROR_WS100305_22 = "上限数に達しましたので、作成できません",
  ERROR_WS100305_27 = "現在マイリストの公開に制限が掛かっています";
var WS100305_ERROR_MSG_MAP = { 22: ERROR_WS100305_22, 27: ERROR_WS100305_27 };
const ERROR_WS100306_22 = "エラーが発生しました",
  ERROR_WS100306_23 = "マイリストの上限数に達しましたので、設定できません",
  ERROR_WS100306_24 = "この作品は現在公開されておりません";
var WS100306_ERROR_MSG_MAP = {
  22: "エラーが発生しました",
  23: ERROR_WS100306_23,
  24: ERROR_WS100306_24,
};
const NICKENAME_CONFIRM_URL = "/rest/WS100334",
  ERROR_WS100334_22 = "投稿規約に反した文字がふくまれています";
var WS100334_ERROR_MSG_MAP = { 22: ERROR_WS100334_22 };
const MODAL_ERROR = "ERROR",
  MODAL_DIALOG = "DIALOG",
  MODAL_TOAST = "TOAST",
  ERROR_TIMEOUT = "TIMEOUT",
  ERROR_ERROR = "ERROR",
  API_RETRY_INTERVAL = 500,
  API_RETRY_MAX_COUNT = 3,
  TIMEOUT_MANIFEST = 5e3,
  SKIP_UI_NON_DISPLAYED = 0,
  SKIP_UI_DISPLAYING = 1,
  SKIP_UI_NOT_DISPLAYED = 2,
  SKIP_UI_WAITING = 3,
  SKIP_UI_HISTORY_NON_DISPLAYED = 0,
  SKIP_UI_HISTORY_DISPLAYED = 1,
  SKIP_UI_TITLE_SKIP_TO_MAIN = "本編へスキップ",
  SKIP_UI_TITLE_PLAY_END = "再生を終了",
  SKIP_UI_TITLE_NEXT_EPISODE = "次のエピソードへ",
  SKIP_UI_TITLE_PLAY_AGAIN = "もう一度再生",
  SKIP_UI_DISPLAYING_OK = 0,
  SKIP_UI_DISPLAYING_NG = -1,
  SKIP_UI_DISPLAYING_NOW = 1,
  SKIP_UI_DISPLAYING_ALREADY = 3,
  SKIP_UI_SHOW = 0,
  SKIP_UI_HIDE = 1,
  CONTROLLER_UI_SHOW = 0,
  CONTROLLER_UI_HIDE = 1,
  SKIP_UI_PROCESSING_COMPLETE = 0,
  SKIP_UI_PROCESSING_FAILURE = -1,
  LOADING_UI_HIDE = 0,
  LOADING_UI_SHOW = 1,
  SKIP_UI_LOADING_NOW = 9;
!(function (window, document) {
  "use strict";
  var restApiUrl = "",
    otherWorkSearchUrl = "",
    registFavoriteUrl = "",
    playStatus = 0,
    touchEvFlg = 0,
    recommendContentInfoUrl = "",
    favoriteStatusUrl = "",
    sharelistUrl = "",
    registSharelistUrl = "",
    registMylistUrl = "",
    deleteMylistUrl = "",
    getFeatureListUrl = "",
    postingTermsUrl = "",
    playCount = 0,
    chapter_skip = null,
    skip_ui_history = null,
    skipWaitTime = null,
    minTimeToSkip = null,
    seekopetation = !1,
    seekopetationCounter = 0,
    d = "";
  ((d += "<div id='dialog' title='dアニメストア'></div>"),
    (d += "<div class='backArea'></div>"),
    (d += "<div class='seekArea'>"),
    (d += "<div id='seekBackBar' class='seekBackBar bar'></div>"),
    (d += "<div id='bufferBar' class='bufferBar bar'></div>"),
    (d += "<div id='seekBar' class='seekBar bar'></div>"),
    (d +=
      "<div id='seekThumb' class='seekThumb'><div id='seekThumbTarget' class='thumbTarget'></div></div>"),
    (d += "<div id='seekPopup' class='popup'>"),
    (d += "<div class='popupIn'>"),
    (d += "<div id='seekPopupInWrap' class='popupImageWrap'>"),
    (d +=
      "<img id='seekThumbnail' class='seekThumbnail' src='/img/img_scene_nodata.jpg'>"),
    (d += "<div id='currentTime'>00:00</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='buttonArea'>"),
    (d += "<div class='play mainButton'>"),
    (d += "<button class='playButton'></button>"),
    (d += "</div>"),
    (d += "<div class='prev mainButton'>"),
    (d += "<button class='prevButton'></button>"),
    (d += "<div id='prevPopup' class='popup'>"),
    (d += "<div id='prevPopupIn' class='popupIn'>"),
    (d += "<div id='prevThumbinner'>"),
    (d += "<a id='prevThumbButton' class='prevThumbButton'></a>"),
    (d += "<img id='prevThumbnail' src=''>"),
    (d += "</div>"),
    (d += "<div id='prevText' class='prevText'>前の話：</div>"),
    (d += "<div id='prevTitle'></div>"),
    (d += "</div>"),
    (d += "<div id='prevPopupInReTop' class='popupIn hide'>"),
    (d += "<div id='prevTextReTop' class='prevText'>先頭に戻る</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='back mainButton'>"),
    (d += "<button class='backButton'></button>"),
    (d += "<div id='backPopup' class='popup'>"),
    (d += "<div id='backPopupIn' class='popupIn'>"),
    (d += "<div class='popupButtonWrap'>"),
    (d += "<button class='back10Button'></button>"),
    (d += "<button class='back30Button'></button>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='skip mainButton'>"),
    (d += "<button class='skipButton'></button>"),
    (d += "<div id='skipPopup' class='popup'>"),
    (d += "<div id='skipPopupIn' class='popupIn'>"),
    (d += "<div class='popupButtonWrap'>"),
    (d += "<button class='skip10Button'></button>"),
    (d += "<button class='skip30Button'></button>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='next mainButton'>"),
    (d += "<button class='nextButton'></button>"),
    (d += "<div id='nextPopup' class='popup'>"),
    (d += "<div id='nextPopupIn' class='popupIn'>"),
    (d += "<div id='nextThumbinner'>"),
    (d += "<a id='nextThumbButton' class='nextThumbButton'></a>"),
    (d += "<img id='nextThumbnail' src=''>"),
    (d += "</div>"),
    (d += "<div class='nextText'>次の話:</div>"),
    (d += "<div id='nextTitle'></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='volume mainButton'>"),
    (d += "<button class='volumeButton'></button>"),
    (d += "<div id='volumePopup' class='popup'>"),
    (d += "<div id='volumePopupIn' class='popupIn'>"),
    (d += "<div class='popupButtonWrap'>"),
    (d += "<div id='volumeBackBar' class='volumeBackBar'></div>"),
    (d += "<div id='volumeBar' class='volumeBar'></div>"),
    (d +=
      "<div id='volumeThumb' class='volumeThumb'><div id='volumeThumbTarget' class='volumeThumbTarget'></div></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='space'></div>"),
    (d += "<div class='time'><span id='time'></span></div>"),
    (d += "<div class='setting mainButton'>"),
    (d += "<button class='settingButton'></button>"),
    (d += "<div id='settingPopup' class='popup'>"),
    (d += "<div id='settingPopupIn' class='popupIn'>"),
    (d += "<div id='settingContinues' class='list'>"),
    (d += "<div class='w4 caption'>連続再生</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='continues' class='toggleButton'>"),
    (d += "<div class='toggleButtonWrap'>"),
    (d += "<div class='on default'><span>ON</span></div>"),
    (d += "<div class='off'><span>OFF</span></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='settingOpSkip' class='list'>"),
    (d += "<div class='w6 caption'>OP/EDスキップ</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='opskip' class='toggleButton'>"),
    (d += "<div class='toggleButtonWrap'>"),
    (d += "<div class='on default'><span>ON</span></div>"),
    (d += "<div class='off'><span>OFF</span></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='settingRepeat' class='list'>"),
    (d += "<div class='w6 caption'>繰り返し再生</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='repeat' class='toggleButton'>"),
    (d += "<div class='toggleButtonWrap'>"),
    (d += "<div class='on'><span>ON</span></div>"),
    (d += "<div class='off default'><span>OFF</span></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='settingSpeed' class='list'>"),
    (d += "<div class='w4 caption'>再生速度</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='speed' class='selectButton'>"),
    (d += "<span class='w1' data-value='0.5'>0.5</span>"),
    (d += "<span class='w2.5' data-value='0.75'>0.75</span>"),
    (d += "<span class='w2 default' data-value='1'>通常</span>"),
    (d += "<span class='w2.5' data-value='1.25'>1.25</span>"),
    (d += "<span class='w1' data-value='1.5'>1.5</span>"),
    (d += "<span class='w1' data-value='2'>2.0</span>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='settingImageQuality' class='list'>"),
    (d += "<div class='w2 caption'>画質</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='imageQuality' class='selectButton'>"),
    (d += "<span class='normal w2' data-value='0'>最低</span>"),
    (d += "<span class='good w1' data-value='1'>低</span>"),
    (d += "<span class='high w1' data-value='2'>中</span>"),
    (d += "<span class='hd w4' data-value='3'>720p</span>"),
    (d += "<span class='fullhd w4' data-value='4'>1080p</span>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='settingSoundQuality' class='list'>"),
    (d += "<div class='w2 caption'>音質</div>"),
    (d += "<div class='preference'>"),
    (d += "<div id='soundQuality' class='selectButton'>"),
    (d += "<span class='audio128 w5' data-value='0'>128Kbps</span>"),
    (d += "<span class='audio192 w5 default' data-value='1'>192Kbps</span>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='fullscreen mainButton'>"),
    (d += "<button class='fullscreenButton'></button>"),
    (d += "</div>"));
  var VIDEO_CONTROLLER_DOM = (d += "</div>");
  ((d = "<div id='dialog' title='dアニメストア'></div>"),
    (d += "<div class='loadingArea'>"),
    (d += "<div class='loadingSpin'><span></span></div>"),
    (d += "</div>"),
    (d += "<div class='initingArea'>"),
    (d += "<div id='backThumb'></div>"),
    (d += "<div id='backInfo'>"),
    (d += "<div class='backInfoIn'>"),
    (d += "<div class='backInfoTxt1'></div>"),
    (d += "<div class='backInfoTxt2'></div>"),
    (d += "<div class='backInfoTxt3'></div>"),
    (d += "<div class='backInfoTxt4'></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='loadingSpin'><span></span></div>"),
    (d += "</div>"),
    (d += "<div class='pauseArea'>"),
    (d += "<div id='pauseInfo' class='fadeAnimDone'>"),
    (d += "<span class='pause'></span><span class='play'></span>"),
    (d += "<div class='pauseInfoWrap'>"),
    (d += "<div class='pauseInfoIn'>"),
    (d += "<div class='pauseInfoTxt1'></div>"),
    (d += "<div class='pauseInfoTxt2'></div>"),
    (d += "<div class='pauseInfoTxt3'></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='informationArea' class='informationArea'>"),
    (d += "<div class='informationInfo'>"),
    (d += "<div id='informationInfoWrap' class='informationInfoWrap'>"),
    (d += "<div id='workTitle' class='workTitle hide'>"),
    (d += "<div id='nextClose' class='nextClose'>"),
    (d += "<a id='facebook' target='_blank' class='facebook'></a>"),
    (d +=
      "<a id='google' class='google' onclick=\"window.open(this.href, '_blank'); return false;\"></a>"),
    (d += "<a id='hatebu' target='_blank' class='hatebu'></a>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div id='addToMylist' class='hide'>"),
    (d +=
      "<span id='addMylist'><span class='addMyListStr' id='addMyListStr'>マイリストに追加</span><a class='add' id='addMyListImg'></a></span>"),
    (d += "</div>"),
    (d += "<div id='partDispNumber' class='partDispNumber'></div>"),
    (d += "<div id='partTitle' class='partTitle'></div>"),
    (d += "<div id='partExp' class='partExp'></div>"),
    (d += "<div id='promotionInfo' class='promotionInfo hide'></div>"),
    (d += "<div class='wrappArea'>"),
    (d += "<div class='l-section isAfterWatch hide'>"),
    (d += "<div class='p-title isBookPromotion'>"),
    (d += "<i class='p-title__icon isAnimeWhite'></i>"),
    (d += "<h1 class='p-title__text isWhite'>続きはこちら</h1>"),
    (d += "</div>"),
    (d += "<div class='p-infoContainer'>"),
    (d += "<div class='p-infoContainer__thumbnail'>"),
    (d += "<img></img>"),
    (d += "</div>"),
    (d += "<div class='c-infoDetails isAfterWatch'>"),
    (d += "<span class='c-infoDetails__subTitle'></span>"),
    (d += "<h1 class='c-infoDetails__title'></h1>"),
    (d += "<p class='c-infoDetails__text'></p>"),
    (d += "<div class='c-button isWatchNext' id='nextStart'>"),
    (d += "<a>続きを視聴</a>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='recomPos section-wrapper hide'>"),
    (d += "<div class='recommend-section'>"),
    (d += "<div class='p-title'>"),
    (d += "<i class='p-title__icon isRecommendWhite'></i>"),
    (d += "<h1 class='p-title__text isWhite'></h1>"),
    (d += "</div>"),
    (d += "<div class='swiper-area'>"),
    (d += "<div class='swiper-container recommendBodySw recom-slider'>"),
    (d += "<div class='swiper-wrapper' id='animeList'></div>"),
    (d +=
      "<div class='p-slider__navButton isPrev' id='recomPrevButton'><i></i></div>"),
    (d +=
      "<div class='p-slider__navButton isNext' id='recomNextButton'><i></i></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='comicPos section-wrapper hide'>"),
    (d += "<div class='comic-section'>"),
    (d += "<div class='p-title'>"),
    (d += "<i class='p-title__icon isBookWhite'></i>"),
    (d += "<h1 class='p-title__text isWhite'></h1>"),
    (d += "</div>"),
    (d += "<div class='swiper-area'>"),
    (d += "<div class='swiper-container comicBodySw comic-slider'>"),
    (d += "<div class='swiper-wrapper' id='comicList'></div>"),
    (d +=
      "<div class='p-slider__navButton isPrev' id='comicPrevButton'><i></i></div>"),
    (d +=
      "<div class='p-slider__navButton isNext' id='comicNextButton'><i></i></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='goodsPos section-wrapper hide'>"),
    (d += "<div class='goods-section'>"),
    (d += "<div class='p-title'>"),
    (d += "<i class='p-title__icon isBookWhite'></i>"),
    (d += "<h1 class='p-title__text isWhite'></h1>"),
    (d += "</div>"),
    (d += "<div class='swiper-area'>"),
    (d += "<div class='swiper-container goodsBodySw goods-slider'>"),
    (d += "<div class='swiper-wrapper js-itemList' id='goodsList'></div>"),
    (d +=
      "<div class='p-slider__navButton isPrev' id='goodsPrevButton'><i></i></div>"),
    (d +=
      "<div class='p-slider__navButton isNext' id='goodsNextButton'><i></i></div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<modal id='skuModal' class='hide' style='color: black'>"),
    (d += "<div class='modalOverlay'></div>"));
  var VIDEO_LOADING_DOM = (d += "</modal>");
  ((d = "<div class='buttonArea'>"),
    (d += "<div class='buttonWrapper'>"),
    (d += "<div class='countdown'>10</div>"),
    (d += "<div class='progressWrapper'>"),
    (d += "<div class='skipButtonTitle'>秒後にスキップ</div>"),
    (d += "<progress max='100' value='0'></progress>"),
    (d += "</div>"),
    (d += "<div class='skipButton'>"),
    (d += "</div>"),
    (d += "</div>"),
    (d += "<div class='cancelButton'>"),
    (d += "</div>"));
  var SKIP_UI_DOM = (d += "</div>"),
    util = {},
    CSS_PREFIXED = ["Webkit", "O", "Moz", "ms"],
    docStyle = window.getComputedStyle(document.head, "");
  ((util.setStyleName = function (styleName) {
    if (styleName in docStyle) return styleName;
    for (
      var upperName = styleName[0].toUpperCase() + styleName.slice(1),
        i = CSS_PREFIXED.length,
        name;
      i--;
    )
      if ((name = CSS_PREFIXED[i] + upperName) in docStyle) return name;
    return styleName;
  }),
    (util.addClass = function (el, className) {
      util.hasClass(el, className) ||
        (el.classList
          ? el.classList.add(className)
          : (el.className += " " + className));
    }),
    (util.removeClass = function (el, className) {
      util.hasClass(el, className) &&
        (el.classList
          ? el.classList.remove(className)
          : (el.className = el.className.replace(
              new RegExp(
                "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
                "gi",
              ),
              " ",
            )));
    }),
    (util.changeClass = function (el, className, on) {
      on ? util.addClass(el, className) : util.removeClass(el, className);
    }),
    (util.toggleClass = function (el, className) {
      if (el.classList) el.classList.toggle(className);
      else {
        var classes = el.className.split(" "),
          existingIndex = classes.indexOf(className);
        (existingIndex >= 0
          ? classes.splice(existingIndex, 1)
          : classes.push(className),
          (el.className = classes.join(" ")));
      }
    }),
    (util.replaceClass = function (el, targetClassRegex, className) {
      if (
        (targetClassRegex instanceof RegExp &&
          targetClassRegex.test(el.className)) ||
        -1 !== el.className.indexOf(targetClassRegex)
      ) {
        var text = new RegExp(targetClassRegex)
          .toString()
          .match(/^\/([\S\s]+)\//)[1]
          .replace(/\./, "\\S");
        targetClassRegex = new RegExp("(^|\\b)" + text + "(\\b|$)", "gi");
      }
      targetClassRegex instanceof RegExp && targetClassRegex.test(el.className)
        ? (el.className = el.className.replace(targetClassRegex, className))
        : util.addClass(el, className);
    }),
    (util.hasClass = function (el, className) {
      if (el)
        return el.classList
          ? el.classList.contains(className)
          : new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
    }),
    (util.append = function (parent, el) {
      parent.appendChild(el);
    }),
    (util.remove = function (el) {
      el.parentNode.removeChild(el);
    }),
    (util.wrap = function (el, wrapper) {
      var parent;
      (el.parentNode.insertBefore(wrapper, el), util.append(wrapper, el));
    }),
    (util.setStyle = function (el, name, value) {
      el.style[util.setStyleName(name)] = value;
    }),
    (util.formatTime = function (sec) {
      var h, m, s;
      return isNaN(sec)
        ? "--:--"
        : sec <= 0
          ? "00:00"
          : sec >= 3600
            ? ((h = Math.floor(sec / 3600)),
              (m = Math.floor((sec - 3600 * h) / 60)),
              (s = Math.floor((sec - 3600 * h) % 60)),
              ("00" + h).slice(-2) +
                ":" +
                ("00" + m).slice(-2) +
                ":" +
                ("00" + s).slice(-2))
            : ((m = Math.floor(sec / 60)),
              (s = Math.floor(sec % 60)),
              ("00" + m).slice(-2) + ":" + ("00" + s).slice(-2));
    }),
    (util.checkLength = function checkLength(size, targetStr) {
      return targetStr.length > size
        ? targetStr.substr(0, size - 2) + "…"
        : targetStr;
    }),
    (util.escapeString = function escapeString(targetStr) {
      const map = {
        '"': "&quot;",
        Α: "&Alpha;",
        α: "&alpha;",
        ϑ: "&thetasym;",
        "∀": "&forall;",
        "≠": "&ne;",
        " ": "&nbsp;",
        "¹": "&sup1;",
        Ò: "&Ograve;",
        ë: "&euml;",
        "&": "&amp;",
        Β: "&Beta;",
        β: "&beta;",
        ϒ: "&upsih;",
        "∂": "&part;",
        "≡": "&equiv;",
        "¡": "&iexcl;",
        º: "&ordm;",
        Ó: "&Oacute;",
        ì: "&igrave;",
        "<": "&lt;",
        Γ: "&Gamma;",
        γ: "&gamma;",
        ϖ: "&piv;",
        "∃": "&exist;",
        "≤": "&le;",
        "¢": "&cent;",
        "»": "&raquo;",
        Ô: "&Ocirc;",
        í: "&iacute;",
        ">": "&gt;",
        Δ: "&Delta;",
        δ: "&delta;",
        "•": "&bull;",
        "∅": "&empty;",
        "≥": "&ge;",
        "£": "&pound;",
        "¼": "&frac14;",
        Õ: "&Otilde;",
        î: "&icirc;",
        œ: "&oelig;",
        Ε: "&Epsilon;",
        ε: "&epsilon;",
        "…": "&hellip;",
        "∇": "&nabla;",
        "⊂": "&sub;",
        "¤": "&curren;",
        "½": "&frac12;",
        Ö: "&Ouml;",
        ï: "&iuml;",
        " ": "&ensp;",
        Ζ: "&Zeta;",
        ζ: "&zeta;",
        "′": "&prime;",
        "∈": "&isin;",
        "⊃": "&sup;",
        "¥": "&yen;",
        "¾": "&frac34;",
        "×": "&times;",
        ð: "&eth;",
        " ": "&emsp;",
        Η: "&Eta;",
        η: "&eta;",
        "″": "&Prime;",
        "∉": "&notin;",
        "⊄": "&nsub;",
        "¦": "&brvbar;",
        "¿": "&iquest;",
        Ø: "&Oslash;",
        ñ: "&ntilde;",
        " ": "&thinsp;",
        Θ: "&Theta;",
        θ: "&theta;",
        "‾": "&oline;",
        "∋": "&ni;",
        "⊆": "&sube;",
        "§": "&sect;",
        À: "&Agrave;",
        Ù: "&Ugrave;",
        ò: "&ograve;",
        Ι: "&Iota;",
        ι: "&iota;",
        "⁄": "&frasl;",
        "∏": "&prod;",
        "⊇": "&supe;",
        "¨": "&uml;",
        Á: "&Aacute;",
        Ú: "&Uacute;",
        ó: "&oacute;",
        Κ: "&Kappa;",
        κ: "&kappa;",
        "℘": "&weierp;",
        "∑": "&sum;",
        "⊕": "&oplus;",
        "©": "&copy;",
        Â: "&Acirc;",
        Û: "&Ucirc;",
        ô: "&ocirc;",
        Λ: "&Lambda;",
        λ: "&lambda;",
        ℑ: "&image;",
        "−": "&minus;",
        "⊗": "&otimes;",
        ª: "&ordf;",
        Ã: "&Atilde;",
        Ü: "&Uuml;",
        õ: "&otilde;",
        Μ: "&Mu;",
        μ: "&mu;",
        ℜ: "&real;",
        "∗": "&lowast;",
        "⊥": "&perp;",
        "«": "&laquo;",
        Ä: "&Auml;",
        Ý: "&Yacute;",
        ö: "&ouml;",
        "—": "&mdash;",
        Ν: "&Nu;",
        ν: "&nu;",
        "™": "&trade;",
        "√": "&radic;",
        "⋅": "&sdot;",
        "¬": "&not;",
        Å: "&Aring;",
        Þ: "&THORN;",
        "÷": "&divide;",
        "‘": "&lsquo;",
        Ξ: "&Xi;",
        ξ: "&xi;",
        ℵ: "&alefsym;",
        "∝": "&prop;",
        "⌈": "&lceil;",
        Æ: "&AElig;",
        ß: "&szlig;",
        ø: "&oslash;",
        "‡": "&Dagger;",
        Ο: "&Omicron;",
        ο: "&omicron;",
        "←": "&larr;",
        "∞": "&infin;",
        "⌉": "&rceil;",
        "®": "&reg;",
        Ç: "&Ccedil;",
        à: "&agrave;",
        ù: "&ugrave;",
        "‹": "&lsaquo;",
        Π: "&Pi;",
        π: "&pi;",
        "↑": "&uarr;",
        "∠": "&ang;",
        "⌊": "&lfloor;",
        "¯": "&macr;",
        È: "&Egrave;",
        á: "&aacute;",
        ú: "&uacute;",
        "›": "&rsaquo;",
        Ρ: "&Rho;",
        ρ: "&rho;",
        "→": "&rarr;",
        "∧": "&and;",
        "⌋": "&rfloor;",
        "°": "&deg;",
        É: "&Eacute;",
        â: "&acirc;",
        û: "&ucirc;",
        "€": "&euro;",
        Σ: "&Sigma;",
        σ: "&sigma;",
        "↓": "&darr;",
        "∨": "&or;",
        "〈": "&lang;",
        "±": "&plusmn;",
        Ê: "&Ecirc;",
        ã: "&atilde;",
        ü: "&uuml;",
        Τ: "&Tau;",
        τ: "&tau;",
        "↔": "&harr;",
        "∩": "&cap;",
        "〉": "&rang;",
        "²": "&sup2;",
        Ë: "&Euml;",
        ä: "&auml;",
        ý: "&yacute;",
        Υ: "&Upsilon;",
        υ: "&upsilon;",
        "↵": "&crarr;",
        "∪": "&cup;",
        "◊": "&loz;",
        "³": "&sup3;",
        Ì: "&Igrave;",
        å: "&aring;",
        þ: "&thorn;",
        Φ: "&Phi;",
        φ: "&phi;",
        "⇐": "&lArr;",
        "∫": "&int;",
        "♠": "&spades;",
        "´": "&acute;",
        Í: "&Iacute;",
        æ: "&aelig;",
        ÿ: "&yuml;",
        Χ: "&Chi;",
        χ: "&chi;",
        "⇑": "&uArr;",
        "∴": "&there4;",
        "♣": "&clubs;",
        µ: "&micro;",
        Î: "&Icirc;",
        ç: "&ccedil;",
        Ψ: "&Psi;",
        ψ: "&psi;",
        "⇒": "&rArr;",
        "∼": "&sim;",
        "♥": "&hearts;",
        "¶": "&para;",
        Ï: "&Iuml;",
        è: "&egrave;",
        Ω: "&Omega;",
        ω: "&omega;",
        "⇓": "&dArr;",
        "≅": "&cong;",
        "♦": "&diams;",
        "·": "&middot;",
        Ð: "&ETH;",
        é: "&eacute;",
        ς: "&sigmaf;",
        "⇔": "&hArr;",
        "≈": "&asymp;",
        "¸": "&cedil;",
        Ñ: "&Ntilde;",
        ê: "&ecirc;",
        "'": "&#39;",
        ƒ: "&fnof;",
        Œ: "&OElig;",
        Š: "&Scaron;",
        š: "&scaron;",
        "˜": "&tilde;",
        "–": "&ndash;",
        "’": "&rsquo;",
        "‚": "&sbquo;",
        "“": "&ldquo;",
        "”": "&rdquo;",
        "„": "&bdquo;",
        "†": "&dagger;",
        "‰": "&permil;",
        Ÿ: "&Yuml;",
        ˆ: "&circ;",
      };
      return targetStr.replace(
        /[&<>"'Ααϑ∀≠ ¹ÒëΒβϒ∂≡¡ºÓìΓγϖ∃≤¢»ÔíΔδ•∅≥£¼ÕîœΕε…∇⊂¤½Öï Ζζ′∈⊃¥¾×ð Ηη″∉⊄¦¿Øñ Θθ‾∋⊆§ÀÙòΙι⁄∏⊇¨ÁÚóΚκ℘∑⊕©ÂÛôΛλℑ−⊗ªÃÜõΜμℜ∗⊥«ÄÝö—Νν™√⋅¬ÅÞ÷‘Ξξℵ∝⌈Æßø‡Οο←∞⌉®Çàù‹Ππ↑∠⌊¯Èáú›Ρρ→∧⌋°Éâû€Σσ↓∨〈±ÊãüΤτ↔∩〉²ËäýΥυ↵∪◊³ÌåþΦφ⇐⇑⇒⇓∫♠♣♥♦´ÍæÿΧχ∴µÎçΨψ∼¶ÏèΩω≅·Ðéς⇔≈¸ÑêƒŒŠš˜–’‚“”„†‰Ÿˆ]/g,
        function (m) {
          return map[m];
        },
      );
    }),
    (util.escapeJsonData = function escapeJsonData(targetObj) {
      var obj = targetObj;
      for (var key in obj)
        switch (key) {
          case "workTitle":
          case "partDispNumber":
          case "partTitle":
          case "partExp":
          case "prevTitle":
          case "prevPartDispNumber":
          case "prevPartTitle":
          case "prevPartExp":
          case "nextTitle":
          case "nextPartDispNumber":
          case "nextPartTitle":
          case "nextPartExp":
            null !== obj[key] && (obj[key] = this.escapeString(obj[key]));
        }
      return obj;
    }));
  var cookieMap = {};
  function VideoController(selector) {
    var player = null,
      VIDEO_EVENT_LIST = [
        "loadstart",
        "progress",
        "error",
        "emptied",
        "stalled",
        "play",
        "loadeddata",
        "waiting",
        "playing",
        "seeking",
        "seeked",
        "timeupdate",
        "ended",
        "durationchange",
        "volumechange",
      ],
      VENDOR_PREFIX = /^(webkit|moz|MS)/,
      VIDEO_BITRATE_INDEX = [0, 1, 2, 3, 4],
      AUDIO_BITRATE_INDEX = [0, 1],
      that = this;
    ((this.muteToggle = function () {
      ((this.videoEl.muted = !this.videoEl.muted),
        util.setCookie(COOKIE_MUTE, this.videoEl.muted ? 1 : 0));
    }),
      (this.doMuted = function (value) {
        ((this.videoEl.muted = value),
          util.setCookie(COOKIE_MUTE, this.videoEl.muted ? 1 : 0));
      }),
      (this.playToggle = function () {
        this.videoEl.paused
          ? (this.videoEl.play(),
            util.replaceClass(this.videoWrapperEl, /play\-.*/, "play-playing"),
            updatePauseArea("play"))
          : (this.videoEl.pause(),
            util.replaceClass(this.videoWrapperEl, /play\-.*/, "play-pausing"),
            updatePauseArea("pause"),
            1 === that.keyDown.keyStatus && (that.keyDown.keyStatus = 2),
            0 === that.keyDown.keyStatus && this.sendResumePointPause());
      }),
      (this.repeatToggle = function () {
        (util.setCookie(
          "repeat_play",
          1 === Number(util.getCookie("repeat_play")) ? 0 : 1,
        ),
          util.toggleClass(that.videoWrapperEl, "pref-repeat-on"));
      }),
      (this.continueToggle = function () {
        (util.setCookie(
          "continuous_play",
          1 === Number(util.getCookie("continuous_play")) ? 0 : 1,
        ),
          util.toggleClass(that.videoWrapperEl, "pref-continues-on"));
      }),
      (this.opskipToggle = function () {
        (util.setCookie(
          "op_skip",
          1 === Number(util.getCookie("op_skip")) ? 0 : 1,
        ),
          util.toggleClass(that.videoWrapperEl, "pref-opskip-on"));
      }),
      (this.seek = function (value) {
        if (null !== player) {
          var curTime = player.currentTime;
          (this.controllerKeyDownEvent(curTime + value),
            (player.currentTime = curTime + value),
            (seekopetation = !0));
        }
      }),
      (this.jump = function (value) {
        (4 === playStatus && ((that.tmpResumePoint = value), that.goReplay()),
          null !== player && (player.currentTime = value));
      }),
      (this.volume = function (value) {
        var changed = value < 0 ? 0 : value > 1 ? 1 : value;
        (changed !== value && 0 !== changed && 1 !== changed) ||
          ((this.videoEl.volume = changed),
          (this.videoEl.muted = !1),
          util.setCookie(COOKIE_MUTE, 0),
          util.setCookie(COOKIE_VOLUME, this.videoEl.volume));
      }),
      (this.volumeUp = function () {
        var value = this.videoEl.muted ? 0 : this.videoEl.volume;
        this.volume(value + 0.1);
      }),
      (this.volumeDown = function () {
        this.videoEl.muted || this.volume(this.videoEl.volume - 0.1);
      }),
      (this.playbackRate = function (value) {
        ((player.playbackRate = value), util.setCookie("play_speed", value));
      }),
      (this.fullscreenToggle = function () {
        this.isFullscreen ? this.fullscreenOff() : this.fullscreenOn();
      }),
      (this.fullscreenOn = function () {
        document.body.requestFullscreen
          ? document.body.requestFullscreen()
          : window.alert(
              "ご利用のブラウザはフルスクリーン操作に対応していません",
            );
      }),
      (this.fullscreenOff = function () {
        document.exitFullscreen && document.exitFullscreen();
      }),
      (this.resetView = function () {
        var backThumb = document.getElementById("backThumb");
        backThumb &&
          (util.setStyle(backThumb, "background-image", ""),
          util.removeClass(backThumb, "loaded"));
        var backInfo = document.getElementById("backInfo");
        if (backInfo) {
          var backInfoTxt1 = backInfo.getElementsByClassName("backInfoTxt1");
          backInfoTxt1 &&
            backInfoTxt1.length &&
            (backInfoTxt1[0].innerHTML = "");
          var backInfoTxt2 = backInfo.getElementsByClassName("backInfoTxt2");
          backInfoTxt2 &&
            backInfoTxt2.length &&
            (backInfoTxt2[0].innerHTML = "");
          var backInfoTxt3 = backInfo.getElementsByClassName("backInfoTxt3");
          backInfoTxt3 &&
            backInfoTxt3.length &&
            (backInfoTxt3[0].innerHTML = "");
          var backInfoTxt4 = backInfo.getElementsByClassName("backInfoTxt4");
          (backInfoTxt4 &&
            backInfoTxt4.length &&
            (backInfoTxt4[0].innerHTML = ""),
            util.removeClass(backInfo, "loaded"));
        }
        var pauseInfo = document.getElementById("pauseInfo");
        if (pauseInfo) {
          var pauseInfoTxt1 = pauseInfo.getElementsByClassName("pauseInfoTxt1");
          pauseInfoTxt1 &&
            pauseInfoTxt1.length &&
            (pauseInfoTxt1[0].innerHTML = "");
          var pauseInfoTxt2 = pauseInfo.getElementsByClassName("pauseInfoTxt2");
          pauseInfoTxt2 &&
            pauseInfoTxt2.length &&
            (pauseInfoTxt2[0].innerHTML = "");
          var pauseInfoTxt3 = pauseInfo.getElementsByClassName("pauseInfoTxt3");
          pauseInfoTxt3 &&
            pauseInfoTxt3.length &&
            (pauseInfoTxt3[0].innerHTML = "");
        }
        ((document.getElementById("nextThumbnail").src = ""),
          (document.getElementById("nextTitle").innerHTML = ""),
          util.removeClass(
            document.getElementById("informationArea"),
            "fadeshow",
          ),
          util.removeClass(
            document.getElementById("informationArea"),
            "fadein",
          ),
          util.removeClass(
            document.getElementsByClassName("controller")[0],
            "endController",
          ),
          util.removeClass(
            document.getElementsByTagName("body")[0],
            "bodyInner",
          ),
          util.removeClass(this.videoWrapperEl, "inited"),
          util.replaceClass(this.videoWrapperEl, /play\-.*/, "play-playing"));
      }),
      (this.loadVideo = function () {
        (destroyPlayer(),
          this.skipUi &&
            (this.skipUi.hide(),
            util.addClass(this.videoWrapperEl, "loading-ui")));
      }),
      (this.rewriteHistory = function () {
        const url = (function () {
          switch (that.playType) {
            case 2:
              return that.ws010105Data.nextContentInfoUri;
            case 4:
              return that.ws010105Data.prevContentInfoUri;
            default:
              return "";
          }
        })();
        if (url) {
          restApiUrl = url;
          var partId =
              ((regexp = new RegExp("partId(=([^&#]*)|&|#|$)")),
              (partIds = restApiUrl.match(regexp)) ? partIds[0] : ""),
            playlistId = (function () {
              var regexp = new RegExp("playlistId(=([^&#]*)|&|#|$)"),
                playlistIds = restApiUrl.match(regexp);
              return playlistIds ? playlistIds[0] : "";
            })();
          if (partId) {
            var playerWindowUrl =
              window.location.pathname +
              "?" +
              partId +
              (playlistId ? "&" + playlistId : "");
            window.history.pushState(null, null, playerWindowUrl);
          }
        }
        var regexp, partIds;
      }),
      (this.goPrev = function () {
        ((this.playType = 4), this.loadVideo());
      }),
      (this.goNext = function () {
        ((this.playType = 2), this.loadVideo());
      }),
      (this.goRepeat = function () {
        ((this.playType = 1), this.loadVideo());
      }),
      (this.goReplay = function () {
        ((this.playType = 3), this.loadVideo());
      }),
      (this.sendResumePointPause = function () {
        null === that.sentPauseResumeTimerId &&
          (that.updateResumePoint(1, this.videoEl.currentTime, 2),
          (that.sentPauseResumeTimerId = window.setTimeout(function () {
            that.sentPauseResumeTimerId = null;
          }, 1e3)));
      }),
      (this.sendResumePointStop = function () {
        (this.updateResumePoint(2, this.videoEl.duration, 0),
          window.setTimeout(function () {
            (that.updateResumePoint(2, 0, 0),
              (playStatus = 4),
              util.removeClass(that.videoWrapperEl, "disable-button"),
              that.canPlayContinue(!1) &&
                (1 === Number(util.getCookie("repeat_play"))
                  ? that.goRepeat()
                  : 1 === Number(util.getCookie("continuous_play")) &&
                    !0 ===
                      util.isParamExists(
                        that.ws010105Data.nextContentInfoUri,
                      ) &&
                    that.goNext()));
          }, 500));
      }),
      (this.startControllerHiddenTimer = function (isPopup) {
        var doTimer = !0;
        (isPopup &&
          (doTimer = !(
            document
              .getElementById("prevPopup")
              .classList.contains("popup-hover") ||
            document
              .getElementById("nextPopup")
              .classList.contains("popup-hover") ||
            document
              .getElementById("backPopup")
              .classList.contains("popup-hover") ||
            document
              .getElementById("skipPopup")
              .classList.contains("popup-hover") ||
            document
              .getElementById("volumePopup")
              .classList.contains("popup-hover") ||
            document
              .getElementById("settingPopup")
              .classList.contains("popup-hover") ||
            that.delayPrevPopup
          )),
          doTimer &&
            (playStatus >= 3 ||
              (window.clearTimeout(that.mousemoveTimer),
              (that.mousemoveTimer = window.setTimeout(function () {
                var controller =
                  document.getElementsByClassName("controller")[0];
                (util.removeClass(controller, "fadeshow"),
                  util.removeClass(controller, "fadein"),
                  util.addClass(that.videoWrapperEl, "controller-hidden"),
                  that.ButtonControl(!1),
                  (touchEvFlg = 0));
              }, 3e3)),
              util.removeClass(this.videoWrapperEl, "controller-hidden"),
              util.removeClass(
                this.videoWrapperEl,
                "disable-controller-hidden",
              ))));
      }),
      (this.stopControllerHiddenTimer = function () {
        (window.clearTimeout(that.mousemoveTimer),
          util.removeClass(this.videoWrapperEl, "controller-hidden"),
          util.addClass(this.videoWrapperEl, "disable-controller-hidden"));
      }));
    var updatePauseArea = function (act) {
      (window.clearTimeout(that.backAreaClickTimer),
        util.removeClass(that.pauseInfoEl, "fadeAnim"),
        util.removeClass(that.pauseInfoEl, "fadeAnimDone"),
        (that.backAreaClickTimer = window.setTimeout(function () {
          (util.addClass(that.pauseInfoEl, "fadeAnim"),
            (that.backAreaClickTimer = window.setTimeout(function () {
              (util.addClass(that.pauseInfoEl, "fadeAnimDone"),
                (that.backAreaClickTimer = window.setTimeout(function () {
                  (util.removeClass(that.pauseInfoEl, "fadeAnim"),
                    delete that.backAreaClickTimer,
                    "play" == act
                      ? util.setStyle(video, "z-index", 1)
                      : util.setStyle(video, "z-index", 0));
                }, 400)));
            }, 400)));
        }, 30)));
    };
    ((this.updateResumePoint = function (
      infoType,
      sendResumePoint,
      playbackState,
      noSynchronism,
      isUnloadEvent,
    ) {
      if (
        (util.isParamExists(noSynchronism) || (noSynchronism = !0),
        0 === that.ws010105Data.multideviceState)
      )
        return 0;
      if (
        void 0 === that.ws010105Data.resumeInfoUrl ||
        null === that.ws010105Data.resumeInfoUrl ||
        "" === that.ws010105Data.resumeInfoUrl
      )
        return 0;
      var resumePointLastupdate = Math.floor(new Date().getTime() / 1e3),
        url =
          that.ws010105Data.resumeInfoUrl +
          "&type=" +
          RESUME_TYPE +
          "&number=" +
          ("00000000" + that.resumeNumber).slice(-8) +
          "&info_type=" +
          infoType +
          "&version=1.0.0&content_id=" +
          that.ws010105Data.partId +
          "&play_content_type=0&resume_point=" +
          Math.floor(1e3 * sendResumePoint) +
          "&resume_point_lastupdate=" +
          resumePointLastupdate +
          "&playback_state=" +
          playbackState,
        errMsg = "";
      if (isUnloadEvent && void 0 !== navigator.sendBeacon)
        navigator.sendBeacon(url, null);
      else {
        var request = new XMLHttpRequest();
        (request.open("POST", url, noSynchronism),
          noSynchronism && (request.timeout = 2e3),
          (request.onerror = function () {
            1 !== infoType &&
              ((errMsg =
                "40001:Send request failed. " +
                url +
                ", status - " +
                request.status +
                ", detail - " +
                request.statusText),
              that.sendErrorMessage(errMsg));
          }),
          (request.ontimeout = function () {
            1 !== infoType &&
              ((errMsg =
                "40001:url - " +
                url +
                ", status - " +
                request.status +
                ", detail - " +
                request.statusText),
              that.sendErrorMessage(errMsg));
          }),
          request.send(null));
      }
      return (
        (that.resumeNumber =
          that.resumeNumber > 99999999 ? 0 : that.resumeNumber + 1),
        0
      );
    }),
      (this.procEndedEvent = function (end_type) {
        (this.ButtonControl(!1),
          (playStatus = 3),
          clearInterval(that.sentPauseResumeTimerId),
          (that.sentPauseResumeTimerId = null),
          util.addClass(that.videoWrapperEl, "disable-button"),
          util.addClass(that.videoWrapperEl, "disable-skip"),
          util.replaceClass(that.videoWrapperEl, /play\-.*/, "play-ending"),
          util.hasClass(that.videoWrapperEl, "seeking") &&
            (util.removeClass(that.videoWrapperEl, "seeking"),
            util.setStyle(this.seekBarEl, "transform", "scaleX(1)"),
            util.setStyle(that.seekThumbTargetEl, "left", "100%")),
          that.playCheck.playCount++,
          (that.playCheck.playEndTime = Date.now()),
          0 === end_type
            ? this.sendResumePointStop()
            : (this.updateResumePoint(2, that.videoEl.currentTime, 0),
              (playStatus = 4),
              that.videoEl.pause(),
              util.removeClass(that.videoWrapperEl, "disable-button")),
          that.stopSendResumePointAlive(),
          that.canPlayContinue(!0) || that.showAfterPlayScreen());
      }),
      (this.EndByErrorBeforeSendResumeStart = function (errId, ErrMsg, BoxMsg) {
        ((playStatus = 5),
          null !== ErrMsg && that.sendErrorMessage(errId + ErrMsg),
          util.showMsgBox(errId, BoxMsg));
      }),
      (this.EndByErrorAfterSendResumeStart = function (errId, ErrMsg, BoxMsg) {
        ((playStatus = 5), null !== player && player.destroy());
        var sendResumePoint =
          -1 !== that.saveCurrentTime
            ? that.saveCurrentTime
            : that.ws010105Data.resumePoint;
        (this.updateResumePoint(2, sendResumePoint, 0),
          null !== ErrMsg && that.sendErrorMessage(errId + ErrMsg),
          util.showMsgBox(errId, BoxMsg));
      }),
      (this.EndByErrorAfterPlayStart = function (errId, ErrMsg, BoxMsg) {
        ((playStatus = 6),
          util.remove(loadingEl),
          util.remove(videoWrapperEl),
          null !== player && player.destroy());
        var sendResumePoint =
          -1 !== that.saveCurrentTime
            ? that.saveCurrentTime
            : that.ws010105Data.resumePoint;
        (this.updateResumePoint(2, sendResumePoint, 0),
          that.stopSendResumePointAlive(),
          null !== ErrMsg && that.sendErrorMessage(errId + ErrMsg),
          util.showMsgBox(errId, BoxMsg));
      }),
      (this.playSelected = function () {
        4 === playStatus
          ? ((that.tmpResumePoint = 0), that.goReplay())
          : that.playToggle();
      }),
      (this.seekSelected = function (seekPos, repeat) {
        (4 === playStatus && ((that.tmpResumePoint = seekPos), that.goReplay()),
          null !== player &&
            ((seekPos = seekPos < 0 ? 0 : seekPos),
            that.isPopupReMake(that.getPopupMode(!0, seekPos)) &&
              !repeat &&
              (clearTimeout(that.mousemoveTimer),
              that.controllerKeyDownEvent(seekPos)),
            (player.currentTime = seekPos),
            (seekopetation = !0)));
      }),
      (this.isPlaying = function () {
        return 2 === playStatus;
      }),
      (this.sendResumePointAlive = function () {
        var playbackState = 1;
        (that.videoEl.paused && (playbackState = 2),
          (that.resumeSendAliveTimerId = window.setTimeout(
            that.sendResumePointAlive,
            3e5,
          )),
          that.updateResumePoint(1, that.videoEl.currentTime, playbackState));
      }),
      (this.stopSendResumePointAlive = function () {
        (clearTimeout(that.resumeSendAliveTimerId),
          (that.resumeSendAliveTimerId = null));
      }),
      (this.ButtonControl = function (on, button, clsName, flag) {
        if (that.isControllerEnabled()) {
          var prevPopup = document.getElementById("prevPopup"),
            prevPopupIn = document.getElementById("prevPopupIn"),
            prevPopupInReTop = document.getElementById("prevPopupInReTop");
          flag ||
            (prevPopup && util.replaceClass(prevPopup, /popup.*/, "popup"),
            prevPopupIn &&
              util.replaceClass(prevPopupIn, /popupIn.*/, "popupIn"),
            prevPopupInReTop &&
              util.replaceClass(prevPopupInReTop, /popupIn.*/, "popupIn"));
          var backPopup = document.getElementById("backPopup"),
            backPopupIn = backPopup.childNodes[0];
          backPopup &&
            backPopupIn &&
            (util.replaceClass(backPopup, /popup.*/, "popup"),
            util.replaceClass(backPopupIn, /popupIn.*/, "popupIn"));
          var skipPopup = document.getElementById("skipPopup"),
            skipPopupIn = skipPopup.childNodes[0];
          skipPopup &&
            skipPopupIn &&
            (util.replaceClass(skipPopup, /popup.*/, "popup"),
            util.replaceClass(skipPopupIn, /popupIn.*/, "popupIn"));
          var volumePopup = document.getElementById("volumePopup"),
            volumePopupIn = volumePopup.childNodes[0],
            volumeThumb = document.getElementById("volumeThumb"),
            volumeBar = document.getElementById("volumeBar"),
            volumeThumbTarget = document.getElementById("volumeThumbTarget");
          volumePopup &&
            volumePopupIn &&
            (util.replaceClass(volumePopup, /popup.*/, "popup"),
            util.replaceClass(volumePopupIn, /popupIn.*/, "popupIn"),
            util.replaceClass(volumeThumb, /volumeThumb.*/, "volumeThumb"),
            util.replaceClass(volumeBar, /volumeBar.*/, "volumeBar"),
            util.replaceClass(
              volumeThumbTarget,
              /volumeThumbTarget.*/,
              "volumeThumbTarget",
            ));
          var settingPopup = document.getElementById("settingPopup"),
            settingPopupIn = settingPopup.childNodes[0];
          settingPopup &&
            settingPopupIn &&
            (util.replaceClass(settingPopup, /popup.*/, "popup"),
            util.replaceClass(settingPopupIn, /popupIn.*/, "popupIn"));
          var nextPopup = document.getElementById("nextPopup"),
            nextPopupIn = nextPopup.childNodes[0],
            nextThumbButton = document.getElementById("nextThumbButton");
          (nextPopup &&
            nextPopupIn &&
            (util.replaceClass(nextPopup, /popup.*/, "popup"),
            util.replaceClass(nextPopupIn, /popupIn.*/, "popupIn"),
            util.replaceClass(
              nextThumbButton,
              /nextThumbButton.*/,
              "nextThumbButton",
            )),
            on
              ? ("prevPopup" == button &&
                  (!that.ws010105Data.prevContentInfoUri ||
                    (util.hasClass(prevPopup, "popup") &&
                      !util.hasClass(prevPopup, "popup" + clsName))) &&
                  that.prevPlay3SecJudge(clsName),
                "backPopup" == button &&
                  (util.replaceClass(backPopup, /popup.*/, "popup" + clsName),
                  util.replaceClass(
                    backPopupIn,
                    /popupIn.*/,
                    "popupIn" + clsName,
                  )),
                "skipPopup" == button &&
                  (util.replaceClass(skipPopup, /popup.*/, "popup" + clsName),
                  util.replaceClass(
                    skipPopupIn,
                    /popupIn.*/,
                    "popupIn" + clsName,
                  )),
                "volumePopup" == button &&
                  (util.replaceClass(volumePopup, /popup.*/, "popup" + clsName),
                  util.replaceClass(
                    volumePopupIn,
                    /popupIn.*/,
                    "popupIn" + clsName,
                  ),
                  util.replaceClass(
                    volumeThumb,
                    /volumeThumb.*/,
                    "volumeThumb",
                  ),
                  util.replaceClass(volumeBar, /volumeBar.*/, "volumeBar"),
                  util.replaceClass(
                    volumeThumbTarget,
                    /volumeThumbTarget.*/,
                    "volumeThumbTarget",
                  )),
                "settingPopup" == button &&
                  (util.replaceClass(
                    settingPopup,
                    /popup.*/,
                    "popup" + clsName,
                  ),
                  util.replaceClass(
                    settingPopupIn,
                    /popupIn.*/,
                    "popupIn" + clsName,
                  )),
                "nextPopup" == button &&
                  (util.replaceClass(nextPopup, /popup.*/, "popup" + clsName),
                  util.replaceClass(
                    nextPopupIn,
                    /popupIn.*/,
                    "popupIn" + clsName,
                  ),
                  util.replaceClass(
                    nextThumbButton,
                    /nextThumbButton.*/,
                    "nextThumbButton",
                  )))
              : 1 === touchEvFlg &&
                util.removeClass(that.videoWrapperEl, "controller-hover"));
        }
        touchEvFlg = 0;
      }),
      (this.setChapterSkip = function (result) {
        ((chapter_skip.end = result.end), (chapter_skip.index = result.index));
      }),
      (this.chapterCheck = function (_currentTime) {
        const chapters = that.ws010105Data.chapters
          ? that.ws010105Data.chapters
          : [];
        let currentChapter = { type: null, end: null };
        const result = {
          skip: !1,
          canSkipUIDisp: !1,
          index: 0,
          end: null,
          title: "",
          ui: 0,
        };
        let isNoneContinuous = !1,
          currentTime = Math.floor(_currentTime);
        if (0 === Number(util.getCookie("op_skip"))) return result;
        if (0 === chapters.length || skipWaitTime < 0 || minTimeToSkip < 0)
          return result;
        skipWaitTime <= 1e3 && (result.ui = 2);
        for (let [i, chapter] of chapters.entries())
          chapter.start / 1e3 <= currentTime &&
            currentTime <= chapter.end / 1e3 &&
            ((currentChapter = chapter), (result.index = i));
        if (
          ("none" === currentChapter.type && (result.skip = !0),
          result.index === chapters.length - 1)
        )
          result.end = currentChapter.end;
        else
          for (let i = result.index + 1; i < chapters.length; i++) {
            if ("none" !== chapters[i].type) {
              result.end = chapters[i].start;
              break;
            }
            i === chapters.length - 1 &&
              "none" === chapters[i].type &&
              ((result.end = chapters[i].end),
              (currentChapter = chapters[i]),
              "none" === currentChapter.type && (isNoneContinuous = !0));
          }
        return (
          currentChapter.end / 1e3 - currentTime >= minTimeToSkip / 1e3
            ? (result.canSkipUIDisp = !0)
            : (result.canSkipUIDisp = !1),
          !1 === currentChapter.showInterface && (result.ui = 2),
          result.index === chapters.length - 1
            ? that.canPlayRepeat()
              ? (result.title = "もう一度再生")
              : that.canPlayContinue(!1) &&
                  util.isParamExists(that.ws010105Data.nextContentInfoUri)
                ? (result.title = "次のエピソードへ")
                : (result.title = "再生を終了")
            : (result.title = isNoneContinuous
                ? "再生を終了"
                : "本編へスキップ"),
          result
        );
      }),
      (this.clearSkipUiHistory = function () {
        skip_ui_history = new Map();
      }),
      (this.initializeSkipUiHistory = function (length) {
        for (let i = 0; i < length; i++) skip_ui_history.set(i, 0);
      }),
      (this.getSkipUiHistory = function (index) {
        const res = skip_ui_history.get(index);
        return res || -1;
      }),
      (this.setSkipUiHistory = function (index) {
        skip_ui_history.set(index, 1);
      }),
      (this.isShowSkipUi = function () {
        return $(".skipUi").hasClass("hidden") ? 1 : 0;
      }),
      (this.isShowController = function () {
        return $(".videoWrapper").hasClass("controller-hidden") ? 1 : 0;
      }),
      (this.isLoading = function () {
        return $(".videoWrapper").hasClass("loading-ui") ? 1 : 0;
      }),
      (this.removeSkipUi = function () {
        return (that.skipUi.hide(), 0);
      }),
      (this.skipUiHiddenChapter = function (jumptime) {
        return ((player.currentTime = jumptime / 1e3), 0);
      }),
      (this.showSkipUi = function (jumptime, title, countdown, index) {
        return 0 === this.isShowSkipUi()
          ? 1
          : 0 === this.isShowController()
            ? -1
            : 1 === this.getSkipUiHistory(index)
              ? 1
              : 1 === this.isLoading()
                ? 9
                : (this.setSkipUiHistory(index),
                  (that.skipUi.message = title),
                  (that.skipUi.jumptime = jumptime),
                  void (0 === countdown
                    ? ((that.skipUi.countdownLabel.innerHTML = ""),
                      (that.skipUi.paused = !0),
                      that.skipUi.show())
                    : that.skipUi.start(countdown, 0)));
      }),
      (this.sendErrorMessage = function (msg) {
        if (
          void 0 !== that.ws010105Data.resumeInfoUrl &&
          null !== that.ws010105Data.resumeInfoUrl &&
          "" !== that.ws010105Data.resumeInfoUrl
        ) {
          var urlParts = that.ws010105Data.resumeInfoUrl
              .split("?")[0]
              .split("/"),
            sendErrUrl = urlParts[0] + "//" + urlParts[2] + "/";
          sendErrUrl = sendErrUrl + "?message=" + encodeURIComponent(msg);
          var request = new XMLHttpRequest();
          (request.open("GET", sendErrUrl, !0),
            (request.timeout = 4e3),
            request.send(null));
        }
      }));
    var WS010105_INIT_PARAMS_MAP = {
        appType: "",
        partId: "",
        workTitle: "　",
        partDispNumber: "　",
        partExp: "　",
        partTitle: "　",
        mainScenePath: NO_IMAGE_URL,
        oneTimeKey: "",
        laUrl: "",
        castContentUri: "",
        apiUrl: "",
        thumbnailUrl: "",
        startStatus: "TOP",
        resumePoint: 0,
        resumeInfoUrl: "",
        multideviceState: 0,
        snsTwitter: "",
        snsFacebook: "",
        snsGoogle: "",
        snsHatebu: "",
        prevMainScenePath: NO_IMAGE_URL,
        prevPartDispNumber: "　",
        prevPartTitle: "　",
        prevPartExp: "　",
        prevContentInfoUri: "",
        nextMainScenePath: NO_IMAGE_URL,
        nextPartDispNumber: "　",
        nextPartTitle: "　",
        nextPartExp: "　",
        nextContentInfoUri: "",
        afterJoinPromotionBannerUrl: "",
        opSkipPoint: "",
        opSkipAvailable: "",
        mylistStatus: "2",
        recommendContentInfo: "",
      },
      eventType;
    ((this.initContentsInfo = function () {
      var lastresumeInfoUrl = null;
      (util.isParamExists(that.ws010105Data) &&
        util.isParamExists(that.ws010105Data.resumeInfoUrl) &&
        (lastresumeInfoUrl = that.ws010105Data.resumeInfoUrl),
        (that.ws010105Data = null),
        (that.ws010105Data = WS010105_INIT_PARAMS_MAP),
        null !== lastresumeInfoUrl &&
          (that.ws010105Data.resumeInfoUrl = lastresumeInfoUrl));
    }),
      (this.isControllerEnabled = function () {
        return 2 === playStatus || 4 === playStatus;
      }),
      (this.controllerKeyDownEvent = function (rate, tag) {
        const popupmode = that.getPopupMode(!0, rate);
        that.isPopupReMake(popupmode) &&
          that.isPrevBtnOn &&
          (this.ButtonControl(!1),
          that.delayPrevPopup && clearTimeout(that.delayPrevPopup),
          (that.oldpopupmode = popupmode),
          (that.delayPrevPopup = setTimeout(function () {
            (that.isPrevBtnOn && that.prevPlay3SecJudge("-hover", !0, rate),
              (that.delayPrevPopup = void 0));
          }, 400)));
      }),
      (this.isPopupReMake = function (popupmode) {
        if (that.delayPrevPopup && that.oldpopupmode != popupmode) return !0;
        var prevPopupInEl = document.getElementById("prevPopupIn"),
          prevPopupInReTopEl = document.getElementById("prevPopupInReTop");
        return 1 == popupmode
          ? !(
              prevPopupInReTopEl.classList.contains("show") &&
              !prevPopupInReTopEl.classList.contains("hide") &&
              prevPopupInEl.classList.contains("hide") &&
              !prevPopupInEl.classList.contains("show")
            )
          : !(
              prevPopupInReTopEl.classList.contains("hide") &&
              !prevPopupInReTopEl.classList.contains("show") &&
              prevPopupInEl.classList.contains("show") &&
              !prevPopupInEl.classList.contains("hide")
            );
      }),
      (this.getPopupMode = function (flag, time) {
        var currentTime = flag
            ? time
            : null !== player
              ? player.currentTime
              : void 0,
          prevPopupEl = document.getElementById("prevPopup");
        if (this.videoEl && void 0 !== currentTime && prevPopupEl) {
          if (
            !util.isParamExists(this.ws010105Data.prevContentInfoUri) ||
            (util.isParamExists(this.ws010105Data.prevContentInfoUri) &&
              currentTime > 3)
          )
            return 1;
          if (
            util.isParamExists(this.ws010105Data.prevContentInfoUri) &&
            currentTime >= 0 &&
            currentTime <= 3
          )
            return 0;
        }
      }),
      (this.prevPlay3SecJudge = function (clsName, flag, time) {
        var currentTime = flag
            ? time
            : null !== player
              ? player.currentTime
              : void 0,
          prevPopupEl = document.getElementById("prevPopup"),
          prevPopupInEl = document.getElementById("prevPopupIn"),
          prevPopupInReTopEl = document.getElementById("prevPopupInReTop");
        this.videoEl &&
          void 0 !== currentTime &&
          prevPopupEl &&
          (!util.isParamExists(this.ws010105Data.prevContentInfoUri) ||
          (util.isParamExists(this.ws010105Data.prevContentInfoUri) &&
            currentTime > 3)
            ? ((prevPopupInReTopEl.classList.contains("show") &&
                !prevPopupInReTopEl.classList.contains("hide") &&
                prevPopupInEl.classList.contains("hide") &&
                !prevPopupInEl.classList.contains("show")) ||
                (util.removeClass(prevPopupInReTopEl, "hide"),
                util.addClass(prevPopupInReTopEl, "show"),
                util.removeClass(prevPopupInEl, "show"),
                util.addClass(prevPopupInEl, "hide")),
              util.replaceClass(
                prevPopupInReTopEl,
                /popup.*/,
                "popupIn" + clsName,
              ))
            : util.isParamExists(this.ws010105Data.prevContentInfoUri) &&
              currentTime >= 0 &&
              currentTime <= 3 &&
              ((prevPopupInReTopEl.classList.contains("hide") &&
                !prevPopupInReTopEl.classList.contains("show") &&
                prevPopupInEl.classList.contains("show") &&
                !prevPopupInEl.classList.contains("hide")) ||
                (util.removeClass(prevPopupInEl, "hide"),
                util.addClass(prevPopupInEl, "show"),
                util.removeClass(prevPopupInReTopEl, "show"),
                util.addClass(prevPopupInReTopEl, "hide"),
                (document.getElementById("prevThumbnail").src =
                  this.ws010105Data.prevMainScenePath),
                (document.getElementById("prevTitle").innerHTML =
                  this.ws010105Data.prevPartDispNumber +
                  " " +
                  this.ws010105Data.prevPartTitle)),
              util.replaceClass(prevPopupInEl, /popup.*/, "popupIn" + clsName)),
          util.replaceClass(prevPopup, /popup.*/, "popup" + clsName));
      }),
      (this.prevBtnClickTouchEvent = function () {
        var prevPopupEl = document.getElementById("prevPopup"),
          prevPopupInEl = document.getElementById("prevPopupIn"),
          prevPopupInReTopEl = document.getElementById("prevPopupInReTop");
        prevPopupEl &&
          prevPopupInEl &&
          prevPopupInReTopEl &&
          (prevPopupInEl.classList.contains("show") &&
          prevPopupInReTopEl.classList.contains("hide")
            ? (this.ButtonControl(!1), (this.prevBtnStay = !0), this.goPrev())
            : prevPopupInEl.classList.contains("hide") &&
              prevPopupInReTopEl.classList.contains("show") &&
              (that.isPrevBtnOn
                ? (this.ButtonControl(!1),
                  this.jump(0),
                  that.delayPrevPopup && clearTimeout(that.delayPrevPopup),
                  (that.delayPrevPopup = setTimeout(function () {
                    (that.isPrevBtnOn && that.prevPlay3SecJudge("-hover"),
                      (that.delayPrevPopup = void 0));
                  }, 400)))
                : (this.ButtonControl(!1),
                  this.jump(0),
                  this.prevPlay3SecJudge("-hover"))));
      }));
    var WINDOW_EVENT_LIST = [
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "MSFullscreenChange",
        "fullscreenchange",
        "beforeunload",
        "mouseup",
      ],
      windowHandlers = {
        fullscreenchange: function () {
          ((this.isFullscreen =
            (document.webkitFullscreenElement &&
              null !== document.webkitFullscreenElement) ||
            (document.mozFullScreenElement &&
              null !== document.mozFullScreenElement) ||
            (document.msFullscreenElement &&
              null !== document.msFullscreenElement) ||
            (document.fullScreenElement &&
              null !== document.fullScreenElement)),
            util.changeClass(
              this.videoWrapperEl,
              "fullscreen",
              this.isFullscreen,
            ));
        },
        beforeunload: function () {
          (0 === playCount && 1 === playStatus
            ? that.updateResumePoint(
                2,
                that.ws010105Data.resumePoint,
                0,
                !1,
                !0,
              )
            : playStatus >= 1 &&
              playStatus < 4 &&
              that.updateResumePoint(2, this.videoEl.currentTime, 0, !1, !0),
            null !== player && player.destroy(),
            util.setCookie(COOKIE_DISPLAY_WIDTH, window.innerWidth),
            util.setCookie(COOKIE_DISPLAY_HEIGHT, window.innerHeight));
          for (
            var cookieNum = 0;
            cookieNum < PLAYER_COOKIE_LIST.length;
            ++cookieNum
          ) {
            var cookieVal = util.getCookie(PLAYER_COOKIE_LIST[cookieNum]);
            util.isParamExists(cookieVal) &&
              util.setCookie(PLAYER_COOKIE_LIST[cookieNum], cookieVal);
          }
        },
        mouseup: function () {
          (util.hasClass(that.videoWrapperEl, "seeking") &&
            util.removeClass(that.videoWrapperEl, "seeking"),
            util.hasClass(that.videoWrapperEl, "volumeChanging") &&
              util.removeClass(that.videoWrapperEl, "volumeChanging"));
        },
      };
    for (eventType in windowHandlers)
      window[eventType + "Handler"] = windowHandlers[eventType];
    var DOCUMENT_EVENT_LIST = ["keydown", "keyup", "blur"];
    this.initKeyDown = function () {
      that.keyDown = { keyCode: -1, keyStatus: 0 };
    };
    var documentHandlers = {
      keydown: function (e) {
        if (
          (that.resetPlayTimeAndCount(), 70 !== e.keyCode && 122 !== e.keyCode)
        ) {
          if (0 !== document.getElementsByClassName("modalDialog").length)
            return;
          if (!that.isControllerEnabled()) return;
        }
        (that.keyDown.keyCode != e.keyCode &&
          2 === that.keyDown.keyStatus &&
          (that.sendResumePointPause(), that.initKeyDown()),
          1 === that.isShowSkipUi() && that.startControllerHiddenTimer(!0),
          (that.repeatObj = that.repeatObj || {}),
          (that.repeatObj["isPreat" + e.keyCode] =
            that.repeatObj["isPreat" + e.keyCode] || !1));
        var repeat = that.repeatObj["isPreat" + e.keyCode];
        that.repeatObj["isPreat" + e.keyCode] = !0;
        const isFinished = 4 === playStatus,
          ClsoeInfoArea = () => {
            if (isFinished) {
              that.recommendControlHide();
              var informationArea =
                document.getElementsByClassName("informationArea")[0];
              (util.replaceClass(informationArea, /show/, "hide"),
                util.removeClass(informationArea, "fadeshow"),
                util.removeClass(informationArea, "fadein"));
            }
          };
        switch (e.keyCode) {
          case 13:
          case 32:
          case 75:
            if (0 === that.isShowSkipUi() && that.skipUi.focus) {
              (that.skipUi.focus == that.skipUi.skipButton
                ? that.skipUi.activate(!0)
                : that.skipUi.cancel(!0),
                e.preventDefault());
              break;
            }
            (that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              that.keyDown.keyCode != e.keyCode &&
                ((that.keyDown.keyStatus = 1),
                (that.keyDown.keyCode = e.keyCode)),
              repeat || (that.playSelected(), ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 37:
          case 74:
            if (((seekopetation = !0), 0 === that.isShowSkipUi())) {
              (that.skipUi.focus && that.skipUi.focus == that.skipUi.skipButton
                ? (that.skipUi.focus = that.skipUi.cancelButton)
                : (that.skipUi.focus = that.skipUi.skipButton),
                that.skipUi.pause(),
                e.preventDefault());
              break;
            }
            if (
              (that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              null !== player)
            ) {
              var repeatcheck = !0;
              if (repeat) {
                if (that.repeatcheckflg) {
                  (clearTimeout(that.mousemoveTimer), e.preventDefault());
                  break;
                }
              } else ((that.repeatcheckflg = !1), (repeatcheck = !1));
              (player.currentTime - 10 < 3 &&
                ((that.repeatcheckflg = !0), (repeatcheck = !1)),
                that.seekSelected(player.currentTime - 10, repeatcheck),
                ClsoeInfoArea(),
                e.preventDefault());
            }
            break;
          case 39:
          case 76:
            if (((seekopetation = !0), 0 === that.isShowSkipUi())) {
              (that.skipUi.focus && that.skipUi.focus == that.skipUi.skipButton
                ? (that.skipUi.focus = that.skipUi.cancelButton)
                : (that.skipUi.focus = that.skipUi.skipButton),
                that.skipUi.pause(),
                e.preventDefault());
              break;
            }
            if (
              (that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              4 === playStatus)
            )
              return;
            (that.seek(10), e.preventDefault());
            break;
          case 38:
            (that.volumeUp(), e.preventDefault());
            break;
          case 40:
            (that.volumeDown(), e.preventDefault());
            break;
          case 122:
          case 70:
            (repeat || that.fullscreenToggle(), e.preventDefault());
            break;
          case 77:
            (repeat || that.muteToggle(), e.preventDefault());
            break;
          case 36:
          case 48:
          case 96:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0), that.jump(0), ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 49:
          case 97:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.1 * that.videoEl.duration),
                that.jump(0.1 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 50:
          case 98:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.2 * that.videoEl.duration),
                that.jump(0.2 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 51:
          case 99:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.3 * that.videoEl.duration),
                that.jump(0.3 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 52:
          case 100:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.4 * that.videoEl.duration),
                that.jump(0.4 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 53:
          case 101:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.5 * that.videoEl.duration),
                that.jump(0.5 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 54:
          case 102:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.6 * that.videoEl.duration),
                that.jump(0.6 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 55:
          case 103:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.7 * that.videoEl.duration),
                that.jump(0.7 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 56:
          case 104:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.8 * that.videoEl.duration),
                that.jump(0.8 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 57:
          case 105:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(0.9 * that.videoEl.duration),
                that.jump(0.9 * that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 35:
            ((seekopetation = !0),
              that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              repeat ||
                (that.controllerKeyDownEvent(that.videoEl.duration),
                that.jump(that.videoEl.duration),
                ClsoeInfoArea()),
              e.preventDefault());
            break;
          case 78:
          case 34:
          case 35:
            (that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              util.isParamExists(that.ws010105Data.nextContentInfoUri) &&
                (ClsoeInfoArea(), that.goNext()));
            break;
          case 80:
          case 33:
            (that.removeSkipUi(),
              that.startControllerHiddenTimer(!0),
              ClsoeInfoArea(),
              util.isParamExists(that.ws010105Data.prevContentInfoUri) &&
                (ClsoeInfoArea(), that.goPrev()));
        }
      },
      keyup: function (e) {
        switch (e.keyCode) {
          case 37:
          case 74:
            1 === that.isShowSkipUi() &&
              (that.startControllerHiddenTimer(!0), (that.repeatcheckflg = !1));
        }
        ((that.repeatObj["isPreat" + e.keyCode] = !1),
          that.resetPlayTimeAndCount(),
          0 === document.getElementsByClassName("modalDialog").length &&
            that.isControllerEnabled() &&
            (that.keyDown.keyCode === e.keyCode &&
              2 === that.keyDown.keyStatus &&
              that.sendResumePointPause(),
            that.initKeyDown()));
      },
      blur: function () {
        (that.resetPlayTimeAndCount(),
          0 === document.getElementsByClassName("modalDialog").length &&
            that.isControllerEnabled() &&
            (2 === that.keyDown.keyStatus && that.sendResumePointPause(),
            that.initKeyDown()));
      },
    };
    for (eventType in documentHandlers)
      document[eventType + "Handler"] = documentHandlers[eventType];
    ((this.canPlayRepeat = function () {
      return 1 === Number(util.getCookie("repeat_play"));
    }),
      (this.canPlayContinue = function (first) {
        var playTime =
          (that.playCheck.playEndTime - that.playCheck.userOperateTime) / 1e3;
        return (
          (1 === Number(util.getCookie("repeat_play")) ||
            (1 === Number(util.getCookie("continuous_play")) &&
              !0 ===
                util.isParamExists(that.ws010105Data.nextContentInfoUri))) &&
          (!(playTime > 10800 && that.playCheck.playCount >= 3) ||
            (first && that.sendErrorMessage("48000"), !1))
        );
      }),
      (this.resetPlayTimeAndCount = function () {
        ((that.playCheck.userOperateTime = Date.now()),
          (that.playCheck.playCount = 0));
      }),
      (this.showAfterPlayScreen = function () {
        if (
          document
            .getElementById("informationArea")
            .classList.contains("fadeshow")
        )
          return;
        ($(".videoWrapper").addClass("skipui-hidden"),
          $(".cancelButton").click(),
          util.setStyle(video, "z-index", 0),
          util.addClass(
            document.getElementsByClassName("loadingSpin")[0],
            "hide",
          ),
          that.stopControllerHiddenTimer(),
          !0 !== util.isParamExists(that.ws010105Data.nextContentInfoUri) &&
            that.fullscreenOff());
        var lsns = document.getElementById("facebook");
        ("undefined" === lsns.getAttribute("href") ||
        "" === lsns.getAttribute("href") ||
        "null" === lsns.getAttribute("href") ||
        util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl)
          ? util.addClass(lsns, "hide")
          : util.removeClass(lsns, "hide"),
          "undefined" ===
            (lsns = document.getElementById("twitter")).getAttribute("href") ||
          "" === lsns.getAttribute("href") ||
          "null" === lsns.getAttribute("href") ||
          util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl)
            ? util.addClass(lsns, "hide")
            : util.removeClass(lsns, "hide"),
          "undefined" ===
            (lsns = document.getElementById("google")).getAttribute("href") ||
          "" === lsns.getAttribute("href") ||
          "null" === lsns.getAttribute("href") ||
          util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl)
            ? util.addClass(lsns, "hide")
            : util.removeClass(lsns, "hide"),
          "undefined" ===
            (lsns = document.getElementById("hatebu")).getAttribute("href") ||
          "" === lsns.getAttribute("href") ||
          "null" === lsns.getAttribute("href") ||
          util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl)
            ? util.addClass(lsns, "hide")
            : util.removeClass(lsns, "hide"));
        var informationArea = document.getElementById("informationArea");
        (util.addClass(informationArea, "fadeshow"),
          setTimeout(function () {
            util.addClass(informationArea, "fadein");
          }, 100),
          util.addClass(
            document.getElementsByClassName("controller")[0],
            "endController",
          ),
          util.addClass(document.getElementsByTagName("body")[0], "bodyInner"));
        const recomPos = document.querySelector(".recomPos"),
          promotionInfo = document.getElementById("promotionInfo"),
          addToMylist = document.getElementById("addToMylist"),
          recommendControl = document.getElementById("recommendControl");
        ((recommendControl.innerText = "おすすめを閉じる"),
          (recommendControl.style.marginTop = "20px"),
          util.replaceClass(recommendControl, /hide/, "show"));
        const twitterIcon = document.querySelector(".c-afterWatchHeader__icon");
        if (!1 === util.isParamExists(that.ws010105Data.nextContentInfoUri))
          if (util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl))
            (util.replaceClass(promotionInfo, /hide/, "show"),
              util.replaceClass(recomPos, /show/, "hide"),
              util.replaceClass(recommendControl, /show/, "hide"));
          else {
            (util.replaceClass(promotionInfo, /show/, "hide"),
              changeAddToMyListBtnStatus(that.ws010105Data.mylistStatus));
            var endController =
              document.getElementsByClassName("endController")[0];
            (util.replaceClass(endController, /show/, "hide"),
              util.removeClass(endController, "fadeshow"),
              util.removeClass(endController, "fadein"),
              util.replaceClass(informationArea, /hide/, "show"),
              util.replaceClass(twitterIcon, /show/, "hide"),
              util.removeClass(twitterIcon, "fadeshow"),
              util.removeClass(twitterIcon, "fadein"),
              twitterIcon.setAttribute("after-play", "false"));
            const nextPos = document.querySelector(".l-section.isAfterWatch");
            if (
              (util.replaceClass(nextPos, /show/, "hide"),
              resetScroll(),
              that.ws010105Data.recommendContentInfo)
            ) {
              getfavoriteStatus(that.ws010105Data.recommendContentInfo);
              const recomPos = document.querySelector(".recomPos");
              util.replaceClass(recomPos, /hide/, "show");
            }
            (getComic(that.ws010105Data, !1), getFeatureList());
          }
        else {
          (util.replaceClass(promotionInfo, /show/, "hide"),
            util.replaceClass(addToMylist, /show/, "hide"));
          var endController =
            document.getElementsByClassName("endController")[0];
          (util.replaceClass(endController, /show/, "hide"),
            util.removeClass(endController, "fadeshow"),
            util.removeClass(endController, "fadein"),
            util.replaceClass(informationArea, /hide/, "show"),
            util.replaceClass(twitterIcon, /hide/, "show"),
            util.addClass(twitterIcon, "fadeshow"),
            setTimeout(function () {
              util.addClass(twitterIcon, "fadein");
            }, 100),
            twitterIcon.setAttribute("after-play", "true"));
          const recomPos = document.querySelector(".recomPos");
          util.replaceClass(recomPos, /show/, "hide");
          const comicPos = document.querySelector(".comicPos");
          util.replaceClass(comicPos, /show/, "hide");
          const goodsPos = document.querySelector(".goodsPos");
          util.replaceClass(goodsPos, /show/, "hide");
          const nextPos = document.querySelector(".l-section.isAfterWatch");
          (util.replaceClass(nextPos, /hide/, "show"),
            resetScroll(),
            getComic(that.ws010105Data, !0));
        }
        window.addEventListener("resize", () => {
          resizeModal();
        });
      }));
    const getComic = async (ws010105Data, isNext) => {
      const title = isNext
          ? ws010105Data.bookWorkInfoTitle
          : ws010105Data.bookRecommendInfoTitle,
        comicItemList = document.getElementById("comicList");
      for (; comicItemList.hasChildNodes();)
        comicItemList.removeChild(comicItemList.firstChild);
      const originalNode = await getOriginal(ws010105Data);
      await getRelatedComic(ws010105Data, comicItemList, originalNode, title);
    };
    var videoHandlers = {
      loadstart: function () {
        util.removeClass(
          document.getElementsByClassName("loadingSpin")[0],
          "hide",
        );
      },
      ended: function () {
        that.procEndedEvent(0);
      },
      timeupdate: function () {
        var ratio = this.videoEl.currentTime / this.videoEl.duration;
        (util.setStyle(this.seekBarEl, "transform", "scaleX(" + ratio + ")"),
          util.hasClass(this.videoWrapperEl, "seeking") ||
            util.setStyle(that.seekThumbTargetEl, "left", 100 * ratio + "%"),
          1 === Number(util.getCookie("time_format"))
            ? (this.timeEl.innerHTML =
                util.formatTime(Math.floor(this.videoEl.currentTime)) +
                " / " +
                util.formatTime(Math.floor(this.videoEl.duration)))
            : (this.timeEl.innerHTML = util.formatTime(
                Math.floor(this.videoEl.duration - this.videoEl.currentTime),
              )),
          (that.saveCurrentTime = this.videoEl.currentTime));
        const result = that.chapterCheck(this.videoEl.currentTime);
        if (
          (chapter_skip.index !== result.index && (chapter_skip.ui = 0),
          result.skip)
        ) {
          if (0 === chapter_skip.ui) {
            if (!result.canSkipUIDisp)
              return (that.removeSkipUi(), void this.setChapterSkip(result));
            if (2 === result.ui) {
              if (1 === that.getSkipUiHistory(result.index)) return;
              return 0 !== result.index && 0 === that.isShowController()
                ? void this.setChapterSkip(result)
                : seekopetation ||
                    (that.ws010105Data.resumePoint &&
                      that.ws010105Data.chapters[result.index].start <=
                        1e3 * that.ws010105Data.resumePoint &&
                      1e3 * that.ws010105Data.resumePoint < result.end)
                  ? ((seekopetation = !1),
                    (seekopetationCounter = 0),
                    void that.setSkipUiHistory(result.index))
                  : (that.setSkipUiHistory(result.index),
                    that.skipUiHiddenChapter(result.end),
                    void this.setChapterSkip(result));
            }
            let res = that.showSkipUi(
              result.end,
              result.title,
              skipWaitTime / 1e3,
              result.index,
            );
            if (-1 === res) chapter_skip.ui = 3;
            else {
              if (9 === res) return void this.setChapterSkip(result);
              chapter_skip.ui = 1;
            }
            return void this.setChapterSkip(result);
          }
          if (1 === chapter_skip.ui) {
            if (0 === that.getSkipUiHistory(result.index))
              return ((chapter_skip.ui = 2), void this.setChapterSkip(result));
          } else if (3 === chapter_skip.ui) {
            if (!result.canSkipUIDisp)
              return (
                that.removeSkipUi(),
                (chapter_skip.ui = 2),
                void this.setChapterSkip(result)
              );
            if (2 === result.ui) {
              if (1 === that.getSkipUiHistory(result.index)) return;
              return 0 !== result.index && 0 === that.isShowController()
                ? void (chapter_skip.ui = 3)
                : (that.setSkipUiHistory(result.index),
                  that.skipUiHiddenChapter(result.end),
                  void that.setChapterSkip(result));
            }
            let res = that.showSkipUi(
              result.end,
              result.title,
              0,
              result.index,
            );
            return (
              (chapter_skip.ui = -1 === res ? 3 : 1),
              void this.setChapterSkip(result)
            );
          }
        } else {
          if (
            (that.removeSkipUi(),
            this.setChapterSkip(result),
            seekopetation && seekopetationCounter >= 1)
          )
            return ((seekopetation = !1), void (seekopetationCounter = 0));
          seekopetation && seekopetationCounter++;
        }
      },
      progress: function () {
        if (this.videoEl.buffered.length > 0) {
          var seekTime = this.videoEl.currentTime / this.videoEl.duration,
            buffer = this.videoEl.buffered,
            lastIdx = buffer.length - 1,
            buffStart = buffer.start(lastIdx) / this.videoEl.duration,
            buffEnd = buffer.end(lastIdx) / this.videoEl.duration;
          if (buffStart <= seekTime <= buffEnd) {
            var seek = buffEnd - buffStart + seekTime;
            (util.setStyle(
              this.bufferBarEl,
              "transform",
              "scaleX(" + seek + ")",
            ),
              util.setStyle(
                this.seekBackBarEl,
                "transform",
                "scaleX(" + (1 - seek) + ")",
              ));
          } else {
            var ratio =
              this.videoEl.buffered.end(this.videoEl.buffered.length - 1) /
              this.videoEl.duration;
            (util.setStyle(
              this.bufferBarEl,
              "transform",
              "scaleX(" + ratio + ")",
            ),
              util.setStyle(
                this.seekBackBarEl,
                "transform",
                "scaleX(" + (1 - ratio) + ")",
              ));
          }
        }
      },
      volumechange: function () {
        (this.videoEl.muted || 0 === this.videoEl.volume
          ? util.replaceClass(this.videoWrapperEl, /volume\-.*/, "volume-muted")
          : this.videoEl.volume <= 0.33
            ? util.replaceClass(this.videoWrapperEl, /volume\-.*/, "volume-low")
            : this.videoEl.volume <= 0.66
              ? util.replaceClass(
                  this.videoWrapperEl,
                  /volume\-.*/,
                  "volume-mid",
                )
              : util.replaceClass(
                  this.videoWrapperEl,
                  /volume\-.*/,
                  "volume-high",
                ),
          util.setStyle(
            this.volumeThumbTargetEl,
            "top",
            100 * (1 - this.videoEl.volume) + "%",
          ),
          util.setStyle(
            this.volumeBarEl,
            "height",
            100 * this.videoEl.volume + "%",
          ));
      },
    };
    for (eventType in videoHandlers)
      this[eventType + "Handler"] = videoHandlers[eventType];
    var ngImageList = [],
      ThumbImagePool = function (n) {
        for (this.pool = []; n-- > 0;) this.pool.push(new window.Image());
      };
    ThumbImagePool.prototype.load = function (url, success, error) {
      var pool = this.pool,
        img = pool.shift();
      (pool.push(img),
        (img.onload = img.onerror =
          function (e) {
            "load" === e.type && "function" == typeof success
              ? success()
              : "error" === e.type && "function" == typeof error && error();
            for (var i = 0, index = pool.indexOf(this); i <= index; i++) {
              var tmp = pool[i];
              ((tmp.onload = null), (tmp.onerror = null), (tmp.src = ""));
            }
          }),
        (img.src = url));
    };
    var thumbImagePool = new ThumbImagePool(5);
    ((this.touchStartCommonHidePopup = function () {
      (that.ButtonControl(!1), (touchEvFlg = 1));
    }),
      (this.recommendControlHide = function () {
        var recommendControl =
          document.getElementsByClassName("recommendControl")[0];
        const twitterIcon = document.querySelector(".c-afterWatchHeader__icon");
        (util.replaceClass(recommendControl, /show/, "hide"),
          util.replaceClass(twitterIcon, /show/, "hide"),
          util.removeClass(twitterIcon, "fadeshow"),
          util.removeClass(twitterIcon, "fadein"),
          util.hasClass(
            document.getElementsByClassName("controller")[0],
            "endController",
          ) &&
            (util.replaceClass(
              document.getElementsByClassName("controller")[0],
              /show/,
              "hide",
            ),
            util.removeClass(
              document.getElementsByClassName("controller")[0],
              "fadeshow",
            ),
            util.removeClass(
              document.getElementsByClassName("controller")[0],
              "fadein",
            )));
      }),
      (this.touchStartCommonShowController = function (event) {
        ((touchEvFlg = 1),
          that.stopControllerHiddenTimer(),
          event.stopPropagation());
      }),
      (this.touchEndCommonHidePopup = function () {
        playStatus >= 3
          ? (window.clearTimeout(that.popupHoverTimer),
            (that.popupHoverTimer = window.setTimeout(function () {
              (that.ButtonControl(!1), delete that.popupHoverTimer);
            }, 3e3)))
          : that.startControllerHiddenTimer();
      }),
      (this.saveSeekThumbPosition = function (event, pointType) {
        var touch = null;
        1 === pointType &&
          event.touches.length >= 1 &&
          (touch = event.touches[0]);
        var pageX = null === touch ? event.pageX : touch.pageX,
          clientX = null === touch ? event.clientX : touch.clientX,
          clientY = null === touch ? event.clientY : touch.clientY;
        ((that.seekThumbEl.dataset.left =
          clientX - that.seekThumbEl.getBoundingClientRect().left),
          (that.seekThumbEl.dataset.currentLeft =
            that.seekThumbEl.dataset.left),
          (that.seekThumbEl.dataset.x = pageX),
          (that.seekThumbEl.dataset.clientX = clientX),
          (that.seekThumbEl.dataset.clientY = clientY));
      }),
      (this.deleteSeekThumbPosition = function () {
        (delete that.seekThumbEl.dataset.currentLeft,
          delete that.seekThumbEl.dataset.left,
          delete that.seekThumbEl.dataset.x,
          delete that.seekThumbEl.dataset.clientX,
          delete that.seekThumbEl.dataset.clientY);
      }),
      (this.showHideSeekThumb = function (show) {
        if (show) {
          var ratio = this.videoEl.currentTime / this.videoEl.duration;
          (util.setStyle(that.seekThumbTargetEl, "left", 100 * ratio + "%"),
            util.setStyle(that.seekPopupEl, "opacity", 1),
            util.setStyle(that.seekThumbTargetEl, "opacity", 1));
        } else
          (util.setStyle(that.seekPopupEl, "opacity", 0),
            util.hasClass(that.videoWrapperEl, "seeking") ||
              util.setStyle(that.seekThumbTargetEl, "opacity", 0));
      }),
      (this.seekThumbTouchEnd = function (doSeek) {
        if (util.hasClass(that.videoWrapperEl, "seeking")) {
          var playerRect = document
            .getElementById("video")
            .getBoundingClientRect();
          if (
            doSeek &&
            that.seekThumbEl.dataset.clientX >= 0 &&
            that.seekThumbEl.dataset.clientX <= playerRect.width &&
            that.seekThumbEl.dataset.clientY >= 0 &&
            that.seekThumbEl.dataset.clientY <= playerRect.height
          ) {
            var seekPos =
              (that.videoEl.duration *
                parseInt(that.seekThumbEl.dataset.currentLeft, 10)) /
              that.seekThumbEl.clientWidth;
            that.seekSelected(seekPos);
          }
          (util.removeClass(that.videoWrapperEl, "seeking"),
            util.hasClass(that.videoWrapperEl, "seek-hover") &&
              util.removeClass(that.videoWrapperEl, "seek-hover"),
            that.showHideSeekThumb(!1),
            util.removeClass(that.videoWrapperEl, "controller-hover"),
            that.deleteSeekThumbPosition());
        }
        that.startControllerHiddenTimer();
      }),
      (this.volumeThumbStart = function (event, pointType) {
        var touch = null;
        1 === pointType &&
          event.touches.length >= 1 &&
          (touch = event.touches[0]);
        var pageY = null === touch ? event.pageY : touch.pageY,
          clientY = null === touch ? event.clientY : touch.clientY;
        (util.addClass(that.videoWrapperEl, "volumeChanging"),
          (that.volumeThumbEl.dataset.top =
            clientY - that.volumeThumbEl.getBoundingClientRect().top),
          (that.volumeThumbEl.dataset.currentTop =
            that.volumeThumbEl.dataset.top),
          (that.volumeThumbEl.dataset.y = pageY));
        var h = that.volumeThumbEl.clientHeight,
          y = that.volumeThumbEl.dataset.top;
        ((y = y < 0 ? 0 : y > h ? h : y),
          (that.volumeThumbEl.dataset.currentTop = y));
        var vol = parseInt(y, 10) / h,
          newVolume = 1 - (vol < 0 ? 0 : vol > 1 ? 1 : vol);
        (that.volume(newVolume), that.doMuted(0 === newVolume));
      }),
      (this.volumeThumbTouchEnd = function () {
        (window.setTimeout(function () {
          util.removeClass(that.videoWrapperEl, "volumeChanging");
        }, 100),
          delete that.volumeThumbEl.dataset.currentTop,
          delete that.volumeThumbEl.dataset.top,
          delete that.volumeThumbEl.dataset.y);
      }),
      (this.touchmoveEvent = function (event, pointType) {
        var touch = null;
        1 === pointType &&
          event.touches.length >= 1 &&
          (touch = event.touches[0]);
        var pageX = null === touch ? event.pageX : touch.pageX,
          pageY = null === touch ? event.pageY : touch.pageY,
          clientX = null === touch ? event.clientX : touch.clientX,
          clientY = null === touch ? event.clientY : touch.clientY;
        if (
          ((that.seekThumbEl.dataset.clientX = clientX),
          (that.seekThumbEl.dataset.clientY = clientY),
          (clientX = clientX < 0 ? 0 : clientX),
          (clientX =
            window.innerWidth < that.seekThumbEl.clientWidth &&
            clientX > window.innerWidth
              ? window.innerWidth
              : clientX > that.seekThumbEl.clientWidth
                ? that.seekThumbEl.clientWidth
                : clientX),
          util.hasClass(that.videoWrapperEl, "seeking") &&
            ((that.seekThumbEl.dataset.currentLeft =
              parseInt(that.seekThumbEl.dataset.left, 10) +
              pageX -
              that.seekThumbEl.dataset.x),
            util.setStyle(
              that.seekThumbTargetEl,
              "left",
              that.seekThumbEl.dataset.currentLeft + "px",
            )),
          util.hasClass(that.videoWrapperEl, "volumeChanging"))
        ) {
          var h = that.volumeThumbEl.clientHeight,
            y =
              parseInt(that.volumeThumbEl.dataset.top, 10) +
              pageY -
              that.volumeThumbEl.dataset.y;
          ((y = y < 0 ? 0 : y > h ? h : y),
            (that.volumeThumbEl.dataset.currentTop = y));
          var vol = parseInt(y, 10) / h,
            newVolume = 1 - (vol < 0 ? 0 : vol > 1 ? 1 : vol);
          (that.volume(newVolume), that.doMuted(0 === newVolume));
        }
        if (
          util.hasClass(that.videoWrapperEl, "seeking") ||
          util.hasClass(that.videoWrapperEl, "controller-hover")
        ) {
          var width = parseInt(
            that.seekPopupEl.dataset.width || that.seekPopupEl.clientWidth,
            10,
          );
          that.seekPopupEl.dataset.width = width;
          var left = clientX - that.seekThumbEl.getBoundingClientRect().left,
            percentX = (left / that.seekThumbEl.clientWidth) * 100;
          if (
            ((percentX = percentX > 100 ? 100 : percentX),
            util.hasClass(that.videoWrapperEl, "seek-hover"))
          ) {
            var sec = Math.floor((that.videoEl.duration * percentX) / 100) || 0,
              imgNum,
              img = ("00000" + (Math.floor(sec / 5) + 1)).slice(-5) + ".jpg";
            ((that.currentTimeEl.innerHTML = util.formatTime(sec)),
              ngImageList.indexOf(img) < 0 &&
                util.isParamExists(that.ws010105Data) &&
                util.isParamExists(that.ws010105Data.thumbnailUrl) &&
                thumbImagePool.load(
                  that.ws010105Data.thumbnailUrl +
                    that.ws010105Data.partId +
                    "_" +
                    img,
                  function () {
                    that.seekThumbnailEl.src =
                      that.ws010105Data.thumbnailUrl +
                      that.ws010105Data.partId +
                      "_" +
                      img;
                  },
                  function () {
                    (ngImageList.unshift(img),
                      (that.seekThumbnailEl.src = NO_IMAGE_URL));
                  },
                ));
          }
          var minEdge = 10,
            minLeft = width / 2,
            maxLeft = that.seekThumbEl.clientWidth - width / 2,
            maxEdge = that.seekThumbEl.clientWidth - 10,
            diff = 0;
          (left < 10
            ? ((diff = minLeft - 10), (left = 10))
            : left < minLeft
              ? (diff = minLeft - left)
              : left > maxEdge
                ? ((diff = maxLeft - maxEdge), (left = maxEdge))
                : left > maxLeft && (diff = maxLeft - left),
            util.setStyle(
              that.seekPopupInWrapEl,
              "transform",
              "translateX(" + diff + "px)",
            ),
            util.setStyle(that.seekPopupEl, "left", left + "px"));
        }
      }));
    var controllerHandlers = {
        this: {
          touchmove: function (e) {
            (that.resetPlayTimeAndCount(), that.touchmoveEvent(e, 1));
          },
          mousemove: function (e) {
            (that.resetPlayTimeAndCount(), that.touchmoveEvent(e, 0));
          },
          mouseup: function () {
            if (
              (that.resetPlayTimeAndCount(),
              util.hasClass(that.videoWrapperEl, "seeking"))
            ) {
              var seekPos =
                (that.videoEl.duration *
                  parseInt(that.seekThumbEl.dataset.currentLeft, 10)) /
                that.seekThumbEl.clientWidth;
              (util.removeClass(that.videoWrapperEl, "seeking"),
                that.deleteSeekThumbPosition());
              const isFinished = 4 === playStatus;
              if ((that.seekSelected(seekPos), isFinished)) {
                that.recommendControlHide();
                var informationArea =
                  document.getElementsByClassName("informationArea")[0];
                (util.replaceClass(informationArea, /show/, "hide"),
                  util.removeClass(informationArea, "fadeshow"),
                  util.removeClass(informationArea, "fadein"));
              }
            }
            util.hasClass(that.videoWrapperEl, "volumeChanging") &&
              that.volumeThumbTouchEnd();
          },
          contextmenu: function (e) {
            return (e.preventDefault(), !1);
          },
        },
        ".seekArea, .buttonArea": {
          touchstart: function () {
            that.touchStartCommonHidePopup();
          },
          pointerdown: function (event) {
            "touch" === event.pointerType && that.touchStartCommonHidePopup();
          },
          touchend: function () {
            that.touchEndCommonHidePopup();
          },
          touchcancel: function () {
            that.touchEndCommonHidePopup();
          },
          pointerup: function (event) {
            "touch" === event.pointerType && that.touchEndCommonHidePopup();
          },
          pointercancel: function (event) {
            "touch" === event.pointerType && that.touchEndCommonHidePopup();
          },
          mouseenter: function (event) {
            if (1 != touchEvFlg) {
              if (
                (util.hasClass(event.target, "seekArea") &&
                  util.addClass(that.videoWrapperEl, "seek-hover"),
                0 === that.isShowSkipUi())
              )
                return;
              (that.stopControllerHiddenTimer(),
                util.addClass(that.videoWrapperEl, "controller-hover"),
                window.clearTimeout(that.seekHoverTimer));
            }
          },
          mouseleave: function (event) {
            1 != touchEvFlg &&
              (util.hasClass(event.target, "seekArea") &&
                util.removeClass(that.videoWrapperEl, "seek-hover"),
              that.startControllerHiddenTimer(),
              window.clearTimeout(that.seekHoverTimer),
              (that.seekHoverTimer = window.setTimeout(function () {
                (util.removeClass(that.videoWrapperEl, "controller-hover"),
                  delete that.seekHoverTimer);
              }, 200)));
          },
        },
        "#settingPopup .popupIn": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          mouseleave: function () {
            util.removeClass(that.videoWrapperEl, "setting-after");
          },
          click: function () {
            var el = this.getElementsByClassName("open");
            if (el && el.length) {
              var listElement = el[0];
              (window.clearTimeout(listElement.dataset.noanimTimer),
                delete listElement.dataset.noanimTimer,
                util.removeClass(listElement, "noanim"),
                util.removeClass(listElement, "open"),
                util.removeClass(that.videoWrapperEl, "setting"),
                util.addClass(that.videoWrapperEl, "setting-after"));
            }
          },
        },
        "#settingPopup .popupIn .list": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          mouseenter: function () {
            util.removeClass(that.videoWrapperEl, "setting-after");
          },
          click: function (event) {
            var listElement = this;
            if (!util.hasClass(this, "open")) {
              var el = listElement.getElementsByClassName("toggleButton");
              (el && el.length
                ? "repeat" === el[0].id
                  ? that.repeatToggle()
                  : "continues" === el[0].id
                    ? that.continueToggle()
                    : "opskip" === el[0].id && that.opskipToggle()
                : (el = listElement.getElementsByClassName("selectButton")) &&
                  el.length &&
                  (util.addClass(listElement, "open"),
                  util.addClass(that.videoWrapperEl, "setting"),
                  (listElement.dataset.noanimTimer = window.setTimeout(
                    function () {
                      listElement.dataset.noanimTimer &&
                        (delete listElement.dataset.noanimTimer,
                        util.addClass(listElement, "noanim"));
                    },
                    350,
                  ))),
                event.stopPropagation());
            }
          },
        },
        "#settingPopup .popupIn .list .selectButton span": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function (event) {
            var targetElement = this,
              listElement = this.parentNode.parentNode.parentNode,
              settingId = this.parentNode.id,
              index =
                Array.prototype.slice
                  .call(listElement.getElementsByTagName("span"))
                  .indexOf(this) + 1,
              prefix = "pref-" + settingId + "-";
            (util.replaceClass(
              that.videoWrapperEl,
              new RegExp(prefix.replace(/-/gi, "\\-") + "\\d+", "gi"),
              prefix + index,
            ),
              window.setTimeout(function () {
                (window.clearTimeout(listElement.dataset.noanimTimer),
                  delete listElement.dataset.noanimTimer,
                  util.removeClass(listElement, "noanim"),
                  util.removeClass(listElement, "open"),
                  util.removeClass(that.videoWrapperEl, "setting"),
                  util.addClass(that.videoWrapperEl, "setting-after"));
              }, 30),
              event.stopPropagation());
          },
        },
        "#settingPopup .popupIn #settingSpeed .selectButton span": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function (event) {
            (that.playbackRate(this.dataset.value || 1),
              event.stopPropagation());
          },
        },
        "#settingPopup .popupIn #settingImageQuality .selectButton span": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function (event) {
            var videDateSet = Number(this.dataset.value);
            ((that.playVideoBitrate = VIDEO_BITRATE_INDEX.indexOf(videDateSet)),
              util.setCookie("video_bitrate", that.playVideoBitrate.toString()),
              that.isPlaying() && setAbrRange(),
              event.stopPropagation());
          },
        },
        "#settingPopup .popupIn #settingSoundQuality .selectButton span": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function (event) {
            var playDateSet = Number(this.dataset.value);
            ((that.playAudioBitrate = AUDIO_BITRATE_INDEX.indexOf(playDateSet)),
              util.setCookie("audio_bitrate", that.playAudioBitrate),
              that.isPlaying() && setAudioBitrate(),
              event.stopPropagation());
          },
        },
        button: {
          click: function (e) {
            var el = e.target;
            if (el.dataset.clickTimer) return (e.preventDefault(), !1);
            (util.addClass(el, "shadow"),
              (el.dataset.clickTimer = window.setTimeout(function () {
                (util.addClass(el, "fadeAnim"),
                  (el.dataset.clickTimer = window.setTimeout(function () {
                    (util.removeClass(el, "shadow"),
                      (el.dataset.clickTimer = window.setTimeout(function () {
                        (util.removeClass(el, "fadeAnim"),
                          delete el.dataset.clickTimer);
                      }, 100)));
                  }, 100)));
              }, 10)));
          },
        },
        ".backArea": {
          touchstart: function (e) {
            (that.touchStartCommonHidePopup(),
              e.touches &&
                e.touches.length >= 1 &&
                util.hasClass(that.videoWrapperEl, "controller-hidden") &&
                (that.startControllerHiddenTimer(),
                e.stopPropagation(),
                e.preventDefault()));
          },
          pointerdown: function (event) {
            "touch" === event.pointerType && that.touchStartCommonHidePopup();
          },
          mousemove: function (e) {
            ((e.clientX == that.lastMousePositionX &&
              e.clientY == that.lastMousePositionY) ||
              that.startControllerHiddenTimer(),
              (that.lastMousePositionX = e.clientX),
              (that.lastMousePositionY = e.clientY));
          },
          click: function () {
            that.isControllerEnabled() &&
              that.isPlaying() &&
              (that.startControllerHiddenTimer(), that.playToggle());
          },
        },
        ".seekThumb": {
          touchstart: function (e) {
            (that.touchStartCommonHidePopup(),
              that.recommendControlHide(),
              util.hasClass(that.videoWrapperEl, "seeking") ||
                (util.addClass(that.videoWrapperEl, "seeking"),
                util.addClass(that.videoWrapperEl, "seek-hover"),
                util.addClass(that.videoWrapperEl, "controller-hover"),
                that.showHideSeekThumb(!0),
                util.setStyle(
                  that.seekThumbTargetEl,
                  "left",
                  that.seekThumbEl.dataset.left + "px",
                ),
                that.saveSeekThumbPosition(e, 1),
                that.touchmoveEvent(e, 1)),
              that.touchStartCommonShowController(e));
          },
          touchend: function () {
            that.seekThumbTouchEnd(!0);
          },
          touchcancel: function () {
            that.seekThumbTouchEnd(!1);
          },
          pointerdown: function (e) {
            "touch" === e.pointerType &&
              (that.recommendControlHide(),
              that.touchStartCommonHidePopup(),
              util.hasClass(that.videoWrapperEl, "seeking") ||
                (util.addClass(that.videoWrapperEl, "seeking"),
                util.addClass(that.videoWrapperEl, "seek-hover"),
                util.addClass(that.videoWrapperEl, "controller-hover"),
                that.showHideSeekThumb(!0),
                that.touchmoveEvent(e, 0)),
              that.touchStartCommonShowController(e));
          },
          pointerup: function (e) {
            "touch" === e.pointerType &&
              (that.seekThumbTouchEnd(!0), e.preventDefault());
          },
          pointercancel: function (e) {
            "touch" === e.pointerType && that.seekThumbTouchEnd(!1);
          },
          mouseenter: function () {
            0 === touchEvFlg && that.showHideSeekThumb(!0);
          },
          mouseleave: function () {
            that.showHideSeekThumb(!1);
          },
          mousedown: function (e) {
            (util.addClass(that.videoWrapperEl, "seeking"),
              util.setStyle(
                that.seekThumbTargetEl,
                "left",
                that.seekThumbEl.dataset.left + "px",
              ),
              that.saveSeekThumbPosition(e, 0));
          },
        },
        ".volumeThumb": {
          touchstart: function (e) {
            (that.touchStartCommonShowController(e),
              that.volumeThumbStart(e, 1));
          },
          touchend: function () {
            that.volumeThumbTouchEnd();
          },
          touchcancel: function () {
            that.volumeThumbTouchEnd();
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          mousedown: function (e) {
            that.volumeThumbStart(e, 0);
          },
        },
        ".time": {
          click: function () {
            1 === Number(util.getCookie("time_format"))
              ? (util.setCookie("time_format", 0),
                (that.timeEl.innerHTML = util.formatTime(
                  Math.floor(that.videoEl.duration - that.videoEl.currentTime),
                )))
              : (util.setCookie("time_format", 1),
                (that.timeEl.innerHTML =
                  util.formatTime(Math.floor(that.videoEl.currentTime)) +
                  " / " +
                  util.formatTime(Math.floor(that.videoEl.duration))));
          },
        },
        ".playButton": {
          click: function () {
            (that.recommendControlHide(), that.playSelected());
          },
        },
        ".prevButton, #prevThumbinner": {
          touchstart: function (event) {
            !1 !== util.isParamExists(that.ws010105Data.prevContentInfoUri) &&
              (util.addClass(that.videoWrapperEl, "controller-hover"),
              that.ButtonControl(!0, "prevPopup", "-hover", !0),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (event) {
            if ("touch" === event.pointerType) {
              if (
                !1 === util.isParamExists(that.ws010105Data.prevContentInfoUri)
              )
                return;
              (that.ButtonControl(!0, "prevPopup", "-hover", !0),
                util.addClass(that.videoWrapperEl, "controller-hover"),
                that.touchStartCommonShowController(event));
            }
          },
          mouseenter: function (e) {
            0 === touchEvFlg &&
              "prevThumbinner" !== e.currentTarget.id &&
              (that.ButtonControl(!0, "prevPopup", "-hover", !0),
              (that.isPrevBtnOn = !0));
          },
          mouseleave: function (e) {
            if (0 === touchEvFlg && "prevThumbinner" !== e.currentTarget.id) {
              ((that.prevBtnStay = !1), (that.isPrevBtnOn = !1));
              var mousePositionX =
                  e.pageX ||
                  e.clientX +
                    (document.documentElement.scrollLeft ||
                      document.body.scrollLeft),
                mousePositionY =
                  e.pageY ||
                  e.clientY +
                    (document.documentElement.scrollTop ||
                      document.body.scrollTop),
                targetPosition = e.currentTarget.getBoundingClientRect(),
                prevBtnPopupInEl,
                prevBtnPopupInPosition = document
                  .getElementById("prevPopupIn")
                  .getBoundingClientRect(),
                prevBtnPopupInReTopEl,
                prevBtnPopupInReTopPosition = document
                  .getElementById("prevPopupInReTop")
                  .getBoundingClientRect(),
                mouseInPrevBtn =
                  mousePositionX > targetPosition.left &&
                  mousePositionX < targetPosition.left + targetPosition.width &&
                  mousePositionY > targetPosition.top &&
                  mousePositionY < targetPosition.top + targetPosition.height,
                mouseInPrevBtnPopupIn =
                  mousePositionX > prevBtnPopupInPosition.left &&
                  mousePositionX <
                    prevBtnPopupInPosition.left +
                      prevBtnPopupInPosition.width &&
                  mousePositionY > prevBtnPopupInPosition.top &&
                  mousePositionY <
                    prevBtnPopupInPosition.top + prevBtnPopupInPosition.height,
                mouseInPrevBtnPopupInReTop =
                  mousePositionX > prevBtnPopupInReTopPosition.left &&
                  mousePositionX <
                    prevBtnPopupInReTopPosition.left +
                      prevBtnPopupInReTopPosition.width &&
                  mousePositionY > prevBtnPopupInReTopPosition.top &&
                  mousePositionY <
                    prevBtnPopupInReTopPosition.top +
                      prevBtnPopupInReTopPosition.height;
              mouseInPrevBtnPopupIn ||
                mouseInPrevBtn ||
                mouseInPrevBtnPopupInReTop ||
                (that.ButtonControl(!1),
                that.delayPrevPopup &&
                  (clearTimeout(that.delayPrevPopup),
                  (that.delayPrevPopup = void 0)));
            }
          },
          click: function () {
            if (
              (that.recommendControlHide(),
              !1 === util.isParamExists(that.ws010105Data.prevContentInfoUri))
            )
              return ((that.prevBtnStay = !0), void that.jump(0));
            (util.removeClass(that.videoWrapperEl, "controller-hidden"),
              4 !== playStatus &&
                (that.updateResumePoint(2, that.videoEl.currentTime, 0),
                that.stopSendResumePointAlive()),
              that.prevBtnClickTouchEvent());
          },
        },
        ".buttonArea .mainButton #prevPopup #prevPopupIn, .buttonArea .mainButton #prevPopup #prevPopupInReTop":
          {
            mouseenter: function () {
              0 === touchEvFlg &&
                (that.ButtonControl(!0, "prevPopup", "-hover", !0),
                (that.isPrevBtnOn = !0));
            },
            mouseleave: function (e) {
              if (0 === touchEvFlg) {
                that.isPrevBtnOn = !1;
                var mousePositionX =
                    e.pageX ||
                    e.clientX +
                      (document.documentElement.scrollLeft ||
                        document.body.scrollLeft),
                  mousePositionY =
                    e.pageY ||
                    e.clientY +
                      (document.documentElement.scrollTop ||
                        document.body.scrollTop),
                  targetPosition = e.currentTarget.getBoundingClientRect(),
                  prevBtnEl,
                  prevBtnPosition = document
                    .getElementsByClassName("prevButton")[0]
                    .getBoundingClientRect(),
                  mouseInPrevBtnPopupIn =
                    mousePositionX > targetPosition.left &&
                    mousePositionX <
                      targetPosition.left + targetPosition.width &&
                    mousePositionY > targetPosition.top &&
                    mousePositionY < targetPosition.top + targetPosition.height,
                  mouseInPrevBtn =
                    mousePositionX > prevBtnPosition.left &&
                    mousePositionX <
                      prevBtnPosition.left + prevBtnPosition.width &&
                    mousePositionY > prevBtnPosition.top &&
                    mousePositionY <
                      prevBtnPosition.top + prevBtnPosition.height;
                mouseInPrevBtnPopupIn ||
                  mouseInPrevBtn ||
                  (that.ButtonControl(!1),
                  that.delayPrevPopup &&
                    (clearTimeout(that.delayPrevPopup),
                    (that.delayPrevPopup = void 0)));
              }
            },
          },
        ".backButton": {
          touchstart: function (event) {
            (that.ButtonControl(!0, "backPopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              (that.ButtonControl(!0, "backPopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(event));
          },
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "backPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
          click: function () {
            (that.recommendControlHide(),
              null !== player && that.seekSelected(player.currentTime - 30));
          },
        },
        ".back10Button": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function () {
            (that.recommendControlHide(),
              null !== player && that.seekSelected(player.currentTime - 10));
          },
        },
        ".back30Button": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function () {
            (that.recommendControlHide(),
              null !== player && that.seekSelected(player.currentTime - 30));
          },
        },
        ".buttonArea .mainButton #backPopup #backPopupIn": {
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "backPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".skipButton": {
          touchstart: function (event) {
            (that.ButtonControl(!0, "skipPopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (e) {
            "touch" === e.pointerType &&
              (that.ButtonControl(!0, "skipPopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(e));
          },
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "skipPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
          click: function () {
            4 !== playStatus && that.seek(30);
          },
        },
        ".skip10Button": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function () {
            4 === playStatus || that.seek(10);
          },
        },
        ".skip30Button": {
          touchstart: function (event) {
            that.touchStartCommonShowController(event);
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              that.touchStartCommonShowController(event);
          },
          click: function () {
            4 === playStatus || that.seek(30);
          },
        },
        ".buttonArea .mainButton #skipPopup #skipPopupIn": {
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "skipPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".nextButton, #nextThumbinner": {
          touchstart: function (event) {
            !1 !== util.isParamExists(that.ws010105Data.nextContentInfoUri) &&
              (util.addClass(that.videoWrapperEl, "controller-hover"),
              that.ButtonControl(!0, "nextPopup", "-hover"),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (event) {
            if ("touch" === event.pointerType) {
              if (
                !1 === util.isParamExists(that.ws010105Data.nextContentInfoUri)
              )
                return;
              (that.ButtonControl(!0, "nextPopup", "-hover"),
                util.addClass(that.videoWrapperEl, "controller-hover"),
                that.touchStartCommonShowController(event));
            }
          },
          mouseenter: function (e) {
            0 === touchEvFlg &&
              "nextThumbinner" !== e.currentTarget.id &&
              that.ButtonControl(!0, "nextPopup", "-hover");
          },
          mouseleave: function (e) {
            0 === touchEvFlg &&
              "nextThumbinner" !== e.currentTarget.id &&
              ((that.nextBtnStay = !1), that.ButtonControl(!1));
          },
          click: function () {
            (that.recommendControlHide(),
              !1 !== util.isParamExists(that.ws010105Data.nextContentInfoUri) &&
                (that.ButtonControl(!1),
                util.removeClass(that.videoWrapperEl, "controller-hidden"),
                util.addClass(that.videoWrapperEl, "disable-next"),
                4 !== playStatus &&
                  (that.updateResumePoint(2, that.videoEl.currentTime, 0),
                  that.stopSendResumePointAlive()),
                (that.nextBtnStay = !0),
                that.goNext()));
          },
        },
        ".buttonArea .mainButton #nextPopup #nextPopupIn": {
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "nextPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".volumeButton": {
          touchstart: function (event) {
            (util.addClass(that.videoWrapperEl, "controller-hover"),
              that.ButtonControl(!0, "volumePopup", "-hover"),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              (that.ButtonControl(!0, "volumePopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(event));
          },
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "volumePopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
          click: function () {
            that.muteToggle();
          },
        },
        ".buttonArea .mainButton #volumePopup #volumePopupIn": {
          mouseenter: function () {
            0 === touchEvFlg && that.ButtonControl(!0, "volumePopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".settingButton": {
          touchstart: function (event) {
            (util.addClass(that.videoWrapperEl, "controller-hover"),
              that.ButtonControl(!0, "settingPopup", "-hover"),
              that.touchStartCommonShowController(event));
          },
          pointerdown: function (event) {
            "touch" === event.pointerType &&
              (that.ButtonControl(!0, "settingPopup", "-hover"),
              util.addClass(that.videoWrapperEl, "controller-hover"),
              that.touchStartCommonShowController(event));
          },
          mouseenter: function () {
            0 === touchEvFlg &&
              that.ButtonControl(!0, "settingPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".buttonArea .mainButton #settingPopup #settingPopupIn": {
          mouseenter: function () {
            0 === touchEvFlg &&
              that.ButtonControl(!0, "settingPopup", "-hover");
          },
          mouseleave: function () {
            0 === touchEvFlg && that.ButtonControl(!1);
          },
        },
        ".fullscreenButton": {
          click: function () {
            that.fullscreenToggle();
          },
        },
      },
      el = document.querySelectorAll(selector);
    if (el && el.length) {
      this.videoEl = el[0];
      var controllerEl = document.createElement("div");
      controllerEl &&
        ((controllerEl.className = "controller"),
        (controllerEl.innerHTML = VIDEO_CONTROLLER_DOM),
        (this.controllerEl = controllerEl));
      var skipUiEl = document.createElement("div");
      skipUiEl &&
        ((skipUiEl.className = "skipUi"),
        (skipUiEl.innerHTML = SKIP_UI_DOM),
        (this.skipUiEl = skipUiEl));
      var videoWrapperEl = document.createElement("div");
      if (videoWrapperEl) {
        videoWrapperEl.className = "videoWrapper";
        const headerArea = document.createElement("div");
        ((headerArea.className = "c-afterWatchHeader isHasMaxWidth"),
          util.append(videoWrapperEl, headerArea));
        const twitterArea = document.createElement("div");
        ((twitterArea.className =
          "c-afterWatchHeader__icon isOnlyBrowser hide"),
          util.append(headerArea, twitterArea));
        const twitterBlock = document.createElement("div");
        ((twitterBlock.className = "p-snsBlock isAfterWatch"),
          util.append(twitterArea, twitterBlock));
        const twitterButton = document.createElement("a");
        ((twitterButton.id = "twitter"),
          twitterButton.setAttribute("target", "_blank"),
          (twitterButton.className = "c-snsButton isTwitter"),
          util.append(twitterBlock, twitterButton));
        const twitterIcon = document.createElement("i");
        util.append(twitterButton, twitterIcon);
        var recommendControlEl = document.createElement("div");
        (recommendControlEl &&
          ((recommendControlEl.className = "recommendControl"),
          (recommendControlEl.id = "recommendControl"),
          (recommendControlEl.innerHTML = "おすすめを閉じる"),
          (recommendControlEl.hidden = !0),
          util.append(headerArea, recommendControlEl)),
          (this.videoWrapperEl = videoWrapperEl),
          util.wrap(this.videoEl, this.videoWrapperEl),
          util.append(videoWrapperEl, controllerEl),
          util.append(videoWrapperEl, skipUiEl),
          this.videoWrapperEl.classList.add(
            "skipui-hidden",
            "controller-hidden",
          ),
          (this.skipUi = new SkipUI(this.skipUiEl, this)));
      }
      var loadingEl = document.createElement("div");
      (loadingEl &&
        ((loadingEl.className = "waitArea"),
        (loadingEl.innerHTML = VIDEO_LOADING_DOM),
        util.append(videoWrapperEl, loadingEl)),
        (this.seekBarEl = document.getElementById("seekBar")),
        (this.bufferBarEl = document.getElementById("bufferBar")),
        (this.seekBackBarEl = document.getElementById("seekBackBar")),
        (this.seekThumbEl = document.getElementById("seekThumb")),
        (this.seekThumbTargetEl = document.getElementById("seekThumbTarget")),
        (this.seekPopupEl = document.getElementById("seekPopup")),
        (this.seekPopupInWrapEl = document.getElementById("seekPopupInWrap")),
        (this.timeEl = document.getElementById("time")),
        (this.currentTimeEl = document.getElementById("currentTime")),
        (this.seekThumbnailEl = document.getElementById("seekThumbnail")),
        (this.volumeBarEl = document.getElementById("volumeBar")),
        (this.volumeThumbEl = document.getElementById("volumeThumb")),
        (this.volumeThumbTargetEl =
          document.getElementById("volumeThumbTarget")),
        (this.pauseInfoEl = document.getElementById("pauseInfo")));
      var makeCallbackHandler = function (target) {
          return function (event) {
            var callback =
              target[
                event.type.replace(VENDOR_PREFIX, "").toLowerCase() + "Handler"
              ];
            if ("function" == typeof callback)
              return callback.call(that, event);
          };
        },
        windowCallbackHandler = makeCallbackHandler(window);
      WINDOW_EVENT_LIST.forEach(function (item) {
        window.addEventListener(item, windowCallbackHandler, !1);
      });
      var documentCallbackHandler = makeCallbackHandler(document);
      DOCUMENT_EVENT_LIST.forEach(function (item) {
        window.addEventListener(item, documentCallbackHandler, !1);
      });
      var videoCallbackHandler = makeCallbackHandler(that);
      for (var targetSelector in (VIDEO_EVENT_LIST.forEach(function (item) {
        that.videoEl.addEventListener(item, videoCallbackHandler, !1);
      }),
      controllerHandlers)) {
        var element = that.controllerEl,
          els = [];
        "this" !== targetSelector
          ? (els = element.querySelectorAll(targetSelector))
          : els.push(element);
        for (var i = 0, len = els.length; i < len; i++)
          for (var eventName in ((element = els[i]),
          controllerHandlers[targetSelector]))
            element.addEventListener(
              eventName,
              controllerHandlers[targetSelector][eventName],
              !1,
            );
      }
      ((document.exitFullscreen =
        document.webkitCancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen ||
        document.cancelFullScreen ||
        document.exitFullscreen),
        document.body.requestFullscreen
          ? (document.body.requestFullscreen = document.body.requestFullscreen)
          : document.body.msRequestFullscreen
            ? (document.body.requestFullscreen =
                document.body.msRequestFullscreen)
            : document.body.mozRequestFullScreen
              ? (document.body.requestFullscreen =
                  that.videoWrapperEl.mozRequestFullScreen)
              : document.body.webkitRequestFullscreen &&
                (document.body.requestFullscreen =
                  document.body.webkitRequestFullscreen),
        util.changeClass(
          this.videoWrapperEl,
          "disable-fullscreen",
          !document.body.requestFullscreen,
        ));
      var lastMuted =
        "" === util.getCookie(COOKIE_MUTE)
          ? 0
          : Number(util.getCookie(COOKIE_MUTE));
      1 === lastMuted
        ? (this.volume(
            "" === util.getCookie(COOKIE_VOLUME)
              ? 0.5
              : Number(util.getCookie(COOKIE_VOLUME)),
          ),
          that.doMuted(lastMuted))
        : this.volume(
            "" === util.getCookie(COOKIE_VOLUME)
              ? 0.5
              : Number(util.getCookie(COOKIE_VOLUME)),
          );
      var opskipSetting = util.getCookie("op_skip");
      ("" === opskipSetting && util.setCookie("op_skip", 0),
        (opskipSetting = Number(util.getCookie("op_skip"))),
        util.replaceClass(
          that.videoWrapperEl,
          /pref\-opskip\-.*/,
          "pref-opskip-" + (1 === opskipSetting ? "on" : "off"),
        ));
      var continueSetting = util.getCookie("continuous_play");
      ("" === continueSetting && util.setCookie("continuous_play", 1),
        (continueSetting = Number(util.getCookie("continuous_play"))),
        util.replaceClass(
          that.videoWrapperEl,
          /pref\-continues\-.*/,
          "pref-continues-" + (1 === continueSetting ? "on" : "off"),
        ));
      var repeatSetting = util.getCookie("repeat_play");
      ("" === repeatSetting && util.setCookie("repeat_play", 0),
        (repeatSetting = Number(util.getCookie("repeat_play"))),
        util.replaceClass(
          that.videoWrapperEl,
          /pref\-repeat\-.*/,
          "pref-repeat-" + (1 === repeatSetting ? "on" : "off"),
        ),
        "" === util.getCookie("time_format") &&
          util.setCookie("time_format", 0),
        (this.playType = 0),
        that.initContentsInfo(),
        (that.tmpResumePoint = 0),
        (that.prevBandwidthInfo = null),
        (that.playVideoBitrate = Number(util.getCookie("video_bitrate")) || 4),
        (that.playAudioBitrate = Number(util.getCookie("audio_bitrate")) || 0),
        (that.lastMousePositionX = 0),
        (that.lastMousePositionY = 0),
        (that.playCheck = {
          userOperateTime: Date.now(),
          playEndTime: -1,
          playCount: 0,
        }),
        this.loadVideo());
    }
    function createPlayer() {
      util.addClass(that.videoWrapperEl, "controller-hidden");
      var customData = that.ws010105Data.oneTimeKey,
        params = {
          video: that.videoEl,
          url: that.ws010105Data.castContentUri,
          drm: {
            playready: { url: that.ws010105Data.laUrl, customData: customData },
            widevine: { url: that.ws010105Data.laUrl, customData: customData },
          },
          abrOptions: { defaultVideoBandwidth: 5e6 },
          maxBufferTime: 180,
          enableSidxSeek: !1,
        };
      if (
        ("08" === that.ws010105Data.appType
          ? (delete params.drm.widevine,
            (params.drm.playready.preferedEmbeddingCustomData = !0))
          : delete params.drm.playready,
        null !== that.prevBandwidthInfo &&
          (delete params.abrOptions,
          (params.bandwidthInfo = that.prevBandwidthInfo)),
        null !== (player = INIDash.createPlayer(params)))
      ) {
        var errorCount = 0,
          playerHandlers = {
            error: function (error) {
              var code = error.code,
                ErrMsg =
                  ":message - " + error.message + ", detail - " + error.detail;
              6 !== playStatus &&
                that.EndByErrorAfterPlayStart(
                  "2" + code,
                  ErrMsg,
                  INIPLAYER_ERROR_MSG_MAP[code] || "動画再生に失敗しました",
                );
            },
            networkErrorChange: function () {
              var source, message, code;
              (player.networkError
                ? player.networkError.timeout ||
                  0 === player.networkError.responseStatus ||
                  ("drm" === player.networkError.source
                    ? ((source = "drm"),
                      (code = "3002"),
                      (message = "Network Error(drm)"))
                    : "manifest" === player.networkError.source
                      ? ((source = "network"),
                        (code = "2001"),
                        (message = "Network Error(manifest)"))
                      : ++errorCount > 3 &&
                        ((source = "network"),
                        (code = "2001"),
                        (message = "Network Error(unknown)")))
                : (errorCount = 0),
                source &&
                  code &&
                  that.EndByErrorAfterPlayStart(
                    "2" + code,
                    ":" + message,
                    INIPLAYER_ERROR_MSG_MAP[code] || "動画再生に失敗しました",
                  ));
            },
            hdcpRestrictedChange: function () {
              if (player.hdcpRestricted) {
                var code = "3005",
                  message = "HDCP Error";
                that.EndByErrorAfterPlayStart(
                  "23005",
                  ":" + message,
                  INIPLAYER_ERROR_MSG_MAP[code] || "動画再生に失敗しました",
                );
              }
            },
            bufferingChange: function () {
              player.buffering
                ? util.addClass(that.videoWrapperEl, "loading")
                : util.removeClass(that.videoWrapperEl, "loading");
            },
            loadedManifest: function () {
              setAbrRange();
              var audio128 = !1,
                audio192 = !1,
                tracks = player.audioTracks;
              if (tracks)
                for (
                  var track, representations, rep, bandwidth, k = 0;
                  k < tracks.length;
                  ++k
                )
                  if ((representations = (track = tracks[k]).representations))
                    for (var j = 0; j < representations.length; ++j)
                      ((rep = representations[j]),
                        (bandwidth = parseInt(rep.bandwidth)) >= 128e3 &&
                        bandwidth < 192e3
                          ? (audio128 = !0)
                          : bandwidth >= 192e3 && (audio192 = !0));
              var audioBtId = "disable-audio128";
              if (
                (audio128
                  ? util.hasClass(that.videoWrapperEl, audioBtId) &&
                    util.removeClass(that.videoWrapperEl, audioBtId)
                  : util.addClass(that.videoWrapperEl, audioBtId),
                (audioBtId = "disable-audio192"),
                audio192
                  ? util.hasClass(that.videoWrapperEl, audioBtId) &&
                    util.removeClass(that.videoWrapperEl, audioBtId)
                  : util.addClass(that.videoWrapperEl, audioBtId),
                (that.playAudioBitrate =
                  Number(util.getCookie("audio_bitrate")) || 0),
                1 !== that.playAudioBitrate ||
                  audio192 ||
                  (that.playAudioBitrate = 0),
                0 === that.playAudioBitrate && !audio128)
              )
                return (
                  (playStatus = 6),
                  void that.EndByErrorAfterPlayStart(
                    "40004",
                    ":No 128Kbps audio bitrate exists. Contents may have some problem.",
                    "動画再生に失敗しました",
                  )
                );
              setAudioBitrate();
            },
            loadedMetadata: function () {
              "RESUME" === that.ws010105Data.startStatus &&
                ((player.currentTime = that.ws010105Data.resumePoint),
                (that.ws010105Data.startStatus = "TOP"));
              var PLAYBACK_SPEED_INDEX = [null, 0.5, 0.75, 1, 1.25, 1.5, 2],
                playbackSpd = Number(util.getCookie("play_speed")) || 1,
                prefix = "pref-speed-",
                index = PLAYBACK_SPEED_INDEX.indexOf(playbackSpd);
              (that.playbackRate(playbackSpd),
                util.replaceClass(
                  that.videoWrapperEl,
                  new RegExp(prefix.replace(/-/gi, "\\-") + "\\d+", "gi"),
                  prefix + index,
                ));
            },
            destroyed: function (prevPlayer) {
              ((that.playerDestroyed = !0),
                (that.prevBandwidthInfo = prevPlayer.bandwidthInfo));
            },
            ready: function () {
              (that.clearSkipUiHistory(),
                util.addClass(that.videoWrapperEl, "controller-hidden"),
                (playStatus = 2),
                playCount++,
                util.addClass(that.videoWrapperEl, "inited"),
                util.removeClass(that.videoWrapperEl, "loading-ui"),
                util.removeClass(that.videoWrapperEl, "disable-button"));
              var endController =
                document.getElementsByClassName("controller")[0];
              util.replaceClass(endController, /hide/, "show");
              var userAgent = window.navigator.userAgent;
              ((userAgent.indexOf("MSIE") > -1 ||
                userAgent.indexOf("Trident/") > -1 ||
                userAgent.indexOf("Edge/") > -1) &&
                (that.prevBtnStay &&
                  ((that.prevBtnStay = !1), that.prevPlay3SecJudge("-hover")),
                that.nextBtnStay &&
                  ((that.nextBtnStay = !1),
                  that.ButtonControl(!0, "nextPopup", "-hover"))),
                that.sendResumePointAlive());
            },
          };
        for (eventType in playerHandlers)
          player.addListener(eventType, playerHandlers[eventType], !1);
      } else
        that.EndByErrorAfterPlayStart(
          "40002",
          ":CreatePlayer failed.",
          "動画再生に失敗しました",
        );
    }
    function initParams() {
      ((that.resumeSendAliveTimerId = null),
        (that.resumeNumber = 0),
        (that.saveCurrentTime = -1),
        (that.sentPauseResumeTimerId = null),
        that.initKeyDown(),
        document
          .getElementById("facebook")
          .removeEventListener("click", facebookWindow, !1));
    }
    function addDefaultPlayParam(url) {
      var defaultPlayVideoBitrate, restApiUrl;
      return (
        url +
        "&defaultPlay=" +
        (defaultPlayVideoBitrate =
          null == util.getCookie("video_bitrate") ||
          "" == util.getCookie("video_bitrate")
            ? 5
            : Number(util.getCookie("video_bitrate")) + 1)
      );
    }
    function destroyPlayer() {
      (that.delayPrevPopup &&
        (clearTimeout(that.delayPrevPopup), (that.delayPrevPopup = void 0)),
        (playStatus = 0));
      var prevPopupInEl = document.getElementById("prevPopupIn"),
        prevPopupInReTopEl = document.getElementById("prevPopupInReTop");
      if (
        (util.replaceClass(prevPopupInEl, /show/, "hide"),
        util.replaceClass(prevPopupInReTopEl, /show/, "hide"),
        util.addClass(that.videoWrapperEl, "disable-button"),
        null !== player)
      ) {
        ((that.playerDestroyed = !1), player.destroy());
        var destroyCheck = setInterval(function () {
          !0 === that.playerDestroyed &&
            (clearInterval(destroyCheck), (player = null), initialize());
        }, 100);
      } else initialize();
    }
    function initialize() {
      (initParams(),
        that.rewriteHistory(),
        WS010105(addDefaultPlayParam(restApiUrl)));
    }
    function initializeSub1st(result) {
      if (0 !== result) return 1;
      (initWaitingInfo(),
        "TOP" === that.ws010105Data.startStatus &&
          (that.ws010105Data.resumePoint = 0),
        that.updateResumePoint(0, that.ws010105Data.resumePoint, 3),
        (playStatus = 1),
        "09" === that.ws010105Data.appType
          ? reqApiServ()
          : (createPlayer(), null !== player && player.play()));
    }
    function initializeSub(result, messageText) {
      if (0 !== result) {
        var boxMsg = "",
          errId = "0";
        if ("0001" === result || "0007" === result) return 1;
        for (var i = 0; i < APISERVER_ERROR_MAP.length; ++i)
          if (parseInt(result) === APISERVER_ERROR_MAP[i][0]) {
            ((errId = APISERVER_ERROR_MAP[i][1]),
              (boxMsg = APISERVER_ERROR_MAP[i][2]));
            break;
          }
        return (
          "0" === errId &&
            ((errId = "3" + ("0000" + result).slice(-4)),
            (boxMsg = "動画再生に失敗しました")),
          util.isParamExists(messageText) ||
            (messageText = "No Error Message from API server."),
          that.EndByErrorAfterSendResumeStart(errId, messageText, boxMsg),
          1
        );
      }
      (createPlayer(), null !== player && player.play());
    }
    function initWaitingInfo() {
      (that.resetView(),
        util.removeClass(that.videoWrapperEl, "disable-skip"),
        !0 === util.isParamExists(that.ws010105Data.nextContentInfoUri)
          ? (util.removeClass(that.videoWrapperEl, "disable-next"),
            (document.getElementById("nextThumbnail").src =
              that.ws010105Data.nextMainScenePath),
            (document.getElementById("nextTitle").innerHTML =
              that.ws010105Data.nextPartDispNumber +
              " " +
              that.ws010105Data.nextPartTitle))
          : util.addClass(that.videoWrapperEl, "disable-next"));
      for (
        var recMyList = document.querySelectorAll(".recomPos label"),
          link1 = 0,
          l = recMyList.length;
        l > link1;
        link1++
      )
        recMyList[link1].removeEventListener(
          "click",
          function () {
            updateMind(this);
          },
          !1,
        );
      for (
        var recLink = document.getElementsByClassName("mainImg"),
          link2 = 0,
          l = recLink.length;
        l > link2;
        link2++
      )
        recLink[link2].removeEventListener(
          "click",
          function () {
            recommendSearch(this);
          },
          !1,
        );
      for (
        var recLink2 = document.getElementsByClassName("mainTitle"),
          link3 = 0,
          l = recLink2.length;
        l > link3;
        link3++
      )
        recLink2[link3].removeEventListener(
          "click",
          function () {
            recommendSearch(this);
          },
          !1,
        );
      if (3 !== that.playType) {
        var backThumb = document.getElementById("backThumb");
        if (backThumb) {
          var img = new window.Image();
          ((img.onload = function () {
            (util.setStyle(
              backThumb,
              "background-image",
              "url(" + that.ws010105Data.mainScenePath + ")",
            ),
              util.addClass(backThumb, "loaded"),
              -1 !== navigator.userAgent.indexOf("Edge") &&
                util.addClass(backThumb, "noblur"));
          }),
            (img.src = that.ws010105Data.mainScenePath));
        }
        var backInfo = document.getElementById("backInfo");
        if (backInfo) {
          var backInfoTxt1 = backInfo.getElementsByClassName("backInfoTxt1");
          backInfoTxt1 &&
            backInfoTxt1.length &&
            (backInfoTxt1[0].innerHTML = that.ws010105Data.workTitle);
          var backInfoTxt2 = backInfo.getElementsByClassName("backInfoTxt2");
          backInfoTxt2 &&
            backInfoTxt2.length &&
            (backInfoTxt2[0].innerHTML = that.ws010105Data.partDispNumber);
          var backInfoTxt3 = backInfo.getElementsByClassName("backInfoTxt3");
          backInfoTxt3 &&
            backInfoTxt3.length &&
            (backInfoTxt3[0].innerHTML = that.ws010105Data.partTitle);
          var backInfoTxt4 = backInfo.getElementsByClassName("backInfoTxt4");
          (backInfoTxt4 &&
            backInfoTxt4.length &&
            (util.isParamExists(that.ws010105Data.partExp)
              ? (backInfoTxt4[0].innerHTML = that.ws010105Data.partExp)
              : (backInfoTxt4[0].innerHTML = " ")),
            util.addClass(backInfo, "loaded"));
        }
      }
      var pauseInfo = document.getElementById("pauseInfo");
      if (pauseInfo) {
        var pauseInfoTxt1 = pauseInfo.getElementsByClassName("pauseInfoTxt1");
        pauseInfoTxt1 &&
          pauseInfoTxt1.length &&
          (pauseInfoTxt1[0].innerHTML = that.ws010105Data.workTitle);
        var pauseInfoTxt2 = pauseInfo.getElementsByClassName("pauseInfoTxt2");
        pauseInfoTxt2 &&
          pauseInfoTxt2.length &&
          (pauseInfoTxt2[0].innerHTML = that.ws010105Data.partDispNumber);
        var pauseInfoTxt3 = pauseInfo.getElementsByClassName("pauseInfoTxt3");
        pauseInfoTxt3 &&
          pauseInfoTxt3.length &&
          (pauseInfoTxt3[0].innerHTML = that.ws010105Data.partTitle);
      }
      that.seekPopupEl.dataset.width = parseInt(
        that.seekPopupEl.clientWidth,
        10,
      );
      for (
        var seekPopupInWrap = document.getElementById("seekPopupInWrap");
        seekPopupInWrap.hasChildNodes();
      )
        seekPopupInWrap.removeChild(seekPopupInWrap.firstChild);
      var ThumbEl = document.createElement("div");
      ThumbEl.innerHTML =
        "<img id='seekThumbnail' class='seekThumbnail' src='/img/img_scene_nodata.jpg'>";
      var TimeEl = document.createElement("div");
      if (
        ((TimeEl.innerHTML = "<div id='currentTime'>00:00</div>"),
        util.isParamExists(that.ws010105Data) &&
        util.isParamExists(that.ws010105Data.thumbnailUrl)
          ? (util.append(seekPopupInWrap, ThumbEl),
            util.append(seekPopupInWrap, TimeEl),
            (that.seekThumbnailEl = document.getElementById("seekThumbnail")),
            (that.currentTimeEl = document.getElementById("currentTime")))
          : (util.append(seekPopupInWrap, TimeEl),
            (that.currentTimeEl = document.getElementById("currentTime"))),
        util.isParamExists(that.ws010105Data.afterJoinPromotionBannerUrl))
      ) {
        var request = new XMLHttpRequest();
        (request.open("GET", that.ws010105Data.afterJoinPromotionBannerUrl, !0),
          (request.timeout = 2e3),
          (request.onload = function () {
            if (4 === request.readyState && 200 === request.status)
              if (util.isParamExists(request.responseText)) {
                var promoHTML,
                  separateScripts,
                  separated = (function (src) {
                    var outerDiv = document.createElement("div");
                    outerDiv.innerHTML = src;
                    for (
                      var myScriptElements = [],
                        el,
                        attName,
                        attVal,
                        scriptElements =
                          outerDiv.getElementsByTagName("script");
                      scriptElements.length > 0;
                    ) {
                      (el = document.createElement("script")).innerHTML =
                        scriptElements[0].innerHTML;
                      for (
                        var j = 0;
                        j < scriptElements[0].attributes.length;
                        j++
                      )
                        ((attName = scriptElements[0].attributes[j].name),
                          (attVal = scriptElements[0].attributes[j].value),
                          el.setAttribute(attName, attVal));
                      (myScriptElements.push(el),
                        (el = null),
                        outerDiv.removeChild(scriptElements[0]));
                    }
                    return {
                      scriptElements: myScriptElements,
                      contentWithoutScript: outerDiv.innerHTML,
                    };
                  })(request.responseText),
                  promotionInfo = document.getElementById("promotionInfo");
                promotionInfo.innerHTML = separated.contentWithoutScript;
                for (var i = 0; i < separated.scriptElements.length; i++)
                  promotionInfo.appendChild(separated.scriptElements[i]);
              } else that.ws010105Data.afterJoinPromotionBannerUrl = null;
            else that.ws010105Data.afterJoinPromotionBannerUrl = null;
          }),
          (request.ontimeout = function () {
            that.ws010105Data.afterJoinPromotionBannerUrl = null;
          }),
          (request.onerror = function () {
            that.ws010105Data.afterJoinPromotionBannerUrl = null;
          }),
          request.send(null));
      }
    }
    function setAbrRange() {
      var videoNormal = !1,
        videoGood = !1,
        videoHigh = !1,
        videoHD = !1,
        videoFullHD = !1,
        videoNormalIndex,
        videoGoodIndex,
        videoHighIndex,
        videoHDIndex,
        videoFullHDIndex,
        endIndex = videoFullHDIndex,
        demonstration =
          player.videoTracks &&
          player.videoTracks[player.currentVideoTrackIndex] &&
          player.videoTracks[player.currentVideoTrackIndex].representations;
      if (demonstration) {
        var dem;
        endIndex = demonstration.length - 1;
        for (var i = 0; i < demonstration.length; ++i) {
          dem = demonstration[i];
          var frequency = parseInt(dem.bandwidth);
          frequency >= 5e5 && frequency < 85e4
            ? ((videoNormal = !0), (videoNormalIndex = i))
            : frequency >= 85e4 && frequency < 15e5
              ? ((videoGood = !0), (videoGoodIndex = i))
              : frequency >= 15e5 && frequency < 25e5
                ? ((videoHigh = !0), (videoHighIndex = i))
                : frequency >= 25e5 && frequency < 35e5
                  ? ((videoHD = !0), (videoHDIndex = i))
                  : frequency >= 35e5 &&
                    ((videoFullHD = !0), (videoFullHDIndex = i));
        }
      }
      var highest = that.ws010105Data.contentUrls.highest,
        high = that.ws010105Data.contentUrls.high,
        middle = that.ws010105Data.contentUrls.middle,
        low = that.ws010105Data.contentUrls.low,
        lowest = that.ws010105Data.contentUrls.lowest,
        videoBtId = "disable-normal";
      if (
        (util.isParamExists(lowest)
          ? util.hasClass(that.videoWrapperEl, videoBtId) &&
            util.removeClass(that.videoWrapperEl, videoBtId)
          : util.addClass(that.videoWrapperEl, videoBtId),
        (videoBtId = "disable-good"),
        util.isParamExists(low)
          ? util.hasClass(that.videoWrapperEl, videoBtId) &&
            util.removeClass(that.videoWrapperEl, videoBtId)
          : util.addClass(that.videoWrapperEl, videoBtId),
        (videoBtId = "disable-high"),
        util.isParamExists(middle)
          ? util.hasClass(that.videoWrapperEl, videoBtId) &&
            util.removeClass(that.videoWrapperEl, videoBtId)
          : util.addClass(that.videoWrapperEl, videoBtId),
        (videoBtId = "disable-hd"),
        util.isParamExists(high)
          ? util.hasClass(that.videoWrapperEl, videoBtId) &&
            util.removeClass(that.videoWrapperEl, videoBtId)
          : util.addClass(that.videoWrapperEl, videoBtId),
        (videoBtId = "disable-fullhd"),
        util.isParamExists(highest)
          ? util.hasClass(that.videoWrapperEl, videoBtId) &&
            util.removeClass(that.videoWrapperEl, videoBtId)
          : util.addClass(that.videoWrapperEl, videoBtId),
        (that.playVideoBitrate = Number(util.getCookie("video_bitrate") || 4)),
        4 === that.playVideoBitrate &&
          (videoFullHD
            ? (endIndex = videoFullHDIndex)
            : ((that.playVideoBitrate = 3), (endIndex = videoHDIndex))),
        3 === that.playVideoBitrate &&
          (videoHD
            ? (endIndex = videoHDIndex)
            : ((that.playVideoBitrate = 2), (endIndex = videoHighIndex))),
        2 === that.playVideoBitrate &&
          (videoHigh
            ? (endIndex = videoHighIndex)
            : ((that.playVideoBitrate = 1), (endIndex = videoGoodIndex))),
        1 === that.playVideoBitrate &&
          (videoGood
            ? (endIndex = videoGoodIndex)
            : ((that.playVideoBitrate = 0), (endIndex = videoNormalIndex))),
        0 === that.playVideoBitrate)
      ) {
        if (!videoNormal)
          return (
            (playStatus = 6),
            void that.EndByErrorAfterPlayStart(
              "40003",
              ":No Normal video bitrate exists. Contents may have some problem.",
              "動画再生に失敗しました",
            )
          );
        endIndex = videoNormalIndex;
      }
      for (
        var enabledVideoRepresentationIndexesArray = [], i = 0;
        i < endIndex + 1;
        ++i
      )
        enabledVideoRepresentationIndexesArray.push(i);
      player.setEnabledVideoRepresentationIndexes(
        enabledVideoRepresentationIndexesArray,
        !0,
      );
      var prefix = "pref-imageQuality-",
        index = VIDEO_BITRATE_INDEX.indexOf(that.playVideoBitrate);
      (index++,
        util.replaceClass(
          that.videoWrapperEl,
          new RegExp(prefix.replace(/-/gi, "\\-") + "\\d+", "gi"),
          prefix + index,
        ),
        player.flush());
    }
    function setAudioBitrate() {
      var tracks = player.audioTracks;
      if (tracks)
        for (
          var track, representations, rep, bandwidth, i = 0;
          i < tracks.length;
          ++i
        )
          if ((rep = (track = tracks[i]).representations[0])) {
            if (
              (bandwidth = parseInt(rep.bandwidth)) >= 128e3 &&
              bandwidth < 192e3 &&
              0 === that.playAudioBitrate
            ) {
              if (
                ((player.currentAudioTrackIndex = i),
                !(
                  player.audioTracks[player.currentAudioTrackIndex]
                    .representations.length >= 1
                ))
              )
                return (
                  (playStatus = 6),
                  void that.EndByErrorAfterPlayStart(
                    "40004",
                    ":128KB audioTracks has problem. currentAudioTrackIndex = " +
                      player.currentAudioTrackIndex +
                      ", representations.length = " +
                      player.audioTracks[player.currentAudioTrackIndex]
                        .representations.length,
                    "動画再生に失敗しました",
                  )
                );
              player.currentAudioRepresentationIndex =
                player.audioTracks[player.currentAudioTrackIndex]
                  .representations.length - 1;
              break;
            }
            if (bandwidth >= 192e3 && 1 === that.playAudioBitrate) {
              if (
                ((player.currentAudioTrackIndex = i),
                !(
                  player.audioTracks[player.currentAudioTrackIndex]
                    .representations.length >= 1
                ))
              )
                return (
                  (playStatus = 6),
                  void that.EndByErrorAfterPlayStart(
                    "40004",
                    ":192KB audioTracks has problem. currentAudioTrackIndex = " +
                      player.currentAudioTrackIndex +
                      ", representations.length = " +
                      player.audioTracks[player.currentAudioTrackIndex]
                        .representations.length,
                    "動画再生に失敗しました",
                  )
                );
              player.currentAudioRepresentationIndex =
                player.audioTracks[player.currentAudioTrackIndex]
                  .representations.length - 1;
              break;
            }
          }
      var prefix = "pref-soundQuality-",
        index = AUDIO_BITRATE_INDEX.indexOf(that.playAudioBitrate);
      (index++,
        util.replaceClass(
          that.videoWrapperEl,
          new RegExp(prefix.replace(/-/gi, "\\-") + "\\d+", "gi"),
          prefix + index,
        ));
    }
    function facebookWindow(e) {
      (window.open(
        this.href,
        "FBwindow",
        "width=650, height=450, menubar=no, toolbar=no, scrollbars=yes",
      ),
        e.preventDefault());
    }
    function WS010105(url) {
      var errCount = 0,
        errId,
        errMsg;
      that.initContentsInfo();
      var result = 0,
        playerUrl = window.location.href,
        callWs010105 = function () {
          (window.clearTimeout(that.apiRetryTimer), delete that.apiRetryTimer);
          var request = new XMLHttpRequest(),
            json_data = JSON.parse(request.responseText || "null");
          (request.open("GET", url, !0),
            (request.onload = function () {
              if (4 === request.readyState) {
                if (200 === request.status)
                  if (
                    (json_data = JSON.parse(this.response)) &&
                    void 0 !== json_data.resultCd
                  ) {
                    if ("00" === (result = json_data.resultCd))
                      if (json_data.data) {
                        for (var param in ((that.ws010105Data = null),
                        (that.ws010105Data = util.escapeJsonData(
                          json_data.data,
                        )),
                        (that.ws010105Response =
                          util.escapeJsonData(json_data)),
                        WS010105_INIT_PARAMS_MAP))
                          void 0 === that.ws010105Data[param] &&
                            (that.ws010105Data[param] =
                              WS010105_INIT_PARAMS_MAP[param]);
                        that.ws010105Data.resumePoint = util.isParamExists(
                          json_data.data.resumePoint,
                        )
                          ? json_data.data.resumePoint / 1e3
                          : 0;
                        const thumbnail = document.querySelector(
                          ".p-infoContainer__thumbnail img",
                        );
                        (thumbnail.setAttribute(
                          "src",
                          that.ws010105Data.nextMainScenePath,
                        ),
                          (document.querySelector(
                            ".c-infoDetails.isAfterWatch .c-infoDetails__subTitle",
                          ).innerHTML = that.ws010105Data.nextPartDispNumber));
                        const nextSeenTitle = document.querySelector(
                          ".c-infoDetails.isAfterWatch .c-infoDetails__title",
                        );
                        nextSeenTitle.innerHTML =
                          that.ws010105Data.nextPartTitle;
                        const nextSeenDetail = document.querySelector(
                          ".c-infoDetails.isAfterWatch .c-infoDetails__text",
                        );
                        ((nextSeenDetail.innerHTML =
                          that.ws010105Data.nextPartExp),
                          (document.getElementById("twitter").href =
                            that.ws010105Data.snsTwitter),
                          (document.getElementById("facebook").href =
                            that.ws010105Data.snsFacebook),
                          (document.getElementById("google").href =
                            that.ws010105Data.snsGoogle),
                          (document.getElementById("hatebu").href =
                            that.ws010105Data.snsHatebu),
                          document
                            .getElementById("facebook")
                            .addEventListener("click", facebookWindow, !1),
                          sendStoreLog(that.ws010105Data.partId),
                          (chapter_skip = {
                            skip: !1,
                            canSkipUIDisp: !1,
                            index: 0,
                            end: 0,
                            title: "",
                            title_countdown: "",
                            ui: 0,
                          }),
                          (skipWaitTime = json_data.data.skipWaitTime),
                          (minTimeToSkip = json_data.data.minTimeToSkip),
                          that.clearSkipUiHistory(),
                          that.initializeSkipUiHistory(
                            json_data.data.chapters &&
                              json_data.data.chapters.length
                              ? json_data.data.chapters.length
                              : 0,
                          ));
                      } else
                        (that.EndByErrorBeforeSendResumeStart(
                          "40005",
                          ": WS010105 returns no data",
                          "動画再生に失敗しました",
                        ),
                          (result = "0005"));
                    else if (
                      !util.isParamExists(WE010105_ERROR_MSG_MAP[result]) &&
                      ++errCount < 3
                    )
                      return void (that.apiRetryTimer = window.setTimeout(
                        callWs010105,
                        500,
                      ));
                  } else {
                    if (++errCount < 3)
                      return void (that.apiRetryTimer = window.setTimeout(
                        callWs010105,
                        500,
                      ));
                    (that.EndByErrorBeforeSendResumeStart(
                      "40005",
                      ": WS010105 returns none or resultCd undefined",
                      "動画再生に失敗しました",
                    ),
                      (result = "0005"));
                  }
                else {
                  if (++errCount < 3)
                    return void (that.apiRetryTimer = window.setTimeout(
                      callWs010105,
                      500,
                    ));
                  ((errMsg =
                    ": url - " +
                    url +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                    that.EndByErrorBeforeSendResumeStart(
                      "40010",
                      errMsg,
                      ERROR_MSG_NETWORK,
                    ),
                    (result = "0001"));
                }
                if ("0001" === result || "0005" === result) result = 1;
                else if ("27" === result)
                  ((errId = "1" + ("0000" + result).slice(-4)),
                    util.showMsgBox(errId, ERROR_MSG_RENTAL, !1, !0));
                else if ("86" === result) {
                  var userAgent = window.navigator.userAgent.toLowerCase(),
                    appVersion = window.navigator.appVersion.toLowerCase(),
                    w = window.outerWidth - window.innerWidth,
                    h = window.outerHeight - window.innerHeight;
                  (window.resizeTo(480 + w, 580 + h),
                    (window.location.href =
                      document.getElementById("rootUrl").value +
                      "/login?popupFlag=0&notNeedReg=1&nextUrl=" +
                      encodeURIComponent(window.location.href)),
                    (result = 1));
                } else if ("87" === result)
                  ((window.location.href =
                    document.getElementById("rootUrl").value +
                    "/move_opener.html?openerUrl=" +
                    encodeURIComponent("/animestore/reg_pc")),
                    (result = 1));
                else if (
                  !playerUrl.match(/playlistId/) ||
                  ("34" !== result &&
                    "35" !== result &&
                    "36" !== result &&
                    "37" !== result &&
                    "38" !== result &&
                    "39" !== result)
                )
                  if ("34" === result)
                    ((window.location.href =
                      json_data.ageCheckUrl +
                      "&nextUrl=" +
                      encodeURIComponent(window.location.href)),
                      (result = 1));
                  else if ("35" === result) showAgeConfirmDialog(url);
                  else if ("36" === result)
                    ((errId = "1" + ("0000" + result).slice(-4)),
                      util.showMsgBox(errId, ERROR_MSG_WS010105_36, !1, !0));
                  else if ("37" === result)
                    ((errId = "1" + ("0000" + result).slice(-4)),
                      util.showMsgBox(errId, ERROR_MSG_WS010105_37, !1, !0));
                  else if ("38" === result)
                    ((errId = "1" + ("0000" + result).slice(-4)),
                      util.showMsgBox(errId, ERROR_MSG_WS010105_38, !1, !0));
                  else if ("39" === result)
                    ((errId = "1" + ("0000" + result).slice(-4)),
                      util.showMsgBox(errId, ERROR_MSG_WS010105_39, !1, !0));
                  else if ("00" !== result)
                    ((errId = "1" + ("0000" + result).slice(-4)),
                      (errMsg =
                        ":WS010105 return ERROR(resultCd=" + result + ")"),
                      that.EndByErrorBeforeSendResumeStart(
                        errId,
                        errMsg,
                        WE010105_ERROR_MSG_MAP[result] ||
                          "動画再生に失敗しました",
                      ),
                      (result = 1));
                  else if (
                    void 0 === that.ws010105Data.appType ||
                    ("08" !== that.ws010105Data.appType &&
                      "09" !== that.ws010105Data.appType) ||
                    void 0 === that.ws010105Data.oneTimeKey ||
                    void 0 === that.ws010105Data.laUrl ||
                    void 0 === that.ws010105Data.castContentUri ||
                    ("09" === that.ws010105Data.appType &&
                      void 0 === that.ws010105Data.apiUrl)
                  )
                    ((errId = "40005"),
                      (errMsg =
                        ":WS010105 output parameter missing. , appType : " +
                        that.ws010105Data.appType +
                        ", laUrl : " +
                        that.ws010105Data.laUrl +
                        ", apiUrl : " +
                        that.ws010105Data.apiUrl +
                        ", castContentUri : " +
                        that.ws010105Data.castContentUri),
                      that.EndByErrorBeforeSendResumeStart(
                        errId,
                        errMsg,
                        "動画再生に失敗しました",
                      ),
                      (result = 1));
                  else {
                    switch (that.playType) {
                      case 2:
                        that.ws010105Data.startStatus = "TOP";
                        break;
                      case 3:
                        ((that.ws010105Data.startStatus = "RESUME"),
                          (that.ws010105Data.resumePoint = that.tmpResumePoint),
                          (that.tmpResumePoint = 0));
                        break;
                      case 4:
                      case 1:
                        that.ws010105Data.startStatus = "TOP";
                    }
                    result = 0;
                  }
                else
                  ((errId = "1" + ("0000" + result).slice(-4)),
                    util.showMsgBox(
                      errId,
                      "年齢制限のある作品のため視聴できません",
                      !1,
                      !0,
                    ));
                initializeSub1st(result);
              }
            }),
            (request.ontimeout = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(callWs010105, 500))
                : ((errMsg =
                    ": url - " +
                    url +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorBeforeSendResumeStart(
                    "40010",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (result = "0001"));
            }),
            (request.onerror = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(callWs010105, 500))
                : ((errMsg =
                    ": Send request failed. " +
                    url +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorBeforeSendResumeStart(
                    "40010",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (result = "0001"));
            }),
            (request.withCredentials = !0),
            request.send(null));
        };
      callWs010105();
    }
    function showAgeConfirmDialog(url) {
      var dom = "";
      ((dom += '<div class="modalOverlay"></div>'),
        (dom += '<div class="mylistModal ageConfirmModal">'),
        (dom += '<div class="titleArea">'),
        (dom +=
          '<div class="title webkitScrollbar">本作品の視聴について</div>'),
        (dom += "</div>"),
        (dom += '<div class="textArea">'),
        (dom += '<div class="text">あなたは15歳以上ですか？</div>'),
        (dom += "</div>"),
        (dom += '<div class="btnDoubleArea">'),
        (dom += '<a href="javascript:void(0);" class="btnLeft">はい</a>'),
        (dom += '<a href="javascript:void(0);" class="btnRight">いいえ</a>'),
        (dom += "</div>"),
        (dom += "</div>"),
        util.showDialog({
          type: "DIALOG",
          contents: dom,
          buttonLeftCallback: function (dialog) {
            var jsonData = { result: "1" };
            ageConfirmXHR(JSON.stringify(jsonData), url, dialog);
          },
          buttonRightCallback: function (dialog) {
            var jsonData = { result: "0" };
            ageConfirmXHR(JSON.stringify(jsonData), url, dialog);
          },
        }));
    }
    function ageConfirmXHR(json, url, dialog) {
      var errCount = 0,
        errMsg = "",
        callAgeConfirmXHR = function () {
          (window.clearTimeout(that.apiRetryTimer), delete that.apiRetryTimer);
          var request = new XMLHttpRequest(),
            urlAgeConfirm =
              document.getElementById("rootUrl").value + AGE_CONFIRM_URL;
          (request.open("POST", urlAgeConfirm, !0),
            (request.timeout = 2e3),
            (request.onload = function () {
              if (4 === request.readyState && 200 === request.status) {
                var json_data = JSON.parse(this.response);
                if (json_data && void 0 !== json_data.resultCd) {
                  var resultCd = json_data.resultCd;
                  if ("00" === resultCd)
                    (util.closeModal(dialog), WS010105(url));
                  else {
                    if (++errCount < 3)
                      return void (that.apiRetryTimer = window.setTimeout(
                        callAgeConfirmXHR,
                        500,
                      ));
                    ((errId = "5" + ("0000" + resultCd).slice(-4)),
                      (errMsg =
                        errId +
                        ":WS100302 return ERROR(resultCd=" +
                        resultCd +
                        ")"),
                      that.sendErrorMessage(errMsg),
                      util.showMsgBox(
                        errId,
                        WS100302_ERROR_MSG_MAP[resultCd] || ERROR_WS100302_OV,
                        !0,
                      ));
                  }
                } else {
                  if (++errCount < 3)
                    return void (that.apiRetryTimer = window.setTimeout(
                      callAgeConfirmXHR,
                      500,
                    ));
                  ((errId = "40006"),
                    (errMsg =
                      errId +
                      ":WS100302 returns none or resultCd is undefined"),
                    that.sendErrorMessage(errMsg),
                    util.showMsgBox(errId, ERROR_WS100302_OV, !0));
                }
              }
            }),
            (request.ontimeout = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(
                    callAgeConfirmXHR,
                    500,
                  ))
                : ((errMsg =
                    "40011:url - " +
                    urlAgeConfirm +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.sendErrorMessage(errMsg),
                  util.showMsgBox("40011", ERROR_WS100302_OV, !0));
            }),
            (request.onerror = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(
                    callAgeConfirmXHR,
                    500,
                  ))
                : ((errMsg =
                    "40011:Send request failed. " +
                    urlAgeConfirm +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.sendErrorMessage(errMsg),
                  util.showMsgBox("40011", ERROR_WS100302_OV, !0));
            }),
            request.setRequestHeader("Content-Type", "application/json"),
            (request.withCredentials = !0),
            request.send(json));
        };
      callAgeConfirmXHR();
    }
    function otherWorkSearch() {
      window.location.href =
        document.getElementById("rootUrl").value +
        "/move_opener.html?openerUrl=" +
        encodeURIComponent(otherWorkSearchUrl);
    }
    function recommendSearch(obj) {
      window.location.href =
        document.getElementById("rootUrl").value +
        "/move_opener.html?openerUrl=" +
        encodeURIComponent(obj.children[0].value);
    }
    function showMyListDialog() {
      getMyList(!1);
    }
    function playNext() {
      (that.goNext(), that.recommendControlHide());
      var informationArea =
        document.getElementsByClassName("informationArea")[0];
      (util.replaceClass(informationArea, /show/, "hide"),
        util.removeClass(informationArea, "fadeshow"),
        util.removeClass(informationArea, "fadein"));
    }
    async function getRecommendInfo() {
      var script = document.createElement("script");
      window.callbackRecommend = function (data) {
        resetGetRecommend();
        const recomPos = document.querySelector(".recomPos");
        data.DcmstoreInfo &&
        data.DcmstoreInfo.Anime &&
        data.DcmstoreInfo.Anime.List
          ? (util.replaceClass(recomPos, /hide/, "show"),
            getfavoriteStatus(data.DcmstoreInfo.Anime.List))
          : util.replaceClass(recomPos, /show/, "hide");
      };
      var resetGetRecommend = function () {
          (util.isParamExists(that.recommentGetTimer) &&
            (window.clearTimeout(that.recommentGetTimer),
            delete that.recommentGetTimer),
            document.body.removeChild(script));
        },
        url = recommendContentInfoUrl + "&callback=callbackRecommend";
      (script.addEventListener(
        "error",
        function (status) {
          resetGetRecommend();
          var errMsg = "40014. url - " + url + ". fail to get recommend list.";
          that.sendErrorMessage(errMsg);
        },
        !1,
      ),
        (script.src = url),
        document.body.appendChild(script),
        (that.recommentGetTimer = window.setTimeout(function () {
          resetGetRecommend();
          var errMsg =
            "40015. url - " + url + ". Timeout to get recommend list.";
          that.sendErrorMessage(errMsg);
        }, 1e4)));
    }
    function setNetworkErrorMessage(errType, errId, url, request) {
      return "TIMEOUT" === errType
        ? errId +
            ":url - " +
            url +
            ", status - " +
            request.status +
            ", detail - " +
            request.statusText
        : errId +
            ":Send request failed. " +
            url +
            ", status - " +
            request.status +
            ", detail - " +
            request.statusText;
    }
    function myListError(errMsg, showMsg) {
      (that.sendErrorMessage(errMsg), util.showToastDialog(showMsg));
    }
    function getfavoriteStatus(recommendList) {
      for (
        var url = favoriteStatusUrl,
          errMsg = "",
          errId = "",
          idList = "",
          resultError = function (errType, request) {
            var errId,
              errMsg = setNetworkErrorMessage(errType, "40017", url, request);
            that.sendErrorMessage(errMsg);
          },
          i = 0;
        i < recommendList.length;
        i++
      )
        recommendList[i].recommendId &&
          ("" !== idList && (idList += "_"),
          (idList += recommendList[i].recommendId));
      url += "?workIdList=" + idList + "&targetFlag=10";
      var request = new XMLHttpRequest();
      (request.open("GET", url, !0),
        (request.timeout = 2e3),
        (request.onload = function () {
          if (4 === request.readyState && 200 === request.status) {
            var json_data = JSON.parse(this.response);
            if (json_data && void 0 !== json_data.resultCd) {
              var resultCd = json_data.resultCd;
              if ("00" === resultCd) {
                var faviriteStatusList = json_data.data.statusList;
                if (util.isParamExists(faviriteStatusList))
                  for (var flist in faviriteStatusList)
                    for (var rlist in recommendList)
                      if (
                        recommendList[rlist].recommendId ===
                        faviriteStatusList[flist].workId
                      ) {
                        recommendList[rlist].favoriteStatus =
                          faviriteStatusList[flist].favoriteStatus;
                        break;
                      }
              } else
                ((errId = "7" + ("0000" + resultCd).slice(-4)),
                  (errMsg =
                    errId +
                    ":WS100101 return ERROR(resultCd=" +
                    resultCd +
                    ")"),
                  that.sendErrorMessage(errMsg));
            } else
              ((errMsg =
                (errId = "40016") +
                ":WS100101 returns none or resultCd is undefined"),
                that.sendErrorMessage(errMsg));
          } else resultError("TIMEOUT", request);
          if ((viewRecommendArea(recommendList), window.laRecommendFunction)) {
            const element = document.getElementById("animeList"),
              recommendResponse = that.ws010105Response;
            laRecommendFunction(
              element.parentElement,
              recommendResponse.cryptoAccountId,
              recommendResponse.data.recommendContentInfo,
              {
                itemElementSelector: ".swiper-slide",
                wrapperElementSelector: ".swiper-container",
                scrollElementSelector: ".swiper-wrapper",
                workIdAttribute: "data-work-id",
                workIdProp: "contentId",
              },
            );
          }
        }),
        (request.ontimeout = function () {
          (resultError("TIMEOUT", request), viewRecommendArea(recommendList));
        }),
        (request.onerror = function () {
          (resultError("ERROR", request), viewRecommendArea(recommendList));
        }),
        request.setRequestHeader("Content-Type", "application/json"),
        (request.withCredentials = !0),
        request.send(null));
    }
    function viewRecommendArea(recommentList) {
      let itemNode,
        cSlide,
        cThumbnail,
        cThumbnailImg,
        hiddenUrl,
        cInfoDetails,
        cInfoDetailsTitle,
        favButton,
        favInput,
        favLabel;
      const title =
        void 0 === that.ws010105Data.animeRecommendInfoTitle
          ? "あなたにおすすめ"
          : that.ws010105Data.animeRecommendInfoTitle;
      document.querySelector(".recomPos .p-title__text").innerHTML = title;
      const itemList = document.getElementById("animeList"),
        workIdRegex = /^[0-9]{5}$/;
      for (; itemList.hasChildNodes();)
        itemList.removeChild(itemList.firstChild);
      if (util.isParamExists(recommentList))
        for (let i = 0; i < recommentList.length; i++) {
          let recommendId = recommentList[i].recommendId;
          ((itemNode = document.createElement("div")),
            (itemNode.className = "swiper-slide p-slider__item"),
            workIdRegex.test(recommendId)
              ? itemNode.setAttribute("data-work-id", recommendId)
              : itemNode.setAttribute(
                  "data-work-id",
                  recommentList[i].recommendHistoryParams[0].contentId,
                ),
            (cSlide = document.createElement("a")),
            (cSlide.className = "c-slide"),
            (cThumbnail = document.createElement("div")),
            (cThumbnail.className = "c-thumbnail isAnime"),
            (cThumbnailImg = document.createElement("img")),
            (cThumbnailImg.className = "c-thumbnail__img"),
            cThumbnailImg.setAttribute("src", recommentList[i].imageUrl),
            cThumbnailImg.setAttribute("alt", recommentList[i].recommendTitle),
            cThumbnailImg.setAttribute("loading", "lazy"),
            (hiddenUrl = document.createElement("input")),
            (hiddenUrl.type = "hidden"),
            (hiddenUrl.value = recommentList[i].contentInfoUri),
            (cInfoDetails = document.createElement("div")),
            (cInfoDetails.className = "c-infoDetails"),
            (cInfoDetailsTitle = document.createElement("h1")),
            (cInfoDetailsTitle.className = "c-infoDetails__title"),
            (cInfoDetailsTitle.innerHTML = recommentList[i].recommendTitle),
            workIdRegex.test(recommendId) &&
              ((favButton = document.createElement("div")),
              (favButton.className = "c-favouriteButton isGoods"),
              (favInput = document.createElement("input")),
              favInput.setAttribute("type", "checkbox"),
              favInput.setAttribute("id", "fav" + recommendId),
              favInput.setAttribute("work-id", recommendId),
              "0" === recommentList[i].favoriteStatus
                ? favInput.setAttribute("isChecked", "false")
                : "1" === recommentList[i].favoriteStatus &&
                  (favInput.setAttribute("isChecked", "true"),
                  (favInput.className = "isChecked")),
              util.append(favButton, favInput),
              (favLabel = document.createElement("label")),
              favLabel.setAttribute("for", "fav" + recommendId),
              util.append(favButton, favLabel),
              util.append(itemNode, favButton)),
            util.append(cSlide, hiddenUrl),
            util.append(cThumbnail, cThumbnailImg),
            util.append(cSlide, cThumbnail),
            util.append(cInfoDetails, cInfoDetailsTitle),
            util.append(cSlide, cInfoDetails),
            util.append(itemNode, cSlide),
            util.append(itemList, itemNode));
        }
      const swiper = new Swiper(".recom-slider", {
          slidesPerView: "auto",
          nested: !0,
          calculateHeight: !0,
          prevButton: "#recomPrevButton",
          nextButton: "#recomNextButton",
        }),
        slides = document.querySelectorAll(".recommend-section .swiper-slide");
      (slides.forEach((slide) => (slide.style.width = "max-content")),
        util.resizeToSwiperProperties(
          swiper,
          document.querySelector(".comicBodySw"),
        ),
        window.addEventListener("resize", function () {
          util.resizeToSwiperProperties(
            swiper,
            document.querySelector(".comicBodySw"),
          );
        }),
        setScrollArea(itemList));
      const itemNodeList = document.querySelectorAll(".recomPos .c-slide");
      for (let i = 0; i < itemNodeList.length; i++)
        itemNodeList[i].addEventListener("click", function () {
          recommendSearch(this);
        });
      const recMyList = document.querySelectorAll(".recomPos label");
      for (let link1 = 0, l = recMyList.length; l > link1; link1++)
        recMyList[link1].addEventListener(
          "click",
          function () {
            updateMind(this);
          },
          !1,
        );
    }
    function reqApiServ() {
      var errCount = 0,
        getManifest = function () {
          (window.clearTimeout(that.apiRetryTimer), delete that.apiRetryTimer);
          var tagName = "ContentProtection",
            attrName = "cenc:default_KID",
            keyId = "",
            manifestUrl = that.ws010105Data.castContentUri,
            errMsg = "",
            request = new XMLHttpRequest();
          (request.open("GET", manifestUrl, !0),
            (request.timeout = 5e3),
            (request.onload = function () {
              if (4 === request.readyState)
                if (200 === request.status) {
                  var xmlDoc = request.responseXML,
                    sessionUrl = that.ws010105Data.apiUrl;
                  if (xmlDoc) {
                    var tagInfo = xmlDoc.getElementsByTagName(tagName)[0];
                    if (
                      (tagInfo && (keyId = tagInfo.getAttribute(attrName)),
                      "" === keyId)
                    ) {
                      if (++errCount < 3)
                        return void (that.apiRetryTimer = window.setTimeout(
                          getManifest,
                          500,
                        ));
                      (that.EndByErrorAfterSendResumeStart(
                        "40008",
                        "Could not get keyId from " + manifestUrl,
                        "動画再生に失敗しました",
                      ),
                        (keyId = "0008"));
                    }
                    reqApiServSub(keyId, sessionUrl);
                  } else
                    ++errCount < 3
                      ? (that.apiRetryTimer = window.setTimeout(
                          getManifest,
                          500,
                        ))
                      : ((errMsg =
                          ": Could not get data from " +
                          manifestUrl +
                          ", status - " +
                          request.status +
                          ", detail - " +
                          request.statusText),
                        that.EndByErrorAfterSendResumeStart(
                          "40008",
                          errMsg,
                          "動画再生に失敗しました",
                        ),
                        (keyId = "0008"));
                } else
                  ++errCount < 3
                    ? (that.apiRetryTimer = window.setTimeout(getManifest, 500))
                    : ((errMsg =
                        ": url - " +
                        manifestUrl +
                        ", status - " +
                        request.status +
                        ", detail - " +
                        request.statusText),
                      that.EndByErrorAfterSendResumeStart(
                        "40013",
                        errMsg,
                        ERROR_MSG_NETWORK,
                      ),
                      (keyId = "0001"));
            }),
            (request.ontimeout = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(getManifest, 500))
                : ((errMsg =
                    ": url - " +
                    manifestUrl +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorAfterSendResumeStart(
                    "40013",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (keyId = "0001"));
            }),
            (request.onerror = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(getManifest, 500))
                : ((errMsg =
                    ": Send request failed. " +
                    manifestUrl +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorAfterSendResumeStart(
                    "40013",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (keyId = "0001"));
            }),
            request.setRequestHeader("Content-Type", "application/xml"),
            request.send(null));
        };
      getManifest();
    }
    function reqApiServSub(keyId, sessionUrl) {
      if ("0001" === keyId || "0008" === keyId) return "0001";
      var errCount = 0,
        result = 0,
        message = "",
        errMsg = "",
        param = "";
      ((param += "&keyId=" + keyId),
        (param += "&oneTimeKey=" + that.ws010105Data.oneTimeKey));
      var url = sessionUrl + "?" + param,
        getToken = function () {
          (window.clearTimeout(that.apiRetryTimer), delete that.apiRetryTimer);
          var request = new XMLHttpRequest(),
            json_data = JSON.parse(request.responseText || "null");
          (request.open("GET", url, !0),
            (request.onload = function () {
              if (4 === request.readyState) {
                if (200 === request.status)
                  if (
                    (json_data = JSON.parse(this.response)) &&
                    void 0 !== json_data.returnCd
                  ) {
                    switch (json_data.returnCd) {
                      case 0:
                        that.ws010105Data.oneTimeKey = json_data.tokenInfo;
                        break;
                      case 1:
                      case 3:
                        break;
                      default:
                        if (++errCount < 3)
                          return void (that.apiRetryTimer = window.setTimeout(
                            getToken,
                            500,
                          ));
                    }
                    ((result = json_data.returnCd),
                      (message = json_data.messageText));
                  } else {
                    if (++errCount < 3)
                      return void (that.apiRetryTimer = window.setTimeout(
                        getToken,
                        500,
                      ));
                    (that.EndByErrorAfterSendResumeStart(
                      "40007",
                      ": API Server returns none or returnCd is undefined.",
                      "動画再生に失敗しました",
                    ),
                      (result = "0007"));
                  }
                else {
                  if (++errCount < 3)
                    return void (that.apiRetryTimer = window.setTimeout(
                      getToken,
                      500,
                    ));
                  ((errMsg =
                    ": url - " +
                    sessionUrl +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                    that.EndByErrorAfterSendResumeStart(
                      "40012",
                      errMsg,
                      ERROR_MSG_NETWORK,
                    ),
                    (result = "0001"));
                }
                initializeSub(result, message);
              }
            }),
            (request.ontimeout = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(getToken, 500))
                : ((errMsg =
                    ": url - " +
                    sessionUrl +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorAfterSendResumeStart(
                    "40012",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (keyId = "0001"));
            }),
            (request.onerror = function () {
              ++errCount < 3
                ? (that.apiRetryTimer = window.setTimeout(getToken, 500))
                : ((errMsg =
                    ": Send request failed. " +
                    sessionUrl +
                    ", status - " +
                    request.status +
                    ", detail - " +
                    request.statusText),
                  that.EndByErrorAfterSendResumeStart(
                    "40012",
                    errMsg,
                    ERROR_MSG_NETWORK,
                  ),
                  (keyId = "0001"));
            }),
            request.setRequestHeader("Content-Type", "application/json"),
            request.send(null));
        };
      getToken();
    }
    var clickHandler = {
      "#nextStart": {
        click: function () {
          (that.resetPlayTimeAndCount(), playNext());
        },
      },
      "#otherSearch": {
        click: function () {
          otherWorkSearch();
        },
      },
      "#otherSearchRec": {
        click: function () {
          otherWorkSearch();
        },
      },
      "#infoClose": {
        click: function () {
          window.close();
        },
      },
      "#addMylist": {
        click: function () {
          showMyListDialog();
        },
      },
      ".recommendControl": {
        click: function () {
          var recommendControl = document.getElementById("recommendControl"),
            buttonTitle = recommendControl.innerText,
            endController = document.getElementsByClassName("endController")[0],
            informationArea =
              document.getElementsByClassName("informationArea")[0];
          const twitterIcon = document.querySelector(
            ".c-afterWatchHeader__icon",
          );
          "おすすめを閉じる" == buttonTitle
            ? ((recommendControl.innerText = "おすすめを開く"),
              util.replaceClass(informationArea, /show/, "hide"),
              util.removeClass(informationArea, "fadeshow"),
              util.removeClass(informationArea, "fadein"),
              util.replaceClass(endController, /hide/, "show"),
              util.addClass(endController, "fadeshow"),
              setTimeout(function () {
                util.addClass(endController, "fadein");
              }, 100),
              util.replaceClass(twitterIcon, /show/, "hide"),
              util.removeClass(twitterIcon, "fadeshow"),
              util.removeClass(twitterIcon, "fadein"))
            : ((recommendControl.innerText = "おすすめを閉じる"),
              util.replaceClass(informationArea, /hide/, "show"),
              util.addClass(informationArea, "fadeshow"),
              setTimeout(function () {
                util.addClass(informationArea, "fadein");
              }, 100),
              util.replaceClass(endController, /show/, "hide"),
              util.removeClass(endController, "fadeshow"),
              util.removeClass(endController, "fadein"),
              (recommendControl.style.marginTop = "20px"),
              "false" === twitterIcon.getAttribute("after-play")
                ? util.replaceClass(twitterIcon, /show/, "hide")
                : "true" === twitterIcon.getAttribute("after-play") &&
                  (util.replaceClass(twitterIcon, /hide/, "show"),
                  util.replaceClass(twitterIcon, /hide/, "show"),
                  util.addClass(twitterIcon, "fadeshow"),
                  setTimeout(function () {
                    util.addClass(twitterIcon, "fadein");
                  }, 100)));
        },
      },
    };
    for (var targetSelector in clickHandler) {
      var element = that.videoWrapperEl,
        els = [];
      "this" !== targetSelector
        ? (els = element.querySelectorAll(targetSelector))
        : els.push(element);
      for (var i = 0, len = els.length; i < len; i++)
        for (var eventName in ((element = els[i]),
        clickHandler[targetSelector]))
          element.addEventListener(
            eventName,
            clickHandler[targetSelector][eventName],
            !1,
          );
    }
    function updateMind(obj) {
      var url = registFavoriteUrl,
        errMsg = "",
        errId = "";
      const inputElm = document.getElementById(obj.htmlFor),
        workId = inputElm.getAttribute("work-id");
      var _updateType = "1";
      util.hasClass(inputElm, "isChecked") && (_updateType = "2");
      var jsonData = "{\n";
      ((jsonData += '"workId":"' + workId + '",\n'),
        (jsonData += '"updateType":"' + _updateType + '"\n'),
        (jsonData += "}"));
      var request = new XMLHttpRequest();
      (request.open("POST", url, !0),
        (request.timeout = 2e3),
        (request.onload = function () {
          var json_data = JSON.parse(this.response);
          if (json_data && void 0 !== json_data.resultCd) {
            var resultCd = json_data.resultCd;
            "00" === resultCd
              ? ("1" === _updateType
                  ? (util.addClass(inputElm, "isChecked"),
                    inputElm.setAttribute("isChecked", "true"))
                  : (util.removeClass(inputElm, "isChecked"),
                    inputElm.setAttribute("isChecked", "false")),
                "" === util.getCookie("##fav_toast_show") &&
                  (util.showMsgBox("0", SUCCESS_WS100302, !0),
                  util.setCookie("##fav_toast_show", 1)))
              : ((errId = "5" + ("0000" + resultCd).slice(-4)),
                (errMsg =
                  errId + ":WS100302 return ERROR(resultCd=" + resultCd + ")"),
                that.sendErrorMessage(errMsg),
                util.showMsgBox(
                  errId,
                  WS100302_ERROR_MSG_MAP[resultCd] || ERROR_WS100302_OV,
                  !0,
                ));
          } else
            ((errMsg =
              (errId = "40006") +
              ":WS100302 returns none or resultCd is undefined"),
              that.sendErrorMessage(errMsg),
              util.showMsgBox(errId, ERROR_WS100302_OV, !0));
        }),
        (request.ontimeout = function () {
          ((errMsg =
            "40011:url - " +
            url +
            ", status - " +
            request.status +
            ", detail - " +
            request.statusText),
            that.sendErrorMessage(errMsg),
            util.showMsgBox("40011", ERROR_WS100302_OV, !0));
        }),
        (request.onerror = function () {
          ((errMsg =
            "40011:Send request failed. " +
            url +
            ", status - " +
            request.status +
            ", detail - " +
            request.statusText),
            that.sendErrorMessage(errMsg),
            util.showMsgBox("40011", ERROR_WS100302_OV, !0));
        }),
        request.setRequestHeader("Content-Type", "application/json"),
        (request.withCredentials = !0),
        request.send(jsonData));
    }
    function getMyList(update) {
      var url = sharelistUrl,
        errMsg = "",
        errId = "",
        resultError = function (errType, request) {
          var errId = "40019",
            errMsg = setNetworkErrorMessage(errType, errId, url, request);
          (that.sendErrorMessage(errMsg),
            util.showMsgBox(errId, "エラーが発生しました。", !0));
        };
      url += "?workId=" + that.ws010105Data.partId.slice(0, 5);
      var request = new XMLHttpRequest();
      (request.open("GET", url, !0),
        (request.timeout = 2e3),
        (request.onload = function () {
          if (4 === request.readyState && 200 === request.status) {
            var json_data = JSON.parse(this.response);
            if (json_data && void 0 !== json_data.resultCd) {
              var resultCd = json_data.resultCd;
              if ("00" === resultCd) {
                var shareList = json_data.data.shareList;
                if (update) {
                  var modalDialog =
                      document.getElementsByClassName("modalDialog")[0],
                    mylistModal =
                      document.getElementsByClassName("mylistModal")[0];
                  (util.setStyle(mylistModal, "visibility", "hidden"),
                    showAddMyListDialog(shareList, update),
                    window.setTimeout(function () {
                      util.closeModal(modalDialog);
                    }, 500));
                } else {
                  for (
                    var alreadyRegistered = !1, i = 0, len = shareList.length;
                    i < len;
                    i++
                  )
                    if ("1" === shareList[i].status) {
                      alreadyRegistered = !0;
                      break;
                    }
                  showAddMyListDialog(shareList, update);
                }
              } else
                ((errId = "8" + ("0000" + resultCd).slice(-4)),
                  (errMsg =
                    errId +
                    ":WS100104 return ERROR(resultCd=" +
                    resultCd +
                    ")"),
                  that.sendErrorMessage(errMsg),
                  util.showMsgBox(errId, "エラーが発生しました。", !0));
            } else
              ((errMsg =
                (errId = "40018") +
                ":WS100104 returns none or resultCd is undefined"),
                that.sendErrorMessage(errMsg),
                util.showMsgBox(errId, "エラーが発生しました。", !0));
          } else resultError("TIMEOUT", request);
        }),
        (request.ontimeout = function () {
          resultError("TIMEOUT", request);
        }),
        (request.onerror = function () {
          resultError("ERROR", request);
        }),
        request.setRequestHeader("Content-Type", "application/json"),
        (request.withCredentials = !0),
        request.send(null));
    }
    function getFeatureList() {
      var url = getFeatureListUrl,
        errMsg = "",
        errId = "";
      window.featureList = null;
      var resultError = function (errType, request) {
        var errId = "40027",
          errMsg = setNetworkErrorMessage(errType, errId, url, request);
        (that.sendErrorMessage(errMsg),
          util.showMsgBox(errId, "エラーが発生しました。", !0));
      };
      if (null !== url) {
        var request = new XMLHttpRequest();
        (request.open("GET", url, !0),
          (request.timeout = 2e3),
          (request.onload = function () {
            if (4 === request.readyState && 200 === request.status) {
              var json_data = JSON.parse(this.response);
              if (json_data && void 0 !== json_data.resultCd) {
                var resultCd = json_data.resultCd;
                "00" === resultCd
                  ? (window.featureList = json_data.data.featureList)
                  : ((errId = "13" + ("0000" + resultCd).slice(-4)),
                    (errMsg =
                      errId +
                      ":WS100135 return ERROR(resultCd=" +
                      resultCd +
                      ")"),
                    that.sendErrorMessage(errMsg),
                    util.showMsgBox(errId, "エラーが発生しました。", !0));
              } else
                ((errMsg =
                  (errId = "40026") +
                  ":WS100135 returns none or resultCd is undefined"),
                  that.sendErrorMessage(errMsg),
                  util.showMsgBox(errId, "エラーが発生しました。", !0));
            } else resultError("TIMEOUT", request);
          }),
          (request.ontimeout = function () {
            resultError("TIMEOUT", request);
          }),
          (request.onerror = function () {
            resultError("ERROR", request);
          }),
          request.setRequestHeader("Content-Type", "application/json"),
          (request.withCredentials = !0),
          request.send(null));
      }
    }
    var createCkeckListItem = function (val) {
      var dom = "",
        isMax;
      return (
        (dom +=
          '<li class="p-addMyListModal__listItem c-checkbox js-mylistCheckbox ' +
          (val.count >= 50 && "0" === val.status ? "isDisable" : "") +
          '">'),
        (dom +=
          '<input id="' +
          val.shareListId +
          '" type="checkbox" class="c-checkbox__input" ' +
          ("1" === val.status ? "checked" : "") +
          ">"),
        (dom +=
          '<label for="' + val.shareListId + '" class="c-checkbox__label">'),
        (dom += util.escapeString(val.shareListName)),
        (dom += "</label>"),
        "1" === val.shareFlag &&
          ("0" === val.inspectionStatus ||
          "1" === val.inspectionStatus ||
          "2" === val.inspectionStatus ||
          "4" === val.inspectionStatus
            ? (dom += '<span class="p-addMyListModal__tag isError"></span>')
            : (dom +=
                '<span class="p-addMyListModal__tag isPublish">公開中</span>')),
        (dom +=
          '<span class="p-addMyListModal__listItemCount">(' +
          val.count +
          ")</span>"),
        (dom += "</li>")
      );
    };
    function showAddMyListDialog(shareList, update) {
      var rshareList = (shareList && shareList) || [];
      rshareList.reverse();
      for (
        var alreadyRegistered = !1, i = 0, len = shareList.length;
        i < len;
        i++
      )
        if ("1" === shareList[i].status) {
          alreadyRegistered = !0;
          break;
        }
      var dom = "";
      for (var index in ((dom += '<div class="modalOverlay"></div>'),
      (dom +=
        '<div class="mylistModal p-modal p-addMyListModal isExistModal">'),
      (dom += '<div class="p-modal__wrapper">'),
      (dom += '<div class="p-modalHeader">'),
      (dom +=
        '<h1 class="p-modalHeader__text">' +
        (alreadyRegistered ? "マイリスト編集" : "マイリストに追加") +
        "</h1>"),
      (dom += '<button class="closeBtn p-modalHeader__closeButton"></button>'),
      (dom += "</div>"),
      (dom += '<div class="p-modal__content">'),
      (dom +=
        '<div class="p-addMyListModal__text">1つのリストには50作品まで追加できます</div>'),
      rshareList.length < 100 &&
        ((dom +=
          '<div class="c-button isWhite isRoundBorder isBorderGray js-newMyList">'),
        (dom += "新しいマイリストを作成"),
        (dom += '<i class="c-button__icon isAddMyList"></i>'),
        (dom += "</div>")),
      (dom += '<ul class="p-addMyListModal__listContainer js-listOfMyList">'),
      rshareList))
        dom += createCkeckListItem(rshareList[index]);
      ((dom += "</ul>"),
        alreadyRegistered &&
          ((dom += '<div class="c-checkbox js-btnDeleteAll">'),
          (dom +=
            '<input id="deleteAll" type="checkbox" class="c-checkbox__input">'),
          (dom +=
            '<label for="deleteAll" class="c-checkbox__label">すべてのリストから削除</label>'),
          (dom += "</div>")),
        (dom += "</div>"),
        (dom += '<div class="p-modalFooter isNoBorder">'),
        (dom +=
          '<a href="javascript:void(0);" class="p-modalFooter__button c-button isOrange isFontLarge isRoundBorder js-addMyList">'),
        (dom += alreadyRegistered ? "保存" : "設定する"),
        (dom += "</a>"),
        (dom +=
          '<a href="javascript:void(0);" class="p-modalFooter__button c-button isOrange isFontLarge isRoundBorder js-deleteAllMyList hide">'),
        (dom += "マイリストから削除"),
        (dom += "</a>"),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += "</div>"));
      var isClickedRegist = !1,
        isClickedDelete = !1,
        dialogId = util.showDialog({
          type: "DIALOG",
          contents: dom,
          update: update,
          button1Callback: function (dialog) {
            if (isClickedRegist) return;
            isClickedRegist = !0;
            const registList = getCheckedList(rshareList),
              deleteList = getDeleteList(rshareList);
            if (0 === registList.length && 0 === deleteList.length)
              return void util.showToastDialog("何も変更されていません。");
            var errMsg = "",
              errId = "",
              resultError = function (errType, request) {
                var errId, errMsg;
                myListError(
                  setNetworkErrorMessage(
                    errType,
                    "40023",
                    registMylistUrl,
                    request,
                  ),
                  "エラーが発生しました。",
                );
              };
            const tmpData = {
                workId: that.ws010105Data.partId.slice(0, 5),
                regShareListIdList: registList,
                delShareListIdList: deleteList,
              },
              jsonData = JSON.stringify(tmpData);
            var request = new XMLHttpRequest();
            (request.open("POST", registMylistUrl, !0),
              (request.timeout = 2e3),
              (request.onload = function () {
                if (4 === request.readyState && 200 === request.status) {
                  var json_data = JSON.parse(this.response);
                  if (json_data && void 0 !== json_data.resultCd) {
                    var resultCd = json_data.resultCd;
                    "00" === resultCd
                      ? (changeAddToMyListBtnStatus("1"),
                        util.closeModal(dialog))
                      : ((errId = "11" + ("000" + resultCd).slice(-3)),
                        myListError(
                          (errMsg =
                            errId +
                            ":WS100306 return ERROR(resultCd=" +
                            resultCd +
                            ")"),
                          WS100306_ERROR_MSG_MAP[resultCd] ||
                            "エラーが発生しました。",
                        ));
                  } else
                    myListError(
                      (errMsg =
                        (errId = "40022") +
                        ":WS100306 returns none or resultCd is undefined"),
                      "エラーが発生しました。",
                    );
                } else resultError("TIMEOUT", request);
              }),
              (request.ontimeout = function () {
                resultError("TIMEOUT", request);
              }),
              (request.onerror = function () {
                resultError("ERROR", request);
              }),
              request.setRequestHeader("Content-Type", "application/json"),
              (request.withCredentials = !0),
              request.send(jsonData));
          },
          buttonCloseCallback: function (dialog) {
            util.closeModal(dialog);
          },
          buttonNewMyListCallback: function (dialog) {
            (util.replaceClass(
              that.videoWrapperEl,
              /pref\-myListSetting\-.*/,
              "pref-myListSetting-on",
            ),
              createNewMyList(dialog));
          },
          buttonDeleteMyListCallback: function (dialog) {
            if (isClickedDelete) return;
            isClickedDelete = !0;
            var errMsg = "",
              errId = "",
              resultError = function (errType, request) {
                var errId, errMsg;
                myListError(
                  setNetworkErrorMessage(
                    errType,
                    "40025",
                    deleteMylistUrl,
                    request,
                  ),
                  ERROR_DEL_MYLIST,
                );
              };
            const bodyJson = {
                updateType: "2",
                workId: that.ws010105Data.partId.slice(0, 5),
              },
              jsonData = JSON.stringify(bodyJson);
            var request = new XMLHttpRequest();
            (request.open("POST", deleteMylistUrl, !0),
              (request.timeout = 2e3),
              (request.onload = function () {
                if (4 === request.readyState && 200 === request.status) {
                  var json_data = JSON.parse(this.response);
                  if (json_data && void 0 !== json_data.resultCd) {
                    var resultCd = json_data.resultCd;
                    "00" === resultCd
                      ? (changeAddToMyListBtnStatus("0"),
                        util.closeModal(dialog))
                      : ((errId = "12" + ("000" + resultCd).slice(-3)),
                        myListError(
                          (errMsg =
                            errId +
                            ":WS100303 return ERROR(resultCd=" +
                            resultCd +
                            ")"),
                          WS100303_ERROR_MSG_MAP[resultCd] || ERROR_DEL_MYLIST,
                        ));
                  } else
                    myListError(
                      (errMsg =
                        (errId = "40024") +
                        ":WS100303 returns none or resultCd is undefined"),
                      ERROR_DEL_MYLIST,
                    );
                } else resultError("TIMEOUT", request);
              }),
              (request.ontimeout = function () {
                resultError("TIMEOUT", request);
              }),
              (request.onerror = function () {
                resultError("ERROR", request);
              }),
              request.setRequestHeader("Content-Type", "application/json"),
              (request.withCredentials = !0),
              request.send(jsonData));
          },
        }),
        dialog,
        checkboxList = document
          .getElementById(dialogId)
          .getElementsByClassName("js-mylistCheckbox");
      for (let i = 0; i < checkboxList.length; i++)
        util.hasClass(checkboxList, "isDisable") ||
          checkboxList[i].addEventListener(
            "click",
            function () {
              checkUncheckList(this);
            },
            !1,
          );
      document.getElementById("deleteAll") &&
        document
          .getElementById("deleteAll")
          .addEventListener("click", function (event) {
            "true" !== localStorage.getItem("pending") &&
              (localStorage.setItem("pending", "true"),
              checkAllMyList(event.currentTarget));
          });
    }
    function checkAllMyList(checkbox) {
      const isChecked = checkbox.checked,
        checkboxList =
          checkbox.parentNode.parentNode.querySelectorAll(".js-mylistCheckbox"),
        btnRegist = checkbox
          .closest(".modalDialog")
          .querySelector(".js-addMyList"),
        btnDelete = checkbox
          .closest(".modalDialog")
          .querySelector(".js-deleteAllMyList");
      let childNode;
      if (isChecked) {
        checkbox.setAttribute("checked", "");
        for (let i = 0; i < checkboxList.length; i++)
          ((childNode = checkboxList[i].querySelector("input")),
            util.hasClass(checkboxList[i], "isAllDelete") ||
              (util.addClass(checkboxList[i], "isAllDelete"),
              util.addClass(childNode, "isAllDelete")));
        (util.hasClass(btnRegist, "hide") || util.addClass(btnRegist, "hide"),
          util.hasClass(btnDelete, "hide") &&
            util.removeClass(btnDelete, "hide"));
      } else {
        checkbox.removeAttribute("checked");
        for (let i = 0; i < checkboxList.length; i++)
          ((childNode = checkboxList[i].querySelector("input")),
            util.hasClass(checkboxList[i], "isAllDelete") &&
              (util.removeClass(checkboxList[i], "isAllDelete"),
              util.removeClass(childNode, "isAllDelete")));
        (util.hasClass(btnRegist, "hide") &&
          util.removeClass(btnRegist, "hide"),
          util.hasClass(btnDelete, "hide") || util.addClass(btnDelete, "hide"));
      }
      localStorage.setItem("pending", "false");
    }
    function createNewMyList() {
      var dom = "";
      ((dom += '<div class="modalOverlay"></div>'),
        (dom += '<div class="p-modal p-newMyListModal mylistModal">'),
        (dom += '<div class="p-modal__wrapper">'),
        (dom += '<div class="">'),
        (dom += '<div class="p-modalHeader">'),
        (dom += '<h1 class="p-modalHeader__text">新しいマイリストを作成</h1>'),
        (dom +=
          '<button class="p-modalHeader__closeButton closeBtn"></button>'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += '<div class="p-modal__content">'),
        (dom += '<div class="p-newMyListModal__field">'),
        (dom += '<div class="p-newMyListModal__label">'),
        (dom += "このマイリストの名前"),
        (dom += '<span class="p-newMyListModal__subText isRequired">'),
        (dom += "[必須・20文字以内]"),
        (dom += "</span>"),
        (dom += "</div>"),
        (dom +=
          '<input class="p-newMyListModal__input isText" id="newMyListName" type="text" placeholder="好きな名前を入力して下さい">'),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__field">'),
        (dom += '<div class="p-newMyListModal__label">'),
        (dom += "マイリストの説明"),
        (dom += '<span class="p-newMyListModal__subText isRequired">'),
        (dom += "[200文字以内]"),
        (dom += "</span>"),
        (dom += "</div>"),
        (dom +=
          '<textarea class="p-newMyListModal__input isTextArea" id="newMyListDescription" type="text" placeholder="ここにマイリストの説明文を入力できます"></textarea>'),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__field">'),
        (dom += '<div class="p-newMyListModal__label">'),
        (dom += "公開設定"),
        (dom += "</div>"),
        (dom +=
          '<p class="p-newMyListModal__text">「公開」に設定したマイリストは、他のdアニメストア会員がdアニメストア内の検索などから見つけることができるようになります。また、トップページや特集などで紹介させていただくことがあります。</p>'),
        (dom +=
          '<p class="p-newMyListModal__text">「非公開」に設定したマイリストは、あなたと、マイリストのURLを知っている方が見ることができます。</p>'),
        (dom += '<div class="p-newMyListModal__radioGroup">'),
        (dom += '<label class="c-radioButton p-newMyListModal__radioItem">'),
        (dom +=
          '<input type="radio" class="c-radioButton__input" name="mylist_status" value="public" data-gtm-form-interact-field-id="0">'),
        (dom += '<span class="c-radioButton__label">公開</span>'),
        (dom += "</label>"),
        (dom += '<label class="c-radioButton p-newMyListModal__radioItem">'),
        (dom +=
          '<input type="radio" class="c-radioButton__input" name="mylist_status" value="private" data-gtm-form-interact-field-id="1" checked="checked">'),
        (dom += '<span class="c-radioButton__label">非公開</span>'),
        (dom += "</label>"),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__captionWrapper">'),
        (dom +=
          '<span class="p-newMyListModal__caption">個人情報に関する記載はご遠慮ください。</span>'),
        (dom += '<span class="p-newMyListModal__caption">※ 作成前に必ず'),
        (dom += '<a "javascript:void(0);" class="termsCheck">投稿規約</a>'),
        (dom += "をご確認ください。</span>"),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__checkbox c-checkbox">'),
        (dom +=
          '<input id="terms" type="checkbox" class="c-checkbox__input js-termsCheckbox" data-gtm-form-interact-field-id="0">'),
        (dom +=
          '<label for="terms" class="p-newMyListModal__checkboxLabel c-checkbox__label">投稿規約に同意して設定する</label>'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += '<div class="p-modalFooter isNoBorder">'),
        (dom +=
          '<a href="javascript:void(0);" class="p-modalFooter__button c-button isOrange isFontLarge isRoundBorder js-addNewMyList">作成する</a>'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += "</div>"));
      var isClicked = !1,
        isClickedTerms = !1,
        modalId = util.showDialog({
          type: "DIALOG",
          contents: dom,
          button1Callback: function (dialog) {
            return (
              !isClicked &&
              ((isClicked = !0),
              createShareList(
                document
                  .getElementById("newMyListName")
                  .value.replace(/^[\s　]+|[\s　]+$/g, ""),
                function (result) {
                  ((isClicked = !1),
                    result && (util.closeModal(dialog), getMyList(!0)));
                },
              ),
              !1)
            );
            var shareListName;
          },
          buttonCloseCallback: function (dialog) {
            util.closeModal(dialog);
          },
          buttonTermsCallback: function (dialog) {
            isClickedTerms ||
              ((isClickedTerms = !0),
              fetch(postingTermsUrl)
                .then((res) =>
                  res.ok
                    ? res.text()
                    : (util.showToastDialog("投稿規約の取得に失敗しました。"),
                      void (isClickedTerms = !1)),
                )
                .then((data) => {
                  (showTermsDialog(data), (isClickedTerms = !1));
                }));
          },
        }),
        newMyListName = document.getElementById("newMyListName");
      (-1 !== navigator.userAgent.indexOf("Edge") && newMyListName.select(),
        newMyListName.addEventListener(
          "keydown",
          function (e) {
            return (e.which && 13 === e.which) ||
              (e.keyCode && 13 === e.keyCode)
              ? (e.preventDefault(), !1)
              : (e.stopPropagation(), !0);
          },
          !1,
        ));
      var myListExplainText = document.getElementById("newMyListDescription");
      (-1 !== navigator.userAgent.indexOf("Edge") && myListExplainText.select(),
        myListExplainText.addEventListener(
          "keydown",
          function (e) {
            return (e.stopPropagation(), !0);
          },
          !1,
        ));
    }
    function createShareList(shareListName, callback) {
      if (shareListName) {
        if (shareListName.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g))
          return (
            util.showToastDialog("使用できない文字が含まれています"),
            void ("function" == typeof callback && callback(!1))
          );
        for (var len = 0, i = 0; i < shareListName.length; i++) {
          var encodedName;
          encodeURI(shareListName.charAt(i)).length > 1
            ? (len += 2)
            : (len += 1);
        }
        if (len > 20)
          return (
            util.showToastDialog("リスト名は10文字以内で入力してください"),
            void ("function" == typeof callback && callback(!1))
          );
        if (
          document.getElementsByName("mylist_status")[0].checked &&
          !document.querySelectorAll(".js-termsCheckbox")[0].checked
        )
          return (
            util.showToastDialog("投稿規約を確認し、同意してください"),
            void ("function" == typeof callback && callback(!1))
          );
        var errMsg = "",
          errId = "",
          resultError = function (errType, request) {
            var errId, errMsg;
            (myListError(
              setNetworkErrorMessage(
                errType,
                "40021",
                registSharelistUrl,
                request,
              ),
              "エラーが発生しました。",
            ),
              "function" == typeof callback && callback(!1));
          },
          jsonData = "{\n";
        ((jsonData += '"shareListId":null,\n'),
          (jsonData += '"shareListName":"' + shareListName + '",\n'),
          (jsonData += '"updateType":1,\n'),
          (jsonData += '"themeId":"TM00000000",\n'),
          document.getElementsByName("mylist_status").forEach((d) => {
            d.checked && "public" === d.value
              ? (jsonData += '"shareFlag":"1",\n')
              : d.checked &&
                "private" === d.value &&
                (jsonData += '"shareFlag":"0",\n');
          }),
          (jsonData += '"referenceValue": ""'),
          (jsonData += "}"));
        var request = new XMLHttpRequest();
        (request.open("POST", registSharelistUrl, !0),
          (request.timeout = 2e3),
          (request.onload = function () {
            var result = !1;
            if (4 === request.readyState && 200 === request.status) {
              var json_data = JSON.parse(this.response);
              if (json_data && void 0 !== json_data.resultCd) {
                var resultCd = json_data.resultCd;
                "00" === resultCd
                  ? (result = !0)
                  : "22" === resultCd
                    ? ((errId = "9" + ("0000" + resultCd).slice(-4)),
                      myListError(
                        (errMsg =
                          errId +
                          ":WS100305 return ERROR(resultCd=" +
                          resultCd +
                          ")"),
                        WS100305_ERROR_MSG_MAP[resultCd] ||
                          "エラーが発生しました。",
                      ))
                    : "26" === resultCd
                      ? registUserName()
                      : ((errId = "9" + ("0000" + resultCd).slice(-4)),
                        myListError(
                          (errMsg =
                            errId +
                            ":WS100305 return ERROR(resultCd=" +
                            resultCd +
                            ")"),
                          WS100305_ERROR_MSG_MAP[resultCd] ||
                            "エラーが発生しました。",
                        ));
              } else
                myListError(
                  (errMsg =
                    (errId = "40020") +
                    ":WS100305 returns none or resultCd is undefined"),
                  "エラーが発生しました。",
                );
              "function" == typeof callback && callback(result);
            } else resultError("TIMEOUT", request);
          }),
          (request.ontimeout = function () {
            resultError("TIMEOUT", request);
          }),
          (request.onerror = function () {
            resultError("ERROR", request);
          }),
          request.setRequestHeader("Content-Type", "application/json"),
          (request.withCredentials = !0),
          request.send(jsonData));
      } else
        (util.showToastDialog("名前が入力されていません"),
          "function" == typeof callback && callback(!1));
    }
    function registUserName() {
      var dom = "";
      ((dom += '<div class="modalOverlay"></div>'),
        (dom += '<div class="p-modal p-newMyListModal mylistModal">'),
        (dom += '<div class="p-modal__wrapper">'),
        (dom += '<div class="p-modal__header">'),
        (dom += '<div class="p-modalHeader">'),
        (dom += '<h1 class="p-modalHeader__text">ユーザー名設定</h1>'),
        (dom +=
          '<button class="p-modalHeader__closeButton closeBtn"></button>'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += '<div class="p-modal__content">'),
        (dom += '<div class="p-newMyListModal__field">'),
        (dom += '<div class="p-newMyListModal__label">'),
        (dom += "あなたのユーザー名"),
        (dom += '<span class="p-newMyListModal__subText isRequired">'),
        (dom += "[10文字以内]"),
        (dom += "</span>"),
        (dom += "</div>"),
        (dom +=
          '<p class="p-newMyListModal__text">ユーザー名は公開されることがあります。個人を特定されないようにご注意ください。</p>'),
        (dom +=
          '<span class="p-newMyListModal__caption">記号は使用できません。</span>'),
        (dom +=
          '<input class="p-newMyListModal__input isText" id="nickName" type="text" placeholder="好きな名前を入力して下さい">'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__captionWrapper">'),
        (dom +=
          '<span class="p-newMyListModal__caption">個人情報に関する記載はご遠慮ください。</span>'),
        (dom += '<span class="p-newMyListModal__caption">※ 作成前に必ず'),
        (dom += '<a "javascript:void(0);" class="termsCheck">投稿規約</a>'),
        (dom += "をご確認ください。</span>"),
        (dom += "</div>"),
        (dom += '<div class="p-newMyListModal__checkbox c-checkbox">'),
        (dom +=
          '<input id="termsNickName" type="checkbox" class="c-checkbox__input js-termsCheckbox" data-gtm-form-interact-field-id="0">'),
        (dom +=
          '<label for="termsNickName" class="p-newMyListModal__checkboxLabel c-checkbox__label">投稿規約に同意して設定する</label>'),
        (dom += "</div>"),
        (dom += '<div class="p-modalFooter isNoBorder">'),
        (dom +=
          '<a href="javascript:void(0);" class="btnSingle p-modalFooter__button c-button isOrange isFontLarge isRoundBorder">設定する</a>'),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += "</div>"));
      var isClicked = !1,
        isClickedTerms = !1,
        modalId = util.showDialog({
          type: "DIALOG",
          contents: dom,
          button1Callback: function (dialog) {
            if (isClicked) return !1;
            isClicked = !0;
            const nickName = document
              .getElementById("nickName")
              .value.replace(/^[\s　]+|[\s　]+$/g, "");
            registNickName(nickName, function (result) {
              return ((isClicked = !1), result && util.closeModal(dialog), !1);
            });
          },
          buttonCloseCallback: function (dialog) {
            util.closeModal(dialog);
          },
          buttonTermsCallback: function (dialog) {
            isClickedTerms ||
              ((isClickedTerms = !0),
              fetch(postingTermsUrl)
                .then((res) =>
                  res.ok
                    ? res.text()
                    : (util.showToastDialog("投稿規約の取得に失敗しました。"),
                      void (isClickedTerms = !1)),
                )
                .then((data) => {
                  (showTermsDialog(data), (isClickedTerms = !1));
                }));
          },
        }),
        nickNameText;
      document.getElementById("nickName").addEventListener(
        "keydown",
        function (e) {
          return (e.stopPropagation(), !0);
        },
        !1,
      );
    }
    function registNickName(nickName, callback) {
      if (nickName) {
        if (!document.querySelectorAll(".js-termsCheckbox")[1].checked)
          return (
            util.showToastDialog("投稿規約を確認し、同意してください"),
            void ("function" == typeof callback && callback(!1))
          );
        for (var len = 0, i = 0; i < nickName.length; i++) {
          var encodedName;
          encodeURI(nickName.charAt(i)).length > 1 ? (len += 2) : (len += 1);
        }
        if (len > 20)
          return (
            util.showToastDialog(
              "ニックネームは全角10文字・半角20文字以内で入力してください",
            ),
            void ("function" == typeof callback && callback(!1))
          );
        let errId = "",
          errMsg = "";
        const resultError = function (errType, request) {
            const errId = "40021",
              errMsg = setNetworkErrorMessage(
                errType,
                errId,
                registSharelistUrl,
                request,
              );
            (myListError(errMsg, "エラーが発生しました。"),
              "function" == typeof callback && callback(!1));
          },
          url = document.getElementById("rootUrl").value + "/rest/WS100334",
          data = { nickName: nickName },
          jsonData = JSON.stringify(data);
        var request = new XMLHttpRequest();
        (request.open("POST", url, !0),
          (request.timeout = 2e3),
          (request.onload = function () {
            var result = !1;
            if (4 === request.readyState && 200 === request.status) {
              var json_data = JSON.parse(this.response);
              if (json_data && void 0 !== json_data.resultCd) {
                var resultCd = json_data.resultCd;
                "00" === resultCd
                  ? (result = !0)
                  : ((errId = "14" + ("0000" + resultCd).slice(-4)),
                    (errMsg =
                      errId +
                      ":WS100334 return ERROR(resultCd=" +
                      resultCd +
                      ")"),
                    myListError(
                      errMsg,
                      WS100334_ERROR_MSG_MAP[resultCd] ||
                        "エラーが発生しました。",
                    ));
              } else
                ((errId = "40028"),
                  (errMsg =
                    errId + ":WS100334 returns none or resultCd is undefined"),
                  myListError(errMsg, "エラーが発生しました。"));
              "function" == typeof callback && callback(result);
            } else resultError("TIMEOUT", request);
          }),
          (request.ontimeout = function () {
            resultError("TIMEOUT", request);
          }),
          (request.onerror = function () {
            resultError("ERROR", request);
          }),
          request.setRequestHeader("Content-Type", "application/json"),
          (request.withCredentials = !0),
          request.send(jsonData));
      } else
        (util.showToastDialog("ニックネームが入力されていません"),
          "function" == typeof callback && callback(!1));
    }
    function showTermsDialog(data) {
      var htmlData,
        dom = "";
      ((dom += '<div class="modalOverlay"></div>'),
        (dom += '<div class="p-modal p-newMyListModal mylistModal">'),
        (dom += '<div class="p-modal__wrapper">'),
        (dom += '<div class="p-modalHeader">'),
        (dom += '<h1 class="p-modalHeader__text">投稿規約</h1>'),
        (dom +=
          '<button class="p-modalHeader__closeButton closeBtn"></button>'),
        (dom += "</div>"),
        (dom += '<div class="p-modal__content">'),
        (dom += data.replace("<head/>", "")),
        (dom += "</div>"),
        (dom += "</div>"),
        (dom += "</div>"));
      var isClicked = !1,
        modalId = util.showDialog({
          type: "DIALOG",
          contents: dom,
          buttonCloseCallback: function (dialog) {
            util.closeModal(dialog);
          },
        });
    }
    function checkUncheckList(obj) {
      if (util.hasClass(obj, "isAllDelete")) return;
      if (util.hasClass(obj, "isDisable")) return;
      const checkBox = obj.querySelector(".c-checkbox__input"),
        mylistModal = document.getElementsByClassName("mylistModal")[0];
      (checkBox.checked
        ? checkBox.removeAttribute("checked")
        : checkBox.setAttribute("checked", ""),
        util.addClass(mylistModal, "edited"));
    }
    function getCheckedList(shareList) {
      let array = [];
      const checkboxList = document.querySelectorAll(
        ".js-mylistCheckbox input",
      );
      for (let i = 0; i < checkboxList.length; i++)
        checkboxList[i].checked &&
          checkboxList[i].id === shareList[i].shareListId &&
          "0" === shareList[i].status &&
          array.push(shareList[i].shareListId);
      return array;
    }
    function getDeleteList(shareList) {
      let array = [];
      const checkboxList = document.querySelectorAll(
        ".js-mylistCheckbox input",
      );
      for (let i = 0; i < checkboxList.length; i++)
        checkboxList[i].checked ||
          checkboxList[i].id !== shareList[i].shareListId ||
          ("1" === shareList[i].status && array.push(shareList[i].shareListId));
      return array;
    }
    function changeAddToMyListBtnStatus(status) {
      var addToMylist = document.getElementById("addToMylist"),
        mylistBtn = document.getElementById("addMyListImg");
      switch (status) {
        case "0":
          (util.replaceClass(addToMylist, /hide/, "show"),
            util.replaceClass(mylistBtn, /delete.*/, "add"),
            (document.getElementById("addMyListStr").innerHTML =
              "マイリストに追加"));
          break;
        case "1":
          (util.replaceClass(addToMylist, /hide/, "show"),
            util.replaceClass(mylistBtn, /add.*/, "delete"),
            (document.getElementById("addMyListStr").innerHTML =
              "マイリスト編集"));
          break;
        default:
          util.replaceClass(addToMylist, /show/, "hide");
      }
    }
  }
  async function getOriginal(ws010105Data) {
    const request = new XMLHttpRequest(),
      url = ws010105Data.bookSpecifiedVolumeInfoUri;
    if (void 0 !== url) {
      const res = await fetch(url);
      if (res.ok && 200 === res.status) {
        const json_data = await res.json();
        return util.isParamExists(json_data)
          ? await setOriginal(ws010105Data, json_data)
          : null;
      }
    }
  }
  async function setOriginal(ws010105Data, json_data) {
    let volume1;
    2 === json_data.total_count && (volume1 = json_data.volumes[1]);
    const volumes = json_data.volumes[0],
      comicPos = document.querySelector(".comicPos");
    util.replaceClass(comicPos, /hide/, "show");
    const itemNode = document.createElement("div");
    itemNode.className = "swiper-slide p-slider__item c-card";
    const hiddenUrl = document.createElement("input");
    ((hiddenUrl.type = "hidden"),
      (hiddenUrl.value = volumes.volume_detail_url_vol));
    const cardHeader = document.createElement("div");
    cardHeader.className = "c-card__header";
    const cardHeaderText = document.createElement("span");
    cardHeaderText.className = "c-card__headerText";
    const headerText =
      void 0 === ws010105Data.bookSpecifiedVolumeInfoTitle
        ? "いま見たエピソードが読めます"
        : ws010105Data.bookSpecifiedVolumeInfoTitle;
    cardHeaderText.innerHTML = headerText;
    const cardBody = document.createElement("a");
    cardBody.className = "c-card__body";
    const thumbnail = document.createElement("div");
    thumbnail.className = "c-thumbnail isBookPromotion";
    const thumbnailImg = document.createElement("img");
    ((thumbnailImg.className = "c-thumbnail__img"),
      thumbnailImg.setAttribute("src", volumes.vertical_thumbnail_url),
      thumbnailImg.setAttribute("alt", volumes.name),
      thumbnailImg.setAttribute("loading", "lazy"));
    const thumbnailImgBlur = document.createElement("img");
    ((thumbnailImgBlur.className = "c-thumbnail__imgBlur"),
      thumbnailImgBlur.setAttribute("src", volumes.vertical_thumbnail_url),
      thumbnailImgBlur.setAttribute("alt", volumes.name),
      thumbnailImgBlur.setAttribute("loading", "lazy"));
    const infoDetails = document.createElement("div");
    infoDetails.className = "c-infoDetails isBookPromotion";
    const genreTags = document.createElement("div");
    genreTags.className = "c-genreTags";
    const contentType = {
        COMIC: "コミック",
        LIGHT_NOVEL: "ラノベ",
        LITERATURE_OF_NEW_TYPE: "新文芸",
        LITERATURE: "文芸",
        PRACTICAL_BOOK: "実用",
        PAPERBACK: "新書",
        MAGAZINE: "雑誌",
        PHOTO_BOOK: "写真集",
        ART_BOOK: "画集",
      },
      contentTypeTag = document.createElement("span");
    if (
      ((contentTypeTag.className = "c-genreTags__item isText"),
      (contentTypeTag.innerHTML = contentType[volumes.title.content_type]),
      util.append(genreTags, contentTypeTag),
      volumes.title.is_new)
    ) {
      let newTag = document.createElement("span");
      ((newTag.className = "c-genreTags__item isNew"),
        util.append(genreTags, newTag));
    }
    const infoDetailsTitle = document.createElement("h1");
    ((infoDetailsTitle.className = "c-infoDetails__title"),
      (infoDetailsTitle.innerHTML = volumes.title.name));
    const campaignIconRow = document.createElement("div");
    let campaignIcon;
    ((campaignIconRow.className =
      "c-infoDetails__campaignIconRow c-campaignIcon"),
      0 === volumes.price &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isFree"),
        util.append(campaignIconRow, campaignIcon)),
      volumes.title.has_volume_set &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isSet"),
        util.append(campaignIconRow, campaignIcon)),
      volumes.title.more_trial &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isSample isRight"),
        util.append(campaignIconRow, campaignIcon)));
    const campaignText = document.createElement("p");
    if (
      ((campaignText.className = "c-infoDetails__campaignText"),
      (campaignText.innerHTML = volumes.title.pr_text),
      util.append(cardHeader, cardHeaderText),
      util.append(itemNode, hiddenUrl),
      util.append(itemNode, cardHeader),
      util.append(thumbnail, thumbnailImg),
      util.append(thumbnail, thumbnailImgBlur),
      util.append(cardBody, thumbnail),
      util.append(infoDetails, genreTags),
      util.append(infoDetails, infoDetailsTitle),
      util.append(infoDetails, campaignIconRow),
      util.append(infoDetails, campaignText),
      util.append(cardBody, infoDetails),
      util.append(itemNode, cardBody),
      2 === json_data.total_count)
    ) {
      const tmpItem = createComicItem(volume1.title);
      return [itemNode, tmpItem];
    }
    return [itemNode];
  }
  async function getRelatedComic(
    ws010105Data,
    comicItemList,
    originalNode,
    title,
  ) {
    const request = new XMLHttpRequest(),
      url = ws010105Data.bookRecommendInfoUri;
    if (void 0 !== url)
      (request.open("GET", url, !0),
        (request.responseType = "json"),
        (request.onload = () => {
          if (4 === request.readyState && 200 === request.status) {
            const json_data = request.response;
            ((document.querySelector(".comicPos .p-title__text").innerHTML =
              title),
              util.isParamExists(json_data) &&
                setRelatedComic(json_data, comicItemList, originalNode));
          }
        }),
        request.send(null));
    else if (void 0 !== originalNode) {
      const comicPos = document.querySelector(".comicPos");
      util.replaceClass(comicPos, /hide/, "show");
      const title =
        void 0 === ws010105Data.bookRecommendInfoTitle
          ? "関連コミック(電子書籍)"
          : ws010105Data.bookRecommendInfoTitle;
      ((document.querySelector(".comicPos .p-title__text").innerHTML = title),
        originalNode.forEach((node) => {
          (util.append(comicItemList, node),
            util.addClass(node, "isBook"),
            node.addEventListener("click", function () {
              clickItem(this);
            }));
        }));
    }
  }
  function setRelatedComic(json_data, comicItemList, originalNode) {
    util.isParamExists(originalNode) &&
      originalNode.forEach((node) => util.append(comicItemList, node));
    const titles = json_data.titles;
    for (let i = 0; i < titles.length; i++)
      util.append(comicItemList, createComicItem(titles[i]));
    const comicPos = document.querySelector(".comicPos");
    (util.replaceClass(comicPos, /hide/, "show"), setScrollArea(comicItemList));
    const itemNodeList = document.querySelectorAll(".comicPos .p-slider__item");
    for (let i = 0; i < itemNodeList.length; i++)
      itemNodeList[i].addEventListener("click", function () {
        clickItem(this);
      });
    const swiper = new Swiper(".comic-slider", {
      slidesPerView: "auto",
      nested: !0,
      calculateHeight: !0,
      prevButton: "#comicPrevButton",
      nextButton: "#comicNextButton",
    });
    (itemNodeList.forEach((elm) => {
      util.addClass(elm, "isBook");
    }),
      util.resizeToSwiperProperties(
        swiper,
        document.querySelector(".comicBodySw"),
      ),
      window.addEventListener("resize", function () {
        util.resizeToSwiperProperties(
          swiper,
          document.querySelector(".comicBodySw"),
        );
      }));
  }
  function createComicItem(titles) {
    let itemNode,
      hiddenUrl,
      thumbnail,
      thumbnailImg,
      thumbnailImgBlur,
      thumbnailTag,
      infoDetails,
      genreTags,
      tagsItem,
      infoDetailsTitle,
      campaignIconRow;
    const contentType = {
      COMIC: "コミック",
      LIGHT_NOVEL: "ラノベ",
      LITERATURE_OF_NEW_TYPE: "新文芸",
      LITERATURE: "文芸",
      PRACTICAL_BOOK: "実用",
      PAPERBACK: "新書",
      MAGAZINE: "雑誌",
      PHOTO_BOOK: "写真集",
      ART_BOOK: "画集",
    };
    let campaignIcon;
    return (
      (itemNode = document.createElement("a")),
      (itemNode.className = "swiper-slide p-slider__item"),
      (hiddenUrl = document.createElement("input")),
      (hiddenUrl.type = "hidden"),
      (hiddenUrl.value = titles.title_detail_url),
      (thumbnail = document.createElement("div")),
      (thumbnail.className = "c-thumbnail isBook isBlur"),
      (thumbnailImg = document.createElement("img")),
      (thumbnailImg.className = "c-thumbnail__img"),
      thumbnailImg.setAttribute("src", titles.vertical_thumbnail_url),
      thumbnailImg.setAttribute("alt", titles.name),
      thumbnailImg.setAttribute("loading", "lazy"),
      (thumbnailImgBlur = document.createElement("img")),
      (thumbnailImgBlur.className = "c-thumbnail__imgBlur"),
      thumbnailImgBlur.setAttribute("src", titles.vertical_thumbnail_url),
      thumbnailImgBlur.setAttribute("alt", titles.name),
      thumbnailImgBlur.setAttribute("loading", "lazy"),
      util.append(thumbnail, thumbnailImg),
      util.append(thumbnail, thumbnailImgBlur),
      titles.is_sale &&
        ((thumbnailTag = document.createElement("i")),
        (thumbnailTag.className = "c-thumbnail__tag isOnSale"),
        util.append(thumbnail, thumbnailTag)),
      (infoDetails = document.createElement("div")),
      (infoDetails.className = "c-infoDetails isBook"),
      (genreTags = document.createElement("div")),
      (genreTags.className = "c-genreTags"),
      (tagsItem = document.createElement("span")),
      (tagsItem.className = "c-genreTags__item isText"),
      (tagsItem.innerHTML = contentType[titles.content_type]),
      util.append(genreTags, tagsItem),
      titles.is_new &&
        ((tagsItem = document.createElement("span")),
        (tagsItem.className = "c-genreTags__item isNew"),
        util.append(genreTags, tagsItem)),
      (infoDetailsTitle = document.createElement("h1")),
      (infoDetailsTitle.className = "c-infoDetails__title"),
      (infoDetailsTitle.innerHTML = titles.name),
      (campaignIconRow = document.createElement("div")),
      (campaignIconRow.className =
        "c-infoDetails__campaignIconRow c-campaignIcon"),
      0 !== titles.free_volume_count &&
        titles.free_volume_count >= titles.volume_count &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isFree"),
        util.append(campaignIconRow, campaignIcon)),
      titles.has_volume_set &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isSet"),
        util.append(campaignIconRow, campaignIcon)),
      titles.more_trial &&
        ((campaignIcon = document.createElement("i")),
        (campaignIcon.className = "c-campaignIcon__item isSample isRight"),
        util.append(campaignIconRow, campaignIcon)),
      util.append(itemNode, hiddenUrl),
      util.append(itemNode, thumbnail),
      util.append(infoDetails, genreTags),
      util.append(infoDetails, infoDetailsTitle),
      util.append(infoDetails, campaignIconRow),
      util.append(itemNode, infoDetails),
      itemNode
    );
  }
  function getRelatedGoods(ws010105Data) {
    const request = new XMLHttpRequest(),
      url = ws010105Data.productsRecommendInfoUri;
    void 0 !== url &&
      (request.open("GET", url, !0),
      request.setRequestHeader(
        "X-api-key",
        "QEf9c4a5BIFP78hig53vppg0xuKCHu8P+MzlzcmKe+gsNpjgyIksVIsYz9HRWab2ncbeHxkCy5qC22yWSUPj3DSSx83k5+kokYMpERBBwuQ=",
      ),
      (request.responseType = "json"),
      (request.onload = () => {
        if (4 === request.readyState && 200 === request.status) {
          const json_data = request.response;
          setRelatedGoods(ws010105Data, json_data);
        }
      }),
      request.send(null));
  }
  function setRelatedGoods(ws010105Data, json_data) {
    let itemNode,
      hiddenUrl,
      cSlide,
      cThumbnail,
      cThumbnailImg,
      cInfoDetails,
      cInfoDetailsTitle,
      cInfoDetailsSubTitle,
      favButton,
      favInput,
      favLabel;
    const modal = document.getElementById("skuModal");
    let skuModal,
      titleArea,
      titleNode,
      closeBtn,
      closeANode,
      skuContainer,
      skuThumbnailContainer,
      skuThumbnail,
      skuThumbnailImg,
      skuName,
      closeBtnArea,
      btnSingle,
      closeText,
      closeBtnIcon;
    const title =
      void 0 === ws010105Data.productsRecommendInfoTitle
        ? "関連グッズ"
        : ws010105Data.productsRecommendInfoTitle;
    document.querySelector(".goodsPos .p-title__text").innerHTML = title;
    const itemList = document.getElementById("goodsList");
    for (; itemList.hasChildNodes();) itemList.removeChild(itemList.firstChild);
    if (util.isParamExists(json_data)) {
      const goodsList = json_data.productInfos;
      for (let i = 0; i < goodsList.length; i++)
        if (
          ((itemNode = document.createElement("div")),
          (itemNode.className = "swiper-slide p-slider__item"),
          (cSlide = document.createElement("a")),
          (cSlide.className = "c-slide"),
          (hiddenUrl = document.createElement("input")),
          (hiddenUrl.type = "hidden"),
          (hiddenUrl.value =
            document.getElementById("rootUrl").value +
            "/ec/product_detail?productId=" +
            goodsList[i].productId),
          (cThumbnail = document.createElement("div")),
          (cThumbnail.className = "c-thumbnail isGoods"),
          (cThumbnailImg = document.createElement("img")),
          (cThumbnailImg.className = "c-thumbnail__img"),
          cThumbnailImg.setAttribute("src", regImgPath(goodsList[i].imageUri)),
          cThumbnailImg.setAttribute("alt", goodsList[i].productName),
          cThumbnailImg.setAttribute("loading", "lazy"),
          (cInfoDetails = document.createElement("div")),
          (cInfoDetails.className = "c-infoDetails isGoods"),
          (cInfoDetailsTitle = document.createElement("h1")),
          (cInfoDetailsTitle.className = "c-infoDetails__title"),
          (cInfoDetailsTitle.innerHTML = goodsList[i].productName),
          (cInfoDetailsSubTitle = document.createElement("h1")),
          (cInfoDetailsSubTitle.className = "c-infoDetails__subTitle"),
          (cInfoDetailsSubTitle.innerHTML = goodsList[i].dispName),
          (favButton = document.createElement("div")),
          (favButton.className = "c-favouriteButton isGoods"),
          (favInput = document.createElement("input")),
          favInput.setAttribute("type", "checkbox"),
          favInput.setAttribute("id", "fav" + goodsList[i].productId),
          favInput.setAttribute("isChecked", "false"),
          favInput.setAttribute("product-item-id", goodsList[i].productId),
          favInput.setAttribute("section-code", goodsList[i].sectionCode),
          (favLabel = document.createElement("label")),
          favLabel.setAttribute("for", "fav" + goodsList[i].productId),
          util.append(cSlide, hiddenUrl),
          util.append(cThumbnail, cThumbnailImg),
          util.append(cSlide, cThumbnail),
          util.append(cInfoDetails, cInfoDetailsTitle),
          util.append(cInfoDetails, cInfoDetailsSubTitle),
          util.append(cSlide, cInfoDetails),
          util.append(itemNode, cSlide),
          util.append(favButton, favInput),
          util.append(favButton, favLabel),
          util.append(itemNode, favButton),
          util.append(itemList, itemNode),
          modal.classList.contains("already"))
        )
          1 === goodsList[i].productItemInfos.length
            ? favLabel.addEventListener("click", function () {
                favItem(this);
              })
            : goodsList[i].productItemInfos.length > 1 &&
              favLabel.addEventListener(
                "click",
                function () {
                  skuModalOpen(this);
                },
                !1,
              );
        else if (1 === goodsList[i].productItemInfos.length)
          (favLabel.addEventListener("click", function () {
            favItem(this);
          }),
            goodsList[i].productItemInfos[0].isFavorite &&
              (favInput.setAttribute("isChecked", "true"),
              util.addClass(favInput, "isChecked")));
        else if (goodsList[i].productItemInfos.length > 1) {
          let itemInfo;
          (favLabel.addEventListener(
            "click",
            function () {
              skuModalOpen(this);
            },
            !1,
          ),
            (skuModal = document.createElement("div")),
            (skuModal.className =
              "generalModal generalModal--goods webkitScrollbar hide"),
            skuModal.setAttribute("product-id", goodsList[i].productId),
            (titleArea = document.createElement("div")),
            (titleArea.className = "titleArea"),
            (titleNode = document.createElement("div")),
            (titleNode.className = "title"),
            (titleNode.innerHTML = "気になる商品に追加する"),
            (closeBtn = document.createElement("div")),
            (closeBtn.className = "closeBtn"),
            (closeANode = document.createElement("a")),
            (closeANode.className = "close"),
            util.append(closeBtn, closeANode),
            util.append(titleArea, titleNode),
            util.append(titleArea, closeBtn),
            util.append(skuModal, titleArea),
            util.append(modal, skuModal));
          for (let j = 0; j < goodsList[i].productItemInfos.length; j++) {
            itemInfo = goodsList[i].productItemInfos[j];
            let containers = document.querySelectorAll(
              ".generalModal .skuContainer",
            );
            if (0 === containers.length)
              ((skuContainer = document.createElement("div")),
                (skuContainer.className = "skuContainer"),
                (skuThumbnailContainer = document.createElement("div")),
                (skuThumbnailContainer.className = "skuThumbnailContainer"),
                util.append(skuContainer, skuThumbnailContainer),
                (skuThumbnail = document.createElement("div")),
                (skuThumbnail.className = "skuThumbnail"),
                util.append(skuThumbnailContainer, skuThumbnail),
                (skuThumbnailImg = document.createElement("img")),
                skuThumbnailImg.setAttribute(
                  "src",
                  regImgPath(itemInfo.imageUri),
                ),
                util.append(skuThumbnail, skuThumbnailImg),
                (skuName = document.createElement("span")),
                (skuName.className = "skuName"),
                util.append(skuThumbnailContainer, skuName),
                setModalContainer(itemInfo, skuContainer, skuName),
                util.append(skuModal, skuContainer));
            else {
              let nameArr = [];
              (itemInfo.propertyInfos.forEach((p) => {
                "color" === p.systemName && nameArr.push(p.name);
              }),
                (skuContainer = null),
                containers.forEach((c) => {
                  let color = c.querySelector(".skuName").innerHTML;
                  nameArr.forEach((n) => {
                    n === color && (skuContainer = c);
                  });
                }),
                null === skuContainer &&
                  ((skuContainer = document.createElement("div")),
                  (skuContainer.className = "skuContainer"),
                  (skuThumbnailContainer = document.createElement("div")),
                  (skuThumbnailContainer.className = "skuThumbnailContainer"),
                  util.append(skuContainer, skuThumbnailContainer),
                  (skuThumbnail = document.createElement("div")),
                  (skuThumbnail.className = "skuThumbnail"),
                  util.append(skuThumbnailContainer, skuThumbnail),
                  (skuThumbnailImg = document.createElement("img")),
                  skuThumbnailImg.setAttribute("src", itemInfo.imageUri),
                  util.append(skuThumbnail, skuThumbnailImg),
                  (skuName = document.createElement("span")),
                  (skuName.className = "skuName"),
                  util.append(skuThumbnailContainer, skuName)),
                setModalContainer(itemInfo, skuContainer, skuName),
                util.append(skuModal, skuContainer));
            }
          }
          ((closeBtnArea = document.createElement("div")),
            (closeBtnArea.className = "btnSingleArea--goods"),
            (btnSingle = document.createElement("a")),
            (btnSingle.className = "btnSingle close"),
            btnSingle.setAttribute("href", "javascript:void(0)"),
            util.append(closeBtnArea, btnSingle),
            (closeText = document.createElement("span")),
            (closeText.innerHTML = "閉じる"),
            util.append(btnSingle, closeText),
            (closeBtn = document.createElement("div")),
            (closeBtn.className = "closeBtn"),
            util.append(btnSingle, closeBtn),
            (closeBtnIcon = document.createElement("i")),
            (closeBtnIcon.className = "icon iconCircleClose"),
            util.append(closeBtn, closeBtnIcon),
            util.append(skuModal, closeBtnArea));
        }
      const goodsPos = document.querySelector(".goodsPos");
      (util.replaceClass(goodsPos, /hide/, "show"), setScrollArea(itemList));
      const itemNodeList = document.querySelectorAll(".goodsPos .c-slide");
      for (let i = 0; i < itemNodeList.length; i++)
        itemNodeList[i].addEventListener("click", function () {
          clickItem(this);
        });
      const swiper = new Swiper(".goods-slider", {
        slidesPerView: "auto",
        spaceBetween: 4,
        nested: !0,
        calculateHeight: !0,
        prevButton: "#goodsPrevButton",
        nextButton: "#goodsNextButton",
      });
      (document.querySelectorAll(".goodsPos .swiper-slide").forEach((elm) => {
        (util.addClass(elm, "isGoods"), (elm.style.width = "max-content"));
      }),
        util.resizeToSwiperProperties(
          swiper,
          document.querySelector(".goodsBodySw"),
        ),
        window.addEventListener("resize", function () {
          util.resizeToSwiperProperties(
            swiper,
            document.querySelector(".goodsBodySw"),
          );
        }),
        modal.classList.add("already"));
      const closer = document.querySelectorAll(".close");
      for (let i = 0; i < closer.length; i++)
        closer[i].addEventListener("click", function () {
          skuModalClose(this);
        });
      const buttons = document.querySelectorAll(".skuItem__Button");
      buttons.forEach((elm) => {
        elm.addEventListener("click", function () {
          favActive(this);
        });
      });
    }
  }
  function regImgPath(path) {
    let regexp = /(\.jpg)/,
      newpath;
    return path.replace(regexp, "_medium$&");
  }
  function clickItem(obj) {
    window.location.href =
      document.getElementById("rootUrl").value +
      "/move_opener.html?openerUrl=" +
      encodeURIComponent(obj.children[0].value);
  }
  function setModalContainer(itemInfo, skuContainer, skuName) {
    let skuItem = document.createElement("div");
    ((skuItem.className = "skuItem"), util.append(skuContainer, skuItem));
    let skuItemText = document.createElement("span");
    ((skuItemText.className = "skuItem__Text"),
      util.append(skuItem, skuItemText),
      itemInfo.propertyInfos.forEach((p) => {
        "color" === p.systemName
          ? (skuName.innerHTML = p.name)
          : "size" === p.systemName && (skuItemText.innerHTML = p.name);
      }));
    let skuItemStock = document.createElement("span");
    ((skuItemStock.className = "skuItem__Stock"),
      (skuItemStock.innerHTML = itemInfo.isInStock ? "在庫あり" : "在庫なし"),
      util.append(skuItem, skuItemStock));
    let skuItemButton = document.createElement("div");
    ((skuItemButton.className = "skuItem__Button"),
      (skuItemButton.innerHTML = "気になる"),
      skuItemButton.setAttribute("product-item-id", itemInfo.productItemId),
      util.append(skuItem, skuItemButton));
    let iconEcFav = document.createElement("i");
    ((iconEcFav.className = "iconEC-fav"),
      util.append(skuItemButton, iconEcFav));
  }
  function setScrollArea(elm) {
    elm.scrollTo(0, 0);
  }
  function favItem(elm) {
    const labelForId = elm.htmlFor,
      checkBox = document.getElementById(labelForId),
      checked = checkBox.getAttribute("isChecked");
    let url = "",
      data;
    "true" === checked
      ? ((url = document.getElementById("goodsFavoriteCancelUrl").value),
        (data = {
          productItemIds: [Number(checkBox.getAttribute("product-item-id"))],
        }))
      : "false" === checked &&
        ((url = document.getElementById("goodsFavoriteRegistUrl").value),
        (data = {
          productItemId: Number(checkBox.getAttribute("product-item-id")),
        }));
    const jsonData = JSON.stringify(data),
      request = new XMLHttpRequest();
    (request.open("POST", url, !0),
      request.setRequestHeader(
        "X-api-key",
        "QEf9c4a5BIFP78hig53vppg0xuKCHu8P+MzlzcmKe+gsNpjgyIksVIsYz9HRWab2ncbeHxkCy5qC22yWSUPj3DSSx83k5+kokYMpERBBwuQ=",
      ),
      request.setRequestHeader(
        "Content-type",
        "application/json;charset=utf-8",
      ),
      (request.responseType = "json"),
      (request.withCredentials = !0),
      (request.timeout = 2e3),
      (request.onload = function () {
        const json_data = this.response;
        if (json_data && void 0 !== json_data.resultCode) {
          const resultCd = json_data.resultCode;
          "0000" === resultCd &&
            ("true" === checked
              ? (checkBox.setAttribute("isChecked", "false"),
                util.removeClass(checkBox, "isChecked"))
              : "false" === checked &&
                (checkBox.setAttribute("ischecked", "true"),
                util.addClass(checkBox, "isChecked")));
        }
      }),
      (request.ontimeout = function () {}),
      (request.onerror = function () {}),
      request.send(jsonData));
  }
  function resizeModal() {
    const showElm = document.querySelector(".generalModal.show");
    if (null !== showElm) {
      const bodyWidth = document.body.clientWidth,
        bodyHeight = document.body.clientHeight,
        modalWidth = showElm.clientWidth,
        modalHeight = showElm.clientHeight;
      ((showElm.style.top = (bodyHeight - modalHeight) / 2 + "px"),
        (showElm.style.left = (bodyWidth - modalWidth) / 2 + "px"));
    }
  }
  function skuModalOpen(elm) {
    const productId = elm.htmlFor.replace("fav", ""),
      targetElm = document.querySelector(
        "div[product-id = '" + productId + "']",
      ),
      modal = document.getElementById("skuModal"),
      overlay = document.getElementsByClassName("modalOverlay")[0];
    (overlay.setAttribute("overlay-product-id", productId),
      util.replaceClass(modal, /hide/, "show"),
      util.replaceClass(targetElm, /hide/, "show"),
      util.addClass(modal, "modalDialog"));
    const bodyWidth = document.body.clientWidth,
      bodyHeight = document.body.clientHeight,
      modalWidth = targetElm.clientWidth,
      modalHeight = targetElm.clientHeight;
    ((targetElm.style.top = (bodyHeight - modalHeight) / 2 + "px"),
      (targetElm.style.left = (bodyWidth - modalWidth) / 2 + "px"));
    const imgElm = document.querySelector(
      "div[product-id = '" + productId + "'] .skuContainer img",
    );
    imgElm.setAttribute("src", imgElm.getAttribute("src"));
  }
  function skuModalClose(elm) {
    const overlayElm = document.getElementsByClassName("modalOverlay")[0],
      productId = overlayElm.getAttribute("overlay-product-id"),
      modalElm = elm.closest("#skuModal"),
      targetElm = document.querySelector(
        "div[product-id = '" + productId + "']",
      );
    (util.replaceClass(modalElm, /show/, "hide"),
      util.replaceClass(targetElm, /show/, "hide"),
      util.removeClass(modalElm, "modalDialog"));
  }
  function favActive(elm) {
    const icon = elm.childNodes[1],
      modal = elm.closest(".generalModal"),
      productId = modal.getAttribute("product-id"),
      goodsIcon = document.getElementById("fav" + productId),
      buttons = document.querySelectorAll(
        "div[product-id='" +
          productId +
          "'] > .skuContainer > .skuItem > .skuItem__Button > i",
      );
    let count = 0,
      url = "",
      data = { productItemId: elm.getAttribute("product-item-id") };
    icon.classList.contains("iconEC-fav")
      ? ((url = document.getElementById("goodsFavoriteRegistUrl").value),
        (data = {
          productItemId: Number(checkBox.getAttribute("product-item-id")),
        }))
      : ((url = document.getElementById("goodsFavoriteCancelUrl").value),
        (data = {
          productItemIds: [Number(checkBox.getAttribute("product-item-id"))],
        }));
    const jsonData = JSON.stringify(data),
      request = new XMLHttpRequest();
    (request.open("POST", url, !0),
      request.setRequestHeader(
        "X-api-key",
        "QEf9c4a5BIFP78hig53vppg0xuKCHu8P+MzlzcmKe+gsNpjgyIksVIsYz9HRWab2ncbeHxkCy5qC22yWSUPj3DSSx83k5+kokYMpERBBwuQ=",
      ),
      request.setRequestHeader(
        "Content-type",
        "application/json;charset=utf-8",
      ),
      (request.responseType = "json"),
      (request.withCredentials = !0),
      (request.timeout = 2e3),
      (request.onload = function () {
        const json_data = this.response;
        if (json_data && void 0 !== json_data.resultCode) {
          const resultCd = json_data.resultCode;
          "0000" === resultCd &&
            (icon.classList.contains("iconEC-fav")
              ? (util.replaceClass(icon, /iconEC-fav/, "iconEC-fav-active"),
                "false" === goodsIcon.getAttribute("isChecked") &&
                  (goodsIcon.setAttribute("ischecked", "true"),
                  util.addClass(goodsIcon, "isChecked")))
              : (goodsFavoriteModal(icon, goodsIcon),
                buttons.forEach((b) => {
                  b.classList.contains("iconEC-fav-active") && count++;
                }),
                0 === count &&
                  "true" === goodsIcon.getAttribute("isChecked") &&
                  (goodsIcon.setAttribute("ischecked", "false"),
                  util.removeClass(goodsIcon, "isChecked"))));
        }
      }),
      (request.ontimeout = function () {}),
      (request.onerror = function () {}),
      request.send(jsonData));
  }
  function resetScroll() {
    var wrapper;
    document.getElementsByClassName("wrappArea")[0].scrollTop = 0;
  }
  (!(function () {
    for (
      var cookies = document.cookie.split(";"), i = 0, len = cookies.length;
      i < len;
      i++
    ) {
      var keyValue = cookies[i].split("=");
      2 === keyValue.length &&
        (cookieMap[keyValue[0].trim()] = keyValue[1].trim());
    }
  })(),
    (util.setCookie = function (name, value) {
      var date = new Date();
      (date.setTime(date.getTime() + 2147483647e3),
        (document.cookie =
          name + "=" + value + "; expires=" + date.toGMTString() + "; path=/"),
        (cookieMap[name] = value));
    }),
    (util.getCookie = function (name) {
      return cookieMap[name] || "";
    }),
    (util.isParamExists = function (param) {
      return void 0 !== param && "" !== param && null !== param;
    }),
    (util.closeModal = function (dialog) {
      (dialog.parentNode.removeChild(dialog),
        0 === document.getElementsByClassName("modalDialog").length &&
          window.removeEventListener("resize", util.resize));
    }),
    (util.resize = function () {
      this.resizeTimer ||
        (this.resizeTimer = window.setTimeout(function () {
          (clearTimeout(this.resizeTimer),
            delete this.resizeTimer,
            util.centeringModalSyncer());
        }, 200));
    }),
    (util.resizeToSwiperProperties = function (swiper, bodySw) {
      if (window.innerWidth > window.innerHeight)
        swiper.params.slidesOffsetAfter = 0;
      else if (window.innerWidth > 700) swiper.params.slidesOffsetAfter = 0;
      else {
        var offsetWidth = bodySw.offsetWidth - window.innerWidth;
        swiper.params.slidesOffsetAfter = offsetWidth;
      }
      swiper.update();
    }),
    (util.centeringModalSyncer = function () {
      var resizeEachModal = function (dialog) {
        if (util.isParamExists(dialog)) {
          var w = window.innerWidth || document.documentElement.clientWidth,
            h = window.innerHeight || document.documentElement.clientHeight,
            cw = dialog.offsetWidth,
            ch = dialog.offsetHeight;
          0 === cw || 0 === ch
            ? window.setTimeout(util.centeringModalSyncer, 0)
            : ((dialog.style.left = (w - cw) / 2 + "px"),
              (dialog.style.top = (h - ch) / 2 + "px"));
        }
      };
      (resizeEachModal(document.getElementsByClassName("generalModal")[0]),
        resizeEachModal(document.getElementsByClassName("mylistModal")[0]),
        resizeEachModal(document.getElementsByClassName("mylistModal")[1]),
        resizeEachModal(document.getElementsByClassName("mylistModal")[2]),
        resizeEachModal(document.getElementsByClassName("mylistModal")[3]),
        resizeEachModal(document.getElementsByClassName("toastOverlay")[0]));
    }),
    (util.showDialog = function (data) {
      var dialogId =
          data.type + new Date().getTime() + Math.random().toString().slice(2),
        modalEl = document.createElement("modal");
      ((modalEl.className = "modalDialog"),
        (modalEl.innerHTML = data.contents),
        modalEl.setAttribute("id", dialogId),
        document.body.appendChild(modalEl),
        window.addEventListener("resize", util.resize));
      var initFunc = function (param) {
          (0 !== modalEl.getElementsByClassName("btnSingle").length &&
            modalEl
              .getElementsByClassName("btnSingle")[0]
              .addEventListener("click", function () {
                param.button1Callback(modalEl);
              }),
            0 !== modalEl.getElementsByClassName("btnLeft").length &&
              modalEl
                .getElementsByClassName("btnLeft")[0]
                .addEventListener("click", function () {
                  param.buttonLeftCallback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("btnRight").length &&
              modalEl
                .getElementsByClassName("btnRight")[0]
                .addEventListener("click", function () {
                  param.buttonRightCallback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("closeBtn").length &&
              modalEl
                .getElementsByClassName("closeBtn")[0]
                .addEventListener("click", function () {
                  param.buttonCloseCallback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("js-newMyList").length &&
              modalEl
                .getElementsByClassName("js-newMyList")[0]
                .addEventListener("click", function () {
                  param.buttonNewMyListCallback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("js-addMyList").length &&
              modalEl
                .getElementsByClassName("js-addMyList")[0]
                .addEventListener("click", function () {
                  param.button1Callback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("js-addNewMyList").length &&
              modalEl
                .getElementsByClassName("js-addNewMyList")[0]
                .addEventListener("click", function () {
                  param.button1Callback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("js-deleteAllMyList").length &&
              modalEl
                .getElementsByClassName("js-deleteAllMyList")[0]
                .addEventListener("click", function () {
                  param.buttonDeleteMyListCallback(modalEl);
                }),
            0 !== modalEl.getElementsByClassName("termsCheck").length &&
              modalEl
                .getElementsByClassName("termsCheck")[0]
                .addEventListener("click", function () {
                  param.buttonTermsCallback(modalEl);
                }),
            util.centeringModalSyncer());
        },
        showDialogEl;
      return (
        "ERROR" === data.type
          ? (initFunc(data), modalEl.classList.add("show"))
          : "DIALOG" === data.type &&
            (initFunc(data),
            (showDialogEl =
              0 !== modalEl.getElementsByClassName("generalModal").length
                ? modalEl.getElementsByClassName("generalModal")[0]
                : modalEl.getElementsByClassName("mylistModal")[0])),
        util.isParamExists(showDialogEl) &&
          (data.update
            ? modalEl.classList.add("show")
            : (util.addClass(showDialogEl, "fadeshow"),
              window.setTimeout(function () {
                util.addClass(showDialogEl, "fadein");
              }, 100))),
        util.centeringModalSyncer(),
        dialogId
      );
    }),
    (util.showMsgBox = function (errId, errMsg, isSingleOk, isSingleClose) {
      var isSingleOk = void 0 !== isSingleOk && isSingleOk,
        isSingleClose = void 0 !== isSingleClose && isSingleClose,
        childWindowUrl = window.location.href;
      (void 0 === errMsg && (errMsg = "動画再生に失敗しました"),
        void 0 === errId && (errId = "49999"),
        (("0" !== errId && "10037" !== errId && "10038" !== errId) ||
          childWindowUrl.match(/playlistId/)) &&
          (errMsg = errMsg + "<br>(エラーコード:" + errId + ")"));
      var dom = "";
      ((dom += '<div class="modalOverlay"></div>'),
        (dom += '<div id = "generalModal" class="generalModal">'),
        (dom += '<div class="textArea">'),
        ("10037" !== errId && "10038" !== errId) ||
        childWindowUrl.match(/playlistId/)
          ? ((dom += '<div class="text webkitScrollbar">' + errMsg + "</div>"),
            (dom += "</div>"))
          : ((dom += '<div class="text webkitScrollbar">' + errMsg),
            (dom +=
              '<a href="javascript: void(0);" onClick=window.opener.location.href="https://"+document.domain+"/animestore/CF/help_qa_age_verification">こちら</a>をご確認ください。<br>(エラーコード: ' +
              errId +
              ")</div>"),
            (dom += "</div>")),
        isSingleOk
          ? ((dom += '<div class="btnSingleArea">'),
            (dom += '<a href="javascript:void(0);" class="btnSingle">OK</a>'),
            (dom += "</div>"))
          : ((dom += '<div class="btnSingleArea">'),
            isSingleClose
              ? (dom +=
                  '<a href="javascript:void(0);" class="btnSingle">閉じる</a>')
              : ((dom +=
                  '<a href="javascript:void(0);" class="btnLeft">再読み込み</a>'),
                (dom +=
                  '<a href="javascript:void(0);" class="btnRight">閉じる</a>')),
            (dom += "</div>")),
        (dom += "</div>"),
        util.showDialog({
          type: "ERROR",
          contents: dom,
          button1Callback: function (dialog) {
            (isSingleOk &&
              (util.closeModal(dialog), 5 === playStatus && window.close()),
              isSingleClose && (util.closeModal(dialog), window.close()));
          },
          buttonLeftCallback: function (dialog) {
            isSingleOk || (util.closeModal(dialog), window.vc.goReplay());
          },
          buttonRightCallback: function (dialog) {
            isSingleOk || (util.closeModal(dialog), window.close());
          },
        }));
    }),
    (util.showToastDialog = function (msg) {
      var toastOverlay = document.getElementsByClassName("toastOverlay")[0];
      util.isParamExists(toastOverlay) &&
        (this.toastTimerId &&
          (clearTimeout(this.toastTimerId), delete this.toastTimerId),
        util.closeModal(toastOverlay));
      var toastEl = document.createElement("div");
      ((toastEl.className = "toastOverlay"),
        (toastEl.innerHTML = '<div class="message">' + msg + "</div>"),
        document.body.appendChild(toastEl),
        window.addEventListener("resize", util.resize),
        util.isParamExists(toastEl) &&
          (util.addClass(toastEl, "fadeshow"),
          (this.toastTimerId = window.setTimeout(function () {
            (clearTimeout(this.toastTimerId),
              util.addClass(toastEl, "fadein"),
              (this.toastTimerId = window.setTimeout(function () {
                (clearTimeout(this.toastTimerId),
                  util.removeClass(toastEl, "fadein"),
                  (this.toastTimerId = window.setTimeout(function () {
                    (clearTimeout(this.toastTimerId),
                      delete this.toastTimerId,
                      util.closeModal(toastEl));
                  }, 1e3)));
              }, 3e3)));
          }, 100))),
        util.centeringModalSyncer());
    }),
    (function ready(fn) {
      "loading" !== document.readyState
        ? fn()
        : (document.addEventListener("DOMContentLoaded", fn),
          -1 !== navigator.userAgent.indexOf("Chrome") &&
            window.outerWidth > screen.availWidth &&
            window.outerHeight > screen.availHeight &&
            (window.resizeTo(screen.availWidth, screen.availHeight),
            window.moveTo(0, 0)));
    })(function () {
      ((restApiUrl = document.getElementById("restApiUrl").value),
        (otherWorkSearchUrl =
          document.getElementById("otherWorkSearchUrl").value),
        (registFavoriteUrl =
          document.getElementById("registFavoriteUrl").value),
        (recommendContentInfoUrl = document.getElementById(
          "getRecommendContentInfoUrl",
        ).value),
        (favoriteStatusUrl = document.getElementById(
          "getFavoriteStatusUrl",
        ).value),
        (sharelistUrl = document.getElementById("getSharelistUrl").value),
        (registSharelistUrl =
          document.getElementById("registSharelistUrl").value),
        (registMylistUrl = document.getElementById("registMylistUrl").value),
        (deleteMylistUrl = document.getElementById("deleteMylistUrl").value),
        (getFeatureListUrl =
          null === document.getElementById("getFeatureListUrl")
            ? null
            : document.getElementById("getFeatureListUrl").value),
        (postingTermsUrl =
          null === document.getElementById("postingTermsUrl")
            ? null
            : document.getElementById("postingTermsUrl").value),
        (window.vc = new VideoController("#video")));
    }),
    (window.util = util));
})(this, this.document);
class SkipUI {
  constructor(wrapprElement, videoController) {
    ((this.taransition = "0.25s"),
      (this.jumptimeValue = 0),
      (this.element = wrapprElement),
      (this.skipButton = this.element.querySelector(".buttonWrapper")),
      (this.cancelButton = this.element.querySelector(".cancelButton")),
      (this.messageLabel = this.element.querySelector(".skipButtonTitle")),
      (this.countdownLabel = this.element.querySelector(".countdown")),
      (this.progressbar = this.element.querySelector("progress")),
      (this.videoEl = document.getElementById("video")),
      (this.runId = null),
      (this.videoController = videoController),
      (this.isActive = !1),
      this.element.addEventListener("transitionend", (e) => {
        ((this.isActive = !this.element.classList.contains("hidden")),
          this.isActive && (this.focusElement = null));
      }),
      document.body.addEventListener("mousemove", () => {
        this.isActive && !this.paused && this.pause();
      }),
      this.skipButton.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), this.activate());
      }),
      this.skipButton.addEventListener("mouseover", (e) => {
        (e.preventDefault(),
          e.stopPropagation(),
          this.focusElement &&
            this.focusElement.classList.remove("focusElement"),
          (this.focusElement = this.skipButton),
          this.focusElement.classList.add("focusElement"));
      }),
      this.cancelButton.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), this.cancel());
      }),
      this.cancelButton.addEventListener("mouseover", (e) => {
        (e.preventDefault(),
          e.stopPropagation(),
          this.focusElement &&
            this.focusElement.classList.remove("focusElement"),
          (this.focusElement = this.cancelButton),
          this.focusElement.classList.add("focusElement"));
      }),
      this.hide(!0));
  }
  get message() {
    return this.messageLabel ? this.messageLabel.innerText : "";
  }
  set message(text) {
    if (!this.messageLabel) return "";
    this.messageLabel.innerText = text;
  }
  get paused() {
    return this.element.classList.contains("paused");
  }
  set paused(value) {
    value
      ? this.element.classList.add("paused")
      : this.element.classList.remove("paused");
  }
  get jumptime() {
    return this.jumptimeValue;
  }
  set jumptime(value) {
    value && (this.jumptimeValue = value / 1e3);
  }
  get focus() {
    return this.focusElement;
  }
  set focus(element) {
    element &&
      (this.focus && this.focusElement.classList.remove("focusElement"),
      (this.focusElement = element),
      this.focusElement.classList.add("focusElement"));
  }
  cancel(immidiate = !1) {
    if (!this.isActive) return;
    this.hide(immidiate);
    let event = new CustomEvent("cancel", { bubbles: !0 });
    (this.element.dispatchEvent(event), (this.focusElement = null));
  }
  activate(immidiate = !1) {
    if (!this.isActive) return;
    switch (this.messageLabel.innerHTML) {
      case "次のエピソードへ":
        this.videoController.goNext();
        break;
      case "再生を終了":
        (this.videoController.procEndedEvent(1),
          this.videoController.showAfterPlayScreen());
        break;
      case "もう一度再生":
        this.videoController.goRepeat();
        break;
      default:
        this.videoEl.currentTime = this.jumptime;
    }
    this.hide(immidiate);
    let event = new CustomEvent("skip", { bubbles: !0 });
    this.element.dispatchEvent(event);
  }
  start(skipWaitTime, startTime = 0) {
    ((this.paused = !1),
      (this.progressbar.max = skipWaitTime),
      (this.progressbar.value = startTime),
      (this.countdownLabel.innerText = Math.ceil(skipWaitTime - startTime)),
      this.show(),
      null != this.runId && (clearInterval(this.runId), (this.runId = null)));
    let count = 100;
    this.runId = setInterval(() => {
      this.progressbar.value < this.progressbar.max
        ? ((this.progressbar.value = this.progressbar.value + 0.01),
          100 == count &&
            ((this.countdownLabel.innerText =
              Math.ceil(this.progressbar.max - this.progressbar.value) + ""),
            (count = 0)),
          (count += 1))
        : (clearInterval(this.runId),
          (this.countdownLabel.innerText = "0"),
          (this.runId = null),
          setTimeout(() => {
            this.activate(!0);
          }, 0));
    }, 10);
  }
  show(immidiate = !1) {
    (immidiate && this.element.classList.add("immidiate"),
      this.element.classList.remove("hidden"),
      immidiate &&
        setTimeout(() => {
          (this.element.classList.remove("immidiate"),
            (this.isActive = !this.element.classList.contains("hidden")));
        }, 1));
  }
  hide(immidiate = !1) {
    (immidiate && this.element.classList.add("immidiate"),
      this.element.classList.add("hidden"),
      immidiate &&
        setTimeout(() => {
          (this.element.classList.remove("immidiate"),
            (this.isActive = !this.element.classList.contains("hidden")));
        }, 1),
      this.focusElement && this.focusElement.classList.remove("focusElement"),
      (this.focusElement = null),
      (this.progressbar.value = 0),
      clearInterval(this.runId),
      (this.runId = null));
  }
  pause() {
    ((this.resumePoint = this.progressbar.value),
      (this.paused = !0),
      clearInterval(this.runId),
      (this.runId = null),
      (this.progressbar.value = 0));
    let event = new CustomEvent("pause", { bubbles: !0 });
    this.element.dispatchEvent(event);
  }
}
