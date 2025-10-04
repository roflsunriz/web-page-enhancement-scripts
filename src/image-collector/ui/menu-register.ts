import type { ImageCollectorMain } from "../core/image-collector";
import type { Logger } from "@/shared/logger";
import { UIBuilder } from "./ui-builder";
import { registerMenuCommand } from "@/shared/userscript";

export class MenuRegister {
  constructor(
    private readonly uiBuilder: UIBuilder,
    private readonly imageCollector: ImageCollectorMain,
    private readonly logger: Logger,
  ) {}

  register(): void {
    registerMenuCommand("🚀起動", () => {
      try {
        this.uiBuilder.showModal();
        void this.imageCollector.collectImages();
      } catch (error) {
        this.logger.error(
          "メニューコマンド実行中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
    this.logger.debug("メニューコマンドを登録しました");
  }
}
