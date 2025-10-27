import { getUnsafeWindow } from "@/shared/userscript/getUnsafeWindow";
import { ShadowDOMComponent } from "../shadow/shadow-dom-component";
import { ShadowStyleManager } from "../styles/shadow-style-manager";
import { NotificationManager } from "../notification-manager";
import { SettingsManager } from "../../services/settings-manager";
import type { RendererSettings, VideoMetadata } from "@/shared/types";
import {
  NicoApiFetcher,
  NicoApiResponseBody,
} from "../services/nico-api-fetcher";
import {
  NicoVideoSearcher,
  NicoSearchResultItem,
} from "../services/nico-video-searcher";
import { createLogger } from "@/shared/logger";
import { svgComment, svgLock, svgPalette } from "@/shared/icons/mdi";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";
import {
  buildNicovideoSearchUrl,
  NICOVIDEO_URLS,
} from "@/shared/constants/urls";

const logger = createLogger("dAnime:SettingsUI");

const SELECTORS = {
  searchInput: "#searchInput",
  searchButton: "#searchButton",
  openSearchPage: "#openSearchPageDirect",
  searchResults: "#searchResults",
  saveButton: "#saveSettings",
  opacitySelect: "#commentOpacity",
  visibilityToggle: "#commentVisibilityToggle",
  currentTitle: "#currentTitle",
  currentVideoId: "#currentVideoId",
  currentOwner: "#currentOwner",
  currentViewCount: "#currentViewCount",
  currentCommentCount: "#currentCommentCount",
  currentMylistCount: "#currentMylistCount",
  currentPostedAt: "#currentPostedAt",
  currentThumbnail: "#currentThumbnail",
  colorValue: ".color-value",
  colorPreview: ".color-preview",
  colorPicker: "#colorPicker",
  colorPickerInput: "#colorPickerInput",
  openColorPicker: "#openColorPicker",
  ngWords: "#ngWords",
  ngRegexps: "#ngRegexps",
  showNgWords: "#showNgWords",
  showNgRegexps: "#showNgRegexp",
  playCurrentVideo: "#playCurrentVideo",
} as const;

type SelectorKey = keyof typeof SELECTORS;

type SearchResultRenderer = (item: NicoSearchResultItem) => string;

export class SettingsUI extends ShadowDOMComponent {
  private readonly settingsManager: SettingsManager;
  private readonly fetcher: NicoApiFetcher;
  private readonly searcher: NicoVideoSearcher;
  private settings: RendererSettings;
  private currentVideoInfo: VideoMetadata | null;
  private hostElement: HTMLDivElement | null = null;
  private lastAutoButtonElement: HTMLElement | null = null;

  constructor(
    settingsManager: SettingsManager,
    fetcher = new NicoApiFetcher(),
    searcher = new NicoVideoSearcher(),
  ) {
    super();
    this.settingsManager = settingsManager;
    this.fetcher = fetcher;
    this.searcher = searcher;
    this.settings = this.settingsManager.getSettings();
    this.currentVideoInfo = this.settingsManager.loadVideoData();
  }

  insertIntoMypage(): void {
    const target = document.querySelector(DANIME_SELECTORS.mypageHeaderTitle);
    if (!target) {
      return;
    }
    this.hostElement = this.createSettingsUI();
    target.parentElement?.insertBefore(this.hostElement, target.nextSibling);

    this.waitMypageListStable()
      .then(() => {
        try {
          this.tryRestoreByDanimeIds();
        } catch (e) {
          console.warn("[SettingsUI] restore failed:", e);
        }
      });
  }

  addAutoCommentButtons(): void {
    const items = document.querySelectorAll<HTMLDivElement>(
      DANIME_SELECTORS.mypageItem,
    );
    items.forEach((item) => {
      const titleElement = item.querySelector(DANIME_SELECTORS.mypageItemTitle);
      if (
        !titleElement ||
        titleElement.querySelector(".auto-comment-button-host")
      ) {
        return;
      }

      const title =
        titleElement.querySelector("span")?.textContent?.trim() ?? "";
      const episodeNumber =
        item
          .querySelector(DANIME_SELECTORS.mypageEpisodeNumber)
          ?.textContent?.trim() ?? "";
      const episodeTitle =
        item
          .querySelector(DANIME_SELECTORS.mypageEpisodeTitle)
          ?.textContent?.trim() ?? "";

      const buttonHost = document.createElement("div");
      buttonHost.className =
        "nico-comment-shadow-host auto-comment-button-host";
      buttonHost.style.cssText =
        "position:absolute;left:150px;top:3px;margin-left:8px;";
      const shadowRoot = buttonHost.attachShadow({ mode: "closed" });
      const style = document.createElement("style");
      style.textContent = ShadowStyleManager.getAutoButtonStyles();
      shadowRoot.appendChild(style);

      const button = document.createElement("button");
      button.className = "auto-comment-button";
      button.innerHTML = svgComment;
      button.setAttribute("aria-label", "コメント設定");
      button.setAttribute("title", "コメント設定");
      button.setAttribute("type", "button");
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        try {
          const keyword = [title, episodeNumber, episodeTitle]
            .filter(Boolean)
            .join(" ");
          this.scrollToSettings();
          this.setSearchKeyword(keyword);
          this.lastAutoButtonElement = buttonHost;

          // 追加: 厳密識別子 (workId, partId) を抽出して保存
          try {
            const workId =
              item.querySelector<HTMLInputElement>('input[name="workId"]')
                ?.value?.trim() ?? "";
            // partId は a[onclick*="mypageContentPlayWrapper("...")"] か、テキスト側リンクの href クエリから取得
            const thumbA = item.querySelector<HTMLAnchorElement>(
              ".thumbnailContainer > a, .thumbnail-container > a",
            );
            const textA = item.querySelector<HTMLAnchorElement>(
              'a.textContainer[href*="partId="]',
            );
            let partId = "";
            const onclk = thumbA?.getAttribute("onclick") ?? "";
            const m = onclk.match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);
            if (m) {
              partId = m[1];
            } else if (textA?.href) {
              const u = new URL(textA.href, location.origin);
              partId = (u.searchParams.get("partId") ?? "").trim();
            }
            if (workId && partId) {
              this.settingsManager.saveLastDanimeIds({ workId, partId });
            }
          } catch (e) {
            console.warn("[SettingsUI] save (workId, partId) skipped:", e);
          }

          const results = await this.executeSearch(keyword);
          if (results.length === 0) {
            return;
          }
          await this.applySearchResult(results[0]);
        } catch (error) {
          logger.error("SettingsUI.autoCommentButton", error as Error);
        }
      });

      shadowRoot.appendChild(button);
      titleElement.appendChild(buttonHost);
      this.lastAutoButtonElement = buttonHost;
    });

    this.waitMypageListStable()
      .then(() => {
        try {
          this.tryRestoreByDanimeIds();
        } catch (e) {
          console.warn("[SettingsUI] restore failed:", e);
        }
      });
  }

  private async waitMypageListStable(): Promise<void> {
    const container = document.querySelector<HTMLElement>(
      DANIME_SELECTORS.mypageListContainer,
    );
    if (!container) return;
    let lastCount = container.querySelectorAll(DANIME_SELECTORS.mypageItem).length;
    const until = Date.now() + 1500;
    return new Promise((resolve) => {
      const obs = new MutationObserver(() => {
        const c = container.querySelectorAll(DANIME_SELECTORS.mypageItem).length;
        if (c !== lastCount) {
          lastCount = c;
          return;
        }
        if (Date.now() >= until) {
          obs.disconnect();
          resolve();
        }
      });
      obs.observe(container, { childList: true, subtree: true });
      setTimeout(() => {
        try {
          obs.disconnect();
        } catch (e) {
          // 既に切断済みの場合など
          logger.debug("waitMypageListStable: observer already disconnected", e);
        }
        resolve();
      }, 1600);
    });
  }

  // --- 追加: (workId, partId) 完全一致で厳密復元 ---
  private tryRestoreByDanimeIds(): boolean {
    const ids = this.settingsManager.loadLastDanimeIds();
    if (!ids) return false;
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(DANIME_SELECTORS.mypageItem),
    );
    for (const it of items) {
      const w =
        it.querySelector<HTMLInputElement>('input[name="workId"]')?.value?.trim();
      if (w !== ids.workId) continue;
      // partId はテキスト側リンクか onclick から照合
      const textA = it.querySelector<HTMLAnchorElement>(
        'a.textContainer[href*="partId="]',
      );
      const hrefOk = (() => {
        if (!textA?.href) return false;
        const u = new URL(textA.href, location.origin);
        return (u.searchParams.get("partId") ?? "") === ids.partId;
      })();
      const thumbA = it.querySelector<HTMLAnchorElement>(
        ".thumbnailContainer > a, .thumbnail-container > a",
      );
      const onclickOk = (() => {
        const onclk = thumbA?.getAttribute("onclick") ?? "";
        const m = onclk.match(/mypageContentPlayWrapper\(["'](\d+)["']\)/);
        return !!m && m[1] === ids.partId;
      })();
      if (hrefOk || onclickOk) {
        const host =
          it.querySelector<HTMLElement>(".auto-comment-button-host") ?? it;
        this.lastAutoButtonElement = host;
        this.updatePlayButtonState(this.currentVideoInfo);
        return true;
      }
    }
    return false;
  }

  private createSettingsUI(): HTMLDivElement {
    const host = document.createElement("div");
    host.className = "nico-comment-shadow-host settings-host";

    this.createShadowDOM(host);
    this.addStyles(ShadowStyleManager.getCommonStyles());

    const settingsHTML = this.buildSettingsHtml();
    this.setHTML(settingsHTML);

    this.applySettingsToUI();
    this.setupEventListeners();
    return host;
  }

  private buildSettingsHtml(): string {
    const renderNumber = (value?: number | null): string =>
      typeof value === "number" ? value.toLocaleString() : "-";
    const renderDate = (value?: string | null): string => {
      if (!value) {
        return "-";
      }
      try {
        return new Date(value).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch {
        return value;
      }
    };

    const video = this.currentVideoInfo;
    return `
      <div class="nico-comment-settings">
        <h2>ニコニココメント設定</h2>
        <div class="setting-group search-section">
          <h3>ニコニコ動画検索</h3>
          <div class="search-container">
            <input type="text" id="searchInput" placeholder="作品名 や エピソード名 で検索">
            <button id="searchButton">検索</button>
            <button id="openSearchPageDirect" class="open-search-page-direct-btn">ニコニコ検索ページへ</button>
          </div>
          <div id="searchResults" class="search-results"></div>
        </div>
        <div class="setting-group current-settings">
          <h3>現在の設定</h3>
          <div id="currentVideoInfo" class="current-video-info">
            <div class="thumbnail-wrapper">
              <div class="thumbnail-container">
                <img id="currentThumbnail" src="${video?.thumbnail ?? ""}" alt="サムネイル">
                <div class="thumbnail-overlay"></div>
              </div>
              <button id="playCurrentVideo" class="play-button" title="この動画を再生">
                <span class="play-icon">▶</span>
              </button>
            </div>
            <div class="info-container">
              <p>動画ID: <span id="currentVideoId">${video?.videoId ?? "未設定"}</span></p>
              <p>タイトル: <span id="currentTitle">${video?.title ?? "未設定"}</span></p>
              <p>投稿者: <span id="currentOwner">${video?.owner?.nickname ?? video?.channel?.name ?? "-"}</span></p>
              <p>再生数: <span id="currentViewCount">${renderNumber(video?.viewCount)}</span></p>
              <p>コメント数: <span id="currentCommentCount">${renderNumber(video?.commentCount)}</span></p>
              <p>マイリスト数: <span id="currentMylistCount">${renderNumber(video?.mylistCount)}</span></p>
              <p>投稿日: <span id="currentPostedAt">${renderDate(video?.postedAt)}</span></p>
            </div>
          </div>
        </div>
        <div class="setting-group display-settings-group">
          <h3>表示設定</h3>
          <div class="color-setting">
            <label>コメント色:</label>
            <div class="color-presets">
              ${["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((color) => `<button class="color-preset-btn" data-color="${color}" style="background-color: ${color}"></button>`).join("")}
            </div>
          <div class="color-picker-container">
              <button id="openColorPicker" class="color-picker-button" type="button">
                <span class="color-picker-button__icon" aria-hidden="true">${svgPalette}</span>
                <span class="color-picker-button__text">カラーピッカー</span>
              </button>
              <div id="colorPicker" class="color-picker hidden">
                <p class="color-picker-instruction">下のボックスをクリックするとブラウザのカラーピッカーが開きます。</p>
                <input type="color" id="colorPickerInput" value="${this.settings.commentColor}">
              </div>
            </div>
            <span class="current-color-display">現在の色: <span class="color-preview" style="background-color: ${this.settings.commentColor}"></span><span class="color-value">${this.settings.commentColor}</span></span>
          </div>
          <div class="opacity-setting">
            <label>
              透明度:
              <select id="commentOpacity">
                ${["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.75", "0.8", "0.9", "1.0"].map((value) => `<option value="${value}">${value}</option>`).join("")}
              </select>
            </label>
          </div>
          <div class="visibility-toggle">
            <button id="commentVisibilityToggle" class="toggle-button${this.settings.isCommentVisible ? "" : " off"}">${this.settings.isCommentVisible ? "表示中" : "非表示中"}</button>
          </div>
        </div>
        <div class="setting-group">
          <h3>NGワード設定</h3>
          <div class="ng-words-container">
            <button id="showNgWords" class="mask-button" type="button">
              <span class="mask-button__icon" aria-hidden="true">${svgLock}</span>
              <span class="mask-button__text">NGワードを表示</span>
            </button>
            <textarea class="ng-words hidden" id="ngWords" placeholder="NGワードを1行ずつ入力">${this.settings.ngWords.join("\n")}</textarea>
          </div>
        </div>
        <div class="setting-group">
          <h3>NG正規表現設定</h3>
          <div class="ng-regexp-container">
            <button id="showNgRegexp" class="mask-button" type="button">
              <span class="mask-button__icon" aria-hidden="true">${svgLock}</span>
              <span class="mask-button__text">NG正規表現を表示</span>
            </button>
            <textarea class="ng-words hidden" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${this.settings.ngRegexps.join("\n")}</textarea>
          </div>
        </div>
        <button id="saveSettings">設定を保存</button>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.setupColorPresets();
    this.setupColorPicker();
    this.setupOpacitySelect();
    this.setupVisibilityToggle();
    this.setupNgControls();
    this.setupSaveButton();
    this.setupSearch();
    this.setupPlayButton();
  }

  private setupColorPresets(): void {
    const buttons =
      this.querySelectorAll<HTMLButtonElement>(".color-preset-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const color = button.dataset.color;
        if (!color) {
          return;
        }
        this.settings.commentColor = color;
        const preview = this.querySelector<HTMLSpanElement>(
          SELECTORS.colorPreview,
        );
        const value = this.querySelector<HTMLSpanElement>(SELECTORS.colorValue);
        if (preview) {
          preview.style.backgroundColor = color;
        }
        if (value) {
          value.textContent = color;
        }
      });
    });
  }

  private setupColorPicker(): void {
    const toggle = this.querySelector<HTMLButtonElement>(
      SELECTORS.openColorPicker,
    );
    const pickerContainer = this.querySelector<HTMLDivElement>(
      SELECTORS.colorPicker,
    );
    const input = this.querySelector<HTMLInputElement>(
      SELECTORS.colorPickerInput,
    );
    if (!toggle || !pickerContainer || !input) {
      return;
    }

    toggle.addEventListener("click", () => {
      pickerContainer.classList.toggle("hidden");
    });

    input.addEventListener("input", () => {
      this.settings.commentColor = input.value;
      const preview = this.querySelector<HTMLSpanElement>(
        SELECTORS.colorPreview,
      );
      const value = this.querySelector<HTMLSpanElement>(SELECTORS.colorValue);
      if (preview) {
        preview.style.backgroundColor = input.value;
      }
      if (value) {
        value.textContent = input.value;
      }
    });
  }

  private setupOpacitySelect(): void {
    const select = this.querySelector<HTMLSelectElement>(
      SELECTORS.opacitySelect,
    );
    if (!select) {
      return;
    }
    select.value = this.settings.commentOpacity.toString();
    select.addEventListener("change", () => {
      const value = Number(select.value);
      if (!Number.isNaN(value)) {
        this.settings.commentOpacity = value;
      }
    });
  }

  private setupVisibilityToggle(): void {
    const button = this.querySelector<HTMLButtonElement>(
      SELECTORS.visibilityToggle,
    );
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      this.settings.isCommentVisible = !this.settings.isCommentVisible;
      this.updateVisibilityToggleState(button);
    });
    this.updateVisibilityToggleState(button);
  }

  private setupNgControls(): void {
    const ngWordsArea = this.querySelector<HTMLTextAreaElement>(
      SELECTORS.ngWords,
    );
    const ngRegexArea = this.querySelector<HTMLTextAreaElement>(
      SELECTORS.ngRegexps,
    );
    const toggleWords = this.querySelector<HTMLButtonElement>(
      SELECTORS.showNgWords,
    );
    const toggleRegex = this.querySelector<HTMLButtonElement>(
      SELECTORS.showNgRegexps,
    );

    toggleWords?.addEventListener("click", () => {
      if (!ngWordsArea || !toggleWords) {
        return;
      }
      ngWordsArea.classList.toggle("hidden");
      const text = ngWordsArea.classList.contains("hidden")
        ? "NGワードを表示"
        : "NGワードを非表示";
      this.updateMaskButtonText(toggleWords, text);
    });

    toggleRegex?.addEventListener("click", () => {
      if (!ngRegexArea || !toggleRegex) {
        return;
      }
      ngRegexArea.classList.toggle("hidden");
      const text = ngRegexArea.classList.contains("hidden")
        ? "NG正規表現を表示"
        : "NG正規表現を非表示";
      this.updateMaskButtonText(toggleRegex, text);
    });
  }

  private setupSaveButton(): void {
    const button = this.querySelector<HTMLButtonElement>(SELECTORS.saveButton);
    if (!button) {
      return;
    }
    button.addEventListener("click", () => this.saveSettings());
  }

  private setupSearch(): void {
    const input = this.querySelector<HTMLInputElement>(SELECTORS.searchInput);
    const button = this.querySelector<HTMLButtonElement>(
      SELECTORS.searchButton,
    );
    const openPage = this.querySelector<HTMLButtonElement>(
      SELECTORS.openSearchPage,
    );

    const execute = async () => {
      const keyword = input?.value.trim();
      if (!keyword) {
        NotificationManager.show("キーワードを入力してください", "warning");
        return;
      }
      await this.executeSearch(keyword);
    };

    button?.addEventListener("click", execute);
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        execute();
      }
    });

    openPage?.addEventListener("click", (event) => {
      event.preventDefault();
      const keyword = input?.value.trim();
      const url = keyword
        ? buildNicovideoSearchUrl(keyword)
        : NICOVIDEO_URLS.searchBase;
      const globalWindow = getUnsafeWindow();
      globalWindow.open(url, "_blank", "noopener");
    });
  }

  private async executeSearch(
    keyword: string,
  ): Promise<NicoSearchResultItem[]> {
    try {
      NotificationManager.show(`「${keyword}」を検索中...`, "info");
      const results = await this.searcher.search(keyword);
      this.renderSearchResults(results, (item) =>
        this.renderSearchResultItem(item),
      );
      if (results.length === 0) {
        NotificationManager.show("検索結果が見つかりませんでした", "warning");
      }
      return results;
    } catch (error) {
      logger.error("SettingsUI.executeSearch", error as Error);
      return [];
    }
  }

  private scrollToSettings(): void {
    if (!this.hostElement) {
      return;
    }
    this.hostElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  private setSearchKeyword(keyword: string): void {
    const input = this.querySelector<HTMLInputElement>(SELECTORS.searchInput);
    if (!input) {
      return;
    }
    input.value = keyword;
    input.focus({ preventScroll: true });
  }

  private renderSearchResults(
    results: NicoSearchResultItem[],
    renderer: SearchResultRenderer,
  ): void {
    const container = this.querySelector<HTMLDivElement>(
      SELECTORS.searchResults,
    );
    if (!container) {
      return;
    }
    container.innerHTML = results.map((item) => renderer(item)).join("");
    const items = container.querySelectorAll<HTMLDivElement>(
      ".search-result-item",
    );
    items.forEach((element, index) => {
      element.addEventListener("click", () => {
        const item = results[index];
        void this.applySearchResult(item);
      });

      // Add event listener for the new "Open on Watch Page" link
      const openWatchPageLink = element.querySelector<HTMLAnchorElement>(".open-search-page-direct-btn");
      if (openWatchPageLink) {
        openWatchPageLink.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent the parent item's click listener from firing
        });
      }
    });
  }

  private renderSearchResultItem(item: NicoSearchResultItem): string {
    const postedAt = this.formatSearchResultDate(item.postedAt);
    const distanceText =
      typeof item.levenshteinDistance === "number"
        ? ` / 距離: ${item.levenshteinDistance}`
        : "";
    return `
      <div class="search-result-item">
        <img src="${item.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${item.title}</div>
          <div class="stats">再生 ${item.viewCount.toLocaleString()} / コメント ${item.commentCount.toLocaleString()} / マイリスト ${item.mylistCount.toLocaleString()}${distanceText}</div>
          <div class="date">${postedAt}</div>
          <a href="${NICOVIDEO_URLS.watchBase}/${item.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; display: inline-block; text-decoration: none;">
            視聴ページで開く
          </a>
        </div>
      </div>
    `;
  }

  private async applySearchResult(result: NicoSearchResultItem): Promise<void> {
    try {
      const apiData = await this.fetcher.fetchApiData(result.videoId);
      await this.fetcher.fetchComments();
      NotificationManager.show(
        `「${result.title}」のコメントを設定しました`,
        "success",
      );
      this.updateCurrentVideoInfo(this.buildVideoMetadata(result, apiData));
    } catch (error) {
      logger.error("SettingsUI.applySearchResult", error as Error);
    }
  }

  private buildVideoMetadata(
    result: NicoSearchResultItem,
    apiData: NicoApiResponseBody,
  ): VideoMetadata {
    return {
      videoId: result.videoId,
      title: result.title,
      viewCount: apiData.video?.count?.view ?? result.viewCount,
      commentCount: apiData.video?.count?.comment ?? result.commentCount,
      mylistCount: apiData.video?.count?.mylist ?? result.mylistCount,
      postedAt: apiData.video?.registeredAt ?? result.postedAt,
      thumbnail: apiData.video?.thumbnail?.url ?? result.thumbnail,
      owner: apiData.owner ?? result.owner ?? undefined,
      channel: apiData.channel ?? result.channel ?? undefined,
    } as VideoMetadata;
  }

  private applySettingsToUI(): void {
    const opacitySelect = this.querySelector<HTMLSelectElement>(
      SELECTORS.opacitySelect,
    );
    const visibilityButton = this.querySelector<HTMLButtonElement>(
      SELECTORS.visibilityToggle,
    );
    const colorPreview = this.querySelector<HTMLSpanElement>(
      SELECTORS.colorPreview,
    );
    const colorValue = this.querySelector<HTMLSpanElement>(
      SELECTORS.colorValue,
    );
    const ngWords = this.querySelector<HTMLTextAreaElement>(SELECTORS.ngWords);
    const ngRegex = this.querySelector<HTMLTextAreaElement>(
      SELECTORS.ngRegexps,
    );

    if (opacitySelect) {
      opacitySelect.value = this.settings.commentOpacity.toString();
    }
    if (visibilityButton) {
      this.updateVisibilityToggleState(visibilityButton);
    }
    if (colorPreview) {
      colorPreview.style.backgroundColor = this.settings.commentColor;
    }
    if (colorValue) {
      colorValue.textContent = this.settings.commentColor;
    }
    if (ngWords) {
      ngWords.value = this.settings.ngWords.join("\n");
    }
    if (ngRegex) {
      ngRegex.value = this.settings.ngRegexps.join("\n");
    }
    this.updatePlayButtonState(this.currentVideoInfo);
  }

  private saveSettings(): void {
    const opacitySelect = this.querySelector<HTMLSelectElement>(
      SELECTORS.opacitySelect,
    );
    const ngWords = this.querySelector<HTMLTextAreaElement>(SELECTORS.ngWords);
    const ngRegex = this.querySelector<HTMLTextAreaElement>(
      SELECTORS.ngRegexps,
    );

    if (opacitySelect) {
      const value = Number(opacitySelect.value);
      if (!Number.isNaN(value)) {
        this.settings.commentOpacity = value;
      }
    }
    if (ngWords) {
      this.settings.ngWords = ngWords.value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (ngRegex) {
      this.settings.ngRegexps = ngRegex.value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    if (this.settingsManager.updateSettings(this.settings)) {
      NotificationManager.show("設定を保存しました", "success");
    } else {
      NotificationManager.show("設定の保存に失敗しました", "error");
    }
  }

  private updateCurrentVideoInfo(videoInfo: VideoMetadata): void {
    this.currentVideoInfo = videoInfo;

    const entries: Array<[SelectorKey, string]> = [
      ["currentTitle", videoInfo.title ?? "-"],
      ["currentVideoId", videoInfo.videoId ?? "-"],
      [
        "currentOwner",
        videoInfo.owner?.nickname ?? videoInfo.channel?.name ?? "-",
      ],
      ["currentViewCount", this.formatNumber(videoInfo.viewCount)],
      ["currentCommentCount", this.formatNumber(videoInfo.commentCount)],
      ["currentMylistCount", this.formatNumber(videoInfo.mylistCount)],
      ["currentPostedAt", this.formatSearchResultDate(videoInfo.postedAt)],
    ];

    entries.forEach(([key, value]) => {
      const element = this.querySelector<HTMLElement>(SELECTORS[key]);
      if (element) {
        element.textContent = value;
      }
    });

    const thumbnail = this.querySelector<HTMLImageElement>(
      SELECTORS.currentThumbnail,
    );
    if (thumbnail && videoInfo.thumbnail) {
      thumbnail.src = videoInfo.thumbnail;
      thumbnail.alt = videoInfo.title ?? "サムネイル";
    }

    try {
      this.settingsManager.saveVideoData(videoInfo.title ?? "", videoInfo);
    } catch (error) {
      logger.error("SettingsUI.updateCurrentVideoInfo", error as Error);
    }
    this.updatePlayButtonState(videoInfo);
  }

  private formatNumber(value?: number | null): string {
    return typeof value === "number" ? value.toLocaleString() : "-";
  }

  private formatSearchResultDate(value?: string | null): string {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(date);
  }

  private setupPlayButton(): void {
    const button = this.querySelector<HTMLButtonElement>(
      SELECTORS.playCurrentVideo,
    );
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      try {
        const videoId = this.currentVideoInfo?.videoId;
        if (!videoId) {
          NotificationManager.show(
            "再生できる動画が設定されていません",
            "warning",
          );
          return;
        }
        const itemElement = this.lastAutoButtonElement?.closest(
          ".itemModule.list",
        ) as HTMLElement | null;
        if (this.lastAutoButtonElement) {
          const playLink = itemElement?.querySelector<HTMLAnchorElement>(
            ".thumbnailContainer > a, .thumbnail-container > a",
          );
          if (playLink) {
            NotificationManager.show(
              `「${this.currentVideoInfo?.title || "動画"}」を再生します...`,
              "success",
            );
            setTimeout(() => {
              playLink.click();
            }, 300);
            return;
          }
        }
        NotificationManager.show(
          "再生リンクが見つかりませんでした（対象アイテム内に限定して検索済み）",
          "warning",
        );
      } catch (error) {
        logger.error("SettingsUI.playCurrentVideo", error as Error);
        NotificationManager.show(`再生エラー: ${(error as Error).message}`, "error");
      }
    });
    this.updatePlayButtonState(this.currentVideoInfo);
  }

  private updatePlayButtonState(videoInfo: VideoMetadata | null): void {
    const button = this.querySelector<HTMLButtonElement>(
      SELECTORS.playCurrentVideo,
    );
    if (!button) {
      return;
    }
    const hasVideo = Boolean(videoInfo?.videoId);
    button.disabled = !hasVideo;
    button.setAttribute("aria-disabled", (!hasVideo).toString());
  }

  private updateVisibilityToggleState(button: HTMLButtonElement): void {
    button.textContent = this.settings.isCommentVisible ? "表示中" : "非表示中";
    button.classList.toggle("off", !this.settings.isCommentVisible);
  }

  private updateMaskButtonText(button: HTMLButtonElement, text: string): void {
    const label = button.querySelector<HTMLSpanElement>(".mask-button__text");
    if (label) {
      label.textContent = text;
    }
  }
}
