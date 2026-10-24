import {
  resolveAlternativeSources,
  selectPreferredAlternativeSource,
  type AlternativeSource,
  type TextRequester,
} from "./alternative-sources";
import { buildApkCubeDownloaderUrl, isValidPackageName } from "./links";

export type PlayPreflightResult =
  | { kind: "blocked"; alternative: AlternativeSource | null }
  | { kind: "passthrough" };

export function isBlockedApkCubeDownloaderHtml(html: string): boolean {
  return (
    /\\?"reason\\?"\s*:\s*\\?"(?:low-rated|blacklisted)\\?"/i.test(html) ||
    /Not available for download on APKCube due to safety or copyright reasons/i.test(
      html,
    ) ||
    /安全上または著作権上の理由により\s*APKCube\s*ではダウンロードできません/.test(
      html,
    )
  );
}

export async function preflightPlayDownload(
  packageName: string,
  request: TextRequester,
): Promise<PlayPreflightResult> {
  if (!isValidPackageName(packageName)) {
    return { kind: "passthrough" };
  }

  const apkCubeUrl = buildApkCubeDownloaderUrl(packageName, "recommended");
  const apkCubeResponse = await request(apkCubeUrl);
  if (
    apkCubeResponse.status !== 200 ||
    !isBlockedApkCubeDownloaderHtml(apkCubeResponse.responseText)
  ) {
    return { kind: "passthrough" };
  }

  const alternatives = await resolveAlternativeSources(packageName, request);
  return {
    kind: "blocked",
    alternative: selectPreferredAlternativeSource(alternatives),
  };
}
