import { LegacyConfiguration, defaultLegacyCollectorConfig } from "./config";
import { getUnsafeWindow } from "@/shared/userscript";
import { createLogger, type Logger } from "@/shared/logger";
import { registerConfigCommands } from "./register-config-commands";
import { BadImageHandler } from "./core/bad-image-handler";
import { ImageCollectorMain } from "./core/image-collector";
import { ImageHostManager } from "./core/image-host-manager";
import { ImageSourceClassifier } from "./core/image-source-classifier";
import { RequestBatchLimiter } from "./core/request-batch-limiter";
import { ZipDownloader } from "./core/zip-downloader";
import { MenuRegister } from "./ui/menu-register";
import { ProgressBar } from "./ui/progress-bar";
import { Toast } from "./ui/toast";
import { UIBatchUpdater } from "./ui/ui-batch-updater";
import { UIBuilder } from "./ui/ui-builder";
import { UIEventHandler } from "./ui/ui-event-handler";

export async function runLegacyImageCollector(): Promise<void> {
  const config = new LegacyConfiguration(defaultLegacyCollectorConfig);
  const logger = createLogger("ImageCollector2");
  const bootstrapLogger = createLogger("ImageCollector2:Bootstrap");

  bootstrapLogger.info("legacy collector bootstrap start");

  // Material Iconsフォント注入は廃止（@mdi/jsのSVGを使用）

  initializeComponents(config, logger, bootstrapLogger);
}

function initializeComponents(
  config: LegacyConfiguration,
  logger: Logger,
  bootstrapLogger: Logger,
): void {
  try {
    const badImageHandler = new BadImageHandler(
      // create a namespaced logger for this component
      createLogger("ImageCollector2:BadImageHandler"),
    );
    const uiBuilder = new UIBuilder(
      config,
      badImageHandler,
      createLogger("ImageCollector2:UIBuilder"),
    );
    uiBuilder.buildModal();

    requestAnimationFrame(() => {
      try {
        const progressBar = new ProgressBar(createLogger("ImageCollector2:ProgressBar"));
        const toast = new Toast(createLogger("ImageCollector2:Toast"));
        const uiBatchUpdater = new UIBatchUpdater(
          uiBuilder,
          badImageHandler,
          createLogger("ImageCollector2:UIBatchUpdater"),
        );
        const zipDownloader = new ZipDownloader(
          uiBuilder,
          badImageHandler,
          toast,
          progressBar,
          createLogger("ImageCollector2:ZipDownloader"),
          config,
        );
        const uiEventHandler = new UIEventHandler(
          uiBuilder,
          zipDownloader,
          createLogger("ImageCollector2:UIEventHandler"),
        );
        uiEventHandler.initialize();

        const imageCollectorMain = new ImageCollectorMain(
          uiBatchUpdater,
          badImageHandler,
          progressBar,
          toast,
          createLogger("ImageCollector2:ImageCollectorMain"),
        );

        const menuRegister = new MenuRegister(
          uiBuilder,
          imageCollectorMain,
          createLogger("ImageCollector2:MenuRegister"),
        );
        menuRegister.register();

        registerConfigCommands(
          config,
          createLogger("ImageCollector2:ConfigCommands"),
          uiBuilder,
        );

        exposeDebugHandles({
          config,
          uiBuilder,
          uiBatchUpdater,
          uiEventHandler,
          imageCollectorMain,
          badImageHandler,
          toast,
          progressBar,
          zipDownloader,
        });

        bootstrapLogger.info("legacy collector components initialized");
      } catch (error) {
        bootstrapLogger.error(
          "遅延初期化中にエラーが発生しました",
          error instanceof Error ? error : undefined,
        );
      }
    });
  } catch (error) {
    bootstrapLogger.error(
      "コンポーネント初期化中にエラーが発生しました",
      error instanceof Error ? error : undefined,
    );
  }
}

// ensureMaterialIcons は不要になったため削除
interface DebugHandles {
  config: LegacyConfiguration;
  uiBuilder: UIBuilder;
  uiBatchUpdater: UIBatchUpdater;
  uiEventHandler: UIEventHandler;
  imageCollectorMain: ImageCollectorMain;
  badImageHandler: BadImageHandler;
  toast: Toast;
  progressBar: ProgressBar;
  zipDownloader: ZipDownloader;
}

function exposeDebugHandles(handles: DebugHandles): void {
  getUnsafeWindow().ImageCollector2 = {
    MenuRegister,
    UIBuilder,
    UIBatchUpdater,
    UIEventHandler,
    ImageCollectorMain,
    BadImageHandler,
    ImageSourceClassifier,
    Toast,
    ProgressBar,
    RequestBatchLimiter,
    ImageHostManager,
    ZipDownloader,
    ...handles,
    config: handles.config,
  } as Record<string, unknown>;
}
