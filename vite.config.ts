import { defineConfig } from 'vite';
import monkey, { MonkeyUserScript } from 'vite-plugin-monkey';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

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

const chatgptNotifyMeta: MonkeyUserScript = {
  name: 'chat-gpt-notify',
  namespace: 'chatGptNotify',
  version: '2.1.1',
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

const danimeMeta: MonkeyUserScript = {
  name: 'd-anime-nico-comment-renderer',
  namespace: 'dAnimeNicoCommentRenderer',
  version: '6.9.2',
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
  version: '2.1.0',
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
  version: '2.1.0',
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

const imageCollectorMeta: MonkeyUserScript = {
  name: 'image-collector',
  namespace: 'imageCollector',
  version: '5.2.0',
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
    'GM_xmlhttpRequest',
    'GM_registerMenuCommand',
    'unsafeWindow',
  ],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/image-collector.user.js',
};

const imgurDirectLinkCopierMeta: MonkeyUserScript = {
  name: 'imgur-image-link-copier',
  namespace: 'imgurImageLinkCopier',
  version: '3.2.0',
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

const mangaViewerMeta: MonkeyUserScript = {
  name: 'book-style-manga-viewer',
  namespace: 'bookStyleMangaViewer',
  version: '10.5.0',
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
  grant: ['GM_registerMenuCommand'],
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/manga-viewer.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/manga-viewer.user.js',
};

const twitterFullSizeImageMeta: MonkeyUserScript = {
  name: 'twitter-image-fullsize-redirect',
  namespace: 'twitterImageFullsizeRedirect',
  version: '2.1.1',
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

const twitterMediaFilterMeta: MonkeyUserScript = {
  name: 'twitter-media-filter',
  namespace: 'twitterMediaFilter',
  version: '2.2.0',
  description: 'タイムライン/リスト/詳細ページで画像/動画を含まないツイートを非表示にする',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-media-filter.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-media-filter.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=twitter.com',
  'run-at': 'document-idle',
};

const twitterMuteFilterMeta: MonkeyUserScript = {
  name: 'twitter-mute-filter',
  namespace: 'twitterMuteFilter',
  version: '2.2.1',
  description: '正規表現対応の強力なミュートフィルターをTwitter/Xに追加します。',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-filter.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-filter.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=twitter.com',
  'run-at': 'document-idle',
};

const twitterMuteRetweetsMeta: MonkeyUserScript = {
  name: 'twitter-mute-retweets',
  namespace: 'twitterMuteRetweets',
  version: '2.2.0',
  description: '閲覧中のユーザがつぶやいていないツイート（リツイート）を非表示にする',
  author: 'roflsunriz',
  match: ['https://x.com/*'],
  exclude: ['https://x.com/*/status/*'],
  grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-retweets.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-mute-retweets.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
};

const twitterThreadCopierMeta: MonkeyUserScript = {
  name: 'twitter-thread-copier',
  namespace: 'twitterThreadCopier',
  version: '6.4.0',
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

const twitterWideLayoutFixMeta: MonkeyUserScript = {
  name: 'twitter-wide-layout-fix',
  namespace: 'twitterWideLayoutFix',
  version: '2.1.0',
  description: 'Adjusts Twitter layout width using class and XPath selectors',
  author: 'roflsunriz',
  match: ['https://twitter.com/*', 'https://x.com/*'],
  grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-wide-layout-fix.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/twitter-wide-layout-fix.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=x.com',
};

const youtubeInfoCopierMeta: MonkeyUserScript = {
  name: 'youtube-info-copier',
  namespace: 'youtubeInfoCopier',
  version: '2.2.1',
  description: 'YouTube動画の情報をワンクリックでクリップボードにコピー（ハンドル式）',
  author: 'roflsunriz',
  match: ['https://www.youtube.com/*', 'https://youtu.be/*'],
  grant: ['GM_setClipboard'],
  'run-at': 'document-start',
  updateURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.meta.js',
  downloadURL:
    'https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/youtube-info-copier.user.js',
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=youtube.com',
};

const SCRIPT_CONFIGS = {
  'chatgpt-notify': {
    entry: 'src/chatgpt-notify/main.ts',
    fileName: 'chatgpt-notify.user.js',
    meta: chatgptNotifyMeta,
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
  'manga-viewer': {
    entry: 'src/manga-viewer/main.ts',
    fileName: 'manga-viewer.user.js',
    meta: mangaViewerMeta,
  },
  'twitter-full-size-image': {
    entry: 'src/twitter-full-size-image/main.ts',
    fileName: 'twitter-full-size-image.user.js',
    meta: twitterFullSizeImageMeta,
  },
  'twitter-media-filter': {
    entry: 'src/twitter-media-filter/main.ts',
    fileName: 'twitter-media-filter.user.js',
    meta: twitterMediaFilterMeta,
  },
  'twitter-mute-filter': {
    entry: 'src/twitter-mute-filter/main.ts',
    fileName: 'twitter-mute-filter.user.js',
    meta: twitterMuteFilterMeta,
  },
  'twitter-mute-retweets': {
    entry: 'src/twitter-mute-retweets/main.ts',
    fileName: 'twitter-mute-retweets.user.js',
    meta: twitterMuteRetweetsMeta,
  },
  'twitter-thread-copier': {
    entry: 'src/twitter-thread-copier/main.ts',
    fileName: 'twitter-thread-copier.user.js',
    meta: twitterThreadCopierMeta,
  },
  'twitter-wide-layout-fix': {
    entry: 'src/twitter-wide-layout-fix/main.ts',
    fileName: 'twitter-wide-layout-fix.user.js',
    meta: twitterWideLayoutFixMeta,
  },
  'youtube-info-copier': {
    entry: 'src/youtube-info-copier/main.ts',
    fileName: 'youtube-info-copier.user.js',
    meta: youtubeInfoCopierMeta,
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
        '@/fanbox-floating-menu': resolve(dir, 'src/fanbox-floating-menu'),
        '@/fanbox-pagination-helper': resolve(dir, 'src/fanbox-pagination-helper'),
        '@/image-collector': resolve(dir, 'src/image-collector'),
        '@/imgur-direct-link': resolve(dir, 'src/imgur-direct-link'),
        '@/manga-viewer': resolve(dir, 'src/manga-viewer'),
        '@/twitter-full-size-image': resolve(dir, 'src/twitter-full-size-image'),
        '@/twitter-media-filter': resolve(dir, 'src/twitter-media-filter'),
        '@/twitter-mute-filter': resolve(dir, 'src/twitter-mute-filter'),
        '@/twitter-mute-retweets': resolve(dir, 'src/twitter-mute-retweets'),
        '@/twitter-thread-copier': resolve(dir, 'src/twitter-thread-copier'),
        '@/twitter-wide-layout-fix': resolve(dir, 'src/twitter-wide-layout-fix'),
        '@/youtube-info-copier': resolve(dir, 'src/youtube-info-copier'),
        '@/shared': resolve(dir, 'src/shared'),
        'comment-overlay': resolve(dir, 'node_modules/comment-overlay/dist/comment-overlay.es'),
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
