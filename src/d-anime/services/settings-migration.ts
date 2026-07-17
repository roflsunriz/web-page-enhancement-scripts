import type { RendererSettings } from "@/shared/types";

const LEGACY_NICO_COMPAT_SCROLL_DURATION_MS = 6_700;

export const migrateStoredRendererSettings = (
  settings: unknown,
): Partial<RendererSettings> => {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return {};
  }

  const candidate = settings as Partial<RendererSettings>;
  if (
    candidate.scrollVisibleDurationMs !== LEGACY_NICO_COMPAT_SCROLL_DURATION_MS
  ) {
    return candidate;
  }

  return {
    ...candidate,
    scrollVisibleDurationMs: null,
  };
};
