import { getUnsafeWindow } from "@/shared/userscript/getUnsafeWindow";
import { ShadowDOMComponent } from "@/d-anime/shadow/shadow-dom-component";
import { ShadowStyleManager } from "@/d-anime/styles/shadow-style-manager";
import { NotificationManager } from "@/d-anime/services/notification-manager";
import { SettingsManager } from "@/d-anime/services/settings-manager";
import type {
  RendererSettings,
  VideoMetadata,
} from "@/shared/types";
import {
  NicoApiFetcher,
  NicoApiResponseBody,
} from "@/d-anime/services/nico-api-fetcher";
import {
  NicoVideoSearcher,
  NicoSearchResultItem,
} from "@/d-anime/services/nico-video-searcher";
import { createLogger } from "@/shared/logger";
import {
  svgClose,
  svgComment,
  svgCommentCount,
  svgLock,
  svgMylistCount,
  svgPostedAt,
  svgVideoId,
  svgVideoOwner,
  svgViewCount,
  svgPlay,
  svgCommentText,
  svgStar,
  svgSync,
} from "@/shared/icons/mdi";
import { DANIME_SELECTORS } from "@/shared/constants/d-anime";
import {
  buildNicovideoSearchUrl,
  NICOVIDEO_URLS,
} from "@/shared/constants/urls";
import { USERSCRIPT_VERSION_UI_DISPLAY } from "@/d-anime/config/default-settings";

const logger = createLogger("dAnime:SettingsUI");

const SELECTORS = {
  searchInput: "#searchInput",
  searchAnimeTitle: "#searchAnimeTitle",
  searchEpisodeNumber: "#searchEpisodeNumber",
  searchEpisodeTitle: "#searchEpisodeTitle",
  searchButton: "#searchButton",
  openSearchPage: "#openSearchPageDirect",
  searchResults: "#searchResults",
  saveButton: "#saveSettings",
  autoSearchToggle: "#autoSearchToggle",
  autoSearchOptionRow: "#autoSearchOptionRow",
  currentTitle: "#currentTitle",
  currentVideoId: "#currentVideoId",
  currentOwner: "#currentOwner",
  currentViewCount: "#currentViewCount",
  currentCommentCount: "#currentCommentCount",
  currentMylistCount: "#currentMylistCount",
  currentPostedAt: "#currentPostedAt",
  currentThumbnail: "#currentThumbnail",
  ngWords: "#ngWords",
  ngRegexps: "#ngRegexps",
  showNgWords: "#showNgWords",
  showNgRegexps: "#showNgRegexp",
  settingsModal: "#settingsModal",
  closeSettingsModal: "#closeSettingsModal",
  modalOverlay: ".settings-modal__overlay",
  modalTabs: ".settings-modal__tab",
  modalPane: ".settings-modal__pane",
  searchSectionNote: "#searchSectionNote",
} as const;

type SelectorKey = keyof typeof SELECTORS;

type SearchResultRenderer = (item: NicoSearchResultItem) => string;

const MODAL_TAB_KEYS = ["search", "ng"] as const;
type ModalTabKey = (typeof MODAL_TAB_KEYS)[number];

const SIMILARITY_STYLES = `
  .similarity-container {
    position: relative;
    width: 100px;
    height: 18px;
    background-color: var(--bg-primary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .similarity-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--secondary), var(--primary));
    opacity: 0.6;
    transition: width 0.3s ease;
  }
  .similarity-text {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const SEARCH_FIELDS_STYLES = `
  .search-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  .search-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .search-field-row {
    display: flex;
    gap: 12px;
  }
  .search-field--half {
    flex: 1;
  }
  .search-field__label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .search-field__input {
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .search-field__input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(127, 90, 240, 0.2);
  }
  .search-field__input::placeholder {
    color: var(--text-muted);
  }
  .search-safeguard-note {
    margin: 12px 0;
    padding: 10px 12px;
    background: rgba(44, 182, 125, 0.15);
    border: 1px solid rgba(44, 182, 125, 0.3);
    border-radius: 8px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .search-safeguard-note strong {
    color: #2CB67D;
  }
`;

export class SettingsUI extends ShadowDOMComponent {
  private static readonly FAB_HOST_ID = "danime-settings-fab-host";

  private readonly settingsManager: SettingsManager;
  private readonly fetcher: NicoApiFetcher;
  private readonly searcher: NicoVideoSearcher;
  private settings: RendererSettings;
  private currentVideoInfo: VideoMetadata | null;
  private hostElement: HTMLDivElement | null = null;
  private activeTab: ModalTabKey = "search";
  private modalElement: HTMLDivElement | null = null;
  private overlayElement: HTMLDivElement | null = null;
  private closeButtonElement: HTMLButtonElement | null = null;
  private fabElement: HTMLButtonElement | null = null;
  private fabHostElement: HTMLDivElement | null = null;
  private fabShadowRoot: ShadowRoot | null = null;
  private readonly handleFabClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.openSettingsModal();
  };
  private readonly handleOverlayClick = (): void => {
    this.closeSettingsModal();
  };
  private readonly handleCloseClick = (): void => {
    this.closeSettingsModal();
  };
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
  }

  addAutoCommentButtons(): void {
    // 視聴履歴の各アイテムにボタンを追加し、クリックでアニメタイトル、話数、エピソードタイトルを検索フォームに自動入力
    const items = document.querySelectorAll<HTMLElement>(DANIME_SELECTORS.mypageItem);
    
    items.forEach((item) => {
      // 既にボタンが追加されている場合はスキップ
      if (item.dataset.autoFillEnabled === "true") {
        return;
      }

      // 各要素を取得
      const titleElement = item.querySelector<HTMLElement>(DANIME_SELECTORS.mypageItemTitle);
      const episodeNumberElement = item.querySelector<HTMLElement>(DANIME_SELECTORS.mypageEpisodeNumber);
      const episodeTitleElement = item.querySelector<HTMLElement>(DANIME_SELECTORS.mypageEpisodeTitle);
      
      if (!titleElement || !episodeTitleElement) {
        return;
      }

      // 各テキストを取得
      const animeTitle = titleElement.textContent?.trim() ?? "";
      const episodeNumber = episodeNumberElement?.textContent?.trim() ?? "";
      const episodeTitle = episodeTitleElement.textContent?.trim() ?? "";
      
      if (!animeTitle) {
        return;
      }

      // Shadow DOMでボタンを作成
      const buttonHost = document.createElement("div");
      buttonHost.style.marginTop = "8px";
      buttonHost.style.display = "block";
      
      const shadowRoot = buttonHost.attachShadow({ mode: "open" });
      
      // スタイルを追加
      const style = document.createElement("style");
      style.textContent = ShadowStyleManager.getAutoButtonStyles();
      shadowRoot.appendChild(style);
      
      // ボタンを作成
      const button = document.createElement("button");
      button.className = "auto-comment-button";
      button.title = "検索フォームにタイトル・話数・エピソードタイトルを入力";
      button.setAttribute("aria-label", "検索フォームにタイトル・話数・エピソードタイトルを入力");
      
      // アイコンを追加（入力/フォームアイコン）
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,14H16L18,16V18H20V16L18,14V12H14M10,10H4V12H10M20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H11.35C11.14,19.37 11,18.7 11,18A7,7 0 0,1 18,11C19.1,11 20.12,11.29 21,11.78V6M4,6H9.17L11.17,8H20V10H18V10.5C16.55,10.16 15,10.64 14,11.5V10H4M12,14H4V16H11.35C11.63,15.28 12.08,14.63 12.64,14.08L12,14Z" />
        </svg>
        <span style="margin-left: 6px; font-size: 12px; font-weight: 500;">フォーム入力</span>
      `;
      
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        // モーダルを開く
        this.openSettingsModal(false);

        // 検索タブに切り替え
        const searchTab = this.queryModalElement<HTMLButtonElement>(
          `${SELECTORS.modalTabs}[data-tab="search"]`,
        );
        searchTab?.click();

        // 各フィールドに値を設定
        const animeTitleInput = this.queryModalElement<HTMLInputElement>(
          SELECTORS.searchAnimeTitle,
        );
        const episodeNumberInput = this.queryModalElement<HTMLInputElement>(
          SELECTORS.searchEpisodeNumber,
        );
        const episodeTitleInput = this.queryModalElement<HTMLInputElement>(
          SELECTORS.searchEpisodeTitle,
        );
        
        if (animeTitleInput) {
          animeTitleInput.value = animeTitle;
        }
        if (episodeNumberInput && episodeNumber) {
          episodeNumberInput.value = episodeNumber;
        }
        if (episodeTitleInput && episodeTitle) {
          episodeTitleInput.value = episodeTitle;
        }
        
        // フォーカスを設定
        animeTitleInput?.focus({ preventScroll: true });
        
        // 通知を表示
        const parts = [animeTitle];
        if (episodeNumber) parts.push(episodeNumber);
        if (episodeTitle) parts.push(episodeTitle);
        
        NotificationManager.show(
          `「${parts.join(" ")}」を検索フォームに入力しました`,
          "success",
        );
      });
      
      shadowRoot.appendChild(button);
      
      // エピソードタイトル要素の後ろにボタンを挿入
      // episodeTitleElementの親要素（.textContainerIn）を取得
      const textContainer = episodeTitleElement.parentElement;
      if (textContainer) {
        // iconContainerの前に挿入
        const iconContainer = textContainer.querySelector(".iconContainer");
        if (iconContainer) {
          textContainer.insertBefore(buttonHost, iconContainer);
        } else {
          // iconContainerがない場合は最後に追加
          textContainer.appendChild(buttonHost);
        }
      }
      
      item.dataset.autoFillEnabled = "true";
    });
  }

  // 以下のメソッドは視聴ページでの自動設定により不要になりました
  private async waitMypageListStable(): Promise<void> {
    // 何もしない（互換性のため残す）
  }

  private tryRestoreByDanimeIds(): boolean {
    // 何もしない（互換性のため残す）
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

    this.addStyles(SIMILARITY_STYLES);
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
    const thumbnailUrl = video?.thumbnail ?? "";
    const hasVideo = Boolean(video?.videoId);

    return `
      <div class="nico-comment-settings">
        <h2>
          <span class="settings-title">d-anime-nico-comment-renderer</span>
          <span class="version-badge" aria-label="バージョン">${USERSCRIPT_VERSION_UI_DISPLAY}</span>
        </h2>

        <!-- Cinematic Glass Card -->
        <div class="video-card${hasVideo ? "" : " video-card--empty"}">
          <!-- 背景ブラー効果 -->
          <div
            class="video-card__ambient"
            id="currentVideoAmbient"
            style="background-image: url('${thumbnailUrl}');"
          ></div>
          <div class="video-card__gradient"></div>

          <div class="video-card__body">
            <!-- サムネイル -->
            <div class="video-card__thumbnail">
              <img id="currentThumbnail" src="${thumbnailUrl}" alt="サムネイル">
            </div>

            <!-- 情報セクション -->
            <div class="video-card__info">
              <!-- 上部: ID & 日付 -->
              <div class="video-card__meta-row">
                <div class="video-card__id" title="動画ID">
                  <span class="video-card__id-icon" aria-hidden="true">${svgVideoId}</span>
                  <span class="sr-only">動画ID</span>
                  <span id="currentVideoId">${video?.videoId ?? "未設定"}</span>
                </div>
                <div class="video-card__date" title="投稿日">
                  <span class="video-card__date-icon" aria-hidden="true">${svgPostedAt}</span>
                  <span class="sr-only">投稿日</span>
                  <span id="currentPostedAt">${renderDate(video?.postedAt)}</span>
                </div>
              </div>

              <!-- 中央: タイトル & 投稿者 -->
              <div class="video-card__main">
                <h3 class="video-card__title" id="currentTitle">${video?.title ?? "オーバーレイする動画が未設定です"}</h3>
                <div class="video-card__owner" title="投稿者">
                  <span class="video-card__owner-icon" aria-hidden="true">${svgVideoOwner}</span>
                  <span class="sr-only">投稿者</span>
                  <span id="currentOwner">${video?.owner?.nickname ?? video?.channel?.name ?? "-"}</span>
                </div>
              </div>

              <!-- 下部: 統計情報 -->
              <div class="video-card__stats">
                <div class="video-card__stat" title="再生数">
                  <span class="video-card__stat-icon" aria-hidden="true">${svgViewCount}</span>
                  <span class="sr-only">再生数</span>
                  <span class="video-card__stat-value" id="currentViewCount">${renderNumber(video?.viewCount)}</span>
                </div>
                <div class="video-card__stat" title="コメント数">
                  <span class="video-card__stat-icon" aria-hidden="true">${svgCommentCount}</span>
                  <span class="sr-only">コメント数</span>
                  <span class="video-card__stat-value" id="currentCommentCount">${renderNumber(video?.commentCount)}</span>
                </div>
                <div class="video-card__stat" title="マイリスト数">
                  <span class="video-card__stat-icon" aria-hidden="true">${svgMylistCount}</span>
                  <span class="sr-only">マイリスト数</span>
                  <span class="video-card__stat-value" id="currentMylistCount">${renderNumber(video?.mylistCount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildModalHtml(): string {
    return `
      <div id="settingsModal" class="settings-modal hidden" role="dialog" aria-modal="true" aria-labelledby="settingsModalTitle" aria-hidden="true">
        <div class="settings-modal__overlay"></div>
        <div class="settings-modal__content">
          <header class="settings-modal__header">
            <h3 id="settingsModalTitle">設定</h3>
            <button id="closeSettingsModal" class="settings-modal__close" type="button" aria-label="設定を閉じる">
              <span aria-hidden="true">${svgClose}</span>
            </button>
          </header>
          <div class="settings-modal__tabs" role="tablist">
            <button class="settings-modal__tab is-active" type="button" data-tab="search" role="tab" aria-selected="true" aria-controls="settingsPaneSearch" id="settingsTabSearch">
              <span class="settings-modal__tab-icon" aria-hidden="true">${svgComment}</span>
              <span class="settings-modal__tab-label">検索</span>
            </button>
            <button class="settings-modal__tab" type="button" data-tab="ng" role="tab" aria-selected="false" aria-controls="settingsPaneNg" id="settingsTabNg" tabindex="-1">
              <span class="settings-modal__tab-icon" aria-hidden="true">${svgLock}</span>
              <span class="settings-modal__tab-label">NG</span>
            </button>
          </div>
          <div class="settings-modal__panes">
            <section class="settings-modal__pane is-active" data-pane="search" role="tabpanel" id="settingsPaneSearch" aria-labelledby="settingsTabSearch">
              <div class="setting-group search-section">
                <h3>コメントをオーバーレイする動画を検索</h3>
                <p id="searchSectionNote" class="search-section__note" style="background: ${this.settings.autoSearchEnabled ? "#7F5AF0" : "#2CB67D"}; color: #FFFFFE; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
                  ${this.settings.autoSearchEnabled
                    ? `ℹ️ <strong>自動設定機能が有効です</strong><br>
                  視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
                  手動で検索したい場合は、下の自動検索スイッチを無効にしてから以下のフォームをご利用ください。`
                    : `🔧 <strong>手動設定モード</strong><br>
                  自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
                  自動検索を有効にするには下の自動検索スイッチを有効にしてください。`}
                </p>
                <div
                  class="playback-option${this.settings.autoSearchEnabled ? " playback-option--active" : ""}"
                  id="autoSearchOptionRow"
                  role="button"
                  tabindex="0"
                  aria-pressed="${this.settings.autoSearchEnabled ? "true" : "false"}"
                  style="margin-bottom: 16px;"
                >
                  <div class="playback-option__icon-wrapper${this.settings.autoSearchEnabled ? " playback-option__icon-wrapper--active" : ""}">
                    ${svgSync}
                  </div>
                  <div class="playback-option__text">
                    <span class="playback-option__title">自動検索</span>
                    <span class="playback-option__desc">視聴ページ表示時に自動でコメントを設定</span>
                  </div>
                  <div class="playback-option__toggle">
                    <input
                      type="checkbox"
                      id="autoSearchToggle"
                      class="playback-option__checkbox"
                      ${this.settings.autoSearchEnabled ? "checked" : ""}
                    >
                    <span class="playback-option__switch"></span>
                  </div>
                </div>
                <div class="search-fields">
                  <div class="search-field">
                    <label for="searchAnimeTitle" class="search-field__label">アニメタイトル</label>
                    <input type="text" id="searchAnimeTitle" class="search-field__input" placeholder="例: 葬送のフリーレン">
                  </div>
                  <div class="search-field-row">
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeNumber" class="search-field__label">話数</label>
                      <input type="text" id="searchEpisodeNumber" class="search-field__input" placeholder="例: 第1話">
                    </div>
                    <div class="search-field search-field--half">
                      <label for="searchEpisodeTitle" class="search-field__label">エピソードタイトル（任意）</label>
                      <input type="text" id="searchEpisodeTitle" class="search-field__input" placeholder="例: 冒険の終わり">
                    </div>
                  </div>
                </div>
                <div class="search-container">
                  <input type="text" id="searchInput" placeholder="または自由入力で検索" style="flex: 1;">
                  <button id="searchButton">検索</button>
                  <button id="openSearchPageDirect" class="open-search-page-direct-btn">検索ページ</button>
                </div>
                <p class="search-safeguard-note">
                  🛡️ <strong>公式動画セーフガード有効</strong>：アニメタイトルを入力すると、投稿者名が「アニメタイトル」「アニメタイトル 第Nクール」「dアニメストア ニコニコ支店」の公式動画のみが優先表示されます。エピソード切替時も公式動画のみが自動選択されます。
                </p>
                <div id="searchResults" class="search-results"></div>
              </div>
            </section>
            <section class="settings-modal__pane" data-pane="ng" role="tabpanel" id="settingsPaneNg" aria-labelledby="settingsTabNg" aria-hidden="true">
              <div class="setting-group ng-settings">
                <div class="ng-settings__column" aria-labelledby="ngWordsTitle">
                  <h3 id="ngWordsTitle" class="ng-settings__title">NGワード</h3>
                  <textarea class="ng-settings__textarea" id="ngWords" placeholder="NGワードを1行ずつ入力">${(this.settings.ngWords ?? []).join("\n")}</textarea>
                </div>
                <div class="ng-settings__column" aria-labelledby="ngRegexTitle">
                  <h3 id="ngRegexTitle" class="ng-settings__title">NG正規表現</h3>
                  <textarea class="ng-settings__textarea" id="ngRegexps" placeholder="NG正規表現を1行ずつ入力">${(this.settings.ngRegexps ?? []).join("\n")}</textarea>
                </div>
              </div>
            </section>
          </div>
          <footer class="settings-modal__footer">
            <button id="saveSettings" type="button">設定を保存</button>
          </footer>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.setupModalControls();
    this.setupModalTabs();
    this.setupAutoSearchToggle();
    this.setupNgControls();
    this.setupSaveButton();
    this.setupSearch();
  }

  private setupModalControls(): void {
    this.closeButtonElement?.removeEventListener("click", this.handleCloseClick);
    this.overlayElement?.removeEventListener("click", this.handleOverlayClick);

    const fab = this.createOrUpdateFab();

    const modal = this.queryModalElement<HTMLDivElement>(SELECTORS.settingsModal);
    const closeButton = this.queryModalElement<HTMLButtonElement>(
      SELECTORS.closeSettingsModal,
    );
    const overlay = this.queryModalElement<HTMLDivElement>(SELECTORS.modalOverlay);

    this.modalElement = modal ?? null;
    this.closeButtonElement = closeButton ?? null;
    this.overlayElement = overlay ?? null;

    if (!modal || !closeButton || !overlay || !fab) {
      return;
    }

    this.fabElement?.removeEventListener("click", this.handleFabClick);
    fab.addEventListener("click", this.handleFabClick);
    fab.setAttribute("aria-controls", modal.id);
    fab.setAttribute("aria-haspopup", "dialog");
    fab.setAttribute("aria-expanded", "false");
    this.fabElement = fab;

    closeButton.addEventListener("click", this.handleCloseClick);
    overlay.addEventListener("click", this.handleOverlayClick);

    this.shadowRoot?.addEventListener("keydown", (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        keyboardEvent.key === "Escape" &&
        !this.modalElement?.classList.contains("hidden")
      ) {
        keyboardEvent.preventDefault();
        this.closeSettingsModal();
      }
    });

    this.applySettingsToUI();
  }

  private setupModalTabs(): void {
    const tabButtons = Array.from(
      this.queryModalSelectorAll<HTMLButtonElement>(SELECTORS.modalTabs),
    );
    const panes = Array.from(
      this.queryModalSelectorAll<HTMLElement>(SELECTORS.modalPane),
    );
    if (tabButtons.length === 0 || panes.length === 0) {
      return;
    }

    const activateTab = (key: ModalTabKey) => {
      tabButtons.forEach((button) => {
        const tabKey = this.toModalTabKey(button.dataset.tab);
        const isActive = tabKey === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panes.forEach((pane) => {
        const paneKey = this.toModalTabKey(pane.dataset.pane);
        const isActive = paneKey === key;
        pane.classList.toggle("is-active", isActive);
        pane.setAttribute("aria-hidden", String(!isActive));
      });

      this.activeTab = key;
    };

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = this.toModalTabKey(button.dataset.tab);
        if (key) {
          activateTab(key);
        }
      });

      button.addEventListener("keydown", (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== "ArrowRight" && keyboardEvent.key !== "ArrowLeft") {
          return;
        }
        keyboardEvent.preventDefault();
        const currentKey = this.toModalTabKey(button.dataset.tab);
        if (!currentKey) {
          return;
        }
        const direction = keyboardEvent.key === "ArrowRight" ? 1 : -1;
        const nextIndex =
          (MODAL_TAB_KEYS.indexOf(currentKey) + direction + MODAL_TAB_KEYS.length) %
          MODAL_TAB_KEYS.length;
        const nextKey = MODAL_TAB_KEYS[nextIndex];
        activateTab(nextKey);
        const nextButton = tabButtons.find(
          (candidate) => this.toModalTabKey(candidate.dataset.tab) === nextKey,
        );
        nextButton?.focus({ preventScroll: true });
      });
    });

    activateTab(this.activeTab);
  }

  private openSettingsModal(focusActiveTab: boolean = true): void {
    if (!this.modalElement || !this.fabElement) {
      return;
    }
    this.modalElement.classList.remove("hidden");
    this.modalElement.setAttribute("aria-hidden", "false");
    this.fabElement.setAttribute("aria-expanded", "true");
    if (focusActiveTab) {
      const activeTab = this.queryModalElement<HTMLButtonElement>(
        `${SELECTORS.modalTabs}.is-active`,
      );
      activeTab?.focus({ preventScroll: true });
    }
  }

  private closeSettingsModal(): void {
    if (!this.modalElement || !this.fabElement) {
      return;
    }
    this.modalElement.classList.add("hidden");
    this.modalElement.setAttribute("aria-hidden", "true");
    this.fabElement.setAttribute("aria-expanded", "false");
    if (this.fabElement?.isConnected) {
      this.fabElement.focus({ preventScroll: true });
    }
  }

  private toModalTabKey(value?: string): ModalTabKey | null {
    if (!value) {
      return null;
    }
    return (MODAL_TAB_KEYS as readonly string[]).includes(value)
      ? (value as ModalTabKey)
      : null;
  }

  private setupAutoSearchToggle(): void {
    const checkbox = this.queryModalElement<HTMLInputElement>(
      SELECTORS.autoSearchToggle,
    );
    const row = this.queryModalElement<HTMLDivElement>(
      SELECTORS.autoSearchOptionRow,
    );
    if (!checkbox || !row) {
      return;
    }

    const toggleAutoSearch = (): void => {
      this.settings.autoSearchEnabled = !this.settings.autoSearchEnabled;
      this.updateAutoSearchToggleState();
      this.updateSearchSectionNote();
      // 自動保存（設定を即座に反映）
      this.settingsManager.updateSettings(this.settings);
      NotificationManager.show(
        this.settings.autoSearchEnabled
          ? "自動検索を有効にしました"
          : "自動検索を無効にしました（手動設定モード）",
        "success",
      );
    };

    // 行クリックでトグル
    row.addEventListener("click", (event) => {
      // チェックボックス自体のクリックは二重発火を防ぐためスキップ
      if ((event.target as HTMLElement).closest(".playback-option__toggle")) {
        return;
      }
      toggleAutoSearch();
    });

    // Enterキーでもトグル可能に
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleAutoSearch();
      }
    });

    // チェックボックス変更
    checkbox.addEventListener("change", () => {
      toggleAutoSearch();
    });

    this.updateAutoSearchToggleState();
  }

  private updateAutoSearchToggleState(): void {
    const isEnabled = this.settings.autoSearchEnabled;
    const checkbox = this.queryModalElement<HTMLInputElement>(
      SELECTORS.autoSearchToggle,
    );
    const row = this.queryModalElement<HTMLDivElement>(
      SELECTORS.autoSearchOptionRow,
    );
    const iconWrapper = row?.querySelector(".playback-option__icon-wrapper");

    if (checkbox) {
      checkbox.checked = isEnabled;
    }
    if (row) {
      row.classList.toggle("playback-option--active", isEnabled);
      row.setAttribute("aria-pressed", isEnabled ? "true" : "false");
    }
    if (iconWrapper) {
      iconWrapper.classList.toggle("playback-option__icon-wrapper--active", isEnabled);
    }
  }

  private updateSearchSectionNote(): void {
    const note = this.queryModalElement<HTMLParagraphElement>(
      SELECTORS.searchSectionNote,
    );
    if (!note) {
      return;
    }

    const isEnabled = this.settings.autoSearchEnabled;
    note.style.background = isEnabled ? "#7F5AF0" : "#2CB67D";
    note.innerHTML = isEnabled
      ? `ℹ️ <strong>自動設定機能が有効です</strong><br>
        視聴ページを開くと、アニメタイトル・話数・エピソードタイトルから自動的にコメント数が最も多いニコニコ動画を検索して表示します。<br>
        手動で検索したい場合は、下の自動検索スイッチを無効にしてから以下のフォームをご利用ください。`
      : `🔧 <strong>手動設定モード</strong><br>
        自動検索が無効になっています。以下のフォームから動画を検索して選択してください。<br>
        自動検索を有効にするには下の自動検索スイッチを有効にしてください。`;
  }

  private setupNgControls(): void {
    // 以前のトグル制御は不要になったため、初期表示だけ反映する
    const ngWordsArea = this.queryModalElement<HTMLTextAreaElement>(
      SELECTORS.ngWords,
    );
    if (ngWordsArea) {
      ngWordsArea.classList.remove("hidden");
    }
    const ngRegexArea = this.queryModalElement<HTMLTextAreaElement>(
      SELECTORS.ngRegexps,
    );
    if (ngRegexArea) {
      ngRegexArea.classList.remove("hidden");
    }
  }

  private setupSaveButton(): void {
    const button = this.queryModalElement<HTMLButtonElement>(SELECTORS.saveButton);
    if (!button) {
      return;
    }
    button.addEventListener("click", () => this.saveSettings());
  }

  private setupSearch(): void {
    const freeInput = this.queryModalElement<HTMLInputElement>(
      SELECTORS.searchInput,
    );
    const animeTitleInput = this.queryModalElement<HTMLInputElement>(
      SELECTORS.searchAnimeTitle,
    );
    const episodeNumberInput = this.queryModalElement<HTMLInputElement>(
      SELECTORS.searchEpisodeNumber,
    );
    const episodeTitleInput = this.queryModalElement<HTMLInputElement>(
      SELECTORS.searchEpisodeTitle,
    );
    const button = this.queryModalElement<HTMLButtonElement>(
      SELECTORS.searchButton,
    );
    const openPage = this.queryModalElement<HTMLButtonElement>(
      SELECTORS.openSearchPage,
    );

    // 保存されたマニュアル検索設定を読み込んで初期値を設定
    const savedSettings = this.settingsManager.loadManualSearchSettings();
    if (savedSettings) {
      if (animeTitleInput) animeTitleInput.value = savedSettings.animeTitle;
      if (episodeNumberInput) episodeNumberInput.value = savedSettings.episodeNumber;
      if (episodeTitleInput) episodeTitleInput.value = savedSettings.episodeTitle;
    }

    const buildSearchKeyword = (): string => {
      // まず自由入力フィールドをチェック
      const freeKeyword = freeInput?.value.trim() ?? "";
      if (freeKeyword) {
        return freeKeyword;
      }

      // 構造化フィールドからキーワードを構築
      const animeTitle = animeTitleInput?.value.trim() ?? "";
      const episodeNumber = episodeNumberInput?.value.trim() ?? "";
      const episodeTitle = episodeTitleInput?.value.trim() ?? "";

      return [animeTitle, episodeNumber, episodeTitle]
        .filter(Boolean)
        .join(" ");
    };

    const saveManualSearchSettings = (): void => {
      const animeTitle = animeTitleInput?.value.trim() ?? "";
      const episodeNumber = episodeNumberInput?.value.trim() ?? "";
      const episodeTitle = episodeTitleInput?.value.trim() ?? "";

      if (animeTitle || episodeNumber) {
        this.settingsManager.saveManualSearchSettings({
          animeTitle,
          episodeNumber,
          episodeTitle,
        });
      }
    };

    const execute = async () => {
      const keyword = buildSearchKeyword();
      if (!keyword) {
        NotificationManager.show("検索キーワードを入力してください", "warning");
        return;
      }

      // マニュアル検索設定を保存
      saveManualSearchSettings();

      // 公式動画フィルタリング用のアニメタイトルを取得
      const animeTitle = animeTitleInput?.value.trim() ?? "";
      await this.executeSearch(keyword, animeTitle);
    };

    button?.addEventListener("click", execute);
    
    // 各入力フィールドでEnterキーで検索実行
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        void execute();
      }
    };
    freeInput?.addEventListener("keydown", handleEnterKey);
    animeTitleInput?.addEventListener("keydown", handleEnterKey);
    episodeNumberInput?.addEventListener("keydown", handleEnterKey);
    episodeTitleInput?.addEventListener("keydown", handleEnterKey);

    openPage?.addEventListener("click", (event) => {
      event.preventDefault();
      const keyword = buildSearchKeyword();
      const url = keyword
        ? buildNicovideoSearchUrl(keyword)
        : NICOVIDEO_URLS.searchBase;
      const globalWindow = getUnsafeWindow();
      globalWindow.open(url, "_blank", "noopener");
    });
  }

  private async executeSearch(
    keyword: string,
    animeTitle?: string,
  ): Promise<NicoSearchResultItem[]> {
    try {
      NotificationManager.show(`「${keyword}」を検索中...`, "info");
      const allResults = await this.searcher.search(keyword);
      
      // アニメタイトルが指定されている場合、公式動画のみをフィルタリング
      let results = allResults;
      if (animeTitle) {
        const officialResults = NicoVideoSearcher.filterOfficialVideos(allResults, animeTitle);
        if (officialResults.length > 0) {
          results = officialResults;
          logger.info("SettingsUI.executeSearch:officialFiltered", {
            totalResults: allResults.length,
            officialResults: officialResults.length,
            animeTitle,
          });
        } else {
          // 公式動画が見つからない場合は全結果を表示（警告付き）
          logger.warn("SettingsUI.executeSearch:noOfficialVideos", {
            totalResults: allResults.length,
            animeTitle,
          });
          NotificationManager.show(
            "公式動画が見つかりませんでした。全ての検索結果を表示しています。",
            "warning",
          );
        }
      }

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

  private setSearchKeyword(keyword: string): void {
    const input = this.queryModalElement<HTMLInputElement>(SELECTORS.searchInput);
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
    const container = this.queryModalElement<HTMLDivElement>(
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
    const similarityHtml =
      typeof item.similarity === "number"
        ? `
          <div class="similarity-container" title="類似度: ${item.similarity.toFixed(2)}%">
            <div class="similarity-bar" style="width: ${item.similarity.toFixed(2)}%;"></div>
            <span class="similarity-text">${item.similarity.toFixed(0)}%</span>
          </div>
        `
        : "";

    return `
      <div class="search-result-item">
        <img src="${item.thumbnail}" alt="thumbnail">
        <div class="search-result-info">
          <div class="title">${item.title}</div>
          <div class="stats">
            <span class="stat-icon" title="再生">
              ${svgPlay}
            </span>
            <span>${item.viewCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="コメント">
              ${svgCommentText}
            </span>
            <span>${item.commentCount.toLocaleString()}</span>
            <span style="margin: 0 8px;">/</span>
            <span class="stat-icon" title="マイリスト">
              ${svgStar}
            </span>
            <span>${item.mylistCount.toLocaleString()}</span>
            ${similarityHtml}
          </div>
          <div class="date">${postedAt}</div>
          <a href="${NICOVIDEO_URLS.watchBase}/${item.videoId}" target="_blank" rel="noopener"
             class="open-search-page-direct-btn" style="margin-top: 8px; margin-left: 8px; display: inline-block; text-decoration: none;">
            視聴ページ
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
    const ngWords = this.queryModalElement<HTMLTextAreaElement>(SELECTORS.ngWords);
    const ngRegex = this.queryModalElement<HTMLTextAreaElement>(SELECTORS.ngRegexps);

    if (ngWords) {
      ngWords.value = (this.settings.ngWords ?? []).join("\n");
    }
    if (ngRegex) {
      ngRegex.value = (this.settings.ngRegexps ?? []).join("\n");
    }
    this.updateAutoSearchToggleState();
    this.updateSearchSectionNote();
  }

  private saveSettings(): void {
    const ngWords = this.queryModalElement<HTMLTextAreaElement>(SELECTORS.ngWords);
    const ngRegex = this.queryModalElement<HTMLTextAreaElement>(SELECTORS.ngRegexps);

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

    // SettingsManagerが内部で通知を出すため、ここでは通知しない
    this.settingsManager.updateSettings(this.settings);
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

    // 背景ブラー用のアンビエント画像も更新
    const ambient = this.querySelector<HTMLDivElement>("#currentVideoAmbient");
    if (ambient && videoInfo.thumbnail) {
      ambient.style.backgroundImage = `url('${videoInfo.thumbnail}')`;
    }

    // video-cardのemptyクラスを更新
    const videoCard = this.querySelector<HTMLDivElement>(".video-card");
    if (videoCard) {
      videoCard.classList.toggle("video-card--empty", !videoInfo.videoId);
    }

    try {
      this.settingsManager.saveVideoData(videoInfo.title ?? "", videoInfo);
    } catch (error) {
      logger.error("SettingsUI.updateCurrentVideoInfo", error as Error);
    }
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

  public override destroy(): void {
    this.closeButtonElement?.removeEventListener("click", this.handleCloseClick);
    this.overlayElement?.removeEventListener("click", this.handleOverlayClick);
    this.closeButtonElement = null;
    this.overlayElement = null;
    this.modalElement = null;
    this.removeFabElement();
    super.destroy();
  }

  private createOrUpdateFab(): HTMLButtonElement | null {
    if (!document.body) {
      return null;
    }
    let host = this.fabHostElement;
    if (!host || !host.isConnected) {
      host?.remove();
      host = document.createElement("div");
      host.id = SettingsUI.FAB_HOST_ID;
      host.style.position = "fixed";
      host.style.bottom = "32px";
      host.style.right = "32px";
      host.style.zIndex = "2147483646";
      host.style.display = "inline-block";
      this.fabShadowRoot = host.attachShadow({ mode: "open" });
      document.body.appendChild(host);
      this.fabHostElement = host;
    } else if (!this.fabShadowRoot) {
      this.fabShadowRoot = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    }

    const shadow = this.fabShadowRoot;
    if (!shadow) {
      return null;
    }

    let baseStyle = shadow.querySelector<HTMLStyleElement>(
      "style[data-role='fab-base-style']",
    );
    if (!baseStyle) {
      baseStyle = document.createElement("style");
      baseStyle.dataset.role = "fab-base-style";
      baseStyle.textContent = ShadowStyleManager.getCommonStyles();
      shadow.appendChild(baseStyle);
    }

    let styleElement = shadow.querySelector<HTMLStyleElement>(
      "style[data-role='fab-style']",
    );
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.dataset.role = "fab-style";
      styleElement.textContent = `
        :host {
          all: initial;
        }

        .fab-container {
          position: relative;
          display: inline-block;
        }

        .fab-button {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7F5AF0 0%, #6E44FF 100%);
          color: #FFFFFE;
          box-shadow: 0 18px 36px rgba(36, 13, 78, 0.55);
          padding: 0;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font: inherit;
        }

        .fab-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 42px rgba(36, 13, 78, 0.6);
        }

        .fab-button:active {
          transform: scale(0.96);
        }

        .fab-button__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fab-button__icon svg {
          width: 28px;
          height: 28px;
        }

        .fab-button__label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      `;
      shadow.appendChild(styleElement);
    }

    let similarityStyle = shadow.querySelector<HTMLStyleElement>(
      "style[data-role='similarity-style']",
    );
    if (!similarityStyle) {
      similarityStyle = document.createElement("style");
      similarityStyle.dataset.role = "similarity-style";
      similarityStyle.textContent = SIMILARITY_STYLES;
      shadow.appendChild(similarityStyle);
    }

    let searchFieldsStyle = shadow.querySelector<HTMLStyleElement>(
      "style[data-role='search-fields-style']",
    );
    if (!searchFieldsStyle) {
      searchFieldsStyle = document.createElement("style");
      searchFieldsStyle.dataset.role = "search-fields-style";
      searchFieldsStyle.textContent = SEARCH_FIELDS_STYLES;
      shadow.appendChild(searchFieldsStyle);
    }

    let container = shadow.querySelector<HTMLDivElement>(".fab-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "fab-container";
      shadow.appendChild(container);
    }

    let button = container.querySelector<HTMLButtonElement>("button.fab-button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "fab-button";
      container.appendChild(button);
    }
    button.innerHTML = `
      <span class="fab-button__icon" aria-hidden="true">${svgComment}</span>
      <span class="fab-button__label">設定</span>
    `;
    button.setAttribute("aria-label", "ニコニココメント設定を開く");
    button.setAttribute("aria-haspopup", "dialog");

    let modal = container.querySelector<HTMLDivElement>(SELECTORS.settingsModal);
    if (!modal) {
      container.insertAdjacentHTML("beforeend", this.buildModalHtml());
      modal = container.querySelector<HTMLDivElement>(SELECTORS.settingsModal);
    }
    this.modalElement = modal ?? null;
    return button;
  }

  private removeFabElement(): void {
    if (this.fabElement) {
      this.fabElement.removeEventListener("click", this.handleFabClick);
    }
    if (this.fabHostElement?.isConnected) {
      this.fabHostElement.remove();
    }
    this.fabElement = null;
    this.fabHostElement = null;
    this.fabShadowRoot = null;
  }

  private queryModalElement<T extends Element>(selector: string): T | null {
    if (!this.fabShadowRoot) {
      return null;
    }
    return this.fabShadowRoot.querySelector<T>(selector);
  }

  private queryModalSelectorAll<T extends Element>(
    selector: string,
  ): NodeListOf<T> {
    if (!this.fabShadowRoot) {
      return document.createDocumentFragment()
        .childNodes as unknown as NodeListOf<T>;
    }
    return this.fabShadowRoot.querySelectorAll<T>(selector);
  }
}
