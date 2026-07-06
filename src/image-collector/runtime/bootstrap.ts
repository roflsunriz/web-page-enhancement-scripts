import { ImageCollectorApplication } from "./application";
import { createLogger } from "@/shared/logger";
import {
  isSiteAccessAllowed,
  registerScriptSettingsMenu,
} from "@/shared/script-settings";
import { createImageExclusionSettingsSectionFactory } from "@/shared/image-exclusion-settings";
import { isKnownBadImageCollectorCandidate } from "../core/bad-image-handler";

const log = createLogger("ImageCollector2");
const SCRIPT_ID = "image-collector";

export async function bootstrapImageCollectorUserscript(): Promise<void> {
  log.info("bootstrap start");
  try {
    registerScriptSettingsMenu({
      scriptId: SCRIPT_ID,
      scriptName: "image-collector",
      customSections: [
        createImageExclusionSettingsSectionFactory({
          shouldIncludeCandidate: (candidate) =>
            !isKnownBadImageCollectorCandidate(
              candidate.url,
              candidate.width,
              candidate.height,
            ),
        }),
      ],
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
