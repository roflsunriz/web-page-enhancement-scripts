import type { Logger } from "@/shared/logger";

type RequestTask<T> = () => Promise<T>;

type RequestResult = PromiseSettledResult<unknown>;

export class RequestBatchLimiter {
  private readonly queue: RequestTask<unknown>[] = [];
  private isProcessing = false;

  constructor(
    private readonly logger: Logger,
    private readonly batchSize = 5,
    private readonly delay = 1000,
  ) {}

  addRequest<T>(requestFn: RequestTask<T>): void {
    this.queue.push(requestFn);
    if (!this.isProcessing) {
      void this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    try {
      this.isProcessing = true;
      let processedBatches = 0;
      let totalErrors = 0;

      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.batchSize);
        processedBatches += 1;
        try {
          const results: RequestResult[] = await Promise.allSettled(
            batch.map((fn) => fn()),
          );
          const batchErrors = results.filter(
            (result) => result.status === "rejected",
          ).length;
          totalErrors += batchErrors;

          if (batchErrors > 0) {
            this.logger.warn("バッチ処理でエラーが発生しました", {
              batchNumber: processedBatches,
              batchErrors,
            });

            results.forEach((result, index) => {
              if (result.status === "rejected") {
                const reason =
                  result.reason instanceof Error ? result.reason : undefined;
                this.logger.error(
                  "バッチ処理タスクでエラーが発生しました",
                  reason,
                  {
                    batchNumber: processedBatches,
                    taskIndex: index,
                  },
                );
              }
            });
          }
        } catch (error) {
          this.logger.error(
            "バッチ処理中に予期しないエラーが発生しました",
            error instanceof Error ? error : undefined,
            {
              batchNumber: processedBatches,
            },
          );
          totalErrors += 1;
        }

        if (this.queue.length > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.delay));
        }
      }

      if (totalErrors > 0) {
        this.logger.warn("バッチ処理完了", { processedBatches, totalErrors });
      } else {
        this.logger.debug("バッチ処理完了", { processedBatches, totalErrors });
      }
    } catch (error) {
      this.logger.error(
        "バッチ処理中に致命的なエラーが発生しました",
        error instanceof Error ? error : undefined,
      );
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }
}
