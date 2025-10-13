import { CHATGPT_URLS } from "@/shared/constants/urls";
import { Settings } from "@/shared/types";

/**
 * 生成完了を通知します。
 * @param settings 現在の設定
 */
export function sendNotification(settings: Settings): void {
  // 設定で通知が無効になっている場合は何もしない
  if (!settings.showNotification) return;

  GM_notification({
    text: "生成が完了しました！",
    title: "ChatGPT 完了通知",
    image: CHATGPT_URLS.favicon,
  });

  // 音を鳴らす設定がオンの場合
  if (settings.playSound) {
    playSound(settings);
  }
}

function playSound(settings: Settings): void {
  try {
    const audio = new Audio();
    audio.volume = settings.soundVolume;

    // カスタム音源が設定されていればそれを使用、なければBase64エンコードされた短い音声データを使う
    audio.src =
      settings.customSoundUrl ||
      "data:audio/mp3;base64,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zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQZPYPAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAATMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM";

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.error("音の再生に失敗しました:", e);
        // 代替手段としてコンソールでビープ音
        console.log("\x07");
      });
    }
  } catch (e) {
    console.error("音声の初期化に失敗しました:", e);
  }
}
