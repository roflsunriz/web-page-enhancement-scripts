
import {
  GM_registerMenuCommand,
  GM_addStyle,
  GM_xmlhttpRequest,
  GM_setValue,
  GM_getValue,
  GM_deleteValue,
  GM_listValues,
  GM_openInTab,
  GM_notification,
  GM_setClipboard,
  GM_download,
} from 'vite-plugin-monkey/dist/client';
export * from './getUnsafeWindow';

export type MenuCommandHandler = () => void;

/**
 * メニューコマンドを登録する
 */
export function registerMenuCommand(name: string, handler: MenuCommandHandler): void {
  GM_registerMenuCommand(name, handler);
}

/**
 * スタイルを追加する
 */
export function addStyle(css: string): void {
  GM_addStyle(css);
}

/**
 * HTTPリクエストを送信する
 */
export const xmlHttpRequest = GM_xmlhttpRequest;

/**
 * 値を保存する
 */
export function setValue<T>(key: string, value: T): void {
  GM_setValue(key, value);
}

/**
 * 値を取得する
 */
export function getValue<T>(key: string, defaultValue?: T): T | undefined {
  // defaultValueが与えられていればそれを返す
  return GM_getValue(key, defaultValue);
}

/**
 * 値を削除する
 */
export function deleteValue(key: string): void {
  GM_deleteValue(key);
}

/**
 * 保存されている全てのキーを取得する
 */
export function listValues(): string[] {
  return GM_listValues();
}

/**
 * 新しいタブでURLを開く
 */
export function openInTab(url: string, options?: Parameters<typeof GM_openInTab>[1]): void {
  GM_openInTab(url, options);
}

/**
 * 通知を表示する
 */
export function notify(text: string, title?: string, image?: string, onclick?: () => void): void {
  GM_notification({ text, title, image, onclick });
}

/**
 * クリップボードにテキストをコピーする
 */
export function setClipboard(data: string, type?: string): void {
  if (typeof type === 'string') {
    GM_setClipboard(data, type);
  } else {
    // typeが未指定の場合はデフォルト値"text"を明示的に渡す
    GM_setClipboard(data, 'text');
  }
}

/**
 * ファイルをダウンロードする
 */
export function download(details: Parameters<typeof GM_download>[0]): void {
  GM_download(details);
}
