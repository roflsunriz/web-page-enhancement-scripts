export interface NicoCommentPacket {
    chat: NicoComment;
  }
  
  export interface NicoComment {
    no: number;
    vpos: number;
    mail: string;
    content: string;
    user_id: string;
    premium?: number;
    anonymity?: number;
    date: number;
  }
  
  export interface RendererSettings {
    commentColor: string;
    commentOpacity: number;
    isCommentVisible: boolean;
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
  