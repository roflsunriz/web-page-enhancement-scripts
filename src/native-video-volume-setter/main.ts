import {
  applyVolumeToVideos,
  collectVideosFromMutations,
  findVideoElements,
  isLikelyNativeVideoPage,
} from "./video-controller";
import { loadVolume, saveVolume } from "./volume-settings";
import { showVolumeSettingsPanel } from "./settings-panel";

type VolumeState = {
  value: number;
};

const volumeState: VolumeState = {
  value: loadVolume(),
};

const persistVolume = (nextVolume: number): void => {
  volumeState.value = saveVolume(nextVolume);
  applyVolumeIfNative();
};

const registerMenu = (): void => {
  GM_registerMenuCommand("既定音量の調整ウィンドウを開く", () => {
    showVolumeSettingsPanel({
      initialVolume: volumeState.value,
      applyVolume: persistVolume,
    });
  });
};

const applyVolumeIfNative = (): void => {
  const videos = findVideoElements();

  if (!isLikelyNativeVideoPage(videos)) {
    return;
  }

  applyVolumeToVideos(videos, volumeState.value);
};

const startObserver = (): void => {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    const addedVideos = collectVideosFromMutations(mutations);

    if (addedVideos.length === 0) {
      return;
    }

    const allVideos = findVideoElements();

    if (!isLikelyNativeVideoPage(allVideos)) {
      return;
    }

    applyVolumeToVideos(addedVideos, volumeState.value);
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const init = (): void => {
  applyVolumeIfNative();
  startObserver();
};

registerMenu();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
