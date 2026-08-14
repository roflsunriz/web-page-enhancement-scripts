import { cloneDefaultSettings as cloneOverlayDefaults } from "comment-overlay";
import type { RendererSettings } from "@/shared/types";

export { DEFAULT_RENDERER_SETTINGS } from "comment-overlay";

export const cloneDefaultSettings = (): RendererSettings => ({
  ...cloneOverlayDefaults(),
  shadowIntensity: "strong",
  autoSearchEnabled: true,
});

// 配布ビルドでは、vite.config.tsの対象メタデータからバージョンが注入されます。
// Bunでこのモジュールを直接読み込むテストでは、注入前なので開発用表示へフォールバックします。
const userscriptVersion = import.meta.env.USERSCRIPT_VERSION;
export const USERSCRIPT_VERSION_UI_DISPLAY = userscriptVersion
  ? `v${userscriptVersion}`
  : "development";
