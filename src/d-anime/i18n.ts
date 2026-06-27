import {
  buildSupportedTranslationMap,
  createI18n,
  type LocaleCode,
} from "@/shared/i18n";
import type { NotificationType } from "@/d-anime/services/notification";

type TranslationKey =
  | "color"
  | "commentColor"
  | "commentOpacity"
  | "commentSettings"
  | "commentSettingsPanel"
  | "commentVisibility"
  | "commentVisibilityToggle"
  | "currentVideoUnset"
  | "error"
  | "animeTitle"
  | "autoFillSearchForm"
  | "autoSearch"
  | "autoSearchDescription"
  | "autoSearchDisabledManual"
  | "autoSearchEnabled"
  | "autoSearchInfo"
  | "fixedPlaybackRate"
  | "formInput"
  | "freeInput"
  | "idLoadFailed"
  | "idSaveFailed"
  | "info"
  | "manualSearchLoadFailed"
  | "manualSearchSaveFailed"
  | "manualSearchPlaceholder"
  | "ngRegex"
  | "ngRegexPlaceholder"
  | "ngTab"
  | "ngWords"
  | "ngWordsPlaceholder"
  | "noMessage"
  | "playbackRate"
  | "playbackRateFixedToggle"
  | "postedAt"
  | "commentsSet"
  | "autoSetupComplete"
  | "autoSetupError"
  | "commentsHiddenSkip"
  | "commentsLoadComplete"
  | "commentsLoadErrorSelectAnother"
  | "commentsUnavailable"
  | "commentSourceUpdated"
  | "commentFetchError"
  | "domUpdateWaitFailed"
  | "episodeChangeDetected"
  | "episodeNumberMissing"
  | "episodeSwitchError"
  | "initializationError"
  | "initializingCommentLoader"
  | "manualModeSelectAnimeTitle"
  | "manualModeSelectVideo"
  | "manualModeCommentsLoadComplete"
  | "metadataAutoFetchFailed"
  | "niconicoNotFound"
  | "niconicoNotFoundManual"
  | "nextEpisodeAutoSetupComplete"
  | "nextVideoCommentsUnavailableClear"
  | "noAnimeTitle"
  | "officialVideoMissingUseFirst"
  | "officialVideoMissingManual"
  | "officialVideoSafeguardInfo"
  | "unknownTitle"
  | "structuredInput"
  | "thumbnail"
  | "videoDataMissing"
  | "videoId"
  | "videoOwner"
  | "videoSwitchDetected"
  | "videoSwitchError"
  | "episodeNumber"
  | "episodeTitleOptional"
  | "commentCount"
  | "commentCountLong"
  | "mylistCount"
  | "mylistCountLong"
  | "officialVideoMissing"
  | "searchingKeyword"
  | "searchKeywordRequired"
  | "searchNoResults"
  | "searchFormFilled"
  | "similarity"
  | "viewCount"
  | "viewCountLong"
  | "search"
  | "searchAnimePlaceholder"
  | "searchEpisodeNumberPlaceholder"
  | "searchEpisodeTitlePlaceholder"
  | "searchFreeword"
  | "searchInputModeToggle"
  | "searchPage"
  | "searchTab"
  | "searchVideoHeading"
  | "saveSettings"
  | "settings"
  | "settingsClose"
  | "settingsFabLabel"
  | "playbackLoadFailed"
  | "playbackSaveFailed"
  | "settingsLoadFailed"
  | "settingsSaved"
  | "settingsSaveFailed"
  | "success"
  | "videoDataLoadFailed"
  | "videoDataSaveFailed"
  | "warning";

const translations = buildSupportedTranslationMap(
  {
    ja: {
      color: "カラー",
      commentColor: "コメントカラー",
      commentOpacity: "不透明度",
      commentSettings: "コメント設定",
      commentSettingsPanel: "コメント設定パネル",
      commentVisibility: "コメント表示",
      commentVisibilityToggle: "コメント表示切替",
      currentVideoUnset: "オーバーレイする動画が未設定です",
      error: "エラー",
      animeTitle: "アニメタイトル",
      autoFillSearchForm:
        "検索フォームにタイトル・話数・エピソードタイトルを入力",
      autoSearch: "自動検索",
      autoSearchDescription: "視聴ページ表示時に自動でコメントを設定",
      autoSearchDisabledManual: "自動検索を無効にしました（手動設定モード）",
      autoSearchEnabled: "自動検索を有効にしました",
      autoSearchInfo: "自動検索についての説明",
      fixedPlaybackRate: "速度固定",
      formInput: "フォーム入力",
      freeInput: "自由入力",
      idLoadFailed: "ID情報の読込に失敗しました",
      idSaveFailed: "ID情報の保存に失敗しました",
      info: "情報",
      manualSearchLoadFailed: "検索設定の読込に失敗しました",
      manualSearchSaveFailed: "検索設定の保存に失敗しました",
      manualSearchPlaceholder: "検索キーワードを入力",
      ngRegex: "NG正規表現",
      ngRegexPlaceholder: "NG正規表現を1行ずつ入力",
      ngTab: "NG",
      ngWords: "NGワード",
      ngWordsPlaceholder: "NGワードを1行ずつ入力",
      noMessage: "メッセージはありません",
      playbackRate: "再生速度",
      playbackRateFixedToggle: "再生速度固定ON/OFF",
      postedAt: "投稿日",
      commentsSet: "「{title}」のコメントを設定しました",
      autoSetupComplete: "ニコニコ動画を自動設定しました",
      autoSetupError: "自動設定エラー: {message}",
      commentsHiddenSkip: "コメント非表示設定のためスキップしました",
      commentsLoadComplete: "コメントの読み込みが完了しました（{count}件）",
      commentsLoadErrorSelectAnother:
        "コメント読み込みエラー: {message}\nフローティングボタンから別の動画を選択してください。",
      commentsUnavailable: "コメントを取得できませんでした",
      commentSourceUpdated:
        "コメントソースを更新しました: {title}（{count}件）",
      commentFetchError: "コメント取得エラー: {message}",
      domUpdateWaitFailed: "DOM更新の待機に失敗しました: {message}",
      episodeChangeDetected: "エピソード切り替えを検知しました...",
      episodeNumberMissing: "エピソード話数を取得できませんでした",
      episodeSwitchError: "エピソード切り替えエラー: {message}",
      initializationError: "初期化エラー: {message}",
      initializingCommentLoader: "コメントローダーを初期化中...",
      manualModeSelectAnimeTitle:
        "手動設定モードです。フローティングボタンから検索タブを開いてアニメタイトルを設定してください。",
      manualModeSelectVideo:
        "手動設定モードです。フローティングボタンから検索タブを開いて動画を選択してください。",
      manualModeCommentsLoadComplete:
        "【手動設定モード】コメントの読み込みが完了しました（{count}件）\n動画: {title}",
      metadataAutoFetchFailed:
        "視聴ページからの自動取得に失敗しました。メタデータが取得できませんでした。",
      niconicoNotFound: "ニコニコ動画が見つかりませんでした",
      niconicoNotFoundManual:
        "ニコニコ動画が見つかりませんでした。手動で検索してください。",
      nextEpisodeAutoSetupComplete: "次のエピソードを自動設定しました",
      nextVideoCommentsUnavailableClear:
        "次の動画のコメントを取得できませんでした。コメント表示をクリアします。",
      noAnimeTitle:
        "アニメタイトルが取得できませんでした。検索精度が低下する可能性があります。",
      officialVideoMissingUseFirst:
        "公式動画が見つかりませんでした。検索結果の最初の動画を使用します。",
      officialVideoMissingManual:
        "公式動画が見つかりませんでした。手動で検索してください。",
      officialVideoSafeguardInfo: "公式動画セーフガードについて",
      unknownTitle: "不明なタイトル",
      structuredInput: "詳細入力",
      thumbnail: "サムネイル",
      videoDataMissing: "動画データが見つかりません。",
      videoId: "動画ID",
      videoOwner: "投稿者",
      videoSwitchDetected: "動画の切り替わりを検知しました...",
      videoSwitchError: "動画切り替えエラー: {message}",
      episodeNumber: "話数",
      episodeTitleOptional: "エピソードタイトル（任意）",
      commentCount: "コメント",
      commentCountLong: "コメント数",
      mylistCount: "マイリスト",
      mylistCountLong: "マイリスト数",
      officialVideoMissing:
        "公式動画が見つかりませんでした。全ての検索結果を表示しています。",
      searchingKeyword: "「{keyword}」を検索中...",
      searchKeywordRequired: "検索キーワードを入力してください",
      searchNoResults: "検索結果が見つかりませんでした",
      searchFormFilled: "「{keyword}」を検索フォームに入力しました",
      similarity: "類似度: {score}%",
      viewCount: "再生",
      viewCountLong: "再生数",
      search: "検索",
      searchAnimePlaceholder: "例: 葬送のフリーレン",
      searchEpisodeNumberPlaceholder: "例: 第1話",
      searchEpisodeTitlePlaceholder: "例: 冒険の終わり",
      searchFreeword: "フリーワード検索",
      searchInputModeToggle: "入力モードを切り替え（詳細入力 / 自由入力）",
      searchPage: "検索ページ",
      searchTab: "検索",
      searchVideoHeading: "コメントをオーバーレイする動画を検索",
      saveSettings: "設定を保存",
      settings: "設定",
      settingsClose: "設定を閉じる",
      settingsFabLabel: "ニコニココメント設定を開く",
      playbackLoadFailed: "再生設定の読み込みに失敗しました",
      playbackSaveFailed: "再生設定の保存に失敗しました",
      settingsLoadFailed: "設定の読み込みに失敗しました",
      settingsSaved: "設定を保存しました",
      settingsSaveFailed: "設定の保存に失敗しました",
      success: "成功",
      videoDataLoadFailed: "動画データの読み込みに失敗しました",
      videoDataSaveFailed: "動画データの保存に失敗しました",
      warning: "警告",
    },
    en: {
      color: "Color",
      commentColor: "Comment color",
      commentOpacity: "Opacity",
      commentSettings: "Comment settings",
      commentSettingsPanel: "Comment settings panel",
      commentVisibility: "Show comments",
      commentVisibilityToggle: "Toggle comment visibility",
      currentVideoUnset: "No overlay video is set",
      error: "Error",
      animeTitle: "Anime title",
      autoFillSearchForm:
        "Fill the search form with title, episode number, and episode title",
      autoSearch: "Auto search",
      autoSearchDescription:
        "Set comments automatically when the watch page opens",
      autoSearchDisabledManual: "Auto search disabled (manual setup mode)",
      autoSearchEnabled: "Auto search enabled",
      autoSearchInfo: "About auto search",
      fixedPlaybackRate: "Lock speed",
      formInput: "Fill form",
      freeInput: "Free input",
      idLoadFailed: "Failed to load ID information",
      idSaveFailed: "Failed to save ID information",
      info: "Info",
      manualSearchLoadFailed: "Failed to load search settings",
      manualSearchSaveFailed: "Failed to save search settings",
      manualSearchPlaceholder: "Enter a search keyword",
      ngRegex: "NG regular expressions",
      ngRegexPlaceholder: "Enter one NG regular expression per line",
      ngTab: "NG",
      ngWords: "NG words",
      ngWordsPlaceholder: "Enter one NG word per line",
      noMessage: "No message",
      playbackRate: "Playback speed",
      playbackRateFixedToggle: "Playback speed lock on/off",
      postedAt: "Posted at",
      commentsSet: 'Set comments from "{title}"',
      autoSetupComplete: "Niconico video was set automatically",
      autoSetupError: "Auto setup error: {message}",
      commentsHiddenSkip: "Skipped because comments are hidden in settings",
      commentsLoadComplete: "Finished loading comments ({count})",
      commentsLoadErrorSelectAnother:
        "Comment loading error: {message}\nSelect another video from the floating button.",
      commentsUnavailable: "Could not fetch comments",
      commentSourceUpdated: "Updated comment source: {title} ({count})",
      commentFetchError: "Comment fetch error: {message}",
      domUpdateWaitFailed: "Failed to wait for DOM update: {message}",
      episodeChangeDetected: "Detected episode change...",
      episodeNumberMissing: "Could not get the episode number",
      episodeSwitchError: "Episode switch error: {message}",
      initializationError: "Initialization error: {message}",
      initializingCommentLoader: "Initializing comment loader...",
      manualModeSelectAnimeTitle:
        "Manual mode is enabled. Open the Search tab from the floating button and set an anime title.",
      manualModeSelectVideo:
        "Manual mode is enabled. Open the Search tab from the floating button and select a video.",
      manualModeCommentsLoadComplete:
        "[Manual mode] Finished loading comments ({count})\nVideo: {title}",
      metadataAutoFetchFailed:
        "Automatic fetch from the watch page failed. Metadata could not be acquired.",
      niconicoNotFound: "No Niconico video was found",
      niconicoNotFoundManual: "No Niconico video was found. Search manually.",
      nextEpisodeAutoSetupComplete: "Set up the next episode automatically",
      nextVideoCommentsUnavailableClear:
        "Could not fetch comments for the next video. Clearing comment display.",
      noAnimeTitle:
        "Could not get the anime title. Search accuracy may be reduced.",
      officialVideoMissingUseFirst:
        "No official video was found. Using the first search result.",
      officialVideoMissingManual:
        "No official video was found. Search manually.",
      officialVideoSafeguardInfo: "About the official video safeguard",
      unknownTitle: "Unknown title",
      structuredInput: "Detailed input",
      thumbnail: "Thumbnail",
      videoDataMissing: "Video data was not found.",
      videoId: "Video ID",
      videoOwner: "Uploader",
      videoSwitchDetected: "Detected video switch...",
      videoSwitchError: "Video switch error: {message}",
      episodeNumber: "Episode number",
      episodeTitleOptional: "Episode title (optional)",
      commentCount: "Comments",
      commentCountLong: "Comment count",
      mylistCount: "Mylist",
      mylistCountLong: "Mylist count",
      officialVideoMissing:
        "No official video was found. Showing all search results.",
      searchingKeyword: 'Searching for "{keyword}"...',
      searchKeywordRequired: "Enter a search keyword",
      searchNoResults: "No search results were found",
      searchFormFilled: 'Filled the search form with "{keyword}"',
      similarity: "Similarity: {score}%",
      viewCount: "Views",
      viewCountLong: "View count",
      search: "Search",
      searchAnimePlaceholder: "Example: Frieren: Beyond Journey's End",
      searchEpisodeNumberPlaceholder: "Example: Episode 1",
      searchEpisodeTitlePlaceholder: "Example: The Journey's End",
      searchFreeword: "Free-word search",
      searchInputModeToggle: "Switch input mode (detailed / free input)",
      searchPage: "Search page",
      searchTab: "Search",
      searchVideoHeading: "Search for the video to overlay comments from",
      saveSettings: "Save settings",
      settings: "Settings",
      settingsClose: "Close settings",
      settingsFabLabel: "Open Niconico comment settings",
      playbackLoadFailed: "Failed to load playback settings",
      playbackSaveFailed: "Failed to save playback settings",
      settingsLoadFailed: "Failed to load settings",
      settingsSaved: "Settings saved",
      settingsSaveFailed: "Failed to save settings",
      success: "Success",
      videoDataLoadFailed: "Failed to load video data",
      videoDataSaveFailed: "Failed to save video data",
      warning: "Warning",
    },
    "zh-Hans": {
      color: "颜色",
      commentColor: "评论颜色",
      commentOpacity: "不透明度",
      commentSettings: "评论设置",
      commentSettingsPanel: "评论设置面板",
      commentVisibility: "显示评论",
      commentVisibilityToggle: "切换评论可见性",
      currentVideoUnset: "未设置叠加视频",
      error: "错误",
      animeTitle: "动漫标题",
      autoFillSearchForm: "在搜索表单中填写标题、剧集编号和剧集标题",
      autoSearch: "自动搜索",
      autoSearchDescription: "观看页面打开时自动设置评论",
      autoSearchDisabledManual: "自动搜索禁用（手动设置模式）",
      autoSearchEnabled: "自动搜索已启用",
      autoSearchInfo: "关于自动搜索",
      fixedPlaybackRate: "锁定速度",
      formInput: "填写表格",
      freeInput: "自由输入",
      idLoadFailed: "加载ID信息失败",
      idSaveFailed: "保存ID信息失败",
      info: "信息",
      manualSearchLoadFailed: "无法加载搜索设置",
      manualSearchSaveFailed: "无法保存搜索设置",
      manualSearchPlaceholder: "输入搜索关键字",
      ngRegex: "NG正则表达式",
      ngRegexPlaceholder: "每行输入一个 NG 正则表达式",
      ngTab: "不合格",
      ngWords: "NG词",
      ngWordsPlaceholder: "每行输入一个 NG 字",
      noMessage: "没有消息",
      playbackRate: "播放速度",
      playbackRateFixedToggle: "播放速度锁定开/关",
      postedAt: "发表于",
      commentsSet: "设置来自“{title}”的评论",
      autoSetupComplete: "Niconico 视频已自动设置",
      autoSetupError: "自动设置错误：{message}",
      commentsHiddenSkip: "已跳过，因为评论隐藏在设置中",
      commentsLoadComplete: "评论加载完毕({count})",
      commentsLoadErrorSelectAnother:
        "评论加载错误：{message}\\n从浮动按钮中选择另一个视频。",
      commentsUnavailable: "无法获取评论",
      commentSourceUpdated: "更新评论来源：{title}（{count}）",
      commentFetchError: "评论获取错误：{message}",
      domUpdateWaitFailed: "无法等待 DOM 更新：{message}",
      episodeChangeDetected: "检测到情节变化...",
      episodeNumberMissing: "无法获取剧集编号",
      episodeSwitchError: "剧集切换错误：{message}",
      initializationError: "初始化错误：{message}",
      initializingCommentLoader: "正在初始化评论加载器...",
      manualModeSelectAnimeTitle:
        "手动模式已启用。从浮动按钮打开“搜索”选项卡并设置动漫标题。",
      manualModeSelectVideo:
        "手动模式已启用。从浮动按钮打开“搜索”选项卡并选择一个视频。",
      manualModeCommentsLoadComplete:
        "[手动模式]评论加载完毕({count})\\n视频：{title}",
      metadataAutoFetchFailed: "从观看页面自动获取失败。无法获取元数据。",
      niconicoNotFound: "未找到 Niconico 视频",
      niconicoNotFoundManual: "未找到 Niconico 视频。手动搜索。",
      nextEpisodeAutoSetupComplete: "自动设置下一集",
      nextVideoCommentsUnavailableClear:
        "无法获取下一个视频的评论。清除评论显示。",
      noAnimeTitle: "无法获取动画标题。搜索准确度可能会降低。",
      officialVideoMissingUseFirst: "没有找到官方视频。使用第一个搜索结果。",
      officialVideoMissingManual: "没有找到官方视频。手动搜索。",
      officialVideoSafeguardInfo: "关于官方视频保障",
      unknownTitle: "未知标题",
      structuredInput: "详细输入",
      thumbnail: "缩略图",
      videoDataMissing: "未找到视频数据。",
      videoId: "视频ID",
      videoOwner: "上传者",
      videoSwitchDetected: "检测到视频切换...",
      videoSwitchError: "视频切换错误：{message}",
      episodeNumber: "集数",
      episodeTitleOptional: "剧集标题（可选）",
      commentCount: "评论",
      commentCountLong: "评论数",
      mylistCount: "我的列表",
      mylistCountLong: "我的列表计数",
      officialVideoMissing: "没有找到官方视频。显示所有搜索结果。",
      searchingKeyword: "正在搜索“{keyword}”...",
      searchKeywordRequired: "输入搜索关键字",
      searchNoResults: "没有找到搜索结果",
      searchFormFilled: "在搜索表单中填写“{keyword}”",
      similarity: "相似度：{score}%",
      viewCount: "意见",
      viewCountLong: "观看次数",
      search: "搜索",
      searchAnimePlaceholder: "示例：Frieren：超越旅程的终点",
      searchEpisodeNumberPlaceholder: "示例：第 1 集",
      searchEpisodeTitlePlaceholder: "示例：旅程的终点",
      searchFreeword: "自由词搜索",
      searchInputModeToggle: "切换输入模式（详细/自由输入）",
      searchPage: "搜索页面",
      searchTab: "搜索",
      searchVideoHeading: "搜索要覆盖评论的视频",
      saveSettings: "保存设置",
      settings: "设置",
      settingsClose: "关闭设置",
      settingsFabLabel: "打开niconico评论设置",
      playbackLoadFailed: "无法加载播放设置",
      playbackSaveFailed: "无法保存播放设置",
      settingsLoadFailed: "无法加载设置",
      settingsSaved: "设置已保存",
      settingsSaveFailed: "保存设置失败",
      success: "成功",
      videoDataLoadFailed: "视频数据加载失败",
      videoDataSaveFailed: "保存视频数据失败",
      warning: "警告",
    },
    hi: {
      color: "रंग",
      commentColor: "टिप्पणी रंग",
      commentOpacity: "अपारदर्शिता",
      commentSettings: "टिप्पणी सेटिंग",
      commentSettingsPanel: "टिप्पणी सेटिंग पैनल",
      commentVisibility: "टिप्पणियाँ दिखाएँ",
      commentVisibilityToggle: "टिप्पणी दृश्यता टॉगल करें",
      currentVideoUnset: "कोई ओवरले वीडियो सेट नहीं है",
      error: "त्रुटि",
      animeTitle: "एनीमे शीर्षक",
      autoFillSearchForm:
        "शीर्षक, एपिसोड संख्या और एपिसोड शीर्षक के साथ खोज फ़ॉर्म भरें",
      autoSearch: "स्वतः खोज",
      autoSearchDescription:
        "दृश्य पृष्ठ खुलने पर स्वचालित रूप से टिप्पणियाँ सेट करें",
      autoSearchDisabledManual: "स्वतः खोज अक्षम (मैन्युअल सेटअप मोड)",
      autoSearchEnabled: "स्वतः खोज सक्षम",
      autoSearchInfo: "ऑटो खोज के बारे में",
      fixedPlaybackRate: "लॉक स्पीड",
      formInput: "फॉर्म भरें",
      freeInput: "मुफ़्त इनपुट",
      idLoadFailed: "आईडी जानकारी लोड करने में विफल",
      idSaveFailed: "आईडी जानकारी सहेजने में विफल",
      info: "जानकारी",
      manualSearchLoadFailed: "खोज सेटिंग लोड करने में विफल",
      manualSearchSaveFailed: "खोज सेटिंग सहेजने में विफल",
      manualSearchPlaceholder: "एक खोज कीवर्ड दर्ज करें",
      ngRegex: "एनजी नियमित अभिव्यक्ति",
      ngRegexPlaceholder: "प्रति पंक्ति एक एनजी रेगुलर एक्सप्रेशन दर्ज करें",
      ngTab: "एनजी",
      ngWords: "एनजी शब्द",
      ngWordsPlaceholder: "प्रति पंक्ति एक एनजी शब्द दर्ज करें",
      noMessage: "कोई संदेश नहीं",
      playbackRate: "प्लेबैक गति",
      playbackRateFixedToggle: "प्लेबैक स्पीड लॉक चालू/बंद",
      postedAt: "पर पोस्ट किया गया",
      commentsSet: '"{title}" से टिप्पणियाँ सेट करें',
      autoSetupComplete: "निकोनिको वीडियो स्वचालित रूप से सेट किया गया था",
      autoSetupError: "स्वतः सेटअप त्रुटि: {message}",
      commentsHiddenSkip:
        "छोड़ दिया गया क्योंकि टिप्पणियाँ सेटिंग्स में छिपी हुई हैं",
      commentsLoadComplete: "टिप्पणियाँ लोड करना समाप्त ({count})",
      commentsLoadErrorSelectAnother:
        "टिप्पणी लोड करने में त्रुटि: {message}\\nफ़्लोटिंग बटन से कोई अन्य वीडियो चुनें।",
      commentsUnavailable: "टिप्पणियाँ प्राप्त नहीं की जा सकीं",
      commentSourceUpdated: "अद्यतन टिप्पणी स्रोत: {title} ({count})",
      commentFetchError: "टिप्पणी लाने में त्रुटि: {message}",
      domUpdateWaitFailed:
        "DOM अपडेट के लिए प्रतीक्षा करने में विफल: {message}",
      episodeChangeDetected: "एपिसोड में बदलाव का पता चला...",
      episodeNumberMissing: "एपिसोड नंबर नहीं मिल सका",
      episodeSwitchError: "एपिसोड स्विच त्रुटि: {message}",
      initializationError: "आरंभीकरण त्रुटि: {message}",
      initializingCommentLoader: "टिप्पणी लोडर प्रारंभ किया जा रहा है...",
      manualModeSelectAnimeTitle:
        "मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एनीमे शीर्षक सेट करें।",
      manualModeSelectVideo:
        "मैनुअल मोड सक्षम है. फ़्लोटिंग बटन से खोज टैब खोलें और एक वीडियो चुनें।",
      manualModeCommentsLoadComplete:
        "[मैन्युअल मोड] टिप्पणियाँ लोड करना समाप्त ({count})\\nवीडियो: {title}",
      metadataAutoFetchFailed:
        "दृश्य पृष्ठ से स्वचालित फ़ेच विफल रहा. मेटाडेटा प्राप्त नहीं किया जा सका.",
      niconicoNotFound: "कोई निकोनिको वीडियो नहीं मिला",
      niconicoNotFoundManual:
        "कोई निकोनिको वीडियो नहीं मिला. मैन्युअल रूप से खोजें.",
      nextEpisodeAutoSetupComplete: "अगला एपिसोड स्वचालित रूप से सेट करें",
      nextVideoCommentsUnavailableClear:
        "अगले वीडियो के लिए टिप्पणियाँ नहीं मिल सकीं. टिप्पणी प्रदर्शन साफ़ करना.",
      noAnimeTitle: "एनीमे शीर्षक नहीं मिल सका. खोज सटीकता कम हो सकती है.",
      officialVideoMissingUseFirst:
        "कोई आधिकारिक वीडियो नहीं मिला. पहले खोज परिणाम का उपयोग करना.",
      officialVideoMissingManual:
        "कोई आधिकारिक वीडियो नहीं मिला. मैन्युअल रूप से खोजें.",
      officialVideoSafeguardInfo: "आधिकारिक वीडियो सुरक्षा के बारे में",
      unknownTitle: "अज्ञात शीर्षक",
      structuredInput: "विस्तृत इनपुट",
      thumbnail: "थंबनेल",
      videoDataMissing: "वीडियो डेटा नहीं मिला.",
      videoId: "वीडियो आईडी",
      videoOwner: "अपलोडर",
      videoSwitchDetected: "वीडियो स्विच का पता चला...",
      videoSwitchError: "वीडियो स्विच त्रुटि: {message}",
      episodeNumber: "एपिसोड नंबर",
      episodeTitleOptional: "एपिसोड का शीर्षक (वैकल्पिक)",
      commentCount: "टिप्पणियाँ",
      commentCountLong: "टिप्पणी गिनती",
      mylistCount: "मेरी सूची",
      mylistCountLong: "मेरी सूची गिनती",
      officialVideoMissing:
        "कोई आधिकारिक वीडियो नहीं मिला. सभी खोज परिणाम दिखाए जा रहे हैं.",
      searchingKeyword: '"{keyword}" खोज रहे हैं...',
      searchKeywordRequired: "एक खोज कीवर्ड दर्ज करें",
      searchNoResults: "कोई खोज परिणाम नहीं मिला",
      searchFormFilled: 'खोज फ़ॉर्म को "{keyword}" से भरें',
      similarity: "समानता: {score}%",
      viewCount: "दृश्य",
      viewCountLong: "देखने की संख्या",
      search: "खोजें",
      searchAnimePlaceholder: "उदाहरण: फ्रिरेन: बियॉन्ड जर्नीज़ एंड",
      searchEpisodeNumberPlaceholder: "उदाहरण: एपिसोड 1",
      searchEpisodeTitlePlaceholder: "उदाहरण: यात्रा का अंत",
      searchFreeword: "निःशुल्क शब्द खोज",
      searchInputModeToggle: "इनपुट मोड स्विच करें (विस्तृत / निःशुल्क इनपुट)",
      searchPage: "पेज खोजें",
      searchTab: "खोजें",
      searchVideoHeading: "टिप्पणियों को ओवरले करने के लिए वीडियो खोजें",
      saveSettings: "सेटिंग्स सहेजें",
      settings: "सेटिंग्स",
      settingsClose: "सेटिंग्स बंद करें",
      settingsFabLabel: "निकोनिको टिप्पणी सेटिंग खोलें",
      playbackLoadFailed: "प्लेबैक सेटिंग लोड करने में विफल",
      playbackSaveFailed: "प्लेबैक सेटिंग सहेजने में विफल",
      settingsLoadFailed: "सेटिंग्स लोड करने में विफल",
      settingsSaved: "सेटिंग्स सहेजी गईं",
      settingsSaveFailed: "सेटिंग्स सहेजने में विफल",
      success: "सफलता",
      videoDataLoadFailed: "वीडियो डेटा लोड करने में विफल",
      videoDataSaveFailed: "वीडियो डेटा सहेजने में विफल",
      warning: "चेतावनी",
    },
    es: {
      color: "Color",
      commentColor: "Color del comentario",
      commentOpacity: "Opacidad",
      commentSettings: "Configuración de comentarios",
      commentSettingsPanel: "Panel de configuración de comentarios",
      commentVisibility: "Mostrar comentarios",
      commentVisibilityToggle: "Alternar visibilidad de comentarios",
      currentVideoUnset: "No se ha establecido ningún vídeo superpuesto",
      error: "error",
      animeTitle: "Título del anime",
      autoFillSearchForm:
        "Complete el formulario de búsqueda con título, número de episodio y título del episodio.",
      autoSearch: "Búsqueda automática",
      autoSearchDescription:
        "Establecer comentarios automáticamente cuando se abre la página de visualización",
      autoSearchDisabledManual:
        "Búsqueda automática deshabilitada (modo de configuración manual)",
      autoSearchEnabled: "Búsqueda automática habilitada",
      autoSearchInfo: "Acerca de la búsqueda automática",
      fixedPlaybackRate: "Velocidad de bloqueo",
      formInput: "Rellenar formulario",
      freeInput: "Entrada libre",
      idLoadFailed: "No se pudo cargar la información de identificación",
      idSaveFailed: "No se pudo guardar la información de identificación",
      info: "Información",
      manualSearchLoadFailed: "No se pudo cargar la configuración de búsqueda",
      manualSearchSaveFailed: "No se pudo guardar la configuración de búsqueda",
      manualSearchPlaceholder: "Introduzca una palabra clave de búsqueda",
      ngRegex: "NG expresiones regulares",
      ngRegexPlaceholder: "Ingrese una expresión regular NG por línea",
      ngTab: "NG",
      ngWords: "palabras NG",
      ngWordsPlaceholder: "Ingrese una palabra NG por línea",
      noMessage: "Ningún mensaje",
      playbackRate: "Velocidad de reproducción",
      playbackRateFixedToggle:
        "Activar/desactivar bloqueo de velocidad de reproducción",
      postedAt: "Publicado en",
      commentsSet: 'Establecer comentarios de "{title}"',
      autoSetupComplete: "El vídeo de Niconico se configuró automáticamente.",
      autoSetupError: "Error de configuración automática: {message}",
      commentsHiddenSkip:
        "Omitido porque los comentarios están ocultos en la configuración",
      commentsLoadComplete: "Terminado de cargar comentarios ({count})",
      commentsLoadErrorSelectAnother:
        "Error al cargar el comentario: {message}\\nSelecciona otro vídeo desde el botón flotante.",
      commentsUnavailable: "No se pudieron recuperar los comentarios",
      commentSourceUpdated:
        "Fuente de comentarios actualizada: {title} ({count})",
      commentFetchError: "Error al recuperar el comentario: {message}",
      domUpdateWaitFailed:
        "No se pudo esperar la actualización de DOM: {message}",
      episodeChangeDetected: "Cambio de episodio detectado...",
      episodeNumberMissing: "No se pudo obtener el número del episodio.",
      episodeSwitchError: "Error de cambio de episodio: {message}",
      initializationError: "Error de inicialización: {message}",
      initializingCommentLoader: "Inicializando el cargador de comentarios...",
      manualModeSelectAnimeTitle:
        "El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y establezca un título de anime.",
      manualModeSelectVideo:
        "El modo manual está habilitado. Abra la pestaña Buscar desde el botón flotante y seleccione un video.",
      manualModeCommentsLoadComplete:
        "[Modo manual] Finalizado la carga de comentarios ({count}) Vídeo\\n: {title}",
      metadataAutoFetchFailed:
        "Error en la búsqueda automática desde la página de visualización. No se pudieron adquirir los metadatos.",
      niconicoNotFound: "No se encontró ningún vídeo de Niconico",
      niconicoNotFoundManual:
        "No se encontró ningún vídeo de Niconico. Buscar manualmente.",
      nextEpisodeAutoSetupComplete:
        "Configurar el siguiente episodio automáticamente",
      nextVideoCommentsUnavailableClear:
        "No se pudieron obtener comentarios para el siguiente video. Borrar visualización de comentarios.",
      noAnimeTitle:
        "No se pudo obtener el título del anime. La precisión de la búsqueda puede verse reducida.",
      officialVideoMissingUseFirst:
        "No se encontró ningún vídeo oficial. Usando el primer resultado de búsqueda.",
      officialVideoMissingManual:
        "No se encontró ningún vídeo oficial. Buscar manualmente.",
      officialVideoSafeguardInfo: "Acerca de la salvaguardia oficial del vídeo",
      unknownTitle: "Título desconocido",
      structuredInput: "Entrada detallada",
      thumbnail: "Miniatura",
      videoDataMissing: "No se encontraron datos de vídeo.",
      videoId: "Identificación de vídeo",
      videoOwner: "Cargador",
      videoSwitchDetected: "Cambio de vídeo detectado...",
      videoSwitchError: "Error de cambio de vídeo: {message}",
      episodeNumber: "Número de episodio",
      episodeTitleOptional: "Título del episodio (opcional)",
      commentCount: "Comentarios",
      commentCountLong: "Recuento de comentarios",
      mylistCount: "Mi lista",
      mylistCountLong: "Recuento de mi lista",
      officialVideoMissing:
        "No se encontró ningún vídeo oficial. Mostrando todos los resultados de la búsqueda.",
      searchingKeyword: 'Buscando "{keyword}"...',
      searchKeywordRequired: "Introduzca una palabra clave de búsqueda",
      searchNoResults: "No se encontraron resultados de búsqueda",
      searchFormFilled: 'Rellenó el formulario de búsqueda con "{keyword}"',
      similarity: "Similitud: {score}%",
      viewCount: "Vistas",
      viewCountLong: "Ver recuento",
      search: "Buscar",
      searchAnimePlaceholder: "Ejemplo: Frieren: Más allá del fin del viaje",
      searchEpisodeNumberPlaceholder: "Ejemplo: episodio 1",
      searchEpisodeTitlePlaceholder: "Ejemplo: el fin del viaje",
      searchFreeword: "Búsqueda de palabras libre",
      searchInputModeToggle:
        "Cambiar modo de entrada (entrada detallada/libre)",
      searchPage: "Página de búsqueda",
      searchTab: "Buscar",
      searchVideoHeading: "Busque el vídeo para superponer comentarios",
      saveSettings: "Guardar configuración",
      settings: "Configuración",
      settingsClose: "Cerrar configuración",
      settingsFabLabel: "Abrir la configuración de comentarios de Niconico",
      playbackLoadFailed: "No se pudo cargar la configuración de reproducción",
      playbackSaveFailed: "No se pudo guardar la configuración de reproducción",
      settingsLoadFailed: "No se pudo cargar la configuración",
      settingsSaved: "Configuración guardada",
      settingsSaveFailed: "No se pudo guardar la configuración",
      success: "Éxito",
      videoDataLoadFailed: "No se pudieron cargar los datos del video",
      videoDataSaveFailed: "No se pudieron guardar los datos del video",
      warning: "Advertencia",
    },
    fr: {
      color: "Couleur",
      commentColor: "Couleur du commentaire",
      commentOpacity: "Opacité",
      commentSettings: "Paramètres des commentaires",
      commentSettingsPanel: "Panneau de paramètres des commentaires",
      commentVisibility: "Afficher les commentaires",
      commentVisibilityToggle:
        "Activer/désactiver la visibilité des commentaires",
      currentVideoUnset: "Aucune vidéo de superposition n'est définie",
      error: "Erreur",
      animeTitle: "Titre de l'anime",
      autoFillSearchForm:
        "Remplissez le formulaire de recherche avec le titre, le numéro de l'épisode et le titre de l'épisode",
      autoSearch: "Recherche automatique",
      autoSearchDescription:
        "Définir automatiquement les commentaires à l'ouverture de la page de lecture",
      autoSearchDisabledManual:
        "Recherche automatique désactivée (mode de configuration manuelle)",
      autoSearchEnabled: "Recherche automatique activée",
      autoSearchInfo: "À propos de la recherche automatique",
      fixedPlaybackRate: "Vitesse de verrouillage",
      formInput: "Remplir le formulaire",
      freeInput: "Entrée gratuite",
      idLoadFailed: "Échec du chargement des informations d'identification",
      idSaveFailed:
        "Échec de l'enregistrement des informations d'identification",
      info: "Informations",
      manualSearchLoadFailed: "Échec du chargement des paramètres de recherche",
      manualSearchSaveFailed:
        "Échec de l'enregistrement des paramètres de recherche",
      manualSearchPlaceholder: "Entrez un mot-clé de recherche",
      ngRegex: "Expressions régulières NG",
      ngRegexPlaceholder: "Entrez une expression régulière NG par ligne",
      ngTab: "NG",
      ngWords: "Mots NG",
      ngWordsPlaceholder: "Entrez un mot NG par ligne",
      noMessage: "Aucun message",
      playbackRate: "Vitesse de lecture",
      playbackRateFixedToggle:
        "Verrouillage de la vitesse de lecture activé/désactivé",
      postedAt: "Publié à",
      commentsSet: 'Définir les commentaires de "{title}"',
      autoSetupComplete: "La vidéo de Niconico a été réglée automatiquement",
      autoSetupError: "Erreur de configuration automatique : {message}",
      commentsHiddenSkip:
        "Ignoré car les commentaires sont masqués dans les paramètres",
      commentsLoadComplete: "Chargement des commentaires terminé ({count})",
      commentsLoadErrorSelectAnother:
        "Erreur de chargement du commentaire : {message}\\nSélectionnez une autre vidéo à partir du bouton flottant.",
      commentsUnavailable: "Impossible de récupérer les commentaires",
      commentSourceUpdated:
        "Source des commentaires mise à jour : {title} ({count})",
      commentFetchError: "Erreur de récupération des commentaires : {message}",
      domUpdateWaitFailed:
        "Échec de l'attente de la mise à jour du DOM : {message}",
      episodeChangeDetected: "Changement d'épisode détecté...",
      episodeNumberMissing: "Impossible d'obtenir le numéro de l'épisode",
      episodeSwitchError: "Erreur de changement d'épisode : {message}",
      initializationError: "Erreur d'initialisation : {message}",
      initializingCommentLoader:
        "Initialisation du chargeur de commentaires...",
      manualModeSelectAnimeTitle:
        "Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et définissez un titre d'anime.",
      manualModeSelectVideo:
        "Le mode manuel est activé. Ouvrez l'onglet Recherche à partir du bouton flottant et sélectionnez une vidéo.",
      manualModeCommentsLoadComplete:
        "[Mode manuel] Fin du chargement des commentaires ({count}) Vidéo\\n: {title}",
      metadataAutoFetchFailed:
        "La récupération automatique à partir de la page de lecture a échoué. Les métadonnées n'ont pas pu être acquises.",
      niconicoNotFound: "Aucune vidéo Niconico n'a été trouvée",
      niconicoNotFoundManual:
        "Aucune vidéo Niconico n’a été trouvée. Recherchez manuellement.",
      nextEpisodeAutoSetupComplete:
        "Configurer automatiquement le prochain épisode",
      nextVideoCommentsUnavailableClear:
        "Impossible de récupérer les commentaires pour la prochaine vidéo. Effacement de l'affichage des commentaires.",
      noAnimeTitle:
        "Impossible d'obtenir le titre de l'anime. La précision de la recherche peut être réduite.",
      officialVideoMissingUseFirst:
        "Aucune vidéo officielle n'a été trouvée. Utilisation du premier résultat de recherche.",
      officialVideoMissingManual:
        "Aucune vidéo officielle n'a été trouvée. Recherchez manuellement.",
      officialVideoSafeguardInfo: "À propos de la sauvegarde vidéo officielle",
      unknownTitle: "Titre inconnu",
      structuredInput: "Entrée détaillée",
      thumbnail: "Miniature",
      videoDataMissing: "Les données vidéo n'ont pas été trouvées.",
      videoId: "ID vidéo",
      videoOwner: "Téléchargeur",
      videoSwitchDetected: "Commutateur vidéo détecté...",
      videoSwitchError: "Erreur de commutation vidéo : {message}",
      episodeNumber: "Numéro de l'épisode",
      episodeTitleOptional: "Titre de l'épisode (facultatif)",
      commentCount: "Commentaires",
      commentCountLong: "Nombre de commentaires",
      mylistCount: "Ma liste",
      mylistCountLong: "Nombre de ma liste",
      officialVideoMissing:
        "Aucune vidéo officielle n'a été trouvée. Affichage de tous les résultats de recherche.",
      searchingKeyword: 'Recherche de "{keyword}"...',
      searchKeywordRequired: "Entrez un mot-clé de recherche",
      searchNoResults: "Aucun résultat de recherche n'a été trouvé",
      searchFormFilled: 'Rempli le formulaire de recherche avec "{keyword}"',
      similarity: "Similitude : {score} %",
      viewCount: "Vues",
      viewCountLong: "Nombre de vues",
      search: "Rechercher",
      searchAnimePlaceholder: "Exemple : Frieren : Au-delà de la fin du voyage",
      searchEpisodeNumberPlaceholder: "Exemple : Épisode 1",
      searchEpisodeTitlePlaceholder: "Exemple : la fin du voyage",
      searchFreeword: "Recherche de mots libre",
      searchInputModeToggle:
        "Changer le mode d'entrée (entrée détaillée/libre)",
      searchPage: "Page de recherche",
      searchTab: "Rechercher",
      searchVideoHeading:
        "Recherchez la vidéo à partir de laquelle superposer les commentaires",
      saveSettings: "Enregistrer les paramètres",
      settings: "Paramètres",
      settingsClose: "Fermer les paramètres",
      settingsFabLabel: "Ouvrir les paramètres des commentaires Niconico",
      playbackLoadFailed: "Échec du chargement des paramètres de lecture",
      playbackSaveFailed: "Échec de l'enregistrement des paramètres de lecture",
      settingsLoadFailed: "Échec du chargement des paramètres",
      settingsSaved: "Paramètres enregistrés",
      settingsSaveFailed: "Échec de l'enregistrement des paramètres",
      success: "Succès",
      videoDataLoadFailed: "Échec du chargement des données vidéo",
      videoDataSaveFailed: "Échec de l'enregistrement des données vidéo",
      warning: "Avertissement",
    },
    ar: {
      color: "اللون",
      commentColor: "لون التعليق",
      commentOpacity: "العتامة",
      commentSettings: "إعدادات التعليق",
      commentSettingsPanel: "لوحة إعدادات التعليق",
      commentVisibility: "عرض التعليقات",
      commentVisibilityToggle: "تبديل رؤية التعليق",
      currentVideoUnset: "لم يتم تعيين أي فيديو متراكب",
      error: "خطأ",
      animeTitle: "عنوان الأنمي",
      autoFillSearchForm: "املأ نموذج البحث بالعنوان ورقم الحلقة وعنوان الحلقة",
      autoSearch: "البحث التلقائي",
      autoSearchDescription:
        "قم بتعيين التعليقات تلقائيًا عند فتح صفحة المشاهدة",
      autoSearchDisabledManual: "تم تعطيل البحث التلقائي (وضع الإعداد اليدوي)",
      autoSearchEnabled: "تم تمكين البحث التلقائي",
      autoSearchInfo: "حول البحث التلقائي",
      fixedPlaybackRate: "سرعة القفل",
      formInput: "ملء النموذج",
      freeInput: "مدخلات مجانية",
      idLoadFailed: "فشل تحميل معلومات الهوية",
      idSaveFailed: "فشل في حفظ معلومات الهوية",
      info: "معلومات",
      manualSearchLoadFailed: "فشل تحميل إعدادات البحث",
      manualSearchSaveFailed: "فشل في حفظ إعدادات البحث",
      manualSearchPlaceholder: "أدخل كلمة رئيسية للبحث",
      ngRegex: "NG التعبيرات العادية",
      ngRegexPlaceholder: "أدخل تعبيرًا عاديًا NG واحدًا في كل سطر",
      ngTab: "نانوغرام",
      ngWords: "كلمات نانوغرام",
      ngWordsPlaceholder: "أدخل كلمة NG واحدة في كل سطر",
      noMessage: "لا توجد رسالة",
      playbackRate: "سرعة التشغيل",
      playbackRateFixedToggle: "تشغيل/إيقاف قفل سرعة التشغيل",
      postedAt: "نشر في",
      commentsSet: 'تعيين التعليقات من "{title}"',
      autoSetupComplete: "تم ضبط فيديو Niconico تلقائيًا",
      autoSetupError: "خطأ في الإعداد التلقائي: {message}",
      commentsHiddenSkip: "تم تخطيه لأن التعليقات مخفية في الإعدادات",
      commentsLoadComplete: "تم الانتهاء من تحميل التعليقات ({count})",
      commentsLoadErrorSelectAnother:
        "خطأ في تحميل التعليق: {message}\\nحدد فيديو آخر من الزر العائم.",
      commentsUnavailable: "تعذر جلب التعليقات",
      commentSourceUpdated: "مصدر التعليق المحدث: {title} ({count})",
      commentFetchError: "خطأ في جلب التعليق: {message}",
      domUpdateWaitFailed: "فشل في انتظار تحديث DOM: {message}",
      episodeChangeDetected: "تم الكشف عن تغيير الحلقة...",
      episodeNumberMissing: "لم أستطع الحصول على رقم الحلقة",
      episodeSwitchError: "خطأ في تبديل الحلقة: {message}",
      initializationError: "خطأ في التهيئة: {message}",
      initializingCommentLoader: "جارٍ تهيئة أداة تحميل التعليقات...",
      manualModeSelectAnimeTitle:
        'تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وقم بتعيين عنوان لأنمي.',
      manualModeSelectVideo:
        'تم تمكين الوضع اليدوي. افتح علامة التبويب "بحث" من الزر العائم وحدد مقطع فيديو.',
      manualModeCommentsLoadComplete:
        "[الوضع اليدوي] انتهى تحميل التعليقات ({count}) فيديو\\n: {title}",
      metadataAutoFetchFailed:
        "فشل الجلب التلقائي من صفحة المشاهدة. لا يمكن الحصول على بيانات التعريف.",
      niconicoNotFound: "لم يتم العثور على فيديو Niconico",
      niconicoNotFoundManual: "لم يتم العثور على فيديو Niconico. البحث يدويا.",
      nextEpisodeAutoSetupComplete: "قم بإعداد الحلقة التالية تلقائيًا",
      nextVideoCommentsUnavailableClear:
        "تعذر جلب التعليقات للفيديو التالي. مسح عرض التعليق.",
      noAnimeTitle: "لم أستطع الحصول على عنوان الأنمي. قد يتم تقليل دقة البحث.",
      officialVideoMissingUseFirst:
        "لم يتم العثور على فيديو رسمي. باستخدام نتيجة البحث الأولى.",
      officialVideoMissingManual: "لم يتم العثور على فيديو رسمي. البحث يدويا.",
      officialVideoSafeguardInfo: "حول حماية الفيديو الرسمية",
      unknownTitle: "عنوان غير معروف",
      structuredInput: "مدخلات مفصلة",
      thumbnail: "صورة مصغرة",
      videoDataMissing: "لم يتم العثور على بيانات الفيديو.",
      videoId: "معرف الفيديو",
      videoOwner: "الرافع",
      videoSwitchDetected: "تم اكتشاف تبديل الفيديو...",
      videoSwitchError: "خطأ في تبديل الفيديو: {message}",
      episodeNumber: "رقم الحلقة",
      episodeTitleOptional: "عنوان الحلقة (اختياري)",
      commentCount: "التعليقات",
      commentCountLong: "عدد التعليقات",
      mylistCount: "قائمتي",
      mylistCountLong: "عدد قائمتي",
      officialVideoMissing:
        "لم يتم العثور على فيديو رسمي. إظهار كافة نتائج البحث.",
      searchingKeyword: 'البحث عن "{keyword}"...',
      searchKeywordRequired: "أدخل كلمة رئيسية للبحث",
      searchNoResults: "لم يتم العثور على نتائج البحث",
      searchFormFilled: 'املأ نموذج البحث بـ "{keyword}"',
      similarity: "التشابه: {score}%",
      viewCount: "وجهات النظر",
      viewCountLong: "عدد المشاهدات",
      search: "بحث",
      searchAnimePlaceholder: "مثال: Frieren: ما بعد نهاية الرحلة",
      searchEpisodeNumberPlaceholder: "مثال: الحلقة 1",
      searchEpisodeTitlePlaceholder: "مثال: نهاية الرحلة",
      searchFreeword: "البحث عن الكلمات الحرة",
      searchInputModeToggle: "تبديل وضع الإدخال (الإدخال التفصيلي / المجاني)",
      searchPage: "صفحة البحث",
      searchTab: "بحث",
      searchVideoHeading: "ابحث عن الفيديو لتراكب التعليقات منه",
      saveSettings: "حفظ الإعدادات",
      settings: "الإعدادات",
      settingsClose: "إغلاق الإعدادات",
      settingsFabLabel: "افتح إعدادات تعليق Niconico",
      playbackLoadFailed: "فشل تحميل إعدادات التشغيل",
      playbackSaveFailed: "فشل في حفظ إعدادات التشغيل",
      settingsLoadFailed: "فشل تحميل الإعدادات",
      settingsSaved: "تم حفظ الإعدادات",
      settingsSaveFailed: "فشل في حفظ الإعدادات",
      success: "النجاح",
      videoDataLoadFailed: "فشل تحميل بيانات الفيديو",
      videoDataSaveFailed: "فشل في حفظ بيانات الفيديو",
      warning: "تحذير",
    },
    pt: {
      color: "Cor",
      commentColor: "Cor do comentário",
      commentOpacity: "Opacidade",
      commentSettings: "Configurações de comentários",
      commentSettingsPanel: "Painel de configurações de comentários",
      commentVisibility: "Mostrar comentários",
      commentVisibilityToggle: "Alternar visibilidade dos comentários",
      currentVideoUnset: "Nenhum vídeo de sobreposição está definido",
      error: "Erro",
      animeTitle: "Título do anime",
      autoFillSearchForm:
        "Preencha o formulário de pesquisa com título, número do episódio e título do episódio",
      autoSearch: "Pesquisa automática",
      autoSearchDescription:
        "Defina comentários automaticamente quando a página de exibição for aberta",
      autoSearchDisabledManual:
        "Pesquisa automática desativada (modo de configuração manual)",
      autoSearchEnabled: "Pesquisa automática ativada",
      autoSearchInfo: "Sobre a pesquisa automática",
      fixedPlaybackRate: "Velocidade de bloqueio",
      formInput: "Preencher formulário",
      freeInput: "Entrada gratuita",
      idLoadFailed: "Falha ao carregar informações de ID",
      idSaveFailed: "Falha ao salvar informações de ID",
      info: "Informações",
      manualSearchLoadFailed: "Falha ao carregar as configurações de pesquisa",
      manualSearchSaveFailed: "Falha ao salvar as configurações de pesquisa",
      manualSearchPlaceholder: "Insira uma palavra-chave de pesquisa",
      ngRegex: "Expressões regulares NG",
      ngRegexPlaceholder: "Insira uma expressão regular NG por linha",
      ngTab: "NG",
      ngWords: "Palavras NG",
      ngWordsPlaceholder: "Insira uma palavra NG por linha",
      noMessage: "Nenhuma mensagem",
      playbackRate: "Velocidade de reprodução",
      playbackRateFixedToggle:
        "Ativar/desativar bloqueio de velocidade de reprodução",
      postedAt: "Postado em",
      commentsSet: 'Definir comentários de "{title}"',
      autoSetupComplete: "O vídeo do Niconico foi definido automaticamente",
      autoSetupError: "Erro de configuração automática: {message}",
      commentsHiddenSkip:
        "Ignorado porque os comentários estão ocultos nas configurações",
      commentsLoadComplete: "Comentários de carregamento concluídos ({count})",
      commentsLoadErrorSelectAnother:
        "Erro ao carregar o comentário: {message}\\nSelecione outro vídeo no botão flutuante.",
      commentsUnavailable: "Não foi possível buscar comentários",
      commentSourceUpdated:
        "Fonte de comentários atualizada: {title} ({count})",
      commentFetchError: "Erro de busca de comentário: {message}",
      domUpdateWaitFailed:
        "Falha ao esperar pela atualização do DOM: {message}",
      episodeChangeDetected: "Alteração de episódio detectada...",
      episodeNumberMissing: "Não foi possível obter o número do episódio",
      episodeSwitchError: "Erro de troca de episódio: {message}",
      initializationError: "Erro de inicialização: {message}",
      initializingCommentLoader: "Inicializando carregador de comentários...",
      manualModeSelectAnimeTitle:
        "O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e defina um título de anime.",
      manualModeSelectVideo:
        "O modo manual está ativado. Abra a guia Pesquisar no botão flutuante e selecione um vídeo.",
      manualModeCommentsLoadComplete:
        "[Modo manual] Carregamento de comentários concluído ({count}) Vídeo\\n: {title}",
      metadataAutoFetchFailed:
        "Falha na busca automática da página de exibição. Não foi possível adquirir metadados.",
      niconicoNotFound: "Nenhum vídeo do Niconico foi encontrado",
      niconicoNotFoundManual:
        "Nenhum vídeo do Niconico foi encontrado. Pesquise manualmente.",
      nextEpisodeAutoSetupComplete:
        "Configure o próximo episódio automaticamente",
      nextVideoCommentsUnavailableClear:
        "Não foi possível buscar comentários para o próximo vídeo. Limpando a exibição de comentários.",
      noAnimeTitle:
        "Não foi possível obter o título do anime. A precisão da pesquisa pode ser reduzida.",
      officialVideoMissingUseFirst:
        "Nenhum vídeo oficial foi encontrado. Usando o primeiro resultado da pesquisa.",
      officialVideoMissingManual:
        "Nenhum vídeo oficial foi encontrado. Pesquise manualmente.",
      officialVideoSafeguardInfo: "Sobre a proteção oficial de vídeo",
      unknownTitle: "Título desconhecido",
      structuredInput: "Entrada detalhada",
      thumbnail: "Miniatura",
      videoDataMissing: "Os dados de vídeo não foram encontrados.",
      videoId: "ID do vídeo",
      videoOwner: "Carregador",
      videoSwitchDetected: "Troca de vídeo detectada...",
      videoSwitchError: "Erro de troca de vídeo: {message}",
      episodeNumber: "Número do episódio",
      episodeTitleOptional: "Título do episódio (opcional)",
      commentCount: "Comentários",
      commentCountLong: "Contagem de comentários",
      mylistCount: "Minha lista",
      mylistCountLong: "Contagem da minha lista",
      officialVideoMissing:
        "Nenhum vídeo oficial foi encontrado. Mostrando todos os resultados da pesquisa.",
      searchingKeyword: 'Procurando por "{keyword}"...',
      searchKeywordRequired: "Insira uma palavra-chave de pesquisa",
      searchNoResults: "Nenhum resultado de pesquisa foi encontrado",
      searchFormFilled: 'Preenchido o formulário de pesquisa com "{keyword}"',
      similarity: "Semelhança: {score}%",
      viewCount: "Visualizações",
      viewCountLong: "Contagem de visualizações",
      search: "Pesquisar",
      searchAnimePlaceholder: "Exemplo: Frieren: Além do Fim da Jornada",
      searchEpisodeNumberPlaceholder: "Exemplo: Episódio 1",
      searchEpisodeTitlePlaceholder: "Exemplo: O Fim da Jornada",
      searchFreeword: "Pesquisa de palavras grátis",
      searchInputModeToggle:
        "Alternar modo de entrada (entrada detalhada/livre)",
      searchPage: "Página de pesquisa",
      searchTab: "Pesquisar",
      searchVideoHeading: "Procure o vídeo para sobrepor comentários",
      saveSettings: "Salvar configurações",
      settings: "Configurações",
      settingsClose: "Fechar configurações",
      settingsFabLabel: "Abra as configurações de comentários do Niconico",
      playbackLoadFailed: "Falha ao carregar as configurações de reprodução",
      playbackSaveFailed: "Falha ao salvar as configurações de reprodução",
      settingsLoadFailed: "Falha ao carregar as configurações",
      settingsSaved: "Configurações salvas",
      settingsSaveFailed: "Falha ao salvar as configurações",
      success: "Sucesso",
      videoDataLoadFailed: "Falha ao carregar dados de vídeo",
      videoDataSaveFailed: "Falha ao salvar dados de vídeo",
      warning: "Aviso",
    },
    bn: {
      color: "রঙ",
      commentColor: "মন্তব্যের রঙ",
      commentOpacity: "অস্বচ্ছতা",
      commentSettings: "মন্তব্য সেটিংস",
      commentSettingsPanel: "মন্তব্য সেটিংস প্যানেল",
      commentVisibility: "মন্তব্য দেখান",
      commentVisibilityToggle: "মন্তব্যের দৃশ্যমানতা টগল করুন",
      currentVideoUnset: "কোনো ওভারলে ভিডিও সেট করা নেই",
      error: "ত্রুটি",
      animeTitle: "এনিমে শিরোনাম",
      autoFillSearchForm:
        "শিরোনাম, পর্ব সংখ্যা এবং পর্বের শিরোনাম দিয়ে অনুসন্ধান ফর্মটি পূরণ করুন",
      autoSearch: "স্বয়ংক্রিয় অনুসন্ধান",
      autoSearchDescription:
        "ওয়াচ পেজ খুললে স্বয়ংক্রিয়ভাবে মন্তব্য সেট করুন",
      autoSearchDisabledManual:
        "স্বয়ংক্রিয় অনুসন্ধান অক্ষম (ম্যানুয়াল সেটআপ মোড)",
      autoSearchEnabled: "স্বয়ংক্রিয় অনুসন্ধান সক্ষম",
      autoSearchInfo: "স্বয়ংক্রিয় অনুসন্ধান সম্পর্কে",
      fixedPlaybackRate: "লক স্পিড",
      formInput: "ফর্ম পূরণ করুন",
      freeInput: "বিনামূল্যে ইনপুট",
      idLoadFailed: "আইডি তথ্য লোড করতে ব্যর্থ হয়েছে",
      idSaveFailed: "আইডি তথ্য সংরক্ষণ করতে ব্যর্থ",
      info: "তথ্য",
      manualSearchLoadFailed: "অনুসন্ধান সেটিংস লোড করতে ব্যর্থ হয়েছে৷",
      manualSearchSaveFailed: "অনুসন্ধান সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে",
      manualSearchPlaceholder: "একটি অনুসন্ধান কীওয়ার্ড লিখুন",
      ngRegex: "NG রেগুলার এক্সপ্রেশন",
      ngRegexPlaceholder: "প্রতি লাইনে একটি NG রেগুলার এক্সপ্রেশন লিখুন",
      ngTab: "এনজি",
      ngWords: "এনজি শব্দ",
      ngWordsPlaceholder: "প্রতি লাইনে একটি NG শব্দ লিখুন",
      noMessage: "কোন বার্তা নেই",
      playbackRate: "প্লেব্যাক গতি",
      playbackRateFixedToggle: "প্লেব্যাক স্পিড লক চালু/বন্ধ",
      postedAt: "এ পোস্ট করা হয়েছে",
      commentsSet: '"{title}" থেকে মন্তব্য সেট করুন',
      autoSetupComplete: "Niconico ভিডিও স্বয়ংক্রিয়ভাবে সেট করা হয়েছে",
      autoSetupError: "স্বয়ংক্রিয় সেটআপ ত্রুটি: {message}",
      commentsHiddenSkip:
        "বাদ দেওয়া হয়েছে কারণ মন্তব্যগুলি সেটিংসে লুকানো আছে৷",
      commentsLoadComplete: "মন্তব্য লোড করা সমাপ্ত ({count})",
      commentsLoadErrorSelectAnother:
        "মন্তব্য লোডিং ত্রুটি: {message}\\nভাসমান বোতাম থেকে অন্য ভিডিও নির্বাচন করুন৷",
      commentsUnavailable: "মন্তব্য আনা যায়নি",
      commentSourceUpdated: "আপডেট করা মন্তব্যের উৎস: {title} ({count})",
      commentFetchError: "মন্তব্য আনা ত্রুটি: {message}",
      domUpdateWaitFailed:
        "DOM আপডেটের জন্য অপেক্ষা করতে ব্যর্থ হয়েছে: {message}",
      episodeChangeDetected: "এপিসোড পরিবর্তন শনাক্ত করা হয়েছে...",
      episodeNumberMissing: "পর্ব নম্বর পাওয়া যায়নি",
      episodeSwitchError: "এপিসোড সুইচ ত্রুটি: {message}",
      initializationError: "সূচনা ত্রুটি: {message}",
      initializingCommentLoader: "মন্তব্য লোডার শুরু করা হচ্ছে...",
      manualModeSelectAnimeTitle:
        "ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি অ্যানিমে শিরোনাম সেট করুন।",
      manualModeSelectVideo:
        "ম্যানুয়াল মোড সক্রিয় করা হয়েছে। ভাসমান বোতাম থেকে অনুসন্ধান ট্যাবটি খুলুন এবং একটি ভিডিও নির্বাচন করুন।",
      manualModeCommentsLoadComplete:
        "[ম্যানুয়াল মোড] মন্তব্য লোড করা সমাপ্ত ({count})\\nভিডিও: {title}",
      metadataAutoFetchFailed:
        "দেখার পৃষ্ঠা থেকে স্বয়ংক্রিয়ভাবে আনা ব্যর্থ হয়েছে. মেটাডেটা অর্জন করা যায়নি।",
      niconicoNotFound: "কোন নিকোনিকো ভিডিও পাওয়া যায়নি",
      niconicoNotFoundManual:
        "কোন নিকোনিকো ভিডিও পাওয়া যায়নি. ম্যানুয়ালি অনুসন্ধান করুন।",
      nextEpisodeAutoSetupComplete: "পরের পর্ব স্বয়ংক্রিয়ভাবে সেট আপ করুন",
      nextVideoCommentsUnavailableClear:
        "পরবর্তী ভিডিওর জন্য মন্তব্য আনা যায়নি. মন্তব্য প্রদর্শন সাফ করা হচ্ছে।",
      noAnimeTitle:
        "অ্যানিমে শিরোনাম পেতে পারিনি। অনুসন্ধান নির্ভুলতা হ্রাস হতে পারে.",
      officialVideoMissingUseFirst:
        "কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। প্রথম অনুসন্ধান ফলাফল ব্যবহার করে.",
      officialVideoMissingManual:
        "কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। ম্যানুয়ালি অনুসন্ধান করুন।",
      officialVideoSafeguardInfo: "অফিসিয়াল ভিডিও সুরক্ষা সম্পর্কে",
      unknownTitle: "অজানা শিরোনাম",
      structuredInput: "বিস্তারিত ইনপুট",
      thumbnail: "থাম্বনেইল",
      videoDataMissing: "ভিডিও তথ্য পাওয়া যায়নি.",
      videoId: "ভিডিও আইডি",
      videoOwner: "আপলোডার",
      videoSwitchDetected: "শনাক্ত করা ভিডিও সুইচ...",
      videoSwitchError: "ভিডিও সুইচ ত্রুটি: {message}",
      episodeNumber: "পর্ব সংখ্যা",
      episodeTitleOptional: "পর্বের শিরোনাম (ঐচ্ছিক)",
      commentCount: "মন্তব্য",
      commentCountLong: "মন্তব্য গণনা",
      mylistCount: "মাইলিস্ট",
      mylistCountLong: "মাইলিস্ট গণনা",
      officialVideoMissing:
        "কোনো অফিসিয়াল ভিডিও পাওয়া যায়নি। সমস্ত অনুসন্ধান ফলাফল দেখাচ্ছে.",
      searchingKeyword: '"{keyword}" এর জন্য অনুসন্ধান করা হচ্ছে...',
      searchKeywordRequired: "একটি অনুসন্ধান কীওয়ার্ড লিখুন",
      searchNoResults: "কোন অনুসন্ধান ফলাফল পাওয়া যায়নি",
      searchFormFilled: '"{keyword}" দিয়ে অনুসন্ধান ফর্ম পূরণ করুন',
      similarity: "সাদৃশ্য: {score}%",
      viewCount: "ভিউ",
      viewCountLong: "ভিউ গণনা",
      search: "অনুসন্ধান করুন",
      searchAnimePlaceholder: "উদাহরণ: Frieren: Beyond Journey's End",
      searchEpisodeNumberPlaceholder: "উদাহরণ: পর্ব 1",
      searchEpisodeTitlePlaceholder: "উদাহরণ: The Journey's End",
      searchFreeword: "বিনামূল্যে শব্দ অনুসন্ধান",
      searchInputModeToggle:
        "ইনপুট মোড পরিবর্তন করুন (বিস্তারিত / বিনামূল্যে ইনপুট)",
      searchPage: "অনুসন্ধান পৃষ্ঠা",
      searchTab: "অনুসন্ধান করুন",
      searchVideoHeading: "থেকে মন্তব্য ওভারলে ভিডিও জন্য অনুসন্ধান করুন",
      saveSettings: "সেটিংস সংরক্ষণ করুন",
      settings: "সেটিংস",
      settingsClose: "সেটিংস বন্ধ করুন",
      settingsFabLabel: "নিকোনিকো মন্তব্য সেটিংস খুলুন",
      playbackLoadFailed: "প্লেব্যাক সেটিংস লোড করতে ব্যর্থ৷",
      playbackSaveFailed: "প্লেব্যাক সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে৷",
      settingsLoadFailed: "সেটিংস লোড করতে ব্যর্থ হয়েছে৷",
      settingsSaved: "সেটিংস সংরক্ষিত",
      settingsSaveFailed: "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে",
      success: "সফলতা",
      videoDataLoadFailed: "ভিডিও ডেটা লোড করতে ব্যর্থ হয়েছে৷",
      videoDataSaveFailed: "ভিডিও ডেটা সংরক্ষণ করতে ব্যর্থ হয়েছে৷",
      warning: "সতর্কতা",
    },
    ru: {
      color: "Цвет",
      commentColor: "Цвет комментария",
      commentOpacity: "Непрозрачность",
      commentSettings: "Настройки комментариев",
      commentSettingsPanel: "Панель настроек комментариев",
      commentVisibility: "Показать комментарии",
      commentVisibilityToggle: "Переключить видимость комментариев",
      currentVideoUnset: "Наложение видео не установлено.",
      error: "Ошибка",
      animeTitle: "Название аниме",
      autoFillSearchForm:
        "Заполните форму поиска, указав название, номер эпизода и название эпизода.",
      autoSearch: "Автоматический поиск",
      autoSearchDescription:
        "Автоматически устанавливать комментарии при открытии страницы просмотра",
      autoSearchDisabledManual:
        "Автоматический поиск отключен (режим ручной настройки)",
      autoSearchEnabled: "Автоматический поиск включен",
      autoSearchInfo: "Об автопоиске",
      fixedPlaybackRate: "Скорость блокировки",
      formInput: "Заполнить форму",
      freeInput: "Бесплатный вход",
      idLoadFailed: "Не удалось загрузить идентификационную информацию.",
      idSaveFailed: "Не удалось сохранить идентификационную информацию.",
      info: "Информация",
      manualSearchLoadFailed: "Не удалось загрузить настройки поиска.",
      manualSearchSaveFailed: "Не удалось сохранить настройки поиска.",
      manualSearchPlaceholder: "Введите ключевое слово для поиска",
      ngRegex: "Регулярные выражения NG",
      ngRegexPlaceholder:
        "Введите одно регулярное выражение NG в каждой строке.",
      ngTab: "НГ",
      ngWords: "НГ слова",
      ngWordsPlaceholder: "Введите по одному слову NG в строке",
      noMessage: "Нет сообщения",
      playbackRate: "Скорость воспроизведения",
      playbackRateFixedToggle: "Блокировка скорости воспроизведения вкл./выкл.",
      postedAt: "Опубликовано в",
      commentsSet: "Установить комментарии от «{title}»",
      autoSetupComplete: "Видео Niconico было установлено автоматически",
      autoSetupError: "Ошибка автоматической настройки: {message}.",
      commentsHiddenSkip:
        "Пропущено, поскольку комментарии скрыты в настройках.",
      commentsLoadComplete: "Загрузка комментариев завершена ({count}).",
      commentsLoadErrorSelectAnother:
        "Ошибка загрузки комментария: {message}\\nВыберите другое видео с помощью плавающей кнопки.",
      commentsUnavailable: "Не удалось получить комментарии.",
      commentSourceUpdated:
        "Обновленный источник комментариев: {title} ({count})",
      commentFetchError: "Ошибка получения комментария: {message}.",
      domUpdateWaitFailed: "Не удалось дождаться обновления DOM: {message}.",
      episodeChangeDetected: "Обнаружено изменение эпизода...",
      episodeNumberMissing: "Не удалось получить номер серии",
      episodeSwitchError: "Ошибка переключения эпизодов: {message}.",
      initializationError: "Ошибка инициализации: {message}.",
      initializingCommentLoader: "Инициализация загрузчика комментариев...",
      manualModeSelectAnimeTitle:
        "Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и установите название аниме.",
      manualModeSelectVideo:
        "Ручной режим включен. Откройте вкладку «Поиск» с помощью плавающей кнопки и выберите видео.",
      manualModeCommentsLoadComplete:
        "[Ручной режим] Загрузка комментариев завершена ({count}) Видео\\n: {title}",
      metadataAutoFetchFailed:
        "Не удалось выполнить автоматическое получение со страницы просмотра. Метаданные не удалось получить.",
      niconicoNotFound: "Видео Niconico не найдено",
      niconicoNotFoundManual: "Видео Niconico не найдено. Поиск вручную.",
      nextEpisodeAutoSetupComplete: "Автоматически настроить следующий выпуск",
      nextVideoCommentsUnavailableClear:
        "Не удалось получить комментарии к следующему видео. Очистка отображения комментариев.",
      noAnimeTitle:
        "Не удалось получить название аниме. Точность поиска может снизиться.",
      officialVideoMissingUseFirst:
        "Официального видео не найдено. Использование первого результата поиска.",
      officialVideoMissingManual:
        "Официального видео не найдено. Поиск вручную.",
      officialVideoSafeguardInfo: "Об официальной видеоохране",
      unknownTitle: "Неизвестное название",
      structuredInput: "Подробный ввод",
      thumbnail: "Миниатюра",
      videoDataMissing: "Видеоданные не найдены.",
      videoId: "Идентификатор видео",
      videoOwner: "Загрузчик",
      videoSwitchDetected: "Обнаружено переключение видео...",
      videoSwitchError: "Ошибка видеопереключателя: {message}",
      episodeNumber: "Номер серии",
      episodeTitleOptional: "Название серии (необязательно)",
      commentCount: "Комментарии",
      commentCountLong: "Количество комментариев",
      mylistCount: "Мой список",
      mylistCountLong: "Количество в моем списке",
      officialVideoMissing:
        "Официального видео не найдено. Показаны все результаты поиска.",
      searchingKeyword: 'Ищем "{keyword}"...',
      searchKeywordRequired: "Введите ключевое слово для поиска",
      searchNoResults: "Результаты поиска не найдены",
      searchFormFilled: "Заполнил форму поиска с помощью «{keyword}»",
      similarity: "Сходство: {score}%",
      viewCount: "Просмотры",
      viewCountLong: "Количество просмотров",
      search: "Поиск",
      searchAnimePlaceholder: "Пример: Frieren: Beyond Journey’s End",
      searchEpisodeNumberPlaceholder: "Пример: Эпизод 1",
      searchEpisodeTitlePlaceholder: "Пример: Конец путешествия",
      searchFreeword: "Свободный поиск слов",
      searchInputModeToggle:
        "Переключение режима ввода (детальный/свободный ввод)",
      searchPage: "Страница поиска",
      searchTab: "Поиск",
      searchVideoHeading:
        "Найдите видео, из которого можно наложить комментарии.",
      saveSettings: "Сохранить настройки",
      settings: "Настройки",
      settingsClose: "Закрыть настройки",
      settingsFabLabel: "Открыть настройки комментариев Niconico",
      playbackLoadFailed: "Не удалось загрузить настройки воспроизведения.",
      playbackSaveFailed: "Не удалось сохранить настройки воспроизведения.",
      settingsLoadFailed: "Не удалось загрузить настройки",
      settingsSaved: "Настройки сохранены.",
      settingsSaveFailed: "Не удалось сохранить настройки.",
      success: "Успех",
      videoDataLoadFailed: "Не удалось загрузить видеоданные.",
      videoDataSaveFailed: "Не удалось сохранить видеоданные.",
      warning: "Предупреждение",
    },
    ur: {
      color: "رنگ",
      commentColor: "تبصرہ کا رنگ",
      commentOpacity: "دھندلاپن",
      commentSettings: "تبصرہ کی ترتیبات",
      commentSettingsPanel: "تبصرہ کی ترتیبات کا پینل",
      commentVisibility: "تبصرے دکھائیں۔",
      commentVisibilityToggle: "تبصرے کی مرئیت کو ٹوگل کریں۔",
      currentVideoUnset: "کوئی اوورلے ویڈیو سیٹ نہیں ہے۔",
      error: "خرابی",
      animeTitle: "موبائل فونز کا عنوان",
      autoFillSearchForm:
        "سرچ فارم کو عنوان، قسط نمبر، اور قسط کے عنوان کے ساتھ پُر کریں۔",
      autoSearch: "خودکار تلاش",
      autoSearchDescription: "دیکھنے کا صفحہ کھلنے پر تبصرے خود بخود سیٹ کریں۔",
      autoSearchDisabledManual: "خودکار تلاش غیر فعال (دستی سیٹ اپ موڈ)",
      autoSearchEnabled: "خودکار تلاش فعال ہے۔",
      autoSearchInfo: "خودکار تلاش کے بارے میں",
      fixedPlaybackRate: "لاک رفتار",
      formInput: "فارم پُر کریں۔",
      freeInput: "مفت ان پٹ",
      idLoadFailed: "ID کی معلومات لوڈ کرنے میں ناکام",
      idSaveFailed: "ID کی معلومات محفوظ کرنے میں ناکام",
      info: "معلومات",
      manualSearchLoadFailed: "تلاش کی ترتیبات لوڈ کرنے میں ناکام",
      manualSearchSaveFailed: "تلاش کی ترتیبات کو محفوظ کرنے میں ناکام",
      manualSearchPlaceholder: "تلاش کا مطلوبہ لفظ درج کریں۔",
      ngRegex: "NG ریگولر ایکسپریشنز",
      ngRegexPlaceholder: "فی لائن ایک NG ریگولر ایکسپریشن درج کریں۔",
      ngTab: "این جی",
      ngWords: "NG الفاظ",
      ngWordsPlaceholder: "فی لائن ایک NG لفظ درج کریں۔",
      noMessage: "کوئی پیغام نہیں۔",
      playbackRate: "پلے بیک کی رفتار",
      playbackRateFixedToggle: "پلے بیک اسپیڈ لاک آن/آف",
      postedAt: "پر پوسٹ کیا گیا۔",
      commentsSet: '"{title}" سے تبصرے سیٹ کریں',
      autoSetupComplete: "Niconico ویڈیو خود بخود ترتیب دی گئی تھی۔",
      autoSetupError: "آٹو سیٹ اپ کی خرابی: {message}",
      commentsHiddenSkip: "چھوڑ دیا گیا کیونکہ تبصرے ترتیبات میں پوشیدہ ہیں۔",
      commentsLoadComplete: "تبصرے لوڈ کرنا مکمل ہو گیا ({count})",
      commentsLoadErrorSelectAnother:
        "تبصرہ لوڈ کرنے میں خرابی: {message}\\nتیرتے بٹن سے ایک اور ویڈیو منتخب کریں۔",
      commentsUnavailable: "تبصرے حاصل نہیں کر سکے۔",
      commentSourceUpdated: "تجدید شدہ تبصرہ ماخذ: {title} ({count})",
      commentFetchError: "تبصرہ کی بازیافت کی خرابی: {message}",
      domUpdateWaitFailed: "DOM اپ ڈیٹ کا انتظار کرنے میں ناکام: {message}",
      episodeChangeDetected: "ایپی سوڈ کی تبدیلی کا پتہ چلا...",
      episodeNumberMissing: "قسط نمبر نہیں مل سکا",
      episodeSwitchError: "ایپی سوڈ سوئچ کی خرابی: {message}",
      initializationError: "ابتدائی غلطی: {message}",
      initializingCommentLoader: "تبصرہ لوڈر شروع کیا جا رہا ہے...",
      manualModeSelectAnimeTitle:
        "دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کو کھولیں اور ایک anime عنوان سیٹ کریں۔",
      manualModeSelectVideo:
        "دستی موڈ فعال ہے۔ تیرتے ہوئے بٹن سے سرچ ٹیب کھولیں اور ایک ویڈیو منتخب کریں۔",
      manualModeCommentsLoadComplete:
        "[دستی موڈ] تبصرے کو لوڈ کرنا ({count})\\nویڈیو: {title}",
      metadataAutoFetchFailed:
        "واچ پیج سے خودکار بازیافت ناکام ہو گئی۔ میٹا ڈیٹا حاصل نہیں کیا جا سکا۔",
      niconicoNotFound: "Niconico کی کوئی ویڈیو نہیں ملی",
      niconicoNotFoundManual:
        "Niconico کی کوئی ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔",
      nextEpisodeAutoSetupComplete: "اگلی قسط خود بخود ترتیب دیں۔",
      nextVideoCommentsUnavailableClear:
        "اگلی ویڈیو کے لیے تبصرے حاصل نہیں کیے جا سکے۔ تبصرہ ڈسپلے کو صاف کرنا۔",
      noAnimeTitle:
        "anime عنوان حاصل نہیں کر سکا۔ تلاش کی درستگی کم ہو سکتی ہے۔",
      officialVideoMissingUseFirst:
        "کوئی سرکاری ویڈیو نہیں ملی۔ پہلے تلاش کا نتیجہ استعمال کرنا۔",
      officialVideoMissingManual:
        "کوئی سرکاری ویڈیو نہیں ملی۔ دستی طور پر تلاش کریں۔",
      officialVideoSafeguardInfo: "سرکاری ویڈیو حفاظت کے بارے میں",
      unknownTitle: "نامعلوم عنوان",
      structuredInput: "تفصیلی ان پٹ",
      thumbnail: "تھمب نیل",
      videoDataMissing: "ویڈیو ڈیٹا نہیں ملا۔",
      videoId: "ویڈیو آئی ڈی",
      videoOwner: "اپ لوڈ کرنے والا",
      videoSwitchDetected: "ویڈیو سوئچ کا پتہ چلا...",
      videoSwitchError: "ویڈیو سوئچ کی خرابی: {message}",
      episodeNumber: "قسط نمبر",
      episodeTitleOptional: "قسط کا عنوان (اختیاری)",
      commentCount: "تبصرے",
      commentCountLong: "تبصرہ شمار",
      mylistCount: "مائی لسٹ",
      mylistCountLong: "مائی لسٹ شمار",
      officialVideoMissing:
        "کوئی سرکاری ویڈیو نہیں ملی۔ تلاش کے تمام نتائج دکھا رہا ہے۔",
      searchingKeyword: '"{keyword}" تلاش کر رہا ہے...',
      searchKeywordRequired: "تلاش کا مطلوبہ لفظ درج کریں۔",
      searchNoResults: "تلاش کے کوئی نتائج نہیں ملے",
      searchFormFilled: '"{keyword}" کے ساتھ تلاش کا فارم بھرا',
      similarity: "مماثلت: {score}%",
      viewCount: "مناظر",
      viewCountLong: "دیکھنے کی تعداد",
      search: "تلاش کریں۔",
      searchAnimePlaceholder: "مثال: فریرین: سفر کے اختتام سے آگے",
      searchEpisodeNumberPlaceholder: "مثال: قسط 1",
      searchEpisodeTitlePlaceholder: "مثال: سفر کا اختتام",
      searchFreeword: "مفت الفاظ کی تلاش",
      searchInputModeToggle: "ان پٹ موڈ سوئچ کریں (تفصیلی / مفت ان پٹ)",
      searchPage: "صفحہ تلاش کریں۔",
      searchTab: "تلاش کریں۔",
      searchVideoHeading: "تبصروں کو اوورلے کرنے کے لیے ویڈیو تلاش کریں۔",
      saveSettings: "ترتیبات کو محفوظ کریں۔",
      settings: "ترتیبات",
      settingsClose: "ترتیبات بند کریں۔",
      settingsFabLabel: "نیکونیکو تبصرہ کی ترتیبات کھولیں۔",
      playbackLoadFailed: "پلے بیک کی ترتیبات لوڈ کرنے میں ناکام",
      playbackSaveFailed: "پلے بیک کی ترتیبات کو محفوظ کرنے میں ناکام",
      settingsLoadFailed: "ترتیبات لوڈ کرنے میں ناکام",
      settingsSaved: "ترتیبات محفوظ ہو گئیں۔",
      settingsSaveFailed: "ترتیبات کو محفوظ کرنے میں ناکام",
      success: "کامیابی",
      videoDataLoadFailed: "ویڈیو ڈیٹا لوڈ کرنے میں ناکام",
      videoDataSaveFailed: "ویڈیو ڈیٹا محفوظ کرنے میں ناکام",
      warning: "وارننگ",
    },
  },
  "en",
);

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export function getNotificationTypeLabel(type: NotificationType): string {
  return i18n.t(type);
}

export const format = i18n.format;
export const t = i18n.t;
