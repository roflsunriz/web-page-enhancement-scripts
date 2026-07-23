import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const MANIFEST_PATH = resolve(
  "test-fixtures",
  "d-anime",
  "official-assets-manifest.json",
);
const ASSET_DIRECTORY = resolve(".d-anime-sandbox", "official-assets");

const extractFunction = (source, marker) => {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`公式バンドルに ${marker} がありません。`);
  }

  const functionStart = source.indexOf("function", markerIndex);
  const bodyStart = source.indexOf("{", functionStart);
  if (functionStart < 0 || bodyStart < 0) {
    throw new Error(`${marker} の関数本体を抽出できませんでした。`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(functionStart, index + 1);
      }
    }
  }

  throw new Error(`${marker} の終端を抽出できませんでした。`);
};

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const playerAsset = manifest.player.assets.find(({ filename }) =>
  filename.startsWith("player.min-"),
);

if (!playerAsset) {
  throw new Error("公式 player.min.js がマニフェストにありません。");
}

const playerPath = resolve(ASSET_DIRECTORY, playerAsset.filename);
const playerSource = await readFile(playerPath, "utf8");
const actualHash = createHash("sha256").update(playerSource).digest("hex");
if (actualHash !== playerAsset.sha256) {
  throw new Error("公式 player.min.js のSHA-256がマニフェストと一致しません。");
}

const classStart = playerSource.indexOf("class SkipUI");
if (classStart < 0) {
  throw new Error("公式バンドルから SkipUI クラスを抽出できませんでした。");
}

const exactSources = {
  destroyPlayer: extractFunction(playerSource, "function destroyPlayer"),
  initializeSub1st: extractFunction(playerSource, "function initializeSub1st"),
  procEndedEvent: extractFunction(playerSource, "this.procEndedEvent=function"),
  skipUi: `${playerSource.slice(classStart)}\nwindow.SkipUI = SkipUI;`,
};

const browser = await chromium.launch({
  args: ["--host-resolver-rules=MAP * ~NOTFOUND"],
  headless: true,
});
const context = await browser.newContext({ serviceWorkers: "block" });
await context.setOffline(true);

const outboundNetworkAttempts = [];
context.on("request", (request) => {
  if (/^https?:/i.test(request.url())) {
    outboundNetworkAttempts.push({ method: request.method() });
  }
});
await context.route(/^https?:/i, (route) => route.abort("blockedbyclient"));

const page = await context.newPage();
await page.setContent(`
  <!doctype html>
  <html lang="ja">
    <body>
      <div id="videoWrapper">
        <video id="video" autoplay></video>
      </div>
      <div id="prevPopupIn"></div>
      <div id="prevPopupInReTop"></div>
      <div id="skip-ui">
        <button class="buttonWrapper"><span class="skipButtonTitle"></span></button>
        <button class="cancelButton"></button>
        <span class="countdown"></span>
        <progress></progress>
      </div>
    </body>
  </html>
`);
await page.addScriptTag({ content: exactSources.skipUi });
await page.addScriptTag({
  content: `
    window.officialDestroyPlayer = ${exactSources.destroyPlayer};
    window.officialInitializeSub1st = ${exactSources.initializeSub1st};
    window.officialProcEndedEvent = ${exactSources.procEndedEvent};
  `,
});

const result = await page.evaluate(async () => {
  const video = document.querySelector("video#video");
  const wrapper = document.querySelector("#skip-ui");
  const videoWrapper = document.querySelector("#videoWrapper");
  if (
    !video ||
    !wrapper ||
    !videoWrapper ||
    typeof window.SkipUI !== "function"
  ) {
    throw new Error("ローカル再生用DOMの初期化に失敗しました。");
  }

  let currentTime = 0;
  let paused = true;
  const mediaCalls = [];
  const controllerCalls = [];
  Object.defineProperty(video, "currentTime", {
    configurable: true,
    get: () => currentTime,
    set: (value) => {
      currentTime = value;
      mediaCalls.push({ method: "setCurrentTime", value });
    },
  });
  Object.defineProperty(video, "paused", {
    configurable: true,
    get: () => paused,
  });
  Object.defineProperty(video, "pause", {
    configurable: true,
    value: () => {
      paused = true;
      mediaCalls.push({ method: "pause" });
    },
  });
  Object.defineProperty(video, "play", {
    configurable: true,
    value: () => {
      paused = false;
      mediaCalls.push({ method: "play" });
      return Promise.resolve();
    },
  });

  const resetCalls = () => {
    mediaCalls.length = 0;
    controllerCalls.length = 0;
  };
  const snapshot = () => ({
    controllerCalls: [...controllerCalls],
    currentTime,
    mediaCalls: [...mediaCalls],
    paused,
  });

  window.util = {
    addClass() {},
    hasClass: () => false,
    removeClass() {},
    replaceClass() {},
    setStyle() {},
  };
  window.initWaitingInfo = () => controllerCalls.push("initWaitingInfo");
  window.reqApiServ = () => controllerCalls.push("reqApiServ");
  window.playStatus = 0;
  window.that = {
    delayPrevPopup: undefined,
    playCheck: { playCount: 0, playEndTime: 0 },
    playerDestroyed: false,
    saveCurrentTime: -1,
    seekThumbTargetEl: document.createElement("div"),
    sentPauseResumeTimerId: null,
    canPlayContinue: () => false,
    showAfterPlayScreen: () => controllerCalls.push("showAfterPlayScreen"),
    stopSendResumePointAlive() {},
    updateResumePoint: (...args) =>
      controllerCalls.push(`updateResumePoint:${args.join(":")}`),
    videoEl: video,
    videoWrapperEl: videoWrapper,
    ws010105Data: {
      appType: "01",
      resumePoint: 0,
      startStatus: "TOP",
    },
  };
  window.createPlayer = () => {
    controllerCalls.push("createPlayer");
    window.player = {
      destroy() {
        controllerCalls.push("player.destroy");
        window.that.playerDestroyed = true;
      },
      play: () => video.play(),
    };
  };

  resetCalls();
  window.createPlayer();
  window.officialInitializeSub1st(0);
  const playbackStart = snapshot();

  const controller = {
    ButtonControl() {},
    canPlayContinue: () => false,
    goNext() {
      controllerCalls.push("goNext");
    },
    goRepeat() {
      controllerCalls.push("goRepeat");
    },
    procEndedEvent(endType) {
      return window.officialProcEndedEvent.call(this, endType);
    },
    seekBarEl: document.createElement("div"),
    sendResumePointStop() {},
    showAfterPlayScreen() {
      controllerCalls.push("showAfterPlayScreen");
    },
    stopSendResumePointAlive() {},
    updateResumePoint: (...args) =>
      controllerCalls.push(`controller.updateResumePoint:${args.join(":")}`),
  };
  const ui = new window.SkipUI(wrapper, controller);
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 5));

  const replaySkip = async (message, jumpTime = null) => {
    resetCalls();
    if (jumpTime !== null) {
      ui.jumptime = jumpTime;
    }
    ui.message = message;
    ui.show(true);
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 5));
    ui.activate(true);
    return snapshot();
  };

  const chapterSwitch = await replaySkip("本編へスキップ", 90_000);

  resetCalls();
  window.that.playerDestroyed = false;
  window.createPlayer();
  window.initialize = () => {
    controllerCalls.push("initialize");
    window.officialInitializeSub1st(0);
  };
  window.officialDestroyPlayer();
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 125));
  const episodeSwitch = snapshot();

  paused = true;
  currentTime = 1_345;
  const terminalChapter = await replaySkip("再生を終了");

  return {
    chapterSwitch,
    episodeSwitch,
    playbackStart,
    terminalChapter,
    videoAutoplay: video.autoplay,
  };
});

await browser.close();

const methods = (phase) => phase.mediaCalls.map(({ method }) => method);
const summary = {
  bundle: {
    filename: playerAsset.filename,
    sha256: actualHash,
  },
  isolation: {
    networkBlocked: true,
    outboundNetworkAttempts,
  },
  invariants: {
    chapterSwitchChangesOnlyCurrentTime:
      result.chapterSwitch.mediaCalls.length === 1 &&
      result.chapterSwitch.mediaCalls[0]?.method === "setCurrentTime",
    episodeSwitchDestroysBeforeReplay:
      result.episodeSwitch.controllerCalls.indexOf("player.destroy") <
        result.episodeSwitch.controllerCalls.lastIndexOf("createPlayer") &&
      methods(result.episodeSwitch).includes("play"),
    playbackStartsOnce:
      methods(result.playbackStart).filter((method) => method === "play")
        .length === 1,
    terminalDoesNotPlay: !methods(result.terminalChapter).includes("play"),
    terminalPauses: methods(result.terminalChapter).includes("pause"),
  },
  phases: result,
};

console.log(JSON.stringify(summary, null, 2));
