interface InvalidImageRule {
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
];

export function isInvalidImage(
  url: string,
  width?: number,
  height?: number,
): boolean {
  if (!url) {
    return false;
  }

  try {
    const urlObj = new URL(url);

    return invalidImageRules.some((rule) => {
      const hostMatch = !rule.host || rule.host.test(urlObj.hostname);
      const pathMatch = !rule.path || rule.path.test(urlObj.pathname);
      const urlMatch = !rule.url || rule.url.test(url);
      const widthMatch = !rule.width || (width !== undefined && width <= rule.width);
      const heightMatch = !rule.height || (height !== undefined && height <= rule.height);

      return hostMatch && pathMatch && urlMatch && widthMatch && heightMatch;
    });
  } catch {
    return false;
  }
}