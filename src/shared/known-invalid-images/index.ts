export interface KnownInvalidImageRule {
  pageHost?: RegExp;
  host?: RegExp;
  path?: RegExp;
  url?: RegExp;
  width?: number;
  height?: number;
}

const knownInvalidImageRules: KnownInvalidImageRule[] = [
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/avatars\//,
    width: 300,
    height: 300,
  },
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/avatars\//,
    url: /\.pagespeed\./,
  },
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/logos\//,
    width: 300,
    height: 300,
  },
  {
    host: /nicomanga\.com$/,
    path: /\/uploads\/logos\//,
    url: /\.pagespeed\./,
  },
  {
    host: /nicomanga\.com$/,
    path: /^\/uploads\/PoweredBy_200px-Black_HorizLogo\.png$/,
  },
  {
    pageHost: /nicomanga\.com$/,
    host: /^i\.imgur\.com$/,
  },
  {
    host: /^4\.bp\.blogspot\.com$/,
  },
  {
    pageHost: /nicomanga\.com$/,
    host: /^[1-4]\.bp\.blogspot\.com$/,
  },
  {
    pageHost: /nicomanga\.com$/,
    host: /^(?:fonts|www)\.gstatic\.com$/,
    path: /\/(?:s\/i\/productlogos\/translate\/|images\/branding\/product\/)/,
  },
];

export function isKnownInvalidImage(
  url: string,
  width?: number,
  height?: number,
  context: { pageHost?: string } = {},
): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return knownInvalidImageRules.some((rule) =>
      matchesKnownInvalidImageRule(rule, url, urlObj, width, height, context),
    );
  } catch {
    return false;
  }
}

function matchesKnownInvalidImageRule(
  rule: KnownInvalidImageRule,
  url: string,
  urlObj: URL,
  width: number | undefined,
  height: number | undefined,
  context: { pageHost?: string },
): boolean {
  const pageHostMatch =
    !rule.pageHost ||
    (context.pageHost !== undefined && rule.pageHost.test(context.pageHost));
  const hostMatch = !rule.host || rule.host.test(urlObj.hostname);
  const pathMatch = !rule.path || rule.path.test(urlObj.pathname);
  const urlMatch = !rule.url || rule.url.test(url);
  const widthMatch =
    rule.width === undefined || width === undefined || width <= rule.width;
  const heightMatch =
    rule.height === undefined || height === undefined || height <= rule.height;

  return (
    pageHostMatch &&
    hostMatch &&
    pathMatch &&
    urlMatch &&
    widthMatch &&
    heightMatch
  );
}
