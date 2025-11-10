import type { RendererSettings as OverlayRendererSettings } from "comment-overlay";

export interface NicoCommentPacket {
  chat: NicoComment;
}

export interface NicoComment {
  no: number;
  vpos?: number;
  vposMs?: number;
  mail: string;
  commands?: string[];
  content: string;
  text: string;
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
