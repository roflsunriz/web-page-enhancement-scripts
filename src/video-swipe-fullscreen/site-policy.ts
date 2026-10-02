// Observed 2026-10-02 on m.twitch.tv/videos/2882198501. This overlay
// actually seeks even without role=slider/preventDefault. Do not interpret a
// drag from it as fullscreen. Semantic class plus player marker, never hashes.
export function siteControl(path: EventTarget[]): boolean {
  if (!/^(www\.|m\.)?twitch\.tv$/.test(location.hostname)) return false;
  return path.some(
    (node) =>
      node instanceof Element &&
      node.matches(".seekbar-interaction-area") &&
      node.closest('[data-test-selector="video-player__video-container"]'),
  );
}
