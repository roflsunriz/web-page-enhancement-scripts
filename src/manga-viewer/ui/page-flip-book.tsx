import React, { useEffect, useMemo, useRef } from "react";
import type { PageFlip } from "page-flip";

type PageFlipBookProps = {
  images: string[];
  spreadIndex: number;
  onSpreadChange: (spreadIndex: number) => void;
  onReady?: (controller: PageFlipBookController) => void;
  onFlipStateChange?: (isFlipping: boolean) => void;
  onLibraryStateChange?: (pageIndex: number, spreadIndex: number, state: string) => void;
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

  useEffect(() => {
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

    const pageElements = Array.from(root.querySelectorAll<HTMLElement>(".mv-flip-page"));
    if (pageElements.length === 0) return;

    let isDisposed = false;

    void import("page-flip")
      .then(({ PageFlip: PageFlipConstructor }) => {
        if (isDisposed || !root.isConnected) return;

        const pageFlip = new PageFlipConstructor(root, {
          width: BASE_PAGE_WIDTH,
          height: BASE_PAGE_HEIGHT,
          size: "stretch",
          minWidth: 240,
          maxWidth: 1400,
          minHeight: 320,
          maxHeight: 2000,
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
          startPage: getLibraryPageIndexForSpread(spreadIndexRef.current, spreadCount),
        });

        pageFlip.on<number>("flip", (event) => {
          const nextSpreadIndex = getLogicalSpreadIndexFromLibraryPage(event.data, spreadCount);
          spreadIndexRef.current = nextSpreadIndex;
          onSpreadChangeRef.current(nextSpreadIndex);
          emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
        });
        pageFlip.on<string>("changeState", (event) => {
          const isFlipping = event.data === "flipping" || event.data === "user_fold";
          isFlippingRef.current = isFlipping;
          onFlipStateChangeRef.current?.(isFlipping);
          emitLibraryState(pageFlip, onLibraryStateChangeRef.current, event.data);
        });
        pageFlip.on("init", () => {
          syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
          emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
          onReadyRef.current?.({
            flipNextMangaPage: () => {
              if (isFlippingRef.current || spreadIndexRef.current >= spreadCount - 1) return false;
              syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
              const nextSpreadIndex = spreadIndexRef.current + 1;
              animateToMangaSpread(pageFlip, nextSpreadIndex, spreadCount, "prev");
              window.setTimeout(() => {
                finishMangaSpreadTurn(pageFlip, nextSpreadIndex, spreadCount);
                spreadIndexRef.current = nextSpreadIndex;
                onSpreadChangeRef.current(nextSpreadIndex);
                onFlipStateChangeRef.current?.(false);
                emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
              }, FLIPPING_TIME_MS + 80);
              return true;
            },
            flipPreviousMangaPage: () => {
              if (isFlippingRef.current || spreadIndexRef.current <= 0) return false;
              syncPageFlipSpread(pageFlip, spreadIndexRef.current, spreadCount);
              const nextSpreadIndex = spreadIndexRef.current - 1;
              animateToMangaSpread(pageFlip, nextSpreadIndex, spreadCount, "next");
              window.setTimeout(() => {
                finishMangaSpreadTurn(pageFlip, nextSpreadIndex, spreadCount);
                spreadIndexRef.current = nextSpreadIndex;
                onSpreadChangeRef.current(nextSpreadIndex);
                onFlipStateChangeRef.current?.(false);
                emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
              }, FLIPPING_TIME_MS + 80);
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
        const removeRoot = root.remove.bind(root);
        try {
          root.remove = () => undefined;
          pageFlip.destroy();
        } finally {
          root.remove = removeRoot;
        }
      } catch {
        root.querySelector(".stf__wrapper")?.remove();
      }
    };
  }, [pages, spreadCount]);

  useEffect(() => {
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
            <img className="mv-flip-image mv-page" src={page.src} draggable={false} />
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

const syncPageFlipSpread = (
  pageFlip: PageFlip,
  spreadIndex: number,
  spreadCount: number,
) => {
  const libraryPageIndex = getLibraryPageIndexForSpread(spreadIndex, spreadCount);
  pageFlip.turnToPage(libraryPageIndex);
  pageFlip.getPageCollection().setCurrentSpreadIndex(Math.floor(libraryPageIndex / 2));
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

const animateToMangaSpread = (
  pageFlip: PageFlip,
  nextSpreadIndex: number,
  spreadCount: number,
  completionDirection: "prev" | "next",
) => {
  const targetPageIndex = getLibraryPageIndexForSpread(nextSpreadIndex, spreadCount);
  const originalTurnToPrevPage = pageFlip.turnToPrevPage.bind(pageFlip);
  const originalTurnToNextPage = pageFlip.turnToNextPage.bind(pageFlip);
  const restoreTurnMethods = () => {
    pageFlip.turnToPrevPage = originalTurnToPrevPage;
    pageFlip.turnToNextPage = originalTurnToNextPage;
  };

  if (completionDirection === "prev") {
    pageFlip.turnToPrevPage = () => {
      pageFlip.turnToPage(targetPageIndex);
      restoreTurnMethods();
    };
  } else {
    pageFlip.turnToNextPage = () => {
      pageFlip.turnToPage(targetPageIndex);
      restoreTurnMethods();
    };
  }

  window.setTimeout(restoreTurnMethods, FLIPPING_TIME_MS + 250);
  if (completionDirection === "prev") {
    pageFlip.flipPrev("top");
  } else {
    pageFlip.flipNext("top");
  }
};

const finishMangaSpreadTurn = (
  pageFlip: PageFlip,
  nextSpreadIndex: number,
  spreadCount: number,
) => {
  pageFlip.turnToPage(getLibraryPageIndexForSpread(nextSpreadIndex, spreadCount));
};

const buildMangaFlipPages = (images: string[]): MangaFlipPage[] => {
  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const pages: MangaFlipPage[] = [];

  for (let spreadIndex = spreadCount - 1; spreadIndex >= 0; spreadIndex -= 1) {
    const rightPageIndex = spreadIndex * 2;
    const leftPageIndex = rightPageIndex + 1;
    const leftSrc = leftPageIndex < images.length ? images[leftPageIndex] : null;
    const rightSrc = rightPageIndex < images.length ? images[rightPageIndex] : null;

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

const getLibraryPageIndexForSpread = (spreadIndex: number, spreadCount: number): number => {
  const clampedSpreadIndex = Math.min(Math.max(spreadIndex, 0), spreadCount - 1);
  return (spreadCount - 1 - clampedSpreadIndex) * 2;
};

const getLogicalSpreadIndexFromLibraryPage = (
  libraryPageIndex: number,
  spreadCount: number,
): number => {
  const librarySpreadIndex = Math.floor(libraryPageIndex / 2);
  return Math.min(Math.max(spreadCount - 1 - librarySpreadIndex, 0), spreadCount - 1);
};
