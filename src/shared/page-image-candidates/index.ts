export type PageImageCandidateKind =
  "image" | "source" | "anchor" | "background";

export type PageImageCandidate = {
  url: string;
  element: Element | null;
  kind: PageImageCandidateKind;
  width?: number;
  height?: number;
};

type CollectPageImageCandidatesOptions = {
  include?: PageImageCandidateKind[];
  maxCandidates?: number;
};

type PageImageCandidateScanOptions = CollectPageImageCandidatesOptions & {
  dynamicWaitMs?: number;
  scroll?: {
    enabled: boolean;
    maxScrolls?: number;
    stepRatio?: number;
    delayMs?: number;
    stopAfterNoNewScans?: number;
  };
  onProgress?: (progress: {
    phase: "initial" | "dynamic" | "scroll" | "complete";
    count: number;
    currentScroll?: number;
    totalScrolls?: number;
  }) => void;
};

export type PageImageCollectionItem = PageImageCandidate & {
  needsValidation: boolean;
};

export type PageImageCollectionResult = {
  items: PageImageCollectionItem[];
  urls: string[];
};

export type CollectPageImagesOptions = PageImageCandidateScanOptions & {
  exclude?: (candidate: PageImageCandidate) => boolean;
  needsValidation?: (candidate: PageImageCandidate) => boolean;
};

const DEFAULT_KINDS: PageImageCandidateKind[] = [
  "image",
  "source",
  "anchor",
  "background",
];

const LAZY_IMAGE_ATTRIBUTES = [
  "data-src",
  "data-original",
  "data-original-src",
  "data-lazy-src",
  "data-actualsrc",
  "data-url",
  "data-image",
  "data-full",
  "data-full-url",
  "data-srcset",
  "data-lazy-srcset",
];

const IMAGE_EXTENSION_PATTERN =
  /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i;

export function collectPageImageCandidates(
  options: CollectPageImageCandidatesOptions = {},
): PageImageCandidate[] {
  const include = new Set(options.include ?? DEFAULT_KINDS);
  const candidates: PageImageCandidate[] = [];
  const seen = new Set<string>();

  const addCandidate = (
    rawUrl: string | null | undefined,
    element: Element | null,
    kind: PageImageCandidateKind,
    dimensions: { width?: number; height?: number } = {},
  ) => {
    const url = normalizePageImageUrl(rawUrl);
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({ url, element, kind, ...dimensions });
  };

  if (include.has("image")) {
    document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      const dimensions = getImageElementDimensions(image);
      getImageElementCandidateUrls(image).forEach((url) => {
        addCandidate(url, image, "image", dimensions);
      });
    });
  }

  if (include.has("source")) {
    document
      .querySelectorAll<HTMLSourceElement>("picture source, source[srcset]")
      .forEach((source) => {
        parseSrcset(source.srcset).forEach((url) => {
          addCandidate(url, source, "source");
        });
      });
  }

  if (include.has("anchor")) {
    document
      .querySelectorAll<HTMLAnchorElement>("a[href]")
      .forEach((anchor) => {
        if (isLikelyImageUrl(anchor.href)) {
          addCandidate(anchor.href, anchor, "anchor");
        }
      });
  }

  if (include.has("background")) {
    document.querySelectorAll<HTMLElement>("*").forEach((element) => {
      extractCssImageUrls(
        window.getComputedStyle(element).backgroundImage,
      ).forEach((url) => {
        addCandidate(url, element, "background");
      });
    });
  }

  return options.maxCandidates === undefined
    ? candidates
    : candidates.slice(0, options.maxCandidates);
}

export async function scanPageImageCandidates(
  options: PageImageCandidateScanOptions = {},
): Promise<PageImageCandidate[]> {
  const candidates = new Map<string, PageImageCandidate>();
  const scanOptions: CollectPageImageCandidatesOptions = {
    include: options.include,
  };
  const mergeCurrentCandidates = () => {
    collectPageImageCandidates(scanOptions).forEach((candidate) => {
      if (!candidates.has(candidate.url)) {
        candidates.set(candidate.url, candidate);
      }
    });
  };

  mergeCurrentCandidates();
  options.onProgress?.({ phase: "initial", count: candidates.size });

  if ((options.dynamicWaitMs ?? 0) > 0) {
    await waitForDynamicImages(
      options.dynamicWaitMs ?? 0,
      mergeCurrentCandidates,
    );
    options.onProgress?.({ phase: "dynamic", count: candidates.size });
  }

  const scroll = options.scroll;
  if (scroll?.enabled) {
    const originalScrollY = window.scrollY;
    const maxScrolls = scroll.maxScrolls ?? 20;
    const step = window.innerHeight * (scroll.stepRatio ?? 0.8);
    const delayMs = scroll.delayMs ?? 400;
    const stopAfterNoNewScans = scroll.stopAfterNoNewScans ?? 3;
    let noNewScans = 0;

    for (let index = 0; index < maxScrolls; index += 1) {
      const previousSize = candidates.size;
      window.scrollBy(0, step);
      await delay(delayMs);
      mergeCurrentCandidates();
      options.onProgress?.({
        phase: "scroll",
        count: candidates.size,
        currentScroll: index + 1,
        totalScrolls: maxScrolls,
      });

      noNewScans = candidates.size === previousSize ? noNewScans + 1 : 0;
      if (
        noNewScans >= stopAfterNoNewScans ||
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        break;
      }
    }

    mergeCurrentCandidates();
    window.scrollTo(0, originalScrollY);
  }

  options.onProgress?.({ phase: "complete", count: candidates.size });
  const values = Array.from(candidates.values());
  return options.maxCandidates === undefined
    ? values
    : values.slice(0, options.maxCandidates);
}

export async function collectPageImages(
  options: CollectPageImagesOptions = {},
): Promise<PageImageCollectionResult> {
  const shouldScan =
    (options.dynamicWaitMs ?? 0) > 0 || options.scroll?.enabled === true;
  const candidates = shouldScan
    ? await scanPageImageCandidates(options)
    : collectPageImageCandidates(options);
  const items = candidates
    .filter((candidate) => options.exclude?.(candidate) !== true)
    .map((candidate) => ({
      ...candidate,
      needsValidation: options.needsValidation?.(candidate) ?? false,
    }));

  return {
    items,
    urls: items.map((item) => item.url),
  };
}

export function getImageElementCandidateUrls(
  image: HTMLImageElement,
): string[] {
  const urls = [
    image.currentSrc,
    image.src,
    image.getAttribute("src"),
    ...parseSrcset(image.srcset),
  ];

  LAZY_IMAGE_ATTRIBUTES.forEach((attributeName) => {
    const value = image.getAttribute(attributeName);
    if (!value) return;
    if (attributeName.endsWith("srcset")) {
      urls.push(...parseSrcset(value));
    } else {
      urls.push(value);
    }
  });

  Array.from(image.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    if (!name.startsWith("data-") || !name.includes("src")) return;
    if (LAZY_IMAGE_ATTRIBUTES.includes(name)) return;
    if (name.includes("srcset")) {
      urls.push(...parseSrcset(attribute.value));
    } else {
      urls.push(attribute.value);
    }
  });

  return uniqueNormalizedUrls(urls);
}

export function normalizePageImageUrl(
  rawUrl: string | null | undefined,
): string | null {
  if (!rawUrl) return null;
  const trimmedUrl = rawUrl.trim();
  if (
    !trimmedUrl ||
    trimmedUrl.startsWith("data:") ||
    trimmedUrl.startsWith("blob:")
  ) {
    return null;
  }

  try {
    const url = new URL(trimmedUrl, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    if (isLikelyDocumentUrl(url)) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function parseSrcset(srcset: string | null | undefined): string[] {
  if (!srcset) return [];
  return srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter((url): url is string => Boolean(url));
}

function getImageElementDimensions(image: HTMLImageElement): {
  width?: number;
  height?: number;
} {
  return {
    width: image.naturalWidth || image.width || undefined,
    height: image.naturalHeight || image.height || undefined,
  };
}

function extractCssImageUrls(value: string): string[] {
  if (!value || value === "none") return [];
  const urls: string[] = [];
  const urlPattern = /url\((["']?)(.*?)\1\)/g;
  let match = urlPattern.exec(value);
  while (match) {
    if (match[2]) {
      urls.push(match[2]);
    }
    match = urlPattern.exec(value);
  }
  return urls;
}

function isLikelyImageUrl(url: string): boolean {
  return IMAGE_EXTENSION_PATTERN.test(url);
}

function isLikelyDocumentUrl(url: URL): boolean {
  const currentUrl = new URL(window.location.href);
  currentUrl.hash = "";

  const candidateUrl = new URL(url.href);
  candidateUrl.hash = "";
  if (candidateUrl.href === currentUrl.href) {
    return true;
  }

  return /\.(?:html?|php|aspx?|jsp)$/i.test(candidateUrl.pathname);
}

function uniqueNormalizedUrls(
  urls: Array<string | null | undefined>,
): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();
  urls.forEach((url) => {
    const value = normalizePageImageUrl(url);
    if (!value || seen.has(value)) return;
    seen.add(value);
    normalized.push(value);
  });
  return normalized;
}

function waitForDynamicImages(
  timeoutMs: number,
  onMutation: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver(onMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "style", ...LAZY_IMAGE_ATTRIBUTES],
    });

    window.setTimeout(() => {
      observer.disconnect();
      onMutation();
      resolve();
    }, timeoutMs);
  });
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}
