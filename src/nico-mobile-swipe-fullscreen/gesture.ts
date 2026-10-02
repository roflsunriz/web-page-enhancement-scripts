export type Point = { x: number; y: number; time: number };
export type Direction = "up" | "down";

// Decide intent early, before the browser starts scrolling. Once horizontal or
// opposite-direction movement wins, the gesture cannot turn into fullscreen.
export function intent(start: Point, point: Point, direction: Direction) {
  const dx = point.x - start.x;
  const dy = point.y - start.y;
  if (point.time - start.time > 1200) return "cancel";
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return "pending";
  if (Math.abs(dy) < Math.abs(dx) * 1.6) return "cancel";
  if ((direction === "up" ? -dy : dy) <= 0) return "cancel";
  return "claim";
}

export function completed(start: Point, point: Point, direction: Direction) {
  const dy = direction === "up" ? start.y - point.y : point.y - start.y;
  return (
    point.time - start.time <= 1200 &&
    dy >= 64 &&
    dy >= Math.abs(point.x - start.x) * 1.6
  );
}
