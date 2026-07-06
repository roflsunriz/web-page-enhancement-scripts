export type PageTurnDirection = "prev" | "next";

export type PageTurnFrame = {
  progress: number;
  easedProgress: number;
  turningSide: "left" | "right";
  landingSide: "left" | "right";
  hinge: "center-spine";
  angleDeg: number;
  translateZPx: number;
  translateXPercent: number;
  skewYDeg: number;
  shadowXpx: number;
  shadowYpx: number;
  shadowBlurPx: number;
  shadowOpacity: number;
  brightness: number;
};

export type PageSpread = [string | null, string | null];

export type PageTurnLayout = {
  currentSpread: PageSpread;
  targetSpread: PageSpread;
  displaySpread: PageSpread;
  turningSide: "left" | "right";
  landingSide: "left" | "right";
  turningFrontPage: string | null;
  turningBackPage: string | null;
  spineXPercent: 50;
};

type PageTurnKeyframe = {
  progress: number;
  angleAbsDeg: number;
  translateZPx: number;
  translateXAbsPercent: number;
  skewYAbsDeg: number;
  shadowXAbsPx: number;
  shadowYpx: number;
  shadowBlurPx: number;
  shadowOpacity: number;
  brightness: number;
};

export const PAGE_TURN_ANIMATION_DURATION_MS = 420;
export const PAGE_TURN_ANIMATION_TIMING = "linear";

const PAGE_TURN_KEYFRAMES: PageTurnKeyframe[] = [
  {
    progress: 0,
    angleAbsDeg: 0,
    translateZPx: 0,
    translateXAbsPercent: 0,
    skewYAbsDeg: 0,
    shadowXAbsPx: 8,
    shadowYpx: 2,
    shadowBlurPx: 14,
    shadowOpacity: 0.18,
    brightness: 1,
  },
  {
    progress: 0.16,
    angleAbsDeg: 28,
    translateZPx: 34,
    translateXAbsPercent: 1.2,
    skewYAbsDeg: 1.8,
    shadowXAbsPx: 20,
    shadowYpx: 8,
    shadowBlurPx: 24,
    shadowOpacity: 0.3,
    brightness: 1.035,
  },
  {
    progress: 0.36,
    angleAbsDeg: 76,
    translateZPx: 78,
    translateXAbsPercent: 3.2,
    skewYAbsDeg: 4.8,
    shadowXAbsPx: 34,
    shadowYpx: 18,
    shadowBlurPx: 36,
    shadowOpacity: 0.48,
    brightness: 1.08,
  },
  {
    progress: 0.52,
    angleAbsDeg: 108,
    translateZPx: 92,
    translateXAbsPercent: 3.8,
    skewYAbsDeg: 5.4,
    shadowXAbsPx: 38,
    shadowYpx: 22,
    shadowBlurPx: 42,
    shadowOpacity: 0.54,
    brightness: 1.065,
  },
  {
    progress: 0.72,
    angleAbsDeg: 146,
    translateZPx: 52,
    translateXAbsPercent: 2.2,
    skewYAbsDeg: 3,
    shadowXAbsPx: 24,
    shadowYpx: 12,
    shadowBlurPx: 30,
    shadowOpacity: 0.34,
    brightness: 0.98,
  },
  {
    progress: 1,
    angleAbsDeg: 180,
    translateZPx: 0,
    translateXAbsPercent: 0,
    skewYAbsDeg: 0,
    shadowXAbsPx: 6,
    shadowYpx: 1,
    shadowBlurPx: 10,
    shadowOpacity: 0.12,
    brightness: 0.94,
  },
];

export const getPageTurnAnimationName = (
  direction: PageTurnDirection,
): string => (direction === "next" ? "turnPageNext" : "turnPagePrev");

export const getPageTurnTransformOrigin = (
  direction: PageTurnDirection,
): string => (direction === "next" ? "right center" : "left center");

export const getPageTurningSide = (
  direction: PageTurnDirection,
): "left" | "right" => (direction === "next" ? "left" : "right");

export const getPageLandingSide = (
  direction: PageTurnDirection,
): "left" | "right" => (direction === "next" ? "right" : "left");

export const getSpreadAtIndex = (
  images: readonly string[],
  spreadIndex: number,
): PageSpread => {
  const startIdx = spreadIndex * 2;
  const leftPageIndex = startIdx + 1;
  const rightPageIndex = startIdx;
  const isLastSpread = Math.ceil(images.length / 2) - 1 === spreadIndex;
  const isOddNumberOfImages = images.length % 2 === 1;

  if (spreadIndex < 0) return [null, null];
  if (isLastSpread && isOddNumberOfImages && leftPageIndex === images.length) {
    return [null, rightPageIndex < images.length ? images[rightPageIndex] : null];
  }
  return [
    leftPageIndex < images.length ? images[leftPageIndex] : null,
    rightPageIndex < images.length ? images[rightPageIndex] : null,
  ];
};

export const buildPageTurnLayout = (
  images: readonly string[],
  currentSpreadIndex: number,
  direction: PageTurnDirection,
): PageTurnLayout => {
  const currentSpread = getSpreadAtIndex(images, currentSpreadIndex);
  const targetSpread = getSpreadAtIndex(
    images,
    direction === "prev" ? currentSpreadIndex - 1 : currentSpreadIndex + 1,
  );

  if (direction === "next") {
    return {
      currentSpread,
      targetSpread,
      displaySpread: [targetSpread[0], currentSpread[1]],
      turningSide: "left",
      landingSide: "right",
      turningFrontPage: currentSpread[0],
      turningBackPage: targetSpread[1],
      spineXPercent: 50,
    };
  }

  return {
    currentSpread,
    targetSpread,
    displaySpread: [currentSpread[0], targetSpread[1]],
    turningSide: "right",
    landingSide: "left",
    turningFrontPage: currentSpread[1],
    turningBackPage: targetSpread[0],
    spineXPercent: 50,
  };
};

export const samplePageTurnFrame = (
  direction: PageTurnDirection,
  progress: number,
): PageTurnFrame => {
  const clampedProgress = clamp(progress, 0, 1);
  const easedProgress = clampedProgress;
  const [from, to] = getSurroundingKeyframes(easedProgress);
  const localProgress =
    from.progress === to.progress
      ? 0
      : (easedProgress - from.progress) / (to.progress - from.progress);
  const angleSign = direction === "next" ? -1 : 1;
  const shadowSign = direction === "next" ? 1 : -1;

  return {
    progress: clampedProgress,
    easedProgress,
    turningSide: getPageTurningSide(direction),
    landingSide: getPageLandingSide(direction),
    hinge: "center-spine",
    angleDeg:
      angleSign * interpolate(from.angleAbsDeg, to.angleAbsDeg, localProgress),
    translateZPx: interpolate(
      from.translateZPx,
      to.translateZPx,
      localProgress,
    ),
    translateXPercent:
      shadowSign *
      interpolate(
        from.translateXAbsPercent,
        to.translateXAbsPercent,
        localProgress,
      ),
    skewYDeg:
      shadowSign * interpolate(from.skewYAbsDeg, to.skewYAbsDeg, localProgress),
    shadowXpx:
      shadowSign *
      interpolate(from.shadowXAbsPx, to.shadowXAbsPx, localProgress),
    shadowYpx: interpolate(from.shadowYpx, to.shadowYpx, localProgress),
    shadowBlurPx: interpolate(
      from.shadowBlurPx,
      to.shadowBlurPx,
      localProgress,
    ),
    shadowOpacity: interpolate(
      from.shadowOpacity,
      to.shadowOpacity,
      localProgress,
    ),
    brightness: interpolate(from.brightness, to.brightness, localProgress),
  };
};

export const formatPageTurnFrameForConsole = (
  direction: PageTurnDirection,
  elapsedMs: number,
): string => {
  const frame = samplePageTurnFrame(
    direction,
    elapsedMs / PAGE_TURN_ANIMATION_DURATION_MS,
  );
  const transform = `rotateY(${round(frame.angleDeg)}deg) translateX(${round(
    frame.translateXPercent,
  )}%) translateZ(${round(frame.translateZPx)}px) skewY(${round(frame.skewYDeg)}deg)`;
  const shadow = `${round(frame.shadowXpx)}px ${round(frame.shadowYpx)}px ${round(
    frame.shadowBlurPx,
  )}px rgba(0, 0, 0, ${round(frame.shadowOpacity, 3)})`;
  const filter = `brightness(${round(frame.brightness, 3)})`;

  return [
    `${String(Math.round(elapsedMs)).padStart(4, " ")}ms`,
    `raw=${round(frame.progress, 3)}`,
    `ease=${round(frame.easedProgress, 3)}`,
    `turn=${frame.turningSide}->${frame.landingSide}`,
    `hinge=${frame.hinge}`,
    `transform=${transform}`,
    `shadow=${shadow}`,
    `filter=${filter}`,
  ].join(" | ");
};

const getSurroundingKeyframes = (
  progress: number,
): [PageTurnKeyframe, PageTurnKeyframe] => {
  for (let index = 1; index < PAGE_TURN_KEYFRAMES.length; index += 1) {
    const current = PAGE_TURN_KEYFRAMES[index];
    if (progress <= current.progress) {
      return [PAGE_TURN_KEYFRAMES[index - 1], current];
    }
  }
  const last = PAGE_TURN_KEYFRAMES[PAGE_TURN_KEYFRAMES.length - 1];
  return [last, last];
};

const interpolate = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, digits = 2): number =>
  Number(value.toFixed(digits));
