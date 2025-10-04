export type CopyMode = "all" | "first" | "shitaraba" | "5ch";

export interface ScriptState {
  collectedThreadData: {
    formattedText: string;
    summary: string;
  } | null;
  isCollecting: boolean;
  isSecondStage: boolean;
  translateEnabled: boolean;
  translationInProgress: boolean;
  copyMode: CopyMode;
  startFromTweetId: string | null;
  startFromTweetAuthor: string;
  startFromTweetText: string;
}

export function createInitialState(): ScriptState {
  return {
    collectedThreadData: null,
    isCollecting: false,
    isSecondStage: false,
    translateEnabled: false,
    translationInProgress: false,
    copyMode: "all",
    startFromTweetId: null,
    startFromTweetAuthor: "",
    startFromTweetText: "",
  };
}

// グローバルなステートインスタンス
export const state: ScriptState = createInitialState();

// ControlPanelで利用するためのStateクラスを定義
export class State {
  private _copyMode: CopyMode;
  private _translateEnabled: boolean;
  private _startFromTweetId: string | null;

  constructor(initial: ScriptState) {
    this._copyMode = initial.copyMode;
    this._translateEnabled = initial.translateEnabled;
    this._startFromTweetId = initial.startFromTweetId;
  }

  get copyMode(): CopyMode {
    return this._copyMode;
  }

  setCopyMode(mode: CopyMode): void {
    this._copyMode = mode;
  }

  get translateEnabled(): boolean {
    return this._translateEnabled;
  }

  enableTranslation(enabled: boolean): void {
    this._translateEnabled = enabled;
  }

  get startFromTweetId(): string | null {
    return this._startFromTweetId;
  }

  setStartFromTweetId(id: string | null): void {
    this._startFromTweetId = id;
  }
}
