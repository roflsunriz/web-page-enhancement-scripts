import { isValidPackageName } from "./links";

export type AlternativeProviderId = "apkmirror" | "apkpure" | "uptodown";

export type AlternativeSource = {
  id: AlternativeProviderId;
  name: string;
  url: string;
};

export type TextResponse = {
  status: number;
  responseText: string;
  finalUrl: string;
};

export type TextRequester = (url: string) => Promise<TextResponse>;

const MAX_UPTODOWN_CANDIDATES = 4;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&#x2F;", "/")
    .replaceAll("&quot;", '"');
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function extractApkMirrorReleaseUrl(
  html: string,
  packageName: string,
): string | null {
  if (
    !isValidPackageName(packageName) ||
    !html.includes(packageName) ||
    /No results found matching your query/i.test(html)
  ) {
    return null;
  }

  const matches = html.matchAll(
    /href=["']([^"']*\/apk\/[^"'?#]+-release\/)["']/gi,
  );
  for (const match of matches) {
    try {
      const url = new URL(
        decodeHtmlAttribute(match[1]),
        "https://www.apkmirror.com",
      );
      if (
        url.hostname === "www.apkmirror.com" &&
        url.pathname.startsWith("/apk/") &&
        url.pathname.endsWith("-release/")
      ) {
        return url.href;
      }
    } catch {
      // 次の検索結果を検査する。
    }
  }

  return null;
}

export function hasMatchingApkPurePackage(
  response: TextResponse,
  packageName: string,
): boolean {
  if (response.status !== 200 || !isValidPackageName(packageName)) {
    return false;
  }

  try {
    const body: unknown = JSON.parse(response.responseText);
    if (typeof body !== "object" || body === null) {
      return false;
    }
    const versionList = (body as Record<string, unknown>)["version_list"];
    return (
      Array.isArray(versionList) &&
      versionList.some(
        (entry: unknown) =>
          typeof entry === "object" &&
          entry !== null &&
          (entry as Record<string, unknown>)["package_name"] === packageName &&
          (entry as Record<string, unknown>)["asset_usability"] === "USABLE",
      )
    );
  } catch {
    return false;
  }
}

export function extractUptodownCandidateUrls(html: string): string[] {
  const matches = html.matchAll(
    /href=["'](https:\/\/[a-z0-9-]+\.en\.uptodown\.com\/android)["']/gi,
  );
  return unique(Array.from(matches, (match) => decodeHtmlAttribute(match[1])));
}

export function isMatchingUptodownDownload(
  response: TextResponse,
  packageName: string,
): boolean {
  if (response.status !== 200 || !isValidPackageName(packageName)) {
    return false;
  }

  try {
    const finalUrl = new URL(response.finalUrl);
    if (
      !finalUrl.hostname.endsWith(".en.uptodown.com") ||
      finalUrl.pathname !== "/android/download"
    ) {
      return false;
    }
  } catch {
    return false;
  }

  const escaped = escapeRegExp(packageName);
  return (
    new RegExp(
      `play\\.google\\.com/store/apps/details\\?id=${escaped}(?:[&"'])`,
      "i",
    ).test(response.responseText) ||
    new RegExp(`<td>\\s*${escaped}\\s*</td>`, "i").test(response.responseText)
  );
}

async function resolveApkMirror(
  packageName: string,
  request: TextRequester,
): Promise<AlternativeSource | null> {
  const searchUrl = new URL("https://www.apkmirror.com/");
  searchUrl.searchParams.set("post_type", "app_release");
  searchUrl.searchParams.set("searchtype", "apk");
  searchUrl.searchParams.set("s", packageName);
  const response = await request(searchUrl.href);
  if (response.status !== 200) {
    return null;
  }

  const url = extractApkMirrorReleaseUrl(response.responseText, packageName);
  return url ? { id: "apkmirror", name: "APKMirror", url } : null;
}

async function resolveApkPure(
  packageName: string,
  request: TextRequester,
): Promise<AlternativeSource | null> {
  const apiUrl = new URL("https://tapi.pureapk.com/v3/get_app_his_version");
  apiUrl.searchParams.set("package_name", packageName);
  apiUrl.searchParams.set("hl", "en");
  const response = await request(apiUrl.href);
  if (!hasMatchingApkPurePackage(response, packageName)) {
    return null;
  }

  return {
    id: "apkpure",
    name: "APKPure",
    url: `https://apkpure.com/app/${packageName}/download`,
  };
}

async function resolveUptodown(
  packageName: string,
  request: TextRequester,
): Promise<AlternativeSource | null> {
  const searchUrl = new URL("https://en.uptodown.com/android/search");
  searchUrl.searchParams.set("query", packageName);
  const search = await request(searchUrl.href);
  if (search.status !== 200) {
    return null;
  }

  const candidates = extractUptodownCandidateUrls(search.responseText).slice(
    0,
    MAX_UPTODOWN_CANDIDATES,
  );
  for (const candidate of candidates) {
    const response = await request(`${candidate}/download`);
    if (isMatchingUptodownDownload(response, packageName)) {
      return { id: "uptodown", name: "Uptodown", url: response.finalUrl };
    }
  }

  return null;
}

export async function resolveAlternativeSources(
  packageName: string,
  request: TextRequester,
): Promise<AlternativeSource[]> {
  if (!isValidPackageName(packageName)) {
    return [];
  }

  const settled = await Promise.allSettled([
    resolveApkMirror(packageName, request),
    resolveApkPure(packageName, request),
    resolveUptodown(packageName, request),
  ]);

  const sources: AlternativeSource[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      sources.push(result.value);
    } else if (result.status === "rejected") {
      console.warn(
        "[apkcube-direct-download] Alternative lookup failed",
        result.reason,
      );
    }
  }
  return sources;
}
