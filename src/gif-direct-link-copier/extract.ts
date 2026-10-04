export type Site = "giphy" | "tenor" | "imgur";
export type MediaFormat = "GIF" | "MP4" | "WebM";
export interface PageIdentity {
  site: Site;
  id: string;
}
export interface Media {
  url: string;
  format: MediaFormat;
}
export interface Group {
  key: string;
  urls: string[];
}
export interface Snapshot {
  url: string;
  pageUrl: string | null;
  metaUrls: string[];
  jsonLd: unknown[];
  tenorCache: unknown;
  groups: Group[];
}
export interface Entry extends Media {
  key: string;
}

const record = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

export function identity(value: string): PageIdentity | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, "");
    let match: RegExpMatchArray | null;
    if (
      host === "giphy.com" &&
      (match = url.pathname.match(/^\/gifs\/([^/]+)\/?$/))
    )
      return { site: "giphy", id: match[1].split("-").at(-1)! };
    if (
      host === "tenor.com" &&
      (match = url.pathname.match(
        /^\/(?:[a-z]{2}(?:-[A-Za-z]{2})?\/)?view\/[^/]+-(\d+)\/?$/,
      ))
    )
      return { site: "tenor", id: match[1] };
    if (
      host === "imgur.com" &&
      (match = url.pathname.match(
        /^\/(?:gallery\/|a\/)?(?:[^/]+-)?([A-Za-z0-9]+)\/?$/,
      ))
    )
      return { site: "imgur", id: match[1] };
  } catch {
    /* Untrusted page values are ignored. */
  }
  return null;
}

export function directMedia(value: unknown, site: Site): Media | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.hash
    )
      return null;
    const allowed =
      site === "giphy"
        ? /^media\d*\.giphy\.com$/
        : site === "tenor"
          ? /^media\d*\.tenor\.com$/
          : /^i\.imgur\.com$/;
    if (!allowed.test(url.hostname)) return null;
    if (
      site === "imgur" &&
      !/^\/[A-Za-z0-9]+\.(gif|mp4|webm)$/i.test(url.pathname)
    )
      return null;
    const extension = url.pathname
      .match(/\.(gif|mp4|webm)$/i)?.[1]
      .toLowerCase();
    if (!extension || (site === "giphy" && /_s\.gif$/i.test(url.pathname)))
      return null;
    return {
      url: value,
      format:
        extension === "gif" ? "GIF" : extension === "mp4" ? "MP4" : "WebM",
    };
  } catch {
    return null;
  }
}

const samePage = (value: unknown, current: PageIdentity): boolean => {
  if (typeof value !== "string") return false;
  const other = identity(value);
  return other?.site === current.site && other.id === current.id;
};

function ldUrls(data: unknown, current: PageIdentity): string[] {
  const roots = Array.isArray(data) ? data : [data];
  const urls: string[] = [];
  for (const root of roots) {
    const obj = record(root);
    if (!obj) continue;
    if (Array.isArray(obj["@graph"]))
      urls.push(...ldUrls(obj["@graph"], current));
    const main = record(obj.mainEntityOfPage);
    if (
      ![obj.url, obj.mainEntityOfPage, main?.["@id"]].some((v) =>
        samePage(v, current),
      )
    )
      continue;
    for (const field of [obj, obj.image, obj.video]) {
      const item = record(field);
      if (!item) continue;
      for (const value of [item.contentUrl, item.url])
        if (typeof value === "string") urls.push(value);
    }
  }
  return urls;
}

function tenorUrls(cache: unknown, id: string): string[] {
  const byId = record(record(record(cache)?.gifs)?.byId);
  const results = record(byId?.[id])?.results;
  if (!Array.isArray(results)) return [];
  const item = results
    .map(record)
    .find((o) => o && (o.id === id || record(o.legacy_info)?.post_id === id));
  const formats = record(item?.media_formats);
  if (!formats) return [];
  // Prefer the full GIF within a format. These are URLs published by the page.
  const names = [
    "gif",
    "mediumgif",
    "tinygif",
    "nanogif",
    "mp4",
    "webm",
    ...Object.keys(formats),
  ];
  return [...new Set(names)].flatMap((name) => {
    const value = record(formats[name])?.url;
    return typeof value === "string" ? [value] : [];
  });
}

export function extract(snapshot: Snapshot): Entry[] {
  const page = identity(snapshot.url);
  if (!page) return [];
  const structured = snapshot.jsonLd.flatMap((data) => ldUrls(data, page));
  const pageMatches = samePage(snapshot.pageUrl, page);
  const known =
    page.site === "tenor" ? tenorUrls(snapshot.tenorCache, page.id) : [];
  const candidates = [
    ...known,
    ...structured,
    ...(pageMatches ? snapshot.metaUrls : []),
  ];
  const rank: Record<MediaFormat, number> = { GIF: 0, MP4: 1, WebM: 2 };
  const select = (values: string[]): Media | undefined =>
    values
      .map((v) => directMedia(v, page.site))
      .filter((v): v is Media => v !== null)
      .sort((a, b) => rank[a.format] - rank[b.format])[0];
  if (page.site === "imgur") {
    // The canonical/OG URL must belong to the current post, including after SPA navigation.
    if (!pageMatches) return [];
    return snapshot.groups.flatMap((group) => {
      const media = select([
        ...group.urls,
        ...candidates.filter((v) => {
          const path = directMedia(v, "imgur")?.url;
          return (
            path &&
            group.urls.some(
              (u) =>
                directMedia(u, "imgur") &&
                new URL(u).pathname.split(".")[0] ===
                  new URL(path).pathname.split(".")[0],
            )
          );
        }),
      ]);
      return media ? [{ ...media, key: group.key }] : [];
    });
  }
  const relevant = (value: string): boolean => {
    const media = directMedia(value, page.site);
    return (
      media !== null &&
      (page.site !== "giphy" ||
        new URL(value).pathname.split("/").includes(page.id))
    );
  };
  for (const group of snapshot.groups) {
    const currentGroup =
      page.site === "giphy"
        ? group.key === page.id
        : group.urls.some((url) => [...known, ...structured].includes(url));
    if (!currentGroup) continue;
    const media = select([
      ...candidates.filter(relevant),
      ...group.urls.filter(relevant),
    ]);
    if (media) return [{ ...media, key: group.key }];
  }
  return [];
}
