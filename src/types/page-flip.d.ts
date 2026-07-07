declare module "page-flip" {
  export type FlipCorner = "top" | "bottom";
  export type FlipState = "user_fold" | "fold_corner" | "flipping" | "read";
  export type FlipOrientation = "portrait" | "landscape";

  export type PageFlipEvent<TData> = {
    data: TData;
    object: PageFlip;
  };

  export type PageFlipSettings = {
    startPage?: number;
    size?: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  };

  export type PageCollection = {
    getCurrentSpreadIndex(): number;
    setCurrentSpreadIndex(spreadIndex: number): void;
  };

  export class PageFlip {
    constructor(inBlock: HTMLElement, settings: PageFlipSettings);
    destroy(): void;
    update(): void;
    loadFromImages(imagesHref: string[]): void;
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    updateFromImages(imagesHref: string[]): void;
    updateFromHtml(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    clear(): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(page: number): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    flip(page: number, corner?: FlipCorner): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getPageCollection(): PageCollection;
    getOrientation(): FlipOrientation;
    getState(): FlipState;
    on<TData = unknown>(
      eventName: string,
      callback: (event: PageFlipEvent<TData>) => void,
    ): PageFlip;
    off(eventName: string): void;
  }
}
