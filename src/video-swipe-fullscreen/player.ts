export const CONTROL =
  'button, a, input, select, textarea, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="slider"], [role="menu"], [role="dialog"], [draggable="true"]';

// Do not patch attachShadow. Closed roots remain the site's private boundary.
export function videos(
  scope: Document | ShadowRoot | Element,
): HTMLVideoElement[] {
  const result = Array.from(scope.querySelectorAll<HTMLVideoElement>("video"));
  if (scope instanceof Element && scope.shadowRoot)
    result.push(...videos(scope.shadowRoot));
  for (const element of scope.querySelectorAll("*"))
    if (element.shadowRoot) result.push(...videos(element.shadowRoot));
  return result;
}

export function parent(element: Element): Element | null {
  if (element.parentElement) return element.parentElement;
  const tree = element.getRootNode();
  return tree instanceof ShadowRoot ? tree.host : null;
}

export function contains(root: Element, node: Element): boolean {
  for (let current: Element | null = node; current; current = parent(current))
    if (current === root) return true;
  return false;
}

export function fullscreenElement(): Element | null {
  let element = document.fullscreenElement;
  while (element?.shadowRoot?.fullscreenElement)
    element = element.shadowRoot.fullscreenElement;
  return element;
}

// Include sibling overlays/controls only when the enclosing box still matches
// this video. Never fullscreen an ancestor holding another video or page content.
export function playerRoot(video: HTMLVideoElement): HTMLElement {
  const rect = video.getBoundingClientRect();
  let root: HTMLElement = video;
  let node = parent(video);
  for (let depth = 0; node && depth < 8; depth++, node = parent(node)) {
    if (
      !(node instanceof HTMLElement) ||
      node === document.body ||
      node === document.documentElement
    )
      break;
    if (videos(node).length !== 1) break;
    const box = node.getBoundingClientRect();
    if (box.height === 0) continue;
    if (
      Math.abs(box.x - rect.x) > 4 ||
      Math.abs(box.y - rect.y) > 4 ||
      Math.abs(box.width - rect.width) > 4 ||
      Math.abs(box.height - rect.height) > 4
    )
      break;
    root = node;
  }
  return root;
}

export function inCenter(
  video: HTMLVideoElement,
  x: number,
  y: number,
): boolean {
  const rect = video.getBoundingClientRect();
  const insetX = Math.max(24, rect.width * 0.1);
  const insetY = Math.max(32, rect.height * 0.18);
  return (
    rect.width >= 120 &&
    rect.height >= 100 &&
    getComputedStyle(video).visibility === "visible" &&
    x >= rect.left + insetX &&
    x <= rect.right - insetX &&
    y >= rect.top + insetY &&
    y <= rect.bottom - insetY
  );
}
