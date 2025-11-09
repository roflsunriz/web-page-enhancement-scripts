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

export type ScrollDirection = "rtl" | "ltr";
export type RenderStyle = "classic" | "outline-only";
export type SyncMode = "raf" | "video-frame";

export interface RendererSettings {
  commentColor: string;
  commentOpacity: number;
  isCommentVisible: boolean;
  useContainerResizeObserver: boolean;
  ngWords: string[];
  ngRegexps: string[];
  scrollDirection: ScrollDirection;
  renderStyle: RenderStyle;
  syncMode: SyncMode;
  scrollVisibleDurationMs: number | null;
  useFixedLaneCount: boolean;
  fixedLaneCount: number;
  useDprScaling: boolean;
  /**
   * ����Đ���10�b��ɍď��������������s���ċ����ĕ`�悷�邩�ǂ���
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
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  textBaseline?: CanvasTextBaseline;
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
