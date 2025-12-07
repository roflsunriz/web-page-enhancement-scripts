import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { rm } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const configFile = resolve(projectRoot, 'vite.config.ts');

const targets = [
  { mode: 'chatgpt-notify', clear: false },
  { mode: 'd-anime', clear: false },
  { mode: 'fanbox-floating-menu', clear: false },
  { mode: 'fanbox-pagination-helper', clear: false },
  { mode: 'image-collector', clear: false },
  { mode: 'manga-viewer', clear: false },
  { mode: 'imgur-direct-link-copier', clear: false },
  { mode: 'twitter-clean-ui', clear: false },
  { mode: 'twitter-clean-timeline', clear: false },
  { mode: 'twitter-full-size-image', clear: false },
  { mode: 'twitter-thread-copier', clear: false },
  { mode: 'youtube-info-copier', clear: false },
  { mode: 'native-video-volume-setter', clear: false },
];

async function run() {
  await rm(resolve(projectRoot, 'dist'), { recursive: true, force: true });

  for (const { mode, clear } of targets) {
    process.env.BUILD_EMPTY_OUT_DIR = clear ? 'true' : 'false';
    process.env.USERSCRIPT_TARGET = mode;
    await build({
      configFile,
      mode,
      envFile: true,
      clearScreen: false,
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
