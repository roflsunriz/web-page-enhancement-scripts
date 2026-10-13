export interface VideoEntry {
  id: string;
  title: string;
}
export interface Queue {
  version: 1;
  key: string;
  channel: string;
  currentId: string;
  originalAutoplay: boolean | null;
  videos: VideoEntry[];
  active: boolean;
}
export const STORAGE_KEY = "youtube-oldest-player-v1";
export const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export const array = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];
export const validId = (value: unknown): value is string =>
  typeof value === "string" && /^[\w-]{11}$/.test(value);

// Only walk page-owned JSON, never arbitrary DOM/window objects or getters.
export function find(value: unknown, key: string, depth = 0): unknown {
  if (depth > 25) return undefined;
  const item = record(value);
  if (key in item) return item[key];
  for (const child of Array.isArray(value) ? value : Object.values(item)) {
    const found = find(child, key, depth + 1);
    if (found !== undefined) return found;
  }
  return undefined;
}

export function selectedContent(data: unknown): unknown {
  const tabs = array(find(data, "tabs"));
  const tab = tabs
    .map((value) => record(record(value).tabRenderer))
    .find((value) => value.selected === true);
  return tab?.content;
}

export function oldestToken(content: unknown): string {
  const modern = array(record(find(content, "chipBarViewModel")).chips);
  const legacy = array(
    record(find(content, "feedFilterChipBarRenderer")).contents,
  );
  const chips = modern.length ? modern : legacy;
  // Official Videos filter order measured on 2026-10-13: latest / popular / oldest.
  // Fail closed if the three-filter structure changes; do not infer from translated labels.
  if (chips.length !== 3) throw new Error("filters");
  const token = record(find(chips[2], "continuationCommand")).token;
  if (typeof token !== "string" || !token) throw new Error("filters");
  return token;
}

export function oldestSelected(response: unknown): boolean {
  const modern = array(record(find(response, "chipBarViewModel")).chips);
  const legacy = array(
    record(find(response, "feedFilterChipBarRenderer")).contents,
  );
  if (modern.length)
    return (
      modern.length === 3 &&
      record(record(modern[2]).chipViewModel).selected === true
    );
  const third = record(record(legacy[2]).chipCloudChipRenderer);
  return legacy.length === 3 && (third.isSelected ?? third.selected) === true;
}

export function parsePage(response: unknown): {
  videos: VideoEntry[];
  next?: string;
} {
  const actions = [
    ...array(record(response).onResponseReceivedActions),
    ...array(record(response).onResponseReceivedEndpoints),
  ];
  let recognized = false;
  const batches = actions.flatMap((action) => {
    const item = record(action);
    const command = record(
      item.reloadContinuationItemsCommand ?? item.appendContinuationItemsAction,
    );
    if (Array.isArray(command.continuationItems)) recognized = true;
    return array(command.continuationItems);
  });
  const videos: VideoEntry[] = [];
  let next: string | undefined;
  for (const item of batches) {
    const value = record(item);
    if (value.continuationItemRenderer) {
      const token = record(
        find(value.continuationItemRenderer, "continuationCommand"),
      ).token;
      if (typeof token === "string") next = token;
    }
    const content = record(record(value.richItemRenderer).content);
    const legacy = record(content.videoRenderer);
    const modern = record(content.lockupViewModel);
    const id =
      legacy.videoId ??
      (modern.contentType === "LOCKUP_CONTENT_TYPE_VIDEO"
        ? modern.contentId
        : undefined);
    if (!validId(id)) continue;
    const title = record(legacy.title);
    const modernTitle = record(
      record(record(modern.metadata).lockupMetadataViewModel).title,
    ).content;
    const text =
      typeof modernTitle === "string"
        ? modernTitle
        : typeof title.simpleText === "string"
          ? title.simpleText
          : array(title.runs)
              .map((run) => record(run).text)
              .filter((text) => typeof text === "string")
              .join("");
    videos.push({ id, title: text || id });
  }
  if (!recognized) throw new Error("empty");
  return { videos, next };
}

export function parseQueue(value: unknown): Queue | null {
  const item = record(value);
  if (
    item.version !== 1 ||
    typeof item.key !== "string" ||
    !/^[\w-]{8,80}$/.test(item.key) ||
    typeof item.channel !== "string" ||
    typeof item.active !== "boolean" ||
    !validId(item.currentId) ||
    (item.originalAutoplay !== null &&
      typeof item.originalAutoplay !== "boolean")
  )
    return null;
  const videos = array(item.videos);
  if (
    !videos.length ||
    videos.length > 10000 ||
    !videos.every(
      (video) =>
        validId(record(video).id) && typeof record(video).title === "string",
    )
  )
    return null;
  if (!videos.some((video) => record(video).id === item.currentId)) return null;
  if (new Set(videos.map((video) => record(video).id)).size !== videos.length)
    return null;
  return item as unknown as Queue;
}

export function watchUrl(queue: Queue, index: number): string {
  const url = new URL("/watch", location.origin);
  url.searchParams.set("v", queue.videos[index].id);
  return url.href;
}
