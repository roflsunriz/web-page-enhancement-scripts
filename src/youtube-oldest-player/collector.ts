import {
  array,
  find,
  oldestToken,
  oldestSelected,
  parsePage,
  record,
  selectedContent,
  type VideoEntry,
} from "./model";

interface PageWindow extends Window {
  ytInitialData?: unknown;
  ytcfg?: { get: (name: string) => unknown };
}
export function pageContent(): unknown {
  const browse = document.querySelector("ytd-browse:not([hidden])") as
    (Element & { data?: unknown }) | null;
  const data = browse?.data ?? (window as PageWindow).ytInitialData;
  const tab = array(find(data, "tabs"))
    .map((value) => record(record(value).tabRenderer))
    .find((value) => value.selected === true);
  const endpoint = record(find(tab?.endpoint, "webCommandMetadata")).url;
  if (
    typeof endpoint !== "string" ||
    new URL(endpoint, location.origin).pathname.toLowerCase() !==
      location.pathname.replace(/\/$/, "").toLowerCase()
  )
    return undefined;
  return selectedContent(data);
}

export async function collect(
  signal: AbortSignal,
  progress: (count: number) => void,
): Promise<VideoEntry[]> {
  const content = pageContent();
  let token: string | undefined = oldestToken(content);
  const context = record(
    (window as PageWindow).ytcfg?.get("INNERTUBE_CONTEXT"),
  );
  if (!record(context.client).clientName) throw new Error("context");
  const videos = new Map<string, VideoEntry>();
  const visited = new Set<string>();
  for (let page = 0; token && page < 1000; page++) {
    signal.throwIfAborted();
    if (visited.has(token)) throw new Error("repeated");
    visited.add(token);
    const timed = new AbortController();
    const cancel = () => timed.abort();
    signal.addEventListener("abort", cancel, { once: true });
    const timer = window.setTimeout(cancel, 20000);
    let response: Response;
    try {
      response = await fetch("/youtubei/v1/browse?prettyPrint=false", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, continuation: token }),
        signal: timed.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result: unknown = await response.json();
      const parsed = parsePage(result);
      // The sort response echoes the filter bar. Confirm the requested third filter is selected.
      if (page === 0) {
        if (!oldestSelected(result)) throw new Error("sort");
      }
      for (const video of parsed.videos) videos.set(video.id, video);
      if (videos.size > 10000) throw new Error("limit");
      token = parsed.next;
      progress(videos.size);
    } finally {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
    }
    if (token)
      await new Promise<void>((resolve) => window.setTimeout(resolve, 200));
  }
  signal.throwIfAborted();
  if (token || !videos.size) throw new Error("limit");
  return [...videos.values()];
}
