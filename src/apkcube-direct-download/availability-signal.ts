import { isValidPackageName } from "./links";

export const BLOCKED_AVAILABILITY_EVENT =
  "apkcube-direct-download:blocked-availability";

export const BLOCKED_AVAILABILITY_CODES = [
  "APP_BLACKLISTED",
  "LOW_RATING_BLOCKED",
] as const;

export type BlockedAvailabilityCode =
  (typeof BLOCKED_AVAILABILITY_CODES)[number];

export type BlockedAvailabilityDetail = {
  packageName: string;
  code: BlockedAvailabilityCode;
};

export function isBlockedAvailabilityCode(
  value: unknown,
): value is BlockedAvailabilityCode {
  return (
    typeof value === "string" &&
    (BLOCKED_AVAILABILITY_CODES as readonly string[]).includes(value)
  );
}

export function getPackageNameFromApksApiUrl(urlText: string): string | null {
  let url: URL;
  try {
    url = new URL(urlText, "https://apkcube.com");
  } catch {
    return null;
  }

  if (url.hostname !== "apkcube.com") {
    return null;
  }

  const match = /^\/api\/apps\/([^/]+)\/apks$/.exec(url.pathname);
  if (!match) {
    return null;
  }

  let packageName: string;
  try {
    packageName = decodeURIComponent(match[1]);
  } catch {
    return null;
  }
  return isValidPackageName(packageName) ? packageName : null;
}

export function parseBlockedAvailabilityDetail(
  urlText: string,
  body: unknown,
): BlockedAvailabilityDetail | null {
  const packageName = getPackageNameFromApksApiUrl(urlText);
  if (!packageName || typeof body !== "object" || body === null) {
    return null;
  }

  const error = (body as Record<string, unknown>)["error"];
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const code = (error as Record<string, unknown>)["code"];
  return isBlockedAvailabilityCode(code) ? { packageName, code } : null;
}
