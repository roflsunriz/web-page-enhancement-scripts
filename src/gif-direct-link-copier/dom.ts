import { extract, identity, type Entry, type Snapshot } from "./extract";

export interface AnchoredEntry extends Entry {
  anchor: HTMLElement;
  mount?: HTMLElement;
  index?: number;
}
function parseJson(text: string | null): unknown {
  try {
    return JSON.parse(text ?? "");
  } catch {
    return null;
  }
}
function mediaUrls(root: Element): string[] {
  return [
    ...root.querySelectorAll<
      HTMLImageElement | HTMLVideoElement | HTMLSourceElement
    >("img,video,source"),
  ]
    .flatMap((node) => [
      node.getAttribute("src"),
      ...(node
        .getAttribute("srcset")
        ?.split(",")
        .map((s) => s.trim().split(/\s+/)[0]) ?? []),
    ])
    .filter((s): s is string => Boolean(s))
    .flatMap((s) => {
      try {
        return [new URL(s, location.href).href];
      } catch {
        return [];
      }
    });
}
// A recycled Imgur media node can retain the previous post's source while OG updates.
const imgurHistory = new WeakMap<
  HTMLElement,
  { page: string; sources: string }
>();
export function readEntries(): AnchoredEntry[] {
  const page = identity(location.href);
  if (!page) return [];
  const groups: {
    key: string;
    urls: string[];
    anchor: HTMLElement;
    mount?: HTMLElement;
    index?: number;
  }[] = [];
  if (page.site === "giphy") {
    document
      .querySelectorAll<HTMLElement>("[data-giphy-id]")
      .forEach((root) => {
        if (root.dataset.giphyId !== page.id) return;
        // The immediate parent contains the site's overlay and has overflow:hidden.
        const anchor = root.parentElement;
        if (anchor)
          groups.push({ key: page.id, urls: mediaUrls(root), anchor });
      });
  } else if (page.site === "tenor") {
    document
      .querySelectorAll<HTMLElement>(".Gif, .Meme")
      .forEach((root) =>
        groups.push({ key: page.id, urls: mediaUrls(root), anchor: root }),
      );
  } else {
    document
      .querySelectorAll<HTMLElement>(
        ".Gallery-Content--mediaContainer, .PostContent-imageWrapper",
      )
      .forEach((root, index) => {
        if (root.closest(".MediaPreview-wrapper")) return;
        groups.push({
          key: `${page.id}:${root.closest<HTMLElement>("[data-index]")?.dataset.index ?? index}`,
          index:
            Number(
              root.closest<HTMLElement>("[data-index]")?.dataset.index ?? index,
            ) + 1,
          mount: root.closest(".VirtualList")?.parentElement ?? undefined,
          urls: mediaUrls(root),
          anchor: root,
        });
      });
  }
  const snapshot: Snapshot = {
    url: location.href,
    pageUrl:
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ??
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
        ?.content ??
      null,
    metaUrls: [
      ...document.querySelectorAll<HTMLMetaElement>(
        'meta[property="og:image"],meta[property="og:video"],meta[property="og:video:secure_url"]',
      ),
    ].map((m) => m.content),
    jsonLd: [
      ...document.querySelectorAll('script[type="application/ld+json"]'),
    ].map((s) => parseJson(s.textContent)),
    tenorCache: parseJson(
      document.querySelector("#store-cache")?.textContent ?? null,
    ),
    groups,
  };
  return extract(snapshot).flatMap((entry) => {
    const group = groups.find((g) => g.key === entry.key);
    if (group && page.site === "imgur") {
      const sources = JSON.stringify(group.urls);
      const previous = imgurHistory.get(group.anchor);
      if (previous && previous.page !== page.id && previous.sources === sources)
        return [];
      imgurHistory.set(group.anchor, { page: page.id, sources });
    }
    return group
      ? [
          {
            ...entry,
            anchor: group.anchor,
            mount: group.mount,
            index: group.index,
          },
        ]
      : [];
  });
}
