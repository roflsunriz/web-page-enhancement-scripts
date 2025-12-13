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

/**
 * d-anime専用のRendererSettings
 * comment-overlayのRendererSettingsをベースに、d-anime固有の設定を追加
 */
export interface RendererSettings {
  // comment-overlayから継承するプロパティ
  useContainerResizeObserver: boolean;
  scrollDirection: "rtl" | "ltr";
  renderStyle: "classic" | "outline-only";
  syncMode: "raf" | "video-frame";
  scrollVisibleDurationMs: number | null;
  useFixedLaneCount: boolean;
  fixedLaneCount: number;
  useDprScaling: boolean;
  enableAutoHardReset: boolean;

  // d-anime固有のプロパティ（オーバーライド・追加）
  commentColor: string;
  commentOpacity: number;
  isCommentVisible: boolean;
  autoSearchEnabled: boolean;
  ngWords: string[];
  ngRegexps: string[];
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

/**
 * マニュアル検索設定
 * 手動設定モード時に使用するアニメ情報
 */
export interface ManualSearchSettings {
  /** アニメタイトル（例: "葬送のフリーレン"） */
  animeTitle: string;
  /** エピソード話数（例: "第1話", "＃01"） */
  episodeNumber: string;
  /** エピソードタイトル（例: "冒険の終わり"） */
  episodeTitle: string;
}
