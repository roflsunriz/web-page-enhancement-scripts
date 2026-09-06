/**
 * apkcube-direct-download の純粋な判定データと述語。
 * DOM への副作用は持たせない。`selectors.test.mjs` で回帰検証する。
 *
 * 背景（2026-09-06 に実ページと公式バンドルを de-minify して確認）:
 * - ダウンロード実行は `POST /api/downloads/request`
 *   `{packageName, apkId, captchaToken, ...}` → `{url}` →
 *   `window.location.assign(url)`（`1529-564ad2b0508b041d.js` の `V`）。
 * - その前段に広告ブロッカー検出があり、検出時は 30 秒カウントダウンの
 *   モーダル（`downloadFlow.adblock*`）が開く（`6280` の `adblockWaitSeconds:30`）。
 * - 検出は二本立て（`1529` の `l()` と bait 計測）:
 *   1. `fetch("/ads/banner-ad.js")` の応答に `__ad_probe_ok__` が無い→検出。
 *   2. `#ad-banner.adsbox...` の bait 要素が非表示・除去されていたら検出。
 * - ポップアンダーの温床は同梱の `/loader.js`（難読化 635KB）と外部広告ホスト。
 */

export const SCRIPT_ID = "apkcube-direct-download";

export const PROBE_PATH = "/ads/banner-ad.js";

export const PROBE_MARKER = "__ad_probe_ok__";

export const PROBE_TIMEOUT_MS = 3000;

/** ポップアップ・計測由来の外部ホスト（実通信キャプチャで確認したもの）。 */
export const BLOCKED_HOSTS = [
  "adbpage.com",
  "adexchangerapid.com",
  "skecaaztypvqr.space",
  "usrpubtrk.com",
] as const;

/** 同梱の広告エンジン。ダウンロード本体（Next.js チャンク）とは無関係。 */
export const BLOCKED_SCRIPT_SRC_SNIPPETS = ["/loader.js"] as const;

/**
 * 検出用 bait 要素の ID とクラス。公式バンドル（`1529`）が生成する値と一致させる。
 * 広告スロット非表示 CSS はこの bait に絶対に触れてはならない（触れると
 * 検出を自ら引き起こす）。`selectors.test.mjs` で衝突を検査する。
 */
export const BAIT_ID = "ad-banner";

export const BAIT_CLASSES = [
  "adsbox",
  "ad-banner",
  "ads",
  "ad-placement",
  "pub_300x250",
  "sponsored-ad",
] as const;

/**
 * 広告スロット非表示セレクター。bait のクラス・ID を使わず、
 * 広告配信ドメイン由来の要素だけを対象にする。
 */
export const AD_SLOT_SELECTORS = [
  'iframe[src*="adbpage.com"]',
  'iframe[src*="adexchangerapid.com"]',
  'iframe[src*="skecaaztypvqr.space"]',
  'iframe[src*="usrpubtrk.com"]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="googlesyndication.com"]',
  "ins.adsbygoogle",
  'a[href*="adexchangerapid.com"]',
  'a[href*="skecaaztypvqr.space"]',
] as const;

export function isProbeRequest(urlText: string): boolean {
  try {
    const url = new URL(urlText, "https://apkcube.com");
    return url.pathname === PROBE_PATH;
  } catch {
    return false;
  }
}

export function isBlockedHost(urlText: string): boolean {
  let hostname = "";
  try {
    hostname = new URL(urlText, "https://apkcube.com").hostname.toLowerCase();
  } catch {
    return false;
  }

  return (BLOCKED_HOSTS as readonly string[]).some(
    (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`),
  );
}

export function isBlockedScriptSrc(src: string | null): boolean {
  if (!src) {
    return false;
  }

  return (BLOCKED_SCRIPT_SRC_SNIPPETS as readonly string[]).some((snippet) =>
    src.includes(snippet),
  );
}

/** `https://apkcube.com/<slug>/<appId>/download` 形式のとき真。 */
export function isDownloadPage(pathname: string): boolean {
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  return segments.length === 3 && segments[2] === "download";
}

/** `https://apkcube.com/<slug>/<appId>` 形式のとき真。 */
export function isDetailPage(pathname: string): boolean {
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  return segments.length === 2;
}

export function isBaitElement(element: Element): boolean {
  // bun のテスト環境には DOM が無いため `instanceof HTMLElement` を使わず、
  // id と classList.contains の構造で判定する（ブラウザでも同じ結果）。
  if (typeof element !== "object" || element === null) {
    return false;
  }

  const record = element as unknown as Record<string, unknown>;
  if (record["id"] !== BAIT_ID) {
    return false;
  }

  const classList = record["classList"];
  if (typeof classList !== "object" || classList === null) {
    return false;
  }

  const contains = (classList as Record<string, unknown>)["contains"];
  if (typeof contains !== "function") {
    return false;
  }

  const containsToken = contains as (token: string) => unknown;
  return (BAIT_CLASSES as readonly string[]).some(
    (className) => containsToken.call(classList, className) === true,
  );
}
