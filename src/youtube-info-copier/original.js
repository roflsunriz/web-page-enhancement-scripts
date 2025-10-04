// ==UserScript==
// @name         YouTube Info Copier
// @namespace    YouTubeInfoCopier
// @version      1.6.1
// @description  YouTube動画の情報をワンクリックでクリップボードにコピー（ハンドル式）
// @author       roflsunriz
// @match        https://www.youtube.com/*
// @match         https://youtu.be/*
// @grant        none
// @updateURL    https://gist.githubusercontent.com/roflsunriz/51f4f7854ab0eba88998c29bf096fe19/raw/youtube_info_copier.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/51f4f7854ab0eba88998c29bf096fe19/raw/youtube_info_copier.user.js
// ==/UserScript==

(function () {
  "use strict";

  // YouTubeInfoCopierクラス
  class YouTubeInfoCopier {
    constructor() {
      this.container = null;
      this.shadowRoot = null;
      this.handleElement = null;
      this.panelElement = null;
      this.popup = null;
      this.isExpanded = false;
      this.expandTimer = null;
      this.init();
    }

    // 初期化
    init() {
      this.createShadowDOM();
      this.loadMaterialIcons();
      this.setupFullscreenListener();
    }

    // ShadowDOMを作成
    createShadowDOM() {
      // コンテナ要素を作成
      this.container = document.createElement("div");
      this.container.id = "youtube-info-copier-container";
      this.container.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                left: 0px !important;
                z-index: 9999 !important;
                pointer-events: none !important;
            `;

      // ShadowDOMを作成
      this.shadowRoot = this.container.attachShadow({ mode: "closed" });

      // スタイルとコンテンツを追加
      this.shadowRoot.innerHTML = this.getTemplate();

      // document.bodyに追加
      document.body.appendChild(this.container);

      // 要素参照を取得
      this.handleElement = this.shadowRoot.querySelector(".control-handle");
      this.panelElement = this.shadowRoot.querySelector(".control-panel");
      this.popup = this.shadowRoot.querySelector(".popup");

      // イベントリスナーを設定
      this.setupEventListeners();
    }

    // Material Iconsを読み込み
    loadMaterialIcons() {
      if (!document.querySelector('link[href*="material-icons"]')) {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    }

    // テンプレートHTML
    getTemplate() {
      return `
                <style>
                    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
                    
                    .glass-control-container {
                        position: relative;
                        pointer-events: none;
                    }

                    .control-handle {
                        width: 6px;
                        height: 60px;
                        background: rgba(255, 0, 0, 0.8);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border-top-right-radius: 8px;
                        border-bottom-right-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        pointer-events: auto;
                        position: relative;
                        z-index: 10;
                        box-shadow: 2px 0 8px rgba(255, 0, 0, 0.4);
                    }

                    .control-handle:hover {
                        width: 12px;
                        background: rgba(255, 0, 0, 1.0);
                        box-shadow: 2px 0 12px rgba(255, 0, 0, 0.6);
                    }

                    .control-handle:focus {
                        outline: none;
                        box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.5);
                    }

                    .control-panel {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        min-width: 280px;
                        background: rgba(255, 255, 255, 0.08);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        border-radius: 16px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                        padding: 0;
                        overflow: hidden;
                        opacity: 0;
                        transform: translateX(-100%) scale(0.8);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        pointer-events: none;
                        z-index: 9;
                        margin-left: 12px;
                    }

                    .control-panel.expanded {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                        pointer-events: auto;
                    }

                    .panel-header {
                        background: rgba(255, 0, 0, 0.1);
                        padding: 16px 20px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .panel-header .material-icons {
                        font-size: 20px;
                        color: rgba(255, 255, 255, 0.9);
                    }

                    .panel-title {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 14px;
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.9);
                        margin: 0;
                    }

                    .panel-content {
                        padding: 12px;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .panel-button {
                        width: 100%;
                        padding: 12px 16px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.85);
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        text-align: left;
                    }

                    .panel-button:hover {
                        background: rgba(255, 255, 255, 0.1);
                        border-color: rgba(255, 255, 255, 0.2);
                        transform: translateY(-1px);
                    }

                    .panel-button:active {
                        transform: translateY(0);
                    }

                    .panel-button.primary {
                        background: rgba(255, 0, 0, 0.2);
                        border-color: rgba(255, 0, 0, 0.3);
                        color: rgba(255, 255, 255, 0.95);
                    }

                    .panel-button.primary:hover {
                        background: rgba(255, 0, 0, 0.3);
                        border-color: rgba(255, 0, 0, 0.4);
                    }

                    .panel-button .material-icons {
                        font-size: 16px;
                        color: currentColor;
                    }

                    .popup {
                        position: absolute;
                        bottom: 100%;
                        left: 0;
                        min-width: 200px;
                        max-width: 400px;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 12px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                        padding: 16px;
                        margin-bottom: 8px;
                        max-height: 300px;
                        overflow-y: auto;
                        transform: translateY(20px);
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 15;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 14px;
                        line-height: 1.4;
                        color: #333;
                        pointer-events: none;
                        margin-left: 12px;
                    }
                    
                    .popup.show {
                        transform: translateY(0);
                        opacity: 1;
                        pointer-events: auto;
                    }
                    
                    .popup-title {
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: #ff0000;
                        border-bottom: 1px solid rgba(255, 0, 0, 0.2);
                        padding-bottom: 8px;
                    }
                    
                    .popup-content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        background: rgba(245, 245, 245, 0.8);
                        padding: 8px;
                        border-radius: 8px;
                        border-left: 3px solid #ff0000;
                    }
                    
                    .popup-close {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #666;
                        font-family: 'Material Icons';
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    }
                    
                    .popup-close:hover {
                        background: rgba(0, 0, 0, 0.1);
                        color: #333;
                    }

                    /* モバイル対応 */
                    @media (max-width: 768px) {
                        .control-handle {
                            height: 50px;
                        }

                        .control-panel {
                            min-width: 240px;
                        }

                        .panel-header {
                            padding: 12px 16px;
                        }

                        .panel-content {
                            padding: 8px;
                        }

                        .panel-button {
                            padding: 10px 12px;
                            font-size: 12px;
                        }

                        .popup {
                            max-width: 280px;
                        }
                    }

                    /* 高コントラストモード対応 */
                    @media (prefers-contrast: high) {
                        .control-handle {
                            background: rgba(255, 0, 0, 0.9);
                            border: 2px solid rgba(255, 255, 255, 0.8);
                        }

                        .control-panel {
                            background: rgba(0, 0, 0, 0.9);
                            border: 2px solid rgba(255, 255, 255, 0.8);
                        }
                    }
                </style>
                
                <div class="glass-control-container">
                    <div class="control-handle" aria-label="YouTube動画情報コピー" title="YouTube動画情報" tabindex="0"></div>
                    <div class="control-panel">
                        <div class="panel-header">
                            <span class="material-icons">smart_display</span>
                            <span class="panel-title">YouTube Info</span>
                        </div>
                        <div class="panel-content">
                            <button class="panel-button primary" data-action="copy">
                                <span class="material-icons">content_copy</span>
                                動画情報をコピー
                            </button>
                            <button class="panel-button" data-action="quick-copy">
                                <span class="material-icons">flash_on</span>
                                タイトル+URLのみ
                            </button>
                        </div>
                    </div>
                    
                    <div class="popup">
                        <button class="popup-close">close</button>
                        <div class="popup-title">コピーした概要</div>
                        <div class="popup-content"></div>
                    </div>
                </div>
            `;
    }

    // イベントリスナーを設定
    setupEventListeners() {
      const popupClose = this.shadowRoot.querySelector(".popup-close");

      // ハンドルのホバーイベント
      this.handleElement.addEventListener("mouseenter", () => this.expandPanel());

      // パネルのホバーイベント
      this.panelElement.addEventListener("mouseenter", () => this.expandPanel());

      // コンテナ全体のマウスリーブイベント
      this.container.addEventListener("mouseleave", (e) => {
        // マウスがコンテナの外に出た時のみ閉じる
        if (!this.container.contains(e.relatedTarget)) {
          this.collapsePanel();
        }
      });

      // パネルボタンのクリックイベント
      const buttons = this.shadowRoot.querySelectorAll(".panel-button");
      buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleButtonClick(button.getAttribute("data-action"));
        });
      });

      // アクセシビリティ用のキーボードイベント
      this.handleElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleButtonClick("copy");
        }
      });

      // ポップアップクローズボタン
      popupClose.addEventListener("click", () => this.hidePopup());

      // ポップアップ外をクリックで閉じる
      document.addEventListener("click", (e) => {
        if (!this.container.contains(e.target)) {
          this.hidePopup();
        }
      });
    }

    // パネル展開
    expandPanel() {
      if (!this.isExpanded) {
        clearTimeout(this.expandTimer);
        this.isExpanded = true;
        this.panelElement.classList.add("expanded");
        this.container.style.pointerEvents = "auto";
      }
    }

    // パネル収縮
    collapsePanel() {
      if (this.isExpanded) {
        this.expandTimer = setTimeout(() => {
          this.isExpanded = false;
          this.panelElement.classList.remove("expanded");
          this.container.style.pointerEvents = "none";
        }, 1000);
      }
    }

    // ボタンクリック処理
    async handleButtonClick(action) {
      try {
        switch (action) {
          case "copy":
            await this.copyVideoInfo();
            break;
          case "quick-copy":
            await this.copyQuickInfo();
            break;
        }
      } catch (error) {
        console.error("[YouTubeInfoCopier] Error handling button click:", error);
      }
    }

    // クイックコピー（タイトル+URLのみ）
    async copyQuickInfo() {
      try {
        const info = await this.getVideoInfo();
        const text = `${info.title}\n${info.url}`;

        await navigator.clipboard.writeText(text);

        // 簡潔なフィードバック
        this.showSuccessFeedback("タイトル+URLをコピーしました");
      } catch (error) {
        console.error("クイックコピーエラー:", error);
        this.showErrorFeedback();
      }
    }

    // 動画情報を取得
    async getVideoInfo() {
      const info = {};

      // タイトル取得
      const titleElement =
        document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
        document.querySelector("#title h1 yt-formatted-string") ||
        document.querySelector("h1.title");
      info.title = titleElement ? titleElement.textContent.trim() : "タイトル不明";

      // 投稿者名取得（最新のYouTube構造に対応）
      const channelElement =
        document.querySelector("#owner #channel-name a") ||
        document.querySelector("ytd-channel-name a") ||
        document.querySelector(".ytd-video-owner-renderer a") ||
        document.querySelector("#upload-info #channel-name a") ||
        document.querySelector("#owner-text a");
      info.author = channelElement ? channelElement.textContent.trim() : "投稿者不明";

      // URL取得（youtu.be形式）
      const videoId =
        new URLSearchParams(window.location.search).get("v") ||
        window.location.pathname.split("/").pop(); // youtu.be形式の場合
      info.url = videoId ? `https://youtu.be/${videoId}` : window.location.href;

      // 概要欄が折りたたまれている場合、可能なら自動で展開する
      try {
        await this.expandDescriptionIfNeeded(2000);
      } catch (err) {
        // 展開に失敗しても処理は継続
        console.debug("expandDescriptionIfNeeded failed:", err);
      }

      // 概要取得（改良版：重複排除とより適切なセレクター）
      let description = "";

      // 複数の取得方法を試行（優先順位順）
      const selectors = [
        // 最新のYouTube構造（メイン）
        "#description",
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          // テキスト取得（子要素のspanがある場合は個別に取得して重複排除）
          const spans = element.querySelectorAll("span");
          if (spans.length > 0) {
            // span要素のテキストを収集し、重複排除
            const textSet = new Set();
            const orderedTexts = [];

            spans.forEach((span) => {
              const text = (span.textContent || span.innerText || "").trim();
              if (text && !textSet.has(text)) {
                textSet.add(text);
                orderedTexts.push(text);
              }
            });

            description = orderedTexts.join("").trim();
          } else {
            // span要素がない場合は直接取得
            description = (element.textContent || element.innerText || "").trim();
          }

          // 有効な概要が取得できた場合は処理を終了
          if (description && description !== "") {
            break;
          }
        }
      }

      // 概要が取得できなかった場合のフォールバック
      if (!description || description === "") {
        description = "概要取得に失敗しました";
      }

      // テキスト正規化処理
      description = description
        .replace(/\\n/g, "\n")
        .replace(/\\r\\n/g, "\n")
        .replace(/\\r/g, "\n")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\s+/g, " ") // 複数の空白を単一の空白に
        .trim();

      // 概要は展開後の全文を利用（切り詰めは行わない）
      info.description = description;
      return info;
    }

    // 概要欄が折りたたまれている場合に安全に展開する
    async expandDescriptionIfNeeded(timeoutMs = 4000) {
      const start = Date.now();

      const descriptionSelectors = [
        "#description",
        "ytd-expander#description",
        "#meta-contents #description",
        "#meta-contents",
      ];

      const descriptionEl = descriptionSelectors.map((s) => document.querySelector(s)).find(Boolean);
      if (!descriptionEl) return;

      const clickExpandButton = () => {
        // ytd-text-inline-expander を優先して探す
        const inlineExpander = descriptionEl.querySelector('ytd-text-inline-expander') || document.querySelector('ytd-text-inline-expander#description-inline-expander');

        // 既に YouTube 側で展開済みなら何もしない
        if (inlineExpander && inlineExpander.hasAttribute && inlineExpander.hasAttribute('is-expanded')) {
          return true;
        }

        const matchRegex = /(もっと見る|もっと表示|もっと読む|Show more|SHOW MORE|More|一部を表示|…|...もっと見る)/i;

        // まず inlineExpander の中にあるボタン類を探す
        if (inlineExpander) {
          const localCandidates = Array.from(inlineExpander.querySelectorAll('tp-yt-paper-button, button, a'));
          for (const el of localCandidates) {
            try {
              const txt = (el.textContent || '').trim();
              const aria = el.getAttribute && el.getAttribute('aria-expanded');
              if (aria === 'false' || matchRegex.test(txt) || (el.id && /expand|more|collapse/i.test(el.id))) {
                if (typeof el.click === 'function') {
                  el.click();
                  return true;
                }
              }
            } catch (e) {
              // ignore and continue
            }
          }
        }

        // ページ全体から候補を探す（フォールバック）
        const globalCandidates = Array.from(document.querySelectorAll('tp-yt-paper-button, button, a'));
        for (const el of globalCandidates) {
          try {
            const txt = (el.textContent || '').trim();
            const aria = el.getAttribute && el.getAttribute('aria-expanded');
            if (aria === 'false' || matchRegex.test(txt) || (el.id && /expand|more|collapse|description/i.test(el.id))) {
              if (typeof el.click === 'function') {
                el.click();
                return true;
              }
            }
          } catch (e) {
            // ignore
          }
        }

        return false;
      };

      // 既に展開済みかどうかを判定するための短いユーティリティ
      const isExpanded = () => {
        const inlineExpander = descriptionEl.querySelector('ytd-text-inline-expander') || document.querySelector('ytd-text-inline-expander#description-inline-expander');
        if (inlineExpander && inlineExpander.hasAttribute && inlineExpander.hasAttribute('is-expanded')) {
          return true;
        }
        const descText = (descriptionEl.textContent || '').trim();
        return descText.length > 200 || descriptionEl.querySelectorAll('span').length > 3;
      };

      if (isExpanded()) return;

      // 試しにボタンをクリックして展開を試みる
      const initialLength = (descriptionEl.textContent || '').length;
      const clicked = clickExpandButton();
      if (!clicked) return;

      // 展開されるまでポーリングして待つ。本文長が増えるか inlineExpander の属性変化を待つ
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const nowLen = (descriptionEl.textContent || '').length;
          if (isExpanded() || nowLen > initialLength + 20 || Date.now() - start > timeoutMs) {
            clearInterval(interval);
            resolve(undefined);
          }
        }, 80);
      });
    }

    // 日付フォーマット変換
    parseAndFormatDate(dateText) {
      try {
        // YouTubeの日付形式を解析
        const patterns = [
          /(\d{4})年(\d{1,2})月(\d{1,2})日/, // 既に日本語形式
          /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // yyyy/mm/dd
          /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // mm/dd/yyyy
        ];

        for (const pattern of patterns) {
          const match = dateText.match(pattern);
          if (match) {
            let year, month, day;
            if (pattern === patterns[0]) {
              // 既に日本語形式の場合
              return dateText;
            } else if (pattern === patterns[1]) {
              [, year, month, day] = match;
            } else if (pattern === patterns[2]) {
              [, month, day, year] = match;
            }

            return `${year}年${month.padStart(2, "0")}月${day.padStart(2, "0")}日`;
          }
        }

        // 相対日付の場合（例：「1日前」「1週間前」など）
        const now = new Date();
        if (dateText.includes("日前")) {
          const days = parseInt(dateText.match(/(\d+)日前/)?.[1] || "0");
          const date = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          return this.formatDate(date);
        } else if (dateText.includes("週間前")) {
          const weeks = parseInt(dateText.match(/(\d+)週間前/)?.[1] || "0");
          const date = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
          return this.formatDate(date);
        } else if (dateText.includes("か月前") || dateText.includes("ヶ月前")) {
          const months = parseInt(dateText.match(/(\d+)[かヶ]月前/)?.[1] || "0");
          const date = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
          return this.formatDate(date);
        } else if (dateText.includes("年前")) {
          const years = parseInt(dateText.match(/(\d+)年前/)?.[1] || "0");
          const date = new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
          return this.formatDate(date);
        }

        return dateText; // 解析できない場合は元のテキストを返す
      } catch (error) {
        console.error("日付解析エラー:", error);
        return dateText;
      }
    }

    // 日付フォーマット関数
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}年${month}月${day}日`;
    }

    // 動画情報をクリップボードにコピー
    async copyVideoInfo() {
      try {
        const info = await this.getVideoInfo();

        const text = `タイトル：${info.title}
投稿者名：${info.author}
URL：${info.url}
概要：${info.description}`;

        await navigator.clipboard.writeText(text);

        // ポップアップで概要を表示
        this.showPopup(info.description);

        // 成功時の視覚的フィードバック
        this.showSuccessFeedback("動画情報をコピーしました");
      } catch (error) {
        console.error("コピーエラー:", error);
        this.showErrorFeedback();
      }
    }

    // 成功フィードバック
    showSuccessFeedback(message = "コピーしました") {
      // ハンドルの色を緑に変更
      this.handleElement.style.background = "rgba(76, 175, 80, 0.8)";
      this.handleElement.style.boxShadow = "2px 0 12px rgba(76, 175, 80, 0.4)";

      setTimeout(() => {
        this.handleElement.style.background = "";
        this.handleElement.style.boxShadow = "";
      }, 1500);
    }

    // エラーフィードバック
    showErrorFeedback() {
      // ハンドルの色を赤に変更
      this.handleElement.style.background = "rgba(244, 67, 54, 0.8)";
      this.handleElement.style.boxShadow = "2px 0 12px rgba(244, 67, 54, 0.4)";

      setTimeout(() => {
        this.handleElement.style.background = "";
        this.handleElement.style.boxShadow = "";
      }, 1500);
    }

    // ポップアップ表示
    showPopup(description) {
      const popupContent = this.shadowRoot.querySelector(".popup-content");
      popupContent.textContent = description;
      this.popup.classList.add("show");

      // 3秒後に自動で閉じる
      setTimeout(() => {
        this.hidePopup();
      }, 3000);
    }

    // ポップアップ非表示
    hidePopup() {
      this.popup.classList.remove("show");
    }

    // 全画面状態監視を設定
    setupFullscreenListener() {
      // 全画面状態変化を監視
      const fullscreenEvents = [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "MSFullscreenChange",
      ];

      fullscreenEvents.forEach((event) => {
        document.addEventListener(event, () => this.handleFullscreenChange(), false);
      });

      // 初期状態をチェック
      this.handleFullscreenChange();
    }

    // 全画面状態変化の処理
    handleFullscreenChange() {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (isFullscreen) {
        // 全画面時は非表示
        this.container.style.display = "none";
      } else {
        // 通常時は表示
        this.container.style.display = "block";
      }
    }

    // インスタンスを破棄
    destroy() {
      try {
        clearTimeout(this.expandTimer);

        // 全画面イベントリスナーを削除
        const fullscreenEvents = [
          "fullscreenchange",
          "webkitfullscreenchange",
          "mozfullscreenchange",
          "MSFullscreenChange",
        ];
        fullscreenEvents.forEach((event) => {
          document.removeEventListener(event, this.handleFullscreenChange, false);
        });

        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.shadowRoot = null;
        this.handleElement = null;
        this.panelElement = null;
        this.popup = null;
      } catch (error) {
        console.error("[YouTubeInfoCopier] Error during cleanup:", error);
      }
    }

    // 既存のインスタンスを削除
    static removeExisting() {
      const existing = document.getElementById("youtube-info-copier-container");
      if (existing) {
        existing.remove();
      }
    }
  }

  // YouTube SPAの場合、ページ遷移を監視
  let currentUrl = window.location.href;
  let copierInstance = null;

  function initializeScript() {
    // 既存のインスタンスをクリーンアップ
    if (copierInstance && typeof copierInstance.destroy === "function") {
      copierInstance.destroy();
      copierInstance = null;
    }
    YouTubeInfoCopier.removeExisting();

    // watchページでのみコントロールパネルを作成
    if (window.location.pathname === "/watch") {
      setTimeout(() => {
        copierInstance = new YouTubeInfoCopier();
      }, 1000); // YouTubeの動的読み込みを待つ
    } else {
      // watchページ以外では明示的にnullに設定
      copierInstance = null;
    }
  }

  // 初期化（ページ読み込み時）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeScript);
  } else {
    initializeScript();
  }

  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      initializeScript();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
