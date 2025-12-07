import { clampVolume } from "./volume-settings";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mkv", ".mov", ".avi"];
const MAX_BODY_CHILDREN_FOR_NATIVE = 6;

const hasVideoLikeExtension = (url: string): boolean => {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => lower.includes(extension));
};

const hasVideoContentType = (): boolean => {
  const contentType = (document.contentType ?? "").toLowerCase();
  return (
    contentType.startsWith("video/") ||
    contentType === "application/octet-stream"
  );
};

const isMinimalLayout = (videos: HTMLVideoElement[]): boolean => {
  const body = document.body;

  if (!body) {
    return false;
  }

  const totalElements = body.querySelectorAll("*").length;
  const totalVideoElements = body.querySelectorAll("video").length;

  return (
    body.childElementCount <= MAX_BODY_CHILDREN_FOR_NATIVE ||
    totalElements - totalVideoElements <= 8 ||
    totalVideoElements === videos.length
  );
};

const hasDominantVideoElement = (videos: HTMLVideoElement[]): boolean => {
  const viewportArea = window.innerWidth * window.innerHeight;

  if (viewportArea === 0) {
    return false;
  }

  return videos.some((video) => {
    const { width, height } = video.getBoundingClientRect();
    return width > 0 && height > 0 && (width * height) / viewportArea > 0.4;
  });
};

export const findVideoElements = (): HTMLVideoElement[] =>
  Array.from(document.querySelectorAll("video"));

export const isLikelyNativeVideoPage = (
  videos: HTMLVideoElement[],
): boolean => {
  if (videos.length === 0) {
    return false;
  }

  const urlHint = `${window.location.pathname}${window.location.search}`;
  const videoLikeUrl = hasVideoLikeExtension(urlHint);

  return (
    hasVideoContentType() ||
    videoLikeUrl ||
    (hasDominantVideoElement(videos) && isMinimalLayout(videos))
  );
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
