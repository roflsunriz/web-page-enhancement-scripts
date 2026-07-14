/**
 * Twitter Clean UI - 右サイドバー設定の document-start 適用
 *
 * 保存済み設定だけを同期的に読み、他の初期化より先に項目別 CSS を注入する。
 */

import {
  applyRightSidebarVisibilityCSS,
  DEFAULT_RIGHT_SIDEBAR_VISIBILITY,
  RIGHT_SIDEBAR_ELEMENT_IDS,
  type RightSidebarVisibility,
} from "./right-sidebar-visibility";
import { STORAGE_KEY } from "./storage-keys";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStoredData(value: unknown): unknown {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function readStorageValue(): unknown {
  if (typeof GM_getValue !== "undefined") {
    return GM_getValue(STORAGE_KEY, null) as unknown;
  }
  return localStorage.getItem(STORAGE_KEY);
}

function readRightSidebarVisibility(): RightSidebarVisibility {
  const visibility: RightSidebarVisibility = {
    ...DEFAULT_RIGHT_SIDEBAR_VISIBILITY,
  };
  const data = parseStoredData(readStorageValue());

  if (!isRecord(data) || !isRecord(data.settings)) return visibility;
  if (!isRecord(data.settings.visibility)) return visibility;

  for (const elementId of RIGHT_SIDEBAR_ELEMENT_IDS) {
    const storedValue = data.settings.visibility[elementId];
    if (typeof storedValue === "boolean") {
      visibility[elementId] = storedValue;
    }
  }

  return visibility;
}

try {
  applyRightSidebarVisibilityCSS(readRightSidebarVisibility());
} catch {
  // 通常初期化の CSSInjector で再適用する。
}
