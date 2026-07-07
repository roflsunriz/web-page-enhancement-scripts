import React, { useEffect, useMemo, useRef } from "react";

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

type MangaSpreadPage = {
  key: string;
  src: string | null;
  side: "left" | "right";
};

const PAGE_TURN_ANIMATION_MS = 180;

export const PageFlipBook: React.FC<PageFlipBookProps> = ({
  images,
  spreadIndex,
  onSpreadChange,
  onReady,
  onFlipStateChange,
  onLibraryStateChange,
  blankPageContent,
}) => {
  const onSpreadChangeRef = useRef(onSpreadChange);
  const onReadyRef = useRef(onReady);
  const onFlipStateChangeRef = useRef(onFlipStateChange);
  const onLibraryStateChangeRef = useRef(onLibraryStateChange);
  const spreadIndexRef = useRef(spreadIndex);
  const isFlippingRef = useRef(false);
  const animationTimerRef = useRef<number | null>(null);
  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const pages = useMemo(
    () => buildMangaSpreadPages(images, spreadIndex),
    [images, spreadIndex],
  );

  useEffect(() => {
    onSpreadChangeRef.current = onSpreadChange;
    onReadyRef.current = onReady;
    onFlipStateChangeRef.current = onFlipStateChange;
    onLibraryStateChangeRef.current = onLibraryStateChange;
  }, [onFlipStateChange, onLibraryStateChange, onReady, onSpreadChange]);

  useEffect(() => {
    spreadIndexRef.current = Math.min(
      Math.max(spreadIndex, 0),
      spreadCount - 1,
    );
    emitStaticState(onLibraryStateChangeRef.current, spreadIndexRef.current);
  }, [spreadCount, spreadIndex]);

  useEffect(() => {
    const turnToSpread = (nextSpreadIndex: number): boolean => {
      if (isFlippingRef.current) return false;

      const clampedSpreadIndex = Math.min(
        Math.max(nextSpreadIndex, 0),
        spreadCount - 1,
      );
      if (clampedSpreadIndex === spreadIndexRef.current) return false;

      isFlippingRef.current = true;
      onFlipStateChangeRef.current?.(true);
      emitStaticState(
        onLibraryStateChangeRef.current,
        clampedSpreadIndex,
        "flipping",
      );

      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }

      spreadIndexRef.current = clampedSpreadIndex;
      onSpreadChangeRef.current(clampedSpreadIndex);

      animationTimerRef.current = window.setTimeout(() => {
        animationTimerRef.current = null;
        isFlippingRef.current = false;
        onFlipStateChangeRef.current?.(false);
        emitStaticState(
          onLibraryStateChangeRef.current,
          spreadIndexRef.current,
        );
      }, PAGE_TURN_ANIMATION_MS);

      return true;
    };

    onReadyRef.current?.({
      flipNextMangaPage: () => turnToSpread(spreadIndexRef.current + 1),
      flipPreviousMangaPage: () => turnToSpread(spreadIndexRef.current - 1),
    });

    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      isFlippingRef.current = false;
      onFlipStateChangeRef.current?.(false);
      onReadyRef.current?.({
        flipNextMangaPage: () => false,
        flipPreviousMangaPage: () => false,
      });
    };
  }, [spreadCount]);

  return (
    <div className="mv-flip-book mv-static-book">
      {pages.map((page) => (
        <div
          className={`mv-flip-page mv-static-page ${page.src ? "" : "mv-flip-page-blank"}`}
          data-logical-spread-index={String(spreadIndex)}
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

const buildMangaSpreadPages = (
  images: string[],
  spreadIndex: number,
): MangaSpreadPage[] => {
  const rightPageIndex = spreadIndex * 2;
  const leftPageIndex = rightPageIndex + 1;
  const leftSrc = leftPageIndex < images.length ? images[leftPageIndex] : null;
  const rightSrc =
    rightPageIndex < images.length ? images[rightPageIndex] : null;

  return [
    {
      key: `spread-${spreadIndex}-left-${leftSrc ?? "blank"}`,
      src: leftSrc,
      side: "left",
    },
    {
      key: `spread-${spreadIndex}-right-${rightSrc ?? "blank"}`,
      src: rightSrc,
      side: "right",
    },
  ];
};

const emitStaticState = (
  onLibraryStateChange:
    | ((pageIndex: number, spreadIndex: number, state: string) => void)
    | undefined,
  spreadIndex: number,
  state = "read",
) => {
  onLibraryStateChange?.(spreadIndex * 2, spreadIndex, state);
};
