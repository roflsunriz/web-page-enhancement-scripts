import { ImageCollectorApplication } from "./application";
import { createLogger } from "@/shared/logger";
import {
  isSiteAccessAllowed,
  registerScriptSettingsMenu,
} from "@/shared/script-settings";

const log = createLogger("ImageCollector2");
const SCRIPT_ID = "image-collector";

export async function bootstrapImageCollectorUserscript(): Promise<void> {
  log.info("bootstrap start");
  try {
    registerScriptSettingsMenu({
      scriptId: SCRIPT_ID,
      scriptName: "image-collector",
    });

    if (!isSiteAccessAllowed(SCRIPT_ID)) {
      log.info("site access blocked");
      return;
    }

    const app = new ImageCollectorApplication();
    app.start();
    log.info("legacy bootstrap completed");
  } catch (error) {
    log.error("bootstrap failed", error);
  }
}
