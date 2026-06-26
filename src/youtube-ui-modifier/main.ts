import { YoutubeUiModifierApp } from './app';

new YoutubeUiModifierApp().initialize().catch((error: unknown) => {
  console.error('[YouTube UI Modifier] initialization failed', error);
});
