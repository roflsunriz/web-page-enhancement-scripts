import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

// 小さなラッパー: 今後、共通設定やフォールバックをここで管理できます
export default React;
export const createRoot = ReactDOMClient.createRoot;
export type Root = ReactDOMClient.Root;



