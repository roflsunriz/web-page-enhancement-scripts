export interface CommentPrepareOptions {
  text: string;
  vposMs: number;
  commands?: string[];
}

export interface TimeSource {
  getCurrentTime: () => number;
}

export interface CommentDependencies {
  timeSource?: TimeSource;
}

export class Comment {
  readonly text: string;
  readonly vposMs: number;
  readonly commands: string[];

  constructor(options: CommentPrepareOptions) {
    this.text = options.text;
    this.vposMs = options.vposMs;
    this.commands = [...(options.commands ?? [])];
  }
}

export const createDefaultTimeSource = (
  mediaElement?: HTMLMediaElement | null,
): TimeSource => ({
  getCurrentTime: () => {
    if (mediaElement) {
      return mediaElement.currentTime;
    }
    return performance.now() / 1000;
  },
});
