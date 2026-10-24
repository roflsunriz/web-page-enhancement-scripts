export const APKCUBE_DOWNLOADER_ORIGIN = "https://apkcube.com";

const PACKAGE_NAME_PATTERN =
  /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;

export type DownloadPreset = "recommended" | "universal" | "variants";

export function isValidPackageName(value: string): boolean {
  return value.length <= 255 && PACKAGE_NAME_PATTERN.test(value);
}

export function getPlayPackageName(urlLike: string | URL): string | null {
  let url: URL;
  try {
    url = urlLike instanceof URL ? urlLike : new URL(urlLike);
  } catch {
    return null;
  }

  if (
    url.hostname !== "play.google.com" ||
    url.pathname !== "/store/apps/details"
  ) {
    return null;
  }

  const packageName = url.searchParams.get("id")?.trim() ?? "";
  return isValidPackageName(packageName) ? packageName : null;
}

function getPackageNameFromApkCubeUrl(urlLike: string | URL): string | null {
  let url: URL;
  try {
    url = urlLike instanceof URL ? urlLike : new URL(urlLike);
  } catch {
    return null;
  }

  if (url.hostname !== "apkcube.com") {
    return null;
  }

  const queryValue = url.searchParams.get("url")?.trim() ?? "";
  if (isValidPackageName(queryValue)) {
    return queryValue;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    try {
      const segment = decodeURIComponent(segments[index]);
      if (isValidPackageName(segment)) {
        return segment;
      }
    } catch {
      // 次のpath segmentを検査する。
    }
  }
  return null;
}

export function getApkCubePagePackageName(
  urlLike: string | URL,
  playLinks: readonly string[] = [],
): string | null {
  const fromUrl = getPackageNameFromApkCubeUrl(urlLike);
  if (fromUrl) {
    return fromUrl;
  }

  for (const href of playLinks) {
    try {
      const url = new URL(href);
      if (
        url.hostname === "play.google.com" &&
        url.pathname === "/store/apps/details"
      ) {
        const packageName = url.searchParams.get("id")?.trim() ?? "";
        if (isValidPackageName(packageName)) {
          return packageName;
        }
      }
    } catch {
      // 次のGoogle Playリンクを検査する。
    }
  }

  return null;
}

export function buildApkCubeDownloaderUrl(
  packageName: string,
  preset: DownloadPreset,
): string {
  if (!isValidPackageName(packageName)) {
    throw new Error(`Invalid Android package name: ${packageName}`);
  }

  const url = new URL("/apk-downloader", APKCUBE_DOWNLOADER_ORIGIN);
  url.searchParams.set("url", packageName);

  if (preset === "universal") {
    url.searchParams.set("arch", "universal");
    url.searchParams.set("langs", "all");
  }

  if (preset === "variants") {
    url.hash = "download-options";
  }

  return url.href;
}
