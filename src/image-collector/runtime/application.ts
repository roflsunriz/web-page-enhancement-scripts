import { createLogger, Logger } from "@/shared/logger";
import type { CollectionOptions } from "@/shared/types";
import { runLegacyImageCollector } from "..";

export class ImageCollectorApplication {
  private readonly log: Logger;

  constructor(private readonly options: Partial<CollectionOptions> = {}) {
    this.log = createLogger("ImageCollectorApp");
  }

  start(): void {
    this.log.info("starting legacy collector");
    runLegacyImageCollector();
  }
}
