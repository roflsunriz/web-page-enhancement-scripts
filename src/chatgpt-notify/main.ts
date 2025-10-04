import { loadSettings } from "./settings";
import { sendNotification } from "./notification";
import { startObserver } from "./dom-observer";
import { createSettingsUI } from "./ui";

/**
 * スクリプトのメインエントリーポイント
 */
function main() {
  "use strict";

  // 完了時に実行されるコールバック
  const onGenerationComplete = () => {
    const settings = loadSettings();
    sendNotification(settings);
  };

  startObserver(onGenerationComplete);
  GM_registerMenuCommand("設定", createSettingsUI);
}

main();