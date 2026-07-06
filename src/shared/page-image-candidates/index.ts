export type PageImageCandidateKind =
  "image" | "source" | "anchor" | "background" | "observed";

export type PageImageCandidate = {
  url: string;
  element: Element | null;
  kind: PageImageCandidateKind;
  width?: number;
  height?: number;
  documentOrder?: number;
  observedAt?: number;
};

export type CollectPageImageCandidatesOptions = {
  include?: PageImageCandidateKind[];
  includeObserved?: boolean;
  maxCandidates?: number;
};

export type PageImageCandidateScanOptions =
  CollectPageImageCandidatesOptions & {
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

export type LoadedPageImagesOptions = CollectPageImageCandidatesOptions & {
  minWidth?: number;
  minHeight?: number;
  exclude?: (candidate: PageImageCandidate) => boolean;
  needsValidation?: (candidate: PageImageCandidate) => boolean;
};

export type CollectPageImagesWithScrollFallbackOptions =
  CollectPageImagesOptions & {
    minCandidatesBeforeScroll: number;
    fallbackDynamicWaitMs?: number;
    scrollFallback?: NonNullable<PageImageCandidateScanOptions["scroll"]>;
  };

const DEFAULT_KINDS: PageImageCandidateKind[] = [
  "image",
  "source",
  "anchor",
  "background",
  "observed",
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

type PageImageRequestSource =
  | "performance"
  | "img-src"
  | "source-srcset"
  | "set-attribute"
  | "fetch"
  | "xhr";

type ObservedPageImageRequest = {
  url: string;
  element: Element | null;
  source: PageImageRequestSource;
  observedAt: number;
};

type PageImageRequestCacheState = {
  installed: boolean;
  sequence: number;
  records: Map<string, ObservedPageImageRequest>;
  observer?: PerformanceObserver;
};

type PageImageRequestCacheWindow = Window &
  typeof globalThis & {
    __pageImageRequestCache?: PageImageRequestCacheState;
  };

export function installPageImageRequestCache(): void {
  const cacheWindow = window as PageImageRequestCacheWindow;
  const state =
    cacheWindow.__pageImageRequestCache ??
    createPageImageRequestCacheState(cacheWindow);

  if (state.installed) {
    return;
  }
  state.installed = true;

  collectExistingPerformanceImageEntries(state);
  installPerformanceImageObserver(state);
  installElementAttributeObserver(state);
  installImageSrcObserver(state);
  installSourceSrcsetObserver(state);
  installFetchObserver(state);
  installXhrObserver(state);
}

export function collectObservedPageImageCandidates(): PageImageCandidate[] {
  const cacheWindow = window as PageImageRequestCacheWindow;
  const state = cacheWindow.__pageImageRequestCache;
  if (!state) return [];

  const elementOrder = createElementOrderIndex();
  return Array.from(state.records.values()).map((record) => {
    const element = record.element;
    const dimensions =
      element instanceof HTMLImageElement
        ? getImageElementDimensions(element)
        : {};
    return {
      url: record.url,
      element,
      kind: getObservedCandidateKind(element),
      ...dimensions,
      documentOrder: getElementDocumentOrder(element, elementOrder),
      observedAt: record.observedAt,
    };
  });
}

export function collectPageImageCandidates(
  options: CollectPageImageCandidatesOptions = {},
): PageImageCandidate[] {
  installPageImageRequestCache();
  const include = new Set(options.include ?? DEFAULT_KINDS);
  const candidates: PageImageCandidate[] = [];
  const seen = new Set<string>();

  const elementOrder = createElementOrderIndex();
  const addCandidate = (
    rawUrl: string | null | undefined,
    element: Element | null,
    kind: PageImageCandidateKind,
    dimensions: { width?: number; height?: number } = {},
  ) => {
    const url = normalizePageImageUrl(rawUrl);
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({
      url,
      element,
      kind,
      ...dimensions,
      documentOrder: getElementDocumentOrder(element, elementOrder),
    });
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

  if (options.includeObserved !== false) {
    collectObservedPageImageCandidates().forEach((candidate) => {
      if (seen.has(candidate.url)) return;
      seen.add(candidate.url);
      candidates.push(candidate);
    });
  }

  const sortedCandidates = sortPageImageCandidates(candidates);
  return options.maxCandidates === undefined
    ? sortedCandidates
    : sortedCandidates.slice(0, options.maxCandidates);
}

export async function scanPageImageCandidates(
  options: PageImageCandidateScanOptions = {},
): Promise<PageImageCandidate[]> {
  const candidates = new Map<string, PageImageCandidate>();
  const scanOptions: CollectPageImageCandidatesOptions = {
    include: options.include,
    includeObserved: options.includeObserved,
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
  const sortedValues = sortPageImageCandidates(values);
  return options.maxCandidates === undefined
    ? sortedValues
    : sortedValues.slice(0, options.maxCandidates);
}

export async function collectPageImages(
  options: CollectPageImagesOptions = {},
): Promise<PageImageCollectionResult> {
  const shouldScan =
    (options.dynamicWaitMs ?? 0) > 0 || options.scroll?.enabled === true;
  const candidates = shouldScan
    ? await scanPageImageCandidates(options)
    : collectPageImageCandidates(options);
  return toPageImageCollectionResult(
    sortPageImageCandidates(candidates),
    options,
  );
}

export function collectLoadedPageImages(
  options: LoadedPageImagesOptions = {},
): PageImageCollectionResult {
  if (options.include !== undefined && !options.include.includes("image")) {
    return { items: [], urls: [] };
  }

  const candidates: PageImageCandidate[] = [];
  const seen = new Set<string>();
  const elementOrder = createElementOrderIndex();
  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    const url = normalizePageImageUrl(getImageElementCandidateUrls(image)[0]);
    if (!url || seen.has(url)) return;
    const dimensions = getImageElementDimensions(image);
    const candidate: PageImageCandidate = {
      url,
      element: image,
      kind: "image",
      ...dimensions,
      documentOrder: getElementDocumentOrder(image, elementOrder),
    };
    if (!isLoadedPageImageCandidate(candidate, options)) return;
    seen.add(url);
    candidates.push(candidate);
  });

  return toPageImageCollectionResult(candidates, options);
}

export async function collectPageImagesWithScrollFallback(
  options: CollectPageImagesWithScrollFallbackOptions,
): Promise<PageImageCollectionResult> {
  const initial = await collectPageImages({
    ...options,
    scroll: undefined,
  });
  if (initial.urls.length >= options.minCandidatesBeforeScroll) {
    return initial;
  }

  return collectPageImages({
    ...options,
    dynamicWaitMs: options.fallbackDynamicWaitMs ?? options.dynamicWaitMs,
    scroll: options.scrollFallback ?? options.scroll,
  });
}

export function mergePageImageCollectionItems(
  ...itemGroups: PageImageCollectionItem[][]
): PageImageCollectionItem[] {
  const merged = new Map<string, PageImageCollectionItem>();
  itemGroups.forEach((items) => {
    items.forEach((item) => {
      const existing = merged.get(item.url);
      if (existing && !existing.needsValidation) return;
      merged.set(item.url, item);
    });
  });
  return sortPageImageCollectionItems(Array.from(merged.values()));
}

export function sortPageImageCollectionItems(
  items: PageImageCollectionItem[],
): PageImageCollectionItem[] {
  return [...items].sort(comparePageImageCandidates);
}

export function isLoadedPageImageCandidate(
  candidate: PageImageCandidate,
  options: {
    minWidth?: number;
    minHeight?: number;
    exclude?: (candidate: PageImageCandidate) => boolean;
  } = {},
): boolean {
  const element = candidate.element;
  if (!(element instanceof HTMLImageElement)) {
    return false;
  }
  if (!element.complete) {
    return false;
  }

  const width = element.naturalWidth || candidate.width || 0;
  const height = element.naturalHeight || candidate.height || 0;
  if (width < (options.minWidth ?? 1) || height < (options.minHeight ?? 1)) {
    return false;
  }
  return options.exclude?.({ ...candidate, width, height }) !== true;
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

function toPageImageCollectionResult(
  candidates: PageImageCandidate[],
  options: Pick<CollectPageImagesOptions, "exclude" | "needsValidation">,
): PageImageCollectionResult {
  const items = sortPageImageCandidates(candidates)
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

function createElementOrderIndex(): Map<Element, number> {
  const order = new Map<Element, number>();
  document.querySelectorAll<Element>("*").forEach((element, index) => {
    order.set(element, index);
  });
  return order;
}

function getElementDocumentOrder(
  element: Element | null,
  elementOrder: Map<Element, number>,
): number | undefined {
  return element === null ? undefined : elementOrder.get(element);
}

function comparePageImageCandidates(
  left: PageImageCandidate,
  right: PageImageCandidate,
): number {
  const leftOrder = left.documentOrder;
  const rightOrder = right.documentOrder;
  if (leftOrder !== undefined && rightOrder !== undefined) {
    return leftOrder - rightOrder;
  }
  if (leftOrder !== undefined) return -1;
  if (rightOrder !== undefined) return 1;
  const leftObservedAt = left.observedAt;
  const rightObservedAt = right.observedAt;
  if (leftObservedAt !== undefined && rightObservedAt !== undefined) {
    return leftObservedAt - rightObservedAt;
  }
  if (leftObservedAt !== undefined) return -1;
  if (rightObservedAt !== undefined) return 1;
  return 0;
}

function sortPageImageCandidates<T extends PageImageCandidate>(
  items: T[],
): T[] {
  return [...items].sort(comparePageImageCandidates);
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

function createPageImageRequestCacheState(
  cacheWindow: PageImageRequestCacheWindow,
): PageImageRequestCacheState {
  const state: PageImageRequestCacheState = {
    installed: false,
    sequence: 0,
    records: new Map(),
  };
  cacheWindow.__pageImageRequestCache = state;
  return state;
}

function recordObservedPageImageUrl(
  state: PageImageRequestCacheState,
  rawUrl: string | URL | null | undefined,
  source: PageImageRequestSource,
  element: Element | null = null,
): void {
  const url = normalizePageImageUrl(String(rawUrl ?? ""));
  if (!url) return;
  if (!element && !isLikelyImageUrl(url)) return;

  const existing = state.records.get(url);
  if (existing) {
    if (!existing.element && element) {
      existing.element = element;
      existing.source = source;
    }
    return;
  }

  state.sequence += 1;
  state.records.set(url, {
    url,
    element,
    source,
    observedAt: state.sequence,
  });
}

function recordObservedSrcset(
  state: PageImageRequestCacheState,
  srcset: string | null | undefined,
  source: PageImageRequestSource,
  element: Element | null,
): void {
  parseSrcset(srcset).forEach((url) => {
    recordObservedPageImageUrl(state, url, source, element);
  });
}

function collectExistingPerformanceImageEntries(
  state: PageImageRequestCacheState,
): void {
  if (typeof performance.getEntriesByType !== "function") return;
  performance
    .getEntriesByType("resource")
    .forEach((entry) => recordPerformanceImageEntry(state, entry));
}

function installPerformanceImageObserver(
  state: PageImageRequestCacheState,
): void {
  if (typeof PerformanceObserver !== "function") return;
  try {
    const observer = new PerformanceObserver((list) => {
      list
        .getEntries()
        .forEach((entry) => recordPerformanceImageEntry(state, entry));
    });
    observer.observe({ entryTypes: ["resource"] });
    state.observer = observer;
  } catch {
    // PerformanceObserver is optional; DOM scanning remains the fallback.
  }
}

function recordPerformanceImageEntry(
  state: PageImageRequestCacheState,
  entry: PerformanceEntry,
): void {
  if (entry.entryType !== "resource") return;
  const resource = entry as PerformanceResourceTiming;
  if (!isImageResourceInitiator(resource.initiatorType)) return;
  recordObservedPageImageUrl(state, resource.name, "performance");
}

function installElementAttributeObserver(
  state: PageImageRequestCacheState,
): void {
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function patchedSetAttribute(
    this: Element,
    qualifiedName: string,
    value: string,
  ): void {
    recordElementAttributeImageUrl(state, this, qualifiedName, value);
    originalSetAttribute.call(this, qualifiedName, value);
  };
}

function installImageSrcObserver(state: PageImageRequestCacheState): void {
  const descriptor = getPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (
    !descriptor?.set ||
    !descriptor.get ||
    descriptor.configurable === false
  ) {
    return;
  }

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    configurable: true,
    enumerable: descriptor.enumerable,
    get(this: HTMLImageElement): string {
      return descriptor.get?.call(this) ?? "";
    },
    set(this: HTMLImageElement, value: string): void {
      recordObservedPageImageUrl(state, value, "img-src", this);
      descriptor.set?.call(this, value);
    },
  });
}

function installSourceSrcsetObserver(state: PageImageRequestCacheState): void {
  const descriptor = getPropertyDescriptor(
    HTMLSourceElement.prototype,
    "srcset",
  );
  if (
    !descriptor?.set ||
    !descriptor.get ||
    descriptor.configurable === false
  ) {
    return;
  }

  Object.defineProperty(HTMLSourceElement.prototype, "srcset", {
    configurable: true,
    enumerable: descriptor.enumerable,
    get(this: HTMLSourceElement): string {
      return descriptor.get?.call(this) ?? "";
    },
    set(this: HTMLSourceElement, value: string): void {
      recordObservedSrcset(state, value, "source-srcset", this);
      descriptor.set?.call(this, value);
    },
  });
}

function installFetchObserver(state: PageImageRequestCacheState): void {
  const originalFetch = window.fetch;
  if (typeof originalFetch !== "function") return;

  window.fetch = function patchedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    recordObservedPageImageUrl(state, getFetchInputUrl(input), "fetch");
    return originalFetch.call(this, input, init);
  };
}

function installXhrObserver(state: PageImageRequestCacheState): void {
  const originalOpen = XMLHttpRequest.prototype.open;
  const patchedOpen = function patchedOpen(
    this: XMLHttpRequest,
    ...args: Parameters<XMLHttpRequest["open"]>
  ): ReturnType<XMLHttpRequest["open"]> {
    recordObservedPageImageUrl(state, args[1], "xhr");
    return originalOpen.apply(this, args);
  } as XMLHttpRequest["open"];
  XMLHttpRequest.prototype.open = patchedOpen;
}

function recordElementAttributeImageUrl(
  state: PageImageRequestCacheState,
  element: Element,
  attributeName: string,
  value: string,
): void {
  const normalizedName = attributeName.toLowerCase();
  if (element instanceof HTMLImageElement) {
    if (normalizedName === "src") {
      recordObservedPageImageUrl(state, value, "set-attribute", element);
      return;
    }
    if (normalizedName === "srcset" || normalizedName.includes("srcset")) {
      recordObservedSrcset(state, value, "set-attribute", element);
      return;
    }
    if (
      LAZY_IMAGE_ATTRIBUTES.includes(normalizedName) ||
      (normalizedName.startsWith("data-") && normalizedName.includes("src"))
    ) {
      recordObservedPageImageUrl(state, value, "set-attribute", element);
    }
    return;
  }

  if (
    element instanceof HTMLSourceElement &&
    (normalizedName === "srcset" || normalizedName.includes("srcset"))
  ) {
    recordObservedSrcset(state, value, "set-attribute", element);
  }
}

function getFetchInputUrl(input: RequestInfo | URL): string | URL | null {
  if (typeof input === "string" || input instanceof URL) return input;
  if (input instanceof Request) return input.url;
  return null;
}

function getPropertyDescriptor<T extends object>(
  prototype: T,
  propertyName: string,
): PropertyDescriptor | undefined {
  let current: object | null = prototype;
  while (current) {
    const descriptor = Object.getOwnPropertyDescriptor(current, propertyName);
    if (descriptor) return descriptor;
    current = Object.getPrototypeOf(current);
  }
  return undefined;
}

function getObservedCandidateKind(
  element: Element | null,
): PageImageCandidateKind {
  if (element instanceof HTMLImageElement) return "image";
  if (element instanceof HTMLSourceElement) return "source";
  return "observed";
}

function isImageResourceInitiator(initiatorType: string): boolean {
  return [
    "img",
    "image",
    "css",
    "link",
    "fetch",
    "xmlhttprequest",
    "other",
  ].includes(initiatorType);
}
