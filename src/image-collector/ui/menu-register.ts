import type { ImageCollectorMain } from "../core/image-collector";
import type { Logger } from "@/shared/logger";
import { UIBuilder } from "./ui-builder";
import { registerMenuCommand } from "@/shared/userscript";
import { t } from "../i18n";

export class MenuRegister {
  constructor(
    private readonly uiBuilder: UIBuilder,
    private readonly imageCollector: ImageCollectorMain,
    private readonly logger: Logger,
  ) {}

  register(): void {
    registerMenuCommand(t("menuLaunch"), () => {
      try {
        this.uiBuilder.showModal();
        void this.imageCollector.collectImages();
      } catch (error) {
        this.logger.error(
          "メニューコマンド実行中にエラーが発生しました",
          error,
        );
      }
    });
    this.logger.debug("メニューコマンドを登録しました");
  }
}
