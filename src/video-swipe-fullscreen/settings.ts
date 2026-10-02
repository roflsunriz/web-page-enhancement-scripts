const messages = {
  ja: {
    enable: "このサイトで動画スワイプ全画面を有効にする（反映には再読み込み）",
    disable: "このサイトで動画スワイプ全画面を無効にする（反映には再読み込み）",
    unsupported:
      "このブラウザ・フレームでは全画面を利用できません。動画の全画面ボタンを使ってください。",
    enter: "全画面にできませんでした。動画の全画面ボタンを試してください。",
    rotate: "横画面ロックを利用できません。端末を横に回転してください。",
    exit: "全画面を解除できませんでした。戻る操作・Esc・全画面ボタンを使ってください。",
    storage:
      "設定を保存できませんでした。userscript managerを確認してください。",
  },
  en: {
    enable: "Enable video swipe fullscreen on this site (reload to apply)",
    disable: "Disable video swipe fullscreen on this site (reload to apply)",
    unsupported:
      "Fullscreen is unavailable in this browser or frame. Use the video fullscreen button.",
    enter: "Could not enter fullscreen. Try the video fullscreen button.",
    rotate: "Landscape lock is unavailable. Rotate your device manually.",
    exit: "Could not exit fullscreen. Use Back, Escape, or the fullscreen button.",
    storage: "Could not save the setting. Check your userscript manager.",
  },
};
export function message(key: keyof typeof messages.en): string {
  return messages[navigator.language.startsWith("ja") ? "ja" : "en"][key];
}

// Key per hostname, including embedded-video hostnames. Never write site storage.
export function siteEnabled(): boolean {
  const key = `video-swipe-fullscreen:enabled:v1:${location.hostname}`;
  const fallback = location.hostname !== "sp.nicovideo.jp";
  let enabled = fallback;
  try {
    if (typeof GM_getValue === "function") {
      const value: unknown = GM_getValue(key, fallback);
      if (typeof value === "boolean") enabled = value;
    }
  } catch (error: unknown) {
    console.warn("[video-swipe-fullscreen] Settings read failed", error);
  }
  if (typeof GM_registerMenuCommand === "function")
    GM_registerMenuCommand(
      `${location.hostname}: ${message(enabled ? "disable" : "enable")}`,
      () => {
        try {
          if (typeof GM_setValue !== "function")
            throw new Error("GM_setValue unavailable");
          GM_setValue(key, !enabled);
        } catch (error: unknown) {
          console.warn("[video-swipe-fullscreen] Settings write failed", error);
          window.alert(message("storage"));
        }
      },
    );
  return enabled;
}
