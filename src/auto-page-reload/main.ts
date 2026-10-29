const messages = {
  ja: {
    menu: "自動リロードの間隔を設定",
    prompt: "リロード間隔を秒で入力してください（1〜86400秒）。",
    invalid: "1〜86400の整数を入力してください。",
  },
  en: {
    menu: "Set automatic reload interval",
    prompt: "Enter the reload interval in seconds (1–86400).",
    invalid: "Enter a whole number from 1 to 86400.",
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
});

// Poll the current route so client-side navigation cannot reload another page.
window.setInterval(() => {
  const next = target();
  if (next !== current) {
    current = next;
    deadline = Date.now() + interval * 1000;
  }
  if (current && Date.now() >= deadline) window.location.reload();
}, 1000);
