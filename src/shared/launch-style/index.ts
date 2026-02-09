import { getValue, setValue, registerMenuCommand } from '@/shared/userscript';
import { LAUNCH_STYLES, LAUNCH_STYLE_LABELS } from '@/shared/types/launch-style';
import type { LaunchStyle } from '@/shared/types/launch-style';

const STORAGE_KEY_PREFIX = 'launch-style-';

/**
 * 保存された起動スタイルを取得する
 */
export function getLaunchStyle(scriptId: string, defaultStyle: LaunchStyle = 'classic'): LaunchStyle {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  const stored = getValue<string>(key);
  if (typeof stored === 'string' && (LAUNCH_STYLES as readonly string[]).includes(stored)) {
    return stored as LaunchStyle;
  }
  return defaultStyle;
}

/**
 * 起動スタイルを保存する
 */
export function setLaunchStyle(scriptId: string, style: LaunchStyle): void {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  setValue(key, style);
}

/**
 * 次の起動スタイルに循環する
 */
export function cycleLaunchStyle(current: LaunchStyle): LaunchStyle {
  const idx = LAUNCH_STYLES.indexOf(current);
  const nextIdx = (idx + 1) % LAUNCH_STYLES.length;
  return LAUNCH_STYLES[nextIdx];
}

/**
 * 起動スタイル切り替えメニューコマンドを登録する
 */
export function registerLaunchStyleMenu(
  scriptId: string,
  onStyleChanged?: (newStyle: LaunchStyle) => void,
): void {
  const current = getLaunchStyle(scriptId);
  const label = `起動スタイル変更 [現在: ${LAUNCH_STYLE_LABELS[current]}]`;
  registerMenuCommand(label, () => {
    const currentStyle = getLaunchStyle(scriptId);
    const newStyle = cycleLaunchStyle(currentStyle);
    setLaunchStyle(scriptId, newStyle);
    onStyleChanged?.(newStyle);
    alert(`起動スタイルを「${LAUNCH_STYLE_LABELS[newStyle]}」に変更しました。\nページを再読み込みすると反映されます。`);
  });
}
