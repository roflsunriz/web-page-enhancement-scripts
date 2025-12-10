/**
 * X/Twitter Auto Spam Reporter - 型定義
 */

export interface ReporterConfig {
  debug: boolean;
  autoBlock: boolean;
  delays: {
    menuOpen: number;
    menuClick: number;
    dialogLoad: number;
    stepInterval: number;
    animation: number;
  };
}

export interface ReporterStats {
  reported: number;
  blocked: number;
  errors: number;
}

