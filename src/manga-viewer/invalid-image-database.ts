import { isUserExcludedImage } from "@/shared/image-exclusion-settings";

interface InvalidImageRule {
  pageHost?: RegExp;
  host?: RegExp;
  path?: RegExp;
  url?: RegExp;
  width?: number;
  height?: number;
}

const invalidImageRules: InvalidImageRule[] = [
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/avatars\//,
    width: 300,
    height: 300,
  },
  // nicomanga.comのアバター画像で、pagespeedで最適化されたものも除外
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/avatars\//,
    url: /\.pagespeed\./,
  },
  // nicomanga.comのロゴ画像を除外
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/logos\//,
    width: 300,
    height: 300,
  },
  // nicomanga.comのロゴ画像で、pagespeedで最適化されたものも除外
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/logos\//,
    url: /\.pagespeed\./,
  },
  // nicomanga.comのPoweredByロゴ画像を除外
  {
    host: /nicomanga\.com$/,
    path: /^\/uploads\/PoweredBy_200px-Black_HorizLogo\.png$/,
  },
  // nicomanga.com上で表示されるImgur画像を除外
  {
    pageHost: /nicomanga\.com$/,
    host: /^i\.imgur\.com$/,
  },
  {
    host: /^4\.bp\.blogspot\.com$/,
  },
];

export function isInvalidImage(
  url: string,
  width?: number,
  height?: number,
  context: { pageHost?: string } = {},
): boolean {
  if (!url) {
    return false;
  }

  if (isUserExcludedImage("manga-viewer", url, width, height, context)) {
    return true;
  }

  try {
    const urlObj = new URL(url);

    return invalidImageRules.some((rule) => {
      const pageHostMatch =
        !rule.pageHost ||
        (context.pageHost !== undefined &&
          rule.pageHost.test(context.pageHost));
      const hostMatch = !rule.host || rule.host.test(urlObj.hostname);
      const pathMatch = !rule.path || rule.path.test(urlObj.pathname);
      const urlMatch = !rule.url || rule.url.test(url);
      const widthMatch =
        rule.width === undefined || width === undefined || width <= rule.width;
      const heightMatch =
        rule.height === undefined ||
        height === undefined ||
        height <= rule.height;

      return (
        pageHostMatch &&
        hostMatch &&
        pathMatch &&
        urlMatch &&
        widthMatch &&
        heightMatch
      );
    });
  } catch {
    return false;
  }
}
