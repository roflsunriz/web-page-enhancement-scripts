import {
  DisplayMode,
  FlipCorner,
  FlippingState,
  PageFlip,
  ReadingDirection,
  SizeType,
} from "page-flip-2";
import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ImageFitMode } from "../image-fit-settings";

type PageFlipBookProps = {
  images: string[];
  imageFitMode: ImageFitMode;
  spreadIndex: number;
  onSpreadChange: (spreadIndex: number) => void;
  onReady?: (controller: PageFlipBookController | null) => void;
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
  imageFitMode,
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
  const isProgrammaticSyncRef = useRef(false);
  const spreadIndexRef = useRef(spreadIndex);
  const onSpreadChangeRef = useRef(onSpreadChange);
  const onReadyRef = useRef(onReady);
  const onFlipStateChangeRef = useRef(onFlipStateChange);
  const onLibraryStateChangeRef = useRef(onLibraryStateChange);
  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const pages = useMemo(() => buildMangaFlipPages(images), [images]);

  useLayoutEffect(() => {
    spreadIndexRef.current = clampSpreadIndex(spreadIndex, spreadCount);
  }, [spreadCount, spreadIndex]);

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

    let pageFlip: PageFlip | null = null;

    try {
      const instance = new PageFlip(root, {
        width: BASE_PAGE_WIDTH,
        height: BASE_PAGE_HEIGHT,
        size: SizeType.STRETCH,
        minWidth: 240,
        maxWidth: 4096,
        minHeight: 320,
        maxHeight: 4096,
        drawShadow: true,
        flippingTime: FLIPPING_TIME_MS,
        displayMode: DisplayMode.LANDSCAPE,
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
        readingDirection: ReadingDirection.RTL,
        startPage: getLibraryPageIndexForSpread(
          spreadIndexRef.current,
          spreadCount,
        ),
      });
      pageFlip = instance;

      instance.on<number>("flip", (event) => {
        if (isProgrammaticSyncRef.current) {
          emitLibraryState(instance, onLibraryStateChangeRef.current);
          return;
        }

        const nextSpreadIndex = getLogicalSpreadIndexFromLibraryPage(
          event.data,
          spreadCount,
        );
        spreadIndexRef.current = nextSpreadIndex;
        onSpreadChangeRef.current(nextSpreadIndex);
        emitLibraryState(instance, onLibraryStateChangeRef.current);
      });
      instance.on<FlippingState>("changeState", (event) => {
        const isFlipping =
          event.data === FlippingState.FLIPPING ||
          event.data === FlippingState.USER_FOLD;
        isFlippingRef.current = isFlipping;
        onFlipStateChangeRef.current?.(isFlipping);
        emitLibraryState(instance, onLibraryStateChangeRef.current, event.data);
      });
      instance.on("init", () => {
        emitLibraryState(instance, onLibraryStateChangeRef.current);
      });
      instance.loadFromHTML(pageElements);
      pageFlipRef.current = instance;

      onReadyRef.current?.({
        flipNextMangaPage: () => {
          if (
            isFlippingRef.current ||
            spreadIndexRef.current >= spreadCount - 1
          ) {
            return false;
          }

          instance.flipNext(FlipCorner.TOP);
          return true;
        },
        flipPreviousMangaPage: () => {
          if (isFlippingRef.current || spreadIndexRef.current <= 0) {
            return false;
          }

          instance.flipPrev(FlipCorner.TOP);
          return true;
        },
      });
    } catch (error: unknown) {
      console.error("[MangaViewer] Failed to initialize page-flip-2", error);
    }

    return () => {
      onReadyRef.current?.(null);
      isFlippingRef.current = false;
      onFlipStateChangeRef.current?.(false);

      if (pageFlipRef.current === pageFlip) {
        pageFlipRef.current = null;
      }
      pageFlip?.destroy();
    };
  }, [pages, spreadCount]);

  useLayoutEffect(() => {
    const pageFlip = pageFlipRef.current;
    if (!pageFlip || isFlippingRef.current) return;

    const targetPage = getLibraryPageIndexForSpread(spreadIndex, spreadCount);
    if (pageFlip.getCurrentPageIndex() === targetPage) return;

    isProgrammaticSyncRef.current = true;
    try {
      pageFlip.turnToPage(targetPage);
    } finally {
      isProgrammaticSyncRef.current = false;
    }
    emitLibraryState(pageFlip, onLibraryStateChangeRef.current);
  }, [spreadCount, spreadIndex]);

  return (
    <div
      className="mv-flip-book"
      data-image-fit-mode={imageFitMode}
      ref={rootRef}
    >
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

const buildMangaFlipPages = (images: string[]): MangaFlipPage[] => {
  const pageCount = Math.max(2, Math.ceil(images.length / 2) * 2);

  return Array.from({ length: pageCount }, (_, pageIndex) => ({
    key: `page-${pageIndex}-${images[pageIndex] ?? "blank"}`,
    src: images[pageIndex] ?? null,
    logicalSpreadIndex: Math.floor(pageIndex / 2),
    side: pageIndex % 2 === 0 ? "right" : "left",
  }));
};

const getLibraryPageIndexForSpread = (
  spreadIndex: number,
  spreadCount: number,
): number => clampSpreadIndex(spreadIndex, spreadCount) * 2;

const clampSpreadIndex = (spreadIndex: number, spreadCount: number): number =>
  Math.min(Math.max(spreadIndex, 0), spreadCount - 1);

const getLogicalSpreadIndexFromLibraryPage = (
  libraryPageIndex: number,
  spreadCount: number,
): number =>
  Math.min(Math.max(Math.floor(libraryPageIndex / 2), 0), spreadCount - 1);

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
