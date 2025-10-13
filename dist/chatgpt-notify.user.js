// ==UserScript==
// @name         chat-gpt-notify
// @namespace    chatGptNotify
// @version      2.1.1
// @author       roflsunriz
// @description  Notify when ChatGPT generation is complete.
// @license      MIT
// @icon         https://chat.openai.com/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/chatgpt-notify.user.js
// @updateURL    https://raw.githubusercontent.com/roflsunriz/web-page-enhancement-scripts/refs/heads/main/dist/chatgpt-notify.meta.js
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chat.com/*
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const r="settings",h={showNotification:true,playSound:false,soundVolume:.5,customSoundUrl:""};function p(){const M=GM_getValue(r,{});return {...h,...M}}const S=M=>{GM_setValue(r,M);},C="https://chat.openai.com/favicon.ico",Q="https://example.com/sound.mp3",m={favicon:C,soundSample:Q};function w(M){M.showNotification&&(GM_notification({text:"生成が完了しました！",title:"ChatGPT 完了通知",image:m.favicon}),M.playSound&&y(M));}function y(M){try{const t=new Audio;t.volume=M.soundVolume,t.src=M.customSoundUrl||"data:audio/mp3;base64,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zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQZPYPAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAATMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM";const A=t.play();A!==void 0&&A.catch(z=>{console.error("音の再生に失敗しました:",z),console.log("\x07");});}catch(t){console.error("音声の初期化に失敗しました:",t);}}const G={goodResponseButton:'[data-testid="good-response-turn-action-button"]'},T=new MutationObserver(M=>{for(const t of M)for(let A=0;A<t.addedNodes.length;A++){const z=t.addedNodes[A];if(z instanceof HTMLElement&&z.querySelector(G.goodResponseButton)){b?.();return}}});let b=null;function U(M){b=M,T.observe(document.body,{childList:true,subtree:true});}const u="chatgpt-notification-settings-container";function L(){const M=document.getElementById(u);if(M){M.style.display="block";return}const t=p(),A=document.createElement("div");A.id=u;const z=A.attachShadow({mode:"closed"});z.innerHTML=`
    <style>
      .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      .modal-content { background-color: white; border-radius: 8px; padding: 20px; width: 400px; max-width: 90%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); color: #333; position: relative; }
      .title { margin-top: 0; margin-bottom: 16px; font-size: 1.5em; font-weight: 600; }
      .setting-item { margin-bottom: 16px; }
      .setting-label { margin-bottom: 4px; }
      .checkbox-label { margin-left: 8px; }
      .text-input { width: 100%; padding: 6px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
      .slider { width: 100%; }
      .button-container { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
      .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
      .cancel-button { background-color: #f1f1f1; }
      .save-button { background-color: #10a37f; color: white; }
      .close-button { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: #333; }
      .success-text { color: #10a37f; margin-right: auto; }
    </style>
    <div class="modal">
      <div class="modal-content">
        <button class="close-button">&times;</button>
        <h2 class="title">ChatGPT 完了通知 - 設定</h2>
        
        <div class="setting-item">
          <input type="checkbox" id="notification-enabled">
          <label for="notification-enabled" class="checkbox-label">通知を有効にする</label>
        </div>
        
        <div class="setting-item">
          <input type="checkbox" id="sound-enabled">
          <label for="sound-enabled" class="checkbox-label">完了時に音を鳴らす</label>
        </div>
        
        <div class="setting-item">
          <div class="setting-label" id="volume-label">音量: </div>
          <input type="range" class="slider" id="sound-volume" min="0" max="1" step="0.1">
        </div>
        
        <div class="setting-item">
          <div class="setting-label">カスタム通知音URL（空白の場合はデフォルト）</div>
          <input type="text" class="text-input" id="custom-sound" placeholder="${m.soundSample}">
        </div>
        
        <div class="button-container">
          <span class="success-text"></span>
          <button class="button cancel-button">キャンセル</button>
          <button class="button save-button">保存</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(A);const i=z.querySelector(".modal"),v=z.querySelector(".close-button"),g=z.querySelector(".cancel-button"),f=z.querySelector(".save-button"),s=z.querySelector(".success-text"),c=z.getElementById("notification-enabled"),a=z.getElementById("sound-enabled"),o=z.getElementById("sound-volume"),x=z.getElementById("volume-label"),l=z.getElementById("custom-sound"),n=()=>{A.style.display="none",s.textContent="";},d=()=>{x.textContent=`音量: ${o.value}`;},I=e=>{c.checked=e.showNotification,a.checked=e.playSound,o.value=String(e.soundVolume),l.value=e.customSoundUrl,d();},E=()=>{const e={showNotification:c.checked,playSound:a.checked,soundVolume:parseFloat(o.value),customSoundUrl:l.value.trim()};S(e),s.textContent="保存しました！",setTimeout(n,1e3);};i.addEventListener("click",e=>{e.target===i&&n();}),v.addEventListener("click",n),g.addEventListener("click",n),f.addEventListener("click",E),o.addEventListener("input",d),I(t);}function k(){U(()=>{const t=p();w(t);}),GM_registerMenuCommand("設定",L);}k();

})();