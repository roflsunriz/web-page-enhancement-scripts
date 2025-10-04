import { MangaViewerApp } from './manga-viewer-app';

function main() {
  try {
    const app = new MangaViewerApp();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => app.initialize());
    } else {
      app.initialize();
    }
  } catch (error) {
    console.error('[MangaViewer] Bootstrap failed:', error);
  }
}

main();
