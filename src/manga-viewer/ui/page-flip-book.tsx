import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { PageFlip } from "page-flip";

type PageFlipBookProps = {
  images: string[];
  spreadIndex: number;
  onSpreadChange: (spreadIndex: number) => void;
  onReady?: (controller: PageFlipBookController) => void;
  onFlipStateChange?: (isFlipping: boolean) => void;
  onLibraryStateChange?: (
    pageIndex: number,
    spreadIndex: number,
    state: string,
  ) => void;
  blankPageContent?: React.ReactNode;
};

export type PageFlipBookController = {
  flipNextMangaPage: () => boolean;
  flipPreviousMangaPage: () => boolean;
};

type MangaFlipPage = {
  key: string;
  src: string | null;
  logicalSpreadIndex: number;
  side: "left" | "right";
};

const BASE_PAGE_WIDTH = 700;
const BASE_PAGE_HEIGHT = 1000;
const FLIPPING_TIME_MS = 520;

export const PageFlipBook: React.FC<PageFlipBookProps> = ({
  images,
  spreadIndex,
  onSpreadChange,
  onReady,
  onFlipStateChange,
  onLibraryStateChange,
  blankPageContent,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const isFlippingRef = useRef(false);
  const spreadIndexRef = useRef(spreadIndex);
  const onSpreadChangeRef = useRef(onSpreadChange);
  const onReadyRef = useRef(onReady);
  const onFlipStateChangeRef = useRef(onFlipStateChange);
  const onLibraryStateChangeRef = useRef(onLibraryStateChange);
  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const pages = useMemo(() => buildMangaFlipPages(images), [images]);

  useLayoutEffect(() => {
    spreadIndexRef.current = spreadIndex;
  }, [spreadIndex]);

  useEffect(() => {
    onSpreadChangeRef.current = onSpreadChange;
    onReadyRef.current = onReady;
    onFlipStateChangeRef.current = onFlipStateChange;
    onLibraryStateChangeRef.current = onLibraryStateChange;
  }, [onFlipStateChange, onLibraryStateChange, onReady, onSpreadChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pageElements = Array.from(
      root.querySelectorAll<HTMLElement>(".mv-flip-page"),
    );
    if (pageElements.length === 0) return;

    let isDisposed = false;

    void waitForStableFlipRoot(root)
      .then(() => import("page-flip"))
      .then(({ PageFlip: PageFlipConstructor }) => {
        if (isDisposed || !root.isConnected) return;

        const pageFlip = new PageFlipConstructor(root, {
          width: BASE_PAGE_WIDTH,
          height: BASE_PAGE_HEIGHT,
          size: "stretch",
          minWidth: 240,
          maxWidth: 4096,
          minHeight: 320,
          maxHeight: 4096,
          drawShadow: true,
          flippingTime: FLIPPING_TIME_MS,
          usePortrait: false,
          autoSize: true,
          maxShadowOpacity: 0.65,
          showCover: false,
          mobileScrollSupport: false,
          swipeDistance: 40,
          clickEventForward: false,
          useMouseEvents: false,
          showPageCorners: false,
          disableFlipByClick: false,
          startPage: getLibraryPageIndexForSpread(
            spreadIndexRef.current,
            spreadCount,
          ),
        });

        pageFlip.on<number>("flip", (event) => {
          const nextSpreadIndex = getLogicalSpreadIndexFromLibraryPage(
            event.data,
            spreadCount,
          );
          spreadIndexRef.current = nextSpreadIndex;
          onSpreadChangeRef.current(nextSpreadIndex);
          emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
        });
        pageFlip.on<string>("changeState", (event) => {
          const isFlipping =
            event.data === "flipping" || event.data === "user_fold";
          isFlippingRef.current = isFlipping;
          onFlipStateChangeRef.current?.(isFlipping);
          emitLibraryState(
            pageFlip,
            onLibraryStateChangeRef.current,
            event.data,
          );
        });
        pageFlip.on("init", () => {
          syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
          emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
          onReadyRef.current?.({
            flipNextMangaPage: () => {
              if (
                isFlippingRef.current ||
                spreadIndexRef.current >= spreadCount - 1
              )
                return false;
              syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
              pageFlip.flipPrev("top");
              return true;
            },
            flipPreviousMangaPage: () => {
              if (isFlippingRef.current || spreadIndexRef.current <= 0)
                return false;
              syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
              pageFlip.flipNext("top");
              return true;
            },
          });
        });
        pageFlip.loadFromHTML(pageElements);
        pageFlipRef.current = pageFlip;
      })
      .catch((error: unknown) => {
        console.error("[MangaViewer] Failed to load page-flip", error);
      });

    return () => {
      isDisposed = true;
      const pageFlip = pageFlipRef.current;
      onReadyRef.current?.({
        flipNextMangaPage: () => false,
        flipPreviousMangaPage: () => false,
      });
      pageFlipRef.current = null;
      if (!pageFlip) return;
      try {
        pageFlip.clear();
        resetPageFlipElementMutations(root);
        const removeRoot = root.remove.bind(root);
        try {
          root.remove = () => undefined;
          pageFlip.destroy();
        } finally {
          root.remove = removeRoot;
        }
      } catch {
        root.querySelector(".stf__wrapper")?.remove();
      } finally {
        resetPageFlipElementMutations(root);
      }
    };
  }, [pages, spreadCount]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver !== "function") return;

    let frameId: number | null = null;
    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        pageFlipRef.current?.update();
      });
    });
    observer.observe(root);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const pageFlip = pageFlipRef.current;
    if (!pageFlip || isFlippingRef.current) return;

    const targetPage = getLibraryPageIndexForSpread(spreadIndex, spreadCount);
    if (pageFlip.getCurrentPageIndex() !== targetPage) {
      pageFlip.turnToPage(targetPage);
    }
  }, [spreadCount, spreadIndex]);

  return (
    <div className="mv-flip-book" ref={rootRef}>
      {pages.map((page) => (
        <div
          className={`mv-flip-page ${page.src ? "" : "mv-flip-page-blank"}`}
          data-logical-spread-index={String(page.logicalSpreadIndex)}
          data-page-side={page.side}
          key={page.key}
        >
          {page.src ? (
            <div className="mv-flip-page-surface">
              <img
                className="mv-flip-image mv-page"
                src={page.src}
                draggable={false}
              />
            </div>
          ) : (
            <div className="mv-flip-blank-page mv-page mv-end-page">
              {blankPageContent}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const waitForStableFlipRoot = async (root: HTMLElement): Promise<void> => {
  let previous: DOMRectReadOnly | null = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await nextAnimationFrame();
    const current = root.getBoundingClientRect();
    if (
      current.width > 0 &&
      current.height > 0 &&
      previous !== null &&
      Math.abs(current.width - previous.width) < 1 &&
      Math.abs(current.height - previous.height) < 1
    ) {
      return;
    }
    previous = current;
  }
};

const nextAnimationFrame = (): Promise<void> =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });

const resetPageFlipElementMutations = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>(".mv-flip-page").forEach((page) => {
    page.style.cssText = "";
    page.classList.remove(
      "stf__item",
      "--soft",
      "--hard",
      "--left",
      "--right",
      "--simple",
    );
  });
  root
    .querySelectorAll<HTMLElement>(
      ".stf__outerShadow, .stf__innerShadow, .stf__hardShadow, .stf__hardInnerShadow",
    )
    .forEach((shadow) => shadow.remove());
};

const syncPageFlipSpread = (
  pageFlip: PageFlip,
  spreadIndex: number,
  spreadCount: number,
) => {
  const libraryPageIndex = getLibraryPageIndexForSpread(
    spreadIndex,
    spreadCount,
  );
  pageFlip.turnToPage(libraryPageIndex);
  pageFlip
    .getPageCollection()
    .setCurrentSpreadIndex(Math.floor(libraryPageIndex / 2));
};

const emitLibraryState = (
  pageFlip: PageFlip,
  onLibraryStateChange:
    | ((pageIndex: number, spreadIndex: number, state: string) => void)
    | undefined,
  stateOverride?: string,
) => {
  onLibraryStateChange?.(
    pageFlip.getCurrentPageIndex(),
    pageFlip.getPageCollection().getCurrentSpreadIndex(),
    stateOverride ?? pageFlip.getState(),
  );
};

const buildMangaFlipPages = (images: string[]): MangaFlipPage[] => {
  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const pages: MangaFlipPage[] = [];

  for (let spreadIndex = spreadCount - 1; spreadIndex >= 0; spreadIndex -= 1) {
    const rightPageIndex = spreadIndex * 2;
    const leftPageIndex = rightPageIndex + 1;
    const leftSrc =
      leftPageIndex < images.length ? images[leftPageIndex] : null;
    const rightSrc =
      rightPageIndex < images.length ? images[rightPageIndex] : null;

    pages.push({
      key: `spread-${spreadIndex}-left`,
      src: leftSrc,
      logicalSpreadIndex: spreadIndex,
      side: "left",
    });
    pages.push({
      key: `spread-${spreadIndex}-right`,
      src: rightSrc,
      logicalSpreadIndex: spreadIndex,
      side: "right",
    });
  }

  return pages;
};

const getLibraryPageIndexForSpread = (
  spreadIndex: number,
  spreadCount: number,
): number => {
  const clampedSpreadIndex = Math.min(
    Math.max(spreadIndex, 0),
    spreadCount - 1,
  );
  return (spreadCount - 1 - clampedSpreadIndex) * 2;
};

const getLogicalSpreadIndexFromLibraryPage = (
  libraryPageIndex: number,
  spreadCount: number,
): number => {
  const librarySpreadIndex = Math.floor(libraryPageIndex / 2);
  return Math.min(
    Math.max(spreadCount - 1 - librarySpreadIndex, 0),
    spreadCount - 1,
  );
};
