import {
  buildPageTurnLayout,
  formatPageTurnFrameForConsole,
  PAGE_TURN_ANIMATION_DURATION_MS,
  samplePageTurnFrame,
  type PageTurnDirection,
  type PageTurnLayout,
} from "../src/manga-viewer/page-turn-animation";

type SamplePoint = {
  label: "outer-edge" | "page-center" | "spine-edge";
  localX: number;
};

type ProjectedSample = {
  label: SamplePoint["label"];
  spreadX: number;
  depthZ: number;
};

const fixtureImages = Array.from({ length: 8 }, (_, index) => `page-${index + 1}`);
const directions = parseDirections(process.argv.slice(2));
const frameStepMs = 35;
const samplePoints: SamplePoint[] = [
  { label: "outer-edge", localX: -1 },
  { label: "page-center", localX: -0.5 },
  { label: "spine-edge", localX: 0 },
];

for (const direction of directions) {
  const currentSpreadIndex = direction === "next" ? 0 : 1;
  const layout = buildPageTurnLayout(fixtureImages, currentSpreadIndex, direction);
  validateStaticLayout(direction, layout);

  console.log(
    `[manga-viewer:page-turn] direction=${direction} spread=${currentSpreadIndex} duration=${PAGE_TURN_ANIMATION_DURATION_MS}ms step=${frameStepMs}ms`,
  );
  console.log(formatLayout(layout));

  for (
    let elapsedMs = 0;
    elapsedMs <= PAGE_TURN_ANIMATION_DURATION_MS;
    elapsedMs += frameStepMs
  ) {
    printDetailedFrame(direction, layout, elapsedMs);
  }

  if (PAGE_TURN_ANIMATION_DURATION_MS % frameStepMs !== 0) {
    printDetailedFrame(direction, layout, PAGE_TURN_ANIMATION_DURATION_MS);
  }
}

function printDetailedFrame(
  direction: PageTurnDirection,
  layout: PageTurnLayout,
  elapsedMs: number,
): void {
  const frame = samplePageTurnFrame(
    direction,
    elapsedMs / PAGE_TURN_ANIMATION_DURATION_MS,
  );
  const visibleFace = Math.abs(frame.angleDeg) < 90 ? "front" : "back";
  const visiblePage =
    visibleFace === "front" ? layout.turningFrontPage : layout.turningBackPage;
  const projectedSamples = projectTurningPage(direction, frame.angleDeg);
  const centerX =
    projectedSamples.find((sample) => sample.label === "page-center")?.spreadX ??
    0;
  const projectedSide = centerX < 0 ? "left" : "right";
  const expectedSide =
    direction === "next"
      ? frame.progress < 0.5
        ? "left"
        : "right"
      : frame.progress < 0.5
        ? "right"
        : "left";

  validateFrame({
    direction,
    elapsedMs,
    visibleFace,
    visiblePage,
    projectedSide,
    expectedSide,
    layout,
  });

  console.log(formatPageTurnFrameForConsole(direction, elapsedMs));
  console.log(
    [
      "      layer-map",
      `base.left=${layout.displaySpread[0] ?? "blank"}`,
      `base.right=${layout.displaySpread[1] ?? "blank"}`,
      `turn.front=${layout.turningFrontPage ?? "blank"}`,
      `turn.back=${layout.turningBackPage ?? "blank"}`,
      `visible=${visibleFace}:${visiblePage ?? "blank"}`,
      `projected=${projectedSide}`,
      `expected=${expectedSide}`,
    ].join(" | "),
  );
  console.log(
    `      projection ${projectedSamples
      .map(
        (sample) =>
          `${sample.label}(x=${round(sample.spreadX)}, z=${round(sample.depthZ)})`,
      )
      .join(" ")}`,
  );
}

function projectTurningPage(
  direction: PageTurnDirection,
  angleDeg: number,
): ProjectedSample[] {
  const radians = (angleDeg * Math.PI) / 180;
  const hingeX = 0;

  return samplePoints.map((point) => {
    const localX = direction === "next" ? point.localX : -point.localX;
    const spreadX = hingeX + localX * Math.cos(radians);
    const depthZ = Math.abs(localX) * Math.sin(Math.abs(radians));
    return {
      label: point.label,
      spreadX,
      depthZ,
    };
  });
}

function formatLayout(layout: PageTurnLayout): string {
  return [
    "  layout",
    `current=[left:${layout.currentSpread[0] ?? "blank"}, right:${layout.currentSpread[1] ?? "blank"}]`,
    `target=[left:${layout.targetSpread[0] ?? "blank"}, right:${layout.targetSpread[1] ?? "blank"}]`,
    `base=[left:${layout.displaySpread[0] ?? "blank"}, right:${layout.displaySpread[1] ?? "blank"}]`,
    `turning=${layout.turningSide}->${layout.landingSide}`,
    `front=${layout.turningFrontPage ?? "blank"}`,
    `back=${layout.turningBackPage ?? "blank"}`,
    `spine=${layout.spineXPercent}%`,
  ].join(" | ");
}

function validateStaticLayout(
  direction: PageTurnDirection,
  layout: PageTurnLayout,
): void {
  const failures: string[] = [];

  if (direction === "next") {
    if (layout.turningSide !== "left") failures.push("next must turn the left page");
    if (layout.landingSide !== "right") failures.push("next must land on the right page");
    if (layout.displaySpread[0] !== layout.targetSpread[0]) {
      failures.push("next base.left must be the new left page");
    }
    if (layout.displaySpread[1] !== layout.currentSpread[1]) {
      failures.push("next base.right must keep the old right page");
    }
    if (layout.turningFrontPage !== layout.currentSpread[0]) {
      failures.push("next front face must be the old left page");
    }
    if (layout.turningBackPage !== layout.targetSpread[1]) {
      failures.push("next back face must be the new right page");
    }
  } else {
    if (layout.turningSide !== "right") failures.push("prev must turn the right page");
    if (layout.landingSide !== "left") failures.push("prev must land on the left page");
    if (layout.displaySpread[0] !== layout.currentSpread[0]) {
      failures.push("prev base.left must keep the old left page");
    }
    if (layout.displaySpread[1] !== layout.targetSpread[1]) {
      failures.push("prev base.right must be the previous right page");
    }
    if (layout.turningFrontPage !== layout.currentSpread[1]) {
      failures.push("prev front face must be the old right page");
    }
    if (layout.turningBackPage !== layout.targetSpread[0]) {
      failures.push("prev back face must be the previous left page");
    }
  }

  if (failures.length > 0) {
    throw new Error(`${direction} layout mismatch:\n- ${failures.join("\n- ")}`);
  }
}

function validateFrame(input: {
  direction: PageTurnDirection;
  elapsedMs: number;
  visibleFace: "front" | "back";
  visiblePage: string | null;
  projectedSide: string;
  expectedSide: string;
  layout: PageTurnLayout;
}): void {
  const failures: string[] = [];
  const expectedPage =
    input.visibleFace === "front"
      ? input.layout.turningFrontPage
      : input.layout.turningBackPage;

  if (input.visiblePage !== expectedPage) {
    failures.push(
      `visible page mismatch: expected ${expectedPage ?? "blank"}, got ${
        input.visiblePage ?? "blank"
      }`,
    );
  }

  if (input.projectedSide !== input.expectedSide && input.elapsedMs !== PAGE_TURN_ANIMATION_DURATION_MS / 2) {
    failures.push(
      `projected side mismatch: expected ${input.expectedSide}, got ${input.projectedSide}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(
      `${input.direction} frame ${input.elapsedMs}ms mismatch:\n- ${failures.join("\n- ")}`,
    );
  }
}

function parseDirections(args: string[]): PageTurnDirection[] {
  const requestedDirections = args.filter(
    (arg): arg is PageTurnDirection => arg === "prev" || arg === "next",
  );
  return requestedDirections.length > 0
    ? requestedDirections
    : ["next", "prev"];
}

function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}
