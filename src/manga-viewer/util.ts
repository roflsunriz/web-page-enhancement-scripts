import { globalState } from './state';
import React from '@/shared/react';
import { createRoot } from '@/shared/react';
import { getUnsafeWindow } from '@/shared/userscript';

/**
 * 安全なイベントリスナー追加
 * @param element 対象要素
 * @param event イベント名
 * @param handler ハンドラ
 * @param options オプション
 * @returns リスナー情報。失敗した場合はnull
 */
export function addEventListenerSafely(
  element: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions = false,
): { element: EventTarget; event: string; handler: EventListenerOrEventListenerObject; options: boolean | AddEventListenerOptions } | null {
  try {
    // 型チェックを厳密化して any を回避
    const maybeElement = element as unknown as { addEventListener?: unknown };
    if (!maybeElement || typeof maybeElement.addEventListener !== 'function') {
      return null;
    }

    (maybeElement.addEventListener as (ev: string, h: EventListenerOrEventListenerObject, o?: boolean | AddEventListenerOptions) => void)(
      event,
      handler,
      options,
    );
    const listenerInfo = { element, event, handler, options };
    globalState.eventListeners.push(listenerInfo);
    return listenerInfo;
  } catch {
    // console.error('[MangaViewer] Error adding event listener:', error);
    return null;
  }
}

/**
 * 安全なタイマー設定 (setTimeout)
 * @param callback コールバック関数
 * @param delay 遅延時間(ms)
 * @returns タイマーID。失敗した場合はnull
 */
export function setTimeoutSafely(callback: () => void, delay: number): number | null {
  try {
    const timerId = window.setTimeout(() => {
      try {
        callback();
      } catch {
        // Timer callback error - silently continue
      } finally {
        const index = globalState.timers.indexOf(timerId);
        if (index > -1) {
          globalState.timers.splice(index, 1);
        }
      }
    }, delay);

    globalState.timers.push(timerId);
    return timerId;
  } catch {
    // console.error('[MangaViewer] Error setting timeout:', error);
    return null;
  }
}

/**
 * 安全なインターバル設定 (setInterval)
 * @param callback コールバック関数
 * @param interval 間隔(ms)
 * @returns インターバルID。失敗した場合はnull
 */
export function setIntervalSafely(callback: () => void, interval: number): number | null {
  try {
    const intervalId = window.setInterval(() => {
      try {
        callback();
      } catch {
        // Interval callback error - silently continue
      }
    }, interval);

    globalState.timers.push(intervalId);
    return intervalId;
  } catch {
    // console.error('[MangaViewer] Error setting interval:', error);
    return null;
  }
}

/**
 * 安全なMutationObserver作成
 * @param callback コールバック関数
 * @param options オプション
 * @returns MutationObserverインスタンス。失敗した場合はnull
 */
export function createObserverSafely(callback: MutationCallback): MutationObserver | null {
  try {
    const observer = new MutationObserver((mutations, obs) => {
      try {
        callback(mutations, obs);
      } catch {
        // Observer callback error - silently continue
      }
    });

    globalState.observers.push(observer);
    return observer;
  } catch {
    // console.error('[MangaViewer] Error creating observer:', error);
    return null;
  }
}

/**
 * モバイルデバイスかどうかを判定する
 * @returns モバイルデバイスであればtrue
 */
export const isMobile = (): boolean => {
  try {
    const ua = typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' ? navigator.userAgent : '';
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  } catch (error) {
    console.error('[MangaViewer] Error detecting mobile:', error);
    return false;
  }
};

/**
 * ビューポートを設定する
 */
export const setViewport = (): void => {
  try {
    let viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      if (document.head) {
        document.head.appendChild(viewport);
      } else {
        console.error('[MangaViewer] Document head not available for viewport');
        return;
      }
    }
    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  } catch (error) {
    console.error('[MangaViewer] Error setting viewport:', error);
  }
};

/**
 * React/ReactDOMの可用性をチェックする
 * @returns Reactが利用可能であればtrue
 */
export function checkReactAvailability(): boolean {
  try {
    if (typeof React === 'undefined' || typeof createRoot !== 'function') {
      console.error('[MangaViewer] React or ReactDOM.createRoot is not available');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Tampermonkey環境の `unsafeWindow` と開発環境の `window` を抽象化します。
 * `vite-plugin-monkey` を使った開発では `unsafeWindow` が定義されていないため、
 * このフォールバックが必要です。
 */
// Use shared helper for unsafeWindow abstraction
export const win: Window & typeof globalThis = getUnsafeWindow();

// Viewer がマウントされる前にコレクター等から進捗通知が来る可能性があるため、
// 一時バッファを用意しておく。Viewer 側がマウントされたらバッファをフラッシュする。
try {
  // 型安全に MangaViewer グローバルを初期化
  const mv = (win as unknown as { MangaViewer?: unknown }).MangaViewer as
    | { _progressBuffer?: Array<[number, string, string | null]>; updateProgress?: (...args: unknown[]) => void }
    | undefined;
  if (!mv) {
    (win as unknown as { MangaViewer?: unknown }).MangaViewer = {
      _progressBuffer: [] as Array<[number, string, string | null]>,
      // 外部から呼ばれる可能性があるため可変長引数で受け、安全にパースする
      updateProgress: (...args: unknown[]) => {
        try {
          const [percent, message, phase] = args;
          if (typeof percent !== 'number' || typeof message !== 'string') return;
          const holder = (win as unknown as { MangaViewer?: { _progressBuffer?: Array<[number, string, string | null]> } }).MangaViewer;
          if (holder && Array.isArray(holder._progressBuffer)) {
            holder._progressBuffer.push([percent, message, typeof phase === 'string' ? phase : null]);
          }
        } catch {
          // ignore
        }
      },
    };
  } else if (!('_progressBuffer' in mv)) {
    (mv as { _progressBuffer?: Array<[number, string, string | null]> })._progressBuffer = [];
    // 保守的に updateProgress を設定
    (mv as { updateProgress?: (...args: unknown[]) => void }).updateProgress = (...args: unknown[]) => {
      try {
        const [percent, message, phase] = args;
        if (typeof percent !== 'number' || typeof message !== 'string') return;
        (mv as { _progressBuffer?: Array<[number, string, string | null]> })._progressBuffer!.push([
          percent,
          message,
          typeof phase === 'string' ? phase : null,
        ]);
      } catch {
        /* ignore */
      }
    };
  }
} catch {
  // エラーを無視
}