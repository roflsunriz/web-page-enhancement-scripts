import { readEntries } from "./dom";
import { CopyButton } from "./ui";

function start(): void {
  if (
    !document.body ||
    document.documentElement.hasAttribute("data-gif-direct-link-owner")
  )
    return;
  document.documentElement.setAttribute("data-gif-direct-link-owner", "1");
  const buttons = new Map<HTMLElement, CopyButton>();
  let timer = 0;
  let interval = 0;
  const update = (): void => {
    timer = 0;
    const entries = readEntries();
    for (const [anchor, view] of buttons) {
      if (
        !entries.some((e) => e.anchor === anchor) ||
        !anchor.isConnected ||
        !view.host.isConnected
      ) {
        view.host.remove();
        buttons.delete(anchor);
      }
    }
    for (const entry of entries) {
      const view = buttons.get(entry.anchor);
      if (view) view.update(entry);
      else buttons.set(entry.anchor, new CopyButton(entry));
    }
  };
  const schedule = (): void => {
    if (!timer) timer = window.setTimeout(update, 100);
  };
  const observer = new MutationObserver(schedule);
  const resume = (): void => {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "content", "data-giphy-id", "href"],
    });
    window.clearInterval(interval);
    interval = window.setInterval(update, 800); // pushState may change URL without any DOM mutation.
    update();
  };
  window.addEventListener("pagehide", () => {
    observer.disconnect();
    window.clearInterval(interval);
    window.clearTimeout(timer);
    timer = 0;
  });
  window.addEventListener("pageshow", resume);
  resume();
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
