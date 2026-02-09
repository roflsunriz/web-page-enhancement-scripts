/** 起動ボタンのスタイル */
export const LAUNCH_STYLES = ['classic', 'fab', 'menu-only'] as const;
export type LaunchStyle = (typeof LAUNCH_STYLES)[number];

export const LAUNCH_STYLE_LABELS: Readonly<Record<LaunchStyle, string>> = {
  classic: '従来スタイル',
  fab: 'FABボタン',
  'menu-only': 'メニューのみ',
} as const;
