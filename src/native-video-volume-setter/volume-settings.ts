const VOLUME_STORAGE_KEY = "nativeVideoVolumeSetter:volume";
const DEFAULT_VOLUME = 0.35;

export const clampVolume = (volume: number): number =>
  Math.min(1, Math.max(0, volume));

export const loadVolume = (): number => {
  const stored = GM_getValue<number | null>(VOLUME_STORAGE_KEY, null);

  if (typeof stored !== "number" || Number.isNaN(stored)) {
    return DEFAULT_VOLUME;
  }

  return clampVolume(stored);
};

export const saveVolume = (volume: number): number => {
  const clampedVolume = clampVolume(volume);
  GM_setValue(VOLUME_STORAGE_KEY, clampedVolume);
  return clampedVolume;
};

export const formatVolumeLabel = (volume: number): string =>
  `${Math.round(clampVolume(volume) * 100)}%`;
