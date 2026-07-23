import assert from "node:assert/strict";

Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { language: "ja-JP", languages: ["ja-JP", "ja"] },
});
globalThis.window = globalThis;
const outboundNetworkAttempts = [];
globalThis.fetch = async (input, init = {}) => {
  outboundNetworkAttempts.push({
    method: init.method ?? "GET",
    targetType: typeof input,
  });
  throw new Error("オフライン研究サンドボックスが外部通信を遮断しました。");
};

class FakeHtmlMediaElement {}
Object.defineProperty(FakeHtmlMediaElement.prototype, "currentTime", {
  configurable: true,
  get() {
    return 0;
  },
  set() {},
});
globalThis.HTMLMediaElement = FakeHtmlMediaElement;

const { configureLoggerFilter } = await import("../src/shared/logger/index.ts");
configureLoggerFilter(() => false);

const { NotificationManager } =
  await import("../src/d-anime/services/notification-manager.ts");
const { VideoSwitchHandler } =
  await import("../src/d-anime/services/video-switch-handler.ts");

class FakeVideo extends EventTarget {
  constructor({ currentTime, duration, ended, paused, source, videoId }) {
    super();
    this.currentTime = currentTime;
    this.duration = duration;
    this.paused = paused;
    this.currentSrc = source;
    this.dataset = { videoId };
    this.ended = ended;
    this.networkState = 1;
    this.readyState = 4;
    this.currentTimeWrites = [];
  }

  getAttribute(name) {
    if (name === "src") {
      return this.currentSrc;
    }
    if (name === "data-video-id") {
      return this.dataset.videoId;
    }
    return null;
  }

  querySelector() {
    return null;
  }
}

const instrumentCurrentTime = (video) => {
  let value = video.currentTime;
  Object.defineProperty(video, "currentTime", {
    configurable: true,
    get: () => value,
    set: (nextValue) => {
      video.currentTimeWrites.push(nextValue);
      value = nextValue;
    },
  });
};

class FakeRenderer {
  constructor(video) {
    this.video = video;
    this.comments = [{ text: "既存コメント", vposMs: 1_000 }];
    this.clearCalls = 0;
    this.destroyCalls = 0;
    this.initializeCalls = 0;
  }

  addComment(text, vposMs, commands) {
    this.comments.push({ commands, text, vposMs });
  }

  clearComments() {
    this.clearCalls += 1;
    this.comments = [];
  }

  destroy() {
    this.destroyCalls += 1;
    this.video = null;
  }

  getCommentsSnapshot() {
    return [...this.comments];
  }

  getCurrentVideoSource() {
    return this.video?.currentSrc ?? null;
  }

  getVideoElement() {
    return this.video;
  }

  initialize(video) {
    this.initializeCalls += 1;
    this.video = video;
  }

  isNGComment() {
    return false;
  }
}

class FakeFetcher {
  constructor() {
    this.fetchApiDataCalls = 0;
    this.fetchCommentsCalls = 0;
    this.fetchAllDataCalls = 0;
    this.lastApiData = null;
  }

  async fetchApiData(videoId) {
    this.fetchApiDataCalls += 1;
    this.lastApiData = {
      video: {
        count: { comment: 1, mylist: 1, view: 1 },
        id: videoId,
        title: "モック動画",
      },
    };
    return this.lastApiData;
  }

  async fetchComments() {
    this.fetchCommentsCalls += 1;
    return [{ commands: [], text: "新コメント", vposMs: 2_000 }];
  }

  async fetchAllData(videoId) {
    this.fetchAllDataCalls += 1;
    await this.fetchApiData(videoId);
    return [{ commands: [], text: "新コメント", vposMs: 2_000 }];
  }
}

class FakeSettingsManager {
  constructor() {
    this.saveCalls = 0;
  }

  saveVideoData() {
    this.saveCalls += 1;
    return true;
  }
}

const runScenario = async ({ currentTime, ended = false, label, paused }) => {
  const video = new FakeVideo({
    currentTime,
    duration: 1_440,
    ended,
    paused,
    source: `mock://${label}`,
    videoId: "sm-mock",
  });
  instrumentCurrentTime(video);
  const renderer = new FakeRenderer(video);
  const fetcher = new FakeFetcher();
  const settingsManager = new FakeSettingsManager();
  const handler = new VideoSwitchHandler(
    renderer,
    fetcher,
    settingsManager,
    1_000,
    0,
  );

  handler.resetVideoSource();
  await handler.onVideoSwitch(video);

  return {
    commentsAfter: renderer.getCommentsSnapshot().length,
    currentTimeAfter: video.currentTime,
    currentTimeWrites: video.currentTimeWrites,
    fetchApiDataCalls: fetcher.fetchApiDataCalls,
    fetchCommentsCalls: fetcher.fetchCommentsCalls,
    fetchAllDataCalls: fetcher.fetchAllDataCalls,
    label,
    pausedAfter: video.paused,
    rendererClearCalls: renderer.clearCalls,
    rendererDestroyCalls: renderer.destroyCalls,
    rendererInitializeCalls: renderer.initializeCalls,
    settingsSaveCalls: settingsManager.saveCalls,
  };
};

const originalNotificationShow = NotificationManager.show;
NotificationManager.show = () => null;

try {
  const episodeSwitch = await runScenario({
    currentTime: 1_110.299,
    label: "episode-switch",
    paused: false,
  });
  const terminalChapter = await runScenario({
    currentTime: 1_345,
    label: "terminal-chapter",
    ended: true,
    paused: true,
  });

  assert.equal(episodeSwitch.fetchApiDataCalls, 1);
  assert.equal(episodeSwitch.fetchCommentsCalls, 1);
  assert.equal(episodeSwitch.fetchAllDataCalls, 0);
  assert.deepEqual(episodeSwitch.currentTimeWrites, []);
  assert.equal(episodeSwitch.currentTimeAfter, 1_110.299);
  assert.equal(terminalChapter.fetchApiDataCalls, 0);
  assert.equal(terminalChapter.fetchCommentsCalls, 0);
  assert.deepEqual(terminalChapter.currentTimeWrites, []);
  assert.equal(terminalChapter.currentTimeAfter, 1_345);
  assert.equal(terminalChapter.rendererClearCalls, 0);
  assert.equal(terminalChapter.rendererDestroyCalls, 0);
  assert.equal(terminalChapter.rendererInitializeCalls, 0);

  console.log(
    JSON.stringify(
      {
        conclusions: {
          duplicateMetadataFetch: episodeSwitch.fetchApiDataCalls > 1,
          singleMetadataFetch: episodeSwitch.fetchApiDataCalls === 1,
          terminalPausePreserved: terminalChapter.pausedAfter,
          terminalPositionPreserved:
            terminalChapter.currentTimeAfter === 1_345 &&
            terminalChapter.currentTimeWrites.length === 0,
          terminalSwitchSkipped: terminalChapter.fetchApiDataCalls === 0,
          unnecessaryRendererReinitialize:
            episodeSwitch.rendererDestroyCalls > 0 &&
            episodeSwitch.rendererInitializeCalls > 0,
        },
        episodeSwitch,
        isolation: {
          networkBlocked: true,
          outboundNetworkAttempts,
        },
        terminalChapter,
      },
      null,
      2,
    ),
  );
} finally {
  NotificationManager.show = originalNotificationShow;
}
