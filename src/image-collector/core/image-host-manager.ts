import type { Logger } from "@/shared/logger";

export class ImageHostManager {
  private readonly hostPatterns: RegExp[] = [
    /(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?500px\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,
    /(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,
    /(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,
    /(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,
    /(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,
    /(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?x\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,
    /(?:https?:\/\/)?(?:www\.)?vk\.com\//i,
  ];

constructor(private readonly logger: Logger) {}

  isSupportedHost(url: string): boolean {
    const supported = this.hostPatterns.some((pattern) => pattern.test(url));
    this.logger.debug("ホストサポート判定", { url, supported });
    return supported;
  }

  addHostPattern(pattern: string | RegExp): void {
    const regex =
      pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    this.hostPatterns.push(regex);
    this.logger.debug("ホストパターンを追加しました", {
      pattern: regex.source,
    });
  }
}
