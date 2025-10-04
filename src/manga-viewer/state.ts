import type { GlassControlPanel } from './ui/glass-control-panel';
import type { MangaViewerApp } from './manga-viewer-app';

// Keydownイベントディスパッチャの型定義
export type KeyDownDispatcher = (e: KeyboardEvent & { __mvHandled?: boolean }) => void;

// グローバル状態の型定義
export interface MangaViewerState {
  isViewerActive: boolean;
  eventListeners: {
    element: EventTarget;
    event: string;
    handler: EventListenerOrEventListenerObject;
    options: boolean | AddEventListenerOptions;
  }[];
  timers: (number | NodeJS.Timeout)[];
  observers: MutationObserver[];
  controlPanel: GlassControlPanel | null;
  keyDispatcher: KeyDownDispatcher | null;
  earlyKeyHookInstalled: boolean;
  app: MangaViewerApp | null;
}

// グローバル状態
export const globalState: MangaViewerState = {
  isViewerActive: false,
  eventListeners: [],
  timers: [],
  observers: [],
  controlPanel: null,
  keyDispatcher: null,
  earlyKeyHookInstalled: false,
  app: null,
};
