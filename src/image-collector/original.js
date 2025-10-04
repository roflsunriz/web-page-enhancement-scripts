// ==UserScript==
// @name         ImageCollector2
// @namespace    imageCollector2
// @version      4.2
// @description  画像を収集して表示するユーザースクリプト
// @author       roflsunriz
// @match        *://*
// @match        *://*/*
// @connect      *
// @connect      */*
// @connect      imgur.com
// @connect      flickr.com
// @connect      pinterest.com
// @connect      deviantart.com
// @connect      artstation.com
// @connect      500px.com
// @connect      unsplash.com
// @connect      pexels.com
// @connect      pixiv.net
// @connect      tinypic.com
// @connect      postimages.org
// @connect      imgbox.com
// @connect      imagebam.com
// @connect      imagevenue.com
// @connect      imageshack.us
// @connect      photobucket.com
// @connect      freeimage.host
// @connect      ibb.co
// @connect      imgbb.com
// @connect      gyazo.com
// @connect      twitter.com
// @connect      x.com
// @connect      instagram.com
// @connect      facebook.com
// @connect      reddit.com
// @connect      tumblr.com
// @connect      weibo.com
// @connect      vk.com
// @connect      example.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @updateURL    https://gist.githubusercontent.com/roflsunriz/8f1568e1e2bfa593dee83a3e448fe93f/raw/ImageCollector2.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/8f1568e1e2bfa593dee83a3e448fe93f/raw/ImageCollector2.user.js
// ==/UserScript==

(function () {
  "use strict";

  // グローバル設定
  const CONFIG = {
    debugMode: false,    // デバッグログを表示するかどうか
    showZipButton: true, // ZIPボタンを表示するかどうか
    singleImageTest: false // 1枚だけZIPに追加するテストモード
  };

  // ログ用の関数
  function logDebug(message) {
    if (CONFIG.debugMode) {
      console.log("[ImageCollector2] " + message);
    }
  }

  function logError(message, error = null, context = {}) {
    const errorMsg = `[ImageCollector2 ERROR] ${message}`;
    console.error(errorMsg);
    if (error) {
      console.error("Error details:", error);
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
    }
    if (Object.keys(context).length > 0) {
      console.error("Context:", context);
    }
  }

  function logWarning(message, context = {}) {
    const warnMsg = `[ImageCollector2 WARNING] ${message}`;
    console.warn(warnMsg);
    if (Object.keys(context).length > 0) {
      console.warn("Context:", context);
    }
  }

  // 初期化処理
  function initialize() {
    // fflateが読み込まれているかチェック
    if (typeof fflate === "undefined") {
      logWarning("fflateライブラリが読み込まれていません。ZIPダウンロード機能が制限されます。");
      // フォールバック: fflateを動的に読み込む
      const fflateScript = document.createElement("script");
      fflateScript.src = "https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js";
      fflateScript.onload = function () {
        logDebug("fflateライブラリを動的に読み込みました。");
        initializeComponents();
      };
      fflateScript.onerror = function (error) {
        logError("fflateライブラリの動的読み込みに失敗しました。ZIPダウンロード機能は使用できません。", error);
        // fflateなしでも他の機能は使えるようにする
        initializeComponents();
      };
      document.head.appendChild(fflateScript);
    } else {
      logDebug("fflateライブラリは正常に読み込まれています。");
      initializeComponents();
    }
  }

  // コンポーネントの初期化
  function initializeComponents() {
    try {
      const badImageHandler = new BadImageHandler();
      const uiBuilder = new UIBuilder(badImageHandler);
      
      // モーダルをビルドしてからイベントハンドラを設定
      uiBuilder.buildModal();
      
      // DOM構築完了を確実にするため、次のフレームでイベントハンドラを初期化
      requestAnimationFrame(() => {
        try {
          const uiBatchUpdater = new UIBatchUpdater(uiBuilder, badImageHandler);
          const progressBar = new ProgressBar();
          const toast = new Toast();
          const zipDownloader = new ZipDownloader(uiBuilder, badImageHandler, toast, progressBar);
          const uiEventHandler = new UIEventHandler(uiBuilder, zipDownloader);
          const imageCollectorMain = new ImageCollectorMain(
            uiBatchUpdater,
            badImageHandler,
            progressBar,
            toast
          );
          const menuRegister = new MenuRegister(uiBuilder, imageCollectorMain);

          // デバッグ設定コマンドを追加（UIBuilderインスタンスを渡す）
          addConfigCommands(uiBuilder);

          // デバッグ用にunsafeWindowにクラスを露出
          unsafeWindow.ImageCollector2 = {
            MenuRegister,
            UIBuilder,
            UIBatchUpdater,
            UIEventHandler,
            ImageCollectorMain,
            BadImageHandler,
            ImageSourceClassifier,
            Toast,
            ProgressBar,
            RequestBatchLimiter,
            ImageHostManager,
            ZipDownloader,
            zipDownloaderInstance: zipDownloader,
            uiBuilderInstance: uiBuilder,
            config: CONFIG
          };

          (function ensureMaterialIcons() {
            if (document.head.querySelector('link[data-ic-material-icons]')) return;
          
            const link = document.createElement('link');
            link.rel  = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            link.dataset.icMaterialIcons = 'true';   // 二重挿入防止
            document.head.appendChild(link);
          })();
          
          
          logDebug("コンポーネントの初期化が完了しました");
        } catch (error) {
          logError("遅延初期化中にエラーが発生しました", error);
          throw error;
        }
      });
    } catch (error) {
      logError("コンポーネントの初期化中にエラーが発生しました", error);
      throw error; // 初期化エラーは致命的なので再スロー
    }
  }

  // 設定変更コマンドを追加
  function addConfigCommands(uiBuilder) {
    // デバッグモード切り替え
    unsafeWindow.setImageCollectorDebug = function(value) {
      CONFIG.debugMode = !!value;
      console.log(`[ImageCollector2] デバッグモード: ${CONFIG.debugMode ? 'オン' : 'オフ'}`);
      return CONFIG.debugMode;
    };

    // ZIPボタン表示/非表示切り替え
    unsafeWindow.setImageCollectorZipButton = function(value) {
      CONFIG.showZipButton = !!value;
      console.log(`[ImageCollector2] ZIPボタン: ${CONFIG.showZipButton ? '表示' : '非表示'}`);
      
      // UIBuilderインスタンスを使ってシャドウDOM内のZIPボタンにアクセス
      if (uiBuilder) {
        uiBuilder.setZipButtonVisibility(CONFIG.showZipButton);
      }
      return CONFIG.showZipButton;
    };

    // 単一画像テストモード切り替え
    unsafeWindow.setSingleImageTest = function(value) {
      CONFIG.singleImageTest = !!value;
      console.log(`[ImageCollector2] 単一画像テストモード: ${CONFIG.singleImageTest ? 'オン' : 'オフ'}`);
      return CONFIG.singleImageTest;
    };
  }

  // クラス定義の後に初期化処理を実行
  class MenuRegister {
    constructor(uiBuilder, imageCollectorMain) {
      this.uiBuilder = uiBuilder;
      this.imageCollectorMain = imageCollectorMain;
      this.registerMenu();
    }

    registerMenu() {
      GM_registerMenuCommand("🚀起動", () => {
        this.uiBuilder.showModal();
        this.imageCollectorMain.collectImages();
      });
    }
  }

  class UIBuilder {
    constructor(badImageHandler) {
      this.modal = null;
      this.gridContainer = null;
      this.closeButton = null;
      this.zipButton = null;
      this.badImageHandler = badImageHandler;
      this.imageData = new Map(); // 画像のデータを保存するためのMap
      this.shadowHost = null;
      this.shadowRoot = null;
    }

    buildModal() {
      try {
        // シャドウDOMホストを作成
        this.shadowHost = document.createElement("div");
        this.shadowHost.id = "image-collector-shadow-host";
        
        // シャドウルートを作成（closed modeで外部からのアクセスを防ぐ）
        this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
        
        // シャドウDOM内にスタイルを注入
        this.injectShadowStyles();

        // モーダルのベースを作成（シャドウDOM内）
        this.modal = document.createElement("div");
        this.modal.classList.add("image-collector-modal");

        // グリッドコンテナを作成
        this.gridContainer = document.createElement("div");
        this.gridContainer.classList.add("ic","image-grid-container");
        this.modal.appendChild(this.gridContainer);

        // ZIPダウンロードボタンを作成
        this.zipButton = document.createElement("button");
        this.zipButton.classList.add("ic","zip-download-button");
        this.zipButton.innerHTML = '<span class="ic material-icons">download</span>';
        this.zipButton.setAttribute("data-state", "initial");
        // 設定に基づいて表示/非表示を設定
        this.zipButton.style.display = CONFIG.showZipButton ? 'flex' : 'none';
        this.modal.appendChild(this.zipButton);

        // 閉じるボタンを作成
        this.closeButton = document.createElement("button");
        this.closeButton.classList.add("ic","close-button");
        this.closeButton.textContent = "×";
        this.modal.appendChild(this.closeButton);

        // シャドウDOM内に追加
        this.shadowRoot.appendChild(this.modal);
        
        // シャドウホストをドキュメントに追加
        document.body.appendChild(this.shadowHost);
        
        logDebug("モーダルの構築が完了しました");
      } catch (error) {
        logError("モーダルの構築中にエラーが発生しました", error);
        throw error; // UI構築エラーは致命的
      }
    }

    injectShadowStyles() {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
                .image-collector-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: none;
                    z-index: 9999;
                    backdrop-filter: blur(10px);
                    overflow-y: auto;
                }

                .ic.image-grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 15px;
                    padding: 20px;
                    max-width: 90%;
                    margin: 0 auto;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    backdrop-filter: blur(5px);
                    margin-top: 50px;
                }

                .ic.image-item {
                    position: relative;
                    overflow: hidden;
                    border-radius: 10px;
                    background-color: rgba(255, 255, 255, 0.2);
                    transition: transform 0.3s ease;
                }

                .ic.image-item:hover {
                    transform: scale(1.05);
                }

                .ic.grid-image {
                    width: 100%;
                    height: auto;
                    display: block;
                    opacity: 0.9;
                    transition: opacity 0.3s ease;
                }

                .ic.grid-image:hover {
                    opacity: 1;
                }

                .ic.close-button {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    z-index: 10000;
                    transition: color 0.3s ease;
                }

                .ic.close-button:hover {
                    color: #ff4444;
                }

                .ic.zip-download-button {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background-color: rgba(0, 123, 255, 0.2);
                    border: 2px solid rgba(0, 123, 255, 0.4);
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10000;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
                }

                .ic.zip-download-button:hover {
                    background-color: rgba(0, 123, 255, 0.4);
                    transform: scale(1.1);
                }
                
                .ic.zip-download-button[data-state="processing"] {
                    background-color: rgba(255, 193, 7, 0.2);
                    border-color: rgba(255, 193, 7, 0.4);
                    animation: pulse 1.5s infinite;
                }
                
                .ic.zip-download-button[data-state="ready"] {
                    background-color: rgba(40, 167, 69, 0.2);
                    border-color: rgba(40, 167, 69, 0.4);
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
                    }
                    70% {
                        box-shadow: 0 0 0 15px rgba(255, 193, 7, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
                    }
                }
                
                /* マテリアルアイコン */
                .ic.material-icons {
                    font-family: 'Material Icons';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-feature-settings: 'liga';
                    font-feature-settings: 'liga';
                    -webkit-font-smoothing: antialiased;
                }
                
                @font-face {
                    font-family: 'Material Icons';
                    font-style: normal;
                    font-weight: 400;
                    src: url(https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
                }

                .ic.image-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                }

                .ic.size-info {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 10px;
                }

                .ic.load-button {
                    background-color: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 5px;
                    padding: 8px 16px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .ic.load-button:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .ic.full-screen-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 10002;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .ic.full-screen-image {
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                }

                .ic.download-button {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 5px;
                    padding: 8px 16px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .ic.download-button:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .ic.full-screen-close-button {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    z-index: 10003;
                    transition: color 0.3s ease;
                }

                .ic.full-screen-close-button:hover {
                    color: #ff4444;
                }

                .ic.original-link-button {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 5px;
                    padding: 8px 16px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .ic.original-link-button:hover {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .ic.file-name-display {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-size: 1.2rem;
                    background-color: rgba(0, 0, 0, 0.7);
                    padding: 8px 16px;
                    border-radius: 4px;
                    z-index: 10003;
                }
            `;
      this.shadowRoot.appendChild(styleElement);
    }

    createImageItem(imageUrl, metadata) {
      try {
        const imageItem = document.createElement("div");
        imageItem.classList.add("ic","image-item");

        if (!metadata) {
          logError("画像のメタデータが見つかりません", null, { imageUrl });
          return imageItem;
        }

        // 画像データをMapに保存
        this.imageData.set(imageUrl, {
          metadata: metadata,
          blob: null, // 後でダウンロードした際にBlobを保存する
        });

        if (metadata.size > this.badImageHandler.maxFileSize) {
          const placeholder = this.badImageHandler.createPlaceholder(imageUrl, metadata);
          imageItem.appendChild(placeholder);
        } else {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.alt = "Collected Image";
          img.classList.add("ic","grid-image");
          
          // 画像読み込みエラーのハンドリング
          img.onerror = () => {
            logWarning("画像の読み込みに失敗しました", { imageUrl });
            // エラー時はプレースホルダーに置き換え
            const errorPlaceholder = this.badImageHandler.createErrorPlaceholder(imageUrl);
            imageItem.replaceChild(errorPlaceholder, img);
          };
          
          imageItem.appendChild(img);
        }

        return imageItem;
      } catch (error) {
        logError("画像アイテムの作成中にエラーが発生しました", error, { imageUrl });
        // エラー時は空のアイテムを返す
        const errorItem = document.createElement("div");
        errorItem.classList.add("ic","image-item");
        return errorItem;
      }
    }

    addImageToGrid(imageUrl, metadata) {
      const imageItem = this.createImageItem(imageUrl, metadata);
      this.gridContainer.appendChild(imageItem);
    }

    showModal() {
      this.modal.style.display = "block";
    }

    hideModal() {
      this.gridContainer.innerHTML = ""; // グリッドコンテナの中身をクリア
      this.modal.style.display = "none";
    }

    // ZIPボタンの表示/非表示を制御するメソッド
    setZipButtonVisibility(visible) {
      if (this.zipButton) {
        this.zipButton.style.display = visible ? 'flex' : 'none';
      }
    }
  }



  class UIBatchUpdater {
    constructor(uiBuilder, badImageHandler) {
      this.uiBuilder = uiBuilder;
      this.badImageHandler = badImageHandler;
      this.imageQueue = [];
      this.isProcessing = false;
    }

    // 高速パス用の画像追加メソッド
    async addImagesFastPath(imageItems) {
      try {
        if (!Array.isArray(imageItems)) {
          logError("imageItemsが配列ではありません", null, { imageItems: typeof imageItems });
          return;
        }

        let successCount = 0;
        let failureCount = 0;

        for (const item of imageItems) {
          try {
            const { url, classification } = item;
            let metadata;

            // DOM要素からメタデータを取得できる場合
            if (classification.element && classification.element.tagName === 'IMG') {
              const elementMetadata = classification.element.naturalWidth > 0 ? {
                width: classification.element.naturalWidth,
                height: classification.element.naturalHeight,
                size: 0 // ファイルサイズは不明
              } : null;

              if (elementMetadata && elementMetadata.width > 0 && elementMetadata.height > 0) {
                metadata = elementMetadata;
                logDebug(`DOM要素からメタデータ取得: ${url.substring(0, 50)}... (${metadata.width}x${metadata.height})`);
              }
            }

            // DOM要素からメタデータが取得できない場合は最小限のチェック
            if (!metadata) {
              metadata = await this.badImageHandler.getImageMetadata(url);
              if (!metadata) {
                logWarning("高速パスでもメタデータ取得に失敗しました", { url });
                failureCount++;
                continue;
              }
            }

            this.imageQueue.push({ url, metadata });
            successCount++;
          } catch (error) {
            logError("高速パス画像処理中にエラーが発生しました", error, { url: item.url });
            failureCount++;
          }
        }

        logDebug(`高速パス処理完了: 成功=${successCount}, 失敗=${failureCount}`);

        if (!this.isProcessing) {
          this.processBatch();
        }
      } catch (error) {
        logError("高速パス画像追加処理中に予期しないエラーが発生しました", error, { imageItemsLength: imageItems?.length });
      }
    }

    async addImages(imageUrls) {
      try {
        if (!Array.isArray(imageUrls)) {
          logError("imageUrlsが配列ではありません", null, { imageUrls: typeof imageUrls });
          return;
        }

        let successCount = 0;
        let failureCount = 0;

        for (const url of imageUrls) {
          try {
            const metadata = await this.badImageHandler.getImageMetadata(url);
            if (!metadata) {
              logWarning("画像のメタデータ取得に失敗しました", { url });
              failureCount++;
              continue;
            }
            this.imageQueue.push({ url, metadata });
            successCount++;
          } catch (error) {
            logError("画像メタデータの取得中にエラーが発生しました", error, { url });
            failureCount++;
          }
        }

        logDebug(`画像追加処理完了: 成功=${successCount}, 失敗=${failureCount}`);

        if (!this.isProcessing) {
          this.processBatch();
        }
      } catch (error) {
        logError("画像追加処理中に予期しないエラーが発生しました", error, { imageUrlsLength: imageUrls?.length });
      }
    }

    processBatch() {
      try {
        this.isProcessing = true;
        const batchSize = 5; // 一度に追加する画像の数を減らす
        
        const processNext = () => {
          try {
            const imagesToAdd = this.imageQueue.splice(0, batchSize);
            imagesToAdd.forEach(({ url, metadata }) => {
              try {
                this.uiBuilder.addImageToGrid(url, metadata);
              } catch (error) {
                logError("グリッドへの画像追加中にエラーが発生しました", error, { url });
              }
            });

            if (this.imageQueue.length > 0) {
              requestAnimationFrame(processNext);
            } else {
              this.isProcessing = false;
              logDebug("バッチ処理が完了しました");
            }
          } catch (error) {
            logError("バッチ処理中にエラーが発生しました", error);
            this.isProcessing = false;
          }
        };

        requestAnimationFrame(processNext);
      } catch (error) {
        logError("バッチ処理の開始中にエラーが発生しました", error);
        this.isProcessing = false;
      }
    }
  }

  class UIEventHandler {
    constructor(uiBuilder, zipDownloader) {
      this.uiBuilder = uiBuilder;
      this.zipDownloader = zipDownloader;
      this.setupEventHandlers();
    }

    setupEventHandlers() {
      try {
        // モーダル欄外クリックで閉じる
        this.uiBuilder.modal.addEventListener("click", (e) => {
          try {
            if (e.target === this.uiBuilder.modal) {
              this.uiBuilder.hideModal();
            }
          } catch (error) {
            logError("モーダルクリックイベント処理中にエラーが発生しました", error);
          }
        });

        // 閉じるボタン
        this.uiBuilder.closeButton.addEventListener("click", () => {
          try {
            this.uiBuilder.hideModal();
          } catch (error) {
            logError("閉じるボタンクリック処理中にエラーが発生しました", error);
          }
        });

        // ZIPダウンロードボタン
        this.uiBuilder.zipButton.addEventListener("click", () => {
          try {
            const state = this.uiBuilder.zipButton.getAttribute("data-state");

            if (state === "initial") {
              // 準備開始
              this.zipDownloader.prepareZip();
            } else if (state === "ready") {
              // ダウンロード開始
              this.zipDownloader.downloadZip();
            }
          } catch (error) {
            logError("ZIPボタンクリック処理中にエラーが発生しました", error);
          }
        });

        // グリッド内の画像クリックで全画面表示
        this.uiBuilder.gridContainer.addEventListener("click", (e) => {
          try {
            const img = e.target.closest(".ic.grid-image");
            if (img) {
              const imageUrl = img.src;
              const originalUrl = img.dataset.originalUrl || imageUrl; // 元リンクを取得
              this.showFullScreenImage(imageUrl, originalUrl);
            }
          } catch (error) {
            logError("画像クリック処理中にエラーが発生しました", error);
          }
        });
        
        logDebug("イベントハンドラーの設定が完了しました");
      } catch (error) {
        logError("イベントハンドラーの設定中にエラーが発生しました", error);
        throw error; // イベントハンドラー設定エラーは致命的
      }
    }

    showFullScreenImage(imageUrl, originalUrl) {
      // フルスクリーン用のシャドウDOMホストを作成
      const fullScreenShadowHost = document.createElement("div");
      fullScreenShadowHost.id = "fullscreen-shadow-host";
      
      // シャドウルートを作成
      const fullScreenShadowRoot = fullScreenShadowHost.attachShadow({ mode: 'closed' });
      
      // フルスクリーン用のスタイルを注入
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ic.full-screen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 10002;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ic.full-screen-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .ic.download-button {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 5px;
          padding: 8px 16px;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .ic.download-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .ic.full-screen-close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10003;
          transition: color 0.3s ease;
        }

        .ic.full-screen-close-button:hover {
          color: #ff4444;
        }

        .ic.original-link-button {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 5px;
          padding: 8px 16px;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .ic.original-link-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .ic.file-name-display {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 1.2rem;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 8px 16px;
          border-radius: 4px;
          z-index: 10003;
        }
      `;
      fullScreenShadowRoot.appendChild(styleElement);

      const fullScreenContainer = document.createElement("div");
      fullScreenContainer.classList.add("ic","full-screen-container");

      // ファイル名を取得
      const fileName = imageUrl.split("/").pop();

      // ファイル名表示用の要素を作成
      const fileNameDisplay = document.createElement("div");
      fileNameDisplay.classList.add("ic","file-name-display");
      fileNameDisplay.textContent = fileName;

      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("ic","full-screen-image");

      // ダウンロードボタン
      const downloadButton = document.createElement("button");
      downloadButton.textContent = "ダウンロード";
      downloadButton.classList.add("ic","download-button");
      downloadButton.addEventListener("click", () => {
        this.downloadImage(imageUrl);
      });

      // 元リンクボタン
      const originalLinkButton = document.createElement("button");
      originalLinkButton.textContent = "元リンク";
      originalLinkButton.classList.add("ic","original-link-button");
      originalLinkButton.addEventListener("click", () => {
        window.open(originalUrl, "_blank");
      });

      // 閉じるボタン
      const closeButton = document.createElement("button");
      closeButton.textContent = "×";
      closeButton.classList.add("ic","full-screen-close-button");
      closeButton.addEventListener("click", () => {
        try {
          document.body.removeChild(fullScreenShadowHost);
        } catch (error) {
          logError("フルスクリーンモーダルの閉じるボタンでエラーが発生しました", error);
        }
      });

      // 欄外クリックでモーダルに戻る
      fullScreenContainer.addEventListener("click", (e) => {
        if (e.target === fullScreenContainer) {
          try {
            document.body.removeChild(fullScreenShadowHost);
          } catch (error) {
            logError("フルスクリーンモーダルの削除中にエラーが発生しました", error);
          }
        }
      });

      fullScreenContainer.appendChild(fileNameDisplay);
      fullScreenContainer.appendChild(img);
      fullScreenContainer.appendChild(downloadButton);
      fullScreenContainer.appendChild(originalLinkButton);
      fullScreenContainer.appendChild(closeButton);
      
      // シャドウDOM内に追加
      fullScreenShadowRoot.appendChild(fullScreenContainer);
      
      // シャドウホストをドキュメントに追加
      document.body.appendChild(fullScreenShadowHost);
    }

    downloadImage(imageUrl) {
      try {
        // 画像を直接ダウンロードするためのリクエスト
        GM_xmlhttpRequest({
          method: "GET",
          url: imageUrl,
          responseType: "blob",
          onload: function (response) {
            try {
              const blob = response.response;
              if (!blob) {
                logError("ダウンロードしたBlobが空です", null, { imageUrl });
                return;
              }
              
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = imageUrl.split("/").pop();
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);
              
              logDebug("画像のダウンロードが完了しました");
            } catch (error) {
              logError("ダウンロード処理中にエラーが発生しました", error, { imageUrl });
            }
          },
          onerror: function (error) {
            logError("画像のダウンロードに失敗しました", error, { imageUrl });
          },
          onabort: function () {
            logWarning("画像のダウンロードが中断されました", { imageUrl });
          },
          ontimeout: function () {
            logWarning("画像のダウンロードがタイムアウトしました", { imageUrl });
          }
        });
      } catch (error) {
        logError("ダウンロード要求の作成中にエラーが発生しました", error, { imageUrl });
      }
    }
  }

  class ImageHostManager {
    constructor() {
      this.hostPatterns = [
        // 一般的なイメージホスト
        /(?:https?:\/\/)?(?:www\.)?imgur\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?flickr\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?pinterest\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?deviantart\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?artstation\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?500px\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?unsplash\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?pexels\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?pixiv\.net\//i,
        /(?:https?:\/\/)?(?:www\.)?tinypic\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?postimages\.org\//i,
        /(?:https?:\/\/)?(?:www\.)?imgbox\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?imagebam\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?imagevenue\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?imageshack\.us\//i,
        /(?:https?:\/\/)?(?:www\.)?photobucket\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?freeimage\.host\//i,
        /(?:https?:\/\/)?(?:www\.)?ibb\.co\//i,
        /(?:https?:\/\/)?(?:www\.)?imgbb\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?gyazo\.com\//i,
        // SNS
        /(?:https?:\/\/)?(?:www\.)?twitter\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?x\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?instagram\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?facebook\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?reddit\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?tumblr\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?weibo\.com\//i,
        /(?:https?:\/\/)?(?:www\.)?vk\.com\//i,
        // その他
        /(?:https?:\/\/)?(?:www\.)?example\.com\//i,
      ];
    }

    isSupportedHost(url) {
      return this.hostPatterns.some((pattern) => pattern.test(url));
    }

    addHostPattern(pattern) {
      this.hostPatterns.push(new RegExp(pattern, "i"));
    }
  }

  class ImageSourceClassifier {
    constructor() {
      this.trustedDomains = new Set([
        window.location.hostname,
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
      ]);
    }

    classifyImageSource(url, sourceElement = null) {
      try {
        const urlObj = new URL(url, window.location.href);
        
        // 同一ドメインの画像は信頼できる
        if (urlObj.hostname === window.location.hostname) {
          return {
            trustLevel: 'high',
            reason: 'same-domain',
            fastPath: true,
            element: sourceElement
          };
        }

        // 信頼できるCDNドメイン
        if (this.trustedDomains.has(urlObj.hostname)) {
          return {
            trustLevel: 'high',
            reason: 'trusted-cdn',
            fastPath: true,
            element: sourceElement
          };
        }

        // DOM要素から直接取得した画像（既に表示されている）
        if (sourceElement && (sourceElement.tagName === 'IMG' || sourceElement.tagName === 'SOURCE')) {
          // 画像が既に読み込まれているかチェック
          if (sourceElement.tagName === 'IMG' && sourceElement.complete && sourceElement.naturalWidth > 0) {
            return {
              trustLevel: 'medium',
              reason: 'loaded-dom-element',
              fastPath: true,
              element: sourceElement
            };
          }
        }

        // HTTPSの画像は中程度の信頼度
        if (urlObj.protocol === 'https:') {
          return {
            trustLevel: 'medium',
            reason: 'https-external',
            fastPath: false,
            element: sourceElement
          };
        }

        // その他は低信頼度
        return {
          trustLevel: 'low',
          reason: 'untrusted-source',
          fastPath: false,
          element: sourceElement
        };
      } catch (error) {
        logError("画像ソース分類中にエラーが発生しました", error, { url });
        return {
          trustLevel: 'low',
          reason: 'classification-error',
          fastPath: false,
          element: sourceElement
        };
      }
    }

    getMetadataFromElement(element) {
      try {
        if (element.tagName === 'IMG') {
          return {
            width: element.naturalWidth || element.width || 0,
            height: element.naturalHeight || element.height || 0,
            size: 0, // DOM要素からはファイルサイズは取得できない
            loaded: element.complete
          };
        }
        return null;
      } catch (error) {
        logError("DOM要素からのメタデータ取得中にエラーが発生しました", error);
        return null;
      }
    }
  }

  class ImageCollectorMain {
    constructor(uiBatchUpdater, badImageHandler, progressBar, toast) {
      this.uiBatchUpdater = uiBatchUpdater;
      this.badImageHandler = badImageHandler;
      this.progressBar = progressBar;
      this.toast = toast;
      this.requestLimiter = new RequestBatchLimiter();
      this.imageHostManager = new ImageHostManager();
      this.imageSourceClassifier = new ImageSourceClassifier();
    }

    async collectImages() {
      try {
        // トーストとプログレスバーを同時に表示
        this.toast.show("画像収集を開始します...", "info");
        this.progressBar.show();
        this.progressBar.update(0); // 初期値を0%に設定

        const imageData = new Map(); // URL -> {element, classification} のマップ
        const fastPathImages = [];
        const slowPathImages = [];

        try {
          // img要素から収集（DOM要素も保存）
          document.querySelectorAll("img").forEach((img) => {
            try {
              const src = this.resolveUrl(img.src);
              if (src) {
                const classification = this.imageSourceClassifier.classifyImageSource(src, img);
                imageData.set(src, { element: img, classification });
                
                if (classification.fastPath) {
                  fastPathImages.push({ url: src, classification });
                  logDebug(`高速パス: ${src.substring(0, 50)}... (${classification.reason})`);
                } else {
                  slowPathImages.push(src);
                  logDebug(`低速パス: ${src.substring(0, 50)}... (${classification.reason})`);
                }
              }
            } catch (error) {
              logWarning("img要素の処理中にエラーが発生しました", { src: img.src });
            }
          });

          // picture要素から収集
          document.querySelectorAll("picture source").forEach((source) => {
            try {
              const srcset = source.srcset.split(",").map((s) => s.trim().split(" ")[0]);
              srcset.forEach((src) => {
                try {
                  const resolvedSrc = this.resolveUrl(src);
                  if (resolvedSrc && !imageData.has(resolvedSrc)) {
                    const classification = this.imageSourceClassifier.classifyImageSource(resolvedSrc, source);
                    imageData.set(resolvedSrc, { element: source, classification });
                    
                    if (classification.fastPath) {
                      fastPathImages.push({ url: resolvedSrc, classification });
                      logDebug(`高速パス(picture): ${resolvedSrc.substring(0, 50)}... (${classification.reason})`);
                    } else {
                      slowPathImages.push(resolvedSrc);
                      logDebug(`低速パス(picture): ${resolvedSrc.substring(0, 50)}... (${classification.reason})`);
                    }
                  }
                } catch (error) {
                  logWarning("srcsetの処理中にエラーが発生しました", { src });
                }
              });
            } catch (error) {
              logWarning("picture要素の処理中にエラーが発生しました", { srcset: source.srcset });
            }
          });

          // a要素から収集
          document.querySelectorAll("a").forEach((a) => {
            try {
              const href = this.resolveUrl(a.href);
              if (this.isImageUrl(href) && !imageData.has(href)) {
                const classification = this.imageSourceClassifier.classifyImageSource(href);
                imageData.set(href, { element: null, classification });
                
                // a要素の画像は基本的に低速パス
                slowPathImages.push(href);
                logDebug(`低速パス(link): ${href.substring(0, 50)}... (${classification.reason})`);
              }
            } catch (error) {
              logWarning("a要素の処理中にエラーが発生しました", { href: a.href });
            }
          });

          // 背景画像から収集
          document.querySelectorAll("*").forEach((element) => {
            try {
              const bgImage = window.getComputedStyle(element).backgroundImage;
              if (bgImage && bgImage !== "none") {
                const url = bgImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
                const resolvedUrl = this.resolveUrl(url);
                if (resolvedUrl && !imageData.has(resolvedUrl)) {
                  const classification = this.imageSourceClassifier.classifyImageSource(resolvedUrl);
                  imageData.set(resolvedUrl, { element: null, classification });
                  
                  // 背景画像は基本的に低速パス
                  slowPathImages.push(resolvedUrl);
                  logDebug(`低速パス(bg): ${resolvedUrl.substring(0, 50)}... (${classification.reason})`);
                }
              }
            } catch (error) {
              logWarning("背景画像の処理中にエラーが発生しました", { element: element.tagName });
            }
          });
        } catch (error) {
          logError("DOM要素からの画像収集中にエラーが発生しました", error);
        }

        logDebug(`画像分類完了: 高速パス=${fastPathImages.length}, 低速パス=${slowPathImages.length}`);
        this.toast.show(`画像を分類しました: 高速=${fastPathImages.length}, 通常=${slowPathImages.length}`, "info");

        // 高速パスの画像を先に処理
        if (fastPathImages.length > 0) {
          this.toast.show("信頼できる画像を高速処理中...", "info");
          await this.uiBatchUpdater.addImagesFastPath(fastPathImages);
          this.progressBar.update(30); // 高速パス完了で30%
        }

        // 低速パスの画像を処理
        if (slowPathImages.length > 0) {
          this.toast.show("外部画像を検証中...", "info");
          
          // SNSとイメージホストの特別処理
          try {
            for (const url of slowPathImages) {
              try {
                if (this.imageHostManager.isSupportedHost(url)) {
                  const resolvedUrl = await this.getSnsImageUrl(url);
                  if (resolvedUrl && resolvedUrl !== url) {
                    slowPathImages.push(resolvedUrl);
                  }
                }
              } catch (error) {
                logWarning("SNS画像URL解決中にエラーが発生しました", { url });
              }
            }
          } catch (error) {
            logError("SNS画像処理中にエラーが発生しました", error);
          }

          // 不適切な画像を除去
          let filteredUrls = [];
          try {
            const validationResults = await Promise.allSettled(
              slowPathImages.map(async (url) => {
                try {
                  const isValid = await this.badImageHandler.isValidImage(url);
                  return isValid ? url : null;
                } catch (error) {
                  logWarning("画像検証中にエラーが発生しました", { url });
                  return null;
                }
              })
            );

            filteredUrls = validationResults
              .filter(result => result.status === 'fulfilled' && result.value !== null)
              .map(result => result.value);

            const rejectedCount = validationResults.filter(result => result.status === 'rejected').length;
            if (rejectedCount > 0) {
              logWarning(`${rejectedCount}個の画像検証でエラーが発生しました`);
            }
          } catch (error) {
            logError("画像フィルタリング中にエラーが発生しました", error);
            filteredUrls = slowPathImages;
          }

          this.progressBar.update(60); // 検証完了で60%

          // 低速パスの画像を追加
          if (filteredUrls.length > 0) {
            await this.uiBatchUpdater.addImages(filteredUrls);
          }
        }

        const totalImages = fastPathImages.length + slowPathImages.length;
        
        if (totalImages === 0) {
          logWarning("処理対象の画像が0件です");
          this.progressBar.hide();
          this.toast.show("処理対象の画像が見つかりませんでした", "warning");
          return;
        }

        // 処理完了
        this.progressBar.update(100);
        setTimeout(() => {
          this.progressBar.hide();
          this.toast.show(`${totalImages}枚の画像を収集しました！(高速:${fastPathImages.length}, 通常:${slowPathImages.length})`, "success");
          logDebug(`画像収集完了: 合計${totalImages}枚 (高速:${fastPathImages.length}, 通常:${slowPathImages.length})`);
        }, 500);

      } catch (error) {
        logError("画像収集処理中に予期しないエラーが発生しました", error);
        this.toast.show("画像収集中に予期しないエラーが発生しました", "error");
        this.progressBar.hide();
      }
    }

    resolveUrl(url) {
      try {
        // リダイレクトURLの処理
        if (url.includes("?http")) {
          const redirectUrl = url.split("?http")[1];
          if (redirectUrl) {
            return new URL(`http${redirectUrl}`).href;
          }
        }
        return new URL(url, window.location.href).href;
      } catch (e) {
        return null;
      }
    }

    isImageUrl(url) {
      if (!url) return false;
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    }

    async getSnsImageUrl(url) {
      // TwitterのURL処理
      if (url.includes("twitter.com")) {
        try {
          const response = await GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, "text/html");
              const metaImage = doc.querySelector('meta[property="og:image"]');
              if (metaImage) {
                return metaImage.content;
              }
              return null;
            },
          });
          return response;
        } catch (error) {
          console.error("Twitter image fetch error:", error);
          return null;
        }
      }
      // 他のSNSも同様に処理
      return url;
    }
  }

  class BadImageHandler {
    constructor() {
      this.minSize = 50; // 最小幅・高さ（px）
      this.maxSize = 5000; // 最大幅・高さ（px）
      this.maxFileSize = 5 * 1024 * 1024; // 最大ファイルサイズ（5MB）

      // 削除済み画像のサイズパターン
      this.deletedImageSizes = [
        { width: 320, height: 320 }, // postimage.cc
        { width: 161, height: 81 }, // imgur.com
      ];
    }

    async isValidImage(url) {
      if (!url) return false;

      // URLが画像ファイルかどうかを確認
      if (!this.isImageUrl(url)) return false;

      // 画像のメタデータを取得
      try {
        const metadata = await this.getImageMetadata(url);
        if (!metadata) return false;

        // 削除済み画像かどうかをチェック
        if (this.isDeletedImage(metadata)) {
          return false;
        }

        // ファイル名を取得
        const fileName = url.split("/").pop();

        // サイズチェック
        if (metadata.width < this.minSize || metadata.height < this.minSize) {
          return false;
        }
        if (metadata.width > this.maxSize || metadata.height > this.maxSize) {
          return false;
        }

        // ファイルサイズチェック
        if (metadata.size > this.maxFileSize) {
          return "large"; // 巨大ファイルの場合は特別な値を返す
        }

        return true;
      } catch (e) {
        console.error("画像のメタデータ取得中にエラーが発生しました:", e); // デバッグログ
        return false;
      }
    }

    isDeletedImage(metadata) {
      return this.deletedImageSizes.some(
        (size) => metadata.width === size.width && metadata.height === size.height
      );
    }

    createPlaceholder(url, metadata) {
      try {
        const placeholder = document.createElement("div");
        placeholder.classList.add("ic","image-placeholder");

        const sizeInfo = document.createElement("div");
        sizeInfo.classList.add("ic","size-info");
        sizeInfo.textContent = `サイズ: ${metadata.width}x${metadata.height} (${this.formatBytes(
          metadata.size
        )})`;

        const loadButton = document.createElement("button");
        loadButton.classList.add("ic","load-button");
        loadButton.textContent = "画像を読み込む";
        loadButton.addEventListener("click", () => {
          try {
            placeholder.replaceWith(this.createImageElement(url));
          } catch (error) {
            logError("画像の読み込み中にエラーが発生しました", error, { url });
          }
        });

        placeholder.appendChild(sizeInfo);
        placeholder.appendChild(loadButton);
        return placeholder;
      } catch (error) {
        logError("プレースホルダーの作成中にエラーが発生しました", error, { url });
        // エラー時は最小限のプレースホルダーを返す
        const errorPlaceholder = document.createElement("div");
        errorPlaceholder.classList.add("ic","image-placeholder");
        errorPlaceholder.textContent = "画像の表示に失敗しました";
        return errorPlaceholder;
      }
    }

    createErrorPlaceholder(url) {
      try {
        const placeholder = document.createElement("div");
        placeholder.classList.add("ic","image-placeholder");
        placeholder.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
        
        const errorText = document.createElement("div");
        errorText.textContent = "画像の読み込みに失敗しました";
        errorText.style.color = "#dc3545";
        
        const retryButton = document.createElement("button");
        retryButton.classList.add("ic","load-button");
        retryButton.textContent = "再試行";
        retryButton.addEventListener("click", () => {
          try {
            placeholder.replaceWith(this.createImageElement(url));
          } catch (error) {
            logError("画像の再読み込み中にエラーが発生しました", error, { url });
          }
        });

        placeholder.appendChild(errorText);
        placeholder.appendChild(retryButton);
        return placeholder;
      } catch (error) {
        logError("エラープレースホルダーの作成中にエラーが発生しました", error, { url });
        // 最終的なフォールバック
        const fallbackPlaceholder = document.createElement("div");
        fallbackPlaceholder.textContent = "エラー";
        return fallbackPlaceholder;
      }
    }

    createImageElement(url) {
      const img = document.createElement("img");
      img.src = url;
      img.classList.add("ic","grid-image");
      return img;
    }

    formatBytes(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }

    isImageUrl(url) {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    }

    getImageMetadata(url) {
      return new Promise((resolve, reject) => {
        try {
          // まず画像のサイズを取得
          const img = new Image();
          img.crossOrigin = "anonymous"; // CORS対応
          
          const imageTimeoutId = setTimeout(() => {
            logWarning("画像サイズ取得がタイムアウトしました", { url });
            reject(new Error("Image size detection timeout"));
          }, 8000); // 8秒のタイムアウト
          
          img.onload = () => {
            try {
              clearTimeout(imageTimeoutId);
              if (img.width === 0 || img.height === 0) {
                logWarning("無効な画像サイズです", { url, width: img.width, height: img.height });
                return reject(new Error("Invalid image dimensions"));
              }
              
              // 画像サイズが取得できたら、ファイルサイズを取得
              GM_xmlhttpRequest({
                method: "HEAD",
                url: url,
                timeout: 5000, // 5秒のタイムアウト
                onload: function (response) {
                  try {
                    const headers = response.responseHeaders;
                    const contentLength = parseInt(headers.match(/Content-Length:\s*(\d+)/i)?.[1], 10);
                    const contentType = headers.match(/Content-Type:\s*([^;\n]+)/i)?.[1];

                    if (!contentType || !contentType.startsWith("image/")) {
                      logWarning("画像ではないコンテンツタイプです", { url, contentType });
                      return reject(new Error("Not an image"));
                    }

                    resolve({
                      width: img.width,
                      height: img.height,
                      size: contentLength || 0, // contentLengthが取得できない場合は0を返す
                    });
                  } catch (error) {
                    logError("メタデータ処理中にエラーが発生しました", error, { url });
                    reject(error);
                  }
                },
                onerror: function (error) {
                  // HEADリクエストが失敗してもサイズ情報は返す
                  logWarning("HEADリクエストに失敗しましたが、画像サイズは取得済みです", { url });
                  resolve({
                    width: img.width,
                    height: img.height,
                    size: 0, // サイズ不明
                  });
                },
                onabort: function () {
                  logWarning("HEADリクエストが中断されました", { url });
                  resolve({
                    width: img.width,
                    height: img.height,
                    size: 0,
                  });
                },
                ontimeout: function () {
                  logWarning("HEADリクエストがタイムアウトしました", { url });
                  resolve({
                    width: img.width,
                    height: img.height,
                    size: 0,
                  });
                }
              });
            } catch (error) {
              clearTimeout(imageTimeoutId);
              logError("画像サイズ取得処理中にエラーが発生しました", error, { url });
              reject(error);
            }
          };
          
          img.onerror = (error) => {
            clearTimeout(imageTimeoutId);
            logWarning("画像の読み込みに失敗しました", { url });
            reject(new Error("Image load error"));
          };
          
          img.src = url;
        } catch (error) {
          logError("メタデータ取得処理の開始中にエラーが発生しました", error, { url });
          reject(error);
        }
      });
    }
  }

  class Toast {
    constructor() {
      this.toastContainer = null;
      this.shadowHost = null;
      this.shadowRoot = null;
      this.init();
    }

    init() {
      // トースト用のシャドウDOMホストを作成
      this.shadowHost = document.createElement("div");
      this.shadowHost.id = "toast-shadow-host";
      
      // シャドウルートを作成
      this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
      
      // トースト用のスタイルを注入
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ic.toast-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10001;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

                        .ic.toast {
                  background-color: rgba(0, 0, 0, 0.8);
                  color: white;
                  padding: 12px 20px;
                  border-radius: 4px;
                  opacity: 0;
                  transform: translateY(20px);
                  transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .ic.toast.show {
                  opacity: 1;
                  transform: translateY(0);
                }

                .ic.toast-info {
                  background-color: rgba(0, 123, 255, 0.9);
                }

                .ic.toast-success {
                  background-color: rgba(40, 167, 69, 0.9);
                }

                .ic.toast-warning {
                  background-color: rgba(255, 193, 7, 0.9);
                }

                .ic.toast-error {
                  background-color: rgba(220, 53, 69, 0.9);
                }
      `;
      this.shadowRoot.appendChild(styleElement);
      
      this.toastContainer = document.createElement("div");
      this.toastContainer.classList.add("ic","toast-container");
      this.shadowRoot.appendChild(this.toastContainer);
      
      // シャドウホストをドキュメントに追加
      document.body.appendChild(this.shadowHost);
    }

    show(message, type = "info", duration = 3000) {
      const toast = document.createElement("div");
      toast.classList.add("ic","toast", `ic.toast-${type}`);
      toast.textContent = message;

      this.toastContainer.appendChild(toast);

      // アニメーションのために少し待ってから表示
      setTimeout(() => {
        toast.classList.add("show");
      }, 10);

      // 指定時間後に削除
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300); // アニメーション終了を待つ
      }, duration);
    }
  }

  class ProgressBar {
    constructor() {
      this.progressBar = null;
      this.progressText = null;
      this.progressContainer = null;
      this.shadowHost = null;
      this.shadowRoot = null;
      this.init();
    }

    init() {
      // プログレスバー用のシャドウDOMホストを作成
      this.shadowHost = document.createElement("div");
      this.shadowHost.id = "progress-shadow-host";
      
      // シャドウルートを作成
      this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
      
      // プログレスバー用のスタイルを注入
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ic.progress-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 5px;
          z-index: 10001;
          display: none;
        }

        .ic.progress-bar {
          height: 10px;
          background-color: #4caf50;
          border-radius: 5px;
          width: 0%;
          transition: width 0.3s ease;
        }

        .ic.progress-text {
          text-align: center;
          color: white;
          margin-top: 5px;
          font-size: 0.9rem;
        }
      `;
      this.shadowRoot.appendChild(styleElement);

      this.progressContainer = document.createElement("div");
      this.progressContainer.classList.add("ic","progress-container");

      this.progressBar = document.createElement("div");
      this.progressBar.classList.add("ic","progress-bar");

      this.progressText = document.createElement("div");
      this.progressText.classList.add("ic","progress-text");
      this.progressText.textContent = "0%";

      this.progressContainer.appendChild(this.progressBar);
      this.progressContainer.appendChild(this.progressText);
      this.shadowRoot.appendChild(this.progressContainer);
      
      // シャドウホストをドキュメントに追加
      document.body.appendChild(this.shadowHost);
    }

    update(progress) {
      const percentage = Math.min(100, Math.max(0, progress));
      this.progressBar.style.width = `${percentage}%`;
      this.progressText.textContent = `${Math.round(percentage)}%`;
    }

    show() {
      this.progressContainer.style.display = "block";
    }

    hide() {
      this.progressContainer.style.display = "none";
    }
  }

  class RequestBatchLimiter {
    constructor(batchSize = 5, delay = 1000) {
      this.batchSize = batchSize;
      this.delay = delay;
      this.queue = [];
      this.isProcessing = false;
    }

    addRequest(requestFn) {
      this.queue.push(requestFn);
      if (!this.isProcessing) {
        this.processBatch();
      }
    }

    async processBatch() {
      try {
        this.isProcessing = true;
        let processedBatches = 0;
        let totalErrors = 0;

        while (this.queue.length > 0) {
          const batch = this.queue.splice(0, this.batchSize);
          processedBatches++;
          
          try {
            const results = await Promise.allSettled(batch.map((fn) => fn()));
            
            // エラーをカウント
            const batchErrors = results.filter(result => result.status === 'rejected').length;
            totalErrors += batchErrors;
            
            if (batchErrors > 0) {
              logWarning(`バッチ${processedBatches}で${batchErrors}個のエラーが発生しました`);
              
              // エラーの詳細をログ出力
              results.forEach((result, index) => {
                if (result.status === 'rejected') {
                  logError(`バッチ処理でエラーが発生しました`, result.reason, { 
                    batchNumber: processedBatches, 
                    taskIndex: index 
                  });
                }
              });
            }
          } catch (error) {
            logError(`バッチ${processedBatches}の処理中に予期しないエラーが発生しました`, error);
            totalErrors++;
          }

          if (this.queue.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.delay));
          }
        }

        if (totalErrors > 0) {
          logWarning(`バッチ処理完了: ${processedBatches}バッチ処理、合計${totalErrors}個のエラー`);
        } else {
          logDebug(`バッチ処理完了: ${processedBatches}バッチ処理、エラーなし`);
        }
      } catch (error) {
        logError("バッチ処理中に致命的なエラーが発生しました", error);
        throw error; // 致命的なエラーは再スロー
      } finally {
        this.isProcessing = false;
      }
    }
  }

  class ZipDownloader {
    constructor(uiBuilder, badImageHandler, toast, progressBar) {
      this.uiBuilder = uiBuilder;
      this.badImageHandler = badImageHandler;
      this.toast = toast;
      this.progressBar = progressBar;
      this.filesData = new Map(); // ファイルデータを保存
      this.downloadedUrls = new Set();
      this.isProcessing = false;
      
      // fflateが利用可能かチェック
      this.fflateAvailable = typeof fflate !== "undefined";
      
      if (!this.fflateAvailable) {
        logError("fflateライブラリが見つかりません！ZIPダウンロード機能は使用できません。");
      } else {
        logDebug("ZipDownloader初期化完了、fflateライブラリが利用可能です");
      }
      
      // 設定オプション
      this.options = {
        maxZipSize: 500 * 1024 * 1024, // 500MB
        maxImagesPerZip: 300, // 1つのZIPファイルあたりの最大画像数
        compressionLevel: 6, // 圧縮レベル (0-9)
        splitZipFiles: true, // 大きすぎる場合はZIPを分割するかどうか
      };
    }

    // ログ出力（グローバル関数を使用）
    logDebug(message) {
      if (CONFIG.debugMode) {
        console.log("[ZipDownloader] " + message);
      }
    }

    logError(message, error = null, context = {}) {
      logError(`[ZipDownloader] ${message}`, error, context);
    }

    logWarning(message, context = {}) {
      logWarning(`[ZipDownloader] ${message}`, context);
    }

    async prepareZip() {
      this.logDebug("prepareZip開始");
      if (CONFIG.debugMode) {
        console.log("[ZipDownloader] 現在の状態:", {
          isProcessing: this.isProcessing,
          filesDataSize: this.filesData.size,
          downloadedUrlsCount: this.downloadedUrls.size
        });
      }

      // 処理中なら重複実行しない
      if (this.isProcessing) {
        this.logDebug("既に処理中のため、prepareZipをスキップ");
        this.toast.show("現在処理中です。しばらくお待ちください...", "info");
        return;
      }

      // ZIP準備開始
      try {
        this.isProcessing = true;
        this.logDebug("処理開始フラグをセット");
        
        this.filesData.clear(); // データをクリア
        this.uiBuilder.zipButton.setAttribute("data-state", "processing");
        this.toast.show("ZIPファイルの準備を開始します...", "info");
        this.progressBar.show();
        this.progressBar.update(0);

        // 画像のURLを収集
        let imageUrls = Array.from(this.uiBuilder.imageData.keys());
        
        // テストモードの場合は1枚だけにする
        if (CONFIG.singleImageTest && imageUrls.length > 0) {
          this.logDebug(`単一画像テストモード: 最初の1枚だけ処理します`);
          imageUrls = [imageUrls[0]]; // 最初の画像だけを残す
          this.toast.show("テストモード: 1枚だけZIPに追加します", "warning");
        }
        
        const total = imageUrls.length;
        this.logDebug(`画像URL ${total}件を収集`);

        if (total === 0) {
          this.logDebug("画像URLが0件のため終了");
          this.toast.show("ダウンロードできる画像がありません", "error");
          this.progressBar.hide();
          this.uiBuilder.zipButton.setAttribute("data-state", "initial");
          this.isProcessing = false;
          return;
        }

        let processed = 0;
        let failed = 0;
        let skipped = 0;

        // 画像処理を完全に非同期処理
        const processImages = async () => {
          const imagesToProcess = [];
          
          // まず全画像のメタデータ作成
          for (const [index, url] of imageUrls.entries()) {
            try {
              this.logDebug(`画像情報収集 ${index + 1}/${total}: ${url.substring(0, 50)}...`);
              
              // 画像データの情報を取得
              const imageData = this.uiBuilder.imageData.get(url);
              
              if (!imageData) {
                this.logError("画像データが見つかりません", null, { url });
                failed++;
                continue;
              }
              
              this.logDebug(`メタデータ: width=${imageData.metadata?.width}, height=${imageData.metadata?.height}, size=${imageData.metadata?.size}, blobExists=${imageData.blob !== null}`);
              
              // Blobがなければダウンロード
              if (imageData.blob === null) {
                this.logDebug(`Blobが存在しないためダウンロード開始: ${url}`);
                try {
                  const blob = await this.fetchImageAsBlob(url);
                  if (blob) {
                    this.logDebug(`Blobダウンロード成功: ${blob.size} bytes`);
                    imageData.blob = blob;
                    this.uiBuilder.imageData.set(url, imageData);
                  } else {
                    this.logError("Blobダウンロード結果がnullです", null, { url });
                    failed++;
                    continue;
                  }
                } catch (error) {
                  this.logError("画像のダウンロードに失敗しました", error, { url });
                  failed++;
                  continue;
                }
              } else {
                this.logDebug(`既存のBlobを使用: ${imageData.blob.size} bytes`);
                skipped++;
              }
              
              // メタデータとURLを保存
              const fileName = this.getFilenameFromUrl(url);
              imagesToProcess.push({ url, imageData, fileName });
            } catch (error) {
              this.logError("画像メタデータ処理中にエラーが発生しました", error, { url, index });
              failed++;
            }
          }
          
          this.logDebug(`並列処理開始: ${imagesToProcess.length}個の画像を処理します`);
          this.toast.show(`${imagesToProcess.length}個の画像を並列処理中...`, "info");
          
          // 画像をUint8Arrayに変換して保存
          const processedEntries = await Promise.all(
            imagesToProcess.map(async (item, index) => {
              try {
                const { url, imageData, fileName } = item;
                
                if (!imageData.blob) {
                  this.logError("Blobが存在しません", null, { url, fileName });
                  return { url, fileName, success: false };
                }
                
                // ArrayBuffer→Uint8Arrayへの変換
                this.logDebug(`画像変換(${index + 1}/${imagesToProcess.length}): ${fileName}`);
                const ab = await imageData.blob.arrayBuffer();
                const uint8 = new Uint8Array(ab);
                
                if (uint8.byteLength === 0) {
                  this.logWarning("変換後のデータが空です", { url, fileName });
                  return { url, fileName, success: false };
                }
                
                return { 
                  url, 
                  fileName, 
                  bytes: uint8,
                  success: true, 
                  byteLength: uint8.byteLength 
                };
              } catch (error) {
                this.logError("画像処理中にエラーが発生しました", error, { url: item.url, fileName: item.fileName });
                return { 
                  url: item.url, 
                  fileName: item.fileName, 
                  success: false 
                };
              }
            })
          );
          
          // データを保存
          for (const entry of processedEntries) {
            if (entry.success) {
              this.logDebug(`ZIPに追加するデータを保存: ${entry.fileName} (${entry.byteLength} bytes)`);
              this.filesData.set(entry.fileName, entry.bytes);
              this.downloadedUrls.add(entry.url);
              processed++;
            } else {
              failed++;
            }
            
            // 進捗を更新
            const progress = (processed / total) * 100;
            this.progressBar.update(progress);
          }
          
          // 最終的な状態を表示
          this.toast.show(`${processed}/${total} 画像が準備されました`, "info");
          this.logDebug(`並列処理完了: 成功=${processed}, 失敗=${failed}`);
        };
        
        // 全画像を非同期処理
        await processImages();

        // テストモード表示
        if (CONFIG.singleImageTest) {
          this.logDebug("🧪 単一画像テストモードで実行されました");
          this.toast.show("テストモード: 単一画像のみでZIPを生成します", "info");
        }

        // 準備完了
        this.logDebug(`処理完了統計: total=${total}, processed=${processed}, failed=${failed}, skipped=${skipped}, filesCount=${this.filesData.size}`);

        this.progressBar.hide();
        if (failed > 0) {
          this.logDebug(`${failed}枚の画像をZIPに含められませんでした`);
          this.toast.show(`${failed}枚の画像をZIPに含められませんでした`, "warning");
        }
        if (processed > 0) {
          this.logDebug("ZIPファイルの準備が完了");
          this.toast.show(
            "ZIPファイルの準備が完了しました！ボタンをクリックしてダウンロードしてください",
            "success"
          );
          this.uiBuilder.zipButton.setAttribute("data-state", "ready");
          this.uiBuilder.zipButton.innerHTML = '<span class="ic material-icons">save_alt</span>';
        } else {
          this.logError("処理された画像が0件です", null, { total, processed, failed });
          this.toast.show("ZIPファイルの作成に失敗しました", "error");
          this.uiBuilder.zipButton.setAttribute("data-state", "initial");
          this.filesData.clear(); // 失敗時は明示的にクリア
        }
      } catch (error) {
        this.logError("ZIP準備中にエラーが発生しました", error, { 
          total: imageUrls?.length, 
          filesDataSize: this.filesData.size 
        });
        this.toast.show("ZIPファイルの準備に失敗しました", "error");
        this.uiBuilder.zipButton.setAttribute("data-state", "initial");
        this.filesData.clear(); // エラー時は明示的にクリア
      } finally {
        this.logDebug("prepareZip処理終了、isProcessingをfalseに設定");
        this.isProcessing = false;
      }
    }

    async downloadZip() {
      this.logDebug("downloadZip開始");
      this.logDebug(`現在の状態: isProcessing=${this.isProcessing}, filesDataSize=${this.filesData.size}, downloadedUrlsCount=${this.downloadedUrls.size}, fflateAvailable=${this.fflateAvailable}`);

      // fflateのチェック
      if (!this.fflateAvailable) {
        this.toast.show("ZIPライブラリが読み込まれていないため、ダウンロードできません", "error");
        this.logError("fflate利用不可のためダウンロード中止");
        return;
      }

      // データ存在チェック
      if (this.filesData.size === 0) {
        this.logWarning("ファイルデータが空のため準備からやり直し");
        this.toast.show("ZIPファイルが準備されていません。再度準備します...", "warning");
        try {
          await this.prepareZip();
        } catch (error) {
          this.logError("ZIP準備の再実行中にエラーが発生しました", error);
          this.toast.show("ZIP準備の再実行に失敗しました", "error");
        }
        return;
      }

      // ファイル数をチェック
      const fileEntries = Array.from(this.filesData.keys());
      if (fileEntries.length === 0) {
        this.logError("ZIPファイルが空です");
        this.toast.show("ZIPファイルに画像が含まれていません", "error");
        this.uiBuilder.zipButton.setAttribute("data-state", "initial");
        return;
      }

      this.logDebug(`ZIP内のファイル数: ${fileEntries.length}`);

      try {
        this.isProcessing = true;
        this.logDebug("ZIP生成処理開始");
        this.toast.show("ZIPファイルを生成しています...", "info");
        this.progressBar.show();

        // ZIPファイルが大きすぎる場合は分割する
        const totalEntries = fileEntries.length;

        // 分割が必要かどうかを判断
        const needsSplitting = this.options.splitZipFiles && totalEntries > this.options.maxImagesPerZip;

        if (needsSplitting) {
          await this.generateSplitZips(totalEntries);
        } else {
          // 通常の単一ZIPファイル生成
          await this.generateSingleZip();
        }

        // 状態をリセット
        this.logDebug("ダウンロード処理完了、UIをリセット");
        this.progressBar.hide();
        this.uiBuilder.zipButton.setAttribute("data-state", "initial");
        this.uiBuilder.zipButton.innerHTML = '<span class="ic material-icons">download</span>';
        // ファイルデータは保持 - 再度ダウンロードできるように
      } catch (error) {
        console.error("[ZipDownloader] ZIPダウンロード中にエラー:", error);
        this.toast.show("ZIPファイルの生成に失敗しました", "error");
        this.progressBar.hide();
        this.uiBuilder.zipButton.setAttribute("data-state", "initial");

        // エラー詳細をログに出力
        this.logError("ZIPダウンロード中に詳細エラー情報", error, {
          errorName: error.name,
          errorMessage: error.message,
          fflateAvailable: typeof fflate !== "undefined",
          filesDataSize: this.filesData.size
        });
      } finally {
        this.logDebug("downloadZip処理終了、isProcessingをfalseに設定");
        this.isProcessing = false;
      }
    }

    // 単一のZIPファイルを生成する
    async generateSingleZip() {
      try {
        this.logDebug("単一ZIPファイル生成開始");
        console.time("[ZipDownloader] ZIP生成時間");
        
        // ファイルオブジェクト作成
        const files = {};
        this.filesData.forEach((data, filename) => {
          files[filename] = data;
        });
        
        this.logDebug(`ZIP作成: ${Object.keys(files).length}個のファイルを圧縮`);
        
        // fflateでZIPを生成
        const zipOptions = {
          level: this.options.compressionLevel,
          mem: 8
        };
        
        // 進捗表示は未対応（fflateはコールバックベースの進捗情報なし）
        const zipData = fflate.zipSync(files, zipOptions);
        
        console.timeEnd("[ZipDownloader] ZIP生成時間");
        
        if (!zipData) {
          throw new Error("ZIP生成結果がnullです");
        }
        
        // Blobを作成
        const content = new Blob([zipData], {type: "application/zip"});
        this.logDebug(`ZIP生成完了: Uint8Array(${zipData.length}) → Blob(${content.size} bytes)`);

        // ダウンロードリンクを作成して実行
        const filename = `images_${this.getFormattedDate()}.zip`;
        this.logDebug(`ダウンロードリンク作成: ${filename}`);
        await this.triggerDownload(content, filename);

        this.toast.show("ZIPファイルのダウンロードが開始されました", "success");
              } catch (error) {
          this.logError("単一ZIP生成中にエラーが発生しました", error, {
            filesCount: Object.keys(files || {}).length,
            compressionLevel: this.options.compressionLevel
          });
          this.toast.show("ZIPファイルの生成に失敗しました: " + error.message, "error");
          throw error;
        }
    }

    // ZIPファイルを分割して生成
    async generateSplitZips(totalEntries) {
      try {
        this.logDebug(`分割ZIPファイル生成開始 (全${totalEntries}ファイル)`);
        const fileEntries = Array.from(this.filesData.keys());
        const totalParts = Math.ceil(totalEntries / this.options.maxImagesPerZip);

        this.toast.show(`画像が多いため、${totalParts}個のZIPファイルに分割します`, "info");
        this.logDebug(`${totalParts}個のZIPファイルに分割します`);

        for (let part = 0; part < totalParts; part++) {
          // この部分に含めるファイルの範囲
          const startIdx = part * this.options.maxImagesPerZip;
          const endIdx = Math.min((part + 1) * this.options.maxImagesPerZip, totalEntries);

          this.logDebug(`パート${part + 1}: ファイル ${startIdx + 1}～${endIdx} を処理`);
          this.toast.show(`パート${part + 1}/${totalParts}を準備中...`, "info");

          // ファイルオブジェクト作成
          const partFiles = {};
          for (let i = startIdx; i < endIdx; i++) {
            const filename = fileEntries[i];
            partFiles[filename] = this.filesData.get(filename);
          }

          // パート番号付きのファイル名
          const partFilename = `images_${this.getFormattedDate()}_part${part + 1}of${totalParts}.zip`;

          // 進捗表示の調整（おおよその進捗）
          const baseProgress = (part / totalParts) * 100;
          this.progressBar.update(baseProgress);

          // ZIPを生成
          console.time(`[ZipDownloader] パート${part + 1}生成時間`);
          const zipData = fflate.zipSync(partFiles, {
            level: this.options.compressionLevel,
            mem: 8
          });
          console.timeEnd(`[ZipDownloader] パート${part + 1}生成時間`);

          // ダウンロード
          this.logDebug(
            `パート${part + 1} ダウンロード開始: ${partFilename} (${zipData.length} bytes)`
          );
          await this.triggerDownload(new Blob([zipData], {type: "application/zip"}), partFilename);

          // 少し待ってからダウンロード
          if (part < totalParts - 1) {
            this.toast.show(
              `パート${part + 1}/${totalParts}のダウンロードが開始されました。次のパートを準備中...`,
              "success"
            );
            await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5秒待機
          }
        }

        this.toast.show(`全${totalParts}個のZIPファイルのダウンロードを開始しました`, "success");
              } catch (error) {
          this.logError("分割ZIP生成中にエラーが発生しました", error, {
            totalEntries,
            totalParts,
            maxImagesPerZip: this.options.maxImagesPerZip
          });
          this.toast.show("ZIPファイルの分割生成に失敗しました: " + error.message, "error");
          throw error;
        }
    }

    // ファイルのダウンロードをトリガーする
    async triggerDownload(blob, filename) {
      const self = this; // thisの参照を保持
      return new Promise((resolve, reject) => {
        try {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);

          self.logDebug(`ダウンロード開始: ${filename}`);
          link.click();

          // 少し待ってからクリーンアップ
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            resolve();
          }, 100);
        } catch (error) {
          this.logError("ダウンロードリンク作成エラー", error, { filename });
          reject(error);
        }
      });
    }

    async fetchImageAsBlob(url) {
      this.logDebug(`fetchImageAsBlob開始: ${url.substring(0, 50)}...`);
      const self = this; // thisの参照を保持
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          responseType: "blob",
          timeout: 30000, // 30秒のタイムアウト
          onload: function (response) {
            try {
              if (response && response.response) {
                self.logDebug(
                  `画像ダウンロード成功: ${url.substring(0, 50)}... (${response.response.size} bytes)`
                );
                resolve(response.response);
              } else {
                self.logError("レスポンスまたはレスポンスデータが空です", null, { url: url.substring(0, 50) + "..." });
                reject(new Error("Empty response"));
              }
            } catch (e) {
              // ログの失敗で処理が止まらぬよう握りつぶす
              self.logError("ログ出力で例外が発生しました", e);
              reject(e);
            }
          },
          onerror: function (error) {
            self.logError("画像ダウンロード失敗", error, { url: url.substring(0, 50) + "..." });
            reject(error);
          },
          onabort: function () {
            self.logWarning("画像ダウンロードが中断されました", { url: url.substring(0, 50) + "..." });
            reject(new Error("download aborted"));
          },
          ontimeout: function () {
            self.logWarning("画像ダウンロードがタイムアウトしました", { url: url.substring(0, 50) + "..." });
            reject(new Error("download timeout"));
          },
        });
      });
    }

    getFilenameFromUrl(url) {
      // URLから最後のパス部分を取得
      let fileName = url.split("/").pop().split("?")[0];

      // 拡張子がない場合は.jpgを追加
      if (!fileName.includes(".")) {
        fileName += ".jpg";
      }

      // 同名ファイルがある場合には連番を付ける
      const fileNameBase = fileName.substring(0, fileName.lastIndexOf("."));
      const extension = fileName.substring(fileName.lastIndexOf("."));
      let counter = 1;
      let newFileName = fileName;

      while (this.filesData.has(newFileName)) {
        newFileName = `${fileNameBase}_${counter}${extension}`;
        counter++;
      }

      return newFileName;
    }

    getFormattedDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${year}${month}${day}_${hours}${minutes}`;
    }
  }

  // スクリプト起動時に初期化
  initialize();
})();
