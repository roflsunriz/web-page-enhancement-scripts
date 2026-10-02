import { isRecord, type Props } from "./eligibility";

export interface PlayerController extends Props {
  context: Props & { isPremium: boolean };
  watch: { video: { id: string } };
  getVideoElement: () => unknown;
  initializeWatch: (...args: unknown[]) => unknown;
  setPlaybackRate: (...args: unknown[]) => unknown;
  getPlaybackRate: () => unknown;
}

export function isPlayerController(value: unknown): value is PlayerController {
  return (
    isRecord(value) &&
    isRecord(value.context) &&
    typeof value.context.isPremium === "boolean" &&
    isRecord(value.watch) &&
    isRecord(value.watch.video) &&
    typeof value.watch.video.id === "string" &&
    typeof value.getVideoElement === "function" &&
    typeof value.initializeWatch === "function" &&
    typeof value.setPlaybackRate === "function" &&
    typeof value.getPlaybackRate === "function"
  );
}

export function unlockController(controller: PlayerController): () => void {
  const original = controller.context;
  if (original.isPremium) return () => {};
  // Official arrow methods and React memoized facades share this context reference.
  // Replacing a facade's context leaves the actual method receiver unchanged.
  if (!Reflect.set(original, "isPremium", true) || !original.isPremium) {
    throw new Error("The official player context cannot be adapted");
  }
  // Preserve every storage value and the current playback state. No feature setters run here.
  return () => {
    if (original.isPremium === true) Reflect.set(original, "isPremium", false);
  };
}

interface Fiber extends Props {
  return?: unknown;
  child?: unknown;
  sibling?: unknown;
  memoizedProps?: unknown;
  memoizedState?: unknown;
  updateQueue?: unknown;
}

function fiberRoot(video: HTMLVideoElement): Fiber | null {
  for (let node: HTMLElement | null = video; node; node = node.parentElement) {
    const key = Object.keys(node).find((name) =>
      name.startsWith("__reactFiber$"),
    );
    if (!key) continue;
    let fiber: unknown = Reflect.get(node, key);
    let remaining = 100;
    while (isRecord(fiber) && isRecord(fiber.return) && remaining-- > 0)
      fiber = fiber.return;
    if (!isRecord(fiber)) return null;
    const stateNode = fiber.stateNode;
    return isRecord(stateNode) && isRecord(stateNode.current)
      ? stateNode.current
      : fiber;
  }
  return null;
}

export function findControllers(
  video: HTMLVideoElement,
  videoId: string,
): PlayerController[] {
  const root = fiberRoot(video);
  if (!root) return [];
  const found = new Set<PlayerController>();
  const visited = new Set<object>();
  let budget = 12000;
  function inspect(value: unknown, depth: number): void {
    if (
      !value ||
      typeof value !== "object" ||
      visited.has(value) ||
      depth > 6 ||
      budget-- <= 0
    )
      return;
    visited.add(value);
    if (isPlayerController(value)) {
      if (value.watch.video.id === videoId && value.getVideoElement() === video)
        found.add(value);
      return;
    }
    if (!(
      Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype
    ))
      return;
    for (const descriptor of Object.values(
      Object.getOwnPropertyDescriptors(value),
    )) {
      // Do not invoke getters, follow DOM objects or enumerate Maps containing account data.
      if (
        "value" in descriptor &&
        descriptor.value &&
        typeof descriptor.value === "object"
      ) {
        inspect(descriptor.value, depth + 1);
      }
    }
  }
  const fibers: Fiber[] = [root];
  const seenFibers = new Set<Fiber>();
  while (fibers.length && budget > 0) {
    const fiber = fibers.pop()!;
    if (seenFibers.has(fiber)) continue;
    seenFibers.add(fiber);
    budget--;
    inspect(fiber.memoizedProps, 0);
    inspect(fiber.memoizedState, 0);
    if (isRecord(fiber.updateQueue)) inspect(fiber.updateQueue.memoCache, 0);
    if (isRecord(fiber.child)) fibers.push(fiber.child);
    if (isRecord(fiber.sibling)) fibers.push(fiber.sibling);
  }
  return [...found];
}
