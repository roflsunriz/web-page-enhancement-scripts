import type { LegacyCollectorConfig } from "@/shared/types";

export const defaultLegacyCollectorConfig: LegacyCollectorConfig = {
  debugMode: false,
  showZipButton: true,
  singleImageTest: false,
};

export class LegacyConfiguration {
  private state: LegacyCollectorConfig;

  constructor(initial?: Partial<LegacyCollectorConfig>) {
    this.state = { ...defaultLegacyCollectorConfig, ...initial };
  }

  get snapshot(): LegacyCollectorConfig {
    return { ...this.state };
  }

  get debugMode(): boolean {
    return this.state.debugMode;
  }

  get showZipButton(): boolean {
    return this.state.showZipButton;
  }

  get singleImageTest(): boolean {
    return this.state.singleImageTest;
  }

  isDebugEnabled(): boolean {
    return this.state.debugMode === true;
  }

  setDebugMode(value: boolean): boolean {
    this.state.debugMode = Boolean(value);
    return this.state.debugMode;
  }

  setShowZipButton(value: boolean): boolean {
    this.state.showZipButton = Boolean(value);
    return this.state.showZipButton;
  }

  setSingleImageTest(value: boolean): boolean {
    this.state.singleImageTest = Boolean(value);
    return this.state.singleImageTest;
  }

  update(partial: Partial<LegacyCollectorConfig>): void {
    this.state = { ...this.state, ...partial };
  }
}
