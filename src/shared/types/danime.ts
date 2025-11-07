import type { RendererSettings as OverlayRendererSettings } from "comment-overlay";

export interface NicoCommentPacket {
  chat: NicoComment;
}

export interface NicoComment {
  no: number;
  vpos?: number;
  vposMs?: number;
  mail: string;
  content: string;
  user_id: string;
  premium?: number;
  anonymity?: number;
  date: number;
}

export interface RendererSettings extends OverlayRendererSettings {
  /**
   * 動画再生後10秒後に再初期化処理を実行して強制再描画するかどうか
   * @default true
   */
  enableForceRefresh?: boolean;
}

export type DanmakuCommentStyle = Partial<CSSStyleDeclaration> & {
  fillStyle?: string | CanvasPattern | CanvasGradient;
  strokeStyle?: string | CanvasPattern | CanvasGradient;
  lineWidth?: number;
  globalAlpha?: number;
  font?: string;
  textShadow?: string;
  opacity?: string;
  color?: string;
};

export interface DanmakuComment {
  text: string;
  time: number;
  mode?: "ltr" | "rtl" | "top" | "bottom";
  style?: DanmakuCommentStyle;
  commands?: string[];
}

export interface VideoOwnerInfo {
  nickname?: string;
  name?: string;
}

export interface VideoChannelInfo {
  name?: string;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  viewCount?: number;
  commentCount?: number;
  mylistCount?: number;
  postedAt?: string;
  thumbnail?: string;
  owner?: VideoOwnerInfo | null;
  channel?: VideoChannelInfo | null;
  [key: string]: unknown;
}

export interface PlaybackSettings {
  fixedModeEnabled: boolean;
  fixedRate: number;
}
