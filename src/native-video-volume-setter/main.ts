import {
  applyVolumeToVideos,
  collectVideosFromMutations,
  findVideoElements,
  isLikelyNativeVideoPage,
} from "./video-controller";
import {
  clampVolume,
  formatVolumeLabel,
  loadVolume,
  saveVolume,
} from "./volume-settings";

type VolumeState = {
  value: number;
};

const volumeState: VolumeState = {
  value: loadVolume(),
};

const promptForVolume = (): number | null => {
  const input = window.prompt(
    `既定の音量を 0〜100 で入力してください。\n現在値: ${formatVolumeLabel(volumeState.value)}`,
    Math.round(clampVolume(volumeState.value) * 100).toString(),
  );

  if (input === null) {
    return null;
  }

  const parsed = Number(input.trim());

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    window.alert("0〜100 の数値で入力してください。");
    return null;
  }

  return clampVolume(parsed / 100);
};

const registerMenu = (): void => {
  GM_registerMenuCommand(
    `デフォルト音量を設定（現在: ${formatVolumeLabel(volumeState.value)}）`,
    () => {
      const nextVolume = promptForVolume();

      if (nextVolume === null) {
        return;
      }

      volumeState.value = saveVolume(nextVolume);
      applyVolumeIfNative();
      window.alert(`既定音量を ${formatVolumeLabel(volumeState.value)} に設定しました。`);
    },
  );
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
