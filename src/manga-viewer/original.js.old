// ==UserScript==
// @name         ブック風マンガビューア
// @namespace    bookStyleMangaViewer
// @version      9.1
// @description  ウェブページの画像を見開き形式で表示するビューア（シャドウDOM対応・FAB起動ボタン付き）
// @author       roflsunriz
// @match        *://*/*
// @run-at       document-start
// @exclude      *://www.youtube.com/*
// @exclude      *://youtube.com/*
// @exclude      *://m.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://www.nicovideo.jp/*
// @exclude      *://nicovideo.jp/*
// @exclude      *://nico.ms/*
// @exclude      *://www.nico.ms/*
// @exclude      *://nicocache.jpn.org/*
// @exclude      *://animestore.docomo.ne.jp/*
// @exclude      *://www.netflix.com/*
// @exclude      *://netflix.com/*
// @exclude      *://www.amazon.co.jp/gp/video/*
// @exclude      *://amazon.co.jp/gp/video/*
// @exclude      *://www.primevideo.com/*
// @exclude      *://primevideo.com/*
// @exclude      *://www.hulu.jp/*
// @exclude      *://hulu.jp/*
// @exclude      *://www.disneyplus.com/*
// @exclude      *://disneyplus.com/*
// @exclude      *://abema.tv/*
// @exclude      *://www.abema.tv/*
// @exclude      *://tver.jp/*
// @exclude      *://www.tver.jp/*
// @exclude      *://gyao.yahoo.co.jp/*
// @exclude      *://www.twitch.tv/*
// @exclude      *://twitch.tv/*
// @exclude      *://live.nicovideo.jp/*
// @exclude      *://www.openrec.tv/*
// @exclude      *://openrec.tv/*
// @exclude      *://www.mildom.com/*
// @exclude      *://mildom.com/*
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @updateURL    https://gist.githubusercontent.com/roflsunriz/22077fdfbc0a01e303f2cebce3fae271/raw/mangaViewer.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/22077fdfbc0a01e303f2cebce3fae271/raw/mangaViewer.user.js
// ==/UserScript==

(function () {
  "use strict";

  // グローバル状態管理
  let globalState = {
    isViewerActive: false,
    eventListeners: [],
    timers: [],
    observers: [],
    controlPanel: null, // GlassControlPanelの参照を追加
    keyDispatcher: null, // グローバルkeydownディスパッチャ
    earlyKeyHookInstalled: false, // 早期フック設置フラグ
  };

  // 早期キーダウンフック設置（document-start段階で先制的にキャプチャ）
  (function installEarlyKeydownHook() {
    if (globalState.earlyKeyHookInstalled) return;
    try {
      window.addEventListener(
        "keydown",
        function (e) {
          // Viewerがアクティブで、入力系にフォーカスが無いときだけ拾う
          if (!globalState.isViewerActive) return;
          const ae = document.activeElement;
          if (
            ae &&
            (ae.tagName === "INPUT" ||
              ae.tagName === "TEXTAREA" ||
              ae.tagName === "SELECT" ||
              ae.isContentEditable)
          )
            return;

          // React側が登録したディスパッチャがあれば渡す
          if (typeof globalState.keyDispatcher === "function") {
            // 二重処理防止
            if (e.__mvHandled) return;
            e.__mvHandled = true;
            try {
              globalState.keyDispatcher(e);
            } catch {}
          }
        },
        { capture: true } // 重要：キャプチャ位相で先取り
      );
      globalState.earlyKeyHookInstalled = true;
    } catch {}
  })();

  // React/ReactDOMの可用性チェック
  function checkReactAvailability() {
    try {
      if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
        console.error("[MangaViewer] React or ReactDOM is not available");
        return false;
      }
      if (typeof ReactDOM.createRoot !== "function") {
        console.error("[MangaViewer] ReactDOM.createRoot is not available (React 18+ required)");
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // 安全なイベントリスナー追加
  function addEventListenerSafely(element, event, handler, options = false) {
    try {
      if (!element || typeof element.addEventListener !== "function") {
        return null;
      }

      element.addEventListener(event, handler, options);
      const listenerInfo = { element, event, handler, options };
      globalState.eventListeners.push(listenerInfo);
      return listenerInfo;
    } catch (error) {
      return null;
    }
  }

  // 安全なタイマー設定
  function setTimeoutSafely(callback, delay) {
    try {
      const timerId = setTimeout(() => {
        try {
          callback();
        } catch (error) {
          // Timer callback error - silently continue
        } finally {
          // タイマーリストから削除
          const index = globalState.timers.indexOf(timerId);
          if (index > -1) {
            globalState.timers.splice(index, 1);
          }
        }
      }, delay);

      globalState.timers.push(timerId);
      return timerId;
    } catch (error) {
      return null;
    }
  }

  // 安全なインターバル設定
  function setIntervalSafely(callback, interval) {
    try {
      const intervalId = setInterval(() => {
        try {
          callback();
        } catch (error) {
          // Interval callback error - silently continue
        }
      }, interval);

      globalState.timers.push(intervalId);
      return intervalId;
    } catch (error) {
      return null;
    }
  }

  // 安全なオブザーバー設定
  function createObserverSafely(callback, options) {
    try {
      const observer = new MutationObserver((mutations, obs) => {
        try {
          callback(mutations, obs);
        } catch (error) {
          // Observer callback error - silently continue
        }
      });

      globalState.observers.push(observer);
      return observer;
    } catch (error) {
      return null;
    }
  }

  // リソースクリーンアップ
  function cleanupResources() {
    try {
      // イベントリスナーを削除
      globalState.eventListeners.forEach(({ element, event, handler, options }) => {
        try {
          if (element && typeof element.removeEventListener === "function") {
            element.removeEventListener(event, handler, options);
          }
        } catch (error) {
          console.error("[MangaViewer] Error removing event listener:", error);
        }
      });
      globalState.eventListeners = [];

      // タイマーをクリア
      globalState.timers.forEach((timerId) => {
        try {
          clearTimeout(timerId);
          clearInterval(timerId);
        } catch (error) {
          console.error("[MangaViewer] Error clearing timer:", error);
        }
      });
      globalState.timers = [];

      // オブザーバーを停止
      globalState.observers.forEach((observer) => {
        try {
          if (observer && typeof observer.disconnect === "function") {
            observer.disconnect();
          }
        } catch (error) {
          console.error("[MangaViewer] Error disconnecting observer:", error);
        }
      });
      globalState.observers = [];

      // コントロールパネルの表示状態をリセット
      if (globalState.controlPanel) {
        globalState.controlPanel.show();
      }

      globalState.isViewerActive = false;
    } catch (error) {
      console.error("[MangaViewer] Error during cleanup:", error);
    }
  }

  // モバイル判定用の関数を追加
  const isMobile = () => {
    try {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    } catch (error) {
      console.error("[MangaViewer] Error detecting mobile:", error);
      return false;
    }
  };

  // マウス非アクティブ判定の時間（ミリ秒）
  const MOUSE_INACTIVITY_DELAY = 2000;

  // ビューポートの設定を追加
  const setViewport = () => {
    try {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement("meta");
        viewport.name = "viewport";
        if (document.head) {
          document.head.appendChild(viewport);
        } else {
          console.error("[MangaViewer] Document head not available for viewport");
          return;
        }
      }
      viewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    } catch (error) {
      console.error("[MangaViewer] Error setting viewport:", error);
    }
  };

  // シャドウDOM用のスタイルを定義
  const getViewerStyles = () => `
        /* カラーパレット定義 - 和風テーマ */
        :host {
            --mv-primary: #FF6B6B;
            --mv-secondary: #4ECDC4;
            --mv-dark: #292F36;
            --mv-light: #F7FFF7;
            --mv-accent: #FFE66D;
            --mv-shadow-color: rgba(0, 0, 0, 0.3);
            --mv-glass-bg: rgba(22, 28, 36, 0.8);
            --mv-glass-light: rgba(255, 255, 255, 0.1);
        }

        /* ビューア用のスタイル */
        .manga-viewer-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            background-color: rgba(22, 28, 36, 0.85);
            backdrop-filter: blur(12px);
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            color: var(--mv-light);
            transition: all 0.3s ease, cursor 0.3s ease;
            cursor: default;
        }

        /* モバイル対応のスタイル */
        @media (max-width: 768px) {
            .mv-header {
                padding: 0.5rem 1rem;
                height: 50px;
            }

            .mv-header-text {
                font-size: 14px;
            }

            .mv-auto-nav-toggle {
                padding: 6px 10px;
                font-size: 12px;
            }

            .mv-close-button {
                padding: 6px 12px;
                font-size: 12px;
            }

            .mv-shortcuts-hint {
                display: none; /* モバイルではショートカットヒントを非表示 */
            }

            .mv-edge-indicator {
                padding: 0.5rem 0.8rem;
                font-size: 12px;
            }

            .mv-zoom-indicator {
                font-size: 12px;
                padding: 4px 10px;
            }
        }

        /* タッチ操作のフィードバック用スタイル */
        .mv-touch-feedback {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: touch-ripple 0.4s ease-out;
        }

        @keyframes touch-ripple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }

        /* 画像フィット調整 */
        .mv-page {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
            touch-action: none; /* ブラウザのデフォルトタッチ動作を無効化 */
        }

        /* モバイルでのページめくりインジケーター */
        .mv-page-turn-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: var(--mv-glass-bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .mv-page-turn-indicator.left {
            left: 10px;
        }

        .mv-page-turn-indicator.right {
            right: 10px;
        }

        .mv-page-turn-indicator.visible {
            opacity: 0.8;
        }

        /* 既存のスタイル */
        .manga-viewer-container.mouse-inactive {
            cursor: none;
        }

        .manga-viewer-container.mouse-inactive * {
            cursor: none !important;
        }

        .manga-viewer-container * {
            box-sizing: border-box;
        }

        .mv-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 1.5rem;
            background-color: rgba(22, 28, 36, 0.7);
            backdrop-filter: blur(15px);
            height: 60px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid var(--mv-glass-light);
            z-index: 100;
        }

        .mv-header-text {
            color: white;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
        }
        
        .mv-header-text:before {
            content: '📖';
            margin-right: 10px;
            font-size: 20px;
        }

        .mv-auto-nav-toggle {
            background-color: var(--mv-glass-bg);
            color: white;
            padding: 8px 14px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--mv-glass-light);
        }
        
        .mv-auto-nav-toggle:before {
            content: '✓';
            margin-right: 6px;
            color: var(--mv-primary);
            font-weight: bold;
        }

        .mv-auto-nav-toggle.off {
            background-color: rgba(50, 50, 50, 0.4);
            box-shadow: none;
        }
        
        .mv-auto-nav-toggle.off:before {
            content: '✗';
            color: #9e9e9e;
        }
        
        .mv-auto-nav-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .mv-close-button {
            color: white;
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.4);
            border-radius: 50px;
            padding: 8px 16px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
        }
        
        .mv-close-button:before {
            content: '×';
            margin-right: 6px;
            font-size: 18px;
            font-weight: bold;
        }

        .mv-close-button:hover {
            background-color: var(--mv-primary);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .mv-main-viewer {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            user-select: none;
            perspective: 1500px;
            transform-style: preserve-3d;
            background: radial-gradient(circle at center, rgba(40, 44, 52, 0.8) 0%, rgba(17, 20, 24, 0.95) 100%);
        }

        .mv-page-container {
            position: relative;
            max-width: 50vw;
            height: 100%;
            perspective: 1200px;
            transform-style: preserve-3d;
            transition: all 0.3s ease;
        }

        .mv-page {
            position: relative;
            max-width: 100%;
            height: 100%;
            object-fit: contain;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
            transform-style: preserve-3d;
            backface-visibility: hidden;
            will-change: transform, z-index;
            cursor: grab;
            border-radius: 3px;
            transition: transform 0.2s ease;
        }
        
        .mv-page:hover {
            transform: scale(1.01) translateZ(10px);
        }

        .mv-edge-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: var(--mv-glass-bg);
            color: white;
            padding: 0.8rem 1.2rem;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
            transition: all 0.3s ease;
            opacity: 0.8;
            display: flex;
            align-items: center;
        }
        
        .mv-edge-indicator:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.05);
        }

        .mv-right-indicator {
            right: 15px;
            border-radius: 50px 0 0 50px;
            padding-right: 1.5rem;
        }
        
        .mv-right-indicator:before {
            content: '▶';
            margin-right: 8px;
            font-size: 14px;
        }

        .mv-left-indicator {
            left: 15px;
            border-radius: 0 50px 50px 0;
            padding-left: 1.5rem;
        }
        
        .mv-left-indicator:after {
            content: '◀';
            margin-left: 8px;
            font-size: 14px;
        }

        .mv-page-edge {
            position: absolute;
            height: 100%;
            width: 20px;
            top: 0;
            background: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0));
            z-index: 5;
        }

        .mv-page-edge.left {
            left: 0;
            border-radius: 3px 0 0 3px;
        }

        .mv-page-edge.right {
            right: 0;
            transform: scaleX(-1);
            border-radius: 0 3px 3px 0;
        }

        .mv-page-animating {
            z-index: 10 !important;
        }

        /* ショートカットヒント */
        .mv-shortcuts-hint {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--mv-glass-bg);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 13px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            display: flex;
            align-items: center;
            border: 1px solid var(--mv-glass-light);
            z-index: 100;
        }
        
        .mv-shortcuts-hint.visible {
            opacity: 0.9;
            transform: translateX(-50%) translateY(0);
        }
        
        .mv-shortcuts-hint.hidden {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
            pointer-events: none;
        }
        
        .mv-shortcuts-hint:hover {
            opacity: 1;
        }
        
        .mv-shortcuts-hint span {
            display: inline-flex;
            align-items: center;
            margin: 0 6px;
        }
        
        .mv-key {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 2px 6px;
            margin: 0 3px;
            font-weight: bold;
        }

        /* ズームインジケーター */
        .mv-zoom-indicator {
            position: absolute;
            top: 70px; /* ヘッダーの高さ+余白に調整 */
            right: 20px;
            background-color: var(--mv-glass-bg);
            color: white;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 14px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
            border: 1px solid var(--mv-glass-light);
        }
        
        .mv-zoom-indicator.visible {
            opacity: 0.9;
            transform: translateY(0);
        }

        /* 発光エフェクト */
        .mv-glow-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,107,107,0.3) 0%, rgba(255,107,107,0) 70%);
            animation: glow-pulse 1.5s ease-in-out infinite;
        }

        @keyframes glow-pulse {
            0% { 
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
                transform: translate(-50%, -50%) scale(0.95); 
            }
            70% { 
                box-shadow: 0 0 0 15px rgba(255, 107, 107, 0);
                transform: translate(-50%, -50%) scale(1); 
            }
            100% { 
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
                transform: translate(-50%, -50%) scale(0.95); 
            }
        }

        /* ローディングスピナー */
        .manga-viewer-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(17, 20, 24, 0.9);
            color: white;
            z-index: 10000;
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            backdrop-filter: blur(10px);
        }
            
        .mv-spinner {
			position:absolute;
			top:10px;
			left:10px;
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: var(--mv-primary);
            border-left-color: var(--mv-primary);
            animation: spin 1s cubic-bezier(0.42, 0, 0.58, 1) infinite;
            margin-bottom: 20px;
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
        }
            
        .mv-message {
            font-size: 18px;
            margin-top: 15px;
            background-color: var(--mv-glass-bg);
            padding: 12px 24px;
            border-radius: 50px;
            max-width: 80%;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.5s ease;
            backdrop-filter: blur(8px);
            border: 1px solid var(--mv-glass-light);
        }
            
        /* アニメーション定義 */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceLeft {
            0% { transform: translateX(0); }
            25% { transform: translateX(20px); }
            50% { transform: translateX(0); }
            75% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }

        @keyframes bounceRight {
            0% { transform: translateX(0); }
            25% { transform: translateX(-20px); }
            50% { transform: translateX(0); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }

        @keyframes pulse {
            0% { 
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
                transform: scale(0.95); 
            }
            70% { 
                box-shadow: 0 0 0 15px rgba(255, 107, 107, 0);
                transform: scale(1); 
            }
            100% { 
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
                transform: scale(0.95); 
            }
        }
        
        .mv-btn-hover {
            animation: btn-pulse 1.5s infinite;
        }

        .mv-progress-container {
            position: absolute;
            top: 60px; /* ヘッダーの高さに合わせる */
            left: 0;
            width: 100%;
            height: 3px; /* 薄いバー */
            background-color: rgba(255, 255, 255, 0.1);
            z-index: 100;
            overflow: hidden;
        }
        
        .mv-progress-bar {
            height: 100%;
            background-color: var(--mv-primary, #FF6B6B);
            transition: width 0.3s ease;
        }
        
        .mv-progress-message {
            position: absolute;
            top: 3px; /* バーの下に少しスペース */
            left: 0;
            width: 100%;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            padding: 2px 0;
            pointer-events: none;
            opacity: 0.7;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        }

        /* モバイル用の閉じるボタンのスタイル */
        .mv-mobile-close-button {
            display: none; /* デフォルトでは非表示 */
            position: fixed;
            top: env(safe-area-inset-top, 10px); /* セーフエリアを考慮 */
            right: env(safe-area-inset-right, 10px); /* セーフエリアを考慮 */
            width: 44px;
            height: 44px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            z-index: 10002;
            border: 2px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            /* iOSのセーフエリアに対応 */
            padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
        }

        .mv-mobile-close-button::before {
            content: '×';
            line-height: 1;
        }

        .mv-mobile-close-button:active {
            background-color: rgba(255, 107, 107, 0.8);
            transform: scale(0.95);
        }

        /* モバイル環境でのみ表示 */
        @media (max-width: 768px) {
            .mv-mobile-close-button {
                display: flex;
            }
        }

        /* 横向き（ランドスケープ）モードでの調整 */
        @media (max-width: 768px) and (orientation: landscape) {
            .mv-mobile-close-button {
                /* 横向き時は上端からの距離を調整 */
                top: env(safe-area-inset-top, 5px);
                right: env(safe-area-inset-right, 5px);
                /* サイズを少し小さく */
                width: 40px;
                height: 40px;
                font-size: 20px;
                /* 背景をより目立たせる */
                background-color: rgba(0, 0, 0, 0.8);
            }
        }

        /* ノッチ付きiPhoneのランドスケープモード対応 */
        @supports (padding-top: env(safe-area-inset-top)) {
            @media (max-width: 768px) and (orientation: landscape) {
                .mv-mobile-close-button {
                    top: max(env(safe-area-inset-top, 5px), 5px);
                    right: max(env(safe-area-inset-right, 5px), 5px);
                }
            }
        }

        /* ページめくりアニメーション */
        @keyframes turnPageForward {
            0% {
                transform: rotateY(0) translateZ(0);
                filter: brightness(1);
            }
            20% {
                transform: rotateY(40deg) translateZ(50px) skewY(5deg);
                box-shadow: 30px 0 30px rgba(0, 0, 0, 0.4);
                filter: brightness(1.03);
            }
            50% {
                transform: rotateY(90deg) translateZ(100px) skewY(8deg);
                box-shadow: 40px 20px 40px rgba(0, 0, 0, 0.5);
                filter: brightness(1.05);
            }
            80% {
                transform: rotateY(140deg) translateZ(50px) skewY(5deg);
                box-shadow: 30px 0 30px rgba(0, 0, 0, 0.4);
                filter: brightness(1.03);
            }
            100% {
                transform: rotateY(180deg) translateZ(0);
                filter: brightness(1);
            }
        }
        @keyframes turnPageBackward {
            0% {
                transform: rotateY(0) translateZ(0);
                filter: brightness(1);
            }
            20% {
                transform: rotateY(-40deg) translateZ(50px) skewY(-5deg);
                box-shadow: -30px 0 30px rgba(0, 0, 0, 0.4);
                filter: brightness(1.03);
            }
            50% {
                transform: rotateY(-90deg) translateZ(100px) skewY(-8deg);
                box-shadow: -40px 20px 40px rgba(0, 0, 0, 0.5);
                filter: brightness(1.05);
            }
            80% {
                transform: rotateY(-140deg) translateZ(50px) skewY(-5deg);
                box-shadow: -30px 0 30px rgba(0, 0, 0, 0.4);
                filter: brightness(1.03);
            }
            100% {
                transform: rotateY(-180deg) translateZ(0);
                filter: brightness(1);
            }
        }
        
        /* ページのエッジ効果用 */
        .mv-page-edge {
            position: absolute;
            height: 100%;
            width: 10px;
            top: 0;
            background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0));
        }
        .mv-page-edge.left {
            left: 0;
        }
        .mv-page-edge.right {
            right: 0;
            transform: scaleX(-1);
        }
        
        /* 3D変換の強化 */
        .mv-spread-container {
            transform-style: preserve-3d;
            will-change: transform;
        }
        .mv-page-container {
            transform-style: preserve-3d;
            will-change: transform;
        }
        .mv-page {
            backface-visibility: hidden;
            transform-style: preserve-3d;
            will-change: transform, z-index;
        }
        .mv-page-animating {
            z-index: 10 !important;
        }
    `;

  // React要素を作成するためのヘルパー関数（安全性チェック付き）
  const e = (() => {
    try {
      if (typeof React !== "undefined" && typeof React.createElement === "function") {
        return React.createElement;
      } else {
        console.error("[MangaViewer] React.createElement is not available");
        return () => null;
      }
    } catch (error) {
      console.error("[MangaViewer] Error accessing React.createElement:", error);
      return () => null;
    }
  })();

  // ローディングスピナークラス（シャドウDOM対応）
  class LoadingSpinner {
    constructor() {
      this.shadowHost = null;
      this.shadowRoot = null;
      this.progressInterval = null;
    }

    /**
     * ローディングスピナーを表示する
     * @param {string} message - 表示するメッセージ
     * @returns {HTMLElement} - ローディングスピナーのDOM要素
     */
    show(message = "画像を読み込み中...") {
      try {
        // すでに存在する場合は削除
        this.hide();

        // シャドウホスト要素を作成
        this.shadowHost = document.createElement("div");
        this.shadowHost.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    pointer-events: auto;
                `;

        // シャドウDOMを作成（フォールバック付き）
        try {
          if (this.shadowHost.attachShadow) {
            this.shadowRoot = this.shadowHost.attachShadow({ mode: "closed" });
          } else {
            // シャドウDOMが使用できない場合は通常のDOMを使用
            console.warn("[MangaViewer] Shadow DOM not supported, using regular DOM");
            this.shadowRoot = this.shadowHost;
          }
        } catch (shadowError) {
          console.warn("[MangaViewer] Shadow DOM creation failed, using regular DOM:", shadowError);
          this.shadowRoot = this.shadowHost;
        }

        // スタイルを追加
        const style = document.createElement("style");
        style.textContent = getViewerStyles();
        this.shadowRoot.appendChild(style);

        // スピナー要素を作成
        const spinnerElement = document.createElement("div");
        spinnerElement.className = "manga-viewer-loading";

        // スピナーコンテナ
        const spinnerContainer = document.createElement("div");
        spinnerContainer.style.position = "relative";
        spinnerContainer.style.width = "80px";
        spinnerContainer.style.height = "80px";

        // メインスピナー
        const spinner = document.createElement("div");
        spinner.classList.add("mv-spinner");

        // 発光エフェクト
        const glowEffect = document.createElement("div");
        glowEffect.style.position = "absolute";
        glowEffect.style.top = "50%";
        glowEffect.style.left = "50%";
        glowEffect.style.transform = "translate(-50%, -50%)";
        glowEffect.style.width = "60px";
        glowEffect.style.height = "60px";
        glowEffect.style.borderRadius = "50%";
        glowEffect.style.background =
          "radial-gradient(circle, rgba(255,107,107,0.3) 0%, rgba(255,107,107,0) 70%)";
        glowEffect.classList.add("mv-glow-effect");

        // メッセージ
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("mv-message");

        // プログレスバー
        const progressBarContainer = document.createElement("div");
        progressBarContainer.style.width = "200px";
        progressBarContainer.style.height = "4px";
        progressBarContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        progressBarContainer.style.borderRadius = "2px";
        progressBarContainer.style.overflow = "hidden";
        progressBarContainer.style.marginTop = "20px";

        const progressBar = document.createElement("div");
        progressBar.classList.add("mv-progress-bar");
        progressBar.style.width = "0%";
        progressBar.style.height = "100%";
        progressBar.style.backgroundColor = "var(--mv-primary, #FF6B6B)";
        progressBar.style.borderRadius = "2px";
        progressBar.style.transition = "width 0.3s ease";

        progressBarContainer.appendChild(progressBar);

        // 要素を組み立てる
        spinnerContainer.appendChild(spinner);
        spinnerContainer.appendChild(glowEffect);
        spinnerElement.appendChild(spinnerContainer);
        spinnerElement.appendChild(messageElement);
        spinnerElement.appendChild(progressBarContainer);
        this.shadowRoot.appendChild(spinnerElement);

        if (document.body) {
          document.body.appendChild(this.shadowHost);
        } else {
          console.error("[MangaViewer] Document body not available");
          return null;
        }

        // プログレスバーの初期アニメーション（一定の動き）
        this.startProgressAnimation();

        return this.shadowHost;
      } catch (error) {
        console.error("[MangaViewer] Error showing loading spinner:", error);
        return null;
      }
    }

    /**
     * プログレスバーのアニメーションを開始する
     */
    startProgressAnimation() {
      try {
        if (!this.shadowRoot) {
          console.error("[MangaViewer] startProgressAnimation: shadowRoot is null");
          return;
        }

        const progressBar = this.shadowRoot.querySelector(".mv-progress-bar");
        if (!progressBar) {
          console.error("[MangaViewer] startProgressAnimation: progress bar element not found");
          return;
        }

        let width = 0;
        const maxPreloadWidth = 90; // 最大90%まで自動的に進む

        this.progressInterval = setIntervalSafely(() => {
          if (width >= maxPreloadWidth) {
            if (this.progressInterval) {
              clearInterval(this.progressInterval);
              this.progressInterval = null;
            }
            return;
          }

          // 徐々に遅くなる進行
          const increment = ((maxPreloadWidth - width) / 100) * 3;
          width += Math.max(0.1, increment);

          if (width > maxPreloadWidth) width = maxPreloadWidth;

          if (progressBar && progressBar.style) {
            progressBar.style.width = `${width}%`;
          }
        }, 100);
      } catch (error) {
        console.error("[MangaViewer] startProgressAnimation: failed to start interval:", error);
      }
    }

    /**
     * プログレスバーの進行状況を設定する
     * @param {number} percent - 0-100の間の数値
     */
    setProgress(percent) {
      if (!this.shadowRoot) {
        console.error("[MangaViewer] setProgress: shadowRoot is null");
        return;
      }

      const progressBar = this.shadowRoot.querySelector(".mv-progress-bar");
      if (!progressBar) {
        console.error("[MangaViewer] setProgress: progress bar element not found");
        return;
      }

      try {
        // 既存のインターバルをクリア
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }

        progressBar.style.width = `${percent}%`;
      } catch (error) {
        console.error("[MangaViewer] setProgress: failed to update progress:", error);
      }
    }

    /**
     * ローディングが完了したことを表示する
     */
    setComplete() {
      this.setProgress(100);

      if (this.shadowRoot) {
        const spinnerElement = this.shadowRoot.querySelector(".manga-viewer-loading");
        if (spinnerElement) {
          spinnerElement.classList.add("mv-loading-complete");
        }

        const spinner = this.shadowRoot.querySelector(".mv-spinner");
        if (spinner) {
          spinner.classList.add("mv-spinner-complete");
        }
      }
    }

    /**
     * ローディングスピナーを非表示にする
     */
    hide() {
      try {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }

        if (this.shadowHost && this.shadowHost.parentNode) {
          // フェードアウトアニメーション
          this.shadowHost.style.opacity = "0";
          setTimeoutSafely(() => {
            try {
              if (this.shadowHost && this.shadowHost.parentNode) {
                this.shadowHost.parentNode.removeChild(this.shadowHost);
                this.shadowHost = null;
                this.shadowRoot = null;
              }
            } catch (removeError) {
              console.error("[MangaViewer] Error removing spinner element:", removeError);
            }
          }, 300);
        }
      } catch (error) {
        console.error("[MangaViewer] Error hiding loading spinner:", error);
      }
    }

    /**
     * ローディングメッセージを更新する
     * @param {string} message - 新しいメッセージ
     * @param {number} progressPercent - 進行状況（0-100）
     */
    updateMessage(message, progressPercent = null) {
      if (this.shadowRoot) {
        const messageElement = this.shadowRoot.querySelector(".mv-message");
        if (messageElement) {
          // メッセージの更新効果
          messageElement.style.opacity = "0";
          setTimeout(() => {
            messageElement.textContent = message;
            messageElement.style.opacity = "1";
          }, 150);
        }

        // 進行状況が指定されている場合は更新
        if (progressPercent !== null) {
          this.setProgress(progressPercent);
        }
      }
    }
  }

  // チャプターナビゲーションクラス
  class ChapterNavigator {
    constructor() {
      this.prevChapterSelectors = [".nav-button.prev", ".rd_sd-button_item.rd_top-left"];
      this.nextChapterSelectors = [".nav-button.next", ".rd_sd-button_item.rd_top-right"];

      // nicomanga系ドメイン向けの優先セレクタを先頭に追加
      const h = location.hostname;
      const isNicoManga = /nicomanga\.com$/.test(h) || /nico.*manga/.test(h);
      if (isNicoManga) {
        this.prevChapterSelectors.unshift(
          'a[rel="prev"]',
          'link[rel="prev"]',
          ".pager__item--prev a",
          "a.pager-prev",
          'a[aria-label="前へ"]'
        );
        this.nextChapterSelectors.unshift(
          'a[rel="next"]',
          'link[rel="next"]',
          ".pager__item--next a",
          "a.pager-next",
          'a[aria-label="次へ"]'
        );
      }

      this.isNavigating = false;
    }

    // 汎用フォールバック（最後に走る簡易ヒューリスティクス）
    _fallbackFind(dir /* 'next'|'prev' */) {
      try {
        // 1) <link rel="next|prev">
        const link = document.querySelector(`link[rel="${dir}"]`);
        if (link && link.href) return link.href;
        // 2) rel付きの <a>
        const relA = document.querySelector(`a[rel="${dir}"]`);
        if (relA && relA.href) return relA.href;
        // 3) テキスト・矢印で推定
        const patterns =
          dir === "next"
            ? [/^\s*(次|next|›|»)\s*$/i, /(次|next|›|»)/i]
            : [/^\s*(前|prev|‹|«)\s*$/i, /(前|prev|‹|«)/i];
        const candidates = Array.from(document.querySelectorAll("a[href]"));
        for (const a of candidates) {
          const t = (a.textContent || "").trim();
          if (patterns.some((re) => re.test(t))) return a.href;
        }
        return null;
      } catch (e) {
        return null;
      }
    }

    /**
     * 前のチャプターへ移動する
     * @returns {boolean} 移動が成功したかどうか
     */
    navigatePrevChapter() {
      try {
        for (const selector of this.prevChapterSelectors) {
          const button = document.querySelector(selector);
          if (button) {
            try {
              localStorage.setItem("mangaViewer_autoLaunch", "true");
            } catch {}
            if (button.hasAttribute("href")) {
              const href = button.getAttribute("href");
              if (href) {
                window.location.assign(href);
                return true;
              }
            }
            button.click();
            return true;
          }
        }
        // フォールバック
        const fb = this._fallbackFind("prev");
        if (fb) {
          try {
            localStorage.setItem("mangaViewer_autoLaunch", "true");
          } catch {}
          window.location.assign(fb);
          return true;
        }
        console.warn("[MangaViewer] navigatePrevChapter: no prev button found");
        return false;
      } catch (e) {
        console.warn("[MangaViewer] navigatePrevChapter: error:", e);
        return false;
      }
    }

    /**
     * 次のチャプターへ移動する
     * @returns {boolean} 移動が成功したかどうか
     */
    navigateNextChapter() {
      try {
        for (const selector of this.nextChapterSelectors) {
          const button = document.querySelector(selector);
          if (button) {
            try {
              localStorage.setItem("mangaViewer_autoLaunch", "true");
            } catch {}
            if (button.hasAttribute("href")) {
              const href = button.getAttribute("href");
              if (href) {
                window.location.assign(href);
                return true;
              }
            }
            button.click();
            return true;
          }
        }
        // フォールバック
        const fb = this._fallbackFind("next");
        if (fb) {
          try {
            localStorage.setItem("mangaViewer_autoLaunch", "true");
          } catch {}
          window.location.assign(fb);
          return true;
        }
        console.warn("[MangaViewer] navigateNextChapter: no next button found");
        return false;
      } catch (e) {
        console.warn("[MangaViewer] navigateNextChapter: error:", e);
        return false;
      }
    }

    /**
     * チャプター移動中かどうかをチェックし、移動中であればビューアを自動起動する
     * @returns {boolean} ビューアを自動起動する必要があるかどうか
     */
    checkAutoLaunch() {
      try {
        const shouldAutoLaunch = localStorage.getItem("mangaViewer_autoLaunch") === "true";
        if (shouldAutoLaunch) {
          try {
            // フラグをリセット
            localStorage.removeItem("mangaViewer_autoLaunch");
          } catch (storageError) {
            console.error(
              "[MangaViewer] checkAutoLaunch: failed to remove localStorage flag:",
              storageError
            );
            // localStorage操作が失敗してもtrueを返す（自動起動は実行）
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("[MangaViewer] checkAutoLaunch: unexpected error:", error);
        return false;
      }
    }
  }

  // ビューアコンポーネント
  const ViewerComponent = ({ images, onClose, initialAutoNav = true }) => {
    const [currentSpreadIndex, setCurrentSpreadIndex] = React.useState(0);
    const [scale, setScale] = React.useState(1);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [turnDirection, setTurnDirection] = React.useState(null);
    const [bounceDirection, setBounceDirection] = React.useState(null);
    const [autoChapterNavigation, setAutoChapterNavigation] = React.useState(initialAutoNav);
    const [animatingPage, setAnimatingPage] = React.useState(null); // 左または右のどちらのページをアニメーションするか
    const [showZoomIndicator, setShowZoomIndicator] = React.useState(false);
    const [hintsVisible, setHintsVisible] = React.useState(false);
    const [hasShownInitialHint, setHasShownInitialHint] = React.useState(false);
    const [isMouseActive, setIsMouseActive] = React.useState(false);
    const [chapterTitle, setChapterTitle] = React.useState(""); // チャプタータイトルの状態を追加
    // 追加: マウス位置と拡大縮小に関する状態
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [transformState, setTransformState] = React.useState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    // スリムなプログレスバーの状態を追加
    const [progressState, setProgressState] = React.useState({
      visible: false,
      percent: 0,
      message: "",
      phase: "init", // 処理フェーズを追加（init, loading, complete）
    });
    // 画像が0枚の場合に表示するリトライボタンの状態
    const [showRetryButton, setShowRetryButton] = React.useState(false);
    const [isRetrying, setIsRetrying] = React.useState(false);

    // 右側の画像のwidthを追跡するための状態を追加
    const [rightImageWidth, setRightImageWidth] = React.useState(null);

    const viewerRef = React.useRef(null);
    const mainViewerRef = React.useRef(null); // メインビューア部分への参照
    const chapterNavigator = React.useRef(new ChapterNavigator());
    const zoomIndicatorTimeout = React.useRef(null);
    const hintsRef = React.useRef(null);
    const mouseActivityTimer = React.useRef(null);

    // タッチ操作用の状態を追加
    const [touchStartX, setTouchStartX] = React.useState(0);
    const [touchStartY, setTouchStartY] = React.useState(0);
    const [touchStartTime, setTouchStartTime] = React.useState(0);
    const [initialPinchDistance, setInitialPinchDistance] = React.useState(null);
    const [initialScale, setInitialScale] = React.useState(1);
    const [showTurnIndicator, setShowTurnIndicator] = React.useState(false);
    const [turnIndicatorSide, setTurnIndicatorSide] = React.useState(null);

    // === 追加: 最新のページインデックスとアニメーション状態を保持するRef ===
    const currentSpreadIndexRef = React.useRef(0);
    React.useEffect(() => {
      currentSpreadIndexRef.current = currentSpreadIndex;
    }, [currentSpreadIndex]);

    const isAnimatingRef = React.useRef(false);
    React.useEffect(() => {
      isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    // グローバルなプログレス更新関数を公開
    React.useEffect(() => {
      // グローバル関数として公開
      unsafeWindow.MangaViewer = unsafeWindow.MangaViewer || {};

      // バックグラウンド処理の進捗を設定する関数
      unsafeWindow.MangaViewer.updateProgress = (percent, message, phase = null) => {
        setProgressState((prev) => {
          // フェーズが変わった場合は新しいフェーズを設定
          const newPhase = phase || prev.phase;

          // 進捗が減少する更新は無視する（常に増加のみ）
          // ただし、フェーズが変わった場合は例外
          if (percent < prev.percent && newPhase === prev.phase) {
            return prev;
          }

          return {
            visible: true,
            percent: percent,
            message: message || "",
            phase: newPhase,
          };
        });

        // 100%になったら2秒後に非表示
        if (percent >= 100) {
          setTimeout(() => {
            setProgressState((prev) => ({ ...prev, visible: false }));
          }, 2000);
        }
      };

      // クリーンアップ
      return () => {
        if (unsafeWindow.MangaViewer) {
          unsafeWindow.MangaViewer.updateProgress = null;
        }
      };
    }, []);

    // チャプター情報を取得
    React.useEffect(() => {
      try {
        // .breadcrumb-item.activeからチャプター番号を取得
        const breadcrumbItem = document.querySelector(".breadcrumb-item.active");
        if (breadcrumbItem) {
          try {
            const chapterText = breadcrumbItem.textContent.trim().match(/第話 (\d+)/);
            if (chapterText && chapterText[1]) {
              setChapterTitle(`第${chapterText[1]}話`);
            } else {
              console.error(
                "[MangaViewer] Chapter info: failed to parse chapter number from breadcrumb"
              );
            }
          } catch (parseError) {
            console.error("[MangaViewer] Chapter info: error parsing breadcrumb text:", parseError);
          }
        } else {
          // 代替手段：タイトルからチャプター情報を取得
          try {
            const titleElem = document.querySelector("title");
            if (titleElem) {
              const titleText = titleElem.textContent.trim();
              // タイトルから章番号を抽出する正規表現
              const chapterMatch = titleText.match(/第(\d+)話/);
              if (chapterMatch && chapterMatch[1]) {
                setChapterTitle(`第${chapterMatch[1]}話`);
              }
            }
          } catch (titleError) {
            console.error("[MangaViewer] Chapter info: error parsing title:", titleError);
          }
        }
      } catch (error) {
        console.error("[MangaViewer] Chapter info: unexpected error:", error);
      }
    }, []);

    // 画像が0枚かどうかをチェック
    React.useEffect(() => {
      // 画像が0枚の場合はリトライボタンを表示
      setShowRetryButton(images.length === 0);
    }, [images]);

    // ビューアマウント時にフォーカスを設定
    React.useEffect(() => {
      if (viewerRef.current) {
        // フォーカスを設定し、キーボードイベントを確実に受け取れるようにする
        viewerRef.current.focus();

        // iframe要素のフォーカスを封じる（Disqusなどがキーイベントを奪うのを防ぐ）
        try {
          document.querySelectorAll("iframe").forEach((iframe) => {
            iframe.setAttribute("tabindex", "-1");
          });
        } catch (iframeError) {
          console.warn("[MangaViewer] Error setting iframe tabindex:", iframeError);
        }

        // フォーカスが外れた場合に再度フォーカスを設定する
        const handleFocusOut = (e) => {
          // 入力要素以外にフォーカスが移った場合は、ビューアに戻す
          const newActiveElement = e.relatedTarget || document.activeElement;
          if (
            newActiveElement &&
            (newActiveElement.tagName === "INPUT" ||
              newActiveElement.tagName === "TEXTAREA" ||
              newActiveElement.tagName === "SELECT" ||
              newActiveElement.isContentEditable)
          ) {
            // 入力要素の場合はフォーカスを維持
            return;
          }

          // それ以外の場合はビューアにフォーカスを戻す
          setTimeout(() => {
            if (viewerRef.current && globalState.isViewerActive) {
              viewerRef.current.focus();
            }
          }, 10);
        };

        viewerRef.current.addEventListener("focusout", handleFocusOut);

        return () => {
          if (viewerRef.current) {
            viewerRef.current.removeEventListener("focusout", handleFocusOut);
          }
        };
      }
    }, []);

    // 画像再収集関数
    const handleRetryCollection = () => {
      try {
        setIsRetrying(true);
        // スピナーを表示
        const spinner = new LoadingSpinner();
        spinner.show("画像を再収集中...");

        // 少し遅延してから画像収集を再試行（DOMがより完全に読み込まれる時間を確保）
        setTimeout(async () => {
          try {
            const loader = new DataLoader();
            loader.setSpinner(spinner);

            spinner.updateMessage("画像を再検索中...");
            const result = await loader.collectImageUrls();

            if (result.initialUrls.length > 0) {
              // 新しい画像が見つかった場合、onClose()を呼び出してビューアを閉じる
              // その後、launchViewer()を呼び出して新しい画像でビューアを再起動
              spinner.hide();
              onClose();

              try {
                launchViewer(); // グローバル関数のlaunchViewerを呼び出す
              } catch (launchError) {
                console.error(
                  "[MangaViewer] handleRetryCollection: failed to launch viewer:",
                  launchError
                );
                setIsRetrying(false);
                setShowRetryButton(true);
              }
            } else {
              // 画像が見つからなかった場合
              spinner.updateMessage("画像が見つかりませんでした。");
              setTimeout(() => {
                spinner.hide();
                setIsRetrying(false);
                // リトライボタンを再表示
                setShowRetryButton(true);
              }, 2000);
            }
          } catch (error) {
            console.error("[MangaViewer] handleRetryCollection: error during image collection:", error);
            spinner.updateMessage("エラーが発生しました。");
            setTimeout(() => {
              spinner.hide();
              setIsRetrying(false);
              // リトライボタンを再表示
              setShowRetryButton(true);
            }, 2000);
          }
        }, 1000); // 1秒待機してからリトライ
      } catch (error) {
        console.error("[MangaViewer] handleRetryCollection: unexpected error:", error);
        setIsRetrying(false);
        setShowRetryButton(true);
      }
    };

    // マウスアクティビティをリセットする関数
    const resetMouseActivity = () => {
      setIsMouseActive(true);

      // 既存のタイマーをクリア
      if (mouseActivityTimer.current) {
        clearTimeout(mouseActivityTimer.current);
      }

      // 新しいタイマーをセット（設定時間後にマウスはインアクティブと判断）
      mouseActivityTimer.current = setTimeout(() => {
        setIsMouseActive(false);
        // マウスがインアクティブになったらヒントも非表示にする
        setHintsVisible(false);
      }, MOUSE_INACTIVITY_DELAY);
    };

    // マウスの位置を監視してヒント表示を制御するイベントハンドラ
    React.useEffect(() => {
      // 既に初期表示が終わっている場合のみ
      if (hasShownInitialHint && viewerRef.current) {
        // マウス移動イベントのハンドラ
        const handleMouseMove = (e) => {
          if (!hintsRef.current) return;

          // マウスアクティビティをリセット
          resetMouseActivity();

          // マウス位置を更新 (追加)
          if (mainViewerRef.current) {
            const rect = mainViewerRef.current.getBoundingClientRect();
            setMousePosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }

          // ビューアの位置情報を取得
          const viewerRect = viewerRef.current.getBoundingClientRect();

          // マウスがビューアの下部30%以内にあるかをチェック
          const bottomThreshold = viewerRect.height * 0.7; // 下部30%の境界線
          const mouseY = e.clientY - viewerRect.top;

          // 下部領域にマウスがある場合はヒントを表示
          if (mouseY > bottomThreshold) {
            setHintsVisible(true);
          } else {
            setHintsVisible(false);
          }
        };

        // マウスがビューア外に出た時のハンドラ
        const handleMouseLeave = () => {
          setHintsVisible(false);
        };

        // クリーンアップ関数
        return () => {
          if (mouseActivityTimer.current) {
            clearTimeout(mouseActivityTimer.current);
          }
        };
      }
    }, [hasShownInitialHint]);

    // 現在の見開きページの画像URLを取得
    const getCurrentSpread = () => {
      const startIdx = currentSpreadIndex * 2;
      const leftPageIndex = startIdx + 1;
      const rightPageIndex = startIdx;

      // 画像が奇数枚の場合は最後にダミーページを追加
      const isLastSpread = Math.ceil(images.length / 2) - 1 === currentSpreadIndex;
      const isOddNumberOfImages = images.length % 2 === 1;

      // 最後の見開きで奇数枚の場合、ダミーページを左側に表示（空いた部分に配置）
      if (isLastSpread && isOddNumberOfImages && leftPageIndex === images.length) {
        return [
          null, // 左ページは空（ダミーページを表示）
          rightPageIndex < images.length ? images[rightPageIndex] : null,
        ];
      }

      // 通常の処理
      // 範囲外のインデックスの場合はnullを返す
      return [
        leftPageIndex < images.length ? images[leftPageIndex] : null,
        rightPageIndex < images.length ? images[rightPageIndex] : null,
      ];
    };

    // ズームインジケータを表示する
    const showZoomLevel = () => {
      // ズーム操作時はヘッダーを表示したままにする（ズーム値を確認するため）
      resetMouseActivity();

      // すでに実行中のタイマーがあればクリア
      if (zoomIndicatorTimeout.current) {
        clearTimeout(zoomIndicatorTimeout.current);
      }

      setShowZoomIndicator(true);

      // 1.5秒後に非表示にする
      zoomIndicatorTimeout.current = setTimeout(() => {
        setShowZoomIndicator(false);
      }, 1500);
    };

    // ページめくりアニメーション処理
    const animatePageTurn = React.useCallback(
      (direction, pageSide = null) => {
        // ページめくりではヘッダーを表示させたくないので
        setIsMouseActive(false);

        // 最新のアニメーション状態を参照
        if (isAnimatingRef.current) {
          return;
        }

        // 現在のページインデックスを最新のRefから取得
        const currentIndex = currentSpreadIndexRef.current;
        const maxSpreadIndex = Math.ceil(images.length / 2) - 1;

        // 画像の検証・追加がまだ進行中の場合（プログレスバーがcompleteでない）、
        // 境界に達してもチャプター移動は実行しないようにする
        const isLoading = progressState && progressState.phase !== "complete";

        // 範囲外へのめくりを防止
        if (direction === "prev" && currentIndex <= 0) {
          showBounceAnimation("left");
          if (!isLoading && autoChapterNavigation && images.length > 0) {
            const success = chapterNavigator.current.navigatePrevChapter();
            if (success) onClose();
          }
          return;
        }
        if (direction === "next" && currentIndex >= maxSpreadIndex) {
          // ---- 修正: 初期ロード中は末尾扱いを保留して短時間だけ再試行 ----
          // progressState.phase が "complete" になる前は画像配列が増える最中のことがある。
          // 特に 1 見開き目（currentIndex===0）では initialUrls が 2 枚だけのケースが多い。
          if (isLoading && currentIndex === 0) {
            const startTs = Date.now();
            const retry = () => {
              // 画像が増えていれば maxSpreadIndex が伸びる
              const newMax = Math.ceil(images.length / 2) - 1;
              if (newMax > currentIndex) {
                // 進めるようになったので「次へ」をやり直し
                // setTimeoutでイベントループを1回挟んでから再実行
                setTimeout(() => {
                  try {
                    animatePageTurn("next", pageSide);
                  } catch {}
                }, 0);
                return;
              }
              // タイムアウト（最大 ~2.5s）まで待って再試行
              if (Date.now() - startTs < 2500) {
                setTimeout(retry, 120);
              } else {
                // それでも増えなければ従来どおりバウンス
                showBounceAnimation("right");
              }
            };
            // 少し待ってからチェック開始（検証・追加が走る猶予）
            setTimeout(retry, 120);
            return;
          }
          // ---- ここから先は従来どおり（ロード完了後・本当に末尾のとき） ----
          showBounceAnimation("right");
          if (!isLoading && autoChapterNavigation && images.length > 0) {
            const success = chapterNavigator.current.navigateNextChapter();
            if (success) onClose();
          }
          return;
        }

        // アニメーション開始
        setIsAnimating(true);
        isAnimatingRef.current = true;
        setTurnDirection(direction);
        setAnimatingPage(pageSide);

        // インデックスを即時更新
        if (direction === "prev") {
          setCurrentSpreadIndex((prev) => prev - 1);
        } else {
          setCurrentSpreadIndex((prev) => prev + 1);
        }

        // アニメーション完了後リセット
        setTimeout(() => {
          setIsAnimating(false);
          isAnimatingRef.current = false;
          setTurnDirection(null);
          setAnimatingPage(null);
        }, 200);
      },
      [images.length, autoChapterNavigation, onClose, chapterNavigator, progressState]
    );

    // 境界到達時のバウンスアニメーション
    const showBounceAnimation = (direction) => {
      setBounceDirection(direction);
      setTimeout(() => setBounceDirection(null), 300); // 300msでアニメーション終了
    };

    // バウンスアニメーションのスタイルを取得
    const getBounceStyle = () => {
      if (!bounceDirection) return {};

      if (bounceDirection === "left") {
        return {
          animation: "bounceLeft 0.3s ease-in-out",
        };
      } else if (bounceDirection === "right") {
        return {
          animation: "bounceRight 0.3s ease-in-out",
        };
      }

      return {};
    };

    // バウンスアニメーション用のスタイルは既にgetViewerStyles()に含まれているため、
    // 追加のスタイルシート注入は不要（シャドウDOM内で完結）

    // ページめくり処理
    const handlePageTurn = React.useCallback(
      (direction, pageSide = null) => {
        // ページめくり時にヘッダーを即座に隠す（画像を見やすくするため）
        setIsMouseActive(false);
        setHintsVisible(false);

        // ビューアに再フォーカスしてキー操作の継続性を保つ
        if (viewerRef.current) {
          viewerRef.current.focus();
        }

        animatePageTurn(direction, pageSide);
      },
      [animatePageTurn]
    );

    // チャプター自動移動の切り替え
    const toggleAutoChapterNavigation = () => {
      setAutoChapterNavigation((prev) => !prev);
    };

    // マウスドラッグ処理
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
      // ドラッグ処理の前にマウスアクティビティをリセット（常にマウス移動を検知）
      resetMouseActivity();

      // マウス位置を更新
      if (mainViewerRef.current) {
        const rect = mainViewerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }

      // ヒントの表示制御
      if (viewerRef.current && hintsRef.current) {
        const viewerRect = viewerRef.current.getBoundingClientRect();
        const bottomThreshold = viewerRect.height * 0.7; // 下部30%の境界線
        const mouseY = e.clientY - viewerRect.top;

        // 下部領域にマウスがある場合はヒントを表示
        if (mouseY > bottomThreshold) {
          setHintsVisible(true);
        } else {
          setHintsVisible(false);
        }
      }

      // 元のドラッグ処理
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const threshold = 100; // ドラッグのしきい値

      if (Math.abs(deltaX) > threshold) {
        // 画像エリアを取得して、左右どちらのエリアでドラッグが発生したかを判定
        const spreadContainer = viewerRef.current.querySelector(".mv-spread-container");
        const imageElements = spreadContainer ? spreadContainer.querySelectorAll("img") : [];
        if (imageElements.length > 0) {
          // ドラッグの開始位置がどの画像エリアにあるかを判定
          const startPosX = startX;

          // 右側の画像（左ページ）のエリア内でドラッグ開始
          const leftPageRect = imageElements[0] ? imageElements[0].getBoundingClientRect() : null;
          const rightPageRect = imageElements[1] ? imageElements[1].getBoundingClientRect() : null;

          if (leftPageRect && rightPageRect) {
            // 左右の画像エリアを判定して方向を決定
            if (startPosX >= leftPageRect.left && startPosX <= leftPageRect.right) {
              // 右側の画像エリア（左ページ）
              handlePageTurn("next", "left"); // 左ページをめくる = 次のページ
            } else if (startPosX >= rightPageRect.left && startPosX <= rightPageRect.right) {
              // 左側の画像エリア（右ページ）
              handlePageTurn("prev", "right"); // 右ページをめくる = 前のページ
            } else {
              // 画像エリア外でのドラッグ - 従来通りの方向判定
              if (deltaX > 0) {
                handlePageTurn("prev", "right");
              } else {
                handlePageTurn("next", "left");
              }
            }
          } else {
            // 画像が1枚以下の場合は従来通りの判定
            if (deltaX > 0) {
              handlePageTurn("prev", "right");
            } else {
              handlePageTurn("next", "left");
            }
          }
        } else {
          // 画像がない場合は従来通りの判定
          if (deltaX > 0) {
            handlePageTurn("prev", "right");
          } else {
            handlePageTurn("next", "left");
          }
        }

        setIsDragging(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // マウスクリックでのページめくり
    const handleClick = (e) => {
      // エンドページの要素を検索
      const endPageElements = viewerRef.current.querySelectorAll(".mv-end-page");

      // エンドページがあれば、クリックで次のチャプターへ
      if (endPageElements.length > 0) {
        for (const endPage of endPageElements) {
          const rect = endPage.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            // エンドページをクリックした場合、自動チャプター移動が有効なら次のチャプターへ
            if (autoChapterNavigation) {
              const success = chapterNavigator.current.navigateNextChapter();
              if (success) {
                onClose(); // ビューアを閉じる（新しいページで再度開く）
                return;
              }
            }
            return;
          }
        }
      }

      // 画像要素を取得（見開きコンテナ内から）
      const spreadContainer = viewerRef.current.querySelector(".mv-spread-container");
      const imageElements = spreadContainer ? spreadContainer.querySelectorAll("img") : [];
      if (imageElements.length === 0) return;

      // 注意: spread[0]は左ページ（viewerでは右側に表示）、spread[1]は右ページ（viewerでは左側に表示）

      // 左開きの本（日本の漫画など）の動作に合わせる
      // - 左側の画像（右ページ）をクリックすると前のページへ
      // - 右側の画像（左ページ）をクリックすると次のページへ

      // 左側に表示される画像（右ページ、spread[1]に対応）
      if (imageElements[1]) {
        const rightPageRect = imageElements[1].getBoundingClientRect();
        // 右ページをクリックした場合は前のページへ
        if (e.clientX >= rightPageRect.left && e.clientX <= rightPageRect.right) {
          handlePageTurn("prev", "right");
          return;
        }
      }

      // 右側に表示される画像（左ページ、spread[0]に対応）
      if (imageElements[0]) {
        const leftPageRect = imageElements[0].getBoundingClientRect();
        // 左ページをクリックした場合は次のページへ
        if (e.clientX >= leftPageRect.left && e.clientX <= leftPageRect.right) {
          handlePageTurn("next", "left");
          return;
        }
      }
    };

    // キーボードイベントハンドラ
    React.useEffect(() => {
      const handleKeyPress = (event) => {
        // ビューアがアクティブな時のみキーイベントを処理
        // より柔軟な条件に変更：ビューアが存在し、かつ他の入力要素にフォーカスがない場合
        if (!viewerRef.current || !globalState.isViewerActive) {
          return;
        }

        // 入力要素（input, textarea, select）にフォーカスがある場合はキーイベントを無視
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT" ||
            activeElement.isContentEditable)
        ) {
          return;
        }

        // マンガビューアで処理するキーのリスト
        const handledKeys = [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "a",
          "A",
          "d",
          "D",
          "w",
          "W",
          "s",
          "S",
          "q",
          "Q",
          "h",
          "H",
        ];

        // マンガビューアで処理するキーの場合のみ、ブラウザのデフォルト動作を防ぐ
        const isHandledKey = handledKeys.includes(event.key);

        // ブラウザ機能キー（F1-F12、Ctrl+キー等）は除外
        const isBrowserFunctionKey =
          event.key.startsWith("F") || event.ctrlKey || event.altKey || event.metaKey;

        // マンガビューアで処理するキーでかつブラウザ機能キーでない場合のみpreventDefault
        if (isHandledKey && !isBrowserFunctionKey) {
          event.preventDefault(); // デフォルト動作を防ぐ
          event.stopPropagation(); // イベントの伝播を止める
        }

        // マンガビューアで処理しないキーの場合は早期リターン
        if (!isHandledKey) {
          return;
        }

        // キー入力もユーザーアクションなのでアクティビティをリセット
        // ただし、ページめくり系のキーは除外（ヘッダーを隠したままにするため）
        const isPageTurnKey = ["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key);
        if (!isPageTurnKey) {
          resetMouseActivity();
        }

        switch (event.key) {
          case "ArrowLeft":
          case "a":
          case "A":
            // アニメーション中でなければページめくりを実行
            if (!isAnimating) {
              handlePageTurn("next", "left"); // 左へ移動 = 次のページへ（右から左へ読む場合）
            }
            break;
          case "ArrowRight":
          case "d":
          case "D":
            // アニメーション中でなければページめくりを実行
            if (!isAnimating) {
              handlePageTurn("prev", "right"); // 右へ移動 = 前のページへ（右から左へ読む場合）
            }
            break;
          case "w":
          case "W":
          case "ArrowUp":
            // 拡大処理
            if (mainViewerRef.current) {
              const viewerRect = mainViewerRef.current.getBoundingClientRect();

              // マウスカーソルの位置を拡大の中心点とする
              const cursorX = mousePosition.x;
              const cursorY = mousePosition.y;

              // 拡大前のカーソル位置（現在のスケールとオフセットを考慮）
              const beforeZoomX = cursorX - transformState.translateX;
              const beforeZoomY = cursorY - transformState.translateY;

              // ピンチポイントの相対座標
              const pinchX = beforeZoomX / transformState.scale;
              const pinchY = beforeZoomY / transformState.scale;

              // 新しいスケール
              const newScale = Math.min(transformState.scale * 1.1, 3);

              // 新しいスケールでのカーソル位置
              const afterZoomX = pinchX * newScale;
              const afterZoomY = pinchY * newScale;

              // 位置の差分を計算
              const deltaX = afterZoomX - beforeZoomX;
              const deltaY = afterZoomY - beforeZoomY;

              // 新しい変換状態を設定
              setTransformState({
                scale: newScale,
                translateX: transformState.translateX - deltaX,
                translateY: transformState.translateY - deltaY,
              });

              // スケール値を別途保存
              setScale(newScale);
              showZoomLevel();
            }
            break;
          case "s":
          case "S":
          case "ArrowDown":
            // 縮小処理
            if (mainViewerRef.current) {
              const viewerRect = mainViewerRef.current.getBoundingClientRect();

              // マウスカーソルの位置を縮小の中心点とする
              const cursorX = mousePosition.x;
              const cursorY = mousePosition.y;

              // 縮小前のカーソル位置（現在のスケールとオフセットを考慮）
              const beforeZoomX = cursorX - transformState.translateX;
              const beforeZoomY = cursorY - transformState.translateY;

              // ピンチポイントの相対座標
              const pinchX = beforeZoomX / transformState.scale;
              const pinchY = beforeZoomY / transformState.scale;

              // 新しいスケール
              const newScale = Math.max(transformState.scale * 0.9, 0.5);

              // 新しいスケールでのカーソル位置
              const afterZoomX = pinchX * newScale;
              const afterZoomY = pinchY * newScale;

              // 位置の差分を計算
              const deltaX = afterZoomX - beforeZoomX;
              const deltaY = afterZoomY - beforeZoomY;

              // 新しい変換状態を設定
              setTransformState({
                scale: newScale,
                translateX: transformState.translateX - deltaX,
                translateY: transformState.translateY - deltaY,
              });

              // スケール値を別途保存
              setScale(newScale);
              showZoomLevel();
            }
            break;
          case "q":
          case "Q":
            // ズームリセット
            setTransformState({
              scale: 1,
              translateX: 0,
              translateY: 0,
            });
            setScale(1);
            showZoomLevel();
            break;
          case "h":
          case "H":
            // Hキーでヒント表示を切り替え（ユーザーが明示的に表示したい場合）
            setHintsVisible((prev) => !prev);
            break;
        }
      };

      // 早期フックがあるならグローバルディスパッチャに差し替え
      globalState.keyDispatcher = handleKeyPress;

      // 念のため、早期フックが無い環境（古いTM等）のフォールバックだけ残す
      let fallbackBound = false;
      if (!globalState.earlyKeyHookInstalled) {
        window.addEventListener("keydown", handleKeyPress, true);
        fallbackBound = true;
      }

      return () => {
        if (fallbackBound) {
          window.removeEventListener("keydown", handleKeyPress, true);
        }
        // ディスパッチャ解除
        if (globalState.keyDispatcher === handleKeyPress) {
          globalState.keyDispatcher = null;
        }
      };
    }, [transformState, mousePosition, isAnimating]); // 依存配列を最小限に変更

    // マウスホイール処理
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を止める

      // ホイール操作もユーザーアクションなのでアクティビティをリセット
      resetMouseActivity();

      // マウス位置の取得
      if (!mainViewerRef.current) return;

      const viewerRect = mainViewerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - viewerRect.left;
      const mouseY = e.clientY - viewerRect.top;

      // 拡大縮小前のマウス位置（現在のスケールとオフセットを考慮）
      const beforeZoomX = mouseX - transformState.translateX;
      const beforeZoomY = mouseY - transformState.translateY;

      // ピンチポイントの相対座標（画像上の座標をスケール込みで計算）
      const pinchX = beforeZoomX / transformState.scale;
      const pinchY = beforeZoomY / transformState.scale;

      // 新しいスケールを計算
      let newScale;
      if (e.deltaY < 0) {
        // 拡大
        newScale = Math.min(transformState.scale * 1.1, 3);
      } else {
        // 縮小
        newScale = Math.max(transformState.scale * 0.9, 0.5);
      }

      // 新しいスケールでのマウス位置
      const afterZoomX = pinchX * newScale;
      const afterZoomY = pinchY * newScale;

      // 位置の差分を計算
      const deltaX = afterZoomX - beforeZoomX;
      const deltaY = afterZoomY - beforeZoomY;

      // 新しい変換状態を設定
      setTransformState({
        scale: newScale,
        translateX: transformState.translateX - deltaX,
        translateY: transformState.translateY - deltaY,
      });

      // スケール値を別途保存（他の処理との互換性のため）
      setScale(newScale);

      // ズームレベルを表示
      showZoomLevel();
    };

    // マウス中クリック処理
    const handleMiddleClick = (e) => {
      e.preventDefault();
      e.stopPropagation(); // イベントの伝播を止める

      // ズームリセット
      setTransformState({
        scale: 1,
        translateX: 0,
        translateY: 0,
      });
      setScale(1);
      showZoomLevel();
    };

    const spread = getCurrentSpread();

    // ページごとのスタイルを生成する関数 - 綴じ線を維持する目的で不要になったので削除

    // 統合されたスプレッドコンテナ用のスタイルを生成
    const getSpreadContainerStyle = () => {
      // バウンススタイルがあれば適用
      const bounceStyle = getBounceStyle();

      // 拡大縮小と移動のスタイル
      const transformStyle = {
        transform: `scale(${transformState.scale}) translate(${transformState.translateX}px, ${transformState.translateY}px)`,
        transformOrigin: "0 0",
        transition: isAnimating ? "none" : "transform 0.1s ease-out",
      };

      return {
        ...bounceStyle,
        ...transformStyle,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        perspective: "1200px",
        position: "relative",
        transformStyle: "preserve-3d",
      };
    };

    // ページコンテナ用のスタイルを生成
    const getPageContainerStyle = (index) => {
      return {
        position: "relative",
        maxWidth: "50%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
        transformStyle: "preserve-3d",
        zIndex:
          isAnimating &&
          ((turnDirection === "next" && index === 0) || (turnDirection === "prev" && index === 1))
            ? 10
            : 0,
      };
    };

    // 個別のページ用のスタイルを生成
    const getPageStyle = (index) => {
      const isLeftPage = index === 0;
      const isRightPage = index === 1;
      const pageSide = isLeftPage ? "left" : "right";

      // アニメーションしないページの基本スタイル
      const baseStyle = {
        position: "relative",
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
        transformStyle: "preserve-3d",
        borderRadius: "3px",
      };

      // アニメーションしていない、またはこのページがアニメーション対象でない場合
      if (!isAnimating || animatingPage !== pageSide) {
        return baseStyle;
      }

      // アニメーション中のページのスタイル
      if (turnDirection === "next" && isLeftPage) {
        return {
          ...baseStyle,
          perspective: "1000px",
          transformStyle: "preserve-3d",
          animation: "turnPageForward 0.2s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
          transformOrigin: "right center", // 真ん中（綴じ目側）を中心に回転
          boxShadow: "-10px 0 15px rgba(0, 0, 0, 0.3)",
        };
      } else if (turnDirection === "prev" && isRightPage) {
        return {
          ...baseStyle,
          perspective: "1000px",
          transformStyle: "preserve-3d",
          animation: "turnPageBackward 0.2s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
          transformOrigin: "left center", // 真ん中（綴じ目側）を中心に回転
          boxShadow: "10px 0 15px rgba(0, 0, 0, 0.3)",
        };
      } else {
        // その他のアニメーション中の場合
        return {
          ...baseStyle,
          perspective: "1000px",
          transformStyle: "preserve-3d",
        };
      }
    };

    // アニメーション用のスタイルは既にgetViewerStyles()に含まれているため、
    // 追加のスタイルシート注入は不要（シャドウDOM内で完結）

    // スプレッド（現在の見開きページ）を取得
    const currentSpreadPages = getCurrentSpread();

    // ヘッダーとプログレスバーを含むトップコンポーネント
    const renderHeader = () => {
      return e(
        "div",
        {
          className: "mv-top-container",
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            // マウス非アクティブ時にヘッダーを上に隠す
            transform: isMouseActive ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.3s ease",
            zIndex: 100,
          },
        },
        [
          // ヘッダー
          e(
            "div",
            {
              key: "header",
              className: "mv-header",
            },
            [
              e(
                "div",
                {
                  key: "page-info",
                  className: "mv-header-text",
                },
                images.length === 0
                  ? "画像が見つかりません"
                  : `${currentSpreadIndex + 1} / ${Math.ceil(images.length / 2)}${
                      chapterTitle ? ` - ${chapterTitle}` : ""
                    }${
                      images.length % 2 === 1 && currentSpreadIndex === Math.ceil(images.length / 2) - 1
                        ? " (End of Contents)"
                        : ""
                    }`
              ),
              e(
                "div",
                {
                  key: "auto-navigation-toggle",
                  className: `mv-auto-nav-toggle ${autoChapterNavigation ? "" : "off"}`,
                  onClick: (e) => {
                    e.stopPropagation(); // クリックイベントの伝播を止める
                    toggleAutoChapterNavigation();
                  },
                },
                `チャプター自動移動: ${autoChapterNavigation ? "ON" : "OFF"}`
              ),
              e(
                "button",
                {
                  key: "close-button",
                  onClick: (e) => {
                    e.stopPropagation(); // クリックイベントの伝播を止める
                    onClose();
                  },
                  className: "mv-close-button",
                },
                "閉じる"
              ),
            ]
          ),

          // プログレスバー（常に存在するが、visibleがfalseなら透明）
          e(
            "div",
            {
              key: "progress-container",
              className: "mv-progress-container",
              style: {
                opacity: progressState.visible ? 1 : 0,
                transition: "opacity 0.3s ease",
              },
            },
            [
              e("div", {
                key: "progress-bar",
                className: "mv-progress-bar",
                style: {
                  width: `${progressState.percent}%`,
                },
              }),
              progressState.message
                ? e(
                    "div",
                    {
                      key: "progress-message",
                      className: "mv-progress-message",
                    },
                    progressState.message
                  )
                : null,
            ]
          ),
        ]
      );
    };

    // 右側の画像のwidthを監視するためのeffect
    React.useEffect(() => {
      if (!viewerRef.current) {
        console.error("[MangaViewer] Right image width monitor: viewerRef is null");
        return;
      }

      const updateRightImageWidth = () => {
        try {
          // シャドウDOM内で見開きコンテナを探す
          const spreadContainer = viewerRef.current.querySelector(".mv-spread-container");
          if (spreadContainer) {
            // 見開きコンテナ内の2番目のページコンテナ（右側の画像）を取得
            const rightPageContainer = spreadContainer.querySelector(".mv-page-container:nth-child(2)");
            if (rightPageContainer) {
              const rightImg = rightPageContainer.querySelector("img");
              if (rightImg) {
                setRightImageWidth(rightImg.offsetWidth);
              }
            }
          }
        } catch (error) {
          console.error("[MangaViewer] updateRightImageWidth: error updating width:", error);
        }
      };

      try {
        // 最初に一度実行
        updateRightImageWidth();

        // 画像読み込み完了時にも実行
        const observer = new MutationObserver(updateRightImageWidth);
        observer.observe(viewerRef.current, { childList: true, subtree: true });

        // リサイズ時にも更新
        window.addEventListener("resize", updateRightImageWidth);

        return () => {
          try {
            observer.disconnect();
            window.removeEventListener("resize", updateRightImageWidth);
          } catch (cleanupError) {
            console.error("[MangaViewer] Right image width monitor cleanup error:", cleanupError);
          }
        };
      } catch (error) {
        console.error("[MangaViewer] Right image width monitor setup error:", error);
      }
    }, [currentSpreadIndex]);

    // タッチ開始時の処理
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        // シングルタッチ
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
        setTouchStartTime(Date.now());
      } else if (e.touches.length === 2) {
        // ピンチ操作
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setInitialPinchDistance(distance);
        setInitialScale(scale);
      }
    };

    // タッチ移動時の処理
    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        // シングルタッチ（ページめくり）
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;

        // 水平方向の移動が垂直方向より大きい場合のみページめくりを考慮
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 50) {
            setTurnIndicatorSide("right");
            setShowTurnIndicator(true);
          } else if (deltaX < -50) {
            setTurnIndicatorSide("left");
            setShowTurnIndicator(true);
          } else {
            setShowTurnIndicator(false);
          }
        }
      } else if (e.touches.length === 2) {
        // ピンチズーム
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        if (initialPinchDistance) {
          const newScale = initialScale * (distance / initialPinchDistance);
          setScale(Math.min(Math.max(newScale, 0.5), 3));
          showZoomLevel();
        }
      }
    };

    // タッチ終了時の処理
    const handleTouchEnd = (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaTime = Date.now() - touchStartTime;
      const swipeVelocity = Math.abs(deltaX) / deltaTime;

      setShowTurnIndicator(false);

      // スワイプの速度と距離に基づいてページめくりを判定
      if (Math.abs(deltaX) > 50 || swipeVelocity > 0.5) {
        if (deltaX > 0) {
          handlePageTurn("prev", "right");
        } else {
          handlePageTurn("next", "left");
        }
      }

      setInitialPinchDistance(null);
    };

    // タッチフィードバックを表示
    const showTouchFeedback = (x, y) => {
      if (!viewerRef.current) return;

      const feedback = document.createElement("div");
      feedback.className = "mv-touch-feedback";
      feedback.style.left = `${x}px`;
      feedback.style.top = `${y}px`;
      viewerRef.current.appendChild(feedback);

      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 400);
    };

    return e(
      "div",
      {
        className: `manga-viewer-container ${isMouseActive ? "" : "mouse-inactive"}`,
        tabIndex: 0,
        style: {
          outline: "none", // フォーカス時のアウトラインを非表示
        },
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onWheel: handleWheel,
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onClick: handleClick,
        onAuxClick: handleMiddleClick,
        onFocus: () => {
          // フォーカス時にアクティビティをリセット
          resetMouseActivity();
        },
        ref: viewerRef,
      },
      [
        // モバイル用閉じるボタン
        e("button", {
          key: "mobile-close-button",
          className: "mv-mobile-close-button",
          onClick: (e) => {
            e.stopPropagation(); // クリックイベントの伝播を止める
            onClose();
          },
        }),

        // ヘッダーとプログレスバーを含むトップ部分
        renderHeader(),

        // メインビューア
        e(
          "div",
          {
            key: "viewer",
            className: "mv-main-viewer",
            ref: mainViewerRef,
            style: {
              // ヘッダーの有無に関わらず常に100%の高さを持つ
              height: "100%",
              transition: "all 0.3s ease",
              // paddingTopを削除してヘッダーが常にビューアの上に重なるようにする
            },
          },
          images.length === 0
            ? // 画像が0枚の場合のメッセージとリトライボタン
              e(
                "div",
                {
                  key: "no-images-message",
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    color: "white",
                    textAlign: "center",
                    padding: "20px",
                  },
                },
                [
                  e(
                    "div",
                    {
                      style: {
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                      },
                    },
                    "画像が見つかりませんでした"
                  ),
                  e(
                    "div",
                    {
                      style: {
                        fontSize: "16px",
                        marginBottom: "30px",
                      },
                    },
                    "ページの読み込みが完了する前に画像収集が行われた可能性があります。"
                  ),
                  showRetryButton && !isRetrying
                    ? e(
                        "button",
                        {
                          onClick: handleRetryCollection,
                          style: {
                            backgroundColor: "var(--mv-primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.3s ease",
                          },
                        },
                        "画像を再収集する"
                      )
                    : isRetrying
                    ? e(
                        "div",
                        {
                          style: {
                            fontSize: "16px",
                            color: "var(--mv-primary)",
                          },
                        },
                        "再収集中..."
                      )
                    : null,
                ]
              )
            : // 通常のビューア表示（画像がある場合）
              [
                // 右端インジケーター (最初のページの時)
                currentSpreadIndex === 0
                  ? e(
                      "div",
                      {
                        key: "right-edge-indicator",
                        className: "mv-edge-indicator mv-right-indicator",
                      },
                      autoChapterNavigation ? "前のチャプターへ" : "最初のページ"
                    )
                  : null,

                // 見開きページを単一のコンテナで囲む
                e(
                  "div",
                  {
                    key: "spread-container",
                    className: "mv-spread-container",
                    style: getSpreadContainerStyle(),
                  },
                  [
                    // 見開きページ表示
                    ...currentSpreadPages.map((url, index) =>
                      url
                        ? e(
                            "div",
                            {
                              key: `page-container-${index}`,
                              className: "mv-page-container",
                              style: getPageContainerStyle(index),
                            },
                            [
                              e("img", {
                                key: `page-${index}`,
                                src: url,
                                className: `mv-page ${
                                  isAnimating &&
                                  ((turnDirection === "next" && index === 0) ||
                                    (turnDirection === "prev" && index === 1))
                                    ? "mv-page-animating"
                                    : ""
                                }`,
                                style: getPageStyle(index),
                                draggable: false,
                              }),
                              e("div", {
                                key: `page-edge-${index}`,
                                className: `mv-page-edge ${index === 0 ? "right" : "left"}`,
                              }),
                            ]
                          )
                        : e(
                            "div",
                            {
                              key: `empty-${index}`,
                              className: "mv-page-container",
                              style: {
                                ...getPageContainerStyle(index),
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              },
                            },
                            // 奇数ページの最後のスプレッドで左側が空の場合、終了ページを表示
                            index === 0 &&
                              images.length % 2 === 1 &&
                              currentSpreadIndex === Math.ceil(images.length / 2) - 1
                              ? e(
                                  "div",
                                  {
                                    key: `end-page-${index}`,
                                    className: "mv-end-page",
                                    style: {
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      width: rightImageWidth ? `${rightImageWidth}px` : "100%",
                                      height: "100%",
                                      backgroundColor: "#f5f5f5",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      padding: "20px",
                                      boxSizing: "border-box",
                                      textAlign: "center",
                                      cursor: "pointer", // クリック可能であることを示す
                                    },
                                  },
                                  [
                                    e(
                                      "div",
                                      {
                                        style: {
                                          fontSize: "24px",
                                          fontWeight: "bold",
                                          marginBottom: "20px",
                                          color: "#333",
                                        },
                                      },
                                      "End of Contents"
                                    ),
                                    e(
                                      "div",
                                      {
                                        style: {
                                          fontSize: "16px",
                                          color: "#666",
                                        },
                                      },
                                      autoChapterNavigation
                                        ? "クリックして次のチャプターへ"
                                        : "最後のページです"
                                    ),
                                  ]
                                )
                              : null
                          )
                    ),
                  ]
                ),

                // 左端インジケーター (最後のページの時)
                currentSpreadIndex >= Math.ceil(images.length / 2) - 1
                  ? e(
                      "div",
                      {
                        key: "left-edge-indicator",
                        className: "mv-edge-indicator mv-left-indicator",
                      },
                      autoChapterNavigation ? "次のチャプターへ" : "最後のページ"
                    )
                  : null,

                // ズームインジケーター
                e(
                  "div",
                  {
                    key: "zoom-indicator",
                    className: `mv-zoom-indicator ${showZoomIndicator ? "visible" : ""}`,
                  },
                  `ズーム: ${Math.round(scale * 100)}%`
                ),

                // ショートカットヒント（下部に常に配置されるがマウスが近づくと表示される）
                e(
                  "div",
                  {
                    key: "shortcuts-hint",
                    className: `mv-shortcuts-hint ${hintsVisible ? "visible" : "hidden"}`,
                    ref: hintsRef,
                  },
                  [
                    e("span", { key: "hint-nav" }, [
                      "移動: ",
                      e("span", { key: "key-left", className: "mv-key" }, "←"),
                      e("span", { key: "key-right", className: "mv-key" }, "→"),
                    ]),
                    " | ",
                    e("span", { key: "hint-zoom" }, [
                      "ズーム: ",
                      e("span", { key: "key-up", className: "mv-key" }, "↑"),
                      e("span", { key: "key-down", className: "mv-key" }, "↓"),
                      e("span", { key: "key-reset", className: "mv-key" }, "Q"),
                    ]),
                    " | ",
                    e("span", { key: "hint-toggle" }, [
                      "ヒント表示: ",
                      e("span", { key: "key-hint", className: "mv-key" }, "H"),
                    ]),
                  ]
                ),

                // ページめくりインジケーター
                showTurnIndicator &&
                  e(
                    "div",
                    {
                      className: `mv-page-turn-indicator ${turnIndicatorSide} visible`,
                      key: "turn-indicator",
                    },
                    turnIndicatorSide === "left" ? "→" : "←"
                  ),
              ]
        ),
      ]
    );
  };

  class UIBuilder {
    constructor() {
      this.shadowHost = null;
      this.shadowRoot = null;
      this.spinner = null;
    }

    /**
     * LoadingSpinnerを設定する
     * @param {LoadingSpinner} spinner - スピナーのインスタンス
     */
    setSpinner(spinner) {
      this.spinner = spinner;
    }

    /**
     * 画像をプリロードする
     * @param {string[]} imageUrls - プリロードする画像のURL配列
     * @returns {Promise<void>} - プリロード完了時に解決するPromise
     */
    async preloadImages(imageUrls) {
      if (!imageUrls || imageUrls.length === 0) {
        console.error("[MangaViewer] preloadImages: no image URLs provided");
        return;
      }

      const total = imageUrls.length;
      let loaded = 0;
      let errors = 0;

      try {
        if (this.spinner) {
          this.spinner.updateMessage(`画像をプリロード中... 0/${total} (0%)`, 0);
        }

        // バッチで処理して負荷を分散
        const batchSize = 5;
        const batches = Math.ceil(total / batchSize);

        for (let i = 0; i < batches; i++) {
          const start = i * batchSize;
          const end = Math.min(start + batchSize, total);
          const batchUrls = imageUrls.slice(start, end);

          try {
            await Promise.all(
              batchUrls.map((url) => {
                return new Promise((resolve) => {
                  try {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => {
                      loaded++;

                      // 進捗状況を更新
                      if (this.spinner) {
                        const percent = Math.round((loaded / total) * 100);
                        this.spinner.updateMessage(
                          `画像をプリロード中... ${loaded}/${total} (${percent}%)`,
                          percent
                        );
                      }

                      resolve();
                    };
                    img.onerror = (error) => {
                      errors++;
                      loaded++;
                      console.error(`[MangaViewer] preloadImages: failed to load image ${url}:`, error);

                      // 進捗状況を更新
                      if (this.spinner) {
                        const percent = Math.round((loaded / total) * 100);
                        this.spinner.updateMessage(
                          `画像をプリロード中... ${loaded}/${total} (${percent}%) - ${errors}枚エラー`,
                          percent
                        );
                      }

                      resolve();
                    };
                  } catch (error) {
                    console.error(
                      `[MangaViewer] preloadImages: error creating image for ${url}:`,
                      error
                    );
                    errors++;
                    loaded++;
                    resolve();
                  }
                });
              })
            );
          } catch (batchError) {
            console.error(`[MangaViewer] preloadImages: batch ${i} error:`, batchError);
          }
        }

        if (this.spinner) {
          const message =
            errors > 0
              ? `${total}枚中${
                  loaded - errors
                }枚の画像をプリロード完了（${errors}枚エラー）。ビューアを起動中...`
              : `${total}枚の画像をプリロード完了。ビューアを起動中...`;
          this.spinner.updateMessage(message, 100);
          this.spinner.setComplete();
        }

        if (errors > 0) {
          console.error(
            `[MangaViewer] preloadImages: completed with ${errors} errors out of ${total} images`
          );
        }
      } catch (error) {
        console.error("[MangaViewer] preloadImages: unexpected error:", error);
        if (this.spinner) {
          this.spinner.updateMessage("プリロード中にエラーが発生しました", 100);
        }
      }
    }

    /**
     * ビューアを構築する
     * @param {string[]} initialImageUrls - 初期表示する画像URL配列
     * @param {Object} options - ビューアのオプション
     * @returns {Promise<HTMLElement>} - ビューアのコンテナ要素
     */
    async buildViewer(initialImageUrls, options = {}) {
      try {
        // React可用性チェック
        if (!checkReactAvailability()) {
          throw new Error("React or ReactDOM is not available");
        }

        // 既にビューアがアクティブな場合は終了
        if (globalState.isViewerActive) {
          console.warn("[MangaViewer] Viewer is already active");
          return null;
        }

        globalState.isViewerActive = true;

        // デフォルトオプション
        const defaultOptions = {
          initialAutoNav: true, // チャプター自動移動のデフォルト値
        };

        // オプションをマージ
        const viewerOptions = { ...defaultOptions, ...options };

        // 最初のセットの画像をプリロード
        if (initialImageUrls && initialImageUrls.length > 0) {
          await this.preloadImages(initialImageUrls);
        } else {
          if (this.spinner) {
            this.spinner.updateMessage("有効な画像を検索中です...");
          }
        }

        // シャドウホスト要素を作成
        this.shadowHost = document.createElement("div");
        this.shadowHost.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10001;
                    pointer-events: auto;
                `;

        if (!document.body) {
          throw new Error("Document body is not available");
        }
        document.body.appendChild(this.shadowHost);

        // シャドウDOMを作成（フォールバック付き）
        try {
          if (this.shadowHost.attachShadow) {
            this.shadowRoot = this.shadowHost.attachShadow({ mode: "closed" });
          } else {
            console.warn("[MangaViewer] Shadow DOM not supported, using regular DOM");
            this.shadowRoot = this.shadowHost;
          }
        } catch (shadowError) {
          console.warn("[MangaViewer] Shadow DOM creation failed, using regular DOM:", shadowError);
          this.shadowRoot = this.shadowHost;
        }

        // スタイルを追加
        const style = document.createElement("style");
        style.textContent = getViewerStyles();
        this.shadowRoot.appendChild(style);

        // Reactコンポーネント用のコンテナを作成
        const reactContainer = document.createElement("div");
        this.shadowRoot.appendChild(reactContainer);

        // Reactコンポーネントをレンダリング
        const root = ReactDOM.createRoot(reactContainer);

        // 初期画像セットでビューアをレンダリング
        let isFirstRender = true;
        const renderViewer = (images) => {
          try {
            // ビューア表示直後、少し遅れてプログレスバーを表示（初期化）
            if (unsafeWindow.MangaViewer && images.length > 0 && isFirstRender) {
              setTimeoutSafely(() => {
                try {
                  if (unsafeWindow.MangaViewer.updateProgress) {
                    unsafeWindow.MangaViewer.updateProgress(0, "バックグラウンド処理を開始...", "init");
                  }
                } catch (progressError) {
                  console.error("[MangaViewer] Error updating progress:", progressError);
                }
              }, 500); // ビューア表示から少し遅らせて表示
              isFirstRender = false;
            }

            root.render(
              e(ViewerComponent, {
                images: images,
                onClose: () => {
                  try {
                    root.unmount();
                    if (this.shadowHost && this.shadowHost.parentNode) {
                      this.shadowHost.parentNode.removeChild(this.shadowHost);
                    }
                    this.shadowHost = null;
                    this.shadowRoot = null;
                    cleanupResources(); // リソースクリーンアップを追加

                    // FABボタンを再表示
                    if (globalState.controlPanel) {
                      globalState.controlPanel.show();
                    }
                  } catch (closeError) {
                    console.error("[MangaViewer] Error closing viewer:", closeError);
                  }
                },
                initialAutoNav: viewerOptions.initialAutoNav,
              })
            );
          } catch (renderError) {
            console.error("[MangaViewer] Error rendering viewer:", renderError);
          }
        };

        // 初期表示
        renderViewer(initialImageUrls);

        // ビューア表示後に確実にフォーカスを設定
        setTimeout(() => {
          try {
            const viewerElement = this.shadowRoot.querySelector(".manga-viewer-container");
            if (viewerElement) {
              viewerElement.focus();
            }
          } catch (focusError) {
            console.error("[MangaViewer] Error setting focus after render:", focusError);
          }
        }, 100);

        // 後から更新する仕組みを提供
        this.updateImages = (newImages) => {
          try {
            if (newImages && newImages.length > 0) {
              renderViewer(newImages);
            }
          } catch (updateError) {
            console.error("[MangaViewer] Error updating images:", updateError);
          }
        };

        return this.shadowHost;
      } catch (error) {
        console.error("[MangaViewer] Error building viewer:", error);
        globalState.isViewerActive = false;
        cleanupResources();
        throw error;
      }
    }
  }

  class DataLoader {
    constructor() {
      this.imageUrls = [];
      this.spinner = null; // LoadingSpinnerへの参照
    }

    /**
     * LoadingSpinnerを設定する
     * @param {LoadingSpinner} spinner - スピナーのインスタンス
     */
    setSpinner(spinner) {
      this.spinner = spinner;
    }

    /**
     * 現在のサイトに応じて適切な画像収集メソッドを呼び出す
     * @returns {Promise<{initialUrls: string[], onValidatedCallback: Function}>}
     */
    async collectImageUrls() {
      // 新しい適応的画像収集システムを使用
      try {
        if (this.spinner) {
          this.spinner.updateMessage("適応的画像収集システムを開始中...");
        }

        return await this.collectAdaptiveImages();
      } catch (error) {
        console.error(
          "[MangaViewer] collectImageUrls: error with adaptive collection, falling back:",
          error
        );

        // フォールバック: 従来の方法
        const currentUrl = window.location.href;

        if (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) {
          // Xの場合
          if (this.spinner) {
            this.spinner.updateMessage("Xのページをスキャン中（フォールバック）...");
          }

          // ツイッターページをスクロールして画像を全て表示させながら収集
          const orderedUrls = await this.scrollTwitterPageToCollectImages();

          if (this.spinner) {
            this.spinner.updateMessage(`${orderedUrls.length}枚のツイート画像を見つけました。検証中...`);
          }

          // X用の検証メソッドを呼び出し
          return this.validateTwitterUrls(orderedUrls);
        } else {
          // その他のサイト（nicomanga.comなど）
          return this.collectGenericImages();
        }
      }
    }

    /**
     * ツイッターページを自動スクロールして画像を収集する関数
     * ページ全体をスクロールすることで、バーチャルスクロールで非表示になっていた画像も表示させる
     * @returns {Promise<string[]>} 収集した画像URLの配列
     */
    async scrollTwitterPageToCollectImages() {
      // 元のスクロール位置を保存
      const originalScrollY = window.scrollY;

      // スクロール関連のパラメータ
      const maxScrollAttempts = 25; // 最大スクロール試行回数
      const scrollPauseTime = 300; // スクロール間の待機時間（ミリ秒）
      const scrollStepSize = 800; // 一度にスクロールする量（ピクセル）

      // 収集した画像URLを保存する配列
      const collectedUrls = [];

      let scrollAttempts = 0;
      let currentScrollY = 0;
      let newContentFound = true;
      let lastImageCount = 0;

      if (this.spinner) {
        this.spinner.updateMessage("画像を探すためにページをスクロール中...");
      }

      try {
        // 最初に画面上の画像要素数を取得
        try {
          lastImageCount = document.querySelectorAll('img[src*="pbs.twimg.com/media"]').length;
        } catch (queryError) {
          console.error(
            "[MangaViewer] scrollTwitterPageToCollectImages: error querying initial images:",
            queryError
          );
          lastImageCount = 0;
        }

        // 現在表示されている画像を収集
        try {
          this.collectCurrentVisibleImages(collectedUrls);
        } catch (collectError) {
          console.error(
            "[MangaViewer] scrollTwitterPageToCollectImages: error collecting initial images:",
            collectError
          );
        }

        // スクロールを繰り返す
        while (scrollAttempts < maxScrollAttempts && newContentFound) {
          try {
            // 少しずつスクロールする
            currentScrollY += scrollStepSize;
            window.scrollTo(0, currentScrollY);

            // 進捗状況を更新
            if (this.spinner) {
              this.spinner.updateMessage(
                `画像を探すためにページをスクロール中... (${
                  scrollAttempts + 1
                }/${maxScrollAttempts}) - ${collectedUrls.length}枚見つかりました`
              );
            }

            // DOM更新を待つ
            await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

            // 現在の表示されている画像を収集
            try {
              this.collectCurrentVisibleImages(collectedUrls);
            } catch (collectError) {
              console.error(
                "[MangaViewer] scrollTwitterPageToCollectImages: error collecting images during scroll:",
                collectError
              );
            }

            // 現在の画像数を取得
            let currentImageCount = 0;
            try {
              currentImageCount = document.querySelectorAll('img[src*="pbs.twimg.com/media"]').length;
            } catch (queryError) {
              console.error(
                "[MangaViewer] scrollTwitterPageToCollectImages: error querying current images:",
                queryError
              );
            }

            // 新しい画像が見つかったか確認
            if (currentImageCount > lastImageCount) {
              // 新しい画像が見つかったので続行
              lastImageCount = currentImageCount;
              newContentFound = true;
            } else {
              // 前回と同じ画像数の場合、もう少し待って再確認
              await new Promise((resolve) => setTimeout(resolve, scrollPauseTime * 2));

              // 再度現在の表示されている画像を収集
              try {
                this.collectCurrentVisibleImages(collectedUrls);
              } catch (collectError) {
                console.error(
                  "[MangaViewer] scrollTwitterPageToCollectImages: error collecting images during recheck:",
                  collectError
                );
              }

              let recheckImageCount = 0;
              try {
                recheckImageCount = document.querySelectorAll('img[src*="pbs.twimg.com/media"]').length;
              } catch (queryError) {
                console.error(
                  "[MangaViewer] scrollTwitterPageToCollectImages: error querying recheck images:",
                  queryError
                );
              }

              if (recheckImageCount > lastImageCount) {
                // 待機後に新しい画像が見つかった
                lastImageCount = recheckImageCount;
                newContentFound = true;
              } else {
                // ページの最下部まで到達したか確認
                try {
                  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                    // ページ下部に近いので、スクロールを終了
                    newContentFound = false;
                  } else {
                    // まだページ下部ではないが、新しい画像が見つからない
                    // 直近3回連続で新しい画像が見つからなければスクロールを終了
                    if (scrollAttempts >= 3 && !newContentFound) {
                      break;
                    }
                  }
                } catch (scrollCheckError) {
                  console.error(
                    "[MangaViewer] scrollTwitterPageToCollectImages: error checking scroll position:",
                    scrollCheckError
                  );
                  newContentFound = false;
                }
              }
            }

            scrollAttempts++;
          } catch (scrollError) {
            console.error(
              `[MangaViewer] scrollTwitterPageToCollectImages: error during scroll attempt ${scrollAttempts}:`,
              scrollError
            );
            scrollAttempts++;
            // エラーが発生してもスクロールを続行
          }
        }

        // スクロールが完了したら、上から下まで段階的に丁寧にスクロールして
        // すべての画像を確実に読み込む
        if (this.spinner) {
          this.spinner.updateMessage("画像を確認するために再スキャン中...");
        }

        try {
          // まず一番上に戻る
          window.scrollTo(0, 0);
          await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

          // 現在の表示されている画像を収集
          try {
            this.collectCurrentVisibleImages(collectedUrls);
          } catch (collectError) {
            console.error(
              "[MangaViewer] scrollTwitterPageToCollectImages: error collecting images at top:",
              collectError
            );
          }

          // 画面の高さの半分ずつスクロールして全体をスキャン
          const viewportHeight = window.innerHeight;
          const totalHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.scrollHeight
          );

          // 少しずつスクロールして全ての画像を確保
          for (let scrollPos = 0; scrollPos < totalHeight; scrollPos += Math.floor(viewportHeight / 2)) {
            try {
              window.scrollTo(0, scrollPos);
              await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

              // 現在の表示されている画像を収集
              try {
                this.collectCurrentVisibleImages(collectedUrls);
              } catch (collectError) {
                console.error(
                  `[MangaViewer] scrollTwitterPageToCollectImages: error collecting images at position ${scrollPos}:`,
                  collectError
                );
              }

              // 進捗更新
              if (this.spinner) {
                const percent = Math.min(100, Math.round((scrollPos / totalHeight) * 100));
                this.spinner.updateMessage(
                  `画像を再スキャン中... (${percent}%) - ${collectedUrls.length}枚見つかりました`
                );
              }
            } catch (finalScrollError) {
              console.error(
                `[MangaViewer] scrollTwitterPageToCollectImages: error during final scroll at position ${scrollPos}:`,
                finalScrollError
              );
            }
          }

          // 最後に一番下までスクロール
          window.scrollTo(0, totalHeight);
          await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));

          // 最後のスクロール位置でも画像を収集
          try {
            this.collectCurrentVisibleImages(collectedUrls);
          } catch (collectError) {
            console.error(
              "[MangaViewer] scrollTwitterPageToCollectImages: error collecting images at bottom:",
              collectError
            );
          }
        } catch (finalScanError) {
          console.error(
            "[MangaViewer] scrollTwitterPageToCollectImages: error during final scan:",
            finalScanError
          );
        }

        // 元のスクロール位置に戻る
        try {
          window.scrollTo(0, originalScrollY);

          // DOM更新を待つ
          await new Promise((resolve) => setTimeout(resolve, scrollPauseTime));
        } catch (restoreError) {
          console.error(
            "[MangaViewer] scrollTwitterPageToCollectImages: error restoring scroll position:",
            restoreError
          );
        }

        // 見つかった画像の数を表示
        if (this.spinner) {
          this.spinner.updateMessage(
            `ページのスキャンが完了しました。${collectedUrls.length}枚の画像候補を見つけました。`
          );
        }

        return collectedUrls;
      } catch (error) {
        console.error("[MangaViewer] scrollTwitterPageToCollectImages: unexpected error:", error);
        // エラーが発生した場合でも元のスクロール位置に戻る
        try {
          window.scrollTo(0, originalScrollY);
        } catch (restoreError) {
          console.error(
            "[MangaViewer] scrollTwitterPageToCollectImages: error restoring scroll position after error:",
            restoreError
          );
        }
        return collectedUrls;
      }
    }

    /**
     * 現在表示されている画像を収集する
     * @param {string[]} collectedUrls - 収集済みのURL配列（参照渡し）
     */
    collectCurrentVisibleImages(collectedUrls, imageSelector = null) {
      // 画像セレクタが指定されている場合はそれを使用、そうでなければTwitter画像を検索
      const selector = imageSelector || 'img[src*="pbs.twimg.com/media"]';
      const isTwitterImage = selector.includes("pbs.twimg.com") || selector.includes("ton.twimg.com");

      if (isTwitterImage) {
        // Twitter画像の場合は既存ロジックを使用
        this.collectTwitterImages(collectedUrls, selector);
      } else {
        // 汎用画像の場合は新しいロジックを使用
        this.collectGenericVisibleImages(collectedUrls, selector);
      }
    }

    /**
     * Twitter画像の収集
     * @param {string[]} collectedUrls - 既に収集されたURLの配列
     * @param {string} selector - 画像セレクタ
     */
    collectTwitterImages(collectedUrls, selector) {
      // まずはツイートに含まれる画像を収集
      const timelineItems = document.querySelectorAll('[data-testid="tweet"], article');

      timelineItems.forEach((tweet) => {
        const tweetImages = tweet.querySelectorAll(selector);

        tweetImages.forEach((img) => {
          let imageUrl = this.processTwitterImageUrl(img.src);

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !collectedUrls.includes(imageUrl)
          ) {
            collectedUrls.push(imageUrl);
          }
        });
      });

      // タイムラインアイテムで見つからない場合、他の方法でも探す
      if (timelineItems.length === 0) {
        // 単一ツイートや詳細ページの場合
        const galleryImages = document.querySelectorAll(
          `[data-testid="tweetPhoto"] img, [role="group"] ${selector}`
        );

        galleryImages.forEach((img) => {
          let imageUrl = this.processTwitterImageUrl(img.src);

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !collectedUrls.includes(imageUrl)
          ) {
            collectedUrls.push(imageUrl);
          }
        });

        // それでも見つからない場合、すべての画像から探す
        if (galleryImages.length === 0) {
          const allImages = document.querySelectorAll(selector);

          allImages.forEach((img) => {
            let imageUrl = this.processTwitterImageUrl(img.src);

            if (
              imageUrl &&
              typeof imageUrl === "string" &&
              imageUrl.trim() !== "" &&
              imageUrl !== "undefined" &&
              imageUrl !== "null" &&
              imageUrl.startsWith("http") &&
              !collectedUrls.includes(imageUrl)
            ) {
              collectedUrls.push(imageUrl);
            }
          });
        }
      }
    }

    /**
     * 汎用画像の収集
     * @param {string[]} collectedUrls - 既に収集されたURLの配列
     * @param {string} selector - 画像セレクタ
     */
    collectGenericVisibleImages(collectedUrls, selector) {
      const images = document.querySelectorAll(selector);

      images.forEach((img) => {
        try {
          // 画像が表示されているかチェック
          const rect = img.getBoundingClientRect();
          const style = window.getComputedStyle(img);

          if (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            rect.width > 0 &&
            rect.height > 0
          ) {
            let imageUrl = img.src;

            // data-src属性もチェック
            if (!imageUrl && img.dataset.src) {
              imageUrl = img.dataset.src;
            }

            // srcset属性もチェック
            if (!imageUrl && (img.srcset || img.dataset.srcset)) {
              const srcset = img.srcset || img.dataset.srcset;
              const srcsetUrls = this.parseSrcset(srcset);
              if (srcsetUrls.length > 0) {
                imageUrl = srcsetUrls[0].url; // 最高解像度を取得
              }
            }

            if (
              imageUrl &&
              typeof imageUrl === "string" &&
              imageUrl.trim() !== "" &&
              imageUrl !== "undefined" &&
              imageUrl !== "null" &&
              imageUrl.startsWith("http") &&
              !collectedUrls.includes(imageUrl)
            ) {
              collectedUrls.push(imageUrl);
            }
          }
        } catch (error) {
          console.error("[MangaViewer] Error checking generic image:", error);
        }
      });
    }

    /**
     * Twitter画像URLの処理
     * @param {string} imageUrl - 元の画像URL
     * @returns {string} 処理済み画像URL
     */
    processTwitterImageUrl(imageUrl) {
      // 元の高解像度画像URLを取得
      if (imageUrl.includes("format=")) {
        const formatMatch = imageUrl.match(/(format=[^&]+)/);
        const format = formatMatch ? formatMatch[1] : "format=jpg";
        const baseUrl = imageUrl.split("?")[0];
        imageUrl = `${baseUrl}?${format}&name=orig`;
      }
      return imageUrl;
    }

    /**
     * ツイートの順序に沿って画像を収集する
     * @returns {string[]} ツイート順に整理された画像URLの配列
     */
    getOrderedTwitterImages() {
      const orderedUrls = [];

      // タイムラインまたはツイート詳細ページを特定
      const timelineItems = document.querySelectorAll('[data-testid="tweet"], article');

      // タイムラインの各ツイートをループ
      timelineItems.forEach((tweet) => {
        // このツイート内の画像要素を取得
        const tweetImages = tweet.querySelectorAll('img[src*="pbs.twimg.com/media"]');

        // このツイート内の画像URLを順番に取得
        tweetImages.forEach((img) => {
          let imageUrl = img.src;

          // 元の高解像度画像URLを取得（サムネイルではなく）
          if (imageUrl.includes("format=")) {
            // format=webpやformat=jpgなどのパラメータを保持
            const formatMatch = imageUrl.match(/(format=[^&]+)/);
            const format = formatMatch ? formatMatch[1] : "format=jpg";

            // ベースURLを取得（?より前の部分）
            const baseUrl = imageUrl.split("?")[0];

            // 高解像度バージョンのURLを構築
            imageUrl = `${baseUrl}?${format}&name=orig`;
          }

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !orderedUrls.includes(imageUrl)
          ) {
            orderedUrls.push(imageUrl);
          }
        });
      });

      // タイムラインアイテムが見つからない場合は、従来の方法でURLを収集する
      if (orderedUrls.length === 0) {
        // 単一ツイートの場合や詳細ページの場合
        const galleryImages = document.querySelectorAll(
          '[data-testid="tweetPhoto"] img, [role="group"] img[src*="pbs.twimg.com/media"]'
        );

        galleryImages.forEach((img) => {
          let imageUrl = img.src;

          // 元の高解像度画像URLを取得
          if (imageUrl.includes("format=")) {
            const formatMatch = imageUrl.match(/(format=[^&]+)/);
            const format = formatMatch ? formatMatch[1] : "format=jpg";
            const baseUrl = imageUrl.split("?")[0];
            imageUrl = `${baseUrl}?${format}&name=orig`;
          }

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !orderedUrls.includes(imageUrl)
          ) {
            orderedUrls.push(imageUrl);
          }
        });
      }

      // それでも画像が見つからない場合は、ページ全体から検索
      if (orderedUrls.length === 0) {
        const allImages = document.querySelectorAll('img[src*="pbs.twimg.com/media"]');

        allImages.forEach((img) => {
          let imageUrl = img.src;

          // 元の高解像度画像URLを取得
          if (imageUrl.includes("format=")) {
            const formatMatch = imageUrl.match(/(format=[^&]+)/);
            const format = formatMatch ? formatMatch[1] : "format=jpg";
            const baseUrl = imageUrl.split("?")[0];
            imageUrl = `${baseUrl}?${format}&name=orig`;
          }

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !orderedUrls.includes(imageUrl)
          ) {
            orderedUrls.push(imageUrl);
          }
        });
      }

      return orderedUrls;
    }

    /**
     * 汎用適応的画像収集メソッド（効率的バージョン）- SPA対応強化版
     * @returns {Promise<Array>} 収集した画像URL配列
     */
    async collectAdaptiveImages() {
      // SPA対応のページタイプ判定を使用
      const currentPageType = getCurrentPageType();
      const currentUrl = window.location.href;
      const isTwitterStatus = isTwitterStatusPage();
      const isTwitter = currentPageType.startsWith("twitter");

      if (this.spinner) {
        this.spinner.updateMessage(`ページタイプを分析しています... (${currentPageType})`);
      }

      try {
        // Twitter個別ページの場合は専用ロジックを使用
        if (isTwitterStatus) {
          const orderedUrls = await this.scrollPageToCollectImages("twitter-status");
          return await this.validateTwitterUrls(orderedUrls);
        }

        // 通常のTwitterページの場合
        if (isTwitter) {
          const orderedUrls = await this.scrollTwitterPageToCollectImages();
          return await this.validateTwitterUrls(orderedUrls);
        }

        // その他のサイトの場合は効率的な適応的収集を実行
        return await this.collectEfficientGenericImages();
      } catch (error) {
        console.error("[MangaViewer] collectAdaptiveImages: error:", error);
        // フォールバック処理
        if (this.spinner) {
          this.spinner.updateMessage("フォールバック画像収集を実行中...");
        }
        return await this.collectGenericImages();
      }
    }

    /**
     * 効率的な汎用画像収集メソッド
     * まず静的画像を高速収集し、不十分な場合のみ動的収集を実行
     * @returns {Promise<Array>} 収集した画像URL配列
     */
    async collectEfficientGenericImages() {
      if (this.spinner) {
        this.spinner.updateMessage("高速画像収集を実行中...");
      }

      // nicomanga.com専用処理：常に高速静的収集のみ
      if (location.hostname.includes("nicomanga.com")) {
        if (this.spinner) {
          this.spinner.updateMessage("ニコニコ漫画の高速収集を実行中...");
        }
        const staticResult = await this.collectStaticImages();
        return staticResult;
      }

      // ステップ1: 既存の静的画像を高速収集
      const staticResult = await this.collectStaticImages();
      const staticUrls = staticResult.initialUrls || [];

      // 十分な画像が見つかった場合は即座に返す
      const minimumImageThreshold = 3;
      if (staticUrls.length >= minimumImageThreshold) {
        if (this.spinner) {
          this.spinner.updateMessage(`${staticUrls.length}枚の画像を高速収集で見つけました。`);
        }
        return staticResult;
      }

      // ステップ2: 画像が不十分な場合、動的読み込みの可能性を分析
      if (this.spinner) {
        this.spinner.updateMessage("画像数が少ないため、動的読み込みを分析中...");
      }

      const loadingInfo = await this.analyzePageLoadingState();

      // 動的読み込みが検出されない場合は静的結果を返す
      if (!loadingInfo.needsWaiting) {
        if (this.spinner) {
          this.spinner.updateMessage(
            `動的読み込みが検出されませんでした。${staticUrls.length}枚の画像で完了。`
          );
        }
        return staticResult;
      }

      // ステップ3: 動的読み込みが検出された場合のみスクロール収集を実行
      if (this.spinner) {
        this.spinner.updateMessage(`${loadingInfo.reason}を検出、動的画像収集を実行中...`);
      }

      // 適応的待機
      await this.waitForImagesAdaptive(loadingInfo);

      // スクロール収集
      const dynamicUrls = await this.scrollPageToCollectImages("generic", loadingInfo);
      return await this.validateUrlsWithMetadata(dynamicUrls);
    }

    /**
     * 静的画像の高速収集
     * 既に読み込まれているimg/pictureタグから画像を収集
     * @returns {Promise<Array>} 収集した画像URL配列
     */
    async collectStaticImages() {
      const images = document.querySelectorAll("img, picture source");
      const urlsWithMetadata = []; // URLと検証情報を含むオブジェクトの配列

      images.forEach((element) => {
        try {
          let imageUrl = null;
          let isLoaded = false;
          let width = 0;
          let height = 0;

          if (element.tagName === "IMG") {
            // img要素の処理
            imageUrl = element.src;
            isLoaded = element.complete && element.naturalHeight > 0;
            width = element.naturalWidth || element.width || 0;
            height = element.naturalHeight || element.height || 0;

            // data-src属性もチェック（レイジーロードでない限り、通常は空）
            if (!imageUrl && element.dataset.src) {
              imageUrl = element.dataset.src;
              isLoaded = false;
            }

            // srcset属性もチェック
            if (!imageUrl && (element.srcset || element.dataset.srcset)) {
              const srcset = element.srcset || element.dataset.srcset;
              const srcsetUrls = this.parseSrcset(srcset);
              if (srcsetUrls.length > 0) {
                imageUrl = srcsetUrls[0].url; // 最高解像度を取得
                isLoaded = false;
              }
            }
          } else if (element.tagName === "SOURCE") {
            // picture > source要素の処理
            imageUrl = element.srcset;
            if (imageUrl) {
              const srcsetUrls = this.parseSrcset(imageUrl);
              if (srcsetUrls.length > 0) {
                imageUrl = srcsetUrls[0].url;
                isLoaded = false; // sourceは通常未読み込み
              }
            }
          }

          if (
            imageUrl &&
            typeof imageUrl === "string" &&
            imageUrl.trim() !== "" &&
            imageUrl !== "undefined" &&
            imageUrl !== "null" &&
            imageUrl.startsWith("http") &&
            !urlsWithMetadata.some((item) => item.url === imageUrl)
          ) {
            // 同一オリジンかどうかをチェック
            const isSameOrigin = this.isSameOrigin(imageUrl);

            urlsWithMetadata.push({
              url: imageUrl,
              isLoaded: isLoaded,
              isSameOrigin: isSameOrigin,
              width: width,
              height: height,
              needsValidation: !isLoaded && !isSameOrigin, // 読み込み済みまたは同一オリジンなら検証不要
            });
          }
        } catch (error) {
          // Error processing static image element - silently continue
        }
      });

      if (this.spinner) {
        this.spinner.updateMessage(
          `${urlsWithMetadata.length}枚の静的画像候補を見つけました。検証中...`
        );
      }

      return this.validateUrlsWithMetadata(urlsWithMetadata);
    }

    /**
     * 汎用ページスクロール画像収集メソッド
     * @param {string} pageType - ページタイプ ('twitter-status', 'generic')
     * @param {Object} loadingInfo - ページロード情報（オプション）
     * @returns {Promise<Array>} 収集した画像URL配列
     */
    async scrollPageToCollectImages(pageType, loadingInfo = null) {
      // 元のスクロール位置を保存
      const originalScrollY = window.scrollY;

      // ページタイプに応じてパラメータを調整
      let config;
      if (pageType === "twitter-status") {
        config = {
          maxScrollAttempts: 30, // Twitter個別ページは多めに
          scrollPauseTime: 200, // 少し早めに
          scrollStepSize: 600, // 小刻みに
          imageSelector: 'img[src*="pbs.twimg.com/media"], img[src*="ton.twimg.com/media"]',
          description: "Twitter個別ページ",
        };
      } else {
        config = {
          maxScrollAttempts: 20,
          scrollPauseTime: 400,
          scrollStepSize: 800,
          imageSelector: "img",
          description: "汎用ページ",
        };
      }

      // 収集した画像URLを保存する配列
      const collectedUrls = [];

      let scrollAttempts = 0;
      let currentScrollY = 0;
      let newContentFound = true;
      let lastImageCount = 0;

      if (this.spinner) {
        this.spinner.updateMessage(`${config.description}の画像を探すためにページをスクロール中...`);
      }

      try {
        // 最初に画面上の画像要素数を取得
        try {
          lastImageCount = document.querySelectorAll(config.imageSelector).length;
        } catch (queryError) {
          console.error(
            "[MangaViewer] scrollPageToCollectImages: error querying initial images:",
            queryError
          );
          lastImageCount = 0;
        }

        // 現在表示されている画像を収集
        try {
          this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);
        } catch (collectError) {
          console.error(
            "[MangaViewer] scrollPageToCollectImages: error collecting initial images:",
            collectError
          );
        }

        // スクロールを繰り返す
        while (scrollAttempts < config.maxScrollAttempts && newContentFound) {
          try {
            // 少しずつスクロールする
            currentScrollY += config.scrollStepSize;
            window.scrollTo(0, currentScrollY);

            // 進捗状況を更新
            if (this.spinner) {
              this.spinner.updateMessage(
                `${config.description}の画像を探すためにページをスクロール中... (${scrollAttempts + 1}/${
                  config.maxScrollAttempts
                }) - ${collectedUrls.length}枚見つかりました`
              );
            }

            // DOM更新を待つ
            await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));

            // SPA・レイジーロード対応の待機
            if (loadingInfo && loadingInfo.strategy !== "basic") {
              await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));
            }

            // 現在の表示されている画像を収集
            try {
              this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);
            } catch (collectError) {
              console.error(
                "[MangaViewer] scrollPageToCollectImages: error collecting images during scroll:",
                collectError
              );
            }

            // 現在の画像数を取得
            let currentImageCount = 0;
            try {
              currentImageCount = document.querySelectorAll(config.imageSelector).length;
            } catch (queryError) {
              console.error(
                "[MangaViewer] scrollPageToCollectImages: error querying current images:",
                queryError
              );
            }

            // 新しい画像が見つかったか確認
            if (currentImageCount > lastImageCount) {
              lastImageCount = currentImageCount;
              newContentFound = true;
            } else {
              // 前回と同じ画像数の場合、もう少し待って再確認
              await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime * 2));

              try {
                this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);
              } catch (collectError) {
                console.error(
                  "[MangaViewer] scrollPageToCollectImages: error collecting images during recheck:",
                  collectError
                );
              }

              let recheckImageCount = 0;
              try {
                recheckImageCount = document.querySelectorAll(config.imageSelector).length;
              } catch (queryError) {
                console.error(
                  "[MangaViewer] scrollPageToCollectImages: error querying recheck images:",
                  queryError
                );
              }

              if (recheckImageCount > lastImageCount) {
                lastImageCount = recheckImageCount;
                newContentFound = true;
              } else {
                // ページの最下部まで到達したか確認
                try {
                  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                    newContentFound = false;
                  } else if (scrollAttempts >= 3 && !newContentFound) {
                    break;
                  }
                } catch (scrollCheckError) {
                  console.error(
                    "[MangaViewer] scrollPageToCollectImages: error checking scroll position:",
                    scrollCheckError
                  );
                  newContentFound = false;
                }
              }
            }

            scrollAttempts++;
          } catch (scrollError) {
            console.error(
              `[MangaViewer] scrollPageToCollectImages: error during scroll attempt ${scrollAttempts}:`,
              scrollError
            );
            scrollAttempts++;
          }
        }

        // 最終スキャン
        if (this.spinner) {
          this.spinner.updateMessage(`${config.description}の画像を確認するために再スキャン中...`);
        }

        // 丁寧な最終スキャン
        await this.performFinalScan(collectedUrls, config);

        // 元のスクロール位置に戻る
        try {
          window.scrollTo(0, originalScrollY);
          await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));
        } catch (restoreError) {
          console.error(
            "[MangaViewer] scrollPageToCollectImages: error restoring scroll position:",
            restoreError
          );
        }

        if (this.spinner) {
          this.spinner.updateMessage(
            `${config.description}のスキャンが完了しました。${collectedUrls.length}枚の画像候補を見つけました。`
          );
        }

        return collectedUrls;
      } catch (error) {
        console.error("[MangaViewer] scrollPageToCollectImages: unexpected error:", error);
        try {
          window.scrollTo(0, originalScrollY);
        } catch (restoreError) {
          console.error(
            "[MangaViewer] scrollPageToCollectImages: error restoring scroll position after error:",
            restoreError
          );
        }
        return collectedUrls;
      }
    }

    /**
     * 最終スキャンの実行
     * @param {Array} collectedUrls - 収集済みURL配列
     * @param {Object} config - 設定オブジェクト
     */
    async performFinalScan(collectedUrls, config) {
      try {
        // まず一番上に戻る
        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));

        this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);

        // 画面の高さの半分ずつスクロールして全体をスキャン
        const viewportHeight = window.innerHeight;
        const totalHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.scrollHeight
        );

        for (let scrollPos = 0; scrollPos < totalHeight; scrollPos += Math.floor(viewportHeight / 2)) {
          try {
            window.scrollTo(0, scrollPos);
            await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));

            this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);

            if (this.spinner) {
              const percent = Math.min(100, Math.round((scrollPos / totalHeight) * 100));
              this.spinner.updateMessage(
                `${config.description}の画像を再スキャン中... (${percent}%) - ${collectedUrls.length}枚見つかりました`
              );
            }
          } catch (finalScrollError) {
            console.error(
              `[MangaViewer] performFinalScan: error during final scroll at position ${scrollPos}:`,
              finalScrollError
            );
          }
        }

        // 最後に一番下までスクロール
        window.scrollTo(0, totalHeight);
        await new Promise((resolve) => setTimeout(resolve, config.scrollPauseTime));
        this.collectCurrentVisibleImages(collectedUrls, config.imageSelector);
      } catch (error) {
        console.error("[MangaViewer] performFinalScan: error:", error);
      }
    }

    /**
     * Twitter/X用のURL検証メソッド
     * @param {string[]} urls
     * @returns {Promise<{initialUrls: string[], onValidatedCallback: Function}>}
     */
    async validateTwitterUrls(urls) {
      // Twitter/Xの画像は基本的にpbs.twimg.comドメインで、CORSの問題もないため
      // 検証をスキップして高速化する
      const validUrls = [...urls];
      let onValidatedCallback = null;
      const minInitialUrls = 2; // 最初に表示する画像の最小数

      // Twitter/Xの画像は通常すべて有効なので、検証をスキップ
      // 最初に表示する画像を準備（最初の2枚だけ）
      const initialUrls =
        validUrls.length > minInitialUrls ? validUrls.slice(0, minInitialUrls) : validUrls;

      if (this.spinner) {
        this.spinner.updateMessage(
          `${initialUrls.length}枚のツイート画像を即座に表示します。残り${Math.max(
            0,
            validUrls.length - initialUrls.length
          )}枚も準備完了。`
        );
      }

      // コールバック関数を返すオブジェクト
      const result = {
        initialUrls: initialUrls, // 最初に表示する画像（2枚）
        onValidated: function (callback) {
          onValidatedCallback = callback;

          // Twitter/Xの画像は検証不要なので、即座にコールバックを呼び出す
          // 少し遅らせて実行することで、ビューアの初期表示後にバックグラウンド処理が実行されるようにする
          setTimeout(() => {
            if (callback) {
              callback(validUrls); // すべての画像をコールバックで返す
            }

            // ビューア表示後のプログレスバーを更新
            if (unsafeWindow.MangaViewer && unsafeWindow.MangaViewer.updateProgress) {
              unsafeWindow.MangaViewer.updateProgress(
                100,
                `処理完了: ${validUrls.length}枚のツイート画像を処理しました（検証スキップ）`,
                "complete"
              );
            }
          }, 500); // 0.5秒後に実行（高速化のため短縮）
        },
      };

      return result;
    }

    /**
     * 汎用的な画像URLを収集するメソッド
     * @returns {Promise<{initialUrls: string[], onValidatedCallback: Function}>}
     */
    async collectGenericImages() {
      // 画像読み込み待機の必要性を判定
      const loadingInfo = await this.analyzePageLoadingState();

      if (loadingInfo.needsWaiting) {
        if (this.spinner) {
          this.spinner.updateMessage(`${loadingInfo.reason}のため読み込みを待機中...`);
        }

        // 適応的な画像読み込み待機
        await this.waitForImagesAdaptive(loadingInfo);
      }

      const images = document.querySelectorAll("img");
      const urlsWithMetadata = []; // URLと検証情報を含むオブジェクトの配列

      images.forEach((img) => {
        // 画像が既に読み込まれているかチェック
        const isLoaded = img.complete && img.naturalHeight > 0;

        // 同一オリジンかどうかをチェック
        const isSameOrigin = this.isSameOrigin(img.src);

        // まずはsrcを優先して取得
        const src = img.src;
        if (src && !urlsWithMetadata.some((item) => item.url === src)) {
          urlsWithMetadata.push({
            url: src,
            isLoaded: isLoaded,
            isSameOrigin: isSameOrigin,
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0,
            needsValidation: !isLoaded && !isSameOrigin, // 読み込み済みまたは同一オリジンなら検証不要
          });
        }

        // 次にdata-srcをチェック
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc && !urlsWithMetadata.some((item) => item.url === dataSrc)) {
          const isSameOriginDataSrc = this.isSameOrigin(dataSrc);
          urlsWithMetadata.push({
            url: dataSrc,
            isLoaded: false, // data-srcは通常未読み込み
            isSameOrigin: isSameOriginDataSrc,
            width: 0,
            height: 0,
            needsValidation: !isSameOriginDataSrc, // 同一オリジンなら検証不要
          });
        }

        // srcset または data-srcset から画像URLを取得
        const srcset = img.dataset.srcset || img.srcset || "";
        if (srcset) {
          // srcsetから最大解像度の画像URLを取得
          const srcsetUrls = this.parseSrcset(srcset);
          if (srcsetUrls.length > 0) {
            const srcsetUrl = srcsetUrls[0].url;
            if (!urlsWithMetadata.some((item) => item.url === srcsetUrl)) {
              const isSameOriginSrcset = this.isSameOrigin(srcsetUrl);
              urlsWithMetadata.push({
                url: srcsetUrl,
                isLoaded: false, // srcsetは通常未読み込み
                isSameOrigin: isSameOriginSrcset,
                width: 0,
                height: 0,
                needsValidation: !isSameOriginSrcset, // 同一オリジンなら検証不要
              });
            }
          }
        }
      });

      if (this.spinner) {
        this.spinner.updateMessage(`${urlsWithMetadata.length}枚の画像候補を見つけました。検証中...`);
      }

      return this.validateUrlsWithMetadata(urlsWithMetadata);
    }

    /**
     * ページの読み込み状態を分析して待機の必要性を判定
     * @returns {Promise<{needsWaiting: boolean, reason: string, strategy: string, timeout: number}>}
     */
    async analyzePageLoadingState() {
      const analysis = {
        needsWaiting: false,
        reason: "",
        strategy: "basic",
        timeout: 3000,
      };

      try {
        // 1. レイジーロード検出
        const lazyLoadIndicators = this.detectLazyLoading();
        if (lazyLoadIndicators.detected) {
          analysis.needsWaiting = true;
          analysis.reason = `レイジーロード (${lazyLoadIndicators.type}: ${
            lazyLoadIndicators.details || "detected"
          })`;
          analysis.strategy = "lazy";
          analysis.timeout = 5000;
          return analysis;
        }

        // 2. 動的コンテンツ読み込み検出
        const dynamicContentInfo = this.detectDynamicContent();
        if (dynamicContentInfo.detected) {
          analysis.needsWaiting = true;
          analysis.reason = "動的コンテンツ読み込み";
          analysis.strategy = "dynamic";
          analysis.timeout = 4000;
          return analysis;
        }

        // 3. 画像数が少ない場合の検出
        const imageCount = document.querySelectorAll("img").length;
        const minExpectedImages = 3;

        if (imageCount < minExpectedImages) {
          // ページがまだ読み込み中の可能性
          const loadingIndicators = this.detectLoadingIndicators();
          if (loadingIndicators.detected) {
            analysis.needsWaiting = true;
            analysis.reason = "ページ読み込み中";
            analysis.strategy = "loading";
            analysis.timeout = 3000;
            return analysis;
          }
        }

        // 4. SPA（Single Page Application）検出
        const spaInfo = this.detectSPA();
        if (spaInfo.detected) {
          analysis.needsWaiting = true;
          analysis.reason = "SPA読み込み";
          analysis.strategy = "spa";
          analysis.timeout = 4000;
          return analysis;
        }

        // 5. 特定サイトパターン検出（後方互換性）
        const siteSpecificInfo = this.detectSiteSpecificPatterns();
        if (siteSpecificInfo.detected) {
          analysis.needsWaiting = true;
          analysis.reason = siteSpecificInfo.reason;
          analysis.strategy = "site-specific";
          analysis.timeout = siteSpecificInfo.timeout;
          return analysis;
        }
      } catch (error) {
        console.error("[MangaViewer] analyzePageLoadingState: error during analysis:", error);
      }

      return analysis;
    }

    /**
     * レイジーロードの検出
     * @returns {{detected: boolean, type: string}}
     */
    detectLazyLoading() {
      try {
        const totalImages = document.querySelectorAll("img").length;

        // 画像数が少ない場合は判定しない
        if (totalImages < 2) {
          return { detected: false, type: "insufficient-images" };
        }

        // data-src属性を持つ画像の比率で判定
        const dataSrcImages = document.querySelectorAll("img[data-src]");
        const dataSrcRatio = dataSrcImages.length / totalImages;
        if (dataSrcRatio > 0.3) {
          // 30%以上がレイジーロードなら検出
          return {
            detected: true,
            type: "data-src",
            details: `${dataSrcImages.length}/${totalImages} (${Math.round(dataSrcRatio * 100)}%)`,
          };
        }

        // loading="lazy"属性の存在チェック
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyRatio = lazyImages.length / totalImages;
        if (lazyRatio > 0.2) {
          // 20%以上
          return {
            detected: true,
            type: "loading-lazy",
            details: `${lazyImages.length}/${totalImages} (${Math.round(lazyRatio * 100)}%)`,
          };
        }

        // Intersection Observer使用の検出（一般的なレイジーロードライブラリ）
        const lazyClassImages = document.querySelectorAll('img[class*="lazy"], img[class*="lazyload"]');
        if (lazyClassImages.length > 0) {
          return {
            detected: true,
            type: "lazy-class",
            details: `${lazyClassImages.length}個のレイジークラス画像`,
          };
        }

        // srcが空またはプレースホルダーの画像
        const placeholderImages = document.querySelectorAll(
          'img[src=""], img[src*="placeholder"], img[src*="loading"]'
        );
        const placeholderRatio = placeholderImages.length / totalImages;
        if (placeholderRatio > 0.3) {
          return {
            detected: true,
            type: "placeholder",
            details: `${placeholderImages.length}個のプレースホルダー画像`,
          };
        }

        return { detected: false, type: "none" };
      } catch (error) {
        console.error("[MangaViewer] detectLazyLoading: error:", error);
        return { detected: false, type: "error" };
      }
    }

    /**
     * 動的コンテンツ読み込みの検出
     * @returns {{detected: boolean, type: string}}
     */
    detectDynamicContent() {
      try {
        // 無限スクロールの検出
        const infiniteScrollIndicators = [
          '[class*="infinite"]',
          '[class*="scroll"]',
          "[data-infinite]",
          ".load-more",
          ".pagination",
        ];

        for (const selector of infiniteScrollIndicators) {
          if (document.querySelector(selector)) {
            return { detected: true, type: "infinite-scroll" };
          }
        }

        // AJAX読み込み中インジケーターの検出
        const loadingIndicators = [".loading", ".spinner", '[class*="load"]', '[aria-busy="true"]'];

        for (const selector of loadingIndicators) {
          const element = document.querySelector(selector);
          if (element && element.offsetParent !== null) {
            // 表示されている場合
            return { detected: true, type: "ajax-loading" };
          }
        }

        return { detected: false, type: "none" };
      } catch (error) {
        console.error("[MangaViewer] detectDynamicContent: error:", error);
        return { detected: false, type: "error" };
      }
    }

    /**
     * ページ読み込みインジケーターの検出
     * @returns {{detected: boolean, type: string}}
     */
    detectLoadingIndicators() {
      try {
        // 一般的な読み込みインジケーター
        const indicators = [
          ".loading",
          ".loader",
          ".spinner",
          '[class*="loading"]',
          '[class*="spinner"]',
          '[aria-busy="true"]',
        ];

        for (const selector of indicators) {
          const element = document.querySelector(selector);
          if (element && element.offsetParent !== null) {
            return { detected: true, type: "loading-indicator" };
          }
        }

        // document.readyStateのチェック
        if (document.readyState === "loading") {
          return { detected: true, type: "document-loading" };
        }

        return { detected: false, type: "none" };
      } catch (error) {
        console.error("[MangaViewer] detectLoadingIndicators: error:", error);
        return { detected: false, type: "error" };
      }
    }

    /**
     * SPA（Single Page Application）の検出
     * @returns {{detected: boolean, framework: string}}
     */
    detectSPA() {
      try {
        // React検出
        if (
          window.React ||
          document.querySelector("[data-reactroot]") ||
          document.querySelector("#root")
        ) {
          return { detected: true, framework: "react" };
        }

        // Vue.js検出
        if (window.Vue || document.querySelector("[data-v-]")) {
          return { detected: true, framework: "vue" };
        }

        // Angular検出
        if (window.ng || document.querySelector("[ng-app]") || document.querySelector("app-root")) {
          return { detected: true, framework: "angular" };
        }

        // 一般的なSPAパターン
        if (document.querySelector("#app") || document.querySelector(".app")) {
          return { detected: true, framework: "generic-spa" };
        }

        return { detected: false, framework: "none" };
      } catch (error) {
        console.error("[MangaViewer] detectSPA: error:", error);
        return { detected: false, framework: "error" };
      }
    }

    /**
     * 特定サイトパターンの検出（後方互換性）
     * @returns {{detected: boolean, reason: string, timeout: number}}
     */
    detectSiteSpecificPatterns() {
      try {
        const currentUrl = window.location.href;

        // nicomanga.com（元の処理を保持）
        if (currentUrl.includes("nicomanga.com")) {
          return {
            detected: true,
            reason: "ニコニコ漫画の画像読み込み",
            timeout: 5000,
          };
        }

        // pixiv
        if (currentUrl.includes("pixiv.net")) {
          return {
            detected: true,
            reason: "pixivの画像読み込み",
            timeout: 4000,
          };
        }

        // その他の漫画サイト
        const mangaSites = ["comic", "manga", "webtoon"];
        if (mangaSites.some((site) => currentUrl.includes(site))) {
          return {
            detected: true,
            reason: "漫画サイトの画像読み込み",
            timeout: 4000,
          };
        }

        return { detected: false, reason: "", timeout: 0 };
      } catch (error) {
        console.error("[MangaViewer] detectSiteSpecificPatterns: error:", error);
        return { detected: false, reason: "エラー", timeout: 0 };
      }
    }

    /**
     * 適応的な画像読み込み待機
     * @param {Object} loadingInfo - 読み込み情報
     * @returns {Promise<void>}
     */
    async waitForImagesAdaptive(loadingInfo) {
      const { strategy, timeout } = loadingInfo;

      try {
        switch (strategy) {
          case "lazy":
            await this.waitForLazyLoadedImages(timeout);
            break;
          case "dynamic":
            await this.waitForDynamicContent(timeout);
            break;
          case "loading":
            await this.waitForPageLoading(timeout);
            break;
          case "spa":
            await this.waitForSPAContent(timeout);
            break;
          case "site-specific":
            await this.waitForMangaImages(timeout);
            break;
          default:
            await this.waitForBasicImageLoading(timeout);
            break;
        }
      } catch (error) {
        console.error(`[MangaViewer] waitForImagesAdaptive: error in ${strategy} strategy:`, error);
        // エラーが発生しても処理を続行
      }
    }

    /**
     * レイジーロード画像の読み込み待機
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForLazyLoadedImages(timeout) {
      return new Promise((resolve) => {
        let resolved = false;
        const startTime = Date.now();

        const checkLazyImages = () => {
          if (resolved) return;

          try {
            // data-src属性を持つ画像の読み込み状況をチェック
            const lazyImages = document.querySelectorAll("img[data-src]");
            let loadedCount = 0;

            lazyImages.forEach((img) => {
              if (img.src && img.src !== img.dataset.src) {
                // data-srcからsrcに移行済み
                loadedCount++;
              }
            });

            // 十分な画像が読み込まれたか、またはタイムアウト
            const loadedRatio = lazyImages.length > 0 ? loadedCount / lazyImages.length : 1;
            const elapsed = Date.now() - startTime;

            if (loadedRatio >= 0.5 || elapsed >= timeout) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage(
                  `レイジーロード画像の読み込み完了 (${loadedCount}/${lazyImages.length})`
                );
              }
              resolve();
            } else {
              setTimeout(checkLazyImages, 200);
            }
          } catch (error) {
            console.error("[MangaViewer] waitForLazyLoadedImages: error:", error);
            resolved = true;
            resolve();
          }
        };

        // 初期チェック
        checkLazyImages();

        // DOM変更を監視
        const observer = new MutationObserver(() => {
          if (!resolved) {
            checkLazyImages();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["src", "data-src"],
        });

        // タイムアウト処理
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            observer.disconnect();
            resolve();
          }
        }, timeout);
      });
    }

    /**
     * 動的コンテンツの読み込み待機
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForDynamicContent(timeout) {
      return new Promise((resolve) => {
        let resolved = false;
        const startTime = Date.now();
        let lastImageCount = document.querySelectorAll("img").length;

        const checkDynamicContent = () => {
          if (resolved) return;

          try {
            const currentImageCount = document.querySelectorAll("img").length;
            const elapsed = Date.now() - startTime;

            // 画像数が安定したか、タイムアウト
            if (currentImageCount === lastImageCount && elapsed > 1000) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage(
                  `動的コンテンツの読み込み完了 (${currentImageCount}枚の画像)`
                );
              }
              resolve();
            } else if (elapsed >= timeout) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage(`タイムアウト - 現在の画像で続行 (${currentImageCount}枚)`);
              }
              resolve();
            } else {
              lastImageCount = currentImageCount;
              setTimeout(checkDynamicContent, 300);
            }
          } catch (error) {
            console.error("[MangaViewer] waitForDynamicContent: error:", error);
            resolved = true;
            resolve();
          }
        };

        // 初期チェック
        setTimeout(checkDynamicContent, 500);
      });
    }

    /**
     * ページ読み込み完了の待機
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForPageLoading(timeout) {
      return new Promise((resolve) => {
        let resolved = false;

        const checkPageReady = () => {
          if (resolved) return;

          try {
            const isReady = document.readyState === "complete" || document.readyState === "interactive";
            const hasImages = document.querySelectorAll("img").length >= 3;

            if (isReady && hasImages) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage("ページの読み込みが完了しました");
              }
              resolve();
            } else {
              setTimeout(checkPageReady, 200);
            }
          } catch (error) {
            console.error("[MangaViewer] waitForPageLoading: error:", error);
            resolved = true;
            resolve();
          }
        };

        // document.readyStateの変更を監視
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", checkPageReady);
          window.addEventListener("load", checkPageReady);
        }

        // 初期チェック
        checkPageReady();

        // タイムアウト処理
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        }, timeout);
      });
    }

    /**
     * SPAコンテンツの読み込み待機
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForSPAContent(timeout) {
      return new Promise((resolve) => {
        let resolved = false;
        const startTime = Date.now();
        let stableCount = 0;
        let lastContentHash = "";

        const checkSPAContent = () => {
          if (resolved) return;

          try {
            // ページコンテンツのハッシュを計算（簡易版）
            const contentElements = document.querySelectorAll('img, [class*="content"], main, article');
            const currentHash = Array.from(contentElements)
              .map((el) => el.tagName + el.className)
              .join("");
            const elapsed = Date.now() - startTime;

            if (currentHash === lastContentHash) {
              stableCount++;
            } else {
              stableCount = 0;
              lastContentHash = currentHash;
            }

            // コンテンツが安定したか、タイムアウト
            if (stableCount >= 3 || elapsed >= timeout) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage("SPAコンテンツの読み込み完了");
              }
              resolve();
            } else {
              setTimeout(checkSPAContent, 300);
            }
          } catch (error) {
            console.error("[MangaViewer] waitForSPAContent: error:", error);
            resolved = true;
            resolve();
          }
        };

        // 初期チェック
        setTimeout(checkSPAContent, 500);
      });
    }

    /**
     * 基本的な画像読み込み待機
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForBasicImageLoading(timeout) {
      return new Promise((resolve) => {
        let resolved = false;

        const checkBasicImages = () => {
          if (resolved) return;

          try {
            const images = document.querySelectorAll("img");
            let loadedImages = 0;

            images.forEach((img) => {
              if (img.complete && img.naturalHeight !== 0) {
                loadedImages++;
              }
            });

            const hasEnoughImages = images.length >= 3;
            const goodLoadRatio = images.length > 0 ? loadedImages / images.length >= 0.5 : false;

            if (hasEnoughImages && goodLoadRatio) {
              resolved = true;
              if (this.spinner) {
                this.spinner.updateMessage("基本的な画像読み込み完了");
              }
              resolve();
            } else {
              setTimeout(checkBasicImages, 300);
            }
          } catch (error) {
            console.error("[MangaViewer] waitForBasicImageLoading: error:", error);
            resolved = true;
            resolve();
          }
        };

        // 初期チェック
        checkBasicImages();

        // タイムアウト処理
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        }, timeout);
      });
    }

    /**
     * マンガサイト用の画像読み込み待機（後方互換性）
     * @param {number} timeout - タイムアウト時間
     * @returns {Promise<void>}
     */
    async waitForMangaImages(timeout = 5000) {
      return new Promise((resolve) => {
        // 主要なマンガコンテナ要素
        const mangaContainer =
          document.querySelector(".content-inner") ||
          document.querySelector(".manga-content") ||
          document.querySelector('[class*="content"]') ||
          document.querySelector("main");

        // すでに十分な画像が読み込まれているかチェック
        const checkIfImagesLoaded = () => {
          const images = document.querySelectorAll("img");
          // 画像要素が一定数以上あるか確認
          const hasEnoughImages = images.length >= 5;

          // 画像のロード状態をチェック
          let loadedImages = 0;
          images.forEach((img) => {
            if (img.complete && img.naturalHeight !== 0) {
              loadedImages++;
            }
          });

          // 画像が十分に読み込まれているかどうか
          const imagesAreLoaded = loadedImages >= 3; // 最低3枚の画像がロードされているか

          if (hasEnoughImages && imagesAreLoaded) {
            if (this.spinner) {
              this.spinner.updateMessage("マンガ画像の読み込みが完了しました");
            }
            resolve();
            return true;
          }
          return false;
        };

        // 初期チェック
        if (checkIfImagesLoaded()) {
          return;
        }

        // DOM変更を監視して画像の読み込みを検出
        const observer = new MutationObserver((mutations, obs) => {
          if (checkIfImagesLoaded()) {
            obs.disconnect(); // 読み込み完了したら監視を停止
          }
        });

        // コンテナが見つかったら監視を開始
        if (mangaContainer) {
          observer.observe(mangaContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src", "data-src"],
          });
        } else {
          // コンテナが見つからない場合はdocument.bodyを監視
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src", "data-src"],
          });
        }

        // バックアップタイマー（指定されたタイムアウト時間で待機）
        const timeoutId = setTimeout(() => {
          observer.disconnect();
          if (this.spinner) {
            this.spinner.updateMessage("タイムアウト - 利用可能な画像で続行します");
          }
          resolve();
        }, timeout);
      });
    }

    /**
     * URLが同一オリジンかどうかをチェックする
     * @param {string} url - チェックするURL
     * @returns {boolean} 同一オリジンの場合true
     */
    isSameOrigin(url) {
      try {
        if (!url) return false;

        // 相対URLの場合は同一オリジン
        if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
          return true;
        }

        // data:やblob:URLの場合は同一オリジン扱い
        if (url.startsWith("data:") || url.startsWith("blob:")) {
          return true;
        }

        // 絶対URLの場合はオリジンを比較
        const urlObj = new URL(url, window.location.href);
        return urlObj.origin === window.location.origin;
      } catch (error) {
        console.error("[MangaViewer] isSameOrigin: error checking origin:", error);
        return false;
      }
    }

    /**
     * メタデータ付きURLを検証する（最適化版）
     * @param {Array} urlsWithMetadata - URLとメタデータを含むオブジェクトの配列
     * @returns {Promise<{initialUrls: string[], onValidatedCallback: Function}>}
     */
    async validateUrlsWithMetadata(urlsWithMetadata) {
      const validUrls = [];
      let processed = 0;
      const total = urlsWithMetadata.length;
      let validUrlsFound = 0;
      const minInitialUrls = 2;
      let initialLoadComplete = false;
      let onValidatedCallback = null;

      // 現在のサイトがTwitter/Xかどうかを判定
      const isTwitter =
        window.location.href.includes("twitter.com") || window.location.href.includes("x.com");

      // コールバック関数を返すオブジェクトを作成
      const result = {
        initialUrls: [],
        onValidated: function (callback) {
          onValidatedCallback = callback;
        },
      };

      // まず検証不要な画像を即座に追加
      const preValidatedUrls = [];
      urlsWithMetadata.forEach((item) => {
        if (!item.needsValidation) {
          // 既に読み込まれている画像のサイズチェック
          if (item.isLoaded) {
            const minWidth = isTwitter ? 200 : 400;
            const minHeight = isTwitter ? 200 : 400;

            if (item.width > minWidth && item.height > minHeight) {
              preValidatedUrls.push(item.url);
              validUrlsFound++;
            }
          } else {
            // 同一オリジンの未読み込み画像は検証なしで追加
            preValidatedUrls.push(item.url);
            validUrlsFound++;
          }
          processed++;
        }
      });

      // 検証不要な画像を結果に追加
      validUrls.push(...preValidatedUrls);

      if (this.spinner) {
        this.spinner.updateMessage(
          `${preValidatedUrls.length}枚の画像を即座に追加しました。残り${total - processed}枚を検証中...`
        );
      }

      // 十分な画像が既に見つかっている場合は初期表示を開始
      if (validUrlsFound >= minInitialUrls) {
        initialLoadComplete = true;
        result.initialUrls = [...validUrls];

        if (this.spinner) {
          this.spinner.updateMessage(
            `最初の${validUrlsFound}枚の画像を表示します。残りは引き続き検証中...`
          );
        }
      }

      // バックグラウンドで残りの画像を検証
      const validateInBackground = async () => {
        // プログレスバーを初期化
        if (unsafeWindow.MangaViewer && unsafeWindow.MangaViewer.updateProgress) {
          const needsValidationCount = urlsWithMetadata.filter((item) => item.needsValidation).length;
          if (needsValidationCount > 0) {
            unsafeWindow.MangaViewer.updateProgress(
              0,
              `画像検証を開始... (${processed}/${total}) - ${needsValidationCount}枚要検証`,
              "loading"
            );
          } else {
            unsafeWindow.MangaViewer.updateProgress(
              100,
              `検証完了: ${validUrls.length}枚の画像を処理しました`,
              "complete"
            );
            return;
          }
        }

        for (const item of urlsWithMetadata) {
          // 検証不要な画像はスキップ（既に処理済み）
          if (!item.needsValidation) {
            continue;
          }

          try {
            // 有効なURLかどうかを確認
            new URL(item.url, window.location.href);

            // Twitter/Xの場合はpbs.twimg.comドメインを優先
            const isTwitterImage = item.url.includes("pbs.twimg.com/media");

            // 画像ファイルの拡張子かどうかを確認
            const extension = item.url.split(".").pop().toLowerCase().split("?")[0];
            const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

            // TwitterのURLには必ずしも拡張子がないので、ドメインで判断
            const isValidByExtension = validExtensions.includes(extension) || isTwitterImage;

            if (!isValidByExtension) {
              processed++;
              updateProgressBar();
              continue;
            }

            // 画像のサイズを確認（検証が必要な画像のみ）
            const img = new Image();
            img.src = item.url;
            await new Promise((resolve) => {
              img.onload = () => {
                processed++;

                // Twitterの画像は通常小さめなので、サイズの閾値を下げる
                const minWidth = isTwitter ? 200 : 400;
                const minHeight = isTwitter ? 200 : 400;

                if (img.width > minWidth && img.height > minHeight) {
                  // Twitterの画像は優先順位を上げる
                  if (isTwitterImage) {
                    // Twitter画像をリストの先頭に追加
                    validUrls.unshift(item.url);
                  } else {
                    validUrls.push(item.url);
                  }

                  validUrlsFound++;

                  // 最初の表示用の画像が十分に集まったらコールバックを呼び出し
                  if (!initialLoadComplete && validUrlsFound >= minInitialUrls) {
                    initialLoadComplete = true;
                    result.initialUrls = [...validUrls];

                    if (this.spinner) {
                      this.spinner.updateMessage(
                        `最初の${validUrlsFound}枚の画像を表示します。残りは引き続き検証中...`
                      );
                    }
                  }

                  // 検証が進むごとにコールバックで新しい画像を通知
                  if (initialLoadComplete && onValidatedCallback) {
                    onValidatedCallback([...validUrls]);
                  }
                }

                // 進捗状況を更新
                if (this.spinner && processed % 5 === 0) {
                  const percent = Math.round((processed / total) * 100);
                  this.spinner.updateMessage(
                    `画像を検証中... ${processed}/${total} (${percent}%) - ${validUrlsFound}枚有効`
                  );
                }

                // プログレスバーを更新
                updateProgressBar();

                resolve();
              };
              img.onerror = () => {
                processed++;

                // 進捗状況を更新
                if (this.spinner && processed % 5 === 0) {
                  const percent = Math.round((processed / total) * 100);
                  this.spinner.updateMessage(
                    `画像を検証中... ${processed}/${total} (${percent}%) - ${validUrlsFound}枚有効`
                  );
                }

                // プログレスバーを更新
                updateProgressBar();

                resolve();
              };
            });
          } catch (e) {
            processed++;
            // プログレスバーを更新
            updateProgressBar();
            continue;
          }
        }

        // 検証完了時の処理
        if (this.spinner) {
          this.spinner.updateMessage(`${validUrls.length}枚の有効な画像を見つけました`);
        }

        // 完了メッセージで100%に設定
        if (unsafeWindow.MangaViewer && unsafeWindow.MangaViewer.updateProgress) {
          unsafeWindow.MangaViewer.updateProgress(
            100,
            `検証完了: ${validUrls.length}枚の有効な画像を見つけました`,
            "complete"
          );
        }

        // すべての検証が終わったら最終結果をコールバックで通知
        if (onValidatedCallback) {
          onValidatedCallback([...validUrls]);
        }
      };

      // 進捗バーを更新する関数
      const updateProgressBar = () => {
        if (unsafeWindow.MangaViewer && unsafeWindow.MangaViewer.updateProgress) {
          const percent = Math.round((processed / total) * 100);
          const message = `画像を検証中... ${processed}/${total} (${percent}%) - ${validUrlsFound}枚有効`;
          unsafeWindow.MangaViewer.updateProgress(percent, message, "loading");
        }
      };

      // バックグラウンドで検証を開始
      validateInBackground();

      // 最低限の画像が集まるまで待機（既に十分な画像がある場合はスキップ）
      if (!initialLoadComplete && urlsWithMetadata.length > 0) {
        // 最大3秒まで待機（高速化のため短縮）
        let waitTime = 0;
        const maxWaitTime = 3000; // 最大3秒（5秒から短縮）
        const checkInterval = 200; // 200msごとにチェック

        while (!initialLoadComplete && waitTime < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, checkInterval));
          waitTime += checkInterval;

          // 少なくとも数枚の画像が見つかったら初期表示を開始
          if (
            validUrls.length > 0 &&
            (validUrls.length >= minInitialUrls || processed >= urlsWithMetadata.length / 3)
          ) {
            initialLoadComplete = true;
            result.initialUrls = [...validUrls];

            if (this.spinner) {
              this.spinner.updateMessage(
                `最初の${validUrls.length}枚の画像を表示します。残りは引き続き検証中...`
              );
            }
            break;
          }
        }

        // 待機時間が終了しても最低限の画像が見つからなければ、現状の結果を返す
        if (!initialLoadComplete) {
          initialLoadComplete = true;
          result.initialUrls = [...validUrls];

          if (this.spinner) {
            const message =
              validUrls.length > 0
                ? `最初の${validUrls.length}枚の画像を表示します。残りは引き続き検証中...`
                : `有効な画像を検索中です...`;
            this.spinner.updateMessage(message);
          }
        }
      }

      return result;
    }

    /**
     * srcset文字列をパースする
     * @param {string} srcset
     * @returns {{url: string, width: number}[]}
     */
    parseSrcset(srcset) {
      return srcset
        .split(",")
        .map((src) => {
          const [url, width] = src.trim().split(/\s+/);
          return {
            url: url,
            width: parseInt(width || "0", 10),
          };
        })
        .sort((a, b) => a.width - b.width);
    }
  }

  class UIManager {
    constructor(shadowHost, imageUrls) {
      this.shadowHost = shadowHost;
      this.imageUrls = imageUrls;
      this.currentScale = 1;
      this.isDragging = false;
      this.startX = 0;
    }

    /**
     * ビューアの状態を更新する
     * @param {Object} state - 更新する状態
     */
    updateState(state) {
      if (state.scale !== undefined) {
        this.currentScale = state.scale;
      }
    }

    /**
     * ビューアを閉じる
     */
    closeViewer() {
      if (this.shadowHost && this.shadowHost.parentNode) {
        this.shadowHost.parentNode.removeChild(this.shadowHost);
      }
    }
  }

  // グローバルスコープに公開（デバッグ用）
  unsafeWindow.MangaViewer = {
    DataLoader: DataLoader,
    UIBuilder: UIBuilder,
    UIManager: UIManager,
  };

  // ビューアを起動する関数
  async function launchViewer() {
    let spinner = null;

    try {
      // React可用性チェック
      if (!checkReactAvailability()) {
        throw new Error(
          "React or ReactDOM is not available. Please check if the required libraries are loaded."
        );
      }

      // 既にビューアがアクティブな場合は終了
      if (globalState.isViewerActive) {
        console.warn("[MangaViewer] Viewer is already active");
        return;
      }

      // コントロールパネルを非表示
      if (globalState.controlPanel) {
        globalState.controlPanel.hide();
      }

      if (isMobile()) {
        try {
          setViewport();
        } catch (viewportError) {
          console.error("[MangaViewer] launchViewer: error setting viewport:", viewportError);
          // ビューポート設定エラーは致命的ではないので続行
        }
      }

      // ローディングスピナーを表示
      spinner = new LoadingSpinner();
      const spinnerElement = spinner.show("画像を検索中...");
      if (!spinnerElement) {
        throw new Error("Failed to create loading spinner");
      }

      const loader = new DataLoader();
      // スピナーを設定
      loader.setSpinner(spinner);

      // 現在のURLをチェック
      let isTwitter = false;
      try {
        isTwitter =
          window.location.href.includes("twitter.com") || window.location.href.includes("x.com");
      } catch (urlError) {
        console.error("[MangaViewer] launchViewer: error checking URL:", urlError);
        // URL確認エラーは致命的ではないので続行
      }

      // 画像URL収集を開始
      spinner.updateMessage("画像を検索中...");
      const result = await loader.collectImageUrls();

      if (!result || !result.initialUrls) {
        throw new Error("Image collection returned invalid result");
      }

      // 最初は何も見つからなくても起動 - 自動リトライ機能でリカバリ
      spinner.updateMessage(`${result.initialUrls.length}枚の画像を読み込みました。ビューアを準備中...`);

      const builder = new UIBuilder();
      builder.setSpinner(spinner);

      // ビューアオプションを設定
      const viewerOptions = {
        initialAutoNav: !isTwitter, // Xの場合はチャプター自動移動をオフに
      };

      // ビューアを構築（初期画像のプリロードを含む）
      const viewerElement = await builder.buildViewer(result.initialUrls, viewerOptions);
      if (!viewerElement) {
        throw new Error("Failed to build viewer");
      }

      // バックグラウンドで検証された新しい画像を受け取るコールバック
      try {
        if (result.onValidated && typeof result.onValidated === "function") {
          result.onValidated((updatedUrls) => {
            try {
              if (updatedUrls && updatedUrls.length > 0 && builder.updateImages) {
                builder.updateImages(updatedUrls);
              }
            } catch (updateError) {
              console.error("[MangaViewer] launchViewer: error updating images:", updateError);
            }
          });
        }
      } catch (callbackError) {
        console.error(
          "[MangaViewer] launchViewer: error setting up validation callback:",
          callbackError
        );
        // コールバック設定エラーは致命的ではないので続行
      }

      // ビューア表示後にローディングを非表示
      spinner.hide();
      spinner = null; // 正常終了時はspinnerをnullに
    } catch (error) {
      // エラーが発生した場合
      console.error("[MangaViewer] launchViewer: unexpected error:", error);

      // リソースクリーンアップ
      cleanupResources();

      if (spinner) {
        try {
          spinner.hide();
        } catch (spinnerError) {
          console.error("[MangaViewer] launchViewer: error hiding spinner:", spinnerError);
        }
      }

      // ユーザーにエラーを通知
      try {
        alert(`ビューア起動中にエラーが発生しました: ${error.message || error}`);
      } catch (alertError) {
        console.error("[MangaViewer] launchViewer: error showing alert:", alertError);
      }
    }
  }

  // Tampermonkeyメニューに登録
  GM_registerMenuCommand("ブック風マンガビューア起動", launchViewer);

  // マテリアルアイコンの読み込み
  function loadMaterialIcons() {
    return new Promise((resolve) => {
      try {
        // 既に読み込まれているかチェック
        if (document.querySelector('link[href*="material-icons"]')) {
          resolve(true);
          return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";

        link.onload = () => resolve(true);
        link.onerror = () => {
          console.warn("[MangaViewer] Failed to load Material Icons, using fallback");
          resolve(false);
        };

        document.head.appendChild(link);
      } catch (error) {
        console.error("[MangaViewer] Error loading Material Icons:", error);
        resolve(false);
      }
    });
  }

  // 画像分析による表示制御を廃止（常時表示）

  // SPAページ変更検出システム
  class SPAPageObserver {
    constructor() {
      this.currentUrl = window.location.href;
      this.currentPageType = this.determineCurrentPageType();
      this.observers = [];
      this.isObserving = false;
    }

    // 現在のページタイプを判定
    determineCurrentPageType() {
      const currentUrl = window.location.href;

      if (
        (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) &&
        currentUrl.includes("/status/")
      ) {
        return "twitter-status";
      } else if (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) {
        return "twitter-general";
      } else {
        return "generic";
      }
    }

    // URL変更の監視を開始
    startObserving() {
      if (this.isObserving) return;

      // history API のオーバーライド
      this.wrapHistoryAPI();

      // popstate イベントの監視
      addEventListenerSafely(window, "popstate", () => {
        this.checkForUrlChange();
      });

      // 定期的なURL変更チェック（フォールバック）
      this.urlCheckInterval = setIntervalSafely(() => {
        this.checkForUrlChange();
      }, 1000);

      this.isObserving = true;
    }

    // history APIをラップして変更を検出
    wrapHistoryAPI() {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        setTimeoutSafely(() => this.checkForUrlChange(), 100);
      };

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        setTimeoutSafely(() => this.checkForUrlChange(), 100);
      };
    }

    // URL変更のチェック
    checkForUrlChange() {
      const newUrl = window.location.href;
      const newPageType = this.determineCurrentPageType();

      if (newUrl !== this.currentUrl || newPageType !== this.currentPageType) {
        const previousUrl = this.currentUrl;
        const previousPageType = this.currentPageType;

        this.currentUrl = newUrl;
        this.currentPageType = newPageType;

        // オブザーバーに通知
        this.notifyObservers({
          previousUrl,
          currentUrl: newUrl,
          previousPageType,
          currentPageType: newPageType,
        });
      }
    }

    // オブザーバーの追加
    addObserver(callback) {
      if (typeof callback === "function") {
        this.observers.push(callback);
      }
    }

    // オブザーバーの削除
    removeObserver(callback) {
      this.observers = this.observers.filter((obs) => obs !== callback);
    }

    // オブザーバーに通知
    notifyObservers(changeInfo) {
      this.observers.forEach((callback) => {
        try {
          callback(changeInfo);
        } catch (error) {
          console.error("[MangaViewer] Error in SPA observer callback:", error);
        }
      });
    }

    // 監視停止
    stopObserving() {
      if (this.urlCheckInterval) {
        clearInterval(this.urlCheckInterval);
        this.urlCheckInterval = null;
      }
      this.isObserving = false;
    }

    // 現在のページタイプを取得
    getCurrentPageType() {
      return this.currentPageType;
    }

    // Twitter状態ページかどうか判定
    isTwitterStatusPage() {
      return this.currentPageType === "twitter-status";
    }
  }

  // グローバルSPAオブザーバーインスタンス
  const spaObserver = new SPAPageObserver();

  // 改良版Twitter個別ページの判定（SPA対応）
  function isTwitterStatusPage() {
    try {
      // SPAオブザーバーが動作している場合はそちらを使用
      if (spaObserver.isObserving) {
        return spaObserver.isTwitterStatusPage();
      }

      // フォールバック：従来の静的判定
      const currentUrl = window.location.href;
      return (
        (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) &&
        currentUrl.includes("/status/")
      );
    } catch (error) {
      console.error("[MangaViewer] isTwitterStatusPage: error:", error);
      return false;
    }
  }

  // ページタイプ判定ヘルパー関数
  function getCurrentPageType() {
    try {
      if (spaObserver.isObserving) {
        return spaObserver.getCurrentPageType();
      }

      // フォールバック判定
      const currentUrl = window.location.href;
      if (
        (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) &&
        currentUrl.includes("/status/")
      ) {
        return "twitter-status";
      } else if (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) {
        return "twitter-general";
      } else {
        return "generic";
      }
    } catch (error) {
      console.error("[MangaViewer] getCurrentPageType: error:", error);
      return "generic";
    }
  }

  class GlassControlPanel {
    constructor() {
      this.shadowHost = null;
      this.shadowRoot = null;
      this.handleElement = null;
      this.panelElement = null;
      this.isVisible = false;
      this.isExpanded = false;
      this.checkAttempts = 0;
      this.checkTimer = null;
      this.isHiddenByFullscreen = false;
      this.originalVisibilityState = false;
      this.spaObserverCallback = null;
      this.currentPageType = null;
      this.expandTimer = null;
      this.localEventListeners = [];
    }

    async init() {
      try {
        // シャドウDOMホストを作成
        this.shadowHost = document.createElement("div");
        this.shadowHost.id = "manga-viewer-control-panel-host";
        this.shadowHost.style.cssText = `
                    position: fixed !important;
                    top: 20px !important;
                    right: 12px !important;
                    z-index: 9999 !important;
                    pointer-events: none !important;
                `;

        // シャドウDOMを作成
        this.shadowRoot = this.shadowHost.attachShadow({ mode: "closed" });

        // スタイルを追加
        const style = document.createElement("style");
        style.textContent = this.getGlassControlStyles();
        this.shadowRoot.appendChild(style);

        // コントロールパネルHTML構造を作成
        const panelContainer = document.createElement("div");
        panelContainer.className = "glass-control-container hidden";
        panelContainer.innerHTML = `
                    <div class="control-handle" aria-label="マンガビューアコントロール" title="マンガビューア"></div>
                    <div class="control-panel">
                        <div class="panel-header">
                            <span class="material-icons">auto_stories</span>
                            <span class="panel-title">マンガビューア</span>
                        </div>
                        <div class="panel-content">
                            <button class="panel-button primary" data-action="launch">
                                <span class="material-icons">play_arrow</span>
                                ビューア起動
                            </button>
                            <button class="panel-button" data-action="settings">
                                <span class="material-icons">settings</span>
                                設定
                            </button>
                            <button class="panel-button" data-action="refresh">
                                <span class="material-icons">refresh</span>
                                再分析
                            </button>
                        </div>
                    </div>
                `;

        this.shadowRoot.appendChild(panelContainer);
        document.body.appendChild(this.shadowHost);

        // 要素参照を取得
        this.handleElement = this.shadowRoot.querySelector(".control-handle");
        this.panelElement = this.shadowRoot.querySelector(".control-panel");
        this.containerElement = panelContainer;

        // イベントリスナーを設定
        this.setupEventListeners();

        // フォントが読み込まれるまで少し待ってから、フォールバック処理
        setTimeout(() => {
          this.checkIconDisplay();
        }, 1000);

        // 常時表示モードを開始
        this.startAlwaysShowMode();

        // 全画面表示の監視を開始
        this.observeFullscreenChanges();

        return true;
      } catch (error) {
        console.error("[MangaViewer] Error initializing Glass Control Panel:", error);
        return false;
      }
    }

    // パネル専用の安全なイベントリスナー登録（ローカル追跡）
    addLocalEventListener(element, event, handler, options = false) {
      try {
        if (!element || typeof element.addEventListener !== "function") return;
        element.addEventListener(event, handler, options);
        this.localEventListeners.push({ element, event, handler, options });
      } catch (error) {
        console.error("[MangaViewer] Error adding local event listener:", error);
      }
    }

    // イベントリスナーを設定
    setupEventListeners() {
      try {
        // ハンドルのホバーイベント
        this.addLocalEventListener(this.handleElement, "mouseenter", () => {
          this.expandPanel();
        });

        // パネルのホバーイベント
        this.addLocalEventListener(this.panelElement, "mouseenter", () => {
          this.expandPanel();
        });

        // コンテナ全体のマウスリーブイベント
        this.addLocalEventListener(this.containerElement, "mouseleave", (e) => {
          // マウスがコンテナの外に出た時のみ閉じる
          if (!this.containerElement.contains(e.relatedTarget)) {
            this.collapsePanel();
          }
        });

        // パネルボタンのクリックイベント
        const buttons = this.shadowRoot.querySelectorAll(".panel-button");
        buttons.forEach((button) => {
          this.addLocalEventListener(button, "click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleButtonClick(button.getAttribute("data-action"));
          });
        });

        // アクセシビリティ用のキーボードイベント
        this.addLocalEventListener(this.handleElement, "keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleButtonClick("launch");
          }
        });

        // ハンドルをフォーカス可能にする
        this.handleElement.setAttribute("tabindex", "0");
      } catch (error) {
        console.error("[MangaViewer] Error setting up event listeners:", error);
      }
    }

    // パネル展開
    expandPanel() {
      // ハンドルが表示されている限り展開を許可（isVisibleチェックを削除）
      if (
        !this.isExpanded &&
        this.containerElement &&
        !this.containerElement.classList.contains("hidden")
      ) {
        clearTimeout(this.expandTimer);
        this.isExpanded = true;
        this.panelElement.classList.add("expanded");
        this.containerElement.style.pointerEvents = "auto";
      }
    }

    // パネル収縮
    collapsePanel() {
      if (this.isExpanded) {
        this.expandTimer = setTimeout(() => {
          this.isExpanded = false;
          this.panelElement.classList.remove("expanded");
          this.containerElement.style.pointerEvents = "none";
        }, 1000);
      }
    }

    // ボタンクリック処理
    async handleButtonClick(action) {
      try {
        switch (action) {
          case "launch":
            await this.handleLaunch();
            break;
          case "settings":
            this.handleSettings();
            break;
          case "refresh":
            this.handleRefresh();
            break;
        }
      } catch (error) {
        console.error("[MangaViewer] Error handling button click:", error);
      }
    }

    // ビューア起動処理
    async handleLaunch() {
      try {
        // 既にビューアがアクティブな場合は何もしない
        if (globalState.isViewerActive) {
          return;
        }

        // ビューア起動
        await launchViewer();

        // 成功フィードバック
        this.showSuccessFeedback();

        // パネルを非表示
        this.hide();
      } catch (error) {
        console.error("[MangaViewer] Error launching viewer:", error);
        this.showErrorFeedback();
      }
    }

    // 設定処理（将来の拡張用）
    handleSettings() {
      console.log("[MangaViewer] Settings clicked (feature not implemented yet)");
    }

    // 再分析処理（画像分析廃止により単純化）
    handleRefresh() {
      this.show();
      console.log("[MangaViewer] Control panel refreshed (always show mode)");
    }

    // 成功フィードバック
    showSuccessFeedback() {
      if (this.handleElement) {
        // ハンドルの色を緑に変更
        this.handleElement.style.background = "rgba(76, 175, 80, 0.8)";
        this.handleElement.style.boxShadow = "-2px 0 12px rgba(76, 175, 80, 0.4)";

        setTimeout(() => {
          this.handleElement.style.background = "";
          this.handleElement.style.boxShadow = "";
        }, 1500);
      }
    }

    // エラーフィードバック
    showErrorFeedback() {
      if (this.handleElement) {
        // ハンドルの色を赤に変更
        this.handleElement.style.background = "rgba(244, 67, 54, 0.8)";
        this.handleElement.style.boxShadow = "-2px 0 12px rgba(244, 67, 54, 0.4)";

        setTimeout(() => {
          this.handleElement.style.background = "";
          this.handleElement.style.boxShadow = "";
        }, 1500);
      }
    }

    // 画像分析を廃止し、常時表示ロジックに変更
    startAlwaysShowMode() {
      // 現在のページタイプを記録
      this.currentPageType = getCurrentPageType();

      // 即座にコントロールパネルを表示
      this.show();

      // DOM変更の監視
      this.observePageChanges();

      // SPAページ変更の監視を開始
      this.observeSPAChanges();
    }

    // 画像分析を廃止（常時表示モード）
    checkShouldShow() {
      // 常に表示（画像分析なし）
      this.show();
      return true;
    }

    // 有効な画像を収集（Twitter SPA対応強化版）
    // 画像収集機能を廃止（常時表示モードでは不要）
    collectValidImages() {
      return [];
    }

    // ページ変更の監視（画像分析不要のためシンプル化）
    observePageChanges() {
      // 常時表示モードでは画像監視は不要
      console.log("[MangaViewer] Page changes observation disabled (always show mode)");
    }

    // SPAページ変更の監視
    observeSPAChanges() {
      try {
        // SPAページ変更のコールバックを定義
        this.spaObserverCallback = (changeInfo) => {
          // ページタイプが変更された場合の処理
          if (changeInfo.currentPageType !== this.currentPageType) {
            this.currentPageType = changeInfo.currentPageType;

            // ページタイプに応じて処理を実行
            setTimeoutSafely(() => {
              this.handlePageTypeChange(changeInfo);
            }, 500); // ページ遷移完了を待つ
          }
        };

        // SPAオブザーバーにコールバックを登録
        if (spaObserver && typeof spaObserver.addObserver === "function") {
          spaObserver.addObserver(this.spaObserverCallback);
        }
      } catch (error) {
        console.error("[MangaViewer] Error setting up SPA observer for FAB:", error);
      }
    }

    // ページタイプ変更時の処理（常時表示モードでは簡略化）
    handlePageTypeChange(changeInfo) {
      console.log(`[MangaViewer] Page type changed to: ${changeInfo.currentPageType}`);
      // 常時表示モードでは特別な処理不要
    }

    // Twitter個別ページへの遷移処理（常時表示モードでは簡略化）
    handleTwitterStatusPageTransition() {
      console.log("[MangaViewer] Twitter status page detected (always show mode)");
      // 常時表示モードでは特別な処理不要
    }

    // 全画面表示の監視
    observeFullscreenChanges() {
      try {
        // 全画面表示状態の変更を監視
        const handleFullscreenChange = () => {
          try {
            const isFullscreen = !!(
              document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement
            );

            if (isFullscreen) {
              // 全画面表示開始
              this.handleFullscreenEnter();
            } else {
              // 全画面表示終了
              this.handleFullscreenExit();
            }
          } catch (error) {
            console.error("[MangaViewer] Error handling fullscreen change:", error);
          }
        };

        // 各ブラウザ対応のイベントリスナーを追加
        const events = [
          "fullscreenchange",
          "webkitfullscreenchange",
          "mozfullscreenchange",
          "MSFullscreenChange",
        ];

        events.forEach((eventName) => {
          this.addLocalEventListener(document, eventName, handleFullscreenChange);
        });

        // クリーンアップ用にハンドラーを保存
        this.fullscreenHandler = handleFullscreenChange;
        this.fullscreenEvents = events;
      } catch (error) {
        console.error("[MangaViewer] Error setting up fullscreen observer:", error);
      }
    }

    // 全画面表示開始時の処理
    handleFullscreenEnter() {
      if (!this.isHiddenByFullscreen) {
        // 現在の表示状態を保存
        this.originalVisibilityState = this.isVisible;

        // コントロールパネルを非表示にする
        if (this.isVisible) {
          this.containerElement.classList.add("hidden");
          this.isVisible = false;
        }

        this.isHiddenByFullscreen = true;
      }
    }

    // 全画面表示終了時の処理
    handleFullscreenExit() {
      if (this.isHiddenByFullscreen) {
        // 元の表示状態に復帰
        if (this.originalVisibilityState) {
          this.containerElement.classList.remove("hidden");
          this.isVisible = true;
        }

        this.isHiddenByFullscreen = false;
      }
    }

    // アイコンの表示状態をチェックして、必要に応じてフォールバック
    checkIconDisplay() {
      try {
        if (!this.handleElement) return;

        const iconSpan = this.handleElement.querySelector(".material-icons");
        if (iconSpan) {
          // マテリアルアイコンのフォントが読み込まれているかチェック
          const computedStyle = window.getComputedStyle(iconSpan);
          const fontFamily = computedStyle.fontFamily;

          // Material Iconsフォントが適用されていない場合は絵文字にフォールバック
          if (!fontFamily.includes("Material Icons")) {
            console.warn("[MangaViewer] Material Icons font not loaded, using emoji fallback");
            this.handleElement.innerHTML = "📖";
            this.handleElement.style.fontSize = "24px";
          }
        }
      } catch (error) {
        console.warn("[MangaViewer] Error checking icon display, using emoji fallback:", error);
        if (this.handleElement) {
          this.handleElement.innerHTML = "📖";
          this.handleElement.style.fontSize = "24px";
        }
      }
    }

    getGlassControlStyles() {
      return `
                @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
                
                .glass-control-container {
                    position: relative;
                    pointer-events: none;
                }

                .glass-control-container.hidden .control-panel {
                    opacity: 0;
                    transform: translateX(100%) scale(0.8);
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .control-handle {
                    width: 6px;
                    height: 60px;
                    background: rgba(74, 144, 226, 0.8);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-top-left-radius: 8px;
                    border-bottom-left-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: auto;
                    position: relative;
                    z-index: 10;
                    box-shadow: -2px 0 8px rgba(74, 144, 226, 0.4);
                }

                .control-handle:hover {
                    width: 12px;
                    background: rgba(74, 144, 226, 1.0);
                    box-shadow: -2px 0 12px rgba(74, 144, 226, 0.6);
                }

                .control-handle:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
                }

                .control-panel {
                    position: absolute;
                    top: 0;
                    right: 0;
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
                    transform: translateX(100%) scale(0.8);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    z-index: 9;
                    margin-right: 12px;
                }

                .control-panel.expanded {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                    pointer-events: auto;
                }

                .panel-header {
                    background: rgba(255, 255, 255, 0.1);
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
                    background: rgba(74, 144, 226, 0.2);
                    border-color: rgba(74, 144, 226, 0.3);
                    color: rgba(255, 255, 255, 0.95);
                }

                .panel-button.primary:hover {
                    background: rgba(74, 144, 226, 0.3);
                    border-color: rgba(74, 144, 226, 0.4);
                }

                .panel-button .material-icons {
                    font-size: 16px;
                    color: currentColor;
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
                }

                /* アニメーション */
                @keyframes panelSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @keyframes panelSlideOut {
                    from {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%) scale(0.8);
                    }
                }

                /* 高コントラストモード対応 */
                @media (prefers-contrast: high) {
                    .control-handle {
                        background: rgba(74, 144, 226, 0.9);
                        border: 2px solid rgba(255, 255, 255, 0.8);
                    }

                    .control-panel {
                        background: rgba(0, 0, 0, 0.9);
                        border: 2px solid rgba(255, 255, 255, 0.8);
                    }
                }
            `;
    }

    show() {
      if (this.containerElement && this.isVisible !== true && !this.isHiddenByFullscreen) {
        this.containerElement.classList.remove("hidden");
        this.isVisible = true;
        // 表示ログを追加
        console.log("[MangaViewer] Control panel shown");
      }
    }

    hide() {
      if (this.containerElement && this.isVisible !== false && !this.isHiddenByFullscreen) {
        this.containerElement.classList.add("hidden");
        this.isVisible = false;
        // 非表示ログを追加
        console.log("[MangaViewer] Control panel hidden");
      }
    }

    destroy() {
      try {
        // ローカル追跡のイベントリスナーを解除
        if (this.localEventListeners && this.localEventListeners.length) {
          this.localEventListeners.forEach(({ element, event, handler, options }) => {
            try {
              if (element && typeof element.removeEventListener === "function") {
                element.removeEventListener(event, handler, options);
              }
            } catch (error) {
              console.error("[MangaViewer] Error removing local event listener:", error);
            }
          });
          this.localEventListeners = [];
        }
        // タイマーをクリーンアップ（定期チェック機能は廃止済み）
        clearTimeout(this.expandTimer);

        // オブザーバーをクリーンアップ
        if (this.pageObserver) {
          this.pageObserver.disconnect();
          this.pageObserver = null;
        }

        // SPAオブザーバーからコールバックを削除
        if (
          this.spaObserverCallback &&
          spaObserver &&
          typeof spaObserver.removeObserver === "function"
        ) {
          spaObserver.removeObserver(this.spaObserverCallback);
          this.spaObserverCallback = null;
        }

        // 全画面表示イベントリスナーをクリーンアップ
        if (this.fullscreenHandler && this.fullscreenEvents) {
          this.fullscreenEvents.forEach((eventName) => {
            try {
              document.removeEventListener(eventName, this.fullscreenHandler);
            } catch (error) {
              console.error("[MangaViewer] Error removing fullscreen event listener:", error);
            }
          });
          this.fullscreenHandler = null;
          this.fullscreenEvents = null;
        }

        if (this.shadowHost && this.shadowHost.parentNode) {
          this.shadowHost.parentNode.removeChild(this.shadowHost);
        }
        this.shadowHost = null;
        this.shadowRoot = null;
        this.handleElement = null;
        this.panelElement = null;
        this.containerElement = null;
        this.currentPageType = null;
      } catch (error) {
        console.error("[MangaViewer] Error destroying Glass Control Panel:", error);
      }
    }
  }

  // GlassControlPanel初期化関数
  async function initializeGlassControlPanel() {
    try {
      // 既にコントロールパネルが存在する場合は何もしない
      if (globalState.controlPanel) {
        return;
      }

      // SPAオブザーバーを起動
      if (spaObserver && typeof spaObserver.startObserving === "function") {
        spaObserver.startObserving();
      }

      // GlassControlPanelを作成
      globalState.controlPanel = new GlassControlPanel();
      const success = await globalState.controlPanel.init();

      if (!success) {
        console.warn("[MangaViewer] Failed to initialize Glass Control Panel");
        globalState.controlPanel = null;
      } else {
        // グローバルアクセス用にSPAオブザーバーも登録
        unsafeWindow.MangaViewer = unsafeWindow.MangaViewer || {};
        unsafeWindow.MangaViewer.SPAObserver = spaObserver;
        unsafeWindow.MangaViewer.showPanel = () => {
          if (globalState.controlPanel) {
            globalState.controlPanel.show();
            console.log("[MangaViewer] Control panel manually shown");
          }
        };
        unsafeWindow.MangaViewer.hidePanel = () => {
          if (globalState.controlPanel) {
            globalState.controlPanel.hide();
            console.log("[MangaViewer] Control panel manually hidden");
          }
        };
      }
    } catch (error) {
      console.error("[MangaViewer] Error initializing Glass Control Panel:", error);
      globalState.controlPanel = null;
    }
  }

  // ページロード時の処理
  function onPageLoad() {
    try {
      // GlassControlPanelを初期化
      initializeGlassControlPanel();

      // キーボードショートカット（Ctrl+Shift+M）
      addEventListenerSafely(document, "keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "M") {
          e.preventDefault();
          if (globalState.controlPanel) {
            if (globalState.controlPanel.isVisible) {
              globalState.controlPanel.hide();
            } else {
              globalState.controlPanel.show();
            }
          }
        }
      });

      // チャプター移動後の自動起動チェック
      const navigator = new ChapterNavigator();
      if (navigator.checkAutoLaunch()) {
        // ページ切り替え後の自動再起動に少しディレイ（1200〜1700ms）を入れる
        const autoLaunchDelayMs = 1200 + Math.floor(Math.random() * 501); // 1200-1700ms
        setTimeoutSafely(() => {
          launchViewer().catch((launchError) => {
            console.error("[MangaViewer] onPageLoad: error launching viewer:", launchError);
          });
        }, autoLaunchDelayMs);
      }
    } catch (error) {
      console.error("[MangaViewer] onPageLoad: unexpected error:", error);
    }
  }

  // ページ読み込み完了時に処理を実行
  try {
    if (document.readyState === "loading") {
      addEventListenerSafely(document, "DOMContentLoaded", onPageLoad);
    } else {
      onPageLoad();
    }
  } catch (error) {
    console.error("[MangaViewer] Page load setup error:", error);
  }

  // ページアンロード時のクリーンアップ
  try {
    addEventListenerSafely(window, "beforeunload", () => {
      // GlassControlPanelを破棄
      if (globalState.controlPanel) {
        globalState.controlPanel.destroy();
        globalState.controlPanel = null;
      }
      cleanupResources();
    });
  } catch (error) {
    console.error("[MangaViewer] Unload setup error:", error);
  }
})();
