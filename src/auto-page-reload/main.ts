const messages = {
  ja: {
    menu: "自動リロードの間隔を設定",
    prompt: "リロード間隔を秒で入力してください（1〜86400秒）。",
    invalid: "1〜86400の整数を入力してください。",
    countdown: (seconds: number) => `次のリロードまで ${seconds}秒`,
  },
  en: {
    menu: "Set automatic reload interval",
    prompt: "Enter the reload interval in seconds (1–86400).",
    invalid: "Enter a whole number from 1 to 86400.",
    countdown: (seconds: number) => `Next reload in ${seconds} s`,
  },
};

const text = navigator.language.toLowerCase().startsWith("ja")
  ? messages.ja
  : messages.en;
const key = "intervalSeconds";
const isInterval = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= 86400;

const saved: unknown = GM_getValue(key, 60);
let interval = isInterval(saved) ? saved : 60;
if (!isInterval(saved)) GM_setValue(key, interval);

const target = (): string | null => {
  const { hostname, pathname, protocol } = window.location;
  if (protocol !== "https:") return null;
  if (
    (hostname === "www.amazon.co.jp" &&
      pathname === "/progress-tracker/package") ||
    (hostname === "abliteration.ai" &&
      (pathname === "/console/billing" || pathname === "/console/activity"))
  )
    return `${hostname}${pathname}`;
  return null;
};

let current = target();
let deadline = Date.now() + interval * 1000;
let indicator: HTMLElement | null = null;
let label: HTMLElement | null = null;

const updateIndicator = (): void => {
  if (!current) {
    indicator?.remove();
    return;
  }
  if (!document.documentElement) return;
  if (!indicator || !label) {
    indicator = document.createElement("div");
    indicator.setAttribute("data-auto-page-reload-countdown", "");
    indicator.style.cssText =
      "all:initial;position:fixed;right:12px;bottom:12px;z-index:2147483647;pointer-events:none;max-width:calc(100vw - 24px)";
    const shadow = indicator.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent =
      ":host{direction:ltr} span{display:block;box-sizing:border-box;max-width:100%;padding:6px 10px;border-radius:6px;background:#1f2937;color:#fff;font:13px/1.4 system-ui,sans-serif;overflow-wrap:anywhere;box-shadow:0 1px 5px #0006}";
    label = document.createElement("span");
    label.setAttribute("role", "timer");
    shadow.append(style, label);
  }
  if (!indicator.isConnected) document.documentElement.append(indicator);
  label.textContent = text.countdown(
    Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
  );
};

GM_registerMenuCommand(text.menu, () => {
  const input = window.prompt(text.prompt, String(interval));
  if (input === null) return;
  const value = /^\d+$/.test(input.trim()) ? Number(input.trim()) : NaN;
  if (!isInterval(value)) {
    window.alert(text.invalid);
    return;
  }
  GM_setValue(key, value);
  interval = value;
  deadline = Date.now() + interval * 1000;
  updateIndicator();
});

// Poll the current route so client-side navigation cannot reload another page.
const tick = (): void => {
  const next = target();
  if (next !== current) {
    current = next;
    deadline = Date.now() + interval * 1000;
  }
  updateIndicator();
  if (current && Date.now() >= deadline) window.location.reload();
};
tick();
window.setInterval(tick, 1000);
