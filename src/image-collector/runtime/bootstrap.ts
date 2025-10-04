import { createLogger } from "@/shared/logger";
import { ImageCollectorApplication } from "./application";

const log = createLogger("ImageCollector2");

export async function bootstrapImageCollectorUserscript(): Promise<void> {
  log.info("bootstrap start");
  try {
    const app = new ImageCollectorApplication();
    app.start();
    log.info("legacy bootstrap completed");
  } catch (error) {
    log.error("bootstrap failed", error);
  }
}
