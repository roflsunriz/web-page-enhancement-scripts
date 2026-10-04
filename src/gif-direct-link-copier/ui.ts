import { copyUrl } from "./clipboard";
import { readEntries, type AnchoredEntry } from "./dom";
import { t, format, getDirection } from "./i18n";

export class CopyButton {
  readonly host = document.createElement("div");
  private readonly button = document.createElement("button");
  private readonly status = document.createElement("span");
  private readonly manual = document.createElement("textarea");
  private entry: AnchoredEntry;
  constructor(entry: AnchoredEntry) {
    this.entry = entry;
    this.host.dataset.gifDirectLinkButton = "";
    const shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `:host{display:block;position:static;flex:0 0 auto;max-width:min(100%,calc(100vw - 24px));margin:8px 0;box-sizing:border-box;color-scheme:light dark}*{box-sizing:border-box}.row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:100%;font:14px/1.5 system-ui,sans-serif;color:CanvasText}button{font:inherit;min-height:44px;max-width:100%;padding:8px 12px;border:1px solid #888;border-radius:8px;background:Canvas;color:CanvasText;cursor:pointer;overflow-wrap:anywhere}button:focus-visible,textarea:focus-visible{outline:3px solid #4599ff;outline-offset:2px}button:disabled{cursor:wait;opacity:.65}span{overflow-wrap:anywhere;max-width:100%;background:Canvas;color:CanvasText;padding:4px 8px;border-radius:4px}span:empty{display:none}textarea{display:block;width:100%;min-height:76px;margin-top:8px;font:13px/1.5 monospace;resize:vertical;direction:ltr}textarea[hidden]{display:none}`;
    const row = document.createElement("div");
    row.className = "row";
    row.dir = getDirection();
    this.button.type = "button";
    this.status.setAttribute("role", "status");
    this.status.setAttribute("aria-live", "polite");
    this.manual.readOnly = true;
    this.manual.hidden = true;
    this.manual.setAttribute("aria-label", t("manual"));
    this.manual.addEventListener("focus", () => this.manual.select());
    row.append(this.button, this.status);
    shadow.append(style, row, this.manual);
    this.update(entry);
    this.button.addEventListener("click", () => void this.copy());
    if (entry.mount) entry.mount.before(this.host);
    else entry.anchor.after(this.host);
  }
  update(entry: AnchoredEntry): void {
    if (this.entry.url !== entry.url) {
      this.status.textContent = "";
      this.manual.hidden = true;
    }
    if (this.entry.mount !== entry.mount && entry.mount)
      entry.mount.before(this.host);
    this.entry = entry;
    this.button.textContent = `${entry.index ? format("media", { index: entry.index }) + ": " : ""}${format("copy", { format: entry.format })}`;
    this.button.title = entry.url;
  }
  private async copy(): Promise<void> {
    // Re-read synchronously: a click can precede the SPA/mutation observer tick.
    const current = readEntries().find(
      (e) => e.anchor === this.entry.anchor && e.key === this.entry.key,
    );
    if (!current) {
      this.host.remove();
      return;
    }
    this.update(current);
    const pageUrl = location.href;
    this.button.disabled = true;
    this.status.textContent = "";
    this.manual.hidden = true;
    try {
      await copyUrl(current.url);
      if (location.href === pageUrl && this.entry.url === current.url)
        this.status.textContent = t("copied");
    } catch {
      if (location.href === pageUrl && this.entry.url === current.url) {
        this.status.textContent = t("failed");
        this.manual.value = current.url;
        this.manual.hidden = false;
      }
    } finally {
      this.button.disabled = false;
    }
  }
}
