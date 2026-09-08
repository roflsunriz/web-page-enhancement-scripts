type HistoryMethod = History["pushState"];

const INSTALLED_KEY = "__bilibiliJpLocalizeSpaHook";

type WindowWithHookFlag = Window & {
  [INSTALLED_KEY]?: boolean;
};

/**
 * SPA の画面遷移（pushState / replaceState / popstate / hashchange）を検知し、
 * URL が変わったときだけ onNavigate を呼ぶ。二重導入はしない。
 */
export function installSpaNavigationHook(onNavigate: () => void): void {
  const scopedWindow = window as WindowWithHookFlag;
  if (scopedWindow[INSTALLED_KEY]) {
    return;
  }
  scopedWindow[INSTALLED_KEY] = true;

  let lastUrl = window.location.href;
  const notify = (): void => {
    const currentUrl = window.location.href;
    if (currentUrl === lastUrl) {
      return;
    }
    lastUrl = currentUrl;
    onNavigate();
  };

  const wrap = (original: HistoryMethod): HistoryMethod => {
    return function (
      this: History,
      ...args: Parameters<HistoryMethod>
    ): ReturnType<HistoryMethod> {
      const result = original.apply(this, args);
      notify();
      return result;
    };
  };

  window.history.pushState = wrap(window.history.pushState);
  window.history.replaceState = wrap(window.history.replaceState);
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
}
