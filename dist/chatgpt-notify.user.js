// ==UserScript==
// @name         chat-gpt-notify
// @namespace    chatGptNotify
// @version      2.2.0
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

  const p="settings",x={showNotification:true,playSound:false,soundVolume:.5,customSoundUrl:""};function T(){const t=GM_getValue(p,{});return {...x,...t}}const G=t=>{GM_setValue(p,t);},y="https://chat.openai.com/favicon.ico",I="https://example.com/sound.mp3",L={favicon:y,soundSample:I},U=new Set(["ar","ur"]);function E(t){return U.has(t)?"rtl":"ltr"}function w(t,n){return t.replace(/\{([a-zA-Z0-9_]+)\}/g,(z,M)=>{const c=n[M];return c===void 0?z:String(c)})}function N(t){const n=Object.keys(t.translations);let z=t.defaultLocale;const M=e=>{const o=e.toLowerCase(),a=t.aliases?.[o];if(a)return a;const A=n.find(l=>l.toLowerCase()===o);if(A)return A;const u=o.split("-")[0];return n.find(l=>l.toLowerCase().split("-")[0]===u)??null},c=()=>{const e=navigator.languages.length>0?navigator.languages:[navigator.language];for(const o of e){const a=M(o);if(a)return a}return t.fallbackLocale},r=e=>{const o=t.translations[z]?.[e];if(o)return o;const a=t.translations[t.fallbackLocale]?.[e];return a||(t.translations[t.defaultLocale]?.[e]??e)};return {locales:n,getLocale:()=>z,setLocale:e=>{z=e;},detectBrowserLocale:c,t:r,format:(e,o)=>w(r(e),o),getTranslations:(e=z)=>t.translations[e]??t.translations[t.fallbackLocale],getDirection:(e=z)=>E(e),getMissingTranslationKeys:e=>{const o=t.translations[t.fallbackLocale],a=t.translations[e];return Object.keys(o).filter(A=>!a[A])}}}const P={ja:{settings:"設定",settingsTitle:"ChatGPT 完了通知 - 設定",enableNotification:"通知を有効にする",playSoundOnComplete:"完了時に音を鳴らす",volumeLabel:"音量",customSoundUrlLabel:"カスタム通知音URL（空白の場合はデフォルト）",cancel:"キャンセル",save:"保存",saved:"保存しました！",notificationTitle:"ChatGPT 完了通知",notificationText:"生成が完了しました！"},en:{settings:"Settings",settingsTitle:"ChatGPT Completion Notification - Settings",enableNotification:"Enable notifications",playSoundOnComplete:"Play sound when complete",volumeLabel:"Volume",customSoundUrlLabel:"Custom notification sound URL (default if blank)",cancel:"Cancel",save:"Save",saved:"Saved!",notificationTitle:"ChatGPT Completion Notification",notificationText:"Generation is complete!"},"zh-Hans":{settings:"设置",settingsTitle:"ChatGPT 完成通知 - 设置",enableNotification:"启用通知",playSoundOnComplete:"完成时播放声音",volumeLabel:"音量",customSoundUrlLabel:"自定义通知音 URL（留空则使用默认）",cancel:"取消",save:"保存",saved:"已保存！",notificationTitle:"ChatGPT 完成通知",notificationText:"生成已完成！"},hi:{settings:"सेटिंग्स",settingsTitle:"ChatGPT पूर्णता सूचना - सेटिंग्स",enableNotification:"सूचनाएं सक्षम करें",playSoundOnComplete:"पूरा होने पर ध्वनि चलाएं",volumeLabel:"वॉल्यूम",customSoundUrlLabel:"कस्टम सूचना ध्वनि URL (खाली हो तो डिफॉल्ट)",cancel:"रद्द करें",save:"सहेजें",saved:"सहेजा गया!",notificationTitle:"ChatGPT पूर्णता सूचना",notificationText:"जनरेशन पूरी हो गई!"},es:{settings:"Configuracion",settingsTitle:"Notificacion de finalizacion de ChatGPT - Configuracion",enableNotification:"Activar notificaciones",playSoundOnComplete:"Reproducir sonido al finalizar",volumeLabel:"Volumen",customSoundUrlLabel:"URL de sonido de notificacion personalizado (predeterminado si esta vacio)",cancel:"Cancelar",save:"Guardar",saved:"Guardado!",notificationTitle:"Notificacion de finalizacion de ChatGPT",notificationText:"La generacion ha finalizado!"},fr:{settings:"Parametres",settingsTitle:"Notification de fin ChatGPT - Parametres",enableNotification:"Activer les notifications",playSoundOnComplete:"Jouer un son a la fin",volumeLabel:"Volume",customSoundUrlLabel:"URL du son de notification personnalise (par defaut si vide)",cancel:"Annuler",save:"Enregistrer",saved:"Enregistre!",notificationTitle:"Notification de fin ChatGPT",notificationText:"La generation est terminee!"},ar:{settings:"الإعدادات",settingsTitle:"إشعار اكتمال ChatGPT - الإعدادات",enableNotification:"تفعيل الإشعارات",playSoundOnComplete:"تشغيل صوت عند الاكتمال",volumeLabel:"مستوى الصوت",customSoundUrlLabel:"رابط صوت إشعار مخصص (الافتراضي عند تركه فارغا)",cancel:"إلغاء",save:"حفظ",saved:"تم الحفظ!",notificationTitle:"إشعار اكتمال ChatGPT",notificationText:"اكتمل التوليد!"},pt:{settings:"Configuracoes",settingsTitle:"Notificacao de conclusao do ChatGPT - Configuracoes",enableNotification:"Ativar notificacoes",playSoundOnComplete:"Tocar som ao concluir",volumeLabel:"Volume",customSoundUrlLabel:"URL de som de notificacao personalizada (padrao se vazio)",cancel:"Cancelar",save:"Salvar",saved:"Salvo!",notificationTitle:"Notificacao de conclusao do ChatGPT",notificationText:"A geracao foi concluida!"},bn:{settings:"সেটিংস",settingsTitle:"ChatGPT সম্পন্ন通知 - সেটিংস",enableNotification:"নোটিফিকেশন চালু করুন",playSoundOnComplete:"শেষ হলে শব্দ বাজান",volumeLabel:"ভলিউম",customSoundUrlLabel:"কাস্টম নোটিফিকেশন শব্দ URL (ফাঁকা থাকলে ডিফল্ট)",cancel:"বাতিল",save:"সংরক্ষণ",saved:"সংরক্ষিত!",notificationTitle:"ChatGPT সম্পন্ন通知",notificationText:"জেনারেশন সম্পন্ন হয়েছে!"},ru:{settings:"Настройки",settingsTitle:"Уведомление о завершении ChatGPT - Настройки",enableNotification:"Включить уведомления",playSoundOnComplete:"Воспроизводить звук при завершении",volumeLabel:"Громкость",customSoundUrlLabel:"URL пользовательского звука уведомления (по умолчанию, если пусто)",cancel:"Отмена",save:"Сохранить",saved:"Сохранено!",notificationTitle:"Уведомление о завершении ChatGPT",notificationText:"Генерация завершена!"},ur:{settings:"ترتیبات",settingsTitle:"ChatGPT مکمل ہونے کی اطلاع - ترتیبات",enableNotification:"اطلاعات فعال کریں",playSoundOnComplete:"مکمل ہونے پر آواز چلائیں",volumeLabel:"آواز",customSoundUrlLabel:"کسٹم اطلاع آواز URL (خالی ہو تو ڈیفالٹ)",cancel:"منسوخ",save:"محفوظ کریں",saved:"محفوظ ہو گیا!",notificationTitle:"ChatGPT مکمل ہونے کی اطلاع",notificationText:"جنریشن مکمل ہو گئی!"}},d=N({translations:P,defaultLocale:"ja",fallbackLocale:"en",aliases:{zh:"zh-Hans","zh-cn":"zh-Hans","zh-sg":"zh-Hans"}});d.setLocale(d.detectBrowserLocale());const i=d.t,Q=d.getDirection;function k(t){t.showNotification&&(GM_notification({text:i("notificationText"),title:i("notificationTitle"),image:L.favicon}),t.playSound&&D(t));}function D(t){try{const n=new Audio;n.volume=t.soundVolume,n.src=t.customSoundUrl||"data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD09PT09PUVFRUVFRVJSUlJSUmBgYGBgYG1tbW1tbXt7e3t7e4qKioqKipycnJycnKysrKysrLy8vLy8vNLS0tLS0uDg4ODg4O/v7+/v7/////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/D+PimYavV8elKUpT5fqx5VjV6vZ38eJR48eRKa9KUp7v396UgPHkQwMAAAAAA//8MAOp39CECAAhlIEEIIECBAgTT1oj///tEQYT0wgEIYxgDC09aIiE7u7u7uIiIz+LtoIQGE/+XAGYLjpTAIOGYYy0ZACgTj3+8FQoDXTx6w7uvG3HwP8FwkNex7vWqWS6SQA4UFwkPZb8GO1F4v5QQjistR4NVROI4LhxCczp6ottR04V7cweP5QQjistkdORYLhxGZHkOOi0dF07LffI8HeZHkONi0daOC8ZGRF3mRxC9oHnyU+V/z6WF4vF4vF5jeQ43DhXl+mpZcqiW7FAuF0DhUi8Xi8Xl0y3FzGMYsKKJ4vF4vF4vKCN59Vh4vF4vF4vGV5zjwR4IAIBWWkAAACnDIDAYDAYDAAAAAAGEwmCnRmwmEwQMWDPFZDNULjyrj6AAAQBG1Zu4jJuJ9MMUCwW3+v3EzEL0MfIiXhJDiGRg9vldANAAAAACNCEFYfcFs6DAszgAACBKJIAAAA//7kmQLgAQyZFxvPWAENcVKXeK0ABAk2WFMaSNIzBMptBYJtgBBIDAYAYLpMEiw80PV087n/QGP/rIM4/MC12PG/F0pSqNUE5v/iw5TPfLVAQlAQQAAAAAD/+cJJklZ6G8v+31qADCQDGErAAgwMnTtBUJTCZLGK7iSGR0GOh7FNcHQ/HQZYgzLQXFJgLgNNBcNiM6EDUQByQifgIIAAAEAAAAADQVSxvHX/7/MCDwGAAAAAPMpIi8Z0MZ24i5swIf/6+MRnBaDXbf/7v5iXvpfa8eRaAYIAAAAAH//5ghLGo8k8v+3/1IACAw6AoIIAEcOMm8CJMQgKXHZ3JgIowR1UQdGIrHQYYWuI7HQXCZgLiNNJcd4MaMQUCBEPSLAQcAAABD/+7+n/1CAEAAAAKvMpIi8Z0MZ2Yi5swIf/6+Mf/4U5pAwiUPwD3f/7n5NH75f6xlAQQAAAAAA//t0ZCwAQchN0WslbGI5hspNUqmJ8AAAH+AAAAIAQAH+AAAAQMSQQhP/9/9CADCGAAGDMNxkQhUMJkwEXbEAfOChF1wJNHSTEzVCQxExTMxMQjGI0zTEk3HTDzExTMTmZTMzMf/+xBE4APIjPdHrKTxwAAA/wAAABBzE1VGMZTnA6ZqrMYynP/+5JkEQPELGRbAyYqcDoGOj1hBY4QRP1ZDBmpwOGZazGDNT+TE5m9MiLpftp/wzMzMzMzMzIxlQ/YzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQZPIPAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAATMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//sQZPYPAAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAATMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM";const z=n.play();z!==void 0&&z.catch(M=>{console.error("音の再生に失敗しました:",M),console.log("\x07");});}catch(n){console.error("音声の初期化に失敗しました:",n);}}const R={goodResponseButton:'[data-testid="good-response-turn-action-button"]'},B=new MutationObserver(t=>{for(const n of t)for(let z=0;z<n.addedNodes.length;z++){const M=n.addedNodes[z];if(M instanceof HTMLElement&&M.querySelector(R.goodResponseButton)){C?.();return}}});let C=null;function O(t){C=t,B.observe(document.body,{childList:true,subtree:true});}const v="chatgpt-notification-settings-container";function F(){const t=document.getElementById(v);if(t){t.style.display="block";return}const n=T(),z=document.createElement("div");z.id=v;const M=z.attachShadow({mode:"closed"});M.innerHTML=`
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
    <div class="modal" dir="${Q()}">
      <div class="modal-content">
        <button class="close-button">&times;</button>
        <h2 class="title">${i("settingsTitle")}</h2>
        
        <div class="setting-item">
          <input type="checkbox" id="notification-enabled">
          <label for="notification-enabled" class="checkbox-label">${i("enableNotification")}</label>
        </div>
        
        <div class="setting-item">
          <input type="checkbox" id="sound-enabled">
          <label for="sound-enabled" class="checkbox-label">${i("playSoundOnComplete")}</label>
        </div>
        
        <div class="setting-item">
          <div class="setting-label" id="volume-label">${i("volumeLabel")}: </div>
          <input type="range" class="slider" id="sound-volume" min="0" max="1" step="0.1">
        </div>
        
        <div class="setting-item">
          <div class="setting-label">${i("customSoundUrlLabel")}</div>
          <input type="text" class="text-input" id="custom-sound" placeholder="${L.soundSample}">
        </div>
        
        <div class="button-container">
          <span class="success-text"></span>
          <button class="button cancel-button">${i("cancel")}</button>
          <button class="button save-button">${i("save")}</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(z);const c=M.querySelector(".modal"),r=M.querySelector(".close-button"),m=M.querySelector(".cancel-button"),g=M.querySelector(".save-button"),f=M.querySelector(".success-text"),e=M.getElementById("notification-enabled"),o=M.getElementById("sound-enabled"),a=M.getElementById("sound-volume"),A=M.getElementById("volume-label"),u=M.getElementById("custom-sound"),l=()=>{z.style.display="none",f.textContent="";},b=()=>{A.textContent=`${i("volumeLabel")}: ${a.value}`;},h=s=>{e.checked=s.showNotification,o.checked=s.playSound,a.value=String(s.soundVolume),u.value=s.customSoundUrl,b();},S=()=>{const s={showNotification:e.checked,playSound:o.checked,soundVolume:parseFloat(a.value),customSoundUrl:u.value.trim()};G(s),f.textContent=i("saved"),setTimeout(l,1e3);};c.addEventListener("click",s=>{s.target===c&&l();}),r.addEventListener("click",l),m.addEventListener("click",l),g.addEventListener("click",S),a.addEventListener("input",b),h(n);}function Y(){O(()=>{const n=T();k(n);}),GM_registerMenuCommand(i("settings"),F);}Y();

})();