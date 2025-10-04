import type { LegacyConfiguration } from "./config";
import type { Logger } from "@/shared/logger";
import type { UIBuilder } from "./ui/ui-builder";
import { getUnsafeWindow } from "@/shared/userscript";

export function registerConfigCommands(
  config: LegacyConfiguration,
  logger: Logger,
  uiBuilder: UIBuilder,
): void {
  const win = getUnsafeWindow();

  win.setImageCollectorDebug = (value: boolean): boolean => {
    const enabled = config.setDebugMode(value);
    logger.info(`デバッグモード: ${enabled ? "オン" : "オフ"}`);
    return enabled;
  };

  win.setImageCollectorZipButton = (value: boolean): boolean => {
    const visible = config.setShowZipButton(value);
    logger.info(`ZIPボタン: ${visible ? "表示" : "非表示"}`);
    uiBuilder.setZipButtonVisibility(visible);
    return visible;
  };

  win.setSingleImageTest = (value: boolean): boolean => {
    const enabled = config.setSingleImageTest(value);
    logger.info(`単一画像テストモード: ${enabled ? "オン" : "オフ"}`);
    return enabled;
  };
}
