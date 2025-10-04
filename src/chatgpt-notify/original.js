// ==UserScript==
// @name         ChatGPT 生成完了通知
// @namespace    chatgpt-generation-complete
// @version      1.2
// @description  ChatGPT の回答生成が完了したらプッシュ通知でお知らせ
// @author       roflsunriz
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chat.com/*
// @icon         https://chat.openai.com/favicon.ico
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @updateURL    https://gist.githubusercontent.com/roflsunriz/e25a22c9a45a80266f22515594060bb3/raw/chatgpt-generation-complete.user.js
// @downloadURL  https://gist.githubusercontent.com/roflsunriz/e25a22c9a45a80266f22515594060bb3/raw/chatgpt-generation-complete.user.js
// ==/UserScript==

(async function () {
  "use strict";

  // ------------------------------
  // 0. 設定と初期化
  // ------------------------------
  // デフォルト設定
  const DEFAULT_SETTINGS = {
    showNotification: true,     // 通知を表示するかどうか
    playSound: false,           // 完了時に音を鳴らすかどうか
    soundVolume: 0.5,           // 音量 (0.0 - 1.0)
    customSoundUrl: "",         // カスタム通知音のURL
  };

  // 設定の読み込み
  let settings = GM_getValue("settings", DEFAULT_SETTINGS);

  // 不足しているプロパティがあれば初期値で補完
  settings = { ...DEFAULT_SETTINGS, ...settings };

  // ------------------------------
  // 1. 通知を送る関数
  // ------------------------------
  function sendNotification() {
    // 設定で通知が無効になっている場合は何もしない
    if (!settings.showNotification) return;

    GM_notification({
      text: "生成が完了しました！",
      title: "ChatGPT 完了通知",
      image: "https://chat.openai.com/favicon.ico"
    });

    // 音を鳴らす設定がオンの場合
    if (settings.playSound) {
      try {
        const audio = new Audio();
        audio.volume = settings.soundVolume;
        
        // カスタム音源が設定されていればそれを使用、なければBase64エンコードされた短い音声データを使う
        if (settings.customSoundUrl) {
          audio.src = settings.customSoundUrl;
        } else {
          // 短いビープ音のBase64エンコード（MP3形式）- CORSの問題を回避
          audio.src = "data:audio/mp3;base64,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zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQZPYPAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAATMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM";
        }
        
        // 音声再生の処理をPromiseでラップ
        const playPromise = audio.play();
        
        // Promiseが利用可能ならエラーハンドリング
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("音の再生に失敗しました:", e);
            // 代替手段としてコンソールでビープ音
            console.log('\x07');
          });
        }
      } catch (e) {
        console.error("音声の初期化に失敗しました:", e);
      }
    }
  }

  // ------------------------------
  // 2. DOM 監視ロジック
  // ------------------------------
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          // 終端要素が追加されたら終端と判断
          if (
            node.querySelector('[data-testid="good-response-turn-action-button"]')
          ) {
            sendNotification();
            return; // 一度通知したらここで終了
          }
        }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // ------------------------------
  // 3. 設定UIの作成（シャドウDOM版）
  // ------------------------------
  function createSettingsUI() {
    // すでに存在する場合は表示するだけ
    const existingContainer = document.getElementById("chatgpt-notification-settings-container");
    if (existingContainer) {
      existingContainer.style.display = "block";
      return;
    }

    // シャドウDOMコンテナの作成
    const container = document.createElement("div");
    container.id = "chatgpt-notification-settings-container";
    
    // シャドウルートの作成
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    // スタイルの定義
    const style = document.createElement("style");
    style.textContent = `
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      .modal-content {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        color: #333;
        position: relative;
      }
      
      .title {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 1.5em;
        font-weight: 600;
      }
      
      .setting-item {
        margin-bottom: 16px;
      }
      
      .setting-label {
        margin-bottom: 4px;
      }
      
      .checkbox-label {
        margin-left: 8px;
      }
      
      .text-input {
        width: 100%;
        padding: 6px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      
      .slider {
        width: 100%;
      }
      
      .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      
      .button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .cancel-button {
        background-color: #f1f1f1;
      }
      
      .save-button {
        background-color: #10a37f;
        color: white;
      }
      
      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #333;
      }
      
      .success-text {
        color: #10a37f;
        margin-right: 10px;
      }
    `;

    // モーダルコンテナ
    const modal = document.createElement("div");
    modal.className = "modal";

    // モーダルコンテンツ
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // タイトル
    const title = document.createElement("h2");
    title.textContent = "ChatGPT 完了通知 - 設定";
    title.className = "title";

    modalContent.appendChild(title);

    // 設定項目の作成
    const createCheckbox = (id, label, checked) => {
      const container = document.createElement("div");
      container.className = "setting-item";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = checked;
      
      const labelEl = document.createElement("label");
      labelEl.htmlFor = id;
      labelEl.textContent = label;
      labelEl.className = "checkbox-label";
      
      container.appendChild(checkbox);
      container.appendChild(labelEl);
      return container;
    };

    const createSlider = (id, label, value, min, max, step) => {
      const container = document.createElement("div");
      container.className = "setting-item";
      
      const labelText = document.createElement("div");
      labelText.textContent = `${label}: ${value}`;
      labelText.className = "setting-label";
      
      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "slider";
      slider.id = id;
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = value;
      
      slider.addEventListener("input", () => {
        labelText.textContent = `${label}: ${slider.value}`;
      });
      
      container.appendChild(labelText);
      container.appendChild(slider);
      return container;
    };

    const createTextInput = (id, label, value, placeholder) => {
      const container = document.createElement("div");
      container.className = "setting-item";
      
      const labelEl = document.createElement("div");
      labelEl.textContent = label;
      labelEl.className = "setting-label";
      
      const input = document.createElement("input");
      input.type = "text";
      input.className = "text-input";
      input.id = id;
      input.value = value;
      input.placeholder = placeholder;
      
      container.appendChild(labelEl);
      container.appendChild(input);
      return container;
    };

    // 設定項目の追加
    const notificationSetting = createCheckbox("notification-enabled", "通知を有効にする", settings.showNotification);
    const soundSetting = createCheckbox("sound-enabled", "完了時に音を鳴らす", settings.playSound);
    const volumeSetting = createSlider("sound-volume", "音量", settings.soundVolume, 0, 1, 0.1);
    const customSoundSetting = createTextInput("custom-sound", "カスタム通知音URL（空白の場合はデフォルト）", settings.customSoundUrl, "https://example.com/sound.mp3");

    modalContent.appendChild(notificationSetting);
    modalContent.appendChild(soundSetting);
    modalContent.appendChild(volumeSetting);
    modalContent.appendChild(customSoundSetting);

    // ボタン用コンテナ
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // キャンセルボタン
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "キャンセル";
    cancelButton.className = "button cancel-button";
    cancelButton.addEventListener("click", () => {
      container.style.display = "none";
    });

    // 保存ボタン
    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.className = "button save-button";
    saveButton.addEventListener("click", () => {
      // 設定値の取得（シャドウDOM内の要素を取得）
      settings.showNotification = shadowRoot.getElementById("notification-enabled").checked;
      settings.playSound = shadowRoot.getElementById("sound-enabled").checked;
      settings.soundVolume = parseFloat(shadowRoot.getElementById("sound-volume").value);
      settings.customSoundUrl = shadowRoot.getElementById("custom-sound").value.trim();
      
      // 設定の保存
      GM_setValue("settings", settings);
      
      // 保存完了のフィードバック
      const savedText = document.createElement("span");
      savedText.textContent = "保存しました！";
      savedText.className = "success-text";
      buttonContainer.insertBefore(savedText, cancelButton);
      
      // 少し経ったら閉じる
      setTimeout(() => {
        container.style.display = "none";
      }, 1000);
    });

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);
    modalContent.appendChild(buttonContainer);

    // 閉じるボタン（右上の×）
    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.className = "close-button";
    closeButton.addEventListener("click", () => {
      container.style.display = "none";
    });

    // モーダルの外側をクリックで閉じる
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        container.style.display = "none";
      }
    });

    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    
    // シャドウDOMに要素を追加
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(modal);
    
    // DOMに追加
    document.body.appendChild(container);
  }

  // ------------------------------
  // 4. Tampermonkeyメニューに設定を追加
  // ------------------------------
  GM_registerMenuCommand("設定", createSettingsUI);
  
})();
