import { defineConfig } from 'vite';
import monkey, { MonkeyUserScript } from 'vite-plugin-monkey';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

const createSvgDataIcon = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;

const imageCollectorIcon = createSvgDataIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f766e"/>
  <path d="M14 18h36v25H14z" fill="#ecfeff"/>
  <path d="M18 38l9-10 7 7 5-6 9 9v3H18z" fill="#14b8a6"/>
  <circle cx="42" cy="25" r="4" fill="#f59e0b"/>
  <path d="M32 46V24" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <path d="M23 37l9 10 9-10" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

const mangaViewerIcon = createSvgDataIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2563eb"/>
  <path d="M13 17c7-3 13-3 19 2v32c-6-5-12-6-19-2z" fill="#eff6ff"/>
  <path d="M32 19c6-5 12-5 19-2v32c-7-4-13-3-19 2z" fill="#dbeafe"/>
  <path d="M32 19v32" stroke="#1e40af" stroke-width="3" stroke-linecap="round"/>
  <path d="M18 26c3-1 6-1 9 1M18 34c3-1 6-1 9 1M37 27c3-1 6-1 9 1M37 35c3-1 6-1 9 1" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

const videoScreenOffDetectionBlockerIcon = createSvgDataIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f172a"/>
  <rect x="11" y="18" width="42" height="28" rx="5" fill="#e0f2fe"/>
  <path d="M28 25v14l12-7z" fill="#0f172a"/>
  <path d="M15 49 49 15" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
</svg>
`);

const createUserscriptPlugin = (entry: string, fileName: string, meta: MonkeyUserScript) =>
  monkey({
    entry,
    userscript: meta,
    server: {
      open: false,
      prefix: 'dev:',
    },
    build: {
      fileName,
      metaFileName: true,
      autoGrant: true,
    },
  });

// ============================================================================
// メタデータ定義（アルファベット順）
// ============================================================================

const chatgptNotifyMeta: MonkeyUserScript = {
  name: 'chat-gpt-notify',
  namespace: 'chatGptNotify',
  version: '2.2.1',
  description: 'Notify when ChatGPT generation is complete.',
  author: 'roflsunriz',
  match: [
    'https://chatgpt.com/*',
    'https://chat.openai.com/*',
    'https://chat.com/*',
  ],
  grant: [
    'GM_notification',
    'GM_setValue',
    'GM_getValue',
    'GM_registerMenuCommand',
  ],
  icon: 'https://chat.openai.com/favicon.ico',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/chatgpt-notify.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/chatgpt-notify.user.js',
};

const danimeCfRankingMeta: MonkeyUserScript = {
  name: 'd-anime-cf-ranking',
  namespace: 'dAnimeCfRanking',
  version: '1.5.1',
  description: 'dアニメストアのCFページに作品の人気度ランキング（ニコニコ動画指標）を表示',
  author: 'roflsunriz',
  match: [
    'https://animestore.docomo.ne.jp/animestore/CF/*',
    'https://animestore.docomo.ne.jp/animestore/CF/shinban-*',
  ],
  grant: [
    'GM_xmlhttpRequest',
    'GM_setValue',
    'GM_getValue',
    'GM_registerMenuCommand',
    'GM_addStyle',
  ],
  connect: [
    'nicovideo.jp',
    '*.nicovideo.jp',
  ],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-cf-ranking.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-cf-ranking.user.js',
};

const danimeMeta: MonkeyUserScript = {
  name: 'd-anime-nico-comment-renderer',
  namespace: 'dAnimeNicoCommentRenderer',
  version: '7.6.1',
  description: 'Render NicoNico style comments on dAnime Store player.',
  author: 'roflsunriz',
  match: [
    'https://animestore.docomo.ne.jp/animestore/sc_d_pc*',
    'https://animestore.docomo.ne.jp/animestore/mp_viw_pc*',
  ],
  grant: [
    'GM_xmlhttpRequest',
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM_addStyle',
  ],
  connect: [
    'nicovideo.jp',
    '*.nicovideo.jp',
    'public.nvcomment.nicovideo.jp',
  ],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=animestore.docomo.ne.jp',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-nico-comment-renderer.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/d-anime-nico-comment-renderer.user.js',
};

const fanboxFloatingMenuMeta: MonkeyUserScript = {
  name: 'fanbox-floating-menu',
  namespace: 'fanboxFloatingMenu',
  version: '2.1.1',
  description: 'Fanboxのページ移動用フローティングメニューを追加',
  author: 'roflsunriz',
  match: ['https://*.fanbox.cc/*'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-floating-menu.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-floating-menu.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc',
  'run-at': 'document-idle',
};

const fanboxPaginationHelperMeta: MonkeyUserScript = {
  name: 'fanbox-pagination-helper',
  namespace: 'fanboxPaginationHelper',
  version: '2.1.1',
  description: 'Fanboxのページネーションを上部に追加',
  author: 'roflsunriz',
  match: ['https://*.fanbox.cc/*'],
  grant: ['GM_addStyle'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-pagination-helper.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/fanbox-pagination-helper.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=fanbox.cc',
  'run-at': 'document-idle',
};

const hfDownloadCommandCopierMeta: MonkeyUserScript = {
  name: 'hf-download-command-copier',
  namespace: 'hfDownloadCommandCopier',
  version: '1.2.1',
  description: 'Hugging Faceのリポジトリページにhf downloadコマンドのコピーボタンを追加',
  author: 'roflsunriz',
  match: [
    'https://huggingface.co/*/*',
    'https://huggingface.co/datasets/*/*',
    'https://huggingface.co/spaces/*/*',
  ],
  exclude: [
    'https://huggingface.co/login*',
    'https://huggingface.co/join*',
    'https://huggingface.co/settings*',
  ],
  grant: ['GM_setClipboard'],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=huggingface.co',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/hf-download-command-copier.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/hf-download-command-copier.user.js',
};

const imageCollectorMeta: MonkeyUserScript = {
  name: 'image-collector',
  namespace: 'imageCollector',
  version: '5.8.0',
  description: 'Collect images from various hosts and export as archive.',
  author: 'roflsunriz',
  match: ['*://*', '*://*/*'],
  connect: [
    '*',
    '*/*',
    'imgur.com',
    'flickr.com',
    'pinterest.com',
    'deviantart.com',
    'artstation.com',
    '500px.com',
    'unsplash.com',
    'pexels.com',
    'pixiv.net',
    'tinypic.com',
    'postimages.org',
    'imgbox.com',
    'imagebam.com',
    'imagevenue.com',
    'imageshack.us',
    'photobucket.com',
    'freeimage.host',
    'ibb.co',
    'imgbb.com',
    'gyazo.com',
    'twitter.com',
    'x.com',
    'instagram.com',
    'facebook.com',
    'reddit.com',
    'tumblr.com',
    'weibo.com',
    'vk.com',
    'example.com',
  ],
  grant: [
    'GM_getValue',
    'GM_setValue',
    'GM_xmlhttpRequest',
    'GM_registerMenuCommand',
    'unsafeWindow',
  ],
  icon: imageCollectorIcon,
  icon64: imageCollectorIcon,
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.user.js',
};

const imgurDirectLinkCopierMeta: MonkeyUserScript = {
  name: 'imgur-image-link-copier',
  namespace: 'imgurImageLinkCopier',
  version: '3.3.1',
  description: 'Copy image link from Imgur with TypeScript.',
  author: 'roflsunriz',
  match: ['https://imgur.com/*'],
  grant: ['GM_setClipboard'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/imgur-direct-link.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=imgur.com',
};

const khinsiderDirectLinkSaverMeta: MonkeyUserScript = {
  name: 'khinsider-direct-link-saver',
  namespace: 'khinsiderDirectLinkSaver',
  version: '1.5.1',
  description: 'KHInsiderのアルバムページから音声ファイルを並列ダウンロード',
  author: 'roflsunriz',
  match: ['https://downloads.khinsider.com/game-soundtracks/album/*'],
  grant: [
    'GM_xmlhttpRequest',
    'GM_setValue',
    'GM_getValue',
    'GM_registerMenuCommand',
    'GM_addStyle',
    'GM_download',
  ],
  connect: [
    'downloads.khinsider.com',
    'vgmtreasurechest.com',
    '*.vgmtreasurechest.com',
  ],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=downloads.khinsider.com',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/khinsider-direct-link-saver.user.js',
};

const mangaViewerMeta: MonkeyUserScript = {
  name: 'book-style-manga-viewer',
  namespace: 'bookStyleMangaViewer',
  version: '10.21.1',
  description: 'Layout images in book style viewer with keyboard controls.',
  author: 'roflsunriz',
  match: ['*://*/*'],
  exclude: [
    '*://www.youtube.com/*',
    '*://youtube.com/*',
    '*://m.youtube.com/*',
    '*://music.youtube.com/*',
    '*://www.nicovideo.jp/*',
    '*://nicovideo.jp/*',
    '*://nico.ms/*',
    '*://www.nico.ms/*',
    '*://nicocache.jpn.org/*',
    '*://animestore.docomo.ne.jp/*',
    '*://www.netflix.com/*',
    '*://netflix.com/*',
    '*://www.amazon.co.jp/gp/video/*',
    '*://amazon.co.jp/gp/video/*',
    '*://www.primevideo.com/*',
    '*://primevideo.com/*',
    '*://www.hulu.jp/*',
    '*://hulu.jp/*',
    '*://www.disneyplus.com/*',
    '*://disneyplus.com/*',
    '*://abema.tv/*',
    '*://www.abema.tv/*',
    '*://tver.jp/*',
    '*://www.tver.jp/*',
    '*://gyao.yahoo.co.jp/*',
    '*://www.twitch.tv/*',
    '*://twitch.tv/*',
    '*://live.nicovideo.jp/*',
    '*://www.openrec.tv/*',
    '*://openrec.tv/*',
    '*://www.mildom.com/*',
    '*://mildom.com/*',
  ],
  grant: [
    'GM_registerMenuCommand',
    'GM_getValue',
    'GM_setValue',
    'GM_xmlhttpRequest',
  ],
  connect: ['*'],
  icon: mangaViewerIcon,
  icon64: mangaViewerIcon,
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/manga-viewer.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/manga-viewer.user.js',
};

const nativeVideoVolumeSetterMeta: MonkeyUserScript = {
  name: 'native-video-volume-setter',
  namespace: 'nativeVideoVolumeSetter',
  version: '1.2.2',
  description:
    '新規タブで開かれたブラウザ標準のビデオプレーヤーの音量を好みの既定値に揃えるシンプルな補助スクリプト',
  author: 'roflsunriz',
  match: ['*://*/*'],
  exclude: [
    'https://www.youtube.com/*',
    'https://youtu.be/*',
    'https://twitter.com/*',
    'https://x.com/*',
    'https://www.netflix.com/*',
    'https://www.primevideo.com/*',
    'https://www.disneyplus.com/*',
    'https://abema.tv/*',
    'https://www.abema.tv/*',
    'https://tver.jp/*',
    'https://www.tver.jp/*',
    'https://www.twitch.tv/*',
  ],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  'run-at': 'document-end',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=videojs.com',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/native-video-volume-setter.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/native-video-volume-setter.user.js',
};

const trickcalToolSweepMeta: MonkeyUserScript = {
  name: 'trickcal-tool-sweep',
  namespace: 'trickcalToolSweep',
  version: '1.3.2',
  description: 'Trickcal sweep tool material image and Japanese tooltip patch.',
  author: 'roflsunriz',
  match: ['https://trickcal.nossite.com/*'],
  grant: [
    'GM_getValue',
    'GM_setValue',
    'GM_registerMenuCommand',
  ],
  icon: 'https://trickcal.nossite.com/assets/favicons/favicon.png',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/trickcal-tool-sweep.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/trickcal-tool-sweep.user.js',
};

const twitterCleanTimelineMeta: MonkeyUserScript = {
  name: 'twitter-clean-timeline',
  namespace: 'twitterCleanTimeline',
  version: '1.7.1',
  description: 'X/Twitterタイムラインの統合フィルタ（メディア・ミュート・リツイート・置き換え）。JSON事前フィルタリングとDOM削除でクリーンな体験を提供。',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand', 'unsafeWindow'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-timeline.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-timeline.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
  'run-at': 'document-start',
};

const twitterCleanUIMeta: MonkeyUserScript = {
  name: 'twitter-clean-ui',
  namespace: 'twitterCleanUI',
  version: '1.16.0',
  description: 'X/Twitterの左メニュー、右サイドバー、タイムラインタブ、投稿入力欄、ドロワー、投稿アクションを項目別に表示切替。幅調整とリアルタイムプレビュー、設定別の早期CSS適用に対応。',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-clean-ui.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
};

const twitterFullSizeImageMeta: MonkeyUserScript = {
  name: 'twitter-image-fullsize-redirect',
  namespace: 'twitterImageFullsizeRedirect',
  version: '2.1.4',
  description: 'Twitterの画像リンクを自動的にフルサイズ画像にリダイレクト',
  author: 'roflsunriz',
  match: [
    'https://pbs.twimg.com/media/*',
    'https://ton.twimg.com/media/*',
  ],
  'run-at': 'document-start',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=twitter.com',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-full-size-image.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-full-size-image.user.js',
};

const twitterThreadCopierMeta: MonkeyUserScript = {
  name: 'twitter-thread-copier',
  namespace: 'twitterThreadCopier',
  version: '6.12.0',
  description: 'Copy entire Twitter/X threads with formatting and expansions.',
  author: 'roflsunriz',
  match: [
    'https://twitter.com/*',
    'https://x.com/*',
  ],
  connect: [
    'translate.googleapis.com',
    '*.googleapis.com',
    't.co',
    '*',
    'localhost',
  ],
  grant: ['GM_xmlhttpRequest', 'GM_notification'],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=twitter.com',
  'run-at': 'document-idle',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-thread-copier.user.js',
};

const videoScreenOffDetectionBlockerMeta: MonkeyUserScript = {
  name: 'video-screen-off-detection-blocker',
  namespace: 'videoScreenOffDetectionBlocker',
  version: '1.0.0',
  description:
    'Webページ上のvideo要素に対する画面オフ・バックグラウンド検知を遮断し、SPAで追加される動画にも追従する',
  author: 'roflsunriz',
  match: ['*://*/*'],
  grant: 'none',
  sandbox: 'raw',
  'inject-into': 'page',
  'run-at': 'document-start',
  icon: videoScreenOffDetectionBlockerIcon,
  icon64: videoScreenOffDetectionBlockerIcon,
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-screen-off-detection-blocker.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/video-screen-off-detection-blocker.user.js',
};

const xAutoSpamReporterMeta: MonkeyUserScript = {
  name: 'x-auto-spam-reporter',
  namespace: 'xAutoSpamReporter',
  version: '1.2.1',
  description:
    'X/Twitterのツイート詳細ページでリプライをワンクリックでスパム報告＆ブロック',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_registerMenuCommand'],
  'run-at': 'document-end',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-auto-spam-reporter.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-auto-spam-reporter.user.js',
};

const xCommunityNoteCloseMeta: MonkeyUserScript = {
  name: 'x-community-note-close',
  namespace: 'xCommunityNoteClose',
  version: '1.0.1',
  description: 'X/Twitterのコミュニティノート評価モーダルをバックドロップクリックで閉じる',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  'run-at': 'document-end',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-community-note-close.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/x-community-note-close.user.js',
};

const yahooMailAdCleanerMeta: MonkeyUserScript = {
  name: 'yahoo-mail-ad-cleaner',
  namespace: 'yahooMailAdCleaner',
  version: '1.0.1',
  description: 'Yahoo!メール PC版に残る広告枠と空きカラムを非表示にする',
  author: 'roflsunriz',
  match: ['https://mail.yahoo.co.jp/*'],
  grant: [],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp',
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-ad-cleaner.user.js',
};

const yahooMailMarkReadMeta: MonkeyUserScript = {
  name: 'yahoo-mail-mark-read',
  namespace: 'yahooMailMarkRead',
  version: '1.2.1',
  description: 'Yahoo!メール PC版のフォルダー一覧に、表示中メールをまとめて既読にするボタンを追加',
  author: 'roflsunriz',
  match: ['https://mail.yahoo.co.jp/*'],
  grant: [],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=mail.yahoo.co.jp',
  'run-at': 'document-end',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-mark-read.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/yahoo-mail-mark-read.user.js',
};

const youtubeInfoCopierMeta: MonkeyUserScript = {
  name: 'youtube-info-copier',
  namespace: 'youtubeInfoCopier',
  version: '2.6.1',
  description: 'YouTube動画の情報をワンクリックでクリップボードにコピー（従来/FAB/メニュー切替対応）',
  author: 'roflsunriz',
  match: ['https://www.youtube.com/*', 'https://youtu.be/*'],
  grant: ['GM_setClipboard', 'GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com',
};

const youtubeUiModifierMeta: MonkeyUserScript = {
  name: 'youtube-ui-modifier',
  namespace: 'youtubeUiModifier',
  version: '1.8.6',
  description: 'YouTubeのおすすめ、Shorts、コメント、ナビゲーションなどを設定モーダルからリアルタイムに表示調整',
  author: 'roflsunriz',
  match: [
    'https://www.youtube.com/*',
    'https://youtube.com/*',
    'https://m.youtube.com/*',
  ],
  grant: ['GM_getValue', 'GM_registerMenuCommand'],
  'run-at': 'document-start',
  noframes: true,
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-ui-modifier.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-ui-modifier.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com',
};

// ============================================================================
// スクリプト設定（アルファベット順）
// ============================================================================

const SCRIPT_CONFIGS = {
  'chatgpt-notify': {
    entry: 'src/chatgpt-notify/main.ts',
    fileName: 'chatgpt-notify.user.js',
    meta: chatgptNotifyMeta,
  },
  'd-anime-cf-ranking': {
    entry: 'src/d-anime-cf-ranking/main.ts',
    fileName: 'd-anime-cf-ranking.user.js',
    meta: danimeCfRankingMeta,
  },
  'd-anime': {
    entry: 'src/d-anime/main.ts',
    fileName: 'd-anime-nico-comment-renderer.user.js',
    meta: danimeMeta,
  },
  'fanbox-floating-menu': {
    entry: 'src/fanbox-floating-menu/main.ts',
    fileName: 'fanbox-floating-menu.user.js',
    meta: fanboxFloatingMenuMeta,
  },
  'fanbox-pagination-helper': {
    entry: 'src/fanbox-pagination/main.ts',
    fileName: 'fanbox-pagination-helper.user.js',
    meta: fanboxPaginationHelperMeta,
  },
  'hf-download-command-copier': {
    entry: 'src/hf-download-command-copier/main.ts',
    fileName: 'hf-download-command-copier.user.js',
    meta: hfDownloadCommandCopierMeta,
  },
  'image-collector': {
    entry: 'src/image-collector/main.ts',
    fileName: 'image-collector.user.js',
    meta: imageCollectorMeta,
  },
  'imgur-direct-link-copier': {
    entry: 'src/imgur-direct-link/main.ts',
    fileName: 'imgur-direct-link.user.js',
    meta: imgurDirectLinkCopierMeta,
  },
  'khinsider-direct-link-saver': {
    entry: 'src/khinsider-direct-link-saver/main.ts',
    fileName: 'khinsider-direct-link-saver.user.js',
    meta: khinsiderDirectLinkSaverMeta,
  },
  'manga-viewer': {
    entry: 'src/manga-viewer/main.ts',
    fileName: 'manga-viewer.user.js',
    meta: mangaViewerMeta,
  },
  'native-video-volume-setter': {
    entry: 'src/native-video-volume-setter/main.ts',
    fileName: 'native-video-volume-setter.user.js',
    meta: nativeVideoVolumeSetterMeta,
  },
  'trickcal-tool-sweep': {
    entry: 'src/trickcal-tool-sweep/main.ts',
    fileName: 'trickcal-tool-sweep.user.js',
    meta: trickcalToolSweepMeta,
  },
  'twitter-clean-timeline': {
    entry: 'src/twitter-clean-timeline/main.ts',
    fileName: 'twitter-clean-timeline.user.js',
    meta: twitterCleanTimelineMeta,
  },
  'twitter-clean-ui': {
    entry: 'src/twitter-clean-ui/main.ts',
    fileName: 'twitter-clean-ui.user.js',
    meta: twitterCleanUIMeta,
  },
  'twitter-full-size-image': {
    entry: 'src/twitter-full-size-image/main.ts',
    fileName: 'twitter-full-size-image.user.js',
    meta: twitterFullSizeImageMeta,
  },
  'twitter-thread-copier': {
    entry: 'src/twitter-thread-copier/main.ts',
    fileName: 'twitter-thread-copier.user.js',
    meta: twitterThreadCopierMeta,
  },
  'video-screen-off-detection-blocker': {
    entry: 'src/video-screen-off-detection-blocker/main.ts',
    fileName: 'video-screen-off-detection-blocker.user.js',
    meta: videoScreenOffDetectionBlockerMeta,
  },
  'x-auto-spam-reporter': {
    entry: 'src/x-auto-spam-reporter/main.ts',
    fileName: 'x-auto-spam-reporter.user.js',
    meta: xAutoSpamReporterMeta,
  },
  'x-community-note-close': {
    entry: 'src/x-community-note-close/main.ts',
    fileName: 'x-community-note-close.user.js',
    meta: xCommunityNoteCloseMeta,
  },
  'yahoo-mail-ad-cleaner': {
    entry: 'src/yahoo-mail-ad-cleaner/main.ts',
    fileName: 'yahoo-mail-ad-cleaner.user.js',
    meta: yahooMailAdCleanerMeta,
  },
  'yahoo-mail-mark-read': {
    entry: 'src/yahoo-mail-mark-read/main.ts',
    fileName: 'yahoo-mail-mark-read.user.js',
    meta: yahooMailMarkReadMeta,
  },
  'youtube-info-copier': {
    entry: 'src/youtube-info-copier/main.ts',
    fileName: 'youtube-info-copier.user.js',
    meta: youtubeInfoCopierMeta,
  },
  'youtube-ui-modifier': {
    entry: 'src/youtube-ui-modifier/main.ts',
    fileName: 'youtube-ui-modifier.user.js',
    meta: youtubeUiModifierMeta,
  },
} as const;

type ScriptKey = keyof typeof SCRIPT_CONFIGS;

const DEFAULT_TARGET: ScriptKey = 'd-anime';

export default defineConfig((configEnv) => {
  const modeTarget = configEnv.mode as ScriptKey;
  const envTarget = process.env.USERSCRIPT_TARGET as ScriptKey | undefined;
  const target = SCRIPT_CONFIGS[modeTarget]
    ? modeTarget
    : envTarget && SCRIPT_CONFIGS[envTarget]
      ? envTarget
      : DEFAULT_TARGET;

  const scriptConfig = SCRIPT_CONFIGS[target];

  return {
    resolve: {
      alias: {
        '@': resolve(dir, 'src'),
        '@/chatgpt-notify': resolve(dir, 'src/chatgpt-notify'),
        '@/d-anime': resolve(dir, 'src/d-anime'),
        '@/d-anime-cf-ranking': resolve(dir, 'src/d-anime-cf-ranking'),
        '@/fanbox-floating-menu': resolve(dir, 'src/fanbox-floating-menu'),
        '@/fanbox-pagination-helper': resolve(dir, 'src/fanbox-pagination-helper'),
        '@/hf-download-command-copier': resolve(dir, 'src/hf-download-command-copier'),
        '@/image-collector': resolve(dir, 'src/image-collector'),
        '@/imgur-direct-link': resolve(dir, 'src/imgur-direct-link'),
        '@/khinsider-direct-link-saver': resolve(dir, 'src/khinsider-direct-link-saver'),
        '@/manga-viewer': resolve(dir, 'src/manga-viewer'),
        '@/native-video-volume-setter': resolve(dir, 'src/native-video-volume-setter'),
        '@/trickcal-tool-sweep': resolve(dir, 'src/trickcal-tool-sweep'),
        '@/twitter-clean-timeline': resolve(dir, 'src/twitter-clean-timeline'),
        '@/twitter-clean-ui': resolve(dir, 'src/twitter-clean-ui'),
        '@/twitter-full-size-image': resolve(dir, 'src/twitter-full-size-image'),
        '@/twitter-thread-copier': resolve(dir, 'src/twitter-thread-copier'),
        '@/x-auto-spam-reporter': resolve(dir, 'src/x-auto-spam-reporter'),
        '@/x-community-note-close': resolve(dir, 'src/x-community-note-close'),
        '@/yahoo-mail-ad-cleaner': resolve(dir, 'src/yahoo-mail-ad-cleaner'),
        '@/yahoo-mail-mark-read': resolve(dir, 'src/yahoo-mail-mark-read'),
        '@/youtube-info-copier': resolve(dir, 'src/youtube-info-copier'),
        '@/youtube-ui-modifier': resolve(dir, 'src/youtube-ui-modifier'),
        '@/shared': resolve(dir, 'src/shared'),
      },
    },
    build: {
      emptyOutDir:
        process.env.BUILD_EMPTY_OUT_DIR === 'true'
          ? true
          : process.env.BUILD_EMPTY_OUT_DIR === 'false'
            ? false
            : configEnv.command === 'build' && target === DEFAULT_TARGET,
      minify: true,
    },
    plugins: [createUserscriptPlugin(scriptConfig.entry, scriptConfig.fileName, scriptConfig.meta)],
  };
});
