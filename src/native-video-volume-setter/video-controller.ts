import { clampVolume } from "./volume-settings";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mkv", ".mov", ".avi"];

const hasVideoFileExtension = (pathname: string): boolean => {
  const lower = pathname.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const hasVideoContentType = (): boolean => {
  const contentType = (document.contentType ?? "").toLowerCase();
  return contentType.startsWith("video/");
};

export const findVideoElements = (): HTMLVideoElement[] =>
  Array.from(document.querySelectorAll("video"));

export const isLikelyNativeVideoPage = (
  videos: HTMLVideoElement[],
): boolean => {
  if (videos.length === 0) {
    return false;
  }

  return hasVideoContentType() || hasVideoFileExtension(window.location.pathname);
};

export const applyVolumeToVideos = (
  videos: HTMLVideoElement[],
  volume: number,
): void => {
  const clampedVolume = clampVolume(volume);

  const setVolume = (video: HTMLVideoElement): void => {
    video.volume = clampedVolume;

    if (clampedVolume > 0 && video.muted) {
      video.muted = false;
    }

    if (clampedVolume === 0) {
      video.muted = true;
    }
  };

  videos.forEach((video) => {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setVolume(video);
      return;
    }

    video.addEventListener("loadedmetadata", () => setVolume(video), {
      once: true,
    });
  });
};

export const collectVideosFromMutations = (
  mutations: MutationRecord[],
): HTMLVideoElement[] => {
  const videos: HTMLVideoElement[] = [];

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLVideoElement) {
        videos.push(node);
        return;
      }

      if (node instanceof HTMLElement) {
        videos.push(...Array.from(node.querySelectorAll("video")));
      }
    });
  });

  return videos;
};
